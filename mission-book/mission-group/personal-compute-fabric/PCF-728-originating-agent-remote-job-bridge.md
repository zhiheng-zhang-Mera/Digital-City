---
workbook_id: PCF-728
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 2
parent_workbook_id: PCF-714
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_workbooks: ["PCF-703", "PCF-714", "PCF-727"]
dependency_source_shas: []
development_baseline_sha: null
anchor_state: INTENTIONALLY_EMPTY_UNTIL_ACTIVATION
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: UNASSESSED
backend_wiring: UNASSESSED
capability_ids: []
planned_capability_ids: ["CAP-PCF-728"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
migration_refs: ["PCF-MIG-20261007-05"]
source_requirement_refs: ["FR-001: Goal 9 + Stage A consume result + Stage B task injection"]
---

# PCF-728 — 发起 Agent 远端子任务与结果回注桥

[English](en/PCF-728-originating-agent-remote-job-bridge.md) · [共用步骤](EXECUTION_CONTRACT.md) · [迁移记录](MIGRATION_HISTORY.md)

来源：迁移05，FR-001 发起端结果回流、consume result 与 task injection 的调用端子集，并按 Owner 的 Alien Codex→Mech→Alien Codex 场景补齐。FR 仍负责工程目标拆分与 Review→Repair。

候选落点：`services/personal-compute-fabric/origin-agent-bridge.mjs`、`tests/pcf728-origin-agent.test.mjs` 及经过700核实的 connector/tool 暴露配置。

- [ ] 定义版本化 caller 工具 `submitRemoteJob(capsule)`、`inspectRemoteJob(ref,cursor)`、`cancelRemoteJob(ref)`、`collectRemoteResult(ref)`；通过既有 Shared Task/Action 和 RF 发起，不创建独立任务库。提交回执分清 accepted/dispatched/running/result-ready/result-delivered/consumed，不能一键全部绿。
- [ ] 明确支持的入口：受管理 Codex 会话，或已配置的外部 Codex 会话中的正式工具适配器。安装工具与权限要明确；禁止声称能够无配置接管任意正在运行的 Codex 进程。MCP/CLI/原生工具具体适配以安装版本支持为准，不把某个厂商私有格式写进 PCF core。
- [ ] 原 Codex 可以显式拆出独立子任务后继续本机工作；在 Mech 启动真实工程连接器或授权 build/test executor，回执返回原 parent session。不会自动把一个不可拆程序的线程/RAM/GPU分到两台机器。
- [ ] 使用703的显式DAG与既有EM-010；记录父子范围、固定输入、write scopes、依赖和汇合验收。PCF 不负责自由语义拆题或治理投票；独立任务才允许并行，同写集必须串行/隔离。
- [ ] 验证结果被原 Agent 实际读取、作为显式输入继续后续步骤；仅在 Utopia UI 可见不等于已回到 Codex。origin/session 离线可有界恢复取回，但不能把结果注入另一未授权会话。
- [ ] 重试/重复提交/迟到结果/取消竞态遵守单一 canonical terminal；输出是数据而非指令。状态不明不能自动重放有副作用任务；结果不能授予 merge、凭据或费用权限。

验收：`node --test tests/pcf728-origin-agent.test.mjs`；真实 Alien-origin→Mech-execution→同一Alien parent-session 消费，另由相反方向验证；一次origin断线后取回、拒绝未授权/错误session、一项cancel/failure。保留工具调用回执、主机进程证据和实际后续消费记录。不要求读取隐藏思考。最低产品闭环与724共用同一task/attempt证据，不重复计作两个实现所有者。

本书与父书各有独立验收对象；parent仅表示来源组织关系，不自动形成反向依赖或继承权限。所有新CAP仅为候选，真实验收与异机Formal Review均未运行。
