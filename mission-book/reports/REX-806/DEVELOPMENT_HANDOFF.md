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
                        —— 若要复核**策略本身**而不只是自洽性，必须在持有该 City 凭据的机器上跑
                        `evidence-tools/PLACEMENT_RECOMPUTE_CITY_MECH.py`（本机实测 6/6）
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

### 复检入口路径已做回归（2026-10-06，dc @ `c72b794`）/ The reviewer's entry path, re-verified

在记录区又增加了多轮材料之后，本机按**复检者会走的顺序**重跑了一遍入口路径（全部从**全新 clone/checkout** 出发，而不是作者工作副本）： / After several more rounds of records, the entry path was re-run in the order a reviewer would take it, from fresh checkouts rather than the author's working copy:

```text
1  控制面：git -c core.longpaths=true clone --depth 1 <Digital-City>       -> clone 成功
   包内自校：逐文件 sha256 对比 checksums.json                            -> 10/10，零失配
   另有事实：`git log -- mission-book/reports/REX-806/artifact` **只有一个提交**（2cdcd81 首次发布），
             即此后所有轮次的记录工作都**没有改动过包的字节**
2  材料齐备：reports/REX-806/evidence-tools/ 下 **8 件工具**、以及 HANDOFF/DELIVERABLE/MATERIAL_INDEX/
   REPRODUCIBILITY 四份说明均在 clone 内可见
3  包内检查器（Python 第三实现）：**从 clone 里**运行、对 **clone 的包** 检查   -> 27/27 通过
4  实现仓库：全新 worktree --detach 3950d478e…（被复核的精确头）+ 随包发布的独立校验器，
   对 **clone 的包** 运行                                                     -> **14/14 通过**
```

结论：复检者按文档照抄即可跑通，且在**今天的 main** 上仍然成立（不是只在当时的提交上成立）。 / The documented path works as written, at today's main and not only at the commit of the day.

## 重算时的一个陷阱，用第三种实现量出来的 / A recomputation trap, measured by a third implementation

本机另写了一份**Python** 第三实现（`reports/REX-806/evidence-tools/THIRD_RECOMPUTE_PYTHON_MECH.py`，12 项检查，只读包内字节、不碰 City）。它与那两个 JS 实现互相独立，因此能查出「两份 JS 一致、但都错」的那一类问题。结果：**对已发布包 12/12 通过**；把某一行 `taskUpdatedAt` 挪动 1 秒的负对照会让它红 2 项。 / A third, Python implementation was written against the same bytes (12 checks, no City access). It passes 12/12 on the published package, and a +1 s perturbation of one row turns two checks red.

它顺手量出一件**复检者很可能踩到的事**：包内 `normalized-dataset.json` 里有一个 `durationMs` 字段，它与 `(taskUpdatedAt - taskCreatedAt)` **不相等**——实测 24 行全部略大 7–63 ms（同向）。两者是同一区间的两次测量：`durationMs` 来自 run 记录，而指标用的是 canonical task 的时间戳对（`reproduction.json` 第 3 步写的就是后者）。**用 `durationMs` 重算会得到一个不同的中位数，然后看起来像包和复算不一致。** 本机第一版探针正是把这个假设当成了被测对象的性质，因此得到 24 条假失败；这条缺陷连同它的数字一起留在工具注释里。 / `durationMs` is NOT the interval the metric uses: it is 7-63 ms larger than the task bracket on every row. Recomputing the median from `durationMs` yields a different number that looks like a package/recomputation mismatch. My first probe assumed they were equal and produced 24 false failures; the defect and its numbers are kept in the tool's comments.

工具的第二组检查做的是**跨文件一致性**（`tables.json` ↔ `metrics.csv`、dataset ↔ manifest、`failures.json` ↔ accounting），共 25 项，实跑 **25/25**，并用四个负对照证明每一项都会红（挪时间戳、改表格里的测量值、把 `intervention_count` 伪造成 0、改写某行 state）。这条检查抓的是「每个文件自己自洽、但描述的不是同一批 run」。 / Its second group checks cross-file coherence - 25 checks, 25/25, falsified by four controls.

**另外两处容易读成不一致的地方，先写在这里**（都是定义问题，不是缺陷）： / Two more easy misreadings, both definitional:
1. `manifest.supporting.campaigns = 18`，而 dataset 里只有 **16** 个不同的 `campaignId`——另外 2 个是被拒（`TOPOLOGY_NOT_READY`）而**一个 run 都没交付**的 campaign，它们出现在 accounting 与 `failures.json` 里，**不应**出现在 dataset 里（工具已断言这一点）。
2. `manifest.supporting.replays = 11`，而 dataset 里 `replayMode=REPLAY` 的行只有 **7** 行——11 = 7 个 REPLAY + **4 个 ABLATION**（消融本身也是重放）；普通 campaign run 的 `replayMode` 为 `null`。
3. `rawPointers.canonicalTasks` 有 **26** 条，而 dataset 只引用 **24** 个不同 `taskRef`——该列表是**导出时刻城市的整份任务表**（权威计数是工作书的 `runCount`/`measuredRuns`），多出的 2 条是更早的 `CHECKPOINT_DEMO` 任务、与任何 campaign 无关（`POINTERS_RECOMPUTE_CITY_MECH.py` 会逐条点名它们）。另外指针前缀按存储区分：`trace:`、`task:`、`event:`、`receipt:`。

## 已知缺陷：导出 CLI 的「拒绝路径」退出码是崩溃码（本机演练发现，已修复并验证）/ Known defect: the CLI's refusal path exited with a crash code (found by the rehearsal, repaired and verified)

端到端演练（REX-890 预检 §3.2）顺手发现了本机自己交付物里的一个缺陷，记录而不掩盖： / The end-to-end rehearsal found this defect in this host's own deliverable:

```text
复现 / reproduce  把 CLI 指向一台**没有任何可读回执**的 City（临时 City 即可）：
                  node scripts/export-research-artifact.mjs --city <fresh city> --out <dir> --config <config>
                  -> 正确打印拒绝理由 "no campaign receipt is readable from this City; ..."
                  -> 随后 process.exit(1)（scripts/export-research-artifact.mjs:38）触发 libuv 断言：
                     Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76
                  -> 进程退出码 **3221226505 (0xC0000409)**，不是 1
证据 / evidence   reports/REX-806/evidence-tools/REFUSAL_EXIT_CHECK_MECH.mjs（本机实测确认，见其头部）
影响 / impact     调用方（study runner、CI、复检自动化）**无法区分**「按设计拒绝」与「导出器崩了」；
                  一个正确的拒绝看起来像一次崩溃。这不影响正常导出路径（有回执时 exit=0，演练已证）
根因 / cause      `process.exit()` 在 fetch 的 keep-alive 句柄仍处于关闭中时被调用，Windows 上 libuv 断言
建议修法 / fix   拒绝路径不要 `process.exit(1)`：置 `process.exitCode = 1` 并**跳过后续导出**（本文件是 ESM，
                  顶层不能 `return`，因此需要一个 `else` 包裹或把主体收进 async main —— 属于结构性小改）
本机为何不直接发布修复 / why no repair branch yet
                  结构性小改 + 需要重跑全套；本机不愿发布**未经验证**的修复（本记录区其他修复都带负对照）。
                  该缺陷已足够明确，可独立领取修复
```

**更新（同轮内已修完并验证）/ Updated in the same round - repaired and verified:**
```text
BRANCH      repair/REX-806-mech-exporter-refusal-exit-code @ 44dec630ea84ab5be2cb204072a8572a5555a797
            parent = 3950d47（被交付的开发头）⇒ 采纳是 fast-forward
CHANGE      拒绝路径不再 process.exit(1)：置 process.exitCode = 1 并把导出主体放进 else 守卫。
            主体保留原缩进**是有意的**——diff 是那道守卫（9 行，大部分是说明），不是整文件重排
VERIFIED    ① 拒绝路径：消息照常打印，退出码 1（原为 3221226505），无 libuv 断言
            ② 正常路径：端到端演练（全新 City / 两台 worker / 6 次重复 / 注入故障并恢复 / 本 CLI 导出 /
               独立校验器）**13/13**，产出的包 14/14 通过
            ③ 本分支上 REX-806 三个套件 24/24
HOSTED CI   该分支 push run 37462091684：attempt 1 —— android **SUCCESS**、gateway-web **FAILED**，
            唯一失败为 tests/web-services.test.mjs:39 的 "late result stays in shared history..."（`'RUNNING' !== ''`）。
            归属已实测：diff **只动一个文件**（scripts/export-research-artifact.mjs），且**没有任何测试** import
            或 spawn 该 CLI；该测试在本分支与本机（交付头）本地均 2/2 通过；runner 上该套件跑了 308 s、
            单条 web 测试 111 s ⇒ 属已记录过的**负载/时序敏感**失败，而非本修复引入。
            **attempt 2（同一 SHA，`gh run rerun --failed`）gateway-web 与 android 全绿 SUCCESS** ——
            同一个提交、同一套测试，先红后绿，因此这是一次抖动而不是回归；两个 attempt 都保留在记录里
NOT CLAIMED 本机不行使产品 main 合并权；被交付头 3950d47 仍带该缺陷（材料包本身不受影响，
            受影响的是导出器**失败路径**的退出码）
```

**这条同时说明演练的价值**：它不是为了证明「能跑」，它顺手把一个**只会在失败路径上出现**的缺陷抓了出来——而失败路径恰恰是最少被测的路径。 / The rehearsal did not just prove the happy path; it surfaced a defect that only appears on the failure path, which is the least tested one.

## 已知缺陷 2：一个坏回执会让整次导出死掉（演练发现，已修复并验证）/ Defect 2: one bad receipt killed the whole export

用**两场 campaign 的临时 City** 实测（`evidence-tools/RECEIPT_ROBUSTNESS_MECH.mjs`）： / Measured on a throwaway City holding two campaigns:

```text
R-1 一份回执损坏 -> 城市列表仍列出它，形状带 typed 原因且**没有 campaignId**：
      {"file":"campaign-<uuid>.json","state":"UNREADABLE","reason":"RECEIPT_UNREADABLE"}
    旧 CLI 对它的明细请求未加保护 -> 在 get() 抛出未捕获错误 -> **整次导出没有任何产物**，
    退出码 0xC0000409；而旁边那场可读的 campaign 本可以照常导出
    修复 repair/REX-806-mech-exporter-unreadable-receipt @ 4349f3d（parent = 3950d47，采纳即 fast-forward）
      · 按列表已给出的信号跳过该条（不再发出 GET research/campaigns/undefined）
      · 在 stderr 按文件名 + reason 点名（实测输出 `campaign-8567106f-…json  RECEIPT_UNREADABLE`）
      · 可读的 campaign 照常导出，**退出码 1** —— 部分产物不得读成一次干净成功
      · 同分支顺带收编拒绝路径修复（空 store 现在 exit 1 而不是 libuv 断言崩溃），
        因此它**取代** repair/REX-806-mech-exporter-refusal-exit-code @ 44dec63
R-2 一份回执被**删除** -> 城市窗口 total 随之下降（receipts=1, window.total=1），包里变成一场自洽的
    单 campaign study，**没有任何可点名的东西**。这是 **store 的边界**而不是读取方的缺陷：目录式 store
    没有墓碑，删除不留痕。记录在此是为了让「包内自洽」永远不被当成「记录没有缺失」的证据；
    若要根治需要 store 侧保留单调计数/墓碑
    追加修复（同轮）：**最新那份**回执被删是可以检测的——live campaign 记录在完成后仍留着最后一场的
    campaignId，而它不在 receipts 列表里即说明最新回执丢了。修复 stack 在
    `repair/REX-806-mech-exporter-missing-receipt-detection @ d790a2a`：给出
    「the live campaign <id> (state …) has no receipt in this City's store - the newest receipt is missing,
    so this artifact describes less than the City ran (an older loss is not detectable at all)」并退出码 1。
    实测：删**最新**→ exit 1 + 点名（`evidence-tools/MISSING_RECEIPT_DETECTION_MECH.mjs` 的 A 段）；
    删**较旧**（最新仍在）→ exit 0 且静默，即消息里写明的那条边界（同工具的 B 段）
```

**验证（本分支四条路径全过）**：拒绝路径 exit=1；损坏回执 → 有产物 + exit 1 + 点名；**最新回执被删 → exit 1 + 点名**；
端到端演练 **13/13**、产出包 **14/14**、且健康 City 上**没有误报**。该分支 stack 在 `4349f3d` 之上，因此**一次采纳即带走三条失败路径修复**（它取代 `4349f3d` 与 `44dec63`）。
**托管 CI（exact head）**：push run 37466226644 @ `d790a2a` —— **gateway-web 与 android 均 SUCCESS attempt 1**。

**验证（本分支三条路径全过）**：拒绝路径 exit=1；损坏回执 → 有产物 + exit 1 + 点名；端到端演练 **13/13**、产出包 **14/14**。
**托管 CI（exact head）**：push run 37465078880 @ `4349f3d` —— **gateway-web 与 android 均 SUCCESS attempt 1**。
**未做且写明**：损失**尚未写进包内**（需要 artifact 模块新增 `unreadableReceipts` 段），因此只读包的人目前仍只看到能读到的那些 campaign。 / Verified on three paths; hosted CI green at the exact head; the loss is not yet carried inside the package, which is stated rather than implied.

## 已知缺陷 3：`topology.members` 永远是空数组（字段名不匹配，未修，待记录持有人决定）/ Defect 3: topology.members is always empty

本轮为「环境绑定」做外部指纹时顺手发现：包的 `topology.json` 里 `members` 是 **0**，而 City 在导出时持有 **6** 个成员。原因不是导出时没有成员，而是**字段名读错了**—— / Found while fingerprinting the environment: the package's topology lists 0 members while the City held 6.

```text
City 的成员条目字段（实测枚举全部键）: deviceId, installationId, nodeId, role, displayName, capabilities,
                                        online, computeOnline, controlOnline, sharingEnabled, metadata, telemetry, ...
导出器的映射（scripts/export-research-artifact.mjs）: member.ref ?? member.devicePrincipalId ?? null
=> City 的条目里**既没有 ref 也没有 devicePrincipalId**，两个候选都取不到 -> 全部 null -> filter(Boolean) 清空
=> 结果：topology.members 恒为 []，而 topology.nodes 正常（5 个）
```

**为什么重要**：这是「材料声称记录了某件事、实际什么都没记」的沉默少报（与 F-2 join 静默同类）。**本机自己的第三种实现也没抓到它**——那 27 项检查没有覆盖 `topology.members`；这条观察本身说明「包内自洽」不等于「包与城市一致」。 / A silent under-report of the family this record already documents; notably this host's own 27-check implementation does not cover it either.

**一行修法（未发布）**：`member.deviceId ?? member.nodeId ?? member.ref ?? null`。

**为什么本轮不发布**：这会改变**包的数据内容**（`topology.json` 不再是空的），不是只改失败路径。REX-806 正处于复检窗口，改动包的格式/内容会让复检对象漂移；因此记录在此，由记录持有人/复检者决定是随下一次导出修正，还是作为 REX-890 的一部分。**复检者请注意**：如果拿今天的 City 成员数（6）对比包内的 0，那是本条缺陷，不是包被篡改。 / Not shipped here on purpose: it changes package CONTENT, and the review target must not drift. A reviewer comparing today's 6 members with the package's 0 is looking at this defect, not at tampering.

## 环境绑定：由**外部指纹**佐证，而不是只靠操作者自述 / The environment binding, attested from outside

`environment.json` 只能写「部署的候选由操作者观察」（exporter 读的是 City，不是进程树）。但**每个头服务的路由集不同**，因此可以从外面把「这台 City 到底跑的是哪一代」测出来：main 只有 experiments/trace/monitor/execution-profile；REX-805 头加上 campaigns 与 replays；REX-806 头再加上 faults 与 artifacts。 / environment.json can only say the candidate was observed by the operator; route presence can do better.

实测（`evidence-tools/DEPLOYMENT_FINGERPRINT_MECH.mjs`，本机对产出该包的那台 City `172.31.12.151:4391` 运行）：

```text
owner 凭据   experiments=200 trace=200 campaigns=200 replays=200 **faults=404 artifacts=404** monitor=200 execution-profile=200
member 会话  experiments=200 trace=403 campaigns=403 replays=403 **faults=404 artifacts=404** monitor=200 execution-profile=403
指纹结论     匹配 **REX-805 头（0261a9e）**：有 campaigns 与 replays，没有 fault 控制器、也没有 artifact 导出面
member=owner 每个路由的「存在与否」完全一致（存在但 owner-only -> 403；不存在 -> 404）
副作用       为该 member 探针临时登记的设备已 **revoke（HTTP 200）**，对活着的 City 不留成员
```

**对复检者直接有用的一点**：这不要求 owner 凭据——**对侧主机用它自己持有的 MEMBER 会话就能跑**（403 与 404 的差别即可判定路由是否存在），因此「这个包产自哪一代」不再只是本机的自述。 / The opposite host can run this with its own member session, so the binding is no longer only this host's assertion.

**边界（写明）**：它证明的是**能力是否存在**，不是 commit SHA——两个路由集相同的头在这里无法区分；**未认证**客户端也做不到（City 在匹配路由之前对所有路由一律 401，已实测）。 / It attests capability presence, not a SHA; an unauthenticated client cannot do it at all.

**「City 能不能自己报版本」这个问题的答案是不行（已实测）**：本机枚举了 City 快照的全部键（`apiVersion/schemaVersion` 只是契约版本，`descriptor.descriptorVersion` 亦然），`health.components` 只报状态（`gateway/rooms/execution: READY`），成员上的 `agentVersion: "0.2.0"` 是**客户端 agent** 而不是 City 构建；**没有任何字段指明运行中的候选**。因此 `environment.json` 那句「由操作者观察」不是偷懒，而是这台 City 能给的最诚实表述；外部路由指纹是在此之上的**最强可得**佐证。 / The City exposes no field naming its running revision (measured: full snapshot key list, descriptor version is a contract version, member agentVersion is the client agent), so the exporter's wording is the honest maximum and the route fingerprint is the strongest attestation available on top of it.

**同一轮顺手对包内非指标区块做了逐字段核对**（找同类「字段名读错」的沉默少报）： / A field-by-field audit of the package's non-metric blocks for the same mis-keying class:

```text
topology.nodes           5 条，id/online/sharingEnabled 均为真实值（含另一台主机的 alien-reference-node）  -> 正确
topology.controlSurfaces 1 条，是真实 device ref（dev-be7832e3…）                                          -> 正确
topology.members         **[] 而 City 当时有 6 个成员**                                                    -> 已知缺陷 3（本轮记录，未修）
environment.json         endpoint/status/nodeRuntime/platform 均为真实值；候选一栏见上（City 无法自报）      -> 正确
其余导出输入             receipts/tasks/events/experiments 的字段映射已由溯源交叉核对（8/8）与指针复算（8/8）覆盖
=> 结论：**恰好一个字段读错**（members），其余非指标区块与城市记录一致
```

## 本机明确不主张的 / Explicitly not claimed

```text
· development 侧不主张任何验收或标记；terminal marker RESEARCH_ARTIFACT_EXPORT_ACCEPTED 未释放
· 不主张 Owner 侧指标（干预计数等）：城市记录不表达 Owner 行为，全部 NOT_MEASURED 并写明原因；
  按工作书要求，未知不得写成 0
· 不主张 durationDeltaMs 的因果性能结论
· **放置策略已由本机按城市原始回执复算（6/6），但「只读包」仍然做不到**：`expectedNodeIdByPolicy` 取决于
  City 回执里的**声明顺序**（`context.manifest.workers`）与生效政策，包里没有这两样；`PLACEMENT_RECOMPUTE_CITY_MECH.py`
  用与网关/replay 共享的规则重算（`alternate-device` 被禁用 → `workers[0]`，否则 `targetDeviceRef ?? workers[seed % len]`），
  实测 6/6，且翻转某一行的期望节点会让它变红。**该工具需要产出 City 的 owner 凭据，因此对侧主机（MEMBER）
  不能运行它**；对侧能跑的是包内那 27 项检查（它只能证明「判定与行内点名的节点一致」）或自己另写的重算。
· 本机无产品 main 合并权
```

## 已知的既有现象（与本工作无关但会影响复核时的 tree 状态）/ A pre-existing condition

任何一次跑完 **已接受的 REX-804 web 套件**都会改写 `evidence/raw/mission-book/REX-804/danger-zone.png`——该测试把截图写进**已提交**的证据路径。本机已发布待采纳的修复 `repair/REX-804-mech-test-evidence-outside-repo @ 690d723`。复核者若在该分支跑全量后看到这个文件变脏，那是这条既有缺陷，不是 REX-806 的。
