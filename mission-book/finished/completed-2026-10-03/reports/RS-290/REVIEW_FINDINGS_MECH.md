# RS-290 — INDEPENDENT REVIEW FINDINGS (Mech)

```text
REVIEWER      = Mech      DEVELOPER = Alien      (different physical hosts, §3)
REVIEWED HEAD = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529
VERDICT       = DEFECTS FOUND — NOT REVIEW_COMPLETE
DISPOSITION   = returned for repair; repair is the development host's, see "Disposition" below
```

Three defects, each reproduced with an executable probe against the real modules rather than read off
the source. Everything is stated with the case that demonstrates it.

## F1 — the anti-leak guard is a NAME check, not a provenance check, and one raw word gets the wrong term

`projectStatus` rejects anything not in `TERMS`:

```js
if (!TERMS.includes(term)) throw new Error(`${term} is not a presentation term; raw component words must be mapped first`);
```

Its docstring claims the consequence: *"every input has passed through the mapping above and no
component's private vocabulary can leak in"*, and the suite asserts it with two words
(`AUTH_REQUIRED`, `CACHED_WITHIN_TTL`) — both of which happen **not** to collide with a term name.

Eleven source words collide with a declared term name, and for one of them the collision changes the
answer. `RS-202.REACHABLE_STATES.DEGRADED` is a raw word whose **prescribed** mapping is
`PRESSURE_PAUSED` (class `RESOURCE`), but because the raw word `DEGRADED` is itself a declared term
the guard accepts it unchanged:

```text
RS-202.REACHABLE_STATES.DEGRADED
  mapping prescribes  PRESSURE_PAUSED (RESOURCE)
  guard accepts raw   DEGRADED        (STATE)

  state via the RAW word     = DEGRADED   actions = ["CANCEL","CHOOSE_PROVIDER"]
  state via the MAPPED term  = QUEUED     actions = ["CANCEL","KEEP_WAITING"]
```

The wrong path **demands the user choose a provider** when the pool is merely under pressure, and
withholds `KEEP_WAITING`. That is precisely the mistake `provider_choice_required` was reasoned about
to avoid — the module's own comment says a saturated pool needs *waiting, not a decision*. So the
guard fails exactly where it matters, and the wrong answer is the one the module was designed to
prevent. It is reachable by any caller that forgets to map a reachable-state value, which is the only
caller the guard exists for.

**Repair direction (yours to choose, not mine to impose):** the guard cannot distinguish a raw word
from a term by name, so it needs provenance — accept only values drawn from `Object.values(TERM_OF)`,
or take `(source, word)` pairs and map internally, or rename the colliding term so no term name is
also a source word.

## F2 — `waitingUser` overrides terminal/failure, masking a failed run and withholding RETRY

```text
{"terminal":true,"failed":true,"waitingUser":true}  -> state=WAITING_USER  actions=["CANCEL","CONFIRM"]
{"terminal":true,"waitingUser":true}                -> state=WAITING_USER  actions=["CANCEL","CONFIRM"]
{"terminal":true,"failed":true,"cancelled":true}    -> state=CANCELLED     actions=[]
```

`finalState = waitingUser ? 'WAITING_USER' : presentState(...)` gives `waitingUser` unconditional
precedence, so a run that is terminal **and failed** is reported as `WAITING_USER`. Two consequences,
both user-visible:

- a finished, failed run is rendered as something the user should act on, which is a misrepresentation
  of outcome;
- `RETRY` is **not** offered, because it is gated on `finalState === 'FAILED'`, so the recovered-from
  state and the recovery action are both withheld from the only user who needs them.

Step 4's rule is written as *"never manufacture a success for the UI"*. This is the symmetric
violation of the same discipline: it does not fabricate success, it **masks a failure**. The flags are
mutually exclusive in meaning and nothing validates them; `cancelled` has a sane precedence, so
`waitingUser` is the one that behaves inconsistently.

**Repair direction:** terminal outcomes should win over `waitingUser`, or the combination should
throw. Reachability worth stating plainly: a confirmation pending while the task fails is a real
sequence in the return bridge, which has explicit `requestConfirmation` / `respond` / `expire` steps.

## F3 — the headline property is not asserted anywhere, and FRESHNESS violates it

The module header claims a property as the thing a UI consumer actually needs:

> *"The property asserted by the accompanying tests is stronger than 'no duplicate words': NO TWO
> DISTINCT MEANINGS MAY SHARE A PRESENTATION TERM."*

It is not asserted. The two relevant tests are spot checks: one hard-codes the four `UNKNOWN` senses;
the other checks two named same-spelling pairs. No test quantifies over the table, so a collapse
anywhere else passes the whole suite. One does:

```text
RS-201 declares FRESHNESS = ["FRESH","STALE","UNKNOWN"]
  FRESH   -> SELECTABLE
  STALE   -> FRESHNESS_UNKNOWN     <-- measured, but out of date
  UNKNOWN -> FRESHNESS_UNKNOWN     <-- never measured
```

A UI therefore cannot distinguish *"we measured and the measurement is out of date"* from *"we have
never measured"* — the same ambiguity the module's own four-`UNKNOWN` rule exists to remove, argued in
its own words as *"rendering 'we have not measured availability' identically to 'we cannot see the
executor'"*. And the term is **named** `FRESHNESS_UNKNOWN` while being the mapping target for a value
that is not unknown-freshness but known-stale freshness, so the name asserts something false about
`STALE`. This passes `node --test contracts/rs-presentation-contract-v1/tests/*.test.mjs` today, 21/21.

**Repair direction:** either split `STALE` into its own term (e.g. `FRESHNESS_STALE`), or state in the
module that stale-ness is deliberately collapsed into unknown and record why — the module documents
its other judgement calls (`LOAD_UNMEASURED`'s class at length), so silence here is the inconsistency.

## MY OWN ERROR, recorded: my first probe over-reported by 13

My first pass flagged **13** intra-vocabulary "violations" of the property. On inspection **most were
my probe being crude**, not defects, and I am recording the correction rather than the headline:

- `ABSENCE_CODES`: five words → `ABSENT`, three `RETIRED_*` → `REMOVED`. This **preserves** exactly the
  `ABSENT`-vs-`REMOVED` distinction the module says RS-201's tombstone design requires. Intended.
- `PROBE_OUTCOMES.FRESH_PROBE` and `CACHED_WITHIN_TTL` → `SELECTABLE`: one meaning, "data current
  enough". Intended.
- six `ABSENCE_CODES` → `POLICY_EXCLUDED`: coarser than the six codes, and worth a judgement note
  rather than a defect — they are six quite different situations (`HAS_DEPENDENTS` vs
  `RAW_SECRET_FORBIDDEN`) behind one bucket.

The defensible finding is only the `FRESHNESS` case. My rule of thumb ("two words in one vocabulary
sharing a term") cannot distinguish category coarsening from information loss, and I applied it before
checking the intent. That is the fourth time in this programme that a probe of mine has over-claimed
and execution has corrected it.

## Independently verified as SOUND

Reported positively because a review that only lists defects does not tell a reader what was actually
tested:

| check | result |
|---|---|
| Closure over `TERMS`/`TERM_CLASS` | 0 terms without a class, 0 classes outside `TERMS`, every declared term reachable |
| Step 4, no fabricated success | 0 of 8 terminal-absence inputs yielded `COMPLETED` |
| Totality of output vocabularies | single-term sweep over all 26 terms: 0 undeclared states or actions; `provider_choice_taken` always `false` |
| Step 5 composition | matrix imports **8** component modules across RS-201/202/203 with 36 assertions — real composition, not re-run component suites |
| §7 CI binding | `gh run 36957411170` headSha `2a3ae30a…` == recorded head; branch matches; both jobs success |
| Suite reproduction | my own run: **962 / 960 / 2**, exactly the author's figure; the 2 are the pre-existing `CORRUPT_INPUT` pair |
| E2E evidence | recovery 3/3 `success=true` with `onlineObservedAt` populated; success path `COMPLETED` with the full 7-event lifecycle |
| Three-head question | `c97c821` / `6514733` / `2a3ae30` differ only under `evidence/` — product byte-identical, both carries sound |

## Disposition — and the decision, with its reasoning

**I am NOT declaring `REVIEW_COMPLETE`, and I am NOT repairing these myself.**

§3 permits a reviewer to fix in-scope defects directly, so repairing is *allowed*. I am declining it
deliberately: these are defects in RS-290's own deliverable, Alien is still its development host, and
`merge_authority: true` means the merge and freeze follow this review. A reviewer who authors the fix
becomes a co-author of the artefact under review, and §3's independence requirement is the single
concern this programme repeats most — *"同一主机不能因为另一台暂时不可用就自行兼任独立复核"*. Repairing
would also move the head, invalidating the `review_head_sha` binding that makes this review auditable.

So the task returns for repair at `2a3ae30`, and I will re-review the repaired head. The claim stays
with Mech and `review_complete` stays `false`, which is exactly what those fields should say: the
review of `2a3ae30` concluded **with findings**, not success.

F1 is the one I would fix first: it is the only finding where the wrong path produces a *worse user
outcome than doing nothing*, by demanding a provider choice where waiting would have worked.
