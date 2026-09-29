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

- `301DataBaseProject` — project-first review pending or requires revalidation
- `Application-Plan` — project-first review pending or requires revalidation
- `Auto-Game-Bot` — project-first review pending or requires revalidation
- `Boss-Qualification-Control` — project-first review pending or requires revalidation
- `C_Model_glb_coloring` — project-first review pending or requires revalidation
- `C-Model-Visuliazer` — project-first review pending or requires revalidation
- `CapstoneProject499-Department_Manage_System` — project-first review pending or requires revalidation
- `Codex-Boss` — **PROJECT-FIRST REVIEW COMPLETED**
- `Digital-City` — registry / special role
- `Digital-Me` — **PROJECT-FIRST REVIEW COMPLETED**
- `Distributed-ESP32-Health-Project` — project-first review pending or requires revalidation
- `drug-simulator` — **PROJECT-FIRST REVIEW COMPLETED**
- `DS-Hns` — **PROJECT-FIRST REVIEW COMPLETED**
- `dsh-health-scheduler` — project-first review pending or requires revalidation
- `dsh-restart` — project-first review pending or requires revalidation
- `Essay-Book` — project-first review pending or requires revalidation
- `Firmware_Anomoly_Noise_Detect` — project-first review pending or requires revalidation
- `GDPR-app` — project-first review pending or requires revalidation
- `GDPR-project` — project-first review pending or requires revalidation
- `General-Logic-Engine` — project-first review pending or requires revalidation
- `Harness-Alien` — project-first review pending or requires revalidation
- `Harness-Mega` — project-first review pending or requires revalidation
- `Idea-Book` — project-first review pending or requires revalidation
- `Machine-Learning-for-Health-Group-Project` — project-first review pending or requires revalidation
- `ML-Quant-A-stock` — project-first review pending or requires revalidation
- `My_VR_Glove` — project-first review pending or requires revalidation
- `Parama-Health` — **PROJECT-FIRST REVIEW COMPLETED**
- `Personal-trading-project-for-fun` — project-first review pending or requires revalidation
- `privacy-lens-research-artifact` — project-first review pending or requires revalidation
- `Quant-ultra` — project-first review pending or requires revalidation
- `research-overview` — project-first review pending or requires revalidation
- `Task-Board` — project-first review pending or requires revalidation
- `utopia` — reference implementation / special role

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

## Next review rule

The next discussion should begin with the **next existing repository**, inspect what that repository was actually built to do, and only then decide how its capability clusters fit into the City.

Do not start from “what should district 04 contain?” or “what module is missing?” unless every relevant existing project has already been checked.


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
