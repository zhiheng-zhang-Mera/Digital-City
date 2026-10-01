# Butler Assistant Engineering / 管家助理工程

<!-- COMPONENT-STAGE-STATUS -->
> **Component stage (2026-10-01) — Butler Assistant: 9/9 two-stage complete.** Corrected heads and hosted-CI evidence are recorded in each task workbook frontmatter and `../reports/<ID>/CORRECTION_REPORT.md`.
> **Merge stage (2026-10-01) — Butler Assistant: MERGED to Utopia main and CI green.** Merge workbook: [BUTLER_ASSISTANT_MERGE_WORKBOOK.md](./BUTLER_ASSISTANT_MERGE_WORKBOOK.md). Terminal state `BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN` is satisfied; all nine `archive/BA-0XX` tags preserve the corrected branch heads and the nine `butler-assistant/*` remote branches are deleted.
<!-- /COMPONENT-STAGE-STATUS -->

This folder defines the active subprojects for the standalone Butler & Companion Zone.

## Architectural identity

- Digital-Me = the user's canonical self-model/context source.
- Butler Assistant = a separate logical agent identity serving the user.
- An assistant may be configured as butler, secretary, companion or another role without changing Digital-Me.
- Same-assistant multi-device presence = **one logical identity, many embodiments, one authoritative durable state, many contextual projections**.
- Different assistant identities are different logical assistants.
- One device has at most one **foreground interaction assistant**.
- Foreground binding is independent from task ownership and background execution; a device may continue background work for an assistant that is not currently foreground.
- Shared brain does **not** mean one giant synchronized live LLM context. Durable facts/decisions/checkpoints/tasks may be committed to shared state; scratch reasoning, temporary plan drafts and UI/device context stay local until explicitly promoted.
- External or state-changing side effects require authoritative task/version state, an appropriate execution lease and an idempotency/action key.
- Handoff transfers responsibility/checkpoints, never permission or capability grants.
- Reconnect treats local state as cache: authoritative state and leases must be revalidated before side effects resume.
- Knowledge is not disclosure authority: audience/channel/privacy scope is part of context projection.

## Memory/context namespaces

At minimum the design must distinguish:
1. user-global canonical context (through Digital-Me or other authorized sources);
2. assistant-private durable memory/assistant↔user relationship context;
3. project/task context;
4. audience/channel disclosure context;
5. device/session ephemeral context.

A datum may be usable by the assistant in one scope without being releasable into another audience.

## Personalization contract

The initial schema/ports reserve at least:
- address/name and how the assistant addresses the user;
- voice;
- avatar/character appearance;
- personality;
- duties/role;
- companion/relationship mode;
- extension fields for future attributes.

Profile/personality fields must never embed action leases or permission grants.

No voice model, avatar renderer or companion-specific LLM is required merely to pass this phase; the contract and replacement-safe state boundaries are required.

## Construction workflow

The Pre-Assistant project gate is OPEN. All BA-001..BA-009 branches use the same frozen Utopia baseline:

`82ed36933fb4c5b00e44768d9e1aedec1d525d9c`

All subprojects follow the parent Mission Book Development → Correction workflow. Development and Correction must be performed by different physical hosts, and no BA branch may merge to Utopia main before the final project merge workbook is unlocked.


## Cross-programme asynchronous execution

This programme participates in the global BA/RF/GAI/EM pool defined by `../CROSS_PROGRAMME_EXECUTION_CONTRACT.md`. Alien and Mech are both available now. BA tasks may be claimed immediately.

- Dynamic claim truth lives in each BA task workbook frontmatter; do not serialize ordinary claims through README/MISSION_INDEX edits.
- Eligible Correction by the opposite host has priority over new Development; otherwise either host claims any unclaimed task across any programme.
- Waiting CI/external checks do not idle a host; keep the claim and continue another eligible stage in a separate worktree.
- BA component work never waits for RF/GAI/EM implementations. Use stable contracts/doubles and record integration seams.
- BA-001..BA-009 drained, and the BA merge workbook has been created and run (see below). Butler has no hard dependency on another programme's terminal state.

## Component stage status — 2026-10-01

BA-001..BA-009 are **9/9 two-stage complete**: every task records `development_complete = true` (Mech) and
`correction_complete = true` (Alien) with a pushed corrected head and hosted CI green, and each task's
correction report is under `../reports/<ID>/CORRECTION_REPORT.md`. The correction round the Owner requested on
2026-10-01 closed BA-007 (head `f8f15af`, run 36817491957) and BA-009 (head `2abf8d4`, run 36818585688).

## Merge stage status — 2026-10-01

The BA merge workbook [BUTLER_ASSISTANT_MERGE_WORKBOOK.md](./BUTLER_ASSISTANT_MERGE_WORKBOOK.md) was created and
executed against then-current `main`:

```text
source main         = d914c06 (BA integration refreshed from then-current main before the final merge)
integration branch  = merge/butler-assistant-integration
integration head    = 4ff27ba   CI 36827219769 success
main merge commit   = 41e241c   CI 36827422797 success
archive tags        = archive/BA-001 .. archive/BA-009 (9 annotated tags, each on its corrected head)
remote branches     = butler-assistant/* : 0 remaining (deleted after tagging)
```

Terminal state `BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN` is satisfied. Archiving replaced each branch ref with an
annotated tag on the same commit, so the full correction history stays reachable on origin and only `main`
remains as a branch.
