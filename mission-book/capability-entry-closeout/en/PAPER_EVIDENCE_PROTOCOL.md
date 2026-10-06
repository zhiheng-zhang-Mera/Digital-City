# Paper Evidence Protocol — Mandatory retention

[中文原文](../PAPER_EVIDENCE_PROTOCOL.md)

> **Status: ACTIVE / NORMATIVE FOR CEX PROGRAMME**
>
> Task-specific Capability Entry Closeout evidence rules supplement rather than replace `mission-book/PROCESS_DATA_POLICY.md` and `mission-book/CONSTRUCTION_RULES.md`.
>
> **Retain the full engineering process useful to future papers, technical reports, and PhD materials without making Digital-City a raw-log warehouse.**

## 1. Four storage layers

### Layer A — Local raw evidence

`Utopia/.runtime/evidence/mission-book/<CEX-ID>/<run-id>/`: stdout/stderr, runtime errors, browser console/page errors, Android logs/receipts, screenshots/capture, timing, retry/reconnect, local tests, temporary probes, before/after state. Large/unfiltered evidence is allowed but must remain git-ignored.

### Layer B — Shareable raw evidence

Select paper-relevant non-sensitive evidence into `Utopia/evidence/raw/mission-book/<CEX-ID>/`: minimal reproduction, failing/passing test pairs, bounded excerpts, performance tables, structured JSON receipts, review falsification scripts, before/after screenshots, exact-head evidence. Prohibited: tokens/secrets/credentials, hidden model reasoning, private user data, unbounded terminal dumps, unrelated repetitive logs.

### Layer C — Evolution event stream

Use existing contract at `Utopia/data-records/evolution/inbox/mission-book/<CEX-ID>/events.jsonl`; record applicable supported events:

```text
MISSION_CLAIMED
ATTEMPT_STARTED
CHANGE_APPLIED
TEST_PASS
TEST_FAIL
RUNTIME_PASS
RUNTIME_FAIL
RECOVERY
OWNER_INTERVENTION
MIGRATION_COMPLETE
VERIFIER_FINDING
REPAIR_APPLIED
CI_RESULT
VERIFICATION_COMPLETE
```

Do not extend eventType for this programme.

### Layer D — City paper index

Each CEX task maintains `Digital-City/mission-book/reports/<CEX-ID>/PAPER_MATERIAL_INDEX.md`: **material index, summary, evidence pointers**, no large logs.

## 2. Required PAPER_MATERIAL_INDEX coverage

Append a record whenever these occur:

### Failure / Error

Command failure; browser page error; Android crash/lifecycle error; CI/test failure; timeout; stale state; reconnect anomaly; race; wrong route; false UI affordance; hidden/unreachable control; backend accepted but UI dropped data; UI invoked incorrect backend semantics.

### Logic conflict

Examples: comments/workbook assumptions disagree with runtime; Web/Android interpret a contract differently; author/Reviewer differ on semantics; old tests treat defects as contracts; implementation conflicts with accepted City ownership; discoverability policy hides existing capabilities.

### Quantitative evidence

Record when available: test/pass/fail counts, CI duration, E2E/convergence latency, retry count, affected endpoint count, hidden-capability count, before/after user steps, explanatory LOC/files touched, meaningful resource use/timing, defect-detection method.

### Repair evidence

For each defect retain as much as possible of all six stages:

```text
OBSERVATION → REPRODUCTION → ROOT CAUSE → REPAIR
→ REGRESSION GUARD → OPPOSITE-HOST VERIFICATION
```

## 3. Recommended index format

```markdown
## PM-007 — Clone finding fetched but dropped by Web Settings

- task: CEX-701
- host/role: Alien / Development
- source head: ...
- category: LOGIC_CONFLICT / UI_EXPOSURE
- observed: API returned cloneFindings; UI destructuring retained only installations
- user impact: credential conflict invisible
- reproduction: ...
- repair: ...
- quantitative:
  - affected surfaces: Web Settings = 1
  - API fields dropped: 1
- evidence:
  - Utopia/evidence/raw/mission-book/CEX-701/...
- verification:
  - Mech / Review / ...
- paper angle:
  - capability-exposure completeness
  - cross-layer contract drift
```

`paper angle` classifies material, not a guarantee of final paper inclusion.

## 4. Never sanitize history

Do not delete failing tests after repair, keep only last green logs, rewrite reviewer-found defects as author-known, erase incorrect assumptions, silently count tooling errors as product defects, or discard contrary data. Faulty test instruments are `MEASUREMENT_DEFECT`, explicitly not product defects.

## 5. Development and Review responsibilities

### Development

Retain baseline, first attempt, observed failures, self-found defects, repairs, test deltas, exact head.

### Formal Review

Do not verify only the author path. At minimum perform one independent falsification, one negative control, one normal-user discoverability/usability check, and one exact-head evidence reconciliation. Record reviewer instrument errors too.

## 6. Completion gate

A CEX task missing DEVELOPMENT_REPORT, REVIEW_REPORT, PAPER_MATERIAL_INDEX, required evolution events, exact-head CI, or evidence pointers cannot complete. Final integration also creates `mission-book/reports/CEX-PROGRAMME/PAPER_MATERIAL_SYNTHESIS.md`, summarizing hidden-capability count, gap taxonomy, defect classes, Web/Android parity deltas, before/after user steps, review-found defects, and final regression evidence.

## 7. Capability Registry-specific evidence

CEX also feeds durable City `capability-registry/`. Whenever observed retain before/after evidence for:

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

Preferred fields:

```text
capability_id
implementation_completed_at
first_surface_available_at
reachability_verified_at
intent_validated_at
user_steps_before
user_steps_after
exact_implementation_sha
registry_record_ref
ui_or_e2e_evidence_ref
```

Registry reconciliation cannot erase pre-repair mismatch. Registry stores current verified state; PAPER_MATERIAL_INDEX preserves evolution/failure chains.
