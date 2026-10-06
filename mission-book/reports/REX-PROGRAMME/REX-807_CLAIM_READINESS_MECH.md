# REX-807 领取就绪预检 / Claim-readiness preflight — Mech

作者 / author: Mech-DS（`MEGA-REP`）· 时间 / at: 2026-10-06 · 目的：让系列的下一个任务开工时不必靠猜 / so the series' next task does not start on guesses

```text
本机角色 / this host        Mech-DS（COMPUTERNAME MEGA-REP），研究系列的开发方之一
被测对象 / measured         控制面 dc @ 1569f07（origin/main）；实现 utopia @ b06504f（origin/main）
                             以及 REX-806 开发头 3950d478e627aaa615ef69e3ac65c30da37c5ea6
边界 / boundary             **只读预检**：不领取 REX-807、不改它的工作书字段、不写它的报告目录、不合并任何东西
```

## 0. 这份预检为什么存在 / Why this exists

第 49 轮开工时对侧主机把整库搬迁过（`8d675be`，274 个文件），研究系列现在在 `mission-book/mission-group/research-strengthening/`，系列里只剩一条链：**REX-806 复检 → REX-807 → REX-890**。本机复扫确认可领取为 0（§1），因此把「下一个任务开工时会撞到什么」先测量清楚并留证——这是不占任务、可复用的工作，也是本系列一贯记录的那一类材料。 / The series now reduces to one chain, and this host's rescan finds nothing claimable, so the next task's opening conditions were measured and recorded instead of guessed.

## 1. 全库可领取性复扫：把「没活」变成有分类的结果 / Zero-claim, classified

口径：读 `mission-book/` 下**全部 89 本**工作书的 frontmatter（只读脚本 `claimability-scan.py`，本机过程文件）。 / Method: read the frontmatter of all 89 workbooks.

```text
状态分布 / status distribution
  NOT_STARTED 49 · COMPLETE 25 · REVIEW_COMPLETE 7 · IN_PROGRESS 2 · WAITING_DEPENDENCIES 2
  + 各一：RESCHEDULING_BASELINE_FROZEN / REVISION_REVIEW_COMPLETE_PASS_WITH_REPAIRS / UI_BASELINE_FROZEN
        / FINAL_PRODUCT_ACCEPTED

分类 / classification
  TEMPORARILY_UNCLAIMABLE   2   REX-807、REX-890 —— 阻塞项唯一且明确：REX-806 的 accepted SHA 尚未产生
  STRUCTURALLY_INELIGIBLE  49   全部 NOT_STARTED 且 execution_enabled 非 true：
                                personal-compute-fabric 25 · deliberative-governance 8 · city-self-health-check 5
                                · review-independence-v2 5 · utopia-runtime-architecture 5（+1 模板）
                                programme 未启用是记录持有人的状态，不是本机可以自行激活的
  已分配给对侧                1   SHOW-401（dev=Alien）
  本机在办且只差对侧             1   REX-806（开发完成、复检未领）
  READY 且无人领取             0
```

**唤醒条件 / wake condition**：对侧完成 REX-806 的独立重算并释放 `RESEARCH_ARTIFACT_EXPORT_ACCEPTED`，REX-807 即解锁（§2）。本机不做投机性领取，也不激活 parked programme。 / Wake condition: the opposite host releases the REX-806 marker.

## 2. REX-807 的依赖闸门（实测） / Its dependency gate, measured

```text
dependencies          REX-801:EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED   -> 已释放 / released
                      REX-806:RESEARCH_ARTIFACT_EXPORT_ACCEPTED       -> 未释放 / not released
REX-801 dev 头         8f8c521fc299d622093776615b653457d8833f96   git merge-base --is-ancestor <sha> b06504f -> 已在 main
REX-801 review 头      7e96a4d28f4cb701d7a0951bace69857c3228f32   同上 -> 已在 main（两个头都在，因此这条依赖不产生 union 冲突）
required_ancestor     69a097b5394a9fece39dd11cc13f04c9b4d28bfe   同上 -> 已在 main
dependency_source_shas []  · development_baseline_sha null · baseline_blocker DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE
merge_authority       false（与系列其余任务一致：本机不合并产品 main）
```

## 3. 领取那一刻的 union baseline 会是什么 / What the union will resolve to

`baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM` 要求 union 由**已验收**的前置精确 SHA 与 required ancestor 构成。实测关键事实： / The union must be built from accepted exact SHAs:

```text
3950d47（REX-806 开发头）内**含全部三个已验收 REX 头**（实测 3/3 ancestor）：
  8798ba9（REX-803）· fe700ab（REX-804）· 0261a9e（REX-805）
```

因此 union = main ∪ REX-801 已验收头（已在 main 内）∪ **REX-806 的已验收头**，而后者本身就是前三个头的并集。两种情形： / Therefore:

```text
情形 A（预测）复检接受 3950d47 原样 -> union 就是 main 快进到 3950d47，**没有并集冲突要解**
情形 B（预测）复检要求修复 -> union 必须用**被接受的那个修复头**，不能拿开发头顶替；
        届时按第 3 步重测祖先关系（这正是 REX-806 当年踩过的坑：dev 头 a695bb9 落后于 accepted 8798ba9 14 个提交）
```

**标注**：A/B 两情形是**预测**，以对侧复检结论为准；本预检不主张 REX-806 会被接受。 / Both are predictions; the review decides.

## 4. 它必须暴露的东西现在在哪里（实测） / Where the surfaces it must expose actually live

REX-807 的「最低入口」要求 Experiments / Runs / Metrics / Replay+Ablation / Export / Advanced Fault Injection / Technical Details 七层。逐条核对两个头： / Each required layer, checked against both heads:

```text
路由 / route                                   main b06504f        REX-806 头 3950d47
GET  /api/v0/research/trace                    有                  有
GET/POST /api/v0/research/experiments          有                  有
POST /api/v0/research/experiments/validate     有                  有
GET/POST /api/v0/research/campaigns (+stop)    无                  有（REX-803）
GET/POST /api/v0/research/replays              无                  有（REX-805，含消融）
GET/POST /api/v0/research/faults               无                  有（REX-804）
GET  /api/v0/research/artifacts[?format=csv]   无                  有（REX-806，owner-only）
GET  /api/v0/monitor                           有                  有

界面 / web
  index.html 已有一个**次级** Advanced 分组，含 `Research` 与 `Research trace` 两个入口（"清晰但次级入口"的地基已在）
  apps/web/research.js = 52 行：只做实验清单的编写/校验/登记，不是分层控制面
  apps/web/research-trace.js = 21 行
owner 边界（实测代码位置）
  fault 路由：member 会话 -> 403 RESEARCH_OWNER_REQUIRED（3950d47 server.mjs:804）
  campaign/replay 路由：member 会话 -> 403 RESEARCH_OWNER_REQUIRED（同上 :807）
```

**结论**：REX-807 要暴露的面**全部随 union 一起来**，不需要它自己造后端；它要造的是**界面与分层**。 / Its back end arrives with the union; the work is the surface and its layering.

## 5. 契约到证据的映射 / The contract mapped to evidence

按 `RESEARCH_CONTROL_SURFACE.md` 的四级暴露，REX-807 的 Review 会按普通用户路径找「隐藏入口、假按钮、过度折叠、信息不足、视觉过载」： / Per the programme contract and the workbook's review rule:

```text
DIRECT_CONTROL    create / start / stop / scenario / repetitions / replay / export
                  -> 对应 campaigns、replays、artifacts 路由，放 Research 页主操作区
ADVANCED_CONTROL  fault injection / destructive cleanup / seed-config override
                  -> faults 路由 + **显式确认** + owner-only（后端已强制，前端要防误触）
OBSERVABLE        current run / progress / topology / failures / retries / handoffs / recovery / metrics /
                  exclusions / provenance / artifact status
                  -> campaigns/replays/artifacts/trace 的读出；默认用户语言摘要，raw ID 折叠
INTERNAL_ONLY     例如 trace collector 内部 buffer -> 若完全不上 UI，工作书必须写 UI_EXEMPT_INTERNAL_ONLY 理由
```

## 6. 开工时会撞到的工作量（诚实的缺口）/ The honest size of the job

```text
1  52 行的 research.js 要扩成分层页面（Experiments/Runs/Metrics/Replay/Export/Danger/Diagnostics）
2  Danger Zone 的显式确认与「不误触」不是文案问题，是交互与状态问题（要能被 reviewer 用普通路径检验）
3  错误 / 排除项 / 未测指标必须可见——REX-806 已把 23 项 NOT_MEASURED 与三条排除写在包里，
   界面若把它们藏起来，等于把「如实」变成「好看」
4  raw ID 默认折叠，但不能折到"信息不足"（契约原文：解决 overload 靠分层/折叠/搜索，不是把能力藏起来）
5  Android 只要求观察 run/status/critical attention，完整 authoring parity 可记 future backlog
6  必须在真实浏览器里验证（本系列的纪律：单测看不到页面级崩溃）
```

**本预检没有做 / NOT done here**：没有运行任何 UI、没有做浏览器检查、没有写 REX-807 的工作书字段、没有为它建分支或 baseline、没有主张它会通过复检。 / No UI was run, no browser check was made, and no workbook field was written.

## 7. 领取时应当跑的清单 / The checklist a claimant should run

```powershell
# 1) 取最新状态（两个仓库都要）
git -C <dc>  fetch origin && git -C <dc>  log --oneline -1 origin/main
git -C <utopia> fetch origin && git -C <utopia> log --oneline -1 origin/main

# 2) 重判依赖：REX-806 的 terminal_marker 是否释放、accepted SHA 是哪一个（读工作书 frontmatter）
# 3) 用 accepted SHA 建 union baseline，并逐条实测祖先关系（不要用分支名，也不要用 dev 头顶替 accepted）
#    git merge-base --is-ancestor <required_ancestor> <baseline>
#    git merge-base --is-ancestor <accepted_head>     <baseline>
# 4) dependency smoke（在 union baseline 上，动产品之前）：26 个研究相关套件
#    tests/rex801-*.test.mjs (4) · rex802-*.test.mjs (2) · rex803-*.test.mjs (8) · rex804-*.test.mjs (5)
#    · rex805-*.test.mjs (4) · rex806-*.test.mjs (3)
# 5) 写 claim（只改必要字段 + baseline_resolution_evidence），同一步 push；失败即撤回，不 force-push
```

---

语言读本 / English reading: [en/REX-807_CLAIM_READINESS_MECH.md](en/REX-807_CLAIM_READINESS_MECH.md)
