# GAI-005 纠正报告：确定性与JEV分诊路由

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = GAI-005 (General AI Gateway programme, task 5 of 9)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-005-triage-jev-routing.md
CLAIM_COMMIT         = 68195ab (Digital-City main, claim of GAI-005 Correction by Alien)
CLAIMED_AT           = 2026-09-30T16:39:51Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 48169de998a913f495fbca1dac5bd37d79e57e19
DEVELOPMENT_CI       = 36738383466-success
CORRECTION_BRANCH    = general-ai/GAI-005-triage-jev-routing
CORRECTION_HEAD_SHA  = 8a37f44547557caf9f684b49aa7ec7d06361efc9
BRANCH_CI            = 36746849199 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = GAI-005 9 pass, root 110 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 48169de, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

原始元数据保留任务、两host、领取、工作簿、基线、开发／纠正SHA与CI、检查、禁止合并和完成状态。

## 1. 独立审查方法

两次审查针对开始前的字节核验不可变frozen-48169de，四file match=True，第十二次隔离。判断前读工作簿验收，修复模块重放原复现并成对回归。

## 2. 已确认缺陷与修复

本主机六缺陷，对方确认并再加六机制。八修、四记下方。

| id | 严重度 | 机制 | 修复 |
|---|---|---|---|
| C1 | high | 非枚举own execute／action_ref绕执行字段scan，携execution classification当clean | 完整own keys cycle-safe |
| C2 | high | 未验policy.ambiguous_channel原样chosen.route，可TELEPATHY／null，custom-policy却验CHANNELS | 构造验policy值 |
| C3 | high | min_confidence null／-1／high／NaN去confidence gate | finite [0,1] |
| C4 | medium | key in DETERMINISTIC_SPEC接受Object.prototype同名command字段 | Object.hasOwn＋Reflect.ownKeys |
| C5 | medium | 循环JEV output scan raw RangeError | WeakSet |
| C6 | medium | clone(result)??{routed:true}把无返回作success，port failure无type逃逸 | result须record，failure ENGINEERING_ROUTE_DEFERRED |
| C7 | low | isIsoInstant shape-only | calendar round-trip |
| C8 | low | 同command_ref两rule Map静默覆盖 | duplicate拒 |

### C1／C2／C3：三种夺走gateway路由决策的方法

头部说JEV永不执行Action／授permission／成为canonical，最终route由gateway policy而非JEV决定。冻结版本：

- classification以非枚举execute／action_ref绕Object.entries扫描，载荷随后使用。
- 决定歧义route的policy value未验，TELEPATHY／null入canonical chosen.route，custom-policy却查CHANNELS，同函数两标准。
- 未验policy去confidence threshold，0.01 confidence也jev_used:true。

## 3. 核对审查者声明

- D1–D7映C5／C2、C6、4.1、C3、C2、C7、C1。
- 不接受key in DETERMINISTIC_SPEC“不可利用”。probe证own constructor／toString／valueOf／__proto__ command被接受，deterministicCommands().length为1，普通unknown拒。无论如何C4修，negative记分歧非falsification。
- D9 duplicate半C8，prefix-overlap随array order胜者记4.3。
- D10每实例decision_id counter、D11 unknown request忽略记边界：counter是计划契约documented pattern，request不persist，未知字段不进canonical，记录与command asymmetry。
- 接受未执行条件性：生产JEV in-process则非枚举绕可达，JSON wire则不可达，契约无法判。guard无论都正确，可达性记录不假定。

## 4. 有意不修与边界

1. 缺confidence推荐仍绕threshold，对方D3 high。confidence===null不比、分类仍用，FALLBACK_REASONS声明JEV_RECOMMENDATION_ABSENT从不产。修会改作者可能断言routing semantics，验收“可用时歧义轻文本可用JEV”不要求confidence。Owner结转：缺值作无signal启声明码，或document缺值为无界confidence；这是最尖锐剩余fail-open。
2. general_ai_intents声明无决策读，D8。policy只QUESTION仍COMMAND路GENERAL_AI，修改变请求到AI范围，记Owner，类似EM004 probe.installed。
3. prefix重叠按array order，/city与/city open都匹配后者，Map insertion首胜。确定但不能表达最长匹配。
4. preferred_channel可直接ENGINEERING／DETERMINISTIC，classifier能选privileged channel；关键ACTION／HIGH-risk确认仍先于channel，保既有词汇而记录非限制“修复”。
5. scan无depth cap，deep非cycle仍递归，对方约5900深崖。cycle guard闭现实敌对shape，depth为更强后续，与兄弟同类修一致。
6. 无Android观察／Computer-Use，纯module无surface。

## 5. 测试与CI

作者6/6不变，6→9，每negative配合法：hidden execution拒／honest classification用，invented policy拒／canonical兑现，duplicate command ref拒／clean确定路。

```text
node --test tests/*.test.mjs                -> 110 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 48169de)
node scripts/check-bilingual.mjs            -> SYNCHRONIZED
```

根110、rooms69、city1801全过0败（7跳），48169de上10promotion记录、双语同步。实现CI36746849199 gateway-web／android success，general-ai/GAI-005-triage-jev-routing @8a37f44。

## 6. 未明示决策（问题／选择／理由）

1. 信policy多远：policy选值，所以验canonical channel、finite in-range confidence、真实arrays、boolean。custom-policy已经验，default漏使一函数两标准，invented string进canonical。
2. port result含义：须record，无不是成功，throw为typed deferral。??routed:true把未路handoff报已路，是反复修的无证据成功。
3. hidden field算不算field：所有枚举性own keys、cycle-safe。classifier不得回execution，nonenumerable不改其性质。
4. 两rule同ref：拒。静默保最后使deterministic table依构造顺序，deterministic-first不能意味此事。

## 7. 如实自身错误

- 回归误断ambiguous_channel:GENERAL_AI应拒；canonical且歧义选它属policy权力。test错非code，已改并记边界。
- append tests用了不存在expectCode，自己定义而非假定作者harness，diff可见。
- 未发现对方D2无port result作success、D3缺confidence、D8未读policy。D2修，D3／D8改routing semantics非mechanism，记Owner裁决。

## 8. 结果

八机制修、成对回归与原复现重放。一个“被否定怀疑”记有probe证据分歧，六有理由边界含两剩余fail-open明确命名、不折进成功声明，作者suite从未削弱。

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/general-ai-gateway/GAI-005-triage-jev-routing.md
```

原始结论保留纠正完成与已更新控制工作簿。
