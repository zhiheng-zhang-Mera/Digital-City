# GAI-002 Correction Report — Provider / Model / Account Registry

```text
MISSION              = GAI-002 (General AI Gateway programme)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-002-provider-model-account-registry.md
CLAIM_COMMIT         = 2a3bb34 (Digital-City main, claim of GAI-002 Correction by Alien)
CLAIMED_AT           = 2026-09-30T14:05:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = a6988c1725691a02f84e8ee1b9ca1bc6d1db6a17
DEVELOPMENT_CI       = 36722553299-success
CORRECTION_BRANCH    = general-ai/GAI-002-provider-model-account-registry
CORRECTION_HEAD_SHA  = e27763a2fc4f246faa6166a5e85c0d899d9c7a7b
BRANCH_CI            = 36726387305 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = registry 14 pass, root 115 pass, city 1801 pass, promotion-history OK, docs SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Two reviews again, and this time the isolation was mechanical rather than a discipline the
reviewing host could break.

**The revision under review was exported to an immutable, byte-verified path before any review
started**, and the reviewer was instructed to import only from that export:

```text
D:\A-Utopia\.runtime\evidence\mission-book\GAI-002\frozen-a6988c1\
records.mjs  exported=2a62948d… commit=2a62948d… match=True
registry.mjs exported=58a5ac2b… commit=58a5ac2b… match=True
index.mjs    exported=95210a68… commit=95210a68… match=True
```

That changed what was possible. In BA-003 and EM-002 the reviewer ran against a worktree this host
was editing, so it had to reconstruct the baseline itself (BA-003) and one of its findings was
measurably wrong as a result (EM-002). Here this host **repaired in parallel** with the review,
each of the reviewer's 8 probes named `a6988c1`, and the export was re-verified pristine three
times during the work. This is the isolation the EM-002 report recommended, now demonstrated.

One tooling note worth recording: `git archive` must be written to a file and then extracted.
Piping it into `tar` through PowerShell corrupts the tar stream (`tar: Damaged tar archive`).

A second, smaller lesson: a `git commit -m` message containing shell metacharacters (`||`) was
mangled by PowerShell and git tried to treat part of the message as a pathspec, so the commit
silently did not happen. The message was moved to a file and committed with `-F`.

**Result: 8 confirmed defects (the reviewer's C1–C8) plus 1 suspected-now-closed (S1).** This
host's own three findings were C1's two halves (key spellings, no value scan) and C2, so the
overlap was partial for the fourth time running.

## 2. Defects and repairs

### C1 (high) — raw secrets accepted in declared free-text fields

`findRawSecretFields` inspected only *key names*, never a value, so `display_name`, `provider_ref`,
`source.ref` and `account_ref` — all declared free text — carried a raw API key, a JWT or a PEM
private key through validation **and into the registry snapshot**. Reproduced on the frozen
revision with the author's own record shape:

```text
control (valid record)            -> ok: true
display_name = sk-live-…          -> ACCEPTED
source.ref   = PEM private key    -> ACCEPTED
provider_ref = sk-live-…          -> ACCEPTED
```

and the key guard was spelling-blind: `credentials`, `tokens`, `secrets`, `apiKeys`, `api_keys`,
`privateKeys`, `sessionKeys`, `authToken`, `bearerToken`, `clientSecret`, `accountCredential`,
`tokenValue`, `passwordHash` — 13 spellings — all missed while `api_key`/`apiKey`/`access_token`
were caught.

**Repair:** value-shape detection over every leaf string (PEM headers, three-segment `eyJ…` JWTs,
provider key prefixes, `Bearer …`) plus a normalised, plural-tolerant key guard with the handle
forms still exempt, and value-aware so a numeric `max_tokens` is a quantity rather than a false
positive.

### C2 (high) — `key in spec` let every `Object.prototype` name through

`records.mjs` `checkShape` used `if (!(key in spec))`. Reproduced on the frozen revision:

```text
toString valueOf hasOwnProperty constructor isPrototypeOf propertyIsEnumerable toLocaleString
__proto__ (JSON-parsed own key)                              -> all ACCEPTED
mood (an ordinary unknown key)                               -> refused   <- control
```

The control matters: the check otherwise worked, so the hole was exactly the prototype chain. The
own `__proto__` key was worse than a stray field — as a container it hid C1's spelling-blind guard,
carrying `credentials`, `apiKeys` **and an `executionLease` field** into the snapshot, which also
violates the rule that no record may carry a grant, lease, token or policy field.

**Repair:** own-key lookup plus reserved prototype keys (`__proto__`/`prototype`/`constructor`)
refused at every depth.

### C3 (high) — identity uniqueness enforced asymmetrically; one reference named several records

`upsertProvider` checked nothing; `upsertModel` consulted only `models`; `upsertAccount` replaced
a record without guarding that its `provider_ref` still matched — contradicting the module's own
comment that an account reference may never be reused as a provider or model reference.
Reproduced:

```text
upsertModel({model_ref:'id-1', provider_ref:'id-1'})          -> ACCEPTED; getProvider + getModel both found
upsertProvider({provider_ref:'acct'})  (acct is an account)   -> ACCEPTED; getAccount + getProvider both found
upsertProvider({provider_ref:'m1'})    (m1 is a model)        -> ACCEPTED
upsertAccount({account_ref:'shared', provider_ref:'p2'})      -> ACCEPTED, silently re-pointed;
                                                                gone from p1's listing
upsertModel({model_ref:'m-shared', provider_ref:'p2'})        -> refused IDENTITY_COLLISION  <- control
```

This is precisely what the Development report §6.1 invites a reviewer to try ("register an account
that aliases another provider's identity through a different subject kind"), and it succeeded. The
refused model manoeuvre is the control that makes the account path a defect rather than a choice.

**Repair:** one shared reference→kind/parent identity index consulted by all three upserts on
**create and update**; an in-place parent change is `IDENTITY_COLLISION`. A legitimate idempotent
re-registration under the same parent is asserted to still work.

### C4 (medium-high) — handle references from a counter that restarts

`handle:${kind}:${counter}` from `let counter = 0` per store instance, so two instances minted the
same reference for different secrets — and a canonical account record persists that reference, so
after recovery it resolved to the other session's bytes. A one-line comment cannot be added here
because the point is structural: a handle must be a stable reference to exactly one credential.
`revokeHandle` on an unknown reference also returned `{revoked:false}` silently.

**Repair:** content-addressed, epoch-scoped references (`handle:<kind>:<epoch>:<digest>`), a
cross-epoch reference refuses to resolve, unknown revoke is reported with `code:'UNKNOWN_HANDLE'`,
and the same value in the same epoch deterministically mints the same reference.

### C5 (medium) — a stale channel was advertised as supported, via a tautology

`channelReadiness` returned `supported: channel === 'WEB' || channel === 'API'` in the stale
branch. `channel` had already been validated into `CHANNELS` and the missing-entry case had already
returned, so this **could not be false**. The listing API that the Development report names as the
GAI-003/004/005 routing query surface therefore advertised stale channel declarations, while the
capability path for the same record correctly collapsed to UNKNOWN — the module contradicting its
own header. `readiness: 'UNAVAILABLE'` also reported `supported: true`.

**Repair:** `supported` is computed from freshness and readiness. Stale and `UNAVAILABLE` are not
supported; `AUTH_REQUIRED` still is, because the channel exists and merely needs a credential — a
judgement recorded in code as `UNSUPPORTED_READINESS` rather than left as an inline boolean. A
stored readiness outside the enum is re-validated rather than echoed (S1).

### C6, C7, C8 (low)

- **C6** `freshness()` hard-coded `UNKNOWN_PROVIDER` whatever the subject was, so a missing model
  or account was reported as a missing provider while `capability`/`readiness` answered correctly.
  One `absenceCodeFor(subject)` now maps every subject kind in one place (and the two inline
  ternaries that duplicated it are gone).
- **C7** freshness was one-sided, so `observed_at = 2099, ttl_ms = 1` read FRESH in 2026 and still
  FRESH in 2089. A future observation is not evidence of anything; the bound is two-sided now.
- **C8** `snapshot().hard_coded_identities` was the literal `0`, certifying "no hard-coded
  identities" while testing nothing — and the Development report offered that field as the
  evidence for the claim, so a vacuous value there was load-bearing rather than decorative. It is
  derived from `BUILT_IN_IDENTITIES.length`.

## 3. Recorded, deliberately not repaired

- **`HANDLE_SUFFIX` exempts every `*_id`**, so `api_key_id` is not flagged as secret-shaped. This
  is a deliberate disagreement with the reviewer: an `_id` is a reference by the same convention
  that all six sibling contracts use, and narrowing it here while the others keep it would make the
  convention inconsistent across the programme. Recorded so a later task can change it everywhere
  at once if the Owner prefers.
- **Null-prototype specs (`Object.create(null)`) and a `__proto__`-refusing clone** are sound
  defence-in-depth suggestions, but the own-key check plus the reserved-key refusal already close
  the hole: a record carrying an own `__proto__` is refused at validation and never reaches a Map,
  so `structuredClone` preserving it is no longer reachable. Recorded as optional hardening rather
  than as an open defect — the effect is already prevented, and adding both would be a second
  mechanism for one property.
- **S2** (`validateCapabilityMap` is prototype-blind, so `Object.create({TEXT:'SUPPORTED'})` passes
  the pure validator) is left as recorded: `structuredClone` flattens the record, so nothing
  unvalidated persists, and the reviewer itself could not reach canonical state with it.

## 4. Decisions not specified by the book

**C1 — Fix in parallel with the review, or wait?** In parallel, because the isolation made it safe:
the reviewer imported only from the immutable export while this host repaired the worktree. Waiting
was the previous pattern and it cost rounds; the isolation converted "wait" into "work".

**C2 — Whether to mark GAI-002 complete after the first repair commit.** No. After `f2134ea` two
of eight confirmed defects were closed, so the workbook was left `IN_PROGRESS` and the remaining
six were written into a durable working note with root causes and fixes. A correction that reports
complete with six confirmed defects open would be the false-success this programme forbids.

**C3 — Whether to change the author's handle fixtures.** Line 59 of the suite uses
`handle:profile:1` as a *record* value, and line 183 asserts only `startsWith('handle:BROWSER_PROFILE:')`,
so both survive the content-addressed format unchanged. No author test was modified for C1–C8; the
count moved from 7 to 14 by addition only.

**C4 — Evolution-feed record.** Not written, consistent with BA-001 D11 / BA-002 C5 / BA-003 C6 /
EM-001 D13 / EM-002 C5 / GAI-001 C6 / RF-001 D8 / RF-002 D13: the `contracts/evolution` schema is
migration-scoped, so no GAI event validates and extending it would touch the frozen `contracts/**`
surface.

## 5. Test summary

| Check | Result |
|---|---|
| reviewer's 8 probes against the frozen export | every C1–C8 reproduced before repair |
| `node --test contracts/general-ai-registry-v1/tests/conformance.test.mjs` | 14 pass / 0 fail (7 Development + 7 new) |
| `node --test tests/*.test.mjs` | 115 pass / 0 fail |
| `node city/test-all.mjs` | 1801 pass / 0 fail |
| `node scripts/verify-promotion-history.mjs` | 10 record(s) verified against local Git history at f2134ea5f922 |
| `node scripts/check-bilingual.mjs` | docs / evidence / data-records PAIRED |
| GitHub CI 36726387305 on e27763a2fc4f246faa6166a5e85c0d899d9c7a7b | **gateway-web success, android success** |

FAILURE_REPAIR_SUMMARY: all 7 Development tests passed unchanged after every repair, and no author
test was modified. One shell-level failure occurred and is recorded above: a commit message
containing `||` was mangled by PowerShell so the commit silently did not happen; it was re-run from
a message file. One of this host's own probes needed the registry's handle-store port before it
could exercise admission (`HANDLE_STORE_REQUIRED`), which is correct module behaviour.

## 6. Cross-task seams

- **GAI-003 / GAI-004 / GAI-005** consume this registry as their routing query surface. C5 changed
  what that surface says: a stale channel is no longer `supported`, and `freshness`/`readiness` are
  attached to the channel answer. A sibling that read only `supported` will now see `false` where
  it previously saw a tautological `true`, which is the intended correction.
- **GAI-004 (API channel + consent + budget)** must treat `AUTH_REQUIRED` as supported-but-not-ready
  (the judgement recorded in `UNSUPPORTED_READINESS`) rather than as unavailable.
- **Whoever ships the real `SecureHandleStorePort`** owns the real guarantee behind C4: ref stability
  and persistence. The epoch-scoped, content-addressed shape here is a deterministic double, and the
  reviewer correctly notes the real port is absent from the export, so C4's fix is unverified
  against it.
- **The registry still owns no credential store, no login, no execution and no provider selection**;
  those flags in `GAI_REGISTRY_CONTRACT` are unchanged and were verified clean of provider product
  names by the reviewer.

## 7. Open items for the Owner

1. **The `*_id` exemption** (§3) is consistent across six contracts but does exempt names like
   `api_key_id`. A programme-wide ruling would be better than one task changing it alone.
2. **No withdrawal/resurrection API exists** at all, so "resurrect a withdrawn record" cannot be
   exercised on any GAI registry task; a later task must define withdrawal before that class of
   defect can even be tested.
3. The evolution-feed question (C4) remains open.

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Mech
CORRECTION_HOST     = Alien   (different physical host — two-host gate satisfied)
CORRECTION_HEAD_SHA = e27763a2fc4f246faa6166a5e85c0d899d9c7a7b
BRANCH_CI           = 36726387305 — gateway-web success, android success
MERGE_STATUS        = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```
