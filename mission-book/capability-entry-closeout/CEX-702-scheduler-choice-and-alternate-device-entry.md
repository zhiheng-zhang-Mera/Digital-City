---
workbook_id: CEX-702
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 702
execution_enabled: true
status: READY
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_PRODUCT_HEAD
dependencies: ["REMOTE_HANDOFF_CLOSEOUT_REPAIRED"]
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
report_path: mission-book/reports/CEX-702
terminal_marker: ALTERNATE_DEVICE_USER_CHOICE_EXPOSED
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
