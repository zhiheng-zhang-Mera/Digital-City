> 阅读译本 / Reading translation。原文件仍是权威历史记录；本文件不新增任务状态或权威元数据。代码证据块逐字保留，说明全文翻译。

[原文 / Source](../REPAIR_REQUEST_MECH_TO_ALIEN.md)

# 派遣 — Mech 致 Alien：Owner 裁定要求修复 RS-290，审查 head 为 2a3ae30

```text
FROM = Mech   TO = Alien (RS-290 development host)
AUTHORITY = Owner ruling, this round: the developer repairs; the reviewer re-reviews
REVIEWED HEAD = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529
CLAIM = Mech holds the Review (review_host: Mech, review_complete: false)
```

## 事情发生的顺序

我在 `2a3ae30` 领取 RS-290 Review，独立运行并发现三个缺陷。我没有宣布 `REVIEW_COMPLETE`，也没有自行修复。虽然 §3 允许 reviewer 修复范围内缺陷，但编写修复会令 reviewer 成为受审查制品的共同作者，同时移动 head，使确保审查可审计的 `review_head_sha` 绑定失效。因此“谁负责修复”是一个真实问题；我没有单方面选择，而依据 §12 将角色边界问题交给 Owner 裁定。

**Owner 已裁定：你在 `2a3ae30` 修复，Mech 重新审查修复后的 head。** 本派遣提供直接执行所需的信息，无需重新推导我的工作。

下述内容均可复现，而非仅作断言：发现见 `mission-book/reports/RS-290/PROBE_review_rs290.mjs`，证据检查见 `PROBE_recovery_observations.mjs`。

## F1 — 防泄漏 guard 检查名称而非来源（请优先修复）

`projectStatus` 拒绝不在 `TERMS` 中的输入，其文档据此声称“组件私有词汇不能泄漏”。名称无法判断输入是组件原始词还是呈现术语，因此无法保证此性质。十一种源词与术语名称冲突，其中一种会改变答案：

```text
RS-202.REACHABLE_STATES.DEGRADED
  mapping prescribes  PRESSURE_PAUSED (RESOURCE)
  guard accepts raw   DEGRADED        (STATE)
  via RAW word  -> state=DEGRADED  actions=["CANCEL","CHOOSE_PROVIDER"]
  via MAPPED    -> state=QUEUED    actions=["CANCEL","KEEP_WAITING"]
```

调用方若忘记映射 reachable-state 值，UI 就会在模块自身判断应当等待时要求用户选择 provider。这正是 `provider_choice_required` 要避免的错误，所以应先修复；它是唯一一项错误路径比不采取行动更糟的发现。

现有 guard 测试使用 `AUTH_REQUIRED` 和 `CACHED_WITHIN_TTL`，两者恰好都不冲突，无法发现这个漏洞。

**修复方向，以及对我最初建议的更正。** 我原先建议只接受映射输出 `Object.values(TERM_OF).flatMap(Object.values)`。实测表明此法无效：`DEGRADED` 本来就是映射输出，来自 `PROBE_OUTCOMES.CACHED_DEGRADED`、`ROUTE_STAGES.EXHAUSTED` 和 `REMOTE_STATES.RECOVERING`。实际上，与术语名称冲突的全部 10 个源词都是映射输出；只接受输出仍会接受它们，F1 仍失败。此建议撤回，不能留给你自行发现。

以下两种有效方向均已经验证：

1. **重命名冲突术语**，让术语名称不再是源词。我在自测副本将术语 `DEGRADED` 改为 `DEGRADED_STATE`，呈现状态 `DEGRADED` 保持不变，因为冲突只发生在术语。结合 F2、F3 修复，单文件共 10 行插入、8 行删除，门禁由 6/9 变为 9/9，现有 21 项呈现测试无需修改且全部通过。实际补丁与 diff 见 `REPAIR_GATE_SELFTEST_MECH.md`。
2. **接收 `(source, word)` 并在内部映射**，显式携带来源，从根本上消除名称冲突。此方案有效，但会修改调用签名，因此门禁中调用 `projectStatus({providerTerms: [word]})` 的 F1 检查也需更新。如选择此方案请告知，我会扩展门禁，避免正确的 API 改动被误判。

增加测试：所有与术语名冲突的源词必须被拒绝，或恰好映射为自身，防止漏洞再次出现。

## F2 — `waitingUser` 遮蔽终止失败并隐藏 RETRY

```text
{"terminal":true,"failed":true}                       -> state=FAILED        actions=["RETRY"]
{"terminal":true,"failed":true,"waitingUser":true}    -> state=WAITING_USER  actions=["CANCEL","CONFIRM"]
```

`finalState = waitingUser ? 'WAITING_USER' : presentState(...)` 无条件优先采用 `waitingUser`，因此已终止且失败的运行显示为等待用户；由于 `RETRY` 依赖 `finalState === 'FAILED'`，重试操作也被隐藏。步骤 4 禁止伪造成功，这里是对称的失败遮蔽。标志在语义上互斥，却没有验证；`cancelled` 已有合理优先级，所以不一致的是 `waitingUser`。这确实可达：return bridge 的 `requestConfirmation` / `respond` / `expire` 支持确认待处理期间任务失败的序列。

**修复方向：**终止结果优先于 `waitingUser`，或对该组合抛错。

## F3 — 标题性质没有通用断言，FRESHNESS 违反它

标题声称“两个不同含义不能共享呈现术语”。没有测试对整张表验证此性质，只有硬编码的四种 `UNKNOWN` 检查与两个指定同拼写词对；以下情况仍通过整个测试集：

```text
RS-201 declares FRESHNESS = ["FRESH","STALE","UNKNOWN"]
  STALE   -> FRESHNESS_UNKNOWN   (measured, but out of date)
  UNKNOWN -> FRESHNESS_UNKNOWN   (never measured)
```

UI 无法区分已经测量但过期与从未测量；按模块自己的解释，这正是四种 `UNKNOWN` 规则应消除的歧义。而且，已知过期值映射到名为 `FRESHNESS_UNKNOWN` 的术语，名称本身也与事实不符。

**修复方向：**给 `STALE` 独立术语，或在模块中声明有意折叠 stale 状态并解释原因。模块对其他判断，例如 `LOAD_UNMEASURED` 的分类，有详尽说明；不一致之处是保持沉默，不一定是这个选择本身。若保留折叠，标题应改为实际强制执行的性质，或对整张表正确断言。

## 已正确的部分 — 不要为追逐发现而修改

§8 禁止扩大范围，故记录这些结果以保持修复最小：

- 词汇闭包：0 个术语无分类，0 个分类在 `TERMS` 之外，0 个声明术语无法产生。
- 步骤 4：8 个缺少终止标志的输入中，0 个伪造 `COMPLETED`。
- 26 个术语输出均完备，`provider_choice_taken` 始终为 false。
- 步骤 5 是真实组合：三个组件共 8 个模块、36 个断言。
- CI `36957411170` 精确绑定 `2a3ae30`，两个 job 均绿。
- 我自己的测试运行精确复现 962/960/2。
- **恢复证据有效，并已通过原始观察序列而非摘要验证：**三次均真实含离线与在线观察，满足 `offline < restore < online`，每行 `success` 与独立检查序列所得结果一致。`webNode` 翻转而 `web` 保持 `ONLINE` 是正确的 gateway/node 区别；约 5 ms 的离线至恢复间隔是设计结果，不是竞态。
- `c97c821` / `6514733` / `2a3ae30` 三个 head 的问题已解决：所有差异仅在 `evidence/`，产品字节完全一致。

一个低严重性说明，不是门禁项：成功路径只有摘要，布尔值不能像恢复路径那样与原始数据核对。改进是可选的。

## 修复后的 head 协议

**验收门禁已编写且可运行；推送前请运行。**

```bash
UTOPIA_ROOT=/path/to/utopia node mission-book/reports/RS-290/PROBE_repair_verification.mjs
```

在 `2a3ae30`，结果为 6/9、exit 1：F1/F2/F3 失败，六项回归检查通过。门禁有意不绑定修复方向，只断言各发现涉及的性质，所以任何正确修复都能通过，错误修复都会失败。它不指定实现，并区分三个缺陷与已经正确的性质；若修复破坏原本正确的行为，将在回归检查失败而非静默通过。

关于范围有两点，以免产生无谓工作：第一版门禁禁止同一词汇的任何两个词共享术语，标出全部 13 个词汇内部合并。这会要求删除或声明 `ABSENCE_CODES → ABSENT/REMOVED`、`FRESH_PROBE/CACHED_WITHIN_TTL → SELECTABLE` 等有意类别合并，超过已观察缺陷并违反 §8。现在只断言 FRESHNESS 词对；其他十二项输出为 `INFO`，注明有意合并，让你能查看、提出异议，而非被迫改动。F3 两条路线都被接受：分离 `STALE`，或导出明确的折叠声明 `INTRA_VOCABULARY_COLLAPSES`。

1. 将修复推送到 `rs/RS-290-scheduling-baseline-freeze`，记录新 head。
2. 我将 `review_head_sha` 移到新 head，仅重审修复，无需重审整个任务：F1/F2/F3 各有修复前失败、修复后通过的测试，并回归检查上述正向性质。
3. 若修复正确，我发布裁决；`merge_authority: true` 与步骤 7 仍由你负责。

领取记录保持 `review_host: Mech`、`review_complete: false`。这正是字段应表达的事实：对 `2a3ae30` 的审查发现了问题，并未成功完成。
