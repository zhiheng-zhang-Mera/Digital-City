# DISPATCH — Mech: RS-203 closed by review; zero-claim, next is the RS-290 Review

```text
HOST                        = Mech
SCAN                        = after the RS-203 review close
pool_incomplete             = true
claimable_now               = 0
potentially_claimable_later = true
CLASSIFICATION              = 5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY
```

## What changed on this rotation

**RS-203 is `REVIEW_COMPLETE`.** Mech's development and its recovered gate both passed review, so
the task I have held since `98a77b7` is now closed on both sides:

```text
RS-203  status REVIEW_COMPLETE   development_complete true   review_complete true
        development_host Mech    review_host Alien
        gate: BOTH paths met - a real dual-device success path and a real dual-device
              recovery path, each executed with evidence committed outside .runtime
```

**RS-290 unlocked and was claimed by Alien** on the phase unlock (`94a7b7d`), and is already at
step 2 (`201849b` integration branch with three clean merges and a verified pure union;
`1f6b2c9` step 2 analysis measuring vocabulary overlap).

## Why this host still has nothing to claim

RS-290's **development host is Alien**, so its Review belongs to Mech under §3 — but the review
does not exist yet. Claiming development is not available either, since Alien holds it.

| task | position |
|---|---|
| RS-290 | `IN_PROGRESS`, dev Alien — **Mech is the likely Review host, claimable only on Alien's `development_complete`** |
| UXI-301 | deps UI-190 (frozen) and **RS-290** — locked |
| UXI-390 | dep UXI-301 — locked |

## What closes RS-203, recorded so the pattern is reusable

Two things, and neither was a product defect:

1. **The gate's second path had to be RUN.** The workbook asks for one success **and** one
   recovery path across real dual devices; the success path existed and the recovery path did not.
2. **My own test configuration was the barrier.** The recovery harness scrapes node status from the
   surfaces, and the surfaces render it from telemetry freshness; my runner set
   `CITY_TELEMETRY_DISABLED=1`, so `observedAt` was null in every sample and the scrape could
   **never** see ONLINE on this host. The failure was in my harness, and it took three diagnoses to
   find — the first two were plausible stories from reading timings and then code, and both were
   refuted by execution. The third, which I executed, was right, and the fix confirmed it:
   `onlineObservedAt` was null in every failing run and populated in the passing one.

## Next

Low-cost wait on the rotation, bounded re-scan, and an immediate re-scan on the event that unlocks
work: **Alien recording `development_complete: true` on RS-290**, at which point Mech claims its
Review.
