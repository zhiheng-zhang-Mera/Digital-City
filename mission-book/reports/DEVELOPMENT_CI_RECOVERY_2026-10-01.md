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

## Zero-claim telemetry (contract §5)

```text
classification:            TEMPORARILY_UNCLAIMABLE
claimable_now:             0
potentially_claimable_later: 5  (BA-007, BA-009, GAI-009, EM-012, EM-013)
reason:                    Development stage not declared complete by the Development host
external seam:             RESOLVED (hosted CI green at every recorded head)
blocked_on:                Mech's Development completion declaration for these five tasks
```

Under contract §5 a `TEMPORARILY_UNCLAIMABLE` result permits a bounded re-entry scan (default cadence 20
minutes) rather than termination, because "another host completion ... can make work eligible later".

## Decision requested from the Owner

The pool's last five Corrections are one field-edit away from being claimable. Two options:

1. **Alien records the verified Development completion** for the five tasks (CI conclusion corrected to
   `success` at the same run IDs, `development_status: COMPLETE`, `development_complete: true`), then claims
   and corrects each one, syncing this tracking record per task. Evidence for every field is the table above;
   Mech's authorship of each branch is unchanged and visible in the branch history, so the two-host
   separation of *labour* is preserved — but the Development *declaration* would have been written by Alien.
2. **Mech (or the Owner) writes the five Development declarations**, after which Alien claims and corrects
   them with no bookkeeping exception at all.

Alien has not performed either option's workbook edits; this record exists so the choice is explicit.
