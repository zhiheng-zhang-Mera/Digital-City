# REX-890 领取就绪预检 / Claim-readiness preflight — Mech

作者 / author: Mech-DS（`MEGA-REP`）· 时间 / at: 2026-10-06 · 对象：系列最后一个任务 / the series' terminal task

```text
被测对象 / measured   utopia @ b06504f（origin/main）· REX-806 头 3950d478e…（含全部已验收 REX 头）
                      · 常驻 City 172.31.12.151:4391（运行已验收候选 0261a9e）
边界 / boundary       **只读预检**：不领取 REX-890、不改它的工作书字段、不建它的报告目录、不合并、不部署
```

## 0. 为什么现在做 / Why now

REX-890 的完成门槛要求「opposite-host 独立 reproduction 成功」，而它的最低 study 里有两项（**注入故障 + 恢复**、以及 **handoff**）在本机已知的 v1 能力里**没有现成证据**。把这件事在有人领取**之前**量清楚，比让领取者在施工中途发现要便宜得多——这也是本系列记录缺陷而不是隐藏缺陷的同一条纪律。 / REX-890's gate requires an opposite-host reproduction, and two of its minimum-study elements have no evidence in v1. Measuring that before anyone claims it is cheaper than discovering it mid-task.

## 1. 门槛原文对照 / The gate, as written

```text
最低 study 必须包含    multi-device execution · one handoff or routing decision · one injected fault · recovery
                       · repetitions · one replay · one ablation · artifact export
opposite host 必须     从 artifact/manifest 重建 · 独立执行 · 重算关键 metrics · 对比 trace/provenance
                       · 指出不一致 · 修复后再复现（**不能只读报告**）
最终素材               mission-book/reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md
                       （experiment/run/failure 计数、defect taxonomy、review-only findings、reproducibility delta、
                         measured metrics、unresolved limitations、potential paper directions）
最终标记               RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE（需 opposite-host 复现成功 + exact-head CI 绿 +
                       用户 exposure gate PASS）；此前不得创建 programme final integration workbook
```

## 2. 逐项实测：今天有什么、缺什么 / Element by element, measured

```text
要素 / element                 今天的状态 / state now                              证据或缺口（实测）
multi-device execution        有，但目前只体现为放置 / placement                     REX-806 包 24 行落在 2 个 device（20 / 4）
one handoff or routing        只有 routing（放置决策），**没有 handoff**              live City `GET /research/replays` -> supportedScenarios=[WAIT]；
                                                                                    replay.mjs:55 对 scenarioId!=='WAIT' 或带 faultProfileRef 的源
                                                                                    回 REPLAY_CONDITION_UNAVAILABLE
one injected fault + recovery **没有** / absent                                      包内 `exclusions.json` 第三条（what = "fault and recovery
                                                                                    metrics"，why = "no fault receipt is present in the provided
                                                                                    sources"）；live City `GET /research/faults` -> **404**
                                                                                    （fault 控制器由 fe700ab 引入，运行中的 0261a9e 不含该分支；
                                                                                    fe700ab 已在 3950d47 内）
repetitions                   有                                                     18 个 campaign / 24 runs / 22 measured / 2 warmup
one replay                    有                                                     11 次重放（dataset 里 7 行 REPLAY + 4 行 ABLATION）
one ablation                  有                                                     4 行；seed-only 偏离**恰**出现在消融行（两种实现都验过）
artifact export               有                                                     reports/REX-806/artifact（10 文件 + checksums；clone 校验 10/10）
trace / provenance 对比        有材料                                                  rawPointers：receipts 18 · canonicalTasks 26 · traceRecords 176 ·
                                                                                    experiments 17；另有 PROVENANCE_CROSSCHECK 8/8
opposite-host 独立复现         未开始                                                 REX-806 工作书 review_host 仍为 null
RESEARCH_MATERIAL_SYNTHESIS    尚不存在（路径已由工作书指定）                            reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md
```

**另有一条部署事实**（对 REX-807 的 Export/Danger 两节同样有效）：运行中的 City 是候选 `0261a9e`，它**既没有** fault 控制器，**也没有** REX-806 的 artifact 导出面（`GET /research/artifacts` 同样是 404）。REX-806 的包是**用 REX-806 checkout 里的 CLI 打那台 City 的 campaign 路由**生成的，所以包存在并不代表 City 上有导出面。 / Deployment fact: the resident City runs 0261a9e, which serves neither the fault controller nor the artifact surface; the package was produced by the CLI talking to that City's campaign routes.

## 3. 因此 REX-890 的「注入故障」有三个选项，且这是**待决定项** / Three options, and the choice is not this host's

本机**不替领取者决定**，只把代价写清： / The cost of each, stated rather than decided:

```text
A  部署含 fault 控制器的候选（最小：3950d47 已含 fe700ab），在 City 上真实注入一次故障并观察恢复，
   把它与同期 campaign receipt 配对；包里仍会保留那条 fault/recovery 排除（exporter v1 有意只读 campaign 范围），
   因此 study 的故障证据来自 fault receipt 集本身，而不是 artifact
   代价：一次部署 + 一次故障演练；不需要改产品代码
B  把 exporter / replay 扩到能承载 fault receipt（即 v1 之后的 v2 范围决定：replay 需要快照 fault 条件）
   代价：产品改动 + 新工作书或明确的范围裁决；超出已验收的 REX 头
C  由记录持有人裁决：最低 study 的「one injected fault」以 fault 控制器的 receipt 与恢复观测满足，
   不要求它出现在 campaign 回执或 artifact 里；并把该裁决写进 REX-890 工作书
同样需要裁决的还有「one handoff」：v1 只支持 WAIT 场景，**handoff 在本代能力里不可表达**，
除非 (i) 认定「routing decision」已由放置决策满足（包内有 SEEDED_WORKER_SELECTION 与策略钉定两种规则），
或 (ii) 新建 handoff 场景（产品工作，超出已验收头）。
```

**本机的建议（不是决定）**：先走 A + 对 handoff 走 (i)，并把两处判断写进工作书；若记录持有人要求 handoff 场景本身，则应把它记为 REX 系列的**新增范围**，而不是塞进 REX-890 的完成门槛。 / Suggested, not decided: option A plus treating the placement decision as the routing decision, with both judgements recorded in the workbook.

## 4. 领取时该跑的清单 / The checklist a claimant should run

```text
1  确认 REX-801..807 七个标记全部释放，并取**每个任务的 accepted SHA**（不是 dev 头、不是分支名）
2  用 accepted SHA 建 union baseline，逐条实测祖先关系；预计 union = main ∪ REX-807 accepted head，
   而后者应已包含 REX-806 的并集（3950d47 已含 REX-803/804/805 三个已验收头）
3  依赖冒烟：研究系列 26 个套件（rex801 4 / rex802 2 / rex803 8 / rex804 5 / rex805 4 / rex806 3）
4  部署一个**含 fault 控制器与 artifact 导出面**的候选（否则 §3 的 A 无法执行，City 上会见到 404）
5  先跑代表性 study，再导出 artifact；导出前确认 City 上 `GET /research/replays` 的 supportedScenarios 与
   本次 study 的场景一致（本机实测为 [WAIT]）
6  产出 RESEARCH_MATERIAL_SYNTHESIS.md 的八项内容；opposite-host 复现必须由另一实体主机执行（§3 禁止自审）
```

## 5. 本预检没有做 / NOT done here

```text
· 没有领取 REX-890，没有改它的工作书字段，没有创建 reports/REX-890/
· 没有部署任何候选，没有在 City 上注入故障（因此 §2 的「故障」缺口是**读代码 + 读 404**得到的，不是演练结果）
· 没有主张 REX-890 无法完成：本预检说的是**今天没有现成证据**，三条出路都写在 §3
· 没有替记录持有人做 (A)/(B)/(C) 与 handoff 的裁决
```

---

语言读本 / English reading: [en/REX-890_CLAIM_READINESS_MECH.md](en/REX-890_CLAIM_READINESS_MECH.md)
