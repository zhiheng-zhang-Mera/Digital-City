> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../JOIN-502-nearby-pc-discovery-and-owner-approval.md) 的原始 frontmatter 是唯一元数据来源。

# JOIN-502 — Nearby PC Discovery + Owner Approval

> Normative translation source: Git `88d71359a7d82d1d41fd0198d048e80b92d27936`, `mission-book/finished/completed-2026-10-06/connection-onboarding/JOIN-502-nearby-pc-discovery-and-owner-approval.md`. Current canonical frontmatter remains metadata authority. Current §11 English handoff evidence is retained verbatim; damaged source body is not guessed. Reading links relocated for archive.

> [Programme](../README.md) · [Persistent construction rules](../../../../CONSTRUCTION_RULES.md) · [Async relief](../../../../ASYNC_RELIEF_CONSTRUCTION.md).

## 1. Goal

Connect existing RF same-Wi-Fi/LAN discovery to first-screen new-PC onboarding. Default: open Utopia → Nearby Cities → choose City → Request Join → trusted existing device gets approval request → Approve/Reject. User should not first hunt URL/IP/bare token.

```text
new PC opens Utopia
鈫?Nearby Cities
鈫?choose discovered City
鈫?Request Join
鈫?existing trusted device receives approval request
鈫?Approve / Reject
```

The first evidence block above remains the original damaged historical bytes; the preceding sentence translates the verified readable normative flow.

## 2. Reuse RF, do not rebuild

Prioritize archived/merged RF-003 discovery/LAN, RF-004 BLE, RF-002 pairing/trust, RF-010 public API. If only mDNS/BLE diagnostics exist, add integration/adapter/presentation onboarding action, not second discovery protocol.

## 3. Join-entry priority

Same-Wi-Fi/LAN nearby → available BLE bootstrap → QR → short one-time code → deep/web link → manual host/token engineering fallback. Not every platform must support BLE; UI honestly unavailable/unsupported, no fabricated discovered device.

## 4. Nearby UX

Disconnected state exceeds token input. Offer Nearby Cities/Nearby Utopia, City display name, bounded device/City preview, LAN/nearby hint, Request Join, Use QR/code/link fallback, secondary advanced/manual entry. Discovery itself grants no trust.

## 5. Owner approval

Request Join sends explicit approval request to trusted endpoint; bounded new-installation preview includes requested display name, OS/platform, installation/short fingerprint, available local/network context. Approve/Reject; MAC not identity anchor, optional local evidence only, randomized/unavailable not blocker. Before approval: no TRUSTED_NODE, durable membership or automatic worker-pool entry.

## 6. Pairing code and discovery

Nearby discovery cannot secretly generate short code. It may establish discovery/request context; JOIN-501 Owner rules remain: no Generate click means no temporary code/QR/invite secret; nearby join may use its authenticated handshake; explicit user choice to use code enters JOIN-501 explicit generation.

## 7. Allowed changes

First-run/disconnected Web, discovery adapter, approval presentation, RF public glue, pairing/trust integration tests, minimal routes exposing existing RF semantics.

## 8. Prohibited changes

No mDNS rewrite, IP as stable identity, automatic same-LAN trust, discovery response as authentication, required user MAC entry, Bluetooth as main bulk transport, revived archived RF branch.

## 9. Tests / physical devices

Automatic: no nearby result leaves fallback; discovery no trust; join pending approval; rejection remains untrusted; approval follows canonical pairing/trust; no hidden code generation; duplicates/replays bounded/idempotent. Physical: Alien/Mech same LAN, one clean unregistered installation simulated/executed, other trusted endpoint approves, prove canonical City join. Formal Review independently by opposite physical host.

## 10. Completion gates

NEARBY_PC_JOIN_ACCEPTED requires same-LAN real discovery/join success, genuine approval gate, no automatic trust/hidden code generation, fallback available, Development/opposite-host Review/exact-head CI complete.

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
