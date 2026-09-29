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
