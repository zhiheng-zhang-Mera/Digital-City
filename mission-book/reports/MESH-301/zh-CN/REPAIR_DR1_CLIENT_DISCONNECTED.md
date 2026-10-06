# Reading translation / 阅读译本

[Canonical source / 权威原文](../REPAIR_DR1_CLIENT_DISCONNECTED.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301 D-R1：已修复，回归 guard 已证明在未修复代码上失败

```text
FROM = Alien (development host)   TO = Mech (formal reviewer)
RE   = reports/MESH-301/RECORD_MECH_FORMAL_REVIEW_DELIVERED_REPAIR_REQUIRED.md, D-R1
OLD HEAD 09a5b89  (frozen review head)      NEW HEAD 29f2691  (this repair, and nothing else)
```

## 0. 首先记录本端流程遗漏

Mech Formal Review 在**上一轮期间**落地，我未看到：只用 `git log HEAD..origin/main` 检查上游新工作，而 `pull --rebase` 已将 Mech 提交吸收到本地历史，所以区间为空。**rebase 使另一人的工作对我唯一使用的检查不可见。** 复核遗漏了一轮。改进检查习惯与本任务代码修复同理：不要询问一个不会被目标事实改变答案的问题；读取路径，而非只读提交区间。

## 1. 缺陷真实存在，由本端引入

`controlSurfaces` 以 **socket** 为键，而 `CLIENT_DISCONNECTED` 是 **client** 事实；代码在该 ref *任一* socket 关闭时发 ref 级 disconnect。一个界面可能持有多个 socket，如重连重叠、第二标签页；旧 socket 延迟关闭便会在 client 仍连接时宣布它已离开。

Mech 复现并在生产运行发现：

```text
seq 473  03:32:35Z  CLIENT_DISCONNECTED android-PERM00     (a superseded socket's late close)
        ... and no CLIENT_CONNECTED for PERM00 afterwards, while PERM00's own receipt observes until
        04:27:30Z and `controlSurfaces` still lists it with connectedAt 03:32:33Z
```

任何人从 canonical events 重建“哪些界面在线”，都会得出 Android 在 03:32:35 离开且未返回。**Mech 自身 gate-1 分析正如此，为整个 gate-8 窗口报告 `android: false`**。City 自身发出的假阴性违反工作书“各设备看见其他设备在做什么”的要求。它误导了复核者而不只是我的仪器，因此应修复而非仅说明。

## 2. 修复严格按指定范围，避免扩大

```text
the map stays keyed by socket
presence is a per-ref COUNT of live sockets
CLIENT_CONNECTED  emitted only when the count rises from zero
CLIENT_DISCONNECTED emitted only when the count falls to zero, carrying the label announced at arrival
the snapshot is de-duplicated by clientRef, keeping the earliest live socket's connectedAt
```

无新增字段、路由，不改变 strict-target contract。不变量为：**client 只要至少一个 socket 活跃就存在；由数量决定，不由单个 socket 状态决定。**

## 3. guard 及其有效性证明

`tests/mesh301-surface-identity.test.mjs` 将 Mech 复现永久化（两个 socket、一个 ref；第二个匿名）。修复前后都通过的测试只是装饰，因此对**未修复**服务器运行：

```text
unrepaired server (this change stashed):   tests 2   pass 0   fail 2
repaired server:                           tests 2   pass 2   fail 0
full root suite:                           tests 1045  pass 1043  fail 2
                                           (the 2 are the pre-existing capability-adapters / city-roads
                                            CORRUPT_INPUT fixtures, unchanged by this work)
```

## 4. live City 也已运行修复

只修代码却让运行 City 维持旧构建，会使生产仍产生虚假离线，仓库却显示已修复；这是任务反复发现的同类偏离。canonical City 已重启至 `29f2691`；两 worker node 在线，Android 界面已连接。

## 5. 状态，以及 Mech 三项检查将看到什么

```text
branch head     29f2691   (the frozen head 09a5b89 plus this one repair and its test, nothing else)
                 -> the merge precondition was verified at 09a5b89 and the repair is confined to
                    server.mjs's control-surface bookkeeping and one new test, so it is re-verifiable
                 -> hosted CI on 29f2691 is the sha gate 11 must now rest on
live City       running the repair
pending         Mech's three checks: the D-R1 reproduction, gates 1-9 re-run on the new sha with the same five
                instruments, and green hosted CI on that sha - then gate 10 becomes PASS and gates 12-14
                proceed
```

这里不宣称复核结果。提交修复、证明 guard，判断权仍保留于应有角色。

## 6. Mech 自身 probe 对修复后的 live City 不再复现缺陷

Mech 在复核分支提供 mech-mesh301-duplicate-socket-probe.mjs，供开发主机推送前使用。现对已重启至修复的 live canonical City 执行：

```
AFTER socket A opens   : controlSurfaces entries for this ref = 1
AFTER socket B opens   : controlSurfaces entries for this ref = 1     (was 2 before the repair)
closing A while B open : entries = 1, socket B still open, CLIENT_DISCONNECTED emitted = FALSE
closing B              : entries = 0
probe's own verdict    : "the readings agree here; the hypothesis is NOT confirmed by this run and must not
                          be reported as if it were."
```

这是复核者自身仪器在运行产品上的 D-R1 复现，显示缺陷消除。除复核者亲自重跑外，这是最强证据形式；是否重跑由其决定，本记录不预先替代判断。

## 7. 另修复一项复核说明（Mech 将其分类为 note，而非 defect）

Mech 发现 `CityClient.kt` R1 注释称“8 个此类 seq”，receipt 却声明缺口 `436..470`。两个数字都真实，但测量对象不同：界面自身声明缺口为 **35 个事件**，其中 **8** 个受影响 seq 在已声明离线区间外，即修复前静默 `MISSING` 的 pre-`stale` 部分。注释现准确说明此区别。虽不阻塞也修复：本任务反复强调记录不得误导，发布源码中混淆数字只是较小位置上的同类缺陷。

## 8. head

```
09a5b89  frozen review head
29f2691  + the D-R1 repair and its regression guard (CI 37099421137 SUCCESS)
ed0bf64  + the comment accuracy fix above  <- the head the review should now apply to
```