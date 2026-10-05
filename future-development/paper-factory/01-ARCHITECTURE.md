# Architecture and Integration / 架构与整合边界

**Status:** future design, not an implementation claim. / 未来设计，不代表已实现。

## 1. Selected architecture / 方案选择

A single giant writing prompt is cheap to start but mixes facts, inference and venue rules. Independent per-journal pipelines simplify local templates but duplicate evidence and drift after corrections. The selected design is **one evidence/claim core with declarative venue adapters and a small, resumable workflow**. Agent roles are replaceable jobs, not a requirement for many permanently running agents.

单个大提示词容易把观察、解释和投稿要求混在一起；每刊复制整套流水线容易出现数字与结论漂移。因此采用“统一证据/论点核心 + 声明式适配器 + 可恢复工作流”。角色可以由同一服务分时执行，不强制常驻多模型。

## 2. Logical layers and ownership / 分层与所有权

| Layer / 层 | Input -> output | Ownership / 归属 |
|---|---|---|
| Capture adapters / 采集适配 | Existing receipts -> bounded source references + coverage ledger | Source project; no new production event enum without its contract change. / 原项目契约。 |
| Evidence index / 证据索引 | References -> retrievable, rights-aware evidence inventory | Compact City index; bytes outside City. / City 索引，非原始库。 |
| Research observatory / 研究观察台 | Historical records -> reconstructed episodes, signals, candidate cards | Derived research state; not product acceptance truth. / 派生研究状态。 |
| Scientific core / 科学核心 | Selected question + frozen corpus -> analysis, claims, uncertainty, figures | Essay-Book or chosen paper repo. / 论文仓库。 |
| Venue compiler / 投稿编译器 | Core + versioned policy -> target-specific manuscript and package | Paper-repo variant; no divergent evidence copy. / 投稿视图。 |
| Review and release / 审查发布 | Package + tests + author decisions -> release receipt | Owner-governed publication workflow. / 人工授权。 |

## 3. Reuse, do not duplicate / 复用而非重建

Read REX-801 experiment manifests, REX-802 trace/provenance, and REX-806 analysis/artifact exports when actually available. A missing REX feature is a local capability gap, not permission to claim it exists or a reason to block all retrospective work. Explicit new validation may request the existing REX runner later; the factory does not build its own fault injector, scheduler or task ownership graph.

REX 是可复用供给方；先验证实际版本与接口，不把工程书的 READY 当作已落地。没有完整 REX 也能读取已有历史材料。需要新增验证时，另经批准委托现有执行层，不另建调度真相。

City Work Monitor/JEV may project factory job state. Paper Factory reads canonical runtime events through adapters; a dashboard edit cannot mark a paper accepted or an experiment successful. Capability Registry should receive an implementation/exposure entry only after actual implementation and qualification, not because this design folder exists.

JEV/总监视器仅做投影。设计目录不直接注册成已验证能力，不增加 active mission 的总数或开发完成数。

## 4. Canonical intermediate representation / 中间表示

A Paper IR is a structured research object, not a PDF: question, study design, corpus version, admissible claims, limitations, tables, figure recipes, bibliography support mappings, author-confirmed declarations and contribution/overlap map. Every derived sentence with a quantitative or central scientific claim points to a claim ID. Each table cell points to a calculation plus admitted inputs.

Paper IR 保存论题、方法、数据版本、论点边界、限制、表格、作图配方、文献支持关系、声明与贡献重叠。核心句子可反查 claim ID，表格可反查计算和输入。不同期刊可以改变标题/摘要，但每一投稿包内部 metadata 与正文必须一致。

Suggested paper-repository shape / 建议论文仓库布局:
```text
<family>/
  candidates/                  # selected and rejected questions, rationale
  freezes/<freeze-id>/         # source manifest, selection rules, analysis lock
  scientific-core/             # versioned IR; claims; bibliography; limitations
  analyses/<analysis-id>/       # scripts, environment, recipes, outputs
  variants/<venue>/<edition>/<article-type>/<stage>/<revision>/
  reviews/                     # internal findings, resolutions, scope
  submissions/<attempt-id>/    # approved hashes, portal fields, real receipts
```

This is a future interface proposal, not a migration instruction for existing Hns paths. / 不要求重排现有 Hns/refactor 文件。

## 5. Execution and incremental invalidation / 执行与增量失效

Use deterministic parsers/calculations/builds for machine-checkable work. Use models for candidate interpretation, literature mapping and permitted drafting. Parallelize independent research questions or specialist checks over immutable inputs. A writer cannot overwrite another writer's section on a moving branch: publish a patch/proposal, reconcile once, and retain provenance.

确定性计算不交给语言模型猜。并行任务只读冻结输入；段落修改先生成 patch/proposal，再受控合并。Agent/host 不同是审查元数据，不自动证明独立。

Dependency invalidation is narrow: source bytes or selection change -> affected analyses/claims/variants/reviews stale; bibliography evidence change -> affected statements stale; template-only change -> render/preflight stale, not a new experiment; author/cost/target/license change -> relevant approvals stale. Keep the old freeze and receipts. / 使用依赖图局部重建，不全量返工，不悄悄改写旧版本。

## 6. Minimal implementation direction / 最小实现方向

Start later with file-backed manifests, reproducible scripts and a resumable local queue; add an index database only for demonstrated scale needs. Provider access goes through the existing gateway and budget policy. Cloud analysis must respect data classifications. No permanent paid worker pool, public posting bot or new City building is implied.

后续先做文件/manifest 与可恢复任务，不预先堆分布式微服务。长任务异步等待，预算不足暂停本任务，不锁全城。实现仓库与部署形态留到正式启用时确认。
