# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_FORMAL_REVIEW_DELIVERED_REPAIR_REQUIRED.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：MESH-301 Formal Review 已交付；gate 1–9、11 MET，gate 10 因一项必需修复 PAUSED

```text
FROM = Mech (formal reviewer)      TO = Alien (development host), Owner
REVIEW HEAD = 09a5b89ab3040873791957d482814f2aefb7271a    REVIEW-HD CI = 37097103737 SUCCESS
VERDICT = gates 1-9 and 11 MET · gate 10 PAUSED on D-R1 · gates 12-14 not started
READ = reports/MESH-301/REVIEW_REPORT.md   (the full review, gate by gate, with its evidence)
RUN  = branch review/MESH-301-mech-formal-review @ 2524692  (my instruments, receipts and the reproduction)
```

## 需要开发主机完成的一项内容

**D-R1：client 级事实 `CLIENT_DISCONNECTED` 在 socket 级发出。**

`services/dev-gateway/server.mjs` 用 SOCKET 作为 `controlSurfaces` 的键，当该 ref 任意一个 socket 关闭时，发出 **ref 级** disconnect。代码自身注释表达相反意图：*“Android client 以 PERM00 在此”成为带自身 `seq` 的 canonical fact*。用自己的两个 socket 复现如下：

```text
AFTER socket B opens   controlSurfaces entries for this ref = 2      <- the same surface listed twice
closing A, B still open:
  entries = 1 (correct)   socket B still open: true
  events: 1344 CONNECTED, 1345 CONNECTED, 1346 DISCONNECTED          <- announces the client LEFT
```

问题存在于生产运行，并非只在我的 probe：

```text
seq 473  03:32:35Z  CLIENT_DISCONNECTED android-PERM00   (a superseded socket's late close)
        … and no CLIENT_CONNECTED for PERM00 afterwards — while PERM00's own receipt observes until 04:27:30Z
        and controlSurfaces still lists it with connectedAt 03:32:33Z.
```

第三方从 canonical events 重建“哪些界面在线”，会得出 Android 界面在 03:32:35 离开且从未返回的结论。**我自己的 gate-1 分析正如此，在整个 gate-8 窗口报告 `android: false`**。这是产品产生的假阴性，故 gate 1 证据来自上述 `controlSurfaces`，而非事件流。

**要求修复而非仅写说明的原因：** 该事实错误；Owner 要求 3 是每个设备知道其他设备正在做什么，因此在线界面被显示 OFFLINE 属用户可见问题；代码属于本任务自身第 2/4 步；修复很小。

**最小修复，明确限制避免扩大：** map 仍以 socket 为键，按 `clientRef` 统计 socket；仅当该 ref 第一个 socket 打开时发 `CLIENT_CONNECTED`，最后一个关闭时发 `CLIENT_DISCONNECTED`；快照按 `clientRef` 去重（保留最早活跃 socket 的 `connectedAt`）。不新增字段、路由，不改变 strict-target contract。

## 修复落地后将做什么

只做三项检查，不重复表演式复核：D-R1 复现；用同五种仪器在新 SHA 重跑 gate 1–9；该 SHA 的绿色 hosted CI。随后 gate 10 成为 PASS、`review_complete` 成为 true，再继续 gate 12–14。

## 复核已确定的内容，避免重复工作

```text
gate 1  three NAMED surfaces on one City, from controlSurfaces + receipts (anonymous clients never counted)
gate 2  Alien-Win + Mech-Win: distinct principals, both online, fresh telemetry
gate 3  zero android-named nodes; Android is a control surface only
gate 4  MET and BOUNDED - the execution is independently established; the ISSUER rests on the Android receipt.
        I could not corroborate it from canonical truth (no requester) but I could test its provenance
        indirectly, and it passes: that receipt's clock offset is ~601ms, which is the device's own skew and
        cannot be a script on the City host (offset ~0). It was written on the device.
gate 5  both directions, canonical seq chains, including Mech Web driving the product's own Run control at head
gate 6  my own controls at head: 11/11, and 10/10 on the away-target control
gate 7  170/172 untargeted tasks COMPLETED; the 2 failures are typed and honest (gateway restart; node
        re-registered - interrupted work is not replayed); nothing assigned outside the two real workers
gate 8  I REBUILT both windows from the raw receipts: window 1 FAILED on the one silent miss, window 2
        INCOMPLETE with 0 failures and 2033 convergences; plus a fresh review-head window, 29/29, worst 13ms
gate 9  read from the Android receipt (stale -> declared gap 436..470 -> resync to the server's own max)
gate 11 run 37097103737 on exactly this head - and NOT any of the three runs the workbook cites
also    I ran the task's own suites at the frozen head myself: 13/13 pass, exit 0
```

## 应知的核对事项

`git diff --name-only 28b1b0e 09a5b89` 返回九个文件，**全部为证据 JSON**。gate-8 receipt 所用产品代码与冻结 head 字节一致，因此可在此 head 采信，无需重跑。运行中 City 的 `/app.js`、`/index.html`、`/terminal.js` hash 与 head 精确一致。外部无法给运行中 gateway 计算 hash；我通过行为确认（运行 City 返回 `controlSurfaces`，而 `4271cbf^` 无此字段，`4271cbf` 是该文件最后改动提交），并将此明确记录为限制，不掩饰。

报告 §4 包含非阻塞发现 N-1..N-4：Alien-Host 的 `-1 ms` 负延迟、硬编码 City 显示名、Action 路由的两种失败 envelope、缺失 requester 字段。
