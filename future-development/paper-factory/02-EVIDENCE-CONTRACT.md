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

## 中文完整说明 / Complete Chinese explanation

### 1. 有界采集

范围内每项任务留最小观察，重要变化、失败修复留更丰富记录。也收正常成功工作，使未来可能获得分母。明确范围、采集起止、采样、保留、丢失事件和采集故障；覆盖未知不能推断总体失败率。没有日志不算成功，未知不补零。

### 2. 最小记录字段

身份包括 project/task/attempt/event ID、父/因果引用和 schema 版本；来源包括 repository、path/object ID、完整来源提交、测量实现提交、run ID、字节摘要、取回位置；时间包括生产者时间戳、时区、观察时间、时钟不确定性及可用顺序。

背景包括目标、工作负载、配置依赖、环境、主机化名、会话/提供者/模型可观察身份；结果包括原始结果、范围、验收依据、例外覆盖引用、原始证据分类；覆盖包括纳入总体、可用性、缺失丢失及理由、选择政策；权限包括敏感性、允许消费者、许可同意、保留到期和允许归档位置；派生包括 normalizer/parser 版本、来源引用、有意义的置信度及必要人工裁决。

报告存储提交不一定是被测实现。哈希只提供篡改证据，不证明诚实采集或原始字节仍存在。

### 3. 持久取回与派生

短期 CI artifact 过期前，在批准存储归档允许的字节，验证取回与校验和，记录保留责任。原始材料不进 City，优先紧凑 manifest，不能只依赖可变分支、截图名字或死链接。受限原件留受控存储，公开仅许可派生物。

脱敏是带自身摘要、变换配方、受限来源映射的新派生物，不改历史来源。不可变历史不凌驾秘密删除、到期保留或合法删除义务；留受限 tombstone，使无法再支持的论点失效。个人数据哈希不能代替匿名化。

### 4. 三种验收

产品验收遵守原产品/mission 契约；研究可采纳要求来源、可用性、权限和有界相关性；出版授权要求具体包的科学、政策和作者批准。产品失败可以是有效研究证据，未完任务可贡献失败观察但不自动成为 accepted evolution episode；绿色产品测试不授权一般研究主张。不得修改 Utopia finalizer 把有趣失败放入学习 feed，BLOCKED/NO_VALUE 等材料独立标注。

### 5. 分类

原始和归一标签分别保存，区分成功、已观察失败、预期/意外阻塞、取消、无效测量、未运行、不可观察、缺失、采集失败。EXPECTED_BLOCK 不代表任务成功；后续修复不覆盖先前失败。

来源类别分别为自然开发、受控验证、回放分析、模拟 fixture、项目作者叙述、结构化投影、独立测量，对应原文大写枚举。回放解析不是重跑真实提供者，作者叙述不是独立复现，不得升级类别。

### 6. 安全归一化

原生产 schema 权威不变，研究适配映射事件，不为论文任意新增生产事件。隐藏模型版本或时间保持 NOT_OBSERVABLE。不记录隐藏推理、凭据、无限制会话或无关个人材料。分别去重 task/attempt/run/review episode；多日志、多重试不是独立样本。

### 7. 采集负担

可测时记录观察开销、采样变化和停机。配额/背压只施加采集，不锁产品。最小可靠采集不可用时，使对应区间不适用需要它的论点，其他工作继续。
