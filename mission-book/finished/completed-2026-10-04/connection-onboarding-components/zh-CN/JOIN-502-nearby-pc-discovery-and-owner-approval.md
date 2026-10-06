> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../JOIN-502-nearby-pc-discovery-and-owner-approval.md) 的原始 frontmatter 是唯一元数据来源。

> Normative-body source: Git `88d71359a7d82d1d41fd0198d048e80b92d27936`, `mission-book/connection-onboarding/JOIN-502-nearby-pc-discovery-and-owner-approval.md`. Current canonical frontmatter remains authority; damaged bytes are retained, not guessed. Reading links relocated only.



# JOIN-502 — Nearby PC Discovery + Owner Approval

> **Programme：** [README.md](../README.md)
> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md)
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../../../../ASYNC_RELIEF_CONSTRUCTION.md)

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

- [DEVELOPMENT_REPORT.md](../../../../reports/JOIN-502/DEVELOPMENT_REPORT.md): what was built; eight load-bearing choices/alternatives/costs; six defects found by running it; §9 test mapping; real-host LAN acceptance; explicit limits.
- [EVIDENCE_LIVE_LAN_ACCEPTANCE.md](../../../../reports/JOIN-502/EVIDENCE_LIVE_LAN_ACCEPTANCE.md): verbatim receipt, each line's meaning/falsifier, investigated libuv teardown assertion, limits.

Formal-review handoff, next eligible role on a different physical host:

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
