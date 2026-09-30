# Mission Index — Global Asynchronous Engineering Pool

> Canonical static state: [PROGRAMME_STATE.yaml](./PROGRAMME_STATE.yaml)  
> Normative execution contract: [CROSS_PROGRAMME_EXECUTION_CONTRACT.md](./CROSS_PROGRAMME_EXECUTION_CONTRACT.md)  
> Unified component baseline: `82ed36933fb4c5b00e44768d9e1aedec1d525d9c`  
> Physical hosts: **Alien = AVAILABLE; Mech = AVAILABLE**  
> Global state at reset: **41 component tasks, all Development unclaimed; all Correction locked until corresponding Development completes.**

## Authority

This file is a dashboard, not a claim lock. Ordinary task claims MUST update only the target task workbook frontmatter and reports. If this dashboard lags a task workbook, the task workbook wins.

## Global dispatcher

Every free host scans BA/RF/GAI/EM together. Priority is: actionable owned repair → eligible opposite-host Correction → unclaimed Development anywhere. Waiting CI/provider/external checks do not idle a host; use another worktree and keep claiming.


## Butler Assistant

| ID | Subproject | Development | Correction | Merge |
|---|---|---|---|---|
| [BA-001](./butler-assistant/BA-001-butler-zone-personalization.md) | Butler Zone + personalization contracts | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [BA-002](./butler-assistant/BA-002-shared-brain-runtime.md) | Shared Brain runtime + context projection | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [BA-003](./butler-assistant/BA-003-device-embodiment-binding.md) | Device embodiment + foreground binding | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [BA-004](./butler-assistant/BA-004-multi-assistant-handoff.md) | Multi-assistant switch + explicit handoff | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [BA-005](./butler-assistant/BA-005-digital-me-context-gateway.md) | Digital-Me context + memory/audience gateway | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [BA-006](./butler-assistant/BA-006-shared-task-coordination.md) | Authoritative task coordination | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [BA-007](./butler-assistant/BA-007-settings-interaction-surface.md) | Assistant settings + interaction surface | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [BA-008](./butler-assistant/BA-008-embodiment-event-bus.md) | Event bus + execution lease/reconnect safety | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [BA-009](./butler-assistant/BA-009-duty-permission-policy.md) | Duties / permission / proactivity policy | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |

## Remote Fabric

| ID | Subproject | Development | Correction | Merge |
|---|---|---|---|---|
| [RF-001](./remote/RF-001-node-identity-installation-lifecycle.md) | Node identity + installation lifecycle | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [RF-002](./remote/RF-002-unified-pairing-trust-lifecycle.md) | Unified pairing + trust lifecycle | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [RF-003](./remote/RF-003-local-discovery-lan-direct.md) | Same-Wi-Fi/LAN discovery + local direct | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [RF-004](./remote/RF-004-bluetooth-bootstrap-ip-handoff.md) | Bluetooth bootstrap + IP handoff | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [RF-005](./remote/RF-005-remote-invite-rendezvous.md) | Remote invite / meeting code / deep link | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [RF-006](./remote/RF-006-secure-transport-path-manager.md) | Secure path manager + relay fallback | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [RF-007](./remote/RF-007-versioned-capability-registry.md) | Versioned capability registry | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [RF-008](./remote/RF-008-typed-rpc-event-stream-commands.md) | Typed RPC/Event/Stream + reliable commands | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [RF-009](./remote/RF-009-presence-offline-reconnect-audit.md) | Presence/offline/reconnect + audit | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [RF-010](./remote/RF-010-fabric-policy-public-api.md) | Fabric policy boundary + public API | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |

## General AI Gateway

| ID | Subproject | Development | Correction | Merge |
|---|---|---|---|---|
| [GAI-001](./general-ai-gateway/GAI-001-core-contracts-action-vocabulary.md) | Core contracts + Action vocabulary | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [GAI-002](./general-ai-gateway/GAI-002-provider-model-account-registry.md) | Provider/model/account registry | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [GAI-003](./general-ai-gateway/GAI-003-web-channel-persistent-session.md) | Web-first channel + persistent sessions | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [GAI-004](./general-ai-gateway/GAI-004-api-channel-consent-budget.md) | API channel + consent + budget | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [GAI-005](./general-ai-gateway/GAI-005-triage-jev-routing.md) | Deterministic/JEV triage + routing | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [GAI-006](./general-ai-gateway/GAI-006-conversation-input-stream-cancel.md) | Conversation/InputBundle/stream/cancel | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [GAI-007](./general-ai-gateway/GAI-007-device-aware-remote-execution.md) | Device-aware remote execution/result return | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [GAI-008](./general-ai-gateway/GAI-008-health-resilience-degradation.md) | Health/resilience/honest degradation | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [GAI-009](./general-ai-gateway/GAI-009-utopia-surface-integration.md) | Ask/Do + Action + Web/Android integration | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |

## Engineering Manager

| ID | Subproject | Development | Correction | Merge |
|---|---|---|---|---|
| [EM-001](./engineering-manager/EM-001-core-contracts-boundaries.md) | Core contracts + ownership boundaries | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-002](./engineering-manager/EM-002-connector-adapter-process-runtime.md) | Connector adapter framework + generic process runtime | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-003](./engineering-manager/EM-003-job-result-artifact-protocol.md) | Job / event / result / artifact protocol | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-004](./engineering-manager/EM-004-capability-probe-auth-registry.md) | Capability/probe/auth/instance registry | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-005](./engineering-manager/EM-005-attention-recent-device-alerts.md) | Attention bridge + recent-device notification/ring | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-006](./engineering-manager/EM-006-local-first-subworker-placement.md) | Local-first Sub-worker placement | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-007](./engineering-manager/EM-007-remote-subworker-return-control.md) | Remote Sub-worker + automatic return/control | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-008](./engineering-manager/EM-008-credential-profile-session.md) | Credential/profile/session persistence | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-009](./engineering-manager/EM-009-runtime-health-restart-recovery.md) | Runtime health/restart/recovery | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-010](./engineering-manager/EM-010-foreman-scheduler-dag-worker-pool.md) | Foreman queue/DAG/resource/worker pool | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-011](./engineering-manager/EM-011-deepseek-codex-reference-connectors.md) | DeepSeek Harness + Codex reference connectors | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-012](./engineering-manager/EM-012-connector-sdk-claude-workbuddy.md) | Connector SDK + Claude Code/WorkBuddy extension paths | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |
| [EM-013](./engineering-manager/EM-013-utopia-task-surface-integration.md) | Shared Task Core + Utopia control surface integration | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN_UNTIL_PROGRAMME_MERGE |


## Programme merge stages

A programme merge workbook becomes eligible immediately when that programme's component pool is drained. It does not wait for the other three programmes. GAI/EM final real cross-device E2E may wait for accepted Remote Fabric, but that wait parks only the final integration seam and never blocks other runnable work.
