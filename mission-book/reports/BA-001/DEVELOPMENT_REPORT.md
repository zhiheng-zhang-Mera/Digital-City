# BA-001 Development Report — Butler Zone + Personalization Contracts

```text
MISSION                  = BA-001 (Butler Assistant programme)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 5feb971 (Digital-City main, claim of BA-001 Development by Mech)
CLAIMED_AT               = 2026-09-30T11:58:03Z
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
CONTROL_REPO             = zhiheng-zhang-Mera/Digital-City
CONTROL_REVISION_AT_CLAIM= 5943eec (latest main when the claim was made)
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-001-butler-zone-personalization
IMPLEMENTATION_HEAD_SHA  = 27f5c4e3ca77436c5fdacca229b2916b71180a0c
BRANCH_CI                = 36712388656 — gateway-web success, android success
LOCAL_CHECK_SUMMARY      = 123/123 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

New contract package `contracts/butler-assistant-v1/`:

| File | Purpose |
|---|---|
| `personalization.mjs` | Versioned personalization ports, profile validation, authority scan, forward migration, the "profile grants nothing" authority boundary |
| `zone.mjs` | Assistant identity + profile ownership, presence cache, portable export/import, revision compare-and-set |
| `index.mjs` | Public surface for BA-002/003/005/007 and Web/Android clients |
| `schema.json` | Published JSON Schema (draft 2020-12) for profile, identity and bundle |
| `tests/conformance.test.mjs` | 22-test conformance suite |
| `tests/butler-assistant.test.mjs` (repo root) | Registers the suite with `pnpm test` |

Acceptance mapping:

- AssistantIdentity + AssistantProfile as replaceable assistant-owned durable state → `createAssistantZone`, `createIdentity`, `setProfile`/`patchProfile`.
- Versioned reserved ports for naming/form-of-address, voice, avatar/appearance, personality, duties/role, companion/relationship mode plus extension fields → `PERSONALIZATION_PORTS` + `extensions` namespaces + `migrateProfile`.
- Multiple saved identities and simultaneous online identities → `listIdentities`, `setPresence`, `listOnlineAssistantIds`.
- Import/export/reset semantics that cannot mutate Digital-Me → `exportBundle`/`importBundle`/`resetProfile`/`resetAllProfiles`, bundle-level Digital-Me rejection.
- Profile schema rules forbidding embedded permission grants, execution leases and action authority → recursive authority scan + strict port field sets + always-empty `effectiveGrantsFromProfile`.
- Relationship configuration scoped to the assistant identity → `companion` port on the assistant profile; never a user-model field.

## 2. Decision log (problem → options → choice → reason)

The mission book did not specify these points; each was decided here and is recorded as required.

**D1 — Which task to claim first (41 unclaimed Development tasks).**
Options: (a) any BA task; (b) a contract-level task from another programme; (c) wait for a Correction to become eligible.
Choice: BA-001. Reason: claim priority tier 3 applies (no owned repair existed, no Correction was eligible), and among equivalent unclaimed Development stages BA-001 is the foundational identity/personalization boundary that BA-002/003/005/007 must reference; it is pure contract work with no hardware/provider dependency, so it cannot idle on external seams.

**D2 — In-progress claim vocabulary.**
Problem: the BA/RF/GAI/EM frontmatter defines `development_status` but the repository only demonstrates terminal values (`COMPLETE`, `SKIPPED_COMPLETE`) in archived MB workbooks.
Options: (a) `CLAIMED`; (b) `IN_PROGRESS`; (c) leave `NOT_STARTED` and rely on `development_host`.
Choice: `IN_PROGRESS`. Reason: it is unambiguous about an owned, unfinished stage while `development_host: Mech` carries the ownership; leaving `NOT_STARTED` would let the opposite host believe the stage is free and would break the claim-priority scan. Only target-stage fields were touched in the claim commit, and README/MISSION_INDEX were deliberately not edited (CROSS_PROGRAMME_EXECUTION_CONTRACT §3, PROGRAMME_STATE `ordinary_claim_updates_dashboard_files: false`).

**D3 — Where the contract lives.**
Options: (a) `services/butler-assistant/`; (b) `contracts/butler-assistant-v1/`; (c) inside `apps/`.
Choice: `contracts/butler-assistant-v1/`. Reason: the repository's established cross-module pattern is a versioned directory under `contracts/` with a `schema.json`, and CI's root `tests/*.test.mjs` glob picks up a thin root test entry. No runtime service was invented, because the task is a contract/state-boundary task and a second service would create competing ownership.

**D4 — How to make "profile cannot grant authority" enforceable rather than documented.**
Options: (a) document the rule; (b) only reject authority-shaped key names; (c) reject authority-shaped fields *and* provide the single permission-resolution entry point that always returns no grants.
Choice: (c). Reason: a rule that is only documented decays; name rejection alone still allows a future caller to read `duties.labels` and grant an action. `effectiveGrantsFromProfile()` is the only defined way to ask a profile what it authorizes and it always answers "nothing", while `findAuthorityPaths` rejects a profile that even names a grant/lease/capability/token/policy field at any depth, including inside extension namespaces and inside `effect: allow|grant|permit` statements.

**D5 — Per-port inline version keys (`voice_version`, …).**
Options: (a) keep them; (b) remove them.
Choice: (b) removed during self-review. Reason: nothing consumed them — port versioning is already carried by the port registry (`version`, `sinceVersion`), the profile's `schema_version` and `migrateProfile`. Validation without a consumer is dead surface and would have diverged from `schema.json`. This is recorded because it was a first-attempt design that the development host itself rejected before push.

**D6 — Partial ports: reject or normalize?**
Options: (a) require fully written ports; (b) fill missing port fields with safe defaults.
Choice: (b) via `normalizeProfile`/`createDefaultProfile`. Reason: settings surfaces (BA-007) and clients write single fields; requiring complete port objects makes every write brittle, while defaults keep the stored state total and strictly validated afterwards. Strictness is preserved: undeclared fields inside a port are still rejected.

**D7 — Where assistant↔user relationship state lives.**
Options: (a) a user/identity record; (b) a field on the assistant profile.
Choice: (b) `companion` port. Reason: invariant 18 — assistant persona/relationship state must never be written into Digital-Me as canonical user identity data. The Zone exposes no Digital-Me parameter at all, and import rejects Digital-Me/user-canonical namespaces, so isolation is structural rather than a convention.

**D8 — Presence semantics.**
Options: (a) implement foreground binding here; (b) implement a session presence cache only.
Choice: (b). Reason: invariant 8 / BA-003 owns foreground binding. Implementing it here would duplicate a sibling contract and force conflict resolution at integration. Presence is therefore explicitly a session cache: not durable, not exported, and it elects nothing.

**D9 — Concurrency and recovery evidence for a single-writer in-memory contract.**
Options: (a) claim async race coverage that the API cannot express; (b) implement a real lost-update guard and test atomicity/recovery.
Choice: (b). Reason: the Zone is synchronous, so honest evidence is (i) a monotonic `revision` with optional `expectedRevision` compare-and-set that refuses a stale writer, (ii) all-or-nothing writes (a rejected write leaves state byte-identical), (iii) export → import into a fresh Zone reproducing durable state after a simulated restart. This is recorded instead of pretending multi-writer races were tested.

**D10 — Timestamps.**
Options: (a) read the system clock inside the contract; (b) caller-supplied timestamps validated as text.
Choice: (b), with an injectable `clock` for hosts. Reason: matches the repository's clock-free contract style and makes tests/exports deterministic; `checkTimestamp` prevents a `Date` object from leaking into durable state or a bundle.

**D11 — PROCESS_DATA_POLICY evolution inbox (`data-records/evolution/inbox/mission-book/<ID>/events.jsonl`).**
Problem: that policy is written for MB migration/verification missions and the event vocabulary must not be extended by the construction model; no BA-task instruction references it.
Choice: not used; this report is the BA construction record. Reason: inventing BA event types is explicitly forbidden, and the BA/RF/GAI/EM workbooks direct reports to `mission-book/reports/<TASK-ID>/`. Recorded as an open Owner question (see §6) rather than silently ignored.

**D12 — Bilingual documentation.**
Choice: no new `docs/`, `evidence/` or `data-records/` entries. Reason: `pnpm check:docs` asserts zh-CN/en pairing and fact parity for those trees; adding contract documentation there is a separate deliverable and would risk an unrelated CI failure. The contract is self-describing in code and schema.

## 3. Test summary

`contracts/butler-assistant-v1/tests/conformance.test.mjs` — 22 tests, all passing:

profile normalization and safe defaults; partial-port defaulting; two identities with independent profiles and relationship modes; bundle isolation between assistants; presence for several identities with idempotent registration and non-export; duplicate-id refusal with unchanged state; minted-id honesty; authority rejection table (permissions, executionLease, authority, capabilities, actionKey, accessToken, `effect: allow`); extension-namespace rejection (Digital-Me and authority namespaces, nested authority, bad version, bad syntax); schema/port shape validation; forward migration adding a future port while preserving unknown extension data; rejected-write no-op and immutable `schema_version`; stale-write refusal via revision CAS; export/import restart recovery; replace-import isolation and revision bump; atomic rejection of Digital-Me/authority/malformed bundles; per-assistant reset and `resetAllProfiles`; duty labels descriptive only; Digital-Me sentinel untouched across the full lifecycle; typed lifecycle errors and presence cleanup; patch merge semantics; published schema ↔ runtime consistency.

Negative-path coverage is deliberate: every rejection assertion also asserts that state did not change.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 123 tests, 123 pass, 0 fail (101 baseline + 22 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified against local Git history at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail (7 skipped as in baseline) |
| `corepack pnpm check:docs` | docs/evidence/data-records PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36712388656 on 27f5c4e3ca77436c5fdacca229b2916b71180a0c | gateway-web success, android success |

Environment note recorded for other hosts: `pnpm` is not on PATH on Mech (Java is 26, Android SDK 36 present); `corepack pnpm` resolves 11.19.0 and satisfies every pnpm step in CI.

## 5. Integration seams handed to sibling tasks

- BA-002 (shared brain): `revision` + `expectedRevision` is the intended optimistic-concurrency primitive for authoritative durable assistant state; `snapshot()` is the durable-state shape to compare against a ContextProjection.
- BA-003 (embodiment/foreground): `setPresence` deliberately does **not** elect a foreground assistant; BA-003 must add that binding above this contract instead of changing it.
- BA-005 (Digital-Me gateway): the `companion` port and `DIGITAL_ME_WRITE_SURFACE` mark the isolation boundary; BA-005 owns real Digital-Me access, which this contract intentionally cannot reach.
- BA-007 (settings surface): `patchProfile` (one-level port merge) and typed errors `UNKNOWN_PERSONALIZATION_PORT` / `INVALID_ASSISTANT_PROFILE` are the intended UI-facing write path.
- BA-009 (duties/permission policy): `effectiveGrantsFromProfile` always returns no grants; AssistantPolicy for invariant 19 must be built outside the profile.

## 6. Open items for the Correction host / Owner

1. Adversarial review should attempt authority smuggling through paths this suite does not enumerate (deep nesting, array-of-objects, unicode/case-variant key names such as `Permissions`/`permissions​`, prototype-pollution keys such as `__proto__`) and repair the guard if any path passes.
2. Confirm whether the owner wants an evolution/process-data record for BA/RF/GAI/EM component work (D11) or whether these reports are the complete construction record.
3. Decide whether component tasks should later publish a bilingual user-facing note for the new contract; D12 leaves that to the documentation programme.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```
