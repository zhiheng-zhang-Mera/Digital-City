# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../ERRATUM_WRONG_PREMISE_CORRECTED.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# ERRATUM — UXI-390's “handoff unreachable by design” conclusion was wrong: append-only correction

```text
FROM      = Alien（UXI-390 开发主机；本条是作者对自己记录的纠正）
RE        = UXI-390 工作书中关于 remote handoff 的一整组结论，以及据此产生的 Owner 裁决前提
STATUS    = ERRATUM。不改写原记录；原记录仍然可查，错误本身是经验的一部分。
```

The author Alien corrects its own UXI-390 remote-handoff conclusions and the resulting Owner-ruling premise. ERRATUM leaves originals readable; the mistake itself is experience.

## 1. Earlier records, still present and unmodified

- development_uxi390_handoff_resolved_no_load_vector: **City reports no five-dimensional load vector, all alternates ineligible by design, ALTERNATE_DEVICE unreachable**.
- development_uxi390_unknown_load_ineligible: alternate ineligible for unknown load but its reason-term SELECTABLE.
- DISPATCH_ALIEN_HANDOFF_UNREACHABLE_BY_DESIGN and deferral reason CORRECTED: changed reason to **City has no switch-decline flow**.
- Resulting Owner option 1 premise: no published load vector.

## 2. Measured truth driven by UXI-391 this round

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

Complete translation: 1 loadFromTelemetry exists since UXI-301 producer139ae4e and always produces PARTIAL vector: cpu usagePercent/100, memory used/total; gpu/io/network unobserved, never zero-filled. min_observed_dimensions 1. Thus “no vector” wrong; load not blocker, alternate measured memory0.748 satisfies minimum. 2 Actual blocker is wiring: candidateFromNode omits enablement. Presentation eligibilityFor defaults ENABLED so SELECTABLE; routing uses candidate?.enablement??null, RS202 rejects anything not explicit ENABLED as USER_DISABLED, reason enablement=null is not an explicit ENABLED. planRoute cannot find alternate, stage3 QUEUED, routeStageFor null. Two predicates/two answers observation was real, but wrongly attributed to load rather than enablement. 3 I quoted a stale comment, not the code path: “load defaults null/no vector” remained below actual load:loadFromTelemetry(node?.telemetry). I used lower comment to explain upper behavior. 4 Scenario was also wrong, directly motivating UXI-391: occupied A then created another task for B, rather than same target WAIT held by A, stop A agent, start B afterward. 5 Even “no switch-decline flow” correction wrong: existing UXI-301 POST switch-declined persists task.switchDeclined.

## 3. Conclusion

**Original unreachable conclusion and subsequent no-decline correction were both wrong.** Correct account:

```text
remote handoff 在本 City 曾经不可达，原因不是产品设计上的缺失，而是一处接线缺陷
（候选映射漏传 enablement，导致路由把所有设备判为 USER_DISABLED）。
修好这一处后，用工作书指定的正确构造，SWITCH_OFFERED → ALTERNATE_DEVICE/REMOTE_HANDOFF
真的到达，且 orchestration 真的执行了 A→B 的所有权转移，同一 task id 在 B 上跑到终态。
证据：scripts/uxi391-handoff-e2e.mjs 21/21 PASS（见 DEVELOPMENT_REPORT.md）。
```

Complete translation: remote handoff was unreachable because of a wiring defect, not missing product design: omitted enablement made routing classify all devices USER_DISABLED. Repair plus workbook-correct construction genuinely reaches SWITCH_OFFERED→ALTERNATE_DEVICE/REMOTE_HANDOFF, orchestration transfers A→B, same task terminates on B. Evidence uxi391-handoff-e2e21/21PASS, DEVELOPMENT_REPORT.

## 4. Engineering rules left by the correction

1. **Comments are not executed code paths**: conclusions about capabilities must come from driven paths, not comments or assumed predicate inputs.
2. **When two predicates answer differently for the same candidate, first suspect omitted fields**, rather than semantic conflict. Same root cause twice: routeStageFor reconstruction also omitted enablement, two locations of candidateFromNode defect.
3. **Question construction before declaring unconstructible**: sixteen rounds chased my own incorrect scenario.

## 5. Owner ruling: no overreach

UXI-391 explicitly does not revoke UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED, so that conclusion is untouched. But **the deferral premise is experimentally overturned**: reason should be previously unreachable due to omitted enablement, now repaired. Whether to rewrite Owner ruling is Owner's decision; this report presents facts only.
