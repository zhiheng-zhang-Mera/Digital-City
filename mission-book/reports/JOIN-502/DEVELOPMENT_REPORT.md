# JOIN-502 — Development report

> **Workbook:** [JOIN-502-nearby-pc-discovery-and-owner-approval.md](../../finished/completed-2026-10-04/connection-onboarding-components/JOIN-502-nearby-pc-discovery-and-owner-approval.md)
> **Programme:** [connection-onboarding/README.md](../../connection-onboarding/README.md)  
> **Development host:** Mech (this host) — review is deliberately left to a different physical host  
> **Branch / head:** `join/JOIN-502-nearby-discovery-approval` @ `86deda9c2990c78d683a8c3515d251022df9d040`  
> **Baseline:** Utopia `main` `13109b4c206feb3c1a9107b369715e84af65eaf1`  
> **Hosted CI:** run `37119234473` COMPLETED SUCCESS on exactly `86deda9` (workflow *V0.2 checks*, jobs `gateway-web` + `android`)  
> **Status:** development complete, **not** terminally accepted — the terminal marker `NEARBY_PC_JOIN_ACCEPTED` also needs an opposite-host review.

## 1. What this task was actually about

The gap is the **approval seam**, not discovery. Measured before writing anything:

- the City **already advertises** itself over mDNS (`services/dev-gateway/discovery.mjs` publishes `_utopia-city._tcp` with `mdnsTxt()`), and `contracts/remote-local-discovery-v1/discovery.mjs` (RF-003) already defines what an advertisement and a normalized candidate *are*;
- the product surface already **renders** those diagnostics (`pairingView` prints `discovery.mdns.state` and `discovery.ble.state`);
- but **nothing browsed** the service type, **nothing could ask** to join, and **nothing could decide**. A joining PC could only ever succeed by presenting a temporary pairing secret that the owner's own surface had generated.

So this task is the integration/adapter/presentation the workbook section 2 asks for, and it is emphatically **not** a second discovery protocol, a second trust store, or a second device registry.

## 2. What was built

| Piece | File | Role |
|---|---|---|
| Browse half of RF-003 | `services/dev-gateway/nearby.mjs` | mDNS records → the contract's own advertisement shape → `normalizeCandidates`; plus reading each discovered City's authoritative identity |
| Request / approval state machine | `services/dev-gateway/join.mjs` | PENDING → APPROVED → CONSUMED, with REJECTED and EXPIRED terminal; bounds, persistence, claim binding |
| Discovery adapter | `apps/web/discovery.js` | pure normalisation, dedup, two-sided freshness, transport wording, soft-failing probe |
| Onboarding surface | `apps/web/app.js`, `apps/web/index.html`, both locale packs | Nearby Cities, Request Join, waiting/approved/rejected states, the owner's approval card |
| Four public + three authenticated routes | `services/dev-gateway/server.mjs` | `join/info`, `join/request`, `join/status`, `join/exchange` public (a joining PC has no credential); `join/nearby` (browse) and the decision routes authenticated |

`join/status` and `join/exchange` are public *routes* but not public *operations*: both are gated by the requester's own claim secret. Every **decision** route is authenticated, because deciding who joins is exactly what a control credential is for.

## 3. The choices this task had to make, and why

The instruction was to pick the best option where the workbook left a choice, and to record the problem, the choice and the reasoning. These are the load-bearing ones.

### C-1 — The ask travels in a URL fragment, not as a cross-origin POST

**Problem.** The joining page discovers a *different* origin, so `POST /api/v0/join/request` is cross-origin. The gateway sends no CORS headers (the existing pairing exchange has the same property), so the browser refuses it.

**Options considered.** (a) add CORS headers to the join routes; (b) build a relay so the joining PC's own City forwards the ask; (c) carry the ask to the target origin in its fragment, exactly as the existing `#pair=` invite already does.

**Chosen: (c).** (a) would open the City's join routes to *any* web page the user happens to visit — a permanent widening of the attack surface to save one navigation. (b) would have the joining host's City hold the requester's claim secret, which is a second copy of a secret in a second process and a TOCTOU gap between "approved" and "collected" that this change cannot honestly verify. (c) reuses a pattern the repository already trusts: fragments are never sent to a server, so the claim never enters a City log, and the target page strips it from the address bar as soon as it has read it.

**Cost of the choice:** one navigation, and the claim briefly lives in the address bar of the City being joined.

### C-2 — Same-origin asks are delivered directly, not by navigation

**Problem, found by running it.** `location.assign('http://host/#join=…')` when the page is *already* on `http://host/` is a **same-document** navigation: the page does not reload, the boot path never runs, and the ask is silently never recorded. First UI test run: the row never appeared and the request list stayed empty.

**Chosen:** if the discovered endpoint equals `location.origin`, call `resumeJoin(...)` directly. The fragment remains the transport for the cross-origin case, where a real load happens.

### C-3 — The pinned City identity is the FULL id, read from the City

**Problem, found by running it.** `mdnsTxt()` publishes `city: d.cityId` — but `discovery.mjs` publishes the service as `Utopia-<first 8 chars>`, and the browser test's attempt to pin the advertised value made the receiving City refuse a legitimate hand-off ("this join link names a different City"). A prefix is not an identity.

**Options considered.** (a) loosen the check to a prefix match; (b) read the full identity from the discovered City's own capability endpoint; (c) stop pinning the City at all.

**Chosen: (b).** (a) would weaken exactly the check that stops an ask being delivered to the wrong owner, and an 8-hex-character prefix is not a safe thing to match on. (c) would let a stale or tampered link ask the wrong City to approve a join. (b) costs one bounded GET per discovered City (`identifyCity`, 1500 ms, parallel, and a City that cannot answer is **dropped from the list** rather than offered as a target that cannot be joined).

### C-4 — Approval releases the City's EXISTING control credential

**Chosen deliberately, and it is the point.** The workbook's identity boundary forbids "a second user-visible permanent token", "a second device registry", and MAC/IP as trust identity. So `join/exchange` returns the credential the City already issues to control surfaces — the same one a pasted token would be. No new credential *type* is introduced; the browser holds it in `sessionStorage` exactly as before, and durable device identity remains JOIN-503's work.

### C-5 — A status poll answers with the terminal STATE, not an HTTP error

**Problem, found by the full suite.** Routing every read through the authorizing lookup made `join/status` answer **410** for an expired request — but the poll is precisely how the requester learns it expired. A poll that fails cannot report the one thing it exists to report. Split into `findByClaim` (authorizing operations, which still fail on a terminal state) and `locate` (reads, which do not). Refusals still fail: a claim that is not the caller's is 403.

### C-6 — A rejection answers the requester, and keeps its claim digest

**Problem, found by the UI test, in two layers.** Rejecting cleared the record's claim digest, so the requester's own next poll was told *its* request "belongs to another requester" and the page never learned it had been rejected. Then, once the state did reach the page, every failure was reported as `EXPIRED`, so a rejection was shown to the user as "no longer valid" — true of the request, useless to the person reading it. Fixed by resolving a decided request to its decision (which releases nothing) and by mapping the status to the terminal state (`joinTerminalState`).

### C-7 — The capability statement reports real discovery state

`joinCapability` originally returned the constants `mdns: 'PUBLISHED'`, `ble: 'ADVERTISE_ONLY'`. The workbook requires "unavailable must be honest", so the state is passed in from the gateway. A City whose publisher failed now says so on the one endpoint a joining PC consults.

### C-8 — Not adding CORS, not adding a second browse route, not touching JOIN-501's code

`join/nearby` (the browse) is authenticated because it is a read of *this* City's LAN view. The client half is the same-origin page, which always has a credential through the launcher/invite path. Section 6 of the workbook makes JOIN-501's Owner rule a hard boundary for this task, so nothing here touches pairing generation: `pairingView`, `clearPairing`, the generate handler and the pairing routes are untouched, and a test measures that a browse + request + approve sequence leaves `pairing/info` reporting `activeSession: false` with `pairingSessionId: null`.

## 4. Defects found by running it, not by reading it

All four were found by the first end-to-end and browser runs, and each is now covered by a test or asserted by the acceptance script:

1. **A second `if` chain overwrote `out`** for every join route, so all four answered `404 Not Found` *while doing their work correctly*. Caught by the first scripted probe; the store already contained the row while the route reported 404.
2. **The version check was gated on `!publicPairing`**, so the public join routes got **no** version check at all, and the page's own capability call then failed 409. The rule now reads: only `pairing/info` and `pairing/exchange` skip the header, because their callers are already deployed.
3. **The `claimDigest` reset on rejection** (C-6) and **the 410-on-expiry poll** (C-5).
4. **A third-party navigation assumption** (C-2) and **a prefix used as an identity** (C-3).

## 5. Test coverage

Automatic, all in the root suite (`node --test tests/*.test.mjs` — 1071 tests, 1071 pass, 0 fail on `86deda9`):

| File | What it attacks |
|---|---|
| `tests/join502-nearby.test.mjs` (8 tests) | adapter rules: dedup by identity not address, two-sided freshness, no endpoint → not offered, soft-failing probe, the contract's own `DEVICE_ID_REQUIRED` refusal, capability honesty |
| `tests/join502-gateway.test.mjs` (9 tests) | the approval gate, claim binding to one requester, duplicate re-ask is one card, rejection is permanent, expiry cannot be approved back into life, the bound on pending asks, decision survival across a City restart, secret sweeps of listing + snapshot + state file + events, and an approval reaching a **second** surface over the canonical event stream |
| `tests/join502-ui.test.mjs` (2 tests) | the real page in a real browser: browse → untrusted row → hand-off → pending ask → owner card → approve → the joining page comes online; a refused browse still offers the fallbacks; a rejected ask leaves the device outside the City |

Workbook section 9 mapping: *no nearby result → fallback available* (`join502-ui` test 2), *discovery result does not imply trust* (both), *Request Join creates pending approval* (gateway + ui), *reject leaves device untrusted* (gateway + ui), *approve follows the canonical path* (gateway + ui), *no hidden pairing-code generation* (gateway, measured through `pairing/info`), *duplicate/replayed request bounded* (gateway).

`tests/pairing.test.mjs` was updated for the one contract change: `mdnsTxt()` now also carries `join:'1'`, so a browsing client can tell from the advertisement alone that a City accepts the protocol.

## 6. Real-host acceptance on this machine

Script: `.runtime/join502-live-check.mjs` (untracked, under the City's own runtime directory). Run on this host's **real LAN interface** `172.31.12.151` with **real mDNS publication and a real browse**, not a loopback shortcut:

```text
[live] cities-up: http://172.31.12.151:61770 and http://172.31.12.151:61773 on 172.31.12.151, discovery enabled on both
[live] browse: discovered 2 City/Cities: Utopia · Alien@…:61770#a40f0234-…, Utopia · Alien@…:61773#d9b8a872-…
[live] identity: peer http://172.31.12.151:61773 reported cityId d9b8a872-ffd5-4d28-abca-bde4a4a7647d
[live] gate-holds: request PENDING; exchange before approval -> HTTP 409
[live] approved: approve HTTP 200; exchange HTTP 200; credential authenticates -> HTTP 200, cityId d9b8a872-…
[live] spent: replay -> HTTP 410; final state CONSUMED
[live] secrets: requester claim or City credential present in the owner listing: false
{"ok": true, "lan": "172.31.12.151", …}
```

This demonstrates, against real services: two Cities discoverable over real multicast on the LAN interface, full identity read before pinning, the approval gate holding (409 before approval), the released credential genuinely authenticating (200 against `/api/v0/city` with a matching `cityId`), one-shot collection (410 on replay), and no secret in the approver's view.

## 7. Not established by this host, and stated as such

- **No second physical PC was driven end to end.** The second City ran on this host's LAN interface, so the network path is real but the *second machine* is not. The workbook's minimum topology (Alien + Mech) therefore remains **deferred to the phase integration**, whose entry conditions already require exactly that. `deferred != passed`.
- **BLE.** Discovery over Bluetooth is advertise-only in the current code (`platform/windows/ble.mjs` publishes; there is no scanner), and a browser cannot scan BLE at all. The UI states this instead of faking a nearby device, and a discovered City's capability statement reports the real BLE state.
- **Durable identity.** The joining browser still holds a session credential in `sessionStorage`; "restart and do not type a token" is JOIN-503.
- **A benign shutdown assertion on Windows.** When **two** gateways with mDNS publication are closed in the same process, Node can exit with a libuv assertion (`!(handle->flags & UV_HANDLE_CLOSING)`, `src/win/async.c`) *after* the acceptance result has been printed. A single City with discovery enabled closes cleanly, so this is a bonjour-service teardown race in the test harness, not a defect in the join path; it is reported rather than hidden.
- **Review-independent re-verification.** The evidence below was produced by the development host. Per `CONSTRUCTION_RULES.md` §3 the formal review must come from a **different physical host**, and it has not happened yet.

## 8. Evidence index

| Item | Where |
|---|---|
| Head `86deda9` | `join/JOIN-502-nearby-discovery-approval` (pushed; `ls-remote` read) |
| Hosted CI, exact head | run `37119234473`, jobs `gateway-web` + `android`, both `completed/success` |
| Full suite on the committed tree | 1071 tests / 1071 pass / 0 fail, read from the main checkout with `git diff 86deda9` empty (host environment; the bare worktree lacks the `city/` third-party installs that CI performs separately) |
| Live LAN acceptance | this report §6 |
| Observation receipt | [EVIDENCE_LIVE_LAN_ACCEPTANCE.md](./EVIDENCE_LIVE_LAN_ACCEPTANCE.md) |

## 9. Deferred seams for the phase integration

1. real second physical PC joining a City over the LAN (Alien + Mech), as workbook section 9 requires;
2. the joined installation appearing in the City's Devices view as an enrolled node — that is JOIN-503's enrollment, deliberately not faked here;
3. a revoke path exercised against a joined device (JOIN-503);
4. the fragment hand-off on a platform whose launcher cannot open a second local City (falls back to QR / code / link / manual entry, all of which remain on screen).
