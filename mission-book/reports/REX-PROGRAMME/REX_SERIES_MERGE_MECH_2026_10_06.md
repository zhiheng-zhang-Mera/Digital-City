# REX 系列收尾：已验收头合并进 main / Closing the REX series: the accepted heads land in main

作者 / author: Mech-DS（`MEGA-REP`）· 时间 / at: 2026-10-06 · 授权 / authority: **Owner 本轮明确授权合并/采纳窗口**（"授权3，把REX系列收尾"）

> 本记录只报告**合并**这个动作与其验证。**验收结论不变**：REX-806 的 `RESEARCH_ARTIFACT_EXPORT_ACCEPTED` 仍未释放（对侧复检未做，§3 禁止自审），REX-807/890 仍 `WAITING_DEPENDENCIES`。**合并 ≠ 验收**，本文按此边界书写。 / This record reports the merge only. Acceptance is unchanged: REX-806's marker stays unreleased and REX-807/890 stay dependency-blocked. Merging is not accepting.

## 合并前反查 / Before merging

工作书声明与实现仓库推送记录**逐条无矛盾**（8 本 REX 工作书；方法与结果见
[`REX_SERIES_STATUS_RECONCILIATION_MECH.md`](./REX_SERIES_STATUS_RECONCILIATION_MECH.md)）。唯一结构性事实：REX-803/804/805 三个已验收头此前**都不在 main**。包含关系实测：`8798ba9`(803) ⊂ `0261a9e`(805)，而 `0261a9e` 与 `fe700ab`(804) 互不包含 ⇒ 并集 = main + `0261a9e` + `fe700ab`。

## 合并内容与顺序 / What was merged, in order

```text
14499ad  repair/mech-relay-rate-probe-burst        relay 限速探针改为真突发（fast-forward 采纳）
be3670b  repair/mech-city-store-diagnostic-on-current-main  规范库拒绝启动改为 typed 诊断
0261a9e  REX-805 已验收头（内含 REX-803 已验收头 8798ba9）   merge 提交 b13ca3f，**无冲突**
fe700ab  REX-804 已验收头                                  merge 提交 314ed37，**一处并集冲突**
690d723  REX-804 证据写入修复（按内容采纳其唯一 hunk）       提交 312b627
```

### 唯一的冲突点与解法 / The single conflict and its resolution

`services/dev-gateway/server.mjs`：两边在**同一处**构造研究控制器——REX-803/805 的 campaign/replay 控制器与 REX-804 的 fault 控制器——三者**互不引用**，因此全部保留：

```text
构造点    campaigns / replays（来自 0261a9e）  +  faults（来自 fe700ab）  两者都在
返回处    return {... researchTrace, campaigns, faults, executionProfile, ...}
teardown  await campaigns.close({reason:'CITY_SHUTDOWN'}); faults.close();  —— 两边资源都释放
```

该解法与集成预检此前的预测一致（`704c518`、`e18c5c5` 两次独立解出同一 union）；本次是在**当前 main** 上第三次解出。

## 验证 / Verification

```text
REX-801..805 套件（23 个文件）        99 测 / 99 过 / 0 失败
三面共存冒烟 UNION_COEXISTENCE_SMOKE_V2_MECH.mjs
  REX-804  fault 在 campaign 之前注入且 ACTIVE
  REX-803  campaign COMPLETED、measured=1、taskRef 与 assignedNodeId 齐备
  REX-804  replay 开始时仍有 ACTIVE 的 fault
  REX-805  replay 跑通并产出 comparison（含 placementChanged / durationDeltaMs / determinism 等字段）
  全部在**同一个 City** 内完成
托管 CI（exact head）                 run 37474155034 @ 312b627：**gateway-web 与 android 均 SUCCESS attempt 1**
```

**全量套件的对照测量（本机，同一天、同一台机器）/ Full-suite comparison on this host**

```text
合并树 312b627   4376 测 / 4363 过 / 6 失败
                 失败项：3×host-city-launcher（既有：常驻 City 占用 host reservation）
                        · 主题包陷阱 · REX803 web · REX803 two-worker rehearsal
                 其中「主题包陷阱」与两项 REX803 在**隔离复跑时全部通过**（6/6）⇒ 负载敏感
基线 main b06504f 4305 测 / 4292 过 / 6 失败
                 失败项：3×host-city-launcher · 主题包陷阱 · MESH-301 · **relay 限速探针**
⇒ 合并**没有引入新的确定性失败**；并且基线里那项 relay 探针失败在合并树上**消失**——
  那正是本次采纳的 14499ad 修复所要解决的问题。 / No new deterministic failure; the relay-probe failure that main had is gone, fixed by the adopted 14499ad.
```

**v1 冒烟脚本的局限已在本轮被消除**：v1 只等待、不驱动 worker，因此其 run 必然 TIMEOUT、replay 必然被拒——v1 的记录如实写明了这一点。v2 补上 drive（heartbeat/claim/RUNNING/COMPLETED），链条才真正闭合。v2 自身也修正了三处仪器错误（重复注入被 `FAULT_TARGET_BUSY` 正确拒绝、在 replay 之后错误地要求 fault 仍 ACTIVE、忘了 replay 本身也是一场需要驱动的 campaign）。

## 结果 / Outcome

```text
utopia origin/main = **312b627**（由 b06504f fast-forward 而来；合并前已确认 main 是 merge head 的祖先）
branch            merge/REX-series-mech-owner-window（同样指向 312b627，保留为可回溯的分支记录）
```

## 不因合并而改变的事 / What this does not change

```text
· REX-806 仍是 IN_PROGRESS：review_host=null、review_complete=false、标记未释放
· 因此 REX-807 / REX-890 仍是 WAITING_DEPENDENCIES（它们的依赖里有 REX-806 的标记）
· REX-806 的开发内容（导出器/校验器/owner-only 接口）**未**随本次合并进入 main——它只进入被验收的部分
· 本机未行使任何超出 Owner 授权范围的权力：只做「已验收头 + 已发布修复」的合并且逐条留证
```
