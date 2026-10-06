# Capability Entry Matrix

[中文原文](../CAPABILITY_ENTRY_MATRIX.md)

> Historical discovery included mutable branch `codex/city-members-host-roles`. It identifies gaps only and is no longer an execution/acceptance baseline.
>
> Each CEX workbook's immutable full-SHA rules determine actual baseline. This table is not static truth. CEX-790 reconstructs inventory from accepted exact dependency SHAs.
>
> **Long-term City capability truth moved to [capability-registry/](../../../capability-registry/). This table now serves only as CEX bootstrap/discovery evidence and must not become the canonical registry for future tasks.**

| Capability / lifecycle | Backend/API | Web | Android | Classification | Current action |
|---|---|---|---|---|---|
| Ask / Do | ready | direct | direct | EXPOSED | keep |
| Ask targets catalog | ready | only after unmatched | only after unmatched | DISCOVERABILITY_GAP | CEX-703 |
| Rooms catalog | ready | direct | direct catalog | EXPOSED_PARTIAL | keep |
| Rooms interactive use | Room Hub ready | direct via hub | catalog only | PARITY/FUTURE | future backlog |
| Capability Services | ready | direct | direct | EXPOSED | keep |
| Actions history/detail | ready | direct | direct | EXPOSED | keep |
| Tasks / strict target | ready | direct | direct | EXPOSED | keep |
| Scheduler provider choice | ready | direct | partial/direct | EXPOSED/PARITY | verify CEX-702 |
| Scheduler switch-declined → alternate device | ready | no direct choice | no direct choice | CURRENT_ENTRY_GAP | CEX-702 |
| Generic scheduler CONFIRM | presentation token exists; generic backend route absent | disabled honest control | unsupported | NOT_READY | do not fake; future |
| Pairing generate QR/code/link | ready | direct | join-oriented only | PARITY_GAP | CEX-704 |
| Pairing consume QR/code/link | ready | direct | direct | EXPOSED | keep |
| Nearby LAN / BLE | ready | direct | direct | EXPOSED | keep |
| Cross-network relay join | ready | direct | not full parity | PARITY_GAP | CEX-704 review |
| Owner join approve/reject | ready | direct | absent | PARITY_GAP | CEX-704 |
| Device enrollment/session reconnect | ready | automatic + Settings | mostly legacy Settings | PARITY_GAP | CEX-705 |
| Device revoke | ready | direct | absent | PARITY_GAP | CEX-705 |
| Device rebind / reinstall recovery | ready | absent | absent | CURRENT_ENTRY_GAP | CEX-701 |
| Clone findings | ready | fetched but dropped | absent | CURRENT_ENTRY_GAP | CEX-701 |
| City rename | ready | direct | absent | PARITY_GAP | CEX-705 |
| City member role view | ready | direct | absent | PARITY_GAP | CEX-705 |
| Node sharing enable/disable | ready | direct | absent | PARITY_GAP | CEX-705 |
| Member messaging | ready | direct | absent | PARITY_GAP | CEX-705 |
| Health endpoint | ready | diagnostics only | no direct | INTERNAL/ADVANCED | no primary entry |
| node register/heartbeat/claim/report | ready | n/a | n/a | INTERNAL_PROTOCOL | no UI |
| relay transport | ready | used indirectly | used indirectly | INTERNAL_TRANSPORT | no raw UI |
| General AI route | reserved / executor unattached | no fake entry | no fake entry | FUTURE_PRODUCT_INTEGRATION | backlog |
| Butler Assistant slot | presentation placeholder only | visible placeholder | no mature config | FUTURE_PRODUCT_INTEGRATION | backlog |
| Engineering Manager user route | infrastructure exists; universal-terminal route incomplete | no complete direct user route | no | FUTURE_PRODUCT_INTEGRATION | backlog |
| Workbench execution profiles | separate WBC programme | not current | not current | FUTURE_PRODUCT_INTEGRATION | WBC + backlog |
| Web surface rename helper | console helper exists | console only | n/a | DEFER / IDENTITY_NORMALIZATION | backlog |

## Rules

- `CURRENT_ENTRY_GAP`: backend semantics are mature enough; this programme should close the loop.
- `PARITY_GAP`: at least one formal surface has an entry; other first-class surfaces need it too.
- `FUTURE_PRODUCT_INTEGRATION`: adding buttons alone cannot establish usability.
- `INTERNAL_PROTOCOL / INTERNAL_TRANSPORT`: no user entry by default.
