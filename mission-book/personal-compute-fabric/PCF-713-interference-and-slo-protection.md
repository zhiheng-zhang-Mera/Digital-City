---
workbook_id: PCF-713
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
dependency_source_workbooks: ["PCF-701","PCF-702","PCF-704","PCF-710"]
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
planned_capability_ids: ["CAP-PCF-713"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-713 — 多应用干扰与SLO保护

[English](./en/PCF-713-interference-and-slo-protection.md) · [共用步骤](./EXECUTION_CONTRACT.md)

候选 `services/personal-compute-fabric/{interference,degradation}.mjs`、`tests/pcf713-interference.test.mjs`。消费资源观测/放置/准入/执行，不实现另一个调度权威。

- [ ] 以用户明确的foreground-protection和per-app budget区分交互与后台；保护用户现有游戏/工作，不读取窗口内容推断偏好。
- [ ] 观测排队和端到端SLO，使用配额、拒绝新工作、降并行度、受支持的协作式暂停/质量降级；非preemptible任务不被任意kill。
- [ ] degradation ladder必须是应用显式提供的可逆选项；hysteresis、cooldown与最短驻留防振荡。不为了满足延迟而静默外发数据或换付费API。
- [ ] 区分“用户设置目标”“估计可达”“实测达到”；不足资源时展示SLO_UNSATISFIABLE/降级事实，不宣称硬实时。

`node --test tests/pcf713-interference.test.mjs`覆盖持续batch、burst交互、priority inversion、starvation、错误/过期load、non-preemptible、不可逆quality变化及反复振荡。真实双机同时跑interactive+batch，记录各类延迟/吞吐/干扰、保护开启/关闭对照和开销。

UI：当前保护模式、降级原因与退出开关由715承载；性能目标在pilot后固定，不硬编码通用50ms。GPU/热策略由720补充，不成为核心测试门槛。
