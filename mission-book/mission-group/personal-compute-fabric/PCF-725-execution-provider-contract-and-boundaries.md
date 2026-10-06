---
workbook_id: PCF-725
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 2
parent_workbook_id: PCF-700
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_workbooks: ["PCF-700"]
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
planned_capability_ids: ["CAP-PCF-725"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
migration_refs: ["PCF-MIG-20261007-01", "PCF-MIG-20261007-02"]
source_requirement_refs: ["URA-002: App Contract: execution-provider manifest projection", "URA-003: Must define: execution-only lifecycle/failure boundaries"]
---

# PCF-725 — 执行 Provider 合同与生命周期边界

[English](en/PCF-725-execution-provider-contract-and-boundaries.md) · [共用步骤](EXECUTION_CONTRACT.md) · [迁移记录](MIGRATION_HISTORY.md)

来源：迁移01/02；读取 URA-002/003 的精确原文与 MIGRATION_MANIFEST。只抽取执行 provider 的基础合同，不移入全城 taxonomy。

候选落点：`contracts/personal-compute-fabric-v1/executor-provider.mjs`、`tests/pcf725-provider-boundaries.test.mjs`。先核对 PCF-700 的真实路径/命名与既有 EM ConnectorPort，避免第二个 provider registry。

- [ ] `normalizeExecutionProvider(manifest)` 定义 providerRef/version、supported workload schema、capabilities、platform、permission handles、argv schema、storage namespace、lifecycle、isolation enforcement 和 compatibility；不复制任务/身份/凭据真相。
- [ ] `describeExecutorBoundary(provider, hostFacts)` 区分可硬执行的限制、协作式限制和 UNKNOWN。拒绝把普通 Node 进程称为安全沙箱；缺少被要求的隔离能力必须拒绝。
- [ ] 冻结启动/停止/禁用/升级/rollback、依赖丢失、版本不匹配和 crash containment 的语义。实现进程控制仍归710，常驻归712，安装归716；本书只给出合同及边界测试。
- [ ] schema 版本和 consumer mapping 覆盖708/710/727/724及 URA 消费端；不让该基础合同反向依赖这些消费者。

验收：未知版本/权限、越界 namespace、恶意参数、伪造 isolation、provider crash 和停用竞态均有反例；禁用一个 provider 不关闭 City 或其它 provider。运行 `node --test tests/pcf725-provider-boundaries.test.mjs` 并由异机复核。只做 component acceptance，不宣传已部署远端执行。

本书与父书各有独立验收对象；parent仅表示来源组织关系，不自动形成反向依赖或继承权限。所有新CAP仅为候选，真实验收与异机Formal Review均未运行。
