# REX-801 — Experiment Manifest + Registry

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../REX-801-experiment-manifest-and-registry.md). Source workbook/report controls state, claims, SHA, CI, and gates.
>
> [Persistent rules](../../../CONSTRUCTION_RULES.md) · [Research material](RESEARCH_EVIDENCE_PROTOCOL.md)

## Objective

Build machine-readable Experiment Manifest and registry binding every research question to question/hypothesis, topology, independent variables, dependent metrics, controls, repetitions, seed, required capabilities, stop conditions, artifact policy, and exact software/config provenance.

## Minimum manifest

Express at least:

```text
experiment_id
question
topology
variables
metrics
repetitions
seed_policy
scenario_ref
fault_profile_ref
software_refs
research_signal_ids
research_grade_snapshot
control_plane_rule_version
authority_surfaces_if_applicable
acceptance
```

## User entry

DIRECT_CONTROL. Reserve a stable Research control contract for list experiments, inspect manifest, create/import manifest, and validate before run. Initial UI may live in Research/Advanced; primary-navigation placement is unnecessary.

## Research-priority binding

Manifest explicitly declares watchlist signals from RESEARCH_SIGNAL_WATCHLIST.yaml, particularly G3/G4, rather than free-text topic alone. Minimum: research_signal_ids supports one or more RS-*; research_grade_snapshot captures G1–G4 at creation; G4 experiments can record authority_surfaces, control_plane_rule_version, expected intervention/reachability state; grade is not novelty guarantee and artifact export preserves snapshot date; unclassified phenomena use UNCLASSIFIED_CANDIDATE and runtime Agents cannot promote them automatically to G4.

## Prohibited

No second task database, paper-specific hardcoded descriptions, fabricated default measurements for missing fields, or automatic dangerous-fault authority from manifests.

## Review

Another physical host independently constructs malformed manifest, unknown capability, impossible topology, conflicting variables, duplicate experiment ID, and deterministic same-seed parsing.

## Material

Mandatory schema evolution, rejection cases, incorrect defaults, user steps, and review disagreement records.

## Completion gate

Stable manifest, registry, validation, direct-control contract, opposite-host Review, exact-head CI, PAPER_MATERIAL_INDEX, and exposure gate PASS.
