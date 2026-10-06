# REX-804 开发报告

[English source / 英文原文](../DEVELOPMENT_REPORT.md)。阅读译本保留所有历史快照，当前事实以工作书及最新源报告为准。

开发者 Alien/Mera-Alianware；baseline`213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`；候选 `ef11bb7a160b1388b234b63215207d56d3f51950`，分支 rex/REX-804-Alien-codex-faults。

四类实现：HEARTBEAT_LOSS 拒绝目标 heartbeat；PROVIDER_UNAVAILABLE 拒绝目标 execution claim，非外部 provider API；DELAY_RESULT 暂存目标 canonical reports；DUPLICATE_EVENT 重复研究 observation，绝不重复 canonical execution。显式在线 canonical target、Owner-only route、typed confirmation、≤30000ms、有 expiry/emergency stop/restart interruption。正常执行和无关节点保持 canonical。不注入 OS/公共网络/破坏性 fault。

用户路径：Web Research→Advanced/Danger Zone→target/type/duration→阅读影响→输入 exact confirmation→inject→检查 bounded receipt/recovery→emergency stop。真实 Web→Gateway 验证确认前拒绝、activation/stop。Android parity 明确留给 REX-807，未 verified complete。

Focused10 PASS；fresh technical critic 独立 controller/Gateway9 PASS，storage-isolation/measurement-attribution 初始 finding 已修。此非对侧 Formal Review。初始完整 local suite S1 relay rate-limit timing 失败保留，需隔离复现和最终 exact CI。候选 CI37397436261 当时 IN_PROGRESS，尚未声明 full-suite 成功或正式完成。

Detection 要求 exercised active heartbeat fault 与 canonical NODE_OFFLINE；recovery 要求 exercised request 和后续恢复目标操作成功，缺值 null。精选 receipt/screenshot 在 Utopia evidence/raw/mission-book/REX-804，raw .runtime/evidence/mission-book/REX-804。剩余 final CI、Mech 独立未用 probe、Registry/runtime 对账；无 merge authority。

最终 evidence head `ef11bb7a160b1388b234b63215207d56d3f51950`，产品 parent`9b68d4f7054bb911c484340532cc3b5ae9ed47ac`。完整 local concurrency4：1360 PASS/0 FAIL；原 default concurrency1357 PASS/1 FAIL（S1 relay burst），隔离未修改 relay12 PASS/0 FAIL。完整套件负载使 30 个顺序请求跨 1s rate window，未改阈值/删除 test。双语 docs PASS，Rooms69 PASS，promotion-history10 verified。PR30 保持 draft，等 final hosted CI 与 Mech review。

controlled-probe.json 保留四个实际本地 probe receipt/trace。HEARTBEAT_LOSS detection963ms，移除后 heartbeat recovery22ms，execution claim24ms，delayed report7ms，duplicate trace observations3。仅一个本地 controlled probe，不是性能/physical-host/provider 恢复声明；未观测指标 null。

Hosted fixture 缺陷保留：push37397118298 在真实 Gateway probe 因 FAULT_TARGET_NOT_READY 失败；100ms liveness lease 在 fault 阶段间未持续 heartbeat，runner 负载下正确使 target 过期。MEASUREMENT_DEFECT，非绕过 readiness 授权。同 source PR37397255730 后来成功，不验证新 final head。

仅 test repair `f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5`：每 activation 前刷新真实 heartbeat、fixture lease2000ms、有界等待实际 offline、非 heartbeat 阶段维护 heartbeat。fault≤30000ms、安全断言全部保留，focused10 PASS；产品 source 仍 `9b68d4f7054bb911c484340532cc3b5ae9ed47ac`。final CI37397799729/push37397794253 当时运行；superseded evidence-only37397436261/37397431269 取消释放 runner，原失败保留；linkage37397800050 通过。local City1969 PASS/15 SKIPPED，跳过显式保留。

## Development release——最终 exact CI 已观测

final implementation/evidence `f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5`；PR37397799729/push37397794253 COMPLETED SUCCESS，独立验证 headSha 等于记录 head，gateway-web/android SUCCESS；linkage37397800050 SUCCESS，所有 checks 终态成功。远端 tip=local HEAD，release 时 worktree clean。PR30 交 Mech，未 merge。

Development complete=true、Review complete=false；Registry CANDIDATE_PENDING_FORMAL_REVIEW。Mech 增加未用 probe 并独立 reconcile exact runtime/UI/Registry；Web component verified、Android seam 保留。非 programme 完成。

Control-plane 命令修复：PATH python 是 WindowsApps 占位，未真正执行脚本。D:/Tools/MonitorPython-3.13.0/python.exe 实际运行 dependency/progress sync 与--check，有明确同步输出。八本 REX frontmatter、candidate/index YAML 以仓库 yaml package uniqueKeys 解析；早期静默 placeholder 调用不宣称验证成功。
