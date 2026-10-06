# Engineering Manager / 工程经理 — Asynchronous Engineering Programme

<!-- COMPONENT-STAGE-STATUS -->
> **Component stage (2026-10-01) — Engineering Manager: 13/13 two-stage complete.** Corrected heads and hosted-CI evidence are recorded in each task workbook frontmatter and `../reports/<ID>/CORRECTION_REPORT.md`.
> **Merge stage (2026-10-01) — Engineering Manager: MERGED to Utopia main and CI green.** Merge workbook: [ENGINEERING_MANAGER_MERGE_WORKBOOK.md](./ENGINEERING_MANAGER_MERGE_WORKBOOK.md). Terminal state `ENGINEERING_MANAGER_MERGED_MAIN_CI_GREEN` is satisfied; all thirteen `archive/EM-0XX` tags preserve the corrected branch heads and the thirteen `engineering-manager/*` remote branches are deleted.
<!-- /COMPONENT-STAGE-STATUS -->

This folder is the permanent Mission Book name for the **Engineering Manager** programme. Future work in this capability family continues under `mission-book/engineering-manager/`; do not create a new Hns/Codex-specific mission folder for each provider.

## Architectural identity

Engineering Manager is the Utopia/Digital-City Engineering-domain foreman and worker-connector programme. It maps onto the existing 02 Engineering Works ownership rather than creating a duplicate City building:

```text
02 Engineering Works District
├─ Project Foreman / Engineering Task Orchestrator
├─ Worker Gateway / Engineering Provider Adapter Layer
├─ Host Health Station
└─ Restart Recovery Station
```

It answers:

- how Engineering work is packaged, scheduled, supervised, accepted and closed;
- how official engineering-agent products are discovered and normalized behind one connector contract;
- how local Sub-workers and external autonomous agents share one logical job/result vocabulary without pretending they have identical execution semantics;
- how Engineering execution may move to another trusted device only when the local host cannot safely run it;
- how attention, progress, control, results and artifacts always return to the user's current/shared interaction surface.

It does **not** own City-wide task authority, Remote Fabric trust/transport, Assistant identity/personality/memory, General AI chat routing, device identity, or provider reasoning internals.

## Source/reuse policy

Pinned donor snapshot:

`eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b` from `zhiheng-zhang-Mera/DS-Hns`.

The programme may reuse verified Hns concepts and code including:

- adapter framework and capability registry patterns;
- managed-process supervision and runtime ownership;
- Sub-worker Task/Result protocol concepts;
- worker pool, queue, DAG, worktree isolation and resource management;
- health scheduling, restart supervision, heartbeat/readiness and safe mode;
- provider-isolated balance/quota refresh patterns;
- skill/source validation utilities when useful as Engineering capability extensions.

Reuse means **copy/refactor into Utopia-owned implementation with provenance**. It never means a runtime link, submodule, symlink, package dependency, shared mutable data directory or requirement that DS-Hns be installed.

Codex-Boss is a historical tombstone for this programme and is not an allowed donor or dependency.

## Engineering Manager vs General AI Gateway

```text
General AI Gateway
  = user ↔ general-purpose AI conversation/consultation

Engineering Manager
  = engineering task ↔ coding/engineering worker execution
```

A provider may appear in both ecosystems, but the contracts, task semantics, permissions and ownership remain separate.

## V1 connector model

```text
Utopia / Shared Task Core
          │
          ▼
 Engineering Manager
          │
          ▼
 Execution Connector Hub
   ├─ Generic Process Connector
   ├─ DeepSeek Harness Connector
   ├─ Codex Connector
   ├─ Claude Code Connector
   ├─ WorkBuddy Connector
   └─ future adapters
          │
          ├─ local host
          └─ Remote Fabric → trusted remote host
```

### Stable ConnectorPort

```text
probe()
describe()
authStatus()
authenticate()
start()
attach()
stop()
capabilities()
submit(job)
subscribe(jobId)
pause(jobId)
resume(jobId)
cancel(jobId)
respond(attentionId, response)
result(jobId)
health()
shutdown()
```

A connector describes how to reach a worker. It does not decide the Engineering plan, choose City-wide priority or grant permissions.

## Canonical V1 envelopes

At minimum reserve versioned contracts for:

- `EngineeringJobEnvelope`;
- `ExecutionMode = AUTONOMOUS_AGENT | SCRIPTED_EXECUTOR | INTERACTIVE_AGENT`;
- target repo/workspace/branch/scope/acceptance/permissions/risk/context refs;
- `ConnectorDescriptor`, `ConnectorInstance`, `CapabilityManifest`, `AuthStatus`;
- `EngineeringEventEnvelope`;
- `AttentionEnvelope`;
- `EngineeringResultEnvelope`;
- `ArtifactEnvelope`;
- `RemoteFallbackProposal`;
- typed health/error/refusal/blocking states.

An autonomous coding agent receives objective + bounded context/scope/acceptance and may plan its own operations. A scripted Sub-worker may additionally require explicit `operations[]`. The Manager MUST NOT force both into the same execution semantics.

## Attention contract — current + recent devices

A blocking Engineering attention request is one logical event with multiple projections:

```text
worker
  ↓
connector
  ↓
ATTENTION_REQUIRED
  ↓
canonical/shared task state
  ├─ current interaction device
  ├─ recent eligible device #1
  ├─ recent eligible device #2
  └─ recent eligible device #3 (optional)
```

Hard rules:

1. The current interaction device receives the actionable projection.
2. The 2–3 most recently **user-operated** eligible online devices receive notification/ring projections.
3. One `attention_id` is shared across all projections; they are not independent questions.
4. First valid acknowledgement wins and commits `ATTENTION_ACKNOWLEDGED` globally.
5. Other projections immediately stop ringing and become non-actionable/answered.
6. Reconnect, heartbeat, UI refresh and duplicate delivery MUST NOT ring again for an already-delivered/acknowledged attention epoch.
7. Non-blocking informational events do not ring by default.
8. Device quiet/full-screen/protected-use policy may suppress sound while retaining a visible notification.
9. A remote worker's normal permission/question/auth/confirmation traffic returns through this bridge; the user is not required to walk to the execution host.
10. A genuinely hardware-bound action that cannot be mediated remotely is reported honestly as a typed physical-action requirement; it is never fabricated as success.

## Sub-worker placement contract — LOCAL_FIRST

Default:

```text
placement_policy = LOCAL_FIRST
remote_fallback = ASK_USER
```

The local host is always attempted first.

```text
LOCAL_ALLOWED      → run locally
LOCAL_THROTTLED    → run locally with reduced workers/concurrency
LOCAL_BLOCKED      → propose remote fallback
LOCAL_UNAVAILABLE  → propose remote fallback
```

Hard rules:

- A remote device MUST NOT be selected merely because it is faster, less loaded or has more hardware.
- Before remote fallback, local worker count/concurrency/resource use is reduced where safe.
- High-pressure or protected foreground workloads (for example a large game occupying CPU/GPU/VRAM) may make local execution BLOCKED when measured policy says starting the worker would materially interfere.
- Remote fallback requires explicit user approval in V1; default scope is the current job only.
- Capability matching/ranking is used **after** remote fallback becomes eligible, not as normal load balancing.

## Remote execution invariant

```text
CONTROL PLANE follows the user.
EXECUTION PLANE may move to another device.
```

A remote Sub-worker remains an embodiment of the original logical Engineering job. Changing execution host does not create a new task owner.

All of these MUST automatically return through Remote Fabric to canonical/shared state and the current authorized interaction surface:

- state/stage/progress;
- events;
- attention requests;
- logs/evidence;
- pause/resume/cancel acknowledgement;
- result;
- changed-file summaries/diffs;
- tests/acceptance;
- branch/commit/PR references;
- screenshots or other declared artifacts.

Normal successful operation MUST NOT require physical interaction with the remote execution host.

## Stable programme ports

### EngineeringManagerPort

```text
submit(job) -> jobRef
status(jobId)
subscribe(jobId)
pause(jobId)
resume(jobId)
cancel(jobId)
respond(attentionId, response)
result(jobId)
listConnectorInstances()
```

### ConnectorRegistryPort

```text
probeAll()
list(requirements?)
get(instanceId)
capabilities(instanceId)
authStatus(instanceId)
health(instanceId)
```

### EngineeringRemoteExecutionPort

```text
listEligibleRemoteHosts(requirements)
propose(jobId, candidates, reason)
dispatchApproved(jobId, hostId, executionSpec)
subscribe(jobId)
control(jobId, command)
respond(attentionId, response)
collectArtifacts(jobId)
```

Remote Fabric owns node trust, addressing and transport. Engineering Manager owns Engineering job semantics and placement policy.

## Asynchronous two-host construction

Frozen Utopia baseline for every EM branch:

`82ed36933fb4c5b00e44768d9e1aedec1d525d9c`

Every EM task follows **Development → Correction** on one task branch:

- Development and Correction use different physical hosts;
- Alien and Mech may develop different EM tasks simultaneously;
- a host may continue another independent task while sibling CI/external tests wait;
- Correction becomes eligible as soon as that task's Development is green;
- there is no programme-wide Development barrier;
- if a stage is already claimed and incomplete, choose another eligible stage;
- prefer unclaimed Development, then eligible Correction owned by the other host;
- separate worktrees/branches are required when one host works on multiple tasks;
- no sibling EM branch is merged/cherry-picked into another during construction.

Missing sibling implementations are represented by the stable ports above plus deterministic test doubles. Real multi-device proof is deferred only to final integration and may not be faked.

## Queue

| ID | Subproject | Development | Correction | Merge |
|---|---|:---:|:---:|:---:|
| [EM-001](./EM-001-core-contracts-boundaries.md) | Core contracts + ownership boundaries | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-002](./EM-002-connector-adapter-process-runtime.md) | Connector adapter framework + generic process runtime | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-003](./EM-003-job-result-artifact-protocol.md) | Job / event / result / artifact protocol | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-004](./EM-004-capability-probe-auth-registry.md) | Capability/probe/auth/instance registry | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-005](./EM-005-attention-recent-device-alerts.md) | Attention bridge + recent-device notification/ring | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-006](./EM-006-local-first-subworker-placement.md) | Local-first Sub-worker resource/placement gate | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-007](./EM-007-remote-subworker-return-control.md) | Remote Sub-worker + automatic return/control | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-008](./EM-008-credential-profile-session.md) | Credential/profile/session persistence | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-009](./EM-009-runtime-health-restart-recovery.md) | Runtime ownership + health/restart/recovery | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-010](./EM-010-foreman-scheduler-dag-worker-pool.md) | Foreman queue/DAG/resource/worker pool | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-011](./EM-011-deepseek-codex-reference-connectors.md) | DeepSeek Harness + Codex reference connectors | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-012](./EM-012-connector-sdk-claude-workbuddy.md) | Connector SDK + Claude Code/WorkBuddy extension paths | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-013](./EM-013-utopia-task-surface-integration.md) | Shared Task Core + Utopia control surface integration | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |

## Hard merge lock

`ENGINEERING_MANAGER_MERGE_WORKBOOK_CREATION = SATISFIED (2026-10-01) — workbook created and executed`. All
EM-001..EM-013 satisfied:

- Development complete and green;
- Correction complete and green;
- Development Host != Correction Host;
- exact corrected remote branch head recorded;
- all blocking findings repaired;
- any deferred external seam explicitly typed and assigned to final integration.

The merge workbook integrated corrected EM branches on top of the **then-current Utopia main**. It preserved accepted Butler, Remote Fabric, General AI Gateway and other mainline work.

## Mandatory final programme acceptance

The integrated candidate must prove:

1. Engineering Manager and General AI Gateway remain separate semantic routes.
2. A generic connector can be added without changing Foreman core dispatch logic.
3. A malformed/throwing connector cannot stop unrelated connectors or Utopia.
4. Autonomous-agent and scripted-executor jobs both work without conflating their planning semantics.
5. Canonical job/event/result/artifact IDs survive restart/reconnect and reject incompatible replay.
6. Local Sub-worker starts locally when `LOCAL_ALLOWED`.
7. `LOCAL_THROTTLED` reduces local execution instead of proposing a faster remote machine.
8. A faster idle remote host alone never triggers remote fallback.
9. Measured local `BLOCKED/UNAVAILABLE` may generate one `RemoteFallbackProposal`.
10. No remote Sub-worker starts before explicit user approval in V1.
11. Approved remote execution keeps the original logical job/owner.
12. Remote state/progress/log/result/artifact traffic automatically returns to the current/shared interaction surface.
13. Pause/resume/cancel from the interaction device controls the remote run and reconciles late/duplicate events.
14. Remote execution does not require the user to operate the remote host during normal work.
15. A blocking attention event reaches the current interaction device plus 2–3 most recently operated eligible devices.
16. Those projections share one `attention_id`; first acknowledgement closes the event globally.
17. Duplicate delivery/reconnect does not ring repeatedly.
18. Quiet/protected-use policy can suppress sound without losing the notification.
19. Remote permission/question/auth/confirmation is answerable from an authorized interaction device when the underlying platform permits mediation.
20. Truly hardware-bound physical action remains a typed blocking state, never false success.
21. Credential/session records persist references/handles rather than raw secrets in canonical shared state.
22. Connector/provider failure is isolated and health/readiness/auth remain distinct.
23. Health pressure may request recovery but does not itself own restart execution.
24. Restart budget/crash-loop/readiness/checkpoint behavior cannot duplicate or resurrect terminal jobs.
25. Queue/DAG/file ownership/worktree/resource constraints prevent unsafe concurrent writes.
26. At least the available DeepSeek Harness and Codex reference paths complete real host smoke tests; unavailable optional providers are reported honestly.
27. Shared Task Core remains canonical job truth; Engineering Manager holds execution responsibility/leases rather than creating a competing task database.
28. Web and Android can observe/control the same Engineering job without duplicate execution.
29. source/build/runtime audits prove no Codex-Boss dependency and no DS-Hns runtime/build dependency.
30. all required branch/integration/merged-main CI checks are green.

Required terminal state:

`ENGINEERING_MANAGER_MERGED_MAIN_CI_GREEN`


## Cross-programme asynchronous execution

This programme participates in the global BA/RF/GAI/EM pool defined by `../CROSS_PROGRAMME_EXECUTION_CONTRACT.md`. Alien and Mech are both available and EM tasks may be claimed immediately.

- Component branches never wait for Remote Fabric or optional provider installations. Stable ports/doubles complete bounded Development/Correction; real external proof moves to programme integration when unavailable.
- Eligible Correction by the opposite host is preferred over starting another EM Development, but either host may take work from any of the four programmes whenever that is the next eligible global stage.
- Hosted CI, long tests and provider waits do not idle the machine; retain the claim and continue another stage in a separate worktree.
- EM-001..EM-013 drained, and the EM merge workbook has been created and run. The real remote E2E seam stays parked exactly as the individual reports record it; no real provider run is claimed.

## Component stage status — 2026-10-01

EM-001..EM-013 are **13/13 two-stage complete**: every task was developed by Mech and corrected by Alien on
opposite physical hosts, with a pushed corrected head, hosted CI green and a correction report under
`../reports/<ID>/CORRECTION_REPORT.md`. The round the Owner requested closed EM-012 (head `e4afd5e`, run
36821442088; connector SDK / Claude Code / WorkBuddy extension paths) and EM-013 (head `0ef455e`, run
36822830353; Shared Task Core + Utopia control surface).

## Merge stage status — 2026-10-01

The EM merge workbook [ENGINEERING_MANAGER_MERGE_WORKBOOK.md](./ENGINEERING_MANAGER_MERGE_WORKBOOK.md) was
created and executed against then-current `main`:

```text
source main         = 74b37cf (BA + RF + GAI unions already on main)
integration branch  = merge/engineering-manager-integration
integration head    = aef657f   CI 36829755814 success
main merge commit   = e7c498f   CI 36830053908 success
archive tags        = archive/EM-001 .. archive/EM-013 (13 annotated tags, each on its corrected head)
remote branches     = engineering-manager/* : 0 remaining (deleted after tagging)
```

All thirteen EM branches were purely additive and the integration was a clean union with no conflicts. Terminal
state `ENGINEERING_MANAGER_MERGED_MAIN_CI_GREEN` is satisfied. Real third-party connector acceptance (Claude
Code, WorkBuddy) and real remote E2E remain **programme-integration gates**: the workbooks kept those products'
absence a typed `REAL_PROVIDER_ACCEPTANCE_PENDING` seam and never fabricated an installation or a run.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **15**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|

### 本目录说明 / Local documents

- [EM-001-core-contracts-boundaries.md](EM-001-core-contracts-boundaries.md)
- [EM-002-connector-adapter-process-runtime.md](EM-002-connector-adapter-process-runtime.md)
- [EM-003-job-result-artifact-protocol.md](EM-003-job-result-artifact-protocol.md)
- [EM-004-capability-probe-auth-registry.md](EM-004-capability-probe-auth-registry.md)
- [EM-005-attention-recent-device-alerts.md](EM-005-attention-recent-device-alerts.md)
- [EM-006-local-first-subworker-placement.md](EM-006-local-first-subworker-placement.md)
- [EM-007-remote-subworker-return-control.md](EM-007-remote-subworker-return-control.md)
- [EM-008-credential-profile-session.md](EM-008-credential-profile-session.md)
- [EM-009-runtime-health-restart-recovery.md](EM-009-runtime-health-restart-recovery.md)
- [EM-010-foreman-scheduler-dag-worker-pool.md](EM-010-foreman-scheduler-dag-worker-pool.md)
- [EM-011-deepseek-codex-reference-connectors.md](EM-011-deepseek-codex-reference-connectors.md)
- [EM-012-connector-sdk-claude-workbuddy.md](EM-012-connector-sdk-claude-workbuddy.md)
- [EM-013-utopia-task-surface-integration.md](EM-013-utopia-task-surface-integration.md)
- [ENGINEERING_MANAGER_MERGE_WORKBOOK.md](ENGINEERING_MANAGER_MERGE_WORKBOOK.md)

<!-- DOCUMENT_NAVIGATION:END -->
