# PCF-700 Development report

```text
TASK_ID            PCF-700  Ownership, call-chain and compatibility reality audit
PROGRAMME          PERSONAL_COMPUTE_FABRIC
ROLE               Development
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
HOST               Mech (COMPUTERNAME MEGA-REP; role Mech-DS, development side)
BRANCH             pcf/PCF-700-mech-ownership-and-reality-audit
SERIES BRANCH      pcf/series-mech (= f75b2a6, the series' accumulated head)
BASELINE_SHA       312b627b54af5bbf274fa25eca8f8383869c1c34  (= origin/main; see CLAIM_REPORT.md)
HEAD_SHA           0899da833e39caa924bdc77bf1020ba5fa572b03  (increment 3 / development closure; earlier heads f75b2a6, a2a5673, d611cfe)
CI                 run 37497553367 (d611cfe, **failure**) -> run 37498638940 (a2a5673, **success**)
                   -> run 37500280971 (f75b2a6, **success**) -> run 37501463875 (0899da8, **success**, both jobs green)
DEVELOPMENT        development_complete: true - sub-steps 1-4 are delivered with their evidence and the DEVELOPMENT half
                   of sub-step 5 is done (every unproven item is labelled and attributed); its EXECUTION half belongs to
                   the reviewer (EXECUTION_CONTRACT section 14 requires the other physical host)
DELIVERABLES       docs/{zh-CN,en}/pcf/ownership-map.md, reuse-tiers.md, ui-backend-matrix.md,
                   tests/pcf700-compatibility.test.mjs, tests/pcf700-dependency-direction.test.mjs,
                   scripts/pcf700-reuse-audit.mjs, data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json,
                   scripts/check-bilingual.mjs (repair of a repo gate defect that CI exposed; see 2.5)
REVIEW             review_host = null (waiting for the other physical host; this host never self-reviews)
```

> Reading translation of the Chinese report beside it. The Chinese file is the record of authorship; this mirror keeps
> the same facts, the same failures and the same unfinished list.

## 1. Deliverables and what was actually measured

`docs/{zh-CN,en}/pcf/ownership-map.md` (mirrored) freezes three things:

```text
reuse/extend/missing table   every reuse point carries all five layers: declaration, caller, live API, user surface,
                             exact evidence. Example: STRICT_TARGET_FIELD in targeting.mjs:30 is used by
                             standard-devices.mjs INSIDE the claim path, so "the function is exported" is not
                             "the seam is enabled".
nine interfaces / eight types MEASURED: none of the nine candidate interfaces in ARCHITECTURE section 4 exists at
                             312b627. Two names are occupied by other domains - observeResources (EM Foreman) and
                             admit (capability routing) - so they are NAME COLLISIONS, not reuse points. Every one of
                             the eight shared types is absent too, so they must be created under
                             contracts/personal-compute-fabric-v1/; this round created NONE of them.
three wiring layers          (1) profile switching is LIVE_WIRED (built at server.mjs:503, routes :963/:967,
                             snapshot :718); (2) chooseHybridTarget (execution-profile.mjs:166) is NOT_WIRED -
                             the gateway has no call site and only the WBC-604 tests call it, so C6 freezes that as an
                             assertion; (3) the strict target really is wired into the live claim path
                             (classifyTarget / withheldTasks / claimAllowedByTarget in standard-devices.mjs) and C3
                             verifies it through a real HTTP claim.
single writer / no new DB    server.mjs is the only writer of routes and controller construction, store.mjs the only
                             writer of canonical task/action/device/event truth, node-descriptor-v1 the only writer of
                             descriptor fields; after a bare City starts, no pcf-named state exists in the data
                             directory, and repo-wide the string personal-compute-fabric appears only in mission-book
                             planning files and docs.
```

`tests/pcf700-compatibility.test.mjs`: **7/7 green** (re-run immediately before the commit; 1.06 s), covering C1-C7.

## 2. This round's own instrument errors (recorded, not hidden)

```text
E1  assumed POST /api/v0/tasks could carry targetDeviceRef - it accepts only type and returns 400
    "Choose a supported safe task type; parameters are not accepted"
E2  assumed the withheld row's field was id and its reason was UNKNOWN - they are taskId and STRICT_TARGET_BOUND
E3  assumed classifyTarget returns {ok} - it returns {state, claimable, reason}
E4  (minor) assumed POST /api/v0/node/register accepts a legacy descriptor - it returns 400 without capabilities,
    while roles stays optional
```

All four live in the test comments and in section 6 of the ownership map: the probes were falsified first.

## 2.5 A defect in the REPOSITORY gate that CI exposed (not one of this host's probes) / Repo gate defect

```text
SYMPTOM  hosted run 37497553367 (head d611cfe) FAILED at step `pnpm check:docs`; gateway-web failed, android passed.
         Reproduced locally with the same command (scripts/check-bilingual.mjs) -> same failure:
         EISDIR: illegal operation on a directory, read.
ROOT CAUSE  check-bilingual.mjs readdir'd docs/zh-CN and docs/en at ONE level only and then read every entry as a
         file. This workbook's required deliverable path is docs/{zh-CN,en}/pcf/ownership-map.md, so the first nested
         pair made the gate crash instead of checking anything.
OPTIONS  (a) flatten the deliverable to docs/zh-CN/pcf-ownership-map.md - contradicts the path the workbook states
         explicitly, and all 28 later PCF tasks will need docs/*/pcf/*, so it only postpones the problem;
         (b) make the gate TREE-AWARE: walk both trees, compare the relative path lists exactly, then compare the fact
         lines pair by pair - keeps the original semantics and covers nesting.
CHOSEN   (b). A paired translation is paired wherever it sits, so the one-level assumption was the thing that was
         wrong; the workbook is authority and the deliverable is not moved to suit a tool.
FALSIFIED  the repaired gate had to be proven non-vacuous: moving the en mirror aside yields
         'docs missing language pair' (exit 1); adding a STATUS: line to the en file yields
         'docs/pcf/ownership-map.md facts differ' (exit 1); after both were restored, docs, evidence and data-records
         all report PAIR_STATUS = SYNCHRONIZED (exit 0).
REMAINING  empty directories are outside that contract (empty in both languages passes) and the script comment says
         so rather than pretending otherwise.
```

## 3. Judgement calls where nothing was specified (reasoning recorded)

```text
J1  How should the series branch accumulate? Chosen: a FAST-FORWARD push (pcf/series-mech: 312b627 -> d611cfe)
    rather than a merge commit. Only one task exists in the series so far, and whether this work counts as accepted
    is the owner's merge ruling after review; adding a merge object now would only create history to explain later.
    Recorded here so a reviewer can overturn it.
J2  Where do report mirrors go? The directory's existing CLAIM_REPORT.md is bilingual in one file, so this
    DEVELOPMENT_REPORT.md follows that form and an English mirror sits in en/; it does not go into zh-CN/, which would
    clash with the existing file's form (the clash itself is recorded here).
J3  Claim PCF-701 immediately after finishing one task? NO - blocked by the rules, not by preference: PCF-701..728 all
    depend (directly or transitively) on PCF-700, and PCF-701's READY requires the dependency to be status=COMPLETE
    (consistency rule 4, READY_WITH_UNACCEPTED_DEPENDENCY). PCF-700 has review_host=null and the formal review must be
    done by the other physical host (section 3 forbids self-review). The series' single critical path is therefore the
    opposite-host review of PCF-700, not another claim. This is ISOMORPHIC to what stalled the REX series for 15
    rounds, so it is raised as an explicit problem rather than excused by a local exception.
J4  Build the nine PCF interfaces while we are here? NO. This workbook is an audit and compatibility contract, and its
    section 7 lists what is unfinished; implementing interfaces without workbook authority would widen scope by
    pretending an audit is an implementation.
```

## 4. Boundaries not crossed (written down rather than assumed)

```text
no purchase, no paid service; no system-service installation; no running-profile change; no remote-execution enabling;
merge_authority stays false (the series branch only accumulates; the merge ruling belongs to the owner);
the resident City (pid 44088, 172.31.12.151:4391) was not touched by PCF work; this host does not review its own output.
```

## 5. CI status

```text
V0.2 checks run 37497553367  head=d611cfe  completed / **failure**
    -> gateway-web: step `pnpm check:docs` failed (the other nine steps all succeeded, INCLUDING `pnpm test`, so the
       new tests/pcf700-compatibility.test.mjs measurably passed on hosted CI); android: success
    -> reproduced locally; root cause and repair in section 2.5
V0.2 checks run 37496389297  head=312b627  completed / success (the baseline head; both jobs green)
The repair head a2a567325e6ce08629eefbe67cda6f8f2c16fd64 is pushed (branch and pcf/series-mech both at that head);
    hosted run **37498638940 completed / success** (gateway-web success, android success), so both jobs are green after
    the repair.
local evidence: node --test tests/pcf700-compatibility.test.mjs => 7 tests / 7 pass / 0 fail;
    node scripts/check-bilingual.mjs => PAIR_STATUS = SYNCHRONIZED for docs, evidence and data-records.
```

One failure and one repair are both kept here: **the failed head d611cfe is not erased**, and the repair head does not
borrow its green.

## 6. Increment 2 (head `f75b2a6`): measuring "accepted components" into tiers instead of assuming services

**Delivered**: `docs/{zh-CN,en}/pcf/reuse-tiers.md`, `docs/{zh-CN,en}/pcf/ui-backend-matrix.md`,
`scripts/pcf700-reuse-audit.mjs`, `data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json`,
`tests/pcf700-dependency-direction.test.mjs` (D1-D4, 4/4).

```text
Five-tier check (49 contract directories)
  Only 4 are LIVE_WIRED: execution-backend-v1, node-descriptor-v1 (WBC), remote-local-discovery-v1 and
    rs-presentation-contract-v1 (RF). The other 30 EM/GAI/RF contracts are referenced by TESTS ONLY, zero production
    references.
  EM's 13 directories carry 379 export statements and GAI's 9 carry 264, yet the gateway imports none of them
    => they are TESTED COMPONENTS, not live services the fabric may lean on.
  rs-cross-device-return-v1 (cross-device return) is TESTS ONLY => a result reaches the origin today through the
    handoff.mjs + presentation combination, and that dedicated contract is proven by NO production path - exactly the
    seam PCF-714 must attach to, recorded as an explicit gap.
  TWO_HOST_VERIFIED and ORIGIN_AGENT_CONSUMED are BOTH EMPTY (this host does not sign for the other), each with the
    workbook that owns it.
UI -> backend direction
  81 front-end files, 14 carrying an /api/v0 literal, 49 gateway routes, **unresolved endpoints = 0** (asserted by D2)
  **backend modules importing front-end modules = 0** (asserted by D1); one static serve path (static.mjs treats
  apps/web as the static root, which is the correct direction) and 17 tool/test drivers, counted in three categories
  instead of being smoothed into one sentence about "no cycle".
Single writers
  bytes/lines/SHA256 for server.mjs, store.mjs, targeting.mjs, execution-profile.mjs and node-descriptor.mjs are
  published so the opposite host recomputes them rather than trusting them.
```

**Increment 2's own instrument errors (recorded)**: the first direction probe used one loose regex and reported 19
"backend imports front-end", ALL false positives (serve paths and test/script drivers); the repair matched only
`import ... from '...'` and was then bypassed by a SIDE-EFFECT import `import '../apps/web/app.js';` (a real
dependency), which was found by deliberately falsifying the guard. All four guards were falsified by
"create counter-example -> red -> restore -> green" (probe files were created and deleted in the same step, leaving the
tree clean). The probe script is excluded from its own subject so it cannot inflate its own counts.

**Increment 2's CI**: hosted run **37500280971 completed / success** on `f75b2a6` (gateway-web success, android success;
every step green, including `pnpm test` and `pnpm check:docs`). Locally: 11/11 across the two PCF suites (7
compatibility + 4 dependency-direction) and PAIR_STATUS = SYNCHRONIZED in all three roots.

## 7. Next (for the next round or the opposite-host review)

```text
The development side is closed (development_complete: true): sub-steps 1-4, the development half of sub-step 5, and all
three items of specification revision 2 are delivered.
a the opposite physical host's Formal Review: walk a sample call chain on both hosts (TWO_HOST_VERIFIED) and, per
  EXECUTION_CONTRACT section 14, manufacture counter-examples independently and bind exact-head CI - this is the PCF
  series' single critical path and this host does not substitute for it
b TWO_HOST_VERIFIED and ORIGIN_AGENT_CONSUMED are BOTH EMPTY (reuse-tiers.md section 5 names the owner of each)
c the BuildConfig question: MEASURED AND NOT APPLICABLE (no BuildConfig or buildConfigField reference exists) - CLOSED,
  not unfinished
d (DONE) the five-tier check, the reuse-boundary table, the UI->backend matrix and the single-writer list
```

Section 7 of `ownership-map.md` says the same thing: `UNKNOWN` is a conclusion there, not a blank.
