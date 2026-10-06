# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../POST_COMPLETION_REENTRY.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# POST_COMPLETION_REENTRY — UXI-391 mandatory automatic reentry scan after terminal state

```text
uxi391_terminal_marker        = REMOTE_HANDOFF_CLOSEOUT_REPAIRED
utopia_main_sha               = ec12fd0831f31fd81aef9cd9dfb0c959d010f63b
utopia_main_ci                = 37088960085 = success（android + gateway-web，绑定该 sha）
digital_city_main_sha         = <本记录所在提交>（写入时即本文件所在提交）
扫描方式                      = 重新读取 origin/main 的工作书清单与 frontmatter，不沿用开工前的旧结论
```

Terminal marker is REMOTE_HANDOFF_CLOSEOUT_REPAIRED. Utopia main is `ec12fd0831f31fd81aef9cd9dfb0c959d010f63b`, with run 37088960085 succeeding on both android and gateway-web bound to that SHA. Digital-City main SHA is the commit containing this record when written. The scan rereads origin/main's workbook list and frontmatter rather than reusing pre-construction conclusions.

## 1. Three scan sets and results

```text
(1) merge_authority: true 且状态非终态的工作书
    → 只有 UXI-391 自己（本任务，现已终态）。此外无。
(2) 文件名含 MERGE_WORKBOOK 的工作书
    → 4 个：BUTLER_ASSISTANT / ENGINEERING_MANAGER / GENERAL_AI_GATEWAY / REMOTE_FABRIC，
      全部位于 finished/completed-2026-10-01/**，按规则【绝不重开】。
(3) 当前 programme 声明的 integration / merge / closeout 工作书
    → UXI-391（本任务，终态）；
      MESH-301（mission-book/finished/completed-2026-10-06/mesh-3end/，Owner 指示三端实机测试，Alien 起草）：
      execution_enabled: false、status: DRAFT_PENDING_OWNER_APPROVAL → **当前不可领取**。
```

1. Workbooks with merge_authority:true and non-terminal status: only UXI-391 itself, this task now terminal; no others.
2. Filenames containing MERGE_WORKBOOK: four, BUTLER_ASSISTANT, ENGINEERING_MANAGER, GENERAL_AI_GATEWAY and REMOTE_FABRIC. All are under finished/completed-2026-10-01/** and **must never be reopened**.
3. The current programme's integration/merge/closeout workbooks: UXI-391, now terminal, and MESH-301 under mission-book/finished/completed-2026-10-06/mesh-3end/, drafted by Alien for Owner's three-end physical-test instruction. With execution_enabled:false and DRAFT_PENDING_OWNER_APPROVAL, MESH-301 is **not currently claimable**.

## 2. Typed classification fields

```text
merge_candidates_scanned      = 3 类（见上）；候选总数 5（UXI-391、4 个历史 MERGE_WORKBOOK、MESH-301）
eligible_now                  = 0
temporarily_unclaimable       = 1  → MESH-301（解锁事件 = Owner 批准本草案）
structurally_ineligible       = 0  （没有稳定机制排斥 Alien；不适用 §5.2）
external_blocked              = 0  （不适用 §5.3；Owner gate 按既有先例归 §5.1 第 110 行）
next_claimed_workbook         = 无
next_claim_host               = —
wake_condition                = Owner 批准 MESH-301（execution_enabled: true 且 status: READY），
                                或 any new workbook 出现；事件优先，20 分钟仅兜底
pool_classification_if_no_claim = 5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY
```

The scan covers three categories. The source states candidate total five while listing UXI-391, four historical MERGE_WORKBOOKs and MESH-301; this historical number is preserved, not silently corrected. eligible_now=0; temporarily_unclaimable=1, MESH-301, unlocked by Owner approving the draft. structurally_ineligible=0: no stable mechanism excludes Alien, so §5.2 does not apply. external_blocked=0: §5.3 does not apply; the Owner gate follows the existing §5.1 line 110 precedent. There is no next claimed workbook, and next_claim_host is a dash. Wake when Owner approves MESH-301 with execution_enabled:true and status:READY, or any new workbook appears. Events take priority; 20 minutes is fallback only. The no-claim pool classification is **5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY**.

**Why not POOL_TERMINAL:** the pool has a real, Owner-instructed follow-up, MESH-301; only execution approval is missing. Calling the pool terminal would be the window-dressing forbidden by §5.4.

## 3. Three explicit terminal declarations required by the workbook

```text
1. UXI-390 的阶段接受【没有被撤销】：UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED 仍然有效；
   本任务是在其之上做收尾修复，不重新开启 UI 文明化 / RS-201..290 / UXI-301。
2. 原 remote handoff deferred seam【现在真正 CLOSED】：
   - 单机双 Node：SWITCH_OFFERED → ALTERNATE_DEVICE/REMOTE_HANDOFF → A→B 所有权转移 →
     同一 task id 在新持有者上 terminal → 结果回到原 surface（Web 面与真机 Android 面均已驱动）；
   - 双实体主机：Alien 侧 10/10、Mech 侧 13/13（它自建仪器，真实 LAN）；
   - 复核结论：Mech `REVIEW_COMPLETE PASS` at 0a41efe，门项 1-8 按其自身测量 MET。
3. 五维 load 的真实支持【仍是 partial observation】，本任务不宣称完整五维 telemetry：
   已测量维度（cpu/memory）如实上报，gpu/io/network 保持 unobserved 且不填 0；
   binding 取已观测维度的最大值；`min_observed_dimensions = 1`。
```

1. **UXI-390's stage acceptance is not revoked:** UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED remains valid. This task repairs closeout on top of it, without reopening UI Civilization, RS-201..290 or UXI-301.
2. **The originally deferred remote-handoff seam is now genuinely CLOSED:** single-host two-Node sequence SWITCH_OFFERED → ALTERNATE_DEVICE/REMOTE_HANDOFF → A→B ownership transfer → same task id terminal on the new holder → result on the original surface, with both Web and physical Android driven. Two-physical-host acceptance records Alien 10/10 and Mech 13/13, using Mech's own instrument over real LAN. Mech REVIEW_COMPLETE PASS at 0a41efe measures gates 1–8 MET independently.
3. **Real five-dimensional load support remains partial observation.** This task does not claim full five-dimensional telemetry. Observed cpu/memory are reported honestly; gpu/io/network stay unobserved without zero-filling. Binding is the maximum observed dimension, with min_observed_dimensions=1.

## 4. Nonblocking automatic-reentry residual, recorded honestly

Primary D:/A-Utopia produced **empty files** matching the files being authored three times: SchedulerPanel.kt twice and uxi391-handoff-e2e.mjs once. Cause is unknown. Each was found and removed during **pre-merge checks**. This Step 7 check found **zero dirty entries**, so merging was not blocked; DEVELOPMENT_REPORT records it.

## 5. Next responsibilities

```text
Owner  = 批准 / 修改 MESH-301 草案，并对草案内两个岔路给出裁决
         （是否扩展冻结契约动作集；Mech 在三端测试中是复核主机还是被测端点）
Alien  = 批准后按 §2 原子领取 MESH-301 并开工；在此之前维持 §5.1 兜底重扫（事件优先）
Mech   = 无待办（UXI-391 的复核已签署并在终态声明中被引用）
```

Owner approves or modifies the MESH-301 draft and decides its two forks: expanding the frozen contract action set, and Mech's role as Review host or tested endpoint. After approval, Alien atomically claims under §2 and starts; beforehand it maintains §5.1 fallback rescans with event priority. Mech has no pending work: UXI-391 Review is signed and cited in the terminal declaration.
