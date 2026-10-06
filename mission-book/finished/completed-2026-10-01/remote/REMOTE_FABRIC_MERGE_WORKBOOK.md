# Remote Fabric — Programme Merge Workbook

```text
MERGE_WORKBOOK            = REMOTE_FABRIC_MERGE_WORKBOOK
PROGRAMME                 = REMOTE_FABRIC_ENGINEERING (RF-001..RF-010)
MERGE_HOST                = Mech
CREATED_AT                = 2026-10-01T07:01:00Z
COMPLETED_AT              = 2026-10-01T07:07:00Z
SOURCE_MAIN_SHA           = 41e241c3c817124c9c3d6e7756087d1022a836aa   (then-current main: BA union already merged)
INTEGRATION_BRANCH        = merge/remote-fabric-integration
INTEGRATION_HEAD          = 160fcc345775f9f3fbb5b640195cbe299cfb9d61
INTEGRATION_CI            = 36828179156 — success
MAIN_MERGE_COMMIT         = 49914d906ce6731272d301ed4bee4cca05ff2b86
MAIN_CI_AFTER_MERGE       = 36828413515 — success
ARCHIVE_TAGS              = archive/RF-001 .. archive/RF-010 (10 annotated tags)
REMOTE_BRANCHES_DELETED   = 10 (remote/RF-001..RF-010)
LOCAL_CHECK_SUMMARY       = repo 419/419 · rooms 69/69 · city 1932 pass/0 fail · promotion-history OK · docs SYNCHRONIZED
TERMINAL_MARKER           = REMOTE_FABRIC_MERGED_MAIN_CI_GREEN
STATUS                    = COMPLETE
```

## 1. Preconditions and §4.2 reconciliation

All ten RF tasks recorded `development_complete = true`, `correction_complete = true` and a pushed corrected
head with hosted CI green; the two-host gate is satisfied (RF-001/RF-002: development Alien / correction Mech;
RF-003..RF-010: development Mech / correction Alien). The §4.2 reconciliation pass (see §1 of the Butler
workbook for the shared telemetry) bound every recorded branch to its live head and both CI runs with zero
stale tasks and zero evidence-pointer mismatches before this workbook was created.

## 2. Branch inventory and merge evidence

| Task | Source branch | Corrected head | Archive tag |
|---|---|---|---|
| RF-001 | `remote/RF-001-node-identity-installation-lifecycle` | `0f4c75b` | `archive/RF-001` |
| RF-002 | `remote/RF-002-unified-pairing-trust-lifecycle` | `be86135` | `archive/RF-002` |
| RF-003 | `remote/RF-003-local-discovery-lan-direct` | `4a51996` | `archive/RF-003` |
| RF-004 | `remote/RF-004-bluetooth-bootstrap-ip-handoff` | `1bd7b13` | `archive/RF-004` |
| RF-005 | `remote/RF-005-remote-invite-rendezvous` | `d4fb944` | `archive/RF-005` |
| RF-006 | `remote/RF-006-secure-transport-path-manager` | `8fbd71d` | `archive/RF-006` |
| RF-007 | `remote/RF-007-versioned-capability-registry` | `8cfd96f` | `archive/RF-007` |
| RF-008 | `remote/RF-008-typed-rpc-event-stream-commands` | `4d974da` | `archive/RF-008` |
| RF-009 | `remote/RF-009-presence-offline-reconnect-audit` | `aaca94a` | `archive/RF-009` |
| RF-010 | `remote/RF-010-fabric-policy-public-api` | `4d7b931` | `archive/RF-010` |

## 3. Conflict resolution (RF-001 × RF-002)

RF-001 and RF-002 both declare the same City building (`00-foundation/02-city-node-network`) and therefore
conflicted on five files. Every conflict was resolved as an **explicit union**, never by dropping one side:

| File | Resolution |
|---|---|
| `city/CITY_IMPLEMENTATION_MANIFEST.json` | Both module entries kept as sibling objects inside `02-city-node-network/modules`: `device-identity` (RF-001) **and** `pairing-trust` (RF-002). The file was re-parsed as JSON after resolution to prove it is valid and carries both modules. |
| `city/tests/manifest.test.mjs` | Both expected building paths listed, so the deliberate-update property covers both modules. |
| `tests/capability-registry.test.mjs` | RF-002's comment kept; it already names both RF-001's and RF-002's copy of the building, so it is the superset description. |
| `city/docs/en/ARCHITECTURE.md` | RF-001's section kept as **§9**, RF-002's section renumbered to **§10**, both bodies retained. RF-001's closing sentence (whose completion line was shared with RF-002's section after the marker) was restored so neither section ends mid-sentence. |
| `city/docs/zh-CN/ARCHITECTURE.md` | Same treatment, keeping the en/zh section numbering in parity (the bilingual checker reports SYNCHRONIZED). |

Decision recorded: a whole-section replacement would have silently deleted one programme-task's architecture
documentation, which is exactly the "union/superset" property §7.2 requires, so the resolution renumbers rather
than discards.

## 4. Verification

```text
integration_head      = 160fcc345775f9f3fbb5b640195cbe299cfb9d61   CI 36828179156 success
main_merge_commit     = 49914d906ce6731272d301ed4bee4cca05ff2b86   CI 36828413515 success
local checks          = repo 419/419 · rooms 69/69 · city 1932 pass/0 fail · docs SYNCHRONIZED
pre-merge main refresh = origin/main 41e241c was verified to be an ancestor of the integration head
traceability          = every RF corrected head is an ancestor of origin/main and tagged archive/RF-0XX
remote_branches       = remote/* : 0 remaining
```

## 5. Deferred seams

The Remote Fabric programme's own reports defer real cross-device E2E proof to programme integration; that
deferral is unchanged and is not closed by merging. The GAI and EM final cross-device seams may consume this
accepted RF code once their own integration stages run.

## Report errata / point-in-time records

The Development and Correction reports under `../reports/RF-*/` still carry the `MERGE_STATUS =
FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE` line they recorded when they were written. That line was true at that time
and is deliberately left unedited as contemporaneous evidence; current merge truth lives in the task workbook
frontmatter (`merge_status`, `merge_archive_tag`, `merge_main_sha`, `merge_main_ci`) and in this workbook.

```text
MERGE_STATUS = COMPLETE
REMOTE_FABRIC_MERGED_MAIN_CI_GREEN
```

语言配对 / Language pair: [English](./REMOTE_FABRIC_MERGE_WORKBOOK.md) · [中文](./zh-CN/REMOTE_FABRIC_MERGE_WORKBOOK.md)
