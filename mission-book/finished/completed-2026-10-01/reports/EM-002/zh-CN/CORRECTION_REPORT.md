# EM-002 修正报告：连接器适配器与进程运行时 / Chinese reading translation

此为[历史原报告](../CORRECTION_REPORT.md)的阅读译本，不另立任务状态、metadata或验收权威，不表示本次重跑。原代码证据块逐字保留于文末；SHA/状态/数字不更改，U+FFFD未知字符不猜测。

## 1. 独立评审方法

本会话第三次双评审，原因仍是实测发现覆盖仅部分重叠。主机探针`alien-probe.mjs`、`alien-pipeline-probe.mjs`、`alien-isolation-probe.mjs`、`alien-runtime-verify.mjs`位于.runtime/evidence/mission-book/EM-002，先测五个同级契约已确认缺陷类别，再测双方未覆盖的pipeline.mjs。独立上下文Agent以Mech §6交接为目标，13个探针。

去重后十一独立缺陷，本主机六项、Agent八项，三项重叠（key in spec、秘密扫描、runtime kind伪造）；开发测试一个都没抓到。

两项过程事实不隐藏。第一，本主机在评审运行的worktree内编辑；评审发现后用git show逐字重建提交到原始副本并重跑，结论精确绑定4e71558。恢复正确但仍是主机破坏自己冻结的过程缺陷。BA-003已建议冻结副本，此例说明须独立export/worktree等机械隔离而非可误破纪律。评审早期四次probe被污染，自身报告也说明。

第二，f389aa4提交消息写root132，但实测126；数字在最终运行前写后未改。§6保留准确数字，错误构建记录正是验证纪律要捕获的问题。

## 2. 已确认缺陷和修复

### EM2-1 / D3：high，key in spec接纳所有原型名称

manifest.mjs的checkShape用if(!(key in spec))，in遍历原型；manifest、capability、need、limits、provenance均受影响。原代码证据列toString/valueOf/hasOwnProperty/constructor/isPrototypeOf/propertyIsEnumerable/toLocaleString、自身JSON __proto__及嵌套名称。修复为自身键检查，所有深度拒__proto__/prototype/constructor，十二案例现在都拒。

### EM2-2 / D4：high，秘密扫描漏复数和复合词

token/credential/api_key/apiKey被抓，但credentials、tokens、secrets、apiKeys、api_keys、privateKeys、sessionKeys、refreshTokens、accessTokens、authToken、bearerToken、clientSecret、accountCredential、tokenValue、passwordHash十五拼写通过。修复名称归一：拆camelCase、合分隔符、小写、容忍末尾复数；引用后缀仍豁免，值感知只沿一个方向使max_tokens数量不误报。

### EM2-3：high，从不检查值

display_name和entry_ref可带真实sk-live前缀密钥，provenance.detection_evidence可带PEM，均过。entry_ref将执行，detection_evidence进入审计，尤其可能携密。契约要求声明needs而非秘密。现拒任何位置可识别PEM/JWT/提供者key前缀内容。

### EM2-4 / D8：high，适配器可伪runtime kind

注释承诺不能伪所选adapter和runtime kind；前者成立后者不成立。pipeline优先adapter产出的manifest.runtime_kind而非winner.adapter.runtime_kind，注册NODE却standardizer声称PYTHON，manifest和provenance都报PYTHON且zero failures，影响后续放置安全决定。现声明kind在两处权威，越界记ADAPTER_RUNTIME_KIND_MISMATCH而非静改。

### EM2-5：medium-high，自身__proto__穿过pipeline

standardizer返回JSON自身__proto__时边界仍hasOwn为true/Object.keys可见且无failure，是EM2-1向消费者影响路径。随EM2-1关闭并端到端断言UNIFY阶段拒。

### EM2-6：high，一个null适配器停整个流水线

头部承诺每stage隔离，nullish却在catch插值adapter.adapter_ref处崩，good永不运行。null/undefined加good均抛，42/'x'/{}/[]则原本正确隔离，unified1/failure1。runAdapterPipeline调用点已用可选链但handler没有。现故障细节null安全，回归含nullish；原坏输入代码块照留。

### D1：high，使用模块自身时钟时心跳新鲜度永不触发

heartbeat存ISO，checkHealth把last解析而now仍ISO，差值NaN、stale永远false，HEARTBEAT_LOST后连接位置原文损坏，DEGRADED路径成为死代码。三小时前脉冲对30秒预算仍新鲜。作者测试混数值now和字符串last，是模块不会产出的组合，绿灯没证明。修复双方共用toEpochMs后数字比较；提供但不可解析瞬时INVALID_TIMESTAMP保守失败，作者测试改模块ISO时钟。

### D2：high，心跳复活已杀进程

startup超时杀进程留下DEGRADED，随后heartbeat无条件提升READY，无进程、新spawn，只有死handle，invoke却可执行。单DEGRADED混startup失败和heartbeat丢失。现typed degrade_reason，只有活handle的心跳丢失可由脉冲清除；启动失败须spawn验证restart。修后pulse仍DEGRADED、invoke报RUNTIME_NOT_STARTED，活handle真正丢心跳仍可恢复。

### D5：high，structuredClone在所有保护之外

第三方manifest含函数/symbol导致DataCloneError穿透runAdapterPipeline和loadConnectors，健康连接器不加载且无记录。现复制有guard，不可复制输出记该适配器失败。

### D6：high，进程port无边界上下文且kill未确认

spawn只有entry_ref/runtime_kind/host，没有argv/env/cwd/timeout/stdio/shell；entry只非空，遍历路径、绝对cmd、/bin/sh命令、NUL、-flag都可传执行。kill不等确认，killed:false也当退出。

修复限制entry为connector root内相对路径，拒五恶意、接受二合法；request带startup_timeout_ms/max_log_bytes、stdio pipe、shell false；kill检查记录KILL_FAILED/KILL_NOT_CONFIRMED，仅确认清handle。

诚实限制：argv/env/cwd confinement和timeout实际执行仍port职责，同步模块不能拥有timer，此任务也无真实port（作者D9）。保证3只在请求边界有界，本层未证实，后续EM需实port证明。

### D7：high，runtime从不调政策mediator

start原样复制policyDecision.granted，不调用mediateConnectorPermissions，未声明/重复grant进入provenance，而同decision经mediator报UNDECLARED_NEED_GRANT。refused:[null]无类型TypeError，缺need_id的refusal静丢，无法区分政策拒绝或未表态。现start保存mediated intersection，异常refusal报typed INVALID_CONNECTOR_MANIFEST。

## 3. 记录判断而未修复

runtime“started as”diagnostic占connector日志预算，预算小则自身输出少；评审E/7指出，确为设计选择但预算归谁属政策，无明确正确答案，保留作者实现交Owner。E的另一主张未复现：称drop返回appended:false/truncated:true不设instance.log_truncated，源码其实返回前设true；不传播未确认主张。

## 4. 攻击后确认有效

未声明能力/方法、未授need在触port前拒且不改状态。safe mode对start/invoke/restart粘性，clearSafeMode须operator ref且第二次拒。restart预算有界、比较前递增、耗尽terminal。常见spawn/invoke故障记录为数据，未知instance/stream抛ConnectorError。全域无Hns/Boss引用import/spawn地址、无RUNTIME_KINDS污染、无node:child_process。toString capability虽携异常数据却因必填不能伪能力方法。EM2-2后同级契约秘密拼写拒。

## 5. 工作书没指定的决定

C1仅修确认finding，评审git show重建纪律使可确认；主机各项修前后独立复现，不把污染运行直接当事实。C2改作者心跳测试，因它编码永不触缺陷的数值/字符串组合；现ISO时钟断言stale，修测试缺陷不是削弱。C3不在此实施argv/env/cwd，边界纯同步不own timer，传bounds可做，enforcement留port接缝。C4banner预算为政策，Owner裁定。C5不写evolution feed，与BA-001 D11/BA-002 C5/BA-003 C6/EM-001 D13/GAI-001 C6/RF-001 D8/RF-002 D13一致：contracts/evolution schema限迁移，EM事件不合法，扩展碰冻结contracts/**。

## 6. 测试汇总

| 检查 | 历史结果 |
|---|---|
| node --test contracts/engineering-connector-v1/tests/conformance.test.mjs | 25 pass/0 fail，开发14+新增11 |
| node --test tests/*.test.mjs | 126 pass/0 fail；f389aa4消息132错误 |
| node --test apps/rooms/tests/*.test.mjs | 69 pass/0 fail |
| node city/test-all.mjs | 1801 pass/0 fail |
| verify-promotion-history | 4e71558a9fc4本地Git验证10记录 |
| check-bilingual | docs/evidence/data-records PAIRED |
| CI36724202082@f389aa46b002d92ff3cb9201dd8b18c32073e149 | gateway-web/android success |

FAILURE_REPAIR_SUMMARY：开发14项每修后保持通过，除编码D1的心跳测试按C2纠正，未撤回修复。主机新断言误期待相同observations生成两个manifest，而文档duplicate-kind规则保留一个，改测试不改代码。

## 7. 跨任务接缝

EM-004/011/012不能传traversal/absolute/NUL entry、复数秘密字段、文本中真实credential、伪runtime或未mediated grant；秘密形状用*_ref/*_handle/*_id。实port实现者负责argv数组不是命令字符串、绝不shell:true、净化env allowlist、受限cwd、执行startup/invoke timeout及kill escalation；D6这里有界未解除责任。

EM-010消费instance，stop现在有kill_confirmed/kill_code，DEGRADED有typed reason，区分没脉冲与从没启动。所有深度reserved-key拒绝，未来新增manifest字段继承own-key规则。

## 8. Owner待定事项

1. runtime诊断预算归谁，裁定可关闭最后未修评审finding。
2. 谁交付真实port，届时是否重新证明保证3；当前只请求边界。
3. 评审隔离须机械，连续两任务评审移动树，交付不能由主机编辑的冻结export可消除此类。
4. evolution-feed问题C5仍开放。

最终代码块保留历史CORRECTION_COMPLETE=true、Mech开发/Alien修正不同物理主机门禁、修正SHA/CI及FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE。不将这些历史值更新为当前验收。

## 原代码与机器证据逐字保留 / Original code and machine evidence

以下代码块来自原报告并按出现顺序逐字保留，连同未知字符。上文解释每项观测及限制；这些是历史记录，不是本次测试输出。 / The following blocks are preserved verbatim in source order, including unknown characters. They are historical evidence, not new test output.

### 证据块 1 / Evidence block 1

原任务身份、claim、固定SHA、分支CI、测试摘要和组件分支未merge的历史记录。

```text
MISSION              = EM-002 (Engineering Manager programme)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-002-connector-adapter-process-runtime.md
CLAIM_COMMIT         = fb0e3a8 (Digital-City main, claim of EM-002 Correction by Alien)
CLAIMED_AT           = 2026-09-30T13:40:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 4e71558a9fc44a15a209eef4d711d8d90f90933b
DEVELOPMENT_CI       = 36718724624  - gateway-web success, android success
CORRECTION_BRANCH    = engineering-manager/EM-002-connector-adapter-process-runtime
CORRECTION_HEAD_SHA  = f389aa46b002d92ff3cb9201dd8b18c32073e149
BRANCH_CI            = 36724202082 - gateway-web success, android success
LOCAL_CHECK_SUMMARY  = connector 25 pass, root 126 pass, rooms 69 pass, city 1801 pass, promotion-history OK, docs SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

### 证据块 2 / Evidence block 2

manifest及嵌套对象通过的原型成员名，见EM2-1。

```text
manifest.toString  manifest.valueOf  manifest.hasOwnProperty  manifest.constructor
manifest.isPrototypeOf  manifest.propertyIsEnumerable  manifest.toLocaleString
manifest.__proto__ (JSON-parsed own key)
limits.toString  provenance.hasOwnProperty  capabilities[0].valueOf  needs[0].constructor
```

### 证据块 3 / Evidence block 3

nullish适配器令pipeline/loadConnectors崩溃，而其他异常形状原本能隔离；损坏行照留，见EM2-6。

```text
adapters: [null]                  -> THREW TypeError (reading 'adapter_ref')
adapters: [null, good]            -> THREW; the good adapter never ran
adapters: [undefined, good]       -> THREW
adapters: [42|'x'|{}|[], good]    -> isolated correctly (unified=1, failures=1)
loadConnectors([null, good],  -    -> THREW
```

### 证据块 4 / Evidence block 4

原不同物理开发/修正主机、完成、SHA、CI和禁止合并状态。

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Mech
CORRECTION_HOST     = Alien   (different physical host  - two-host gate satisfied)
CORRECTION_HEAD_SHA = f389aa46b002d92ff3cb9201dd8b18c32073e149
BRANCH_CI           = 36724202082
MERGE_STATUS        = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```

## 原文未知字符定位 / Unknown-character locations in the source

下列原文行只用于保留不能恢复的字符位置，不猜测缺字或替换为新的事实。 / These source lines preserve unrecoverable character positions without inferred replacements.

```text
`stale` was false forever, and **the entire `HEARTBEAT_LOST �?DEGRADED` path was dead code**. A
```


## 历史编码说明 / Historical encoding note

本文件在此次整理前含无效UTF-8字节。仅将损坏标点改为普通连接符，其他无法恢复的序列显示为U+FFFD；没有猜测缺失文字或改写验收结论。原始字节保存在docs/encoding-evidence，可按SHA256核对。

This file contained invalid UTF-8 before maintenance. Damaged separator punctuation is rendered as a plain hyphen; other undecodable sequences are shown as U+FFFD. Missing text and acceptance conclusions are not inferred. Original bytes are retained under docs/encoding-evidence with SHA256 provenance.
