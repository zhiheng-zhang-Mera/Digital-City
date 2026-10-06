# BA-009 开发报告——职责、权限与主动性政策

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = BA-009 (Butler Assistant programme, task 9 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = c9f1876 (Digital-City main, "claim(BA-009): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T17:26:15Z
CONTROL_REVISION_AT_CLAIM= cdeff53 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-009-duty-permission-policy
IMPLEMENTATION_HEAD_SHA  = 9e1de31ba53766758406e991dbacdb8f707b1bfc (pushed)
BRANCH_CI                = 36750981300 — BLOCKED: the jobs never started
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = **false** — deliberately NOT claimed (see §5b)
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 0. 阻塞（先读）

实现与全部本地检查完成，但托管CI不能运行，development_complete刻意false。36750981300两job拒启动。

```text
X The job was not started because recent account payments have failed or your spending limit needs to be
  increased. Please check the 'Billing & plans' section in your settings
android: .github#1 … gateway-web: .github#1
```

账户级外部非分支证据：同push gh run rerun --failed相同计费、零步骤每job2–3秒；Alien并行GAI-004两push 36750532324/36750532665相同；前同checkout EM-011 36750007584 4m10s、RF-010 36749030367 3m50s成功。

工作簿绿才完成，诚实状态实现＋本地验证＋CI不可验证。claim保留，托管等待不得闲置或丢claim，精确证明等Owner计费。不是绕过许可：不写main完成、不造CI，frontmatter记36750981300-BLOCKED_GITHUB_ACCOUNT_BILLING。保留历史。

## 1. 交付物

contracts/assistant-duty-policy-v1/的duty-policy.mjs实现职责、主动级别、四轴权限式、交接不提权、重算触发、租约非权限、共享核心贡献；另index、7测试、根tests/assistant-duty-policy.test.mjs。

验收全部本地，CI列不可用。

| 要求 | 测试与证明 |
|---|---|
| 两助手同授权用户上下文却职责／主动不同 | `two assistants hold different duties and proactivity over one authorized user context`，同动作一CONFIRMATION_REQUIRED、另REFUSED/OUT_OF_DUTY |
| 职责外拒／委派不改权限 | `out-of-duty requests are refused or delegated without changing permissions`，underlying_permissions_changed:false、delegated_to:SHARED_CORE_DUTY_MATCHER |
| 职责变更独立Digital-Me数据 | 测试1writes_digital_me:false，writeDigitalMe DIGITAL_ME_IS_READ_ONLY |
| 较低权限收交接不提升 | `a handoff to a less-privileged assistant stays less privileged`，HANDOFF_CANNOT_ELEVATE、recipient_inherits_grants:false、authority_transferred:false |
| 无能力执行设备即使owner授权也阻 | `effective permission is the four-axis intersection and a lease never substitutes for it`，CAPABILITY_MISSING、task_owner_authorized:true |
| 允许／拒／确认／主动通知／交接／重连／丢能力 | 测试1–6全部ALLOWED/DENIED/CONFIRMATION_REQUIRED/PROACTIVE_NOTIFICATION/REFUSED |
| User/OwnerPolicy∩AssistantPolicy∩DeviceCapability∩TaskActionGrant | 测试3每轴独自须且denied_axes命名 |
| 租约额外安全非权限 | 测试3lease_would_not_help:true、lease_does_not_grant_forbidden_capability:true |
| 交接／执行者／设备／重连／能力变更重算 | 六触发，cached_decision_reused:false、inherited_permission:false |
| 贡献共享Core非第二引擎 | sharedCoreContribution第二引擎false、root权不移、RF目标重验 |
| 主动／通知界限 | 五等级、audience、部署上限 |

## 2. 决策日志

**D1——任务。** 新扫描无本机修复、Mech无Correction，Alien持BA-004…008、EM-004…011、GAI-003…008、RF-004…010，GAI-004进行。前EM-011排Engineering，BA-009为RF-010公共界及GAI同意门禁引用policy.evaluate，最后Butler政策，无它接口不可验证。

**D2——字面权限式。** decide全四轴都成立才grant，缺轴denied_axes，发布lease/persona/profile/relationship_state/foreground_is_not_permission。工作簿规范禁止人格／配置直接授、租约代替，各否定可查非暗示。

**D3——租约作用。** 验执行安全、lease_usable，但政策拒／缺能力原样回lease_would_not_help:true。测试完美租约却一轴拒仍拒，正是审查担心。

**D4——职责与权限。** 先职责，外职责REFUSED、不改底层且委派。不能用撤权限实现拒绝，分离防陷阱。

**D5——交接。** evaluateHandoff依两助手各自职责重算，payload grants在决策前HANDOFF_CANNOT_ELEVATE，recipient_inherits_grants:false、authority_transferred:false、recipient_more_privileged_than_before:false。不复制送出权限；直接拒比过滤强，指出调用者误认已转权。

**D6——触发。** HANDOFF/EXECUTOR_CHANGE/DEVICE_CHANGE/RECONNECT/CAPABILITY_CHANGE/DUTY_CHANGE六，均recomputed_after_change:true、不缓存不继承，测试各触发非代表一个。

**D7——主动。** 五级部署上限，SILENT不通知，NOTIFY/SUGGEST通知非动作、initiative_executed:false，act级需确认，受众不扩大。排自主扩新能力，单助手不能放宽主动。

**D8——政策位置。** AssistantPolicy贡献共享契约，非第二全局、不移Root/Core，RF目标重验，满足RF-010接口。

**D9——真实缺陷。** setDutyPolicy duties参数遮内部map，每写TypeError:duties.get is not a function，不可用；改参数duty_refs。看似正确审查会漏，首次执行立刻见。

**D10——无schema.json。** 同其他组件。

## 3. 精确文件

| 文件 | 变更 |
|---|---|
| contracts/assistant-duty-policy-v1/duty-policy.mjs | 新职责、主动、权限式、交接、重算、租约界 |
| contracts/assistant-duty-policy-v1/index.mjs | 新公开接口 |
| contracts/assistant-duty-policy-v1/tests/conformance.test.mjs | 新7测试 |
| tests/assistant-duty-policy.test.mjs | 新入口101→108 |

无City/Core、清单、文档，合并增量。

## 5b. development_complete为什么false

阶段要求实现→测试→推并相关CI→报告→绿才完成。1/2/4及push完成，CI零步骤因计费。完成会重写外部失败成功，禁止。因此IN_PROGRESS，剩精确证明“Actions能再启动job”。章节顺序按原文。

## 4. 测试与修复

7测试首次两失败，原概述一真实缺陷与两期望，保留原计数。

1. duties遮map无法设政策，改参数D9。
2. butler ACT_WITH_CONFIRMATION职责内误期ALLOWED，正确CONFIRMATION_REQUIRED；现确认butler加真正NOTIFY specialist允许，更强双向。

## 5. 本地与CI

| 检查 | 原结果 |
|---|---|
| node --test tests/*.test.mjs | 108过0败（101＋7） |
| node --test apps/rooms/tests/*.test.mjs | 69过0败 |
| node city/test-all.mjs | 1801过0败 |
| node scripts/verify-promotion-history.mjs | OK，82ed36933fb4验证10 |
| node scripts/check-bilingual.mjs | docs/evidence/data-records PAIR_STATUS=SYNCHRONIZED |
| 9e1de31ba53766758406e991dbacdb8f707b1bfc 的CI 36750981300 | BLOCKED，未启动，重一次相同 |

## 6. 同级接口

- RF-010 evaluate本决策，四轴同，session非权限对应lease非权限。
- BA-004/006只交职责，收权限重算，任务owner/executor分离作为求值主体。
- BA-005只读Digital-Me，职责助手拥有不改用户规范，本显拒写。
- BA-008租约安全，本决策先于arming。
- GAI-004/005/008同意／分流门禁与职责分开，API须全满足互不可代。
- EM-009/010 worker权为本政策与placement交集，租约不扩。
- Owner计费恢复前后续组件不能验证development_complete。
- Owner问题不变：演进记组件与否。

## 7. Correction待项

1. 对抗duties ['*']配SILENT（外职责先拒、未看主动，确认顺序）；职责交叠主动异（已测）；租约不同holder（仅lease_valid/ref，无holder查，疑缺口）；DUTY_CHANGE并发政策替（同步无法交错）；重复canonical audience。
2. 确认D3租约不救拒，D5 grants交接直接拒非过滤。
3. CI不能跑前Correction不能领，development_complete=false为两主机前提，**不可当就绪**。

```text
DEVELOPMENT_COMPLETE = false (CI blocked by an external account-billing condition; not a code failure)
CORRECTION_ELIGIBLE  = false until CI is green
MERGE_STATUS         = FORBIDDEN_UNTIL_PROJECT_MERGE
```
