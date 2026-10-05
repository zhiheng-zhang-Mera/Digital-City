# Research Method / 从历史到可辩护研究

## 1. Observation, question, claim / 观察、问题、结论分离

A signal is an observation with provenance and alternatives, not a publication promise. Novelty scanning must search the closest competing mechanism and synonyms, not only the proposed title. Preserve query/date/sources and what was actually inspected. A search finding no close paper is not proof that none exists. G1-G4 instrument priorities remain provisional attention grades, not measured novelty scores.

先记录现象，再提出问题。新颖性检索主动找最接近反例与替代解释；“没搜到”不等于“首次”。G1-G4 只指导注意力和采集预算。允许得出“常规工程修复、不单独写论文”。

## 2. Question selection card / 选题卡

Present the Owner a small set of candidate questions with: observed phenomenon; evidence classes/coverage; alternative explanations; nearest work; current answerable claims; unsupported claims; proposed study type; overlap with active papers; estimated work/cost range and uncertainty; continue/narrow/merge/retire choices. Do not manufacture acceptance probabilities or samples-to-publication thresholds.

候选卡必须把“已有多少有效材料”和“能回答什么”分开。可能一例就能支持存在性反例，但不能估计普遍发生率；大量日志也可能没有可比较设计。

## 3. Method admissibility / 方法适配

| Available evidence / 已有证据 | Eligible analysis / 可考虑方法 | Prohibited upgrade / 禁止升级 |
|---|---|---|
| A documented local episode / 单个本地事件 | Bounded case reconstruction or motivating example / 有界案例 | Universal frequency or effectiveness / 普遍发生率、效果验证 |
| Covered natural task history / 覆盖明确的自然历史 | Retrospective cohort, taxonomy, association, longitudinal description / 回溯、分类、关联 | Randomized causal effect / 随机对照因果结论 |
| Declared intervention and comparison / 明确干预与对照 | Design-appropriate comparison with confounder analysis / 相应比较 | Calling an uncontrolled before/after randomized / 将前后比较称随机实验 |
| Planned independent new runs / 获批独立新运行 | Prospective validation with fixed analysis plan / 前瞻验证 | Mixing discovery and confirmation silently / 混合发现与确认 |
| Software plus usage evidence / 软件与使用证据 | Software contribution and bounded utility / 软件贡献 | Invented adoption, users or performance / 虚构采用或性能 |

The matrix is local design guidance, not a venue's official acceptance rule. Method-specific checks should be informed by SIGSOFT empirical standards [S13 in policies/SOURCES.md], without converting every recommendation into a universal requirement.

## 4. Retrospective honesty / 回溯诚实性

Record when the question, inclusion criteria and analysis choices were selected relative to seeing outcomes. Declare post-hoc exploration. Freeze the reconstruction and analysis before confirmatory runs when possible; never backdate preregistration. Keep all candidate analyses and material exclusions, including negative and inconclusive results. A model-generated taxonomy is provisional until checked against source records; retain codebook versions, ambiguous cases and adjudication decisions.

如实说明看过结果后才定的问题与分析方法。不得把回溯分析包装成预注册。记录剔除理由、负结果、无结论和分类歧义；不能仅保留“像论文”的成功叙事。

## 5. Statistical guardrails / 统计护栏

Define the unit of analysis before aggregating: task, independent run, repository, author or environment. Retries, repeated measurements and multiple agents on one task are clustered, not automatically independent. Preserve temporal drift in model, policy, code and workload. Compare denominators and exposure opportunities, not only counts.

区分任务级和尝试级样本；同任务重试、相同缓存/环境下复检可能相关。主机不同也不等于随机分组。统计比较需考虑难度、任务分配、模型版本、日历时间、人工介入与选择偏差。

Choose uncertainty estimates and tests suitable for design, dependencies and missingness; report effect size and uncertainty where estimable. Do not force a p-value, normality assumption or arbitrary minimum N. Exploratory multiple comparisons require disclosure and appropriate multiplicity handling or independent confirmation. Holdouts must separate task/family/time as needed; moving retries of the same task into test data leaks information.

失败后提前终止属于删失/缺失的可能来源；不能全部算零成本或删去。只在自己项目上狗粮要明确作者参与和外部效度限制。没有合理对照时允许只报告描述结果。

## 6. Added validation is an explicit separate operation / 新验证必须独立授权

Return one of `SUFFICIENT_FOR_BOUNDED_CLAIM`, `NARROW_OR_CHANGE_METHOD`, `VALIDATION_PROPOSAL`, `MERGE_OR_RETIRE`. A validation proposal states what uncertainty it resolves, comparison, outcome definitions, stopping rule, resources and cost. Owner approval is required before new executions, paid models or modifications to frozen engineering. Natural development may continue independently.

方法和证据决定期刊候选，不为“更高级期刊”自动加机器、补样本或重开产品开发。不同期刊要求超出现有证据时，先缩窄/换刊/暂停，再决定是否值得额外实验。

## 7. Reproducibility vs scientific validity / 可复现不等于有效

A deterministic re-run can reproduce a biased analysis. A citation can resolve to a real DOI yet not support the sentence. Check reproducibility, measurement validity, claim support and novelty separately. Exact numbers come from versioned computations, never generated prose. / 编译、复跑、引用可访问和研究成立是不同检查。
