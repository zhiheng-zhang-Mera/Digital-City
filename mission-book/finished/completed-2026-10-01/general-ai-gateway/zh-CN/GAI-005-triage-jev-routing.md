> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../GAI-005-triage-jev-routing.md) 的原始 frontmatter 是唯一元数据来源。

# GAI-005 — 确定性与 JEV 分类路由

## 目标

增轻量 semantic traffic-control layer，不让 LLM/JEV 成为基础 Utopia routing 必需依赖。

## 开发范围

- deterministic/local routing 保持第一优先。
- 定义并使用 optional JevTriagePort。
- JEV output 规范为 intent、complexity、risk、confidence、needsGeneralAI、preferredChannel recommendation。
- JEV 只能 classify/score/route/flag ambiguity/recommend escalation。
- Gateway policy 而非 JEV 作最终 execution/admission decision。
- low-confidence/unavailable JEV fallback 到 deterministic candidate/manual picker。
- complex engineering intent 经 typed future/available Engineering route/port 路由到 GAI 外，不让 GAI 变 engineering executor。
- side-effect/destructive intent 仍受既有 Utopia confirmation/permission boundary。

## 范围外

- 训练或拥有 JEV；
- 授 JEV credential、task lease、直接 Computer Use authority；
- 替代 Butler assistant identity/brain；
- 用 JEV 当 canonical task/action truth。

## 必须验收

- known deterministic command 不调用 JEV 或 general-AI provider；
- ambiguous lightweight text 可在 available 时用 JEV；
- JEV unavailable/timeout/malformed output 不阻塞；
- JEV 不直接执行 Action 或授 permission；
- HARD/engineering classification 不静默将 General AI 当 coding worker 调用；
- route recommendation 与 final chosen route 分别可审计。

## 共享执行规则

- 从精确冻结 GAI baseline 创建分支，不从同级 GAI 分支创建。
- Development 和 Correction 必须由不同物理宿主（Alien / Mech）执行。
- Development 推送任务分支，不合入 Utopia main。
- Correction 独立复检并直接修复同分支，也不合入 main。
- worker 不得等待同级 GAI；缺实现时用 programme README 稳定 port 和确定性 test double。
- worker 不得仅为本地测试通过而 merge/cherry-pick 同级 GAI 分支。
- hosted CI 或 external check 运行时，继续独立范围内 tests/docs/evidence 或另一合资格 task/worktree，不闲置。
- 缺 external provider / Remote Fabric 只阻塞真正需要它的验收步骤，不改写为成功，不停滞无关 GAI。
- report 用精确 task ID 放于 `mission-book/reports/${MISSION_ID}/`。
- 禁止 Boss access：不对 Codex-Boss clone/fetch/read/import/submodule/symlink/runtime call，不产生 build dependency。历史名称仅可作为 provenance 说明，执行行为必须归 Utopia 拥有并测试。

## 全局跨项目不闲置规则

本任务参与 `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md` 定义的规范性全局 BA/RF/GAI/EM pool。

- 当时 Alien、Mech 均可用，Development 可立即领取。
- Development 绿色后 Correction 立即合资格，必须由对侧物理宿主执行。
- 普通 claim truth 只写本工作书 frontmatter/reports；README/MISSION_INDEX 不是 claim lock。
- hosted CI、real-provider login、长测试、Remote Fabric 等待不闲置宿主。保留 claim，记录精确 seam，在独立 worktree 领取另一合资格全局阶段。
- 缺 Remote Fabric 时，组件工作用稳定 RemoteExecutionPort double；真实跨设备证明属于项目集成。
- 只有新全局扫描发现无可执行 owned repair、无合资格对侧 Correction、无未领取 Development 后，宿主才停止领取。
