# 城市道路 City Roads — Cross-Domain Semantic Contracts

```text
STATUS = PARTIAL_VERSIONED_CONTRACTS_EXIST
RUNTIME_SERVICE = FALSE
CURRENT_REFERENCE = Utopia contracts/
```

Roads are stable versioned semantics between owners, **not a central daemon or mandatory broker**.

Current Utopia examples already include:

- `pairing-v1`;
- `city-control-v0`;
- `capability-bridge-v1`.

Future roads should only be extracted when two real owners need the same cross-boundary contract.

## Allowed artifacts

- schemas;
- protocol modules/shared types;
- validators;
- compatibility/conformance tests;
- optional SDK/code generation.

## Forbidden role

Roads do not own business state, City authority, a mandatory transport, or a universal broker.

A new “Road service” must not be created merely because the map has a Road.

## 中文说明 / Chinese explanation

状态为 `PARTIAL_VERSIONED_CONTRACTS_EXIST`，`RUNTIME_SERVICE = FALSE`；当前参考是 Utopia `contracts/` 中的 `pairing-v1`、`city-control-v0`、`capability-bridge-v1`。道路是所有者之间稳定且版本化的语义契约，不是中央守护进程或强制代理。只有两个真实所有者需要同一跨边界契约时，才应提取新道路。

允许的产物包括 schema、协议模块/共享类型、验证器、兼容/一致性测试及可选 SDK/代码生成。道路不拥有业务状态、城市权威、强制传输或通用代理；不能只因地图有道路就新建“道路服务”。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 1 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `PARTIAL_VERSIONED_CONTRACTS_EXIST` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
