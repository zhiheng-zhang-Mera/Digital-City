# EM-012 修正报告——连接器 SDK 与 Claude Code／WorkBuddy 扩展路径

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = EM-012 (Engineering Manager programme, task 12 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-012-connector-sdk-claude-workbuddy.md
CLAIM_COMMIT         = 3dc4608 (Digital-City main, claim of EM-012 Correction by Alien)
CLAIMED_AT           = 2026-10-01T05:35:27Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 364c5160952039d31074af3bfae843c1d0f4be24
DEVELOPMENT_CI       = 36751919772-success-attempt-3
CORRECTION_BRANCH    = engineering-manager/EM-012-connector-sdk-claude-workbuddy
CORRECTION_HEAD_SHA  = e4afd5ea5a822b481a93771b4b33041d64e29cb8
BRANCH_CI            = 36821442088-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-012 26 pass (7 author + 19 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. 托管 CI

```text
development head   364c516 (Mech)   run 36751919772   success
corrected head     e4afd5e (Alien)  run 36821442088   gateway-web success / android success
```

开发运行 ID 即工作簿曾记录 `BLOCKED_GITHUB_ACCOUNT_BILLING` 的运行。Owner 清除计费拒绝后它最终成功，因此本 Correction 才具备领取资格，见 `mission-book/reports/DEVELOPMENT_CI_RECOVERY_2026-10-01.md`（历史引用按原文保留）。

## 2. 独立审查方法

开发 head 用 `git archive --format=tar -o …` 导出后解包到 `D:\A-Utopia\.runtime\evidence\mission-book\EM-012\frozen-364c516\`。开始审查前，四个分支 blob 均验证 Git 对象：`git hash-object` 等于 `git rev-parse <head>:<path>`，全部 MATCH。首次尝试经 PowerShell 将 `git archive` 直接管道给 `tar` 损坏了流，报 `Damaged tar archive (bad header checksum)`，四项哈希全部 MISMATCH；改为写归档文件后全部匹配。

独立对抗审查者仅获得冻结导出，先读控制工作簿；说明重点缺陷是**伪造真实提供商验收**与**空洞一致性证书**，因为 SDK 的整体产品主张是“不触碰核心即可证明新连接器”。审查返回 13 项探针、`probes/ALL-PROBES-OUTPUT.txt` 和 `probes/FINDINGS.md`：`MATERIAL_DEFECTS_FOUND: 11`，置信度高（0.9）。修正主机自己的阅读已发现其中七项；合并发现集按下文修复，也记录审查者非实质性备注。

## 3. 发现并修复的缺陷——14 种机制

类别编号遵循本项目 Correction 共用分类：1 自有键／原型；2 可选启用或仅字面量保护；3 调用者控制限制；4 权限未绑定主体；5 拒绝前状态变更；6 未验证时刻；7 已验证但未读取；8 硬编码主张；9 递归／克隆失败；10 字段丢失或重读；11 可变键幂等；12 访问器 TOCTOU；13 审计未绑定执行者；14 主张无数据支持。

| # | 机制 | 类别 | 修复 | 回归 |
|---|---|---|---|---|
| 1 | **时刻仅检查形状。** `isIsoInstant` 接受 `2026-13-45T99:99:99Z`、`2026-02-30T00:00:00Z`，使 `defineConnector({ at })`、`runConformanceHarness({ at })` 与适配器时钟把不可能时刻存为证据 | 6 | `isIsoInstant` 后使用真实时刻往返 `isRealInstant`，所有调用者传入时刻共用已验证 `atFrom` | 是 |
| 2 | **冻结器不能处理循环且重读访问器。** 循环 handler 值逸出为未类型化 `RangeError`，`Object.values` 调用 getter | 9、12 | `WeakSet` 防循环，遍历自有描述符而非值 | 是 |
| 3 | **未验证 `supported_controls`。** 字符串展开成字符，null 抛原始 TypeError，混合列表通过；`optional: 'yes'` 静默变 false | 3 | 使用规范控制名称列表、去重，opt-in 必须布尔值 | 是 |
| 4 | **一致性工具认证静默接受不支持操作的连接器。** 检查写 `{ typed_refusal: false }` 却 `passed: true`，默认跳过控制期望，未验证 `result.state`（BANANA 通过），不交叉核对声明／报告能力 | 8、7、2 | 静默接受使检查失败，默认执行控制检查，强制 `RESULT_STATES/TERMINAL_RESULT_STATES`，声明而未报告能力即失败 | 是 |
| 5 | **不可克隆端口结果以活对象传出。** `snapshotResult` 吞克隆失败并返回适配器自身对象，调用者可修改适配器状态 | 12、8 | 类型化 `MALFORMED_RESULT` 拒绝，并故障隔离适配器；边界输出全部冻结 | 是 |
| 6 | **恶意错误逃出 invoke 的 catch。** 未保护地读取 error.code，抛错 getter 原样传播，不记录故障且适配器仍 ENABLED | 3、4 | 先记录故障（先状态、容错时钟），防御读取 code/message；不可读时 `code_readable: false` | 是 |
| 7 | **原型查找验证 handler，却用展开存储。** 继承或不可枚举方法满足 `MINIMUM_CONNECTOR_METHODS`，存储记录却为空；minimum_methods_satisfied 为字面量 true | 4、8 | handlers 必须普通自有方法记录，从验证的方法构造存储，标志从该记录推导 | 是 |
| 8 | **可用性仅是调用者标志。** `probe().installed === false` 未被决策读取，未安装可选产品仍 ENABLED、usable、可参与能力路由 | 2、4、7 | installState 无状态变更地读取适配器自身探测；startupReport 报 install_state，非 NOT_INSTALLED 才 usable；selectForCapability 排除未安装项 | 是 |
| 9 | **clearFaults 任意复活并擦账，enable 静默复活故障适配器。** | 5、13 | 仅 FAULTED 可清除，故障移入保留 faultHistory；enable 拒绝故障适配器，清除是唯一复活路径 | 是 |
| 10 | **调用者自声明被盖章为验收。** 仅返回 real:true 与两串字符串的运行时即可得 component_stage_acceptance:true、HOST_RUNTIME；fabricated_* 硬编码 false | 7、8、1 | 自报未安装不得验收；类实例或抛错运行时不是证据；每份报告携 acceptance_verified_here:false 与 evidence_declared_by；汇总统计未验证验收，不再硬编码 0 | 是 |
| 11 | **注册表接受任何有 connectorKind() 的对象，伪造适配器绕过隔离。** | 4 | createSdkAdapter 盖模块私有品牌，仅 SDK 包装适配器能注册（isolation_wrapped） | 是 |
| 12 | **一个损坏适配器以原始未类型化错误杀死所有注册表报告。** | 3 | startupReport、selectForCapability、acceptanceSummary 逐适配器保护，坏验收变 pending 报告，加 safeKind 读取器 | 是 |
| 13 | **不一致连接器仍获核心编辑证书。** core_edits_required:0、foreman_core_edited:false 与端口版本主张均为字面量 | 7、8 | 全部检查通过才出证书，否则 null＋claims_withheld:true | 是 |
| 14 | **同进程相同种类两个适配器的故障 ID 碰撞，且故障不注明记录者。** | 8、13 | 进程全局故障序列，加 recorded_by:'SDK_ADAPTER' | 是 |

## 4. 本地测试汇总

```text
corrected module (e4afd5e)           26 tests / 26 pass / 0 fail
development head 364c516             26 tests /  7 pass / 19 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

作者 7 项测试未改，全部通过。证据位于 `D:\A-Utopia\.runtime\evidence\mission-book\EM-012\`：`frozen-364c516/` 为字节验证导出；`pre-fix-baseline.txt` 保存上述 7／19 分割；门禁日志为 `gate-sdk.log`、`gate-root.log`、`gate-rooms.log`、`gate-city.log`、`gate-promotion.log`、`gate-bilingual.log`。锚点保护修复脚本是 `patch-connector-sdk-1.mjs`、`patch-connector-sdk-2.mjs`、`patch-connector-sdk-3.mjs`、`fix-regression-inherited.mjs`；回归块为 `regressions.block.txt`、`regressions2.block.txt`；独立审查的 `probes/FINDINGS.md` 含 13 探针及合并输出。

## 5. 边界（有意未作为缺陷“修复”）

| 边界 | 理由 |
|---|---|
| 保留 `evidence_source: 'HOST_RUNTIME'` 与最小证据形状 real／submit_ref／terminal_ref（审查者缺陷 1） | 作者 `conformance.test.mjs:250-251` 断言 HOST_RUNTIME 字面量及 `assert.deepEqual(real_evidence, { submit_ref, terminal_ref })`。因此标注声明：acceptance_verified_here:false、evidence_declared_by:'CALLER_SUPPLIED_RUNTIME'、real_evidence_verified_here:false，不能重命名作者字段。主机验证的验收需要本任务不拥有的主机产物契约。 |
| family 已验证却不决定任何事，OPTIONAL_FAMILIES 未使用（审查者缺陷 9） | 这是覆盖证据与明确约束：若 optional family 隐含 optional:true，会拒绝作者统一辅助函数建立的定义（conformance.test.mjs:176-193，标志按适配器设置）。交项目 Owner 记录。 |
| UNPROVEN 是声明状态，却无路径设置 | 属于覆盖证据：状态词汇是公开数据，缺失产品进入 DISABLED／UNAVAILABLE。 |
| 一致性工具不能验证安装或真实运行 | 只能检查形状、类型和拒绝行为。“探测诚实报告安装”仍是适配器作者声明；载荷现报告自身探测 install_state，验收含声明标志，读者可区分此处验证内容（没有真实安装／运行验证）和声明内容。 |
| startup_blocked:false／unrelated_connectors_blocked:[] | 对仅读取适配器、什么都不启动的本次报告调用，这是结构事实。报告另含逐适配器 install_state，使 usable 列表如实。 |
| 故障与历史账本无界 | 工作簿未规定保留策略；访问器返回冻结副本，faults 是当前账，faultHistory 是保留记录。新增保留策略会是新接口。 |
| 连接器自身 handler 是可信代码；SDK 隔离故障而非验证诚实 | 适配器按构造在进程内运行；SDK 职责是界定和隔离，现由故障账本、安装状态、类型化拒绝实现。 |

## 6. 审查完整性说明

审查者报告工作期间冻结导出中的作者测试副本于 15:38:50 变更。这是预期行为：Correction 主机向副本追加回归块以生成修复前基线。审查者自己复现相同基线，当时 7 通过／10 失败，两块安装后 7 通过／19 失败。其评判的**模块**在每个探针前后字节相同，`connector-sdk.mjs` sha256 为 `3BCEBCE26B13D82FEF548BB308E8FD5B28C8431E5466643B10EFC40E187E0402`；审查者没有修改冻结导出内容。

## 7. 披露

- 托管运行前推送三轮。第一轮修时刻、冻结器、定义验证、工具拒绝检查、结果快照、故障路径；第二轮修可用性、验收来源、故障复活、注册表门禁；第三轮修审查剩余项：恶意错误读取、扣留证书、存储 handler 记录、逐适配器报告隔离、故障身份。十一项实质发现均已修复或编码为作者既定边界，没有实质项留待处理。
- 自己的错误也记录：首次 `git archive | tar` 冻结损坏全部四个 blob，已改归档文件重做；继承 handler 回归原期望 MISSING_METHOD，而普通记录规则正确返回 INVALID_DEFINITION，故修正测试并增加有区分力案例：不可枚举自有方法仍必须存储并验证。
- 修复脚本有锚点保护，每个在写入前至少一次因锚点不匹配干净退出；每块回归均用字节保留 `append-regressions.mjs`。
- 未把计费拒绝记为代码失败；本任务每个实际启动的托管运行都执行真实步骤。
