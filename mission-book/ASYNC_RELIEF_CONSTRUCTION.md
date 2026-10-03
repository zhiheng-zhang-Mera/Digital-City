# Async Relief Construction — Hns / Codex 异步减压施工协议

> **状态：ACTIVE / NORMATIVE / TRANSITIONAL**
>
> **生效范围：** 当前及后续 Mission Book 工程，直到 Persistent Foreman Runtime（FR-001）被正式实现并取代本协议。
>
> **这不是产品功能工作书。** 本文件不授权新增 Utopia 产品能力，也不创建独立任务真相；它规定在现有 Hns / Codex 主力开发阶段，如何尽量把 Owner 从“报告搬运 + 技术仲裁 + 手工接力”控制环中移出。
>
> 常驻施工规则仍以 [CONSTRUCTION_RULES.md](./CONSTRUCTION_RULES.md) 为上位规范；若冲突，以常驻规则和更新的 Owner 裁决为准。未来目标见 [FR-001](./future-plans/FR-001-Persistent-Foreman-Runtime.md)。

## 1. 当前目标

在真正的 Persistent Foreman Runtime 尚未实现前，把日常路径从：

```text
Codex/Hns 施工
  ↓
写长报告 / 卡住
  ↓
Owner 搬到网页版 AI 查错
  ↓
Owner 再把结论搬回施工端
  ↓
继续
```

压缩为：

```text
Owner 给目标
  ↓
Hns supervisor context
  ├─ Codex development worker
  ├─ fresh critic / diagnostic worker
  ├─ opposite-host formal reviewer
  └─ CI / Mission Book / Git
       ↓
只有真正的人类决策才进入 Owner Attention
```

Owner 可以仍然负责**第一次机械启动**尚不能被程序化唤醒的 Hns/Codex 会话；这不等于 Owner 负责技术判断或报告转述。

## 2. 角色边界

### Hns — 临时 Supervisor / Session Manager

当前阶段 Hns 优先承担：

- 读取最新 Mission Book / Git / CI；
- 维护当前任务的浓缩上下文；
- 判断当前 Codex session 是否继续、重启或轮换；
- 把 Development 结果交给合格 Review；
- 把 Review finding 自动整理为 repair packet；
- CI / 长测试等待时执行 no-idle 扫描；
- 对 blocker 先做技术分级，而不是直接问 Owner；
- 维护 checkpoint / handoff packet；
- 在自身能力允许时使用已有 restart / continuation 能力恢复长期任务。

Hns **不成为第二套 task truth**。任务归属、branch/head、CI、completion 仍以 Git + Mission Book 为准。

如果当前 Hns 客户端无法程序化启动/切换 Codex，则采用“Owner 只做机械启动，Hns 提供完整 packet”的降级模式；不得把这一降级写成 Foreman 已自动化。

### Codex — Worker / Critic / Formal Reviewer

Codex 可承担三种上下文，但必须区分：

1. **Development worker**：实现、测试、修复；
2. **Fresh critic / diagnostic worker**：用新上下文独立挑战技术假设，不承担正式跨机 Review 资格；
3. **Formal reviewer**：只有工作书允许且满足实体主机独立性时，才算正式 Review。

同一个 session 不应同时长期承担“作者 + 最终独立评分者”。

### City / Mission Book — Durable Truth

必须保存：

- task/workbook id；
- role；
- branch；
- exact head；
- CI；
- completion / review state；
- typed blocker；
- bounded report；
- next eligible role / wake condition。

不得把聊天上下文当作唯一恢复点。

### Owner — L3 Authority

Owner 默认只处理：

- 产品/审美选择；
- scope 明显扩大；
- 预算/付费/API 成本；
- 登录、凭据、权限；
- 不可逆或高影响外部操作；
- 隐私/安全授权；
- 已有 contract 无法决定的真实价值取舍。

普通技术不确定不得直接升级 Owner。

## 3. 强制 Escalation Ladder

每个技术 blocker 必须依次经过：

### L0 — 当前 worker 自查

至少尝试适用的：

- 读真实源码；
- 读 canonical contract；
- 查 existing tests；
- 构造最小复现；
- 换一种实验/测量方式；
- 检查 branch/head/CI attribution；
- 区分“做不到”与“当前测试构造错了”。

### L1 — Fresh critic

L0 仍不确定时，启动新上下文 critic：

- critic 不继承作者结论作为事实；
- 目标是尝试推翻 blocker 前提；
- 优先找 contract/source/runtime evidence；
- 可建议最小 repair，但不把猜测写成 Owner choice。

### L2 — 技术仲裁

若 worker 与 critic 冲突：

```text
runtime measurement
  > canonical source / accepted contract
  > exact-head test evidence
  > report interpretation
  > chat memory / dashboard text
```

能由这些来源决定的问题必须在 L2 终止。

### L3 — Owner

只有确实属于人类权限/价值判断时才能升级。

Owner request 必须写明：

- 为什么 L0/L1/L2 都无法决定；
- 这是何种 Owner authority；
- 最少必要选项；
- 不允许把“我暂时没找到办法”包装成 Owner decision。

## 4. Review → Repair 自动接力

正式流程默认：

```text
Development complete
  ↓
handoff to eligible opposite-host Review
  ↓
PASS ─────────→ merge/integration
  │
  └─ DEFECT
       ↓
     repair packet
       ↓
     original author / eligible repair worker
       ↓
     exact-head CI
       ↓
     reviewer re-check
```

除非 finding 本身属于 L3，Owner 不作为 Review finding 的中转人。

Reviewer finding 至少结构化为：

```text
FINDING_ID
SEVERITY
OBSERVED_HEAD
OBSERVATION
REPRODUCTION
EXPECTED_CONTRACT
MINIMUM_REPAIR_BOUNDARY
EVIDENCE
REVIEWER
```

Repair 后必须给 reviewer 新 head，而不是口头说“已修”。

## 5. Session 轮换：不要追求一个 Codex 对话永生

当出现以下任一情况：

- 上下文压缩导致反复遗忘；
- 连续两次重读仍误判同一事实；
- 报告开始明显复述旧结论而不是测量；
- 已形成稳定 checkpoint，剩余工作可清晰描述；
- session 自身异常/卡死；

Hns 应优先做：

```text
current worker
  ↓
write HANDOFF_PACKET
  ↓
persist branch/head/tests/open items
  ↓
close/abandon stale session
  ↓
start fresh Codex context
  ↓
resume from packet + canonical files
```

不要为了“保持一个会话”牺牲判断质量。

## 6. 标准 HANDOFF_PACKET

每个跨 session / 跨角色接力至少包含：

```text
TASK_ID
ROLE
IMPLEMENTATION_REPO
CONTROL_REPO
BRANCH
BASELINE_SHA
HEAD_SHA
CI

DONE
CURRENT_TRUTH
OPEN_FINDINGS
REPAIRS_APPLIED

NEXT_ACTION
NEXT_ELIGIBLE_ROLE
WAKE_CONDITION

BLOCKER_TYPE
  NONE
  TECHNICAL
  TEMPORARILY_UNCLAIMABLE
  STRUCTURALLY_INELIGIBLE
  GLOBAL_EXTERNAL_BLOCK
  OWNER_REQUIRED

OWNER_REQUIRED = true/false
OWNER_REASON   = <only when true>

EVIDENCE_POINTERS
```

长篇过程日志留在 evidence；handoff packet 只保存恢复下一步所需的浓缩事实。

## 7. CI / 长测试期间的异步减压

继承 CONSTRUCTION_RULES §4：

- CI 在跑不占主机；
- 长测试在跑不占主机；
- 保持原 claim；
- Hns 扫描另一个不冲突的 eligible work；
- 原任务变 actionable 后恢复；
- 不因为“保持机器忙”制造新功能或多余重构。

如果没有其它合法工作，按 §5 typed zero-claim 处理，不由 Owner 手工轮询。

## 8. 双机临时运行方式

当前推荐：

```text
Alien
  ├─ Hns supervisor context
  └─ Codex worker contexts

Mech
  ├─ Hns supervisor context
  └─ Codex worker contexts
```

约束：

- 两边共享的是 City/Mission Book truth，不是聊天记忆；
- Development 与 Formal Review 继续遵守实体主机独立性；
- 本机 fresh critic 可以帮助调试，但不能冒充另一实体主机的正式 Review；
- 一端无资格时应留下 wake condition，而不是让 Owner 记住“过一会儿回来点一下”。

## 9. 当前阶段禁止的做法

- 不再默认“施工报告 → Owner → 网页版 ChatGPT → Owner → 施工端”；
- 不把普通代码/测试问题写成 Owner gate；
- 不靠增加更多防御性 Markdown 条款代替实际诊断；
- 不要求一个 Codex session 无限续命；
- 不允许 Hns/Codex 同时各自创建第二套任务状态；
- 不把临时 prompt-driven supervision 宣称为 Persistent Foreman Runtime；
- 不为减压而降低 CI、independent review、evidence 或安全门槛。

## 10. 与 FR-001 的关系

本协议是 **prompt/process 层的过渡运行方式**。

它要回答的实验问题是：

- 哪些 supervisor 行为 Hns 现在已经能稳定执行；
- 哪些跨 session / 跨机步骤仍需要人工机械启动；
- 哪些 blocker 会错误升级 Owner；
- 哪些状态必须由未来 daemon/event loop 自动监听；
- 哪些 handoff packet 字段真正足够恢复任务。

这些真实过程数据将作为 FR-001 Persistent Foreman Runtime 的施工输入。

---

```text
CURRENT MODE:
  HNS    = TEMPORARY SUPERVISOR
  CODEX  = WORKER / CRITIC / REVIEWER
  CITY   = DURABLE TRUTH
  OWNER  = L3 AUTHORITY ONLY

PERSISTENT FOREMAN:
  FUTURE / NOT YET IMPLEMENTED
```
