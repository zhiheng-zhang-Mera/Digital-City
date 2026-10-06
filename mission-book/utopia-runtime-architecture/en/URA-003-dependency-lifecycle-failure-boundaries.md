> English reading translation / 英文阅读译本. The [original document](../URA-003-dependency-lifecycle-failure-boundaries.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

# URA-003 — Dependency / Lifecycle / Failure Boundaries

> **PARKED / NOT ACTIVATED.**

## Objective
Establish logical boundaries first, without physically splitting repositories.

## Candidate dependency direction
```text
Native/System Apps
→ Public Contracts
→ Platform/System Services
→ Core primitives
```

Explicit events, callbacks, and extension points may allow information to flow back. Core must not import implementations of specific business apps.

## Required definitions
- Authority boundaries;
- Startup and shutdown order;
- Dependency failure behavior;
- Retry, timeout, and circuit breakers where relevant;
- Data and storage ownership;
- Version compatibility;
- App/service disabling and uninstall semantics;
- Crash containment;
- Migration and rollback;
- Test seams.

## Single-repository principle
A monorepo or single repository can still establish independence through package/module boundaries, contract tests, dependency lint, and runtime registration. Discuss physical repository splitting only after demonstrating benefits for independent releases, deployment, permissions, CI, or lifecycles.

## Completion gate
Produce a proposal for machine-checkable dependency and lifecycle rules, plus minimum boundary tests.
