---
mission_id: RF-009
project: REMOTE_FABRIC_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_start_gate_status: OPEN
project_baseline_sha: 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
architecture_contract: REMOTE_FABRIC_V1
programme_execution_status: ACTIVE_ASYNC_TWO_HOST_CROSS_PROGRAMME
cross_programme_contract: mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md
development_status: IN_PROGRESS
development_complete: false
development_host: Mech
development_claimed_at: 2026-09-30T16:47:30Z
development_branch: remote/RF-009-presence-offline-reconnect-audit
development_head_sha: null
development_ci: null
development_report: mission-book/reports/RF-009/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/RF-009/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
---

# RF-009 — Presence / Offline / Reconnect + Audit

## Goal

Expose honest node/session presence and safe reconnect behavior so temporary network failure never turns stale local state into authority or delayed interactive actions into surprises.

## Development scope

- Define presence vocabulary covering online, offline, sleeping, busy, degraded and unreachable/unknown states.
- Track last-seen, active path class and bounded quality metadata; optionally expose battery/power/network-quality data when the platform safely provides it.
- Define explicit offline action policy: queueable vs non-queueable, expiry/deadline and requires-live-session.
- Interactive actions such as current camera capture, mouse click, screen unlock or equivalent must not silently execute hours after their intended live context.
- Define reconnect reconciliation: reauthenticate, refresh identity/trust/capability/presence, reconcile pending command state and revalidate any upper-layer authority/lease reference before side effects resume.
- Provide append-only/auditable lifecycle events for pairing/trust/session/path/command outcomes without logging secrets or raw private payloads by default.
- Distinguish unknown outcome after transport loss from confirmed failure/success.
- Define bounded retry/backoff and duplicate-safe recovery.

## Explicitly out of scope

- pretending offline devices succeeded;
- indefinite queues with no expiry semantics;
- resuming stale side effects from local cache alone;
- turning presence into task ownership.

## Required acceptance

- disconnect/reconnect updates presence honestly and preserves logical device identity.
- queueable work follows explicit expiry; non-queueable live actions are rejected/expired while offline.
- stale command replay after reconnect cannot duplicate an already-completed side effect.
- unknown transport outcome remains UNKNOWN until reconciled rather than reported success.
- reconnect revalidates current trust/capability/policy hooks before invocation resumes.
- audit records enough causal identifiers to debug without storing secret keys/private payload bodies.
- sleep/degraded/unreachable states do not silently collapse into ONLINE or FAILED.

## Mandatory Remote Fabric architecture contract

This task MUST preserve all project-wide invariants:

1. **Many join methods, one trust protocol.** Same-Wi-Fi discovery, LAN, Bluetooth, direct IP, remote meeting-code invite, deep link and QR/web link are discovery/bootstrap entry points only. All successful joins converge on one versioned pairing/trust state machine.
2. **Logical identity is cryptographic, not network-derived.** Stable `device_id` identifies a logical device; `installation_id` identifies one installation. IP address, hostname, display name and MAC address are metadata, never authorization identity.
3. **MAC is optional local pairing evidence only.** A locally observable hardware MAC may be shown once as extra human confirmation when the OS exposes it, but randomization/unavailability must not block pairing and MAC must never become a credential, remote identity or authorization source.
4. **Encrypted and authenticated by default.** Local and remote transport both require authenticated encryption. Discovery must not imply trust.
5. **Transport is replaceable and hidden from callers.** Upper layers call Fabric APIs and must not depend on LAN/Bluetooth/WebRTC/QUIC/WebSocket/VPN/relay specifics.
6. **Capability addressing over device-specific APIs.** Callers resolve versioned capabilities such as `camera.capture@1` or `screen.stream@1`; they do not hard-code `phone_camera()` or equivalent device-specific routes.
7. **RPC, EVENT and STREAM are distinct semantics.** Commands carry stable correlation identifiers, and externally visible/state-changing retries are idempotent.
8. **Session is not task authority.** Remote Fabric owns identity, discovery, trust, connectivity, routing, transport, presence and invocation delivery; it does not own the City task graph, Assistant durable state, planning, personality or orchestration policy.
9. **Offline/reconnect is honest.** Offline, timeout, refused, unavailable, unknown and completed states are not collapsed. Stale local state cannot resume a side effect without current authority/revalidation.
10. **Relay is not trusted plaintext infrastructure by default.** Relay transport must be able to carry end-to-end protected payloads without becoming the semantic owner of user data or commands.
11. **Permission remains intersectional.** Fabric enforcement must honor current Owner/User policy, caller/assistant policy when applicable, target device capability and task/action grant. Presence or a valid network session never creates permission.
12. **No hidden intelligence.** Fabric may report reachability, capability and policy result; it must not autonomously decide task ownership, assistant switching, data disclosure or which project should execute work.

These are acceptance constraints, not optional future improvements.

## Project gate and frozen baseline

The Pre-Assistant foundation is merged and green. All RF branches start from the same Utopia baseline:

`82ed36933fb4c5b00e44768d9e1aedec1d525d9c`

This keeps RF-001..RF-010 independently integrable. **Alien and Mech are both available now; the previous second-host hold is cancelled.** RF tasks may be claimed immediately and asynchronously from the frozen baseline.

## Development stage

The Development Host must:
1. claim this stage in City;
2. create `remote/RF-009-presence-offline-reconnect-audit` from the exact frozen Remote baseline;
3. implement only this bounded scope plus the mandatory contract above;
4. add positive/negative tests and relevant concurrency/recovery/security tests;
5. push and run relevant GitHub CI;
6. write `DEVELOPMENT_REPORT.md` with exact files, tests, failures/fixes, branch/head and CI;
7. mark `development_complete` only when green.

Do not merge to Utopia main.

## Correction stage

The Correction Host must be the other physical host and must independently inspect the pushed Development branch for architecture, trust, spoofing, stale-state, replay, concurrency, permission, lifecycle/recovery, duplicate-side-effect and false-success defects relevant to this task.

Correction is a repair task, not passive verification. Every discovered in-scope defect must be fixed directly on this same branch and covered by regression tests. Cross-RF issues are recorded as final-integration seams rather than solved by merging another RF implementation into this branch.

Push the corrected head, run relevant GitHub CI, write `CORRECTION_REPORT.md`, and mark `correction_complete` only when green.

## Two-host gate

Final-merge eligibility requires:
- Development Host != Correction Host;
- branch history/evidence proves both Alien and Mech participated;
- `development_complete = true`;
- `correction_complete = true`;
- corrected head is pushed and recorded.

## Global cross-programme no-idle rule

This task participates in the normative global BA/RF/GAI/EM pool defined by `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md`.

- Alien and Mech are both available; RF Development may be claimed immediately.
- Claim truth is written only to this task workbook frontmatter and reports; ordinary claims do not edit README/MISSION_INDEX.
- Correction is eligible as soon as this task's Development is green and must be performed by the opposite physical host.
- Hosted CI, long tests and external network/provider waits do not idle a host; retain the claim and continue another eligible global stage in a separate worktree.
- Missing sibling RF implementations are represented by stable contracts/test doubles; missing BA/GAI/EM code never blocks bounded RF work.
- A host stops claiming only after a fresh scan of all four programmes finds no actionable owned repair, no eligible opposite-host Correction and no unclaimed Development.

## Merge lock

No worker may merge `remote/RF-009-presence-offline-reconnect-audit` to Utopia main. A Remote Fabric project merge workbook may be created only after **every RF-001..RF-010** branch passes the two-stage/two-host gate.
