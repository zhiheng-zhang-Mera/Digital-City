# Mission Book — Active Parallel Engineering Programmes

> Current mode: **COMPONENT_STAGE_COMPLETE (41/41 two-stage) — ALL FOUR PROGRAMME MERGES COMPLETE (`ALL_PROGRAMMES_MERGED_MAIN_CI_GREEN`)**
> Active programmes: BUTLER_ASSISTANT + REMOTE_FABRIC + GENERAL_AI_GATEWAY + ENGINEERING_MANAGER
> Control repo: zhiheng-zhang-Mera/Digital-City
> Implementation repo: zhiheng-zhang-Mera/Utopia
> Foundation gate: **OPEN**
> Unified unstarted-programme baseline: `82ed36933fb4c5b00e44768d9e1aedec1d525d9c`
> Canonical static state: [PROGRAMME_STATE.yaml](./PROGRAMME_STATE.yaml)
> Normative cross-programme contract: [CROSS_PROGRAMME_EXECUTION_CONTRACT.md](./CROSS_PROGRAMME_EXECUTION_CONTRACT.md)
> Architecture contracts: **ASSISTANT_DISTRIBUTED_STATE_V2 / REMOTE_FABRIC_V1 / GENERAL_AI_GATEWAY_V1 / ENGINEERING_MANAGER_V1**
> Engineering Manager donor: `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b`
>
> Component evidence: the corrected head SHA and hosted-CI run for every task are recorded in that task workbook's frontmatter and in `./reports/<ID>/CORRECTION_REPORT.md`. The four programme queues and [MISSION_INDEX.md](./MISSION_INDEX.md) were aligned with those workbooks on 2026-10-01.
>
> The old migration/replant workbooks and the exact historical Pre-Assistant workbook remain archived under `./finished/replant/`.
> Recovery overlay: [ENGINEERING_BOOK-2026-10-01-ASYNC-DISPATCH-RECOVERY-AND-DRAIN.md](./ENGINEERING_BOOK-2026-10-01-ASYNC-DISPATCH-RECOVERY-AND-DRAIN.md). **External GitHub Actions billing block recovered; recovery state reconciled on 2026-10-01.** Eligibility-aware ~20 minute bounded re-scan remains normative for temporary zero-claim states.

## Current construction dashboard

**Canonical rule:** static host/programme configuration lives in [PROGRAMME_STATE.yaml](./PROGRAMME_STATE.yaml). Dynamic claim/completion truth lives in each task workbook frontmatter and its reports. README/MISSION_INDEX are dashboards and MUST NOT be edited as part of an ordinary task claim.

Reconciled control-plane snapshot (2026-10-01, after the five-task Correction round the Owner requested):

`DEVELOPMENT_GREEN=41/41` · `CORRECTION_COMPLETE=41/41` · `ALL_FOUR_COMPONENT_POOLS_DRAINED=true` · `MERGE_WORKBOOKS_CREATED=4/4` · `ALL_PROGRAMMES_MERGED_MAIN_CI_GREEN=true` · `GITHUB_ACTIONS_EXTERNAL_BLOCK=RECOVERED`

Utopia `main` is now `e7c498f5acd86da324a45c3278219c8daa612561` with hosted CI run `36830053908` green. It holds
the union of all 41 corrected component branches. Every corrected head is preserved as an annotated
`archive/<ID>` tag on origin, and every source branch has been deleted, so **`main` is the only branch left on
GitHub**. Merging did not delete history: each task's commits remain reachable through the merge graph and
through its archive tag.

| Programme | Task pool | Development | Correction | Merge / next stage |
|---|---|---:|---:|---|
| Butler Assistant | BA-001..BA-009 | **9/9 green** | **9/9 complete** | **MERGED_MAIN** — `41e241c`, CI 36827422797; 9 archive tags |
| Remote Fabric | RF-001..RF-010 | **10/10 green** | **10/10 complete** | **MERGED_MAIN** — `49914d9`, CI 36828413515; 10 archive tags |
| General AI Gateway | GAI-001..GAI-009 | **9/9 green** | **9/9 complete** | **MERGED_MAIN** — `74b37cf`, CI 36829232339; 9 archive tags |
| Engineering Manager | EM-001..EM-013 | **13/13 green** | **13/13 complete** | **MERGED_MAIN** — `e7c498f`, CI 36830053908; 13 archive tags |

Every component task is Development- and Correction-complete on its own pushed branch head with hosted CI
green, and Development/Correction were performed by different physical hosts on every task. **All four
programme merges are executed and verified on `main` CI.** The five Corrections the Owner requested on
2026-10-01 (BA-007, BA-009, GAI-009, EM-012, EM-013) are closed in `./reports/<ID>/CORRECTION_REPORT.md`, each
recording its corrected head SHA, its hosted-CI run, its author-encoded boundaries and its disclosure section.

Available physical build hosts are **Alien and Mech**. Both are now **idle**: a fresh global scan finds no
actionable owned repair, no eligible opposite-host Correction and no unclaimed Development. Mech remains
`PARKED / NO_WORK / DO_NOT_WAKE`; hosts re-enter only on a new pool, a new Development or an explicit Owner
instruction.

## 0. Foundation start gate — OPEN

The historical Pre-Assistant workbook is preserved at:
[finished/replant/ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md](../replant/ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md)

Recorded accepted state:

```text
branch head (accepted)   = 85ecde437ec930f1b4aa41d8913540e012da5ee7
branch CI                = 36691043142  android success, gateway-web success
merged Utopia main SHA   = 8104f8289a76d15ff0197c953730edcef42cab5e
merged-main CI           = 36692675561  android success, gateway-web success
post-merge branch audit  = 35 origin refs, unmerged = 0
```

The independent verifier rejected the first candidate and accepted the repaired candidate. The single-host Owner waiver used for that Pre-Assistant closeout does not apply to BA work. Butler Development is therefore unlocked, but each BA task still requires two different physical hosts for Development and Correction.

Because none of the four programmes had started when this reset was authorized, BA/RF/GAI/EM now share the same frozen baseline `82ed36933fb4c5b00e44768d9e1aedec1d525d9c`. Component branches remain independently integrable and cross-programme work is explicitly non-blocking.

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

For every BA/RF/GAI/EM task:
- Development Host and Correction Host MUST be different.
- Alien and Mech are both available; there is no second-host hold.
- A host may not perform both roles for the same task.
- Dynamic claim truth is updated atomically only in the target task workbook; ordinary claims do not edit README/MISSION_INDEX.
- Development creates/pushes a task branch and does not merge it to Utopia main.
- Correction continues on that same task branch and does not merge it to Utopia main.
- Reports go under `mission-book/reports/<TASK-ID>/`.

## 4. Global cross-programme asynchronous / no-idle rule

All 41 component tasks form one global claim pool. A free host scans **all four programmes**, not only the programme it worked on previously.

Claim priority:
1. repair an actionable red stage already owned by this host;
2. claim an eligible Correction whose Development was completed by the other host;
3. otherwise claim any unclaimed Development across BA/RF/GAI/EM;
4. when choices are equivalent, prefer a different programme from the host's previous claim to expose integration seams early, but never wait merely for balance.

A stage in hosted CI, a long local test, provider wait, external login wait, or other non-CPU-active wait **does not reserve the host**. Keep that claim, use a separate worktree, and claim another eligible stage. Missing sibling implementations use stable ports plus deterministic doubles. Real external acceptance that cannot be performed yet is recorded and deferred to programme integration rather than blocking unrelated component work.

A host stops claiming only when the global scan finds no actionable owned repair, no eligible Correction and no unclaimed Development. See the normative cross-programme contract for atomic claim/retry and merge-stage rules.

## 5. Completion gates

Development complete requires bounded implementation, positive/negative tests, relevant concurrency/recovery tests, relevant local checks, branch CI green, DEVELOPMENT_REPORT and exact head SHA.

Correction complete requires a different physical host, independent adversarial review, direct repairs, regression tests, relevant local checks, branch CI green, CORRECTION_REPORT and exact corrected head SHA.

## 6. Hard merge lock

`MERGE_WORKBOOK_CREATION = SATISFIED (2026-10-01) — WORKBOOK CREATED AND EXECUTED`.

The lock was `FORBIDDEN` until ALL BA-001..BA-009 satisfy:
- `development_complete = true`;
- `correction_complete = true`;
- Development Host != Correction Host;
- branch history/evidence proves both Alien and Mech worked on the branch;
- corrected branch head is recorded and remote.

Only after a full branch audit proves the above may a new Butler Assistant merge engineering book be created.

**Status 2026-10-01:** all nine BA tasks record `development_complete = true`, `correction_complete = true`, opposite hosts, and a pushed corrected head with hosted CI green, so the conditions above were met. The BA merge workbook [BUTLER_ASSISTANT_MERGE_WORKBOOK.md](./butler-assistant/BUTLER_ASSISTANT_MERGE_WORKBOOK.md) was then created and run to completion (integration head `4ff27ba`, CI `36827219769`; `main` merge `41e241c`, CI `36827422797`).

## 7. Merge workbook mandatory gates

The BA merge workbook did:
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

Required terminal state: `BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN` — **REACHED**.


## Remote Fabric programme

Remote Fabric planning is active under [remote/README.md](./remote/README.md). It uses the unified baseline `82ed36933fb4c5b00e44768d9e1aedec1d525d9c` and the same two-stage/two-physical-host discipline as the other programmes, but it is a separate merge unit.

| Remote task set | Development | Correction | Merge |
|---|:---:|:---:|:---:|
| [RF-001..RF-010 Remote Fabric](./remote/README.md) | **10/10 green (Alien/Mech)** | **10/10 complete (opposite host)** | **MERGED_MAIN** — `49914d9`, CI 36828413515 |

Remote construction is asynchronous: each RF task has its own `remote/RF-...` branch from the frozen baseline and may proceed independently immediately. No RF task branch may merge into Utopia main, and no RF branch may merge/cherry-pick sibling RF branches merely to pass locally.

`REMOTE_MERGE_WORKBOOK_CREATION = SATISFIED (2026-10-01) — WORKBOOK CREATED AND EXECUTED`. The lock was `FORBIDDEN` until every RF-001..RF-010 Development and Correction stage is green, Development Host != Correction Host, and both-host evidence is recorded; all ten RF tasks recorded exactly that. The Remote merge workbook [REMOTE_FABRIC_MERGE_WORKBOOK.md](./remote/REMOTE_FABRIC_MERGE_WORKBOOK.md) then integrated the corrected RF branches on top of the **then-current Utopia main** (source `41e241c`; integration head `160fcc3`, CI `36828179156`; `main` merge `49914d9`, CI `36828413515`), preserving the Butler work already on main. RF-001 × RF-002 conflicts across the City manifest, its test, the capability-registry test and both architecture docs were resolved as explicit unions.


## General AI Gateway programme

General AI Gateway planning is active under [general-ai-gateway/README.md](./general-ai-gateway/README.md).

The programme is a separate City/Utopia merge unit with target ownership reserved for **00 City Foundation / General AI Gateway**. It does not revive Codex-Boss: Boss is a historical tombstone only and is forbidden as a build/runtime dependency or live connector target. Legacy behavior may only re-enter as independently owned Utopia code from current accepted requirements or explicit Owner-supplied excerpts.

| General AI Gateway task set | Development | Correction | Merge |
|---|:---:|:---:|:---:|
| [GAI-001..GAI-009 General AI Gateway](./general-ai-gateway/README.md) | **9/9 green (Mech)** | **9/9 complete (Alien)** | **MERGED_MAIN** — `74b37cf`, CI 36829232339 |

All GAI branches start from frozen Utopia baseline `82ed36933fb4c5b00e44768d9e1aedec1d525d9c`. Development and Correction use different physical hosts, but the hosts do not have to be online at the same time. Missing sibling code or Remote Fabric implementation must not stall bounded work: use the programme's stable ports and deterministic test doubles, record the unresolved integration seam, and continue. Real cross-device execution remains a mandatory final programme acceptance gate and may not be faked.

`GENERAL_AI_GATEWAY_MERGE_WORKBOOK_CREATION = SATISFIED (2026-10-01) — WORKBOOK CREATED AND EXECUTED`. The lock was `FORBIDDEN` until every GAI task has green Development and Correction evidence with different hosts; all nine GAI tasks recorded exactly that. The GAI merge workbook [GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md](./general-ai-gateway/GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md) then integrated the corrected GAI branches on top of the **then-current Utopia main** (source `49914d9`; integration head `a47e4eb`, CI `36828980482`; `main` merge `74b37cf`, CI `36829232339`), preserving Butler, Remote Fabric and other accepted mainline work. Real provider/login and real two-device acceptance remain open programme-integration gates and are not claimed by the merge.


## Engineering Manager programme

Engineering Manager planning is active under [engineering-manager/README.md](./engineering-manager/README.md).

This is the permanent Mission Book namespace for Engineering Foreman / Worker Connector work. It maps onto the existing **02 Engineering Works / Project Foreman + Worker Gateway** ownership rather than creating a duplicate City building. DS-Hns is a pinned donor only; reused capabilities must become Utopia-owned code. Codex-Boss is out of scope and must not be accessed.

| Engineering Manager task set | Development | Correction | Merge |
|---|:---:|:---:|:---:|
| [EM-001..EM-013 Engineering Manager](./engineering-manager/README.md) | **13/13 green (Mech)** | **13/13 complete (Alien)** | **MERGED_MAIN** — `e7c498f`, CI 36830053908 |

All EM branches start from frozen Utopia baseline `82ed36933fb4c5b00e44768d9e1aedec1d525d9c`. Development and Correction use different physical hosts but do not have to be online simultaneously. Sibling absence, hosted CI, Remote Fabric incompleteness and optional third-party connector absence must not make a worker idle: use stable programme ports/test doubles for bounded component work, record only the genuinely external pending seam, and continue another eligible stage.

Three programme invariants are hard requirements: **(1)** blocking Engineering attention follows the user and also alerts the 2–3 most recently operated eligible devices with one globally acknowledged attention event; **(2)** Sub-worker placement is `LOCAL_FIRST`, with remote fallback proposed only for measured `LOCAL_BLOCKED/LOCAL_UNAVAILABLE` and requiring explicit user approval; **(3)** when execution is remote, progress/control/attention/results/artifacts automatically return through canonical/shared state to the user's current authorized interaction surface, so normal work never requires walking to the remote host.

`ENGINEERING_MANAGER_MERGE_WORKBOOK_CREATION = SATISFIED (2026-10-01) — WORKBOOK CREATED AND EXECUTED`. The lock was `FORBIDDEN` until every EM task has green Development and Correction evidence with different hosts; all thirteen EM tasks recorded exactly that. The EM merge workbook [ENGINEERING_MANAGER_MERGE_WORKBOOK.md](./engineering-manager/ENGINEERING_MANAGER_MERGE_WORKBOOK.md) then integrated the corrected EM branches on top of the **then-current Utopia main** (source `74b37cf`; integration head `aef657f`, CI `36829755814`; `main` merge `e7c498f`, CI `36830053908`), preserving Butler, Remote Fabric, General AI Gateway and other accepted mainline work. Real third-party connector and real remote E2E acceptance remain open programme-integration gates and are not claimed by the merge.


## 10. Cross-programme authority and merge behavior

[CROSS_PROGRAMME_EXECUTION_CONTRACT.md](./CROSS_PROGRAMME_EXECUTION_CONTRACT.md) is normative for all four programmes. In particular, Remote Fabric owns node identity/trust/presence/transport; Shared Task/Action Core owns canonical task/action/attention truth; Butler owns assistant semantics; General AI Gateway owns general-AI semantics; Engineering Manager owns engineering-job semantics. Domain event models are never replaced by Remote transport envelopes.

When a programme component pool drains, its merge workbook may be created immediately without waiting for another programme's component pool. If a final real external seam is not yet available (for example GAI/EM remote E2E before Remote Fabric is accepted), the integration branch performs every independent step, records `INTEGRATED_WAITING_EXTERNAL_SEAM`, and releases the host back to the global pool. Immediately before any final Utopia-main merge, the integration branch refreshes from then-current main and reruns required CI/acceptance.

语言配对 / Language pair: [English](./README-legacy-dashboard.md) · [中文](./zh-CN/README-legacy-dashboard.md)
