# BA-009 纠正报告：职责、权限与主动性策略

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = BA-009 (Butler Assistant programme, task 9 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-009-duty-permission-policy.md
CLAIM_COMMIT         = 958d0e8 (Digital-City main, claim of BA-009 Correction by Alien)
CLAIMED_AT           = 2026-10-01T05:00:18Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 9e1de31ba53766758406e991dbacdb8f707b1bfc
DEVELOPMENT_CI       = 36750981300-success-attempt-5
CORRECTION_BRANCH    = assistant/BA-009-duty-permission-policy
CORRECTION_HEAD_SHA  = 2abf8d47ad0663c175779ab9a3057594d2db86ab
BRANCH_CI            = 36818585688-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = BA-009 17 pass (7 author + 10 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

原始元数据保留任务、计划、两host、工作簿、领取、基线、两head／CI、17测试、禁合并与精确head托管绿色完成依据。

## 1. 托管CI

```text
development head   9e1de31 (Mech)   run 36750981300   success
corrected head     2abf8d4 (Alien)  run 36818585688   gateway-web success / android success
```

Development run ID是工作簿曾记BLOCKED_GITHUB_ACCOUNT_BILLING那个；Owner解除账单后success使Correction合格，见mission-book/reports/DEVELOPMENT_CI_RECOVERY_2026-10-01.md历史引用。

## 2. 独立审查方法

git archive Development，D:\A-Utopia\.runtime\evidence\mission-book\BA-009\frozen-9e1de31\，审前四branch blob核Git全MATCH。独立reviewer只看frozen，先读工作簿，含**规范权限公式**User/OwnerPolicy∩AssistantPolicy∩DeviceCapability∩TaskActionGrant，并说明过度允许即security defect。返回17probe和probes/FINDINGS.md，14mechanisms，MATERIAL_DEFECTS_FOUND／high confidence，每probe前后module bytes hash稳定。自己probes-alien/probe-alien-ba009.mjs复现六；合并如下，对方三项因作者suite编码记边界。

## 3. 修复11机制

class按计划共享taxonomy：1 own-key／prototype，2 opt-in／literal-only guard，3 caller limit，4 authority未绑subject，5 拒前变更，6 未验instant，7 验未读，8 hardclaim，9 recursion／clone，10 dropped／reread，11 mutable-key幂等，12 accessor TOCTOU，13 audit未绑actor，14 claim无data支持。

| # | 机制 | Class | 修复 | 回归 |
|---|---|---|---|---|
| 1 | duty gate绑caller duty非action，required=duty_ref??action_ref，持calendar.read可命名己duty得shell.execute.rm-rf | 4,2 | 绑ACTION，named duty只能收窄，action_in_duty／duty_ref_in_duty |
| 2 | assistant axis为想action的caller boolean axes.assistant_policy | 4,8 | registry duty in-duty／deployment ceiling，caller只可收窄 |
| 3 | confirmation_required:false或falsy关ACT_WITH_CONFIRMATION／ACT_AUTONOMOUSLY门槛，ALLOWED | 3,2 | deployment floor、assistant可加，非boolean拒 |
| 4 | handoff grants只非空Array才HANDOFF_CANNOT_ELEVATE，object／string及permissions／capabilities／scopes／authority／elevate过 | 1,4 | 任何authority key拒，显式allow responsibility／checkpoint／evidence refs |
| 5 | sender axes重算recipient，丢capability_available，硬recipient_more_privileged_than_before:false，即使sender拒recipient允许 | 4,7,12 | 同capability factor，recipient_capability_checked；两decision导recipient_more_privileged_than_sender |
| 6 | lease仅lease_valid===true和ref，expired／他assistant也LEASE_VALID | 6,4 | valid且本clock未过期、本assistant持，expires_at真实 |
| 7 | deployment ceiling NONSENSE／null／number比较undefined rank，ACT_AUTONOMOUSLY接受，unknown keys／mistyped list也 | 3 | 词汇ceiling、已知refs confirmation／audience lists、known keys、policy_ref文本 |
| 8 | notification_audiences:USERS字符串 includes(USER)子串准入 | 1,3 | refs list，非text entry拒 |
| 9 | recompute新decision旧仍current，bare registry counter跨registry撞 | 12,14,11 | 同assistant／action旧标superseded_by，ID scope mint registry |
| 10 | 六site instant shape-only、at原样 | 6 | isIsoInstant／clock真实，at统一helper |
| 11 | canonical nonplain、cycle-unsafe freezer，uncloneable验证前进registry | 1,9 | plain prototype、cycle-safe、stored value写前typed |

## 4. 本地测试汇总

```text
corrected module                    17 tests / 17 pass / 0 fail
development head 9e1de31            17 tests /  7 pass / 10 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

作者7测试不变且全过。证据D:\A-Utopia\.runtime\evidence\mission-book\BA-009\：byte-verified frozen-9e1de31/、prefix-test.log、gate-BA-009.log、两锚保护patch-duty-policy.mjs／patch-duty-policy-2.mjs（各至少一次anchor mismatch写前干净中止）、自己probe、独立FINDINGS＋17probes。

## 5. 有意不修边界

| 边界 | 理由 |
|---|---|
| capability_available默认true，对方defect4 | 作者allowed case省它且ALLOWED，conformance.test.mjs:96／recompute :147。capability在DEVICE_CAPABILITY axis与signal两次，省signal仍须declare axis；现caller_declared_axes／core_axes_verified_here:false诚实说明。fail-closed破contract，留integration owner |
| decide无initiative，对方8，SILENT／NOTIFY在proactiveNotice拒action时仍ALLOWED | 作者:96；decide问“被问时可否做”，proactiveNotice问“未被问可否发起”，caller需后者才要initiative边界，不合并问题 |
| checkDuty仍duty_ref??action_ref，同修1pattern | 作者:78断显式duty代action；checkDuty不grant仅分类，修decide、记不对称 |
| stored list无界、decide不journal | retention属workbook未scope metrics；read-only decisions／decision，supersession标旧；journal新surface非repair |
| lease_valid仍caller声明 | 发行属BA004，本module消费safety prerequisite，查clock expiry／holder，公开lease_validity_source CALLER_DECLARED／lease_verified_here:false |
| 三Core axes caller声明，对方probe14 design seam | USER_OWNER_POLICY／DEVICE_CAPABILITY／TASK_ACTION_GRANT归Shared Core与device，本module不拥有不核，现命名caller-declared非暗示端到端验证交集 |
| DUTY_CODES16中10未construct，DELEGATE／REFUSE／DELEGATED不产decision | facts由duty_kind／delegated_to／decision／refusal payload报，coverage非行为defect |

## 6. 审查完整性说明

对方两次说frozen test file工作中变化，这是预期：Correction host在frozen append regression做pre-fix prefix-test，前任务同样。判断module duty-policy.mjs每probe前后sha256稳定并记录；superset13-test 7过／6败与此处第三轮再加4后7过／10败同baseline。

## 7. 披露

- 三轮：自己六，对方首interim加action／duty binding与handoff capability两最实质，final加lease／supersession，全部修，标complete时无material open。
- 自己错不隐藏：test误认为policy()察坏clock，实际lazy、改读取clock调用；另外named duty在list、recipient CONFIRMATION_REQUIRED非ALLOWED预期错，改test非module。
- 两patch初parse失败：embedded template literal中doc comment未escape backticks，写module前中止，修再跑。每regression用byte-preserving append-regressions.mjs。
- billing refusal从未作code failure；此任务每个实际启动hosted run均执行真实steps。
