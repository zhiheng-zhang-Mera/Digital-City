# REX-801 — PAPER_MATERIAL_INDEX

> 完整中文阅读译本。[英文原文](../PAPER_MATERIAL_INDEX.md)为来源。`CONSTRUCTION_RULES.md` §14B 和 Research Strengthening evidence protocol 要求此材料；仅记录可观察事实，不记录隐藏推理，以 `NOT_OBSERVABLE + reason` 代替虚构数字。

## 1. 适用性决策

```text
research_evidence_applicability = APPLICABLE
long_horizon_context_evidence   = CAPTURED
state_identity_evidence         = CAPTURED
research_evidence_refs          = see §6
```

这是**研究基础设施**组件，因而两方面均 APPLICABLE：由长期异步 agent 构建（§14B 情形），本身又是让未来实验可描述的层。

## 2. 使用的外部状态引用（RQ3）

```text
control_repo   zhiheng-zhang-Mera/Digital-City @ main
implementation zhiheng-zhang-Mera/utopia
workbook       mission-book/research-strengthening/REX-801-experiment-manifest-and-registry.md
report         mission-book/reports/REX-801/DEVELOPMENT_REPORT.md
branch         rex/REX-801-experiment-manifest-registry
baseline_sha   0e9bea3ce739b979e582a428af8fb233045a5e75
head_sha       8f8c521fc299d622093776615b653457d8833f96
ci_green       V0.2 checks run 37241196692 on head_sha
claim_commit   52c0c63
worktree       D:/utopia-rex801
```

## 3. 状态身份、来源与新鲜度

```text
expected_identity      head of rex/REX-801-experiment-manifest-registry as pushed
resolved_identity      git rev-parse HEAD = 8f8c521fc299d622093776615b653457d8833f96
evidence_identity      CI headSha for run 37241196692 = 8f8c521fc299d622093776615b653457d8833f96
provenance_relation    resolved_identity == evidence_identity -> MATCH
freshness_revalidation the baseline SHA was re-measured at claim time even though WBC-602 had claimed the same
                       value; a matching value is not evidence that it is still the value
drift_classes          MUTABLE_REFERENCE_STATE_DRIFT   -> observed control-plane drift (§4 I3, carried from the
                                                        WBC-601/602 window)
                       EVIDENCE_POINTER_MISMATCH      -> none in this task's own records (the corrective habit
                                                        recorded in WBC-602 §I4 was applied: every SHA in this
                                                        report was pasted from git/CI output, never typed)
                       STALE_EXECUTION_IDENTITY       -> avoided by re-measuring the baseline
                       PROVENANCE_RELATION_MISMATCH   -> none
```

## 4. 值得引用的事件

**I1 — 检查错误对象，因而无法触发的 guard（LOGIC_CONFLICT）。** `assertNotATaskStore` 应用于 validator 用已知字段构造的**已验证** manifest；task-domain keys 在 guard 检查前就被删除，检查成为装饰。缺陷类别是：输入已被其应验证的对象规范化。修复移至 raw input。与 WBC-602 `acceptingWork` 矛盾同族：**各部分看似正确，连接却错误。** 证据：`DEVELOPMENT_REPORT.md` §5 D1；回归守卫拒绝全部八个 task-domain key。

**I2 — 有漏洞和误分类的 heuristic predicate（LOGIC_CONFLICT）。** short-SHA detector `/^[0-9a-f]{7,39}$/` 漏掉 4–6 字符 hex，又以错误理由拒绝 branch name `main`，但 label 不是损坏锚点。无锚点 heuristic 代替了带类型区分。修复从 parse result 生成明确 `exact` predicate，用字段回答“是否不可变锚点”，而非重复测试 regex。证据：`DEVELOPMENT_REPORT.md` §5 D2。

**I3 — fixture 断言 agent 假定的 vocabulary（MEASUREMENT_DEFECT）。** live-gateway 测试把 worker task capability `task.execute.safe` 当 City provider capability；真实列表是 `planning.document.intake`、`planning.knowledge.query`、`engineering.skill.inspect`、`research.evidence.review`、`presentation.theme.lab`。产品正确拒绝，fixture 错误。论文角度：**与 agent 凭记忆引用 SHA 是同一种失败**，从预期写身份，没有读取来源。修复将其转为正向断言：task capability **不能**被接受为 City capability，把错误转为性质。证据：`DEVELOPMENT_REPORT.md` §5 D3。

**I4 — full-suite 负载下既有不稳定集成测试（MEASUREMENT_ENVIRONMENT）。** `tests/theme-build-bridge.test.mjs` 的 “D9 Bridge builds retained sandbox artifacts…” 在一次 full-suite 运行失败（32 720 ms），独立运行（29 548 ms）和重跑均通过。未涉及修改路径。保留记录，避免把非绿色本地状态描述成绿色，也让后续读者知道这里存在时间而非逻辑失败类别。

## 5. 定量证据

```text
new tests                        14 (9 contract conformance + 5 live-gateway)
root suite before / after        1219 -> 1251 tests (+32 including the new 14 and the existing files it touches)
root suite result                1247 pass / 4 fail (3 environmental, 1 flaky — both classified above)
city suite                       1984 tests / 1977 pass / 7 skipped / 0 fail
new contract surface             1 versioned contract (experiment-manifest-v1) + 1 registry module
research routes added            5 (list, create/import, validate, inspect, seeds) — and 0 execution routes
defects found and repaired       3 in this task's own code/fixtures (D1, D2, D3), 1 environmental (D4)
```

## 6. 这些观察所支持的研究主题

```text
.../paper-materials/{en,zh-CN}/
  LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md
  LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md    <- I3 (identity from the source)
```

research monitor 在工作书 frontmatter 中保存的 watchlist id：`RS-G3-PASSIVE-EVIDENCE-PIPELINE`、`highest_research_grade_observed: G3_SPARSE_ACTIVE`。

## 7. 本 index 刻意不作的主张

- 不从自然观察得出因果结论。I1–I4 是单 session 工程事件；§14B.5 将因果主张限定于 controlled replay。
- 没有 token/cost/compaction telemetry：harness 不暴露这些，且未发生 compaction；字段使用 `NOT_OBSERVABLE + reason`，不虚构。
- 没有实验结果：本任务描述实验，不执行实验，没有测量可报告。

对侧宿主复检产生明确的 provenance/topology/exposure mismatch，见 [REVIEW_FINDINGS_Alien-codex.md](./REVIEW_FINDINGS_Alien-codex.md)。真实 HTTP 负例中，仅 main 的 software 引用和重复 host 数组仍通过旧验证，违背声明门槛。与原始 14/14 测试一并保留；该历史记录当时修复/验收待定。

最终对侧宿主在修复源 `7e96a4d28f4cb701d7a0951bace69857c3228f32` 上验收 PASS，精确托管 CI SUCCESS。[REVIEW_REPORT_Alien-codex.md](./REVIEW_REPORT_Alien-codex.md)说明原始源至修复源的 provenance、有界用户工作流、保留的无效运行及未观察的物理/Android 执行。早先 pending 记录作为历史保留。
