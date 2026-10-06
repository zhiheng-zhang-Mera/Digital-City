# 建筑 README 模板

本模板用于 Digital-City 区内的二级建筑，无论它由一个仓库、多个协调仓库，还是明确未来占位支持。

## 状态

已有建筑：

```text
STATUS = CONNECTED
DISTRICT = <district-id>
REPOSITORIES = <one or more canonical repositories>
```

未来占位：

```text
STATUS = PROJECT_NOT_CREATED
REPOSITORY = NOT_CREATED
IMPLEMENTATION_AUTHORITY = NONE
```

占位仅预留地图位置。不得将它解释为实现指令、活跃依赖、新城市核心要求或仓库存在的证明。

## 直接仓库链接

已有建筑应将规范仓库链接作为首个有实质意义的实现内容：

- **[项目名称](https://github.com/OWNER/REPOSITORY)** — 一句话城市角色

占位应写：

- **仓库：** NOT_CREATED

## 建筑角色

解释建筑向城市贡献什么，以及为何该能力不直接属于城市基础层。

## 房间／能力

列出本建筑拥有或规划的能力。

## 道路

| 道路 | 连接对象 | 目的 |
|---|---|---|
| Capability Road | 建筑／项目 | 调用或服务发现 |
| Event Road | 建筑／项目 | 事件交换 |

## 策略范围

说明哪个领域章程治理本建筑。除非明确提升为城市级规则，领域规则保持本地范围。

## 边界

说明本建筑**不拥有**什么；这对防止能力边界坍塌很重要。

## 规划房间

列出概念上属于此处、但尚无稳定实现的能力。

## 提升／创建条件

占位须说明何种证据足以支持创建专用仓库，而非继续作为文档概念或另一建筑内房间。

## 注册检查清单

- [ ] 状态明确为 CONNECTED 或 PROJECT_NOT_CREATED
- [ ] 已注明区
- [ ] 存在实现仓库时提供仓库链接
- [ ] 已描述建筑角色
- [ ] 已列出房间／能力
- [ ] 已列出道路
- [ ] 已说明策略范围
- [ ] 已说明边界
- [ ] 已更新 `CITY_MANIFEST.yaml`
- [ ] 导航／拓扑变化时更新根 README

---

语言配对 / Language pair: [English](../../BUILDING_TEMPLATE.md) · [中文](./BUILDING_TEMPLATE.md)
