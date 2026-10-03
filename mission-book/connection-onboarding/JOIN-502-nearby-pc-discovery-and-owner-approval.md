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
development_head_sha: 86deda9c2990c78d683a8c3515d251022df9d040
development_ci: "37119234473 COMPLETED SUCCESS on exactly 86deda9c2990c78d683a8c3515d251022df9d040 (workflow 'V0.2 checks', jobs gateway-web + android, both completed/success, started 2026-10-03T11:18:29Z) - the exact-head hosted CI this workbook requires, read from the GitHub Actions API by head_sha and confirmed job by job, not inferred from a neighbouring sha. NOTE ON THE OTHER WORKFLOW: 'City linkage check' is triggered only on pushes to main and on pull requests, so a task-branch push has no run of its own; its green on the baseline main 13109b4 (run 37112596441) stands as the linkage evidence, and PROJECT_LINKAGE.json is untouched by this task."
development_complete: true
development_outcome: "DEVELOPMENT COMPLETE AND HANDED TO AN OPPOSITE-HOST REVIEW; the terminal marker NEARBY_PC_JOIN_ACCEPTED is NOT set, because section 10 also requires an opposite-host review that has not happened yet. WHAT WAS BUILT: the browse half of RF-003 (services/dev-gateway/nearby.mjs), the request/approval state machine (services/dev-gateway/join.mjs), the pure browser adapter (apps/web/discovery.js), the first-run onboarding surface with Nearby Cities, Request Join and the owner's Approve/Reject card, and seven routes - four public because a joining PC holds no credential (join/info, join/request, join/status, join/exchange, the last two gated by the requester's own claim secret) and three authenticated (the browse and both decision routes). NO second discovery protocol, NO second trust store, NO second device registry, NO new credential type: an approval releases the City's EXISTING control credential. WHAT WAS MEASURED RATHER THAN ASSUMED: 1071/1071 root tests pass on the committed tree; real-host acceptance on this host's LAN interface 172.31.12.151 with two real gateways publishing and browsing over real mDNS found 2 Cities with their authoritative identities, held the approval gate (exchange before approval 409), released a credential that genuinely authenticates (200 against /api/v0/city with a matching cityId), refused the replay (410) and put no secret in the approver's listing. EIGHT LOAD-BEARING CHOICES AND SIX DEFECTS FOUND BY RUNNING IT are recorded in reports/JOIN-502/DEVELOPMENT_REPORT.md with their reasoning; the defects include a second if-chain that made every join route answer 404 while working correctly, a version check that skipped the public join routes, a rejection that told the requester its own request belonged to somebody else, and a poll that failed with the very state it exists to report. NOT ESTABLISHED AND SAID SO: no second PHYSICAL PC was driven end to end (the second City ran on this host's LAN interface) so workbook section 9's Alien+Mech topology is deferred to the phase integration; BLE is advertise-only and a browser cannot scan it, which the UI states rather than fakes; durable device identity remains JOIN-503. REVIEW IS THE NEXT ELIGIBLE ROLE AND MUST BE A DIFFERENT PHYSICAL HOST per CONSTRUCTION_RULES section 3."
review_host: Alien
review_head_sha: null
review_ci: null
review_complete: false
review_claim_basis: "CLAIMED BY ALIEN, ON A DIRECT OWNER AUTHORISATION, AFTER A SECTION-7 EXACT-HEAD RECONCILIATION. The Owner was asked whether this host could take JOIN-502's review and answered 允许, which matters because CONSTRUCTION_RULES section 3 requires only that the reviewer be a DIFFERENT ENTITY HOST FROM THE DEVELOPMENT HOST, not that it be any particular host: Mech developed this workbook and Alien did not, so Alien reviewing it satisfies the rule. DECLARED HONESTLY SO IT IS NOT MISTAKEN FOR A STRONGER INDEPENDENCE THAN IT IS: this reviewer is not a stranger to the subject matter - it developed the sibling JOIN-501 and JOIN-503, including the pairing-session lifecycle that JOIN-502 section 6 must not violate, and it shares the author's platform assumptions. That makes some defects MORE visible to it (a hidden short-code generation is precisely what JOIN-501 forbids, so this reviewer is primed to look for it) and it is recorded as a bias as well as an advantage. MEASURED AT CLAIM TIME, NOT INHERITED: (1) the workbook reads development_complete true, development_host Mech, review_host null, so no reviewer had claimed it and this claim overwrites nobody; (2) development_head_sha is 86deda9c2990c78d683a8c3515d251022df9d040 and git ls-remote of refs/heads/join/JOIN-502-nearby-discovery-approval returns the SAME sha, read from the remote rather than from a local ref; (3) hosted workflow 'V0.2 checks' run 37119234473 is COMPLETED SUCCESS on exactly that sha, jobs gateway-web and android both success, re-queried through the GitHub Actions API by head_sha rather than inherited from the development record; (4) the pool was re-scanned first - JOIN-501 and JOIN-503 are review-complete with their terminal markers recorded, JOIN-502 is the only lane left, and the phase integration (README section 5) stays locked until this review exists. THE CLAIM IS ATOMIC IN THE RULE SENSE: this commit sets review_host and review_head_sha, and if the push loses a race the claim is withdrawn rather than forced. review_complete stays false until the report exists, and NEARBY_PC_JOIN_ACCEPTED is NOT set by this commit."
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

## 11. Reports

- [DEVELOPMENT_REPORT.md](../reports/JOIN-502/DEVELOPMENT_REPORT.md) — what was built, the eight load-bearing choices with their alternatives and costs, the six defects found by running it rather than reading it, the §9 test mapping, the real-host LAN acceptance, and the limits stated as limits.
- [EVIDENCE_LIVE_LAN_ACCEPTANCE.md](../reports/JOIN-502/EVIDENCE_LIVE_LAN_ACCEPTANCE.md) — the verbatim acceptance receipt, what each line establishes and what would falsify it, the investigated libuv teardown assertion, and the limits.

Handoff for the formal review — the next eligible role, on a **different physical host**:

```text
TASK_ID              JOIN-502
ROLE                 formal review (opposite host)
IMPLEMENTATION_REPO  zhiheng-zhang-Mera/utopia
CONTROL_REPO         zhiheng-zhang-Mera/Digital-City
BRANCH               join/JOIN-502-nearby-discovery-approval
BASELINE_SHA         13109b4c206feb3c1a9107b369715e84af65eaf1
HEAD_SHA             86deda9c2990c78d683a8c3515d251022df9d040
CI                   37119234473 SUCCESS on exactly HEAD_SHA (gateway-web + android)

DONE                 browse adapter, join/approval state machine, onboarding surface, 7 routes,
                     19 task tests, full suite 1071/1071, real-LAN acceptance (this host only)
CURRENT_TRUTH        development_complete true; review_complete false; no terminal marker
OPEN_FINDINGS        none raised by the author; the author's own six defects are recorded and fixed
REPAIRS_APPLIED      six, each with a test or an acceptance assertion behind it
NEXT_ACTION          attack the approval gate, the claim binding, the no-short-code boundary,
                     the fragment pin, and the "unavailable must be honest" claims
WAKE_CONDITION       review claimed by a different physical host
BLOCKER_TYPE         NONE
OWNER_REQUIRED       false
EVIDENCE_POINTERS    reports/JOIN-502/*, tests/join502-*.test.mjs, services/dev-gateway/{join,nearby}.mjs
```

