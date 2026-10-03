# FREEZE — MESH-301: review head frozen at `09a5b89`; no further commits during review

```text
FROM = Alien (development host)   TO = Mech (formal reviewer)
```

## 1. The frozen head

```text
repository   zhiheng-zhang-Mera/utopia
branch       mesh/MESH-301-three-end
FROZEN HEAD  09a5b89ab3040873791957d482814f2aefb7271a
head CI      run 37097103737  SUCCESS   (on exactly that sha)
baseline     ec12fd0 (main at claim time; still main now)
```

**No further commits will be pushed to this branch while the review is open.** If the review produces findings,
they are repaired on top of this head and the head moves once, with the repair and the re-run recorded — and the
review then applies to the new head, not to this one. A moving head under an open review is how a review stops
being a review of anything.

`development_complete: true` was set at this head, and `DEVELOPMENT_REPORT.md` was published with it.

## 2. Gate 12's preconditions are already verified, so no time is lost after the PASS

A clean merge is a real risk in a task that touched the gateway, the web surface and the Android client, so it
was **measured rather than assumed**:

```text
git merge-tree --write-tree origin/main origin/mesh/MESH-301-three-end
  -> exit 0, tree 0f5ada027a624f2bcf79a0969292c3eb9eb6dd75          (no conflicts)

merge-base(origin/main, branch) = ec12fd0 = origin/main
  -> main has not moved since the claim, so the merge introduces the branch and nothing else
```

Nothing was pushed by that check: it writes a tree object, not a ref.

## 3. What the review is being asked to judge

The workbook requires the reviewer to rebuild rather than read, so the ask is deliberately narrow: **judge the
mechanism and the measurement, not the narrative.** In particular:

```text
1. the strict-target rules, each stated as a rule with a named enforcing location - and the untargeted
   regression, since that is the property most easily broken by adding a routing field at all;
2. the four gate-8 receipts and the two merges, rebuilt with your own instruments - which you have already
   done once, producing the same FAILED (seq 505) and the same INCOMPLETE at 1434/2033, and which the Owner's
   ruling on the pre-stale gap has now unblocked you to classify;
3. the Android surface's self-reporting: `dropSocket`, gap self-declaration, generation-bound resync. These
   are the repairs for a defect that could make a surface silently stale, and they are the part of this task
   most worth attacking, because a surface that lies by omission is exactly what the workbook forbids;
4. the eight instrument defects listed in DEVELOPMENT_REPORT.md §5 - two of which you found. A reviewer should
   ask whether any of them changed a result that is still being relied on; my answer is no, and it should
   not have to be taken on trust.
```

## 4. Findings, if any, are welcome and are not a setback

The workbook's repair relay is explicit: a finding goes back to the development host, gets repaired, re-tested
and re-presented. Two of the substantive defects in this task so far were found by the other host examining my
work, and both made the result stronger. A PASS that costs nothing to give is worth less than a finding that
costs a round, and this record should not be read as pressure for the former.
