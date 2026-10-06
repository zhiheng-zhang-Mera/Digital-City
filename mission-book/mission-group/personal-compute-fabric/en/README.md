# PCF — Enhanced Personal Compute Fabric

> PARKED / NOT ACTIVATED / DESIGN ONLY. Planning does not authorize implementation.
> Every canonical workbook has execution_enabled=false and intentionally empty execution anchors, claims and evidence. PCF is excluded from the active progress manifest and changes no running Utopia behavior.

> **2026-10-07 bounded activation (owner instruction).** The owner instructed this session that the PCF series be opened and its tasks taken in sequence on a dedicated branch series. The series' own activation rules were followed: the control-plane gap was fixed first (`sync_dependency_state.py`'s ID_RE did not recognise PCF, so every PCF dependency id was invisible to the tool), the progress manifest gained an explicit one-workbook file set rather than a broad glob, the reconciler measurably touched only PCF-700 (701..728 stayed parked, not enabled, not unblocked, no anchors added), and all four accepted WBC dependency heads are already in main. **PCF-700 is therefore enabled and claimed** by Mech-DS on series branch `pcf/series-mech`, task branch `pcf/PCF-700-mech-ownership-and-reality-audit`; **the other 28 workbooks stay parked**, out of the current denominator, and gain no execution right, budget, credential or merge authority. Full receipt: [ACTIVATION_RECEIPT_2026_10_07.md](ACTIVATION_RECEIPT_2026_10_07.md); claim record: `reports/PCF-700/CLAIM_REPORT.md`.

> **2026-10-07 PCF-700 review started, author side frozen.** The opposite physical host has begun the formal review. The author's freeze and handling protocol live in `reports/PCF-700/AUTHOR_HOLD_Mech.md`: **no further commits to `pcf/PCF-700-mech-ownership-and-reality-audit` or `pcf/series-mech` until a verdict or an explicit request** (so the reviewed head stays `659ff6a`), no touching of `review_*` fields, no creating or editing the reviewer's claim or report, and no marker release; any repair happens on a NEW head while every record of the reviewed head is kept. The claim is still the reviewer's to publish (as of this line the workbook's `review_host` is null and no `review/PCF-700-*` branch exists yet).

> **2026-10-07 PCF-700 review readiness (head `659ff6aa98bc5675862b1170ed0cf5e1b78dba5f`).** The author reduced the first step of the review to **one command**: `utopia:scripts/pcf700-review-packet.mjs` re-runs the audit and compares the published record field for field (host/node metadata excluded) - eight checks, **8/8** on this host, and falsified three ways (a tampered fingerprint, a changed tier and a created candidate directory each turn it red). Usage and expected output: `reports/PCF-700/REVIEW_READINESS_MECH.md`; the review checklist and falsifiable seams: `reports/PCF-700/REVIEW_HANDOFF_Mech.md` (R0-R6, S1-S8).
>
> **Explicit request to the opposite host.** PCF-701..728 all depend on PCF-700 and PCF-701 cannot reach READY until PCF-700 is `status: COMPLETE`. The development side is closed (`development_complete: true`) and the evidence is packaged, but this host does not self-review (section 3). Please take that review; until it happens there is **no legally claimable next PCF task on this host**.

> **2026-10-07 PCF-700 increment 2 (head `f75b2a6c2fa28d183a09795c70823c775123e1ac`).** The three items specification revision 2 asked for are done and MEASURED: `docs/{zh-CN,en}/pcf/reuse-tiers.md` (five-tier check - of 49 contract directories only **4 are LIVE_WIRED**; **all 13 EM and all 9 GAI contracts are referenced by tests only, zero production references**; `rs-cross-device-return-v1` is tests-only, so the return seam has **no production proof**; `TWO_HOST_VERIFIED` and `ORIGIN_AGENT_CONSUMED` are **both empty** with the owning workbook named), `docs/{zh-CN,en}/pcf/ui-backend-matrix.md` (81 front-end files, 14 with endpoints, 49 gateway routes, **unresolved endpoints = 0**, **backend imports of the front end = 0**, single-writer bytes/lines/SHA256 published for recomputation), `scripts/pcf700-reuse-audit.mjs` + `data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json` (re-runnable machine record) and `tests/pcf700-dependency-direction.test.mjs` (D1-D4, 4/4, each one falsified). The instrument's own two bugs (19 false positives; bypassed by a side-effect import) are recorded. The review target is now `f75b2a6`.

> **2026-10-07 PCF-700 development progress.** Mech-DS delivered `docs/{zh-CN,en}/pcf/ownership-map.md` and `tests/pcf700-compatibility.test.mjs` (7/7 green) at **repair head `a2a567325e6ce08629eefbe67cda6f8f2c16fd64`**, with hosted CI run 37498638940 green on both jobs; the series branch `pcf/series-mech` is at the same head. The earlier delivery head `d611cfe` failed step `pnpm check:docs` (the repository gate `scripts/check-bilingual.mjs` read one directory level only and hit EISDIR on the nested `docs/*/pcf/` this workbook requires) - the failed head and its root cause are kept in `reports/PCF-700/DEVELOPMENT_REPORT.md` section 2.5, and the repair keeps the original semantics after being falsified (removing the en mirror, or making the fact lines differ, both exit 1). Measured: **none of the nine candidate interfaces and none of the eight shared types exists in current main** (`observeResources` and `admit` are name collisions from other domains); profile switching is LIVE_WIRED, `chooseHybridTarget` is NOT_WIRED, and the strict target is wired inside the real claim path. **Critical-path problem raised rather than excused:** PCF-701..728 all depend, directly or transitively, on PCF-700, whose `review_host` is null - the formal review must be done by the other physical host, so the series' only critical path is the opposite-host review of PCF-700. This host does not self-review and does not manufacture a dependency exception. The review handoff (`reports/PCF-700/REVIEW_HANDOFF_Mech.md`) carries the exact head, the reproducible commands, the falsifiable seams and the declared unfinished list.

[中文](../README.md) · [Architecture](ARCHITECTURE.md) · [Execution contract](EXECUTION_CONTRACT.md) · [Activation and extension](ACTIVATION_AND_EXTENSION.md) · [Research and release](RESEARCH_AND_RELEASE.md) · [Planned membership](../PROGRAMME_MANIFEST.json)

## Purpose

PCF extends WBC's compatible backends, descriptors and reversible profiles into an authorized, explainable, resource-aware, recoverable personal multi-device runtime. Glasses, entertainment, health and engineering assistance remain applications rather than core domain assumptions.

The initial plan contains **29 canonical workbooks: 23 CORE_V1 and 6 OPTIONAL_EXTENSION**. These are planned units, not active progress statistics. CORE_V1 uses the existing Windows workers and Android control surface; absent Linux servers, glasses or accelerators cannot prevent its acceptance. Original PCF-701–707 themes are preserved; 700 and 708–724 add missing boundaries.

## Planning provenance, not execution anchors

The design examined Digital-City `28120397450574c9274b2d75a18f4f07288baea0` and Utopia `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef` on 2026-10-06. Never copy these into a future development baseline. A contract, a unit-tested function, live wiring and physical acceptance are distinct evidence levels. PCF-700 must reconcile them again.

## Workbooks

| ID | Deliverable | Train |
|---|---|---|
| [700](PCF-700-ownership-and-reality-audit.md) | Ownership and runtime-reality audit | Core |
| [701](PCF-701-live-resource-telemetry.md) | Fresh, bounded live telemetry | Core |
| [702](PCF-702-explainable-placement.md) | Explainable placement and cost estimates | Core |
| [703](PCF-703-pipeline-offload-and-streams.md) | Staged offload and bounded streams | Core |
| [704](PCF-704-admission-reservations-and-fairness.md) | Atomic admission, reservations and fair queues | Core |
| [705](PCF-705-recovery-and-safe-replacement.md) | Safe recovery and re-placement | Core |
| [706](PCF-706-policy-consent-and-data-boundaries.md) | Consent, privacy, budget and local-first policy | Core |
| [707](PCF-707-research-trace-and-replay-adapter.md) | REX trace, replay and ablation adapter | Core |
| [708](PCF-708-workload-envelope-and-qos.md) | Workload envelope and QoS | Core |
| [709](PCF-709-artifact-locality-and-cache.md) | Artifact locality and bounded caches | Core |
| [710](PCF-710-headless-execution-and-isolation.md) | Real isolated headless execution | Core |
| [711](PCF-711-checkpoint-and-resume-contract.md) | Explicit compatible checkpoints | Core |
| [712](PCF-712-durable-supervision-and-fencing.md) | Durable supervision and fencing | Core |
| [713](PCF-713-interference-and-slo-protection.md) | Interference protection and cooperative degradation | Core |
| [714](PCF-714-origin-surface-continuity.md) | Origin-surface result and control continuity | Core |
| [715](PCF-715-resource-control-and-monitor.md) | Resource controls and monitor projection | Core |
| [716](PCF-716-unattended-deployment-and-rollback.md) | Unattended deployment and rollback | Core |
| [717](PCF-717-model-residency-and-serving.md) | Model residency and serving | Optional |
| [718](PCF-718-linux-worker-onboarding.md) | Linux worker onboarding | Optional |
| [719](PCF-719-android-edge-companion.md) | Separately authorized Android edge companion | Optional |
| [720](PCF-720-accelerator-power-and-thermal.md) | Accelerator, power and thermal adapters | Optional |
| [721](PCF-721-controlled-systems-study.md) | Controlled study and independent reproduction | Core |
| [722](PCF-722-controller-continuity-and-ha.md) | Fenced controller continuity and HA | Optional |
| [723](PCF-723-adaptive-placement-research.md) | Evidence-gated adaptive placement | Optional |
| [724](PCF-724-multi-application-workload-pilots.md) | Multi-application concurrent pilots | Core |

PCF-790 and PCF-990 are reserved acceptance IDs, not executable merge workbooks. See the release design.

## Ordering and neighboring programmes

Start with 700, then 701/706/708. Placement, admission and data-locality work can proceed independently after their dependencies; execution, offload, checkpoints and supervision follow. Finish origin continuity, deployment, UI, pilots and the controlled study before the core release. Optional extensions have independent gates and do not expand a frozen core release.

Reuse WBC rather than replacing it. Monitor integration requires its accepted exact head but is never an execution barrier. REX owns experiment infrastructure. FR-001 owns engineering planning and review/repair; it need not wait for every optional PCF extension. URA, DGX, RIV and CHK stay parked.

Preserve STANDARD_DEVICES without a workbench, canonical task/identity/trust authority, unknown measurements, strict targeting, explicit spending and cross-device consent, Android's existing control-only role and results returning to the originating interaction. Do not claim split-brain-safe HA merely from two peers' heartbeats.

Subtasks and complexity may grow under explicit ownership, dependencies, budgets and scope revisions. A release's acceptance boundary must not grow without end.

## Scope revision 2 / 2026-10-07 强化范围

**29 planned workbooks = 23 CORE_V1 + 6 OPTIONAL_EXTENSION; 0 activated.** 新增四书是已授权的规划增强，不是开启施工。 / Four additions are approved design work, not runtime activation.

| ID | Work | Scope |
|---|---|---|
| [PCF-725](PCF-725-execution-provider-contract-and-boundaries.md) | Execution provider contract and lifecycle boundaries | CORE_V1 / PARKED |
| [PCF-726](PCF-726-execution-capsule-and-result-evidence.md) | Execution capsule and result/evidence envelope | CORE_V1 / PARKED |
| [PCF-727](PCF-727-engineering-connector-live-execution.md) | Live engineering connector execution and acceptance | CORE_V1 / PARKED |
| [PCF-728](PCF-728-originating-agent-remote-job-bridge.md) | Originating-agent remote-job and result-return bridge | CORE_V1 / PARKED |

### 迁入面板 / Incoming requirement history

| Transfer | Source requirement | Destination | Remaining source scope |
|---|---|---|---|
| PCF-MIG-20261007-01 | URA-002 — Versioned execution-provider capability, permission, platform, command and namespace manifest | PCF-725 | Citywide App taxonomy, App lifecycle and non-execution business contracts |
| PCF-MIG-20261007-02 | URA-003 — Executor startup/shutdown, dependency failure, isolation, disable and rollback boundaries | PCF-725 | Citywide dependency direction and non-execution App/service boundaries |
| PCF-MIG-20261007-03 | DGX-002 — Bounded execution context and structured result/evidence exchange substrate | PCF-726 | Constitution, semantic decomposition, ProblemGraph, domain evidence rules, defence and adjudication |
| PCF-MIG-20261007-04 | FR-001 — Real engineering connector launch/bind/submit/events/control/result/health acceptance | PCF-727 | Engineering goal planning, Review-to-Repair, escalation and merge decisions |
| PCF-MIG-20261007-05 | FR-001 — Originating agent/session bridge for remote submission and structured result consumption | PCF-728 | Business synthesis decisions and the complete autonomous Foreman control loop |
| PCF-MIG-20261007-06 | FR-001 — Execution-side supervision, wakeup, receipt consumption and canonical reconciliation | PCF-712 | Git/Mission Book/CI goal observation, next-job selection and Review-to-Repair |
| PCF-MIG-20261007-07 | FR-001 — Execution supply, explainable placement, atomic admission and reservations | PCF-702, PCF-704 | Engineering priority, review role/qualification demands and optional-platform business topology |

[Migration history](MIGRATION_HISTORY.md) · [Machine-readable transfers](../MIGRATION_MANIFEST.json)

Revision2 wave order replaces the earlier recommended order: A:700→701/706/725/726→708; B:702/704/709→710/707; C:703/711/712/713→705, and727 after its accepted dependencies; D:714/715/716→728→724→721. Optional717/718/719/720/722/723 never block the engineering path. Workbook dependencies, not numbering or parent labels, govern execution.

最小工程目标 / Minimum engineering outcome: Alien-origin Codex→Mech real executor→same originating Codex session consumes result, while independent Alien work overlaps. UI-only success is insufficient. No pooled RAM/GPU, arbitrary process takeover, automatic paid API, automatic merge or full DGX/URA/RIV/FR activation is implied.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **37**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|

### 本目录说明 / Local documents

- [ACTIVATION_AND_EXTENSION.md](ACTIVATION_AND_EXTENSION.md)
- [ACTIVATION_RECEIPT_2026_10_07.md](ACTIVATION_RECEIPT_2026_10_07.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [CHILD_WORKBOOK_TEMPLATE.md](CHILD_WORKBOOK_TEMPLATE.md)
- [EXECUTION_CONTRACT.md](EXECUTION_CONTRACT.md)
- [MIGRATION_HISTORY.md](MIGRATION_HISTORY.md)
- [PCF-700-ownership-and-reality-audit.md](PCF-700-ownership-and-reality-audit.md)
- [PCF-701-live-resource-telemetry.md](PCF-701-live-resource-telemetry.md)
- [PCF-702-explainable-placement.md](PCF-702-explainable-placement.md)
- [PCF-703-pipeline-offload-and-streams.md](PCF-703-pipeline-offload-and-streams.md)
- [PCF-704-admission-reservations-and-fairness.md](PCF-704-admission-reservations-and-fairness.md)
- [PCF-705-recovery-and-safe-replacement.md](PCF-705-recovery-and-safe-replacement.md)
- [PCF-706-policy-consent-and-data-boundaries.md](PCF-706-policy-consent-and-data-boundaries.md)
- [PCF-707-research-trace-and-replay-adapter.md](PCF-707-research-trace-and-replay-adapter.md)
- [PCF-708-workload-envelope-and-qos.md](PCF-708-workload-envelope-and-qos.md)
- [PCF-709-artifact-locality-and-cache.md](PCF-709-artifact-locality-and-cache.md)
- [PCF-710-headless-execution-and-isolation.md](PCF-710-headless-execution-and-isolation.md)
- [PCF-711-checkpoint-and-resume-contract.md](PCF-711-checkpoint-and-resume-contract.md)
- [PCF-712-durable-supervision-and-fencing.md](PCF-712-durable-supervision-and-fencing.md)
- [PCF-713-interference-and-slo-protection.md](PCF-713-interference-and-slo-protection.md)
- [PCF-714-origin-surface-continuity.md](PCF-714-origin-surface-continuity.md)
- [PCF-715-resource-control-and-monitor.md](PCF-715-resource-control-and-monitor.md)
- [PCF-716-unattended-deployment-and-rollback.md](PCF-716-unattended-deployment-and-rollback.md)
- [PCF-717-model-residency-and-serving.md](PCF-717-model-residency-and-serving.md)
- [PCF-718-linux-worker-onboarding.md](PCF-718-linux-worker-onboarding.md)
- [PCF-719-android-edge-companion.md](PCF-719-android-edge-companion.md)
- [PCF-720-accelerator-power-and-thermal.md](PCF-720-accelerator-power-and-thermal.md)
- [PCF-721-controlled-systems-study.md](PCF-721-controlled-systems-study.md)
- [PCF-722-controller-continuity-and-ha.md](PCF-722-controller-continuity-and-ha.md)
- [PCF-723-adaptive-placement-research.md](PCF-723-adaptive-placement-research.md)
- [PCF-724-multi-application-workload-pilots.md](PCF-724-multi-application-workload-pilots.md)
- [PCF-725-execution-provider-contract-and-boundaries.md](PCF-725-execution-provider-contract-and-boundaries.md)
- [PCF-726-execution-capsule-and-result-evidence.md](PCF-726-execution-capsule-and-result-evidence.md)
- [PCF-727-engineering-connector-live-execution.md](PCF-727-engineering-connector-live-execution.md)
- [PCF-728-originating-agent-remote-job-bridge.md](PCF-728-originating-agent-remote-job-bridge.md)
- [RESEARCH_AND_RELEASE.md](RESEARCH_AND_RELEASE.md)

<!-- DOCUMENT_NAVIGATION:END -->

<!-- SERIES_DASHBOARD:START -->
## 任务快速面板 / Task dashboard

自动读取canonical工作书；本表不提供领取锁或额外authority。 / Generated from canonical workbooks; this table grants no claim lock or extra authority.

总完成 / Complete 1/1 · 开发 / Development 1/1 · 复检 / Review 1/1 · `COMPLETE`

| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |
|---|---|:---:|:---:|:---:|
| [PCF-700](../PCF-700-ownership-and-reality-audit.md) | COMPLETE | YES | YES | YES |

<!-- SERIES_DASHBOARD:END -->
