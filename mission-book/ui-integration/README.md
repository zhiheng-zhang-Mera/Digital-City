# UI × 调度最终接线阶段

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 本目录 README 只说明阶段目标与顺序；通用 claim、等待/唤醒、CI、双机独立、reconciliation 与 merge 规则统一读取常驻规则书。

解锁条件：\`UI_BASELINE_FROZEN\` + \`RESCHEDULING_BASELINE_FROZEN\`。

顺序：

\`UXI-301 → UXI-390\`

UXI-301 只建立 adapter / ViewModel / 用户语言，把稳定的 scheduler truth 翻译进既有 UI 组件；不得修改调度语义。

UXI-390 做双机最终回归、Web/Android/Rooms 产品验收、视觉一致性审查与 Owner 最终审美门禁。