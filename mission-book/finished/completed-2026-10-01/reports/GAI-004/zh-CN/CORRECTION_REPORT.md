# GAI-004 修正报告——API通道、明确同意与预算策略

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = GAI-004 (General AI Gateway programme, task 4 of 9)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-004-api-channel-consent-budget.md
CLAIM_COMMIT         = f91f31a (Digital-City main, claim of GAI-004 Correction by Alien)
CLAIMED_AT           = 2026-09-30T17:05:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = fbb749272ad65c9a8de6cc303371b52fda22f7ef
DEVELOPMENT_CI       = 36735078546-success
CORRECTION_BRANCH    = general-ai/GAI-004-api-channel-consent-budget
CORRECTION_HEAD_SHA  = 11d5eced3e913cdd0cd9249d55825dedbcc3d5ac
BRANCH_CI            = 36750532665-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = GAI-004 11 pass, root 112 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at fbb7492, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. 托管CI——已解决阻塞区间

**已解决：Owner恢复GitHub Actions计费／额度，已推head无代码改动重跑。** 精确修正head两作业通过，满足完成条件。

```text
corrected head   = 11d5ece
green run        = 36750532665-gateway-web-success-android-success
local checks     = all green (see LOCAL_CHECK_SUMMARY above)
```

以下阻塞历史原样保留，旧尝试不改标成功，也未用本地PASS替托管CI。

```text
blocked interval (retained history)
  run 36750532665  push 17:19:16    gateway-web X 5s   android X 3s   job ids 110132295154/110132295312
  run 36750532665  re-run 17:24     identical, both jobs refused to start, 0 steps
resolution
  run 36750532665  re-attempt 23:54:58Z   gateway-web OK 2m1s (110151058759)  android OK 1m8s (110151058917)
```

### 保留原始记录

以下类型化外部阻塞是在账户拒绝启动任何作业时报告。

修正head 11d5ece已推，CI门禁所有本地检查绿，但Actions拒绝启动。

```text
run 36750532665 (push 17:19:16)   gateway-web X 5s   android X 3s
    "The job was not started because recent account payments have failed or your
     spending limit needs to be increased. Please check the 'Billing & plans' section"
run 36750532665 (re-run 17:24)    identical, both jobs refused to start
```

这不是代码失败，环境证据：作业不曾启动，4–6秒失败无步骤／日志；同仓Mech EM-011在17:14:47、RF-010在17:06:28、自RF-005第二轮17:05:29刚成功；立即重跑同样拒启动。

当时分类为真正外部验收步骤，等Owner恢复计费。按共规类型化pending接口绝不重写成功，故当时CORRECTION_COMPLETE=false，工作簿IN_PROGRESS、Alien持领取。head已推无需改代码，CI可用者只观察现运行。此段当时false与前文后来已解决true均保留。

## 2. 审查方法

审查前字节验证不可变frozen-fbb7492，四文件match=True；先读验收再判断，独立对抗探针对同副本。自有发现六项，探针十项，含自有完全漏的关键项。两次推送修复，两次本地门禁绿。

## 3. 确认缺陷与修复

### 第一轮：自审六项

| ID | 严重性 | 机制 | 修复 |
|---|---|---|---|
| C1 | 中 | key in spec让Object.prototype成员名当规范字段 | Object.hasOwn＋Reflect.ownKeys |
| C2 | 高 | per_action_limit/aggregate_limit为NaN/Infinity/'ten'/null使两Number.isFinite检查false，999动作调用准入；同意后第二门禁被配置关闭 | 政策有限非负数，on_unknown_usage已知值 |
| C3 | 中 | 提供商负使用计数相加提高剩余预算 | 非负安全整数 |
| C4 | 中 | 不可枚举自有api_key逃秘密扫描／脱敏，违日志／来源／报告不含秘密 | 全自有键、循环安全扫描／脱敏 |
| C5 | 中 | 缺aggregate时声明aggregate_usage_known:true、usage_absent_treated_as_zero:false却实际作0 | 字段如实报告行为 |
| C6 | 低 | ISO只形状 | 日历往返 |

C5刻意不改语义。初次缺aggregate拒绝使作者六测试中五失败，因为“同意与预算批准则API可运行”是验收，套件合法允许未给会计数据。缺陷是假主张非语义，故改字段保流程。

### 第二轮：独立探针四项

| ID | 严重性 | 机制 | 修复 |
|---|---|---|---|
| C7 | 关键 | 同意未绑定动作，无比较action_ref/scope，A同意准入B且端口运行 | 命名动作仅同意该动作，否则CONSENT_SCOPE_MISMATCH |
| C8 | 高 | estimated_actions有限数允许负值，低估per-action并aggregate下溢，-1000000在aggregate_limit:0仍准入 | 非负安全整数，消耗使用同规则 |
| C9 | 中 | provenance.credential_ref构造不可达，execute接引用admit未携 | 准入／来源携引用 |
| C10 | 中 | usageFromResponse不读prompt_tokens/completion_tokens/total_tokens，真实使用丢为unknown | 接别名 |

C7仅独立探针发现，是本修正核心。模块标题许诺用户同意→预算→准入，授权别动作不是本次同意。自审仅把validateConsent读为形状，从未问形状为何。

## 4. 记录未修的审查发现及理由

1. **无支出账本**，探针2视关键。aggregate只在调用者如实usage_so_far时绑定，缺失消耗0，accumulateUsage未接。纯模块无环境状态，账本是新状态、Owner设计非本地修。C5去假主张，会计缺口仍在。
2. **同意永不过期**，探针3。created_at验证未读，expires_at/revoked_at未知字段拒，无法表示撤销。验收未要求期限（使用规则成立），添加属发明政策。Owner续项：真实权限前须过期／撤销字段。
3. **无adapter、省protocol，admit仍api_execution_permitted:true**，探针4高。旧崩溃修成execute NO_ADAPTER_FOR_PROTOCOL/adapter_called:false；准入按作者断言仍同意＋预算分离。字段名夸大：许可执行却无执行能力。protocol必填干净但破开发夹具，记录非强推。
4. **政策无天花板**，探针10。有限非负但MAX_SAFE_INTEGER接受，工作簿无上限，交Owner。
5. **拒流调用仍来源项**，探针9。provenanceFor拒前记录，可能是正确“拒绝尝试”审计，待Owner。
6. **开发套件无同意期限／scope／账本断言。** 系统观察，解释相关缺陷与C7在绿套件仍存。

## 5. 本地验证（CI自身命令）

```text
node --test contracts/general-ai-api-channel-v1/tests/conformance.test.mjs -> 11 pass, 0 fail
node --test tests/*.test.mjs                -> 112 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at fbb7492)
node scripts/check-bilingual.mjs            -> SYNCHRONIZED
```

作者6/6原样通过，套件6→11。负例都配合法邻例：坏政策拒但默认小调用过；隐藏与枚举秘密均脱敏；错动作同意拒但未命名动作同意过；无adapter类型拒、真实协议仍执行。

## 6. 未规定决策（问题／选择／理由）

1. 命名动作的同意仅该动作，未命名则动作无关。双方已要求action_ref，比较才有意义，错配失败关闭。
2. 计数须非负安全整数，其他保守回1不信任；有限数可负、负估算绕过大于比较，界限不可算术逃脱。
3. 缺会计不拒（作者设计），结果须说明；双批准可运行是硬验收、五测试断言，过度主张的修复是字段。
4. 使用别名prompt/completion/total及input/output都接；真实使用丢unknown会如实但错误拒。未知保持未知规则不适用于“未读取的已知”。
5. CI不能跑时IN_PROGRESS、精确接口、CORRECTION_COMPLETE=false；工作簿绿才完成，外部阻塞不可重写成功。这是当时决策而非推翻第1节已解决。

## 7. 自身错误如实记录

- 漏关键C7，只读形状不读purpose，独立探针问A同意为何可B。字段验证不等于字段目的。
- 首修缺会计拒破五作者测试，作者验收对；改假字段而非流程。这是本会话第二次作者纠正判断，均撤自己的变更非改作者测试。
- 新回归误断言脱敏键缺失，实际键在、值[REDACTED]，推前本地发现。
- 第一轮推后探针才报关键。吸取前轮先本地验证推，但未吸取等待审查：探针进行中就是未解决审查，不该视修正完成。

## 8. 结果

两轮修十机制、配对回归、独立探针逐行协调、六有理由边界，其中缺账本／同意过期撤销为剩实质缺口；当时记录类型化外部阻塞非成功。下块为原历史结论，与第1节后来恢复并存。

```text
CORRECTION_COMPLETE = false
BLOCKER             = GITHUB_ACTIONS_BILLING_OR_SPENDING_LIMIT (Owner action; jobs refused to start)
PENDING_SEAM        = hosted CI for remote/general-ai/GAI-004-api-channel-consent-budget @ 11d5ece
CONTROL_BOOK_UPDATED = mission-book/general-ai-gateway/GAI-004-api-channel-consent-budget.md
```
