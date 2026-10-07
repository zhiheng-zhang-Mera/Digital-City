# REX-806 验收后候选的复检领取 / Review claim for the post-acceptance follow-up (Mech)

```text
STATUS              REVIEW_CLAIM —— 领取先于任何裁决；本文件不构成裁决、不释放/撤销任何 marker
TASK                REX-806 指标分析与研究工件导出（**验收后的后续修复**）
OBJECT UNDER REVIEW cc799234e7daa3d8ccfde5673b9d07ccb2376742
                    （分支 repair/REX-806-alien-missing-task-and-bounded-window-20261007，draft PR40 的当前 tip）
HANDOFF NAMED       1743d7622326814a07526c739dc7b780e971cf5a —— 对侧交接文档里写的是这个头，**分支其后又前进了一个提交**
ACCEPTED HEAD       12e3d3bf868575a8e3cda983733a3186cb59da27（我已裁决 ACCEPTED，且已合并进 main；本候选包含它）
REVIEWER            Mech（COMPUTERNAME MEGA-REP，role Mech-DS）—— 对 Alien 的修复提交而言是合法对侧
WORKTREE            D:\utopia-rex806-followup（detached @ cc79923，依赖两步 frozen lockfile 安装）
```

## 1. 头为什么会移动（实测，不是听说）

```text
git ls-remote: 分支 tip = cc79923…；PR40 headRefOid 同样是 cc79923…
交接文档写的是 1743d76…
1743d76..cc79923 之间的提交：`cc79923 fix(research): independently verify duplicate canonical task executions`
exact-head CI（按 commit 查）：
  · 1743d76：V0.2 checks push 37548842702 **failure**（唯一失败项是既有套件
    「Windows Services invokes real document, knowledge, skill, evidence and theme adapters」，16.1s，**非 REX-806 自身**），
    PR runs 37548883001 / linkage 37548882684 success
  · cc79923：push 37549801619 success、PR 37549806262 success、linkage 37549806355 success —— **三项全绿**
⇒ 本次复检对象取**当前 tip cc79923**（含额外提交且三项全绿），并在报告中同时记录 1743d76 那次红与其失败项归属。
   不对 1743d76 单独下发裁决：它不是当前 tip，但**它的失败记录不会被抹掉**。
```

## 2. 本次要独立复现的五条后续 finding（对侧在自己文件里列出）

```text
F1 缺任务的 receipt：MEASURED 回执引用了一个已被删除的任务时，convergence loss 报 0/n0，**应为 1/n1**。
F2 回执窗口：产品列表在 50 条封顶；51 条回执的城市会少一条却**不记录这个已知边界**。修复应记录 total/returned
   并把覆盖标为 PARTIAL（artifact 与 CSV 两个面）。
F3 列表/详情竞态：列表可读之后才损坏的回执，应返回 UNREADABLE 哨兵而不是抛异常，且不得毁掉整个部分导出。
F4 校验器精度：诚实的六位小数失败率与有理由的 NOT_MEASURED 曾被误拒；重算必须用已发布精度并校验不可用状态与原因。
F5 语义测试先用陈旧校验和：语义检查须先刷新哈希，使「改动指标/时间戳/原因」必然在语义层失败，而**不依赖**完整性检测。
```

## 3. 我要独立制造什么（不复用对侧探针）

```text
V1 自己的四套件运行（先在本 worktree 跑 REX-806 四套件，再跑前驱回归 REX-803/805）。
V2 自建反例复现 F1–F3：缺任务包（1/n1）、51 条回执窗口（total/returned + PARTIAL 且双面可见）、
   「先列表后可读性丢失」的哨兵行为与部分导出存活。
V3 F4：用**六位小数**的诚实失败率与带原因的 NOT_MEASURED 输入，确认校验器接受；并确认它会拒绝被篡改的原因。
V4 F5：对语义测试做一次**变异**（改一个指标值/时间戳/原因而不改完整性文件），确认语义层变红。
V5 用我已发布的真实导出 `mission-book/reports/REX-806/crosshost-artifact-2026-10-07/` 作为独立输入跑校验器。
V6 记录我方仪器错误（本工程惯例）。
```

## 4. 领取时刻不声称的东西

```text
· 不预先给出 PASS；五条 finding 是否真的修好以 V1–V5 的实测为准。
· **不因本次复检改写**我已发布的 REX-806 ACCEPTED 裁决、已合并的 12e3d3b、或任何历史产物；
  本次只会新增「验收后修复」的记录。
· 不做产品合并：本次候选的 `merge_authority` 未授予；REX-806 工作书的既有字段保持已记录状态，
  若本次给出结论，将明确写出「结论对象是哪个头、相对哪个已接受头」。
· REX-807 仍是在制任务；本次复检不改其 `development_*` 记录。
```
