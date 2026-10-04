# Research Priority and Evidence Collection Strategy — 2026-10-05

> Status: **ACTIVE RESEARCH STRATEGY / LITERATURE-SNAPSHOT-BOUND**
>
> Goal: reverse-audit City research directions so mature engineering practice is not mistaken for novelty and scarce natural development evidence is not wasted on already crowded topics.  
> These grades reflect public work visible by 2026-10-05 and may change.

## 1. Four scarcity grades

### G1 — Mature / well understood

Classic software-engineering practice or a well-established research problem.

Policy:

- no research-only instrumentation;
- retain only when it causes a real defect/rework/agent failure;
- use as background, control, failure cause, or prerequisite;
- never present as primary novelty.

Examples:

- mutable branches/tags imply critical versions should use exact immutable identity;
- vertical slice / walking skeleton itself;
- generic requirements-to-code traceability;
- ordinary version control, branch/merge, and CI fundamentals.

### G2 — Hot and crowded

Important topics with many 2026 papers/benchmarks/tools already arriving.

Policy:

- collect normal evidence without distorting development;
- prioritize intersections with City-specific G3/G4 questions;
- do not make a single threshold/generic-memory/generic-false-success result the main bet.

Examples:

- context compaction timing;
- compaction content / memory compression;
- generic execution-state memory;
- generic false-success / completion transparency;
- generic evolving requirements / interactive coding;
- generic asynchronous multi-agent coordination;
- generic cross-model review.

Representative 2026 work includes Ledger, MAGE/FlowState, AutoCompact, SWE-INTERACT, CAID, AsynCodeBench, Failure-Transparent Agents, and Cross-Model LLM Code Review.

### G3 — Clear phenomenon, sparse direct study

Adjacent work exists, but samples are small, definitions are unsettled, or the City setting is materially richer.

Policy:

- **priority evidence capture**;
- preserve full defect/recovery chains when observed;
- bind exact identity, timeline, Owner intervention, task transitions, and cross-agent/host changes;
- prefer later controlled replay/ablation.

Priority topics:

1. **Repository-resident executable work artifacts**
   - beyond a plan document: claimable, reviewable, resumable, evidence-bound work state;
   - the 2026 Agent Plans study screened 36,710 repos and found only 85 plan files in 10 repos.

2. **Exact execution identity + provenance + freshness**
   - SHA/dependency ancestry/CI-review-evidence binding;
   - identity degradation across compaction/resume/handoff;
   - Evidence Pointer Mismatch.

3. **Structured handoff beyond summary**
   - Handoff Debt already shows structured context helps, so “handoff helps” is not novel;
   - focus on recovery of exact SHA, role eligibility, dependency truth, evidence provenance, and next eligible action.

4. **Dynamic asynchronous liveness semantics**
   - TEMPORARILY_UNCLAIMABLE vs STRUCTURALLY_INELIGIBLE vs GLOBAL_EXTERNAL_BLOCK vs POOL_TERMINAL;
   - event wake-up + bounded fallback re-scan;
   - waiting does not occupy a host / no-idle;
   - re-entry when role eligibility changes.
   - CAID/AsynCodeBench study asynchronous dependencies, but these liveness/wake semantics remain relatively sparse.

5. **Independent review as a state/evidence boundary**
   - not merely whether a second model improves code;
   - whether an independent reviewer reconstructs state, verifies exact head, and detects user/runtime defects outside the author path.

6. **Registry-assisted agent onboarding / localization**
   - whether Capability Registry reduces repository exploration, duplicate implementation, ownership mistakes, and UI-entry search;
   - repository exploration is studied, but semantic capability → implementation → surface maps remain sparse.

7. **Naturalistic Owner intervention taxonomy**
   - why the Owner must return;
   - whether intervention is caused by state loss, wrong completion, intent mismatch, eligibility deadlock, exposure gap, etc.;
   - real interaction datasets study corrections/pushback, but continuous project-level intervention dynamics remain limited.

## 2. G4 — Very few complete cases / system studies

G4 does **not** mean guaranteed first-ever novelty. It means the complete formulation/system evidence appears rare in the current literature and deserves maximum bounded evidence retention.

### G4-A — Unified Repository Control Plane for Long-Horizon Agentic SWE

```text
repo-resident MissionBook
+ claim/role eligibility
+ exact immutable baseline
+ independent review
+ evidence-bound acceptance
+ resume/handoff
+ dynamic wake/liveness
+ Capability Registry
+ user-reachable state
```

Individual components have adjacent work; the full repository-native SWE control-plane formulation remains rare.

Capture:

- which real failure caused each rule;
- before/after Owner intervention, duplicate work, false completion, and wrong evidence;
- cross-model/host/session continuity;
- interactions among rules.

### G4-B — Capability State Across Code → Wiring → Reachability → Intent

```text
implementation
→ backend wiring
→ user reachability
→ intent validation
```

bound to:

```text
semantic CAP id
→ code symbols/paths
→ exact SHA
→ user surface
→ exposed information
→ controls
→ E2E evidence
```

Generic traceability is mature; an agent-readable live registry that includes runtime/user-surface reachability and intent correctness appears rare.

### G4-C — Autonomy Survival in Real Project Work

Observe:

```text
autonomous start
→ task transitions
→ compaction/resume/handoff/wait
→ first required Owner intervention
```

Candidate metrics:

- Time/Steps to Owner Intervention;
- Autonomous Task Transitions;
- Intervention-Free Survival Curve;
- cause-specific intervention hazard;
- task-pool drain before intervention.

Human-in-the-loop benchmarks and real-session pushback datasets exist, but continuous project-level autonomy-survival measurement remains rare.

### G4-D — Control-Plane Reality Drift Across Multiple Truth Surfaces

Study drift among:

```text
Mission Book claimed state
Capability Registry claimed state
Git exact state
CI/review evidence state
runtime/UI observed state
```

Questions:

- which drift most often causes a wrong next action?
- which transition requires reconciliation?
- how should authority be ordered?
- is stale but internally consistent control-plane state more dangerous than missing state?

### G4-E — User-Reachable Completion as a First-Class Agent Termination Condition

Compare terminal conditions:

```text
implementation/test terminal
vs
backend-wiring terminal
vs
user-reachable terminal
vs
intent-validated terminal
```

Focus on whether agents stop too early when internal tests are green but the normal user verb cannot be completed.

### G4-F — Passive Development-to-Research Evidence Pipeline

City observes normal engineering rather than fabricating benchmark tasks:

```text
failure
→ repair
→ exact evidence
→ review disagreement
→ owner intervention
→ runtime acceptance
→ research index
```

Change2Task and related work reconstruct executable tasks from repository history; it is less common to instrument real agentic development from the start with a bounded research-observability contract.

Study:

- instrumentation burden;
- longitudinal dataset quality;
- what state is preserved that post-hoc Git/PR mining cannot recover.

## 3. Deprioritized standalone topics

| Topic | Priority | Reason |
|---|---|---|
| branch → SHA itself | G1 | mature engineering |
| vertical slice itself | G1 | classic SE |
| generic traceability | G1 | mature |
| compact threshold | G2 | highly crowded |
| generic compaction summary | G2 | highly crowded |
| generic execution memory | G2 | crowded in 2026 |
| generic false completion | G2 | rapidly growing literature |
| generic handoff notes | G2/G3 | Handoff Debt exists |
| generic async multi-agent | G2 | CAID + AsynCodeBench |
| generic cross-model review | G2 | direct 2026 studies |
| evolving user requirements | G2 | SWE-INTERACT etc. |

## 4. Evidence budget

### G1 — MINIMAL
Only concrete failure, cause, repair, and exact evidence.

### G2 — STANDARD
Normal telemetry; upgrade only when intersecting G3/G4.

### G3 — PRIORITY
Prefer before/after, exact SHA/run ids, timeline, Owner intervention, model/harness, handoff/resume, quantitative deltas, independent review, and research refs.

### G4 — MAXIMUM_BOUNDED
G3 plus authority surfaces, state transitions, conflicting truths, event order, wake/eligibility changes, user path, exact evidence bindings, control-plane rule version, and ablation opportunities.

Never retain hidden chain-of-thought or unbounded raw logs.

## 5. Paper-story priority

### Primary

> **Reliable long-horizon coding requires a persistent software-engineering control plane, not merely a capable model or larger context.**

Key variables:

- durable work state;
- exact execution identity;
- evidence provenance;
- dynamic liveness;
- user-reachable capability state;
- human intervention.

### Secondary

- Capability Exposure / Registry;
- autonomy survival;
- cross-session/multi-agent continuity;
- control-plane reality drift.

### Supporting stressors

- compaction;
- model switch;
- branch movement;
- CI wait;
- handoff;
- external blockers;
- evolving requirements.

These are stressors/conditions, not assumed primary novelty.

## 6. Literature snapshot anchors

Track at minimum:

- Agent Plans: arXiv:2608.04661
- Ledger: arXiv:2608.00808
- Handoff Debt: arXiv:2606.02875
- CAID: arXiv:2603.21489
- AsynCodeBench: arXiv:2609.32662
- SWE-INTERACT: arXiv:2606.30573
- SWE-Milestone (ICML 2026)
- Failure-Transparent Agents: arXiv:2609.35732
- Cross-Model LLM Code Review: arXiv:2607.21656
- Building to the Test: arXiv:2606.28430
- Change2Task: arXiv:2607.28591
- CentaurEval (ICML 2026)

Re-run literature search before any submission. G3/G4 is a collection priority, not a permanent novelty claim.
