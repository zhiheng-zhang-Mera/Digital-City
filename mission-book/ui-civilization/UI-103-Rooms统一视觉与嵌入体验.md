---
workbook_id: UI-103
phase: UI_CIVILIZATION
sequence: 103
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
report_path: mission-book/reports/UI-103/
---

# UI-103 — Rooms 统一视觉与嵌入体验

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


## 双机领取与并发规则
- Development 与独立 Review 必须由不同实体主机完成。
- claim 后使用独立 branch/worktree；hosted CI、长测试、插件下载或截图批处理等待不独占主机。
- 未满足 dependencies 时不得“先做一半”等待；空闲主机改领同阶段其他合格任务。
- 普通组件任务不得直接合并 Utopia main；只有阶段冻结工作书拥有 merge authority。

## Reports / evolution
- City 只写有界 DEVELOPMENT_REPORT / REVIEW_REPORT。
- raw screenshot、浏览器 trace、Android 实机证据、失败重试留在 Utopia runtime/evidence；有研究价值的结构化事件按 PROCESS_DATA_POLICY 进入 evolution。
