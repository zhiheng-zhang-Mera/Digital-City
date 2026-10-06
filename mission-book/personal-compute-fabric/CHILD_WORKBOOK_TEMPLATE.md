# PCF 子工作书模板（文档，不是可领取任务）

[English](./en/CHILD_WORKBOOK_TEMPLATE.md) · [激活/追加规则](./ACTIVATION_AND_EXTENSION.md)

此模板本身没有 frontmatter，也不进入任务统计。使用时先从 PCF-725～789 选择未使用编号；保留父任务历史。没有明确激活授权时，新子任务仍 PARKED。

## 复制前必填决策

| 字段 | 要求 |
|---|---|
| originating_finding | 真实问题/测量/Owner需求的证据引用，不用“机器空闲”当理由 |
| parent_workbook_id | 父任务ID；明确父保留独立交付还是转 GROUP_ONLY |
| scope_delta | 新增/删除内容与为什么不能在旧范围内完成 |
| release_train | 默认 NEXT_RELEASE；不得暗改在途冻结版本 |
| interfaces / ownership | 消费/输出合同、文件owner、共享接线seam |
| hardware / authorization | 实际设备、资源预算、数据域、费用/权限门 |
| acceptance | 独立可反证的输出与失败场景，component/product边界 |

## 候选 frontmatter（创建真正文件时填入）

```yaml
workbook_id: PCF-<unused-number>
phase: PERSONAL_COMPUTE_FABRIC
release_train: NEXT_RELEASE
spec_revision: 1
parent_workbook_id: PCF-<parent-number>
originating_finding: <bounded-evidence-reference>
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_workbooks: []
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
```

## 正文结构

1. 目标、非目标、与父任务的独立边界。
2. 实际/候选文件路径；输入、输出与版本化接口；依赖的accepted evidence。
3. 子步骤：每个步骤都有可检查结果，复杂步骤按red→green→复检划分。
4. 正例与反例：缺测/过期、并发、权限撤销、失败/取消/重启、畸形输入、资源和日志上限。
5. 用户入口、backend接线、分层收纳、CAP registry与真实证据；唯一INTERNAL_ONLY豁免要有理由。
6. 硬件/外部seam、谁负责验收；NOT_RUN/DEFERRED不等于PASS。
7. 另一实体主机Formal Review、exact SHA/CI与bounded report；继承EXECUTION_CONTRACT。

完成规划后同步英文无frontmatter镜像与PROGRAMME_MANIFEST。只有显式激活时才进入PROGRESS_MANIFEST的准确成员集，并先确认依赖同步器识别新ID。新子任务不继承父的凭据、预算、claim或merge权。
