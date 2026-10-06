# Digital City / 数字城市

Digital-City管理城市架构、能力归属、任务和证据索引；运行时代码与部署真相来自对应实现仓库和实际观察。

Digital-City maintains architecture, capability ownership, tasks and evidence navigation. Runtime implementation and deployment truth come from implementation repositories and observed evidence.

## 快速信息 / Quick dashboard

| 项目 / Item | 权威入口 / Authoritative entry | 用途 / Purpose |
|---|---|---|
| 当前任务 / Current tasks | [Mission Book](mission-book/README.md) | 工作书状态与资格 / Workbook status and eligibility |
| 当前实现 / Current implementation | [Utopia live status](mission-book/UTOPIA_LIVE_STATUS.md) | exact main SHA与CI / Exact main SHA and CI |
| 能力登记 / Capability inventory | [Capability Registry](capability-registry/README.md) | 实现、接线、入口、意图 / Implementation, wiring, reachability, intent |
| 架构说明 / Architecture | [中文](docs/zh-CN/CITY_OVERVIEW_ARCHITECTURE.md) · [English](docs/en/CITY_OVERVIEW_ARCHITECTURE.md) | 完整职责和路由 / Full responsibility and routing rules |
| 历史任务 / Historical tasks | [finished](mission-book/finished/README.md) | 已验收历史，禁止重新领取 / Accepted history, not claimable |
| 未来规划 / Future plans | [future-development](future-development/README.md) | 规划不等于激活 / Planning does not mean activation |

当前Owner范围：回查已有池，不激活新系列，不处理SHOW。CEX-790已合并并通过merged-main检查；其他状态以工作书为准。

Current Owner scope: revisit existing pools, keep new programmes inactive and exclude SHOW. CEX-790 is merged with successful merged-main checks; workbooks govern all other states.

## 子区导航 / District navigation

| 子区 / District | 导航 / Navigation |
|---|---|
| 00-城市地基(City-Foundation)-&-城市级共享基础设施(Citywide-Shared-Infrastructure) | [README](00-城市地基(City-Foundation)-&-城市级共享基础设施(Citywide-Shared-Infrastructure)/README.md) |
| 01-市政治安区(Civic-Government-Safety-District)-&-治理安全域(Governance-Security-Domain) | [README](01-市政治安区(Civic-Government-Safety-District)-&-治理安全域(Governance-Security-Domain)/README.md) |
| 02-工务区(Engineering-Works-District)-&-工程运维域(Engineering-Operations-Domain) | [README](02-工务区(Engineering-Works-District)-&-工程运维域(Engineering-Operations-Domain)/README.md) |
| 03-居民区(Residential-District)-&-数字身份代理域(Digital-Identity-Agent-Domain) | [README](03-居民区(Residential-District)-&-数字身份代理域(Digital-Identity-Agent-Domain)/README.md) |
| 04-法律隐私区(Legal-Privacy-District)-&-法律隐私治理域(Legal-Privacy-Governance-Domain) | [README](04-法律隐私区(Legal-Privacy-District)-&-法律隐私治理域(Legal-Privacy-Governance-Domain)/README.md) |
| 05-医疗健康区(Health-District)-&-健康数据服务域(Health-Data-Service-Domain) | [README](05-医疗健康区(Health-District)-&-健康数据服务域(Health-Data-Service-Domain)/README.md) |
| 06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain) | [README](06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/README.md) |
| 07-金融区(Finance-District)-&-金融量化域(Financial-Quantitative-Domain) | [README](07-金融区(Finance-District)-&-金融量化域(Financial-Quantitative-Domain)/README.md) |
| 08-设备边缘区(Device-Edge-District)-&-设备边缘计算域(Device-Edge-Computing-Domain) | [README](08-设备边缘区(Device-Edge-District)-&-设备边缘计算域(Device-Edge-Computing-Domain)/README.md) |
| 09-规划知识区(Planning-Knowledge-District)-&-规划知识管理域(Planning-Knowledge-Management-Domain) | [README](09-规划知识区(Planning-Knowledge-District)-&-规划知识管理域(Planning-Knowledge-Management-Domain)/README.md) |
| 10-自动化区(Automation-District)-&-自动化执行域(Automation-Execution-Domain) | [README](10-自动化区(Automation-District)-&-自动化执行域(Automation-Execution-Domain)/README.md) |
| 11-娱乐区(Entertainment-District)-&-媒体沉浸交互域(Media-Immersive-Interaction-Domain) | [README](11-娱乐区(Entertainment-District)-&-媒体沉浸交互域(Media-Immersive-Interaction-Domain)/README.md) |

## 阅读顺序 / Reading order

1. 从子区README进入说明与状态表。 / Start from the district README for navigation and status.
2. 执行前读[常驻规则](mission-book/CONSTRUCTION_RULES.md)，从frontmatter和exact evidence判断资格。 / Read construction rules and judge eligibility from frontmatter and exact evidence.
3. 从Registry查找实现；历史snapshot不能覆盖当前runtime。 / Locate implementation through the Registry; historical snapshots cannot override current runtime truth.

结构登记：[CITY_MANIFEST](CITY_MANIFEST.yaml)。双语说明是阅读视图，不创建第二份任务authority。 / CITY_MANIFEST records topology. Bilingual descriptions are reading views, not a second task authority.
