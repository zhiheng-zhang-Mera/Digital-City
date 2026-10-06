# MON-903 基线解析与领取 — Mech

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态。保留历史与未知边界，原证据块保留代码围栏，不新增验收。

Mech MEGA-REP、Mech-DS，依SHA联合按字面解析；已接受901已main祖先，所以无需union，workbook未声明required ancestor。精确main改前smoke8／0，隔离worktree/branch：

```text
CLAIMANT            Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ANCHOR MODE         DEPENDENCY_SHA_UNION_AT_CLAIM, resolved literally
DEPENDENCY          MON-901  7eb38f1b930dfe6cc13dab0e17dedee467b1254b  (ACCEPTED head, already an ancestor of main)
ELIGIBLE BASE       refs/heads/main = 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
UNION               not required - the eligible base already contains the accepted dependency head
REQUIRED ANCESTORS  none declared by this workbook
DEPENDENCY SMOKE    node --test tests/mon901-observation.test.mjs  ->  8 pass / 0 fail
                    executed at 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef BEFORE any MON-903 product file was touched
WORKTREE            D:/utopia-mon903   BRANCH mon/MON-903-mech-decision-overlay
```

## 领取时测量（写本记录前）

```text
Digital-City origin/main                      f41ff97   (fetched immediately before the claim; MON-903 was still
                                              status READY with development_host null and no competing claim)
Utopia origin/main                            213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
dependency head in main                       git merge-base --is-ancestor 7eb38f1b930dfe6cc13dab0e17dedee467b1254b
                                              origin/main  ->  exit 0  (ANCESTOR_OK)
dependency smoke instrument note              a fresh worktree has no node_modules, so `npm ci` was run before the
                                              smoke; that is an environment step, not part of the measurement
```

中文对应control main f41ff97领取前新fetch、903 READY/dev host null/无竞争；product213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef；901祖先exit0 ANCESTOR_OK；fresh worktree先npm ci属环境步骤，非测量。原子过程沿REX803碰撞后采用：写前fetch、确认未领取、写并同step push。不覆他主机任何字段。

## 为什么903、为什么现在（按Owner规则记录选择）

standing order research-strengthening升code先，再city-work-monitor；SHOW排。此时本主机research无合格next：

```text
REX-803  development complete on 57d1c919; its opposite-host Formal Review (review_host must be Alien) is not started
REX-804  Mech review performed and RETURNED FOR REPAIR (blocking finding B1); the author's repair is pending
REX-805  WAITING_DEPENDENCIES on REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED
REX-806  WAITING_DEPENDENCIES on REX-803/REX-804/REX-805
REX-807  WAITING_DEPENDENCIES on REX-806
REX-890  WAITING_DEPENDENCIES on the whole series
```

中文对应803开发57d1c919 complete但Alien Formal Review未起；804 Mech review RETURNED FOR REPAIR、B1阻塞、作者待修；805等803 marker；806等803/804/805；807等806；890等全系列。后research都等对侧主机或本机不能提供实体拓扑（Alien node offline）。扫25workbook恰一READY/enabled/unclaimed＝903；单依901已accepted/main，因此遵Owner而非跳序。

## 剩余工作

903事件触decision overlay、逐task queue、rule-first、有界receipt、timeout/fallback、user-visible provenance、无global barrier在上述分支开发。本claim不释放终端，merge_authority false、对侧Formal Review outstanding。

语言配对 / Language pair: [English](../CLAIM_RECORD.md) · [中文](./CLAIM_RECORD.md)
