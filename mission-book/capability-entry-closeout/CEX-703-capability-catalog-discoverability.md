---
workbook_id: CEX-703
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 703
execution_enabled: true
status: READY
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_PRODUCT_HEAD
dependencies: ["ASK_TARGETS_CONTRACT_PRESENT"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CEX-703
terminal_marker: CAPABILITY_CATALOG_DISCOVERABLE
---

# CEX-703 — “Utopia 能做什么”能力目录与发现入口

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 论文素材：[PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md)

## 目标

`GET /api/v0/ask/targets` 已经提供真实可执行 target 列表，但当前 Web/Android 只有 Ask unmatched 后才暴露。

本任务要让用户**无需先失败一次**就能发现现有能力。

## 最低产品入口

Web 与 Android 的 Ask/Do 页面都应有：

```text
不知道能做什么？
[ 查看全部能力 ]
```

打开真实 backend target catalog。

允许按现有 metadata 做轻量分类：

- Rooms；
- Capabilities；
- City Tasks；
- read/write；
- side-effect；
- unavailable reason。

## 规则

- catalog 必须来自 backend contract，不能手写第二份；
- unavailable capability 可以显示，但必须不可误触并解释原因；
- mutating / side-effect target 必须保留 confirmation 语义；
- 不把 FUTURE_EXPOSURE_BACKLOG 中未成熟能力塞进目录；
- 搜索/收藏/command palette 属 future enhancement，本任务不扩 scope。

## Formal Review

至少检查：

- fresh startup 用户能 1–2 步看到目录；
- catalog 与 `/ask/targets` 数量/identity 对齐；
- target unavailable truth；
- Ask manual selection 与 catalog 选择不会分叉语义；
- Web/Android 一致；
- 后端新增一个 target 时前端无需手工改列表即可出现。

## 论文素材强制点

记录：

- 修复前“必须先 Ask 失败”的步数；
- 修复后 discoverability 步数；
- target count；
- category counts；
- unavailable count；
- stale hard-coded catalog 若被发现；
- automatic catalog propagation evidence；
- usability/runtime errors。

## 完成门槛

- Web direct catalog；
- Android direct catalog；
- backend-driven；
- no fake future capabilities；
- opposite-host Review / exact-head CI；
- PAPER_MATERIAL_INDEX；
- terminal marker `CAPABILITY_CATALOG_DISCOVERABLE`。
