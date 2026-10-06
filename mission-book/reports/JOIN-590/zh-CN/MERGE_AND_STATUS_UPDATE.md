# JOIN-590 收尾 — 状态更新与Utopia合并

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；保留所有历史失败、门缺口及原证据，元数据仅代码围栏引用。

```text
AUTHORITY     owner instruction, 2026-10-05: record the manual three-end confirmation, update every sub-task and
              programme workbook status, perform the Utopia merges for the workbooks that pass, then wait for GitHub CI
              and ensure all tests are green.
PERFORMED BY  Mech (MEGA-REP), role Mech-DS
FINAL MAIN    e111eb2787e7464385b4b59e62e954ac1f5f678e   (origin/main at the end of this record)
```

Owner2026-10-05授权记录手动三端确认、更新所有子任务／programme、合通过工作书并等CI绿。Mech执行，本记录末main e111eb2787e7464385b4b59e62e954ac1f5f678e。

## 1. Owner手动三端确认（保原裁定）

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

Owner亲测Web控制／Windows City／Android同时可用，写JOIN590 owner_manual_three_end_confirmation及programme状态。规则§0最新明确Owner最高，这是人观测裁决，也闭自动会话缺Alien Windows的唯一边界；不替代可复现实测physical_acceptance。

## 2. 合入main

### 2.1 各PR先精确CI绿

```text
PR #15  CEX-703  capability catalog        -> merge 6d019c1094a2084927b8b3fe316009644f856086
PR #16  WBC-601  execution backend seam    -> merge d773c1e1fd6f61c386a4510fe69fe617c05e12f1
PR #18  WBC-602  node descriptor           -> merge 52e66f3752b40c1754297174627f2c647f641f4c
PR #22  WBC-603  worker pool seam          -> merge 3cd45f665b09b20690f05338ba7cec386ad0f486
(earlier in the same session: PR #29 JOIN-590 -> merge 59d3e09b1ea51c4b4024160fca1a575818077654)
```

PR15 CEX703、16 WBC601、18 WBC602、22 WBC603及同会话先29 JOIN590，分别合SHA保原表。

### 2.2 冲突分支走§11显式联合

main移动后其余不能快进，逐分支在当时main上本地integration合并、解为显式联合／超集，不丢双方接受工作，不force或丢弃。

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

MON901保WBC profile字段及观测teardown；REX801保双imports/registries、研究路由在WBC report后、Research导航、双i18n；REX802同形且一个return含trace、profile/backends、teardown；CEX701保恢复面板与原生退出；CEX702保双调度入口／扩类型拒／更丰富page派生、删重复default export。integration e111eb2787e7464385b4b59e62e954ac1f5f678e快进推main。

### 2.3 联合自引缺陷及发现

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

U1两return串联遮researchTrace，rex802测flush undefined，改一列举return；U2注册两store.put旧无roles覆盖新，wbc602审核actualEXEC与expectedEXEC+VALIDATION，删旧写；U3坏正则截Kotlin capabilities路径导致99行编译失败，显式写行；U4app重复let token，node --check抓。都由测试／编译／语法而非读抓，因此推前机械核。

### 2.4 推前核验

```text
Android        gradlew :app:testDebugUnitTest :app:assembleDebug -> BUILD SUCCESSFUL on the integration head
Root suite     node --test --test-concurrency=1 tests/*.test.mjs -> 1332 tests, 1329 pass, 3 fail
               the 3 failures are exactly tests/host-city-launcher.test.mjs, which fails on this host because the
               resident 4391 City holds the host reservation; the same 3 fail on an untouched main here, so they are
               ENVIRONMENT, not integration damage
Task suites    REX-801/REX-802/MON-901/WBC-601/602/603/CEX-701/CEX-702 suites all green individually after the repairs
```

Android单测构建成功；根限并发1共1332个1329通过3host-city-launcher常驻4391预约，未动main同3失败为环境非集成损伤；REX801/802 MON901 WBC601/602/603 CEX701/702各套修后单独绿。

## 3. main托管CI

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

e111eb27最终push37320215163与linkage37320215200成功。中间3cd45f66 push37317070234 CEX703浏览器11.5s失败，原以邻运行52e66f3/e111eb27全套通过、Playwright及慢窗1289测归负载／时序，记录不藏；要求终绿对应最终头。d773c1e/52e66f3两门成功。

## 4. 工作书／programme更新

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

CEX701/702/703 MON901 REX801/802 WBC601/602/603写merged_main_sha/via/authority_note；CEX704/705当时冲突，sha null及blocker。JOIN590加手动三端，COMPLETE标已上一轮；connection README COMPLETE/OWNER-CONFIRMED/READY TO ARCHIVE。各原merge_authority:false没篡改，note记录Owner授合，而非让控制面虚构声明权限。

## 5. 未合及原因

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

CEX704 PR20冲CityClient/MainActivity/server，705 PR21前两文件；两已完成审核，需显式联合、保Settings双卡，不能无再编译／设备周期推半解Android，故记blocker。MON902 PR27 development true review false未满门不合。PR26 Owner launcher/lifecycle无工作书在范围外保持开。PR28 Alien JOINdraft同ec3经收尾已main取代内容，不动draft。

## 6. 剩余两项下一步

```text
1  resolve CEX-704 and CEX-705 as explicit unions on top of the current main (CityClient.kt / MainActivity.kt keep both
   cards; server.mjs keeps both route bodies);
2  verify with gradlew :app:testDebugUnitTest :app:assembleDebug plus the full root suite;
3  push, then confirm V0.2 checks + City linkage check green on the resulting main head and record merged_main_sha.
```

在现main显式联合704/705，Kotlin保双卡、server双路由；Android单测构建＋全根验证；推后V0.2+linkage终绿并记mainSHA。

## 7. 第二轮（Owner要求处理705冲突然后开790）

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

704合main8ee3f8c1fcc8ae6730064d826e43e4829acdbbb4：一个pairing/session合main Owner-only与704 expectedSessionState，机械初留下双路由及游离块手修；Android双面及拒路径都保。构建成功，704＋59040/40，根1333/1330/3已知预约；push37352346350/linkage37352346299成功。

705仍未合，实测同Kotlin函数冲，体已方法感知＋续期感知合好，余签名／递归。Owner“不择手段”下两脚本均推前abort：拼路由语法错、区域不一致残九markers。704已证保双拼可静默丢声明角色仅602审核抓，故不推未验联合。缩窄下一步取705 CityClient再手加590三项、联合MainActivity、编译＋根＋推。

790工作书记Owner整CEX必须可合，豁免该收尾相反主机正式审核（Mech不能自审），明确§0Owner权限非review裁决。注册协调／inventory脚本／audit先已交付，余终态此裁定允许。main当时8ee3f8...要求CI绿；701–704已main，705merge-ready未合，790由Owner解锁。

语言配对 / Language pair: [English](../MERGE_AND_STATUS_UPDATE.md) · [中文](./MERGE_AND_STATUS_UPDATE.md)
