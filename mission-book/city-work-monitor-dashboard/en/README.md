# City Work Monitor Dashboard

[中文原文与生成导航](../README.md)

> **Status: ACTIVE / OWNER_ACTIVATED_2026-10-05**
>
> On 2026-10-05 Owner explicitly instructed “activate monitor workbooks”. `execution_enabled=true`; MON-901 may be claimed; successors still wait for dependency accepted exact SHAs. See `reports/MON-901/OWNER_ACTIVATION.md`.
>
> [Persistent rules](../../CONSTRUCTION_RULES.md) · [Process data](../../PROCESS_DATA_POLICY.md) · [Research signals](../../RESEARCH_SIGNAL_WATCHLIST.yaml) · [Research Fabric](../../research-strengthening/README.md)

## 1. Objective

Project Utopia's multi-task/Agent/device/model runtime into one **task-centric/city-centric** monitor:

```text
City Work Monitor
  ├─ Overview graph
  ├─ Node inspector
  ├─ Path / edge inspector
  ├─ JEV observation stream
  ├─ Decision overlay
  └─ Evidence / raw diagnostics
```

The homepage answers only which tasks work, wait, undergo Review, or are Blocked; which device/path is abnormal; what automatic decisions occurred; and whether Owner-required matters exist. Model/provider/host are node attributes, not the monitor's primary organization.

## 2. Core architecture decisions

### 2.1 JEV = City-wide Observation Layer, not synchronous traffic cop

```text
Worker / Task / Device / Gateway
             │
             ├──────── normal work ────────→
             │
             └── bounded events → JEV Observation Layer
                                      │
                                      └→ City Work Monitor
```

JEV may continuously observe but cannot require all work to pass through it first. JEV/monitor failure cannot freeze unrelated tasks.

### 2.2 Decision = event-triggered, not extra approval for every report

Ordinary heartbeat/log/test progress is recorded without decision. Only transitions/events genuinely requiring choice enter Decision:

```text
FAILED
BLOCKED
READY_FOR_REVIEW
RETRY_REQUESTED
RESOURCE_CONFLICT
SCOPE_CHANGE
MERGE_READY
OWNER_DECISION_CANDIDATE
```

Default ladder:

```text
deterministic rule
    ↓ unresolved
fast lightweight model
    ↓ uncertain / high impact
strong critic / architect
    ↓ owner-only boundary
Owner
```

Decisions are per-task, asynchronous, parallelizable, with timeout/fallback. **No City-wide synchronization lock.**

### 2.3 Monitor is projection, not new task truth

Authority remains canonical Utopia task/action/event, Mission Book, Registry, Git/CI/runtime evidence. Monitor does canonical truth→normalized projection→aggregation→UI. Never duplicate scheduler, task state, device identity, review truth, or capability truth for dashboard convenience.

## 3. UI information hierarchy

### Level 0 — City Overview

Use task-graph/DAG style showing key state/risk by default:

```text
MB-211 ● ── Review
   │
   └─ Test
MB-212 ⚠
MB-213 ◌ waiting
```

**Overview may hide detail, never risk.** Active warning/degradation/repeated retries bubble upward. Keep layout stable across ordinary refreshes; automatically cluster/collapse large graphs; filter edge types rather than displaying all paths by default. UI may resemble a tree but model supports DAG/merge/handoff.

### Level 1 — Node / Path Inspector

Node clicks answer What happens now? Why? Who/device/Agent owns it? What next? Edge clicks show type, source/destination, trigger/reason, handoff/review/retry/model-switch/device-route semantics, exact evidence/decision provenance, and observable start/end/duration.

### Level 2 — Evidence / Raw Diagnostics

Enter only for real diagnosis: logs, diff, tests/CI, screenshots, exact SHA/run/artifact IDs, decision receipts, trace/provenance. Do not overwhelm normal users.

## 4. Data model

Minimum abstractions: Node, Edge, Event, Decision, Evidence. Markdown reports/UI trees are not system state. Suggested minimum Decision fields:

```text
decision_id
task/workbook_id
trigger_event
pre_state
decision_source = RULE | FAST_MODEL | CRITIC | OWNER
action
confidence_if_available
decision_latency_ms_if_observable
queue_wait_ms_if_observable
timeout_or_fallback
escalation_target
post_state
evidence_refs
```

## 5. Performance/blocking principles

1. Observation continuous; Decision event-triggered.
2. JEV/Monitor has no global execution lock.
3. Decision queues are independent per task.
4. Fast-model timeout pauses/degrades only its task, never the City.
5. Cases resolved by deterministic rules do not call models for apparent intelligence.
6. UI refresh/observation ingestion does not change execution order.
7. High-frequency raw telemetry follows PROCESS_DATA_POLICY layering; no unbounded stream enters City's active construction surface.

## 6. Paper material

This is an observation surface/data source for existing G3/G4 control-plane stories; “built an Agent dashboard” is not default novelty. Prioritize observation→projection latency; transition→decision latency; queue wait; rule/fast-model/critic/owner resolution source; avoided/required Owner interruption; escalation cause; timeout/fallback; unrelated-task blocking (should be 0, but unknown cannot be filled as 0); false-safe summaries/risk bubbling; projection↔canonical drift; node/edge provenance completeness; handoff/retry/model/device explanation completeness; measurable graph size/collapsed clusters/navigation depth.

```text
MONITOR_SYNC_BARRIER
MONITOR_REALITY_DRIFT
SUMMARY_HIDES_ACTIVE_RISK
EDGE_CAUSALITY_MISSING
DECISION_PROVENANCE_MISSING
DECISION_TIMEOUT_GLOBAL_IMPACT
DASHBOARD_BECOMES_SECOND_TASK_TRUTH
```

Research Institute topic: `paper-materials/{zh-CN,en}/CITY_WORK_MONITOR_OBSERVATION_DECISION_2026-10-05.md`.

## 7. Work decomposition

| ID | Work | Recorded status |
|---|---|---|
| [MON-901](../MON-901-observation-model-and-jev-projection.md) | Observation model + JEV sidecar projection | COMPLETE |
| [MON-902](../MON-902-overview-graph-and-node-path-inspector.md) | Overview graph + node/path progressive disclosure | COMPLETE; reviewer accepted repaired opposite-host head; MON902_OVERVIEW_GRAPH_REVIEW_ACCEPTED |
| [MON-903](../MON-903-event-triggered-decision-overlay.md) | Event-triggered Decision overlay + escalation provenance | IN_PROGRESS (development complete, review pending) |
| [MON-990](../MON-990-cross-device-monitor-acceptance-and-freeze.md) | Cross-device acceptance + reality reconciliation + freeze | IN_PROGRESS; Mech reviewed 11/12; Android NOT_RUN prevents marker |

MON-902/MON-903 can run on different hosts after MON-901 acceptance. Recorded planning states coexist with subsequent historical measurements below; workbook/report determines current truth.

### MON-902 measured status (Mech / Alien, 2026-10-06)

```text
DEVELOPMENT   Mech COMPLETE at exact 3a88e23f91924576178973ef46c620b20ffa2aaf
              branch mon/MON-902-mech-overview-graph; PR #27
REVIEW        Alien opposite-host review returned repair: 6 independent reproduced failures plus
              1 stale-open-evidence cache defect found by its local critic, total 7.
              Author accepted all; none was taste-only.
              reports/MON-902/INDEPENDENT_REVIEW_Alien.md
              reports/MON-902/AUTHOR_ACCEPTANCE_OF_REVIEW.md
REPAIR        review/MON-902-Alien-20261006 @ f4988248a3316806fc2e3fa9e62864ed129fe7b3
              PR #34 MERGEABLE
ACCEPTANCE    Reviewer accepted its own repair head. Workbook COMPLETE, review_complete true,
              review_status ACCEPTED_EXACT_HEAD_WITH_DOCUMENTED_SURFACE_STRATEGY,
              marker MON902_OVERVIEW_GRAPH_REVIEW_ACCEPTED; CAP-MON-002 FORMAL_REVIEW_RECONCILED.
              Three exact-head runs terminal SUCCESS attempt 1: push 37414577586, PR 37414583160,
              linkage 37414583135. Author/reviewer separately API-rechecked each and agreed.
STILL OPEN    Android native/physical cross-device acceptance NOT_RUN, assigned to MON-990 by stated strategy.
              This marker is task acceptance, not programme freeze.
MERGE         merge_authority false; this host did not merge. Reviewer decides acceptance, not author.
```

Archivable failure pattern (author assessment): MON-902's purpose was not to show unsafe state as safe, yet its projection had three false-safe paths: absent `view.health` produced no risk; absent/invalid completeness metadata produced calm summaries and counted gaps as 0; terminal tasks counted as current work held by offline devices. `navigation.worstSteps` was unmeasured, inferred from risk presence; reviewer changed it to `worstSteps: null / measurementStatus: 'NOT_OBSERVABLE'`. All 33 author probes used well-formed input and structurally could not detect these branches; 11 reviewer probes tested the opposite assumptions. Full lesson: AUTHOR_ACCEPTANCE_OF_REVIEW §5.

### MON-903 measured status (Mech, 2026-10-06)

```text
DEVELOPMENT   COMPLETE at exact 78bdd9dc873ebc257aedecf421068a1387dbec82.
              Earlier table's 1d1593df was the first green head; D-7/M-1 and D-8/M-2 self-test defects
              advanced it. Workbook development_head_sha is 78bdd9d; dashboard corrected accordingly.
              branch mon/MON-903-mech-decision-overlay;
              union baseline main 213f9f9f containing MON-901 7eb38f1b.
WIRING        Real gateway verified GET/POST /api/v0/monitor/decisions and
              GET /api/v0/monitor/decisions/:id. Read-only snapshot injects MON-901 decision fields;
              real browser verified Advanced > Decision provenance.
NOT DONE      No Android surface (MON-990 acceptance). No resolver configured in this City;
              uncertainty escalates to Owner as RESOLVER_NOT_CONFIGURED, never falsely claiming model wiring.
REVIEW        Alien opposite-host CLAIMED and REPAIRED; review_status REPAIRED_AWAITING_EXACT_HEAD_CI,
              review_complete false, marker unreleased, merge_authority false at that historical point.
              reports/MON-903/INDEPENDENT_REVIEW_Alien.md; PR #35.
              Alien recorded CI counterevidence advancing review head db6bfb2 → 9eb8275b.
AUTHOR PASS 2 Second author self-test is not Review evidence and changes no head/workbook/claim.
              A same-family scan following MON-902 review found 4 actual defects: bounded failure logs omit
              discard count; queue-limit-rejected decisions publish unmeasured decisionLatencyMs: 0;
              metrics() publishes headline ratios from truncated samples without disclosure;
              window fails to state it spans trigger events. Also 1 UI defect exposed only by real rendering.
              repair/MON-903-mech-honest-metrics @ 6ecc6f3; probes then repair in two commits;
              red 1 pass / 5 fail retained; push CI 37416035100 SUCCESS attempt 1.
              reports/MON-903/AUTHOR_SECOND_ADVERSARIAL_PASS.md.
              Opposite-host review's 8+2 defects barely overlap these 4: category-directed scans find only
              supplied categories. This scan never targeted state-machine/lifecycle defects such as UUID
              ordering deleting arbitrary receipts, observe bypassing close, or high-rate rendering starving
              polling. This structural limitation prevents substituting self-scans for Review.
ADOPTABLE     Author merged own findings over reviewer head:
              repair/MON-903-mech-honest-metrics-on-review-head @ 10a020c3; base 5b71389;
              push CI 37416962184 SUCCESS attempt 1; local 1383/1386, 3 local persistent-City conflicts.
ADOPTED       Opposite host adopted and accepted: workbook COMPLETE, review_complete true,
              review_status ACCEPTED, marker MON903_DECISION_OVERLAY_REVIEW_ACCEPTED,
              Registry FORMAL_REVIEW_RECONCILED, review head 3cd32c60 includes the 4 findings.
              Local recheck of reviewer CI --test-concurrency=2: author's merge branch and reviewer head
              3cd32c6 each 1386 tests / 1383 pass; no checks removed.
MON-990       Acceptance unlocked Alien Development on accepted exact dependency union:
              development_host Alien, development_baseline_sha 665d6c3c, head fb042d9, PR #36.
              Mech opposite-host Formal Review claimed/executed on 2026-10-06; see next block.
```

### MON-990 measured status (Mech reviewer, 2026-10-06)

```text
DEVELOPMENT   Alien COMPLETE at exact fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40
              branch mon/MON-990-Alien-20261006; PR #36
REVIEW        Mech claimed/executed. All 11 independent probes passed at
              review/MON-990-Mech-20261006 @ 14b2c7b, covering 11 of 12 required checks:
              overview↔canonical state; uninvented node metadata; unexplained edges MISSING with no invented
              provenance; receipt pre/post state matches reality; FAILED nodes visible in collapsed 200-task
              view; canonical work continues when observer throws; stuck resolver blocks only its own task,
              attributed timeout; Registry/runtime reconciliation; refresh does not reorder and filters
              change only edges; Web diagnostics reaches exact evidence in measured 3 interactions;
              receipts advise only, never modify tasks.
VERDICT       PASS on 11 checks; no defects found.
MARKER        CITY_WORK_MONITOR_V1_ACCEPTED unreleased: required check 9's Android half NOT_RUN.
              Measured reasons: adb had no connected devices; only installed JDK 26 is rejected by Android
              Gradle Plugin (build: "What went wrong: 26"). Structural reconciliation—same routes,
              same riskReasons, MonitorProjection.kt:40 R4 invariant—is supporting evidence, not substitute.
              review_complete remains false: no author repair to reject, but author physical evidence
              cannot be presented as reviewer evidence, as recorded at claim. Remedy: connect a device to
              review host, install AGP-compatible JDK, or Owner rules to accept author capture for this item.
              That waiver is Owner's decision, not reviewer discretion.
CI            Reviewed head runs individually API-rechecked SUCCESS attempt 1: push 37420061997,
              PR 37420065177, linkage 37420065178. Reviewer first probe head 7fffe3f failed CI 37422163771:
              reviewer instrument defect, R1 awaited shell rather than data-loaded=true (same shape as
              MON-902 browser probe). Fixed at 14b2c7b, CI 37422910108 SUCCESS attempt 1; both retained.
REPORT        mission-book/reports/MON-990/REVIEW_REPORT.md
```

MON-903 Review independently checks omitted/misclassified triggers, actual no-barrier behavior, any path where decisions change state, complete receipt contracts, and misleading metrics. Author's open items: `reports/MON-903/DEVELOPMENT_REPORT.md` §6.

## 8. Activation conditions

Only explicit Owner permission changes workbook `execution_enabled: false → true`. Directory existence never activates construction.

<!-- SERIES_DASHBOARD:START -->
## 任务快速面板 / Task dashboard

自动读取canonical工作书；本表不提供领取锁或额外authority。 / Generated from canonical workbooks; this table grants no claim lock or extra authority.

总完成 / Complete 3/4 · 开发 / Development 4/4 · 复检 / Review 3/4 · `IN_PROGRESS`

| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |
|---|---|:---:|:---:|:---:|
| [MON-901](../MON-901-observation-model-and-jev-projection.md) | COMPLETE | YES | YES | YES |
| [MON-902](../MON-902-overview-graph-and-node-path-inspector.md) | COMPLETE | YES | YES | YES |
| [MON-903](../MON-903-event-triggered-decision-overlay.md) | COMPLETE | YES | YES | YES |
| [MON-990](../MON-990-cross-device-monitor-acceptance-and-freeze.md) | IN_PROGRESS | YES | NO | YES |

<!-- SERIES_DASHBOARD:END -->
