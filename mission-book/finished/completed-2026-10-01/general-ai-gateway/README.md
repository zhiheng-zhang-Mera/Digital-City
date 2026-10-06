# General AI Gateway Engineering / 通用 AI 网关工程

<!-- COMPONENT-STAGE-STATUS -->
> **Component stage (2026-10-01) — General AI Gateway: 9/9 two-stage complete.** Corrected heads and hosted-CI evidence are recorded in each task workbook frontmatter and `../reports/<ID>/CORRECTION_REPORT.md`.
> **Merge stage (2026-10-01) — General AI Gateway: MERGED to Utopia main and CI green.** Merge workbook: [GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md](./GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md). Terminal state `GENERAL_AI_GATEWAY_MERGED_MAIN_CI_GREEN` is satisfied; all nine `archive/GAI-0XX` tags preserve the corrected branch heads and the nine `general-ai-gateway/*` remote branches are deleted.
<!-- /COMPONENT-STAGE-STATUS -->

This folder defines the asynchronous two-host engineering programme for **General AI Gateway**.

## Architectural identity

General AI Gateway is the City-wide external general-AI access layer for Utopia. Its target City ownership is reserved as:

```text
00 City Foundation
└─ General AI Gateway
```

The implementation target is `Utopia/city/00-foundation/06-general-ai-gateway/`. The City directory/building is promoted only when implementation is ready; the Mission Book may reserve the ownership boundary before promotion.

It answers:

- which general-AI provider/model/account is available;
- whether a request should stay local, use lightweight JEV triage, use Web AI, use another trusted device's Web AI, or propose API escalation;
- how Web/API requests, conversations, attachments, partial output, cancellation, health and provenance are normalized;
- how remote execution changes the execution host without changing the user's interaction device.

It does **not** own Assistant identity/personality/memory, Engineering execution, Computer Use primitives, Remote Fabric transport, City authority, Knowledge truth or device trust.

## Tombstone rule — Codex-Boss is not a dependency

Codex-Boss is a historical tombstone only.

Hard rules:

- do not clone, fetch, open, read or query the Boss repository while executing this programme;
- do not import/link/submodule/symlink/package against Boss;
- do not call a running Boss process, endpoint, database, browser profile or IPC surface;
- do not make CI/tests/startup depend on Boss being present;
- do not use `BOSS` as a long-term Action route.

If a legacy behavior remains useful, it must re-enter only as **Utopia-owned code** implemented from current accepted City requirements/Utopia behavior or from an explicit Owner-supplied excerpt. Copying an excerpt is not permission to preserve a runtime dependency.

## V1 routing policy

The default priority is:

```text
P0  deterministic/local Utopia route
P1  optional JEV semantic triage
P2  current-device Web AI
P3  propose another trusted device's Web AI
P4  propose API switch and ask the user
P5  Budget Policy
P6  API execution
```

Invariants:

1. Web is the default general-AI channel.
2. JEV is a lightweight classifier/judge only; it cannot execute actions, grant authority or become canonical task truth.
3. JEV failure must degrade to deterministic/manual routing, not block the terminal.
4. Web failure MUST NOT silently trigger API.
5. API escalation requires explicit user confirmation before Budget Policy evaluates/admits the run. An explicit user command to use API counts as that confirmation.
6. Budget approval is necessary but never substitutes for user consent.
7. Current-device Web is preferred. Another device may be recommended only from already-known presence/readiness state; discovery must not launch duplicate AI jobs as a probe.
8. Device handoff is user-confirmed in V1.
9. `interactionDevice != executionDevice` is valid. The user stays on the current interaction device.
10. Remote status, progress, partial output, final result, errors and attention requests return to the canonical Action surface on the interaction device.
11. Cancellation/control must work from any authorized device that can view the canonical Action.
12. Remote execution uses semantic RPC/events/streams, not cross-device mouse-coordinate scripts or mandatory remote-desktop video.
13. Same-provider channel/device changes may be proposed; changing provider/model is explicit policy/provenance and must not be silently disguised as the same brain.

## Stable programme ports

Sibling branches code against these semantic ports rather than each other's implementation.

### GeneralAiGatewayPort

```text
submit(request) -> action/ref
status(actionId)
cancel(actionId)
subscribe(actionId)
listProviders()
listModels(provider/account?)
listAccounts(provider)
getConversation(conversationId)
```

### JevTriagePort (optional)

```text
assess(request) ->
  intent
  complexity: TRIVIAL | NORMAL | HARD
  risk: LOW | MEDIUM | HIGH
  route recommendation
  confidence
  needsGeneralAI
  preferredChannel
```

JEV output is advisory. City/Utopia policy owns execution.

### RemoteExecutionPort

```text
listCandidateEndpoints(requirements)
dispatch(actionId, executionRequest)
subscribe(actionId)
cancel(actionId)
requestAttention(actionId)
```

The Remote Fabric owns trust/transport. GAI owns the semantics of a general-AI execution request/result.

## Canonical V1 data boundaries

At minimum reserve versioned contracts for:

- `GeneralAIRequest`;
- `InputBundle { text, files[], images[], references[], contextRefs[] }`;
- `ProviderDescriptor`, `ModelDescriptor`, `ProviderAccount`;
- `Channel = WEB | API`;
- `Conversation` with a Utopia canonical ID and backend thread/session references;
- `PartialResult` / stream events;
- `ResultEnvelope`;
- `AttentionRequest`;
- `DeviceSwitchProposal`;
- `ApiSwitchProposal`;
- `EscalationReceipt`;
- `UsageRecord` / budget metadata;
- typed provider/channel health and errors.

Secrets/cookies/raw tokens are never canonical shared state. Store only bounded references/handles appropriate to the platform credential/profile store.

## Asynchronous two-host construction

Frozen Utopia baseline for every GAI branch:

`82ed36933fb4c5b00e44768d9e1aedec1d525d9c`

Every GAI task follows **Development -> Correction** on one task branch:

- Development and Correction use different physical hosts;
- Alien and Mech may develop different GAI tasks simultaneously;
- a host may continue another independent task while a sibling branch is in CI or waiting on an external condition;
- correction becomes eligible as soon as that task's Development is green; there is no programme-wide Development barrier;
- if a task/stage is already claimed and incomplete, choose another eligible task/stage;
- prefer unclaimed Development, then eligible Correction owned by the other host;
- use separate worktrees/branches when one host works on more than one task;
- no sibling GAI branch is merged into another during construction.

The purpose is to keep both lines productive without weakening independent correction.

## Queue

| ID | Subproject | Development | Correction | Merge |
|---|---|:---:|:---:|:---:|
| [GAI-001](./GAI-001-core-contracts-action-vocabulary.md) | Core contracts + Action vocabulary | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-002](./GAI-002-provider-model-account-registry.md) | Provider/model/account registry | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-003](./GAI-003-web-channel-persistent-session.md) | Web-first channel + persistent sessions | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-004](./GAI-004-api-channel-consent-budget.md) | API channel + consent + budget | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-005](./GAI-005-triage-jev-routing.md) | Deterministic/JEV triage + routing policy | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-006](./GAI-006-conversation-input-stream-cancel.md) | Conversation/InputBundle/stream/cancel | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-007](./GAI-007-device-aware-remote-execution.md) | Device-aware remote execution/result return | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-008](./GAI-008-health-resilience-degradation.md) | Health/resilience/honest degradation | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-009](./GAI-009-utopia-surface-integration.md) | Ask/Do + Action + Web/Android integration | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |

## Hard merge lock

`GENERAL_AI_GATEWAY_MERGE_WORKBOOK_CREATION = SATISFIED (2026-10-01) — workbook created and executed`. All
GAI-001..GAI-009 satisfied:

- `development_complete = true`;
- `correction_complete = true`;
- Development Host != Correction Host;
- exact corrected remote branch head recorded;
- required task-local CI green;
- all blocking findings repaired.

The merge workbook integrated all corrected branches on top of the **then-current Utopia main**. It did not reset main to this frozen baseline.

## Mandatory final programme acceptance

The future merge book must prove, on the integrated candidate:

1. a simple local command never calls JEV/Web/API unnecessarily;
2. JEV can classify ambiguous lightweight requests when available and its absence is non-blocking;
3. ordinary general-AI interaction uses a persistent Web session by default;
4. Web login/session survives an allowed host restart/profile reopen and stale login is reported honestly;
5. a current-device Web request returns status/partial/final result through one canonical Action;
6. when another trusted device has the better Web endpoint, Utopia proposes the handoff, the user confirms, the remote host executes, and the **original/current interaction device** receives status/partial/final/error/attention;
7. remote cancellation from the interaction device stops/reconciles the remote execution without duplicate Action truth;
8. a genuinely hardware-bound authentication step becomes `ATTENTION_REQUIRED`; it is never disguised as remote success;
9. Web failure does not invoke API automatically;
10. API transition shows an `ApiSwitchProposal`, receives explicit confirmation, then passes Budget Policy before execution;
11. denied confirmation or denied budget causes no API call;
12. explicit user `use API` remains traceable as user-authorized channel choice;
13. conversation continuation preserves one Utopia conversation ID while backend device/channel/thread references may change;
14. InputBundle/file staging preserves digest/provenance and temporary remote staging obeys cleanup policy;
15. partial output is non-final and cannot be mistaken for a successful terminal result;
16. provider/channel failures, rate limits, auth requirements and retries remain typed and never become false success;
17. one provider/channel/device failing does not stop unrelated Rooms, City Tasks or other healthy GAI providers;
18. Web and physical Android can inspect the same canonical Action without duplicate execution;
19. source/build/runtime audit proves there is **no Boss dependency or access path**;
20. all required branch/integration/merged-main CI checks are green.

Real cross-device acceptance may wait for an accepted compatible Remote Fabric public API, but this wait occurs only at final programme integration; it must not stall GAI task branches.

Required terminal state:

`GENERAL_AI_GATEWAY_MERGED_MAIN_CI_GREEN`


## Cross-programme asynchronous execution

This programme participates in the global BA/RF/GAI/EM pool defined by `../CROSS_PROGRAMME_EXECUTION_CONTRACT.md`. Alien and Mech are both available and GAI tasks may be claimed immediately.

- Component branches never wait for Remote Fabric implementation; stable RemoteExecutionPort doubles are sufficient for component Development/Correction.
- Real provider/login and real two-device transport proof are programme-integration gates. If temporarily unavailable, record the seam and keep draining the global component pool.
- Waiting CI/external checks do not idle a host; use separate worktrees and claim another eligible stage.
- GAI-001..GAI-009 drained, and the GAI merge workbook has been created and run. Everything possible was integrated on then-current main; the real provider/login and real two-device transport seams remain parked exactly as the individual reports record them.

## Component stage status — 2026-10-01

GAI-001..GAI-009 are **9/9 two-stage complete**: every task was developed by Mech and corrected by Alien on
opposite physical hosts, with a pushed corrected head, hosted CI green and a correction report under
`../reports/<ID>/CORRECTION_REPORT.md`. The round the Owner requested closed GAI-009 (head `4e65e26`, run
36820218698), whose correction report records six repaired mechanisms, eleven Alien regressions and the
author-encoded canonical-reference boundary.

## Merge stage status — 2026-10-01

The GAI merge workbook [GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md](./GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md) was
created and executed against then-current `main`:

```text
source main         = 49914d9 (BA + RF unions already on main)
integration branch  = merge/general-ai-gateway-integration
integration head    = a47e4eb   CI 36828980482 success
main merge commit   = 74b37cf   CI 36829232339 success
archive tags        = archive/GAI-001 .. archive/GAI-009 (9 annotated tags, each on its corrected head)
remote branches     = general-ai-gateway/* : 0 remaining (deleted after tagging)
```

`GAI-001` and sibling tasks shared `services/dev-gateway/actions.mjs` (+80/−6); the union kept every
programme's additions rather than letting one branch overwrite another. Terminal state
`GENERAL_AI_GATEWAY_MERGED_MAIN_CI_GREEN` is satisfied. Real provider/login proof and real two-device transport
proof remain **programme-integration gates** and are still open: no hosted run in this merge claimed a real
provider acceptance, and the correction reports record `REAL_PROVIDER_ACCEPTANCE_PENDING`-style seams rather than
fabricating one. Merging code is not evidence of a real provider run and no such claim is made here.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **11**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|

### 本目录说明 / Local documents

- [GAI-001-core-contracts-action-vocabulary.md](GAI-001-core-contracts-action-vocabulary.md)
- [GAI-002-provider-model-account-registry.md](GAI-002-provider-model-account-registry.md)
- [GAI-003-web-channel-persistent-session.md](GAI-003-web-channel-persistent-session.md)
- [GAI-004-api-channel-consent-budget.md](GAI-004-api-channel-consent-budget.md)
- [GAI-005-triage-jev-routing.md](GAI-005-triage-jev-routing.md)
- [GAI-006-conversation-input-stream-cancel.md](GAI-006-conversation-input-stream-cancel.md)
- [GAI-007-device-aware-remote-execution.md](GAI-007-device-aware-remote-execution.md)
- [GAI-008-health-resilience-degradation.md](GAI-008-health-resilience-degradation.md)
- [GAI-009-utopia-surface-integration.md](GAI-009-utopia-surface-integration.md)
- [GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md](GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md)

<!-- DOCUMENT_NAVIGATION:END -->
