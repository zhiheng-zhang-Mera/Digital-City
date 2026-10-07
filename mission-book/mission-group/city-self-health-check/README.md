# CHK — City Self Health Check / 城市自检与周期体检

> **Owner ruling (2026-10-07):** 暂时屏蔽旧版工作书的验收限制，对 DGX 和 CHK 系列在各自分支上全量完成。第二机验收会直接一次性处理整个系列而不是分拆逐个任务验收。 Internal development proceeds across all five CHK workbooks on Alien-GPT-CHK without waiting for old per-task opposite-host acceptance. Whole-series independent second-host review remains NOT_RUN. This exception changes development sequencing only; no main merge, scheduling, repair or promotion authority is granted. Accepted dependency SHAs remain unfilled until actually accepted.


> **状态：OWNER ACTIVATED / EXECUTION ENABLED**
>
> 本系列把 City/Utopia 的周期性体检、自我认知、自我诊断、病例沉淀与季度自进化候选评审正式纳入 Mission Book 设计。
>
> **Owner 已明确激活。** 五本工作书均为 `execution_enabled=true`。统一分支 `Alien-GPT-CHK`，不合并到 main；领取时解析 full SHA，前置 accepted SHA 不得猜测。首次运行采用 bounded dry-run/read-only。
>
> 本系列已加入 `PROGRESS_MANIFEST.json`、主任务栏与 active pool。激活不等于开发或复检完成，详见 [激活记录](../../reports/CHK/ACTIVATION.md)。

## 目的

CHK 不负责“发现问题就顺手修掉”，而负责：

```text
observe
→ reconcile
→ diagnose
→ classify
→ trend
→ propose
→ route
```

真正的修复、迁移、规则修改或自进化 promotion 必须进入对应 Mission / RIV / URA / DGX / REX 或其它正式工作书。

## 体检层级

### CHK-101 — Small Check / 小体检

未来建议触发节奏：

- 高强度开发期：约每 3–7 天；
- 或每完成 1 个 programme / 3–5 个正式 workbook，以先发生者为准；
- 重大 merge、false COMPLETE、Registry reality mismatch、规则修改等事件可额外触发。

重点做 operational reconciliation，不做全量架构重审。

### CHK-201 — Full Census / 大体检

未来建议：

- 每 4–6 周；
- 或每累计约 3 个较大 programme 收口，以先发生者为准。

重点做全量 capability census、architecture/contract/rule debt、dead state 与 cross-truth drift。

### CHK-301 — Quarterly Architecture & Self Review / 季度架构与自检

未来建议每约 3 个月一次。

它在大体检基础上增加：

- Self Cognition；
- Self Diagnosis；
- System Case Record；
- Runtime Intelligence；
- Boss legacy BLG-001～006 reconciliation；
- Evolution Candidate Review。

季度审查只允许提出候选，不直接自我修改。

## Boss 自进化承接

本系列固定引用：

`future-development/Boss-Legacy-Capability-Gaps/README.md`

重点：

- BLG-001 Self Cognition；
- BLG-002 Self Diagnosis；
- BLG-003 Self Case Record；
- BLG-004 Runtime Intelligence Plane；
- BLG-005 Adaptive Provider Intelligence；
- BLG-006 Self-Evolution Pipeline。

CHK 不默认回迁 Boss 代码。每次季度审查先判断：

```text
SUPERSEDED
KEEP_AS_REFERENCE
LEGACY_HARVEST_CANDIDATE
EVOLUTION_CANDIDATE
OBSERVE_MORE
NO_CHANGE
```

## Evolution safety boundary

当前已有：

```text
runtime/process evidence
→ evolution inbox
→ verified episode
```

但仍坚持：

```text
experience / episode != authority
```

未来季度审查最多生成：

```text
verified episodes / cases
→ pattern
→ improvement hypothesis
→ EVOLUTION_CANDIDATE
```

后续若要真正晋升，至少需要：

```text
sandbox
→ replay / controlled evaluation
→ shadow
→ independent verification
→ explicit promotion gate
→ monitoring
→ rollback
```

不得由 CHK 自己绕过 Mission Book、Owner authority 或领域安全边界。

## 工作系列

| ID | 工作 | 状态 |
|---|---|---|
| CHK-101 | Small Operational Reconciliation | NOT_STARTED |
| CHK-201 | Full Capability / Architecture Census | NOT_STARTED |
| CHK-301 | Quarterly Architecture + Self Review | WAITING_DEPENDENCIES |
| CHK-401 | Evolution Candidate Triage & Routing | WAITING_DEPENDENCIES |
| CHK-990 | Self-Check Framework Acceptance & Freeze | WAITING_DEPENDENCIES |

## 激活条件

已由 Owner 启动；后续领取与执行仍遵守：

1. Owner 明确激活；
2. 重新读取当时 Digital-City/Utopia canonical truth；
3. claim 时才解析 full 40-char SHA；
4. 不在进行中的 programme 中途更改 acceptance contract；
5. 第一次运行优先 dry-run/read-only；
6. 体检输出与真正修复任务严格分离。


---

语言读本 / Reading translation: [English](en/README.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **12**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| en | 6 | [打开 / Open](en/README.md) |

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

总完成 / Complete 0/5 · 开发 / Development 0/5 · 复检 / Review 0/5 · `IN_PROGRESS`

| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |
|---|---|:---:|:---:|:---:|
| [CHK-101](CHK-101-small-operational-reconciliation.md) | IN_PROGRESS | NO | NO | YES |
| [CHK-201](CHK-201-full-capability-architecture-census.md) | IN_PROGRESS | NO | NO | YES |
| [CHK-301](CHK-301-quarterly-architecture-self-review.md) | IN_PROGRESS | NO | NO | YES |
| [CHK-401](CHK-401-evolution-candidate-triage-routing.md) | IN_PROGRESS | NO | NO | YES |
| [CHK-990](CHK-990-self-check-framework-acceptance-freeze.md) | IN_PROGRESS | NO | NO | YES |

<!-- SERIES_DASHBOARD:END -->
