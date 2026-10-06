> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../EM-005-attention-recent-device-alerts.md) 的原始 frontmatter 是唯一元数据来源。

# EM-005 — Attention 桥接与最近设备通知/响铃

## 目标

让阻塞 Engineering question 跟随用户，不困在 execution host，同时避免 notification storm 和 duplicate answer。

## 开发范围

- 定义 Engineering AttentionEnvelope 语义，投影至 canonical shared Attention state，不建 Engineering-only global notification database。
- 使用 shared projection/fan-out，结合 RF presence/device eligibility 和当前 Utopia interaction state，发送到当前及最近设备。
- actionable event 投影到当前 interaction device，notification/ring 副本到最近由用户操作的合资格在线设备；原始数量 literal 为 `2�?`，编码损坏不可据此猜测恢复。
- recent device 按真实 user interaction recency 排序，不按 uptime/heartbeat age。
- first-valid-ack wins，全局关闭 event，撤回/禁用其余 projection。
- 对 reconnect、heartbeat、page refresh、repeated connector delivery、retry 去重。
- 区分 permission、question、authentication、confirmation、device-action attention type。
- quiet/full-screen/protected-use policy 要求时 suppress sound，同时保留 visible notification。
- non-blocking informational event 默认不响铃。
- 无论哪个授权 device 回答，都将 response 送回原 connector/job。

## 范围外

- Remote Fabric transport internals；
- 最小集成外 OS-specific notification styling；
- automatic permission approval；
- 物理不可实现的 remote authorization bypass。

## 必须验收

- 多 projection 下一个 attention_id 仍只一个 logical question；
- eligible/online 时始终包含 current interaction device；
- 仅 configured 最近 eligible device 收 auxiliary alert projection，原数量 literal `2�?` 保留损坏来源，不猜值；
- 首 acknowledgement 原子/幂等关闭全部副本；
- 同 epoch duplicate/reconnect delivery 不再次响铃；
- quiet/protected device 可 suppress sound，不丢 event；
- platform 允许 mediation 时，non-execution device 回答恢复正确 originating job。

## 共享异步执行规则

- 从精确冻结 Engineering Manager baseline 创建分支，不从同级 EM 分支创建。
- Development 和 Correction 必须由不同物理宿主（Alien / Mech）执行。
- Development 推送任务分支，不合入 Utopia main。
- Correction 独立复检并直接修复同分支，也不合入 main。
- worker 绝不能等待同级 EM 任务；缺实现时使用 programme README 中稳定 port 和确定性 test double。
- worker 绝不能仅为本地测试通过而 merge/cherry-pick 同级 EM 分支。
- 等待 hosted CI、长本地测试、external login、provider check 时，继续独立范围内 tests/docs/evidence 或另一合资格 task/worktree，不闲置。
- 缺 Remote Fabric 或第三方 engineering software 不可用，只能阻塞真正外部验收步骤；记作 typed pending seam，不改写为成功，不停滞无关 EM 任务。
- report 按精确 task ID 放在 `mission-book/reports/${MISSION_ID}/`。
- DS-Hns 仅可按本项目描述的固定 donor 读取。复用实现成为带 provenance 的 Utopia-owned code；Utopia 不得取得对 DS-Hns repository 的 build/runtime dependency。
- Codex-Boss 不在范围内，本项目绝不能 clone、fetch、open、read、query、import、link、submodule、symlink 或调用它。

## 全局跨项目不闲置规则

本任务参与 `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md` 定义的规范性全局 BA/RF/GAI/EM pool。

- 当时 Alien 和 Mech 均可用，Development 可立即领取。
- Development 绿色即有资格 Correction，必须由对侧物理宿主执行。
- 普通 claim truth 只写本工作书 frontmatter/reports；README/MISSION_INDEX 是 dashboard，不是 lock。
- hosted CI、长本地测试、provider check、Remote Fabric 等待绝不闲置设备。保留 claim，使用独立 worktree 领取另一合资格全局阶段。
- 缺 Remote Fabric 或 optional provider software，用稳定 port/double 和明确 deferred integration seam 表示；组件工作不等待。
- 只有新扫描 BA/RF/GAI/EM，确认无可执行 owned repair、无合资格对侧 Correction、无未领取 Development 后，宿主才停止领取。
