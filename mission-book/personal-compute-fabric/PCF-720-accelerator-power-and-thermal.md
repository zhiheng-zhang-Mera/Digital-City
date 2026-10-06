---
workbook_id: PCF-720
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
dependency_source_workbooks: ["PCF-701","PCF-713"]
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
planned_capability_ids: ["CAP-PCF-720"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-720 — 加速器、功耗与热状态适配（可选）

[English](./en/PCF-720-accelerator-power-and-thermal.md) · [共用步骤](./EXECUTION_CONTRACT.md)

激活门：至少一种真实可访问的GPU/NPU/power/thermal数据源、必要权限与安全测试范围。按adapter拆child，不要求一次支持全部厂商。

候选 `services/personal-compute-fabric/resource-adapters/`、`tests/pcf720-resource-adapters.test.mjs`。扩展701统一observations；不在descriptor字段里伪造调度authority。

- [ ] 按设备标识记录driver/runtime、VRAM total/available/reserved、utilization与measurement source；NPU能力与GPU不可直接互换。
- [ ] 功耗/电量/温度/thermal headroom保持单位与时间窗口；传感器未支持为UNSUPPORTED，读失败为UNKNOWN，CPU利用率不是joules。
- [ ] 将可观测资源作为713的约束输入，安全阈值按设备/平台支持和显式policy配置；不追求过热、超频或硬件极限试验。
- [ ] 驱动更新、设备热插拔、计数器reset、sleep/wake后刷新兼容状态；旧telemetry不得授权新硬件执行。

验收scoped tests加真实adapter采样：缺权限、无传感器、无GPU、NaN、单位不一致、overflow、过期、firmware/driver变更。对测量overhead和误拒绝留证；能源proxy与实测分表。此扩展缺席时CORE_V1仍完整可用。
