# PCF-725 — Execution provider contract and lifecycle boundaries

**PARKED / DESIGN ONLY / NOT ACTIVATED.** Canonical state: [source](../PCF-725-execution-provider-contract-and-boundaries.md). This reading copy has no claim authority.

[Shared execution contract](EXECUTION_CONTRACT.md) · [Migration history](MIGRATION_HISTORY.md)

Transfers01/02 extract the execution-provider foundation from URA-002/003, not citywide taxonomy. Read exact donor text and MIGRATION_MANIFEST first.

Candidate files: `contracts/personal-compute-fabric-v1/executor-provider.mjs` and `tests/pcf725-provider-boundaries.test.mjs`; reconcile these with PCF-700 and existing EM ConnectorPort.

- [ ] `normalizeExecutionProvider(manifest)` specifies version, supported workload schemas, capabilities, platform, permission handles, argv schema, namespace, lifecycle, enforcement and compatibility without another provider/task/credential authority.
- [ ] `describeExecutorBoundary(provider, hostFacts)` distinguishes enforced, cooperative and UNKNOWN isolation. An ordinary process is not a security sandbox; refuse an unavailable required boundary.
- [ ] Specify startup/shutdown/disable/update/rollback, dependency loss, incompatibility and crash containment. Process control belongs to710, supervision to712 and installation to716.
- [ ] Version and test consumer mappings for708/710/727/724 and URA; this foundation must not depend on its consumers.

Acceptance: unknown versions/permissions, namespace escapes, hostile arguments, false isolation claims, crash and disable races; disabling one provider must leave other providers and City alive. Run `node --test tests/pcf725-provider-boundaries.test.mjs` and opposite-host review. Component acceptance is not a deployment claim.
