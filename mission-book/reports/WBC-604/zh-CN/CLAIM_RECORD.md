# WBC-604 基线解析／依赖SHA联合

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；历史和未完成项原样保留，代码证据不替代验收。

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

领取者Mech／MEGA-REP、Mech-DS，模式DEPENDENCY_SHA_UNION_AT_CLAIM。依赖WBC603接受头f3510862cc348a99004ca5bd5d151a7b56279724，必要祖先9f3e20e8ec99d591812430bee71d27e68c4ad498。解析main及联合同为1a26d7499d3de39b19c3136c3032e8ccd9343428，基线已含依赖无需构造合并；两SHA祖先exit0。基线变更前依赖32/0；工作树D:/utopia-wbc604及分支如记录。

## 核验而非假设

两个声明SHA都用git merge-base --is-ancestor相对解析基线检查exit0，因此无BASELINE_ANCESTRY_MISMATCH。main已含以3cd45f665b09b20690f05338ba7cec386ad0f486合并的WBC603接受工作，联合就是基线，领取时未构造／运行git merge。产品变更前32/32冒烟证明领取提交所依赖能力健康。

## 剩余工作

WBC604范围为STANDARD_DEVICES／WORKER_POOL／HYBRID三profile契约、稳定控制面与安全持久化的运行切换、HYBRID路由优先级，以及工作书Fail-safe / rollback行为。开发在上述分支，领取不发布EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED。

语言配对 / Language pair: [English](../CLAIM_RECORD.md) · [中文](./CLAIM_RECORD.md)
