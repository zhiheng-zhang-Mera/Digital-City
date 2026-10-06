# RS-201 · Step 1 — Existing GAI implementation audit and registry/runtime seams

> Reading translation / 阅读译本：完整历史阅读版本；原报告为权威记录，代码证据原样保留，不创建第二份任务状态。

```text
任务    = RS-201 动态 AI 池与可用性选择
开发主机 = Alien        基线 = de91f5e（UI_BASELINE_FROZEN 后的 main）
步骤    = 施工步骤 1「审核现有 GAI-002/003/004/005 已合并实现，明确 registry 与 runtime seams」
```

Task: dynamic AI pool and availability selection. Development host Alien, baseline de91f5e, main after UI_BASELINE_FROZEN. Step 1 audits merged GAI-002/003/004/005 and establishes registry/runtime seams. All conclusions were **actually run** on the baseline, not reading impressions.

## 1. Baseline state, checked rather than assumed

```text
contracts/general-ai-registry-v1/tests/conformance.test.mjs      14 tests, 14 pass, 0 fail
contracts/general-ai-health-resilience-v1/tests/conformance.test.mjs  16 tests, 16 pass, 0 fail
```

Registry 14/14 and resilience 16/16 pass, 0 fail. Both frozen contracts green: extend a working foundation, not repair something broken.

## 2. Registry seam: contracts/general-ai-registry-v1/

Entry `createProviderRegistry({handleStore, clock})`, registry.mjs line 91. Two existing constraints directly related to forbidden boundaries **must be retained, not rebuilt**:

1. **No hard-coded provider.** BUILT_IN_IDENTITIES=Object.freeze([]),line20. Task forbids one permanent sole fallback; foundation has none, dynamic pool must not introduce implicit default.
2. **Credentials never enter registry.** `handleStore` must be neutral SecureHandleStorePort; absent throws HANDLE_STORE_REQUIRED,92–94. Records permit handles only. records.mjs proactively rejects raw secret/prototype pollution via findRawSecretFields/Values/ReservedKeyPaths. New fields continue handles.

**Identity index**, lines 110–120: reference identifies one record, immutable parent. Cross-kind reuse/rebinding refuses IDENTITY_COLLISION. This is prior defence for independent reviewer attack on residual references after provider removal. Remove/disable must build on it, not bypass.

Existing queries/typed absence: upsert/getProvider/Model/Account, modelOfProvider/accountOfProvider,listProviders({channel}),listModels({providerRef,fact,level,channel}),listAccounts({providerRef}). Missing is **typed** UNKNOWN_PROVIDER/MODEL/ACCOUNT,MODEL_NOT_IN_PROVIDER,ACCOUNT_NOT_IN_PROVIDER, not null. Unselectable reasons should reuse typed absence, not new string vocabulary.

## 3. Records seam: three records and built-in lifecycle

Canonical PROVIDER/MODEL/ACCOUNT and corresponding SPEC. **Each owns freshness**, mandatory observed_at+ttl_ms; freshnessOf(record,now) yields FRESH/STALE/UNKNOWN. Step 3 prevents stale availability as live truth: clock basis **already exists**. Make availability **consume** it; no new TTL mechanism.

Channel readiness: channels array{channel,readiness}; READY/AUTH_REQUIRED/UNAVAILABLE/UNKNOWN; channels WEB/API.

Account states UNKNOWN/UNAUTHENTICATED/PENDING/AUTHENTICATED/… plus channel_handles provide expired session/not logged in semantics.

## 4. Resilience seam: contracts/general-ai-health-resilience-v1/

Existing vocabulary, **do not reinvent**:

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

Availability/auth/rate/budget/fault/circuit/scope/signal closed sets retained verbatim. Also classifyFailure,DEFAULT_RESILIENCE_POLICY,createResilienceGovernor circuit breaking.

## 5. Actual gaps

Task distinguishes at least seven categories:

| Required category | Existing | Conclusion |
|---|---|---|
| Available | AVAILABILITY_STATES.AVAILABLE | Present |
| Notloggedin/missing credential | AUTH_STATES.MISSING | Vocabulary present, **promote to availability reason** |
| Expired session | AUTH_STATES.EXPIRED | Same |
| Service fault | FAULT_CLASSES+CIRCUIT_STATES | Same |
| Unknown | AVAILABILITY_STATES.UNKNOWN | Present |
| **Region unsupported** | **None** | **Absent** |
| **User disabled** | **None** | **Absent** |

Measured two concepts completely absent:

```text
在 general-ai-registry-v1 与 general-ai-health-resilience-v1 中搜索
enabled|disabled|DISABLED|region|REGION  ->  0 命中
```

Search both contracts enabled/disabled/DISABLED/region/REGION zero hits.

Four other missing counterparts:

1. **User add/remove/enable/disable**: registry only upsert, no remove/disable; remove/delete/disable/retire zero except comment. Task forbids permanent deletion for unavailability. Need **reversible enabled/disabled, unselectable yet retained**, complying not evading.
2. Stable candidate list/unselectable reasons/user confirmation output, step 4 absent.
3. **Suggest switch versus execute switch separation**, last core semantic absent; governor breaks/degrades, not explicit user choice preservation.
4. **Probe must not block Ask/Do main path**, step 6. Breaker exists but bounded/degraded probe cache absent; combine FRESHNESS.

## 6. Fixed seams

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

A records spec expands enablement/region/auth fault availability; B registry reversible enable/disable/non deleting removal atop identity; C resilience existing vocabulary **sole truth**, map/complete no synonyms; D new stable candidate/suggestion/confirmation output and bounded probe cache, presentation DTO/port permitted but no UI framework binding.

Hard constraints from task: no design system change, permanent sole fallback, fabricated region/login, permanent unavailable deletion; UI only stable-state consumer, no final pages added.

语言配对 / Language pair: [原文 / Source](../STEP1_SEAM_AUDIT.md)
