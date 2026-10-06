# EM-002 开发报告——连接器适配器框架与通用受管进程运行时

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = EM-002 (Engineering Manager programme, task 2 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 051ae09 (Digital-City main, "claim(EM-002): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T12:57:30Z
CONTROL_REVISION_AT_CLAIM= 7129082 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DONOR_POLICY             = DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b pinned but NOT read; no build/runtime dependency
IMPLEMENTATION_BRANCH    = engineering-manager/EM-002-connector-adapter-process-runtime
IMPLEMENTATION_HEAD_SHA  = 4e71558a9fc44a15a209eef4d711d8d90f90933b
BRANCH_CI                = 36718724624 — gateway-web success, android success
LOCAL_CHECK_SUMMARY      = 115/115 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. 交付物

| 文件 | 用途 |
|---|---|
| `contracts/engineering-connector-v1/manifest.mjs` | 连接器清单词汇：运行时种类、声明方法的能力、拟议需求、有界限制、来源；无凭据槽的严格验证、权限协调、调用授权 |
| `contracts/engineering-connector-v1/pipeline.mjs` | detect→select→adapt→validate→standardize→unify，逐适配器故障隔离，流水线写来源 |
| `contracts/engineering-connector-v1/runtime.mjs` | 通用受管进程：有界启动、心跳新鲜度、调用、停止、终结安全模式的有界重启预算、调用者策略脱敏的有界日志、来源 |
| `contracts/engineering-connector-v1/index.mjs` | 公开接口与已发布保证 |
| `contracts/engineering-connector-v1/tests/conformance.test.mjs` | 14 项一致性测试 |
| 根 `tests/engineering-connector.test.mjs` | 向 pnpm test 注册套件 |

| 验收要求 | 测试 |
|---|---|
| 畸形连接器不阻止其他加载 | `one malformed connector cannot prevent another connector from loading`：抛错探测器、非对象探测答复、畸形清单均记录失败，健康连接器仍加载 |
| 通用运行时至少承载两种能力不同的合成清单 | `the runtime hosts two synthetic connectors with different capabilities`；`loading two synthetic connectors with different capabilities needs no core change` |
| 拒绝未声明能力／方法 | 契约 `undeclared capability or method calls are refused`，运行时跨实例 CAPABILITY_NOT_DECLARED |
| 重启有界且安全模式终结 | `restarts are bounded and exhaustion is a terminal safe mode` |
| 日志／输出有界且调用者策略可脱敏 | `logs are bounded by the manifest and redactable by caller policy` |
| 加合成连接器只需注册／清单，不加Foreman核心条件 | `loading two synthetic connectors … needs no core change`：第三适配器按分数胜出证明声明选择规则 |

## 2. 决策日志（问题 → 选项 → 选择 → 原因）

**D1——领取哪个任务。** 选 EM-002。新扫描无本机修复、无合资格对侧 Correction（BA-003归Alien，Alien正开发RF-002），因此进入未领取开发层。EM池最大，占41任务中的13项，仅EM-001完成，且无其他主机工作；与前次BA不同，符合平局偏好。

**D2——跨分支纪律。** EM-001 的 engineering-manager-v1 契约在同冻结基线的未合并同级分支，不能导入也不能复制。EM-002独立声明清单／流水线／运行时契约，记录合并接口：应满足 EM-001 ConnectorPort 与连接器信封形状，使合并是明确绑定而非意外分叉。

**D3——故障隔离实现。** 选项：整流水线一个try/catch，或保护每个适配器调用并把坏输出当数据。选择后者，guardStage 包各阶段并显式验证输出形状：探测器 `{matched:boolean}`，验证器 boolean 或 `{ok:boolean}`。失败记录 stage/adapter_ref/code/detail 后继续。整段保护会使首个坏连接器中止所有后续项，正违背验收。ADAPTER_INVALID_OUTPUT 是“答了但无法使用”，区别于“抛错”的正式代码。

**D4——声明选择规则。** 按连接器选择适配器容易混入Foreman核心条件。统一规则为最高score，其次adapter_ref顺序，第三适配器无需改流水线即可按分数赢。由结构实现验收，而非口头承诺。

**D5——来源归属。** 选信任适配器自报或流水线写入；选择后者。标准化后流水线以观测探测证据、获选引用、获胜运行时种类覆盖 manifest.provenance。适配器若能自写可声称不同适配器／证据，审查者必须能信任此字段。

**D6——清单严格性与无原始秘密。** 初始测试误认为credential_ref槽合法。选择完全不提供凭据槽；所有契约对象严格，秘密形状字段作为未声明字段拒绝，递归秘密扫描保留为未来宽松字段的纵深保护。清单声明需求，凭据句柄归平台存储，不归worker声明。改测试匹配设计而非放宽设计，记录开发自行改变认识。

**D7——权限协调取交集。** effective＝declared∩granted；未声明需求授权直接 UNDECLARED_NEED_GRANT；已声明但无人决定的需求显示undecided，不静默视为批准／拒绝。适配器不能放宽策略，策略也不能放宽声明；未决定必须让操作者看见并答复。

**D8——何时拒绝未声明调用。** 接触进程前 authorizeInvocation 拒绝 CAPABILITY_NOT_DECLARED、METHOD_NOT_DECLARED、UNDECLARED_NEED_GRANT；运行时测试证明能力不跨两实例泄露。spawn后拒绝已执行声明未覆盖副作用。

**D9——注入进程端口。** createManagedProcessRuntime({spawnProcess})必须端口，套件用createProcessPortDouble，模块不导入node:child_process。测试封闭确定：端口ready答复与startup_timeout_ms预算决定有界启动，无壁钟等待／计时器偶发；真实主机原样注入真实spawner。

**D10——重启预算。** 检查前计数，失败重启也消费预算；耗尽进终结SAFE_MODE，拒绝start/invoke/restart；清除须明确operatorRef并重置预算，记录执行者。崩溃循环不可持续，“终结”须真正终结，自动冷却只会是延迟而非停止。

**D11——日志界限。** 依limits.max_log_bytes计字节，当前条目截断并报truncated:true；满后追加拒绝appended:false。静默丢输出是假成功，调用者始终能看出日志不完整。

**D12——脱敏时机。** 调用者策略patterns/replacement在写时应用，未脱敏文本不进存储；抛错或失败调用记编码消息而非原始进程输出。读时脱敏会在内存／后续dump留秘密。

**D13——donor策略。** 未阅读、克隆或fetch DS-Hns，分支无引用。工作簿固定donor却不要求读取，运行时据其自身要求编写；记录未读取避免后人误以为存在来源关联。任何形式都未访问Codex-Boss。

**D14——PROCESS_DATA_POLICY演进收件箱。** 未使用，与EM-001 D13、BA-001 D11、BA-002 D13、BA-003 D12、GAI-001 D10、RF-001 D8一致。

## 3. 测试汇总

14项均通过：清单声明与闭合词汇；无凭据槽及嵌套秘密扫描；交集协调、未声明授权拒绝与可见未决定需求；能力／方法／未授权需求调用授权；六阶段流水线与自行写来源；三坏适配器四种隔离输出形状且健康项仍加载；无需改核心加载两合成连接器与按分数选择；能力不同的两受管实例无泄露；永不就绪进程的有界启动；spawn失败和调用失败作为数据存活；依清单心跳间隔的新鲜度及恢复；有界重启终结安全模式及明确操作者清除；写时脱敏有界日志；如实未知实例／停止实例行为。

## 4. 本地检查与 CI

| 检查 | 原报告结果 |
|---|---|
| corepack pnpm test | 115项，115通过，0失败（101基线＋14新） |
| node scripts/verify-promotion-history.mjs | OK，在82ed36933fb4验证10记录 |
| node --test apps/rooms/tests/*.test.mjs | 0失败 |
| node city/test-all.mjs | 0失败，基线同样跳过7项 |
| corepack pnpm check:docs | docs/evidence/data-records PAIR_STATUS=SYNCHRONIZED |
| 4e71558a9fc44a15a209eef4d711d8d90f90933b 的 CI 36718724624 | gateway-web与android成功 |

## 5. 交给同级任务的集成接口

- EM-001核心契约：合并绑定ConnectorPort、ConnectorDescriptor、ConnectorInstance、CapabilityManifest、AuthStatus；映射connector_kind↔ConnectorDescriptor.connector_kind，capabilities[].methods↔capabilities()，权限结果在适用时↔AUTH_STATUS_SPEC。
- EM-004能力／探测／认证注册表：mediateConnectorPermissions与authorizeInvocation是策略接口，注册表提供policyDecision，不提供授权。
- EM-009健康／重启／恢复：checkHealth/restart/safe_mode为运行时部分；健康压力可请求恢复，但本运行时仅拥有自己的重启预算。
- EM-010队列／DAG／worker池：每连接器一实例，池资源限制归EM-010，max_restarts刻意为连接器范围。
- EM-011／EM-012参考连接器与SDK：连接器为清单＋注册适配器，SDK接口registerAdapter、runAdapterPipeline、createManagedProcessRuntime；真实主机通过端口注入child_process.spawn。
- GAI／RF：不接触传输、设备放置或提供商登录，按工作簿排除。

## 6. Correction主机／Owner待处理项

1. 对抗尝试逃脱隔离：适配器变更共享状态、探测器永不返回、standardize给清单命名其他适配器来源；执行未声明调用；预算耗尽后持续重启循环。
2. 确认D6完全无凭据槽、D11日志满后拒绝追加而非静默丢弃。
3. 确认后续EM是否应拥有真实主机共享进程端口，本任务仅注入未交付真实端口。
4. 确认EM组件工作是否需要演进／过程数据记录（D14）。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```
