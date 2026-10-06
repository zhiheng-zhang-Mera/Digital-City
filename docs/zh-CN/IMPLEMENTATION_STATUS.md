# Digital-City ↔ Utopia 实现状态

> 快照日期：**2026-09-29**
> Utopia main 快照：`393f3b89a9c4fae61be1e431c4bcd47fee945e88`

## 仓库角色

| 仓库 | 角色 | 何种真值的来源 |
|---|---|---|
| Digital-City | 城市所有权／边界／能力地图 | 能力归属和哪些重叠真实存在 |
| Utopia | 当前产品／参考实现 | 运行控制界面、参考 Node／Capability Fabric、提升模块和产品证据 |

Utopia **不必**在物理目录上镜像 Digital-City 目录树。

## 当前 Utopia 产品真值

- **V0.2 最终验收：** 一台 Windows 主机＋一台实体 Android 设备上 `ACCEPTED`。
- **Capability Bridge V0.3：** `ACCEPTED`；五项服务经同一 City 权威供 Web 与实体 Android 使用。
- **V0.3 加固：** `PASS`；有边界调用摘要／详情、限定身份、感知生命周期的可用性及带类型客户端错误。
- **Room Pack V1：** `READY_TO_ATTACH` 且已接入 main；十个已验收本地产品房间当前仍在 Utopia 主导航之外。

## 已提升城市模块

| 当前 Utopia 路径 | 架构所有权 | 模块 |
|---|---|---|
| `city/02-engineering/02-worker-gateway` | 02 工程区 | Skill Intake |
| `city/06-research/01-research-institute` | 06 研究院区 | Evidence Engine |
| `city/09-planning-knowledge/01-knowledge-service` | 09 知识区 | Knowledge Core |
| `city/09-planning-knowledge/02-document-intake` | 09 知识区 | Ingestion Core＋Document Readers |
| `city/11-entertainment/01-entertainment-centre/theme-engine` | **00/05 控制中心** | Theme Engine（物理搬移延后） |

主题当前代码位置是历史实现位置，不是永久城市所有权。

## Utopia 已实现的参考城市主干

Utopia 已证明 00 基础设施的有用子集：
- **Node Fabric：** 注册、心跳／存活、遥测、能力广告、离线真值；
- **Capability Fabric：** 限定注册表、感知生命周期的可用性、有边界调用桥接／历史；
- **道路：** 版本化配对、控制与能力契约；
- **控制中心：** Web＋Android 界面、设备视图、服务调用、任务／活动视图和配对。

因此 Utopia 产品工作**无需**等待从 Boss 物理抽取代码。

## 当前产品碎片化

存在三个分别已验收／可用的平面：
1. **任务**：City Control v0 运行时执行任务；
2. **服务**：Capability Bridge 调用；
3. **房间**：十个单主机个人实用房间。

主要可用性缺口已不再是“缺失模块”，而是三个平面尚未形成统一个人终端体验。

## 下一实现优先级

参见 [CITY_CAPABILITY_GAP_REVIEW.md](./CITY_CAPABILITY_GAP_REVIEW.md)。

下一产品里程碑应优化：

```text
一个 Utopia
→ 一个命令／动作入口
→ 一个近期活动模型
→ 自动能力／节点／运行时路由
→ PC＋Android 续接
```

健康、Quant、Digital-Me、沉浸媒体及其他领域建筑应在主干可用后接入，不得阻塞终端体验。

---

语言配对 / Language pair: [English](../../IMPLEMENTATION_STATUS.md) · [中文](./IMPLEMENTATION_STATUS.md)
