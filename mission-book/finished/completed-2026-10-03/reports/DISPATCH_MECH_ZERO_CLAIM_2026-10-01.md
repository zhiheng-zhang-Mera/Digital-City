# Host dispatch record — Mech zero-claim scan after UI-000 Development (2026-10-01)

> 常驻规则：[../CONSTRUCTION_RULES.md](../../../CONSTRUCTION_RULES.md)
> 本记录是 §5 要求的零领取 telemetry 记录，**不是** task claim，也不是看板更新。
> Host: `Mech`。扫描时点：`2026-10-01T11:20Z`。
>
> **后续更正（同日，由 Mech 追加，不改写上面的历史观测）：** 本记录写下后，Mech 在同一次扫描窗口内
> 对自己的交付物做了一次复检，发现 17 个"渲染出来但什么都不做"的控件，并完成修正。因此 UI-000 的
> Development head 从 `905e9ff`（CI 36854042480）移动到 `6059252`（CI 36855082899），两处 CI 均为
> success。本记录第 1 节与 §5 reconciliation 中的 head 是**当时**的已验证真相，保留不动；当前真相以
> workbook frontmatter 与 `DEVELOPMENT_REPORT.md` 为准。Mech 的零领取分类本身未改变。

## 1. 扫描时读取的权威事实

```text
Digital-City main = 8bf6283c (this commit's parent: 29bdf85)
Utopia main       = e7c498f5acd86da324a45c3278219c8daa612561   (unchanged)
Utopia branch     = ui/UI-000-visual-direction-candidates @ 905e9ff97d21cd282601a819af1e69acc455af99
Utopia CI (head)  = run 36854042480, success (android success, gateway-web success)
```

读取方式遵循 §2：只读最新 Digital-City `main` + 各 workbook frontmatter，不看板。

## 2. 任务池真实状态（generated from workbook frontmatter）

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

## 3. 为什么 Mech 现在领取为 0

UI-000 现在唯一可做的是 **Review**，而 §3 要求同一任务的 Development 与 Review 必须由不同实体主机
完成。本机是 Development host，因此 Review 对 Mech 是稳定机制禁止，不是"暂时没活"。

UI-101/102/103 依赖 UI-000 的 **Owner STYLE_SELECTION**——`development_complete=true` 只解除了
"Development 完成"这一半，工作书明确要求"选择结果写入 UI-000 report，作为 UI-101..103 唯一视觉方向来源"，
所以在 Owner 选择落盘前它们仍不满足依赖。其余任务全部落在同一条依赖链下游。

## 4. 零领取分类（§5）

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

逐条对照 §5.1：仍有未完成任务；Mech 未来确实可能重新获得资格（UI-101..103 解锁后仍由 Mech 施工）；
解锁事件存在且可观测。因此**不能**判 `STRUCTURALLY_INELIGIBLE`（该类别要求所有剩余工作被稳定机制
永久禁止本主机，而 Review 只是本任务对本角色禁止）；**也不能**判 `POOL_TERMINAL`（§5.4 禁止把
"暂时没活"写成完成）。

## 5. §7 reconciliation

外部状态本次发生了有效变化，因此按 §7 逐项核对 recorded vs evidence：

```text
recorded branch == evidence head_branch     ui/UI-000-visual-direction-candidates == 该 head 的 head_branch   OK
recorded head   == evidence head_sha        905e9ff97d21cd282601a819af1e69acc455af99                       OK
required terminal state == evidence conclusion  run 36854042480 == success (android + gateway-web)          OK
```

未发现 `EVIDENCE_POINTER_MISMATCH`。本次 reconciliation 只写 control-plane metadata（workbook
frontmatter + report），没有为了"刷新状态"制造产品代码 commit。

## 6. 给 Alien 的交接（不构成 claim）

UI-000 Development 已完成，Review 现在对 Alien 可领取。Review 需要检查的内容见工作书
"独立复核"小节（三套是否真的不同而非换色、是否都保留核心功能、是否仍有工程后台气质、移动/桌面可读性、
是否存在 AI SaaS 模板式复制、技术细节是否默认降级而仍可访问），并可**直接修复范围内缺陷**。

Review 可直接使用、且 Mech 已验证过的机器可读证据：

```text
apps/web/candidates/shared/facts.js          29 capabilities + 20 demoted technical fields
apps/web/candidates/shared/parity-probes.js  探针契约（SURFACE_PROBES / TECHNICAL_PROBES / ASK_PROBES / ACTION_PROBES）
apps/web/candidates/shared/runtime.js        三套候选共用的本地运行时（每个控件都作用在它上面）
scripts/ui-000/parity.mjs                    node scripts/ui-000/parity.mjs  -> 324/324 PASS（含 7 个动作的真实点击）
tests/ui-000-candidates.test.mjs             node --test tests/ui-000-candidates.test.mjs -> 5/5
evidence/raw/mission-book/UI-000/            有界截图证据 + parity-report.md
```

三条最值得独立挑战的地方，Mech 主动列出以免复核只在表面上同意：

1. `DEVELOPMENT_REPORT.md` §4 D8 中两处**放宽过的探针 token**（`运行`、`41`）是否掩盖了真实丢失；
2. 候选 B 把技术细节放进 inspector，`revealAll()` 是否真的等价于"审阅者手动展开"，
   而**不是**一种让探针通过的取巧；
3. Android 代表页只覆盖 Home 一个屏幕——是否足以支撑"Android 代表页"这一门槛，
   还是需要补一个 Room/Tools 屏。

## 7. 本机下一次动作

进入低成本等待：事件优先（UI-000 Review 完成 / Owner 裁决 / 新 eligible claim），
事件缺失时约 20 分钟兜底重扫。不 busy-poll，不为保持忙碌制造无价值提交（§9）。
