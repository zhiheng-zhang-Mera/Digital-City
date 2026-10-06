# RF-005 修正报告：远程邀请、会议码及深链接会合 / Chinese reading translation

这是[历史原报告](../CORRECTION_REPORT.md)的阅读译本，不是新metadata权威或当前运行验收。代码证据全文逐字保留，原状态SHA与先后结论不改，U+FFFD缺失字不猜测。

## 1. 评审方法及时间方面的诚实限制

评审前导出字节校验不可变frozen-52646ac，四文件match=True，第十三次隔离。先看书实际验收再判断，主机自行探模块并修四机制，每项重放原复现和成对回归。

重要限制：repair push时第二个独立敌对probe仍运行。以下每主张是主机独立复现；若probe再有finding，应同分支follow-up commit，工作书重开IN_PROGRESS。programme先例是有确认缺陷就不完成，GAI-002因此跨两commit保持IN_PROGRESS。

## 2. 已确认缺陷和修复

| ID | 严重度 | 机制 | 修复 |
|---|---|---|---|
| C1 | high | policy数字无验证单向，MAX_SAFE_INTEGER TTL可数世纪，max_attempts无界取消猜测限制 | policy验证有界和MAX_INVITE_TTL_MS硬顶 |
| C2 | medium | 坏percent deep/web link decodeURIComponent抛无类型URIError，不返verdict | decode guard，BAD_LINK |
| C3 | medium | createInvite坏at导致toISOString无类型RangeError | instant日历往返，expiry typed guard |
| C4 | medium-low | revoke已consumed把USED改CANCELLED | terminal保原结果，RENDEZVOUS_UNAVAILABLE |

### C1：邀请层两项失责边界

createInvite按config.max_ttl_ms校TTL，而config来自未验证spread，ceiling本身caller控。原probe MAX_SAFE_INTEGER policy接受ttl1e15及max_attempts。邀请是短寿rendezvous指针，验收猜枚举不泄device存在依赖真实limiter。现MAX_INVITE_TTL_MS24h及MAX_RATE_LIMIT_ATTEMPTS硬限导出，policy只缩不取消。max_attempts0原已fail-closed，真正fail-open为无界方向。

### C2/C3：恶意输入无类型崩溃

parseLocator承诺本地无lookup，只告诉caller自己输入格式。但`digitalcity://join?c=%E0%A4%A`抛URIError，坏2026-13-45T99:99:99Z抛Invalid time RangeError。现typed，isIsoInstant日历往返使后者拒而非崩。

## 3. 攻击后正确拒绝的对照

已用code二次redeem RENDEZVOUS_UNAVAILABLE；二次confirm ALREADY_CONFIRMED；decline保ACTIVE且不耗use；非host不能confirm NOT_THE_HOST或revoke；过期与未知不可区分；未confirm调用capability为CONFIRMATION_REQUIRED，接受后仍RENDEZVOUS_IS_NOT_A_CAPABILITY_PATH；reconnectViaInvite拒RENDEZVOUS_IS_NOT_RECONNECT_AUTHORITY；无明确policy multi-use拒MULTI_USE_NOT_PERMITTED；短entropy拒ENTROPY_REQUIRED；窗口第六次rate-limit。保留这些以免重复争论。

## 4. 记录未修边界

1. future at仍让窗口在未来开始，clock按设计注入、纯模块不能编时间；C1限制窗口长度，属clock契约后果，Owner知悉。
2. 每redeem生成ticket，host确认才耗，decline不耗是作者设计，按client_ref限流；一个locator可累待ticket。
3. limiter窗口信caller at，caller可塑自身窗口。
4. journal是读时clone的审计列表，无总量界，记录不cap。
5. 无Android观察Computer Use，纯模块无设备界面。

## 5. 测试和CI

作者6/6不变过，原写`6 �?9 tests`未知字不恢复。每阴性有合法邻：永生ceiling拒而合法长窗受，坏link BAD_LINK而好link仍parse，consumed保持USED而active可cancel。

原命令证据root110、rooms69、city1801/7 skipped、52646ac时10promotion、SYNCHRONIZED；顶部后续LOCAL root111/模块10等照留，不将历史记录统一改数。实现CI36748021061在2594512 gateway-web/android成功；后续d4fb944/CI36748913540见§9–11。

## 6. 未写明决定：问题/选择/理由

policy可缩窗口/限流不能移除，ceiling模块常量；模块以max_ttl_ms保护ttl而guard caller控使decorative，与RF-004/EM-004单向界同类。坏link返BAD_LINK，因为本地验证须对恶意输入活下来，崩溃不是verdict。terminal USED保USED，因为journal投影都报结果，改CANCELLED使审计不符。expiry用guard toISOString越界拒，不让RangeError逸出，与RF-004 caller instant同类。

## 7. 诚实自身错误

回归从index.mjs import新constant，但index显式re-export非export*，suite link失败。改直接module import；新导出是否属公开surface值得惯例，记录不静决定。第二独立probe未回就ship，主机review已完且全部复现修复，但时间限制在§1明确，免后来发现。

## 8. 首轮结果

原首轮结论四机制修、成对回归、原复现；五边界有理由、有效防护列表、仍在运行第二评审限制。不省略。CORRECTION_COMPLETE=true及CONTROL_BOOK_UPDATED原块保留。这是历史首轮叙述，后续新增如下，不重写首轮结论。

## 9. 第二轮：首轮没关闭的两个high finding

原标题连接处含未知字，含义只翻译可读部分，不补字符。独立probe首repair之后回报，确认C1–C4并加两主机漏的high，一项证明C1初修未堵目标漏洞。两项现修于d4fb944，CI36748913540。

| ID | 严重度 | 机制 | 修复/处置 |
|---|---|---|---|
| C5 | high | throttle仅isText(client_ref)才跑，caller省字段；200000格式正确猜测零throttle，C1bound无帮助 | 无名共享anonymous bucket，超限返generic失败不泄 |
| C6 | high | preview/redeem/confirm/revoke允许caller at覆盖clock，去年过期仍confirm trust_established true；不可解析at让全部比较false，邀请永生且limiter失效 | 每decision path round-trip验instant，不可解析INVALID_INVITE |
| C7 | medium | locateFromUrl不核host，所有HTTPS含digitalcity.local@evil.example可WEB_LINK | 记录不修见§10 |
| C8 | medium | redeem不耗、待ticket无cap，单use邀请20000保留ticket | 记录不修见§10 |

C5是本次核心发现：首轮界policy却保caller字段条件，验收枚举不泄仍未达。评审200000猜揭示，强制路径始终执行bound才是bound。C6恢复初轮假定：NaN instant让Date.parse差NaN、每比较false，过期和limiter一起消失，验instant让其他gate可达。原有未知连接字符保存在附录，不猜原字。

## 10. 第二轮新增边界

任何HTTPS host可WEB_LINK（C7），parser提code不核origin，攻击host也parse。要到preview仍需真rendezvous ref，因此是link来源政策而非trust grant；书未规定pin origin，Owner裁。

待tickets不cap（C8），确认才耗use，locator可累待；现limiter界速率不界总量，cap会改文档行为。future at仍未来窗口，clock注入，原§4.1引用损坏字符照留。

## 11. 过程说明

首repair2594512在独立probe回前push，首C5test错：断言每匿名lookup失败，但邀请仍可用，前五次合法成功。推了失败test，同一分钟local抓到，d4fb944修好才CI报告。两个事实都记，因为现在head CI绿，读者应知何时哪个commit绿。最终原块d4fb94447a33fb005aab2af359a9ba385298b6fa、CI36748913540、模块10/root111/rooms69/city1801保留，原编码未知字符不补；译本不更新任务状态。

## 原代码与机器证据逐字保留 / Original code and machine evidence

以下代码块来自原报告并按出现顺序逐字保留，连同未知字符。上文解释每项观测及限制；这些是历史记录，不是本次测试输出。 / The following blocks are preserved verbatim in source order, including unknown characters. They are historical evidence, not new test output.

### 证据块 1 / Evidence block 1

原任务身份、主机、claim、固定SHA、CI与测试/merge/完成摘要。

```text
MISSION              = RF-005 (Remote Fabric programme, task 5 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-005-remote-invite-rendezvous.md
CLAIM_COMMIT         = 5627096 (Digital-City main, claim of RF-005 Correction by Alien)
CLAIMED_AT           = 2026-09-30T16:52:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 52646ac30c23ec33d70c4a787ac519be19969a89
DEVELOPMENT_CI       = 36737404307-success
CORRECTION_BRANCH    = remote/RF-005-remote-invite-rendezvous
CORRECTION_HEAD_SHA  = d4fb94447a33fb005aab2af359a9ba385298b6fa
BRANCH_CI            = 36748021061  - gateway-web success, android success
LOCAL_CHECK_SUMMARY  = RF-005 10 pass, root 111 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 52646ac, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

### 证据块 2 / Evidence block 2

caller把TTL和rate-limit policy上限设MAX_SAFE_INTEGER的原复现，见C1。

```text
policy { max_ttl_ms: Number.MAX_SAFE_INTEGER } -> createInvite({ ttl_ms: 1e15 }) accepted
policy { rate_limit: { max_attempts: Number.MAX_SAFE_INTEGER } } -> accepted, policy() reports it
```

### 证据块 3 / Evidence block 3

坏percent链接及坏calendar instant的无类型错误复现，见C2/C3。

```text
parseLocator('digitalcity://join?c=%E0%A4%A')       -> URIError: URI malformed
createInvite({ at: '2026-13-45T99:99:99Z' })        -> RangeError: Invalid time value
```

### 证据块 4 / Evidence block 4

历史root110/rooms69/city1801/跳过/promotion/bilingual输出，见§5。

```text
node --test tests/*.test.mjs                -> 110 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 52646ac)
node scripts/check-bilingual.mjs            -> SYNCHRONIZED
```

### 证据块 5 / Evidence block 5

首轮原历史完成与控制书更新指针。

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/remote/RF-005-remote-invite-rendezvous.md
```

### 证据块 6 / Evidence block 6

第二轮最终修正SHA、CI、模块10/root111/rooms69/city1801历史值，编码损坏字符保留，见§11。

```text
CORRECTION_HEAD_SHA  = d4fb94447a33fb005aab2af359a9ba385298b6fa
BRANCH_CI            = 36748913540 �� gateway-web success, android success
LOCAL_CHECK_SUMMARY  = RF-005 10 pass, root 111 pass, rooms 69 pass, city 1801 pass
```

## 原文未知字符定位 / Unknown-character locations in the source

下列原文行只用于保留不能恢复的字符位置，不猜测缺字或替换为新的事实。 / These source lines preserve unrecoverable character positions without inferred replacements.

```text
Author suite **6/6 pass unchanged**. Suite extended **6 �?9 tests**, every negative assertion paired with
## 9. Second review pass �� two high findings the first pass did not close
| C5 | **high** | rate limiting was **opt-in**: `throttle()` ran only `if (isText(client_ref))`, and `client_ref` is caller-supplied, so an enumerating caller simply omitted it �� 200 000 well-formed guesses drew zero throttles. Bounding `max_attempts` (C1) did not help: a limiter that never runs has no limit. | an unnamed caller now shares one anonymous bucket; its over-limit answer is the *generic* failure, so throttling leaks nothing |
| C6 | **high** | the caller supplied the time: `at: when` overrode the injected clock on preview/redeem/confirm/revoke, so an invite expired a year earlier still confirmed with `trust_established: true`, and an unparseable `at` made every expiry comparison false �� any invite immortal, and the limiter disabled with it | every decision path validates its instant (round-trip); an unparseable one is `INVALID_INVITE` |
| C7 | medium | `locateFromUrl` never validated the host, so any HTTPS origin was blessed as a valid `WEB_LINK`, including `https://digitalcity.local@evil.example/join/<code>` | recorded, not repaired - see ��10 |
| C8 | medium | `redeem` never consumes and nothing caps outstanding tickets: 20 000 retained tickets from one single-use invite | recorded, not repaired - see ��10 |
3. **A future-dated `at` still starts the window in the future** (��4.1): the clock is injected by design.
attempt at the C5 test was wrong �� I asserted that every unnamed lookup fails while the invite was still
BRANCH_CI            = 36748913540 �� gateway-web success, android success
```


## 历史编码说明 / Historical encoding note

本文件在此次整理前含无效UTF-8字节。仅将损坏标点改为普通连接符，其他无法恢复的序列显示为U+FFFD；没有猜测缺失文字或改写验收结论。原始字节保存在docs/encoding-evidence，可按SHA256核对。

This file contained invalid UTF-8 before maintenance. Damaged separator punctuation is rendered as a plain hyphen; other undecodable sequences are shown as U+FFFD. Missing text and acceptance conclusions are not inferred. Original bytes are retained under docs/encoding-evidence with SHA256 provenance.
