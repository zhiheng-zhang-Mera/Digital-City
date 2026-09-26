# Digital City Protocol

This document defines the architectural vocabulary and minimum integration rules for Digital-City.

## 1. Classification before coupling

Every new capability must be classified before implementation:

| Type | Meaning | Typical owner |
|---|---|---|
| City infrastructure | Runtime, trust, identity, orchestration, node fabric, capability fabric, semantic roads, shared lifecycle and human control surfaces | City-level infrastructure |
| District | First-level domain/civic area grouping related buildings without merging their implementation | Digital-City topology |
| Building | Coherent institution/product/service boundary inside a district; may be backed by one repository, several repositories, or an explicit placeholder | Owning project(s) / product boundary |
| Planned building | Reserved city placement with no implementation yet | Digital-City documentation only |
| Room | Capability owned by one building | Module/service inside that repository |
| Resident | Persistent digital identity/agent that uses city services | Digital-Me or future agents |
| Road | Stable interface, event, schema, or data flow between buildings | Shared contract |
| Bridge | Higher-level integration that spans multiple roads/buildings | Explicit cross-project composition |
| Engineering works | Construction, repair, qualification, host and recovery tooling | DS-Hns and operational repositories |

Capability Fabric is distinct from Node Fabric: Node Fabric answers which authorized runtime nodes exist; Capability Fabric answers which capabilities exist, who provides them, and how they are discovered/registered. Plugins are one capability packaging/admission form, not the capability model itself.

A feature must not be moved into Boss merely because multiple projects use it. It belongs in Boss only when it is genuinely city-level infrastructure.

A planned building must use the explicit state `PROJECT_NOT_CREATED`. A placeholder reserves topology only and has no implementation authority.

## 2. Repository independence

Digital-City is a registry and integration map, not a monorepo.

Connected repositories should remain:

- independently cloneable;
- independently testable;
- independently versioned;
- independently releasable where applicable;
- capable of describing their public city-facing rooms and roads;
- removable or replaceable without forcing unrelated domains to be rewritten where practical.

Digital-City must not become a copy of their source trees.

## 3. Source of truth

- Project implementation truth lives in the project repository.
- City placement and cross-project role live in Digital-City.
- A district README describes the district boundary for humans.
- A building README describes the building boundary and its public city-facing capabilities.
- `CITY_MANIFEST.yaml` describes the same topology for machines.
- Project-specific evidence stays with the project unless a city-wide ledger is explicitly required.
- A planned placeholder is never implementation truth.

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

## 5. Governance and policy scope

Digital-City separates rule scope from execution authority.

### L0 — City Constitution

Reserved for a very small set of city-wide invariants such as:

- root identity and Owner sovereignty;
- explicit authority transfer boundaries;
- cross-domain permission/scope isolation;
- protected data boundaries;
- audit/provenance integrity;
- extension lifecycle and removal safety where city-wide.

The city constitution must stay small. Domain-specific research, health, construction, or entertainment rules do not belong here.

### L1 — Domain Charter

Each domain may define its own rules, for example:

- Research: model semantics, falsifiability, evidence and research-review rules;
- Medical: health-data handling and health-model evidence requirements;
- Engineering: construction, repair, continuity and operational constraints;
- Entertainment: media/experience-specific behavior.

> **Policy is scoped by domain unless explicitly promoted.**

A Research Charter does not automatically govern Medical or Hns. A Medical rule does not automatically govern Research. Promotion to city-wide scope must be explicit.

### L2 — Project Policy

A concrete repository/building may define local policy inside its domain boundary.

### L3 — Runtime / Experiment Rules

Temporary gates, experiment settings, version-specific checks and execution rules stay local unless deliberately promoted.

## 6. Admission, enforcement and audit

The city uses three conceptual actions rather than a new bureaucracy:

```text
ADMIT   = can this building/extension safely enter?
ENFORCE = is it violating a city-wide hard boundary while running?
RECORD  = what happened, with what identity/authority/evidence?
```

### Customs Security / 海关安检 — ADMIT

A future Customs Security capability may validate:

- manifest/schema;
- identity/source;
- dependencies;
- requested permissions/capabilities;
- domain scope;
- isolation;
- enable/disable/uninstall/rollback semantics.

It is an admission-time boundary. It should not continuously govern the internal business logic of an admitted building.

### Runtime Compliance / Public Security / 公安与运行时合规 — ENFORCE

A future runtime-compliance capability may enforce city-wide hard boundaries at meaningful enforcement points such as:

- privilege requests;
- cross-domain calls;
- protected-data access;
- durable state mutation;
- service registration;
- authority escalation.

It must not judge domain quality. It may block Research from reading protected Medical data, but it does not decide whether a research model is scientifically correct, whether a health estimate is clinically good, or whether Hns scheduling is optimal.

### Audit — RECORD

Audit records identity, authority, decision and evidence without becoming another approval layer.

## 7. Research and Machine Intelligence scope

The PhD-oriented Machine Intelligence direction is currently a **Research-domain program**, not a city constitutional primitive.

Candidate mechanisms include:

- delayed/post-learning consolidation;
- familiarity/fusion state;
- dynamic association structures;
- long-term adaptation;
- AI-assisted mathematical formalization;
- multi-AI critique;
- simulation and falsifiable prediction.

These mechanisms may later be promoted if they prove stable and genuinely reusable across domains. Until then:

```text
Research mechanism != city-core requirement
Research charter   != city constitution
Research result    != automatic runtime truth
```

Boss may expose generic primitives needed by multiple domains, but research-specific semantics stay in Research.

## 8. Building admission

A repository may be registered as connected when at least one of these is true:

- it owns an active city capability;
- another city project depends on it;
- it is the canonical evidence or research artifact for a city capability;
- it provides reusable engineering, device, privacy, or domain infrastructure.

A **planned building placeholder** may be registered before a repository exists only when:

- the intended city role is clear;
- it is explicitly marked `PROJECT_NOT_CREATED`;
- no active dependency points to it as though it already exists;
- creating a dedicated repository is deferred until real implementation work justifies it.

Old coursework and unrelated experiments are not automatically admitted.

## 9. Extension principle

Future ecosystem insertion should prefer a thin extension contract over city-core modification.

A future extension interface should answer only questions such as:

- identity/version;
- requested capabilities and permissions;
- required services/dependencies;
- domain scope;
- storage namespace;
- lifecycle: install/enable/disable/uninstall/rollback;
- crash/isolation boundary.

New ecosystems should not normally require Root Trust redesign, new epoch ceremonies, or unrelated domain migrations.

## 10. Update discipline

When city topology changes:

1. update the affected district and/or building README;
2. update `CITY_MANIFEST.yaml`;
3. update the root city map when the change affects navigation or city-level semantics;
4. update road documentation when a new cross-project dependency becomes durable;
5. avoid renaming districts or buildings casually once other tooling consumes their paths;
6. keep placeholders explicitly non-operational until a project exists;
7. do not promote a domain rule to city-wide scope merely for convenience.
