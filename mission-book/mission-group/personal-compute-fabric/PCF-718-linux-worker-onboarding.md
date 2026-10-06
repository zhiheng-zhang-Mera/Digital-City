---
workbook_id: PCF-718
phase: PERSONAL_COMPUTE_FABRIC
release_train: OPTIONAL_EXTENSION
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
dependency_source_workbooks: ["PCF-710","PCF-716"]
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
planned_capability_ids: ["CAP-PCF-718"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-718 — Linux worker 接入（可选）

[English](en/PCF-718-linux-worker-onboarding.md) · [共用步骤](EXECUTION_CONTRACT.md)

额外门：Owner提供/批准可用Linux环境和安装权限。虚拟Linux可用于开发，报告必须标虚拟化；同一物理机的VM不构成独立Formal Review或独立故障域。

候选 `platform/linux/pcf-worker/`、`tests/pcf718-linux-contract.test.mjs`、中英Linux runbook。只新增WBC兼容adapter，不修改业务App以适应Linux。

- [ ] headless安装/注册/readiness/shutdown、最小权限service、signals/process-tree/路径大小写/文件权限/时钟差异适配。
- [ ] 暴露真实可执行能力与isolation等级；Windows专有验收任务继续去真实Windows，不能因Linux空闲偷派。
- [ ] STANDARD_DEVICES↔HYBRID可逆；Linux不存在/离线/版本不匹配时不影响旧两Win+Android路径。
- [ ] 在真实Linux runtime执行CPU任务、取消、重启、返回原Win/Android端；虚拟环境性能不得泛化物理workbench。

验收包括scoped Node tests和平台原生integration；kernel/OS/runtime/toolchain、虚拟化、主机身份、数据路径均留证。未知GPU/cgroup权限标UNKNOWN/UNSUPPORTED。缺硬件保持parked/block，不安排假模拟通过、不强制采购新工作台。
