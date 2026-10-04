# State Identity, Provenance, and Freshness in Long-Horizon Agents — SHA-Anchor Evidence Note

> Status: **RESEARCH MATERIAL / FAILURE-MODE RECORD / NOT A STANDALONE CLAIM**  
> Date: 2026-10-05  
> Trigger: Mission Book recently changed critical executable workbook anchors for baselines, dependencies, review, CI, and acceptance from mutable branch/head semantics to immutable full commit SHAs, with required-ancestor, exact-head evidence, and reconciliation checks.  
> Positioning: **“branch → SHA” is not itself a standalone research contribution; it is a real failure mode, design-evolution record, and ablation dimension for long-horizon agent execution-state reliability.**

## 1. Research abstraction

The research question is not:

> Git branches move, therefore pin a commit.

It is:

> **In long-running, asynchronous, multi-agent software engineering, persistent state can still lose identity and validity over time when it stores mutable symbolic references. Agents need verifiable state identity, provenance, and freshness semantics.**

Therefore:

```text
Reliable External State
!= Any External State
```

Candidate formulation:

```text
Reliable External State
= persistence
+ immutable identity
+ provenance/dependency relation
+ validity/freshness revalidation
```

## 2. RQ4 — State identity and validity

> **Which execution-state fields require immutable identity, provenance binding, and explicit validity checks during long-horizon agent execution?**

### 2.1 Identity

Compare:

```text
conversation-only symbolic belief
vs
persistent branch/tag/head name
vs
immutable full commit SHA / artifact digest / run id
```

Observe:

- stale-state errors;
- wrong baselines;
- wrong merge sources;
- wrong review targets;
- duplicate/regression work.

### 2.2 Provenance

Compare:

```text
SHA only
vs
SHA + required ancestor/dependency SHAs
vs
SHA + explicit evidence/run provenance
```

Observe:

- dependency omission;
- silently missing accepted capability;
- incorrect green-CI attribution;
- review/evidence pointer mismatch.

### 2.3 Freshness / validity

Compare:

```text
record once and trust forever
vs
revalidate before critical transition
```

Critical transitions include:

- claim;
- resume after compaction;
- handoff;
- Review;
- CI attribution;
- merge/integration;
- completion / acceptance;
- recovery from an external blocker.

## 3. Real engineering failure episode: mutable-ref drift

Typical trajectory:

```text
t0  Agent claims task
    baseline_symbolic_ref = main

t1  another agent / merge advances main

t2  original agent resumes
    remembered "main" now resolves to a different world state
```

Important distinction:

- the branch name is not itself wrong;
- the new branch tip may be healthy;
- the agent's historical reasoning was bound to the old world state;
- keeping only the symbolic ref can lose the identity of the world state originally used.

Classify this as:

`MUTABLE_REFERENCE_STATE_DRIFT`

rather than a generic Git failure.

## 4. Evidence Pointer Mismatch

Preserve real or future episodes of the form:

```text
expected task head = SHA_A
observed branch    = feature-x
current branch tip = SHA_B
CI(SHA_B)          = GREEN
```

Then:

- “CI is green” may be true;
- “SHA_A has been validated” is still false.

Classification:

`EVIDENCE_POINTER_MISMATCH`

Suggested fields:

```text
expected_identity
observed_symbolic_ref
resolved_identity_at_use
evidence_identity
mismatch_detected
critical_transition
consequence_if_not_detected
reconciliation_action
owner_intervention_required
```

## 5. Interaction with compaction / resume

This is the strongest connection to the Context Lifecycle study.

Before compaction:

```text
branch = integration-x
exact_sha = abc...
```

If compaction retains only:

```text
working on integration-x
```

then an **immutable identity has been degraded into mutable symbolic state**.

Candidate principle:

> **Identifiers with execution semantics should be serialized exactly, not semantically summarized.**

Fields that should preferentially use exact-copy / structured serialization include:

- full commit SHA;
- task/workbook id;
- claim owner / host identity;
- dependency accepted SHA;
- artifact digest;
- CI run/job id;
- experiment/run id;
- versioned schema / configuration id;
- immutable acceptance-evidence refs.

This can be measured jointly with State Reconstruction Accuracy:

- was semantic state reconstructed?
- was exact identity reconstructed?
- were provenance relations reconstructed?
- was freshness revalidated?

## 6. Future controlled ablation

Candidate state-representation levels:

| Level | Representation |
|---|---|
| L0 | conversational symbolic state only |
| L1 | persistent mutable symbolic refs |
| L2 | immutable exact identity |
| L3 | immutable identity + provenance/dependency |
| L4 | immutable identity + provenance + critical-point revalidation |

Under controlled branch advance, resume, compaction, handoff, and CI-completion events, measure:

- stale-state error rate;
- evidence pointer mismatch;
- wrong completion;
- wrong merge/review target;
- duplicate/regression work;
- Owner intervention;
- recovery success;
- State Reconstruction Accuracy;
- autonomous task transitions.

## 7. Publication boundary

### Weak as a standalone claim

- “commit SHA is more stable than a branch”;
- “Git branches are mutable refs”;
- “critical dependencies should be version-pinned”.

These are mature engineering practices.

### Valuable as part of a research contribution

- a long-horizon agent failure taxonomy;
- persistent external state is not automatically reliable state;
- mutable symbolic references cause temporal state drift in asynchronous multi-agent execution;
- the effect of exact identity + provenance + freshness on recovery / compaction / handoff;
- whether execution-semantic identifiers must be protected from semantic summarization.

## 8. Relationship to the Context Lifecycle thesis

Existing framing:

> **When to compact → What to retain → What to externalize**

Add a fourth question:

> **What must remain immutable and be revalidated?**

The broader design problem becomes:

```text
When to compact
→ What to retain
→ What to externalize
→ What must preserve exact identity / provenance / freshness
```
