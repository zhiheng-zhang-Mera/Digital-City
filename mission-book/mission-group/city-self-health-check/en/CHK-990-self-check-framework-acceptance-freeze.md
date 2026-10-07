> English reading translation / 英文阅读译本. The [original document](../CHK-990-self-check-framework-acceptance-freeze.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

# CHK-990 — Self-Check Framework Acceptance & Freeze

> **OWNER ACTIVATED / EXECUTION ENABLED.** The first run is bounded dry-run/read-only. Dependency, independent review and promotion gates remain in force; automatic repairs and self-modification are not authorized.

## Objective
Before formally enabling periodic health checks in the future, verify that CHK cannot become a second scheduler, an unlimited audit burden, or permission for automatic self-modification.

## Required tests
1. The small check completes within bounded scope;
2. The full check discovers at least one kind of Registry or architecture drift by working backward from runtime and code;
3. Health reports are strictly separate from repair construction;
4. PARKED and suspend items do not accidentally enter active truth;
5. Self Cognition can express UNKNOWN/NOT_MEASURED instead of guessing;
6. Self Diagnosis retains multiple hypotheses and missing-evidence declarations;
7. Case Records do not overwrite historical judgments;
8. Boss BLG reconciliation can produce non-migration conclusions such as SUPERSEDED or KEEP;
9. Evolution Candidates do not automatically gain execution authority;
10. Candidates are correctly routed to REX/RIV/URA/DGX/other Missions;
11. Promotion and rollback authority are explicit;
12. CHK's own overhead is measurable and does not occupy construction hosts for extended periods.

## Freeze outcome
Candidate:

`CITY_SELF_HEALTH_CHECK_V1_ACCEPTED`

Only after passing CHK-990 may small, full, and quarterly checks become genuinely periodic runtime mechanisms.

Even passing does not automatically create scheduled tasks: frequency and execution hosts require separate explicit enablement.
