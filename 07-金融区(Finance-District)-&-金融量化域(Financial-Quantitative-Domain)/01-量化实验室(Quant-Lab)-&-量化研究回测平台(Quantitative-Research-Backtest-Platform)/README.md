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
