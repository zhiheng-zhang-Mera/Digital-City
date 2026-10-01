# 论文素材——多设备并发 AI 请求的响应延迟与背压问题

FACT: INCIDENT_ID=MULTI-DEVICE-AI-CONCURRENCY-LATENCY-2026-10-01
FACT: OBSERVATION_DATE=2026-10-01
FACT: EVIDENCE_LEVEL=USER_FIELD_OBSERVATION
FACT: ROOT_CAUSE_CONFIRMED=false
FACT: CITY_IMPLEMENTATION_PLAN_COMMITTED=false
FACT: DESIGN_STATUS=OPEN
FACT: TARGET_SYSTEM=UTOPIA_MULTI_DEVICE_ASSISTANT
FACT: MULTI_DEVICE_PARALLEL_INPUT_EXPECTED=true
FACT: SINGLE_EMPTY_OR_SLOW_RESPONSE_PROVES_PROVIDER_CONTENTION=false

## 观测

用户在最近数日的真实使用中观察到：当同一账号/同一逻辑助理从不同设备同时接收指令或提问时，主观响应速度似乎下降。

该现象目前只有现场使用体感，没有账号级调度器、provider 队列、TTFT、端到端 trace 或服务端资源分配数据，因此**不能据此断言外部 AI 后端存在“不同设备互相抢同一个 worker”或确定的账号级算力竞争**。

需要保留的核心问题不是某一家 provider 的内部实现，而是：

> 当一个多设备统一助理允许多个 embodiment 同时产生 AI 请求时，上游 provider、网页会话、本地执行器与共享任务系统都可能形成并发瓶颈；如果系统没有显式背压，轻微外部延迟可能被重复请求、重试和跨设备转发放大。

## 候选起因

当前应并列保留、等待遥测或 A/B 实验区分的候选因素：

1. **外部 provider 调度/限流**：账号、模型、会话、API 或网页通道存在并发/速率/排队约束；
2. **请求自身变重**：长上下文、高 reasoning、网页/GitHub/Computer Use 等多工具 round-trip 增加 TTFT 与总耗时；
3. **本地资源竞争**：同一主机上的浏览器、Computer Use、CPU/GPU、内存或网络被多个执行任务同时占用；
4. **网络和客户端差异**：设备网络、浏览器状态、连接复用等造成延迟差异；
5. **未来 Utopia 内部竞争**：如果多个 embodiment 绕过共享任务真值、并发预算或 lease 直接下发工作，可能出现重复执行、写冲突、饥饿和 retry storm。

以上均为候选解释，当前没有证据支持将其中任一项写成已确认根因。

## 解决思路

本次素材保留以下设计原则，但**不在 City 中登记具体施工方案或强制架构**：

- 把“用户等待时间”拆成 Utopia 排队、本地执行、provider TTFT、provider 总耗时等可区分阶段；
- 在进入昂贵或稀缺执行资源前设置 admission control 与 backpressure，而不是让所有设备无限直接并发；
- 为每个 provider/通道维护可配置的 concurrency budget，而不是假设所有上游都可以无限并行；
- 复用共享 task/action identity、lease 与 idempotency，避免多设备重连、重复点击或超时造成重复执行；
- 禁止“慢了就立刻复制请求”的无界重试；重试必须带退避、上限和原因；
- UI 应区分 `QUEUED`、`RUNNING`、`PROVIDER_THROTTLED`、`LOCAL_RESOURCE_WAIT` 等状态，避免把排队误判为卡死；
- provider/API/设备切换继续受既有用户确认与策略约束，不能为了追求延迟自动越过用户控制；
- 先记录真实遥测，再决定默认并发数和调度策略。

## 研究价值

该问题可形成一个可测试的系统假设：

> 在多 embodiment 共享一个逻辑 Agent 的系统中，显式 admission/backpressure、请求去重和分层延迟遥测，应能减少重试风暴、重复执行和尾延迟，并提高用户对系统状态的可解释性。

未来可比较：

- 单设备串行 vs 多设备并发的 TTFT 与端到端耗时；
- Utopia queue wait 与 provider wait 的占比；
- 不同 provider/web/API 通道的并发退化曲线；
- retry 次数、重复 action 次数与冲突写次数；
- admission/backpressure 开启前后的 P50/P95/P99 延迟；
- 有/无 concurrency budget 时的吞吐量和用户可见尾延迟；
- 同一任务与互不相关任务在并发时的差异。

这条记录只冻结“问题 + 假设 + 设计启示”。具体解决方案仍处于仓库外草案阶段，尚未成为 City 工程约束。
