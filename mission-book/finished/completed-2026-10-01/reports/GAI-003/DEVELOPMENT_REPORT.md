# GAI-003 Development Report — Web Channel + Persistent Profile Sessions

```text
MISSION                  = GAI-003 (General AI Gateway programme, task 3 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 7618df0 (Digital-City main, "claim(GAI-003): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T14:27:58Z
CONTROL_REVISION_AT_CLAIM= 90e7569 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-003-web-channel-persistent-session
IMPLEMENTATION_HEAD_SHA  = e55da499193b644280fd34eee63749d9c9e9c8a4
BRANCH_CI                = 36729727681 — success
LOCAL_CHECK_SUMMARY      = 109/109 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
REAL_PROVIDER_ACCEPTANCE = REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION (no provider configured on this host)
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/general-ai-web-channel-v1/` — `web-channel.mjs` (adapter port + deterministic double, channel
state vocabulary, session open/observe/cancel/close/persist/restore, persisted-state guard,
real-provider acceptance marker), `index.mjs`, 8-test suite, root `tests/general-ai-web-channel.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| the default execution channel is WEB | `Web is the default execution channel and execution is bound to a profile handle` (`DEFAULT_CHANNEL = 'WEB'`, execution reports `channel: 'WEB'`) |
| persistent login/profile survives an allowed restart/reopen where the platform permits | `a persistent login survives an allowed restart when the profile handle still resolves` (conversation refs reopen; an unresolvable handle answers `AUTH_REQUIRED`, never a silent fresh login) |
| typed channel states, honestly reported | `a channel state that cannot execute is a typed refusal` (six distinct codes; a state change is seen on the next touch, so a stale READY cannot be reused) |
| execution bound to profile references rather than ephemeral windows | same test as row 1 plus `raw cookies, storage and tokens never enter persisted City state` |
| partial output never reported as final | `partial output is never reported as the final result` (`final: null` while running, `partial_is_final: false`) |
| conversation/thread capture and reopen hooks | row 2 (`conversation_refs` persisted and restored) plus `conversations()` |
| real provider exercised or the deferral recorded | `real-provider acceptance is recorded, never fabricated` |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** The previous round ended without a claim, so this round re-scanned: no
owned repair and no eligible Correction for Mech (the only Alien-developed task left, RF-003, is Mech's own
Development being corrected by Alien). Under the development tier I chose GAI-003: a different programme
from my previous claim (BA-005), and General AI Gateway is the least-advanced pool (2 of 9) with the other
host unoccupied in it.

**D2 — Where session identity lives.** OPTIONS: (a) an ephemeral browser window per execution; (b) a window
handle kept in memory; (c) a persistent profile *handle* resolved through the neutral
`SecureHandleStorePort`. CHOICE: (c). Reason: the workbook explicitly forbids binding to ephemeral windows
and requires resolving persistent handles through the neutral store; `open` therefore resolves the handle
and records the reference, never the value.

**D3 — What may be persisted.** CHOICE: only `provider_ref`, `account_ref`, `profile_handle_ref`,
`conversation_refs`, `state` and `opened_at`, with a recursive guard refusing `cookies`, `storage_state`,
`local_storage`, `tokens`, `password`, `credentials` and `profile_bytes` on both persist and restore
(`RAW_COOKIE_IN_CITY_STATE`). Reason: "without copying raw cookies into City state" — and the guard runs on
the *restore* path too, so a hand-crafted or hostile persisted record cannot smuggle browser state in.

**D4 — Honest channel state.** CHOICE: seven states (`READY`, `AUTH_REQUIRED`, `RATE_LIMITED`,
`PAGE_CHANGED`, `BUSY_GENERATING`, `DOWN`, `UNKNOWN`) map to six distinct refusal codes before an execution
starts, and the state is re-read from the adapter on every touch. Reason: the workbook names these states;
re-reading on touch is what stops a stale `READY` from being reused after the provider logged out.
`PAGE_CHANGED` is deliberately a refusal rather than a retry: a changed provider page means the adapter
needs updating, and silently retrying would hide a broken adapter.

**D5 — Partial versus final.** CHOICE: `observe` returns `partials` with `final: null` while the execution
is running, `final` only after `complete`, and an explicit `partial_is_final: false`. Reason: the same
false-success discipline as BA-002/EM-003 — a partial answer presented as final is the single most damaging
failure mode for a chat surface.

**D6 — Restart semantics.** CHOICE: `restore` re-resolves the profile handle; success reopens the
conversation refs and reports the adapter's current state, while an unresolvable handle returns
`restored: false, state: 'AUTH_REQUIRED', reason: 'PROFILE_HANDLE_UNRESOLVED'`. Reason: "survives an allowed
restart **where the provider/platform permits it**" — when the platform does not permit it, the honest
answer is that the user must authenticate, not a silent new session.

**D7 — Provider-specific knowledge.** CHOICE: the module contains no page selectors, no provider names and
no mouse logic; provider knowledge stays below the adapter, and the published port flags state
`reimplements_remote_mouse_logic: false` and `uses_generic_computer_use_primitives: true`. Reason: the
workbook requires reusing accepted generic browser/DOM primitives through interfaces.

**D8 — Real-provider proof.** CHOICE: `realProviderAcceptanceStatus` returns `PERFORMED` only with an
explicit evidence reference, and otherwise records
`REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION` with `fabricated: false`. This run has no
provider configured on the host, so **no real provider was exercised** and the deferral is recorded here
and in the frontmatter. Reason: the workbook permits component completion from contract and deterministic
tests while reserving real-provider proof for programme integration — and forbids presenting it as done.

**D9 — No `schema.json`.** Consistent with the other component branches.

## 3. Test summary

8 tests, all passing: default channel and handle-bound execution; six typed state refusals plus the
stale-READY re-read; partial-versus-final with thread capture and the already-finished refusal;
idempotent cancel with unknown-execution and unknown-session refusals and the invalid-request guard;
restart restore with conversation reopening; unresolvable-profile restore reporting `AUTH_REQUIRED`;
the persisted-state guard on both persist and restore with constructor refusals; and real-provider
deferral honesty.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 109 tests, 109 pass, 0 fail (101 baseline + 8 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36729727681 on e55da499193b644280fd34eee63749d9c9e9c8a4 | success |

## 5. Integration seams handed to sibling tasks

- GAI-001 (core contracts): bind the session/result shapes to `GeneralAIRequest`/`ResultEnvelope`/
  `PartialResult` at merge; the channel state vocabulary maps onto the contract's provider health.
- GAI-002 (registry): the profile/credential handles resolved here are the ones the registry persists; both
  use the neutral store and neither stores values.
- GAI-004 (API channel + consent): the Web channel is the *default*; API escalation must remain an explicit
  user decision (GAI-001's routing policy), and this module deliberately never falls back to API.
- GAI-005 (triage/routing): `health()` is the readiness input for the Web decision.
- GAI-006 (stream/cancel): `observe`/`cancel` are the stream and cancel hooks; a real streaming
  implementation should feed the same partial/final discipline.
- GAU/EM programmes: this is a *channel*, not a transport — cross-device execution remains Remote Fabric's.
- Programme integration: real-provider acceptance (`REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION`)
  must be performed before `GENERAL_AI_GATEWAY_MERGED_MAIN_CI_GREEN`.

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to make a partial read as final, to reuse a stale `READY`, to smuggle
   browser state past the persisted-state guard, and to restore a session the platform no longer permits.
2. Confirm D6 (`AUTH_REQUIRED` on an unresolvable handle) as the intended restart behaviour.
3. Confirm whether `PAGE_CHANGED` should ever auto-recover (this module treats it as an adapter defect).
4. The evolution-feed question remains open for the Owner.

```text
DEVELOPMENT_COMPLETE     = true
REAL_PROVIDER_ACCEPTANCE = DEFERRED_TO_PROGRAMME_INTEGRATION (no provider on this host; not fabricated)
CORRECTION_ELIGIBLE      = true (must be performed by Alien, not Mech)
MERGE_STATUS             = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
