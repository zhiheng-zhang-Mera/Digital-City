---
workbook_id: REX-802
phase: RESEARCH_STRENGTHENING
sequence: 802
execution_enabled: true
status: READY
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
user_exposure_class: OBSERVABLE_ADVANCED
user_exposure_surface: RESEARCH_RUN_DETAILS
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-802
terminal_marker: RESEARCH_TRACE_FOUNDATION_ACCEPTED
---

# REX-802 — Trace / Provenance / Metrics Foundation

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

建立统一 Research Trace，把已有 canonical truth 用 provenance 绑定起来。

至少覆盖：

- experiment/run；
- task/action；
- device/node；
- provider/model/channel（存在时）；
- route/handoff；
- retry/backoff；
- failure；
- recovery；
- Owner intervention；
- timing；
- resource observation；
- Git/config refs。

## 硬规则

- 不复制 canonical task/action truth；
- trace 可以引用，不可改写产品状态；
- clock source / timestamp semantics 必须记录；
- missing measurement = unknown，不得填 0；
- raw → normalized 的 transformation 必须可复查。

## 用户暴露

属于 OBSERVABLE_ADVANCED。

用户至少能看到：

- 正在记录什么；
- 当前 run；
- failures；
- metrics availability；
- provenance；
- trace completeness / missing fields。

raw ids 可折叠到 Technical Details。

## Review

独立制造：

- missing event；
- duplicate event；
- out-of-order event；
- stale clock；
- restart；
- partial trace；
- collector failure。

证明 collector 失败不会拖死 Utopia 产品运行。

## 完成门槛

trace schema + collector + normalized view + user observability + review/CI/material index 全部满足。
