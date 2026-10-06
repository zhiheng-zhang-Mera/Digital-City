---
workbook_id: UI-103
phase: UI_CIVILIZATION
sequence: 103
execution_enabled: true
status: REVIEW_COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
baseline_sha: e7c498f5acd86da324a45c3278219c8daa612561
visual_direction_source: "mission-book/reports/UI-000/OWNER_STYLE_RULING.md — adopted direction C2, head aea8361c07c003f6f519829b6c1a208c20bccab1, MEASURED head after Mech's review repairs 2978e311959cffee40a172d0ea36e370e8ac59e7"
dependencies: ["UI-000"]
development_host: Mech
development_claimed_at: 2026-10-01T13:20:00Z
development_branch: ui/UI-103-rooms-visual-unification
development_head_sha: 399a1c118fa0016e7f30ce8f0e3ba01917b39db1
development_ci: 36866763373-success-android-and-gateway-web
development_complete: true
development_report: mission-book/reports/UI-103/DEVELOPMENT_REPORT.md
development_evidence: evidence/raw/mission-book/UI-103/
pending_seam: "apps/web terminal.js's room iframe must append ?embedded=1 to the hub URL; the Rooms side provides and verifies the mechanism, the consumer side belongs to UI-101 (apps/web is outside UI-103's boundary). deferred != passed."
review_host: Alien
review_claimed_at: 2026-10-01T13:43:48Z
review_head_sha: dcde3afe958577a470ee6a0e6f08e819c9d0d19f
review_ci: 36871415675-success-android-and-gateway-web
review_reviewed_head_sha: 399a1c118fa0016e7f30ce8f0e3ba01917b39db1
review_complete: true
review_report: mission-book/reports/UI-103/REVIEW_REPORT.md
review_result: "PASS, no repairs needed. Alien's own probe (scripts/ui-103/review-alien-probe.mjs, deliberately not a rewrite of the author's verify-hub.mjs) found: all ten rooms mount real content and controls (23-58 nodes, 4-21 controls), ZERO WCAG AA contrast failures computed over every rendered text node, no dev-tool copy on the default path, no banned glyph-as-icon, no horizontal overflow at 1440 or at 390 on three sampled rooms, no page errors. Repo suite 854/854 and rooms suite 69/69 on the frontmatter head, CI 36871415675 green. Recorded methodology finding: the probe's first run reported leaks on every room, which was WRONG - a stale apps/rooms/hub/server.mjs from an earlier session still held port 4320 so the probe read a different build; the process was identified and killed, the hub restarted from the review worktree, and the served stylesheet content-checked for the C2 tokens before any result was accepted. The pending_seam above remains OUTSIDE this review: its consumer side is apps/web, i.e. UI-101, and is not endorsed here."
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/UI-103/
---

# UI-103 — Rooms 统一视觉与嵌入体验

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../../../CONSTRUCTION_RULES.md)
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../../../PROCESS_DATA_POLICY.md)
> 本工作书只定义任务特有 scope / dependency / acceptance；通用 claim、等待/唤醒、CI、双机独立与 merge 规则以常驻规则书为准。

## 目标
让 Room Hub 和十个 Rooms 看起来属于 Utopia 本体，而不是突然嵌入一套黑底 cyan 的本地开发工具。


### UI 硬规则
- 正常用户界面必须脱离 dashboard / admin / terminal / developer-console 视觉。
- 内部模块名、ID、route、backendRef、provenance、schema/version、runtime path 默认折叠到“高级信息/运行详情”。
- 禁止用大量同质圆角卡片堆叠代替信息架构。
- 禁止把 ASCII/Unicode 几何符号当作正式 icon system。
- 不得迁移 Web/Rooms 到 React/Vite/shadcn；Android 保持 Compose Material 3。
- 不得改变 Gateway / Action / Ask / Task / Room API / Scheduler 既有语义。
- Hns 可自主下载/安装/替换 UI/UX、Compose、浏览器、截图比较、accessibility、Agent Skill 类插件；插件默认只属于施工工具链，来源/ref 记录进报告，不得上传 secrets 或把未知插件变成生产 runtime 依赖。


## 允许修改边界
\`apps/rooms/**\` presentation：Hub shell、共享 CSS/tokens、client UI markup；Room API、store、数据语义不得变化。

## 禁止修改边界
- 不改变 Room persistence/API；
- 不逐个房间复制一套独立 CSS；
- 不把 \`LOCAL · 127.0.0.1\`、runtime 文件路径当作默认产品信息；
- 不为了与 Web 对齐引入前端 framework。

## 施工步骤
1. 抽取与 UI-000 视觉方向一致的 Rooms design tokens。
2. 重做 Hub shell：导航、标题、状态、Room 内容区域与主 Utopia 一致。
3. 选择 Knowledge Room 作为代表房间先完成高质量 pilot，再把共享 primitives 推广到其余 Rooms。
4. 保留 Room 各自的任务特性，不强行把所有房间变成相同卡片。
5. Web iframe 嵌入时减少“另一个产品”的断裂感；独立新标签打开也必须完整。
6. local/debug 信息放 Advanced/Diagnostics。
7. 真实浏览器覆盖至少 Knowledge、Checklist、Data Lab、Focus 四种不同交互形态。

## 独立复核
另一台主机检查共享样式是否破坏任一 Room、长列表/表格/textarea、深浅背景、iframe scroll、local-only 安全提示是否仍可发现但不喧宾夺主。

## 完成门槛
- Hub 与 Web/Android 视觉语言一致；
- 代表性四类 Room 无严重回归；
- 十个 Room 基础测试全绿；
- 正常界面不再呈现开发工具风；
- hosted CI / Room tests 全绿。


## 绑定常驻规则
本任务继承 [../CONSTRUCTION_RULES.md](../../../CONSTRUCTION_RULES.md)。特别是：同任务 Development/Review 不得同主机；等待不独占主机；零领取必须分类；`WAITING_ELIGIBILITY` 事件唤醒优先、约 20 分钟兜底重扫；外部恢复后必须 reconciliation；CI/evidence 必须绑定 exact head；不得制造假工作或擅自扩大范围。

## Reports / evolution
- City 只写有界 DEVELOPMENT_REPORT / REVIEW_REPORT。
- raw screenshot、浏览器 trace、Android 实机证据、失败重试留在 Utopia runtime/evidence；有研究价值的结构化事件按 PROCESS_DATA_POLICY 进入 evolution。


[阅读译本 / Reading translation](./en/UI-103-Rooms统一视觉与嵌入体验.md)
