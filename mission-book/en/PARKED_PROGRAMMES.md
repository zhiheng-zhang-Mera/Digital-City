# Parked Programmes — Design-series index

[中文原文](../PARKED_PROGRAMMES.md) · [Mission Book dashboard](../README.md)

> Navigation only. These series **do not enter primary task statistics and are not a claimable work pool**. (A parked series may still carry an `"active_pool": false` entry in `PROGRESS_MANIFEST.json`, only so the homepage and that programme's board report its parked state truthfully; such an entry is not part of the open-workbook list. Each exception is stated plainly in the notes below.)

| Series | Purpose | State |
|---|---|---|
| [PCF](../mission-group/personal-compute-fabric/README.md) | Enhanced personal heterogeneous compute fabric: 29 planning workbooks (23 core + 6 optional), supporting added subtasks and versioned complex extensions | PARKED |
| [DGX](../mission-group/deliberative-governance-expansion-migration/README.md) | Complex-request decomposition, isolated execution, structured convergence, conflict/arbitration governance | PARKED |
| [RIV](../mission-group/review-independence-v2/README.md) | Review Pool v2, multidimensional independence, fresh context, safe migration | PARKED |
| [URA](../mission-group/utopia-runtime-architecture/README.md) | Utopia Core / Service / App / Connector runtime layering and logical decoupling | PARKED |
| [CHK](../mission-group/city-self-health-check/README.md) | Periodic health checks, self-awareness/diagnosis, quarterly self-evolution candidate review | PARKED |
| [SHOW](../mission-group/showcase-material-extraction/README.md) | Utopia showcase material extraction and the two demos (SHOW-401); the Owner ruled it **permanently suspended** on 2026-10-07 and it is retained as a parked design | PARKED |
| [Suspend](../mission-group/suspend/README.md) | Conflicting designs/assumptions currently unsuitable for canonicalization but requiring preservation | PRESERVE_ONLY |

## Shared rules

- Directory existence does not activate a series.
- Do not reuse today's branch/head as a future baseline.
- On activation reread canonical truth and anchor with full SHA.
- Do not alter acceptance/review contracts midway through an in-flight task.
- Current rules prevail over conflicting designs.
- Entering the active pool requires explicit `PROGRESS_MANIFEST.json` modification and synchronized homepage; do not silently turn plans into tasks.

This index separates future designs from the main Mission Book construction surface while preventing their loss.

## PCF design revision2 — 2026-10-07

29 planned workbooks (23 core,6 optional),0 activated. Execution-only prerequisite slices from URA/DGX/FR now have one PCF owner; source and destination README panels record all seven transfers. No active task denominator or current claims change.

## SHOW permanent suspension — 2026-10-07

Owner ruling 2026-10-07 (workbook field `owner_ruling_2026_10_07_show_parked`): the Owner ruled that the SHOW programme is **permanently suspended** and is to be retained long-term as a parked design.

- State: SHOW-401 is `PARKED`, `status: NOT_STARTED`, `activation_state: PARKED_OWNER_NOT_ACTIVATED`, `execution_enabled: false`; no acceptance, review, correction, verification or completion is implied;
- The terminal marker `UTOPIA_SHOWCASE_PACKAGE_READY` is **NOT released**, not satisfied and not claimable;
- Every configured fact (`development_host`, `development_branch: showcase/SHOW-401-alien-capture`, the media roots, `dependencies`, `required_ancestor_shas`, the terminal marker) is preserved verbatim; the README, `reports/SHOW-401/` and the workbook are all still in place and the git branch `showcase/SHOW-401-alien-capture` is not retired;
- It stays in this index (discoverable) but is absent from the generated open-workbook list: its manifest entry keeps `"active_pool": false`, so it enters no claimable pool and no longer appears as a workbook with unfinished review. This is the `PROGRESS_MANIFEST.json` parked entry with `active_pool: false` (`key: show`), which differs from the general "not in the manifest" statement above; the difference is recorded here plainly.

SHOW remains discoverable here as a parked design. Parking releases nothing: no development, review or acceptance is claimed, and the Owner's permanent-suspension ruling is the only authority recorded for it.

Owner ruling: 2026-10-07 — SHOW is permanently suspended; parked for good, not deleted.
