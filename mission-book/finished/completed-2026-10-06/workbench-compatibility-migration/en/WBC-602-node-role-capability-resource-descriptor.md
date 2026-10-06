> Reading translation / 阅读译本. Canonical workbook remains authoritative; no active frontmatter or new task authority is created.

[Canonical workbook](../WBC-602-node-role-capability-resource-descriptor.md)

Original metadata, quoted only:

```yaml
workbook_id: WBC-602
phase: WORKBENCH_COMPATIBILITY_MIGRATION
sequence: 602
execution_enabled: true
status: COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["9f3e20e8ec99d591812430bee71d27e68c4ad498"]
dependency_source_workbooks: []
dependency_source_shas: []
development_baseline_sha: "0e9bea3ce739b979e582a428af8fb233045a5e75"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-05): baseline_anchor_mode=REMOTE_REF_EXACT_SHA_AT_CLAIM executed literally. `git fetch origin main` in zhiheng-zhang-Mera/utopia resolved refs/heads/main to the full SHA 0e9bea3ce739b979e582a428af8fb233045a5e75 (commit time 2026-10-05T00:23:19+11:00, 'Merge pull request #13 from zhiheng-zhang-Mera/fix/Alien-codex-host-inventory-retry'). required_ancestor_shas[0]=9f3e20e8ec99d591812430bee71d27e68c4ad498 verified with `git merge-base --is-ancestor` -> ANCESTOR_OK, so no BASELINE_ANCESTRY_MISMATCH. Required CI on exactly that sha, read from the Actions API and matched on headSha rather than from the generated UTOPIA_LIVE_STATUS.json: 'V0.2 checks' run 37205444427 COMPLETED SUCCESS and 'City linkage check' run 37205444385 COMPLETED SUCCESS. INDEPENDENCE FROM WBC-601 MEASURED, NOT ASSUMED: WBC-601's branch wbc/WBC-601-execution-backend-contract is NOT an ancestor of this baseline (its head d65dbd3af2d8903aca13726f74110e1f2f6b9b65 is unreviewed and unmerged), so WBC-602 is built on main WITHOUT that seam, exactly as the programme's 'WBC-601 and WBC-602 may be developed in parallel but must never sibling-merge' rule requires. Development worktree: D:/utopia-wbc602 on branch wbc/WBC-602-node-descriptor, created from the resolved baseline SHA. THE SHARED HOT FILE IS services/dev-gateway/server.mjs: WBC-601 relocated the node/claim and node/report route bodies into services/dev-gateway/execution-backend/standard-devices.mjs, and WBC-602 must NOT copy that relocation; it will therefore keep its own change additive and confined to the descriptor projection plus the registration path, leaving the claim decision where main has it."
baseline_blocker: null
dependencies: ["MESH-301:THREE_END_MESH_E2E_ACCEPTED"]
development_host: "Mech"
development_branch: "wbc/WBC-602-node-descriptor"
research_evidence_applicability: "APPLICABLE"
long_horizon_context_evidence: "CAPTURED"
research_evidence_refs: ["mission-book/reports/WBC-602/PAPER_MATERIAL_INDEX.md"]
state_identity_evidence: "CAPTURED"
state_identity_evidence_refs: ["mission-book/reports/WBC-602/PAPER_MATERIAL_INDEX.md"]
development_head_sha: "c312a60b4d73f02597bde1f106372b253067fe33"
development_ci: "V0.2 checks run 37206331839 COMPLETED SUCCESS on headSha c312a60b4d73f02597bde1f106372b253067fe33 (jobs: gateway-web success, android success), read from the Actions API and matched on headSha. No earlier failed run on this branch. Local pre-push evidence on the same head, after the repaired projection defect recorded in reports/WBC-602/DEVELOPMENT_REPORT.md section 5: 13/13 new tests pass; pnpm test 1250 tests / 1247 pass / 3 fail where all 3 are the pre-existing host-city-launcher environmental block (a resident City holds coordination port 4389 on this host, and those tests refuse to run by design); city/test-all.mjs 1984 tests / 1977 pass / 7 skipped / 0 fail; apps/rooms 69/69; check-bilingual SYNCHRONIZED; verify-promotion-history 10 records verified."
development_complete: true
review_host: Alien-codex
review_head_sha: "d99101fdac5169aad74ae84fb7c0c25be43ad7d9"
review_ci: "V0.2 checks run 37211820065 COMPLETED SUCCESS on exact d99101fdac5169aad74ae84fb7c0c25be43ad7d9; gateway-web and android success"
review_complete: true
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/WBC-602
terminal_marker: NODE_CAPABILITY_RESOURCE_COMPAT_ACCEPTED
user_exposure_class: INTERNAL_ONLY
ui_exemption_reason: "Foundation descriptor metadata with no new ordinary user verb; explicit Capability Registry contract exemption"
merged_main_sha: "52e66f3752b40c1754297174627f2c647f641f4c"
merged_main_ci: "required CI on the merge/integration head; the JOIN-590 closeout integration head e111eb2787e7464385b4b59e62e954ac1f5f678e was verified locally at 1329/1332 with only the three known resident-City host-city-launcher failures, and the same head was pushed to main for hosted CI."
merged_main_via: "PR #18"
merge_authority_note: "Owner instruction 2026-10-05: update the mission-book statuses and perform the Utopia merges for the workbooks that pass (complete development + completed opposite-host review + exact-head CI green), then wait for CI. Merged by Mech (Mech-DS) under that instruction; the workbooks themselves declare merge_authority: false, so the authority for these merges is the owner ruling, recorded here rather than by editing the declaration."
```

Standing rules: [construction](../../../../CONSTRUCTION_RULES.md), [asynchronous relief](../../../../ASYNC_RELIEF_CONSTRUCTION.md), [programme](../README.md).

# WBC-602 — Backward-Compatible Node Role / Capability / Resource Descriptor

## Goal

Allow future scheduling to choose endpoints by node capabilities, sufficient resources and current availability rather than Alien/Mech/Windows machine names. Old nodes and tasks must continue working without any new fields.

Target data semantics:

```text
NodeDescriptor
├─ stable identity
├─ roles[]
├─ capabilities[]
├─ platform
├─ resources
│  ├─ cpu
│  ├─ memory
│  ├─ gpu / accelerator
│  ├─ vram
│  ├─ disk
│  └─ network hints
├─ current load / availability
├─ health / readiness
└─ trust reference

TaskRequirements (optional)
├─ required capabilities[]
├─ preferred capabilities[]
├─ platform constraints[]
├─ resource minima
├─ accelerator requirement
└─ execution preference
```

The first version need not precisely measure every hardware indicator. Focus on a stable contract, optional fields and legacy defaults.

## Minimum role model

Distinguish these roles and allow multiple roles:

- `EXECUTION_NODE`
- `CONTROL_SURFACE`
- `VALIDATION_NODE`
- `SERVER_NODE`
- `STORAGE_NODE`
- `ACCELERATOR_NODE`

Represent current actual semantics:

```text
Alien Windows = EXECUTION_NODE + VALIDATION_NODE
Mech Windows  = EXECUTION_NODE + VALIDATION_NODE
Android       = CONTROL_SURFACE
```

Adding a schema must not automatically register Android as a worker.

## Hard backward-compatibility rules

1. New fields are optional by default.
2. A compatibility translator produces conservative descriptors from old node records.
3. Old tasks without `TaskRequirements` retain current STANDARD_DEVICES behavior.
4. Missing telemetry means UNKNOWN / UNSPECIFIED, not zero resources or unhealthy.
5. Capability/resource data creates no second trust/identity system.
6. Strict targets refer to stable node identities; generic capability routing cannot override them.

## Allowed change boundary

- Additive node/capability registry schema.
- Execution requirement descriptors.
- Compatibility/default translation.
- Bounded resource/readiness reporting.
- Tests, serialization and migration compatibility.

## Prohibited change boundary

- Complex cluster schedulers.
- Requiring real Linux.
- Requiring real GPU load scheduling.
- Deleting old fields.
- Irreversible database migrations.
- Turning resource reports into authority.
- Changing existing Device trust ownership.

## Formal Review

Another physical host attacks with old data and missing-field data:

- Can old node records still start/register?
- Can old tasks still execute?
- Are unknown resources incorrectly judged unavailable?
- Is Android misclassified as an execution node?
- Does strict target still take priority?
- Are descriptors stable after serialization/restart?

## Completion gate

1. Stable descriptor contract exists.
2. Legacy translation/default exists.
3. Missing fields do not invalidate old nodes/tasks.
4. Current Alien/Mech/Android role truth is correctly expressible.
5. No real Workbench dependency.
6. Opposite-host Review PASS.
7. Exact-head CI green.
8. Terminal marker `NODE_CAPABILITY_RESOURCE_COMPAT_ACCEPTED`.

## Reports

- `mission-book/reports/WBC-602/DEVELOPMENT_REPORT.md`
- `mission-book/reports/WBC-602/REVIEW_REPORT.md`

Development may run parallel with WBC-601, without sibling merges. If a shared hot file conflicts, the later claimant must avoid it under standing rules; never duplicate canonical implementation.
