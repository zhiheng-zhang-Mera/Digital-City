---
plan_id: FR-001
plan_name: PERSISTENT_FOREMAN_RUNTIME
phase: FUTURE_CONSTRUCTION
execution_enabled: false
status: NOT_ACTIVE
implementation_repo: zhiheng-zhang-Mera/utopia
control_repo: zhiheng-zhang-Mera/Digital-City
owner_gate: PROMOTION_REQUIRED
merge_authority: false
depends_on_current_active_pool: true
---

# FR-001 — Persistent Foreman Runtime / Owner 控制环退出计划

> **状态：FUTURE / NOT ACTIVE / NO EXECUTION AUTHORITY**
>
> 本文件只记录未来施工方向。任何 Hns、Codex、Alien、Mech、CI runner 或其它 worker **不得因为读取到本文件而自动开始施工、claim、建分支或修改 Utopia**。
>
> 真正开工前必须由 Owner 明确提升为 active workbook/programme，并在 claim-time 重新读取当时最新 Utopia / Digital-City 状态。

## 1. 为什么需要这一层

当前 Utopia 的开发已经具备大量自动施工零件：

- Hns / Codex 可以长时间施工、测试、修复；
- Alien + Mech 可执行异机 Development / Review；
- Mission Book 提供 durable task state、claim、SHA、CI、reports；
- Engineering Manager 已具备 connector、scheduler、attention、recovery 等合同和组件；
- CI、no-idle、typed blocker、reconciliation、re-entry 等施工规则已经成熟。

但实际控制环仍经常是：

```text
Hns / Codex 施工
    ↓
生成报告 / 遇到技术不确定
    ↓
Owner 把结果带到网页版 ChatGPT 查错 / 仲裁
    ↓
Owner 再把修正意见送回 Hns / Codex
    ↓
继续施工
```

这意味着系统已经接近“自动施工队”，但 Owner 仍在承担项目经理 / 调度中枢 / 技术仲裁转发器。

目标是把日常控制环改成：

```text
Owner
  ↓ 只给目标、产品选择、权限/预算/不可逆裁决
Persistent Foreman Runtime
  ├─ Hns / Codex workers
  ├─ Alien / Mech / server / cloud workers
  ├─ independent critic / reviewer
  └─ CI / Git / Mission Book / Attention
```

## 2. 核心目标

未来 Foreman Runtime 必须至少做到：

1. **常驻**：不是一次 Agent 会话，也不是“Markdown 写了 MUST 就算自动执行”；
2. **事件驱动**：持续观察 Git、Mission Book、CI、worker presence、review/report、attention；
3. **自动续跑**：任务完成、CI terminal、review 出 defect、worker 重启后自动恢复下一步；
4. **Review → Repair 闭环**：review finding 自动回送原作者/合格 repair worker，不经过 Owner 手工转述；
5. **技术问题先内部解决**：技术不确定不得直接升级 Owner；
6. **真正的 Owner escalation filter**：只有人类价值判断、预算、权限、不可逆行为、scope/product choice 才进入 Owner Attention；
7. **动态 Worker Pool**：Alien / Mech / Linux / Cloud / Hns / Codex 等只作为 capability provider，不把具体物理主机写死为架构依赖；
8. **durable recovery**：Foreman 自身和 worker 崩溃/重启后能从 City/Mission Book/事件日志恢复；
9. **结果回流**：跨设备/跨 worker 的完成结果回到发起交互 surface；
10. **不制造假工作**：继承现有 no-make-work、typed blocker、exact-head evidence、双机独立规则。

## 3. 推荐的技术升级路径

### Stage A — Persistent Supervisor

实现最小常驻循环：

```text
watch events
  ↓
reconcile truth
  ↓
classify pool
  ↓
ensure eligible executor exists
  ↓
wake / launch / resume worker
  ↓
consume result
  ↓
transition task
  ↓
repeat
```

必须能够在没有 Owner 打开聊天窗口的情况下持续工作。

### Stage B — Hns / Codex real connector acceptance

把现有 Engineering Manager 的 connector/contracts 从“组件与测试完成”推进到真实日常路径：

- launch;
- session binding;
- task injection;
- progress/checkpoint reading;
- restart/resume;
- result extraction;
- failure classification;
- safe cancellation;
- exact task / branch / head attribution.

至少先完成 Hns + Codex，Claude Code / WorkBuddy 等之后再扩。

### Stage C — Review / Repair autonomous loop

目标：

```text
Developer
   ↓
Reviewer
   ├─ PASS → merge/integration
   └─ DEFECT
        ↓
      Author/Repair worker
        ↓
      reviewer re-check
```

Owner 不作为常规中转站。

### Stage D — Escalation Ladder

默认升级梯：

```text
L0 worker self-diagnosis
   ↓ unresolved
L1 independent critic / second worker
   ↓ unresolved
L2 architecture/contract arbiter
   ↓ only if genuinely human
L3 Owner Attention
```

L0-L2 必须留下证据，但不得把“暂时证明不了”自动翻译成“请 Owner 选择”。

### Stage E — Server / Worker Pool runtime

Foreman 不绑定 Alien 或 Mech。

目标：

```text
Foreman / City service
        │
        ├─ Windows capability worker
        ├─ Android validation worker
        ├─ macOS/iOS validation worker
        ├─ Linux/server worker
        └─ Cloud worker
```

物理设备只提供 capability；调度按任务 capability、负载、资格和独立复核要求分配。

## 4. 必须复用的现有资产

未来开工时优先复用而不是另起第二套真相：

- `mission-book/CONSTRUCTION_RULES.md`;
- Mission Book frontmatter / reports / typed blocker；
- Engineering Manager EM-001..013 已接受 contracts；
- EM-005 Attention；
- EM-009 recovery；
- EM-010 Foreman Scheduler / DAG / worker pool；
- EM-011 / EM-012 connector direction；
- EM-013 task surface；
- Remote Fabric；
- current City task / event / device truth；
- Hns 已有 restart / task continuation / Computer Use 能力（开工时必须重新验收真实能力，不以历史描述代替测试）。

禁止重新创建一个与 City/Mission Book 并行的第二套 task ownership / notification / device truth。

## 5. Owner 应该保留的门

Foreman 的目标不是取消 Owner，而是把 Owner 从技术控制环中移出。

应保留：

- 产品/审美选择；
- scope 明显扩大；
- 预算/付费/API 成本；
- 凭据、登录、权限；
- 不可逆或高影响外部操作；
- 新的隐私/安全授权；
- 无法由已有 contract 决定的价值取舍。

默认不应进入 Owner：

- 普通代码 bug；
- 测试构造失败；
- evidence 缺失；
- CI code failure；
- branch/head 错配；
- 技术假设冲突；
- “暂时没有找到实现方式”；
- worker / reviewer 对源码事实的分歧。

## 6. 与当前 Hns / Codex 主力开发阶段的关系

本计划 **不要求现在暂停 Utopia 去造 Foreman**。

在当前阶段：

- Hns / Codex 继续作为主力施工者；
- Alien / Mech 继续按现有工作书承担实体主机资格；
- Mission Book 继续作为 durable truth；
- 当前 active workbook 优先收尾；
- Foreman Runtime 不抢占 UXI-391 或当前其它 active work。

当前阶段可以采用“人工启动、自动长跑”的临时施工模式来积累 Foreman 未来需要的接口和过程数据，但不得把临时脚本/提示词伪装成 Persistent Foreman 已完成。

## 7. 未来 Promotion 条件

只有 Owner 明确决定开工后，才从本计划生成 active programme/workbooks。

开工前重新回答：

1. 当前 Hns/Codex 接口是否仍是主要施工入口；
2. Engineering Manager 哪些 connector 已能真实控制 session；
3. 是否已有长期 Linux/server/cloud host；
4. Mission Book 数据模型是否需要演化；
5. 当前 worker pool / platform validation topology；
6. 哪些 Owner gates 已经可以稳定机器判定；
7. 是否需要先做单机 Persistent Foreman，再扩多机。

## 8. 第一版完成门槛建议

未来 v1 不要求“一切自动化”，但至少必须证明：

- Owner 下达一个工程目标后，Foreman 能自己启动合格 Hns/Codex worker；
- development 完成后自动交给另一合格 reviewer；
- reviewer finding 自动回 repair；
- CI 等待期间不中断整个控制环；
- worker/session 崩溃可自动恢复；
- merge 后自动 rescan / claim next；
- 一个纯技术 blocker 被 L0→L1→L2 自行解决而不打扰 Owner；
- 一个真正的人类产品选择被正确升级到 Owner；
- Owner 不需要手动复制报告到另一个 AI 再把答案复制回来。

## 9. 非目标

第一阶段不要求：

- 一次性支持所有 AI provider；
- 完整自治产品规划；
- AI 自行批准付费、权限或不可逆操作；
- 取消双机独立复核；
- 重写 City / Engineering Manager；
- 为“看起来更自动”而放松 evidence / CI / correctness gate。

## 10. 记录目的

本计划应保留当前阶段的关键经验作为未来施工输入：

- 双机并发提高吞吐，但没有自动降低 Owner 管理负担；
- Mission Book 已有 durable facts，但缺 persistent executor/supervisor；
- UXI-390 → UXI-391 暴露“技术不确定被过早升级 Owner”的缺口；
- Review 能发现真实 defect，但 Review → Repair 仍需要显式自动回路；
- Markdown 中的 re-scan / wake / MUST 规则不能替代实际 daemon/runtime；
- 当前 Hns/Codex 长跑施工可以作为 Foreman connector 与 recovery 的真实试验场。

---

```text
FUTURE PLAN = RECORDED
EXECUTION   = NOT AUTHORIZED
PROMOTION   = OWNER REQUIRED
```

语言配对 / Language pair: [English reading](./en/FR-001-Persistent-Foreman-Runtime.md)
