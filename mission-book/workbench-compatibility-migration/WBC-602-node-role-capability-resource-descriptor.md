---
workbook_id: WBC-602
phase: WORKBENCH_COMPATIBILITY_MIGRATION
sequence: 602
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["9f3e20e8ec99d591812430bee71d27e68c4ad498"]
dependency_source_workbooks: []
dependency_source_shas: []
development_baseline_sha: "0e9bea3ce739b979e582a428af8fb233045a5e75"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-05): baseline_anchor_mode=REMOTE_REF_EXACT_SHA_AT_CLAIM executed literally. `git fetch origin main` in zhiheng-zhang-Mera/utopia resolved refs/heads/main to the full SHA 0e9bea3ce739b979e582a428af8fb233045a5e75 (commit time 2026-10-05T00:23:19+11:00, 'Merge pull request #13 from zhiheng-zhang-Mera/fix/Alien-codex-host-inventory-retry'). required_ancestor_shas[0]=9f3e20e8ec99d591812430bee71d27e68c4ad498 verified with `git merge-base --is-ancestor` -> ANCESTOR_OK, so no BASELINE_ANCESTRY_MISMATCH. Required CI on exactly that sha, read from the Actions API and matched on headSha rather than from the generated UTOPIA_LIVE_STATUS.json: 'V0.2 checks' run 37205444427 COMPLETED SUCCESS and 'City linkage check' run 37205444385 COMPLETED SUCCESS. INDEPENDENCE FROM WBC-601 MEASURED, NOT ASSUMED: WBC-601's branch wbc/WBC-601-execution-backend-contract is NOT an ancestor of this baseline (its head d65dbd3af2d8903aca13726f74110e1f2f6b9b65 is unreviewed and unmerged), so WBC-602 is built on main WITHOUT that seam, exactly as the programme's 'WBC-601 and WBC-602 may be developed in parallel but must never sibling-merge' rule requires. Development worktree: D:/utopia-wbc602 on branch wbc/WBC-602-node-descriptor, created from the resolved baseline SHA. THE SHARED HOT FILE IS services/dev-gateway/server.mjs: WBC-601 relocated the node/claim and node/report route bodies into services/dev-gateway/execution-backend/standard-devices.mjs, and WBC-602 must NOT copy that relocation; it will therefore keep its own change additive and confined to the descriptor projection plus the registration path, leaving the claim decision where main has it."
baseline_blocker: null
dependencies: ["MESH-301:THREE_END_MESH_E2E_ACCEPTED"]
development_host: "Mech"
development_branch: "wbc/WBC-602-node-descriptor"
research_evidence_applicability: "APPLICABLE"
long_horizon_context_evidence: "CAPTURED"
research_evidence_refs: ["mission-book/reports/WBC-602/PAPER_MATERIAL_INDEX.md"]
state_identity_evidence: "CAPTURED"
state_identity_evidence_refs: ["mission-book/reports/WBC-602/PAPER_MATERIAL_INDEX.md"]
development_head_sha: "c312a60b4d73f02597bde1f106372b253067fe33"
development_ci: "V0.2 checks run 37206331839 COMPLETED SUCCESS on headSha c312a60b4d73f02597bde1f106372b253067fe33 (jobs: gateway-web success, android success), read from the Actions API and matched on headSha. No earlier failed run on this branch. Local pre-push evidence on the same head, after the repaired projection defect recorded in reports/WBC-602/DEVELOPMENT_REPORT.md section 5: 13/13 new tests pass; pnpm test 1250 tests / 1247 pass / 3 fail where all 3 are the pre-existing host-city-launcher environmental block (a resident City holds coordination port 4389 on this host, and those tests refuse to run by design); city/test-all.mjs 1984 tests / 1977 pass / 7 skipped / 0 fail; apps/rooms 69/69; check-bilingual SYNCHRONIZED; verify-promotion-history 10 records verified."
development_complete: true
review_host: Alien-codex
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/WBC-602
terminal_marker: NODE_CAPABILITY_RESOURCE_COMPAT_ACCEPTED
---

# WBC-602 — Node Role / Capability / Resource Descriptor 向后兼容化

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> **Programme：** [README.md](./README.md)

## 目标

让未来 scheduler 能按“节点能做什么、资源够不够、当前是否可用”选择执行端，而不是依赖 Alien/Mech/Windows 机器名；同时保证旧节点和旧任务在没有任何新字段时仍能正常运行。

目标数据语义：

```text
NodeDescriptor
├─ stable identity
├─ roles[]
├─ capabilities[]
├─ platform
├─ resources
│  ├─ cpu
│  ├─ memory
│  ├─ gpu / accelerator
│  ├─ vram
│  ├─ disk
│  └─ network hints
├─ current load / availability
├─ health / readiness
└─ trust reference

TaskRequirements (optional)
├─ required capabilities[]
├─ preferred capabilities[]
├─ platform constraints[]
├─ resource minima
├─ accelerator requirement
└─ execution preference
```

这不是要求第一版精确测出所有硬件指标；重点是**稳定 contract + optional fields + legacy defaults**。

## 角色模型最低要求

至少能区分并允许多角色：

- `EXECUTION_NODE`
- `CONTROL_SURFACE`
- `VALIDATION_NODE`
- `SERVER_NODE`
- `STORAGE_NODE`
- `ACCELERATOR_NODE`

当前真实语义必须能表示：

```text
Alien Windows = EXECUTION_NODE + VALIDATION_NODE
Mech Windows  = EXECUTION_NODE + VALIDATION_NODE
Android       = CONTROL_SURFACE
```

不得因为 schema 增加而把 Android 自动注册成 worker。

## 向后兼容硬规则

1. 新字段默认 optional；
2. 旧 node record 可经 compatibility translator 得到保守 descriptor；
3. 旧 task 无 `TaskRequirements` 时仍按现有 STANDARD_DEVICES 行为执行；
4. 缺少 telemetry 只能表示 UNKNOWN / UNSPECIFIED，不能等同于 0 资源或 unhealthy；
5. capability/resource 不得创建第二套 trust/identity；
6. strict target 指向 stable node identity，generic capability routing 不能覆盖它。

## 允许修改边界

- node/capability registry 的 additive schema；
- execution requirement descriptor；
- compatibility/default translation；
- bounded resource/readiness reporting；
- tests / serialization / migration compatibility。

## 禁止修改边界

- 不做复杂 cluster scheduler；
- 不要求真实 Linux；
- 不要求真实 GPU 负载调度；
- 不删除旧字段；
- 不做不可逆 DB migration；
- 不把 resource report 变成 authority；
- 不改变现有 Device trust ownership。

## Formal Review

另一实体主机必须用旧数据/缺字段数据攻击：

- old node record 是否仍能启动/注册；
- old task 是否仍能执行；
- unknown resource 是否被错误判 unavailable；
- Android 是否被误归为 execution node；
- strict target 是否仍优先；
- serialization/restart 后 descriptor 是否稳定。

## 完成门槛

1. stable descriptor contract 存在；
2. legacy translation/default 存在；
3. old node/task 不因缺字段失效；
4. current Alien/Mech/Android role truth 可正确表达；
5. 无真实 Workbench 依赖；
6. opposite-host Review PASS；
7. exact-head CI green；
8. terminal marker `NODE_CAPABILITY_RESOURCE_COMPAT_ACCEPTED`。

## Reports

- `mission-book/reports/WBC-602/DEVELOPMENT_REPORT.md`
- `mission-book/reports/WBC-602/REVIEW_REPORT.md`

本任务与 WBC-601 可并行 Development，但不得 sibling merge；共享 hot file 若冲突，后领取方必须按常驻规则避让，不得复制 canonical implementation。
