# REX-803 对机正式验收 / Opposite-host formal acceptance

日期 / Date: 2026-10-06. Reviewer / 评审主机: Alien.

## 判定 / Verdict

**ACCEPTED_EXACT_HEAD**：`8798ba9dd37051626033ad72080b2fad3ff66149`，释放 `SCENARIO_REPETITION_ENGINE_ACCEPTED`。这是对已有技术复检及真实三端 campaign 的有界验收；不是 product main 合并，不是全局 trace FULL，也不是用户意图研究完成。

**ACCEPTED_EXACT_HEAD** at `8798ba9dd37051626033ad72080b2fad3ff66149`; release `SCENARIO_REPETITION_ENGINE_ACCEPTED`. Acceptance covers the reviewed implementation and the bounded physical campaign. It neither merges product main nor upgrades global trace completeness or intent validation.

## 证据与门槛 / Evidence and completion gate

- [既有技术评审](REVIEW_REPORT.md)：修复后相关测试 71 PASS，独立 critic 8 PASS，涵盖取消、重启、timeout、partial accounting、seed 和 state/context 身份。中间全量套件结果不冒充最终 immutable head 全量结果。
- Exact-head hosted CI：push `37423084327`、PR `37423138551`、linkage `37423138558`，逐次 API 读取均 terminal SUCCESS；[候选 PR37](https://github.com/zhiheng-zhang-Mera/utopia/pull/37)。候选 Android `testDebugUnitTest assembleDebug` 成功，21 suites / 111 tests / 0 failures / 0 errors；APK SHA256 `3b40b8d365a17893e01bdf88b190829f8de609bce3859ef10a7acadf4ca9ed0e`。
- Mech Owner 启动的 campaign `campaign-966cf439-7017-4bb0-88e8-981e59c18322` 在 City `031fdba6-e94c-4298-a095-6ff04a65481d` 完成。Android PERM00 是已入会的 canonical control surface；执行节点按 Mech / Alien / Mech 分配。Alien 使用普通 MEMBER 权限独立读取三个 canonical COMPLETED task，不绕过 Owner 端点。
- [原始材料索引](evidence/MATERIAL_INDEX.md)及[交付说明](MATERIAL_HANDOFF_MECH.md)：完整发布该 campaign 所处 collector epoch 的 52 条记录、31 条 canonical campaign/task events、3 条 measured run receipts。三次运行全部计入 terminal accounting，无失败、timeout、排除或 warmup；warmup 为 0。
- [独立材料核验](independent-material-checks-Alien.json)：38 项通过。评审自己重算七文件字节长度/SHA256、task/receipt/event/context 绑定、执行窗口、单 epoch monotonic 顺序、明确的 missing/drop/clock 声明，未仅依赖作者的 derived checks。种子另由独立 FNV-1a 计算和 exact candidate 的 `runSeed` 执行交叉核对：`397343796 / 414121415 / 430899034`，对应 worker indices `0 / 1 / 0`。

The earlier technical review records 71 focused passes and eight independent critic passes, covering cancellation, restart, timeout, partial accounting, deterministic seeds and state/context identity. Intermediate full-suite output is not represented as a final immutable-head full-suite run. The three exact-head CI runs above were individually read from the API and succeeded. The candidate Android build and its 111 tests also succeeded.

The Mech Owner ran the identified campaign on the live City. Android PERM00 was the enrolled canonical control surface; Mech, Alien and Mech executed its three repetitions. Alien independently read all three completed canonical tasks using its ordinary MEMBER session. The package publishes the complete captured campaign epoch: 52 trace records, 31 canonical events and three measured receipts, with complete terminal accounting and no failed, timed-out, excluded or warmup runs. The reviewer independently recomputed the material checks, rather than accepting the author's derived values. Both an independent FNV-1a calculation and the candidate's own `runSeed` reproduced all three seeds and placements.

This satisfies the workbook's bounded controlled-campaign gate with reviewable research trace/material on the Alien + Mech + Android topology. The collector's metadata-completeness label measures additional fields and remains PARTIAL; the gate is not interpreted as permission to claim those missing observations exist.

以上满足任务书的三端受控 campaign 及可复查 research trace/material 门槛。collector 的 metadata completeness 衡量额外字段，仍为 PARTIAL；验收不能让缺失观测变成已观测。

## 验收边界 / Acceptance boundaries

1. `traceCompleteness: PARTIAL` 保留。52 条发布记录均缺 softwareSha/configRef/providerRef/modelRef/channelRef；49 条普通事件缺 experimentRef/experimentRunRef，3 条 run receipt 带实验绑定。缺项不是 0，不填写猜测值。
2. 整体 retained window 的 197 条记录为作者 envelope 声明，未完整发布；评审独立核验的原始范围为 campaign epoch 的 52 条。drop=0、storage READY、未 truncated 是 package 声明并与可见字段一致，不是对未发布记录的独立全量证明。
3. Mech resident source SHA 由 Owner/用户更新声明及 receipt/manifest 外部绑定；评审没有远程 PID→source SHA 独立审计。逐 trace record 的 provenance null 仍为 null。APK 构建不是手机新安装证明。
4. 记录的本机捕获时差不是跨主机时钟同步证明或网络延迟 benchmark。未观察的可选指标保持 null/NOT_MEASURED；Web reachability PARTIAL、intent validation NOT_TESTED；原生 Android campaign UI 留给 REX-807。
5. 新 Alien enrollment 创建于 `2026-10-06T07:29:19.058Z`。早期离线/退休身份记录保留；不能把新身份描述为此前两天始终在线。材料索引对早期 195 条计数的 Alien 归属也不成立：Alien MEMBER 不能读取 Owner trace，该计数来自较早作者报告。

The trace remains PARTIAL with the missing fields listed above. Only the published 52-record campaign epoch was independently checked; the 197-record whole-window count is an author envelope declaration. Candidate identity is externally bound by the receipt/manifest and the Owner's update statement, not independently observed from a remote process or every trace record. Clock capture differences are not cross-host synchronization or network latency measurements. Unobserved metrics, Android native campaign UI and intent-validation gaps remain explicit. The fresh Alien enrollment began at the stated timestamp; earlier offline/retired observations are retained. The earlier 195-record count was author-reported, not independently read by Alien through its MEMBER session.

## 三处同步 / Record reconciliation

任务个体、系列板、主板和 Capability Registry 随此 verdict 同步；REX-805 可按已有依赖规则领取。不启用新系列，不执行 SHOW，不授予新的 product main 合并权限。

The workbook, programme board, main board and Capability Registry are reconciled to this verdict. REX-805 may be claimed under the existing dependency rules. No new programme, SHOW execution or additional product-main merge authority is enabled.

## 材料布局后续 / Material layout follow-up

远端 caa15be 将 export/verify 方法移到 evidence-tools，六个原始数据文件字节不变。上述38项独立结果绑定 f3fb731 的布局（当时第七项为 exporter）；当前payload六文件由 Alien 再运行作者提供的另一核验器，22/22 PASS。作者核验器不是独立评审替代；38项评审结果放在报告层，不加入有固定哈希清单的原始payload。该核验器成功输出仍写 all7，实际清单/目录检查为6/6，这是展示文字残留，不是文件数证据。

Commit caa15be moves methods into evidence-tools without changing the six raw data files. The38 reviewer checks bind the f3fb731 layout, whose seventh file was the exporter. Alien additionally executed the author's second verifier against the current six-file payload:22/22 PASS. This author instrument does not replace independent review. Reviewer results stay outside the fixed-index payload. Its displayed all7 message is stale presentation text; the actual list/directory check reports6/6.
