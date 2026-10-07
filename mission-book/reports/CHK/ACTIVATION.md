# CHK activation / City Self Health Check 激活记录

Owner instruction: “同样逻辑，放开city-self-health-check系列”。

Scope: enable CHK-101/201/301/401/990 and synchronize the authoritative workbook, dashboard and dependency views. This activation does not claim completed health checks, development, review, runtime verification or quarterly acceptance.

## Exact creation anchors

- Digital-City main: `78d9efe4774d257678ad09c7c3cfb95d6d352306`.
- Utopia main: `cc799234e7daa3d8ccfde5673b9d07ccb2376742`.
- Both repositories: one isolated `Alien-GPT-CHK` branch for this series, created from those remote-main SHAs. No merge or push to main is authorized.
- These are branch creation anchors, not claimed development or accepted dependency evidence. Workbooks remain unclaimed; resolve the implementation SHA at claim and preserve accepted dependency ancestry.

## Execution boundaries

- All five canonical workbooks: `execution_enabled=true`, `development_complete=false`, `review_complete=false`, `merge_authority=false`.
- CHK-101 and CHK-201: NOT_STARTED and available to claim.
- CHK-301 waits for CHK-201; CHK-401 waits for CHK-301; CHK-990 waits for all four preceding workbooks. Accepted dependencies require COMPLETE, formal review, terminal marker and exact full SHA.
- First execution must be bounded dry-run/read-only. Findings must retain evidence, severity, owner surface and destination; repairs route to separate formal workbooks.
- No scheduler installation, automatic repair, evolution promotion, rule migration or acceptance-contract modification is performed by activation.
- Independent formal Review and explicit promotion gates remain required. Runtime observations, sentinel E2E and cross-host acceptance: NOT_RUN.

## Validation

The CHK dependency regression first failed because the synchronizer did not recognize CHK IDs, then passed with CHK recognition added. It checks refusal of unreviewed dependency evidence and READY only after formal acceptance without inventing a claimed baseline. Repository consistency, progress, dependency and documentation checks are required before publication; cloud CI is separately observable at the branch head.

Local validation observed: 16 record-consistency guard cases, one documentation-preservation test and two layout/dependency tests passed. The full repository record check covered 147 workbooks with zero errors, 36 existing historical warnings and four recorded exceptions. Dependency, progress and documentation generators all passed `--check`; Git whitespace checks passed.
