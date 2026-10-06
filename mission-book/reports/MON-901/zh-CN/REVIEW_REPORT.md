# MON-901 — 对侧物理主机评审报告

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态。历史与未知边界保留，原证据块代码围栏保留，不新增验收。

Mech MEGA-REP对不同实体author Alien-codex评审。精确head/branch/baseline及三成功CI如下，PASS、F1 LOW/F2 INFORMATIONAL均不阻。

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex
REVIEWED HEAD       7eb38f1b930dfe6cc13dab0e17dedee467b1254b
BRANCH              mon/MON-901-Alien-codex-observation
BASELINE            d3262ce2dd81e51a53e39e6f9add8dee650a7682
REVIEW BRANCH       review/MON-901-mech-review @ d68afa225d3f6abb9ba93583745b305e9705fddc (probes)
EXACT-HEAD CI       V0.2 checks push run 37242446183 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR24 pull run 37242505126 completed/success on the SAME head
                    (jobs: android success, gateway-web success)
                    City linkage check pull run 37242505131 completed/success
                    (job: reciprocal-contract success)
VERDICT             PASS
FINDINGS            F1 LOW, F2 INFORMATIONAL — neither blocks the verdict
```

## 1. 如何评审，以及未如何评审

小范围九路径、847增/1删＝三Gateway源码/一新test/三docs/两raw receipt。全本物理host测，不从dev report/PR/test title推。

```text
author suite, unmodified   tests/mon901-observation.test.mjs  -> 8 tests / 8 pass / 0 fail
                           tests/gateway.test.mjs            -> 4 tests / 4 pass / 0 fail
reviewer probes, new       tests/mon901-mech-review-probes.test.mjs -> 6 tests / 6 pass / 0 fail
```

作者原样8／8观察＋4／4gateway，新6／6；每probe fresh temporary store真实createGateway、真实HTTP，不直接模块或旧fixture。不同WBC603，无旧test改，测而非假设：

```text
git diff --name-status d3262ce2..7eb38f1b -- 'tests/*' | grep -v mon901   ->  (empty)
```

diff过滤mon901余空，因此无放宽需补偿；作者原suite为旁证非判据。

## 2. 工作书四检查及判据

独立精确runtime四点各map probe及programme失败标签：

| # | 要求 | probe | 排除标签 |
|---|---|---|---|
|1|projection非task truth|1|DASHBOARD_BECOMES_SECOND_TASK_TRUTH|
|2|JEV失败不freeze|2|MONITOR_SYNC_BARRIER/DECISION_TIMEOUT_GLOBAL_IMPACT|
|3|投影匹配规范runtime|3|MONITOR_REALITY_DRIFT/EDGE_CAUSALITY_MISSING|
|4|risk留exact pointer|4|SUMMARY_HIDES_ACTIVE_RISK/DECISION_PROVENANCE_MISSING|

```text
PROBE 1  reading /api/v0/monitor twice changes no task row, no node row and appends no canonical
         event; the returned object exposes no put/create/dispatch and no `tasks` collection, so it
         cannot be mistaken for the store. Canonical state after the reads is still RUNNING/40 on n1.
         AUTHORIZATION, checked from outside because the docs claim it: anonymous -> 401,
         worker/node token -> 401, control token -> 200, missing api/schema version -> 409.

PROBE 2  the canonical reader is made to throw. The monitor answers 200 with
         health=UNAVAILABLE / failure=CANONICAL_SOURCE_UNAVAILABLE / authoritative=false instead of
         500ing or pretending to be live, and while it is dead a full claim -> RUNNING -> COMPLETED
         cycle still finishes and the canonical task row reaches COMPLETED. Restoring the reader
         makes the next read live again, with no restart.

PROBE 3  for two real tasks, projected state / hostRef / progress equal the canonical rows exactly;
         ownerRef is null with ownerObservability=NOT_OBSERVABLE rather than an invented owner; the
         ASSIGNED_TO edge carries targetPresent and names its own reason; every projected event id is
         a real canonical event id whose seq and type match the canonical event.

PROBE 4  the window is forced to limit=1 against a population of 13 tasks. The projection admits
         tasksOmitted>0, drops to health=PARTIAL, raises unobservedTaskRisk, and its evidence pointers
         are exact records (source, path, canonicalEventId, seq) that resolve against the canonical
         store - not prose.
```

完整中文对应：1两read无task/node变化/事件追加；对象无put/create/dispatch/tasks集合，非store，规范仍RUNNING40/n1；外部验anonymous401、worker/node401、control200、缺api/schema409。2canonical reader抛，monitor200健康UNAVAILABLE/failure CANONICAL_SOURCE_UNAVAILABLE/authoritative false，非500/假live；其死时完整claim/RUNNING/COMPLETED完成、row COMPLETED，恢复reader下read live无需restart。3两真task state/hostRef/progress精确row，ownerRef null/NOT_OBSERVABLE非编owner；ASSIGNED_TO targetPresent/自身reason，event ID/seq/type真规范。4 limit1/13 task时tasksOmitted>0、PARTIAL、unobservedTaskRisk；pointer source/path/canonicalEventId/seq可resolve store非prose。

### 2.1 只有负例能判的两主张：植canary

docs说raw payload/result/error/credential/hidden reasoning不复制、worker token不能读；positive不能证absence。PROBE6规范植unique后搜：

```text
marker present in canonical truth?      events: yes (TASK_FAILED payload.result/error)
                                        task row: yes (result/error)
marker present in the whole projection? no  (JSON.stringify(view) of the entire monitor object)
task state still observable?            yes — FAILED survives as state, so this is redaction,
                                        not omission of the fact
```

中文对应event TASK_FAILED payload/result/error及task row marker均有；完整JSON view无；FAILED state仍可见，是redaction非省事实。

### 2.2 作者raw receipt验hash，不信任

validation-receipt raw_sha256 canary=18003d74374c869ea9325d5a77bcf51b8ec88df0831cdda1d6b68f14df43514a；已提交blob git show7eb38f1b重算逐字节同。receipt physicalDevices NOT_RUN、executor CONTROLLED_PROTOCOL_REPORT_NOT_HARDWARE_BENCHMARK、performance_claim false；作者未称slice未产物理/性能。

## 3. 发现

### F1 — LOW：completeness.continuous常量与旁computed矛盾

观察observation.mjs base continuous false硬码，位computed completeness内，旁historyGap同义计算。真实seq1起complete连续两者矛盾：

```text
canonical event seqs                       1,2,3,4     (nothing deleted, nothing omitted)
completeness.tasksOmitted                  0
completeness.eventsOmitted                 0
completeness.historyGap                    false       <- computed, and correct
completeness.continuous                    false       <- constant, and contradicts the above
health                                     COMPLETE
```

中文对应seq1,2,3,4零删/omit，tasks/events omitted0，historyGap false计算正确，continuous false常量矛盾，health COMPLETE。PROBE5真truncated令historyGap false→true，continuous两者false，作者canary亦同pair。非诚实性缺陷：保守不overclaim，双docs刻意不claim continuous telemetry；缺陷是位置/名称冲突。consumer把completeness当窗口事实，下一902dashboard具名消费此object，将错误“不连续”alarm，required drop_or_gap/historyGap正确却相反。计算+常量同义潜在缺陷即使安全值。最小非判定必需修：移出completeness为capability声明，或continuous=!historyGap，只observation一key，不动canonical/contract/consumer余。非gate失败，research drop_or_gap正确不弱required证据。

### F2 — INFORMATIONAL：CAPTURED证据无pointer

state_identity_evidence CAPTURED、refs空。实际支持规范City/task/event id/seq，PROBE3验证同，但next reader不能查空ref。三CAPTURED workbook仅901空，702/REX802各一。此次closeout指向材料索引补ref，review提供pointer，非作者claim。

### 3.1 拒绝假设（防重开）

ref=value.slice(0,160)静截ID会破joinability仍wellformed，所以攻击；规范input不可达：

```text
node id          validated /^[a-zA-Z0-9-]{1,80}$/      -> <= 80 chars
node displayName slice(0,100) on register              -> <= 100 chars
join displayName MAX_DISPLAY_NAME = 64                 -> <= 64 chars
task / event ids generated as Q-<uuid> / uuid          -> <= 40 chars
```

中文node ID校验1–80、displayName slice100、join64、Q-uuid/event生成≤40。无producer >160，不记缺陷。

## 4. 完成门禁独立检查

| # | 门禁 | 判定 | 依据 |
|---|---|---|---|
|1|bound contract|PASS|limit1..256外RangeError、default128、人口≤limit、4|
|2|至少一真task node/edge/event|PASS|3真Gateway RUNNING＋queue、assignment、IDs|
|3|无global barrier|PASS|2死reader仍完整task完成|
|4|对侧review|PASS本报告|六独立＋原suite，不同physical dev host|
|5|exactCI|PASS|37242446183/37242505126/37242505131同头success|
|6|Registry|PASS|CAP-MON-001.yaml评审FORMAL_REVIEW_RECONCILED|
|7|材料|PASS|有review extension|

强约束判据：

```text
JEV is a sidecar, not a synchronous必经路径   PROBE 2: work completes with the sidecar dead
does not copy scheduler/task/device truth      PROBE 1 (no write API, no task collection) + PROBE 6
monitor failure does not block unrelated tasks  PROBE 2
raw telemetry layered per PROCESS_DATA_POLICY  PROBE 6 (canary absent from the whole projection)
no new hidden reasoning capture                PROBE 6 + inspection: no reasoning field exists
first slice shows >=1 active task/owner/state/evidence pointer
                                               PROBE 3 + PROBE 4 (owner honestly NOT_OBSERVABLE)
no second state machine for dashboard comfort  PROBE 1: the projection cannot write at all
```

完整中文对应JEV sidecar非同步必经（2死仍完成）；不复制scheduler/task/device truth（1无write/tasks＋6）；monitor不阻无关（2）；raw telemetry按policy分层（6canary全view无）；无reasoning field（6＋读）；至少active task/owner/state/pointer（3/4 owner诚实未知）；无dashboard comfort第二状态机（1根本不可写）。

## 5. 不作的主张

- 无user surface执行。BACKGROUND_DISCLOSED允许ui_exemption_reason null，只有INTERNAL_ONLY需reason；graph/inspector归902。reachability PARTIAL诚实，review只API/docs非UI，不说902可达。
- 无跨device/physical-worker/HA/性能；全fixture一Windows，按workbook。NOT_RUN/false准确非review填缺。
- projectionLatencyMs非端到端，仅canonical read→build，SAMPLE_TO_PROJECTION_ONLY标签准确，不说ingestion。
- F1未修非PASS条件，最小范围留programme。
- 仅7eb38f1b930dfe6cc13dab0e17dedee467b1254b，后头自身review不转移；probe branch为证据非candidate。

语言配对 / Language pair: [English](../REVIEW_REPORT.md) · [中文](./REVIEW_REPORT.md)
