# Capability Exposure Gap and User-Reachable Vertical Slices — Evidence Priorities

> Status: **RESEARCH MATERIAL / RECURRING FAILURE MODE / NOT YET A CAUSAL FINDING**  
> Date: 2026-10-05  
> Origin: Hns, Boss, and Utopia repeatedly showed the same pattern: strong internal implementation, but the user could not find/invoke the capability or the resulting behavior did not match the Owner's intended semantics.  
> This note defines evidence to retain during future development; it does not claim classic vertical-slice/walking-skeleton practice as novel.

## 1. Core phenomenon

Agents easily optimize:

```text
architecture
→ backend logic
→ tests
→ CI
→ implementation complete
```

Users need:

```text
discoverable entry
→ real backend wiring
→ observable state/result
→ behavior matching user intent
```

Therefore:

> **Implementation complete != user-reachable complete != intent complete**

## 2. Research questions

### RQ-A — Capability Exposure Gap

Does long-running agent development systematically produce:

- hidden capabilities;
- missing entries;
- false affordances;
- backend/UI semantic mismatch;
- cross-platform parity gaps?

### RQ-B — Construction order

Compare:

```text
horizontal implementation-first
vs
UI-shell-first
vs
user-reachable thin vertical slice first
```

The key is not merely “UI first”, but:

> **Establish the thinnest real loop from a real user entry to the real backend and back to an observable result, then widen it.**

### RQ-C — Registry-assisted development

Can a Capability Registry reduce:

- duplicate implementation of existing capabilities;
- edits to the wrong canonical module;
- inability to locate the real user entry;
- false equivalence between implementation completion and product completion;
- broad grep/architecture inference during agent onboarding;
- registry/runtime drift?

## 3. Four completion dimensions

Each capability should distinguish:

```text
implementation_status
backend_wiring_status
user_reachability_status
intent_validation_status
```

These answer:

1. does the implementation exist?
2. does the visible/API action reach the intended backend?
3. can a normal user discover and invoke it?
4. does observed behavior match accepted user semantics?

## 4. Naturalistic evidence fields

```text
capability_id
source_workbook_id
agent_model
agent_harness
implementation_completed_at
first_surface_available_at
backend_wiring_verified_at
reachability_verified_at
intent_validated_at

exposure_class
surface_platform
surface_location
user_steps_to_reach
hidden_capability_detected
false_affordance_detected
wrong_semantics_detected
parity_gap_detected
registry_stale_detected
registry_reality_mismatch_detected

owner_intervention_count
owner_intervention_reason
rework_required
rework_commits_or_files_if_measurable
duplicate_implementation_detected
navigation_or_discovery_failure
time_to_first_user_reachable_slice
registry_reconciliation_result

exact_implementation_sha
ui_or_e2e_evidence_ref
```

Use `NOT_OBSERVABLE + reason` when telemetry is unavailable. Never invent values.

## 5. Candidate metrics

### Exposure Lag

```text
Exposure Lag =
  T(reachability_verified)
  - T(implementation_complete)
```

### Intent Lag

```text
Intent Lag =
  T(intent_validated)
  - T(implementation_complete)
```

### Capability Exposure Gap

Avoid reducing the final metric to one naive count, but track at least:

- implementation COMPLETE + reachability MISSING;
- wiring VERIFIED + intent MISMATCH;
- registry CLAIMED + runtime reality mismatch;
- first-class platform parity differences.

### Time to First User-Reachable Slice

Time from workbook start until the first real user path completes successfully.

## 6. Failure taxonomy

Suggested labels:

```text
IMPLEMENTED_BUT_UNREACHABLE
VISIBLE_BUT_NOT_WIRED
VISIBLE_WRONG_SEMANTICS
DISCOVERABILITY_GAP
SURFACE_PARITY_GAP
CAPABILITY_REGISTRY_STALE
CAPABILITY_REGISTRY_REALITY_MISMATCH
DUPLICATE_IMPLEMENTATION_DUE_TO_DISCOVERY_FAILURE
```

## 7. Candidate controlled study

| Condition | Construction strategy | Registry |
|---|---|---|
| A | implementation-first | none |
| B | implementation-first | registry |
| C | thin vertical slice first | none |
| D | thin vertical slice first | registry |

Hold task/spec/baseline/tool availability as constant as practical and compare:

- time to first usable feature;
- hidden-capability count;
- false-affordance count;
- Owner interventions;
- rework;
- intent mismatch;
- final E2E acceptance;
- duplicate implementation;
- agent onboarding/search cost.

## 8. Relationship to the City Capability Registry

`capability-registry/` is the durable structured data source:

- Registry stores current verified capability state;
- Mission Book stores work and transitions;
- reports/evidence store process and failure chains;
- Research Institute stores research synthesis.

The Registry cannot replace real UI/E2E evidence and cannot self-validate.

## 9. Novelty boundary

Do not claim as primary novelty:

- vertical slices outperform pure layered implementation;
- UI should be discoverable;
- frontend and backend should be connected.

The research target is:

> **Whether agentic software development exhibits a persistent implementation-to-exposure gap, and whether durable capability registries plus user-reachable vertical-slice gating reduce that gap, human intervention, and rework.**

---

语言配对 / Language pair: [中文 / Chinese](../zh-CN/CAPABILITY_EXPOSURE_GAP_USER_REACHABLE_VERTICAL_SLICES_2026-10-05.md) · [English](../en/CAPABILITY_EXPOSURE_GAP_USER_REACHABLE_VERTICAL_SLICES_2026-10-05.md)
