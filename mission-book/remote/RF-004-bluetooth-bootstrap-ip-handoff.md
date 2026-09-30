---
mission_id: RF-004
project: REMOTE_FABRIC_ENGINEERING
implementation_repo: zhiheng-zhang-Mera/Utopia
control_repo: zhiheng-zhang-Mera/Digital-City
project_start_gate: PRE_ASSISTANT_MERGED_MAIN_CI_GREEN
project_start_gate_status: OPEN
project_baseline_sha: 8104f8289a76d15ff0197c953730edcef42cab5e
architecture_contract: REMOTE_FABRIC_V1
programme_execution_status: HELD_PENDING_SECOND_REAL_HOST
development_status: NOT_STARTED
development_complete: false
development_host: null
development_claimed_at: null
development_branch: remote/RF-004-bluetooth-bootstrap-ip-handoff
development_head_sha: null
development_ci: null
development_report: mission-book/reports/RF-004/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/RF-004/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
---

# RF-004 — Bluetooth Bootstrap + IP Handoff

## Goal

Use Bluetooth/BLE as a nearby onboarding/bootstrap path that can pair devices without requiring an existing shared IP network, then hand off to the normal secure Fabric transport when possible.

## Development scope

- Define Bluetooth discovery/advertisement and pairing bootstrap adapters for supported PC/Android targets.
- Exchange only the bounded pairing/bootstrap material needed by the common RF-002 trust protocol.
- Never make Bluetooth pairing state itself equivalent to City trust.
- After trust and network availability, negotiate handoff from BLE bootstrap to the normal IP Fabric path without changing `device_id` or pairing truth.
- Define bounded BLE-only transport fallback for small control payloads where explicitly supported.
- Reject silent downgrade from a healthy higher-capacity secure path to weaker/unintended Bluetooth transport.
- Handle proximity loss, reconnect, duplicated advertisements and stale pairing sessions.

## Explicitly out of scope

- using Bluetooth as the mandatory high-bandwidth transport for screen/video/file transfer;
- separate Bluetooth device identities;
- implicit trust based on OS-level Bluetooth paired status.

## Required acceptance

- a nearby peer can start the common pairing protocol over BLE without Wi-Fi.
- successful handoff to IP preserves one logical session/device identity.
- Bluetooth disconnect during bootstrap fails/retries honestly without false pairing success.
- an OS-paired but City-untrusted device cannot invoke Fabric capabilities.
- BLE-only fallback rejects unsupported large/stream semantics explicitly.
- downgrade/replay tests cannot bypass transport/trust policy.

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

`8104f8289a76d15ff0197c953730edcef42cab5e`

This keeps RF-001..RF-010 independently integrable. The current control-repo ruling records only one real build host as available, so the programme is **prepared but held** until a second real physical host is confirmed. Once that hold is lifted, tasks may be claimed asynchronously without changing the frozen RF baseline.

## Development stage

The Development Host must:
1. claim this stage in City;
2. create `remote/RF-004-bluetooth-bootstrap-ip-handoff` from the exact frozen Remote baseline;
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

## Merge lock

No worker may merge `remote/RF-004-bluetooth-bootstrap-ip-handoff` to Utopia main. A Remote Fabric project merge workbook may be created only after **every RF-001..RF-010** branch passes the two-stage/two-host gate.
