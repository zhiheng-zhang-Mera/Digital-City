# GAI-001纠错报告——核心契约与Action词汇

阅读译本 / Reading translation：完整历史阅读译本，不构成第二份权威记录；原元数据置代码块，失败、残余限制与未合并边界保留。

```text
MISSION              = GAI-001 (General AI Gateway programme)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-001-core-contracts-action-vocabulary.md
CLAIM_COMMIT         = 0124df5 (Digital-City main, claim of GAI-001 Correction by Alien)
CLAIMED_AT           = 2026-09-30T13:02:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 57915d05906f17d244bc48bbe07dc37ea5e0a89e
CORRECTION_BRANCH    = general-ai/GAI-001-core-contracts-action-vocabulary
CORRECTION_HEAD_SHA  = c01cd60dd9e0fa42c4126a921240d81e408a3e35
BRANCH_CI            = 36719793897 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = root 135 pass, rooms 69 pass, city 1801 pass, promotion-history OK, docs SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

Alien纠错、Mech开发，GAI programme CORRECTION；claim0124df5于2026-09-30T13:02:00Z；组件基线、开发头57915d05906f17d244bc48bbe07dc37ea5e0a89e、纠错c01cd60dd9e0fa42c4126a921240d81e408a3e35及CI原样。root135、rooms69、city1801、promotion及docs同步；组件禁止merge所以未合，CORRECTION_COMPLETE:true。

## 1. 独立审查方法

两独立视角，均不把作者测试作真值。1本host probe攻击decideRoute与applyApiEscalation/applyDeviceSwitch seam，以及同会话BA001/002/EM001已失败的secret名字扫描与继承property查找。2 separate-context reviewer针对开发第6节可证伪保证，仅可复现发现，写六probe+综合probe及report至scratch，不改tracked，git status空核验。双方真实发现且部分交集，支持做两次；合计八缺陷，开发套件一个未抓。

## 2. 独立审查发现

### 缺陷1 high——Object.prototype继承名字当合法envelope

checkShape用key in spec，沿prototype，所有名字变canonical字段：

```text
{...validProviderDescriptor, toString: 'SMUGGLED'}          -> ok: true
{...validProviderDescriptor, valueOf: 'SMUGGLED'}           -> ok: true
{...validProviderDescriptor, hasOwnProperty: 'SMUGGLED'}    -> ok: true
{...validProviderDescriptor, constructor: 'SMUGGLED'}       -> ok: true
{...validProviderDescriptor, isPrototypeOf: 'SMUGGLED'}     -> ok: true
{...validProviderDescriptor, propertyIsEnumerable: ...}     -> ok: true
{...validProviderDescriptor, toLocaleString: ...}           -> ok: true
JSON.parse('{"__proto__":{"isAdmin":true},...}')            -> ok: true
```

严格envelope是模块中心声明，却对攻击者会选的toString/valueOf/hasOwnProperty/constructor/isPrototypeOf/propertyIsEnumerable/toLocaleString/__proto__失效。同BA001另一函数缺陷。修Object.hasOwn，并在所有envelope每深度拒绝__proto__/prototype/constructor。

### 缺陷2 high——secret扫描比较原始拼写

pattern要求secret词后._-边界，复合/复数漏。

| 字段 | 修前 | 修后 |
|---|---|---|
| token/credential/apiKey/accessToken/bearer | 抓到 | 抓到 |
| credentials/tokens/secrets/passwords | 漏 | 抓到 |
| apiKeys/api_keys/privateKeys/sessionKeys/refreshTokens | 漏 | 抓到 |
| authToken/bearerToken/clientSecret/accountCredential/tokenValue/passwordHash | 漏 | 抓到 |
| credential_ref/api_key_handle/access_token_id/secret_refs/token_id | 允许 | 不变允许 |

修复名字normalize：camel分词、non-alnum归一_、lowercase、末尾plural容忍，reference suffix豁免。仅一个方向value-aware：secret名的number为用量非凭据bytes，input_tokens/output_tokens不误报。最初一刀切plural使作者suite失败，作者自己的首修错误保留。

### 缺陷3 high——声明字段可带raw credential

name-only看不到声明字段内secret：

```text
validateProviderDescriptor({..., credential_ref: 'sk-live-9f8e…'})   -> ok: true
validateProviderAccount({..., credential_ref: 'sk-live-9f8e…'})      -> ok: true
validateResultEnvelope({..., provenance.source: '<raw key>'})        -> ok: true
validateGeneralAiRequest({..., input_bundle.text: '<raw key>'})      -> ok: true
```

provider descriptor/account credential_ref、result provenance.source、request input_bundle.text中raw形态均ok。违“credential_ref handle而credential bytes拒绝”注释及raw_secrets_in_canonical_state:false。seal和request validation扫描任意位置可识别内容：PEM private-key、JWT、provider前缀。刻意不声称shape区分所有handle/secret；短opaque无法区分，强装会破合法引用或假保证。

### 缺陷4 med-high——partial可自称terminal

规则比较caller自由source：

```text
nextActionStatus('RUNNING', {status:'SUCCEEDED', source:'PARTIAL'})  -> throws (correct)
nextActionStatus('RUNNING', {status:'SUCCEEDED'})                    -> 'SUCCEEDED'  ← bypass
nextActionStatus('RUNNING', {status:'SUCCEEDED', source:'partial'})  -> 'SUCCEEDED'  ← bypass
… 'Partial', 'PARTIAL ', 'STREAM'                                     -> 'SUCCEEDED'  ← bypass
```

PARTIAL正确拒绝，但省略/partial/Partial/PARTIAL空格/STREAM可SUCCEEDED；同模块validatePartialResult拒终态，“唯一决策点”自矛盾。修闭词汇CHANNEL/PARTIAL/RECONCILE，trim uppercase，缺失/unknown直接拒绝而非当非partial。

### 缺陷5 medium——UNAVAILABLE之后可成功

nextActionStatus UNAVAILABLE→SUCCEEDED被允许；作者D8明确本attempt终态、以新key新actionretry，故不在ACTION_TERMINAL_STATUSES。代码相反，按建议重试会同action两矛盾结果。修UNAVAILABLE对此actionfinal，RETRYABLE_STATUS_IS_FINAL_FOR_THIS_ACTION；in-flight进入仍合法，保D8区分。

### 缺陷6 medium——advisory spread不可信classifier

spread assessment带channel API、route API_SUBMIT、requires_user_confirmation true、confirmedByRef owner、budgetDecision APPROVED及三safetyflags；已声明JEV_ASSESSMENT_FIELDS未执行。decideRoute只读degraded未被欺骗，但未来按key分支会读未经确认的用户已确认/API/budget批准。修拒undeclared并projection declared，使advisory仅advisory字段。

### 缺陷7 high（针对D5声明）——linkage scanner13真实漏报

D5以无exclusion scanner证明无历史产品依赖，重要声明部分不真。以下零findings：

```text
package.json      {"pnpm":{"overrides":{"boss-client":"2"}}}
package.json      {"workspaces":{"packages":["packages/boss-core"]}}     (the documented npm form)
package.json      {"bundleDependencies":["boss-client"]}
package.json      {"packageManager":"pnpm@9+boss"}
package-lock.json {"packages":{"node_modules/boss-client":{…}}}
tsconfig.json     {"compilerOptions":{"paths":{"boss-client":["./x"]}}}
src.mjs           const m = await import(`boss-client`);
src.mjs           const r = createRequire(import.meta.url)("boss-client");
src.mjs           const p = require.resolve('boss-client/x');
.npmrc            @scope:registry=https://npm.boss.example/
pnpm-workspace.yaml   packages:\n  - packages/boss-core
```

含pnpm overrides、object workspaces packages、bundleDependencies、packageManager、package-lock packages、tsconfig paths、template import、createRequire调用、require.resolve、npmrc registry、workspace YAML。根因固定六dependency block、module pattern必引号、filter丢npmrc。修结构JSON遍历normalize容器，任意深度nested依赖map；匹配import/require/createRequire/resolve调用；扫npmrc/workspace行并dedup。刻意保无false-positive：容器gate使DONOR provenance仍记录非edge，static from仍要求引号。首修去quotes误flag九真实DONOR，保自错。残余gitmodules submodule/path分两行，per-line规则漏，为一shape加INI parser不成比例，明确不掩盖。

### 缺陷8 medium，冻结baseline既存——finished Action重开

actions reconcile无finality guard写TASK_STATUS_MAP，契约nextActionStatus未import。SUCCEEDED可变CANCELLED/FAILED，REFUSED/UNAVAILABLE可SUCCEEDED。82ed3693同样，非GAI引入。属同lifecycle false-success、同分支已改文件且小fix，故范围内。抽纯export reconcileStatus首次可测；此前需live CITY_TASK无测试构造。late记录provenance.lateObservations，原status保留，不throw保持Gateway健壮。

## 3. 攻击后确认可靠，无需修复

| 攻击 | 结果 |
|---|---|
| localResult/webCurrent/webOther/lastWebFailed/apiAvailable/userConfirmedApi/budget 192状态格 | 无consent选API0、静默Web→API0、budget不能代consent、无confirmation的other-device提议0 |
| fingerprint输入重排/undefined-null/type变化 | 正确replay或拒绝 |
| 同idempotencykey不同payload | 拒绝 |
| legacy无stored fingerprint | 仍拒不同request |
| API escalation有budget无user ref | USER_CONSENT_REQUIRED |
| budget rejected | BUDGET_REJECTED |
| switch无确认 | USER_CONSENT_REQUIRED |
| switch有确认 | interaction_follows_execution:false |
| route BOSS/boss/HNS/general_ai/GENERAL_AI尾空/空/null | 均拒；GENERAL_AI/ROOM/CITY_TASK准入 |
| JEV无权choosechannel，advisory有无决策同，六failuremode不throw降级，冻结抗修改 | 可靠 |
| partialresult terminal | 拒绝 |
| live GENERAL_AI facade | 总UNAVAILABLE，非success，不进Citytask，history及replay幂等保留 |
| extension深层authority/secret名 | 递归抓到 |

三刻意非发现：任意string值内provider产品名允许，pattern裸hns若扫value误拒正常path/prose，仅route及唯一provider命名field有意义；短opaque credential_ref允许，无法shape区别handle，仅recognisable content拒；unicode lookalike authority仅无人读取描述，policy不查profile所以不赋权。

## 4. 工作书未指定决策

C1两review：书需independent未定数量，部分交集证明价值；本host找1/5及2shape，agent找3/4/6/7与D5既存部分。

C2无raw secret边界：normalize plural secret名+任意处可识别content拒，并说明残余，不用会破引用/假保证handle格式。

C3修既存8：同lifecycle同file false-success，契约已own规则，合法transition不受影响；记录既存provenance。

C4保plural并numeric区分，因为number不能credential bytes；拒drop rule重开2，拒仅特殊input_tokens会使下一用量误报。

C5caller需分支错误公开GAI_ERROR_CODES；PARTIAL_RESULT_CANNOT_COMPLETE/IDEMPOTENCY_KEY_REUSED已有；新source validation用UNKNOWN_STATUS，因malformed update非新lifecycle。

C6未写evolution，与BA001D11/BA002C5/EM001D13/RF001D8/RF002D13一致：schema missionId仅MB三位、roles MIGRATION/VERIFICATION，无GAI事件合法，扩展触冻结contracts。

## 5. 修复文件与regression

| 文件 | 修改 |
|---|---|
| contracts.mjs | own-key、reserved prototype、normalizeFieldName/isSecretFieldName plural、rawvalue/reservedpath scan、value-aware、closed source、UNAVAILABLE finality |
| routing.mjs | advisory whitelist、structural dependency JSON normalize、module call形式、npmrc/workspace、dedup |
| actions.mjs | FINAL_ACTION_STATUSES/纯reconcileStatus；保持status并记录late |
| conformance.test.mjs | 7regression |
| 新gateway-actions-status.test.mjs | 4regression，首次永久reconcile/GENERAL_AI覆盖 |

11新增：1prototype undeclared拒；2plural/compound secret拒且quantity非secret；3任意field rawcredential拒；4partial不能改/省source完成；5UNAVAILABLE final且进入合法；6advisory仅declared；7scanner漏依赖现抓且忽略provenance；8finished不重开；9inflight跟Citytask；10reserved GENERAL_AI typed unavailable不变Citytask；11reordered key同request而不同拒。

每negative配合法邻居：handle、handle://1、nonterminal partial、合法advisory、DONOR prose及作者comment、所有inflighttransition，不能靠全拒满足guard。

## 6. 测试汇总

| 检查 | 结果 |
|---|---|
| 本host2及agent7hostile probes | 确认缺陷修前复现、修后拒 |
| conformance | 30/0，23开发+7新 |
| gateway-actions-status | 4/0 |
| root | 135/0 |
| rooms | 69/0 |
| City | 1801/0 |
| promotion | 57915d05906f历史10记录 |
| check-bilingual | docs/evidence/data-records PAIRED |
| CI36719793897在c01cd60dd9e0fa42c4126a921240d81e408a3e35 | gateway-web/Android success |

23作者测试每修后不改通过，证明加强未弱化。两自错保留：blunt plural误input_tokens，改value-aware；drop static-from quotes误九DONOR，恢复引号且array linkage dependency容器gate。

## 7. 跨任务衔接，只记录未解决

- GAI002 registry credential必须handle，不可key material；缺陷3现挡，但registry应声明handle形态。
- GAI004首用status/escalation，必须source，UNAVAILABLE final，budget NOT_EVALUATED为wait，与decideRoute一致。applier接受该值刻意因consent先budget，是该任务需再看seam。
- GAI005不可对advisory key选channel/budget；需routing decision而非classifier。
- 新envelopefield继承own-key，prototype名不可冒充declared。
- gitmodules两行shape仍未扫描。

## 8. Owner开放项

1. 确认开发D2 contracts层保contracts、City06-general-ai-gateway仍reserved，或指示promotion。
2. 确认Web/Android现在是否显露reserved GENERAL_AI：typed UNAVAILABLE诚实但用户可见，已有测试。
3. evolution问题C6仍Owner开放。

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Mech
CORRECTION_HOST     = Alien   (different physical host — two-host gate satisfied)
CORRECTION_HEAD_SHA = c01cd60dd9e0fa42c4126a921240d81e408a3e35
BRANCH_CI           = 36719793897 — gateway-web success, android success
MERGE_STATUS        = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```

原终态纠错true，两host门禁满足，精确头/CI保留；merge仍FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE。

语言配对 / Language pair: [原文 / Source](../CORRECTION_REPORT.md)
