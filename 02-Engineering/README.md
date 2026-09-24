# Engineering — 工务局、施工与运维建筑

## Direct repository links

- **[DS-Hns](https://github.com/zhiheng-zhang-Mera/DS-Hns)** — 主施工、测试、修复与持续托管体系
- **[Harness-Mega](https://github.com/zhiheng-zhang-Mera/Harness-Mega)** — 宿主/集成 Harness
- **[Harness-Alien](https://github.com/zhiheng-zhang-Mera/Harness-Alien)** — 异步宿主/实验 Harness
- **[dsh-health-scheduler](https://github.com/zhiheng-zhang-Mera/dsh-health-scheduler)** — 运行健康观察与动作建议
- **[dsh-restart](https://github.com/zhiheng-zhang-Mera/dsh-restart)** — 重启执行与连续运行支持

## Building role

Engineering 是城市的**工务局 + 建筑公司 + 运维中心**。它可以建设和维护城市，但不因此自动拥有城市宪法或其他楼栋的业务所有权。

## Buildings and rooms

### [DS-Hns](https://github.com/zhiheng-zhang-Mera/DS-Hns)

- Construction — 工程实施。
- Test & Qualification Support — 自动测试与验证。
- Repair — 故障定位、修复与回归。
- Deployment / Migration — 安装、迁移和版本推进。
- Computer Use — 面向图形界面/宿主的自动操作。
- Long-running Stewardship — 长期托管和任务连续性。

### Harness hosts

[Harness-Mega](https://github.com/zhiheng-zhang-Mera/Harness-Mega) 与 [Harness-Alien](https://github.com/zhiheng-zhang-Mera/Harness-Alien) 提供宿主隔离、并行施工和不同运行角色的承载空间。

### Runtime health services

[dsh-health-scheduler](https://github.com/zhiheng-zhang-Mera/dsh-health-scheduler) 提供 CPU/内存/进程年龄/event-loop drift 等观察以及 NO_ACTION / THROTTLE / PAUSE_NEW_WORK / REQUEST_RESTART 类型决策。

[dsh-restart](https://github.com/zhiheng-zhang-Mera/dsh-restart) 负责实际 restart execution，并与任务状态持久化/恢复语义衔接。

## Roads

- **Recovery Road** → Codex-Boss / hosted agents.
- **Evidence Road** → qualification gates.
- **Construction Road** → every building under active development.
- **State Continuation Road** → persistent tasks and residents.

## Boundary

Hns may be granted broad operational authority for construction, but operational authority is not equivalent to constitutional authority. It should not silently redefine Owner/root-trust boundaries or claim ownership of domain capabilities.
