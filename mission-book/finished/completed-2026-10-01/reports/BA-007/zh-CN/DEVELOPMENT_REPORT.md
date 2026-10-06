# BA-007 开发报告：Assistant设置与交互界面

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = BA-007 (Butler Assistant programme, task 7 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 12825bd (Digital-City main, "claim(BA-007): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T17:50:10Z
CONTROL_REVISION_AT_CLAIM= 4073858 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-007-settings-interaction-surface
IMPLEMENTATION_HEAD_SHA  = 8fa4686bb7acb2b57a34a00fe517f6ecaad9769f (pushed)
BRANCH_CI                = 36752540378 — BLOCKED: the jobs never started
LOCAL_CHECK_SUMMARY      = 107/107 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = **false** — deliberately NOT claimed (see §0)
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

原始元数据保留task／host／claim／baseline／head与CI阻断、local107全过、development_complete有意false、禁止合并。历史状态不按后来恢复回填。

## 0. 阻断：相同外部条件连续第三轮

run36752540378两job拒start：

```text
X The job was not started because recent account payments have failed or your spending limit needs to be
  increased. Please check the 'Billing & plans' section in your settings
gateway-web: .github#1 … android: .github#1
```

同BA009 run36750981300三retry、EM012 run36751919772 retry，2–4秒零steps。Alien GAI004 push同失败，阻断前EM011／RF010成功。实现已push且local验证，缺能实际start的CI证据。

## 1. 交付物

contracts/assistant-settings-surface-v1/含settings-surface.mjs（assistant list／select、committed profile updates、embodiment registry、foreground切换、explicit handoff request、五distinct identity roles界面、stale indicators、reserved adapters）、index.mjs、6套件与根tests/assistant-settings-surface.test.mjs。

验收均本地验证：

| 要求 | 测试 |
|---|---|
| profile通过committed shared state跨embodiment，非local UI／scratch直同步 | 不触Digital-Me／tasks，propagates_via COMMITTED_SHARED_STATE、local_scratch_synchronized:false、committedUpdates读回 |
| mode／personality／voice／avatar edit不restart／duplicate／transfer task | profile及reserved adapter测试，每edit三个flag false |
| foreground遵BA003且无handoff除显式请求 | produces_task_handoff:false、handoff_must_be_requested_separately:true，另请求路BA_004_HANDOFF |
| UI区分assistant、user／Digital-Me、foreground、owner、executor | IDENTITY_KINDS／surfaceView五角色字段，task logical_owner_ref与executor_ref |
| reconnect／stale防缓存误当authority | cache_is_authoritative:false、stale_indicator、assertFresh报STALE_CACHE_IS_NOT_AUTHORITY |
| list／select、按version profile edit | listAssistants／editProfile expected_profile_version |
| mode是assistant／relationship policy非Digital-Me | user_*／digital_me拒DIGITAL_ME_IS_READ_ONLY，mode不改canonical |
| 展同logical assistant其他embodiments | 两device，one_logical_assistant:true、independent_minds:false |
| background分列带owner／executor且不隐藏 | background_tasks非空，background_tasks_hidden:false |
| voice／avatar未来adapter现不必 | required_now:false，disabled拒 |

## 2. 决策日志（问题 → 选项 → 选择 → 理由）

**D1：领取任务。** 新scan无自己repair／Mech Correction，Alien持BA004…006、008，EM004…011，GAI003…008，RF004…010，GAI004／RF006进行中。EM012后tie-break排Engineering，选最后Butler surface，须用户可见foreground／ownership／execution。**再次no-idle**：BA009／EM012 CI-blocked，另worktree继续合格stage非idle。

**D2：profile传播。** editProfile出versioned committed update，COMMITTED_SHARED_STATE／local_scratch_synchronized:false，其他embodiment经committedUpdates({since_profile_version})读，stale expected_profile_version拒。验收对比shared commit与scratch sync，命名字段＋readback使可验；乐观version同BA006／EM010冲突纪律。

**D3：Digital-Me边界。** user_*／digital_me／canonical_user形canonical字段拒DIGITAL_ME_IS_READ_ONLY并命名canonical来源，view user editable_from_settings:false。首outscope禁止settings改user canonical；按shape拒非仅allow-list信息，防貌似合理key夹写。

**D4：切换与handoff。** switchForeground明确produces_task_handoff:false、ownership／executor unchanged、background_tasks_continue；requestHandoff独立explicit，foreground_switch_implies_handoff:false、requires_recipient_acceptance:true、transfers_no_authority:true、applied_by BA_004_HANDOFF。自动转移outscope，分操作UI不可混，handoff委BA004非重写。

**D5：背景任务。** background_tasks独立foreground_tasks，每项owner／executor分列、background_tasks_hidden:false；验收不因owner非前台隐藏，test切离仍列原owner。

**D6：stale。** CURRENT／FRESH／STALE／OFFLINE／RECONNECTING／UNKNOWN独立；非fresh embodiment出indicator明cache，view总cache_is_authoritative:false，assertFresh拒STALE_CACHE_IS_NOT_AUTHORITY。RECONNECTING非fresh，尚未重建view。

**D7：reserved adapters。** VOICE_EDITOR／AVATAR_EDITOR required_now:false，policy未开voice_ref／avatar_ref edit拒RESERVED_ADAPTER_UNAVAILABLE、profile不改。未来能力不作现验收要求，但reserved须真adapter非无engine可写field。

**D8：无schema.json。** 同组件分支。

## 3. 精确文件

| 文件 | 变化 |
|---|---|
| contracts/assistant-settings-surface-v1/settings-surface.mjs | 新assistant／profile updates／embodiments／foreground handoff／view／stale／reserved |
| contracts/assistant-settings-surface-v1/index.mjs | 新public |
| contracts/assistant-settings-surface-v1/tests/conformance.test.mjs | 新6test |
| tests/assistant-settings-surface.test.mjs | 新root，101→107 |

无City／Core／manifest／doc，merge additive。

## 4. 测试、失败与修复

6项，首run一败，**test错非module defect**：final assertion围绕frozen array in-place push作tautology，helper见TypeError非domain error。改direct frozen snapshot assertion，无module改动，诚实非包装fix。

## 5. 本地检查与CI

| 检查 | 结果 |
|---|---|
| node --test tests/*.test.mjs | 107过0败（101＋6） |
| node --test apps/rooms/tests/*.test.mjs | 69过0败 |
| node city/test-all.mjs | 1801过0败 |
| node scripts/verify-promotion-history.mjs | OK，82ed36933fb4上10 |
| node scripts/check-bilingual.mjs | docs／evidence／data-records SYNCHRONIZED |
| CI36752540378，8fa4686bb7acb2b57a34a00fe517f6ecaad9769f | BLOCKED、账单使jobs未start |

## 6. 集成接缝

- BA003：switchForeground表面半，durable binding归BA003，不第二truth。
- BA004：requestHandoff applied_by委派、无authority，surface不把切换作handoff。
- BA005：只读canonical user源gateway。
- BA006／008：view owner／executor为projection，surface无task truth。
- BA009：proactivity是此profile field、彼policy，展示effective level不可edit扩张。
- Owner／ops阻断：Actions账单恢复前BA007／009／EM012不能verified development_complete。
- Owner未变：evolution feed记否component-stage。

## 7. Correction主机开放项

1. editProfile其他拼写userName／me撞canonical；OFFLINE device handoff现允许可能gap；committedUpdates仅mode change；同device两embodiment第二覆盖需确认；UNKNOWN assertFresh拒符合。
2. 确认D4唯一独立handoff、D6 RECONNECTING stale。
3. CI可run前不能claim，development_complete false。

```text
DEVELOPMENT_COMPLETE = false (CI blocked by the account-billing condition; not a code failure)
CORRECTION_ELIGIBLE  = false until CI is green
MERGE_STATUS         = FORBIDDEN_UNTIL_PROJECT_MERGE
```

原始结论保留CI账单非code失败、开发false、CI绿前Correction不合格、项目merge前禁止。
