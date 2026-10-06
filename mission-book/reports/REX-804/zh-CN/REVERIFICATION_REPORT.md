# REX-804 修复 head 复验——Mech

[English source / 英文原文](../REVERIFICATION_REPORT.md)。阅读译本保留历史 verdict，后续 fe700ab 开发修复并不自动改变本次 Mech 判定。原证据代码块逐字保留。

```text
REVIEWER            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, physical host MEGA-REP
DEVELOPER           Alien (physical host MERA-ALIANWARE)
ORIGINAL REVIEW     f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5  -> NOT PASSED, blocking finding B1
                    (an unreadable fault receipt prevented the City from starting)
RE-VERIFIED HEADS   f4ceae734d1d32a7d8950cd5872264135e6073ac   first repaired head (CI: push FAILED, PR FAILED)
                    075ddc13869664bfbf14fa07dae99ea76a6a4b3c   branch tip (CI: push SUCCESS, PR FAILED)
VERDICT             B1 CONFIRMED REPAIRED.  NEW BLOCKING FINDING B4: the branch is not mergeable into
                    current main, and the PR run's red is the proof rather than a flake.
TERMINAL MARKER     FAULT_INJECTION_RECOVERY_ACCEPTED — NOT RELEASED
MERGE AUTHORITY     none
```

## 1. 作者改变及 Reviewer 验证

```text
f76ccf53  original review target                       reviewed, NOT PASSED on B1
19a420c   the reviewer's published minimum repair       adopted by the author unchanged
f4ceae7   adoption + retained repair evidence           faults.mjs now byte-identical to repair/REX-804-mech-minimal
7af63c2   test active fault before expiry with a clock  test-only
075ddc13  keep fault activity assertions host-independent  test-only, branch tip
```

git diff --stat origin/repair/REX-804-mech-minimal f4ceae73 -- services/dev-gateway/research/faults.mjs 为空，采纳文件与 Reviewer 修复逐字节相同。git diff --stat f4ceae73 075ddc13 -- services apps contracts 为空；采纳后两 commit 仅 test/evidence，不改产品。

## 2. B1 由 Reviewer 自身 guard 实测关闭

原找出 blocker 的九 probe 在两 repaired heads 执行：

```text
tests/rex804-mech-review-probes.test.mjs on f4ceae73    9 pass / 0 fail
tests/rex804-mech-review-probes.test.mjs on 075ddc13    9 pass / 0 fail
  P8 (B1 regression guard): an unreadable fault receipt is REPORTED and never prevents the City starting
  P9 (B3 regression guard): a shapeless receipt is reported as broken, not adopted without identity
```

P8 就是原阻塞条件，已在 repair 重驱动，B1 关闭。

## 3. f4ceae73 中间 CI 红灯分类

```text
push 37422814239  FAILED      <- the head the workbook recorded
PR   37422819110  FAILED
linkage 37422819095  success
failing test: "heartbeat loss refuses only targeted heartbeats, stop and expiry restore requests"
              AssertionError: Missing expected rejection   (145 ms - fast, so not a timeout)
```

test 启动 fault 立即要求下一调用拒绝，是否成立取决于当时 fault 是否 active，而 active 取决于主机调度速度。作者同样诊断，用两 test-only commit 注入 fixture({clock: () => time})，由 test 而非 host 决定 active/expired：

```text
reviewer's classification evidence
  tests/rex804-faults.test.mjs on f4ceae73   8/8, five consecutive runs, this host
  tests/rex804-faults.test.mjs on 075ddc13   8/8, five consecutive runs, this host
  product diff between the two heads         EMPTY - only tests and evidence changed
```

红灯是作者 test **measurement defect**，非 product regression，也非 load flake：足够慢 host 可确定复现，修复移除 host 时序影响。不能混入本 programme 其他 load-sensitive flakes。

## 4. 新 BLOCKING B4——分支不能合入 current main

branch tip 同 head push 绿、PR 红，此处不是 flake：

```text
push 37423677731  SUCCESS   the branch is tested against its OLD base
PR   37423681875  FAILURE   the PR is tested against the merge with the NEW main
failing: tests/rex801-store-guard.test.mjs
         "a file where research (the registry parent) belongs cannot stop the City"
         Error: ENOTDIR: not a directory, mkdir '<runtime>\research\faults'
```

本地确定复现，不从 CI 日志推断：

```text
origin/main b06504f  (contains the adopted REX-801 store-guard probe)  MERGED WITH  rex tip 075ddc13
  tests/rex801-store-guard.test.mjs   1 pass / 1 FAIL, 34 201 ms   ENOTDIR mkdir '<runtime>\research\faults'
  the same probe on main alone        2 pass / 0 fail
```

根因：faults.mjs:9 未 guard mkdirSync(dir,{recursive:true})，controller 在 City startup 构造；runtime/research 位置一个 file 令 createGateway ENOTDIR，City 不启动。

这是 programme 中 store-guard 第五例（此前 REX-801 registry、capability-bridge artifacts、WBC-604 profile、REX-803 campaign），更尖锐在同 file read path 为 B1 已修、相邻 mkdir 未修；该类别在以其名义作出的 repair 旁一行仍存活。

可采纳最小 family repair：降级、typed reason、继续 serving：

```text
repair/REX-804-mech-fault-store-guard-on-current-main @ adc075e
  = the merge result of current main with the branch tip, PLUS guarded construction in faults.mjs
  construction catches its own failure into storeState/storeReason instead of throwing
  the startup prune is skipped while the store is unusable; list() publishes storeState/storeReason
  measured after the repair, on the same merge result:
      tests/rex801-store-guard.test.mjs   2 pass / 0 fail, 91 ms   (was 1 pass / 1 fail, 34 201 ms)
      REX-804's own four suites           19 pass / 0 fail
  CI: V0.2 checks push run 37424594316 COMPLETED SUCCESS (attempt 1) on adc075e, jobs gateway-web and android
      both success - and `pnpm test` is the step that was red on the merge before this one-file change
```

分支刻意建于 merge result，CI 执行包含原红 probe 的完整 merged suite。只在旧 base 测 repair 原本就看不到问题。

## 5. Verdict

```text
B1   CLOSED      the reviewer's own regression guard passes on both repaired heads
B4   BLOCKING    merging the branch into current main turns main red; reproduced locally, deterministic
VERDICT          NOT PASSED on 075ddc13 for B4, with the minimal repair published for adoption
WHAT THE AUTHOR HAS TO DO  guard the construction of the fault controller's receipt store. That is the whole of it:
                 the adopter can take adc075e or make the one-file change themselves.
NOT DONE BY THE REVIEWER   no merge, no rewrite of the author's branch or its history, no edit of the author's records,
                 marker not released, review_complete stays false
```

本任务 merge_authority=false，Reviewer 也无 authority。作者 tip 和 original reviewed head 未动，repair 旁路发布。
# 第二次复验 — `fe700aba957990f93b22fd63d594ddfff7b4e243` 上 PASSED

> 以下为原报告后续正式验收记录的完整译文；前面的旧失败结论保持历史来源，不覆盖。

```text
RE-REVIEWED HEAD    fe700aba957990f93b22fd63d594ddfff7b4e243   (branch rex/REX-804-Alien-codex-faults, PR #30)
ANCESTRY            the original reviewed head f76ccf53 AND current main b06504f are both ancestors (exit 0 each)
AUTHOR REPAIR       reports/REX-804/AUTHOR_REPAIR_Alien.md - the author independently reproduced B4 before fixing it
VERDICT             B1 CLOSED, B4 CLOSED, no blocking finding remains. PASSED.
TERMINAL MARKER     FAULT_INJECTION_RECOVERY_ACCEPTED — RELEASED on this head
MERGE AUTHORITY     none; this host did not and does not merge
```

## B4 已关闭，在包含 current main 的 head 上测量

发现原本是分支不能合入 current main，因为 fault controller 无保护 `mkdirSync` 再次触发 store-guard 缺陷，而 main 已带能捕获它的探针。现在 head 已包含 latest-main integration ancestor，复检者在**该 head 内部**重跑同一探针：

```text
tests/rex801-store-guard.test.mjs on fe700ab (contains current main)   2 pass / 0 fail, 97 ms and 51 ms
the same probe on the merge before the repair                          1 pass / 1 FAIL, 34 201 ms, ENOTDIR
the same probe on main alone                                           2 pass / 0 fail
CI on fe700ab, read one run at a time and matched on headSha:
    push          37424946247  COMPLETED SUCCESS attempt 1   (android, gateway-web)
    pull_request  37424951038  COMPLETED SUCCESS attempt 1   (android, gateway-web)
    linkage       37424951044  COMPLETED SUCCESS attempt 1   (reciprocal-contract)
```

此前 `075ddc1` 上变红的是 **pull_request** run，因为 PR 测试与 current main 的合并。现在同一步转绿，因而在复检者能够测量的意义上，分支可以合并。

修复遵循缺陷族模式，而非只消除症状：`faults.mjs` 构造捕获自身失败，写入 `storeState`/`storeReason`；`list()` 披露它们；不可用存储上的 fault injection 返回带类型 **503 `FAULT_STORE_UNAVAILABLE`**，普通任务继续工作。Web Danger Zone 显示原因并禁用注入。这是降级、报告、继续服务，不是吞错。

## 复检者此前记录的其他事项，在此 head 重新测量

```text
B1  an unreadable fault receipt prevented City startup      CLOSED (probe P8, and P1-P9 all pass)
B3  a shapeless receipt adopted without identity            CLOSED (probe P9)
F2  registry vocabulary and the missing receipt route        repaired by the author; the routes answer
nine reviewer probes                                        9 pass / 0 fail
REX-804's own four suites                                   12 pass / 0 fail
full suite                                                  1379/1382, the 3 being this host's resident-City
                                                            host reservation
```

## 本轮发现并修复的复检者自身工具缺陷

此 head 第一次 full-suite 运行失败的是**复检者自己探针**，不是产品：

```text
"REX804 review P6 ... AssertionError: DELAY_RESULT recorded that it was exercised (got 0)"
the same file in isolation: 9 pass / 0 fail
```

P6 对每个 fault class 使用 `durationMs: 150`，然后 sleep 350 ms，要求 exercise 落在宿主时间 150 ms 内；full-suite 负载下未达到。此窗口从来不是产品属性，而是工具对宿主的假定。这与第一次复验中复检者归类的作者 unit fixture **同类缺陷**，现在自身探针也出现，并以相同方式暴露：隔离绿色、满载结果不同。

修复位于 `review/REX-804-mech-review @ 53d01a3`：窗口改为 1200 ms，持有 delayed report promise，并在 sleep 后等待，而非发出后不再管。修复后：

```text
isolation, three consecutive runs                      9 pass / 0 fail each
beside three heavy browser suites (concurrent load)    13 pass / 0 fail
full suite on fe700ab                                  1379/1382, P6 green
```

两种状态都保留记录，不抹掉红色记录。这对复检中的 timing-assumption 缺陷现在共有两个：作者 fixture 一个、复检者一个。有用观察是：**在此代码库中，不注入时钟的 fault-injection 测试实际测试的是宿主。**

## 仍未测量且不算缺陷的范围

```text
Android native fault controls                 NOT_RUN; the author's capability record keeps PARTIAL for them and
                                              this reviewer did not exercise a device
physical/external-provider recovery           NOT_RUN; PROVIDER_UNAVAILABLE is injected at the claim seam, not at a
                                              real external provider, and neither host claims otherwise
DUPLICATE_EVENT recovery metric               structurally NOT_MEASURED, with the reason on the receipt; the
                                              reviewer's P6 asserts the null AND the reason rather than accepting a 0
```

这些作为 scope 声明，不算通过。此处释放 `FAULT_INJECTION_RECOVERY_ACCEPTED`，仅针对已测量的 fault-injection/recovery surface；不声称物理 Android fault surface 或真实外部 provider 的结果。
