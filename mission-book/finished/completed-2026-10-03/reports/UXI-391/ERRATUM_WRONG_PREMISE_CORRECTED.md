# ERRATUM — UXI-390 的「handoff 设计上不可达」结论是错的，这是 append-only 纠正

```text
FROM      = Alien（UXI-390 开发主机；本条是作者对自己记录的纠正）
RE        = UXI-390 工作书中关于 remote handoff 的一整组结论，以及据此产生的 Owner 裁决前提
STATUS    = ERRATUM。不改写原记录；原记录仍然可查，错误本身是经验的一部分。
```

## 1. 我此前记录了什么（原文仍在，不修改）

- `development_uxi390_handoff_resolved_no_load_vector`：「**City 不发布五维负载向量，所以每个 alternate 按设计都不合格，ALTERNATE_DEVICE 在本 City 不可达**」；
- `development_uxi390_unknown_load_ineligible`：「alternate 因 load 未知而不合格，而它的 reason-term 却写 SELECTABLE」；
- `DISPATCH_ALIEN_HANDOFF_UNREACHABLE_BY_DESIGN.md`、「deferral reason CORRECTED」：把延期理由改成「City **没有** switch-decline 流程」；
- 由此形成的 Owner 选项 1 裁决前提：延期理由是「不发布负载向量」。

## 2. 实测的真话（本轮由 UXI-391 驱动得出）

```text
1. loadFromTelemetry() 自 139ae4e（UXI-301 feed producer）起就存在，且一直产出 PARTIAL 向量：
     cpu    <- telemetry.cpu.usagePercent / 100
     memory <- telemetry.memory.usedBytes / totalBytes
   gpu / io / network 保持未测量（不填 0）。DEFAULT_PRESSURE_POLICY.min_observed_dimensions = 1。
   → 「City 没有负载向量」是错的；负载不是本 seam 的 blocker。实测 alternate 的 load = {"memory":0.748}，
     1 维已观测即满足最小值。

2. 真正的 blocker 是一个接线缺陷：candidateFromNode() 根本不带 enablement 字段。
     - 呈现词路径 eligibilityFor() 的参数默认 enablement = 'ENABLED' → 同一个设备显示 SELECTABLE；
     - 路由路径 candidate?.enablement ?? null → RS-202 的规则是「非显式 ENABLED 即拒绝」→ USER_DISABLED
       （证据串：enablement=null is not an explicit ENABLED）。
   → 于是 planRoute 永远选不出合格 alternate，stage 3 落到 QUEUED，routeStageFor 返回 null。
   我当年观察到的「两个谓词、两个答案」是真的，但我把它错误地归因给 load；实际分歧在 enablement。

3. 我引用的是注释，不是代码路径。我引用的那句「load defaults to null on purpose: this City has heartbeat
   telemetry but no five-dimension load vector」是 presentation.mjs 里残留的旧注释，而它上面几行的真实代码
   早已是 load: loadFromTelemetry(node?.telemetry)。我读了下方的注释去解释上方的行为。

4. 场景构造也是错的（这是 UXI-391 存在的直接原因）：我当年用「让 A 忙、再建第二个任务让 B 抢」的构造，
   而不是工作书要求的「同一个 target WAIT 被 A 持有、停 A 的 agent、之后再起 B」。

5. 连「City 没有 switch-decline 流程」这句（我当时的"更正"）也是错的：
   POST /api/v0/tasks/:id/switch-declined 存在（UXI-301 的成果），并把用户意图写进 task.switchDeclined。
```

## 3. 结论

**原始结论（不可达）与随后的"更正"（无拒绝切换流程）都是错的。** 正确的是：

```text
remote handoff 在本 City 曾经不可达，原因不是产品设计上的缺失，而是一处接线缺陷
（候选映射漏传 enablement，导致路由把所有设备判为 USER_DISABLED）。
修好这一处后，用工作书指定的正确构造，SWITCH_OFFERED → ALTERNATE_DEVICE/REMOTE_HANDOFF
真的到达，且 orchestration 真的执行了 A→B 的所有权转移，同一 task id 在 B 上跑到终态。
证据：scripts/uxi391-handoff-e2e.mjs 21/21 PASS（见 DEVELOPMENT_REPORT.md）。
```

## 4. 这条纠错留下的工程规则

1. **注释不是代码路径**：关于"系统能做什么"的判断必须来自驱动路径，不能来自读某段注释或某个谓词的输入假设；
2. **两个谓词读同一候选却给出不同答案时，先怀疑字段没被传到位**，而不是先怀疑语义冲突——本轮两次出现同一根因
   （`routeStageFor` 重建候选时也丢 enablement，与 `candidateFromNode` 同一缺陷的两个位置）；
3. **"不可构造"之前先质疑构造**：我花了十六轮追一个我自己搭错的场景。

## 5. 与 Owner 裁决的关系（不越权）

UXI-391 明确「不撤销 `UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED`」，所以我不动那个结论。
但**那次裁决所依据的延期理由已被实测推翻**：延期理由应当是「曾因候选映射漏传 enablement 而不可达」，
而该缺陷现已修复。是否据此改写 Owner 裁决记录，属 Owner 的决定，我只把事实摆在这里。


[阅读译本 / Reading translation](./en/ERRATUM_WRONG_PREMISE_CORRECTED.md)
