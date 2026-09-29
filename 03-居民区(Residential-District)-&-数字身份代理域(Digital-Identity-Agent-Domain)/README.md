# 居民区 Residential District — 数字身份代理域 Digital Identity / Agent Domain

```text
REVIEW_METHOD = PROJECT_FIRST_DECOMPOSITION
SOURCE_PROJECT = zhiheng-zhang-Mera/Digital-Me
PROJECT_REVIEW = RECORDED_2026_09_29
```

## Why Digital-Me exists

Digital-Me was originally planned as a **“second me”** that could represent the Owner in an online interview or meeting while remaining bounded by what the Owner actually knows, has done, and is entitled to claim.

The original design was broader than a single chatbot or avatar. It combined:

- identity and Owner profile;
- knowledge/evidence grounding from public GitHub and authorized private repositories;
- real capability boundaries and honest refusal;
- Owner language habits, wording and multilingual consistency;
- voice, cadence and pauses;
- facial/non-verbal behaviour and habitual movement;
- realtime speech/video interaction;
- avatar / virtual-camera / meeting delivery;
- first-run calibration and capability review;
- later Personal Academy / Learn-Practice-Verify capability assessment;
- future embodied context from cameras, wearables and environment sensors.

The current repository expresses that plan as an **Evidence-Constrained Personal Digital Twin**. Its later truthfulness architecture did not replace the original goal; it made the “second me” boundary mechanically enforceable.

## Project-first decomposition

The City mapping follows the project rather than forcing the whole repository into one building.

| Original Digital-Me function cluster | Current repository surfaces | City placement | Ownership interpretation |
|---|---|---|---|
| Owner identity / profile / semantic self | `identity`, `profile-runtime`, contracts | **03 Residential → Digital Resident Core** | Resident-owned core |
| Personal evidence and autobiographical truth boundary | `evidence`, `capability-graph`, `claim-guard` | **03 Residential → Personal Evidence & Claim Boundary** | Resident-specific evidence remains with the resident |
| Knowledge/project grounding from GitHub | `github-source`, repository analyzers/providers | **09 Planning & Knowledge → Knowledge/Evidence Intake contribution** | Generic source/retrieval capability; Digital-Me consumes it for personal evidence |
| Real capability learning / Personal Academy / Owner review | calibration, question bank, claim review, real-capability assessment branches | **03 Residential → Capability Self-Model & Calibration** | Measures “what this resident may truthfully claim”; not generic Research by default |
| Persona / wording / multilingual identity | `persona`, `language-router` | **03 Residential → Persona & Language Identity** | Resident-specific expression model |
| Pauses / pace / conversational timing | `timing` | **03 Residential → Interaction Timing** | Personal behaviour semantics stay with resident |
| Non-verbal habits / state-conditioned behaviour | `behavior` | **03 Residential → Behaviour Model** | Personal behaviour model; rendering/capture may live elsewhere |
| Dialogue planning, interruption and Owner takeover | `dialogue`, `session-runtime`, realtime runtime | **03 Residential → Resident Interaction Runtime** | Resident-local runtime semantics |
| Voice synthesis / voice-cloning provider adapters | `voice`, CosyVoice / generic TTS adapters | **11 Entertainment → Voice Presentation contribution** | 03 decides what/how the resident intends to say; 11 produces media output |
| Avatar / lip-sync / virtual audiovisual presentation | `avatar`, LiveTalking adapter, virtual-device abstraction | **11 Entertainment → Avatar / Presentation contribution** | Presentation/rendering service, not resident truth authority |
| Microphone/camera/raw embodied acquisition | perception/provider abstractions; future camera/MediaPipe/wearables | **08 Device & Edge → Sensor / Embodied Input contribution** | Device-facing acquisition belongs at the edge; 03 consumes scoped observations |
| Mock interview / future meeting participation | `apps/mock-interview`, future meeting runtime | **03 Resident application + 11 presentation + external meeting adapter** | A composition/bridge, not a new city-wide authority |
| Audit / readiness / operator control | `audit`, readiness, operator console | **03 local operational module**, with Roads to city audit/control/privacy where needed | Do not prematurely extract a generic service from one resident implementation |
| Embodied-intelligence extension | signed presence/context, attention/activity/environment contracts | **08 input → 03 semantic resident → 11 presentation**, with city orchestration outside the resident | Future cross-district composition, not evidence of implemented embodiment |

## What stays conceptually inside Residential

The stable 03-owned semantic core is:

```text
Digital Resident
├── Owner Identity / Profile
├── Personal Evidence Boundary
├── Capability Self-Model
├── Claim Guard / Reasoning Boundary
├── Persona & Language Identity
├── Interaction Timing
├── Behaviour Model
├── Calibration / Personal Academy
└── Resident Interaction Runtime / Owner Takeover
```

These capabilities answer questions such as:

- Who is this resident representing?
- What personal facts and work can it claim?
- How strong may each claim be?
- What does the Owner genuinely know or know how to do?
- How does this Owner usually phrase, pace and behave?
- When must the system decline, correct itself, or hand control back to the Owner?

## What Digital-Me contributes outside 03

Digital-Me already contains bounded implementations/adapters that belong architecturally elsewhere:

### 09 Planning & Knowledge

- GitHub evidence source/provider;
- repository/project evidence retrieval;
- generic source provenance and snapshot access.

The **resident-specific evidence graph and claim boundary do not move with them**.

### 11 Entertainment

- TTS / voice provider adapters;
- avatar rendering adapters;
- lip-sync and audiovisual presentation;
- virtual camera/audio publication;
- future meeting-facing media surfaces.

03 supplies verified resident semantics; 11 renders/publishes them.

### 08 Device & Edge

- microphone/camera acquisition;
- low-level sensor/perception providers;
- MediaPipe or equivalent physical observation adapters;
- future wearable/embodied-context inputs.

08 should expose scoped observations rather than turning raw biometrics into resident authority.

## Roads created by the actual Digital-Me decomposition

Only roads required by the existing project are recorded:

- **Knowledge / Evidence Road:** 09 → 03 — repository/world evidence into resident-specific reasoning.
- **Capability Road:** 03 ↔ City capability fabric — what the resident can expose or consume.
- **Embodied Input Road:** 08 → 03 — scoped sensory/context observations.
- **Presentation Road:** 03 → 11 — verified semantic output plus presentation intent.
- **Privacy Road:** 04 ↔ 03 — rules for personal/biometric/profile data; current enforcement may remain local until a shared service exists.
- **Control Road:** City control surface ↔ 03 — readiness, Owner takeover and resident-local controls.

## Important boundaries

1. **Digital-Me is not the City Core.** It has no independent Owner sovereignty.
2. **Repository location is not permanent city ownership.** Cross-district modules may remain physically inside Digital-Me until extraction has a real engineering benefit.
3. **Generic providers do not get to widen personal truth.** TTS, avatar, LLM, ASR and presentation layers only receive/return bounded data.
4. **Personal Academy is resident calibration first.** It should not be moved into Research merely because it contains tests/learning.
5. **Meeting/interview participation is a composition of existing modules**, not a reason to invent a separate empty “Interview District”.
6. **Owner calibration remains a real boundary.** Synthetic/mock voice/video/persona evidence cannot be promoted into a claim of real Owner similarity.

## Current project status

Current Digital-Me implementation is foundation-complete enough to demonstrate the architecture, but real Owner voice/video/persona calibration and real end-to-end meeting execution remain separate acceptance items.

The City mapping therefore records **implemented capability provenance plus future ownership boundaries**, not a claim that every original product goal is already complete.
