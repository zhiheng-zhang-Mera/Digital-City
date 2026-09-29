# Finance District — 金融区 / 金融量化域

```text
STATUS = PROJECT_FIRST_REVIEWED_IMPLEMENTED
PRIMARY_REVIEWED_PROJECT = Quant-ultra
SOURCE_SNAPSHOT = 1988d9a8530da91a8158de864d098ea869098923
```

07 owns market/portfolio/trading-domain data semantics, quantitative models, portfolio construction, financial backtesting/risk simulation and finance-specific MLOps.

## Existing building

### [01 Quant Lab / 量化实验室](./01-量化实验室(Quant-Lab)-&-量化研究回测平台(Quantitative-Research-Backtest-Platform)/)

**Source:** [Quant-ultra](https://github.com/zhiheng-zhang-Mera/Quant-ultra)  
**State:** `EXISTING_IMPLEMENTATION_ON_HOLD_NOT_PRODUCTION_QUALIFIED`

The current Quant-4 implementation contains a nine-phase pipeline from market-data foundation through model training, portfolio construction, deterministic backtesting, stress/audit and shadow MLOps.

## Domain ownership rule

The following remain Finance-domain capabilities even when they use general techniques:

- market data ingestion and point-in-time market state;
- train/test temporal slicing for financial data;
- finance feature/regime models;
- return labels and financial sample weighting;
- portfolio/risk models;
- trading costs, market impact and execution-state simulation;
- finance stress/capacity/audit;
- finance shadow MLOps and drift/reconciliation.

They do **not** move to 06 Research, 09 Knowledge or 10 Automation merely because they involve experiments, data or automation.

## Research relationship

06 Research may call Quant Lab as a domain kernel / experimental subject:

```text
06 Research workflow
   ↓ protocol / experiment / evidence evaluation
07 Quant Lab
   ↓ finance-domain computation
results/evidence
   ↑
06 Research
```

The Road allows experimentation without transferring Finance ownership.

## Boundary

This City mapping does not claim verified production brokerage deployment, investment performance or trading readiness. Quant-ultra remains an on-hold research/engineering implementation until separately qualified.
