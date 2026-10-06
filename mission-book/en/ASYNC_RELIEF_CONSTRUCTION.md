# Async Relief Construction — Hns / Codex Asynchronous Relief Protocol

[中文原文](../ASYNC_RELIEF_CONSTRUCTION.md) · [Mission Book dashboard](../README.md)

> **Status: ACTIVE / NORMATIVE / TRANSITIONAL**
>
> **Scope:** Current and subsequent Mission Book engineering until Persistent Foreman Runtime (FR-001) is formally implemented and replaces this protocol.
>
> **This is not a product-feature workbook.** It authorizes no new Utopia product capability and creates no separate task truth. It specifies how the current Hns/Codex development phase should remove the Owner from the “report transport + technical arbitration + manual relay” control loop as far as possible.
>
> [CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md) remains the higher-level persistent specification. In conflicts, persistent rules and newer Owner rulings prevail. Future target: [FR-001](../future-plans/FR-001-Persistent-Foreman-Runtime.md).

## 1. Current objective

Before a real Persistent Foreman Runtime exists, compress the daily path:

```text
Codex/Hns construction
  ↓
long report / blocked
  ↓
Owner moves report to web AI for diagnosis
  ↓
Owner moves conclusions back to construction client
  ↓
continue
```

into:

```text
Owner supplies objective
  ↓
Hns supervisor context
  ├─ Codex development worker
  ├─ fresh critic / diagnostic worker
  ├─ opposite-host formal reviewer
  └─ CI / Mission Book / Git
       ↓
only genuinely human decisions enter Owner Attention
```

Owner may still perform the **first mechanical start** of Hns/Codex sessions that cannot be awakened programmatically. This does not make the Owner responsible for technical judgment or report relay.

## 2. Role boundaries

### Hns — Temporary Supervisor / Session Manager

Prioritize reading latest Mission Book/Git/CI; maintaining condensed current-task context; deciding whether a Codex session continues, restarts, or rotates; delivering Development results to eligible Review; automatically organizing findings into repair packets; no-idle scans during CI/long tests; technical blocker classification before asking Owner; checkpoint/handoff maintenance; and existing restart/continuation capabilities for long tasks where supported.

Hns **does not become a second task truth**. Ownership, branch/head, CI, and completion remain Git plus Mission Book truth. If Hns cannot programmatically start/switch Codex, degrade to “Owner mechanically starts; Hns supplies complete packet”. Never describe that as automated Foreman.

### Codex — Worker / Critic / Formal Reviewer

Distinguish three contexts:

1. **Development worker:** implementation, tests, repairs.
2. **Fresh critic/diagnostic worker:** independently challenges assumptions with fresh context; does not qualify as formal cross-host Review.
3. **Formal reviewer:** formal only when the workbook permits it and physical-host independence holds.

One session should not indefinitely serve as both author and final independent evaluator.

### City / Mission Book — Durable Truth

Persist task/workbook ID, role, branch, exact head, CI, completion/review state, typed blocker, bounded report, and next eligible role/wake condition. Chat context must not be the sole recovery point.

### Owner — L3 Authority

By default Owner handles product/aesthetic choices; material scope expansion; budget/payment/API costs; login/credentials/permissions; irreversible or high-impact external operations; privacy/security authorization; and genuine value tradeoffs unresolved by existing contracts. Ordinary technical uncertainty must not go directly to Owner.

## 3. Mandatory escalation ladder

Every technical blocker follows these levels in order.

### L0 — Current worker self-check

Try applicable actions: actual source inspection, canonical-contract inspection, existing-test inspection, minimal reproduction, alternate experiment/measurement, branch/head/CI attribution, and distinguishing impossible work from incorrectly constructed tests.

### L1 — Fresh critic

If L0 remains uncertain, start a fresh-context critic. It does not inherit author conclusions as facts. Its goal is to refute blocker premises, prioritizing contract/source/runtime evidence. It may suggest minimum repair but must not package guesses as Owner choices.

### L2 — Technical arbitration

For worker/critic disagreement:

```text
runtime measurement
  > canonical source / accepted contract
  > exact-head test evidence
  > report interpretation
  > chat memory / dashboard text
```

Questions these sources can decide must stop at L2.

### L3 — Owner

Escalate only matters genuinely requiring human authority/value judgment. The request states why L0/L1/L2 cannot decide, which Owner authority applies, and minimum necessary options. “I have not found a way yet” cannot be dressed up as an Owner decision.

## 4. Automatic Review → Repair relay

Default formal flow:

```text
Development complete
  ↓
handoff to eligible opposite-host Review
  ↓
PASS ─────────→ merge/integration
  │
  └─ DEFECT
       ↓
     repair packet
       ↓
     original author / eligible repair worker
       ↓
     exact-head CI
       ↓
     reviewer re-check
```

Owner does not relay Review findings unless the finding itself belongs to L3. At minimum structure findings as:

```text
FINDING_ID
SEVERITY
OBSERVED_HEAD
OBSERVATION
REPRODUCTION
EXPECTED_CONTRACT
MINIMUM_REPAIR_BOUNDARY
EVIDENCE
REVIEWER
```

After repair give the reviewer a new head, not a verbal “fixed”.

## 5. Session rotation: do not seek an immortal Codex chat

If compaction causes repeated forgetting; two consecutive rereads still misjudge the same fact; reports repeat old conclusions instead of measurement; a stable checkpoint makes remaining work describable; or a session malfunctions/hangs, Hns should prioritize:

```text
current worker
  ↓
write HANDOFF_PACKET
  ↓
persist branch/head/tests/open items
  ↓
close/abandon stale session
  ↓
start fresh Codex context
  ↓
resume from packet + canonical files
```

Do not sacrifice judgment quality merely to retain one session.

## 6. Standard HANDOFF_PACKET

Every cross-session/role relay includes at least:

```text
TASK_ID
ROLE
IMPLEMENTATION_REPO
CONTROL_REPO
BRANCH
BASELINE_SHA
HEAD_SHA
CI

DONE
CURRENT_TRUTH
OPEN_FINDINGS
REPAIRS_APPLIED

NEXT_ACTION
NEXT_ELIGIBLE_ROLE
WAKE_CONDITION

BLOCKER_TYPE
  NONE
  TECHNICAL
  TEMPORARILY_UNCLAIMABLE
  STRUCTURALLY_INELIGIBLE
  GLOBAL_EXTERNAL_BLOCK
  OWNER_REQUIRED

OWNER_REQUIRED = true/false
OWNER_REASON   = <only when true>

EVIDENCE_POINTERS
```

Long process logs remain in evidence; packets retain only condensed facts needed to recover the next step.

## 7. Asynchronous relief during CI/long tests

Inherit CONSTRUCTION_RULES §4: CI/long tests do not occupy the host; retain the original claim; Hns scans for other non-conflicting eligible work; resume when original task becomes actionable; never invent features or needless refactoring to keep machines busy. If no other lawful work exists, follow §5 typed zero-claim handling instead of manual Owner polling.

## 8. Temporary two-host operation

```text
Alien
  ├─ Hns supervisor context
  └─ Codex worker contexts

Mech
  ├─ Hns supervisor context
  └─ Codex worker contexts
```

Both share City/Mission Book truth, not chat memory. Development and Formal Review continue physical-host independence. A local fresh critic may debug but cannot impersonate formal Review on the other host. An ineligible side leaves a wake condition instead of making Owner remember to return and click later.

## 9. Prohibited current practices

- No default construction report → Owner → web ChatGPT → Owner → construction client loop.
- No ordinary code/test problem classified as Owner gate.
- No additional defensive Markdown clauses instead of diagnosis.
- No indefinitely prolonged Codex session requirement.
- No separately created second task states in Hns/Codex.
- No claims that temporary prompt-driven supervision is Persistent Foreman Runtime.
- No relief by lowering CI, independent review, evidence, or safety gates.

## 10. Relationship to FR-001

This protocol is a **transitional prompt/process operating mode**. Its experimental questions are which supervisor behaviors Hns reliably performs now; which cross-session/host steps still require mechanical human start; which blockers wrongly escalate to Owner; which states a future daemon/event loop must watch; and which packet fields actually suffice for recovery. Real process data becomes FR-001 construction input.

```text
CURRENT MODE:
  HNS    = TEMPORARY SUPERVISOR
  CODEX  = WORKER / CRITIC / REVIEWER
  CITY   = DURABLE TRUTH
  OWNER  = L3 AUTHORITY ONLY

PERSISTENT FOREMAN:
  FUTURE / NOT YET IMPLEMENTED
```
