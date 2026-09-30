# Cross-Programme Execution Contract / 跨项目异步执行契约

This file is **normative** for Butler Assistant (BA), Remote Fabric (RF), General AI Gateway (GAI) and Engineering Manager (EM). If a task-local sentence conflicts with this contract, this contract wins unless the Owner explicitly records a newer ruling.

## 1. Reset state / 重置状态

- Alien = AVAILABLE.
- Mech = AVAILABLE.
- BA/RF/GAI/EM had not formally started when this contract was adopted.
- Every component branch therefore uses the same frozen Utopia baseline: `82ed36933fb4c5b00e44768d9e1aedec1d525d9c`.
- There is **no second-real-host hold**.
- All four Development pools are open immediately.

## 2. One global component pool / 单一全局任务池

The 41 component tasks are one scheduling pool:

`BA-001..009 + RF-001..010 + GAI-001..009 + EM-001..013`.

A host never waits merely because its previous programme has no immediately runnable stage.

Eligibility:
- Development is eligible when unclaimed and incomplete.
- Correction is eligible only after Development is green/complete and only for the other physical host.
- A host never corrects its own Development.
- A red CI/regression on a stage already owned by the host becomes ACTIONABLE_OWNED_REPAIR.

Claim priority:
1. ACTIONABLE_OWNED_REPAIR;
2. ELIGIBLE_CORRECTION_BY_OTHER_HOST;
3. UNCLAIMED_DEVELOPMENT_ANY_PROGRAMME.

When choices are equivalent, prefer a different programme from the host's previous claim to expose seams early, but never idle for fairness.

## 3. Atomic claim protocol / 原子领取

Dynamic truth lives only in the target task workbook frontmatter plus its reports. README and MISSION_INDEX are dashboards, not locks.

A claim commit must update only the target stage fields (status/host/time/branch as applicable). Push/update must be fast-forward. If another host wins the race and the push is rejected:
1. fetch current Digital-City main;
2. re-evaluate the global pool;
3. claim the next eligible stage.

Never force-push a claim and never wait for the other host to release an unrelated task.

## 4. No-idle execution / 防阻塞执行

A claim may remain owned while its CI, long test, provider check, external login, or other non-CPU-active condition is waiting. That wait does **not** reserve the physical host.

The host must:
- keep the waiting claim;
- use a separate worktree/branch for additional work;
- immediately claim another eligible global stage;
- return to the waiting claim when it becomes actionable.

A host stops claiming component work only when a fresh global scan finds:
- no actionable owned repair;
- no eligible Correction;
- no unclaimed Development.

That state is `GLOBAL_COMPONENT_POOL_DRAINED`.

## 4.1 Eligibility-aware quiescence and bounded re-scan / 资格感知静默与有界重扫

A single scan with zero claimable work answers only **"what can this host claim now?"**. It does **not** prove that the global pool is terminal when unfinished stages remain or eligibility can change over time.

Every dispatcher and every future City engineering book that uses an asynchronous task pool MUST classify a zero-claim result before stopping:

1. `TEMPORARILY_UNCLAIMABLE`
   - unfinished work exists;
   - the current host is not structurally forbidden from all future work;
   - another host completion, CI/provider completion, claim race, stage transition, or integration gate can make work eligible later.
   - Action: park without busy-polling and re-enter the global scan after approximately **20 minutes** by default. The interval may be tuned by the workbook when there is measured evidence for another cadence.

2. `STRUCTURALLY_INELIGIBLE`
   - all unfinished work is forbidden to this host by a stable mechanism such as Development/Correction host separation, permission, required device/hardware capability, identity, safety policy, or an explicit Owner restriction.
   - Action: record the exact reason and release the host. Periodic re-scan is not required until the governing gate changes.

3. `GLOBAL_EXTERNAL_BLOCK`
   - every otherwise relevant stage depends on a typed external condition that internal work cannot honestly satisfy, such as account billing, unavailable mandatory hardware, or an Owner/provider action.
   - Action: preserve the exact blocker and release the host. Do not manufacture code or accumulate unverifiable heads merely to avoid idling.

4. `POOL_TERMINAL`
   - all stages are terminal under the workbook's completion semantics.
   - Only this class may be interpreted as normal global drain/completion.

Required zero-claim telemetry for future workbooks:

```text
pool_incomplete
claimable_now
potentially_claimable_later
structural_ineligibility_reason
global_external_blocker
rescan_after
terminal_reason
```

The default bounded re-entry cadence is 20 minutes for `TEMPORARILY_UNCLAIMABLE`. A host may re-scan repeatedly while the pool remains unfinished and future eligibility remains plausible. This is a low-frequency liveness mechanism, not a busy-wait loop.

Paper/dogfood evidence for the failure that motivated this rule is retained under the Research Institute paper-material library and Utopia paper evidence as `ASYNC_DISPATCH_TRANSIENT_QUIESCENCE_2026-10-01`.

## 5. External dependencies / 外部依赖

Component tasks MUST NOT block on unfinished sibling programmes.

Use stable ports/contracts and deterministic test doubles for missing sibling implementations. Real external proof (remote multi-device path, provider login, optional third-party software, hardware-bound action) is performed opportunistically when available; when unavailable it is recorded honestly and deferred to programme integration.

Deferral is not success. Reports must identify the exact pending seam.

## 6. Canonical ownership / 功能归属

| Concern | Canonical owner |
|---|---|
| task/action/attention identity and canonical lifecycle | Shared Task/Action Core |
| physical/logical device identity, trust, presence, reachability, transport | Remote Fabric |
| transport-level versioned device capability addressing | Remote Fabric |
| assistant identity, memory/context projection, embodiment semantics, handoff | Butler Assistant |
| general-AI provider/model/account/channel/conversation semantics | General AI Gateway |
| engineering job/connector/worker/result/artifact semantics | Engineering Manager |
| secure credential/profile/session handle storage primitive | neutral 00-Foundation SecureHandleStorePort |
| policy decision contract | Shared Core policy contract; BA contributes AssistantPolicy; RF revalidates/enforces at target |

Rules:
- BA DeviceEmbodiment references canonical RF `device_id`; it does not mint a competing physical-device identity.
- EM ConnectorInstance and GAI remote endpoint reference RF device identity/presence when cross-device.
- RF capability registry describes transport-addressable node capabilities; EM connector capabilities and GAI provider/model capabilities remain domain registries.
- BA/GAI/EM domain events may be carried by RF RPC/EVENT/STREAM, but RF envelopes never become the canonical domain event model.
- GAI and EM may expose domain-specific RemoteExecutionPort facades, but those adapt to RF public APIs; they are not independent transports.
- GAI and EM share only the neutral secure-handle primitive, not each other's provider/connector registries.
- Canonical Attention state/fan-out truth remains shared Core; domain modules create typed attention; RF supplies presence/delivery; notification policy may filter projection.

## 7. Merge workbooks are also asynchronous stages / 收尾合并同样不阻塞

When one programme's component pool drains, its merge workbook may be created immediately; it does not wait for the other three pools to drain.

Every merge workbook:
1. starts from then-current Utopia main;
2. integrates that programme's corrected branches as an explicit union/superset;
3. preserves already-merged work from other programmes;
4. runs all independent tests/CI before waiting on an external seam;
5. if a real external seam is unavailable, records `INTEGRATED_WAITING_EXTERNAL_SEAM` and releases the host to the global pool;
6. refreshes from then-current Utopia main again immediately before final merge;
7. reruns required acceptance/CI after that refresh.

BA and RF have no hard terminal dependency on GAI/EM. GAI/EM may require accepted RF for final real cross-device E2E, but only their final E2E gate waits; component work and independent integration do not.

## 8. Terminal conditions / 终态

A physical host must keep taking runnable work until the global component pool drains. After that, it takes eligible programme-integration/repair stages.

Normal terminal target:
`ALL_PROGRAMMES_MERGED_MAIN_CI_GREEN`.

If every remaining stage requires a genuinely external Owner/hardware/provider action that cannot be mediated, report:
`GLOBAL_POOL_DRAINED_WITH_TYPED_EXTERNAL_OWNER_ACTION`
with exact blockers. Never convert that state into success and never manufacture additional internal work merely to avoid reporting it.
