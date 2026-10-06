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
| REX-803 `8798ba9` + REX-804 `fe700ab` | 否 | 各自单独干净；**合在一起 2 处 union 冲突**（`server.mjs` 构造点与 return） | Owner 合并窗口 |
| REX-805 候选 `4b39468`（**尚未验收**） | 否 | 对 main 是 **fast-forward**（main 是它的祖先）；叠加到 803+804 上多出 **1 处 union 冲突** | 先验收，再窗口 |

原始 `diff main..head` 会给出更大的删除数（MON 4429、REX-803 6），那是 **main 后来的工作不在旧 baseline 上**，不是合并会移除的东西——以实测的合并结果为准，MON 的合并删除数为 **0**。 / The raw diff shows larger deletions (MON 4429); those are main's later work missing from the old baseline, not what a merge removes. The measured merge deletes nothing.

## 已完成的集成测量 / Integration measurements already done

```text
MON          integration/MON-accepted-head-mech-preflight @ 40be3e1
             定向 mon9* 80/80（10 套件）· 全量 1431/1434（3 项 host-city-launcher）· 跑后 CLEAN
             reviewer 自己的 13 个探针在合并结果上 13/13 · Android 构建+单测 118/118（22 套件）
REX 803+804  integration/REX-accepted-heads-mech-preflight @ 704c518
             定向 48/48（13 套件）· 全量 1404/1407
REX 3 家并集  integration/REX-805-candidate-mech-preflight @ 0d8bdce
             定向 67/67（17 套件）· 全量 1423/1426 · 跑后 CLEAN（含已发布的 REX-804 证据修复）
```

## 清单说明的规则 / The rule this inventory states

> **`COMPLETE` 是验收状态，不是部署状态。** 每一次集成都必须从**当时最新** main 出发重测；每一次都必须在**合并结果**上跑程序自己的套件、跑 reviewer 自己的探针、并验证集成中被改动过的产品代码仍能构建与通过测试。

## 不属于本机的决定 / What is not this host's decision

三件事都只等 Owner 或记录持有人： / Three things wait on the Owner or a record holder:

```text
1  MON 合并窗口是否开启（整条系列，代价已测清：一次合并、一处并集、零删除）
2  REX 合并窗口是否开启（须先等 REX-805 被验收；三家并集已预备好）
3  两处待采纳的修复提案：REX-804 证据写入修复、relay 限流探针修复
```

本清单不改变任何工作书字段，也未合并任何东西。 / This inventory changes no workbook field and merges nothing.
