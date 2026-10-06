# REX-803 baseline resolution / 依赖 SHA 解析

```text
CLAIMANT            Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ANCHOR MODE         as declared by the workbook, resolved against refs/heads/main
DEPENDENCIES        REX-801  7e96a4d28f4cb701d7a0951bace69857c3228f32   (in main)
                    REX-802  833279cae237080cca88b1b6dbc9f217027ba68f   (in main)
RESOLVED BASELINE   213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
UNION               not required - the base already contains both accepted dependency heads
DEPENDENCY SMOKE    node --test tests/rex801-experiment-manifest.test.mjs tests/rex802-{gateway,trace}.test.mjs
                    -> 23 pass / 0 fail at the baseline, run before any product change
WORKTREE            D:/utopia-rex803   BRANCH rex/REX-803-mech-scenario-runner
```

## Why no union was built

Both dependencies were already accepted and already merged, so the baseline is simply the current `main`. The smoke run
is the evidence that the capability this task builds on is healthy at that exact commit, and it was executed before any
REX-803 product file was touched.

## Remaining work

REX-803's own scope (scenario definitions, a repetition engine, bounded runs and their receipts) is developed on the
branch above. The terminal marker is NOT released by this claim, and the opposite-host Formal Review the programme
requires remains outstanding.


[完整中文阅读译本 / Chinese reading translation](./zh-CN/CLAIM_RECORD.md)
