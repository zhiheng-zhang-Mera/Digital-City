# DS-Hns 遗留能力缺口暂存 / DS-Hns Legacy Capability Gaps

> STATUS: **RECORDED_FOR_FUTURE_MAJOR_DEVELOPMENT**
>
> REVIEW_DATE: **2026-10-02**
>
> SOURCE_PROJECT: `zhiheng-zhang-Mera/DS-Hns`
>
> SOURCE_MAIN_SHA: `eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b`
>
> NOTE: this SHA is also the DS-Hns donor snapshot already recorded by Digital-City on 2026-09-29; current DS-Hns `main` is still identical to that snapshot.
>
> TARGET_DECISION: **DEFERRED — NO CITY BUILDING / DISTRICT PLACEMENT DECISION IN THIS RECORD**

## 目的 / Purpose

本目录记录 DS-Hns → Digital-City / Utopia 清点中发现的：

- 尚未完整转交的通用能力；
- 只迁了抽象/合同，但还没有具体执行器的能力；
- 已被新架构部分替代，但仍值得未来做 donor diff 的能力；
- 可能对未来“万能个人终端 / 长时间托管 / 少人工干预”有价值、但目前不应阻塞主线的能力。

本记录**不是施工书**。不代表现在要从 Hns 搬代码，也不代表这些能力应该归属某栋楼。

未来进入新的大型开发阶段时，再逐项判断：

1. 当前 Utopia 是否已经自然补上；
2. DS-Hns 旧实现是否仍代表正确方向；
3. 哪些只需要复用设计，哪些代码值得 donor harvest；
4. 是否已被 Engineering Manager / Capability Fabric / Remote Fabric / General AI Gateway 等新机制 supersede；
5. 是否值得实现；
6. 最终放在哪里。

## 当前冻结规则 / Hold Rules

在未来明确启动专项之前：

- **不创建对应 City Building。**
- **不决定 District 归属。**
- **不从 DS-Hns 建立运行时依赖。**
- **不为这些缺口创建当前施工任务。**
- **不阻塞 Utopia 当前 UI、调度、Remote、Assistant、General AI Gateway 等主线。**
- **不整包迁移 Hns。**
- **优先比较新架构，再决定是否 donor harvest。**
- DS-Hns 保持“历史/现有施工队实现”身份；这里记录的是未来可复用能力，不改变其当前项目边界。

---

# 已确认基本完成转交的 Hns 主能力

以下不列入 legacy gap：

- **Engineering Runtime / Project Foreman 主体**：Hns `app/engineering/*` 的主要模块在 Utopia `city/02-engineering/01-project-foreman/project-foreman/*` 已有完整对应，并新增 CI repair / correction / failure recovery。
- **Engineering Manager V1 核心语义**：Job/Result/Artifact、connector registry、LOCAL_FIRST placement、remote Sub-worker return/control、credential/profile/session、runtime health/recovery、Foreman DAG/worker pool、reference connectors、connector SDK、Utopia task surface 已完成并合入 Utopia main。
- **Host Health**：已形成独立/迁入实现。
- **Restart Recovery**：已形成独立/迁入实现。
- **Computer Use 主执行层**：已进入 Utopia `city/10-automation/01-computer-use-runtime`。
- **Theme Engine**：已进入 Utopia Control Centre 相关实现。
- **Skill Intake 的格式/来源/目录/归档安全基础**：已经从 Hns donor 迁入 Utopia，但完整安装/删除生命周期仍见 HLG-005。

---

# 缺失 / 未完整转交能力清单

## HLG-001 — Concrete Local Sub-worker Executor Runtime / 具体本地 Sub-worker 执行器

**Hns 原能力：**

- 独立纯 Node executor process；
- stdio NDJSON versioned protocol；
- Task / Result objects；
- explicit `operations[]` scripted execution；
- WorkerManager；
- state machine；
- event bus；
- reporter；
- snapshot；
- ownership；
- profiler / metrics；
- crash recovery；
- user pause/resume/cancel/take-over；
- local persistence；
- Live View；
- workspace modes。

**当前判断：** `PARTIAL_ABSTRACTION_MIGRATED_EXECUTOR_MISSING`

Utopia Engineering Manager 已迁入：

- SCRIPTED_EXECUTOR 语义；
- DAG / worker pool；
- LOCAL_FIRST；
- remote fallback；
- generic managed-process runtime；
- worker/task contracts。

但当前 Utopia 树中没有看到 DS-Hns `app/sub-worker/*` 等价的**具体本地 scripted executor runtime**。

未来评审时要区分：

```text
Foreman / scheduler / placement
!=
actual local executor process
```

**Boss/Hns 参考：**

- `app/sub-worker/**`
- `docs/sub-worker.md`

---

## HLG-002 — Generic Plugin Lifecycle Platform / 通用插件生命周期平台

**Hns 原能力：**

- `dshns.plugin/v1` contract；
- installed / enabled / loaded / healthy 四态分离；
- plugin manager；
- capability dependency resolution；
- capability collision refusal；
- event bus + listener isolation；
- layered config manager；
- resource manager；
- health supervisor；
- fault levels：SOFT / DEGRADED / FATAL；
- declared fallbacks；
- plugin lockfile / drift enforcement；
- enable / disable / load / unload / reload / health。

**当前判断：** `MISSING_GENERIC_EQUIVALENT`

Utopia Capability Fabric 解决“有哪些能力、谁提供、如何路由/调用”，但不等价于一个**可挂载、可卸载、可降级、可健康检查的通用插件宿主**。

该项与 Boss legacy record 中的 Generic Plugin Runtime 有重叠；未来应合并评审。DS-Hns 是更成熟的 operational donor 之一。

**Hns 参考：**

- `app/core/contracts/plugin.cjs`
- `app/core/plugin-manager/**`
- `app/core/capability-registry/**`
- `app/core/event-bus/**`
- `app/core/config-manager/**`
- `app/core/health-supervisor/**`
- `app/core/lockfile/**`
- `docs/plugin-platform.md`

---

## HLG-003 — Plugin Adapter / Compatibility / Isolation Framework / 插件适配、兼容与隔离框架

**Hns 原能力：**

- detector → adapter → standard descriptor；
- Native Hns / Cordis / DSH / Process 等适配器；
- runtime kinds：
  - in-process；
  - isolated-process；
  - declarative；
  - remote（词表预留）；
- process boundary；
- adapter fault isolation；
- batch adaptation；
- bounded error reporting；
- permission declaration；
- failed adapter 不影响其它插件与产品启动。

**当前判断：** `MISSING_GENERIC_EQUIVALENT`

Engineering Connector Adapter 只服务 Engineering worker/provider，不应被误当作通用插件适配层。

未来如果建设通用 extension/plugin ecosystem，应重新评估此 donor。

**Hns 参考：**

- `app/core/plugin-adapters/**`
- `app/core/plugin-compat/**`
- `docs/plugin-adapters.md`

---

## HLG-004 — Plugin Store / Live Install / Hot Reload / 插件商店与真实安装链

**Hns 原能力：**

- GitHub discovery；
- repository/default-branch inspection；
- manifest preflight；
- 不确定时不错误拒绝；
- 拒绝无效插件时零下载/零残留；
- staging；
- install pipeline；
- installed records；
- enable / mount；
- community install；
- hot reload；
- store failure isolation。

**当前判断：** `MISSING_GENERIC_PLUGIN_STORE`

Utopia 当前 Skill Intake 不等价于 Plugin Store。

未来若做 Skill/Plugin Store，应避免重新发明已有的：

```text
discover
→ inspect
→ preflight
→ stage
→ validate
→ install
→ mount
→ health
→ rollback/remove
```

**Hns 参考：**

- `app/core/plugin-install/**`
- `app/extensions/mega/store/**`
- `app/extensions/mega/plugins/**`
- `docs/plugin-store-live-install.md`

---

## HLG-005 — Full Skill Manager Lifecycle / 完整 Skill 安装、删除与已安装管理

**Hns 原能力：**

- offline curated + live GitHub search；
- GitHub URL / repo / subtree / raw file / local path；
- tar safety；
- stage before install；
- real install into Harness skill root；
- installed-set detection；
- single delete；
- batch delete；
- collection delete；
- live refresh without Harness restart；
- UI management surface。

**当前判断：** `PARTIAL`

Utopia 已经迁入：

- skill format；
- source parsing；
- catalog；
- archive inspection / safety；
- discovery/intake。

但 Utopia donor code明确**没有把 filesystem extraction/install/remove lifecycle 一起带过来**。

未来需要判断 Skill 管理应该：

- 直接管理某个 provider 的 skill root；
- 还是形成 Utopia 自己的 skill package/install abstraction；
- 或继续只做 intake，让 connector/provider 自己安装。

**Hns 参考：**

- `app/extensions/mega/skills/**`
- `docs/skills-management.md`

---

## HLG-006 — Engineering Acceleration Pack / 工程施工加速能力包

**Hns 原能力：**

- repo-map；
- dirty-context；
- context-cache / high-performance context reuse；
- reasoning-governor；
- tool-batcher；
- command-cache；
- persistent-tools；
- incremental-validation；
- patch-first；
- parallel-executor；
- workspace-isolation。

**当前判断：** `PARTIALLY_SUPERSEDED_REQUIRES_DIFF`

已经被 Utopia 新架构部分吸收的内容包括：

- DAG 并发；
- resource-aware worker count；
- write-scope conflict handling；
- worktree isolation；
- focused / affected / full verification 的部分思想。

仍未看到明确等价物的重点包括：

- repo graph/map；
- dirty-context budgeting；
- stable context cache；
- reasoning level governor；
- read-side tool batching；
- verified command-result cache；
- persistent shell/LSP/browser/model sessions；
- patch-first mutation policy。

未来必须逐项 diff，而不是整包复制。

**Hns 参考：**

- `app/plugins/acceleration/**`
- `docs/plugin-platform.md`

---

## HLG-007 — Owner-Result Routine Decision Interceptor / 少打扰用户的自动决策层

**Hns 原能力：**

普通问题先分类：

```text
HARD_BLOCKER
vs
DECIDABLE
```

只有这些 hard blockers 默认需要用户：

- 不可自行获得的权限/凭据；
- 不可逆外部行为；
- 已证明无法兼容的目标冲突；
- 真正不存在的必需外部资源。

普通：

- “是否继续”；
- “是否重试”；
- A/B 方向选择；
- routine implementation choice；

可按确定性 policy 自动继续，并写入 decision ledger。

还包含 direction-stall ladder：

```text
AUTO_DECIDE
→ STRONG_STEER
→ INDEPENDENT_DECISION
→ FRESH_EPISODE
```

**当前判断：** `MISSING_EQUIVALENT_POLICY`

Utopia Engineering Attention / Return Control 已经能把阻塞问题送回用户当前设备，但“**哪些问题根本不该打扰用户**”这一层没有看到完整等价实现。

未来如果继续追求无人干预施工，这是高价值 donor。

**Hns 参考：**

- `app/extensions/mega/autonomy/question-interceptor.js`
- `app/extensions/mega/autonomy/decision-ledger.js`

---

## HLG-008 — External-Agent Semantic Progress + Recovery Supervisor / 外部 Agent 语义进度与恢复梯

**Hns 原能力：**

- headless / official-session 不同 observation；
- WORKING / SLOW / STALLED / FAILED；
- stale busy 不算活着；
- soft deadline → probe；
- hard stall → recovery；
- bounded continuation；
- model-done != verified-complete；
- R0–R8 recovery ladder；
- provider replacement；
- straggler / quorum policy；
- waiting episode 释放 scheduler slot。

**当前判断：** `PARTIAL`

Project Foreman 已有 supervisor/verifier/recovery；Engineering Manager 有 runtime health、retry/reassignment。

但这些更多面向 Engineering runtime / process health。

Hns Mega autonomy 对**外部 agent/session 的语义进度观察、probe、re-steer、session recovery、alternate provider、fresh episode**仍有独立 donor 价值。

未来需要与 Boss Runtime Intelligence / Continuation Intelligence 一起合并评审，避免出现两套相似调度脑。

**Hns 参考：**

- `app/extensions/mega/autonomy/progress-observer.js`
- `stall-detector.js`
- `continuation-controller.js`
- `episode-supervisor.js`
- `result-validator.js`

---

## HLG-009 — Optional Module Protection + Warm Startup / 可选模块保护层与热启动恢复

**Hns 原能力：**

Protection Layer：

- optional module failure 不允许拖垮主产品；
- module state：
  - DISABLED
  - STARTING
  - HEALTHY
  - DEGRADED
  - FAILED
  - RECOVERING
- bounded startup time；
- immediate retry + delayed retry + stop；
- fallback chain；
- uniform health/status reporting。

Startup Cache：

```text
restore first
→ verify after
```

缓存只作为 warm-start hint，不夺取真实 owner 的 authority。

**当前判断：** `MISSING_GENERIC_EQUIVALENT`

Host Health / Restart Recovery 不能完全替代“**可选功能故障隔离 + 产品先可用 + 后台恢复增强功能**”。

未来 Utopia 模块数量继续上升时值得重新评估。

**Hns 参考：**

- `app/extensions/mega/protection/**`
- `app/extensions/mega/startup-cache.cjs`
- `docs/startup.md`

---

## HLG-010 — Terminal Task Notification / Exactly-Once Alert Pipeline / 任务终态通知

**Hns 原能力：**

- session/task terminal observer；
- COMPLETED / FAILED / CANCELLED terminal normalization；
- exactly-once terminal event；
- taskId + state + epoch dedupe；
- desktop notification；
- configurable sound；
- notification failure 不影响任务状态；
- startup priming，避免旧历史重新报警。

**当前判断：** `MISSING_GENERIC_PRODUCT_EQUIVALENT`

Engineering Attention 已覆盖“现在需要用户回答”的提醒，但与“后台任务结束了，告诉用户一次”不是同一语义。

未来个人终端后台任务真正变多以后，再决定是否建立统一通知中心。

**Hns 参考：**

- `app/extensions/mega/tracker/**`
- `app/extensions/mega/notifications/**`

---

## HLG-011 — Provider Cost / Balance / Quota / Off-Peak Scheduling / Provider 成本与额度感知

**Hns 原能力：**

- provider account balance lookup；
- module-open auto refresh；
- concurrent refresh coalescing；
- provider failure isolation；
- stale-last-success semantics；
- pricing repository；
- cost calculation；
- peak/off-peak engine；
- scheduled/off-peak queue。

**当前判断：** `OPTIONAL_REUSE_NOT_CURRENT_CORE_GAP`

Digital-City 之前把 Hns billing 视为 Hns-local，这是合理的。

但 General AI Gateway / Engineering connectors 未来如果要进行：

- provider quota awareness；
- account balance；
- cost-aware routing；
- off-peak execution；

可以重新收割这些机制。

默认不迁。

**Hns 参考：**

- `app/extensions/mega/billing/**`
- scheduler cost/peak integration

---

## HLG-012 — Long-Hosting Soak / Chaos Qualification / 长时间托管压力与故障注入验收

**Hns 原能力：**

- synthetic 6h / 12h / 24h soak；
- real-time long-host entry；
- injected faults；
- longhost chaos；
- restart/recovery verification；
- task continuity verification；
- resource growth checks；
- “程序进程恢复”与“任务语义恢复”区分；
- combined acceptance 对 long hosting 的明确 gate。

**当前判断：** `MISSING_EQUIVALENT_QUALIFICATION_HARNESS`

Utopia 已有大量单测、CI、实机 Android/Windows 验收以及 Health/Restart 实现，但当前树里没有找到 Hns 这种明确的 longhost soak / chaos qualification harness。

未来如果 Utopia 要正式声称：

```text
用户可以长时间不干预
→ 崩溃/重启/暂时故障后任务仍能继续
```

应重新建立真实 long-host qualification，而不是只凭模块单测推断。

**Hns 参考：**

- `scripts/longhost-acceptance.cjs`
- `scripts/longhost-soak.cjs`
- `scripts/longhost-chaos.cjs`
- `docs/acceptance/LONGHOST-ACCEPTANCE.*`

---

# 明确不作为未来 City/Utopia 缺口记录的 Hns 本地实现

以下默认继续视为 DS-Hns/provider-local，不因存在旧实现就要求迁移：

- official DeepSeek Harness shell embedding；
- Alien/Mega Dock 具体窗口壳；
- DSH-specific browser/session glue；
- DeepSeek-specific auth/updater；
- DS-Harness Windows installer/bootstrap；
- DS-Hns launcher/tray/icon；
- frosted-glass Dock 具体 UI；
- project-local settings/history paths；
- Harness version-align helper；
- 纯 DS-Hns package/update plumbing。

如果未来 Utopia 自己需要 installer/updater，应重新设计 Utopia 的产品安装模型，而不是复制 DS-Hns 壳。

---

# 与 Boss Legacy Gaps 的交叉项

未来大开发阶段应把两个 legacy review 一起读，尤其：

### Plugin / Extension

- Boss：Generic Plugin Runtime / sandbox / credential boundary；
- Hns：成熟 plugin manager、adapter、compat、store、lockfile、health/fallback。

**不要做两套。**

### Runtime / Autonomy

- Boss：Runtime Intelligence、Adaptive Provider Intelligence、Self Evolution；
- Hns：question interceptor、semantic progress observer、stall/recovery ladder、engineering acceleration。

**目标应是一个统一的 runtime intelligence / autonomy architecture，而不是把两边旧模块同时复活。**

### Long-running reliability

- Boss：State Core / diagnosis / case record；
- Hns：health/restart/task continuity/longhost chaos。

后续应组合成：

```text
state truth
+ health
+ diagnosis
+ recovery
+ continuity
+ long-host qualification
```

而不是重复建设。

---

# Future Review Gate

未来启动专项前执行：

```text
HNS_LEGACY_GAP_REVIEW
```

至少回答：

1. 当前 Utopia 是否已经覆盖？
2. 是否与 Boss legacy gap 重复？
3. 该能力应该留在 Engineering，还是已变成通用产品能力？
4. Hns 代码是否还适合直接 donor harvest？
5. 能否只复用 contract / tests / failure semantics，而重写实现？
6. 是否需要真实多设备/长时间数据才能证明价值？
7. 该能力是 Utopia 必需能力，还是仅 provider-local 优化？

允许结论：

```text
SUPERSEDED
NO_EXTRACTION
KEEP_IN_HNS
KEEP_AS_REFERENCE
HARVEST_DESIGN_ONLY
HARVEST_TESTS_ONLY
```

---

**当前结论：**

```text
DS_HNS_LEGACY_CAPABILITY_GAPS = RECORDED
PLACEMENT_DECISION            = DEFERRED
IMPLEMENTATION                = NOT_STARTED_BY_DESIGN
CURRENT_UTOPIA_WORK           = UNBLOCKED
```
