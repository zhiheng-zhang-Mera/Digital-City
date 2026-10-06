# 集成部署清单：已验收但尚未进入 main 的产物 / Deployment inventory: accepted but not in main

2026-10-06，Mech-DS（`MEGA-REP`）。**全部数字都是在 main `b06504f` 上实测的**；main 一旦移动，本清单即过期，必须重测。 / Every number below was measured on main `b06504f`; when main moves this inventory is stale and must be re-measured.

## 为什么需要这张表 / Why this exists

本系列的验收语义是明确的（`COMPLETE` = 开发 + 对侧复检 + 精确头 CI，**不等于**已合入 main），但「哪些已验收的东西还没进 main、进去要付什么代价」此前没有任何一处记录。MON 整条系列不在 main 上这件事，是被一次顺带的集成测量发现的，而不是被任何清单发现的。 / The programme's acceptance semantics are explicit that COMPLETE does not mean merged, but nothing recorded *what* is accepted-but-undeployed or what deploying costs. That the whole MON programme is absent from main was found by an incidental integration measurement, not by an inventory.

## 实测 / Measured on `b06504f`

| 已验收产物 / accepted product | 在 main 上 / in main | 合并形状 / merge shape | 需要决定的是 / who decides |
|---|:---:|---|---|
| CEX-790 `a24c044` | **是 / yes** | 已并入（PR #33 = `b06504f` 本身） | 已落地 |
| JOIN-590 `322162e` | **是 / yes** | 已并入（手工 union `1a26d74` 等） | 已落地 |
| WBC-601…604 | **是 / yes** | 已并入（四个 `wbc/*` 分支均为 main 祖先） | 已落地 |
| MON-990 `fb042d9`（含 MON-901/902/903） | 否 | 一次合并覆盖整条系列：**95 文件 +14670/−26，0 文件删除**（纯增量），**1 处 union 冲突**（Android 打字化拒绝路径） | Owner 合并窗口 |
| REX-803 `8798ba9` + REX-804 `fe700ab` | 否 | 各自单独干净；**合在一起 1 处 union 冲突**（`server.mjs` 的构造点：fault controller 与 campaign/replay 控制器同一处定义） | Owner 合并窗口 |
| REX-805 **已验收** `0261a9e` | 否 | 对 main 是 **fast-forward**（它本身包含 main）；与 803+804 一起需要解出上面那 1 处 union | Owner 合并窗口 |
| REX-806 开发完成 `3950d47`（**未验收**） | 否 | 它建立在**自己那一次** union 解（`e18c5c5`）之上，因此整条分支已经带着 803+804+805 的 union | 先验收，再窗口 |

原始 `diff main..head` 会给出更大的删除数（MON 4429、REX-803 6），那是 **main 后来的工作不在旧 baseline 上**，不是合并会移除的东西——以实测的合并结果为准，MON 的合并删除数为 **0**。 / The raw diff shows larger deletions (MON 4429); those are main's later work missing from the old baseline, not what a merge removes. The measured merge deletes nothing.

**2026-10-06 复核（本轮）/ re-measured this round：** main 仍是 `b06504f`，本清单的测量基准未变；三个已验收 REX 头仍都不在 main 上；上一版把 REX-805 记成「候选 4b39468（尚未验收）」已更正为 **已验收 `0261a9e`**（本机复检通过并释放标记），并补上 REX-806 一行。 / The basis is unchanged, and the two stale rows are corrected.

**2026-10-06 已执行（Owner 授权合并窗口）/ executed: the merge this inventory was preparing**

```text
MERGE HEAD  merge/REX-series-mech-owner-window @ 312b627（随后 fast-forward 到 main）
内容        14499ad（relay 探针修复）+ be3670b（规范库 typed 诊断）+ 0261a9e（REX-805，内含 803）
            + fe700ab（REX-804）+ 690d723 的 hunk（REX-804 证据写入修复，按内容采纳）
冲突        仅 services/dev-gateway/server.mjs 一处，按并集解出（campaigns/replays + faults 都构造、
            返回都暴露、teardown 两边都释放）——与 704c518 / e18c5c5 的解法一致，是第三次独立解出
验证        REX-801..805 套件 99/99 · 三面共存冒烟 v2 跑通（campaign→replay 在 fault ACTIVE 下闭合）
            · 全量：合并树 4376/4363（6 项失败：3 项既有 launcher + 3 项隔离复跑全过）
                    基线 main 4305/4292（6 项失败：3 项既有 launcher + 主题陷阱 + MESH-301 + relay 探针）
            => 合并**没有引入新的确定性失败**，并让 relay 探针那项失败消失（正是采纳的修复）
不改变      REX-806 仍 IN_PROGRESS（标记未释放）⇒ REX-807/890 仍 WAITING_DEPENDENCIES；合并 ≠ 验收
详见        reports/REX-PROGRAMME/REX_SERIES_MERGE_MECH_2026_10_06.md
```

## 集成方实际要解决什么 / What an integrator actually has to resolve

```text
实测 / measured          三个已验收 REX 头（8798ba9 · fe700ab · 0261a9e）**各自都包含 main**
                         因此「把某个 REX 分支合进 main」不是合并，而是把 main 直接移到该分支上（fast-forward）
真需要解的 / the work     804 与 803+805 之间的**一处 union 冲突**（server.mjs 构造点），已独立解出两次：
                          704c518（main + accepted 803 + accepted 804 + accepted 805 union）
                          e18c5c5（同样输入的另一次独立解，REX-806 的 claim-time baseline）
                         两者内容等价、提交不同；**704c518 不是 e18c5c5 的祖先**，集成方应挑一个并说明用了哪个
REX-806                  head 3950d47 是 e18c5c5 的后代，因此它**自带整条 union**；把它并进 main 同样是
                         fast-forward，从而把 803/804/805 一起带进去 —— 再一次说明集成来源必须是工作书里
                         记录的那个已验收提交，而不是分支名
```

## 已完成的集成测量 / Integration measurements already done

> **MON 的同类反查（2026-10-06，Mech）**：MON 系列 4 本已到终态的工作书中，`MON-901` 的 dev/review 头**已在 main**；而 `MON-902`（dev `3a88e23` / review `f498824`）、`MON-903`（`78bdd9d` / `3cd32c6`）、`MON-990`（`fb042d9`）三者的标记**都已释放**但头**都不在 main**，与 REX 收尾前的情形相同。本轮 Owner 指令的执行范围是 **REX 系列收尾**，因此 MON 的合并**未在本轮执行**；若窗口覆盖 MON，本清单里 `40be3e1` 的测量与同一套验证流程可直接复用。 / The same reverse check for MON: MON-901 is in main; MON-902/903/990 have released markers but their heads are not. This round's instruction scoped the closeout to REX, so the MON merge was not performed.

```text
MON          integration/MON-accepted-head-mech-preflight @ 40be3e1
             定向 mon9* 80/80（10 套件）· 全量 1431/1434（3 项 host-city-launcher）· 跑后 CLEAN
             reviewer 自己的 13 个探针在合并结果上 13/13 · Android 构建+单测 118/118（22 套件）
REX 803+804  integration/REX-accepted-heads-mech-preflight @ 704c518
             定向 48/48（13 套件）· 全量 1404/1407
REX 3 家并集  integration/REX-805-candidate-mech-preflight @ 0d8bdce（未修复的 805 候选，历史）
             定向 67/67（17 套件）· 全量 1423/1426 · 跑后 CLEAN
REX 3 家并集（修复后候选）integration/REX-805-repaired-mech-preflight @ 5b85cd6
             定向 68/68（17 套件）· 全量 1424/1427 · 跑后 CLEAN（含已发布的 REX-804 证据修复）
REX-806      rex/REX-806-mech-metrics-and-export @ 3950d47（开发完成）
             24 探针 24/24 · 全量 1442/1445（3 项 host-city-launcher）· CI push 37454597004 SUCCESS attempt 1
```

## 清单说明的规则 / The rule this inventory states

> **`COMPLETE` 是验收状态，不是部署状态。** 每一次集成都必须从**当时最新** main 出发重测；每一次都必须在**合并结果**上跑程序自己的套件、跑 reviewer 自己的探针、并验证集成中被改动过的产品代码仍能构建与通过测试。

> **分支包含 main，不等于集成来源正确。** 本清单里每个 REX 分支都包含 main，所以「合并」它们实际是把 main 直接移到那个分支上；未验收分支一旦被这样带进去，就是把未验收内容整体搬进 main。集成来源必须是工作书里记录的那个被验收的确切提交。

## 不属于本机的决定 / What is not this host's decision

三件事都只等 Owner 或记录持有人： / Three things wait on the Owner or a record holder:

```text
1  MON 合并窗口是否开启（整条系列，代价已测清：一次合并、一处并集、零删除）
2  REX 合并窗口是否开启（须先等 REX-805 被验收；三家并集已预备好）
3  待采纳的修复提案（下表的「当前位置」为本机 2026-10-06 按**内容**逐一实测，不是按 sha 祖先关系推断）
```

### 待采纳修复的真实位置 / Where the pending repairs actually stand (verified by content, 2026-10-06)

```text
已采纳  store-guard 家族两例（research registry、capability-bridge 主题产物）
        main 的 CEX-790 集成提交 65f86f9 按内容实现了本机那套模式（构造期降级 + storeState/storeReason + 守卫测试），
        因此**按 sha 查祖先会查不到**。复测证据见 reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md

可立即采纳  repair/mech-relay-rate-probe-burst @ 14499ad
        parent = b06504f（current main）⇒ **恰好一个提交叠在 main 上**，采纳即 fast-forward
        改动仅 tests/relay-s1-tunnel.test.mjs：把「顺序 30 次请求」换成「30 次并发写满管道」，并把 429 断言里
        带上实测发送耗时——原版在满载主机上会把限流器正常工作误报成产品缺陷（REX 集成预检时真的发生过）

需随分支走  repair/REX-804-mech-test-evidence-outside-repo @ 690d723
        parent = fe700ab（被验收但**未并入 main** 的 REX-804 头），因此该分支相对 main 有 10 个提交
        **不能单独采纳**：本机要采纳的只有里面那一个 hunk（截图从已提交的 evidence 路径改到 .runtime/），
        它应当随 REX-804 分支一起进入 main
        更正（2026-10-06 实测）：**不再等待 `adc075e`**——被验收头 `fe700ab` 自身已带 fault store 守卫，
        且比 `adc075e` 更严（构造期降级 + `start` 被 typed 拒 503 FAULT_STORE_UNAVAILABLE）；
        证据 reports/REX-PROGRAMME/fault-store-start-check.mjs 与 store-shape-sweep-v3.mjs

仍开放且需先 rebase  repair/WBC-604-mech-profile-persist-first @ 1f2f08c（F-3 profile 半切换）
        parent = 213f9f9，切在 CEX-790 集成之前，按现状采纳会删掉那次集成的测试 ⇒ 必须先 rebase

仍开放且已就绪  repair/mech-city-store-diagnostic-on-current-main @ be3670b（F-1 typed 诊断）
        parent = b06504f ⇒ 一个提交叠在 current main 上；其守卫探针在该 tip 上 3/3 通过

可立即采纳（推荐，取代下面两条）  repair/REX-806-mech-exporter-missing-receipt-detection @ d790a2a
        parent = 4349f3d（即 stack 之上）⇒ 采纳即 fast-forward；**一次带走导出器三条失败路径修复**：
        ① 空 store 拒绝不再于 libuv 断言中崩溃（exit 1）；② 回执损坏不再整次无产物（跳过 + 点名 + 可读照常 + exit 1）；
        ③ **最新**回执被删可检测（live campaign 仍留 id）→ 点名 + exit 1；较旧的删除仍不可检测（消息里写明）
        验证：拒绝 exit=1；损坏 → 产物 + exit 1 + 点名；最新删除 → exit 1 + 点名；旧删除 → 静默（边界）；
        端到端演练 13/13、产出包 14/14、健康 City 无误报
        托管 CI：push run 37466226644 @ d790a2a —— gateway-web 与 android 均 SUCCESS attempt 1

可立即采纳（历史）  repair/REX-806-mech-exporter-unreadable-receipt @ 4349f3d（含 ①②）
        parent = 3950d47 ⇒ 采纳即 fast-forward；已被 d790a2a 包含（除非只想修 ①②）

可立即采纳（历史）  repair/REX-806-mech-exporter-refusal-exit-code @ 44dec63（只修 ①）
```

本清单不改变任何工作书字段，也未合并任何东西。 / This inventory changes no workbook field and merges nothing.

语言配对 / Language pair: [Full English reading](./en/INTEGRATION_DEPLOYMENT_INVENTORY_MECH.md)
