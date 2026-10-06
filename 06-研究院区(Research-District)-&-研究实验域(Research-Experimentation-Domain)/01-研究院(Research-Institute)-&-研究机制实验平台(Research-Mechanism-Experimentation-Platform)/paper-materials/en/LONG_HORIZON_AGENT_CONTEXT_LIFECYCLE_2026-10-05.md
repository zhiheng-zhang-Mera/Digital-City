# Long-Horizon Agent Context Lifecycle and External Execution State — Evidence Priorities

> Status: **RESEARCH MATERIAL / HYPOTHESIS-DRIVEN / NOT YET A CAUSAL FINDING**  
> Date: 2026-10-05  
> Purpose: turn recent long-running hosted coding experience with Codex / GPT-5.6 Astra and DeepSeek V4.1 Flash into persistent evidence-collection priorities for future development.  
> This document does not mandate implementing a specific compaction algorithm now; it specifies what evidence is worth retaining during future work.

## 1. Core research questions

### RQ1 — When to compact
When should a long-horizon software-engineering agent compact its working context?

Do not study only a fixed context-window percentage. Capture, when observable:

- context occupancy / token pressure;
- fixed-threshold triggers;
- task / subtask / commit / test semantic-boundary triggers;
- whether compaction occurs during unresolved debugging;
- harness-auto, Owner-manual, or agent-initiated triggers;
- effective engineering span since session start / previous compaction.

Candidate hypotheses:

- a fixed “compact at X%” rule may not be globally optimal;
- semantic boundaries may outperform pure token thresholds;
- premature compaction during unresolved debugging may increase state loss and repeated exploration.

### RQ2 — What survives compaction
What must be retained, summarized, externally referenced, or discarded?

Distinguish at least:

1. **Active working context**
   - current goal;
   - active hypothesis;
   - recent failures;
   - currently edited area;
   - immediate next action.

2. **Compressed semantic state**
   - confirmed design decisions;
   - user/system constraints;
   - eliminated root causes;
   - failed approaches that should not be repeated;
   - acceptance criteria;
   - unresolved blockers.

3. **External referenced evidence**
   - full CI / test logs;
   - large traces;
   - historical diffs;
   - screenshots;
   - benchmark / measurement raw data.

4. **Authoritative structured execution state**
   - workbook/task id;
   - claim/host;
   - exact branch + full SHA;
   - dependency state;
   - completed / remaining work;
   - acceptance gate;
   - next eligible action.

5. **Safe-to-discard transient noise**
   - repetitive terminal output;
   - routine success logs with no future diagnostic value;
   - repeated state queries that do not affect future decisions.

Primary question:

> Is a generic narrative of “what happened” less useful for long-task recovery than structured serialization of “what state the system is in now”?

### RQ3 — What should live outside the prompt
Which agent state should not depend on conversational context and should instead live in recoverable persistent execution state?

Observe the effect of Mission Book / reports / exact SHA / CI receipts / task pools on:

- recovery after compaction;
- continuation after session restart or model switch;
- duplicate work;
- stale branch / stale state errors;
- false COMPLETE decisions;
- Owner intervention frequency;
- autonomous work span;
- whether a weaker/faster model can sustain longer work when execution state is externalized.

### RQ4 — What must remain immutable and be revalidated
Which execution-state fields must preserve exact identity, provenance, and freshness rather than only their semantic meaning?

This question follows a real Mission Book evolution: critical baseline, dependency, review, CI, and acceptance anchors were changed from mutable branch/head semantics to immutable full commit SHAs, with ancestor/provenance checks and critical-point revalidation.

The research target is not the mature Git fact that branches move. Instead observe:

- whether persistent external state still drifts when it stores mutable symbolic refs;
- whether compaction degrades exact identity into symbolic state;
- whether green CI can be attributed to the wrong head;
- reliability differences among SHA-only, SHA+provenance, and SHA+revalidation;
- whether freshness checks before resume / handoff / review / merge / completion reduce errors.

Dedicated note:

`LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md`

Candidate principle:

> **Identifiers with execution semantics should be serialized exactly, not semantically summarized.**

## 2. Naturalistic evidence to capture during future work

When observable for a long-running / asynchronous agent run, retain:

```text
agent_provider
agent_model
agent_harness
harness_version_or_sha
workbook_id
run_or_session_id
start_time
end_time

context_window_limit_if_known
context_tokens_before_compaction_if_known
context_occupancy_ratio_if_known
compaction_trigger
compaction_trigger_reason
task_phase_at_compaction
semantic_boundary_type
pre_compaction_task_state
post_compaction_task_state

summary_or_checkpoint_artifact_ref
external_state_refs_used
state_fields_reconstructed
state_reconstruction_errors

owner_intervention_count
owner_intervention_reason
task_transitions_completed
duplicate_work_count
stale_state_error_count
false_completion_count
regression_or_reopened_work_count
recovery_time_if_measurable
autonomous_work_span_if_measurable
terminal_reason

expected_identity_if_applicable
observed_symbolic_ref_if_applicable
resolved_identity_at_use_if_applicable
evidence_identity_if_applicable
provenance_or_required_ancestor_refs
freshness_revalidation_event
identity_or_evidence_mismatch_type
reconciliation_action
```

If the harness does not expose token counts, compaction contents, or trigger details, record:

```text
NOT_OBSERVABLE + reason
```

Never guess or use zero as a substitute.

## 3. Post-compaction recovery check

After compaction / context reset / session resume, preferentially verify whether the agent can correctly reconstruct:

1. current mission / workbook;
2. exact branch / full SHA;
3. completed work;
4. remaining work;
5. known blocker / failure;
6. next action;
7. previously falsified paths that should not be repeated;
8. completion / acceptance criteria.

This can support a future metric:

**State Reconstruction Accuracy (SRA)**

```text
SRA = correctly reconstructed required state fields
      / all required state fields
```

Required fields must be compared against external ground truth, not self-scored by the same agent.

## 4. Outcome metrics worth retaining

- Owner Intervention Rate;
- Autonomous Work Span;
- time / task transitions until next Owner intervention;
- compaction recovery success;
- State Reconstruction Accuracy;
- false completion rate;
- duplicate / regression work;
- stale-state / stale-SHA errors;
- task-pool drain success;
- total token / cost, when measurable;
- wall-clock completion time;
- successful autonomous task transitions.

Longer runtime alone is not success. Loops, idle waiting, repeated tests, or unnecessary scope expansion must be classified separately.

## 5. Future controlled comparison

Natural development logs establish the phenomenon and longitudinal case study. Causal claims should come from controlled replay / ablation.

Candidate conditions:

| Variant | Compaction | Summary/state | External persistent execution state |
|---|---|---|---|
| A | overflow / default | generic | none |
| B | fixed threshold | generic | none |
| C | semantic/task boundary | structured | none |
| D | default/controlled | structured | Mission Book |
| E | adaptive timing | structured | Mission Book |

Cross-model / cross-harness comparisons should hold task, repository baseline, acceptance criteria, and available tools as constant as practical.

## 6. Current research position

Current experience supports only:

- the problem is real;
- the human-continuation pattern changed materially before vs. after Mission Book;
- the apparent sensitivity of DeepSeek-style long-running work to compaction and a sufficiently deep task reservoir deserves systematic measurement.

Do **not** yet claim:

- one fixed compaction threshold is optimal;
- Mission Book has causally improved a metric by a specific percentage;
- one model is intrinsically better than another for long-horizon autonomy.

Controlled studies must address confounders such as model version, harness version, project maturity, task difficulty, and evolving prompts.

## 7. Evidence boundary

Collect observable engineering evidence and explicit state only:

- prompts / instructions when retention is permitted;
- compaction events / checkpoint artifacts;
- task state;
- logs / CI / tests;
- timestamps;
- token/cost telemetry when exposed;
- Owner interventions;
- branch/SHA;
- observable action/result sequences.

**Do not require, infer, or retain hidden chain-of-thought / private reasoning.**

The research target is execution state, observable behavior, and recovery—not inaccessible internal reasoning text.

## 8. One-line research thesis

> The goal of long-horizon agents is not to remember everything forever, but to forget safely and recover accurately from reliable external execution state.

A compact framing is:

> **When to compact → What to retain → What to externalize → What must remain immutable and be revalidated.**

---

语言配对 / Language pair: [中文 / Chinese](../zh-CN/LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md) · [English](../en/LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md)
