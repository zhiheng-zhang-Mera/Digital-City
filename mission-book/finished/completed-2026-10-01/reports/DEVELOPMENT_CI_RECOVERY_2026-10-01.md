# Development CI recovery record — the five remaining Engineering/Assistant tasks (2026-10-01)

Host: Alien (Correction host). Purpose: record the resolved external seam for the five pool tasks whose
Development CI was refused by the GitHub account billing block, so their Correction eligibility is auditable.

## Verified facts (read from GitHub, not inferred)

Every recorded Development head is still the pushed branch tip, and the very run ID the workbook records as
`BLOCKED_GITHUB_ACCOUNT_BILLING` has since concluded **success** with both jobs executing real steps
(`gh run view <id> --json jobs`):

| Task | Branch | Development head | Run | Jobs | Conclusion |
| --- | --- | --- | --- | --- | --- |
| BA-007 | `assistant/BA-007-settings-interaction-surface` | `8fa4686bb7acb2b57a34a00fe517f6ecaad9769f` | 36752540378 | gateway-web 15 steps, android 12 steps | success |
| BA-009 | `assistant/BA-009-duty-permission-policy` | `9e1de31ba53766758406e991dbacdb8f707b1bfc` | 36750981300 | gateway-web 15 steps, android 12 steps | success |
| GAI-009 | `general-ai/GAI-009-utopia-surface-integration` | `8dfdf9edcf6f525797de964650b383a916271371` | 36753891511 | gateway-web 15 steps, android 12 steps | success |
| EM-012 | `engineering-manager/EM-012-connector-sdk-claude-workbuddy` | `364c5160952039d31074af3bfae843c1d0f4be24` | 36751919772 | gateway-web 15 steps, android 12 steps | success |
| EM-013 | `engineering-manager/EM-013-utopia-task-surface-integration` | `5920e8076d317e15142b7d16c8531e529ce587f0` | 36753243377 | gateway-web 15 steps, android 12 steps | success |

Each run was created 2026-09-30 17:23–17:47Z and finalised 2026-09-30 23:55Z, i.e. after the Owner cleared the
billing refusal. `git ls-remote origin` confirms each branch tip equals the recorded head SHA, so no rebase or
force-push has moved them.

## What is therefore stale in the mission-book

For all five tasks the workbook frontmatter still reads:

```text
development_status: IN_PROGRESS
development_complete: false
development_ci: <run-id>-BLOCKED_GITHUB_ACCOUNT_BILLING
correction_status: NOT_STARTED
```

The `-BLOCKED_GITHUB_ACCOUNT_BILLING` suffix described an external seam that no longer exists, and the
Development heads it blocked are verifiably green. The Development **CI** half of the eligibility condition is
met at the recorded head; the Development **stage declaration** (`development_status: COMPLETE`,
`development_complete: true`) is the Development host's (Mech's) to write and has not been written.

## Why Alien did not claim the five Corrections

`mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md` §2: *"Correction is eligible only after Development is
green/complete and only for the other physical host."* §3 adds that a claim commit *"must update only the target
stage fields"*. Alien may not write another host's stage truth: flipping `development_status`/
`development_complete` on a Mech branch would fabricate the Development host's declaration, which is exactly
what the two-host gate exists to prevent. Alien also did not touch any of the five branches (no push, no
force-push, no re-run of anything that would alter a head).

## Resolution (recorded after the fact)

Commit `da309a6 reconcile(control): close billing recovery state and record control-plane lag` closed the
Development stage for all five tasks on the control plane:

```text
development_status: COMPLETE
development_complete: true
development_ci: <run-id>-success-attempt-N     (same run IDs as the table above)
correction_status: NOT_STARTED
```

So the Development host's declaration exists, the seam is closed at both ends, and **all five Corrections
became eligible for the other host (Alien)**. No bookkeeping exception was needed and none was taken: Alien
wrote no Development field. The five tasks were then claimed and corrected one at a time, each with its own
report (`mission-book/reports/<ID>/CORRECTION_REPORT.md`) and its own tracking commit.

## Zero-claim telemetry at the moment of the scan (contract §5) — superseded by the resolution above

```text
classification:              TEMPORARILY_UNCLAIMABLE
claimable_now:               0
potentially_claimable_later: 5  (BA-007, BA-009, GAI-009, EM-012, EM-013)
reason:                      Development stage not declared complete by the Development host
external seam:               RESOLVED (hosted CI green at every recorded head)
blocked_on:                  Mech's Development completion declaration for these five tasks
```

Under contract §5 a `TEMPORARILY_UNCLAIMABLE` result permits a bounded re-entry scan (default cadence 20
minutes) rather than termination, because "another host completion ... can make work eligible later" — which
is exactly what happened: the control-plane reconcile arrived before this record was a minute old.

## The authority boundary this record captured

Alien could have written the five Development declarations itself and started earlier. It did not, because
`mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md` §2 makes Correction eligible "only after Development is
green/complete", and §3 requires a claim commit to "update only the target stage fields". Writing another
host's completion would have fabricated the Development host's declaration — the one thing the two-host gate
exists to prevent — even though every underlying fact (pushed head, green run, real steps) was verifiable and
verified here. The correct fix was the control plane's, and it arrived as `da309a6`.


## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_CI_RECOVERY_2026-10-01.md)
