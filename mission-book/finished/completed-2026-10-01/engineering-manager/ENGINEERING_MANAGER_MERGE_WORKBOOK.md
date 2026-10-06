# Engineering Manager — Programme Merge Workbook

```text
MERGE_WORKBOOK            = ENGINEERING_MANAGER_MERGE_WORKBOOK
PROGRAMME                 = ENGINEERING_MANAGER_ENGINEERING (EM-001..EM-013)
MERGE_HOST                = Mech
CREATED_AT                = 2026-10-01T07:19:00Z
COMPLETED_AT              = 2026-10-01T07:26:00Z
SOURCE_MAIN_SHA           = 74b37cf01fc314e2afb01205916de6decc90bb03   (then-current main: BA + RF + GAI unions already merged)
INTEGRATION_BRANCH        = merge/engineering-manager-integration
INTEGRATION_HEAD          = aef657fe65ec3e7ce6c34fadd0e6dedbf186213c
INTEGRATION_CI            = 36829755814 — success
MAIN_MERGE_COMMIT         = e7c498f5acd86da324a45c3278219c8daa612561
MAIN_CI_AFTER_MERGE       = 36830053908 — success
ARCHIVE_TAGS              = archive/EM-001 .. archive/EM-013 (13 annotated tags)
REMOTE_BRANCHES_DELETED   = 13 (engineering-manager/EM-001..EM-013)
LOCAL_CHECK_SUMMARY       = repo 854/854 · rooms 69/69 · city 1932 pass/0 fail · promotion-history OK · docs SYNCHRONIZED
TERMINAL_MARKER           = ENGINEERING_MANAGER_MERGED_MAIN_CI_GREEN
STATUS                    = COMPLETE
```

## 1. Preconditions and §4.2 reconciliation

All thirteen EM tasks recorded `development_complete = true`, `correction_complete = true`, development host
Mech / correction host Alien, and both CI runs green on the recorded heads. The §4.2 reconciliation pass
(shared telemetry in the Butler workbook §1) verified every pointer with zero stale tasks and zero mismatches
before this workbook was created.

**Reconciliation repair.** `EM-007`'s workbook carried a UTF-8 BOM, which made BOM-naive readers skip the file
and report a 40/41 pool. The readers were made BOM-tolerant and the BOM was stripped from that workbook —
metadata only, no product code and no history change.

## 2. Branch inventory and merge evidence

| Task | Source branch | Corrected head | Archive tag |
|---|---|---|---|
| EM-001 | `engineering-manager/EM-001-core-contracts-boundaries` | `2616dbe` | `archive/EM-001` |
| EM-002 | `engineering-manager/EM-002-connector-adapter-process-runtime` | `f389aa4` | `archive/EM-002` |
| EM-003 | `engineering-manager/EM-003-job-result-artifact-protocol` | `ffbdbce` | `archive/EM-003` |
| EM-004 | `engineering-manager/EM-004-capability-probe-auth-registry` | `1e2c0e1` | `archive/EM-004` |
| EM-005 | `engineering-manager/EM-005-attention-recent-device-alerts` | `cefc6c7` | `archive/EM-005` |
| EM-006 | `engineering-manager/EM-006-local-first-subworker-placement` | `3a3c4a5` | `archive/EM-006` |
| EM-007 | `engineering-manager/EM-007-remote-subworker-return-control` | `cf26337` | `archive/EM-007` |
| EM-008 | `engineering-manager/EM-008-credential-profile-session` | `4e1b57f` | `archive/EM-008` |
| EM-009 | `engineering-manager/EM-009-runtime-health-restart-recovery` | `c260038` | `archive/EM-009` |
| EM-010 | `engineering-manager/EM-010-foreman-scheduler-dag-worker-pool` | `2ab350d` | `archive/EM-010` |
| EM-011 | `engineering-manager/EM-011-deepseek-codex-reference-connectors` | `dbf70fb` | `archive/EM-011` |
| EM-012 | `engineering-manager/EM-012-connector-sdk-claude-workbuddy` | `e4afd5e` | `archive/EM-012` |
| EM-013 | `engineering-manager/EM-013-utopia-task-surface-integration` | `0ef455e` | `archive/EM-013` |

All thirteen EM branches are purely additive (`contracts/<package>/**` + their own `tests/<name>.test.mjs`), so
the integration was a clean union with **no conflicts** on top of the BA + RF + GAI work already merged.

## 3. Programme acceptance

The EM workbook's mandatory final acceptance list (EM/ GAI as separate semantic routes, a generic connector
addable without Foreman-core changes, fault isolation, canonical ID survival across restart, `LOCAL_ALLOWED`
staying local, `LOCAL_THROTTLED` reducing local execution instead of proposing remote) is satisfied by the
merged EM component contracts and their suites; every listed property is asserted by a named test in the
EM-010/EM-011/EM-012/EM-013 suites, which pass in the integration run recorded below. The real remote E2E seam
remains deferred exactly as those reports state.

## 4. Verification

```text
integration_head      = aef657fe65ec3e7ce6c34fadd0e6dedbf186213c   CI 36829755814 success
main_merge_commit     = e7c498f5acd86da324a45c3278219c8daa612561   CI 36830053908 success
local checks          = repo 854/854 · rooms 69/69 · city 1932 pass/0 fail · docs SYNCHRONIZED
pre-merge main refresh = origin/main 74b37cf verified as an ancestor of the integration head
traceability          = every EM corrected head is an ancestor of origin/main and tagged archive/EM-0XX
remote_branches       = engineering-manager/* : 0 remaining
```

## 5. Deferred seams

Real DeepSeek Harness / Codex / Claude Code / WorkBuddy host acceptance and the real remote two-device E2E
remain deferred to programme integration exactly as EM-007/EM-011/EM-012/EM-013 report; merging does not
execute a real provider run and no such claim is made here.

## 6. Report errata / point-in-time records

The Development and Correction reports under `../reports/EM-*/` still carry the `MERGE_STATUS =
FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE` line they recorded when they were written. That line was true
at that time and is deliberately left unedited as contemporaneous evidence; current merge truth lives in the
task workbook frontmatter (`merge_status`, `merge_archive_tag`, `merge_main_sha`, `merge_main_ci`) and in this
workbook.

```text
MERGE_STATUS = COMPLETE
ENGINEERING_MANAGER_MERGED_MAIN_CI_GREEN
```

语言配对 / Language pair: [English](./ENGINEERING_MANAGER_MERGE_WORKBOOK.md) · [中文](./zh-CN/ENGINEERING_MANAGER_MERGE_WORKBOOK.md)
