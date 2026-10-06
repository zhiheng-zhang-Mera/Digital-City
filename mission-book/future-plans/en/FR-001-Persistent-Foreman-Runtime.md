> Reading translation / 阅读译本. Source authority and inactive status remain unchanged. Metadata below is quoted, not active frontmatter.

[Canonical source](../FR-001-Persistent-Foreman-Runtime.md)

```yaml
plan_id: FR-001
plan_name: PERSISTENT_FOREMAN_RUNTIME
phase: FUTURE_CONSTRUCTION
execution_enabled: false
status: NOT_ACTIVE
implementation_repo: zhiheng-zhang-Mera/utopia
control_repo: zhiheng-zhang-Mera/Digital-City
owner_gate: PROMOTION_REQUIRED
merge_authority: false
depends_on_current_active_pool: true
```

# FR-001 — Persistent Foreman Runtime / Plan to Remove Owner from the Technical Control Loop

> **FUTURE / NOT ACTIVE / NO EXECUTION AUTHORITY.** This file records future construction direction only. Hns, Codex, Alien, Mech, CI runners and other workers must not start construction, claim, create branches or modify Utopia merely because they read it. Owner must explicitly promote it to an active workbook/programme; reread the then-latest Utopia/Digital-City state at claim time.

## 1. Why this layer is needed

Utopia development already has many automated-construction parts:

- Hns/Codex can construct, test and repair for long periods.
- Alien and Mech can perform different-host Development/Review.
- Mission Book provides durable task state, claims, SHA, CI and reports.
- Engineering Manager has connector, scheduler, attention and recovery contracts/components.
- CI, no-idle, typed blockers, reconciliation and re-entry rules are mature.

Yet the actual control loop often remains:

```text
Hns / Codex 施工
    ↓
生成报告 / 遇到技术不确定
    ↓
Owner 把结果带到网页版 ChatGPT 查错 / 仲裁
    ↓
Owner 再把修正意见送回 Hns / Codex
    ↓
继续施工
```

In English: Hns/Codex construct, produce a report or encounter technical uncertainty; Owner takes the result to web ChatGPT for fault-finding/adjudication, then carries corrections back to Hns/Codex so construction continues. The system approaches an automated construction team, but Owner remains project manager, scheduling hub and technical-adjudication relay.

Target daily loop:

```text
Owner
  ↓ 只给目标、产品选择、权限/预算/不可逆裁决
Persistent Foreman Runtime
  ├─ Hns / Codex workers
  ├─ Alien / Mech / server / cloud workers
  ├─ independent critic / reviewer
  └─ CI / Git / Mission Book / Attention
```

Owner supplies goals, product choices and permission/budget/irreversible rulings only. Persistent Foreman Runtime coordinates Hns/Codex workers, Alien/Mech/server/cloud workers, independent critics/reviewers and CI/Git/Mission Book/Attention.

## 2. Core goals

A future Foreman Runtime must at least provide:

1. **Persistence:** a real resident runtime, not one Agent session or a Markdown MUST treated as execution.
2. **Event-driven operation:** continuously observe Git, Mission Book, CI, worker presence, reviews/reports and attention.
3. **Automatic continuation:** resume next steps after task completion, terminal CI, review defects or worker restart.
4. **Review-to-Repair loop:** automatically return findings to the original author or eligible repair worker without Owner manually relaying them.
5. **Internal technical resolution first:** do not directly escalate technical uncertainty to Owner.
6. **Real Owner escalation filter:** only human value judgments, budgets, permissions, irreversible actions and scope/product choices enter Owner Attention.
7. **Dynamic Worker Pool:** Alien, Mech, Linux, Cloud, Hns and Codex are capability providers, not hard-coded physical architecture dependencies.
8. **Durable recovery:** Foreman and workers recover from crashes/restarts using City/Mission Book/event logs.
9. **Result return:** cross-device/worker completion returns to the initiating interaction surface.
10. **No fabricated work:** inherit no-make-work, typed blockers, exact-head evidence and two-host independence rules.

## 3. Recommended technical upgrade path

### Stage A — Persistent Supervisor

Implement a minimal resident loop:

```text
watch events
  ↓
reconcile truth
  ↓
classify pool
  ↓
ensure eligible executor exists
  ↓
wake / launch / resume worker
  ↓
consume result
  ↓
transition task
  ↓
repeat
```

It must keep working without Owner opening a chat window.

### Stage B — Migrated to PCF-727

The complete real Hns/Codex launch, binding, submission, events/checkpoint, restart/resume, result, failure, cancellation and exact task/branch/head requirements are now owned by [PCF-727](../../mission-group/personal-compute-fabric/PCF-727-engineering-connector-live-execution.md). FR consumes separate real evidence for both providers; caller return belongs to728. No duplicate implementation remains here.

### Stage C — Review / Repair autonomous loop

Target:

```text
Developer
   ↓
Reviewer
   ├─ PASS → merge/integration
   └─ DEFECT
        ↓
      Author/Repair worker
        ↓
      reviewer re-check
```

Owner is not the routine intermediary.

### Stage D — Escalation Ladder

Default ladder:

```text
L0 worker self-diagnosis
   ↓ unresolved
L1 independent critic / second worker
   ↓ unresolved
L2 architecture/contract arbiter
   ↓ only if genuinely human
L3 Owner Attention
```

L0–L2 must retain evidence. Do not automatically turn temporary inability to prove something into a request for Owner choice.

### Stage E — Server / Worker Pool runtime

Foreman does not bind to Alien or Mech. Target:

```text
Foreman / City service
        │
        ├─ Windows capability worker
        ├─ Android validation worker
        ├─ macOS/iOS validation worker
        ├─ Linux/server worker
        └─ Cloud worker
```

Physical devices provide capabilities only. Assignment considers task capability, load, eligibility and independent-review requirements.

## 4. Existing assets that must be reused

At future construction time, prefer reuse over creating another truth:

- `mission-book/CONSTRUCTION_RULES.md`.
- Mission Book frontmatter, reports and typed blockers.
- Accepted Engineering Manager EM-001..013 contracts.
- EM-005 Attention.
- EM-009 recovery.
- EM-010 Foreman Scheduler / DAG / worker pool.
- EM-011 / EM-012 connector direction.
- EM-013 task surface.
- Remote Fabric.
- Current City task/event/device truth.
- Existing Hns restart/task-continuation/Computer Use capabilities: reaccept actual capabilities at construction time; historical descriptions cannot replace tests.

Do not create a second task-ownership, notification or device truth parallel to City/Mission Book.

## 5. Gates Owner should retain

The goal is to remove Owner from the technical control loop, not remove Owner.

Retain:

- Product/aesthetic choices.
- Material scope expansion.
- Budgets/payments/API costs.
- Credentials, login and permissions.
- Irreversible or high-impact external operations.
- New privacy/security authorization.
- Value trade-offs not determined by existing contracts.

Do not escalate by default:

- Ordinary code bugs.
- Failed test construction.
- Missing evidence.
- CI code failures.
- Branch/head mismatches.
- Conflicting technical hypotheses.
- Temporary inability to find an implementation.
- Worker/reviewer disagreement about source facts.

## 6. Relationship to the current Hns / Codex development phase

This plan does not require pausing Utopia now to build Foreman.

For the current phase:

- Hns/Codex remain primary constructors.
- Alien/Mech retain physical-host eligibility under existing workbooks.
- Mission Book remains durable truth.
- Prioritize closing current active workbooks.
- Foreman Runtime does not preempt UXI-391 or other active work.

A temporary manually started, automatically long-running mode may accumulate future Foreman interfaces/process data. Do not present temporary scripts/prompts as a completed Persistent Foreman.

## 7. Future promotion conditions

Generate active programmes/workbooks from this plan only after Owner explicitly decides to start.

Before starting, reassess:

1. Whether Hns/Codex interfaces remain the primary construction entry.
2. Which Engineering Manager connectors can actually control sessions.
3. Whether a long-lived Linux/server/cloud host exists.
4. Whether the Mission Book data model needs evolution.
5. Current worker-pool/platform-validation topology.
6. Which Owner gates are stably machine-decidable.
7. Whether to build single-host Persistent Foreman before multi-host expansion.

## 8. Suggested first-version completion gate

Future v1 need not automate everything, but must prove at least:

- Foreman launches an eligible Hns/Codex worker after an Owner engineering goal.
- Development automatically hands off to another eligible reviewer.
- Findings automatically return to repair.
- Waiting for CI does not interrupt the whole control loop.
- Worker/session crashes recover automatically.
- Merge automatically leads to rescan/next claim.
- A purely technical blocker resolves through L0–L1–L2 without disturbing Owner.
- A genuine human product choice correctly escalates to Owner.
- Owner need not copy reports to another AI and copy answers back.

## 9. Non-goals

The first stage does not require:

- Supporting all AI providers at once.
- Fully autonomous product planning.
- AI self-approval of payment, permissions or irreversible actions.
- Abolishing two-host independent review.
- Rewriting City/Engineering Manager.
- Weakening evidence, CI or correctness gates to appear more automated.

## 10. Purpose of this record

Retain current-phase lessons as future construction inputs:

- Two-host concurrency increases throughput but does not automatically reduce Owner management load.
- Mission Book has durable facts but lacks a persistent executor/supervisor.
- UXI-390 to UXI-391 exposed premature escalation of technical uncertainty to Owner.
- Review finds real defects, but Review-to-Repair still needs an explicit automatic loop.
- Markdown rescan/wake/MUST rules cannot replace an actual daemon/runtime.
- Current long-running Hns/Codex construction is a real testbed for Foreman connectors and recovery.

```text
FUTURE PLAN = RECORDED
EXECUTION   = NOT AUTHORIZED
PROMOTION   = OWNER REQUIRED
```

## 2026-10-07 authoritative subscope transfer

The listed execution-only requirements are MIGRATED OUT, not completed. Their sole implementation/acceptance owner is the destination PCF workbook; this source consumes its versioned contract/evidence. Remaining original domain requirements and gates are retained. Any earlier prose naming the same objects is a domain extension or consumption requirement, not duplicate ownership. No activation is granted.

| Transfer | Source requirement | Destination | Remaining source scope |
|---|---|---|---|
| PCF-MIG-20261007-04 | FR-001 — Real engineering connector launch/bind/submit/events/control/result/health acceptance | PCF-727 | Engineering goal planning, Review-to-Repair, escalation and merge decisions |
| PCF-MIG-20261007-05 | FR-001 — Originating agent/session bridge for remote submission and structured result consumption | PCF-728 | Business synthesis decisions and the complete autonomous Foreman control loop |
| PCF-MIG-20261007-06 | FR-001 — Execution-side supervision, wakeup, receipt consumption and canonical reconciliation | PCF-712 | Git/Mission Book/CI goal observation, next-job selection and Review-to-Repair |
| PCF-MIG-20261007-07 | FR-001 — Execution supply, explainable placement, atomic admission and reservations | PCF-702, PCF-704 | Engineering priority, review role/qualification demands and optional-platform business topology |

Stage B implementation now belongs toPCF-727; FR still requires separate real acceptance for BOTH Hns and Codex when consumed. Caller return belongs to728. Stage A retains goal/event observation and business decisions, while execution-side supervision belongs to712. Stage E retains engineering demand/qualification and optional topology; execution supply/placement/admission belongs to702/704. Android remains control-only unless separately authorized. Review-to-Repair, escalation, Owner filters, project selection and merge policy remain FR.
