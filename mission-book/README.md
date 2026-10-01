# Mission Book — 当前双机并发施工计划

> 当前模式：**UI 文明化 → 再调度 vNext → UI/调度最终接线**
> 当前活跃工程：**UI_CIVILIZATION**
> 后续工程：**RESCHEDULING_VNEXT（锁定）**、**UI_SCHEDULER_INTEGRATION（锁定）**
> 控制仓库：zhiheng-zhang-Mera/Digital-City
> 实现仓库：zhiheng-zhang-Mera/Utopia
> 可用实体施工主机：**Alien + Mech**
> UI 第一阶段基线：Utopia \`main @ e7c498f5acd86da324a45c3278219c8daa612561\`
> 历史完成任务与旧看板：[finished/completed-2026-10-01/](./finished/completed-2026-10-01/)
> 过程数据规则：[PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md)
>
> 上一轮 Butler Assistant / Remote Fabric / General AI Gateway / Engineering Manager 共 41 个组件任务及其合并工程已经全部完成。旧任务、旧 reports、旧 PROGRAMME_STATE / MISSION_INDEX / cross-programme contract / recovery workbooks / Owner response 已从当前施工面移入 \`finished\`，不得再作为新施工的活跃任务源。

## 当前施工看板

**规范规则：** README 保持为人工可读施工看板；每份工作书 frontmatter 是该任务领取/完成事实源。普通任务领取不得为了“刷新看板”反复修改 README。阶段性冻结、合并和 Owner 审美门禁通过后再统一更新本表。

| 工程项目 | 任务池 | 施工 | 独立复核 | 合并 / 下一阶段 |
|---|---|---:|---:|---|
| UI 文明化 | UI-000, UI-101..103, UI-190 | **0/5** | **0/5** | **ACTIVE** — 先做 UI-000，Owner 只选视觉方向 |
| 再调度 vNext | RS-201..203, RS-290 | **锁定** | **锁定** | UI-190 冻结 \`UI_BASELINE_FROZEN\` 后自动解锁 |
| UI × 调度接线 | UXI-301, UXI-390 | **锁定** | **锁定** | RS-290 冻结 \`RESCHEDULING_BASELINE_FROZEN\` 后自动解锁 |

默认双机起步：
- UI-000：一台主机生成 3 套真实候选，另一台主机做独立视觉/功能批判；只在候选 ready 后叫 Owner 选择 A / B / C。
- Owner 选定后：Alien 优先领取 UI-101（Web），Mech 优先领取 UI-102（Android）；先空闲的合格主机继续领取 UI-103（Rooms）。
- UI-190 必须由没有独占前三项实现工作的另一台主机主导独立审查，完成自动返修循环后再提交 Owner 最终“好看 / 不好看”门禁。
- hosted CI、长测试、截图批处理或插件下载等待都不独占主机；无冲突时继续领取下一项。

## 0. 当前基础门禁 — UI 优先

本轮不是继续堆功能。第一目标是把 Utopia 从“验收控制台 / 工程面板”转成真正可日常使用的**个人万能终端产品界面**。

当前已确认事实：
1. Web 是原生 HTML + CSS + JavaScript，不迁 React/Vite/shadcn。
2. Android 是 Kotlin + Jetpack Compose Material 3，保留原生 Compose。
3. Rooms 是原生 HTML/CSS/JS，继续复用 Room Hub 与房间共享组件。
4. Gateway / Action / Ask / Task / Room API / Remote / Provider / Scheduler 的现有业务语义在 UI 第一阶段全部视为只读契约。
5. UI 第一阶段做到约 70–80%：冻结视觉语言、信息架构、导航和核心组件；等待再调度契约稳定后补最后的调度交互。

## 1. UI 核心不变量 — 必须完全脱离“工程化”

本节是硬约束，不是建议。

### 1.1 禁止的默认产品形态
正常用户界面不得再以以下视觉或信息形态作为主语言：
- 运维 dashboard、监控大盘、developer console、terminal、admin panel；
- 大量同质白色圆角卡片堆叠成页面；
- 9 个或更多一级导航项；
- 以 \`Services / Tasks / Actions / Pairing / Provider / Scheduler / Registry\` 等内部模块树直接充当用户导航；
- 以 \`actionId / backendRef / route / provenance / schemaVersion / runtime path / 127.0.0.1\` 等工程字段作为默认正文；
- \`WORKSPACE / ALIEN\`、\`CONTROL SURFACE\`、\`LOCAL · 127.0.0.1\` 等验收语汇作为产品主标题；
- 把 monospace、全大写高字距、黑底青色“开发者工具感”当作默认视觉；
- 用 ASCII/Unicode 几何符号临时代替完整 icon language；
- 为了“有设计感”擅自引入新的产品框架或重写业务层。

### 1.2 目标产品语言
默认界面必须从“系统有什么模块”改成“用户想做什么”：
- **Home**：个人终端入口、近期重要状态、自然语言入口；
- **Ask / Do**：主交互入口；
- **Tools**：用户可理解的个人工具集合；
- **Devices**：设备关系与必要状态；
- **Activity**：用户真正需要回看的执行结果/历史；
- Settings / Advanced / Diagnostics 不占一级主导航。

技术细节继续保留，但默认折叠在 **高级信息 / 运行详情 / Diagnostics** 中。隐藏技术细节绝不等于修改 backend truth。

### 1.3 设计目标
设计方向应接近“消费级个人 OS / ambient AI assistant / personal terminal”，强调：
- 清晰、克制、亲和、可长期日用；
- 主操作强、信息密度有层次；
- 跨 Web / Android / Rooms 是同一个产品；
- 允许有 Utopia 自己的辨识度，但不得照抄特定商业产品；
- 不得因为“系统能力复杂”就回退为工程控制台。

## 2. 工作模型：施工 → 独立复核 → 阶段冻结

每个代码工作书都有两个角色：
- **施工（Development）**：完成有界实现、真实运行和基础测试；
- **独立复核（Review/Correction）**：由另一台实体主机检查视觉、交互、功能回归和越界，并直接修复本任务范围内的问题。

同一任务施工主机与复核主机必须不同。复核不是只写报告。

只有阶段冻结任务允许把该阶段的组件分支集合合并进 Utopia main：
- UI 阶段：UI-190；
- 再调度阶段：RS-290；
- 最终接线阶段：UXI-390。

## 3. Owner 最小人工干预规则

Owner 本轮只保留两个正常人工门禁：
1. **视觉方向门禁**：UI-000 给出 3 套差异足够大的真实候选，Owner 只需选 A / B / C（或一句“都不好看”）。
2. **最终视觉门禁**：UXI-390 提交最终 Web / Android / Rooms 截图与实机证据，Owner 只需回复“好看 / 不好看 + 一句原因”。

除非涉及以下硬边界，不得把字体、颜色、间距、图标、阴影、导航细节、组件形态、动效、响应式等普通设计决策升级成 Owner Decision：
- 删除现有用户功能；
- 改变 API / protocol / DTO / 状态语义；
- 引入生产运行时高风险依赖；
- 需要 secrets / 新付费账户 / 不可逆外部动作；
- 存在真正的产品能力取舍而非单纯审美选择。

## 4. Hns 插件 / Skill 自主权

**UI 相关工作允许 Hns 自主额外下载、安装、切换和卸载插件或 Agent Skill，无需逐个请求 Owner。**

允许用途：
- UI/UX 设计与审查；
- Web 原生前端设计；
- Jetpack Compose / Material 3；
- screenshot / visual regression / browser automation；
- accessibility；
- design token / icon / typography 辅助；
- 将通用 \`SKILL.md\` 导入 Hns 的 skill importer。

约束：
1. 优先公共、可审计来源；在报告中记录插件名称、来源、版本/ref。
2. 插件属于**施工工具链**，默认不得因此把新框架或插件 runtime 塞进 Utopia 产品依赖。
3. 不得为插件上传 secrets、token、私有代码到未知第三方 SaaS。
4. 插件失效、质量差或与仓库冲突时直接替换，不等待 Owner。
5. UI Agent 可以使用多插件交叉审查，但最终提交必须能由仓库正常工具链构建、测试和运行。

## 5. 双机异步 / 不空等规则

全局领取优先级：
1. 修复自己当前任务的明确红项；
2. 领取由另一台主机完成、且依赖满足的独立复核；
3. 领取同阶段任何未领取的可并发施工任务；
4. 若所有可做项都在 hosted CI / 长测试 / 外部等待，则保留原 claim，同时用独立 worktree 继续另一个不冲突任务；
5. 只有扫描当前阶段后确实没有可执行项才允许 PARKED。

不得因为另一个 programme 尚未完成就无条件等待。依赖只锁真正依赖的工作书。

## 6. UI 阶段工作书

目录：[ui-civilization/](./ui-civilization/)

| ID | 工作书 | 依赖 | 结果 |
|---|---|---|---|
| UI-000 | [视觉方向候选与审美门禁](./ui-civilization/UI-000-视觉方向候选与审美门禁.md) | 无 | 3 套真实候选 + Owner 选择 |
| UI-101 | [Web 产品壳与信息架构](./ui-civilization/UI-101-Web产品壳与信息架构.md) | UI-000 | 非工程化 Web 壳 |
| UI-102 | [Android 产品壳与信息架构](./ui-civilization/UI-102-Android产品壳与信息架构.md) | UI-000 | 非工程化 Compose 壳 |
| UI-103 | [Rooms 统一视觉与嵌入体验](./ui-civilization/UI-103-Rooms统一视觉与嵌入体验.md) | UI-000 | Rooms 与主产品统一 |
| UI-190 | [跨端视觉审查与 UI 基线冻结](./ui-civilization/UI-190-跨端视觉审查与UI基线冻结.md) | UI-101..103 | \`UI_BASELINE_FROZEN\` |

UI-190 通过后，UI 第一阶段停止继续“精修到 100%”，转入再调度工程。

## 7. 再调度 vNext 工作书

目录：[rescheduling-vnext/](./rescheduling-vnext/)

只有 \`UI_BASELINE_FROZEN\` 后才解锁。

| ID | 工作书 | 依赖 | 结果 |
|---|---|---|---|
| RS-201 | [动态 AI 池与可用性选择](./rescheduling-vnext/RS-201-动态AI池与可用性选择.md) | UI-190 | provider/model/account 动态池与 availability |
| RS-202 | [多设备并发感知与再调度](./rescheduling-vnext/RS-202-多设备并发感知与再调度.md) | UI-190 | 设备/会话压力感知与调度 |
| RS-203 | [跨设备执行回传与降级恢复](./rescheduling-vnext/RS-203-跨设备执行回传与降级恢复.md) | RS-201, RS-202 | handoff/result-return/fallback |
| RS-290 | [调度契约回归与基线冻结](./rescheduling-vnext/RS-290-调度契约回归与基线冻结.md) | RS-201..203 | \`RESCHEDULING_BASELINE_FROZEN\` |

这一阶段禁止自行设计最终用户 UI，只定义并验证真实状态、选择动作、回传和降级语义。

## 8. UI × 调度最终接线

目录：[ui-integration/](./ui-integration/)

| ID | 工作书 | 依赖 | 结果 |
|---|---|---|---|
| UXI-301 | [调度状态接入非工程化 UI](./ui-integration/UXI-301-调度状态接入非工程化UI.md) | UI-190, RS-290 | ViewModel/adapter + 用户语言 |
| UXI-390 | [双机最终产品验收与收口](./ui-integration/UXI-390-双机最终产品验收与收口.md) | UXI-301 | 功能/视觉全通过 + Owner 最终审美门禁 |

## 9. 完成门槛

所有任务至少要求：
- 业务语义不被表现层重写；
- 相关自动测试通过；
- Web 使用真实浏览器验收；
- Android 使用 Compose 构建和至少一台 Android 实机验收（涉及 Android 时）；
- UI 任务有截图/视觉证据；
- 施工与独立复核由不同实体主机完成；
- hosted CI 必须绿；
- reports 写入当前 [reports/](./reports/)；
- 有价值的施工过程按 [PROCESS_DATA_POLICY.md](./PROCESS_DATA_POLICY.md) 回流 Utopia evolution evidence，不把无界 raw log 堆进 City。

## 10. 合并与阶段切换规则

- UI-101/102/103、RS-201/202/203、UXI-301 都不得直接抢先合并 Utopia main。
- UI-190 / RS-290 / UXI-390 分别负责本阶段 union、冲突修复、最终相关测试、hosted CI 和 main 合并。
- 每次阶段合并必须从当时最新 Utopia main 刷新，不能回退或覆盖其他已接受工作。
- \`UI_BASELINE_FROZEN\` 只代表产品壳、信息架构与设计系统冻结，不代表调度 UI 已完工。
- \`RESCHEDULING_BASELINE_FROZEN\` 只代表调度语义稳定，不允许把内部状态直接裸露进产品 UI。
- 最终目标状态：\`UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED\`。
