---
mission_id: MB-007
sequence: 7
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
migration_status: COMPLETE
migration_complete: true
migration_completion_basis: OWNER_ACCEPTED_COMPLETE
migration_claim_host: Alien
migration_claimed_at: 2026-09-29T13:34:10Z
migration_branch: mission/MB-007-research-institute
migration_head_sha: 68015caa71b7788f700abb1c7918d1b5ee8f9e8c
migration_ci: "final-branch 36578310170 PASS; implementation 71267e8 36577840443 PASS"
migration_report: mission-book/reports/MB-007/MIGRATION_REPORT.md
verification_status: COMPLETE
verification_complete: true
verification_claim_host: Mech
verification_claimed_at: 2026-09-30T03:10:00Z
verification_head_sha: ff500866f1665723a62c7d16e94ca052654c46a4
verification_ci: "final-branch 36650198208 PASS (gateway-web + android); reconciled-tree 36649748973 PASS; merged-main 36650723833 PASS"
verification_report: mission-book/reports/MB-007/VERIFICATION_REPORT.md
merged_main_sha: cb8e0bd77ccf0864cf0af50b4624f2f556b6b279
episode: data-records/evolution/episodes/mission-book/MB-007/episode.json
episode_id: MB-007:553ab7ba1c4b0902
episode_sha256: 1c5742fb44293cc829a356d3c1da80169702536276a51bb6eb96157f12d260ed
repair_sequence: 1
repair_status: COMPLETE
repair_reason: "Implementation and Verification are accepted and merged; only the Owner-override finalizer/verified-episode closeout is missing. Scope is exactly the finalizer contract plus the verified episode — the Research Institute is NOT re-migrated."
repair_started_at: 2026-09-30T06:40:00Z
repair_completed_at: 2026-09-30T07:35:00Z
repair_branch: repair/MB-007-owner-override-finalize
repair_finalizer_sha: f25cdb4c98f0e349d386b31ab504d00700d9faf6
repair_merge_sha: d850d73a9c23dbd07f9a0c7483dd2f44272f273f
repair_ci: "repair-branch 36654292817 PASS; merged-main 36654669625 PASS"
---

# MB-007 — Boss Research Institute 既有流水线纯迁移

> **Repair queue step 1.** 实现与 Verification 已接受并进入 Utopia main；本轮只修 Owner-override finalizer / verified episode 闭环。禁止回滚、重迁或把 Alien 的历史 BLOCKED 改写成 PASS。

> ## ✅ Owner ruling applied — Migration COMPLETE / Verification OPEN
>
> Owner 已在 [`response-9-29.md`](../completed-2026-10-01/response-9-29.md) R6 接受本 Mission 的边界：当前没有语义等价的 Utopia 产品消费面时，
> 对 `capabilityProvider:false` 的 research pipeline，允许 Verification Host 使用真实、bounded、可复现的研究链路
> 作为“真实消费”证据；不得为了验收新增 Web/Android capability。
>
> 因迁移实现、parity 与 required CI 已在原分支完成并全绿，本文件现将 `migration_complete` 标记为 `true`。
> Verification 必须由不同于 Migration Host `Alien` 的实际主机领取，并在开始时同步最新 Utopia `main`。
> 下一位触碰 implementation branch 的 worker 必须先记录引用 `response-9-29.md` 的 `OWNER_INTERVENTION`，并按当前
> Utopia evolution contract 补齐 Owner-ruling 后所需的完成事件，再进入 Verification。

## 目标

把 Codex-Boss 中已实现、属于 06 Research 的研究流水线迁入 Research Institute；保留已经 ACTIVE 的 Utopia Evidence Engine，不重复实现。

## Donor / 冻结基线

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`
- `Utopia city/06-research/.../evidence-engine` 为已迁基线

## City 归属与落地边界

- **City owner:** 06/01 Research Institute — Research Mechanism Experimentation Platform
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **目标路径:** `city/06-research/01-research-institute`
- **依赖 Mission:** 无
- 迁移报告必须记录最终实际落地路径；若发现路径设计本身与当前 City map 冲突，停止并标记阻塞，不得自行改 City ownership。

## 允许迁移的既有行为

- ResearchIR/protocol freeze。
- literature/source provenance。
- experiment planning/execution 与 deterministic statistics。
- reproducibility/evidence graph、claim/citation verification、review/adjudication。
- figures/tables、manuscript assembly、LaTeX/PDF。
- durable ledger/resume/partial-failure honesty。

## 明确禁止 / 不属于本 Mission

- Evidence Engine 第二份实现。
- 新的 delayed-learning / Machine Intelligence 研究方向实现。
- Boss Core authority。
- 为迁移新增新的论文工作流或外部数据源。

## Migration 完成门槛

- 从冻结 donor 基线建立可追溯的 source→target 映射。
- donor 已有行为在目标边界内完成等价迁移/适配，未实现项不得被补成“新能力”。
- 目标分支已 push；Migration 阶段**不合入 main**。
- 相关单元/契约/parity 测试完成，并保存真实失败与修复记录。
- 真实消费遵循 `mission-book/README.md` §7；Owner 已在 `response-9-29.md` R6 接受 bounded real research chain 作为本 Mission 的满足方式。
- 数据、错误、恢复/中断（适用时）记录可追溯。
- City Migration Report 已提交：
  - `Digital-City/mission-book/reports/MB-007/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 使用 donor 已有能力完成一个有界的 protocol→evidence/statistics→manuscript/PDF 或等价既有链路，并保存 provenance。
- 中断/部分失败时 ledger/resume 与错误真值保持 donor 语义。
- Evidence Engine 现有验收与引用关系保持通过。
- Verification 主机必须与 Migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大功能边界。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-007/VERIFICATION_REPORT.md`
- 更新本文件 `verification_complete: true`、最终 CI、merge SHA 与报告字段。

## Claim / 主机领取记录

### Migration Claim

- Host: **Alien**
- Claimed at: 2026-09-29T13:34:10Z
- City claim commit: this commit (SHA recorded verbatim in `reports/MB-007/MIGRATION_REPORT.md`, since a commit cannot name itself)
- Implementation branch: `mission/MB-007-research-institute` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)

> **Claim order note.** MB-001 and MB-003 (host `Alien`) and MB-006 (host `Alien`) are
> migration-complete; MB-002, MB-004 and MB-005 are held or completed by host `Mech`. With
> MB-004 claimed by `Mech`, the lowest-sequence unclaimed migration was MB-007, which declares
> no dependency. See the mission index for the MB-003/MB-004 dependency history.

#### Migration closeout — PARTIAL

- City claim commit: `c6ff44f4bd6e2a711a2e838d1efd04e61fd0b5e4`
- Implementation head: `71267e83570f5749bb2d1cf9537040ef0af869eb` (CI `36577840443` PASS)
- Migration head: `68015caa71b7788f700abb1c7918d1b5ee8f9e8c` (CI `36578310170` PASS)
- Report: [`reports/MB-007/MIGRATION_REPORT.md`](../completed-2026-10-01/reports/MB-007/MIGRATION_REPORT.md)
- **Done:** ported, parity-tested (142 tests, plus a 1 590-comparison differential harness on
  `research-manuscript`), registered behind `capabilityProvider: false`, full CI green, donor defects
  preserved verbatim and pinned by tests.
- **Not done:** the product-consumption gate. No `MIGRATION_COMPLETE` event was written; the branch
  event stream records `RUNTIME_FAIL / BLOCKED` for it (`MB-007:7d6c861428278c83`).
- Not merged to `main`; `mission:finalize` deliberately not run.

### Verification Claim

- Host: **Mech**
- Claimed at: 2026-09-30T03:10:00Z
- City claim commit: the commit that introduces this line (a commit cannot name itself; the SHA is recorded verbatim in `reports/MB-007/VERIFICATION_REPORT.md`)
- Reviewed migration branch: `mission/MB-007-research-institute` @ `68015caa71b7788f700abb1c7918d1b5ee8f9e8c`
- **Selection under the current scheduler (`README.md` §3).** This is a **P0 — Verification / Integration** claim, not an assessment. At the time of claiming, the queue read: MB-001/002/004/005/006/009 verified and merged; MB-003 `BLOCKED_OWNER_DECISION` (excluded by P0's own condition); MB-007 and MB-008 `migration_complete=true`, verification unclaimed, migration host `Alien` ≠ `Mech`. MB-007 is the lower sequence, so it is taken first; MB-008 remains available to another host. MB-010..012 are assessment-first (P1A) and are therefore **not** eligible while a P0 exists for this host.
- **Integration pressure (P0 sort key 1 and 2).** The branch is **23 commits behind** the implementation repo's `main` and **touches the shared control plane** (`city/CITY_IMPLEMENTATION_MANIFEST.json`, `city/manifest.mjs`, `city/tests/manifest.test.mjs`, `services/capability-bridge/registry.mjs`). Per `README.md` §6, verification begins by merging the latest `main` into this branch and resolving the manifest/registry/census union and semantic conflicts **before** running the Mission gates — not by force-updating or rewriting the migration host's history.
- **Basis for verification being open.** Owner ruling [`response-9-29.md`](../completed-2026-10-01/response-9-29.md) **R6** explicitly declares: *"ACCEPT THE BOUNDARY. MIGRATION IS COMPLETE; OPEN VERIFICATION."* The migration host recorded its product-consumption gate as `RUNTIME_FAIL / BLOCKED` (`MB-007:7d6c861428278c83`) and wrote no `MIGRATION_COMPLETE` event, so this claim rests on the Owner ruling plus `README.md` §7.2's v2 rule for infrastructure/pipeline modules with no equivalent product seam: the Verification Host satisfies the real-consumption gate with a **real, bounded, reproducible research chain** that directly executes the migrated modules and records inputs, outputs, failure/recovery, parity and evidence.
- **Rule 9 discipline:** this host's independent review is performed and written down **before** the Migration Report is opened.

#### Verification closeout

- Reconciliation first, per `README.md` §6: latest `main` merged into the branch **before** any gate ran (branch was 23 commits behind and touches the shared control plane). Two conflicts resolved in favour of the union — `services/capability-bridge/registry.mjs` took `main`'s superset (both the building/district `kind` filter and the module-level `capabilityProvider` filter, plus the `declared`/enumerated split MB-009 needs), and the census list in `city/tests/manifest.test.mjs` was restored after the merge silently dropped seven modules. The gate caught that; it is recorded rather than hidden.
- Reconciled head: `8bce1f79ba0940e35eb3b2e2ac352793af886802` (CI `36649748973` PASS).
- Real consumption: the `README.md` §7.2 bounded research chain, 22 steps across all five migrated modules on a seeded, reproducible measurement (effect `0.4800`, permutation `p = 0.0330`, bootstrap CI `[106.500, 108.183]`), with negative controls that **refuse** a broken artifact chain, a vetoed review and a primary claim resting on an `UNSUPPORTED` citation, and six provenance digests pinned in `run/provenance-ledger.json`.
- Final branch CI: `36650198208` PASS at `ff50086`. Merge to `main`: `cb8e0bd77ccf0864cf0af50b4624f2f556b6b279`, CI `36650723833` PASS. All five gates re-run green on the merged tree.
- **Episode: none, and that is deliberate.** `pnpm mission:finalize` refuses this Mission with `Missing PASS MIGRATION_COMPLETE`, because the migration host recorded `RUNTIME_FAIL/BLOCKED` for the product-consumption gate and never wrote that event. This verifier did **not** backfill it — that would attribute to host `Alien` a claim it never made. The deviation and the request to the Owner are in `reports/MB-007/VERIFICATION_REPORT.md` §6.5; the same question applies to MB-008, whose ruling is worded identically.
- Report: [`reports/MB-007/VERIFICATION_REPORT.md`](../completed-2026-10-01/reports/MB-007/VERIFICATION_REPORT.md). Not established: no compiled PDF (the donor's compile step is deferred), no re-derived donor differential for the five modules' PARITY vectors, and this does not make the research pipeline a complete product runtime.


## 绑定执行条件（所有 Mission 强制）

> **LATEST OWNER RULING:** [`response-9-30.md`](../completed-2026-10-01/response-9-30.md)
> **PRIOR OWNER RULINGS:** [`response-9-29.md`](../completed-2026-10-01/response-9-29.md)（未被 9-30 覆盖的条款继续有效）
> **ACTIVE RULESET:** [`README.md`](./README.md)  
> [`past-rules/`](../completed-2026-10-01/past-rules) 仅为历史归档，不具运行时约束力。
>
> 本 Mission 的当前 front matter 与 mission-specific gates 继续有效；若旧 Claim/Report/正文引用历史 rule 编号，仅按当时上下文解释。若冲突，以最新日期 Owner response 为准。

## Mission-specific evidence

- bounded research run
- source/provenance ledger
- statistics/evidence receipts
- manuscript/PDF artifact digest
- resume/partial-failure trace
