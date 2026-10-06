# REX-806 研究材料索引 / Research-material index

研究过程与实验材料同时保存，不能把缺失观测填成 0，也不能把开发交付当作验收。 / Engineering-process and experiment materials are retained together; missing observations are not zero, and development handover is not acceptance.

| 材料 / Material | 范围 / Scope |
|---|---|
| [领取记录 / Claim](CLAIM_REPORT.md) | 精确依赖基线：三个已接受头的 union `e18c5c5`，祖先关系与依赖冒烟在动产品之前测量 / Exact dependency baseline, ancestors and dependency smoke measured before any product change |
| [材料包 / Artifact](artifact/manifest.json) | 18 个真实 campaign / 24 runs / 22 measured；27 项命名指标中 4 项有值、23 项 NOT_MEASURED；10 个文件 + `checksums.json`，全新 clone 校验 10/10 / Real campaigns, per-file SHA256, fresh-clone verified |
| [交付说明 / Deliverable](DELIVERABLE.md) | 数字、每项 NOT_MEASURED 的理由、三处会让材料自我美化的自查缺陷及修正 / Headline numbers, unavailable-metric reasons, three self-caught defects that would have flattered the material |
| [开发交付 / Handover](DEVELOPMENT_HANDOFF.md) | 头 `3950d47`、托管 CI 的红→绿（`cd4f603` 失败保留）、最小重算集与第二实现校验器 / Head, retained red CI run, minimum recompute set, independent verifier |
| [溯源交叉核对 / Provenance cross-check](PROVENANCE_CROSSCHECK_MECH.mjs) | 8/8：从城市原始回执出发逐行重算数据集与三项指标、点名两个未交付 campaign 与 accounting / Recomputed from the City's raw store, not from the package |
| [可复现性 / Reproducibility](REPRODUCIBILITY_MECH.md) | 冻结 `generatedAt` 与事件流后**再导出 11/11 字节相同**（含 `checksums.json`）；朴素重导只差 3 处且已解释；负对照改 1 ms 即变红 / Frozen-input re-export is byte-identical; the naive delta is explained; a 1 ms perturbation turns the probe red |
| [复现探针 / Probe](evidence-tools/REPRODUCIBILITY_PROBE_MECH.mjs) | 需要产出该 City 的 owner 凭据才能运行；对侧主机（MEMBER）不可运行 / Requires the producing City's owner credential; the opposite host as MEMBER cannot run it |
| [第三种重算 / Third recomputation](evidence-tools/THIRD_RECOMPUTE_PYTHON_MECH.py) | **Python** 实现，只读包内字节、**27 项检查**（四项指标重算 + 跨文件一致性 + 放置判定自洽），27/27 通过、五个负对照各自变红；顺手量出三处容易被读成不一致的定义差异（`durationMs` 与任务时间戳差 7–63 ms、18 个 campaign 只有 16 个在 dataset 里、11 次 replay 含 4 次消融），并写明「策略本身无法只靠包重算」的边界 / Python, package-only, 27 checks (metric recomputation, cross-file coherence, placement self-consistency), 27/27, falsified by five controls; it also measured three definitional differences that read like mismatches and states the boundary that the policy itself is not package-recomputable |
| [放置策略按城市复算 / Placement from the City](evidence-tools/PLACEMENT_RECOMPUTE_CITY_MECH.py) | 用与网关/replay **共享**的规则，从城市原始回执（18 campaign / 24 run）重算 `expectedNodeIdByPolicy`、两个判定列与规则名：**6/6**；负对照翻转一行期望节点即变红。**需要该 City 的 owner 凭据，对侧（MEMBER）不可运行** / Re-derives the placement columns from the raw receipts with the shared rule: 6/6, control falsifies it; owner credential required, so the opposite host as MEMBER cannot run it |
| [指针表按城市复算 / Pointers from the City](evidence-tools/POINTERS_RECOMPUTE_CITY_MECH.py) | 独立重放导出器的 filter 并核对四类指针（receipts / canonicalTasks / traceRecords / experiments 与 events）：**8/8**；三个负对照（删一条 trace、一条 receipt、一条与 campaign 无关的旧任务）各自变红。同时点名一条语义：`canonicalTasks`=26 是城市整份任务表，而 dataset 只引用 24 个 taskRef / Re-applies the exporter's filters and checks every pointer class: 8/8, three controls fail it; it also names the semantics that `canonicalTasks` (26) is the City's whole task list while the dataset references 24 |
| [拒绝路径退出码检查 / Refusal-path exit check](evidence-tools/REFUSAL_EXIT_CHECK_MECH.mjs) | 端到端演练发现的**本机交付物缺陷**：CLI 在「没有可读回执」时打印了正确理由，却因 `process.exit(1)`（第 38 行）触发 libuv 断言，退出码为 **3221226505 (0xC0000409)** 而不是 1；调用方无法区分「按设计拒绝」与「崩溃」。已实测复现，修复未发布（避免发布未经验证的修复） / A defect in this host's own deliverable, found by the end-to-end rehearsal: the CLI prints the right refusal but exits with a libuv assertion, so callers cannot tell "refused by design" from "crashed". Reproduced; no unverified repair published |

## 边界 / Limits

```text
1  本索引不构成验收：标记 RESEARCH_ARTIFACT_EXPORT_ACCEPTED 未释放，status 仍为 IN_PROGRESS
2  工作书门槛的另一半 —— 「由另一实体主机独立读取/重算」—— 尚未发生；本机对第二实现校验器的运行不是复检证据
3  NOT_MEASURED 不是 0：Owner 干预、规则生命周期、集成事件、故障恢复与暴露/意图延迟等指标，城市记录不表达，
   一律写明原因（21 项以外见 exclusions.json 的三条排除）
4  包是城市事件流的**时间切片**：rawPointers.events 取的是导出时刻的整条事件流，之后再抵达的事件不会出现在包里
5  原始材料目录以 .gitattributes -text 固定换行，任何主机 checkout 后字节一致；读本与验证结果不得混入原始 payload
6  本机不主张 durationDeltaMs 的因果性能结论，也不主张 City 的运行确定性（同一 campaign 两次是否给出同样数值）
```

## 记录动机 / Why this index was added

本文件由 `mission-book/tools/check_record_consistency.py` 的 `PAPER_MATERIAL_INDEX_MISSING` 警告触发：REX-806 工作书声明 `research_evidence_applicability: APPLICABLE`，而当时的报告区没有本研究材料索引。补写索引只补齐**记录**，不改变任何材料字节、不改开发头，也不改变上面第 1、2 条的未完成状态。 / Added because the record-consistency gate flagged a declared research-evidence applicability with no index. It adds a record only: no material bytes, no development head, and neither outstanding item above becomes complete.
