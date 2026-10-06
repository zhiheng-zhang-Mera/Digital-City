# EM-005 修正报告：注意力桥接的当前与近期设备提醒投递 / Chinese reading translation

这是[原报告](../CORRECTION_REPORT.md)的历史阅读译本，非新任务metadata、运行或验收。原证据块文末逐字保存；未知U+FFFD不补字，状态数字SHA结论不修改。

## 1. 独立评审方法

评审开始前字节校验不可变frozen-adf0cf5（三文件match=True）进行两次评审，本会话第八次隔离。用alien-verify-repair.mjs重放原复现和新增成对回归验证修复。

## 2. 已确认缺陷和修复

评审者确认十项，主机独立七项；去重九机制均机制修复。

| ID | 发现者 | 严重度 | 机制 | 修复 |
|---|---|---|---|---|
| A1 | 双方 | high | key in ATTENTION_ENVELOPE_SPEC接纳原型成员名 | Object.hasOwn和Reflect.ownKeys |
| A2 | 双方 | high | recent无时限，多年未用仍目标、未来日期永久第一 | 窗口及clock skew，锚定open瞬时 |
| A3 | 双方 | high | acknowledge先改status后解析at，坏时间留ACKNOWLEDGED但acknowledged_by null | 修改前验时间 |
| A4 | 双方 | high | withdraw先提交状态清投影后同样抛 | 修改前验时间 |
| A5 | 评审者 | high | respond先置response_routed再clone，不可存答抛且无答 | 先clone后提交路由 |
| A6 | 双方 | high | 确认设备重放respond静换connector已收答案，声明错误码不用 | 每问题只路由一次 |
| A7 | 双方 | medium | 重复device_ref产生双投影膨胀计数 | 去重 |
| A8 | 双方 | medium | caller attention_id独当身份，不同题静丢 | 相同重投，不同typed refusal |
| A9 | 双方 | medium | ISO仅数字形状，坏日期入记录、NaN使排名依输入位置 | 日历往返 |

### A2：核心词“recent”无边界

书的invariant要提醒到用户实际使用设备，单排名不保证。原探针dev-future排一分钟前和五年前设备之前，五年旧仍recent，十年未来压全部。现30天窗口和偏移容忍都导出，仅有clock时执行。

主机初修不全，rankRecentDevices执行窗口但open没传clock，关键bridge仍把五年旧当recent；自己的probe发现。现open锚定问题打开瞬时。

### A3/A4/A5：三种半应用转换

先改规范状态再访问可抛值：ack坏时间留ACKNOWLEDGED/null owner，withdraw坏时间留WITHDRAWN，respond函数先置路由无答案。前两种最坏拒绝：告诉调用者失败却全局关闭、后续拒投、正常重试duplicate:true。现三者先验证/复制后提交，断言仍PENDING及正常重试成功。

### A6：已路由答案可替换

guard只拒其他设备，acknowledger可反复发送，静换connector已收答；原例第二答NO, CHANGED MY MIND。现恰好一次，同确认者重复抛已声明但原死代码RESPONSE_ALREADY_ROUTED。

### A1/A8/A9：严格性、身份、时间

该programme第九个key in spec漏洞；作者strict测试用非原型名所以漏。caller ID相同不同题被当重投丢，现内容一致仍重投、不同拒。评审指出新thread合法reopen不投新current device，同属返回旧记录不重新投影机制，以下记边界不静改。日历往返拒坏瞬时并除排名依数组位置NaN。

## 3. 评审主张核对

D1–D4/D6–D10对应A1–A4/A6–A9，D5=A5，是主机遗漏，探针证不可存答已提交路由。对保证5“ack不抑制未投目标”解读记文字冲突非缺陷：冻结suite及公开flags均全局关闭，描述的per-target模型模块故意不实现，Owner裁定，不在答案后重开delivery。

保证4 urgency为空而非违反，urgency/severity/priority都未知拒，没可降级路径，不把未实现称失效。阴性探针记录：原型名设备以===/Map正确处理；delivery dedup和不前进epoch有效；clone隔离有效；循环由structuredClone处理；count拒0/1/4/-1/2.5/字符串3/null。

## 4. 有意不修复和边界

1. 同题reopen返旧记录，不给新current设备投影；评审正确但重投改变已文档“一逻辑问题”模型，Owner决定。
2. alert.created_at无新鲜度界，但不用于决定，坏日期已拒，残余惰性。
3. ack全设备关闭，含未投者，冻结设计与书文字冲突。
4. RECENT_WINDOW_MS30天/MAX_CLOCK_SKEW_MS5分钟是选择，书无值，导出可裁。
5. 无紧急/严重模型，保证4未实现，新增属开发。
6. 无Android观察Computer Use，纯模块无设备界面。

## 5. 测试和CI

作者10/10不变通过；原扩展写`10 �?16 tests`，缺字符不还原。阴性断言均合法邻例。root116、rooms69、city1801、promotion OK、bilingual SYNCHRONIZED。历史metadata原块含cefc6c7ec5343a9d33ae2d6a927603be963389db和CI36739358075的损坏分隔，逐字保留，不新测。

## 6. 未写明决定：问题/选择/理由

recent选锚定open的窗口及偏移容忍，因为无界排名不达到实际使用设备目标，未来交互不可验证而非最recent。仅有时钟应用，因为纯模块无clock，ranking仍纯用，bridge始终供clock。所有可抛值修改前验证，因为失败却已改状态比慢更坏。每问题一答，acknowledger重复RESPONSE_ALREADY_ROUTED、别人ALREADY_ANSWERED，因为connector收到一个答且静替比拒更坏，已有代码。内容aware reopen相同重投不同typed拒，丢不同题掩caller错，与BA-004/EM-004同类。

## 7. 诚实自身错误

初recent修只rank未open，自己的验证push前抓到。PowerShell双引号replacement中的backtick是转义，shell编辑毁attention.mjs注释为invalid UTF8；从冻结export恢复，改Node patch脚本重做全部修，修复集不变，损坏比失败编辑更坏故记录。

三个新测试错：没import assertAttentionEnvelope、误判fixture设备ref/题文、断言字面题而未捕获；都是测试错。A5由评审发现非主机。

## 8. 结果

九机制修复、成对回归、原复现重放；原结果段称三个边界有理由、一个评审主张为保证文字冲突，即使§4实际列六项，译本保留历史表述不重计。任务无需设备观察。原CORRECTION_COMPLETE=true和CONTROL_BOOK_UPDATED在证据块保存，不成为本次新接受结论。

## 原代码与机器证据逐字保留 / Original code and machine evidence

以下代码块来自原报告并按出现顺序逐字保留，连同未知字符。上文解释每项观测及限制；这些是历史记录，不是本次测试输出。 / The following blocks are preserved verbatim in source order, including unknown characters. They are historical evidence, not new test output.

### 证据块 1 / Evidence block 1

原身份、主机、claim、SHA、CI及测试/未merge/完成状态，未知分隔字不补。

```text
MISSION              = EM-005 (Engineering Manager programme, task 5 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-005-attention-recent-device-alerts.md
CLAIM_COMMIT         = 806be50 (Digital-City main, claim of EM-005 Correction by Alien)
CLAIMED_AT           = 2026-09-30T15:36:59Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = adf0cf5e6bd17b5f1e4dba29a5f04d51743146f5
DEVELOPMENT_CI       = 36725729360-success
CORRECTION_BRANCH    = engineering-manager/EM-005-attention-recent-device-alerts
CORRECTION_HEAD_SHA  = cefc6c7ec5343a9d33ae2d6a927603be963389db
BRANCH_CI            = 36739358075 �� gateway-web success, android success
LOCAL_CHECK_SUMMARY  = EM-005 16 pass, root 116 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at adf0cf5e, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

### 证据块 2 / Evidence block 2

未来、一分钟前和五年前设备的无界排名复现，见A2。

```text
ranked = ["dev-future", "dev-touched-a-minute-ago", "dev-abandoned-five-years-ago"]
a device untouched for 5 years is still "recent": true
a device dated 10 years ahead outranks every real one: true
```

### 证据块 3 / Evidence block 3

ack/withdraw坏时间与respond不可存函数导致半应用状态，见A3–A5。

```text
acknowledge(at: "nonsense") -> INVALID_ATTENTION thrown, status afterwards ACKNOWLEDGED, acknowledged_by null
withdraw(at: "nonsense")    -> INVALID_ATTENTION thrown, status afterwards WITHDRAWN
respond(response: function) -> throws after response_routed was set, no answer stored
```

### 证据块 4 / Evidence block 4

同确认者二次respond成功并静换答案的原复现，见A6。

```text
first respond : OK
second respond: OK            <- used to succeed
stored response now = {"answer":"NO, CHANGED MY MIND"}
```

### 证据块 5 / Evidence block 5

原历史完成与控制书更新指针。

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/engineering-manager/EM-005-attention-recent-device-alerts.md
```

## 原文未知字符定位 / Unknown-character locations in the source

下列原文行只用于保留不能恢复的字符位置，不猜测缺字或替换为新的事实。 / These source lines preserve unrecoverable character positions without inferred replacements.

```text
BRANCH_CI            = 36739358075 �� gateway-web success, android success
Author suite **10/10 pass unchanged**. Suite extended **10 �?16 tests**, every negative assertion
```


## 历史编码说明 / Historical encoding note

本文件在此次整理前含无效UTF-8字节。仅将损坏标点改为普通连接符，其他无法恢复的序列显示为U+FFFD；没有猜测缺失文字或改写验收结论。原始字节保存在docs/encoding-evidence，可按SHA256核对。

This file contained invalid UTF-8 before maintenance. Damaged separator punctuation is rendered as a plain hyphen; other undecodable sequences are shown as U+FFFD. Missing text and acceptance conclusions are not inferred. Original bytes are retained under docs/encoding-evidence with SHA256 provenance.
