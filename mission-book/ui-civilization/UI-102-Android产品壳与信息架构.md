---
workbook_id: UI-102
phase: UI_CIVILIZATION
sequence: 102
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
baseline_sha: e7c498f5acd86da324a45c3278219c8daa612561
visual_direction_source: "mission-book/reports/UI-000/OWNER_STYLE_RULING.md — adopted direction C2; Web/Compose register reference is the reviewed head 2978e311959cffee40a172d0ea36e370e8ac59e7 and the Rooms port 399a1c118fa0016e7f30ce8f0e3ba01917b39db1"
dependencies: ["UI-000"]
development_host: Mech
development_claimed_at: 2026-10-01T13:52:00Z
development_branch: ui/UI-102-android-product-shell
development_head_sha: 84b0910507c60fd705fb5a689764d903de6a3398
development_ci: 36872755993-success-android-and-gateway-web
development_complete: false
development_report: mission-book/reports/UI-102/DEVELOPMENT_REPORT.md
development_evidence: evidence/raw/mission-book/UI-102/
development_evidence_notes: mission-book/reports/UI-102/E2E_VERIFICATION_NOTES.md
development_progress_note_3: "INCREMENT 3 on 84b0910 (CI 36872755993 green). Made the folding testable and finished the colour migration. Extracted the technical-row builders into pure internal functions (actionTechnicalRows, actionSummaryTechnicalRows, askTechnicalRows, targetTechnicalRows) so tests assert against exactly what the screen renders; added TechnicalFoldingTest (5 JVM tests, module total 50 -> 55) pinning the reachability half of the hard rule - every internal value must still be produced when populated, and a sparse record must not fabricate the blocks it lacks. The test immediately caught a real gap: askTechnicalRows folded only the router LABEL, not the raw router token; both are folded now. Hardcoded Color(0x..) literals across the module are now ZERO outside the theme file (19 -> 0). ENVIRONMENT LIMIT RECORDED: the Compose UI test recommended last round CANNOT be built here - ui-test-junit4 and androidx.test are absent from the offline Gradle cache - so the collapse behaviour is asserted only by construction (one shared component, collapsed by default). STILL REMAINING: several screens still use the generic Panel rather than the semantic components; the folded panels have NOT been screenshotted on a device; narrow-width and font-scale acceptance; Web truth-parity. NOT a completion claim."
development_progress: "INCREMENT 2 of N landed (heads: 9b97fa1 design system + five-entry bar; 9965af5 component layer + technical folding). Increment 2 added ui/UtopiaComponents.kt (the workbook's step 3: UtLabel, UtPanel, HeroBlock, StatusChip, ToolRow, ActivityRow, DeviceSurface, UtEmptyState, UtFeedback, TechnicalDetails), folded every internal identifier in Actions and Ask into a collapsed 运行详情, and migrated their colours to theme roles."
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/UI-102/
---

# UI-102 — Android 产品壳与信息架构

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 本工作书只定义任务特有 scope / dependency / acceptance；通用 claim、等待/唤醒、CI、双机独立与 merge 规则以常驻规则书为准。

## 目标
把 Android 当前“9 项 NavigationBar + 万能 Panel + Text 列表”改造成真正的移动个人终端，同时保持 Kotlin/Compose/Material 3。


### UI 硬规则
- 正常用户界面必须脱离 dashboard / admin / terminal / developer-console 视觉。
- 内部模块名、ID、route、backendRef、provenance、schema/version、runtime path 默认折叠到“高级信息/运行详情”。
- 禁止用大量同质圆角卡片堆叠代替信息架构。
- 禁止把 ASCII/Unicode 几何符号当作正式 icon system。
- 不得迁移 Web/Rooms 到 React/Vite/shadcn；Android 保持 Compose Material 3。
- 不得改变 Gateway / Action / Ask / Task / Room API / Scheduler 既有语义。
- Hns 可自主下载/安装/替换 UI/UX、Compose、浏览器、截图比较、accessibility、Agent Skill 类插件；插件默认只属于施工工具链，来源/ref 记录进报告，不得上传 secrets 或把未知插件变成生产 runtime 依赖。


## 允许修改边界
\`apps/android/**\` 中 Compose presentation、theme、icons/resources、UI state adapter 和 UI tests；CityClient/DTO 只能为 presentation adapter 做不改变语义的读取整理。

## 禁止修改边界
- 不改 gateway 行为；
- 不把 status/route 在客户端重新推导；
- 不用新 cross-platform framework；
- 不因设计需要删除 Rooms/Actions/Services/Tasks 等现有功能入口。

## 施工步骤
1. 把 9 项底部导航收口为适合手机的 3–5 个主入口；高级功能进入二级/overflow/详情。
2. 建立真正的 Utopia MaterialTheme：ColorScheme、Typography、Shapes、Spacing、Icon language。
3. 拆掉“所有内容都是 Panel”的单一语法，建立少量语义组件，如 hero、tool row、activity row、status chip、device surface、technical details。
4. Home / Ask / Tools 为重点；Devices/Activity 保留清晰入口。
5. Action/Ask 中工程字段默认放进 expandable technical details。
6. 覆盖 loading / offline / unavailable / confirmation / ambiguity / success / failure。
7. 用 Android Studio + 至少一台 Android 实机做 portrait 主验收，并检查常见窄屏/字体缩放。

## 独立复核
另一台主机重点找：底栏溢出、文本拥挤、点击区、IME、旋转/重组状态、Material 默认模板感、信息重复、长 ID 泄漏、真实设备可读性。

## 完成门槛
- 正常用户不再面对 9 个一级入口；
- 主操作在手机一眼可见；
- Compose theme/component hierarchy 建立；
- 真实设备截图不呈现工程控制台气质；
- Android unit/build + hosted CI 全绿；
- 功能/状态 truth 与 Web 保持一致。


## 绑定常驻规则
本任务继承 [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)。特别是：同任务 Development/Review 不得同主机；等待不独占主机；零领取必须分类；`WAITING_ELIGIBILITY` 事件唤醒优先、约 20 分钟兜底重扫；外部恢复后必须 reconciliation；CI/evidence 必须绑定 exact head；不得制造假工作或擅自扩大范围。

## Reports / evolution
- City 只写有界 DEVELOPMENT_REPORT / REVIEW_REPORT。
- raw screenshot、浏览器 trace、Android 实机证据、失败重试留在 Utopia runtime/evidence；有研究价值的结构化事件按 PROCESS_DATA_POLICY 进入 evolution。
