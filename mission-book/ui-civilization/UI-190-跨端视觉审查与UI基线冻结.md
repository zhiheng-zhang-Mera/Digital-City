---
workbook_id: UI-190
phase: UI_CIVILIZATION
sequence: 190
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["UI-101", "UI-102", "UI-103"]
development_host: Alien
development_claimed_at: 2026-10-01T16:02:00Z
development_branch: ui/UI-190-ui-baseline-freeze
development_baseline_sha: e7c498f5acd86da324a45c3278219c8daa612561
development_direction_source: UI-000 adopted direction C2; the three component branches ui/UI-101-web-product-shell (aafff56), ui/UI-102-android-product-shell (ed4a663) and ui/UI-103-rooms-visual-unification (dcde3af) are the inputs this task integrates and freezes
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: FINAL_VISUAL_PREVIEW
merge_authority: true
report_path: mission-book/reports/UI-190/
---

# UI-190 — 跨端视觉审查与 UI 基线冻结

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 本工作书只定义任务特有 scope / dependency / acceptance；通用 claim、等待/唤醒、CI、双机独立与 merge 规则以常驻规则书为准。

## 目标
集成 UI-101/102/103，做跨端独立 UI Critic 循环、功能回归和阶段冻结。这里冻结的是“产品壳 + 信息架构 + design system”，不是最终调度交互。


### UI 硬规则
- 正常用户界面必须脱离 dashboard / admin / terminal / developer-console 视觉。
- 内部模块名、ID、route、backendRef、provenance、schema/version、runtime path 默认折叠到“高级信息/运行详情”。
- 禁止用大量同质圆角卡片堆叠代替信息架构。
- 禁止把 ASCII/Unicode 几何符号当作正式 icon system。
- 不得迁移 Web/Rooms 到 React/Vite/shadcn；Android 保持 Compose Material 3。
- 不得改变 Gateway / Action / Ask / Task / Room API / Scheduler 既有语义。
- Hns 可自主下载/安装/替换 UI/UX、Compose、浏览器、截图比较、accessibility、Agent Skill 类插件；插件默认只属于施工工具链，来源/ref 记录进报告，不得上传 secrets 或把未知插件变成生产 runtime 依赖。


## 施工步骤
1. 从当时最新 Utopia main 建 integration branch，合入三个已 review 的 UI 分支，冲突取功能与表现的显式合集。
2. 统一 token、术语、icon、状态色、spacing，不允许 Web/Android/Rooms 各自成为三个品牌。
3. 至少执行两轮“截图 → 独立 critic → 自动修复 → 再截图”；同一上下文不得既给最终视觉评分又无条件接受自己的实现。
4. Critic 必查：dashboard 感、卡片堆叠、技术术语泄漏、一级导航过载、主操作不清、跨端视觉断裂、移动拥挤、accessibility。
5. 回归现有 Ask/Action/Rooms/Devices/Services/Tasks/Activity/Pairing/Settings 功能可达性。
6. Web 真实浏览器 + Android 实机 + Room representative screenshots。
7. 只有 critic 达标后才向 Owner 交付精简视觉包；此处 Owner 可给方向性“好看/不好看”意见，但阶段原则上不要求把 UI 精修到最终 100%。
8. 通过后 merge Utopia main，记录精确 SHA/CI，标记 \`UI_BASELINE_FROZEN\`，自动解锁 RS-201/202。

## 完成门槛
- UI-101..103 全部 Development+Review complete；
- 两轮以上独立视觉修复；
- 所有关键旧功能仍可达；
- Web/Android/Rooms 形成统一 design contract；
- repo/Android/Rooms/相关 CI 全绿；
- main 合并成功且 main CI 绿；
- 阶段标记 \`UI_BASELINE_FROZEN\`。


## 绑定常驻规则
本任务继承 [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)。特别是：同任务 Development/Review 不得同主机；等待不独占主机；零领取必须分类；`WAITING_ELIGIBILITY` 事件唤醒优先、约 20 分钟兜底重扫；外部恢复后必须 reconciliation；CI/evidence 必须绑定 exact head；不得制造假工作或擅自扩大范围。

## Reports / evolution
- City 只写有界 DEVELOPMENT_REPORT / REVIEW_REPORT。
- raw screenshot、浏览器 trace、Android 实机证据、失败重试留在 Utopia runtime/evidence；有研究价值的结构化事件按 PROCESS_DATA_POLICY 进入 evolution。
