# BA-007 纠正报告：Assistant设置与交互界面

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = BA-007 (Butler Assistant programme, task 7 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-007-settings-interaction-surface.md
CLAIM_COMMIT         = ceb20c9 (Digital-City main, claim of BA-007 Correction by Alien)
CLAIMED_AT           = 2026-10-01T04:45:32Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 8fa4686bb7acb2b57a34a00fe517f6ecaad9769f
DEVELOPMENT_CI       = 36752540378-success-attempt-3
CORRECTION_BRANCH    = assistant/BA-007-settings-interaction-surface
CORRECTION_HEAD_SHA  = f8f15af835e6ea04921142403c1c33584364d451
BRANCH_CI            = 36817491957-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = BA-007 18 pass (6 author + 12 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

原始元数据保留任务、两主机、领取、工作簿、基线、开发／纠正提交及CI、18项套件、禁止合并和精确head托管绿色的完成依据。

## 1. 托管CI

```text
development head   8fa4686 (Mech)   run 36752540378   success
first-pass head    14272f6 (Alien)  run 36817130742   success   ← superseded by the review in §4
corrected head     f8f15af (Alien)  run 36817491957   gateway-web success / android success
```

Development运行就是工作簿此前记BLOCKED_GITHUB_ACCOUNT_BILLING的ID。Owner解除账单后两job执行真实steps且success，所以任务具备资格。恢复记录在mission-book/reports/DEVELOPMENT_CI_RECOVERY_2026-10-01.md。

## 2. 独立审查方法

开发head用git archive导出到D:\A-Utopia\.runtime\evidence\mission-book\BA-007\frozen-8fa4686\，审查前全部四branch blobs核Git：

```text
contracts/assistant-settings-surface-v1/index.mjs                  MATCH
contracts/assistant-settings-surface-v1/settings-surface.mjs       MATCH
contracts/assistant-settings-surface-v1/tests/conformance.test.mjs MATCH
tests/assistant-settings-surface.test.mjs                          MATCH
```

独立对抗审查只看frozen、先读workbook，重点为设置写入静默不兑现所称行为。返回13探针和probes/FINDINGS.md、12复现机制、MATERIAL_DEFECTS_FOUND／high confidence，module hash始终不变。自己probes-alien/probe-alien-ba007.mjs复现8项。两集按机制合并，6重叠、6独立新项为第4节第二轮；另3作者编码契约记第6节边界。

## 3. 首轮8机制

class按计划共享：1 own-key／prototype，2 opt-in／literal guard，3 caller limit，4 authority未绑subject，5拒前变更，6未验instant，7验未读，8硬claim，9递归／clone，10丢／重读field，11可变key幂等，12accessor TOCTOU，13audit无actor，14bounded claim无data。

| # | 机制 | Class | 修复 | 回归 |
|---|---|---|---|---|
| 1 | editable values未typed，display_name42／空、verbosity对象、locale数组进canonical，explicit undefined静默清但列changed | 2,8 | 各field按承诺类型非空text／declared mode／ref或null／token或null，undefined拒 | 是 |
| 2 | symbol／non-enumerable过allow、clone丢仍committed:true，hidden user_name绕Digital-Me分类 | 1,8,10 | 原对象Reflect.ownKeys定shape，unreadable拒、Digital-Me仍专码 | 是 |
| 3 | profile_version_required:false或非true关闭乐观并发，两writer v1都写、loser无告知 | 3 | policy验且不可关闭version | 是 |
| 4 | re-register覆用户binding，切换回注册assistant、STALE重置注册状态而assertFresh真；executor_for／last_seen_at未验 | 5,8,10 | 冲突重注册拒，同binding refresh保留；executor_for task ref list、last_seen_at真实时间 | 是 |
| 5 | 无task_ref task两list皆消失，却background_tasks_hidden硬false | 8,10 | unreadable_tasks报告、flag据它导出 | 是 |
| 6 | since_profile_version NaN／x回无需sync | 6 | cursor非负integer | 是 |
| 7 | shape-only时间、不可能2026-13-45T99:99:99Z真，at／last_seen_at原样 | 6 | helper／clock真实、全caller验 | 是 |
| 8 | nonplain canonical、cycle-unsafe freezer，registerAssistant未验存fields | 1,9 | plain prototype／cycle-safe，注册同edit rules | 是 |

## 4. 独立审查非重叠第二轮

| # | 机制 | Class | 修复 | 回归 |
|---|---|---|---|---|
| 9 | freshness仅caller state，last_seen_at不比now，古FRESH报stale:false／fresh_confirmed | 6,8 | declared state加stale_after_ms窗口，indicator含reason／age | 是 |
| 10 | 同device state embodimentsOf cached_view_is_authoritative:true，surface／assert却cache | 10 | projection从不声称authority，报declared state／窗口 | 是 |
| 11 | committed update仅field名，audit无actor／before after，另embodiment无法应用 | 13,14 | changed／previous_values、可选actor_ref缺actor_known:false，journal带versions／fields／actor | 是 |
| 12 | requestHandoff不看freshness，stale cache可移责任，stale switch如authority | 4,6 | nonfresh handoff拒STALE_CACHE_IS_NOT_AUTHORITY，switch provisional binding_from_cached_view／requires_authoritative_revalidation | 是 |
| 13 | truthy非bool foreground倒成background，owner／executor全null仍literal role | 7,8 | 必布尔，否则unreadable NON_BOOLEAN_FOREGROUND；role据refs是否known | 是 |
| 14 | function／symbol clone／freeze错误在record／journal写后，无rollback，retry DUPLICATE_ASSISTANT、list永久throw；cyclic change RangeError、拒edit消耗counter | 5,9 | 全stored写前typed、cycle-safe，拒edit不耗ref | 是 |

## 5. 测试汇总

```text
corrected module                    18 tests / 18 pass / 0 fail
development head 8fa4686            18 tests /  6 pass / 12 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

作者6测试不改且全过。证据D:\A-Utopia\.runtime\evidence\mission-book\BA-007\：byte-verified frozen、prefix-test.log、gate-BA-007.log、两anchor-guarded patch-settings-surface.mjs／-2.mjs、自己probe、独立FINDINGS＋13probe。

## 6. 有意不修边界

| 边界 | 理由 |
|---|---|
| committed update传播但作者不断values，D1 | #11新增changed／previous_values已修；路径仍committedUpdates，reader须应用changed非再读profile，留integration owner |
| nonfresh可switch不可handoff | switch UI不转责任、provisional保可用；handoff不能cache起。拒两者会offline无法换所显内容 |
| actor可选、未名actor_known:false | 无caller identity、作者:66无actor edit，必需破contract；现诚实unknown |
| requestHandoff不比task_ref，D7半 | 无task truth，BA004执行且验，applied_by／recipient acceptance为request声明非责任已移 |
| applied_by／transfers_no_authority／requires_recipient_acceptance literal，D10半 | 描record非BA004状态，此module不改task；integration须核而非trust |
| journal／updates无界 | retention不scope，read-only、since_profile_version可分页 |
| TASK_HANDOFF_NOT_AUTOMATIC／NO_COMMITTED_UPDATE／FOREGROUND_SWITCHED_WITHOUT_HANDOFF声明不抛 | facts由produces_task_handoff:false／separate request字段报，留strict revision，coverage |

## 7. 披露

- 首head14272f6／run36817130742审查回前已绿，新项第二轮；只有两轮同final绿后workbook complete。
- 两次PowerShell string roundtrip污染中间suite encoding；恢复Git pristine bytes、Node byte-preserving重加，regression由ASCII marker救出，无test／module行丢。第二次促使余repair用append-regressions.mjs。
- reviewer看frozen suffix变化，是host append regressions做pre-fix；module bytes不变且hash在其report。
- fresh worktree gate需root及city pnpm install --frozen-lockfile。billing拒不作code fail；所有实际start的hosted run都真实steps。
