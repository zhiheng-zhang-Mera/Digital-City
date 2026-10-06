# EM-008 修正报告——凭据引用与持久配置／会话

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = EM-008 (Engineering Manager programme, task 8 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-008-credential-profile-session.md
CLAIM_COMMIT         = c7d6cd9 (Digital-City main, claim of EM-008 Correction by Alien)
CLAIMED_AT           = 2026-10-01T02:42:14Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 963b4f2e47fbb8715d1cf98cf90baee0f79a9c5d
DEVELOPMENT_CI       = 36734070041-success
CORRECTION_BRANCH    = engineering-manager/EM-008-credential-profile-session
CORRECTION_HEAD_SHA  = 4e1b57f9a503458775a004b7bcc32e175e0ca463
BRANCH_CI            = 36808238886-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-008 26 pass (8 author + 18 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. 托管CI

```text
development head    963b4f2 (Mech)   run 36734070041   success
first-pass head     177deea (Alien)  run 36807612493   success   ← superseded by the review in §5
corrected head      4e1b57f (Alien)  run 36808238886   gateway-web success / android success
```

两修正head都真实执行托管V0.2 checks，首轮后被独立审查取代。

## 2. 独立方法

archive冻结 `D:\A-Utopia\.runtime\evidence\mission-book\EM-008\frozen-963b4f2\`，审前四blob Git验证。

```text
contracts/engineering-auth-profile-v1/auth-profile.mjs                MATCH b007e659affd741f23b0f92bc11701aa5eb5bb2c
contracts/engineering-auth-profile-v1/index.mjs                       MATCH d9b7f9911a4d5efc9cf4f2e713726048ab0ea5f8
contracts/engineering-auth-profile-v1/tests/conformance.test.mjs      MATCH 5ff732ae03681c777f89b542b494c93a87fca811
tests/engineering-auth-profile.test.mjs                              MATCH bcc72f8d1e7d722832e8cb5516181fa1f89883a1
```

独立只冻结、先工作簿，重点错字段／嵌套／大小写／store错误回显／clone／日志快照秘密。16探针、16复现、高置信、全程SHA稳定；自probe-alien-em008十机制，加false references_only十一。

八重叠，非重叠：合法形状秘密、检测脱敏不对称、snapshot隐藏键、部分restore、旧桥劫foreign default、mode访问器、回卷新鲜、假设revoke、无声expiry携带。原文指第二轮第5节但实际标题第4节，保留主题，各有开发失败回归。

## 3. 第一轮10机制

类别1自有键原型、2字面guard、3调用者限制、4权限主体、5拒前变更、6时刻、7验证未读、8硬编码、9递归clone、10丢重读、11可变幂等、12访问器TOCTOU。

| # | 机制 | 类别 | 修复 | 回归 |
|---|---|---|---|---|
| 1 | bindSecret任文本handle，sk-live原key入credential_ref仍references_only:true | 4、7、8 | 秘密ref PLAINTEXT_REFUSED，references_only测实际返回记录 | 有 |
| 2 | store putHandle回原value作handle unchecked泄露 | 8、12 | 回ref先形状，PLAINTEXT_REFUSED不被吞store失败 | 有 |
| 3 | 不可能expiry NaN比较false READY/fresh true | 6 | 全日历往返、NaN安全 | 有 |
| 4 | restore缺connector、数字handle、对象account、小数version、不可能expiry也接 | 1、6、10 | 声明entry spec | 有 |
| 5 | required:'yes'静默false，NEEDS_USER降MISSING | 2 | 必须布尔 | 有 |
| 6 | in/Object.keys/泛plain漏原型隐藏 | 1、12 | Object.hasOwn/Reflect.ownKeys/plain原型 | 有 |
| 7 | 循环值scan/redact/freeze爆RangeError，拒都不能运行 | 9 | 三者WeakSet，脱敏循环标记 | 有 |
| 8 | revoke生命周期写后投影总覆盖不可见 | 7 | revoked_at/reason投影，rebind清 | 有 |
| 9 | 轮换弃旧handle仍ACTIVE可解析 | 11 | 本层创建旧handle先撤再记新 | 有 |
| 10 | secret_value与handle_ref同给静默丢秘密 | 2、10 | 歧义拒绝 | 有 |

## 4. 第二轮独立live发现

| # | 机制 | 类别 | 修复 | 回归 |
|---|---|---|---|---|
| 11 | scan只shape失败才跑，合法profile_id/connector_kind/account_ref秘密入规范、attention问题、snapshot；最实质首轮漏仅去假主张 | 2、8 | 每profile输入扫；bind仅secret_value排，因它应送store | 有 |
| 12 | looksLikeSecret hyphen可选ghp_/AKIA/sk_live却redact只强hyphen，恶store消息泄 | 8 | 共substring形状，秘密形状全值脱敏 | 有 |
| 13 | scan仅可枚举，snapshot隐藏account/handle过后存 | 1、8 | 全own keys，symbol不可准且值仍扫，entry spec | 有 |
| 14 | restore边验边装，后坏前已活无日志，也覆live ID | 5 | 全验再装，live冲突DUPLICATE_PROFILE | 有 |
| 15 | legacy劫别connector/mode profile:default，PERSISTENT使API key当别session导出，static descriptor矛盾 | 4、8 | 冲突default拒，descriptor从实际写记录 | 有 |
| 16 | mode getter一验二读可API_KEY存EVIL | 12 | 声明字段一次snapshot，验证存同值 | 有 |
| 17 | authStatusFor过去at过期读READY无attention | 6 | 调用时刻不得早于本层clock | 有 |
| 18 | store失败／无revoke吞，清ref报MISSING却秘密仍live | 3、7 | handle_released/store_revoke_attempted如实，本权限仍移除不假store | 有 |
| 19 | rebind保陈旧expiry，新凭据立即EXPIRED无区别 | 12 | expiry_carried_over可见，明确null可清，保失败关闭 | 有 |

## 5. 本地汇总

```text
corrected module                    26 tests / 26 pass / 0 fail
development head 963b4f2            26 tests /  8 pass / 18 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

作者八不变全过。证据根EM-008 .runtime：frozen、prefix-test开发跑修套件、gate-EM-008、自probe、独立FINDINGS与probe-run-output。

## 6. 边界

| 边界 | 理由 |
|---|---|
| 句柄归属不可验证，B可绑A ref，撤B会撤它，D10 | 中立store拥有，禁止第二store、无归属API。handle_bound_by_layer区自身／调用者，轮换仅撤自身写。 |
| 可解析OAUTH/DEVICE_CODE默认READY非NEEDS_USER，D11半 | 作者:184无handle MISSING，有即取得凭据，bind清flag是刚完成流程；非布尔清flag危险已修#5。 |
| unspecified rebind expiry继续旧，D14 | 明确过期不能READY，未说期限就无期限会使旧凭据就绪；携带现可见／null清。 |
| 无标记秘密不可识别 | 无key／prefix任意密码在store文本可能原样日志；本secret_value仅送store无记录，修自身所有可检秘密路径，启发式不识任意串，store拥有错误文本。 |
| 失败resolve投影写日志、反复读长 | 验收失败证据、作者status/reason依，记录读副作用不删。 |
| INVALID_MODE/PERSISTENCE/HANDLE_REQUIRED/NOT_RESOLVABLE/JOB_REF_REQUIRED不抛，REFRESHING/UNKNOWN不发 | 用其他声明code与MISSING/HANDLE_UNRESOLVABLE如实，覆盖无行为后果。 |
| 不读process.env，仅固定legacy键 | LEGACY_SOURCES声明非环境读，工作簿范围。 |

## 7. 披露

- 首177deea/36807612493独审返前已推绿，未标完成；live发现二轮。自十漏最实质合法字段秘密#11，正需独立。
- 新树根/city冻结锁安装，否则YAML_PARSER_UNAVAILABLE，环境接口非代码结果。
- 隐藏api_key回归期INVALID_PROFILE，全own后更精确PLAINTEXT_REFUSED命名字段，改测试并另自有未声明键INVALID_PROFILE。
- 首测试bind+revoke版本误计，模块正确PROFILE_VERSION_CONFLICT，测试错。
- 计费拒不作代码失败，已启动托管全真实步骤。
