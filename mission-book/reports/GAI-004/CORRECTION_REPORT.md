# GAI-004 Correction Report — API Channel + Explicit Consent + Budget Policy

```text
MISSION              = GAI-004 (General AI Gateway programme, task 4 of 9)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-004-api-channel-consent-budget.md
CLAIM_COMMIT         = f91f31a (Digital-City main, claim of GAI-004 Correction by Alien)
CLAIMED_AT           = 2026-09-30T17:05:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = fbb749272ad65c9a8de6cc303371b52fda22f7ef
DEVELOPMENT_CI       = 36735078546-success
CORRECTION_BRANCH    = general-ai/GAI-004-api-channel-consent-budget
CORRECTION_HEAD_SHA  = 11d5eced3e913cdd0cd9249d55825dedbcc3d5ac
BRANCH_CI            = BLOCKED — see §1
LOCAL_CHECK_SUMMARY  = GAI-004 11 pass, root 112 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at fbb7492, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = false — pending the external CI blocker in §1
```

## 1. TYPED EXTERNAL BLOCKER — hosted CI cannot run (Owner action required)

The corrected head is pushed (`11d5ece`) and **every local check the CI gate runs is green**, but
GitHub Actions refuses to start the jobs on this account:

```text
run 36750532665 (push 17:19:16)   gateway-web X 5s   android X 3s
    "The job was not started because recent account payments have failed or your
     spending limit needs to be increased. Please check the 'Billing & plans' section"
run 36750532665 (re-run 17:24)    identical, both jobs refused to start
```

This is **not a code failure**. The evidence that it is environmental rather than caused by this
branch:

- the jobs never started (4–6 second "failures", no steps, no logs);
- Mech's `EM-011` run **succeeded** at 17:14:47 and `RF-010` at 17:06:28, and my own RF-005 second pass
  succeeded at 17:05:29 — all on the same repository, minutes before;
- an immediate re-run of the same workflow failed to start in exactly the same way.

**Classification:** a genuinely external acceptance step, blocked on the Owner restoring GitHub Actions
billing/spending. Per the workbook's shared rules this is recorded as a typed pending seam and **never**
rewritten as success — which is why this report says `CORRECTION_COMPLETE = false` even though the code
work is finished and locally verified. The workbook stays `correction_status: IN_PROGRESS` with Alien
holding the claim; whoever next has CI available only needs to watch the existing run, because the head
is already pushed and needs no further code change.

## 2. Review method

Byte-verified immutable export before review (`frozen-fbb7492`, four files `match=True`); I read the
workbook's own acceptance list before judging; an independent adversarial probe reviewed the same frozen
copy. My own review found six defects and the probe found ten, one of which was **critical and mine had
missed entirely**. All are repaired in two pushes, and the local gate is green for both.

## 3. Confirmed defects and repairs

### Repaired in the first pass (my own review, six)

| id | severity | mechanism | repair |
| --- | --- | --- | --- |
| C1 | medium | `key in spec` let a field named after an `Object.prototype` member pass as canonical | `Object.hasOwn` + `Reflect.ownKeys` |
| C2 | **high** | the budget policy's own limits were unvalidated: `per_action_limit`/`aggregate_limit` = `NaN`, `Infinity`, `'ten'` or `null` made **both** `Number.isFinite` checks false and admitted a 999-action call — the second gate after consent, removed by configuration | policy values must be finite, non-negative numbers; `on_unknown_usage` must be a known value |
| C3 | medium | provider-reported usage accepted **negative** counts, which are then summed in, so a call could *increase* the remaining budget | counts must be non-negative safe integers |
| C4 | medium | a non-enumerable own `api_key` escaped both the secret scan and redaction, against the acceptance line "secret values never appear in logs, Action provenance or reports" | own-key-complete, cycle-safe scan and redaction |
| C5 | medium | `checkBudget` reported `aggregate_usage_known: true` for an absent aggregate and `usage_absent_treated_as_zero: false` **while treating absence as zero** — a claim that could not fail, on the budget gate | both fields now report what the code does |
| C6 | low | `isIsoInstant` was shape-only | calendar round-trip |

C5's repair was deliberately *not* a behaviour change. My first attempt made an absent aggregate refuse
the call — and five of the author's six tests failed, because "approve consent + budget ⇒ API run may
proceed" is an acceptance line and the suite legitimately admits without caller-supplied accounting. The
defect was the **false claim**, not the semantics, so I fixed the claim and left the flow alone.

### Repaired in the second pass (from the independent probe, four)

| id | severity | mechanism | repair |
| --- | --- | --- | --- |
| C7 | **critical** | **consent was never bound to its action**: nothing compared `consent.action_ref`/`scope` with the requested `action_ref`, so a consent for `action:A` admitted `action:B` and the adapter ran | a consent that names an action consents only to that action (`CONSENT_SCOPE_MISMATCH`) |
| C8 | **high** | `estimated_actions` was read with `Number.isFinite`, so a **negative** estimate passed the per-action test and *underflowed* the aggregate test (`-1000000` admitted with `aggregate_limit: 0`) | a count must be a non-negative safe integer; the same rule now applies to consumed usage |
| C9 | medium | `provenance.credential_ref` was unreachable by construction — `execute` took a credential reference but `admit` never carried it | admission and provenance now carry it |
| C10 | medium | `usageFromResponse` ignored the `prompt_tokens`/`completion_tokens`/`total_tokens` vocabulary, so real reported usage was discarded as unknown | the aliases are accepted |

C7 came *only* from the independent probe, and it is the finding of this correction: the module's own
header promises "user consent → budget check → API admission", and consent that authorises a different
action is not consent for this one. It survived my review because I read `validateConsent` as a shape
check and never asked what the shape was *for*.

## 4. Reviewer findings recorded but NOT repaired (with reasons)

1. **No spend ledger** (probe finding 2, critical in its reading). `aggregate_limit` can only bind if the
   caller supplies truthful `usage_so_far`; omitting it means consumed = 0, and `accumulateUsage` is
   never wired in. A ledger is **new state in a module documented as pure** ("no ambient state"), so it
   is a design decision for the Owner, not a local repair. C5 removed the false *claim* about absence;
   the accounting gap itself remains and is stated here.
2. **Consent never expires** (probe finding 3). `created_at` is validated and never read, and
   `expires_at`/`revoked_at` are refused as unknown fields, so revocation is unrepresentable. The
   workbook's acceptance list for this task does not require expiry (it requires the *usage* rule, which
   holds), so adding a consent lifetime would be inventing a policy. **Carry-forward for the Owner:**
   consent needs an expiry/revocation field before this channel carries real authority.
3. **`admit` still returns `api_execution_permitted: true` with no adapter** when `protocol` is omitted
   (probe finding 4, high). The crash it used to cause is fixed — `execute` now returns a typed
   `NO_ADAPTER_FOR_PROTOCOL` refusal with `adapter_called: false` — and admission deliberately remains
   consent + budget, because the author's suite asserts that separation. The **field name overstates**:
   it grants permission to execute while nothing can execute. Making `protocol` mandatory would be the
   clean fix and breaks the Development fixtures; recorded rather than forced.
4. **Policy ceilings** (probe finding 10): limits must be finite and non-negative but have no maximum, so
   `MAX_SAFE_INTEGER` is honoured. The workbook states no ceiling; recorded for the Owner.
5. **A refused streaming call pushes a provenance entry** (probe finding 9): the entry is created by
   `provenanceFor` before the refusal returns. It records an *attempt that was refused*, which is
   arguably correct audit; flagged so the Owner can decide.
6. **No consent-expiry, scope or ledger assertion exists in the Development suite** — the probe's note,
   and the reason defects 1–3 and 7 were live while a green suite shipped. Recorded as the systemic
   observation.

## 5. Local verification (the CI gate's own commands)

```text
node --test contracts/general-ai-api-channel-v1/tests/conformance.test.mjs -> 11 pass, 0 fail
node --test tests/*.test.mjs                -> 112 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at fbb7492)
node scripts/check-bilingual.mjs            -> SYNCHRONIZED
```

Author suite **6/6 pass unchanged**. Suite extended **6 → 11 tests**, every negative assertion paired
with a legitimate neighbour (an unusable budget policy is refused *and* the default policy still admits a
small call; a hidden secret is redacted *and* an enumerable one is; a misdirected consent is refused
*and* a consent that names no action still admits; no-adapter is a typed refusal *and* a real protocol
still executes).

## 6. Unstated decisions (problem / choice / rationale)

1. **What binds a consent to an action.** *Choice:* a consent that names an action consents only to that
   action; one that names none is action-agnostic. *Rationale:* the module already requires
   `action_ref` on the consent record and the request, so the comparison is the only thing that makes
   the field mean anything. Refusing on mismatch is fail-closed.
2. **What a count is.** *Choice:* a non-negative safe integer; anything else falls back to the
   conservative `1` rather than being trusted. *Rationale:* `Number.isFinite` accepted negatives, and a
   negative estimate underflows a `>` comparison — the bound must not be arithmetically escapable.
3. **Whether absence of accounting should refuse.** *Choice:* no (author's design), but the result must
   say so. *Rationale:* the acceptance line "approve both ⇒ API run may proceed" is a hard requirement
   and five tests assert it; the honest fix for an over-claiming field is the field.
4. **Provider usage vocabularies.** *Choice:* accept `prompt_tokens`/`completion_tokens`/`total_tokens`
   as well as `input_tokens`/`output_tokens`. *Rationale:* discarding real reported usage as unknown
   makes the budget gate refuse honestly-but-wrongly; the module's own rule is that unknown stays
   unknown, and this was not unknown — it was unread.
5. **What to do when CI cannot run.** *Choice:* keep the stage `IN_PROGRESS`, record the exact seam, and
   state `CORRECTION_COMPLETE = false`. *Rationale:* the workbook says mark complete only when green, and
   the programme's shared rules say an external blocker is recorded as a typed seam and never rewritten
   as success.

## 7. Honest self-errors

- **I missed a critical defect (C7).** I reviewed `validateConsent` as a shape check and never asked what
  the consent record's `action_ref`/`scope` fields were *for*. The independent probe asked and found that
  consent for one action admits another. Reading a field's validation is not reading its purpose.
- My first repair attempt changed accounting semantics (absent aggregate ⇒ refuse) and broke five
  author tests. The tests were right — an acceptance line depends on that flow — so I fixed the false
  claim instead of the flow. That is the second time this session an author test corrected my judgement,
  and both times I reverted my change rather than the test.
- One of my new regression assertions was wrong again (I asserted a redacted key would be *absent*; it is
  present with `[REDACTED]`), which I caught locally before pushing.
- I pushed the first pass and *then* the probe reported a critical finding. The ordering lesson from the
  previous round was applied in one respect — I verified locally before pushing this time — but not in
  another: a probe still in flight means unresolved review, and I should wait for it before treating a
  correction as finished.

## 8. Result

Ten distinct mechanisms repaired across two passes, with paired regression tests, an independent probe
reconciled line by line, six boundaries recorded with reasoning (two of them named as the remaining
substantive gaps: the missing spend ledger and the missing consent expiry/revocation), and a typed
external blocker recorded instead of a success claim.

```text
CORRECTION_COMPLETE = false
BLOCKER             = GITHUB_ACTIONS_BILLING_OR_SPENDING_LIMIT (Owner action; jobs refused to start)
PENDING_SEAM        = hosted CI for remote/general-ai/GAI-004-api-channel-consent-budget @ 11d5ece
CONTROL_BOOK_UPDATED = mission-book/general-ai-gateway/GAI-004-api-channel-consent-budget.md
```
