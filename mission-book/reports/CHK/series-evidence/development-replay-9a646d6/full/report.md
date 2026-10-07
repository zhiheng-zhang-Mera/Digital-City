# City self-health check

Mode: full; outcome: DRIFT_FOUND.

Implementation SHA: 9a646d6b894babd0fb316c0b4a0ba302bd7bca7d; City SHA: 33e9a00bd56fb7556363f6c48ff4c38abebcc61e.

Read 1001 files / 10571966 bytes in 5204.4 ms. Static scan complete: false. Runtime: UNKNOWN.

Independent whole-series review: NOT_RUN. Scheduling, repairs, execution and promotion authority: none.

## Findings

| Code | Owner | Severity | Evidence | Destination |
|---|---|---|---|---|
| UNVERIFIED_CAPABILITY_IDENTITY | UNKNOWN | WARNING | city:capability-registry/CAPABILITY_RECORD_TEMPLATE.yaml | CAPABILITY_LINKED_MISSION |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/CAPABILITY_RECORD_TEMPLATE.yaml | CAPABILITY_LINKED_MISSION |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-ASK-001.yaml | CAPABILITY_LINKED_MISSION |
| EVIDENCE_POINTER_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-ASK-001.yaml | MISSION_BOOK |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-CITY-MEMBERS-NATIVE-001.yaml | CAPABILITY_LINKED_MISSION |
| EVIDENCE_POINTER_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-CITY-MEMBERS-NATIVE-001.yaml | MISSION_BOOK |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-EXECUTION-001.yaml | CAPABILITY_LINKED_MISSION |
| EVIDENCE_POINTER_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-EXECUTION-001.yaml | MISSION_BOOK |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-EXPERIMENT-MANIFEST-001.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| BASELINE_ANCESTRY_MISMATCH | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | CAPABILITY_LINKED_MISSION |
| EVIDENCE_POINTER_MISMATCH | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | OWNER_DIRECTED_CHANGE | WARNING | city:capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CAPABILITY_ENTRY_CLOSEOUT | WARNING | city:capability-registry/records/CAP-IDENTITY-001.yaml | MISSION_BOOK |
| BASELINE_ANCESTRY_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-MON-001.yaml | CAPABILITY_LINKED_MISSION |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-MON-001.yaml | CAPABILITY_LINKED_MISSION |
| EVIDENCE_POINTER_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-MON-001.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-MON-001.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-MON-001.yaml | MISSION_BOOK |
| DEAD_CAPABILITY_RECORD | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| BASELINE_ANCESTRY_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | CAPABILITY_LINKED_MISSION |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-002.yaml | MISSION_BOOK |
| DEAD_CAPABILITY_RECORD | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_RECORD | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| DEAD_CAPABILITY_SYMBOL | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| BASELINE_ANCESTRY_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | CAPABILITY_LINKED_MISSION |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | CITY_WORK_MONITOR | WARNING | city:capability-registry/records/CAP-MON-003.yaml | MISSION_BOOK |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-NODE-DESCRIPTOR-001.yaml | CAPABILITY_LINKED_MISSION |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-ONBOARDING-OWNER-001.yaml | CAPABILITY_LINKED_MISSION |
| EVIDENCE_POINTER_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-ONBOARDING-OWNER-001.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-ONBOARDING-OWNER-001.yaml | MISSION_BOOK |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-RESEARCH-CAMPAIGN-001.yaml | CAPABILITY_LINKED_MISSION |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-RESEARCH-FAULTS-001.yaml | CAPABILITY_LINKED_MISSION |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-RESEARCH-REPLAY-001.yaml | CAPABILITY_LINKED_MISSION |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-RESEARCH-TRACE-001.yaml | CAPABILITY_LINKED_MISSION |
| EVIDENCE_POINTER_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-RESEARCH-TRACE-001.yaml | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-RESEARCH-TRACE-001.yaml | MISSION_BOOK |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-SCHEDULER-CHOICE-001.yaml | CAPABILITY_LINKED_MISSION |
| EVIDENCE_POINTER_MISMATCH | UNKNOWN | WARNING | city:capability-registry/records/CAP-SCHEDULER-CHOICE-001.yaml | MISSION_BOOK |
| WRONG_OWNER | UNKNOWN | WARNING | city:capability-registry/records/CAP-WORKER-POOL-AGENT-001.yaml | CAPABILITY_LINKED_MISSION |
| DUPLICATE_WORKBOOK_ID | Mission Book | ERROR | city:mission-book/finished/completed-2026-10-01/past-rules/MISSION_TEMPLATE-v1.md | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | Mission Book | WARNING | city:mission-book/finished/completed-2026-10-03/rescheduling-vnext/RS-203-跨设备执行回传与降级恢复.md | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | Mission Book | WARNING | city:mission-book/finished/completed-2026-10-06/capability-entry-closeout/CEX-790-final-exposure-audit-and-freeze.md | MISSION_BOOK |
| EVIDENCE_POINTER_MISMATCH | Mission Book | WARNING | city:mission-book/finished/completed-2026-10-06/workbench-compatibility-migration/WBC-604-execution-profile-switch-and-hybrid-routing.md | MISSION_BOOK |
| UNREGISTERED_CAPABILITY | Source owner UNKNOWN | WARNING | utopia:agents/reference-node/agent.mjs | CAPABILITY_LINKED_MISSION |
| UNREGISTERED_CAPABILITY | Source owner UNKNOWN | WARNING | utopia:apps/android/app/src/main/java/city/utopia/control/PairingApi.kt | CAPABILITY_LINKED_MISSION |
| UNREGISTERED_CAPABILITY | Source owner UNKNOWN | WARNING | utopia:apps/android/app/src/main/java/city/utopia/control/RelayDial.kt | CAPABILITY_LINKED_MISSION |
| UNREGISTERED_CAPABILITY | Source owner UNKNOWN | WARNING | utopia:apps/android/app/src/main/java/city/utopia/control/RelayPairing.kt | CAPABILITY_LINKED_MISSION |
| UNREGISTERED_CAPABILITY | Source owner UNKNOWN | WARNING | utopia:apps/web/discovery.js | CAPABILITY_LINKED_MISSION |
| UNREGISTERED_CAPABILITY | Source owner UNKNOWN | WARNING | utopia:apps/web/relay-dial.mjs | CAPABILITY_LINKED_MISSION |
| UNREGISTERED_CAPABILITY | Source owner UNKNOWN | WARNING | utopia:apps/web/relay-join.mjs | CAPABILITY_LINKED_MISSION |
| UNREGISTERED_CAPABILITY | Source owner UNKNOWN | WARNING | utopia:apps/web/short-code.js | CAPABILITY_LINKED_MISSION |
| UNREGISTERED_CAPABILITY | Source owner UNKNOWN | WARNING | utopia:services/dev-gateway/host-join.mjs | CAPABILITY_LINKED_MISSION |
| UNREGISTERED_CAPABILITY | Source owner UNKNOWN | WARNING | utopia:services/dev-gateway/host-preflight.mjs | CAPABILITY_LINKED_MISSION |
| UNREGISTERED_CAPABILITY | Source owner UNKNOWN | WARNING | utopia:services/dev-gateway/relay.mjs | CAPABILITY_LINKED_MISSION |
| DEPENDENCY_CYCLE | Architecture | WARNING | utopia:city/02-engineering/01-project-foreman/project-foreman/repository.mjs | URA |

## Coverage

See report.json for unknown/unmeasured domains, diagnostics, self model, BLG-001..006 reconciliation and routing receipts. Static heuristics discover candidate drift; findings do not establish root cause or authorize repair.
