# WBC-604 baseline resolution / 依赖 SHA 并集解析

```text
CLAIMANT            Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ANCHOR MODE         DEPENDENCY_SHA_UNION_AT_CLAIM
DEPENDENCY          WBC-603  (accepted head f3510862cc348a99004ca5bd5d151a7b56279724)
REQUIRED ANCESTOR   9f3e20e8ec99d591812430bee71d27e68c4ad498
ELIGIBLE BASE       refs/heads/main -> 1a26d7499d3de39b19c3136c3032e8ccd9343428
UNION RESULT        1a26d7499d3de39b19c3136c3032e8ccd9343428  (the base already contains the dependency, so no merge had to be constructed)
ANCESTRY VERIFIED   git merge-base --is-ancestor exit 0 for both SHAs against the resolved base
DEPENDENCY SMOKE    node --test tests/wbc60{1,2,3}-*.test.mjs -> 32 pass / 0 fail at the baseline
WORKTREE            D:/utopia-wbc604   BRANCH wbc/WBC-604-mech-execution-profile-switch
```

## What was verified rather than assumed

Both SHAs the workbook declares were checked against the resolved base with `git merge-base --is-ancestor` and both
exited 0, so there is no `BASELINE_ANCESTRY_MISMATCH`. Because main already carries WBC-603's accepted work (merged as
`3cd45f665b09b20690f05338ba7cec386ad0f486`), the dependency union for this task is the base itself: nothing was
constructed, and no `git merge` was run at claim time. The dependency smoke was executed before any product change and
passed 32/32, which is the evidence that the capability this task builds on is healthy at the claimed commit.

## Remaining work

WBC-604's own scope is the three-profile contract (STANDARD_DEVICES / WORKER_POOL / HYBRID), a runtime profile switch
with a stable control surface and safe persistence, HYBRID routing precedence, and the fail-safe/rollback behaviours
listed in its workbook section "Fail-safe / rollback". Development happens on the branch above; the terminal marker
`EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED` is NOT released by this claim.
