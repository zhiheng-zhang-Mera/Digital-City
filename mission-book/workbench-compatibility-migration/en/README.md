# Workbench Compatibility Migration — full English reading

[Canonical programme board](../README.md). This reading has no authority fields. Historical READY/merge-lock prose is retained alongside later COMPLETE updates; current canonical workbooks determine status.

All WBC601/602/603/604 tasks are COMPLETE and entered Utopia main (latest integration213f9f9f). WBC604 development and exact-head CI completed and EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED was released. The fail-safe defect that persisted an unavailable selected profile was found and repaired while writing the fail-safe tests.

## Historical READY / ACTIVE scope and Owner constraints

This programme preserves the Windows two-host operating mode as a lasting compatible backend and prepares a switchable future Workbench/Server-Worker Pool interface.

1. Preserve current Alien+Mech Windows operation.
2. With no Workbench/Linux server, Utopia must start, connect, dispatch, execute and return results completely.
3. Workbench is an additive backend, never a startup dependency.
4. Future hardware is enabled by registering nodes, passing readiness and switching Execution Profile, without another large business migration.
5. Continue Alien/Mech asynchronous Development→opposite-host Formal Review.

Standing rules: [construction](../../CONSTRUCTION_RULES.md), [relief](../../ASYNC_RELIEF_CONSTRUCTION.md), [process](../../PROCESS_DATA_POLICY.md). Accepted three-end baseline9f3e20e8ec99d591812430bee71d27e68c4ad498: [MESH301](../../finished/completed-2026-10-04/mesh-3end/MESH-301-三端实机互联与相互指挥.md).

## 1. Programme goal

Move from code that assumes Alien/Mech/Windows to a task/action→Execution Profile→Backend Contract hierarchy. Freeze current behavior into compatibility mode before adding future modes.

```text
Utopia Task / Action
        ↓
Execution Profile
        ↓
Execution Backend Contract
   ┌───────────────┬────────────────┐
   ↓               ↓                ↓
STANDARD_DEVICES   WORKER_POOL      HYBRID
(current default)  (future)         (future)
   ↓               ↓                ↓
Alien / Mech       Workbench        capability-driven union
```


After this programme, absence of hardware is acceptable. Future enablement should require only:

```text
install/start headless node agent
→ register node
→ advertise roles/capabilities/resources
→ readiness = HEALTHY
→ switch Execution Profile
```


Assistant, Gateway, Remote Fabric, Shared Task Core and UI main flows should not need rewriting.

## 2. Permanent compatibility modes

### STANDARD_DEVICES — current default, retained long term

Default profile. Existing Windows Alien/Mech paths continue working; adding resources does not change untargeted scheduling; MESH301 strict target-device intent keeps its meaning. Android remains a control surface and is never represented as an execution worker. No absent-Workbench startup failure, global blocker or waiting-for-server state is allowed.

### WORKER_POOL — future explicit switch

Enable only when at least one qualifying backend/node passes readiness. Configuration alone must not require Workbench at startup. An explicitly selected unavailable pool returns typed unavailable/attention, not a crash. Strict platform/hardware requirements must never silently route to the wrong node.

### HYBRID — future combined mode

Workbench prefers suitable general compute. Real Windows/macOS/Android/iOS devices continue platform validation. Route by capability/resource/role rather than historical machine names. Legacy tasks receive compatible defaults for absent resource fields. Strict target intent outranks generic pool preference. Unavailable backends follow explicit fail-honest/allowed-fallback policy and never fabricate success.

## 3. Product truths that cannot change

Do not redefine canonical Shared Task Core truth, accepted task lifecycle, lease/ownership/idempotency, Remote Fabric trust/transport ownership, General AI Gateway provider/channel semantics, Engineering Manager/GAI responsibilities, MESH301 strict target semantics, Web/Android control-surface identity or accepted Windows operation. Workbench adapts to these contracts.

## 4. Work split

| Task | Status | Goal |
|---|---|---|
| [WBC601](../WBC-601-execution-backend-contract-and-standard-default.md) | COMPLETE | Wrap current execution in permanent STANDARD_DEVICES; preserve scheduling results initially. |
| [WBC602](../WBC-602-node-role-capability-resource-descriptor.md) | COMPLETE | Add compatible node/resource descriptors; old Windows nodes work without new fields. |
| [WBC603](../WBC-603-worker-pool-and-headless-node-agent-seam.md) | COMPLETE | Dormant pool/agent contract without real Workbench dependency. |
| [WBC604](../WBC-604-execution-profile-switch-and-hybrid-routing.md) | COMPLETE | STANDARD/WORKER_POOL/HYBRID switching and readiness/fallback semantics. |

### WBC604 remaining defect and published repair — Mech2026-10-06

Despite component COMPLETE, an unresolved defect remains on main after two merges. The following original diagnostic block is preserved verbatim, followed by its full English meaning:

```text
DEFECT  services/dev-gateway/execution-profile.mjs 的 change() 先改运行态、后落盘（profile = requested 在
        persist() 之前），因此存储写失败时产生「半切换」——调用方拿到异常，而 City 已经在跑一个从未持久化的
        profile。这个半切换正是该模块自身 rule 2 明文禁止的（"a failed activation leaves the CURRENT profile
        in place ... it never half-switches"），且路由把裸 EPERM 与绝对路径直接抛给 owner 控制面。
实测    merged main b06504f 上的 sweep 单元探针：change() THREW EPERM; live profile STANDARD_DEVICES -> WORKER_POOL
REPAIR  repair/WBC-604-mech-profile-persist-first-on-current-main @ ad1b3e8（**建在当前 main 之上**，不是旧 base）
GUARD   tests/startup-store-family-guard.test.mjs（分支 test/mech-startup-store-family-guard @ 8e1c1c5）把整个
        store-guard 家族收进一处：SHAPE A 对 City 构造期触碰的每个 store 埋「应为目录处放文件」并要求 City 仍然启动；
        SHAPE B 把 F-1（此处拒启是正确的，断言可诊断而非假装可降级）、F-2（作为**已知行为**钉住，不当作期望行为）
        与 F-3（必须 typed 拒绝且运行态不动）分别记录。**先证伪再信任**：在未修复的 main b06504f 上同一文件
        11 pass / 1 fail，唯一红项正是仍在存活的 F-3（EPERM）；带修复后 12/12。CI push 37429465001 SUCCESS attempt 1。
        修复后：F-3 探针与三个既有 WBC-604 套件 19/19；sweep 变为 change() THREW PROFILE_STORE_UNAVAILABLE 且
        live profile STANDARD_DEVICES -> STANDARD_DEVICES；全量 1359/1362（3 项为本机常驻 City 占用）；
        托管 push run 37425834472 SUCCESS attempt 1（android 与 gateway-web 均绿）
PATTERN 家族记录：reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md 的 F-3
NOT DONE 本机不合并（merge_authority=false）；是否采纳由 WBC-604 的记录持有人决定
```


DEFECT: execution-profile.mjs change() alters live state before persistence (profile=requested before persist()). A failed storage write leaves a half-switch: caller receives an exception while the City runs an unpersisted profile. This violates module rule2 (failed activation keeps current profile and never half-switches); bare EPERM and an absolute path reach the Owner surface.

MEASURED: merged-mainb06504f unit sweep throws EPERM while live STANDARD_DEVICES changes to WORKER_POOL.

REPAIR: repair/WBC-604-mech-profile-persist-first-on-current-main atad1b3e8, built on current main rather than the old base. GUARD: startup-store-family-guard.test.mjs on the test/mech-startup-store-family branch; exact original branch, head and probe identities are retained in the block above. Before repair, the guard exposes surviving F3 EPERM; with repair12/12. CIpush37429465001 succeeds attempt1. After repair, F3 and three WBC604 suites19/19; sweep throws PROFILE_STORE_UNAVAILABLE and live STANDARD_DEVICES remains unchanged. Full1359/1362 has three resident-City environment failures. Hostedpush37425834472 succeeds attempt1, Android and Gateway/Web green. Pattern family: reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md F3. NOT DONE: no local merge (merge_authority=false); the WBC604 record holder decides adoption.

Republication on current main follows the earlier B4 rule: measure repairs on the actual integration result, rather than a base two merges behind. Green on a commit nobody runs is not evidence.

Historical status semantics: COMPLETE means Development, opposite-host Formal Review and exact-head required CI completed; it does not by itself mean a component merged to main. WBC601/602 accepted heads entered WBC603 dependency-union; the programme remained under final integration lock§8. WBC601/602 can develop in parallel. WBC603/604 resolve accepted full dependency SHAs into an exact union at claim time; starting from main that lacks dependency code is forbidden.

## 5. Asynchronous two-host construction

Continue the proven two-host model without a new scheduling mechanism:

```text
Alien
  ├─ Hns supervisor
  ├─ Codex Development / Critic
  └─ eligible Formal Review for Mech-authored work

Mech
  ├─ Hns supervisor
  ├─ Codex Development / Critic
  └─ eligible Formal Review for Alien-authored work
```


1. Development and Formal Review use different physical hosts.
2. WBC601/602 can overlap, without sibling merges.
3. Hosted CI/long waits do not occupy a host: scan other eligible stages.
4. Inherit claim races, zero-claim,20-minute fallback rescans and typed external blocks.
5. Local fresh critics diagnose; they cannot impersonate opposite-host Formal Review.
6. Real file ownership conflicts require later claimants to avoid/wait for that seam; do not duplicate canonical logic for concurrency.
7. An idle programme does not justify creating extra future-server functionality.

## 6. NO_WORKBENCH_REGRESSION

Every component, future integration candidate and merged main must work under:

```text
Workbench = absent
Linux server = absent

Available:
- Alien Windows
- Mech Windows
- current Android control surface
```


Preserve startup; Alien/Mech register/heartbeat/claim/execute/report; untargeted behavior; strict Alien/Mech targets; Web/Android canonical City observation/control; accepted Remote Fabric paths; accepted GAI/Engineering Manager smoke; result/event returns; restart/recovery; green required hosted CI. Any failure caused by future Workbench compatibility is a blocking regression and prohibits merge.

## 7. Design constraints

### Wrap first, do not rewrite

Allowed:

```text
existing execution path
      ↓
STANDARD_DEVICES adapter
```


Forbidden as the first step:

```text
delete old scheduler
→ replace with new distributed scheduler
→ hope old Windows path still works
```


### New fields additive/optional

Missing role, resource capacity, live load, accelerator or pool metadata cannot invalidate old tasks, nodes or tests. Provide explicit legacy defaults/compatibility translation.

### Workbench is not a startup dependency

Do not force pool connections at startup, mark City unhealthy without Linux/Workbench, create another task database, make node agents canonical task truth or require the Owner to change daily startup for server conversion.

### Reversible switching

STANDARD_DEVICES→WORKER_POOL/HYBRID must permit returning to STANDARD_DEVICES, without rebuilding databases, migrating task formats back or deleting pool nodes.

## 8. Historical merge lock

This directory initially creates no final integration/merge workbook. Create one only after every WBC601..604 has Development complete, opposite-host Formal Review complete, green exact-head required CI, no unresolved Owner gate and no unresolved compatibility regression. Start final integration from the then-latest Utopia main and enforce NO_WORKBENCH_REGRESSION.

Final marker: WORKBENCH_COMPATIBILITY_READY_WINDOWS_BASELINE_PRESERVED. It does not certify physical Workbench acceptance. When hardware arrives, a separate hardware-onboarding/real-pool workbook proves registration, readiness and real load rather than repeating business migration. This historical provision does not activate a new programme in the present task.

## 9. Expected future cutover

```text
Workbench Node A/B ready
        ↓
install Utopia Node Agent
        ↓
register into existing City
        ↓
roles/capabilities/resources advertised
        ↓
health/readiness accepted
        ↓
Owner selects WORKER_POOL or HYBRID
        ↓
bounded canary tasks
        ↓
normal workload
```


If enabling future hardware still requires extensive Assistant/Gateway/UI/task-semantics edits, this programme has not met its compatibility-migration goal.

## Current dashboard

Use the [canonical generated task dashboard](../README.md#任务快速面板--task-dashboard); this reading grants no claim lock or additional authority.

<!-- SERIES_DASHBOARD:START -->
## 任务快速面板 / Task dashboard

自动读取canonical工作书；本表不提供领取锁或额外authority。 / Generated from canonical workbooks; this table grants no claim lock or extra authority.

总完成 / Complete 4/4 · 开发 / Development 4/4 · 复检 / Review 4/4 · `COMPLETE`

| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |
|---|---|:---:|:---:|:---:|
| [WBC-601](../WBC-601-execution-backend-contract-and-standard-default.md) | COMPLETE | YES | YES | YES |
| [WBC-602](../WBC-602-node-role-capability-resource-descriptor.md) | COMPLETE | YES | YES | YES |
| [WBC-603](../WBC-603-worker-pool-and-headless-node-agent-seam.md) | COMPLETE | YES | YES | YES |
| [WBC-604](../WBC-604-execution-profile-switch-and-hybrid-routing.md) | COMPLETE | YES | YES | YES |

<!-- SERIES_DASHBOARD:END -->
