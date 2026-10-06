# 公安监管 Public Security — 运行时合规执行 Runtime Compliance Enforcement

```text
STATUS = PROJECT_NOT_CREATED
CURRENT_IMPLEMENTATION_SOURCE = Codex-Boss
FUTURE_EXTRACTION = PRESET_NOT_NOW
ACTION = ENFORCE
```

## Future extraction target

Extract the reusable runtime enforcement layer for city-wide hard boundaries:

- privilege-request enforcement;
- cross-domain access enforcement;
- protected-resource access checks;
- service/capability registration enforcement hooks;
- authority-escalation rejection;
- city-wide runtime-policy decision application;
- audit-friendly enforcement verdicts.

Candidate Boss seed surfaces include:

- generic enforcement portions of `electron/capability/authorization.ts`;
- `electron/commander/execution-gate.ts`;
- `electron/commander/runtime-policy.ts`;
- cross-domain/runtime boundary enforcement hooks;
- generic permission-decision application.

## Must remain in Core or owning domains

- Owner sovereignty;
- Root Trust / Root Authority as the source of truth;
- constitutional protected-surface definitions;
- domain-local policy;
- domain business state;
- qualification/promotion control.

Public Security must **consume authority facts from Core** rather than becoming a second authority source.

## Extraction gate

A standalone package/repository/service becomes justified only when the enforcement contract is stable, independently testable, used at multiple city-domain boundaries, and separation provides a real independent lifecycle/failure-domain benefit.

## 中文说明 / Chinese explanation

状态为 `PROJECT_NOT_CREATED`，当前来源 Codex-Boss，未来拆分 `PRESET_NOT_NOW`，动作 `ENFORCE`。未来可复用运行执行层覆盖：权限请求、跨域访问、受保护资源访问、服务能力注册钩子、拒绝权威升级、城市运行政策决定应用及可审计裁决。

候选来源为 `electron/capability/authorization.ts` 的通用执行部分、`electron/commander/execution-gate.ts`、`electron/commander/runtime-policy.ts`、跨域运行边界钩子和通用权限决定应用。Owner 主权、Root Trust/Root Authority 事实源、根本性受保护界面定义、领域局部政策和业务状态、资格/提升控制，必须保留在核心或所属领域。

公安监管消费核心权威事实，不能成为第二权威源。只有契约稳定、可独立测试、用于多个城市领域边界且拆分带来独立生命周期/故障域收益时，独立包/仓库/服务才成立。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 1 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `PROJECT_NOT_CREATED` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
