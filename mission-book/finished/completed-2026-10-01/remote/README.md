# Remote Fabric Engineering / 远程连接织网工程

<!-- COMPONENT-STAGE-STATUS -->
> **Component stage (2026-10-01) — Remote Fabric: 10/10 two-stage complete.** Corrected heads and hosted-CI evidence are recorded in each task workbook frontmatter and `../reports/<ID>/CORRECTION_REPORT.md`.
> **Merge stage (2026-10-01) — Remote Fabric: MERGED to Utopia main and CI green.** Merge workbook: [REMOTE_FABRIC_MERGE_WORKBOOK.md](./REMOTE_FABRIC_MERGE_WORKBOOK.md). Terminal state `REMOTE_FABRIC_MERGED_MAIN_CI_GREEN` is satisfied; all ten `archive/RF-0XX` tags preserve the corrected branch heads and the ten `remote/*` remote branches are deleted.
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
| RF-001 | Node Identity + Installation Lifecycle | COMPLETE / Alien | COMPLETE / Mech | MERGED_MAIN |
| RF-002 | Unified Pairing + Trust Lifecycle | COMPLETE / Alien | COMPLETE / Mech | MERGED_MAIN |
| RF-003 | Same-Wi-Fi / LAN Discovery + Local Direct Path | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| RF-004 | Bluetooth Bootstrap + IP Handoff | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| RF-005 | Remote Invite / Meeting Code / Deep Link Rendezvous | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| RF-006 | Secure Transport Path Manager + Relay Fallback | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| RF-007 | Versioned Capability Registry + Addressing | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| RF-008 | Typed RPC / Event / Stream + Reliable Commands | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| RF-009 | Presence / Offline / Reconnect + Audit | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| RF-010 | Fabric Policy Boundary + Public API | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |

## Hard merge lock

`REMOTE_MERGE_WORKBOOK_CREATION = SATISFIED (2026-10-01) — workbook created and executed`. All RF-001..RF-010
satisfied:

- Development complete and green;
- Correction complete and green;
- different Development/Correction physical hosts;
- both-host branch evidence;
- exact corrected remote head recorded.

The merge workbook integrated all corrected RF branches **on top of the then-current Utopia main**, preserving
Butler work that landed after the frozen RF baseline. Compatible conflicts were resolved as an explicit
union/superset (RF-001 × RF-002 across `city/CITY_IMPLEMENTATION_MANIFEST.json`, `city/tests/manifest.test.mjs`,
`tests/capability-registry.test.mjs` and both `city/docs/{en,zh-CN}/ARCHITECTURE.md`); no newer main behavior was
replaced by old baseline behavior.

Required Remote terminal state after that merge: `REMOTE_FABRIC_MERGED_MAIN_CI_GREEN` — **satisfied**.


## Cross-programme asynchronous execution

Remote Fabric participates in the global BA/RF/GAI/EM pool defined by `../CROSS_PROGRAMME_EXECUTION_CONTRACT.md`. There is no host-availability hold.

- RF Development may be claimed now by Alien or Mech; Correction is claimed only by the opposite physical host after that task's Development is green.
- Missing sibling RF code never blocks a task branch; use the stable RF contract and deterministic doubles.
- Waiting CI/long tests do not idle the host. Keep the claim and claim another eligible stage across any programme using a separate worktree.
- Remote Fabric is the transport/trust substrate only. It must not absorb Assistant, GAI or Engineering orchestration semantics.
- RF-001..RF-010 drained, and the Remote merge workbook has been created and run on then-current Utopia main. RF has no hard dependency on GAI/EM completion.

## Component stage status — 2026-10-01

RF-001..RF-010 are **10/10 two-stage complete**: every task records `development_complete = true` and
`correction_complete = true` on opposite physical hosts (RF-001/RF-002 were developed by Alien and corrected by
Mech; the rest were developed by Mech and corrected by Alien), each with a pushed corrected head, hosted CI
green and a correction report under `../reports/<ID>/CORRECTION_REPORT.md`.

## Merge stage status — 2026-10-01

The Remote merge workbook [REMOTE_FABRIC_MERGE_WORKBOOK.md](./REMOTE_FABRIC_MERGE_WORKBOOK.md) was created and
executed against then-current `main`:

```text
source main         = 41e241c (BA union already on main)
integration branch  = merge/remote-fabric-integration
integration head    = 160fcc3   CI 36828179156 success
main merge commit   = 49914d9   CI 36828413515 success
archive tags        = archive/RF-001 .. archive/RF-010 (10 annotated tags, each on its corrected head)
remote branches     = remote/* : 0 remaining (deleted after tagging)
```

Terminal state `REMOTE_FABRIC_MERGED_MAIN_CI_GREEN` is satisfied. The corrected RF heads remain permanently
reachable through their archive tags even though the branches themselves are gone.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **12**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|

### 本目录说明 / Local documents

- [REMOTE_FABRIC_MERGE_WORKBOOK.md](REMOTE_FABRIC_MERGE_WORKBOOK.md)
- [RF-001-node-identity-installation-lifecycle.md](RF-001-node-identity-installation-lifecycle.md)
- [RF-002-unified-pairing-trust-lifecycle.md](RF-002-unified-pairing-trust-lifecycle.md)
- [RF-003-local-discovery-lan-direct.md](RF-003-local-discovery-lan-direct.md)
- [RF-004-bluetooth-bootstrap-ip-handoff.md](RF-004-bluetooth-bootstrap-ip-handoff.md)
- [RF-005-remote-invite-rendezvous.md](RF-005-remote-invite-rendezvous.md)
- [RF-006-secure-transport-path-manager.md](RF-006-secure-transport-path-manager.md)
- [RF-007-versioned-capability-registry.md](RF-007-versioned-capability-registry.md)
- [RF-008-typed-rpc-event-stream-commands.md](RF-008-typed-rpc-event-stream-commands.md)
- [RF-009-presence-offline-reconnect-audit.md](RF-009-presence-offline-reconnect-audit.md)
- [RF-010-fabric-policy-public-api.md](RF-010-fabric-policy-public-api.md)

<!-- DOCUMENT_NAVIGATION:END -->
