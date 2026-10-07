# PCF 实验、研究素材与分阶段收口

[English](en/RESEARCH_AND_RELEASE.md)

## 研究不是再造一个仪表盘

复用 REX 和现有 RESEARCH_SIGNAL_WATCHLIST；不把一般调度、资源预留、cross-device 或 checkpoint 宣称为 G4。候选问题是：在个人设备有前台竞争、间歇连接、严格授权和不完整观测时，哪些策略能减少延迟/失败/人工介入而不牺牲约束正确性？新颖性要靠后续文献与对照实验，不预先保证发表或导师偏好。

## 预注册实验合同

每组记录 problem/hypothesis、固定 scope、runtime/contract/policy/executor full versions、硬件与 OS、topology、workload digest、模型/输入版本、缓存冷热、网络条件、seed、重复规则、停止条件、异常处理和完整日志位置。

先小样本 pilot 估计变异，再固定正式 repetitions 与分析方法；不能跑到显著才停。可从每 condition 30 次的 pilot 预算讨论起，但它不是统计充分性保证。匹配输入/seed，随机化或交错执行顺序，报告分布、区间、失败分母和硬件局限。

基线：当前兼容策略；capability-only/固定优先；load-only；PCF 的 capability+policy+freshness+cost。必须保证同样的授权/安全底线，不能靠让基线违反 policy 来制造收益。消融 freshness、locality、reservation、hysteresis、foreground protection、checkpoint 时分别说明安全实验范围。对安全门只能在隔离测试里制造反例，不能在个人真实敏感负载上关闭。

记录排队、执行、传输、端到端 P50/P95/P99（样本不足时不作稳定尾部推论）、吞吐、SLO miss、误拒绝/错误放置、饥饿、预留泄漏、恢复时间、重复副作用、Owner interruption 和 telemetry/monitor 开销。能耗只有实测才写 joules/Wh；CPU 时间等 proxy 单列。未测为 null，不写 0。

trace replay 可比较同一输入下的决策；离线 trace 不能证明另一个策略改变排队和网络后的真实性能。性能结论需重新实跑或经校准并明确标注的模拟。

## 故障与工作负载矩阵

至少包含 stale/乱序/缺测，两个并发请求争最后资源，worker crash/reboot，断链/重连，旧 attempt 晚到，部分 artifact，deadline/取消，授权撤销，前台繁忙，存储写失败，controller restart，monitor/REX 不可用。

至少两类真实软件负载及混合运行：有界交互计算 + 持续 batch/媒体数据处理。第三类感知/健康 trace 可以是脱敏录制或合成输入，必须标注，不代表医疗有效性或眼镜实机性能。保留两 Windows workers + 三 control clients 的事实；Android 未做719前不参与计算 worker 数。

## 收口层级

### Component acceptance

按每书声明边界签收 accepted exact head；保存 deferred seam 与负责人。单元测试/合成拓扑不是实机产品终态。

### PCF-790（预留）— CORE_V1 集成与冻结

激活时冻结的19本核心工作书为初始范围。全部组件 accepted 后才生成正式 integration workbook。至少证明：

- 無 Workbench/LINUX 时 STANDARD_DEVICES 仍能启动、连接、执行、回传；legacy untargeted 与 strict-target 保持；
- 两实体 Windows worker 的真实放置/资源竞争/恢复，Web + Android 原发起端拿回状态、结果、错误和取消回执；
- 多应用并发不绕过 consent/预算/隐私；不支持 checkpoint 的任务诚实拒绝自动续跑；
- controller 重启不重复提交旧 attempt；controller 故障不被写成已实现高可用；
- UI 正常路径真实接线；unknown/risk 冒泡；Monitor/trace 故障不阻塞无关任务；
- REX 独立复现实验与导出可重建；全部 required exact-head 与 merged-main CI；
- CAP registry、文档、产品现实一致；所有必需真实 seam 均完成。

候选 terminal marker：`PCF_CORE_V1_ACCEPTED_STANDARD_DEVICES_PRESERVED`。它不代表 Linux、手机 edge、GPU 服务、眼镜或控制面 HA 已验收。

### Optional extensions / PCF-990（预留）

每个扩展独立列硬件、权限、provider、实机证据、fallback 和 marker。未来990只接受某个显式冻结的扩展集合，不能表示“全部可能设备都支持”。延期模块保留真实状态，不用 skip 假装完成。

## 论文材料落点与链路

按 EXECUTION_CONTRACT 保留 Utopia 原始证据与中英说明，City 仅保存有界摘要及稳定引用。REX-801/802 可支撑早期 adapter；完整 runner/fault/replay/export 验收要求 REX-803～806 的正式 accepted heads。必要时按合同先做测试 double，但不能发布 research-grade 终态。

本计划只登记研究问题与采集字段；全局 watchlist 的已观察等级、verified capability 和正在施工的统计均不因本文件自动变化。
