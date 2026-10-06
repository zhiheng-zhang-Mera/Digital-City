# RS-202 · Step 1 — Existing scheduling/presence/routing audit and seams

> Reading translation / 阅读译本：完整历史阅读版本；原报告为权威记录，代码证据原样保留，不创建第二份任务状态。

```text
任务    = RS-202 多设备并发感知与再调度
开发主机 = Alien        基线 = de91f5e（UI_BASELINE_FROZEN 后的 main）
步骤    = 施工步骤 1「审核现有 EM-010 foreman scheduler、GAI routing、Remote device/presence contracts」
```

Task multi-device concurrency awareness/rescheduling. Alien Development, post freeze de91f5e. Step 1 audits EM-010 foreman,GAI routing,Remote device/presence. Conclusions from actual **export surface/policy constant** extraction, not impressions.

## 1. Existing three-layer foundation, measured size

| Layer | File | Size |
|---|---|---|
| EM-010 foreman scheduling | contracts/engineering-foreman-scheduler-v1/foreman.mjs |847 lines + 500 conformance-test lines |
| Presence | contracts/remote-presence-reconnect-v1/presence.mjs |450+430 |
| Routing/load | city/00-foundation/01-city-core/fleet-routing/ |contracts 461, adaptive 70, capability routing 162, fleet 137 |

## 2. Present: **reuse, do not rebuild**

Most needed semantics already have vocabulary; parallel invention creates second truth, same error RS-201 avoided. This is audit's most important output.

**Concurrency/conflict**: scopesOverlap(left,right) already exported foreman; same user devices fairness/double execution prevention build on scope conflict. ASSIGNMENT_STATES_TRANSFERABLE_ON_DROPOUT QUEUED/ASSIGNED/RUNNING/CHECKPOINT… already defines transferable states.

**Single execution/idempotency**: presence PENDING_STATES PENDING/UNKNOWN/CONFIRMED_SUCCEEDED/CONFIRMED_FAILED/EXPIRED already models result confirmation; gate provability attaches here, no new model. RECONCILE_OUTCOMES RESUMED/DROPPED_EXPIRED/DROPPED_LIVE_CONTEXT_LOST/… already offline-recovery reconciliation.

**Queue/diversion**: QUEUE_POLICIES QUEUEABLE/LIVE_ONLY; fleet ROUTE_QUEUED_HISTORY='queued: no eligible node',ROUTE_QUEUED_NOTE='no eligible node' already route when no node is eligible, gate for queue/cross device without provider switch. DROPOUT_TRANSFERRED/REASSIGN/FAILED distinguish outcomes.

**Device/reachability**: PRESENCE includes BUSY, REACHABLE ONLINE/BUSY/DEGRADED, busy already reachable. Fleet READY/DEGRADED/OFFLINE/FAILED/DISABLED plus refusing work set, excluded FAILED/DISABLED/RECOVERING. Heartbeat interval 5000, degraded 10000, offline 30000; presence offline 60000.

**Policy knobs, measured defaults**:

```text
DEFAULT_FOREMAN_POLICY  = { max_workers: 4, min_workers: 1, scale_up_after_ticks: 2,
                            scale_down_immediately: true, pressure_pause_threshold: 0.9,
                            max_attempts: 3, placement: 'LOCAL_FIRST' }
DEFAULT_PRESENCE_POLICY = { offline_after_ms: 60000, default_queue_deadline_ms: 300000,
                            max_queue_deadline_ms: 3600000, max_audit_entries: 1000 }
```

Foreman defaults: max 4 / min 1 / up after 2 ticks / immediate down / pressure 0.9 / max attempts 3 / LOCAL_FIRST. Presence defaults: offline 60 s / deadline 300 s / max 3600 s / audit 1000.

**Route score**: NEUTRAL_PRIOR,UTILITY_WEIGHTS,ADAPTIVE_POLICY_VERSION adaptive-policy-1.0.0 and adaptiveXxx / utilityInputs constructors already define the utility shape.

## 3. Real gaps, against steps

| Requirement | Existing | Conclusion |
|---|---|---|
| Explainable current session/provider concurrency | Pressure 0.9 **scalar**, no per-session/provider model | **Absent** |
| Device operating load input | Scalar pressure only,UTILITY_WEIGHTS can carry it | **Extend** |
| Reachability | presence/fleet states | Reuse |
| Policy/user disable | RS-201 ENABLEMENT | **Cross-task reuse** |
| Provider switch choice before queue if declined | None | **Absent, exactly RS-201 interface** |
| Queue/cross device alternative | ROUTE_QUEUED_* | Reuse |
| Bounded retry/event-first rescan | None;RS-201 probe is **availability**, not rescan | **Absent** |
| Anti flap/hysteresis | None;up after 2 ticks weak precedent | **Absent** |

**Key seam decision**: Step 3offer switch then queue/divert if declined. RS-201 suggestSwitch always executed:false/requires_user_confirmation:true; module contains **no execute-switch function**. Do not invent user choice; **consume** stable output and structural suggestion/execution separation as route step. This is sibling interface.

**Forbidden boundary**: alternate eligible device, but Remote trust/permission may not be crossed. SCOPES/scopesOverlap/remote contracts own permission; eligibility only**schedulability**, never rewrite authority, matching gate concurrency affects scheduling not permissions.

## 4. Method note

First recursive search polluted by **historical frozen snapshots** under .runtime/evidence/mission-book/*/frozen-*, complete copies yield historic duplicate and wrong seam map. Exclude .runtime for trustworthy map. Same trap UI-190 old process/port serving **another build**: confirm current tree before conclusion.

## 5. Fixed seams

```text
SEAM A (并发/负荷输入)  city/00-foundation/01-city-core/fleet-routing/contracts.mjs
                        -> 在既有 UTILITY_WEIGHTS / NEUTRAL_PRIOR 形状上扩展多因子负荷，
                           不得把 CPU/GPU 单指标等同于「设备忙」（任务明文禁止）
SEAM B (权限与可调度性分离) 复用 foreman 的 scopesOverlap；只表达 eligible，不改写 trust/permission
SEAM C (路由序列)       消费 RS-201 的 suggestSwitch 作为「切换选择」环节；
                       排队走既有 ROUTE_QUEUED_*；bounded retry 新建
SEAM D (re-scan)        事件驱动优先，20 分钟仅作上限参考；不得死等
SEAM E (anti-flap)      新建 hysteresis；可借鉴 scale_up_after_ticks 的「连续 N 次」形状
```

A fleet contracts multi-factor load on utility/prior, never use CPU/GPU as the sole indicator of busy. B scopesOverlap reuse, eligibility not trust rewrite. C consume suggestSwitch, existing queue, and new bounded retry. D event first rescan,20 minutes is only an upper reference, with no indefinite wait. E new hysteresis,may reuse consecutive N ticks shape.

语言配对 / Language pair: [原文 / Source](../STEP1_SEAM_AUDIT.md)
