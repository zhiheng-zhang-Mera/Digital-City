# PCF-702 — Explainable placement and cost estimates

[Canonical state](../PCF-702-explainable-placement.md) · [Shared steps](EXECUTION_CONTRACT.md). PARKED translation.

Proposed modules: services/personal-compute-fabric/{placement,cost-model}.mjs and tests/pcf702-placement.test.mjs. Consume 701/706/708 and produce a pure PlacementProposal through planPlacement. Map WBC helpers compatibly; do not create another claim authority.

Filter trust, authorization/data scope, strict targeting, platform/capability, hard resources, freshness and isolation before ranking. Remeasure or honestly refuse unknown hard requirements. Separate queue, transfer, cold-start, execution and return costs with intervals, provenance, version and missingness. Without calibration use conservative rules, not invented accuracy.

Provide deterministic fixed-priority, capability-only, load-only and composite policies with stable tie-breaks and redacted candidate reasons. Bind proposals to state/policy/observation versions and expiry. Only 704 may admit a proposal after fresh checks.

Run `node --test tests/pcf702-placement.test.mjs`: unauthorized fastest nodes are rejected; offline strict targets are not rerouted; unknown VRAM is neither zero nor sufficient; identical inputs/versions reproduce decisions; free slots are not performance equivalence; large candidate sets are bounded; stale proposals are refused. Retain real two-worker decision snapshots without claiming speedup from unit tests.

715 exposes task-level what/why and candidate reasons without private inputs. More complex policies need separate baselines/ablations; learned placement belongs to 723.

## 2026-10-07 specification revision 2

Transfer07 makes PCF the execution-supply/placement owner; FR supplies engineering priorities and qualification requirements. Filter real executor readiness, consent and input locality, not merely online presence. Preserve local-first; cross-device assistance needs explicit scoped authorization. Distinguish whole-job relocation from concurrent work on both hosts.

See [migration and ownership](MIGRATION_HISTORY.md). This revision grants no execution, budget, remote access or merge authority.
