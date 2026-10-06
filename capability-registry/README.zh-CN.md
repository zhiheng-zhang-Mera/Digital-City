# Capability Registry / 能力登记册（中文）

> **状态：ACTIVE / CITYWIDE / PERSISTENT**
>
> 这是 Digital-City 的长期能力户籍与用户暴露地图。它不是项目 README 的替代品，也不是 Mission Book 的任务调度器。

## 1. 职责

Capability Registry 回答四个问题：

1. **项目/城市现在到底有什么能力？**
2. **这个能力真实实现在哪里？**
3. **用户实际能看到、知道和操作到什么程度？**
4. **哪一个 exact SHA / UI / E2E evidence 证明以上状态？**

它的目标是同时服务：

- 新 Agent 快速定位功能与 canonical owner；
- 人工审查“代码里有，但用户找不到”的缺口；
- 多平台 UI parity 检查；
- 防止重复实现同一能力；
- 为论文/技术报告留下 capability exposure gap 的结构化 longitudinal evidence。

## 2. Registry 追踪 capability，不追踪每个函数

**禁止把所有源代码函数逐个登记。**

Registry 的基本单位是有产品/系统语义的 capability，例如：

- 设备配对；
- 跨设备转交任务；
- provider/model 选择；
- revoke / rebind；
- task progress；
- experiment export。

每个 capability 可以反向记录多个：

- repo/path；
- symbol/function/class；
- API/action；
- UI surface；
- dependency。

低级 helper、codec、普通 getter/setter 不单独登记，除非它们本身是稳定跨边界 contract。

## 3. 四层完成状态

不得只使用一个模糊的 `COMPLETE=true`。

每个 capability 至少分别记录：

```text
implementation_status
backend_wiring_status
user_reachability_status
intent_validation_status
```

含义：

- **Implementation**：代码/服务真实存在；
- **Backend wiring**：用户入口/API 真实连接 canonical backend；
- **User reachability**：用户能从正常产品路径发现和调用；
- **Intent validation**：实际行为符合 Owner/产品所定义的用户语义。

因此允许出现诚实状态：

```text
implementation       = COMPLETE
backend_wiring       = VERIFIED
user_reachability    = MISSING
intent_validation    = NOT_TESTED
```

这类记录不是“失败登记”，而是防止把内部实现完成误报成产品完成。

## 4. 用户暴露

沿用 Mission Book §14A：

```text
DIRECT_CONTROL
OBSERVABLE_ADVANCED
BACKGROUND_DISCLOSED
INTERNAL_ONLY
```

每个 capability 还必须明确：

- 用户能看到哪些信息；
- 用户能操作哪些控制；
- 哪些信息被合理隐藏；
- 每个平台的入口位置；
- 是否存在 parity gap；
- INTERNAL_ONLY 的豁免理由。

## 5. Canonical record 与 exact identity

Registry 是导航与审查控制面，不保存产品 runtime code。

每条 verified capability record 必须绑定：

```text
implementation_repo
implementation_paths
symbols
last_verified_full_sha
evidence_refs
source_workbook_ids
```

规则：

- branch/tag 只用于 discovery；
- `last_verified_full_sha` 必须是 40-character full SHA；
- UI/CI/E2E evidence 必须绑定 intended exact head；
- 路径/symbol 用于定位，SHA 用于版本身份；
- line number 不作为长期 anchor。

## 6. 与 Mission Book 连锁更新

### 新增 capability

```text
Mission Workbook
→ declare/create CAP-* id
→ create/update Registry record
→ establish user entry / thin vertical slice
→ implement/thicken capability
→ verify backend wiring
→ verify reachability
→ verify intent
→ write exact SHA/evidence
→ Formal Review reconciles Registry
→ Closeout
```

### 修改已有 capability

工作书必须在开工时声明：

```text
capability_ids
capability_registry_action
```

任务正式完成前必须更新对应 record。

若代码已改但 Registry 未同步：

`CAPABILITY_REGISTRY_STALE`

若 Registry 宣称入口/语义存在，但实机找不到或行为不符：

`CAPABILITY_REGISTRY_REALITY_MISMATCH`

均不得正式 Closeout。

## 7. 与 Capability Entry Closeout 的关系

现有：

`mission-book/finished/completed-2026-10-06/capability-entry-closeout/CAPABILITY_ENTRY_MATRIX.md`

是本 Registry 的 **bootstrap evidence source**，不是永久第二套 canonical registry。

规则：

- CEX programme 继续完成当前历史 exposure debt；
- CEX-790 final audit 时将已确认能力回填/对齐到本 Registry；
- CEX matrix 可保留为 programme evidence，但此后新 capability 的长期户籍以本 Registry 为准；
- 旧能力在未回填前标 `LEGACY_BACKFILL_PENDING`，不得凭空猜状态；
- 任一旧能力被后续工程书触及时，应顺手完成其 Registry backfill。

## 8. 研究素材

以下事件自动属于全局 research-evidence candidate：

- capability 已实现但没有用户入口；
- capability 有入口但 backend 未接；
- UI 显示能力但调用语义错误；
- 用户无法发现已有能力；
- Web/Android/iOS 等 surface parity gap；
- Agent 因 Registry 缺失而重复实现/定位错误；
- Registry 与 runtime reality 不一致；
- 从 implementation complete 到 user reachable 的时间差。

推荐记录：

```text
implementation_completed_at
first_surface_available_at
reachability_verified_at
intent_validated_at
owner_intervention_count
hidden_capability_detected
false_affordance_detected
wrong_semantics_detected
rework_required
registry_reconciliation_result
```

可形成后续指标：

`Exposure Lag = T(reachability_verified) - T(implementation_complete)`

但自然施工数据只用于观察；因果比较需 controlled study。

## 9. 文件

- `CAPABILITY_INDEX.yaml`：机器读取入口；
- `records/*.yaml`：每个 capability 的权威结构化记录；
- `SURFACE_INDEX.yaml`：页面/平台导航面；
- `CAPABILITY_EXPOSURE_MATRIX.*.md`：人工审查视图；
- `CAPABILITY_RECORD_TEMPLATE.yaml`：新记录模板。

## 10. 一句话原则

> **代码里存在的能力，不等于用户拥有的能力。**

以及：

> **先让用户走通一条真实路径，再把这条路径修宽。**

## 语言与入口导航 / Language and entry navigation

- [完整英文说明 / Complete English guide](./README.en.md)
- [登记册入口 / Registry entry](./README.md)

## 快速信息仪表盘与导航 / Quick dashboard and navigation

目录数量实测于2026-10-06；状态是既有文档记录，不是新运行验收。 / Directory counts measured on 2026-10-06; status reflects existing documentation rather than new runtime acceptance.

| 项目 / Item | 值 / Value |
|---|---|
| 直接子目录 / Direct subdirectories | 1 |
| 递归Markdown文档 / Recursive Markdown documents | 6 |
| 状态 / Status | ACTIVE / CITYWIDE / PERSISTENT (existing registry / 既有登记册) |
| 语言 / Language | 同文中英或明确互链语言对 / Same-file bilingual explanations or linked language pairs |

### 文档与资源导航 / Documents and resources

| 入口 / Entry | 用途 / Purpose |
|---|---|
| [CAPABILITY_EXPOSURE_MATRIX.en.md](./CAPABILITY_EXPOSURE_MATRIX.en.md) | 说明文档 / Explanatory document |
| [CAPABILITY_EXPOSURE_MATRIX.zh-CN.md](./CAPABILITY_EXPOSURE_MATRIX.zh-CN.md) | 说明文档 / Explanatory document |
| [CAPABILITY_INDEX.yaml](./CAPABILITY_INDEX.yaml) | 既有结构化索引/模板，本次未修改 / Existing structured index/template, unchanged in this documentation work |
| [CAPABILITY_RECORD_TEMPLATE.yaml](./CAPABILITY_RECORD_TEMPLATE.yaml) | 既有结构化索引/模板，本次未修改 / Existing structured index/template, unchanged in this documentation work |
| [README.en.md](./README.en.md) | 说明文档 / Explanatory document |
| [README.md](./README.md) | 说明文档 / Explanatory document |
| [README.zh-CN.md](./README.zh-CN.md) | 说明文档 / Explanatory document |
| [SURFACE_INDEX.yaml](./SURFACE_INDEX.yaml) | 既有结构化索引/模板，本次未修改 / Existing structured index/template, unchanged in this documentation work |

### 子目录 / Subdirectories

| 入口 / Entry | 递归Markdown数量 / Recursive Markdown count |
|---|---|
| [records](./records/README.md) | 1 |
