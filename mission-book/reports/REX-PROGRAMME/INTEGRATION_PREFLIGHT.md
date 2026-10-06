# REX 集成前置测量 / REX integration preflight

2026-10-06，Mech-DS（`MEGA-REP`）。这是一次**测量**，不是向 main 的合并：目标是把“REX-803 被接受之后，集成到底难在哪”这个问题在门槛之前回答掉。 / A measurement, not a merge to main: the point is to answer "what will integration actually cost once REX-803 is accepted" before the gate, not after it.

## 测什么 / What was measured

从**当时最新** main `b06504f` 出发，分别测三条路径的合并结果（§11 要求集成从当时最新 main 开始，禁止拿旧 main 一路做到最终 merge）： / From the then-latest main `b06504f`, three merge paths:

```text
rex/REX-804-Alien-codex-faults        -> main 单独 / alone     CLEAN，无冲突 / no conflicts
rex/REX-803-mech-scenario-runner      -> main 单独 / alone     CLEAN，无冲突 / no conflicts
两者同时 / both together                                     CONFLICT x2，均在 services/dev-gateway/server.mjs
```

这是本轮真正的发现：**两个已接受/候选的 REX 产物各自都能干净进 main，合在一起却不能自动合并**。若按“先接受 803、再集成 804”的顺序机械执行，冲突会在最不方便的时候出现。 / The finding: each REX product merges cleanly on its own; together they do not. Integrating mechanically in acceptance order would surface this at the worst moment.

## 冲突是什么形状 / The shape of the conflict

两处，都是 §11 第 2 条点名的 union/superset 情形，而不是语义分歧： / Two hunks, both the union/superset case, not a semantic disagreement:

```text
hunk 1  构造期定义点 / construction site
        HEAD   (REX-804)  faults=createFaultController({dir, node, trace:researchTrace})
        803              campaigns=createScenarioRunner({...}) 及整段 campaign 说明与上下文
        UNION  两者都要 / keep both

hunk 2  server 的单一 return / the single return
        HEAD   (REX-804)  ...researchTrace, faults, ... close(){ faults.close(); ... }
        803              ...researchTrace, campaigns, ... close(){ await campaigns.close({reason:'CITY_SHUTDOWN'}); ... }
        UNION  一个 return 同时暴露 faults 与 campaigns，teardown 同时释放两者 / both capabilities, both releases
```

判定依据是**互相不引用**：fault controller 的构造参数里没有 campaign（`services/dev-gateway/research/faults.mjs` 全文无 `campaigns`），campaign 段也没有引用 `faults`，因此两处并集与顺序无关，无需协调共享状态。 / Neither side references the other - the fault controller takes no campaign and the campaign block touches no fault store - so the union is order-independent with no shared state to reconcile.

hunk 2 有一个现成的警告在文件里：该 return 上方注释写着“第一次机械尝试在这里留下两个 return，把 `researchTrace` 悄悄藏在了前一个后面”。并集必须保持**单个 return**，把两边的能力都枚举出来。 / The file's own comment above the return records that a previous mechanical attempt left two returns and silently hid `researchTrace`; the union keeps one return enumerating both sides.

## 测量结果 / Result

分支 / branch `integration/REX-803-804-mech-preflight` @ `cd43572`（main `b06504f` + 上述并集）：

```text
focused   tests/rex803-*.test.mjs + tests/rex804-*.test.mjs        34 pass / 0 fail
full      pnpm test                                              1390 pass / 3 fail / 1393
          3 项均为 tests/host-city-launcher.test.mjs（本机常驻 City 占用 host reservation），与既有 N/N-3 基线一致
          the 3 are the known host-reservation failures, matching the established N/N-3 baseline
```

## 这轮顺带发现的真实缺陷 / A real defect this preflight surfaced

在跑并集的全量套件时发现：**全量套件跑完后 tracked tree 是脏的**—— `evidence/raw/mission-book/REX-804/danger-zone.png` 被改写。追进去是已接受的 REX-804 里的一处缺陷：`tests/rex804-web.test.mjs:9` 把自己的截图写进了**已提交**的证据路径，每次运行都会替换被评审过的证据，并把绿了的 tree 留脏。 / Running the union's full suite left the tracked tree dirty: `tests/rex804-web.test.mjs:9` wrote its screenshot into a COMMITTED evidence path, so every run replaced reviewed evidence and left a green run dirty.

完整记录 / full record：`reports/REX-804/TEST_MUTATES_COMMITTED_EVIDENCE.md`；修复 / repair：`repair/REX-804-mech-test-evidence-outside-repo @ 690d723`（待采纳 / awaiting adoption）。

修复并入并集后 / with the repair merged into the union，`integration/REX-803-804-mech-preflight-with-evidence-repair @ 0492dfd`：

```text
focused   tests/rex803-*.test.mjs + tests/rex804-*.test.mjs        34 pass / 0 fail，跑后 CLEAN
full      pnpm test                                              1390 pass / 3 fail / 1393，跑后 CLEAN
```

也就是说：**「全量绿」与「跑完全量后 tree 干净」是两件不同的事，而这个缺陷正好落在两者之间**——套件在两种状态下都是 1390/1393，只有修复后的那个状态在结束时是干净的。 / A green full suite and a clean tree after a green full suite are two different properties, and this defect sat exactly between them: both states give 1390/1393; only the repaired one ends clean.

## 这轮**没有**做什么，以及为什么 / What this round did NOT do

- **没有合并进 main。** 本机对 REX 没有合并授权；本轮目标授予的合并窗口是 CEX（已用）与 WBC（已用），REX 的集成窗口尚未开启。这条前置测量的价值就在于：等窗口开启时它是机械的。 / No merge to main: this host holds no REX merge authority and no REX merge window has been granted. The value of the preflight is that the eventual step becomes mechanical.
- **没有把 REX-803 当作已接受。** `review_complete` 仍为 false，标记仍由对侧主机持有；此分支不改变任何工作书字段。 / REX-803 is not treated as accepted and no workbook field changes.

## 与 WBC 那条规则的呼应 / Echoes the WBC rule

WBC 系列在 `DEFECT_RESEARCH_STORE_HARDENING.md` 里确立过一条规则：**修复必须在合并结果上测量，而不是在自己的旧 base 上**——对一个没人会运行的 commit 保持绿色不构成证据（该规则来自 B4，由 F-3 修复重发到当前 main 之上而落实）。本条前置测量是同一规则在集成方向上的推广： / The WBC programme established that a repair must be measured on the merge result, not on its own old base; a green branch against a commit nobody will run is not evidence. This preflight generalises that rule in the integration direction:

> **一条 branch 单独能进 main，不构成“多条 branch 能一起进 main”的证据。** / A branch that merges cleanly on its own is not evidence that several branches merge cleanly together.
