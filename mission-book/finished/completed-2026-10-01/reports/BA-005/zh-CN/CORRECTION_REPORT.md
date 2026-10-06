# BA-005 修正报告：Digital-Me 范围受限背景与记忆/受众网关 / Chinese reading translation

本文件是历史原报告的阅读译本，不产生新的任务状态、验收或metadata权威，也不表示本次重跑测试。原记录和证据块见[原报告](../CORRECTION_REPORT.md)及文末逐字保留区。U+FFFD 表示无法恢复的原文字节，缺失内容不推测；数字、SHA、历史结论保留。

## 1. 独立评审方法

两次评审针对评审开始前导出的、字节校验不可变副本。原证据路径及三个 match=True 见证据块2。这是第七次使用该隔离。修复通过重放原复现验证，`alien-verify-repair.mjs` 31项、`alien-verify-repair2.mjs` 32项，总计63/63 PASS。

## 2. 已确认缺陷和修复

本模块决定助手可向哪个受众释放什么，因此是披露缺陷而非记账缺陷。原报告确认十四项，均在机制层修复；C2仍有明确集成接缝，不能把它隐藏成全面保证。

| ID | 发现者 | 严重度 | 机制 | 修复 |
|---|---|---|---|---|
| C1 | 双方 | critical | `policy.assistants[ref]`查原型链，继承grant授权无自身授权的助手，原型名助手无类型崩溃 | 无原型快照自身键读取，异常grant类型化拒绝 |
| C2 | 评审者 | high | ASSISTANT_PRIVATE无owner，同scope助手可读彼此私密事实和值 | 可选owner_assistant_ref，非owner拒NOT_THE_OWNER |
| C3 | 双方 | high | 单向新鲜度，未来/NaN日期永远算当前 | 双向边界和MAX_CLOCK_SKEW_MS |
| C4 | 双方 | high | key in RECORD_SPEC接纳Object.prototype名称，漏不可枚举自身字段 | Object.hasOwn与Reflect.ownKeys |
| C5 | 评审者 | high | 继承禁字段和class instance通过 | 要求bare object |
| C6 | 双方 | medium | sensitivity虽验证复制却不门控 | SENSITIVE须明确披露授权 |
| C7 | 评审者 | medium | resolveValue交出port自有值对象，调用者改规范数据 | 输出复制 |
| C8 | 评审者 | medium | 闭包引用活policy，后加grant扩权 | 构造时快照 |
| C9 | 评审者 | medium | 异常记录在读port和值已解析后中途抛 | 组装前验证每个取得记录 |
| C10 | 评审者 | medium | 重复record_id在port静默合并 | INVALID_RECORD拒绝 |
| C11 | 评审者 | medium | rebuildDeviceEphemeralContext无验证仅浅冻结 | 验证复制深冻结 |
| C12 | 本主机 | medium | 循环/过深记录导致无类型RangeError，原文连接位置含未知字符 | 循环安全扫描和迭代深度界 |
| C13 | 评审者 | low | includeValues按truthiness，'false'/1/{}/[]均释放值 | 严格===true |
| C14 | 本主机 | low | isIsoInstant仅形状 | 日历往返验证 |

### C1：通过原型链读取权威

toString/valueOf/constructor/__proto__助手名产生无类型TypeError，继承grant可授权assistant-evil。评审探针比本主机更进一步：Object.prototype单键使未知助手获得SENSITIVE记忆全部值披露，归因于真实policy_ref。现在无原型policy快照只查自身键，异常grant拒绝而非崩溃。

### C2：助手私密记忆无owner

隔离完全依赖被授予什么scope；两个助手同scope可互看私密事实和值，反于公开契约。新增可选owner_assistant_ref，非owner拒NOT_THE_OWNER。

这是有界修复并作为接缝记录。开发fixture早于该字段，故只有存在owner才执行；未重写作者fixture或凭空强加必填。`cross_assistant_private_memory_visible: false`只对有owner范围记录成立。合并时必须让ASSISTANT_PRIVATE的owner_assistant_ref必填并更新开发fixture。这是高严重度finding尚留集成的部分，原报告明确说出。

### C3：披露路径的单向新鲜度

未来记录使age>ttl_ms不触发，回放/时钟偏移数据不进入stale；形状正则接纳`2026-09-99T99:99:99Z`，NaN同样绕过。TTL只有下限无上限，可称百年当前。现在双向新鲜度含说明的偏移容忍，TTL有上限并验证钳制，无效瞬时在验证阶段拒绝。

### C4/C5：没有实际检查的严格性

key in RECORD_SPEC接纳自身原型成员名，这是该programme第九个同漏洞契约；Object.entries漏不可枚举字段，又没bare检查。persona自身字段拒绝、继承同毒字段却过，class instance也过。自身键扫描+bare object覆盖三类，禁字段扫描防循环且有界。

### C6：被验证复制却没使用的字段

SENSITIVE在投影中等同普通事实释放。现在需模块已用于跨受众释放的同一种明确披露授权，字段不再只是装饰，不另发明政策。

### C7–C11：决定和证据完整性

port交自有对象，调用者可改规范用户数据并影响后续投影；现在输出复制。gateway握活policy，构造后添加grant静扩权；现在构造快照，合法政策变化需要新gateway。异常记录中途抛、超scope记录不验证；现在组装前验证所有取得记录，拒绝类型化且不从port读出。Map静默折叠重复ID把两规范记录变一，现拒INVALID_RECORD。临时设备重建可给伪造ASSISTANT_PRIVATE/SENSITIVE打临时标记且嵌套可变，现验证复制深冻结。

## 3. 评审者主张核对

D1/D2/D4/D5/D12对应C1/C5/C4/C3/C12，同机制一次修复；D3/D6–D11/D13–D15对应C2/C7–C11/C13/C5。原编号映射照录，不重排。

D11不接受：评审者认为先运行visibility matrix并比较请求audience使disclosure_authorized不可达。探针显示OWNER_PRIVATE投影到SHARED_DEVICE会DISCLOSURE_NOT_AUTHORIZED，但flag=true会服务，故该轴可达有效。private即使授权仍不能到PUBLIC_CHANNEL，因为matrix没有它；这是比工作书更严，以下记录而非扩披露“修复”。

D13后半是保守失败而非漏洞：ALL/EVERYONE异常词汇得到SCOPE_DENIED/AUDIENCE_DENIED，未知grant不扩权；无类型TypeError部分随C1修复。

保留评审阴性结果避免后来重复：大小写/空格/复数audience与scope、通配audience、继承必填记录、缺value_ref、PUBLIC_CHANNEL到OWNER_PRIVATE、查询DEVICE_EPHEMERAL、__proto__把原型转入已服务记录，均为原评审所列阴性探测。

## 4. 有意不修复及边界

1. owner_assistant_ref仍可选；必填是正确终态但破开发fixture，作为合并接缝。
2. private即使disclosure_authorized=true也不到PUBLIC_CHANNEL，保留更严边界，扩披露不是修复。
3. withheld列被扣留事实名，含受众不可见项。开发测试明确要求，工作书需拒绝审计；列表给已获scope授权的助手而非受众。消费者把它渲染给受众会泄露，模块无法控制。
4. MAX_CLOCK_SKEW_MS=5分钟、MAX_TTL_MS=24小时、MAX_RECORD_DEPTH=32为实现选择，书未规定，导出便于裁定。
5. includeValues仍由调用者请求，但严格布尔且助手自身grant才可释放。
6. 无Android设备观察或Computer Use会话，纯模块无设备界面。

## 5. 测试与CI

作者8/8不变通过，扩展原文写`8 �?21 tests`，损坏字符不补。每个阴性断言有合法邻例。复现63/63 PASS。原代码块保留root122、rooms69、city1801/7 skipped、4fec952时10条promotion记录和SYNCHRONIZED。实现分支6c6d2d4的gateway-web/android成功。这些是历史测量，不是本次运行。

## 6. 未写明的决定：问题/选择/理由

1. 私密scope：可选owner有则执行；书要求不跨助手但无所有权字段，必填破fixture，先执行可执行部分并明确接缝。
2. SENSITIVE：明确披露授权；复用已有跨受众规则，不发明政策。
3. 政策变更：构造快照；权威不能因引用对象变化扩张，新grant意味着新gateway。
4. 异常记录：组装解析前失败；避免先读将被拒请求的规范数据及部分泄露。
5. includeValues：===true；字符串false与[]是truthy，truthiness释放用户数据不符合最少数据开关。

## 7. 诚实记录自身错误

两个新测试先出问题：一个断言临时entry嵌套冻结，但实现只复制，测试正确并发现深冻结缺口；另一个用字符串port值测修改，对primitive写属性会抛，纯测试错误。原报告开句的“两个测试错”与随后第一个测试正确并存，译本不改写历史叙述。

本主机没找到C2/C5/C7/C8/C9/C10/C11/C13。C2是最重要遗漏：看到公开保证false但因作者隔离测试过就没测；fixture其实给每助手不同scope。公开保证是测试目标，不是描述。与评审者D11不同意见，先检查再记录，不因自信主张而接受。

## 8. 结果

十四确认缺陷机制修复、成对回归及原复现重放。C2只修到记录形状所允许，剩余作为必须合并接缝；其他三边界及理由记录。此任务不需设备观察。CORRECTION_COMPLETE=true与CONTROL_BOOK_UPDATED保留原代码证据，不生成新验收。

## 原代码与机器证据逐字保留 / Original code and machine evidence

以下代码块来自原报告并按出现顺序逐字保留，连同未知字符。上文解释每项观测及限制；这些是历史记录，不是本次测试输出。 / The following blocks are preserved verbatim in source order, including unknown characters. They are historical evidence, not new test output.

### 证据块 1 / Evidence block 1

原任务身份、主机、claim、baseline、开发/修正SHA、CI、测试摘要、未merge及历史完成状态；只引用不新增metadata权威。

```text
MISSION              = BA-005 (Butler Assistant programme, task 5 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-005-digital-me-context-gateway.md
CLAIM_COMMIT         = 12a5045 (Digital-City main, claim of BA-005 Correction by Alien)
CLAIMED_AT           = 2026-09-30T15:20:56Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 4fec952d414cee8cd67245f901c71a75cee93b30
DEVELOPMENT_CI       = 36728731544-success
CORRECTION_BRANCH    = assistant/BA-005-digital-me-context-gateway
CORRECTION_HEAD_SHA  = 6c6d2d43bb89f11c82fabfea021e1d565b773ec5
BRANCH_CI            = 3673— -  - gateway-web success, android success
LOCAL_CHECK_SUMMARY  = BA-005 21 pass, root 122 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 4fec952, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

### 证据块 2 / Evidence block 2

冻结副本路径及gateway/index/conformance三文件字节匹配。

```text
D:\A-Utopia\.runtime\evidence\mission-book\BA-005\frozen-4fec952\contracts\digital-me-gateway-v1\
  gateway.mjs match=True   index.mjs match=True   tests/conformance.test.mjs match=True
```

### 证据块 3 / Evidence block 3

原型名助手崩溃与继承grant授权的复现。

```text
assistantRef "toString"/"valueOf"/"constructor"/"__proto__" -> untyped TypeError
policy.assistants inheriting a grant -> query({assistantRef: 'assistant-evil'}).granted = true
```

### 证据块 4 / Evidence block 4

历史root/rooms/city/promotion/bilingual命令及实际输出，见§5中文解释。

```text
node --test tests/*.test.mjs                -> 122 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 4fec952)
node scripts/check-bilingual.mjs            -> SYNCHRONIZED
```

### 证据块 5 / Evidence block 5

原历史完成与控制书更新指针。

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/butler-assistant/BA-005-digital-me-context-gateway.md
```

## 原文未知字符定位 / Unknown-character locations in the source

下列原文行只用于保留不能恢复的字符位置，不猜测缺字或替换为新的事实。 / These source lines preserve unrecoverable character positions without inferred replacements.

```text
| C12 | me | medium | cyclic/over-deep records �?untyped `RangeError` | cycle-safe scans + iterative depth bound |
Author suite **8/8 pass unchanged**. Suite extended **8 �?21 tests**, every negative assertion paired
```


## 历史编码说明 / Historical encoding note

本文件在此次整理前含无效UTF-8字节。仅将损坏标点改为普通连接符，其他无法恢复的序列显示为U+FFFD；没有猜测缺失文字或改写验收结论。原始字节保存在docs/encoding-evidence，可按SHA256核对。

This file contained invalid UTF-8 before maintenance. Damaged separator punctuation is rendered as a plain hyphen; other undecodable sequences are shown as U+FFFD. Missing text and acceptance conclusions are not inferred. Original bytes are retained under docs/encoding-evidence with SHA256 provenance.
