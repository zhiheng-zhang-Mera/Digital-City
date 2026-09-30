# Mission Book — Active Parallel Engineering Programmes

> Current mode: **PARALLEL_PROGRAMMES — BUTLER_ASSISTANT + REMOTE_FABRIC + GENERAL_AI_GATEWAY + ENGINEERING_MANAGER**
> Control repo: zhiheng-zhang-Mera/Digital-City
> Implementation repo: zhiheng-zhang-Mera/Utopia
> Foundation gate: **OPEN**
> Frozen Butler baseline: `8104f8289a76d15ff0197c953730edcef42cab5e`
> Architecture contract: **ASSISTANT_DISTRIBUTED_STATE_V2**
> General AI Gateway baseline: `82ed36933fb4c5b00e44768d9e1aedec1d525d9c`
> Engineering Manager baseline: `82ed36933fb4c5b00e44768d9e1aedec1d525d9c`
> Engineering Manager donor: `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b`
>
> The old migration/replant workbooks and the exact historical Pre-Assistant workbook remain archived under `./finished/replant/`.

## Current construction dashboard

Legend: 🟢 = complete; 🔴 = not complete.

| Subproject | Development claim | Development | Correction claim | Correction |
|---|---|:---:|---|:---:|
| [BA-001 Butler Zone + Personalization Contracts](./butler-assistant/BA-001-butler-zone-personalization.md) | unclaimed | 🔴 | locked until Development | 🔴 |
| [BA-002 Shared Brain Runtime](./butler-assistant/BA-002-shared-brain-runtime.md) | unclaimed | 🔴 | locked until Development | 🔴 |
| [BA-003 Device Embodiment + Foreground Binding](./butler-assistant/BA-003-device-embodiment-binding.md) | unclaimed | 🔴 | locked until Development | 🔴 |
| [BA-004 Multi-Assistant Switching + Explicit Handoff](./butler-assistant/BA-004-multi-assistant-handoff.md) | unclaimed | 🔴 | locked until Development | 🔴 |
| [BA-005 Digital-Me Context + Memory/Audience Gateway](./butler-assistant/BA-005-digital-me-context-gateway.md) | unclaimed | 🔴 | locked until Development | 🔴 |
| [BA-006 Authoritative Task Coordination](./butler-assistant/BA-006-shared-task-coordination.md) | unclaimed | 🔴 | locked until Development | 🔴 |
| [BA-007 Assistant Settings + Interaction Surface](./butler-assistant/BA-007-settings-interaction-surface.md) | unclaimed | 🔴 | locked until Development | 🔴 |
| [BA-008 Event Bus + Execution Lease/Reconnect Safety](./butler-assistant/BA-008-embodiment-event-bus.md) | unclaimed | 🔴 | locked until Development | 🔴 |
| [BA-009 Duties / Permission / Proactivity Policy](./butler-assistant/BA-009-duty-permission-policy.md) | unclaimed | 🔴 | locked until Development | 🔴 |

## 0. Foundation start gate — OPEN

The historical Pre-Assistant workbook is preserved at:
[finished/replant/ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md](./finished/replant/ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md)

Recorded accepted state:

```text
branch head (accepted)   = 85ecde437ec930f1b4aa41d8913540e012da5ee7
branch CI                = 36691043142  android success, gateway-web success
merged Utopia main SHA   = 8104f8289a76d15ff0197c953730edcef42cab5e
merged-main CI           = 36692675561  android success, gateway-web success
post-merge branch audit  = 35 origin refs, unmerged = 0
```

The independent verifier rejected the first candidate and accepted the repaired candidate. The single-host Owner waiver used for that Pre-Assistant closeout does not apply to BA work. Butler Development is therefore unlocked, but each BA task still requires two different physical hosts for Development and Correction.

All BA-001..BA-009 branches start from the same frozen baseline above; they are non-blocking relative to one another.

## 1. Core architecture invariants — v2

1. Digital-Me is the canonical user self-model/context source. It is not an assistant persona store.
2. Butler Assistant Zone is a separate replaceable agent domain.
3. Assistant personalization must be independently changeable without mutating Digital-Me user data.
4. Personalization interfaces reserve naming/form-of-address, voice, avatar/appearance, personality, duties/role, companion/relationship mode and extensible future attributes. Profile fields cannot grant authority.
5. One logical assistant may inhabit multiple devices simultaneously.
6. **Shared brain = one authoritative durable assistant state plus multiple embodiment-specific ContextProjections.** Durable committed facts/memory references, assistant↔user relationship state, tasks, commitments, checkpoints and event history may be shared. Live token context, scratch reasoning, temporary plan drafts, uncommitted inference and device/UI transient state are not shared authority.
7. Multiple assistant identities may be online simultaneously.
8. One device may have at most one active **foreground interaction assistant** at a time.
9. Foreground binding is independent from task ownership and background execution. Switching foreground assistants does not automatically transfer, cancel, pause or recreate tasks.
10. A task distinguishes logical owner/coordinator from current executor where applicable.
11. Handoff occurs only when responsibility actually moves. It transfers task/checkpoint/evidence, never permission or action grants.
12. Side-effect execution requires current authoritative task/version state plus any required execution lease and idempotency/action key.
13. At most one valid exclusive execution lease may authorize a given exclusive action scope at a time.
14. Local embodiment state is a cache. Reconnect/restart must fetch authority and revalidate leases before resuming external or state-changing side effects.
15. Tasks live in shared Core/City task infrastructure, not only in a device session.
16. Context/memory is namespace- and audience-aware: user-global, assistant-private, project/task, audience/channel and device-ephemeral scopes must not be silently collapsed.
17. Knowledge is not disclosure authority. Information available to a logical assistant is emitted only when the current audience/privacy scope permits it.
18. Digital-Me access is scoped/authorized context access; assistant persona/relationship state must not be written into Digital-Me as canonical user identity data.
19. Effective action permission is equivalent to `User/OwnerPolicy ∩ AssistantPolicy ∩ DeviceCapability ∩ TaskActionGrant`. An execution lease is an additional safety prerequisite, not a permission source.

## 2. Work model: Development → Correction

- **DEVELOPMENT:** implement the bounded subproject on its own Utopia branch from the frozen baseline.
- **CORRECTION:** a different physical host independently hunts design loopholes and directly repairs every in-scope defect on that same branch.

Correction is not report-only. It must inspect and test architecture, state consistency, concurrency, privacy/audience boundaries, permissions, lifecycle/recovery, stale state, lease/idempotency behavior where relevant and false-success paths.

## 3. Claim and host-separation rules

Available physical build hosts: Alien and Mech.

For every BA task:
- Development Host and Correction Host MUST be different.
- Every task branch must therefore be worked on by both Alien and Mech at least once before final merge.
- A host may not perform both roles for the same task.
- Prefer unclaimed Development tasks first; otherwise claim an eligible Correction task.
- If a stage is already claimed and incomplete, skip it and choose another eligible stage.
- Development creates/pushes a new branch and does not merge it to Utopia main.
- Correction continues on the same branch and does not merge it to Utopia main.
- Reports go under `mission-book/reports/BA-XXX/`.

## 4. Parallel / non-blocking rule

BA-001..BA-009 use the same frozen Butler baseline and may proceed independently.

A worker must not wait for another BA branch merely to continue its bounded work. When another subproject is not yet available:
- use the local workbook's stable port/contract;
- use deterministic test doubles only where necessary;
- do not copy another subproject's implementation;
- record the integration seam for the future merge workbook.

Cross-branch wiring and conflict resolution are deferred to final integration. A BA branch must not merge another BA branch into itself just to pass its own tests.

## 5. Completion gates

Development complete requires bounded implementation, positive/negative tests, relevant concurrency/recovery tests, relevant local checks, branch CI green, DEVELOPMENT_REPORT and exact head SHA.

Correction complete requires a different physical host, independent adversarial review, direct repairs, regression tests, relevant local checks, branch CI green, CORRECTION_REPORT and exact corrected head SHA.

## 6. Hard merge lock

`MERGE_WORKBOOK_CREATION = FORBIDDEN` until ALL BA-001..BA-009 satisfy:
- `development_complete = true`;
- `correction_complete = true`;
- Development Host != Correction Host;
- branch history/evidence proves both Alien and Mech worked on the branch;
- corrected branch head is recorded and remote.

Only after a full branch audit proves the above may a new Butler Assistant merge engineering book be created.

## 7. Future merge workbook mandatory gates

The future merge workbook must:
1. fetch current Utopia main and every corrected BA branch;
2. re-check both-host participation on every branch;
3. integrate all branches without dropping valid behavior; compatible conflicts should preserve an explicit union/superset;
4. preserve all v2 invariants, especially authoritative durable state vs local ContextProjection, foreground/task separation, owner/executor separation, handoff authority boundaries and audience/privacy boundaries;
5. run adversarial multi-device races proving no split-brain exclusive side effects;
6. test execution lease expiry/reassignment and idempotent replay/retry;
7. test offline/reconnect so stale local state cannot resume side effects without revalidation;
8. test handoff to a less-privileged assistant/device so responsibility transfer cannot escalate authority;
9. run the full relevant local test suite;
10. merge the integrated result to Utopia main;
11. verify GitHub CI on the resulting Utopia main SHA.

Final completion is forbidden if any required merged-main GitHub CI check is red, cancelled, required-but-skipped, or still pending.

Required terminal state: `BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN`


## Remote Fabric programme

Remote Fabric planning is active under [remote/README.md](./remote/README.md). It uses the same frozen Utopia baseline `8104f8289a76d15ff0197c953730edcef42cab5e` and the same two-stage/two-physical-host discipline as Butler Assistant, but it is a separate merge unit.

| Remote task set | Development | Correction | Merge |
|---|:---:|:---:|:---:|
| [RF-001..RF-010 Remote Fabric](./remote/README.md) | HELD pending second real host | per-task after Development | **FORBIDDEN until all RF tasks complete** |

Remote construction is asynchronous: each RF task has its own `remote/RF-...` branch from the frozen baseline and may proceed independently once the two-host hold is lifted. No RF task branch may merge into Utopia main, and no RF branch may merge/cherry-pick sibling RF branches merely to pass locally.

`REMOTE_MERGE_WORKBOOK_CREATION = FORBIDDEN` until every RF-001..RF-010 Development and Correction stage is green, Development Host != Correction Host, and both-host evidence is recorded. The future Remote merge workbook must integrate corrected RF branches on top of the **then-current Utopia main**, so any Butler or other valid work already merged to main is preserved.


## General AI Gateway programme

General AI Gateway planning is active under [general-ai-gateway/README.md](./general-ai-gateway/README.md).

The programme is a separate City/Utopia merge unit with target ownership reserved for **00 City Foundation / General AI Gateway**. It does not revive Codex-Boss: Boss is a historical tombstone only and is forbidden as a build/runtime dependency or live connector target. Legacy behavior may only re-enter as independently owned Utopia code from current accepted requirements or explicit Owner-supplied excerpts.

| General AI Gateway task set | Development | Correction | Merge |
|---|:---:|:---:|:---:|
| [GAI-001..GAI-009 General AI Gateway](./general-ai-gateway/README.md) | asynchronous / unclaimed | per-task after Development | **FORBIDDEN until all GAI tasks complete** |

All GAI branches start from frozen Utopia baseline `82ed36933fb4c5b00e44768d9e1aedec1d525d9c`. Development and Correction use different physical hosts, but the hosts do not have to be online at the same time. Missing sibling code or Remote Fabric implementation must not stall bounded work: use the programme's stable ports and deterministic test doubles, record the unresolved integration seam, and continue. Real cross-device execution remains a mandatory final programme acceptance gate and may not be faked.

`GENERAL_AI_GATEWAY_MERGE_WORKBOOK_CREATION = FORBIDDEN` until every GAI task has green Development and Correction evidence with different hosts. The future merge workbook integrates corrected GAI branches on top of the **then-current Utopia main**, preserving Butler, Remote Fabric and any other accepted mainline work.


## Engineering Manager programme

Engineering Manager planning is active under [engineering-manager/README.md](./engineering-manager/README.md).

This is the permanent Mission Book namespace for Engineering Foreman / Worker Connector work. It maps onto the existing **02 Engineering Works / Project Foreman + Worker Gateway** ownership rather than creating a duplicate City building. DS-Hns is a pinned donor only; reused capabilities must become Utopia-owned code. Codex-Boss is out of scope and must not be accessed.

| Engineering Manager task set | Development | Correction | Merge |
|---|:---:|:---:|:---:|
| [EM-001..EM-013 Engineering Manager](./engineering-manager/README.md) | asynchronous / unclaimed | per-task after Development | **FORBIDDEN until all EM tasks complete** |

All EM branches start from frozen Utopia baseline `82ed36933fb4c5b00e44768d9e1aedec1d525d9c`. Development and Correction use different physical hosts but do not have to be online simultaneously. Sibling absence, hosted CI, Remote Fabric incompleteness and optional third-party connector absence must not make a worker idle: use stable programme ports/test doubles for bounded component work, record only the genuinely external pending seam, and continue another eligible stage.

Three programme invariants are hard requirements: **(1)** blocking Engineering attention follows the user and also alerts the 2–3 most recently operated eligible devices with one globally acknowledged attention event; **(2)** Sub-worker placement is `LOCAL_FIRST`, with remote fallback proposed only for measured `LOCAL_BLOCKED/LOCAL_UNAVAILABLE` and requiring explicit user approval; **(3)** when execution is remote, progress/control/attention/results/artifacts automatically return through canonical/shared state to the user's current authorized interaction surface, so normal work never requires walking to the remote host.

`ENGINEERING_MANAGER_MERGE_WORKBOOK_CREATION = FORBIDDEN` until every EM task has green Development and Correction evidence with different hosts. The future merge workbook integrates corrected EM branches on top of the **then-current Utopia main**, preserving Butler, Remote Fabric, General AI Gateway and any other accepted mainline work.
