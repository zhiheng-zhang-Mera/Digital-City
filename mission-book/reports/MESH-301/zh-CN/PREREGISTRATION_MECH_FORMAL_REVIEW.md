# Reading translation / 阅读译本

[Canonical source / 权威原文](../PREREGISTRATION_MECH_FORMAL_REVIEW.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# PREREGISTRATION — Mech 的 MESH-301 Formal Review：head 出现前决定检查内容及所用仪器

```text
FROM = Mech (formal reviewer, endpoint A)          TO = Alien (development host), Owner
STATUS = declared in advance, while development_complete is still false and review_host is still null
```

看到结果后才选择方法的复核不算复核。此处在 review head 尚不存在时写下方法，避免它受最终 head 内容塑造。

## 1. 将复核的 head

```text
CLAIM      only after the workbook sets development_complete: true AND names development_head_sha
           AND review_host is still null (no reviewer claimed)
RECONCILE  §7 exact head: the workbook's development_head_sha == the branch tip I fetch, == the sha the
           hosted CI ran on. Any disagreement is a NOT-STARTED review, reported as a §7 mismatch, not worked
           around.
CI         gate 11 requires a green hosted CI run on that exact sha. A green run on a DIFFERENT sha is not
           gate 11 and will be reported as such in the words the rule uses.
NO FORCE   I will not push to the development branch, will not rebase it, and will not repair anything on it.
           Review findings go to a review branch and to mission-book.
```

## 2. gates 及逐项判定方法

```text
 1  three control surfaces on one canonical City      read from canonical truth, NAMED entries only (an
                                                      unnamed stream client is a client, not an endpoint)
 2  Alien + Mech are two real distinct workers        canonical nodes + independent heartbeat observation
 3  Android is not a worker node                      canonical nodes must not contain an Android node
 4  Android strict-targets Alien and Mech             INDEPENDENT REPRODUCTION, and this gate is the one that
                                                      is bounded: canonical truth carries no requester, so
                                                      "an Android instruction did this" rests on the Android
                                                      receipt's provenance. I will ask whether that receipt was
                                                      written by the app on the device or by a host script, and
                                                      state the gate on that basis and no stronger.
 5  Alien <-> Mech strict-target, both directions     my own Web surface row already exists for Mech -> Alien;
                                                      the Alien -> Mech direction is Alien's evidence, checked
                                                      against the canonical seq chain, not taken on trust
 6  negative controls fail honest                     my own instruments, my own values: unknown / malformed /
                                                      surface-as-device / duplicate submit / key reuse across
                                                      devices / away target / untargeted regression. Already
                                                      built and passing 11/11 + 10/10 against the live City;
                                                      to be RE-RUN on the frozen head, because a control that
                                                      passed on a different sha is a control on a different sha
 7  untargeted tasks: no regression                   created and followed to terminal state in the same run
 8  bounded convergence, three surfaces               the merge, re-run by me from the RAW RECEIPTS, with
                                                      every offset measured in the same run as its receipt.
                                                      Already rebuilt once from Alien's published receipts and
                                                      it reproduced their verdicts exactly.
 9  Android offline/reconnect re-converges            the device's own receipt, plus canonical CLIENT_* and
                                                      NODE_* events. NOT reproducible by me on the device;
                                                      stated as read-from-receipt, not as independently measured.
10  Formal Review PASS                                this document
11  exact review-head CI PASS                         the hosted run on the reconciled sha
12  main merge + merged-main CI PASS                  after the review
13  THREE_END_MESH_E2E_ACCEPTED recorded              after the merge
14  post-completion re-entry executed                 §5 typed classification or POST_COMPLETION_REENTRY.md
```

## 3. 无论 verdict 如何，均明确未独立确立的内容

```text
* that the issuing surface of an Android command was the Android app - bounded by the missing requester field;
* gate 9 as experienced by the device - I can read the device's receipt, I cannot re-run its radio;
* anything about the Alien host's internal instrumentation, which I can re-run from its published receipts but
  did not build;
* the pre-stale boundary policy question, which is the Owner's reading to give and which I have already
  withdrawn as a gate-8 blocker (RECORD_MECH_CORRECTION_GATE8_DEFERRAL_WITHDRAWN.md).
```

## 4. 已编写且已对 live City 实际运行的仪器

```text
mech-mesh301-step52.mjs           Mech Web -> Alien-Win strict target through the product's own Run control
mech-mesh301-observe-window.mjs   a surface-observed gate-8 window, one receipt per window (tagged)
mech-mesh301-offline-target.mjs   the away-target control, using this host's reversible worker control
mech-mesh301-negative-controls.mjs the independent negative-control suite
mech-mesh301-web-surface.mjs      the step-5.2 surface receipt in merge vocabulary
```

五项均与产生的 receipt 一起发布于 `evidence/MESH-301-mech-receipts`。因此任何人可在任一主机执行或反驳上述方法，无需依赖我。

## 5. head 冻结前要求开发主机提供的两项内容

```text
1. the Android receipt's provenance (app on the device, or host script). It is the one input to gate 4 that
   canonical truth cannot supply, and it is better answered before the review than during it.
2. development_head_sha corrected to the actual branch tip when development_complete becomes true, and a green
   CI on exactly that sha. The workbook still names d9a3bac while the tip is 09a5b89.
```

两项均非要求改变结果；它们决定复核能否依据证据判定 gate 4、11，还是只能写“据报告所述”。


上述原样保留的预注册规范代码块，中文等义说明如下：

领取复核仅在工作书设置 `development_complete: true`、点名 `development_head_sha`，且 `review_host` 仍为空时进行。按 §7 精确核对工作书 SHA、fetch 到的分支 tip、hosted CI 所运行 SHA；任何不一致均记为 NOT-STARTED 并报告 §7 mismatch，不绕开。gate 11 要求该精确 SHA 上绿色 hosted CI，其他 SHA 的绿灯不算。复核者不 push、不 rebase、不修复开发分支；发现进入复核分支和 mission-book。

gate 1 从 canonical truth 读取同一 City 上三个已命名界面；匿名 stream client 不算端点。gate 2 通过 canonical nodes 和独立 heartbeat 观察证明 Alien/Mech 是不同真实 worker。gate 3 要求 canonical nodes 中没有 Android 节点。gate 4 独立重现 Android strict-target Alien/Mech，但由于 canonical truth 缺 requester，发起界面身份受 Android receipt provenance 限制；须明确 receipt 来自设备 app 还是主机脚本，只按证据强度声明。gate 5 双向 strict-target：Mech → Alien 已有自身 Web 行，Alien → Mech 证据须与 canonical seq 链核对而非信任。gate 6 使用自身仪器和值验证 unknown、malformed、surface-as-device、重复提交、跨设备复用 key、离线 target、untargeted 回归；此前 11/11 与 10/10 通过，但必须在冻结 head 重跑。gate 7 同一轮创建 untargeted 任务并追踪至终态。gate 8 从原始 receipt 自行重跑合并，每项偏移与 receipt 同轮测量；此前已独立重建并精确复现 Alien verdict。gate 9 依据设备 receipt 与 canonical CLIENT_*/NODE_* 事件读取 Android 离线重连；本端不能在设备复现，应声明为 receipt 阅读而非独立实测。gate 10 是本正式复核；gate 11 是精确 reconciled head CI；gate 12 在复核后 main 合并及 merged-main CI；gate 13 在合并后记录 `THREE_END_MESH_E2E_ACCEPTED`；gate 14 在终态后按 §5 类型分类重新入池或记录 POST_COMPLETION_REENTRY。

无论 verdict 如何，不独立确立：Android 指令确由 Android app 发出（缺 requester）；设备体验的 gate 9（可读 receipt、不能重跑无线电）；Alien 内部仪器（可从发布 receipt 重跑，但非本端编写）；pre-stale 政策边界（由 Owner 裁决，且本端已撤回其 gate-8 blocker 分类）。

五种已运行仪器分别负责：通过产品 Run 控件的 Mech Web → Alien-Win；逐窗口带标签的 gate-8 界面观察 receipt；使用本主机可逆 worker 控制的离线 target；独立负对照套件；合并词汇下的第 5.2 步 Web receipt。冻结前要求开发主机回答 Android receipt provenance，并在 `development_complete: true` 时将 `development_head_sha` 修正为实际 branch tip、取得其精确 SHA 绿色 CI；当时工作书仍为 d9a3bac，tip 已为 09a5b89。
