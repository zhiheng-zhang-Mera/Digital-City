# Integrated Health Hospital — 综合医院

```text
STATUS = PRE_ALPHA_PARTIAL_IMPLEMENTATION
PRIMARY_REPOSITORY = https://github.com/zhiheng-zhang-Mera/Parama-Health
SOURCE_SNAPSHOT = e4b545b12d094032a72dab9fb72ec29e85861a8f
DOMAIN = HEALTH
```

## Role

The Integrated Health Hospital is now backed by a real source project: **Parama-Health**.

Its long-term job is to maintain a time-aware, uncertainty-aware picture of personal physiological state from sparse consumer-grade observations and periodic calibration.

## Project rooms / capability clusters

1. **Personal Context** — time-consistent `PersonalContextSnapshot`.
2. **Observation Layer** — raw observations with source/time/confidence.
3. **Body State** — slow body-state and trend estimates.
4. **Activity Engine** — activity/exercise estimation.
5. **Sleep & Recovery** — recovery context and reliability modifiers.
6. **Exposure Modifiers** — medication/supplement/environment context at the whole-person level.
7. **Energy Flow & Ledger** — intake/absorption/loss/expenditure/storage decomposition.
8. **Baseline Calibration** — labs/DXA/high-information periodic patches.
9. **State Estimator & Reconciliation** — multi-source reconciliation and personalization.
10. **Context Resolver** — version-consistent context for downstream calculations.

## Honest implementation boundary

At snapshot `e4b545b12d094032a72dab9fb72ec29e85861a8f`, runtime code currently implements only:

- immutable Observation with kind/value/time/source/confidence;
- timezone/source/confidence validation;
- weight / resting-HR / sleep observation vocabulary;
- descriptive weight-trend estimate;
- fail-closed insufficient-data and invalid-time behavior;
- explicit `OBSERVATION_ONLY` result status.

The ten-module architecture is **not yet implemented** merely because module documentation exists.

## External boundaries

- Wearable/smart-scale/camera/device acquisition → **08 Device & Edge**.
- Health privacy/consent/retention policy → **04 Legal & Privacy**.
- Digital resident identity/persona → **03 Residential**.
- Detailed mechanistic drug PK/PD/DDI → **05/02 Pharmacology Simulation Centre**.

## Pharmacology integration

Parama may project a minimal, time-consistent physiological baseline to the Drug Simulator and consume returned exposure/mechanism/endpoint/uncertainty data as one health-context input.

It must not convert simulator output into automatic diagnosis, prescription or dosing.
