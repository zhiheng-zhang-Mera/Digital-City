# Workbench Compatibility Migration / 工作台兼容模式迁移工程

> **WBC 系列已全部完成并进入 Utopia main**（WBC-601/602/603/604，最新合并 213f9f9f）。
>
> WBC-604：development COMPLETE、exact-head CI green、终端标记 `EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED` 已释放；“持久化了一个当前不可用的 profile”这一 fail-safe 缺陷是在编写 fail-safe 测试时发现并修复的。

> **状态：READY / ACTIVE PROGRAMME**
>
> 本工程不是把 Utopia 现在的 Windows 双机运行模式替换成服务器/工作台模式。
> 本工程只负责把“当前设备执行模式”固化为一个长期兼容后端，并预埋未来 Workbench / Server-Worker Pool 的可切换执行接口。
>
> **Owner 硬约束：**
>
> 1. 现阶段 Alien + Mech Windows 运行不得因本工程被破坏；
> 2. 没有任何 Workbench/Linux Server 存在时，Utopia 必须完整可启动、可连接、可派发、可执行、可回传；
> 3. Workbench 必须是 additive backend，而不是 Utopia 的启动依赖；
> 4. 未来工作台搭建完成后，应以“注册节点 → readiness 通过 → 切换 Execution Profile”的方式启用，不再要求业务层大迁移；
> 5. 施工继续使用既有 **Alien / Mech 双机异步防阻塞 Development → opposite-host Formal Review** 模式。
>
> 常驻施工规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 异步减压施工：[../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> 过程数据规则：[../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 已接受三端基线（immutable merged SHA `9f3e20e8ec99d591812430bee71d27e68c4ad498`）：[../finished/completed-2026-10-04/mesh-3end/MESH-301-三端实机互联与相互指挥.md](../finished/completed-2026-10-04/mesh-3end/MESH-301-三端实机互联与相互指挥.md)

## 1. Programme 目标

把当前运行模型从“代码默认知道 Alien/Mech/Windows”逐步收敛为：

```text
Utopia Task / Action
        ↓
Execution Profile
        ↓
Execution Backend Contract
   ┌───────────────┬────────────────┐
   ↓               ↓                ↓
STANDARD_DEVICES   WORKER_POOL      HYBRID
(current default)  (future)         (future)
   ↓               ↓                ↓
Alien / Mech       Workbench        capability-driven union
```

**第一原则：当前行为先被冻结成兼容模式，再增加未来模式。**

本 programme 完成后，工作台硬件尚不存在也没有关系。目标是让未来硬件出现时只需：

```text
install/start headless node agent
→ register node
→ advertise roles/capabilities/resources
→ readiness = HEALTHY
→ switch Execution Profile
```

而不是重新修改 Assistant / Gateway / Remote Fabric / Shared Task Core / UI 主流程。

## 2. 永久兼容模式

### 2.1 STANDARD_DEVICES — 当前默认，长期保留

- 默认 profile；
- 现有 Windows Alien / Mech 路径继续工作；
- 现有 untargeted scheduler 语义不因资源模型新增而改变；
- MESH-301 strict target-device intent 保持原语义；
- Android 仍是 control surface，不因为 Workbench programme 被伪装成 execution worker；
- 没有 Workbench 时不得出现启动失败、全局 blocker 或“等待服务器”状态。

### 2.2 WORKER_POOL — 未来显式切换

- 只有至少一个合格 Worker Pool backend / node 通过 readiness 后才可启用；
- 不允许因为配置项存在就让当前 Utopia 在启动时要求 Workbench；
- 若用户显式选择 WORKER_POOL 而 backend 不可用，应返回 typed unavailable / attention，而不是 crash；
- 不得静默把 strict platform/hardware requirement 改派给错误节点。

### 2.3 HYBRID — 未来联合模式

- Workbench 优先承担适合的通用计算任务；
- Windows/macOS/Android/iOS 等 platform validation 继续由对应真实设备承担；
- 任务按 capability/resource/role 路由，而不是按历史机器名写死；
- legacy task 缺少新资源字段时必须有兼容默认值；
- strict target intent 高于 generic pool preference；
- backend 不可用时只能按显式 policy 做 fail-honest / allowed fallback，不能制造“成功”。

## 3. 不允许改变的产品真相

本工程不得重新定义：

- Shared Task Core 的 canonical task truth；
- 已接受 task lifecycle；
- lease / ownership / idempotency 基本语义；
- Remote Fabric 的 trust / transport 所有权；
- General AI Gateway 的 provider/channel 语义；
- Engineering Manager 与 GAI 的职责边界；
- MESH-301 strict-target 语义；
- 当前 Web / Android control-surface 身份；
- 已接受 Windows 双机运行路径。

**Workbench compatibility 必须适配这些既有 contract，而不是让这些 contract 迁就工作台。**

## 4. Programme 工作拆分

| ID | 工作 | 状态 | 目标 |
|---|---|---|---|
| [WBC-601](./WBC-601-execution-backend-contract-and-standard-default.md) | Execution Backend Contract + Standard Default | COMPLETE | 把当前执行路径包成长期 STANDARD_DEVICES backend；第一阶段不改变调度结果 |
| [WBC-602](./WBC-602-node-role-capability-resource-descriptor.md) | Node Role / Capability / Resource Descriptor | COMPLETE | 增加向后兼容的节点/资源描述；旧 Windows 节点无需新字段也能运行 |
| [WBC-603](./WBC-603-worker-pool-and-headless-node-agent-seam.md) | Worker Pool + Headless Node Agent Seam | COMPLETE | 建立 dormant Worker Pool backend / agent contract；无真实工作台依赖 |
| [WBC-604](./WBC-604-execution-profile-switch-and-hybrid-routing.md) | Execution Profile Switch + Hybrid Routing | COMPLETE | 固化 STANDARD / WORKER_POOL / HYBRID 切换与 readiness/fallback 语义 |

> **状态语义：** `COMPLETE` 表示该 component workbook 已完成 Development、opposite-host Formal Review 与 exact-head required CI；不等于该 component 已单独合入 Utopia `main`。WBC-601/602 的 accepted heads 已进入 WBC-603 dependency-union，programme 仍受 §8 final integration merge lock 约束。

WBC-601 与 WBC-602 可由两台主机并行 Development。WBC-603/604 的实际代码 baseline 使用 `DEPENDENCY_SHA_UNION_AT_CLAIM`：前置 workbook accepted 后读取 full SHA，先组成 exact union baseline，再施工；不得从缺少依赖代码的 main 直接开始。

## 5. 双机异步防阻塞施工

本 programme **继续沿用当前已经验证的双机模式，不创建新的施工调度机制**：

```text
Alien
  ├─ Hns supervisor
  ├─ Codex Development / Critic
  └─ eligible Formal Review for Mech-authored work

Mech
  ├─ Hns supervisor
  ├─ Codex Development / Critic
  └─ eligible Formal Review for Alien-authored work
```

强制要求：

1. 每本任务书 Development 与 Formal Review 必须是不同实体主机；
2. WBC-601 / 602 可并发，但不得 sibling merge；
3. hosted CI / 长测试等待不占主机，继续扫描其它 eligible stage；
4. claim race、zero-claim、20 分钟兜底重扫、typed external block 全部继承常驻规则；
5. 本机 fresh critic 只做诊断，不能冒充 opposite-host Formal Review；
6. 若文件 ownership 发生真实冲突，后领取任务必须避让或等待该 seam 解锁，不得为了并发而复制第二套 canonical logic；
7. 不允许因为本 programme 暂时没活就制造额外“未来服务器功能”。

## 6. Hard compatibility invariant — NO_WORKBENCH_REGRESSION

任何 component branch、future integration candidate 和 merged main 都必须能在：

```text
Workbench = absent
Linux server = absent

Available:
- Alien Windows
- Mech Windows
- current Android control surface
```

条件下运行。

至少保持：

- Utopia startup 正常；
- Alien / Mech register / heartbeat / claim / execute / report 正常；
- untargeted task 行为保持；
- strict-target Alien / Mech 行为保持；
- Web / Android canonical City observation/control 正常；
- Remote Fabric 已接受路径不被破坏；
- General AI Gateway / Engineering Manager 已接受 smoke 不被破坏；
- result / event 回流正常；
- restart/recovery 已有路径正常；
- required hosted CI green。

**任何一项因“未来 Workbench 兼容”而失败，视为 blocking regression，禁止 merge。**

## 7. Compatibility migration 的设计约束

### 7.1 先包装，不重写

允许：

```text
existing execution path
      ↓
STANDARD_DEVICES adapter
```

禁止第一步就：

```text
delete old scheduler
→ replace with new distributed scheduler
→ hope old Windows path still works
```

### 7.2 新字段必须 additive / optional

旧任务、旧节点记录、旧测试不能因为缺少：

- role；
- resource capacity；
- live load；
- accelerator；
- pool metadata；

就变成 invalid。

必须提供明确 legacy defaults / compatibility translation。

### 7.3 Workbench 不是启动依赖

禁止：

- startup 时强制连接 Worker Pool；
- 没有 Linux/Workbench 时把 City 标成 unhealthy；
- 为 Workbench 创建第二套 task database；
- 把 node agent 变成 canonical task truth；
- 为了 server 化要求 Owner 现在改变日常启动方式。

### 7.4 模式切换必须可逆

未来从 STANDARD_DEVICES → WORKER_POOL / HYBRID 后，仍可切回 STANDARD_DEVICES。

切回不得要求数据库重建、任务格式迁回或删除 Workbench 节点。

## 8. Merge lock

本目录**现在不创建 final integration / merge workbook**。

只有 WBC-601..604 全部满足：

- Development complete；
- opposite-host Formal Review complete；
- exact-head required CI green；
- no unresolved Owner gate；
- no unresolved compatibility regression；

之后才允许创建 final integration workbook。

最终 integration 必须从**当时最新 Utopia main**开始，并强制执行 NO_WORKBENCH_REGRESSION。

最终 programme terminal marker：

`WORKBENCH_COMPATIBILITY_READY_WINDOWS_BASELINE_PRESERVED`

这个 marker **不表示真实 Workbench 已验收**。真实硬件到位后，应另开 hardware onboarding / real pool acceptance 工作书，只负责注册、readiness 和真实负载证明，不重新做本 programme 的业务迁移。

## 9. Future hardware cutover 预期

本 programme 成功后，未来硬件切换应被压缩为：

```text
Workbench Node A/B ready
        ↓
install Utopia Node Agent
        ↓
register into existing City
        ↓
roles/capabilities/resources advertised
        ↓
health/readiness accepted
        ↓
Owner selects WORKER_POOL or HYBRID
        ↓
bounded canary tasks
        ↓
normal workload
```

如果未来仍需要修改大量 Assistant / Gateway / UI / task semantics 才能启用 Workbench，则本 programme 视为没有真正完成“兼容迁移”目标。

<!-- SERIES_DASHBOARD:START -->
## 任务快速面板 / Task dashboard

自动读取canonical工作书；本表不提供领取锁或额外authority。 / Generated from canonical workbooks; this table grants no claim lock or extra authority.

总完成 / Complete 4/4 · 开发 / Development 4/4 · 复检 / Review 4/4 · `COMPLETE`

| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |
|---|---|:---:|:---:|:---:|
| [WBC-601](WBC-601-execution-backend-contract-and-standard-default.md) | COMPLETE | YES | YES | YES |
| [WBC-602](WBC-602-node-role-capability-resource-descriptor.md) | COMPLETE | YES | YES | YES |
| [WBC-603](WBC-603-worker-pool-and-headless-node-agent-seam.md) | COMPLETE | YES | YES | YES |
| [WBC-604](WBC-604-execution-profile-switch-and-hybrid-routing.md) | COMPLETE | YES | YES | YES |

<!-- SERIES_DASHBOARD:END -->
