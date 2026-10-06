# CEX-790 论文材料索引

> 阅读译本 / Reading translation：本文件只提供阅读翻译，不是第二份权威工作书／状态。历史内容不表示当前验收重新执行。

审计材料是从代码重建入口清单与被认为能够描述它的注册表之间的差异。执行审计本身不支持性能或新颖性结论。

- 机器可读清单：`utopia:evidence/raw/mission-book/CEX-790/capability-inventory.json`，工作书指定十个来源共 145 项，各项带分类和生成规则。
- 人类矩阵与人工审定例外：`utopia:evidence/raw/mission-book/CEX-790/CAPABILITY_ENTRY_INVENTORY.md`，逐行审定十一项缺口候选（5 REGISTRY_GAP、2 PARITY_GAP、3 FALSE_POSITIVE、1 BY_DESIGN）。
- 联合基线构造及验证：[CLAIM_RECORD.md](./CLAIM_RECORD.md)，自动合并不能生成的五头联合，经 12 项任务测试、154 项回归测试、双语门禁及 Android 构建验证（18 套件／97 测试／0 失败）。
- Registry 对账：`CAP-WORKER-POOL-AGENT-001` 从过期待审主张对账为 `FORMAL_REVIEW_RECONCILED`；创建 `CAP-CAPABILITY-BRIDGE-001` 记录用户可达但无记录命名的界面；重建 `CAPABILITY_INDEX.yaml` 及先前为空的 `SURFACE_INDEX.yaml`；两种语言 `CAPABILITY_EXPOSURE_MATRIX` 从空模板填为 12 行表格。
- 保留仪器失败，因为它们是可复用发现：分类器最初从实现仓库而非控制平面读取 Registry，令十一项已注册能力看似未注册；路由模式丢失 `/api/v0/` 前缀。两个联合解决草稿编辑冲突块时丢失函数，由逐任务符号检查发现。
- 项目组综合：[PAPER_MATERIAL_SYNTHESIS.md](../../CEX-PROGRAMME/zh-CN/PAPER_MATERIAL_SYNTHESIS.md)。
- 未知保留为未知：审计读取代码／契约而非用户界面，因此每条回填记录保留 `intent_validation_status: NOT_TESTED`；CEX-790 未驱动用户界面，也未使用设备。
- 时间线：联合基线不是 `main`，五个依赖头均未合并，没有工作书授予合并权威。`CAPABILITY_ENTRY_BASELINE_AUDITED` 是评审结果，开发阶段保持未释放。

语言配对 / Language pair: [English](../PAPER_MATERIAL_INDEX.md) · [中文](./PAPER_MATERIAL_INDEX.md)
