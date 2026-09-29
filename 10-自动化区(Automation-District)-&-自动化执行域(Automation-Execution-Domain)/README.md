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
