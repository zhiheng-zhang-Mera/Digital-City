# UI × 调度最终接线阶段

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../../../CONSTRUCTION_RULES.md)
> 本目录 README 只说明阶段目标与顺序；通用 claim、等待/唤醒、CI、双机独立、reconciliation 与 merge 规则统一读取常驻规则书。

解锁条件：\`UI_BASELINE_FROZEN\` + \`RESCHEDULING_BASELINE_FROZEN\`。

顺序：

\`UXI-301 → UXI-390\`

UXI-301 只建立 adapter / ViewModel / 用户语言，把稳定的 scheduler truth 翻译进既有 UI 组件；不得修改调度语义。

UXI-390 做双机最终回归、Web/Android/Rooms 产品验收、视觉一致性审查与 Owner 最终审美门禁。

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **9**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| en | 4 | [打开 / Open](en/README.md) |
| zh-CN | 1 | [打开 / Open](zh-CN/UXI-301-调度状态接入非工程化UI.md) |

### 本目录说明 / Local documents

- [UXI-301-调度状态接入非工程化UI.md](UXI-301-调度状态接入非工程化UI.md)
- [UXI-390-双机最终产品验收与收口.md](UXI-390-双机最终产品验收与收口.md)
- [UXI-391-Remote-Handoff收尾修复与合并回接.md](UXI-391-Remote-Handoff收尾修复与合并回接.md)

<!-- DOCUMENT_NAVIGATION:END -->
