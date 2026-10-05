# Capability Exposure Matrix (English)

> Status: **FINAL AUDIT VIEW** — populated by CEX-790 from `records/*.yaml` at baseline `5c7d46dcbf1b01259b5edaf574b620714beb40b7`.
>
> This is a human review view, not the machine authority. Structured truth lives in `CAPABILITY_INDEX.yaml` and `records/*.yaml`.

## Current migration state

Historical capability-entry data lived in `mission-book/capability-entry-closeout/CAPABILITY_ENTRY_MATRIX.md`. The CEX
programme reconciled it into the durable Registry, and CEX-790 performed the final audit: it rebuilt the entry
inventory from the code, diffed it against these records, and resolved the two mismatches it found. The legacy matrix
is no longer a source of truth.

## Matrix

| Capability ID | Capability | Implementation | Backend wiring | User reachable | Intent valid | Exposure class | Web | Android | Other | Last verified SHA | Gap |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `CAP-ASK-001` | Proactive backend target catalog | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | yes | yes | — | `478d48609651` | All16 native cards and mutating confirmation NOT_RUN; the Compose catalog was not rendered |
| `CAP-CAPABILITY-BRIDGE-001` | Capability catalog and invocation surface | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | yes | yes | — | `5c7d46dcbf1b` | No end-to-end intent validation was performed by this backfill; the surfaces were inventor |
| `CAP-CITY-MEMBERS-NATIVE-001` | Native City and member management | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | no | yes | — | `de9185a4ef8d` | F1 MEDIUM recorded and left unrepaired: the shared member projection can report a device a |
| `CAP-EXECUTION-001` | Standard device execution backend compatibility port | COMPLETE | VERIFIED | NOT_APPLICABLE | VERIFIED | INTERNAL_ONLY | no | no | — | `f66db6099834` | none recorded |
| `CAP-EXPERIMENT-MANIFEST-001` | Experiment manifest registration and validation | COMPLETE | VERIFIED | VERIFIED | VERIFIED | DIRECT_CONTROL | yes | no | — | `7e96a4d28f4c` | Android Research surface NOT_RUN; REX807 further control surface |
| `CAP-HOST-LIFECYCLE-001` | Host start mode, page-tied City lifecycle, and stored-role persistence | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | BACKGROUND_DISCLOSED | yes | no | launcher | `a8bce279e114` | The start mode is disclosed at start but no Web/Android surface renders it afterwards; the stored role is ignored silently except for the launcher line |
| `CAP-IDENTITY-001` | Device identity recovery and conflict disclosure | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | yes | yes | — | `a24c04401308` | Android connected recovery NOT_RUN; only offline guidance was observed, and the Compose su |
| `CAP-MON-001` | Canonical City observation sidecar | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | BACKGROUND_DISCLOSED | no | no | API | `7eb38f1b930d` | Owner/review/CI/escalation absent-source NOT_OBSERVABLE |
| `CAP-MON-002` | City Work Monitor overview graph and node/path inspector | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | OBSERVABLE_ADVANCED | yes | no | — | `6bb19f3e8427` | Android parity deliberately deferred (needs a Compose graph built once, with the MON-903 overlay); Owner-required is only partly observable and the surface says so |
| `CAP-NODE-DESCRIPTOR-001` | Node role capability and resource descriptor | COMPLETE | VERIFIED | NOT_APPLICABLE | VERIFIED | INTERNAL_ONLY | no | no | — | `d99101fdac51` | none recorded |
| `CAP-ONBOARDING-OWNER-001` | Native City invitation and admission approval | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | no | yes | — | `d05f5a455ff5` | System share physical test CLOSED BY REVIEW: the chooser opens normally on OPPO PERM00, so |
| `CAP-RESEARCH-TRACE-001` | Bounded research trace and provenance | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | OBSERVABLE_ADVANCED | yes | yes | — | `833279cae237` | Android online rendering NOT_RUN; the Compose surface was not rendered on a device or emul |
| `CAP-SCHEDULER-CHOICE-001` | Keep service and use another device | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | yes | yes | — | `3d233ff39d1e` | Android online interaction NOT_RUN; the Compose surface was not rendered on a device or em |
| `CAP-WORKER-POOL-AGENT-001` | Dormant Worker Pool and headless node agent seam | COMPLETE | VERIFIED | NOT_APPLICABLE | NOT_TESTED | INTERNAL_ONLY | no | no | — | `f3510862cc34` | Real Workbench and Linux/macOS physical tests NOT_RUN |

## Review priorities

Prioritize:

- `COMPLETE + MISSING`: implemented but not user-reachable;
- `VERIFIED wiring + MISMATCH intent`: connected but semantically wrong;
- parity gaps between first-class surfaces;
- registry entries whose claimed UI cannot be found in reality;
- stale records without recent exact-SHA/evidence reconciliation.

## Open items carried by this view

- `CAP-MON-002`: Android parity deliberately deferred so the Compose graph is written once against the stable projection contract and together with the MON-903 decision overlay; owner-required state is only partly observable (canonical WAITING_CONFIRMATION only) and the surface states that limitation on every render
- `CAP-ASK-001`: All16 native cards and mutating confirmation NOT_RUN; the Compose catalog was not rendered on a device or emulator by the review, and the author receipt records the online catalog as NOT_RUN
- `CAP-CAPABILITY-BRIDGE-001`: No end-to-end intent validation was performed by this backfill; the surfaces were inventoried, not exercised
- `CAP-CITY-MEMBERS-NATIVE-001`: F1 MEDIUM recorded and left unrepaired: the shared member projection can report a device as connected while its own node record says offline, because members.mjs seeds the primary row with online true and can never correct it. members.mjs is NOT in the CEX-705 diff, so this is a pre-existing defect the new Android surface exposes rather than a regression. F2 LOW (the sharing success notice is unconditional and could mask a 404), F3 INFORMATIONAL (the owner own sharing control depends on the City hostDeviceId matching its node id) and F5/F6 INFORMATIONAL (the development receipt physical_not_run list is stale against PHYSICAL_FOLLOWUP.json, and the mandatory parity-gap count and message latency were left null and supplied by the review) are also recorded
- `CAP-CITY-MEMBERS-NATIVE-001`: User-appointed primary-agent migration not implemented
- `CAP-EXPERIMENT-MANIFEST-001`: Android Research surface NOT_RUN; REX807 further control surface
- `CAP-HOST-LIFECYCLE-001`: No Web/Android surface renders which start mode a City is in, so a page-tied City is disclosed at start but not observable afterwards; intent validation NOT_TESTED because no ordinary-user session was run
- `CAP-IDENTITY-001`: Android connected recovery NOT_RUN; only offline guidance was observed, and the Compose surface was not rendered on a device by the review
- `CAP-MON-001`: Owner/review/CI/escalation absent-source NOT_OBSERVABLE
- `CAP-ONBOARDING-OWNER-001`: System share physical test CLOSED BY REVIEW: the chooser opens normally on OPPO PERM00, so the earlier NOT_RUN_AUTO_APPROVAL_REJECTED is superseded
- `CAP-ONBOARDING-OWNER-001`: Optical QR scan and a second PHYSICAL device consume remain NOT_RUN; the review consumer was the host, not a second handset
- `CAP-ONBOARDING-OWNER-001`: Earlier full physical campaign APK SHA NOT_OBSERVABLE; a build of the reviewed source matched the byte count but not the SHA-256, so the build is not hermetic
- `CAP-RESEARCH-TRACE-001`: Android online rendering NOT_RUN; the Compose surface was not rendered on a device or emulator by the review
- `CAP-RESEARCH-TRACE-001`: Experiment execution binding and autonomy measurements NOT_OBSERVABLE
- `CAP-SCHEDULER-CHOICE-001`: Android online interaction NOT_RUN; the Compose surface was not rendered on a device or emulator by the review, and online_click and physical_devices_campaign remain NOT_RUN in the development receipt
- `CAP-SCHEDULER-CHOICE-001`: Opposite physical-host Formal Review PASSED on 3d233ff39d1e96b8a590b12f520f98c283356f25 (Mech, MEGA-REP); findings F1 LOW (the mandatory handoff latency was recorded as NOT_OBSERVABLE although the author's own fixture could measure it; the review measured it instead - 13 ms click to handoff, 598 ms click to result, 4 ms canonical decline to handoff on one physical host), F2 INFORMATIONAL (a presentation.mjs comment still argues that this City keeps no per-node disable state, directly above the line that now reads sharingEnabled), F3 INFORMATIONAL (Web and Android fall back differently when a service ref does not resolve) and F4 INFORMATIONAL (the Android in-flight guard can latch if the client closes mid-request) recorded; none is repaired here
- `CAP-WORKER-POOL-AGENT-001`: Real Workbench and Linux/macOS physical tests NOT_RUN
- `CAP-WORKER-POOL-AGENT-001`: Product Worker Pool profile activation deferred
- `CAP-WORKER-POOL-AGENT-001`: Checkpoint execution continuation/GPU-specific canonical telemetry/primary-agent migration not implemented
