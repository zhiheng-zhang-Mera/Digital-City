# Venue Adapter Contract / 期刊与轨道专项适配协议

## 1. Target identity / 目标必须精确

```text
publisher / venue / edition-or-policy-date / article-type
 / special-issue-or-track / submission-stage / adapter-version
```

A journal name alone is insufficient. Initial submission, revision, accepted manuscript, production and artifact evaluation can require different files, identities and permissions. A 2026 conference template does not authorize a 2027 submission. / 不能只存“ICSE”或“Elsevier”；必须区分年份、轨道、稿件类型与阶段。

## 2. Rule hierarchy and provenance / 规则分层与来源

Resolve publisher baseline -> venue -> article type -> current call/track/special issue -> stage -> applicable written editorial clarification. More specific rules refine general rules only within their authority. Portal instructions and CFP conflicts must be surfaced, not silently resolved by selecting the easier option. A private exception must record scope, issuer, date and evidence; do not generalize it to all future papers.

规则对象必须包含 `rule_id`, key, value, applicability condition, stage, normative class, verification status, source_id + locator, observed_at, effective dates if known, and resolution history. Distinguish `VENUE_REQUIREMENT`, `VENUE_GUIDANCE`, `LOCAL_GATE`. Recommended length is not a hard maximum; local quality standards must not be attributed to the editor.

Verification states / 核验状态:
```text
VERIFIED | UNVERIFIED | CONFLICT | STALE | NOT_APPLICABLE_WITH_REASON
```
UNKNOWN is neither false nor optional. A missing mandatory rule key fails schema completeness. A stale/conflicting/unverified applicable requirement blocks only its release/preflight, not research analysis or unrelated papers.

## 3. Adapter dimensions / 专项维度

| Dimension / 维度 | Adaptation / 适配内容 |
|---|---|
| Scientific contribution / 贡献 | Idea, empirical finding, method, software, impact, tool, dataset; explicit fit and disqualifiers. |
| Evidentiary burden / 证据 | What existing claims/methods are supportable; meaningful comparison, utility, reproducibility or evaluation needs without fabricated thresholds. |
| Narrative / 论证 | Outline, audience assumptions, abstract style, section roles and page allocation. |
| Format / 格式 | Template/version, paper size, word/page budgets, exceptions, references, figures, captions, source compiler. |
| Identity / 身份 | Blinded vs named PDF, separate title page, authors/ORCID, self-citation, artifact-link deanonymization risks. |
| Research materials / 材料 | Code release/version/license, data statement, confidential access, supplement/reproduction assets, video/demo. |
| Declarations / 声明 | Contributions, funding, interests, ethics/consent, prior publications, AI use; only confirmed factual statements. |
| Submission / 提交 | Portal fields, required vs optional uploads, file size/type, metadata consistency, initial vs revision vs production. |
| Lifecycle / 生命周期 | Response letters, marked and clean revisions, rejection/resubmit semantics, accepted source/license and proofing. |
| Cost/time / 成本时间 | APC versus optional OA, currency/tax/waiver uncertainty, current deadline/timezone, stage-specific fees. |

## 4. Compiler contract / 编译器契约

Input: approved candidate/RQ, freeze IDs, Paper IR, verified references, rights inventory, actual target profile and stage. Output: `ADAPTATION-PLAN`, target outline, claim inclusion/exclusion matrix, manuscript/source, figures, required declarations, portal field sheet, package manifest, compliance report and unresolved gate list.

The plan states why sections are reordered/omitted. It cannot transform a planned evaluation into results, remove a limitation needed to interpret a number, move required evidence into an inaccessible supplement, or relabel local dogfooding as external adoption. Expand/compress only while preserving semantic scope.

生成标题/摘要/正文/投稿字段来自同一个目标版本；跨期刊标题可以不同，但数字、分母、结论不能冲突。特定期刊需要不同证据而当前没有时，输出差距，不自动美化。

## 5. Policy freshness / 动态规则

Source snapshots are observations, not permanent rules. Recheck the applicable official guide and portal at target selection, before external posting/submission, on major revision and at acceptance/production. Fees, deadlines, indexing/quartiles and turnaround data need dated sources; absence stays unknown. Publisher marketing turnaround is not a personalized acceptance forecast.

官方页面拿不到时可接收经核验的作者上传/编辑确认，但必须保存来源与日期。禁止由旧论文版式、第三方博客或模型记忆补成“已核实”。Rules changed -> impact diff -> invalidate affected checks/approvals only.

## 6. Deadline and payment safety / 截止与付费

Store literal deadline, named timezone/UTC offset, normalized instant, registration vs full-paper cutoff and source. Ambiguous midnight or portal/CFP disagreement is a policy conflict; show the earlier operational warning without claiming the conflict is solved. Do not invent an exact deadline from a year or daypart.

费用记录 base/APC、出版模式、币种、税、超页、注册、豁免/协议适用性和报价日期。缺费率不默认免费；即使排名较高，也不能超过 Owner 硬预算。支付需单独确认。

## 7. Task-specific AI permissions / AI 权限必须按动作细分

Track literature assistance, code generation, analysis, manuscript drafting/copyediting, empirical plots, conceptual diagrams, graphical abstracts, author-editor conversations and public correspondence independently. Record tool/version/date/scope and human checks. Publisher restrictions can deny one task while allowing another. Never bypass a prohibition by having a human click Send on AI-authored prohibited content.

相关源：[S03, S12 in SOURCES](policies/SOURCES.md)。未来 adapter must route prohibited substantive drafting to a human task, not a hidden model worker. Text-generation permission never implies permission to synthesize research observations or figures representing data.

## 8. Rule tests / 规则测试

Each adapter needs positive, negative, unknown and conflict fixtures. Maintain mandatory rule-key inventories by stage. A partial seed profile cannot become READY merely because every rule currently listed passes. Examples in this folder are deliberately disabled design seeds. / 配置未列出的必填要求不能因“已列规则全绿”而消失。
