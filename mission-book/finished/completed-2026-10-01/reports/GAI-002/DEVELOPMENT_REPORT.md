# GAI-002 Development Report — Provider / Model / Account Registry

```text
MISSION                  = GAI-002 (General AI Gateway programme, task 2 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = ff0368d (Digital-City main, "claim(GAI-002): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T13:28:55Z
CONTROL_REVISION_AT_CLAIM= 621a2dd (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-002-provider-model-account-registry
IMPLEMENTATION_HEAD_SHA  = a6988c1725691a02f84e8ee1b9ca1bc6d1db6a17
BRANCH_CI                = 36722553299 — success (run-level conclusion completed/success on the exact head)
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

| File | Purpose |
|---|---|
| `contracts/general-ai-registry-v1/records.mjs` | Provider/model/account records, capability facts, channel readiness, freshness/provenance, strict validation, raw-secret refusal |
| `contracts/general-ai-registry-v1/registry.mjs` | The registry: admission, typed absence, list/query APIs, `SecureHandleStorePort` seam and its deterministic double |
| `contracts/general-ai-registry-v1/index.mjs` | Public surface + published guarantees |
| `contracts/general-ai-registry-v1/tests/conformance.test.mjs` | 7-test conformance suite |
| root `tests/general-ai-registry.test.mjs` | Registers the suite with `pnpm test` |

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| provider/model/account identities remain distinct under multiple-account tests | `provider, model and account identities stay distinct across multiple accounts` (two accounts on one provider; account ref may not collide with a provider/model ref; a model belongs to one provider) |
| stale capability metadata is visible as stale/unknown | `stale capability metadata is visible as stale and reads as unknown` (`freshness: 'STALE'` and `level: 'UNKNOWN'`) |
| channel readiness can differ between WEB and API | `WEB and API readiness are answered independently and may differ` (`READY` vs `AUTH_REQUIRED`) |
| missing model/provider/account produces typed absence | `a missing provider, model or account produces typed absence, not a throw` (plus `MODEL_NOT_IN_PROVIDER` / `ACCOUNT_NOT_IN_PROVIDER`) |
| raw secret/cookie/token material is rejected from canonical records | `canonical records refuse raw secret material and keep handles only` |
| registry works with synthetic providers and does not hard-code Boss-era identities | `the registry starts empty and works entirely with synthetic providers` |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.**
Choice: GAI-002. Reason: the fresh scan found no owned repair and no eligible opposite-host
Correction (EM-002/EM-003 corrections can only be performed by Alien), so the unclaimed-Development
tier applied. GAI is the least-advanced pool (1 of 9 complete), no other host was working in it, and
it is a different programme from my previous claim (EM), which the tie-break prefers. I also authored
GAI-001's contract layer, which this registry is the first consumer of.

**D2 — Cross-branch discipline.** GAI-001 lives on an unmerged sibling branch from the same frozen
baseline, so it cannot be imported and must not be copied; this branch declares its own registry
contract and matches GAI-001's vocabulary (`WEB`/`API`, provider/model/account references,
handle-only credential discipline). Seam recorded in §5.

**D3 — What should an unverified capability answer be?**
Options: (a) absent = unsupported; (b) absent = unknown; (c) absent = unsupported until probed.
Choice: (b) `UNKNOWN`, with `SUPPORTED`/`UNSUPPORTED`/`UNKNOWN` all explicit. Reason: the workbook says
"default unknown capability to unknown/unsupported, never assumed true"; collapsing *unknown* into
*unsupported* would make routing reject a model it has never verified, and collapsing it into
*supported* would be a false capability claim. Unknown has to be its own value because "nobody checked"
and "checked and absent" are different facts.

**D4 — What should a *stale* capability answer be?**
Options: (a) return the remembered value with a `stale` flag; (b) return `UNKNOWN`.
Choice: (b) `UNKNOWN` with `freshness: 'STALE'`. Reason: the acceptance line is "stale capability
metadata is visible as stale/unknown". A caller that reads only `level` must not be able to act on a
remembered value; the freshness is reported alongside so an operator can still see why the answer is
unknown. Same rule for channel readiness.

**D5 — Where credentials and browser profiles live.**
Options: (a) store them on the account record; (b) store handles in this registry; (c) store values in
the neutral `SecureHandleStorePort` and keep only the returned handle reference.
Choice: (c), and the registry refuses to construct without that port. Reason: the workbook forbids
"a General-AI-only credential/profile storage engine that duplicates Engineering storage". The port is
injected, so this module owns no storage, and a deterministic double keeps the suite hermetic. A
resolution test asserts the bytes come back *from the port*, never from a registry record or snapshot.

**D6 — How is "no hard-coded identities" made testable?**
Choice: a fresh registry must list nothing, and the snapshot publishes `hard_coded_identities: 0`; the
suite then registers two differently shaped synthetic providers with different channels and capability
facts. Reason: "works with synthetic providers" is only meaningful if the module has no built-in
catalogue; asserting emptiness up front is the honest form of that claim.

**D7 — Typed absence instead of exceptions for lookups.**
Choice: `getProvider`/`getModel`/`getAccount` return `{found:false, code, detail}`, while *admission*
(`upsertModel`/`upsertAccount` referencing an unregistered provider) throws a typed error. Reason: a
missing subject is an ordinary query result a routing UI renders, whereas registering a record that
points at nothing is a caller bug. Making both throw would force callers to wrap every read; making
both return would hide a real programming error.

**D8 — Channel support on all three subject kinds.**
Choice: providers, models and accounts each declare their own channel entries, and readiness is
answered per subject. Reason: the workbook asks for Web/API support "independently per
provider/account/model", and a model that only exists on one channel is a real case the routing policy
(GAI-005) must see.

**D9 — No `schema.json`.** Runtime/discovery semantics validated in code, consistent with BA-002 D2,
BA-003 D2 and EM-003 D10.

**D10 — PROCESS_DATA_POLICY evolution inbox.** Not used, consistent with the other programmes'
reports. Discovery remains out of scope: logging in, executing and choosing a provider are explicitly
excluded and asserted absent in the published contract flags.

## 3. Test summary

7 tests, all passing: identity distinctness under multiple accounts (including collision refusals);
freshness and stale-as-unknown capability answers with provenance reported; independent WEB/API
readiness including unknown-for-undeclared-channel and stale-readiness-as-unknown, channel-filtered
listing; typed absence for missing subjects plus `MODEL_NOT_IN_PROVIDER`/`ACCOUNT_NOT_IN_PROVIDER` and
an orphan model refused at admission; raw-secret refusal across all three record kinds with handles
stored and resolved only through the port (and refused once revoked); an empty registry populated
entirely from synthetic providers with capability- and channel-filtered model queries; record-shape
strictness (version, empty channel list, duplicate channel, bad readiness, unknown capability fact,
bad support level, unknown field, bad instant, bad source kind, zero context window, bad account
status, non-channel handle key).

One development note: the first run failed on my own fixture — a synthetic model was declared with only
a WEB channel and then queried by API. The module was correct (an undeclared channel is `UNKNOWN`);
the fixture was fixed rather than the rule relaxed.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | docs/evidence/data-records PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36722553299 on a6988c1725691a02f84e8ee1b9ca1bc6d1db6a17 | success |

## 5. Integration seams handed to sibling tasks

- GAI-001 (core contracts): this branch's provider/model/account records must be bound at merge to
  GAI-001's `ProviderDescriptor`/`ModelDescriptor`/`ProviderAccount`/`CapabilityManifest`/`AuthStatus`
  shapes; the vocabulary (`WEB`/`API`, reference-only credentials) already matches.
- GAI-003/GAI-004 (channels, consent/budget): they consume `readiness` and `capability` — both carry
  freshness, so a channel must treat `UNKNOWN` as "verify or ask", never as "available".
- GAI-005 (triage/routing): `listProviders({channel})` / `listModels({providerRef, fact, level, channel})`
  are the query surface; this registry deliberately does not choose.
- GAI-007 (device-aware execution): a remote endpoint's provider/model availability should register
  through this same registry rather than a second catalogue.
- GAI-008 (health/resilience): freshness and `observed_at`/`source` are the inputs; a probe updates a
  record rather than mutating capability facts in place.
- Neutral 00-Foundation `SecureHandleStorePort`: this is the only storage this module touches, and it
  requires it to be injected (D5).
- EM-008 (credential/profile/session): must use the same neutral port; this branch is the reference
  consumer showing that a domain does not need its own credential engine.

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to make a stale record read as current (clock at exactly
   `observed_at + ttl`, a record with `ttl_ms: 0`, a record with an unparseable instant), to leak a
   handle *value* into a canonical record or snapshot, and to register an account that aliases another
   provider's identity through a different subject kind.
2. Confirm D3/D4 (`UNKNOWN` for both unverified and stale) as the intended semantics for routing.
3. Confirm whether account-level capability facts should override or intersect provider-level facts;
   this task reports each subject independently and leaves the combination to GAI-005.
4. The evolution-feed question remains open for the Owner.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
