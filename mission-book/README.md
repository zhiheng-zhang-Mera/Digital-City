# Mission Book — Butler Assistant Engineering

> Current mode: BUTLER_ASSISTANT_PARALLEL_DEVELOPMENT
> Control repo: zhiheng-zhang-Mera/Digital-City
> Implementation repo: zhiheng-zhang-Mera/Utopia
> Utopia project baseline observed before this Mission Book rewrite: d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
>
> The previous migration/replant workbooks are archived under ./finished/replant/.
> Old reports, Owner responses and past-rules remain provenance only.

## Current construction dashboard

Legend: 🟢 = complete; 🔴 = not complete / not claimed. A task is merge-eligible only when both Development and Correction are complete.

| Subproject | Development claim | Development | Correction claim | Correction |
|---|---|:---:|---|:---:|
| [BA-001 Terminal Shell + Rooms](./butler-assistant/BA-001-terminal-shell-rooms.md) | unclaimed | 🔴 | unclaimed | 🔴 |
| [BA-002 Action Facade + Ask/Do](./butler-assistant/BA-002-action-facade-ask-do.md) | unclaimed | 🔴 | unclaimed | 🔴 |
| [BA-003 Butler Zone + Personalization Contracts](./butler-assistant/BA-003-butler-zone-personalization.md) | unclaimed | 🔴 | unclaimed | 🔴 |
| [BA-004 Shared Brain Runtime](./butler-assistant/BA-004-shared-brain-runtime.md) | unclaimed | 🔴 | unclaimed | 🔴 |
| [BA-005 Device Embodiment + Binding](./butler-assistant/BA-005-device-embodiment-binding.md) | unclaimed | 🔴 | unclaimed | 🔴 |
| [BA-006 Multi-Assistant Switching + Handoff](./butler-assistant/BA-006-multi-assistant-handoff.md) | unclaimed | 🔴 | unclaimed | 🔴 |
| [BA-007 Digital-Me Context Gateway](./butler-assistant/BA-007-digital-me-context-gateway.md) | unclaimed | 🔴 | unclaimed | 🔴 |
| [BA-008 Shared Task Coordination](./butler-assistant/BA-008-shared-task-coordination.md) | unclaimed | 🔴 | unclaimed | 🔴 |
| [BA-009 Assistant Settings + Interaction Surface](./butler-assistant/BA-009-settings-interaction-surface.md) | unclaimed | 🔴 | unclaimed | 🔴 |
| [BA-010 Embodiment Event Bus + Concurrency](./butler-assistant/BA-010-embodiment-event-bus.md) | unclaimed | 🔴 | unclaimed | 🔴 |
| [BA-011 Duties / Permission / Proactivity Policy](./butler-assistant/BA-011-duty-permission-policy.md) | unclaimed | 🔴 | unclaimed | 🔴 |

## 1. Core architecture invariants

1. Digital-Me is the canonical user self-model. It is not an assistant persona store.
2. Butler Assistant Zone is a separate replaceable agent domain.
3. Assistant personalization must be independently changeable without mutating Digital-Me user data.
4. Personalization interfaces must reserve, at minimum and without limiting future expansion:
   - user-facing form of address / naming;
   - voice;
   - character/avatar appearance;
   - personality;
   - duties / role scope;
   - companion/relationship mode and future assistant attributes.
5. One logical assistant may inhabit multiple devices simultaneously.
6. Multiple device embodiments of the same assistant share one brain: one assistant identity, memory/relationship state, planning state and task graph. They are not independent minds that later synchronize.
7. Multiple assistant identities may be online in the ecosystem simultaneously.
8. One physical/logical device may have at most one active foreground assistant at a time.
9. Switching assistants on one device does not automatically transfer the outgoing assistant's global tasks.
10. A handoff occurs only when responsibility actually needs to move to another assistant. If no transferable task exists, switching is immediate.
11. If an assistant is fully replaced/offlined, transferable active responsibilities must be handed off before shutdown.
12. Tasks live in shared Core/City task infrastructure, not only in a device session or assistant local UI.
13. Digital-Me access is scoped/authorized context access. Assistant persona/relationship state must never be written into Digital-Me as user identity data.

## 2. Work model: Development → Correction

The old Migration / Verification terminology is retired for this project.

- DEVELOPMENT: implement the bounded subproject on its own Utopia branch.
- CORRECTION: an independent host reviews the Development result for design holes and directly repairs all in-scope defects on the same branch.

Correction is not a report-only stage. It must:
1. inspect for architectural, state-consistency, concurrency, permission, lifecycle, recovery and product-design loopholes relevant to that subproject;
2. directly fix discovered in-scope defects;
3. add/update tests for the fixes;
4. leave the branch CI green before marking Correction complete.

## 3. Claim and host-separation rules

Available physical build hosts for this project are Alien and Mech.

For every BA subproject:
- Development Host and Correction Host MUST be different.
- Therefore every task branch must be worked on by both Alien and Mech at least once before final merge.
- A host may not perform both roles for the same BA task.
- Work starts by preferring unclaimed Development tasks; if none are available, claim an eligible Correction task.
- If a stage is already claimed and not complete, skip it and choose another eligible stage.
- Development happens on a new branch and does not merge to Utopia main.
- Correction continues on the same pushed branch and also does not merge to Utopia main.
- Claim records must contain host, timestamp, Utopia base SHA, branch and head SHA.
- Reports go under mission-book/reports/BA-XXX/.

## 4. Parallelism / non-blocking rule

BA-001..BA-011 are intentionally split so their Development branches may proceed independently from the frozen project baseline.

A worker must not wait for another BA branch merely to continue its own bounded work. When another subproject is not yet available:
- use the contract/port defined in the local workbook;
- provide a deterministic stub/fake only for tests where necessary;
- do not copy another subproject's implementation;
- record the integration seam for the future merge workbook.

Cross-branch wiring and conflict resolution are deferred to final integration. A subproject must not merge another BA branch into itself just to make its own tests pass.

## 5. Branch convention

Each task uses one Utopia branch:

assistant/BA-XXX-short-name

The Development Host creates/pushes it. The Correction Host checks out the exact same branch, reviews it independently, repairs it and pushes the corrected head.

No BA branch may merge to Utopia main during this phase.

## 6. Completion gates per subproject

Development complete requires:
- bounded scope implemented;
- no silent scope expansion;
- unit/contract tests for positive and negative behavior;
- locally relevant Utopia checks pass;
- DEVELOPMENT_REPORT written;
- branch pushed and exact head SHA recorded.

Correction complete requires:
- different physical host;
- independent design review;
- in-scope defects directly repaired rather than merely listed;
- tests cover corrections;
- relevant local checks and branch GitHub CI green;
- CORRECTION_REPORT written;
- exact corrected head SHA recorded.

## 7. Hard merge lock

MERGE_WORKBOOK_CREATION = FORBIDDEN until ALL BA-001..BA-011 satisfy:
- development_complete = true;
- correction_complete = true;
- Development Host != Correction Host;
- branch history/evidence proves both Alien and Mech worked on the branch;
- branch exists remotely and has a recorded corrected head SHA.

Before a merge workbook is allowed to start, perform an audit over every BA branch and explicitly prove the two-host condition.

Only after the audit passes may a new merge workbook be created.

## 8. Future merge workbook mandatory gates

The future merge workbook must:
1. fetch current Utopia main and every corrected BA branch;
2. re-check both-host participation on every branch;
3. integrate the branches without dropping valid behavior; conflict resolution prefers an explicit union/superset when compatible;
4. preserve the one-brain/multi-embodiment and one-device/one-active-assistant invariants;
5. run the full relevant local test suite;
6. merge the integrated result to Utopia main;
7. verify GitHub CI on the resulting Utopia main SHA.

Final project completion is forbidden if any required GitHub CI check on the merged main SHA is red, cancelled, skipped when required, or still pending.

Required terminal state:

BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN

## 9. Archive

The previous mission/workbook set is preserved in:
- [finished/replant/](./finished/replant/)

Do not use those archived files as the active scheduler.
