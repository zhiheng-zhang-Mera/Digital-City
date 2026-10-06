# Reading translation / 阅读译本

[Canonical source / 权威原文](../README.md)

This page translates the explanatory body of a historical reading snapshot; generated bilingual navigation/dashboard blocks are available at the canonical source. Source SHA256: `ddcf9fb99b4967cc438b2a4ffbe9cba06524cb565fe195e77750560b72286431`. Current canonical workbooks and records determine authority and state; this page grants no execution or claim authority.

本页为历史阅读快照的完整解释正文译本；已双语的生成导航/面板见权威原文。当前任务状态以canonical工作书和记录为准，本页不授予执行或领取权。

# Connection Onboarding Optimization

> **Status: COMPLETE / OWNER-CONFIRMED / READY TO ARCHIVE**
>
> **Owner manual confirmation, 2026-10-05:** three-end connectivity was directly confirmed by a human: Web control surface, Windows-host City and physical Android were simultaneously online and usable. This is Owner-level evidence, authority hierarchy item 1 in CONSTRUCTION_RULES.md §0, recorded in JOIN-590's owner_manual_three_end_confirmation and reports/JOIN-590/FINAL_PHYSICAL_ACCEPTANCE_Mech.md.
>
> This programme does not rebuild Remote Fabric. RF-001..RF-010 completed on 2026-10-01, merged Utopia main and were archived. This programme turns existing discovery, pairing, invite, trust and device-identity capabilities into the product path for rapidly joining a new PC to City, eliminating the ordinary user's need to manually manage long-term tokens.
>
> Terminal state: JOIN-501/502/503 components and JOIN-590 merged-main physical acceptance are complete. CONNECTION_ONBOARDING_MERGED_MAIN_PHYSICAL_ACCEPTED is released, and Utopia main contains JOIN-590 merge `59d3e09b1ea51c4b4024160fca1a575818077654`. The whole programme may be archived.
>
> Standing rules: [CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md).
> Asynchronous relief construction: [ASYNC_RELIEF_CONSTRUCTION.md](../../../../ASYNC_RELIEF_CONSTRUCTION.md).
> Process-data rules: [PROCESS_DATA_POLICY.md](../../../../PROCESS_DATA_POLICY.md).
> Historical Remote Fabric: [remote/README.md](../../../completed-2026-10-01/remote/README.md).

## 1. Owner objective

The default experience for joining a new PC should move from:

```text
find City URL
→ copy token
→ paste token
→ connect
```

to:

```text
open Utopia
→ discover nearby City
→ request join
→ approve on an existing trusted device
→ enroll this installation
→ future reconnect automatically
```

QR, short pairing codes, deep links and web links remain fallback/remote bootstrap. Manual URLs and bare tokens remain engineering fallback only, outside the normal user path.

## 2. Code facts at programme creation (historical background)

When this programme book was created, Utopia apps/web/app.js already contained the Pairing page, POST /api/v0/pairing/session, QR payload, short code, shareable utopia://pair?... invite, invite exchange, mDNS/Bluetooth diagnostics and Generate button. Therefore this programme must not reimplement completed RF-001..RF-010 as “missing capabilities.”

The following creation-time component defects were subsequently repaired by archived JOIN-501/502/503 and independently reviewed; they are no longer currently claimable work:

1. go(next) calls clearPairing().
2. pagehide calls clearPairing().
3. Reconnect/refresh-related state may clear the active pairing display.
4. During active pairing, the button changes to Refresh, permitting code replacement before expiry.
5. Normal first connection can still fall back to bare-token input.

These were the programme's real entry points.

## 3. Inviolable temporary pairing-code rules

These are Owner-level product semantics, overriding old UI behavior.

### 3.1 Never appear before explicit generation

Only after the user **actively clicks “Generate pairing code”** may the product create and display short code, QR, one-time secret, shareable invite and countdown/expiresAt. Entering Pairing, refreshing City state, discovering devices, launching Utopia, reconnecting WebSocket and rendering a page **must not automatically generate** temporary pairing material.

### 3.2 Fixed during validity, without early refresh or replacement

The fixed state machine is:

```text
IDLE
  -- owner clicks Generate -->
ACTIVE
  -- successfully consumed --> CONSUMED
  -- expires -------------> EXPIRED

CONSUMED / EXPIRED
  -- owner clicks Generate -->
ACTIVE(new session)
```

Forbidden:

```text
ACTIVE -- Refresh --> ACTIVE(new code)
```

While ACTIVE, the current short code, QR and invite must retain the same session. Generate must be disabled, hidden or replaced by a status that generates nothing. No silent rotation and no background auto-refresh creating a new session are permitted.

### 3.3 Persistent display until used or expired

ACTIVE pairing material must remain visible on the product page until the session is successfully consumed by another device or expiresAt is reached. Ordinary re-render, City snapshot refresh, WebSocket reconnect, returning from internal navigation and non-destructive UI-state refresh must not make a valid code disappear early.

If browser reload or app-process restart supports restoration, restore **only the same still-valid session**. Restoration must never generate a new code. Browser sessionStorage or a bounded client cache may preserve the current active display material, but must not become permanent credential storage.

### 3.4 Generate again only after consumption or expiry

After successful consumption or expiry, remove the active code/QR/invite, clearly show USED or EXPIRED, and display Generate pairing code again. Only another explicit user click may create the next session.

## 4. Programme work breakdown

Component construction is complete and archived:

| ID | Status | Accepted implementation head |
|---|---|---|
| [JOIN-501](../../../completed-2026-10-04/connection-onboarding-components/JOIN-501-pairing-session-lifecycle-and-display.md) | COMPLETE / ARCHIVED | `e925ae1ef4dda6f51d89a1faa025d1b8666d8c58` |
| [JOIN-502](../../../completed-2026-10-04/connection-onboarding-components/JOIN-502-nearby-pc-discovery-and-owner-approval.md) | COMPLETE / ARCHIVED | `86deda9c2990c78d683a8c3515d251022df9d040` |
| [JOIN-503](../../../completed-2026-10-04/connection-onboarding-components/JOIN-503-device-enrollment-and-tokenless-reconnect.md) | COMPLETE / ARCHIVED | `77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f` |

Git ancestry confirms all three accepted heads entered current Utopia main. The source retains this historical “only currently claimable work” table:

| ID | Work | Status | Objective |
|---|---|---|---|
| [JOIN-590](../JOIN-590-merged-main-physical-acceptance-and-closeout.md) | Merged-main Physical Acceptance + Closeout | READY | Complete onboarding, restart and revoke acceptance on two physical Windows hosts, explicitly deferred by historical Review, then close the programme. |

## 5. Closeout lock

JOIN-501/502/503 implementations and Formal Review are complete and accepted heads are in main, so do not create another sibling merge. Only JOIN-590 merged-main physical acceptance remains in this historical sequence. The connection-onboarding/ programme may archive only after JOIN-590 completes and records CONNECTION_ONBOARDING_MERGED_MAIN_PHYSICAL_ACCEPTED.

## 6. User-visible terminal product path

The target path is:

```text
NEW PC
  ↓
Utopia starts
  ↓
Nearby Cities
  ├─ same Wi-Fi / LAN discovery (preferred)
  ├─ BLE bootstrap (when useful)
  ├─ QR
  ├─ short one-time code
  ├─ deep/web link
  └─ manual address/token (engineering fallback)
  ↓
Request Join
  ↓
Existing trusted device: Approve / Reject
  ↓
Existing RF trust + identity lifecycle enrolls the installation
  ↓
Device appears in City
  ↓
Future boot: authenticate with stored device identity
  ↓
ONLINE
```

Tokens may remain inside protocol/session plumbing, but ordinary users must not be asked to manage them.

## 7. Scope boundaries

Allowed: Utopia pairing/onboarding presentation; existing RF public-API adapter/integration; discovery presentation; pairing-lifecycle persistence; trust approval UI; device-enrollment/reconnect glue; and tests, evidence and documentation needed for these changes.

Forbidden: rewriting RF transport; a second pairing/trust state machine or device identity; changed scheduler/assistant semantics; refactoring the UI Civilization shell under onboarding; unlimited crypto/network scope expansion “for safety”; reopening archived RF-001..RF-010.

## 8. Minimum physical acceptance topology

Minimum: Alien Windows and Mech Windows. Current physical Android may provide additional approval/control-surface evidence. Prove at least once that an unenrolled PC installation joins, an existing trusted endpoint approves, the device appears in canonical City, restart needs no bare-token re-entry, and the revoked old identity cannot continue reconnecting automatically. Every step inherits Mission Book's independent Review across two physical hosts.

## 9. A test-probe defect found after acceptance (decision awaits the record holder)

JOIN-590 is COMPLETE with its marker released. A later REX integration preflight full suite produced a false red at tests/relay-s1-tunnel.test.mjs:420. Investigation found a **probe defect, not a product defect**:

```text
规则 / the rule     同一 relay peer 在 1000 ms 窗口内第 21 个请求得到 429（RELAY_REQUESTS_PER_SECOND=20）
探针 / the probe    顺序 await 发 30 个请求，要求至少一个 429
=> 只有当前 21 次往返平均快于约 48 ms 时才成立；主机一忙，窗口被重新填满，断言失败而限流器正常
```

Full translation: the same relay peer receives 429 on request 21 within a 1000 ms window, RELAY_REQUESTS_PER_SECOND=20. The probe sequentially awaits 30 requests and expects at least one 429. This holds only if the 21 round trips average faster than approximately 48 ms; a busy host lets the window refill, failing the assertion while the limiter behaves correctly.

- **In situ evidence:** the first full union run had four failures including this one; the repeat had three, with this failure disappearing. Main baseline had the same three launcher failures. The union changed no line of the test or limiter.
- **Limit:** **not reproducible on demand**—12 CPU burners yielded 0/6, concurrent full-suite execution yielded 0/6. This is explicitly not described as reproduced.
- **Direct proof:** the same limiter/helper and the same injected 60 ms latency per request, changing only sending discipline: sequential await rejects **0/30**, concurrent burst rejects **10/30**, with all requests written within 0 ms. Two runs agree. The repaired probe passed ten consecutive local runs; full suite 1356/1359, with the three host-city-launcher failures.
- **Repair:** repair/mech-relay-rate-probe-burst, based on current main b06504f. All three product assertions remain unchanged; send the burst as a burst and report sending span on failure.
- **Status:** **verified proposal awaiting adoption**. This host has no JOIN-series merge authority; adoption belongs to the task's record holder. Full record: ../reports/RELAY_RATE_PROBE_HOST_SPEED_MECH.md.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **2**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|

### 本目录说明 / Local documents

- [JOIN-590-merged-main-physical-acceptance-and-closeout.md](JOIN-590-merged-main-physical-acceptance-and-closeout.md)

<!-- DOCUMENT_NAVIGATION:END -->
