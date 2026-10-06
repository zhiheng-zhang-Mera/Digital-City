# GAI-003 修正报告：Web优先通道与持久会话 / Chinese reading translation

这是[原报告](../CORRECTION_REPORT.md)的历史阅读译本，不创建任务metadata或新验收，不表示本次运行。源代码证据块逐字保存在末尾。源内SHA/状态/先后记录及原结果表述保持不变；U+FFFD未知字不猜测。

## 1. 独立评审方法

评审前导出字节校验不可变frozen-e55da49（三文件match=True），两评审，第九次隔离。修复经原复现重放和成对回归。先读工作书实际验收很重要：review brief误推去重/紧急保证，而实际更窄且不同：默认WEB；登录/profile在允许restart/reopen后保留；过期AUTH_REQUIRED非SUCCESS；页面selector漂移PAGE_CHANGED/UNAVAILABLE非编造输出；cancel诚实协调Web run；提供者适配失败不毁其他provider/account；不访问Boss profile/process/endpoint/repo。

若不读书会误报两项：本任务不要求request dedup所以缺失非缺陷；跨provider隔离确实必需，故C1违反验收而不只是原则。

## 2. 已确认缺陷和修复

| ID | 严重度 | 机制 | 修复 |
|---|---|---|---|
| C1 | high | 持久blob可声称活session_ref，外国provider/account接管正在运行会话 | restore不得占活ref |
| C2 | medium | 不可枚举自身cookies躲扫描进入City状态 | 自身键完整、循环安全 |
| C3 | medium | persist写version而restore不核，不同schema静恢复 | 版本必须匹配 |
| C4 | low | opened_at无验证，caller文本存为持久时间 | 入状态验证instant |

### C1：跨提供者接管活session

原复现live web-session-1属于provider-alpha/handle-A/conversation-1；caller restore同ref但provider-BETA/别account/handle-B/别conversation成功，随后persist报告BETA。blob由caller供，Map key完全信persisted.session_ref，导致他人状态替活会话。书“不毁其他provider/account”是身份保证，也符合session/profile/handle权威分离。现活ref拒，须先close；未用ref恢复仍合法，是真restart/reopen路径。

### C2：非枚举键隐藏原始浏览器状态

findForbiddenPersistedFields用Object.entries漏自身非枚举cookies，scan空、restore成功，而枚举cookies抛RAW_COOKIE_IN_CITY_STATE。公开保证是raw浏览器状态不进持久City。现Reflect.ownKeys全自身键、循环安全；故障顺序故意raw cookie优先身份冲突，安全诊断胜。作者suite要求同顺序，初修弄错见§6。

### C3/C4：持久卫生

persist写web_channel_version1而restore不读，999或无version均恢复。别schema不是本模块状态，现拒。opened_at以at??null直接存，nonsense/1e21入City。现输入typed验证，isIsoInstant日历往返，坏日期拒而不存。

### 第二轮：新增五机制，修四

评审在首次push后到达，确认C1–C4再加五主机未找机制；四项第二commit修，CI36741939879，第五记下。

| ID | 严重度 | 机制 | 修复/处置 |
|---|---|---|---|
| C5 | high | restore通过原型读profile_handle_ref/session_ref且接纳class；只own version对象可恢复 | 持久状态须bare自身属性对象 |
| C6 | high | complete先置SUCCEEDED后读session，已关闭会话也成功却丢thread | 先读owner session，closed typed拒且执行保持RUNNING |
| C7 | high | accountRef无验证，raw credential经persist/JSON/restore/persist往返，原连接字损坏 | handle须reference-shaped且非credential-shaped |
| C8 | medium | 禁名精确小写，Cookies/TOKENS等通过 | 不分大小写 |
| C9 | medium | request未知字段原样传adapter | 不修，见§3.6 |

C7两次：初grammar[A-Za-z0-9:._/-]允许GitHub token（字母数字下划线），自己的新test抓住。现另拒GitHub/Slack/AWS/provider key/JWT/PEM等可识别凭据形状，复用EM-004机制。

## 3. 记录而未修边界

1. 无request dedup也不要求，相同request_ref两execution；后续若想抑制属于开发，别修非要求。
2. complete/cancel接at不使用，回显或丢不存，验收不依赖，未发明存储。
3. 无session expiry/idle时钟逻辑，过期AUTH_REQUIRED靠adapter channel state和未解析profile handle；纯模块无clock，此层只有这种形态。
4. 每channel一个adapter结构隔离，唯一混provider路径C1现关闭。
5. 无Android观察Computer Use，纯模块无设备界面。
6. C9 request未知原传，request归provider-neutral adapter且不持久，execution只存request_ref，扩展不进规范City。书无request strict，强加spec将发明adapter词汇，Owner决定。
7. 拒execute仍保存观察channel state（评审D8）：session.state=adapter.health().state先于gate，RATE_LIMITED可留。这是provider观察不是拒请求效应，报实状态诚实，不判半应用；记录不同意见理由。
8. partial_is_final恒false（评审D11）是结构声明“partial非final”，final只成功后非null，构造即成立。计算语义需发明书无partial/final等价规则，保留。
9. D7前半无expiry/idle界与第3项相同架构边界，书按channel/handle实现而非时钟，不发明语义。

## 4. 测试和CI

作者8/8不变通过，C2按作者已断言顺序调整。扩展原文字面`8 �?11 tests`，不补缺字符。每阴性有合法邻例：live拒/unused恢复，错version拒/1接受，坏instant拒/真实存。原命令证据root112、rooms69、city1801/7 skipped、e55da49时10promotion、SYNCHRONIZED。历史实现CI36740641211在分支f718a57，gateway-web/android成功。顶部metadata另有d3f6a27f6bf809c8b3ee7c4281268f8a865928b6及LOCAL GAI13；后续CI36741939879亦原样保留，不统一改写这些时间层。

## 5. 未写明决定：问题/选择/理由

1. restore可claim任何未live ref，live拒。ref把blob绑会话，跨provider损坏是验收缺陷，不静mint新ref令caller持未告身份。
2. foreign且dirty时raw-cookie拒优先，具体更严重且suite要求。
3. version须等模块，否则拒；persist已写，忽略就是缺陷。
4. instant进入持久态时验证，其他处拒坏数据而唯一重启后保留记录却存caller文本不一致。
5. scan用WeakSet visited，caller数据递归无guard易无类型RangeError，已在四同级契约修过。

## 6. 诚实自身错误

初C1把live guard置raw-cookie前，把RAW_COOKIE_IN_CITY_STATE改INVALID_WEB_REQUEST，破作者test；代码错不是test，重排而非放松。probe把session object非ref传persist，中途崩；首运行只证明C1/C2/C3，persistence controls直到修harness才跑。回归误assert.cookies而实际默认前缀state.cookies，修测试。差点根据自己brief将无dedup判缺陷，实际书不要求。

## 7. 结果

原结果段称四确认缺陷机制修、成对回归，五边界含两明确非要求，验收书而非brief决定何为缺陷。原报告已插入第二轮C5–C9并扩到九边界，但这里旧结果数字照录，不擅自更新历史接受结论。CORRECTION_COMPLETE=true及CONTROL_BOOK_UPDATED保留原证据块，不表示本次新完成。

## 原代码与机器证据逐字保留 / Original code and machine evidence

以下代码块来自原报告并按出现顺序逐字保留，连同未知字符。上文解释每项观测及限制；这些是历史记录，不是本次测试输出。 / The following blocks are preserved verbatim in source order, including unknown characters. They are historical evidence, not new test output.

### 证据块 1 / Evidence block 1

原任务身份、主机、claim、开发/修正SHA、CI及测试/merge/完成摘要，不据此新增当前验收。

```text
MISSION              = GAI-003 (General AI Gateway programme, task 3 of 9)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-003-web-channel-persistent-session.md
CLAIM_COMMIT         = 65021fb (Digital-City main, claim of GAI-003 Correction by Alien)
CLAIMED_AT           = 2026-09-30T15:51:34Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = e55da499193b644280fd34eee63749d9c9e9c8a4
DEVELOPMENT_CI       = 36729727681-success
CORRECTION_BRANCH    = general-ai/GAI-003-web-channel-persistent-session
CORRECTION_HEAD_SHA  = d3f6a27f6bf809c8b3ee7c4281268f8a865928b6
BRANCH_CI            = 36740641211  - gateway-web success, android success
LOCAL_CHECK_SUMMARY  = GAI-003 13 pass, root 112 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at e55da49, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

### 证据块 2 / Evidence block 2

foreign provider/account以相同活session_ref覆盖当前会话的原复现，见C1。

```text
live session       = web-session-1  provider-alpha  handle-A  conversations ["conversation-1"]
restore({ session_ref: "web-session-1", provider_ref: "provider-BETA",
          account_ref: "account-someone-else", profile_handle_ref: "handle-B",
          conversation_refs: ["conversation-from-another-account"] })  -> restored: true
session afterwards = conversation-from-another-account
persist(live.session_ref).provider_ref -> "provider-BETA"
```

### 证据块 3 / Evidence block 3

枚举cookies拒而不可枚举扫描空且restore成功的原复现，见C2。

```text
enumerable cookies     -> WebChannelError RAW_COOKIE_IN_CITY_STATE
non-enumerable scan    -> []
non-enumerable restore -> restored: true
```

### 证据块 4 / Evidence block 4

原历史root112/rooms69/city1801/跳过/promotion及bilingual命令输出，见§4。

```text
node --test tests/*.test.mjs                -> 112 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at e55da49)
node scripts/check-bilingual.mjs            -> SYNCHRONIZED
```

### 证据块 5 / Evidence block 5

原历史完成和控制书更新指针。

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/general-ai-gateway/GAI-003-web-channel-persistent-session.md
```

## 原文未知字符定位 / Unknown-character locations in the source

下列原文行只用于保留不能恢复的字符位置，不猜测缺字或替换为新的事实。 / These source lines preserve unrecoverable character positions without inferred replacements.

```text
| C7 | **high** | `accountRef` was stored with no validation at all, so raw credential bytes round-tripped through persist �?JSON �?restore �?persist with the guard reporting nothing | an account handle must be reference-shaped **and** not credential-shaped |
suite already asserts). Suite extended **8 �?11 tests**, every negative assertion paired with a
```


## 历史编码说明 / Historical encoding note

本文件在此次整理前含无效UTF-8字节。仅将损坏标点改为普通连接符，其他无法恢复的序列显示为U+FFFD；没有猜测缺失文字或改写验收结论。原始字节保存在docs/encoding-evidence，可按SHA256核对。

This file contained invalid UTF-8 before maintenance. Damaged separator punctuation is rendered as a plain hyphen; other undecodable sequences are shown as U+FFFD. Missing text and acceptance conclusions are not inferred. Original bytes are retained under docs/encoding-evidence with SHA256 provenance.
