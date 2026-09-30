# Mission Index — Butler Assistant Engineering

## Project gate

FOUNDATION_BRANCH = product/upt-pre-assistant-closeout
FOUNDATION_HEAD_AT_AUDIT = 85ecde437ec930f1b4aa41d8913540e012da5ee7
FOUNDATION_MAIN_AT_AUDIT = d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
FOUNDATION_STATE = AHEAD_OF_MAIN_4_COMMITS / T4_REJECT_REPAIRED / MERGED_MAIN_CI_NOT_YET_RECORDED
BUTLER_DEVELOPMENT = LOCKED_UNTIL_FOUNDATION_MERGED_MAIN_CI_GREEN
BUTLER_MERGE = FORBIDDEN

## Active assistant queue

| ID | Subproject | Development | Correction | Merge |
|---|---|:---:|:---:|:---:|
| BA-001 | Butler Zone + personalization contracts | WAITING_GATE | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-002 | Shared Brain runtime | WAITING_GATE | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-003 | Device embodiment + binding | WAITING_GATE | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-004 | Multi-assistant switch + handoff | WAITING_GATE | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-005 | Digital-Me context gateway | WAITING_GATE | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-006 | Shared task coordination | WAITING_GATE | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-007 | Assistant settings + interaction surface | WAITING_GATE | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-008 | Embodiment event bus + concurrency | WAITING_GATE | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-009 | Duties / permission / proactivity policy | WAITING_GATE | LOCKED_UNTIL_DEV | FORBIDDEN |

After the foundation gate opens:
1. prefer unclaimed Development;
2. otherwise eligible Correction;
3. Development Host != Correction Host;
4. no BA branch merges to main;
5. final merge workbook remains forbidden until every BA task has both stages complete and both Alien+Mech participation is proven.

The legacy mission set and exact Pre-Assistant workbook are archived under [finished/replant/](./finished/replant/).
