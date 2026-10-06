# Candidate, Freeze and Package Contract / 候选、冻结与投稿包契约

**Design contract only / 仅设计契约。** Machine identifiers are stable across translations; human explanations carry paired `zh-CN` and `en` text where displayed. / 中英文共享同一 ID，不分叉状态。

## Candidate / 候选

Required fields / 必填:
```text
candidate_id; paper_family_id; schema_version
phenomenon_description; research_question; question_selected_at
source_projects; source_refs; evidence_classes
coverage_definition; unit_of_analysis; task_count; attempt_count
missingness; exclusions_with_reasons; outcome_distribution
alternative_explanations; nearest_work_refs; literature_search_receipts
exploratory_or_confirmatory; proposed_method; method_limitations
claim_candidates; unsupported_claims; overlap_assessment
owner_selection_receipt; current_stage; blockers; next_actions
```

Counts may be unknown with explicit reasons; never fill zero to satisfy a type. `owner_selection_receipt` can be absent before selection, but its absence blocks the transition into manuscript work. A screenshot or narrative requires classification, not forced conversion into independent measurements. / 类型检查不应迫使伪造信息。

## Freeze / 冻结

```text
freeze_id; previous_freeze_id; created_at; corpus_cutoff
source_manifest_digest; admitted_evidence_refs; unavailable_refs
full_implementation_commits; storage_commits; environment_config_refs
selection_rule_version; dedup_rule_version; inclusion_exclusion_ledger
normalizer_version; rights_retention_manifest
analysis_plan_id; plan_selected_at; discovery_data_seen
analysis_code_commit; dependency_lock; random_seed_if_applicable
human_decisions; limitations; correction_or_extension_reason
```

Different locks serve different purposes: corpus freeze fixes admitted facts; analysis lock fixes transformations; claim lock fixes permitted interpretations; render lock fixes the outgoing manuscript; policy lock fixes the checked target rules. Do not pretend a single Git branch freezes all five. / 数据、分析、论点、渲染、政策分别锁定。

## Claim / 论点

```text
claim_id; version; statement; claim_type; population_and_scope
supporting_evidence_ids; counterevidence_ids; supporting_analysis_ids
assumptions; uncertainties; limits; status
allowed_reuse_roles; manuscript_locations; reviewer_findings
```

Claim types distinguish observed fact, association, causal inference, proposed design, future plan and literature-supported statement. `SUPPORTED_WITHIN_SCOPE`, `UNRESOLVED`, `REFUTED`, `WITHDRAWN` are not interchangeable. Evidence's direct/corroborative/diagnostic/counter roles are target-relative; they are proposed checks, not already-proven runtime behavior.

## Analysis receipt / 分析回执

Every output records input manifest, method/code/environment, execution identity, exit/result status, generated files/digests, actual warnings and validation. Central numbers and figures cannot be supplied by a writer without an analysis or explicit observational source. / 写作模型不直接产生数字。

## Submission package / 投稿包

```text
package_id; family_id; variant_id; target_identity; stage; revision
freeze_id; analysis_ids; claim_graph_digest; manuscript_ir_digest
venue_profile_id; profile_version; policy_receipt_refs
files_with_roles_sizes_digests; portal_field_values
anonymization_report; source_pdf_consistency_report
required_declarations_and_confirmations; rights_manifest
scientific_review_receipts; policy_findings; unresolved_required_keys
budget_quote_and_authorization; release_approval
submission_attempt_id; external_receipt_refs; actual_delivery_state
```

Metadata consistency is within a target variant. A venue-specific title/abstract rewrite is permitted only within the same scientific boundaries and with synchronized PDF/source/portal fields. Changes that affect an approved external action require invalidation and renewed relevant approval.

## Status projections / 状态投影

City receives bounded candidate/target/stage/blocker/decision/evidence pointers, not the full source corpus. Dashboard, Essay-Book and publication registry reference the same package identity. An exported copy is not a second mutable canonical manuscript. / 展示层不会创造第二份论文状态真相。

## 中文完整说明 / Complete Chinese explanation

仅设计契约。机器ID跨语言稳定，展示说明含 zh-CN/en，不分叉状态。原文各代码块字段名是共同机器契约。

### 候选

必填字段覆盖身份家族schema、现象问题选题时间、来源证据类、覆盖单位任务尝试数、缺失排除结果分布、替代解释最近工作检索回执、探索确认方法限制、候选/不支持主张重叠、Owner选择回执、阶段阻塞下一步。未知计数可带理由，不能为类型填零。选题前回执可缺，但缺失阻止开稿；截图叙述先分类，不能强转独立测量。

### 冻结

字段覆盖冻结/前版时间语料截止、manifest摘要、准入不可用引用、实现和存储提交/环境、选择去重版本纳排账本、normalizer、权限保留、分析方案及选择时间/是否见发现数据、代码依赖随机种子、人工决定限制纠正扩展理由。语料锁事实、分析锁变换、论点锁解释、渲染锁稿件、政策锁规则；一个Git分支不等于五锁。

### 论点

字段含ID版本陈述类型总体范围、支持反证分析、假设不确定限制状态、允许复用角色、稿件位置、评审finding。类型区分观察事实、关联、因果推断、提议设计、未来计划、文献支持。SUPPORTED_WITHIN_SCOPE、UNRESOLVED、REFUTED、WITHDRAWN 不互换。直接/佐证/诊断/反证角色相对目标，属于拟检查，不是已证运行行为。

### 分析回执

每输出记录输入manifest、方法代码环境、执行身份、退出结果、文件摘要、实际警告验证。中心数字图表须分析或明确观察来源，不由写作者直接生成。

### 投稿包

字段覆盖包家族variant目标阶段修订、冻结分析论点图IR摘要、profile版本政策回执、文件角色大小摘要门户字段、匿名及source/PDF一致报告、声明确认权限、科学评审政策finding未解决必需键、预算授权发布批准、尝试ID外部回执真实交付状态。元数据在同一目标版本一致；标题摘要允许专项重写，但科学边界和PDF/source/门户同步。影响已批准外部动作的变化需相关批准失效并重新确认。

### 投影

City 仅接收有界候选目标阶段阻塞决定证据指针，不接原语料。仪表盘Essay-Book投稿登记引用同包身份；导出副本不是第二可变正文权威，展示不创造状态真相。
