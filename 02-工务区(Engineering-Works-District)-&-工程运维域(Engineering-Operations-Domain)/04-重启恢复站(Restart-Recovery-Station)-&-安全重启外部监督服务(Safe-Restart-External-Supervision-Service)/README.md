# Restart Recovery Station — 重启恢复站 / 安全重启外部监督服务

```text
STATUS = EXISTING_IMPLEMENTATION_WITH_DOCUMENTED_LIMITATIONS
REPOSITORY = https://github.com/zhiheng-zhang-Mera/dsh-restart
SOURCE_SNAPSHOT = e20fb6cc43e27cedf6303471e5b8ee18e1383ecd
CURRENT_INTEGRATION = DSH/Hns plugin + external supervisor
TARGET_SCOPE = vendor-neutral safe restart/relaunch service
```

## Role

Execute a restart request safely after another component has decided a restart is warranted.

## Capability cluster

- request shape/source/priority/mode validation;
- duplicate suppression and exclusive in-flight lock;
- per-mode cooldown;
- checkpoint/safe-point gate;
- atomic checksummed restart ticket;
- graceful shutdown request;
- external supervisor heartbeat;
- process exit observation and relaunch;
- post-relaunch verification;
- crash-loop breaker / safe mode;
- append-only restart attempt audit.

## Honest current limitations

The repository itself documents:

- supervisor `WAITING_FOR_EXIT` currently has no deadline;
- `allowForceTerminate` is declared/validated but not consulted by this release.

Those are not silently upgraded away by City mapping.

## Boundary

Restart Recovery executes accepted protocol; Health Scheduler decides pressure/warrant. Hns owns task checkpoints/resume. City Core does not delegate global authority here.

## 中文说明 / Chinese explanation

状态为 `EXISTING_IMPLEMENTATION_WITH_DOCUMENTED_LIMITATIONS`，仓库与快照如上，当前是 DSH/Hns 插件加外部监督器，目标为厂商中立安全重启/重新启动服务。在其他组件已决定需要重启后，恢复站安全执行请求。

能力包括请求形状来源优先级模式验证、去重和独占执行锁、各模式冷却、检查点安全点门禁、原子带校验和重启票据、优雅关闭、外部监督心跳、观察进程退出并重新启动、启动后验证、崩溃循环熔断/安全模式，以及仅追加的尝试审计。

现有已记录限制保留：监督器 `WAITING_FOR_EXIT` 没有期限；`allowForceTerminate` 虽声明和验证，但本版本不使用。恢复站执行接受的协议，健康调度器判断压力和重启必要性，Hns 拥有任务检查点恢复，城市核心不在这里委托全局权威。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 1 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `EXISTING_IMPLEMENTATION_WITH_DOCUMENTED_LIMITATIONS` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
