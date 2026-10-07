# Parked Programmes / 停放设计系列索引

[English translation / 完整英文](./en/PARKED_PROGRAMMES.md)

> 本页只做导航。以下系列**不进入主任务统计、不构成可领取工作池**。（个别停放系列仍以 `"active_pool": false` 的条目留在 `PROGRESS_MANIFEST.json` 中，只为让主页与该系列面板如实显示其停放状态；这类条目不计入未收口工作书列表。例外照实记录在下方各条说明中。）

| Series | Purpose | State |
|---|---|---|
| [PCF](mission-group/personal-compute-fabric/README.md) | 增强个人异构计算织网：29 份规划工作书（23 核心 + 6 可选），支持追加子任务与版本化复杂扩展 | PARKED |
| [DGX](mission-group/deliberative-governance-expansion-migration/README.md) | 复杂请求拆分、隔离执行、结构化汇合、冲突/仲裁治理 | PARKED |
| [RIV](mission-group/review-independence-v2/README.md) | Review Pool v2、多维独立性、fresh-context、安全迁移 | PARKED |
| [URA](mission-group/utopia-runtime-architecture/README.md) | Utopia Core / Service / App / Connector 运行时分层与逻辑解耦 | PARKED |
| [CHK](mission-group/city-self-health-check/README.md) | 周期体检、自我认知/诊断、季度自进化候选评审 | PARKED |
| [SHOW](mission-group/showcase-material-extraction/README.md) | Utopia 展示素材提取与双 Demo 制作（SHOW-401）；Owner 2026-10-07 裁定**永久停用**，按停放设计保留 | PARKED |
| [Suspend](mission-group/suspend/README.md) | 当前不可 canonical 化但必须保留的冲突性设计/假设 | PRESERVE_ONLY |

## 统一规则

- 不因目录存在自动激活；
- 不复用今天的 branch/head 作为未来 baseline；
- 激活时重新读取 canonical truth，并以 full SHA 锚定；
- 不在在途任务中途修改 acceptance/review contract；
- 设计与当前规则冲突时，以当前规则为准；
- 需要进入 active pool 时，必须显式修改 `PROGRESS_MANIFEST.json` 并同步主页，而不是偷偷变成任务。

本索引用来把未来设计从主 Mission Book 施工面隔离出去，同时避免设计遗失。

## PCF design revision2 — 2026-10-07

29 planned workbooks (23 core,6 optional),0 activated. Execution-only prerequisite slices from URA/DGX/FR now have one PCF owner; source and destination README panels record all seven transfers. No active task denominator or current claims change.

## SHOW permanent suspension — 2026-10-07

Owner ruling 2026-10-07（工作书字段 `owner_ruling_2026_10_07_show_parked`）：Owner 裁定 SHOW programme **永久停用（permanently suspended）**，按停放设计长期保留。

- 状态：SHOW-401 为 `PARKED`、`status: NOT_STARTED`、`activation_state: PARKED_OWNER_NOT_ACTIVATED`、`execution_enabled: false`；不隐含任何验收/复核/修正/验证/完成；
- 终态标记 `UTOPIA_SHOWCASE_PACKAGE_READY` **未释放**、未满足、不可领取；
- 已配置事实（`development_host`、`development_branch: showcase/SHOW-401-alien-capture`、媒体根目录、`dependencies`、`required_ancestor_shas`、终态标记）全部原样保留；README、`reports/SHOW-401/` 与工作书均未删除，git 分支 `showcase/SHOW-401-alien-capture` 未撤回；
- 停留在本索引（可发现），但不在生成的主页未收口工作书列表中：其 manifest 条目保留 `"active_pool": false`，因此不进入可领取工作池，也不再作为未完成复核的工作书出现。本条目是 `PROGRESS_MANIFEST.json` 中 `active_pool: false` 的停放条目（`key: show`），与上面「不在 manifest 中」的一般说明不同，此处照实记录该差异。

SHOW remains discoverable here as a parked design. Parking releases nothing: no development, review or acceptance is claimed, and the Owner's permanent-suspension ruling is the only authority recorded for it.

Owner ruling: 2026-10-07 — SHOW is permanently suspended; parked for good, not deleted.
