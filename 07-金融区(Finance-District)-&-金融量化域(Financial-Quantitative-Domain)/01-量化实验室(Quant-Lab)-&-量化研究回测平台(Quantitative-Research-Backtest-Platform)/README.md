# Quant Lab — 量化实验室

```text
STATUS = EXISTING_IMPLEMENTATION_ON_HOLD_NOT_PRODUCTION_QUALIFIED
REPOSITORY = https://github.com/zhiheng-zhang-Mera/Quant-ultra
SOURCE_SNAPSHOT = 1988d9a8530da91a8158de864d098ea869098923
CURRENT_IMPLEMENTATION_ROOT = Quant-4
DOMAIN = FINANCE
```

## Role

Quant Lab owns the Finance-domain pipeline from point-in-time market data through modeling, portfolio construction, backtest/risk audit and shadow MLOps.

## Current rooms / phases

### Room 1 — Market Data Foundation
- asset universe and screening;
- return/trading-status foundation;
- point-in-time/survivorship controls;
- ADV/capacity inputs and market calendars.

### Room 2 — Temporal Slicing & Validation
- train/validation/test windows;
- embargo and leakage-control logic;
- temporal split validation.

### Room 3 — PIT / Regime / Feature Engine
- point-in-time data setup;
- regime state;
- data/feature guards;
- feature construction.

### Room 4 — Label & Sample-Weight Engine
- directional/regression labels;
- sample weighting;
- borrow/short-related context where used.

### Room 5 — Model Training & Calibration
- cross-validation;
- feature/model fitting;
- directional classifier;
- quantile/CQR-style models;
- calibration and error-threshold outputs.

### Room 6 — Portfolio Construction & Position Sizing
- directional mask;
- uncertainty-aware views;
- Black-Litterman fusion;
- convex portfolio optimization and position limits.

### Room 7 — FSM Backtest & Execution Simulation
- deterministic portfolio/account state;
- execution/friction assumptions;
- holdings/cash/NAV;
- market/risk constraints;
- daily reconciliation.

### Room 8 — Audit / Stress / Capacity
- DSR-style audit;
- coverage tests;
- stress scenarios;
- capacity audit;
- veto-style release gate.

### Room 9 — Shadow MLOps & Reconciliation
- target/execution shadow reconciliation;
- drift/PSI monitoring;
- risk telemetry;
- tiered model-update state;
- local run-status artifact export.

## Honest status

The repository is real executable code, but remains explicitly **on hold** in its README.

Known limitations recorded by the project itself include data-source truth/stability review and uncertainty around cache/model-refresh behavior. Phase 9 contains production-oriented abstractions, but current City review does not establish a verified live broker deployment.

The following are future plans, not current rooms:

- Phase 10 visualized run report;
- Phase 11 local-LLM report explanation;
- C++ rewrite;
- multi-laptop distributed execution.

## Cross-district relationship

Quant Lab can be executed/evaluated by 06 Research through a domain-kernel Road. Generic Engineering/Automation may operate its software, but Finance retains ownership of market, portfolio, risk and execution semantics.
