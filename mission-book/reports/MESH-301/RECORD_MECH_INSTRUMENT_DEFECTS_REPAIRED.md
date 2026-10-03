# RECORD — MESH-301: Mech's two instrument defects are repaired, and gate 5's proof is Mech's own

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ f1eaad8
```

## 1. Both defects Mech found in the shared merge are fixed — and the second one mattered

Mech reported them from `RECORD_MECH_STEP52_MECH_TO_ALIEN_AND_MERGE_SKEW_DEFECT.md` after using the instrument
**as documented**, which is exactly how an independent reviewer earns its keep.

**Defect 1 — `--skew` could not be combined with positional receipt filenames.** The positional list was "any
argv not starting with `--`", which swallowed the *value* of the preceding flag: `merge --skew
Mech-Win-Web=-1001 --out x.json mech.jsonl` handed the skew's value to `readFileSync` as if it were a receipt.
Fixed with a walker that skips each known flag's value. **My first attempt at the walker started at index 2
while `argv` was already sliced**, so it skipped nothing and opened a file named `5000` — found by running it,
which is now the fifth time this round's instruments have been corrected by execution rather than by reading.

**Defect 2 — and this is the one that mattered.** `--skew` defaulted to `0`, so a table built **without**
declaring an offset still printed `CONVERGED` while a surface's clock offset sat in the latency column wearing
the shape of a latency. Mech measured a surface whose raw numbers scored as converged at a ~1 s offset; on a
5 s window that is a **false pass with a number attached**, the worst kind because it looks like evidence.
Combined with defect 1, the one documented way to declare the offset was the way that broke — so the honest
path failed and the dishonest one passed.

The merge now **refuses to read an undeclared clock**: that surface's seqs become `UNMEASURED` and the verdict
becomes `INCOMPLETE`. `--skew <surface>=0` is how an operator states the assumption explicitly, so a run can
never be silent about it.

```text
verified:  merge --skew PERM00=592 --skew Alien-Host=0 <two positional receipts>   -> both surfaces in the table
verified:  merge --file one.jsonl            (no --skew)                          -> INCOMPLETE, not CONVERGED
```

## 2. Gate 5's evidence is Mech's, not mine — and that is the stronger form

The previous round established that Mech closed step 5.2 from its own Web surface. Mech's record now confirms
it independently, and its receipt is on the branch at
`evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-strict-target.jsonl`. So gate 5 is met with **two
directions produced by two physical hosts and two control surfaces**, and with the reviewer holding its own raw
evidence rather than citing mine.

Mech also recorded the right boundary: **gate 5.2 being closed is not gate 10.** No Formal Review, no
review-head CI, no merge, no terminal marker.

## 3. Gate status

```text
 2/3/4/5/7   MET
 6           live City 8/8 negative controls; Mech must rebuild them independently, and Mech's record shows
             it is doing so with its own instruments rather than re-running mine
 8           NOT MET - all three surfaces have now been exercised, never in ONE measured window
 9           MET on re-convergence (stale -> gap -> resync to the server's own max), with the pre-stale policy
             question from the previous record still open and still the Owner's to read
10-14        NOT STARTED
```

## 4. Next, unchanged and now unblocked

```text
1. ONE window holding Alien Web + Mech-Win-Web + PERM00 simultaneously -> gate 8. Mech's record asks to be told
   when, and offers to re-run its surface for the table; its receipt is already in the merge vocabulary, so the
   three-surface table is a scheduling problem now, not a technical one.
2. Mech's Formal Review on a frozen review head -> gates 10-14.
```
