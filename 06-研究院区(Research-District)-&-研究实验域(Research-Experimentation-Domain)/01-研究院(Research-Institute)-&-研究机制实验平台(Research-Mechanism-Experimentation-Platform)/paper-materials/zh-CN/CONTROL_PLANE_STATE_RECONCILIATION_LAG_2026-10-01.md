# 论文素材——外部恢复后的控制面状态回填滞后

FACT: INCIDENT_ID=CONTROL-PLANE-STATE-RECONCILIATION-LAG-2026-10-01
FACT: TRIGGER=GITHUB_ACTIONS_BILLING_RECOVERY
FACT: FAILURE_CLASS=CONTROL_PLANE_STATE_RECONCILIATION_LAG
FACT: REPAIR_CLASS=AUTHORITATIVE_EXTERNAL_STATE_RECONCILIATION
FACT: DEVELOPMENT_GREEN_AFTER_RECOVERY=41/41
FACT: CORRECTION_COMPLETE_AT_RECONCILIATION=36/41
FACT: STALE_DEVELOPMENT_TASKS=5
FACT: STALE_TASK_IDS=BA-007,BA-009,GAI-009,EM-012,EM-013
FACT: STALE_DASHBOARD=true
FACT: EVIDENCE_POINTER_MISMATCHES=1
FACT: GAI005_WRONG_RUN=36746849199
FACT: GAI005_CORRECT_RUN=36746845955
FACT: REMOTE_FABRIC_COMPONENT_POOL_DRAINED=true
FACT: REQUIRED_EVIDENCE_BINDING=BRANCH+HEAD_SHA+CONCLUSION

## 观测

GitHub Actions 的 Billing 阻断解除后，原先被阻断的 run 已经在原 implementation head 上重新执行成功。也就是说 execution truth 已经向前推进，但控制仓库并没有自动同步推进。

5 个 Development 任务书在对应 run 已成功后，仍然保留 `BLOCKED_GITHUB_ACCOUNT_BILLING`；Mission Book 总览仍显示施工前的 `READY / all unclaimed`。另外，GAI-005 的 Correction frontmatter 指向了 RF-009 的绿色 run，而不是 GAI-005 自己的成功 run。

因此这里不是产品代码故障，而是**跨系统状态分叉**：

```text
GitHub Actions / Utopia 执行事实 = 已恢复、已绿
Digital-City 调度事实             = 旧 blocker / 旧 dashboard
一个 evidence pointer             = 虽然是绿灯，但属于另一个任务
```

如果调度器只读取过期的 City 状态，它可能错误地认为 Correction 仍不可领取，或者在 Remote Fabric 已经具备 programme integration 条件时仍然不唤醒合并阶段。

## 根因

控制面主要依赖 worker 自己提交状态更新。但外部状态——尤其是 Owner 修复账号/Billing 后触发的 re-run——可以在没有原 worker 再次提交 City 的情况下变化。

因此系统缺少一个从“外部权威状态”回到“Canonical scheduling metadata”的强制 **reconciliation edge**。

同时还存在 provenance 校验不足：仅看到“某个 run 是绿色”并不够，必须确认该 run 与任务的 branch 和 exact head SHA 一致。

## 修复

新规则：

> 外部故障解除并不等于恢复完成；只有控制面根据权威证据完成回填后，恢复才算闭环。

强制证据绑定：

```text
task branch == run head_branch
task head   == run head_sha
required stage terminal state == run conclusion/status
```

在外部 blocker 恢复之后，以及 programme pool drain、merge workbook 创建和最终终态判断之前，都必须运行 reconciliation。当前 blocker 字段可以修正，但历史失败/阻断 run 必须继续保留为事故证据。

## 论文价值

本事件支持一个更一般化的系统假设：

> 在异步工程控制面中，如果外部证据允许脱离 worker 提交而发生状态变化，仅依赖事件驱动的 worker 回写不足以保证一致性；基于权威源的事件触发/周期 reconciliation 可以降低假阻塞、错误资格判断和证据错配。

可测量指标包括：外部恢复到控制面回填的延迟、stale task 数量、stale blocker 持续时间、调度器错误无资格次数、evidence pointer 错配率，以及由状态滞后导致的 Owner 人工介入次数。
