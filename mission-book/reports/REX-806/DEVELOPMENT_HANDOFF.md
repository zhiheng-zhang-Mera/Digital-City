# REX-806 开发交付 / Development handover — Mech

作者 / author: Mech-DS（`MEGA-REP`）· 交付对象 / to: 对侧主机 Alien（复检者）· 时间 / at: 2026-10-06

## 交付身份 / What is handed over

```text
branch        rex/REX-806-mech-metrics-and-export
head          3950d478e627aaa615ef69e3ac65c30da37c5ea6
baseline      e18c5c5350d7657cf046b7ba6bbcd888dc2a1540 = claim-time union of the accepted dependency heads
              （REX-803 8798ba9 · REX-804 fe700ab · REX-805 0261a9e，三者均为其祖先）
CI            3950d47 push 37454597004 COMPLETED SUCCESS attempt 1
              d7aa5d7 push 37452319948 SUCCESS attempt 1 · 94a7d24 push 37451114057 SUCCESS attempt 1
              cd4f603 push 37453769570 **FAILED attempt 1** —— 保留在记录里：校验器探针当时从“作者本机的绝对路径”
              读已发布包，因此在 runner 上六项全红；CI 抓到了本机跑不出来的问题，修正后 3950d47 转绿
LOCAL FULL    1445 tests · 1442 pass · 3 fail，三项均为 tests/host-city-launcher.test.mjs（本机常驻 City 占用
              host reservation，与既有基线一致）—— 本机在该 head 上未观察到任何负载敏感项失败
PROBES        24/24（13 模块 + 5 接口 + 6 校验器），先证伪再信任
```

## 交付物 / The artifact

```text
位置 / location   mission-book/reports/REX-806/artifact/（11 个文件 + checksums.json）
来源 / sources    常驻 City 031fdba6… 的 18 个真实 campaign：24 runs / 22 measured
                  含 REX-803 三端实体 campaign 的三条 run，与 REX-805 的 11 次 replay、4 次 ablation
校验 / checksums 本机通过；且**全新 clone 校验 10/10**（.gitattributes 已把该目录标为 -text，任何主机 checkout
                  后字节一致）
说明 / read me   reports/REX-806/DELIVERABLE.md
```

## 请对侧主机独立重算什么 / What the reviewer should independently recompute

工作书完成门槛要求「由另一实体主机独立读取/重算」，因此这不是可选项。最小重算集与所用输入都在包内： / The completion gate requires independent reading and recomputation on the other host, and this is the minimum set:

```text
1  completion_time_ms   用 normalized-dataset.json 里每行的 taskCreatedAt/taskUpdatedAt（MEASURED 且 taskState
                        COMPLETED 的行）取中位数，与 metrics.csv 比对；本机值 6595，n=22
2  failure_rate         用 manifest.supporting.accounting 的 accounted/failed/timedOut 复算；本机值 0，n=24
3  duplicate / convergence  用 dataset 的 taskRef / researchRunRef 关系复算（本机均为 0，n=24 / n=22）
4  placement            核对 placementMatchesPolicy 与 placementMatchesSeedAlone 的差异是否**恰好**出现在
                        replayMode=ABLATION 的行上（本机：policy 24/24 成立；seed-alone 仅 ablation 两行为 false）
5  NOT_MEASURED         逐条核对 23 项 NOT_MEASURED 与其 reason；特别核对 intervention_count **不是 0**
6  checksums.json       对目录内文件做 sha256，与本机给的值比对
```

**本机提供了一个独立的第二实现**（`scripts/verify-research-artifact.mjs`，**不 import 导出器**，因为调用导出器的校验器只能证明导出器与自己一致）：它自己解析 metrics.csv、从 dataset 重算四项指标、核对每一条 NOT_MEASURED 的原因与每一条有值项的 provenance、核对放置判定与 accounting 恒等式、并重算校验和。本机对已发布包实测 **14/14 通过**，另有 6 项探针证明它**会失败**（改指标值、清空原因、删章节、改时间戳、伪造干预计数为 0，各自变红）。 / A second implementation is provided and deliberately does not import the exporter. It passes 14/14 on the published package, and six probes prove it fails on tampered packages.

**取包与跑校验器的准确步骤**（校验器在**实现仓库**，包在**控制面仓库**，两者不是同一棵树——本机第一版手交把包路径写成实现仓库里的相对路径，照抄会得到 `ENOENT: scandir`；这是本机自己的一处文档缺陷，已改正并实测）： / The verifier lives in the implementation repo and the package in the control-plane repo, so the two commands are separate:

```powershell
# 1) 实现仓库（utopia）取得被复核的精确头 / exact head under review
git fetch origin rex/REX-806-mech-metrics-and-export
git checkout --detach 3950d478e627aaa615ef69e3ac65c30da37c5ea6   # 校验器自 cd4f603 起才存在

# 2) 控制面仓库（Digital-City）取包 / the package ships here
#    Windows 上需要 core.longpaths=true，否则 checkout 会在深层中文路径处中止
git -c core.longpaths=true clone --depth 1 https://github.com/zhiheng-zhang-Mera/Digital-City.git city-clone

# 3) 在实现仓库根目录运行，参数指向上面那份 clone / run from the implementation checkout
node scripts/verify-research-artifact.mjs city-clone/mission-book/reports/REX-806/artifact
```

本机对该命令的逐条实测：步骤 1 的 fetch 成功且 `3950d47` 可达；步骤 2 从**GitHub 远端**（不是本机路径）clone 成功；步骤 3 对 clone 出来的包 `14/14 independent checks pass`。因为被测对象是**远端 clone** 而不是作者工作副本，这同时证明包在 checkout 后字节未变，也证明文档里这三条命令就是可执行的那三条。 / Measured step by step: the fetch resolves, the clone comes from the public remote rather than a local path, and the verifier returns 14/14 on the cloned package.

本机原先写错的那一条命令（`node scripts/verify-research-artifact.mjs mission-book/reports/REX-806/artifact`，从实现仓库根目录运行）实测以 `ENOENT: scandir D:\utopia-rex806\mission-book\...` 退出 1。缺陷本身很小，但它正好说明为什么「让复检变便宜」的交付物必须自己先跑一遍：**一条照抄就会报错的入口命令，会把复检者挡在门口，或者更糟——让他以为自己手里的包是坏的。** / The original command fails with ENOENT, which is precisely why a deliverable meant to make review cheap has to be run by its author first.

**但本机那次运行不是复检证据**——请对侧主机自己跑一遍，或自己另写一份。提供它的唯一目的是让「独立重算」从一下午变成五秒钟，从而真的被执行，而不是被放过。 / This host's run of it is NOT review evidence: run it yourself, or write your own.

## 重算时的一个陷阱，用第三种实现量出来的 / A recomputation trap, measured by a third implementation

本机另写了一份**Python** 第三实现（`reports/REX-806/evidence-tools/THIRD_RECOMPUTE_PYTHON_MECH.py`，12 项检查，只读包内字节、不碰 City）。它与那两个 JS 实现互相独立，因此能查出「两份 JS 一致、但都错」的那一类问题。结果：**对已发布包 12/12 通过**；把某一行 `taskUpdatedAt` 挪动 1 秒的负对照会让它红 2 项。 / A third, Python implementation was written against the same bytes (12 checks, no City access). It passes 12/12 on the published package, and a +1 s perturbation of one row turns two checks red.

它顺手量出一件**复检者很可能踩到的事**：包内 `normalized-dataset.json` 里有一个 `durationMs` 字段，它与 `(taskUpdatedAt - taskCreatedAt)` **不相等**——实测 24 行全部略大 7–63 ms（同向）。两者是同一区间的两次测量：`durationMs` 来自 run 记录，而指标用的是 canonical task 的时间戳对（`reproduction.json` 第 3 步写的就是后者）。**用 `durationMs` 重算会得到一个不同的中位数，然后看起来像包和复算不一致。** 本机第一版探针正是把这个假设当成了被测对象的性质，因此得到 24 条假失败；这条缺陷连同它的数字一起留在工具注释里。 / `durationMs` is NOT the interval the metric uses: it is 7-63 ms larger than the task bracket on every row. Recomputing the median from `durationMs` yields a different number that looks like a package/recomputation mismatch. My first probe assumed they were equal and produced 24 false failures; the defect and its numbers are kept in the tool's comments.

工具的第二组检查做的是**跨文件一致性**（`tables.json` ↔ `metrics.csv`、dataset ↔ manifest、`failures.json` ↔ accounting），共 25 项，实跑 **25/25**，并用四个负对照证明每一项都会红（挪时间戳、改表格里的测量值、把 `intervention_count` 伪造成 0、改写某行 state）。这条检查抓的是「每个文件自己自洽、但描述的不是同一批 run」。 / Its second group checks cross-file coherence - 25 checks, 25/25, falsified by four controls.

**另外两处容易读成不一致的地方，先写在这里**（都是定义问题，不是缺陷）： / Two more easy misreadings, both definitional:
1. `manifest.supporting.campaigns = 18`，而 dataset 里只有 **16** 个不同的 `campaignId`——另外 2 个是被拒（`TOPOLOGY_NOT_READY`）而**一个 run 都没交付**的 campaign，它们出现在 accounting 与 `failures.json` 里，**不应**出现在 dataset 里（工具已断言这一点）。
2. `manifest.supporting.replays = 11`，而 dataset 里 `replayMode=REPLAY` 的行只有 **7** 行——11 = 7 个 REPLAY + **4 个 ABLATION**（消融本身也是重放）；普通 campaign run 的 `replayMode` 为 `null`。

## 本机明确不主张的 / Explicitly not claimed

```text
· development 侧不主张任何验收或标记；terminal marker RESEARCH_ARTIFACT_EXPORT_ACCEPTED 未释放
· 不主张 Owner 侧指标（干预计数等）：城市记录不表达 Owner 行为，全部 NOT_MEASURED 并写明原因；
  按工作书要求，未知不得写成 0
· 不主张 durationDeltaMs 的因果性能结论
· 本机无产品 main 合并权
```

## 已知的既有现象（与本工作无关但会影响复核时的 tree 状态）/ A pre-existing condition

任何一次跑完 **已接受的 REX-804 web 套件**都会改写 `evidence/raw/mission-book/REX-804/danger-zone.png`——该测试把截图写进**已提交**的证据路径。本机已发布待采纳的修复 `repair/REX-804-mech-test-evidence-outside-repo @ 690d723`。复核者若在该分支跑全量后看到这个文件变脏，那是这条既有缺陷，不是 REX-806 的。
