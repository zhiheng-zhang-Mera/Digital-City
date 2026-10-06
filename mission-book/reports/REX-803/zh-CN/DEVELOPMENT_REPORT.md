# REX-803 开发报告——Mech

[English source / 英文原文](../DEVELOPMENT_REPORT.md)。阅读译本保留历史状态，current workbook/report 仍为 authority。证据 block 内容不变；英文源§4 漏代码围栏关闭，阅读副本仅补围栏以恢复§5–7 标题显示，不改原文件。

```text
WORKBOOK            mission-book/research-strengthening/REX-803-scenario-runner-and-repetition-engine.md
DEVELOPMENT HOST    Mech (COMPUTERNAME MEGA-REP), role Mech-DS
BRANCH              rex/REX-803-mech-scenario-runner
BASELINE (claim)    213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef   (main at claim time; dependency union already inside)
DEV HEAD            a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df
                    (four heads: the seed repair D-7, the physical campaign evidence, and this hardening pass D-8/D-9)
CI (exact head)     MEASURED PER RUN on a695bb9f: push 37407868473 attempt 1 SUCCESS, pull_request 37407871700 attempt 1
                    SUCCESS, linkage 37407871716 attempt 1 SUCCESS. No run on this head failed. Local: 41 tests pass
                    (REX-803 + REX-801 + REX-802).
                    earlier green heads: 85a79eca4fe0f4ad8882148725249e016434873e, e284b712c53e5b7f44acdb878afd6a23c7953735
PR                  zhiheng-zhang-Mera/utopia#31  (development, open)
PHYSICAL CAMPAIGN   two controlled campaigns on the LIVE resident City with the physical Android handset as the
                    connected control surface; evidence in utopia:evidence/raw/mission-book/REX-803/
REVIEW HOST         Alien  — OUTSTANDING, not performed by this host
MARKER              SCENARIO_REPETITION_ENGINE_ACCEPTED  NOT released
```

## 1. 已实现

Campaign 将 REX-801 registry 一个已描述 experiment 的一个 canonical scenario 重复 N 次。每次通过与 POST/api/v0/tasks 同一 createCityTask 路径创建普通 City task，run outcome 就是其真实 terminal state。runner 不持有 work，write/assign/complete/cancel 均通过 City 自身 functions，无 simulation path。

```text
services/dev-gateway/scenario-runner.mjs          the repetition engine (pure, injected clock, no randomness in seeds)
services/dev-gateway/server.mjs                   campaign controller + owner-only routes + per-run trace receipts
apps/web/research-campaign.js                     DIRECT_CONTROL / OBSERVABLE surface (new page, Advanced group)
tests/rex803-scenario-runner.test.mjs             12 engine probes
tests/rex803-campaign-surface.test.mjs            4 route/E2E tests against a real Gateway
tests/rex803-campaign-web.test.mjs                2 browser tests (Playwright)
```

Routes：GET/api/v0/research/campaigns、POST 同路（start/resume/abandon）、POST/api/v0/research/campaigns/stop、GET/api/v0/research/campaigns/<id>。

## 2. 决定与理由（Owner 要求记录未指定选择）

| ID | 问题 | 决定 | 理由 |
|---|---|---|---|
| D1 | scenario 定义 | contracts/city-control-v0 taskTypes 中的 canonical 类型，不手写 list | City 不能执行不可选，平行 list 会漂移 |
| D2 | execute 或 simulate | 创建真实 task、观察 terminal | 测模拟器只能得到模拟器结果 |
| D3 | repetitions 来源 | manifest repetitions，可减少不可增加，REPETITIONS_EXCEED_DECLARED | count/MAX_REPETITIONS 属于结果评价的 description |
| D4 | campaign seed | experiment immutable identity experimentId@digest；run seed(campaignSeed,index) | 同 manifest 双 host 推同序列，不转交数字 |
| D5 | stop | manifest stopConditions，只收紧；不用 acceptance.minimumSuccessfulRuns 作 stop | 判断结果 criterion 非生产结果 bound，否则首个 passing subset 就结束 |
| D6 | warmup | 支持并记录，默认 0；manifest 无此 field，属 operator 选择非 experiment 描述 | 以 F7 记录，不暗自发明 |
| D7 | resume | 同 campaign id/seed/bounds，crash 内 run 留 INTERRUPTED 不重跑 | 避免 later measurement 替换 lost，破坏每次计一次 |
| D8 | abandon | 显式 abandon:true；无可 resume 拒 NOTHING_TO_RESUME | 不静默丢 unfinished，resume 不能暗开 new campaign |
| D9 | UI | Advanced 中 Research 旁独立 Research campaigns | describe/run 独立 reset，最终 disclosure 归 REX-807 |
| D10 | reason 在 trace 何处 | bounded/sanitized dimensions.failureCode；全文 run row/receipt | dimension 是 reference，free text 属 receipt |

## 3. 开发 defects 与捕获方式

```text
D-1  RESUME REPLAYED REPETITION 0. `drive()` always looped from index 0, so a resumed campaign appended a SECOND row
     for repetition 0 and the accounting invariant silently became false while still looking plausible.
     CAUGHT BY  this task's own engine test (duplicate measured index after resume). REPAIRED: a recorded row at this
     position means the repetition is accounted for, so the loop skips it.
D-2  TRACE RECEIPT INVALID. `deviceRef` was written into `dimensions`, where it is not a member of the dimension
     vocabulary, so EVERY run receipt failed validation inside the collector - which reports a failed record instead of
     throwing. The campaign looked traced and was not.
     CAUGHT BY  this task's route test (0 receipts where 3 were expected). REPAIRED: `deviceRef` is a canonicalRef.
D-3  UNKNOWN LIMIT KEY SILENTLY IGNORED. `limits: {madeUp: 1}` was accepted and dropped, so a caller who mistyped a
     bound would believe the campaign was bounded.
     CAUGHT BY  the refusal test. REPAIRED: an unknown limit key is refused by name.
D-4  NO WAY TO LEARN THE LIVE IDENTITIES A MANIFEST MUST DECLARE. The first browser campaign was refused
     `TOPOLOGY_NOT_READY` because the test (and any owner) had to guess the browser's control-surface ref.
     CAUGHT BY  the browser test. REPAIRED: the GET surface publishes the live worker and surface vocabulary, and the
     page shows it, because the only honest place to read those identities is the City.
D-5  MISLEADING STOP GUARD. A supplied `campaignId` was compared against the last campaign even when it had already
     finished, so a UI left open on a finished campaign got a 409 conflict instead of `stopped: false`.
     CAUGHT BY  the stop test. REPAIRED: the mismatch guard applies only while a campaign is RUNNING.
D-6  MEASUREMENT DEFECT (test harness, not product). The browser fixture failed every task from the Nth onward instead
     of the Nth, producing three failures where one was intended. The product was right; the fixture was wrong.
     Recorded, not hidden (evidence protocol §4).
D-7  THE CAMPAIGN SEED WAS THE WHOLE MANIFEST. REX-801's registry record exposes `digest` as the CANONICAL
     SERIALISATION of the manifest, not a hash of it, and the route used it directly as the campaign-seed component, so
     every run row, receipt and technical view carried `experimentId@<the entire manifest as JSON>`.
     CAUGHT BY  the FIRST PHYSICAL CAMPAIGN on the live City - not by any unit test, because the tests compared the
     seed against the same value they had used to build it, which is a weaker assertion than it looked.
     REPAIRED: the route hashes the registered document and uses a 32-character identity; the route test now asserts
     the seed SHAPE and, separately, that two campaigns of the same registered manifest derive the SAME seed, which is
     the property that was supposed to be tested. The registry's field naming (a serialisation called `digest`) is left
     as it is and raised as finding F9 for REX-801/REX-806.
D-8  AN UNUSABLE RECEIPT STORE BROKE THE CAMPAIGN LIST ROUTE (finding R-1). `receipts()` called readdirSync unguarded,
     so a single file sitting where `<runtime>/research/campaigns` belongs made `GET /api/v0/research/campaigns` throw
     ENOTDIR - the operator watching a RUNNING campaign lost sight of it even though the campaign itself was fine.
     CAUGHT BY  this task's own adversarial pass, written for this round because the opposite-host review is still
     outstanding. It is the third appearance of one failure shape in this programme: the REX-804 review blocked on a
     sibling module whose unreadable receipt stopped the City from starting, and MON-903's own pass found the same shape
     one round later. REPAIRED: the store is DEGRADED AND REPORTED - `receipts()` returns an empty list with
     `storeState: UNAVAILABLE` and a reason, `persist()` records `stateStoreFailure` instead of throwing, and the route
     publishes both. Two regression probes: one drives a campaign to completion with the receipt directory blocked and
     asserts the list route still answers and the measured outcome is still reported.
D-9  AN OUTSIDE CANCELLATION WAS CLASSIFIED AS A FAILURE (finding R-2). When an operator cancelled the run's canonical
     task through the canonical route, the run was recorded `FAILED` with the reason "the canonical task ended
     CANCELLED" - the reason was honest but the CLASS was wrong, and it mis-attributed the cause to the work.
     CAUGHT BY  the same adversarial pass. REPAIRED: an outside cancellation is `CANCELLED` with the reason "the
     canonical task was cancelled outside the campaign", so a reader can tell it from a campaign-stop cancellation, and
     `summary.failed` no longer counts it. A probe asserts the class, the reason and the accounting.
```

逐项解释：D-1 drive 从 0 循环使 resume 重复 row0，accounting 貌似合理却错；engine duplicate-index test 捕获，有 row 即已 accounted 而 skip。D-2 dimensions 内 deviceRef 不在 vocabulary，collector 不抛错但每 receipt validation 失败，貌似有 trace 实无；route 期望 3 得 0，改 canonicalRef。D-3 未知 limits madeUp 静默接受丢弃，使误拼 bound 貌似生效；refusal test 捕获，改按 key 拒绝。D-4 真实 browser 初次 TOPOLOGY_NOT_READY，operator/test 都需猜 control ref；GET 公开 live worker/surface 词汇、page 显示，City 才是诚实 identity 来源。D-5 finished campaign 仍比较 campaignId 导致 stale page409，非 stopped:false；stop test 捕获，guard 只 RUNNING。D-6 browser fixture 从第 N 个以后全部 fail 而非只 N，期望 1 得到 3；MEASUREMENT_DEFECT，产品正确，fixture 改并记录。D-7 registry digest 是 canonical serialization 非 hash，seed 变成整个 manifest JSON，污染 row/receipt/technical view；第一次 physical campaign 捕获，unit 以构造值同值比较更弱。route hash 注册 doc 为 32-character identity，测试 shape 及 same-manifest same-seed 分开；registry 命名留 F9。D-8 R-1 未 guard readdirSync，receipt dir 位置 file 令 list ENOTDIR，campaign 本身正常却失观测；作者 adversarial 捕获，是 REX804/ MON903 后同 shape 第三例；store 降级公开 UNAVAILABLE/reason，persist 记录 stateStoreFailure 不抛，route 披露；两个 guard 包含阻塞 dir 时 completed outcome/list 仍可读。D-9 R-2 外部 canonical cancel 被记 FAILED，reason 虽诚实 class 误归因；改 CANCELLED 并说明 outside campaign，summary.failed 不计，probe 校验 class/reason/accounting。

## 3Z. 作者对自身交付 adversarial self-test（2026-10-06，review 前）

对侧 review 未完，本机按此前 MON-903 reviewer-eye 方法四 probe，两成立、两 defect D-8/R-1 与 D-9/R-2，均 guard 修复：

```text
HELD   a 10,000-repetition campaign stopped immediately accounts for EVERY planned run exactly once
       (planned 10000 = accounted 10000; all 10000 explained as CANCELLED, none double counted, no missing rows)
HELD   canonical truth is untouched by a store failure: with the receipt directory blocked the task still reached
       COMPLETED and the campaign still reported its measured outcome
DEFECT R-1 (D-8) a blocked receipt store made the LIST route throw        -> degraded and reported, City-level guard
DEFECT R-2 (D-9) an outside cancellation was recorded as FAILED           -> classified CANCELLED with its reason
```

记录但不是 Review；提高对侧起点，也说明自发现而非 Reviewer 发现。修 R-1 后相同 probe 查其他 research store，merged main 仍 REX801 runtime/research 或 research/experiments 一 file 即 City 不能 start。任务已 closed/merged，本分支不碰它；测量、repair/REX-801-mech-store-guard、analysis 在[programme record](../../REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md)。

下一轮扩到 City startup 每 file store（源当时写八 trap，后续 instrument 更正仍保留历史），秒级同 shape 找 capability-bridge theme root：mkdirSync→createThemeArtifacts→createBridge→createGateway 失败。更重要是已有该 scenario test 在 broken tree 通过：construction 之后才埋 fault，复现 symptom 未复现 defect。两例、paired table、repair/capability-bridge-mech-artifact-store-guard 同 record。

### 3Y. 本机记录 draft 在 commit 前捕获缺陷

```text
OBSERVATION   the first draft of this task's development_ci field (workbook) and CI line (this report) stated that the
              push run on a695bb9f had FAILED and passed on rerun, citing run ids that this host had NOT read from the
              Actions API. It had been written from the pattern of the PREVIOUS task (MON-903), where exactly that
              happened, rather than from a measurement of this head.
MEASUREMENT   the Actions API shows three runs on a695bb9f, ALL attempt 1, ALL success: push 37407868473,
              pull_request 37407871700, linkage 37407871716. No run on this head failed.
CLASSIFICATION  RECORD DEFECT (unmeasured CI claim) - the same class this host recorded against MON-902 one round
              earlier and against which the mission-book tooling README explicitly warns ("the checker cannot tell
              whether a CI claim is true"). It was caught by writing the record LAST, from a per-run read, and it never
              left this host.
GUARD         the discipline that caught it is now the stated rule: a CI field is composed from an API read of each
              run (event, attempt, headSha, conclusion); a pattern from another task is never a measurement. The record
              consistency checker cannot enforce this - it has no network access by design - so the guard is the
              procedure plus this recorded near-miss.
```

CI draft 抄前任务 MON903 pattern，称 a695bb9 push 失败/rerun 成功，run IDs 未 API 读；实测三个 attempt1 全成功。RECORD DEFECT 未出本机。guard 是最后逐 run event/attempt/headSha/conclusion 写 CI，不凭其他任务 pattern；consistency checker 无网络不能证明 truth，故 procedure 与 near-miss 留证。

## 3A. 常驻 City physical campaign（2026-10-06）

要求 Alien+Mech+Android，Alien offline，只执行可达半边，记 PARTIAL 非 gate：

```text
CITY        the resident City on this host was restarted from this branch (same host reservation, same data dir, so
            the enrollments and the cityId 031fdba6-e94c-4298-a095-6ff04a65481d persisted)
TOPOLOGY    worker  dev-031fdba6e94c4298a0956ff04a65481d (this host's reference node agent, online)
            surface dev-be7832e35fc34b85966c3bb43a992e1d  (physical Android handset OPPO PERM00 over ADB)
CAMPAIGN 1  mech-android-canonical-repetition     -> COMPLETED, 3 measured of 4 planned (1 warmup), 0 unexplained
CAMPAIGN 2  mech-android-canonical-repetition-r2  -> COMPLETED, 3 measured of 4 planned (1 warmup), 0 unexplained
EVIDENCE    utopia:evidence/raw/mission-book/REX-803/ (receipt, canonical tasks read back from the City, trace run
            receipts, progress samples, pre-state, the owner-facing page, the handset)
```

每 repetition 普通 WAIT 携 researchRunRef=<campaignId>:<index>，四 task 全 COMPLETED，本机 node 执行；planned=accounted、terminalAccountingComplete true、seed 各异 derived、每 settled run 一 trace receipt 指 real task。campaign1 找 D7，campaign2 修后 same experiment …-r2@b872f35c85a66fc1d9304d5cf0b7be2f。手机 JOIN590 吊销后需 re-enroll；pairing payload 含 secret 刻意不留。

## 4. Exact-head 测试证据

```text
node --test tests/rex803-scenario-runner.test.mjs     12 pass / 0 fail
node --test tests/rex803-campaign-surface.test.mjs     4 pass / 0 fail
node --test tests/rex803-campaign-web.test.mjs         2 pass / 0 fail
REX-801 + REX-802 + WBC-601..604 suites               51 pass / 0 fail
npm test (whole tests/ glob)                        1363 pass / 5 fail
```

初写五 failure 全 inherited environment 只对一半，保留更正，因为 review pass 条件依此：

```text
capability-adapters.test.mjs  CORRUPT_INPUT in a document reader
city-roads.test.mjs           CORRUPT_INPUT in a document reader
                              FIRST RECORDED AS: environment / pre-existing, "identical at the baseline"
                              ACTUAL CAUSE (measured 2026-10-06, one worktree one head, only variable = the presence
                              of city/node_modules): absent -> 11 tests, 9 pass, 2 fail CORRUPT_INPUT;
                              present -> 11 pass, 0 fail. The document readers import mammoth / pdfjs-dist / fflate /
                              yaml from city/package.json, which ci.yml installs as a DELIBERATE SEPARATE step
                              (`pnpm --dir city install`, ci.yml line 20). This host had run a root-only `npm ci`,
                              in a repository whose lockfiles are both pnpm.
                              CLASSIFICATION: THIS HOST'S INCOMPLETE SETUP, not an environment property.
host-city-launcher.test.mjs   x3 "requires a free coordination port" -> the resident City (pid 29048) holds the host
                              reservation; these are host-owning process tests and are green when run with no City up
                              CLASSIFICATION: GENUINE HOST CONDITION
CORRECTED COUNT  with the documented two-step install the whole suite is 1356/1359, the 3 remaining failures being the
                 resident-City reservation. The reviewer pass condition in §6 should therefore be read as "green except
                 the 3 host-reservation failures", not "except the five".

```

两个 CORRUPT_INPUT 是本机只 root npm ci 而漏 ci.yml 独立 pnpm --dir city install，mammoth/pdfjs-dist/fflate/yaml 缺失；同 worktree/head 唯一变量 city/node_modules，absent11tests9pass2fail，present11pass0fail，是本机 setup 不完整非 environment 固有。其余三个 host-city-launcher 因常驻 pid29048 占 coordination port，是真 host 条件。双 install 全 suite1356/1359，只三 host failures；Reviewer 不应按“除五”接受。

## 5. 实机与 completion gate

Development release 实测如下，不假定：

```text
CITY (read from /api/v0/city on 172.31.12.151:4391, 2026-10-06)
  the resident City now runs THIS branch (deployed for the campaign; the previous tree was join590)
  nodes       alien-reference-node  online=FALSE  lastHeartbeat 2026-10-05T11:15:06Z
              dev-031f...           online=true   (this host, executed every repetition)
              dev-e1d8...           online=FALSE
  surfaces    dev-be7832e35fc34b85966c3bb43a992e1d  (physical Android PERM00, controlOnline=true)
  members     Android PERM00 re-enrolled as dev-be7832e3... after its previous enrollment was retired by JOIN-590
GATE        Alien host node OFFLINE -> a two-host manifest cannot be READY, so the full gate cannot be met from this
            host alone. Mech + Android WAS exercised end to end (section 3A) and is recorded as PARTIAL GATE, never as
            the workbook gate. The Alien host cannot be started by this host.
```

Owner restore note：常驻 City 运行 D:/utopia-rex803 head57d1c919。源记录恢复顺序 D:/utopia-join590/scripts/stop-city.ps1，然后从 desired worktree 执行 D:/utopia-rex803/scripts/start-city.ps1 -BindAddress172.31.12.151 -Port4391；host reservation C:\ProgramData\Utopia\host\city 共享，cityId/store/enrollments 跨切换保留。仅转译历史命令，不在本轮执行。

### 5A. 门槛 blocker 实测（2026-10-06T02:25Z）

三端 experiment 已 REGISTERED，尝试返回 TOPOLOGY_NOT_READY，唯一 missing alien-reference-node 并列当前 live worker/surface。详[THREE_END_GATE_MEASUREMENT](./THREE_END_GATE_MEASUREMENT.md)。mech-alien-android-two-host-repetition/TWO_HOST_MESH/utopia@57d1c919 已注册，Alien node 上线后一个 POST；仍 PARTIAL，不声称三端 campaign，此任务期间该 node 从未 online。

## 6. Claim collision（按 Owner 要求）

Alien Digital-City5baee25 11:45:02 先 claim，本机 1acdc10 11:46:24 在其上改 claim。Alien82acb5a11:56:16 对账 Mech canonical 归属、Alien 停平行 product 改 REX804。双方 ack 及 root cause 见 CLAIM_COLLISION_MECH.md / CLAIM_COLLISION_ALIEN.md。

```text
FAILURE CLASS   control-plane claim ownership drift / duplicate implementation of one task
RESEARCH LABELS DUPLICATE_IMPLEMENTATION_DUE_TO_DISCOVERY_FAILURE, MUTABLE_REFERENCE_STATE_DRIFT
REFERENCE       Alien candidate cae38b22bfb6c1050221aa4aa3e51844e3ec6e47 — read as DESIGN EVIDENCE, not merged
INHERITED       (1) a run executes a real canonical task; (2) the run reference is written onto that task, so
                orphaned campaign work is findable after a restart. Both are named here for the reviewer.
```

## 7. 交 Reviewer 开放项

```text
O1  Opposite-host Formal Review not performed. Workbooks 803's named checks: repeated execution, cancellation,
    restart, timeout, partial campaign, seed reproducibility. REVIEW_HOST=Alien.
O2  `npm test` must be green except the 3 host-reservation failures above (see the correction in §4: the two
    CORRUPT_INPUT failures were this host's missing `city` install, not an environment property, and disappear once
    `pnpm --dir city install` has run). The reviewer should confirm the same classification from their own host, where
    the resident City is not this one.
O3  The accounting invariant (`accounted === planned` with no class double counted) is asserted in tests; the reviewer
    should try to break it by a path the author did not think of (e.g. stop racing a timeout, resume racing a start).
O4  The Alien + Android half of the completion gate is unproven. This is a physical-topology blocker, not a code one.
O5  The manifest contract has no warmup field (F7). Raised here as a finding for REX-807/REX-801 follow-up; not
    repaired inside REX-803's file ownership.
F7  FINDING: an experiment describes repetitions but cannot describe warmup, so a campaign that uses warmup measures
    something the description does not contain. Recorded; the campaign receipt carries the warmup it actually used.
F8  FINDING (reality drift, observed on hardware): `ANDROID_CONTROL_SURFACE` is satisfied by a NAME, not by a platform
    fact. The topology gate requires a declared control surface whose text matches /android/i, while the City's native
    Android enrollment stores the device id as the app's client ref
    (`apps/android/app/src/main/java/city/utopia/control/NativeEnrollment.kt` writes `record.deviceId` into
    `clientRef`), so the live surface the City reports is `dev-be7832e35fc34b85966c3bb43a992e1d` - an identity that can
    never satisfy the Android topology. The physical campaign therefore declared `SINGLE_CITY`, which is the topology
    the City actually had. Recorded for REX-807; not repaired inside REX-803's file ownership.
F9  FINDING: REX-801's registry record field `digest` holds the canonical serialisation of the manifest, not a hash of
    it. The name and the content disagree, and using the field as an identity produced defect D-7. Raised for
    REX-801/REX-806.
F10 FINDING (LOW, from the physical run): after a campaign finishes, the owner-facing form still shows the values the
    operator last typed (repetitions 3, warmup 0) while the campaign that ran used warmup 1. The campaign totals state
    the truth, so nothing is hidden, but the form does not echo the running or last campaign's own parameters.
    Recorded for REX-807 (research control surface).
MERGE AUTHORITY  false — this host does not merge REX-803. Terminal marker NOT released.
```

O1 对侧未 Review，必验 repeat/cancel/restart/timeout/partial/seed，Alien 负责。O2 全 suite 除三 host reservation 应绿，Reviewer 自行分类。O3 尝试 stop-timeout、resume-start race 破 accounted===planned。O4 Alien+Android 未证，physical blocker。O5/F7 manifest 无 warmup，却测 warmup，receipt 记录实际值，转 REX801/807 不超本 scope。F8 ANDROID_CONTROL_SURFACE 按/android/i 名称而非 platform 判断；NativeEnrollment 将 record.deviceId 作 clientRef，实机 dev-be7832e35fc34b85966c3bb43a992e1d 永不匹配，所以 physical campaign 声明真实 SINGLE_CITY；交 REX807。F9 digest 实际 serialization 非 hash 造成 D7，交 REX801/806。F10 LOW form 仍最后 typed repetitions3/warmup0，而 actual warmup1，totals 真实未隐瞒；交 REX807。merge_authority=false，本机不 merge，marker 不释放。
