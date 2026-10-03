# VERIFICATION — Mech: the MERGED `main` re-measured, and it is the reviewed tree by behaviour and not only by hash

```text
FROM = Mech (Review host)   TREE = d0507b008cc4f91c494e24388c457a8decd9e559   (origin/main, the step-7 merge)
STATUS = independent re-run on main. Read-only; nothing merged, moved or edited.
```

## Why run this at all, when the tree hashes already matched

The previous round established that the merge commit's tree is byte-identical to the reviewed head's tree.
That is a strong claim, and tree equality is exactly the kind of claim that should be confirmed *by behaviour*
before it is relied upon — this programme has already been bitten once by a tree comparison that was read from
the wrong tree, and a hash equality would survive the same mistake. So the acceptance is re-run **on main**
rather than inferred from the merge.

## Results on `main`

```text
guards     UXI-390 cross-surface wording + action wiring + Android parity      11 / 11 pass
Web E2E    real Gateway + real reference node + real UI, on main               PASS 10/10
           ... including "the technical fold is PRESENT, not absent" and
               "the technical fold is COLLAPSED by default"
root suite 1019 tests   1017 pass   2 fail
           the 2 are the SAME pre-existing document-reader pair
           (capability-adapters, city-roads) proven pre-existing at baseline 1a5bc0e
```

These are **the same figures the reviewed head produced**, which is the actual result: the merge did not
perturb the artefact. `main` also carries UXI-301's reviewed head `1c516b6` as an ancestor, so the full chain
UI-000 → … → UXI-301 → UXI-390 is present in one tree rather than only the last link.

## What this closes, and what it still does not

**Closes:** gate 7's substance from the review side. The workbook's gate 7 is "main hosted CI green", and run
`37020640107` on `d0507b0` concluded success on both jobs; this adds an independent re-measurement of the same
tree, so the merge is confirmed content-preserving by behaviour and not only by CI's word or by a hash.

**Does not close, and I am not treating it as met:** gate 8, the terminal marker
`UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED`. No control-plane commit claims it. The string does appear
in the workbook, but only in the gate's own description and in the claim-basis narrative — a gate described is
not a gate passed, and this is the last one standing.

**Also still outstanding:** the control plane has not recorded the merge or the main CI run, and
`development_head_sha` still names `149a4c1`. Both are now record-accuracy matters rather than safety matters,
because the merge has happened and took the right head; but a record naming a different head than the merged
one is the ambiguity that made the risk real, and it should not be left standing at closeout.

## Evidence

The Web E2E wrote its own evidence to `evidence/raw/mission-book/UXI-301/web-e2e.json` **inside a throwaway
worktree**, deliberately not committed: it is a tracked file on the branch and overwriting UXI-301's
already-reviewed PASS record would be the clobbering hazard this task has hit before. The figures above are the
run's own verdict lines, reproduced verbatim.
