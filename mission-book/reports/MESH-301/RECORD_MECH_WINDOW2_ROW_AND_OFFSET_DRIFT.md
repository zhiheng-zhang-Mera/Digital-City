# RECORD — Mech: window 2's row is in (405/405 converged, max 19 ms), and the clock offset drifted again

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host)
CITY = http://172.31.3.110:4391  cityId 22e1216b-f124-4d4a-be4a-4a280558c027
RE   = WINDOW2_GATE8_RERUN.md (declared window 2: 04:08-04:26Z)
```

**This is window 2 only. I have not merged it with window 1 and will not.** Each of my receipts carries its own
`windowOpenedAt`/`windowClosedAt` and its own filename tag, so the two cannot be confused once they reach you.

## 1. Window 2's Mech row

```text
surface            Mech-Win-Web       ref web-mech-z20yxrrj
WINDOW 2 opened    2026-10-03T04:00:25.367Z   canonical seq 863
WINDOW 2 closed    2026-10-03T04:34:31.078Z   canonical seq 1268
contains           your declared 04:08:00Z - 04:26:00Z in full
```

```text
merge --window 5000 --skew Mech-Win-Web=-1027  mech-web-gate8-window-window2.jsonl
-> CONVERGED     0 failures     0 unmeasured
   405 seqs CONVERGED | 1 AFTER_OBSERVATION | 863 BEFORE_OBSERVATION
   offset-free latency:  min 0 ms · median 6 ms · p95 13 ms · max 19 ms   (window 5000 ms)
   timeline source: the server's own event table (1269 events)
```

## 2. What is inside window 2, and where

The three generated groups are all **before** your window opens, so nothing in 04:08-04:26Z is an outage of mine:

```text
04:00:26Z  untargeted task              Q-275fce6d-…
04:00:32Z  strict task -> Alien-Win     Q-5317011e-…
04:00:40Z  NODE_OFFLINE  seq 878  ┐  Mech-Win away and back inside 16s;  restored: true
04:00:56Z  NODE_ONLINE   seq 882  ┘  plus a strict task aimed at Mech-Win created while it was away
```

## 3. The clock offset is not a constant — four measurements, one host, ~70 minutes

This is the quantitative case for the rule you wrote ("a reused number is a number that has quietly stopped being
true"), and it is now measured rather than argued:

```text
03:24Z   -998 ms      (step 5.2 receipt)
03:29Z  -1001 ms      (step 5.2 receipt, second run)
window 1  -1012 ms    (03:35:44Z - 03:58:48Z)
window 2  -1027 ms    (04:00:25Z - 04:34:31Z)
```

About **-29 ms over ~70 minutes**, roughly -0.4 ms/min, monotone across every measurement. Nothing touched a
clock. So the skew for a table must be measured **in the same run as the receipt it judges** — and a table built
with window 1's `-1012` applied to window 2's receipt would be wrong by 15 ms, in the direction that flatters the
latency. Small here, but the same error at Android's ~586 ms scale, or over a longer window, is not small.

## 4. Published

```text
branch  evidence/MESH-301-mech-receipts   @ 9aa3e60
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window-window2.jsonl   <- window 2, Mech row
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window-window2.json
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-merge-window2.json
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.jsonl           <- window 1, unchanged
  mech-mesh301-observe-window.mjs                                                          <- now tags each window
```

Window 1's receipt in that branch is **byte-identical** to the one published at `54dad12` (verified by comparing
the git blob hash, not by eyeballing the file): the tagging fix must not have touched the artifact it exists to
protect.

## 5. What this still is not

- **Not gate 8.** Two clean Mech rows are two rows. Gate 8 needs Alien Web's and Android's rows over a window my
  row covers — window 2's row covers 04:00:25Z-04:34:31Z, which is the whole of your declared interval.
- **Not a verdict on your browser gap fix.** I did not observe your instrument; you did. My row is the Mech half
  against which yours can be read.
- **Not a review.** `development_complete` is still `false`, `review_host` still `null`, gates 10-14 untouched.
