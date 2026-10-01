---
workbook_id: UI-101
phase: UI_CIVILIZATION
sequence: 101
execution_enabled: true
status: REVIEW_IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["UI-000"]
development_host: Alien
development_claimed_at: 2026-10-01T13:04:09Z
development_branch: ui/UI-101-web-product-shell
development_baseline_sha: e7c498f5acd86da324a45c3278219c8daa612561
development_direction_source: UI-000 adopted direction C2 (head 2978e31), single visual-direction source per the UI-000 completion gate
development_head_sha: 56c819000548d9496ecb9fd2459f19d1ad9fcec1
development_ci: 36870347917-success-android-and-gateway-web
development_complete: true
development_report: mission-book/reports/UI-101/DEVELOPMENT_REPORT.md
development_correction_1: "CORRECTION to development_unverified, recorded 2026-10-01 after Mech's UI-101 review. That field attributed the failure to reach the confirmation and ambiguity Ask states to the ACCEPTANCE ENVIRONMENT ('no Room hub, no registered node, so triage sends everything to unmatched'). That attribution was WRONG, and it is withdrawn. Mech reproduced the behaviour in a full host and traced it to THIS HOST'S TEST INPUTS: services/dev-gateway/intents.mjs is a list of literal patterns with no rule for 'clean up my downloads folder' or 'open my notes', so both fell through to UNMATCHED and the instrument exercised UNMATCHED three times. Worse, the guard was `distinct.size < 2`, which three-of-four collapsing into one state happily satisfies - so the probe reported CLEAN while never reaching the states its own case names claimed. Mech repaired the inputs using triggers taken from the router itself and strengthened the guard to require a distinct presentation per case. Independently re-verified by Alien on 2c6e787: all four states now render distinctly (已就绪 / 需要你确认 / 请选择目标 / 没有匹配). Step 4 is therefore fully covered, and the environmental explanation is withdrawn rather than left standing."
development_open_followup: "UI-103's frontmatter records a pending_seam whose CONSUMER side is this task: apps/web terminal.js's room iframe must append ?embedded=1 to the hub URL - the Rooms side provides and verifies the mechanism, and apps/web is outside UI-103's boundary. UI-101 was declared Development-complete WITHOUT it, so this is a real in-scope gap and is NOT claimed as done here. It is deliberately NOT being applied while Mech holds this workbook's Review claim on head 56c8190: pushing it now would move the reviewed head mid-review, which is exactly the control-plane defect this host flagged when the same thing happened in the other direction during UI-000. Queued as a post-review delta on the same branch, which will then need its own delta re-verification per section 3. Noted for the reviewer: neither of this task's own probes covers iframe URL construction - they cover slug/lifecycle/event/action/ask leakage and contrast - so this seam currently has no automated coverage at all."
development_unverified: "Ask/Do four-state coverage is PARTIAL and is handed to the review host: this acceptance gateway has no Room hub and no registered node, so its triage resolves every input into the unmatched family. Observed: route-confirmed -> 已就绪 with 2 controls; needs-choice / ambiguous / unmatched -> 没有匹配 with the 16-control manual picker. The shell has distinct branches and controls for AWAITING_CONFIRMATION / AMBIGUOUS / UNMATCHED / result, but two states could not be TRIGGERED here, and untriggered is not verified. Also, the Action-detail screenshot was taken against FAILED demo rows because this environment has no successful action history. Both are environment limits rather than shell defects, recorded so the reviewer can retest with a Room hub rather than accept this as covered."
development_progress_note_4: "Fourth increment on 213a30d (repo suite 854/854, CI 36869603844 green). Added scripts/ui-101/ask-and-detail-shots.mjs, which drives the shell's own ask form through each Ask/Do state and opens an Action row. It found two more real leaks, both repaired: the Ask/Do surface rendered the raw protocol status as a badge (UNMATCHED / AMBIGUOUS / AWAITING_CONFIRMATION / MATCHED), now localised with four keys added to BOTH packs and the raw token kept only as the CSS class; and the Actions list printed the raw action id and route inline on every row, now folded into a run-details block. OPEN, recorded rather than scored as a pass: the probe still counts ONE raw UNMATCHED occurrence inside #view innerText for the ambiguous case, and this round did not localise which element emits it (a closed details block would be excluded from innerText, so it is on a rendered path). ALSO environmental and stated plainly: in this acceptance environment the gateway has no Room hub and no registered node, so every ask input is triaged into the unmatched family and action rows are FAILED demo entries; the four Ask states therefore cannot all be exercised here and the route-confirmed case has no marker to match. Step 4 is thus NOT yet verified to the completion gate, and step 8's advanced screenshot exists but was taken against demo rows. development_complete therefore stays FALSE."
development_progress_note_3: "Third increment on c7ef556 (repo suite 854/854, acceptance CLEAN, CI 36868813612 green). Step 3 done for Home: the statistic-tile row is gone and Home now opens with the ASSISTANT slot - clipped scanline frame with an edge light, ASSISTANT tag, SLOT 01, an identity block reading Unassigned/未指派 plus the four v2-invariant-4 fields that will be bound later (bound device / appearance / voice / duty), and copy stating plainly that it is a placeholder. Two deliberate calls recorded: the slot exposes NO control (a rendered control that does nothing is the false-affordance defect the UI-000 review already caught once, so configuration stays in Settings), and the portrait is an honest line-art silhouette because this repository has no character art. Below the slot Home answers what-is-happening first (runtime nodes + recent activity), then the room grid, then recent tasks. Seven assistant.* keys plus common.runDetails were added to BOTH locale packs. STILL TO DO: (step 4) Ask/Do state presentation not yet verified in this shell; (step 8) the Action-detail advanced panel screenshot is not captured yet."
development_progress_note_2: "Second increment on d282f57 (repo suite 854/854, acceptance CLEAN, CI green). Added scripts/ui-101/shell-shots.mjs, a real browser acceptance pass that pairs against a dev gateway and walks all nine shell pages at 1440 plus Home/Rooms/Devices at 390, asserting: no engineering chrome in EITHER locale, no banned glyph-as-icon, no raw internal vocabulary on a default path, no horizontal overflow, no page errors. That pass immediately caught four real leaks in the previously pushed increment, all now repaired: room slugs printed on Home and on the room grid; raw event vocabulary (CLIENT_CONNECTED, CITY_STARTED) on Home and Activity; the LOCAL_PRODUCT lifecycle token and slug on Rooms; and a surviving U+25A3 glyph node icon. Seven event-label keys plus common.runDetails were added to BOTH locale packs. One boundary recorded deliberately: the device DETAIL panel keeps the raw event type visible (events(list, raw=true)) because that panel IS the run-details destination, the same reasoning the UI-000 review used for advanced surfaces; tests/web-v02.test.mjs pins NODE_ONLINE there. NOTE the dev gateway needs CITY_TOKEN and CITY_NODE_TOKEN to start, which is what previously blocked the acceptance pass and is now solved. STILL TO DO: (step 3) Home is still stat tiles plus a room grid and needs the what-can-I-do-now rework and the assistant slot from the adopted direction; (step 4) Ask/Do state presentation not yet verified in this shell; (step 8) the Action-detail advanced panel screenshot is not captured yet."
development_progress_note: "IN PROGRESS, not complete. Done on b7da69a (repo suite 854/854, hosted CI green): apps/web/style.css rewritten as the shell design system carrying the SAME tokens as the reviewed UI-000 direction C2, including the AA-safe --ink-3 from Mech's review repair R-1 so the contrast fix is not lost downstream; the ASCII/Unicode glyph nav icon system removed from index.html (a UI-101 hard-rule violation) with the active item now marked by a lime rule; the Run control no longer uses a glyph as an icon; bilingual packs updated together for app.workspace/app.subtitle/app.reference/app.eyebrow so no engineering chrome survives in either locale. All ids, data-page values, classes and data-i18n attributes the app and tests depend on are preserved, including ask-form/ask-text/ask-submit as a real submitting form. STILL TO DO before development_complete may be set: (step 3) Home is still app.js card/stat blocks and needs the what-can-I-do-now rework plus the assistant slot from the adopted direction; (step 5) Action detail raw payloads are not folded by default yet; (step 8) the browser acceptance pass and its Home/Ask/Tools/Action-detail screenshots are not captured, and the completion gate requires them. The dev gateway refuses to start without separate control and node tokens, which is the next thing to wire for that pass."
review_host: Mech
review_claimed_at: 2026-10-01T14:20:00Z
review_basis: "independent review per CONSTRUCTION_RULES section 3; Alien is the Development host and therefore ineligible. Claim-time reconciliation passed: recorded branch == CI head_branch (ui/UI-101-web-product-shell), recorded head 56c819000548d9496ecb9fd2459f19d1ad9fcec1 == CI head_sha, run 36870347917 concluded success (android + gateway-web). Review must specifically retest, not assume, the area the Development host declared unverified: Ask/Do four-state coverage (two states could not be triggered in their environment) and the Action-detail capture (taken against FAILED demo rows)."
review_scope_handed_over: "development_unverified field on this workbook explicitly hands Ask/Do state coverage to the review host; per section 10 of CONSTRUCTION_RULES, untriggered is not verified and must not be scored as a pass."
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/UI-101/
---

# UI-101 — Web 产品壳与信息架构

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 本工作书只定义任务特有 scope / dependency / acceptance；通用 claim、等待/唤醒、CI、双机独立与 merge 规则以常驻规则书为准。

## 目标
把 \`apps/web/**\` 从固定侧栏 + dashboard cards + operator console 变成所选视觉方向下的个人万能终端 Web 壳。


### UI 硬规则
- 正常用户界面必须脱离 dashboard / admin / terminal / developer-console 视觉。
- 内部模块名、ID、route、backendRef、provenance、schema/version、runtime path 默认折叠到“高级信息/运行详情”。
- 禁止用大量同质圆角卡片堆叠代替信息架构。
- 禁止把 ASCII/Unicode 几何符号当作正式 icon system。
- 不得迁移 Web/Rooms 到 React/Vite/shadcn；Android 保持 Compose Material 3。
- 不得改变 Gateway / Action / Ask / Task / Room API / Scheduler 既有语义。
- Hns 可自主下载/安装/替换 UI/UX、Compose、浏览器、截图比较、accessibility、Agent Skill 类插件；插件默认只属于施工工具链，来源/ref 记录进报告，不得上传 secrets 或把未知插件变成生产 runtime 依赖。


## 允许修改边界
\`apps/web/**\` 的 HTML/CSS/JS presentation、i18n、纯前端 UI tests；必要时可新增 presentation adapter，但不得改变 gateway contract。

## 禁止修改边界
\`services/**\`、\`contracts/**\`、scheduler/provider/runtime 语义；不得为了 UI 方便改后端返回值。

## 施工步骤
1. 把一级用户导航收口到 Home / Ask·Do / Tools / Devices / Activity；Settings/Advanced/Diagnostics 降级。
2. 删除默认产品表面上的 \`WORKSPACE / ALIEN\`、\`CONTROL SURFACE\` 等工程标题。
3. Home 以“现在能做什么/正在发生什么”为主，而不是统计卡片。
4. Ask/Do 成为自然语言主入口，并有清晰的 working / needs-choice / unavailable / complete 表现。
5. Action 详情的 backendRef/provenance/raw record 默认折叠。
6. 保留全部既有可达能力；没有功能因为“美化”消失。
7. 建立可复用 Web design tokens/components，不用 CSS 一页一页硬补。
8. 用真实浏览器覆盖桌面与窄屏，截图至少包括 Home / Ask / Tools / Action detail advanced。

## 独立复核
另一台主机用真实浏览器检查信息层级、键盘/焦点、窄屏、错误态、offline、长文本以及是否仍像管理后台，并直接修复 in-scope 问题。

## 完成门槛
- 旧功能路径全部可达；
- 一级导航已产品化；
- raw technical details 默认隐藏但可展开；
- 无明显 dashboard/card-stack 主导；
- 浏览器验收 + repo tests + hosted CI 全绿；
- 视觉与 UI-000 Owner 选择一致。


## 绑定常驻规则
本任务继承 [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)。特别是：同任务 Development/Review 不得同主机；等待不独占主机；零领取必须分类；`WAITING_ELIGIBILITY` 事件唤醒优先、约 20 分钟兜底重扫；外部恢复后必须 reconciliation；CI/evidence 必须绑定 exact head；不得制造假工作或擅自扩大范围。

## Reports / evolution
- City 只写有界 DEVELOPMENT_REPORT / REVIEW_REPORT。
- raw screenshot、浏览器 trace、Android 实机证据、失败重试留在 Utopia runtime/evidence；有研究价值的结构化事件按 PROCESS_DATA_POLICY 进入 evolution。
