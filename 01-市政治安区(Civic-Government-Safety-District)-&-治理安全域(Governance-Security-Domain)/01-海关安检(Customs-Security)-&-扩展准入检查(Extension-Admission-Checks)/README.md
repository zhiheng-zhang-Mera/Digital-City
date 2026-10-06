# 海关安检 Customs Security — 扩展准入检查 Extension Admission Checks

```text
STATUS = PROJECT_NOT_CREATED
CURRENT_IMPLEMENTATION_SOURCE = Codex-Boss
FUTURE_EXTRACTION = PRESET_NOT_NOW
ACTION = ADMIT
```

## Future extraction target

Extract only the reusable admission-time boundary needed before a new building/extension is activated:

- manifest/schema validation;
- identity/source verification hooks;
- dependency declarations;
- requested capability/permission declarations;
- domain and storage-namespace declarations;
- isolation/crash-boundary declarations;
- enable/disable/uninstall/rollback readiness;
- admission-time lifecycle preflight.

Candidate Boss seed surfaces include:

- `electron/security/permission-manifest.ts`;
- `electron/capability/plugin-contract.ts`;
- generic admission portions of `electron/capability/permission-contract.ts`;
- `config/city-replacement-lifecycle.json`;
- generic extension lifecycle/preflight logic.

## Must not be extracted here

- Owner sovereignty / Root Trust / Root Authority source;
- runtime enforcement after admission;
- Capability Fabric registry itself;
- domain business state;
- scientific/health/engineering/media quality evaluation.

## Extraction gate

Do not create a standalone repository merely for the metaphor. Extraction becomes justified when the admission contract is stable, independently testable, used by multiple independent buildings/extensions, and no longer depends on Boss-private state.

## 中文说明 / Chinese explanation

状态为 `PROJECT_NOT_CREATED`，当前实现来源 Codex-Boss，未来拆分为 `PRESET_NOT_NOW`，动作 `ADMIT`。未来只拆分新建筑/扩展激活前可复用的准入边界：manifest/schema 验证、身份来源校验钩子、依赖/能力/权限声明、领域与存储命名空间声明、隔离崩溃边界声明、启停卸载回滚准备，以及准入生命周期预检。

Boss 候选来源包括 `electron/security/permission-manifest.ts`、`electron/capability/plugin-contract.ts`、`electron/capability/permission-contract.ts` 的通用准入部分、`config/city-replacement-lifecycle.json` 及通用扩展生命周期预检逻辑。

这里不得提取 Owner 主权/Root Trust/Root Authority 来源、准入后的运行执行、能力网注册表、领域业务状态，以及科学/健康/工程/媒体质量评估。只有契约稳定、可独立测试、多个独立建筑使用且不依赖 Boss 私有状态时，才有理由建立独立仓库；不能仅为城市比喻创建服务。

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
