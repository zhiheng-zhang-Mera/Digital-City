> 阅读译本 / Reading translation。原文件仍是权威历史记录；本文件不新增任务状态或权威元数据。代码证据块逐字保留，说明全文翻译。

[原文 / Source](../REVIEW_ADDENDUM_MECH.md)

# RS-290 — Mech 复核补充：步骤 5、门禁审计及原始观察的 E2E 验证

```text
REVIEWER = Mech   REVIEWED HEAD = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529
VERDICT  = unchanged — DEFECTS FOUND (F1-F3), NOT REVIEW_COMPLETE
```

接续 `REVIEW_FINDINGS_MECH.md`。本补充完成该记录明确列出的两项待检内容：步骤 5 的空洞断言检查、完成门禁审计；另增加此前没有尝试的验证：读取恢复证据的观察序列，而非摘要布尔值。

## 步骤 5 — 矩阵是真实组合，但有一个不会失败的断言

结构检查而非复述作者说明：矩阵从三个组件导入 8 个模块，RS-201 的 `registry`、`availability`；RS-202 的 `pressure`、`routing`、`rescan`、`hysteresis`、`assignment-guard`；RS-203 的 `createReturnBridge`。六项测试含 36 个断言，连同一致性套件共 21/21 通过。每项至少跨两个组件，因此证明组合、而非重跑组件套件的主张成立。步骤 5 指定的五个区域全部存在：并发、lease/幂等性、离线/重连、provider flap、端到端组合。

**一项低严重性观察。** 测试 5 中：

```js
for (const entry of dto.providers) {
  assert.ok(entry.class === 'PERMITTED' || entry.class === 'STRUCTURAL' || entry.class === 'RESOURCE' || entry.class === 'KNOWLEDGE');
  assert.equal(typeof entry.resolves_by_waiting, 'boolean');
}
```

`entry.class` 来自 `TERM_CLASS[term]`，该表所有值按构造就是四种字符串之一；`entry.resolves_by_waiting` 被赋值为 `TERM_CLASS[term] === 'RESOURCE'`，始终是布尔值。此断言对 projection 接受的任何输入都不可能失败，因此没有增加保护，只重述表形状而非测试行为。所在测试仍有强断言：末尾检查准确的 11-key DTO 表面。因此这是测试强度不足，不是产品缺陷。既然审查对作者采用“不会失败的测试不是证据”标准，也必须对通过的部分采用同一标准。

## 完成门禁审计 — 逐项对照证据而非作者摘要

| 门禁项 | 裁定 | 根据 |
|---|---|---|
| RS-201/202/203 开发及复核完成 | **MET** | 三者 frontmatter 均 `REVIEW_COMPLETE`，复核者独立 |
| 统一调度词汇（步骤 2） | **MET WITH FINDINGS** | 已交付一个对来源闭合的词汇；F3 显示一个含义被折叠、标题性质未被断言 |
| 步骤 3 呈现 DTO | **MET WITH FINDINGS** | DTO 存在，26 个术语输出完备；F1 与 F2 是其中缺陷 |
| 并发、恢复、幂等性为绿 | **MET** | 上述矩阵确实跨组件 |
| 真实双设备 E2E，两条路径 | **MET** | CI 绑定及下述证据验证 |
| 步骤 6 刷新与完整 CI | **MET** | main 未偏离领取时基线，实测漂移为零；精确 head 上 CI 为绿 |
| 步骤 7 合并与 `RESCHEDULING_BASELINE_FROZEN` | **WITHHELD** | 正确地等待本次 Review |

除了依赖本次审查裁定的两处，门禁均满足；而裁定是存在三个缺陷。因此不能在 `2a3ae30` 解除门禁。

## 通过原始观察验证恢复证据

这是审查最强的独立检查，因为将主张与底层记录对比，而非接受 `success: true`。三次均已解码：

```text
run 1  offline 02:20:02.357Z  restore 02:20:02.362Z  online 02:20:12.155Z
  obs[0] android=["ONLINE","ONLINE"]  web=ONLINE  webNode=OFFLINE
  obs[1] android=["ONLINE","OFFLINE"] web=ONLINE  webNode=OFFLINE   <- offline condition met here
  obs[2] android=["ONLINE","ONLINE"]  web=ONLINE  webNode=ONLINE    <- recovery condition met here
```

第二、第三次形状相同。发现：

- 序列确实包含离线、在线观察；每行 `success` 都等于序列支持的 `sawOffline && sawOnline && historyPreserved && cityIdentityPreserved`，三次均独立计算。因此摘要布尔值忠实于底层记录，这是应验证的性质。
- 每次都满足 `offlineObservedAt < restoreAt < onlineObservedAt`。
- 对 `kind: 'node'`，pilot 的离线条件同时要求 `android.includes('OFFLINE')` 与 `webNode === 'OFFLINE'`；只有 `obs[1]` 同时满足，离线时间戳就在此处。恢复条件要求两个 `ONLINE` 标签、没有 `OFFLINE`、两表面均 `ONLINE`，只有 `obs[2]` 满足。因此通过并非宽松谓词造成。
- 三次观察中 `web` 始终 `ONLINE`，而 `webNode` 翻转。这正确：Web 页面连接 chip 跟踪 gateway，后者没有下线；设备卡 badge 跟踪确实下线的 node。
- `offlineObservedAt` 与 `restoreAt` 约 5 ms 间隔是设计而非竞态：pilot 记录离线时间后立即调用 `restart`，因此该间隔测量自身转换，而非停机持续时间。

**一项证据强度观察，不是缺陷。** 成功路径 `task-regression.json` 仅有摘要：布尔标志、七事件生命周期、artifact hash，没有观察序列，不能像恢复路径一样核对布尔值与原始数据。既然恢复路径已携带观察，对成功路径采用同样做法可令两半同等可审计。这只是建议，不是门禁失败；工作簿要求实际运行 E2E 并以可查看形式发布，已做到。

## 处置不变，并交由 Owner

三个发现仍成立，修复后需要移动 `review_head_sha` 并重审。

**有一个决定不属于我。** §12 要求角色边界变化由 Owner 裁定或新工作簿覆盖；此处可能需要，因为修复属于开发主机，而 Alien 自发现发布以来尚未回应。§3 确实允许 reviewer“直接修复范围内缺陷”，所以我可以修复，但这样 reviewer 就编写了制品的一部分，而 §3 的目的正是由未编写制品的主机作裁决。因此我不单方面选择，将以下选项交给 Owner：

1. Alien 在 `2a3ae30` 修复，保持主机独立，但需要 Alien 行动；或
2. Mech 根据 §3 的明确许可修复，记录独立性限制，最终裁决由没有编写修复的主机作出；或
3. Owner 裁定这些发现不在冻结范围，接受 `2a3ae30`，将 F1–F3 记录为已知限制。

推荐 1；仅在 Alien 不行动时退到 2。尤其 F1 比什么都不做产生更糟用户结果，不应原样冻结。
