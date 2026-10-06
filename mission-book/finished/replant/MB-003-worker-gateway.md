---
mission_id: MB-003
sequence: 3
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
migration_status: COMPLETE
migration_complete: true
migration_completion_basis: IMPLEMENTED_COMPLETE
migration_claim_host: Alien
migration_claimed_at: 2026-09-29T12:19:26Z
migration_branch: mission/MB-003-worker-gateway
migration_head_sha: c5734a5e646f1e379aa15282b59a08e8828d5d6a
migration_ci: "final-branch 36571564418 PASS (gateway-web + android); implementation 36570163616 PASS"
migration_report: mission-book/reports/MB-003/MIGRATION_REPORT.md
verification_status: COMPLETE
verification_complete: true
verification_claim_host: Mech
verification_claimed_at: 2026-09-29T15:05:00Z
verification_head_sha: c243d505f7c8753b400ed0f7946da73f49a677d0
verification_ci: PASS — final branch 36671502121 and implementation 36671050015 (V.0.2 checks, gateway-web + android) on c243d50/d55ebaf; merged-main run 36671850064
verification_report: mission-book/reports/MB-003/VERIFICATION_REPORT.md
merged_main_sha: 756c7d760c605e33ba386e87605e078fe24b82ca
episode: data-records/evolution/episodes/mission-book/MB-003/episode.json
host_separation: "OWNER_WAIVED (response-9-30 R10) — the Verification Host could not execute the closeout, so the Owner authorised this Mission's Migration Host to complete it. Mech's historical VERIFICATION events and its BLOCKED finding are preserved unchanged under their own host; the episode records mode OWNER_WAIVED, the ruling reference, migrationHosts [Alien], verificationHosts [Alien, Mech] and the 5 verification events contributed by the completing host."
two_host_gate: "SATISFIED (2026-09-30) — both required real hosts have left a donor-supported provider receipt. Mech (MEGA-REP): reports/MB-003/VERIFICATION_REPORT.md section 8.3, RUNTIME_PASS MB-003:de2ff78e06806a93. Alien (MERA-ALIANWARE): RUNTIME_PASS MB-003:b84512cd12f80735, driver .runtime/evidence/mission-book/MB-003/run-3/provider-probe.mjs, eight verdicts all true. Per README section 3 line 90 the two required hosts are the Migration Host and the Verification Host; no third machine is required."
alien_provider_receipt: "PASS on Alien (MERA-ALIANWARE) — @deepseek-ai/dsh 0.1.5-rc.1 installed under D:/DS-Hns at the frozen donor SHA eeb57ca5; the donor seam's own DSH_BIN resolved to the same binary; a bounded read-only submit spawned a real child, its per-task log grew while it lived, and it exited 0 returning the model answer OK; the donor's own killTree terminated a different running job; the migrated unsupportedRuntime refused PERMANENT_FAILURE/UNSUPPORTED/retryable false; a withheld credential produced exit 1 MISSING_CREDENTIAL and was not rewritten as success; the migrated breaker went CLOSED->OPEN then HALF_OPEN after cooldown; NO_SECRET_LEAK true."
repair_sequence: 3
repair_status: COMPLETE
repair_reason: "Step 3 closed on 2026-09-30. Value reassessment stayed ROUTE_B_CONTINUE (WG-01..08 all missing from main), so the deferred donor execution seam was migrated under the original Mission identity as response-9-29 R1 and response-9-30 R8 authorise. The two-host gate was satisfied by two different real hosts, the engineering-book real chain was re-run through the PORTED seam, and the Mission is VERIFICATION_COMPLETE with the episode merged to main. Host separation for this closeout is OWNER_WAIVED under R10, recorded explicitly in the episode."
repair_started_at: 2026-09-30T08:10:00Z
repair_value_verdict: ROUTE_B_CONTINUE
repair_reconciled_main_sha: 168182c47df537f7c6c47d7e42ab3220af40de68
repair_branch_sha_pre: 60afe9e68b6d209d3edaf29b321cce74738cd38f
repair_branch_sha_post: 99e5606ffd8f95356a15fcc6f6e2ae1bbabef4c0
repair_ahead_behind: "6 ahead / 59 behind main"
repair_provider_probe: "PASS on Mech AND PASS on Alien. Mech — @deepseek-ai/dsh 0.1.5-rc.1 via the donor's own dsh-runner.js; submit exit 0 returning OK; cancel/interrupt terminated a running job; unsupported refusal PERMANENT_FAILURE/UNSUPPORTED retryable false; provider error MISSING_CREDENTIAL exit 1 not rewritten as success; circuit breaker CLOSED->OPEN. Alien — the same eight verdicts on the same donor seam, receipt recorded in run-3. No secret printed or logged on either host."
repair_module_regression: "skill-intake 22/22, provider-adapter 29/29, provider-resilience 42/42, worker-task-contract 23/23 (116, 0 failures)"
repair_events_appended: "Mech at 8262a41: OWNER_INTERVENTION f6c10e2976dde044; ATTEMPT_STARTED c5aba9348638068d; RUNTIME_PASS de2ff78e06806a93; TEST_PASS 3f13f658e8d00e09; VERIFIER_FINDING(BLOCKED) 6803294c04110f7d. Alien at 99e5606: OWNER_INTERVENTION 452a5c7e77119e79; RUNTIME_PASS b84512cd12f80735; TEST_PASS 16ed0e8452c6dac0. Alien's original migration events, including the real MIGRATION_COMPLETE/PASS e11774421776f289, are untouched."
repair_blocker_unblocking: "RESOLVED / HISTORICAL. Alien ran the same probe on its own host and satisfied the two-host gate. The subsequent host-authority condition recorded at that point was superseded by Owner ruling response-9-30 R10; closeout then completed under the explicit OWNER_WAIVED path. This field is retained only as provenance of the intermediate state."
repair_resume_point: "CLOSED / NO RESUME REQUIRED. Historical READY_FOR_VERIFICATION_HOST instruction was superseded by response-9-30 R10. Completion repair, finalization, episode creation, final CI and merge have already completed; merged_main_sha=756c7d760c605e33ba386e87605e078fe24b82ca. Do not reopen or redo MB-003 from this field."
---

# MB-003 — Worker Gateway Boss/Hns Union 纯迁移

> **Repair queue step 3 — STARTED and RUN TO ITS HONEST TERMINAL STATE (2026-09-30).** MB-007 (`repair_status=COMPLETE`) and MB-008 (`repair_status=COMPLETE`) are both closed, so the precondition to begin step 3 was met. Step 3 performed the value reassessment and the provider probe; see the status block below for the outcome. 先比较当前 Utopia main 与 MB-003 donor/branch；若整体无价值可 `SKIPPED_NOT_REQUIRED`。若仍有价值，real provider/runner execution seam 仍是硬门槛，不能 mock/waive。

> **当前状态：`VERIFICATION_COMPLETE`（repair step 3 于 2026-09-30 闭环）**——Step 3 的价值复核、两台主机 probe、
> completion repair、真实链路、merge 与 City closeout 均已完成。
> 价值判定 = `ROUTE_B_CONTINUE`（当时 `main` 的 `02-worker-gateway` 只有 `skill-intake`，`WG-01..08` 全缺），
> 因此按 `response-9-29` R1 与 `response-9-30` R8 在**原 Mission 身份**下补迁 donor 已有的真实执行 seam。
>
> **two-host gate SATISFIED：** `Mech`（`MEGA-REP`）与 `Alien`（`MERA-ALIANWARE`）**各自**留下了真实、donor-supported 的
> provider receipt（Mech 见 `reports/MB-003/VERIFICATION_REPORT.md` §8.3；Alien 见本文件 `alien_provider_receipt`），
> 解除了 `8262a41` 记录的"Alien 一半无法产出"阻塞。
>
> **completion repair：** 新增 `city/02-engineering/02-worker-gateway/worker-runner`，把 donor 的
> `dsh-runner.js` 逐行等价迁移（唯一适配是把硬编码主机路径改为注入 seam）；`scheduler.js`/`gate.js`/`system.js` 仍
> deferred 并记录在 `DONOR.json`。engineering book §4.5 的真实链路**通过迁移后的模块本身**重跑，五项 verdict 全 true；
> 合并 `main` 的四处冲突全部按并集/超集解决；census 由合并后的 manifest 重新生成并逐条一致（32 modules）。
>
> **主机分离：`OWNER_WAIVED`（`response-9-30.md#R10`）。** Verification Host 本轮无法执行收口，Owner 显式授权本
> Mission 的 Migration Host 完成。没有伪造任何历史：`Mech` 的 VERIFICATION 事件与其 `BLOCKED` finding 原样保留在
> timeline 中、仍挂在 `Mech` 名下；episode 显式记录 `hostSeparation.mode = OWNER_WAIVED`、ruling 引用、
> `migrationHosts=[Alien]`、`verificationHosts=[Alien, Mech]` 与完成主机贡献的 verification 事件数（5）；
> finalizer 新增该 waiver 路径，仅在"完成主机确实产出 verification 事件、且记录中有事件引用该裁决"时接受，
> 并有 10 条测试覆盖正例与全部拒绝情形（原有 11 条不变）。其余 verification 标准一项未降。
>
> **结果：** episode `MB-003:5c0ab438d20476d1`（27 events，inbox digest `694b5edb421d90ddbd728f32c3fa0aec72af7b88392e81f5c42ea85569298a96`）；
> implementation CI `36671050015`、final branch CI `36671502121`、merged-main CI `36671850064` 全 PASS；
> merge `756c7d760c605e33ba386e87605e078fe24b82ca`。

## 目标

把 Hns 为主、Boss 为补充的 Engineering provider/runtime adapter 行为迁入 02/02 Worker Gateway，保留 Skill Intake 已迁成果，不搬运 vendor 产品壳。

## Donor / 冻结基线

- `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`
- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`

## City 归属与落地边界

- **City owner:** 02/02 Worker Gateway — Engineering Provider Adapter Layer
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **目标路径:** `city/02-engineering/02-worker-gateway`
- **依赖 Mission:** 无
- 迁移报告必须记录最终实际落地路径；若发现路径设计本身与当前 City map 冲突，停止并标记阻塞，不得自行改 City ownership。

## 允许迁移的既有行为

- provider/runtime detect/version/capabilities/readiness。
- create/attach/start、bounded work submit、status/progress、cancel/interrupt、result/evidence。
- Hns worker/task contract、provider adapter、readiness/health；Boss provider-session/router/circuit-breaker/outcome 语义。
- unsupported-capability refusal 与 donor 中已存在的 checkpoint/resume adapter 能力。

## 明确禁止 / 不属于本 Mission

- Foreman 计划/DAG/全局调度。
- DSH/DeepSeek 专属 UI、auth/updater、billing/notifications/settings。
- City-global Capability registry 真值。
- 重写/分叉官方 Codex/DeepSeek/Claude 等完整产品。
- Skill Intake 第二份实现。

## Migration 完成门槛

- 从冻结 donor 基线建立可追溯的 source→target 映射。
- donor 已有行为在目标边界内完成等价迁移/适配，未实现项不得被补成“新能力”。
- 目标分支已 push；Migration 阶段**不合入 main**。
- 相关单元/契约/parity 测试完成，并保存真实失败与修复记录。
- 至少完成一次真实产品消费；UI/客户端要求仅复用当前存在的 Utopia 消费面。
- 数据、错误、恢复/中断（适用时）记录可追溯。
- City Migration Report 已提交：
  - `Digital-City/mission-book/reports/MB-003/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 每台参与主机至少用其已安装且 donor 已支持的真实 provider 完成一次 detect→submit→progress→result/unsupported 的实际路径；环境缺失则任务 BLOCKED，不得 mock pass。
- provider failure/interruption/circuit-breaker 语义可观察且错误不被改写成成功。
- 既有 Skill Intake 回归保持全绿。
- Verification 主机必须与 Migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大功能边界。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-003/VERIFICATION_REPORT.md`
- 更新本文件 `verification_complete: true`、最终 CI、merge SHA 与报告字段。

## Claim / 主机领取记录

### Migration Claim

- Host: **Alien**
- Claimed at: 2026-09-29T12:19:26Z
- City claim commit: this commit (SHA recorded verbatim in `reports/MB-003/MIGRATION_REPORT.md`, since a commit cannot name itself)
- Implementation branch: `mission/MB-003-worker-gateway` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`, after confirming that `main` has not moved)

#### Migration closeout

- City claim commit: `5e69ebf0e366835547eb3c36e596937fe58565ec`
- Implementation head: `aff3c283e34b596c6c0ba6c666aed96893b6c395`
- Migration head: `c5734a5e646f1e379aa15282b59a08e8828d5d6a`
- Hosted CI: implementation `36570163616` PASS; final branch `36571564418` PASS (gateway-web + android)
- Report: [`reports/MB-003/MIGRATION_REPORT.md`](../completed-2026-10-01/reports/MB-003/MIGRATION_REPORT.md)
- Not merged to `main`; `mission:finalize` deliberately not run (that belongs to the Verification host)

> **Owner attention — cross-mission conflict.** MB-001 and MB-003 both branched from
> `c7ef3cd` and both edit `city/CITY_IMPLEMENTATION_MANIFEST.json`,
> `city/tests/manifest.test.mjs` and `city/docs/{en,zh-CN}/ARCHITECTURE.md`. MB-001 keeps
> the capability registry from advertising kernel modules with a **district-level**
> `kind: "infrastructure"`; MB-003 does it with a **module-level**
> `capabilityProvider: false`. Whichever merges second must reconcile the two. This is
> structural to the mission-book (missions branch from `main` and share city files), not a
> mistake by either host. See D3 in the MB-003 report.

### Verification Claim

- Host: **Mech**
- Claimed at: 2026-09-29T15:05:00Z
- City claim commit: `39d1c7f`
- Reviewed migration branch: `mission/MB-003-worker-gateway` @ `c5734a5e646f1e379aa15282b59a08e8828d5d6a`
- **Outcome: `BLOCKED_OWNER_DECISION`.** The rule 9 independent review is complete and
  committed (`reports/MB-003/VERIFICATION_REPORT.md` §1–§5); the branch's own gates pass
  (root 59/59, city 224/224, rooms 67/67) and its real consumption is confirmed. The
  Mission's **first** Verification gate — one real detect→submit→progress→result/unsupported
  path with an installed, donor-supported provider, with an explicit ban on mock passes —
  cannot be satisfied here and cannot be repaired without adding capability the branch does
  not carry, which rule 10 forbids. The report's §6 lists the three Owner options.
- A **merge rehearsal** against `main` (aborted, nothing merged) found two mechanical
  conflicts and their reconciliation shape: `registry.mjs` must keep **both** exclusion
  mechanisms (MB-001's district `kind` and MB-003's module `capabilityProvider`), and
  `city/tests/manifest.test.mjs` must take the **union** of the five districts and the seven
  mission modules.


### Step 3 — value reassessment, provider probe and the corrected blocker (`Mech`, 2026-09-30)

Base: Utopia `main` @ `168182c47df537f7c6c47d7e42ab3220af40de68` (post-MB-008).
Branch `mission/MB-003-worker-gateway` @ `60afe9e` → `8262a41`.

- **Value reassessment = `ROUTE_B_CONTINUE`.** `main`'s `city/02-engineering/02-worker-gateway` holds
  **only** `skill-intake`; nothing in the manifest references `provider-adapter`,
  `provider-resilience` or `worker-task-contract`, and no Worker-Gateway provider/runner execution
  seam exists anywhere in `city/`. **All eight of WG-01…WG-08 are missing**, so Route A
  (`SKIPPED_NOT_REQUIRED`) is forbidden.
- **Provider probe on Mech — CORRECTED, and it PASSED.** The earlier `BLOCKED` finding claimed this
  host had no provider environment; that was **incomplete**. The probe looked for provider CLIs on
  `PATH` and missed that the **donor's own runner seam**
  (`DS-Hns @ eeb57ca app/extensions/mega/scheduler/dsh-runner.js`) spawns
  `node <app>/node_modules/@deepseek-ai/dsh/lib/bin.js --profile headless <prompt>`, and
  **`@deepseek-ai/dsh` 0.1.5-rc.1 is installed here**. Mech produced a real receipt: detect/version ·
  bounded submit `exit 0` returning `OK` · liveness/progress through the donor's per-task log ·
  cancel/interrupt via the donor's own `killTree` · the migrated `unsupportedRuntime` refusing with
  `PERMANENT_FAILURE`/`UNSUPPORTED`/`retryable false` · a real provider failure
  (`MISSING_CREDENTIAL`, `exit 1`) **not rewritten as success** · the migrated circuit breaker
  `CLOSED → OPEN`. The host's already-authorised key (order §12 priority 4) was passed to the child
  process only and was **never printed or logged**.
- **Module regression green.** skill-intake **22/22** (the Skill Intake regression the Mission
  requires), provider-adapter **29/29**, provider-resilience **42/42**, worker-task-contract
  **23/23** — 116 total, 0 failures.
- **Still `BLOCKED`, and deliberately not skipped.** The Mission's gate requires **each participating
  host** (Alien and Mech) to leave a real donor-supported provider receipt. `response-9-30.md` **R7**
  rewrote that clause for **MB-008 only**; for MB-003 it stands, and the closeout order says
  explicitly *"当前不得自行降成只测一台"*. **Alien is a different physical host** (its working copies
  `D:/Digital-City`, `D:/DS-Hns-donor`, `D:/Codex-Boss-donor` do not exist here; this host is
  `MEGA-REP`), so Alien's half cannot be produced from this session.
- **No repair was applied and no implementation was written.** §13's repair is gated on a lawful
  environment: Mech has one, the **Mission** does not, because the two-host gate is unsatisfiable
  here. Writing the deferred runner seam would create a delta that can never be verified by the
  required gate or merged — the anti-pattern the order names in §18. Instead the seam is fully mapped
  (§8 of the verification report) and Mech's receipt is reproducible.
- **Evolution events appended on the branch** (`8262a41`): `OWNER_INTERVENTION`
  `MB-003:f6c10e2976dde044`, `ATTEMPT_STARTED` `MB-003:c5aba9348638068d`,
  `RUNTIME_PASS` `MB-003:de2ff78e06806a93` (scoped to Mech only), `TEST_PASS`
  `MB-003:3f13f658e8d00e09`, `VERIFIER_FINDING/BLOCKED` `MB-003:6803294c04110f7d`.
  Alien's original migration events, including the real `MIGRATION_COMPLETE/PASS`
  `MB-003:e11774421776f289` and the earlier `BLOCKED` finding `MB-003:972dd415607db28b`, are retained.
- **What unblocks it.** Alien runs the same probe on its own host and leaves its receipt, **or** the
  Owner explicitly rewrites the two-host clause for MB-003 as R7 did for MB-008. Then: merge `main`,
  migrate the deferred seams, run the two-host gate, `host-pass` finalize (MB-003 already carries a
  real `MIGRATION_COMPLETE/PASS`), final CI, merge.

## 绑定执行条件（所有 Mission 强制）

> **LATEST OWNER RULING:** [`response-9-30.md`](../completed-2026-10-01/response-9-30.md)
> **PRIOR OWNER RULINGS:** [`response-9-29.md`](../completed-2026-10-01/response-9-29.md)（未被 9-30 覆盖的条款继续有效）
> **ACTIVE RULESET:** [`README.md`](./README.md)  
> [`past-rules/`](../completed-2026-10-01/past-rules) 仅为历史归档，不具运行时约束力。
>
> 本 Mission 的当前 front matter 与 mission-specific gates 继续有效；若旧 Claim/Report/正文引用历史 rule 编号，仅按当时上下文解释。若冲突，以最新日期 Owner response 为准。

## Mission-specific evidence

- real provider receipts
- provider/version/readiness snapshots
- interrupt/failure receipts
- existing Skill Intake regression


[阅读译本 / Reading translation](./en/MB-003-worker-gateway.md)
