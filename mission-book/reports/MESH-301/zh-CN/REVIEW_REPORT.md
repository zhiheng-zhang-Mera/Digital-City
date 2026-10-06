# Reading translation / 阅读译本

[Canonical source / 权威原文](../REVIEW_REPORT.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# MESH-301 — 正式审查

```text
REVIEWER        Mech (endpoint A) - a different physical host from the development host
REVIEW HEAD     09a5b89ab3040873791957d482814f2aefb7271a   (mesh/MESH-301-three-end)
REVIEW-HD CI    37097103737  COMPLETED SUCCESS on exactly that sha  ("V0.2 checks": android + gateway-web)
METHOD          preregistered at reports/MESH-301/PREREGISTRATION_MECH_FORMAL_REVIEW.md, BEFORE the head existed
VERDICT         gates 1-9 and 11 MET · gate 10 PAUSED on ONE required repair (D-R1) · gates 12-14 not started
```

记录释义：reviewer 是 endpoint A 的 Mech，与开发主机为不同物理主机；review head、该 head 的成功 CI、事前登记方法如原证据所列。初始裁定为 gates 1-9、11 MET，gate 10 因唯一必修 D-R1 PAUSED，12-14 未开始；后续修复验收见末节，不删除旧裁定。

## 1. 第 7 节 — 精确 head 核对

以下每一行都是领取时的测量，不是引用 development report。

```text
development_complete                        true
workbook development_head_sha               09a5b89ab3040873791957d482814f2aefb7271a
remote branch tip (ls-remote, not a local
ref that could be stale)                    the SAME sha
review_host before the claim                null            (nothing overwritten; the claim is in the workbook)
host separation                             development Alien · review Mech
```

释义：development_complete 为 true；工作书 SHA 与 ls-remote 实测远端分支 tip 相同，不依赖可能陈旧的本地 ref；领取前 review_host 为 null，未覆盖任何记录；领取在工作书中，开发 Alien、review Mech，主机分离。

**head 必须对应代码，不只是 commit。** 两项独立检查：审查未实际运行的 SHA 就等于没有审查。

```text
(1) RECEIPT LINEAGE.  git diff --name-only 28b1b0e 09a5b89  returns NINE files and every one of them is under
    evidence/raw/mission-book/MESH-301/alien-side/. So the gate-8 receipts, which were produced while the branch
    was at 28b1b0e, were produced on product code that is byte-identical to the frozen head. The head adds
    evidence and nothing else. This is why the window-2 table is admissible at this head without re-running it.

(2) LIVE ASSETS.  the canonical City at 172.31.3.110:4391 serves, byte for byte:
        /app.js        sha256 4dc4ead1449ca3c5…  == 09a5b89:apps/web/app.js
        /index.html    sha256 d8c7025ff1277cd1…  == 09a5b89:apps/web/index.html
        /terminal.js   sha256 63dd08a542a4d862…  == 09a5b89:apps/web/terminal.js
    The three browsers and the strict-target Run control I exercised were the reviewed revision.

(3) RUNNING GATEWAY.  a long-lived process cannot be hashed from outside, so this was decided by behaviour:
    the live City answers with `controlSurfaces` and emits `CLIENT_CONNECTED/DISCONNECTED`, and neither exists in
    4271cbf^:services/dev-gateway/server.mjs - so the running server.mjs includes 4271cbf - and 4271cbf is the
    LAST commit to touch server.mjs, whose blob at the head is identical. The running gateway therefore contains
    the head's server.mjs. LIMIT, stated rather than glossed: this is behavioural identity, not byte identity.
```

完整释义：(1) Receipt lineage：`git diff --name-only 28b1b0e 09a5b89` 只有九文件，均在 `evidence/raw/mission-book/MESH-301/alien-side/`。因此在 28b1b0e 生成的 gate-8 receipts 对应产品代码与冻结 head 字节一致，head 只加证据。这使 window-2 表无需重跑即可用于此 head。(2) 在线 assets：canonical City 提供的 app.js、index.html、terminal.js 与 head 对应文件逐字节一致，hash 见原块；测试的三浏览器及 strict-target Run 控件均为被审 revision。(3) 运行 gateway：无法从外部 hash 长期进程，因此以行为判断。在线 City 返回 controlSurfaces 并发出 CLIENT_CONNECTED/DISCONNECTED，而 4271cbf 的父版本 server.mjs 均无这些功能，因此运行代码包含 4271cbf；该 commit 是最后修改 server.mjs 的 commit，其 blob 与 head 一致。运行 gateway 因此包含 head server.mjs。限制必须明确：这是行为身份，不是字节身份。

## 2. 逐 gate 核验

```text
GATE 1  three real control endpoints simultaneously on one canonical City ......... MET
GATE 2  Alien + Mech are two real, distinct worker nodes .......................... MET
GATE 3  Android does not pretend to be a worker node .............................. MET
GATE 4  Android strict-targets Alien and Mech, once each .......................... MET (bounded, §4)
GATE 5  Alien and Mech strict-target each other ................................... MET
GATE 6  negative controls fail honest (away / unknown / malformed / duplicate) .... MET
GATE 7  untargeted tasks: no regression ........................................... MET
GATE 8  bounded convergence on canonical seq, three surfaces ...................... MET
GATE 9  Android offline/reconnect re-converges .................................... MET (read from its own receipt)
GATE 10 Formal Review PASS ........................................................ PAUSED - one required repair
GATE 11 exact review-head CI ...................................................... MET
GATES 12-14 merge / merged-main CI / terminal marker / re-entry ................... not started, not claimed
```

表完整释义：gate 1 三真实控制 endpoint 同时连接一 canonical City；2 Alien、Mech 是两不同真实 workers；3 Android 不伪装 worker；4 Android 分别严格定向两者，各一次，结论有界；5 Alien、Mech 互相严格定向；6 离线、未知、畸形、重复负控诚实失败；7 非定向无回归；8 三界面 canonical seq 有界收敛；9 Android 离线重连后收敛，据自身 receipt；上述均 MET。10 Formal Review PASS 初始 PAUSED，需一必修；11 精确 review-head CI MET；12-14 merge、merged-main CI、terminal marker、re-entry 未开始且不声称满足。

**Gate 1。** 本次 review 三次采样的 canonical City controlSurfaces 列出 PERM00、Mech-Win-Web；City 连接事件显示 Alien Web（web-e622eirv）在线 03:59:59.657Z → 04:27:24.315Z，Mech-Win-Web（web-mech-z20yxrrj）在线 04:00:27.306Z → 04:34:32.181Z，覆盖声明的 gate-8 区间；PERM00 由自身 receipt 覆盖。三者 clientRef、clientLabel 均非空，可归属而非匿名 stream clients。**此 gate 应如何举证本身也是发现：见 D-R1，不能用事件流重建 presence。**

**Gate 2/3。** Alien-Win、Mech-Win 均 win32、online:true，heartbeat 距采样不足 4 秒，devicePrincipalId 不同，均有 cpu、memory、disk、uptimeSeconds telemetry。节点列表无 android 命名身份，android-named nodes: 0。Android 仅为控制界面，符合设计审计要求。

**Gate 4。** Android 侧运行的两严格定向指令进入 canonical truth，均由指定设备执行：Q-fa5c5669… → Alien-Win，03:15:26.912Z 创建，COMPLETED、assigned Alien-Win；Q-cfc3912a… → Mech-Win，03:15:59.663Z 创建，COMPLETED、assigned Mech-Win。Android receipts 覆盖两窗口。**结论有界，这一边界关键**：canonical truth 没有 requester（开发记录 D-R2；我自行核验 Action/task keys），因此独立确立的是每设备严格定向指令被接受、持久化、仅指定设备执行并以结果 digest 完成；由 Android 发出这一点依赖 Android receipt。可间接检验 receipt 出处且检验通过：最小 raw clock offset 约 601 ms，是设备自身 skew，不可能是 City 主机脚本（offset 约 0）。所以它是设备侧 receipt，而非冒用设备名称的主机脚本。

**Gate 5。** 严格定向列表中有双方向 canonical seq chains：Alien 侧 → Mech-Win，Q-6958c120…、seq 16-76，包括 TASK_TARGET_WAITING OFFLINE → TASK_TARGET_READY → TASK_ASSIGNED Mech-Win；Mech 侧 → Alien-Win，我自身 Q-0e068bea…、seq 359-382，且在 review head 再次通过产品 #run-target + #run 运行 Q-22aa3d23…、seq 1310-1316。

**Gate 6。** 冻结 head 使用我自己的工具与值重跑：control suite **11/11**，unknown → TARGET_DEVICE_UNKNOWN，malformed → TARGET_DEVICE_MALFORMED，控制界面标签当设备被 unknown 拒绝且无 task，完全相同 retry replay 相同 task/action，同一 key 不可复用于另一设备，http 400 IDEMPOTENCY_KEY_REUSED 且无 task。away-target control **10/10**，主动移走本主机 worker：创建 task 并 WAIT，TASK_TARGET_WAITING targetState=OFFLINE reason=TARGET_DEVICE_OFFLINE，健康另一节点 15 秒不领取；返回后 TASK_TARGET_READY seq 1303 先于向 Mech-Win 的 TASK_ASSIGNED seq 1304。

**Gate 7。** canonical truth 有 172 CHECKPOINT_DEMO tasks，**170 COMPLETED、2 FAILED**。两失败是诚实基础设施结果而非回归：“执行中 Gateway 重启；创建新任务以安全重试”和“Node 重新注册；被中断工作不 replay”。无非定向任务分配给两个真实 workers 之外的节点；我 review 运行另建三非定向 tasks 均完成。

**Gate 8。** 用自己的 invocation 从 raw receipts 重建两个窗口，而非阅读发布表：

```text
window 1  FAILED      1 failure   CONVERGED 1434   the failure is the one the development record names:
                                                    seq 505 "Alien Web: online surface never observed seq 505"
window 2  INCOMPLETE  0 failures  CONVERGED 2033   GAP_DECLARED 4 · LATE 0
```

释义：window 1 FAILED，1 failure、CONVERGED 1434；失败就是开发记录的 seq 505，在线 Alien Web 未观察到。Window 2 INCOMPLETE，0 failures、CONVERGED 2033，GAP_DECLARED 4、LATE 0。

我也在 review head 重跑新 Mech 界面窗口：CONVERGED，29/29 seqs、0 failures，最坏 13 ms，界限 5000 ms，同次测得 clock offset -1034 ms。

我还在实际测量后 **撤回了自身早先 gate-8 异议**：merged timeline 过滤到声明区间 04:08:00Z-04:26:00Z，得到 **376 entries、四 observers 全部零 GAP_DECLARED/MISSING/LATE**；残留在测试区间外。完整记录见 RECORD_MECH_CORRECTION_GATE8_DEFERRAL_WITHDRAWN.md。

**Gate 9。** 据 Android 自身 receipt：stale 03:32:26.587Z，reconnected 03:32:34.141Z，声明 gap 436..470，resync 至服务器自身 max seq 471。即界面显示 stale、标明缺口、重新收敛 City truth 而非自身状态。我无法独立重现：能读取设备 receipt，不能重跑其 radio。

**Gate 11。** 37097103737 精确运行于 09a5b89。工作书 development_ci 引用的三 runs 在 28b1b0e、5611e4b 等，均非本 head，这正说明精确 head 检查不是形式。我也在冻结 head 自行运行任务两 suites：**13/13 pass、exit 0**。

## 3. 必修 D-R1：CLIENT_DISCONNECTED 是 client 级事实，却按 socket 级发出

**由 review 发现，以自身 client 在本任务新增代码中重现。** Gateway 注释说明设计意图：“Android client 以 PERM00 在线”成为拥有自身 seq 的 canonical fact，所有界面收敛于此，而非各自从 socket 状态私下推断。实现未兑现：

```js
controlSurfaces.set(ws, {...identity, connectedAt: now()});   // keyed by SOCKET
emit('CLIENT_CONNECTED', null, {clientRef, clientLabel});
ws.on('close', () => { const gone = controlSurfaces.get(ws); controlSurfaces.delete(ws);
                       if (!closed) emit('CLIENT_DISCONNECTED', null, {clientRef: gone?.clientRef, …}); });
```

用我自身两个同 clientRef、都打开的 sockets 重现：

```text
AFTER socket A opens   controlSurfaces entries for this ref = 1
AFTER socket B opens   controlSurfaces entries for this ref = 2     <- the SAME surface listed twice
closing A, B still open:
  controlSurfaces entries for this ref = 1     (correct)
  CLIENT_* events: 1344 CONNECTED, 1345 CONNECTED, 1346 DISCONNECTED   <- announces that the client LEFT
  socket B still open: true
AFTER socket B closes  controlSurfaces entries = 0   (cleanup on the last socket is correct)
```

释义：A 打开为一 entry；B 打开变两 entries，同界面重复列出。关闭 A、B 仍开，列表剩一正确，但发出 CONNECTED、CONNECTED、DISCONNECTED，宣称 client 已离开；B 仍在线。B 最后关闭才归零，最后 socket cleanup 正确。

**后果发生于生产，而非实验室。** Android 重连时保持多个 socket，canonical truth 因而出现虚假的 client 级断线：

```text
seq 471  03:32:33.531Z  CLIENT_CONNECTED     android-PERM00   (new socket)
seq 473  03:32:35.488Z  CLIENT_DISCONNECTED  android-PERM00   (the SUPERSEDED socket's late close)
…and NO further CLIENT_CONNECTED for PERM00 - while PERM00's own receipt shows it observing continuously until
04:27:30Z and controlSurfaces still lists it with connectedAt 03:32:33.531Z.
```

释义：seq 471 是新 socket CONNECTED；seq 473 是被替换旧 socket 延迟关闭的 DISCONNECTED。PERM00 此后没有 CONNECTED，却在自身 receipt 持续观察到 04:27:30Z，controlSurfaces 仍以 connectedAt 03:32:33.531Z 列出。

第三方从 City 事件流重建在线界面——工作书要求设备收敛的 canonical truth——会断定 Android 在 03:32:35 离开且未返回。**我自身 gate-1 分析正如此，对整个 gate-8 窗口报告 android:false。** 这是产品造成的假阴性，故上述 gate 1 用 controlSurfaces 而非 events 举证。

为何这是必修而非备注：

```text
* it is a canonical fact that is false, and canonical truth is what the whole task is built on;
* Owner requirement 3 is that every device knows what the others are doing - a surface that appears OFFLINE
  while it is online is a user-visible wrong state, not an internal detail;
* it is in the code this task introduced for control-surface identity (step 2/4), inside the allowed boundary
  ("the minimal connection configuration for three control endpoints pointing at one canonical City");
* it is small and precisely specified (below), so the cost of repairing it is one commit, not one round.
```

完整释义：canonical fact 为假，而整个任务建立在 canonical truth 上；Owner requirement 3 要求每设备知道其他设备在做什么，在线界面显示 OFFLINE 是用户可见错误而非内部细节；缺陷在本任务第 2/4 步新增控制界面身份代码内，属于“三控制 endpoint 指向一 canonical City 的最小连接配置”允许范围；修复小且下文精确定义，成本是一 commit 而非一整轮。

**最小修复，明确规定以防过度建设**：map 仍按 socket keyed，但通过统计每 clientRef sockets 使 EVENTS 变 client 级；仅 ref 首 socket 打开时 CLIENT_CONNECTED，仅 **最后** socket 关闭时 CLIENT_DISCONNECTED；snapshot 按 clientRef 去重，每界面一 entry，connectedAt 为最早在线 socket。不新增字段、route，不改变 strict-target 契约。

## 4. 非阻塞发现：记录以免之后重复发现

```text
N-1  Alien-Host declares clock skew 0 against a minimum raw of -1 ms, so 40 seqs in window 2 and 41 in window 1
     appear at -1 ms - a number that cannot be a latency, in the latency column. No verdict changes. Fix by
     declaring -1, or by having the merge refuse a negative latency.
N-2  displayName is hard-coded 'Utopia · Alien' in services/dev-gateway/server.mjs and pairing.mjs, so the Mech
     host's resident City also introduces itself as "Utopia · Alien". cityId differs and is the real identity, so
     nothing is broken; a human comparing two City snapshots side by side would be misled.
N-3  the Action route answers failures in two envelopes: a refused TARGET is http 200 with an Action whose
     status is REFUSED, while a reused idempotency key is http 400 with a top-level {error, errorCode} and no
     Action. Defensible, but a client must handle both - it misled my first control run.
N-4  neither the Action nor the City task carries a requester, so the issuing surface of an instruction is not
     attributable from canonical truth. This bounds gate 4, as stated in §2.
```

完整释义：N-1 Alien-Host 对最小 raw -1 ms 声明 skew 0，window 2 的 40 seqs、window 1 的 41 seqs 在 latency 列呈 -1 ms，这不是 latency；不改变裁定。可声明 -1 或让 merge 拒绝负 latency。N-2 server.mjs、pairing.mjs 硬编码 displayName Utopia · Alien，使 Mech 常驻 City 也这样自称；cityId 不同且才是真身份，因此无功能损坏，但人类并排比较 snapshots 会被误导。N-3 Action 失败两种 envelope：TARGET 拒绝是 http 200、Action status REFUSED；idempotency key 复用是 http 400、顶层 error/errorCode 且无 Action。可以辩护，但 client 必须处理两者，曾误导我首次 control run。N-4 Action 和 City task 均无 requester，canonical truth 无法归属指令发起界面，故 gate 4 有 §2 所述边界。

## 5. 无论裁定如何，我未独立确立的内容

```text
* that the Android app (rather than anything else on that device) wrote the Android receipts - bounded, and the
  clock-offset argument in §2 gate 4 is the strongest available evidence, not proof;
* gate 9 as lived by the device - read from its receipt, not re-enacted;
* byte identity of the RUNNING gateway process with the head - behavioural identity only (§1(3));
* the Alien host's internal instrumentation - I re-ran it from its published receipts, I did not build it;
* the pre-stale boundary policy question, which remains the Owner's reading to give.
```

完整释义：未证明是 Android app 而非设备上其他程序写了 Android receipts，§2 gate 4 clock-offset 论据是目前最强证据而非证明；gate 9 来自设备 receipt 而非重新实测；运行 gateway 与 head 仅行为身份，无字节身份；Alien 内部工具只从发布 receipts 重跑，非我构建；pre-stale boundary 政策仍待 Owner 解读。

## 6. 证据

```text
review branch   review/MESH-301-mech-formal-review   (instruments + receipts + the reproduction of D-R1)
instruments     mech-mesh301-review-analysis.mjs        canonical-truth analysis for gates 1/2/3/4/5/6/7
                mech-mesh301-duplicate-socket-probe.mjs  the D-R1 reproduction
                mech-mesh301-step52.mjs                  Mech Web -> Alien-Win through the product's own control
                mech-mesh301-offline-target.mjs          away-target control
                mech-mesh301-negative-controls.mjs       the independent negative-control suite
                mech-mesh301-observe-window.mjs          a surface-observed window, one receipt per window
receipts        evidence/raw/mission-book/MESH-301/review-by-mech/*   (17 evidence files in this head all parse)
```

释义：review 分支包含工具、receipts、D-R1 reproduction。review-analysis 分析 gates 1/2/3/4/5/6/7 canonical truth；duplicate-socket-probe 重现 D-R1；step52 通过产品控件 Mech Web → Alien-Win；offline-target 是 away-target control；negative-controls 为独立负控 suite；observe-window 是界面观察窗口、每窗口一 receipt。本 head 的 review-by-mech 17 evidence files 均可解析。路径与文件名以原块为准。

## 7. 后续步骤

在 D-R1 修复并验证前，gate 10 保持 PAUSED。修复 head 仅复验三件事（§8 最小修复，不进行表演式重新 review）：D-R1 reproduction；以五工具重跑确认新 SHA gates 1-9 仍成立；新 SHA 自身绿色 hosted CI。三者满足才 gate 10 PASS、review_complete true，推进 12-14。

## 8. 补充：主动攻击 Android staleness 修复，而非只读说明

冻结记录要求 reviewer 专项攻击，因为“以省略方式撒谎的界面正是工作书禁止的”。已攻击，修复成立：

```text
DECLARED GAP        gap 436..470
CANONICAL TRUTH     exactly 35 events in 436..470
THE SURFACE SAW     0 of those 35          (it observed 433,434,435 then 471,472,473)
=> the gap's boundaries are EXACT on both sides: it neither over-claims (nothing outside was missed) nor
   under-claims (nothing inside was hidden)

PROMPTNESS          last event before the gap: seq 436 at 03:32:25.925Z; the surface went `stale` at
                    03:32:26.588Z - 0.66 s later, so no long silence was relabelled as a gap
RE-CONVERGENCE      `resync` maxSeq=471 at 03:32:34.235Z, i.e. it re-read the SERVER's own maximum, and 471 is
                    the first seq it then observed. It did not resume from its own last-seen seq.
SINGLE SURRENDER    `dropSocket()` is the one place the socket is surrendered, and it does the four things in
                    the right order: socket=null, socketOnline=false, wasDown=true, `stale`, then cancel(). The
                    code comment records the defect it replaced (the field was nulled FIRST, so the `onFailure`
                    guard compared against null and discarded the callback - silently stale), and the receipt
                    above is the proof that the callback now survives.
GAP SELF-DECLARATION on any message with seq > lastObservedSeq + 1 it logs the gap with exact bounds; that is
                    where 436..470 came from, and it is why window 1's `MISSING x8` became window 2's
                    `GAP_DECLARED`.
GENERATION BINDING  the resync is stamped only when `generationAtFetch == openGeneration`, so a refresh that
                    began before the socket reopened cannot stamp a pre-reconnection snapshot as the
                    re-convergence. Verified by reading the head's Kotlin, not by taking the comment's word.
```

完整释义：声明 gap 436..470；canonical truth 正好 35 events；界面这 35 个全未观察到，只看到 433、434、435 后跳到 471、472、473，因此两边界准确，既未夸大（外部无缺失）也未少报（内部无隐藏）。Promptness：gap 前最后事件 seq 436 在 03:32:25.925Z，stale 在 03:32:26.588Z，相隔 0.66 秒，没有将长期静默事后改名为 gap。Re-convergence：03:32:34.235Z resync maxSeq=471，重读服务器自身最大值，随后首观察 seq 也是 471，非从自身 last-seen 恢复。Single surrender：dropSocket() 是唯一释放 socket 处，按正确顺序 socket=null、socketOnline=false、wasDown=true、stale，再 cancel()；注释记录旧缺陷先置空字段，onFailure guard 比较 null 丢 callback，导致静默 stale；receipt 证明 callback 现存活。Gap self-declaration：seq > lastObservedSeq+1 时记录精确 gap，436..470 因此产生，window1 MISSING x8 变 window2 GAP_DECLARED。Generation binding：仅 generationAtFetch==openGeneration 标记 resync，防止 socket 重开前开始的 refresh 把旧 snapshot 标为重收敛；通过读取 head Kotlin 验证，不目信注释。

记录与代码注释的一处不一致，因为之后容易被抹平：注释说“实测 8 such seqs straddling the stale record”，receipt gap 却为 **35 seqs**。可分别来自不同测量，且本处以 receipt 为准，因此列为备注而非缺陷。

**仍进行了修正，且开发主机解释比我的备注更好。** ed0bf64 注释分开两数字：界面自报 hole 为 436..470，即 **35 events**；其中 **8** 个受影响 seqs 落在声明 offline interval 外、位于 stale 前，因此 R1 修复前呈 silent MISSING。两数字从未冲突，原句把不同量混在一起，正如本节所述；修复后的注释明确各自含义。

## 9. 补充：D-R1 已修复，以三种方式验证

于 29f26910e411945134b16fd0a8f601b4dbdd7f45 修复并带到最终 head ed0bf64，准确按规定且无额外改动：map 仍按 socket keyed，逐 ref 在线 socket 数判断 presence，数量从零上升才 CLIENT_CONNECTED，降为零才 CLIENT_DISCONNECTED，snapshot 按 clientRef 去重。

**Heads 已核对。** 修复后因 docs-only commit 修改 Android 注释（上述 8 与 35 混淆）移动一次到 ed0bf64。29f2691 与 ed0bf64 的 services/dev-gateway/server.mjs **字节一致**，按 blob hash 比较而非 diff 摘要，因此验证的是同产品行为。修复 head 相对被审 head 仅三路径不同：services/dev-gateway/server.mjs、tests/mesh301-surface-identity.test.mjs 和 Android 注释。

```text
(1) AGAINST THE LIVE CITY.  The gateway was restarted (CITY_STARTED seq 1430 at 05:18:52.651Z, after the repair
    commit), so the fix is live rather than merely committed - the point I flagged, because a repaired
    server.mjs inside a long-lived process would otherwise have left my re-verification testing the old code.
    The reviewer's own duplicate-socket probe, unchanged, now reads:
        after socket A opens   entries for this ref = 1
        after socket B opens   entries for this ref = 1        (was 2)
        closing A, B still open: entries = 1, B still open, CLIENT_DISCONNECTED emitted: FALSE   (was TRUE)
        after B closes         entries = 0
    The same probe that announced a departure now does not, and the client is never lost from the list.

(2) THE GUARD IS REAL, NOT DECORATION.  The development host made my reproduction permanent as
    tests/mesh301-surface-identity.test.mjs and claimed it fails against the unrepaired server. I ran it against
    BOTH revisions rather than take that on trust:
        at 09a5b89 (unrepaired):  2 tests, 0 pass, 2 fail  - "a second socket for the same client must not add
                                   a second row", "anonymous surfaces are one presence, honestly labelled null"
        at 29f2691 (repaired):    2 tests, 2 pass, 0 fail
        at ed0bf64 (final head):  2 tests, 2 pass, 0 fail
    That is a regression guard with a demonstrated failure mode, which is the only kind worth having.

(3) GATES 1-9 RE-RUN AT THE REPAIRED HEAD, with the same five instruments and no re-interpretation:
        negative controls            11/11 PASS
        away-target control          10/10 PASS  (TASK_TARGET_WAITING seq 1467 -> TASK_TARGET_READY seq 1469 ->
                                                 ASSIGNED Mech-Win seq 1470, target OFFLINE at creation)
        Mech Web -> Alien-Win        8/8 PASS, offset-free upper bound 9 ms, through the product's own control
        canonical-truth analysis     29 strict-target tasks, every one assigned to its own target and COMPLETED;
                                     158 untargeted tasks, 156 completed, 2 typed honest failures, nothing
                                     assigned outside the two real worker nodes
        surface-observed window      CONVERGED 27/27, worst case 9 ms against the 5000 ms bound
    GATE 11  run 37099671088 COMPLETED SUCCESS on exactly ed0bf64
```

完整释义：(1) 在线 City：gateway 在修复 commit 后重启，CITY_STARTED seq1430、05:18:52.651Z，所以修复真正在线，避免长期进程继续测试旧代码。未改 reviewer duplicate-socket probe：A 打开 entries1，B 打开仍1（旧2）；关A但B开，entries1、B在线且不发 DISCONNECTED（旧会发）；关B后0。相同 probe 不再错误宣告离开，也不从列表丢 client。(2) 实际 guard：开发把 reproduction 纳入永久测试并声称旧 server 会失败，我在两 revisions 实跑：09a5b89 两 tests、0pass/2fail，错误分别为同 client 第二 socket 不应增加第二行、匿名界面是一 presence 且诚实标 null；29f2691 与最终 ed0bf64 均2/2pass。这是展示过失败模式的真实 regression guard。(3) 同五工具在修复 head 重跑 gates1-9，无重新解释：negative11/11PASS；away-target10/10PASS，创建时OFFLINE、WAITING1467→READY1469→ASSIGNED Mech-Win1470；Mech Web→Alien-Win8/8PASS，产品控件发起、无offset上界9ms；canonical truth29严格定向tasks均各自目标执行且COMPLETED，158非定向156完成、2诚实typed失败，无节点超出两真实workers；界面窗口CONVERGED27/27、最坏9ms对5000ms界限。Gate11 run37099671088 精确ed0bf64 COMPLETED SUCCESS。

**Gate 10：PASS。Gates 1-11：MET。head ed0bf64 的 review_complete:true。** 工作书 development_head_sha 同 commit 更新为相同 SHA，因为 review 通过工作书未命名的 head 正是 §7 规则要防止的不匹配；这是因本 review 发现导致 head 变动而修改的事实字段，特此记录而非静默修改。
