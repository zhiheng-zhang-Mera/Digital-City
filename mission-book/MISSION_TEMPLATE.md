---
workbook_id: XX-000
phase: PHASE_NAME
sequence: 0
execution_enabled: false
status: NOT_STARTED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: []
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
dependencies: []
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: UNASSESSED
user_exposure_surface: null
user_exposure_nesting: null
backend_wiring: UNASSESSED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: null
---

# XX-000 — 工作书标题

> **常驻施工规则：** [CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md)  
> **过程数据规则：** [PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)  
> README 仅为监控看板，不是施工规范或 claim lock。

## 目标
## 已确认背景 / 当前真实代码
## 依赖与解锁条件
## 允许修改边界
## 禁止修改边界
## 任务特有施工步骤
## 任务特有独立复核
## Capability Exposure Decision / 能力暴露与用户入口

必须记录：

```text
user_exposure_class = DIRECT_CONTROL | OBSERVABLE_ADVANCED | BACKGROUND_DISCLOSED | INTERNAL_ONLY
user_exposure_surface = <where the user finds/sees/controls it>
user_exposure_nesting = L1_PRIMARY | L2_CONTEXTUAL | L3_ADVANCED | L4_TECHNICAL | NONE_INTERNAL
backend_wiring = VERIFIED | NOT_READY | NOT_APPLICABLE_INTERNAL
ui_exemption_reason = <required only for INTERNAL_ONLY>
```

若为 DIRECT_CONTROL / OBSERVABLE_ADVANCED / BACKGROUND_DISCLOSED，必须按 `CONSTRUCTION_RULES.md §14A` 证明入口、收纳、知情与 backend wiring；只有 INTERNAL_ONLY 可完全豁免 UI。

## 测试 / 实机 / 视觉证据
## 完成门槛
## Reports / Utopia evolution 记录

## 绑定常驻规则

本工作书自动继承 `mission-book/CONSTRUCTION_RULES.md` 的原子领取、§2A immutable full-SHA baseline anchor、双机独立、等待/唤醒、20 分钟兜底重扫、external reconciliation、exact-head CI/evidence、no-idle、no-make-work、integration refresh，以及 §14A Capability Exposure & User Control Gate 等规则。若本工作书需要更严格的 task-specific gate，可追加；不得降低常驻规则。
