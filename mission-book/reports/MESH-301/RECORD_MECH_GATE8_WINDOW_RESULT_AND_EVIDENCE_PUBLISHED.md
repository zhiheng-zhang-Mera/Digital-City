# RECORD — Mech: the gate-8 window is DONE, the Mech row converged 342/342 with a 17 ms worst case, and my receipts are published

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host)
CITY = http://172.31.3.110:4391  cityId 22e1216b-f124-4d4a-be4a-4a280558c027
PRODUCT UNDER MEASUREMENT = mesh/MESH-301-three-end @ f1eaad8
RE   = WINDOW_GATE8_THREE_SURFACE_OBSERVATION.md (Alien's declared window 03:42-03:54Z)
```

## 1. Slept through your window, and it was inside mine

```text
MY WINDOW OPENED    2026-10-03T03:35:44.844Z   canonical seq 515
MY WINDOW CLOSED    2026-10-03T03:58:48.930Z   canonical seq 857
DURATION            1384 s (23 min)
YOUR WINDOW         03:42:00Z - 03:54:00Z       fully contained in mine
```

I declared my window before yours arrived and did not shorten it; your declared interval sits entirely inside it,
so no re-run was needed and none was done. Mine is one continuous session — not two windows presented as one.

## 2. What the window contains, so it cannot converge vacuously

```text
1. UNTARGETED task                            Q-a2b51b38-…            gate 7 inside the same window
2. STRICT task targeted at Alien-Win          Q-f71f19fa-…            PC -> PC inside the same window
3. NODE_OFFLINE (seq 530) -> NODE_ONLINE (seq 534) of Mech-Win, with a strict task aimed at Mech-Win
   created WHILE it was away                  Q-382b81e0-…            step 5.3's offline/online event + gate 6
   restored: true
```

Plus everything the two hosts did on their own during those 23 minutes. `seq 515..857` is **343 canonical
events**, and every one of them is in the range my surface was watching.

## 3. The Mech row of the table, as the instrument returns it

```text
merge --window 5000 --skew Mech-Win-Web=-1012  <mech-web-gate8-window.jsonl>
-> CONVERGED     0 failures     0 unmeasured
   342 seqs CONVERGED   |   1 AFTER_OBSERVATION (the final seq, after the socket closed)
   515 BEFORE_OBSERVATION (seqs from before the window opened, not this surface's to observe)
   offset-free latency:  max 17 ms      p95 9 ms      against a 5000 ms window
   clock offset estimate for this window: -1012 ms  (it was -1001 ms forty minutes earlier: it drifts,
                                                      which is why it is re-estimated per window)
   timeline source: the SERVER's own event table (858 events), not the receipts' union
```

No seq inside the window was missed. Note what the offset column would have said without `--skew`: about
-1012 ms on **every** event, i.e. this surface observing the future — the false pass you closed.

## 4. Why I used the browser, not the probe you offered as the cheaper option

You offered `mesh301-mesh-probe.mjs observe --surface Mech-Win-Probe --maxMs 720000` and called it better
because it keeps a browser out of the measurement. **I deliberately used the browser instead**, and the reason is
gate 8's own words: the gate is about the three online *surfaces* (Alien Web, Mech Web, Android), and a probe is
not one of them.

Worse, I measured earlier that the probe's stream handshake passes no `clientRef`/`clientLabel`, so it registers
in canonical truth as `{"clientRef":null,"clientLabel":null}` — an anonymous stream client. A table whose Mech
row came from an unnamed probe would have three rows where one of them cannot be named in the City. The browser
row cost 23 minutes of an idle machine and is attributable: ref `web-mech-f8r3wwq7`, label `Mech-Win-Web`.

## 5. Independent negative controls, rebuilt with my own values — 11/11 PASS

Run inside the same window, so those events are in the table too:

```text
PASS  both real workers online before the control
PASS  an unknown but well-formed device -> REFUSED, TARGET_DEVICE_UNKNOWN, no task created
PASS  a malformed device id            -> REFUSED, TARGET_DEVICE_MALFORMED, not lumped in with UNKNOWN
PASS  a control SURFACE's label as a device (Mech-Win-Web) -> REFUSED, TARGET_DEVICE_UNKNOWN, no task
PASS  a retried identical instruction replays the SAME task and the same actionId, not a second execution
PASS  exactly one task exists for the replayed instruction
PASS  one idempotency key cannot be reused for a DIFFERENT device -> http 400 IDEMPOTENCY_KEY_REUSED
PASS  the refused reuse created no task aimed at the wrong device   (checked as a SET DIFFERENCE, see §7)
PASS  a strict task for Alien-Win is executed by Alien-Win and never by this host
PASS  three untargeted tasks are still scheduled and completed      (Alien-Win, Mech-Win, Alien-Win)
PASS  untargeted work is still taken by the two REAL workers only
```

**One control I chose not to build, with the reason recorded rather than left implicit:** the raw
`POST /api/v0/node/claim` attempt as the WRONG node is the most direct test of the claim guard, and it is the
only one that can do damage — a manual claim that picks up a QUEUED untargeted task assigns it to this host with
nothing to execute it, and a task stuck in `ASSIGNED` is a worse outcome than a control not run. The same
property is covered without that risk by the observation form above; the away-target form is covered by
`mech-mesh301-offline-target.mjs` (10/10).

## 6. I verified your repair of the two defects I reported, and it is correct

```text
T1  merge --file <jsonl>                              (no --skew)  -> INCOMPLETE, exit 1, per-seq UNMEASURED with
                                                                     "declare --skew Mech-Win-Web=0 to state the
                                                                      assumption explicitly"          <- FALSE PASS CLOSED
T2  merge --window 5000 --skew Mech-Win-Web=-1001 <jsonl>  (positional) -> CONVERGED, exit 0, no ENOENT
    per-seq: latencyMs 1..8   rawLatencyMs ~ -1000   declaredClockSkewMs -1001     <- skew applied, not ignored
T3  merge --window 5000 --skew Mech-Win-Web=0 --file <jsonl>            -> CONVERGED   <- the documented escape hatch
```

`--skew` with positional receipts used to hand the skew's value to `readFileSync`; it no longer does, and an
undeclared clock no longer scores as a pass. Both are fixed at `f1eaad8`, verified on my side.

## 7. Two things about the product I noted while doing this, neither of them a defect claim

1. **The Action route answers failures in two different envelopes.** A refused *target* comes back as **http 200
   with an Action whose `status` is `REFUSED`** and `action.error.code` set; an idempotency key reused for a
   different request comes back as **http 400 with a top-level `{error, errorCode}` and no Action at all**,
   because the refusal happens before an Action exists. That is defensible — there is nothing to persist — but a
   client must handle both, and **my first run of the suite handled only the first and scored a correct refusal
   as a FAIL**. My instrument defect, not the product's; fixed, and the fix is the `errCode()` helper in the
   published script. Recording it because the same misreading would produce a false defect report from anyone
   else writing a control against this route.
2. **City tasks carry no `idempotencyKey` field.** Their keys are `id`, `state`, `assignedNodeId`,
   `targetDeviceRef`, `targetIntentAt`, `targetStateAtCreation` and so on. A control that asks a *task* for the
   key it was created with gets `undefined` and passes **vacuously**, which is a check that cannot fail. Mine now
   measures the refusal as a set difference over the tasks targeted at the device. Same class as the merge's
   empty-timeline pass, and worth knowing before anyone writes the next control.

## 8. Where my receipts are — published, as you asked

```text
branch  evidence/MESH-301-mech-receipts   @ 54dad12   (NOT the development branch, so nothing of yours can collide)
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.jsonl   <- the Mech row, merge vocabulary
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.json    <- same session, readable summary
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-strict-target.jsonl  <- step 5.2 row
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-offline-target-negative-control.json
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-negative-controls.json
  evidence/raw/mission-book/MESH-301/review-by-mech/verify-merge-repair-*.json    <- the three outputs in §6
  mech-mesh301-*.mjs                                                              <- the instruments, so any of it can be re-run
```

The Mech row needs `--skew Mech-Win-Web=-1012` for THIS window. Merging it with Alien Web and Android over the
overlap is now a one-command job on your side; I have not assembled the three-surface table myself, because two
of its three rows are not mine to produce.

## 9. One thing to fix before review, flagged now rather than at the review

The workbook still reads `development_head_sha: d9a3bac…` while the branch tip is **`f1eaad8`**. §7 of the
standing rules is exact-head reconciliation, and gate 11 is exact-head CI — a review claimed against a head the
workbook does not name is exactly the mismatch that rule exists to prevent. Not asking you to change it now;
asking that it is correct at the moment `development_complete` becomes `true`, along with a green CI on that
exact sha.

## 10. What this does NOT establish

- **Not gate 8.** One surface's row, however clean, is not a three-surface table. Alien Web and Android must
  contribute their own rows over the overlap, and the offsets must be declared for each.
- **Not the Android row's provenance.** Still open from my earlier record: was the Android receipt written by the
  app on the device or by a script on the development host? Canonical truth cannot answer it.
- **Not a review.** No head released, `development_complete` still `false`, `review_host` still `null`. Gates
  10-14 are untouched, and this record does not move them.
