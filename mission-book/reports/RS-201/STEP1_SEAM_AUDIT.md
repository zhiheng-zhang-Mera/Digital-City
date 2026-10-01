# RS-201 · 步骤 1 — 现有 GAI 实现审核与 registry / runtime seams

```text
任务    = RS-201 动态 AI 池与可用性选择
开发主机 = Alien        基线 = de91f5e（UI_BASELINE_FROZEN 后的 main）
步骤    = 施工步骤 1「审核现有 GAI-002/003/004/005 已合并实现，明确 registry 与 runtime seams」
```

以下结论都在基线上**实际跑过**，不是阅读印象。

## 一、基线状态（已核对，不是假设）

```text
contracts/general-ai-registry-v1/tests/conformance.test.mjs      14 tests, 14 pass, 0 fail
contracts/general-ai-health-resilience-v1/tests/conformance.test.mjs  16 tests, 16 pass, 0 fail
```

两个契约在冻结基线上都是绿的，所以 RS-201 是在一个可工作的地基上扩展，而不是在补一个坏掉的东西。

## 二、registry seam：`contracts/general-ai-registry-v1/`

**入口**：`createProviderRegistry({ handleStore, clock })`（`registry.mjs:91`）。

两条已经立好的约束，与 RS-201 的禁止边界直接相关，**必须保留而不是重做**：

1. **没有写死的 provider。** `BUILT_IN_IDENTITIES = Object.freeze([])`（`registry.mjs:20`）。
   任务禁止「把某一 provider 写死为永久唯一 fallback」——地基上本来就没有写死，RS-201 不能
   在引入动态池时反而引入一个隐式默认兜底。
2. **凭据不进 registry。** `handleStore` 必须是中立的 `SecureHandleStorePort`，缺失直接抛
   `HANDLE_STORE_REQUIRED`（`registry.mjs:92-94`）。记录里只准出现 handle，`records.mjs` 还会用
   `findRawSecretFields` / `findRawSecretValues` / `findReservedKeyPaths` 主动拒绝原始凭据
   与原型污染键。RS-201 新增的字段必须继续走 handle。

**身份索引**（`registry.mjs:110-120`）：一个 reference 只标识一条记录，且 parent 绑定不可变；
跨 kind 复用或改绑父级一律 `IDENTITY_COLLISION`。这一条正好是独立复核要攻击的
「provider 删除后残留引用」的前置防线，RS-201 的删除/禁用语义必须建立在它之上而不是绕过它。

**已存在的查询/缺失语义**：`upsertProvider|Model|Account`、`getProvider|Model|Account`、
`modelOfProvider`/`accountOfProvider`、`listProviders({channel})`、
`listModels({providerRef, fact, level, channel})`、`listAccounts({providerRef})`；
缺失是**带类型的**（`UNKNOWN_PROVIDER` / `UNKNOWN_MODEL` / `UNKNOWN_ACCOUNT` /
`MODEL_NOT_IN_PROVIDER` / `ACCOUNT_NOT_IN_PROVIDER`），不是 null。RS-201 的「不可选原因」
应当复用这套 typed absence，而不是另造一套字符串。

## 三、records seam：三条记录 + 内建生命周期

三种规范记录：`PROVIDER` / `MODEL` / `ACCOUNT`（`PROVIDER_SPEC` / `MODEL_SPEC` / `ACCOUNT_SPEC`）。

**每条记录自带新鲜度**：`observed_at` + `ttl_ms` 是必填字段，`freshnessOf(record, now)` 给出
`FRESH | STALE | UNKNOWN`（`FRESHNESS`）。这一点很关键——任务步骤 3 要求「避免 stale
availability 被当成实时真相」，地基上**已经有**时基，RS-201 要做的是让 availability 判定
**必须消费**它，而不是新造一个 ttl 机制。

**通道就绪度**：`channels` 是 `{channel, readiness}` 数组，
`CHANNEL_READINESS = READY | AUTH_REQUIRED | UNAVAILABLE | UNKNOWN`，`CHANNELS = WEB | API`。

**账号状态**：`ACCOUNT_STATUSES`（`UNKNOWN | UNAUTHENTICATED | PENDING | AUTHENTICATED | …`），
配合 `channel_handles`，是「session 失效 / 未登录」语义的落点。

## 四、resilience seam：`contracts/general-ai-health-resilience-v1/`

已有词汇表（**不要重复发明**）：

```text
AVAILABILITY_STATES = AVAILABLE | DEGRADED | UNAVAILABLE | UNKNOWN
AUTH_STATES         = READY | MISSING | EXPIRED | NEEDS_USER | UNAVAILABLE
RATE_LIMIT_STATES   = WITHIN_LIMIT | LIMITED | UNKNOWN
BUDGET_STATES       = WITHIN_BUDGET | EXHAUSTED | UNKNOWN
FAULT_CLASSES       = TRANSIENT_TECHNICAL | HUMAN_BLOCKED | PERMANENT | AMBIGUOUS
CIRCUIT_STATES      = CLOSED | OPEN | HALF_OPEN
SCOPE_KINDS         = PROVIDER | ACCOUNT | MODEL | WEB_CHANNEL | API_CHANNEL
SIGNAL_KINDS        = AVAILABILITY | HEALTH | AUTH | RATE_LIMIT | BUDGET
```

并有 `classifyFailure`、`DEFAULT_RESILIENCE_POLICY`、`createResilienceGovernor`（熔断）。

## 五、差距分析：RS-201 实际要补什么

任务要求 availability 至少区分七类。逐条对照现有词汇表：

| 任务要求的类别 | 现有对应 | 结论 |
|---|---|---|
| 可用 | `AVAILABILITY_STATES.AVAILABLE` | 已有 |
| 未登录 / 凭据缺失 | `AUTH_STATES.MISSING` | 已有词汇，需**提升为 availability 原因** |
| session 失效 | `AUTH_STATES.EXPIRED` | 同上 |
| 服务故障 | `FAULT_CLASSES` + `CIRCUIT_STATES` | 已有词汇，需**提升为 availability 原因** |
| 未知 | `AVAILABILITY_STATES.UNKNOWN` | 已有 |
| **区域不支持** | **无** | **缺失** |
| **用户禁用** | **无** | **缺失** |

实测确认这两个概念在现有契约里**完全不存在**：

```text
在 general-ai-registry-v1 与 general-ai-health-resilience-v1 中搜索
enabled|disabled|DISABLED|region|REGION  ->  0 命中
```

还要补的四项，现有契约里也没有对应物：

1. **用户增删启停语义**：registry **只有 upsert，没有 remove/disable**（实测 `registry.mjs` 中
   `remove|delete|disable|retire` 除一条注释外 0 命中）。而任务禁止「因 provider 不可用就把它从
   registry 永久删除」——所以 RS-201 需要的不是 delete，而是**可逆的 enabled/disabled +
   不可选但不消失**，这与禁止边界是一致的，不是绕开它。
2. **候选列表 + 不可选原因 + 用户确认**的稳定输出（步骤 4），现无。
3. **「建议切换」与「自动执行切换」分离**（核心语义最后一条），现无：现有 resilience governor
   做的是熔断/降级，不是「保留显式用户选择」。
4. **探针不得阻塞 Ask/Do 主路径**（步骤 6）：`createResilienceGovernor` 有熔断，但没有
   bounded/degraded 的探针缓存语义 —— 需要与 `FRESHNESS` 结合。

## 六、结论：seams 定在哪里

```text
SEAM A (records)   contracts/general-ai-registry-v1/records.mjs
                   -> 扩 spec：enabled/disabled、region、以及把 auth/fault 提升为 availability 原因
SEAM B (registry)  contracts/general-ai-registry-v1/registry.mjs
                   -> 加可逆启用/禁用与「不删除」的移除语义，建立在既有 identity 索引之上
SEAM C (resilience) contracts/general-ai-health-resilience-v1/resilience.mjs
                   -> 已有词汇表作为唯一真相源，RS-201 只做映射与补齐，不另造同义枚举
SEAM D (new)       候选/建议/确认的稳定输出 + 有界探针缓存（允许新增 presentation DTO/port，
                   但不得绑定任何 UI 框架）
```

**给后续步骤的硬约束（来自任务原文，记录在此以免走偏）**：不改 UI design system；不把某个
provider 写死为永久唯一 fallback；不伪造地区支持或登录状态；不因不可用而从 registry 永久删除；
UI 只消费稳定状态，本任务不新增最终页面。
