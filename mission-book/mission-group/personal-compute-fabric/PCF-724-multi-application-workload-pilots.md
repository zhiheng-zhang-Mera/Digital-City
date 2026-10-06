---
workbook_id: PCF-724
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
dependency_source_workbooks: ["PCF-703","PCF-713","PCF-714"]
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
