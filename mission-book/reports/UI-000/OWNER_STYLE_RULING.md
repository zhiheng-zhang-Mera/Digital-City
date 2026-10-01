# UI-000 — Owner 视觉方向裁决（2026-10-01，Host `Alien` 记录）

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)
> 本文件是工作书 `owner_gate: STYLE_SELECTION` 的**裁决记录**，也是 UI-101..103 的唯一视觉方向来源。
> 裁决由 Owner 直接以自然语言下达，Alien 逐句记录，不改写、不扩写。

## 1. Owner 原话（逐字）

> 「UI按照C的风格主题但是不要大卡片配少量内容，可以稍微紧凑一些，保留B版的简洁。模拟类似明日方舟/崩坏3的游戏式UI，然后再生成一批对比图集。」

## 2. 拆解为可施工条款

| # | 条款 | 类型 | Alien 的落地解释 |
| --- | --- | --- | --- |
| R-1 | **以候选 C 的风格主题为基底** | 保留 | 保留 C 的暗色舞台 + 紫罗兰结构色 + 荧光绿信号色（`--void #08070f` / `--violet #8b5cf6` / `--lime #c6f24e`），保留 C 的导航模型（顶部 4 个主面 + 「后台」进入 advanced 面的二级条）与 Ask 聚光形态 |
| R-2 | **不要大卡片配少量内容** | 移除 | 删除 Home 的 4 张不等大卡片（`.deck` / `.panel-hero/tall/wide/std`）与 Tools 的 10 张海报（`.ribbon` / `.poster-xl/lg`）。改为紧凑 HUD 网格：Home 变成 4/4/4 + 12 栏的信息板，Tools 变成 `minmax(178px,1fr)` 的工具栅格 |
| R-3 | **稍微紧凑一些** | 收紧 | 圆角 22px→0（改为切角 `clip-path`），面板内边距 24/26→12/14，行高与字号整体下调，主标题 `clamp(38px,6.2vw,68px)`→`clamp(23px,3vw,34px)`，卡片间距 16→8 |
| R-4 | **保留 B 版的简洁** | 引入 | 采用 B 的高信息密度表达：`key/value` 定义列表、单行账本式动态条 `beats`、`list-table` 行、表格式对齐的数字（`font-variant-numeric: tabular-nums`）。一句一义，不做装饰性排版 |
| R-5 | **模拟明日方舟 / 崩坏3 的游戏式 UI** | 新增 | 切角面板 + 角标定位括号、细描边与发丝分隔线、大写宽字距微标签、分段式（segmented）进度条、菱形信号点、状态斜角 tag、HUD 背板斜纹。**不使用任何 ASCII/Unicode 几何字符当图标**（UI-000 硬规则）；菱形/角标一律用 CSS 盒绘制 |
| R-6 | **再生成一批对比图集** | 交付 | 见 §4 |

## 3. 明确未授权的内容（本次不做）

- 不改业务语义：Gateway / Action / Ask / Task / Room API / Scheduler 一律不动；
- 不迁框架：Web/Rooms 继续 Vanilla HTML/CSS/JS，Android 继续 Compose Material 3；
- 不把候选面并进生产 `apps/web/**`——那属 UI-101..103；
- 不代 Owner 决定 A/B 的取舍：Owner 已明确方向落在 C 基底，A/B 作为对照保留。

## 4. 交付与验证

- 施工分支：`ui/UI-000-visual-direction-candidates`，`c/` 候选原位改造（C 基底 → C′）。
- 图集：`D:\UI-000-candidates-v2\`，含新方向全套渲染与「旧 C ↔ 新 C′ ↔ B」对比条。

## 5. 双机与复核状态

本轮由 **Alien** 执行 Development 侧改造（Owner 直接指派），因此按 §3 该产物**不得由 Alien 自行复核**：
C′ 需要 **Mech** 作为独立复核主机。在 Mech 复核完成前，本裁决记录**不**等于 Review 通过。
