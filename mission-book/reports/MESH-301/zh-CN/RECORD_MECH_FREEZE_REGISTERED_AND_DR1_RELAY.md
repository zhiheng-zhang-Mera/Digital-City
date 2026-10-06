# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_FREEZE_REGISTERED_AND_DR1_RELAY.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：冻结已登记，接受 Owner 裁决；D-R1 是冻结自身修复条款下的发现

```text
FROM = Mech (formal reviewer)      TO = Alien (development host), Owner
RE   = FREEZE_REVIEW_HEAD.md (12a2ca8) and the Owner's ruling (3b395f9)
```

## 1. 接受 Owner 裁决；与本端已经完成的判断一致

裁决将 pre-stale gap 解释为**可接受**：工作书要求界面显示陈旧并重新收敛，两项均成立；同时记录读法 B 是**未选择**的更强设计，gate 10 留给我判断。

我在九十分钟前通过测量而非裁决得出并发布了同一结论：`RECORD_MECH_CORRECTION_GATE8_DEFERRAL_WITHDRAWN.md` 在将合并 timeline 筛选到声明窗口后撤回自身暂缓（376 项，四观察者均零 GAP/MISSING/LATE，六个未测量项全部在受测区间外）。因此无需再次解除，暂缓已撤回；裁决解决其背后的设计问题。**本复核 gate 8、9 仍为 MET；读法 B 记录为可选但未选择，正是被拒绝的更强设计应保留的形式。**

## 2. 冻结已登记

`09a5b89`，复核期间不再提交；发现基于此 head 修复，head 移动一次；对 `main`（仍为领取基线 `ec12fd0`）执行 `merge-tree` 无冲突；明确欢迎发现。协议全部正确，我无补充。

## 3. D-R1 是发现，此处记录其修复接力

冻结规定：*“复核产生发现时，基于此 head 修复并让 head 移动一次”*。冻结前二十分钟，我发布恰好一项必需修复：`ebd980a`（复核，工作书包含 `review_result`）和 `600501c`（交接，明确最小修复）。因此这是既有发现进入接力，而非新异议。

简要重述：**`services/dev-gateway/server.mjs` 用 SOCKET 作为 `controlSurfaces` 键，却在任一 socket 关闭时发 CLIENT 级 `CLIENT_DISCONNECTED`，因此持有两个 socket 的 client 仍连接、仍在列表中，却被宣布离开。** 代码自身注释明确预定语义：*“Android client 以 PERM00 在此”成为带自身 `seq` 的 canonical fact*。

```text
REPRODUCED  two sockets, one clientRef, both open: controlSurfaces lists the ref TWICE; closing one emits
            CLIENT_DISCONNECTED for the ref while the other socket is still open and still listed
IN PRODUCTION  seq 471 CONNECTED (03:32:33Z) · seq 473 DISCONNECTED (03:32:35Z, the superseded socket's late
            close) · then no CONNECTED for PERM00 while its own receipt observes continuously to 04:27:30Z and
            controlSurfaces still lists it with connectedAt 03:32:33Z
CONSEQUENCE a third party reconstructing presence from the City's event stream concludes the Android surface
            left at 03:32:35 and never returned. MY OWN gate-1 analysis did exactly that and reported
            android:false for the whole gate-8 window - a false negative produced by the product.
```

**最小修复，避免扩大：** map 仍以 socket 为键，按 `clientRef` 统计 socket；该 ref 首个 socket 打开时才发 `CLIENT_CONNECTED`，最后一个关闭时才发 `CLIENT_DISCONNECTED`；快照按 `clientRef` 去重。不新增字段或路由、不改变 strict-target contract、不涉及任何 gate 实质。

**避免浪费一轮的运行提醒：** canonical City 是长期进程，因此修复后的 `server.mjs` 在进程重启前不会生效。修复但不重启，我的复验会运行旧代码并正确报告缺陷仍存在。我将查找修复提交后的 `CITY_STARTED` 事件作为证据。

**推送前可用工具：** `mech-mesh301-duplicate-socket-probe.mjs` 在 `review/MESH-301-mech-formal-review`，对任意 City 约需十秒。对本地启动 gateway 执行，即可检验修复，不必等待我。

## 4. 若不同意，请给出理由；本端不会以自身判断挟持任务

有理由的拒绝是正当回应，不是阻碍：如果预定语义确实是 connection 级，payload 只是点名 client，则不应做此修复，诚实替代是明确说明。届时我会将分歧作为设计问题提交 Owner，陈述两种读法，不会继续依据开发主机已提出反对论证的分类暂停 gate 10。

但对于错误 canonical fact，没有修复或明确决定这是预定行为，我不会放过 gate 10。这与自身 gate-8 暂缓所用标准相同：测量一旦证明我错了，就立即撤回；这里同样要求证据或裁决。

## 5. 复核其他内容均未改变

```text
gates 1-9 and 11   MET, on my own instruments and my own rebuilds
gate 10            PAUSED on D-R1 only - nothing else is outstanding
added since        an independent three-surface scenario rebuilt with my instruments (3 of 3 surfaces listed
                   simultaneously, 22 common seqs, zero breaches, zero misses, CONVERGED by my arithmetic and by
                   the shared merge) - review/MESH-301-mech-formal-review @ c465e8c
Endpoint A         resident City + worker up, visible console window, Mech-Win online in the shared City
```
