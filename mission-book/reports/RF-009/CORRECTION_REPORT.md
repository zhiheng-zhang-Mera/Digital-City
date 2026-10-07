# RF-009 Correction Report — Presence / Offline / Reconnect + Audit

```text
MISSION              = RF-009 (Remote Fabric programme, task 9 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-009-presence-offline-reconnect-audit.md
CLAIM_COMMIT         = 1a5d67c (Digital-City main, claim of RF-009 Correction by Alien)
CLAIMED_AT           = 2026-10-01T00:37:29Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = e6b83b4d0b22131391bffc4dda243fcd650b3143
DEVELOPMENT_CI       = 36746849199-success
CORRECTION_BRANCH    = remote/RF-009-presence-offline-reconnect-audit
CORRECTION_HEAD_SHA  = aaca94a39d3d06f6653f9a75bfb0b78bdd973c4c
BRANCH_CI            = 36797962837-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = RF-009 25 pass (7 author + 18 Alien regressions), root 126 pass, rooms 69 pass,
                       city 1801 pass, promotion-history OK at e6b83b4, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   e6b83b4 (Mech)   run 36746849199   success 2026-09-30T16:48:07Z
corrected head     aaca94a (Alien)  run 36797962837   success
  gateway-web  OK 1m56s  (job 110165641700)
  android      OK 1m10s  (job 110165641448)
```

Both heads executed their real workflow steps on GitHub-hosted runners. Hosted CI is green on the exact
corrected head, so this Correction satisfies its completion criterion.

## 2. Independent review method

The author's suite was not treated as evidence.

1. The Development head was exported with `git archive` and all four task blobs were verified against their
   Git objects (`git hash-object` == `git rev-parse e6b83b4:<path>`), giving a byte-exact immutable review
   target: `D:\A-Utopia\.runtime\evidence\mission-book\RF-009\frozen-e6b83b4\`.
2. An independent adversarial reviewer was pointed **only** at that frozen export, told to read this task's
   workbook first (so the goal, scope, out-of-scope list, required acceptance and the twelve mandatory
   Remote Fabric invariants were its acceptance criteria), and required to reproduce every claim with a
   runnable probe labelled OBSERVED or SUSPECTED.
3. The reviewer returned 10 findings; I had independently found 14 mechanisms. Merging **by mechanism**
   produced 18 repaired defects. Its four genuinely new mechanisms (duplicate-effect identity,
   identity rebinding, the live-guard literal bypass, negative measurements) were repaired in a second
   pass; its two contract questions are recorded as boundaries in §6.
4. Every repair is anchored by a probe that fails on the Development head. The same 25-test suite was run
   against both heads: **7 pass / 18 fail on `e6b83b4`; 25 pass / 0 fail on `aaca94a`**.

## 3. Defects found and repaired

All eighteen are invisible to the author's suite, which passes 7/7 on the Development head.

| # | Mechanism | Root cause | Repair |
| --- | --- | --- | --- |
| 1 | The audit sequence could neither order nor identify entries: `audit_seq: audit.length + 1` was recomputed after the retention `shift()`, so once `max_audit_entries` saturated every new entry claimed the **same** sequence (3, 3, 3) | sequence derived from the buffer length, not a counter | a dedicated monotonic counter, plus honest `retained_entries`/`dropped_entries` per entry so the bound is visible |
| 2 | Every entry asserted `contains_secret_material: false` while nothing checked it: `findForbiddenAuditFields` was exported but called by **no surface**, and `SECRET_MATERIAL_REFUSED` was never thrown. The module's own scanner found `audit[1].action_ref.token` in its own log | the claim was hardcoded, the scanner unwired | `append` scans the candidate entry and refuses forbidden fields with `SECRET_MATERIAL_REFUSED`; the claim is now checked (with identifiers validated as text, the hole is closed at both layers) |
| 3 | Every caller-supplied instant was unvalidated on 9 entry points, and `isIsoInstant` checks only the ISO **shape**, so `2026-13-45T99:99:99Z` parsed to `NaN` | `at = when ?? now()` bypassed the clock validator | `callerInstant`/`isRealInstant` on every entry point, the injected clock, and the queue deadline |
| 4 | A **future-dated** observation was accepted, pinning `last_seen_at` into the future so the node reported `ONLINE`, `stale: false` for as long as the caller liked | no upper bound on an observation instant | an observation instant may not lie in the future (typed `INVALID_REQUEST`) |
| 5 | The staleness gate was defeatable by a caller-chosen instant: with the real clock reporting `UNREACHABLE`, `assertReachable({at: <past>})` returned reachable and accepted `LIVE_ONLY` work | `project(node, at)` was the only staleness evaluation on the enforcement path | reachability is required at **both** the requested instant and the registry clock; the refusal reports the state the clock sees |
| 6 | Expiry on the reconnect path was defeatable the same way: `reconcile({at: <past>})` **RESUMED** an action whose deadline had already passed (and a live action whose context was gone) | expiry and live-context loss computed from the caller's instant | both are judged at the registry clock as well (`DROPPED_EXPIRED` / `DROPPED_LIVE_CONTEXT_LOST`) |
| 7 | A replayed `enqueueAction` for the same `command_ref` silently overwrote the record, resetting an **UNKNOWN** outcome to `PENDING`; reconciliation then RESUMED a stale side effect | unconditional `pending.set` | a replay of a command whose outcome is unknown is refused with `RECONCILIATION_REQUIRED` and stays UNKNOWN until reconciled |
| 8 | `markOutcomeUnknown` regressed a **settled** outcome: a `CONFIRMED_SUCCEEDED` command became `UNKNOWN`, losing a confirmed fact | no state guard before mutating | a settled outcome (`CONFIRMED_*`, `EXPIRED`, `REFUSED`, `DUPLICATE_SUPPRESSED`) is not regressed; the existing state is reported |
| 9 | Identifiers were unvalidated, so a **cyclic object** reached the deep freezer and the module crashed with an untyped `RangeError: Maximum call stack size exceeded` (`installation_id`, `session_ref`, `action_ref`, `interaction_ref`, `reason`) | `freeze` recurses with no visited set and the fields had no type rule | identifiers are nullable **text** (typed refusal before any freeze) |
| 10 | `policy` was merged unvalidated, so `offline_after_ms: Infinity` disabled staleness entirely — a node silent for a year still reported `ONLINE`, `reachable: true` | the bound that makes presence honest was itself caller-controlled | the merged policy is validated (positive safe integers, default ≤ max) |
| 11 | An impossible queue deadline (`2026-13-45T99:99:99Z`) was accepted, stored as `queue_expires_at`, and never expired because `NaN` comparisons are false | shape-only deadline validation | `DEADLINE_REQUIRED` for anything but a real instant; the action is never created |
| 12 | `assertNotDuplicate` with **no** subject was a false duplicate: `effect.action_ref === null` matched an effect that also had no action ref, so an unrelated check threw `DUPLICATE_COMPLETED_EFFECT` "for null" | null-equality treated "not given" as a subject match | a subject (`action_ref` or `command_ref`) is required, and only supplied values are compared |
| 13 | A refusal that protects new work was invisible in the audit: `assertReachable`'s `NOT_REACHABLE` left no entry, while the sibling refusal inside `enqueueAction` did | audit incompleteness on a security-relevant path | the refusal is audited (`kind: PRESENCE`, `outcome: NOT_REACHABLE`) before it throws |
| 14 | An exotic object (class instance) was accepted as refreshed reconnect state | `isPlainObject` accepted any non-array object | a canonical record must have an object or null prototype |
| 15 | **A confirmed effect could be applied again.** `confirmEffect` filed the effect under the command key when the command was no longer pending (it had no `action_ref` parameter at all) while `reconcile` looked it up under the action key, so an action-bearing replay **missed the recorded effect and was RESUMED** — while `confirmEffect` still answered `duplicate_suppression_armed: true` | three different identity predicates for one effect | one `completedEffectFor` predicate shared by `confirmEffect`, `reconcile` and `assertNotDuplicate`; `confirmEffect` accepts and binds the action it performed |
| 16 | **A presence record could be rebound to another logical identity.** `registerNode` overwrote the record unconditionally, and `reconcile`'s identity check compared the refreshed device against the value just written — so another device satisfied the check and resumed the original device's queued work | identity not binding | a rebind to a different `device_id`/`installation_id` is refused; same-identity re-registration still works, and a mismatched device still gets `IDENTITY_MISMATCH` |
| 17 | **The live-action guard was bypassable.** The branch tested `queue_policy === 'LIVE_ONLY' \|\| requires_live_session === true`, so `requires_live_session: 1` / `'true'` / `'yes'` failed the identity comparison and an interactive action was silently downgraded to queued work while the node was not reachable | a guard that only runs for an exact literal | `requires_live_session` must be a boolean when given, so the mis-declared flag is refused instead of downgraded |
| 18 | A measurement was accepted unvalidated: `latency_ms: -1e9` (and `NaN`) were stored as quality metadata | `Number.isFinite` used as a coercion, with no sign bound | `latency_ms` must be a non-negative number when given, checked **before** any state change |

## 4. Local test summary

```text
corrected module  25 tests / 25 pass /  0 fail
development head  25 tests /  7 pass / 18 fail   ← the 18 Alien regressions are the difference
root              126 pass / 0 fail
rooms              69 pass / 0 fail
city             1801 pass / 0 fail (1808 tests)
promotion-history  10 records verified against local Git history at e6b83b4
bilingual          docs / evidence / data-records = SYNCHRONIZED
```

Reproducible evidence under `D:\A-Utopia\.runtime\evidence\mission-book\RF-009\`:

- `frozen-e6b83b4/` — byte-verified Development export (4/4 blobs matched Git objects);
- `probes/probe-a.mjs` — my pre-repair probes (13 mechanisms reproduced on the Development head);
- `probes/probe-b-postfix.mjs` — the same scenarios against the corrected module, 20/20 pass;
- `pre-fix-check/` — the corrected suite run against the **unfixed** module (18 failures);
- `patch-presence.mjs`, `patch-presence-2.mjs` — the two re-runnable repair passes;
- `author-after-patch.log`, `author-after-patch2.log`, `prefix-test.log`, `postfix-test.log`,
  `gate-*.log`, `ci-*.log`.

## 5. Failed attempts and corrections to my own judgement

- Three of my own assertions were wrong and the module was right: I asserted a bad clock would be observed
  through `presenceOf` on a tracker where the node was never registered (the module correctly answered
  `UNKNOWN_NODE` first); I expected `assertNotDuplicate({command_ref: 'cmd:other'})` to match an effect
  recorded under a different subject; and my post-fix probe expected 7 dropped audit entries where 6 is
  correct for the single node it registers. Each was fixed **in the test/probe**, not in the module.
- I initially rated the unconditional `registerNode` overwrite as low materiality and would not have
  repaired it; the reviewer showed it is the vector for resuming one device's queued work as another's,
  which makes it one of the two most serious defects here. I adopted its mechanism analysis and repaired
  it with a binding check.
- I also initially missed the duplicate-effect predicate mismatch (defect 15) entirely: my probes tested
  confirmation with the command still pending, exactly like the author's suite, so the mismatch was
  invisible. That is a reminder that my own probe suite inherits the author's blind spots.

## 6. Deliberate boundaries (recorded, not silently widened)

1. **`completedEffects` and `pending` are unbounded.** The audit log is bounded by policy, but completed
   effects have no eviction and a live-only record lingers as `PENDING` until the next reconciliation. A
   live action can never *execute* late (reconciliation always drops a lost live context), so this is a
   memory/hygiene limitation rather than a correctness hole. Bounding it needs a new policy field the
   workbook does not define — Owner carry-forward.
2. **The omitted `queue_policy` default stays `QUEUEABLE`.** The reviewer proposed defaulting an
   `interaction_ref` action to live. The author's own suite encodes the current default
   (`conformance.test.mjs` line 118 enqueues without a policy and asserts `queued: true`), so changing it is
   an Owner-level contract change, not a Correction. The *bypass* (a non-boolean flag) is repaired.
3. **`REVALIDATION_REQUIRED` and `UNKNOWN_OUTCOME` remain unthrown.** They are expressed as returned
   outcomes (`DROPPED_NOT_REVALIDATED`, `state: 'UNKNOWN'`) rather than errors; the module is consistent
   about that, so they are not dead code in the same sense as the previously-unwired secret guard.
4. **Invalid-input refusals are not audited.** `UNKNOWN_NODE`, `INVALID_REQUEST` and `INVALID_PRESENCE` do
   not append audit entries; the decision refusals that protect new work now do (defect 13). Auditing every
   malformed input would make the bounded log a denial-of-service surface.
5. **`session_ref` does not gate any decision.** The reviewer noted that `requires_live_session` has no live
   session to require. This module records presence and reconnect state; verifying a live session belongs to
   the transport/pairing contract, so it is recorded as a seam rather than invented here.

## 7. Remaining external seam

Nothing in this task depends on hardware, a provider account or another programme. One seam is recorded:
reconnect reconciliation verifies the *refreshed* trust/capability/identity/presence/authority snapshot the
caller supplies, and cannot independently prove that snapshot is current — that proof belongs to pairing
(RF-002) and the transport path manager (RF-006), both of which are corrected components in this programme.
Nothing was rewritten: the Development head and all previously reported heads are untouched.
