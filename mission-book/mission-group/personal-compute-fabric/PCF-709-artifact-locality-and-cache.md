---
workbook_id: PCF-709
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 1
parent_workbook_id: null
execution_enabled: false
status: NOT_STARTED
activation_state: PARKED_OWNER_NOT_ACTIVATED
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_workbooks: ["PCF-706","PCF-708"]
dependency_source_shas: []
development_baseline_sha: null
anchor_state: INTENTIONALLY_EMPTY_UNTIL_ACTIVATION
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: UNASSESSED
backend_wiring: UNASSESSED
capability_ids: []
planned_capability_ids: ["CAP-PCF-709"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-709 — 数据位置、工件传输与有界缓存

[English](en/PCF-709-artifact-locality-and-cache.md) · [共用步骤](EXECUTION_CONTRACT.md)

候选 `services/personal-compute-fabric/{artifacts,cache}.mjs`、`tests/pcf709-artifacts.test.mjs`。`resolveArtifact(ref, principal, destination) -> TransferPlan|Refusal`复用既有存储/transport；位置索引是可重建辅助状态，不接管task truth。

- [ ] ArtifactRef有opaque ID、digest、size/schema、所有者/数据域、可用副本、有效期和retention；摘要匹配不代表访问获准。输入、checkpoint、输出使用统一引用。
- [ ] 路径由授权storage adapter解析，防路径穿越/任意远程文件读取。传输前和发布前重验授权；partial文件不能进入可用索引。
- [ ] 缓存有bytes/items quota、pin/lease、驱逐和失效；共享内容不跨权限暴露元数据。已撤销权限的副本清理有可见状态，不把失败删除记作已删。
- [ ] locality作为估计输入，读写/搬运费用和实际bytes留证；可断点续传仅在digest与版本匹配时成立。缓存冷热是实验变量。

`node --test tests/pcf709-artifacts.test.mjs`：同digest不同权限、损坏/截断、变更中源文件、path traversal、磁盘满、驱逐被pin工件、重传、撤销中断、清理失败均有正确状态。实跑双机传输并验证字节和checksum，不用复制fixture冒充网络证明。

UI：副本位置、传输状态、配额和删除错误归task/device Advanced；敏感名称和内容不出现在公共trace。新增对象存储/provider需单独授权，不强制上云。
