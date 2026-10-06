# EM-010 开发报告 — 工头队列／DAG／资源调度／工作者池

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = EM-010 (Engineering Manager programme, task 10 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 63950cc (Digital-City main, "claim(EM-010): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T16:56:10Z
CONTROL_REVISION_AT_CLAIM= ef62185 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-010-foreman-scheduler-dag-worker-pool
IMPLEMENTATION_HEAD_SHA  = 5209b94fc846337c19194c72ab38a6c22cc3295c
BRANCH_CI                = 36748073216 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. 交付物

`contracts/engineering-foreman-scheduler-v1/` 包含 foreman.mjs（DAG 验证排序、写范围隔离、资源自适应工作者池、能力选择、有界重试／重分配、重启恢复、指标／证据）、index.mjs、7 测试套件及根入口 tests/engineering-foreman-scheduler.test.mjs。

| 必需验收 | 对应测试 |
|---|---|
| 独立 DAG 节点可并行，依赖／顺序成立 | `a DAG is validated and only dependency-satisfied work is runnable`：两无依赖节点同时准入并 RUNNING；链下一节点仅依赖 SUCCEEDED 后准入；失败依赖为 DEPENDENCY_FAILED。 |
| 同保护文件／范围两写者不能不安全并行 | `two writers cannot hold the same protected scope at once, and conflicts are reported not merged`：WRITE_CONFLICT、auto_merged:false，延后而不失败，不相交范围不受影响。 |
| 资源压力缩减／暂停新工作，不虚假失败已完成工作 | `resource pressure scales workers down and pauses new work without failing completed work`：paused:true、worker_target:0、completed_work_failed_by_pressure:[]，已完成仍 SUCCEEDED。 |
| 单工作者同生命周期／验收路径 | `one-worker serial mode uses the same lifecycle and acceptance path`：SERIAL、逐个准入，相同 ACCEPTANCE_NOT_RUN 拒绝及完成路径。 |
| 重试／重分配不重复终态或外部副作用 | `bounded retry and reassignment never duplicate a terminal result or an external effect`：DUPLICATE_TERMINAL_RESULT、TERMINAL_RESULT_IMMUTABLE、DUPLICATE_SIDE_EFFECT，图重载后仍记已完成效果。 |
| 用 ConnectorPort／能力而非 provider 名分支 | `worker selection is capability and placement based with no provider-name branching`：provider_name_branching:false、capability_based:true，LOCAL_FIRST 偏好而不强制本地，未认证者不合格。 |
| 受控重启可恢复队列 | `a controlled restart keeps completed work and never resumes stale state as success`：保留完成，运行变 INTERRUPTED，resume_is_not_success:true，需明确重验。 |
| 节点有 depends_on、write_scope、验收测试，只运行依赖满足项 | 测试 1、2、4，成功前需验收证据。 |
| 隔离 worktree／文件所有权／冲突界限，报告不自动合并 | 测试 2，调度结果与指标均 write_conflicts_auto_merged:0。 |
| 资源上限、自适应数量与滞后 | 测试 3：scale_up_after_ticks、scales_down_immediately、relief_ticks、target_changed。 |
| 检查点／恢复、停滞／崩溃、有界重试／重分配、集成验证 | 测试 5、7：派发／快照保留 checkpoint_ref、STALL／CRASH、ACCEPTANCE_NOT_RUN。 |
| 可检查队列／任务／工作者指标证据，不覆盖 Shared Task Core | 测试 7：metrics().by_state、workers、blocked_reasons、owns_task_truth:false、overrides_task_core_authority:false、evidence()。 |

## 2. 决策日志（问题 → 选项 → 选择 → 理由）

**D1 — 领取任务。** 新扫描无自己修复、无 Mech 可纠正阶段；Alien 持 BA004／005／006／008、EM004／005／008／009、GAI003…008、RF004…009 纠正。本任务是上一轮报告记下的下一项，为 Engineering 最大剩余基础，是 EM011／012 真实连接器与 EM013 集成的基础。

**D2 — 谁决定顺序？** 调度器不发明顺序，所有依赖 SUCCEEDED 才运行；独立节点可并行，失败／取消依赖将下游以 DEPENDENCY_FAILED 阻断。工作簿要求 DAG 依赖满足才运行且并行不破顺序。套件最初把菱形建错，孙节点依赖根而非中间，可能漏掉过早执行；改成真实链加独立节点，检查更强。

**D3 — 写范围保护。** 相等或包含即重叠，scope:src/ 保护全部下级，只有 exclusive_writes 节点参与；冲突报告占有节点与尝试次数，第二节点留 READY 延后而非失败。符合不能不安全双写和报告而不自动合并要求。延后使冲突可恢复；write_conflicts_auto_merged:0 在结果与指标公布。

**D4 — 资源自适应。** 压力达到阈值暂停新工作、准入数量零；中等压力减半目标；上调需 scale_up_after_ticks 次连续缓解观测。符合压力缩减而不虚假失败已完成及滞后要求。暂停报 0 如实表示不准入，paused:true 带原因；completed_work_failed_by_pressure 空列表经断言非假定。

**D5 — 单工作者。** SERIAL 是同路径 max_workers:1，相同验收、派发／完成函数与状态。测试仅看到准入数量区别，没有验收禁止的独立路径。

**D6 — 选择工作者。** 能力、就绪、认证、位置，经注入 port 或注册池解析；LOCAL_FIRST 为偏好，无 provider 名分支，结果明确 provider_name_branching:false、capability_based:true。符合验收，RF／EM 本地优先是偏好，远程独有能力仍须可达。

**D7 — 验收证据。** 声明验收测试的节点无 acceptance_ref 不可成功，ACCEPTANCE_NOT_RUN 在终态写前落实。集成验证属于范围，如实失败是拒绝成功而非记录未验证成功，串行相同。

**D8 — 重试／重分配界限。** 预算内 STALL／CRASH 返回 READY；重分配选有能力工作者并递增尝试；预算耗尽为 BLOCKED、REASSIGNMENT_EXHAUSTED、requires_attention:true、falsely_failed:false。终态不可变、已完成效果不重复。符合有界和不重复要求。此处发现并修复三缺陷：图加载丢 action_key，dispatch 又以 null 覆盖，重载清空 completedEffects。现在效果记忆跨重载，已完成效果节点派发拒绝。

**D9 — 图重载。** 第二 submitGraph 无 replace:true 即 GRAPH_ALREADY_LOADED；先验证输入，使格式错误报告为错误而非状态冲突。静默丢队列与效果记忆是数据丢失风险，重载需有意操作。先验证保持代码如实：循环图不应仅得到已加载。

**D10 — 重启。** snapshot／resumeFrom 保留终态，原 RUNNING 为 INTERRUPTED 而非 FAILED／SUCCEEDED，revalidateInterrupted 接受前不得派发。符合受控恢复及旧本地状态不可恢复副作用规则，公布 resume_is_not_success:true、completed_work_failed_by_restart:[]。原 dispatch 直接允许中断节点，现有独立拒绝 INTERRUPTED_REQUIRES_REVALIDATION。

**D11 — Shared Task Core 权威。** 调度器携 task_ref，并在图、指标、证据声明 owns_task_truth:false、overrides_task_core_authority:false。工作簿要求集成不覆盖核心，公开否定声明使合并可检查。

**D12 — 无 schema.json。** 与所有其他组件分支一致。

## 3. 精确文件

| 文件 | 变更 |
|---|---|
| contracts/engineering-foreman-scheduler-v1/foreman.mjs | 新增 DAG 验证、调度、写范围、池、重试／重分配、重启、指标。 |
| contracts/engineering-foreman-scheduler-v1/index.mjs | 新增公开界面。 |
| contracts/engineering-foreman-scheduler-v1/tests/conformance.test.mjs | 新增 7 一致性测试。 |
| tests/engineering-foreman-scheduler.test.mjs | 新增根入口，仓库测试 101 → 108。 |

无 City／Core、manifest、文档变更，合并为增量添加。

## 4. 测试总结、失败与修复

7 测试首跑六失败，含五真实模块缺陷和若干预期修正：

1. 图加载丢声明 action_key，运行节点字面 action_key:null 覆盖声明。
2. dispatch 无条件 node.action_key = action_key，调用者未给键即抹声明，重复保护不能启动。
3. 每加载清 completedEffects，重载忘记已应用效果；现在保留。
4. dispatch 未查已完成记忆，新节点同键可重复；现在 DUPLICATE_SIDE_EFFECT。
5. dispatch 让 INTERRUPTED 未重验运行；现在 INTERRUPTED_REQUIRES_REVALIDATION。
6. 设计修复风险：第二 submitGraph 静默清队列，现先验证再 GRAPH_ALREADY_LOADED，也使缺陷 3 可观测。
7. 修正预期：错误菱形中孙节点依赖根，现真实链加独立节点；暂停预期目标 1 改如实 0；曾原地排序冻结数组；测试将选项作为第二参数而非放选项对象；指标预期计入调度器已准入但未派发节点。

## 5. 本地检查与 CI

| 检查 | 结果 |
|---|---|
| node --test tests/*.test.mjs | 108 测试全通过，0 失败，101 基线 + 7 新增。 |
| node --test apps/rooms/tests/*.test.mjs | 69 通过，0 失败。 |
| node city/test-all.mjs | 1801 通过，0 失败。 |
| node scripts/verify-promotion-history.mjs | 82ed36933fb4 验证 10 记录，OK。 |
| node scripts/check-bilingual.mjs | docs／evidence／data-records 为 PAIR_STATUS = SYNCHRONIZED。 |
| 5209b94fc846337c19194c72ab38a6c22cc3295c 的 GitHub CI 36748073216 | success。 |

## 5b. 修复路径说明

数次模块编辑用 PowerShell 字符串替换，其中两次对模板字面内 `${...}` 插值，损坏错误消息为 `graph  is already loaded`、`he external effect for  already completed`。node --check 立即发现，随后用字面编辑修复。提交文件由通过套件与语法检查验证。后续任务经验：含模板字面的 JavaScript 用字面文件编辑，绝不用 PowerShell 字符串替换。

## 6. 交给同级任务的集成接缝

- EM002／004／006：连接器运行、能力 registry、位置决定资格；能力／就绪／认证／位置经 port，registry 实例健康是输入，调度器不得另做发现。
- EM007：远程子工作者是池内工作者，其返回控制属该任务，依赖顺序与写隔离属本任务。
- EM008／009：连接器需 EM008 凭据 handle，工作者运行时由 EM009 监督；本任务重启应由 EM009 恢复驱动，而非另一概念。
- EM013：task_ref 及两个 false 声明为边界，核心拥有真值，调度器拥有执行顺序。
- BA006／008：独占节点运行前在工作者取得 BA008 租约，BA006 任务版本控制验收步骤。
- GAI004／007：调用 provider 仍经 GAI 准入，设备切换提议与工作者分配不同，不能替代。
- RF008／009：远程节点派发是 COMMAND；工作者不可达是在线状态事实而非节点失败，中断节点重新验证而非盲重试。
- Owner 问题不变：演进信息流是否记录组件阶段事件。

## 7. 交给纠正主机的开放项

1. 对抗尝试：声明 exclusive_writes 却无 write_scope（目前永不冲突，可能漏洞）；scope:src 与 scope:src2（包含归一化应判不相交，值得确认）；仍占运行槽工作者的节点重分配（槽仅在完成／信号递减）；resumeFrom 快照中依赖终态失败（下游应 BLOCKED）；已完成后 STALL。
2. 确认 D3 冲突延后不失败及 D8 耗尽 BLOCKED 请求注意而非 FAILED 是预期。
3. 确认第 1 项缺写范围情形，这是最可能真实漏洞，修复应强制 exclusive_writes 有写范围。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```

原结论保持开发完成、纠正必须 Alien 而非 Mech，以及 Engineering Manager 项目合并前禁止合并。
