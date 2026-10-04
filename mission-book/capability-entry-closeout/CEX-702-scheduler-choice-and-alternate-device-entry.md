---
workbook_id: CEX-702
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 702
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["ec12fd0831f31fd81aef9cd9dfb0c959d010f63b"]
dependency_source_workbooks: []
dependency_source_shas: []
development_baseline_sha: "0e9bea3ce739b979e582a428af8fb233045a5e75"
baseline_resolution_evidence: "mission-book/reports/CEX-702/CLAIM_RECORD.md"
baseline_blocker: null
dependencies: ["REMOTE_HANDOFF_CLOSEOUT_REPAIRED"]
development_host: Alien-codex
development_branch: cex/CEX-702-Alien-codex-alternate-device
development_head_sha: "3d233ff39d1e96b8a590b12f520f98c283356f25"
development_ci: "https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37213802935"
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CEX-702
terminal_marker: ALTERNATE_DEVICE_USER_CHOICE_EXPOSED
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/CEX-702/PAPER_MATERIAL_INDEX.md"]
state_identity_evidence: CAPTURED
state_identity_evidence_refs: ["mission-book/reports/CEX-702/CLAIM_RECORD.md"]
---

# CEX-702 — Scheduler 用户选择：拒绝切服务 → 改用另一设备

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 论文素材：[PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md)

## 目标

把后端已经存在的：

```text
POST /api/v0/tasks/:id/switch-declined
→ userDeclinedSwitch
→ RS-202 ALTERNATE_DEVICE
→ handoff
```

变成用户真正可见、可理解、可点击的决策。

## 用户语义

当 scheduler 确实处于 service/provider switch decision 时，UI 应能表达：

```text
[ Use another service/provider ]
[ Keep this service and try another device ]
[ Keep waiting ]
[ Cancel ]
```

不得把 `switch-declined` 偷换成 generic `CONFIRM`。

## 必须实现

### Web

- 有明确 alternate-device action；
- action 调用现有 `switch-declined`；
- subsequent state 能展示 REMOTE_HANDOFF；
- strict-target task 不提供语义冲突的“改用另一设备”按钮；
- provider choice / alternate device / keep waiting 区分清楚。

### Android

- 与 Web 使用同一 scheduler truth；
- expose equivalent user decision；
- 不由 Android 本地重新算 routing。

## Generic CONFIRM

当前 `CONFIRM` 继续保持 honest-unwired，除非施工期间发现已有 canonical backend route 且经 Formal Review 证明语义完全一致。

不得为了消除 disabled button 伪造 route。

## Formal Review

独立证明：

- choose provider 路；
- decline switch → alternate device 路；
- strict target refusal；
- no alternate available；
- stale/offline candidate；
- duplicate click；
- handoff result returns to original surface；
- Web/Android state一致。

## 论文素材强制点

记录：

- 为什么 backend path 存在但 UI 没入口；
- presentation contract 与 executable route 的差异；
- user decision taxonomy；
- route conflict / strict-target conflict；
- handoff latency；
- before/after user steps；
- Review 发现的错误映射；
- test/CI/runtime failure。

## 完成门槛

- alternate-device decision 可从正常 UI 发出；
- backend canonical truth 记录该决定；
- Web + Android 都能看到后续 handoff；
- generic CONFIRM 不被误接线；
- opposite-host Review + exact-head CI；
- PAPER_MATERIAL_INDEX；
- terminal marker `ALTERNATE_DEVICE_USER_CHOICE_EXPOSED`。
