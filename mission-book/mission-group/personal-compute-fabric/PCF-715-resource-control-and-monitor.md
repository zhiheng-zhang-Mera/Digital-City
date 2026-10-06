---
workbook_id: PCF-715
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 2
parent_workbook_id: null
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_workbooks: ["PCF-701","PCF-702","PCF-704","MON-990"]
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
planned_capability_ids: ["CAP-PCF-715"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-715 — 资源控制与Monitor投影

[English](en/PCF-715-resource-control-and-monitor.md) · [共用步骤](EXECUTION_CONTRACT.md)

候选 `services/personal-compute-fabric/presentation.mjs`、`apps/web/pcf-panel.mjs`、`tests/pcf715-surface.test.mjs`；Android文件以700核实路径为准，不猜已有类名。共享gateway/UI修改按单写者seam集成。

- [ ] 正常入口放现有Settings/Advanced的Compute Fabric，以及task/device上下文详情；不新增一排平行主导航。展示能力、freshness、queue、候选/拒绝原因、profile、reservation和后台运行状态。
- [ ] sharing、drain、quota、foreground protection、consent/revoke、profile切换/rollback连接各自真实canonical backend；不复制WBC现有profile API。无后端能力时明确disabled原因，不提供假按钮。
- [ ] L0只显示运行/等待/风险/需要Owner；L2回答what/why/who/next；L4放测量来源、version/epoch和原始证据。unknown、stale、部分数据和active risk必须向总览冒泡。
- [ ] 只读投影断开、Monitor异常或REX缺席不能锁住执行；UI变更不修改scheduler顺序或制造第二个task truth。

`node --test tests/pcf715-surface.test.mjs` + 实际Web浏览器/Android验收：控件→请求→接受/拒绝→进度/结果→刷新；失效权限、旧页面缓存、数据缺字段、序列gap、无后端、键盘/小屏收纳、错误指标。不得推导未实测的导航步数或填延迟0。

本书签收已接线的基础telemetry/placement/admission宿主；后续705/712/713/716等字段/控制只有在对应backend accepted并集成时才开放，归790组合验收，不反向阻塞基础宿主。每项能力登记exposure与证据owner，中英文案同步。

## 2026-10-07 规格强化 / Specification revision 2

修正共享文案语义：在线、允许接任务、executor可用、正在执行、结果已回传、原Agent已消费分别显示，禁止仅sharingEnabled=true就宣传“正在贡献算力”。详情列执行主机/尝试/真实支持负载/忙闲/已测资源，UNKNOWN不是0。确认两个PC都在工作时绑定真实执行区间；不显示合并GPU/RAM或托管模型提速等未经实现的能力。

详见 [迁移与单一所有权](MIGRATION_HISTORY.md)。本修订不授予施工、预算、远端执行或合并权限。
