---
mission_id: RF-002
project: REMOTE_FABRIC_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_start_gate_status: OPEN
project_baseline_sha: 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
architecture_contract: REMOTE_FABRIC_V1
programme_execution_status: ACTIVE_ASYNC_TWO_HOST_CROSS_PROGRAMME
cross_programme_contract: mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md
development_status: COMPLETE
development_complete: true
development_host: Alien
development_claimed_at: 2026-09-30T12:48:00Z
development_branch: remote/RF-002-unified-pairing-trust-lifecycle
development_head_sha: 3c0eb4fe91534e5ec68bf16f5f02ed6a3f413fd7
development_ci: 36717914252-gateway-web-success-android-success
development_report: mission-book/reports/RF-002/DEVELOPMENT_REPORT.md
correction_status: COMPLETE
correction_complete: true
correction_host: Mech
correction_claimed_at: 2026-09-30T13:05:57Z
correction_head_sha: be86135e23f9d18bd45fbca623dceee2d593906e
correction_ci: 36720364997-gateway-web-success-android-success
correction_report: mission-book/reports/RF-002/CORRECTION_REPORT.md
merge_status: MERGED_MAIN
merge_archive_tag: archive/RF-002
merge_integration_branch: merge/remote-fabric-integration
merge_integration_head: 160fcc345775f9f3fbb5b640195cbe299cfb9d61
merge_integration_ci: 36828179156-success
merge_main_sha: 49914d906ce6731272d301ed4bee4cca05ff2b86
merge_main_ci: 36828413515-success
---

# RF-002 — Unified Pairing + Trust Lifecycle

## Goal

Make every discovery/invite mechanism converge on one auditable pairing and trust state machine with explicit human/Owner confirmation and revocation.

## Development scope

- Define a versioned pairing-session state machine shared by local, Bluetooth and remote-invite entry points.
- Exchange ephemeral/session cryptographic material and bind successful confirmation to the permanent device identity/fingerprint.
- Define human-readable device preview: display name, platform/model where known, cryptographic fingerprint, and optional local MAC evidence where available.
- Support trust classes/roles sufficient for Full Node, Personal Device, Guest Device, Sensor Device and Worker Node without embedding arbitrary capability permission inside display metadata.
- Define expiry, cancellation, replay protection, one-time confirmation and failed-pair cleanup.
- Define credential rotation, trust revoke, lost-device revoke, quarantine and re-pair semantics.
- Make discoverability/invite possession insufficient to become trusted.
- Keep trust lifecycle auditable without storing secrets in logs.

## Explicitly out of scope

- a second pairing implementation for each transport;
- invite code as password;
- MAC-address trust;
- automatic full permissions after pairing;
- assistant/task ownership changes.

## Required acceptance

- local discovery, Bluetooth and remote invite can all feed the same pairing state model.
- two sides can display stable fingerprints for confirmation.
- reused/expired pairing attempts are rejected.
- revoked devices cannot reconnect with old credentials.
- trust role changes are explicit and auditable.
- MAC mismatch may warn during local onboarding but cannot replace cryptographic identity checks.
- logs prove state transitions without leaking private key material.

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
2. create `remote/RF-002-unified-pairing-trust-lifecycle` from the exact frozen Remote baseline;
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

No worker may merge `remote/RF-002-unified-pairing-trust-lifecycle` to Utopia main. A Remote Fabric project merge workbook may be created only after **every RF-001..RF-010** branch passes the two-stage/two-host gate.
