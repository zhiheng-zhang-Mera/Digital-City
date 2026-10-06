# CEX-705 — Android City / Device / Member management entries

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../CEX-705-android-member-device-management-parity.md). Source workbook/report controls state, claims, SHA, CI, and gates.
>
> [Persistent rules](../../../../CONSTRUCTION_RULES.md) · [Paper material](PAPER_EVIDENCE_PROTOCOL.md)

## Objective

Bring Web-only management into first-class Android: City rename, enrolled-device identity, revoke, member role, sharing enable/disable, member messages/receipts.

## Required implementation

### Settings

City display name; current-installation summary; enrolled list within credential scope; self/Owner-authorized revoke; no raw secrets.

### Members / Devices

Role, online/computeOnline, sharingEnabled, own-node lawful sharing start/stop, messages, receipt/read state.

## Permissions

Respect server authority: session cannot rename City/revoke other installations; own-node sharing only; sender/recipient scopes; distinguish Owner token and enrolled-session UI.

## Excluded

Rebind/clone recovery CEX-701; interactive Rooms future backlog; Assistant configuration; Workbench profile UI.

## Formal Review

Opposite-host physical Android tests for session user, Owner/control credential, allowed/refused rename, self revoke, other-installation session refusal, sharing toggle, message send/receive/receipt, reconnect, Web/Android canonical comparison.

## Mandatory paper material

Parity gap counts, authority mismatches, session/Owner differences, message latency, reconnect, stale members, duplicate receipts, permission-presentation failures, Review disagreement.

## Completion gate

Listed Android management parity; authority preserved; no Web regressions; opposite-host physical Review; exact-head CI; PAPER_MATERIAL_INDEX; ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED marker.

## Review conclusion (Mech, opposite physical host, physical-device matrix)

Formal Review PASS: `mission-book/reports/CEX-705/REVIEW_REPORT.md`. Nine observed canonical-reconciled tests on OPPO PERM00/BICIPVNB5HS85H9T Android12: both Owner surfaces render; Owner rename changes canonical and Web title; session rename refused both disabled/ineffective UI and server403 “Only the City owner can rename the City”; self revoke sets installation RETIRED, returns app to Find your City, clears shared_prefs token, later credential401 SESSION_UNKNOWN; other-installation revoke denied by narrowed list and server403 SESSION_CANNOT_REVOKE_OTHER, target BOUND; own-node sharing toggles canonical, other-node controls absent; forged senderDeviceId ignored in favor of authenticated identity, PENDING→RECEIVED with receivedAt, unrelated members cannot see, duplicate receipt preserves timestamp; reconnect shows RECONNECTING/non-live cache notice then canonical members without stale installations; City name/member identity/roles/all sharing flags agree across Web/Android/canonical. Empty crash buffer,14785 log lines with0 FATAL/ANR; no session/token log matches, masked token, identity details deviceId/nodeId only.

Six nonblocking findings: **F1 MEDIUM** existing members projection seeds online:true and merges prior.online||n.online, so online:true plus computeOnline:false and nodes[host].online:false yields Android connected while Web offline. members.mjs is **outside this diff**: newly exposed existing defect, not regression. Minimum repair derives online from node where nodeId==deviceId, or null which app displays unreported. F4 LOW control-plane21 missing fields backfilled from CAP-CITY-MEMBERS-NATIVE-001; unmappable G2 empty. F2 LOW unconditional sharing-success handling means seeded sharingEnabled:false member without node renders404 toggle, latent/unexercised. F3 informational Owner toggle depends on hostDeviceId matching node, canToggleSharing requires nodeId==actorRef; main row acquires nodeId only for matching node. Both directions observed; gate correct. F5 informational receipt physical_not_run stale: same-day PHYSICAL_FOLLOWUP.json and independent matrix observe rename/sharing/self/other revoke/outbound messages; only two physical Windows remain untested. F6 informational required gap counts/latency formerly null measured:6 listed/6 Android-reachable; send6ms, recipient-visible9ms, receipt7ms, canonical creation→received9ms, single-machine local City not performance claim. Limitations: one physical phone, other members real HTTP-driven City sessions; Web not driven as enrolled session; no soak/rotation/low-memory tests.
