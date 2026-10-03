---
workbook_id: JOIN-502
phase: CONNECTION_ONBOARDING
sequence: 502
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["REMOTE_FABRIC_MERGED_MAIN_CI_GREEN"]
development_host: Mech
development_branch: join/JOIN-502-nearby-discovery-approval
development_baseline_sha: 13109b4c206feb3c1a9107b369715e84af65eaf1
development_claimed_at: 2026-10-03T10:25:00Z
development_claim_basis: "MECH CLAIMS JOIN-502 FOR DEVELOPMENT AFTER A CLAIM-TIME RECONCILIATION, AND AFTER WITHDRAWING ITS OWN EARLIER JOIN-501 CLAIM WHEN THAT RACE WAS LOST. THE WITHDRAWAL IS PART OF THIS RECORD because section 2 requires it: this host read Digital-City main 0bbc743, measured JOIN-501 development_host null, created branch join/JOIN-501-pairing-session-lifecycle and committed a claim, and the push was REJECTED because Alien had pushed claim 9545842 for the same task seconds earlier. The claim was withdrawn exactly as the rule prescribes - fetch, re-scan, fast-forward, and no force-push - and the local claim commit was discarded rather than merged, so Alien's claim stands untouched and untouchable. RE-SCAN AFTER THE WITHDRAWAL, measured on Digital-City main 9545842: JOIN-501 development_host Alien (claimed, not re-entered); JOIN-502 development_host null; JOIN-503 development_host null; every review_host null. TWO TASKS WERE THEREFORE AVAILABLE AND JOIN-502 WAS CHOSEN - see development_claim_rationale. DEPENDENCY AND BASELINE RE-MEASURED, not inherited from the sibling claim: (1) REMOTE_FABRIC_MERGED_MAIN_CI_GREEN resolves to evidence - RF-001..RF-010 archived as merged at finished/completed-2026-10-01/remote/; (2) the implementation baseline is Utopia main 13109b4c206feb3c1a9107b369715e84af65eaf1, read by git ls-remote origin refs/heads/main rather than from a local ref, and unchanged between this claim and the withdrawn one; (3) hosted CI on exactly that sha is completed/success for both required workflows - V0.2 checks run 37112596448 and City linkage check run 37112596441; (4) git ls-remote refs/heads/join/* still returns NOTHING, so the sibling development branch has not been pushed yet and this claim cannot collide with it. THE CLAIM IS ATOMIC IN THE RULE SENSE: it sets development_host for JOIN-502 alone, changes no other workbook, and if this push loses a race it is withdrawn rather than forced."
development_claim_rationale: "WHY JOIN-502 RATHER THAN JOIN-503, decided by the workbooks and the measured code rather than by preference. (1) DEPENDENCY ORDER: the programme README section 4 makes all three parallelisable under stable contracts with no sibling merge, and none declares a dependency on another JOIN task - all three declare only REMOTE_FABRIC_MERGED_MAIN_CI_GREEN - so neither remaining task is blocked by Alien holding JOIN-501. (2) WHAT THE BASELINE ALREADY HAS: the current apps/web pairing surface already RENDERS discovery diagnostics from the city snapshot (apps/web/app.js pairingView renders discovery.mdns.state and discovery.ble.state) but offers NO onboarding action, which is exactly the seam JOIN-502 section 2 names - build the integration, adapter and presentation, do not build a second discovery protocol. JOIN-503 instead requires a durable local device identity, a platform credential store and a tokenless restart path, which is a strictly larger change whose real acceptance (restart an app, revoke from another endpoint, prove reconnect fails) is the harder half to make honest from a single host. (3) SECTION 6 CONFLICT SURFACE IS SMALL AND EXPLICIT: JOIN-502 section 6 requires that nearby discovery NEVER secretly mints a short code, which is the same Owner rule JOIN-501 is implementing - so the two tasks touch the same generation path and must not both rewrite it. This host takes the discovery/approval side and will keep every change on the request-join path bounded so that it composes rather than conflicts; the exact interface is recorded before implementation and the residual risk is declared in the development report instead of hidden."
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/JOIN-502
terminal_marker: NEARBY_PC_JOIN_ACCEPTED
---

# JOIN-502 — Nearby PC Discovery + Owner Approval

> **Programme：** [README.md](./README.md)  
> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)

## 1. 目标

把已经存在于 Remote Fabric contract 中的 same-Wi-Fi / LAN discovery 真正接到新 PC 的首屏 onboarding。

默认用户体验：

```text
new PC opens Utopia
→ Nearby Cities
→ choose discovered City
→ Request Join
→ existing trusted device receives approval request
→ Approve / Reject
```

用户不应先去找 URL、IP 或 bare token。

## 2. 复用既有 RF，不重建

必须优先复用已归档并合并的：
- RF-003 local discovery / LAN direct；
- RF-004 BLE bootstrap；
- RF-002 pairing/trust lifecycle；
- RF-010 public Fabric API。

如果当前 product surface 只展示 mDNS/BLE diagnostics，而没有 onboarding action，就补 integration / adapter / presentation；不得另起第二套 discovery protocol。

## 3. 加入入口优先级

产品推荐顺序：

1. same-Wi-Fi / LAN nearby discovery；
2. BLE nearby bootstrap（可用时）；
3. QR；
4. short one-time code；
5. deep/web link；
6. manual host/token engineering fallback。

不是所有平台必须同时支持 BLE，但 UI 必须诚实显示 unavailable / unsupported，不能伪造 discovered device。

## 4. Nearby UX

未连接状态不再只呈现 token 输入。

至少提供：

- `Nearby Cities` / `Nearby Utopia`；
- city display name；
- bounded device/city preview；
- transport hint: LAN / nearby；
- `Request Join`；
- fallback `Use QR / code / link`；
- advanced/manual entry 收进次级入口。

发现结果本身**不授予 trust**。

## 5. Owner approval

Request Join 后：

- 已有 trusted endpoint 收到明确 approval request；
- 显示新 installation 的 bounded preview：
  - requested display name；
  - OS/platform；
  - installation fingerprint / short fingerprint；
  - local/network context when available；
- Approve / Reject；
- 不以 MAC 作为身份锚；
- MAC 可作为本地辅助证据，但 unavailable/randomized 不得阻塞。

未经 approval：
- 不得成为 TRUSTED_NODE；
- 不得拿到 durable membership；
- 不得自动进入 worker pool。

## 6. Pairing code 与 Nearby discovery 的关系

Nearby discovery **不能偷偷生成 short code**。

它可以建立 discovery/request context，但 JOIN-501 的 Owner 规则继续生效：

- 没点 Generate → 页面上没有 temporary short code / QR / invite secret；
- nearby join 可以走自己的 authenticated pairing handshake；
- 若用户主动选择“改用配对码”，才进入 JOIN-501 的 explicit generation。

## 7. 允许修改

- first-run / disconnected web surface；
- discovery adapter；
- approval request presentation；
- existing RF public API glue；
- pairing/trust integration tests；
- minimal server route needed to expose existing RF semantics。

## 8. 禁止修改

- 不重写 mDNS protocol；
- 不把 IP 地址当 stable identity；
- 不自动 trust 同 LAN 设备；
- 不把 discovery response 当认证；
- 不要求用户输入 MAC；
- 不把 Bluetooth 变成主要 bulk transport；
- 不复活 archived RF branch。

## 9. 测试 / 实机

自动：
- no nearby result → fallback 可用；
- discovery result does not imply trust；
- Request Join creates pending approval；
- reject leaves device untrusted；
- approve follows canonical pairing/trust path；
- no hidden pairing-code generation；
- duplicate/replayed request bounded/idempotent。

实机：
- Alien / Mech 同 LAN；
- 一端模拟/执行 clean unregistered installation；
- 另一 trusted endpoint approve；
- 证明加入 canonical City。

Formal Review 由另一实体主机独立完成。

## 10. 完成门槛

终态 `NEARBY_PC_JOIN_ACCEPTED` 要求：
- same-LAN real discovery/join 成功；
- approval gate 真实存在；
- no auto-trust；
- no hidden short-code generation；
- fallback entries 仍可用；
- Development + opposite-host Review + exact-head CI 全部完成。
