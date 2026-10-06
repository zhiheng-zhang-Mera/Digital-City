# Research Signal Watchlist / 研究信号观察清单

[英文机器可读规范](./RESEARCH_SIGNAL_WATCHLIST.yaml) · [常驻规则](./CONSTRUCTION_RULES.md) · [Mission Book导航](./README.md)

本页是 `RESEARCH_SIGNAL_WATCHLIST.yaml` 全部解释字段的中文对照。机器读取的ID、topic键、grade、capture_level与原始YAML保持不变；本页不建立额外authority或评级。

schema_version：1；snapshot_date：2026-10-05；status：ACTIVE。

用途：为正常Mission Book施工预分类研究信号。Agent应按此清单标注实际观察到的episode，而不是自行发明新颖性声明。

## 评级与采集预算

| 评级 | capture_level | 解释 |
|---|---|---|
| G1_MATURE | MINIMAL | 成熟工程实践，仅作背景 |
| G2_CROWDED | STANDARD | 活跃且重要，但研究拥挤 |
| G3_SPARSE_ACTIVE | PRIORITY | 明确现象，直接研究稀疏 |
| G4_RARE_SYSTEMIC | MAXIMUM_BOUNDED | 完整表述/系统证据罕见；声明前重新核查文献 |

## 完整topic对照与采集条件

| ID | Grade | 原始topic / 中文含义 | capture_when / 采集时机 |
|---|---|---|---|
| RS-G1-IMMUTABLE-VERSION | G1_MATURE | branch_to_exact_sha / 从branch到精确SHA | 仅具体失败或返工 |
| RS-G1-VERTICAL-SLICE | G1_MATURE | classic_vertical_slice / 经典垂直切片 | 仅具体Agent失败 |
| RS-G1-TRACEABILITY | G1_MATURE | generic_requirements_code_traceability / 通用需求与代码可追溯性 | 仅具体失败 |
| RS-G2-COMPACTION | G2_CROWDED | context_compaction_timing_and_content / 上下文压缩时机与内容 | 正常telemetry；只有与G3/G4交叉时高优先采集 |
| RS-G2-EXEC-MEMORY | G2_CROWDED | generic_execution_state_memory / 通用执行状态记忆 | 正常telemetry |
| RS-G2-FALSE-SUCCESS | G2_CROWDED | generic_false_completion_and_evidence_contracts / 通用错误完成与证据contract | 正常telemetry |
| RS-G2-ASYNC-MULTIAGENT | G2_CROWDED | generic_async_multi_agent_coordination / 通用异步多Agent协作 | 正常telemetry |
| RS-G2-CROSS-MODEL-REVIEW | G2_CROWDED | generic_cross_model_review / 通用跨模型复检 | 正常telemetry |
| RS-G2-EVOLVING-SPEC | G2_CROWDED | evolving_user_requirements / 演化用户需求 | 正常telemetry |
| RS-G2-REPO-RULES | G2_CROWDED | generic_repository_instruction_files_and_rule_learning / 通用仓库instruction文件与规则学习 | 正常telemetry；AGENTS.md/规则学习本身不得作为novelty |
| RS-G2-LONGITUDINAL-MAINTENANCE | G2_CROWDED | generic_long_horizon_maintenance_and_technical_debt / 通用长时维护与技术债务 | 正常telemetry；SWE-CI/SlopCodeBench/ChainSWE/EvoClaw已覆盖宽泛现象 |
| RS-G2-MERGE-CONFLICT | G2_CROWDED | generic_agent_merge_conflict_and_concurrent_editing / 通用Agent合并冲突与并发编辑 | 正常telemetry；仅超越文本冲突的语义集成优先 |
| RS-G2-ACTION-BIAS | G2_CROWDED | generic_agent_abstention_action_bias_and_scope_expansion / 通用Agent拒绝行动、行动偏向与范围扩张 | 正常telemetry；FixedBench/OverEager类现象已有直接研究 |
| RS-G2-OBSERVABILITY-DEBT | G2_CROWDED | generic_agent_generated_logging_observability_debt / 通用Agent生成的日志与可观测性债务 | 正常telemetry；仅影响control-plane可观测性或纵向证据质量时优先 |
| RS-G3-EXEC-WORK-ARTIFACT | G3_SPARSE_ACTIVE | repository_resident_executable_work_state / 仓库内持久可执行工作状态 | 涉及claim/resume/review/证据绑定任务状态 |
| RS-G3-IDENTITY-PROVENANCE | G3_SPARSE_ACTIVE | execution_identity_provenance_freshness / 执行identity、provenance与freshness | SHA/ancestry/证据绑定/reconciliation改变结果 |
| RS-G3-STRUCTURED-HANDOFF | G3_SPARSE_ACTIVE | structured_handoff_with_exact_state / 带精确状态的结构化接力 | 后继Agent/模型/主机恢复中断工作 |
| RS-G3-DYNAMIC-LIVENESS | G3_SPARSE_ACTIVE | dynamic_async_liveness_and_eligibility / 动态异步活性与领取资格 | 零领取/等待/唤醒/角色资格/no-idle逻辑起作用 |
| RS-G3-INDEPENDENT-REVIEW-BOUNDARY | G3_SPARSE_ACTIVE | independent_review_as_state_and_evidence_boundary / 独立复检作为状态与证据边界 | Reviewer独立重建状态或证伪用户/runtime路径 |
| RS-G3-REGISTRY-ONBOARDING | G3_SPARSE_ACTIVE | capability_registry_assisted_agent_onboarding / 能力登记册辅助Agent接入 | Registry改变搜索/定位/重复实现行为 |
| RS-G3-OWNER-INTERVENTION-TAXONOMY | G3_SPARSE_ACTIVE | naturalistic_owner_intervention_causes / 自然发生的Owner介入原因 | Owner必须恢复/纠正/解除阻塞/重设工作框架 |
| RS-G3-RULE-LIFECYCLE-DEBT | G3_SPARSE_ACTIVE | repository_rule_lifecycle_provenance_supersession_and_retirement / 仓库规则生命周期、来源、替代与退役 | 根据失败证据新增规则；规则冲突、过时、被替代，或产生可测开销/错误阻塞 |
| RS-G3-SUPERVISION-ATTENTION | G3_SPARSE_ACTIVE | owner_attention_fragmentation_escalation_quality_and_batching / Owner注意力碎片化、升级质量与批处理 | 介入可按原因、决策价值、可避免性、批处理或打断成本分类 |
| RS-G3-SEMANTIC-INTEGRATION | G3_SPARSE_ACTIVE | semantic_integration_conflict_beyond_textual_merge / 超越文本合并的语义集成冲突 | 独立绿色/已接受分支或能力文本合并干净，但产品语义、依赖、ownership或runtime行为冲突 |
| RS-G4-UNIFIED-CONTROL-PLANE | G4_RARE_SYSTEMIC | unified_repository_control_plane / 统一仓库控制平面 | 多个MissionBook/Registry/identity/evidence/liveness机制交互 |
| RS-G4-CAPABILITY-STATE | G4_RARE_SYSTEMIC | implementation_wiring_reachability_intent_state / 实现、接线、可达、意图状态 | 能力在implementation/wiring/reachability/intent状态间转换 |
| RS-G4-AUTONOMY-SURVIVAL | G4_RARE_SYSTEMIC | autonomy_survival_until_owner_intervention / 直到Owner介入前的自治存续 | 可观察长时自治运行或任务池drain |
| RS-G4-REALITY-DRIFT | G4_RARE_SYSTEMIC | control_plane_reality_drift / 控制平面现实漂移 | MissionBook/Registry/Git/CI/UI真相不一致 |
| RS-G3-USER-REACHABLE-TERMINAL | G3_SPARSE_ACTIVE | user_reachable_completion_as_terminal_condition / 用户可达完成作为终态条件 | 内部/测试完成与普通用户完成不同；邻近false-success和user-like validation已有研究 |
| RS-G3-PASSIVE-EVIDENCE-PIPELINE | G3_SPARSE_ACTIVE | passive_development_to_research_evidence_pipeline / 被动开发到研究证据流水线 | 正常开发证据变成可重用纵向/replay材料；已有真实session trace采集，优先City特有control-plane证据 |
| RS-G2-GENERIC-AGENT-MONITOR | G2_CROWDED | generic_agent_monitoring_dashboard_topology_and_logs / 通用Agent监控仪表盘、拓扑与日志 | 仅正常telemetry；仪表盘/图/日志可视化本身不是novelty |
| RS-G3-HIERARCHICAL-RISK-BUBBLING | G3_SPARSE_ACTIVE | hierarchical_operational_observability_with_risk_bubbling / 风险上浮的分层运行可观测性 | overview/progressive-disclosure摘要隐藏低价值细节时必须保留active risk |
| RS-G3-EDGE-CAUSAL-OBSERVABILITY | G3_SPARSE_ACTIVE | edge_centric_causal_observability_for_handoff_retry_review_and_routing / 面向handoff、retry、review、routing的边因果可观测性 | 理解工作为何移动/变化需要路径/边provenance，单纯节点状态不足 |
| RS-G3-OBSERVE-DECIDE-DECOUPLING | G3_SPARSE_ACTIVE | continuous_observation_with_event_triggered_nonblocking_decision / 持续观察与事件触发非阻塞决策 | JEV/observer、decision queue、timeout/fallback或同步行为影响任务进展 |
| RS-G3-DECISION-ESCALATION-PROVENANCE | G3_SPARSE_ACTIVE | rule_fast_model_critic_owner_escalation_provenance / rule、fast model、critic、Owner升级来源 | 状态跃迁被自动解决或升级，且decision source/latency/Owner打断可观察 |

## 全部规则

- G1/G2不得触发research-only make-work。
- G3/G4 episode在有界且可观察时应保留before/after和精确证据。
- 任何评级都不保证novelty；发表前必须更新文献。
- 绝不采集隐藏chain-of-thought。
- 不在清单中的信号记录为 `UNCLASSIFIED_CANDIDATE`，不得自行发明评级。
