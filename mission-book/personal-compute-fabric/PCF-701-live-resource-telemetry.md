---
workbook_id: PCF-701
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
dependency_source_workbooks: ["PCF-700"]
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
planned_capability_ids: ["CAP-PCF-701"]
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: OWNER_ACTIVATION_REQUIRED
merge_authority: false
report_path: null
---

# PCF-701 — 实时资源观测与 freshness

[English](./en/PCF-701-live-resource-telemetry.md) · [共用步骤](./EXECUTION_CONTRACT.md)

## 文件与接口

候选新增 `contracts/personal-compute-fabric-v1/observations.mjs`、`services/personal-compute-fabric/telemetry.mjs`、`tests/pcf701-telemetry.test.mjs`。消费 WBC descriptor/既有认证 telemetry；产出 `observeResources(sample, context) -> ResourceObservation`，不改变 trust 或 claim authority。

## 增强子任务

- [ ] 实测 CPU、内存、磁盘及可观察队列/占用；保留来源、单位、bootId/seq、observedAt/receivedAt/TTL。GPU/VRAM、网络质量、电池/温度由可选 adapter 提供，缺席不阻塞基本采集。
- [ ] 区分 total/free/reserved/in-use，presence 与 freshness；观测、估计和用户声明分开。网络测量必须按路径，禁止用“局域网在线”冒充 RTT/带宽；探测有预算、期限和退避。
- [ ] 实现有界缓冲、限频、丢弃计数和 overhead measurement；不采集未经授权的进程名称、窗口内容或个人文件。

## 独立验收

`node --test tests/pcf701-telemetry.test.mjs`：missing/NaN/负数/单位错误不变0；乱序不能覆盖新值；reboot epoch 不混；时钟回拨不能让过期数据永久新鲜；测量超时不冻结 executor；缓冲满时丢弃数量可见。真实两主机至少采集 CPU/RAM，并记录测量自身开销；无 GPU 只声明 UNKNOWN/UNSUPPORTED。

UI：资源/freshness 属 Advanced device detail，风险投影交715，原始采样放技术层；未接线时保持 component scope。可继续拆更多资源 adapter，但不得引入任意硬件必需项。
