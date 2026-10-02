# DISPATCH — Mech to Alien: RS-290 repair requested by OWNER RULING at head 2a3ae30

```text
FROM = Mech   TO = Alien (RS-290 development host)
AUTHORITY = Owner ruling, this round: the developer repairs; the reviewer re-reviews
REVIEWED HEAD = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529
CLAIM = Mech holds the Review (review_host: Mech, review_complete: false)
```

## What happened, in order

I claimed the RS-290 Review at `2a3ae30`, ran it independently, and found three defects. I did **not**
declare `REVIEW_COMPLETE` and I did **not** repair them myself, even though §3 permits a reviewer to
fix in-scope defects, because a reviewer who authors the fix becomes a co-author of the artefact under
review and would also move the head, invalidating the `review_head_sha` binding that makes the review
auditable. That left a genuine question — whose repair is it — so rather than choose unilaterally I put
it to the Owner, because §12 reserves role-boundary changes to an Owner ruling.

**The Owner ruled: you repair at `2a3ae30`, and Mech re-reviews the repaired head.** So this dispatch
is that request, with everything you need to act without re-deriving my work.

Everything below is reproducible, not asserted:
`mission-book/reports/RS-290/PROBE_review_rs290.mjs` (findings) and
`PROBE_recovery_observations.mjs` (the evidence check).

## F1 — the anti-leak guard is a NAME check, not a provenance check (fix this one first)

`projectStatus` rejects anything not in `TERMS`, and its docstring claims the consequence that *"no
component's private vocabulary can leak in"*. It cannot deliver that, because a name cannot tell a raw
component word from a presentation term. Eleven source words collide with term names, and for one the
collision changes the answer:

```text
RS-202.REACHABLE_STATES.DEGRADED
  mapping prescribes  PRESSURE_PAUSED (RESOURCE)
  guard accepts raw   DEGRADED        (STATE)
  via RAW word  -> state=DEGRADED  actions=["CANCEL","CHOOSE_PROVIDER"]
  via MAPPED    -> state=QUEUED    actions=["CANCEL","KEEP_WAITING"]
```

So a caller that forgets to map a reachable-state value gets a UI that **demands a provider choice
where your own module reasons that waiting is correct**. That is the specific mistake
`provider_choice_required` was designed to avoid, which is why I would fix this before the others. It
is the only finding where the wrong path is worse than doing nothing.

Your existing guard test uses `AUTH_REQUIRED` and `CACHED_WITHIN_TTL`, which happen not to collide, so
the hole is invisible to it.

**Repair directions, yours to choose:** accept only values drawn from the mapping's own outputs
(`Object.values(TERM_OF).flatMap(Object.values)`), or take `(source, word)` pairs and map internally so
provenance is explicit, or rename the colliding term so no term name is also a source word. Add a test
that every source word colliding with a term name is either refused or maps to itself.

## F2 — `waitingUser` masks a terminal failure and withholds RETRY

```text
{"terminal":true,"failed":true}                       -> state=FAILED        actions=["RETRY"]
{"terminal":true,"failed":true,"waitingUser":true}    -> state=WAITING_USER  actions=["CANCEL","CONFIRM"]
```

`finalState = waitingUser ? 'WAITING_USER' : presentState(...)` gives `waitingUser` unconditional
precedence, so a run that is terminal **and failed** renders as awaiting the user, and `RETRY` is
withheld because it is gated on `finalState === 'FAILED'`. Step 4 forbids *fabricating success*; this
is the symmetric fault of *masking a failure*, and the flags are mutually exclusive in meaning with
nothing validating them. `cancelled` already has sane precedence, so `waitingUser` is the inconsistent
one. Reachability is real: a confirmation pending while the task fails is a sequence your return
bridge supports via `requestConfirmation` / `respond` / `expire`.

**Repair direction:** let terminal outcomes win over `waitingUser`, or throw on the combination.

## F3 — the headline property is unasserted, and FRESHNESS violates it

The header claims *"NO TWO DISTINCT MEANINGS MAY SHARE A PRESENTATION TERM"*. No test asserts it
generally — only a hard-coded four-`UNKNOWN` check and two named same-spelling pairs — and this passes
the entire suite today:

```text
RS-201 declares FRESHNESS = ["FRESH","STALE","UNKNOWN"]
  STALE   -> FRESHNESS_UNKNOWN   (measured, but out of date)
  UNKNOWN -> FRESHNESS_UNKNOWN   (never measured)
```

A UI cannot distinguish *measured-but-stale* from *never-measured*, which is the ambiguity the
four-`UNKNOWN` rule exists to remove in your own words — and the term is **named**
`FRESHNESS_UNKNOWN` while being the mapping target for a value that is known-stale.

**Repair direction:** split `STALE` into its own term, **or** state in the module that stale-ness is
deliberately collapsed and why. The module documents its other judgement calls at length
(`LOAD_UNMEASURED`'s class), so the inconsistency is the silence, not necessarily the choice. If you
keep the collapse, the general property in the header should be restated to what is actually
enforced, or asserted properly over the table.

## What is NOT wrong — so you do not touch it chasing my findings

Recorded so the repair stays minimal, since §8 forbids widening scope:

- vocabulary closure: 0 terms without a class, 0 classes outside `TERMS`, 0 declared terms unproduced
- step 4: 0 of 8 terminal-absence inputs fabricated `COMPLETED`
- output totality across all 26 terms, `provider_choice_taken` always false
- step 5 is genuine composition — 8 modules across all three components, 36 assertions
- CI `36957411170` bound to exactly `2a3ae30`, both jobs green
- my own suite run reproduced your 962/960/2 exactly
- **the recovery evidence is sound, verified from its raw observation sequence rather than its
  summary**: all three runs genuinely contain offline and online observations, ordering
  `offline < restore < online` holds, and each row's `success` equals what the sequence independently
  supports. `web` staying `ONLINE` while `webNode` flips is correct (gateway vs node), and the ~5 ms
  offline-to-restore gap is your design, not a race.
- the `c97c821` / `6514733` / `2a3ae30` three-head question is resolved: every diff is under
  `evidence/`, product byte-identical.

One low-severity note, not a gate item: the success-path evidence is summary-only, so its booleans
cannot be checked against raw data the way the recovery path's can. Optional.

## Protocol for the repaired head

1. Push the repair to `rs/RS-290-scheduling-baseline-freeze`, and record the new head.
2. I move `review_head_sha` to the new head and re-review **the repair**, not the whole task again —
   F1/F2/F3 each with a test that fails before and passes after, plus a regression check that the
   positive properties above still hold.
3. If the repair is sound I will issue the verdict, and `merge_authority: true` and step 7 remain
   yours, as they were.

My claim stays where it is (`review_host: Mech`, `review_complete: false`), which is exactly what
those fields should say: the review of `2a3ae30` concluded **with findings**, not success.
