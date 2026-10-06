# PCF-700 Review handoff (author to the opposite host)

```text
TASK_ID            PCF-700
REVIEW TARGET      a2a567325e6ce08629eefbe67cda6f8f2c16fd64
BRANCH             pcf/PCF-700-mech-ownership-and-reality-audit (= the current tip of pcf/series-mech)
BASELINE           312b627b54af5bbf274fa25eca8f8383869c1c34
AUTHOR HOST        Mech (COMPUTERNAME MEGA-REP, role Mech-DS)
REVIEWER           the other physical host (section 3 forbids self-review; this file is NOT a review claim and
                   carries no verdict)
DELIVERABLES       docs/zh-CN/pcf/ownership-map.md, docs/en/pcf/ownership-map.md,
                   tests/pcf700-compatibility.test.mjs, scripts/check-bilingual.mjs
REPORT             reports/PCF-700/DEVELOPMENT_REPORT.md
```

> Why the target moved: the earlier delivery head `d611cfe5f0272673706b9dc5c9f6b85ed40a9406` failed hosted CI at step
> `pnpm check:docs` (the repository gate `scripts/check-bilingual.mjs` read one directory level only and hit EISDIR on
> the nested `docs/*/pcf/` the workbook requires). The repair head `a2a5673` carries the tree-aware fix of that gate,
> so **review a2a5673**; the failed head and its root cause are kept in DEVELOPMENT_REPORT section 2.5.

## 1. Why this file exists

PCF-701..728 all depend, directly or transitively, on PCF-700, and PCF-701 can only reach READY once its dependency is
status=COMPLETE. The series' single critical path is therefore the **opposite-host review of this task**. The author
lists the exact head, the reproducible commands and the falsifiable seams once, so the reviewer does not have to guess
where the evidence is; the author writes no verdict here and does not turn this file into a REVIEW_REPORT.

## 2. What the reviewer must manufacture independently (never read the author's conclusions as evidence)

```text
R1 resolve the exact head yourself: git ls-remote origin pcf/PCF-700-mech-ownership-and-reality-audit must equal
   a2a567325e6ce08629eefbe67cda6f8f2c16fd64, and 312b627b54af5b must be an ancestor of it.
R2 re-run the author suite: corepack pnpm install --frozen-lockfile AND
   corepack pnpm --dir city install --frozen-lockfile (both steps - a root node_modules junction does not install the
   city workspace), then node --test tests/pcf700-compatibility.test.mjs and the repository gate pnpm check:docs. The
   author measured 7/7 and PAIR_STATUS = SYNCHRONIZED in all three roots; the reviewer must measure it too.
R3 falsify R2 instead of restating it: pick at least two compatibility counter-examples and make them fail on
   purpose before restoring them (for example, make the strict target resolve to a real online node and confirm C3's
   withheld assertion becomes FALSE), proving the suite is not vacuously green.
R4 independently manufacture the TWO-HOST_VERIFIED tier for a sample call chain; this host only produced single-host
   LIVE evidence.
R5 check the three wiring-layer verdicts in the ownership map against your own measurement, especially the
   NOT_WIRED verdict for `chooseHybridTarget`: grep the call sites in your own checkout rather than trusting the
   author's grep.
R6 record the reviewer's own instrument errors (the author recorded four in DEVELOPMENT_REPORT.md section 2).
```

## 3. Falsifiable seams to attack first

```text
S1  is the strict target really wired into the claim path (C3), or only an exported function? Attack: create a task
    whose target is offline and claim it from another node.
S2  does `chooseHybridTarget` really have no gateway call site (C6)? Attack: find any production call and the
    conclusion is refuted.
S3  is the worker pool really registered-but-inactive (C7)? Attack: switch the profile to hybrid/worker and see
    whether it is actually selected as active.
S4  does a bare City really create no pcf-named state (C1)? Attack: start on a fresh data directory and list it
    recursively for any pcf trace.
S5  is the descriptor contract tolerant of legacy records while the live register route requires capabilities (C5)?
    Attack: drive a real legacy record through both paths.
```

## 4. Unfinished work the author declared (the reviewer should neither call it a defect nor let it pass)

```text
the five-tier check of specification revision 2 (EM connector/Foreman, RF, GAI, WBC, origin tooling);
the per-file UI->backend dependency matrix and a machine-readable single-writer list;
the "accepted EM/RF/GAI components vs the PCF reuse boundary" table.
All three appear in ownership-map.md section 7 and DEVELOPMENT_REPORT.md section 6: UNFINISHED, not passed.
```

## 5. Boundaries

```text
The author crossed none of these: no purchase or paid service, no system-service install, no running-profile change,
no remote-execution enabling, no merge (merge_authority=false). The resident City (pid 44088, 172.31.12.151:4391) was
not touched by this task. If the reviewer needs to cross one, it must be written up as an explicit problem rather than
done in passing.
```
