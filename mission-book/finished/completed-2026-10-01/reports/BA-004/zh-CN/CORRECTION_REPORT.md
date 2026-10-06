# BA-004 纠正报告 — 多助理在线、切换与明确交接

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = BA-004 (Butler Assistant programme, task 4 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-004-multi-assistant-handoff.md
CLAIM_COMMIT         = 6c8403a (Digital-City main, claim of BA-004 Correction by Alien)
CLAIMED_AT           = 2026-09-30T14:47:06Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = a29062fba3e88abee1830c4f1ecbd6c55e6d1c79
DEVELOPMENT_CI       = 36726727943-success
CORRECTION_BRANCH    = assistant/BA-004-multi-assistant-handoff
CORRECTION_HEAD_SHA  = b5c6249a32670da3cf0171a308e0cbddfba89d7a
BRANCH_CI            = 36733222394 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = BA-004 21 pass, root 122 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at a29062f, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. 独立审查方法

两次审查开始前，被审查修订导出到经过字节验证的不可变路径，审查者只从该导出导入：

```text
D:\A-Utopia\.runtime\evidence\mission-book\BA-004\frozen-a29062f\contracts\assistant-handoff-v1\
  handoff.mjs match=True   index.mjs match=True   tests/conformance.test.mjs match=True
```

第五次采用此隔离，再次重要：自己已推九项修复后，审查者才报告自己未发现的 D2 拒绝部分应用和 D5 交接包自身声明绕过能力门。

发现按机制而非报告者合并。用原始复现重放验证修复：alien-verify-repair.mjs 37 检查、alien-verify-repair2.mjs 27 检查，共 64/64 PASS，而非仅用新回归。

## 2. 十一个确认缺陷，均修复

| ID | 发现者 | 严重度 | 机制 | 修复 |
|---|---|---|---|---|
| H1 | 双方 | 严重 | accept 不重查所有权，旧并发交接从新所有者夺任务且误报失主。 | 接管时重查所有权与版本。 |
| H2 | 审查者 | 严重 | reject／expire 先改状态，再在返回表达式读任务，部分应用后无类型 TypeError。 | 变更前读并验证任务。 |
| H3 | 双方 | 高 | 重复仅按 handoff_id，不同内容静默丢弃。 | 内容感知重复。 |
| H4 | 双方 | 高 | Object.entries 权限扫描看不见不可枚举自身字段。 | Reflect.ownKeys。 |
| H5 | 审查者 | 高 | 能力门信包自身 required_capabilities，[] 可绕过。 | 转移必须声明要求。 |
| H6 | 双方 | 中高 | key in spec 接受原型成员名字字段。 | Object.hasOwn 与 Reflect.ownKeys。 |
| H7 | 双方 | 中 | 无在线证据仍 outgoing_assistant_still_online:true。 | 未知为 null，加验证标记。 |
| H8 | 双方 | 中 | ISO 仅形状、转换可早于提案。 | 日历往返与顺序。 |
| H9 | 双方 | 中 | 无界权限递归抛无类型 RangeError。 | 防循环、迭代深度界限。 |
| H10 | 审查者 | 中低 | store double 浅展开，共享嵌套状态无写记录即可改。 | 深拷贝、冻结写条目。 |
| H11 | 双方 | 低 | grantsByAssistant[recipientRef] 读原型链，继承授权／无类型 TypeError。 | 自身键、类型拒绝。 |

### H1（严重）— 旧交接从未提出者夺所有权

仅 propose 验所有权，A 同时提两转移都可接受，第二从刚收到任务的助理夺走：

```text
propose h1 (A -> companion); propose h2 (A -> secretary)
accept h1 -> owner = assistant-companion
accept h2 -> accepted:true, owner = assistant-secretary, previous_owner_ref = assistant-butler
```

工作簿要求一个权威新所有者，旧／并发交接不能双所有者或丢所有权；架构要求权威任务／版本保护。审计也错，把 A 写为前所有者，实际接管时是 companion。

接管时修复，且先于接收方能力，因为提出者已无所有权的交接无论接收者都无效。previous_owner_ref 现来自任务而非包。包声明但未比较 task_version 在 store 暴露时成为 CAS 门，见下 H1b。

### H2（严重）— 拒绝可部分应用

```js
record.state = 'REJECTED';
record.rejected_at = at;
return { ..., owner_ref: taskStore.getTask(record.handoff.task_ref).owner_ref };  // throws if gone
```

任务消失时，状态翻转后抛 TypeError，拒绝已应用而调用者仅见崩溃。现先读并验证任务，无法解释的拒绝根本不应用；断言仍 PROPOSED 且无 rejected_at。

### H5（高）— 包可关闭能力门

recomputeRecipientAuthority 将策略 grants 与 requiredCapabilities 取交集，而要求来自被验证包自身：

```text
propose {required_capabilities: []} -> can_take_over: true for a recipient with no grants at all
```

包说不需任何能力，工作簿要求的接收方重新评估就为空。职责转移现在必须声明所评估能力；咨询不转移任何东西，仍可无要求。

### H4／H11 — 权限穿过保护并从原型读取

- findAuthorityFields 走 Object.entries，使 Object.defineProperty(h,'lease',{enumerable:false}) 带权限绕过模块唯一核心规则，validateHandoff 返回 ok:true；现 Reflect.ownKeys。
- grantsByAssistant[recipientRef] 读原型链，toString／valueOf／constructor／__proto__ 接收者拾取原型成员并 TypeError:function is not iterable。现自身键，非数组授权条目有类型拒绝，继承授权不能代替策略。

### H6（中高）— 原型成员名全被视为契约

项目第七个同漏洞契约，作者 strictness 只试 extra:1 而非原型名，故漏掉。全部十二自身名字被接受、errors=0 且克隆入记录，普通未知字段却拒绝。现 Object.hasOwn(spec,key) 与 Reflect.ownKeys。

### H3（高）— 共享 ID 就算已经提出

同 handoff_id、不同接收者／理由第二 propose 报 DUPLICATE_HANDOFF 并丢弃，调用者以为意图已记录，却执行首次。现完全相同包是重复，不同包有类型拒绝。

### H7／H8 — 未获证据或未验证的事实

- 调用者无在线集合仍 outgoing_assistant_still_online:true，从缺证据发明断言，且该标记声称离开助理后台任务仍运行。现 null、outgoing_online_verified:false；有 presence 时双向如实。
- 正则 ISO 允许 2026-13-45T99:99:99Z、2026-02-30T00:00:00.000Z；accept／reject／expire 任意 at，包括 2026 提案用 1999-01-01，审计自相矛盾。时间须往返、转换不早于提案。

### H9／H10 — 模块证据不可靠的两方式

- 无访问集合权限递归使循环包、自引用 to、20000 深嵌套无码 RangeError；现防循环加迭代深度。
- createTaskStoreDouble 浅展开，getTask 视图与存储／输入数组共享嵌套，改视图即改规范状态而 __writes 零条，不能充当套件证据。现深复制、冻结写日志。

## 3. 审查者声称对照

- D1 task_version 部分在本契约能力内修复。所有权重查关闭可达丢所有权，store 暴露版本时 CAS 启动，TASK_STORE_PORT.version_revalidation_required=true 记录接缝。声明 port 无带版本读取，故该路径仍不启用，§4.1 为 critical 发现中刻意留给集成部分。
- D2、D5、D10 接受修复；D5 自己尤其会漏掉，曾将 required_capabilities 当固定要求而非调用者可退出项。
- 证伪怀疑记负结果避免重复：handoff 快照别名（实际深克隆）、持久不可枚举 grants（structuredClone 丢弃，存储干净但保护判定有错）、重放创建第二所有者、__proto__ 污染。
- 双方探针正确拒绝：非所有者提出、已接受交接重放、错误接受者、诚实包能力不足、自交接、终态／未知任务、畸形类型、可枚举权限字段，不需重审。

## 4. 有意不修与边界

1. 声明 port 无法强制 task_version。TASK_STORE_PORT 只有 getTask／setOwner／setExecutor／recordCheckpoint，无版本，fixture 也无，无条件门会拒所有交接。局部修复不能不改 fixture 或发明 store 字段，发明是设计变更。给合并工作簿明确带出：规范 store 必须暴露 task_version，以便除所有权外按版本拒旧交接。不是静默跳过，审查者指出声明未比较是正确的。
2. createTaskStoreDouble.__table／__writes 仍暴露。它是测试 double，交付是 port 契约；新测试刻意用表模拟任务消失／变更，记录观察。
3. 无新代码。旧交接、冲突重新提案、空能力、坏时间均 INVALID_HANDOFF 带精确详情，撤销能力复用 SCOPE_WIDENING_FORBIDDEN。增加行为，不增词汇。
4. 未执行跨重启持久化／真实并发。纯模块，无 store、scheduler、第二进程，仅测进程内保护，作为有类型接缝而非成功。
5. 无 Android 观测／Computer-Use。工作簿仅需要时授权，本纯协议无设备界面，不观测、不调用 Android Studio。

## 5. 测试与 CI

作者 7/7 不变通过，无作者测试编码缺陷。套件 7→21；每负断言有合法邻居：旧交接拒绝而当前所有者转移成功；空能力转移拒绝而咨询可无要求；消失任务有类型拒绝、完整任务仍应用；返回视图复制且真写仍记录。

原始复现两探针重放 64/64 PASS。

```text
node --test tests/*.test.mjs                -> 122 pass, 0 fail  (101 baseline + 21)
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at a29062f)
node scripts/check-bilingual.mjs            -> docs/evidence/data-records SYNCHRONIZED
```

实现 CI 36733222394 在 assistant/BA-004-multi-assistant-handoff 的 b5c6249，gateway-web／android 成功；原块完整保留根 122、rooms69、city1801（7 skipped）、promotion 10、双语同步。

## 6. 原先未明确决定（问题／选择／理由）

1. 旧交接检查放提出、接受还是两者？两者，接管权威检查。并发仅接管可见，提出看不到另一接受；先查所有权，再查能力，失主无论接收方均无效。
2. 无能力包拒绝还是接受不需能力？转移拒绝、咨询允许。接收方须重评，空声明使门为空并由受检查方输入关闭；咨询不转移，无需要求。
3. previous_owner_ref 来自接管任务而非 handoff.from，因为任务权威，包是请求。
4. 无 presence 证据选 null 与 outgoing_online_verified:false 而非 true。模块无时钟／store／网络，不能知；离开助理任务验收依赖该标记，虚构 true 非正确默认。
5. 循环／深度采用防循环与迭代 MAX_HANDOFF_DEPTH=32，由正常错误通道报告，数据深度由攻击者控制，迭代本身不溢出。
6. double 输入／输出复制、冻结写条目。泄漏 double 产生无意义绿证据，损害任务评判套件。
7. 无时钟转换时间允许缺失，拒畸形／早于提案。纯模块调用者可合法无时钟，但不能写自相矛盾审计。

## 7. 如实自身错误

- 首版旧交接修复先重算能力后重查所有权，使旧交接给无能力者报能力不足而非过期。新测试捕获，现顺序明确注释。
- 同测试初复用 fixture 策略，第二接收者无授权，断言在两拒绝间歧义。给两者授权，证明仅因过期。
- 首探针对 createHandoffCoordinator 返回值取 .coordinator，但返回已是 coordinator，B4 前崩溃；修 helper。
- 自己发现 H1／3／4／6／7／8／9／11，漏 H2／5，由审查发现，现修复；H5 提醒关注保护输入由受保护一方提供的类别。

## 8. 结果

十一确认缺陷均机制层修复，有配对回归、原始复现重放。无缩小测试关闭、无改作者测试；审查 critical 一半 task_version 门明确作为集成接缝记录理由，而非静默开放（§4.1）。本任务不需设备观测，未执行。

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/butler-assistant/BA-004-multi-assistant-handoff.md
```
