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
- `Codex-Boss` — project-first review pending or requires revalidation
- `Digital-City` — registry / special role
- `Digital-Me` — **PROJECT-FIRST REVIEW COMPLETED**
- `Distributed-ESP32-Health-Project` — project-first review pending or requires revalidation
- `drug-simulator` — project-first review pending or requires revalidation
- `DS-Hns` — project-first review pending or requires revalidation
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
- `Parama-Health` — project-first review pending or requires revalidation
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
