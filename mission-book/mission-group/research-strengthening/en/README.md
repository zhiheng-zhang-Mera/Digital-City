# Research Strengthening

> **Latest authority update:** [REX-805 formal acceptance and REX-806 claim](#rex-805-formally-accepted-rex-806-claimed--latest-reading-update) supersede older pending-review snapshots. Handset-rendered REX-805 comparison-page evidence remains NOT_OBSERVED.


> **Reading chronology:** this page retains earlier programme and candidate snapshots. The [latest REX-805 physical-development and author-handover update](#rex-805-development-handover-and-final-physical-repetition--latest-reading-snapshot) records final `0261a9e` repetition and supersedes earlier predecessor-only/no-final-observation accounts. Canonical workbooks determine current state; no earlier pending statement should be read as a newer verdict.


[中文原文与生成导航](../README.md)

> **Status: READY / ACTIVE PROGRAMME**
>
> Strengthen Utopia from a usable personal universal terminal into a **multi-device intelligent-software research testbed supporting repeatable experiments**. Rather than add an isolated feature, make existing scheduler, handoff, recovery, AI/service routing, multi-device, Rooms, Actions, Remote Fabric, and future Workbench support:
>
> ```text
> define experiment → repeat runs → automatic tracing → fault injection
> → replay → ablation → statistics → export research artifact
> ```
>
> [Persistent rules](../../../CONSTRUCTION_RULES.md) · [Async relief](../../../ASYNC_RELIEF_CONSTRUCTION.md) · [Process data](../../../PROCESS_DATA_POLICY.md) · [Research evidence](RESEARCH_EVIDENCE_PROTOCOL.md) · [Signal priorities](../../../RESEARCH_SIGNAL_WATCHLIST.yaml) · Research Institute `paper-materials/{zh-CN,en}/RESEARCH_PRIORITY_STRATEGY_2026-10-05.md` · [Control surface](RESEARCH_CONTROL_SURFACE.md)

## 0A. Current paper-focus priorities

REX v1 instrumentation no longer serves all topics equally. Default order:

```text
G4 first:
  unified repository control plane
  capability implementation→wiring→reachability→intent
  autonomy survival until Owner intervention
  control-plane reality drift

G3 second:
  user-reachable completion terminal
  passive development→research evidence pipeline
  repo-resident executable work state
  exact identity/provenance/freshness
  structured handoff with exact state
  dynamic liveness/eligibility/wake
  independent review as evidence boundary
  registry-assisted onboarding/localization
  Owner intervention taxonomy
  hierarchical risk bubbling in progressive-disclosure monitors
  edge-causal observability for handoff/retry/review/routing
  continuous observation vs event-triggered nonblocking decision
  decision escalation provenance

G2 supporting:
  context compaction
  generic execution memory
  false-success transparency
  generic async multi-agent
  cross-model review
  evolving requirements
  generic agent monitoring dashboard / topology graph / logs
```

REX-801/802 schema/trace fields prioritize G3/G4. G2 serves as stressor/control/covariate/supporting analysis. Capture G1 mature practice only for real failures. Do not distort normal product construction or invent workloads for fashionable paper topics. Refresh literature before submission; grades determine evidence budget only.

## 1. PhD-application strengthening objectives

Produce more than code: honestly support reproducible experimentation, empirical software engineering, multi-device/distributed-system evaluation, AI-agent/tool-use evaluation, fault injection/recovery/resilience, human-intervention measurement, trace replay, ablation study, and research artifact packaging.

After completion Utopia should be describable as:

> a reproducible experimental platform for studying multi-device AI-assisted software systems, with controlled workloads, fault injection, trace replay, ablation, cross-device scheduling and automated research-artifact generation.

## 2. Architecture principles

Research Fabric creates no second task truth and does not take over ordinary execution.

```text
Normal Utopia runtime
        │
        ├── canonical tasks/actions/events
        │
        └── Research & Evaluation Fabric
              ├─ Experiment Registry
              ├─ Trace / Provenance
              ├─ Scenario Runner
              ├─ Fault Injection
              ├─ Replay / Ablation
              ├─ Metrics
              └─ Artifact Export
```

Read/orchestrate existing product contracts; never duplicate scheduler, device identity, Remote Fabric, or Action truth for experiment convenience.

## 3. Programme decomposition

| ID | Work | Recorded state | Objective |
|---|---|---|---|
| [REX-801](../REX-801-experiment-manifest-and-registry.md) | Experiment Manifest + Registry | COMPLETE | Machine-readable question, topology, variables, repetitions, acceptance |
| [REX-802](../REX-802-trace-provenance-and-metrics-foundation.md) | Trace / Provenance / Metrics Foundation | COMPLETE | Unified task/action/device/provider/handoff/retry/failure/recovery/human-intervention records |
| [REX-803](../REX-803-scenario-runner-and-repetition-engine.md) | Scenario Runner + Repetition Engine | READY | Automatically execute controlled scenario × N |
| [REX-804](../REX-804-fault-injection-and-recovery-probes.md) | Fault Injection + Recovery Probes | READY | Inject node/network/provider/load/stale/duplicate faults and quantify recovery |
| [REX-805](../REX-805-trace-replay-and-ablation.md) | Trace Replay + Ablation | WAITING_DEPENDENCIES | Replay same trace, disable handoff/retry/backoff for ablation |
| [REX-806](../REX-806-metrics-analysis-and-artifact-export.md) | Metrics + Research Artifact Export | WAITING_DEPENDENCIES | Normalized datasets, tables, artifact pack, reproduction docs |
| [REX-807](../REX-807-research-control-surface-and-progressive-disclosure.md) | Research Control Surface | WAITING_DEPENDENCIES | Maximum Owner experimental control/awareness without polluting primary navigation |
| [REX-890](../REX-890-reproducibility-study-and-freeze.md) | Reproducibility Study + Freeze | WAITING_DEPENDENCIES | Two-host independent reproduction; freeze Research Fabric v1 |

REX-801/802 released accepted exact heads; REX-803/804 unlocked and may run in parallel if file ownership does not conflict. REX-805/806/807/890 retain WAITING_DEPENDENCIES under actual prerequisites. Dependency tasks use DEPENDENCY_SHA_UNION_AT_CLAIM to construct exact union baselines from accepted full SHAs; main branch name never proves inclusion. Recorded planning states coexist with later measured updates below; workbook/report remains current authority.

### REX-803 measured status (Mech, 2026-10-06)

```text
DEVELOPMENT   COMPLETE at exact a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df.
              Previous table 57d1c919 was first development head; self-found R-1/R-2 advanced it.
              Workbook development_head_sha a695bb9 is the corrected table source.
              branch rex/REX-803-mech-scenario-runner; PR #31.
PHYSICAL      Two controlled campaigns ran in real persistent City, with physical OPPO PERM00 Android
              as online control surface and local reference node executing every repetition.
              Receipt/trace/canonical-task reread evidence: utopia:evidence/raw/mission-book/REX-803/.
GATE          PARTIAL: required Alien + Mech + Android topology lacked Alien throughout.
              Last heartbeat 2026-10-05T11:15:06Z unchanged in all local measurements;
              neither counted nor claimed as gate PASS.
REVIEW        PENDING; review_host Alien (opposite physical host); marker unreleased; merge_authority=false.
AUTHOR PASS   Two self-test rounds published adoptable repair branches without moving Review target:
              repair/REX-803-mech-receipt-order-and-close @ 07e8c3c:
              filenames are random UUID identifiers, so sorted "latest" receipt list returned oldest three;
              bounded lists omitted historical total; start() after close() still began campaigns.
              probe/REX-803-mech-two-worker-rehearsal @ 42acdc6 (on preceding repair):
              two-worker rehearsal found seeded worker selection never ran: runOnce reads context?.workers
              but routes never set it; topology is context.manifest.workers. Every repeat created an
              untargeted task; assignedNodeId recorded whoever claimed first. Module comments and
              PAPER_MATERIAL_INDEX claimed the opposite. Single-worker fixtures cannot distinguish
              working selection from no selection, escaping 33 probes, author adversarial self-test,
              and one opposite-host review.
              CI push 37418750045 attempt 1 failed → attempt 2 success (both retained);
              push 37420563832 SUCCESS attempt 1.
RECOMMEND     Author recommends hardening head for the second issue: false reproducibility claims should
              not remain in Review target. No unilateral change: a prior claim collision means target
              movement must be triggered by reviewer instruction.
```

REX-803 Review independently creates workbook conditions: duplicate execution, cancellation, restart, timeout, partial campaigns, seeded reproducibility. Author tests are not Review evidence. Attack list: `reports/REX-803/DEVELOPMENT_HANDOFF.md`; reviewer may and should reject it and devise stricter probes.

### Cross-task defect: one unusable file store can prevent City startup (Mech, 2026-10-06)

After repairing its own defects, REX-803 author's self-test probed every startup file store. The failure shape still existed on main: putting a file where a directory should be made createGateway throw before binding a port.

```text
SHAPE A  file where directory expected: 6 stores
theme-packages (capability-bridge)  BRICKED EEXIST  → FIXED: 65f86f9 adopted this host's repair by content
                                                       (degrade + storeState/storeReason)
research (REX-801 registry parent) BRICKED ENOTDIR → FIXED: same adoption
research/experiments (REX-801)     BRICKED EEXIST  → FIXED: same adoption
research/campaigns / monitor / research-trace       STARTED → STARTED
RE-MEASURED 2026-10-06 on current main b06504f: the identical harness, which first reproduced the old BRICKED
             column at 213f9f9, shows all six SHAPE A stores STARTED at 4688274 and b06504f. Full table and
             attribution evidence: reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md, re-measurement section.

SHAPE B  directory where file expected: 3 stores, same on both branches
city.sqlite (canonical store)       BRICKED "unable to open database file"
                                    F-1 STILL OPEN: refusal is correct; missing diagnosable typed reason.
                                    Repair be3670b is ready on top of current main (3/3 guard probes pass).
join-requests.json (join store)     STARTED, HTTP 200, approval row created in memory but nothing persisted
                                    F-2: deliberate silent failure
execution-profile.json (WBC-604)    change() throws after memory profile already switched
                                    F-3: violates its own rule 2; third adoptable repair published
```

The v1 table claimed 8 probes, actually 6: two `relative = null` rows injected no faults; join HTTP 400 came from the probe mistakenly using `claimSecret`. This instrument defect and corrected measurements are retained together, never silently sanitized.

Complete record: two bricking instances, F-1/F-2/F-3 patterns, paired before/after, adoptable repairs, three instrument lessons in [DEFECT_RESEARCH_STORE_HARDENING.md](../../../reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md). Reproducible harness: `reports/REX-PROGRAMME/store-shape-sweep-v2.mjs`. Update (2026-10-06, Mech re-measurement): **both bricking instances are now closed on current main** - the opposite host's CEX-790 integration commit `65f86f9` adopted this host's two store-guard repairs **by content** (`registry.mjs` and `theme-artifacts.mjs` now degrade with `storeState/storeReason` and ship their guard tests), confirmed by re-running the identical harness at `213f9f9 / 4688274 / b06504f`. **Still open:** F-1 (`city.sqlite` - refusing is correct, the reason is untyped; repair `be3670b` is ready on top of current main, guard probes 3/3) and F-3 (profile half-switch; repair branch `1f2f08c` is stale and needs a rebase first). **v3 re-measurement (2026-10-06, Mech):** with the fifth instance (REX-804's fault store) swept and a new rule that a store a head does not construct must not read as a safe start, all five module-level instances are guarded on `3950d47` - the head REX-890 would deploy - where the fault store reports `STARTED-DEGRADED storeState=UNAVAILABLE reason=EEXIST`; on the deployed candidate `0261a9e` that row is `NOT EXERCISED` because it serves no fault surface. The accepted head `fe700ab` also carries a **stricter** guard than the earlier `adc075e`: with a file where the fault store belongs the City starts, the list reports the degradation, and starting a fault is refused with a typed 503 `FAULT_STORE_UNAVAILABLE`, so `690d723` no longer waits on `adc075e`. Harnesses: `reports/REX-PROGRAMME/store-shape-sweep-v3.mjs` and `fault-store-start-check.mjs`. Modules were on main and tasks REX-801/MB-008 legacy/WBC-604 closed; this host publishes only measurements, repair branches, and probes: **no merge, no main change, no closed-task record changes**.

This is also §7 paper material: repeated injection, before/after controls, reusable failure-shape scanning methodology.

### Current claimable state (Mech rescan, 2026-10-06)

Full mission-book claim-rule scan of 24 real workbooks excluding XX-000 found **0 Mech-claimable Development tasks**:

```text
READY and unclaimed                                 0
Development done, waiting opposite-host review       2 (REX-803 / MON-903; Mech authors, §3 excludes self-review)
Review claimed, waiting verdict                      2 (MON-902 Alien; REX-804 Mech NOT PASSED)
Dependencies unmet                                   5 (REX-805/806/807/890, MON-990)
Opposite host claimed but not started                1 (SHOW-401, dev=Alien)
```

REX-805 explicitly requires `REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED`, not merely REX-801/802 acceptance. Every next local step relied on Alien Review/repair or its offline node. No speculative union baseline or manufactured claimable work. This round therefore performed reusable validation/defect discovery without occupying task claims, producing the two measurements above.

Alien-codex came online at 15:12–15:18 on 2026-10-06, completed CEX-790 current-main integration PR #33 MERGEABLE with green CI, adopted two published store-guard repair branches with attribution, and claimed MON-902 Review. Its report records Owner priority: make CEX-790 mergeable first, then MON, superseding REX-before-MON; SHOW excluded. That directly authorizes Alien integration/subsequent MON, and Mech's rescan remains 0 claimable tasks.

## 4. Two-host asynchronous construction

```text
Alien Development → Mech Formal Review
Mech Development → Alien Formal Review
```

Inherit atomic claims, different physical-host Review, CI/long experiments not occupying hosts, event wake, approximately 20-minute bounded rescan, fresh critic, Review→Repair, exact-head evidence, latest-main integration, no make-work. Experimental runs do not justify idling; scan non-conflicting work during repetitions/fault campaigns/CI.

## 5. Research Fabric has no Workbench prerequisite

Alien + Mech + Android must suffice for v1. Future Workbench supplies additional experiment nodes/higher scale, not research architecture prerequisites. Inability to develop/verify basic contracts without Linux/Workbench is design failure.

## 6. User exposure

Follow global CONSTRUCTION_RULES.md Capability Exposure Gate. Experiment create/run/stop/export requires explicit direct entries; status/metrics/provenance must be observable; fault injection is high-impact advanced control, outside ordinary primary navigation but with Research/Advanced entry, risk explanation, confirmation; raw trace plumbing may be INTERNAL_ONLY with recorded decision. Do not overwhelm ordinary Utopia users. See [RESEARCH_CONTROL_SURFACE.md](RESEARCH_CONTROL_SURFACE.md).

## 7. Mandatory paper material

All REX tasks follow [RESEARCH_EVIDENCE_PROTOCOL.md](RESEARCH_EVIDENCE_PROTOCOL.md). Preserve runtime errors, test/CI failure, timeout, race, incorrect measurement, false assumption, Development/Review logic conflict, unexpected fault-campaign outcomes, failed replay, non-reproducibility, before/after metrics. Never sanitize them after repair.

## 8. Final merge lock

Do not create a final integration workbook now. REX-890 independently reproduces only after REX-801..807 all have Development complete, opposite-host Review complete, exact-head CI green, exposure decisions satisfied, and complete PAPER/RESEARCH indexes.

Programme marker: `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE`. It means reliable research-data infrastructure, not answers to every paper question.

## Current pool recheck

REX-803: Alien opposite-host Review claimed; PR37 candidate8798ba9 passes71 affected tests; physical campaign and final CI pending. REX-804: Alien adopted returned repair; PR30 candidatef4ceae7 passes12 focused tests; CI and Mech re-verification pending. REX-805/806/807/890 remain blocked on accepted dependencies. Workbook/REVIEW_REPORT are authority. SHOW excluded; no parked/new programme activation.

### REX-806 development complete; the series waits on the opposite host (2026-10-06, Mech)

> Appended by **Mech** to keep this reading view from being read as current. The canonical Chinese [Current pool recheck](../README.md#当前回查--current-pool-recheck) was corrected in the same change; this English paragraph is added rather than rewritten because the translation belongs to the other host.

REX-803 is accepted at `8798ba9`, REX-804 at `fe700ab`, and REX-805 at `0261a9e` (Mech re-verification released `TRACE_REPLAY_ABLATION_ACCEPTED`). **REX-806 development is complete** — workbook `development_complete: true`, head `3950d478e627aaa615ef69e3ac65c30da37c5ea6`, hosted CI green at that exact head (with the earlier red run at `cd4f603` retained), full local suite run, and a 10/10 fresh-clone check of the published package. The three self-checks are provenance cross-check 8/8 (recomputed from the City's raw receipts, not from the package), reproducibility 11/11 (pinning `generatedAt` and the event stream re-exports every byte, `checksums.json` included), and 0 record-consistency errors.

**The remaining half of REX-806's gate is the opposite physical host's independent read and recomputation.** §3 forbids self-review, so this host cannot stand in for it. Once that review passes and `RESEARCH_ARTIFACT_EXPORT_ACCEPTED` is released, the dependencies of REX-807 and REX-890 are satisfied. A **claim-readiness preflight for REX-807** - the dependency gate, what the claim-time union will resolve to, where each of its seven required exposure layers currently lives, and the honest size of the work - is at [reports/REX-PROGRAMME/REX-807_CLAIM_READINESS_MECH.md](../../../reports/REX-PROGRAMME/REX-807_CLAIM_READINESS_MECH.md).

The **REX-890 preflight** ([REX-890_CLAIM_READINESS_MECH.md](../../../reports/REX-PROGRAMME/REX-890_CLAIM_READINESS_MECH.md)) records a structural finding: of its minimum study's eight elements, **"one injected fault with recovery" has no ready evidence today** - the package's third exclusion says there is no fault receipt, and the resident City (candidate `0261a9e`) answers 404 for both `GET /research/faults` and `GET /research/artifacts`, since the fault controller and the export surface arrive on later heads. **"Handoff" is not expressible in this generation** (the live City reports `supportedScenarios=[WAIT]`, and `replay.mjs:55` refuses non-WAIT or fault-referencing sources with `REPLAY_CONDITION_UNAVAILABLE`); only the routing decision is covered, by placement. Three ways out and their costs - deploy and exercise, extend to v2, or a record-holder ruling - are stated in the preflight, and the choice is not this host's. No merge authority is claimed here, and the SHOW task remains excluded.

### Mech re-verification of REX-804 (2026-10-06)

> Reading translation of the newly appended [canonical programme note](../README.md). This is the historical verdict on `075ddc13`; the [current workbook](../REX-804-fault-injection-and-recovery-probes.md) remains authority. The later [author repair](../../../reports/REX-804/AUTHOR_REPAIR_Alien.md) does not itself establish opposite-host acceptance.

REX-804 re-verification finished; its verdict is recorded in [REVERIFICATION_REPORT.md](../../../reports/REX-804/REVERIFICATION_REPORT.md).

- **B1 is closed:** `faults.mjs` at f4ceae73 is byte-identical to the reviewer's published repair branch. All nine reviewer probes, including P8's B1 regression guard, pass **9/9** on both f4ceae73 and branch tip `075ddc13`.
- The red CI run at f4ceae73 was classified as **host-scheduling dependence in the author's self-test**, rather than a product regression. The two commits following adoption change tests and evidence only; the `services/apps/contracts` diff between the two heads is **empty**. Each head passed 8/8 in five consecutive local runs. The author diagnosed this and fixed it by injecting a controlled clock.
- **New blocking finding B4:** the branch **cannot merge into current main**. The tip's red PR run and green push run are explained by their baselines: push tests the old base; PR tests the merge with new main. The local merge of `origin/main b06504f`, which now includes the adopted REX-801 store-guard probes, with `075ddc13` deterministically gives **1 pass / 1 FAIL** in `tests/rex801-store-guard.test.mjs`, with `ENOTDIR ... mkdir '<runtime>/research/faults'`; main alone passes 2/2. The cause is one unguarded `mkdirSync` at `services/dev-gateway/research/faults.mjs:9`, in a controller constructed during City startup. This is **the fifth instance of the store-guard class**, and its sharpest instance: the same file's read path has already been repaired for B1, while the mkdir on that same line remains unguarded.
- **Verdict on `075ddc13`: NOT PASSED (B4).** Marker `FAULT_INJECTION_RECOVERY_ACCEPTED` remains unreleased and `review_complete` remains false in that verdict.
- Adoptable minimal repair: `repair/REX-804-mech-fault-store-guard-on-current-main` @ adc075e, comprising the merge result plus guarded construction in that one file. On the same merged result after repair, the REX-801 guards pass **2/2 in 91 ms**, compared with the original **1/1 and 34,201 ms**; all four REX-804 suites pass **19/19**. Hosted push run **37424594316 is SUCCESS, attempt 1**, with gateway-web and android green, including the previously red step.

### 当前候选交接更新 / Current candidate handoff update

REX-803 review8798ba9 exact CI全部SUCCESS，71相关测试与8独立critic探针通过；实体门槛仍NOT_RUN。常驻City实际回查确认Android/Gateway同City，Alien保存成员配置却被拒绝INSTALLATION_RETIRED，详见RESIDENT_CITY_RECHECK_Alien。REX-804 development候选fe700ab包含新main并修复Mech复验B4，19相关测试、push37424946247/PR37424951038/linkage37424951044均SUCCESS；development_complete=true，Mech对新候选的正式复验待完成。旧头075ddc1的B4 NOT_PASSED保持历史结论，不等同新头已验收。

REX-803 review8798ba9 has all exact CI runs SUCCESS,71 affected tests and8 independent critic probes passing; the physical gate remains NOT_RUN. A live recheck confirms Android/Gateway identity agreement, but Alien's saved member configuration is rejected asINSTALLATION_RETIRED. REX-804 candidatefe700ab includes new main and repairs Mech's B4 finding;19 affected tests and all three exact CI runs succeed. Development is complete for Mech's formal re-verification. The NOT_PASSED verdict on previous075ddc1 remains historical; it does not accept the new head. Canonical workbooks remain authoritative.


### Current candidate handoff update

This is a reading translation of the historical handoff update in the canonical programme page. REX-803 review candidate 8798ba9 has all exact CI runs SUCCESS, with 71 affected tests and eight independent critic probes passing; the physical gate remains NOT_RUN. A live resident-City recheck confirms Android/Gateway City identity agreement, but Alien's saved member configuration is rejected as INSTALLATION_RETIRED; see RESIDENT_CITY_RECHECK_Alien. REX-804 development candidate fe700ab contains new main and repairs Mech's B4 finding; 19 affected tests and push 37424946247 / PR 37424951038 / linkage 37424951044 all succeed. Development_complete=true; at this handoff, Mech's formal re-verification was still pending. The B4 NOT_PASSED verdict on old head 075ddc1 is historical and does not itself accept the new head. The later acceptance follows below.

### REX-804 re-verification: ACCEPTED

Reading translation of the new canonical note; full evidence is in [REVERIFICATION_REPORT.md](../../../reports/REX-804/REVERIFICATION_REPORT.md), with [complete Chinese reading translation](../../../reports/REX-804/zh-CN/REVERIFICATION_REPORT.md). The canonical workbook remains authority.

```text
ACCEPTED HEAD   fe700aba957990f93b22fd63d594ddfff7b4e243
                current main b06504f and original review target f76ccf53 are ancestors
B1  CLOSED      unreadable fault receipt prevented City startup; reviewer P8 passes on all three heads
B4  CLOSED      store-guard shape in fault controller's unguarded mkdir is repaired:
                construction degrades into storeState/storeReason, list() discloses the reason,
                injection into unavailable storage returns typed 503 FAULT_STORE_UNAVAILABLE,
                and ordinary tasks are unaffected. Criterion: rerun the formerly red probe INSIDE
                the head containing current main: rex801-store-guard 2/2 (97 ms / 51 ms,
                previously 1/1 and 34,201 ms), plus pull_request run 37424951038 terminal SUCCESS,
                which was red on 075ddc1.
CI              push 37424946247 / PR 37424951038 / linkage 37424951044
                API read independently per run: all SUCCESS attempt 1
MARKER          FAULT_INJECTION_RECOVERY_ACCEPTED released on fe700ab
SCOPE           Android native fault controls and physical/external-provider recovery remain NOT_RUN.
                DUPLICATE_EVENT recovery metric is structurally NOT_MEASURED with receipt reason;
                reviewer P6 asserts both the null and the reason.
REVIEWER TOOL   Reviewer P6 used durationMs 150 with a 350 ms sleep, handing timing to the host;
                under full load DELAY_RESULT count was 0. This is the same defect class as the
                author's fixture in the first re-verification, exposed by isolation green / load red.
                Fixed on review/REX-804-mech-review @ 53d01a3: 1200 ms window and held report promise awaited.
                Afterwards: isolated 9/9 three times, 13/13 beside three heavy browser suites,
                P6 green in full suite. Both states retained; corrected record does not erase red.
REPORT          reports/REX-804/REVERIFICATION_REPORT.md
```

<!-- SERIES_DASHBOARD:START -->
## 任务快速面板 / Task dashboard

自动读取canonical工作书；本表不提供领取锁或额外authority。 / Generated from canonical workbooks; this table grants no claim lock or extra authority.

总完成 / Complete 5/8 · 开发 / Development 6/8 · 复检 / Review 5/8 · `IN_PROGRESS`

| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |
|---|---|:---:|:---:|:---:|
| [REX-801](../REX-801-experiment-manifest-and-registry.md) | COMPLETE | YES | YES | YES |
| [REX-802](../REX-802-trace-provenance-and-metrics-foundation.md) | COMPLETE | YES | YES | YES |
| [REX-803](../REX-803-scenario-runner-and-repetition-engine.md) | COMPLETE | YES | YES | YES |
| [REX-804](../REX-804-fault-injection-and-recovery-probes.md) | COMPLETE | YES | YES | YES |
| [REX-805](../REX-805-trace-replay-and-ablation.md) | COMPLETE | YES | YES | YES |
| [REX-806](../REX-806-metrics-analysis-and-artifact-export.md) | IN_PROGRESS | YES | NO | YES |
| [REX-807](../REX-807-research-control-surface-and-progressive-disclosure.md) | WAITING_DEPENDENCIES | NO | NO | YES |
| [REX-890](../REX-890-reproducibility-study-and-freeze.md) | WAITING_DEPENDENCIES | NO | NO | YES |

<!-- SERIES_DASHBOARD:END -->


<!-- READING_MAIN_B484663:START -->
## Current pool recheck — canonical acceptance update

Reading translation of the latest [canonical programme page](../README.md). Earlier pending, disconnected, and NOT_PASSED sections in this reading copy remain dated history. Current authority is the individual canonical workbook and formal acceptance report, including any later claim state.

Alien formally accepted REX-803 at exact8798ba9 after reviewing technical rechecks and the three-end campaign raw material. SCENARIO_REPETITION_ENGINE_ACCEPTED is released; trace metadata remains PARTIAL. REX-804 is accepted at exactfe700aba. REX-805 may be claimed against accepted dependencies; REX-806/807/890 continue waiting under their workbook dependencies. SHOW is not executed; parked/new programmes are not activated. Earlier sections are dated history.

### REX-803 three-end completion gate: MET on the real City

```text
WHEN        2026-10-06T08:01Z, resident City updated to 8798ba9 with its data directory retained.
BLOCKER     The recorded measurement identified a stale manifest identity, rather than an absent opposite host:
            earlier attempts declared alien-reference-node, used on Alien on 2026-10-05 and already offline;
            the same machine was online under canonical enrolled identity
            dev-8128a1ef25c5c4b7f66fc31b21705858 (Alien-MERA-ALIANWARE).
            This generalises F8: manifests must declare identities the City ACTUALLY reports;
            remembered names become stale. The later formal acceptance below bounds the enrollment timing.
CAMPAIGN    campaign-966cf439-7017-4bb0-88e8-981e59c18322, COMPLETED (REPETITIONS_FINISHED).
            TWO_HOST_MESH: hosts/workers = [Mech dev-031fdba6…, Alien dev-8128a1ef…],
            controlSurface = Android PERM00 dev-be7832e35….
  run 0     MEASURED, placed on dev-031fdba6… (Mech), task Q-be723362-…
  run 1     MEASURED, placed on dev-8128a1ef… (Alien), task Q-f78eaee3-…;
            executed and measured on the OPPOSITE host.
  run 2     MEASURED, placed on dev-031fdba6… (Mech), task Q-697aab2c-…
  summary   planned 3 / accounted 3 / measured 3 / timedOut 0 / failed 0 /
            terminalAccountingComplete true. Each placement was predicted before running from runSeed,
            and each actual placement matched.
MATERIAL    All three canonical tasks are COMPLETED and carry researchRunRef. Research trace records
            RESEARCH_CAMPAIGN_STARTED @2026-10-06T08:00:39.601Z, storageState READY,
            completeness PARTIAL explicitly retained. Immutable receipt campaign-966cf439-…json
            persisted in <runtime>/research/campaigns/.
EVIDENCE    Published cross-host-verifiable redacted package: six data files plus index, byte-identical
            immutable receipt, trace epoch snapshot, explicit missing/dropped/clock explanations for
            PARTIAL, and derived checks recomputed from package files. Generator and second implementation
            are outside the payload in evidence-tools/.
            reports/REX-803/evidence/MATERIAL_INDEX.md (+ MATERIAL_HANDOFF_MECH.md).
            Earlier local-only JSON references D:/utopia-chat/evidence/REX-803/… also remain.
            Full record: reports/REX-803/THREE_END_GATE_MEASUREMENT.md.
NOT CLAIMED At this measurement the terminal marker was unreleased. Formal Review belongs to the opposite
            physical host; the author does not issue its verdict and only delivers evidence.
```

The three-end controlled campaign ran on the live City across Mech + Alien + Android, with all three repetitions measured, including the opposite Alien worker. Every canonical task completed with researchRunRef; the trace recorded the campaign and the immutable receipt was filed. The measurement generalised F8: the manifest must use City-reported identities instead of the stale alien-reference-node name. Its historical wording about the two-day blocker is preserved as a measurement account; the subsequent formal acceptance explicitly corrects any inference of two days of continuous enrollment.

The reviewer's blocking condition was that raw material existed only on this host's drive while a MEMBER session correctly refused Owner-scoped endpoints. The published hash-bound package under reports/REX-803/evidence/ answers that condition: redacted raw JSON, byte-identical immutable receipt, complete collector epoch containing the campaign, per-file SHA256, and missing/dropped/clock reasons for PARTIAL recomputed from the collector predicate. The generator and arithmetic independently derive each seed and placement from the package alone. At that handoff the author did not release the marker or substitute for the opposite-host verdict.

### REX-803 formal acceptance

Alien formally accepts exact8798ba9 after 38 independent material checks. All three seeds and execution-node placements align with the raw receipt, canonical tasks, and trace. PARTIAL trace metadata, the unpublished global 197-record raw window, missing provenance, and NOT_TESTED intent validation remain explicit. The fresh enrollment began at 07:29; it must not be described as continuously online for the preceding two days. See [FORMAL_ACCEPTANCE_Alien.md](../../../reports/REX-803/FORMAL_ACCEPTANCE_Alien.md).

### REX integration preflight: each product merges cleanly alone, together they do not

Waiting until after REX-803 acceptance to attempt the first integration would leave conflicts until the least convenient time. Integration was therefore measured first. Section 11 requires starting from the then-latest main; this round began at b06504f.

```text
rex/REX-804-Alien-codex-faults   -> main alone    CLEAN
rex/REX-803-mech-scenario-runner -> main alone    CLEAN
both together                                  CONFLICT x2, both in services/dev-gateway/server.mjs
```

Both conflicts are the union/superset case explicitly named in section 11. Neither side references the other: the fault controller contains no campaign, and the campaign section contains no faults. They were resolved as an explicit union and measured:

```text
integration/REX-803-804-mech-preflight @ cd43572
  focused  tests/rex803-*. + rex804-*.   34 pass / 0 fail
  full     pnpm test                    1390 pass / 3 fail
                                       (all three are resident host-city-launcher occupancy, N/N-3 baseline)
```

The rule generalises the WBC B4/F-3 rule to integration:

> A branch that merges cleanly into main on its own does not constitute evidence that several branches can merge into main together.

### Additional finding: REX-804's test rewrites the evidence it certifies

The union's full suite left the tracked tree dirty. Investigation identified a defect in the already accepted REX-804: tests/rex804-web.test.mjs:9 writes its screenshot to the committed evidence path evidence/raw/mission-book/REX-804/danger-zone.png, the exact evidence referenced by PAPER_MATERIAL_INDEX.md. On the unrepaired head the test measured 1 pass / 0 fail while git status showed that evidence rewritten, from 141809 to 139403 bytes, dependent on the runner's browser, fonts, DPI, and viewport. **Evidence that changes when it is verified is not evidence.** A green test that leaves the tree dirty also breaks the review record's premise that tracked state is clean after testing.

The repair reuses an existing correct precedent in the same programme: the analogous REX-803 test already writes to .runtime/evidence/…, ignored by .gitignore line 2. The repair branch repair/REX-804-mech-test-evidence-outside-repo @ 690d723 changes no behavior assertion. After incorporating it into the union, the merge result was measured:

```text
integration/REX-803-804-mech-preflight-with-evidence-repair @ 0492dfd
  focused  tests/rex803-*. + rex804-*.   34 pass / 0 fail, CLEAN after running
  full     pnpm test                    1390 pass / 3 fail, CLEAN after running
                                       (same 1390/3 before repair, but formerly dirty after running)
```

**A green full suite and a clean tree after the full suite are separate facts.** This host has neither REX merge authority nor an REX merge window. Both repair and union branches are verified proposals awaiting adoption. Full records: [INTEGRATION_PREFLIGHT.md](../../../reports/REX-PROGRAMME/INTEGRATION_PREFLIGHT.md) and [TEST_MUTATES_COMMITTED_EVIDENCE.md](../../../reports/REX-804/TEST_MUTATES_COMMITTED_EVIDENCE.md).
<!-- READING_MAIN_B484663:END -->


<!-- READING_ACCEPTED_PREFLIGHT_638955B:START -->
## Updated integration preflight — accepted identities (reading snapshot)

This complete translation follows the current [canonical programme page](../README.md), source SHA256 `b3b40f93f46c4d8f72421f8e81ba0bd9bfb8665d158378bb2c136c18bee9062d`. Earlier preflight measurements above remain historical and are not silently overwritten. Current task acceptance/claim state belongs to canonical workbooks; this reading page grants no execution or merge authority.

### REX integration preflight: each product merges cleanly alone, together they do not

Trying integration for the first time **only after** REX-803 acceptance would postpone conflicts until the least convenient moment. Therefore integration was measured first. §11 requires starting from the then-latest main; this round began at `b06504f`, using **accepted identities**:

```text
8798ba9 已接受 REX-803 -> main 单独                CLEAN
fe700ab 已接受 REX-804 -> main 单独                CLEAN
两者同时 / both together                          CONFLICT x2，均在 services/dev-gateway/server.mjs
```

Both accepted heads merge cleanly separately; together they produce two conflicts, both in services/dev-gateway/server.mjs. Both are the union/superset case named in §11: neither side references the other, with no campaign in the fault controller and no faults in the campaign section. They were resolved as an explicit union and measured:

```text
integration/REX-accepted-heads-mech-preflight @ 704c518   （父提交 = 两个已接受身份）
  focused  tests/rex803-*. + rex804-*.         48 pass / 0 fail（13 套件）
  full     pnpm test                          1404 pass / 3 fail / 1407（3 项为 host-city-launcher 常驻占用，N/N-3 基线）
```

The parents are the two accepted identities. Focused tests pass 48/48 across 13 suites. Full pnpm test gives 1404 passes, three failures, 1407 total; all three are resident host-city-launcher occupancy, the N/N−3 baseline.

**The first version measured the wrong head, now corrected:** it merged `rex/REX-803-mech-scenario-runner`, whose tip `a695bb9` is an ancestor of accepted `8798ba9` and **14 commits behind**. Missing commits include the very seed/placement repair `42acdc6` and receipt-order/close repair `07e8c3c`. Mechanically “merge the task branch” would integrate a head that was never accepted.

The rule generalises WBC's B4/F-3 rule to integration:

> **One branch merging into main alone is not evidence that several branches can merge into main together.**

> **“Merge the task branch” is not an integration rule.** The source must be the exact accepted commit recorded in the workbook. The historical scan statement here reports 32 workbooks, one branch tip ahead of its accepted head (JOIN-590, with the additional commit deleting evidence), three behind (MON-902/MON-903/REX-803), and one accepted head on no ref (UI-000). See `reports/INTEGRATION_SOURCE_SWEEP_MECH.md`.

That statement is translated as the canonical page's historical claim, without turning it into a new verification or modifying its facts. Later canonical corrections remain authoritative.

The first full run also had a fourth failure, `tests/relay-s1-tunnel.test.mjs:420`. It was identified as **main's own host-speed-dependent probe**: a 1000 ms window returns 429 at request 21, but the probe sends 30 requests sequentially, so a busy host can miss the window. It disappeared on rerun. The union changed no line of that test or limiter.

### Additional finding: REX-804's test rewrites the evidence it certifies

After the full union suite, tracked state was dirty. Investigation found a defect in **already accepted** REX-804: `tests/rex804-web.test.mjs:9` writes its screenshot into **committed** evidence `evidence/raw/mission-book/REX-804/danger-zone.png`, precisely the evidence referenced by PAPER_MATERIAL_INDEX.md. On the unrepaired head the test gives **one pass, zero failures** while git status shows rewritten evidence, from 141809 to 139403 bytes depending on the runner's browser, fonts, DPI and viewport. **Evidence that changes while being verified is not evidence.** A green test leaving tracked state dirty also breaks the review record's “tracked state clean after testing” premise.

The repair reuses an **existing correct precedent** in this programme: the corresponding REX-803 test writes to `.runtime/evidence/…`, ignored on .gitignore line 2. `repair/REX-804-mech-test-evidence-outside-repo @ 690d723` changes no behavior assertion. After adoption into the union, the merged result was measured:

```text
integration/REX-accepted-heads-mech-preflight-with-evidence-repair @ 56b9752
  focused  tests/rex803-*. + rex804-*.         48 pass / 0 fail，跑后 CLEAN
  full     pnpm test                          1404 pass / 3 fail / 1407，跑后 CLEAN
  （未含修复的同一个并集 @ 704c518：同样 1404/1407，但跑完后 tracked state 是脏的）
```

Focused tests pass 48/48 and full tests give 1404 passes, three failures, 1407 total; tracked state is CLEAN after both. The same union without repair at 704c518 gives the same 1404/1407, but leaves tracked state dirty.

**“Full-suite green” and “clean tree after the full suite” are separate facts.** Test results are identical in both states; only the repaired state is clean afterward. This host has no REX merge authority (`merge_authority:false`) and no REX merge window. Repair and union branches are **verified proposals awaiting adoption**. Full records: [INTEGRATION_PREFLIGHT.md](../../../reports/REX-PROGRAMME/INTEGRATION_PREFLIGHT.md), [TEST_MUTATES_COMMITTED_EVIDENCE.md](../../../reports/REX-804/TEST_MUTATES_COMMITTED_EVIDENCE.md), and [INTEGRATION_SOURCE_SWEEP_MECH.md](../../../reports/INTEGRATION_SOURCE_SWEEP_MECH.md).
<!-- READING_ACCEPTED_PREFLIGHT_638955B:END -->


<!-- READING_REX805_CANDIDATE_PREFLIGHT:START -->
### REX-805 candidate preflight and coexistence with the accepted union

Reading translation of the latest addition to the [canonical programme page](../README.md), source SHA256 `696699825dd142bca5221adc9c8727b38b05affa99942eb12a33a4ece9cb178a`. This measures a candidate, not acceptance; current workbook state remains authoritative. Earlier measurements and failures above remain historical.

**REX-805 candidate head is now included in the same measurement:** `4b39468`, **not yet accepted**. Against main it is a **fast-forward**: main is its ancestor and the candidate adds 15 commits. Against the accepted REX-803+804 union it produces one union conflict in server.mjs, resolved as an explicit union of all three contributions. `integration/REX-805-candidate-mech-preflight @ 0d8bdce` passes 67/67 focused tests and gives 1423 passes out of 1426 full-suite tests, with the three host-city-launcher failures; tracked state is CLEAN afterward.

**That fast-forward is the sharpest example of the rule requiring accepted identities as integration sources.** Integrating by branch name here would not merely add an extra commit: it would move the whole main branch onto the candidate head. A measured clean union does not accept REX-805 or grant merge authority.
<!-- READING_REX805_CANDIDATE_PREFLIGHT:END -->


<!-- READING_REX805_PHYSICAL_FINAL_1654E86:START -->
## REX-805 development handover and final physical repetition — latest reading snapshot

This is the complete reading translation of the latest physical-development-gate and author-handover sections in the [canonical programme page](../README.md), source SHA256 `e327f79b290420227e8990f0354bda74924a2a25cd5447ffc16840431fcc1e1e`. Earlier candidate, pending and predecessor-only accounts in this reading page remain dated history. The final `0261a9e` physical repetition below supersedes the predecessor-only observation gap. Current authority and completion flags belong to the [canonical REX-805 workbook](../REX-805-trace-replay-and-ablation.md); evidence of Development is not a formal opposite-host acceptance verdict.

### REX-805 physical development gate: executed on the live City

In author commit `7ad7d19`, [PHYSICAL_GATE_HANDOFF_Alien.md](../../../reports/REX-805/PHYSICAL_GATE_HANDOFF_Alien.md) delegated execution of the development gate to this host. This host followed the handover, executed the gate and returned the material.

```text
WHEN        2026-10-06  两次：作者修复前 4b39468，修复后重跑 0261a9e（常驻 City，数据目录保留，身份不变）
DEPLOY      4b39468 → pid 33420；0261a9e → pid 44088；均 → City 031fdba6-e94c-4298-a095-6ff04a65481d
            部署前常驻 City 跑旧候选 8798ba9，research/replays 404；两次部署后均 200
SOURCE      campaign-966cf439-… run 1，seed 414121415，原 worker Alien（两次同一源）
REPLAY      4b39468: campaign-4a1919b0-… 落 Alien   0261a9e: campaign-cdf39b7f-… 落 Alien
ABLATION    4b39468: campaign-bad9f272-… 落 Mech    0261a9e: campaign-481a1761-… 落 Mech
            两次均：MEASURED、controlledInputsMatch=true、differences=[]、Ablation placementChanged=true
            三个 seed 一致；全部为真实执行（真实 worker、真实 canonical task 皆 COMPLETED）
NOT CLAIMED 开发完成、验收、合并权均不主张——只把门槛材料交回作者核验
EVIDENCE    reports/REX-805/evidence/（4b39468）与 reports/REX-805/evidence-repaired/（0261a9e）
            逐文件 SHA256；三份回执为 City 字节的逐字节副本；同源回执在两个包与 REX-803 包中哈希相同
RESULT      reports/REX-805/PHYSICAL_GATE_RESULT_Mech.md
```

Full translation of the measurement record:

- **When:** two runs on 2026-10-06, before the author's repair at `4b39468` and again after repair at `0261a9e`. Both used the resident City, retained its data directory and kept device identities unchanged.
- **Deployment:** `4b39468` ran as pid 33420; `0261a9e` as pid 44088. Both pointed at City `031fdba6-e94c-4298-a095-6ff04a65481d`. Before deployment, the resident City ran old candidate `8798ba9`, where research/replays returned 404; after each deployment it returned 200.
- **Source:** campaign-966cf439-… run 1, seed 414121415, original worker Alien; both measurements use the same source.
- **Replay:** at `4b39468`, campaign-4a1919b0-… placed on Alien; at `0261a9e`, campaign-cdf39b7f-… also placed on Alien.
- **Ablation:** at `4b39468`, campaign-bad9f272-… placed on Mech; at `0261a9e`, campaign-481a1761-… also placed on Mech.
- **Both runs:** MEASURED, controlledInputsMatch=true, differences=[], and ablation placementChanged=true. The three seeds agree. All executions are real: actual workers and actual canonical tasks, all COMPLETED.
- **What the executing host does not claim:** Development completion, acceptance or merge authority. It only returns the gate material for the author to verify.
- **Evidence:** [evidence/](../../../reports/REX-805/evidence) for `4b39468` and [evidence-repaired/](../../../reports/REX-805/evidence-repaired) for `0261a9e`, with per-file SHA256. Three receipts are byte-for-byte copies of City bytes. The shared source receipt has the same hash in both packages and in the REX-803 package.
- **Result record:** [PHYSICAL_GATE_RESULT_Mech.md](../../../reports/REX-805/PHYSICAL_GATE_RESULT_Mech.md).

**The limits correction chain must remain explicit.** This host's synthetic-source instrument reported controlledInputDifferences:['limits']. The first physical run used nonempty limits and did not expose it, so this host's material index classified it as “belonging to the synthetic fixture.” The author subsequently repaired empty-limit sets at `0261a9e`, addressing the canonical difference between `{}` and null, and added regressions. That proves the defect was real and general. This host's earlier conclusion was too broad and is corrected in its result record: the synthetic fixture triggered a real defect, while the physical source did not cover that branch.

### REX-805 author handover

The latest author-delivered candidate is `0261a9ed1cec88df3ab4675623d422b37b33f270`, with three successful exact-head CI runs and an independent code re-review passing. The author independently checked predecessor `4b39468`'s physical material **63/63**. The final repair addresses null versus `{}` comparison where no extra bounds exist. The measured predecessor path with nonempty bounds remains a bounded basis for Development.

The initial handover did **not** claim observation of the final candidate's physical deployment. That was the historical predecessor-only gap at the moment of that handover, and is superseded by the final repetition below. The handover records Development **5/8**, Formal Review **4/8**, and accepted tasks **4/8**. REX-805 remains IN_PROGRESS, formal review_host is null, and its terminal marker is unreleased. See [DEVELOPMENT_HANDOFF.md](../../../reports/REX-805/DEVELOPMENT_HANDOFF.md) and [PAPER_MATERIAL_INDEX.md](../../../reports/REX-805/PAPER_MATERIAL_INDEX.md).

The earlier inference “the limits difference belongs to the synthetic fixture” is limited to that physical source with maxFailures=3. The author separately reproduced and repaired the false mismatch using a real HTTP source with no extra bounds; that inference must not be generalized to every real campaign.

**Author's subsequent update:** the final `0261a9e` physical repetition now has **63/63 raw-package checks**, plus independent reconciliation of canonical tasks through an ordinary MEMBER session. This supersedes the predecessor-only gap. Formal opposite-host Review still awaits claim and verdict. The earlier absence of final-head observation is historical, not the current physical-gate state.
<!-- READING_REX805_PHYSICAL_FINAL_1654E86:END -->


<!-- READING_REX805_ACCEPTED_REX806_CLAIM_0425630:START -->
## REX-805 formally accepted; REX-806 claimed — latest reading update

This complete reading translation follows the newly appended [canonical programme section](../README.md), source SHA256 `3069e258c1bac73b7516c4378f1f27d74d2460dab06ddbec99fa56bf6bc440c9`. The linked canonical workbooks and formal reports remain authority. Earlier REX-805 review_host=null, pending-verdict and unreleased-marker statements above are historical snapshots, superseded by the formal acceptance below. Earlier predecessor-only physical observations were already superseded by the final-head repetition. **Handset-rendered REX-805 comparison-page evidence remains NOT_OBSERVED; no MON screenshot is REX-805 evidence.**

### REX-805 formal Review: PASSED, marker released

```text
WHEN        2026-10-06，对侧主机 Mech 独立复检（作者 Alien，另一台物理主机，§3 满足）
HEAD        0261a9ed1cec88df3ab4675623d422b37b33f270
CLAIM       领取先于任何裁决发布：reports/REX-805/REVIEW_CLAIM_Mech.md
PROBES      本机自造 17 项，全部通过：13 项打常驻真实 City（跑的就是被审 head），4 项在被审 head 上进程内
  live      P1 空 limit 集源全链路（作者 0261a9e 修的分支）**被独立复现**：limits={} → 重放
              controlledInputsMatch=true、differences=[]；新 campaign/experiment/canonical task 均为新身份
            P2 同一源重放两次，9 个描述性字段完全一致
            P3 alternate-device 消融落第一个声明 worker，placementChanged 如实（源本就在该 worker 上 => false）
            P4/P4b 策略外机制、以及带消融控制的 REPLAY，均按名拒绝 ABLATION_UNSUPPORTED
            P5/P5b 未知源、越界 index 均按名拒绝
  inproc    P6 记录拓扑不在线 -> 409 REPLAY_TOPOLOGY_NOT_READY：**不可用条件确实不能被重放**
            P7 receipt store 不可用（目录位置是文件）时 **City 仍然启动并服务**，storeState=UNAVAILABLE
              reason=ENOTDIR，重放被打字化拒绝而非崩溃（store-guard 家族性质成立）
OBSERVATION store 不可用时 replay 的 POST 回 404 CAMPAIGN_UNKNOWN（源查找先于引擎的 REPLAY_STORE_UNAVAILABLE）；
            同一响应链已披露 storeState 与 reason，可区分 => 表述精度问题，**不构成缺陷**
OWN DEFECTS 第一轮 live 探针 8/13，五个失败**全是本机探针的缺陷**（等待谓词、过窄错误码、把
            「消融必然改变放置」当假设）；修正后 13/13，过程保留
VERDICT     PASSED on 0261a9e；未发现缺陷
MARKER      TRACE_REPLAY_ABLATION_ACCEPTED **已释放**，范围如实标注：真机渲染半边 NOT_OBSERVED
NOT CLAIMED 不行使任何产品 main 合并权；durationDeltaMs 不作因果性能结论
REPORT      reports/REX-805/REVIEW_REPORT.md；探针 reports/REX-805/REVIEW_PROBES_{LIVE,INPROCESS}_Mech.mjs
```

Complete translation of the Review record:

- **When and independence:** on 2026-10-06, Mech independently reviewed work developed by Alien on another physical host, satisfying §3.
- **Head:** `0261a9ed1cec88df3ab4675623d422b37b33f270`.
- **Claim:** [REVIEW_CLAIM_Mech.md](../../../reports/REX-805/REVIEW_CLAIM_Mech.md) was published before any verdict.
- **Probes:** this host built 17 probes, all passing: 13 against the real resident City running the reviewed head, four in-process at that head.
- **P1, live:** independently reproduced the empty-limit-set source branch repaired by the author at 0261a9e. A persisted limits={} source replays with controlledInputsMatch=true and differences=[]. The campaign, experiment and canonical task each receive new identities.
- **P2, live:** replaying one source twice produces agreement on all nine descriptive fields.
- **P3, live:** alternate-device ablation lands on the first declared worker and reports placementChanged honestly, including false where the source was already on that worker.
- **P4/P4b, live:** an out-of-policy mechanism and a REPLAY carrying ablation controls are both refused by name as ABLATION_UNSUPPORTED.
- **P5/P5b, live:** an unknown source and out-of-range index are refused by name.
- **P6, in-process:** recorded topology offline yields 409 REPLAY_TOPOLOGY_NOT_READY. **Unavailable conditions genuinely cannot be replayed.**
- **P7, in-process:** if a file occupies the receipt-directory path, **City still starts and serves** with storeState=UNAVAILABLE and reason=ENOTDIR. Replay receives a typed refusal instead of crashing, maintaining the store-guard family property.
- **Observation, not a defect:** with unavailable storage, replay POST returns 404 CAMPAIGN_UNKNOWN because source lookup precedes the engine's REPLAY_STORE_UNAVAILABLE check. The same response chain discloses storeState and reason, so callers can distinguish the conditions. This is wording precision, **not a defect**.
- **The reviewer's own defects:** the first live run passed 8/13. All five failures belonged to this host's probes: the waiting predicate, an overly narrow error-code expectation, and assuming ablation must always change placement. After correction, 13/13 passed; the full history is retained.
- **Verdict:** PASSED at 0261a9e; this reviewer found no defect.
- **Marker:** TRACE_REPLAY_ABLATION_ACCEPTED **released**, with the scope explicitly retaining handset rendering as NOT_OBSERVED.
- **Not claimed:** no product-main merge authority is exercised. durationDeltaMs is not a causal performance conclusion.
- **Report and probes:** [REVIEW_REPORT.md](../../../reports/REX-805/REVIEW_REPORT.md), [REVIEW_PROBES_LIVE_Mech.mjs](../../../reports/REX-805/REVIEW_PROBES_LIVE_Mech.mjs) and [REVIEW_PROBES_INPROCESS_Mech.mjs](../../../reports/REX-805/REVIEW_PROBES_INPROCESS_Mech.mjs).

Consequently **REX-805 is complete**, with workbook status:COMPLETE and review_complete:true. The main task board records Research Strengthening **5/8** and citywide **89/93**. REX-806 may proceed according to dependencies: REX-803, REX-804 and REX-805 are all accepted.

### REX-806 claim provenance

The current [canonical REX-806 workbook](../REX-806-metrics-analysis-and-artifact-export.md) records Mech's claim and IN_PROGRESS state, with claim-time evidence published in [CLAIM_REPORT.md](../../../reports/REX-806/CLAIM_REPORT.md) before product changes. This note reads that metadata without reproducing executable frontmatter or granting a new claim.

Accepted dependencies are REX-803 `8798ba9dd37051626033ad72080b2fad3ff66149`, REX-804 `fe700aba957990f93b22fd63d594ddfff7b4e243` and REX-805 `0261a9ed1cec88df3ab4675623d422b37b33f270`. Claim-time baseline `e18c5c5350d7657cf046b7ba6bbcd888dc2a1540` is their exact union, not an assumption that a main branch name proves integration. All three accepted heads are verified ancestors of that baseline. Before any REX-806 product change, dependency smoke across 17 suites passed **68/68**. The known REX-804 web-test behavior that rewrites committed danger-zone.png evidence remains recorded, with its published repair awaiting adoption; it is not silently corrected by this reading page.

REX-806 Development and Review remain incomplete in this snapshot; no development CI or acceptance marker is inferred from the claim. REX-805 handset comparison-page rendering remains **NOT_OBSERVED**, as the reconciliation record requires.
<!-- READING_REX805_ACCEPTED_REX806_CLAIM_0425630:END -->


### REX-806 development handover (2026-10-06)

The later handover binds branch `rex/REX-806-mech-metrics-and-export` at `d7aa5d7`, based on accepted dependency union `e18c5c5` (REX-803 `8798ba9`, REX-804 `fe700ab`, REX-805 `0261a9e`). Push CI `37451114057` at `94a7d24` and `37452319948` at `d7aa5d7` both succeeded on attempt 1. The local suite reports 1445 tests, 1442 passes and three resident host-city-launcher failures, with no load-sensitive failure in that run.

Eighteen probes passed (13 module and five interface probes). Two earlier interface-instrument errors—an unregistered experiment and a receipt filename outside the runner's `campaign-<uuid>.json` pattern—were corrected before the 18/18 result. The three artifact interfaces (`GET /research/artifacts[?format=csv]` and `/research/artifacts/preview?limit=N`) reject member sessions with 403 `RESEARCH_OWNER_REQUIRED`; absent sources yield 422 `ARTIFACT_NO_SOURCE`.

The published artifact contains 18 real campaigns, 24 runs and 22 measured runs. Four metrics have values; 23 remain `NOT_MEASURED` with reasons. Per-file SHA256 checks passed 10/10 in a fresh clone. The [handover](../../../reports/REX-806/DEVELOPMENT_HANDOFF.md) identifies the minimum independent recomputation set. The acceptance marker `RESEARCH_ARTIFACT_EXPORT_ACCEPTED` remains unreleased; product-main merge is not authorized.

An independent reviewer must confirm that `intervention_count` is unknown rather than zero because City records do not express Owner actions. False `placementMatchesSeedAlone` values should occur only on `replayMode=ABLATION` rows, whose policy intentionally overrides seed placement. This repair starts no review or new task.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **11**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|

### 本目录说明 / Local documents

- [RESEARCH_CONTROL_SURFACE.md](RESEARCH_CONTROL_SURFACE.md)
- [RESEARCH_EVIDENCE_PROTOCOL.md](RESEARCH_EVIDENCE_PROTOCOL.md)
- [REX-801-experiment-manifest-and-registry.md](REX-801-experiment-manifest-and-registry.md)
- [REX-802-trace-provenance-and-metrics-foundation.md](REX-802-trace-provenance-and-metrics-foundation.md)
- [REX-803-scenario-runner-and-repetition-engine.md](REX-803-scenario-runner-and-repetition-engine.md)
- [REX-804-fault-injection-and-recovery-probes.md](REX-804-fault-injection-and-recovery-probes.md)
- [REX-805-trace-replay-and-ablation.md](REX-805-trace-replay-and-ablation.md)
- [REX-806-metrics-analysis-and-artifact-export.md](REX-806-metrics-analysis-and-artifact-export.md)
- [REX-807-research-control-surface-and-progressive-disclosure.md](REX-807-research-control-surface-and-progressive-disclosure.md)
- [REX-890-reproducibility-study-and-freeze.md](REX-890-reproducibility-study-and-freeze.md)

<!-- DOCUMENT_NAVIGATION:END -->
