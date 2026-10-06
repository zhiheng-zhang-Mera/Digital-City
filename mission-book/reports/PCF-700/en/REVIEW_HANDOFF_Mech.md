# PCF-700 Review handoff (author to the opposite host)

```text
TASK_ID            PCF-700
REVIEW TARGET      0899da833e39caa924bdc77bf1020ba5fa572b03
BRANCH             pcf/PCF-700-mech-ownership-and-reality-audit (= the current tip of pcf/series-mech)
BASELINE           312b627b54af5bbf274fa25eca8f8383869c1c34
AUTHOR HOST        Mech (COMPUTERNAME MEGA-REP, role Mech-DS)
REVIEWER           the other physical host (section 3 forbids self-review; this file is NOT a review claim and
                   carries no verdict)
DEVELOPMENT        the development side is closed (development_complete: true); awaiting the opposite-host review
CI                 run 37501463875 completed / success (head 0899da8, gateway-web and android both green)
DELIVERABLES       docs/{zh-CN,en}/pcf/{ownership-map,reuse-tiers,ui-backend-matrix}.md,
                   tests/pcf700-{compatibility,dependency-direction}.test.mjs,
                   scripts/pcf700-reuse-audit.mjs, data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json,
                   scripts/check-bilingual.mjs
REPORT             reports/PCF-700/DEVELOPMENT_REPORT.md
```

> Why the target moved: the earlier delivery head `d611cfe5f0272673706b9dc5c9f6b85ed40a9406` failed hosted CI at step
> `pnpm check:docs` (the repository gate `scripts/check-bilingual.mjs` read one directory level only and hit EISDIR on
> the nested `docs/*/pcf/` the workbook requires). The repair head `a2a5673` turned both jobs green, `f75b2a6` is
> increment 2 (the five-tier check, the UI->backend matrix and the single-writer list), and the current head `0899da8`
> closes the BuildConfig question (measured NOT APPLICABLE) and closes the development side. **Review `0899da8`**; the
> failed head and its root cause are kept in DEVELOPMENT_REPORT section 2.5.

## 1. Why this file exists

PCF-701..728 all depend, directly or transitively, on PCF-700, and PCF-701 can only reach READY once its dependency is
status=COMPLETE. The series' single critical path is therefore the **opposite-host review of this task**. The author
lists the exact head, the reproducible commands and the falsifiable seams once, so the reviewer does not have to guess
where the evidence is; the author writes no verdict here and does not turn this file into a REVIEW_REPORT.

## 2. What the reviewer must manufacture independently (never read the author's conclusions as evidence)

```text
R1 resolve the exact head yourself: git ls-remote origin pcf/PCF-700-mech-ownership-and-reality-audit must equal
   0899da833e39caa924bdc77bf1020ba5fa572b03, and 312b627b54af5b must be an ancestor of it.
R2 re-run the author suite: corepack pnpm install --frozen-lockfile AND
   corepack pnpm --dir city install --frozen-lockfile (both steps - a root node_modules junction does not install the
   city workspace), then node --test tests/pcf700-compatibility.test.mjs,
   node --test tests/pcf700-dependency-direction.test.mjs and the repository gate pnpm check:docs. The author measured
   7/7, 4/4 and PAIR_STATUS = SYNCHRONIZED in all three roots; the reviewer must measure it too.
R2b recompute the single-writer fingerprints YOURSELF: run node scripts/pcf700-reuse-audit.mjs and compare the
   bytes/lines/SHA256 against data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json; a mismatch is evidence drift, not a
   typo.
R3 falsify R2 instead of restating it: pick at least two compatibility counter-examples and make them fail on
   purpose before restoring them (for example, make the strict target resolve to a real online node and confirm C3's
   withheld assertion becomes FALSE), and falsify D1-D4 the same way (for example, write
   `import '../apps/web/app.js';` into a backend file and D1 must go red - the author's first probe missed exactly that
   SIDE-EFFECT import).
R4 independently manufacture the TWO_HOST_VERIFIED tier for a sample call chain; this host only produced single-host
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
S6  do EM/GAI really have ZERO production references (the load-bearing claim of the tier table)? Attack: find any
    non-test reference to `contracts/engineering-*` or `contracts/general-ai-*` under services/, city/ or apps/ and
    the "tested components only" conclusion falls.
S7  is "unresolved UI endpoints = 0" real? Attack: write a literal naming an `/api/v0/...` the gateway does not serve
    into any apps/web or apps/android file and D2 must go red (the author falsified it exactly that way).
S8  is `rs-cross-device-return-v1` really TESTS ONLY? Attack: find a production reference and the "no production path
    proves the return seam" conclusion falls.
```

## 4. What the author declares done and not done (neither a defect to be called out nor a pass to be granted)

```text
DONE (increment 2, re-runnable): reuse-tiers.md (five tiers + reuse boundary), ui-backend-matrix.md (matrix +
  single writers), data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json (machine-readable),
  tests/pcf700-dependency-direction.test.mjs (D1-D4).
NOT DONE: the two-host independent walk of sample call chains (**the reviewer must perform it**); the
  TWO_HOST_VERIFIED and ORIGIN_AGENT_CONSUMED tiers are BOTH EMPTY and each is named in reuse-tiers.md section 5; the
  URL a Gradle-generated Android BuildConfig carries is not in the static matrix.
```

## 5. Boundaries

```text
The author crossed none of these: no purchase or paid service, no system-service install, no running-profile change,
no remote-execution enabling, no merge (merge_authority=false). The resident City (pid 44088, 172.31.12.151:4391) was
not touched by this task. If the reviewer needs to cross one, it must be written up as an explicit problem rather than
done in passing.
```
