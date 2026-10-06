# GAI-008 纠正报告：分 scope 健康、有界重试与诚实降级

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = GAI-008 (General AI Gateway programme, task 8 of 9)
PROGRAMME            = GENERAL_AI_GATEWAY_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/general-ai-gateway/GAI-008-health-resilience-degradation.md
CLAIM_COMMIT         = 6914a4b (Digital-City main, claim of GAI-008 Correction by Alien)
CLAIMED_AT           = 2026-10-01T01:35:16Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 43183faa449a2bd8fd4ebd61348ccf4982ca3c0f
DEVELOPMENT_CI       = 36745985350-success
CORRECTION_BRANCH    = general-ai/GAI-008-health-resilience-degradation
CORRECTION_HEAD_SHA  = e34e310f0077ab4e1af5c30baa0b12be482c638b
BRANCH_CI            = 36802506885-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = GAI-008 16 pass (7 author + 9 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

原始元数据保留任务、计划、阶段、主机、控制工作簿、领取、基线、开发／纠正提交与 CI、16 项通过、禁止组件合并和精确 head 托管绿色的完成声明。

## 1. 托管 CI

```text
development head   43183fa (Mech)   run 36745985350   success 2026-09-30T16:41:00Z
corrected head     e34e310 (Alien)  run 36802506885   success
```

纠正 head 在 GitHub 托管 runner 执行真实工作流步骤，16 项中 9 项在开发 head 失败，绿色 CI 与套件共同构成完成证据。

## 2. 独立审查方法

1. 用 git archive 导出开发 head，全部四个任务 blob 核对 Git 对象，位置 `D:\A-Utopia\.runtime\evidence\mission-book\GAI-008\frozen-43183fa\`。
2. 独立审查只看冻结导出，先读工作簿，每项声明要求可运行复现（19 探针，`probe-A`…`probe-T`）。作者 7 测试／141 断言全过，审查报告 15 项。
3. 自己独立发现 7 机制，按机制合并为三轮修复 14 缺陷；新机制——冷却锚调用者时间、擦除人类确认、opt-in 布尔防护、降级可用性 readiness、query／report 不一致——在第二、三轮修复。
4. 每修复有开发失败回归：43183fa 7 过／9 败，e34e310 16 过／0 败。

## 3. 发现并修复的缺陷

| # | 机制 | 根因 | 修复 |
|---|---|---|---|
| 1 | **所有策略界限未验**：max_attempts NaN／Infinity 去除重试限；max_health_ttl_ms NaN 允许 ttl_ms 1e15（31700 年）；circuit_cooldown_ms NaN raw RangeError；backoff_factor 0.5 使退避缩小 | 无检查展开合并 | 每数界正安全整数，backoff_factor>=1，health_ttl_ms<=max_health_ttl_ms |
| 2 | **调用者时间未验、检查仅形状**：garbage 存 evaluated_at，不可能日期使 age NaN、永不大于 staleAfter，永久报 HEALTHY | 八入口 when??now／仅正则 | clock、observed_at、healthAt 与七决策时间 callerInstant／isRealInstant；不可测 age 必须 stale |
| 3 | **冷却从调用者时间算**：倒填失败使 open_until 已过，未来时间把30秒延一年，half-open也由调用者决定 | at+cooldown，circuitFor比调用者at | 冷却在 registry clock 开始与到期 |
| 4 | **recordOutcome 变更后 raw RangeError**，留下 OPEN／open_until:null，永不 half-open／恢复 | 时间运算前变更 | 先验时间，验证冷却运算不会失败 |
| 5 | **重放人工阻断擦除持久确认**：resolved:false 覆盖 acknowledgeHumanAction 记录，已确认又回 human_blocked_actions | 忽略旧条目 | 确认持久，重阻断保 resolved，记录 reblocked_at／requires_new_acknowledgment，决策报 previously_acknowledged |
| 6 | **有副作用暂时失败无幂等 key 仍 retry:true**，只给信息 flag，违背自身破坏性失败规则 | key只在ambiguous路径要 | 无key暂缓重试以核对，IDEMPOTENCY_REQUIRED |
| 7 | **DEGRADED／UNKNOWN 可用性报 READY**，抹去应保持区分 | 仅UNAVAILABLE防护 | DEGRADED→NOT_READY，UNKNOWN→UNKNOWN |
| 8 | **降级可用性 reason HEALTHY** | reason链仅看UNAVAILABLE | AVAILABILITY_DEGRADED |
| 9 | **读改变 half-open**，同一时间 circuitState 查询前后 resilienceReport open_circuits 不同 | transition在circuitFor，读rawstate | circuitState／resilienceReport／faultIsolation共用effectiveCircuitState projection |
| 10 | **非布尔静默削弱安全**：other_device_available:1丢切换提议，side_effecting:1报不需幂等 | 输入===true | 给定两旗标须布尔 |
| 11 | **degradeChannel 接受任意channel**，NONSENSE／42也给诚实降级判断 | 未按scope kinds验 | 必须canonical SCOPE_KINDS |
| 12 | **循环调用者值使共用freezer崩溃**，policy() RangeError Maximum call stack size exceeded | 无访问集递归 | 跟踪访问对象 |
| 13 | **isPlainObject 接受class实例**，通过policy／port | 仅typeof／Array.isArray | object或null原型 |
| 14 | reason／channel无类型规则，循环／非文本到freezer | 无验证 | 两者须文本 |

## 4. 本地测试汇总

```text
corrected module  16 tests / 16 pass /  0 fail
development head  16 tests /  7 pass /  9 fail   ← the Alien regressions are the difference
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

修复 16/16，开发 7 过／9 败，Alien 回归是差异；根／rooms／city／promotion-history／双语全部 exit0。

证据目录 `D:\A-Utopia\.runtime\evidence\mission-book\GAI-008\`：字节核验 frozen-43183fa/；pre-fix-check/ 的未修模块九次失败；三轮锚保护 patch-resilience.mjs、-2.mjs、-3.mjs；probes/ 的19探针；author-after-patch.log、prefix-test.log、postfix-test.log、gate-*.log、ci-*.log。

## 5. Owner 边界与契约问题（记录，不静默改变）

1. **重试次数由调用者计数。** 每决策传 attempt 比 max_attempts；一直 attempt:1永不拒，预留 attempts map 未用。作者测试同 action_ref 的1、2、2三决策都允许，治理端计数属 Owner 契约变更，非 Correction；记为最高价值结转。
2. **observeHealth 所有 signal 默认健康。** 零signal观察报 HEALTHY／READY／fresh并进入 healthy_scopes，作者恰断言此行为，显式证据要求需Owner裁决。
3. **admissionsRecorded() 常量0**，admissions不增加、作者断言0，模块无admission路径可接。
4. **failure_threshold 按scope非action计失败**，half_open_probes 声明不读，记outcome前无限half-open重试；工作簿未定两语义。
5. **degradeChannel 主体常量** state:UNAVAILABLE、honest_degradation:true、false_success:false，不看观察，作者断言常量。API升级验收确实满足：escalateToApi总拒、无路径设置api_escalation。
6. **声明但不抛码** UNKNOWN_SCOPE、RETRY_NOT_PERMITTED、RETRY_BUDGET_EXHAUSTED、CIRCUIT_OPEN、IDEMPOTENCY_REQUIRED、HUMAN_ACTION_REQUIRED、STALE_OBSERVATION、ALREADY_ACKNOWLEDGED 作为reason字符串返回；SIGNAL_KINDS未用。
7. **classifyFailure 透传负 retry_after_ms**，重试路径Math.max夹紧；提供方delay不受backoff_cap_ms上限，工作簿未定提供方延迟能否超过本地限。
