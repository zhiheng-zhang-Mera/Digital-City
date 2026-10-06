---
workbook_id: PCF-710
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 1
parent_workbook_id: null
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_workbooks: ["PCF-704","PCF-706","PCF-708"]
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
planned_capability_ids: ["CAP-PCF-710"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-710 — 真实 headless executor 与隔离

[English](./en/PCF-710-headless-execution-and-isolation.md) · [共用步骤](./EXECUTION_CONTRACT.md)

候选 `services/personal-compute-fabric/{executor,execution-adapter}.mjs`、`tests/pcf710-executor.test.mjs`；接入已接受的headless agent seam。`executeAttempt(envelope,reservation,controls)`必须真的启动/控制/收集受许可的工作，不只接受测试callback。

- [ ] 实现至少一个可版本化、可取消、结果可验证的真实CPU数据处理executor；provider manifest声明支持的平台、资源/隔离级别和副作用，而非任意shell字符串。
- [ ] 默认allowlist executable/参数schema、最小权限、工作目录隔离、凭据handle、环境变量过滤、stdout/stderr上限和期限。普通Node进程/worker thread不宣称安全沙箱。
- [ ] 平台adapter必须声明可强制的process-tree、memory、CPU或filesystem边界；仅有逻辑reservation时不宣传硬限制。任务要求的隔离不可提供则typed拒绝，不能静默降低。
- [ ] 取消/drain/timeout只作用于本attempt及有跟踪关系的子进程；结果须校验exit/outcome/schema再发布，非零退出不能伪成功。

`node --test tests/pcf710-executor.test.mjs`：缺reservation、过期consent、未知executor、非法参数、越界文件、子进程存活、无限日志、取消竞态、超时、错误exit及能力不足。双主机各执行真实样本，证明结果/取消/回执；不要求Linux、不访问Boss旧仓、不自动安装未知依赖。

完成边界是executor/adapter，常驻启动归712/716，资源控制UI归715；需要新权限或插件先按Owner gate。
