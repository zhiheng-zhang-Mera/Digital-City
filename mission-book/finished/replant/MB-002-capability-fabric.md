---
mission_id: MB-002
sequence: 2
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
migration_status: MIGRATION_COMPLETE
migration_complete: true
migration_claim_host: Mech
migration_claimed_at: 2026-09-29T12:02:31Z
migration_branch: mission/MB-002-capability-fabric
migration_head_sha: db3ac518de1d6125e00cee1d9ff6ff7868b58336
migration_ci: PASS — run 36568159888 (V0.2 checks) on 00607f8b243e166b112319b1663eebb3d763fcfc: gateway-web success, android success; the event-stream follow-up HEAD db3ac518de1d6125e00cee1d9ff6ff7868b58336 carries its own branch run
migration_report: mission-book/reports/MB-002/MIGRATION_REPORT.md
verification_status: COMPLETE
verification_complete: true
verification_claim_host: Alien
verification_claimed_at: 2026-09-29T14:44:07Z
verification_head_sha: 63acf7af029357ca8ad85939a23dc9ab46e06f85
verification_ci: PASS — run 36586312554 (V0.2 checks) on 63acf7af029357ca8ad85939a23dc9ab46e06f85: gateway-web success, android success; implementation CI was run 36585852227 on d0052d029f769ecbe1b7e8279fafb7aa93510ef2
verification_report: mission-book/reports/MB-002/VERIFICATION_REPORT.md
merged_main_sha: 83ea44e02274f8d5bcbe866d339a5cd703839e9b
---

# MB-002 — Capability Fabric Boss/Hns Union 纯迁移

> **当前可领取：NO**（Migration 与 Verification 两个阶段均已完成，且已由验证主机 `Alien`
> 合入 `zhiheng-zhang-Mera/utopia` `main` @ `83ea44e02274f8d5bcbe866d339a5cd703839e9b`）

## 目标

在不推翻 Utopia V0.3 已验收 Capability Bridge 的前提下，把 Boss/Hns 中已经实现且属于 city-global Capability Fabric 的可复用行为迁入 00/03。

## Donor / 冻结基线

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`
- `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`
- 现有 Utopia V0.3 Capability Bridge 作为已验收 reference baseline

## City 归属与落地边界

- **City owner:** 00/03 City Service Network — Capability Registry & Discovery
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **目标路径:** `city/00-foundation/03-capability-fabric`
- **依赖 Mission:** 无
- 迁移报告必须记录最终实际落地路径；若发现路径设计本身与当前 City map 冲突，停止并标记阻塞，不得自行改 City ownership。

## 允许迁移的既有行为

- Boss 的 capability/provider registry、broker/routing、provider health/discovery 与稳定 outcome/state 模型。
- Hns 的 capability/plugin dependency、lifecycle、adapter/compatibility、fallback/fault、health、config/lockfile verification 中 city-global 可复用部分。
- 保留现有 qualified identity、availability、bounded invocation/history/typed error 行为。

## 明确禁止 / 不属于本 Mission

- Engineering provider planning/worker pool（02/01/02）。
- Customs admission 与 runtime enforcement。
- Skill Intake 已 ACTIVE 的实现不得复制第二份。
- 扩大 operation allowlist、权限或网络暴露。

## Migration 完成门槛

- 从冻结 donor 基线建立可追溯的 source→target 映射。
- donor 已有行为在目标边界内完成等价迁移/适配，未实现项不得被补成“新能力”。
- 目标分支已 push；Migration 阶段**不合入 main**。
- 相关单元/契约/parity 测试完成，并保存真实失败与修复记录。
- 至少完成一次真实产品消费；UI/客户端要求仅复用当前存在的 Utopia 消费面。
- 数据、错误、恢复/中断（适用时）记录可追溯。
- City Migration Report 已提交：
  - `Digital-City/mission-book/reports/MB-002/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 现有五个 Utopia bridged services 的历史/当前验收向量全部保持通过。
- 至少覆盖一个 Boss provider/broker 场景和一个 Hns lifecycle/fallback/compat 场景的 donor parity。
- Web 与 Android 对 availability/result/error/history 的 digest/状态保持一致。
- Verification 主机必须与 Migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大功能边界。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-002/VERIFICATION_REPORT.md`
- 更新本文件 `verification_complete: true`、最终 CI、merge SHA 与报告字段。

## Claim / 主机领取记录

### Migration Claim

- Host: **Mech**
- Claimed at: 2026-09-29T12:02:31Z
- City claim commit: `bc2bbbdbac9ff670f2c9b3cbc93f091a7e46694b` (pushed to Digital-City `main`; no write conflict)
- Implementation branch: `mission/MB-002-capability-fabric` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)
- Migration HEAD: `db3ac518de1d6125e00cee1d9ff6ff7868b58336` (implementation commit `00607f8b243e166b112319b1663eebb3d763fcfc` + the event-stream closeout commit)
- Migration CI: **PASS** — run `36568159888` (`V0.2 checks`) on `00607f8b243e166b112319b1663eebb3d763fcfc`: `gateway-web` success, `android` success. The follow-up event commit carries its own run on the same branch.
- Migration Report: [`reports/MB-002/MIGRATION_REPORT.md`](../completed-2026-10-01/reports/MB-002/MIGRATION_REPORT.md)
- **NOT merged to `main`**, as the migration stage requires.

### Verification Claim

- Host: **Alien** (migration host was `Mech`; rule 5 satisfied — a different host)
- Claimed at: 2026-09-29T14:44:07Z
- City claim commit: `8c4d214a9287a346e9b4b8060f82e7c5e1c6d695`
- Reviewed migration branch: `mission/MB-002-capability-fabric` @ `db3ac518de1d6125e00cee1d9ff6ff7868b58336`
- Repair (same branch only): `d0052d029f769ecbe1b7e8279fafb7aa93510ef2` — added
  `tests/v03-derivation-parity.test.mjs`, an independent oracle over 516 lifecycle
  mixtures; no production file was changed by the verifier.
- Episode closeout: `63acf7af029357ca8ad85939a23dc9ab46e06f85` (`MB-002:f859fd8391837e33`)
- Merged to `main`: `83ea44e02274f8d5bcbe866d339a5cd703839e9b`
- Verification Report: [`reports/MB-002/VERIFICATION_REPORT.md`](../completed-2026-10-01/reports/MB-002/VERIFICATION_REPORT.md)

> **Order of work (rule 9).** The independent review comes FIRST and is written down before the
> Migration Report is opened: donor, target code, diff, tests and running state only. The
> Migration Report is then read as secondary reference, and the differences are recorded.


## 绑定执行条件（所有 Mission 强制）

> **ACTIVE RULESET:** [`README.md`](./README.md)（integration-first v2）  
> **OWNER RULINGS:** [`response-9-29.md`](../completed-2026-10-01/response-9-29.md)
> [`past-rules/`](../completed-2026-10-01/past-rules) 仅为历史归档，不具运行时约束力。
>
> 本 Mission 的当前 front matter 与 mission-specific gates 继续有效；若旧 Claim/Report/正文引用历史 rule 编号，仅按当时上下文解释。若与 Owner 最新裁决冲突，以 `response-9-29.md` 为准。

## Mission-specific evidence

- V0.3 regression matrix
- Boss provider/broker parity
- Hns lifecycle/fallback parity
- cross-client result/error/history evidence


[阅读译本 / Reading translation](./en/MB-002-capability-fabric.md)
