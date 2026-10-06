# General AI Gateway — Programme Merge Workbook

```text
MERGE_WORKBOOK            = GENERAL_AI_GATEWAY_MERGE_WORKBOOK
PROGRAMME                 = GENERAL_AI_GATEWAY_ENGINEERING (GAI-001..GAI-009)
MERGE_HOST                = Mech
CREATED_AT                = 2026-10-01T07:11:00Z
COMPLETED_AT              = 2026-10-01T07:16:00Z
SOURCE_MAIN_SHA           = 49914d906ce6731272d301ed4bee4cca05ff2b86   (then-current main: BA + RF unions already merged)
INTEGRATION_BRANCH        = merge/general-ai-gateway-integration
INTEGRATION_HEAD          = a47e4eb33ca35901e954aa74577f473aea98b1ea
INTEGRATION_CI            = 36828980482 — success
MAIN_MERGE_COMMIT         = 74b37cf01fc314e2afb01205916de6decc90bb03
MAIN_CI_AFTER_MERGE       = 36829232339 — success
ARCHIVE_TAGS              = archive/GAI-001 .. archive/GAI-009 (9 annotated tags)
REMOTE_BRANCHES_DELETED   = 9 (general-ai/GAI-001..GAI-009)
LOCAL_CHECK_SUMMARY       = repo 570/570 · rooms 69/69 · city 1932 pass/0 fail · promotion-history OK · docs SYNCHRONIZED
TERMINAL_MARKER           = GENERAL_AI_GATEWAY_MERGED_MAIN_CI_GREEN
STATUS                    = COMPLETE
```

## 1. Preconditions and §4.2 reconciliation

All nine GAI tasks recorded `development_complete = true`, `correction_complete = true`, development host Mech
/ correction host Alien, and both CI runs green on the recorded heads. The §4.2 reconciliation pass (shared
telemetry in the Butler workbook §1) verified every pointer with zero stale tasks and zero mismatches before
this workbook was created.

## 2. Branch inventory and merge evidence

| Task | Source branch | Corrected head | Archive tag |
|---|---|---|---|
| GAI-001 | `general-ai/GAI-001-core-contracts-action-vocabulary` | `c01cd60` | `archive/GAI-001` |
| GAI-002 | `general-ai/GAI-002-provider-model-account-registry` | `e27763a` | `archive/GAI-002` |
| GAI-003 | `general-ai/GAI-003-web-channel-persistent-session` | `d3f6a27` | `archive/GAI-003` |
| GAI-004 | `general-ai/GAI-004-api-channel-consent-budget` | `11d5ece` | `archive/GAI-004` |
| GAI-005 | `general-ai/GAI-005-triage-jev-routing` | `8a37f44` | `archive/GAI-005` |
| GAI-006 | `general-ai/GAI-006-conversation-input-stream-cancel` | `be8aa47` | `archive/GAI-006` |
| GAI-007 | `general-ai/GAI-007-device-aware-remote-execution` | `a4791b0` | `archive/GAI-007` |
| GAI-008 | `general-ai/GAI-008-health-resilience-degradation` | `e34e310` | `archive/GAI-008` |
| GAI-009 | `general-ai/GAI-009-utopia-surface-integration` | `4e65e26` | `archive/GAI-009` |

## 3. Shared-file interaction

GAI-001 is the only GAI branch that touches a shared file: `services/dev-gateway/actions.mjs` (+80/−6, the
`GENERAL_AI` product Action kind). It merged as a **clean union** on top of the already-merged BA and RF work —
no conflict, because no BA or RF branch touches that file. The change is additive to the existing action
vocabulary, which is exactly what GAI-001's development report describes.

## 4. Verification

```text
integration_head      = a47e4eb33ca35901e954aa74577f473aea98b1ea   CI 36828980482 success
main_merge_commit     = 74b37cf01fc314e2afb01205916de6decc90bb03   CI 36829232339 success
local checks          = repo 570/570 · rooms 69/69 · city 1932 pass/0 fail · docs SYNCHRONIZED
pre-merge main refresh = origin/main 49914d9 verified as an ancestor of the integration head
traceability          = every GAI corrected head is an ancestor of origin/main and tagged archive/GAI-00X
remote_branches       = general-ai/* : 0 remaining
```

## 5. Deferred seams

Real provider acceptance remains deferred exactly as GAI-004/005/006/007/009 report
(`REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION`); merging component code does not execute a real
provider login, and this workbook does not claim that it did. The GAI final cross-device E2E gate may consume
the accepted Remote Fabric code, which is now on main.

## Report errata / point-in-time records

The Development and Correction reports under `../reports/GAI-*/` still carry the `MERGE_STATUS =
FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE` line they recorded when they were written. That line was true at
that time and is deliberately left unedited as contemporaneous evidence; current merge truth lives in the task
workbook frontmatter (`merge_status`, `merge_archive_tag`, `merge_main_sha`, `merge_main_ci`) and in this workbook.

```text
MERGE_STATUS = COMPLETE
GENERAL_AI_GATEWAY_MERGED_MAIN_CI_GREEN
```

语言配对 / Language pair: [English](./GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md) · [中文](./zh-CN/GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md)
