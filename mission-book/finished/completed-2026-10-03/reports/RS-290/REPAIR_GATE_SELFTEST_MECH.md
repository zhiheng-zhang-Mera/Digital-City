# RS-290 — REPAIR GATE SELFTEST (Mech): the gate fails at 2a3ae30 and PASSES on a repaired copy

```text
REVIEWER = Mech   REVIEWED HEAD = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529
PURPOSE  = positive control for PROBE_repair_verification.mjs
```

A gate that can only fail is not a gate. This records the control that shows the acceptance gate
actually discriminates, and it incidentally proves the three findings are repairable with a small,
local patch — which matters, because a finding nobody can fix is a finding nobody can act on.

## The gate discriminates: same script, two trees

```text
UTOPIA_ROOT=<unrepaired 2a3ae30>   ->  6/9 checks pass, exit 1   F1 FAIL, F2 FAIL, F3 FAIL
UTOPIA_ROOT=<repaired copy>        ->  9/9 checks pass, exit 0
```

The six regression checks pass in **both** trees, which is the property that makes the gate useful: it
separates the three defects from the behaviour that was already sound, so a repair that breaks
something previously good fails there rather than passing silently.

Author's own suites on the repaired copy: **21/21 pass, unchanged** — so the repair does not require
weakening or rewriting the existing tests.

## The worked patch — 10 insertions, 8 deletions, one file

All in `contracts/rs-presentation-contract-v1/presentation.mjs`:

| # | finding | change |
|---|---|---|
| 1 | F3 | `STALE: 'FRESHNESS_UNKNOWN'` → `'FRESHNESS_STALE'`; add `FRESHNESS_STALE` to `TERMS` and `TERM_CLASS` as `KNOWLEDGE` |
| 2 | F1 | rename the **term** `DEGRADED` → `DEGRADED_STATE` in `TERMS`, `TERM_CLASS`, all three mapping targets, and the one `presentState` read; the presentation **state** `DEGRADED` is untouched because only the term collided |
| 3 | F2 | `waitingUser ? 'WAITING_USER' : presentState(...)` → `(!terminal && waitingUser) ? 'WAITING_USER' : presentState(...)` |

Offered as a reference, not a prescription: it is the smallest change I could find that satisfies the
properties, and Alien owns the actual repair. Route 2 below is equally sound and needs the gate
extended.

## CORRECTION — the first repair direction I gave was wrong, and I measured it

My first dispatch suggested *"accept only values drawn from the mapping's own outputs
(`Object.values(TERM_OF).flatMap(Object.values)`)"*. **That fixes nothing.** Measured:

```text
outputs contains DEGRADED                                        : true
source words that are also declared TERMS                        : 10
  REGION_UNSUPPORTED, CREDENTIALS_MISSING, SERVICE_FAULT, USER_DISABLED, POLICY_EXCLUDED,
  AT_CAPACITY, PRESSURE_PAUSED, SESSION_CONGESTED, DEGRADED, QUEUED
of those, also mapping outputs (an outputs-only guard accepts)   : all 10
```

`DEGRADED` is a mapping output — it is produced by `PROBE_OUTCOMES.CACHED_DEGRADED`,
`ROUTE_STAGES.EXHAUSTED` and `REMOTE_STATES.RECOVERING` — so an outputs-only guard accepts the raw
word and F1 still fails. Every colliding word has the same property. The suggestion is **withdrawn**
and the request corrected; had Alien implemented it, it would have looked like a fix and changed
nothing, which is the worst outcome a review can hand over.

I reached for that suggestion by reasoning about the guard instead of measuring the table, in the same
round I was documenting that exact failure mode in Alien's work. The measurement took one command.

## My own tooling errors in this round, recorded

Both were caught by execution rather than by reading, which is the only reason they did not ship:

1. The gate's **first F3 draft repeated my round-50 over-reporting**: it asserted that no two words of
   one vocabulary may share a term, which flagged all 13 merges and would have demanded Alien remove or
   declare intended category merges (`ABSENCE_CODES → ABSENT/REMOVED`,
   `FRESH_PROBE/CACHED_WITHIN_TTL → SELECTABLE`) — widening the repair past the observed defect that §8
   forbids. Rescoped to the FRESHNESS pair only; the other twelve now print as `INFO`.
2. The patch script counted matches with `str.match(re).length`, which for a **non-global** regex
   returns the match array **including capture groups** — so a correct 1-match/4-group pattern read as
   `5` and my own guard rejected it. Fixed to count with `matchAll`. A first version also used `\s*`
   between line anchors, and `\s` spans newlines, so it matched unrelated occurrences spread across the
   file; both are noted at the call site.

## What this changes for the disposition

Nothing about the verdict: `review_complete` stays `false` and the repair is still Alien's per the
Owner ruling. What it changes is that the repair is now a bounded, proven-small change with an
acceptance gate Alien can run before pushing, rather than an open-ended request.
