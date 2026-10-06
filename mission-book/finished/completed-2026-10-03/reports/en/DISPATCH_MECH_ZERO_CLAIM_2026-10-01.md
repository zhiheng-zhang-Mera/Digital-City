# Host dispatch record — Mech zero-claim scan after UI-000 Development (2026-10-01), English reading translation

> Reading translation / 阅读译本：完整历史阅读版本；原报告为权威记录，证据代码原样保留，不创建第二份状态。

> Reading translation / 阅读译本: Complete historical reading version; source authority and evidence blocks remain unchanged, no duplicate task state.
> Standing rules: [CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md).
> §5 zero-claim telemetry, **not** a task claim or dashboard update. Host Mech; scan at 2026-10-01T11:20Z.
> **Later correction, same day, appended by Mech without rewriting history:** after this record Mech rechecked its deliverable in the same scan window, found 17 rendered-but-no-op controls and repaired them. Head 905e9ff/CI36854042480 moved to 6059252/CI36855082899, both success. Section 1/§5 heads remain verified truth **at that time**; current truth is workbook frontmatter and DEVELOPMENT_REPORT. Classification unchanged.

## 1. Authoritative facts at scan time

```text
Digital-City main = 8bf6283c (this commit's parent: 29bdf85)
Utopia main       = e7c498f5acd86da324a45c3278219c8daa612561   (unchanged)
Utopia branch     = ui/UI-000-visual-direction-candidates @ 905e9ff97d21cd282601a819af1e69acc455af99
Utopia CI (head)  = run 36854042480, success (android success, gateway-web success)
```

Per §2 read latest City main and workbook frontmatter, not dashboard.

## 2. Actual pool, generated from frontmatter

| Workbook | status | dependencies | development_host | development_complete | review_host | owner_gate |
| --- | --- | --- | --- | --- | --- | --- |
| UI-000 | **DEVELOPMENT_COMPLETE** | `[]` | Mech | **true** | null | STYLE_SELECTION |
| UI-101 | NOT_STARTED | `["UI-000"]` | null | false | null | NONE |
| UI-102 | NOT_STARTED | `["UI-000"]` | null | false | null | NONE |
| UI-103 | NOT_STARTED | `["UI-000"]` | null | false | null | NONE |
| UI-190 | NOT_STARTED | `["UI-101","UI-102","UI-103"]` | null | false | null | FINAL_VISUAL_PREVIEW |
| RS-201 | NOT_STARTED | `["UI-190"]` | null | false | null | NONE |
| RS-202 | NOT_STARTED | `["UI-190"]` | null | false | null | NONE |
| RS-203 | NOT_STARTED | `["RS-201","RS-202"]` | null | false | null | NONE |
| RS-290 | NOT_STARTED | `["RS-201","RS-202","RS-203"]` | null | false | null | NONE |
| UXI-301 | NOT_STARTED | `["UI-190","RS-290"]` | null | false | null | NONE |
| UXI-390 | NOT_STARTED | `["UXI-301"]` | null | false | null | NONE |


## 3. Why Mech has zero claims

UI-000 now only **Review**, which §3 reserves to a different physical host than Development. Mech developed it, so Review is stably prohibited for this role, not temporarily idle.

UI-101/102/103 depend on **Owner STYLE_SELECTION**. Development true releases only one half; workbook requires selection recorded as sole visual direction source. Until Owner choice is recorded, dependencies unmet. Everything else downstream.

## 4. Classification (§5)

```text
pool_incomplete:                 true
claimable_now:                   0
potentially_claimable_later:     true
classification:                  TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY
structural_ineligibility_reason: null
global_external_blocker:         null
wake_condition:                  UI-000 Review 由 Alien 完成，或 Owner 给出 STYLE_SELECTION 裁决
                                 （A / B / C 或"都不好看"+ 原因），此后 UI-101..103 解锁
rescan_after:                    约 20 分钟 bounded re-scan（事件优先，兜底重扫）
terminal_reason:                 null
```

Pool incomplete, claimable 0, future eligibility true, WAITING_ELIGIBILITY, no structural/external/terminal reason. Wake Alien completing UI-000 Review or Owner A/B/C/“none good”+reason ruling, unlocking UI-101..103. Events first, about 20-minute bounded fallback.

Against §5.1: unfinished tasks, Mech may regain eligibility once downstream unlocks, observable event exists. **Not STRUCTURALLY_INELIGIBLE**: all remaining work would need permanently barred, whereas Review prohibition only this task/role. **Not POOL_TERMINAL**: §5.4 forbids idle-as-complete.

## 5. §7 reconciliation

External state changed materially, compare recorded/evidence:

```text
recorded branch == evidence head_branch     ui/UI-000-visual-direction-candidates == 该 head 的 head_branch   OK
recorded head   == evidence head_sha        905e9ff97d21cd282601a819af1e69acc455af99                       OK
required terminal state == evidence conclusion  run 36854042480 == success (android + gateway-web)          OK
```

Branch/head/required terminal CI match, run 36854042480 succeeded on both jobs. No EVIDENCE_POINTER_MISMATCH. Only control-plane metadata frontmatter/report written; no product commit manufactured to refresh state.

## 6. Handoff to Alien, not a claim

Development complete; Alien Review claimable. Inspect workbook independent Review: three genuinely different candidates beyond recolouring, core functionality retained, engineering-backend aesthetic absent, mobile/desktop readability, no AI SaaS template copies, technical detail default demotion but accessible. **Direct in-scope repairs allowed**.

Machine evidence Mech verified:

```text
apps/web/candidates/shared/facts.js          29 capabilities + 20 demoted technical fields
apps/web/candidates/shared/parity-probes.js  探针契约（SURFACE_PROBES / TECHNICAL_PROBES / ASK_PROBES / ACTION_PROBES）
apps/web/candidates/shared/runtime.js        三套候选共用的本地运行时（每个控件都作用在它上面）
scripts/ui-000/parity.mjs                    node scripts/ui-000/parity.mjs  -> 324/324 PASS（含 7 个动作的真实点击）
tests/ui-000-candidates.test.mjs             node --test tests/ui-000-candidates.test.mjs -> 5/5
evidence/raw/mission-book/UI-000/            有界截图证据 + parity-report.md
```

Facts: 29 capabilities / 20 demoted technical fields; parity probe contract SURFACE/TECHNICAL/ASK/ACTION; shared local runtime controls act upon; parity 324/324 including seven real action clicks; candidate suite 5/5; bounded shots+parity report.

Three independent challenges proactively offered:

1. Two **relaxed** probe tokens 运行 / 41 in Development Report §4 D8: did they mask actual loss?
2. Candidate B inspector `revealAll()`: equivalent to manual reviewer expansion, **not** shortcut to pass probes?
3. Android representative page only Home: enough for gate or needs Room/Tools screen?

## 7. Next host action

Low-cost wait, events first: Review completion/Owner ruling/new eligible claim; no event then a ~20-minute fallback. No busy-poll/no valueless commits to look busy (§9).

语言配对 / Language pair: [原文 / Source](../DISPATCH_MECH_ZERO_CLAIM_2026-10-01.md)
