---
workbook_id: UI-102
phase: UI_CIVILIZATION
sequence: 102
execution_enabled: true
status: NOT_STARTED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["UI-000"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/UI-102/
---

# UI-102 — Android 产品壳与信息架构

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


## 双机领取与并发规则
- Development 与独立 Review 必须由不同实体主机完成。
- claim 后使用独立 branch/worktree；hosted CI、长测试、插件下载或截图批处理等待不独占主机。
- 未满足 dependencies 时不得“先做一半”等待；空闲主机改领同阶段其他合格任务。
- 普通组件任务不得直接合并 Utopia main；只有阶段冻结工作书拥有 merge authority。

## Reports / evolution
- City 只写有界 DEVELOPMENT_REPORT / REVIEW_REPORT。
- raw screenshot、浏览器 trace、Android 实机证据、失败重试留在 Utopia runtime/evidence；有研究价值的结构化事件按 PROCESS_DATA_POLICY 进入 evolution。
