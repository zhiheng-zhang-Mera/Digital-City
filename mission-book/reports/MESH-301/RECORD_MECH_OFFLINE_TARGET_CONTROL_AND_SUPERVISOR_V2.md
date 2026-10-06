# RECORD — Mech: endpoint A can now be taken away and brought back on purpose, and the offline-target control reproduces 10/10 on my own worker

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host), Owner
CITY = http://172.31.3.110:4391  cityId 22e1216b-f124-4d4a-be4a-4a280558c027
MEASURED ON = mesh/MESH-301-three-end @ d919dc759f9a375ef8200b6bc7663aa8fa17852c
```

## 0. Declared outage window, so any anomaly inside it is attributable

```text
NODE_OFFLINE  Mech-Win   seq 493   2026-10-03T03:33:53.273Z
NODE_ONLINE   Mech-Win   seq 497   2026-10-03T03:34:11.013Z      total absence ~18s
```

If anything on the Alien host looked wrong about `Mech-Win` in that window, it was this control, not a fault.
Declared rather than left to be discovered, because the Owner asked both hosts to avoid stepping on each other.

## 1. The resident supervisor is v2: auto-restart, and a control file

Both changes come from the same defect in my own v1, which I hit while trying to prepare the review:

- **v1 had no restart.** If the worker child died, endpoint A was offline until a human noticed. Endpoint A
  being online is itself part of this task's evidence, so "the worker is up" was resting on luck. v2 brings a
  child back with a bounded backoff, and **stops saying nothing** when it gives up (it prints that the restart
  budget is exhausted instead of looping silently — a supervisor that loops forever without reporting is the
  same failure as no supervisor at all).
- **v1 could not take the worker away and put it back.** The workbook's negative controls require a targeted
  device that is genuinely away, and the only worker this host may take away is its own. Under v1 that meant
  killing a process with no way to start it again — an unrecoverable outage dressed up as a control. v2 reads
  `.runtime/mesh301-resident-control.json`: `{"shared":"down"}` stops the shared-City worker *deliberately*
  (no restart loop) and `{"shared":"up"}` brings it back. The file lives in `.runtime/` (git-ignored) and
  carries no credential.

The window was restarted onto v2 and verified before anything depended on it:

```text
visible console          title "Utopia City - Mech-Win (resident)"   HasWindow=True
local City               listening 172.31.12.151:4391
shared City              Alien-Win:true, Mech-Win:true
node identity after the bounce   1 node matching "Mech": id=Mech-Win principal=Mech-Win displayName=Mech-Win
```

That last line matters: a worker that is stopped and restarted must not come back as a **second** identity. It
did not — one `Mech-Win`, same principal. A duplicate node here would have quietly broken gate 2 (two distinct
real workers) for everyone.

## 2. The offline-target control, run by my own instrument, against my own worker

`mech-mesh301-offline-target.mjs` — mine, written from the workbook's requirement, not a copy of the
development host's `negative` probe. **10/10 PASS:**

```text
PASS  Mech-Win is online before the control
PASS  the City marks Mech-Win offline after the worker is stopped          (online=false after 10199ms)
PASS  a strict task for an AWAY device is created, not refused             (action QUEUED, taskId Q-f49b261a-…)
PASS  the task carries the target and records the target state at creation  (targetStateAtCreation=OFFLINE)
PASS  the online device Alien-Win does NOT take a task strictly targeted at the away device
                                                                           (assignedNodeId=null for 15s while Alien-Win was online)
PASS  canonical truth says WHY nothing moved (TASK_TARGET_WAITING with the target state)
PASS  Mech-Win returns to canonical truth as online                        (online=true after 3064ms)
PASS  ONLY the returning device claims and finishes it                     (assignedNodeId=Mech-Win, COMPLETED, sha256 c7f5c0ed…)
PASS  TASK_TARGET_READY fires on the device return, before the claim       (ready seq 498, assigned seq 499)
PASS  the Alien-Win node never claimed it anywhere in the timeline
```

Canonical truth, verbatim:

```text
seq 494 COMMAND_ACCEPTED   {}
seq 495 TASK_CREATED       {}
seq 496 TASK_TARGET_WAITING {"targetDeviceRef":"Mech-Win","targetState":"OFFLINE","reason":"TARGET_DEVICE_OFFLINE"}
seq 498 TASK_TARGET_READY   {"targetDeviceRef":"Mech-Win"}
seq 499 TASK_ASSIGNED       {"state":"ASSIGNED","assignedNodeId":"Mech-Win"}
seq 500 TASK_STARTED        {"state":"RUNNING"}
seq 501 TASK_CHECKPOINTED   30
seq 502 TASK_CHECKPOINTED   75   sha256 c7f5c0edce9e942c22505ed2b2d174442a1d1aa344a89685760fb065c720502e
seq 503 TASK_COMPLETED       100  {"bytes":65,"sha256":"c7f5c0ed…","cleaned":true}
```

`seq 497` is the `NODE_ONLINE` that made `seq 498` possible, and it is not in the task's own event thread —
worth noting, because the causal link is a *city-level* event, not a task-level one.

This independently reproduces Alien's recorded case (`strict task for an away device waits instead of
rerouting`) **on the other host, with the other host's worker, and with my own instrument** — which is what the
workbook's review section asks for. It is still **not** review evidence against a reviewed head, because no head
has been released for review; it is the instrument being proven to work before the review depends on it.

## 3. What this does NOT establish

- **Not Android's offline/reconnect (gate 9).** That is the Android device going away and coming back. Mine is a
  Windows worker doing so. Adjacent evidence, different gate.
- **Not bounded convergence.** This control measures state transitions, not observation latency; the clock-offset
  instrument is the one from my step-5.2 receipt.
- **Not a review verdict.** No head has been released; `development_complete` is still `false`.

## 4. Low-severity finding to carry into the review, recorded now so it is not a surprise later

`services/dev-gateway/server.mjs` and `pairing.mjs` **hard-code** `displayName: 'Utopia · Alien'`. Both Cities —
Alien's canonical one and my resident one — therefore introduce themselves by the same name:

```text
SHARED(Alien)  cityId 22e1216b-…  displayName "Utopia · Alien"
LOCAL(Mech)    cityId 0841938e-…  displayName "Utopia · Alien"
```

This is cosmetic and it is **not** a MESH-301 failure: `cityId` is the identity, it differs, and step 2 only
requires the three ends to read the *same* `cityId`. I am recording it because a human reading two City snapshots
side by side would reasonably conclude they are the same City, and because "which City am I attached to" is a
question this whole task turns on. Not asking for a change; noting where it could mislead.

## 5. Decisions

```text
MECH-D7   Restart the resident window to land a supervisor upgrade, rather than take the worker away under a
          supervisor that cannot put it back. The outage risk of the restart was smaller and better understood
          than the outage risk of a control I could not reverse.
MECH-D8   Keep the offline window as short as the control allows (~18s) and declare its exact seq bounds in
          mission-book immediately, because the other host is working against the same City right now and an
          unexplained NODE_OFFLINE on their side would cost them time.
MECH-D9   Put the restore in a `finally` block that runs unconditionally and re-checks the node's own state,
          instead of trusting the happy path. A control failure must not become an endpoint outage.
MECH-D10  Verify that a stop/restart does not produce a SECOND node identity, because "two distinct real
          workers" is gate 2 and a duplicate would corrupt it silently.
```

## 6. Evidence

```text
mech-mesh301-offline-target.mjs                                   the instrument (mine)
evidence/raw/mission-book/MESH-301/review-by-mech/mech-offline-target-negative-control.json
.runtime/tmp/mesh301-resident-city.mjs                            supervisor v2 (auto-restart + control file)
.runtime/mesh301-resident-control.json                            the control file (git-ignored, no credential)
```

Kept on this host for the same reason as before: `mesh/MESH-301-three-end` has one development owner, and
mixing a reviewer's raw evidence into it is the cross-host head collision the Owner asked both hosts to avoid.

## 7. State of endpoint A as of this record

```text
Mech-Win worker        online in the shared canonical City, heartbeat current
Mech-Win-Web surface   exercised at step 5.2; not left connected (a surface that is left open for no reason is
                       noise in controlSurfaces, and §5 of my previous record showed those entries are counted)
resident City          up on 172.31.12.151:4391, visible console window, desktop shortcut re-launches it
local worker           online in the resident City as well
```


[阅读译本 / Reading translation](./zh-CN/RECORD_MECH_OFFLINE_TARGET_CONTROL_AND_SUPERVISOR_V2.md)
