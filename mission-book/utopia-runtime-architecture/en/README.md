> English reading translation / 英文阅读译本. The [original document](../README.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

# URA — Utopia Runtime Architecture / Utopia runtime layering

> **Status: PARKED / NOT ACTIVATED**
>
> This series records the design for Utopia's internal runtime classification and logical decoupling. It currently only designs future workbooks: **no repository split, no code moves, no changes to accepted capabilities, and no inclusion in main task statistics.**
>
> This directory is excluded from `PROGRESS_MANIFEST.json`; all workbooks have `execution_enabled=false`.

## Objective
Establish a product runtime taxonomy for Utopia that is **orthogonal** to Digital-City topology:

```text
Core primitives
  ↑
Platform / System Services
  ↑
System Apps / Native Apps
  ↑
Connectors / Adapters to external software
```

Candidate dependency principle:

```text
Apps
→ Public Contracts
→ Platform Services
→ Core
```

Reverse business dependencies must not arise unless an explicit extension or callback contract exists.

## Classification
### Core
Retain only genuinely cross-product runtime primitives, such as task/state/event, identity/trust, IPC, permission, device/capability discovery, and recovery.

### Platform / System Service
Provides ongoing capabilities to multiple apps, devices, or agents, without itself being a user-facing business product. Candidates include Gateway, Engineering orchestration, and Remote Fabric.

### System App
A first-class application or control surface included with the system and intended for the Owner, such as the Monitor product surface.

### Native App
**Logically independent, with its experience embedded in Utopia.** Uses system capabilities through a stable App Contract. It neither puts all business functionality into Core nor consists of loose scripts.

### Connector / Adapter
Integrates third-party or existing external products and protocols, without owning Utopia's core business truth.

## Boundary with City vocabulary
Digital-City's District / Building / Room / Road describe **city topology and capability ownership**. URA's Core / Service / App / Connector describe **Utopia product runtime roles**. The two classifications may be cross-mapped but must not overwrite each other.

In particular, City `Room` already has a formal meaning; this series must not redefine it as an incubation room.

## Workbook series
| ID | Work | Status |
|---|---|---|
| URA-001 | Current Runtime Topology & Ownership Audit | PARKED |
| URA-002 | Runtime Taxonomy + App Contract | PARKED |
| URA-003 | Dependency / Lifecycle / Failure Boundaries | PARKED |
| URA-004 | Surface Integration + Capability Registry Mapping | PARKED |
| URA-990 | Soft Reclassification Acceptance & Freeze | PARKED |

## Migration principles
```text
classify first
→ define contracts
→ add boundary tests
→ reclassify docs/registry
→ move code only when measured coupling/ownership/lifecycle benefit exists
```

The current default is: **a single Utopia repository remains acceptable**. A physical repository split is a future option preserved in suspend, rather than the default goal of this series.
