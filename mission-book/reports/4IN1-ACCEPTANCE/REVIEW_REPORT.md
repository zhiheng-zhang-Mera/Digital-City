# 复检裁决 / Review verdict — 4-in-1 整包验收，2026-10-07

[完整验收记录](README.md) · [English reading](en/REVIEW_REPORT.md)

```text
裁决对象 / reviewed head   185d043e11ae8516a1e7a492d09d031610be576b
分支 / branch              4-in-1-REX+PCF+CHK+DGX（zhiheng-zhang-Mera/utopia）
裁决 / verdict             ACCEPTED — 整包（integrated），**不是**逐本拆分复检
裁决主机 / host            Mech（COMPUTERNAME MEGA-REP）
复核头 / review head       185d043e11ae8516a1e7a492d09d031610be576b（= 开发头；本记录不伪造第二个头）
豁免 / waiver              Owner 裁决 2026-10-07：四系列开发与验收记为完成，逐本拆分验收由该裁决豁免
合并权 / merge authority   false（PR #46 MERGEABLE/CLEAN，合并决定归 Owner）
```

## 本目录为什么同时是 40 本工作书的 `report_path`

PCF-702..728、CHK-101..401 与 CHK-990、DGX-001..007 与 DGX-990 这 40 本工作书在 2026-10-07 收口时，
**没有**各自的 `reports/<ID>/REVIEW_REPORT.md`：本轮验收本来就不是逐本做的。它们的 `report_path` 因此统一指向
本目录，指向的是**真实存在的验收记录**，而不是一个空指针或一个事后补写的目录。工作书 frontmatter 里的
`integrated_acceptance_2026_10_07`、`unfixed_gaps_2026_10_07`、`terminal_marker_statement_2026_10_07` 与
`owner_ruling_2026_10_07_four_series_closure` 是本裁决的绑定字段。

## 裁决依据 / Basis

```text
1  精确头 CI 四个 run 全部 completed/success，且都绑定 185d043（run 37613355839 / 37613438305 /
   37613438289 / 37613438369）；PR #46 mergeable=MERGEABLE、mergeStateStatus=CLEAN。
2  本机重跑：node --test tests/*.test.mjs 1969/1961 通过/5 失败/3 跳过（5 项失败可逐条归因：3 项本机常驻 City
   造成的设计性拒绝 + 2 项负载敏感 flake，单独运行通过）；node city/test-all.mjs 2013/2006/0/7；
   verify-promotion-history exit 0；pnpm check:docs exit 0。
3  系列面：pcf 406/403/0/3（skip 全为 typed 外部前提）· dgx 52/52 · rex801..807 158/158 · CHK 模块 27/27。
4  异机：在 185d043 重启的真实 City 上，两个节点 ONLINE/HEALTHY，严格指向 Alien 节点的 canonical 任务
   state=COMPLETED、progress=100，结果带 bytes=65 与 sha256=248dbb67…；本节点同样跑通。
   /api/v0/join/nearby bounded=true discovered=1 excludedSelf=1 rows=0；/api/v0/health healthy；
   /api/v0/pcf COMPLETE；/api/v0/governance AVAILABLE。
5  八条缺陷（D1/D2/D3/D4/D5/D6/D11/D12）在本头修复，每条带可证伪守卫。
```

## 本裁决明确**不**覆盖 / Explicitly not covered

```text
· 逐本独立复检：由 Owner 裁决豁免，本轮**没有**为这 40 本各自做一次独立复核。
· REX-890：未开工（无 heads、无报告目录、无 RESEARCH_MATERIAL_SYNTHESIS.md），
  programme 终态标记 RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE **未释放**。
· PCF 702/703/709/710/711 点名的两主机/两 worker 物理半边：未执行、未标 NOT_RUN；
  PCF-719 无 androidTest instrumentation source set；PCF-718 点名的 platform/linux/pcf-worker/ 不存在。
· DGX validateDomainGate：发布路径无调用点（发布门信任主机端口、缺门时失败关闭），未在真实发布中被执行过。
· REX-801 缺五个点名字段；REX-807 的 `pause` 无路由、campaign 页 seed/warmup/abandon 绕过
  ADVANCED_CONTROL 确认路径。
· 整包合并：merge_authority 一律 false。
```

**豁免的可见性**：一致性检查器只在 `review_complete: true` 且 `review_host` 或 `review_head_sha` 缺失时打印
`REVIEW_WAIVED_BY_RECORDED_AUTHORITY`。本轮这 40 本同时记录了 `review_host: "Mech"` 与精确
`review_head_sha`，所以那一行不会出现；豁免事实由本文件、`README.md` §7 与每本工作书的
`owner_ruling_2026_10_07_four_series_closure` 字段共同保留，不靠检查器的这一行来证明。
