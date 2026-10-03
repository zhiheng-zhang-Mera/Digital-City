# VERIFICATION — Mech: gate 2, five-dimensional load vs partial telemetry, verified with my own inputs

```text
FROM = Mech (review host)   GATE = 2, "five-dimensional load semantics consistent with code and tests"
TREE = 269aa969a285b78283ed6f7bd3b0cf432cfdcbd9
RESULT = PASS 20/20
```

The dispatch asks me not to rely on the author's fixture, so the translation was probed with **boundaries I
chose**, the pressure semantics with **numbers I chose**, and the pipeline with a **real node**.

## A. The translation, with my own boundary inputs — 9/9

```text
[PASS] 0% cpu is ACCEPTED as an observed zero, not discarded as falsy          -> {"cpu":0}
[PASS] 100% cpu is ACCEPTED (upper boundary inclusive)                        -> {"cpu":1}
[PASS] 101% is REFUSED rather than clamped or trusted                         -> null
[PASS] a negative cpu is REFUSED                                              -> null
[PASS] a STRING cpu is REFUSED (not coerced)                                  -> null
[PASS] memory with totalBytes 0 is REFUSED rather than dividing by zero       -> null
[PASS] memory with used > total is REFUSED                                    -> null
[PASS] telemetry reporting ONLY gpu yields NO vector - nothing is invented    -> null
[PASS] real-shaped telemetry yields EXACTLY cpu+memory, never zero-filled     -> {"cpu":0.5,"memory":0.25}
```

The `0` and `100` boundaries matter: a falsy-zero bug would silently drop an idle reading, and an inclusive
upper bound is the difference between "saturated" and "impossible".

## B. The pressure semantics on a partial vector — 6/6

```text
[PASS] one observed dimension is KNOWN, because the policy minimum is 1        known=true pressure=0.9
[PASS] unobserved dimensions are NAMED rather than silently zeroed             missing=["memory","gpu","io","network"]
[PASS] the vector is marked PARTIAL                                            partial=true
[PASS] a saturated dimension BINDS: idle ones do not dilute it                 binding=cpu pressure=0.9 mean=0.220
[PASS] an EMPTY vector is UNKNOWN, not idle                                    known=false pressure=null missing=5/5
[PASS] the fleet really has FIVE dimensions                                    ["cpu","memory","gpu","io","network"]
```

The binding-not-averaging result is the substantive one: `cpu 0.9` with four `0.05` dimensions yields
`pressure 0.9`, not a diluted `0.22`. Averaging would have scheduled a saturated device.

## C. A real node through the live pipeline — 5/5, plus an observation

```text
[PASS] a real node reporting real telemetry yields a load vector                {"memory":0.5715}
[PASS] it carries at least one REAL dimension and NONE the node never sends
[PASS] every dimension present came from telemetry the node actually reported
[PASS] the fleet judges it with unobserved dimensions named                     known=true partial=true
[PASS] the judgement never claims a full five-dimension reading                 observed 1 of 5

OBSERVATION: the live node's raw cpu field was {"usagePercent": null}
```

**The reference node's cpu telemetry is intermittently absent**, and `loadFromTelemetry` refuses it rather
than coercing it, so the vector degrades to memory-only and is still judged KNOWN because the policy minimum
is 1. That is the honest behaviour the erratum claims, and it is confirmed here on real telemetry rather than
on a fixture.

**It is also the mechanism behind the author's dual-host failure.** The B-side script's telemetry assertion is
`cpu finite OR memory finite`, so it passes on memory **while cpu is null** — which is how a run can believe
the alternate is ready and decline before it is genuinely available.

**Correction to my own first attempt at this check:** I originally asserted the live vector must carry BOTH cpu
and memory and it failed. That assertion was my guess about the design, not the design's promise; the raw
reading showed why. The assertions above test what the code actually guarantees, and I am recording the
superseded version rather than quietly replacing it.

## What this does not cover

Gate 6 (the result returning to the ORIGINAL surface, i.e. the UI-level half) is not covered here, and gate 11
(`POST_COMPLETION_REENTRY.md`) is a step-7 deliverable that does not exist yet, so it is pending rather than
verified.

## Evidence

`mission-book/reports/UXI-391/review-by-mech/load-semantics-by-mech.json` — the live vector, the live pressure
judgement, the five dimensions and every assertion above.
