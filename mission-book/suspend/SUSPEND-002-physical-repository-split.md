# SUSPEND-002 — Physical Repository Split Option

**State:** PRESERVE_ONLY / NOT_CURRENT_RECOMMENDATION

## 必须保留的选项

Utopia 未来可能从单 repo 拆成多个独立 repository/package/release unit。

这不是当前目标，但不应永久排除。

## 当前为什么不做

现在优先问题是：

- contract；
- authority；
- dependency direction；
- lifecycle；
- failure isolation；
- Capability Registry / user surface。

这些可以先在单 repo 内通过逻辑边界解决。现在物理拆仓会增加：

- version coordination；
- CI/release orchestration；
- cross-repo dependency drift；
- migration成本；
- Agent navigation overhead。

而尚无证据证明收益大于成本。

## 未来重新评估触发器

至少出现一个真实压力：

- 不同组件需要独立发布/回滚周期；
- 权限或安全要求必须 repo-level isolation；
- CI 已因单仓规模形成持续瓶颈；
- 不同部署单元必须独立扩缩/故障隔离；
- ownership/team boundary 长期稳定且冲突；
- public SDK / App ecosystem 需要独立 version contract；
- 单仓 dependency rules 已无法阻止实际耦合。

## 原则

**Logical decoupling first; physical split only on measured benefit.**

该文件不授权任何 repo split。


---

语言读本 / Reading translation: [English](en/SUSPEND-002-physical-repository-split.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.
