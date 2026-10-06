# MON-903 baseline resolution and claim — Mech

```text
CLAIMANT            Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ANCHOR MODE         DEPENDENCY_SHA_UNION_AT_CLAIM, resolved literally
DEPENDENCY          MON-901  7eb38f1b930dfe6cc13dab0e17dedee467b1254b  (ACCEPTED head, already an ancestor of main)
ELIGIBLE BASE       refs/heads/main = 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
UNION               not required - the eligible base already contains the accepted dependency head
REQUIRED ANCESTORS  none declared by this workbook
DEPENDENCY SMOKE    node --test tests/mon901-observation.test.mjs  ->  8 pass / 0 fail
                    executed at 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef BEFORE any MON-903 product file was touched
WORKTREE            D:/utopia-mon903   BRANCH mon/MON-903-mech-decision-overlay
```

## Claim-time measurements (taken before writing this record)

```text
Digital-City origin/main                      f41ff97   (fetched immediately before the claim; MON-903 was still
                                              status READY with development_host null and no competing claim)
Utopia origin/main                            213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
dependency head in main                       git merge-base --is-ancestor 7eb38f1b930dfe6cc13dab0e17dedee467b1254b
                                              origin/main  ->  exit 0  (ANCESTOR_OK)
dependency smoke instrument note              a fresh worktree has no node_modules, so `npm ci` was run before the
                                              smoke; that is an environment step, not part of the measurement
```

The atomic-claim procedure applied here is the one this host adopted after the REX-803 claim collision: fetch the
control repository immediately before writing, confirm the target is still unclaimed, write the claim, and push in the
same step. No field of another host's claim was overwritten.

## Why MON-903, and why now (recorded choice, per the owner's rule)

The owner's standing order is: `research-strengthening` in ascending task code first, then `city-work-monitor`; SHOW is
excluded. At the moment of this claim the research series had no eligible next task for this host:

```text
REX-803  development complete on 57d1c919; its opposite-host Formal Review (review_host must be Alien) is not started
REX-804  Mech review performed and RETURNED FOR REPAIR (blocking finding B1); the author's repair is pending
REX-805  WAITING_DEPENDENCIES on REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED
REX-806  WAITING_DEPENDENCIES on REX-803/REX-804/REX-805
REX-807  WAITING_DEPENDENCIES on REX-806
REX-890  WAITING_DEPENDENCIES on the whole series
```

Every further research step therefore waits on the opposite physical host or on a physical topology this host cannot
supply (the Alien host node is offline). A scan of all 25 workbooks in the mission-book found exactly ONE task that is
`READY`, execution-enabled and unclaimed: **MON-903**. Its single declared dependency (MON-901) is accepted and in main,
so claiming it follows the owner's order rather than jumping it.

## Remaining work

MON-903's own scope — an event-triggered decision overlay with a per-task queue, rule-first resolution, a bounded
decision receipt, timeout/fallback, user-visible provenance and no global barrier — is developed on the branch above.
The terminal marker is NOT released by this claim, `merge_authority` stays false, and the opposite-host Formal Review
remains outstanding.

语言配对 / Language pair: [English](./CLAIM_RECORD.md) · [中文](./zh-CN/CLAIM_RECORD.md)
