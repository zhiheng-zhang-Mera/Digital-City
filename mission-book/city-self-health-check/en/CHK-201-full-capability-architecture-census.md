> English reading translation / 英文阅读译本. The [original document](../CHK-201-full-capability-architecture-census.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

# CHK-201 — Full Capability / Architecture Census / Full health check

> **PARKED / NOT ACTIVATED.** Currently preserves only the future full-check contract.

## Objective
Reconstruct the current City/Utopia state from actual implementation and runtime surfaces, then reconcile it against the Registry, City topology, and Mission truth to identify situations where records agree with each other but reality has drifted.

## 1. Full Capability Census
Discover capabilities by working backward from:

```text
Utopia code
+ API/actions
+ runtime services
+ Web/Android surfaces
+ Mission history
+ accepted evidence
```

Then reconcile them against the Registry.

Classifications must include at least:
- UNREGISTERED_CAPABILITY;
- DUPLICATE_CAPABILITY;
- DEAD_CAPABILITY_RECORD;
- OVER_AGGREGATED_CAPABILITY;
- OVER_FRAGMENTED_CAPABILITY;
- WRONG_OWNER;
- WRONG_EXPOSURE_CLASS;
- REGISTRY_RUNTIME_MISMATCH.

## 2. Architecture Census
Compare against the candidate URA taxonomy:

```text
Core
Platform/System Service
System App
Native App
Connector
```

Check business functionality intruding into Core, reverse dependencies, duplicate owners, drifting Service/App roles, and similar issues.

The only allowed outputs are:

`KEEP / RECLASSIFY / BOUNDARY_REPAIR / MIGRATION_CANDIDATE`.

## 3. City ↔ Utopia Mapping
Reconcile:

```text
District / Building / Room / Road
↔
Utopia module / service / app / contract
```

Check whether owners, Roads/APIs, consumers, and lifecycles are stale.

## 4. Dependency / Contract Health
Reconstruct the actual dependency graph and check:
- Cycles;
- Reverse dependencies;
- Hidden coupling;
- Dead dependencies;
- Orphan modules;
- Undocumented runtime dependencies;
- Drift in schema, version, and failure semantics.

## 5. Legacy / Zombie / Dead State
Identify:
- Dead code, APIs, and surfaces;
- Stale documentation;
- Superseded rules;
- Abandoned future plans;
- Old evidence pointers;
- Duplicate adapters;
- Dead feature flags.

Discovery does not authorize deletion.

## 6. Governance / Rule Debt
For each long-term rule, answer:

```text
source failure
current scope
still needed?
false blocks?
conflicts?
overhead?
superseded?
retire/narrow/keep?
```

## 7. Autonomy Health
Where measurable, aggregate:
- Owner intervention;
- Autonomous task transitions;
- False COMPLETE;
- Duplicate work;
- Repair loops;
- Repeated escalation;
- Idle and waiting time;
- Resume and handoff failures.

## 8. Evidence / Security / Authority
Check evidence retrieval, checksums and retention, credential/permission/identity/revocation boundaries, and sensitive information in logs.

## Outputs
Generate only a census/report and follow-up routing; do not directly undertake a major overhaul.
