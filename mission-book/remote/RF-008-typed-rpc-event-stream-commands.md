---
mission_id: RF-008
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
development_claimed_at: 2026-09-30T16:30:15Z
development_branch: remote/RF-008-typed-rpc-event-stream-commands
development_head_sha: 761685b28fabdc0cb2d2dfe9f47e170d4fe82752
development_ci: 36744638449-success
development_report: mission-book/reports/RF-008/DEVELOPMENT_REPORT.md
correction_status: COMPLETE
correction_complete: true
correction_host: Alien
correction_claimed_at: 2026-10-01T00:26:05Z
correction_head_sha: 4d974da6f18ec16b570bbc33709136188a5b05e2
correction_ci: 36796873900-gateway-web-success-android-success
correction_report: mission-book/reports/RF-008/CORRECTION_REPORT.md
merge_status: FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
---

# RF-008 — Typed RPC / Event / Stream + Reliable Commands

## Goal

Define reliable, typed data-plane semantics so remote calls, notifications and continuous media/sensor flows are not collapsed into an ambiguous generic message channel.

## Development scope

- Define separate versioned envelopes for RPC/COMMAND, EVENT and STREAM setup/data/control.
- Treat BA/GAI/EM domain envelopes as opaque domain payloads/references carried by Fabric; RF transport envelopes must never become the canonical Assistant, General-AI or Engineering event model.
- Every command carries stable correlation fields including `command_id`, caller/origin, target, capability/version, timestamps/deadline and relevant task/action reference.
- Side-effecting commands support `idempotency_key` / action key and replay-safe result caching/lookup.
- Separate `attempt_id` from stable command identity so transport retries do not become new user actions.
- Define explicit states at minimum equivalent to accepted/queued, running, waiting-confirmation where applicable, succeeded, failed, refused, unavailable, cancelled, timeout/unknown.
- Define typed errors and false-success prevention: delivery acknowledgment is not execution success.
- Define stream lifecycle/backpressure/cancellation independent from one-shot RPC.
- Define event subscription identifiers and ordering/causal metadata sufficient for reconnect/replay policy.
- Keep City task truth outside the transport envelope; reference it rather than duplicating ownership.

## Explicitly out of scope

- one universal `sendMessage()` semantic;
- treating HTTP/transport 200 as task success;
- executing the same side effect twice after retry;
- storing task truth only inside a network session.

## Required acceptance

- retrying the same idempotent side-effect command does not repeat the external effect.
- new command IDs represent new actions even when arguments match.
- delivery/acceptance/running/completed states are observably distinct.
- EVENT subscriptions and STREAM lifecycle can reconnect/cancel without being mistaken for RPC.
- deadline/expiry prevents stale interactive commands from executing later.
- duplicate/reordered/replayed envelopes are handled deterministically.
- tests prove task/session separation and truthful terminal statuses.

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
2. create `remote/RF-008-typed-rpc-event-stream-commands` from the exact frozen Remote baseline;
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

No worker may merge `remote/RF-008-typed-rpc-event-stream-commands` to Utopia main. A Remote Fabric project merge workbook may be created only after **every RF-001..RF-010** branch passes the two-stage/two-host gate.
