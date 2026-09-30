# Butler Assistant Engineering / 管家助理工程

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
- After BA-001..BA-009 drain, create the BA merge workbook immediately. Butler has no hard dependency on another programme's terminal state.
