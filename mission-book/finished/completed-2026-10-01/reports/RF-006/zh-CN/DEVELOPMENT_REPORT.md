# RF-006 开发报告——安全传输路径管理与中继回退

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = RF-006 (Remote Fabric programme, task 6 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 0b3ba9c (Digital-City main, "claim(RF-006): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T15:46:20Z
CONTROL_REVISION_AT_CLAIM= d6214ed (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-006-secure-transport-path-manager
IMPLEMENTATION_HEAD_SHA  = 251e20bc3af4a2db57253a1a1e5332c976d17d51
BRANCH_CI                = 36739459945 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. 交付物

`contracts/remote-path-manager-v1/` 包含path-manager.mjs（传输适配器端口、按偏好路径选择、认证加密门禁、中继语义、迁移、幂等发送、有界元数据）、index.mjs、7项测试、根tests/remote-path-manager.test.mjs。

| 验收要求 | 测试与证明 |
|---|---|
| 同一Fabric连接／发送接口，测试替换适配器 | `callers use one Fabric surface while the transport implementation is swapped underneath`，同调用代码对仅直连／仅中继集合，描述符键集一致 |
| 优先可用直连，如实回退中继 | `path selection prefers a usable direct route and falls back to relay honestly`，偏好列表、RELAY_FALLBACK/PREFERRED_DIRECT原因、完整尝试轨迹 |
| 丢路径可迁移／重连，不新设备、不重复命令 | `path loss migrates without a new logical device or a duplicated command`，session_ref/device_id不变，logical_device_changed:false、commands_replayed:false，重复command_ref拒绝且零适配器调用 |
| 转发不授予中继授权权 | `a relay forwards opaque payloads and can never authorize a peer`，RELAY_CANNOT_AUTHORIZE并记审计 |
| 加密本地／远端会话拒绝未认证peer | `an unauthenticated or unencrypted path is never adopted, not even on the LAN`，LAN同要求，中继无豁免 |
| 测试中继操作端到端保护的不透明载荷 | relay_mode:OPAQUE_FORWARD、relay_plaintext_access:false，明文PAYLOAD_MUST_BE_PROTECTED拒绝 |
| 故障转移／路径竞态不产生两个权威独占会话 | `one exclusive action can never end up with two authoritative sessions`，竞态connect复用，冲突动作拒绝，authoritative_sessions:1 |
| 规范描述符、有界无秘密元数据 | `path metadata is bounded, secret-free and frozen`，递归扫描空，identifies_device:false |
| rendezvous／中继选择与配对权限分离，中继非永久强制 | 测试2/4/6，TRUST_REQUIRED，策略禁中继则如实NO_USABLE_PATH |
| 业务层不依具体协议／库 | TRANSPORT_ADAPTER_PORT，注入替身，模块无WebRTC/QUIC/WebSocket/WireGuard字符串 |

## 2. 决策日志（问题 → 选项 → 选择 → 原因）

**D1——领取任务。** 新扫描无本机修复、无Mech合资格Correction；Alien持BA-004/005/006、EM-004/005/008/009、GAI-004/005、RF-004/005。前次GAI-005排除General AI，选RF-006。RF-005接受确认明确交path_negotiation给它，RF-007/008/009/010都建于路径管理器，是下一阻塞项。

**D2——传输专属信息位置。** 注入TransportAdapterPort（probe/connect/send/close），按传输类别键；调用者只看规范路径描述符。工作簿禁止Fabric绑定具体协议，替换适配器验收须实现不同实现下调用代码相同，测试以同sessionFor辅助函数运行两集合。

**D3——可采用路径条件。** authenticated===true且encrypted===true，每类都强制，包括LAN与中继；具体失败UNAUTHENTICATED_PATH_REFUSED/PLAINTEXT_PATH_REFUSED记轨迹，继续下一候选。排除项“不信任LAN明文”，本地远端加密会话都拒未认证邻居；附近不能比远端更可信。

**D4——中继回退还是常用路径。** 严格LAN_DIRECT→INTERNET_DIRECT→NAT_TRAVERSAL→RELAY；仅无可用直连才中继，策略可完全禁用。禁止永久强制中继，偏好是契约且测试断言，后续不能静默重排。

**D5——中继能做什么。** 仅转发不透明端到端保护载荷，OPAQUE_FORWARD，每路径relay_plaintext_access:false；plaintext/未保护信封在任何端口调用前拒绝。中继若报告peer_authorized或plaintext_access直接RELAY_CANNOT_AUTHORIZE。RF不变量10不允许中继拥有用户数据／命令语义，声称权限是协议违规而非提示。

**D6——会话与路径。** 会话逻辑且拥有session_ref、device_id、installation_id、exclusive_action_key身份，路径可替换。迁移仅换路径，logical_device_changed:false、path_derived_identity:false、commands_replayed:false。身份是密码学而非网络派生，新IP不能看成新设备。

**D7——竞态。** 每peer一个权威会话；同exclusive_action_key再次connect幂等reused:true、REUSED_SESSION，不同动作同设备SESSION_ALREADY_ACTIVE并命名存活会话，每描述符authoritative_sessions:1。返回已有是重试诚实答复，拒竞争是冲突诚实答复，防故障转移双权威。

**D8——故障转移去重。** send每会话记录command_ref、action_key；重复sent:false、duplicate:true、adapter_called:false，不重发。工作簿要求稳定相关ID与外显幂等重试；迁移后重试不能重复副作用，测试断言新路径端口对重复未调用。

**D9——质量非权限。** 元数据报告类别、直连／中继、延迟、质量及path_quality_grants_permission:false、permission_granted:false，无密钥，identifies_device:false。排除质量授予权限，又需调度／UI有界元数据，故把否定发布为数据。

**D10——信任门禁。** connect要求RF-002 TRUSTED，否则TRUST_REQUIRED，健康路径不隐含信任。所有加入汇一个信任协议，rendezvous／中继选择与配对权限分离，路径可用不是信任／权限。

**D11——最后路径失败。** migrate类型化NO_USABLE_PATH，带degraded:true、connected:false、尝试轨迹；onPathLost如实alternative_available。离线不可用不能变看似成功，测试断言无可用路径不称连接。

**D12——无schema.json。** 与其他组件一致。

## 3. 精确文件

| 文件 | 变更 |
|---|---|
| contracts/remote-path-manager-v1/path-manager.mjs | 新增端口、选择、迁移、发送、元数据 |
| contracts/remote-path-manager-v1/index.mjs | 新增公开接口 |
| contracts/remote-path-manager-v1/tests/conformance.test.mjs | 新增7测试 |
| tests/remote-path-manager.test.mjs | 新增根入口，101→108仓库测试 |

无City/Core、清单、文档变更，合并增量添加。

## 4. 测试汇总、失败与修复

7项，首次两失败，一模块缺陷、一测试构造错误。

1. **缺陷：** sessions()对含适配器对象内部记录structuredClone，函数适配器导致DataCloneError，真实适配器都有函数。改投影为不含适配器描述符；调用者不应从内省获得传输实现，因此同时是泄露与崩溃。
2. **测试错误：** 未认证路径案例仍保留诚实默认NAT_TRAVERSAL/RELAY，模块正确跳两不诚实路径并采用诚实路径，故未拒绝而断言错。改其他类不可用；另中继断言误索引LAN尝试也修。模块两处都正确：跳不诚实、采用诚实。

## 5. 本地检查与CI

| 检查 | 原报告结果 |
|---|---|
| node --test tests/*.test.mjs | 108项，108通过，0失败，101基线＋7新 |
| node --test apps/rooms/tests/*.test.mjs | 69通过，0失败 |
| node city/test-all.mjs | 1801通过，0失败 |
| node scripts/verify-promotion-history.mjs | OK，82ed36933fb4验证10记录 |
| node scripts/check-bilingual.mjs | docs/evidence/data-records PAIR_STATUS=SYNCHRONIZED |
| 251e20bc3af4a2db57253a1a1e5332c976d17d51 的CI 36739459945 | success |

## 6. 同级集成接口

- RF-002配对／信任：connect要求TRUSTED，不建立信任／授权peer，RF-002决定后才有路径。
- RF-005邀请会合：接受确认path_negotiation:RF-006，connect为入口，会合服务不在数据路径。
- RF-001身份：device_id/installation_id迁移不变，不由路径推导，断言path_derived_identity:false。
- RF-007/008注册表与RPC/EVENT/STREAM：send唯一命令接口，稳定相关ID与action key；RF-008在它上建语义，不另传输调用路径。
- RF-009在线／离线／重连：onPathLost报丢失不决定在线状态，alternative_available只作可达性输入，不是信任／权限。
- RF-010策略边界：policy.preference、allow_relay、require_authenticated_encryption为部署策略，由policy()发布。
- EM-007/009：远端重连不建模本地进程重启，EM重启不另开Fabric会话；调用此connect/migrate。
- Owner问题不变：演进动态记录组件阶段事件与否。

## 7. Correction主机待处理项

1. 对抗：适配器报authenticated:true却路径后才显为中继；同会话并发migrate（模块无异步交错，同步替身不能表达，交错调用可能需迁移epoch）；中继第二次connect才翻peer_authorized；重复command_ref却不同action_key。
2. 确认D7同动作竞态复用、不同动作拒绝，D8 command_ref＋action_key去重是意图。
3. 确认真实迁移是否需类似EM-009租约epoch的单调epoch／lease；本模块因无副作用权限刻意未提供。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```
