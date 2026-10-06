# RS-290 — INDEPENDENT REVIEW (Mech) — progress record

```text
REVIEWER      = Mech            (CONSTRUCTION_RULES §3: different physical host from the developer)
DEVELOPER     = Alien
REVIEWED HEAD = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529   (pinned at claim time)
CLAIM         = pushed b5b405d — review_host/review_head_sha only, per §2 step 3
STATUS        = IN PROGRESS — this is a progress record, NOT a verdict
```

Per §3 a Review must *independently find problems*, not sign off or restate the author's tests. This
record covers the reconciliation and evidence checks completed so far; the substantive falsification
of steps 2, 3 and 5 and the step 7 merge check remain and are named at the end rather than implied.

## Claim

`review_host: Mech`, `review_head_sha` pinned to the full SHA. `review_complete` deliberately left
`false` and `status` left `IN_PROGRESS`: no `IN_REVIEW` value exists anywhere in this repository's
status vocabulary (the values in use are `NOT_STARTED`, `IN_PROGRESS`, `REVIEW_COMPLETE`,
`UI_BASELINE_FROZEN`, `REVISION_REVIEW_COMPLETE_PASS_WITH_REPAIRS`), and inventing one would be
inventing a state. §3 eligibility re-checked rather than assumed: developer `Alien` ≠ reviewer `Mech`,
and Alien has not reviewed its own development.

## §7 reconciliation — PASS

Every §7 binding checked against the authority rather than against the workbook's own summary:

```text
gh run view 36957411170
  headSha    = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529   == development_head_sha   MATCH
  headBranch = rs/RS-290-scheduling-baseline-freeze       == development_branch     MATCH
  status     = completed   conclusion = success
  jobs       = gateway-web success | android success       == development_ci "...-success-android-and-gateway-web"
```

So the recorded CI claim is bound to the exact reviewed head and is green on both jobs. No
`EVIDENCE_POINTER_MISMATCH`.

## Independent test run — reproduces the author's number exactly

Run on the claimed head in my own worktree, not taken from the author's report:

```text
node --test tests/*.test.mjs   ->  962 tests / 960 pass / 2 fail
```

That is exactly the figure Alien recorded, and the two failures are the pre-existing
document-reader `CORRUPT_INPUT` pair (`document bytes flow through real readers…` and
`Bridge Road extraction preserves all six published document retrieval digests`), which I had already
shown reproduce on the untouched base `44b52e2` with a clean tree. So they are neither introduced nor
fixed by this task.

## Evidence inspection — the fields do support the claims

Both E2E artefacts are committed outside `.runtime/` and are therefore actually openable, which is the
RS-203 lesson applied.

**Recovery path** — `evidence/raw/mission-book/RS-290/node-recovery.json`, 3 rows:

```text
run 1  success=true  installedApkMatchesLocal=true  historyPreserved=true  cityIdentityPreserved=true  offline 02:20:02.357Z -> online 02:20:12.155Z  obs=3
run 2  success=true  installedApkMatchesLocal=true  historyPreserved=true  cityIdentityPreserved=true  offline 02:20:31.254Z -> online 02:20:41.040Z  obs=3
run 3  success=true  installedApkMatchesLocal=true  historyPreserved=true  cityIdentityPreserved=true  offline 02:20:59.648Z -> online 02:21:09.559Z  obs=3
```

`onlineObservedAt` is populated in all three, which is the field that was null in every failing
attempt; the author correctly identified it as the discriminator between *observing* the restore and
*inferring* it. Three runs on a `kind: node` fault, three offline captures committed alongside.

**Success path** — `evidence/raw/mission-book/RS-290/task-regression.json`:

```text
state=COMPLETED  success=true  installedApkMatchesLocal=true
androidShowsTaskAndCompletion=true  webShowsTaskAndCompletion=true
androidResultMatches=true  webResultMatches=true  checkpointAvailable=true
artifactSha256=815832a2a331b18c499b8022a6531849078d7016784a688e93ab6b8f0385d590
eventTypes=[COMMAND_ACCEPTED, TASK_CREATED, TASK_ASSIGNED, TASK_STARTED,
            TASK_CHECKPOINTED, TASK_CHECKPOINTED, TASK_COMPLETED]
```

The seven-event lifecycle is present in full and the artifact hash is cross-checked on both surfaces.

## The one real reconciliation question, and it RESOLVES in the author's favour

Three different code SHAs appear across the evidence, which under a literal §7 reading looks like a
mismatch and which I checked rather than assumed:

```text
success-path evidence codeSha = c97c8216ca8bfdb3112c64b8f856ce804b6d653b
recovery-path evidence codeSha = 6514733
recorded development head      = 2a3ae30
```

**They are the same product code.** Every change between any pair of them is under `evidence/`:

```text
git diff --stat c97c821 6514733  -- . ':(exclude)evidence'   ->  0 lines
git diff --stat 6514733 2a3ae30  -- . ':(exclude)evidence'   ->  0 lines
git diff --stat c97c821 2a3ae30  -- . ':(exclude)evidence'   ->  0 lines
```

The only intervening commits are `6514733` and `2a3ae30`, each of which adds evidence files
(`e2e-pipeline.ps1`, `e2e-recovery.ps1`, the offline captures, the two JSON results) and nothing else.
So the product under both E2E paths is byte-identical to the product at the reviewed head, and the
carry is sound for the same reason a byte-identity carry was accepted on UI-190. The three SHAs are
not a defect; they are the artefact of committing evidence after running it.

Worth stating plainly since it cuts against the author: this is exactly the kind of thing that would
have become a review finding had the product diff been non-empty, and the author could have removed
the ambiguity by recording the byte-identity argument in the workbook. I raised it with Alien early
(`DISPATCH_MECH_TRIGGER_CORRECTION_AND_HEAD_BINDING.md`) so it could be one line there rather than a
round trip here.

## Still to do before a verdict — named, not implied

1. **Step 2 falsification** — attempt to break the unified presentation vocabulary: confirm no two
   distinct meanings share a presentation term, and independently confirm the deliberate
   `STRUCTURAL_REASONS` / `RESOURCE_REASONS` partition was preserved rather than flattened. The
   author records nearly flattening it and warns that a naive dedup would.
2. **Step 3 falsification** — attempt to reach `COMPLETED` without an explicit terminal flag, and
   attempt to get a raw component word through the projection instead of a mapped presentation term.
3. **Step 5 falsification** — probe the composition matrix for assertions that would still pass if a
   component were broken (a test that cannot fail is not evidence).
4. **Step 7** — confirm the merge and `RESCHEDULING_BASELINE_FROZEN` declaration are withheld pending
   this Review, and that `merge_authority: true` is exercised by the correct host afterwards.
5. **Gate audit** — walk the workbook's stated completion gate item by item against evidence, rather
   than against the author's summary of it.

No verdict is recorded here. Nothing in this record should be read as `REVIEW_COMPLETE`.

语言配对 / Language pair: [原文 / Source](./REVIEW_PROGRESS_MECH.md) · [译本 / Translation](./zh-CN/REVIEW_PROGRESS_MECH.md)
