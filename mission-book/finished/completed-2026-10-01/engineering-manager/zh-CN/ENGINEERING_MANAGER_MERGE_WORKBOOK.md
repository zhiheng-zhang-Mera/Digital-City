# Engineering Manager — Programme合并工作书

> 阅读译本 / Reading translation：仅供阅读的历史归档译本，不是第二份权威合并工作书，不新增领取或状态；元数据仅以代码围栏引用。

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

EM001–013、Mech合、2026-10-01T07:19/07:26Z；源main已BA/RF/GAI，联合aef657fe65ec3e7ce6c34fadd0e6dedbf186213c／36829755814，合main e7c498f5acd86da324a45c3278219c8daa612561／36830053908绿。13annotated tags及删13远；repo854/854、rooms69/69、city1932/0、晋级OK、双语同步、COMPLETE标记。

## 1. 前提与§4.2协调

十三任务开发／纠正true，Mech／Alien双机、双CI记录头绿。共享遥测见Butler§1，创建前每指针验、旧任务错配0。EM007 BOM令池40/41，读者容BOM并剥文件BOM，仅元数据无产品／历史改变。

## 2. 分支库存及合证据

| 任务 | 源分支 | 纠正头 | 归档标签 |
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

十三纯附加contracts包＋自己的tests，在已合BA/RF/GAI上无冲突联合。

## 3. Programme接受

强制最终清单：EM/GAI独立语义路由、通用connector可加而不改Foreman core、故障隔离、重启规范ID保、LOCAL_ALLOWED留本地、LOCAL_THROTTLED降低本地而非提远端。合组件契约及套件满足，每性质EM010/011/012/013命名断言在下联合通过。真实远端E2E仍按报告延期。

## 4. 核验

```text
integration_head      = aef657fe65ec3e7ce6c34fadd0e6dedbf186213c   CI 36829755814 success
main_merge_commit     = e7c498f5acd86da324a45c3278219c8daa612561   CI 36830053908 success
local checks          = repo 854/854 · rooms 69/69 · city 1932 pass/0 fail · docs SYNCHRONIZED
pre-merge main refresh = origin/main 74b37cf verified as an ancestor of the integration head
traceability          = every EM corrected head is an ancestor of origin/main and tagged archive/EM-0XX
remote_branches       = engineering-manager/* : 0 remaining
```

精确联合／main双绿、本测854/69/1932，临合main74b37cf祖先核，所有纠正头main祖先及archive，远engineering-manager余0。

## 5. 延期接口

真实DeepSeek Harness/Codex/Claude Code/WorkBuddy主机接受、真实双设备远E2E按EM007/011/012/013留programme集成；合并不执行provider，不声称执行。

## 6. 报告勘误／时点记录

../reports/EM历史MERGE_STATUS FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE当时真，故未编辑。当前真相工作书frontmatter merge_status/archive/main_sha/main_ci及本工作书。

```text
MERGE_STATUS = COMPLETE
ENGINEERING_MANAGER_MERGED_MAIN_CI_GREEN
```

历史MERGE_STATUS COMPLETE及ENGINEERING_MANAGER_MERGED_MAIN_CI_GREEN。

语言配对 / Language pair: [English](../ENGINEERING_MANAGER_MERGE_WORKBOOK.md) · [中文](./ENGINEERING_MANAGER_MERGE_WORKBOOK.md)
