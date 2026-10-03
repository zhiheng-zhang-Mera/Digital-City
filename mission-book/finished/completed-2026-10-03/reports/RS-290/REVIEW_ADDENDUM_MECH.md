# RS-290 — REVIEW ADDENDUM (Mech): step 5 assessment, gate audit, and E2E evidence verified from raw observations

```text
REVIEWER = Mech   REVIEWED HEAD = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529
VERDICT  = unchanged — DEFECTS FOUND (F1-F3), NOT REVIEW_COMPLETE
```

Continues `REVIEW_FINDINGS_MECH.md`. This addendum closes the two checks that record named as
outstanding (step 5 vacuity, the completion-gate audit) and adds one verification the earlier record
did not attempt: reading the recovery evidence's **observation sequence** rather than its summary
booleans.

## Step 5 — the matrix is real composition, with one assertion that cannot fail

Verified structurally, not by reading the author's description: the matrix imports **8** component
modules spanning all three components (`registry`, `availability` from RS-201; `pressure`, `routing`,
`rescan`, `hysteresis`, `assignment-guard` from RS-202; `createReturnBridge` from RS-203), carries 36
assertions over 6 tests, and passes 21/21 together with the conformance suite. Each test crosses at
least two components, so the claim that it proves *composition* rather than re-running component
suites holds. Step 5's five named areas are all present: concurrency, lease/idempotency,
offline/reconnect, provider flap, end-to-end composition.

**One low-severity observation.** In test 5:

```js
for (const entry of dto.providers) {
  assert.ok(entry.class === 'PERMITTED' || entry.class === 'STRUCTURAL' || entry.class === 'RESOURCE' || entry.class === 'KNOWLEDGE');
  assert.equal(typeof entry.resolves_by_waiting, 'boolean');
}
```

`entry.class` is `TERM_CLASS[term]`, and every value in `TERM_CLASS` is one of those four strings by
construction; `entry.resolves_by_waiting` is assigned `TERM_CLASS[term] === 'RESOURCE'`, which is
always a boolean. **This assertion cannot fail for any input the projection can accept**, so it adds
no protection — it restates the table's shape rather than testing behaviour. It sits inside a test
that *does* make a strong claim (the exact 11-key DTO surface at the end), so this is a defect in a
test's strength, not in the product. Recorded because "a test that cannot fail is not evidence" is a
standard this review is applying to the author, and it applies to the parts that pass too.

## Completion-gate audit — item by item, against evidence rather than the author's summary

| gate item | verdict | basis |
|---|---|---|
| RS-201/202/203 development + review complete | **MET** | all three `REVIEW_COMPLETE` in frontmatter, independent reviewers |
| Unified scheduler vocabulary (step 2) | **MET WITH FINDINGS** | one vocabulary delivered and closed over its sources; **F3** shows one meaning collapsed and the headline property unasserted |
| Step 3 presentation DTO | **MET WITH FINDINGS** | DTO present, output vocabulary total over all 26 terms; **F1** and **F2** are defects in it |
| Concurrency / recovery / idempotency green | **MET** | matrix above, genuinely cross-component |
| Real dual-device E2E, both paths | **MET** | CI binding + evidence verified below |
| Step 6 refresh + full CI | **MET** | main unmoved from the claim-time baseline (zero drift, measured); CI green on the exact head |
| Step 7 merge + `RESCHEDULING_BASELINE_FROZEN` | **WITHHELD** | correctly withheld pending this Review |

So the gate is met **except** in the two places that depend on this Review's verdict, and the verdict
is that three defects exist. The gate is therefore **not** dischargeable at `2a3ae30`.

## The recovery evidence, verified from its raw observations

This is the strongest independent check in the review, because it tests the claim against the
underlying record instead of accepting `success: true`. All three runs, decoded:

```text
run 1  offline 02:20:02.357Z  restore 02:20:02.362Z  online 02:20:12.155Z
  obs[0] android=["ONLINE","ONLINE"]  web=ONLINE  webNode=OFFLINE
  obs[1] android=["ONLINE","OFFLINE"] web=ONLINE  webNode=OFFLINE   <- offline condition met here
  obs[2] android=["ONLINE","ONLINE"]  web=ONLINE  webNode=ONLINE    <- recovery condition met here
```

Run 2 and run 3 are identical in shape. Findings:

- The sequence **genuinely contains** an offline observation and an online observation, and each
  row's `success` equals what the sequence supports (`sawOffline && sawOnline && historyPreserved &&
  cityIdentityPreserved`) — computed independently for all three runs. So the summary booleans are
  faithful to the underlying record, which is the property worth checking.
- Ordering holds in every run: `offlineObservedAt < restoreAt < onlineObservedAt`.
- The pilot's offline condition for `kind: 'node'` requires `android.includes('OFFLINE')` **and**
  `webNode === 'OFFLINE'`; only `obs[1]` satisfies both, and that is where `offlineObservedAt` lands.
  The recovery condition requires two `ONLINE` labels, no `OFFLINE`, and both surfaces `ONLINE`; only
  `obs[2]` satisfies it. So the pass is not an artefact of a loose predicate.
- `web` stays `"ONLINE"` in all three observations while `webNode` flips. That is **correct, not a
  defect**: the web page's connection chip tracks the gateway, which never went down, while the device
  card badge tracks the node, which did.
- The ~5 ms gap between `offlineObservedAt` and `restoreAt` is **by design**, not a race: the pilot
  records the offline timestamp and then immediately calls `restart`, so the gap measures the pilot's
  own transition, not the outage.

**One observation about evidence strength, not a defect.** The success path
(`task-regression.json`) is summary-only — boolean flags plus the 7-event lifecycle and the artifact
hash — and carries no observation sequence, so its booleans cannot be checked against raw data the way
the recovery path's can. Given the recovery path was made to carry its observations, recording the
success path the same way would make both halves equally auditable. It is a suggestion, not a gate
failure: the workbook asks the E2E be run and published inspectably, and it is.

## Disposition, unchanged, and put to the Owner

The three findings stand, and the repaired head will need `review_head_sha` moved and a re-review.

**One decision is not mine.** §12 requires an Owner ruling or a superseding workbook to change role
boundaries, and this situation may need one: repair is the development host's, and Alien has not
responded since the findings were published. §3 does permit a reviewer to *"直接修复范围内缺陷"*, so I
*could* repair — but then the reviewer authored part of the artefact, and §3's whole purpose is that
the verdict comes from a host that did not write it. I am therefore not choosing between those
options unilaterally. Put plainly to the Owner, the choice is:

1. **Alien repairs** at `2a3ae30` (preserves host independence; needs Alien to act), or
2. **Mech repairs** under §3's explicit permission, with the independence caveat recorded and the
   final verdict on the repaired head taken by a host that did not write the repair, or
3. the Owner rules the findings out of scope for the freeze and accepts the task at `2a3ae30` with
   F1-F3 recorded as known limitations.

I recommend **1**, falling back to **2** only if Alien does not act, because F1 in particular produces
a worse user outcome than doing nothing and should not be frozen as-is.
