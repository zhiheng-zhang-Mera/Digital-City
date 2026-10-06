# Digital City 城市总览与架构

[English counterpart / 英文完整说明](../en/CITY_OVERVIEW_ARCHITECTURE.md)

本仓库是互联数字生态的城市地图、能力登记与集成模型。Digital-City不是实现代码的单体仓库，而是说明独立维护的项目如何组成共享城市。长期能力清单位于[capability-registry](../../capability-registry/README.md)，对应语义能力、实现位置、已验证exact SHA、可见信息、控制、UI入口、可达性和意图验证。

## 双语命名与规范层级

目录命名：`编号-隐喻中文(English-Metaphor)-&-实际中文(English-Technical-Type)`。左侧是面向人的城市隐喻，右侧是实际架构类型。

层级是City → District → Building → Room/Capability，另有共享City Infrastructure和跨域Roads。城市基础设施供全城共享；功能区定义一级领域；楼栋定义连贯机构/产品/服务边界或明确的未来占位；房间是楼栋拥有的能力；道路是稳定的跨边界语义契约。目录拓扑与项目归属是不同事实。

## 功能区映射

| 区 | 实际类型 | 已记录映射状态 |
|---|---|---|
|00 城市地基|全城共享基础设施|PROJECT_FIRST_PARTIAL / BOSS_PRIMARY|
|01 市政治安|治理与安全域|PROJECT_FIRST_REVIEWED_PARTIAL / QUALIFICATION_CONTROL|
|02 工务|工程运维域|PROJECT_FIRST_REVIEWED / HNS+HEALTH+RESTART|
|03 居民|数字身份代理域|PROJECT_FIRST_REVIEWED / DIGITAL_ME|
|04 法律隐私|法律隐私治理域|STRUCTURAL_EMPTY_BY_DESIGN|
|05 医疗健康|健康数据服务域|PROJECT_FIRST_PARTIAL / PARAMA+DRUG_SIMULATOR|
|06 研究院|研究实验域|STRUCTURE_READY / IMPLEMENTATION_PARTIAL|
|07 金融|金融量化域|PROJECT_FIRST_REVIEWED / QUANT_ULTRA|
|08 设备边缘|设备边缘计算域|PROJECT_FIRST_PARTIAL / VR_GLOVE|
|09 规划知识|规划知识管理域|IMPLEMENTATION_PARTIAL / RUNTIME_KNOWLEDGE_ONLY|
|10 自动化|自动化执行域|PROJECT_FIRST_PARTIAL / COMPUTER_USE+AUTO_GAME_BOT|
|11 娱乐|媒体沉浸交互域|PARTIAL_PROJECT_CONTRIBUTIONS / NO_PROMOTED_DOMAIN_MODULE|

上表是原总览记载的映射，不能替代当前实现/运行时验证；实际导航见[主页](../../README.md)。

00共享设施分为01城市核心（运行信任编排内核）、02城市节点网（设备节点互联层）、03城市服务网（能力注册发现层）、04城市道路（跨域语义契约）、05城市控制中心（人机控制界面）。核心回答运行时authority、trust、identity和orchestration归谁；节点网回答哪些授权设备/节点及资源存在；能力网回答城市能力、提供者、发现和注册；道路回答跨边界契约；控制中心回答人如何观察、导航和提交控制请求。能力网比plugins更广：plugin只是一种打包/准入形式。

保留的Customs Security占位是逻辑扩展准入检查，默认不要求独立服务；Public Security是逻辑运行时合规执行，是否抽取独立服务取决于条件。空的功能区/楼栋不会阻挡Utopia产品可用性。

## 未来工作路由与生命周期

新的软件、论文、硬件或混合项目，必须先按工作自然归属分类，不能先猜哪个城市区会消费它。

### A：Utopia原生能力

只有主要属于Utopia产品自身能力时才选这条路。默认出生于`Utopia/apps/rooms`中的孵化或本地产品Room。生命周期为LOCAL_PRODUCT/INCUBATING → 可用本地产品 → 测试及实际/本地验收 → ACCEPTED_LOCAL。此时判断是否可复用城市能力：否则可永久保持LOCAL_PRODUCT；是则成为PROMOTION_CANDIDATE，经City placement review后PROMOTED。

禁止先创建城市Building/Module再寻找实现。晋升意味着稳定的城市owner和验收边界。晋升后不能只因为曾有孵化器而维护两份活实现；即使孵化实现退休，也保留donor来源、晋升记录和Git历史。

### B：独立软件、论文、硬件项目

独立产品、研究/论文、固件/电子/CAD/设备或软硬混合工作在各自正常仓库出生、开发和验收。完成后评估可复用贡献，贡献可直接进入合适的City归属；不要求先成为Utopia Room。城市消费项目贡献，不改变项目原本的开发authority。

### Utopia作为经验学习器

Utopia可观察独立项目工作中的结构化经验和过程证据，用于其经验学习；学习侧通道不能成为第二个任务或项目authority。项目仓库始终是正常开发与实现真相；`.utopia-history`只承载学习证据，不是规则authority。

新设计或讨论先分类再提City placement：Utopia原生能力先在apps/rooms孵化；独立软/论文/硬件项目在独立repo并以.utopia-history供料；未证明复用就不建City模块；稳定能力出现后按harvest → Utopia incubation/sandbox → qualification → City promotion。该规则防止三类反复错误：premature City admission（给仍是普通项目的想法先建Building）；development contamination（把Utopia学习历史变成项目指令）；unqualified promotion（跳过复用/验收门槛直接抽取项目代码）。原project-first inventory仍是有效的历史分类；未来默认按上述路由。

稳定分工：项目仓库负责出生及正常开发真相；Digital-City负责能力归属、登记与边界；Capability Registry负责已验证实现及暴露地图；Utopia负责产品终端、孵化器与经验学习器；学习历史是侧通道而非authority。

### 学习记录格式、继承边界与能力收获

项目仓库保留正常source/paper/firmware/tests/docs和`.utopia-history`。建议学习历史目录包含README、episodes、decisions、failures、acceptances和project-summary.json。记录以结构化、可检查的事实为主：项目/episode目标、尝试路线、变更或ref、失败类别、修复、测试/CI结果、中断与恢复、Owner干预、最终验收、必要时的成本/时间/资源元数据、source commit/artifact/evidence引用。不能把该目录当成永久存储原始终端日志、隐藏模型推理、凭据或秘密的垃圾堆。

独立项目从第一天即可向Utopia学习供料，而无需由Utopia拥有项目。供料包括commits/PRs/Issues、执行回执、测试/CI、失败/修复、Owner干预和验收，经`.utopia-history`进入Experience/Evolution feed。关键规则是“学习证据不等于指令继承”：历史临时绕行、失败尝试或旧决定不能自动升级为当前项目规则。当前truth仍来自活跃代码、当前文档/指令、已接受issues/PRs和当前任务context。

独立项目默认在正常开发期间不会逐步拆解为City模块。收口时，或更早但某能力已有多个真实消费者时，才做Capability Harvest Review。六项问题：能力是否在源项目之外有用；是否至少有一个额外真实消费者或具体Utopia/City消费者；契约是否稳定到可分离；独立测试是否更清楚；生命周期/失败/安全边界是否有实质差异；抽取是否减少重复而非增加维护债。

复用不成立时，NO_EXTRACTION是正常且优先的结果。抽取成立时，路径为project-local capability → extraction candidate → Utopia Room/sandbox incubation → independent acceptance/replay → City ownership review → promotion；禁止从“在Project A成功一次”直接跳到共享城市能力。

论文/研究项目仍是论文或项目artifact。其实验、失败假设、source选择、证据处理、claim修订和reviewer-response历史可以供Utopia学习，但只有可复用的研究机制才可后来晋升06 Research；论文自身不能仅因产生有用方法就成为City Building。

硬件/固件/CAD仍在自身项目仓库。Utopia可学习刷写失败、协议修订、延迟/功耗测量、传感器漂移、恢复和实体验收；只有稳定可复用设备契约/适配器才可后来晋升08 Device & Edge。

## 项目映射与实现追踪

历史重构前登记保持可追溯。每个模块/项目需要判断是否属于城市、归哪个区/楼栋、是基础设施/楼栋/组件/证据/历史资产、暴露哪些Room/能力、需要哪些Road。

Digital-City是规划、归属和边界的规范地图，不存放运行时代码。Utopia是当前产品/参考实现及合格城市模块的活跃落地位置；临时代码放在Utopia不会永久转移架构归属。

原2026-09-29快照记载：Utopia已有已验收Web/Android产品入口、V0.3能力桥及加固基线、晋升城市模块和Room Pack。Theme Engine的架构owner为00/05 Control Centre，即使历史Utopia路径仍在`city/11`。这是历史快照，不是今天部署证明。当前main见[自动状态](../../mission-book/UTOPIA_LIVE_STATUS.md)。

## 政策与证据导航

政策层级：L0 City Constitution → L1 District/Domain Charter → L2 Building/Project Policy → L3 Runtime/Experiment Rules。

- [项目清查](../../PROJECT_REVIEW.md)：已完成的仓库inventory。
- [重叠联合规则](../../COMPOSITE_UNIONS.md)：贡献重叠与union。
- [城市能力缺口](../../CITY_CAPABILITY_GAP_REVIEW.md)：清查后的冲突清理及产品优先结果。
- [实现快照](../../IMPLEMENTATION_STATUS.md)：绑定的历史实现快照和Digital-City/Utopia区别。
- [CITY_MANIFEST](../../CITY_MANIFEST.yaml)：机器结构登记。
- [CITY_PROTOCOL](../../CITY_PROTOCOL.md)：城市词汇与集成规则。
- [区模板](../../DISTRICT_TEMPLATE.md)、[楼栋模板](../../BUILDING_TEMPLATE.md)。

原总览阶段标签保留在英文同伴文档中，包括双语目录模式、project-first inventory完成、各donor分解/排除/重叠处理已记录、能力缺口review完成、registry bootstrap active、Theme ownership00/05、参考spine Node+Capability+Control、后续Utopia个人终端路径。标签表示原记录分类或规划，不能推导所有运行时能力已完成。
