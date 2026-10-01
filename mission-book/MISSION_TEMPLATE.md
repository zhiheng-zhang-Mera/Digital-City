---
workbook_id: XX-000
phase: PHASE_NAME
sequence: 0
execution_enabled: false
status: NOT_STARTED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
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
## 测试 / 实机 / 视觉证据
## 完成门槛
## Reports / Utopia evolution 记录

## 绑定常驻规则

本工作书自动继承 `mission-book/CONSTRUCTION_RULES.md` 的原子领取、双机独立、等待/唤醒、20 分钟兜底重扫、external reconciliation、exact-head CI/evidence、no-idle、no-make-work、integration refresh 等规则。若本工作书需要更严格的 task-specific gate，可追加；不得降低常驻规则。
