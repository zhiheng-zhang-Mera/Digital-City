# DISPATCH — Mech: the three harness fixes verified on the INTEGRATED RS-290 tree, published as one fetchable branch

```text
FROM = Mech   TO = Alien + Owner
BASE = rs/RS-290-scheduling-baseline-freeze @ 6514733
BRANCH = fix/device-pilot-harness-integration @ 1dfb3ed
```

## Why this record exists

The three fixes I sent separately were each cut from `44b52e2`, the RS-203 tip. That is not the tree
anyone will run them on: the E2E that matters runs on the **integrated** tree, where RS-290's own work
sits on top. A fix that passes on its own base and conflicts on the integrated head is worth nothing,
and I had not checked. I checked.

## Result: both fix branches merge into the integrated head with ZERO conflicts

```text
git merge fix/device-pilot-route-from-source     -> exit 0   (1964ca8)
git merge fix/device-pilot-process-identity      -> exit 0   (1dfb3ed)
git status --porcelain                            -> empty (no conflicts, no leftovers)
git diff --name-only 6514733                      -> exactly the 8 intended files
```

The 8 files, exactly as expected and nothing else:

```text
scripts/device-recovery-pilot.mjs   scripts/lib/process-identity.mjs   tests/process-identity.test.mjs
scripts/device-task-pilot.mjs       scripts/lib/ui-route.mjs           tests/ui-route.test.mjs
                                    tests/fixtures/ui-route/earlier-shell.xml
                                    tests/fixtures/ui-route/redesigned-shell.xml
```

**Full suite on the merged integrated tree: 989 tests / 987 pass / 2 fail**, and both failures are the
pre-existing document-reader `CORRUPT_INPUT` pair that reproduces on the untouched base. So the merge
adds 27 tests (12 route + 15 identity) and regresses nothing on the tree that matters.

## The stronger check: the merged files are BYTE-IDENTICAL to what I tested

Passing on the integrated tree is only meaningful if the code that passed is the code I verified, so I
checked that rather than assuming it:

```text
git diff --stat fix/device-pilot-route-from-source HEAD -- <route-fix paths>       -> EMPTY
git diff --stat fix/device-pilot-process-identity  HEAD -- <identity-fix paths>    -> EMPTY
```

Both empty, which means the merge introduced no textual change to any fix. Every claim I have made
about them therefore transfers verbatim: the 833-capture route measurement (751 old no-ops to 751
correct resolutions), the real-probe identity results (`verified` / `mismatch` / `already-gone` /
`invalid-pid`), and the ENOENT reproduction. 27/27 of the new tests pass on the integrated tree.

## Published as one branch, so nobody has to repeat this

`fix/device-pilot-harness-integration` @ `1dfb3ed` contains all three fixes on top of `6514733`:

| commit | fix |
|---|---|
| `2220975` | route resolved from node geometry, not a bare label match |
| `73d7ce7` | the task pilot creates the evidence directory it writes into |
| `0c6498f` | a stale PID no longer crashes the recovery pilot in `JSON.parse` |

Fetch it and the merge question is already answered. The two single-fix branches remain available if
the Owner prefers to take them one at a time.

**To be explicit about what this is not:** it is not a merge into `rs/RS-290-*`, and it is not a claim
on the merge decision. RS-290 holds `merge_authority` and none of this is RS-290 work. This branch is a
verification artefact — it exists so that whoever decides has a tree that is already known to merge,
already known to pass, and already known to be the code that was measured.

## What the harness now covers, and the one thing still missing

Between the three fixes, the failure modes that consumed your five E2E attempts were **all in harness
or host setup, not in the product** — a stale application credential, a stale locale assumption, a
zero-bounds route that never left the Devices page, a recorded PID that crashed the identity check,
and a missing evidence directory. The first four are now fixed in code with tests; the evidence
directory no longer needs your pipeline to pre-create it.

Still owed, and I am not claiming it: **the dual-device recovery E2E has not been re-run.** No device
is attached on this host. The recovery path on the integrated tree remains owed. What is established
is that the mechanisms which stopped it are identified and fixed on a tree that provably merges and
passes — which is a narrower claim than the gate requires, and deliberately so.
