# PCF series activation receipt (bounded)

> This receipt records **one bounded activation**: the owner's instruction this session - open the PCF series, take its tasks in sequence, give the series its own branch series - executed as far as "fix the control plane first, enable exactly one workbook, leave the rest parked".

```text
issued by / 发出者            Mech-DS (MEGA-REP) · 2026-10-07
authority / 授权来源          Owner instruction this session (open the PCF series, take tasks in sequence, own branch series)
scope revision                scope = the PCF CORE_V1 series, claimed ONE workbook at a time; this receipt enables PCF-700 only
budget / 预算                 none (no purchase, no paid service, no external cost)
device eligibility            this host's existing resident City and its already-registered nodes; no remote execution, no new hardware
boundaries not crossed        no runtime-profile change, no system-service installation, no enabling of remote execution, no merging (merge_authority stays false)
no half activation            any step failing grants no execution right; this receipt exists only because every step below passed
```

## 1. Why activation was permissible

```text
Does REX have an available task?   NO (0 claimable here): REX-806's development is complete but the other half of its
                                   gate is the opposite physical host's independent re-check (section 3 forbids
                                   self-review), and REX-807/REX-890 depend on REX-806's marker and stay
                                   WAITING_DEPENDENCIES
=> the owner's own condition "open PCF when REX has no available task" is met
```

## 2. Prerequisites, measured (control-plane compatibility check)

```text
1  PCF ids were INVISIBLE to the dependency tool - a real gap, fixed here: sync_dependency_state.py's ID_RE did not
   contain PCF ('PCF-700:...' did not match while WBC/REX did). ID_RE now includes PCF. Regression: both the dry run
   and the real reconcile touched EXACTLY ONE workbook (PCF-700); every other programme's --check is green.
2  parked tasks are not unblocked automatically: PCF-701..728 were not touched at all (measured with git status);
   their status, execution_enabled and anchors are unchanged.
3  explicit dependency_source_workbooks resolve to the four accepted WBC heads.
4  the English mirror carries no frontmatter workbook id, so it cannot double-count.
5  the working denominator carries only the EXPLICIT file set: PROGRESS_MANIFEST.json gained a pcf entry whose
   task_globs is `mission-group/personal-compute-fabric/PCF-700-*.md` (NOT a broad PCF-*.md glob); the generator
   measures pcf total = 1.
6  dependency-state and main-board --check are green; the record-consistency gate reports 0 errors with the same
   warning count as the baseline.
```

## 3. What is enabled, what stays parked

```text
ENABLED (1)    PCF-700: execution_enabled=true, status=IN_PROGRESS,
               activation_state=ACTIVATED_OWNER_2026_10_07, anchor_state=RESOLVED_AT_CLAIM,
               owner_gate=SATISFIED_OWNER_ACTIVATION_2026_10_07,
               development_baseline_sha=312b627... (= current main, because all four WBC dependency heads are in main)
PARKED (28)    PCF-701..728: execution_enabled stays false, activation_state stays PARKED_OWNER_NOT_ACTIVATED and the
               anchors stay INTENTIONALLY_EMPTY_UNTIL_ACTIVATION; they are out of the current denominator and gain no
               execution right, budget, credential or merge authority from this receipt.
```

## 4. The branch series

```text
pcf/series-mech                                the series' accumulating branch (from main 312b627); each task's verified work lands here
pcf/PCF-700-mech-ownership-and-reality-audit    this workbook's development branch (from the series branch)
merge                                          this receipt grants NO main merge authority; the series accumulates first and merging awaits an owner ruling
```

## 5. Pool after the rescan

```text
PCF    IN_PROGRESS: one workbook in flight (PCF-700), 28 parked (not counted)
REX    no task available to this host (REX-806 awaits the opposite host's review; 807/890 dependencies unmet)
others unchanged: completed WBC/CEX/MON/RS/UI etc. are untouched, as are the other unactivated programmes
```

**Effect boundary:** this receipt grants the right to perform PCF work in sequence and to accumulate it on the series branch. It grants no merge right, no budget, no remote execution, no system services and no hardware purchase, and it changes no other programme's state.
