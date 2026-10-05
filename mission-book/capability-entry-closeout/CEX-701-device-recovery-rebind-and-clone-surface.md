---
workbook_id: CEX-701
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 701
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f"]
dependency_source_workbooks: []
dependency_source_shas: []
development_baseline_sha: "40e18db4a6cf5bba1490181a473bc62e681edb8a"
baseline_resolution_evidence: "mission-book/reports/CEX-701/CLAIM_RECORD.md"
baseline_blocker: null
dependencies: ["JOIN-503 device enrollment semantics present"]
development_host: Alien-codex
development_branch: cex/CEX-701-Alien-codex-device-recovery
development_head_sha: "a24c04401308b11548626239e8ca1f9b4276bbdf"
development_ci: "https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37206760171"
development_complete: true
capability_ids: [CAP-IDENTITY-001]
capability_registry_action: BACKFILL
capability_registry_refs: ["capability-registry/records/CAP-IDENTITY-001.yaml"]
capability_registry_sync_status: CANDIDATE_RECONCILED
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/CEX-701/CONTEXT_LIFECYCLE.md"]
review_host: "Mech"
review_head_sha: "a24c04401308b11548626239e8ca1f9b4276bbdf"
review_ci: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-05): the review target is the development head itself, a24c04401308b11548626239e8ca1f9b4276bbdf, resolved from refs/heads/cex/CEX-701-Alien-codex-device-recovery (remote tip equals that commit). INDEPENDENCE, proven rather than asserted: this workbook records development_host=Alien-codex, so the reviewer host (Mech, COMPUTERNAME MEGA-REP) is a different physical host from the author, as section 3 requires. DEPENDENCY, verified rather than assumed: this workbook declares the dependency JOIN-503 device enrollment semantics present and required_ancestor_shas [77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f]; the reviewer confirmed JOIN-503 is COMPLETE with review_host Mech and review_complete true, and that 77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f is reachable from the reviewed head (git merge-base --is-ancestor exit 0). Claim-time exact-head CI, re-measured by the reviewer before any verdict: V0.2 checks push run 37206760171 completed/success on the reviewed head (jobs android success, gateway-web success); PR run 37207112712 completed/success on the same head; City linkage check run 37207112720 completed/success (reciprocal-contract). Review scope to be independently constructed per the workbook Formal Review section: UNBOUND reinstall, legitimate rebind, wrong proof, clone finding, a session attempting to rebind another installation, self revoke and owner revoking another installation - plus at least one real browser flow."
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CEX-701
terminal_marker: DEVICE_RECOVERY_ENTRY_ACCEPTED
---

# CEX-701 — Device Recovery / Rebind / Clone Finding 前端闭环

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 异步协议：[../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> 论文素材：[PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md)

## 目标

把已经存在的 device identity lifecycle 从“后端知道发生了什么”变成普通用户可完成的恢复流程。

当前已存在：

- `GET /api/v0/device/installations`；
- `cloneFindings`；
- `POST /api/v0/device/installations/:id/rebind`；
- `POST .../revoke`；
- UNBOUND / reinstall semantics。

当前缺口：

- Web Settings 丢弃 `cloneFindings`；
- rebind 无正常 UI；
- Android 无恢复 surface。

## 必须实现

### Web

- Settings 显示 typed clone/conflict warning；
- 展示足够识别、但不泄漏 secret 的 installation/device 信息；
- UNBOUND installation 显示明确 recovery state；
- rebind 必须使用现有 server proof contract；
- allow safe revoke/remove path；
- 不自动替用户选择 logical device。

### Android

至少能：

- 看见本安装是否需要 recovery；
- 看见 clone/security warning；
- 在权限允许时完成自有安装 recovery，或明确引导到 Owner Web surface；
- 不用 raw token / secret 作为正常用户输入。

## 禁止

- 新造第二 device registry；
- 绕过 rebind proof；
- clone finding 自动删除设备；
- 在前端持久化 durable credential；
- 把 session credential 提升成 owner authority。

## Formal Review

另一实体主机必须独立构造：

1. UNBOUND reinstall；
2. legitimate rebind；
3. wrong proof；
4. clone finding；
5. session trying to rebind another installation；
6. self revoke；
7. owner revoke another installation。

至少一次真实浏览器流程；Android 若当前平台限制无法完整 recovery，必须证明用户得到明确可行动引导，不能死在状态页。

## 论文素材强制点

特别记录：

- API 已有字段但 UI 丢弃的原始证据；
- 修复前用户路径步数；
- 修复后路径步数；
- clone false/true cases；
- rebind refusal codes；
- reviewer 发现的 privilege / presentation mismatch；
- 所有 test fail / runtime fail。

## 完成门槛

- Web recovery 完整；
- Android 有真实可行动入口；
- clone finding 不再被 silently dropped；
- rebind / revoke authority 不回归；
- Development / opposite-host Review PASS；
- exact-head CI green；
- PAPER_MATERIAL_INDEX 完整；
- terminal marker `DEVICE_RECOVERY_ENTRY_ACCEPTED`。
