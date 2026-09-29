# Automation District — 自动化执行域

```text
STATUS = IMPLEMENTATION_PARTIAL
PROJECT_REVIEW = BOSS_HNS_COMPOSITE_RECORDED
```

## Existing building
[Computer Use Runtime](./01-计算机使用运行时(Computer-Use-Runtime)-&-通用计算机交互执行服务(Generic-Computer-Interaction-Execution-Service)/) is a real composite implementation backed by Boss + Hns.

## Existing project pending review
[Auto-Game-Bot](https://github.com/zhiheng-zhang-Mera/Auto-Game-Bot) remains project-first review pending. Its perception/action/verification behavior may later extend the Automation union.

## Boundary
10 owns generic perception/action/verification execution, not City authority or Engineering planning. Application-specific automation remains with its owning project.

## Roads
Task/Intent Road ← planners; Capability Road ↔ Capability Fabric; Computer/Device Road ↔ interaction layers; Evidence/Receipt Road → caller.
