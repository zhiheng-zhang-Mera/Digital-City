# REX-802 — 正式复检报告（对侧物理宿主）

> 完整中文阅读译本。[英文原文](../REVIEW_REPORT.md)为正式结论来源；证据代码块原样保留，本文不修改 canonical authority。

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex (MERA-ALIANWARE)
REVIEWED HEAD       833279cae237080cca88b1b6dbc9f217027ba68f
BRANCH              rex/REX-802-Alien-codex-trace-foundation (remote tip equals the reviewed head)
BASELINE            0e9bea3ce739b979e582a428af8fb233045a5e75
REQUIRED ANCESTOR   69a097b5394a9fece39dd11cc13f04c9b4d28bfe — verified reachable
                    (git merge-base --is-ancestor exit 0), not assumed
REVIEW BRANCH       review/REX-802-mech-review @ f94967e (probes)
EXACT-HEAD CI       V0.2 checks push run 37211053490 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR17 pull run 37211470934 completed/success on the same head
                    City linkage check run 37211470918 completed/success (reciprocal-contract)
VERDICT             PASS
FINDINGS            F1 LOW · F2 LOW · F3 LOW (control plane) · F4 LOW (test fidelity)
                    none blocks the verdict
TERMINAL MARKER     RESEARCH_TRACE_FOUNDATION_ACCEPTED released
```

## 1. 本复检如何执行（以及未采用何种方式）

二十个变更路径，新增 431 行、删除 11 行：新 trace service、`services/dev-gateway/server.mjs` 实际修改、Web surface、Android surface、文档及证据。报告没有从开发报告、PR body、comment 或作者测试标题推断结论。

```text
author suite, unmodified   tests/rex802-trace.test.mjs            -> 12 tests / 12 pass / 0 fail
                           tests/rex802-gateway.test.mjs          ->  6 tests /  6 pass / 0 fail
                           (18 focused, matching the author receipt's focusedTests.passed=18)
reviewer probes, new       tests/rex802-mech-review-probes.test.mjs -> 8 tests / 8 pass / 0 fail
                           tests/rex802-mech-review-web.test.mjs    -> 3 tests / 3 pass / 0 fail
Android, executed here     :app:testDebugUnitTest -> 15 suites / 83 tests / 0 failures / 0 errors
                                                     (ResearchTraceTest 3/3, host MEGA-REP)
                           :app:assembleDebug      -> BUILD SUCCESSFUL, app-debug.apk 10,500,445 bytes
repo gates, executed here  check-bilingual  -> docs / evidence / data-records all SYNCHRONIZED
                           browser-relay-check -> PASS 18/18
full suite, head           tests/*.test.mjs -> 1275 tests / 1268 pass / 7 fail
full suite, head - probes  same files without my probe files -> 1264 tests / 1259 pass / 5 fail
full suite, BASELINE       tests/*.test.mjs -> 1246 tests / 1242 pass / 4 fail  (control run, see §5)
```

每个 backend probe 都在新 store 上运行真实 `createGateway` 并驱动真实 route；Web probe 驱动同一 Gateway 上真实 headless browser，读取渲染 DOM。Android parser 还针对复检源在仓库外执行。

因**我自己**错误假设导致初稿失败的探针，保留在 comment，不悄悄修掉：因错误原因失败的初稿看起来与产品缺陷完全一样。

```text
node registered with a hand-written capability list   -> claim returned no task (needs REQUIRED_TASK_CAPABILITIES)
owner token posted to /api/v0/node/register           -> 401, which read as "no resource observation exists"
canary planted in task `input` / node `metadata.seed` -> absent from canonical truth; the City drops both
`innerText` on a closed <details>                     -> "the data is not there" when it was merely collapsed
```

## 2. 工作书要求制造的七种情形

Review 要求复检者**制造**缺失、重复、乱序事件、过期时钟、重启、partial trace、collector failure，并证明 collector failure 不拖垮 Utopia 产品运行。下列情形均在真实 Gateway 或真实 collector 上制造：

```text
missing event        PROBE C: seq 2 -> 7 draws SOURCE_SEQUENCE_GAP on the record that jumped, and the recording
                     drops to PARTIAL. The gap is data, not a silent merge.
duplicate event      PROBE C: the same event id observed twice draws DUPLICATE_EVENT on the repeat.
out-of-order event   PROBE C: seq 5 arriving behind watermark 7 draws OUT_OF_ORDER_EVENT, and the record keeps its
                     own sourceSeq 5 - normalization does not renumber the source.
stale clock          PROBE C: a 10-minute-old source timestamp draws STALE_SOURCE_TIMESTAMP; PROBE F confirms the
                     declared clock source travels with the sample (EXTERNAL_DECLARED_WALL_UTC vs CANONICAL_EVENT_WALL_UTC)
                     and that the two clocks stay separate.
restart              PROBE D: a genuinely new gateway over the same directory restores the retained window,
                     opens a new recording epoch, and keeps restored records carrying their own run id.
                     (The scope question this raises is finding F2.)
partial trace        PROBE E: a hung writer plus queueLimit=1 -> droppedRecords>0, retained window bounded,
                     flush times out at 30 ms instead of blocking, completeness PARTIAL, counterScope declared.
collector failure    PROBE A: a storage whose load and append NEVER settle - not fail, never answer. The gateway
                     starts and completes register -> create -> claim -> RUNNING -> COMPLETED, the whole lifecycle
                     inside 10 s, canonical state COMPLETED, health 200, and the trace endpoint still answers
                     instead of hanging with its storage.
                     PROBE B: a storage that throws with a private message -> typed failure code, storageState
                     FAILED, completeness PARTIAL, and the private message never appears in the trace.
```

**最强的负向主张通过植入证据测试，而非仅检查代码。**

```text
"raw payload/result/error never copied"   PROBE G: a canary is placed in a reported FAILED task's error/result,
                                          proven present in canonical events, and proven ABSENT from the whole
                                          serialized trace - while the record still names the event and its task ref.
"only the owner may read"                 PROBE G: anonymous 401, worker token 401, enrolled member 403 with a
                                          refusal code naming the owner requirement, owner 200. A POST to the path
                                          is 404, so the trace is read-only at the HTTP boundary.
"the trace cannot rewrite product state"  PROBE F: canonical task state is unchanged by observation; the trace holds
                                          a reference, the City holds the state.
"no measurement is invented"              PROBE F: a genuinely measured 0 stays 0 with reason null; latencyMs,
                                          backoffMs, autonomousSpanMs and taskTransitionCount stay null WITH a
                                          NOT_OBSERVABLE reason; an omitted heartbeat sample does not replay the
                                          previous measurement; experimentRunRef stays null with a reason.
```

## 3. 发现

### F1 — LOW：`completeness` 与实用性方向相反，原因不易读取

**观察结果。** `snapshot()` 将以下任一情形视为 `partial`：storage 非 READY、drops、retention truncation、failures，或**任一 record 有 annotation 或缺 optional field**。两个极端均已测量：

```text
bare collector, zero records                       -> completeness COMPLETE   (nothing is missing from an empty set)
every recording the real Gateway can produce       -> completeness PARTIAL    (always)
fully-declared synthetic record (all 5 dimensions
+ softwareSha + configRef, no annotations)         -> completeness COMPLETE
```

因此该字段测量的是“是否声明全部可选外部身份”，而非“recording 是否可信”。City 即使完美录制，零 drop、零 truncation、零 failure、零 annotation，也永远报告 PARTIAL，因为 Gateway event 不携带 `experimentRef`、`experimentRunRef`、`providerRef`、`modelRef`、`channelRef`，collector software refs 也是声明而非推导。

**测得的用户后果。** Web 显示总 `PARTIAL`，但解释原因的逐 record `missingFields` 仅在展开折叠 raw JSON 后可读。Android 相同，整个 blob 输出为无标签单个 `Text`，没有采用其他 panel 使用的共享 technical-details component。工作书要求用户看到“trace completeness / missing fields”，用户却只看到常量，看不到原因。空集 COMPLETE 在产品中**不可达**：Gateway 在应答前就发出 `CITY_STARTED`；所以它只是字段含义证据，不作为产品可见状态。

**严重性依据，不靠假定。** 常量方向保守，不可能过度声称；作者有文档说明 discarded history 不呈现为 complete run；要求的 `drop_or_gap` 类事实另有字段完整提供。所以 LOW，不是真实性缺陷：问题在于一个字段被要求回答两个不同问题，导致用户答案恒定。

**最小修复边界（此结论不要求修复）：** 分离问题，例如 `captureIntegrity: COMPLETE|PARTIAL` 对应 drops/truncation/failures/annotations，另设 `fieldCoverage`，把聚合缺失字段名呈现为有标签行。范围为 `services/research-trace/index.mjs` 和两个 surface。

### F2 — LOW：重启后 snapshot run id 过度概括恢复窗口

**观察结果**（PROBE D）：同目录上的新 Gateway 返回**新**顶层 `runId`，而 `records[]` 含有自身 `runId` 属于上个 epoch 的记录。记录正确地**未**改 label，但异构窗口对象只暴露一个 run id，没有 per-record run filter 或 restored-record count。唯一披露是 `counterScope: CURRENT_COLLECTOR_EPOCH_AND_RETAINED_WINDOW`。

工作书要求用户看到**当前 run**，capability record 将用户信息描述为“recording run versus experiment run”。若读者把 `snapshot().runId` 视为 `snapshot().records` 范围，每次重启后都会误读；两个 surface 都未区分。

**最小修复边界：** 在 run id 旁暴露 restored count 和/或逐 record epoch，或按 current run 过滤 `records` 并将其余标为 restored history。只涉及呈现和一个字段，不涉及 canonical truth。

### F3 — LOW（control plane）：工作书缺八个 template field，包括全部四个 capability field

相对 `MISSION_TEMPLATE.md`，`REX-802` frontmatter 缺失 `capability_ids`、`capability_registry_action`、`capability_registry_refs`、`capability_registry_sync_status`、`monitor_observability_evidence`、`monitor_observability_refs`、`decision_trace_evidence`、`decision_trace_refs`。

这不是声明 NOT_APPLICABLE：registry 中 `CAP-RESEARCH-TRACE-001` **存在**，source workbook 为 REX-802，并声明 `registry_reconciliation_result: CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW`，known gaps 包含对侧物理宿主正式复检待定。工作书不具名 capability，读者无法对账。**本次关闭过程已对账**（§4），同时记录为复检 control-plane artifact 的缺陷，不悄悄修复。

### F4 — LOW（test fidelity）：Android unit test 使用的 JSON null 语义与 device 不同

`apps/android/app/build.gradle.kts:18-20` 已明确说明：本地 unit test 的 android.jar 中 `org.json` 是 stub，所以 `testImplementation("org.json:json:20180813")` **只加在 test classpath**。两个实现对 parser 关心的情形不同：

```text
reference org.json (unit tests)   optString(name) on JSON null -> ""       (executed against the jar)
shipped Android runtime           optString(name) on JSON null -> "null"   (measured on a physical device: JOIN-590
                                                                           DEVELOPMENT_REPORT.md:410-413, where the
                                                                           4-character text caused a City identity conflict)
```

`ResearchTrace.kt:14`、`:17` 使用 `takeUnless { it.isBlank() || it == "null" }`。因此 guard 在 device 上**正确且关键**，但 `ResearchTraceTest` **不能**覆盖该分支，因为 test classpath 上该字符串从不出现，仅 `isBlank()` 已满足断言。测试通过、代码正确，但危险分支覆盖不等于绿色套件暗示的覆盖。

**INVALID INSTRUMENT，保留。** 委派 Android 工具根据 reference jar 行为判断 guard 是 dead code。对交付应用而言结论**错误**，因此记录为工具错误，而非产品缺陷；遵守与错误原因失败的 reviewer fixture 相同纪律。android.jar 也无法判断：对 `platforms/android-36/android.jar` 执行 `javap -c`，`org.json.JSONObject.optString` 是 `throw new RuntimeException("Stub!")`。

### 3.1 已测试并拒绝的假说（保留，避免重开）

```text
pre-commit event capture through a second writer
  All four transaction sites in server.mjs go through atomicWithTrace, and no other module that holds the gateway's
  `emit` calls store.atomic: services/capability-bridge/invocation-store.mjs owns two atomics and neither emits, while
  bridge.mjs calls emit only AFTER save(row) has returned, i.e. after commit. The single `transactionTrace` variable
  is not re-entrant, but a nested store.atomic would throw at BEGIN inside the outer transaction, so the corruption
  state is unreachable rather than merely unobserved.

`b.telemetry.cpu` TypeError on the register/heartbeat path
  observeResources dereferences b.telemetry.cpu.usagePercent, but validateTelemetry (contracts/pairing-v1/descriptor.mjs)
  requires `t.cpu` and a numeric-or-null usagePercent and throws before the route reaches it; a missing cpu is a 400,
  not a 500. Not reachable.

research grade inflation (highest_research_grade_observed: G4_RARE_SYSTEMIC)
  Verified against mission-book/RESEARCH_SIGNAL_WATCHLIST.yaml: the nine cited signals are 7 x G3_SPARSE_ACTIVE and
  2 x G4_RARE_SYSTEMIC, so G4 is the maximum of the declared set, and RESEARCH_EVIDENCE_PROTOCOL §6D maps G4 ->
  MAXIMUM_BOUNDED, which is the declared capture level. The value is a classification of the workbook's watchlist
  hits, matching the established reading elsewhere in this programme. No finding.

"provenance is not visible to the user"
  Tested through the browser: the provenance statement lives inside the folded technical details on Web (and inside
  the toggled section on Android). The workbook says the user must be ABLE to see it and explicitly allows raw ids to
  be folded into technical details on an L4_TECHNICAL surface, and the capability record names "expand technical
  details" as the user control. Reachable by one click, so this is recorded as tested-and-accepted, not as a defect.
```

## 4. 独立检查完成门槛

| # | 门槛（工作书完成门槛） | 结论 | 依据 |
|---|---|---|---|
| 1 | trace schema | PASS | closed key sets；authority/eligibility/grade/intervention enum 验证；40-hex SHA 检查；time-shape 检查；结构化 rule-lifecycle/supervision/semantic-integration 维度 |
| 2 | collector | PASS | record/queue/byte limits 验证并封顶；commit-stage observation；完整 `record()` 不向 caller 抛异常；有界 flush/close；typed failure 不泄露 private detail |
| 3 | normalized view | PASS | load 时确定性 replay 检查，`TRACE_REPLAY_MISMATCH` 拒绝 replay 不同的 storage；声明 transformRef；raw sourceDigest；分离 source/capture/monotonic clock |
| 4 | 用户可观察性 | PASS（F1、F2 已记录） | owner-only Web + Android surface；真实浏览器测量；member refusal guidance；离线诚实；标识符折叠；检查分支无虚构数值 |
| 5 | review / CI / material index | PASS | 本报告；37211053490 / 37211470934 / 37211470918 在复检 head 均 success；`reports/REX-802/PAPER_MATERIAL_INDEX.md` 存在，watchlist grades 已验证 |
| 6 | terminal marker | RELEASED | `RESEARCH_TRACE_FOUNDATION_ACCEPTED` |

工作书硬规则及其判定位置：

```text
does not copy canonical task/action truth   PROBE G (canary absent) + inspection: only identity refs are retained
trace may reference, not rewrite, state     PROBE F and PROBE G: canonical state is the only state that changes
clock source / timestamp semantics recorded PROBE F: source clock, capture clock and monotonic epoch are separate fields
missing measurement is unknown, never 0     PROBE F: 0 preserved as 0; four metrics null WITH reasons
raw -> normalized transformation reviewable persisted raw row + context + sourceDigest + transformRef + replay check
```

本次复检执行的 registry reconciliation：

```text
capability-registry/records/CAP-RESEARCH-TRACE-001.yaml
  registry_reconciliation_result  CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW -> FORMAL_REVIEW_RECONCILED
  known_gaps                      "Opposite physical-host Formal Review pending" replaced by the PASSED record
  evidence                        reviewer probes + this report added as review refs
workbook REX-802
  status IN_PROGRESS -> COMPLETE, review_complete false -> true, review_ci set to the verdict,
  the eight missing template fields backfilled from the verified record (F3)
```

## 5. 回归与失败分类

本宿主执行三次完整 root suite：复检 head 加我的 probes，复检 head 排除我的 probes，以及 **baseline** control run。以下具名失败，不仅计数：

```text
BASELINE 0e9bea3c            1246 tests / 1242 pass / 4 fail
  host-city-launcher.test.mjs   x3  -> "requires a free coordination port; refusing to disturb an active City",
                                       "this host is already joined", "Requires a free local host reservation"
                                       ENVIRONMENTAL: a resident City holds the coordination port on this host.
  relay-s1-tunnel.test.mjs      x1  -> "a sustained burst is refused with 429 rather than served"
                                       FLAKY, AND REPRODUCED AT THE BASELINE: it fails with REX-802 absent entirely.

HEAD 833279ca, probes included 1275 tests / 1268 pass / 7 fail
  host-city-launcher x3, relay-s1-tunnel x1        -> the four above, unchanged
  mesh301-strict-target.test.mjs   x1  -> "Alien-Win must now be known but offline"   (7/7 in isolation)
  theme-build-bridge.test.mjs      x1  -> theme lab build FAILED after 32 s           (4/4 in isolation)
  web-services.test.mjs            x1  -> "late result stays in shared history"       (2/2 in isolation)

HEAD 833279ca, MY PROBES EXCLUDED  1264 tests / 1259 pass / 5 fail
  host-city-launcher x3, relay-s1-tunnel x1        -> unchanged, as above
  theme-build-bridge x1                            -> still fails under full-suite load
  mesh301 and web-services                         -> NO LONGER FAIL
```

三方对比据证分类全部七项：

```text
3 x host-city-launcher        ENVIRONMENTAL. Identical at the baseline; the resident City holds the coordination port
                              by design and the tests refuse rather than disturb it.
1 x relay-s1-tunnel           PRE-EXISTING FLAKE. Fails at the baseline commit, so it cannot be attributed here.
1 x theme-build-bridge        LOAD-SENSITIVE FLAKE, previously recorded in this programme as flaky under full-suite
                              load. It fails in BOTH head runs (including the one without my probes) and passes 4/4 in
                              isolation, but did NOT fail in this particular baseline run, so this review claims a
                              load-sensitive flake and NOT a baseline reproduction.
2 x mesh301 / web-services    MEASUREMENT EFFECT OF MY OWN INSTRUMENTS. They pass at the baseline, pass at the head in
                              isolation, pass at the head with my probes excluded, and fail only in the run that also
                              launched three headless browsers from my Web probe. The cause is suite composition, not
                              the reviewed commit.
```

复检提交未修改 rate limiter、strict-target inventory、theme bridge 或 services adapters。权威记录是复检 head 的 CI：**三个 run 全部 success，全部 job success**。

## 6. 本复检不作的主张

- **没有物理 device rendering。** Android surface 通过仓库外 parser 执行、Compose panel 阅读、亲自运行 `:app:testDebugUnitTest`（83/83）及 `:app:assembleDebug` 验证。本复检未在 device/emulator 渲染 Compose UI；作者 OPPO 证据只证明 offline entry。Android online rendering 按 capability record 保持 `NOT_RUN`。
- **没有 experiment、provider、model 或 autonomy 结果。** 工作书 longitudinal question 仅为 schema support；未观察 experiment execution run、provider binding、autonomous span，trace 为其报告 `NOT_OBSERVABLE` 和原因。`highest_research_grade_observed` 被接受为 watchlist classification，不是 observed finding。
- **没有 performance 主张。** APK bytes 精确复现为 10,500,445，但 SHA-256 不同。Android build 非 hermetic；报告 byte 匹配，明确不把 hash 当作作者 build 的验证。
- F1、F2、F3、F4 在复检 artifact 中**未修复**。F3 由本复检在 control plane 对账并明确说明；其余保留最小修复边界，交给项目处理。
- 结论仅涵盖 `833279cae237080cca88b1b6dbc9f217027ba68f`。后续 head 需独立复检，不能继承本结论；`review/REX-802-mech-review` 是 review evidence，不是 merge candidate。
