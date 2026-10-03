---
workbook_id: MESH-301
phase: THREE_END_MESH_RUNTIME
sequence: 301
execution_enabled: true
status: READY
activation_basis: "ACTIVATED ON THE OWNER'S DIRECT INSTRUCTION, GIVEN TO THE MECH HOST ON 2026-10-03: join the multi-end interconnection task described by MESH-301, with this host joining the network under the default name Mech-Win, and do not stop before the task is complete. The workbook itself sanctions this route - it states the Owner may approve by changing these two fields or by instructing the drafter to change them - and the Owner's instruction entails activation because the field had to become claimable for the work to start at all. THE TWO FIELDS WERE CHANGED BY THE MECH HOST ON THAT INSTRUCTION, not by the drafter, and the drafter had separately offered to make the same change on a direct instruction; recorded here verbatim so the basis is auditable rather than assumed. WHAT IS STILL NOT DECIDED AND IS THE OWNER'S: how the pairing/bearer token reaches the Mech host, which MESH-301 step 2 requires to stay out of reports, screenshots and Git, so the drafter cannot put it in the control plane. Until that is chosen the three endpoints cannot share one canonical City, and no three-end result will be claimed."
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
terminal_marker: THREE_END_MESH_E2E_ACCEPTED
design_audit: REVISED_2026-10-03
draft_author: Alien
draft_basis: "OWNER_INSTRUCTION_THREE_END_TEST.md (Owner's direct instruction, 2026-10-03) and the measured state of UXI-301/390/391"
---

# MESH-301 — 三端实机互联与相互指挥（Mech 主机 + Alien 主机 + Android 实机）

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> README 仅为监控看板，不是施工规范或 claim lock。
>
> **本文件是 Owner 授权 Alien 起草的草案（§12：任务创建属 Owner）。** `execution_enabled: false` 且
> `status: DRAFT_PENDING_OWNER_APPROVAL`，因此**当前不可领取**。Owner 批准（可直接改这两个字段，或指示我改）
> 之后才进入正常 claim 流程。
>
> **2026-10-03 设计审计修正：** Android 在当前代码里是 control client，不是 worker node；用户创建/定向任务与 RS presentation 的 `ALLOWED_ACTIONS` 是两套语义；三端同步按服务器 event `seq` 做 bounded convergence，而不是要求本地时钟“同一时刻强一致”。以下正文已按这三个事实修正。

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

## 已确认背景 / 当前真实代码（2026-10-03 设计审计后）

### 端点身份必须分层

- Alien Windows 与 Mech Windows 是当前真实 execution worker nodes：走 node/register → heartbeat → claim → report。
- Alien Web、Mech Web、Android app 是三个 control/observation clients。
- Android 当前已经有 CityClient、snapshot、WebSocket event stream 和 safe task 创建能力，但没有 Android worker agent 的 claim/execute/report 路径。
- 因此 MESH-301 v1 的真实拓扑是 **2 workers + 3 control clients + 1 canonical City**。不得让 Android 伪注册一个不会执行任务的 node。

### Android 已经可以发出 City command

`CityClient.createTask()` 当前直接 POST `/api/v0/tasks` 创建 `CHECKPOINT_DEMO`。所以 Android“能发命令”不需要扩展 RS presentation 的 `ALLOWED_ACTIONS`。

`CANCEL / RETRY / KEEP_WAITING / CHOOSE_PROVIDER / CONFIRM` 只描述 scheduler surface 对既有任务的后续动作，不是所有用户命令的总动作表。

### 当前真正缺口是 strict target-device intent

现有 `/api/v0/tasks` 创建普通 QUEUED task；`node/claim` 由合格节点领取，没有“这条用户指令必须由 Alien 或 Mech 某一节点执行”的显式持久化意图。

MESH-301 应增加最小 explicit target-device routing intent，而不是新增 scheduler action token。要求：

- target 必须引用当前 City 已知 node identity；
- target intent 必须进入 canonical task/action truth；
- strict-target task 只能由目标节点领取；
- target offline / unknown / ineligible 时明确等待或 typed refusal，不得 silent fallback；
- 不得滥用 `providerRef` 或 `handoffTargetRef` 伪装定向命令；
- user-level path 优先保留现有 Action/idempotency 语义；若低层 `/tasks` 必须扩展，也必须补重复提交边界。

### 事件顺序已有 canonical seq

City store 的 events 使用服务器端 AUTOINCREMENT `seq` 并带 event id。三端实时同步应以同一 server `seq` 的观察收敛为依据，而不是比较三台设备本地时钟截图。

### UXI-391 已完成

- Utopia accepted main：`ec12fd0831f31fd81aef9cd9dfb0c959d010f63b`；
- recorded main CI：`37088960085` green；
- `REMOTE_HANDOFF_CLOSEOUT_REPAIRED` 已完成；
- 历史工作书已归档到 `mission-book/finished/completed-2026-10-03/`。

## 依赖与解锁条件

- `UXI-391` 收口（复核确认 + Step 7 合并 + `REMOTE_HANDOFF_CLOSEOUT_REPAIRED`）——本工作书依赖它把
  「跨机执行 + 结果回流」这条链路做实；
- **Owner 批准本草案**（`execution_enabled: true` + `status: READY`）；
- 三个端点物理可用：Mech 主机在线、本机在线、Android 实机通过 Android Studio/adb 可用；
- 三端需约定同一个 City 地址与配对令牌（本工作书要求在 Step 1 记录它们，不靠记忆）。

## 允许修改边界

1. 三个 control endpoints 指向同一个 canonical City 所需的最小连接配置；
2. Web / Android 发起 strict-target safe task 的最小交互；
3. City task / Action facade 保存 explicit target-device intent 所需的最小契约扩展；
4. node claim 对 strict target 的最小 guard，同时保留普通未定向 task 的原有调度；
5. Web / Android 对同一个 City event truth 的同步与 bounded-convergence probe；
6. 三端 E2E harness、receipts、negative controls、tests/reports/evidence。

## 禁止修改边界

- 不把 Android 伪造成 runtime worker node；
- 不重开或重写已冻结 UI / RS / UXI 历史工作；
- 不扩展 RS presentation `ALLOWED_ACTIONS` 来表达“创建/定向任务”；
- 不复用 provider routing / handoff routing 字段来偷渡 strict user target；
- 不新增 AI provider、公开互联网 relay、TLS 系统或新权限模型；
- 不把 City authoritative truth 改成 peer-to-peer truth；
- strict target 不可用时不得静默改派；
- 不得把缓存或缺失事件伪造成实时一致；
- Development 与 Formal Review 仍必须由不同实体主机完成。

## 任务特有施工步骤

### Step 1 — Claim-time reconciliation
重读 Digital-City main、Utopia main 与其 hosted CI、UXI-391 收口状态、本工作书依赖项；记录 `development_baseline_sha`；
记录三端约定的 City 地址与令牌；确认 `execution_enabled: true` 才开工。

### Step 2 — 三个 control endpoints 指向同一个 City

1. Claim-time 实测 Gateway 的可达路径，不使用历史 IP 作为长期事实；
2. Alien Web、Mech Web、Android 可以使用不同 transport，只要最终读取到同一个 `cityId`；
3. 允许 trusted private LAN / routed private network / 已有 Remote Fabric 路径；Android `adb reverse` 也允许作为受控开发路径，只要连接的仍是同一个 canonical Gateway；
4. pairing/bearer token 必须脱敏，不进入报告、截图或 Git；不得为测试把 Gateway 暴露到公共互联网；
5. City 中只要求 Alien + Mech 两个 distinct worker nodes；Android 留在 control-client 身份。

### Step 3 — strict target-device routing

增加一个明确的 target-node user intent，并证明：

```text
target=Alien → only Alien may claim
target=Mech  → only Mech may claim
target offline/unknown → no silent fallback
duplicate user action → no accidental duplicate execution
untargeted task → existing scheduler behavior unchanged
```

具体字段名由实现根据当前 Action/City-task contract 选择，但不得复用已有不同语义字段。

### Step 4 — Android → Alien / Mech

Android 实机分别发起 target=Alien 与 target=Mech 的 safe task。每个 case 必须证明：control input → canonical action/task → 正确节点 claim → RUNNING → report/result → terminal truth → 三个在线 control surfaces 最终观察到同一结果。

### Step 5 — PC → PC 与实时 bounded convergence

1. Alien control surface → Mech worker；
2. Mech control surface → Alien worker；
3. 选择 TASK_CREATED / TASK_STARTED / TASK_COMPLETED，以及 node offline/online 或 ownership change 中至少一个事件；
4. 对每个 canonical server `seq` 记录 Alien / Mech / Android 的 observed-at 与 convergence latency；
5. 默认要求每个在线 surface 在 server emit 后 5 秒内收敛；若 claim-time 客户端配置改变，可记录更严格的窗口并由 Review 独立复测；
6. 离线端不要求离线期间实时更新，但必须显示 stale/offline，恢复后重新收敛到 canonical truth。

### Step 6 — 三端实机验收（另一实体主机参与）
1. Development 释放后由**另一实体主机**独立复核，并与开发主机完成三端验收；
2. 验收必须包含**负向控制**：某一端离线时其余两端的行为、重复指令、陈旧目标、以及"指令发出但无人可执行"的情形；
3. 三端各自留下自己的 receipt（互不背书）。

### Step 7 — Merge 与终态
exact review-head CI 绿 → 合并 Utopia main → 验 main CI → 记录终态标记 `THREE_END_MESH_E2E_ACCEPTED` →
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
- 一个 canonical cityId 的三端连接 receipts
- Alien + Mech 两个真实 worker node 身份
- Android control-client receipt（不得伪装 worker）
- Android -> Alien strict-target task E2E
- Android -> Mech strict-target task E2E
- Alien -> Mech 与 Mech -> Alien E2E
- canonical event seq 在三端的 bounded-convergence 记录
- negative controls: unknown/offline/duplicate/stale target
- 普通未定向 task scheduler regression
- exact-head hosted CI
```

大体积原始证据继续留在 Utopia：`evidence/raw/mission-book/MESH-301/**`。

## 完成门槛

1. 三个真实 control endpoints 同时连接同一个 canonical City；
2. Alien + Mech 是两个真实且不同的 worker nodes；
3. Android 不伪装 worker node；
4. Android 能 strict-target Alien 与 Mech 各执行一次 safe task；
5. Alien 与 Mech 能互相 strict-target 发起 safe task；
6. target unavailable / unknown / duplicate 等 negative controls fail-honest；
7. 普通未定向 task 行为无回归；
8. 三个在线 surface 对 canonical event seq 在 bounded window 内收敛；
9. Android offline/reconnect 后能重新收敛；
10. 另一实体主机 Formal Review PASS；
11. exact review-head CI PASS；
12. Utopia main merge + merged-main CI PASS；
13. `THREE_END_MESH_E2E_ACCEPTED` 已记录；
14. post-completion re-entry 已执行。

## 设计审计结论：原草案六个缺陷已修正

1. **Android client / worker node 混淆**：改成 2 workers + 3 control clients。
2. **把 scheduler ALLOWED_ACTIONS 当成所有用户命令**：删除该假岔路；定向任务是 routing intent。
3. **“同一时刻三端一致”的假强一致**：改为 canonical server event `seq` + bounded convergence。
4. **写死历史 LAN/IP**：改为 claim-time 测量 route；只要求同一个 cityId，不要求同一种 transport。
5. **Mech 被测端点与 Reviewer 的假冲突**：删除该 Owner 岔路；端点参与不等于 authorship，只要求 Development 与 Formal Review 不同实体主机。
6. **终态 `THREE_END_MESH_RUNNING` 语义过弱**：改为 `THREE_END_MESH_E2E_ACCEPTED`。

因此现在剩下的 Owner gate 只有一件事：**是否激活 MESH-301 开工**。不再要求 Owner 对上述技术岔路做选择。

## Reports / Utopia evolution 记录

- `mission-book/reports/MESH-301/DEVELOPMENT_REPORT.md`
- `mission-book/reports/MESH-301/REVIEW_REPORT.md`
- `mission-book/reports/MESH-301/POST_COMPLETION_REENTRY.md`
- Utopia：`evidence/raw/mission-book/MESH-301/**`

## 绑定常驻规则

本工作书自动继承 `mission-book/CONSTRUCTION_RULES.md` 的原子领取、双机独立、等待/唤醒、20 分钟兜底重扫、external reconciliation、exact-head CI/evidence、no-idle、no-make-work、integration refresh 等规则，并继承 `mission-book/ASYNC_RELIEF_CONSTRUCTION.md` 的 Hns supervisor / Codex worker、Review→Repair 自动接力与 L0→L3 escalation 规则。异步减压只减少 Owner 人工中转，不得降低实体主机独立复核、CI、证据或安全门槛。
