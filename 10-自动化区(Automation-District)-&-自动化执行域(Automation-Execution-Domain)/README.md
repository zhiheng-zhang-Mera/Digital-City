# Automation District — 自动化执行域

```text
STATUS = PROJECT_FIRST_PARTIAL_IMPLEMENTED
BUILDINGS = 01 Computer Use Runtime + 02 Autonomous Environment Explorer
```

## 01 Computer Use Runtime

[Computer Use Runtime](./01-计算机使用运行时(Computer-Use-Runtime)-&-通用计算机交互执行服务(Generic-Computer-Interaction-Execution-Service)/) remains the Boss+Hns composite low-level bounded interaction runtime.

## 02 Autonomous Environment Explorer

[Autonomous Environment Explorer](./02-自主环境探索器(Autonomous-Environment-Explorer)-&-视觉世界模型自动化(Visual-World-Model-Automation)/) is backed by Auto-Game-Bot @ `9b9a0cd9a3be944d79992b9a7870d0f631390152`.

It owns the **higher-level** exploration/world-model/coverage/verification problem. It may use Computer Use or device adapters for physical action.

```text
goal / discover / learn
    ↓
world model + planner + coverage/verification
    ↓
semantic action
    ↓
Computer Use / device controller
    ↓
observation
    ↑
state verification / completion audit
```

## Boundary

Application/game adapters remain project/domain-specific. 10 owns reusable automation execution/exploration patterns, not City authority or Engineering-domain project planning.

---

# 中文完整说明：自动化执行域

状态 `PROJECT_FIRST_PARTIAL_IMPLEMENTED`；建筑为 01 计算机使用运行时与 02 自主环境探索器。

## 01 计算机使用运行时
[计算机使用运行时](./01-计算机使用运行时(Computer-Use-Runtime)-&-通用计算机交互执行服务(Generic-Computer-Interaction-Execution-Service)/) 仍是 Boss＋Hns 组合而成的有边界低层交互运行时。

## 02 自主环境探索器
[自主环境探索器](./02-自主环境探索器(Autonomous-Environment-Explorer)-&-视觉世界模型自动化(Visual-World-Model-Automation)/) 由 Auto-Game-Bot @ `9b9a0cd9a3be944d79992b9a7870d0f631390152` 支持，拥有较高层探索／世界模型／覆盖率／验证问题，可使用 Computer Use 或设备适配器执行物理动作。

流程：目标／发现／学习 → 世界模型＋规划器＋覆盖率／验证 → 语义动作 → Computer Use／设备控制器 → 观察 → 状态验证／完成审计（反馈至世界模型）。

## 边界
应用／游戏适配器保持项目／领域专用。10 拥有可复用自动化执行／探索模式，不拥有城市权威或工程域项目规划。

## 快速信息与导航 / Quick facts and navigation

目录与文档数量于 2026-10-06 在本工作树实测；实现状态沿用文档记录，不代表重新验证产品运行时。 / Directory and document counts were measured in this worktree on 2026-10-06; implementation status is retained from the document and is not a fresh product-runtime validation.

| 项目 / Item | 实测值或记录值 / Measured or recorded value |
| --- | --- |
| 子目录（递归）/ Subdirectories (recursive) | 2 |
| Markdown 文档（递归，含本页）/ Markdown documents (recursive, including this page) | 3 |
| 实现状态 / Implementation status | `PROJECT_FIRST_PARTIAL_IMPLEMENTED` |
| 本轮验证范围 / Validation scope | 文档、导航与语言配对；运行时未重测 / Documents, navigation and language pairing; runtime not retested |

### 导航 / Navigation

- [01-计算机使用运行时(Computer-Use-Runtime)-&-通用计算机交互执行服务(Generic-Computer-Interaction-Execution-Service)](01-%E8%AE%A1%E7%AE%97%E6%9C%BA%E4%BD%BF%E7%94%A8%E8%BF%90%E8%A1%8C%E6%97%B6%28Computer-Use-Runtime%29-%26-%E9%80%9A%E7%94%A8%E8%AE%A1%E7%AE%97%E6%9C%BA%E4%BA%A4%E4%BA%92%E6%89%A7%E8%A1%8C%E6%9C%8D%E5%8A%A1%28Generic-Computer-Interaction-Execution-Service%29/README.md)
- [02-自主环境探索器(Autonomous-Environment-Explorer)-&-视觉世界模型自动化(Visual-World-Model-Automation)](02-%E8%87%AA%E4%B8%BB%E7%8E%AF%E5%A2%83%E6%8E%A2%E7%B4%A2%E5%99%A8%28Autonomous-Environment-Explorer%29-%26-%E8%A7%86%E8%A7%89%E4%B8%96%E7%95%8C%E6%A8%A1%E5%9E%8B%E8%87%AA%E5%8A%A8%E5%8C%96%28Visual-World-Model-Automation%29/README.md)
