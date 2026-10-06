# DGX — Deliberative Governance Expansion & Migration / 审议治理扩建迁移

> **状态：PARKED / NOT ACTIVATED**
>
> 本系列仅记录已确认的架构扩建与软迁移方案。当前 `execution_enabled=false`；不得领取、施工、创建实现分支或把任何当前 branch/head 当作未来 baseline。
>
> **所有工作书的 baseline/dependency SHA 锚点当前故意为空。** 激活时必须重新读取当时的 Digital-City/Utopia canonical truth，以 full 40-char SHA 原子锚定，禁止回填“今天看起来合适”的 SHA。

## 目标

在不推倒现有城市结构、不搬迁已验收能力的前提下，增加一个跨域 **Deliberative Governance / Adjudication** 制度层，使复杂专业任务支持：

```text
Owner request
→ decomposition
→ capability/history-based assignment
→ independent execution
→ integration
→ conflict detection
→ defence / rebuttal
→ independent adjudication
→ appeal / minority dissent when applicable
→ participant final review
→ release gate
→ Process Capsule to Owner
```

## 架构边界

### 新治理层拥有

- Constitution / invariant governance rules；
- independence / recusal / conflict-of-interest；
- conflict declaration + structured defence；
- independent adjudication protocol；
- appeal / dissent retention；
- joint final acceptance / release semantics；
- domain-profile contract；
- Owner-visible bounded deliberation trace contract。

### 旧楼继续拥有专业正确性

- **00 Foundation / Capability Fabric**：task/event/evidence primitives、Agent capability/history facts；不复制 reputation truth。
- **02 Engineering**：Foreman、CI、fresh verifier、exact SHA、工程独立复核。
- **05 Health**：medical/pharmacology evidence rules、PK/PD/DDI/safety 等专业 profile。
- **06 Research**：method/evidence/claim/reproducibility review 与 domain evidence adjudication。
- **GAI/JEV**：triage/observation/routing；不自动成为最高仲裁者。
- **City Work Monitor / Control Centre**：治理过程的用户投影；不成为第二套 task truth。

## 用户透明度原则

默认返回必须给 Owner 一个 **Process Capsule**，至少回答：

1. 任务如何拆；
2. 哪些 Agent/角色参与；
3. 为什么这样分配；
4. 是否发生 material conflict；
5. 冲突如何仲裁；
6. 做了哪些验证；
7. 还有哪些 residual uncertainty；
8. Final Release Gate 是否通过。

但不得要求 Owner 阅读全部 routine heartbeat、重复日志、每个中间 token、未采用候选草稿或隐藏 chain-of-thought。深层证据通过 Monitor progressive disclosure 按需展开。

## 迁移原则

这是 **soft reclassification first**：

```text
KEEP IN PLACE
→ register canonical owner
→ assign governance role
→ expose stable contract
→ migrate only on real ownership duplication/conflict
```

禁止为了架构整洁搬动已经通过 exact-head / opposite-host review 的实现。

## 工作系列

| ID | 工作 | 状态 |
|---|---|---|
| DGX-001 | Governance Ownership Audit & Capability Map | PARKED |
| DGX-002 | Constitution + Core Deliberation Contracts | PARKED |
| DGX-003 | Capability/History Assignment Policy | PARKED |
| DGX-004 | Domain Profile Adapters & Soft Migration | PARKED |
| DGX-005 | Conflict / Defence / Independent Adjudication | PARKED |
| DGX-006 | Appeal / Dissent / Joint Final Review & Release Gate | PARKED |
| DGX-007 | Process Capsule + Monitor Governance Projection | PARKED |
| DGX-990 | Cross-domain Acceptance & Freeze | PARKED |

## 激活条件

本系列**不会因目录存在自动启动**。至少需要：

- Owner 显式激活 DGX；
- 对当前在途 programme 做 reality reconciliation；
- 为首个可执行 workbook 重新解析当时 baseline full SHA；
- 所有依赖 SHA 从其正式 accepted exact head 获取；
- 不得为了 DGX 打开已经冻结的旧任务 acceptance boundary。

默认优先等当前 Monitor programme 完成其既定 freeze，再决定 DGX 的具体锚点与施工顺序；Owner 可另行裁决。
