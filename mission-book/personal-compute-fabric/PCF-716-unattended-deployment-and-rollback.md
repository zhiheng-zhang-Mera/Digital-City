---
workbook_id: PCF-716
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
dependency_source_workbooks: ["PCF-710","PCF-712"]
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
planned_capability_ids: ["CAP-PCF-716"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-716 — 无人值守部署、drain与回退

[English](./en/PCF-716-unattended-deployment-and-rollback.md) · [共用步骤](./EXECUTION_CONTRACT.md)

候选 `scripts/pcf-service.ps1`、`services/personal-compute-fabric/deployment.mjs`、`tests/pcf716-deployment.test.mjs`、中英runbook。复用当前Windows启动与配置路径，保留用户双击Utopia.cmd的正常行为。

- [ ] 显式opt-in安装/启停/卸载、最小权限服务身份、端口/配置检查、凭据handle、版本manifest；未授权不申请管理员权限或设置开机自启。
- [ ] 验证关闭浏览器/断开配置笔记本/无交互登录后，已配置的runtime仍按授权工作；服务与控制surface生命周期分离。日志滚动、磁盘限额、健康检查有界。
- [ ] 更新按preflight→drain→checkpoint/结束在途→canary→切换→验证；失败回退旧版本/config。不可逆schema migration需要新gate，不声称任意旧版本可rollback。
- [ ] 手动回STANDARD_DEVICES始终可行；无PCF/工作台配置时旧路径正常。每月负载切换只预留可调用维护动作，不在本计划安排真实自动任务。

`node --test tests/pcf716-deployment.test.mjs`：配置缺失/损坏、权限不足、重复安装、端口占用、未drain升级、canary失败、磁盘满、混合版本、rollback失败。真实Windows记录服务启动、控制端离线、进程重启和安全回退证据；破坏性logoff/reboot测试先获授权。

部署/维护状态通过715宿主在release集成；本任务不采购Linux/服务器，也不承诺controller HA。
