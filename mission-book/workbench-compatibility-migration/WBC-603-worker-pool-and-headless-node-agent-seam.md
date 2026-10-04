---
workbook_id: WBC-603
phase: WORKBENCH_COMPATIBILITY_MIGRATION
sequence: 603
execution_enabled: true
status: WAITING_DEPENDENCIES
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["9f3e20e8ec99d591812430bee71d27e68c4ad498"]
dependency_source_workbooks: ["WBC-601","WBC-602"]
dependency_source_shas: []
development_baseline_sha: null
baseline_resolution_evidence: null
baseline_blocker: DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE
dependencies: ["WBC-601:EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED", "WBC-602:NODE_CAPABILITY_RESOURCE_COMPAT_ACCEPTED"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/WBC-603
terminal_marker: WORKER_POOL_AGENT_SEAM_ACCEPTED
---

# WBC-603 — Dormant Worker Pool Backend + Headless Node Agent Seam

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> **Programme：** [README.md](./README.md)
>
> **重要：当前没有真实 Workbench 也不需要真实 Workbench。** 本任务只建立以后可直接接入的 seam，并使用 deterministic test double / local bounded agent 做 contract proof。

## 目标

在 WBC-601 backend contract 与 WBC-602 node descriptor 之上，增加一个默认 dormant 的 `WORKER_POOL` backend 与 headless node agent contract。

未来物理工作台只需要实现/启动这个 contract，而不是要求 Utopia 业务层再次迁移。

## Headless Node Agent 最低 contract

至少覆盖：

```text
register(identity, roles, capabilities, resources)
heartbeat(load, health, readiness)
claim/receive eligible work
report RUNNING / progress / result / terminal
cancel / stop
drain
resume after restart
credential/trust handle reference
version/protocol compatibility
```

允许具体 transport 复用现有 Remote Fabric / Gateway 公共 contract；不得为本任务重写 transport。

## Dormant hard rule

当前默认运行：

```text
STANDARD_DEVICES
```

即使 WORKER_POOL 代码存在：

- 不得自动连接不存在的 server；
- 不得 background busy-loop discovery；
- 不得延长普通 Utopia startup；
- 不得让 health dashboard 因“没有工作台”变红；
- 不得抢占当前 Windows task；
- 不得让旧 Windows worker 改用新 agent 才能继续工作。

## 测试策略

没有真实工作台时使用 deterministic Worker Pool double，至少证明：

1. backend 可注册；
2. fake headless node 可 advertise descriptor；
3. readiness healthy 时可接受 bounded canary task；
4. unavailable 时 typed unavailable；
5. cancel/report/result semantics 与 canonical task truth 对齐；
6. agent restart 不产生 duplicate execution；
7. drain 后不接新任务；
8. 移除 fake pool 后 STANDARD_DEVICES 继续工作。

不得把 test double PASS 写成“真实 Workbench 已验收”。

## 禁止修改边界

- 不实现完整 distributed cluster manager；
- 不实现 HA/failover 主从；
- 不要求 Docker/Kubernetes；
- 不引入新的 canonical queue；
- 不让 Worker Pool agent 保存原始长期 secrets 到 shared task state；
- 不改变 current Windows bootstrap；
- 不宣称 Linux/macOS compatibility 已实机验证。

## Formal Review

另一实体主机必须：

- 独立构造 unavailable / crash / restart / duplicate / drain 攻击；
- 证明 fake pool 挂掉不会拖死 STANDARD_DEVICES；
- 检查 agent 是否成为第二套 task truth；
- 检查没有 hidden startup dependency；
- 重测 exact-head CI。

## 完成门槛

1. dormant Worker Pool backend seam 存在；
2. headless node agent contract 存在；
3. deterministic double 完成 bounded E2E；
4. unavailable/crash/restart/drain fail-honest；
5. STANDARD_DEVICES 在 pool absent 后继续完整运行；
6. opposite-host Review PASS；
7. exact-head CI green；
8. terminal marker `WORKER_POOL_AGENT_SEAM_ACCEPTED`。

## Reports

- `mission-book/reports/WBC-603/DEVELOPMENT_REPORT.md`
- `mission-book/reports/WBC-603/REVIEW_REPORT.md`
