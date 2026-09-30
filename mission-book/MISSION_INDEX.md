# Mission Index — Butler Assistant Engineering

## Active project

Project: Butler Assistant Engineering
Mode: PARALLEL_DEVELOPMENT_AND_CORRECTION
Implementation repo: zhiheng-zhang-Mera/Utopia
Control repo: zhiheng-zhang-Mera/Digital-City
Merge to Utopia main: LOCKED

## Active queue

| ID | Subproject | Dev | Correction | Merge |
|---|---|:---:|:---:|:---:|
| BA-001 | Terminal Shell + Rooms | OPEN | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-002 | Action Facade + deterministic Ask/Do | OPEN | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-003 | Butler Zone + personalization contracts | OPEN | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-004 | Shared Brain runtime | OPEN | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-005 | Device embodiment + binding | OPEN | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-006 | Multi-assistant switch + handoff | OPEN | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-007 | Digital-Me context gateway | OPEN | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-008 | Shared task coordination | OPEN | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-009 | Assistant settings + interaction surface | OPEN | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-010 | Embodiment event bus + concurrency | OPEN | LOCKED_UNTIL_DEV | FORBIDDEN |
| BA-011 | Duties / permission / proactivity policy | OPEN | LOCKED_UNTIL_DEV | FORBIDDEN |

Selection rule:
1. unclaimed Development first;
2. otherwise eligible Correction;
3. never claim both stages of the same task on the same host;
4. never merge a BA task branch to main during this queue.

## Merge unlock condition

A merge engineering book does not exist yet and MUST NOT be created until BA-001..BA-011 all have both stages complete and every branch has recorded work by Alien and Mech.

After that gate is met, the future merge engineering book must audit all branches, integrate them, merge to Utopia main and prove the resulting GitHub CI is fully green.

## Historical queue

The completed migration/replant mission set and the previous pre-assistant workbook are archived under [finished/replant/](./finished/replant/).
