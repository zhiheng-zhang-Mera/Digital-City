# RF-009 修正报告——在线状态／离线／重连与审计

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = RF-009 (Remote Fabric programme, task 9 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-009-presence-offline-reconnect-audit.md
CLAIM_COMMIT         = 1a5d67c (Digital-City main, claim of RF-009 Correction by Alien)
CLAIMED_AT           = 2026-10-01T00:37:29Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = e6b83b4d0b22131391bffc4dda243fcd650b3143
DEVELOPMENT_CI       = 36746849199-success
CORRECTION_BRANCH    = remote/RF-009-presence-offline-reconnect-audit
CORRECTION_HEAD_SHA  = aaca94a39d3d06f6653f9a75bfb0b78bdd973c4c
BRANCH_CI            = 36797962837-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = RF-009 25 pass (7 author + 18 Alien regressions), root 126 pass, rooms 69 pass,
                       city 1801 pass, promotion-history OK at e6b83b4, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. 托管CI

```text
development head   e6b83b4 (Mech)   run 36746849199   success 2026-09-30T16:48:07Z
corrected head     aaca94a (Alien)  run 36797962837   success
  gateway-web  OK 1m56s  (job 110165641700)
  android      OK 1m10s  (job 110165641448)
```

两个head都在GitHub托管runner执行真实工作流步骤，精确修正head绿灯，符合Correction完成条件。

## 2. 独立审查方法

没有把作者套件当独立证据。

1. git archive导出开发head，四blob的git hash-object均等于git rev-parse e6b83b4:<path>，字节精确不可变目标 `D:\A-Utopia\.runtime\evidence\mission-book\RF-009\frozen-e6b83b4\`。
2. 独立对抗审查者仅看冻结导出，先读任务工作簿，以目标、范围、排除、验收、12项RF不变量为标准；每主张须可运行探针并标OBSERVED/SUSPECTED。
3. 审查者10发现，自有14机制，按机制合并为18修复。第二轮修四真正新项：重复效果身份、身份重绑定、实时守卫字面绕过、负测量；两契约问题第6节边界。
4. 每修复有开发head失败探针，同25套件开发7过18败、修正25过0败。

## 3. 缺陷与修复

作者套件在开发head仍7/7，全部18项不可见。

| # | 机制 | 根因 | 修复 |
|---|---|---|---|
| 1 | audit_seq=audit.length+1在shift保留后重算，饱和后新项同3/3/3，既不排序也不识别 | 长度非计数器 | 独立单调计数，逐项retained_entries/dropped_entries显示界限 |
| 2 | 全项contains_secret_material:false却无检查，导出扫描无人调，SECRET_MATERIAL_REFUSED不抛，自日志audit[1].action_ref.token被自身扫描发现 | 硬编码、未接扫描 | append候选扫描拒秘密；ID文本验证，两层封孔，主张有检查 |
| 3 | 九入口调用者at未验证，ISO只形状，不可能时刻NaN | at=when??now绕时钟验证 | callerInstant/isRealInstant用于所有入口、注入时钟、队列期限 |
| 4 | 未来观测将last_seen_at钉未来，任意久ONLINE/stale:false | 无观测上界 | 未来时刻INVALID_REQUEST |
| 5 | 实时钟UNREACHABLE，assertReachable过去at却可达、接LIVE_ONLY | 强制路径只用调用者时刻投影 | 请求时刻和注册表时钟均须可达，拒绝报时钟状态 |
| 6 | reconcile过去at恢复已过期／实时上下文丢失动作 | 期限／上下文按调用者时刻 | 也按注册表时钟，DROPPED_EXPIRED/DROPPED_LIVE_CONTEXT_LOST |
| 7 | 同command_ref enqueue覆记录，UNKNOWN回PENDING后恢复陈旧副作用 | 无条件pending.set | 未知命令重放RECONCILIATION_REQUIRED，仍UNKNOWN至协调 |
| 8 | markOutcomeUnknown将CONFIRMED_SUCCEEDED回UNKNOWN，丢确认事实 | 无状态保护 | CONFIRMED_*、EXPIRED、REFUSED、DUPLICATE_SUPPRESSED不回退，报原态 |
| 9 | 循环installation_id/session_ref/action_ref/interaction_ref/reason触冻结原始RangeError爆栈 | 冻结无访问集、字段无类型 | 可空文本ID，冻结前类型拒绝 |
| 10 | 未验证policy offline_after_ms:Infinity，一年沉默仍ONLINE/reachable | 如实界限本身调用者控制 | 合并政策正安全整数、default≤max |
| 11 | 不可能queue_expires_at存入永不过期，NaN比较false | 形状期限 | 非真实时刻DEADLINE_REQUIRED，不创建动作 |
| 12 | 无主体assertNotDuplicate，null等另null效果误重复 | 未提供当相等主体 | action_ref或command_ref必需，仅比较提供值 |
| 13 | assertReachable NOT_REACHABLE拒保护新工作却无审计，同enqueue有 | 安全路径审计不全 | 抛前PRESENCE/NOT_REACHABLE审计 |
| 14 | 类实例被接受刷新重连态 | isPlainObject接任何非数组对象 | 规范记录原型须Object或null |
| 15 | 确认效果可再执行：命令非pending时按command记，无action参数，协调按action查漏而RESUMED，仍宣duplicate_suppression_armed:true | 三身份谓词 | completedEffectFor共用confirm/reconcile/assertNotDuplicate，确认接并绑定实际动作 |
| 16 | registerNode覆盖身份，协调比刚写值，另一设备恢复原设备队列 | 身份未绑定 | 不同device_id/installation_id重绑定拒，同身份重注册可，错设备仍IDENTITY_MISMATCH |
| 17 | queue_policy LIVE_ONLY或requires_live_session===true守卫可被1/'true'/'yes'绕，离线交互降队列 | 仅精确字面守卫 | 提供标志须布尔，错误声明拒非降级 |
| 18 | latency_ms:-1e9/NaN存质量 | Number.isFinite作强转、无正负界 | 提供时非负数，改状态前查 |

## 4. 本地汇总

```text
corrected module  25 tests / 25 pass /  0 fail
development head  25 tests /  7 pass / 18 fail   ← the 18 Alien regressions are the difference
root              126 pass / 0 fail
rooms              69 pass / 0 fail
city             1801 pass / 0 fail (1808 tests)
promotion-history  10 records verified against local Git history at e6b83b4
bilingual          docs / evidence / data-records = SYNCHRONIZED
```

证据根 `D:\A-Utopia\.runtime\evidence\mission-book\RF-009\`：

- frozen-e6b83b4/字节验证4/4 Git blob；
- probes/probe-a.mjs修前探针，开发复现13机制；
- probe-b-postfix.mjs同场景修后20/20；
- pre-fix-check/修正套件对未修模块18败；
- patch-presence.mjs、patch-presence-2.mjs可重跑两轮；
- author-after-patch.log、author-after-patch2.log、prefix-test.log、postfix-test.log、gate-*.log、ci-*.log。

## 5. 失败尝试与自身判断修正

- 三自有断言错、模块对：未注册节点tracker的presenceOf期望坏时钟先观察，实际正确先UNKNOWN_NODE；cmd:other期望匹配不同主体效果；单注册节点丢审计应6却期望7。全部改测试／探针，不改模块。
- 最初低估无条件registerNode覆盖，不准备修；审查证明另一设备恢复原设备队列，是最严重两项之一，接受机制分析并绑定检查。
- 最初完全漏效果谓词错配#15，自探针如作者均仅pending确认，盲点不可见，提醒自探针继承作者盲区。

## 6. 有意边界（记录、不静默扩大）

1. completedEffects/pending无界，审计有界，完成效果无淘汰，实时记录至下协调仍PENDING。不能晚执行，协调必丢失实时上下文，属内存／卫生非正确性漏洞；界限需工作簿未定新政策字段，交Owner。
2. 缺queue_policy仍QUEUEABLE。审查建议interaction_ref默认实时，但作者conformance.test.mjs:118无策略断言queued:true，改变是Owner契约非Correction。非布尔绕过已修。
3. REVALIDATION_REQUIRED/UNKNOWN_OUTCOME仍不抛，由DROPPED_NOT_REVALIDATED/state:UNKNOWN返回；行为一致，不等同先前秘密守卫未接死代码。
4. UNKNOWN_NODE/INVALID_REQUEST/INVALID_PRESENCE输入拒不审计；保护新工作决策拒现审计#13。全畸形输入审计会使有界日志成为拒绝服务面。
5. session_ref不门禁。requires_live_session没有活会话核验是接口：模块在线／重连记录，真实会话验证归传输／配对，不在此发明。

## 7. 外部剩余接口

无硬件、提供商账户、其他项目依赖。记录一项：协调验证调用者给的刷新信任／能力／身份／在线／权限快照，不能独立证明当前性；证明归已修组件RF-002配对与RF-006路径。没有重写，开发与此前报告heads不变。
