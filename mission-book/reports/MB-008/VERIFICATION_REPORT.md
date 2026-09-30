# MB-008 — Computer Use Runtime — VERIFICATION REPORT

> Status: **IN PROGRESS — RECONCILED / READY_FOR_BOUNDED_CHAIN**
> Verification Host: `Mech`
> Migration Host: `Alien`
> Completion basis: `OWNER_ACCEPTED_COMPLETE`
> Repair step: `2`

## 0. Current checkpoint

```text
OWNER_GATE = MB-007 repair_status=COMPLETE
VALUE_VERDICT = ROUTE_B_CONTINUE
MIGRATION_HEAD = aa2a6a8faab779a020d75b93dba548ba3755ce30
POST_MB007_MAIN = d850d73a9c23dbd07f9a0c7483dd2f44272f273f
RECONCILED_HEAD = 77b774cf34df
RECONCILED_CI = 36655586918 PASS
VERIFICATION_COMPLETE = false
```

## 1. Value reassessment

Route B selected: current Utopia main still lacks the MB-008 safety/guard/recovery/postcondition semantics as an equivalent implementation, so skipping the Mission would be incorrect.

## 2. Integration-first reconciliation

The branch was 48 commits behind post-MB-007 main. Three shared-control-plane conflicts were resolved without weakening existing mechanisms:

- `services/capability-bridge/registry.mjs`: kept main's strict superset, including both exclusion filters and MB-009 declared/enumerated split.
- `city/CITY_IMPLEMENTATION_MANIFEST.json`: unioned complete stage-2/stage-3 documents by district id; current-main ownership wins collisions; relocated `11-entertainment` theme ownership is not duplicated.
- `city/tests/manifest.test.mjs`: regenerated census in manifest declaration order.

Reconciled branch head: `77b774cf34df`.

Hosted CI: `36655586918 PASS`.

## 3. Next required evidence

Before bounded runtime execution, append Verification-role evolution events for:

1. `OWNER_INTERVENTION` — cite `response-9-29.md#R7` and `response-9-30.md#R7`;
2. `ATTEMPT_STARTED` — target reconciled head `77b774c`;
3. independent `VERIFIER_FINDING`;
4. current `TEST_PASS`;
5. current `CI_RESULT PASS` — run `36655586918`.

Then execute the bounded Computer-Use chain required by the Mission.

## 4. Pending

- real bounded desktop/file/shell/UI action + postcondition;
- refusal/permission/error path;
- recovery/stabilization path;
- final CI;
- `VERIFICATION_COMPLETE/PASS`;
- owner-override finalization;
- episode;
- final branch CI;
- merge to Utopia main;
- merged-main CI;
- City closeout.
