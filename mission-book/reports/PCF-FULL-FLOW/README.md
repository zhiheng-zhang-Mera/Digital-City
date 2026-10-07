# PCF 全线本机施工记录 / PCF complete-line local development record

**全系列尚未完成，尚未交付对侧验收。 / Programme incomplete; not yet handed to the opposite host.**

源码候选 / Source candidate: `998440c7772cc032d012b457c2a59cd1059826c0` on `pcf/full-flow-alien-pending-verification-20261007`.

交接方式：`SINGLE_BATCH_OPPOSITE_HOST_VERIFICATION`。整条完整流完成本机施工后一次性交给 Mech，不分拆逐任务异机验收。本日志不把本机成功当作全任务书完成，也不把新分支标记为 main 可合并。

Handoff: once local development is ready, submit the complete flow once to Mech. No individual physical-validation handoffs. Local success does not establish complete workbook coverage or main-merge readiness.

目前实际运行：两种 CPU 应用由既有 canonical Task/Action、准入、工件、子进程和回执返回发起会话，并分别确认消费；源码树干净，pilot 记录精确 SHA。GPU 为真实驱动观测。 / Actual run: two CPU apps traverse existing canonical Task/Action, admission, artifacts, child processes and receipts back to the origin session, each with explicit consumption. Clean sources and exact SHA recorded by the pilot. GPU data comes from the actual driver.

本机 PCF 组合测试 71/71；独立审查四个重要问题全部 RED→GREEN。首次总回归 1530 项中 1526 通过、4 失败：3 项拒绝干扰占用 4389 的既有 City，另 1 项为高并发下的既有时间限制。低并发可运行集合日志继续保留，不抹去首次失败。 / Focused PCF checks: 71/71. Four Important independent-review findings repaired RED→GREEN. Initial broad regression: 1526/1530 pass, four failures (three protect the resident City on port 4389; one existing timing bound under high concurrency). Lower-concurrency available-set logs are retained without erasing the initial failures.

| 任务 / Book | 本机状态 / Local state | 事实与缺口 / Facts and gaps |
|---|---|---|
| PCF-700 | HISTORICAL_ACCEPTED | 保留既有审计验收；本候选不重新宣称验收 / Preserve prior audit acceptance; no new candidate acceptance |
| PCF-701 | LOCAL_REPAIR_CANDIDATE | Windows CPU 修复与原 701 测试；新候选异机验收待执行 / Windows CPU repair and original tests; candidate cross-host review pending |
| PCF-702 | PARTIAL_COMPONENT | 可行性/成本区间/稳定排序；真实跨机成本校准缺失 / Feasibility, intervals and stable ranking; actual cross-host calibration absent |
| PCF-703 | PARTIAL_LOCAL_FLOW | 本机 DAG/并行/credit；RF 跨机流和重连尚未接通 / Local DAG, concurrency and credit; RF remote streams/reconnect not integrated |
| PCF-704 | CANONICAL_LOCAL_SERVICE_CANDIDATE | 常驻本机队列、公平排序、原子准入/配额/epoch 已接入；实体多端争用待验证 / Resident local queue, fairness, atomic admission/quota/epochs wired; physical multi-host contention pending |
| PCF-705 | FENCED_LOCAL_RECOVERY_CANDIDATE | 精确归属停止证明前后重验授权，以原 Task/Action 新 generation 重试 PURE；跨设备恢复未接实机 / Current authority revalidated around exact owned-stop proof; same Task/Action PURE retry with new generation; physical cross-device recovery absent |
| PCF-706 | CURRENT_AUTHORITY_BOUNDARY_CANDIDATE | 远程 port 同事务检查当前 owner/worker 版本；实际授权基础与跨机接口未接 / Remote port checks current owner/worker versions in transaction; actual authority substrate and cross-host endpoints not wired |
| PCF-707 | LOCAL_REX_STUDY_CANDIDATE | 真实 canonical EventRecord/REX collector/持久化重建，失败全保留；正式 campaign/fault/export 待运行 / Actual canonical EventRecord, REX collector and persisted replay; KEEP_ALL; formal campaign/fault/export pending |
| PCF-708 | PARTIAL_COMPONENT | 不可变负载及身份/单位/版本边界；旧 product 路径未全部接入 / Immutable workload and identity/unit/version boundaries; legacy product wiring incomplete |
| PCF-709 | RESUMABLE_STORAGE_CANDIDATE | 可恢复传输、pin/lease/cache、配额、发布/删除 journal 故障修复已审；实机磁盘/恢复待验证 / Resume, pins/leases/cache, quota and publication/deletion journal repairs reviewed; physical disk/recovery pending |
| PCF-710 | ACTUAL_CPU_REMOTE_COMPONENT_CANDIDATE | 本机 CPU 子进程及 headless/WBC remote port 组件；真实 Mech 传输/grant 与进程树/OS 强隔离待验证 / Actual local CPU and headless/WBC remote port component; actual Mech transport/grants, process tree and enforced isolation pending |
| PCF-711 | FENCED_CHECKPOINT_CANDIDATE | 显式兼容与新 attempt restore fence/一次性 claim 已测试；实体跨设备恢复待验 / Explicit compatibility, new-attempt restore fence and one-time claim tested; physical cross-device restore pending |
| PCF-712 | DURABLE_LOCAL_SERVICE_CANDIDATE | PID 归属先落盘再 stdin，supervisor 排他、drain fencing、未知不释放；重启/故障整矩阵未执行 / PID persisted before stdin, exclusive supervisor, drain fencing and unknown retention; complete restart/fault matrix not run |
| PCF-713 | REVERSIBLE_QUEUE_PROTECTION_CANDIDATE | 显式有界 observer、当前授权、降并行/拒后台、禁用恢复已接本机队列；真实前台开关对照未测 / Explicit bounded observer/current authority, queue reduction/background refusal and disable restore wired; real foreground on/off comparison unmeasured |
| PCF-714 | ORIGIN_BOUND_LOCAL_RESULT_CANDIDATE | canonical Task.result 引用、原会话读取/明确 ack、禁止 browser ack 冒充 Agent；三实体 surface/真实 Agent 待验证 / Canonical result reference, origin-bound read/ack; browser ack is not Agent consumption; physical surfaces/actual Agent pending |
| PCF-715 | OPT_IN_WEB_CONTROL_CANDIDATE | 默认只读；显式获批本机服务可运行/取消/读取，真实浏览器跨刷新验证；原生 PCF 专用控制待验证 / Default readonly; explicitly approved local run/cancel/read, actual browser refresh validation; native PCF-specific controls pending |
| PCF-716 | REVERSIBLE_DEPLOYMENT_CANDIDATE | opt-in preflight/drain/canary/rollback、进程归属/reparse 防护组件已审；OS service/autostart/重启待验证 / Reviewed opt-in preflight/drain/canary/rollback and ownership/reparse protection; OS service/autostart/reboot pending |
| PCF-717 | PREREQUISITE_NOT_PROVEN | 没有获准模型/runtime/许可及冷暖测量；遵守额外门，不安装模型 / No approved model/runtime/license or cold/warm measurements; prerequisite gate retained, no model installed |
| PCF-718 | LINUX_CI_COMPONENT_CANDIDATE | 便携固定 worker 在独立 Ubuntu CI 实际通过；Alien 无 WSL runtime，实体 Linux worker 未安装验收 / Portable fixed worker passed actual isolated Ubuntu CI; Alien has no WSL runtime, physical Linux worker not installed/accepted |
| PCF-719 | ANDROID_OPT_IN_WORKER_COMPONENT | 默认关闭的前台 worker、独立 principal handle/OS gates/生命周期已开发，121 native tests/APK 构建；grant 集成/手机安装实测待验证 / Disabled-by-default foreground worker, separate principal handle, OS/lifecycle gates; 121 native tests/APK build; grant integration/phone install pending |
| PCF-720 | ACTUAL_GPU_CONSTRAINT_CANDIDATE | 实际 UUID/driver/VRAM/功率/温度、701 adapter、UNKNOWN 区分与安全约束；GPU/NPU 工作负载和能耗未测 / Actual UUID/driver/VRAM/power/temperature, 701 adapter, UNKNOWN distinction/safety constraints; GPU/NPU execution and joules unmeasured |
| PCF-721 | FROZEN_LOCAL_REX_STUDY_CANDIDATE | 真实 source SHA/dirty/index binding、重复 CPU/失败保留、REX replay 与反事实消融；正式跨机多策略实验未运行 / Actual source/dirty/index binding, repeated CPU, KEEP_ALL, REX replay and counterfactual ablation; formal cross-host multi-policy study not run |
| PCF-722 | PREREQUISITE_BLOCKED_NOT_RUN | 缺独立存储与 fencing 基础，按明确硬门不启动 HA 实现 / No independent storage/fencing substrate; explicit hard prerequisite gate prevents starting HA implementation |
| PCF-723 | SHADOW_SHIELD_PREREQUISITE_PENDING | 可行性 shield 影子比较不 dispatch；冻结正式基线短板与留出集缺失，不宣称学习完成 / Feasibility-shield shadow comparison cannot dispatch; formal frozen baseline shortcoming and held-out evidence absent, no learning completion claim |
| PCF-724 | ACTUAL_LOCAL_APPLICATION_COMPONENTS | 两个真实 CPU 应用、本机浏览器/原会话及工程 Node fixture；真实双机 Codex 并行工程仍 NOT_RUN / Two actual CPU apps, browser/origin and engineering Node fixture; actual two-host concurrent Codex engineering NOT_RUN |
| PCF-725 | CONNECTOR_RUNTIME_COMPONENT_CANDIDATE | 复用 ConnectorPort，固定 argv/env/隔离 worktree/有界回执与控制；真实 provider conformance 未跑 / Existing ConnectorPort, fixed argv/env, isolated worktree, bounded receipts/control; real provider conformance not run |
| PCF-726 | CAPSULE_RUNTIME_BINDING_CANDIDATE | Task/action/session/epoch/digest 与实际归属校验，工程 canonical SHA/worktree 固定；真实 provider 与所有工程权限整链待验证 / Task/action/session/epoch/digest ownership, fixed engineering canonical SHA/worktree; actual provider and full engineering permission chain pending |
| PCF-727 | DURABLE_ENGINEERING_COMPONENT_CANDIDATE | 真实 Codex help/version 与实际 Node JSONL fixture；先持久 PID、退出回执、callback deadline/fence；实际 provider/resume/进程树 NOT_RUN / Actual CLI help/version and Node JSONL fixture; durable PID/exit receipt and callback deadline/fence; real provider/resume/process tree NOT_RUN |
| PCF-728 | CANONICAL_CALLER_COMPONENT_CANDIDATE | 真实 SQLite/admission/capsule/artifact/Node fixture，经同 caller 读 42 继续为 43 再 ack；实际 Codex MCP/远端 parent-session 未验 / Real SQLite/admission/capsule/artifact/Node fixture: same caller reads 42, continues to 43, then ack; actual Codex MCP/remote parent-session unverified |

全部条目的新异机验收均为 NOT_RUN；原 PCF-700 历史验收不改写。任务池原 claim、review 状态不被本候选覆盖。 / New cross-host acceptance is NOT_RUN throughout; historical PCF-700 acceptance and original pool claims/reviews remain unchanged.

复现说明 / Reproduction: Utopia `docs/{zh-CN,en}/pcf/full-flow-candidate.md`. 中间日志与摘要 / Logs and hashes: [INDEX](intermediate-logs/2026-10-07-alien/INDEX.json).

阶段 B/C 施工轮次 / Stage B/C development round: [raw logs and SHA256 index](intermediate-logs/2026-10-07-alien-stage-bc/INDEX.json). 包含失败、修复、局部组合、Android 构建、真实 Web 浏览器和驱动采样记录。此轮组件运行时工作树仍在施工，不能把 HEAD 当作全部日志的冻结执行版本；最终冻结候选需另行验证。 / Includes failures, repairs, component composition, Android build, actual Web browser and driver observations. The checkout was under development during these component runs; the archive HEAD does not bind every log to a frozen source. Final candidate verification is separate.

阶段 A 勘误 / Stage A erratum: 15b1e61 的 Task 成功状态为 SUCCEEDED，不符合既有 canonical Task 终态；后续源码 eec9284 修为 COMPLETED，原 Action/capsule outcome 仍为 SUCCEEDED。历史 CPU/pilot 日志保留，不能升级为完整契约或异机验收。 / The historical Task used SUCCEEDED outside the canonical Task terminal vocabulary. Later source eec9284 uses COMPLETED while Action/capsule retain SUCCEEDED. Historical CPU evidence remains, without upgrading contract or physical acceptance.

低并发可运行回归最终输出为 1538/1538，通过前已发布的流式片段另存为 in-progress-snapshot；运行期间后续组件继续施工，因此不绑定为最终整树证据。三个 4389 launcher 用例仍保持环境阻塞。 / The lower-concurrency available set ended 1538/1538; the previously archived streaming fragment remains separately preserved. Components continued to change during that run, so it is not final whole-source evidence. Three port-4389 launcher cases remain environment-blocked.
