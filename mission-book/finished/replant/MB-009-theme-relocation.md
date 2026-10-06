---
mission_id: MB-009
sequence: 9
execution_enabled: true
mode: MIGRATION_ONLY
implementation_repo: zhiheng-zhang-Mera/utopia
migration_status: MIGRATION_COMPLETE
migration_complete: true
migration_claim_host: Mech
migration_claimed_at: 2026-09-29T14:45:00Z
migration_branch: mission/MB-009-theme-relocation
migration_head_sha: d338152b0c7ef2ef7e94d78901454ea91f200156
migration_ci: PASS — run 36580730966 (V0.2 checks) on 277f576e9eb35670d77edd0aa98c192d56a7a961: gateway-web success, android success; the event-stream closeout HEAD d338152b0c7ef2ef7e94d78901454ea91f200156 carries its own branch run
migration_report: mission-book/reports/MB-009/MIGRATION_REPORT.md
verification_status: COMPLETE
verification_complete: true
verification_claim_host: Alien
verification_claimed_at: 2026-09-29T16:02:49Z
verification_head_sha: 40660e7479931b2218d28a8400a69f20c4a97b81
verification_ci: PASS — run 36596639671 (V0.2 checks) on 40660e7479931b2218d28a8400a69f20c4a97b81: gateway-web success, android success; implementation CI was run 36596238433 on 881f0bcbef203448058a87137ce80cf7bad49a5f
verification_report: mission-book/reports/MB-009/VERIFICATION_REPORT.md
merged_main_sha: b4bd602971abe83083cd72ab8247d9bd50371f57
---

# MB-009 — Theme Engine 11→00/05 物理归属迁移

> **当前可领取：NO**（Migration 与 Verification 两个阶段均已完成，并已由验证主机 `Alien` 合入
> `zhiheng-zhang-Mera/utopia` `main` @ `b4bd602971abe83083cd72ab8247d9bd50371f57`）
>
> **⚠ 合并时发现一处跨 Mission 冲突，需要 Owner 知晓（详见验证报告 §5）：** MB-001 给 `00-foundation`
> 标了 `kind: "infrastructure"`，而 `registry()` 据此把该 district 的模块排除在解析之外；MB-009 按 City map
> 把 theme engine 搬进 `00-foundation/05-control-centre`，合并后 `presentation.theme.lab` 变成 `DEGRADED`
> （已验收的五个 bridged services 变四个）。裁决：把 kind 细化到 **building 级**（`05-control-centre` 声明
> `kind: "domain"`，`city/manifest.mjs` 新增校验与唯一判定点 `buildingKind`，registry 的**解析索引**覆盖全部
> 声明模块而**枚举**保留两道排除）。该改动严格保守（对所有既有输入行为不变，内核断言一条未减反增），
> 但它**改动了 MB-001 引入的共享文件与其测试**，因此按 Owner 要求显式上报；处置选项见报告 §5.4。

## 目标

把已经 PROMOTED 的 Utopia Theme Engine 从历史物理路径 11 Entertainment 迁到当前确认的 00/05 Control Centre ownership；这是路径/引用/消费边界迁移，不新增主题功能。

## Donor / 冻结基线

- `Utopia main 当前 city/11-entertainment/01-entertainment-centre/theme-engine`
- 历史 donor: `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`
- 已验收 D9 theme-builder promotion history

## City 归属与落地边界

- **City owner:** 00/05 City Control Centre — Presentation & Theming
- **目标实现仓库:** `zhiheng-zhang-Mera/utopia`
- **目标路径:** `city/00-foundation/05-control-centre/theme-engine`
- **依赖 Mission:** 无
- 迁移报告必须记录最终实际落地路径；若发现路径设计本身与当前 City map 冲突，停止并标记阻塞，不得自行改 City ownership。

## 允许迁移的既有行为

- 现有 theme contract/color/raster/package/designer/builder/assets/validation 代码与测试的无语义搬迁。
- 更新 manifest/import/promotion provenance/consumer 引用。
- 保持现有 Theme Generate / D9 parity 与历史证据可追溯。

## 明确禁止 / 不属于本 Mission

- Global theme apply（当前明确为 NO）。
- 新的主题编辑器、新 asset generator、新 Android UI。
- 11 Entertainment 的 voice/avatar/VR/AR/media 能力。

## Migration 完成门槛

- 从冻结 donor 基线建立可追溯的 source→target 映射。
- donor 已有行为在目标边界内完成等价迁移/适配，未实现项不得被补成“新能力”。
- 目标分支已 push；Migration 阶段**不合入 main**。
- 相关单元/契约/parity 测试完成，并保存真实失败与修复记录。
- 至少完成一次真实产品消费；UI/客户端要求仅复用当前存在的 Utopia 消费面。
- 数据、错误、恢复/中断（适用时）记录可追溯。
- City Migration Report 已提交：
  - `Digital-City/mission-book/reports/MB-009/MIGRATION_REPORT.md`
- 更新本文件 `migration_complete: true`、branch/head/CI/report 字段。

## Verification 完成门槛

- 搬迁前后 donor oracle / D9 / package / theme-engine digest 与行为保持等价。
- 现有 Web/Android 可调用的 Theme Generate 路径继续工作；不得新增 global apply 来制造‘可用性’。
- 历史 promotion/provenance 不因物理路径改变而断链。
- Verification 主机必须与 Migration 主机不同。
- 先完成独立代码/运行审查并写下发现，再阅读 Migration 报告。
- 必要维修只能发生在同一 Mission 分支，且不得扩大功能边界。
- 所有 required CI 与本 Mission 门禁全绿。
- 由 Verification 主机完成合并到目标实现仓库 `main`。
- City Verification Report 已提交：
  - `Digital-City/mission-book/reports/MB-009/VERIFICATION_REPORT.md`
- 更新本文件 `verification_complete: true`、最终 CI、merge SHA 与报告字段。

## Claim / 主机领取记录

### Migration Claim

- Host: **Mech**
- Claimed at: 2026-09-29T14:45:00Z
- City claim commit: `268ab59411ee54893cdd1f648e5155008e2b2a6a` (pushed to Digital-City `main`; no write conflict)
- Implementation branch: `mission/MB-009-theme-relocation` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)
- Relocation commit: `65f9aa740a937e52542e1ecf60babf742f4cf9ba`
- Provenance commit: `277f576e9eb35670d77edd0aa98c192d56a7a961`
- Final branch HEAD: `d338152b0c7ef2ef7e94d78901454ea91f200156`
- Migration CI: **PASS** — run `36580730966` (`V0.2 checks`) on `277f576e…`: `gateway-web` success, `android` success.
- Migration Report: [`reports/MB-009/MIGRATION_REPORT.md`](../completed-2026-10-01/reports/MB-009/MIGRATION_REPORT.md)
- **NOT merged to `main`**, as the migration stage requires.
- Selection note: selection was made against the latest Digital-City `main`. MB-007 and MB-008 are claimed by host `Alien`; every other enabled Mission has `migration_complete: true`. No verification task is available to this host (MB-001/003/006 belong to `Alien`; `Mech` migrated MB-002, MB-004 and MB-005, so rule 5 forbids it from verifying any of those). Sequence order therefore selected MB-009, the last unclaimed enabled Mission.

### Verification Claim

- Host: **Alien** (migration host was `Mech`; rule 5 satisfied — a different host)
- Claimed at: 2026-09-29T16:02:49Z
- City claim commit: `4ac89ca4b22cdbb03e5eb275464f6d1137e4c0ce`
- Reviewed migration branch: `mission/MB-009-theme-relocation` @ `d338152b0c7ef2ef7e94d78901454ea91f200156`
- Repairs (same branch only):
  - `R1` — `881f0bcbef203448058a87137ce80cf7bad49a5f`: added
    `apps/rooms/tests/promotion-relocation.test.mjs`, because the relocation guards the
    migration added to `scripts/verify-promotion-history.mjs` had no test coverage at all
    (rooms 67 → 69).
  - `R2`/`R3` — verification probes, not branch content. `R2` executed every relocation guard
    against a mutated record and restored it byte-exactly; `R3` ran the same theme generate
    call in a pre-relocation worktree and on the branch and got an identical digest.
  - `R4` — added `scripts/mb009-theme-relocation-pilot.mjs`, which drives the real gateway path
    the Web and Android clients use.
- Episode closeout: `40660e7479931b2218d28a8400a69f20c4a97b81` (`MB-009:e1f0526f2c07fb41`)
- Merged to `main`: `b4bd602971abe83083cd72ab8247d9bd50371f57`
- Verification Report: [`reports/MB-009/VERIFICATION_REPORT.md`](../completed-2026-10-01/reports/MB-009/VERIFICATION_REPORT.md)
- **Cross-mission conflict recorded and reported to the Owner:** the merge exposed a conflict
  between MB-001's district-level `kind` marker and MB-009's City-map-mandated target path.
  See the report §5.
- Selection note: re-read against the latest Digital-City `main` (`0764924`) immediately
  before claiming, as rule 3 requires. Every enabled Mission now has `migration_complete: true`, so
  the migrated-but-unverified set decides by `SEQUENCE` ascending: `MB-003` is
  `BLOCKED_OWNER_DECISION`, `MB-006`/`MB-007`/`MB-008` are closed to `Alien` by rule 5 and rule 13,
  and `MB-004`/`MB-005` were completed by this host. `MB-009` is therefore the lowest-sequence
  eligible mission and the last one open to this host.

> **Order of work (rule 9).** The independent review comes FIRST and is written down before the
> Migration Report is opened: donor, target code, diff, tests and running state only. The
> Migration Report is then read as secondary reference, and the differences are recorded.

### Verifier should know

- **The provenance decision in §2.2 is the part to challenge.** `targetCityPath` in
  the three theme promotion records is deliberately still the **historical** path,
  and `verify-promotion-history.mjs` now requires the *current* location at `HEAD`
  via a new `relocatedTo` + `relocatedByMission` pair. The check was made
  relocation-aware, **not weaker**: it still requires `targetCityPath` at
  `promotedAtCommit`, refuses an unattributed `relocatedTo`, and refuses one outside
  `city/`. Negative-test it as §2.2 describes rather than trusting the green run.
- `apps/rooms/hub/manifest.mjs` still names the old path **on purpose** (§8.1) — it
  records where those promotions landed, beside immutable promotion records.
- The capability went `BRIDGE_PENDING` mid-construction while `registry.mjs` was
  stale; it is `AVAILABLE` now. §6.4.
- This branch's city-suite baseline is **129** tests, not the 173/212/586 seen on
  MB-002/MB-005/MB-004 — those branches carry their own modules. §8.3.


## 绑定执行条件（所有 Mission 强制）

> **ACTIVE RULESET:** [`README.md`](./README.md)（integration-first v2）  
> **OWNER RULINGS:** [`response-9-29.md`](../completed-2026-10-01/response-9-29.md)
> [`past-rules/`](../completed-2026-10-01/past-rules) 仅为历史归档，不具运行时约束力。
>
> 本 Mission 的当前 front matter 与 mission-specific gates 继续有效；若旧 Claim/Report/正文引用历史 rule 编号，仅按当时上下文解释。若与 Owner 最新裁决冲突，以 `response-9-29.md` 为准。

## Mission-specific evidence

- pre/post path mapping
- theme/D9 parity digests
- existing Web/Android service invocation
- promotion/provenance continuity check


[阅读译本 / Reading translation](./en/MB-009-theme-relocation.md)
