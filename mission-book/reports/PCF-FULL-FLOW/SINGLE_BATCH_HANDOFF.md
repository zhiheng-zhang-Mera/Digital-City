# PCF 一次整流验证交接 / PCF single complete-flow verification handoff

协议 / Protocol: **SINGLE_BATCH_OPPOSITE_HOST_VERIFICATION**.

源码 / Source: `998440c7772cc032d012b457c2a59cd1059826c0`, branch `pcf/full-flow-alien-pending-verification-20261007`, [Utopia draft PR #42](https://github.com/zhiheng-zhang-Mera/utopia/pull/42). 对侧以整条候选流为一轮接收，不分拆逐任务请求。 / The opposite host receives the entire candidate in one round, without separate per-workbook requests.

本包是可审查的开发候选；29 本范围全部列入 [覆盖矩阵](CANDIDATE_MATRIX.json)，不是全任务书完成或 main 可合并证明。真实跨机授权/传输、provider、phone worker、完整重启/SLO/研究矩阵仍有缺口。 / This reviewable development candidate accounts for all 29 books; it does not prove programme completion or main-merge readiness. Actual cross-host grants/transport, providers, phone worker and complete restart/SLO/research matrices retain gaps.

验证步骤 / Verification sequence:

1. 在独立目录获取候选，确认精确 SHA 与干净树；保留既有 City、安装身份与本机源码。 / Fetch the candidate into an isolated directory, confirm the exact SHA and clean sources, preserving the existing City, installation identity and checkout.
2. 冻结依赖安装后，一次运行组合检查：`node --test --test-concurrency=2 tests/pcf*.test.mjs`。Windows 上 Linux case 的跳过不等于实体 Linux 验收。 / After frozen dependency installation, run the combined component checks once. A Windows Linux-case skip is not physical Linux acceptance.
3. 同一轮核查 canonical Task/Action、artifact/checkpoint、驻留服务、Web/Android 投影、部署、headless/remote port、engineering/tools 和 REX trace。未配置的绑定保持 NOT_WIRED，不使用测试中恒真 callback 冒充正式授权。 / In the same round inspect the canonical Task/Action, artifacts/checkpoints, resident service, Web/Android projection, deployment, headless/remote port, engineering/tools and REX trace. Unconfigured bindings remain NOT_WIRED; fixture callbacks granting constant true never replace official authority.
4. 实体工程流的目标是 Alien 发起、Mech 执行，同时 Alien 继续本地工作；原 caller 读取结果、实际继续工程动作并明确确认消费，然后反向重复。真实 Codex/DeepSeek、worker principal、同一 parent-session、代码/构建/test 输出与真实停止证据必须来自正式已获准绑定。 / The physical engineering target is Alien submission → Mech execution while Alien continues local work → the same caller reads results, performs an actual follow-up engineering action and explicitly acknowledges consumption, then the reverse direction. Actual providers, worker principal, parent session, code/build/test output and stop proof must come from approved official bindings.
5. 全轮保留失败、NOT_RUN 与撤权/过期/旧 epoch 拒绝记录；出具一个总报告，逐项引用真实证据。模型许可、独立 HA substrate、未验证的 process tree/resume/SLO 不升级为 PASS。 / Retain failures, NOT_RUN and revoked/expired/stale-epoch refusals in one aggregate report with evidence references. Model licensing, independent HA substrate and unverified process-tree/resume/SLO do not become PASS.

默认不安装手机 worker、不切换常驻 City、不创建凭据、不启用付费 API、不启 OS autostart，也不合并 main。这些状态在同一轮交接中由真实前提决定。 / The default does not install a phone worker, switch the resident City, create credentials, enable paid APIs or OS autostart, or merge main. Their status is determined by real prerequisites within the same handoff.

成功的本机 CPU/Node fixture、caller acknowledgement、云端 Linux CI 与 Android APK 编译，分别只能证明对应组件。 / Successful local CPU/Node fixtures, caller acknowledgement, hosted Linux CI and Android APK compilation each prove their respective component only.
