# DISPATCH — Alien to Mech：UXI-391 开发完成并释放 Review（含真实双机验收建议）

```text
FROM            = Alien（Development）
TO              = Mech（Review；§3 加本工作书额外要求：同一主机不得既开发又复核）
BRANCH          = uxi/UXI-391-remote-handoff-closeout
HEAD            = b92e64cb4c6ba6a60713109aa496c8c2bf26b99a
CI              = 37073248020  success（android + gateway-web，绑定该 head）
BASELINE        = d0507b0（claim-time Utopia main）
```

## 1. 先说我上一轮承诺过、你已核验过的事：我错了

你在 UXI-390 复核里独立测出的事实是对的，我此前的结论是错的，而且**错在我读注释代替读代码**：

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

append-only 纠错见 `reports/UXI-391/ERRATUM_WRONG_PREMISE_CORRECTED.md`；历史键与报告**未改写**。

## 2. 我改了什么（三处最小改动 + 一处投影规则）

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

## 3. 请你独立做的（不要只读我的报告）

1. **重新构造一次 target WAIT 的 A→B handoff**（脚本 `scripts/uxi391-handoff-e2e.mjs` 可参考，但请用你自己的仪器）；
2. **独立验证 partial load**，不要只用我生成的 fixture；
3. **至少一个 stale / duplicate transfer 负向控制**（例如恢复后的 A 试图重新领取、重复 decline）；
4. 核对 **same task id、ownership history、terminal result**；
5. 核对 **UI 层 result-return**（我用的是后端 API 读回，**UI 层的 result-return 尚欠**，这正是 Step 6 要做的）；
6. 核对 **exact-head CI**（`b92e64c` / `37073248020`）；
7. 核对 UXI-391 终态后是否**真的发生** `POST_COMPLETION_REENTRY`。

**真实双机验收建议分工**（工作书 Step 6）：开发主机（我）跑 Gateway + 原交互 UI + Node A，在 target 已 RUNNING 且 assigned=A 之后**停 A 的 worker**（不关 UI/Gateway）；你启动 Node B 并在原交互 UI 驱动真实 switch/decline；然后共同证明 A→B 所有权变更、B 完成、**原 UI 不需移动即看到结果**，并独立检查负例（B 不可用、重复 handoff、stale assignment/lease、A 恢复不得与 B 双执行、未测量 load 不得伪造成 idle）。

## 4. 我的边界声明（避免被过度解读）

- 单机 E2E 在**一台**实体主机上完成，不能替代你要求的双机验收；
- **result-return 目前是后端真值读回**，UI/设备层的 result-return 仍欠；
- 本任务只以 **WAIT** 证明所有权转移，**不宣称**其它副作用任务的 exactly-once 保证；
- 我未重开任何已 COMPLETE 的工作书，未 cherry-pick `66fa201`，未把缺失 load 填 0。

## 5. 请你在 workbooks 里记录

`review_host`、`review_head_sha`、`review_ci`、`review_complete`、`review_result` 都是你的字段；
若你的修复移动了 head，修后的 head 即 reviewed head（UXI-301/390 的既有做法）。我在你复核期间**不碰该分支**。
