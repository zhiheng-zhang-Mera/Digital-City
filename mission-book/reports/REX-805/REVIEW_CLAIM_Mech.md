# REX-805 正式复检领取 / Formal review claim — Mech

2026-10-06，Mech-DS（`MEGA-REP`），角色 Mech-DS。本文件在**任何裁决之前**发布，只记录领取时的测量与领取本身；**尚无任何复检结论**。 / Published before any verdict: claim-time measurements and the claim, no conclusion.

## 为什么现在可以领 / Why the claim is legitimate now

```text
development_complete   true（作者 8da6b91「Verify the final REX805 physical packet and canonical task bindings」）
development_head_sha   0261a9ed1cec88df3ab4675623d422b37b33f270
development_ci         PASS exact head：push 37446455570 / PR 37446461188 / linkage 37446461192 全部 SUCCESS
review_host            null（未被领取）→ 本机领取
```

作者此前把实体门槛交给本机执行（`PHYSICAL_GATE_HANDOFF_Alien.md`），本机已执行并在修复前后各跑一次（`PHYSICAL_GATE_RESULT_Mech.md`，材料见 `evidence/` 与 `evidence-repaired/`）。作者随后记录了开发完成。 / The author handed the physical gate over, this host executed it twice (before and after the repair), and the author has now recorded development completion.

## 领取时间的测量 / Claim-time measurements

```text
被审头 / reviewed head   0261a9ed1cec88df3ab4675623d422b37b33f270
远端分支 / remote branch  origin/rex/REX-805-alien-replay-ablation tip == 该头（实测相等）
依赖祖先 / ancestry       REX-802 accepted 833279ca reachable ✓
                          REX-803 accepted 8798ba9d reachable ✓
                          required ancestor 69a097b5 reachable ✓
                        三者 `git merge-base --is-ancestor` 均 exit 0
精确头 CI / exact-head CI 逐条从 Actions API 读取（不采信概述）：
                          V0.2 checks push          37446455570  COMPLETED SUCCESS attempt 1
                          V0.2 checks pull_request  37446461188  COMPLETED SUCCESS attempt 1
                          City linkage  pull_request 37446461192 COMPLETED SUCCESS attempt 1
union baseline            已接受 803+804 并集 = 704c518；被审头叠加其上的一处 union 冲突已由本机解出并测量：
                          integration/REX-805-repaired-mech-preflight @ 5b85cd6
                          focused 68/68（17 套件）· full 1424/1427（3 项 host-city-launcher）· 跑后 CLEAN
```

## 独立性 / Independence

```text
作者 / author      Alien（对侧物理主机 MERA-ALIANWARE）
复检者 / reviewer  Mech（本机 MEGA-REP）
```

两者是**不同的实体主机**，§3 满足，因此这不是自审。作者提交的独立代码复检（六项 Important 修复）与本机复检是两件事，本机不会把它当作自己的复检证据。 / Different physical hosts, so §3 is satisfied; the author's own code re-review is not adopted as this host's evidence.

## 本机将怎么做这次复检 / How this review will be conducted

```text
1  不复用作者套件；制造本机自己的探针（清单见 REVIEW_READINESS_MECH.md）
   · replay 的确定性与身份（同一源重放两次必须一致；新 experiment / 新 canonical task / 新身份）
   · alternate-device 消融的语义（placementChanged、expectedTarget、policy 表述）
   · 拒绝路径：REPLAY_BUSY / REPLAY_STORE_UNAVAILABLE / REPLAY_TOPOLOGY_NOT_READY /
     REPLAY_SOURCE_INVALID / REPLAY_CONDITION_UNAVAILABLE / ABLATION_UNSUPPORTED / ABLATION_INEFFECTIVE
   · 「不可用条件不得被重放」这一前提是否真的被强制（而不是被静默降级）
   · receipt/store 不可用时的打字化拒绝（本系列已发现六次的 store-guard 家族形状）
   · 比较结果本身的可信度：controlledInputsMatch 在真实与空 limit 两种源上都成立
     （空 limit 分支正是作者以 0261a9e 修复的那一处，本机将独立复测）
2  实体链路以本机已执行的两次门槛材料为准，材料逐字节可核对；
   未能观测的部分标注 NOT_OBSERVED，不当作通过
3  结论只在探针跑完后给出，并明确区分「测量」与「判断」
```

## 领取 / The claim

```text
review_host     Mech
review_head_sha 0261a9ed1cec88df3ab4675623d422b37b33f270
review_complete false（未完成，尚无结论）
terminal_marker TRACE_REPLAY_ABLATION_ACCEPTED — 未释放
merge_authority 无（本机行使任何产品 main 合并权）
```

本领取不改变 `development_*` 字段；`status` 保持不变，直到复检有结论。 / This claim changes no development field.
