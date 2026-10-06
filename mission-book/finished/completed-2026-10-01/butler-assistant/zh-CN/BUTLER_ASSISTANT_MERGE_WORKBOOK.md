# Butler Assistant — Programme合并工作书

> 阅读译本 / Reading translation：仅供阅读的历史归档译本，不是第二份权威合并工作书，不新增领取或状态；元数据仅以代码围栏引用。

```text
MERGE_WORKBOOK            = BUTLER_ASSISTANT_MERGE_WORKBOOK
PROGRAMME                 = BUTLER_ASSISTANT_ENGINEERING (BA-001..BA-009)
MERGE_HOST                = Mech
CREATED_AT                = 2026-10-01T06:47:00Z
COMPLETED_AT              = 2026-10-01T07:00:00Z
SOURCE_MAIN_SHA           = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
INTEGRATION_BRANCH        = merge/butler-assistant-integration
INTEGRATION_HEAD          = 4ff27babf52410b36a53ea32785d27e19303b7d8
INTEGRATION_CI            = 36827219769 — success
MAIN_MERGE_COMMIT         = 41e241c3c817124c9c3d6e7756087d1022a836aa
MAIN_CI_AFTER_MERGE       = 36827422797 — success
ARCHIVE_TAGS              = archive/BA-001 .. archive/BA-009 (9 annotated tags)
REMOTE_BRANCHES_DELETED   = 9 (assistant/BA-001..BA-009)
LOCAL_CHECK_SUMMARY       = repo 288/288 · rooms 69/69 · city 1807 pass/0 fail · promotion-history OK · docs SYNCHRONIZED
TERMINAL_MARKER           = BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN
STATUS                    = COMPLETE
```

BA001–009合并Mech，创建／结束2026-10-01T06:47/07:00Z；源main、联合／CI、main合／CI精确值见原记录。9 annotated archive tags、删9远assistant分支；repo288/288、rooms69/69、city1807/0、晋级OK、双语同步，历史状态COMPLETE及标记。

## 1. 前提与§4.2协调

九BA均development_complete/correction_complete true，开发Mech纠正Alien异机，记录头双CI绿。创建本工作书前必跑协调：

```text
reconciliation_started_at        = 2026-10-01T06:45:23Z
external_recovery_source         = GITHUB_ACTIONS (block recovered; GITHUB_ACTIONS_EXTERNAL_BLOCK=RECOVERED)
task_count                       = 41 (all four programmes; 9 BA)
stale_task_count                 = 0
stale_blocker_count              = 0
evidence_pointer_mismatch_count  = 0
repaired_task_ids                = []
reconciliation_completed_at      = 2026-10-01T06:45:23Z
```

06:45:23Z开始结束，GitHub外阻恢复，四programme41含BA9，旧任务／阻塞／证据指针0、修任务空。逐任务记录分支=活远头、开发纠正运行精确头success。协调发现EM007工作书BOM令不知BOM读者漏、池40/41；读取容BOM并剥元数据BOM，不碰产品。

## 2. 分支库存及合证据

| 任务 | 源分支 | 纠正头 | 归档标签 |
|---|---|---|---|
| BA-001 | `assistant/BA-001-butler-zone-personalization` | `8c7e1dc` | `archive/BA-001` |
| BA-002 | `assistant/BA-002-shared-brain-runtime` | `e9add9d` | `archive/BA-002` |
| BA-003 | `assistant/BA-003-device-embodiment-binding` | `4bfd256` | `archive/BA-003` |
| BA-004 | `assistant/BA-004-multi-assistant-handoff` | `b5c6249` | `archive/BA-004` |
| BA-005 | `assistant/BA-005-digital-me-context-gateway` | `6c6d2d4` | `archive/BA-005` |
| BA-006 | `assistant/BA-006-shared-task-coordination` | `bf6c648` | `archive/BA-006` |
| BA-007 | `assistant/BA-007-settings-interaction-surface` | `f8f15af` | `archive/BA-007` |
| BA-008 | `assistant/BA-008-embodiment-event-bus` | `1070190` | `archive/BA-008` |
| BA-009 | `assistant/BA-009-duty-permission-policy` | `2abf8d4` | `archive/BA-009` |

九分支只附加contracts各包及自己的tests，联合无冲突。

## 3. 决定

D1跨programme顺序BA→RF→GAI→EM；BA/RF无GAI/EM硬终依赖，各从当时main保他programme，无组件重叠所以用池顺。

D2各纠正分支--no-ff，提交由main可追，不rebase/squash/快进。

D3临合前origin各ref重核协调头，错配driver abort，不静默合旧头。

D4全repo＋rooms/city/晋级/双语在联合integration而非逐分支。

D5 BA准备间origin/main82ed369→d914c06仅证据，首final合弃，新fetch并按§7.6将当时main合进integration，§7.7对刷新4ff27ba重跑全checks/CI才final。

D6 main合及绿后给每头annotated archive/TASK含头／双CI／双host，再删远分支。历史仍main merge可达，tags指精确头，不是删历史。

## 4. 核验

```text
integration_head      = 4ff27babf52410b36a53ea32785d27e19303b7d8   CI 36827219769 success
main_merge_commit     = 41e241c3c817124c9c3d6e7756087d1022a836aa   CI 36827422797 success
local checks          = repo 288/288 · rooms 69/69 · city 1807 pass/0 fail · docs SYNCHRONIZED
traceability          = every BA corrected head is an ancestor of origin/main and is tagged archive/BA-00X
remote_branches       = assistant/* : 0 remaining
```

联合4ff27ba／36827219769、main41e241c／36827422797成功，本测如记录，全部BA纠正头main祖先且archive标签，远assistant余0。

## 5. 延期接口

每BA报告真实外部接口仍按原延期，合并不闭；双主机门在各工作书。

## 报告勘误／时点记录

../reports/BA各开发／纠正的MERGE_STATUS=FORBIDDEN_UNTIL_*_PROJECT_MERGE是写作当时真，故留同期证据。当前合真相在工作书frontmatter merge_status/tag/main_sha/main_ci及此记录，不改旧报告。

```text
MERGE_STATUS = COMPLETE
BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN
```

最终历史MERGE_STATUS COMPLETE、BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN。

语言配对 / Language pair: [English](../BUTLER_ASSISTANT_MERGE_WORKBOOK.md) · [中文](./BUTLER_ASSISTANT_MERGE_WORKBOOK.md)
