# Butler Assistant — Programme Merge Workbook

```text
MERGE_WORKBOOK            = BUTLER_ASSISTANT_MERGE_WORKBOOK
PROGRAMME                 = BUTLER_ASSISTANT_ENGINEERING (BA-001..BA-009)
MERGE_HOST                = Mech
CREATED_AT                = 2026-10-01T06:47:00Z
COMPLETED_AT              = 2026-10-01T07:00:00Z
SOURCE_MAIN_SHA           = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
INTEGRATION_BRANCH        = merge/butler-assistant-integration
INTEGRATION_HEAD          = 4ff27babf52410b36a53ea32785d27e19303b7d8
INTEGRATION_CI            = 36827219769 — success
MAIN_MERGE_COMMIT         = 41e241c3c817124c9c3d6e7756087d1022a836aa
MAIN_CI_AFTER_MERGE       = 36827422797 — success
ARCHIVE_TAGS              = archive/BA-001 .. archive/BA-009 (9 annotated tags)
REMOTE_BRANCHES_DELETED   = 9 (assistant/BA-001..BA-009)
LOCAL_CHECK_SUMMARY       = repo 288/288 · rooms 69/69 · city 1807 pass/0 fail · promotion-history OK · docs SYNCHRONIZED
TERMINAL_MARKER           = BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN
STATUS                    = COMPLETE
```

## 1. Preconditions and §4.2 reconciliation

All nine BA tasks recorded `development_complete = true`, `correction_complete = true`, opposite hosts
(development Mech / correction Alien) and both CI runs green on the recorded heads. The mandatory §4.2
reconciliation ran **before** this workbook was created:

```text
reconciliation_started_at        = 2026-10-01T06:45:23Z
external_recovery_source         = GITHUB_ACTIONS (block recovered; GITHUB_ACTIONS_EXTERNAL_BLOCK=RECOVERED)
task_count                       = 41 (all four programmes; 9 BA)
stale_task_count                 = 0
stale_blocker_count              = 0
evidence_pointer_mismatch_count  = 0
repaired_task_ids                = []
reconciliation_completed_at      = 2026-10-01T06:45:23Z
```

Binding verified per task: recorded branch == live remote head, and the recorded Development and Correction
run ids resolve to exactly those heads with `conclusion = success`.

One control-plane defect was found and repaired during reconciliation: `EM-007`'s workbook carried a UTF-8
BOM, so BOM-naive readers skipped it and the pool scan reported 40/41. The readers were made BOM-tolerant and
the BOM stripped from that file (metadata only; no product code touched).

## 2. Branch inventory and merge evidence

| Task | Source branch | Corrected head | Archive tag |
|---|---|---|---|
| BA-001 | `assistant/BA-001-butler-zone-personalization` | `8c7e1dc` | `archive/BA-001` |
| BA-002 | `assistant/BA-002-shared-brain-runtime` | `e9add9d` | `archive/BA-002` |
| BA-003 | `assistant/BA-003-device-embodiment-binding` | `4bfd256` | `archive/BA-003` |
| BA-004 | `assistant/BA-004-multi-assistant-handoff` | `b5c6249` | `archive/BA-004` |
| BA-005 | `assistant/BA-005-digital-me-context-gateway` | `6c6d2d4` | `archive/BA-005` |
| BA-006 | `assistant/BA-006-shared-task-coordination` | `bf6c648` | `archive/BA-006` |
| BA-007 | `assistant/BA-007-settings-interaction-surface` | `f8f15af` | `archive/BA-007` |
| BA-008 | `assistant/BA-008-embodiment-event-bus` | `1070190` | `archive/BA-008` |
| BA-009 | `assistant/BA-009-duty-permission-policy` | `2abf8d4` | `archive/BA-009` |

All nine branches are purely additive (`contracts/<package>/**` + their own `tests/<name>.test.mjs`), so the
integration was a clean union with **no conflicts**.

## 3. Decisions

**D1 — Merge order across programmes.** BA → RF → GAI → EM. The contract records that BA and RF have no hard
terminal dependency on GAI/EM and that each merge workbook starts from then-current main and preserves other
programmes' merged work; no programme's component files overlap another's, so pool order is used.

**D2 — Merge shape.** Every corrected branch is merged with `--no-ff`, so its commits stay reachable from main
and the history is traceable through main itself. No branch is rebased, squashed or fast-forwarded.

**D3 — Pre-merge ref verification.** Each `origin/<branch>` ref was re-verified against the reconciled head
immediately before merging; the driver aborts on any mismatch, so a stale head cannot be integrated silently.

**D4 — Verification scope.** The full repository suite plus rooms, city, promotion-history and bilingual docs
run on the integration branch (the union), not per branch.

**D5 — Main drift during the merge window.** `origin/main` advanced from `82ed369` to `d914c06` while the BA
integration was being prepared (evidence artefacts only). The first final-merge attempt was therefore
discarded, main was re-fetched, and the integration branch was refreshed by merging the then-current main
into it (§7.6); all required checks and CI then ran again on the refreshed head `4ff27ba` (§7.7) before the
final merge.

**D6 — Archive shape.** After the final merge and a green main CI, each branch head was tagged
`archive/<TASK-ID>` (annotated, recording the head, both CI runs and both hosts) and the remote branch was
deleted. Deleting the branch therefore never deletes history: the commits are reachable from main through the
merge commits, and the tags name the exact corrected heads.

## 4. Verification

```text
integration_head      = 4ff27babf52410b36a53ea32785d27e19303b7d8   CI 36827219769 success
main_merge_commit     = 41e241c3c817124c9c3d6e7756087d1022a836aa   CI 36827422797 success
local checks          = repo 288/288 · rooms 69/69 · city 1807 pass/0 fail · docs SYNCHRONIZED
traceability          = every BA corrected head is an ancestor of origin/main and is tagged archive/BA-00X
remote_branches       = assistant/* : 0 remaining
```

## 5. Deferred seams

Real external seams recorded by individual BA reports remain deferred exactly as those reports state; merging
does not close them. The two-host gate evidence lives in each task workbook.

## Report errata / point-in-time records

The Development and Correction reports under `../reports/BA-*/` still carry the `MERGE_STATUS =
FORBIDDEN_UNTIL_*_PROJECT_MERGE` line they recorded when they were written. That line was true at that time and is
deliberately left unedited as contemporaneous evidence; current merge truth lives in the task workbook frontmatter
(`merge_status`, `merge_archive_tag`, `merge_main_sha`, `merge_main_ci`) and in this workbook.

```text
MERGE_STATUS = COMPLETE
BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN
```

语言配对 / Language pair: [English](./BUTLER_ASSISTANT_MERGE_WORKBOOK.md) · [中文](./zh-CN/BUTLER_ASSISTANT_MERGE_WORKBOOK.md)
