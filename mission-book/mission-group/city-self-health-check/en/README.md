> English reading translation / 英文阅读译本. The [original document](../README.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

> **Owner ruling (2026-10-07):** 暂时屏蔽旧版工作书的验收限制，对 DGX 和 CHK 系列在各自分支上全量完成。第二机验收会直接一次性处理整个系列而不是分拆逐个任务验收。 Internal development proceeds across all five CHK workbooks on Alien-GPT-CHK without waiting for old per-task opposite-host acceptance. Whole-series independent second-host review remains NOT_RUN. This exception changes development sequencing only; no main merge, scheduling, repair or promotion authority is granted. Accepted dependency SHAs remain unfilled until actually accepted.


# CHK — City Self Health Check / City self-review and periodic health checks

> **Status: OWNER ACTIVATED / EXECUTION ENABLED**
>
> This series formally incorporates periodic City/Utopia health checks, self-cognition, self-diagnosis, case accumulation, and quarterly review of self-evolution candidates into Mission Book design.
>
> **Owner activated this series.** All five workbooks have `execution_enabled=true`. Use the single `Alien-GPT-CHK` branch without merging to main. Resolve exact SHAs at claim; never invent accepted dependencies. The first run is bounded dry-run/read-only.
>
> This series is now included in `PROGRESS_MANIFEST.json` and the active dashboard. Activation is not development or review completion. See the [activation record](../../../reports/CHK/ACTIVATION.md).

## Purpose
CHK does not fix problems incidentally as it discovers them. Its responsibilities are:

```text
observe
→ reconcile
→ diagnose
→ classify
→ trend
→ propose
→ route
```

Actual repairs, migrations, rule changes, and self-evolution promotions must enter the corresponding Mission / RIV / URA / DGX / REX or another formal workbook.

## Health-check levels
### CHK-101 — Small Check
Suggested future trigger cadence:
- During intensive development: approximately every 3–7 days;
- Or after completing one programme or 3–5 formal workbooks, whichever occurs first;
- Major merges, false COMPLETE, Registry reality mismatches, rule changes, and similar events may trigger additional checks.

Focus on operational reconciliation, without repeating a full architecture review.

### CHK-201 — Full Census
Future suggestions:
- Every 4–6 weeks;
- Or after approximately three substantial programmes have closed out, whichever occurs first.

Focus on a full capability census, architecture/contract/rule debt, dead state, and drift between sources of truth.

### CHK-301 — Quarterly Architecture & Self Review
Suggested future cadence: approximately once every three months.

Beyond the full check, it adds:
- Self Cognition;
- Self Diagnosis;
- System Case Record;
- Runtime Intelligence;
- Boss legacy BLG-001 through BLG-006 reconciliation;
- Evolution Candidate Review.

Quarterly review may only propose candidates; it does not directly modify itself.

## Carrying forward Boss self-evolution
This series always references:

`future-development/Boss-Legacy-Capability-Gaps/README.md`

Focus:
- BLG-001 Self Cognition;
- BLG-002 Self Diagnosis;
- BLG-003 Self Case Record;
- BLG-004 Runtime Intelligence Plane;
- BLG-005 Adaptive Provider Intelligence;
- BLG-006 Self-Evolution Pipeline.

CHK does not migrate Boss code back by default. Each quarterly review first determines:

```text
SUPERSEDED
KEEP_AS_REFERENCE
LEGACY_HARVEST_CANDIDATE
EVOLUTION_CANDIDATE
OBSERVE_MORE
NO_CHANGE
```

## Evolution safety boundary
The following already exists:

```text
runtime/process evidence
→ evolution inbox
→ verified episode
```

However, the following principle remains:

```text
experience / episode != authority
```

Future quarterly review may generate, at most:

```text
verified episodes / cases
→ pattern
→ improvement hypothesis
→ EVOLUTION_CANDIDATE
```

Actual subsequent promotion requires at least:

```text
sandbox
→ replay / controlled evaluation
→ shadow
→ independent verification
→ explicit promotion gate
→ monitoring
→ rollback
```

CHK itself must not bypass Mission Book, Owner authority, or domain safety boundaries.

## Workbook series
| ID | Work | Status |
|---|---|---|
| CHK-101 | Small Operational Reconciliation | REVIEW |
| CHK-201 | Full Capability / Architecture Census | REVIEW |
| CHK-301 | Quarterly Architecture + Self Review | REVIEW |
| CHK-401 | Evolution Candidate Triage & Routing | REVIEW |
| CHK-990 | Self-Check Framework Acceptance & Freeze | REVIEW |

## Activation conditions
Owner activation is recorded; subsequent claims and execution must still follow:
1. The Owner explicitly activates it;
2. Reread the then-current Digital-City/Utopia canonical truth;
3. Resolve the full 40-character SHA only at claim time;
4. Do not change an ongoing programme's acceptance contract midway;
5. Prefer a dry-run/read-only first execution;
6. Strictly separate health-check outputs from actual repair tasks.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **6**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|

### 本目录说明 / Local documents

- [CHK-101-small-operational-reconciliation.md](CHK-101-small-operational-reconciliation.md)
- [CHK-201-full-capability-architecture-census.md](CHK-201-full-capability-architecture-census.md)
- [CHK-301-quarterly-architecture-self-review.md](CHK-301-quarterly-architecture-self-review.md)
- [CHK-401-evolution-candidate-triage-routing.md](CHK-401-evolution-candidate-triage-routing.md)
- [CHK-990-self-check-framework-acceptance-freeze.md](CHK-990-self-check-framework-acceptance-freeze.md)

<!-- DOCUMENT_NAVIGATION:END -->

<!-- SERIES_DASHBOARD:START -->
## 任务快速面板 / Task dashboard

自动读取canonical工作书；本表不提供领取锁或额外authority。 / Generated from canonical workbooks; this table grants no claim lock or extra authority.

总完成 / Complete 0/5 · 开发 / Development 5/5 · 复检 / Review 0/5 · `ACTIVE`

| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |
|---|---|:---:|:---:|:---:|
| [CHK-101](../CHK-101-small-operational-reconciliation.md) | REVIEW | YES | NO | YES |
| [CHK-201](../CHK-201-full-capability-architecture-census.md) | REVIEW | YES | NO | YES |
| [CHK-301](../CHK-301-quarterly-architecture-self-review.md) | REVIEW | YES | NO | YES |
| [CHK-401](../CHK-401-evolution-candidate-triage-routing.md) | REVIEW | YES | NO | YES |
| [CHK-990](../CHK-990-self-check-framework-acceptance-freeze.md) | REVIEW | YES | NO | YES |

<!-- SERIES_DASHBOARD:END -->

Development 5/5 complete; independent whole-series second-host review 0/5 / NOT_RUN. Final implementation CI [37578970705](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37578970705) SUCCESS at 9a646d6b894babd0fb316c0b4a0ba302bd7bca7d. No acceptance, freeze, scheduler or main merge.
