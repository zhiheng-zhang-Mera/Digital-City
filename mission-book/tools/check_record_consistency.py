#!/usr/bin/env python3
"""Check Mission Book workbooks for record drift across the three record locations.

WHY THIS EXISTS. The Mission Book is the control plane: the main board, each programme board and each workbook's own
frontmatter are three records of the same state, and they are only useful if they agree. Nothing in the toolchain checked
that they do. On 2026-10-06 a claimed, development-complete workbook (MON-903) was found still carrying
`status: READY` because the claim updated the ownership fields and not the status, and a workbook (MON-902) was found
claiming "both CI runs green at this head" when a per-run read of the Actions API showed the push run had FAILED. Both
were found by hand. This tool turns that class of defect into a check.

WHAT IT IS. A pure reader: it never writes, never fixes, never talks to the network. Every finding is a typed code plus
the field that carries it, so a human (or the next round) can act on it. Where a rule has a deliberate exception, the
exception is named in the workbook (see `record_exceptions`) rather than hard-coded here.

USAGE
    python mission-book/tools/check_record_consistency.py            # check every workbook
    python mission-book/tools/check_record_consistency.py --quiet    # only findings
    python mission-book/tools/check_record_consistency.py --json     # machine-readable

EXIT STATUS
    0 when there are no ERROR findings (WARN is reported but does not fail the run)
    1 when at least one ERROR finding exists
    2 when the tool itself could not read the Mission Book
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parents[2]
MISSION = ROOT / "mission-book"
SHA_RE = re.compile(r"^[0-9a-f]{40}$")

# Fields whose presence means "this workbook has been claimed".
OWNERSHIP_FIELDS = ("development_host", "development_branch", "development_baseline_sha")

# The Mission Book holds two generations of workbook. The current programme schema declares `baseline_policy` (with
# `IMmUTABLE_EXACT_SHA`, `DEPENDENCY_SHA_UNION_AT_CLAIM`, …); the earlier cross-programme generation used `mission_id`,
# `project_baseline_sha`, `development_status` and lived under `finished/`. The modern checks below are about the current
# schema, so an older record is SKIPPED BY NAME rather than reported as drift: calling a 2026-09-30 record "unclaimed"
# because it does not carry a field that did not exist yet would be a false positive, and a checker nobody trusts is
# worse than no checker. Its own generation gets one small consistency check instead.
MODERN_MARKERS = ("baseline_policy", "baseline_anchor_mode")
LEGACY_STATUS_FIELD = "development_status"

# Status words that mean "this record describes work that has reached a terminal point". The Mission Book has used
# several over its life (`COMPLETE`, `REVIEW_COMPLETE`, `FINAL_PRODUCT_ACCEPTED`,
# `REVISION_REVIEW_COMPLETE_PASS_WITH_REPAIRS`, …). A missing report directory or a 7-character SHA in such a record is
# history - the convention arrived later - so those findings are warnings; the same finding in a record whose status is
# still in flight is an error. Reading the workbook's OWN status word keeps the rule self-describing instead of
# hard-coding a programme list here.
TERMINAL_STATUS_TOKENS = ("COMPLETE", "ACCEPTED", "MERGED", "CLOSED", "DELIVERED", "ARCHIVED")


def parse_value(raw: str) -> Any:
    value = raw.strip()
    # A BOOLEAN IN QUOTES IS STILL A BOOLEAN. Two workbooks (CEX-790, WBC-604) carried `review_complete: "true"`, which
    # the previous parsers returned as the STRING "true" - so the acceptance propagation in sync_dependency_state.py
    # skipped their heads entirely. The same normalisation is applied in both sync tools; the `QUOTED_BOOLEAN_FIELD`
    # finding below keeps the spelling visible, because quoting is legal YAML and the next author may reach for it again.
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        unquoted = value[1:-1].strip()
        lowered = unquoted.lower()
        if lowered == "true":
            return True
        if lowered == "false":
            return False
        if lowered in {"null", "none", "~", ""}:
            return None
        return unquoted
    if value.lower() == "true":
        return True
    if value.lower() == "false":
        return False
    if value.lower() in {"null", "none", "~", ""}:
        return None
    if value.startswith("[") or value.startswith("{"):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value


def quoted_fields(text: str) -> list[str]:
    """Frontmatter keys whose value is a QUOTED BOOLEAN OR NULL - i.e. a spelling the toolchain has to normalise.

    Quoting a string is normal and correct (`development_ci` is a sentence), so only the boolean/null spellings are
    reported; the first version of this rule flagged every quoted scalar and produced 528 findings, which is the same
    as producing none.
    """
    if not text.startswith("---"):
        return []
    end = text.find("\n---", 3)
    if end < 0:
        return []
    out: list[str] = []
    for line in text[3:end].splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or ":" not in stripped:
            continue
        key, raw = stripped.split(":", 1)
        raw = raw.strip()
        if len(raw) >= 2 and raw[0] == raw[-1] and raw[0] in {'"', "'"} and raw[1:-1].strip().lower() in {"true", "false", "null", "none", "~"}:
            out.append(key.strip())
    return out


def frontmatter(text: str) -> dict[str, Any]:
    """The flat frontmatter the other Mission Book tools use, with the same tolerant parser."""
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end < 0:
        return {}
    out: dict[str, Any] = {}
    for line in text[3:end].splitlines():
        if line and not line[:1].isspace() and ":" in line:
            key, raw = line.split(":", 1)
            out[key.strip()] = parse_value(raw)
    return out


def is_sha(value: Any) -> bool:
    return isinstance(value, str) and bool(SHA_RE.fullmatch(value))


def is_set(value: Any) -> bool:
    return value is not None and value != "" and value != []


def load() -> tuple[dict[str, tuple[pathlib.Path, dict[str, Any], str]], list[str]]:
    """Every workbook with frontmatter, keyed by id, together with its text (read once)."""
    records: dict[str, tuple[pathlib.Path, dict[str, Any], str]] = {}
    unreadable: list[str] = []
    for path in sorted(MISSION.rglob("*.md")):
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            unreadable.append(str(path.relative_to(MISSION)))
            continue
        data = frontmatter(text)
        wid = data.get("workbook_id") or data.get("mission_id")
        if not wid:
            continue
        records[str(wid)] = (path, data, text)
    return records, unreadable


def check_one(wid: str, path: pathlib.Path, data: dict[str, Any], records: dict[str, tuple], text: str = "") -> list[dict[str, str]]:
    findings: list[dict[str, str]] = []
    exceptions = data.get("record_exceptions")
    exception_codes = set(exceptions) if isinstance(exceptions, list) else set()
    # A closure made by the owner rather than by an opposite-host review is legitimate and must say WHO waived what.
    # The waiver is read from a declared field, never inferred from prose: `review_waiver_authority` (or any
    # `owner_ruling*` field) with a non-empty value excuses exactly the review-completion rules below.
    waiver_field = next((key for key, value in data.items() if (key == "review_waiver_authority" or key.startswith("owner_ruling")) and is_set(value)), None)

    def report(severity: str, code: str, detail: str) -> None:
        if code in exception_codes:
            findings.append({"severity": "EXCUSED", "code": code, "workbook": wid, "file": str(path.relative_to(ROOT)), "detail": detail})
            return
        findings.append({"severity": severity, "code": code, "workbook": wid, "file": str(path.relative_to(ROOT)), "detail": detail})

    # A record from the earlier workbook generation is checked on its own terms and then left alone.
    if not any(marker in data for marker in MODERN_MARKERS):
        if LEGACY_STATUS_FIELD in data:
            said = str(data.get(LEGACY_STATUS_FIELD) or "").upper()
            complete = data.get("development_complete") is True
            if complete and said != "COMPLETE":
                report("WARN", "LEGACY_STATUS_DISAGREES", f"development_complete is true while {LEGACY_STATUS_FIELD} is {said!r} (legacy schema)")
        return findings

    status = str(data.get("status") or "").upper()
    claimed = any(is_set(data.get(field)) for field in OWNERSHIP_FIELDS)
    dev_complete = data.get("development_complete") is True
    review_complete = data.get("review_complete") is True
    dev_head = data.get("development_head_sha")
    review_head = data.get("review_head_sha")
    baseline = data.get("development_baseline_sha")
    terminal_marker = data.get("terminal_marker")

    # THE RULE THAT KEEPS THIS HONEST: a workbook is held to the fields IT declares. A record written before a field
    # existed is not judged by that field, because calling a 2026-10-02 record "missing a terminal marker" when the
    # marker vocabulary arrived later would be a false positive, and a checker full of those gets ignored. Every rule
    # below therefore names the condition under which it applies.
    declared = lambda key: key in data  # noqa: E731 - a local predicate reads better than a nested def here

    # 1. The status word and the ownership fields must agree, whatever generation the record is from. This is the exact
    #    drift that was found by hand on 2026-10-06 (a claimed, complete workbook still saying READY).
    if status == "READY" and claimed:
        report("ERROR", "STATUS_READY_BUT_CLAIMED", f"status is READY while {[f for f in OWNERSHIP_FIELDS if is_set(data.get(f))]} are set")
    if status in {"IN_PROGRESS", "COMPLETE", "BLOCKED", "REVIEW"} and not claimed:
        report("ERROR", "STATUS_ACTIVE_BUT_UNCLAIMED", f"status is {status} while no ownership field is set")

    # 2. Development completion, judged on the fields the workbook declares. A short or absent head in a HISTORICAL
    #    record is history (it predates the full-SHA rule) and is reported as a warning; in an ACTIVE record it is an
    #    error, because that is the record a reviewer or the next round will act on. Historical means either "filed
    #    under finished/" - the archive is the strongest possible statement - or a status word that says the work
    #    reached a terminal point, which keeps the rule self-describing instead of hard-coding a programme list.
    historical = "finished" in path.parts or any(token in status for token in TERMINAL_STATUS_TOKENS)
    head_severity = "WARN" if historical else "ERROR"
    if dev_complete and declared("development_head_sha") and not is_sha(dev_head):
        report(head_severity, "DEV_COMPLETE_WITHOUT_HEAD", f"development_complete is true but development_head_sha is {dev_head!r}")
    if dev_complete and declared("development_ci") and not is_set(data.get("development_ci")):
        report("ERROR", "DEV_COMPLETE_WITHOUT_CI", "development_complete is true but the declared development_ci is empty")
    if claimed and declared("development_baseline_sha") and not is_sha(baseline):
        report("ERROR", "CLAIM_WITHOUT_BASELINE", f"the workbook is claimed but development_baseline_sha is {baseline!r}")
    if is_sha(baseline) and declared("baseline_resolution_evidence") and not is_set(data.get("baseline_resolution_evidence")):
        report("WARN", "BASELINE_WITHOUT_EVIDENCE", "development_baseline_sha is set but baseline_resolution_evidence is empty")

    # 3. Review completion. When the workbook records the owner authority that waived the opposite-host review, the
    #    review rules are excused BY THAT AUTHORITY rather than silently satisfied - the finding still appears, named,
    #    so a reader can always see that no independent review happened.
    if review_complete and declared("review_host") and not is_set(data.get("review_host")):
        if waiver_field:
            report("EXCUSED", "REVIEW_WAIVED_BY_RECORDED_AUTHORITY", f"review_complete is true without a review_host; the workbook records the waiver in {waiver_field}")
        else:
            report("ERROR", "REVIEW_COMPLETE_WITHOUT_HOST", "review_complete is true but review_host is empty and no owner waiver is recorded")
    if review_complete and declared("review_head_sha") and not is_sha(review_head):
        if waiver_field:
            report("EXCUSED", "REVIEW_WAIVED_BY_RECORDED_AUTHORITY", f"review_complete is true without an exact review_head_sha; the workbook records the waiver in {waiver_field}")
        else:
            report("WARN" if historical else "ERROR", "REVIEW_COMPLETE_WITHOUT_HEAD", f"review_complete is true but review_head_sha is {review_head!r}")
    if is_set(data.get("review_host")) and declared("review_head_sha") and not is_sha(review_head):
        report("WARN", "REVIEW_CLAIMED_WITHOUT_HEAD", "review_host is set but review_head_sha is not an exact 40-character SHA")
    if review_complete and is_sha(dev_head) and is_sha(review_head) and review_head != dev_head:
        report("WARN", "REVIEW_HEAD_DIFFERS_FROM_DEV_HEAD", f"review_head_sha {review_head} differs from development_head_sha {dev_head} (legitimate for a repair head; the workbook must say which head was reviewed)")
    if review_complete and declared("terminal_marker") and not is_set(terminal_marker):
        report("ERROR", "REVIEW_COMPLETE_WITHOUT_MARKER", "review_complete is true but the declared terminal_marker is empty")
    if status == "COMPLETE" and declared("review_complete") and not review_complete:
        report("ERROR", "COMPLETE_WITHOUT_REVIEW", "status is COMPLETE while the declared review_complete is not true")
    if data.get("merge_authority") is True and declared("review_complete") and not review_complete:
        report("WARN", "MERGE_AUTHORITY_BEFORE_REVIEW", "merge_authority is true while review_complete is false")

    # 4. Dependencies must be accepted before a workbook is READY.
    if status == "READY":
        for dep in data.get("dependency_source_workbooks") or []:
            dep = str(dep)
            if dep in records:
                dep_status = str(records[dep][1].get("status") or "").upper()
                if dep_status != "COMPLETE":
                    report("ERROR", "READY_WITH_UNACCEPTED_DEPENDENCY", f"status is READY while dependency {dep} is {dep_status}")

    # 5. Report identity on disk, and the research-material index only for workbooks that opted into that protocol.
    #    As with the head rule, a stale pointer in a FINISHED record is history (the reports/<ID>/ convention came
    #    later) while the same pointer in an ACTIVE record is an error.
    report_path = data.get("report_path")
    if dev_complete and is_set(report_path):
        if not (ROOT / str(report_path)).is_dir():
            report("WARN" if historical else "ERROR", "REPORT_PATH_MISSING", f"report_path {report_path} does not exist")
        else:
            names = " ".join(item.name for item in (ROOT / str(report_path)).glob("*.md"))
            if declared("research_evidence_applicability") and "PAPER_MATERIAL_INDEX" not in names:
                report("WARN", "PAPER_MATERIAL_INDEX_MISSING", f"{report_path} declares research_evidence_applicability but has no PAPER_MATERIAL_INDEX.md")
            if review_complete and "REVIEW_REPORT" not in names:
                report("WARN", "REVIEW_REPORT_MISSING", f"review_complete is true but {report_path} has no REVIEW_REPORT.md")
    if dev_complete and str(data.get("capability_registry_action") or "").upper() == "CREATE" and declared("capability_registry_refs") and not is_set(data.get("capability_registry_refs")):
        report("ERROR", "CAPABILITY_CREATE_WITHOUT_REFS", "capability_registry_action is CREATE but capability_registry_refs is empty")

    # 6. Spelling: a quoted boolean is legal YAML but it is normalised by the toolchain, and before that normalisation
    #    existed it silently disabled acceptance propagation. Reported so the spelling is corrected at the source. The
    #    caller passes the text it already read, so a synthetic record can be checked without a file on disk.
    for key in quoted_fields(text):
        report("WARN", "QUOTED_BOOLEAN_FIELD", f"{key} is written as a quoted scalar; write it unquoted so every parser reads the same value")

    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description="Check Mission Book workbooks for record drift.")
    parser.add_argument("--json", action="store_true", help="emit findings as JSON")
    parser.add_argument("--quiet", action="store_true", help="print only findings, not the summary")
    parser.add_argument("--code", help="print only findings with this code")
    args = parser.parse_args()

    if not MISSION.is_dir():
        print(f"Mission Book not found at {MISSION}", file=sys.stderr)
        return 2
    records, unreadable = load()
    findings: list[dict[str, str]] = []
    for wid, (path, data, text) in records.items():
        findings.extend(check_one(wid, path, data, records, text))
    modern = sum(1 for _wid, (_path, data, _text) in records.items() if any(marker in data for marker in MODERN_MARKERS))
    legacy = len(records) - modern

    order = {"ERROR": 0, "WARN": 1, "EXCUSED": 2}
    findings.sort(key=lambda item: (order.get(item["severity"], 9), item["code"], item["workbook"]))
    if args.code:
        findings = [item for item in findings if item["code"] == args.code]

    errors = sum(1 for item in findings if item["severity"] == "ERROR")
    warns = sum(1 for item in findings if item["severity"] == "WARN")
    excused = sum(1 for item in findings if item["severity"] == "EXCUSED")

    if args.json:
        print(json.dumps({"workbooks": len(records), "modern": modern, "legacy_skipped": legacy, "errors": errors, "warnings": warns, "excused": excused, "unreadable": unreadable, "findings": findings}, ensure_ascii=False, indent=2))
    else:
        for item in findings:
            print(f"[{item['severity']}] {item['code']}  {item['workbook']}  {item['detail']}")
        if not args.quiet:
            print(f"\nchecked {len(records)} workbooks ({modern} current schema, {legacy} legacy records skipped by name): "
                  f"{errors} error(s), {warns} warning(s), {excused} excused")
            if unreadable:
                print(f"unreadable (legacy encoding, skipped): {', '.join(unreadable)}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
