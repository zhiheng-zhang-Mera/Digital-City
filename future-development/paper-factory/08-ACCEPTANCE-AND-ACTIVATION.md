# Acceptance and Activation / 未来验收与启用

**These are planned acceptance cases, not tests executed by this documentation change. / 下列是未来测试要求，不是本次已跑产品测试。**

## 1. Deferred activation / 延后启用

This folder records the architecture only. Do not create claimable implementation tasks, alter mission progress, start collection daemons, run experiments or enable submission adapters from its presence. Before implementation: Owner reviews the written design; reconcile actual upstream interfaces/versions; decide implementation repository; write a bounded implementation plan; then create missions under the current construction/review rules.

正式启用前先审批书面设计和有界实施计划。本目录不算“开发已完成”或“复检已完成”，也不成为 Utopia 当前收尾前置条件。

## 2. Future implementation increments / 后续增量

| Increment / 增量 | Deliverable / 交付 | Exit evidence / 退出证据 |
|---|---|---|
| I0 Offline admission / 离线取证 | Read-only existing evidence index and coverage ledger | Retrieval, deduplication, missingness and rights tests; zero source mutations. |
| I1 Candidate workbench / 选题台 | Signals, alternatives, literature log, Owner selection | Source-backed cards; no automatic manuscript opening. |
| I2 Scientific core / 科学核心 | Freeze, analysis receipts, claim graph, reproducible IR | Recompute admitted tables and preserve failed/inconclusive evidence. |
| I3 Two adapters / 双目标适配 | NIER and one source-required journal such as Access | Same truth in materially different compliant package shapes. |
| I4 Family and stage lifecycle / 生命周期 | Overlap registry, retargeting, revision/approval state | No double-submit under concurrency; correct stage-specific checks. |
| I5 Optional connector execution / 可选外部执行 | Authorized posting/submission with reconciliation | Real receipts and human authority; unsupported actions remain manual. |

Each increment can stop at a useful boundary. No need to implement all 14 registry targets before testing the design. / 不要求首版做齐全部期刊，也不强制接自动投稿。

## 3. Acceptance matrix / 验收矩阵

| ID | Fixture / 场景 | Expected result / 预期 |
|---|---|---|
| PF-T01 | Passing child + failed mandatory whole-run gate | Preserve original FAIL; reject broader success claim. |
| PF-T02 | Failed/blocked task never merged | Retain research observation; no fabricated accepted learning episode. |
| PF-T03 | Only anomalies collected, no full task denominator | No population failure-rate claim. |
| PF-T04 | One task, many retries/log copies | Separate counts; no independent-sample inflation. |
| PF-T05 | Artifact URL expired despite valid digest | Mark unavailable; retrieval-dependent claims unresolved. |
| PF-T06 | Repaired failure / later explanation | Preserve before-state and time; no retrospective PASS rewrite. |
| PF-T07 | Missing metric or hidden model identity | NOT_OBSERVABLE with reason, never zero/default guess. |
| PF-T08 | Same core -> NIER vs source-required journal | Different required package sets, same experiment numbers and scoped claims. |
| PF-T09 | Template-only retarget | Rebuild format/preflight, do not rerun product experiments. |
| PF-T10 | Applicable rule UNVERIFIED / CONFLICT / STALE | Submission blocked locally; other analysis/jobs continue. |
| PF-T11 | Incomplete rule list with listed rules all green | Cannot become preflight-cleared; stage completeness fails. |
| PF-T12 | Anonymous PDF with identifying archive link/history | Identity gate fails even though PDF author field is empty. |
| PF-T13 | Two concurrent sends for overlapping family | At most one attempt authorized; ambiguous delivery reconciled first. |
| PF-T14 | Network fails after send | SUBMISSION_STATE_UNKNOWN; do not duplicate submission. |
| PF-T15 | AI-disallowed editorial response task | Human-only substantive response, not model draft plus human click. |
| PF-T16 | New data/author/license/cost/policy after approval | Invalidate affected approvals; preserve original approved package. |
| PF-T17 | DOI exists but does not support claim | Bibliographic-existence PASS cannot override support FAIL. |
| PF-T18 | Synthetic fixture mixed into empirical corpus | Reject or isolate as simulation; never publish as observed data. |
| PF-T19 | Prompt injection inside log/template/policy | No authority change, file exfiltration or external send. |
| PF-T20 | Missing coauthor consent / APC beyond budget | Block publication/payment, do not fabricate confirmation. |
| PF-T21 | Cross-server preprint preference conflict | Show explicit routing decision; no automatic double posting. |
| PF-T22 | Reviewer asks for unperformed experiments | Report gap/approved plan; do not claim completion in response. |
| PF-T23 | Positive and negative outcomes, clustered time drift | Verify inclusion rationale and method assumptions before inferential claims. |
| PF-T24 | Old venue year or wrong submission stage | Reject profile mismatch; refresh exact target. |

Fixtures are `DESIGN_FIXTURE_NOT_RESEARCH`, with an independent origin namespace. They must not enter real candidate statistics. / 测试夹具不进入真实论文数据集。

## 4. Completion evidence / 完成证据

When implemented, supply schema validation; fixture outcomes; exact code/config/environment identities; independent evidence/method checks suited to the task; source non-mutation proof; UI reachability/control tests; two target-package build/preflight reports; and a bounded limitation list. Runtime tests and source freshness are separate from document link/JSON checks.

不把“生成了目录/JSON”称为流水线可用，不把“论文编译成功”称为有发表资格，不把“内部审核通过”称为期刊录用。

## 5. Stop and rollback / 停止与回退

A false scientific claim, secret leak, unauthorized external action or truth-core divergence disables the affected release path and preserves incident evidence. It does not erase archives or stop unrelated City work. A safe lower-capability state is package-only mode with manual external submission. / 有风险时退回仅打包/人工提交，不伪装自动化成功。

## 中文完整说明 / Complete Chinese explanation

### 1. 延后启用

这是未来测试要求，不是本次产品测试。仅架构记录，不因目录建立可领取任务、改进度、启动采集 daemon/实验/投稿适配器。实现前Owner评审设计、核对实际上游版本、选仓库、写有界计划，再按当时任务施工复检规则登记。不计开发或复检完成，不阻塞Utopia。

### 2. 增量

I0 离线只读索引覆盖账本，以取回去重缺失权限测试和零来源修改证明退出；I1 信号替代文献Owner选题台，以来源卡片且不自动开稿证明；I2 冻结分析论点可复现IR，以重算表及失败无结论保留证明；I3 NIER及一个需源期刊如Access，以同事实不同合规包证明；I4 家族重叠转投修订授权，以并发不双投和阶段检查证明；I5 可选外部执行以真实回执人工权限证明，不支持仍人工。每步可停，不要求首版全部14目标或自动投稿。

### 3. 24项未来验收情景

| ID | 场景 | 预期结果 |
|---|---|---|
| PF-T01 | 子项通过但必需整体验收失败 | 保留 FAIL，拒绝更广成功主张 |
| PF-T02 | 失败/阻塞任务未合并 | 保留研究观察，不伪造accepted episode |
| PF-T03 | 只收异常无总体分母 | 不声称总体失败率 |
| PF-T04 | 同任务多重试日志副本 | 分别计数，不膨胀独立样本 |
| PF-T05 | 摘要有效但artifact链接过期 | 标不可用，取回依赖主张未解决 |
| PF-T06 | 修复/后续解释 | 保留之前状态时间，不回写PASS |
| PF-T07 | 缺指标/隐藏模型身份 | NOT_OBSERVABLE及理由，不猜零默认 |
| PF-T08 | 同核心适配NIER及需源期刊 | 包内容不同，实验数字和范围一致 |
| PF-T09 | 仅模板转投 | 重建格式预检，不重跑产品 |
| PF-T10 | 适用规则未核/冲突/过期 | 局部阻塞投稿，其他分析继续 |
| PF-T11 | 不完整规则清单已列全绿 | 阶段完整性失败，不放行 |
| PF-T12 | 匿名PDF但归档链接历史识别身份 | 身份门禁失败，即使作者字段空 |
| PF-T13 | 重叠家族并发发送 | 最多一个授权，歧义先核对 |
| PF-T14 | 发送后断网 | SUBMISSION_STATE_UNKNOWN，不重投 |
| PF-T15 | 编辑回应禁AI | 人工实质回应，不模型写加人点击 |
| PF-T16 | 批准后数据作者许可成本政策变化 | 相关批准失效，保留原批准包 |
| PF-T17 | DOI存在但不支持主张 | 存在PASS不能覆盖支持FAIL |
| PF-T18 | fixture混入实证 | 拒绝或隔离模拟，不称观察数据 |
| PF-T19 | 日志模板政策中提示注入 | 不改权威、不外传、不外发 |
| PF-T20 | 缺合作者同意/APC超预算 | 阻塞发布付款，不造确认 |
| PF-T21 | 跨站预印本偏好冲突 | 展示路由决定，不自动双发 |
| PF-T22 | 评审要未执行实验 | 报缺口/批准计划，不称完成 |
| PF-T23 | 正负结果与聚类时间漂移 | 推断前核纳入理由方法假设 |
| PF-T24 | 旧年份/错误阶段 | 拒profile不符，刷新精确目标 |

fixture 为 DESIGN_FIXTURE_NOT_RESEARCH，独立来源命名空间，不进真实候选统计。

### 4. 完成证据

实现后提供schema验证、fixture结果、精确代码配置环境、适合任务的独立证据方法检查、来源零修改证明、UI可达控制、双目标构建预检、有限限制清单。运行测试/来源新鲜度与链接JSON验证独立。目录JSON不是流水线可用，编译不是发表资格，内部审核不是录用。

### 5. 停止回退

虚假科学主张、秘密泄露、未经授权外发或核心分歧，禁用受影响发布并留事件证据，不删归档、不停其他City工作。可退至仅打包人工外发，不伪装自动化成功。
