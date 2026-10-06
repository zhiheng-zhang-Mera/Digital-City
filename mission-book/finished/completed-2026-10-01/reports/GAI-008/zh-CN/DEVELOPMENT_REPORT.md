# GAI-008 开发报告：健康、韧性与诚实降级

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = GAI-008 (General AI Gateway programme, task 8 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = e3333ea (Digital-City main, "claim(GAI-008): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T16:38:20Z
CONTROL_REVISION_AT_CLAIM= 688c065 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-008-health-resilience-degradation
IMPLEMENTATION_HEAD_SHA  = 43183faa449a2bd8fd4ebd61348ccf4982ca3c0f
BRANCH_CI                = 36745985350 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

上方保留原始任务、阶段、开发主机、领取信息、控制版本、实现仓库、基线、分支、精确提交、CI、本地检查、完成与禁止合并状态，逐字保持历史值。

## 1. 交付物

`contracts/general-ai-health-resilience-v1/` 包含 `resilience.mjs`：五个分离信号、类型化就绪状态、陈旧性、失败分类、有界重试与退避、按范围分隔的熔断器、诚实通道降级、故障隔离、人类动作确认。另有 `index.mjs`、7项测试套件及根目录 `tests/general-ai-health-resilience.test.mjs`。

| 必需验收项 | 对应测试 |
|---|---|
| 暂时技术失败遵循有界重试／熔断策略 | 暂时失败的退避100→200，遵循上限，提供方retry-after可高于上限，尝试次数有硬界限 |
| 认证／人工attention不能假装技术重试成功而自动恢复 | HUMAN_ACTION_REQUIRED、auto_resume:false，须显式确认，后来健康观察不会解决它 |
| 陈旧健康区别于健康 | UNKNOWN＋STALE_OBSERVATION、stale:true，报告分列陈旧范围 |
| 熔断范围分隔，一个provider／account／channel不能全局熔断AI | circuit_is_global:false，其他范围CLOSED，另一健康provider仍可重试，冷却后half-open探针 |
| GAI故障不影响Rooms／City Tasks等独立界面 | 同上加Web诚实降级测试，local_surfaces_use_general_ai:false、poisons_all_ai:false、local_surfaces含ROOMS／CITY_TASKS等 |
| 韧性代码没有自动API升级 | api_escalation:null、api_escalation_automatically_triggered:false、escalateToApi拒绝、admissionsRecorded():0 |
| provider／account／model／WEB／API均有类型健康与就绪状态 | 测试1的SCOPE_KINDS与逐范围观察、就绪状态 |
| availability／health／auth／rate limit／budget分离 | signals_are_separate、auth_is_not_health、budget_is_not_availability；健康但NEEDS_USER为NOT_READY |
| 无幂等／核对时绝不重试破坏性或含糊动作 | 测试4的IDEMPOTENCY_REQUIRED；有key仍AMBIGUOUS_WITH_IDEMPOTENCY、requires_reconciliation:true |
| Web失败可提议另一设备或保持不可用 | 测试6 DEVICE_SWITCH_PROPOSAL、requires_user_confirmation:true；无另一设备proposal:null |

## 2. 决策日志（问题 → 选项 → 选择 → 理由）

**D1：领取哪项任务。** 新扫描没有自己的修复，也没有Mech可领取的Correction。Alien持有BA-004、005、006、008，EM-004、005、008、009，GAI-003…007，RF-004…008的Correction；EM-006正在进行。RF-008之后的平局规则排除Remote Fabric，余选GAI-008或更重Engineering／Butler阶段。有意选择GAI-008：它是范围清楚的契约，补齐GAI失败语义；EM-010队列／DAG／worker池是计划最大剩余底层，应在新上下文而非本轮尾部处理。明确记录这一判断，EM-010仍是下一Engineering领取项。

**D2：健康词汇。** 健康复用EM-004完全相同的HEALTHY／DEGRADED／UNHEALTHY／UNKNOWN，另分READINESS（READY／NOT_READY／UNKNOWN）、AVAILABILITY、AUTH_STATES、RATE_LIMIT_STATES、BUDGET_STATES。跨计划统一健康词避免报告冲突，工作簿又要求五因素分离，所以是五字段而非一个status。Readiness是调用者需要的单一派生答案，健康但未登录也NOT_READY。

**D3：陈旧性效果。** 超TTL后投影UNKNOWN、reason:STALE_OBSERVATION、stale:true，永不HEALTHY；从未观察UNKNOWN、NO_OBSERVATION。旧证据必须保守拒绝才诚实满足陈旧可区分。报告把healthy_scopes与stale_scopes分开，仪表盘不能误计旧provider上线。

**D4：可重试哪些失败。** 四类：TRANSIENT_TECHNICAL可有界重试，HUMAN_BLOCKED与PERMANENT永不重试，AMBIGUOUS仅有幂等key才重试。未知错误码默认AMBIGUOUS而非暂时。工作簿禁止人工／认证自动重试及无幂等破坏性重试，默认含糊使新提供方错误不静默可重试。

**D5：如何清除人工阻断。** 仅acknowledgeHumanAction标resolved，响应说明auto_resume_still_required:true；成功健康观察不解决。提供方可达不是用户已登录，混同会发起从未获授权的认证调用。

**D6：熔断范围。** 以(scope_kind,scope_ref)键控provider、account、model、Web或API；circuit_is_global:false、有冷却，half-open恰允许一个探针。唯一熔断主体须是失败范围，测试另一provider仍重试；half-open使恢复可观察，不要求重启。

**D7：与本地界面隔离。** faultIsolation和degradeChannel公开Rooms、City tasks、arcades、本地capabilities，local_surfaces_use_general_ai:false、poisons_all_ai:false。GAI停机不得使其他Utopia不可用，把依赖方向作为数据使合并可证明，并说明韧性代码无Engineering所有权。

**D8：无自动API升级。** degradeChannel返回null升级、自动触发false，只提供须用户确认的设备切换；escalateToApi始终以API_ESCALATION_IS_NOT_AUTOMATIC拒绝。显式拒绝比仅不实现更可测，也给调用者类型答案，与GAI-004同意门槛一致。

**D9：retry-after语义。** 提供方retry-after优先于计算的指数退避，计算退避受策略上限。提供方知道何时就绪，忽略会把限流变停机。初测试在最后许可尝试断言retry-after，实际应耗尽；现放在仍有预算尝试，单独断言耗尽。

**D10：无schema.json。** 与其他组件分支一致。

## 3. 精确文件

| 文件 | 变更 |
|---|---|
| contracts/general-ai-health-resilience-v1/resilience.mjs | 新增信号、readiness、stale、分类、重试、熔断、降级、隔离 |
| contracts/general-ai-health-resilience-v1/index.mjs | 新公共接口 |
| contracts/general-ai-health-resilience-v1/tests/conformance.test.mjs | 新7项测试 |
| tests/general-ai-health-resilience.test.mjs | 新根入口，仓库101→108 |

没有修改City／Core、manifest或文档，合并保持纯新增。

## 4. 测试、失败与修复

7项测试。首轮一失败是**测试算术错误**而非模块缺陷：max_attempts:3的第3次已应ATTEMPTS_EXHAUSTED、无backoff，却断retry-after。现分别覆盖预算内retry-after及耗尽，两行为不互相掩盖。本任务无需模块修改，应直说而不暗示发生修复。

## 5. 本地检查与CI

| 检查 | 结果 |
|---|---|
| node --test tests/*.test.mjs | 108测试、108通过、0失败（101基线＋7新增） |
| node --test apps/rooms/tests/*.test.mjs | 69通过、0失败 |
| node city/test-all.mjs | 1801通过、0失败 |
| node scripts/verify-promotion-history.mjs | OK，82ed36933fb4上10记录 |
| node scripts/check-bilingual.mjs | docs／evidence／data-records PAIR_STATUS SYNCHRONIZED |
| CI36745985350，43183faa449a2bd8fd4ebd61348ccf4982ca3c0f | success |

## 6. 兄弟任务集成接缝

- GAI-004／005／006／007：暂时重试属于失败通道；HUMAN_BLOCKED正是同意／认证与ATTENTION_REQUIRED向用户呈现内容。Triage把stale视UNKNOWN，不视可用。
- EM-004／005：健康词汇完全同，双方应消费一个投影规则，Engineering attention envelope自然携人工阻断动作。
- EM-009／BA-008：熔断不是lease；熔断拒新重试，lease决定谁能行动。重启不得静默清熔断，half-open是唯一恢复路径。
- RF-006／008：传输attempt_id重试归RF-008，服务退避归本模块，两者不能相乘成无限循环；RF-008开新尝试前询问governor。
- GAI-009：UI渲染resilienceReport的stale、unknown、open circuit、human-blocked，不能把陈旧范围显示上线。
- Owner未变问题：evolution feed是否记录组件阶段。

## 7. Correction主机开放项

1. 对抗人工动作pending时范围再次健康（模块保pending，确认scope-level恢复预期）；只用已超attempt预算动作探熔断；retry_after大于冷却；ttl短于时钟粒度；API自身degradeChannel（现仅WEB有意义）。
2. 确认仅显式确认清人工阻断、retry-after胜计算退避。
3. 确认escalateToApi是否应记录尝试升级审计，使误caller在journal可见；目前拒但不记。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```

原始结论保留开发完成、Correction仅Alien执行，以及GAI项目合并前禁止合并。
