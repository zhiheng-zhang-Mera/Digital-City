# RF-005 开发报告——远端邀请／会面码／深链接会合

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = RF-005 (Remote Fabric programme, task 5 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = cd34ed2 (Digital-City main, "claim(RF-005): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T15:29:41Z
CONTROL_REVISION_AT_CLAIM= 43f2f5a (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-005-remote-invite-rendezvous
IMPLEMENTATION_HEAD_SHA  = 52646ac30c23ec33d70c4a787ac519be19969a89
BRANCH_CI                = 36737404307 — success
LOCAL_CHECK_SUMMARY      = 107/107 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. 交付物

contracts/remote-invite-rendezvous-v1/包含invite-rendezvous.mjs：邀请／会合对象、四表示、定位符解析、预览、兑换、确认、撤销、限流、通用失败；另index.mjs、6测试、根tests/remote-invite-rendezvous.test.mjs。

| 验收要求 | 测试与证明 |
|---|---|
| 一邀请呈代码／深链接／Web链接／QR，不产生独立信任记录 | `one invite renders as code, deep link, web link and QR payload without creating trust records`，separate_trust_records:0、creates_trust:false，四者还原同码，大小写／空格／易混字符容错 |
| 过期／取消／已用安全失败 | `expired, cancelled and already-used invites fail with one indistinguishable generic error` |
| 猜测枚举不泄设备ID存在性 | 同测试畸形／过期字节相同；`guessing is rate-limited and never reveals whether a device exists`，各探针相同失败、逐客户429和retry-after，失败／预览无host身份 |
| 输入到配对预览，确认前不能调能力 | `entering an invite reaches pairing preview but cannot invoke capabilities before confirmation`，CONFIRMATION_REQUIRED、capabilities_invocable:false，拒绝确认不授权、不消费 |
| 信任后会合token不足以重连 | `an invite is a one-time rendezvous, and after trust it can no longer reconnect anything`，RENDEZVOUS_IS_NOT_RECONNECT_AUTHORITY，单用USED，接受后RENDEZVOUS_IS_NOT_A_CAPABILITY_PATH |
| 继续共用路径管理，不耦特定中继 | `the rendezvous service stays independent of the eventual data path`，接受结果无transport/session/relay/IP，交RF-006协路径、RF-002换密钥 |
| 单版本对象，高熵ID、短码、过期、次数、取消 | 测试1格式／校验，2过期／取消，5次数／max_uses／撤销 |
| 公码链接仅定位，不永久认证／能力授权 | 测试1/4/6，locator_only、grants_permission:false、is_authentication:false、reconnect_authority:false，表示无token/key/link秘密 |
| 防枚举通用错误，与最终数据路径独立 | 测试2/3/6 |

## 2. 决策日志（问题 → 选项 → 选择 → 原因）

**D1——任务。** 新扫描无本机修复、Mech无合资格Correction；Alien持BA-004/005/006、EM-004/008/009、GAI-004、RF-004。前次EM-009排除EM，选RF-005：RF-001..004已绿，它使基础可从互联网抵达的入门入口，也解下一RF-006路径管理。

**D2——一对象四视图还是四对象。** 单会合记录，由不变invite_id/rendezvous_ref/code/expires_at计算四表示，separate_trust_records:0。验收禁独立信任记录，派生视图不能分歧，四表示测试同码。

**D3——表示含什么。** 仅人用码、版本及QR来源标记，无token、key、设备身份。排除URL私钥／永久bearer，测试链接无token|secret|key=|bearer。

**D4——字母表与校验字符。** Crockford base32排I/L/O/U，4-4-1分组，载荷算校验；输入统一大小写、空格、分隔，I/L→1、O→0。类Zoom码由人抄屏须容错且检错；校验本地，坏校验是格式错非查询，不成为存在性预言机。

**D5——失败。** 未知、过期、取消、已用、过用、畸形都RENDEZVOUS_UNAVAILABLE 404，code/detail/status/fields字节同。仅限流可分辨且检查码前应用。仅措辞谨慎不足防枚举，测试序列化对象相等，不只抽字段；盲码限流使有效／无效同节流。

**D6——披露host身份。** 接受确认前绝不披露。预览／票据host_identity_disclosed:false、host_device_ref:null；接受确认才首次唯一显示。身份密码学非定位派生，输入邀请不授权。测试host字符串不在预览、票据、确认前拒绝、任何通用失败。

**D7——兑换消费吗。** 不，只有接受确认消费次数；拒绝保持ACTIVE可重用。guest兑换不代表host同意，拒绝／放弃就烧邀请会使误点毁合法会合。测试拒绝→可用→接受→USED。

**D8——多次。** 默认一；max_uses>1须调用者allow_multi_use和部署策略都允许，上限max_uses_cap:8，达次数仍USED。两层防单调用者扩大策略。

**D9——确认权。** 仅host_device_ref可确认／取消，他者NOT_THE_HOST 403。用途B请求A，持码就可确认会使码成为授权，工作簿禁止。

**D10——随机性。** 熵源必需注入ENTROPY_REQUIRED，引用／码从它派生，模块不调用随机API。与注入端口、无环境行为一致，测试确定。仍强制唯一，碰码重生成，源不能给新码类型化拒绝，发现第4节替身问题。

**D11——会合非会话／路径／能力路由。** reconnectViaInvite始终拒绝；invokeCapability确认前CONFIRMATION_REQUIRED、确认后RENDEZVOUS_IS_NOT_A_CAPABILITY_PATH，接受结果无transport/session/relay。传输隐藏可替换、会话非任务权限；交接明确RF-002密钥交换、RF-006路径协商。

**D12——无schema.json。** 与其他组件一致。

## 3. 精确文件

| 文件 | 变更 |
|---|---|
| contracts/remote-invite-rendezvous-v1/invite-rendezvous.mjs | 新对象、表示、解析、预览／兑换／确认／撤销、节流 |
| contracts/remote-invite-rendezvous-v1/index.mjs | 新公开接口 |
| contracts/remote-invite-rendezvous-v1/tests/conformance.test.mjs | 新6测试 |
| tests/remote-invite-rendezvous.test.mjs | 新根入口，101→107 |

无City/Core、清单、文档修改，合并增量。

## 4. 测试汇总、失败与修复

6项，首次五失败，一模块缺陷，四期望／替身问题。

1. **缺陷：** HTTPS Web链接不能还原，locateFromUrl仅懂?c=，Web用/join/<code>。现两者都接，生成链接始终解析，否则会是死会合。
2. **替身：** 确定熵每次同字节，第二邀请撞保护拒绝。每次盐混入模拟真实源；保留正确碰撞保护。
3. **辅助函数：** 失败捕获丢额外字段，retry_after_ms成undefined。修传递，模块正确。
4. **期望：** 直接兑换深链接却要求PREVIEWED事件。改REDEEMED并断言不需预览，深链接完整定位符是预期行为。
5. **期望：** 限流断言自指恒真。换真实第二客户仍通用失败，证明逐客户且盲码。

## 5. 本地检查与CI

| 检查 | 原报告结果 |
|---|---|
| node --test tests/*.test.mjs | 107项全过0失败（101＋6） |
| node --test apps/rooms/tests/*.test.mjs | 69过0失败 |
| node city/test-all.mjs | 1801过0失败 |
| node scripts/verify-promotion-history.mjs | OK，82ed36933fb4验证10记录 |
| node scripts/check-bilingual.mjs | docs/evidence/data-records PAIR_STATUS=SYNCHRONIZED |
| 52646ac30c23ec33d70c4a787ac519be19969a89 的CI 36737404307 | success |

## 6. 同级接口

- RF-002统一配对：接受确认交pairwise_key_exchange:RF-002、entry_point:DISCOVERY_REMOTE_INVITE；不建会话／信任记录，RF-002唯一信任权限，进入前host须接受。
- RF-006路径：path_negotiation:RF-006，接受无传输／中继／地址，path_independent:true、relay_coupled:false，不变中继专属入口。
- RF-001/003/004身份／LAN／蓝牙：同级bootstrap汇同RF-002状态机；host_device_ref是RF-001身份，蓝牙载荷／邀请码均定位、不授权。
- RF-007/008注册表／RPC/EVENT/STREAM：确认前后能力都拒绝，调用应经版本地址非票据；未来若要会合范围信任前探测须自加契约。
- RF-009在线／重连：invite重连始终拒绝，应看当前信任，邀请也非在线状态。
- RF-010政策：rate_limit/default_ttl_ms/max_ttl_ms/allow_multi_use/max_uses_cap部署政策，policy()公开归边界拥有。
- Owner问题不变：演进动态记录组件阶段与否。

## 7. Correction待项

1. 对抗：恶意熵强制碰码；撤邀请后票据重放；preview计限流，攻击者共享client ref节流合法guest；故意错抄校验字符碰撞概率；接受后revoke是否也失效票据。
2. 确认D7仅接受消费、D9仅host确认／取消。
3. 确认通用失败是否加支持相关ID，须可证明非存在性预言机；实现刻意未加。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```
