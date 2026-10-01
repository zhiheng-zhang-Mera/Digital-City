---
workbook_id: UI-101
phase: UI_CIVILIZATION
sequence: 101
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["UI-000"]
development_host: Alien
development_claimed_at: 2026-10-01T13:04:09Z
development_branch: ui/UI-101-web-product-shell
development_baseline_sha: e7c498f5acd86da324a45c3278219c8daa612561
development_direction_source: UI-000 adopted direction C2 (head 2978e31), single visual-direction source per the UI-000 completion gate
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
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
