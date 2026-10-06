# Remote Fabric — Programme合并工作书

> 阅读译本 / Reading translation：仅供阅读的历史归档译本，不是第二份权威合并工作书，不新增领取或状态；元数据仅以代码围栏引用。

```text
MERGE_WORKBOOK            = REMOTE_FABRIC_MERGE_WORKBOOK
PROGRAMME                 = REMOTE_FABRIC_ENGINEERING (RF-001..RF-010)
MERGE_HOST                = Mech
CREATED_AT                = 2026-10-01T07:01:00Z
COMPLETED_AT              = 2026-10-01T07:07:00Z
SOURCE_MAIN_SHA           = 41e241c3c817124c9c3d6e7756087d1022a836aa   (then-current main: BA union already merged)
INTEGRATION_BRANCH        = merge/remote-fabric-integration
INTEGRATION_HEAD          = 160fcc345775f9f3fbb5b640195cbe299cfb9d61
INTEGRATION_CI            = 36828179156 — success
MAIN_MERGE_COMMIT         = 49914d906ce6731272d301ed4bee4cca05ff2b86
MAIN_CI_AFTER_MERGE       = 36828413515 — success
ARCHIVE_TAGS              = archive/RF-001 .. archive/RF-010 (10 annotated tags)
REMOTE_BRANCHES_DELETED   = 10 (remote/RF-001..RF-010)
LOCAL_CHECK_SUMMARY       = repo 419/419 · rooms 69/69 · city 1932 pass/0 fail · promotion-history OK · docs SYNCHRONIZED
TERMINAL_MARKER           = REMOTE_FABRIC_MERGED_MAIN_CI_GREEN
STATUS                    = COMPLETE
```

RF001–010、Mech、2026-10-01T07:01/07:07Z，源main已BA；精确联合／合main／双CI见原记录。10annotated tags、删10远，repo419/419、rooms69/69、city1932/0、晋级OK、双语同步，COMPLETE及历史标记。

## 1. 前提与§4.2协调

十任务development/correction true及推纠正头CI绿。RF001/002 Alien开发Mech纠正，003–010反向，双机门满足。Butler§1共享协调在创建前每记录分支=活头、双CI、旧任务／指针错配0。

## 2. 分支库存及合证据

| 任务 | 源分支 | 纠正头 | 归档标签 |
|---|---|---|---|
| RF-001 | `remote/RF-001-node-identity-installation-lifecycle` | `0f4c75b` | `archive/RF-001` |
| RF-002 | `remote/RF-002-unified-pairing-trust-lifecycle` | `be86135` | `archive/RF-002` |
| RF-003 | `remote/RF-003-local-discovery-lan-direct` | `4a51996` | `archive/RF-003` |
| RF-004 | `remote/RF-004-bluetooth-bootstrap-ip-handoff` | `1bd7b13` | `archive/RF-004` |
| RF-005 | `remote/RF-005-remote-invite-rendezvous` | `d4fb944` | `archive/RF-005` |
| RF-006 | `remote/RF-006-secure-transport-path-manager` | `8fbd71d` | `archive/RF-006` |
| RF-007 | `remote/RF-007-versioned-capability-registry` | `8cfd96f` | `archive/RF-007` |
| RF-008 | `remote/RF-008-typed-rpc-event-stream-commands` | `4d974da` | `archive/RF-008` |
| RF-009 | `remote/RF-009-presence-offline-reconnect-audit` | `aaca94a` | `archive/RF-009` |
| RF-010 | `remote/RF-010-fabric-policy-public-api` | `4d7b931` | `archive/RF-010` |

## 3. RF001×002冲突解决

两声明同building00-foundation/02-city-node-network，五文件冲突都显式联合不丢边：

| 文件 | 解决 |
|---|---|
| city/CITY_IMPLEMENTATION_MANIFEST.json | modules保device-identity及pairing-trust兄弟对象，重JSON解析证明有效含双 |
| city/tests/manifest.test.mjs | 双期望building路径，deliberate-update覆盖双 |
| tests/capability-registry.test.mjs | 留002已命名001/002两building的超集注释 |
| city/docs/en/ARCHITECTURE.md | 001§9、002改§10，两正文保；恢复001共享completion line后的末句避免半句 |
| city/docs/zh-CN/ARCHITECTURE.md | 同处理双语编号一致，checker SYNCHRONIZED |

全章节替换会静默删一个任务建筑文档，§7.2联合／超集要求重编号而非丢弃。

## 4. 核验

```text
integration_head      = 160fcc345775f9f3fbb5b640195cbe299cfb9d61   CI 36828179156 success
main_merge_commit     = 49914d906ce6731272d301ed4bee4cca05ff2b86   CI 36828413515 success
local checks          = repo 419/419 · rooms 69/69 · city 1932 pass/0 fail · docs SYNCHRONIZED
pre-merge main refresh = origin/main 41e241c was verified to be an ancestor of the integration head
traceability          = every RF corrected head is an ancestor of origin/main and tagged archive/RF-0XX
remote_branches       = remote/* : 0 remaining
```

联合160fcc／36828179156、main49914d／36828413515成功，419/69/1932；临合main41e241c祖先，RF各头main祖先且archive，remote余0。

## 5. 延期接口

真实跨设备E2E按RF报告留programme集成，合并不关闭。GAI/EM最终跨设备在自己集成时可用此接受RF。

## 报告勘误／时点记录

../reports/RF旧FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE当时真故留同期不改，当前真相frontmatter merge_status/archive/main_sha/main_ci及此工作书。

```text
MERGE_STATUS = COMPLETE
REMOTE_FABRIC_MERGED_MAIN_CI_GREEN
```

历史MERGE_STATUS COMPLETE及REMOTE_FABRIC_MERGED_MAIN_CI_GREEN。

语言配对 / Language pair: [English](../REMOTE_FABRIC_MERGE_WORKBOOK.md) · [中文](./REMOTE_FABRIC_MERGE_WORKBOOK.md)
