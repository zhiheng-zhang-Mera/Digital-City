# PCF-701 Bounded activation receipt

```text
ACTIVATION_ID      PCF-ACT-2026-10-07-02 (the second activation: bounded and sequential)
SCOPE              PCF-701 ONLY (not a blanket enablement of 701..728)
AUTHORITY          the owner's standing instruction that the PCF series be taken in sequence on a dedicated branch
                   series; this receipt applies that authority to the ONE next qualified workbook
DEPENDENCY         PCF-700 = COMPLETE / review_complete=true / review_host=Alien / review_head_sha=659ff6a
BASELINE           659ff6aa98bc5675862b1170ed0cf5e1b78dba5f (= the accumulated head of pcf/series-mech)
CLAIMANT           Mech-DS (COMPUTERNAME MEGA-REP, development side)
BRANCH             pcf/PCF-701-mech-live-resource-telemetry
```

## 1. Why this workbook may be opened now (each step of the activation transaction measured)

```text
1  Owner scope and eligibility  the owner's instruction requires the PCF series to be taken in sequence, and PCF-701
                                is the next workbook on the dependency graph (its only dependency is PCF-700). This
                                receipt BOUNDS the authority to this one workbook: 702..728 remain disabled and
                                anchor-less (measured in step 4).
2  Is the dependency really accepted?  read from the WORKBOOK FRONTMATTER, never from a README short SHA:
                                PCF-700 status=COMPLETE, development_complete=true, review_complete=true,
                                review_host="Alien", review_head_sha="659ff6aa98bc5675862b1170ed0cf5e1b78dba5f"; the
                                opposite host's REVIEW_REPORT.md verdict is ACCEPTED for the audit/compatibility
                                scope and requests no repair.
3  Ancestry and union           measured: 312b627b54af5bbf274fa25eca8f8383869c1c34 (origin/main) is an ancestor of
                                659ff6a, and 659ff6a is exactly the accumulated head of the series branch
                                pcf/series-mech, so the dependency union is that single head and needs no union merge.
                                NOTE: PCF-700's merge_authority is false and no product merge happened, so the baseline
                                is the SERIES BRANCH head rather than main - an explicit choice, not an accident.
4  Control plane               sync_dependency_state.py's ID_RE has recognised PCF since the PCF-700 activation
                                transaction; running the reconciler this round changed ONLY PCF-701 (git status shows
                                exactly two files: the manifest and this workbook), and 702..728 stayed
                                execution_enabled=false with no anchors.
5  Explicit file set           the manifest's pcf entry now lists two EXPLICIT globs, `PCF-700-*.md` and
                                `PCF-701-*.md`; no broad glob that would inhale future tasks is used.
6  In-flight claim rescan      measured before claiming: no host holds a claim on PCF-701; the only other in-flight
                                development is REX-806 (Mech, awaiting the opposite-host review) and SHOW-401 (Alien).
                                MON-990 is already COMPLETE, satisfying the activation rule that MON-990 close out
                                first.
7  Synchronisation and checks  sync_dependency_state.py (nothing pending), sync_mission_progress.py and both
                                `--check` runs are green; record consistency is 0 errors / 34 warnings (baseline) /
                                4 excused.
8  Receipt published           this file. Any failed step would grant no execution right; every step passed.
```

## 2. Boundaries this activation does NOT grant

```text
* No purchase, no paid service, no system-service installation, no running-profile change, no remote-execution
  enabling.
* No merge authority: both PCF-701's and PCF-700's merge_authority stay false.
* Only PCF-701 gains an execution right; 702..728 stay parked and out of the current denominator.
* The two-host rule is unchanged: development happens here and the formal review must be done by the opposite
  physical host (section 3 forbids self-review).
```

## 3. Task-pool rescan after activation

```text
PCF denominator   total=2 (PCF-700 COMPLETE, PCF-701 in progress) - produced by sync_mission_progress.py, not hand-edited
Whole city        complete 90/94, development 91/94, review 90/94 (generated values, see the main board)
Claimable here    the next workbook for this host is PCF-701 (this receipt); 702/704/706/708 keep waiting on their own
                  dependencies and are not pre-enabled
```
