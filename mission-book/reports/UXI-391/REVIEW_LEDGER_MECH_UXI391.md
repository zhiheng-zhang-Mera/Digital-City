# REVIEW LEDGER — Mech, UXI-391 (living document; the basis of the final review_result)

```text
REVIEW HOST   = Mech (Mega-rep / 172.31.12.151)
REVIEWED HEAD = 269aa969a285b78283ed6f7bd3b0cf432cfdcbd9   (recorded head == origin branch tip)
CLAIMED       = 2026-10-03T01:21:18Z after 13/13 exact-head reconciliation
STATUS        = review IN PROGRESS. Every "MET" below is MY measurement, not a restatement of the author's.
```

## The twelve gates, with evidence and who measured it

| # | gate | verdict | evidence (all independent measurements unless stated) |
|---|---|---|---|
| 1 | wrong premise has an append-only correction | **MET** | `ERRATUM_WRONG_PREMISE_CORRECTED.md` exists as its own file, and the original wrong fields are **still present** in the UXI-390 workbook (`development_uxi390_handoff_resolved_no_load_vector`, `development_uxi390_unknown_load_ineligible`), so history was corrected rather than rewritten. Its factual content is cross-confirmed by my own gate-2 measurements |
| 2 | five-dimensional load semantics consistent with code and tests | **MET** | mine, **PASS 20/20**: boundary inputs I chose (0% accepted as an observed zero, 100% inclusive, 101%/negative/string refused, memory guards, a gpu-only telemetry yields nothing); pressure semantics with my own numbers (partial naming, binding-not-averaging 0.9 vs 0.22, empty = UNKNOWN not idle, five dimensions); and a **live** node through the real pipeline |
| 3 | single-machine dual-node handoff E2E | **MET** | mine, **PASS 17/17** |
| 4 | an actual ownership transfer occurs | **MET** | mine, same run: `from=mech-a to=mech-b`, epoch 2, same task id, re-queued; and cross-host `from=dualhost-node-a to=mech-review-b`, epoch 2 (the node name used in that run — recorded exactly rather than tidied, because an earlier draft of this ledger wrote a name I had invented) |
| 5 | same task id continues on B and reaches terminal | **MET** | mine, same run: `COMPLETED` with `result={"waitedMs":6000}`, executor of record = the alternate |
| 6 | the result returns to the original surface | **MET** | mine, **PASS 9/9** in a real browser: one page instance, never reloaded, never re-pointed, showing the finished result; screenshot shows `WAIT Q-40f00d9a…` **COMPLETED** on the original Task Registry |
| 7 | Alien + Mech dual physical host final acceptance | **MET (both halves on record)** | my half ran over the real LAN and **PASSED 13/13** (`dualhost-b-by-mech.json`); the development host's half is its own record (`dualhost-host-a.json`). A re-run with my node named `Mech-test` is prepared and awaits the window |
| 8 | exact review-head CI | **MET** | run `37075869218` bound to exactly `269aa96`, on the right branch, both jobs success — resolved from GitHub by my instrument, not read from the field |
| 9 | Utopia main merge + main CI | **NOT MET — pending step 7** | step 7 has not been taken for UXI-391 |
| 10 | `REMOTE_HANDOFF_CLOSEOUT_REPAIRED` recorded | **NOT MET — pending step 7** | the marker is declared in the workbook's `terminal_marker` field but is not yet issued |
| 11 | `POST_COMPLETION_REENTRY.md` generated | **NOT MET — pending step 7** | the file does not exist; it is a step-7 deliverable, so this is sequencing rather than a gap |
| 12 | next executable merge workbook claimed, or typed zero-claim | **outcome determined, not yet recordable** | board verified: every other workbook is `REVIEW_COMPLETE`, frozen or `FINAL_PRODUCT_ACCEPTED`, and `XX-000` is the template with `execution_enabled: false`. **No other executable workbook exists**, so the required outcome is a typed zero-claim. It becomes recordable after step 7 |

## Negative controls I ran, none of them the author's

```text
no transfer occurs without a recorded decline
a dead holder's task stays NON-TERMINAL rather than being failed or faked
the run is never COMPLETED while no device executed it
a DUPLICATE decline does not transfer again or bump the epoch
work reserved for one device is NOT taken by a different live device
the RECOVERED original holder cannot re-take work that has moved away
no raw RS-290 scheduler token leaks (Android 6-tab sweep; Web final page; both clean)
```

## Corrections to my own record made during this review

Stated because a ledger that lists only successes is not a ledger.

- **Withdrawn finding.** I published that a recorded decline could be "silently dropped". Alien's Gateway event
  sequence shows A was still healthy at the decline instant, so the planner's `DIRECT` stage and the bridge's
  `NOT_APPLICABLE` were **correct**. Withdrawn in `CORRECTION_MECH_WITHDRAWING_THE_SILENT_DROP_FINDING.md`.
- **My instrument exited before terminal.** My earlier experiment's node left the City at `progress=36`, so the
  task never completed and the acceptance instance could not be resumed (interrupted work is not replayed).
  That was my fault; Alien diagnosed it precisely and I now carry that as precondition 2.
- **Three instrument faults, all mine, all fixed not worked around**: a locale assumption (the UI renders
  `在线`, not `ONLINE`), the missing precondition 1 (twice), and my instrument's own encoding damage from a
  PowerShell round-trip.

## What is left before the review can be signed

1. Re-run the cross-host half with my node named **`Mech-test`** once the development host's window is open.
2. Re-check gates 9–12 after step 7.
3. Write `review_result` and set `review_complete`.
