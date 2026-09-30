---
mission_id: RF-006
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
development_host: Mech
development_claimed_at: 2026-09-30T15:46:20Z
development_branch: remote/RF-006-secure-transport-path-manager
development_head_sha: 251e20bc3af4a2db57253a1a1e5332c976d17d51
development_ci: 36739459945-success
development_report: mission-book/reports/RF-006/DEVELOPMENT_REPORT.md
correction_status: NOT_STARTED
correction_complete: false
correction_host: null
correction_claimed_at: null
correction_head_sha: null
correction_ci: null
correction_report: mission-book/reports/RF-006/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
---

# RF-006 — Secure Transport Path Manager + Relay Fallback

## Goal

Provide one replaceable secure connectivity layer that selects and migrates among local direct, Internet direct, NAT-traversed and relay paths without exposing transport specifics to callers.

## Development scope

- Define a transport-adapter interface and normalized path/session descriptor.
- Implement path preference semantics equivalent to: local direct -> Internet direct -> NAT traversal -> relay fallback.
- Require authenticated encryption on every accepted path, including LAN.
- Support path probing, race-safe selection, health checks, failover and path migration without changing logical device identity.
- Keep rendezvous/relay selection separate from pairing authority.
- Define relay mode so relays can forward end-to-end protected payloads without requiring plaintext semantic access.
- Expose bounded path metadata such as transport class, latency/quality and relay/direct status for scheduling/UI, without leaking secrets.
- Avoid business-layer dependencies on concrete libraries/protocols.

## Explicitly out of scope

- making relay the permanent mandatory route;
- trusting LAN plaintext;
- tying Fabric API to WebRTC/QUIC/WebSocket/WireGuard or any one implementation;
- using path quality as permission.

## Required acceptance

- callers use one Fabric connect/send surface while tests swap transport adapters.
- path selection prefers usable direct routes and falls back to relay honestly.
- path loss can migrate/reconnect without creating a new logical device or duplicate command.
- a relay cannot authorize a peer merely because it forwarded traffic.
- encrypted local and remote sessions reject unauthenticated peers.
- test relay can operate on opaque end-to-end-protected payloads.
- failover and simultaneous path races do not create two authoritative sessions for one exclusive action.

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
2. create `remote/RF-006-secure-transport-path-manager` from the exact frozen Remote baseline;
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

No worker may merge `remote/RF-006-secure-transport-path-manager` to Utopia main. A Remote Fabric project merge workbook may be created only after **every RF-001..RF-010** branch passes the two-stage/two-host gate.
