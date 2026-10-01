# UPT-PRE-ASSISTANT — Verification Report

> Workbook: `ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md` §8 (T4)
> Binding rulings: `response-9-30.md#R12` (phase) and `#R13` (single-host waiver)
> Verifier: an independent agent session that wrote no part of the implementation
> Implementation host: `Alien` (`MERA-ALIANWARE`)

## 0. Independent-host limitation — stated plainly

The workbook prefers two real hosts and says that with only one available the branch must stay
unmerged and the limitation must be reported honestly, unless the Owner waives it. Only this
machine was available, so the Owner recorded an explicit waiver, `response-9-30.md#R13`.

**This is a single-host acceptance.** The verifier ran on the same physical host as the
implementation — same machine, same `provenance.host`, same gateway process. Only the Android
device is genuinely separate hardware over the LAN, so the device half of the acceptance is real
multi-machine and the host half is not. Two independent agent sessions ran here: the *agent* is
independent, the *host* is not. Nothing below is presented as two-host verification.

What the waiver does **not** relax: the verifier wrote and ran its own probes before reading any
implementation artefact; the verdict may be, and was, REJECT; a REJECT must be repaired in full and
re-verified at the new SHA; branch and merged-main CI must be green.

## 1. Round 1 — `adce593` — verdict: REJECT for merge

The verifier's own findings file is `.runtime/evidence/mission-book/UPT-PRE-ASSISTANT/T4-FINDINGS.md`
and its probes and transcripts are under `.../UPT-PRE-ASSISTANT/verifier/`.

### Passed on real execution

- **Startup.** One supported start brought up Gateway, Agent and Room Hub. A second start was a
  restart, not a copy: exactly one of each survived, proven by raw process inspection rather than
  by the launcher's own report. Gateway on `172.31.3.110:4310`, hub on `127.0.0.1:4320` only.
- **Rooms.** Web Home listed the ten Rooms; a Room opened and was really used (the Knowledge
  Room's own API answered 200 inside the embedded frame). With the hub killed, the product flipped
  to `UNAVAILABLE` with the real reason, on both Web and Android. The hub's DTO field is absent
  from the Android model, absent from the installed APK's dex, and no device request ever
  addressed the hub port.
- **Action facade.** ROOM action → real room record id; CAPABILITY action → real bridge
  `invocationId` and digest, present in the invocation history; CITY_TASK action reconciled
  `QUEUED → RUNNING → SUCCEEDED` with the real task and real result; refusals stayed `REFUSED`;
  `route BOSS → 400`.
- **Ask / Do.** All eight behaviours verified through the API and a real browser: document intake,
  knowledge query (ambiguous by design → two candidates → selection), checklist, bookmark, hash,
  evidence review, side-effect confirmation gate, and unmatched → 16-target manual picker. Router
  provenance always `DETERMINISTIC_RULES / deterministic: true / llm: false`.
- **Scope audit.** Ten Rooms exactly, no persona layer, no model call anywhere in the routing
  path, no BOSS/HNS route reachable, no new Room, no arbitrary shell, no new domain integration.
  The only dependency added in the whole branch is a test-scope `org.json`.

### Blocking finding

**F.1 — the Android Action list was permanently unreadable against a correct gateway response.**
The verifier captured the app's own traffic through a logging relay: `GET /api/v0/actions?limit=50`
returned HTTP 200 with a valid `{apiVersion, schemaVersion, actions:[…]}` body. On the device the
Action screen showed "The gateway returned an unreadable Action list", reproduced three times
including after `pm clear`. Bytecode inspection showed the client unwrapping the envelope with an
object reader and then reading a second, nested `actions` member that cannot exist. The same
mistake was in the manual target picker. The branch's Android unit tests passed because they called
`parseActions(rows)` directly and never exercised the envelope read.

Consequence: `WEB_ANDROID_ACTION_PARITY` could not be marked green, so T4 could not accept T2.

### Other findings

| # | finding | disposition |
| --- | --- | --- |
| F.2 | `/api/v0/health` returned a constant `healthy`; a supervisor could not see a dead Room Hub | repaired |
| F.3 | neither shipped client sent an idempotency key, so a retry executed twice | repaired |
| F.4 | a reused key with a different request silently returned the original Action | repaired |
| F.5 | `provenance.cityTaskState` stayed `QUEUED` after the task completed | repaired |
| F.6 | Web is handed the loopback `hubUrl` (Android provably is not); the hub UI has no auth | recorded as a design boundary, not repaired |

Gaps the verifier could not close on this host: the City-task-with-no-eligible-node `UNAVAILABLE`
path (a node was always eligible), the Android manual picker and Action detail (blocked by F.1),
and hosted CI on the branch at that time.

## 2. Round 2 — `85ecde4` — verdict: ACCEPT for merge

The same independent verifier re-ran every repair adversarially, on the rebuilt and reinstalled
APK, rather than confirming it. Its round-2 section is in `T4-FINDINGS.md`; round 1 is kept
verbatim beside it.

### F.1 — fixed, and the device is the authority

After `gradlew :app:assembleDebug` and `adb install -r` at this SHA, force-stop → launch → Action
rendered real records (`ACTIONS (35)`, status, intent, route, progress, summary, `actionId`) with
no "unreadable" string. Parity was re-proved with **fresh** content rather than a pre-existing row:
an Action created only through the API (`A-dcfc48fd-f7e6-49e1-b322-53d3e47b7487`, ROOM/hash,
SUCCEEDED) appeared on the device after Refresh, with the same digest. The manual target picker
was fixed too: `NO RULE MATCHED` → `Show all targets` → a real `MANUAL TARGETS` list. Source check:
`payload(...).optJSONArray(...)` now appears zero times in the panel and DTO files.

### F.2 — fixed

With only the hub process killed: `HTTP 200 {"status":"degraded", …"rooms":{"state":"UNAVAILABLE",
"reason":"room hub is not reachable on loopback (ECONNREFUSED)","hubUrl":null}}`. Restart →
`healthy`. The verifier also falsified a side effect it was right to suspect — ten consecutive
unauthenticated polls took 1–3 ms each, so health did not become a probe amplifier.

### F.3 / F.4 — fixed

The exact sequence the repair was meant to produce: first ask executes; an identical retry returns
the same `actionId` with a zero action-count delta; the same key on a different ask is refused with
`IDEMPOTENCY_KEY_REUSED` and executes nothing; the same text with a new key executes as a genuinely
new action. Reordering the JSON keys of the same input still replays, so the fingerprint is
canonical rather than textual. Web was proved end to end **with a lost response** — the first
`POST /api/v0/ask` was aborted in the browser and the retry went out with the same key, moving the
action count by one, not two. Android keys were captured on the wire through the verifier's relay.

### F.5 — fixed

`cityTaskState` tracked `QUEUED → RUNNING → COMPLETED` in step with the real task and stayed
correct on re-read.

### Scope re-audit — clean

Ten files touched, none under `apps/rooms` or `city`, no dependency change, and zero added-line
hits for persona/assistant/model/SDK/shell/BOSS/HNS patterns. Live: ten Rooms, routes exactly
`ROOM | CAPABILITY | CITY_TASK`, and `BOSS`/`HNS`/`SHELL`/`LLM` all `400 INVALID_ROUTE`.

### Gates at `85ecde4`

| Gate | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | 101/101 pass |
| `node city/test-all.mjs` | 1807 pass / 1 skipped / 0 fail |
| `node scripts/verify-promotion-history.mjs` | 10/10 OK |
| `node scripts/check-bilingual.mjs` | all SYNCHRONIZED |
| `gradlew :app:testDebugUnitTest --rerun-tasks` | BUILD SUCCESSFUL, 50 tests / 0 failures |
| hosted branch CI (`36691043142`) | android + gateway-web both success |

## 3. Non-blocking findings carried forward

The verifier accepted the branch with these recorded, and they are **not** claimed as fixed:

1. **R2.1a — Android Action drill-down does not open.** The row is exposed as `clickable="true"`
   but a centre tap, `input motionevent DOWN/UP` and post-swipe taps all leave the screen
   unchanged, so the `ActionRecord()` detail view is unreachable on the device. The data and the
   parity are correct; opening a record is not. Repro: install at this SHA, pair, Action, tap a row.
2. **R2.2a — `start-city.ps1 -NoRooms` reports a misleading reason.** The launcher prints
   `rooms : DISABLED`, but health reports `rooms.state UNAVAILABLE` with "not reachable on
   loopback" instead of the disabled reason. The explicit `CITY_ROOMS_DISABLED=1` path does report
   `ROOMS_DISABLED` correctly, so this is launcher-to-gateway wiring, not a truthfulness failure in
   the product surfaces.
3. **Status-code deviation.** Key reuse is refused with HTTP **400**, not the 409 described in the
   repair note. The error code (`IDEMPOTENCY_KEY_REUSED`) and the behaviour — nothing executes —
   are as specified. The implementation report has been corrected rather than the claim being left
   standing.
4. **F.6 unchanged.** `/api/v0/rooms` and `/api/v0/health` still hand the loopback `hubUrl` to an
   authorized client; Android still never receives or uses it. A browser on another LAN machine
   would be handed its own loopback address. Recorded as a design boundary; an authenticated hub
   proxy is separate work.

One gap the verifier could not close on this host: Android's timeout-retry key reuse is verified by
code inspection only, because a lost response cannot be injected into the device without
instrumentation. Recorded as a gap rather than asserted as tested.

## 4. Merge and CI

```text
branch                              : product/upt-pre-assistant-closeout
branch HEAD (accepted)              : 85ecde437ec930f1b4aa41d8913540e012da5ee7
branch CI                           : 36691043142 - android success, gateway-web success
merge commit                        : 8104f8289a76d15ff0197c953730edcef42cab5e
                                      (parents d0dea7b [main before], 85ecde4 [branch])
merged-main CI                      : 36692675561 - android success, gateway-web success
branch audit after the merge        : 35 origin refs, unmerged = 0
```

The verifier's hosted-CI gap from round 1 is closed here: the branch CI on the accepted SHA and the
merged-main CI on the merge commit are both recorded, with both jobs green in each.

STATUS: VERIFICATION_REPORT
