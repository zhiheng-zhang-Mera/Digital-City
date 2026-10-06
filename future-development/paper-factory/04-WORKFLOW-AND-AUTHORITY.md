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

## 中文完整说明 / Complete Chinese explanation

### 1. 独立生命周期

研究从索引/信号/分诊/Owner 选择，到证据准入/冻结/分析/核心评审，再专项构建/预检/等待 Owner 发布。每步允许 WAITING_INPUT、POLICY_UNRESOLVED、NARROWING、MERGED_INTO_OTHER、RETIRED 或证据失效返回；信号不自动开稿。

投稿从草稿包/批准包/发送请求到真实提交回执/审稿，再修订/拒绝/录用/确认撤回，最后 camera-ready 或公开记录。发送请求无确认时状态 SUBMISSION_STATE_UNKNOWN，不能标失败或已提交，重试前核对门户邮件；内部绿灯或预测不产生 ACCEPTED。预印本有独立版本化发布流程（草稿、作者批准、真实编号版本、纠正替换、平台允许的撤回），不推进同行评审状态。

### 2. 批准边界

论文家族须选题范围批准；新验证须实验资源数据权限预算批准；选刊须目标/类型/工作流/模式/最高成本；作者须真实贡献和全体同意，声明由人确认；公开须确切包/身份/数据范围/许可/目的地；投稿须目标阶段哈希政策快照冲突重叠检查；付款撤稿改作者须独立权限，不从写作许可推断。

批准绑定内容政策哈希和动作类型，实质事实变化使相关批准失效。Owner 不能覆盖出版商禁令、编造同意或未取得的伦理批准。事务预检可自动，法律版权伦理保证仍需真实人工决定；未变内部步骤无需重批。

### 3. 非阻塞调度

集成时复用任务基础设施，否则有界本地 manifest 队列即可。每作业包含幂等键、不可变输入、lease/heartbeat、超时重试预算、输出回执依赖。文献访问付款Owner长分析只阻塞该候选阶段，其他授权工作继续，不建全城同步批准循环。独立取证检索格式检查可并行，等待释放主机；模型可取消有预算，不因任务池仍有候选制造无限工作。

### 4. 投稿并发

登记锁针对活跃同行评审中实质重叠论点家族，不只标题。可起草多个方案，外部同时投稿遵守实际政策，保守默认一个重叠评审尝试。预印本另查。拒绝/确认撤回解锁转投决定，不自动发送。标题变化不能规避一稿多投，共用数据不自动否定独立问题；贡献重叠歧义由人工处理。

### 5. 收敛

评审前声明门禁、预算、停止条件。无支持主张、错数、必需来源文件缺失、隐私身份泄露、政策冲突是关键缺陷；可选改进另列。关键项通过修复、缩窄、允许的披露或停止处理；加基线建议不自动强制。预算耗尽仍有关键缺陷则保持阻塞并给最短路径；非关键入未来工作。不绕过硬缺陷、不自动升级新工程。

### 6. 审计

有界回执记录决定者/角色、输入版本、finding/来源、备选、动作、批准、输出身份。只留可核查依据和结果，不留隐藏推理。投影同时显示最近完成阶段和当前阻塞，不把整体汇总为绿色。
