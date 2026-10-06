# RF-009 开发报告——在线状态／离线／重连与审计

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = RF-009 (Remote Fabric programme, task 9 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 49bb40c (Digital-City main, "claim(RF-009): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T16:47:30Z
CONTROL_REVISION_AT_CLAIM= d69076d (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-009-presence-offline-reconnect-audit
IMPLEMENTATION_HEAD_SHA  = e6b83b4d0b22131391bffc4dda243fcd650b3143
BRANCH_CI                = 36746849199 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. 交付物

`contracts/remote-presence-reconnect-v1/` 包含 `presence.mjs`（在线状态词汇及陈旧度、离线动作策略、待处理命令协调、重复效果抑制、只追加审计）、`index.mjs`、7项测试套件，以及根入口 `tests/remote-presence-reconnect.test.mjs`。

| 验收要求 | 测试与证明 |
|---|---|
| 断连／重连如实更新在线状态，保留逻辑设备身份 | `presence is honest, distinct and never collapses into ONLINE or FAILED`，每次转换保持device_id；`a silent node becomes UNREACHABLE rather than ONLINE or FAILED` |
| 可排队工作明确过期，离线时实时动作拒绝／过期 | `queueable work expires and live-only actions never run late`：不可达时LIVE_ACTION_NOT_QUEUEABLE、DROPPED_LIVE_CONTEXT_LOST、DROPPED_EXPIRED |
| 重连陈旧重放不重复已完成副作用 | `a stale replay after reconnect cannot duplicate a completed side effect`：DUPLICATE_COMPLETED_EFFECT，协调中DUPLICATE_SUPPRESSED |
| 未知传输结果保持UNKNOWN直至协调，不报成功 | `an unknown transport outcome stays UNKNOWN until it is reconciled`：reported_success:false、reported_failure:false、DROPPED_UNKNOWN |
| 恢复调用前重验当前信任／能力／策略钩子 | `reconnect revalidates identity, trust, capability, presence and authority before resuming`：六种不同丢弃原因，side_effects_resumed_without_revalidation:false |
| 审计具足够因果ID，不存秘密键／私密载荷体 | `the audit log carries causal identifiers and no secrets, and state is isolated`：递归禁止字段扫描空，每条含因果ID |
| 睡眠／降级／不可达不静默坍缩为ONLINE/FAILED | 测试1：SLEEPING不可达、DEGRADED可达、BUSY独立；测试2：UNREACHABLE保留timed_out_from，明确OFFLINE保持离线 |
| 在线状态词汇、last-seen、路径类别、有界质量元数据 | 测试1：PRESENCE_STATES、PATH_CLASSES、last_seen_at、quality.{latency_ms,network_quality,power} |
| 明确离线动作策略：排队／实时、期限、要求实时会话 | 测试3 |
| 有界重试与去重安全恢复 | 测试3有界队列期限，测试6效果确认／抑制 |

## 2. 决策日志（问题 → 选项 → 选择 → 原因）

**D1——领取哪个任务。** 新扫描无本机修复、无Mech合资格Correction；Alien持BA-004/005/006/008、EM-004/005/008/009、GAI-003…008、RF-004…008，GAI-005进行中。前次GAI-008平局规则排除General AI，选RF-009。它是BA-008、GAI-007、RF-006/008都引用的协调权限层，各模块明确将恢复／重连交在线状态层，不实现便无法验证接口。

**D2——多少状态，时间如何作用。** 七状态 ONLINE/OFFLINE/SLEEPING/BUSY/DEGRADED/UNREACHABLE/UNKNOWN；可达节点沉默超过offline_after_ms派生UNREACHABLE，原报告状态保留timed_out_from/reported_state。验收禁止睡眠／降级／不可达静默变ONLINE/FAILED，因此报告事实与派生可达性分别可见。明确OFFLINE不派生为UNREACHABLE：自报离线无需推断。

**D3——实时动作可排队吗。** 不可；LIVE_ONLY或requires_live_session在不可达时LIVE_ACTION_NOT_QUEUEABLE。可达时接受但实时上下文已过，协调DROPPED_LIVE_CONTEXT_LOST。工作簿举相机拍照、鼠标点击、解锁，不得预期实时上下文数小时后静默执行；入队拒绝与协调过期为保证两半。结果公布interactive_action_must_not_run_late:true。

**D4——队列过期。** 可排队动作必须期限，应用默认并强制最大值；DROPPED_EXPIRED报告期限。无限队列无过期语义在范围外，入队要求期限使无路径创建无界队列，最大值避免失去用途仍保留。

**D5——未知结果。** markOutcomeUnknown设置UNKNOWN、reported_success:false、reported_failure:false、reconciliation_required:true；协调DROPPED_UNKNOWN而非恢复。验收要求未知保持未知，危险默认是无证据把失联请求判成功或失败。仅明确confirmEffect可解析。

**D6——重连重验什么。** 五方面：身份device_id不变、TRUSTED信任、能力可用性、在线状态可达性、上层权限引用lease_valid＋lease_ref。失败各自丢待命令：TRUST_NOT_REFRESHED、CAPABILITY_NOT_REFRESHED、IDENTITY_MISMATCH、PRESENCE_NOT_REACHABLE、AUTHORITY_NOT_REVALIDATED。遵循恢复前重验验收，排除仅本地缓存恢复陈旧副作用。协调返回RESUMED但executed:false，只恢复供调用者调度的状态，不自行执行副作用。

**D7——重复抑制。** confirmEffect以节点＋action_ref记效果；后续同动作重放DUPLICATE_COMPLETED_EFFECT，协调排队重放DUPLICATE_SUPPRESSED且无执行。按动作而不只命令键才能捕获新命令ID的重试。编写中发现效果记录原缺action_ref，使动作检查静默无用；套件运行前修正。

**D8——审计。** 只追加有界日志，每项因果标识为node/session/path/command/action引用、前后状态、结果，明确contains_secret_material:false／contains_private_payload:false，提供递归禁止字段扫描。工作簿要求默认不记秘密／原始私密载荷。扫描跳布尔，避免自身断言标志被判秘密，与此前EM-008假阳性一致处理。

**D9——在线状态不是权限。** 投影均声明presence_is_reachability_only:true、presence_is_not_ownership:true、presence_grants_permission:false。在线状态转任务所有权在范围外，RF不变量11要求权限交集，显式否定让合并可检查。

**D10——不提供schema.json。** 与其他组件分支一致。

## 3. 精确文件

| 文件 | 变更 |
|---|---|
| `contracts/remote-presence-reconnect-v1/presence.mjs` | 新增在线状态、离线策略、协调、去重、审计 |
| `contracts/remote-presence-reconnect-v1/index.mjs` | 新增公开接口 |
| `contracts/remote-presence-reconnect-v1/tests/conformance.test.mjs` | 新增7项一致性测试 |
| `tests/remote-presence-reconnect.test.mjs` | 新增根入口，仓库测试101→108 |

未改City/Core、清单、文档，合并保持增量添加。

## 4. 测试汇总、失败与修复

7项。原概述称首次三失败，一真实缺陷（套件前发现）和两修正期望；下列原分类保留。

1. **编写测试时发现缺陷：** confirmEffect存已完成效果无action_ref，assertNotDuplicate动作键永不匹配，保护静默退化为仅命令键。修存action_ref并按它索引。
2. **缺陷／假阳性：** 禁止字段扫描将自身contains_secret_material布尔判秘密。跳布尔，布尔不能是秘密，与EM-008一致。
3. **期望：** 期限测试配置最大10秒却要60秒，正确拒绝，测试策略错；审计过滤断言把逐节点视图与含另一节点的全日志比较。两者均修，模块原行为正确。

## 5. 本地检查与 CI

| 检查 | 原报告结果 |
|---|---|
| node --test tests/*.test.mjs | 108项，108通过，0失败（101基线＋7新） |
| node --test apps/rooms/tests/*.test.mjs | 69通过，0失败 |
| node city/test-all.mjs | 1801通过，0失败 |
| node scripts/verify-promotion-history.mjs | OK，82ed36933fb4验证10记录 |
| node scripts/check-bilingual.mjs | docs/evidence/data-records PAIR_STATUS=SYNCHRONIZED |
| e6b83b4d0b22131391bffc4dda243fcd650b3143 的CI 36746849199 | success |

## 6. 交给同级任务的集成接口

- BA-008具身总线／租约：本reconcile应驱动租约重验，BA-008 REVALIDATION_REQUIRED对应本DROPPED_NOT_REVALIDATED，合并应共享一个协调入口。
- GAI-007设备感知远端执行：端点排序消费本在线状态，不估算可达性；重连丢待命令须显为动作状态，不能静默重试。
- RF-006/008路径／数据面：last_seen_at与path_class来自获选路径；RF-008 attempt_id重试开新尝试前检查过期；订阅重放不是命令重放。
- RF-007能力注册表：可用性在此作刷新输入，节点提供什么仍归注册表权限，本模块只重验引用。
- GAI-008健康／韧性：可达性与健康不同，不可达节点仍可能健康，健康节点也可能不可达，合并不可互推。
- BA-006任务图：在线状态不成为所有权，所有设备离线时助手拥有任务仍归其所有，模块明确声明。
- Owner问题不变：演进动态是否记录组件阶段事件。

## 7. Correction主机待处理项

1. 对抗尝试：可达时入队实时动作、同一时刻协调（原文说检查age>0却同刻会丢，保留并请确认意图）；仍UNKNOWN命令确认效果（现允许，是未知解析方式，请确认）；相同node_ref不同device_id重注册（覆盖登记使身份保留静默丢失，疑真实缺口）；detail_ref存载荷体；极大max_audit_entries。
2. 确认D3实时动作入队拒绝、D6协调只恢复状态绝不执行。
3. 身份覆盖最可能是真缺陷，应先检查：现node_ref的registerNode大概应拒绝或须明确重新配对，不该替换device_id。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```
