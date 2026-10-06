# RF-006 纠正报告：安全传输路径管理与relay回退

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = RF-006 (Remote Fabric programme, task 6 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-006-secure-transport-path-manager.md
CLAIM_COMMIT         = 4957569 (Digital-City main, claim of RF-006 Correction by Alien)
CLAIMED_AT           = 2026-09-30T17:32:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 251e20bc3af4a2db57253a1a1e5332c976d17d51
DEVELOPMENT_CI       = 36739459945-success
CORRECTION_BRANCH    = remote/RF-006-secure-transport-path-manager
CORRECTION_HEAD_SHA  = 8fbd71df10535456cddd8146e28b08fd7684d714
BRANCH_CI            = 36752017760-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = RF-006 12 pass, root 113 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 251e20b
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

原始元数据保留任务、两host、领取、控制书、基线、两阶段SHA／CI、检查、禁合并与精确推送head绿色后的完成状态。

## 1. 托管CI：已解决阻断区间

**已解决：Owner恢复GitHub Actions账单／额度，已推head无代码变化重新运行。** 重尝试在精确纠正head执行两job且通过，现满足完成标准：

```text
corrected head   = 8fbd71d
green run        = 36752017760-gateway-web-success-android-success
local checks     = all green (see LOCAL_CHECK_SUMMARY above)
```

下方逐字保留阻断历史，没有改写或把旧blocked attempt重标success，从未用本地PASS替托管CI。

```text
blocked interval (retained history)
  run 36751505413  first pass      android X 2s   gateway-web X 2s   0 steps
  run 36752017760  second pass     android X 2s   gateway-web X 2s   0 steps
  run 36752017760  round-20 retry  android X 3s   gateway-web X 2s   job ids 110142514472/110142514368
resolution
  run 36752017760  re-attempt 23:55:46Z   android OK 1m8s (110151153729)  gateway-web OK 2m28s (110151154092)
```

### 保留原始记录

账户拒绝启动任何job期间，报告以下typed external blocker：

两个纠正head已push、gate每local check绿，但GitHub仍拒该account jobs，本任务如下：

```text
run 36751505413 (first pass)   android X 2s   gateway-web X 2s
run 36752017760 (second pass)  android X 2s   gateway-web X 2s
    "The job was not started because recent account payments have failed or your
     spending limit needs to be increased. Please check the 'Billing & plans' section"
```

这是**连续第四尝试**（GAI004两、本任务两），属环境非code：job从未启动、零步骤，同仓库Mech EM011于17:14:47成功而此处拒。记typed pending seam、CORRECTION_COMPLETE=false／IN_PROGRESS，绝不改success。**Owner行动：恢复Actions billing／spending。** 此为保留历史非当前未解决声明。

## 2. 审查方法

审查前byte-verified frozen-251e20b，四file match=True；先读自身验收再判断，独立对抗probe同frozen。自己五缺陷、probe十二并确认自己三，两轮均push。

## 3. 修复

| id | 发现者 | 严重度 | 机制 | 修复 |
|---|---|---|---|---|
| C1 | 双方 | high | caller reorder preference使RELAY首、direct全available仍选relay，违fixed preference和direct优先 | 可缩canonical顺序不可提升class |
| C2 | 双方 | high | onPathLost删path但send仍adapter／sent:true，path_lost无人读 | NO_USABLE_PATH拒到migration成功，migrate清flag |
| C3 | 本机 | high | pathDescriptor硬auth／encrypted true，policy豁免时plaintext仍报protected | 按adapter测量报告 |
| C4 | 双方 | medium | connect／send／migrate／onPathLost／close caller at全未验 | 全realinstant round-trip |
| C5 | 本机 | medium | send adapter fault raw、connect却wrap | typed result不记command，retry仍首尝试 |
| C6 | 本机 | medium | findSecretFields漏非枚举、循环raw RangeError | Reflect.ownKeys＋visited |
| C7 | probe | medium | max_probe_ms -1／Infinity／MAX_SAFE_INTEGER，5000重复preference一call5000probe／connect | 有界budget、拒duplicates |
| C8 | probe | medium | paths.set无uniqueness覆path_ref，两path同ref、lost／close错session | duplicate拒并close transport |
| C9 | probe | medium | peer／trust无shape原样adapter，session_key传transport | 两者拒secret形 |
| C10 | probe | medium | migrate硬trust_state TRUSTED未重用trust | session记opening trust，migration复用 |
| C11 | probe | low | RELAY_CANNOT_AUTHORIZE在adapter.connect之后，留open | 拒前close |

## 4. 审查发现未修及理由

1. **省protected payload仍转发**，D3 high。实施须explicit true后三test失败（自己二、作者一）：契约约定envelope默认端到端protected，除非opt-out。加flag为严格升级、破fixture，回退自己而非test。Owner记录：relay仅防明确plaintext envelope。
2. **retry按caller command_ref＋action_key去重**，D5；fresh ref再invoke。content dedupe需契约未定义digest，DUPLICATE_COMMAND声明未抛。
3. **session_ref可猜** session:${device_id}:${counter}，D9。不可猜需entropy注入，目前ports adapter／clock。path_ref半边已C8修，session记接缝。
4. **DataCloneError仍可从send／policy逃逸** uncloneable，D11；policy getter error出createPathManager。全面guard clone会改套件可能依赖error shape，记录。
5. **MIGRATION_RACE_LOST死词汇**，sync module不抛，probe且grep确认。

## 5. 本地验证：CI gate自身命令

```text
node --test contracts/remote-path-manager-v1/tests/conformance.test.mjs -> 12 pass, 0 fail
node --test tests/*.test.mjs                -> 113 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 251e20b)
```

作者7/7不变，7→12，每negative配合法：reorder拒／narrow subsequence仍direct；默认plaintext拒／确实采用时descriptor诚实；lost拒／migrate后能发。

## 6. 未明示决策（问题／选择／理由）

1. policy可改selection多少：可drop classes不可reorder；header固定，诚实relay fallback不容最差提升首。
2. lost意义：拒直到成功migrate、成功清flag。原记录忽略，首gate忘清破作者test迫使完整修。
3. descriptor能断言：仅adapter report；hardauth只在requirement强制时真，一豁免即验收保护属性假保证。
4. path ref唯一范围：registry拒duplicate，未绑定handle使两session同ref。
5. migration synthetic trust：不，保opening trust；fake TRUSTED在adapter边界难与真实分。

## 7. 如实自身错误

- protected:true强化破约定和三test，test正确，回退。会话**第三次**作者test修正判断：强化破test先看其编码约定还是defect，是约定就记Owner ruling。
- 首path_lost gate迁移成功后永久拒send，作者test捕获，replace path处清flag。
- 两新test用bare{} envelope在revert实验失败，同约定另一侧。
- 又在probe飞行时push，bc34327先于报告，D1／D2第二轮修；证据push且local绿，前两轮sequencing教训仍未完全应用。

## 8. 结果

两轮十一机制修、成对回归、五有理由边界，含实施测量后有意回退强化；第二次记typed external blocker。以下原始false／blocker结论为第1节已解决前历史，不替换值。

```text
CORRECTION_COMPLETE = false
BLOCKER             = GITHUB_ACTIONS_BILLING_OR_SPENDING_LIMIT (Owner action; 4 consecutive refusals)
PENDING_SEAM        = hosted CI for remote/RF-006-secure-transport-path-manager @ 8fbd71d
CONTROL_BOOK_UPDATED = mission-book/remote/RF-006-secure-transport-path-manager.md
```
