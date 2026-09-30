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
BUTLER_MERGE               = FORBIDDEN
```

Gate history, so the gate is auditable rather than merely asserted:

- `FOUNDATION_HEAD_AT_AUDIT = 85ecde437ec9`, `FOUNDATION_MAIN_AT_AUDIT = d0dea7b`,
  state at that audit was `AHEAD_OF_MAIN_4_COMMITS / T4_REJECT_REPAIRED / MERGED_MAIN_CI_NOT_YET_RECORDED`.
- The one remaining condition — "merged Utopia main SHA recorded, and all required CI green on it" —
  was then satisfied by the closeout itself: branch head `85ecde4` merged to main as `8104f82`
  (parents `d0dea7b`, `85ecde4`), branch CI `36691043142` green on both jobs, merged-main CI
  `36692675561` green on both jobs.
- Post-merge branch audit: 35 origin refs, **unmerged = 0**.
- Reports: [`reports/UPT-PRE-ASSISTANT/IMPLEMENTATION_REPORT.md`](./reports/UPT-PRE-ASSISTANT/IMPLEMENTATION_REPORT.md),
  [`reports/UPT-PRE-ASSISTANT/VERIFICATION_REPORT.md`](./reports/UPT-PRE-ASSISTANT/VERIFICATION_REPORT.md).

Four non-blocking items are carried forward from that closeout and are **not** claimed as fixed
(verification report §3): Android Action drill-down does not open on the device; `start-city.ps1
-NoRooms` reports a misleading degraded reason; the idempotency-key reuse refusal is HTTP 400
rather than 409; and the Web client is still handed the loopback `hubUrl`.

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
