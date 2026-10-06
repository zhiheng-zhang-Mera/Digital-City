# 历史Mission Index v1完整中文读本

[原稿](../MISSION_INDEX-v1.md)。保留当时静态状态，不用于重新激活历史任务。代码/路径/城市模块名称是技术标识。

# Mission Index

> 排序只表示当前纯迁移队列的默认施工顺序。**每个 Mission 文件自身的 Claim/Complete 字段才是运行时真值。**

| Seq | Mission | Enabled | Migration | Verification | 主要来源 | City target |
|---:|---|:---:|:---:|:---:|---|---|
| 1 | [MB-001](../../../replant/MB-001-core-os.md) | YES | COMPLETE | **COMPLETE** | zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 00/01 City Core — Runtime Trust & Orchestration Kernel |
| 2 | [MB-002](../../../replant/MB-002-capability-fabric.md) | YES | COMPLETE | COMPLETE | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 + DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973 | 00/03 City Service Network — Capability Registry & Discovery |
| 3 | [MB-003](../../../replant/MB-003-worker-gateway.md) | YES | COMPLETE | **BLOCKED_OWNER_DECISION** | DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973 | 02/02 Worker Gateway — Engineering Provider Adapter Layer |
| 4 | [MB-004](../../../replant/MB-004-project-foreman.md) | YES | COMPLETE | COMPLETE | DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973 + Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 02/01 Project Foreman — Engineering Task Orchestrator |
| 5 | [MB-005](../../../replant/MB-005-host-health.md) | YES | COMPLETE | COMPLETE | zhiheng-zhang-Mera/dsh-health-scheduler @ 985e2b7389330db4b32ea2946e3657746c64b47b | 02/03 Host Health Station — Runtime Health Scheduling Service |
| 6 | [MB-006](../../../replant/MB-006-restart-recovery.md) | YES | COMPLETE | **COMPLETE** | zhiheng-zhang-Mera/dsh-restart @ e20fb6cc43e27cedf6303471e5b8ee18e1383ecd | 02/04 Restart Recovery Station — Safe Restart External Supervision |
| 7 | [MB-007](../../../replant/MB-007-research-institute.md) | YES | **BLOCKED_OWNER_DECISION** | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 06/01 Research Institute — Research Mechanism Experimentation Platform |
| 8 | [MB-008](../../../replant/MB-008-computer-use.md) | YES | **BLOCKED_OWNER_DECISION** | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 10/01 Computer Use Runtime — Generic Computer Interaction Execution Service |
| 9 | [MB-009](../../../replant/MB-009-theme-relocation.md) | YES | COMPLETE | COMPLETE | Utopia main 当前 city/11-entertainment/01-entertainment-centre/theme-engine | 00/05 City Control Centre — Presentation & Theming |
| 10 | [MB-010](../../../replant/MB-010-node-fabric.md) | NO | NOT_STARTED | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 00/02 City Node Network — Device Node Fabric |
| 11 | [MB-011](../../../replant/MB-011-customs.md) | NO | NOT_STARTED | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 01/01 Customs Security — Extension Admission Checks |
| 12 | [MB-012](../../../replant/MB-012-runtime-compliance.md) | NO | NOT_STARTED | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 01/02 Public Security — Runtime Compliance Enforcement |

## MB004依赖历史：已经解决，保留而不重复争论

MB004声明依赖MB003。MB003 migration_complete但Verification未关且branch未进main。rule7从目标最新main切branch，Alien在2026-09-29T13:02:19Z按保守定义（依赖产物进入main才满足）改领MB006；Mech按仅migration_complete满足的较宽解释领取MB004。mission-book未规定哪种正确，两种同时记录而不冒充规则。MB004已领，领取争议当时失去意义，但Verification须判断main缺MB003的Foreman是否能验收，合并也需处理双方city/02-engineering。

## MB004复检如何解决：Alien2026-09-29

合并时无问题：MB004没改MB003路径，main从双方都没得到缺失模块，共享manifest/census/two capability fixtures取union。复检无法执行“经MB003 Worker Gateway跑真实Engineering job”，因为Gateway只在未合分支、MB004迁入代码零耦合，只导入node内建/相对mjs。判断条款实质——真实Engineering从inspect/plan到result/evidence，禁止单测替代——由真实四阶段pilot及杀进程resume4步而非6步满足；路由条款记NOT_EXERCISED，不制造donor双方都无的glue（MIGRATION_ONLY禁）。详见[MB004报告§6.1](../../reports/MB-004/VERIFICATION_REPORT.md)。MB003当时BLOCKED_OWNER_DECISION，所以等待其合入后重验也受Owner gate。

## 跨任务观察：领域模块改变已接受capability面

MB004使Web/Androidcapability从5变6，project-foreman以BRIDGE_PENDING出现且不可调用。两端Run禁用，诚实不违rule14，但违MB001 DISTRICT_KINDS初衷：无产品操作模块不应宣传capability。MB002位于infrastructure00-foundation幸免，MB004在domain02-engineering不被过滤。复检没修，因为改registry语义/manifestfield超rule10/11。请求Owner决定统一城市机制，如未合MB003/006/007/008已用capabilityProvider:false，而非各任务独修。详见[MB004§6.2](../../reports/MB-004/VERIFICATION_REPORT.md)。

## MB005：双主机条款与被削弱测试的修复

门槛“两台主机分别用真实telemetry跑正常、unknown/missing、持续压力/debounce”。rule5只许一个复检主机、禁第三，本session一台，所以保留两种解释：参与角色定义由迁移主机证据+复检真实运行满足；两台物理机器定义本次无法满足。与Mech MB006§5.2同形，不虚构第二机器。

migration5fbbec6削弱既有capability-registry duplicate-name测试：fixture移到末district11-entertainment仅一building，唯一性断言退成单元素永不失败。977cd0c修到两building的09-planning-knowledge并断言count；详见[MB005§3.3/6.1](../../reports/MB-005/VERIFICATION_REPORT.md)。donor bandKeyOf bug被正确迁入而非修，报告§7.2请Owner裁。

## Owner请求：MB009合并用共享marker细化解决两已验Mission冲突

MB001将00-foundation标infrastructure，registry以此排除capability resolution。MB009 City-map目标00-foundation/05-control-centre/theme-engine导致merged-tree presentation.theme.lab DEGRADED、accepted5服务变4。复检拒绝改变district kind、迁离指定owner或弱化MB001测试，改为按building可细化kind：05-control-centre=domain、manifest验证并提供buildingKind单决策点；registry从所有声明module建resolution index而保留两个枚举排除。所有旧输入行为不变，kernel断言加强，不转ownership不加capability，但改共享文件及MB001测试所以报Owner。选项[MB009§5.4](../../reports/MB-009/VERIFICATION_REPORT.md)：接受building-level kind城市机制，或Owner用superseding Mission重画归属。

## 对MB005报告的纠正

pilot“restart shared gateway”未执行：spawnSync pwsh因PATH无pwsh ENOENT，roundtrip用旧进程。telemetry仍有效（没改Gateway源码），报告已就地修正。MB009用powershell.exe，另证明stale Gateway仍服务内存registry直到真实重启。

## Owner请求：产品消费门槛阻塞两个Mission，MB009将是第三

“至少一次真实产品消费，只复用现有UI/client”仅在MB001/003/006因既有路径恰有精确mechanism重接可满足。MB007/008为基础设施/pipeline迁移，诚实consumer需要新产品面，但rule14不许为验收创建。MB008通过执行donor对live Utopia表达，为每candidate给反例并返回NO_VERDICT_IDENTICAL_SEAM，属实测结构结论而非困难报告。两任务全部port/parity-test/capabilityProvider:false注册、required CI绿，可将任一裁决应用到已施工结果。各报告最后节三选项：1接受边界改门槛；2每任务授权一个具名consumer；3rule13明确superseding Missions。rule13也禁Owner裁前第三主机接管MB007/008。

## Selection rule

```text
1. enabled + unclaimed + MIGRATION incomplete + dependencies satisfied
   → sequence ASC
2. if none:
   enabled + migration complete + unclaimed VERIFICATION + different host
   → sequence ASC
3. claimed-but-incomplete / disabled / blocked
   → skip
```

不要把本表的静态状态当作 Claim 真值；领取前必须打开对应 Mission 文件并读取最新 Digital-City main。

## 待处理：本表之外的已知缺陷（不是任何 Mission 的门槛）

> 记录于此，避免只存在于某一台主机的 git-ignored 证据里。下列各项都由 Mission 报告自己建议作为**独立改动**处理，均**未**在本表任何 Mission 内擅自修复。

1. **`city/manifest.mjs` 看不见未声明的 module 目录。** `checkManifestAgainstTree` 只遍历 manifest 已声明的 module，从不反向遍历目录树，因此在 `city/` 下放一个带代码、没有 manifest/census/`DONOR.json` 条目的 module 目录，所有检查仍然全绿。MB-004 与 MB-005 的报告各自独立提出过这一点；`Mech` 在 `main@ce33792` 上用变异测试**确认**了它，并补充了更尖锐的一种情况：**空目录同样不可见**。修它要改 `city/manifest.mjs` 与 census 契约，超出所有已完成 Mission 的边界。
2. **`tests/capability-adapters.test.mjs:31` 仍断言整份 manifest 的 `catalog.length === 6`**，而 MB-001 报告的 D8 描述把该断言说成"已收窄到被测 module"。描述与代码不一致；锚点在其上一行按 moduleId 查找，因此不是缺陷，但下一次有人加 adapter 时会误伤。
3. **`DONOR.json` 台账形状不统一**：MB-001 用扁平结构（`repository`/`commit`/`sourcePaths` 在顶层），MB-002/004/005/006 用 `donors[]`；两类都自洽，但按一种形状写的读取器读不了另一种。
4. **规则 5 会让某些 Mission 对某些主机永久不可领取，本表看不出来。** MB-005 与 MB-009 的 Migration 由 `Mech` 完成，因此 `Mech` 永远不能领取它们的 Verification；但本表那一行原先写着 `NOT_STARTED`，读起来却像"任何主机都能领"。这两台最终由 `Alien` 完成（City `1ac40d4`、`0764924`、`d6969d9`），问题已解；不过只要 rule 5 与"先迁移后验证"的队列同时存在，索引就应当能表达"哪台主机**不**能领"，否则每台自动施工主机都得自己推导一遍。这是索引的可用性缺口，不是缺陷。
5. **MB-003 的验证门槛在本机不可满足**：第一道门槛要求用**已安装且 donor 已支持的真实 provider** 跑通 detect→submit→progress→result/unsupported，并明确禁止 mock pass；迁移的 `provider-adapter` 只包装调用方注入的 hook，其 `DONOR.json` 把真实 provider HTTP 调用与 web session 列为 DEFERRED。`Mech` 已在 `reports/MB-003/VERIFICATION_REPORT.md` §6 列出三个 Owner 选项；在其决定前 MB-003 与依赖它的 MB-004 都无法进入 `VERIFICATION_COMPLETE`。

选择规则完整中文：enabled且unclaimed且迁移未完、依赖满足，sequence升序；无此项则enabled且迁移完成、verification未领、不同主机，sequence升序；已领未完/disabled/blocked跳过。
