# PCF — Enhanced Personal Compute Fabric

> PARKED / NOT ACTIVATED / DESIGN ONLY. Planning does not authorize implementation.
> Every canonical workbook has execution_enabled=false and intentionally empty execution anchors, claims and evidence. PCF is excluded from the active progress manifest and changes no running Utopia behavior.

[中文](../README.md) · [Architecture](./ARCHITECTURE.md) · [Execution contract](./EXECUTION_CONTRACT.md) · [Activation and extension](./ACTIVATION_AND_EXTENSION.md) · [Research and release](./RESEARCH_AND_RELEASE.md) · [Planned membership](../PROGRAMME_MANIFEST.json)

## Purpose

PCF extends WBC's compatible backends, descriptors and reversible profiles into an authorized, explainable, resource-aware, recoverable personal multi-device runtime. Glasses, entertainment, health and engineering assistance remain applications rather than core domain assumptions.

The initial plan contains **25 canonical workbooks: 19 CORE_V1 and 6 OPTIONAL_EXTENSION**. These are planned units, not active progress statistics. CORE_V1 uses the existing Windows workers and Android control surface; absent Linux servers, glasses or accelerators cannot prevent its acceptance. Original PCF-701–707 themes are preserved; 700 and 708–724 add missing boundaries.

## Planning provenance, not execution anchors

The design examined Digital-City `28120397450574c9274b2d75a18f4f07288baea0` and Utopia `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef` on 2026-10-06. Never copy these into a future development baseline. A contract, a unit-tested function, live wiring and physical acceptance are distinct evidence levels. PCF-700 must reconcile them again.

## Workbooks

| ID | Deliverable | Train |
|---|---|---|
| [700](./PCF-700-ownership-and-reality-audit.md) | Ownership and runtime-reality audit | Core |
| [701](./PCF-701-live-resource-telemetry.md) | Fresh, bounded live telemetry | Core |
| [702](./PCF-702-explainable-placement.md) | Explainable placement and cost estimates | Core |
| [703](./PCF-703-pipeline-offload-and-streams.md) | Staged offload and bounded streams | Core |
| [704](./PCF-704-admission-reservations-and-fairness.md) | Atomic admission, reservations and fair queues | Core |
| [705](./PCF-705-recovery-and-safe-replacement.md) | Safe recovery and re-placement | Core |
| [706](./PCF-706-policy-consent-and-data-boundaries.md) | Consent, privacy, budget and local-first policy | Core |
| [707](./PCF-707-research-trace-and-replay-adapter.md) | REX trace, replay and ablation adapter | Core |
| [708](./PCF-708-workload-envelope-and-qos.md) | Workload envelope and QoS | Core |
| [709](./PCF-709-artifact-locality-and-cache.md) | Artifact locality and bounded caches | Core |
| [710](./PCF-710-headless-execution-and-isolation.md) | Real isolated headless execution | Core |
| [711](./PCF-711-checkpoint-and-resume-contract.md) | Explicit compatible checkpoints | Core |
| [712](./PCF-712-durable-supervision-and-fencing.md) | Durable supervision and fencing | Core |
| [713](./PCF-713-interference-and-slo-protection.md) | Interference protection and cooperative degradation | Core |
| [714](./PCF-714-origin-surface-continuity.md) | Origin-surface result and control continuity | Core |
| [715](./PCF-715-resource-control-and-monitor.md) | Resource controls and monitor projection | Core |
| [716](./PCF-716-unattended-deployment-and-rollback.md) | Unattended deployment and rollback | Core |
| [717](./PCF-717-model-residency-and-serving.md) | Model residency and serving | Optional |
| [718](./PCF-718-linux-worker-onboarding.md) | Linux worker onboarding | Optional |
| [719](./PCF-719-android-edge-companion.md) | Separately authorized Android edge companion | Optional |
| [720](./PCF-720-accelerator-power-and-thermal.md) | Accelerator, power and thermal adapters | Optional |
| [721](./PCF-721-controlled-systems-study.md) | Controlled study and independent reproduction | Core |
| [722](./PCF-722-controller-continuity-and-ha.md) | Fenced controller continuity and HA | Optional |
| [723](./PCF-723-adaptive-placement-research.md) | Evidence-gated adaptive placement | Optional |
| [724](./PCF-724-multi-application-workload-pilots.md) | Multi-application concurrent pilots | Core |

PCF-790 and PCF-990 are reserved acceptance IDs, not executable merge workbooks. See the release design.

## Ordering and neighboring programmes

Start with 700, then 701/706/708. Placement, admission and data-locality work can proceed independently after their dependencies; execution, offload, checkpoints and supervision follow. Finish origin continuity, deployment, UI, pilots and the controlled study before the core release. Optional extensions have independent gates and do not expand a frozen core release.

Reuse WBC rather than replacing it. Monitor integration requires its accepted exact head but is never an execution barrier. REX owns experiment infrastructure. FR-001 owns engineering planning and review/repair; it need not wait for every optional PCF extension. URA, DGX, RIV and CHK stay parked.

Preserve STANDARD_DEVICES without a workbench, canonical task/identity/trust authority, unknown measurements, strict targeting, explicit spending and cross-device consent, Android's existing control-only role and results returning to the originating interaction. Do not claim split-brain-safe HA merely from two peers' heartbeats.

Subtasks and complexity may grow under explicit ownership, dependencies, budgets and scope revisions. A release's acceptance boundary must not grow without end.
