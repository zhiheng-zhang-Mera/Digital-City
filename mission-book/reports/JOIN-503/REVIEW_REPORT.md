# JOIN-503 — Formal review report

> **Workbook:** [JOIN-503-device-enrollment-and-tokenless-reconnect.md](../../connection-onboarding/JOIN-503-device-enrollment-and-tokenless-reconnect.md)  
> **Reviewed head:** `ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7` on `join/JOIN-503-device-enrollment-and-tokenless-reconnect`  
> **Development host:** Alien — **review host: Mech** (different physical host, `CONSTRUCTION_RULES.md` §3)  
> **Hosted CI on the reviewed head:** run `37117241912` COMPLETED SUCCESS on exactly that sha, branch `join/JOIN-503-device-enrollment-and-tokenless-reconnect` (workflow *V0.2 checks*), re-queried by head_sha rather than inherited  
> **Repair delivered on:** `review/JOIN-503-mech-formal-review` @ `a3b9ab3` — `services/dev-gateway/server.mjs`, `tests/join503-review-privilege.test.mjs`  
> **Verdict:** **REPAIR REQUIRED (D-1, D-2) — repair delivered and proven; review NOT yet complete.** `review_complete: false`, terminal marker **not** recorded.

## 1. Exact-head reconciliation

| Fact | Measured |
|---|---|
| Workbook `development_head_sha` | `ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7` |
| Remote branch tip (`git ls-remote`) | the same sha |
| Hosted CI on that sha | run `37117241912`, branch `join/JOIN-503-device-enrollment-and-tokenless-reconnect`, `completed/success` |
| Reviewer host vs development host | Mech vs Alien — independent |
| Base of the reviewed commit | `e925ae1` (the JOIN-501 head); the reviewed range is `e925ae1..ede6fa2`, 10 files, +1300/−15 |

## 2. What the change does, and whether it belongs to this task

The registrar (`services/dev-gateway/enrollment.mjs`) is a **seam** over `city/00-foundation/02-city-node-network/device-identity` rather than a parallel registry: it imports `createInstallation`, `resolveInstallationPresentation`, `retireInstallation`, `rebindInstallation`, `detectCredentialClones` and friends, and adds only the session half (mint, check, revoke). The durable credential (`cred-…`/secret) is minted once, returned once, stored by the device layer (`.runtime/device-enrollment.json`, `mode 0600`, and `.runtime/` **is** git-ignored), and never reaches the browser; the browser receives a `sess:` credential. That is the workbook's §2 identity boundary and §5 "the browser holds only a session-scoped credential", and it is respected.

`auth()` resolves a `sess:` bearer against the registry **on every request, never cached**, and the WebSocket handshake goes through the same `auth()`, so a revoked installation is refused on the very next request *including a reconnect*. That is the mechanism §4 requires.

## 3. Findings

### D-1 — REQUIRED REPAIR: a session credential could revoke ANY other installation

**Observed head** `ede6fa2`. `POST /api/v0/device/installations/:id/revoke` required only `auth()`, and `auth()` accepts a `sess:` credential — so **any enrolled installation, holding nothing but the short-lived session credential a browser keeps in `sessionStorage`, could revoke any other installation**, including the installation the owner was using. `GET /api/v0/device/installations` likewise answered that session with the City's **entire** enrollment roster (every installation and device record).

**Why it is a defect and not a choice.** The two sibling routes already refuse a session with `SESSION_CANNOT_ENROLL` and `SESSION_CANNOT_REBIND`, and the author's own comment on the enrollment route states the intended boundary in as many words: *"Nothing here is reachable by a session credential, so a joined device cannot enroll a second device for itself."* Revoke is where that intent was not enforced, and the asymmetry is not defensible: a session is scoped to **one** installation.

**Minimum repair boundary** (no wider than the defect): the owner's control token keeps seeing and acting on every installation exactly as before; a session sees only itself (`scope: OWN_INSTALLATION`) and may revoke only itself (a device leaving the City is legitimate and affects nobody else); anything else gets the typed refusal `SESSION_CANNOT_REVOKE_OTHER`.

**Repair applied** on the review branch (`a3b9ab3`), with `tests/join503-review-privilege.test.mjs` as its guard. The guard is **proven to be a guard, not a description**: against the unrepaired head it **FAILS** (roster scope `undefined`, cross-installation revoke succeeding) and with the repair it **PASSES**; the author's own 13 tests still pass; and the repaired path still bites — a revoked installation is refused on the very next request.

### D-3 (note, not repaired) — a control token that begins with `sess:` would be routed to the session validator

`auth()` routes on the literal prefix `Bearer sess:`. A City whose control token happened to start with those five characters would have that token resolved as a session id and refused, locking the owner out until the token was changed. It is fail-closed (the request is refused, never accepted with the wrong authority) and no generated token has that shape, but the routing would be more honest as "if the session registry recognises this value, it is a session; otherwise it is compared with the control token". Out of the bounded-repair scope for this finding; recorded for the phase integration.

### D-4 (note) — the two-machine acceptance in §9 is DEFERRED, not passed

The workbook's acceptance requires two **physical** hosts (`Alien` + `Mech`): join on one, approve/revoke from another, restart, prove automatic reconnect and prove a revoked identity cannot silently re-enter. This reviewer has one host. What was actually established here is the code, the identity seam, the mechanism, the negative paths and the secret sweep; the two-machine topology is **deferred to the phase integration**, exactly as the development record and this host's claim stated before the review began. `deferred != passed`.

## 4. What was independently exercised

| Check | Result |
|---|---|
| The author's own `tests/join503-enrollment.test.mjs` (9 cases, real gateway) re-run on the reviewed head | PASS |
| `tests/pairing.test.mjs`, `tests/web-v02.test.mjs` (no regression from the JOIN-503 delta) | PASS |
| D-1/D-2 guard, unrepaired head | **FAILS** (as it must) |
| D-1/D-2 guard, repaired | PASS |
| Revocation bites on the next request (HTTP *and* the WebSocket handshake share `auth()`) | PASS |
| Durable secret never readable from the City, nor stored in the browser | PASS — only the credential *fingerprint* is in the record; the browser stores `city-session` / `city-session-id` |
| No literal credential in the delta's tracked files (the matches are the minting prefix in a comment, the test fixture token, and unrelated `TARGET_*` identifiers) | PASS |
| `.runtime/` (the device file's home) is git-ignored | PASS |

**Test-environment note:** running the whole suite inside a bare secondary worktree gives 2 unrelated failures (`city-roads`, `web-terminal-shell`, `ENGINE_UNAVAILABLE`) — the City tree's separately installed third-party parsers, which pass in a full checkout and which hosted CI installs as its own step. They are not a property of this change; the hosted run above is green on this exact head.

## 5. Why the verdict is not PASS yet

`review_complete` stays false and `DEVICE_ENROLLMENT_RECONNECT_ACCEPTED` is **not** recorded, because the repair has to reach the branch that will actually merge and carry its own exact-head CI. A behavioural change that exists only on a review branch has not been accepted into the development line, and a verdict of PASS names the artifact that will be integrated. The repair is delivered, minimal and proven; what remains is the ordinary Review → Repair → re-check handoff.

## 6. Handoff back to the development host

```text
FINDING_ID              D-1 (with D-2 as the same root cause on the read route)
SEVERITY                privilege escalation across installations (a session credential could revoke another installation)
OBSERVED_HEAD           ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7
OBSERVATION             POST /device/installations/:id/revoke and GET /device/installations were reachable with a
                        `sess:` credential, so an enrolled installation could revoke any other (including the
                        owner's client) and read the whole enrollment roster
REPRODUCTION            tests/join503-review-privilege.test.mjs on the unrepaired head: roster scope undefined,
                        cross-installation revoke returned 200
EXPECTED_CONTRACT       workbook section 2/3: a session belongs to ONE installation; the City's roster and the
                        authority to revoke another installation belong to the owner's control credential
MINIMUM_REPAIR_BOUNDARY services/dev-gateway/server.mjs only: scope the roster to the caller's own installation for
                        a session, and refuse a cross-installation revoke with a typed code
EVIDENCE                review/JOIN-503-mech-formal-review @ a3b9ab3 (repair + guard), guard FAILS unrepaired /
                        PASSES repaired, author 13/13 still pass
REVIEWER                Mech
```

The repair is a two-hunk change in one file and can be cherry-picked or re-applied by hand; re-applying it in your own words is welcome, and a new head with its own hosted CI is what closes this review.
