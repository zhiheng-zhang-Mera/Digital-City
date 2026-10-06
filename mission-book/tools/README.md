# Mission Book tooling / 任务书工具

Four small, dependency-free Python tools. They only ever edit `mission-book/` inside the control repository, and every one
of them is a reader of the workbooks' YAML frontmatter, which stays the source of truth.

```text
sync_dependency_state.py           propagate accepted exact dependency heads into unclaimed workbooks; --check fails on drift
sync_mission_progress.py           regenerate the main board (README.md) and MISSION_PROGRESS.json; --check fails on drift
sync_utopia_status.py              refresh the live Utopia status block in the linkage record
check_record_consistency.py        report record drift across the three record locations; exit 1 when an ERROR is found
test_check_record_consistency.py   tests for the checker, including the drift it must catch
```

Run them from the repository root (`dc/`):

```bash
python mission-book/tools/sync_dependency_state.py --check
python mission-book/tools/sync_mission_progress.py
python mission-book/tools/check_record_consistency.py
python mission-book/tools/test_check_record_consistency.py
```

## What the consistency checker is for

The Mission Book records the same state three times: the main board, each programme board, and each workbook's own
frontmatter plus its `reports/<ID>/` directory. A round of work is only as trustworthy as the agreement between them.
Nothing checked that agreement until this tool; both defects that motivated it were found by hand on 2026-10-06:

- a workbook that had been **claimed and developed to completion still carried `status: READY`** (the claim updated the
  ownership fields and not the status word);
- a workbook whose CI field claimed that **both** the push and the pull-request runs were green at its head, when a
  per-run read of the Actions API showed the push run had failed.

The checker caught the first class mechanically from then on. It reports typed codes, never fixes anything, and never
touches the network.

## Scope rules, and why they exist

A checker full of false positives is ignored, so three scoping rules are deliberate:

1. **Two workbook generations.** A record declaring `baseline_policy`/`baseline_anchor_mode` is the current programme
   schema and is checked fully. An older record (`mission_id`, `project_baseline_sha`, `development_status`, mostly under
   `finished/completed-2026-10-01/`) is checked on its own terms and then left alone.
2. **A workbook is held to the fields it declares.** A record written before a field existed is not judged by it. A
   missing `terminal_marker` is an error only in a workbook that declares one.
3. **History is a warning, drift is an error.** A short SHA or a `reports/<ID>/` directory that does not exist in a
   record filed under `finished/` - or whose status word says the work reached a terminal point - is history. The same
   finding in a record whose status is still in flight is an error, and exits non-zero.

A rule can be excused per workbook by declaring `record_exceptions: [CODE, ...]`; the finding is then printed as
`EXCUSED` rather than hidden. **Owner-waived closures** are excused by authority, not by silence: a workbook that records
`review_waiver_authority` (or any `owner_ruling*` field) may carry `review_complete: true` without a `review_host`, and
the checker prints `REVIEW_WAIVED_BY_RECORDED_AUTHORITY` naming the field, so a reader can always see that no independent
review happened.

## Pitfalls this tooling now normalises (learned the hard way)

- **A boolean in quotes is still a boolean.** `CEX-790` and `WBC-604` carried `review_complete: "true"`. The parsers
  returned the string, so every `is True` check downstream - including acceptance propagation in
  `sync_dependency_state.py` - treated an accepted task as unreviewed. All three parsers now unquote first and classify
  the content, and the checker reports `QUOTED_BOOLEAN_FIELD` so the spelling is still corrected at the source.
- **Non-ASCII files and PowerShell 5.1.** `Get-Content`/`Set-Content` round trips on this host (Windows PowerShell 5.1
  with a non-UTF-8 console code page) corrupted a Chinese locale pack during the MON-902 merge. Mission Book and
  implementation text is edited with a UTF-8-aware tool, or by writing the whole file.
- **A quoted string is fine.** `development_ci` is a sentence; only the boolean/null spellings are reported.

## What the checker does NOT do

It cannot tell whether a CI or review claim is **true** - only whether the record is internally consistent and whether
the head it cites has the shape of an exact identity. Verifying that a claimed run really succeeded at that head means
re-reading the Actions API per run, which is the reviewer's job (and how the over-claimed CI field above was found).
A record can be perfectly consistent and still wrong; the reviewer's independent re-measurement is what catches that.
