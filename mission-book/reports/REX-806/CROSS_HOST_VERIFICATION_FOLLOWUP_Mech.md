# REX-806 验收后候选的跨机复检 / Cross-host verification of the post-acceptance follow-up — Mech

```text
VERDICT            ACCEPTED —— 验收后修复范围（relative to the already accepted head 12e3d3b）
REVIEW OBJECT      cc799234e7daa3d8ccfde5673b9d07ccb2376742（分支 repair/REX-806-alien-missing-task-and-bounded-window-20261007，PR40 当前 tip）
HANDOFF NAMED      1743d7622326814a07526c739dc7b780e971cf5a —— 对侧文档写的是这个头，**其后分支又前进了一个提交**
ACCEPTED BEFORE    12e3d3bf868575a8e3cda983733a3186cb59da27（我已裁决 ACCEPTED 并合并进 main；本候选包含它）
REVIEWER           Mech（COMPUTERNAME MEGA-REP，role Mech-DS）—— 对 Alien 的修复提交而言是合法对侧
MARKER             REX-806 的 `RESEARCH_ARTIFACT_EXPORT_ACCEPTED` 早已释放；本次**不新释放、也不撤销**任何 marker
MERGE              main 已**快进**到 cc79923（main 是它的祖先，实测 exit 0）；见 MERGE_RECORD_FOLLOWUP_Mech.md
```

## 1. 头为什么会移动（实测，并保留 1743d76 的红）

```text
分支 tip = cc79923（git ls-remote 与 PR40 headRefOid 一致）；对侧交接文档写的是 1743d76。
1743d76..cc79923 只有一个提交：`cc79923 fix(research): independently verify duplicate canonical task executions`。
exact-head CI（按 commit 查）：
  · 1743d76：V0.2 checks **push 37548842702 failure** —— 唯一失败项是既有套件
    「Windows Services invokes real document, knowledge, skill, evidence and theme adapters」(16.1s)，**非 REX-806 自身**；
    PR 37548883001 与 linkage 37548882684 为 success。
  · cc79923：push 37549801619、PR 37549806262、linkage 37549806355 —— **三项全绿**。
⇒ 复检对象取**当前 tip**；1743d76 的红与其失败项归属照实记录，不因为「后来绿了」而抹掉。
```

## 2. 本机独立复现的五条 finding（自己的探针，`D:\utopia-chat\rex806-followup-probe.mjs`）

**14/14 PASS**：

```text
F1 缺任务的回执（P1a–P1d）
   MEASURED 运行引用了不存在的任务 → `convergence_missing_event_count` = **1，n = 1**（不再是 0/n0）；
   任务在场的对照 → 0/n1；完全没有 taskRef 的 MEASURED 运行 → 也计 1。分母是 **MEASURED 运行**，不是只算 completed。
F2 回执窗口的已知边界（P2a–P2d）——51 条回执的城市：
   产品列表 receiptWindow = {total:51, returned:50, limit:50, **truncated:true**}；
   CSV 路由 `{status:'PARTIAL', knownSourceLossCount:1}`；preview 的 manifest 同样 PARTIAL；
   **包内** failures.json 命名 `{name:'campaign-receipt-window', reason:'RECEIPT_WINDOW_TRUNCATED', total:51, returned:50}`。
F3 列表后可读性丢失（P3a–P3c）
   先读到两条可读回执，再把其中一条写坏 → 列表把它作为 **UNREADABLE 条目**返回（不是异常），
   导出仍 200 且 sourceCoverage = PARTIAL（部分导出存活，没有整包失败）。
F4 校验器精度（P4a/P4b）
   构造 accounted=3、failed=1 的诚实包：发布 `failure_rate = 0.333333`（六位小数）；
   **独立校验器**（`scripts/verify-research-artifact.mjs`，不 import 导出器）在我自建的包上 **15/15 通过**。
F5 语义与完整性解耦（P5）
   把 metrics.csv 里一个已发布指标改掉**并同步刷新 checksums.json** → 校验器仍以
   「failure_rate recomputes from the accounting [recomputed 0.333333 at n=3, package says 1.333333 at n=3]」**失败**。
```

## 3. 更宽的独立证据

```text
REX-806 四套件（本机新 worktree，两步 frozen lockfile）：**41 pass / 0 fail**
前驱回归 REX-803/805 全部套件（非 web 10 套件）：**50 pass / 0 fail**
已发布真实导出的可复检性：本次校验器在同一形状的包上 15/15（历史真实包仍保留未改）
```

## 4. 我方探针自己的三处错误（记录，不做美化）

```text
E1 我自建的包**没有写 checksums.json**（`artifactFiles()` 不含它，CLI 才写），校验器因此报 ENOENT。
   → 改为用 `checksumsFor(files)` 生成，与 CLI 发布的形状一致。
E2 我猜 metrics 在 `manifest.supporting.metrics` 里 —— 实际不在；**指标面是 metrics.csv**。
   → P5 改为直接改 metrics.csv 的一行并刷新校验和。
E3 我的回执夹具用了可读名字（`campaign-mech-window-…`），而产品只把
   `^campaign-<hex-uuid>\.json$` 当作回执 ⇒ 列表 total=0，一度出现 7 条「失败」。
   → 追到 `RECEIPT_FILE` 后改用 UUID 形状的名字，**7 条全部转为 PASS**；这不是产品缺陷，是我夹具的限制。
```

## 5. 本裁决**不**声称的事

```text
· 不改写此前对 12e3d3b 的 ACCEPTED、不改写已发布的历史产物与既有导出。
· 不释放新 marker、不撤销旧 marker：REX-806 的标记状态与工作书既有字段保持已记录状态；
  本次只是新增「验收后修复已被异机复检接受」的记录，并在其中写明对象头与相对关系。
· 不声称超过 50 条的**完整历史**已可导出：修复做的是**如实记录边界**（total/returned + PARTIAL），
  不是把窗口变大；这一点写在结论里以免被读成能力扩张。
· REX-807 仍是在制任务；本次不改其 development 记录。本次合并只把 main 推进到已复检的修复头。
```
