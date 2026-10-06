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
