# REX-803 作者第三轮类别扫描（Mech，2026-10-06）

[English source / 英文原文](../AUTHOR_THIRD_CLASS_SWEEP.md)。阅读译本保留该历史快照；原证据代码块逐字保留，current task authority 不变。

```text
AUTHOR              Mech (COMPUTERNAME MEGA-REP), role Mech-DS, development_host for REX-803
TARGET              the recorded review target a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df — UNCHANGED
                    (branch rex/REX-803-mech-scenario-runner and PR #31 still point at it)
BRANCH              repair/REX-803-mech-receipt-order-and-close @ 07e8c3cf31e9aefdb4d12c58e129da39935c8314
                    two commits: the probes alone, then the repair
WHAT THIS IS        an AUTHOR SELF-TEST. Not review evidence, not a verdict, no marker. The head did not move,
                    so a reviewer claiming at the recorded target cannot be overtaken.
WHY IT EXISTS       the opposite host's MON-903 review found EIGHT failures that this author's own class-driven
                    pass on that module had not looked for at all, because they were state-machine and lifecycle
                    defects. That was recorded as the structural limit of a class-driven sweep. This pass takes the
                    REVIEWER's classes and points them at the largest module this author still owns.
```

## 1. 类别与三个 finding

```text
red run on a695bb9 (probes only)      tests 4   pass 1   fail 3
```

| 类别 | Finding | a695bb9 实测症状 |
|---|---|---|
| L6 有界集合按非年龄 key 排序 | F-S6 campaign receipt list | receipts() readdirSync/filter/sort/slice(-receiptLimit)，文件名 campaign-random UUID，排序 random identity。六 campaign 名字顺序与 age 相反，返回最旧三条，但注释说 newest by name order |
| L1b 截断 list 不说明截多少 | F-S7 同 list | disk 七 campaign，只返回三，任何 surface 都不披露 history size；同 MON-903 failure log/metrics window |
| L7entry 忽略 closed/shutdown 边界 | F-S8 close 后 start | close 清理并 drain loop；start 仍接受并 launch 新 RUNNING campaign 进入 shutdown process |

F-S6 与对侧在 MON-903 receipt prune 的 UUID 排序缺陷同类、同作者不同 module，仅因刻意迁移类别才发现。F-S8 与 reviewer 发现 observe 忽略 overlay close 相同。

此 branch CI 先失败后成功，失败 attempt 保留：未改的 cex701-recovery-ui.test.mjs31.2s browser timeout，§4 通过同 head local 与相同 job rerun 分类。只记录绿隐藏红会丢掉仪器可靠性证据。

## 2. Probe 有意义前必须修 fixture

L6 初稿在缺陷代码上通过：顺序 identifier-000000000000 到-000000000005 使 name order 恰等 age，排序侥幸正确。提交 fixture 使 lexicographic order 与 age 相反，符合真实 UUID，才出现 red：

```text
actual:   [ campaign-dddddddd-…, campaign-eeeeeeee-…, campaign-ffffffff-… ]   <- the three OLDEST
expected: [ campaign-aaaaaaaa-…, campaign-bbbbbbbb-…, campaign-cccccccc-… ]   <- the three NEWEST
```

这是 programme 第四次 instrument error、同类第二次：fixture 可偶然同意 implementation 则什么也没测。类似声称八 trap 却放六的扫描，以及 construction 后才埋 fault、在 broken tree 通过的 regression probe。

## 3. 修复

```text
services/dev-gateway/scenario-runner.mjs
  receipts() orders by the record's OWN age (finishedAt, then startedAt, then the file's mtime for an unreadable
  receipt) and sorts NEWEST FIRST before applying the bound
  receiptWindow() returns {receipts, total, limit, truncated}
  close() sets a closed flag; start() refuses with a typed RUNNER_CLOSED (409); closed() reports it
services/dev-gateway/server.mjs
  the campaign list route publishes receiptWindow beside the existing receipts array, which is kept for callers
  that only want the rows
tests/rex803-third-class-sweep.test.mjs   (NEW, 4 probes)
```

probe commit 先于 fix，red run 是真实 history 而非事后宣称。

## 4. 测量

```text
NEW PROBES                 4/4 on the repair; the same 4 give 1 pass / 3 fail on a695bb9 (recorded in §1)
REX-803's own four suites  22/22
FULL SUITE                 1370/1374
  3 failures   host-city-launcher — the resident City on this machine holds the host reservation (a genuine
               host condition, not the change)
  1 failure    tests/relay-s1-tunnel.test.mjs "S1: a pipe that never stops is rate-limited" at 3081 ms
               CLASSIFIED as the known load-sensitive burst flake, not the change: the file passes 12/12 in
               isolation on this very head, and the repair touches the scenario runner and one server route line
               that the relay suite never exercises. Rerun-to-classify, recorded rather than averaged away
CI (exact head)  V0.2 checks push run 37418750045 on 07e8c3c, read per run from the Actions API and matched on
                  headSha. ATTEMPT 1 FAILED (gateway-web) and ATTEMPT 2 SUCCEEDED, and both are recorded because
                  the failed attempt is part of the evidence:
                    attempt 1  gateway-web FAILURE — tests/cex701-recovery-ui.test.mjs "CEX701 session sees only
                               own installation and actionable owner guidance" at 31 222 ms; android success
                    attempt 2  gateway-web success, android success
                  CLASSIFICATION: a load-sensitive browser timeout, not the change. Evidence, gathered before the
                  rerun rather than after: the same test PASSED on this exact head inside the author's own full
                  suite at 6 459 ms, and PASSES in isolation on this exact head in 1 368 ms (the whole file 3/3);
                  the 31.2 s runtime is ~23x the isolated figure and sits just past Playwright's 30 s default; the
                  change touches services/dev-gateway/scenario-runner.mjs and one added field on the campaigns list
                  route, neither of which CEX701 exercises; and the rerun of the identical head and job succeeded.
                  This is the same instrument class this host has now recorded three times (the MON-903 push run's
                  31.3 s BLE bootstrap, a web-services assertion that failed only under full-suite load, and this).
```

完整套件按 ci.yml 双 install（root+city）测量；此前两长期“environment failure”实为本机缺 city install，已经更正。

### 该 instrument 类别已有 remedy，本机已验证

对侧 MON-903 改 root script 为 node --test --test-concurrency=2 tests/*.test.mjs，称有界 browser concurrency 不丢 checks。本机实际验证：同 head 有 bound1386 tests/1383 pass，无 bound 同 1386/1383，无 skip。上述 fail 正是 bound 针对类别。改动在 review/MON-903-Alien-20261006 尚未 main；落地后应重测本 module CI，该类 failure 很可能不再出现。第三次 instrument flake 从坏运气转为缺 mitigation，故记录。

## 5. 本轮明确不做

```text
DOES NOT   move REX-803's head, workbook, review target, claim or marker
DOES NOT   count as review evidence, answer a verdict, or claim the reviewer would find these
DOES NOT   touch main
LEAVES     the adoption decision to whoever reviews REX-803 — the branch is published beside the recorded target
```

保持 target 而不 hardening，因为 REX-803 已有 claim collision，handoff 指 a695bb9；现在移动会把领取 Reviewer 置于碰撞记录相同境地。作者可应请求 harden，或 Reviewer 采纳此 branch 到自身 review head，均一命令。

## 6. 诚实限制

- 三 finding 不是健康证明。该 module Reviewer 当时未运行；MON-903 Reviewer 八 failure 对作者四。
- 此轮只覆盖 receipt handling、bounded list、close boundary；不重推 real-task campaign path、seed/replay 或 physical gate，这些由既有 suite/physical campaign 覆盖，非本轮。
- F-S6 误导 list，不丢数据，本 module 不删 receipt；与 MON-903 同类会删除的版本区分。
