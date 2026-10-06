# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_ENDPOINT_A_WORKING_AND_BASELINE.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech（端点 A）：作为实际工作的 worker 加入，并实测变更前基线

```text
FROM = Mech   ROLE = endpoint A (Mech-Win) + formal reviewer, per the Owner's revised ruling
STATE = MESH-301 step 2's Mech-side requirement is DONE and FUNCTIONAL, not merely registered.
```

## 1. 端点 A 不仅连接，也领取并执行

在领取/开始时实测 City（MESH-301 禁止沿用历史地址）；本主机以 `Mech-Win` 身份加入，随后创建一个 untargeted 任务并观察至终态：

```text
cityId=22e1216b-f124-4d4a-be4a-4a280558c027   nodes=2
    Alien-Win online=true
    Mech-Win  online=false        <- before this host's worker started
  [node] City Node Reference Agent started as Mech-Win
    Mech-Win  online=true

created an UNTARGETED task   Q-b8ba7b5e-c0c5-4c11-bc40-236113c99000   (HTTP 200)
observed timeline (client-side observation times, this host)
    2026-10-03T02:57:45.872Z  QUEUED     progress=0
    2026-10-03T02:57:46.650Z  RUNNING    @Mech-Win progress=30
    2026-10-03T02:57:49.260Z  COMPLETED  @Mech-Win progress=100
```

`Mech-Win` 领取并完成了任务。须明确记录，因为“已加入”与“能工作”是不同声明；MESH-301 需要后者：完成 gate 2 要求两个**真实 worker node**，而非两个注册。

## 2. gate 7 变更前基线，刻意在产品改动落地之前采集

gate 7 要求 strict target-device routing 出现后，普通 untargeted 任务路径**无回归**。回归检查需要变更前参照，这就是参照：untargeted `CHECKPOINT_DEMO` 被调度，由领取它的任一合格节点执行，最终达到 `COMPLETED`、`progress=100`。开发主机落地 routing contract 后，将原样重跑以进行同条件对比，而非与描述比较。

## 3. gate 8 的 canonical `seq` 基础，确认本主机可读取

MESH-301 明确要求三端同步依赖**服务器事件 `seq`** 与有界收敛，而非比较三台机器时钟。本次测量如下：

```text
canonical events readable from this host: HTTP 200, 12 events
events for this task: 7, ALL 7 carrying a server seq
    seq=7   TASK_CREATED      actor=gateway
    seq=8   TASK_ASSIGNED     actor=Mech-Win
    seq=9   TASK_STARTED      actor=Mech-Win
    seq=10  TASK_CHECKPOINTED actor=Mech-Win
    seq=11  TASK_CHECKPOINTED actor=Mech-Win
    seq=12  TASK_COMPLETED    actor=Mech-Win
highest seq observed by this surface: 12
```

因此本端具备 gate 8 收敛测量的真实基础：界面可读取并赋予本地时间戳的单调递增服务器序列。

## 4. 明确本次未证明的事项，避免过度解读

- **未证明三端收敛。** 这要求三个界面（Alien Web、Mech Web、Android）观察同一 `seq`；本次测量完全没有 Android control client。
- **未证明任何 strict-target 行为。** 开发主机尚未落地 routing contract，无可测试内容；`target=Alien`、`target=Mech`、offline/unknown 拒绝与重复提交边界均尚未测量。
- **不是作者身份声明。** 本主机没有 MESH-301 开发领取；Owner 修订裁决（Alien 开发，Mech 为端点 A 及 formal reviewer）保持如此。

## 5. 方法记录：两项都花费一次运行，且均由我完成

- **我探测可达路径，而非假设**，因为 MESH-301 禁止将历史端点当成事实：一个 City 回应，其余全部超时。
- **node 凭据是第二个秘密，pairing 不能替代它。** `GET /api/v0/city` 接受 control 凭据，但 `POST /api/v0/node/register` 返回 `Invalid pairing token`；`pairing.exchange()` 返回 `credential: this.credential`，即 CONTROL token，因此 pairing 路径无法生成 node token。control/node 分离由 `server.mjs auth()` 的结构决定。随后 Owner 提供 `-node` 形式，与 Alien 决策 D1 已记录的推导完全一致；两者齐备后，节点第一次尝试就注册成功。**此文件及 Git 均不出现 token 值。**
