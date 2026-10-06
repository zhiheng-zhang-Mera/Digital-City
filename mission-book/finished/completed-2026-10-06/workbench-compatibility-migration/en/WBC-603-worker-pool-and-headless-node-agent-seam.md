> Reading translation / 阅读译本. Canonical workbook remains authoritative; no active frontmatter or new task authority is created.

[Canonical workbook](../WBC-603-worker-pool-and-headless-node-agent-seam.md)

Original metadata, quoted only:

```yaml
workbook_id: WBC-603
phase: WORKBENCH_COMPATIBILITY_MIGRATION
sequence: 603
execution_enabled: true
status: COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["9f3e20e8ec99d591812430bee71d27e68c4ad498"]
dependency_source_workbooks: ["WBC-601","WBC-602"]
dependency_source_shas: ["f66db60998343bf99243621cfcfa2363a4566db8","d99101fdac5169aad74ae84fb7c0c25be43ad7d9"]
development_baseline_sha: "05ff89553fdd8d3c13219a4598fc02f8c6182a65"
baseline_resolution_evidence: "mission-book/reports/WBC-603/CLAIM_RECORD.md"
baseline_blocker: null
dependencies: ["WBC-601:EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED", "WBC-602:NODE_CAPABILITY_RESOURCE_COMPAT_ACCEPTED"]
development_host: Alien-codex
development_branch: wbc/WBC-603-Alien-codex-worker-pool
development_head_sha: "f3510862cc348a99004ca5bd5d151a7b56279724"
development_ci: "https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37219829411"
development_complete: true
review_host: "Mech"
review_head_sha: "f3510862cc348a99004ca5bd5d151a7b56279724"
review_ci: "VERDICT PASS on the reviewed head. Exact-head CI re-measured by the reviewer: V0.2 checks run 37219829411 completed/success on f3510862cc348a99004ca5bd5d151a7b56279724 (gateway-web success, android success); PR22 pull-run 37219861813 success on the same head; reciprocal-contract 37219861825 success. Reviewer instruments: seven independent probes written for this review (tests/wbc603-mech-review-probes.test.mjs) 7/7 pass against a real gateway, plus the author suite unmodified 20/20 pass. One LOW finding recorded (F1: a drain that cannot establish the sharing state leaves the agent draining - fail-closed, but unrecoverable without an explicit resume); it does not block the PASS and is not repaired here. Terminal marker WORKER_POOL_AGENT_SEAM_ACCEPTED released by this review. See reports/WBC-603/REVIEW_REPORT.md."
review_complete: true
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/WBC-603
terminal_marker: WORKER_POOL_AGENT_SEAM_ACCEPTED
merged_main_sha: "3cd45f665b09b20690f05338ba7cec386ad0f486"
merged_main_ci: "required CI on the merge/integration head; the JOIN-590 closeout integration head e111eb2787e7464385b4b59e62e954ac1f5f678e was verified locally at 1329/1332 with only the three known resident-City host-city-launcher failures, and the same head was pushed to main for hosted CI."
merged_main_via: "PR #22"
merge_authority_note: "Owner instruction 2026-10-05: update the mission-book statuses and perform the Utopia merges for the workbooks that pass (complete development + completed opposite-host review + exact-head CI green), then wait for CI. Merged by Mech (Mech-DS) under that instruction; the workbooks themselves declare merge_authority: false, so the authority for these merges is the owner ruling, recorded here rather than by editing the declaration."
```

Standing rules: [construction](../../../../CONSTRUCTION_RULES.md), [asynchronous relief](../../../../ASYNC_RELIEF_CONSTRUCTION.md), [programme](../README.md).

# WBC-603 — Dormant Worker Pool Backend + Headless Node Agent Seam

Important: no real Workbench exists or is required now. Establish a seam for later direct integration, proving its contract with deterministic test doubles / local bounded agents.

## Goal

Above the WBC-601 backend contract and WBC-602 node descriptor, add a default-dormant `WORKER_POOL` backend and headless node agent contract.

Future physical Workbenches need only implement/start this contract, without another migration of Utopia's business layers.

## Minimum Headless Node Agent contract

Cover at least:

```text
register(identity, roles, capabilities, resources)
heartbeat(load, health, readiness)
claim/receive eligible work
report RUNNING / progress / result / terminal
cancel / stop
drain
resume after restart
credential/trust handle reference
version/protocol compatibility
```

Transport may reuse existing Remote Fabric / Gateway public contracts. Do not rewrite transport for this task.

## Dormant hard rule

Current default execution:

```text
STANDARD_DEVICES
```

Even with WORKER_POOL code present:

- Do not automatically connect to nonexistent servers.
- No background busy-loop discovery.
- Do not prolong ordinary Utopia startup.
- Do not turn health dashboards red because Workbench is absent.
- Do not seize current Windows tasks.
- Do not require old Windows workers to adopt the new agent to continue working.

## Test strategy

Without real Workbench hardware, use a deterministic Worker Pool double and prove at least:

1. Backend registration.
2. Fake headless nodes advertise descriptors.
3. Healthy readiness accepts bounded canary tasks.
4. Unavailability returns typed unavailable.
5. Cancel/report/result semantics align with canonical task truth.
6. Agent restart creates no duplicate execution.
7. Drained agents accept no new tasks.
8. STANDARD_DEVICES continues after fake-pool removal.

Never describe test-double PASS as real Workbench acceptance.

## Prohibited change boundary

- Full distributed cluster management.
- HA/failover primary/secondary implementation.
- Requiring Docker/Kubernetes.
- A new canonical queue.
- Worker Pool agents storing raw durable secrets in shared task state.
- Changes to current Windows bootstrap.
- Claims of physically verified Linux/macOS compatibility.

## Formal Review

Another physical host must:

- Independently construct unavailable/crash/restart/duplicate/drain attacks.
- Prove fake-pool failure cannot bring down STANDARD_DEVICES.
- Check whether the agent becomes a second task truth.
- Check for hidden startup dependencies.
- Rerun exact-head CI.

## Completion gate

1. Dormant Worker Pool backend seam exists.
2. Headless node agent contract exists.
3. Deterministic double completes bounded E2E.
4. Unavailable/crash/restart/drain behavior is fail-honest.
5. STANDARD_DEVICES remains fully operational after pool absence.
6. Opposite-host Review PASS.
7. Exact-head CI green.
8. Terminal marker `WORKER_POOL_AGENT_SEAM_ACCEPTED`.

## Reports

- `mission-book/reports/WBC-603/DEVELOPMENT_REPORT.md`
- `mission-book/reports/WBC-603/REVIEW_REPORT.md`
