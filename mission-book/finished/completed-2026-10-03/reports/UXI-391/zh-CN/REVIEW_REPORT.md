# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../REVIEW_REPORT.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# REVIEW REPORT — UXI-391，Mech 复核

```text
REVIEW HOST   = Mech (Mega-rep / 172.31.12.151)   section 3: Alien developed this task and cannot review it
REVIEWED HEAD = 0a41efe50e1e6c7a8dde77edaeb3158636717b91
                (269aa96 when claimed; moved because the AUTHOR applied the repairs my review required)
CI            = run 37088320091, bound to exactly that head, completed SUCCESS, both jobs
BASELINE      = d0507b0 (the UXI-390 acceptance merge)
VERDICT       = REVIEW_COMPLETE - PASS, with gates 9-12 NOT MET pending step 7
```

复核主机 Mech（Mega-rep / 172.31.12.151）；§3 要求开发者 Alien 不得复核。完整复核 SHA 为 `0a41efe50e1e6c7a8dde77edaeb3158636717b91`；领取时为 269aa96，因**作者**应用复核要求的修复而移动。CI run 37088320091 精确绑定新头，已完成且两 job SUCCESS。基线 d0507b0 为 UXI-390 验收合并。历史裁定 **REVIEW_COMPLETE — PASS，但 gates 9–12 尚 NOT MET，等待 Step 7**。

## 1. 领取前与修复头上的 reconciliation

两个头均 **13/13**；各值从自己的来源解析，不读取字段代替核验：记录 head 等于 ls-remote 分支 tip；该头 CI 两 job green；RS-290 contract 与 Utopia main 字节一致；本任务的证据位于**自己的**路径；执行 reconciliation 的控制面 checkout 与 origin/main 同步。

领取能够诚实之前，先修复我的两处仪器缺陷，并保留记录而非悄悄更正：证据检查硬编码 `evidence/raw/mission-book/UXI-390/`，本任务运行时竟计算**另一任务**的证据并报 PASS，是错误工件范围的假通过，是下一层的 wrong-tree failure。CI 检查仅接受 `head -> run` 箭头格式，先对以完整 prose 正确绑定 head 的字段报失败，随后又对七位缩写 head 报失败。

## 2. 逐道门槛：每个 MET 都来自我的测量

| # | 门槛 | 裁定 | 证据 |
|---|---|---|---|
| 1 | 错误前提有 append-only 纠正 | **MET** | erratum 是独立文件，且 UXI-390 工作书保留原错误字段，所以纠正而未改写历史；内容由我的负载测量交叉证实。 |
| 2 | 五维负载与 partial telemetry | **MET** | 我的 **20/20**：自选边界（0% 为已测量零、100% 包含在内、101%/负数/字符串拒绝、memory 守卫、gpu-only 不产出）；自选数值压力语义（partial 命名、0.9 对 0.22 为 binding 而非平均、空为 UNKNOWN 而非 idle、五维）；真实管线的 live node。 |
| 3 | 单机双节点 handoff E2E | **MET** | 我的 **17/17**。 |
| 4 | 真正发生所有权移交 | **MET** | 同轮 `from=mech-a to=mech-b`、epoch 2、同一 task id；跨主机 `from=dualhost-node-a to=mech-review-b`、epoch 2。 |
| 5 | 同一 task id 在 B 继续并达终态 | **MET** | 同轮 COMPLETED，`result={"waitedMs":6000}`，记录执行者为 alternate。 |
| 6 | 结果回到原 surface | **MET** | 我的真实浏览器 **9/9**：同一页面实例，从未刷新、未改指向，显示完成结果；截图显示原 Task Registry 中任务 COMPLETED。 |
| 7 | Alien + Mech 两实体主机验收 | **MET** | 我方真实 LAN **13/13**；开发主机以独立 receipt 记录 **10/10**，指定 `to: mech-review-b`、同一任务 COMPLETED、`reloaded=false`、无 token 泄漏。 |
| 8 | 精确复核头 CI | **MET** | run 37088320091 精确绑定 0a41efe，分支正确、两 job SUCCESS，由 GitHub 解析而非读取字段。 |
| 9 | Utopia main 合并与 main CI | **NOT MET — 等待 Step 7** | 本任务尚未执行 Step 7。 |
| 10 | 记录 `REMOTE_HANDOFF_CLOSEOUT_REPAIRED` | **NOT MET — 等待 Step 7** | terminal_marker 已声明但未签发。 |
| 11 | 生成 `POST_COMPLETION_REENTRY.md` | **NOT MET — 等待 Step 7** | Step 7 交付项，属于顺序问题而非缺口。 |
| 12 | 领取下一本工作书或 typed zero-claim | **等待 Step 7，结果已确定** | 已核验看板：**无其他可执行工作书**（其余 REVIEW_COMPLETE、冻结或已接受；XX-000 是 execution_enabled:false 模板），所以要求 **typed zero-claim**。 |

## 3. 我发现的两个缺陷，以及新头上核验的修复

我记录两个残留，并已为两者产生 live 样本。作者在改动前使用自己的仪器复现两者，然后修复。

**记录的 decline 持久存在，但从不重新评估。** plan 只在 switch-declined 路由消费，所以当时没有合格 alternate 的 decline 永不再读，即使 alternate 随后出现。我的新头仪器结果：

```text
[PASS] the decline is recorded while NO alternate exists
[PASS] (negative) with no alternate present the sweep does NOT invent a destination
[PASS] the recorded decline is honoured AUTOMATICALLY once an alternate becomes eligible, NO second decline
[PASS] same task id, ownership recorded from the original holder
[PASS] idempotency: repeated sweeps do NOT transfer again or move the epoch (2 -> 2)
```

完整释义：无 alternate 时 decline 被记录；负控证明无 alternate 时 sweep 不编造目的地；合格 alternate 出现后自动履行旧 decline，**无需第二次 decline**；同一 task id 记录来自原持有者的所有权；重复 sweep 不再移交或移动 epoch（2→2），保持幂等。

**预留设备死亡后，任务无人能够领取。** 新头结果：

```text
[PASS] the reservation is RELEASED (target=null state=QUEUED)
[PASS] the release is a DISTINCT event - TASK_HANDOFF_RESERVATION_RELEASED
[PASS] a THIRD device takes the released task to COMPLETED with a real result
[PASS] still one task and one completion
```

完整释义：reservation 被释放（target=null、state=QUEUED）；释放是独立事件 TASK_HANDOFF_RESERVATION_RELEASED；**第三台**设备以真实结果将释放任务执行到 COMPLETED；仍只有一个任务、一次完成。

**PASS 9/9，再以另一 task id 重复 9/9。** 两个负控用于捕捉过度积极的修复，而不是直接信任它。

另需记录作者自己的测试捕捉到并补上的半个修复：只清 reservation 字段不够，内存 assignment guard 仍持有死亡设备，导致其他设备依旧被拒。现在释放也解除 guard hold；我的运行证明第三台设备之后确实能领取。

## 4. 对我自身记录的纠正：只列成功的报告不是报告

- **我发布的 finding 描述错误：** 曾称记录的 decline “静默丢弃”。Gateway 事件表明 decline 当时原持有者仍健康，planner DIRECT 与 bridge NOT_APPLICABLE **正确**。已撤回。
- **随后撤回过度：** 仅描述错误；意图不再评估的结论正确，作者自己也复现。我重新确立 finding。同一接口处我向两个方向都犯错，过度纠正更隐蔽：撤回看似谦逊，却丢弃正确测量。**撤回主张，而非证据。**
- **一次跨机尝试我的仪器在终态前退出，**留下 progress=36。责任在我；作者定位后，我将其列为前置。
- **另三处仪器缺陷均属于我，全部修复而非绕过：** locale 假设（UI 显示“在线”而非 ONLINE）、缺 prerequisite 1（独立撞到两次）、我自己的 PowerShell round-trip 造成编码损坏。
- **截断细节险些造成假阴性：** event-name 检查在 raw JSON 匹配上通过，但打印列表截到八项。我重新运行，打印完整列表后才接受。

## 5. 边界：防止过度解读

- **任何 surface 仍不能发 decline。** 修复 change set **没有** apps/web/** 或 apps/android/** 产品代码，因此 offer 可呈现但用户不能操作。这是 Alien 自己的 UXI-390 finding，UXI-391 不关闭它；作为 OPEN **产品项**记录，而非本任务缺陷。
- **参考节点 raw cpu telemetry 间歇为 `{"usagePercent": null}`。** 已在 live telemetry 测量；loadFromTelemetry 正确拒绝而不强转，向量退化为 memory-only，但政策 minimum=1，所以仍 KNOWN。它是节点观测而非接口缺陷。
- **Gates 9–12 待办，未通过。** 本复核不移动这些门槛，也不暗示通过。
- Android 侧 result-return 来自作者记录；Web 侧来自我的记录。

## 6. 证据

`mission-book/reports/UXI-391/review-by-mech/`：`dualhost-b-by-mech.json`、`gate6-result-return.json`（另两张截图）、`handoff-verification.json`、`load-semantics-by-mech.json`、`repair-verification-by-mech.json`；以及叙述记录 VERIFICATION_MECH_*、FINDING_MECH_*、CORRECTION_MECH_*、REESTABLISHMENT_MECH_* 与 `REVIEW_LEDGER_MECH_UXI391.md`。
