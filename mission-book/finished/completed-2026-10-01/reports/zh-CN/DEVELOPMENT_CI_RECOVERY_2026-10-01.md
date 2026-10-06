# 开发 CI 恢复记录：剩余五项 Engineering/Assistant 任务（2026-10-01）

[English authoritative source / 英文权威原稿](../DEVELOPMENT_CI_RECOVERY_2026-10-01.md)

本文件是历史报告的完整中文阅读译文，不构成新的阶段声明，也不代表重新运行验证。状态、时间、SHA、运行编号与结论均保留原稿的历史含义。This is a reading translation of the historical report, not a new stage declaration or a fresh verification run.

主机：Alien（Correction 主机）。目的：记录任务池中五项任务已经解决的外部接缝。这些任务的 Development CI 曾因 GitHub 账户账单阻断而被拒绝运行；本记录使其 Correction 资格可以审计。

## 已验证事实（读取自 GitHub，而非推断）

所有记录中的 Development head 仍然是已推送分支的顶端。工作簿把同一个运行 ID 记录为 `BLOCKED_GITHUB_ACCOUNT_BILLING`，但这些运行后来均已以 **success** 结束，而且两个作业都执行了真实步骤。原稿通过 `gh run view <id> --json jobs` 读取这些事实。下表保留分支、SHA、运行编号、作业步骤数和结论原值；Task 为任务，Branch 为分支，Development head 为开发提交，Run 为运行，Jobs 为作业，Conclusion 为结论。

| Task | Branch | Development head | Run | Jobs | Conclusion |
| --- | --- | --- | --- | --- | --- |
| BA-007 | `assistant/BA-007-settings-interaction-surface` | `8fa4686bb7acb2b57a34a00fe517f6ecaad9769f` | 36752540378 | gateway-web 15 steps, android 12 steps | success |
| BA-009 | `assistant/BA-009-duty-permission-policy` | `9e1de31ba53766758406e991dbacdb8f707b1bfc` | 36750981300 | gateway-web 15 steps, android 12 steps | success |
| GAI-009 | `general-ai/GAI-009-utopia-surface-integration` | `8dfdf9edcf6f525797de964650b383a916271371` | 36753891511 | gateway-web 15 steps, android 12 steps | success |
| EM-012 | `engineering-manager/EM-012-connector-sdk-claude-workbuddy` | `364c5160952039d31074af3bfae843c1d0f4be24` | 36751919772 | gateway-web 15 steps, android 12 steps | success |
| EM-013 | `engineering-manager/EM-013-utopia-task-surface-integration` | `5920e8076d317e15142b7d16c8531e529ce587f0` | 36753243377 | gateway-web 15 steps, android 12 steps | success |

各运行于 2026-09-30 17:23–17:47Z 创建，并于 2026-09-30 23:55Z 完成，即在 Owner 清除账单拒绝之后。`git ls-remote origin` 确认每个分支的顶端都等于已记录的 head SHA，所以没有 rebase 或 force-push 移动这些提交。

## 因而 mission-book 中哪些内容已经过时

五项任务的工作簿 frontmatter 当时仍然如下：

```text
development_status: IN_PROGRESS
development_complete: false
development_ci: <run-id>-BLOCKED_GITHUB_ACCOUNT_BILLING
correction_status: NOT_STARTED
```

`-BLOCKED_GITHUB_ACCOUNT_BILLING` 后缀描述的外部接缝已经不再存在，被阻断的 Development head 也已验证为绿色。在所记录的 head 上，资格条件中的 Development **CI** 部分已经满足；Development **阶段声明**（`development_status: COMPLETE`、`development_complete: true`）则应由 Development 主机 Mech 写入，而当时尚未写入。

## 为什么 Alien 没有领取这五项 Correction

`mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md` 第 2 节规定：只有 Development 已绿色／完成，且仅另一台物理主机，才具备 Correction 资格。第 3 节补充，领取提交必须只更新目标阶段字段。Alien 不能替另一台主机写入阶段事实：在 Mech 分支上翻转 `development_status`／`development_complete` 会伪造 Development 主机的声明，而双主机门槛恰恰用于防止这种情况。Alien 也没有触碰这五个分支：没有 push、force-push，也没有重新运行任何会改变 head 的操作。

## 解决过程（事后记录）

提交 `da309a6 reconcile(control): close billing recovery state and record control-plane lag` 在控制平面上关闭了五项任务的 Development 阶段：

```text
development_status: COMPLETE
development_complete: true
development_ci: <run-id>-success-attempt-N     (same run IDs as the table above)
correction_status: NOT_STARTED
```

因此 Development 主机的声明已经存在，接缝两端都已关闭，**五项 Correction 全部变为另一台主机 Alien 可以领取的任务**。无需记账例外，实际也没有采取例外：Alien 没有写入任何 Development 字段。随后五项任务被逐一领取和纠正，每项都有自己的报告（`mission-book/reports/<ID>/CORRECTION_REPORT.md`）及跟踪提交。

## 扫描时刻的零领取遥测（契约第 5 节）：已被上述解决过程取代

```text
classification:              TEMPORARILY_UNCLAIMABLE
claimable_now:               0
potentially_claimable_later: 5  (BA-007, BA-009, GAI-009, EM-012, EM-013)
reason:                      Development stage not declared complete by the Development host
external seam:               RESOLVED (hosted CI green at every recorded head)
blocked_on:                  Mech's Development completion declaration for these five tasks
```

代码块的含义是：分类为暂时不可领取，当前可领取数为 0，稍后可能可领取数为 5，原因是 Development 主机尚未声明阶段完成；外部接缝已解决，所有记录的 head 都有绿色托管 CI，仍等待 Mech 为这五项任务声明 Development 完成。

按契约第 5 节，`TEMPORARILY_UNCLAIMABLE` 允许进行有界的再次进入扫描（默认间隔 20 分钟），而不是终止，因为另一台主机完成工作可以使任务稍后具备资格。实际发生的情况正是如此：这份记录还不到一分钟，控制平面的 reconcile 就已到达。

## 本记录捕获的权威边界

Alien 本可以自己写入五项 Development 声明并更早开始，但没有这样做。原因是 `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md` 第 2 节只允许在 Development 绿色／完成之后进行 Correction，而第 3 节要求领取提交只更新目标阶段字段。替另一台主机写入完成状态会伪造 Development 主机的声明，这正是双主机门槛所要防止的行为；即使底层全部事实（已推送 head、绿色运行、真实步骤）都可验证，而且在本记录中确实已验证，也不能越过这一边界。正确修复属于控制平面，并以 `da309a6` 到达。
