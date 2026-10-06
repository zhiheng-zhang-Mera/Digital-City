---
mission_id: MB-005
sequence: 5
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
migration_status: MIGRATION_COMPLETE
migration_complete: true
migration_claim_host: Mech
migration_claimed_at: 2026-09-29T12:33:27Z
migration_branch: mission/MB-005-host-health
migration_head_sha: 545d38fa6cc7023826c5a3a4a09cb2e37265eb06
migration_ci: PASS — run 36571598704 (V0.2 checks) on 5fbbec666f61b2ff82f06a85630c2fb538ca7631: gateway-web success, android success; the event-stream closeout HEAD 545d38fa6cc7023826c5a3a4a09cb2e37265eb06 carries its own branch run
migration_report: mission-book/reports/MB-005/MIGRATION_REPORT.md
verification_status: COMPLETE
verification_complete: true
verification_claim_host: Alien
verification_claimed_at: 2026-09-29T15:34:43Z
verification_head_sha: 75f9acd1e6e4738b46f663412935624359ea586c
verification_ci: PASS — run 36593553358 (V0.2 checks) on 75f9acd1e6e4738b46f663412935624359ea586c: gateway-web success, android success; implementation CI was run 36593090881 on 977cd0c3487c4f1fd11e71b1f123007829f95ef1
verification_report: mission-book/reports/MB-005/VERIFICATION_REPORT.md
merged_main_sha: cfe34df1109dbe6a90348f1a671bae6ff1dc3074
---

# MB-005 — Host Health Station vendor-neutral 纯迁移

> **当前可领取：NO**（Migration 与 Verification 两个阶段均已完成，并已由验证主机 `Alien` 合入
> `zhiheng-zhang-Mera/utopia` `main` @ `cfe34df1109dbe6a90348f1a671bae6ff1dc3074`）
>
> **⚠ 已上报 Owner 的一项门禁条款：** Verification 门槛中"**两台主机**分别用真实 telemetry 跑过…"
> 这一句按两种读法记录为 **mission-design tension**：Reading 1（按参与主机角色）已满足；
> Reading 2（两台物理机器）在本会话不可满足 —— 规则 5 只允许一台验证主机且禁止第三台，本机只有一台机器。
> 与 MB-006 验证报告 §5.2 的先例一致，**两种读法都记录，不择一断言，也不伪造第二台机器**。
> 完整问题/选择/判断逻辑见 [`reports/MB-005/VERIFICATION_REPORT.md`](../completed-2026-10-01/reports/MB-005/VERIFICATION_REPORT.md) §6.1。
> 同报告另有两点需 Owner 注意：`bandKeyOf` 的 donor bug 建议专项裁决（§7.2），
> 以及本次验证发现并修复了迁移夹带的一处**测试弱化**（§3.3）。

## 目标

把 dsh-health-scheduler 已实现的主机/运行时健康判断从 Hns plugin 绑定中抽出，按既有行为迁为 02/03 vendor-neutral Host Health Station。

## Donor / 冻结基线

- `zhiheng-zhang-Mera/dsh-health-scheduler @ 985e2b7389330db4b32ea2946e3657746c64b47b`

## City 归属与落地边界

- **City owner:** 02/03 Host Health Station — Runtime Health Scheduling Service
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **目标路径:** `city/02-engineering/03-host-health-station`
- **依赖 Mission:** 无
- 迁移报告必须记录最终实际落地路径；若发现路径设计本身与当前 City map 冲突，停止并标记阻塞，不得自行改 City ownership。

## 允许迁移的既有行为

- telemetry provider/normalization、rolling history/trends。
- coverage/unknown semantics 与 pressure aggregation。
- sustain/hysteresis/debounce/dwell/cooldown anti-flapping。
- maintenance/safe-point/defer policy。
- Level 1/2 throttle/pause 请求与 Level 3/4 restart/reboot 请求。
- read-only status/history/policy 与 auditable decision records。

## 明确禁止 / 不属于本 Mission

- 实际执行 restart/reboot（MB-006）。
- Hns task/checkpoint ownership。
- City Node membership/global scheduling。
- 新增传感器、指标或新的健康算法。

## Migration 完成门槛

- 从冻结 donor 基线建立可追溯的 source→target 映射。
- donor 已有行为在目标边界内完成等价迁移/适配，未实现项不得被补成“新能力”。
- 目标分支已 push；Migration 阶段**不合入 main**。
- 相关单元/契约/parity 测试完成，并保存真实失败与修复记录。
- 至少完成一次真实产品消费；UI/客户端要求仅复用当前存在的 Utopia 消费面。
- 数据、错误、恢复/中断（适用时）记录可追溯。
- City Migration Report 已提交：
  - `Digital-City/mission-book/reports/MB-005/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 两台主机分别用真实 telemetry 跑过正常、未知/缺失、持续压力/防抖场景。
- Health Station 只能产生 bounded action request，不能直接执行重启。
- 现有 Utopia 消费面能读取真实 status/history/error；不得为了本 Mission 新建 dashboard。
- Verification 主机必须与 Migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大功能边界。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-005/VERIFICATION_REPORT.md`
- 更新本文件 `verification_complete: true`、最终 CI、merge SHA 与报告字段。

## Claim / 主机领取记录

### Migration Claim

- Host: **Mech**
- Claimed at: 2026-09-29T12:33:27Z
- City claim commit: `89d506e7a791b9c90006d2a4f19dd4d73c4c897a` (pushed to Digital-City `main`; no write conflict)
- Implementation branch: `mission/MB-005-host-health` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)
- Implementation commit: `5fbbec666f61b2ff82f06a85630c2fb538ca7631`
- Final branch HEAD: `545d38fa6cc7023826c5a3a4a09cb2e37265eb06` (implementation + the event-stream closeout commit)
- Migration CI: **PASS** — run `36571598704` (`V0.2 checks`) on `5fbbec66…`: `gateway-web` success, `android` success. The closeout commit carries its own branch run.
- Migration Report: [`reports/MB-005/MIGRATION_REPORT.md`](../completed-2026-10-01/reports/MB-005/MIGRATION_REPORT.md)
- **NOT merged to `main`**, as the migration stage requires.
- Selection note: MB-003 (sequence 3) was claimed by host `Alien` and MB-004 (sequence 4) depends on MB-003, so sequence order selected MB-005.

### Verification Claim

- Host: **Alien** (migration host was `Mech`; rule 5 satisfied — a different host)
- Claimed at: 2026-09-29T15:34:43Z
- City claim commit: `03f395dc623a86e99c64076c0542d7fa0be95b6f`
- Reviewed migration branch: `mission/MB-005-host-health` @ `545d38fa6cc7023826c5a3a4a09cb2e37265eb06`
- Repairs (same branch only):
  - `R1` — cloned and built the frozen donor at the git-ignored path the differential harness
    expects, which turned a silently-skipped parity run into an executed one
    (110/110 scenarios, 83/83 tests, 0 skipped). No branch content changed.
  - `R2` — added `scripts/mb005-health-pilot.mjs`, a real-telemetry pilot that also audits the
    bounded-action-request property and demonstrates the existing node consumption surface.
  - `R3` — `977cd0c3487c4f1fd11e71b1f123007829f95ef1`: repaired a **pre-existing test the
    migration weakened** (the duplicate-module-name uniqueness fixture had collapsed to a
    one-building district and could no longer fail) and corrected two factual errors in
    `DONOR.json`.
- Episode closeout: `75f9acd1e6e4738b46f663412935624359ea586c` (`MB-005:bc50edf4e6a626d8`)
- Merged to `main`: `cfe34df1109dbe6a90348f1a671bae6ff1dc3074`
- Verification Report: [`reports/MB-005/VERIFICATION_REPORT.md`](../completed-2026-10-01/reports/MB-005/VERIFICATION_REPORT.md)
- **Gate clause recorded as a tension, reported to the Owner:** the "two hosts" wording of the
  real-telemetry clause. See the report §6.1. Everything else in the gate is met.
- Selection note: re-read against the latest Digital-City `main` (`d6969d9`) immediately
  before claiming, as rule 3 requires. No migration task remained claimable, so selection fell
  to the migrated-but-unverified set by `SEQUENCE` ascending: `MB-003` is
  `BLOCKED_OWNER_DECISION`, `MB-006`/`MB-007`/`MB-008` are closed to `Alien` by rule 5 and
  rule 13, and `MB-004` had just been completed by this host. `MB-005` is the lowest-sequence
  eligible mission (`MB-009` remains for a later claimant).

> **Order of work (rule 9).** The independent review comes FIRST and is written down before the
> Migration Report is opened: donor, target code, diff, tests and running state only. The
> Migration Report is then read as secondary reference, and the differences are recorded.

### Verifier should know

- **A real donor bug is reproduced, deliberately, not fixed.** `bandKeyOf`
  never returns `:warn` for a `lower-is-worse` metric. Reproduced against the
  compiled donor and pinned by a naming test. Fixing it changes when a sustain
  gate opens, so it is a semantics decision, not a migration step. See the
  Migration Report §8.1.
- `city/manifest.mjs`'s `checkManifestAgainstTree` does **not** flag a module
  directory the manifest never declares, so the census cannot be relied on to
  catch an undeclared module. See §8.3.
- The differential harness in the module is the strongest parity evidence; it
  needs the donor build, which lives in the git-ignored evidence area, and it
  **skips with a reason** when that build is absent rather than passing quietly.
  Re-running it is worth the Verifier's time.


## 绑定执行条件（所有 Mission 强制）

> **ACTIVE RULESET:** [`README.md`](./README.md)（integration-first v2）  
> **OWNER RULINGS:** [`response-9-29.md`](../completed-2026-10-01/response-9-29.md)
> [`past-rules/`](../completed-2026-10-01/past-rules) 仅为历史归档，不具运行时约束力。
>
> 本 Mission 的当前 front matter 与 mission-specific gates 继续有效；若旧 Claim/Report/正文引用历史 rule 编号，仅按当时上下文解释。若与 Owner 最新裁决冲突，以 `response-9-29.md` 为准。

## Mission-specific evidence

- host telemetry snapshots
- pressure/unknown/anti-flap trials
- bounded action-request receipts
- status/history consumer evidence


[阅读译本 / Reading translation](./en/MB-005-host-health.md)
