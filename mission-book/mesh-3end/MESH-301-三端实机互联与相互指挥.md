---
workbook_id: MESH-301
phase: THREE_END_MESH_RUNTIME
sequence: 301
execution_enabled: false
status: DRAFT_PENDING_OWNER_APPROVAL
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["UXI-391"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: OWNER_APPROVAL_TO_ACTIVATE
merge_authority: true
report_path: mission-book/reports/MESH-301
terminal_marker: THREE_END_MESH_RUNNING
draft_author: Alien
draft_basis: "OWNER_INSTRUCTION_THREE_END_TEST.md (Owner's direct instruction, 2026-10-03) and the measured state of UXI-301/390/391"
---

# MESH-301 — 三端实机互联与相互指挥（Mech 主机 + Alien 主机 + Android 实机）

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> README 仅为监控看板，不是施工规范或 claim lock。
>
> **本文件是 Owner 授权 Alien 起草的草案（§12：任务创建属 Owner）。** `execution_enabled: false` 且
> `status: DRAFT_PENDING_OWNER_APPROVAL`，因此**当前不可领取**。Owner 批准（可直接改这两个字段，或指示我改）
> 之后才进入正常 claim 流程。

## 目标

让**三个真实端点同时运行在同一个 City 里**，并且彼此真实可见、可互相指令：

```text
端点 A = Mech 主机（Windows）
端点 B = Alien 主机（Windows，本机；其节点名为 Alien-test）
端点 C = Android 实机（Alien 控制、Android Studio 连接，Android 版）
```

Owner 的三条硬性要求：

1. **Android 实机可以实际干预整个系统，对两台主机下指令**（不是只读展示）；
2. **任意一台主机可以对其他主机下达指令 / 向中心进行任务汇报**；
3. **所有设备都能实时同步知道别的设备在做什么**。

## 已确认背景 / 当前真实代码（已实测，非假设）

```text
中心：一个 Gateway 即 City（节点注册/心跳/领取/汇报、任务状态、事件、presentation feed）
  - 无中心即无相互指挥；三端必须连同一个 City，这是本任务的第一个真问题。
已有通道：GET /api/v0/events + WebSocket /api/v0/events/stream（事件流，含 TASK_*/NODE_*/TASK_HANDOFF_*）
  - Web 的 Activity 页与 Android 的 Activity 页已在渲染事件时间线；
  - "别的设备在做什么" 的数据源已经存在，缺的是【三端同时订阅同一个 City 并把彼此呈现出来】的证据。
跨机能力（UXI-391 已做实并双机验收）：
  - 节点可在 LAN 上注册；跨机所有权转移 A→B 实测成功（同一 task id、epoch 递增、结果回到原 surface）；
  - 本机 LAN = 172.31.3.110；Mech 主机按其 finding 自述为 172.31.12.151；
  - 本机存在 node.exe 的入站 Allow 规则（TCP/UDP 任意端口），因此 LAN 入站不需要额外放行。
Android 面现状：
  - 真机 BICIPVNB5HS85H9T，实测可通过 adb reverse + 会话预置连上本机 Gateway，并能显示调度面板与完成结果；
  - 但【动作】目前只有 CANCEL 接到后端；且 adb reverse 是 loopback 通道，不是三端共用的 LAN 连接。
冻结约束（本任务不得绕过）：
  - 冻结契约 contracts/rs-presentation-contract-v1 的 ALLOWED_ACTIONS = CANCEL / RETRY / KEEP_WAITING /
    CHOOSE_PROVIDER / CONFIRM —— **没有"命令另一台主机"这类动作**；
  - RS-290 冻结的调度语义、UI-190 冻结点、已 COMPLETE 的历史工作书均不得重开。
```

## 依赖与解锁条件

- `UXI-391` 收口（复核确认 + Step 7 合并 + `REMOTE_HANDOFF_CLOSEOUT_REPAIRED`）——本工作书依赖它把
  「跨机执行 + 结果回流」这条链路做实；
- **Owner 批准本草案**（`execution_enabled: true` + `status: READY`）；
- 三个端点物理可用：Mech 主机在线、本机在线、Android 实机通过 Android Studio/adb 可用；
- 三端需约定同一个 City 地址与配对令牌（本工作书要求在 Step 1 记录它们，不靠记忆）。

## 允许修改边界

1. 三端**共用同一 City** 所需的最小配置与连通（含 Android 走 LAN 而非仅 adb reverse 的连通方式）；
2. Android 面**发起指令**所需的最小接线——**但只能使用冻结契约中已存在的动作**，除非 Owner 明确裁决扩展契约；
3. 主机→主机的**定向派发**所需的最小机制（在既有 planner 语义之上，不改写它）；
4. 三端**实时同步**所需的最小接线：让 Web 与 Android 都订阅/消费同一事件流，并呈现"别的设备在做什么"；
5. 三端运行所需的 harness、探针与证据（`mission-book/reports/MESH-301/**`、Utopia `evidence/raw/mission-book/MESH-301/**`）；
6. 针对本任务新增的单元/集成/E2E/回归测试。

## 禁止修改边界

- 不新增 AI provider、设备发现协议、权限模型或泛化 checkpoint 框架；
- 不重写 RS-201/202/203/290 的冻结语义；不重开 UI-190 冻结点与任何已 COMPLETE 的历史工作书；
- **不得由单一主机同时完成 Development 与独立 Review**（§3）；
- 不得把"三端都在线"当成"三端互相可见"：**可见性必须有证据**（同一事件在三端上的观测一致性）；
- 不得为了让测试通过而放宽 planner/guard 的既有拒绝语义（宁可失败并如实报告）；
- 不得把缺失观测（例如未测量负载）伪造成 0 或"空闲"。

## 任务特有施工步骤

### Step 1 — Claim-time reconciliation
重读 Digital-City main、Utopia main 与其 hosted CI、UXI-391 收口状态、本工作书依赖项；记录 `development_baseline_sha`；
记录三端约定的 City 地址与令牌；确认 `execution_enabled: true` 才开工。

### Step 2 — 三端同 City 连通（先证明"连得上"，再谈指挥）
1. 在本机起一个 City，绑定 **LAN 接口**（不是 loopback），并确认 Mech 主机与 Android 实机都能连上它；
2. Android 侧优先**直连 LAN**（真机与主机同一网段），`adb reverse` 只作为退化方案并在报告中说明；
3. 三端各自注册为**不同身份**（Mech 主机、`Alien-test`、Android 端），并断言 City 里同时可见三者；
4. 记录每端的连接方式、地址、身份与证据。

### Step 3 — 实时"看见彼此"（要求 3）
1. 三端各自订阅同一个事件流；断言同一事件在三端被观测到，并记录三端观测到的事件序号/时间戳；
2. 至少在两种状态下验证：任务在 A 端执行时 B/C 端可见；任务被交接后 B/C 端可见归属变化；
3. **一致性断言**：同一时刻三端对"谁在执行什么"的陈述一致（不一致即失败，并如实记录）。

### Step 4 — Android 作为指令源（要求 1）
1. 用**冻结契约中已存在的动作**从 Android 实机发起指令，并证明该指令**真的到达后端并改变系统状态**
   （不是界面上的假动作——UXI-390 的教训：看起来能用、实际什么都没发生，比诚实的缺口更糟）；
2. 若 Owner 要求"Android 能下达任意指令"，那需要扩展契约动作集——**这是 Owner 的裁决，不在本步骤默认范围内**；
   草案在此显式标注该岔路，避免实施者擅自扩契约。

### Step 5 — 主机→主机定向指令与汇报（要求 2）
1. 允许在既有 planner 语义之上增加**最小定向机制**：一条指令可以指定目标节点；
2. 定向失败必须诚实：目标不在线/不合格时保持非终态或明确失败，**不得伪造完成**；
3. 另一端执行并向中心汇报，中心状态与事件流如实反映（沿用 UXI-391 已验证的节点领取/汇报链路）。

### Step 6 — 三端实机验收（另一实体主机参与）
1. Development 释放后由**另一实体主机**独立复核，并与开发主机完成三端验收；
2. 验收必须包含**负向控制**：某一端离线时其余两端的行为、重复指令、陈旧目标、以及"指令发出但无人可执行"的情形；
3. 三端各自留下自己的 receipt（互不背书）。

### Step 7 — Merge 与终态
exact review-head CI 绿 → 合并 Utopia main → 验 main CI → 记录终态标记 `THREE_END_MESH_RUNNING` →
按常驻规则做**完成后自动回接扫描**（`reports/MESH-301/POST_COMPLETION_REENTRY.md` 或符合 §5 的 typed zero-claim 分类）。

## 任务特有独立复核

复核主机不得只读报告签字，至少独立完成：

- 用**自己的仪器**重建三端同 City 的场景（不得只用开发主机的脚本）；
- 独立证明 Android 发起的指令真的改变了后端状态（例如全局事件扫描，而非界面截图）；
- 独立证明三端对"谁在做什么"的实时一致性，并给出反例检查（例如故意让一端掉线）；
- 至少一个 stale/duplicate/无权目标的负向控制；
- 核对 exact-head CI 与证据可开性；
- 核对完成后的自动回接确实发生。

## 测试 / 实机 / 视觉证据

```text
- 三端连接与身份证据（City 内三者同时在线；节点名分别为 Mech 主机名 / Alien-test / Android 端名）
- 事件一致性证据（同一事件在三端被观测；序号/时间戳并列）
- Android 指令的端到端证据（指令 → 后端状态改变 → 事件 → 三端可见）
- 主机→主机定向指令与汇报证据（目标端执行、中心状态、结果回流）
- 负向控制（离线/重复/陈旧/无目标）
- exact-head hosted CI 结论
大体积原始证据留在 Utopia：evidence/raw/mission-book/MESH-301/**
```

## 完成门槛

1. 三端同时连接同一个 City，且身份可区分、可断言；
2. 三端都能实时看到其他端在做什么，且有一致性证据；
3. Android 实机能发起指令并真实改变系统状态（用既有动作；若需要新动作，须先有 Owner 裁决）；
4. 任一主机可对其他主机下达指令 / 向中心汇报，且有端到端证据；
5. 负向控制全部如实（不伪造完成、不静默丢弃意图）；
6. 另一实体主机独立复核 PASS；
7. exact review-head CI PASS；
8. Utopia main 合并 + main CI PASS；
9. 终态标记 `THREE_END_MESH_RUNNING` 已记录；
10. 完成后自动回接扫描已生成记录。

## 需要 Owner 在批准时一并明确的两个岔路

```text
岔路 1：Android"对两台主机下指令"是否必须突破冻结契约的 ALLOWED_ACTIONS？
        若必须，需要 Owner 裁决契约扩展（属新产品能力），本工作书才会包含它；
        若不必，则用既有动作完成，本工作书按其实现。
岔路 2：Mech 主机在三端测试中的角色是【独立复核主机】还是【被测端点】？
        §3 要求 Development 与 Review 不同主机；若 Mech 同时作为被测端点与复核主机，需要 Owner 明确其独立性如何保证。
```

## Reports / Utopia evolution 记录

- `mission-book/reports/MESH-301/DEVELOPMENT_REPORT.md`
- `mission-book/reports/MESH-301/REVIEW_REPORT.md`
- `mission-book/reports/MESH-301/POST_COMPLETION_REENTRY.md`
- Utopia：`evidence/raw/mission-book/MESH-301/**`

## 绑定常驻规则

本工作书自动继承 `mission-book/CONSTRUCTION_RULES.md` 的原子领取、双机独立、等待/唤醒、20 分钟兜底重扫、external reconciliation、exact-head CI/evidence、no-idle、no-make-work、integration refresh 等规则。若本工作书需要更严格的 task-specific gate，可追加；不得降低常驻规则。
