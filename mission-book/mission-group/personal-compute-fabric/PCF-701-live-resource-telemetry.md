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
development_head_sha: "4e97d503989beba82124a1b6e3286825f33b92fc"
development_ci: "FOUR heads, each kept. (1) 20b55b6855fed15af0c84a6eaa8e277595fcdd12: V0.2 checks run 37538196436 completed/failure - exactly one test failed and it was NOT this task's (tests/rex801-alien-independent-review.test.mjs hit a Windows rm()/flush race in its finally block after its assertion had passed; the same head re-ran green and that suite passes 3/3 standalone at both heads). (2) e3c7256069796aac9e67c38042a1da03dbe26c7b: run 37540047630 completed/success (the repair adds maxRetries/retryDelay to that suite's three rm() calls and changes no acceptance). (3) f7581e96134cc41de92f74564c474e75c5e775eb: run 37544501932 completed/success. (4) 4e97d503989beba82124a1b6e3286825f33b92fc: run 37545526161 completed/success, gateway-web and android green. Local evidence on the final head: tests/pcf701-telemetry.test.mjs 22/22; the three PCF suites 33/33; the PCF-700 review packet still 8/8; check:docs PAIR_STATUS = SYNCHRONIZED in all three roots; THIRTEEN source mutations each turn the suite red with byte-identical restoration, and the set did real work - it exposed one unreachable defensive check (removed from the source) and two refusal branches that only a direct sample() call could reach (tests added, mutations now caught). NOTE: a stray duplicate `development_ci: null` line sat below this one until the field became load-bearing, when check_record_consistency reported DEV_COMPLETE_WITHOUT_CI and it was removed; the flat parser had been silently taking the last value."
development_complete: true
development_completion_note: "Development side closed at head 4e97d503989beba82124a1b6e3286825f33b92fc, with one item EXPLICITLY handed to the reviewer rather than claimed. DONE: the observation contract (never invents a number; presence/freshness; sequence ordering; boot epoch; clock rollback; unbounded-buffer, throttle, drop counting and overhead measurement; unauthorised surfaces recorded as UNSUPPORTED and never stored); facets for total/free/reserved/inUse with a FACET_INCONSISTENT refusal; adapters that declare what they supply and name what they cannot; per-PATH RTT and throughput with budget, deadline, backoff and no fabricated zero; queue requiring an explicit source; occupancy read from the platform's event-loop delay histogram. Verification: tests/pcf701-telemetry.test.mjs 22/22, the three PCF suites 33/33, the PCF-700 packet still 8/8, thirteen source mutations each turning the suite red with byte-identical restoration. NOT DONE, and the reason: GPU/VRAM, battery and thermal have no real adapter on this runtime - reading them means vendor tools or privileged interfaces, which this host treats as an unapproved new privileged surface and therefore does not implement in passing. Sub-step 1's remaining clause (absence must not block basic collection) IS implemented and tested; whether the absence of real optional adapters satisfies the acceptance is a judgement for the reviewer, and this note exists so that judgement is made with the gap named rather than discovered. The two-host acceptance half (real CPU/RAM sampling across two hosts with the measurement's own overhead recorded) is the reviewer's per EXECUTION_CONTRACT section 14; the handoff is reports/PCF-701/REVIEW_HANDOFF_Mech.md."
review_host: "Alien"
review_head_sha: "4e97d503989beba82124a1b6e3286825f33b92fc"
review_ci: "CLAIMED: independent verification in progress on exact4e97d503989beba82124a1b6e3286825f33b92fc; no verdict yet."
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
      → **基本完成但不勾选（增量 1–3）**：CPU/内存/磁盘有真实读数（参考适配器只读 `node:os`/`fs.statfs`）；**占用**由 event-loop delay 直方图真实测量；**队列**需要显式 source，未声明时诚实报 `UNSUPPORTED`（绝不编 0）；来源/单位/bootId/seq/时间戳/TTL 齐备。**GPU/VRAM、电池、温度在本运行时只能声明 `UNSUPPORTED`** —— 缺席不阻塞基本采集这一条已实现并测试，但「真实可选 adapter」未写，且我**刻意不 shell out 到厂商工具**（那会是无审批的新特权面）。故本条保持未勾选，把该判断留给复检方。
- [x] 区分 total/free/reserved/in-use，presence 与 freshness；观测、估计和用户声明分开。网络测量必须按路径，禁止用“局域网在线”冒充 RTT/带宽；探测有预算、期限和退避。
      → **完成（增量 2+3）**：四个 facet 独立成键并各自校验（`free > total` 判 `FACET_INCONSISTENT`）；presence/freshness 分离；OBSERVED/ESTIMATED/DECLARED/UNKNOWN/UNSUPPORTED 分离；网络**按路径**测量 **RTT 与吞吐**（吞吐靠搬字节计时，绝不从延迟推断），未测路径答 `UNKNOWN` 而非 0，预算/期限/退避（翻倍+上限+成功清零）齐备；T14–T22 覆盖。
- [x] 实现有界缓冲、限频、丢弃计数和 overhead measurement；不采集未经授权的进程名称、窗口内容或个人文件。
      → `services/personal-compute-fabric/telemetry.mjs` + T9/T10/T11/T12：环满逐出最旧且丢弃数按原因可见、节流不探测、overhead 由注入的单调时钟测量、越权维度记为 `UNSUPPORTED` 且 `value=null`（测试断言绝不落库）。

### 2026-10-07 增量 3 记录（throughput / queue / occupancy + 死守卫）

- **throughput**：`measureThroughput` 靠**搬字节计时**得出速率，绝不从延迟推断；transfer 注入（工厂或单次）；0/负搬运、挂死、非数值 = FAILED（不是 0 B/s），失败同样退避；延迟与吞吐互不代替。
- **queue**：必须显式 `source`，否则不可用 ⇒ 报 `UNSUPPORTED`，不编 0。
- **occupancy**：读 event-loop delay 直方图（真实可测的运行时占用）；读不出均值时**不给值+给原因**，绝不 0ms。
- **证伪集起作用**：13 处突变全部抓住。其中 **M12 删掉第二个 `bytesPerSecond <= 0` 检查后全绿 ⇒ 那是不可能触发的死守卫**，已从源码删除（连突变一起删）；**M13/M14 起初未被抓住** —— registry 会短路不可用适配器，两个「拒绝编造」的分支在 registry 路径上不可达，故两条测试**同时直接调用 `sample()`**，现在都会变红。所有突变按字节还原。

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
