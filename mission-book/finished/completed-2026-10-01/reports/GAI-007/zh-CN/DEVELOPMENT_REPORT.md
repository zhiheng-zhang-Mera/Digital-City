# GAI-007 开发报告——设备感知远端执行与结果返回

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = GAI-007 (General AI Gateway programme, task 7 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 0b55626 (Digital-City main, "claim(GAI-007): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T16:22:40Z
CONTROL_REVISION_AT_CLAIM= 1dd719b (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-007-device-aware-remote-execution
IMPLEMENTATION_HEAD_SHA  = 99858b90e1470e7401d8ffd9cf52ade37d2c4381
BRANCH_CI                = 36743516874 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. 交付物

contracts/general-ai-remote-execution-v1/的remote-execution.mjs提供RemoteExecutionPort facade、端点排序、DeviceSwitchProposal与V1确认、单规范派发、相关事件流、授权设备取消、注意事项、语义输入暂存；另index、7测试、根tests/general-ai-remote-execution.test.mjs。

| 要求 | 测试与证明 |
|---|---|
| 远端派发后交互设备不变 | 健康当前设备优先及V1确认测试，每结果interaction_device_unchanged:true，交互laptop、执行desktop |
| 执行host无重复Action | `exactly one canonical Action exists on the execution host…`，第二duplicate:true/dispatched:false，actions_created_on_execution_host:1，一端口调用 |
| 进度／部分／最终／错误同actionId | 同测试每event correlated_action_id，投影单ID数组 |
| 取消及晚／重复事件协调 | `remote cancel works from any authorized device and reconciles late results`，幂等、LATE_EVENT_AFTER_TERMINAL协调、final_ref:null |
| 陈旧离线不能健康选 | `endpoints are ranked from metadata only, and stale or offline ones are never healthy`，STALE_ENDPOINT/OFFLINE/OVERLOADED/NO_SESSION排，空NO_HEALTHY_ENDPOINT |
| V1确认前不执行 | `no execution begins before the V1 device-switch confirmation`，CONFIRMATION_REQUIRED、dispatch_performed:false、零端口，否决PROPOSAL_NOT_CONFIRMED |
| ATTENTION_REQUIRED回交互设备 | `hardware-bound authentication surfaces as ATTENTION_REQUIRED, never as false success`，delivered_to交互、execution_started:false、host动作0 |
| facade非另信任／传输／在线／身份 | 描述facade_over:REMOTE_FABRIC_PUBLIC_API、两implements旗false，无导入 |
| 健康当前Web优先，已知候选排序无探针请求 | 测试1/2 LOCAL_WEB/CURRENT_DEVICE_HEALTHY，ai_requests_launched/probes_sent0，排序零dispatch |
| 单Action状态／事件／注意回界面 | 测试4/6 statusFor、raiseAttention |
| InputBundle引用与清理语义暂存 | `semantic input staging carries an explicit cleanup policy…`，STAGING_POLICY_REQUIRED、每引用cleanup_required、canonical_local_path:null |
| 通常语义RPC/event/stream非强制桌面视频 | dispatch/status remote_desktop_stream:false、semantic_transport:true，端口semantic_rpc:true |

## 2. 决策日志

**D1——任务。** 新扫描无本机修复、Mech无Correction，Alien持BA-004/005/006/008、EM-004/005/008/009、GAI-003…006、RF-004…007，GAI-003刚绿。前RF-007排RF，选GAI-007消费刚交路径／注册，最后界面前GAI阶段。

**D2——远端边界。** 注入listEndpoints/dispatch/cancel facade包已接受Fabric API，显无信任／传输／在线／身份。唯一外调用防第二传输，真实API接受前替身，真实两设备证明仍项目门禁第7节。

**D3——本地何时保留。** 当前设备在线、Web-ready、新鲜、不超载、有session则LOCAL_WEB无需确认，避免无益打断；测试本地无dispatch。

**D4——候选排序。** 在线、Web、会话、输入本地性、负载、新鲜加权，值／权重／贡献可见，分数后device_ref排序。不可探针AI请求，拆解可审为何胜。OFFLINE/STALE_ENDPOINT/NOT_WEB_READY/OVERLOADED/NO_SESSION/INPUT_NOT_LOCAL逐候选类型排。

**D5——陈旧边界。** 缺或超max_freshness_ms排STALE_ENDPOINT，离线主因仅OFFLINE不叠次因。未知新鲜失败关闭，单主因诚实不噪；原双因期望修。

**D6——确认与否决。** 否决PROPOSAL_NOT_CONFIRMED，未问才CONFIRMATION_REQUIRED。初先“不确认”使已拒像未问，UI错；改顺序。

**D7——单规范ID。** 接Action action_id原样转，同ID二dispatch吸收，不再端口，dispatched:false/duplicate:true/host count1。测试直接host计数非推断。

**D8——事件／晚到。** 每event相关ID，连续seq否则EVENT_OUT_OF_ORDER，PARTIAL非终态，终态后reconciled_events记LATE_EVENT_AFTER_TERMINAL而首结果保持。不静默丢，保未要提供商输出证据。

**D9——谁取消。** viewer set任何设备：交互及派发执行、Action可扩，不只交互；幂等、interaction_device_is_only_cancel_authority:false。未授权NOT_AUTHORIZED_TO_CANCEL，终态取消LATE_EVENT_AFTER_TERMINAL。

**D10——硬件认证。** endpoint hardware_auth_required则dispatched:false/attention_required:true/execution_started:false，AttentionRequest交互、user_must_operate_execution_host:false，不让用户去host，端口零派。

**D11——暂存。** bundle_ref/staging_policy/可选cleanup_by/canonical_local_path:null，缺明确政策STAGING_POLICY_REQUIRED，不能默认留那。

**D12——无schema.json。** 同其他组件。

## 3. 精确文件

| 文件 | 变更 |
|---|---|
| contracts/general-ai-remote-execution-v1/remote-execution.mjs | 新facade、排序、提案确认、派发、事件、取消、注意、暂存 |
| contracts/general-ai-remote-execution-v1/index.mjs | 新公开接口 |
| contracts/general-ai-remote-execution-v1/tests/conformance.test.mjs | 新7测试 |
| tests/general-ai-remote-execution.test.mjs | 新入口101→108 |

无City/Core、清单、文档，增量合并。

## 4. 测试与修复

7项首次三失败，一缺陷两期望。

1. 否决误同未问，重排PROPOSAL_NOT_CONFIRMED，D6。
2. 离线期OFFLINE+NOT_WEB_READY，实际仅主OFFLINE正确，修D5。
3. 成功publish误failure包，非法event kind期UNKNOWN_ACTION而正确INVALID_REQUEST区畸形／未知；修两，并晚事件后幂等cancel断言duplicate返回非throw。

## 5. 本地与CI

| 检查 | 原结果 |
|---|---|
| node --test tests/*.test.mjs | 108过0败（101＋7） |
| node --test apps/rooms/tests/*.test.mjs | 69过0败 |
| node city/test-all.mjs | 1801过0败 |
| node scripts/verify-promotion-history.mjs | OK，82ed36933fb4验证10 |
| node scripts/check-bilingual.mjs | docs/evidence/data-records PAIR_STATUS=SYNCHRONIZED |
| 99858b90e1470e7401d8ffd9cf52ade37d2c4381 的CI 36743516874 | success |

## 6. 集成接口

- RF-006/007：facade解析端点经路径会话，adapter_ref来自capability ticket，迁移action_id/endpoint_ref不变，不另传输。
- RF-008/009：recordEvent消费类型流／可达，不能在线复活陈旧，重连重提案非恢复旧票。
- GAI-004/005/006：远端API仍同意预算，同对话turn；分流确认与V1设备确认独立须都满足。
- BA-006/008：独占先目标租约，action_id任务图引用，防双设备执行。
- EM-007：同交互／执行分离，合并共享单ID相关事件契约。
- GAI-009：statusFor给Ask/Do，attention交互必须显。
- 项目门禁本未满足：真实两设备经accepted RF API由合并做；此仅确定facade语义，不暗示真实传输。
- Owner问题不变：演进组件事件与否。

## 7. Correction待项

1. 对抗web_ready＋hardware_auth_required本地优先可能漏注意，现本地无check，确认；确认后端点消失UNKNOWN_ENDPOINT已覆盖；同ID双派发竞态同步不可交错；协调后复用seq；协调final后cancel。
2. 确认D3本地免确认、D9任viewer取消V1。
3. 本地硬件认证唯一可能不显注意，或需同远端检查，明确确认。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```
