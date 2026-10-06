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

## 中文完整说明 / Complete Chinese explanation

### 1. 精确目标身份

目标由出版商、期刊/会议、届次或政策日期、文章类型、专题/轨道、投稿阶段、适配器版本共同确定。初投、修订、接受稿、生产和 artifact evaluation 可有不同文件身份权限；2026 模板不授权 2027 投稿。

### 2. 政策层级和来源

依次解析出版商基线 → 目标 → 类型 → 当前征稿/轨道/专题 → 阶段 → 适用书面编辑澄清。更具体规则只在权限内细化。门户与 CFP 冲突必须展示，不能静选容易要求；私有例外记录范围、签发者、日期、证据，不泛化未来论文。

每规则含 rule_id、键值、适用条件、阶段、规范类别、核验状态、source_id/定位、观察时间、已知有效日期、解决历史。分别标 VENUE_REQUIREMENT、VENUE_GUIDANCE、LOCAL_GATE；建议长度不是硬最大值，本地标准不冒充编辑要求。VERIFIED/UNVERIFIED/CONFLICT/STALE/NOT_APPLICABLE_WITH_REASON 分开，未知不等于假或可选。缺必需键使 schema 不完整；适用但未核验/冲突/过期仅阻塞对应发布预检，不阻塞分析或其他论文。

### 3. 适配维度

贡献区分想法、实证、方法、软件、影响、工具、数据集，明确适配与排除条件。证据检查已有主张方法、比较、效用、复现评估，不编造阈值。叙事含大纲、读者假设、摘要、章节角色页数；格式含模板版本、纸张、字页预算例外、参考图注编译器；身份含匿名/署名、独立标题页、作者ORCID、自引与 artifact 去匿名风险。

材料含代码版本许可、数据声明、受限访问、补充复现、视频演示；声明含贡献资助利益伦理同意先前发表AI且仅确认事实；提交含门户字段、必需/可选文件、大小类型、元数据和阶段；生命周期含回复、标注/干净修订、拒绝重投、接受源文件许可校样；成本时间含 APC/可选OA、币种税豁免不确定性、截止时区和阶段费用。

### 4. 编译契约

输入为批准候选/RQ、冻结ID、IR、已核引用、权限清单、实际目标阶段；输出适配计划、大纲、主张纳入排除、稿件源文件、图、声明、门户字段、manifest、合规报告、未解决门禁。说明为何重排删除章节；不得把计划评估变结果、去掉解释数值所需限制、把必需证据移到不可访问补充、把作者自用称外部采用。扩缩保持语义，标题摘要正文门户同一目标版本，数字分母结论无冲突。证据缺口如实输出。

### 5. 动态规则

来源快照是观察不是永久规则。选目标、外部发帖投稿前、大修、接受生产时复查官方指南和门户。费用、期限、索引分区、周转有日期来源，缺失保持未知；宣传周转不是个人录用预测。官方不可访问可用核验作者上传/编辑确认但留来源日期；旧论文、博客、模型记忆不能补成已核实。规则改变仅使受影响检查批准失效。

### 6. 截止和付款

保存原截止文本、命名时区/UTC偏移、规范瞬时、注册和全文截止、来源。午夜歧义或门户CFP不同属冲突，可提示较早操作时间但不能称解决；不从年份时段猜精确截止。费用含 base/APC、模式、币种税超页注册、豁免协议适用和报价日期，未知不免费，不越Owner硬预算，付款独立确认。

### 7. 按动作的AI权限

分别跟踪文献、代码、分析、起草润色、实证图、概念图、graphical abstract、作者编辑对话和公开通信，记录工具版本日期范围人工检查。某动作允许不代表另一允许；人点发送不能豁免禁止AI生成的内容。S03/S12 为相关来源，禁止实质起草应直接交人工，不藏模型 worker；文本许可不授权合成研究观察或数据图。

### 8. 规则测试

每适配器有正/负/未知/冲突 fixtures，按阶段列必需键清单。不完整种子不能因已列项全绿变 READY；此处示例明确禁用，不可执行放行。
