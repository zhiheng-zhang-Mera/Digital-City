# RF-010 修正报告——冻结Fabric公共API与政策边界

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = RF-010 (Remote Fabric programme, task 10 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-010-fabric-policy-public-api.md
CLAIM_COMMIT         = d99690a (Digital-City main, claim of RF-010 Correction by Alien)
CLAIMED_AT           = 2026-10-01T00:50:24Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 8739185479e1185145ef5ec6e02a76aaf15c3d6e
DEVELOPMENT_CI       = 36749030367-success
CORRECTION_BRANCH    = remote/RF-010-fabric-policy-public-api
CORRECTION_HEAD_SHA  = 4d7b9310b2c2e249f3330196d7324d23bdfb3761
BRANCH_CI            = 36799110745-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = RF-010 22 pass (6 author + 16 Alien regressions), root 123 pass, rooms 69 pass,
                       city 1801 pass, promotion-history OK at 8739185, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. 托管CI

```text
development head   8739185 (Mech)   run 36749030367   success 2026-09-30T17:06:28Z
corrected head     4d7b931 (Alien)  run 36799110745   success
  gateway-web  OK 1m51s  (job 110169228266)
  android      OK 1m0s   (job 110169228029)
```

两head真实托管步骤，精确修正绿满足完成。**Remote Fabric组件池耗尽：** RF-001..010皆作者开发完成、异物理主机Correction、修正head推、必需CI绿。

```text
REMOTE_COMPONENT_POOL_DRAINED
```

按runbook仅状态事实，此处不建合并／集成工作簿，Mech集成由Owner触发，未唤醒Mech。

## 2. 独立方法

1. archive导出四blob Git验证，精确不可变 `D:\A-Utopia\.runtime\evidence\mission-book\RF-010\frozen-8739185\`。
2. 独立仅冻结、先工作簿、可运行OBSERVED/SUSPECTED，作者6过但返回15发现。
3. 自12机制按机制合16修；独立新五为弱stream、循环配置冻崩、造信任、原端口错误、单边版本，二三轮修；边界第6节。
4. 各开发失败探针，同22套件开发6过16败、修正22过0败。

## 3. 缺陷修复

作者6/6不捕任何项。

| # | 机制 | 根因 | 修复 |
|---|---|---|---|
| 1 | 本地前台／确认opt-in，camera/GARBAGE/省class跳整个块，广告要求确认仍跑、另一动作取独占 | 非null且config.includes同时门禁独占／广告确认 | class规范，静默用广告权威类，矛盾拒，确认移类门禁外 |
| 2 | 别设备session也valid、disconnect不比device删 | get无主体 | requireSessionFor供invoke/openStream/disconnect，跨设备类型拒 |
| 3 | 碰session_ref覆活会话后断错；false认证加密仍报true | ref未验、旗标硬true | 文本且不碰INVALID_ADAPTER，报告未认证／未加密TRANSPORT_FAILED无会话 |
| 4 | policy:null虚四轴true、policy_granted且未求值却列axes | 空policy全true | enforcement INVALID_POLICY，缺政策非权限 |
| 5 | 从未见设备presence_cleared true、前台不释放 | 硬true、owners不变 | 断后transport presence测与presence_state_after、foreground_released |
| 6 | 传输前占foreground，调用失败锁死下一冲突 | 顶部写claim | 传输返回后才占 |
| 7 | window -1/NaN，from_sequence -5/NaN存并转 | 无界／类型 | window正整数，sequence非负整数 |
| 8 | 十二at不验、ISO形状，垃圾／数字／不可能入结果日志 | when??now与regex | callerInstant，全clock／检查真实时刻 |
| 9 | config null foreground includes崩，api_version忽略，class adapter接 | 合并不查，plain误泛 | 版本相符、两列表规范类、真正plain |
| 10 | openStream更弱，无广告，class null无确认前台，action无主体 | 第二薄流水线 | 同invoke全门禁，action/class达policy |
| 11 | 独占action_ref:null跳claim、无界并发 | 无动作当无约束 | 必须拥有动作主体 |
| 12 | 只验discover/connect，其他no-op却OPEN/reconnectable/disconnected，原Error逸，pair无答造TRUSTED | 两方法、无wrapper、默认TRUSTED | 构造所有TRANSPORT_ADAPTER方法，错误TRANSPORT_FAILED，pair必须信任协议实际状态 |
| 13 | 循环policy.config policyConfig爆RangeError | Object.values无访问集 | 追踪访问对象，循环冻结不无限递归 |
| 14 | 版本广告省则请求99过，但list显示1 | 仅非undefined才比 | 广告??1正规，总比较 |
| 15 | denial_reason MISSING_OWNER_USER不属导出词汇 | 内联合 | 按轴从DENIAL_REASONS选 |
| 16 | 日历不可能2026-02-30／99-99通过并所有证据撒谎 | regex | 各组件Date往返 |

## 4. 本地汇总

```text
corrected module  22 tests / 22 pass /  0 fail
development head  22 tests /  6 pass / 16 fail   ← the 16 Alien regressions are the difference
root              123 pass / 0 fail
rooms              69 pass / 0 fail
city             1801 pass / 0 fail (1808 tests)
promotion-history  10 records verified against local Git history at 8739185
bilingual          docs / evidence / data-records = SYNCHRONIZED
```

证据根 `D:\A-Utopia\.runtime\evidence\mission-book\RF-010\`：frozen4/4；probe-a开发12机制；probe-b-postfix自加独立24/24；pre-fix-check未修16败；patch-fabric-api及-2/-3可重跑；author-after-patch*、prefix/postfix/gate/ci日志。

## 5. 自身失败与判断

- 两轮锚歧／顺序错写前停：getPresence两路径，foregroundReleased在disconnect前非后。次数guard捕，无部分编辑，fail-fast有效。
- 自四断言错模块对：mock漏两方法新验证全拒；比较两独立policyConfig clone；stream独占动作不同已有holder；cycle比错层。只修测试／探针。
- 审F1与已修同机制但更尖锐，已验类／广告派生却确认仍类gate内，捕剩绕过，二轮移外。

## 6. 有意边界

1. PUBLIC_PORTS仅调用者集非全表面；还apiVersion/publicPorts/transportAdapter/adapterBoundaries/policyConfig/intersectPolicy/releaseForeground/boundary/storeTaskGraph/storeAssistantState/integrationSeams/sessions/journal。作者固定11精确，Correction扩破契约；Owner全枚举或extras不可枚举。
2. releaseForeground无holder仍释放，作者nonholder released:true，强holder属Owner契约。invoke独占仍需主体#11。
3. connect/subscribe/revoke政策工作簿未定，交集名能力执行，尤其撤销不可被被审政策阻；记问题不修。
4. foreground设备键非资源键，CAMERA也挡MICROPHONE；一前台自然设备级，工作簿未定粒度。
5. DENIAL_REASONS仍错拼NO_OWNDER_USER_GRANT，SESSION_IS_NOT_PERMISSION/PRESENCE_IS_NOT_PERMISSION/FOREGROUND_NOT_OWNED/RESOURCE_BUSY不发。现发必集成员#15；导出拼写跨版本敏感交Owner。

## 7. 外部接口

无硬件／账户／其他项目。设备本地requires_user_confirmation/resource_class从注适配器报告，政策当前性仅如广告；证明归RF-007及真实端口，本项目已修组件。开发与此前heads不重写。
