# Medical / Health District — 医疗健康区

```text
STATUS = PROJECT_FIRST_PARTIAL_IMPLEMENTED
REVIEWED_PROJECTS = Parama-Health + drug-simulator
PENDING_PROJECTS = NONE_FROM_PREVIOUS_HEALTH_COURSEWORK_SET
```

05 owns health-domain interpretation, longitudinal physiological state, health estimation and domain-specific simulation.

## Reviewed buildings

### 01 Integrated Health Hospital / 综合医院
[Open building](./01-综合医院(Integrated-Health-Hospital)-&-综合健康服务平台(Integrated-Health-Service-Platform)/)

**Primary source:** [Parama-Health](https://github.com/zhiheng-zhang-Mera/Parama-Health)  
**State:** `PRE_ALPHA_PARTIAL_IMPLEMENTATION`

This is the longitudinal whole-person health-state platform: observations, personal health context, body/activity/sleep state, energy flow, calibration and reconciliation.

### 02 Pharmacology Simulation Centre / 药理模拟中心
[Open building](./02-药理模拟中心(Pharmacology-Simulation-Centre)-&-机制药理模拟服务(Mechanistic-Pharmacology-Simulation-Service)/)

**Source:** [drug-simulator](https://github.com/zhiheng-zhang-Mera/drug-simulator)  
**State:** `DESIGN_ONLY_EXISTING_PROJECT`

Owns the planned mechanistic PK/PD/DDI simulation boundary.

## Relationship between the two

These are complementary services, not duplicate implementations:

```text
Parama longitudinal state/context
   │
   └─ Health Context Road
          ↓
   Drug Simulator physiological baseline
          ↓
   PK / ADME / DDI / PD / endpoints
          ↓
   exposure + mechanism + AE + uncertainty
          │
          └─ Pharmacology Result Road
                 ↓
        Parama exposure/state context
```

The simulator must never silently turn Parama estimates into clinical truth, and Parama must not interpret simulator output as diagnosis, prescribing or automatic dosing.

## Parama capability decomposition

Target project modules:

- Personal Context / Subject State Gateway;
- Observation Layer;
- Body State & Trend;
- Activity & Exercise;
- Sleep & Recovery;
- Exposure Modifiers;
- Energy Flow & Ledger;
- Baseline/Lab Calibration;
- State Estimator & Reconciliation;
- Context Resolver.

**Current runtime reality:** only the Observation contract + descriptive weight-trend starter are implemented.

## Drug Simulator capability decomposition

- input/canonicalization;
- physiological baseline projection;
- administration/regimen timeline;
- PK/ADME + exposure;
- PK-DDI;
- PD / target / pathway;
- physiological endpoints;
- adverse effects;
- evidence governance;
- uncertainty;
- mono/combination comparison;
- reporting/validation.

**Current runtime reality:** design documents only.


## Roads

- **Device/Data Road:** 08 → Parama normalized Health observations from future/reviewed device providers.
- **Privacy Road:** 04 ↔ 05.
- **Resident Context Road:** 03 ↔ 05 only when explicitly authorized.
- **Health Context Road:** Parama → Drug Simulator physiological baseline projection.
- **Pharmacology Result Road:** Drug Simulator → Parama exposure/effect context.
- **Evidence Road:** domain evidence retains source/provenance/confidence.

## Boundary

- raw device drivers/acquisition stay in 08;
- resident identity/persona stays in 03;
- privacy policy stays in 04;
- generic Research methodology does not automatically own Health-domain models;
- Health estimates/simulations do not become diagnosis/treatment recommendations.
