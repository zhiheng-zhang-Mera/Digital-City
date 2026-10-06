# 区 README 模板

每个一级功能区使用本模板。

## 状态

```text
STATUS = ACTIVE | PLANNED
DISTRICT_ID = <stable-id>
PROJECT_MAPPING = REVIEWED | PENDING_REVIEW
```

## 区角色

用一个简短段落描述本区的领域／市政职责。

## 建筑

理解产品／机构边界之后才列出建筑。

| 建筑 | 状态 | 规范实现 | 角色 |
|---|---|---|---|
| 示例 | CONNECTED / PROJECT_NOT_CREATED | 仓库／多个仓库或 NOT_CREATED | 一句话角色 |

## 区所有策略

说明仅在本区内适用、并非城市级宪法规则的规则。

## 道路

列出稳定跨区道路／契约；不要用本节记录偶发实现调用。

## 边界

说明本区明确不拥有的职责。

## 待审项目

当 `PROJECT_MAPPING = PENDING_REVIEW` 时，候选仓库仅列为清单，不作为最终所有权决定。

## 注册检查清单

- [ ] 区角色明确
- [ ] 建筑具有内聚边界
- [ ] 项目映射已明确审查
- [ ] 房间／能力归属某建筑
- [ ] 跨区道路明确
- [ ] 未在区内重复城市级基础设施
- [ ] `CITY_MANIFEST.yaml` 已同步

---

语言配对 / Language pair: [English](../../DISTRICT_TEMPLATE.md) · [中文](./DISTRICT_TEMPLATE.md)
