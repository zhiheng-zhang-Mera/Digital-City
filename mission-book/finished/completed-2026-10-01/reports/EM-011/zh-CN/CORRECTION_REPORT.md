# EM-011 修正报告——DeepSeek Harness 与 Codex 参考连接器

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = EM-011 (Engineering Manager programme, task 11 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-011-deepseek-codex-reference-connectors.md
CLAIM_COMMIT         = 0a15850 (Digital-City main, claim of EM-011 Correction by Alien)
CLAIMED_AT           = 2026-10-01T03:31:17Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = cb3cad618e0dc8a147f2afcb5c7c81b4df998f62
DEVELOPMENT_CI       = 36750007584-success
CORRECTION_BRANCH    = engineering-manager/EM-011-deepseek-codex-reference-connectors
CORRECTION_HEAD_SHA  = dbf70fb3a9669dfd8b13598d981bb67ae92615cb
BRANCH_CI            = 36811902420-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-011 20 pass (7 author + 13 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. 托管 CI

```text
development head   cb3cad6 (Mech)   run 36750007584   success
first-pass head    6c31dec (Alien)  run 36811376005   success   ← superseded by the review in §4
corrected head     dbf70fb (Alien)  run 36811902420   gateway-web success / android success
```

第一轮成功 head 后被第4节独立审查修正取代，不能替代最终精确 head 的证据。

## 2. 独立审查方法

开发 head 用 git archive 导出到 `D:\A-Utopia\.runtime\evidence\mission-book\EM-011\frozen-cb3cad6\`。开始审查前，全部四个分支 blob 验证 Git 对象。

```text
contracts/engineering-reference-connectors-v1/reference-connectors.mjs   MATCH 9db9eacc4a48e38478453bad6c4855edf9433b3b
contracts/engineering-reference-connectors-v1/index.mjs                  MATCH 02265d9362aafcfc8de61944d0c4b6eab2001f64
contracts/engineering-reference-connectors-v1/tests/conformance.test.mjs MATCH 08b2b325b267eca0a6c63402f7c84202297a5841
tests/engineering-reference-connectors.test.mjs                          MATCH b3f65e6bf0fd400238acdb838eaf39226324d82d
```

独立对抗审查者仅获得冻结导出，先读工作簿，重点是适配器假成功风险：声称后端从未产出的能力、提交或完成。返回13探针与 `probes/FINDINGS.md`，记录14机制、MATERIAL_DEFECTS_FOUND、高置信度；整个过程模块字节不变。修正主机并行审查，按机制合并：七项重叠，八项为独立审查新增并列于第4节，两项作者编码契约作为第6节边界记录。

审查者总结如实界定任务：模块的**验证**边界（安装、认证、能力、未知结果）如实且经受全部攻击；**动作**边界却用自己的成功替代适配器答复。

## 3. 第一轮——8 种机制

共同类别：1 自有键／原型；2 opt-in 或仅字面量保护；3 调用者控制限制；4 权限未绑定主体；5 拒绝前变更；6 未验证时刻；7 验证未读；8 硬编码主张；9 递归／克隆失败；10 丢失／重读字段；11 可变键幂等；12 访问器 TOCTOU。

| # | 机制 | 类别 | 修复 | 回归 |
|---|---|---|---|---|
| 1 | **拒绝提交仍报已提交。** 丢弃 runtime.submit 答复，后端 submitted:false／accepted:false 或通道抛错仍 submitted:true 并记录提交 | 8、12 | 明确拒绝或抛错通道类型化 REFUSED，什么都不记录 | 是 |
| 2 | **虚构相关引用。** 无后端 result_ref 时合成 session:...:operation，作结果相关 ID，却声称 provenance_only_backend_ids:true | 8 | 规范作业ID是身份，后端未产引用则 result_ref:null，并报告 backend_result_ref_known | 是 |
| 3 | **拒绝控制仍报应用并关闭会话** | 8、12 | 拒绝／抛错为 REFUSED，无应用，会话保持打开 | 是 |
| 4 | **拒绝／抛错启动仍创建会话，backend_run_ref 未验证** | 5、8 | REFUSED 且不建会话，来源引用必须文本或null | 是 |
| 5 | **不可读事件流变空流，使读取失败像安静运行** | 8、10 | 非列表 INVALID_RUNTIME，抛错 REFUSED；真实空列表仍空 | 是 |
| 6 | **另一后端运行结果归于本作业** | 4 | 声明运行不符则 UNKNOWN、correlation_mismatch:true | 是 |
| 7 | **验收可伪造。** 三引用可同值重复，terminal_state 缺失默认 SUCCEEDED | 8 | 三阶段引用须互异，终态须运行时实际报告；否则延期标记 | 是 |
| 8 | **时刻仅形状，七调用点和两时钟原样记调用者 at** | 6 | isIsoInstant 要真实时刻，验证两时钟，所有at共用辅助函数 | 是 |

## 4. 第二轮——独立审查不重叠发现

| # | 机制 | 类别 | 修复 | 回归 |
|---|---|---|---|---|
| 9 | **本机已探测 NOT_INSTALLED 产品仍可验收。** 报告不读取安装状态，无产品主机伪造证据仍呈组件验收 | 8 | 必须 INSTALLED 与真实证据 | 是 |
| 10 | **关闭会话仍报活跃工作。** CANCEL 后 CLOSED，result 却报后端陈旧 RUNNING | 4、10 | 已关闭且无后端终态时 CANCELLED，session_closed:true | 是 |
| 11 | **规范作业ID只能提交，不能访问control/events/result，控制答复无后端引用，违背取消／中断与相关验收** | 7、10 | 三接口均可会话引用或规范作业引用解析，答复携 backend_run_ref | 是 |
| 12 | **一个逻辑动作执行两次。** 去重在 session.submits，取消再附着产生无记忆新会话，相同动作再次调后端 | 11 | connector 的 action_submissions 保存保护，跨会话生存 | 是 |
| 13 | **kind 查找沿原型链。** constructor/toString/__proto__ 通过 UNKNOWN_KIND，构造深处原始TypeError | 1 | 仅自有键查找 | 是 |
| 14 | **提供商通道崩溃原样抛错。** probe 抛Error给调用者，无类型化失败／注意事项 | 9、12 | 探测抛错降级 UNKNOWN 安装态、probe_failed:true、PROBE_FAILED日志；auth抛错UNKNOWN；startOrAttach类型化NOT_READY | 是 |
| 15 | **不足规范的连接器污染注册表。** register 仅保护 connectorKind/capabilities，缺 readiness/acceptanceReport 仍注册，后续汇总／ready_only选择TypeError | 9 | 注册要求实际调用的全部方法 | 是 |
| 16 | **emulated_acceptance_claimed硬编码0。** 模拟来源宣称组件验收仍列accepted且计数0 | 8 | 从报告推导计数 | 是 |

另加纵深保护，无专门回归：规范对象必须普通（原型 Object.prototype 或null），冻结器用访问集合防自引用爆栈。

## 5. 本地测试汇总

```text
corrected module                    20 tests / 20 pass / 0 fail
development head cb3cad6            20 tests /  7 pass / 13 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

作者7测试不变且全通过。证据根 `D:\A-Utopia\.runtime\evidence\mission-book\EM-011\` 包含字节验证 frozen-cb3cad6/、开发head运行修正套件的 prefix-test.log、gate-EM-011.log、两轮锚点保护脚本 patch-connectors.mjs／patch-connectors-2.mjs（两者均至少一次锚点不符而写入前干净退出），以及独立 FINDINGS、13探针与运行日志。

## 6. 边界（有意不“修复”）

| 边界 | 理由 |
|---|---|
| 验收证据是运行时声明 real:true＋三引用，不与连接器实际会话／提交相关 | 作者 conformance.test.mjs:266-274 断言从未开启会话连接器验收；强制相关将违背编码契约。已修模块可独自核对的安装态、互异引用、真实报告终态。证据必须指向什么需Owner决策。 |
| 无action key提交没有去重保护 | action key是调用者幂等声明，作者:245-246断言不同key为新提交。重复路径如实 duplicate:true，#12使保护跨再附着。 |
| 接受提交立即报 state:RUNNING | result()才是结果权限主体，不能证明时UNKNOWN；立即RUNNING是作者:162编码的提交状态。 |
| connector policy接受但大部未读（required_capabilities、max_journal_entries） | 工作簿不定义适配器必要能力策略，日志裁剪属无人要求的指标决策。记录声明未读输入，不发明行为；journal只读暴露。 |
| selectForCapability ready_only须主动启用 | 按能力解析是文档默认且作者断言；需要就绪者应请求。答复现注明具体连接器，不再静默暗示就绪。 |
| EMULATED_SMOKE_IS_NOT_ACCEPTANCE、ACCEPTANCE_NOT_PROVEN、OUTCOME_UNKNOWN、PROVENANCE_REQUIRED、DUPLICATE_SUBMIT声明但大部不抛 | 对应条件用标志、延期标记与类型化REFUSED/INVALID_RUNTIME报告；保留词汇供更严格后续版本，属于覆盖证据。 |
| DeepSeek描述符命名donor仓库，但donor_is_runtime_requirement:false | DS-Hns只是donor证据；模块不导入，只有字符串，作者:294断言该标志。 |

## 7. 提供商验收状态

没有声称真实提供商冒烟测试。Correction期间本机未运行 DeepSeek Harness 或 Codex 产品，因此组件验收仍延期 `REAL_PROVIDER_ACCEPTANCE_DEFERRED_TO_PROGRAMME_INTEGRATION`；**真实提交→进度→终态运行的精确证明交项目集成**。#7/#9严格规则使延期成为如实默认：模拟或未安装路径不再能提出组件验收主张。

## 8. 披露

- 首轮报告期间独立探针完成；不重叠发现列第二轮，仅两轮同一head全绿后工作簿才完成。
- 自有断言两次错误，修测试而非模块：result传无效at却期望静默回退，模块正确拒绝；第二轮锚点未匹配缩进，保护写入前退出，符合用途。
- 首轮“拒绝控制却关闭会话”即时表现由审查者发现，自有探针在提交路径发现相同机制；合并捕获第二调用点。
- 新Correction工作树门禁包括根与city/的 pnpm install --frozen-lockfile。计费拒绝未作代码失败；每个启动的托管运行均执行真实步骤。
