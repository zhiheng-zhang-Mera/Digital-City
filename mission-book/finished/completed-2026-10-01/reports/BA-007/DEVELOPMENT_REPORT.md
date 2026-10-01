# BA-007 Development Report — Assistant Settings + Interaction Surface

```text
MISSION                  = BA-007 (Butler Assistant programme, task 7 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 12825bd (Digital-City main, "claim(BA-007): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T17:50:10Z
CONTROL_REVISION_AT_CLAIM= 4073858 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-007-settings-interaction-surface
IMPLEMENTATION_HEAD_SHA  = 8fa4686bb7acb2b57a34a00fe517f6ecaad9769f (pushed)
BRANCH_CI                = 36752540378 — BLOCKED: the jobs never started
LOCAL_CHECK_SUMMARY      = 107/107 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = **false** — deliberately NOT claimed (see §0)
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 0. Blocker (third consecutive round with the same external condition)

Run `36752540378` — both jobs refused to start:

```text
X The job was not started because recent account payments have failed or your spending limit needs to be
  increased. Please check the 'Billing & plans' section in your settings
gateway-web: .github#1 … android: .github#1
```

Same signature as BA-009 (`36750981300`, retried three times) and EM-012 (`36751919772`, retried): jobs end in
2–4 s with zero steps. Alien's GAI-004 pushes failed identically while my pre-block runs (EM-011, RF-010)
succeeded. The implementation is pushed and locally verified; the missing proof is a CI run that starts.

## 1. Deliverable

`contracts/assistant-settings-surface-v1/` — `settings-surface.mjs` (assistant list/select, committed profile
updates, embodiment registry, foreground switching, explicit handoff request, the surface view with five
distinct identity roles, staleness indicators, reserved adapters), `index.mjs`, 6-test suite, root
`tests/assistant-settings-surface.test.mjs`.

Acceptance mapping (all verified locally):

| Required acceptance | Test |
|---|---|
| Profile changes propagate to other embodiments through committed shared state, not direct synchronization of local UI/scratch context | `profile changes propagate as committed shared state and never touch Digital-Me or tasks` (`propagates_via: COMMITTED_SHARED_STATE`, `local_scratch_synchronized: false`, `committedUpdates()` read back) |
| Changing mode/personality/voice/avatar reference does not restart, duplicate or transfer tasks | Same test plus `reserved voice/avatar adapters…` (`restarts_tasks: false`, `duplicates_tasks: false`, `transfers_tasks: false` on every edit) |
| Foreground assistant switching obeys BA-003 and produces no TaskHandoff unless explicitly requested | `foreground switching is a UI operation that transfers nothing` (`produces_task_handoff: false`, `handoff_must_be_requested_separately: true`; the separate request routes to `BA_004_HANDOFF`) |
| UI clearly distinguishes assistant identity, user/Digital-Me identity, foreground binding, logical task owner and executor | Test 1 (`IDENTITY_KINDS`) and test 3 (`surfaceView` fields: `assistant_identity`, `user_identity`, `foreground_binding`, per-task `logical_owner_ref` vs `executor_ref`) |
| Reconnect/stale indicators prevent cached task/binding state being mistaken for current authority | `stale, offline and reconnecting embodiments are surfaced and never shown as authority` (`cache_is_authoritative: false`, `stale_indicator`, `STALE_CACHE_IS_NOT_AUTHORITY` from `assertFresh`) |
| List/select assistants and edit supported AssistantProfile fields through the versioned profile contract | Test 1 (`listAssistants`) and test 2 (`editProfile` with `expected_profile_version`) |
| Switch modes as assistant/relationship policy, not Digital-Me mutation | Test 2 (`user_*`/`digital_me` fields refused as `DIGITAL_ME_IS_READ_ONLY`; mode change edits nothing canonical) |
| Show where the same logical assistant has other embodiments | Test 1 (`embodimentsOf`: two devices, `one_logical_assistant: true`, `independent_minds: false`) |
| Show background tasks separately, with owner/executor, and never hide them | Test 3 (`background_tasks` non-empty with owner+executor; `background_tasks_hidden: false`) |
| Reserve adapters for future voice/avatar editors without requiring them now | `reserved voice/avatar adapters exist as adapters without being required now` (`required_now: false`, refused while disabled) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004…BA-006, BA-008, EM-004…EM-011, GAI-003…008, RF-004…010 Corrections; GAI-004 and RF-006 in progress).
Tie-break after EM-012 excluded Engineering, so BA-007 was chosen: it is the last Butler surface task and the
one that must make foreground binding, ownership and execution *visible* to a user. **This is again the
contract's no-idle rule**: BA-009 and EM-012 remain CI-blocked, so the host continues with another eligible
stage in a separate worktree rather than idling.

**D2 — How do profile changes propagate?** CHOICE: `editProfile` emits a versioned committed update
(`propagates_via: COMMITTED_SHARED_STATE`, `local_scratch_synchronized: false`) that other embodiments read
back through `committedUpdates({ since_profile_version })`, and a stale `expected_profile_version` is refused.
Reason: the acceptance bullet explicitly contrasts committed shared state with "direct synchronization of local
UI/scratch context"; making the propagation path a named field, plus a read-back API, is what lets a reviewer
verify it rather than trust it. Optimistic versioning matches the pool's conflict discipline (BA-006, EM-010).

**D3 — Digital-Me boundaries.** CHOICE: fields that look canonical (`user_*`, `digital_me`,
`canonical_user`) are refused with `DIGITAL_ME_IS_READ_ONLY` naming the canonical source, and the surface view
marks user identity `editable_from_settings: false`. Reason: "editing Digital-Me canonical user records from
assistant settings" is the first out-of-scope item; refusing by field *shape* (not just by an allow-list
message) means a caller cannot smuggle a canonical write through a plausible-looking key.

**D4 — Foreground switch vs handoff.** CHOICE: `switchForeground` returns an explicit denial of transfer
(`produces_task_handoff: false`, `ownership_unchanged`, `executor_unchanged`, `background_tasks_continue`), and
`requestHandoff` is a separate, explicit operation that reports `foreground_switch_implies_handoff: false`,
`requires_recipient_acceptance: true`, `transfers_no_authority: true`, `applied_by: 'BA_004_HANDOFF'`. Reason:
"presenting foreground switch as automatic task transfer" is out of scope and the acceptance bullet requires
no handoff unless explicitly requested; the two operations are separate so the UI cannot conflate them, and the
handoff itself is delegated to BA-004 rather than re-implemented here.

**D5 — Background tasks.** CHOICE: the view separates `background_tasks` from `foreground_tasks`, lists each
background task's `logical_owner_ref` and `executor_ref` separately, and always reports
`background_tasks_hidden: false`. Reason: "hiding an active background task merely because its owner is not
foreground" is out of scope; the test switches the foreground away from the task's owner and asserts the task
is still listed with its owner.

**D6 — Staleness.** CHOICE: `CURRENT/FRESH/STALE/OFFLINE/RECONNECTING/UNKNOWN` are distinct; a non-fresh
embodiment produces a `stale_indicator` whose message says the shown state is a cache, the view always reports
`cache_is_authoritative: false`, and `assertFresh` refuses with `STALE_CACHE_IS_NOT_AUTHORITY`. Reason: the
acceptance bullet requires reconnect/stale indicators to prevent mistaking cached state for current authority;
`RECONNECTING` is deliberately counted as not-fresh, because "reconnecting" means the view is not yet
re-established.

**D7 — Reserved adapters.** CHOICE: `VOICE_EDITOR`/`AVATAR_EDITOR` exist as reserved adapters with
`required_now: false`, editing `voice_ref`/`avatar_ref` is refused (`RESERVED_ADAPTER_UNAVAILABLE`) unless
policy enables them, and the profile is left untouched on refusal. Reason: "requiring future voice/avatar
capability for current acceptance" is out of scope, and a reserved adapter must be an adapter — not a field a
caller can set today with no engine behind it.

**D8 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/assistant-settings-surface-v1/settings-surface.mjs` | new — assistants, profile updates, embodiments, foreground/handoff, surface view, staleness, reserved adapters |
| `contracts/assistant-settings-surface-v1/index.mjs` | new — public surface |
| `contracts/assistant-settings-surface-v1/tests/conformance.test.mjs` | new — 6 conformance tests |
| `tests/assistant-settings-surface.test.mjs` | new — root runner entry (101 → 107 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 4. Test summary, failures and fixes

6 tests. One failure on first run, and it was a **test error, not a module defect**: a final assertion was
written as a tautology around an in-place `push` on a frozen array, so the helper saw a `TypeError` instead of
a domain error. Replaced with a direct frozen-snapshot assertion. No module change was required — stated
plainly rather than dressed up as a fix.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 107 tests, 107 pass, 0 fail (101 baseline + 6 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36752540378 on 8fa4686bb7acb2b57a34a00fe517f6ecaad9769f | **BLOCKED** — jobs not started (account billing) |

## 6. Integration seams handed to sibling tasks

- **BA-003 (embodiment binding):** `switchForeground` is the surface half of that binding; BA-003 owns the
  durable binding, and this module must not become a second source of truth for it.
- **BA-004 (handoff):** `requestHandoff` explicitly delegates (`applied_by: BA_004_HANDOFF`) and transfers no
  authority; the surface must never present a foreground switch as one.
- **BA-005 (Digital-Me gateway):** canonical user identity is read-only here, sourced from the gateway.
- **BA-006 / BA-008 (task graph, embodiment bus):** `logical_owner_ref`/`executor_ref` in the surface view are
  projections of those modules; the surface holds no task truth.
- **BA-009 (duty policy):** proactivity is an editable profile field here and the *policy* there; the surface
  must display the effective level rather than letting a profile write widen it.
- **Owner/ops actions (blocking):** GitHub Actions billing must be restored before BA-007, BA-009 or EM-012 can
  reach a verified `development_complete`.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: `editProfile` fields that collide with canonical names under a different
   spelling (`userName`, `me`); a handoff request whose `device_ref` is `OFFLINE` (currently allowed — a likely
   gap, since a stale device should probably not originate a handoff); `committedUpdates({ since_profile_version })`
   across a mode change only; two embodiments registered for the same device (the second overwrites — confirm);
   and `assertFresh` on `UNKNOWN` (refused, matching the intent).
2. Confirm D4 (a separate explicit handoff request is the only path) and D6 (`RECONNECTING` counts as stale).
3. Correction cannot be claimed against this branch until CI can run: `development_complete` is false.

```text
DEVELOPMENT_COMPLETE = false (CI blocked by the account-billing condition; not a code failure)
CORRECTION_ELIGIBLE  = false until CI is green
MERGE_STATUS         = FORBIDDEN_UNTIL_PROJECT_MERGE
```
