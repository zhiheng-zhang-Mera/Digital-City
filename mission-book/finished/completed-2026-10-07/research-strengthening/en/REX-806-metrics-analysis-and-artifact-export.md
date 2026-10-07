# REX-806 — Metrics Analysis + Research Artifact Export

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../REX-806-metrics-analysis-and-artifact-export.md). Current frontmatter and authoritative reports determine status, claims, exact SHAs, CI and gates. This reading page does not copy or supersede live task metadata.
>
> [Standing rules](../../../CONSTRUCTION_RULES.md) · [Async protocol](../../../ASYNC_RELIEF_CONSTRUCTION.md) · [Research material](RESEARCH_EVIDENCE_PROTOCOL.md)

## Objective

Export experiments as inspectable artifacts:

```text
artifact/
├─ manifest
├─ environment
├─ topology
├─ raw pointers
├─ normalized dataset
├─ metrics.csv
├─ failures
├─ exclusions
├─ tables
├─ reproduction
└─ checksums
```

## Metrics

At minimum, support the following from actual predecessor data:

- completion time;
- recovery time;
- handoff time;
- failure rate;
- intervention count;
- retry count;
- duplicate execution;
- convergence / missing event, where measurable;
- task transitions before Owner intervention;
- time / steps to first Owner intervention;
- intervention-free survival, where constructible;
- intervention cause taxonomy;
- task-pool drain before intervention;
- control-plane reality mismatch count / reconciliation time;
- implementation→wiring→reachability→intent transition timestamps;
- Exposure Lag / Intent Lag, where measurable;
- Registry-assisted localization/onboarding cost, where supplied by the experiment;
- high-value Owner decision count;
- avoidable technical escalation count;
- repeat clarification count;
- escalation → autonomy-resumed time;
- batchable escalation count / interruption burst, where measurable;
- rule activation / conflict / false-block / retirement observations;
- textually clean semantic integration failure count;
- independently green components → integrated semantic failure count.

Mark unsupported metrics NOT_MEASURED.

### Metric interpretation guard

- owner_intervention_count=0 is permitted only when the entire window is explicitly observed with genuinely no intervention. Unknown must be NOT_MEASURED.
- “Ran longer” does not mean greater autonomy. Classify idle loops, duplicate work and blocked polling separately.
- Where survival samples are insufficient, export only raw censored-episode data without forcing a curve or conclusion.
- G1/G2 metrics default to supporting analysis; prioritize G3/G4 metrics in paper-ready tables.

## Export

DIRECT_CONTROL:

- preview dataset;
- export artifact;
- export CSV/table-ready data;
- reproduction instructions.

Do not automatically generate exaggerated conclusions. Keep statistical results separate from the paper narrative.

## Review

The reviewer independently recomputes at least one metric group from the export package and checks checksums/provenance.

## Completion gate

Generate a complete artifact from a real campaign, independently read and recomputed on another physical host.
