# 再调度 vNext 阶段

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 本目录 README 只说明阶段目标与顺序；通用 claim、等待/唤醒、CI、双机独立、reconciliation 与 merge 规则统一读取常驻规则书。

解锁条件：\`UI_BASELINE_FROZEN\`。

顺序：

\`RS-201 ∥ RS-202 → RS-203 → RS-290\`

本阶段只稳定调度事实与动作：动态 AI 池、provider/model 可用性、地区限制、并发压力、设备感知、跨设备 handoff、结果回传、fallback/recovery。

禁止在本阶段自行重新设计最终产品 UI；最终呈现统一由 UXI-301 接入 UI 基线。