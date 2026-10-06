# SUSPEND-003 — Same-host Fresh Critic as Formal Review Substitute

**State:** PRESERVE_ONLY / CURRENTLY_FORBIDDEN_AS_FORMAL_REVIEW

## 必须保留的研究假设

同一实体主机上，如果使用：

- 独立 Agent/session；
- fresh-context first pass；
- 不同模型或不同 review strategy；
- 独立 test generation；
- structured evidence reconciliation；

它可能对部分 defect 提供很高认知独立性。

未来值得研究：在某些任务类别中，这种认知独立是否能达到与跨主机 Review 等价的 assurance，或者作为额外 Review layer 有明显价值。

## 当前为什么 suspend

现行 `CONSTRUCTION_RULES.md §3` 明确要求：

```text
Development + Formal Review
→ different physical hosts
```

并明确同机 fresh critic 只能做技术诊断，不能冒充 Formal Review。

因此当前：

- same-host critic = ALLOWED diagnostic；
- same-host critic = NOT Formal Review；
- 不得因 DGX/RIV 文件存在而自行升级资格。

## 唯一合法解冻路径

交给 [Review Independence v2](../review-independence-v2/README.md) 做受控评估。

只有 RIV-990 得到充分证据、形成显式 `CONSTRUCTION_RULES.md` migration patch 且 Owner 批准后，才允许改变现行门槛。

在此之前本文件只能作为 hypothesis/evidence-preservation note。


---

语言读本 / Reading translation: [English](en/SUSPEND-003-same-host-formal-review-substitution.md). 原文状态与证据具有权威性 / This source remains authoritative for status and evidence.
