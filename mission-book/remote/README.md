# Remote Fabric Engineering / 远程连接织网工程
<!-- COMPONENT-STAGE-STATUS -->
> Remote Fabric: **10/10 two-stage complete** — corrected heads and hosted-CI evidence are recorded in each task workbook frontmatter and `../reports/<ID>/CORRECTION_REPORT.md`.
> Merge workbook: **not yet created.** The component-pool precondition for creating it is satisfied; the merge stage itself has not been performed and no component branch is merged to Utopia main.
<!-- /COMPONENT-STAGE-STATUS -->

This folder defines the asynchronous two-host workbooks for Digital City's Remote Fabric.

## Architectural identity

Remote Fabric is the trusted multi-device communication and capability-access layer for Utopia/Digital City. It answers: **who is the node, how do we find it, can we trust it, can we reach it, what can it expose, and how do typed invocations/data move safely?**

It does **not** own Assistant durable state, Digital-Me, task planning, task ownership, project scheduling, LLM reasoning, personality or UI product logic.

## Supported join/bootstrap entry points

The first implementation contract reserves all of these entry points:

- same-Wi-Fi automatic discovery;
- LAN discovery/direct connection;
- Bluetooth/BLE nearby bootstrap pairing;
- manual direct IP/hostname engineering fallback;
- Internet rendezvous through a short Zoom-like meeting/invite code;
- deep link / jump link;
- web link and QR representation of the same invite.

These are not separate trust systems. They all converge on one pairing state machine:

`DISCOVER / INVITE -> PAIRING_SESSION -> EPHEMERAL_KEY_EXCHANGE -> DEVICE_PREVIEW -> HUMAN/OWNER_CONFIRM -> TRUSTED_NODE`

An invite code is a short-lived locator, not a password or permanent credential.

## Device identity and MAC rule

- `device_id` = stable logical City device identity.
- `installation_id` = one concrete installation instance.
- device key pair / fingerprint = cryptographic identity anchor.
- display name, OS/model, IP and MAC = metadata.
- MAC may be displayed once during local pairing as optional confirmation evidence when available.
- MAC randomization, multiple NICs or inability to read MAC must not block pairing.
- MAC spoofing must not grant trust.
- reinstall/rebind and cloned-credential detection must have explicit lifecycle rules.

## Transport rule

Preferred path policy is:

`same-LAN/direct local -> direct Internet -> NAT traversal -> relay fallback`

Upper layers must not care which concrete transport is in use. Bluetooth is primarily a bootstrap transport and should hand off to an IP Fabric path when one becomes available; bounded BLE-only operation may exist where appropriate.

Authenticated encryption is mandatory on local and remote paths. Relay infrastructure must not require plaintext semantic access to payloads.

## Fabric semantic planes

Control plane:
- identity/trust;
- discovery/rendezvous;
- capability registry/version negotiation;
- presence;
- routing/path selection;
- policy checks;
- session negotiation.

Data plane:
- RPC/command;
- events;
- streams;
- files/media/sensor payloads.

RPC, EVENT and STREAM are distinct semantics. A generic `sendMessage()` must not become the only protocol abstraction.

## Stable public abstraction

The architecture reserves a replacement-safe API equivalent to:

`discover(), pair(), connect(), resolveDevice(), listCapabilities(), invoke(), subscribe(), openStream(), getPresence(), revokeDevice(), disconnect()`

Concrete transport libraries remain below this surface.

## Construction workflow

All RF-001..RF-010 branches use the same frozen Utopia baseline:

`82ed36933fb4c5b00e44768d9e1aedec1d525d9c`

Each RF task follows **Development -> Correction** on one task branch:
- Development and Correction are performed by different physical hosts;
- both Alien and Mech must appear in branch evidence before final merge eligibility;
- every RF branch remains separate from Utopia main during construction;
- RF tasks may run asynchronously and do not wait for one another;
- an RF branch must not merge/cherry-pick another RF branch merely to satisfy its local tests;
- missing sibling implementations are represented by the workbook's stable contract plus deterministic test doubles;
- integration seams are recorded for the future Remote merge workbook.

Alien and Mech are both currently available. The prior second-real-host hold is cancelled; RF work may start immediately.

## Remote queue

| ID | Subproject | Development | Correction | Merge |
|---|---|:---:|:---:|:---:|
| RF-001 | Node Identity + Installation Lifecycle | COMPLETE / Alien | COMPLETE / Mech | FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE |
| RF-002 | Unified Pairing + Trust Lifecycle | COMPLETE / Alien | COMPLETE / Mech | FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE |
| RF-003 | Same-Wi-Fi / LAN Discovery + Local Direct Path | COMPLETE / Mech | COMPLETE / Alien | FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE |
| RF-004 | Bluetooth Bootstrap + IP Handoff | COMPLETE / Mech | COMPLETE / Alien | FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE |
| RF-005 | Remote Invite / Meeting Code / Deep Link Rendezvous | COMPLETE / Mech | COMPLETE / Alien | FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE |
| RF-006 | Secure Transport Path Manager + Relay Fallback | COMPLETE / Mech | COMPLETE / Alien | FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE |
| RF-007 | Versioned Capability Registry + Addressing | COMPLETE / Mech | COMPLETE / Alien | FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE |
| RF-008 | Typed RPC / Event / Stream + Reliable Commands | COMPLETE / Mech | COMPLETE / Alien | FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE |
| RF-009 | Presence / Offline / Reconnect + Audit | COMPLETE / Mech | COMPLETE / Alien | FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE |
| RF-010 | Fabric Policy Boundary + Public API | COMPLETE / Mech | COMPLETE / Alien | FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE |

## Hard merge lock

`REMOTE_MERGE_WORKBOOK_CREATION = FORBIDDEN` until ALL RF-001..RF-010 have:
- Development complete and green;
- Correction complete and green;
- different Development/Correction physical hosts;
- both-host branch evidence;
- exact corrected remote head recorded.

When unlocked, the merge workbook must integrate all corrected RF branches **on top of the then-current Utopia main**, preserving any Butler or other valid mainline work that may have landed after the frozen RF baseline. Compatible conflicts preserve an explicit union/superset; they must never resolve by silently replacing newer main behavior with the old baseline.

Required Remote terminal state after that future merge: `REMOTE_FABRIC_MERGED_MAIN_CI_GREEN`.


## Cross-programme asynchronous execution

Remote Fabric participates in the global BA/RF/GAI/EM pool defined by `../CROSS_PROGRAMME_EXECUTION_CONTRACT.md`. There is no host-availability hold.

- RF Development may be claimed now by Alien or Mech; Correction is claimed only by the opposite physical host after that task's Development is green.
- Missing sibling RF code never blocks a task branch; use the stable RF contract and deterministic doubles.
- Waiting CI/long tests do not idle the host. Keep the claim and claim another eligible stage across any programme using a separate worktree.
- Remote Fabric is the transport/trust substrate only. It must not absorb Assistant, GAI or Engineering orchestration semantics.
- After RF-001..RF-010 drain, create and run the Remote merge workbook immediately on then-current Utopia main. RF has no hard dependency on GAI/EM completion.

## Component stage status — 2026-10-01

RF-001..RF-010 are **10/10 two-stage complete**: every task records `development_complete = true` and
`correction_complete = true` on opposite physical hosts (RF-001/RF-002 were developed by Alien and corrected by
Mech; the rest were developed by Mech and corrected by Alien), each with a pushed corrected head, hosted CI
green and a correction report under `../reports/<ID>/CORRECTION_REPORT.md`.

The Remote merge workbook is **eligible and not yet created**; no RF branch is merged to Utopia main. Creating
and running that merge workbook is the next, Owner-authorized stage, and its required terminal state remains
`REMOTE_FABRIC_MERGED_MAIN_CI_GREEN`.
