---
workbook_id: WBC-601
phase: WORKBENCH_COMPATIBILITY_MIGRATION
sequence: 601
execution_enabled: true
status: READY
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["9f3e20e8ec99d591812430bee71d27e68c4ad498"]
dependency_source_workbooks: []
dependency_source_shas: []
development_baseline_sha: "612c344f9f2b06a67b2645b4662d97750dd7c44e"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-04): baseline_anchor_mode=REMOTE_REF_EXACT_SHA_AT_CLAIM was executed literally. `git fetch origin main` in zhiheng-zhang-Mera/utopia resolved refs/heads/main to the full SHA 612c344f9f2b06a67b2645b4662d97750dd7c44e (commit time 2026-10-04T23:48:42+11:00, 'Merge pull request #11 from zhiheng-zhang-Mera/codex/city-members-host-roles'). required_ancestor_shas[0]=9f3e20e8ec99d591812430bee71d27e68c4ad498 was verified with `git merge-base --is-ancestor` -> ANCESTOR_OK, so no BASELINE_ANCESTRY_MISMATCH. The same fetch also confirmed the two other accepted heads still exist as ancestors of main: ec12fd0831f31fd81aef9cd9dfb0c959d010f63b -> ANCESTOR_OK and 69a097b5394a9fece39dd11cc13f04c9b4d28bfe -> ANCESTOR_OK. Required CI on exactly that sha: 'V0.2 checks' run 37203397283 COMPLETED SUCCESS and 'City linkage check' run 37203397272 COMPLETED SUCCESS, both on headSha 612c344f9f2b06a67b2645b4662d97750dd7c44e (read from the Actions API, not from UTOPIA_LIVE_STATUS.json, so a stale generated file cannot substitute for the measurement). Dependency MESH-301:THREE_END_MESH_E2E_ACCEPTED is satisfied because the accepted merged baseline 9f3e20e8ec99d591812430bee71d27e68c4ad498 is an ancestor of the resolved baseline and the archived workbook records terminal_marker THREE_END_MESH_E2E_ACCEPTED. Development worktree: D:/utopia-wbc601 on branch wbc/WBC-601-execution-backend-contract, created from the resolved baseline SHA."
baseline_blocker: null
dependencies: ["MESH-301:THREE_END_MESH_E2E_ACCEPTED"]
development_host: "Mech"
development_branch: "wbc/WBC-601-execution-backend-contract"
development_head_sha: "d65dbd3af2d8903aca13726f74110e1f2f6b9b65"
development_ci: "V0.2 checks run 37205291447 COMPLETED SUCCESS on headSha d65dbd3af2d8903aca13726f74110e1f2f6b9b65 (jobs: gateway-web success, android success); earlier run 37204673910 on the superseded head 9f9db6384779e75f51ec317074238c139e1de609 FAILED gateway-web on a defect in this task's own new test, repaired in d65dbd3 and recorded in reports/WBC-601/DEVELOPMENT_REPORT.md section 10"
development_complete: true
research_evidence_applicability: "APPLICABLE"
long_horizon_context_evidence: "CAPTURED"
research_evidence_refs: ["mission-book/reports/WBC-601/PAPER_MATERIAL_INDEX.md", "mission-book/reports/WBC-601/DEVELOPMENT_REPORT.md", "06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/paper-materials/en/LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md", "06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/paper-materials/en/LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md"]
review_host: Alien-codex
review_head_sha: "d65dbd3af2d8903aca13726f74110e1f2f6b9b65"
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/WBC-601
terminal_marker: EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED
---

# WBC-601 — Execution Backend Contract + STANDARD_DEVICES 默认兼容后端

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> **Programme：** [README.md](./README.md)
>
> 本任务第一目标不是“更聪明地调度”，而是**把当前已经可用的 Windows 执行路径冻结成一个长期兼容 backend，并证明包装前后行为等价**。

## 目标

建立最小稳定的 execution backend seam，使上层 task/action/assistant 不需要知道执行资源来自当前 Windows 设备还是未来 Workbench。

目标形态：

```text
Shared Task Core / Engineering execution intent
                ↓
        ExecutionBackendPort
                ↓
      STANDARD_DEVICES backend
                ↓
       current accepted path
```

第一阶段默认且唯一活跃 backend 仍是 `STANDARD_DEVICES`。

## 已确认背景

- 当前 Alien + Mech 已作为真实 worker nodes 完成 MESH-301；
- Android 是 control surface，不是 worker；
- strict target-device intent 已经是 accepted behavior；
- canonical task truth / lease / idempotency 已存在；
- 本任务不得利用“抽象化”重新实现这些语义。

## 允许修改边界

- 对现有 execution dispatch/claim path 增加最小 backend interface/adapter；
- 将现有行为映射为 `STANDARD_DEVICES`；
- 增加 backend identity / readiness 的最小 contract；
- 增加 compatibility tests；
- 增加 future backend registration seam，但不得启用真实 Worker Pool。

## 禁止修改边界

- 不重写 Shared Task Core；
- 不新造第二 scheduler/task DB；
- 不修改 strict-target 语义；
- 不改变现有 untargeted task 在 STANDARD_DEVICES 下的选择结果，仅因为“未来可能有 Workbench”；
- 不要求 Linux/Workbench；
- 不修改 pairing/onboarding 语义；
- 不把 Android 升格为 worker；
- 不借机重构 UI。

## 任务特有施工步骤

### Step 1 — Claim-time baseline
记录最新 Utopia main、required CI、MESH-301 accepted truth，并对当前 Windows path 做最小可重复 baseline probe。

**Claim 记录（Mech / `MEGA-REP`，2026-10-04）：**

```text
resolved_utopia_main      612c344f9f2b06a67b2645b4662d97750dd7c44e   (full 40-char SHA, not a branch name)
required_ancestor_guard   9f3e20e8ec99d591812430bee71d27e68c4ad498 -> ANCESTOR_OK
accepted_heads_still_present
                          ec12fd0831f31fd81aef9cd9dfb0c959d010f63b -> ANCESTOR_OK
                          69a097b5394a9fece39dd11cc13f04c9b4d28bfe -> ANCESTOR_OK
required_ci_on_that_sha   V0.2 checks 37203397283 -> COMPLETED SUCCESS on 612c344f… (Actions API)
                          City linkage check 37203397272 -> COMPLETED SUCCESS on 612c344f… (Actions API)
development_worktree      D:/utopia-wbc601  branch wbc/WBC-601-execution-backend-contract
```

为什么不去读 `UTOPIA_LIVE_STATUS.json` 当作 CI 真相：该文件是生成物，claim 当时仍停在 `69a097b5`，
比真实 `main` 落后两个 merge；§7 要求对依赖外部证据的任务重新测量，所以本次 CI 结论直接取自
Actions API 的 `headSha` 匹配，而不是取自可能滞后的看板文件（判据链：`runtime measurement > canonical source`）。

### Step 2 — Extract port around current behavior
优先采用 wrapper / adapter，而不是重写。接口至少能表达：

```text
backend identity
backend readiness
candidate execution endpoints
dispatch/claim compatibility
cancel/control compatibility
result/event return compatibility
```

具体代码结构由当前仓库决定，不要求为了命名统一搬家。

### Step 3 — Bind current path as STANDARD_DEVICES
现有 Alien / Mech path 应通过该 backend 继续工作。旧调用方允许先通过兼容 facade 接入；不得要求一次性改遍所有业务层。

### Step 4 — Freeze behavior equivalence
至少证明：

- old untargeted task path unchanged；
- Alien strict target unchanged；
- Mech strict target unchanged；
- offline/unknown strict target remains fail-honest；
- Android/Web control path unchanged；
- Workbench absent has no startup/readiness penalty。

## Formal Review

另一实体主机必须独立检查：

1. backend abstraction 是否真的包住旧行为，而不是偷偷换了一套 scheduler；
2. STANDARD_DEVICES 下 dispatch/claim/result 结果是否与 baseline 等价；
3. 是否新增了 Workbench mandatory dependency；
4. strict-target / untargeted negative controls；
5. exact-head CI。

Reviewer 应主动寻找“wrapper 看似兼容但默认路径已经改变”的反例。

## 完成门槛

1. Execution backend seam 存在；
2. current path 被明确绑定为 STANDARD_DEVICES；
3. STANDARD_DEVICES 是默认；
4. 无 Workbench 时 startup / task flow 不变；
5. strict target 不回归；
6. opposite-host Review PASS；
7. exact-head CI green；
8. terminal marker `EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED`。

## Reports

- `mission-book/reports/WBC-601/DEVELOPMENT_REPORT.md`
- `mission-book/reports/WBC-601/REVIEW_REPORT.md`

本任务自动继承常驻规则中的原子领取、双机独立、no-idle、typed zero-claim、20 分钟兜底重扫、exact-head evidence 与 integration refresh。
