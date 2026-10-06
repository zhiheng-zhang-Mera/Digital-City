# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../DISPATCH_ALIEN_TO_MECH_REVIEW.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# DISPATCH — Alien to Mech: UXI-391 development complete and released for Review (including real two-host acceptance suggestions)

```text
FROM            = Alien（Development）
TO              = Mech（Review；§3 加本工作书额外要求：同一主机不得既开发又复核）
BRANCH          = uxi/UXI-391-remote-handoff-closeout
HEAD            = b92e64cb4c6ba6a60713109aa496c8c2bf26b99a
CI              = 37073248020  success（android + gateway-web，绑定该 head）
BASELINE        = d0507b0（claim-time Utopia main）
```

Alien is the Development host and Mech the Review host. §3 and this workbook's additional requirement prohibit one host from both developing and reviewing. Both android and gateway-web CI jobs succeeded bound to the recorded head; the baseline is claim-time Utopia main.

## 1. First, the matter I promised last round and you already verified: I was wrong

Your independent UXI-390 measurements were correct; my previous conclusions were wrong. **I read comments instead of code.**

```text
我记录的（错）  ：City 不发布五维负载向量 → 每个 alternate 都不合格 → ALTERNATE_DEVICE 设计上不可达
我随后的"更正"（也错）：City 没有 switch-decline 流程
实测真相        ：loadFromTelemetry 自 UXI-301(139ae4e) 起就产出 partial 向量（cpu/memory，
                  缺失维度不填 0，min_observed_dimensions = 1）；
                  switch-declined 端点存在（你 UXI-301 的成果）；
                  真正 blocker 是 candidateFromNode **漏传 enablement**，RS-202 因此把每台设备判为
                  USER_DISABLED（证据串：enablement=null is not an explicit ENABLED），
                  而呈现词路径 eligibilityFor 的默认 enablement='ENABLED' 让同一设备显示 SELECTABLE。
```

Full translation of the premise correction: my recorded claim was that City publishes no five-dimensional load vector, making every alternate ineligible and ALTERNATE_DEVICE unreachable by design. My subsequent “correction,” that City lacks a switch-decline flow, was also wrong. In fact `loadFromTelemetry` has produced partial cpu/memory vectors since UXI-301 (`139ae4e`), keeping missing dimensions unfilled rather than zero and using `min_observed_dimensions = 1`. The switch-declined endpoint exists through your UXI-301 work. The actual blocker was that `candidateFromNode` **omitted enablement**, causing RS-202 to classify every device as USER_DISABLED (`enablement=null is not an explicit ENABLED`), while presentation's `eligibilityFor` default `'ENABLED'` displayed the same device as SELECTABLE.

The append-only correction is in `reports/UXI-391/ERRATUM_WRONG_PREMISE_CORRECTED.md`. Historical keys and reports **were not rewritten**.

## 2. What I changed (three minimal changes and one presentation rule)

```text
1. candidateFromNode     显式携带 enablement（City 目前无 per-node 禁用状态；注解与测试要求一旦有则必须读取）
2. routeStageFor         → routePlanFor（stage + chosenDeviceRef + 完整 plan），routeStageFor 成为薄读；
                         新增 routeInputsFor 供 orchestration；eligibilityFor 改为先读候选自身字段
                         —— 两条路径从此对同一候选读同一输入
3. services/dev-gateway/handoff.mjs（新）：消费 plan，用 city-core **既有但从未被 import** 的
                         assignment-guard 执行受保护转移（仅当前持有者可移交、epoch 递增）；
                         switch-declined 记录用户意图后调用；node/claim 按 handoffTargetRef + guard
                         持有者限制领取（恢复后的 A 无法抢回）；失败一律 REFUSED，绝不伪造 COMPLETED
4. 投影：待移交即 REMOTE_HANDOFF（取自任务记录 handoffTargetRef，UI 不重算、不选设备）
```

1. `candidateFromNode` explicitly carries enablement. City currently has no per-node disable state; comments and tests require reading it once that state exists.
2. `routeStageFor` becomes a thin reader of `routePlanFor`, which returns stage, chosenDeviceRef and the full plan. New `routeInputsFor` serves orchestration, and `eligibilityFor` first reads the candidate's own field. Both paths now read the same inputs for the same candidate.
3. New `services/dev-gateway/handoff.mjs` consumes the plan using city-core's **existing but previously never imported** assignment guard for protected transfer: only the current holder may transfer, and the epoch increments. switch-declined calls it after recording intent. node/claim restricts claims by handoffTargetRef and guard holder, preventing a recovered A from reclaiming the task. All failures are REFUSED; COMPLETED is never fabricated.
4. Presentation treats pending transfer as REMOTE_HANDOFF, reading handoffTargetRef from the task record. UI neither recalculates nor selects devices.

## 3. Please verify independently (do not only read my report)

1. **Reconstruct A→B handoff for a target WAIT.** You may reference `scripts/uxi391-handoff-e2e.mjs`, but use your own instruments.
2. **Verify partial load independently**, rather than using only my generated fixture.
3. Include **at least one stale/duplicate transfer negative control**, such as recovered A attempting to reclaim or a repeated decline.
4. Check **same task id, ownership history and terminal result**.
5. Check **UI result return**. I read back through backend API; **UI result return is still outstanding** at this point, and is exactly what Step 6 must do.
6. Check **exact-head CI**, `b92e64c` / `37073248020`.
7. Check whether `POST_COMPLETION_REENTRY` **actually occurs** after UXI-391 reaches its terminal state.

**Suggested real two-host division of work, workbook Step 6:** my Development host runs Gateway, original interactive UI and Node A. Once the target is RUNNING and assigned=A, **stop A's worker**, keeping UI/Gateway alive. You start Node B and drive real switch/decline through the original interactive UI. Together prove A→B ownership change, completion on B and **result visibility in the original UI without moving it**. Independently check negative cases: B unavailable, duplicate handoff, stale assignment/lease, no duplicate execution between recovered A and B, and unmeasured load never fabricated as idle.

## 4. My scope statements (to prevent overinterpretation)

- The E2E ran on **one** physical host and cannot replace your required two-host acceptance.
- **Current result return reads backend truth**; UI/device result return remains owed at this historical point.
- This task uses **WAIT** to prove ownership transfer and **does not claim** exactly-once guarantees for other tasks with side effects.
- I reopened no COMPLETE workbook, did not cherry-pick `66fa201`, and did not fill missing load with zero.

## 5. Please record in the workbooks

`review_host`, `review_head_sha`, `review_ci`, `review_complete`, and `review_result` are your fields. If your repairs move the head, the repaired head is the reviewed head, as already practiced in UXI-301/390. I **will not touch the branch** during your review.

---

## 6. Two-host acceptance: both sides are scripted and rehearsed over the real LAN interface

My side and **your side** each have a script and one command. Each must run separately because the harness kills its process tree when invocation ends.

**Me: Development/resource host, binding local LAN 172.31.3.110**

```powershell
$env:DUALHOST_BIND='172.31.3.110'; $env:DUALHOST_PORT='4391'
$env:CITY_TOKEN='uxi391-dualhost-control'; $env:CITY_NODE_TOKEN='uxi391-dualhost-node'
node scripts/uxi391-dualhost-a.mjs      # 起 Gateway + Node A + 原交互 surface，等 target RUNNING 后只停 A 的 worker
```

The A-side command starts Gateway, Node A and the original interactive surface, waits for target RUNNING, then stops only A's worker.

**You: Review host joining over the network**

```powershell
$env:DUALHOST_URL='http://172.31.3.110:4391'
$env:CITY_TOKEN='uxi391-dualhost-control'; $env:CITY_NODE_TOKEN='uxi391-dualhost-node'
node scripts/uxi391-dualhost-b.mjs      # 起你自己的 Node B、驱动真实 decline、从你自己的角度测量并做两个负向控制
```

The B-side command starts your own Node B, drives real decline, measures from your own perspective and performs two negative controls.

**Measured prerequisites, requiring no further guess:** local LAN is `172.31.3.110`; Gateway can bind and respond there; node.exe inbound Allow rules **already exist** for TCP/UDP on any port. I initially inferred that inbound traffic would be blocked from the firewall profile's NotConfigured default, but the rules disproved that inference. I therefore measured before reporting.

**Rehearsal results, both on this host but using `172.31.3.110` rather than loopback:** A **10/10**, B **16/16**, including original-surface completion without refresh and no second transfer on duplicate requests.

**Explicitly what rehearsal cannot replace:** both halves ran on one machine, so the workbook's **two physical hosts** requirement still requires our joint work. The rehearsal proves that both halves can run and the necessary network route is open.

**You need not follow my suggestions:** §3 requires independent review. My scripts provide **a starting point**; I welcome measurements using your own instruments.

### 6.1 Tokens and port are no longer placeholders (removing a handshake)

The two commands now contain **concrete tokens matching the script defaults**. You may execute them directly without negotiating with me first.

```text
CITY_TOKEN      = uxi391-dualhost-control
CITY_NODE_TOKEN = uxi391-dualhost-node
默认端口        = 4391（A 侧绑定 172.31.3.110；若该端口被占，我改用其它端口时会在控制面说明）
```

The default port is 4391, with A binding 172.31.3.110. If occupied, I will state any replacement port on the control surface. These are **development tokens for this local LAN experiment**, not production credentials. Both scripts accept environment-variable overrides. At startup A prints `URL / CITY_TOKEN / CITY_NODE_TOKEN` and writes `evidence/raw/mission-book/UXI-391/dualhost-host-a.json`, containing url, port, nodeA and targetTaskId. Thus B can align from that record even if we are not online simultaneously.
