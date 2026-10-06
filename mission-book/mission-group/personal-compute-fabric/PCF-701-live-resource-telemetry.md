---
workbook_id: PCF-701
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 1
parent_workbook_id: null
execution_enabled: true
status: IN_PROGRESS
activation_state: ACTIVATED_OWNER_2026_10_07_SEQUENTIAL
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: ["312b627b54af5bbf274fa25eca8f8383869c1c34"]
dependency_source_workbooks: ["PCF-700"]
dependency_source_shas: ["659ff6aa98bc5675862b1170ed0cf5e1b78dba5f"]
development_baseline_sha: "659ff6aa98bc5675862b1170ed0cf5e1b78dba5f"
anchor_state: RESOLVED_AT_CLAIM
development_host: "Mech"
development_branch: "pcf/PCF-701-mech-live-resource-telemetry"
development_head_sha: "f7581e96134cc41de92f74564c474e75c5e775eb"
development_ci: "THREE heads, each kept. (1) 20b55b6855fed15af0c84a6eaa8e277595fcdd12: V0.2 checks run 37538196436 completed/failure - exactly one test failed and it was NOT this task's (tests/rex801-alien-independent-review.test.mjs hit a Windows rm()/flush race in its finally block after its assertion had passed; the same head re-ran green and that suite passes 3/3 standalone at both heads). (2) e3c7256069796aac9e67c38042a1da03dbe26c7b: V0.2 checks run 37540047630 completed/success (the repair adds maxRetries/retryDelay to that suite's three rm() calls and changes no acceptance). (3) f7581e96134cc41de92f74564c474e75c5e775eb: V0.2 checks run 37544501932 completed/success, gateway-web and android green. Local evidence on this head: tests/pcf701-telemetry.test.mjs 19/19; the three PCF suites 30/30; eleven source mutations each turn the suite red and each is restored byte-identically; scripts/check-bilingual.mjs reports PAIR_STATUS = SYNCHRONIZED for docs, evidence and data-records. The new tests caught two defects in this increment's own code (a read-only query that created state for an unprobed path, and an INVALID_RESULT branch that grew the failure count without growing the backoff) and both are fixed; the falsification script's own before/after bug is recorded too."
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
owner_gate: SATISFIED_OWNER_ACTIVATION_2026_10_07_SEQUENTIAL
merge_authority: false
report_path: "mission-book/reports/PCF-701"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-07): PCF-701 is the SECOND task of the owner-opened PCF series. Owner authority: the same standing instruction under which PCF-700 was activated says the PCF series be taken in sequence on a dedicated branch series, so this activation is bounded to the ONE next qualified workbook and is not a blanket enablement of 701..728 (only this workbook's frontmatter changed; 702..728 were re-measured and remain execution_enabled=false, unblocked=false, anchor-less). DEPENDENCY, read from the accepted workbook rather than from prose: PCF-700 status=COMPLETE, development_complete=true, review_complete=true, review_host=Alien, review_head_sha=659ff6aa98bc5675862b1170ed0cf5e1b78dba5f; its REVIEW_REPORT.md records the opposite-host verdict ACCEPTED for the audit/compatibility scope with no repair requested. ANCESTRY, measured: 312b627b54af5bbf274fa25eca8f8383869c1c34 (origin/main) is an ancestor of 659ff6aa98bc5675862b1170ed0cf5e1b78dba5f, and 659ff6a is exactly the accumulated head of the series branch pcf/series-mech; the dependency union is therefore that single head and requires no union merge. Because PCF-700's merge_authority is false and no product merge happened, the baseline is the series branch head, not main - recorded explicitly so the choice is not read as an accident. CONTROL PLANE: sync_dependency_state.py already recognises PCF (repaired in the PCF-700 activation transaction) and PROGRESS_MANIFEST.json carries an explicit file set listing PCF-700 and PCF-701 only. POOL RESCAN before this claim: no competing claim exists on PCF-701 by either host, and the only other in-flight development claims are REX-806 (Mech, awaiting the opposite-host review) and SHOW-401 (Alien). Boundaries not crossed and recorded instead: no purchase or paid service, no system-service installation, no change to the running City profile, no remote-execution enabling, and no merge authority (merge_authority stays false; the series branch accumulates verified work for a later ruling)."
---

# PCF-701 — 实时资源观测与 freshness

[English](en/PCF-701-live-resource-telemetry.md) · [共用步骤](EXECUTION_CONTRACT.md)

## 文件与接口

候选新增 `contracts/personal-compute-fabric-v1/observations.mjs`、`services/personal-compute-fabric/telemetry.mjs`、`tests/pcf701-telemetry.test.mjs`。消费 WBC descriptor/既有认证 telemetry；产出 `observeResources(sample, context) -> ResourceObservation`，不改变 trust 或 claim authority。

## 增强子任务

- [ ] 实测 CPU、内存、磁盘及可观察队列/占用；保留来源、单位、bootId/seq、observedAt/receivedAt/TTL。GPU/VRAM、网络质量、电池/温度由可选 adapter 提供，缺席不阻塞基本采集。
      → **部分完成（增量 1+2）**：CPU/内存/磁盘现在有**真实读数**（`adapters.mjs` 的参考适配器只读 `node:os` 与 `fs.statfs`，**不 shell out 到厂商工具**），来源/单位/bootId/seq/时间戳/TTL 齐备；**队列/占用尚无测量源**；GPU/VRAM、电池/温度仍只能**声明 `UNSUPPORTED`**（缺席处理正确且有守卫，但真实适配器未写），故本条保持未勾选。
- [ ] 区分 total/free/reserved/in-use，presence 与 freshness；观测、估计和用户声明分开。网络测量必须按路径，禁止用“局域网在线”冒充 RTT/带宽；探测有预算、期限和退避。
      → **基本完成但按事实不勾选（增量 2）**：四个 facet 独立成键（`memory.free`…）且各自校验，`free > total` 判 `FACET_INCONSISTENT` 并保留 raw 对；presence/freshness 分离；OBSERVED/ESTIMATED/DECLARED/UNKNOWN/UNSUPPORTED 分离；网络**按路径**（`{from,to,route}`）测量，未测路径答 `UNKNOWN/NEVER_MEASURED` 而非 0ms，预算/期限/退避（翻倍+上限+成功清零）齐备。**唯一剩余缺口：带宽（throughput）探测未实现**，故仍不勾选。
- [x] 实现有界缓冲、限频、丢弃计数和 overhead measurement；不采集未经授权的进程名称、窗口内容或个人文件。
      → `services/personal-compute-fabric/telemetry.mjs` + T9/T10/T11/T12：环满逐出最旧且丢弃数按原因可见、节流不探测、overhead 由注入的单调时钟测量、越权维度记为 `UNSUPPORTED` 且 `value=null`（测试断言绝不落库）。

### 2026-10-07 增量 2 记录（facets / adapters / 按路径网络测量）

- **facets**：`total/free/reserved/inUse` 独立成键（`memory.free`、`disk.total`…），各自校验；缺失记 `UNKNOWN`；`free > total` 判 `FACET_INCONSISTENT`（两个数都不作为可用值交出，保留 raw 对）。`dimensionKeys()` 公布完整键集。
- **adapters**：适配器声明自己供哪些维度；registry 把「无可用适配器覆盖的已声明维度」报 `UNSUPPORTED`；不可用适配器的维度**保留名字**而不是消失。参考适配器只读 Node 平台 API。
- **network-probe**：按路径键控；未测路径 `UNKNOWN/NEVER_MEASURED` 而非 0ms；挂死→有界 `TIMEOUT`；非数值→`INVALID_RESULT` 失败；退避翻倍+上限+成功清零；只有真测过的路径产出 `networkRtt` 样本并带路径 provenance。
- **新测试抓出本轮自己的两个缺陷**：`rttOrNull` 这个只读查询会为未探测路径创建状态（已改为不创建）；`INVALID_RESULT` 分支只计数不长退避（已改为同样翻倍）。证伪脚本自身也有一处 bug（最终 before/after 只列两个文件）造成假警报，已修并记录。
- **证伪**：11 处源码突变各自使套件变红（T1–T19 共 19/19），源码按字节还原。

### 2026-10-07 增量 1 记录（含自身问题与守卫改写）

- **证伪**：六处源码突变（接受负值 / 删顺序检查 / 混 boot epoch / 回拨后仍 FRESH / 超时填 0 / 环满不计数）**各自使套件变红**，源码按字节还原；复位后 13/13。
- **自己的装饰性断言（已修）**：M4 第一次没变红——T4 只用「未来时间戳」样本，而那条更早被 CLOCK_ROLLBACK 拒绝，`freshnessOf` 的回拨分支从未执行；补上**被接受的回拨路径**后 M4 才变红。
- **PCF-700 的相位守卫改写为边界守卫**（不是删除）：D4 改为「fabric 引用只允许在声明路径下，且除自身/测试/工具外无人 import」；审计脚本同时报告「全部引用」与「声明路径之外引用」；复检包 C6 检查后者为 0、C7 改为「只存在于声明路径下且模块在场」。**被验收头 `659ff6a` 保留原文**；本分支承载后继，理由写在测试文件头部注释。
- **仪器修复**：walker 抗目录抖动（PCF-700 兼容套件在同一进程池里增删 `.scratch-pcf700-*`，曾使 D2 出现一次极快失败）；连续三次并行跑三套 PCF 套件均 24/24。
- **机读记录差异**：`data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json` 已重生成，与 PCF-700 验收副本的差异仅为新增 `pcfRuntimeReferencesOutsideDeclaredPaths`（当前 `[]`）、`pcfRuntimeReferences` 增加本服务的 telemetry.mjs、以及合同目录计数；其余不变。

## 独立验收

`node --test tests/pcf701-telemetry.test.mjs`：missing/NaN/负数/单位错误不变0；乱序不能覆盖新值；reboot epoch 不混；时钟回拨不能让过期数据永久新鲜；测量超时不冻结 executor；缓冲满时丢弃数量可见。真实两主机至少采集 CPU/RAM，并记录测量自身开销；无 GPU 只声明 UNKNOWN/UNSUPPORTED。

UI：资源/freshness 属 Advanced device detail，风险投影交715，原始采样放技术层；未接线时保持 component scope。可继续拆更多资源 adapter，但不得引入任意硬件必需项。
