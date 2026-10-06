# RF-008 修正报告——类型化RPC／事件／流与可靠命令

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = RF-008 (Remote Fabric programme, task 8 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-008-typed-rpc-event-stream-commands.md
CLAIM_COMMIT         = 803259f (Digital-City main, claim of RF-008 Correction by Alien)
CLAIMED_AT           = 2026-10-01T00:26:05Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 761685b28fabdc0cb2d2dfe9f47e170d4fe82752
DEVELOPMENT_CI       = 36744638449-success
CORRECTION_BRANCH    = remote/RF-008-typed-rpc-event-stream-commands
CORRECTION_HEAD_SHA  = 4d974da6f18ec16b570bbc33709136188a5b05e2
BRANCH_CI            = 36796873900-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = RF-008 20 pass (7 author + 13 Alien regressions), root 121 pass, rooms 69 pass,
                       city 1801 pass, promotion-history OK at 761685b, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. 托管CI

```text
development head   761685b (Mech)   run 36744638449   success 2026-09-30T16:29:57Z
corrected head     4d974da (Alien)  run 36796873900   success
  gateway-web  OK 2m0s  (job 110162219319)
  android      OK 56s   (job 110162219572)
```

两head真实托管步骤含debug APK Android构建，精确修正绿符合完成。

## 2. 独立方法

作者套件不作为独立证据。archive导出四Git blob相同，目标 `D:\A-Utopia\.runtime\evidence\mission-book\RF-008\frozen-761685b\`不可变。独立只此、目标范围排除验收十二RF不变量及反复缺陷，要求可跑OBSERVED/SUSPECTED。十发现、自十二机制合十六，采用plain原型建议，两边界第6节。每修开发失败探针，同20套件开发7过13败、修正20过0败。

## 3. 十六修复

作者7/7均不见。

| # | 机制 | 根因 | 修复 |
|---|---|---|---|
| 1 | toString/constructor/valueOf/hasOwnProperty/isPrototypeOf/__proto__信封过 | key in spec | own+Reflect keys，真plain |
| 2 | 循环task/action/idempotency/payload/caused_by在publish/dispatch/cancel冻结RangeError | nullable非text | 全可空文本，INVALID_ENVELOPE |
| 3 | object action_ref引用相等使合法重试像异动作 | 引用比较 | 文本有意义比较 |
| 4 | 十入口at任意日志，坏sweep静默no-op | when??now | callerInstant类型拒，信封clock真实可解析 |
| 5 | deadline仅比信封自称at，十分钟陈旧仍fresh | envelope时刻 | registry与claimed都判 |
| 6 | max_deadline_ms声明无人读，100年准 | 死政策 | dispatch bound INVALID_ENVELOPE |
| 7 | max_stream_window Infinity与不一致policy | 未验证spread | 正safe整数，default≤max |
| 8 | 未来caller sweep制造早TIMEOUT | caller决定 | registry决定，caller仅验记录 |
| 9 | replayFrom unlike subscribe不验sequence，幻洞毒cursor | 默认直接取 | 同非负整数 |
| 10 | 默认resume0连续也missing[0]，中洞空表 | 数量非成员 | [max(resume,1),highest]未发布集合 |
| 11 | applyResult非终态可回退仍executed:true | 仅状态词汇 | 必终态INVALID_TRANSITION |
| 12 | 成功无ref合成command:result，假真不可分 | null默认合 | 成功真实target ref，FALSE_SUCCESS_REFUSED，不合成，失败保证据 |
| 13 | cache仅key，RUNNING重试取别命令成功／ref | key查 | 仅自身产entry重放 |
| 14 | 同ID重试target/capability/origin可改但静默折入原 | 仅比action | 全identity divergence拒并diverged_fields |
| 15 | 负／NaN bytes腐记，信用反复最大到4.5e16绕窗 | finite或0、无上限加 | 非负整数bytes，补后≤max否则BACKPRESSURE |
| 16 | STREAM_SETUP重放frames2→0、kind/dir/credit重设、CANCELLED复活OPEN；subscribe重置 | 无条件set | duplicate refs DUPLICATE_ENVELOPE，重连replayFrom |

自修另引缺陷推前被回归捕：closeStream构造返回才验reason，坏reason先CLOSED后拒。第三轮先验后变，循环reason保持OPEN回归。

## 4. 本地汇总

```text
corrected module  20 tests / 20 pass /  0 fail
development head  20 tests /  7 pass / 13 fail   ← the 13 Alien regressions are the difference
root              121 pass / 0 fail
rooms              69 pass / 0 fail
city             1801 pass / 0 fail (1808 tests)
promotion-history  10 records verified against local Git history at 761685b
bilingual          docs / evidence / data-records = SYNCHRONIZED
```

根RF-008 .runtime含frozen4/4、probe-a开发全复现、probe-b-postfix18/18、pre-fix-check未修13败、patch-dataplane/-2/-3锚保护、author-after-patch及2、prefix/postfix/gate/ci。

## 5. 自身失败

四断言错：planeAt(600000)helper无参数，未变老；commands从不查clock却期不可能clock抛；新增300000 ceiling却sweep给600000 deadline；开2credit再加3应5非3。只改测试。同此前自断言先破。二轮自引拒前变更见第3节，三轮修、披露。postfix probe漏clock.advance崩是probe非模块。审D4 UNKNOWN终态与applyResult期限要求未采用第6节，plain采用。

## 6. 有意边界

1. UNKNOWN可恢复，非终态。工作簿要unknown等不坍缩，死终点会坍缩；传输尚不知后权威executor结果可解析。TIMEOUT终态超时，二者独立。
2. 真实晚执行结果不丢。期限门禁接受／投递，executor真实ref来了改TIMEOUT丢真实证据；timeout由registry sweep决定。
3. 非终态移动允许，失投可重排；终态防覆，强ack先RUNNING会禁止诚实“不再知投递”。ack at未验证已修#4。
4. STREAM_DATA/CONTROL广告有无frame ingest。作者固定两kind，bare参数路径；另建是开发，修仅声明参数拒未知，版本不再静吞。Owner经checkShape真实spec或不广告。

## 7. 外部接口

无硬件／账户／他项目。旧topic sequence吸duplicate:true不查body divergence，同topic冲突event_id与重放不可分，需工作簿未定divergence规则交Owner。

## 8. 未规定选择

1. dispatch/sweep以registry clock，caller验并记录；此处原决策概述与第3节dispatch同时检查claimed描述均保，当前时刻权限不能调用者重定。
2. 两ID同key保新ID新动作作者145–147，cache绑产命令，闭假成功非违作者，cache按action非仅key。
3. result必终态、成功真实ref，避免未完executed和造证据。
4. 强max_deadline非删，界interactive staleness，声明不读是验证表演。
5. 缺frame路径仅闭静默字段孔、交Owner，Correction修非新feature，作者固定kind。
