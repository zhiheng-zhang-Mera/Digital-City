# Mission Index — Butler Assistant Engineering

## Project gate

```text
FOUNDATION_BRANCH          = product/upt-pre-assistant-closeout
FOUNDATION_HEAD            = 85ecde437ec930f1b4aa41d8913540e012da5ee7
FOUNDATION_BRANCH_CI       = 36691043142 - android success, gateway-web success
FOUNDATION_MERGED_MAIN     = 8104f8289a76d15ff0197c953730edcef42cab5e
MERGED_MAIN_CI             = 36692675561 - android success, gateway-web success
FOUNDATION_STATE           = MERGED / MERGED_MAIN_CI_GREEN
BUTLER_DEVELOPMENT         = UNLOCKED (gate opened 2026-09-30)
BUTLER_DEVELOPMENT_HOLD    = OWNER_RULING_2026-09-30 - HELD_PENDING_SECOND_REAL_HOST
BUTLER_BASELINE            = 8104f8289a76d15ff0197c953730edcef42cab5e
ARCHITECTURE_CONTRACT      = ASSISTANT_DISTRIBUTED_STATE_V2
BUTLER_MERGE               = FORBIDDEN
```

Gate history remains auditable:
- first candidate was independently rejected and repaired before acceptance;
- the Pre-Assistant single-host waiver does not carry into Butler Assistant;
- post-merge branch audit reported 35 origin refs and unmerged = 0;
- reports remain under [reports/UPT-PRE-ASSISTANT/](./reports/UPT-PRE-ASSISTANT/).

**The gate is open but BA Development is held, not started.** The BA programme requires Development
and Correction to be performed by **different physical hosts**, and only one real host (`Alien`) is
currently available. The Owner ruled on 2026-09-30 to hold rather than begin Development that could
not be corrected. `BUTLER_DEVELOPMENT = UNLOCKED` therefore means *permitted*, not *in progress*: no
BA claim is valid until a second real host is confirmed. Recorded explicitly so that a later session
does not read an open gate as permission to begin BA-001.

Four non-blocking Pre-Assistant items remain carried forward and are **not** claimed as fixed here: Android Action drill-down does not open on the device; `start-city.ps1 -NoRooms` reports a misleading degraded reason; idempotency-key reuse refusal is HTTP 400 rather than 409; and the Web client is still handed the loopback `hubUrl`.

## Architecture contract v2

All BA work now uses these system-wide meanings:

- **shared brain** = one logical assistant with authoritative durable state plus per-embodiment ContextProjection; not synchronized live scratch/reasoning state;
- **foreground assistant** = the assistant handling the current device interaction surface; not automatically the owner or executor of tasks;
- **task owner/coordinator** and **executor** are distinct roles;
- **TaskHandoff** happens only when responsibility actually moves and never copies permission grants;
- exclusive/external side effects use task/version checks + execution lease + idempotency/action key;
- reconnect re-fetches authoritative state and revalidates leases before side effects resume;
- context/memory is scope- and audience-aware; knowing data does not authorize disclosure.

## Active assistant queue

| ID | Subproject | Development | Correction | Merge |
|---|---|:---:|:---:|:---:|
| BA-001 | Butler Zone + personalization contracts | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-002 | Shared Brain runtime + context projection | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-003 | Device embodiment + foreground binding | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-004 | Multi-assistant switch + explicit handoff | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-005 | Digital-Me context + memory/audience gateway | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-006 | Authoritative task coordination | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-007 | Assistant settings + interaction surface | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-008 | Event bus + execution lease/reconnect safety | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-009 | Duties / permission / proactivity policy | AVAILABLE / UNCLAIMED | LOCKED_UNTIL_DEV | FORBIDDEN |

Claim order:
1. prefer unclaimed Development;
2. otherwise eligible Correction;
3. Development Host != Correction Host;
4. no BA branch merges to main;
5. final merge workbook remains forbidden until every BA task has both stages complete and both Alien+Mech participation is proven.

The legacy mission set and exact Pre-Assistant workbook remain archived under [finished/replant/](./finished/replant/).
