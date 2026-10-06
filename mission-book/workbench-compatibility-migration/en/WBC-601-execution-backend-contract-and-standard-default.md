> Reading translation / 阅读译本. Canonical workbook remains authoritative; no active frontmatter or new task authority is created.

[Canonical workbook](../WBC-601-execution-backend-contract-and-standard-default.md)

Original metadata, quoted only:

```yaml
workbook_id: WBC-601
phase: WORKBENCH_COMPATIBILITY_MIGRATION
sequence: 601
execution_enabled: true
status: COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["9f3e20e8ec99d591812430bee71d27e68c4ad498"]
dependency_source_workbooks: []
dependency_source_shas: []
development_baseline_sha: "612c344f9f2b06a67b2645b4662d97750dd7c44e"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-04): baseline_anchor_mode=REMOTE_REF_EXACT_SHA_AT_CLAIM was executed literally. `git fetch origin main` in zhiheng-zhang-Mera/utopia resolved refs/heads/main to the full SHA 612c344f9f2b06a67b2645b4662d97750dd7c44e (commit time 2026-10-04T23:48:42+11:00, 'Merge pull request #11 from zhiheng-zhang-Mera/codex/city-members-host-roles'). required_ancestor_shas[0]=9f3e20e8ec99d591812430bee71d27e68c4ad498 was verified with `git merge-base --is-ancestor` -> ANCESTOR_OK, so no BASELINE_ANCESTRY_MISMATCH. The same fetch also confirmed the two other accepted heads still exist as ancestors of main: ec12fd0831f31fd81aef9cd9dfb0c959d010f63b -> ANCESTOR_OK and 69a097b5394a9fece39dd11cc13f04c9b4d28bfe -> ANCESTOR_OK. Required CI on exactly that sha: 'V0.2 checks' run 37203397283 COMPLETED SUCCESS and 'City linkage check' run 37203397272 COMPLETED SUCCESS, both on headSha 612c344f9f2b06a67b2645b4662d97750dd7c44e (read from the Actions API, not from UTOPIA_LIVE_STATUS.json, so a stale generated file cannot substitute for the measurement). Dependency MESH-301:THREE_END_MESH_E2E_ACCEPTED is satisfied because the accepted merged baseline 9f3e20e8ec99d591812430bee71d27e68c4ad498 is an ancestor of the resolved baseline and the archived workbook records terminal_marker THREE_END_MESH_E2E_ACCEPTED. Development worktree: D:/utopia-wbc601 on branch wbc/WBC-601-execution-backend-contract, created from the resolved baseline SHA."
baseline_blocker: null
dependencies: ["MESH-301:THREE_END_MESH_E2E_ACCEPTED"]
development_host: "Mech"
development_branch: "wbc/WBC-601-execution-backend-contract"
development_head_sha: "d65dbd3af2d8903aca13726f74110e1f2f6b9b65"
development_ci: "V0.2 checks run 37205291447 COMPLETED SUCCESS on headSha d65dbd3af2d8903aca13726f74110e1f2f6b9b65 (jobs: gateway-web success, android success); earlier run 37204673910 on the superseded head 9f9db6384779e75f51ec317074238c139e1de609 FAILED gateway-web on a defect in this task's own new test, repaired in d65dbd3 and recorded in reports/WBC-601/DEVELOPMENT_REPORT.md section 10"
development_complete: true
research_evidence_applicability: "APPLICABLE"
long_horizon_context_evidence: "CAPTURED"
research_evidence_refs: ["mission-book/reports/WBC-601/PAPER_MATERIAL_INDEX.md", "mission-book/reports/WBC-601/DEVELOPMENT_REPORT.md", "06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/paper-materials/en/LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md", "06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/paper-materials/en/LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md"]
review_host: Alien-codex
review_head_sha: "f66db60998343bf99243621cfcfa2363a4566db8"
review_ci: "https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37208400707"
review_complete: true
capability_ids: [CAP-EXECUTION-001]
capability_registry_action: BACKFILL
capability_registry_refs: ["capability-registry/records/CAP-EXECUTION-001.yaml"]
capability_registry_sync_status: RECONCILED
user_exposure_class: INTERNAL_ONLY
ui_exemption_reason: "Foundational execution backend seam; existing task controls remain authority, no new user execution verb"
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/WBC-601
terminal_marker: EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED
```

Standing rules: [construction](../../CONSTRUCTION_RULES.md), [asynchronous relief](../../ASYNC_RELIEF_CONSTRUCTION.md), [programme](../README.md).

# WBC-601 — Execution Backend Contract + STANDARD_DEVICES Default Compatibility Backend

This task's first goal is to freeze the already usable Windows execution path into a lasting compatible backend and prove equivalent behavior before and after wrapping.

## Goal

Establish a minimal stable execution backend seam, so upper task/action/assistant layers need not know whether execution resources come from today's Windows devices or a future Workbench.

Target structure:

```text
Shared Task Core / Engineering execution intent
                ↓
        ExecutionBackendPort
                ↓
      STANDARD_DEVICES backend
                ↓
       current accepted path
```

In the first stage, `STANDARD_DEVICES` remains the default and only active backend.

## Confirmed background

- Alien and Mech are real worker nodes that completed MESH-301.
- Android is a control surface, not a worker.
- Strict target-device intent is already accepted behavior.
- Canonical task truth, leases and idempotency already exist.
- Do not reimplement these semantics under the banner of abstraction.

## Allowed change boundary

- Minimal backend interfaces/adapters around existing execution dispatch/claim paths.
- Map existing behavior to `STANDARD_DEVICES`.
- Minimal backend identity/readiness contract.
- Compatibility tests.
- Future backend registration seam, without activating a real Worker Pool.

## Prohibited change boundary

- Rewriting Shared Task Core.
- A second scheduler/task database.
- Changing strict-target semantics.
- Changing existing untargeted-task selection under STANDARD_DEVICES merely because a Workbench may exist later.
- Requiring Linux/Workbench.
- Changing pairing/onboarding semantics.
- Promoting Android to a worker.
- Opportunistic UI refactoring.

## Task-specific construction steps

### Step 1 — Claim-time baseline

Record latest Utopia main, required CI and MESH-301 accepted truth. Perform a minimal repeatable baseline probe of the current Windows path.

Claim record: Mech / `MEGA-REP`, 2026-10-04:

```text
resolved_utopia_main      612c344f9f2b06a67b2645b4662d97750dd7c44e   (full 40-char SHA, not a branch name)
required_ancestor_guard   9f3e20e8ec99d591812430bee71d27e68c4ad498 -> ANCESTOR_OK
accepted_heads_still_present
                          ec12fd0831f31fd81aef9cd9dfb0c959d010f63b -> ANCESTOR_OK
                          69a097b5394a9fece39dd11cc13f04c9b4d28bfe -> ANCESTOR_OK
required_ci_on_that_sha   V0.2 checks 37203397283 -> COMPLETED SUCCESS on 612c344f… (Actions API)
                          City linkage check 37203397272 -> COMPLETED SUCCESS on 612c344f… (Actions API)
development_worktree      D:/utopia-wbc601  branch wbc/WBC-601-execution-backend-contract
```

Why `UTOPIA_LIVE_STATUS.json` was not used as CI truth: it is generated, and at claim time still pointed to `69a097b5`, two merges behind real `main`. §7 requires remeasurement for externally evidenced tasks. The CI conclusion therefore came directly from Actions API `headSha` matching rather than a potentially stale board file. Decision hierarchy: runtime measurement outranks canonical source.

### Step 2 — Extract port around current behavior

Prefer wrappers/adapters over rewriting. Express at least:

```text
backend identity
backend readiness
candidate execution endpoints
dispatch/claim compatibility
cancel/control compatibility
result/event return compatibility
```

Let the current repository determine code structure; do not move code merely to unify names.

### Step 3 — Bind current path as STANDARD_DEVICES

Existing Alien/Mech paths continue through this backend. Old callers may first enter through a compatible facade; do not demand simultaneous changes across every business layer.

### Step 4 — Freeze behavior equivalence

Prove at least:

- Old untargeted task paths unchanged.
- Alien strict target unchanged.
- Mech strict target unchanged.
- Offline/unknown strict targets remain fail-honest.
- Android/Web control paths unchanged.
- No startup/readiness penalty when Workbench is absent.

## Formal Review

Another physical host independently checks:

1. The abstraction truly wraps old behavior without quietly replacing the scheduler.
2. STANDARD_DEVICES dispatch/claim/result outputs are equivalent to baseline.
3. No mandatory Workbench dependency was introduced.
4. Strict-target/untargeted negative controls.
5. Exact-head CI.

Actively seek counterexamples where a wrapper appears compatible but the default path has changed.

## Completion gate

1. Execution backend seam exists.
2. Current path explicitly binds to STANDARD_DEVICES.
3. STANDARD_DEVICES is default.
4. Startup/task flow remains unchanged without Workbench.
5. Strict target does not regress.
6. Opposite-host Review PASS.
7. Exact-head CI green.
8. Terminal marker `EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED`.

## Reports

- `mission-book/reports/WBC-601/DEVELOPMENT_REPORT.md`
- `mission-book/reports/WBC-601/REVIEW_REPORT.md`

Automatically inherit atomic claims, two-host independence, no-idle, typed zero-claim, 20-minute fallback rescans, exact-head evidence and integration refresh from standing rules.
