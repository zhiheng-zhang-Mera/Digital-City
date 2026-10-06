---
workbook_id: CEX-704
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 704
execution_enabled: true
status: COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["e925ae1ef4dda6f51d89a1faa025d1b8666d8c58","86deda9c2990c78d683a8c3515d251022df9d040","77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f"]
dependency_source_workbooks: []
dependency_source_shas: []
development_baseline_sha: "0e9bea3ce739b979e582a428af8fb233045a5e75"
baseline_resolution_evidence: "mission-book/reports/CEX-704/CLAIM_RECORD.md"
baseline_blocker: null
dependencies: ["JOIN-501", "JOIN-502", "JOIN-503 semantics present"]
development_host: Alien-codex
development_branch: cex/CEX-704-Alien-codex-native-owner-onboarding
development_head_sha: "d05f5a455ff535e3e065b30ec9ec74bca2dbb521"
development_ci: "https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37216216410"
development_complete: true
review_host: "Mech"
review_head_sha: "d05f5a455ff535e3e065b30ec9ec74bca2dbb521"
review_ci: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-05): the review target is the development head itself, d05f5a455ff535e3e065b30ec9ec74bca2dbb521, resolved from refs/heads/cex/CEX-704-Alien-codex-native-owner-onboarding (remote tip equals that commit). INDEPENDENCE, proven rather than asserted: this workbook records development_host=Alien-codex, so the reviewer host (Mech, COMPUTERNAME MEGA-REP) is a different physical host from the author, as section 3 requires. DEPENDENCY UNION, verified rather than assumed: this workbook declares dependencies JOIN-501, JOIN-502 and JOIN-503 semantics present and required_ancestor_shas [e925ae1ef4dda6f51d89a1faa025d1b8666d8c58, 86deda9c2990c78d683a8c3515d251022df9d040, 77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f]; the reviewer confirmed all three source workbooks are COMPLETE with review_complete true, and that all three ancestor SHAs are reachable from the reviewed head (git merge-base --is-ancestor exit 0 for each). Claim-time exact-head CI measured before any verdict: V0.2 checks push run 37216216410 completed/success on the reviewed head; PR pull run 37216246024 completed/success on the same head; City linkage check run 37216246022 completed/success (reciprocal-contract). || VERDICT PASS on the reviewed head, decided by an ON-DEVICE matrix on the attached real handset (OPPO PERM00, BICIPVNB5HS85H9T) against a City gateway this review started itself. Exact-head CI re-measured: V0.2 checks push run 37216216410 completed/success on d05f5a455ff535e3e065b30ec9ec74bca2dbb521 (jobs android success, gateway-web success); PR20 pull run 37216246024 completed/success on the same head; City linkage check run 37216246022 completed/success; all PR20 checks pass. Reviewer instruments: ten probes written for this review (utopia tests/cex704-mech-review-probes.test.mjs 5/5 on the guarded generate route and tests/cex704-mech-review-authority.test.mjs 5/5 on the admission-authority half, branch review/CEX-704-mech-review at 6934fc1), the 79-test join/pairing/enrollment regression set run here (79/79), Android :app:testDebugUnitTest 84/84 across 15 suites, and check-bilingual SYNCHRONIZED. THE MATRIX, decided by observation on the handset: reachability and panel visibility with the canonical City name; generate producing a six-digit code and a 612x612 QR bitmap whose digits were proven canonical by consuming the on-screen code from a different client, because pairing/info reports no short code at all; an ACTIVE session that never rotates, shown three ways (the control renders disabled, a futile tap leaves code and canonical session unchanged, and the guarded route answers 409 PAIRING_STATE_CHANGED); the SYSTEM SHARE SHEET, which opens normally on this handset - this CLOSES the author declared share_sheet NOT_RUN_AUTO_APPROVAL_REJECTED gap rather than confirming it; consume by a second client (THIS HOST, not a second handset) with the device dropping code, QR and share control on its own next poll; incoming approve and reject both moving canonical truth with decidedAt and no lingering decision buttons; a 15-second TTL expiring on the device with no auto-generation; two taps ~100 ms apart producing exactly one session and a code surviving background/resume with a correct countdown; and the four legacy join entry controls still present and reachable. The crash buffer is empty and no FATAL EXCEPTION occurred. Without a handset: eight simultaneous guarded generates yield exactly one winner with seven 409s; the guard is additive so the legacy path still works; material is bound to a City/host/credential hash and dropped on mismatch; a failed poll cannot fabricate an empty request list; anonymous decisions are refused while an already-trusted enrolled device may decide BY JOIN-502 DESIGN (a correction to my own probe, which wrongly expected a member to be refused); a burst of six approvals cannot fork the record; reject on an uncollected approval is an allowed reversal while approve-after-reject is 409; and the mandatory approval latency the receipt left NOT_OBSERVABLE is measured here at 8-11 ms HTTP round trip and 9-16 ms to owner visibility, local City on one physical host, not a performance claim. Findings, none blocking: F1 LOW (the share-failure guidance is rewritten by the 2-second poll so it can vanish before it is read; source-derived because the chooser opened here); F4 LOW control plane (twenty-one template fields were absent including every exposure and capability field, while CAP-ONBOARDING-OWNER-001 already existed; backfilled from that record, with the ambiguous G2 watchlist entry left out rather than invented); F2 INFORMATIONAL (a session generated on another surface leaves the handset owner with a disabled control and no countdown); F3 INFORMATIONAL (the invite link is a ONE-TIME BEARER FOR THE DURABLE CITY CREDENTIAL - verified first-hand that the exchange credential is byte-identical to the control token and is accepted by /api/v0/city, that the same short code replays as 410, and that the shared string itself contains no durable credential; this is the existing programme pairing contract, not new here); F5 INFORMATIONAL (the panel has no test; the 4 unit tests cover the lifecycle model only). THE GAP THAT STAYS OPEN is a second PHYSICAL handset - only one is attached, so the consuming client was this host, exactly as the author own index admits - together with optical QR decoding and the Scan QR / LAN / BLE flows, which were not run. No APK provenance claim: a build of the reviewed source matched the receipt byte count 10500445 but not its SHA-256, so the build is not hermetic. Terminal marker ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED released with that limitation stated. See reports/CEX-704/REVIEW_REPORT.md."
review_complete: true
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CEX-704
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: OWNER_ONBOARDING_ADMISSION
user_exposure_nesting: L2_CONTEXTUAL
backend_wiring: VERIFIED
ui_exemption_reason: null
capability_ids: ["CAP-ONBOARDING-OWNER-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-ONBOARDING-OWNER-001.yaml"]
capability_registry_sync_status: RECONCILED
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/CEX-704/PAPER_MATERIAL_INDEX.md"]
research_watchlist_hits: ["RS-G3-IDENTITY-PROVENANCE","RS-G3-INDEPENDENT-REVIEW-BOUNDARY","RS-G3-REGISTRY-ONBOARDING","RS-G4-CAPABILITY-STATE","RS-G4-REALITY-DRIFT"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: CAPTURED
state_identity_evidence_refs: ["mission-book/reports/CEX-704/PAPER_MATERIAL_INDEX.md"]
monitor_observability_evidence: NOT_APPLICABLE
monitor_observability_refs: []
decision_trace_evidence: NOT_APPLICABLE
decision_trace_refs: []
terminal_marker: ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED
merged_main_sha: "8ee3f8c1fcc8ae6730064d826e43e4829acdbbb4"
merged_main_via: "explicit union onto the JOIN-590 closeout integration head, pushed to main"
merge_authority_note: "Owner instruction 2026-10-05: update the mission-book statuses and perform the Utopia merges for the workbooks that pass (complete development + completed opposite-host review + exact-head CI green), then wait for CI. Merged by Mech (Mech-DS) under that instruction; the workbooks themselves declare merge_authority: false, so the authority for these merges is the owner ruling, recorded here rather than by editing the declaration."
---

# CEX-704 — Android Onboarding Owner Actions 对齐

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 论文素材：[PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md)

## 目标

Android 当前主要能“加入别人”，但作为一等 control surface，应该能承担最自然的 Owner onboarding 行为：

- 查看 incoming join request；
- Approve / Reject；
- 主动 Generate pairing session；
- 展示/分享 short code / QR / link 中适合 Android 的形式；
- 不破坏现有 Scan QR / LAN / BLE / Manual join。

## 必须实现

### Incoming approval

复用已有：

- join request list；
- approve；
- reject。

不得新造审批数据库。

### Pairing generation

遵守 JOIN-501：

- 只有用户主动点击 Generate 后才创建；
- ACTIVE 期间固定；
- consumed / expired 后再生成；
- 不 background auto-rotate。

### Share

至少提供：

- QR；
- short code；
- Android share sheet 可用的 Web invite/link 或等价已存在 material。

不得把 durable credential 分享出去。

## Cross-network

若当前 Android relay path 尚无完整 product contract：

- 可以显示 Web invite / share material；
- 不得宣称 Android 已完成所有 cross-network relay execution；
- exact future seam 记录到 backlog / report。

## Formal Review

必须在 Android 实机上独立验证：

- generate；
- share；
- second device consume；
- incoming approve；
- reject；
- expiry；
- double click；
- app background/resume；
- existing join paths regression。

## 论文素材强制点

记录：

- Web/Android parity gap；
- user-step comparison；
- Android lifecycle/background issue；
- permission error；
- QR/share failure；
- race；
- approval latency；
- negative controls。

## 完成门槛

- Android 可作为 Owner onboarding control surface；
- JOIN-501 lifecycle 不回归；
- existing Android join 不回归；
- real-device opposite-host Review；
- exact-head CI；
- PAPER_MATERIAL_INDEX；
- terminal marker `ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED`。

## 复核结论（Mech，对侧物理主机，实机矩阵）

Formal Review PASS，详见 `mission-book/reports/CEX-704/REVIEW_REPORT.md`。本任务书要求**实机**验证，故本次复核在挂载的
真实手机（OPPO PERM00 / BICIPVNB5HS85H9T）上对自建 City 网关闭环执行十项，全部以观测判定：可达性与面板可见（显示
canonical 城市名）；生成得到六位短码与 612×612 二维码位图，其数字由"用另一客户端消费屏幕上的短码成功（HTTP 200）"
证明为 canonical——因为 `pairing/info` 根本不报告短码；ACTIVE 会话绝不轮换，三路证据（控件渲染为 disabled、强行点击后
短码与 canonical 会话不变、受守卫路由返回 409 `PAIRING_STATE_CHANGED`）；**系统分享面板在本机正常打开**，即本次复核
**关闭**了作者自认的 `share_sheet NOT_RUN_AUTO_APPROVAL_REJECTED` 缺口而非确认它；由第二客户端（**本机**，非第二台手机）
消费后，设备在下一次轮询自行清空短码/二维码/分享入口；入网申请的批准与拒绝都改变了 canonical 真值并带 `decidedAt`；
15 秒 TTL 到期后设备不再显示材料且不自动生成；两次相隔约 100ms 的点击只产生一个会话，前后台切换后同一短码存活且倒计时
正确；四个既有入网入口仍在原页可达。crash 缓冲区为空、无 FATAL EXCEPTION。

无设备部分同样判定：八路并发受守卫生成恰好一个成功、其余 409；守卫是增量故旧路径仍可用；材料与 City/host/credential
哈希绑定并在不匹配时丢弃；轮询失败不会伪造空申请列表；匿名决策被拒而"已受信入网设备可决策"是 **JOIN-502 的设计**
（此处修正了我自己探针的错误预期）；六路并发批准不会分裂记录；未领取的批准可被拒绝反转、而已拒绝的不能再批准；任务书
强制的审批延迟（收据记为 NOT_OBSERVABLE）由本次复核实测：HTTP 往返 8–11ms、owner 可见 9–16ms，限定为单机本地 City、
非性能声明。

五项发现均不阻塞：F1（LOW）分享失败提示会被 2 秒轮询覆盖，可能来不及被读到（源级推断，本机 chooser 正常打开故未触发）；
F4（LOW，控制面）工作书本有二十一项模板字段缺失（含全部暴露与 capability 字段），而 `CAP-ONBOARDING-OWNER-001` 已存在，
已由本次复核依该记录回填，观察清单中无法唯一映射的 G2 项明确留空；F2（informational）由**其他面**生成的会话会让只持有
手机的所有者面对一个禁用控件且没有任何倒计时；F3（informational）邀请链接是**持久城市凭据的一次性承载**——已自证交换
返回的 credential 与控制令牌逐字节相同且被 `/api/v0/city` 接受、同一短码重放为 410、而分享字符串本身不含持久凭据——这是
本程序既有配对契约而非本任务引入；F5（informational）面板本身无测试（4 项单测只覆盖生命周期模型）。**仍然开放**的缺口
是第二台**实体**手机：本机仅挂载一台，故消费方是本机；光学扫码与 Scan QR / LAN / BLE 流程亦未运行。APK 来源不作声明：
同一源码构建的字节数（10500445）与收据一致但 SHA-256 不同，构建不可复现。



---

[English reading translation / 完整英文阅读说明](./en/CEX-704-android-onboarding-owner-actions-parity.md)
