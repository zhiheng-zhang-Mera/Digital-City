# EM-009 修正报告——运行时所有权与健康／重启／恢复

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = EM-009 (Engineering Manager programme, task 9 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-009-runtime-health-restart-recovery.md
CLAIM_COMMIT         = 11e8f27 (Digital-City main, claim of EM-009 Correction by Alien)
CLAIMED_AT           = 2026-10-01T03:00:01Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 6ae1aea8833a15a11512642113810d8de0e83d75
DEVELOPMENT_CI       = 36736326499-success
CORRECTION_BRANCH    = engineering-manager/EM-009-runtime-health-restart-recovery
CORRECTION_HEAD_SHA  = c26003836996bffe4bf9ff7dedcb45dc0444474f
BRANCH_CI            = 36809354459-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-009 18 pass (7 author + 11 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. 托管 CI

```text
development head   6ae1aea (Mech)   run 36736326499   success
corrected head     c260038 (Alien)  run 36809354459   gateway-web success / android success
```

## 2. 独立审查方法

开发 head 用 `git archive` 导出到 `D:\A-Utopia\.runtime\evidence\mission-book\EM-009\frozen-6ae1aea\`，开始任何审查前，四个分支 blob 均验证对应 Git 对象。

```text
contracts/engineering-runtime-supervisor-v1/supervisor.mjs            MATCH 6053d270b44094d4f2e2a8a897277b5500ae04f6
contracts/engineering-runtime-supervisor-v1/index.mjs                 MATCH c369fefe49f15cb405bf91a6b8eb308c584611aa
contracts/engineering-runtime-supervisor-v1/tests/conformance.test.mjs MATCH b6f8671fc0329458e6af26c7bccbe31d01307ae1
tests/engineering-runtime-supervisor.test.mjs                         MATCH 8a48712600d4cae670fb82e0128197833c26eae1
```

独立对抗审查者仅获冻结导出，先阅读工作簿，并了解关键安全属性：监控器／执行器分离、PID 复用身份、不能关闭的预算／冷却、终态作业不复活。返回 16 探针与 `probes/FINDINGS.md`，复现 10 种机制，`MATERIAL_DEFECTS_FOUND`、高置信度；整个审查中冻结模块 SHA-256 不变。修正主机自己的探针为 `probes-alien/probe-alien-em009.mjs`。

两次审查均证明模块结构部分成立：监控器公开接口确为四种感知操作，无重启／kill／spawn 成员且不引用监督器；手造决策与未签发读数被拒绝；陈旧存活证据为 UNKNOWN；复用或不存在 PID 被拒绝且零端口调用；安全模式终结，终态作业不复活，倒退时钟被拒绝。未成立的是这些保护均消费**未验证的调用者值**；其中伪造读数与重定向决策两项通过数据而非代码击败监控／执行分离。

## 3. 第一轮——8 种机制

类别沿用本项目 Correction 共同分类：1 自有键／原型；2 opt-in 或仅字面量保护；3 调用者控制限制；4 权限未绑定主体；5 拒绝前变更状态；6 未验证时刻；7 已验证未读取；8 硬编码主张；9 递归／克隆失败；10 丢失／重读字段；11 可变键幂等；12 访问器 TOCTOU。

| # | 机制 | 类别 | 修复 | 回归 |
|---|---|---|---|---|
| 1 | **伪造读数生成真实压力。** decidePressure 接受任意带本监控器已签发 reading_id 的对象；复制真实 HEALTHY 读数并改 health:CRITICAL 即产生 PRESSURE/RESTART，实际向健康实例发信号 | 2、8 | 决策从监控器记录的读数产生，调用者对象只能指定其名称 | 是 |
| 2 | **重启策略可关闭。** max_restarts:NaN/Infinity/undefined 永不进入安全模式，backoff_base_ms:NaN 使冷却比较消失；配置即可击败预算终止验收 | 3 | 验证策略：非负整数、factor≥1、base≤cap、已知键，并使用此前未用 INVALID_POLICY | 是 |
| 3 | **压力策略可关闭。** min_confidence:NaN 关闭置信度门禁，stale_after_ms:Infinity 使所有读数新鲜，critical_at:0 使健康样本 CRITICAL，阈值顺序未检查 | 3 | 有序阈值、正 stale_after_ms、置信度[0,1]、已知键 | 是 |
| 4 | **时刻仅形状检查，比较失败开放。** 接受 2026-13-45T99:99:99Z，Date.parse 得 NaN，使陈旧证据被视新鲜并产生压力，60 秒冷却内第二次重启也通过 | 6 | 全面真实时刻验证，NaN 安全比较保持制动，不可解释时刻类型化拒绝 | 是 |
| 5 | **重启后抛错钩子未类型化逸出。** 就绪钩子抛错使实例停 RESTARTING；进程端口抛错前已记录检查点，“所有前提在信号前检查”注释不适用于钩子 | 5、9 | 端口抛错 PROCESS_SIGNAL_FAILED，就绪抛错 READINESS_CHECK_FAILED；信号接受后才记录检查点；最终 SUSPENDED 而非 RESTARTING，计数不增加 | 是 |
| 6 | **缺失探测置信度算有置信度。** 默认0.5恰等于默认下限，无置信度探测也 CRITICAL/PRESSURE | 3、8 | 缺失置信度为0 | 是 |
| 7 | **冻结器递归无访问集合。** 自引用策略／决策以未类型化 RangeError 爆栈 | 9 | WeakSet 遍历；循环策略冻结前即 INVALID_POLICY | 是 |
| 8 | **队列协调静默丢不可读活跃项。** 丢失作业看似从未存在 | 8、10 | malformed_active_entries 报告畸形项 | 是 |

## 4. 第二轮——独立审查不重叠发现

| # | 机制 | 类别 | 修复 | 回归 |
|---|---|---|---|---|
| 9 | **已生成决策可重定向另一实例。** 签发器只担保 decision_id 字符串；worker:2 决策浅复制改 instance_ref:worker:1 即重启后者，改 verdict/evidence 也被接受 | 4、2 | 比较决策自有内容 kind、instance、verdict、action、health、confidence、policy_ref、decided_at 与签发摘要 | 是 |
| 10 | **决策不消费。** 同一压力决策可反复授权，仅受预算／冷却限制，结果不携 attempt key | 11 | 授权重启实际发信号后消费，一决策一次重启；下次须新 sense＋decidePressure | 是 |
| 11 | **真实重启后不可记录端口答复未类型化逸出。** 信号发送后，不可克隆返回值使 freeze(clone(signal_result)) 抛 DataCloneError | 9、5 | 保护快照尝试，不可记录答复 signal_result:null，日志 SIGNAL_RESULT_UNRECORDABLE | 是 |
| 12 | **就绪答复不绑定对象。** ready:true 却指 worker:other 或另检查点仍恢复本实例 | 4、13 | 指定实例／检查点必须匹配，否则保持 SUSPENDED 并报 READINESS_CONFIRMED_FOR_ANOTHER | 是 |
| 13 | **supervise 无保护。** 非数组 decisions 在实例集合处理途中抛原始 TypeError | 9 | instances、decisions、live_processes 必须数组，否则 INVALID_INSTANCE | 是 |

## 5. 本地测试汇总

```text
corrected module                    18 tests / 18 pass / 0 fail
development head 6ae1aea            18 tests /  7 pass / 11 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

作者7项测试未改且全通过。证据根 `D:\A-Utopia\.runtime\evidence\mission-book\EM-009\` 包含字节验证冻结导出 frozen-6ae1aea/、prefix-test.log（修正套件对开发 head）、gate-EM-009.log、自有探针（复现13机制），以及独立审查 FINDINGS 与16探针。

## 6. 边界（有意不作为修复）

| 边界 | 理由 |
|---|---|
| 信号载荷无 process_start_marker（审查D6）；端口仅收 instance_ref、pid、signal、owner_token，validate 与 signal 之间 PID 回收对端口不可分辨 | 作者 conformance.test.mjs:139 deepEqual 断言精确载荷；发送前仍与实时表验证标记。端口契约由其 Owner 扩展，记录决策而不静默改动。 |
| 拒绝重启仍为未建立实例留下 RUNNING 状态（D9），ensure 在拒绝时制造状态 | 作者 :312 断言仅被拒绝 worker:2 的该状态。安全方向无害：状态不授予权限，重启仍需来源、身份、预算、冷却、检查点。未保护输入部分已修#13。 |
| cooldown_ms 已验证，但决策使用崩溃循环 backoffFor | 作者 :174 在 cooldown_ms:0 时期望 retry_after_ms:1000，:243 只推进退避基数即再次成功；参与 cooldown_ms 会拒绝作者路径。记为声明未读字段，现验证防 NaN。 |
| restart 的 owner_token 仍可选 | 作者 :135 成功路径未给令牌，:130 冒充路径给了；强制令牌将使文档成功路径失败。提供令牌时仍检查。 |
| PRESSURE_ISSUER 符号仍可取得，Object.keys(monitor)恰四操作 | 作者 :62 断言可枚举接口。监督器验证来源需要符号；可达不等于权限，签发器现与真实签发内容核对，持有符号不带来权限。 |
| terminal_did_not_resurrect 是恒真式 dropped.length===0 || resumed.every(...) | 构造上不能假，作者 :265/273 断言 true。权威终态集合优先于恢复活跃集合的真实保证已强制并测试；标志是摘要而非独立检查。 |
| 启发式 PID 身份：注册表信任调用者 live_processes 表 | 模块不拥有进程枚举，是注入端口的纯模块；调用者表是设计接口，复用PID仍通过启动标记发现。 |

## 7. 披露

- 此次修正 head 一轮推送并验证绿灯；报告撰写中收到独立发现，以上第二轮也纳入，工作簿仅在两轮同一 head 都绿灯后标完成。
- 自有探针曾因辅助函数错误中途崩溃：clockAt 已是时钟，clockAt(0)返回字符串，使监控器拒绝非函数时钟。已修并重跑；记录而不隐藏，正是本任务未验证值错误类型。
- 提交前移除同回归写两次的冗余 isIsoInstant(...)===false 断言（直接调用之后那项）。
- 两次审查对结构属性无任何方向分歧；实质差别都是其中一方未复现的机制，现均修复。
- 新 Correction 工作树门禁包括根和 city/ 的 pnpm install --frozen-lockfile。未将计费拒绝记代码失败；所有实际启动的托管运行都执行真实步骤。
