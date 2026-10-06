---
workbook_id: PCF-727
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 2
parent_workbook_id: PCF-710
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_workbooks: ["PCF-709", "PCF-710", "PCF-712", "PCF-726"]
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
planned_capability_ids: ["CAP-PCF-727"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
migration_refs: ["PCF-MIG-20261007-04"]
source_requirement_refs: ["FR-001: Stage B: Hns / Codex real connector acceptance"]
---

# PCF-727 — 工程连接器真实执行与验收

[English](en/PCF-727-engineering-connector-live-execution.md) · [共用步骤](EXECUTION_CONTRACT.md) · [迁移记录](MIGRATION_HISTORY.md)

来源：迁移04，把 FR-001 Stage B 转为 PCF 内可独立验收的工作书。优先读取已归档 EM-002/003/006/007/008/009/010/011/012/013 的合同、实际实现和准确验收范围；不得改写其历史完成记录，也不得从零复制 Codex connector。

候选落点：`services/personal-compute-fabric/engineering-executor-adapter.mjs`、`tests/pcf727-engineering-executor.test.mjs`；通过既有 ConnectorPort 和710执行，不再拥有 scheduler。

- [ ] `bindEngineeringExecutor(connector, providerManifest)` 对接 probe/version/auth/readiness、launch或已支持的attach、session binding、submit、progress/checkpoint、control/result/health。把 canonical job/task 与 backend run/session、base SHA/worktree、host/boot/attempt 关联。
- [ ] 复用官方且安装版本实际支持的客户端/CLI/进程接口；激活时记录版本和官方依据。缺安装、登录、许可证或权限时 typed NOT_RUN/ATTENTION/UNSUPPORTED；不伪造真实 provider 验收，不自动安装、登录、购买或切付费API。
- [ ] Codex 与 DeepSeek Harness 分别登记 conformance、真实本机、真实跨机、cancel/restart/result 接线证据。CODEX_REMOTE 里程碑必须有真实 Codex 完整链；DEEPSEEK_REMOTE 未实跑则独立保留缺口。FR 原有“两者都真实验收”要求仍由它在消费时检查两项证据，不能被只跑 Codex 偷换。
- [ ] 代码/输入以709的内容和版本可验证工件 staging 到隔离 worktree；dirty worktree必须显式快照，不能让两机盲写同一工作树。只回传 patch/commit/artifact 与证据，禁止自动覆盖 Alien 工作区或自动 merge。
- [ ] 区分 provider inference、host tool/CPU/GPU 工作及网络/队列等待；共享本地执行不等于加速托管模型推理，也不扩大账号额度。
- [ ] 跟踪进程树、超时、取消、未知副作用和持久回执；不支持 session resume 时不得承诺透明续跑，更不能把重启直接当继续同一次执行。

验收：`node --test tests/pcf727-engineering-executor.test.mjs`；真实 provider submit→progress→terminal/result，至少一次取消和失败/会话丢失；双主机证据必须含运行主机、版本、输入/base SHA、输出digest及canonical refs。组件 doubles 与 real-provider evidence 分列。缺真实 Codex 不阻塞其它CPU组件，但禁止宣布 CODEX_REMOTE/对应用户链 PASS。

本书与父书各有独立验收对象；parent仅表示来源组织关系，不自动形成反向依赖或继承权限。所有新CAP仅为候选，真实验收与异机Formal Review均未运行。
