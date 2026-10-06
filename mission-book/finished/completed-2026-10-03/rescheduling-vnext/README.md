# 再调度 vNext 阶段

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../../../CONSTRUCTION_RULES.md)
> 本目录 README 只说明阶段目标与顺序；通用 claim、等待/唤醒、CI、双机独立、reconciliation 与 merge 规则统一读取常驻规则书。

解锁条件：\`UI_BASELINE_FROZEN\`。

顺序：

\`RS-201 ∥ RS-202 → RS-203 → RS-290\`

本阶段只稳定调度事实与动作：动态 AI 池、provider/model 可用性、地区限制、并发压力、设备感知、跨设备 handoff、结果回传、fallback/recovery。

禁止在本阶段自行重新设计最终产品 UI；最终呈现统一由 UXI-301 接入 UI 基线。

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **5**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|

### 本目录说明 / Local documents

- [RS-201-动态AI池与可用性选择.md](RS-201-动态AI池与可用性选择.md)
- [RS-202-多设备并发感知与再调度.md](RS-202-多设备并发感知与再调度.md)
- [RS-203-跨设备执行回传与降级恢复.md](RS-203-跨设备执行回传与降级恢复.md)
- [RS-290-调度契约回归与基线冻结.md](RS-290-调度契约回归与基线冻结.md)

<!-- DOCUMENT_NAVIGATION:END -->
