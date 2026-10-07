# PCF — Personal Compute Fabric / 个人异构计算织网（增强版）

> **PARKED / NOT ACTIVATED / DESIGN ONLY — 设计期状态（历史）**
> 所有工作书 `execution_enabled: false`；实现基准、依赖 SHA、领取者和验收证据故意留空。PCF 不加入当前 `PROGRESS_MANIFEST.json`，不改变在途任务、主任务分母或 Utopia 运行行为。

> **2026-10-07 有界激活 / bounded activation（Owner 指令）**：Owner 本轮指示「打开 PCF 系列、连续承接其任务、单独开一个分支系列」。按本系列自己的激活规则（§2 首激活事务）执行：控制面兼容缺口**先修**（`sync_dependency_state.py` 的 ID_RE 加入 PCF —— 修前 PCF 依赖 id 对工具完全不可见）、`PROGRESS_MANIFEST.json` 加入**显式文件集**（本轮只含 PCF-700，不用宽 glob）、依赖 reconcile 实测**只改 PCF-700 一本**（701..728 保持 parked、未解锁、未补 anchor）、四个 accepted WBC 依赖头实测**都已在 main**。因此 **PCF-700 被启用并领取**（`Mech-DS`，分支系列 `pcf/series-mech`，任务分支 `pcf/PCF-700-mech-ownership-and-reality-audit`），**其余 28 本保持 parked**、不进入当前分母、不获得执行权/预算/凭据/合并权。完整回执见 [ACTIVATION_RECEIPT_2026_10_07.md](ACTIVATION_RECEIPT_2026_10_07.md)，领取记录见 `reports/PCF-700/CLAIM_REPORT.md`。 / The owner's instruction this session was executed as a bounded activation: the control-plane gap was fixed first, the manifest carries an explicit one-workbook file set, the reconciler touched only PCF-700, and the four accepted WBC dependencies are already in main. PCF-700 is claimed; the other 28 workbooks stay parked.

> **2026-10-07 PCF-701 进入异机复检；对侧已发现我的一个真实缺陷 / PCF-701 review started, and the opposite host found a real defect of mine**：对侧（Alien）已领取 PCF-701 复检（`reports/PCF-701/REVIEW_CLAIM_ALIEN.md`，对象 = 作者头 `4e97d50`；工作书 `review_host: "Alien"`、`review_complete: false`）。它独立跑出作者头 **33/33 + 审计包 8/8**，却在**真实 Windows 采样**中抓到一个我造成的缺陷：我的参考适配器用 `os.loadavg()` 作 CPU 来源，而 **Windows 上该值是 `[0,0,0]`（不是测量）⇒ 我把一个伪造的 0 报成了 `OBSERVED`**，正好违反我自己写下的「绝不凭空造数」（方向相反：不是把缺失填 0，而是把「读不到的 0」当成读数）。我的守卫 T16 只断言 `cpu.value ∈ [0,1]`，**0 也能通过**，所以没抓住——守卫太弱，记录在案。对侧自建四个反例（warmup、真实计数区间、reset 后重建区间、缺计数/不增长）与三处独立突变（删 `memory.free>total` 守卫、零字节吞吐、恢复 Windows 占位来源，全部按字节还原），并给出修复候选 **`cf07f4acb3be0fe3e734ed39bf9145348e2d7ba8`**（PR41，基于不可变作者头，push/PR/linkage 三项 CI 已 success）。**作者头 `4e97d50` 保持冻结**（复检期不再移动）；按「修复方不能自审」，该修复候选的**异机复检由 Mech 承接**，已排队。

> **2026-10-07 PCF-701 增量 3 / increment 3（head `4e97d503989beba82124a1b6e3286825f33b92fc`，CI run 37545526161 两 job 全绿）**：**吞吐靠搬字节计时**（绝不从延迟推断；0/负搬运、挂死、非数值都是 FAILED 而非 0 B/s；延迟与吞吐互不代替）；**队列必须显式声明 source**，否则报 `UNSUPPORTED` 而不编 0；新增 **occupancy**（读平台 event-loop delay 直方图，是运行时自身可测的占用；读不出均值就不给值并给原因，绝不 0ms）。测试 T20–T22（套件 **22/22**、PCF 三套 **33/33**）。**证伪集这次真的起作用**：13 处突变全部抓住，其中 M12 删掉第二个 `bytesPerSecond <= 0` 检查后**全绿 ⇒ 那是不可达的死守卫**，已从源码删除（连突变一并删）；M13/M14 起初未被抓住——registry 会短路不可用适配器，两个「拒绝编造」的分支在 registry 路径上不可达，故两条测试现在**同时直接调用 `sample()`**，两处突变都会变红。子步骤 **2 与 3 完成**；子步骤 1 仍按事实不勾选（CPU/内存/磁盘/占用有真实读数、队列可声明，但 GPU/VRAM、电池、温度在本运行时只能声明 `UNSUPPORTED`，且我刻意不 shell out 到厂商工具）。 / Increment 3 adds throughput-by-moving-bytes, a queue that refuses to invent a zero without a declared source, and event-loop occupancy; thirteen mutations all caught, one of which proved a check was dead code and got it deleted.

> **2026-10-07 PCF-701 增量 2 / increment 2（head `f7581e96134cc41de92f74564c474e75c5e775eb`，CI run 37544501932 两 job 全绿）**：`total/free/reserved/inUse` 独立成 **facet**（`memory.free`…，各自校验；缺失记 `UNKNOWN`；`free > total` 判 `FACET_INCONSISTENT` 并保留 raw 对）；新增 `adapters.mjs`（适配器声明自己供哪些维度，registry 把无适配器覆盖的已声明维度报 `UNSUPPORTED`；参考适配器只读 `node:os`/`fs.statfs`，**不 shell out 到厂商工具**）；新增 `network-probe.mjs`（延迟属于**路径**：未测路径答 `UNKNOWN/NEVER_MEASURED` 而非 0ms、挂死→有界 `TIMEOUT`、非数值→`INVALID_RESULT` 失败、退避翻倍+上限+成功清零、只有真测过的路径产出 `networkRtt`）。测试 T14–T19（套件 **19/19**）、**11 处突变各自变红**。**新测试抓出本轮我自己的两个缺陷**（只读查询竟为未探测路径创建状态；`INVALID_RESULT` 不长退避）并已修；证伪脚本自身的一处 bug 也照记。子步骤 3 完成，1 与 2 仍按事实未勾选（队列/占用无测量源、GPU/电池/温度仅能声明 UNSUPPORTED、带宽探测未实现）。 / Increment 2 adds facets, an adapter registry that names unavailable hardware instead of zeroing it, and a path-scoped latency probe; six new guards, eleven mutations all caught, and the new tests exposed two defects in this round's own code.

> **2026-10-07 PCF-701 增量 1 / increment 1（head `e3c7256`）**：fabric 的**第一个运行期模块**落地 —— `contracts/personal-compute-fabric-v1/observations.mjs`（`observeResources(sample, context) -> ResourceObservation`，**纯函数**：缺失/NaN/负数/单位不符/越界**一律不是 0** 而是带原因的 `UNKNOWN/UNSUPPORTED`；sequence 防旧包覆盖；bootId 不混 epoch；age 手工单调化使回拨既不能保鲜也不能撤销老化；越权维度记为 `UNSUPPORTED` 且不落库）与 `services/personal-compute-fabric/telemetry.mjs`（有界环+丢弃计数、限频不探测、超时不冻结调用方并返回全 UNKNOWN、采样失败显式上报、注入单调时钟测 overhead）、`tests/pcf701-telemetry.test.mjs`（13 项反例守卫）。**六处源码突变各自使套件变红**；突变还暴露出一条**装饰性断言**（T4 的回拨分支从未被执行）并已修。PCF-700 的三条相位守卫（D4/C6/C7）**改写为边界守卫而非删除**（被验收头 `659ff6a` 保留原文）。另修一处**跨系列测试卫生**问题：对侧 REX-801 套件在 Windows runner 上 `rm()` 竞速导致一次假红（同头重跑全绿、单跑 3/3），三处 `rm()` 加 `maxRetries/retryDelay`，不改其验收。子步骤 3 完成、1 与 2 部分完成（可选 adapter、total/free/reserved/in-use、按路径网络测量未做），故开发未收口。 / PCF-701 increment 1 lands the fabric's first runtime modules: a pure observation contract that never invents a number, and a bounded rate-limited collector that reports timeouts and failures honestly. Six source mutations each turn the suite red; one decorative assertion they exposed is fixed; PCF-700's phase guards are restated as boundary guards with the accepted head untouched.

> **2026-10-07 PCF-700 异机验收通过（ACCEPTED）；PCF-701 已按序激活并领取 / PCF-700 accepted by the opposite host; PCF-701 activated and claimed in sequence**：对侧实体主机（Alien）在 exact `659ff6a` 上完成正式复检并裁决 **ACCEPTED（仅 audit/compatibility scope，未要求修复）**：独立装依赖后 C1–C7 + D1–D4 **11/11**、**六次证伪**各自非零退出后复位再 11/11、审计包 8/8、五个单写者指纹由对侧用 Python 另行重算、exact-head CI 37502818037 单独复核 success；并做了**真实异机样本**（对侧 MEMBER 提交普通 WAIT 任务 `Q-2e77523f…`，Mech 节点执行 5 次 checkpoint 后完成，对侧独立读取 canonical 结果）——但它明确写出这**不**把契约行升级为 TWO_HOST_VERIFIED / ORIGIN_AGENT_CONSUMED。作者侧确认见 `reports/PCF-700/AUTHOR_ACKNOWLEDGEMENT_Mech.md`（含**未修**的判据精度限制：LIVE_WIRED 判据是「文本引用」，其中 2 个产线提及者无 import 边，结论不变；作者主动推迟该改动，不改写被验收头）。据此 **PCF-701 已激活并领取**（`ACTIVATION_RECEIPT_2026_10_07_PCF-701.md`、`reports/PCF-701/CLAIM_REPORT.md`，分支 `pcf/PCF-701-mech-live-resource-telemetry`，baseline = 系列头 `659ff6a`）。`merge_authority` 仍为 false：已验收头只**累计**在 `pcf/series-mech`，合并权仍在 Owner。 / The opposite host accepted PCF-700 at exact 659ff6a (audit/compatibility scope, no repair requested) with independent falsifications and a real cross-host MEMBER sample, while explicitly not upgrading rows to the two-host tiers. PCF-701 is now activated and claimed in sequence on baseline 659ff6a; merge authority remains the owner's.

> **2026-10-07 作者冻结头自查（只读）/ author self-check at the frozen head**：`reports/PCF-700/AUTHOR_SELF_CHECK_AT_FROZEN_HEAD_Mech.md`。冻结头 `659ff6a` 本机复跑 11/11、`check:docs` 与复检包 8/8 均 exit 0、工作树干净；自查发现五档表的**判据比结论宽**（「引用」含纯文本提及）：`execution-backend-v1` 的 4 个产线提及者中 2 个无 import 边，但**四个 LIVE_WIRED 结论无一靠纯提及支撑**；EM/GAI 与 `rs-cross-device-return-v1` 在产线里连提及都没有。按冻结承诺，**收紧判据的改动留到裁决后的新头**，复检期不动 `659ff6a`。

> **2026-10-07 PCF-700 进入复检，作者侧冻结 / review started, author side frozen**：对侧实体主机已接入并开始 PCF-700 的正式复检。作者侧的冻结与配合口径写在 `reports/PCF-700/AUTHOR_HOLD_Mech.md`：**在裁决或明确要求之前不再向 `pcf/PCF-700-mech-ownership-and-reality-audit` 与 `pcf/series-mech` 推送任何提交**（复检目标头恒为 `659ff6a`），不触碰 `review_*` 字段、不创建/修改复检方的领取与报告、不释放 marker；修复一律在**新头**上做并保留被复检头的全部记录。领取仍由复检方发布（截至本行，工作书 `review_host` 仍为 null、远端尚无 `review/PCF-700-*` 分支）。 / The opposite host has begun the formal review; the author's freeze and handling protocol are in `reports/PCF-700/AUTHOR_HOLD_Mech.md`. No further commits to the reviewed branches until a verdict, no touching of the reviewer's fields or reports, and any repair happens on a new head.

> **2026-10-07 PCF-700 复检就绪 / review readiness（head `659ff6aa98bc5675862b1170ed0cf5e1b78dba5f`）**：作者把复检第一步压成**一条命令** —— `utopia:scripts/pcf700-review-packet.mjs` 自行重跑审计并逐字段比对发布记录（排除主机/node 元数据），八项检查本机 **8/8**，并已**三向证伪**（改指纹 / 改 tier / 造候选目录都会变红）。用法与预期输出见 `reports/PCF-700/REVIEW_READINESS_MECH.md`，复检清单与可证伪断点见 `reports/PCF-700/REVIEW_HANDOFF_Mech.md`（R0–R6、S1–S8）。
>
> **给对侧实体主机的显式请求 / explicit request to the opposite host**：PCF 系列 701..728 全部依赖 PCF-700，而 PCF-701 只有在 PCF-700 `status: COMPLETE` 后才能 READY。本机已收口开发侧（`development_complete: true`）并把证据打包，**但不会自审**（§3 禁止）。因此请对侧主机承接该复检；在复检完成前，本机一侧**没有可合法领取的下一本**。 / PCF-701..728 all depend on PCF-700 and cannot reach READY until it is COMPLETE; the development side is closed and the evidence is packaged, but this host does not self-review, so no further PCF task is legally claimable here until that review happens.

> **2026-10-07 PCF-700 增量 2 / increment 2（head `f75b2a6c2fa28d183a09795c70823c775123e1ac`）**：规格修订 2 要求的三项已完成并**量出来**——`docs/{zh-CN,en}/pcf/reuse-tiers.md`（五档核对：49 个合同目录只有 **4 个 LIVE_WIRED**；**EM 13 个与 GAI 9 个全部只有测试引用、零产线引用**；`rs-cross-device-return-v1` 只有测试 ⇒ 回端缝**没有产线路径证明**；`TWO_HOST_VERIFIED` 与 `ORIGIN_AGENT_CONSUMED` **两档全空**并写明归属）、`docs/{zh-CN,en}/pcf/ui-backend-matrix.md`（81 个前端文件、14 个含端点、网关 49 条路由、**未解析端点 = 0**、**后端 import 前端 = 0**、单写者 bytes/lines/SHA256 公开可重算）、`scripts/pcf700-reuse-audit.mjs` + `data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json`（可重跑机读记录）与 `tests/pcf700-dependency-direction.test.mjs`（D1–D4，4/4，且**逐条证伪过**）。仪器自身的两个 bug（19 条假阳性、被**副作用导入**绕过）记录在案。 / Increment 2 measures the accepted EM/RF/GAI/WBC components into tiers instead of assuming services: only four contracts are LIVE_WIRED, every EM and GAI contract is tests-only, the cross-device return seam has no production proof, and both unprovable tiers are left empty and named. Review target is now `f75b2a6`.

> **2026-10-07 PCF-700 开发进展 / development progress**：`Mech-DS` 已交付 `docs/{zh-CN,en}/pcf/ownership-map.md` 与 `tests/pcf700-compatibility.test.mjs`（7/7 通过），**修复头 `a2a567325e6ce08629eefbe67cda6f8f2c16fd64`**，hosted CI run 37498638940 两 job 全绿；系列分支 `pcf/series-mech` 已累计到同一头。交付头 `d611cfe` 曾在 step `pnpm check:docs` 失败（仓库闸门 `scripts/check-bilingual.mjs` 只读一层目录、遇到工作书要求的 `docs/*/pcf/` 嵌套即 EISDIR）——失败头与根因保留在 `reports/PCF-700/DEVELOPMENT_REPORT.md` §2.5，修复保留原语义并先证伪（移走 en 镜像 / 制造事实行差异都能让它退出 1）。实测结论：**九个候选接口与八个共享类型在当前 main 上一个都不存在**（`observeResources` / `admit` 是同名异物），profile 切换 LIVE_WIRED、`chooseHybridTarget` NOT_WIRED、strict target 接在真实领取路径内。**关键路径问题**：701..728 全部（直接或间接）依赖 PCF-700，而本任务 `review_host: null`，正式复检只能由另一实体主机完成；因此本系列当前唯一关键路径是 **PCF-700 的异机复检**，本机不自行复检、不为依赖门造例外。复检交接待办项见 `reports/PCF-700/REVIEW_HANDOFF_Mech.md`（精确头、可复现命令、可证伪断点、已声明未完成项）。 / PCF-700's first development round is delivered at repair head a2a5673 with hosted CI green on both jobs; the earlier head's `pnpm check:docs` failure and its root cause are kept rather than erased. Every candidate interface and shared type is measurably absent; the series' critical path is the opposite-host review of PCF-700, not another claim.

[English](en/README.md) · [架构](ARCHITECTURE.md) · [施工与证据合同](EXECUTION_CONTRACT.md) · [激活与扩容](ACTIVATION_AND_EXTENSION.md) · [实验与收口](RESEARCH_AND_RELEASE.md) · [机器可读计划](PROGRAMME_MANIFEST.json) · [激活回执](ACTIVATION_RECEIPT_2026_10_07.md)

## 定位与范围

PCF 是 WBC 的增量后继：把兼容后端、节点描述和可逆 profile，推进为**带授权约束、可解释放置、真实执行、资源保护及可恢复状态的个人多设备运行时**。眼镜、娱乐室、健康和工程助理都是应用，不成为核心的领域前提。

增强不等于一次全开。规划包含 **29 份独立工作书：23 份 CORE_V1、6 份 OPTIONAL_EXTENSION**。这个数字是设计清单，不是已启用施工统计。核心版本使用现有 Windows workers + Android control surface 验证；不等 Linux、眼镜、NPU 或双服务器到位。

**保留原 PCF-701～707 的主题；新增 700、708～724 补齐运行时和研究边界。**

## 已核对的设计输入，不是未来执行锚点

2026-10-06 读取的 City 文档快照：`28120397450574c9274b2d75a18f4f07288baea0`；Utopia main 快照：`213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`。这两个 SHA 仅用于追溯本规划的输入，**不得抄入未来 development baseline**。

输入包括 WBC、现有 `services/dev-gateway/`、节点描述合同、headless agent seam、当前施工规则和依赖同步器。接口存在、函数可单测、真实链路已接线、跨机已验收是四个不同状态；PCF-700 必须重新逐项核实，不能把 seam 当成成熟服务。

## 工作书清单

| ID | 任务 | 批次 |
|---|---|---|
| [700](PCF-700-ownership-and-reality-audit.md) | 所有权、真实调用链和兼容基线审计 | CORE_V1 |
| [701](PCF-701-live-resource-telemetry.md) | 实时资源观测、freshness、采集预算 | CORE_V1 |
| [702](PCF-702-explainable-placement.md) | 纯函数放置、成本估计和决策回执 | CORE_V1 |
| [703](PCF-703-pipeline-offload-and-streams.md) | 阶段卸载、有限流与端到端背压 | CORE_V1 |
| [704](PCF-704-admission-reservations-and-fairness.md) | 原子准入、资源预留、公平队列 | CORE_V1 |
| [705](PCF-705-recovery-and-safe-replacement.md) | 安全重放置、失败恢复、未知副作用 | CORE_V1 |
| [706](PCF-706-policy-consent-and-data-boundaries.md) | 权限、隐私、预算、local-first 策略 | CORE_V1 |
| [707](PCF-707-research-trace-and-replay-adapter.md) | REX 观测、回放、消融适配 | CORE_V1 |
| [708](PCF-708-workload-envelope-and-qos.md) | 统一工作负载合同与 QoS | CORE_V1 |
| [709](PCF-709-artifact-locality-and-cache.md) | 数据位置、工件传输和有界缓存 | CORE_V1 |
| [710](PCF-710-headless-execution-and-isolation.md) | 真实 headless executor、隔离与取消 | CORE_V1 |
| [711](PCF-711-checkpoint-and-resume-contract.md) | 显式检查点及恢复兼容合同 | CORE_V1 |
| [712](PCF-712-durable-supervision-and-fencing.md) | 常驻执行监督、持久化协调和 fencing | CORE_V1 |
| [713](PCF-713-interference-and-slo-protection.md) | 多应用干扰、SLO、协作式降级 | CORE_V1 |
| [714](PCF-714-origin-surface-continuity.md) | 发起端状态、结果和控制连续性 | CORE_V1 |
| [715](PCF-715-resource-control-and-monitor.md) | 资源控制、Monitor 投影和分层 UI | CORE_V1 |
| [716](PCF-716-unattended-deployment-and-rollback.md) | 无人值守部署、drain、升级回退 | CORE_V1 |
| [717](PCF-717-model-residency-and-serving.md) | 模型冷暖启动、驻留和推理资源 | OPTIONAL_EXTENSION |
| [718](PCF-718-linux-worker-onboarding.md) | Linux worker 接入与混合平台验收 | OPTIONAL_EXTENSION |
| [719](PCF-719-android-edge-companion.md) | 显式授权的 Android edge companion | OPTIONAL_EXTENSION |
| [720](PCF-720-accelerator-power-and-thermal.md) | GPU/NPU、功耗、热状态适配 | OPTIONAL_EXTENSION |
| [721](PCF-721-controlled-systems-study.md) | 对照实验、故障矩阵和独立复现 | CORE_V1 |
| [722](PCF-722-controller-continuity-and-ha.md) | 控制端连续性与有 fencing 的 HA | OPTIONAL_EXTENSION |
| [723](PCF-723-adaptive-placement-research.md) | 经对照证据约束的自适应放置 | OPTIONAL_EXTENSION |
| [724](PCF-724-multi-application-workload-pilots.md) | 多应用工作负载适配与并发试点 | CORE_V1 |

PCF-790 / PCF-990 **只预留为未来验收编号**，目前不创建可执行 final-merge 工作书。验收设计见 RESEARCH_AND_RELEASE。

## 推荐波次，不是必须串行

A：700 → 701 / 706 / 708。

B：702 / 704 / 709；随后 710 / 707。

C：703 / 711 / 712 / 713；随后 705。

D：714 / 715 / 716 / 724 → 721 → 满足条件后生成 PCF-790。

E：717 / 718 / 719 / 720 / 722 / 723 按预算、设备、证据分别激活；不阻塞 CORE_V1。编号不是执行顺序，依赖以工作书为准。

## 与既有系列的边界

- **WBC**：复用，不重做、不宣称真实工作台已经验收；默认 STANDARD_DEVICES 永久可用。
- **MON**：真实 UI/投影集成验收要求 MON-990 accepted exact head；不把 Monitor 设为任务执行同步锁。
- **REX**：复用实验注册、追踪、runner、故障注入、回放、导出；只扩展适配器，不造第二个研究平台。
- **FR-001**：PCF 提供执行/资源接口，Foreman 保留工程规划与 Review→Repair；不要求 Foreman 等全部可选扩展。
- **URA / DGX / RIV / CHK**：保持原停放状态。PCF 不借机重分类全城、拆仓、取消异机复核或实现治理议会。

## 不可让步

无工作台也必须可用；不增第二套 Task/Action/Attention/device/trust truth；`UNKNOWN` 不填 0；strict target 不静默改派；新增 API 费用、跨设备执行和数据外发遵循既有授权；既有 Android 只作为控制端；跨机执行的回执回到原交互端；两节点不能凭互相心跳就宣称无分裂脑的 HA。

允许增加子任务和提高复杂度，但必须遵循显式版本、所有权、预算、依赖与冻结范围规则。**复杂度可以增长，验收范围不能无限漂移。**

## Scope revision 2 / 2026-10-07 强化范围

**29 planned workbooks = 23 CORE_V1 + 6 OPTIONAL_EXTENSION; 0 activated.** 新增四书是已授权的规划增强，不是开启施工。 / Four additions are approved design work, not runtime activation.

| ID | Work | Scope |
|---|---|---|
| [PCF-725](PCF-725-execution-provider-contract-and-boundaries.md) | 执行 Provider 合同与生命周期边界 | CORE_V1 / PARKED |
| [PCF-726](PCF-726-execution-capsule-and-result-evidence.md) | 执行胶囊与结果证据封装 | CORE_V1 / PARKED |
| [PCF-727](PCF-727-engineering-connector-live-execution.md) | 工程连接器真实执行与验收 | CORE_V1 / PARKED |
| [PCF-728](PCF-728-originating-agent-remote-job-bridge.md) | 发起 Agent 远端子任务与结果回注桥 | CORE_V1 / PARKED |

### 迁入面板 / Incoming requirement history

| Transfer | Source requirement | Destination | Remaining source scope |
|---|---|---|---|
| PCF-MIG-20261007-01 | URA-002 — 执行 provider 的版本、能力、权限、平台、命令、存储命名空间与兼容合同 | PCF-725 | 全城 App taxonomy、App lifecycle 及非执行业务合同 |
| PCF-MIG-20261007-02 | URA-003 — 执行器的启动/退出、依赖失效、隔离、停用和回退边界 | PCF-725 | 全城依赖方向、非执行 App/service 解耦与分类 |
| PCF-MIG-20261007-03 | DGX-002 — 有界执行上下文与结构化结果/证据封装的通用底层 | PCF-726 | Constitution、语义拆题、ProblemGraph、领域证据规则、辩护和仲裁 |
| PCF-MIG-20261007-04 | FR-001 — 真实工程连接器 launch/bind/submit/events/control/result/health 验收 | PCF-727 | 工程目标规划、Review→Repair、升级梯与合并决策 |
| PCF-MIG-20261007-05 | FR-001 — 发起 Agent/会话提交远端子任务并消费结构化回执的调用桥 | PCF-728 | 业务汇总决策和无需人工转述的完整 Foreman 控制环 |
| PCF-MIG-20261007-06 | FR-001 — 执行侧常驻监督、唤醒、回执消费与 canonical 状态协调 | PCF-712 | Git/Mission Book/CI 目标观察、下一工程选择、Review→Repair |
| PCF-MIG-20261007-07 | FR-001 — 执行资源供给、可解释放置、原子准入与资源预留 | PCF-702, PCF-704 | 工程优先级、review 角色/资格需求和可选平台业务拓扑 |

[Migration history](MIGRATION_HISTORY.md) · [Machine-readable transfers](MIGRATION_MANIFEST.json)

Revision2 wave order replaces the earlier recommended order: A:700→701/706/725/726→708; B:702/704/709→710/707; C:703/711/712/713→705, and727 after its accepted dependencies; D:714/715/716→728→724→721. Optional717/718/719/720/722/723 never block the engineering path. Workbook dependencies, not numbering or parent labels, govern execution.

最小工程目标 / Minimum engineering outcome: Alien-origin Codex→Mech real executor→same originating Codex session consumes result, while independent Alien work overlaps. UI-only success is insufficient. No pooled RAM/GPU, arbitrary process takeover, automatic paid API, automatic merge or full DGX/URA/RIV/FR activation is implied.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **76**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| en | 38 | [打开 / Open](en/README.md) |

### 本目录说明 / Local documents

- [ACTIVATION_AND_EXTENSION.md](ACTIVATION_AND_EXTENSION.md)
- [ACTIVATION_RECEIPT_2026_10_07.md](ACTIVATION_RECEIPT_2026_10_07.md)
- [ACTIVATION_RECEIPT_2026_10_07_PCF-701.md](ACTIVATION_RECEIPT_2026_10_07_PCF-701.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [CHILD_WORKBOOK_TEMPLATE.md](CHILD_WORKBOOK_TEMPLATE.md)
- [EXECUTION_CONTRACT.md](EXECUTION_CONTRACT.md)
- [MIGRATION_HISTORY.md](MIGRATION_HISTORY.md)
- [PCF-700-ownership-and-reality-audit.md](PCF-700-ownership-and-reality-audit.md)
- [PCF-701-live-resource-telemetry.md](PCF-701-live-resource-telemetry.md)
- [PCF-702-explainable-placement.md](PCF-702-explainable-placement.md)
- [PCF-703-pipeline-offload-and-streams.md](PCF-703-pipeline-offload-and-streams.md)
- [PCF-704-admission-reservations-and-fairness.md](PCF-704-admission-reservations-and-fairness.md)
- [PCF-705-recovery-and-safe-replacement.md](PCF-705-recovery-and-safe-replacement.md)
- [PCF-706-policy-consent-and-data-boundaries.md](PCF-706-policy-consent-and-data-boundaries.md)
- [PCF-707-research-trace-and-replay-adapter.md](PCF-707-research-trace-and-replay-adapter.md)
- [PCF-708-workload-envelope-and-qos.md](PCF-708-workload-envelope-and-qos.md)
- [PCF-709-artifact-locality-and-cache.md](PCF-709-artifact-locality-and-cache.md)
- [PCF-710-headless-execution-and-isolation.md](PCF-710-headless-execution-and-isolation.md)
- [PCF-711-checkpoint-and-resume-contract.md](PCF-711-checkpoint-and-resume-contract.md)
- [PCF-712-durable-supervision-and-fencing.md](PCF-712-durable-supervision-and-fencing.md)
- [PCF-713-interference-and-slo-protection.md](PCF-713-interference-and-slo-protection.md)
- [PCF-714-origin-surface-continuity.md](PCF-714-origin-surface-continuity.md)
- [PCF-715-resource-control-and-monitor.md](PCF-715-resource-control-and-monitor.md)
- [PCF-716-unattended-deployment-and-rollback.md](PCF-716-unattended-deployment-and-rollback.md)
- [PCF-717-model-residency-and-serving.md](PCF-717-model-residency-and-serving.md)
- [PCF-718-linux-worker-onboarding.md](PCF-718-linux-worker-onboarding.md)
- [PCF-719-android-edge-companion.md](PCF-719-android-edge-companion.md)
- [PCF-720-accelerator-power-and-thermal.md](PCF-720-accelerator-power-and-thermal.md)
- [PCF-721-controlled-systems-study.md](PCF-721-controlled-systems-study.md)
- [PCF-722-controller-continuity-and-ha.md](PCF-722-controller-continuity-and-ha.md)
- [PCF-723-adaptive-placement-research.md](PCF-723-adaptive-placement-research.md)
- [PCF-724-multi-application-workload-pilots.md](PCF-724-multi-application-workload-pilots.md)
- [PCF-725-execution-provider-contract-and-boundaries.md](PCF-725-execution-provider-contract-and-boundaries.md)
- [PCF-726-execution-capsule-and-result-evidence.md](PCF-726-execution-capsule-and-result-evidence.md)
- [PCF-727-engineering-connector-live-execution.md](PCF-727-engineering-connector-live-execution.md)
- [PCF-728-originating-agent-remote-job-bridge.md](PCF-728-originating-agent-remote-job-bridge.md)
- [RESEARCH_AND_RELEASE.md](RESEARCH_AND_RELEASE.md)

<!-- DOCUMENT_NAVIGATION:END -->

<!-- SERIES_DASHBOARD:START -->
## 任务快速面板 / Task dashboard

自动读取canonical工作书；本表不提供领取锁或额外authority。 / Generated from canonical workbooks; this table grants no claim lock or extra authority.

总完成 / Complete 1/2 · 开发 / Development 2/2 · 复检 / Review 1/2 · `IN_PROGRESS`

| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |
|---|---|:---:|:---:|:---:|
| [PCF-700](PCF-700-ownership-and-reality-audit.md) | COMPLETE | YES | YES | YES |
| [PCF-701](PCF-701-live-resource-telemetry.md) | IN_PROGRESS | YES | NO | YES |

<!-- SERIES_DASHBOARD:END -->
