# Acceptance and Activation / 未来验收与启用

**These are planned acceptance cases, not tests executed by this documentation change. / 下列是未来测试要求，不是本次已跑产品测试。**

## 1. Deferred activation / 延后启用

This folder records the architecture only. Do not create claimable implementation tasks, alter mission progress, start collection daemons, run experiments or enable submission adapters from its presence. Before implementation: Owner reviews the written design; reconcile actual upstream interfaces/versions; decide implementation repository; write a bounded implementation plan; then create missions under the current construction/review rules.

正式启用前先审批书面设计和有界实施计划。本目录不算“开发已完成”或“复检已完成”，也不成为 Utopia 当前收尾前置条件。

## 2. Future implementation increments / 后续增量

| Increment / 增量 | Deliverable / 交付 | Exit evidence / 退出证据 |
|---|---|---|
| I0 Offline admission / 离线取证 | Read-only existing evidence index and coverage ledger | Retrieval, deduplication, missingness and rights tests; zero source mutations. |
| I1 Candidate workbench / 选题台 | Signals, alternatives, literature log, Owner selection | Source-backed cards; no automatic manuscript opening. |
| I2 Scientific core / 科学核心 | Freeze, analysis receipts, claim graph, reproducible IR | Recompute admitted tables and preserve failed/inconclusive evidence. |
| I3 Two adapters / 双目标适配 | NIER and one source-required journal such as Access | Same truth in materially different compliant package shapes. |
| I4 Family and stage lifecycle / 生命周期 | Overlap registry, retargeting, revision/approval state | No double-submit under concurrency; correct stage-specific checks. |
| I5 Optional connector execution / 可选外部执行 | Authorized posting/submission with reconciliation | Real receipts and human authority; unsupported actions remain manual. |

Each increment can stop at a useful boundary. No need to implement all 14 registry targets before testing the design. / 不要求首版做齐全部期刊，也不强制接自动投稿。

## 3. Acceptance matrix / 验收矩阵

| ID | Fixture / 场景 | Expected result / 预期 |
|---|---|---|
| PF-T01 | Passing child + failed mandatory whole-run gate | Preserve original FAIL; reject broader success claim. |
| PF-T02 | Failed/blocked task never merged | Retain research observation; no fabricated accepted learning episode. |
| PF-T03 | Only anomalies collected, no full task denominator | No population failure-rate claim. |
| PF-T04 | One task, many retries/log copies | Separate counts; no independent-sample inflation. |
| PF-T05 | Artifact URL expired despite valid digest | Mark unavailable; retrieval-dependent claims unresolved. |
| PF-T06 | Repaired failure / later explanation | Preserve before-state and time; no retrospective PASS rewrite. |
| PF-T07 | Missing metric or hidden model identity | NOT_OBSERVABLE with reason, never zero/default guess. |
| PF-T08 | Same core -> NIER vs source-required journal | Different required package sets, same experiment numbers and scoped claims. |
| PF-T09 | Template-only retarget | Rebuild format/preflight, do not rerun product experiments. |
| PF-T10 | Applicable rule UNVERIFIED / CONFLICT / STALE | Submission blocked locally; other analysis/jobs continue. |
| PF-T11 | Incomplete rule list with listed rules all green | Cannot become preflight-cleared; stage completeness fails. |
| PF-T12 | Anonymous PDF with identifying archive link/history | Identity gate fails even though PDF author field is empty. |
| PF-T13 | Two concurrent sends for overlapping family | At most one attempt authorized; ambiguous delivery reconciled first. |
| PF-T14 | Network fails after send | SUBMISSION_STATE_UNKNOWN; do not duplicate submission. |
| PF-T15 | AI-disallowed editorial response task | Human-only substantive response, not model draft plus human click. |
| PF-T16 | New data/author/license/cost/policy after approval | Invalidate affected approvals; preserve original approved package. |
| PF-T17 | DOI exists but does not support claim | Bibliographic-existence PASS cannot override support FAIL. |
| PF-T18 | Synthetic fixture mixed into empirical corpus | Reject or isolate as simulation; never publish as observed data. |
| PF-T19 | Prompt injection inside log/template/policy | No authority change, file exfiltration or external send. |
| PF-T20 | Missing coauthor consent / APC beyond budget | Block publication/payment, do not fabricate confirmation. |
| PF-T21 | Cross-server preprint preference conflict | Show explicit routing decision; no automatic double posting. |
| PF-T22 | Reviewer asks for unperformed experiments | Report gap/approved plan; do not claim completion in response. |
| PF-T23 | Positive and negative outcomes, clustered time drift | Verify inclusion rationale and method assumptions before inferential claims. |
| PF-T24 | Old venue year or wrong submission stage | Reject profile mismatch; refresh exact target. |

Fixtures are `DESIGN_FIXTURE_NOT_RESEARCH`, with an independent origin namespace. They must not enter real candidate statistics. / 测试夹具不进入真实论文数据集。

## 4. Completion evidence / 完成证据

When implemented, supply schema validation; fixture outcomes; exact code/config/environment identities; independent evidence/method checks suited to the task; source non-mutation proof; UI reachability/control tests; two target-package build/preflight reports; and a bounded limitation list. Runtime tests and source freshness are separate from document link/JSON checks.

不把“生成了目录/JSON”称为流水线可用，不把“论文编译成功”称为有发表资格，不把“内部审核通过”称为期刊录用。

## 5. Stop and rollback / 停止与回退

A false scientific claim, secret leak, unauthorized external action or truth-core divergence disables the affected release path and preserves incident evidence. It does not erase archives or stop unrelated City work. A safe lower-capability state is package-only mode with manual external submission. / 有风险时退回仅打包/人工提交，不伪装自动化成功。
