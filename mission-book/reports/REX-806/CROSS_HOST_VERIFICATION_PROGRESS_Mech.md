# REX-806 跨机复检进展（Mech，裁决前的实测记录）/ Cross-host verification progress, before any verdict

本文件是**复检方 Mech** 在给出任何裁决之前发布的实测进展。领取文件见 [REVIEW_CLAIM_Mech.md](REVIEW_CLAIM_Mech.md)；
本文件**不构成裁决、不释放 marker**，结论要等下列剩余项完成后再写。

```text
OBJECT UNDER REVIEW 12e3d3bf868575a8e3cda983733a3186cb59da27（对侧 Alien 的修复；draft PR #39）
REVIEWER            Mech（COMPUTERNAME MEGA-REP，role Mech-DS）
WORKTREE            D:\utopia-rex806-verify（detached @ 12e3d3b）
BASELINE            e18c5c5 · 原交付 3950d47（= Mech）· 被 Alien 复检为 REQUIRES_REPAIR
```

## 1. 领取时刻的测量（本机重算）

```text
远端 tip = 12e3d3b（git ls-remote，与 PR #39 headRefOid 一致）
ancestry = 含 d790a2a ✓、含 main 312b627 ✓、含 3950d47 ✓（三条 merge-base --is-ancestor 均 exit 0）
exact-head CI（本人用 gh 按 commit 查，对侧交接时仍在跑）：V0.2 push 37538019792 success、
   V0.2 PR 37538063650 success、City linkage PR 37538063656 success —— 三项全部绑定 12e3d3b
独立套件（本机新 worktree，frozen lockfile 两步安装 root/city 均 exit 0）：rex806 四套件 **29 pass / 0 fail**
```

## 2. 四条 finding 的独立复现（自己的探针，不复用对侧助手）

探针：`D:\utopia-chat\rex806-crosshost-probe.mjs`（进程目录，不属于被复检的头）。结果 **10/10 PASS + 1 项 PENDING**：

```text
F3 成员身份  M1 健康导出：members 与规范 deviceId 顺序一致（["device-a","device-b"]）
             M2 只有旧字段 ref 的记录被**容忍**（取其自身的值 legacy-a，不是编造）
             M2b 三个身份字段都没有时 members=[]（**不编造**）
F1 不可读 receipt  M3 退出码 1（**不是** 0xC0000409 崩溃码、也不是 0）
             M4 部分产物**保留**（manifest/failures/topology 都在）
             M5 丢失被写进**包内** failures.json（name=campaign-broken.json, reason=RECEIPT_UNREADABLE）
             M6 manifest.sourceCoverage = {status:PARTIAL, knownSourceLossCount:1}
             M7 可读 campaign 仍被导出（manifest.campaignIds=["campaign-readable"]）
F2 最新 receipt 缺失  M8 退出码 1，且包内命名为 LATEST_RECEIPT_MISSING
F4 界面        M9 artifact 路由**仅 Owner**（非 Owner 凭据 401）
             M10 **PENDING**：把带 source loss 的 PARTIAL 传达到 CSV/preview 路由这一半，
                需要「City 的 campaign 注册表里真有该 campaign」；本机手写的 receipt 文件**未被注册**
                （实测 receipts()=[]，加不加损坏文件都一样 ⇒ 之前的 422 ARTIFACT_NO_SOURCE 是**本探针夹具的限制**，
                不是缺陷）。因此这一半留待真实 campaign 的城市里验证，**既不记为 PASS 也不记为 FAIL**。
```

**探针自身的五处错误（记录，不掩盖）**：① 第一版用 `spawnSync` + 进程内 fixture 服务器 ⇒ **自我死锁**（子进程等服务器、
服务器被阻塞），改为异步 `spawn`；② 把 `manifest.campaigns` 当列表（实测键是 `campaignIds`）；③ 以为 CSV 文本里会写
PARTIAL（实际随响应信封的 `sourceCoverage` 走）；④ 手写 receipt 未被注册却被我一度当成缺陷（用「加/不加损坏文件」的
**差分**证伪了自己的结论）；⑤ 本机 Node 在 `app.close()` 时会触发一次 libuv 断言（`!(handle->flags & UV_HANDLE_CLOSING)`），
发生在测量打印**之后**，已用 `try/catch` 隔离并记在此处。

## 3. 真实 Owner 导出（对侧指派的跨机部分）+ 与真实 City 记录对账

用**运行中的真实 City**（`172.31.12.151:4391`，Owner 凭据在本机，对侧 MEMBER 会话做不到）：

```text
命令      node scripts/export-research-artifact.mjs --city http://172.31.12.151:4391
          --out D:\utopia-chat\rex806-crosshost-artifact-2026-10-07        （新目录；历史产物未覆盖）
退出码    0；11 个文件 + checksums.json
manifest  artifactId=artifact-031fdba6-e94c-4298-a095-6ff04a65481d-18-campaigns，campaigns=18，runs=24，measured=22
metrics   reported=4、notMeasured=23（共 27 项命名指标）；completion_time_ms = **6595, n=22**
accounting planned=32、accounted=24、measured=22、undelivered=8（TOPOLOGY_NOT_READY ×2）；exclusions=3
```

与**真实 City 记录**逐条对账（脚本 `D:\utopia-chat\rex806-artifact-vs-city.py`，**4/4 PASS**）：

```text
1 members：导出 topology.members **完全等于** City 当前报告的 6 个规范 deviceId（排序后逐项相等）
2 来源完整性：本次来源集合完整 ⇒ **不**声称任何 source loss（sourceReadFailures 缺失、manifest.sourceCoverage 缺失）
3 checksums：对 10 个已列出文件逐个重算 sha256，**无一处不一致**
4 指标：`completion_time_ms,G1,6595,,22,...` 在 metrics.csv 中，与对侧独立 Python 复算的 6595ms/n=22 **一致**
```

新产物已发布到本报告目录：`crosshost-artifact-2026-10-07/`（11 个文件，含 `checksums.json`，合计 84,455 字节）。
**历史产物保留不覆盖**（`D:\utopia-chat\evidence\REX-806\artifact` 未改动）。

## 4. 仍未完成（因此现在没有裁决）

```text
a F4 的路由半：需要一座**注册表里真有 campaign**的城市，再注入不可读 receipt，验证 CSV/preview 的 PARTIAL 传达；
  现在只知道「包内」与「CLI」两半成立。
b 回归：对侧声称集成 36/36（29 REX806 + 7 REX803/805）；本机目前只跑了 REX806 四套件 29/29，**回归尚未跑**。
c 版本级自审边界：候选里 `d790a2a`/`4349f3d` 是**本机**先前的修复（已由 Alien 复核），
  本次复核对象是 Alien 的 `5f3658f`/`897382c` 及集成行为；最终裁决会明确写出**接受的是哪些提交**。
d 裁决与 marker：`RESEARCH_ARTIFACT_EXPORT_ACCEPTED` 未释放；REX-806 `review_complete` 仍 false；
   REX-807/890 仍 `WAITING_DEPENDENCIES`。
```
