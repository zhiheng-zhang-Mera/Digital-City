# JOIN-501 — Formal review report

> **Workbook:** [JOIN-501-pairing-session-lifecycle-and-display.md](../../finished/completed-2026-10-04/connection-onboarding-components/JOIN-501-pairing-session-lifecycle-and-display.md)
> **Reviewed head:** `e925ae1ef4dda6f51d89a1faa025d1b8666d8c58` on `join/JOIN-501-pairing-session-lifecycle`  
> **Baseline:** Utopia `main` `13109b4c206feb3c1a9107b369715e84af65eaf1`  
> **Development host:** Alien — **review host: Mech** (different physical host, per `CONSTRUCTION_RULES.md` §3)  
> **Hosted CI on the reviewed head:** run `37116491572` COMPLETED SUCCESS, branch `join/JOIN-501-pairing-session-lifecycle`, event `push`, head_sha `e925ae1…`, jobs `gateway-web` (15 steps) and `android` (12 steps) both `completed/success`  
> **Reviewer instruments:** `review/JOIN-501-mech-formal-review` @ `4917a51`, `tests/join501-review-falsification.test.mjs`  
> **Verdict:** **PASS** — no required repair. `review_complete: true`.

## 1. What was reviewed, and how the claims were checked

The workbook's requirement shape is unusual and made the method easy to choose: it states **twelve numbered automatic tests** and a set of product semantics about what the Owner sees. So the review did three things, in this order:

1. **Exact-head alignment.** The workbook's `development_head_sha` (`e925ae1…`) was compared with `git ls-remote` of the branch — identical — and hosted CI was re-queried **by head_sha** rather than trusted from `development_ci`. The run is on that exact sha, on that branch, from a push.
2. **Ran the author's instruments rather than reading them.** All 23 relevant tests pass at the reviewed head (`pairing-lifecycle` 257 lines/16 cases, `pairing-session-lifecycle-web` 4 browser cases, plus `pairing.test.mjs` and the reworked `web-v02.test.mjs`).
3. **Built independent falsification instruments** (section 4) that attack the rule at four points the author's suite does not cover, instrumented at two layers at once: **what the page sent** (network-level count of `POST /api/v0/pairing/session`) and **what the City holds** (canonical `GET /api/v0/pairing/info`). A pairing rule can be broken in both directions — a dead code shown as live, or a live code lost — so every attack checks both.

## 2. Gate-by-gate verdict against the workbook

| # | Workbook requirement | Verdict | How it was established |
|---|---|---|---|
| 1 | enter Pairing page → creation API calls = 0 | MET | author's instrument, re-run by the reviewer |
| 2 | render / refresh / reconnect → still 0 | MET | author's instrument (synthetic offline/online) **plus** reviewer A2, which closes the live WebSocket and lets the product's own reconnect path run |
| 3 | explicit Generate once → exactly one session | MET | author's instrument counts calls at the network layer; reviewer A3 adds the same-task burst case |
| 4 | ACTIVE + ordinary re-render → same id / code / payload | MET | author's instrument; independently re-observed in reviewer A2 after a transport drop |
| 5 | ACTIVE + SPA navigate away/back → same session | MET | author's instrument, and the reworked `web-v02.test.mjs` now asserts it against the canonical session id |
| 6 | ACTIVE → no Refresh-caused new session | MET | the control is a *disabled status label* (`Code active · expires on its own`), and both suites force-click it and assert **zero** creation calls and an unchanged canonical id |
| 7 | consume → material gone + USED + Generate available | MET | author's instrument (real `pairing/exchange`), and a second case where a **separate process** consumes it; reviewer A1 covers the mirror case where the City's session is replaced by another client |
| 8 | consumed secret reuse rejected | MET | 410 asserted at the server, twice |
| 9 | expire → material gone + EXPIRED + Generate available | MET | author's instrument with a 3 s TTL; reviewer A4 with the tab **hidden** across the expiry |
| 10 | expiry event itself does not call create | MET | creation counter asserted through the expiry path in both |
| 11 | post-expiry second explicit click → one new, different session | MET | asserted against the canonical id, not the DOM |
| 12 | no permanent / bare token in pairing material | MET | the rendered view, the invite payload and the QR are scanned for the control token; the stored record is scanned too |

Workbook §7 additionally asks the reviewer to **try to make the code disappear early or rotate secretly through route/reload/reconnect**. That is exactly what A1–A4 do, and all four **failed to break it** — which is the result the gate wants.

## 3. Findings

**No required repair. No blocking defect.** The following are recorded because a review that only says "pass" cannot be checked.

### F-1 (note, not a defect) — a replaced session is reported as USED

`pairing-lifecycle.clearOnSessionChanged()` decides the terminal reason from the session's own expiry: not yet expired ⇒ `USED`. That is correct for **consumption**, which is the case the workbook names, but when *another control client of the same City* rotates the session, the first page also reports "That code was used." The code really is dead and the action really is "generate a new one", so no user is misled about what to do; the word is a shade less precise than "replaced". The City exposes no canonical `consumed`/`replaced` distinction (`Pairing.active()` is a boolean and the descriptor carries only an id), so distinguishing them would need a server contract change — out of the "bounded repair" boundary for a UI lifecycle task. **Recorded as a note for the phase integration.**

### F-2 (note) — `REASON_REVOKED` is defined but no product path produces it

`pairing.revoked` is reachable only through `clear(reason)` with an explicit reason, and the only caller passes an empty reason (`disconnect`). The key is therefore currently unreachable copy. It is not a defect — the i18n coverage check requires the key in both packs, and its existence is how an explicit user-visible deselection would be labelled — but it is dead until something calls it.

### F-3 (note) — two superseded strings remain in both locale packs

`pairing.reconnect` and `pairing.unavailable` are no longer referenced by `app.js` (the reconnect-clears-pairing path they described is precisely what this task removed). They are harmless and are still covered by the locale-parity test.

### F-4 (the reviewer's own instrument was wrong, and that changed the result)

The first run of the hidden-tab attack reported **two product FAILURES**: "a code that expired while hidden is not shown as active" and "the City agrees the session is gone". Both were caused by **my instrument**, not the product: it configured a 10-minute TTL and then "waited out the expiry" for 20 seconds, so the session could never have expired, and the empty display it observed came from an *earlier attack's* consumption. Corrected instrument (TTL taken from the City's own `expiresAt`, assertion naming **EXPIRY** specifically so it cannot pass by observing consumption): all checks pass. This is recorded because a reviewer's measurement error is exactly the class of thing that must not be silently fixed inside a "PASS".

## 4. Reviewer's independent falsification instruments

On `review/JOIN-501-mech-formal-review` @ `4917a51`, file `tests/join501-review-falsification.test.mjs`, run against the reviewed head — **4/4 PASS**:

| ID | Attack | Why the author's suite does not cover it | Result |
|---|---|---|---|
| A1 | A **second client** of the same City creates its own session while the page under test does nothing | The workbook forbids the *owner's page* rotating a live code; nothing had tested the City's session changing **underneath** a page | PASS — superseded material left the page with an explanation, one creation call total |
| A2 | The page's **live WebSocket is closed**, so the product's own `onclose` → `connect()` path runs | The author tests synthetic `offline`/`online` events, not a real transport drop | PASS — no creation, no rotation, same code and same QR after reconnection |
| A3 | **Three Generate clicks dispatched in one task**, before any `await` can resolve | The worst case for a busy-flag guard; a label-only check cannot see the race | PASS — exactly one creation call, one active session, control disabled again |
| A4 | The tab is **hidden across the expiry** and then shown | A throttled/frozen countdown interval is where "the code disappears by itself" would fail | PASS — no code displayed, reason **EXPIRY** (not consumption), no creation, one new session on the next click |

## 5. Test-environment observation, stated rather than hidden

Running the **whole** suite inside a bare secondary worktree at the reviewed head gives **1075 tests / 1073 pass / 2 fail** (`city-roads`, `web-terminal-shell`, both `ENGINE_UNAVAILABLE`). Both failures are the City tree's *separately installed* third-party parsers (`pnpm --dir city install`, which CI runs as its own step and which the bare worktree lacks). They reproduce identically on the untouched baseline and pass in a checkout with those installs, and the hosted run above ran the same suite **green on this exact head**. They are an environment gap in my worktree, not a property of the reviewed change.

## 6. Limits of this review

- The reviewer is a different **physical host** from development, which is what §3 requires; the browser ran on **this** host against gateways on loopback. Real two-machine network conditions are the phase integration's business, not this task's UI lifecycle.
- The Android surface was not exercised for this task: the workbook's §7 acceptance is about the owner web page and a second endpoint consuming the code, both of which were exercised, including by a **separate process** as the second endpoint.
- The verdict is on `e925ae1` and only on `e925ae1`. A later commit needs its own CI and would need this review re-applied, not inherited.

语言配对 / Language pair: [原文 / Source](./REVIEW_REPORT.md) · [译本 / Translation](./zh-CN/REVIEW_REPORT.md)
