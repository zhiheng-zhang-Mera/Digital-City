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

## 2026-10-07 authoritative subscope transfer

The listed execution-only requirements are MIGRATED OUT, not completed. Their sole implementation/acceptance owner is the destination PCF workbook; this source consumes its versioned contract/evidence. Remaining original domain requirements and gates are retained. Any earlier prose naming the same objects is a domain extension or consumption requirement, not duplicate ownership. No activation is granted.

| Transfer | Source requirement | Destination | Remaining source scope |
|---|---|---|---|
| PCF-MIG-20261007-02 | URA-003 — Executor startup/shutdown, dependency failure, isolation, disable and rollback boundaries | PCF-725 | Citywide dependency direction and non-execution App/service boundaries |

URA retains citywide App/service taxonomy and contracts. Execution-provider manifest/lifecycle/failure foundations consumePCF-725; only App-level extensions and mapping tests remain here. PCF must not depend on completing URA.
