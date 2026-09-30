# Mission Book — Butler Assistant Engineering

> Current mode: WAITING_FOUNDATION_CLOSEOUT → BUTLER_ASSISTANT_PARALLEL_DEVELOPMENT
> Control repo: zhiheng-zhang-Mera/Digital-City
> Implementation repo: zhiheng-zhang-Mera/Utopia
>
> Pre-Assistant foundation is already implemented on Utopia branch product/upt-pre-assistant-closeout at 85ecde437ec930f1b4aa41d8913540e012da5ee7.
> That branch is 4 commits ahead of Utopia main d0dea7bcb66cf57edee73c67ddfb9526337dfb4e at the latest audit.
> City main already records the T4 round-1 rejection and subsequent repairs under R13.
> Butler Assistant development MUST NOT start until that existing foundation branch is merged to Utopia main and the resulting required GitHub CI is green.
>
> The old migration/replant workbooks are archived under ./finished/replant/.

## Current construction dashboard

Legend: 🟢 = complete; 🔴 = not complete; ⏸ = project start gate not yet open.

| Subproject | Development claim | Development | Correction claim | Correction |
|---|---|:---:|---|:---:|
| [BA-001 Butler Zone + Personalization Contracts](./butler-assistant/BA-001-butler-zone-personalization.md) | blocked by foundation gate | ⏸ | unclaimed | 🔴 |
| [BA-002 Shared Brain Runtime](./butler-assistant/BA-002-shared-brain-runtime.md) | blocked by foundation gate | ⏸ | unclaimed | 🔴 |
| [BA-003 Device Embodiment + Binding](./butler-assistant/BA-003-device-embodiment-binding.md) | blocked by foundation gate | ⏸ | unclaimed | 🔴 |
| [BA-004 Multi-Assistant Switching + Handoff](./butler-assistant/BA-004-multi-assistant-handoff.md) | blocked by foundation gate | ⏸ | unclaimed | 🔴 |
| [BA-005 Digital-Me Context Gateway](./butler-assistant/BA-005-digital-me-context-gateway.md) | blocked by foundation gate | ⏸ | unclaimed | 🔴 |
| [BA-006 Shared Task Coordination](./butler-assistant/BA-006-shared-task-coordination.md) | blocked by foundation gate | ⏸ | unclaimed | 🔴 |
| [BA-007 Assistant Settings + Interaction Surface](./butler-assistant/BA-007-settings-interaction-surface.md) | blocked by foundation gate | ⏸ | unclaimed | 🔴 |
| [BA-008 Embodiment Event Bus + Concurrency](./butler-assistant/BA-008-embodiment-event-bus.md) | blocked by foundation gate | ⏸ | unclaimed | 🔴 |
| [BA-009 Duties / Permission / Proactivity Policy](./butler-assistant/BA-009-duty-permission-policy.md) | blocked by foundation gate | ⏸ | unclaimed | 🔴 |

## 0. Foundation start gate

The previous Pre-Assistant workbook has been archived, not discarded. Its exact historical copy is:
[finished/replant/ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md](./finished/replant/ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md)

The existing implementation branch must finish its already-started closeout. No BA Development claim is valid until all are true:
- product/upt-pre-assistant-closeout is merged to Utopia main;
- the merged Utopia main SHA is recorded;
- all required GitHub CI checks on that merged main SHA are green.

This gate is a one-time project prerequisite. After it opens, BA-001..BA-009 are deliberately non-blocking relative to each other and may be developed in parallel from the same pinned Butler project baseline.

## 1. Core architecture invariants

1. Digital-Me is the canonical user self-model. It is not an assistant persona store.
2. Butler Assistant Zone is a separate replaceable agent domain.
3. Assistant personalization must be independently changeable without mutating Digital-Me user data.
4. Personalization interfaces must reserve, at minimum and without limiting future expansion:
   - user-facing naming / form of address;
   - voice;
   - character/avatar appearance;
   - personality;
   - duties / role scope;
   - companion/relationship mode;
   - extension fields for future attributes.
5. One logical assistant may inhabit multiple devices simultaneously.
6. Multiple device embodiments of the same assistant share one brain: identity, memory/relationship state, planning state and task graph. They are not independent minds that later synchronize.
7. Multiple assistant identities may be online simultaneously.
8. One device may have at most one active foreground assistant at a time.
9. Switching assistants on one device does not automatically transfer the outgoing assistant's global tasks.
10. Handoff occurs only when responsibility actually needs to move. No transferable task means immediate switch.
11. Full assistant replacement/offline requires transfer of transferable active responsibilities before shutdown, unless the Owner explicitly cancels them.
12. Tasks live in shared Core/City task infrastructure, not only in a device session.
13. Digital-Me access is scoped/authorized context access; assistant persona/relationship state must not be written into Digital-Me as user identity data.

## 2. Work model: Development → Correction

The old Migration / Verification terminology is retired for this project.

- DEVELOPMENT: implement the bounded subproject on its own Utopia branch.
- CORRECTION: a different physical host independently looks for design loopholes and directly repairs every in-scope defect on that same branch.

Correction is not report-only. It must:
1. inspect for architectural, state-consistency, concurrency, permission, lifecycle, recovery and product-design holes relevant to that subproject;
2. directly fix discovered in-scope defects;
3. add/update regression tests;
4. leave the branch CI green before marking Correction complete.

## 3. Claim and host-separation rules

Available physical build hosts: Alien and Mech.

For every BA task:
- Development Host and Correction Host MUST be different.
- Every task branch must therefore be worked on by both Alien and Mech at least once before final merge.
- A host may not perform both roles for the same task.
- Prefer unclaimed Development tasks first; if none are available, claim an eligible Correction task.
- If a stage is already claimed and incomplete, skip it and choose another eligible stage.
- Development creates/pushes a new branch and does not merge it to Utopia main.
- Correction continues on the same branch and does not merge it to Utopia main.
- Reports go under mission-book/reports/BA-XXX/.

## 4. Parallel / non-blocking rule

Once the foundation start gate opens, BA-001..BA-009 use the same frozen Butler baseline and may proceed independently.

A worker must not wait for another BA branch merely to continue its own bounded work. When another subproject is not yet available:
- use the local workbook's stable port/contract;
- use deterministic test doubles only where necessary;
- do not copy another subproject's implementation;
- record the integration seam for the future merge workbook.

Cross-branch wiring and conflict resolution are deferred to final integration. A BA branch must not merge another BA branch into itself just to pass its own tests.

## 5. Completion gates

Development complete requires bounded implementation, positive/negative tests, relevant local checks, branch CI green, DEVELOPMENT_REPORT and exact head SHA.

Correction complete requires a different physical host, independent design review, direct repairs, regression tests, relevant local checks, branch CI green, CORRECTION_REPORT and exact corrected head SHA.

## 6. Hard merge lock

MERGE_WORKBOOK_CREATION = FORBIDDEN until ALL BA-001..BA-009 satisfy:
- development_complete = true;
- correction_complete = true;
- Development Host != Correction Host;
- branch history/evidence proves both Alien and Mech worked on the branch;
- corrected branch head is recorded and remote.

Only after a full branch audit proves the above may a new Butler Assistant merge engineering book be created.

## 7. Future merge workbook mandatory gates

The future merge workbook must:
1. fetch current Utopia main and every corrected BA branch;
2. re-check both-host participation on every branch;
3. integrate all branches without dropping valid behavior; compatible conflicts should preserve an explicit union/superset;
4. preserve one-brain/multi-embodiment and one-device/one-active-assistant invariants;
5. run the full relevant local test suite;
6. merge the integrated result to Utopia main;
7. verify GitHub CI on the resulting Utopia main SHA.

Final completion is forbidden if any required merged-main GitHub CI check is red, cancelled, required-but-skipped, or still pending.

Required terminal state: BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN
