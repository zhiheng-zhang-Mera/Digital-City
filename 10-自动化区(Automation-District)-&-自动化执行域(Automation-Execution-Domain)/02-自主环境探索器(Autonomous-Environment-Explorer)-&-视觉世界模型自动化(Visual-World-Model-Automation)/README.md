# Autonomous Environment Explorer — 自主环境探索器 / 视觉世界模型自动化

```text
STATUS = PRE_ALPHA_STARTER
REPOSITORY = https://github.com/zhiheng-zhang-Mera/Auto-Game-Bot
SOURCE_SNAPSHOT = 9b9a0cd9a3be944d79992b9a7870d0f631390152
```

## Role

Maintain a structured model of an external visual environment, explore unknown/stale areas, compile stable knowledge into deterministic routines, and verify completion rather than merely replaying actions.

## Target capability clusters

- DISCOVER / LEARN / COMPILE / RUN lifecycle;
- static map config vs runtime belief/state;
- hybrid navigation and semantic recovery;
- semantic skill library + game/environment adapters;
- observation → verified world-state commit;
- causal interaction/state model;
- coverage graph, frontier exploration and miss-risk;
- multi-view verification and adaptive rescan;
- completion-confidence gate;
- hot/evidence/debug visual-data lifecycle;
- session compaction and retention;
- config compilation and localized relearning.

## Honest current implementation

Current repo provides:

- installable Python starter;
- guarded phase/state-transition contract;
- CLI surface;
- state-transition tests.

It does **not** yet provide real screen perception, game adapters, physical input control, autonomous control discovery/learning or validated performance.

## Relationship to Computer Use

This building is a higher-level planner/world-model/verification layer. 10/01 Computer Use is the bounded low-level action runtime. They are complementary rather than duplicate.

---

# 中文完整说明：自主环境探索器／视觉世界模型自动化

状态 `PRE_ALPHA_STARTER`；仓库 https://github.com/zhiheng-zhang-Mera/Auto-Game-Bot ；快照 `9b9a0cd9a3be944d79992b9a7870d0f631390152`。

## 角色
维护外部视觉环境的结构化模型，探索未知／过期区域，将稳定知识编译为确定性例程，并验证完成，而不只回放动作。

## 目标能力群
- DISCOVER／LEARN／COMPILE／RUN 生命周期；
- 静态地图配置与运行时信念／状态分离；
- 混合导航与语义恢复；
- 语义技能库及游戏／环境适配器；
- 观察 → 经验证的世界状态提交；
- 因果交互／状态模型；
- 覆盖图、前沿探索与遗漏风险；
- 多视角验证与自适应重扫；
- 完成置信度门禁；
- 热数据／证据／调试视觉数据生命周期；
- 会话压缩与保留；
- 配置编译与局部重新学习。

## 当前实现的诚实边界
当前仓库提供可安装 Python 起步包、有防护的阶段／状态转换契约、CLI 入口及状态转换测试。尚未提供真实屏幕感知、游戏适配器、物理输入控制、自主控制发现／学习或经过验证的性能。

## 与 Computer Use 的关系
本建筑是较高层规划器／世界模型／验证层；10／01 Computer Use 是有边界的低层动作运行时。二者互补。

## 快速信息与导航 / Quick facts and navigation

目录与文档数量于 2026-10-06 在本工作树实测；实现状态沿用文档记录，不代表重新验证产品运行时。 / Directory and document counts were measured in this worktree on 2026-10-06; implementation status is retained from the document and is not a fresh product-runtime validation.

| 项目 / Item | 实测值或记录值 / Measured or recorded value |
| --- | --- |
| 子目录（递归）/ Subdirectories (recursive) | 0 |
| Markdown 文档（递归，含本页）/ Markdown documents (recursive, including this page) | 1 |
| 实现状态 / Implementation status | `PRE_ALPHA_STARTER` |
| 本轮验证范围 / Validation scope | 文档、导航与语言配对；运行时未重测 / Documents, navigation and language pairing; runtime not retested |

### 导航 / Navigation

- [上级区说明 / Parent district](../README.md)
- 本页含完整英文及中文说明。 / This page contains complete English and Chinese explanations.
