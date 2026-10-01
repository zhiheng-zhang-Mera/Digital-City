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


## 双机领取与并发规则
- Development 与独立 Review 必须由不同实体主机完成。
- claim 后使用独立 branch/worktree；hosted CI、长测试或外部 provider 等待不独占主机。
- 未满足 dependencies 时不得先写未定义的集成逻辑；空闲主机领取同阶段其他可执行任务。
- 普通组件任务不得直接合并 Utopia main；阶段冻结工作书负责 union、回归、CI 与 main merge。

## Reports / evolution
- City 只保存有界结论、SHA、CI 和异常摘要。
- 调度冲突、handoff、fallback、busy/unavailable 样本按 PROCESS_DATA_POLICY 写入 Utopia evolution evidence。
