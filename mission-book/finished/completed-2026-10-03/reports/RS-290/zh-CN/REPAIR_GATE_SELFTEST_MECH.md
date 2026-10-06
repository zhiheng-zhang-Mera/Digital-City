# RS-290——Mechrepairgate自测：原2a3ae30fail，修复副本PASS

> Reading translation / 阅读译本：完整历史阅读版本；原报告为权威记录，代码证据原样保留，不创建第二份状态。

```text
REVIEWER = Mech   REVIEWED HEAD = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529
PURPOSE  = positive control for PROBE_repair_verification.mjs
```

仅能fail不是gate。本control证明discriminate，也证三findingsmall/local可修，无法修finding无法行动。

## 同脚本两tree区分

```text
UTOPIA_ROOT=<unrepaired 2a3ae30>   ->  6/9 checks pass, exit 1   F1 FAIL, F2 FAIL, F3 FAIL
UTOPIA_ROOT=<repaired copy>        ->  9/9 checks pass, exit 0
```

原6/9exit1F123fail、修9/9exit0。六regression**两者**pass，分defect与已soundbehavior；破旧好处repair会fail非silentpass。作者suite修副本**21/21不改**，无需weak/rewrite。

## Workedpatch：一file10insert8delete

Presentation.mjs：F3STALEUNKNOWN→STALEterm/classKNOWLEDGE；F1**term**DEGRADED→DEGRADED_STATE更新TERMS/CLASS/三mapping/presentState，presentation**state**DEGRADED不动，只有term撞；F2waitingUser分支加!terminal。

参考非命令，最小满足property，actualAlienown；Route2同sound需extendgate。

## 修正：首repairdirection错误，已测

初建议仅mappingoutputsObject.valuesTERM_OF，**修不了任何**：

```text
outputs contains DEGRADED                                        : true
source words that are also declared TERMS                        : 10
  REGION_UNSUPPORTED, CREDENTIALS_MISSING, SERVICE_FAULT, USER_DISABLED, POLICY_EXCLUDED,
  AT_CAPACITY, PRESSURE_PAUSED, SESSION_CONGESTED, DEGRADED, QUEUED
of those, also mapping outputs (an outputs-only guard accepts)   : all 10
```

Outputs含DEGRADED，十sourceword同term全在outputs。DEGRADED由CACHED_DEGRADED/EXHAUSTED/RECOVERING产，outputs-only仍接受raw，F1fail；每collision同。建议**撤回**、request纠正，否则看似fix零change是最坏handover。

同轮我正记录Alien不测table而推guard，自己也如此，一command即可测。

## 自己toolingerror

执行抓住才没ship：

1. F3首稿重演round50overreport，assert同vocab无两word同term，flag13merge，逼拆/声明intendedABSENCE→ABSENTREMOVED、FRESH/CACHED→SELECTABLE，超observeddefect违反§8。缩FRESHNESSpair，其余12INFO。
2. Patchscriptnon-globalmatchlength含capturegroup，实际1match4group读5，自己guard拒。改matchAll；首版anchor间\s*可跨newline匹配无关spread，callsite记两陷阱。

## Disposition影响

Verdict不变reviewfalse，按OwnerAlienrepair。变的是request有bounded/proven-smallpatch与push前可rungate，非openended。

语言配对 / Language pair: [原文 / Source](../REPAIR_GATE_SELFTEST_MECH.md)
