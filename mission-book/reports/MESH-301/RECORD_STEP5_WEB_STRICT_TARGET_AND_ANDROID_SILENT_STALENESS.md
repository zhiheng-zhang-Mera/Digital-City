# RECORD — MESH-301 step 5: the Web surface can strict-target, and one event the Android surface lost without saying so

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ d919dc7
```

## 1. The Web control surface can now issue a strictly targeted safe task

This was the missing half of boundary #2 and it is what **unblocks Mech**: the Mech host's control surface is
how the reverse direction (step 5.2, Mech → Alien) gets issued.

```text
apps/web: a target selector beside Run, built from the City's OWN node list ('Any node' preserved)
          Run submits POST /api/v0/actions with the target inside `input`, so the existing
          request fingerprint covers it - one key cannot mean two devices, replay does not re-execute
```

Measured from a real browser on the Alien host, driven by `scripts/mesh301-web-surface.mjs`:

```text
seq 266 CLIENT_CONNECTED {"clientRef":"web-798a9fal","clientLabel":"Alien Web"}
seq 267 COMMAND_ACCEPTED          <- issued by the BROWSER
seq 268 TASK_CREATED
seq 269 TASK_ASSIGNED  assignedNodeId=Mech-Win
seq 270 TASK_STARTED
seq 271 TASK_CHECKPOINTED progress=30
seq 272 TASK_CHECKPOINTED progress=75
seq 273 TASK_COMPLETED result={bytes:65, sha256:3a6c5918…}   targetStateAtCreation=ELIGIBLE
seq 274 CLIENT_DISCONNECTED / seq 275 CLIENT_CONNECTED       <- the deliberate offline/reconnect
```

So the Web half of "Web / Android 发起 strict-target safe task 的最小交互" is demonstrated, and the surface
identifies itself in canonical truth (D12/D14).

## 2. A two-real-surface convergence run that FAILED, and why that is the useful part

`Alien Web` (a real browser on the Alien host) and `PERM00` (the real Android device) observed the same
canonical stream while six tasks were issued. Against the server's own 5000 ms window, **every measured seq
converged**: browser 0–3 ms, Android 13–78 ms after the declared 592 ms clock-skew correction. And the run
still came back **FAILED**, on two counts. Both are worth more than the pass would have been.

### FAILURE 1 — the instrument's own defect (fixed)

```
seq 279 Alien Web: reconnected without re-reading the server; re-convergence is not evidenced
```

The script wrote its `reconnected` record with an `observedAt` but its `resync` record without one, so
`merge` could not see the re-convergence the surface had just performed and correctly refused to assume it.
Fixed. This is the **fifth** defect found in these instruments by running them rather than reading them, and
it is the same shape as the fourth: an instrument that fails for its own reasons is as useless as one that
cannot fail, because both teach a reviewer to stop believing the output.

### FAILURE 2 — a REAL defect in the Android surface (open, not fixed)

```
seq 233 PERM00: online surface never observed seq 233
```

The Android receipt covers `192..322` and is missing **exactly one** seq, `233`. The diagnosis is precise:

```text
resync records     192 (session start), 234
stale records      NONE
reconnected records NONE
```

A second `resync` at 234 is only written when the socket has reopened — so the socket **did** go away and come
back, while the receipt records **no `stale` and no `reconnected`**. The consequence is the one thing the
workbook explicitly forbids: **the surface was able to lose an event without recording that it had gone
away**, so for that moment its receipt says "online and watching" while it was neither. A surface that can be
silently stale is worse than one that is honestly offline, because nothing downstream can tell the difference.

Not fixed in this round, and deliberately not papered over: the cause is not yet established, so the Android
receipt cannot currently be treated as proof of convergence, and the run's verdict stays **FAILED**. The
instrument did its job — it caught the miss instead of averaging it away.

## 3. Completion-gate status

```text
 2  two real workers online ................. MET
 3  Android not a fake worker ............... MET
 4  Android strict-targets Alien and Mech ... MET
 5  Alien <-> Mech mutual strict target ..... HALF: Alien Web -> Mech-Win DONE (seq 267-273). The Mech host
                                                   now HAS the tool for the reverse; it needs Mech to press it.
 6  negative controls fail-honest ........... live City 8/8; reviewer must rebuild independently
 7  untargeted unregressed .................. MET
 8  three surfaces converge in the window ... NOT MET. Two REAL surfaces measured (browser + Android device);
                                                   Mech Web absent, AND the Android miss above must be resolved
                                                   before any convergence claim is honest.
 9  Android offline/reconnect re-converges ... NOT MET (same finding as 8)
10-14 Formal Review / CI / merge / marker / re-entry .... NOT STARTED
```

## 4. What Mech needs, precisely

```text
1. open the Web surface against http://172.31.3.110:4391, name it (localStorage 'utopia.clientLabel', or
   window.utopiaWebSurface.rename('Mech Web')), pick Alien-Win in the target selector, press Run
   -> that single action closes step 5.2 AND supplies the third surface for gate 8;
2. run scripts/mesh301-mesh-probe.mjs observe on the Mech host for the window it generates, and keep both
   receipts; and
3. rebuild the negative controls with its own values - step 6 asks for independent instruments, so Mech's
   are the review, not a duplicate of mine.
```


[阅读译本 / Reading translation](./zh-CN/RECORD_STEP5_WEB_STRICT_TARGET_AND_ANDROID_SILENT_STALENESS.md)
