# EM-013 开发报告——共享任务核心与 Utopia 工程控制界面集成

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = EM-013 (Engineering Manager programme, task 13 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 608ec89 (Digital-City main, "claim(EM-013): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T18:02:35Z
CONTROL_REVISION_AT_CLAIM= d9201af (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-013-utopia-task-surface-integration
IMPLEMENTATION_HEAD_SHA  = 5920e8076d317e15142b7d16c8531e529ce587f0 (pushed)
BRANCH_CI                = 36753243377 — BLOCKED: the jobs never started
LOCAL_CHECK_SUMMARY      = 107/107 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = **false** — deliberately NOT claimed (see §0)
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 0. 阻塞（相同外部条件连续第四轮）

运行36753243377两作业拒绝启动。

```text
X The job was not started because recent account payments have failed or your spending limit needs to be
  increased. Please check the 'Billing & plans' section in your settings
gateway-web: .github#1 … android: .github#1
```

与BA-009（36750981300重试三次）、EM-012（36751919772）、BA-007（36752540378）一致，2–4秒、零步骤。Alien的GAI-004同样失败，阻塞前EM-011/RF-010成功。实现已推、本地绿、CI不可验证。保留历史状态。

## 1. 交付物

contracts/engineering-control-surface-v1/的control-surface.mjs提供规范作业绑定、submit/status/progress/attention/control/result视图、远端回退提案／批准、注意投影／确认、结果门禁、来源视图、界面契约；另index、6测试、根tests/engineering-control-surface.test.mjs。

验收均仅本地验证。

| 要求 | 测试与证明 |
|---|---|
| Web/Android观察同规范作业无重复执行 | `one canonical job is observed by Web and Android without duplicate execution`，same_job_for_every_surface:true、duplicate_execution:false、per_device_job_copy:false，存储单作业 |
| 前台／交互与执行设备可不同 | `the interaction device may differ from the execution device`，interaction_device_is_execution_device:false，owner/executor分离、控制共享 |
| 远端回退须批准、本地允许／限流工作留本地 | `remote fallback requires explicit approval and local allowed work stays local`，LOCAL_WORK_MUST_STAY_LOCAL、requires_explicit_approval、auto_selected:false，拒绝留本地 |
| 远端进度／注意／结果／产物显交互／共享界面 | 测试2/4/5，delivered_to_interaction_device、control_on_shared_surface、user_navigated_to_execution_host:false |
| 首次注意确认协调所有设备投影 | `attention comes from shared state and one acknowledgement reconciles every projection`，reconciles_all_projections、other_devices_reconciled，重复幂等 |
| 绑定共享任务／动作，取得职责／租约而非造事实 | 测试1CANONICAL_TASK_REQUIRED、task_truth_source:SHARED_TASK_CORE、manager_creates_canonical_truth:false |
| submit/status/progress/stage/attention/control/result/artifact视图 | SURFACE_VIEWS八项断言，测试1–5各练习 |
| LocalEligibility/RemoteFallbackProposal明确批准无自动选择 | 测试3ELIGIBILITY词汇、auto_selected:false、local_first_respected:true |
| 注意共享规范，不设第二全局工程数据库 | 测试4SECOND_ATTENTION_STORE_REFUSED、engineering_global_store:false、projection_of_shared_state:true |
| 远端控制／结果留当前共享界面 | 测试2/4不导航执行主机 |
| 高级来源不泄密 | `advanced provenance exposes identifiers without leaking secrets, and the surface is strict`，SECRET_MATERIAL_REFUSED、contains_secret_material:false，句柄允许 |
| 可见成功仅终态已接受EngineeringResult | `user-visible success comes only from a terminal accepted result`，非终态NOT_TERMINAL_ACCEPTED、progress_is_not_success、dispatch_is_not_success，成功须接受引用 |

## 2. 决策日志（问题 → 选项 → 选择 → 原因）

**D1——任务。** 新扫描无本机修复、Mech无合资格Correction；Alien持BA-004…008、EM-004…011、GAI-003…008、RF-004…010，GAI-004/RF-006进行中。前BA-007排Butler，选工程收束EM-013，消费刚交EM-010/011/012。BA-009/EM-012/BA-007仍CI阻塞，按不闲置规则，不声称CI可用。

**D2——任务事实。** submit必须canonical_task_ref，否则CANONICAL_TASK_REQUIRED。投影task_truth_source:SHARED_TASK_CORE、manager_creates_canonical_truth:false，execution_responsibility:OBTAINED_FROM_SHARED_TASK_CORE，可选lease_ref。工作簿要求绑定不竞争事实，明确否定可审查；submit时需引用使无未绑定作业路径。

**D3——两界面一个作业。** 每job_ref一记录，status单投影双方渲染，声明same_job_for_every_surface:true、duplicate_execution:false、per_device_job_copy:false。逐设备副本是失败模式，接口明确未发生。

**D4——交互与执行。** interaction_device_ref、executor_connector_ref、executor_device_ref分字段，共享界面控制，各控制／回退结果user_navigated_to_execution_host:false。两验收要求不同设备且不导航，分离数据可见。

**D5——远端回退。** proposeRemoteFallback须LOCAL_THROTTLED/LOCAL_BLOCKED/REMOTE_REQUIRED，LOCAL_ALLOWED则LOCAL_WORK_MUST_STAY_LOCAL。提案requires_explicit_approval:true、approved:false、auto_selected:false，独立批准，拒绝保本地。不自动选更快机器；本地允许连提案都拒比提案后忽略强，阻UI无意义提示。

**D6——注意事项。** registerAttentionStore始终拒；projectAttention仅SHARED_CORE_ATTENTION，projection_of_shared_state:true、engineering_global_store:false。确认一次reconciles_all_projections、second_acknowledgement_needed:false，重复幂等，防第二库。

**D7——成功。** applyResult仅终态否则NOT_TERMINAL_ACCEPTED，SUCCEEDED须接受result_ref，user_visible_success来源TERMINAL_ACCEPTED_ENGINEERING_RESULT，进度／派发明确非成功。套件发现初版验证引用前改状态／冻产物，拒绝留下部分状态；现先验证，产物重建不原变。

**D8——来源秘密。** 只接七规范字段，秘密形状键SECRET_MATERIAL_REFUSED/stored:false，*_ref允许，contains_secret_material:false。测试token拒绝、引用接受，扫描不能靠全拒过关。

**D9——另两缺陷。** projectJob冻结内部attention_refs，投影改源，改克隆再冻；接受产物没入job列表导致显示空，修且不变重建。

**D10——无schema.json。** 同其他组件。

## 3. 精确文件

| 文件 | 变更 |
|---|---|
| contracts/engineering-control-surface-v1/control-surface.mjs | 新绑定、视图、回退、注意、结果门禁、来源 |
| contracts/engineering-control-surface-v1/index.mjs | 新公开接口 |
| contracts/engineering-control-surface-v1/tests/conformance.test.mjs | 新6测试 |
| tests/engineering-control-surface.test.mjs | 新根入口101→107 |

无City/Core、清单、文档变更，合并增量。

## 4. 测试汇总与修复

6项首次四失败，三真实缺陷、一期望。

1. projectJob冻内部attention_refs，后注意投影TypeError:not extensible，改克隆。
2. 产物仅result.artifacts未入作业列表，投影空，修。
3. 拒applyResult留状态改变与冻数组，先验证后改，D7。
4. 秘密形状未知来源键误期望INVALID_REQUEST，现更精确SECRET_MATERIAL_REFUSED；测试秘密键与无害未知字段两方向。

## 5. 本地检查与CI

| 检查 | 原报告结果 |
|---|---|
| node --test tests/*.test.mjs | 107项全过0失败（101＋6） |
| node --test apps/rooms/tests/*.test.mjs | 69过0失败 |
| node city/test-all.mjs | 1801过0失败 |
| node scripts/verify-promotion-history.mjs | OK，82ed36933fb4验证10记录 |
| node scripts/check-bilingual.mjs | docs/evidence/data-records PAIR_STATUS=SYNCHRONIZED |
| 5920e8076d317e15142b7d16c8531e529ce587f0 的CI 36753243377 | BLOCKED，计费未启动 |

## 6. 集成接口

- City共享任务核心：canonical_task_ref/canonical_action_ref为连接键，manager在那里取得职责／租约，界面不得持任务事实。
- EM-010/011/012：executor_connector_ref为连接器实例，SDK注册表提供，Foreman节点／作业映job_ref。
- EM-005/BA-008：共享注意一次确认，近用设备通知／铃声投影归EM-005，不能第二库。
- GAI-007：相同交互执行分离，合并共享提案／批准形状。
- Web/Android：SURFACE_VIEWS/surfaceContract客户端契约，能断言派发／进度非成功，不仅信文案。
- Owner运维：恢复Actions计费前BA-007/009、EM-012/013不能验证development_complete。
- Owner问题不变：演进动态是否记组件阶段。

## 7. Correction待项

1. 对抗：同作业applyResult两次，现覆盖，终态应不变的疑缺口；REMOTE_REQUIRED无提案回退（现执行仍本地，是否拒绝）；终态投注意；SUCCEEDED控制RETRY现终态守卫允许；许可键下嵌套秘密error_ref:{token:'x'}捕获，error_ref:'plain'允许。
2. 确认D5本地允许连提案拒，D7仅终态接受成功。
3. CI能跑前不能领取Correction，development_complete=false。

```text
DEVELOPMENT_COMPLETE = false (CI blocked by the account-billing condition; not a code failure)
CORRECTION_ELIGIBLE  = false until CI is green
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```
