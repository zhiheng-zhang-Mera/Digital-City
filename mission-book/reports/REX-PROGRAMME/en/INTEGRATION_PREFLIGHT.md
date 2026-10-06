> English reading translation / 英文阅读译本. The [source document](../INTEGRATION_PREFLIGHT.md) remains authoritative for historical facts, status, and evidence. This reader grants no additional task, acceptance, merge, or deployment authority.

# REX integration preflight

2026-10-06, Mech-DS (`MEGA-REP`). This is a **measurement**, not a merge into main. Its purpose is to answer “where will integration actually be difficult after REX-803 is accepted?” before reaching the gate, rather than afterward.

## Correction: the first version measured the wrong head
The first preflight merged `rex/REX-803-mech-scenario-runner`, the **development branch**. Checking after REX-803 was accepted revealed that the accepted identity was `8798ba9dd37051626033ad72080b2fad3ff66149`, while the development branch tip was `a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df`. **a695bb9 is an ancestor of 8798ba9, fully 14 commits behind**, missing precisely:

```text
07e8c3c  fix(rex803): order the campaign list by age, say how much history it hides, and fence a closed runner
42acdc6  fix(rex803): a campaign actually places a repetition on the worker its seed selects
ee3479d  REX-803: fence resumed context and cleanup, validate recovery, bound shutdown
         (+ 两 worker 演练、third-class sweep、以及 main/CEX-790 的合并)
```

Thus, mechanically “merging the task branch” would integrate a **never-accepted head**, one missing the seed and placement repairs, as REX-803. Every number in this report has been remeasured on the accepted identity. The two superseded branches remain on origin as history, but **must not** be used as integration sources.

```text
已被取代 / superseded   integration/REX-803-804-mech-preflight @ cd43572                （开发分支测出的结果）
已被取代 / superseded   integration/REX-803-804-mech-preflight-with-evidence-repair @ 0492dfd
集成来源 / integration source  integration/REX-accepted-heads-mech-preflight @ 704c518
                               parents = 8798ba9 (accepted REX-803) 与 fe700ab (accepted REX-804)
```

## What was measured
Starting from the **then-latest** main `b06504f`, three paths were measured using the **accepted** identities. Section 11 requires integration to begin from the then-current main and forbids carrying an old main all the way through to the final merge:

```text
8798ba9 已接受 REX-803 -> main 单独 / alone        CLEAN，无冲突 / no conflicts
fe700ab 已接受 REX-804 -> main 单独 / alone        CLEAN，无冲突 / no conflicts
两者同时 / both together                          CONFLICT x2，均在 services/dev-gateway/server.mjs
```

This is the actual finding this round: **each of the two accepted REX products merges cleanly into main alone, but together they cannot merge automatically**. Mechanical execution in acceptance order would expose conflicts at the least convenient moment.

## Shape of the conflict
Two hunks, both union/superset cases explicitly named by §11 item 2, rather than semantic disagreements. With the accepted identities, the sides exchange roles but the shape remains the same:

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

The basis is **absence of references to each other**: the fault controller's constructor parameters contain no campaign (`services/dev-gateway/research/faults.mjs` contains no `campaigns` anywhere), and the campaign block does not reference `faults`. Therefore the unions in both hunks are order-independent, with no shared state to reconcile.

## Extended to the third product: the REX-805 candidate
The REX-805 candidate head `4b39468` (`rex/REX-805-alien-replay-ablation`, PR #38, authored by the opposite host, **not yet accepted**) is now included in preflight measurement for the same reason as 803/804: integrating for the first time only after acceptance leaves conflicts to the least convenient moment.

```text
4b39468 -> main b06504f 单独 / alone                  FAST-FORWARD，无冲突
         main 是候选头的祖先（它比 main 多 15 个提交），所以“合并 REX-805 分支”根本不是一次合并，
         而是把 main 直接移到候选头上
4b39468 -> 已接受并集 803+804 @ 704c518               一处冲突，services/dev-gateway/server.mjs
         与之前同一个 union 位点：已接受并集保留 fault controller，候选头加入 replay engine
         两者互不引用 => 并集 = 三者都要（campaign surface + fault controller + replay engine）
```

**That fast-forward is the sharpest illustration of the rule that the integration source must be the commit accepted in the workbook**: integration by branch name here would not merely include one additional commit; it would **replace the entire main with the candidate head**.

**Remeasured after the candidate moved:** the author subsequently pushed `0261a9e`, repairing empty-limit-set comparison and rebinding the gate to that head. The union was therefore remeasured; the repair falls in the very file requiring union resolution.

```text
0261a9e -> 已接受并集 803+804 @ 704c518              一处冲突，同样是 services/dev-gateway/server.mjs 的 union 位点
           已接受并集保留 fault controller，候选加入 replay engine => 三者并集
           合并结果带上了修复本身：check('limits', replay.limits??{}, limits(...)??{})
branch     integration/REX-805-repaired-mech-preflight @ 5b85cd6
           （并集 + 已发布的 REX-804 证据修复，后者让跑完全量后 tracked state 仍为 CLEAN）
focused    tests/rex803-*. + rex804-*. + rex805-*.     68 pass / 0 fail（17 套件，含作者新增的空 limit 回归测试）
full       pnpm test                                  1424 pass / 3 fail / 1427，跑后 CLEAN
           3 项均为 tests/host-city-launcher.test.mjs（本机常驻 City 占用 host reservation）
```

In English: `0261a9e` against accepted 803+804 union `704c518` still produces one conflict at the same `services/dev-gateway/server.mjs` union point. The accepted union retains the fault controller while the candidate adds the replay engine, so all three capabilities remain. The merge result includes the repair itself: `check('limits', replay.limits??{}, limits(...)??{})`.

Repaired preflight branch: `integration/REX-805-repaired-mech-preflight @ 5b85cd6`, comprising the union plus the published REX-804 evidence repair, which leaves tracked state CLEAN after the full suite. Focused rex803/rex804/rex805 tests: 68 pass, 0 fail, across 17 suites, including the author's new empty-limit regression test. Full `pnpm test`: 1424 pass, 3 fail, total 1427; CLEAN afterward. All three failures are `tests/host-city-launcher.test.mjs`, where resident City occupies the host reservation.

The earlier union measured on the **unrepaired** `4b39468` candidate, `integration/REX-805-candidate-mech-preflight @ 0d8bdce`, remains as history. Each measurement binds its own candidate; neither replaces the other.

Branch: `integration/REX-805-candidate-mech-preflight` @ `0d8bdce` (the union, additionally incorporating the published REX-804 evidence repair). The candidate head is not an accepted identity. This branch is a **preflight measurement**, not an integration, and changes no workbook field.

```text
focused   tests/rex803-*. + tests/rex804-*. + tests/rex805-*.     67 pass / 0 fail（17 个套件）
full      pnpm test                                              1423 pass / 3 fail / 1426，跑后 CLEAN
          3 项均为 tests/host-city-launcher.test.mjs（本机常驻 City 占用 host reservation）
```

**A branch-name-versus-content incident caught on the spot, recorded here:** measurement (a) was conflict-free because it was a **fast-forward**, and a fast-forward moved my freshly created measurement branch **directly onto the candidate head**. I then nearly pushed that branch under the preflight name: origin would have had a branch named `integration/REX-805-candidate-mech-preflight` whose contents were actually **the author's candidate head**, with none of my own union. Checking the SHA after pushing caught it (origin's 4b39468 differed from the expected 0d8bdce); it has been renamed, pushed again, and verified.

Hunk 2 already contains a warning: the comment above that return states that “the first mechanical attempt left two returns here, silently hiding `researchTrace` behind the earlier one.” The union must retain a **single return** enumerating both sides' capabilities.

## Measurement result
Integration source branch: `integration/REX-accepted-heads-mech-preflight` @ `704c518` (main `b06504f` + accepted 803 `8798ba9` + accepted 804 `fe700ab`; both accepted identities are parents of this commit):

```text
focused   tests/rex803-*.test.mjs + tests/rex804-*.test.mjs        48 pass / 0 fail（13 个套件）
          —— 接受身份的 REX-803 比开发分支多 4 个套件（alien-review / critic-review / third-class-sweep /
             two-worker-rehearsal），这也从另一面说明开发分支不是集成来源
full      pnpm test                                              1404 pass / 3 fail / 1407
          3 项均为 tests/host-city-launcher.test.mjs（本机常驻 City 占用 host reservation），与既有 N/N-3 基线一致
          the 3 are the known host-reservation failures, matching the established N/N-3 baseline
```

The first full-suite run also had a fourth failure at `tests/relay-s1-tunnel.test.mjs:420` (“a sustained burst is refused with 429”). **It has been established that this merge did not introduce it**; it disappeared on rerun:

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

This is **a probe belonging to main itself that drifts with host speed**: it encodes whether the limiter works as whether the host is fast enough. This programme has repeatedly recorded this instrument-error class. Classification and full evidence are in [RELAY_RATE_PROBE_HOST_SPEED_MECH.md](../../RELAY_RATE_PROBE_HOST_SPEED_MECH.md). It was observed only once in situ and **could not be reproduced on demand** (0/6 with 12 CPU-saturating processes, and 0/6 alongside a concurrent full suite). Instead, a controlled experiment directly demonstrated coupling: the same limiter, the same injected 60 ms delay, changing only the sending discipline. Sequential await rejected 0/30; a concurrent burst rejected 10/30. Repair proposal: `repair/mech-relay-rate-probe-burst @ 14499ad`, awaiting adoption by the JOIN record holder; this host does not merge it.

## A real defect incidentally surfaced this round
Running the union's full suite revealed that **the tracked tree was dirty after the full suite finished**: `evidence/raw/mission-book/REX-804/danger-zone.png` was rewritten. Investigation found a defect in accepted REX-804: `tests/rex804-web.test.mjs:9` writes its screenshot to a **committed** evidence path, replacing reviewed evidence on every run and leaving the tree dirty despite green tests.

Full record: [REX-804/TEST_MUTATES_COMMITTED_EVIDENCE.md](../../REX-804/TEST_MUTATES_COMMITTED_EVIDENCE.md). Repair: `repair/REX-804-mech-test-evidence-outside-repo @ 690d723`, awaiting adoption.

After merging the repair into the union **remeasured on accepted identities**, `integration/REX-accepted-heads-mech-preflight-with-evidence-repair @ 56b9752`:

```text
focused   tests/rex803-*.test.mjs + tests/rex804-*.test.mjs        48 pass / 0 fail，跑后 CLEAN
full      pnpm test                                              1404 pass / 3 fail / 1407，跑后 CLEAN
对比 / vs 未含修复的同一个并集（56b9752 的父提交 704c518）：同样 1404/1407，但跑完后 tracked state 是脏的
```

In other words, **a green full suite and a clean tree after the full suite are different properties, and this defect sits exactly between them**. Both states produce identical test results; only the state containing the repair ends clean.

**Measurement hygiene note:** the first “dirty” reading at 56b9752 came from **a file left dirty by the previous run** (not restored after running the unrepaired union), not from the repaired run. Restoring the file and rerunning from a clean state produced the CLEAN above. The same misreading occurred twice this round and is recorded here: **check whether the baseline is clean first, then run, then check the result**.

## Applies to all accepted tasks: the task branch is not the integration source
The same question was asked of 32 workbooks recording reviewed heads. Tool and full results: [INTEGRATION_SOURCE_SWEEP_MECH.md](../../INTEGRATION_SOURCE_SWEEP_MECH.md).

```text
31 项已验收任务 / accepted tasks
  tip 超前或分叉于已验收头 / tip AHEAD of or DIVERGED from the accepted head   1  -> JOIN-590（tip 比已验收头多一个
                                                                                    删除证据的未评审提交）
  tip 落后于已验收头 / tip BEHIND the accepted head                            3  -> MON-902, MON-903, REX-803
  已验收头不在任何远端 ref 上 / accepted head on NO remote ref                  1  -> UI-000
```

> **“Merge the task branch” is not an integration rule.** The integration source must be the exact accepted commit recorded in the workbook.

## What this round did not do, and why
- **No merge into main.** This host has no REX merge authority (the workbook records `merge_authority: false`). The merge windows granted for this round's objective were CEX (used) and WBC (used); the REX integration window has not opened. The preflight's value is that the step becomes mechanical when the window opens.
- **No changes to product code for the drifting relay probe.** It is an instrument defect in main itself, as described above. The repair proposal changes only the probe's sending discipline and failure message, changes no product assertion, and does not merge into main.

## Echo of the WBC rule
The WBC series established a rule in `DEFECT_RESEARCH_STORE_HARDENING.md`: **repairs must be measured on the merge result, not on their own old base**. Green checks on a commit nobody will run are not evidence. This rule came from B4 and was implemented by reissuing the F-3 repair on current main. This preflight generalizes that rule in the integration direction:

> **A branch that merges cleanly into main alone does not prove that multiple branches can merge cleanly into main together.**
