# Paper Evidence Protocol / 论文素材强制留存协议

> **状态：ACTIVE / NORMATIVE FOR CEX PROGRAMME**
>
> 本文件是 Capability Entry Closeout 的 task-specific 证据规则。它补充而不替代：
>
> - `mission-book/PROCESS_DATA_POLICY.md`
> - `mission-book/CONSTRUCTION_RULES.md`
>
> 目标：**把可用于后续论文、技术报告、PhD 项目材料的工程过程完整留下，同时不把 Digital-City 变成 raw-log 仓库。**

## 1. 四层存储

### Layer A — 本机原始证据

```text
Utopia/.runtime/evidence/mission-book/<CEX-ID>/<run-id>/
```

保存：

- stdout / stderr；
- runtime error；
- browser console / page error；
- Android log / receipt；
- screenshots / capture；
- timing；
- retry / reconnect；
- local test output；
- temporary probes；
- before/after state。

允许大体积、未筛选，但必须保持 git-ignored。

### Layer B — 可共享原始证据

有论文价值且非敏感的证据选择性进入：

```text
Utopia/evidence/raw/mission-book/<CEX-ID>/
```

适合：

- 最小复现；
- failing/passing test pair；
- bounded log excerpt；
- performance table；
- structured JSON receipts；
- review falsification scripts；
- before/after screenshot；
- exact-head evidence。

禁止：

- token / secret / credential；
- hidden model reasoning；
- 用户私人数据；
- 无界 terminal dump；
- 与结论无关的重复日志。

### Layer C — Evolution event stream

继续按现有 contract 写：

```text
Utopia/data-records/evolution/inbox/mission-book/<CEX-ID>/events.jsonl
```

必须记录现有 contract 支持的适用事件：

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

不得为本 programme 私自扩 eventType。

### Layer D — City paper index

每个 CEX task 必须维护：

```text
Digital-City/mission-book/reports/<CEX-ID>/PAPER_MATERIAL_INDEX.md
```

这里不放大日志，只放**论文素材索引 + 摘要 + evidence pointer**。

## 2. PAPER_MATERIAL_INDEX 必须覆盖什么

任何以下事实发生，都必须追加一条：

### Failure / Error

- command failed；
- browser page error；
- Android crash / lifecycle error；
- CI fail；
- test fail；
- timeout；
- stale state；
- reconnect anomaly；
- race；
- wrong-route；
- UI false affordance；
- hidden/unreachable control；
- backend accepted but UI dropped data；
- UI invoked wrong backend semantics。

### Logic conflict

例如：

- code comment / workbook assumption 与 runtime 行为不一致；
- Web 与 Android 对同一 contract 理解不同；
- Development 与 Reviewer 对语义判断不同；
- old test 把 defect 当 contract；
- implementation 与 accepted City ownership 冲突；
- capability exists but discoverability policy hides it。

### Quantitative evidence

出现即可记录：

- test count / pass/fail count；
- CI duration；
- E2E latency；
- convergence latency；
- retry count；
- number of affected endpoints；
- number of hidden capabilities discovered；
- user steps before/after；
- LOC / files touched（有解释价值时）；
- resource use / timing（有意义时）；
- defect detection method。

### Repair evidence

每次有 defect：

```text
OBSERVATION
→ REPRODUCTION
→ ROOT CAUSE
→ REPAIR
→ REGRESSION GUARD
→ OPPOSITE-HOST VERIFICATION
```

六段必须尽量留齐。

## 3. 推荐索引格式

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

`paper angle` 只是素材分类，不代表最终论文一定采用。

## 4. 不允许“清洗历史”

禁止：

- 修复后删除 failing test；
- 只保留最后一遍绿日志；
- 把 Reviewer 找出的 defect 改写成“开发阶段已知”；
- 把错误假设从报告里抹掉；
- 把工具/测试自身的错误偷偷算成产品错误；
- 把不支持结论的数据丢掉。

如果测试工具本身错了，也应记录：

```text
MEASUREMENT_DEFECT
```

并明确它不是 product defect。

## 5. Development 与 Review 各自职责

### Development

必须保存：

- baseline；
- first attempt；
- observed failures；
- self-found defects；
- repairs；
- test deltas；
- exact head。

### Formal Review

不能只验证作者路径。必须至少做：

- one independent falsification；
- one negative control；
- one discoverability/useability check from normal user path；
- one exact-head evidence reconciliation。

Reviewer 自己的错误仪器同样记录。

## 6. Completion gate

任一 CEX task 若缺：

- DEVELOPMENT_REPORT；
- REVIEW_REPORT；
- PAPER_MATERIAL_INDEX；
- required evolution events；
- exact-head CI；
- evidence pointers；

不得标记 complete。

Final integration 还必须生成 programme-level：

```text
mission-book/reports/CEX-PROGRAMME/PAPER_MATERIAL_SYNTHESIS.md
```

汇总：

- hidden capability count；
- gap taxonomy；
- defect classes；
- Web/Android parity deltas；
- before/after user steps；
- review-found defects；
- final regression evidence。


## 7. Capability Registry-specific evidence

CEX tasks now also feed the durable City `capability-registry/`.

Whenever observed, the paper index must retain the before/after evidence for:

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

Prefer fields:

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

Registry reconciliation must not erase the pre-repair mismatch. The Registry stores current verified state; PAPER_MATERIAL_INDEX preserves the evolution/failure chain.


---

[English translation / 完整英文说明](en/PAPER_EVIDENCE_PROTOCOL.md)
