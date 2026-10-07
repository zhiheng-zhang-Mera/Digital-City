# Review verdict — four-series integrated acceptance, 2026-10-07

[Canonical Chinese verdict](../REVIEW_REPORT.md) · [Full round record](README.md)

```text
reviewed head          185d043e11ae8516a1e7a492d09d031610be576b
branch                 4-in-1-REX+PCF+CHK+DGX (zhiheng-zhang-Mera/utopia)
verdict                ACCEPTED — integrated for the pack, NOT a per-workbook split review
host                   Mech (COMPUTERNAME MEGA-REP)
review head            185d043e11ae8516a1e7a492d09d031610be576b (= the development head; no second head is invented)
waiver                 Owner ruling 2026-10-07: the four series' development and acceptance are recorded complete and
                       the per-workbook split acceptance is waived by that authority
merge authority        false (PR #46 is MERGEABLE/CLEAN; the merge decision is the Owner's)
```

## Why this directory is also the `report_path` of 40 workbooks

PCF-702..728, CHK-101..401 plus CHK-990, and DGX-001..007 plus DGX-990 were closed on 2026-10-07 without an individual
`reports/<ID>/REVIEW_REPORT.md`, because this round's acceptance was never per-workbook. Their `report_path` therefore
points here - at acceptance records that genuinely exist - rather than at a dangling pointer or a directory invented after
the fact. The binding fields are each workbook's `integrated_acceptance_2026_10_07`, `unfixed_gaps_2026_10_07`,
`terminal_marker_statement_2026_10_07` and `owner_ruling_2026_10_07_four_series_closure`.

## Basis

Four exact-head CI runs, all bound to `185d043` and all `completed/success` (37613355839, 37613438305, 37613438289,
37613438369), with PR #46 `mergeable=MERGEABLE` and `mergeStateStatus=CLEAN`. Local re-runs: `node --test tests/*.test.mjs`
1969 tests / 1961 pass / 5 fail / 3 skipped, every failure attributable (3 design refusals from this host's resident City,
2 load-sensitive flakes that pass alone); `node city/test-all.mjs` 2013/2006/0/7; `verify-promotion-history` exit 0;
`pnpm check:docs` exit 0. Series surfaces: pcf 406/403/0/3 (all skips typed external prerequisites), dgx 52/52, rex801..807
158/158, CHK module 27/27. Cross-host: on the live City restarted at `185d043` both nodes were ONLINE/HEALTHY and a
canonical task strictly targeted at the Alien node ran there (`state=COMPLETED`, `progress=100`, result with `bytes=65` and
`sha256=248dbb67…`), with the local node exercised the same way; `/api/v0/join/nearby` bounded with `rows=0`,
`/api/v0/health` healthy, `/api/v0/pcf` COMPLETE, `/api/v0/governance` AVAILABLE. Eight defects (D1, D2, D3, D4, D5, D6,
D11, D12) were fixed at this head, each with a falsifiable guard.

## Explicitly not covered

The per-workbook independent review (waived by the Owner; no separate review of each of the 40 workbooks was performed).
REX-890, which has not started, so the programme terminal marker `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` is not
released. The two-host/two-worker physical halves named by PCF 702/703/709/710/711 (neither performed nor marked NOT_RUN),
PCF-719's missing androidTest instrumentation source set and PCF-718's non-existent `platform/linux/pcf-worker/` path. The
DGX `validateDomainGate`, which has no call site in the release path. REX-801's five unnamed contract fields and REX-807's
routeless `pause` control plus the campaign controls that bypass the ADVANCED_CONTROL confirmation path. And the merge
itself: `merge_authority` is false for every one of these workbooks.

**On the visibility of the waiver:** the checker prints `REVIEW_WAIVED_BY_RECORDED_AUTHORITY` only when
`review_complete: true` while `review_host` or `review_head_sha` is missing. These workbooks record both, so the line does
not appear; the waiver is preserved here, in the Chinese verdict and in each workbook's
`owner_ruling_2026_10_07_four_series_closure` field instead.
