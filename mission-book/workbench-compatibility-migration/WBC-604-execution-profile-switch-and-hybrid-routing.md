---
workbook_id: WBC-604
phase: WORKBENCH_COMPATIBILITY_MIGRATION
sequence: 604
execution_enabled: true
status: "COMPLETE"
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["9f3e20e8ec99d591812430bee71d27e68c4ad498"]
dependency_source_workbooks: ["WBC-603"]
dependency_source_shas: ["f3510862cc348a99004ca5bd5d151a7b56279724"]
development_baseline_sha: "1a26d7499d3de39b19c3136c3032e8ccd9343428"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-05): baseline_anchor_mode=DEPENDENCY_SHA_UNION_AT_CLAIM executed literally. The declared dependency_source_shas entry f3510862cc348a99004ca5bd5d151a7b56279724 (WBC-603 accepted head) and the required ancestor 9f3e20e8ec99d591812430bee71d27e68c4ad498 were BOTH verified with git merge-base --is-ancestor against refs/heads/main, both ANCESTOR_OK, so the union is the eligible base itself and needs no constructed merge - the same shape as the MON-902 claim, and the opposite of the CEX-790 union that had to merge five parallel heads. Resolved baseline (40-char): 1a26d7499d3de39b19c3136c3032e8ccd9343428. Dependency smoke run BEFORE any WBC-604 product change: node --test on the WBC-601/602/603 suites -> 32 tests, 32 pass, 0 fail at that exact commit. Development worktree D:/utopia-wbc604 on branch wbc/WBC-604-mech-execution-profile-switch, created from the resolved baseline."
baseline_blocker: null
dependencies: ["WBC-603:WORKER_POOL_AGENT_SEAM_ACCEPTED"]
development_host: "Mech"
development_branch: "wbc/WBC-604-mech-execution-profile-switch"
development_head_sha: "213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef"
development_ci: "V0.2 checks COMPLETED SUCCESS on 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef (three runs on that head: push and pull_request, all success), read from the Actions API and matched on headSha. LOCAL VERIFICATION on the same head: WBC-604 unit + route + fail-safe suites plus wbc601/wbc602/wbc603 -> 28 tests / 28 pass."
development_complete: "true"
review_host: null
review_head_sha: null
review_ci: null
review_complete: "true"
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/WBC-604
terminal_marker: EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED
merged_main_sha: "213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef"
merged_main_via: "fast-forward push of the development branch onto main under the owner ruling that the whole WBC sub-series must be made mergeable; WBC-601 (d773c1e1), WBC-602 (52e66f37) and WBC-603 (3cd45f66) were already in main, so this completes the series."
merged_main_ci: "V0.2 checks COMPLETED SUCCESS on 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef (push and pull_request runs), read from the Actions API and matched on headSha."
---

# WBC-604 — Execution Profile Switch + HYBRID Routing 兼容切换

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> **Programme：** [README.md](./README.md)

## 目标

把未来工作台启用动作压缩成一个稳定、可逆的 Execution Profile 切换，而不是重新部署/迁移 Utopia 业务层。

永久 profile：

```text
STANDARD_DEVICES   ← current default
WORKER_POOL        ← future explicit switch
HYBRID             ← future capability-driven mixed mode
```

## Profile 语义

### STANDARD_DEVICES

- 必须与本 programme 开始前的 accepted Windows baseline 等价；
- legacy tasks 默认仍走这里；
- 这是当前默认，也必须长期保留为 rollback profile。

### WORKER_POOL

- 只有至少一个 compatible + trusted + HEALTHY/READY backend/node 才允许 activation；
- activation 前做 readiness check；
- 不可用时返回 typed rejection / attention；
- 不得因为 Worker Pool 不可用而 crash Utopia；
- strict target 到非-pool Windows node 时不得偷偷重解释。

### HYBRID

候选选择顺序必须由明确 contract 决定，至少遵守：

1. explicit strict target > generic routing；
2. hard platform/capability requirement > performance preference；
3. trusted/readiness gate > load preference；
4. legacy unspecified task 必须保持兼容默认，不因新资源模型突然改派；
5. Workbench unavailable 时，只有 policy 明确允许的任务才能 fallback STANDARD_DEVICES；
6. platform-validation workload 继续交给匹配的真实 validation node；
7. 不允许以“更快”为理由跨过 user/permission/trust gate。

## 直接切换要求

未来 Workbench 搭建完成后，Owner 不应再提交代码才能启用。

至少提供一个稳定 control surface（可为现有 settings/config/API 中最小合适位置）：

```text
get current execution profile
list available profiles + readiness
request profile change
return activation receipt / rejection reason
persist selected profile safely
rollback to STANDARD_DEVICES
```

如果当前 UI 没有合适设置面，不要求为本任务重构 UI；稳定 API/config surface 已满足底层 cutover contract。后续 UI 只做 presentation。

## Fail-safe / rollback

必须证明：

- WORKER_POOL activation readiness 失败 → 保持原 profile；
- profile persistence 损坏/未知 value → conservative STANDARD_DEVICES 或 typed safe recovery；
- pool 在运行中丢失 → 不篡改 canonical task truth；
- in-flight ownership 按既有 lease/recovery 处理；
- Owner 可切回 STANDARD_DEVICES；
- 切回不需要 DB downgrade；
- Workbench node 记录可保留但不再接新任务。

## Formal Review

另一实体主机至少独立攻击：

- profile switch race；
- unavailable pool；
- stale readiness；
- strict target vs hybrid preference；
- legacy task no-requirements；
- in-flight task during profile change；
- restart 后 profile persistence；
- rollback to STANDARD_DEVICES；
- Android/Web control-surface non-regression。

## 完成门槛

1. 三种 profile contract 存在；
2. STANDARD_DEVICES 仍默认；
3. future WORKER_POOL 可在 readiness 后无需代码提交直接切换；
4. HYBRID 路由 precedence 明确且测试化；
5. switch/rollback 可逆；
6. no-workbench 环境完整可用；
7. opposite-host Review PASS；
8. exact-head CI green；
9. terminal marker `EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED`。

## Reports

- `mission-book/reports/WBC-604/DEVELOPMENT_REPORT.md`
- `mission-book/reports/WBC-604/REVIEW_REPORT.md`

完成后不得自行创建 merge authority。回到 programme README 的 Merge lock，待 WBC-601..604 全部双机完成后再生成 final integration workbook。
