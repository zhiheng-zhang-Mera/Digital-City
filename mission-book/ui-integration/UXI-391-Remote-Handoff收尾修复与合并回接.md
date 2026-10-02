---
workbook_id: UXI-391
phase: UI_SCHEDULER_CLOSEOUT_REPAIR
sequence: 391
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["UXI-390"]
development_host: Alien
development_branch: uxi/UXI-391-remote-handoff-closeout
development_head_sha: 2e6b71aac9fec9896e5a66a2550561b3f8127e65
development_ci: null
development_baseline_sha: d0507b008cc4f91c494e24388c457a8decd9e559
development_claimed_at: 2026-10-02T22:18:14Z
development_claim_basis: "CLAIMED BY ALIEN AFTER A CLAIM-TIME RECONCILIATION RATHER THAN FROM THE WORKBOOK'S OWN PREAMBLE. MEASURED AT CLAIM TIME: Digital-City main = 9a1922194066aede2ee7033a61f7478d08d0c99f; Utopia main = d0507b008cc4f91c494e24388c457a8decd9e559 (UNCHANGED since the UXI-390 merge, so no integration refresh is required at claim); main hosted CI run 37020640107 = success on exactly that sha; and 66fa201 (Mech's UXI-301 correction) is NOT on main - git merge-base --is-ancestor returns false and the diff against main is 27 files changed, +285/-1207 - so the workbook's instruction not to cherry-pick it wholesale is confirmed against the repository rather than accepted on trust. WHAT WAS READ RATHER THAN ASSUMED, because this task exists to correct wrong premises: contracts/city-control-v0/protocol.mjs does declare five requestable task types, and the RS-202 pressure module documents the partial-observation load semantics this workbook fixes the record around. THE PREMISE THIS TASK CORRECTS IS MINE: Alien recorded, in the UXI-390 deferral and in its workbook keys, that the City publishes no load vector and that every alternate is therefore ineligible - and that conclusion is what UXI-391 exists to test properly, with a correct target-task construction, instead of the construction I used. THE CLAIM IS ATOMIC IN THE RULE'S SENSE: this commit sets development_host, and if the push loses a race the claim is withdrawn rather than forced."
development_complete: false
development_progress: "UXI-391 STEP 1-4 DONE THIS ROUND, ON A REAL BRANCH HEAD RATHER THAN A PLAN. Step 1 claim-time reconciliation: Digital-City main 9a19221; Utopia main d0507b0 unchanged since the UXI-390 merge so no integration refresh was needed; main CI 37020640107 success; and 66fa201 is NOT on main (merge-base --is-ancestor false, diff 27 files +285/-1207), so it was not cherry-picked. Step 2: the wrong premise is corrected APPEND-ONLY in reports/UXI-391/ERRATUM_WRONG_PREMISE_CORRECTED.md - no historical key or report was rewritten - and the stale code comment that claimed an automatic handoff is unreachable because this City has no switch-decline flow is corrected in place. THE MEASURED TRUTH, WHICH REFUTES MY OWN UXI-390 RECORD: loadFromTelemetry() has produced a PARTIAL vector since 139ae4e (cpu from usagePercent, memory from used/total; gpu/io/network stay unmeasured; min_observed_dimensions = 1), so the load was never the blocker; the blocker was that candidateFromNode() carried NO enablement, so RS-202 refused EVERY candidate as USER_DISABLED (evidence string: enablement=null is not an explicit ENABLED) while eligibilityFor's default enablement='ENABLED' made the same device read SELECTABLE. I had quoted a stale comment instead of reading the code path above it. Step 3: scripts/uxi391-handoff-e2e.mjs PASSES 21/21 with the construction the workbook specifies - one target WAIT created while only A exists, asserted RUNNING on A and SUSTAINED at progress 18, A's agent stopped with the Gateway alive, the assignment asserted to SURVIVE the dropout, B started only afterwards, the target asserted to remain the ONLY task, the real switch-declined endpoint driven, the planner reaching ALTERNATE_DEVICE and the surface REMOTE_HANDOFF, the bridge EXECUTING the A-to-B move on the SAME task id, B completing it to a real terminal success with result {waitedMs:6000} read back from the backend, exactly one task and one completion in the City (no double execution), and the backend recording TASK_HANDOFF_TRANSFERRED with handoffEpoch 2 and history handoff:uxi391-node-a->uxi391-node-b@epoch2. Step 4: three minimal changes, all inside the allowed boundary - candidateFromNode now carries an explicit enablement (the City keeps no per-node disable state, and the comment plus a regression test to be added require it to READ that field if it ever gains one); routeStageFor was refactored into routePlanFor returning stage + chosenDeviceRef + the full plan, with routeStageFor a thin read of it and a new routeInputsFor for the orchestration, so the decision has ONE source instead of a third reconstruction; and a new services/dev-gateway/handoff.mjs consumes that plan and executes the transfer through the City core's EXISTING assignment-guard (current-holder-only transfer, epoch bump so the previous holder's late retry is not idempotent), while planRoute stays pure with executed:false. The node claim path now refuses to hand a task to any device but the one it was reserved for, so a recovered A cannot re-claim moved work, and a refused transfer changes nothing rather than inventing a COMPLETED. Projection gained a pending-handoff rule so REMOTE_HANDOFF is durable from the transfer until the new holder finishes, driven by the task record rather than recomputed by any surface. STILL OWED FOR STEP 5: the regression tests (five task types, WAIT hold, partial load, missing != zero, saturated dimension binds, ownership change, no duplicate execution, the term set, result return, Web/Android parity, root regression) and then exact-head hosted CI. Step 6 and 7 remain Mech's review plus the dual-host acceptance, then the merge, the REMOTE_HANDOFF_CLOSEOUT_REPAIRED marker and POST_COMPLETION_REENTRY.md."
development_premise_corrected: "APPEND-ONLY CORRECTION, because the wrong premise is MINE and the historical record stays readable: reports/UXI-391/ERRATUM_WRONG_PREMISE_CORRECTED.md names what Alien recorded during UXI-390 (that the City publishes no load vector, that every alternate is therefore ineligible, that ALTERNATE_DEVICE is unreachable by design, and - in the later correction - that the City has no switch-decline flow) and states what measurement found instead: the partial load vector has existed since UXI-301, the switch-decline endpoint exists, and the seam was blocked by a MISSING enablement field in the candidate mapping that made RS-202 judge every device USER_DISABLED. Both of my earlier claims were wrong, including the correction, and neither historical key nor report is rewritten. THE OWNER RULING THAT RESTED ON THAT PREMISE IS NOT UNDONE BY THIS TASK - UXI-391 says so explicitly - but its stated reason is now measurably false, and whether the ruling's record should be amended is the Owner's decision rather than mine."
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: true
report_path: mission-book/reports/UXI-391
reentry_policy: AUTO_RESCAN_INCOMPLETE_MERGE_WORKBOOKS
terminal_marker: REMOTE_HANDOFF_CLOSEOUT_REPAIRED
---

# UXI-391 — Remote Handoff 收尾修复与合并回接

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> README 仅为监控看板，不是施工规范或 claim lock。

## 目标

这是一个**阶段接受后的窄范围收尾修复**，不是重新开启 UI 文明化、RS-201..290 或 UXI-301/390 的全量施工。

目标只有四件事：

1. 纠正 UXI-301/390 中关于「City 只有一种瞬时任务、无法稳定制造 busy-current-device」的错误前提；
2. 固化五维负载向量的当前真实语义：允许 partial observation，缺失维度保持 unobserved，不伪造为 0，也不要求为了本修复强制采齐五维；
3. 用可重复的目标任务构造，真正闭合 `SWITCH_OFFERED → ALTERNATE_DEVICE / REMOTE_HANDOFF → 任务在另一节点继续 → 结果回到原交互 surface`；
4. 本工作书终态后**不得停在“本任务完成”**：必须自动重新扫描其他未完成 merge workbook / merge-authority 任务，满足依赖者立即回接执行。

## 已确认背景 / 当前真实代码

创建本工作书时的已验证基线：

- Utopia `main = d0507b008cc4f91c494e24388c457a8decd9e559`；
- main hosted CI：`37020640107 = success`；
- `UXI-390` 的视觉、Android/Web 接线与阶段接受保持有效，本工作书**不撤销** `UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED`；
- 分支 `uxi/UXI-301-scheduler-status-into-product-ui @ 66fa20118f1a7dbb269cf05d8b0a6580219afce3` 发现并纠正了一个真实的记录错误：City 协议并非只有一种任务；
- `contracts/city-control-v0/protocol.mjs` 声明五种 requestable task：
  `WAIT`, `CREATE_TEMP_ARTIFACT`, `HASH_TEMP_ARTIFACT`, `DELETE_TEMP_ARTIFACT`, `CHECKPOINT_DEMO`；
- reference runner 中 `WAIT` 默认执行约 `1200ms × 5 = 6000ms`，可以稳定持有节点；
- 但 `66fa201` **不能整提交直接并入 main**：其新 handoff evidence 自身仍为 FAIL，且该 head 没有可绑定的 hosted CI；这里只吸收被源码和独立测量证实的事实，不继承失败的场景构造。

### 五维负载变量的本任务裁决

RS-202 的负载向量仍为：

`cpu / memory / gpu / io / network`

本任务不得把“必须同时拥有五个维度”作为 handoff 前置条件。当前已实现语义为：

- `loadFromTelemetry()` 从现有 telemetry 中诚实产生已测量维度；目前稳定可得的是 CPU 与 memory；
- GPU / IO / network 未测量时保持缺失，不填 `0`；
- `loadPressure()` 接受 partial vector，默认 `min_observed_dimensions = 1`；
- pressure 使用**已观测维度中的 binding maximum**，而不是五维平均值；
- 一个饱和维度不得被其它低负载维度稀释；
- 完全没有可用 load measurement 时仍为 `LOAD_UNKNOWN`，不能假装 idle。

因此，**五维变量本身不是本轮 blocker**。本工作书只修正与现状矛盾的旧注释/记录，并确保 handoff 测试使用真实 partial telemetry。  
“按任务 capability 声明 required load dimensions”是未来可扩展方向，但**不在 UXI-391 内新增该架构**。

## 依赖与解锁条件

- 依赖 `UXI-390` 已满足：阶段接受、main merge 与 main CI 均已完成；
- 本任务可以由 Alien 或 Mech 任一主机领取 Development；
- Development 只需要**一台实体主机**；
- Development 阶段允许在同一实体主机上运行 Gateway + Node A + Node B 进行受控双 Node E2E；
- 最终独立复核与真实双机验收必须由**另一台实体主机**参与，Hosted CI 不算第二实体主机；
- 同一主机不得同时完成 Development 与独立 Review。

## 允许修改边界

仅允许为以下目标做最小修改：

1. UXI-301/390 handoff 相关 harness、evidence 与错误记录；
2. Gateway / scheduler orchestration 中“消费 routing plan 并执行已有语义的 ownership transfer / reassignment”所必需的最小桥接；
3. target task 的安全重新领取 / 恢复所需的最小状态字段或 CAS/lease guard；
4. Web / Android 已有 scheduler surface 为展示真实 handoff/result-return 所需的最小接线；
5. 与 partial load vector 现状冲突的注释、测试或 presentation 说明；
6. 新增针对本缺陷的 unit / integration / E2E / regression tests；
7. 对应 `mission-book/reports/UXI-391/**` 的报告、证据指针与最终回接记录。

## 禁止修改边界

- 不重做 UI shell、视觉风格、Rooms 布局；
- 不重写 RS-201/202/203/290 已冻结的核心契约语义；
- 不为了本任务采集完整 GPU / IO / network telemetry；
- 不把缺失 load dimension 填成 0；
- 不把 planner 本身改成隐式执行器：`planRoute()` 可以继续保持 pure / `executed:false`，实际 handoff 由调用方 orchestration 明确执行；
- 不新增新的 AI provider、设备发现协议、权限模型或泛化 checkpoint 框架；
- 不把 `WAIT` 的成功误宣称为“所有任意副作用任务都已支持无损迁移”；
- 不重新打开已经 COMPLETE 的历史 merge workbook；
- 不 cherry-pick `66fa201` 整提交作为快捷修复。

## 任务特有施工步骤

### Step 1 — Claim-time reconciliation

领取时重新读取：

- Digital-City 当前 `main`；
- Utopia 当前 `main`；
- UXI-301 / UXI-390 工作书与相关 reports；
- `66fa201` 与 Utopia main 的 diff；
- 当前 main hosted CI。

记录 `development_baseline_sha`。建议分支：

`uxi/UXI-391-remote-handoff-closeout`

若 main 已前进，必须从 claim-time main 开始，不能从旧的 `d0507b0` 强行施工。

### Step 2 — 记录纠错与五维变量清理

最小修正以下事实：

- 删除/改正“City only has one task type”或同义错误记录；
- 删除/改正“必须有完整五维 load vector 才可成为 alternate”的过时推论；
- 保留 partial vector 的 fail-honest 语义；
- 加载维度缺失必须继续可见为 unobserved；
- 为这些语义补回归测试，防止以后又被改回“缺失=0”或“非五维完整=不可用”。

不得修改历史报告来伪装它们当时没有写错；需要用**erratum / correction record** 追加纠正，并保留旧证据可追溯。

### Step 3 — 单机双 Node 可重复 E2E

必须使用**隔离 runtime namespace/store**，避免历史任务影响 claim 顺序。

场景必须围绕**同一个 target WAIT task**构造，不再使用“WAIT 占 A，然后创建第二任务让 B 抢走”的错误顺序：

1. 启动 Gateway；
2. 只启动 Node A；
3. 创建 target `WAIT`；
4. 明确等待并断言：
   - target state = `RUNNING`
   - target `assignedNodeId = A`
   - 已持续到可观测窗口，不接受几十毫秒假持有；
5. 只停止 Node A worker/agent，保持 Gateway 和原交互 surface 存活；
6. 此后再启动 Node B；
7. scheduler 必须基于真实状态产生 switch offer，而不是测试脚本注入结果；
8. 驱动真实用户选择/拒绝路径；
9. planner 到达 `ALTERNATE_DEVICE` / presentation 到达 `REMOTE_HANDOFF`；
10. orchestration 必须真正执行一次受保护的 A → B ownership transfer/reassignment；
11. Node B 对**同一个 task id** 接续执行，不能偷偷创建第二个 replacement task；
12. task 最终进入真实 terminal success；
13. 结果从真实 backend truth 回到原本仍打开的 Web/Android surface；
14. UI 不得泄漏 raw scheduler token。

必须有 anti-vacuity assertion：

- A 确实曾运行 target；
- A 的 worker 确实停止；
- B 是在 target 已属于 A 之后才上线；
- ownership 真的从 A 改到 B；
- 完成的仍是原 task id；
- result-return 是 UI 从 backend 重新读取到的，不是 harness 自己打印的。

### Step 4 — Ownership transfer 的最小实现原则

若当前代码只有 route decision、没有执行桥：

- 保持 `planRoute()` 为 pure planner；
- 新增/修正一个明确的 orchestration 消费点；
- transfer 必须使用现有 task truth + guarded compare-and-set / lease-equivalent 语义，避免 A/B 同时执行同一 task；
- transfer 只能发生在明确的 route stage + user intent 满足时；
- 不允许 UI 自己重算或挑选设备；
- transfer/recovery 失败必须保持非终态或明确失败，不能伪造 `COMPLETED`；
- 本任务以 `WAIT` 证明 ownership transfer 与 result return；不要借此扩大到所有副作用任务的 exactly-once 保证。

### Step 5 — 单机回归与 hosted CI

至少覆盖：

- five task types 协议事实；
- WAIT 可稳定持有节点；
- partial load vector；
- missing dimension != zero；
- saturated observed dimension binds；
- target task A → B ownership change；
- no duplicate execution / no duplicate terminal completion；
- switch offer / decline / alternate / remote handoff term；
- result return；
- 既有 Web/Android scheduler parity；
- root repository regression。

Development 完成前必须有 exact-head hosted CI success。

### Step 6 — 双实体主机最终验收

Development 释放后，由另一主机承担 Review，并与开发主机完成一次真实 Alien + Mech 验收。

推荐顺序：

1. 开发主机运行 Gateway + 原交互 UI + Node A worker；
2. target WAIT 已 RUNNING 且 assigned A 后，停止 **Node A worker**，不关闭 UI/Gateway；
3. 复核主机启动 Node B；
4. 在原交互 UI 驱动真实 switch/decline 路径；
5. 观察并证明 target task ownership A → B；
6. B 执行完成；
7. 原交互 UI 无需移动到 B 即看到完成结果；
8. 复核主机独立检查 negative cases：
   - B 不可用；
   - 重复 handoff 请求；
   - stale assignment / stale lease；
   - A 恢复时不能与 B 双执行；
   - 未测量 load 不能伪造成 idle；
9. Review 可直接修复 in-scope defect；若修改代码，必须产生新 review head 并重新跑 required CI。

最终报告至少记录：

`development_head / development_ci / review_head / review_ci / physical hosts / target task id / A→B ownership evidence / result-return evidence / remaining limitations`

### Step 7 — Merge 到 Utopia main

只有以下全部满足才允许 merge：

- Development complete；
- 独立 Review complete；
- 单机双 Node E2E PASS；
- Alien + Mech 真实双机验收 PASS；
- exact review head hosted CI PASS；
- merge 前重新 fetch 最新 Utopia main；
- 若 main 漂移，按照常驻规则 refresh integration 并重跑受影响验证；
- main merge 后 hosted CI PASS。

完成后标记：

`REMOTE_HANDOFF_CLOSEOUT_REPAIRED`

并明确写出：

- UXI-390 的阶段接受没有被撤销；
- 原 remote handoff deferred seam 现在是否真正 CLOSED；
- 五维 load 的实际支持仍是 partial observation，不宣称完整五维 telemetry。

## 自动回接其他合并工程书（MANDATORY POST-CONDITION）

**UXI-391 完成不等于施工主机可以停止。**

当且仅当 Step 7 main CI 绿并写入 terminal marker 后，执行主机必须立即进行一次新的 control-plane rescan：

### 扫描集合

扫描 Digital-City 最新 `main` 中、`mission-book/finished/**` 之外的：

1. 文件名包含 `MERGE_WORKBOOK` 的工作书；
2. frontmatter 中 `merge_authority: true` 且状态未终态的工作书；
3. 当前 active programme 明确声明的 integration / merge / closeout workbook。

### 自动回接规则

- 已 `COMPLETE` / 已位于 `finished/` 的历史 merge workbook **绝不重开**；
- 对每个未完成 candidate 重新计算 dependencies，不沿用 UXI-391 开工前的旧可领取结论；
- 若只有一个满足依赖且当前主机有资格，**立即原子领取并继续执行**；
- 若有多个满足条件，按显式 dependencies → phase/sequence → 当前 programme merge order 选择，不凭文件名猜；
- 若当前主机因双机独立性/硬件/角色约束无资格，写明 `STRUCTURALLY_INELIGIBLE` 并触发/留下对合格主机的 wake condition；
- 若只是等待 CI / 另一主机完成，则按 `TEMPORARILY_UNCLAIMABLE` 处理，事件优先、约 20 分钟仅作兜底；
- 若没有任何 active merge candidate，必须继续按 `CONSTRUCTION_RULES.md §5` 对整个池分类；只有全池真实终态才能写 `POOL_TERMINAL`。

### 禁止的“假自动回接”

以下不算回接：

- 只在 UXI-391 报告里写一句“后续可继续 merge”；
- 直接跳去一个旧 merge branch 而不重新 fetch main；
- 重新执行已经 COMPLETE 的历史 programme merge；
- 因为当前主机无资格，就把整个池写成完成；
- 为了让某个 merge workbook 可领取而修改其依赖或成功定义。

### 必须留下的回接记录

`mission-book/reports/UXI-391/POST_COMPLETION_REENTRY.md`

至少包含：

```text
uxi391_terminal_marker
utopia_main_sha
utopia_main_ci
digital_city_main_sha
merge_candidates_scanned
eligible_now
temporarily_unclaimable
structurally_ineligible
external_blocked
next_claimed_workbook
next_claim_host
wake_condition
pool_classification_if_no_claim
```

如果成功领取下一本 merge workbook，该记录必须写入它的 workbook id 和 claim commit；如果没有领取，则必须写出符合 §5 的 typed reason。

## 任务特有独立复核

Review 主机不得只读报告签字，至少需要独立完成：

- 重新构造一次 target WAIT 的 A → B handoff；
- 独立验证 partial load，不使用开发主机生成的固定 fixture 作为唯一依据；
- 至少一个 stale/duplicate transfer negative control；
- 核对 same task id、ownership history 与 terminal result；
- 核对 UI result-return；
- 核对 exact-head CI；
- 核对 UXI-391 完成后的 POST_COMPLETION_REENTRY 是否真的发生。

## 完成门槛

只有全部满足才能设置：

`development_complete: true`  
`review_complete: true`  
`status: COMPLETE`

门槛：

1. 错误前提已有 append-only correction；
2. five-dimensional load 语义与代码/测试一致；
3. 单机双 Node handoff E2E PASS；
4. 实际 ownership transfer 发生；
5. same task id 在 B 上继续并 terminal；
6. result 回到原 surface；
7. Alien + Mech 双实体主机最终验收 PASS；
8. exact review-head CI PASS；
9. Utopia main merge + main CI PASS；
10. `REMOTE_HANDOFF_CLOSEOUT_REPAIRED` 已记录；
11. `POST_COMPLETION_REENTRY.md` 已生成；
12. 已自动领取下一本可执行 merge workbook，或给出符合常驻规则的 typed zero-claim 分类。

## Reports / Utopia evolution 记录

City 只保存控制面报告、结论、SHA/CI 指针与最小必要文本证据；大体积运行原始证据继续留在 Utopia：

- `mission-book/reports/UXI-391/DEVELOPMENT_REPORT.md`
- `mission-book/reports/UXI-391/REVIEW_REPORT.md`
- `mission-book/reports/UXI-391/POST_COMPLETION_REENTRY.md`
- Utopia: `evidence/raw/mission-book/UXI-391/**`

需要保留本轮作为论文/系统演进素材的关键事件：

- “看似不可构造的 handoff”其实源自测试选择了错误 task type；
- 五维 load contract 与实际 partial telemetry 的错位如何制造了错误的系统限制判断；
- 第二版场景又因 assignment ordering 让 free B 抢到第二任务，证明测试场景本身也需要 anti-vacuity；
- pure planner 与 execution bridge 分离后，如何用 guarded ownership transfer 实现真实 handoff；
- closeout task 完成后通过 control-plane rescan 自动回接 merge workflow，避免一个局部收尾让长期任务池再次静默停住。

## 绑定常驻规则

本工作书自动继承 `mission-book/CONSTRUCTION_RULES.md` 的原子领取、双机独立、等待/唤醒、20 分钟兜底重扫、external reconciliation、exact-head CI/evidence、no-idle、no-make-work、integration refresh 等规则。

本工作书额外增加两条更严格规则：

1. **Development 单机优先，Review/最终物理验收双机；禁止为了“并发”人为拆出两个同时修改 handoff 核心的开发分支。**
2. **终态后的 merge-workbook 自动回接是 completion gate，不是可选建议。**
