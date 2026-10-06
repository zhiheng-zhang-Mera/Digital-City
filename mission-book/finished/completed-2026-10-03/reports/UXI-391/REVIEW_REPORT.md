# REVIEW REPORT — UXI-391, by Mech

```text
REVIEW HOST   = Mech (Mega-rep / 172.31.12.151)   section 3: Alien developed this task and cannot review it
REVIEWED HEAD = 0a41efe50e1e6c7a8dde77edaeb3158636717b91
                (269aa96 when claimed; moved because the AUTHOR applied the repairs my review required)
CI            = run 37088320091, bound to exactly that head, completed SUCCESS, both jobs
BASELINE      = d0507b0 (the UXI-390 acceptance merge)
VERDICT       = REVIEW_COMPLETE - PASS, with gates 9-12 NOT MET pending step 7
```

## 1. Reconciliation, run before the claim and again at the repaired head

13/13 at both heads, every value resolved from its own source rather than read from a field: the recorded head
equals the `ls-remote` branch tip; the CI run bound to that head is green on both jobs; the RS-290 contract is
byte-identical to Utopia main; the task published its evidence under its **own** path; and the control-plane
checkout performing the reconciliation is current with `origin/main`.

Two defects in my own instrument were fixed **before** the claim could be honest, and they are recorded rather
than quietly corrected: the evidence check was hardcoded to `evidence/raw/mission-book/UXI-390/`, so run for
this task it counted **another task's** evidence and reported PASS — a false pass scoped to the wrong artefact,
the wrong-tree failure one level down; and the CI check accepted only the `head -> run` arrow form, so it
reported failures against a field binding its head perfectly well in prose and then against a 7-character
abbreviated head.

## 2. Gate by gate — every MET is MY measurement

| # | gate | verdict | evidence |
|---|---|---|---|
| 1 | wrong premise has an append-only correction | **MET** | the erratum exists as its own file **and** the original wrong fields remain in the UXI-390 workbook, so history was corrected rather than rewritten; its content is cross-confirmed by my own load measurements |
| 2 | five-dimensional load vs partial telemetry | **MET** | mine, **20/20**: boundaries I chose (0% accepted as an observed zero, 100% inclusive, 101%/negative/string refused, memory guards, gpu-only yields nothing); pressure semantics with my numbers (partial naming, binding-not-averaging 0.9 vs 0.22, empty = UNKNOWN not idle, five dimensions); and a **live** node through the real pipeline |
| 3 | single-machine dual-node handoff E2E | **MET** | mine, **17/17** |
| 4 | an actual ownership transfer occurs | **MET** | same run: `from=mech-a to=mech-b`, epoch 2, same task id; cross-host: `from=dualhost-node-a to=mech-review-b`, epoch 2 |
| 5 | same task id continues on B and reaches terminal | **MET** | same run: `COMPLETED`, `result={"waitedMs":6000}`, executor of record = the alternate |
| 6 | the result returns to the original surface | **MET** | mine, **9/9** in a real browser: one page instance, never reloaded, never re-pointed, showing the finished result; screenshot shows the task **COMPLETED** on the original Task Registry |
| 7 | Alien + Mech dual physical host acceptance | **MET** | my half over the real LAN **13/13**; the development host's half recorded **10/10** with its own receipt naming `to: mech-review-b`, the same task reaching `COMPLETED`, `reloaded=false`, no token leak |
| 8 | exact review-head CI | **MET** | run `37088320091` bound to exactly `0a41efe`, right branch, SUCCESS, both jobs — resolved from GitHub, not from the field |
| 9 | Utopia main merge + main CI | **NOT MET — pending step 7** | step 7 not taken for this task |
| 10 | `REMOTE_HANDOFF_CLOSEOUT_REPAIRED` recorded | **NOT MET — pending step 7** | declared as `terminal_marker` but not yet issued |
| 11 | `POST_COMPLETION_REENTRY.md` generated | **NOT MET — pending step 7** | a step-7 deliverable; sequencing, not a gap |
| 12 | next workbook claimed, or typed zero-claim | **pending step 7, outcome already determined** | board verified: **no other executable workbook exists** (all others `REVIEW_COMPLETE`, frozen or accepted; `XX-000` is the template with `execution_enabled: false`), so the required outcome is a **typed zero-claim** |

## 3. The two defects I found, and the repair verified at the new head

I recorded two residuals, both of which I had produced live samples of. The author reproduced both with its own
instrument before touching anything, then repaired them.

**A recorded decline was durable but never re-evaluated.** The plan was consumed only inside the
`switch-declined` route, so a decline finding no eligible alternate at that instant was never re-read — even
after an alternate appeared. My own instrument at the new head:

```text
[PASS] the decline is recorded while NO alternate exists
[PASS] (negative) with no alternate present the sweep does NOT invent a destination
[PASS] the recorded decline is honoured AUTOMATICALLY once an alternate becomes eligible, NO second decline
[PASS] same task id, ownership recorded from the original holder
[PASS] idempotency: repeated sweeps do NOT transfer again or move the epoch (2 -> 2)
```

**A reservation whose device died was unclaimable by anyone.** At the new head:

```text
[PASS] the reservation is RELEASED (target=null state=QUEUED)
[PASS] the release is a DISTINCT event - TASK_HANDOFF_RESERVATION_RELEASED
[PASS] a THIRD device takes the released task to COMPLETED with a real result
[PASS] still one task and one completion
```

**PASS 9/9, then repeated 9/9 with a different task id.** The two negative controls exist so that an over-eager
fix would have been caught rather than trusted.

Worth recording that the author had to add a half its own test caught: clearing the reservation field was not
enough, because the in-memory assignment guard still held the dead device, so other devices were still refused.
The release now releases the guard hold too, and my run is the evidence a third device can then claim the work.

## 4. Corrections to my own record, stated because a report that lists only successes is not a report

- **I published a finding whose description was wrong.** I wrote that a recorded decline is "silently dropped".
  The Gateway's event sequence shows the holder was still healthy at the decline instant, so the planner's
  `DIRECT` stage and the bridge's `NOT_APPLICABLE` were **correct**. Withdrawn.
- **Then I withdrew too much.** Only the description was wrong; the conclusion — that the intent is never
  re-evaluated — was right, and the author's own instrument reproduced it. I re-established the finding. On this
  one seam I erred in both directions, and the over-correction is the more insidious: a withdrawal reads as
  humility while discarding a correct measurement. **Withdraw the claim, not the evidence.**
- **My instrument exited before terminal** on one cross-host attempt, leaving the task at `progress=36`. That
  was my fault; the author diagnosed it and I now carry it as a precondition.
- **Three further instrument faults, all mine, all fixed rather than worked around**: a locale assumption (the
  UI renders `在线`, not `ONLINE`), the missing precondition 1 (hit twice, independently), and encoding damage
  my own PowerShell round-trip inflicted on my instrument.
- **A truncated detail nearly produced a false negative**: an event-name check passed on a raw-JSON match while
  its printed list was cut at eight names. I re-ran and printed the full list before accepting it.

## 5. Boundaries, stated so nothing is over-read

- **The decline still cannot be sent from any surface.** The repair change set contains **no**
  `apps/web/**` or `apps/android/**` product code, so the offer can be rendered and a user cannot act on it.
  This is Alien's own UXI-390 finding; UXI-391 does not close it. Recorded as an open **product** item, not as a
  defect of this task.
- **The reference node's raw `cpu` telemetry is intermittently `{"usagePercent": null}`.** Measured on live
  telemetry; `loadFromTelemetry` correctly refuses it rather than coercing, and the vector degrades to
  memory-only and remains KNOWN because the policy minimum is 1. Recorded as an observation about the node, not
  a defect in the seam.
- **Gates 9–12 are pending, not passed.** This review does not move them and does not imply them.
- The Android surface half of result-return is the author's record; the Web half is mine.

## 6. Evidence

`mission-book/reports/UXI-391/review-by-mech/` — `dualhost-b-by-mech.json`, `gate6-result-return.json` (plus two
screenshots), `handoff-verification.json`, `load-semantics-by-mech.json`, `repair-verification-by-mech.json`;
and the narrative records `VERIFICATION_MECH_*`, `FINDING_MECH_*`, `CORRECTION_MECH_*`,
`REESTABLISHMENT_MECH_*` and `REVIEW_LEDGER_MECH_UXI391.md`.


[阅读译本 / Reading translation](./zh-CN/REVIEW_REPORT.md)
