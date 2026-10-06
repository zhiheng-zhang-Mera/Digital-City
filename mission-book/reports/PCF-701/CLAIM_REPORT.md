# PCF-701 领取记录 / Claim report

```text
任务 / task        PCF-701 实时资源观测与 freshness / Live resource telemetry, presence and freshness
领取者 / claimant  Mech-DS（COMPUTERNAME MEGA-REP，role Mech-DS，development side）
时间 / at          2026-10-07
实现仓库 / repo    zhiheng-zhang-Mera/utopia
系列分支 / series  pcf/series-mech（本系列累计分支，头 659ff6a）
任务分支 / branch  pcf/PCF-701-mech-live-resource-telemetry（自 659ff6a 起）
工作书 / workbook  mission-book/mission-group/personal-compute-fabric/PCF-701-live-resource-telemetry.md
激活回执 / receipt mission-book/mission-group/personal-compute-fabric/ACTIVATION_RECEIPT_2026_10_07_PCF-701.md
```

## 为什么现在可以领（依赖来自已验收的工作书，不来自叙述）

```text
PCF-700  status=COMPLETE、review_complete=true、review_host="Alien"、
         review_head_sha=659ff6aa98bc5675862b1170ed0cf5e1b78dba5f（异机裁决 ACCEPTED，未要求修复）
baseline 659ff6a —— 它同时是 pcf/series-mech 的累计头；origin/main 312b627 是它的祖先（实测）
```

**关键选择记录**：PCF-700 虽然被验收，但 `merge_authority=false`、**没有**做产品合并，因此 PCF-701 的
development baseline 取**系列分支头**（`659ff6a`）而不是 main。这样 PCF-701 的起点天然包含 PCF-700 与更早的
WBC/REX 已接受工作，且不需要任何 union 合并动作。

## 本轮打算做的（工作书 §文件与接口 / §增强子任务 / §独立验收）

```text
交付   contracts/personal-compute-fabric-v1/observations.mjs（observeResources(sample, context) -> ResourceObservation）
       services/personal-compute-fabric/telemetry.mjs（有界缓冲、限频、丢弃计数、overhead 测量）
       tests/pcf701-telemetry.test.mjs（工作书点名的反例：missing/NaN/负数/单位错误不变 0、乱序不覆盖新值、
       reboot epoch 不混、时钟回拨不能让过期数据永久新鲜、测量超时不冻结 executor、缓冲满时丢弃数可见）
约束   不改变 trust 或 claim authority；不采集未授权进程名/窗口内容/个人文件；GPU/网络/电池缺席时声明
       UNKNOWN/UNSUPPORTED 而不是填 0
```

## 边界（与 PCF-700 相同，未越过）

```text
不采购/不付费、不装系统服务、不改运行 profile、不启用远端执行；merge_authority 保持 false；双机规则不变
（开发在本机，正式复检必须由另一实体主机完成）。
```

## 下一步

按工作书子步骤施工；每次完成后同样更新三处任务板（工作书 frontmatter + `reports/PCF-701/` + 系列/主台看板）。
