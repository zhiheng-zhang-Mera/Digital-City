---
workbook_id: PCF-724
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
dependency_source_workbooks: ["PCF-703", "PCF-713", "PCF-714", "PCF-727", "PCF-728", "PCF-715"]
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
planned_capability_ids: ["CAP-PCF-724"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-724 — 多应用接入合同与并发试点

[English](en/PCF-724-multi-application-workload-pilots.md) · [共用步骤](EXECUTION_CONTRACT.md)

候选 `services/personal-compute-fabric/application-adapter.mjs`、`tests/pcf724-workload-pilots.test.mjs`、中英adapter guide。使用708/703合同，不复制URA完整App lifecycle分类，也不开发眼镜/医疗/娱乐整套产品。

- [ ] adapter只声明appRef、executor/version、输入/输出、资源/QoS、隐私/同意、side effect/checkpoint、用户surface。多个App共享PCF而不是各写scheduler。
- [ ] 至少接两类有真实输出的安全软件负载：有界交互计算和持续batch/数据处理；优先复用已验证Rooms/Research路径。缺可选media provider时使用经审查CPU数据处理，不强装库、不把mock叫真实应用。
- [ ] 同时运行并测量互相干扰、quota/fairness、cancel、失败隔离与origin回流；一个App退出不删除其它App状态或关闭整个City。
- [ ] 为未来Foreman、glasses、room、health给出薄adapter示例和契约缺口表；sensory/health trace标注录制/合成，不带真实敏感数据，不充当专业有效性证明。

`node --test tests/pcf724-workload-pilots.test.mjs`覆盖App版本不兼容、错误schema、越权数据、重复提交、一个App crash、worker繁忙、结果错投；真实双机并发报告每类输出和资源/延迟，不只展示两个进程都启动。

产品可多个一起运行，研究一次只验证明确问题。增加vertical必须遵循独立产品边界，新增任务默认下一release；不让一个未准备好的眼镜/健康项目拖住核心验收。

## 2026-10-07 规格强化 / Specification revision 2

保留原两类安全软件负载/多应用试点，并增加明确工程里程碑：Alien上的真实Codex经728发起Mech真实Codex子任务；另一独立工作在Alien同时执行，之后Mech结果被原Alien会话读回并继续处理。再验证相反方向及一个build/test负载。交付同一父任务的调用/授权/输入快照/host进程/重叠区间/输出digest/原会话消费证据；至少一项cancel/failure和离线取回。缺真实provider只阻塞对应工程里程碑，不得用WAIT/HASH/double称其完成。串行与双机重复对照报告中位数/离散性及传输成本，没有测得提速就不宣传提速。不得自动merge，DGX/RIV/URA全系列、Linux/GPU/HA均非这条链的前置。

详见 [迁移与单一所有权](MIGRATION_HISTORY.md)。本修订不授予施工、预算、远端执行或合并权限。
