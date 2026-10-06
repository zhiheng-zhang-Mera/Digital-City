# REX-803 开发接力与对机复检请求——Mech→Alien

[English source / 英文原文](../DEVELOPMENT_HANDOFF.md)。阅读译本保留历史 target，不改变当前工作书 authority；证据代码块原样保留。

```text
FROM            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, development_host for REX-803
TO              Alien (opposite physical host) — review_host for REX-803, unclaimed
REVIEW TARGET   a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df
                branch rex/REX-803-mech-scenario-runner (remote tip equals that commit)
                HEAD HISTORY: 85a79eca (first release), e284b712 (seed-identity repair D-7), 57d1c919 (physical campaign
                evidence), a695bb9f (hardening pass D-8/R-1 and D-9/R-2). Each head carried measured green CI at its
                time; THIS one is the review target because it is the only head that has also survived this host's own
                adversarial pass.
PR              zhiheng-zhang-Mera/utopia#31
INDEPENDENCE    the workbook records development_host=Mech, so a reviewer on the Alien host is a different physical
                host, which is what CONSTRUCTION_RULES section 3 requires. This document is NOT a review, and the
                author's own tests are NOT review evidence.
MARKER          SCENARIO_REPETITION_ENGINE_ACCEPTED — held until the review releases it
MERGE AUTHORITY false; do not merge this branch into main on the strength of this document
```

## 按工作书原要求 review

独立制造 repeated execution、cancellation、restart、timeout、partial campaign、seed reproducibility。作者仪器在 PR，Reviewer 另写 probe 于 review/REX-803-<host> branch，对上述 exact target SHA。

作者建议 attack list 供 Reviewer 拒绝，非照抄：

```text
A1  Break the accounting invariant: a terminal campaign must satisfy accounted === planned with no state double
    counted. Try a stop racing a timeout; a resume racing a start; an abandon racing a drained loop.
A2  Leak work: after STOP, TIMEOUT, process death or CITY_SHUTDOWN, prove no canonical task is left non-terminal for a
    campaign that is no longer running, and that recovery finds by reference rather than by shape.
A3  Seed reproducibility: prove two independent runs of the same registered manifest derive the same seed sequence for
    the same indices, including after a resume, and that no clock or random source reaches a measured value.
A4  Readiness: prove a campaign cannot start on a topology the City does not have, and that the refusal names what is
    missing; try a manifest whose declared surface exists but whose worker is offline.
A5  Authority: prove an enrolled member and a node credential cannot start, stop or inspect a campaign, and that a
    stale surface cannot stop a campaign it is not looking at.
A6  Trace honesty: prove every settled run (including timeouts and cancellations) has a receipt naming the real
    canonical task, and that a run whose cleanup fails says so rather than reporting a clean stop.
```

## Exact CI（作者测量，Reviewer 必须独立重测）

```text
V0.2 checks      37399258359 (push) and 37399254235 (pull) on 57d1c919ff2fc8bb64ce30bacbfc09ecb60f1fc1
City linkage     37399258414 success
EARLIER HEADS    85a79eca4fe0f4ad8882148725249e016434873e green (V0.2 37398347907/37398374690, linkage 37398375378);
                 e284b712c53e5b7f44acdb878afd6a23c7953735 green (linkage 37399121438). The head moved to repair a
                 defect the first PHYSICAL campaign found, then to add that campaign's evidence.
LOCAL            npm test: 1363 pass / 5 fail — the five are inherited-environment failures, each reproduced at the
                 baseline 213f9f9f (capability-adapters, city-roads) or caused by the resident City holding the host
                 reservation (host-city-launcher x3). The reviewer should re-measure on their own host.
```

## 实体工作覆盖与未覆盖

常驻 City 两 controlled campaigns，真实 Android control surface、本机 reference node 逐 repetition 执行，evidence/raw/mission-book/REX-803。有 real-hardware happy path、derived seed、accounting invariant、trace-run receipt binding。未有 physical failure、timeout、exclusion、cancel、restart、partial campaign；这些只有 automated probe，Reviewer 故障仪器仍有必要。

## 工作书 completion gate 诚实状态

要求 Alien+Mech+Android 至少一 campaign 完整 trace。Development 末实测非假设：

```text
alien-reference-node   online=FALSE, last heartbeat 2026-10-05T11:15:06Z   (cannot be started by this host)
android PERM00         member online=FALSE                                (handset is on ADB at this host)
resident 4391 City     running join590 code, no campaign surface yet
```

gate PARTIAL，本机能 Mech+Android 实机，不能提供 Alien。是 physical topology blocker 非 code，DEVELOPMENT_REPORT/PAPER_MATERIAL_INDEX 明确保留。

## 交接 findings（记录、未修、不称 fixed）

```text
F7  The experiment manifest contract has no warmup field, so a campaign that uses warmup measures something its own
    description does not contain. The campaign receipt records the warmup actually used. Owner: REX-801/REX-807.
F8  ANDROID_CONTROL_SURFACE is satisfied by a NAME, not by a platform fact: the topology gate requires a declared
    control surface whose text matches /android/i, while the City's native Android enrollment replaces the app's
    android-<MODEL> client ref with a device id (apps/android/.../NativeEnrollment.kt stores record.deviceId as
    clientRef). OBSERVED on hardware: the live Android surface was dev-be7832e35fc34b85966c3bb43a992e1d. An experiment
    therefore cannot declare the Android topology using the identity the City actually reports. Recorded for REX-807.
F9  REX-801's registry field named `digest` holds the canonical serialisation of the manifest, not a hash. Using it as
    an identity produced defect D-7 (the whole manifest inside every campaign seed). Raised for REX-801/REX-806.
F10 LOW: after a campaign finishes, the owner-facing form still shows the operator's last typed digits rather than the
    parameters of the campaign that ran. The totals state the truth. Recorded for REX-807.
D-7 Defect found by the FIRST PHYSICAL CAMPAIGN and repaired on this head: see DEVELOPMENT_REPORT.md section 3.
```

## 作者请求怀疑的前提

runner 刻意非 scheduler，易错当 scheduler 测试。攻击 PR What a campaign is 属性：run 为 real canonical work、缺失始终解释、stop 触达 work、resume 继续而非 replay。

## 附录：有 hardened branch 但 Review target 刻意未移动

本 handoff 后作者 third sweep 迁移对侧 MON-903 发现的 state-machine/lifecycle 类别（先前 class scans 未查），发现 receipt handling/close boundary 三 defects，见 AUTHOR_THIRD_CLASS_SWEEP：

```text
repair/REX-803-mech-receipt-order-and-close @ 07e8c3cf31e9aefdb4d12c58e129da39935c8314
   F-S6  receipts() sorted the FILE NAMES, i.e. random UUIDs, so the bounded "newest" list returned the three
         OLDEST campaigns while the comment claimed "newest by name order"
   F-S7  the bounded list stated nothing about the size of the history behind it
   F-S8  close() drained the loop and start() then accepted and LAUNCHED a new campaign into a shutting-down process
```

recorded target 仍 `a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df`。已有 claim collision，Reviewer 领取此 target 不能被底下移走。可采纳 branch 到 review head，或要求作者 harden a695bb9 并重新记录 exact CI；后一产生新 target，非暗换。

### 第二个更严重 finding 与 head 建议

AUTHOR_TWO_WORKER_REHEARSAL.md 记录的首次多个 placement candidate 的双 worker 演练发现 derived-seed rule 从未执行：runOnce 读 context?.workers，route 未设置；untargeted repetition 先领者赢，assignedNodeId 如此；module comment/index 却称相反。单 worker fixture 与两 physical campaigns（Android 非 worker）不能区分。

```text
probe/REX-803-mech-two-worker-rehearsal @ 42acdc6bfacb1e2260364afd2edce041f003638c   (stacked on the branch above)
  red on 07e8c3c: "6 of 6 campaign task(s) were created with no targetDeviceRef"
                  "run 1 (seed 2220486659) landed on rehearsal-alpha, but the declared rule selects rehearsal-beta"
  fixed:          runOnce reads context?.manifest?.workers, so a repetition is targeted by its own derived seed
  CI:             push 37420563832 SUCCESS attempt 1
```

作者对此建议 SHOULD harden，与 storage 不同；已知 false reproducibility 不该浪费 Reviewer 预算，但因 collision 不单方面执行，只需 Reviewer 一句 instruction。
