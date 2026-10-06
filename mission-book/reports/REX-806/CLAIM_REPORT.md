# REX-806 领取与基线 / Claim and baseline — Mech

2026-10-06，Mech-DS（`MEGA-REP`），角色 Mech-DS。本文件在**任何产品改动之前**发布；**尚无实现，也无结论**。 / Published before any product change: no implementation yet, no conclusion.

## 为什么现在可以领 / Why the claim is legitimate

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

## 基线解析（claim-time，DEPENDENCY_SHA_UNION_AT_CLAIM）/ Baseline resolution

工作书要求 `baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM`：从**已接受的确切 SHA** 组成 union，而不是拿 main 当依赖已落地的证明。实测：

```text
三个已接受头是否在 main 上 / in main?   REX-803 False · REX-804 False · REX-805 False
required_ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe 在 main 上 / in main? True
已接受头之间的包含关系 / containment   accepted REX-803 8798ba9 已被 accepted REX-805 0261a9e 包含
                                        => union 只需 main + 0261a9e + fe700ab
```

构造与解冲突： / Construction and conflict resolution:

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

## 依赖烟雾（在任何 REX-806 产品改动之前）/ Dependency smoke, before any product change

```text
node --test tests/rex803-*.tests/rex804-*.tests/rex805-*.     17 个套件 / 68 项 / 68 pass / 0 fail
```

## 一处需要记下的既有现象 / An existing condition recorded

基线里 `evidence/raw/mission-book/REX-804/danger-zone.png` 在任何一次跑完 REX-804 web 套件后都会变脏——这是已接受的 REX-804 测试把截图写进**已提交**证据路径造成的，本机已发布待采纳的修复（`repair/REX-804-mech-test-evidence-outside-repo @ 690d723`）。它不影响 REX-806 的施工，但会让本机在这条线上每次跑测试后 tracked state 变脏；**记录在案，不静默处理**。 / The known accepted-REX-804 defect: its web test rewrites committed evidence. A repair is published and awaiting adoption; it does not block REX-806 but does dirty the tree after each run.

## 本机将交付什么 / What this host will deliver

工作书要求（Metrics / Artifact Export）：拓扑、原始指针、归一化数据集、`metrics.csv`、失败与排除项、表格、可复现说明、校验和；指标至少覆盖 **completion time / recovery time / handoff time** 等来自前序真实数据的量。本机将：

```text
1  只从**前序真实执行**的数据取指标（REX-803 实体 campaign、REX-805 的 replay/ablation 实体运行），不从合成夹具取
2  导出物按「原始指针 + 归一化数据集 + metrics.csv + checksums」组织，失败与排除项如实列出，
   不可观测的指标标 NOT_OBSERVABLE 而不是 0
3  自造探针验证导出物本身（校验和可复核、拒绝路径、边界），不把作者套件当自己的证据
```

## 领取 / The claim

```text
development_host     Mech
development_branch   rex/REX-806-mech-metrics-and-export
development_baseline e18c5c5350d7657cf046b7ba6bbcd888dc2a1540（= 三个已接受头的 union）
terminal_marker      RESEARCH_ARTIFACT_EXPORT_ACCEPTED — 未释放
merge_authority      无
```
