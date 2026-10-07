# Four-series integrated acceptance — 2026-10-07

[Canonical Chinese record](../README.md) · [Review verdict](../REVIEW_REPORT.md) · [Mission Book](../../README.md)

```text
accepted head            185d043e11ae8516a1e7a492d09d031610be576b
branch                   4-in-1-REX+PCF+CHK+DGX   (repo zhiheng-zhang-Mera/utopia)
merge base               c0034329343bcdbf8daac5972d0bae1673d9c5a3 = origin/4-in-1-REX+PCF+CHK+DGX before this round
merge base / main        17271f04829877ee56668221afeda5fbd35f66e8 (origin/main db6b6f9 has the SAME TREE)
host                     Mech-DS (COMPUTERNAME MEGA-REP)
PR                       https://github.com/zhiheng-zhang-Mera/utopia/pull/46   MERGEABLE / CLEAN
merge authority          false - a MERGEABLE pack is not a merged one; the merge decision is the Owner's
```

This round closed four series at once: REX-801..807, PCF-700..728, CHK-101..990 and DGX-001..990 were developed to
completion and accepted on a single integrated head. **REX-890 has not started**, so the REX programme terminal marker is
**not released** (section 6).

## 1. Heads folded into the pack

```text
DGX series      e5a03dae02ca341d6d23565735e6cd6c3edc27d9   merged into main by a1bb0937defc29af686cb40f1a21340731d4d7a3
CHK series      9a646d6b894babd0fb316c0b4a0ba302bd7bca7d   merged into main by a1bb093
PCF series tip  6b6963210c103db2ab25b5bbf34bdbf09e63bf1a   PR #45, folded into the 4-in-1 pack this round
REX-801..807    158 tests pass with three-end / opposite-host evidence (section 4)
REX-890         not started: no heads, no report directory, no RESEARCH_MATERIAL_SYNTHESIS.md
```

`17271f04829877ee56668221afeda5fbd35f66e8` is the integration point of those upstream heads and is the value recorded in
each workbook's `required_ancestor_shas`; `development_baseline_sha` records the series head each series actually built
on. Both are named in `baseline_resolution_evidence` so the two are never confused.

## 2. Exact-head CI (read from the Actions API)

```text
push          V0.2 checks                     run 37613355839   gateway-web SUCCESS · android SUCCESS
pull_request  V0.2 checks                     run 37613438305   gateway-web SUCCESS · android SUCCESS
pull_request  City linkage check              run 37613438289   reciprocal-contract SUCCESS
pull_request  PCF Linux component candidate   run 37613438369   linux-components SUCCESS
```

All four runs are bound to `185d043`, all `completed/success`; PR #46 measured `mergeable=MERGEABLE` and
`mergeStateStatus=CLEAN`. No post-merge approximation is used as an exact head.

## 3. Local re-runs at 185d043 (Mech, COMPUTERNAME MEGA-REP)

```text
node --test tests/*.test.mjs                 1969 tests / 1961 pass / 5 fail / 3 skipped
  5 failures = tests/host-city-launcher.test.mjs x3 (this host's resident City holds the coordination port and the
  test refuses by design) + 2 load-sensitive web flakes (theme-packages store guard, rex803-campaign-web), each
  passing when run alone
node city/test-all.mjs                       2013 tests / 2006 pass / 0 fail / 7 skipped
node scripts/verify-promotion-history.mjs    exit 0
pnpm check:docs                              exit 0
```

Series surfaces: `tests/pcf*.test.mjs` 406/403/0/3 (every skip is a typed external prerequisite), `tests/dgx-*.test.mjs`
52/52, `tests/rex801..807` 158/158 when each task's files are run together (3 of them time out under full parallel load
and pass alone), and the CHK module 27/27.

## 4. Cross-host evidence

On the live City restarted at `185d043` (`D:\utopia-rex-pcf-merge`, pid 44920, 172.31.12.151:4310) both nodes were
ONLINE/HEALTHY (Mega-rep `dev-544adda130594c6fae7d71ddfd0f3b8c`, Alien `dev-1428bce5297146df88720f270af71bc3`, hostname
Mera-Alianware) with `nodeDescriptor` contractVersion=1 and roles=[EXECUTION_NODE]. A canonical task strictly targeted at
the Alien node really ran there: `state=COMPLETED`, `progress=100`, `assignedNodeId=dev-1428bce5…`,
`result={bytes:65, sha256:248dbb6778be39e9de1460909c35dd4628944852c89f6d6dda4fa97f8fe3f001, cleaned:true}`; the local node
was exercised the same way. `/api/v0/join/nearby` answered `bounded=true discovered=1 excludedSelf=1 rows=0`,
`GET /api/v0/health` = healthy, `/api/v0/pcf` completeness=COMPLETE, `/api/v0/governance` = AVAILABLE.

## 5. Defects found and fixed at 185d043 (each with a falsifiable guard)

D1 an open LAN discovery scan could kill the City (`services/dev-gateway/server.mjs` read `.port` off a null
`server.address()` after close); D2 the ENGINEERING review independence floor was selected by the caller's spelling of the
role, so a same-host reviewer could be reached by renaming the role
(`contracts/deliberative-governance-v2/assignment.mjs`); D3 CHK's sensitive-path filter missed `id_rsa`/`.npmrc` etc., so
declared credential paths were read and hashed into `source-manifest.json`; D4 redaction missed AWS/GCP/Slack/Stripe/PEM
shapes; D5 unreferenced sensitive paths were dropped silently while `static_scan_complete` stayed true; D6 a
deliberately-unread path was also reported as `DEAD_CAPABILITY_RECORD`; D11 `apps/web/research.js` never called
`assertPrimarySurfacesClean`, so the primary-surface guard was vacuous; D12 only 2 of 5 DIRECT_CONTROL entries carried
`wired`/`wiredAt`.

## 6. Measured-but-unfixed gaps (not claimed closed)

REX-801's frozen manifest contract lacks the five fields its workbook names (`metrics`, `research_signal_ids`,
`research_grade_snapshot`, `control_plane_rule_version`, `authority_surfaces_if_applicable`); REX-807 has a `pause`
control in `RESEARCH_CONTROL_SURFACE.md` with no route, and the campaign page's seed/warmup/abandon controls bypass the
ADVANCED_CONTROL confirmation path; PCF 702/703/709/710/711 name a two-host/two-worker physical half that is neither
performed nor marked NOT_RUN, PCF-719 has no androidTest instrumentation source set and PCF-718's named
`platform/linux/pcf-worker/` path does not exist; DGX's `validateDomainGate` has no production caller, so the release gate
trusts a host port and fails closed without it; **REX-890 has not started** (no heads, no report directory, no
`RESEARCH_MATERIAL_SYNTHESIS.md`) and the programme terminal marker
`RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` is **not released**.

## 7. Series accounting, and the waiver

PCF, CHK and DGX moved into `finished/completed-2026-10-07/` with `active_pool: false`; archiving activates no task and
grants no claim or merge authority. **REX stays in `mission-group/` with `active_pool: true`** because REX-890 is a
genuinely open workbook, and moving it would drop it out of the generated open-workbook list - that would hide work
rather than close it. Merge authority is false for all four series.

**On the visibility of the Owner waiver, stated plainly:** every workbook carries
`owner_ruling_2026_10_07_four_series_closure`, recording that the Owner instructed this round that the four series'
development and acceptance be marked complete and that the per-workbook split acceptance is waived by that authority. The
consistency checker prints `REVIEW_WAIVED_BY_RECORDED_AUTHORITY` only when `review_complete: true` while `review_host` or
`review_head_sha` is missing; these 40 workbooks record both, because for them the review host, review head and CI are the
development host, development head and the same CI. So that line does not appear - not to hide the waiver, but because the
fields are genuinely set. The waiver itself is preserved here, in the Chinese record's section 7 and in every workbook's
field, so any reader can see that no per-workbook split review took place.

## 8. Non-claims

No per-workbook independent review is claimed (the split acceptance was waived by the Owner; this is an integrated record).
REX-890 is not started and its programme freeze marker is not released. The PCF physical halves, the real Linux worker, the
phone worker and the real Codex/DeepSeek loop are not claimed complete. A production release run is not claimed to have
executed `validateDomainGate`. The pack is not claimed merged. The local full suite is not claimed all-green: 5 of 1969
fail, 3 by design on this host and 2 as load-sensitive flakes, recorded red-then-green rather than as passes. No branch name
is used as evidence: every acceptance fact is bound to a 40-character SHA and a run id.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **2**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|

### 本目录说明 / Local documents

- [REVIEW_REPORT.md](REVIEW_REPORT.md)

<!-- DOCUMENT_NAVIGATION:END -->
