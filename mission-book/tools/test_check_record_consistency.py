#!/usr/bin/env python3
"""Tests for the record-consistency checker, including the positive controls.

A checker nobody has seen fail is a checker nobody can trust. These cases run the checker's own rule function against
synthetic frontmatter, so every rule is exercised in both directions: the drift it must catch, and the clean record it
must leave alone. They also pin the two real defects that motivated the tool (the claimed-but-READY record, and the
quoted boolean that silently disables acceptance propagation).

    python mission-book/tools/test_check_record_consistency.py     # exits non-zero on any failure
"""
from __future__ import annotations

import importlib.util
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve()
SPEC = importlib.util.spec_from_file_location("crc", HERE.parent / "check_record_consistency.py")
CHECKER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(CHECKER)

CURRENT = CHECKER.ROOT / "mission-book" / "example-programme" / "XX-001-example.md"
FINISHED = CHECKER.ROOT / "mission-book" / "finished" / "completed-2026-01-01" / "old-programme" / "XX-002-old.md"
CLEAN_HEAD = "a" * 40
CLEAN_CI = "V0.2 checks run 1 COMPLETED SUCCESS on " + CLEAN_HEAD

failures: list[str] = []


def run(name: str, data: dict, path: pathlib.Path = CURRENT, records: dict | None = None, text: str = "") -> list[dict]:
    findings = CHECKER.check_one(data.get("workbook_id", "XX-001"), path, data, records or {}, text)
    return findings


def codes(findings: list[dict], severity: str | None = None) -> list[str]:
    return sorted(item["code"] for item in findings if severity is None or item["severity"] == severity)


def expect(name: str, condition: bool, detail: str) -> None:
    print(("PASS  " if condition else "FAIL  ") + name + ("" if condition else f"  <- {detail}"))
    if not condition:
        failures.append(name)


def base(**overrides) -> dict:
    data = {
        "workbook_id": "XX-001",
        "phase": "EXAMPLE",
        "status": "IN_PROGRESS",
        "baseline_policy": "IMMUTABLE_EXACT_SHA",
        "development_baseline_sha": CLEAN_HEAD,
        "baseline_resolution_evidence": "mission-book/reports/XX-001/CLAIM_RECORD.md",
        "development_host": "Mech",
        "development_branch": "x/XX-001",
        "development_head_sha": CLEAN_HEAD,
        "development_ci": CLEAN_CI,
        "development_complete": True,
        "review_host": None,
        "review_head_sha": None,
        "review_complete": False,
        "terminal_marker": "EXAMPLE_ACCEPTED",
        "merge_authority": False,
        "report_path": "mission-book/reports",
    }
    data.update(overrides)
    return data


# 1. The defect that motivated the tool: a claimed, development-complete workbook still saying READY.
findings = run("claimed but READY", base(status="READY"))
expect("READY + claimed is an error", "STATUS_READY_BUT_CLAIMED" in codes(findings, "ERROR"), str(findings))

# 2. The reverse: an active status with no owner at all.
findings = run("active but unclaimed", base(status="IN_PROGRESS", development_host=None, development_branch=None, development_baseline_sha=None))
expect("IN_PROGRESS + unclaimed is an error", "STATUS_ACTIVE_BUT_UNCLAIMED" in codes(findings, "ERROR"), str(findings))

# 3. A clean current-schema record produces NO error. (It may warn about the example report directory.)
findings = run("clean record", base())
expect("a clean record has no errors", codes(findings, "ERROR") == [], str(findings))

# 4. COMPLETE without a review is drift, not a style choice.
findings = run("complete without review", base(status="COMPLETE"))
expect("COMPLETE without review is an error", "COMPLETE_WITHOUT_REVIEW" in codes(findings, "ERROR"), str(findings))

# 5. review_complete with no host and no recorded authority is drift...
findings = run("review without host", base(review_complete=True))
expect("review without host is an error", "REVIEW_COMPLETE_WITHOUT_HOST" in codes(findings, "ERROR"), str(findings))

# 6. ...but a recorded owner waiver excuses it BY NAME, and the finding still appears.
findings = run("review waived by owner ruling", base(review_complete=True, owner_ruling_2026_10_05="OWNER RULING: waive the opposite-host review"))
expect("a recorded owner waiver excuses the review host rule", "REVIEW_WAIVED_BY_RECORDED_AUTHORITY" in codes(findings, "EXCUSED"), str(findings))
expect("a waived review raises no error", codes(findings, "ERROR") == [], str(findings))

# 7. The quoted-boolean bug: `review_complete: "true"` used to be read as the string and skipped by the sync tool.
quoted = CHECKER.parse_value('"true"')
expect('a quoted boolean parses as a boolean, not a string', quoted is True, repr(quoted))
expect("a quoted false parses as False", CHECKER.parse_value("'false'") is False, repr(CHECKER.parse_value("'false'")))
expect("a quoted string stays a string", CHECKER.parse_value('"Mech"') == "Mech", repr(CHECKER.parse_value('"Mech"')))
quoted_keys = CHECKER.quoted_fields('---\nreview_complete: "true"\ndevelopment_ci: "a sentence"\nstatus: READY\n---\n')
expect("only the quoted boolean is reported, not the quoted sentence", quoted_keys == ["review_complete"], str(quoted_keys))

# 8. A dependency that has not been accepted must not leave a workbook READY.
incomplete = {"XX-002": (FINISHED, {"workbook_id": "XX-002", "status": "IN_PROGRESS"}, "")}
findings = run("ready with an unaccepted dependency", base(status="READY", dependency_source_workbooks=["XX-002"]), records=incomplete)
expect("READY with an unaccepted dependency is an error", "READY_WITH_UNACCEPTED_DEPENDENCY" in codes(findings, "ERROR"), str(findings))

# 9. Severity follows the record's own state: a short SHA in an archived record warns, in an active record it errors.
short = base(development_head_sha="abc1234")
expect("a short head in an ACTIVE record is an error", "DEV_COMPLETE_WITHOUT_HEAD" in codes(run("short head active", short), "ERROR"), "expected ERROR")
finished_short = dict(short, status="REVIEW_COMPLETE")
expect("a short head in a TERMINAL record is a warning", "DEV_COMPLETE_WITHOUT_HEAD" in codes(run("short head terminal", finished_short, path=FINISHED), "WARN"), "expected WARN")

# 10. An older-generation record (no baseline_policy) is checked on its own terms only.
legacy = {"mission_id": "BA-001", "development_status": "COMPLETE", "development_complete": True, "development_host": "Mech"}
expect("a legacy record raises no modern finding", codes(run("legacy record", legacy)) == [], str(run("legacy record", legacy)))
legacy_bad = {"mission_id": "BA-001", "development_status": "ACTIVE", "development_complete": True}
expect("a legacy record with a disagreeing status warns", "LEGACY_STATUS_DISAGREES" in codes(run("legacy disagree", legacy_bad), "WARN"), "expected WARN")

print()
if failures:
    print(f"{len(failures)} check(s) FAILED: {', '.join(failures)}")
    raise SystemExit(1)
print("all record-consistency checks passed")
