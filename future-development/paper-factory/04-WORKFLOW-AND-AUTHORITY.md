# Workflow and Authority / 状态机与权限

## 1. Two independent lifecycles / 两条生命周期

Research lifecycle / 研究:
```text
INDEXED -> SIGNAL -> TRIAGED -> OWNER_SELECTED
 -> EVIDENCE_ADMITTED -> FROZEN -> ANALYZED -> CORE_REVIEWED
 -> VARIANT_BUILT -> PREFLIGHT_PASSED -> AWAITING_OWNER_RELEASE
```
Every stage also permits a local `WAITING_INPUT`, `POLICY_UNRESOLVED`, `NARROWING`, `MERGED_INTO_OTHER`, `RETIRED` or evidence-invalidated return. There is no automatic transition from a signal to writing a paper. / 每阶段可等待、缩窄、合并或退休；发现信号不自动开稿。

Publication attempt / 投稿尝试:
```text
DRAFT_PACKAGE -> APPROVED_PACKAGE -> SEND_REQUESTED
 -> SUBMITTED_RECEIPT -> UNDER_REVIEW
 -> REVISION_REQUESTED | REJECTED | ACCEPTED | WITHDRAWN_CONFIRMED
 -> CAMERA_READY | PUBLISHED_RECORD
```
`SEND_REQUESTED` without confirmation becomes `SUBMISSION_STATE_UNKNOWN`, not FAILED or SUBMITTED. Reconcile the portal/email receipt before retrying. An acceptance prediction or green internal review never produces ACCEPTED. / 超时先核对回执，不能重复投；审稿状态需真实外部证据。

Preprints use a separate versioned disclosure lifecycle: draft, author-approved, posted identifier/version, corrected/replaced, withdrawal record where supported. They do not advance peer-review status. / 预印本发布不等于同行评审录用。

## 2. Approval boundaries / 审批边界

| Decision / 决策 | Required approval / 授权 |
|---|---|
| Start manuscript family / 开始论文家族 | Owner selects question and bounded scope. |
| Additional validation / 新实验 | Explicit experiment, resource, data-rights and budget approval. |
| Select venue / 选刊 | Target, article type, likely workflow, publication mode and maximum authorized cost. |
| Author metadata / 作者信息 | All authors' real contributions/consent; human confirmation of declarations. |
| Public disclosure / 公开发布 | Exact package, identity exposure, data scope, license and destination. |
| Submit / 投稿 | Exact target, stage, payload hashes, policy snapshot, conflict/overlap check. |
| Pay, withdraw, change authors / 付款撤稿改作者 | Separate explicit authority; never inferred from generic writing permission. |

Approvals bind to content and policy hashes plus action type; changed material facts invalidate affected approvals. Owner cannot override publisher prohibition, fabricate consent or certify ethics approval never obtained. A clerical preflight may be automated; personal legal/copyright/ethics attestations remain truthful human decisions.

授权绑定具体内容和动作，不是“做论文”一次同意就代签全部声明。证据/目标/作者/费用/许可变化后重新确认对应部分；不需要重批未变化的纯内部步骤。

## 3. Nonblocking scheduling / 非阻塞调度

Use existing task infrastructure when integrated; otherwise a bounded local manifest queue suffices. Every job has idempotency key, immutable input refs, lease/heartbeat, timeout, retry budget, output receipt and dependencies. Waiting for literature access, payment, Owner or a long analysis blocks only that candidate/stage. Continue unrelated allowed jobs. No citywide synchronous approval loop.

可独立运行的检索、取证与格式检查并发；等待不占执行主机。模型调用有预算和取消，确定性规则优先。不能用“任务池还有候选”制造无限工作。

## 4. Submission concurrency / 投稿并发

A publication registry locks substantially overlapping claim families across active peer-reviewed attempts, not merely identical titles. Drafting several alternatives is allowed. External simultaneous submissions follow each venue's actual policy; conservative default is one live overlapping peer-review attempt. Preprint coexistence is separately checked. A rejection or confirmed withdrawal unlocks a retargeting decision, not an automatic send.

反复改标题不绕过一稿多投；也不因共用同一数据集就否决真正独立的问题。锁的对象是贡献/论点重叠，人工处理歧义。

## 5. Stop governor / 收敛规则

Before review, declare required gate set, review budget and stop conditions. Distinguish submission-critical defects (unsupported claim, wrong number, missing required source/file, privacy/identity breach, policy conflict) from optional improvements. Resolve critical findings by repair, narrowing, disclosure where allowed, or stopping the affected submission. A request to add another baseline is not automatically mandatory.

复检预算耗尽后，未解决关键问题保持阻塞并给出最短修复路径；非关键建议进入未来工作，不无限循环“再审一次”。No automatic bypass for hard defects, and no automatic escalation into new engineering.

## 6. Audit trail / 审计

Record decisions as bounded receipts: who/which role decided; inputs/version; findings and source references; alternatives; action; approval; final output identity. Do not store hidden reasoning. Status projections must show both last completed stage and current blocker, not summarize everything as green. / 审计记录可核查依据和结果，不保存私有思维链。
