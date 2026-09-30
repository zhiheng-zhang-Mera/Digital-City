# Remote Fabric Engineering / 远程连接织网工程

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

`8104f8289a76d15ff0197c953730edcef42cab5e`

Each RF task follows **Development -> Correction** on one task branch:
- Development and Correction are performed by different physical hosts;
- both Alien and Mech must appear in branch evidence before final merge eligibility;
- every RF branch remains separate from Utopia main during construction;
- RF tasks may run asynchronously and do not wait for one another;
- an RF branch must not merge/cherry-pick another RF branch merely to satisfy its local tests;
- missing sibling implementations are represented by the workbook's stable contract plus deterministic test doubles;
- integration seams are recorded for the future Remote merge workbook.

The current Mission Index records a global two-host hold because only one real build host is presently confirmed. Creating these books does not lift that hold.

## Remote queue

| ID | Subproject | Development | Correction | Merge |
|---|---|:---:|:---:|:---:|
| RF-001 | Node Identity + Installation Lifecycle | HELD / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| RF-002 | Unified Pairing + Trust Lifecycle | HELD / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| RF-003 | Same-Wi-Fi / LAN Discovery + Local Direct Path | HELD / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| RF-004 | Bluetooth Bootstrap + IP Handoff | HELD / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| RF-005 | Remote Invite / Meeting Code / Deep Link Rendezvous | HELD / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| RF-006 | Secure Transport Path Manager + Relay Fallback | HELD / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| RF-007 | Versioned Capability Registry + Addressing | HELD / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| RF-008 | Typed RPC / Event / Stream + Reliable Commands | HELD / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| RF-009 | Presence / Offline / Reconnect + Audit | HELD / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| RF-010 | Fabric Policy Boundary + Public API | HELD / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |

## Hard merge lock

`REMOTE_MERGE_WORKBOOK_CREATION = FORBIDDEN` until ALL RF-001..RF-010 have:
- Development complete and green;
- Correction complete and green;
- different Development/Correction physical hosts;
- both-host branch evidence;
- exact corrected remote head recorded.

When unlocked, the merge workbook must integrate all corrected RF branches **on top of the then-current Utopia main**, preserving any Butler or other valid mainline work that may have landed after the frozen RF baseline. Compatible conflicts preserve an explicit union/superset; they must never resolve by silently replacing newer main behavior with the old baseline.

Required Remote terminal state after that future merge: `REMOTE_FABRIC_MERGED_MAIN_CI_GREEN`.
