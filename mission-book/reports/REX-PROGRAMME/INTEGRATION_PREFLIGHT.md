# REX 集成前置测量 / REX integration preflight

2026-10-06，Mech-DS（`MEGA-REP`）。这是一次**测量**，不是向 main 的合并：目标是把“REX-803 被接受之后，集成到底难在哪”这个问题在门槛之前回答掉。 / A measurement, not a merge to main: the point is to answer "what will integration actually cost once REX-803 is accepted" before the gate, not after it.

## 更正：第一版测错了 head / Correction: the first version measured the wrong head

第一版前置测量合并的是 `rex/REX-803-mech-scenario-runner`，即**开发分支**。REX-803 被接受之后核对才发现：接受的身份是 `8798ba9dd37051626033ad72080b2fad3ff66149`，而开发分支 tip 是 `a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df`——**a695bb9 是 8798ba9 的祖先，整整落后 14 个提交**，缺的正是：

```text
07e8c3c  fix(rex803): order the campaign list by age, say how much history it hides, and fence a closed runner
42acdc6  fix(rex803): a campaign actually places a repetition on the worker its seed selects
ee3479d  REX-803: fence resumed context and cleanup, validate recovery, bound shutdown
         (+ 两 worker 演练、third-class sweep、以及 main/CEX-790 的合并)
```

也就是说，按“把任务分支合进来”的机械做法，会把一个**从未被验收的头**、而且是缺了种子/放置修复的头，当成 REX-803 集成进去。本报告的全部数字已按接受身份重测；被取代的两个分支保留在 origin 上作为历史，但**不要**作为集成来源。 / A mechanical "merge the task branch" would have integrated a head that was never accepted - and that lacks the seed/placement repair. Everything below is re-measured on the accepted identities.

```text
已被取代 / superseded   integration/REX-803-804-mech-preflight @ cd43572                （开发分支测出的结果）
已被取代 / superseded   integration/REX-803-804-mech-preflight-with-evidence-repair @ 0492dfd
集成来源 / integration source  integration/REX-accepted-heads-mech-preflight @ 704c518
                               parents = 8798ba9 (accepted REX-803) 与 fe700ab (accepted REX-804)
```

## 测什么 / What was measured

从**当时最新** main `b06504f` 出发，用**已接受的**身份分别测三条路径（§11 要求集成从当时最新 main 开始，禁止拿旧 main 一路做到最终 merge）： / From the then-latest main `b06504f`, three merge paths using the **accepted** identities:

```text
8798ba9 已接受 REX-803 -> main 单独 / alone        CLEAN，无冲突 / no conflicts
fe700ab 已接受 REX-804 -> main 单独 / alone        CLEAN，无冲突 / no conflicts
两者同时 / both together                          CONFLICT x2，均在 services/dev-gateway/server.mjs
```

这是本轮真正的发现：**两个已接受的 REX 产物各自都能干净进 main，合在一起却不能自动合并**。若按接受顺序机械执行，冲突会在最不方便的时候出现。 / The finding: each accepted REX product merges cleanly on its own; together they do not. Integrating mechanically in acceptance order would surface this at the worst moment.

## 冲突是什么形状 / The shape of the conflict

两处，都是 §11 第 2 条点名的 union/superset 情形，而不是语义分歧（接受身份下两侧角色互换，形状不变）： / Two hunks, both the union/superset case, not a semantic disagreement (with the accepted heads the two sides swap roles; the shape does not change):

```text
hunk 1  构造期定义点 / construction site
         REX-803  campaigns=createScenarioRunner({...}) 及整段 campaign 说明与上下文
         REX-804  faults=createFaultController({dir, node, trace:researchTrace})
         UNION    两者都要 / keep both

hunk 2  server 的单一 return / the single return
         REX-803  ...researchTrace, campaigns, ... close(){ await campaigns.close({reason:'CITY_SHUTDOWN'}); ... }
         REX-804  ...researchTrace, faults, ... close(){ faults.close(); ... }
         UNION    一个 return 同时暴露 campaigns 与 faults，teardown 同时释放两者 / both capabilities, both releases
```

判定依据是**互相不引用**：fault controller 的构造参数里没有 campaign（`services/dev-gateway/research/faults.mjs` 全文无 `campaigns`），campaign 段也没有引用 `faults`，因此两处并集与顺序无关，无需协调共享状态。 / Neither side references the other - the fault controller takes no campaign and the campaign block touches no fault store - so the union is order-independent with no shared state to reconcile.

hunk 2 有一个现成的警告在文件里：该 return 上方注释写着“第一次机械尝试在这里留下两个 return，把 `researchTrace` 悄悄藏在了前一个后面”。并集必须保持**单个 return**，把两边的能力都枚举出来。 / The file's own comment above the return records that a previous mechanical attempt left two returns and silently hid `researchTrace`; the union keeps one return enumerating both sides.

## 测量结果 / Result

集成来源分支 / integration source `integration/REX-accepted-heads-mech-preflight` @ `704c518`（main `b06504f` + 已接受 803 `8798ba9` + 已接受 804 `fe700ab`，两个接受身份都是该提交的父提交）：

```text
focused   tests/rex803-*.test.mjs + tests/rex804-*.test.mjs        48 pass / 0 fail（13 个套件）
          —— 接受身份的 REX-803 比开发分支多 4 个套件（alien-review / critic-review / third-class-sweep /
             two-worker-rehearsal），这也从另一面说明开发分支不是集成来源
full      pnpm test                                              1404 pass / 3 fail / 1407
          3 项均为 tests/host-city-launcher.test.mjs（本机常驻 City 占用 host reservation），与既有 N/N-3 基线一致
          the 3 are the known host-reservation failures, matching the established N/N-3 baseline
```

首次全量运行还出现过第 4 个红项 `tests/relay-s1-tunnel.test.mjs:420`（“a sustained burst is refused with 429”）。**已查明它不是本次合并引入的**，重跑即消失： / A fourth failure appeared once in the first full run and vanished on the repeat - classified, not waved away:

```text
限流规则 / the limiter (services/dev-gateway/server.mjs:93,225)
  1000 ms 滑动窗口内第 21 个请求才 429（RELAY_REQUESTS_PER_SECOND=20）
探针做法 / the probe (tests/relay-s1-tunnel.test.mjs:418)
  顺序 await 发 30 个请求，要求其中至少一个 429
  => 只有当前 21 个请求平均快于约 48 ms 时才会触发；主机一忙，窗口就追不上，断言失败而限流器完全正常
证据 / evidence
  并集第一次 1407/1403/4，重跑 1407/1404/3（同一次提交）
  main 基线单独跑 1359/1356/3，红项正是同样那三个 launcher
  并集**没有**改动 tests/relay-s1-tunnel.test.mjs，也没有改动 relayRate / RELAY_REQUESTS_PER_SECOND /
  executeRelayPayload（逐行比对与 main 相同）
```

这是一条**属于 main 自身的、随主机速度漂移的探针**：它把“限流器是否生效”写成了“主机是否足够快”。本系列已多次记录同类仪器缺陷；此处只做分类与证据，不主张修复属于本任务。 / A host-speed-dependent probe in main's own suite: it turns "does the limiter work" into "is the host fast enough". Classified here with evidence; repairing it is not claimed as this task's work.

## 这轮顺带发现的真实缺陷 / A real defect this preflight surfaced

在跑并集的全量套件时发现：**全量套件跑完后 tracked tree 是脏的**—— `evidence/raw/mission-book/REX-804/danger-zone.png` 被改写。追进去是已接受的 REX-804 里的一处缺陷：`tests/rex804-web.test.mjs:9` 把自己的截图写进了**已提交**的证据路径，每次运行都会替换被评审过的证据，并把绿了的 tree 留脏。 / Running the union's full suite left the tracked tree dirty: `tests/rex804-web.test.mjs:9` wrote its screenshot into a COMMITTED evidence path, so every run replaced reviewed evidence and left a green run dirty.

完整记录 / full record：`reports/REX-804/TEST_MUTATES_COMMITTED_EVIDENCE.md`；修复 / repair：`repair/REX-804-mech-test-evidence-outside-repo @ 690d723`（待采纳 / awaiting adoption）。

修复并入**按接受身份重测的**并集后 / with the repair merged into the union measured on the accepted identities，`integration/REX-accepted-heads-mech-preflight-with-evidence-repair @ 56b9752`：

```text
focused   tests/rex803-*.test.mjs + tests/rex804-*.test.mjs        48 pass / 0 fail，跑后 CLEAN
full      pnpm test                                              1404 pass / 3 fail / 1407，跑后 CLEAN
对比 / vs 未含修复的同一个并集（56b9752 的父提交 704c518）：同样 1404/1407，但跑完后 tracked state 是脏的
```

也就是说：**「全量绿」与「跑完全量后 tree 干净」是两件不同的事，而这个缺陷正好落在两者之间**——两种状态下测试结果完全相同，只有含修复的那个状态在结束时是干净的。 / A green full suite and a clean tree after a green full suite are two different properties, and this defect sat exactly between them: both states give the same test result; only the repaired one ends clean.

**测量卫生说明 / a note on my own measurement hygiene：** 我第一次在 56b9752 上读到的“脏”是**上一轮遗留**的脏文件（未修复的并集跑完后没恢复），不是修复后产生的。恢复文件、从干净状态重跑，才得到上面的 CLEAN。同一误读在本轮出现两次，记录在此：**先看基线是否干净，再跑，再看结果**。 / The first "dirty" reading at 56b9752 was stale dirt left by the previous unrepaired run, not produced by the repaired one. Recorded because the same misread happened twice this round.

## 这项发现适用于所有已接受任务：任务分支不是集成来源 / It is not REX-only: the task branch is not the integration source

把同一个问题问遍 32 本记录过 reviewed head 的工作书（工具与完整结果 / tool and full results：`reports/INTEGRATION_SOURCE_SWEEP_MECH.md`）：

```text
31 项已验收任务 / accepted tasks
  tip 超前或分叉于已验收头 / tip AHEAD of or DIVERGED from the accepted head   1  -> JOIN-590（tip 比已验收头多一个
                                                                                    删除证据的未评审提交）
  tip 落后于已验收头 / tip BEHIND the accepted head                            3  -> MON-902, MON-903, REX-803
  已验收头不在任何远端 ref 上 / accepted head on NO remote ref                  1  -> UI-000
```

> **“把任务分支合进来”不是一条集成规则。** 集成来源必须是工作书里记录的那个被验收的确切提交。

## 这轮**没有**做什么，以及为什么 / What this round did NOT do

- **没有合并进 main。** 本机对 REX 没有合并授权（工作书 `merge_authority: false`）；本轮目标授予的合并窗口是 CEX（已用）与 WBC（已用），REX 的集成窗口尚未开启。这条前置测量的价值就在于：等窗口开启时它是机械的。 / No merge to main: this host holds no REX merge authority (the workbook records `merge_authority: false`) and no REX merge window has been granted. The value of the preflight is that the eventual step becomes mechanical.
- **没有改动 relay 那条漂移探针。** 它是 main 自身的仪器缺陷（见上），修复不属于本任务；此处只做分类与证据。 / The drifting relay probe was not modified: it is main's own instrument defect and repairing it is not this task's work.

## 与 WBC 那条规则的呼应 / Echoes the WBC rule

WBC 系列在 `DEFECT_RESEARCH_STORE_HARDENING.md` 里确立过一条规则：**修复必须在合并结果上测量，而不是在自己的旧 base 上**——对一个没人会运行的 commit 保持绿色不构成证据（该规则来自 B4，由 F-3 修复重发到当前 main 之上而落实）。本条前置测量是同一规则在集成方向上的推广： / The WBC programme established that a repair must be measured on the merge result, not on its own old base; a green branch against a commit nobody will run is not evidence. This preflight generalises that rule in the integration direction:

> **一条 branch 单独能进 main，不构成“多条 branch 能一起进 main”的证据。** / A branch that merges cleanly on its own is not evidence that several branches merge cleanly together.
