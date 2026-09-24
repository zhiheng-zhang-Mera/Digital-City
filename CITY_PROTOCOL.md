# Digital City Protocol

This document defines the architectural vocabulary and minimum integration rules for Digital-City.

## 1. Classification before coupling

Every new capability must be classified before implementation:

| Type | Meaning | Typical owner |
|---|---|---|
| City substrate | Runtime, trust, identity, routing, policy, shared lifecycle | Codex-Boss |
| Building | Independently maintained project with a coherent domain purpose | A connected GitHub repository |
| Room | Capability owned by one building | Module/service inside that repository |
| Resident | Persistent digital identity/agent that uses city services | Digital-Me or future agents |
| Road | Stable interface, event, schema, or data flow between buildings | Shared contract |
| Bridge | Higher-level integration that spans multiple roads/buildings | Explicit cross-project composition |
| Engineering works | Construction, repair, qualification, host and recovery tooling | DS-Hns and operational repositories |

A feature must not be moved into Boss merely because multiple projects use it. It belongs in Boss only when it is genuinely city-level infrastructure.

## 2. Repository independence

Digital-City is a registry and integration map, not a monorepo.

Connected repositories should remain:

- independently cloneable;
- independently testable;
- independently versioned;
- independently releasable where applicable;
- capable of describing their public city-facing rooms and roads.

Digital-City must not become a copy of their source trees.

## 3. Source of truth

- Project implementation truth lives in the project repository.
- City placement and cross-project role live in Digital-City.
- A building README describes the building for humans.
- `CITY_MANIFEST.yaml` describes the same topology for machines.
- Project-specific evidence stays with the project unless a city-wide ledger is explicitly created.

## 4. Roads

A road should become explicit when two projects repeatedly interact.

A road should eventually declare:

- producer and consumer;
- payload/schema;
- authentication/identity semantics;
- permission boundary;
- failure semantics;
- retry/idempotency behavior when relevant;
- provenance/evidence requirements;
- version compatibility.

Current conceptual road classes:

1. Identity Road
2. Capability Road
3. Event Road
4. Evidence Road
5. Data Road
6. Policy Road
7. Learning Road
8. Recovery Road

Direct ad-hoc coupling is tolerated during exploration but should not silently become permanent infrastructure.

## 5. Governance layers

Digital-City uses three conceptual authority layers.

### Constitutional authority

Reserved for Owner-level boundaries such as:

- root identity;
- irreversible authority transfer;
- external permission expansion;
- publication of protected/private material;
- destructive operations beyond delegated scope;
- changes to the constitutional trust model itself.

### Municipal authority

The city may operate autonomously inside explicit constitutional boundaries, including:

- capability registration;
- routing changes;
- bounded module upgrades;
- resource allocation;
- evidence-based architecture adjustments;
- learning consolidation;
- low-risk policy tuning;
- approved plugin/service composition.

### Operational authority

Engineering and agents may execute authorized work such as:

- coding;
- testing;
- deployment;
- repair;
- restart/recovery;
- monitoring;
- migration;
- benchmarking.

The goal is not to remove Owner authority. It is to move routine work out of per-action Owner gating and into bounded delegated authority.

## 6. Municipal Learning & Evolution

Learning is treated as a city process rather than an immediate mutation of the runtime.

A target lifecycle is:

```text
observation
  -> short-term experience trace
  -> repeated evidence
  -> familiarity / fusion state
  -> consolidation window
  -> learning proposal
  -> bounded validation
  -> accepted city change
  -> longitudinal re-evaluation
```

Important properties:

- new observations do not instantly become permanent rules;
- learning state carries provenance;
- familiarity/fusion is evidence-backed state, not an arbitrary personality score;
- consolidation may occur after the original interaction;
- accepted changes remain testable and reversible where practical;
- constitutional boundaries remain outside autonomous learning authority;
- city-wide learning should prefer changing reusable policies/contracts over duplicating local hacks.

## 7. Building admission

A repository may be registered when at least one of these is true:

- it owns an active city capability;
- another city project depends on it;
- it is the canonical evidence or research artifact for a city capability;
- it is a planned building with an explicit roadmap;
- it provides reusable engineering, device, privacy, or domain infrastructure.

Old coursework and unrelated experiments are not automatically admitted.

## 8. Update discipline

When city topology changes:

1. update the affected building README;
2. update `CITY_MANIFEST.yaml`;
3. update the root city map when the change affects navigation or city-level semantics;
4. update road documentation when a new cross-project dependency becomes durable;
5. avoid renaming buildings casually once other tooling consumes their paths.
