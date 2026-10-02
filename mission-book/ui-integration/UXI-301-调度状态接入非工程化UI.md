---
workbook_id: UXI-301
phase: UI_SCHEDULER_INTEGRATION
sequence: 301
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["UI-190", "RS-290"]
development_host: Mech
development_claimed_at: 2026-10-02T04:30:22Z
development_branch: uxi/UXI-301-scheduler-status-into-product-ui
development_baseline_sha: 1a5bc0ee825c681636b9611efa2163f458c0a76f
development_claim_basis: "Claimed by Mech with baseline_policy CLAIM_TIME_MAIN, so the baseline is main as of this claim: 1a5bc0ee825c681636b9611efa2163f458c0a76f. DEPENDENCIES RE-VERIFIED FROM FRONTMATTER RATHER THAN FROM THE DEPENDENCY LIST, because 'dependencies are green' is exactly the control-plane claim that can be true and still wrong and I checked this one twice. UI-190 is UI_BASELINE_FROZEN with review_complete true. RS-290 is REVIEW_COMPLETE with review_complete true, and CRUCIALLY its work is now ON MAIN: main moved de91f5e -> 1a5bc0ee via the commit 'merge(RS-290): rescheduling baseline freeze - reviewed head 2f81296', and main now contains 2f81296. That last check is what gates this task and it is not the same as RS-290 being review-complete: UXI-301's goal is to wire RS-290's FROZEN scheduling state into UI-190's shell, and with baseline_policy CLAIM_TIME_MAIN this branch is cut from main, so one round ago - when RS-290 was REVIEW_COMPLETE but 60 commits ahead of main - claiming would have cut a branch containing none of the presentation contract, the unified vocabulary or the DTO. I checked exactly that on 2026-10-02 and declined to claim, recording the reasoning; this claim is the same check passing. Two-host note for section 3: Mech is the Development host here, so the Review must be taken by a DIFFERENT host and Mech must not review its own development."
development_step1_adapter: "STEP 1 IMPLEMENTED on uxi/UXI-301-scheduler-status-into-product-ui at f8d0405 - the unified presentation adapter, apps/web/scheduler-adapter.js, plus the user-language copy it needs in both locale packs. WHAT IT DOES: turns the frozen RS-290 DTO into user language and allowed actions, so the scheduler's own vocabulary never reaches the default UI. THE DESIGN CONSTRAINT THAT DETERMINED THE SHAPE, and it was measured rather than assumed: the adapter CANNOT import the RS-290 contract, because serveWeb serves only apps/web with containment checking, so a browser module cannot reach contracts/. The vocabulary is therefore a copy held in apps/web, and the conformance test asserts it equals the contract EXACTLY in both directions - no gap and no invented term - so it cannot drift silently. That is the same validated-against-the-real-modules discipline the RS-290 contract applies to itself, and it is what keeps this from becoming the second vocabulary RS-290 exists to prevent. THE WORKBOOK'S ACCEPTANCE ITEMS MADE EXECUTABLE, 15 tests all passing: every one of the 27 terms, 8 states and 5 actions has copy in BOTH locales; unavailable providers are visible but never selectable or interactive, INCLUDING when a DTO LIES with selectable true on a structural term, so the rule is structural rather than a renderer convention; NO raw scheduler vocabulary leaks by default, proven by searching the serialised view model for every term, state, class and source-vocabulary name the contract declares, both for one rich DTO and for a sweep of every term; raw vocabulary is reachable only through an explicit advanced block, ABSENT rather than empty when not requested, so no-leak-by-default holds by construction; the adapter never recomputes selection or choice, asserted in both directions so it cannot helpfully infer one; and an unknown state, term or action THROWS rather than rendering blank. TWO DEFECTS OF MY OWN WERE CAUGHT BY THESE TESTS AND BOTH ARE RECORDED. (1) The providers and actions ARRAYS were not frozen, only their entries, so a renderer could have pushed into them - my own view-model-is-frozen test failed on it. (2) The severity rule was OVERSTATED: I claimed severity is derived from the contract class, but DEGRADED and QUEUED are STATE-class terms whose emphasis is genuinely presentational. Rather than quietly special-casing them, the rule is now precise - for PERMITTED, RESOURCE, STRUCTURAL and KNOWLEDGE severity IS a function of the class because the class carries the meaning, while STATE-class terms are excluded and BOUNDED instead, never blocked and never ok - and a test asserts both halves. My first version of that test contradicted itself, asserting that no state is blocked and then that FAILED is; that is recorded too. VERIFICATION: 15 new tests pass, and the full suite on this branch is 981 tests with 979 passing and 2 failing, the two being the pre-existing document-reader CORRUPT_INPUT pair present on the untouched baseline, so this adds 15 tests and regresses nothing. STILL TO DO IN THIS TASK: wiring the adapter into the shell so the states actually render, the Android side against the same semantics, the real concurrency / provider-unavailable / device-busy / remote-handoff E2E the workbook requires INSTEAD of static mocks, hosted CI, and the section 3 Review on a different host."
development_head_sha: f8d0405
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/UXI-301/
---

# UXI-301 — 调度状态接入非工程化 UI

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 本工作书只定义任务特有 scope / dependency / acceptance；通用 claim、等待/唤醒、CI、双机独立与 merge 规则以常驻规则书为准。

## 目标
把 RS-290 冻结的调度状态通过 adapter/ViewModel 接到 UI-190 的产品壳中，让用户自然理解“为什么慢、能不能切、是否转交、结果在哪里”，但不把 scheduler 内部结构重新暴露出来。

## 核心呈现原则
用户优先看到：
- “当前服务响应较慢，要改用其他可用模型吗？”
- “这个服务在当前地区不可用。”
- “已转交另一台设备执行，你可以继续留在这里。”
- “正在等待可用资源。”
- “远端连接中断，正在恢复；尚未确认任务失败。”

Advanced/Diagnostics 才可显示 provider id、device id、routing reason、lease/correlation/provenance 等详细字段。

## 允许修改边界
Web/Android presentation adapter、ViewModel、用户文案、已有 design-system components、必要的 UI tests。

## 禁止修改边界
- 不改 RS-290 contract；
- 不在 UI 自己重算 provider/device 选择；
- 不把 unavailable 灰掉的 provider 变成可点击；
- 不为了展示方便恢复旧 dashboard/control-panel 结构。

## 施工步骤
1. 建立统一 adapter，把 scheduler vocabulary 映射为用户语言与允许动作。
2. Web 与 Android 使用相同语义，不要求像素完全一致。
3. provider choice 列表允许显示不可用项及原因，但强制不可选。
4. 远端 handoff 在当前设备显示 progress/result/attention。
5. queue/degraded/offline 使用用户可理解的非恐慌文案。
6. 技术详情进入可展开 Advanced。
7. 用真实并发、provider unavailable、device busy、remote handoff E2E 驱动 UI，而不是仅用静态 mock。

## 独立复核
另一主机检查 UI 是否重新“工程化”、是否存在前端自作主张、disabled/available 状态是否一致、用户选择是否真的传回 backend、当前设备是否持续收到结果。

## 完成门槛
- 主要 scheduler 状态都有用户语言；
- unavailable provider 可见但不可选；
- switch/no-switch 两条路径可真实执行；
- remote handoff 结果回当前 surface；
- Web/Android 真实验收与 hosted CI 全绿；
- 无默认 raw scheduler 字段泄漏。


## 绑定常驻规则
本任务继承 [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)。特别是：同任务 Development/Review 不得同主机；等待不独占主机；零领取必须分类；`WAITING_ELIGIBILITY` 事件唤醒优先、约 20 分钟兜底重扫；外部恢复后必须 reconciliation；CI/evidence 必须绑定 exact head；不得制造假工作或擅自扩大范围。

## Reports / evolution
- City 只保存有界结论、SHA、CI 和异常摘要。
- 调度冲突、handoff、fallback、busy/unavailable 样本按 PROCESS_DATA_POLICY 写入 Utopia evolution evidence。
