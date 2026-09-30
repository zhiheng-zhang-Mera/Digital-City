# Butler Assistant Engineering / 管家助理工程

This folder defines the active subprojects for the standalone Butler & Companion Zone.

Architectural identity:
- Digital-Me = the user's canonical self-model.
- Butler Assistant = a separate agent identity serving the user.
- An assistant may be configured as butler, secretary, companion or another role without changing Digital-Me.
- Same-assistant multi-device presence is one shared brain with multiple embodiments.
- Different assistants are different brains.
- One device has at most one active foreground assistant.

Personalization contract is intentionally extensible. The initial schema/ports reserve at least:
- address/name and how the assistant addresses the user;
- voice;
- avatar/character appearance;
- personality;
- duties/role;
- companion/relationship mode;
- extension fields for future attributes.

No voice model, avatar renderer or companion-specific LLM is required merely to pass this phase; the contract and replacement-safe state boundaries are required.

All subprojects follow the parent Mission Book Development → Correction workflow. Development and Correction must be performed by different physical hosts, and no BA branch may merge to Utopia main before the final project merge workbook is unlocked.
