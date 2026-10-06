# General AI Gateway — Programme合并工作书

> 阅读译本 / Reading translation：仅供阅读的历史归档译本，不是第二份权威合并工作书，不新增领取或状态；元数据仅以代码围栏引用。

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

GAI001–009、Mech、2026-10-01T07:11/07:16Z，源main已BA/RF；联合／main及双CI见记录，9标签／9远删，repo570/570、rooms69/69、city1932/0、晋级OK／双语同步，历史COMPLETE标记。

## 1. 前提与§4.2协调

九任务开发纠正true、Mech开发Alien纠正、双运行记录头绿。Butler§1共享协调逐指针、旧任务／错配0，创建前完成。

## 2. 分支库存及合证据

| 任务 | 源分支 | 纠正头 | 归档标签 |
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

## 3. 共享文件交互

唯一GAI001动shared services/dev-gateway/actions.mjs +80/-6 GENERAL_AI Action，在已BA/RF上干净联合：他们不碰该文件无冲突。附加词汇正如开发报告。

## 4. 核验

```text
integration_head      = a47e4eb33ca35901e954aa74577f473aea98b1ea   CI 36828980482 success
main_merge_commit     = 74b37cf01fc314e2afb01205916de6decc90bb03   CI 36829232339 success
local checks          = repo 570/570 · rooms 69/69 · city 1932 pass/0 fail · docs SYNCHRONIZED
pre-merge main refresh = origin/main 49914d9 verified as an ancestor of the integration head
traceability          = every GAI corrected head is an ancestor of origin/main and tagged archive/GAI-00X
remote_branches       = general-ai/* : 0 remaining
```

联合a47e4eb／36828980482、main74b37cf／36829232339成功，本测570/69/1932；临合main49914d9祖先、各纠正头main祖先及archive，general-ai余0。

## 5. 延期接口

真实provider按GAI004/005/006/007/009 REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION留延期；合组件不执行真实登录，未声称已做。GAI最终跨设备E2E可用现main接受RF代码。

## 报告勘误／时点记录

../reports/GAI旧FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE当时真、留同期不改，当前真相frontmatter merge_status/archive/main_sha/main_ci及此记录。

```text
MERGE_STATUS = COMPLETE
GENERAL_AI_GATEWAY_MERGED_MAIN_CI_GREEN
```

历史MERGE_STATUS COMPLETE及GENERAL_AI_GATEWAY_MERGED_MAIN_CI_GREEN。

语言配对 / Language pair: [English](../GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md) · [中文](./GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md)
