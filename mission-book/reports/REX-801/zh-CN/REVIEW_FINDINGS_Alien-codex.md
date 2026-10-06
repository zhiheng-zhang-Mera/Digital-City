# Alien-codex 的 REX-801 独立复检发现

> 中文阅读译本。[英文原文](../REVIEW_FINDINGS_Alien-codex.md)为来源；其中先前待定状态是历史记录，不以本文更新当前 authority。

在另一物理宿主 MERA-ALIANWARE 上复检 Mech 原始开发源 `8f8c521fc299d622093776615b653457d8833f96`，**没有**用分支 tip ef89e917 替换它。既有 contract 9 项、Gateway+feature 9 项测试均独立通过。新的独立 HTTP 负例和重启 seed 序列覆盖格式错误、未知 capability、不可能 topology、变量冲突、重复 experiment id；未创建任务。

P1 `PROVENANCE_RELATION_MISMATCH`：仅 `softwareRefs=[utopia@main]` 仍被接受为 `validation.ok=true`。把 label 解析为 `exact=false` 并没有强制执行 manifest 的精确 software/config provenance 门槛。在修正我们最初无效的 worker/host fixture 后，原始 `independent-review-red2.log` 真实复现问题。修复拒绝可移动引用，要求至少一个完整提交锚点；明确的补充组件版本仍作为 label。

P1 `TOPOLOGY_IMPOSSIBLE`：`hosts=[host-a,host-a]` / `workers=[host-a,host-a]` 依靠数组长度通过 TWO_HOST_MESH。重复一个身份不代表两台物理宿主。原始 red3 复现；修复拒绝重复 host/worker/control-surface 引用。

`EXPOSURE_BACKEND_NOT_READY`：修复前没有普通用户入口，尽管 DIRECT_CONTROL / exposure gate PASS 是任务完成要求。开发者明确记录了呈现缺失，不能把 API vocabulary 视为可见 UI。选择增加最小 Web Advanced Research 入口，支持 list/inspect/import 已编写 JSON/validate/register canonical manifest。更完整的研究工作流与渐进披露仍由 REX807 负责。未增加 experiment runner、fault permission 或默认测量。

受控真实浏览器测试现在遍历：导航 → 导入 → 验证（不注册）→ 注册 → 检查 → 无效分支拒绝 → 保留草稿 → 断线时禁用动作。canonical tasks 保持 0。最初截图暴露默认 textarea 过窄及重复响应 vocabulary 过大；修复为全宽编辑器和有界紧凑结果，细节内保留 vocabulary。这是普通 Playwright 浏览器执行，不是真实物理 workload/topology 演示。

原始精确源保留为历史。修复位于 `review/REX-801-Alien-codex`，不在 Mech 源分支。当时最终修复候选 SHA/CI 待定；门槛与技术修复复检通过前，`review_complete=false`。保留原始开发证据，明确记录源 → 修复后验收的关系。

最终修复候选为 `7e96a4d28f4cb701d7a0951bace69857c3228f32`，PR25；此记录当时精确 CI 37243645465 正运行。依据第 3 节，复检可修复范围内发现：原始 `development_head_sha` 8f8c521 不变；`review_source_sha` 记录独立检查的源；修复后的 `review_head_sha` 明确取代最初复检领取的 8f8c521，作为最终验收源。这遵循此前 WBC601/602 的源 → 修复 provenance 惯例，没有替换为无关 ef89e917 tip。refresh-error P2 修复后，独立技术浏览器 2/2 PASS；最终 focused 23/23 PASS；最终 full-root session 10319 正在固定已提交源上运行。较早 session 7773 因源修改而中断，标记 `INVALID_SOURCE_CHANGED_DURING_RUN`，保留但不作为最终证明。MON001 registry record 现与新 manifest capability candidate 一起从中央 index 链接。
