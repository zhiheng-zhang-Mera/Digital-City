# REX-805 研究材料索引 / Research-material index

研究过程与实验材料同时保存，不能把缺失观测填成0或把开发交付当作验收。 / Engineering-process and experiment materials are retained together; missing observations are not zero, and development handover is not acceptance.

| 材料 / Material | 范围 / Scope |
|---|---|
| [领取记录 / Claim](CLAIM_REPORT.md) | 精确依赖基线 / Exact dependency baseline |
| [开发检查点 / Checkpoint](DEVELOPMENT_CHECKPOINT.md) | 失败、六项修复、空限制回归、CI与完整套件 / Failures, six repairs, empty-limit regression, CI and full suites |
| [开发交付 / Handover](DEVELOPMENT_HANDOFF.md) | 最终候选0261a9e与前驱实体证据的独立绑定 / Separate final0261a9e and predecessor physical bindings |
| [实体交接 / Physical instructions](PHYSICAL_GATE_HANDOFF_Alien.md) | 原run、digest、Owner执行与导出要求 / Source run, digest, Owner execution and exports |
| [Mech实体结果 / Mech physical result](PHYSICAL_GATE_RESULT_Mech.md) | 前驱4b39468实体Replay/消融，非正式复检 / Predecessor4b39468 physical Replay/Ablation, not formal review |
| [原始材料 / Raw packet](evidence/MATERIAL_INDEX.md) | 原source、新receipt、registry、规范任务、比较与运行日志 / Source/new receipts, registry, canonical tasks, comparisons and run log |
| [独立检查 / Independent checks](independent-material-checks-Alien.json) · [只读程序 / Read-only verifier](independent-verify-Alien.py) | 63/63，独立重算hash/seed/关联字段，不使用产品引擎 / 63/63, independently derived hashes, seed and bindings without the product engine |
| [Mech就绪测量 / Readiness](REVIEW_READINESS_MECH.md) · [可行性仪器 / Feasibility](REPLAY_FIXTURE_FEASIBILITY_MECH.md) | 独立仪器、合成前提及其限制，不能替代实体证据 / Independent instruments, synthetic preconditions and limits, not physical evidence |

共享包有界保留。完整本地测试日志位于开发检查点给出的Alien路径，并未假装所有日志均已发布。原始材料以 `.gitattributes -text` 禁止换行转换；索引外读本和验证结果不能混入原始payload。 / Shared materials are bounded. Complete local test logs remain at the Alien paths stated in the checkpoint; publication of every log is not claimed. `.gitattributes -text` preserves raw bytes. Reading views and verification output belong outside the raw payload.

正式复检、最终候选实体部署、手持渲染与用户意图观察没有因本索引而获得PASS。 / This index grants no PASS to formal review, final-candidate physical deployment, handset rendering or intent observations.


追加 / Addition: [最终0261a9e原始实体包 / Final0261a9e physical packet](evidence-repaired/MATERIAL_INDEX.md)、[63/63独立核验 / Independent checks](independent-repaired-material-checks-Alien.json)、[官方MEMBER现场任务读取 / Official-MEMBER live task observation](independent-live-repaired-tasks-Alien.json)。此前 final physical NOT_OBSERVED 是历史状态，现材料绑定至精确最终候选；正式复检与手持渲染仍不因该绑定变成已验收。 / The earlier unobserved-final-physical state is historical; current materials bind the exact final candidate. This binding does not accept formal review or handset rendering.
