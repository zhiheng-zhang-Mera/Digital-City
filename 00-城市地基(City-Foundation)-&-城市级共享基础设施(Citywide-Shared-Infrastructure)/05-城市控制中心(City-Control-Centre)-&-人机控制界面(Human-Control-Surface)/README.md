# 城市控制中心 City Control Centre — Human Control Surface

```text
STATUS = REFERENCE_PRODUCT_SURFACES_EXIST
CURRENT_REFERENCE = Utopia Web + Android
UTOPIA_SNAPSHOT = 393f3b89a9c4fae61be1e431c4bcd47fee945e88
OPTIONAL_LOGIC_COMPONENT = General-Logic-Engine (design-only)
PRESENTATION_OWNER = Theme Engine union
```

## Current reference product surface

Utopia already provides the current Control Centre reference UI:

- Home / device state;
- Services;
- Tasks;
- Activity/history;
- Pairing;
- Settings;
- physical Android counterpart.

Boss and Hns remain source runtimes/control providers; their own panels are not competing City Control Centres.

## Theme ownership cleanup

Generic Utopia/control-surface theme generation, package validation and visual/readability checks belong here as **Presentation/Theming**, not in 11 Entertainment.

The current promoted code physically remains under `utopia/city/11-entertainment/.../theme-engine` until relocation is worth doing. Physical relocation is explicitly **non-blocking**.

11 keeps actual media/immersive responsibilities such as voice/avatar/VR/AR/spatial presentation.

## General Logic Engine

General-Logic-Engine remains an optional future rule/state/explanation backend. It is design-only and **must not block the terminal MVP**.

## Product gap

The missing Control Centre feature is no longer “build a dashboard.” It is:

```text
Tasks + Services + Rooms
        ↓
one command/action experience
        ↓
one recent activity/result surface
```

Authorization and durable domain truth remain with the owning runtimes.

## 中文说明 / Chinese explanation

状态为 `REFERENCE_PRODUCT_SURFACES_EXIST`；当前参考是上述快照的 Utopia Web 和 Android。已有首页/设备状态、服务、任务、活动历史、配对、设置，以及 Android 真机对应界面。Boss/Hns 是来源运行时和控制提供者，其面板不是竞争的城市控制中心。

通用 Utopia/控制界面的主题生成、包验证、视觉可读性检查属于这里的展示/主题职责。已提升代码目前仍位于 `utopia/city/11-entertainment/.../theme-engine`，搬迁不构成阻塞；11 保留语音、avatar、VR/AR、空间呈现等媒体沉浸职责。

General-Logic-Engine 是可选未来规则/状态/解释后端，仅设计阶段，不能阻塞终端 MVP。产品缺口是把任务、服务、Rooms 合为统一命令/操作体验和统一近期活动/结果界面。授权和持久领域事实仍由各自运行时拥有。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 1 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `REFERENCE_PRODUCT_SURFACES_EXIST` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
