# Owner Response — 2026-09-30

> 本文件是 MB-010..012 的最新 Owner ruling。与 [response-9-29.md](./response-9-29.md) 冲突时，本文件优先；9-29 其余未冲突裁决继续有效。

## R1 — MB-010..012 从 disabled placeholder 改为 assessment-first auto-claim

Owner 决定：

1. **MB-010 Node Fabric、MB-011 Customs、MB-012 Runtime Compliance 全部设置 `execution_enabled=true`。**
2. 自动施工机可以领取，但领取后的第一阶段不是直接迁移，而是 **donor ↔ 领取时 Utopia 最新 `main` 的价值评估**。
3. Assessment 结果只能是：
   - `FULL_MIGRATION`
   - `PARTIAL_MIGRATION`
   - `NO_VALUE`
4. 只有 FULL/PARTIAL 才允许写迁移实现；PARTIAL 只迁 capability matrix 明确批准的 gap-closing 子集。
5. NO_VALUE 时：
   - 不写实现代码；
   - City 必须报告 **“判断无价值，任务保留，未迁移”**；
   - `migration_complete=false`；
   - `migration_status=NOT_REQUIRED_NO_VALUE`；
   - 任务和证据保留，但自动调度以后 skip，除非 Owner reopen。
6. Assessment Host 若继续迁移，自动成为 Migration Host；Verification 仍必须由不同实际主机完成。
7. Assessment-only branch 在没有实质实现提交前不计入 `UNMERGED_WIP_LIMIT`。

## R2 — Claim-time capability inventory 是强制证据

每个 MB-010..012 在领取后都必须在 Mission 文件与 Assessment Report 中记录：

- 本 Mission 计划迁移的 capability；
- 领取时 Utopia 最新 `main` SHA；
- Utopia 当前已经存在的语义等价/相关 capability；
- 哪些 donor capability 不需要迁移以及理由；
- 哪些 capability 只迁移一部分即可补足 Utopia 缺陷；
- donor/Utopia 的 source/test/runtime/evidence anchors。

不得用目录名是否存在代替语义能力核对。

## R3 — 论文 / research material

所有 verdict 都是研究素材，包括“不迁移”的负结果。至少保留：

- planned / equivalent / superior / gap / selected / abandoned capability counts；
- reason-code 分布；
- parity/runtime checks 与真实失败；
- baseline/head SHA；
- 若迁移，保留 change/test/CI/real-consumption/failure-recovery；
- 若不迁移，保留为何复制 donor 会造成重复、错误 ownership、旧语义或不值得独立拆分的证据。

素材继续进入既有位置：

```text
Digital-City:
  mission-book/MB-010..012
  mission-book/reports/MB-xxx/ASSESSMENT_REPORT.md
  MIGRATION_REPORT / VERIFICATION_REPORT only when migration happens

Utopia:
  .runtime/evidence/mission-book/<ID>/<run-id>/assessment/
  data-records/evolution/inbox/mission-book/<ID>/events.jsonl
  evidence/raw/mission-book/<ID>/assessment/  (bounded, non-sensitive only)
  verified episode only after real migration + independent verification
```

NO_VALUE 不得伪造 verified episode；assessment branch 保留并由 City report 钉住 immutable HEAD。
