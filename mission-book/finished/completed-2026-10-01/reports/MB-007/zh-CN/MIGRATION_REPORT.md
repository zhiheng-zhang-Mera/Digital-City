# 迁移报告 — MB-007

[English authoritative source / 英文权威原稿](../MIGRATION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION = MB-007
ROLE = MIGRATION
HOST = Alien
CLAIM_COMMIT = c6ff44f4bd6e2a711a2e838d1efd04e61fd0b5e4
DONOR_BASELINE = zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080
IMPLEMENTATION_BRANCH = mission/MB-007-research-institute
IMPLEMENTATION_HEAD = 71267e83570f5749bb2d1cf9537040ef0af869eb
IMPLEMENTATION_CI = 36577840443 PASS (gateway-web + android)
MIGRATION_HEAD = 68015caa71b7788f700abb1c7918d1b5ee8f9e8c
MIGRATION_CI = 36578310170 PASS (gateway-web + android)
MIGRATION_COMPLETE = false
```

> ## ⚠ 本迁移未完成，主机不声称完成
>
> 移植已完成、测试且全绿，但 Mission 自身“至少完成一次真实产品消费；UI/客户端要求仅复用当前存在的 Utopia 消费面”门槛未满足。第 4 节说明为何不能在本 mission 边界内满足。按规则 13 标记 BLOCKED_OWNER_DECISION，而非 migration_complete:true。
>
> 请求 Owner 决定的内容在 §4 D1；其余工作不受阻，五模块已落地、一致性测试、注册且必需 CI 全绿。

## 1. 落地边界

目标为现有建筑 city/06-research/01-research-institute，已有迁移 evidence-engine。五新模块为同级；没有为行为读取、包装、重新导出或 fork evidence-engine，两个模块自身套件断言源码不提它。

| 模块 | 冻结供体源码 | 测试 |
|---|---|---|
| research-protocol | src/shared/research-ir.ts、research-protocol.ts、research-contract.ts、research-roles.ts、research-command.ts | 35 |
| research-provenance | src/shared/research-citation.ts、research-bibliography.ts、research-input.ts | 18 |
| research-statistics | src/shared/research-statistics.ts、research-battery.ts | 24 |
| research-manuscript | src/shared/research-figures.ts、research-manuscript.ts | 21 |
| research-review | src/shared/research-review.ts、research-adjudicate.ts、research-levela.ts、research-levelb.ts、research-capability-registry.ts | 44 |

新增 142 模块测试。17 供体文件均纯，整组五 import、四仅类型、无 node: 内建，因此边界为供体自身纯层；electron/research/** 运行层不动。每模块 DONOR.json 有 mission 块，四者声明 UTOPIA_EXTENSION:[]。

**独立一致性证据，而非自洽：**

- research-manuscript：Node24 类型剥离实际执行真实供体，对移植差分 1590 比较，0 不匹配，覆盖每可达导出及 NaN／Infinity／负数／空／41柱／长标签／畸形输入。validateManuscriptPlan 对供体源码比较，因为未导出，运行时擦除、不可达。
- research-statistics：两端抽取全部 16 移植函数体，中和 TS 注解后相同；49 原因字符串、缺失标签、场景标签、数字默认均确认供体逐字存在。
- research-protocol：五供体文件 136 单行字符串除两有意差异都在移植，差异为 ./research-ir import specifier 和模板引号风格。
- research-provenance：13 拒绝消息字节相同，含 `(1–20000 chars)`、`1–5 runtime ids` 的 en dash。
- research-review：词汇对只读供体字节比对，Level-A 算术先对逐行转写检查八输入组合，再固定预期数。

**供体缺陷原样保留，绝不修复。** MB006 报告支持此纪律，本次每移植明确受指令。以下均有测试固定实际行为并记录 knownDifferences：

- statistics：不可达 READY→REPLICATION_FAILED 降级原样；READY 仍忽略 replication；INCONCLUSIVE／INSUFFICIENT_EVIDENCE 仅读自身两个输入；bootstrapCi alpha=1 仍 lower>upper（2.75／2.25）；无舍入／钳制，confidenceInterval([1,3]).lower 固定 0.040000000000000036。
- manuscript：evidenceCheckDraft 的 asserted 以 !allowedEvidenceIds.includes(id) 过滤，丢掉本应报告的已简报但不可用 ID；slice(0,20) 在合并引用前，25 越界引用全回来，文档 20 上限不成立；metricFigureSvg 非有限值印 n/a 却仍 y="NaN" height="NaN"；resultTableToMarkdown 仅转义行标签和脚注。
- review：adjudicateClaim 仍忽略接口 verifiedCitations，不发明引用阶梯；保留 ?? "no evidence" fallback 和死 AVAILABLE 初值，不“清理”。
- provenance：proposedAuthors／proposedVenue／sourceRef／updatedAt 与 reviewer 条目未查；bibliographyEntries 无验证／去重，同记录两次渲染两次、顺序保留；summarizeCitationAudit().ok 仅 UNSUPPORTED／CONTRADICTED 为 false。
- protocol：scientificCore／diffProtocol 保留宽松读取，不调 protocol factory。

**明确未迁移：** 整个 electron/research/**，含 research-conductor.ts、research-service.ts、research-supervisor.ts、research-ledger.ts（原稿标 D7）、protocol-manager、文献 host-retrieval、manuscript 的 latex-compiler／manuscript-assembler、运行 process-runner、持久 ledger／resume。mission 的“持久账本／恢复／部分失败如实性”未覆盖，因为实现文件均耦合 fs；明确记录而非静默遗漏。

**契约／接口边界：** 普通可序列化值上的纯函数，无 fs／网络／process.env，时间与 ID 注入。provenance 将 Math.random 改可注入 hexDigit，默认 crypto.randomInt(16)，相同 0–15 范围／ID 形态，now 为必需；review 的 buildExperimentSpec 时钟为注入 now，默认确定 epoch 哨兵；statistics 不需注入，因为仅自身种子 mulberry32。供体 new Date(0).toISOString() epoch 默认逐字保留。

现有 Utopia UI／真实消费路径没有，见 §4。

## 2. 测试与运行

- 单元／契约／一致性 142 测试。完整 CI 等价：pnpm test58/58、rooms67/67、city272/272、promotion10记录、pnpm check:docs PAIR_STATUS=SYNCHRONIZED。
- 真实消费没有（§4 D1）。
- 无需纠正保真缺陷：每移植明确“不得添加供体没有的策略”，本次落实。唯一暂时失败是五移植并发落地时同级模块 ENOENT，自行消失。记 TEST_PASS MB-007:7e34545988213a8f，无 TEST_FAIL，这也是如实记录。
- 已知限制：原稿指向第 6 节。

## 3. Utopia 狗粮／演进交接

收件箱 data-records/evolution/inbox/mission-book/MB-007/events.jsonl：

| 事件 | 类型 | 结果 |
|---|---|---|
| MB-007:aed2f98461218646 | MISSION_CLAIMED | INFO |
| MB-007:7f6b677adfbaac18 | ATTEMPT_STARTED | INFO |
| MB-007:fc41b3618a0f97f8 | CHANGE_APPLIED | INFO |
| MB-007:7e34545988213a8f | TEST_PASS | PASS |
| MB-007:7d6c861428278c83 | RUNTIME_FAIL | BLOCKED — 消费门 |
| MB-007:4b2456330916b878 | CI_RESULT | PASS — 仅 CI，非完成 |

刻意无 MIGRATION_COMPLETE，因为门未满足。无候选证据发布到 evidence/raw/mission-book/MB-007/。供体清单直接来自 checkout，本 mission 无单独调查工件。

## 4. 施工问题、选择与判断逻辑

**D1 — ⚠ 产品消费门未满足，mission 等 Owner 决定。** 门要求现有 Utopia 消费。五模块为 IR／protocol、来源、统计、手稿组装、审查／裁决研究流水线。搜索运行产品仅一处消费研究行为：registry.mjs 单能力 research.evidence.review 绑定 evidence-engine，adapters.mjs 调用。它同建筑但不同模块，MB007 明确禁止再实现且验证门要求判定不变。

每候选重接线不能成立：

- 指向新模块或由其拥有判定会改变 Evidence Engine，违反“无第二引擎”和“现有验收与引用关系保持通过”。
- 添加 research.evidence.review 操作／新研究链 adapter 会改 Web／Android 能力列表，破 capability-adapters.test.mjs 与 capability-bridge.test.mjs 的五 adapter 清点。这是规则14禁止伪装成迁移的新产品界面，MB007 另禁“为迁移新增新的论文工作流或外部数据源”。
- 唯一等价重接为 scripts/resource-pilot.mjs 内聚合 RSS 的 mean。scripts/ 不是规则14消费面，替换算术只装饰非消费，记录真实产品消费正是规则防的夸大。
- 验证门要求“使用 donor 已有能力完成一个有界的 protocol→evidence/statistics→manuscript/PDF 或等价既有链路”，表明完整研究链要运行，属于验证主机，验证运行不是产品消费。

选择不发明界面、不触 Evidence Engine、不标完成；门未满足，按规则13 BLOCKED_OWNER_DECISION，交 Owner。新能力为满足门接线会把产品决定伪装迁移，规则1／11／14 三处禁止。

Owner 具体选项：

1. 接受边界，将验证主机有界研究链执行视为满足并据此完成；需修改迁移门或明确裁决，非主机决定。
2. 授权特定消费，如现有 services 页面有界研究链，明确 MB007 授权，因为增加 Web／Android 能力。
3. 取代 MB007；规则13禁第三主机悄接管，无消费落地需明确 superseding Mission。

无论裁决，移植已完成，独立供体差分一致性测试，manifest 以 capabilityProvider:false 注册，产品面不变，必需 CI 绿。

**D2 — 顺序，为何 MB007 非 MB004。** 领取时 MB004 未领但依赖 MB003，后者 migration_complete 未验证／未合并，main 切分支不包含它。保守解读依赖满足，跳过；Mech 后按宽松解读领取。两解读已写 mission index 防重争，对 MB004 验证和合并仍重要。

**D3 — capabilityProvider:false 第三次。** domain 地区五新模块否则被 Web／Android 宣传为 unavailable 等桥。声明 false、registry 跳过；registry／manifest 修改与 MB003／006 字节相同，预计干净合并。MB001 同目的用地区 kind:infrastructure，四 mission 均此问题，见合并说明。

**D4 — ⚠ 四 mission 已修改相同 city 文件。** MB001／003／006／007 均从 c7ef3cd 切出，均改 CITY_IMPLEMENTATION_MANIFEST.json、manifest.test.mjs、city/docs/{en,zh-CN}/ARCHITECTURE.md。这是任务簿结构而非主机错误，最大落地风险。MB003 建议得到四倍支持：泛化模块级 capabilityProvider、退役 MB001 地区 kind；清点冲突取模块并集。

**D5 — research-input.ts 仅类型依赖。** 其 ResearchIR 来自 research-ir.ts 仅类型，protocol 移植形态。原边无运行依赖，模块本地声明最小输出形态而非跨模块导入；humanResearchToIR 是生产者，无调用者输入边界需验证，本地 typedef 正覆盖供体字面字段。bibliography→CitationRecord／CitationStatus 另一类型边换冻结词汇，两者 DONOR.json 记录。

**D6 — 环境。** pnpm 不在 PATH，用 corepack pnpm@11.19.0。mission:event -- --mission 转发字面 -- 失败；摘要超1000字符退出2，本次两次，均裁剪重录。此 Node 不接受 node --test <dir>。

## 5. 交给验证主机

验证阶段未开放。规则13禁止 BLOCKED_OWNER_DECISION 被第三主机接管，Owner 决定是否取代。认为可验证的主机先确认消费门已被 Owner 解决。

允许验证后独立审查提示：

- city/06-research/01-research-institute/*/DONOR.json 边界，knownDifferences 最有价值，保留缺陷各有实际行为测试。
- research-manuscript/manuscript.mjs、figures.mjs 的1590比较工具位仓外已删除，验证者应从 D:\Codex-Boss-donor 重新推导，不直接信报告。
- statistics.mjs 固定浮点如 confidenceInterval([1,3]).lower=0.040000000000000036，最快识别意外“清理”。
- registry.mjs／city/manifest.mjs 的 capabilityProvider 标记。
- §4 D1 阻断决定与三选项。

分支 mission/MB-007-research-institute，在 zhiheng-zhang-Mera/utopia，HEAD68015caa71b7788f700abb1c7918d1b5ee8f9e8c。托管实现 CI36577840443 PASS，领取阶段推送36576078261 PASS。迁移主机未合并、未运行 pnpm mission:finalize。
