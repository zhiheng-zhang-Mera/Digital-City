# REX-803 基准解析与依赖 SHA

[English source / 英文原文](../CLAIM_RECORD.md)。阅读译本不改变当前工作书 authority。

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

## 为什么未建立 union

两依赖已 accepted 并 merged，因此 baseline 就是当前 main。smoke 证明所依赖能力在该 exact commit 健康，且在任何 REX-803 产品文件修改前运行。

## 剩余工作

REX-803 自身 scope（scenario 定义、repetition engine、有界 run 及 receipt）在上述分支开发。此 claim 不释放 terminal marker，programme 要求的 opposite-host Formal Review 仍待执行。
