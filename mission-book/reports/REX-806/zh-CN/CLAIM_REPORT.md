> 阅读译本 / Reading translation。原文件仍为正式历史记录；本文件不新增领取、验收、任务状态或合并权。所有原始代码证据块逐字保留。

[原文 / Canonical source](../CLAIM_REPORT.md)

# REX-806 领取与基线 — Mech：中文阅读译本

2026-10-06，Mech-DS，实体主机 `MEGA-REP`，角色 Mech-DS。本文件在任何产品改动前发布，当时尚无实现，也无结论。

## 为什么现在可以领取

```text
dependencies（工作书声明）  REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED
                            REX-804:FAULT_INJECTION_RECOVERY_ACCEPTED
                            REX-805:TRACE_REPLAY_ABLATION_ACCEPTED
三个标记现状（逐个读取工作书）  REX-803 review_complete=true, accepted 8798ba9dd37051626033ad72080b2fad3ff66149
                            REX-804 review_complete=true, accepted fe700aba957990f93b22fd63d594ddfff7b4e243
                            REX-805 review_complete=true, accepted 0261a9ed1cec88df3ab4675623d422b37b33f270
execution_enabled           true
development_host            null（未被领取）→ 本机领取
```

## 基线解析：领取时 DEPENDENCY_SHA_UNION_AT_CLAIM

工作簿要求 `baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM`。基线从已接受的确切 SHA 构成 union，不能拿 main 当作依赖已部署证明。实测：

```text
三个已接受头是否在 main 上 / in main?   REX-803 False · REX-804 False · REX-805 False
required_ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe 在 main 上 / in main? True
已接受头之间的包含关系 / containment   accepted REX-803 8798ba9 已被 accepted REX-805 0261a9e 包含
                                        => union 只需 main + 0261a9e + fe700ab
```

构造与冲突解决：

```text
1  0261a9e 并入 main                      FAST-FORWARD（它本身已包含 main 与 accepted REX-803）
2  fe700ab 再并入                        一处冲突 services/dev-gateway/server.mjs —— 与集成前置测量里同一个 union 位点：
                                         accepted 803+805 侧保留 campaign 与 replay 控制器，804 侧加入 fault controller
                                         三者互不引用 => 并集 = 三者都要；单一 return 暴露 campaigns+faults，
                                         teardown 同时释放两者
基线 / baseline                          rex/REX-806-mech-metrics-and-export @ e18c5c5350d7657cf046b7ba6bbcd888dc2a1540
                                         父提交 = 0261a9e（accepted REX-805，含 accepted REX-803）与 fe700ab（accepted REX-804）
                                         三个已接受头在其中均可 `--is-ancestor` 验证
```

## 依赖冒烟：在任何 REX-806 产品改动之前

```text
node --test tests/rex803-*.tests/rex804-*.tests/rex805-*.     17 个套件 / 68 项 / 68 pass / 0 fail
```

## 已有现象，明确记录

基线中的 `evidence/raw/mission-book/REX-804/danger-zone.png` 每次运行 REX-804 Web 套件后会变脏，原因是已接受 REX-804 的测试把截图写入已提交证据路径。本机已发布待采纳修复 `repair/REX-804-mech-test-evidence-outside-repo @ 690d723`。

它不阻止 REX-806 施工，但使本机在该分支每次测试后 tracked state 变脏。记录在案，不静默处理；这里是历史现象说明，读本不触碰任何 evidence 文件。

## 本机将交付什么

工作簿 Metrics / Artifact Export 要求拓扑、原始指针、归一化数据集、`metrics.csv`、失败与排除项、表格、复现说明和校验和。指标至少涵盖来自前序真实数据的 completion time、recovery time、handoff time。本机计划：

```text
1  只从**前序真实执行**的数据取指标（REX-803 实体 campaign、REX-805 的 replay/ablation 实体运行），不从合成夹具取
2  导出物按「原始指针 + 归一化数据集 + metrics.csv + checksums」组织，失败与排除项如实列出，
   不可观测的指标标 NOT_OBSERVABLE 而不是 0
3  自造探针验证导出物本身（校验和可复核、拒绝路径、边界），不把作者套件当自己的证据
```

只使用前序真实执行数据，而非合成夹具；不能观测的指标为 NOT_OBSERVABLE，不写成 0。独立制造导出物探针，不将作者套件作为自己的证据。

## 领取

```text
development_host     Mech
development_branch   rex/REX-806-mech-metrics-and-export
development_baseline e18c5c5350d7657cf046b7ba6bbcd888dc2a1540（= 三个已接受头的 union）
terminal_marker      RESEARCH_ARTIFACT_EXPORT_ACCEPTED — 未释放
merge_authority      无
```
