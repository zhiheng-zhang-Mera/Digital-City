# PCF 全线本机施工记录 / PCF complete-line local development record

**全系列尚未完成，尚未交付对侧验收。 / Programme incomplete; not yet handed to the opposite host.**

源码候选 / Source candidate: `15b1e61280ecc8b5a5c755882446e753fec7b6bf` on `pcf/full-flow-alien-pending-verification-20261007`.

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
| PCF-704 | PARTIAL_COMPONENT | 原子准入/身份/配额/公平队列；队列与准入尚需常驻整合 / Atomic admission, identity, quotas, fair queue; resident queue integration remains |
| PCF-705 | PROPOSAL_ONLY | 恢复决策拒绝不确定副作用；迁移闭环未实现 / Recovery proposals reject uncertain side effects; migration loop unimplemented |
| PCF-706 | PARTIAL_COMPONENT | 策略收窄及费用/分享拒绝；实际远端各阶段授权整合缺失 / Narrowed policy and fee/sharing refusal; real remote stage authority wiring absent |
| PCF-707 | PARTIAL_COMPONENT | 复用 REX canonical trace；基线/消融/重放组合未完成 / Reuses REX canonical trace; baseline/ablation/replay integration incomplete |
| PCF-708 | PARTIAL_COMPONENT | 不可变负载及身份/单位/版本边界；旧 product 路径未全部接入 / Immutable workload and identity/unit/version boundaries; legacy product wiring incomplete |
| PCF-709 | PARTIAL_COMPONENT | 真实摘要存储/跨实例锁/配额；pin/eviction/断点传输/崩溃清理未完成 / Actual digest storage, writer lock and quotas; pins/eviction/resume/crash cleanup incomplete |
| PCF-710 | ACTUAL_LOCAL_CPU_PARTIAL | 真实固定 CPU 子进程；跨主机 WBC、强 OS 隔离和工程进程树未完成 / Actual fixed CPU process; remote WBC, enforced OS isolation and engineering process tree incomplete |
| PCF-711 | ACTUAL_LOCAL_RESTORE_PARTIAL | 本机 sum checkpoint 恢复一致；跨设备恢复未验证 / Local sum checkpoint restores correctly; cross-device restore unverified |
| PCF-712 | PARTIAL_COMPONENT | 既有 Store/CAS/epoch/reconcile；常驻启动与完整故障矩阵未完成 / Existing Store/CAS/epochs/reconcile; resident startup and complete fault matrix incomplete |
| PCF-713 | PROPOSAL_ONLY | 可逆 SLO 建议与 cooldown；真实干扰保护开关对照未测 / Reversible SLO proposals and cooldown; real protection on/off interference unmeasured |
| PCF-714 | PARTIAL_COMPONENT | 原会话授权/cursor/gap 投影；三 surface 跨 worker 验收未执行 / Origin auth/cursor/gap projection; three-surface cross-worker acceptance not run |
| PCF-715 | WEB_READONLY_PARTIAL | Settings 只读真实 Store 状态；控制及 Android 投影未完成 / Settings reads actual Store; controls and Android projection incomplete |
| PCF-716 | DEPLOYMENT_PLAN_ONLY | opt-in/schema 回滚计划；安装、canary、drain 脚本未实现 / Opt-in/schema rollback plans; install/canary/drain scripts unimplemented |
| PCF-717 | PREREQUISITE_NOT_PROVEN | 无已绑定且获准的真实模型运行证据；residency 实现待施工 / No bound authorized model runtime evidence; residency implementation remains |
| PCF-718 | PREREQUISITE_NOT_PROVEN | wsl.exe 存在但当前探测未获得已安装 runtime；Linux worker 待施工 / wsl.exe exists but probe yielded no installed runtime; Linux worker remains |
| PCF-719 | WORKER_NOT_IMPLEMENTED | ADB 实际连接手机为 control client；没有新 worker opt-in/principal/service / ADB phone is an actual control client; no new worker opt-in/principal/service |
| PCF-720 | ACTUAL_GPU_OBSERVATION_PARTIAL | 实际 NVIDIA VRAM/功率/温度；保留/热策略/NPU 未完成 / Actual NVIDIA VRAM/power/temperature; reservations/thermal policy/NPU incomplete |
| PCF-721 | PROTOCOL_ONLY | 冻结 study 配置；正式多策略 REX 实验未运行 / Frozen study configuration; formal multi-policy REX experiments not run |
| PCF-722 | PREREQUISITE_NOT_PROVEN | 没有独立控制存储/旧 writer fencing/failover 证据；HA 未实现 / No independent control storage/old-writer fencing/failover evidence; HA unimplemented |
| PCF-723 | SHADOW_SHIELD_ONLY | 仅可行候选影子检查，不能 dispatch；学习/留出集未实现 / Feasible-candidate shadow checks only, cannot dispatch; learning/held-out validation unimplemented |
| PCF-724 | ACTUAL_LOCAL_CPU_PARTIAL | 两个真实 CPU 应用贯通本机；真实 Codex 双机同时工程闭环未运行 / Two real CPU apps traverse local flow; actual simultaneous two-host Codex engineering not run |
| PCF-725 | PARTIAL_COMPONENT | provider/边界版本契约；manifest/storage/lifecycle 全覆盖未完成 / Provider/boundary version contracts; complete manifest/storage/lifecycle coverage incomplete |
| PCF-726 | PARTIAL_COMPONENT | capsule/回执 host/session/epoch/digest 拒绝路径；工程 SHA/权限完整契约未完成 / Capsule/receipt host/session/epoch/digest refusal; full engineering SHA/permission contract incomplete |
| PCF-727 | CONNECTOR_ADAPTER_PARTIAL | 复用 ConnectorPort；Codex CLI 0.153.0 已观测，不等于 auth/run；实际 provider 未运行 / Existing ConnectorPort; CLI 0.153.0 observed, not auth/run proof; actual provider not run |
| PCF-728 | LOCAL_CONTRACT_PARTIAL | canonical 会话绑定回注和明确消费；实际 Codex tool/远端同 session 尚未整合 / Canonical session-bound delivery/consumption; actual Codex tool/remote same-session integration incomplete |

全部条目的新异机验收均为 NOT_RUN；原 PCF-700 历史验收不改写。任务池原 claim、review 状态不被本候选覆盖。 / New cross-host acceptance is NOT_RUN throughout; historical PCF-700 acceptance and original pool claims/reviews remain unchanged.

复现说明 / Reproduction: Utopia `docs/{zh-CN,en}/pcf/full-flow-candidate.md`. 中间日志与摘要 / Logs and hashes: [INDEX](intermediate-logs/2026-10-07-alien/INDEX.json).
