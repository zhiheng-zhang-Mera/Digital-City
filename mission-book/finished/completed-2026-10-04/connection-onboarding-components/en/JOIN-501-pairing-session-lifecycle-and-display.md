> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../JOIN-501-pairing-session-lifecycle-and-display.md) 的原始 frontmatter 是唯一元数据来源。

# JOIN-501 — Pairing Session Lifecycle + Persistent Display

> [Programme](../README.md) · [Persistent construction rules](../../../../CONSTRUCTION_RULES.md) · [Async relief](../../../../ASYNC_RELIEF_CONSTRUCTION.md).
> [Process data policy](../../../../PROCESS_DATA_POLICY.md).

## 1. Goal

Correct existing Pairing session lifecycle so temporary codes strictly follow Owner semantics:

```text
NO CLICK = NO CODE

click Generate
→ one ACTIVE session
→ same code stays visible
→ consumed OR expired
→ code removed
→ Generate becomes available again
```

This is product lifecycle integration of existing RF pairing sessions, not crypto redesign.

## 2. Actual current code baseline

apps/web/app.js already does not render QR/shortCode/shareable invite when pairing===null; #generate-pairing requests pairing/session; active pairing has countdown; expiresAt triggers clearPairing('pairing.expired'). Still correct unconditional go(next) clearing, pagehide clearing, premature reconnect/status clearing, active button Refresh allowing a new session, and consumed events explicitly clearing UI rather than relying on expiry.

## 3. Owner hard constraints

### 3.1 No implicit generation

Never create pairing session on page entry, route change, City refresh, websocket reconnect, app boot, discovery result, node online/offline event or countdown tick. Sole normal entry: explicit user Generate click.

### 3.2 No code replacement during ACTIVE

Keep identical pairingSessionId, shortCode, QR/invite payload; countdown only reduces time; Generate/Refresh must not create next session. Recommended: hide Generate or disable with pairing code active label, show expiry countdown. No Refresh semantics replacing valid code.

### 3.3 Persistent ACTIVE display

Normal render, snapshot refresh, websocket reconnect, SPA navigation/return and unrelated Settings/Devices updates cannot clear valid display. If full reload recovery is implemented, restore original ACTIVE material, validate expiresAt, enter EXPIRED if necessary; never create session. Do not make temporary material long-term credential through localStorage; prefer tab/app-session persistence.

### 3.4 Consumption

Successful exchange/claim marks server/canonical session consumed; owner receives event/refresh promptly; clear material, explicitly USED, Generate available again. Reuse of consumed secret must fail.

### 3.5 Expiry

Clear active material, show EXPIRED, Generate available; never automatically regenerate.

## 4. Allowed change boundary

apps/web/app.js pairing-only state/render/handlers; pairing i18n/API adapter/events; minimal existing-service lifecycle repair; pairing tests/docs/evidence. If canonical server lacks minimal consumed/active-session read, bounded endpoint/event permitted; no second trust store.

## 5. Prohibited change boundary

No RF-002/005 rewrite, transport-routing change, scheduler/task semantics change, whole-site UI redesign, weakened one-time/expiry semantics or bare token exposure on Pairing.

## 6. Required tests

1. Pairing page entry → create calls 0.
2. Render/refresh/reconnect → create calls remain 0.
3. One explicit Generate → exactly one session.
4. ACTIVE ordinary rerender → same ID/code/payload.
5. ACTIVE SPA leave/return → same session.
6. ACTIVE → no Refresh-created session.
7. Consume → material gone, USED, Generate available.
8. Consumed-secret reuse refused.
9. Expire → material gone, EXPIRED, Generate available.
10. Expiry event does not create.
11. Second explicit post-expiry click → one new different session.
12. No permanent/bare token in pairing material.

## 7. Physical-device acceptance

Developer generates once, triggers City refresh, in-app navigation/return and WebSocket reconnect within validity, proves code/session unchanged, consumes through another real endpoint, proves owner ACTIVE→USED. Opposite physical host independently repeats Formal Review, attacks route/reload/reconnect premature disappearance/replacement; defects get bounded direct repair/regression.

## 8. Completion gates

PAIRING_SESSION_LIFECYCLE_ACCEPTED only when Development complete, opposite-host Review complete, required CI green, active persistence evidence complete, both consumed/expired terminals measured, no implicit generation.
