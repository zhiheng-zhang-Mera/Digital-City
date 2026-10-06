# 工务区 Engineering Works District — Engineering Operations Domain

```text
STATUS = PROJECT_FIRST_REVIEWED_IMPLEMENTED
PRIMARY_PROJECTS = DS-Hns + dsh-health-scheduler + dsh-restart
```

## Buildings

1. [Project Foreman](./01-项目工头(Project-Foreman)-&-工程任务编排器(Engineering-Task-Orchestrator)/) — Hns/Boss Engineering union.
2. [Worker Gateway](./02-施工队接入站(Worker-Gateway)-&-工程执行平台适配层(Engineering-Provider-Adapter-Layer)/) — provider/worker adapters.
3. [Host Health Station](./03-主机保健站(Host-Health-Station)-&-运行健康调度服务(Runtime-Health-Scheduling-Service)/) — `dsh-health-scheduler`.
4. [Restart Recovery Station](./04-重启恢复站(Restart-Recovery-Station)-&-安全重启外部监督服务(Safe-Restart-External-Supervision-Service)/) — `dsh-restart`.

## Runtime relationship

```text
Host/runtime telemetry
    ↓
Health Scheduler
    ↓ judge pressure / maintenance / safe point
throttle/pause request ─────→ Hns
restart request ────────────→ Restart Recovery
                                  ↓
                         checkpoint/lock/ticket
                                  ↓
                         graceful shutdown
                                  ↓
                         external supervisor/relaunch
                                  ↓
                               Hns resume
```

Health judgment and restart execution remain deliberately separate.

## Boundary

City Core owns cross-domain task authority. 02 owns Engineering execution/support. Host Health does not own Node identity; Restart Recovery does not own domain task state or the decision that a restart is warranted.

## 中文说明 / Chinese explanation

状态为 `PROJECT_FIRST_REVIEWED_IMPLEMENTED`，主要项目是 DS-Hns、dsh-health-scheduler、dsh-restart。四个建筑依次为项目工头（Hns/Boss 工程联合）、施工队接入站（提供者/worker 适配）、主机保健站（dsh-health-scheduler）、重启恢复站（dsh-restart），对应上方 Buildings 链接。

主机/运行遥测进入健康调度器，判断压力、维护窗口和安全点；限流/暂停请求发送 Hns，重启请求发送恢复站。恢复站执行 checkpoint/lock/ticket、优雅关闭、外部监督/重新启动，再由 Hns 恢复。健康判断和重启执行保持分离。

城市核心拥有跨域任务权威，02 拥有工程执行与支持。主机保健站不拥有节点身份；恢复站不拥有领域任务状态，也不决定是否需要重启。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 4 |
| 递归 Markdown 文档 / Recursive Markdown documents | 5 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `PROJECT_FIRST_REVIEWED_IMPLEMENTED` |

### 子区导航 / Subarea navigation

| 目录 / Directory | 文档 / Documents | 原记录实现状态 / Recorded implementation status |
|---|---|---|
| [01-项目工头(Project-Foreman)-&-工程任务编排器(Engineering-Task-Orchestrator)](./01-%E9%A1%B9%E7%9B%AE%E5%B7%A5%E5%A4%B4%28Project-Foreman%29-%26-%E5%B7%A5%E7%A8%8B%E4%BB%BB%E5%8A%A1%E7%BC%96%E6%8E%92%E5%99%A8%28Engineering-Task-Orchestrator%29/README.md) | 1 | `PROJECT_FIRST_COMPOSITE_IMPLEMENTATION` |
| [02-施工队接入站(Worker-Gateway)-&-工程执行平台适配层(Engineering-Provider-Adapter-Layer)](./02-%E6%96%BD%E5%B7%A5%E9%98%9F%E6%8E%A5%E5%85%A5%E7%AB%99%28Worker-Gateway%29-%26-%E5%B7%A5%E7%A8%8B%E6%89%A7%E8%A1%8C%E5%B9%B3%E5%8F%B0%E9%80%82%E9%85%8D%E5%B1%82%28Engineering-Provider-Adapter-Layer%29/README.md) | 1 | `PROJECT_FIRST_COMPOSITE_IMPLEMENTATION` |
| [03-主机保健站(Host-Health-Station)-&-运行健康调度服务(Runtime-Health-Scheduling-Service)](./03-%E4%B8%BB%E6%9C%BA%E4%BF%9D%E5%81%A5%E7%AB%99%28Host-Health-Station%29-%26-%E8%BF%90%E8%A1%8C%E5%81%A5%E5%BA%B7%E8%B0%83%E5%BA%A6%E6%9C%8D%E5%8A%A1%28Runtime-Health-Scheduling-Service%29/README.md) | 1 | `EXISTING_IMPLEMENTATION` |
| [04-重启恢复站(Restart-Recovery-Station)-&-安全重启外部监督服务(Safe-Restart-External-Supervision-Service)](./04-%E9%87%8D%E5%90%AF%E6%81%A2%E5%A4%8D%E7%AB%99%28Restart-Recovery-Station%29-%26-%E5%AE%89%E5%85%A8%E9%87%8D%E5%90%AF%E5%A4%96%E9%83%A8%E7%9B%91%E7%9D%A3%E6%9C%8D%E5%8A%A1%28Safe-Restart-External-Supervision-Service%29/README.md) | 1 | `EXISTING_IMPLEMENTATION_WITH_DOCUMENTED_LIMITATIONS` |

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
