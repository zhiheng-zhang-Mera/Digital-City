# GAI-002 开发报告：Provider／Model／Account注册表

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = GAI-002 (General AI Gateway programme, task 2 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = ff0368d (Digital-City main, "claim(GAI-002): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T13:28:55Z
CONTROL_REVISION_AT_CLAIM= 621a2dd (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-002-provider-model-account-registry
IMPLEMENTATION_HEAD_SHA  = a6988c1725691a02f84e8ee1b9ca1bc6d1db6a17
BRANCH_CI                = 36722553299 — success (run-level conclusion completed/success on the exact head)
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

原始元数据保留任务、阶段、主机、领取及控制版本、实现仓库／基线／分支／SHA、精确head CI、检查、完成与禁止组件合并状态。

## 1. 交付物

| 文件 | 目的 |
|---|---|
| contracts/general-ai-registry-v1/records.mjs | provider／model／account记录，capability facts、channel readiness、freshness／provenance、严格校验、raw-secret拒 |
| contracts/general-ai-registry-v1/registry.mjs | admission、类型absence、list／query API、SecureHandleStorePort接缝及确定替身 |
| contracts/general-ai-registry-v1/index.mjs | 公共面与保证 |
| contracts/general-ai-registry-v1/tests/conformance.test.mjs | 7项一致性套件 |
| 根tests/general-ai-registry.test.mjs | pnpm test注册 |

| 必需验收项 | 测试 |
|---|---|
| 多account下三身份独立 | 一provider两account，account ref不能撞provider／model，model归一provider |
| stale能力可见为stale／unknown | freshness STALE、level UNKNOWN |
| WEB／API readiness可不同 | 独立回答READY／AUTH_REQUIRED |
| 缺主体类型absence | 不抛，另MODEL_NOT_IN_PROVIDER／ACCOUNT_NOT_IN_PROVIDER |
| canonical拒raw secret／cookie／token | 仅handle |
| synthetic providers、不hard-code Boss身份 | 初始空、完全合成provider |

## 2. 决策日志（问题 → 选项 → 选择 → 理由）

**D1：领取任务。** 新扫描无自己repair、无另一host合格Correction，EM002／003仅Alien可纠，进入未领取Development。GAI最落后1/9、无另一host工作、不同上次EM，选择GAI002；自己也写GAI001契约，本注册表为首consumer。

**D2：跨分支纪律。** GAI001同冻结baseline未合兄弟，不可import／copy；本分支自声明registry contract，匹配WEB／API、三subject refs、handle-only凭据词汇，第5节记接缝。

**D3：未验证capability回答。** 选项缺=unsupported、unknown、探测前unsupported，选UNKNOWN，SUPPORTED／UNSUPPORTED／UNKNOWN都显式。工作簿未知默认unknown／unsupported、不可假定真；把unknown折unsupported会拒从未验model，折supported是假claim。“没人查”与“查过没有”不同，unknown须自值。

**D4：stale回答。** 选记忆值加stale flag或UNKNOWN，选UNKNOWN带freshness STALE。验收stale／unknown，仅读level者不能按旧值行动，旁报freshness解释未知；channel readiness同规则。

**D5：凭据／browser profile位置。** 选account record、registry handle、neutral SecureHandleStorePort存值只留返回handle，选第三；无port构造拒。禁GAI专属重复Engineering存储engine，注入port模块无storage，替身hermetic。resolution test断言bytes从port非record／snapshot。

**D6：无hard-coded如何可测。** fresh registry list空、snapshot hard_coded_identities:0，再注册两不同形synthetic provider及channel／facts。无built-in catalog才有意义，先断空是诚实claim。

**D7：lookup类型absence非exception。** getProvider／Model／Account回found:false／code／detail；upsertModel／Account引用未注册provider admission抛typed。缺subject普通UI查询，孤儿注册caller bug；全throw强迫包每read，全return隐藏编程错误。

**D8：三subject channel支持。** provider／model／account独立declare entries、逐subject回答readiness。工作簿独立支持，单channel model真实，GAI005路由需知。

**D9：无schema.json。** runtime／discovery代码验，同BA002 D2、BA003 D2、EM003 D10。

**D10：PROCESS_DATA_POLICY evolution inbox。** 未用，同其他报告；discovery仍out scope，登录／执行／选择provider明确排除且公开flags断无。

## 3. 测试汇总

7项全过：多account身份与collision拒；freshness、stale unknown能力及来源；WEB／API独立、undeclared未知、stale readiness未知、channel filter；缺subject typed absence、MODEL_NOT_IN_PROVIDER／ACCOUNT_NOT_IN_PROVIDER、孤儿model admission拒；三record kind rawsecret拒、handle仅port存解、revoked后拒；空registry全synthetic填、capability／channel filter查询；strict version、空／重复channel、坏readiness、未知fact、坏support、unknown field、坏instant／sourcekind、零context window、坏account status、非channel handle key。

开发说明：首轮自己fixture失败，model只WEB却按API查；模块正确undeclared UNKNOWN，修fixture未放规则。

## 4. 本地检查与CI

| 检查 | 结果 |
|---|---|
| corepack pnpm test | 108项、108过、0败（101＋7） |
| node scripts/verify-promotion-history.mjs | OK，82ed36933fb4上10条 |
| node --test apps/rooms/tests/*.test.mjs | 0败 |
| node city/test-all.mjs | 0败 |
| corepack pnpm check:docs | docs／evidence／data-records PAIR_STATUS = SYNCHRONIZED |
| GitHub CI36722553299，a6988c1725691a02f84e8ee1b9ca1bc6d1db6a17 | success |

## 5. 兄弟任务集成接缝

- GAI001：合并绑ProviderDescriptor／ModelDescriptor／ProviderAccount／CapabilityManifest／AuthStatus，WEB／API及reference-only词汇已匹配。
- GAI003／004：消费readiness／capability，均freshness；UNKNOWN为verify or ask，非available。
- GAI005：listProviders({channel})／listModels({providerRef,fact,level,channel})查询，registry不choose。
- GAI007：remote endpoint provider／model通过同registry，非二catalog。
- GAI008：freshness／observed_at／source输入，probe update record非in-place改facts。
- neutral00 Foundation SecureHandleStorePort：唯一storage且必须注入，D5。
- EM008：必须同neutral port；此分支示范domain无需自凭据engine。

## 6. Correction主机／Owner开放项

1. 尝试stale读current：恰observed_at＋ttl、ttl_ms:0、不可解析instant；handle值漏record／snapshot；account通过另subject kind alias另一provider。
2. 确认D3／D4未验和stale都UNKNOWN路由语义。
3. account事实override还是intersect provider？此处逐subject独立，组合留GAI005。
4. evolution-feed仍待Owner。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```

原始结论保留开发完成、仅Alien纠正、GAI Gateway项目合并前禁止合并。
