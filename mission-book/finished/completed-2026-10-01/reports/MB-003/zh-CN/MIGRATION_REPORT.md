# 迁移报告——MB-003

阅读译本 / Reading translation：完整历史阅读译本，不构成第二份权威任务元数据或验收记录。原始元数据保留在代码块中，所有历史失败、未迁移范围及验证要求保持原意。

```text
MISSION = MB-003
ROLE = MIGRATION
HOST = Alien
CLAIM_COMMIT = 5e69ebf0e366835547eb3c36e596937fe58565ec
DONOR_BASELINE = zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080
                 zhiheng-zhang-Mera/DS-Hns   @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b
IMPLEMENTATION_BRANCH = mission/MB-003-worker-gateway
IMPLEMENTATION_HEAD = aff3c283e34b596c6c0ba6c666aed96893b6c395
IMPLEMENTATION_CI = 36570163616 PASS (gateway-web + android)
MIGRATION_HEAD = c5734a5e646f1e379aa15282b59a08e8828d5d6a
MIGRATION_CI = 36571564418 PASS (gateway-web + android)
MIGRATION_COMPLETE = true
```

implementation SHA包含迁移本身；migration head是在该树增加两个关闭过程事件提交，其唯一内容为data-records/evolution/inbox/mission-book/MB-003/events.jsonl。两SHA均required CI绿色，因此记录头并非未验证树。claim阶段push `590d041c4398c11f53dce9c821a2c0c44d508edd`也绿色，run36567419904。第4/5节记录任务未自行回答的问题、所选方案及理由；第7节列验证者优先攻击点。

## 1. 落地边界

目标既有building city/02-engineering/02-worker-gateway，已拥有skill-intake。没有读取、包装、重导出或fork skill-intake；三个新模块为兄弟。

| 模块 | 冻结donor源 | 测试 |
|---|---|---|
| worker-task-contract | DS-Hns app/extensions/mega/scheduler/lifecycle.js | 23 |
| provider-adapter | Codex-Boss electron/runtimes/runtime.ts、unsupported-runtime.ts、web/provider-runtime-adapter.ts、src/shared/provider-state.ts | 29 |
| provider-resilience | Codex-Boss electron/commander/circuit-breaker.ts、src/shared/provider-outcome.ts | 42 |

共94新模块测试，各DONOR.json列donor路径、适配、已知差异、parity向量及四类分类；均UTOPIA_EXTENSION:[]，未发明功能。

保留行为，每向量均由本模块测试断言，完整列表见DONOR.json：

- worker-task-contract：规范终态COMPLETED/FAILED_FINAL/CANCELLED；兼容持久词汇FAILED→FAILED_FINAL、CANCELED/INTERRUPTED→CANCELLED；persistedStatusFor默认fallback CANCELED及INTERRUPTED特例；truncate单空格归并及max-1字符后省略号；taskDisplayName依次fallback；errorSummary用code:message拼接及不抛异常JSON兜底；shortResult的Xs/Xm Ys/Xh Ym及null情况；terminalEpoch Math.trunc及0兜底；terminalKey的id#state#epoch幂等键；buildTerminalEvent完整载荷，含null/zero区分及source默认规则。只读donor差分885比较、0差异。
- provider-adapter：十availability中仅AVAILABLE可用，UNKNOWN等其余不可用；unsupported-runtime拒绝health UNSUPPORTED、execute PERMANENT_FAILURE、code UNSUPPORTED、retryable:false；web:前缀及精确错误文案；全部七role默认与partial override合并；stateForRecovery的AUTO/PAUSED actions、默认原因、autoResume及仅定义时retryAt。
- provider-resilience：无state时CLOSED；存储OPEN冷却已过报告HALF_OPEN；admit最多一个HALF_OPEN探针；observeFailure三分支，包括长停机不能无限延长冷却及探针失败后新冷却；cancelProbe/reset/list；选项限1..20及1..604800000，非整数抛错；providerTechnicalInterruption精确六kind；整个无import的provider-outcome.ts完整迁移，含donor自身A02–A08验收。

明确未迁移，均DONOR.json记录：

- DS-Hns mega/scheduler/gate.js decideTask属peak-price/scheduled-start调度策略，另一City building；dsh-runner.js真实child_process spawn seam；scheduler.js为queue且import Electron耦合DeepSeek client，不能无Electron迁移。
- DS-Hns真实adapter并不在mega，而在app/core/plugin-adapters、app/sub-worker、app/engineering、app/core/capability-registry/work-admission/health-supervisor；这是刻意范围而非遗漏，见D1/D6。
- Codex-Boss codex-cli-runtime.ts、process-gateway.ts直接spawn child_process，后者不接受注入spawn；runtime registry/supervisor、execution-supervisor、scheduler、fs task-ledger、provider sessions及multi-runtime role routing未迁。
- durable-json与userData/.boss/circuit-breaker.json持久化未迁；仅输入/返回snapshots，由caller持久。
- donor默认时钟未迁，三个模块全部时钟参数注入。

契约：纯函数、plain serializable values，无fs/network/Electron/process.env/ambient I/O。刻意接口适配为注入时钟：buildTerminalEvent now、stateForRecovery now、createCircuitBreaker now选项、unsupportedRuntime health clock。

既有真实消费为Web/Android调用的services/capability-bridge/bridge.mjs；每能力degradation已有descriptor bridgeState:DEGRADED，两客户端读取。桥不再ad-hoc Set，而用迁移breaker，以Utopia策略数据failureThreshold:1、cooldownMs:604800000（donor上限），仅ENGINE_UNAVAILABLE/ADAPTER_UNAVAILABLE算provider-technical。真实bridge/store测试证明桥满足Core，EXECUTION_TIMEOUT不降级，后续工作BRIDGE_PENDING拒绝，无关能力不受影响。未建新UI。

## 2. 测试与运行

- 单元/契约/parity94模块测试。CI等价整套：pnpm test59/59、rooms67/67、city224/224、promotion10记录、docs/evidence/data-records均SYNCHRONIZED。
- 真实消费测试：capability-bridge.test.mjs的per-capability degradation latch is owned by migrated provider-resilience breaker。
- 两真实失败记录TEST_FAIL MB-003:c9c85a3e92400626。
- REPAIR_APPLIED MB-003:f2f3a6a4cfca830d，见D2/D7/D8。
- 已知限制见第6节。

## 3. Utopia狗粮与演进交接

inbox data-records/evolution/inbox/mission-book/MB-003/events.jsonl。

| 事件 | 类型 | 结果 |
|---|---|---|
| MB-003:2601002ceb746040 | MISSION_CLAIMED | INFO |
| MB-003:afed539995d4cafd | ATTEMPT_STARTED | INFO |
| MB-003:9e64b7243894d765 | CHANGE_APPLIED | INFO |
| MB-003:c9c85a3e92400626 | TEST_FAIL | FAIL |
| MB-003:f2f3a6a4cfca830d | REPAIR_APPLIED | REPAIRED |
| MB-003:1234899648b27632 | TEST_PASS | PASS |
| MB-003:c3573e8b28930659 | RUNTIME_PASS | PASS |

同host待托管终态追加CI_RESULT/MIGRATION_COMPLETE；此处上头是追加前分支head，追加仅过程数据。没有发布candidate evidence到evidence/raw/mission-book/MB-003。git-ignore本机.runtime/evidence/mission-book/MB-003/run-001含WORKING_STATE持久交接及两donor survey/只读分析脚本。全文件耦合调查provider-adapter-layer-report.md440行。

## 4与5. 施工问题、选择与判断

### D1——DS-Hns provider/adapter在哪

问题：任务指定DS-Hns为主donor但未指位置。选择无依赖自包含lifecycle.js的Hns worker/task contract，provider-adapter取Codex-Boss，延期plugin-adapters/sub-worker/engineering。调查证明真实adapter不是mega，而是CJS与plugin生命周期融合，closure延伸child_process/Electron/node:net/fs/powershell/computer-use；lifecycle明确dependency-free，正合任务名称。代价：比“Hns为主”暗示迁得少，明确披露；D6记录后续。DS-Hns仅拒绝vision一个capability、其余降级，因此取拒绝层本来也薄。

### D2——manifest capabilityProvider

问题：向domain district02-engineering加三模块，registry向Web/Android宣称inputKind unavailable、awaiting bridge，制造不存在产品界面。选择模块级capabilityProvider:false，在manifest验证且registry跳过。理由：这些是adapter基础设施；“无adapter manifest模块即unbridged能力”规则适合domain功能而非此处。仅改计数断言会留产品污染。标记后既有registry/adapters断言全不改通过。代价新字段且与MB001分歧，见D3。

### D3——MB001与MB003同基线用两方式解同问题

均从c7ef3cd分支，修改同manifest、manifest tests、两ARCHITECTURE。MB001district kind:infrastructure跳整个区；MB003module capabilityProvider:false。MB003位于domain区，district机制覆盖不了；MB001整个基础区也可用module标记。Owner后合并者必须调和，优先泛化module并退休kind，或说明双机制理由。任务从main分支同时改shared City，冲突是结构性而非偶然；仅merge顺序或Owner裁定能解，报告无法防止。

### D4——仅一个模块可不发明语义地消费

选择bridge消费resilience；worker-task-contract/adapter以parity落地并记尚未消费。具体：gateway终态COMPLETED/FAILED/CANCELLED，donor是含FAILED_FINAL/CANCELED/INTERRUPTED超集；改includes为isTerminalStatus会改变restart后legacy持久状态，不是等价接线。事件已有at-most-once，再加terminalKey死代码；display/notification无Utopia消费面，新增被排除清单及rule14禁止。adapter十值AVAILABLE/BUSY/AUTH_REQUIRED/RATE_LIMITED/BUDGET_EXHAUSTED/PAGE_CHANGED/USER_ACTION_REQUIRED/UNSUPPORTED/DOWN/UNKNOWN与bridge AVAILABLE/DEGRADED/BRIDGE_PENDING/UNAVAILABLE不匹配，映射会发明translation table、违MIGRATION_ONLY；独立survey也同结论。代价二模块无consumer。

### D5——机制接线是否真实产品消费

独立survey称circuit breaking在产品无feature映射，若寻找新feature属实；桥已有Set作此决定。选择把消费明确为既有机制等价重接线，Utopia策略作为数据，不宣称新feature。等价理由：降级能力dispatch前BRIDGE_PENDING拒绝，无成功invocation，observeSuccess不调用，breaker不会CLOSED；永久latch精确复现，7天cooldown donor最大值使任何Gateway生命周期HALF_OPEN不可达。测试等价及无关能力不变。代价审查须理解消费为Core拥有决定，而非新屏幕。

### D6——延期donor面，避免重新发现

plugin-adapters25文件无第三方import，格式无关纯registry/注入spawn supervisor；sub-worker13state协议含unsupported_capability及纯permissions.cjs；engineering verifyResume+computePlanDigest为两donor唯一真实checkpoint/resume，目标是Utopia持久但未验证task.lastCheckpoint；capability.cjs34能力每个诚实说明缺失后果；autonomy progress-observer/result-validator。各可为连贯后续mission，本次未迁，各需独立边界。

### D7——改registry而非断言修复

三模块破计数则加capabilityProvider，因断言正确、产品错。诚实说明：MB001同类失败用id-scoped断言修，因新模块kernel非capability；两修复均去掉变化使失效的假设，不弱化断言。

### D8——迁移breaker真实API陷阱

首消费以createCircuitBreaker返回live对象调用standalone state(breaker,id)/observeFailure(breaker,id)，这些却要求snapshot core，每个bridge请求TypeError Cannot read properties of undefined (reading 'get')。绑定breaker.state(id)/observeFailure(id)才stateful API，现桥使用它。记录理由：读exports的caller易拿standalone，得到runtime TypeError而非明晰contract error。42测试通过因测bound API。验证者可要求standalone输入guard或清晰rename，属本任务修复，留其判断。

### D9——不可假设donor测试覆盖

survey发现而本报告转交其结论：progress.ts/execution.ts没有donor测试；worker-response两case；无测试import unsupported-runtime，拒绝类未测。因此port自身首次覆盖。反之DS-Hns checkpoint/resume为最强donor覆盖26+22+7，故D6最高价值后续。

### D10——环境工具事实

pnpm不在PATH，corepack pnpm@11.19.0可达固定CI版本。mission:event -- --mission会转literal --失败，正确mission:event --mission。此Node不接受node --test <dir>，需命名文件或glob。

## 6. 已知限制

1. worker-task-contract/adapter无consumer；若验证要求三者均消费则迁移未完成。
2. D5为机制重接线，无新产品界面；要求用户可见变化者不会找到，因为任务禁止发明。
3. MB001/003同manifest/census/docs及不同机制，合并会冲突。
4. breaker持久延期，restart清空，与旧process-local Set一致。
5. DS-Hns真实adapter/worker/checkpoint未迁，覆盖小于主donor暗示。
6. 验证需已安装donor支持真实provider路径detect→submit→progress→result/unsupported，明确环境缺失BLOCKED不得mock pass。迁移host未尝试；验证host须查是否安装，未安装必须BLOCKED不能模拟。
7. Android绿但Gradle全UP-TO-DATE，Android未改，是未受影响且绿色，不是变化输入的新编译。
8. implementation CI已记录；迁移host依规则未合main。

## 7. 交给验证主机

仅独立审查提示，不暗示结论：

- 三模块DONOR.json声明边界及DEFERRED。
- city/tests/manifest.test.mjs的census/incubation provenance。
- bridge.mjs的import、PROVIDER_TECHNICAL_ERROR_CODES、CIRCUIT_COOLDOWN_MS、circuit binding及bridge tests验证D5。
- registry.mjs/manifest.mjs验证D2 flag及校验。
- resilience/circuit-breaker.mjs验证D8 standalone是否需要guard。
- city/docs/{en,zh-CN}/ARCHITECTURE.md第7节说明D2/D5调和。
- City manifest相对MB001分支检查D3冲突。

必须不同host验证，Alien已参与不能领取。交接HEAD `aff3c283e34b596c6c0ba6c666aed96893b6c395`，Utopia mission/MB-003-worker-gateway。迁移host没有merge，也未mission:finalize。

语言配对 / Language pair: [原文 / Source](../MIGRATION_REPORT.md)
