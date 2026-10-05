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
