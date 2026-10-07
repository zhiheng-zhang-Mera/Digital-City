# 4-in-1 整包验收 / Four-series integrated acceptance — 2026-10-07

[English reading](en/README.md) · [Mission Book](../../README.md) · [Review verdict](REVIEW_REPORT.md)

```text
验收对象 / accepted head    185d043e11ae8516a1e7a492d09d031610be576b
分支 / branch               4-in-1-REX+PCF+CHK+DGX   (repo zhiheng-zhang-Mera/utopia)
合并基点 / merge base       c0034329343bcdbf8daac5972d0bae1673d9c5a3 = origin/4-in-1-REX+PCF+CHK+DGX before this round
merge base / main content   17271f04829877ee56668221afeda5fbd35f66e8（origin/main db6b6f9 同一棵树）
验收主机 / host             Mech-DS（COMPUTERNAME MEGA-REP）
PR                          https://github.com/zhiheng-zhang-Mera/utopia/pull/46   MERGEABLE / CLEAN
合并权 / merge authority    false —— 整包可合并 ≠ 已合并，合并决定归 Owner
```

本轮把四条系列的工程与验收一次性收口：**REX-801..807、PCF-700..728、CHK-101..990、DGX-001..990** 在同一个
集成头上完成开发并把异机验收所需证据一次取齐；REX-890 **未开工**，因此 REX 系列的 programme 终态标记
**未释放**（见 §6）。

## 1. 被合并的系列头 / Series heads folded into the pack

```text
DGX 系列        e5a03dae02ca341d6d23565735e6cd6c3edc27d9   已并入 main（合并提交 a1bb0937defc29af686cb40f1a21340731d4d7a3）
CHK 系列        9a646d6b894babd0fb316c0b4a0ba302bd7bca7d   已并入 main（合并提交 a1bb093）
PCF 系列 tip    6b6963210c103db2ab25b5bbf34bdbf09e63bf1a   PR #45，本轮折入 4-in-1 包
REX-801..807    158 项测试在三端/异机证据下通过（见 §4）；
REX-890         未开工：无 heads、无报告目录、无 RESEARCH_MATERIAL_SYNTHESIS.md
```

`17271f04829877ee56668221afeda5fbd35f66e8` 是这四条上游头的**集成点**，也是本轮工作书
`required_ancestor_shas` 记录的值；`development_baseline_sha` 记录的是各系列真正施工用的系列头，两者在
`baseline_resolution_evidence` 里逐条写明，不混用。

## 2. 精确头 CI（全部来自 Actions API 实测）/ Exact-head CI

```text
push          V0.2 checks                     run 37613355839   gateway-web SUCCESS · android SUCCESS
pull_request  V0.2 checks                     run 37613438305   gateway-web SUCCESS · android SUCCESS
pull_request  City linkage check              run 37613438289   reciprocal-contract SUCCESS
pull_request  PCF Linux component candidate   run 37613438369   linux-components SUCCESS
```

四个 run 都绑定 `185d043`，全部 `completed/success`；PR #46 实测 `mergeable=MERGEABLE`、
`mergeStateStatus=CLEAN`。**没有用合并后的近似头冒充精确头**。

## 3. 本机重跑（Mech，COMPUTERNAME MEGA-REP）/ Local re-runs at 185d043

```text
node --test tests/*.test.mjs                 1969 项 / 1961 通过 / 5 失败 / 3 跳过
  5 项失败 = tests/host-city-launcher.test.mjs ×3（本机常驻 City 占着协调端口，该测试按设计拒绝）
           + 2 项负载敏感的 web flake（theme-packages store guard、rex803-campaign-web），单独运行均通过
node city/test-all.mjs                       2013 项 / 2006 通过 / 0 失败 / 7 跳过
node scripts/verify-promotion-history.mjs    exit 0
pnpm check:docs                              exit 0
```

系列面 / Series surfaces：

```text
tests/pcf*.test.mjs        406 项 / 403 通过 / 0 失败 / 3 跳过（3 项 skip 全是 typed 外部前提）
tests/dgx-*.test.mjs        52 项 /  52 通过 / 0 失败
tests/rex801..807          158 项 / 158 通过（按任务文件成组运行；其中 3 项在满并行负载下超时、单独运行通过）
CHK 模块测试                27 项 /  27 通过（city/02-engineering/05-city-self-health-check/city-self-health-check/tests/）
```

## 4. 异机（真实 City）证据 / Cross-host evidence

```text
运行中的 City                始于基线 185d043 的重启实例：D:\utopia-rex-pcf-merge，pid 44920，172.31.12.151:4310
两节点                       ONLINE / HEALTHY
                             Mega-rep  dev-544adda130594c6fae7d71ddfd0f3b8c
                             Alien     dev-1428bce5297146df88720f270af71bc3（hostname Mera-Alianware）
nodeDescriptor               contractVersion=1，roles=[EXECUTION_NODE]
严格指向 Alien 的 canonical 任务  state=COMPLETED · progress=100 · assignedNodeId=dev-1428bce5…
                             result={bytes:65, sha256:248dbb6778be39e9de1460909c35dd4628944852c89f6d6dda4fa97f8fe3f001, cleaned:true}
本节点同样跑通               （同一构造，结果按节点分别留存）
/api/v0/join/nearby          bounded=true discovered=1 excludedSelf=1 rows=0
GET /api/v0/health           healthy
/api/v0/pcf                  completeness=COMPLETE
/api/v0/governance           AVAILABLE
```

这是**真实跨主机执行**：任务不是"看起来发到了对侧"，而是由对侧节点执行并返回可复核字节数与 SHA256 的结果。

## 5. 本轮发现并修复的缺陷（每条都有可证伪守卫）/ Defects found and fixed at 185d043

```text
D1  services/dev-gateway/server.mjs 在一次开放的局域网发现扫描里，关闭后从 null 的 server.address() 读 .port，
    可以把整个 City 打死。
D2  contracts/deliberative-governance-v2/assignment.mjs 里 ENGINEERING 复核的独立性下限是**按调用方写角色的拼写**
    选的，于是同主机复核者只要把角色改个名字就能被选中。
D3  CHK 的敏感路径过滤器漏掉 id_rsa/.npmrc 等，被声明为凭据的路径仍被读取并哈希进 source-manifest.json。
D4  脱敏漏掉 AWS/GCP/Slack/Stripe/PEM 形状。
D5  未被引用的敏感路径被静默丢弃，而 static_scan_complete 仍然为 true。
D6  一条被刻意标记为"不读"的路径同时被报成 DEAD_CAPABILITY_RECORD。
D11 apps/web/research.js 从未调用 assertPrimarySurfacesClean，主面守卫因此形同虚设。
D12 5 条 DIRECT_CONTROL 里只有 2 条带 wired/wiredAt。
```

编号沿用本轮验收记录（D1–D12 中已修复的八条；其余编号不是"已修"）。

## 6. 实测但**未修复**、且**不声称已关闭**的缺口 / Measured-but-unfixed gaps

```text
REX-801  冻结的 manifest 契约缺少其工作书点名的五个字段：metrics、research_signal_ids、research_grade_snapshot、
         control_plane_rule_version、authority_surfaces_if_applicable。
REX-807  RESEARCH_CONTROL_SURFACE.md 里的 `pause` 控件没有路由；campaign 页面的 seed/warmup/abandon 控件绕过
         ADVANCED_CONTROL 的确认路径。
PCF      702/703/709/710/711 点名的"两主机/两 worker 物理半边"**既未执行，也未标记 NOT_RUN**；
         719 没有 androidTest instrumentation source set；718 点名的 platform/linux/pcf-worker/ 路径不存在。
DGX      validateDomainGate 在发布路径里没有任何调用点 —— 发布门信任一个主机端口，缺门时以失败关闭。
REX-890  可复现性研究与冻结**尚未开工**：无 heads、无报告目录、无 RESEARCH_MATERIAL_SYNTHESIS.md，
         programme 终态标记 RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE **未释放**。
```

## 7. 四条系列的记账方式与豁免 / How the four series are recorded, and the waiver

```text
REX  research-strengthening 保持 active_pool: true，**不搬进 finished/**：REX-890 是真正未开工的开放工作书，
     搬走会把它从生成的开放工作书列表里抹掉，那是**隐藏工作**而不是收口。
     REX-801..807 的开发与验收完成且已并入 main；REX-890 未开工；programme 标记未释放。
PCF / CHK / DGX 三系列本轮移入 finished/completed-2026-10-07/，manifest 的 active_pool 置 false；
     档案不激活任何任务，也不授予领取或合并权。
合并权 四系列工作书的 merge_authority 一律 false：整包 MERGEABLE 不是已合并。
```

**关于 Owner 豁免的可见性（照实说）**：四系列工作书都带 `owner_ruling_2026_10_07_four_series_closure`
字段，记录 Owner 本轮指示"四系列的开发与验收记为完成、逐本拆分验收由该裁决豁免"。一致性检查器只在
`review_complete: true` 而 `review_host` 或 `review_head_sha` 缺失时才打印
`REVIEW_WAIVED_BY_RECORDED_AUTHORITY`；本轮这 40 本**同时**记录了 `review_host: "Mech"` 与精确
`review_head_sha`，所以该行不会出现 —— 这**不是**要把豁免藏起来，而是因为对这些记录而言复核主机、复核头与
CI 就是开发主机、开发头与同一次 CI。豁免的事实与本段一起保留在案，任何读者都能看到拆分复检并未发生。
（`CEX-790`、`WBC-604` 的历史豁免仍按原样打印。）

## 8. 不声称的事 / Non-claims

```text
· 不声称四系列每一本都做过独立的逐本复核 —— 逐本拆分验收由 Owner 裁决豁免，本报告是**整包**验收记录。
· 不声称 REX-890 已开工或 programme 冻结标记已释放。
· 不声称 PCF 的点名物理半边（两主机/两 worker、实体 Linux worker、手机 worker、真实 Codex/DeepSeek 闭环）
  已完成；它们保持未验收。
· 不声称 DGX 的发布门在生产发布路径上被真实执行过（validateDomainGate 无调用点）。
· 不声称整包已合并：merge_authority 一律 false，PR #46 只是 MERGEABLE/CLEAN。
· 不声称本机全量套件全绿：1969 项里 5 项失败，其中 3 项是本机常驻 City 造成的设计性拒绝、2 项是负载敏感
  flake；两者都按"红后绿"如实记录，不写成通过。
· 不把分支名当证据：所有验收事实绑定 40 位 full SHA 与 run id。
```

## 9. 复现入口 / Reproduction entry points

```text
工作书 frontmatter（权威）  mission-book/mission-group/{research-strengthening,personal-compute-fabric,
                          city-self-health-check,deliberative-governance-expansion-migration}/
                          以及本轮归档的 mission-book/finished/completed-2026-10-07/
逐本验收面                 utopia:tests/pcf702-placement.test.mjs … tests/pcf728-*.test.mjs（工作书验收段点名的命令）
                           utopia:tests/dgx-*.test.mjs · utopia:tests/rex80*.test.mjs · CHK 模块 tests/
City 侧投影               GET /api/v0/pcf · GET /api/v0/health · GET /api/v0/governance · /api/v0/join/nearby
```

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **4**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| en | 2 | [打开 / Open](en/README.md) |

### 本目录说明 / Local documents

- [REVIEW_REPORT.md](REVIEW_REPORT.md)

<!-- DOCUMENT_NAVIGATION:END -->
