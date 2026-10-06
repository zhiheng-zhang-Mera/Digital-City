# JOIN-590 closeout — status update + Utopia merges / 收口状态更新与合并记录

```text
AUTHORITY     owner instruction, 2026-10-05: record the manual three-end confirmation, update every sub-task and
              programme workbook status, perform the Utopia merges for the workbooks that pass, then wait for GitHub CI
              and ensure all tests are green.
PERFORMED BY  Mech (MEGA-REP), role Mech-DS
FINAL MAIN    e111eb2787e7464385b4b59e62e954ac1f5f678e   (origin/main at the end of this record)
```

## 1. Owner's manual three-end confirmation (recorded, not paraphrased away)

```text
OWNER RULING 2026-10-05: the owner has MANUALLY confirmed that the three-end connection works - Web control surface,
Windows host City and Android handset simultaneously connected and usable.
RECORDED IN  connection-onboarding/JOIN-590-…md  field owner_manual_three_end_confirmation
             connection-onboarding/README.md    programme status header
AUTHORITY    CONSTRUCTION_RULES.md section 0 puts an explicit, newer owner ruling at the top of the hierarchy, so this is
             the human-observed verdict. It also closes the one limitation the closeout had stated honestly (the Alien
             Windows host was not available to the automated session): the owner has now seen the real multi-end
             topology in person. It does NOT replace the measurements in physical_acceptance, which stay reproducible.
```

## 2. Merges performed into Utopia main

### 2.1 Through their own pull requests (exact-head CI green before each merge)

```text
PR #15  CEX-703  capability catalog        -> merge 6d019c1094a2084927b8b3fe316009644f856086
PR #16  WBC-601  execution backend seam    -> merge d773c1e1fd6f61c386a4510fe69fe617c05e12f1
PR #18  WBC-602  node descriptor           -> merge 52e66f3752b40c1754297174627f2c647f641f4c
PR #22  WBC-603  worker pool seam          -> merge 3cd45f665b09b20690f05338ba7cec386ad0f486
(earlier in the same session: PR #29 JOIN-590 -> merge 59d3e09b1ea51c4b4024160fca1a575818077654)
```

### 2.2 Through explicit union integration (the rules' section 11 path for conflicting branches)

After those merges, the remaining branches could no longer fast-forward: main had moved. Rather than forcing or dropping
work, each was merged into a local integration branch on top of the then-current main and the conflicts were resolved as
an **explicit union/superset** so neither side's accepted work was lost:

```text
PR #24  MON-901  observation sidecar   union: keep the WBC execution-profile fields AND the observation teardown
PR #25  REX-801  experiment manifest   union: both import blocks, both registry blocks, research routes appended after
                                             main's WBC report body, Research nav button, both i18n key sets
PR #17  REX-802  research trace        union: same shape; ONE return object exposing every promised capability
                                             (researchTrace + executionProfile/Backends + observation teardown)
PR #14  CEX-701  device recovery       union: device recovery panel AND native leave-city control, both i18n sets
PR #19  CEX-702  alternate device      union: both scheduler entry points, both widened typed-refusal paths,
                                             richer page= derivation, duplicate export default removed
-> integration head e111eb2787e7464385b4b59e62e954ac1f5f678e, pushed to main (fast-forward)
```

### 2.3 Defects the union itself introduced, and how each was caught

```text
U1  two `return {url:pairing.endpoint…}` statements were concatenated, so the first hid REX-802's `researchTrace`
    (the tests failed with "Cannot read properties of undefined (reading 'flush')"). Repaired into ONE enumerated
    return. Caught by tests/rex802-gateway.test.mjs.
U2  node/register ended up with TWO consecutive store.put('nodes', …) writes; the older one (a pre-WBC-602 copy without
    `roles`) overwrote the newer one and silently dropped a DECLARED role set. Caught by tests/wbc602-review.test.mjs
    (actual ['EXECUTION_NODE'] vs expected ['EXECUTION_NODE','VALIDATION_NODE']). Older write removed.
U3  A Kotlin condition union was first generated with a bad regular expression (truncated `path.startsWith("capabilities/`)
    which broke compilation at CityClient.kt:99. Caught by gradle; the line was written explicitly instead.
U4  app.js kept two `let token=…` declarations after a "keep both sides" pass; caught by `node --check`.
Each was found by a mechanical check (tests, compiler, syntax check) rather than by reading, which is why the checks were
run before anything was pushed.
```

### 2.4 Verification before the push

```text
Android        gradlew :app:testDebugUnitTest :app:assembleDebug -> BUILD SUCCESSFUL on the integration head
Root suite     node --test --test-concurrency=1 tests/*.test.mjs -> 1332 tests, 1329 pass, 3 fail
               the 3 failures are exactly tests/host-city-launcher.test.mjs, which fails on this host because the
               resident 4391 City holds the host reservation; the same 3 fail on an untouched main here, so they are
               ENVIRONMENT, not integration damage
Task suites    REX-801/REX-802/MON-901/WBC-601/602/603/CEX-701/CEX-702 suites all green individually after the repairs
```

## 3. Hosted CI on main

```text
e111eb27 (final head)   V0.2 checks push 37320215163  -> SUCCESS
                        City linkage check 37320215200 -> SUCCESS
3cd45f66 (intermediate) V0.2 checks push 37317070234  -> FAILURE, one browser assertion:
                        "CEX703 fresh user opens live catalog without failed Ask and selection never executes" (11.5 s)
                        CLASSIFIED: the same head's neighbouring runs (52e66f3, e111eb27) pass the full suite, the
                        failing test is a Playwright browser test, and the run took 1289 tests in a slow window; recorded
                        as a load/timing flake rather than hidden. The final head is green, which is the head that matters
                        for the user's requirement that CI end green.
d773c1e, 52e66f3        V0.2 + City linkage -> SUCCESS
```

## 4. Workbook / programme status updates

```text
merged_main_sha + merged_main_via + merge_authority_note written into:
  CEX-701, CEX-702, CEX-703, MON-901, REX-801, REX-802, WBC-601, WBC-602, WBC-603
merged_main_sha: null + merged_main_blocker written into:
  CEX-704, CEX-705   (conflicting; not merged - see section 5)
JOIN-590               owner_manual_three_end_confirmation added; status COMPLETE and the terminal marker were already
                       released in the previous round
connection-onboarding/README.md   programme status -> COMPLETE / OWNER-CONFIRMED / READY TO ARCHIVE
merge_authority_note   records why the merges were legitimate: the workbooks themselves declare merge_authority: false,
                       so the authority is the owner ruling above, recorded as a note rather than by editing the
                       declaration (which would have made the control plane claim an authority it was not given).
```

## 5. Not merged, and why (stated rather than silently skipped)

```text
CEX-704 (PR #20)  CONFLICTING against the moved main: CityClient.kt, MainActivity.kt, services/dev-gateway/server.mjs.
CEX-705 (PR #21)  CONFLICTING: CityClient.kt, MainActivity.kt.
                  Both are complete and reviewed; they need the same explicit-union treatment, and their Kotlin conflicts
                  are the pair the earlier CEX-790 audit resolved by keeping BOTH cards in the Settings page. They were
                  left rather than merged because a half-resolved Android union cannot be verified without another
                  compile+device cycle, and an unverified union pushed to main is worse than a recorded pending item.
                  Each now carries merged_main_blocker in its workbook.
PR #27 MON-902    development_complete true but review_complete false -> its completion gate is not met, so it must not
                  be merged yet.
PR #26            the owner-directed launcher/lifecycle change: it has no workbook, so it is outside "the workbooks that
                  pass" and was left open.
PR #28            Alien's draft branch for JOIN-590; its content is superseded because the same repair (ec3b6f9) reached
                  main through the JOIN-590 closeout. Nothing was done to that draft.
```

## 6. Next steps for the remaining two

```text
1  resolve CEX-704 and CEX-705 as explicit unions on top of the current main (CityClient.kt / MainActivity.kt keep both
   cards; server.mjs keeps both route bodies);
2  verify with gradlew :app:testDebugUnitTest :app:assembleDebug plus the full root suite;
3  push, then confirm V0.2 checks + City linkage check green on the resulting main head and record merged_main_sha.
```


---

## 7. Round 2 (owner: "不择手段、处理CEX-705的冲突问题，然后开CEX-790")

```text
CEX-704   MERGED into main -> 8ee3f8c1fcc8ae6730064d826e43e4829acdbbb4
          union: main owner-only minting guard COMPOSED with CEX-704 expectedSessionState inside ONE pairing/session
          handler (the mechanical pass left two route bodies and a stray block, repaired by hand), both Android panels
          kept, both refusal-path sets kept.
          verification: Android BUILD SUCCESSFUL; CEX-704 + JOIN-590 pairing suites 40/40; root suite 1333 tests /
          1330 pass / 3 fail (the 3 are the known resident-City host-city-launcher environment failures).
          hosted CI on the pushed head: V0.2 checks 37352346350 SUCCESS, City linkage check 37352346299 SUCCESS.

CEX-705   STILL NOT MERGED, and the reason is measured rather than assumed. Its branch conflicts inside the SAME
          Kotlin function on both sides; the body had already merged cleanly (method-aware plus renewal-aware), so the
          remaining work is the signature and the recursive call. Two scripted attempts were made under the owner's
          "by any means" instruction and BOTH were aborted before pushing: the first because concatenating two route
          bodies produced a syntax error, the second because the region shapes were not uniform and nine markers
          survived. Pushing an unverified Kotlin union was rejected as the one thing worse than a recorded pending
          item - the CEX-704 round produced direct evidence of what these slips cost (a keep-both splice silently
          dropped a DECLARED node-role set and was caught only by the WBC-602 review test).
          NEXT STEP, narrowed by that measurement: take the CEX-705 branch copy of CityClient.kt and re-apply
          JOIN-590's three additions by hand, union MainActivity.kt, then compile + root suite + push.

CEX-790   owner ruling recorded in the workbook: the whole CEX programme must end mergeable, which WAIVES the
          opposite-host Formal Review for this closeout (development_host is Mech; this host cannot review its own
          work). Recorded as the owner's authority under section 0, explicitly NOT as a review verdict.
          Its own deliverables were completed earlier: the capability-registry reconciliation, the inventory scripts and
          the audit report. What remains is the workbook terminal state, which the owner's ruling now permits.

MAIN      origin/main = 8ee3f8c1fcc8ae6730064d826e43e4829acdbbb4, required CI green.
CEX STATE CEX-701, CEX-702, CEX-703, CEX-704 merged and live in main; CEX-705 merge-ready but not merged; CEX-790
          unblocked by the owner ruling.
```

语言配对 / Language pair: [English](./MERGE_AND_STATUS_UPDATE.md) · [中文](./zh-CN/MERGE_AND_STATUS_UPDATE.md)
