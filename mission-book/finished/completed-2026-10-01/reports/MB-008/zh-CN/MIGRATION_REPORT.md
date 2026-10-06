# 迁移报告 — MB-008

[English authoritative source / 英文权威原稿](../MIGRATION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION = MB-008
ROLE = MIGRATION
HOST = Alien
CLAIM_COMMIT = f827756053c456e0e6e682c3ab20d9c98e14c50c
DONOR_BASELINE = zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080
                 zhiheng-zhang-Mera/DS-Hns   @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b
IMPLEMENTATION_BRANCH = mission/MB-008-computer-use
IMPLEMENTATION_HEAD = efdd403f81ad0c1b9f9fca56a2e51829efc6e5ea
IMPLEMENTATION_CI = 36583979374 PASS (gateway-web + android)
MIGRATION_HEAD = aa2a6a8faab779a020d75b93dba548ba3755ce30
MIGRATION_CI = 36584056291 PASS (gateway-web + android)
MIGRATION_COMPLETE = false
```

> ## ⚠ 未完成，也不声称完成
>
> 移植已完成：六个模块、664 项测试、完整 CI 全绿。但 Mission 的“至少完成一次真实产品消费；UI/客户端要求仅复用当前存在的 Utopia 消费面”门槛未满足。这次在移植前就已确定答案：只读调查将供体模块对照现有 Utopia 表达实际执行，得到 `NO_VERDICT_IDENTICAL_SEAM`，每个候选项都有测得的反例。
>
> 按规则 13，主机将 MB-008 标为 `BLOCKED_OWNER_DECISION`。这是第二个被同一门槛阻塞的 mission，首个是 MB-007。第 5 节请求 Owner 为两者统一裁决，MB-009 也会遇到相同问题。

## 1. 落地边界

目标是新增地区 `10-automation`、新增建筑 `01-computer-use-runtime`。

| 模块 | 供体文件 | 测试 |
|---|---|---|
| `execution-contract` | DS-Hns `constants.cjs`、`errors.cjs`、`action.cjs`、`criteria.cjs`、`contract.cjs` | 84 |
| `target-guard` | DS-Hns `target.cjs` | 64 |
| `routing-safety` | DS-Hns `routing.cjs`、`safety.cjs`、`modal.cjs`、`evidence.cjs` | 125 |
| `world-verification` | DS-Hns `world-state.cjs`、`verification.cjs`、`miss.cjs`、`observer.cjs`、`progress.cjs` | 97 |
| `bounded-run` | DS-Hns `stall.cjs`、`state-machine.cjs`、`recovery.cjs`、`stabilization.cjs`、`reconnect.cjs`、`health.cjs`、`resources.cjs` | 164 |
| `backend-surface` | Codex-Boss `computer-recovery.ts`、`action-readiness.ts`、`ui-surface.ts`、`ui-surface-ids.ts`、`semantic.ts`、`permission.ts`、`dom-page.ts`、`provider-dom-surface.ts` | 130 |

六者均声明 `"capabilityProvider": false`，因此 Web 和 Android 能力列表不变。`city/tests/manifest.test.mjs` 的清点范围已扩展，适用 mission-incubation 来源契约。

- **保留行为。** 各模块对应供体的导出、精确字符串、顺序、阈值和封闭词汇；纯函数／可注入接缝只在供体本来具有时提供。各模块独立一致性证据为：`target-guard` 实际运行真实供体模块进行 9 973 次差分比较，0 不匹配；`execution-contract` 运行 10 801 个随机差分案例，0 差异；修正后的 `bounded-run` `alternativeAction` 检查 6 912 个组合，0 不匹配。`backend-surface` 如实说明 43 个向量是源码追溯而非实际执行，因为供体为 TypeScript，而此建筑是无 TS 工具链的普通 JS。
- **供体缺陷原样保留并以测试固定，绝不修复。** `backend-surface` 20 个，`routing-safety` 17 个，`execution-contract` 和 `target-guard` 各 14 个，`world-verification` 10 个，`bounded-run` 11 个。例如：`verification.cjs` 对 `(world, action)` 签名调用 `targetPresent(action, after)`，使 `target_appears`／`target_disappears` 始终返回 `ok: null`；`verdictForOutcome` 永远不能返回自身导出的 `ACTED`；`parseDomTarget` 在 `execute()` 的 `try` 外抛出，导致 `execute()` 拒绝；`ring.last(0)` 返回整个环；`progress.cjs` 读取 `detail.kind`，验证器却发出 `verificationKind`；`FILE_DELETE` 是 `high` 而非 `critical`，所以普通删除不触发 critical 的“必须声明预期效果”规则。数个移植工作曾险些将其“修正”为合理行为，差分工具随后证明供体确实执行源码所写行为；这体现保留指令的价值。
- **延后项**（各模块均有记录）：运行时平面，包括 `executor.cjs`（99 814 B）、`index.cjs`（31 665 B）、`controllers/**`（约 90 KB）、`drivers/**`（约 263 KB，含 PowerShell）、`host-electron.cjs`、`log.cjs`、`mutation.cjs`、`workspace.cjs`、`processes.cjs`、`ports.cjs`、`isolation.cjs`、`autonomy.cjs`；Boss 侧 17 文件中有 11 个延后，包括 `windows-ocr/uia`、`vision`、`provider-vision-surface`、`structured-apps`、`vscode-cli`、`computer-service`、`semantic-runtime`、`perception-loop`、`software-lease`。
- **两项明确排除。** （1）未移植 `src/shared/perception.ts`：这是边界决定，不是避免重复。其唯一消费者为延后的 `perception-loop.ts`，因此词汇落地后没有消费者。调查怀疑可能与 MB-007 重复，但检查证明是误报：MB-007 manifest 只列 `src/shared/research-*.ts`，两个分支都没有 manifest 引用 `perception`。（2）未移植 `createPageRepairExecutor`：它的 `new AbortController().signal` 是虚构接口，而所有真实 `DomPageSurface.evaluate` 都是 Electron 的 `webContents.executeJavaScript`，移植会同时交付虚构行为。
- **唯一接口变化。** `world-state.cjs` 硬编码 `crypto.createHash('sha1')` 并读取 `Date.now()`，没有注入点。移植暴露 `{ now, hash }`。默认摘要仍为供体 sha1 十六进制截取 16 字符，精确长度有断言，因此 `createWorldState(parts)` 精确再现供体。
- **现有 Utopia UI／真实消费路径：没有。** 见第 4 节。

## 2. 测试与运行

- 模块测试 664 项。完整 CI 等价套件：`pnpm test` 58/58，`apps/rooms` 67/67，`node city/test-all.mjs` 794/794，`verify-promotion-history.mjs` 验证 10 记录，`pnpm check:docs` 为 `PAIR_STATUS = SYNCHRONIZED`。
- 真实消费：没有（第 4 节）。
- 失败：没有需要纠正的保真缺陷，但发现并修复了一项真实行为偏差，见第 4 节 D4。这是本 mission 最重要的工程事件。

## 3. Utopia 狗粮／演进交接

`data-records/evolution/inbox/mission-book/MB-008/events.jsonl`：

| 事件 | 类型 | 结果 |
|---|---|---|
| `MB-008:4ba425de0933dc87` | MISSION_CLAIMED | INFO |
| `MB-008:ef9cf276cbb63010` | ATTEMPT_STARTED | INFO |
| `MB-008:69a6b819de80de0b` | CHANGE_APPLIED | INFO |
| `MB-008:7189d8757b9c40de` | TEST_PASS | PASS |
| `MB-008:5a72b750eb33a552` | RUNTIME_FAIL | BLOCKED — 消费门槛 |

没有写入 `MIGRATION_COMPLETE` 事件。`.runtime` 证据为 `.runtime/evidence/mission-book/MB-008/run-001/WORKING_STATE.md` 及调查报告。

## 4. 施工中的问题、选择与判断逻辑

**D1 — 这次先回答消费问题。** 原因：MB-007 在收尾才发现没有接缝，因此受阻。MB-008 在任何移植前委托只读调查，首个交付物必须为 `VERDICT_IDENTICAL_SEAM_FOUND` 或 `NO_VERDICT_IDENTICAL_SEAM`。调查通过实际执行供体而非仅阅读，返回后者。代价：明知最终会受阻仍继续移植；这是有意选择，因为移植本身是 mission 交付物，无论 Owner 如何裁决都有价值。

**D2 — 测得反例（供 Owner 裁决的证据）。**

- 供体工作区副作用门与桥的 `OUTPUT_PATH_FORBIDDEN` 检查：4 个输入中 3 个不同。`{prompt, outDir:'../escape'}`、`{prompt, draft:{}}`、`{prompt, image_generator:true}` 现有实现拒绝，替换后会接受。
- 供体目标／命令保护与 `INVALID_REFERENCE` 遍历检查：9 个中 6 个不同，两者甚至类型不匹配；一方是百分号解码后的 `(ref, subpath)`，另一方是 `path.resolve` 后的文件系统路径。
- 供体焦点／前台／破坏性门与 `platform/windows/*.mjs`、`agents/reference-node/*.mjs`：接缝为空，两者没有任何文件含焦点、前台、对话框或破坏性概念。接线会增加产品行为。
- 供体后置条件／进度／停滞／恢复与 `node/report`：四项独立阻碍。状态词汇交集仅 `{COMPLETED, FAILED}`；`progress.cjs` 计数证据种类，而非网关 0–100 百分比；`node/report` 完全不验证后置条件，且每个供体求值器需要延后的 `controllers/**` 与 `drivers/**` 事实；`classifyRetention(undefined)` 会丢弃 `theme-artifacts.mjs` 保留的内容。
- 整个界面中最接近的一对（mission 并未点名），`createWorkspaceGuard().resolvePath` 与 `FilesystemAdapter.path`，14 个输入仍有 5 个不同；供体会接受根目录内绝对路径，而 adapter 拒绝。

**D3 — 为什么 mission 内部无法满足门槛。** 满足它必须：（a）向 Web／Android 读取的列表增加能力，形成新产品界面；规则 14 和 MB-008 自身“不得新增 OS 后端、视觉模型或自动化动作类型”禁止此举；（b）改变现有判定，违反验证门要求现有 Evidence Engine 验收持续通过；或（c）将某能力指向另一建筑模块，这也正是 MB-007 D1 禁止的事情。

**D4 — ⚠ 单一来源标准发现真实行为偏差。** 问题：为并行移植，每项工作被要求“不要导入同级模块，所需内容本地声明”。结果四个房间分别声明供体共享词汇，`bounded-run` 还复制 `target.cjs` 的 `revalidate` 并内嵌 `routing.cjs` 的 `CHANNEL_PLANS`。内嵌表并不等价：其 `DOM_TYPE: ['dom','accessibility','gui']`，供体则为 `['dom','accessibility']`。当 DOM_TYPE 的两个结构化通道都耗尽时，供体重新规划，复制表却提供路由器从不选择的 gui 回退。错误表下 159 项测试全部通过，因为没有测试覆盖该级。

修复：`bounded-run` 现在从 `../target-guard/target.mjs` 导入 `revalidate`，从 `../routing-safety/routing.mjs` 导入 `CHANNEL_PLANS`／`fallbackChannels`；删除副本；身份一致性测试证明交付绑定就是同级模块自身对象，而非使用 `deepEqual`（值测试可能放过漂移副本）。将 `alternativeAction` 对供体逐字转写重新检查 6 912 组合，0 不匹配。原 159 测试不变且全部通过，加身份套件后为 164。

这是该标准第三次体现价值：此前有 MB-006 重复校验和函数和 MB-007 四套重复词汇。这是报告中支持将“共享词汇或表只有一个归属”作为常设迁移规则、而非各 mission 临时选择的最强理由。

明确保留项：供体常量词汇仍在四个房间分别声明，移植时值相同，每个房间 `DONOR.json` 列出精确绑定。这是公开边界，不是隐藏问题。

**D5 — `capabilityProvider: false` 第四次使用。** registry 与 `manifest.mjs` 修改块同 MB-003／MB-006／MB-007，预计可干净合并。MB-001 同一目的仍用地区级 `kind: "infrastructure"`；MB-008 又新增整个地区，因此冲突范围再次扩大。

**D6 — 环境。** `pnpm` 不在 PATH，使用 `corepack pnpm@11.19.0`；`pnpm mission:event -- --mission …` 转发字面量 `--` 而失败；`mission:event` 摘要超过 1000 字符会以退出码 2 拒绝，本 mission 遇到三次。

## 5. 交给 Owner 的裁决请求

两个 mission 现因相同根因受同一门槛阻塞，MB-009 将成为第三个。MB-001／MB-003／MB-006 能满足，只因为现有产品路径恰好存在精确机制重接线。MB-007／MB-008 是基础设施／流水线迁移，其真实消费者将是新产品界面，而规则 14 禁止为验收创建它。

请求 Owner 一次裁决覆盖 MB-007、MB-008，并预先处理 MB-009：

1. **接受边界。** 将“验证主机的有界链执行迁移模块”视为满足门槛，并修订 MB-007／MB-008（及 MB-009）措辞。必须有明确 Owner 裁决，主机不能自行决定。
2. **每个 mission 授权一次特定消费。** 指定界面并明确授权属于该 mission，因为它增加 Web／Android 能力列表。
3. **取代。** 规则 13 禁止第三主机悄然接管；若要移植无消费落地，应通过明确的取代 Mission。

两项移植已完成、经过一致性测试、以 `capabilityProvider: false` 注册，且必需 CI 全绿，所以三种裁决都可作用于已完成工作。

## 6. 已知限制

1. 六模块均无产品消费者（D2、D3）。
2. 四房间共享词汇重复已声明但未合并（D4）。
3. 运行时平面未迁移，因此这是库而非可工作 computer-use 运行时；无执行器、控制器、驱动或 OS 后端，MB-008 禁止新增它们。
4. `backend-surface` 一致性为源码追溯而非实际执行；`semantic.ts`、`permission.ts` 原本没有任何供体测试，本移植首次覆盖其行为。
5. 验证门要求两台主机各执行一个真实、供体支持的桌面／文件／shell／UI 有界动作并验证后置条件。迁移主机没有尝试，且不能模拟此项。
6. 托管 CI 结果记录于 `IMPLEMENTATION_CI`；分支未合并，未运行 `mission:finalize`。

## 7. 交给验证主机

MB-008 验证阶段未开放。规则 13 要求 `BLOCKED_OWNER_DECISION` mission 在 Owner 裁决前不能由第三主机接管。

- `city/10-automation/01-computer-use-runtime/*/DONOR.json`：各模块边界，最值得阅读 `knownDifferences`，其中逐项列出以测试固定的保留供体缺陷。
- `bounded-run/tests/identity.test.mjs` 与三条同级导入：D4 修复；应尝试打破身份断言。
- 差分工具位于仓库外且已删除，应从 `D:\DS-Hns-donor`（`eeb57ca`）和 `D:\Codex-Boss-donor`（`8df428e`）重新推导一致性，不要仅相信报告。
- `services/capability-bridge/registry.mjs`、`city/manifest.mjs`、`city/tests/manifest.test.mjs`：能力提供者标志、新地区和清点。
- 第 5 节：裁决请求。
- 分支 HEAD 为 `zhiheng-zhang-Mera/utopia` 的 `mission/MB-008-computer-use` 上 `aa2a6a8faab779a020d75b93dba548ba3755ce30`。
- 迁移主机未合并，也未运行 `pnpm mission:finalize`。
