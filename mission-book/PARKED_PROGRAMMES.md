# Parked Programmes / 停放设计系列索引

> 本页只做导航。以下系列**不在 `PROGRESS_MANIFEST.json` 中，不进入主任务统计，不构成可领取工作池**。

| Series | Purpose | State |
|---|---|---|
| [PCF](./personal-compute-fabric/README.md) | 增强个人异构计算织网：25 份规划工作书（19 核心 + 6 可选），支持追加子任务与版本化复杂扩展 | PARKED |
| [DGX](./deliberative-governance-expansion-migration/README.md) | 复杂请求拆分、隔离执行、结构化汇合、冲突/仲裁治理 | PARKED |
| [RIV](./review-independence-v2/README.md) | Review Pool v2、多维独立性、fresh-context、安全迁移 | PARKED |
| [URA](./utopia-runtime-architecture/README.md) | Utopia Core / Service / App / Connector 运行时分层与逻辑解耦 | PARKED |
| [CHK](./city-self-health-check/README.md) | 周期体检、自我认知/诊断、季度自进化候选评审 | PARKED |
| [Suspend](./suspend/README.md) | 当前不可 canonical 化但必须保留的冲突性设计/假设 | PRESERVE_ONLY |

## 统一规则

- 不因目录存在自动激活；
- 不复用今天的 branch/head 作为未来 baseline；
- 激活时重新读取 canonical truth，并以 full SHA 锚定；
- 不在在途任务中途修改 acceptance/review contract；
- 设计与当前规则冲突时，以当前规则为准；
- 需要进入 active pool 时，必须显式修改 `PROGRESS_MANIFEST.json` 并同步主页，而不是偷偷变成任务。

本索引用来把未来设计从主 Mission Book 施工面隔离出去，同时避免设计遗失。
