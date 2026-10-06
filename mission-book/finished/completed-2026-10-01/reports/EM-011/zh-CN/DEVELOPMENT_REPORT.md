# EM-011 开发报告——DeepSeek Harness 与 Codex 参考连接器

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = EM-011 (Engineering Manager programme, task 11 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 3a00269 (Digital-City main, "claim(EM-011): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T17:17:05Z
CONTROL_REVISION_AT_CLAIM= 1b8a274 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-011-deepseek-codex-reference-connectors
IMPLEMENTATION_HEAD_SHA  = cb3cad618e0dc8a147f2afcb5c7c81b4df998f62
BRANCH_CI                = 36750007584 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. 交付物

`contracts/engineering-reference-connectors-v1/` 包含 `reference-connectors.mjs`（通用ConnectorPort、两个参考描述符、主机探测／认证／就绪／能力、规范作业与后端来源、规范事件、类型化不支持状态、健康／注意事项、如实验收、按能力注册表）、index.mjs、7项测试套件及根 tests/engineering-reference-connectors.test.mjs。

| 验收要求 | 测试与证明 |
|---|---|
| 两连接器无Foreman核心提供商分支即可注册 | `both reference connectors register and resolve generically, with no provider branches in the core`：provider_name_branching:false、core_changed_for_third_connector:false，第三合成连接器同路径解析 |
| 如实探测已安装／未安装／需认证 | `installed, uninstalled and auth-required states are probed honestly`：NOT_INSTALLED且auto_install_attempted:false、解析版本、NEEDS_USER/EXPIRED需用户且auto_retry:false、不识别认证则UNKNOWN就绪 |
| 组件真实产品验收必须真实提交→进度→终态，否则延期精确证明 | `component-stage acceptance is only claimed with genuine real-host evidence`：无证据延期，部分／非真实拒绝，真实证据HOST_RUNTIME接受 |
| DeepSeek稳定进程／会话边界，DS-Hns仅donor证据 | descriptor().donor_is_runtime_requirement===false，注入进程运行时，无donor导入 |
| Codex已安装客户端／CLI边界 | CODEX同端口，CLI会话种类与其能力／控制集 |
| ConnectorPort映射全部操作 | 测试1断言两连接器均有probe/version/auth/readiness/capabilities/start-or-attach/submit/events/control/result/health十一方法 |
| 后端运行／会话ID为来源，规范Engineering作业ID唯一 | `one canonical job id is preserved while backend ids stay provenance`：每规范作业一个会话、is_provenance_only:true |
| 提供商不支持操作转类型化状态 | `unsupported operations become typed states instead of silence or success` |
| 专属解析／自动化在适配器边界下 | CONNECTOR_PORT.product_parsing_lives_below_adapter:true，按kind注入版本／事件解析，核心无解析 |
| 未知结果绝不报成功 | `an unknown outcome is never reported as success, and retries do not duplicate`：UNKNOWN、outcome_unknown_is_not_success、不虚构结果引用 |

## 2. 决策日志（问题 → 选项 → 选择 → 原因）

**D1——领取哪个任务。** 新扫描无本机修复、无Mech合资格Correction；Alien持BA-004/005/006/008、EM-004/005/008/009/010、GAI-003…008、RF-004…010，GAI-004进行中。前次RF-010平局排除Remote Fabric，选EM-011；首次以真实执行路径证明通用连接器契约，剩EM-012 SDK与EM-013集成都依它。

**D2——产品专属信息在哪里。** 描述符数据含kind、能力、支持控制、版本正则、会话种类，加注入runtime／解析钩子；核心／注册表仅读描述符和规范形状。符合专属解析／自动化在边界下、无核心提供商分支要求。第三合成连接器同路径注册解析证明通用，core_changed_for_third_connector:false。

**D3——主机探测。** probe依主机适配器报INSTALLED/NOT_INSTALLED/UNKNOWN，版本用产品自身正则解析，不识别为UNKNOWN；未安装绝不自动安装。如实验收禁止虚构版本或静默安装，明确测试auto_install_attempted:false、version_known:false。

**D4——认证与就绪。** 重用池规范词汇READY/MISSING/EXPIRED/NEEDS_USER/UNAVAILABLE/UNKNOWN；人工阻塞态user_action_required:true、auto_retry:false。就绪同时由安装和认证推导，不识别认证为UNKNOWN而非就绪。与EM-008/GAI-008一致避免登录事实跨项目冲突，人工状态不自动重试。非就绪启动USER_ACTION_REQUIRED/AUTH_REQUIRED且不重试。

**D5——规范作业与后端运行／会话。** 每作业一个Engineering规范ID；后端运行／会话标识存provenance、is_provenance_only:true；再次附着规范作业返回已有会话，不生成第二会话。工作簿要求来源保留且单作业ID，二次会话会破坏Foreman单作业不变量。测试两次attach只有一会话。

**D6——不支持操作。** 描述符外能力UNSUPPORTED_CAPABILITY，命名支持集、silently_ignored:false；控制集外操作UNSUPPORTED_OPERATION、refused:true。工作簿要类型化UNSUPPORTED_CAPABILITY/ATTENTION/REFUSED而非提供商错误文本。DeepSeek仅取消、Codex还暂停／恢复，这些差异必须由端口数据表达。

**D7——未知结果。** result对缺失／不识别后端状态映为UNKNOWN，outcome_unknown_is_not_success:true、terminal:false、result_ref:null；仅识别终态才终结。未知报成功是最危险连接器假成功，RF-009/GAI-008同规则，不能在此破坏。相同action key重复submit被吸收，重试非二次提交。

**D8——验收诚实。** acceptanceReport仅主机运行时提供真实提交→进度→终态证据时称组件验收；否则精确REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION，部分／明确非真实拒绝。工作簿明确禁止模拟冒烟标真实验收；套件覆盖延期、部分、非真实、真实，汇总emulated_acceptance_claimed:0。

**D9——本环境未执行真实产品。** 此分支对注入主机运行时证明契约，验收报告明确。两真实产品冒烟归项目集成，延期标记指向那里。记录而不掩盖，本报告不作真实产品运行主张。

**D10——不提供schema.json。** 与其他组件一致。

## 3. 精确文件

| 文件 | 变更 |
|---|---|
| contracts/engineering-reference-connectors-v1/reference-connectors.mjs | 新增端口、描述符、探测、会话、提交、事件、控制、结果、健康、验收、注册表 |
| contracts/engineering-reference-connectors-v1/index.mjs | 新增公开接口 |
| contracts/engineering-reference-connectors-v1/tests/conformance.test.mjs | 新增7一致性测试 |
| tests/engineering-reference-connectors.test.mjs | 新增根入口，仓库101→108 |

无City/Core、清单、文档改动，合并增量添加。

## 4. 测试汇总、失败与修复

7项首次三失败，均测试侧；**本任务未发现模块缺陷**，直接声明而不包装成修复。

1. **测试错误：** 原地排序冻结数组registry.connectorKinds().sort()；运行时替身默认结果RUNNING却断言UNKNOWN，模块正确传达替身，现替身返回空结果才是“暂无结果”。均与前轮同类。
2. **测试错误：** 汇总注册两个同种连接器，后者替换前者，延期列表空。现以CODEX作延期案例，断言精确列表。

## 5. 本地检查与CI

| 检查 | 原报告结果 |
|---|---|
| node --test tests/*.test.mjs | 108项，108通过，0失败（101基线＋7新） |
| node --test apps/rooms/tests/*.test.mjs | 69通过，0失败 |
| node city/test-all.mjs | 1801通过，0失败 |
| node scripts/verify-promotion-history.mjs | OK，82ed36933fb4验证10记录 |
| node scripts/check-bilingual.mjs | docs/evidence/data-records PAIR_STATUS=SYNCHRONIZED |
| cb3cad618e0dc8a147f2afcb5c7c81b4df998f62 的CI 36750007584 | success |

## 6. 交给同级任务的集成接口

- EM-002/004/006适配器／进程／注册表／放置：实现该端口，能力／控制差异是描述符数据；本注册表合并应与EM-004实例注册表协调为一个。
- EM-008凭据／会话：认证态应来自凭据层而非临时探测，词汇相同，合并只是接线。
- EM-010 foreman调度：节点调用startOrAttach/submit，规范作业ID作连接键，模块终态结果加节点验收引用满足其证据要求。
- EM-012 SDK与Claude Code/WorkBuddy路径：泛化此契约，合成测试证明新产品不需改核心。
- EM-013共享任务核心：规范ID映Shared Task Core作业引用，后端ID仍来源。
- GAI-008健康／韧性：健康／注意事项形状兼容，登录需求经同人工阻塞路径，不另词汇。
- 项目集成明确延期：此处未进行真实DeepSeek Harness/Codex冒烟，验收携精确延期标记，须EM合并工作簿对真实已安装产品消解。
- Owner问题不变：演进动态是否记录组件阶段事件。

## 7. Correction主机待处理项

1. 对抗尝试：probe已安装但空版本（现UNKNOWN/version_known:false，auth就绪时READY，确认可接受）；取消后attach（CLOSED后新会话，确认规范作业不变量）；支持submit操作后端抛错；重复事件序列；real:true证据却终态FAILED（现当真实证据接受，确认失败终态是否算验收）。
2. 确认D3不自动安装、D8部分／非真实不能验收。
3. FAILED终态证据是最尖锐歧义，须明确决定：实现视“有真实证据”为验收，而非“运行成功”。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```
