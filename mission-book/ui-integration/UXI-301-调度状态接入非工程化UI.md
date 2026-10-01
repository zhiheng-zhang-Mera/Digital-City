---
workbook_id: UXI-301
phase: UI_SCHEDULER_INTEGRATION
sequence: 301
execution_enabled: true
status: NOT_STARTED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["UI-190", "RS-290"]
development_host: null
development_branch: null
development_head_sha: null
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
