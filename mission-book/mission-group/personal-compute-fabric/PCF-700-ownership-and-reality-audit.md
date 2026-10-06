---
workbook_id: PCF-700
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 2
parent_workbook_id: null
execution_enabled: true
status: IN_PROGRESS
activation_state: ACTIVATED_OWNER_2026_10_07
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_workbooks: ["WBC-601","WBC-602","WBC-603","WBC-604"]
dependency_source_shas: ["f66db60998343bf99243621cfcfa2363a4566db8","d99101fdac5169aad74ae84fb7c0c25be43ad7d9","f3510862cc348a99004ca5bd5d151a7b56279724","213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef"]
development_baseline_sha: "312b627b54af5bbf274fa25eca8f8383869c1c34"
anchor_state: RESOLVED_AT_CLAIM
development_host: "Mech"
development_branch: "pcf/PCF-700-mech-ownership-and-reality-audit"
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
owner_gate: SATISFIED_OWNER_ACTIVATION_2026_10_07
merge_authority: false
report_path: "mission-book/reports/PCF-700"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-07): PCF-700 is the first task of the owner-opened PCF series. baseline_anchor_mode is DEPENDENCY_SHA_UNION_AT_CLAIM and the declared sources are the four accepted WBC heads WBC-601 f66db6099834, WBC-602 d99101fdac51, WBC-603 f3510862cc34, WBC-604 213f9f9f7087. MEASURED: every one of the four is ALREADY an ancestor of origin/main 312b627b54af, because the WBC series was merged; the claim-time union is therefore main itself and needs no union merge (measured, not assumed: f66db6099834 in_main=True ; d99101fdac51 in_main=True ; f3510862cc34 in_main=True ; 213f9f9f7087 in_main=True). CONTROL-PLANE PREREQUISITE (PCF activation rules section 2.3) completed and regressed BEFORE this claim: sync_dependency_state.py ID_RE now recognises PCF (it did not, so every PCF dependency id was invisible), PROGRESS_MANIFEST.json now carries an explicit PCF file set for this one workbook rather than a broad glob, and running the reconciler touched exactly this workbook - parked PCF tasks were not enabled, not unblocked and not given anchors, no claim or completed record changed, and the English mirror carries no duplicate workbook id. Owner gate: the owner instructed this session that the PCF series be opened and its tasks taken in sequence, so owner_gate moves from OWNER_ACTIVATION_REQUIRED to SATISFIED_OWNER_ACTIVATION_2026_10_07. Boundaries not crossed and recorded instead: no purchase or paid service, no system-service installation, no change to the running City profile, and no merge authority (merge_authority stays false; the series branch accumulates verified work for a later ruling)."
baseline_blocker: null
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

## 2026-10-07 规格强化 / Specification revision 2

追加核对已接受 EM 连接器/Foreman、RF、GAI、WBC 和原端工具接线。分别列出 DECLARED / COMPONENT_TESTED / LIVE_WIRED / TWO_HOST_VERIFIED / ORIGIN_AGENT_CONSUMED。此前对“没有 Codex connector”的讨论不是代码证据，不得据此重做已存在组件。明确 UI 共享开关、真实领取、真实进程和结果消费间的缺口；核对迁移01～07的源文本、保留范围和单写者。

详见 [迁移与单一所有权](MIGRATION_HISTORY.md)。本修订不授予施工、预算、远端执行或合并权限。
