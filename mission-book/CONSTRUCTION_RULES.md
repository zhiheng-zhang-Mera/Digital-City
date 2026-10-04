# Mission Book — 常驻施工规则

> **状态：ACTIVE / NORMATIVE / PERSISTENT**
>
> 本文件是 `mission-book/` 的长期施工规范。它不属于任何单次任务、programme 或阶段，**不得在任务完成、阶段冻结或项目收口时移动进 `finished/`**。
>
> 规则更新采用原路径版本化：修改本文件并通过 Git 历史追踪。归档任务只能记录当时使用的本文件 commit SHA，不复制一份“当前规则”进入归档作为新的权威来源。
>
> 当前监控看板：[README.md](./README.md)  
> 工作书模板：[MISSION_TEMPLATE.md](./MISSION_TEMPLATE.md)  
> 过程数据边界：[PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)  
> Capability Registry：[../capability-registry/README.md](../capability-registry/README.md)  
> Research signal watchlist：[RESEARCH_SIGNAL_WATCHLIST.yaml](./RESEARCH_SIGNAL_WATCHLIST.yaml)

## 0. 权威层级

施工事实按以下层级解释：

1. Owner 明确、较新的裁决；
2. 本文件 `CONSTRUCTION_RULES.md`；
3. 当前任务工作书的 task-specific scope / gate；
4. 当前任务 frontmatter 与 reports 中的动态领取、SHA、CI、完成事实；
5. README 监控看板。

**README 只做监控，不是锁、不是调度器、不是施工规则。**  
看板过期不能改变任务真实状态；普通 claim / CI / review 变化也不要求每次同步改 README。

### Capability Registry 的 authority 边界

- 当前任务的 claim / execution / Review / CI truth 仍以 Mission Book workbook/report + exact evidence 为准；
- 当前 capability inventory / implementation navigation / exposure/reachability 的长期 verified view 以 `capability-registry/` 为准；
- Registry 不能覆盖更强的 exact runtime/UI/E2E evidence；
- 若 Registry 与 observed reality 冲突，应标记 `CAPABILITY_REGISTRY_STALE` 或 `CAPABILITY_REGISTRY_REALITY_MISMATCH`，先保留冲突证据，再按 §14C reconcile。


旧规则、旧 dashboard、旧 response 位于 `finished/`，只用于追溯，不得覆盖本文件。

## 1. 为什么恢复这些规则

本文件吸收上一轮施工中已经真实踩过的坑，尤其包括：

- 单次“现在没有可领任务”被误判为任务池结束；
- 第二台主机因暂时没有资格领取而永久睡死；
- hosted CI / 长测试等待时施工主机空等；
- GitHub Actions Billing 恢复后，City frontmatter / dashboard 没及时回填；
- 用错误 branch/head 的绿色 CI 当成当前任务证据；
- 外部 blocker 与真实代码失败混淆；
- 为了不空闲而制造无价值的新工作或过度防御性扩张；
- merge/integration 基于旧 main 施工，最终覆盖或遗漏另一条已接受工作。

历史来源仅用于本次规则恢复：
- `finished/completed-2026-10-01/CROSS_PROGRAMME_EXECUTION_CONTRACT.md`
- `finished/completed-2026-10-01/ENGINEERING_BOOK-2026-10-01-ASYNC-DISPATCH-RECOVERY-AND-DRAIN.md`
- `finished/completed-2026-10-01/past-rules/2026-09-29-construction-rules-v1.md`

从现在开始，**本文件才是活跃常驻规范**。

## 2. 原子领取：Claim 不能靠看板猜

动态领取真相只存在于目标工作书 frontmatter / 对应 report。

领取必须：

1. 读取最新 Digital-City `main`；
2. 重新判断依赖、角色资格和当前 claim；
3. 只修改目标任务需要的 claim 字段；
4. 使用 fast-forward 更新；
5. 若 push 因另一主机抢先而失败，重新 fetch，重新扫描，不 force-push，不覆盖对方 claim。

禁止：
- 用 README 表格当锁；
- 一次领取同时“顺手刷新”一堆无关任务；
- 抢占另一主机仍有效的 claim；
- 为解决 claim race 使用 force push。

## 2A. Immutable Baseline Anchor / 不可变基准锚定

任何可执行工作书都不得把 branch/tag 名本身当作实现证据。

### 2A.1 只认 full commit SHA

以下事实必须使用 **40-character full Git commit SHA**：

- development baseline；
- dependency accepted head；
- integration source；
- review head；
- CI head；
- merge / acceptance head。

短 SHA 只允许在说明文字中辅助阅读，不能作为机器或施工判断真相。

### 2A.2 Branch 只是 discovery ref，不是 anchor

允许记录：

```text
baseline_candidate_refs:
  - refs/heads/main
  - refs/heads/<integration-branch>
```

它们只回答“去哪里寻找当前候选代码”。

真正 claim 时必须：

```text
fetch remote ref
→ resolve to full 40-char commit SHA
→ verify required ancestor SHA(s)
→ record exact development_baseline_sha atomically with claim
→ all later CI / Review bind to exact SHA
```

branch 在 claim 后继续前进不影响已领取任务的 baseline truth。

### 2A.3 Baseline anchor modes

工作书必须使用以下模式之一：

#### `REMOTE_REF_EXACT_SHA_AT_CLAIM`

用于独立任务。

- 从 `baseline_candidate_refs` 取候选；
- 解析 full SHA；
- 验证 `required_ancestor_shas`；
- 原子写入 `development_baseline_sha`。

#### `DEPENDENCY_SHA_UNION_AT_CLAIM`

用于依赖多个尚未统一进入同一 baseline 的 component task。

施工者必须：

1. 从每个 dependency workbook/report 读取其 accepted **exact head SHA**；
2. 从最新 eligible base full SHA 建 worktree/branch；
3. 显式 union/merge 这些 exact dependency SHAs；
4. 解决冲突；
5. 在任何本任务产品修改前跑 dependency smoke；
6. 将 union 后的 full commit SHA 写入 `development_baseline_sha`。

禁止因为 dependency marker 显示 COMPLETE 就从一个不包含其代码的 main 开工。

#### `FIXED_EXACT_SHA`

仅用于真正冻结的历史/只读复现任务。必须直接记录 full SHA。

#### `EXACT_SHA_PER_RUN`

用于 SHOWCASE / research capture 等只读运行任务。每次 run/take 都单独记录其 runtime full SHA；不同 run 不允许用“差不多同一版”混写。

### 2A.4 Required ancestor guard

`required_ancestor_shas` 表示候选 baseline **必须已经包含**的不可变能力下限。

claim 时必须对每一个 SHA 验证 ancestry。

任一不满足：

`BASELINE_ANCESTRY_MISMATCH`

任务不得开始，也不得自动改用“看起来相近”的 branch。

### 2A.5 未固定的 upstream 不准猜

若工作书依赖一个仍在开发、尚未产生 accepted exact SHA 的 upstream：

- status 必须是 `WAITING_DEPENDENCIES` / typed equivalent；
- 记录 upstream 名称与等待条件；
- `required_ancestor_shas` 不得填 branch 名、伪 SHA 或猜测值；
- upstream 一旦 accepted，先回填其 exact SHA，再解锁 claim。

### 2A.6 Review / CI 同样不认 branch

Formal Review 必须验证：

```text
reviewed head == recorded development_head_sha
CI head       == reviewed head / required final head
remote branch tip differences are informational only
```

若 branch 已前进，Reviewer 仍审 recorded exact head，除非工作书经过 reconciliation 明确 supersede 到新 SHA。

### 2A.7 State identity / provenance research signal

本节的 full-SHA / ancestor / exact-head 规则首先是**施工正确性要求**；同时，凡施工中实际发现以下情况，必须按 §14B 作为研究素材候选记录：

- mutable branch/tag/head 在任务执行期间移动，导致 remembered state 与 current resolved state 不一致；
- resume / compaction / handoff 后只恢复了 symbolic ref，丢失原 exact identity；
- CI / Review / artifact 本身有效，但绑定到错误 head / run / task；
- dependency marker 显示 COMPLETE，但 baseline 实际不含 accepted dependency SHA；
- critical transition 前 revalidation 捕获到 stale identity / stale provenance。

推荐 failure labels：

```text
MUTABLE_REFERENCE_STATE_DRIFT
EVIDENCE_POINTER_MISMATCH
BASELINE_ANCESTRY_MISMATCH
STALE_EXECUTION_IDENTITY
PROVENANCE_RELATION_MISMATCH
```

不得把“branch 会移动”本身包装成新研究贡献；研究价值在于 long-horizon Agent 的 state identity、provenance、freshness 及其与 compaction / resume / multi-agent concurrency 的交互。

## 3. 双主机独立性

当工作书要求 Development + Review/Correction：

- 两个角色必须由不同实体主机完成；
- Hosted CI runner 不算第二实体主机；
- 同一主机不能因为另一台暂时不可用就自行兼任独立复核；
- Review 必须独立找问题并可直接修复范围内缺陷，不是只签字或复述作者测试。

如果当前剩余工作全部因为稳定机制禁止本主机参与，应进入“结构性无资格”，而不是制造第三角色或假复核。

## 4. 等待不占主机：No-idle

一个已领取任务可以继续保持 owned，同时等待：

- hosted CI；
- 长时间本地测试；
- 插件下载/安装；
- provider/session probe；
- 外部登录；
- 非 CPU 活跃的设备/服务响应。

这些等待**不独占实体施工主机**。

主机应：

1. 保留原 claim；
2. 用独立 worktree / branch；
3. 扫描并领取另一个不冲突、已满足依赖的工作；
4. 原任务变成 actionable 时再回来。

禁止为了“保持专注”空等一个 CI，也禁止因另一个任务在等待就重复开相同实现。

## 5. 零领取结果必须分类，不能直接宣布结束

一次扫描得到 `claimable_now = 0` 只说明“现在不能领”，**不证明任务池完成**。

每次零领取必须归入且只归入以下一类：

### 5.1 `TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY`

条件：
- 仍有未完成任务；
- 当前主机未来有可能获得资格；
- 另一主机完成 Development/Review、CI 结束、Owner gate 解除、阶段冻结、provider/device 恢复等事件可能解锁工作。

动作：
- 进入低成本等待，不 busy-poll；
- **优先事件触发立即重新扫描**；
- 若事件通知缺失，默认约 **20 分钟**做一次 bounded re-scan；
- 可以连续多次 20 分钟重扫，只要任务仍未完成且未来资格合理存在。

典型：UI-000 由 Alien 施工时，Mech 暂时没有 Review 可领；Mech 应等待 UI-000 Development 完成事件，事件丢失时约 20 分钟兜底重扫。

### 5.2 `STRUCTURALLY_INELIGIBLE`

条件：
- 当前所有剩余任务都因稳定机制禁止该主机：同主机不得复核、硬件资格、身份/权限、安全策略、Owner 明确限制等。

动作：
- 记录精确原因；
- 释放主机；
- **不要求周期 20 分钟重扫**；
- 只有 governing gate / 资格条件变化时被唤醒。

### 5.3 `GLOBAL_EXTERNAL_BLOCK`

条件：
- 所有有意义的下一步都需要内部代码无法诚实解决的外部变化，例如账户 Billing、强制硬件缺失、Owner/provider 账户动作。

动作：
- 记录 typed blocker 与证据；
- 释放主机；
- 不对已知不变的外部 blocker 每 20 分钟轮询；
- 外部恢复事件到来后，先执行 §7 reconciliation，再重新扫描。

### 5.4 `POOL_TERMINAL`

只有全部相关任务按真实 completion semantics 终态后才允许使用。

**禁止把 PARKED、暂时没活、结构性无资格、外部阻塞写成“项目完成”。**

零领取至少记录：

```text
pool_incomplete
claimable_now
potentially_claimable_later
classification
structural_ineligibility_reason
global_external_blocker
wake_condition
rescan_after
terminal_reason

expected_identity_if_applicable
observed_symbolic_ref_if_applicable
resolved_identity_at_use_if_applicable
evidence_identity_if_applicable
provenance_or_required_ancestor_refs
freshness_revalidation_event
identity_or_evidence_mismatch_type
reconciliation_action
```

## 6. Wake-up：优先事件，20 分钟只是兜底

以下事件应触发等待主机立即重新扫描：

- 另一主机 Development / Review 完成；
- required CI 进入 terminal state；
- Owner gate resolved；
- 阶段 baseline / merge 完成；
- dependency 从 locked → open；
- provider/session/device availability 发生有效变化；
- claim 被释放或失败任务变成 owned repair；
- 外部 blocker 被明确报告恢复。

`TEMPORARILY_UNCLAIMABLE` 的约 20 分钟重扫是**低频 liveness 兜底**，不是主调度机制。

## 7. 外部恢复后必须 Reconcile，不能相信旧看板

外部系统可以在没有 Digital-City commit 的情况下改变：

- GitHub Actions billing 恢复；
- CI rerun 变绿；
- provider 恢复；
- approval 到达；
- 设备重新上线。

因此以下时点必须做 control-plane reconciliation：

1. typed external blocker 被报告恢复后立即；
2. 恢复后第一次解释 zero-claim 之前；
3. 宣布阶段/任务池 drained 之前；
4. 创建阶段 merge/integration 之前；
5. 最终项目完成声明之前。

对依赖外部证据的任务必须验证：

```text
recorded branch == evidence head_branch
recorded head   == evidence head_sha
required terminal state == evidence conclusion/status
```

规则：
- exact recorded head 的新成功 run 可以关闭旧 external block；
- 另一 branch/task 的绿色 run 不能满足当前任务，记为 `EVIDENCE_POINTER_MISMATCH`；
- 历史失败/blocked run 保留，当前 frontmatter 更新为最新已验证调度真相；
- reconciliation 只修 control-plane metadata，不制造产品代码 commit 来“刷新状态”；
- 查询不到权威外部源时保留最后已验证状态，写 `RECONCILIATION_SOURCE_UNAVAILABLE`，不得猜。

## 8. CI 与失败分类

- 本地 PASS 不能替代工作书明确要求的 hosted CI；
- Billing / runner 根本没启动 job 属于 external blocker，不是产品代码失败；
- job 已真正启动且 test step 失败，就转为普通 code defect，不得继续标 Billing；
- 修复必须针对观测到的 defect，不得因为“顺便”扩大任务边界；
- required CI 必须绑定精确 branch/head；
- 禁止删除测试、降低门槛、改成功定义来换绿。

## 9. 不制造假工作，不做防御性膨胀

当主机暂时没资格施工：

- 不新造功能；
- 不额外重构与当前 acceptance 无关的基础设施；
- 不因为“未来也许有风险”持续增加 gate、wrapper、abstraction；
- 不为保持机器繁忙而提交无验证价值的 head。

只有以下来源可以扩大工作：
1. 工作书明确范围；
2. Owner 新裁决；
3. 真实测试/运行发现的 in-scope defect；
4. 为满足现有 contract 所需的最小修复。

“没有工作可做”本身不是一个需要用代码修掉的 defect。

## 10. 缺失兄弟项目 / 外部依赖不能拖死独立施工

若 sibling programme 尚未完成：

- 优先使用稳定 contract/port + deterministic test double 完成本任务可独立部分；
- 真正需要 real provider / real device / real cross-device 的部分诚实留到 integration；
- **deferred != passed**，必须记录 exact pending seam；
- 不能为了跨项目方便复制出第二套 canonical ownership。

## 11. 合并 / Integration 也是异步阶段

每个阶段 merge/integration：

1. 从**当时最新** Utopia `main` 开始；
2. 集成已通过独立复核的 branch，冲突按显式 union/superset 处理；
3. 保留 main 已接受的其他工作；
4. 能独立跑的测试全部先跑；
5. 若只剩真实 external seam，记录 waiting external seam 并释放主机，不空等；
6. **最终 merge 前再次刷新当时最新 main**；
7. 刷新后重跑 required acceptance / CI；
8. merge 后再次验证 merged-main CI。

禁止拿阶段开始时的旧 main 一路做到最终 merge。

## 12. Claim 异常与接力

自动施工者不得擅自清空别人 claim。

- claim 后尚无实质实现/报告：可由 Owner 或明确的规则化 recovery reset；
- 已有实质工作但原主机无法继续：记录 blocker，不允许另一台主机偷偷冒充原角色接力；
- 若必须改变角色边界，使用 Owner ruling 或 superseding workbook，保留旧历史。

## 13. 工具 / 插件等待与安全

若任务工作书允许 Hns/Codex 自主安装插件或 Skill：

- 插件下载/安装等待适用 §4，不占主机；
- 来源、版本/ref 记入报告；
- 插件默认只属于施工工具链；
- 未经工作书明确授权，不得因为插件方便就改变生产 runtime/framework；
- 不向未知第三方上传 secrets、token、私有凭据或不必要代码。

## 14. 过程数据

过程证据遵守 [PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)。

City 只保存：
- claim/status；
- 精确 branch/head/CI；
- 有界报告；
- blocker / reconciliation / completion 摘要。

无界 terminal log、重复截图、raw trace 不进入 City 当前施工面。

## 14A. Capability Exposure & User Control Gate / 能力暴露与用户掌控门

任何**新增或实质修改的产品能力**，在 Development complete 前都必须回答：

> 这个能力是否应该由用户直接操作？如果不是，用户需要知道/观察/配置到什么程度？它应该放在哪一层 UI，如何避免视觉与操作过载？

核心原则：

> **在不造成视觉和操作过载的前提下，给予用户最大的掌控权与知情权。**

“避免过载”只能通过 **progressive disclosure / 分层收纳 / 上下文入口 / Advanced / Technical Details** 解决，不能把本应可操作或应知情的能力藏起来。

### 14A.1 四类 Exposure Decision

每个 capability 必须归入且只归入一类：

#### A. `DIRECT_CONTROL`

用户需要主动发起、停止、选择、确认、修改或恢复。

必须：

- 有正常用户可发现入口；
- UI control 真实连接 canonical backend/action/API；
- 用户操作后能看到 accepted / running / failed / refused / completed 等真实结果；
- applicable 时提供 cancel / rollback / confirmation；
- 不允许只靠 console、CLI、隐藏 URL 或文档说明完成正常用户流程。

典型：创建任务、选择设备、rebind、approve/reject、experiment run/export。

#### B. `OBSERVABLE_ADVANCED`

用户通常不频繁操作，但对状态、结果、配置或异常拥有合理知情/干预需求。

必须暴露到：

- Settings；
- Research / Advanced；
- device/task detail；
- status/diagnostics；
- expandable Technical Details；

中的至少一个稳定 surface。

不得完全隐藏。

典型：provenance、metrics、enrollment status、resource readiness、experiment trace completeness。

#### C. `BACKGROUND_DISCLOSED`

能力主要自动运行，不适合给用户频繁按钮，但其存在、当前状态、失败或政策会影响用户结果。

必须至少让用户知道：

- 它存在；
- 当前是否 active / degraded / unavailable；
- 发生重要失败或需要人类决策时如何得知；
- 必要时在哪里调整 policy / opt-out / reset。

可通过状态、通知、历史、Settings 或上下文说明实现，不要求主导航常驻控制。

典型：自动 recovery、background routing、session refresh、health monitor。

#### D. `INTERNAL_ONLY`

仅当能力**没有合理的用户操作价值，也没有需要用户知情的产品语义**时，允许完全不出现在 UI。

典型可能包括：

- protocol heartbeat；
- transport frame codec；
- internal retry bookkeeping；
- ephemeral collector buffer；
- low-level worker claim packet。

这是**唯一允许 UI 完全豁免**的类别。

工作书必须记录：

```text
user_exposure_class: INTERNAL_ONLY
ui_exemption_reason: <why no user action or awareness is useful>
```

“怕界面复杂”“以后再说”“只有高级用户会用”都不是豁免理由。

### 14A.2 强制收纳 / Nesting Decision

凡不是 INTERNAL_ONLY，都必须决定它放在哪一层：

```text
L1 PRIMARY
   frequent / high-value / core user journey

L2 CONTEXTUAL
   appears where the relevant task/device/action exists

L3 ADVANCED / SETTINGS / RESEARCH
   powerful or infrequent controls

L4 TECHNICAL DETAILS / DIAGNOSTICS
   raw ids, exact refs, deep provenance, low-level measurements
```

优先原则：

- 频繁核心操作才进入 L1；
- 与具体对象绑定的操作放 L2；
- 强大、危险、低频能力放 L3；
- 原始技术信息折叠到 L4；
- 同一事实不要在多个主入口重复堆叠；
- 如果能力已有自然宿主页面，应优先嵌入而不是新造顶级导航。

### 14A.3 Backend Wiring Gate

“画了按钮”不算 exposure complete。

对 DIRECT_CONTROL / ADVANCED control 必须证明：

```text
visible control
→ canonical request/action
→ backend accepted/refused truth
→ progress/state
→ result/error
→ UI reconciliation
```

若其中任一环不存在，应标：

`EXPOSURE_BACKEND_NOT_READY`

并保持 control disabled/absent with honest explanation，而不是制造 false affordance。

### 14A.4 Knowledge / Control Rights

任何能力若影响：

- task routing；
- device choice；
- provider/model；
- cost/budget；
- trust/identity；
- privacy/security；
- persistence/data deletion；
- external side effect；
- long-running background behavior；

默认**不能**归 INTERNAL_ONLY。

即使不适合直接按钮，也至少属于 OBSERVABLE_ADVANCED 或 BACKGROUND_DISCLOSED。

### 14A.5 Workbook / Report 必填

新建或实质修改 capability 的工作书必须记录：

```text
user_exposure_class
user_exposure_surface
user_exposure_nesting
backend_wiring
ui_exemption_reason
```

若工作书 frontmatter 没有专门字段，也必须在正文的 “Capability Exposure Decision” 中记录。

Development Report 必须说明实际落地入口。

Formal Review 必须独立检查：

1. 普通用户能否发现需要发现的能力；
2. control 是否真实接到 backend；
3. unavailable/permission/refusal 是否诚实显示；
4. 是否出现重复、视觉过载或不合理顶级导航；
5. 是否把本应知情的后台能力错误归为 INTERNAL_ONLY；
6. Android/Web 等一等 surface 是否需要 parity，若暂不需要必须有理由与 future seam。

### 14A.6 Completion Gate

如果一个能力的 exposure decision 未完成：

`CAPABILITY_IMPLEMENTED != PRODUCT_COMPLETE`

不得因为代码、unit test、CI 已绿就标记整个用户能力 complete。

允许 component implementation complete，但 programme/final integration 必须保留 exposure seam，直到：

- required UI / observable surface 已接线并复核；或
- 明确证明为 `UI_EXEMPT_INTERNAL_ONLY`。

这条规则对之后所有 Mission Book 新能力默认生效；Capability Entry Closeout programme 负责清理此前已经存在的历史入口债务。

### 14A.7 User-Reachable Vertical Slice First / 先打通最薄真实用户路径

对需要用户直接操作或明显影响用户体验的 capability，默认施工顺序不得再是：

```text
完整 backend
→ 完整内部体系
→ 最后补 UI
→ 最后才发现用户找不到 / 语义不对
```

也不得只做：

```text
UI shell
→ placeholder/fake button
→ 最后才接 backend
```

默认优先：

```text
accepted user verb / intent
→ discoverable entry point
→ thinnest real backend path
→ observable result/error
→ real E2E verification
→ thicken internal capability
→ expand UI/error/policy states
→ intent validation
```

即：**先让用户走通一条真实路径，再把路径修宽。**

允许例外：

- INTERNAL_ONLY；
- 纯底层 prerequisite，在当前任务阶段还不存在合理用户语义；
- 明确的 foundational contract / schema / migration task。

例外必须在工作书说明 why vertical slice is not yet applicable；不得用“UI 以后再做”作为默认理由。

## 14B. Long-Horizon Agent Research Evidence Gate / 超长时 Agent 论文素材门

所有新建或继续执行的工程书都必须判断本次施工是否产生“长时 Agent / context lifecycle / external execution state”研究价值。  
这一规则是**全局素材防漏规则**，不要求任务本身属于 Research Strengthening programme。

研究院专题入口：

- 中文：`06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/paper-materials/zh-CN/LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md`
- English: `06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/paper-materials/en/LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md`

### 14B.1 每本工作书必须先做 applicability decision

至少记录：

```text
research_evidence_applicability =
  APPLICABLE
  | NOT_APPLICABLE

long_horizon_context_evidence =
  CAPTURED
  | NOT_OBSERVABLE
  | NOT_APPLICABLE

research_evidence_refs = [...]
```

不得因为“这不是论文任务”而省略判断。

典型 `APPLICABLE` 信号包括：

- 长时间/异步 Agent 施工；
- context pressure / compaction；
- session restart / resume；
- model / provider / harness switch；
- Mission Book / external state 恢复；
- task-pool 连续领取与 drain；
- Owner 被迫回来续接；
- false COMPLETE；
- duplicate / regression work；
- stale branch / stale SHA / stale task state；
- 长等待、错误阻塞判断、任务终止判断；
- compaction 后恢复成功或失败。

普通极短、单步、无上下文延续意义的任务可标 `NOT_APPLICABLE`，但必须显式写出。

### 14B.2 三个长期研究问题

未来开发素材优先围绕：

1. **When to compact**  
   记录压缩发生在什么 context pressure / token occupancy / task phase / semantic boundary；不要只记录“压过一次”。

2. **What to retain**  
   区分 active working context、compressed semantic state、external referenced evidence、authoritative structured execution state 与可丢弃 transient noise。

3. **What to externalize**  
   观察 Mission Book、reports、exact SHA、CI receipts、task pool 等外部状态是否改善 compaction/restart 后恢复、减少人工接续、重复工作、错误 COMPLETE 与 stale-state error。

4. **What must remain immutable and be revalidated**  
   观察哪些 execution-semantic identifiers 必须 exact-copy / structured serialization，而不能被 summary 自由改写；比较 mutable symbolic ref、immutable identity、identity+provenance、identity+provenance+freshness revalidation。

### 14B.3 能观察到时优先采集的字段

```text
agent_provider
agent_model
agent_harness
harness_version_or_sha
workbook_id
run_or_session_id
start_time
end_time

context_window_limit_if_known
context_tokens_before_compaction_if_known
context_occupancy_ratio_if_known
compaction_trigger
compaction_trigger_reason
task_phase_at_compaction
semantic_boundary_type

summary_or_checkpoint_artifact_ref
external_state_refs_used
state_fields_reconstructed
state_reconstruction_errors

owner_intervention_count
owner_intervention_reason
task_transitions_completed
duplicate_work_count
stale_state_error_count
false_completion_count
regression_or_reopened_work_count
recovery_time_if_measurable
autonomous_work_span_if_measurable
terminal_reason
```

工具不暴露某字段时写：

```text
NOT_OBSERVABLE + reason
```

**禁止猜测，禁止用 0 冒充未知值。**

### 14B.4 Compaction / Resume 后优先检查 State Reconstruction

若发生 compaction、context reset、session resume、agent handoff 或 model switch，优先用外部 ground truth 检查能否正确恢复：

1. current mission/workbook；
2. exact branch / full SHA；
3. completed work；
4. remaining work；
5. known blocker/failure；
6. next action；
7. 已失败、不得无意义重复的路径；
8. completion / acceptance gate；
9. execution-semantic identifiers 是否仍为原 exact identity；
10. provenance / required ancestor relation 是否仍成立；
11. critical transition 前 freshness 是否重新验证。

这些字段可用于后续计算 State Reconstruction Accuracy；不得由同一个 Agent 自评后直接当 ground truth。

### 14B.5 不得为了采集素材扭曲正常施工

默认以**被动采集自然施工数据**为主：

- 不为了“有数据”故意制造故障；
- 不为了延长 run 制造无价值任务；
- 不为了测 compaction 故意塞垃圾上下文；
- 不因为研究采集破坏 §9 no-make-work；
- 只有专门的 research / fault-injection / controlled replay workbook 才允许受控干预。

自然施工日志负责发现现象；因果结论留给后续 controlled replay / ablation。

### 14B.6 数据边界与隐私

只采集可观察工程事实和显式状态：

- prompt/instruction（允许保存时）；
- compaction/checkpoint event；
- task/workbook state；
- logs / CI / tests；
- timestamps；
- token/cost telemetry（工具提供时）；
- Owner intervention；
- branch/SHA；
- observable action/result。

**不得要求、推断或保存模型隐藏 chain-of-thought / private reasoning。**

### 14B.7 存储位置

- 无界 raw runtime / trace 继续遵守 [PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)，不得堆进 City 当前施工面；
- task-specific 有界证据进入对应 `mission-book/reports/<WORKBOOK-ID>/`；
- Utopia 原始/共享 evidence 继续使用既有 evidence/evolution 路径；
- 出现具有论文价值的现象时，在 Research Institute `paper-materials/{zh-CN,en}/` 建立或更新专题材料，并从 report 反向链接 exact evidence；
- “没有可发表价值”也允许，只需在 report 中记录 `NO_RESEARCH_SIGNAL`，不得硬凑结论。

### 14B.8 Review / Completion gate

Formal Review 必须检查：

1. applicability 是否判断；
2. observable telemetry 是否诚实记录；
3. compaction/resume 发生时是否留下恢复证据；
4. research evidence refs 是否可追到 exact run / SHA / report；
5. 是否把 `NOT_OBSERVABLE` 错写成数值；
6. 是否遗漏明显的 Owner intervention、false completion、duplicate work 或 stale-state episode；
7. 是否把 mutable symbolic ref 当成 immutable evidence；
8. CI / Review / artifact evidence 是否绑定 exact intended identity；
9. compaction/resume 是否丢失 exact identity、provenance 或 freshness check。

若 `research_evidence_applicability = APPLICABLE` 且完全没有 evidence decision：

`RESEARCH_EVIDENCE_CAPTURE_MISSING`

任务可以保留代码实现结果，但不得完成其正式 Review/Closeout，直到补齐素材判断与已有证据索引。


### 14B.9 Capability exposure / reachability research signals

以下事件一旦发生，默认视为 research-evidence candidate，必须按 §14B 保存有界证据或明确 `NOT_OBSERVABLE`：

```text
IMPLEMENTED_BUT_UNREACHABLE
VISIBLE_BUT_NOT_WIRED
VISIBLE_WRONG_SEMANTICS
DISCOVERABILITY_GAP
SURFACE_PARITY_GAP
CAPABILITY_REGISTRY_STALE
CAPABILITY_REGISTRY_REALITY_MISMATCH
DUPLICATE_IMPLEMENTATION_DUE_TO_DISCOVERY_FAILURE
```

能观察时优先记录：

```text
capability_id
implementation_completed_at
first_surface_available_at
backend_wiring_verified_at
reachability_verified_at
intent_validated_at
surface_platform
surface_location
user_steps_to_reach
owner_intervention_count
rework_required
duplicate_implementation_detected
registry_reconciliation_result
exact_implementation_sha
ui_or_e2e_evidence_ref
```

可用于后续观察：

```text
Exposure Lag =
  T(reachability_verified)
  - T(implementation_complete)
```

自然施工记录只用于现象与 longitudinal evidence；不得直接把经典 vertical-slice 实践本身包装成 novelty。

专题研究材料：

- `06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/paper-materials/{zh-CN,en}/CAPABILITY_EXPOSURE_GAP_USER_REACHABLE_VERTICAL_SLICES_2026-10-05.md`


### 14B.10 Research rarity tiers / 研究稀缺度与证据预算

论文素材不再默认“所有现象同等重要”。施工者必须使用 [RESEARCH_SIGNAL_WATCHLIST.yaml](./RESEARCH_SIGNAL_WATCHLIST.yaml) 的预分类，而不是自行把普通工程经验包装成 novelty。

```text
G1_MATURE        → MINIMAL
G2_CROWDED       → STANDARD
G3_SPARSE_ACTIVE → PRIORITY
G4_RARE_SYSTEMIC → MAXIMUM_BOUNDED
```

#### G1 — 成熟工程常识

例如：

- branch/tag mutable → exact SHA；
- classic vertical slice / walking skeleton；
- generic requirements→code traceability；
- ordinary Git/CI/branch-and-merge。

规则：

- 只有真实 defect / rework 时留 failure chain；
- 不增加 research-only instrumentation；
- 只能作为 background/control/failure cause，不得作为主要 novelty。

#### G2 — 热门但拥挤

例如：

- generic context compaction；
- generic execution-state memory；
- generic false completion / transparency；
- generic evolving requirements；
- generic async multi-agent；
- generic cross-model review。

规则：

- 正常 telemetry 即可；
- 只有与 G3/G4 交叉时升级采集；
- 禁止为了追热门方向主动制造 make-work。

#### G3 — 已有邻近工作但直接研究稀疏

优先信号：

- repository-resident executable work state；
- execution identity / provenance / freshness；
- structured handoff with exact state；
- dynamic async liveness / eligibility / wake semantics；
- independent review as a state/evidence boundary；
- Registry-assisted Agent onboarding/localization；
- naturalistic Owner intervention taxonomy。

若命中 G3，尽量保存：

```text
before_state
after_state
exact SHA / run ids
event timeline
agent/model/harness
Owner intervention
handoff/resume
task transitions
independent review
quantitative delta
research refs
```

#### G4 — 完整案例/系统研究极少

最高优先信号：

- unified repository control plane；
- capability state: implementation → wiring → reachability → intent；
- autonomy survival until Owner intervention；
- MissionBook/Registry/Git/CI/UI control-plane reality drift；
- user-reachable completion as first-class terminal condition；
- passive development-to-research evidence pipeline。

若命中 G4，除 G3 字段外优先保存：

```text
authority surfaces
state transitions
conflicting truths
event ordering
wake / role-eligibility changes
user-reachability path
exact evidence binding
control-plane rule version
counterfactual / replay / ablation opportunity
```

仍必须遵守 bounded evidence：禁止 hidden chain-of-thought、无界 raw log、敏感凭据。

### 14B.11 Watchlist hit / 未分类信号

工作书/report 若观察到研究信号，记录：

```text
research_watchlist_hits = [RS-...]
highest_research_grade_observed = G1_MATURE | G2_CROWDED | G3_SPARSE_ACTIVE | G4_RARE_SYSTEMIC
research_capture_level = MINIMAL | STANDARD | PRIORITY | MAXIMUM_BOUNDED
```

若现象不在 watchlist：

`UNCLASSIFIED_CANDIDATE`

只记录 observation + evidence，不由施工 Agent 自行发明 G3/G4 评级。正式升级必须在后续 literature review 后进行。

### 14B.12 Primary paper-story policy

当前 City 的默认主论文故事不再是“更大的 context / 更好的 compaction”。

默认主线：

> **Reliable long-horizon coding requires a persistent software-engineering control plane, not merely a capable model or larger context.**

优先观察变量：

- durable work state；
- exact execution identity；
- evidence provenance；
- dynamic liveness；
- user-reachable capability state；
- human intervention。

compaction、model switch、branch movement、CI wait、handoff、external blocker、evolving requirements 默认视为 **stressors / conditions**，除非后续文献审计重新升级。

研究院策略快照：

`06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/paper-materials/{zh-CN,en}/RESEARCH_PRIORITY_STRATEGY_2026-10-05.md`



### 14B.13 Second-scan G3 capture / 第二轮稀缺信号补充

第二轮文献扫描后，以下普通方向降为 G2，不再单独投入高优先级 instrumentation：

- generic AGENTS.md / repository rule learning；
- generic long-horizon maintenance / technical debt；
- generic merge conflict / concurrent editing；
- generic abstention / action bias；
- generic logging/observability debt；
- plain intervention count。

新增三个 G3 重点：

#### A. `RS-G3-RULE-LIFECYCLE-DEBT`

当全局/工程书规则因为真实 failure 被新增、修改、收窄、supersede 或删除时，尽量记录：

```text
rule_id_or_section
rule_version_sha
source_failure_ref
introduced_at
supersedes_or_conflicts_with
scope
future_activation_count_if_known
recurrence_prevented_if_observable
false_block_or_unnecessary_restriction
retired_or_superseded_at
retirement_reason
```

不要只记录“加了一条规则”；重点是 rule provenance、有效期、冲突与治理债务。

#### B. `RS-G3-SUPERVISION-ATTENTION`

Owner intervention 除了计数，还应分类：

```text
HIGH_VALUE_DECISION
AVOIDABLE_TECHNICAL_ESCALATION
REPEAT_CLARIFICATION
APPROVAL_ONLY
RECOVERY_REQUIRED
AMBIGUOUS_REQUIREMENT
PERMISSION_OR_VALUE_JUDGMENT
```

能观察时记录：

- 是否可由现有 rule/evidence 自动解决；
- 是否可以 batch；
- 一次 Owner 回复后是否恢复自治；
- 是否重复同一 root cause；
- escalation 前是否已有 bounded diagnosis；
- 从 escalation 到 autonomy resumed 的时间。

#### C. `RS-G3-SEMANTIC-INTEGRATION`

普通 Git conflict 属 G2。若出现：

```text
clean textual merge
+ component CI green
+ integrated semantic failure
```

必须优先保存：

```text
accepted_source_shas
integration_sha
component_evidence_refs
violated_semantic_invariant
why_component_checks_missed_it
capability/ownership/dependency drift
registry/runtime mismatch
user-intent regression
repair_and_revalidation
```

推荐 failure labels：

```text
TEXTUALLY_CLEAN_SEMANTIC_CONFLICT
ACCEPTED_CAPABILITY_OVERWRITTEN
DEPENDENCY_UNION_SEMANTIC_MISMATCH
POST_MERGE_REGISTRY_RUNTIME_MISMATCH
POST_MERGE_USER_INTENT_REGRESSION
```


## 14C. Capability Registry Chained Update Gate / 能力登记册连锁更新门

`capability-registry/` 是 City 的长期能力户籍、实现定位与用户暴露地图。

职责边界：

```text
Mission Book
= what should be built / claimed / reviewed next

Capability Registry
= what capability currently exists,
  where it is implemented,
  what the user can actually see/control,
  and what exact evidence proves that state
```

二者必须连锁更新，不允许长期漂移成两套事实。

### 14C.1 开工时声明

任何新增或实质修改 capability 的工作书必须记录：

```text
capability_ids
capability_registry_action =
  CREATE
  | UPDATE
  | BACKFILL
  | VERIFY_ONLY
  | NOT_APPLICABLE
capability_registry_refs
capability_registry_sync_status
```

若新 capability 尚无 ID，应在设计阶段分配不可变 `CAP-<DOMAIN>-<NNN>`。

禁止给每个普通 helper/function 单独创建 CAP id；Registry 单位是有产品/系统语义的 capability。

### 14C.2 四维状态强制分离

Registry 不允许只写 `COMPLETE=true`。

至少分别维护：

```text
implementation_status
backend_wiring_status
user_reachability_status
intent_validation_status
```

因此：

```text
implementation = COMPLETE
reachability    = MISSING
```

是合法且必须诚实表达的状态。

### 14C.3 Development 连锁更新

Development 若改变以下任一事实：

- implementation path/symbol/API/action；
- capability semantics；
- exposure class；
- user-visible information；
- direct control；
- surface location；
- platform parity；
- implementation/entry/wiring/intention state；

必须同步更新对应 Registry candidate record 或在 report 中留下明确待 Review reconciliation 的 exact diff。

**产品代码完成但 Registry 未更新，不等于 Development closeout 完成。**

### 14C.4 Formal Review 连锁对账

Reviewer 必须独立验证：

```text
Registry claimed implementation
↔ actual implementation at exact SHA

Registry claimed surface
↔ actual discoverable UI/runtime surface

Registry claimed wiring
↔ canonical backend behavior

Registry claimed intent status
↔ observed accepted user semantics
```

若代码变了但 Registry 没同步：

`CAPABILITY_REGISTRY_STALE`

若 Registry 声称存在的入口/行为在真实产品里找不到或不一致：

`CAPABILITY_REGISTRY_REALITY_MISMATCH`

二者均阻止正式 Review/Closeout。

### 14C.5 Exact identity

Registry verified record 必须记录：

- implementation repo；
- paths/symbols；
- source workbook(s)；
- last verified **40-character full SHA**；
- UI/E2E/backend evidence refs。

branch/tag 只用于 discovery；不得作为 capability verification identity。

### 14C.6 Legacy bootstrap

现有历史能力入口矩阵：

`mission-book/capability-entry-closeout/CAPABILITY_ENTRY_MATRIX.md`

是 Registry 的 bootstrap evidence source，不是永久第二套 registry。

- CEX programme 继续完成既有 exposure debt；
- CEX-790 负责把 final verified inventory 回填/对齐到 `capability-registry/`；
- 未回填旧能力可保持 `LEGACY_BACKFILL_PENDING`；
- 后续任一 workbook 触及旧 capability 时，必须顺手完成其 Registry backfill/reconciliation；
- 禁止为了快速填满 Registry 而复制未经 exact-head 验证的历史表格。

### 14C.7 数据边界

Registry 保存**当前 verified state + navigation/provenance**，不保存无界历史日志。

历史失败、修复、Owner intervention、测量数据继续进入：

- Utopia runtime/evolution evidence；
- Mission Book reports；
- Research Institute paper-materials。

Registry 只引用 evidence。

### 14C.8 Completion gate

涉及 capability 新增/实质修改的任务，在以下条件同时满足前不得正式 complete：

- Registry record 已 create/update/backfill；
- exact implementation SHA 已绑定；
- §14A exposure decision 一致；
- backend wiring 状态一致；
- user reachability 状态一致；
- intent validation 状态诚实；
- required surface/evidence refs 可追溯；
- Formal Review 完成 Registry ↔ runtime reconciliation。

`CAPABILITY_IMPLEMENTED != CAPABILITY_REGISTRY_RECONCILED != PRODUCT_COMPLETE`

三者不得互相替代。


## 15. 本文件的永久生命周期

`CONSTRUCTION_RULES.md` 是 Mission Book 的常驻基础设施：

- 新任务默认继承；
- 新工作书必须显式链接本文件；
- README 只链接，不复制整套规则；
- 阶段完成时**不得移动到 `finished/`**；
- 清理 finished 时不得处理本文件；
- 规则变化直接原位更新，并在 commit message 说明原因；
- 历史版本由 Git history 保留；
- 若未来确需彻底替换规则，仍在本路径提交 replacement，而不是建立“本轮专用规则书”后再归档。

这样可以避免“刚踩完的坑，因为上一轮任务收工就把防坑规则一起收进仓库地下室”的循环。
