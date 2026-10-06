# Research Strengthening

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
> [Persistent rules](../../CONSTRUCTION_RULES.md) · [Async relief](../../ASYNC_RELIEF_CONSTRUCTION.md) · [Process data](../../PROCESS_DATA_POLICY.md) · [Research evidence](./RESEARCH_EVIDENCE_PROTOCOL.md) · [Signal priorities](../../RESEARCH_SIGNAL_WATCHLIST.yaml) · Research Institute `paper-materials/{zh-CN,en}/RESEARCH_PRIORITY_STRATEGY_2026-10-05.md` · [Control surface](./RESEARCH_CONTROL_SURFACE.md)

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
SHAPE A  file where directory expected: 6 stores, main 213f9f9f → repair branch 8c67bb2
theme-packages (capability-bridge)  BRICKED EEXIST  → STARTED        second instance; adoptable repair
research (REX-801 registry parent) BRICKED ENOTDIR → still BRICKED  separately reported with repair
research/experiments (REX-801)     BRICKED EEXIST  → still BRICKED  same report/repair
research/campaigns / monitor / research-trace       STARTED → STARTED

SHAPE B  directory where file expected: 3 stores, same on both branches
city.sqlite (canonical store)       BRICKED "unable to open database file"
                                    F-1: refusal is correct; missing diagnosable typed reason
join-requests.json (join store)     STARTED, HTTP 200, approval row created in memory but nothing persisted
                                    F-2: deliberate silent failure
execution-profile.json (WBC-604)    change() throws after memory profile already switched
                                    F-3: violates its own rule 2; third adoptable repair published
```

The v1 table claimed 8 probes, actually 6: two `relative = null` rows injected no faults; join HTTP 400 came from the probe mistakenly using `claimSecret`. This instrument defect and corrected measurements are retained together, never silently sanitized.

Complete record: two bricking instances, F-1/F-2/F-3 patterns, paired before/after, three adoptable repairs, three instrument lessons in [DEFECT_RESEARCH_STORE_HARDENING.md](../../reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md). Reproducible harness: `reports/REX-PROGRAMME/store-shape-sweep-v2.mjs`. Modules were on main and tasks REX-801/MB-008 legacy/WBC-604 closed; this host publishes only measurements, repair branches, and probes: **no merge, no main change, no closed-task record changes**.

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

Follow global CONSTRUCTION_RULES.md Capability Exposure Gate. Experiment create/run/stop/export requires explicit direct entries; status/metrics/provenance must be observable; fault injection is high-impact advanced control, outside ordinary primary navigation but with Research/Advanced entry, risk explanation, confirmation; raw trace plumbing may be INTERNAL_ONLY with recorded decision. Do not overwhelm ordinary Utopia users. See [RESEARCH_CONTROL_SURFACE.md](./RESEARCH_CONTROL_SURFACE.md).

## 7. Mandatory paper material

All REX tasks follow [RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md). Preserve runtime errors, test/CI failure, timeout, race, incorrect measurement, false assumption, Development/Review logic conflict, unexpected fault-campaign outcomes, failed replay, non-reproducibility, before/after metrics. Never sanitize them after repair.

## 8. Final merge lock

Do not create a final integration workbook now. REX-890 independently reproduces only after REX-801..807 all have Development complete, opposite-host Review complete, exact-head CI green, exposure decisions satisfied, and complete PAPER/RESEARCH indexes.

Programme marker: `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE`. It means reliable research-data infrastructure, not answers to every paper question.

## Current pool recheck

REX-803: Alien opposite-host Review claimed; PR37 candidate8798ba9 passes71 affected tests; physical campaign and final CI pending. REX-804: Alien adopted returned repair; PR30 candidatef4ceae7 passes12 focused tests; CI and Mech re-verification pending. REX-805/806/807/890 remain blocked on accepted dependencies. Workbook/REVIEW_REPORT are authority. SHOW excluded; no parked/new programme activation.

### Mech re-verification of REX-804 (2026-10-06)

> Reading translation of the newly appended [canonical programme note](../README.md). This is the historical verdict on `075ddc13`; the [current workbook](../REX-804-fault-injection-and-recovery-probes.md) remains authority. The later [author repair](../../reports/REX-804/AUTHOR_REPAIR_Alien.md) does not itself establish opposite-host acceptance.

REX-804 re-verification finished; its verdict is recorded in [REVERIFICATION_REPORT.md](../../reports/REX-804/REVERIFICATION_REPORT.md).

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

Reading translation of the new canonical note; full evidence is in [REVERIFICATION_REPORT.md](../../reports/REX-804/REVERIFICATION_REPORT.md), with [complete Chinese reading translation](../../reports/REX-804/zh-CN/REVERIFICATION_REPORT.md). The canonical workbook remains authority.

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
