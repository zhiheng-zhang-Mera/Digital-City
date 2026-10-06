# REX-805 开发检查点 / Development checkpoint

候选 `4b3946868d4083285da8a8d99eac2642890b37c4` 已推送至 [PR38](https://github.com/zhiheng-zhang-Mera/utopia/pull/38)。开发和验收仍未完成，终端标记尚未释放。

Candidate above is pushed to PR38. Development and acceptance remain incomplete; the terminal marker is withheld.

实现提供 Owner Research 页面选取原有 run、创建新实验/任务执行与比较；v1 仅重放无状态 WAIT，支持真实 alternate-device 消融。其他机制明确拒绝为 ABLATION_UNSUPPORTED，未快照的文件/故障条件拒绝为 REPLAY_CONDITION_UNAVAILABLE。来源摘要是规范解析后 receipt SHA256；不保证墙钟、活资源和外部 provider 确定性，当前进程 SHA 为 NOT_OBSERVED。

The Owner Research page selects a recorded run, starts a new experiment/canonical execution and compares it. V1 replays stateless WAIT and implements real alternate-device ablation. Other mechanisms are explicitly ABLATION_UNSUPPORTED; unsnapshotted file/fault conditions are REPLAY_CONDITION_UNAVAILABLE. Source digest is canonical parsed-receipt SHA256. Wall-clock, live resources and external providers are nondeterministic; current process SHA remains NOT_OBSERVED.

首轮独立审查发现三项 Important：派生回放丢失消融策略、比较漏检控制项、来源落点矛盾仍获接纳。三条回归先7/10通过，修复后10/10通过。第二轮发现单次成功停止条件、虚构关联字段、注册引用对应关系缺口。修复在注册前转换并校验单次限制，保留失败/墙钟限制；比较完整有效控制、关联字段及规范化注册引用。独立复审确认六项均解决，核心/Gateway/种子17/17通过。真实 Gateway 包含原始→消融→派生回放的规范落点，成功停止值3→1，失败值3保留。此代码审查不替代 opposite-host 验收。

First independent review found three Important defects: derived replay lost ablation policy, comparison omitted controls, and contradictory source placement was accepted. Regressions initially passed7/10, then10/10 after repair. Second review found single-run success-stop conversion, fabricated lineage and registry-reference correspondence gaps. Repairs validate transformed limits before registration while preserving failure/wall-clock bounds and compare effective controls, lineage and normalized registry refs. Independent re-review confirms all six resolved; core/Gateway/seed17/17 pass. Real Gateway covers original→ablation→derived replay canonical placement, success stop3→1 with failure bound3 retained. This code review does not replace opposite-host acceptance.

旧候选 a574e009 的精确版本完整测试存在3项 host-city-launcher ENV 失败：已有正式联机 City 占用4389。保留该 City，不为测试停服。修复版完整套件与托管 CI 正在执行，结果未发布前为 PENDING；实体多设备比较 NOT_RUN。

The exact earlier a574e009 full suite has three host-city-launcher ENV failures caused by the formally connected resident City on4389. The City remains running. Repaired-head full suite and hosted CI are in progress and remain PENDING until observed; physical multi-device comparison is NOT_RUN.

未来 Mech Owner 联机验收须明确更新至上述修复候选或包含它的版本；此前“Mech已经更新”绑定8798ba9，不能作为本候选部署证据。建议使用已验收 campaign-966cf439-7017-4bb0-88e8-981e59c18322 的 run1（种子414121415，原 Alien 落点），执行 replay 后 alternate-device ablation，并导出原始/新 receipt、registry 与规范任务。Alien 和手机仅 MEMBER，不能伪造 Owner 请求。

Future Mech Owner physical acceptance must explicitly update to this repaired candidate or a containing version. The earlier update confirmation binds8798ba9 and cannot attest this deployment. Suggested source is accepted campaign-966cf439-7017-4bb0-88e8-981e59c18322 run1 (seed414121415, original Alien placement), followed by replay and alternate-device ablation, exporting source/new receipts, registry and canonical tasks. Alien and phone are MEMBER only and cannot impersonate Owner requests.


## 精确候选核验更新 / Exact candidate verification update

已逐项读取 Actions API，headSha均为 `4b3946868d4083285da8a8d99eac2642890b37c4`：push37440884928、PR37440891856、City linkage37440891872 均 COMPLETED SUCCESS，两个 V0.2 检查的 Android 与 Gateway/Web jobs均成功。本地精确版本完整套件1412项，1409通过、3失败；3项均为 host-city-launcher 测试要求空闲本机reservation，而正式MEMBER City仍占4389，未停服或隐去失败。运行后 tracked工作树干净、远端branch与PR head均匹配。仍没有实体 replay/ablation 验收或产品main合并。

Actions API checks individually bind the exact candidate above: push37440884928, PR37440891856 and City linkage37440891872 are all COMPLETED SUCCESS; both V0.2 Android and Gateway/Web jobs succeed. Exact local full suite has1412 tests,1409 pass and3 fail. All three host-city-launcher tests require an empty local reservation while the formally connected MEMBER City occupies4389; the service was preserved and failures disclosed. Tracked worktree is clean after execution and remote branch/PR head match. Physical replay/ablation acceptance and product-main integration are still absent.


## 空限制比较修复候选 / Empty-limit comparison candidate

候选更新为 `0261a9ed1cec88df3ab4675623d422b37b33f270`。Mech 的独立探针发现无额外限制时出现 limits 差异，Alien 用真实 HTTP campaign→Replay 复现（Gateway2通过1失败）；runner把null存为{}，comparison此前按形状误报。现比较同义空集合，实际新增或改变的限制仍报告差异，核心/Gateway/种子18/18通过。精确新版本完整套件、CI及独立复审进行中，不借旧候选成功结果宣称新候选通过；实体门槛仍NOT_RUN。

The candidate is now `0261a9ed1cec88df3ab4675623d422b37b33f270`. Mech's probe exposed a limits mismatch for campaigns without extra bounds; Alien reproduced it through a real HTTP campaign→Replay (Gateway2 passes,1 failure). The runner persists null as {}, which comparison incorrectly treated as a different control. Equivalent empty sets now match, while added or changed bounds still differ; core/Gateway/seed18/18 pass. Exact new-head full suite, CI and independent re-review are in progress. Previous candidate successes do not validate the new head. The physical gate remains NOT_RUN.

本轮候选4b39468的本地Android编译已执行：Java17、testDebugUnitTest assembleDebug BUILD SUCCESS，21suites/111tests/0failures/0errors，APK SHA256 `3b40b8d365a17893e01bdf88b190829f8de609bce3859ef10a7acadf4ca9ed0e`。随后空限制修复只改Gateway/测试/执行账本，未改Android来源；APK构建不证明手机新安装或实体Replay。

The local Android build initiated at candidate4b39468 completed with Java17: testDebugUnitTest assembleDebug BUILD SUCCESS,21 suites/111 tests/0 failures/0 errors, with the APK hash above. The subsequent empty-limit repair changes only Gateway, tests and the execution ledger, with no Android source change. Building the APK does not establish a fresh phone installation or physical Replay acceptance.
