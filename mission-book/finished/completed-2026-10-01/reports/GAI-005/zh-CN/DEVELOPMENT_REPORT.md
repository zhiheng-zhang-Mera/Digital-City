# GAI-005 开发报告：确定性与JEV分诊路由

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = GAI-005 (General AI Gateway programme, task 5 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 1d7fb4e (Digital-City main, "claim(GAI-005): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T15:38:12Z
CONTROL_REVISION_AT_CLAIM= 7d95799 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = general-ai/GAI-005-triage-jev-routing
IMPLEMENTATION_HEAD_SHA  = 48169de998a913f495fbca1dac5bd37d79e57e19
BRANCH_CI                = 36738383466 — success
LOCAL_CHECK_SUMMARY      = 107/107 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

原始元数据保留任务、主机、claim／控制版本、repo／baseline／branch／SHA／CI、107／69／1801检查及完成／禁merge。

## 1. 交付物

contracts/general-ai-triage-routing-v1/含triage-routing.mjs（deterministic fast path、optional JEV port、normalization、gateway policy、engineering handoff、confirmation、audit）、index.mjs、6suite、根tests/general-ai-triage-routing.test.mjs。

| 必需验收项 | 测试 |
|---|---|
| known command零JEV／provider | port零call、jev_attempted:false／general_ai_invoked:false |
| 歧义轻text可JEV | unknown consult port、JEV推荐gateway决定 |
| unavailable／timeout／malformed不阻断 | typed fallback reason、usable MANUAL_PICKER |
| JEV不执行Action不授permission | 六hostile JEV_MAY_NOT_EXECUTE，router无execution、permission_granted:false |
| HARD／engineering不偷偷GAI coding worker | typed engineering port，无则ENGINEERING_ROUTE_DEFERRED、GAI未invoke |
| 推荐／chosen分别审计 | recommendation保留，即policy override，chosen.decided_by，两者audit |
| policy最终决定 | custom override、GATEWAY_POLICY_CUSTOM／policy_ref |
| low confidence／no JEV回deterministic candidate＋manual | low为无signal非弱signal |
| complex engineering外部typed port | engineering deferred seam |
| sideeffect／destructive保持确认权限 | CONFIRMATION_REQUIRED／requires_confirmation:true／permission:false，即使推荐GAI |

## 2. 决策日志

**D1：claim。** scan无己repair／Mech Correction，Alien持BA004／005／EM004／BA006／EM008／009／GAI004／RF004；RF005后tie排RF选GAI005，消费刚建GAI004 admission、GAI006／007／009需route先存在。

**D2：JEV必需？** JEV先fallback、deterministic先optional、JEV-only选第二。local／deterministic第一、不mandatory LLM；known command port count零强于看code像skip。

**D3：谁决定？** gateway policy always chosen，JEV only recommendation。custom decide可override，decided_by GATEWAY_POLICY_CUSTOM／policy_ref，classification与final execution admission分离，两field避免override丢推荐。

**D4：不执行如何防？** triage output任意深execution／authority keys（action_ref／execute／handler_ref／grants／lease／capabilities／credential_ref等）全output JEV_MAY_NOT_EXECUTE拒、discard推荐。sanitize留其余作input，outscope不给JEV凭据／lease／Computer Use；whole拒binary可测，router无execution。

**D5：failure taxonomy。** JEV_UNAVAILABLE／TIMEOUT／MALFORMED／LOW_CONFIDENCE／MAY_NOT_EXECUTE不同typed原因同nonblocking fallback，operator需why。与RF005 generic不同：彼caller可attacker存在oracle，此gateway自身precision安全有用。

**D6：timeout。** port typed error TIMEOUT／ETIMEDOUT映JEV_TIMEOUT，真实deadline归async adapter。纯sync无timers不能wallclock，model outcome诚实可测，第6节接缝。

**D7：unknown词汇。** intent／complexity／risk／channel不canonical转null，全无recognized为JEV_MALFORMED。CHITCHAT→QUESTION／critical→HIGH会造certainty，null无signal已有处理。

**D8：engineering。** ENGINEERING或COMPLEX到EngineeringRoutePort，无则ENGINEERING_ROUTE_DEFERRED／deferred:true／succeeded:false、GAI未invoke。不能GAI当工程executor，缺sibling typed seam非silent call或hardfail。lowconfidence engineering不得开启heavier route，test。

**D9：副作用／destructive。** ACTION或HIGH／DESTRUCTIVE强CONFIRMATION_REQUIRED不论推荐，permission:false。保持Utopia boundary、推荐仍audit但不follow。

**D10：deterministic match。** exact或prefix＋space，/help me匹配/help，please open the city不匹配/city open。substring会捕conversational text移离triage，违先deterministic再ask。

**D11：无schema.json。** 同组件。

## 3. 精确文件

| 文件 | 变化 |
|---|---|
| contracts/general-ai-triage-routing-v1/triage-routing.mjs | 新deterministic／normalization／policy／engineering／audit |
| contracts/general-ai-triage-routing-v1/index.mjs | 新public |
| contracts/general-ai-triage-routing-v1/tests/conformance.test.mjs | 新6 |
| tests/general-ai-triage-routing.test.mjs | root新、101→107 |

无City／Core／manifest／doc，additive。

## 4. 测试、失败与修复

6测**首次全过**，无module defect／改expectation，明确而不粉饰。前GAI004 consent proposal、EM009 forged pressure有真实fix，故此tests记着同类洞hostile output／override／missingport／unknown vocab，实现直接满足。写时仅test scaffolding call记录double／override double调整，非行为预期。

## 5. 检查与CI

| 检查 | 结果 |
|---|---|
| node --test tests/*.test.mjs | 107过0败（101＋6） |
| node --test apps/rooms/tests/*.test.mjs | 69过0败 |
| node city/test-all.mjs | 1801过0败 |
| node scripts/verify-promotion-history.mjs | 82ed36933fb4上10 OK |
| node scripts/check-bilingual.mjs | docs／evidence／data-records SYNCHRONIZED |
| CI36738383466，48169de998a913f495fbca1dac5bd37d79e57e19 | success |

## 6. 接缝

- GAI004：GENERAL_AI仅channel report、未invoke；实际API仍consent→budget→admission，route非consent、本无record。
- GAI003／006：Web给text收decision，CONFIRMATION_REQUIRED turn问用户非start provider。
- GAI007：remote同triage＋自己consent，此permission:false不可别处读作permission。
- GAI008：typed fallback为诚实degrade，应report triage不可用非error。
- EM010／013：EngineeringRoutePort.route交工程，缺则DEFERRED；merge统一handoff shape非各定义。
- BA：只classify／route不替assistant identity／task graph，每decision jev_is_canonical_truth:false。
- external JEV adapter：真实deadline／model归JevTriagePort.classify，deadline转TIMEOUT便诚实降级D6。
- Owner：component-stage evolution问题未变。

## 7. Correction开放项

1. execution key藏array index／Action_Ref／LEASE；policy所有CONFIRMATION_REQUIRED仍遵且需confirm；needs_general_ai:true＋DESTRUCTIVE；/city与/city open prefix碰。
2. 确认whole hostile拒非sanitize、lowconfidence engineering不打开route。
3. 确认timeout adapter负责typed outcome，或contract要deadline参数。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_GENERAL_AI_GATEWAY_PROJECT_MERGE
```

原始结论开发完成、仅Alien纠、GAI Gateway merge前禁。
