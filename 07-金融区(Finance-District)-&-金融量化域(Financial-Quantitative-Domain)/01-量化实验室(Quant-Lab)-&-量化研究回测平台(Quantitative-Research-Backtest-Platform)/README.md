# Quant Lab — 量化实验室

```text
STATUS = EXISTING_IMPLEMENTATION_ON_HOLD_NOT_PRODUCTION_QUALIFIED
PRIMARY_REPOSITORY = https://github.com/zhiheng-zhang-Mera/Quant-ultra
PRIMARY_SNAPSHOT = 1988d9a8530da91a8158de864d098ea869098923
FEATURE_DONOR = https://github.com/zhiheng-zhang-Mera/ML-Quant-A-stock
DONOR_SNAPSHOT = 0a31783cfdf5131e2f1c2c9f5dd116af3a9c9589
```

## Core rooms from Quant-ultra

1. Market Data Foundation.
2. Temporal Slicing & Validation.
3. PIT / Regime / Feature Engine.
4. Labels & Sample Weighting.
5. Model Training & Calibration.
6. Portfolio Construction & Position Sizing.
7. FSM Backtest & Execution Simulation.
8. Audit / Stress / Capacity.
9. Shadow MLOps & Reconciliation.

Quant-ultra remains explicitly on hold and is not claimed production-qualified.

## Experimental donor room — Multimodal Signal / Risk

ML-Quant contributes **existing but unqualified experiments**, not a second production path:

- `LLMTextAnalyst`: external OpenAI-compatible text/news analysis into numeric per-asset views, with mock fallback;
- DP-GMM cohort discovery over `[CQR width, text view]`;
- experimental block/non-diagonal Omega construction with cohort correlation and cross-modal dissonance inflation.

These capabilities are not automatically enabled in Quant-ultra. Porting requires fresh evidence, tests and Finance-domain validation.

## Superseded overlap

ML-Quant's older data/CQR/Black-Litterman/MVO pipeline is not retained separately.

`Personal-trading-project-for-fun` is not admitted because its early fetch/filter/signal/ML-price concept is already subsumed.

## Cross-district relationship

06 Research may evaluate Quant Lab; generic Engineering/Automation may operate software; Finance retains model/market/portfolio semantics.

---

# 中文完整说明：量化实验室

状态 `EXISTING_IMPLEMENTATION_ON_HOLD_NOT_PRODUCTION_QUALIFIED`。主要仓库 https://github.com/zhiheng-zhang-Mera/Quant-ultra ，快照 `1988d9a8530da91a8158de864d098ea869098923`；特征供体 https://github.com/zhiheng-zhang-Mera/ML-Quant-A-stock ，快照 `0a31783cfdf5131e2f1c2c9f5dd116af3a9c9589`。

## Quant-ultra 的核心房间
1. 市场数据基础。
2. 时间切片与验证。
3. PIT／市场状态／特征引擎。
4. 标签与样本加权。
5. 模型训练与校准。
6. 组合构建与仓位确定。
7. FSM 回测与执行模拟。
8. 审计／压力／容量。
9. 影子 MLOps 与对账。

Quant-ultra 明确保留暂停状态，不声称已具备生产资格。

## 实验供体房间：多模态信号／风险
ML-Quant 提供已有但未经资格验证的实验，而非第二条生产路径：
- `LLMTextAnalyst`：把外部 OpenAI 兼容文本／新闻分析转为每资产数值观点，带模拟回退；
- 在 `[CQR width, text view]` 上使用 DP-GMM 发现群组；
- 使用群组相关性与跨模态失谐膨胀构建实验性块状／非对角 Omega。

这些能力不会自动启用到 Quant-ultra；移植需要新证据、测试和金融域验证。

## 被取代的重叠范围
ML-Quant 较早的数据／CQR／Black-Litterman／MVO 流水线不再单独保留。`Personal-trading-project-for-fun` 不被纳入，因为其早期抓取／筛选／信号／机器学习价格概念已被包含。

## 跨区关系
06 研究院区可评估量化实验室；通用工程／自动化可操作软件；金融域保留模型／市场／组合语义。

## 快速信息与导航 / Quick facts and navigation

目录与文档数量于 2026-10-06 在本工作树实测；实现状态沿用文档记录，不代表重新验证产品运行时。 / Directory and document counts were measured in this worktree on 2026-10-06; implementation status is retained from the document and is not a fresh product-runtime validation.

| 项目 / Item | 实测值或记录值 / Measured or recorded value |
| --- | --- |
| 子目录（递归）/ Subdirectories (recursive) | 0 |
| Markdown 文档（递归，含本页）/ Markdown documents (recursive, including this page) | 1 |
| 实现状态 / Implementation status | `EXISTING_IMPLEMENTATION_ON_HOLD_NOT_PRODUCTION_QUALIFIED` |
| 本轮验证范围 / Validation scope | 文档、导航与语言配对；运行时未重测 / Documents, navigation and language pairing; runtime not retested |

### 导航 / Navigation

- [上级区说明 / Parent district](../README.md)
- 本页含完整英文及中文说明。 / This page contains complete English and Chinese explanations.
