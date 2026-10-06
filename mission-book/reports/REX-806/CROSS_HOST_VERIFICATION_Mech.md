# REX-806 修复候选跨机复检与裁决 / Cross-host review of the repair candidate — Mech

```text
VERDICT            ACCEPTED —— 修复范围（repair scope）
REVIEW TARGET      12e3d3bf868575a8e3cda983733a3186cb59da27（draft PR #39 的头）
REVIEWER           Mech（COMPUTERNAME MEGA-REP，role Mech-DS）
原交付 / ORIGINAL   3950d478e627aaa615ef69e3ac65c30da37c5ea6（Mech）—— 已被对侧复检为 REQUIRES_REPAIR，未接受
BASELINE           e18c5c5350d7657cf046b7ba6bbcd888dc2a1540（三个已验收 REX 头的并集）
MARKER             RESEARCH_ARTIFACT_EXPORT_ACCEPTED（由本裁决释放）
领取 / CLAIM       reports/REX-806/REVIEW_CLAIM_Mech.md（裁决前发布）
进展 / PROGRESS    reports/REX-806/CROSS_HOST_VERIFICATION_PROGRESS_Mech.md（裁决前的实测记录）
```

## 1. 裁决对象与独立性记账（写明，不含糊）

```text
候选 = Mech 先前的修复（d790a2a、4349f3d）+ Alien 本次的新修复（5f3658f、897382c）+ 与 main 312b627 的合并。
独立性：Alien 复核了 Mech 那一半（其 REVIEW_REPORT 的 F1/F2 描述的就是 d790a2a 的行为）；
        本裁决复核的是 **Alien 那一半及其集成行为**，因此对 5f3658f/897382c 而言 Mech 是合法对侧。
        「三主机独立」不存在，本文件**不**声称任何超出上述结构的独立性。
接受内容：Alien 的 5f3658f（下载工件内保留成员身份与来源丢失）与 897382c（在工件 API 各面保留来源丢失与成员拓扑），
        以及二者与既有修复、与 main 的集成。原交付 3950d47 本身仍**不是**被接受的实体；被接受的是修复头 12e3d3b。
```

## 2. 独立证据（全部由本机重算，不引用对侧叙述）

```text
exact-head CI（按 commit 查，绑定 12e3d3b）：V0.2 push 37538019792 success、V0.2 PR 37538063650 success、
   City linkage PR 37538063656 success（对侧交接时仍在跑；现在三项全绿）
套件           新 worktree（frozen lockfile 两步安装 root/city 均 exit 0）：
               rex806-{cli,artifact,artifact-surface,artifact-verify} = **29 pass / 0 fail**
回归           REX-803/805 全部套件：非 web 10 套件 **50 pass / 0 fail**、campaign-web 2/2、rex805-web 2/2
               => 合计 **54 pass / 0 fail**（对侧报的 7 项是其中子集）
边界探针       D:\utopia-chat\rex806-crosshost-probe.mjs => **10/10 PASS + 1 PENDING**（PENDING 已在 §3 补齐）
F4 路由探针    D:\utopia-chat\rex806-f4-route-probe.mjs => **4/4 PASS**（真实 runner 产生的 receipt + 注入不可读）
真实 Owner 导出 对运行中的 City（172.31.12.151:4391）：artifact-031fdba6-...-18-campaigns，11 文件 + checksums，
               与真实 City 记录对账 **4/4**（成员逐个相等 / 完整集不虚报丢失 / 10 文件 sha256 无差异 / 指标在场）
历史产物保留   D:\utopia-chat\evidence\REX-806\artifact 逐文件重算 sha256：**10/10 无差异**（未被覆盖）
```

## 3. 四条 finding 的结案

```text
F1 不可读 receipt 使 CLI 崩溃且无产物
   修复 d790a2a：命名该 receipt、保留部分产物、非零退出。
   本机复现（M3–M7）：退出码 1（**不是** 0xC0000409、也不是 0）；manifest/failures/topology 三件产物都在；
   failures.json 内含 {name: campaign-broken.json, reason: RECEIPT_UNREADABLE}；manifest.sourceCoverage=
   {PARTIAL, knownSourceLossCount:1}；可读 campaign 仍被导出（campaignIds 长度 1）。=> **结案**
F2 最新 receipt 缺失时静默少导出
   修复 d790a2a。本机复现（M8）：退出 1，且**包内**命名为 LATEST_RECEIPT_MISSING。=> **结案**
F3 规范成员字段（deviceId vs ref/devicePrincipalId）导致 members 为空
   修复 5f3658f/897382c。本机三向复现：规范 deviceId 顺序保留（M1）；只有旧 ref 的记录被容忍取其自身值（M2，
   非编造）；三个身份字段全无时 members=[]（M2b）。并在**真实 City** 上对账：导出 members 与 City 当前报告的
   6 个规范 deviceId 逐个相等。=> **结案**
F4 部分下载的来源丢失只写到 stderr
   修复声明：failures.json + manifest PARTIAL + preview + CSV 四个面。
   包内/CLI 半：M5/M6 已证。
   路由半（本文件补齐，此前记 PENDING）：rex806-f4-route-probe.mjs 用**产品自己的 runner**产生两份真实 receipt，
   再损坏其中一份：
     R1 注册表确实列出两份 receipt（引号：REFUSED 也是 receipt）——因此证明夹具不再是限制；
     R2 完整来源集在路由上回 `{status:'NO_KNOWN_SOURCE_LOSS'}`；
     R3 损坏一份后 CSV 路由回 **{status:'PARTIAL', knownSourceLossCount:1}**；
     R4 preview 路由的 manifest 同样 PARTIAL。=> **结案**
```

## 4. 本轮我自己的仪器错误（记录，不掩盖）

```text
E1 spawnSync + 进程内 fixture 服务器 = 自我死锁（子进程等服务器、服务器被同步阻塞）→ 改异步 spawn。
E2 把 manifest.campaigns 当列表（实测键是 campaignIds）。
E3 以为 CSV 文本内会写 PARTIAL（实际随响应信封的 sourceCoverage 走）。
E4 手写 receipt 未被 City 注册，我一度把 422 ARTIFACT_NO_SOURCE 当缺陷 —— 用「加/不加损坏文件」的差分证伪了自己。
E5 本机 Node 在 app.close() 触发 libuv 断言（!(handle->flags & UV_HANDLE_CLOSING)），发生在测量打印之后，已隔离。
E6 F4 路由探针第一版的两座 campaign 都是 `TOPOLOGY_NOT_READY` 被拒（我的 manifest 声明的拓扑在这座临时 City 上
   不成立）——这不影响结论（REFUSED 的 receipt 仍是可读 receipt，损坏它即可制造「有来源 + 有丢失」的场景），
   但必须写明：R2–R4 验证的是**来源丢失的传达**，不是 campaign 成功完成。
E7 我对 REX-803/805 的「回归 7 项」起初按对侧叙述去找文件名，猜错两个（对侧报的是子集）——改为列出全部套件再跑。
```

## 5. 本裁决**不**声称的事

```text
· 不声称任何新的产品面或 TWO_HOST 级能力：被验收的是「导出链路在边界上不撒谎、且能被对侧独立重算」。
· 不把修复验收当作 REX-807/890 的自动依赖满足：它们依赖 REX-806 的 `status: COMPLETE`，现在该门可判，
  但每本书仍须在**自己的 claim-time**重新解析依赖与基线（那是各自的任务，不在本文件承诺）。
· 不改变 Owner 的合并门：REX-806 的 `merge_authority` 仍为 false（合格合并需 Owner 口径，本机不自授）。
```

## 6. 保留与位置

```text
新完整产物   mission-book/reports/REX-806/crosshost-artifact-2026-10-07/（11 文件 + checksums.json，84,455 字节）
             逐文件 sha256 由 checksums.json 公布；已确认**提交进 git 的 blob 字节**正是被哈希的字节（10/10）
             该路径已在 .gitattributes 标 `-text`，避免 Windows 检出改写行尾使校验和失效
历史产物     D:\utopia-chat\evidence\REX-806\artifact 未改动（10/10 重算无差异）
失败与中间材料 reports/REX-806/intermediate-logs/ 保留对侧本轮原始材料；本机探针保留在 D:\utopia-chat（过程目录）
```
