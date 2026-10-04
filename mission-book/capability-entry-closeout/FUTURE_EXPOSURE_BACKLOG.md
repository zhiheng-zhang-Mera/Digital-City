# Future Exposure Backlog / 明确延后的能力入口

> **状态：FUTURE / NOT CLAIMABLE BY THIS PROGRAMME**
>
> 这些项目被明确记录，避免以后再次“代码存在，所以是不是漏了按钮”的重复审计。
> 当前 CEX programme 不得擅自实现，除非 Owner 后续激活新的工作书。

## F-01 — General AI Gateway 完整用户入口

当前存在 route/contract，但 executor/runtime attachment 尚未形成完整产品闭环。

未来需要：

- provider/model/account availability；
- Web/API channel；
- user-confirmed switch；
- Budget Policy；
- remote-device execution/result return；
- real provider acceptance。

**在这些完成前禁止造 ChatGPT / Claude / Gemini 假按钮。**

## F-02 — Butler Assistant 配置与交互

当前 Home 有 assistant slot，但仍是 presentational placeholder。

未来需要：

- assistant identity；
- name；
- appearance；
- voice；
- duty；
- multi-device embodiment；
- handoff；
- shared-brain state；
- runtime action authority。

## F-03 — Engineering Manager 的 Universal Terminal 用户路由

Engineering Manager 基础设施已经存在，但缺少完整：

```text
user intent
→ Ask/Action route
→ engineering job
→ progress/result
→ attention
```

产品闭环。

未来单独做，不在 CEX 中用按钮掩盖。

## F-04 — Android Interactive Rooms

Android 当前能看 catalog/availability，但不能像 Web 一样完整操作：

- Calendar；
- Focus；
- Prompt Library；
- Data Lab；
- Text Workshop；
- Checklist / Bookmarks / Knowledge 的完整原生交互。

未来应决定：

1. Android 原生 Room UI；
2. remote semantic Room actions；
3. safe embedded/web surface；

再施工。CEX 不自行选架构。

## F-05 — Workbench Execution Profile UI

由 `mission-book/workbench-compatibility-migration/` 负责 backend/profile contract。

只有 WBC-604 完成后，本项目未来才可补 presentation：

- STANDARD_DEVICES；
- WORKER_POOL；
- HYBRID；
- readiness；
- rollback。

## F-06 — Generic Scheduler CONFIRM

RS presentation contract 有 `CONFIRM` token，但当前 scheduler 通用后端 confirmation route 不存在。

CEX-702 只允许暴露**已经存在的** `switch-declined` / alternate-device 语义，不能把它偷换成 generic CONFIRM。

未来 confirmation route 应与具体 attention/decision contract 对齐后再启用。

## F-07 — Web Surface Rename / Device Naming Normalization

当前 `window.utopiaWebSurface.rename(...)` 是 acceptance/debug helper。

未来应等 stable member/device identity model 收口后，统一：

- device display name；
- browser surface label；
- member identity presentation；

而不是把 console helper 原样产品化。

## F-08 — 更完整的 capability search / command palette

CEX-703 先补“查看全部能力”。

未来可进一步做：

- search；
- tags/categories；
- recent/favourite；
- context-aware recommendation；
- command palette；
- keyboard shortcut。

这些属于 UX enhancement，不是当前隐藏功能 defect。
