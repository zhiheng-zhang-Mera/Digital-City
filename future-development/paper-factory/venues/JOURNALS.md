# Journal Profiles / 期刊专项设计

**Snapshot:** 2026-10-05. **All profiles remain disabled design profiles.** / 全部仍是未启用的设计配置。

`Observed rule` means a bounded reading of an official source, not an exhaustive current checklist. `Design specialization` is our proposed writing/evidence strategy, not a claim about editor preferences or guaranteed acceptance. Sources and unresolved fields are in [SOURCES](../policies/SOURCES.md). / 明确区分已核实规则与内部拟定策略。

## 1. IEEE Access / 完整技术论文分支

**Design specialization / 内部策略:** choose an actual article type first: a mechanism paper needs a question, technical mechanism and appropriate validation; a negative-result paper needs a meaningful hypothesis and sound negative result, not a list of build failures. Organize the narrative around what can be established with the frozen corpus. / 不能把 NIER 的 Future Plans 直接改名为 Evaluation；无实验就保留研究边界或换路由。

**Observed rules [S01]:** initial upload includes editable Word/LaTeX and matching PDF; use its own template, with named authors and biographies. Source/PDF limit 40 MB; 3–10 keywords. AI-generated text requires the stated acknowledgment/citation treatment. Under-20-page length is guidance, with a conditional EIC inquiry for longer articles, not a universal hard cap. / 初投不是 PDF-only；字数页数按具体稿型条件判断。

**Adapter outputs / 输出:** article-type decision, full technical manuscript, source/PDF consistency report, bios/ORCID checklist, scoped results/limitations, AI-use map, actual revision change ledger when applicable. Preserve unresolved APC, stage-specific portal fields and publisher-policy checks until fresh verification. / 不把完整源文件要求推迟到录用后。

## 2. Empirical Software Engineering (EMSE) / 实证研究分支

**Design specialization / 内部策略:** methods lead the outline: RQ, population/selection, operational measures, dependent observations, analysis, results, threats and data accessibility. Rich logs do not substitute for a defensible sampling frame. / 优先做方法和数据生成过程解释，而不是产品功能目录。

**Observed rules [S02]:** editable sources at initial submission and each revision; single-blind review. Abstract 150–250 words, 4–6 keywords; structured abstract allowed but optional. Research papers require a data-availability statement. Significant conference extensions must disclose their added contribution and overlap. / 结构化摘要可用但非强制；受限数据不伪称全公开。

**Adapter outputs / 输出:** evidence-selection ledger, method-specific preflight, optional Context/Objective/Method/Results/Conclusions abstract, declarations, source package, data-access statement and replication instructions. Validate manuscript content, rather than treating successful replication as proof of causal validity.

## 3. Software: Practice and Experience (SPE) / 实践经验分支

**Design specialization / 内部策略:** emphasize an implemented software problem, engineering alternatives/trade-offs, observed operation and lessons transferable beyond one repository. A local anecdote needs bounded interpretation; a speculative design without implementation belongs elsewhere. / 重点是可复用工程经验，不是功能多就算贡献。

**Observed official text [S04]:** 250-word abstract; regular/short length guidance includes 40/10 pages. Conference extensions require added contribution and disclosure. However the same author page contains conflicting initial LaTeX file instructions, and keyword limits of six versus seven. / 已发现官方页内部冲突，不能自动选择宽松段落。

**Release gate / 提交门:** `SOURCE_CONFLICT`. Obtain current portal/editorial clarification for affected requirements. Build editable sources internally, but do not claim their initial-upload requirement has been resolved. / 内部可准备齐全材料；实际上传文件集保持待核实。

## 4. SoftwareX / 科研软件贡献分支

**Status:** official author guide not retrievable in this session [S07]; numeric/template/package mandates **UNVERIFIED**. / 不照抄旧版 3000/4000 字等说法。

**Design specialization / 内部策略:** software's reusable research purpose, architecture and alternatives, exact release, installable example, test/reproduction path, license/dependency inventory and demonstrated use. Describe implementation sufficiently to reuse the software without copying its whole developer manual. / 主线是软件贡献与可使用性，不把私人系统规模冒充外部影响。

**Adapter checklist to verify / 待核实专项字段:** permitted article types; article template and code/software metadata tables; word/page budgets; repository/archive/release/license requirements; runtime capsule; required figures; data/AI declarations; file formats, review anonymity and APC. Every mandatory condition needs a current official source before release. / 目前是有内容策略的待核验 adapter，不是 READY。

## 5. Software Impacts / 软件影响分支

**Status:** current author guide inaccessible [S08]; hard requirements **UNVERIFIED**.

**Design specialization / 内部策略:** organize around a concrete research workflow enabled or improved by the software, who used it, how that use is evidenced, limitations, and how another researcher can reproduce the example. Clearly label developer-only use. Potential future impact is not measured impact. / 与 SoftwareX 的架构/重用视角区分，重点检查影响证据而不是夸大采用。

**Adapter checklist to verify / 待核实:** current impact-paper template; word budget; code/reproducibility platform obligations; software metadata; license; archive; graphical materials; fees and stage requirements. Do not assert that a particular capsule provider is mandatory without current verification. / 不把 Code Ocean 等平台写成未经确认的硬门槛。

## 6. PeerJ Computer Science / 计算机研究完整性分支

**Status:** current author instructions/editorial-criteria retrieval unsuccessful [S09]. Review model, numeric limits, costs and exact uploads remain **UNVERIFIED**.

**Design specialization / 内部策略:** a bounded, standalone computing question with explicit method, available evidence, limitations and a reproduction route. Generate a methodological-completeness card, not a prestige label or an assumption of easier review. / 不把“soundness-oriented”误当自动接收策略。

**Adapter checklist to verify / 待核实:** supported contribution types, statistical/data/code policies, abstract/keyword conventions, reference style, declarations, anonymity, source files, preprints and publication charges. Only verified fields can become operational rules.

## 7. Journal of Systems and Software (JSS) / 软件系统研究分支

**Status:** current guide unavailable [S10]. Specific submission rules **UNVERIFIED**.

**Design specialization / 内部策略:** select a systems/software-engineering research object, explain technical novelty or the independent empirical finding, then connect it to measured software outcomes. System overview alone does not establish a research contribution. / 把软件本体、方法与评估建立明确关系，不直接复制城市架构总览。

**Adapter checklist to verify / 待核实:** article category and special issue; empirical/replication expectations; structured abstract applicability; highlights/graphical abstract; data availability; reference/file formatting; anonymous package; overlap policy and costs. These are fields to verify, not blanket mandatory requirements.

## 8. Information and Software Technology (IST) / 方法与实践评估分支

**Status:** current guide unavailable [S11]. Specific submission rules **UNVERIFIED**.

**Design specialization / 内部策略:** for a suitable paper, foreground an SE technique/practice, its intended use and a defensible evaluation of outcomes and applicability. A review article requires its own literature-selection protocol; do not generate one by converting a related-work section. / 方法或经验主张必须有相应证据；综述与实证研究分别建 article-type adapter。

**Adapter checklist to verify / 待核实:** research/review/other categories, abstract sections and length, highlights, reproducibility materials, anonymous/named files, revision requirements and charges. Do not inherit JSS's unverified settings merely because both use the same publisher.

## 9. Journal of Open Source Software (JOSS) / 成熟开放研究软件分支

**Observed rules [S03]:** public OSI-licensed research software; screening expects sustained public development for more than six months and demonstrated research use. A repository dump or future-use advertisement is insufficient. Submission uses `paper.md` with software-associated sources; accepted software is archived as a tagged version with a DOI. AI assistance is disclosed, while author-editor/reviewer conversation prohibits AI except translation. / 不是把通用 PDF 改成短文就能走此路线。

**Design specialization / 内部策略:** readiness checks cover installation, tests, maintenance, research utility and release provenance. Keep Essay-Book as canonical paper source and export an explicitly approved copy to the software repository when required; track exact correspondence to avoid dual authoring truth. / 写回软件仓库是单独受控导出，不擅自修改冻结产品。

**Special handoff / 特殊交接:** substantive editorial/reviewer conversations become human tasks, not AI-drafted replies awaiting a click. No claim that automated internal reviewers satisfy external JOSS review. Exact eligibility and policy must be refreshed at submission.

## 10. Publisher-level AI overlay / 出版商 AI 覆盖层

For the Elsevier targets, [S12] distinguishes manuscript assistance from figures and other outputs. Empirical images/data must not be fabricated. Conceptual diagrams and graphical abstracts have different permissions; general-purpose generative-image use for graphical abstracts is restricted. / 应分别管理文本、真实数据图、概念图和图文摘要，不能用一个 ai_allowed=true 覆盖全部。

Local implementation: keep task-specific allow/deny/disclosure rules and human verification records. A future graphics adapter must reproduce data plots from admitted data and preserve the plotted numerical values. / 本地策略是保留可追溯配方，不从模型生成“漂亮结果图”。

## 中文完整说明 / Complete Chinese explanation

所有profile为禁用设计，快照2026-10-05。“已观察规则”仅官方有界阅读，不是完整当前清单；“内部策略”不是编辑偏好或录用保证。来源及未知见SOURCES。

### 1. IEEE Access

先定实际稿型：机制稿需问题机制适当验证，负结果稿需有意义假设和有效负结果，不能只是构建失败。按冻结语料组织，不把NIER未来计划改名成评估。

S01记录初投需可编辑Word/LaTeX和匹配PDF，使用自身模板、署名和简介；source/PDF限制40MB、3–10关键词；AI文本按规定致谢引用。少于20页为指导，更长有条件咨询EIC，不是统一硬限。输出稿型决定、完整技术稿、一致报告、简介ORCID清单、范围结果限制、AI使用图及真实修订账本；APC、阶段门户、出版政策保持待刷新，不把源文件延到录用。

### 2. EMSE

按方法组织RQ、总体选择、操作测量、依赖观察、分析结果威胁数据可访问，丰富日志不是采样框架。S02记录初投每次修订都需可编辑源、单盲、150–250词摘要、4–6关键词，可选结构摘要、研究稿数据可用声明，重大会议扩展披露增量重叠。输出选择账本、方法预检、可选Context/Objective/Method/Results/Conclusions摘要、声明源包、数据访问和复现说明；成功复跑不证明因果有效。

### 3. SPE

关注实际软件问题、工程备选权衡、运行观察、超越单仓库的经验；本地轶事有界、无实现设计另路。S04记录250词摘要、常规/短文40/10页指导、会议扩展增量披露；但同官方页初投LaTeX上传和六/七关键词互相冲突。SOURCE_CONFLICT须当前门户/编辑澄清；可内部备完整源，但不称初投上传已确定，不能静选宽松段落。

### 4. SoftwareX

S07本次无法取得当前指南，数字模板包硬要求UNVERIFIED，不抄旧3000/4000词说法。内部强调可复用研究目的、架构备选、精确release、可装例子、测试复现、许可依赖和实际使用；足以复用不复制完整开发手册，私有规模不冒充外部影响。待核类型模板、软件元数据、字页预算、仓库归档release许可、capsule、图、数据AI、格式匿名APC。每必需条件需当前官方来源，此profile不是READY。

### 5. Software Impacts

S08指南不可访问，硬要求未核。策略是具体研究工作流、何人使用、证据、限制、复现例子，开发者自用明确标注，潜在影响不是实测。待核模板字预算、代码复现平台、元数据、许可归档图费用阶段，不未经核查把Code Ocean等列硬要求。

### 6. PeerJ Computer Science

S09获取失败，评审模式数字成本上传未核。策略为独立有界计算问题、方法证据限制复现，给方法完整卡不是信誉标签或更易录用假设。待核贡献类型统计数据代码、摘要关键词、参考声明匿名源、预印本费用，仅已核项可运行。

### 7. JSS

S10指南不可用，具体规则未核。选系统/软件工程对象，说明技术新意或独立实证发现并连到实测软件结果；总览本身不是研究贡献，不直接复制城市图。待核类别专题、实证复现、结构摘要、highlights/graphical abstract、数据、参考文件、匿名、重叠成本；这些是字段，不是一律必需。

### 8. IST

S11指南不可用，具体规则未核。合适稿件强调SE技术实践、用途、可靠结果/适用评估。综述需独立文献选择协议，不由related work直接转换。待核研究综述其他类别、摘要节长度、highlights、复现、匿名署名、修订和费用，不因同出版商继承JSS未核设置。

### 9. JOSS

S03记录公开OSI许可研究软件、持续公开开发超过六个月和实际研究使用，仓库dump或未来广告不足。提交paper.md及软件关联来源，接受软件以tagged release和DOI归档；AI需披露，作者编辑/评审对话除翻译外禁AI。

检查安装测试维护研究效用release来源。Essay-Book保留正文权威，需写软件仓库时导出独立批准副本，追踪精确对应，不改冻结产品或双重写作。实质编辑回复直接人工，不AI写后点击，不把自动内部审查称外部JOSS审查；投稿刷新资格政策。

### 10. 出版商AI覆盖

Elsevier S12区分正文协助、图片其他输出，实证图数据不得编造，概念图和图文摘要许可不同，通用生成图文摘要受限。内部按动作允许/拒绝/披露及人工检查，不用一个ai_allowed覆盖全部。未来数据图须从准入数据重现，数值保留、配方可追踪，不模型生成漂亮“结果”。
