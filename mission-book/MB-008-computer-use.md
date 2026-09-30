---
mission_id: MB-008
sequence: 8
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
migration_status: COMPLETE
migration_complete: true
migration_completion_basis: OWNER_ACCEPTED_COMPLETE
migration_claim_host: Alien
migration_claimed_at: 2026-09-29T13:55:23Z
migration_branch: mission/MB-008-computer-use
migration_head_sha: aa2a6a8faab779a020d75b93dba548ba3755ce30
migration_ci: "final-branch 36584056291 PASS; implementation efdd403 36583979374 PASS"
migration_report: mission-book/reports/MB-008/MIGRATION_REPORT.md
verification_status: IN_PROGRESS
verification_complete: false
verification_claim_host: Mech
verification_claimed_at: 2026-09-30T05:20:00Z
verification_head_sha: 437be8bcfd9da77ac4c45be6e35d2929a66379dc
verification_ci: "36662962981 PASS on runtime-evidence head 0e1d97e (gateway-web + android); reconciled 36655586918 PASS on 77b774c"
verification_report: mission-book/reports/MB-008/VERIFICATION_REPORT.md
merged_main_sha: null
repair_sequence: 2
repair_status: IN_PROGRESS
repair_reason: "Value reassessment returned ROUTE_B_CONTINUE (main declares no city/10-automation and covers none of the safety/contract surface). Bounded runtime chain, refusal path, genuine miss/recovery and postcondition are green, RUNTIME_PASS + final CI_RESULT + VERIFICATION_COMPLETE recorded, final CI 36662962981 PASS. Owner-override finalize, episode and merge to main remain."
repair_started_at: 2026-09-30T07:50:00Z
repair_gate_checked: "MB-007 repair_status=COMPLETE verified on City main at 6bcbeaa before starting step 2"
repair_runtime_pass_event: MB-008:bbf126eae72598ed
repair_verification_complete_event: MB-008:fd0225d163afa3d2
---

# MB-008 — Computer Use Runtime Boss/Hns Union 纯迁移

> **Repair queue step 2.** Mech 的 Verification claim 保留，但在 MB-007 repair `repair_status=COMPLETE` 前不得 finalize/merge。同步 post-007 Utopia main 后先复核当前价值：整体无价值可 `SKIPPED_NOT_REQUIRED`；否则继续 bounded verification。

> ## ✅ Owner ruling applied — Migration COMPLETE / Verification OPEN
>
> Owner 已在 [`response-9-29.md`](./response-9-29.md) R7 接受 `NO_VERDICT_IDENTICAL_SEAM` 的测量结论：对本 Mission
> 的 `capabilityProvider:false` infrastructure/pipeline modules，不允许为了旧消费 gate 新增 UI/capability
> 或改变既有判定；Verification Host 可使用真实、bounded、可复现的 Computer-Use chain 验证声明边界。
>
> 因迁移实现、664 个 parity tests 与 required CI 已完成，本文件现将 `migration_complete` 标记为 `true`。
> Verification 必须由不同于 Migration Host `Alien` 的实际主机领取，并在开始时同步最新 Utopia `main`。
> 本裁决不代表 deferred runtime plane 已完成；Verifier 不得扩大本 Mission 的交付声明。
> 下一位触碰 implementation branch 的 worker 必须先记录引用 `response-9-29.md` 的 `OWNER_INTERVENTION`，并按当前
> Utopia evolution contract 补齐 Owner-ruling 后所需的完成事件，再进入 Verification。

## 目标

把 Boss 的 backend breadth 与 Hns 的 contract/safety/recovery/verification 合并迁入 10/01 通用 Computer Use Runtime，不引入新的 planner。

## Donor / 冻结基线

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`
- `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`

## City 归属与落地边界

- **City owner:** 10/01 Computer Use Runtime — Generic Computer Interaction Execution Service
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **目标路径:** `city/10-automation/01-computer-use-runtime`
- **依赖 Mission:** 无
- 迁移报告必须记录最终实际落地路径；若发现路径设计本身与当前 City map 冲突，停止并标记阻塞，不得自行改 City ownership。

## 允许迁移的既有行为

- Boss DOM/UIA/structured-app/VSCode/vision backend routing 与 workspace side-effect permission gate。
- Hns goal/success/capability/safety/limit/plan execution contract。
- browser/desktop/file/shell/vision controllers；screenshot/UIA/Win32 drivers。
- focus/foreground/destructive-action safety、target/command guards。
- world-state/progress、stabilization/stall/recovery、postcondition verification、receipt/screenshot retention。

## 明确禁止 / 不属于本 Mission

- Autonomous Environment Explorer 的 world-model/planning。
- Engineering Foreman 计划所有权。
- City task authority。
- 新增 OS backend、新视觉模型或新的自动化动作类型。

## Migration 完成门槛

- 从冻结 donor 基线建立可追溯的 source→target 映射。
- donor 已有行为在目标边界内完成等价迁移/适配，未实现项不得被补成“新能力”。
- 目标分支已 push；Migration 阶段**不合入 main**。
- 相关单元/契约/parity 测试完成，并保存真实失败与修复记录。
- 真实消费遵循 `mission-book/README.md` §7；Owner 已在 `response-9-29.md` R7 接受 bounded real Computer-Use chain 作为本 Mission 的满足方式。
- 数据、错误、恢复/中断（适用时）记录可追溯。
- City Migration Report 已提交：
  - `Digital-City/mission-book/reports/MB-008/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 本轮按 response-9-30 R7：不要求 Alien 追溯重演旧 blocker；Verification Host Mech 必须完成 donor 已支持的真实桌面/文件/壳或 UI bounded action，并验证 postcondition。
- 至少一个拒绝/权限/错误路径和一个 recovery/stabilization 路径被真实记录。
- 安全冲突使用更严格的 donor 行为，不得为方便验证放宽权限。
- Verification 主机必须与 Migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大功能边界。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-008/VERIFICATION_REPORT.md`
- 更新本文件 `verification_complete: true`、最终 CI、merge SHA 与报告字段。

## Claim / 主机领取记录

### Migration Claim

- Host: **Alien**
- Claimed at: 2026-09-29T13:55:23Z
- City claim commit: this commit (SHA recorded verbatim in `reports/MB-008/MIGRATION_REPORT.md`, since a commit cannot name itself)
- Implementation branch: `mission/MB-008-computer-use` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)

> **Claim order note.** MB-007 is `BLOCKED_OWNER_DECISION` (ported and green, but its
> product-consumption gate is unmet and awaits an Owner ruling). MB-008 declares no dependency on
> MB-007, so it is the lowest-sequence claimable migration. **The same consumption question will
> arise here**, because rule 14 and the Migration gate require consumption by an EXISTING Utopia
> surface: before marking anything complete, the host must either find a genuinely
> equivalence-preserving rewiring into an existing surface or record the gate as unmet, as MB-007
> did. Inventing a surface, or wiring a guard in a way that changes an existing verdict, is
> forbidden.

#### Migration closeout — PARTIAL

- City claim commit: `f827756053c456e0e6e682c3ab20d9c98e14c50c`
- Implementation head: `efdd403f81ad0c1b9f9fca56a2e51829efc6e5ea` (CI `36583979374` PASS)
- Migration head: `aa2a6a8faab779a020d75b93dba548ba3755ce30` (CI `36584056291` PASS)
- Report: [`reports/MB-008/MIGRATION_REPORT.md`](./reports/MB-008/MIGRATION_REPORT.md)
- **Done:** six modules, 664 tests, the new `10-automation` district and
  `01-computer-use-runtime` building registered, census extended, the `capabilityProvider`
  filter added, full CI green, donor defects preserved verbatim and pinned.
- **Not done:** the product-consumption gate. The absence of a verdict-identical seam was
  established by measurement **before** porting began (report §4 D2). No `MIGRATION_COMPLETE`
  event was written; the branch event stream records `RUNTIME_FAIL / BLOCKED`
  (`MB-008:5a72b750eb33a552`).
- Not merged to `main`; `mission:finalize` deliberately not run.

> **Engineering finding worth carrying forward (report §4 D4).** The ports were parallelised
> with a "do not import sibling modules" instruction, which produced a copied routing table in
> `bounded-run` that was **not** equivalent to the donor's — `DOM_TYPE` had an extra `gui`
> channel the donor lacks — while all 159 of that module's tests still passed. It was caught by
> the single-source standard and repaired by importing the sibling binding plus an **identity**
> test (a `deepEqual` copy would have passed). This is the third time that standard has caught
> a real divergence; it should be a standing migration rule, not a per-mission choice.

### Verification Claim

- Host: **Mech**
- Claimed at: 2026-09-30T05:20:00Z
- City claim commit: the commit that introduces this line (a commit cannot name itself; the SHA is recorded verbatim in `reports/MB-008/VERIFICATION_REPORT.md`)
- Reviewed migration branch: `mission/MB-008-computer-use` @ `aa2a6a8faab779a020d75b93dba548ba3755ce30`
- **Selection under `README.md` §3 (integration first).** **P0 — Verification / Integration**, and after MB-007 the only P0 left for this host: MB-008 has `migration_complete=true`, its verification stage is unclaimed, its migration host is `Alien` (≠ `Mech`), and it is not `BLOCKED_OWNER_DECISION`. The assessment-first Missions MB-010..012 are P1A and remain ineligible while a P0 exists.
- **Basis for verification being open.** Owner ruling [`response-9-29.md`](./response-9-29.md) **R7** accepts this Mission's boundary (`NO_VERDICT_IDENTICAL_SEAM`: the candidate seam had a quantified semantic counterexample, so wiring it would have added product behaviour) and explicitly declares *"Owner hereby declares MB-008 Migration complete."* R7 authorises the `README.md` §7.2 bounded chain for this Mission: the Verification Host directly exercises the migrated modules' **contract / safety / recovery / postcondition** behaviour rather than inventing a consumer. R7 also warns that this exemption does **not** make Computer Use a complete product runtime — the deferred runtime plane stays deferred, and this verification may only verify the boundary the Mission declared.
- **Integration note.** As with MB-007, verification begins by merging the latest `main` into this branch and resolving the shared control-plane union **before** any gate runs (`README.md` §6). The failure mode found on MB-007 was that this gate set cannot be run against an uncommitted merge: `verify-promotion-history` tests `HEAD`, so the merge must be committed first.
- **Rule 9 discipline:** this host's independent review is performed and written down **before** the Migration Report is opened.

### Verification milestone — bounded runtime chain green (repair step 2, in progress)

- **Value reassessment (before any merge work, per `response-9-30.md` R6 step 2).**
  `main` declares **no** `city/10-automation` district, and nothing elsewhere covers
  `createSafetyGuard` / `classifyRisk` / the target guard. Verdict = **`ROUTE_B_CONTINUE`**, so
  `SKIPPED_NOT_COMPLETE` was not available; the Mission still has value.
- **Reconciliation.** The branch was 48 commits behind `main`; `main` was merged **before** any gate
  ran and committed as `77b774c` (integration-first, `README.md` §6). Three shared-control-plane
  conflicts were resolved as union/superset; the census was regenerated in manifest **declaration
  order**. Reconciled CI `36655586918` PASS.
- **Bounded chain (the §7.2 real consumption).** Driver
  `.runtime/evidence/mission-book/MB-008/run-2/bounded-computer-use-chain.mjs` → exit 0:
  happy path (`FILE_WRITE`, risk `high`, postcondition `success` kind `file`) · refusal (migrated
  guard throws `DESTRUCTIVE_FORBIDDEN`, **zero** mutations, artifact byte-identical) · genuine miss
  (target **really** deleted; the same real `facts.fileExists` reports it absent; donor postcondition
  `failure` kind `file`) · recovery (donor `retry`/`RETRYABLE` + `settle stable` → `landed`;
  re-verified `success`). `NO_MOCK_FACTS = true`.
- **Driver-only repairs.** Three bookkeeping defects in the host-local evidence driver were fixed
  (`assertActionAllowed` is `async` and was being called in a sync `try/catch`; side-effect absence
  was asserted rather than measured; `validateAction` is throw-based and has no `.valid` field).
  **No migrated module was touched** — the guard and verifier were already correct, and editing them
  to flatter the evidence is forbidden.
- **Gates.** `pnpm test` 73/73 · `city/test-all.mjs` 1698/1699 (0 failures, 1 skipped) ·
  `apps/rooms` 69/69 · `verify-promotion-history` 10 records · `check:docs` SYNCHRONIZED.
- **Evolution events.** `RUNTIME_PASS` `MB-008:bbf126eae72598ed`, final `CI_RESULT` PASS
  `MB-008:06f57c0602aa5553`, `VERIFICATION_COMPLETE` PASS `MB-008:fd0225d163afa3d2`. Ordering
  asserted: `VERIFIER_FINDING` < latest `CI_RESULT PASS` < `VERIFICATION_COMPLETE PASS`.
  Alien's `RUNTIME_FAIL / BLOCKED` `MB-008:5a72b750eb33a552` is **retained**; no
  `MIGRATION_COMPLETE` was fabricated (`response-9-30.md` R5).
- **Still open.** Owner-override `mission:finalize`, episode, final branch CI on the episode commit,
  merge to `main`, merged-main CI. The **deferred runtime plane remains deferred** — no real
  desktop/browser/UI automation was driven, and this does not make Computer Use a product runtime.


## 绑定执行条件（所有 Mission 强制）

> **LATEST OWNER RULING:** [`response-9-30.md`](./response-9-30.md)  
> **PRIOR OWNER RULINGS:** [`response-9-29.md`](./response-9-29.md)（未被 9-30 覆盖的条款继续有效）  
> **ACTIVE RULESET:** [`README.md`](./README.md)  
> [`past-rules/`](./past-rules/) 仅为历史归档，不具运行时约束力。
>
> 本 Mission 的当前 front matter 与 mission-specific gates 继续有效；若旧 Claim/Report/正文引用历史 rule 编号，仅按当时上下文解释。若冲突，以最新日期 Owner response 为准。

## Mission-specific evidence

- real UI/desktop execution receipts
- permission/refusal trace
- postcondition verification
- recovery/stall evidence
- screenshot/UIA evidence where donor supports it
