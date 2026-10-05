# Evidence Contract / 证据契约

## 1. Evidence-first does not mean collect everything / 证据优先不等于无限采集

Capture a bounded observation baseline for every in-scope task, plus richer records for meaningful transitions, failures and repairs. Include successful routine work so that a later denominator is possible. Record collection scope, start/stop time, sampling, retention, dropped events and capture failures. Unknown coverage cannot produce a population failure rate.

所有纳入范围的任务留最小记录，异常再加详细证据；不能只记录坏案例，也不能只读取合入 main 的成功案例。记录采样、丢失、停采与保留期限。分母未知就保持未知，禁止补零或把“没有日志”当成功。

## 2. Minimal record / 最小记录

| Group / 组 | Fields / 字段 |
|---|---|
| Identity / 身份 | project_id, task_id, attempt_id, event_id, parent/causal_refs, schema_version |
| Source / 来源 | repository, path/object_id, full source commit, measured implementation commit, run_id, byte digest, retrieval location |
| Time / 时间 | producer timestamp, timezone, observation timestamp, clock uncertainty, ordering sequence when available |
| Context / 上下文 | declared goal, workload, configuration/dependency identity, environment, host pseudonym, agent session/provider/model observable identity |
| Outcome / 结果 | original outcome, outcome scope, acceptance basis, exception/override pointer, raw evidence classification |
| Coverage / 覆盖 | inclusion population, availability, dropped/missing fields with reason, selection policy |
| Rights / 权限 | sensitivity, permitted consumers, license/consent basis, retention expiry, allowed archival locations |
| Derivation / 派生 | normalizer/parser version, derivation refs, confidence where meaningful, human adjudication where needed |

A commit storing a report is not automatically the implementation it measured. A hash is tamper evidence, not proof the data were collected honestly, nor a guarantee the bytes still exist. / 存储提交不等于测量提交；摘要既不证明采集真实性，也不保证可取回原件。

## 3. Durable retrieval and controlled derivatives / 持久取回与派生物

Before an ephemeral CI artifact expires, preserve the permitted bytes in an approved archive, verify retrieval and checksum, and record retention responsibility. Keep raw material out of Digital-City. Prefer compact manifests in City. Never rely exclusively on a mutable branch, a screenshot filename or a dead CI URL.

临时 artifact 到期前在授权存储归档并试取回。不能只留 SHA/链接却丢了原始文件。受限证据可以留受控存储，公开包只发布许可范围内的派生物。

Redaction creates a new derivative with its own digest, explicit transformation recipe and restricted mapping to the source. It does not edit the historical source. Immutable research history does not override secret removal, retention expiry or lawful deletion obligations: record the restricted tombstone and invalidate claims that can no longer be supported. Do not publish personal-data hashes as a substitute for anonymization.

脱敏生成独立派生物；原始记录不随论文修辞变化。安全删除时留合规的失效说明，不以“不可变”为理由永久保存敏感数据。

## 4. Three different acceptances / 三种不同的通过

```text
Product acceptance       = the existing product/mission contract
Research admissibility   = provenance + availability + rights + bounded relevance
Publication authorization= scientific/policy/author approval for a specific package
```

A failed product run can be valid research evidence. An unfinished mission may supply a documented failure observation without becoming an accepted evolution episode. Conversely, a green product test does not by itself authorize a general research claim. The paper factory must not alter Utopia's finalizer to admit interesting failures into its learning feed.

产品失败不代表研究证据无效；研究可采纳不代表产品验收通过。未完成、BLOCKED、NO_VALUE 的材料单独标注，不伪造 accepted episode，不改 finalizer。

## 5. Outcome and provenance taxonomy / 结果与来源分类

Keep original labels and normalized labels separately. At minimum distinguish success, observed failure, expected block, unexpected block, cancelled, invalid measurement, not run, not observable, missing and collection failure. EXPECTED_BLOCK is not successful task completion. A later repair never overwrites the earlier failure.

来源类别必须区分 `NATURAL_DEVELOPMENT`, `CONTROLLED_VALIDATION`, `REPLAY_ANALYSIS`, `SIMULATED_FIXTURE`, `PROJECT_AUTHORED_ACCOUNT`, `STRUCTURED_PROJECTION`, `INDEPENDENT_MEASUREMENT`。回放日志解析不是重新运行真实 provider，作者叙述不是独立复现。类别不可升级伪装。

## 6. Safe normalization / 安全归一化

Existing producer schemas remain authoritative. The research adapter maps their event names; it must not add arbitrary event types to production merely to satisfy a paper field. Unknown model version or hidden timing stays NOT_OBSERVABLE. Do not record hidden model reasoning, credentials, unrestricted conversations or unrelated personal material.

不同原项目保持各自 event 契约；研究侧映射，不反向污染产品。Task/attempt/run/review episode 分开去重；同一运行多个日志、同一任务多个重试不默认算多个独立样本。

## 7. Measurement burden / 采集负担

Record observability overhead where measurable, sampling changes and collector outages. Apply quota/backpressure to evidence capture, not a global product lock. If reliable minimal capture is unavailable, mark the affected interval ineligible for claims requiring it and continue independent work. / 采集失败只降低对应证据可用性，不让论文记录系统阻塞正常开发。
