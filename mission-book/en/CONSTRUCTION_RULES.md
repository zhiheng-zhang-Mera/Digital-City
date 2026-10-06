# Mission Book — Persistent Construction Rules

[中文原文](../CONSTRUCTION_RULES.md) · [Mission Book dashboard](../README.md)

> **Status: ACTIVE / NORMATIVE / PERSISTENT**
>
> This is the long-term construction specification for `mission-book/`. It belongs to no individual task, programme, or phase and **must not be moved into `finished/` when a task completes, a phase freezes, or the project closes**.
>
> Updates are versioned in place through Git history. An archived task may record the commit SHA of the rules it used; it must not copy “current rules” into an archive as a new authority.
>
> [Current dashboard](../README.md) · [Workbook template](./MISSION_TEMPLATE.md) · [Process-data boundaries](./PROCESS_DATA_POLICY.md) · [Capability Registry](../../capability-registry/README.md) · [Research signal watchlist](../RESEARCH_SIGNAL_WATCHLIST.yaml)

## 0. Authority hierarchy

Interpret construction facts in this order:

1. Explicit, newer Owner rulings.
2. `CONSTRUCTION_RULES.md`.
3. The current workbook's task-specific scope/gates.
4. Dynamic claims, SHA, CI, and completion facts in the current frontmatter and reports.
5. The README monitoring dashboard.

**README monitors; it is neither a lock, a scheduler, nor construction rules.** A stale dashboard cannot change actual task state. Ordinary claim/CI/review changes do not require manually updating README every time.

### Capability Registry authority boundary

- Current claim/execution/Review/CI truth remains the Mission Book workbook/report plus exact evidence.
- `capability-registry/` is the long-term verified view of capability inventory, implementation navigation, exposure, and reachability.
- The Registry cannot override stronger exact runtime/UI/E2E evidence.
- If Registry and observed reality conflict, label `CAPABILITY_REGISTRY_STALE` or `CAPABILITY_REGISTRY_REALITY_MISMATCH`, preserve the conflict evidence first, and reconcile under §14C.

Old rules, dashboards, and responses in `finished/` are traceability material only and cannot override this file.

## 0A. Homepage progress forced sync

Mission Book homepage statistics now consistently use:

```text
Total tasks completed ?/?
Development completed ?/?
Recheck completed     ?/?

Development / Migration → Development
Review / Correction / Verification → Recheck
Recheck completed → Total tasks completed
```

The same definitions apply at project and City level.

### Authority

```text
workbook frontmatter
    ↓ authoritative
sync_mission_progress.py
    ↓ derived
README generated blocks + MISSION_PROGRESS.json
```

- Workbook frontmatter remains the sole authority for dynamic state.
- The `MISSION_PROGRESS` and `ACTIVE_WORKBOOKS` blocks in `mission-book/README.md` are generated views and must not be manually maintained.
- `mission-book/MISSION_PROGRESS.json` mirrors the same statistics for machines and has no higher authority.
- `mission-book/PROGRESS_MANIFEST.json` explicitly defines programme membership.
- FUTURE-only plans are excluded from denominators until formally activated as workbooks.

### Mandatory synchronization

Any commit changing these fields or equivalent task state must synchronize generated statistics:

```text
status
execution_enabled
development_complete
migration_complete
review_complete
correction_complete
verification_complete
owner_gate
archive / active programme membership
```

Standard local/Agent commands:

```text
python mission-book/tools/sync_mission_progress.py
python mission-book/tools/sync_mission_progress.py --check
```

GitHub enforcement:

- PR: `.github/workflows/sync-mission-progress.yml` regenerates and checks; the PR check fails if generated README/JSON differs from committed data.
- Direct `main` update: the workflow regenerates and commits README plus `MISSION_PROGRESS.json` only when they differ.
- Its generated README/JSON commit may trigger one no-op verification. No difference means no further commit, preventing a commit loop.

### Drift classification

If workbook state has changed but homepage statistics remain stale, use `MISSION_HOMEPAGE_PROGRESS_DRIFT`. This is control-plane reality drift. Manually fixing README numbers cannot close it: repair the generator, manifest, or workbook source state, then regenerate.

### Format stability

Future homepage project statistics use fixed columns:

| Project | Total tasks completed | Development completed | Recheck completed | State |
|---|---:|---:|---:|---|

The City header always shows both **City-wide total** and **currently unclosed project pool**. Add new programmes to `PROGRESS_MANIFEST.json` first; never maintain independent README numbers that cannot be automatically recomputed.

## 1. Why these rules were restored

These rules incorporate failures actually encountered in the previous construction round:

- A single “no claimable task now” was mistaken for pool completion.
- The second host slept permanently because it was temporarily ineligible.
- Hosts idled while hosted CI or long tests ran.
- City frontmatter/dashboard was not reconciled after GitHub Actions Billing recovered.
- Green CI from the wrong branch/head was treated as current-task evidence.
- External blockers were confused with actual code failures.
- Valueless work or excessive defensive expansion was created to avoid idleness.
- Merge/integration used stale `main`, overwriting or omitting another accepted contribution.

Historical sources, used only to restore these rules:

- `finished/completed-2026-10-01/CROSS_PROGRAMME_EXECUTION_CONTRACT.md`
- `finished/completed-2026-10-01/ENGINEERING_BOOK-2026-10-01-ASYNC-DISPATCH-RECOVERY-AND-DRAIN.md`
- `finished/completed-2026-10-01/past-rules/2026-09-29-construction-rules-v1.md`

**This file is now the active persistent specification.**

## 2. Atomic claims: never infer a claim from a dashboard

Dynamic claim truth exists only in the target workbook frontmatter/corresponding report. Claiming requires:

1. Read latest Digital-City `main`.
2. Re-evaluate dependencies, role eligibility, and current claims.
3. Change only the claim fields required by the target task.
4. Update by fast-forward.
5. If another host wins the push race, fetch again and rescan; never force-push or overwrite its claim.

Do not use README tables as locks, refresh unrelated tasks incidentally during a claim, take another host's valid claim, or force-push to resolve a race.

## 2A. Immutable Baseline Anchor

No executable workbook may treat a branch/tag name itself as implementation evidence.

### 2A.1 Only full commit SHA counts

Use a **40-character full Git commit SHA** for development baseline, accepted dependency head, integration source, review head, CI head, and merge/acceptance head. Short SHAs may aid prose readability only; they cannot be machine/construction truth.

### 2A.2 Branches are discovery refs, not anchors

These may be recorded:

```text
baseline_candidate_refs:
  - refs/heads/main
  - refs/heads/<integration-branch>
```

They answer only where to find candidate code. At actual claim:

```text
fetch remote ref
→ resolve to full 40-char commit SHA
→ verify required ancestor SHA(s)
→ record exact development_baseline_sha atomically with claim
→ all later CI / Review bind to exact SHA
```

Branch movement after claim does not change the claimed baseline truth.

### 2A.3 Baseline anchor modes

Every workbook must use one of these modes:

#### `REMOTE_REF_EXACT_SHA_AT_CLAIM`

For independent tasks: select from `baseline_candidate_refs`, resolve full SHA, verify `required_ancestor_shas`, and atomically record `development_baseline_sha`.

#### `DEPENDENCY_SHA_UNION_AT_CLAIM`

For component tasks depending on multiple components not yet combined in one baseline:

1. Read each dependency's accepted **exact head SHA** from its workbook/report.
2. Create a worktree/branch from the latest eligible full-SHA base.
3. Explicitly union/merge those exact dependency SHAs.
4. Resolve conflicts.
5. Run dependency smoke before any product changes for this task.
6. Record the resulting union's full commit SHA as `development_baseline_sha`.

A COMPLETE dependency marker does not permit starting from `main` that lacks its code.

#### `FIXED_EXACT_SHA`

Only for genuinely frozen historical/read-only reproduction tasks; record full SHA directly.

#### `EXACT_SHA_PER_RUN`

For read-only runs such as SHOWCASE/research capture. Record runtime full SHA separately for every run/take; never combine different runs as “roughly the same version”.

### 2A.4 Required ancestor guard

`required_ancestor_shas` defines immutable capability minimums the candidate baseline **must already include**. Verify ancestry for every SHA at claim. Any failure is `BASELINE_ANCESTRY_MISMATCH`: the task must not start or automatically switch to a “similar-looking” branch.

### 2A.5 Never guess unfixed upstream state

If an upstream is still in development without an accepted exact SHA:

- Use `WAITING_DEPENDENCIES` or a typed equivalent.
- Record upstream name and wake condition.
- Never put branch names, fake SHAs, or guesses in `required_ancestor_shas`.
- Once accepted, backfill its exact SHA before unlocking claim.

Dependency propagation rules:

- `DEPENDENCY_SHA_UNION_AT_CLAIM` workbooks explicitly declare `dependency_source_workbooks`, or uniquely resolvable workbook IDs in `dependencies`.
- Take accepted dependency SHA from the predecessor's formally released `review_head_sha` (the corresponding accepted exact head for historical Correction/Verification workbooks); never mix branch names or rely only on programme README.
- Unclaimed workbooks waiting solely for `DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE` automatically backfill `dependency_source_shas`, clear that blocker, and move `WAITING_DEPENDENCIES` → `READY` once all predecessors are accepted.
- Automatic sync must not rewrite frozen dependency provenance after `development_baseline_sha` is recorded. Handle discrepancies through explicit reconciliation.
- The control repository uses `mission-book/tools/sync_dependency_state.py`; dependency-state sync precedes mission-progress generation.

### 2A.6 Review and CI also reject branch identity

Formal Review verifies:

```text
reviewed head == recorded development_head_sha
CI head       == reviewed head / required final head
remote branch tip differences are informational only
```

Even if the branch advanced, review the recorded exact head unless workbook reconciliation explicitly supersedes it with a new SHA.

### 2A.7 State identity / provenance research signal

Full-SHA, ancestor, and exact-head rules primarily ensure **construction correctness**. Also record these observed cases as §14B research candidates:

- Mutable branch/tag/head moves during execution, diverging from remembered state.
- Resume/compaction/handoff restores only a symbolic ref and loses exact identity.
- Valid CI/Review/artifact is bound to the wrong head/run/task.
- Dependency marker says COMPLETE but baseline lacks accepted dependency SHA.
- Revalidation before a critical transition detects stale identity/provenance.

Recommended labels:

```text
MUTABLE_REFERENCE_STATE_DRIFT
EVIDENCE_POINTER_MISMATCH
BASELINE_ANCESTRY_MISMATCH
STALE_EXECUTION_IDENTITY
PROVENANCE_RELATION_MISMATCH
```

Do not present “branches move” as a research contribution. Research value concerns long-horizon Agent state identity, provenance, freshness, and interactions with compaction, resume, and multi-agent concurrency.

## 3. Two-host independence

Where the workbook requires Development plus Review/Correction:

- Different physical hosts perform the two roles.
- A hosted CI runner is not the second physical host.
- One host cannot perform its own independent review because the other is temporarily unavailable.
- Review independently finds problems and may directly repair in-scope defects; it is not a signature or repetition of author tests.

If stable mechanisms prohibit this host from all remaining work, classify structural ineligibility; do not invent a third role or sham review.

## 4. Waiting does not occupy a host: No-idle

An owned task can retain its claim while waiting for hosted CI, long local tests, plugin download/install, provider/session probes, external login, or non-CPU-active device/service responses. These waits **do not exclusively occupy the physical construction host**.

Retain the claim, use an independent worktree/branch, scan and claim another non-conflicting dependency-ready task, then return when the original becomes actionable. Do not idle on CI to “stay focused”, or duplicate an implementation because another task is waiting.

## 5. Classify zero-claim results; never immediately declare completion

`claimable_now = 0` proves only that no task can be claimed now, **not pool completion**. Every zero-claim result belongs to exactly one category.

### 5.1 `TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY`

Conditions: unfinished tasks remain; this host may become eligible; another host's Development/Review completion, CI terminal state, Owner gate resolution, phase freeze, or provider/device recovery may unlock work.

Enter low-cost waiting without busy polling. **Prefer immediate event-triggered rescan**; if notifications are absent, use a bounded rescan approximately every **20 minutes**. Repeated 20-minute rescans are allowed while unfinished work and plausible future eligibility remain.

Example: while Alien develops UI-000, Mech has no Review to claim. Mech waits for Development completion and uses the approximately 20-minute fallback if that event is lost.

### 5.2 `STRUCTURALLY_INELIGIBLE`

All remaining tasks prohibit this host through stable mechanisms: same-host review exclusion, hardware eligibility, identity/permissions, safety policy, or explicit Owner restrictions. Record exact reason and release the host. **No periodic 20-minute rescan is required**; wake only when the governing gate/eligibility changes.

### 5.3 `GLOBAL_EXTERNAL_BLOCK`

Every meaningful next step requires external change internal code cannot honestly provide, such as account Billing, missing mandatory hardware, or Owner/provider account action. Record typed blocker and evidence, release the host, and do not poll an unchanged known external blocker every 20 minutes. On recovery, perform §7 reconciliation before rescan.

### 5.4 `POOL_TERMINAL`

Use only after all relevant tasks reach terminal states under actual completion semantics. **PARKED, temporarily no work, structural ineligibility, and external blockage must not be called project completion.**

Record at least:

```text
pool_incomplete
claimable_now
potentially_claimable_later
classification
structural_ineligibility_reason
global_external_blocker
wake_condition
rescan_after
terminal_reason

expected_identity_if_applicable
observed_symbolic_ref_if_applicable
resolved_identity_at_use_if_applicable
evidence_identity_if_applicable
provenance_or_required_ancestor_refs
freshness_revalidation_event
identity_or_evidence_mismatch_type
reconciliation_action
```

## 6. Wake-up: events first; 20 minutes is only fallback

Immediately rescan waiting hosts on another host's Development/Review completion, required CI terminal state, Owner gate resolution, phase baseline/merge completion, dependency locked→open, meaningful provider/session/device availability changes, claim release or failed task becoming owned repair, or explicit external-blocker recovery.

The approximately 20-minute `TEMPORARILY_UNCLAIMABLE` rescan is a **low-frequency liveness fallback**, not the primary scheduler.

## 7. Reconcile after external recovery; never trust a stale dashboard

External systems can change without a Digital-City commit: Actions Billing recovery, green CI rerun, provider recovery, approval arrival, or device return. Control-plane reconciliation is mandatory:

1. Immediately after reported typed external-blocker recovery.
2. Before interpreting the first zero-claim result after recovery.
3. Before declaring phase/pool drained.
4. Before creating phase merge/integration.
5. Before final project-completion claims.

For tasks relying on external evidence, verify:

```text
recorded branch == evidence head_branch
recorded head   == evidence head_sha
required terminal state == evidence conclusion/status
```

- New success at exact recorded head may close an old external block.
- Green runs from other branches/tasks cannot satisfy this task: `EVIDENCE_POINTER_MISMATCH`.
- Preserve historical failed/blocked runs; update current frontmatter to latest verified scheduling truth.
- Reconciliation repairs control-plane metadata only; never create product-code commits to “refresh status”.
- If the authoritative external source is unavailable, retain last verified state and record `RECONCILIATION_SOURCE_UNAVAILABLE`; never guess.

## 8. CI and failure classification

- Local PASS cannot replace explicitly required hosted CI.
- Billing/runner preventing any job start is an external blocker, not product-code failure.
- A job actually starting and failing its test step is an ordinary code defect; stop classifying it as Billing.
- Repair observed defects without incidental scope expansion.
- Bind required CI to exact branch/head.
- Never remove tests, lower gates, or redefine success to obtain green CI.

## 9. No make-work or defensive inflation

When temporarily ineligible, do not invent features, refactor infrastructure unrelated to acceptance, keep adding gates/wrappers/abstractions for hypothetical future risks, or commit unvalidated heads merely to keep machines busy.

Only explicit workbook scope, a new Owner ruling, observed in-scope test/runtime defects, or the minimum repair needed for an existing contract may expand work. “No work to do” is not a defect to fix with code.

## 10. Missing sibling programmes/external dependencies must not stall independent work

Prefer stable contracts/ports plus deterministic test doubles for independently completable work. Honestly defer real-provider/device/cross-device portions to integration. **Deferred != passed**: record exact pending seam. Do not duplicate canonical ownership for cross-programme convenience.

## 11. Merge/integration is also asynchronous

For each phase:

1. Start from Utopia `main` **latest at that time**.
2. Integrate independently reviewed branches; resolve conflicts by explicit union/superset.
3. Preserve other work already accepted on `main`.
4. Run all independently runnable tests first.
5. If only a real external seam remains, record it and release the host without idling.
6. **Refresh latest `main` again before final merge**.
7. Rerun required acceptance/CI after refresh.
8. Verify merged-main CI after merge.

Never carry phase-start stale `main` through to final merge.

## 12. Claim anomalies and handoff

Automated builders must not clear another host's claim on their own.

- Claimed but no substantive implementation/report: Owner or explicitly rule-based recovery may reset.
- Substantive work exists but original host cannot continue: record blocker; another host must not secretly impersonate the original role.
- Necessary role-boundary changes require Owner ruling or superseding workbook; preserve history.

## 13. Tool/plugin waits and safety

If the workbook allows autonomous Hns/Codex plugin/Skill installation, apply §4 to download/install waiting; record source and version/ref in reports. Plugins default to the construction toolchain. Without explicit workbook authorization, convenience cannot justify changing production runtime/framework. Never upload secrets, tokens, private credentials, or unnecessary code to unknown third parties.

## 14. Process data

Follow [PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md). City stores only claim/status, exact branch/head/CI, bounded reports, and blocker/reconciliation/completion summaries. Unbounded terminal logs, repeated screenshots, and raw traces do not enter City's active construction surface.

## 14A. Capability Exposure & User Control Gate

Before Development complete, every **new or substantially modified product capability** must answer: should users directly operate it? If not, how much should they know/observe/configure? At what UI level should it live, and how will visual/operational overload be avoided?

Core principle: **maximize user control and awareness while avoiding visual and operational overload**. Solve overload through progressive disclosure, hierarchical organization, contextual entries, Advanced, and Technical Details; never hide capabilities users should control or know about.

### 14A.1 Four exposure decisions

Assign every capability exactly one class:

#### A. `DIRECT_CONTROL`

Users need to initiate, stop, choose, confirm, modify, or recover. Provide discoverable normal-user entry, real canonical backend/action/API wiring, observable accepted/running/failed/refused/completed results, and applicable cancel/rollback/confirmation. Console, CLI, hidden URLs, or documentation alone cannot complete normal-user flows. Examples: task creation, device selection, rebind, approve/reject, experiment run/export.

#### B. `OBSERVABLE_ADVANCED`

Users operate infrequently but reasonably need awareness/intervention for status, results, configuration, or exceptions. Expose at least one stable surface: Settings, Research/Advanced, device/task detail, status/diagnostics, or expandable Technical Details. Never hide completely. Examples: provenance, metrics, enrollment status, resource readiness, experiment trace completeness.

#### C. `BACKGROUND_DISCLOSED`

Primarily automatic capabilities do not warrant frequent buttons, but their existence, state, failures, or policy affects outcomes. Users must at least know they exist; whether active/degraded/unavailable; how important failures or human decisions are communicated; and where to adjust policy/opt-out/reset if needed. Status, notifications, history, Settings, or contextual explanation suffice; permanent primary-navigation controls are not required. Examples: automatic recovery, background routing, session refresh, health monitor.

#### D. `INTERNAL_ONLY`

Complete UI absence is allowed only when there is **no reasonable user-operation value and no product semantics requiring user awareness**. Possible examples: protocol heartbeat, transport frame codec, internal retry bookkeeping, ephemeral collector buffer, low-level worker claim packet. This is the **only complete UI exemption**. Record:

```text
user_exposure_class: INTERNAL_ONLY
ui_exemption_reason: <why no user action or awareness is useful>
```

“UI complexity”, “later”, or “only advanced users need it” are not exemption reasons.

### 14A.2 Mandatory nesting decision

For all non-INTERNAL_ONLY capabilities, choose:

```text
L1 PRIMARY
   frequent / high-value / core user journey
L2 CONTEXTUAL
   appears where the relevant task/device/action exists
L3 ADVANCED / SETTINGS / RESEARCH
   powerful or infrequent controls
L4 TECHNICAL DETAILS / DIAGNOSTICS
   raw ids, exact refs, deep provenance, low-level measurements
```

Only frequent core operations enter L1; object-specific actions belong in L2; powerful, dangerous, infrequent abilities belong in L3; raw technical information is collapsed into L4. Do not repeat the same fact across primary entries. Prefer an existing natural host page over new top-level navigation.

### 14A.3 Backend Wiring Gate

A drawn button is not completed exposure. DIRECT_CONTROL/ADVANCED controls must prove:

```text
visible control
→ canonical request/action
→ backend accepted/refused truth
→ progress/state
→ result/error
→ UI reconciliation
```

Any missing link is `EXPOSURE_BACKEND_NOT_READY`. Keep control disabled/absent with honest explanation; never create false affordances.

### 14A.4 Knowledge/control rights

Capabilities affecting task routing, device choice, provider/model, cost/budget, trust/identity, privacy/security, persistence/data deletion, external side effects, or long-running background behavior default to **not INTERNAL_ONLY**. Even without a direct button, they are at least OBSERVABLE_ADVANCED or BACKGROUND_DISCLOSED.

### 14A.5 Required workbook/report fields

For new/substantially changed capabilities record:

```text
user_exposure_class
user_exposure_surface
user_exposure_nesting
backend_wiring
ui_exemption_reason
```

If frontmatter has no dedicated fields, record them in the body’s “Capability Exposure Decision”. Development Report describes the actual entry. Formal Review independently checks discoverability, real backend wiring, honest unavailable/permission/refusal states, duplication/visual overload/unreasonable top-level navigation, incorrect INTERNAL_ONLY classification for background abilities requiring awareness, and whether first-class Android/Web surfaces need parity (otherwise record reason and future seam).

### 14A.6 Completion Gate

Unfinished exposure decisions mean `CAPABILITY_IMPLEMENTED != PRODUCT_COMPLETE`. Code/unit-test/CI success cannot complete the whole user capability. Component implementation may complete, but programme/final integration retains exposure seam until required UI/observable surfaces are wired and reviewed, or `UI_EXEMPT_INTERNAL_ONLY` is explicitly proven. Applies by default to subsequent new Mission Book capabilities; Capability Entry Closeout clears historical entry debt.

### 14A.7 User-Reachable Vertical Slice First

For direct-user or materially user-affecting capabilities, do not default to complete backend → complete internals → late UI → discover unreachable/wrong semantics. Nor use UI shell → placeholder/fake button → late backend wiring. Prefer:

```text
accepted user verb / intent
→ discoverable entry point
→ thinnest real backend path
→ observable result/error
→ real E2E verification
→ thicken internal capability
→ expand UI/error/policy states
→ intent validation
```

**Make one real user path work first, then widen it.** Exceptions: INTERNAL_ONLY; low-level prerequisites without reasonable user semantics at this stage; explicit foundational contract/schema/migration tasks. Explain in the workbook why the vertical slice is not yet applicable. “UI later” is not a default reason.

## 14B. Long-Horizon Agent Research Evidence Gate

All new/continuing engineering books must assess research value concerning long-horizon Agents, context lifecycle, or external execution state. This is a **global evidence-loss prevention rule**, independent of Research Strengthening membership.

Research Institute topic entry: `06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/paper-materials/{zh-CN,en}/LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md` (Chinese uses `zh-CN`; English uses `en`).

### 14B.1 First assess applicability for every workbook

Record at least:

```text
research_evidence_applicability = APPLICABLE | NOT_APPLICABLE
long_horizon_context_evidence = CAPTURED | NOT_OBSERVABLE | NOT_APPLICABLE
research_evidence_refs = [...]
```

“Not a paper task” cannot excuse omission. Typical APPLICABLE signals: long-running/asynchronous Agent work; context pressure/compaction; session restart/resume; model/provider/harness switch; Mission Book/external-state restoration; consecutive pool claiming/drain; forced Owner continuation; false COMPLETE; duplicate/regression work; stale branch/SHA/task state; long waits or incorrect blocker/termination decisions; successful/failed reconstruction after compaction. Very short single-step tasks without context-continuity significance may explicitly record NOT_APPLICABLE.

### 14B.2 Three long-term research questions

Prioritize material around:

1. **When to compact:** record context pressure/token occupancy/task phase/semantic boundary, not merely that compaction occurred.
2. **What to retain:** distinguish active working context, compressed semantic state, externally referenced evidence, authoritative structured execution state, and discardable transient noise.
3. **What to externalize:** observe whether Mission Book/reports/exact SHA/CI receipts/task pool improve post-compaction/restart recovery and reduce human continuation, duplicates, incorrect COMPLETE, and stale-state errors.
4. **What must remain immutable and be revalidated:** identify execution-semantic identifiers requiring exact-copy/structured serialization rather than free summary rewriting; compare mutable symbolic ref, immutable identity, identity+provenance, and identity+provenance+freshness revalidation.

### 14B.3 Fields to prioritize when observable

```text
agent_provider
agent_model
agent_harness
harness_version_or_sha
workbook_id
run_or_session_id
start_time
end_time
context_window_limit_if_known
context_tokens_before_compaction_if_known
context_occupancy_ratio_if_known
compaction_trigger
compaction_trigger_reason
task_phase_at_compaction
semantic_boundary_type
summary_or_checkpoint_artifact_ref
external_state_refs_used
state_fields_reconstructed
state_reconstruction_errors
owner_intervention_count
owner_intervention_reason
task_transitions_completed
duplicate_work_count
stale_state_error_count
false_completion_count
regression_or_reopened_work_count
recovery_time_if_measurable
autonomous_work_span_if_measurable
terminal_reason
```

Unavailable tool fields use `NOT_OBSERVABLE + reason`. **Never guess or use 0 for unknown values.**

### 14B.4 Check State Reconstruction first after compaction/resume

After compaction, context reset, session resume, agent handoff, or model switch, use external ground truth to check restoration of current mission/workbook, exact branch/full SHA, completed work, remaining work, known blocker/failure, next action, previously failed paths that must not be pointlessly repeated, completion/acceptance gate, original exact execution-semantic identities, valid provenance/required-ancestor relations, and freshness revalidation before critical transitions. These support later State Reconstruction Accuracy calculations; self-assessment by the same Agent is not ground truth.

### 14B.5 Do not distort normal work to collect research material

Default to **passive capture of natural development data**. Do not deliberately create failures, extend runs with valueless work, stuff context with junk to test compaction, or violate §9 no-make-work for research. Controlled interventions require a dedicated research/fault-injection/controlled-replay workbook. Natural logs discover phenomena; causal conclusions require later controlled replay/ablation.

### 14B.6 Data boundaries/privacy

Capture only observable engineering facts and explicit state: allowed prompt/instruction, compaction/checkpoint events, task/workbook state, logs/CI/tests, timestamps, tool-exposed token/cost telemetry, Owner intervention, branch/SHA, and observable action/result. **Never request, infer, or retain hidden chain-of-thought/private reasoning.**

### 14B.7 Storage

- Unbounded runtime/trace follows [PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md), outside City's current construction surface.
- Task-specific bounded evidence belongs in `mission-book/reports/<WORKBOOK-ID>/`.
- Utopia raw/shared evidence uses existing evidence/evolution paths.
- For paper-relevant phenomena, create/update Research Institute `paper-materials/{zh-CN,en}/` topic material and link exact evidence back from reports.
- No publishable value is acceptable: record `NO_RESEARCH_SIGNAL` in the report; do not manufacture conclusions.

### 14B.8 Review/completion gate

Formal Review checks applicability assessment; honest observable telemetry; recovery evidence for compaction/resume; exact run/SHA/report traceability; misuse of NOT_OBSERVABLE as numbers; omitted obvious Owner intervention/false completion/duplicate/stale-state episodes; mutable refs used as immutable evidence; correct exact intended identity binding for CI/Review/artifacts; and loss of identity/provenance/freshness checks after compaction/resume.

APPLICABLE with no evidence decision is `RESEARCH_EVIDENCE_CAPTURE_MISSING`. Implementation results may remain, but formal Review/Closeout cannot complete until material assessment and existing-evidence indexing are filled in.

### 14B.9 Capability exposure/reachability research signals

These observed events default to research candidates; retain bounded evidence or explicitly mark NOT_OBSERVABLE:

```text
IMPLEMENTED_BUT_UNREACHABLE
VISIBLE_BUT_NOT_WIRED
VISIBLE_WRONG_SEMANTICS
DISCOVERABILITY_GAP
SURFACE_PARITY_GAP
CAPABILITY_REGISTRY_STALE
CAPABILITY_REGISTRY_REALITY_MISMATCH
DUPLICATE_IMPLEMENTATION_DUE_TO_DISCOVERY_FAILURE
```

When observable record:

```text
capability_id
implementation_completed_at
first_surface_available_at
backend_wiring_verified_at
reachability_verified_at
intent_validated_at
surface_platform
surface_location
user_steps_to_reach
owner_intervention_count
rework_required
duplicate_implementation_detected
registry_reconciliation_result
exact_implementation_sha
ui_or_e2e_evidence_ref

Exposure Lag = T(reachability_verified) - T(implementation_complete)
```

Natural records support phenomena/longitudinal evidence; classic vertical-slice practice itself is not novelty. Topic material uses the Research Institute `paper-materials/{zh-CN,en}/CAPABILITY_EXPOSURE_GAP_USER_REACHABLE_VERTICAL_SLICES_2026-10-05.md` under the same full district/institute path given above.

### 14B.10 Research rarity tiers/evidence budget

Research phenomena are not all equally important. Use preclassification in [RESEARCH_SIGNAL_WATCHLIST.yaml](../RESEARCH_SIGNAL_WATCHLIST.yaml); do not promote ordinary engineering practice to novelty independently.

```text
G1_MATURE        → MINIMAL
G2_CROWDED       → STANDARD
G3_SPARSE_ACTIVE → PRIORITY
G4_RARE_SYSTEMIC → MAXIMUM_BOUNDED
```

#### G1 — Mature engineering knowledge

Examples: mutable branch/tag→exact SHA; classic vertical slice/walking skeleton; generic requirements→code traceability; ordinary Git/CI/branch-and-merge. Keep failure chains only for actual defects/rework. Add no research-only instrumentation. Use as background/control/failure cause, not primary novelty.

#### G2 — Popular but crowded

Examples: generic context compaction, execution-state memory, false completion/transparency, evolving requirements, asynchronous multi-agent, cross-model review. Normal telemetry suffices; elevate collection only at intersections with G3/G4. Never create make-work to chase fashionable directions.

#### G3 — Adjacent work exists; direct research is sparse

Priority signals: repository-resident executable work state; execution identity/provenance/freshness; structured exact-state handoff; dynamic asynchronous liveness/eligibility/wake semantics; independent review as state/evidence boundary; Registry-assisted Agent onboarding/localization; naturalistic Owner-intervention taxonomy; user-reachable completion as first-class terminal condition; passive development→research-evidence pipeline.

For G3 retain where possible:

```text
before_state
after_state
exact SHA / run ids
event timeline
agent/model/harness
Owner intervention
handoff/resume
task transitions
independent review
quantitative delta
research refs
```

#### G4 — Very few complete cases/system studies

Highest priorities: unified repository control plane; capability state implementation→wiring→reachability→intent; autonomy survival until Owner intervention; MissionBook/Registry/Git/CI/UI control-plane reality drift. In addition to G3 fields retain:

```text
authority surfaces
state transitions
conflicting truths
event ordering
wake / role-eligibility changes
user-reachability path
exact evidence binding
control-plane rule version
counterfactual / replay / ablation opportunity
```

Bounded evidence remains mandatory: no hidden chain-of-thought, unbounded raw logs, or sensitive credentials.

### 14B.11 Watchlist hits/unclassified signals

Record observed signals in workbooks/reports:

```text
research_watchlist_hits = [RS-...]
highest_research_grade_observed = G1_MATURE | G2_CROWDED | G3_SPARSE_ACTIVE | G4_RARE_SYSTEMIC
research_capture_level = MINIMAL | STANDARD | PRIORITY | MAXIMUM_BOUNDED
```

For phenomena outside the watchlist use `UNCLASSIFIED_CANDIDATE`. Record observation/evidence only; construction Agents must not invent G3/G4 ratings. Formal upgrades require later literature review.

### 14B.12 Primary paper-story policy

City's default main story is no longer “larger context/better compaction”. Default thesis:

> **Reliable long-horizon coding requires a persistent software-engineering control plane, not merely a capable model or larger context.**

Prioritize durable work state, exact execution identity, evidence provenance, dynamic liveness, user-reachable capability state, and human intervention. Treat compaction, model switch, branch movement, CI wait, handoff, external blockers, and evolving requirements as **stressors/conditions**, unless later literature audit elevates them. Strategy snapshot: Research Institute `paper-materials/{zh-CN,en}/RESEARCH_PRIORITY_STRATEGY_2026-10-05.md` under the full district/institute path above.

### 14B.13 Second-scan G3 capture

After the second literature scan, these generic directions are G2 and no longer independently receive high-priority instrumentation: AGENTS.md/repository-rule learning; long-horizon maintenance/technical debt; merge conflict/concurrent editing; abstention/action bias; logging/observability debt; plain intervention count.

Three new G3 priorities:

#### A. `RS-G3-RULE-LIFECYCLE-DEBT`

When real failures cause global/engineering-book rules to be added, changed, narrowed, superseded, or removed, retain where possible:

```text
rule_id_or_section
rule_version_sha
source_failure_ref
introduced_at
supersedes_or_conflicts_with
scope
future_activation_count_if_known
recurrence_prevented_if_observable
false_block_or_unnecessary_restriction
retired_or_superseded_at
retirement_reason
```

Record rule provenance, lifespan, conflicts, and governance debt, not merely “a rule was added”.

#### B. `RS-G3-SUPERVISION-ATTENTION`

Classify Owner interventions beyond counting:

```text
HIGH_VALUE_DECISION
AVOIDABLE_TECHNICAL_ESCALATION
REPEAT_CLARIFICATION
APPROVAL_ONLY
RECOVERY_REQUIRED
AMBIGUOUS_REQUIREMENT
PERMISSION_OR_VALUE_JUDGMENT
```

When observable record whether existing rules/evidence could resolve it automatically, whether batching was possible, whether one Owner reply restored autonomy, repeated root causes, bounded diagnosis before escalation, and escalation→autonomy-resumed time.

#### C. `RS-G3-SEMANTIC-INTEGRATION`

Ordinary Git conflict is G2. For `clean textual merge + component CI green + integrated semantic failure`, prioritize:

```text
accepted_source_shas
integration_sha
component_evidence_refs
violated_semantic_invariant
why_component_checks_missed_it
capability/ownership/dependency drift
registry/runtime mismatch
user-intent regression
repair_and_revalidation
```

Recommended labels:

```text
TEXTUALLY_CLEAN_SEMANTIC_CONFLICT
ACCEPTED_CAPABILITY_OVERWRITTEN
DEPENDENCY_UNION_SEMANTIC_MISMATCH
POST_MERGE_REGISTRY_RUNTIME_MISMATCH
POST_MERGE_USER_INTENT_REGRESSION
```

### 14B.14 City Work Monitor/JEV observability and Decision evidence

For monitor-observable tasks or automatic retry/reroute/reassign/review/escalation transitions, capture whether observation/decision layers themselves change autonomy quality, beyond existing §14B fields.

```text
Observation = continuous / sidecar / non-authoritative
Decision    = event-triggered / per-task / asynchronous
Monitor     = projection of canonical truth
```

Prohibited: synchronous model decisions for every task report; JEV/Monitor global execution locks; one stuck decision queue stopping other tasks; dashboard-created second task/device/review/capability truth; overview hiding still-active warning/block/retry risk.

Prioritize observable fields:

```text
canonical_event_id
observed_at
projected_at
projection_latency_ms
active_risk_present
risk_bubbled_to_overview
false_safe_summary
edge_type
edge_reason_complete
decision_id
decision_source
decision_queue_wait_ms
decision_latency_ms
decision_timeout_or_fallback
escalation_reason
owner_intervention_required
autonomy_resumed_after_decision
unrelated_task_blocking
monitor_reconciliation_result
navigation_steps_to_cause_or_evidence
```

Suggested labels:

```text
MONITOR_SYNC_BARRIER
MONITOR_REALITY_DRIFT
SUMMARY_HIDES_ACTIVE_RISK
EDGE_CAUSALITY_MISSING
DECISION_PROVENANCE_MISSING
DECISION_TIMEOUT_GLOBAL_IMPACT
DASHBOARD_BECOMES_SECOND_TASK_TRUTH
```

Watchlist grading: generic Agent dashboard/topology graph/logs = G2; hierarchical risk bubbling, edge causal observability, observe/decide decoupling, decision escalation provenance = G3. A City-wide dashboard alone cannot create G4; record the corresponding existing G4 only if it actually supports system evidence for unified control plane/autonomy survival/multi-truth reality drift. Topic: Research Institute `paper-materials/{zh-CN,en}/CITY_WORK_MONITOR_OBSERVATION_DECISION_2026-10-05.md` under the full path above.

## 14C. Capability Registry Chained Update Gate

`capability-registry/` is City's long-term capability register, implementation locator, and user-exposure map.

```text
Mission Book
= what should be built / claimed / reviewed next

Capability Registry
= what capability currently exists,
  where it is implemented,
  what the user can actually see/control,
  and what exact evidence proves that state
```

Update both in a chain; do not allow sustained drift into two truths.

### 14C.1 Declare at work start

For every new/substantially modified capability record:

```text
capability_ids
capability_registry_action = CREATE | UPDATE | BACKFILL | VERIFY_ONLY | NOT_APPLICABLE
capability_registry_refs
capability_registry_sync_status
```

Assign immutable `CAP-<DOMAIN>-<NNN>` during design if no ID exists. Do not assign CAP IDs to every ordinary helper/function: units are capabilities with product/system semantics.

### 14C.2 Mandatory four-dimensional state separation

Registry cannot say only `COMPLETE=true`. Maintain at least:

```text
implementation_status
backend_wiring_status
user_reachability_status
intent_validation_status
```

`implementation = COMPLETE; reachability = MISSING` is legitimate and must be honestly represented.

### 14C.3 Development chained update

Changes to implementation paths/symbols/APIs/actions, semantics, exposure class, user-visible information, direct control, surface location, platform parity, or implementation/entry/wiring/intent state require corresponding Registry candidate updates or an exact diff in reports explicitly pending Review reconciliation. **Product code completion without Registry update is not Development closeout completion.**

### 14C.4 Formal Review chained reconciliation

Independently verify claimed implementation↔actual exact-SHA implementation; claimed surface↔discoverable UI/runtime surface; claimed wiring↔canonical backend behavior; claimed intent status↔observed accepted user semantics.

Code changes without Registry sync: `CAPABILITY_REGISTRY_STALE`. Claimed entries/behavior missing or inconsistent in reality: `CAPABILITY_REGISTRY_REALITY_MISMATCH`. Both block formal Review/Closeout.

### 14C.5 Exact identity

Verified Registry records include implementation repo, paths/symbols, source workbooks, last verified **40-character full SHA**, and UI/E2E/backend evidence refs. Branch/tag is discovery only, never capability verification identity.

### 14C.6 Legacy bootstrap

`mission-book/finished/completed-2026-10-06/capability-entry-closeout/CAPABILITY_ENTRY_MATRIX.md` is Registry bootstrap evidence, not a permanent second registry. CEX continues existing exposure-debt work; CEX-790 backfills/aligns final verified inventory into `capability-registry/`. Old unbackfilled capabilities may remain `LEGACY_BACKFILL_PENDING`. Any later workbook touching one must also complete its Registry backfill/reconciliation. Never fill the Registry quickly by copying historical tables lacking exact-head verification.

### 14C.7 Data boundaries

Registry retains **current verified state plus navigation/provenance**, not unbounded history logs. Historical failures, repairs, Owner interventions, and measurements remain in Utopia runtime/evolution evidence, Mission Book reports, and Research Institute paper-materials. Registry references evidence only.

### 14C.8 Completion gate

New/substantially modified capability tasks cannot formally complete until all hold: Registry record created/updated/backfilled; exact implementation SHA bound; §14A exposure decision consistent; backend wiring and user reachability consistent; intent validation honest; required surface/evidence refs traceable; and Formal Review completes Registry↔runtime reconciliation.

```text
CAPABILITY_IMPLEMENTED != CAPABILITY_REGISTRY_RECONCILED != PRODUCT_COMPLETE
```

None substitutes for another.

## 15. Permanent lifecycle of this file

`CONSTRUCTION_RULES.md` is persistent Mission Book infrastructure. New tasks inherit it by default; new workbooks explicitly link it; README links rather than copies the rules. **Never move it to `finished/` at phase completion** or process it during finished cleanup. Update rules in place and explain why in commit messages; Git history preserves versions. Even a complete future replacement stays at this path instead of creating and archiving a “rules book for this round”. This prevents archiving safeguards with the very round that exposed their motivating failures.
