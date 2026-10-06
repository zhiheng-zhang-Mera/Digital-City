# 项目优先的城市审查

## 绑定策略

Digital-City **先审查已有 GitHub 项目**。

```text
仓库
  → 原始目的＋当前实现
  → 能力群
  → 城市位置
  → 所需道路
  → 实现／抽取决定
```

这替代此前从空城市模块出发，再寻找项目填充的倾向。

### 规则

- 仓库不会自动成为建筑。
- 仓库可向多个区贡献能力群。
- 架构位置不要求立即移动代码。
- 在抽取带来具体复用、生命周期、测试、安全或所有权收益前，既有项目本地实现保持有效。
- 空占位是例外：仅在已审仓库仍让必要能力无主时创建。
- 课程／遗留仓库作为资产审查，不自动准入活跃城市拓扑。
- Utopia 是参考实现／建设现场；Digital-City 仍是位置／所有权注册表。

## 当前 GitHub 仓库清单快照

采用本策略时，下列仓库在项目所有者 GitHub 清单中可见。出现在此清单**不意味着城市准入**。

- `301DataBaseProject` — **课程作业已审查，无抽取／不准入**
- `Application-Plan` — **Owner 排除／不准入城市**
- `Auto-Game-Bot` — **项目优先审查完成**
- `Boss-Qualification-Control` — **项目优先审查完成**
- `C_Model_glb_coloring` — **已弃用／不准入城市**
- `C-Model-Visuliazer` — **已弃用／不准入城市**
- `CapstoneProject499-Department_Manage_System` — **课程作业已审查，无抽取／不准入**
- `Codex-Boss` — **项目优先审查完成**
- `Digital-City` — 注册表／特殊角色
- `Digital-Me` — **项目优先审查完成**
- `Distributed-ESP32-Health-Project` — **已弃用／不准入城市**
- `drug-simulator` — **项目优先审查完成**
- `DS-Hns` — **项目优先审查完成**
- `dsh-health-scheduler` — **项目优先审查完成**
- `dsh-restart` — **项目优先审查完成**
- `Essay-Book` — **Owner 排除／不准入城市**
- `Firmware_Anomoly_Noise_Detect` — **已弃用／不准入城市**
- `GDPR-app` — **被 Privacy Lens 取代／不准入**
- `GDPR-project` — **被 Privacy Lens 取代／不准入**
- `General-Logic-Engine` — **项目优先审查完成**
- `Harness-Alien` — **Owner 排除／不准入城市**
- `Harness-Mega` — **Owner 排除／不准入城市**
- `Idea-Book` — **Owner 排除／不准入城市**
- `Machine-Learning-for-Health-Group-Project` — **已弃用／不准入城市**
- `ML-Quant-A-stock` — **项目优先审查完成，量化实验室特征供体**
- `My_VR_Glove` — **项目优先审查完成**
- `Parama-Health` — **项目优先审查完成**
- `Personal-trading-project-for-fun` — **被 Quant-ultra 取代／不准入**
- `privacy-lens-research-artifact` — **Owner 排除／不准入城市**
- `Quant-ultra` — **项目优先审查完成**
- `research-overview` — **Owner 排除／不准入城市**
- `Task-Board` — **Owner 排除／不准入城市**
- `utopia` — 参考实现／特殊角色

## 明确项目排除

下列仓库由 Owner 宣告弃用，**不纳入活跃 Digital-City 拓扑**：
- `Machine-Learning-for-Health-Group-Project`
- `Distributed-ESP32-Health-Project`
- `Firmware_Anomoly_Noise_Detect`
- `C-Model-Visuliazer`
- `C_Model_glb_coloring`

它们没有建筑／房间／道路所有权；除非 Owner 以后明确重新激活，否则也不作为供体候选。

## 已完成项目审查：Digital-Me

Digital-Me 从原始产品意图审查，而非从既有 03 区形状出发。

### 恢复出的历史功能群

1. 身份／Owner 档案。
2. 证据、GitHub 依据与诚实知识边界。
3. 能力图、Claim Guard 与未知／拒绝语义。
4. Personal Academy／学习—练习—验证／真实能力评估。
5. 人格、措辞与多语言身份一致性。
6. 语音、韵律、节奏与停顿。
7. 面部／非语言行为与习惯动作。
8. 实时语音／视频交互、中断与 Owner 接管。
9. 头像、虚拟相机／音频和会议／面试呈现。
10. 校准、就绪状态、审计与操作者控制。
11. 未来来自相机、穿戴设备和环境传感器的具身上下文。

### 城市结果

- **03 住宅区 — 主要语义所有权：** 身份、个人证据／能力边界、主张防护、人格／语言身份、时序／行为、校准／Personal Academy、居民运行时。
- **09 规划知识区 — 贡献：** 通用 GitHub／仓库证据摄取与来源溯源。
- **11 娱乐区 — 贡献：** TTS／语音适配器、头像／口型同步、虚拟视听呈现。
- **08 设备边缘区 — 贡献／未来适配器：** 麦克风／相机／传感器采集与具身上下文提供方。
- **04／00 集成仍优先道路：** 隐私／控制／审计集成记为接口；不只因 Digital-Me 有本地实现就抽取通用服务。

详细分解记录在 03 住宅区 README 与 `CITY_MANIFEST.yaml`。

## 项目清单状态

```text
PROJECT_INVENTORY_REVIEW = COMPLETE
NEXT_PHASE = CITY_CAPABILITY_GAP_REVIEW
```

采用清单内全部仓库现已分为：
- 已准入／项目优先审查；
- 特殊 City／Utopia 角色；
- Owner 排除；
- 已弃用；
- 已被取代；
- 已审课程作业且无值得抽取能力。

默认审查方向现在可从**仓库 → 城市**转为**城市能力缺口 → 决定是否确需新项目／模块**。

## 已完成项目审查：Codex-Boss

**快照：** `8df428eaa437a409368401e95194e40266b83080`

Codex-Boss 是跨多区来源项目，其**主要身份**是城市权威＋全局编排。

- **00/01 核心 — 主要：** Root Authority／Trust、全局任务／运行时状态、编排／路由、持久控制原语。
- **00/03 能力网络 — 主要／供体：** 能力／提供方注册表／代理、提供方契约、健康／发现。
- **00/05 控制中心 — 贡献：** Chat／Work、WorkBook、Provider Manager、Owner Dashboard、研究／工程控制。
- **01 治理 — 贡献：** 准入／许可契约与运行时执行。
- **02 工程 — 联合贡献：** 目标循环、仓库／世界检查、评审、验证、CI 修复、验收、检查点／恢复。
- **06 研究 — 主要贡献：** 协议→文献→实验→统计→证据／引文→手稿→LaTeX／PDF。
- **09 知识 — 贡献：** 知识／检索治理与文档摄取／阅读器。
- **10 自动化 — 联合贡献：** 语义 Computer Use、DOM／UIA／结构化／视觉、工作区许可门禁。
- **11 娱乐 — 联合贡献：** 主题意图、确定性生成与视觉验证。

## 已完成项目审查：DS-Hns

**快照：** `eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`

DS-Hns 的**主要身份**是工程编排＋执行平台。

- **02/01 项目工头 — 主要：** 工程规划／DAG、监督、调度、修改协调、验证／恢复／证据。
- **02/02 工作者网关 — 主要：** 提供方／运行时适配器、工作者／任务契约、工作者池／工作树、技能／提供方集成。
- **00/03 能力网络 — 供体：** 可复用插件／能力生命周期、依赖／回退、健康、兼容性和锁文件机制；本身不是城市全局真值。
- **01 海关 — 供体：** 插件 manifest／安装／兼容／生命周期验证。
- **10 自动化 — 联合贡献：** 通用 Computer Use 契约／控制器／驱动／安全／恢复／验证。
- **11 娱乐 — 主要供体：** Theme Engine 包／运行时／设计器／资产／验证／生命周期。
- **主机健康／重启 — 集成方而非所有者：** `dsh-health-scheduler` 与 `dsh-restart` 仍为独立项目。

Hns 本地 `app/core`、DSH Shell 集成、DeepSeek 专属更新器／认证、计费／通知／设置保持项目本地，除非后续复用证明存在城市所有者。

## Boss／Hns 重叠策略

相同语义重叠映射为**功能联合**，不选赢家：
1. 工程运行时；
2. 能力与扩展平台；
3. 计算机使用运行时；
4. 主题引擎。

参见 [COMPOSITE_UNIONS.md](./COMPOSITE_UNIONS.md)。

## 已完成项目审查：Parama-Health

**快照：** `e4b545b12d094032a72dab9fb72ec29e85861a8f`
**实现状态：** `PRE_ALPHA_PARTIAL_IMPLEMENTATION`

### 项目身份

Parama-Health 是 05 健康区的个人生理状态／纵向能量流平台。

预期功能群：
1. Personal Context／时间一致的受试者快照。
2. 带来源／时间／置信度的观察层。
3. 身体状态／趋势估计。
4. 活动／运动估计。
5. 睡眠／恢复上下文。
6. 暴露／上下文修饰项。
7. 能量流账本。
8. 基线／实验室校准。
9. 状态估计／对账。
10. 上下文解析器。

### 当前实现的诚实边界

目前运行时代码只是小型起步实现：
- 带类型／冻结的观察记录；
- 时区／来源／置信度验证；
- 体重观察类型；
- 描述性体重趋势估计；
- 稀疏／时间范围条件下默认拒绝行为；
- `OBSERVATION_ONLY` 状态。

其余模块目录是**目标架构／文档，不是已实现健康模型**。

### 城市位置

- **05/01 综合健康医院 — 主要。**
- 原始穿戴／设备采集仍是 **08 设备边缘区边界**，不是 Parama 所有权主张。
- 健康数据隐私／同意规则连接 **04 法律隐私区**。
- 此项目 PersonalContext 表示**健康受试者状态**，不是 03 居民身份。

## 已完成项目审查：drug-simulator

**快照：** `23cbe9b8a416bc1023bd3ddf9e3bfd1629e05c9a`
**实现状态：** `DESIGN_ONLY_EXISTING_PROJECT`

### 项目身份

Drug Simulator 是证据治理的机制药理模拟器，面向固定的用户提供化合物／给药方案。

设计功能群：
1. 输入／规范化；
2. 生理基线；
3. 给药／方案时间线；
4. PK／ADME＋有效暴露；
5. PK 药物相互作用；
6. PD 靶点／通路；
7. 生理终点；
8. 不良效应归因；
9. 单药与组合比较；
10. 药理证据图／治理；
11. 参数／模型／证据不确定性；
12. 报告与重叠验证森林。

### 当前实现的诚实边界

仓库目前只有设计文档（`README.md`、`idea-structure.md`），没有运行时模拟器代码，因此城市状态为**仅设计**，不是局部实现。

### 城市位置

- **05/02 药理模拟中心 — 主要。**
- 即使未来共享通用证据工具，药理证据／PK／PD 知识仍为健康域知识。
- 项目与“Research OS”的关系是方法论，不将药理领域内核移入 06 研究区。

## Parama ↔ Drug Simulator 关系

二者**不是组合联合**。

```text
Parama PersonalContextSnapshot
        ↓ 生理基线投影
Drug Simulator PK/PD/DDI
        ↓ 暴露／机制／终点／不确定性
Parama Exposure Context + State Estimator
```

Parama 拥有纵向全身状态／上下文；Drug Simulator 拥有药物机制模拟。“生理”“暴露”“不确定性”等相似词汇处于不同抽象层。

## 已完成项目审查：Quant-ultra

**快照：** `1988d9a8530da91a8158de864d098ea869098923`
**仓库状态：** `EXISTING_IMPLEMENTATION_ON_HOLD_NOT_PRODUCTION_QUALIFIED`

### 项目身份

Quant-ultra 是金融域量化研究／回测／组合／MLOps 流水线。当前 `Quant-4` 树具有可执行的九阶段编排实现，包含模式检查的依赖与可缓存／恢复阶段输出。

### 当前能力分解

1. **阶段 1 — 市场数据基础：** 标的池／筛选、收益／交易状态基础、幸存者偏差／PIT 支持、ADV／AUM 输入。
2. **阶段 2 — 时间切片与验证：** 训练／验证／测试切片、隔离期和时间验证。
3. **阶段 3 — PIT／市场状态／特征：** 时点设置、数据防护、市场状态与特征构建。
4. **阶段 4 — 标签与加权：** 分类／回归标签、借券相关上下文与样本加权。
5. **阶段 5 — 模型训练与校准：** CV、特征处理、拟合、分位数模型和校准。
6. **阶段 6 — 组合构建：** 方向筛选、Black-Litterman 融合、感知不确定性的凸仓位确定。
7. **阶段 7 — FSM 回测／执行模拟：** 持仓／现金状态、执行成本、市场约束、风险防护与对账。
8. **阶段 8 — 审计与压力：** DSR、覆盖检查、压力测试及具有否决语义的容量审计。
9. **阶段 9 — 影子 MLOps：** 影子对账、分布漂移／PSI 监测、遥测和分层模型更新状态。

### 实现的诚实边界

代码真实存在，但本审查**不**将其提升为生产交易：
- README 明确表示项目暂停；
- 项目自身工作日志仍将数据来源真值／稳定性列为未解决关注；
- 缓存／模型刷新行为也标为待审；
- 阶段 9 含生产导向接口和影子／对账逻辑，但城市不据此推断已验证真实券商部署；
- 规划阶段 10 视觉报告、阶段 11 本地 LLM 解释不是当前已实现能力。

### 城市位置

- **07/01 量化实验室 — 主要所有权。**
- 06 研究区可通过道路使用 Quant 作为领域内核／实验目标，但不拥有市场／组合／回测语义。
- 市场数据仍为金融域数据，不仅因属于数据摄取就迁往 09。
- 交易／回测／MLOps 执行仍在 07，不仅因自动化就迁往 10。

本项目特别自包含：与 Boss／Hns 不同，其多数有用能力保留于单一领域建筑内。

## Owner 排除仓库（2026-09-29）

下列仓库按 Owner 明确决定保留于活跃城市拓扑之外：
- `privacy-lens-research-artifact`
- `Idea-Book`
- `Task-Board`
- `Application-Plan`
- `research-overview`
- `Essay-Book`
- `Harness-Alien`
- `Harness-Mega`

它们没有活跃建筑／房间／道路／供体所有权；GitHub 历史仍可存在于 Digital-City 之外。

## 已完成项目审查：Boss-Qualification-Control

**快照：** `24bf31e7beee5adb0e94e6496a7114769b3b21f4`
**位置：** 01/03 资格验证控制平面。

私有资格验证控制平面将真实自托管长期浸泡运行器与公开 Codex-Boss 工作流隔离。它将资格验证绑定到不可变 Boss `main` SHA，经受保护环境要求 Owner 批准，运行真实资格验证链，仅导出脱敏证明／溯源。它不是 Boss 开发表面，也不拥有 Root Authority。

## 已完成项目审查：dsh-health-scheduler

**快照：** `985e2b7389330db4b32ea2946e3657746c64b47b`
**位置：** 02/03 主机健康站。

拥有遥测摄取／规范化、滚动历史／趋势、重启压力评分、未知／覆盖语义、防抖策略及维护／安全点调度。可限流／暂停或请求重启，但**绝不执行重启**。

## 已完成项目审查：dsh-restart

**快照：** `e20fb6cc43e27cedf6303471e5b8ee18e1383ecd`
**位置：** 02/04 重启恢复站。

拥有重启请求验证、锁／冷却／去重、检查点门禁、带校验和票据、优雅关闭请求、外部监督器／重启、崩溃循环安全模式与审计记录。它不决定重启是否必要。当前审查保留仓库记载的两个实现限制：没有有界 `WAITING_FOR_EXIT` 截止时间；强制终止支持已声明但未使用。

## 已完成项目审查：General-Logic-Engine

**快照：** `66e93b3351672f109dbfc5760f90316ee9163b4b`
**状态：** 仅设计基线。
**位置：** 00/05 控制中心后端组件。

设计能力：带类型可执行实体／关系／状态／事件／规则／约束／证据图、时间线传播、不确定性／证据状态、假设分支和解释轨迹。目前仍是推理／解释后端概念，不是城市权威，也不是可运行跨域引擎。

## 已完成项目审查：Auto-Game-Bot

**快照：** `9b9a0cd9a3be944d79992b9a7870d0f631390152`
**状态：** pre-alpha 起步包。
**位置：** 10/02 自主环境探索器。

主要目标能力：DISCOVER／LEARN／COMPILE／RUN 生命周期、结构化世界状态、混合导航／恢复、语义技能、因果世界模型、前沿／覆盖率／遗漏风险、验证调度器、完成审计及证据／缓存压缩。

当前实现刻意更小：可安装 Python 起步包＋有防护阶段／状态契约＋CLI／测试。尚未实现真实感知、游戏适配器、输入控制与自主学习。它位于通用 Computer Use Runtime **之上**，不替代它。

## 已完成项目审查：My_VR_Glove

**快照：** `0775f593daa915d8d9f393f2665d3193c289e09c`
**位置：** 08/01 触觉手套。

已有 ESP32／LucidGloves 衍生固件实验，具有单遍串口解码、非阻塞环形缓冲 I/O、高频舵机触觉及软件功率预算限制。它是设备／固件建筑，不是娱乐逻辑，也不是已获生产资格的硬件。

## 已完成项目审查：ML-Quant-A-stock

**快照：** `0a31783cfdf5131e2f1c2c9f5dd116af3a9c9589`
**位置：** 07/01 量化实验室，**仅历史特征供体**。

旧 CQR／Black-Litterman／MVO 流水线已被 Quant-ultra 取代。三项独立已实现实验保留为供体溯源：
- `LLMTextAnalyst`：外部新闻／文本语料 → 结构化数值资产观点，带模拟回退；
- 在 CQR 不确定性＋文本观点上进行 DP-GMM 资产群组分层；
- 实验性群组／失谐衍生非对角 Omega。

这些不形成第二金融建筑；在有意移植并重新验证前保持未激活／未获资格验证。

## 已被取代审查：Personal-trading-project-for-fun

此仓库是早期仅概念 A 股流程（抓取／筛选／信号／ML 建议价格）。Quant-ultra 用深得多的已实现流水线覆盖此范围。状态：**SUPERSEDED_BY_QUANT_ULTRA_NOT_ADMITTED**。

## 已审课程作业，无城市抽取

### 301DataBaseProject

这是本科电竞数据课程仓库，围绕 Apex Legends 数据集、Jupyter 分析、处理后 CSV 和 Tableau 仪表盘。

有用技能／产物作为课程历史存在，但审查没有发现值得抽取的**独有可复用城市能力**。数据清理、分析笔记本和仪表盘构建是通用能力，已由其他更强运行时／研究／数据界面覆盖。

**决定：** `COURSEWORK_REVIEWED_NO_EXTRACTION_NOT_ADMITTED`。

### CapstoneProject499-Department_Manage_System

这是规模较大的本科院系管理 Web 应用，使用 React、Express、PostgreSQL、JWT 认证、CRUD 服务、课程／服务角色分配、绩效仪表盘及广泛 Jest／Supertest 测试套件。

项目完整度足以作为课程证据，但其可复用机制属于以下之一：
- 普通 Web 应用基础设施；
- 与院系管理语义紧密绑定；
- 已被更强城市身份、治理、数据和控制平面系统取代。

没有能力足够独特，可以支持供体抽取或城市建筑。

**决定：** `COURSEWORK_REVIEWED_NO_EXTRACTION_NOT_ADMITTED`。

## 已被取代的隐私前身

### GDPR-app

基本为空／初始前身仓库。

**决定：** `SUPERSEDED_BY_PRIVACY_LENS_NOT_ADMITTED`。

### GDPR-project

规模较大的历史 Privacy Lens 实现／论文仓库，是清理后的 `privacy-lens-research-artifact` 直接前身。

后继产物已明确由 Owner 排除于 Digital-City，因此将更旧前身保留为城市资产会倒置谱系并制造重复所有权。

**决定：** `SUPERSEDED_BY_PRIVACY_LENS_NOT_ADMITTED`。

历史 GitHub 证据仍在城市注册表之外可用；不执行运行时／模块迁移。

---

语言配对 / Language pair: [English](../../PROJECT_REVIEW.md) · [中文](./PROJECT_REVIEW.md)
