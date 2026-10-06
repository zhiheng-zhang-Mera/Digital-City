> 阅读译本 / Reading translation。原文件仍是权威历史记录；本文件不新增任务状态或权威元数据。代码证据块逐字保留，说明全文翻译。

[原文 / Source](../REVIEW_FINDINGS_MECH.md)

# RS-290 — Mech 独立审查发现

```text
REVIEWER      = Mech      DEVELOPER = Alien      (different physical hosts, §3)
REVIEWED HEAD = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529
VERDICT       = DEFECTS FOUND — NOT REVIEW_COMPLETE
DISPOSITION   = returned for repair; repair is the development host's, see "Disposition" below
```

三个缺陷均以可执行 probe 针对真实模块复现，而非仅阅读源码；每项都有展示问题的实例。

## F1 — 防泄漏 guard 检查名称而非来源，一个原始词获得错误术语

`projectStatus` 拒绝不在 `TERMS` 的内容：

```js
if (!TERMS.includes(term)) throw new Error(`${term} is not a presentation term; raw component words must be mapped first`);
```

文档据此声称“每个输入都经过上面的映射，组件私有词汇不能泄漏”。测试用 `AUTH_REQUIRED` 与 `CACHED_WITHIN_TTL` 断言此点，两者恰好均不与术语名冲突。

十一种源词与声明术语名称冲突，其中一种改变答案。`RS-202.REACHABLE_STATES.DEGRADED` 是原始词，规定应映射为 `PRESSURE_PAUSED`，分类为 `RESOURCE`；但 `DEGRADED` 自身也是声明术语，guard 原样接受：

```text
RS-202.REACHABLE_STATES.DEGRADED
  mapping prescribes  PRESSURE_PAUSED (RESOURCE)
  guard accepts raw   DEGRADED        (STATE)

  state via the RAW word     = DEGRADED   actions = ["CANCEL","CHOOSE_PROVIDER"]
  state via the MAPPED term  = QUEUED     actions = ["CANCEL","KEEP_WAITING"]
```

错误路径在 pool 仅承受压力时要求用户选择 provider，并隐藏 `KEEP_WAITING`。这正是设计 `provider_choice_required` 时要避免的错误；模块自身注释说明饱和 pool 应等待，而非作决定。因此 guard 在关键处失效，错误答案就是它本应防止的结果。任何忘记映射 reachable-state 值的调用方都能触发，而 guard 存在正是为了这类调用方。

**修复方向由你选择，而非由我强制：**名称无法区别原始词与术语，需要来源信息；只接受来自 `Object.values(TERM_OF)` 的值，或接收 `(source, word)` 并内部映射，或重命名冲突术语，让术语名不再是源词。此处保留当时的建议记录，不更新为后续更正。

## F2 — `waitingUser` 覆盖 terminal/failure，遮蔽失败并隐藏 RETRY

```text
{"terminal":true,"failed":true,"waitingUser":true}  -> state=WAITING_USER  actions=["CANCEL","CONFIRM"]
{"terminal":true,"waitingUser":true}                -> state=WAITING_USER  actions=["CANCEL","CONFIRM"]
{"terminal":true,"failed":true,"cancelled":true}    -> state=CANCELLED     actions=[]
```

`finalState = waitingUser ? 'WAITING_USER' : presentState(...)` 无条件优先采用 `waitingUser`，使已终止且失败的运行被报告为 `WAITING_USER`。两项用户可见后果：

- 已结束的失败运行显示为用户还应采取行动，错误呈现结果。
- 不提供 `RETRY`，因为它依赖 `finalState === 'FAILED'`；需要恢复的状态及恢复操作都被隐瞒给唯一需要它们的用户。

步骤 4 的规则是“不为 UI 制造成功”。这里是同一纪律的对称违反：没有伪造成功，却遮蔽失败。标志语义互斥但没有验证；`cancelled` 优先级合理，所以不一致的是 `waitingUser`。

**修复方向：**终止结果应优先，或对组合抛错。可达性需要明确：任务失败时确认仍待处理是 return bridge 的真实序列，它有显式 `requestConfirmation` / `respond` / `expire` 步骤。

## F3 — 标题性质未在任何地方断言，FRESHNESS 违反它

模块标题声称 UI 消费者需要以下性质：

> 随附测试断言的性质强于“没有重复单词”：两个不同含义不能共享呈现术语。

实际上没有此断言。两个相关测试只是抽查：一个硬编码四种 `UNKNOWN`，另一个检查两个指定同拼写词对。没有测试遍历整表，因此其他地方的折叠可通过整个套件，以下即为实例：

```text
RS-201 declares FRESHNESS = ["FRESH","STALE","UNKNOWN"]
  FRESH   -> SELECTABLE
  STALE   -> FRESHNESS_UNKNOWN     <-- measured, but out of date
  UNKNOWN -> FRESHNESS_UNKNOWN     <-- never measured
```

UI 无法区分“已经测量，但测量过期”与“从未测量”；这与模块四种 `UNKNOWN` 规则要消除的歧义相同，其原话是“将尚未测量可用性与无法看见 executor 呈现得完全相同”。术语名为 `FRESHNESS_UNKNOWN`，却作为已知过期 freshness 的映射目标，因此对 `STALE` 作了不实断言。当前 `node --test contracts/rs-presentation-contract-v1/tests/*.test.mjs` 仍全部通过，21/21。

**修复方向：**分离 `STALE`，例如 `FRESHNESS_STALE`；或说明有意将过期折叠到 unknown 并记录原因。模块详述其他判断，尤其 `LOAD_UNMEASURED` 的分类，这里沉默才是不一致之处。

## 记录我自己的错误：第一次 probe 多报 13 项

第一轮标出 13 个词汇内部“违反”性质的情形。检查后，多数是 probe 粗糙而非缺陷，故记录更正，而不是只保留标题：

- `ABSENCE_CODES`：五个词映射 `ABSENT`，三个 `RETIRED_*` 映射 `REMOVED`，恰好保留模块所说 RS-201 tombstone 设计需要的 `ABSENT` 与 `REMOVED` 区分；属于有意行为。
- `PROBE_OUTCOMES.FRESH_PROBE` 与 `CACHED_WITHIN_TTL` 映射 `SELECTABLE`，共同含义为“数据足够新”；属于有意行为。
- 六个 `ABSENCE_CODES` 映射 `POLICY_EXCLUDED`，比原六代码粗，值得判断说明而非缺陷：`HAS_DEPENDENTS` 与 `RAW_SECRET_FORBIDDEN` 等六种迥异情况归在同一 bucket。

只有 FRESHNESS 是可辩护的发现。我用“同一词汇两个词共享术语”的启发式，不能区分类别粗化与信息丢失，并且先应用规则、后检查意图。这是此 programme 第四次由执行纠正我的 probe 过度主张。

## 独立验证正确的部分

正向结果也应报告，因为只列缺陷不能告诉读者实际测试了什么：

| 检查 | 结果 |
|---|---|
| `TERMS` / `TERM_CLASS` 闭包 | 0 个术语无分类，0 个分类在 `TERMS` 之外，每个声明术语可达 |
| 步骤 4 不伪造成功 | 8 个缺少终止标志的输入中，0 个产生 `COMPLETED` |
| 输出词汇完备 | 对全部 26 个术语逐项扫查，0 个未声明状态或动作；`provider_choice_taken` 始终 false |
| 步骤 5 组合 | 从 RS-201/202/203 导入 8 个组件模块，36 个断言，真实组合而非重跑组件套件 |
| §7 CI 绑定 | `gh run 36957411170` 的 headSha `2a3ae30a…` 等于记录 head；分支匹配，两个 job success |
| 套件复现 | 我的运行 962 / 960 / 2，精确等于作者数字；两项为既有 `CORRUPT_INPUT` 失败 |
| E2E 证据 | 恢复 3/3 `success=true` 且 `onlineObservedAt` 已填；成功路径 `COMPLETED`，完整七事件生命周期 |
| 三个 head 问题 | `c97c821` / `6514733` / `2a3ae30` 仅在 `evidence/` 不同，产品字节一致，两项证据沿用有效 |

## 处置 — 决定及理由

**不宣布 `REVIEW_COMPLETE`，不自行修复。**

§3 允许 reviewer 直接修复范围内缺陷，但我有意拒绝：这些是 RS-290 自身交付物的缺陷，Alien 仍是开发主机，`merge_authority: true` 表示合并与冻结在审查之后。reviewer 编写修复就成为受审查制品的共同作者；programme 最反复强调的正是 §3 独立性：“同一主机不能因为另一台暂时不可用就自行兼任独立复核”。修复还会移动 head，使确保可审计的 `review_head_sha` 绑定失效。

因此退回 `2a3ae30` 修复，之后我重审新 head。claim 保留 Mech，`review_complete` 保留 false；这些字段准确表达的是发现问题，而非成功完成审查。

优先修复 F1：它是唯一错误路径比不采取行动更糟的发现，在本可等待时要求选择 provider。
