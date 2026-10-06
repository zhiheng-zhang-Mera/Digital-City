---
workbook_id: PCF-719
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
dependency_source_workbooks: ["PCF-703","PCF-706","PCF-710","PCF-714"]
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
planned_capability_ids: ["CAP-PCF-719"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-719 — Android edge companion（可选）

[English](./en/PCF-719-android-edge-companion.md) · [共用步骤](./EXECUTION_CONTRACT.md)

额外门：Owner明确同意把某Android设备的新增execution service接入计算池，并批准后台执行/资源预算。**既有Android control principal仍只控制，不可直接加role变worker。**

在700核对的 `apps/android/` 路径新增独立execution adapter/service；复用同一物理device身份体系，使用单独受限service principal/installation scope与凭据handle，不另造physical-device truth。候选跨平台合同测试 `tests/pcf719-android-edge-contract.test.mjs`。

- [ ] opt-in注册、allowlist任务、前台/后台生命周期、OS回收/省电、metered network、电量/热状态、权限撤销与用户停止。
- [ ] 只支持声明过的本地轻量executor；隐私/传感器权限逐项授权，不因计算池加入自动开摄像头/麦克风。
- [ ] 本地预处理→批准的PC计算→原手机结果完整链路；不在线时按支持能力诚实等待/失败，不保证系统会允许24/7后台常驻。
- [ ] 控制surface的profile/任务权利与worker执行资格互不冒充；服务停用不损害原来的Android控制功能。

验收：contract负例 + Android原生unit/instrumentation + 实机后台回收、网络切换、停止/撤销、battery/thermal拒绝及原端回流。模拟器只提供对应范围证据。更新设备/服务角色登记，禁止把一个手机两角色统计成两台物理主机。
