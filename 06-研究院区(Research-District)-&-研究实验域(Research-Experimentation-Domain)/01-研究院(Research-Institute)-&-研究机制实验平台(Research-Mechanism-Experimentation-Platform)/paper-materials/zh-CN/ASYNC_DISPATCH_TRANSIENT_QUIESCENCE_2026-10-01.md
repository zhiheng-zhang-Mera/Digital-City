# 论文素材——异步多主机调度中的“瞬时静默”问题

FACT: INCIDENT_ID=ASYNC-DISPATCH-TRANSIENT-QUIESCENCE-2026-10-01
FACT: GLOBAL_COMPONENT_TASKS=41
FACT: DEVELOPMENT_IMPLEMENTED=41
FACT: FULLY_TWO_STAGE_COMPLETE_AT_FINAL_SNAPSHOT=20
FACT: CORRECTION_CODE_COMPLETE_CI_BLOCKED=2
FACT: DEVELOPMENT_CODE_COMPLETE_CI_BLOCKED=5
FACT: DEVELOPMENT_GREEN_WAITING_CORRECTION=14
FACT: UTOPIA_MAIN_STAYED_AT=82ed36933fb4c5b00e44768d9e1aedec1d525d9c
FACT: FAILURE_CLASS=TRANSIENT_ZERO_ELIGIBILITY_MISREAD_AS_TERMINAL_OR_PARKABLE
FACT: REPAIR_CLASS=ELIGIBILITY_AWARE_BOUNDED_RESCAN
FACT: DEFAULT_RESCAN_INTERVAL_MINUTES=20
FACT: STRUCTURAL_INELIGIBILITY_BYPASSES_PERIODIC_RESCAN=true
FACT: GLOBAL_EXTERNAL_BLOCK_BYPASSES_PERIODIC_RESCAN=true
FACT: SINGLE_EMPTY_SCAN_PROVES_POOL_DRAINED=false

## 观测

2026-10-01 的 BA/RF/GAI/EM 双机施工暴露了一个不同于代码缺陷的调度失败模式：**某台主机在某一时刻可能扫描不到可领取任务，但全局任务池仍未完成，而且另一台主机即将产生新的可领取阶段。**

本轮任务采用：

```text
Development -> hosted CI 绿 -> 另一台物理主机 Correction -> programme integration
```

随后 GitHub Actions 出现账号级阻断，job 在 2–4 秒内、零步骤执行后直接失败。这让任务池同时存在“暂时无法验证”“主机隔离导致无资格”和“仍有未领取 Development”三种状态。

Digital-City `b2672fa`（2026-10-01 03:32:29 +10）记录 Alien 在 RF-006 Correction 代码完成但 hosted CI 无法启动后停止。当时它的交接快照仍显示 3 个未领取 Development。随后 Mech 恰好继续领取这 3 个：

- `d9201af` — BA-007 Development，03:36:42 +10；
- `802d4c9` — EM-013 Development，03:42:35 +10；
- `d4e2847` — GAI-009 Development，03:48:00 +10。

因此两台机器的局部判断都可以是诚实的，但一次性扫描依然可能让并发能力过早退出。关键不变量是：

> **SNAPSHOT_EMPTY != TERMINAL_DRAIN：只要资格会随时间变化，“当前无任务”就不等于“任务池结束”。**

## 根因

旧的 no-idle 规则只定义了“现在有没有任务可领”，却没有区分：

1. **暂时不可领取**：另一主机、CI、provider 或阶段转换之后可能解锁；
2. **结构性无资格**：host separation、权限、硬件/能力、身份或策略使当前主机不能领取剩余工作；
3. **全局外部阻断**：必须等待 Owner/外部条件变化，内部继续施工无法诚实闭环；
4. **真正耗尽**：所有任务均已终态。

也就是说，一次 global scan 同时被拿来回答“我现在能做什么？”和“整个系统是不是结束了？”两个不同的问题。

## 调度修复

未来 City 新工程书统一继承资格感知静默规则：

- 当前无可领任务、但未完成任务未来仍可能变为可领时，进入 `TEMPORARILY_UNCLAIMABLE`，不忙轮询，默认约 **20 分钟**后重新扫描；
- 只要任务池未结束且未来资格仍可能变化，就继续采用 bounded re-entry；
- 如果剩余任务全部因为机制原因对当前主机结构性无资格，记录 `STRUCTURALLY_INELIGIBLE` 和具体原因，不要求周期重试；
- 如果所有剩余推进都依赖账号计费等明确全局外部动作，记录 `GLOBAL_EXTERNAL_BLOCK`，不得为了“不停机”制造内部工作；
- 只有 `POOL_TERMINAL` / 全部任务终态证据才能解释为全局结束。

未来 dispatcher 至少记录：

```text
pool_incomplete
claimable_now
potentially_claimable_later
structural_ineligibility_reason
global_external_blocker
rescan_after
terminal_reason
```

## 论文价值

本次事件形成了一个可测试的系统假设：

> 在分阶段多 Agent 工程队列中，用“资格感知 + 有界延迟重入”替换“一次空扫描即退出”，应当可以降低 worker 过早退休、Owner 人工介入和整体 makespan，同时避免忙轮询。

后续实验可记录：

- programme 总工期；
- 主机利用率和空闲区间；
- 从“零可领”到下一次资格变化的时间；
- 过早 terminal 判定次数；
- Owner/人工重启次数；
- Correction backlog 深度；
- 外部 CI 故障期间累计的不可验证 head 数；
- rescan 次数及调度开销；
- 平均铺开与 dependency-aware drain-first 两种策略的 programme drain 时间。

这既是论文素材，也是 Utopia 的自进化狗粮：调度器需要学会“现在没有可运行工作”是一种状态，而不是天然的结束。

---

语言配对 / Language pair: [中文 / Chinese](../zh-CN/ASYNC_DISPATCH_TRANSIENT_QUIESCENCE_2026-10-01.md) · [English](../en/ASYNC_DISPATCH_TRANSIENT_QUIESCENCE_2026-10-01.md)
