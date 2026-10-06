---
workbook_id: CEX-705
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 705
execution_enabled: true
status: COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["612c344f9f2b06a67b2645b4662d97750dd7c44e"]
dependency_source_workbooks: []
dependency_source_shas: ["612c344f9f2b06a67b2645b4662d97750dd7c44e"]
development_baseline_sha: "0e9bea3ce739b979e582a428af8fb233045a5e75"
baseline_resolution_evidence: "mission-book/reports/CEX-705/CLAIM_RECORD.md"
baseline_blocker: null
dependencies: ["CITY_MEMBERS_HOST_ROLES_ACCEPTED_EXACT_SHA_REQUIRED"]
development_host: Alien-codex
development_branch: cex/CEX-705-Alien-codex-native-members
development_head_sha: "de9185a4ef8d761053c88316ec9efeca037239fb"
development_ci: "https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37218345150"
development_complete: true
review_host: "Mech"
review_head_sha: "de9185a4ef8d761053c88316ec9efeca037239fb"
review_ci: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-05): the review target is the development head itself, de9185a4ef8d761053c88316ec9efeca037239fb, resolved from refs/heads/cex/CEX-705-Alien-codex-native-members (remote tip equals that commit). INDEPENDENCE, proven rather than asserted: this workbook records development_host=Alien-codex, so the reviewer host (Mech, COMPUTERNAME MEGA-REP) is a different physical host from the author, as section 3 requires. DEPENDENCY, verified rather than assumed: this workbook declares the dependency CITY_MEMBERS_HOST_ROLES_ACCEPTED_EXACT_SHA_REQUIRED and required_ancestor_shas [612c344f9f2b06a67b2645b4662d97750dd7c44e]; the reviewer confirmed that ancestor is reachable from the reviewed head (git merge-base --is-ancestor exit 0) and that the members contract it stands for - the api/v0/members routes added by the merged PR11 codex/city-members-host-roles line - is present AT that ancestor in services/dev-gateway/server.mjs, so the dependency is a contract in the accepted line rather than a claim resting on this branch. Claim-time exact-head CI measured before any verdict: V0.2 checks push run 37218345150 completed/success on the reviewed head; PR pull run 37218364139 completed/success on the same head; City linkage check run 37218364132 completed/success (reciprocal-contract). || VERDICT PASS on the reviewed head, decided by an ON-DEVICE matrix on the attached real handset (OPPO PERM00 / BICIPVNB5HS85H9T, Android 12) against a City this review started itself, plus a Web/Android canonical-truth comparison. Exact-head CI re-measured: V0.2 checks push run 37218345150 completed/success on de9185a4ef8d761053c88316ec9efeca037239fb (jobs android success, gateway-web success); PR21 pull run 37218364139 completed/success on the same head; City linkage check run 37218364132 completed/success; all PR21 checks pass. Reviewer instruments: seven probes written for this review (utopia tests/cex705-mech-review-authority.test.mjs, branch review/CEX-705-mech-review at e0b2006) 7/7 pass, over the EXACT route, method and body the Android surface sends; Android :app:testDebugUnitTest 87/87 across 15 suites run here; author suite unmodified 1/1. THE MATRIX, decided on the handset: owner reachability with both surfaces rendering; owner rename changing canonical truth and the Web title; a session unable to rename BOTH in the UI (disabled field, typing changes nothing) and at the server (403 Only the City owner can rename the City); self revoke retiring the installation, returning the app to Find your City, clearing the token from shared_prefs and leaving the retired credential answering 401 SESSION_UNKNOWN; cross-revoke refused both by the scoped list and by the server (403 SESSION_CANNOT_REVOKE_OTHER) with the targets staying BOUND; sharing toggled for the caller own node only, with canonical sharingEnabled flipping and no control rendered for another node; send/receive/receipt with a SPOOFED senderDeviceId ignored in favour of the authenticated actor, PENDING to RECEIVED with receivedAt, an unrelated member unable to see the message, and a duplicate receipt not rewriting the time; reconnect showing RECONNECTING and an explicit non-live cache message and then re-rendering all canonical members with no stale installation row; and a Web/Android/canonical comparison agreeing on the City name, the member identities and roles and every sharing flag. Crash sweep: logcat crash buffer empty, 0 of 14785 lines matching FATAL EXCEPTION or ANR, process alive. Secret sweep: no session or token match in logcat, pairing token password-masked, identity details showing only deviceId and nodeId. Findings, none blocking: F1 MEDIUM (the shared member projection can report a device as CONNECTED while its own node record says offline - canonical members[host].online true with computeOnline false against nodes[host].online false - because members.mjs seeds the primary row with online true and merges prior.online OR n.online, so the Android surface renders 设备连接：在线 while the Web renders offline; members.mjs is NOT in this diff, so it is a pre-existing defect this new surface exposes rather than a regression, and the minimum repair is to derive online from the node record when nodeId equals deviceId or to emit null, which the app already renders as 未报告); F4 LOW control plane (twenty-one template fields were absent including every exposure and capability field while CAP-CITY-MEMBERS-NATIVE-001 already existed; backfilled from that record with the ambiguous G2 watchlist entry left out rather than invented); F2 LOW (the sharing success notice is unconditional, so a primary row whose sharingEnabled defaults false with no node record would show a toggle that 404s - latent, not reached in the observed fixture); F3 INFORMATIONAL (whether the owner own sharing control appears depends on the City hostDeviceId matching its node id, since canToggleSharing requires nodeId equal to actorRef and the primary row only gains nodeId when such a node registers - verified directly both ways, so the gate is correct and its reachability is configuration-dependent); F5 INFORMATIONAL (the development receipt physical_not_run list is STALE - the same-day PHYSICAL_FOLLOWUP.json records rename, sharing toggle, self and other revoke and outbound send as OBSERVED, and this review independent matrix confirms them; only the two-physical-hosts item remains genuinely unrun, and both records are retained as chronology); F6 INFORMATIONAL (the mandatory parity-gap count and message latency were recorded null and are supplied by this review - 6 features listed and 6 reachable from the routes the Android client calls, and 6 ms send round trip, 9 ms to recipient visibility, 7 ms receipt round trip, 9 ms canonical created-to-received, scoped to one local City on one physical host and NOT a performance claim). THE LIMITATION: only one handset is attached, so no second PHYSICAL phone participated - the other members were real City members driven with real session credentials over HTTP - and the Web surface was not driven as an enrolled session, with no soak, rotation or low-memory behaviour exercised. Terminal marker ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED released with that limitation stated. See reports/CEX-705/REVIEW_REPORT.md."
review_complete: true
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CEX-705
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: CITY_MEMBER_MANAGEMENT
user_exposure_nesting: L2_CONTEXTUAL
backend_wiring: VERIFIED
ui_exemption_reason: null
capability_ids: ["CAP-CITY-MEMBERS-NATIVE-001"]
capability_registry_action: CREATE
capability_registry_refs: ["capability-registry/records/CAP-CITY-MEMBERS-NATIVE-001.yaml"]
capability_registry_sync_status: RECONCILED
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/CEX-705/PAPER_MATERIAL_INDEX.md"]
research_watchlist_hits: ["RS-G3-IDENTITY-PROVENANCE","RS-G3-INDEPENDENT-REVIEW-BOUNDARY","RS-G3-REGISTRY-ONBOARDING","RS-G4-CAPABILITY-STATE","RS-G4-REALITY-DRIFT"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: CAPTURED
state_identity_evidence_refs: ["mission-book/reports/CEX-705/PAPER_MATERIAL_INDEX.md"]
monitor_observability_evidence: NOT_APPLICABLE
monitor_observability_refs: []
decision_trace_evidence: NOT_APPLICABLE
decision_trace_refs: []
terminal_marker: ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED
merged_main_sha: '1a26d7499d3de39b19c3136c3032e8ccd9343428'
merged_main_blocker: 'RESOLVED on 2026-10-05 - the blocker text that preceded this line records the measured reason it was held back, and the manual union above is how it was cleared.'
merge_authority_note: "Owner instruction 2026-10-05: update the mission-book statuses and perform the Utopia merges for the workbooks that pass (complete development + completed opposite-host review + exact-head CI green), then wait for CI. Merged by Mech (Mech-DS) under that instruction; the workbooks themselves declare merge_authority: false, so the authority for these merges is the owner ruling, recorded here rather than by editing the declaration."
merge_attempt_2026_10_05: 'Measured, twice, while attempting the merge the owner asked for: the shared CityClient.request body already carried BOTH sides (it calls builder.method(method, ...) from CEX-705 and the 401/403 renewal retry from JOIN-590), so only three edits were needed - one signature with method AND allowRenew, the recursive renewal call made named so false cannot bind to method, and the union of both typed-refusal path sets. The scripted attempt nevertheless left nine conflict markers in the file because the region shapes were not uniform; the merge was ABORTED again rather than pushed, and main was left at 8ee3f8c1 with its required CI green. The reliable route, established by this measurement, is not a script: take the CEX-705 branch copy of CityClient.kt (a coherent file) and re-apply JOIN-590 three additions to it by hand (renewSession, the allowRenew parameter, the renewal retry), then take the union of MainActivity.kt, then gradle compile plus root-suite verification.'
merged_main_via: 'MANUAL UNION onto the then-current main, per the owner instruction to resolve the conflict by any means. Base = main version of CityClient.kt (it owns the JOIN-590 machinery: enrollment, retired, sessionReady, renewSession, the allowRenew parameter and the 401/403 renewal retry). Grafted verbatim from the CEX-705 branch: the method parameter and its use in the request builder, the six member-management functions, and the widened typed-refusal path set. row() was widened to forward a method so the PATCH calls compile. MainActivity.kt resolved by keeping both sides. Verified: union self-checks all OK before compiling; gradle :app:testDebugUnitTest :app:assembleDebug BUILD SUCCESSFUL; the CEX-705/CEX-704/JOIN-590/pairing/members/WBC-602/REX-80x suites 86/86 pass.'
---

# CEX-705 — Android City / Device / Member 管理入口补齐

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 论文素材：[PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md)

## 目标

最新 Web 已有而 Android 缺少的管理入口：

- City rename；
- enrolled device identity；
- revoke；
- member role；
- sharing enable/disable；
- member-to-member message + receipt。

本任务补到 Android 一等 control surface。

## 必须实现

### Settings

- City display name；
- current installation summary；
- enrolled installation list（按当前 credential scope）；
- revoke self / owner-authorized revoke；
- 不显示 raw secret。

### Members / Devices

- role；
- online / computeOnline；
- sharingEnabled；
- start/stop sharing（仅合法 own node）；
- member messages；
- receipt/read state。

## 权限

Android 必须遵守 server authority：

- session 不能 rename City；
- session 不能 revoke other installation；
- own node sharing only；
- message recipient/sender scope；
- owner token 与 enrolled session UI 需要明确区分。

## 不含

- rebind / clone recovery 由 CEX-701；
- interactive Rooms 未来 backlog；
- Assistant config；
- Workbench profile UI。

## Formal Review

Android 实机 + opposite-host：

- session user；
- owner/control credential；
- rename allowed/refused；
- self revoke；
- revoke other refused for session；
- sharing toggle；
- message send/receive/receipt；
- reconnect state；
- Web/Android canonical truth 对照。

## 论文素材强制点

记录：

- parity gap count；
- authority mismatch；
- session vs owner differences；
- message delivery latency；
- reconnect；
- stale member state；
- duplicate receipt；
- UI permission presentation failures；
- review disagreement。

## 完成门槛

- Android management parity for listed features；
- authority boundaries preserved；
- Web regression none；
- opposite-host real-device Review；
- exact-head CI；
- PAPER_MATERIAL_INDEX；
- terminal marker `ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED`。

## 复核结论（Mech，对侧物理主机，实机矩阵）

Formal Review PASS，详见 `mission-book/reports/CEX-705/REVIEW_REPORT.md`。本次复核在挂载的真实手机（OPPO PERM00 /
BICIPVNB5HS85H9T，Android 12）上对自建 City 网关闭环执行九项并逐项与 canonical 真值对照：owner 两个面均可渲染；
owner 改名改变 canonical 与 Web 标题；会话改名**双向**被拒（界面字段禁用且输入无效，服务端独立驱动返回 403
`Only the City owner can rename the City`）；自身吊销使安装 RETIRED、应用回到 Find your City、`shared_prefs` 中令牌被清、
被吊销凭据之后返回 401 `SESSION_UNKNOWN`；跨安装吊销在"列表被收窄"与"服务端 403 `SESSION_CANNOT_REVOKE_OTHER`"两侧都被拒
且目标保持 BOUND；共享仅对调用方自有节点可切换且 canonical 标志翻转、他人节点不渲染控件；消息的**伪造 senderDeviceId
被忽略**而以已认证主体记账、PENDING→RECEIVED 带 `receivedAt`、无关成员不可见、重复回执不重写时间戳；重连先显示
RECONNECTING 与非实时缓存提示，随后重渲染全部 canonical 成员且无陈旧安装行；Web/Android/canonical 在城名、成员身份与角色、
以及每一个共享标志上一致。crash 缓冲区为空、14785 行日志中 0 处 FATAL/ANR；日志中无会话或令牌匹配、令牌为掩码显示、
身份详情仅含 deviceId 与 nodeId。

六项发现均不阻塞。**F1（MEDIUM）**：共享成员投影会把设备报成"已连接"而其自身节点记录为离线——canonical 成员行
`online:true` 且同行 `computeOnline:false`，而 `nodes[host].online:false`；成因在 `members.mjs`（主行以 `online:true`
播种、节点遍历用 `prior.online || n.online` 合并，故永不被纠正），Android 因此显示"设备连接：在线"而 Web 显示离线。
需要明确：`members.mjs` **不在本次 diff 内**，故这是本次新界面**暴露**的既有缺陷而非回归；最小修复为当 `nodeId==deviceId`
时以节点记录推导 `online`，或输出 null（应用已将其渲染为"未报告"）。F4（LOW，控制面）二十一项模板字段缺失（含全部暴露与
capability 字段），而 `CAP-CITY-MEMBERS-NATIVE-001` 已存在，已依该记录回填，观察清单中无法唯一映射的 G2 项明确留空。
F2（LOW）共享成功提示是无条件的，故"默认 `sharingEnabled:false` 且没有节点行"的主行会渲染一个点击即 404 的开关（潜在，
本次未触及）。F3（informational）owner 自有共享控件是否出现取决于城市 `hostDeviceId` 是否与其节点 id 一致，因为
`canToggleSharing` 要求 `nodeId==actorRef`，而主行仅在存在同 id 节点时才获得 `nodeId`（已双向实测，门禁本身正确）。
F5（informational）开发收据的 `physical_not_run` 列表**已过时**：同日 `PHYSICAL_FOLLOWUP.json` 把改名、共享切换、自身/他安装
吊销、外发消息都记为已观测，本次独立矩阵亦证实；真正仍未测的只有"两台物理 Windows"。F6（informational）任务书强制的
parity gap 计数与消息延迟原记为 null，已由本次复核实测补上（列举 6 项、Android 路由可达 6 项；发送往返 6ms、接收方可见
9ms、回执往返 7ms、canonical 创建到接收 9ms，限定单机本地 City、非性能声明）。**限制**：本机仅挂载一台手机，故没有第二台
**实体**手机参与（其余成员是以真实会话凭据经 HTTP 驱动的真实城市成员），Web 亦未以入网会话身份驱动，未做长稳/旋转/低内存测试。



---

[English reading translation / 完整英文阅读说明](./en/CEX-705-android-member-device-management-parity.md)
