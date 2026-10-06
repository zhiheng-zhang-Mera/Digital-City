---
workbook_id: PCF-700
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
dependency_source_workbooks: ["WBC-601","WBC-602","WBC-603","WBC-604"]
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
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-700 — 所有权、调用链与兼容现实审计

[English](en/PCF-700-ownership-and-reality-audit.md) · [共用步骤](EXECUTION_CONTRACT.md)

## 目标与交付

形成可执行的 reuse/extend/missing 表，冻结 PCF 接口所有权和 compatibility tests。不是重新实现 WBC，也不是改写全城分类。

读取现有 `services/dev-gateway/{server,store,targeting,execution-profile,handoff}.mjs`、`execution-backend/`、`services/headless-node-agent/`、`contracts/node-descriptor-v1/` 及相关 task/action/recovery 合同。输出 `docs/{zh-CN,en}/pcf/ownership-map.md`、接口映射和 `tests/pcf700-compatibility.test.mjs`。

## 子步骤与验收

- [ ] 为每个拟复用点记录 declaration → caller → live API → user surface → exact evidence；特别区分 profile 切换、纯 HYBRID helper 与真正 dispatch/claim 的接线，不能因导出函数存在就认为已启用。
- [ ] 写 no-workbench 启动、legacy untargeted、strict-target 离线拒绝/等待、结果回原端、旧 descriptor 缺新字段仍有效的兼容反例。运行 `node --test tests/pcf700-compatibility.test.mjs`。
- [ ] 冻结 ARCHITECTURE 中类型/接口到实际代码的映射、公共文件单写者和拟增加的辅助状态；证明没有新 canonical Task/Action/device/credential DB。
- [ ] 明确每本下游的 component/exposure owner，检查 UI→backend 依赖无环；需要拆 primitive/product-wiring 时先修任务 DAG 和正式 scope，而非给 exposure gate 造例外。
- [ ] 两主机独立核对样本调用链；未证明的 seam 标 UNKNOWN/NOT_WIRED，列入相应下游验收，不能清零。

## 扩容与边界

可以增加实证审计子项，不能借审计大规模移动目录或重开已冻结 WBC。候选 CAP 映射在本书查重后分配；本书自身不凭文档新增已验证产品能力。

完成只表示 audit/compatibility contract accepted；未来 release 必须重新验证真实产品组合。
