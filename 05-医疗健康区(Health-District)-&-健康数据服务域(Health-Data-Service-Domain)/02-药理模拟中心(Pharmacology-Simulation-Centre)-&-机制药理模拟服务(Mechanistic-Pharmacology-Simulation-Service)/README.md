# Pharmacology Simulation Centre — 药理模拟中心

```text
STATUS = DESIGN_ONLY_EXISTING_PROJECT
REPOSITORY = https://github.com/zhiheng-zhang-Mera/drug-simulator
SOURCE_SNAPSHOT = 23cbe9b8a416bc1023bd3ddf9e3bfd1629e05c9a
RUNTIME_IMPLEMENTED = FALSE
DOMAIN = HEALTH / PHARMACOLOGY
```

## Role

Own mechanistic simulation for a **fixed user-supplied drug/regimen set**:

```text
physiological baseline
+ compounds / dose / route / formulation / schedule
+ pharmacology evidence
→ PK / ADME
→ effective exposure
→ PK interactions
→ PD targets/pathways
→ physiological endpoints
→ adverse-effect state
→ uncertainty + evidence-governed report
```

It does not diagnose disease, choose drugs, optimize a stack, prescribe treatment or invent unsupported PK/PD parameters.

## Designed capability clusters

1. input/canonicalization and immutable simulation request;
2. physiological baseline projection;
3. administration events / regimen timeline;
4. PK / ADME and active-metabolite exposure;
5. effective exposure state;
6. PK drug-drug interaction resolver;
7. PD target/mechanism/pathway engine;
8. physiological endpoint aggregation;
9. adverse-effect attribution;
10. monotherapy vs combination comparison;
11. structured pharmacology evidence KB/governance;
12. parameter/model/evidence uncertainty;
13. reporting and overlapping validation forest.

## Honest implementation boundary

At snapshot `23cbe9b8a416bc1023bd3ddf9e3bfd1629e05c9a`, the repository contains only:

- `README.md`;
- `idea-structure.md`.

Therefore the City records **design authority/provenance**, not a running pharmacology service.

## Relationship to Parama-Health

The two projects are not merged.

### Input road

```text
Parama PersonalContextSnapshot
→ minimal PhysiologicalBaseline projection
→ Drug Simulator
```

Possible fields include time-valid body composition, renal/hepatic/cardiovascular/metabolic modifiers and pharmacogenomic context when actually available. Missing values remain missing; population defaults must remain tagged as defaults.

### Output road

```text
EffectiveExposureState
+ mechanism/pathway effects
+ physiological endpoints
+ adverse-effect signals
+ uncertainty/evidence
→ Parama Exposure Context / State Estimator
```

These outputs remain simulated/inferred evidence, not clinical truth.

## Boundary

- pharmacology domain knowledge stays in 05;
- generic literature/document infrastructure may be provided through shared roads later;
- “Research OS” methodology reuse does not move this Health-domain kernel into 06 Research;
- no automatic safety, treatment or dosing recommendation is produced.

## 中文说明 / Chinese explanation

状态为 `DESIGN_ONLY_EXISTING_PROJECT`，`RUNTIME_IMPLEMENTED = FALSE`，仓库和固定快照如上，领域为健康/药理。针对**用户已指定的固定药物/方案集合**，把生理基线、化合物/剂量/途径/剂型/时间表和药理证据映射到 PK/ADME、有效暴露、PK 相互作用、PD 靶点通路、生理终点、不良效应、不确定性与证据治理报告。不诊断、选药、优化组合、开处方或编造无支持参数。

规划十三个簇：输入规范化/不可变请求、生理基线投影、给药事件时间线、PK/ADME/活性代谢物、有效暴露、PK-DDI 解析、PD 机制通路、终点聚合、不良效应归因、单药与组合对比、结构化证据知识库治理、参数模型证据不确定性、报告和重叠验证森林。

上述快照只有 `README.md` 与 `idea-structure.md`。城市记录设计权责和来源，不能声称有运行服务。两个项目没有合并。输入道路为 Parama `PersonalContextSnapshot` → 最小 `PhysiologicalBaseline` → 模拟器；实际有数据时可包括时间有效体成分、肾肝心血管代谢修饰和药物基因组背景。缺失值保持缺失，群体默认值明确标注。

输出为 `EffectiveExposureState`、机制通路效应、生理终点、不良效应信号、不确定性证据 → Parama 暴露背景/状态估计。结果仍是模拟/推断证据，不是临床事实。药理知识留在 05，通用文献基础设施未来可通过共享道路提供；复用 Research OS 方法不把内核迁往 06；不自动提供安全、治疗或剂量建议。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 1 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `DESIGN_ONLY_EXISTING_PROJECT` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
