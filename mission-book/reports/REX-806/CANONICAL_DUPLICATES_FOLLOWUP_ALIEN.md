# REX-806 canonical 任务重复执行复检 / Canonical duplicate follow-up

## 反例及修复 / Counterexample and repair

一条 receipt run 选择 Q-verify，两个 canonical tasks 共享同一 researchRunRef。导出指标正确报告 duplicate=1，但旧校验器只读取 run 选择的任务，重算为0，拒绝真实包。红色测试已保留。raw-pointers 现在保留完整 canonicalTaskRuns 映射；独立校验器据此核对重复数及样本分母，并拒绝一个 taskRef 的重复或冲突映射。篡改测试先刷新哈希，检验语义约束。历史包未改写。

One receipt run selects Q-verify while two canonical tasks share its researchRunRef. The exporter reports duplicate=1 correctly, but the old verifier sees only the selected task and rejects the honest package as zero. The retained red test establishes this defect. raw-pointers now retains canonicalTaskRuns associations; the independent verifier recomputes duplicates and the denominator and rejects repeated or conflicting associations for one taskRef. Tamper tests refresh hashes before semantic verification. Historical packages are unchanged.

## 候选与证据 / Candidate and evidence

候选 / Candidate: `cc799234e7daa3d8ccfde5673b9d07ccb2376742`, [Utopia PR40](https://github.com/zhiheng-zhang-Mera/utopia/pull/40). 它接续1743d76的修复；本轮不能视为Mech实体复检。 / It extends1743d76; this round does not constitute physical Mech acceptance.

本地四个REX806测试文件加REX803 scenario-runner和REX805 replay-engine/gateway共68/68通过；历史Mech真实包14/14通过。独立只读审查先发现重复映射能虚增统计，修复及反例补充后未发现新阻断。 / Four REX806 suites plus REX803 scenario-runner and REX805 replay-engine/gateway pass68/68. The historical real Mech package passes14/14. Independent read-only review identified inflated counts through repeated associations; the corrected constraint and counterexample received no further blocker.

1743d76的push CI37548842702最终失败：1466/1467通过，Windows Services history测试观察到RUNNING而预期空值。对应PR CI通过；本地该测试文件单独运行2/2通过。保留失败日志，不把单独通过解释为负载原因已证明。新候选push37549801619及PR37549806262仍运行，未声明精确头CI通过。 / The1743d76 push CI37548842702 failed1466/1467 on Windows Services history (RUNNING versus an empty expected value). Its PR CI passed and the local standalone file passes2/2. Failure evidence is retained; a standalone pass does not establish load as the cause. New-head push37549801619 and PR37549806262 are running; exact-head CI is not claimed green.

## 最新已合并版本联机 / Latest merged runtime connection

原PID52176不存在且4389端口拒绝连接，确认停止后通过官方launcher启动已合并12e3d3b，打开Mech City。新PID23952，协调记录MEMBER ONLINE，City031fdba6-e94c-4298-a095-6ff04a65481d，Alien设备dev-8128a1ef25c5c4b7f66fc31b21705858；dataDir仍D:/utopia/.runtime。正式成员会话可读同一City/tasks/nodes。启动工作树为D:/Utopia-tree/REX-801-890/Utopia-REX806-Member-Accepted-20261007。远端Mech源版本未从该会话证明；未发表凭据。

PID52176 was absent and port4389 refused connections. After confirming termination, the official launcher started merged12e3d3b and opened the Mech City. NewPID23952 is MEMBER ONLINE for City031fdba6-e94c-4298-a095-6ff04a65481d and Alien dev-8128a1ef25c5c4b7f66fc31b21705858; dataDir remainsD:/utopia/.runtime. The official member session reads the sameCity/tasks/nodes. Launch worktree isD:/Utopia-tree/REX-801-890/Utopia-REX806-Member-Accepted-20261007. This session does not attest Mech source revision; no credentials are published.

[逐文件哈希及原始日志 / File hashes and logs](intermediate-logs/2026-10-07-canonical-duplicates-alien/INDEX.json)。Mech需以cc79923独立复检。REX807仍为Mech在建，development_complete:false；未领取REX890，未启动新系列。 / Mech must independently reviewcc79923. REX807 remains under Mech development, development_complete:false; REX890 has not been claimed and no new programme is started.

## CI 终态补充 / Terminal CI update

随后精确头 `cc799234e7daa3d8ccfde5673b9d07ccb2376742` 的 [push run37549801619](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37549801619)、[PR run37549806262](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37549806262) 和 [contract run37549806355](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37549806355) 均已实测 completed/success。前述 pending 是当时的观察；不覆盖旧失败轮次，仍等待Mech异机复检。

The exact head is now confirmed completed/success on the push, PR and contract runs linked above. Earlier pending statements describe the handoff observation. Prior failed rounds remain preserved; Mech opposite-host acceptance remains pending. Three raw GitHub run summaries are indexed with byte hashes.
