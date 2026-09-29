# Project-First City Review

## Binding strategy

Digital-City reviews **existing GitHub projects first**.

```text
Repository
  → original purpose + current implementation
  → capability clusters
  → City placement
  → required Roads
  → implementation/extraction decision
```

This replaces the previous tendency to start from an empty City module and then search for a project that could fill it.

### Rules

- A repository is not automatically a Building.
- A repository may contribute capability clusters to multiple districts.
- Architectural placement does not require immediate code movement.
- Existing project-local implementations remain valid until extraction has a concrete reuse, lifecycle, testing, security or ownership benefit.
- Empty placeholders are exceptional: create one only after reviewed repositories leave a necessary capability ownerless.
- Coursework/legacy repositories are reviewed as assets; they are not automatically admitted into active City topology.
- Utopia is a reference implementation/construction site; Digital-City remains the placement/ownership registry.

## Current GitHub repository inventory snapshot

The following repositories were visible in the project-owner GitHub inventory when this strategy was adopted. Presence in this list **does not imply City admission**.

- `301DataBaseProject` — **COURSEWORK REVIEWED — NO EXTRACTION / NOT ADMITTED**
- `Application-Plan` — **OWNER EXCLUDED / NOT ADMITTED TO CITY**
- `Auto-Game-Bot` — **PROJECT-FIRST REVIEW COMPLETED**
- `Boss-Qualification-Control` — **PROJECT-FIRST REVIEW COMPLETED**
- `C_Model_glb_coloring` — **DEPRECATED / NOT ADMITTED TO CITY**
- `C-Model-Visuliazer` — **DEPRECATED / NOT ADMITTED TO CITY**
- `CapstoneProject499-Department_Manage_System` — **COURSEWORK REVIEWED — NO EXTRACTION / NOT ADMITTED**
- `Codex-Boss` — **PROJECT-FIRST REVIEW COMPLETED**
- `Digital-City` — registry / special role
- `Digital-Me` — **PROJECT-FIRST REVIEW COMPLETED**
- `Distributed-ESP32-Health-Project` — **DEPRECATED / NOT ADMITTED TO CITY**
- `drug-simulator` — **PROJECT-FIRST REVIEW COMPLETED**
- `DS-Hns` — **PROJECT-FIRST REVIEW COMPLETED**
- `dsh-health-scheduler` — **PROJECT-FIRST REVIEW COMPLETED**
- `dsh-restart` — **PROJECT-FIRST REVIEW COMPLETED**
- `Essay-Book` — **OWNER EXCLUDED / NOT ADMITTED TO CITY**
- `Firmware_Anomoly_Noise_Detect` — **DEPRECATED / NOT ADMITTED TO CITY**
- `GDPR-app` — **SUPERSEDED BY PRIVACY LENS / NOT ADMITTED**
- `GDPR-project` — **SUPERSEDED BY PRIVACY LENS / NOT ADMITTED**
- `General-Logic-Engine` — **PROJECT-FIRST REVIEW COMPLETED**
- `Harness-Alien` — **OWNER EXCLUDED / NOT ADMITTED TO CITY**
- `Harness-Mega` — **OWNER EXCLUDED / NOT ADMITTED TO CITY**
- `Idea-Book` — **OWNER EXCLUDED / NOT ADMITTED TO CITY**
- `Machine-Learning-for-Health-Group-Project` — **DEPRECATED / NOT ADMITTED TO CITY**
- `ML-Quant-A-stock` — **PROJECT-FIRST REVIEW COMPLETED — FEATURE DONOR TO QUANT LAB**
- `My_VR_Glove` — **PROJECT-FIRST REVIEW COMPLETED**
- `Parama-Health` — **PROJECT-FIRST REVIEW COMPLETED**
- `Personal-trading-project-for-fun` — **SUPERSEDED BY QUANT-ULTRA / NOT ADMITTED**
- `privacy-lens-research-artifact` — **OWNER EXCLUDED / NOT ADMITTED TO CITY**
- `Quant-ultra` — **PROJECT-FIRST REVIEW COMPLETED**
- `research-overview` — **OWNER EXCLUDED / NOT ADMITTED TO CITY**
- `Task-Board` — **OWNER EXCLUDED / NOT ADMITTED TO CITY**
- `utopia` — reference implementation / special role

## Explicit project exclusions

The following repositories are Owner-declared deprecated and **not admitted into active Digital-City topology**:

- `Machine-Learning-for-Health-Group-Project`
- `Distributed-ESP32-Health-Project`
- `Firmware_Anomoly_Noise_Detect`
- `C-Model-Visuliazer`
- `C_Model_glb_coloring`

They receive no Building/Room/Road ownership and are not used as donor candidates unless the Owner explicitly reactivates them later.

## Completed project review: Digital-Me

Digital-Me was reviewed from its original product intent rather than from the existing 03 district shape.

### Historical functional clusters recovered

1. Identity / Owner profile.
2. Evidence, GitHub grounding and truthful knowledge boundary.
3. Capability graph, Claim Guard and unknown/refusal semantics.
4. Personal Academy / Learn-Practice-Verify / real capability assessment.
5. Persona, wording and multilingual identity consistency.
6. Voice, prosody, cadence and pauses.
7. Facial/non-verbal behaviour and habitual movement.
8. Realtime speech/video interaction, interruption and Owner takeover.
9. Avatar, virtual camera/audio and meeting/interview presentation.
10. Calibration, readiness, audit and operator control.
11. Future embodied context from cameras, wearables and environment sensors.

### City result

- **03 Residential — primary semantic ownership:** identity, personal evidence/capability boundary, claim guard, persona/language identity, timing/behaviour, calibration/Personal Academy, resident runtime.
- **09 Planning & Knowledge — contribution:** generic GitHub/repository evidence intake and source provenance.
- **11 Entertainment — contribution:** TTS/voice adapters, avatar/lip-sync, virtual audiovisual presentation.
- **08 Device & Edge — contribution/future adapter:** microphone/camera/sensor acquisition and embodied-context providers.
- **04 / 00 integration remains Roads first:** privacy/control/audit integration is recorded as interfaces; no generic service is extracted merely because Digital-Me has a local implementation.

The detailed decomposition is recorded in the 03 Residential README and `CITY_MANIFEST.yaml`.

## Project inventory status

```text
PROJECT_INVENTORY_REVIEW = COMPLETE
NEXT_PHASE = CITY_CAPABILITY_GAP_REVIEW
```

All repositories in the adopted inventory have now been classified as one of:

- admitted/project-first reviewed;
- special City/Utopia role;
- owner-excluded;
- deprecated;
- superseded;
- coursework reviewed with no worthwhile extraction.

The default review direction may now change from **repository → City** to **City capability gaps → decide whether a new project/module is actually necessary**.


## Completed project review: Codex-Boss

**Snapshot:** `8df428eaa437a409368401e95194e40266b83080`

Codex-Boss is a multi-district source project whose **primary identity** is City authority + global orchestration.

- **00/01 Core — PRIMARY:** Root Authority/Trust, global task/runtime state, orchestration/routing, durable control primitives.
- **00/03 Capability Fabric — PRIMARY/DONOR:** capability/provider registry/broker, provider contracts, health/discovery.
- **00/05 Control Centre — CONTRIBUTION:** Chat/Work, WorkBook, Provider Manager, Owner Dashboard, Research/Engineering control.
- **01 Governance — CONTRIBUTION:** admission/permission contracts and runtime enforcement.
- **02 Engineering — CONTRIBUTION TO UNION:** goal loop, repo/world inspection, review, verification, CI repair, acceptance, checkpoint/recovery.
- **06 Research — MAJOR:** protocol→literature→experiment→statistics→evidence/citations→manuscript→LaTeX/PDF.
- **09 Knowledge — CONTRIBUTION:** knowledge/retrieval governance and document ingestion/readers.
- **10 Automation — CONTRIBUTION TO UNION:** semantic Computer Use, DOM/UIA/structured/vision, workspace permission gates.
- **11 Entertainment — CONTRIBUTION TO UNION:** theme intent, deterministic generation and visual verification.

## Completed project review: DS-Hns

**Snapshot:** `eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`

DS-Hns's **primary identity** is Engineering orchestration + execution platform.

- **02/01 Project Foreman — PRIMARY:** Engineering planning/DAG, supervision, scheduling, mutation coordination, verification/recovery/evidence.
- **02/02 Worker Gateway — PRIMARY:** provider/runtime adapters, worker/task contracts, worker pools/worktrees, skills/provider integration.
- **00/03 Capability Fabric — DONOR:** reusable plugin/capability lifecycle, dependency/fallback, health, compatibility and lockfile mechanics; not city-global truth itself.
- **01 Customs — DONOR:** plugin manifest/install/compat/lifecycle validation.
- **10 Automation — CONTRIBUTION TO UNION:** generic Computer Use contract/controllers/drivers/safety/recovery/verification.
- **11 Entertainment — MAJOR DONOR:** Theme Engine package/runtime/designer/assets/validation/lifecycle.
- **Host Health / Restart — INTEGRATOR, NOT OWNER:** `dsh-health-scheduler` and `dsh-restart` remain independent projects.

Hns-local `app/core`, DSH shell integration, DeepSeek-specific updater/auth, billing/notifications/settings stay project-local unless later reuse proves a City owner.

## Boss/Hns overlap policy

Same-semantics overlaps are mapped as a **functional union**, not a winner:

1. Engineering Runtime;
2. Capability & Extension Platform;
3. Computer Use Runtime;
4. Theme Engine.

See `COMPOSITE_UNIONS.md`.


## Completed project review: Parama-Health

**Snapshot:** `e4b545b12d094032a72dab9fb72ec29e85861a8f`  
**Implementation state:** `PRE_ALPHA_PARTIAL_IMPLEMENTATION`

### Project identity

Parama-Health is the personal physiological-state / longitudinal energy-flow platform for 05 Health.

Its intended functional clusters are:

1. Personal Context / time-consistent subject snapshot.
2. Observation Layer with source/time/confidence.
3. Body-state/trend estimation.
4. Activity/exercise estimation.
5. Sleep/recovery context.
6. Exposure/context modifiers.
7. Energy-flow ledger.
8. Baseline/lab calibration.
9. State estimation/reconciliation.
10. Context resolver.

### Honest current implementation

Only a small starter is runtime code today:

- typed/frozen observation record;
- timezone/source/confidence validation;
- body-weight observation type;
- descriptive weight-trend estimate;
- fail-closed sparse/time-range behavior;
- `OBSERVATION_ONLY` status.

The remaining module directories are **target architecture/documentation, not implemented health models**.

### City placement

- **05/01 Integrated Health Hospital — PRIMARY.**
- Raw wearable/device acquisition remains an **08 Device & Edge boundary**, not a Parama ownership claim.
- Health-data privacy/consent rules connect to **04 Legal & Privacy**.
- PersonalContext in this project means **health subject state**, not 03 resident identity.

## Completed project review: drug-simulator

**Snapshot:** `23cbe9b8a416bc1023bd3ddf9e3bfd1629e05c9a`  
**Implementation state:** `DESIGN_ONLY_EXISTING_PROJECT`

### Project identity

Drug Simulator is an evidence-governed mechanistic pharmacology simulator for fixed user-supplied compounds/regimens.

The designed functional clusters are:

1. input/canonicalization;
2. physiological baseline;
3. administration/regimen timeline;
4. PK/ADME + effective exposure;
5. PK drug-drug interactions;
6. PD targets/pathways;
7. physiological endpoints;
8. adverse-effect attribution;
9. monotherapy vs combination comparison;
10. pharmacology evidence graph/governance;
11. parameter/model/evidence uncertainty;
12. reporting and overlapping validation forest.

### Honest current implementation

The repository currently contains design documents only (`README.md`, `idea-structure.md`). There is no runtime simulator code, so the City state is **design-only**, not partial implementation.

### City placement

- **05/02 Pharmacology Simulation Centre — PRIMARY.**
- Pharmacology evidence/PK/PD knowledge remains Health-domain knowledge even if general evidence tooling may later be shared.
- The project’s “Research OS” relationship is methodological; it does not move the pharmacology domain kernel into 06 Research.

## Parama ↔ Drug Simulator relationship

These are **not a composite union**.

```text
Parama PersonalContextSnapshot
        ↓ physiological-baseline projection
Drug Simulator PK/PD/DDI
        ↓ exposure / mechanism / endpoint / uncertainty
Parama Exposure Context + State Estimator
```

Parama owns longitudinal whole-body state/context. Drug Simulator owns drug-mechanism simulation. Similar words such as “physiology”, “exposure” and “uncertainty” occur at different abstraction layers.


## Completed project review: Quant-ultra

**Snapshot:** `1988d9a8530da91a8158de864d098ea869098923`  
**Repository state:** `EXISTING_IMPLEMENTATION_ON_HOLD_NOT_PRODUCTION_QUALIFIED`

### Project identity

Quant-ultra is a Finance-domain quantitative research/backtest/portfolio/MLOps pipeline. The current `Quant-4` tree has an executable nine-phase orchestrated implementation with schema-checked dependencies and cached/resumable phase outputs.

### Current capability decomposition

1. **Phase 1 — Market Data Foundation:** universe/screening, return/trading-status foundation, survivor-bias/PIT support, ADV/AUM inputs.
2. **Phase 2 — Temporal Slicing & Validation:** train/validation/test slicing, embargo and temporal validation.
3. **Phase 3 — PIT / Regime / Features:** point-in-time setup, data guards, regime state and feature construction.
4. **Phase 4 — Labels & Weighting:** classification/regression labels, borrow-related context and sample weighting.
5. **Phase 5 — Model Training & Calibration:** CV, feature handling, fitting, quantile models and calibration.
6. **Phase 6 — Portfolio Construction:** directional filtering, Black-Litterman fusion, uncertainty-aware convex position sizing.
7. **Phase 7 — FSM Backtest / Execution Simulation:** holdings/cash state, execution costs, market constraints, risk guards and reconciliation.
8. **Phase 8 — Audit & Stress:** DSR, coverage checks, stress tests and capacity audit with veto semantics.
9. **Phase 9 — Shadow MLOps:** shadow reconciliation, distribution-drift/PSI monitoring, telemetry and tiered model-update state.

### Honest implementation boundary

The codebase is real, but this review does **not** promote it to production trading:

- README explicitly says the project is on hold;
- data-source truth/stability remains an open concern in the project's own work log;
- cache/model-refresh behavior is also flagged for review;
- Phase 9 contains production-oriented interfaces and shadow/reconciliation logic, but the City does not infer a verified real-broker deployment from those code paths;
- planned Phase 10 visual reports and Phase 11 local-LLM explanation are not implemented current capabilities.

### City placement

- **07/01 Quant Lab — PRIMARY ownership.**
- 06 Research may use Quant as a domain kernel/experiment target through a Road, but does not own its market/portfolio/backtest semantics.
- Market data remains Finance-domain data rather than being moved to 09 merely because it is data ingestion.
- Trading/backtest/MLOps execution remains 07 rather than 10 merely because it is automated.

This project is unusually self-contained: unlike Boss/Hns, most of its useful capabilities remain inside one domain building.


## Owner-excluded repositories (2026-09-29)

The following repositories remain outside active City topology by explicit Owner decision:

- `privacy-lens-research-artifact`
- `Idea-Book`
- `Task-Board`
- `Application-Plan`
- `research-overview`
- `Essay-Book`
- `Harness-Alien`
- `Harness-Mega`

They receive no active Building/Room/Road/donor ownership. Their GitHub history may still exist outside Digital-City.

## Completed project review: Boss-Qualification-Control

**Snapshot:** `24bf31e7beee5adb0e94e6496a7114769b3b21f4`  
**Placement:** 01/03 Qualification Control Plane.

A private qualification control plane that isolates the real self-hosted soak runner from public Codex-Boss workflows. It binds qualification to an immutable Boss `main` SHA, requires Owner approval through the protected environment, runs the real qualification chain, and exports redacted attestation/provenance only. It is not a Boss development surface and does not own Root Authority.

## Completed project review: dsh-health-scheduler

**Snapshot:** `985e2b7389330db4b32ea2946e3657746c64b47b`  
**Placement:** 02/03 Host Health Station.

Owns telemetry ingestion/normalization, rolling history/trends, restart-pressure scoring, unknown/coverage semantics, anti-flapping policy and maintenance/safe-point scheduling. It may throttle/pause or request restart, but **never executes a restart**.

## Completed project review: dsh-restart

**Snapshot:** `e20fb6cc43e27cedf6303471e5b8ee18e1383ecd`  
**Placement:** 02/04 Restart Recovery Station.

Owns restart-request validation, lock/cooldown/dedup, checkpoint gating, checksummed tickets, graceful shutdown request, external supervisor/relaunch, crash-loop safe mode and audit records. It does not decide *whether* restart is warranted. Current review preserves two implementation limitations documented by the repo: no bounded WAITING_FOR_EXIT deadline and declared-but-unused force-terminate support.

## Completed project review: General-Logic-Engine

**Snapshot:** `66e93b3351672f109dbfc5760f90316ee9163b4b`  
**State:** design baseline only.  
**Placement:** 00/05 Control Centre backend component.

Designed capabilities: typed executable entity/relation/state/event/rule/constraint/evidence graph, timeline propagation, uncertainty/evidence state, what-if branches and explanation traces. It remains a reasoning/explanation backend concept, not City authority and not a runnable cross-domain engine today.

## Completed project review: Auto-Game-Bot

**Snapshot:** `9b9a0cd9a3be944d79992b9a7870d0f631390152`  
**State:** pre-alpha starter.  
**Placement:** 10/02 Autonomous Environment Explorer.

Primary target capabilities: DISCOVER/LEARN/COMPILE/RUN lifecycle, structured world state, hybrid navigation/recovery, semantic skills, causal world model, frontier/coverage/miss-risk, verification scheduler, completion audit and evidence/cache compaction.

Current implementation is intentionally smaller: installable Python starter + guarded phase/state contract + CLI/tests. Real perception, game adapters, input control and autonomous learning are not yet implemented. It sits **above** the generic Computer Use Runtime rather than replacing it.

## Completed project review: My_VR_Glove

**Snapshot:** `0775f593daa915d8d9f393f2665d3193c289e09c`  
**Placement:** 08/01 Haptic Glove.

Existing ESP32/LucidGloves-derived firmware experiment with single-pass serial decoding, non-blocking ring-buffer I/O, high-rate servo haptics and software power-budget limiting. It is a device/firmware building, not Entertainment logic and not production-qualified hardware.

## Completed project review: ML-Quant-A-stock

**Snapshot:** `0a31783cfdf5131e2f1c2c9f5dd116af3a9c9589`  
**Placement:** 07/01 Quant Lab as **historical feature donor only**.

The old CQR/Black-Litterman/MVO pipeline is superseded by Quant-ultra. Three distinct implemented experiments are retained as donor provenance:

- `LLMTextAnalyst`: external news/text corpus → structured numeric asset views, with mock fallback;
- DP-GMM asset cohort stratification over CQR uncertainty + text views;
- experimental cohort/dissonance-derived non-diagonal Omega.

These do not create a second Finance building and remain inactive/unqualified until deliberately ported and revalidated.

## Superseded review: Personal-trading-project-for-fun

The repository is an early concept-only A-share workflow (fetch/filter/signal/ML suggested price). Quant-ultra already subsumes this scope with a substantially deeper implemented pipeline. Status: **SUPERSEDED_BY_QUANT_ULTRA_NOT_ADMITTED**.


## Reviewed coursework with no City extraction

### 301DataBaseProject

This is an undergraduate esports-data coursework repository centered on Apex Legends datasets, Jupyter analysis, processed CSVs and Tableau dashboards.

Useful skills/artifacts exist as coursework history, but the review found **no unique reusable City capability** worth extracting. Data cleaning, analytical notebooks and dashboard construction are generic and already covered by stronger runtime/research/data surfaces elsewhere.

**Decision:** `COURSEWORK_REVIEWED_NO_EXTRACTION_NOT_ADMITTED`.

### CapstoneProject499-Department_Manage_System

This is a substantial undergraduate department-management web application using React, Express, PostgreSQL, JWT authentication, CRUD services, course/service-role assignment, performance dashboards and a broad Jest/Supertest suite.

The project is complete enough to be useful as coursework evidence, but its reusable mechanisms are either:

- ordinary web-application infrastructure;
- tightly bound to department-management semantics; or
- already superseded by stronger City identity, governance, data and control-plane systems.

No capability is sufficiently unique to justify donor extraction or a City building.

**Decision:** `COURSEWORK_REVIEWED_NO_EXTRACTION_NOT_ADMITTED`.

## Superseded privacy predecessors

### GDPR-app

Essentially an empty/initial predecessor repository.

**Decision:** `SUPERSEDED_BY_PRIVACY_LENS_NOT_ADMITTED`.

### GDPR-project

A substantial historical Privacy Lens implementation/thesis repository and direct predecessor of the cleaned `privacy-lens-research-artifact`.

Because the successor artifact is explicitly Owner-excluded from Digital-City, retaining an older predecessor as a City asset would invert the lineage and create duplicate ownership.

**Decision:** `SUPERSEDED_BY_PRIVACY_LENS_NOT_ADMITTED`.

Historical GitHub evidence remains available outside the City registry; no runtime/module migration is performed.
