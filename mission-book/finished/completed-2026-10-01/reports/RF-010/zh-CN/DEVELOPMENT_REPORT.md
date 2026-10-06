# RF-010 开发报告：Fabric策略边界与公共API

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = RF-010 (Remote Fabric programme, task 10 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = d8cc447 (Digital-City main, "claim(RF-010): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T17:06:40Z
CONTROL_REVISION_AT_CLAIM= 677890d (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-010-fabric-policy-public-api
IMPLEMENTATION_HEAD_SHA  = 8739185479e1185145ef5ec6e02a76aaf15c3d6e
BRANCH_CI                = 36749030367 — success
LOCAL_CHECK_SUMMARY      = 107/107 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

原始元数据保留task、host、claim、control、repo、baseline、branch／head／CI、本地107／69／1801、complete与禁merge。

**计划说明：** 最后RF任务，RF001…010都开发后组件池完成；所有分支过两阶段／两host之前merge workbook仍阻断，Alien Corrections正在进行。

## 1. 交付物

contracts/remote-fabric-public-api-v1/的fabric-api.mjs含冻结public ports、transport adapter、policy intersection、foreground-sensitive hooks、identity／task／assistant-state边界、seams；另index.mjs、6suite、根tests/remote-fabric-public-api.test.mjs。

| 要求 | 测试 |
|---|---|
| mock与真实／local同public API | 同caller routine、normalized结果同、transport hints不漏 |
| 上层resolve／invoke无需知LAN／Bluetooth／relay | transport_class HIDDEN_FROM_CALLER、specifics:false、boundary projection无transport字符串 |
| valid authenticated session下policy denial仍拒 | denied_despite_valid_session:true、零transport call |
| advertised无effective permission不execute | permission:false、未广告／wrong version拒 |
| handoff／foreground不隐转ownership／permission | disconnect task_ownership_changed:false、fabric_owns_task_ownership:false、boundary statements |
| Owner/User∩Caller/Assistant∩DeviceCapability∩TaskActionGrant | 四axis各强制并denied_axes命名 |
| camera／microphone／screen foreground hooks | FOREGROUND_CONFLICT命holder、USER_CONFIRMATION_REQUIRED、holder-only release |
| exclusive／shared／background不选assistant／task owner | fabric_decides_ownership:false |
| Action/Room、Butler bus、GAI endpoint、Engineering connector适配边界 | ADAPTER_BOUNDARIES四者各说明不拥有内容 |
| canonical device无竞争namespace | COMPETING_IDENTITY_NAMESPACE、REMOTE_FABRIC_DEVICE |
| 无City graph／Assistant durable存储 | 两typed拒并命owning subsystem |
| transport互换不改API | 测1 |
| RF001…009与BA003／008／009 seams不merge sibling | 12seams、sibling_branches_imported:0 |

## 2. 决策日志

**D1：领取。** 新scan无己repair／Mech correction；Alien持BA004／005／006／008、EM004／005／008／009／010、GAI003…008、RF004…008，RF005中。EM010后排Engineering选RF010，关闭pool且所有programme integration面向此boundary，RF契约新鲜时值得完成。

**D2：公共是什么。** 工作簿命11ports公开PUBLIC_PORTS且suite断，加port即version change。冻结必须可枚举可查，另apiVersion和adapter descriptor供runtime compat。

**D3：transport在哪里。** 一个注入adapter同discover／connect／invoke／subscribe／openStream／disconnect，normalize不带specifics；mock与local故意返transport_hint，test公共结果不含。需leak test非仅interface assertion。

**D4：permission来源。** 唯四axis交集，intersectPolicy全评，session／presence／trusted device／foreground_is_permission都false、permission_is_intersectional:true。invariant11与outscope禁implicit；存在session拒另denied_despite_valid_session:true供审查可见。

**D5：ad与permission。** listCapabilities availability、permission:false／advertisement_is_permission:false；invoke按未广告、wrong version无coercion、policy-denied顺序拒。版本先防把不可能运行call误报policy拒。

**D6：foreground资源。** CAMERA／MICROPHONE／SCREEN须foreground，前两exclusive；二action命holder冲突，cap flag user confirmation返回USER_CONFIRMATION_REQUIRED，release仅holder、unheld no-op。device-local rule非选owner，fabric_decides_ownership:false，merge BA006／008须分。

**D7：identity／state／ownership。** resolveDevice拒competing_namespace，storeTaskGraph／AssistantState总拒；disconnect ownership unchanged／trust_revoked:false。revokeDevice关session／stream、valid session也无用。无competing device／City graph／Assistant state，断开非撤信任，防silent drop。

**D8：seams。** 十二(task,seam,consumed_as)数据，imported0、depends_on_unfinished:false。工作簿要求record非import，禁借sibling让tests过。明确consumption如RF009 getPresence仅reachability、BA009 policy.evaluate交集，供final workbook。

**D9：无schema.json。** 同组件。

## 3. 精确文件

| 文件 | 变化 |
|---|---|
| contracts/remote-fabric-public-api-v1/fabric-api.mjs | 新ports／adapter／intersection／foreground／boundaries／seams |
| contracts/remote-fabric-public-api-v1/index.mjs | 新public |
| contracts/remote-fabric-public-api-v1/tests/conformance.test.mjs | 新6 |
| tests/remote-fabric-public-api.test.mjs | root新101→107 |

无City／Core／manifest／doc，additive。

## 4. 测试失败与修复

6测，首三fail全test，**无module defect**：

1. helper未return boundary，leak读undefined，改api.boundary。
2. double所有device（未发现也）ONLINE，unknown honesty失败；double改device-aware，module只是正确传adapter。
3. journal期待未invoke实例有INVOKED；先connect／invoke再assert，也覆盖journal。

## 5. 检查与CI

| 检查 | 结果 |
|---|---|
| node --test tests/*.test.mjs | 107全过0败（101＋6） |
| node --test apps/rooms/tests/*.test.mjs | 69过0败 |
| node city/test-all.mjs | 1801过0败 |
| node scripts/verify-promotion-history.mjs | 82ed36933fb4上10 OK |
| node scripts/check-bilingual.mjs | docs／evidence／data-records SYNCHRONIZED |
| CI36749030367，8739185479e1185145ef5ec6e02a76aaf15c3d6e | success |

## 6. 集成接缝

- 全RF001…009：seam table经ports消费不import，merge端到端验12seams，含仍欠真实two-device proof，非重新推导。
- BA003／008／009：binding／bus／duty三seams，policy.evaluate交集，此module不选assistant owner。
- GAI002…009：endpoint listCapabilities／invoke、shared permission gate，但GAI consent／budget独立不可替。
- EM004／007／010：resolveDevice／listCapabilities／openStream，selection留EM010，boundary cap-based。
- City core／Rooms：storeTaskGraph设计拒，core继续owner，Action／Room边界列可消费ports。
- Owner evolution问题不变。

## 7. Correction开放项

1. adapter connect给revoked session（preconnect验但transport-initiated未覆盖）；invoke resource_class非cap实际；两openStream竞exclusive foreground，现stream绕hook；policy throw；非exclusive不同caller release。
2. 确认唯四交集、负flags及device-local enforce但无ownership决定。
3. stream／foreground最可能真实弱点，openStream验policy不hook，camera／microphone／screen wording可能要求。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```

原始结论开发完成、仅Alien纠、Remote合并前禁。
