# CHK — City Self Health Check / 城市自检与周期体检

> **状态：PARKED / NOT ACTIVATED**
>
> 本系列把 City/Utopia 的周期性体检、自我认知、自我诊断、病例沉淀与季度自进化候选评审正式纳入 Mission Book 设计。
>
> **当前不启用。** 所有工作书 `execution_enabled=false`，baseline/dependency SHA 均故意留空；不得领取、不得创建实现分支、不得把今天的 branch/head 当作未来锚点。
>
> 本系列当前**不加入 `PROGRESS_MANIFEST.json`**，因此不进入主任务栏、总任务数或 active pool。

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
| CHK-101 | Small Operational Reconciliation | PARKED |
| CHK-201 | Full Capability / Architecture Census | PARKED |
| CHK-301 | Quarterly Architecture + Self Review | PARKED |
| CHK-401 | Evolution Candidate Triage & Routing | PARKED |
| CHK-990 | Self-Check Framework Acceptance & Freeze | PARKED |

## 激活条件

未来显式启动 CHK 时：

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

总完成 / Complete 5/5 · 开发 / Development 5/5 · 复检 / Review 5/5 · `COMPLETE`

| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |
|---|---|:---:|:---:|:---:|
| [CHK-101](CHK-101-small-operational-reconciliation.md) | COMPLETE | YES | YES | YES |
| [CHK-201](CHK-201-full-capability-architecture-census.md) | COMPLETE | YES | YES | YES |
| [CHK-301](CHK-301-quarterly-architecture-self-review.md) | COMPLETE | YES | YES | YES |
| [CHK-401](CHK-401-evolution-candidate-triage-routing.md) | COMPLETE | YES | YES | YES |
| [CHK-990](CHK-990-self-check-framework-acceptance-freeze.md) | COMPLETE | YES | YES | YES |

<!-- SERIES_DASHBOARD:END -->
