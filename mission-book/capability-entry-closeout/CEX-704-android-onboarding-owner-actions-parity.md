---
workbook_id: CEX-704
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 704
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["e925ae1ef4dda6f51d89a1faa025d1b8666d8c58","86deda9c2990c78d683a8c3515d251022df9d040","77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f"]
dependency_source_workbooks: []
dependency_source_shas: []
development_baseline_sha: "0e9bea3ce739b979e582a428af8fb233045a5e75"
baseline_resolution_evidence: "mission-book/reports/CEX-704/CLAIM_RECORD.md"
baseline_blocker: null
dependencies: ["JOIN-501", "JOIN-502", "JOIN-503 semantics present"]
development_host: Alien-codex
development_branch: cex/CEX-704-Alien-codex-native-owner-onboarding
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CEX-704
terminal_marker: ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED
---

# CEX-704 — Android Onboarding Owner Actions 对齐

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 论文素材：[PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md)

## 目标

Android 当前主要能“加入别人”，但作为一等 control surface，应该能承担最自然的 Owner onboarding 行为：

- 查看 incoming join request；
- Approve / Reject；
- 主动 Generate pairing session；
- 展示/分享 short code / QR / link 中适合 Android 的形式；
- 不破坏现有 Scan QR / LAN / BLE / Manual join。

## 必须实现

### Incoming approval

复用已有：

- join request list；
- approve；
- reject。

不得新造审批数据库。

### Pairing generation

遵守 JOIN-501：

- 只有用户主动点击 Generate 后才创建；
- ACTIVE 期间固定；
- consumed / expired 后再生成；
- 不 background auto-rotate。

### Share

至少提供：

- QR；
- short code；
- Android share sheet 可用的 Web invite/link 或等价已存在 material。

不得把 durable credential 分享出去。

## Cross-network

若当前 Android relay path 尚无完整 product contract：

- 可以显示 Web invite / share material；
- 不得宣称 Android 已完成所有 cross-network relay execution；
- exact future seam 记录到 backlog / report。

## Formal Review

必须在 Android 实机上独立验证：

- generate；
- share；
- second device consume；
- incoming approve；
- reject；
- expiry；
- double click；
- app background/resume；
- existing join paths regression。

## 论文素材强制点

记录：

- Web/Android parity gap；
- user-step comparison；
- Android lifecycle/background issue；
- permission error；
- QR/share failure；
- race；
- approval latency；
- negative controls。

## 完成门槛

- Android 可作为 Owner onboarding control surface；
- JOIN-501 lifecycle 不回归；
- existing Android join 不回归；
- real-device opposite-host Review；
- exact-head CI；
- PAPER_MATERIAL_INDEX；
- terminal marker `ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED`。
