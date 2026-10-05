#!/usr/bin/env python3
"""Propagate accepted exact dependency heads into unclaimed Mission Book workbooks."""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parents[2]
MISSION = ROOT / "mission-book"
ID_RE = re.compile(r"\b(?:MB|BA|RF|GAI|EM|RS|UI|UXI|JOIN|MESH|WBC|CEX|REX|MON|SHOW)-\d{3}\b")
SHA_RE = re.compile(r"^[0-9a-f]{40}$")
WAIT_BLOCKER = "DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE"


def parse_value(raw: str) -> Any:
    v = raw.strip()
    if v.lower() == "true":
        return True
    if v.lower() == "false":
        return False
    if v.lower() in {"null", "none", "~"}:
        return None
    if v.startswith("[") or v.startswith("{"):
        try:
            return json.loads(v)
        except json.JSONDecodeError:
            return v
    if len(v) >= 2 and v[0] == v[-1] and v[0] in {'"', "'"}:
        return v[1:-1]
    return v


def frontmatter(text: str) -> dict[str, Any]:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end < 0:
        return {}
    out: dict[str, Any] = {}
    for line in text[3:end].splitlines():
        if line and not line[:1].isspace() and ":" in line:
            k, raw = line.split(":", 1)
            out[k.strip()] = parse_value(raw)
    return out


def set_field(text: str, key: str, value: Any) -> str:
    if isinstance(value, (list, dict)):
        rendered = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    elif value is None:
        rendered = "null"
    elif value is True:
        rendered = "true"
    elif value is False:
        rendered = "false"
    else:
        rendered = str(value)
    end = text.find("\n---", 3)
    head, tail = text[:end], text[end:]
    pat = re.compile(rf"^{re.escape(key)}:.*$", re.M)
    line = f"{key}: {rendered}"
    return pat.sub(line, head) + tail if pat.search(head) else head + "\n" + line + tail


def accepted_sha(data: dict[str, Any]) -> str | None:
    if str(data.get("status") or "").upper() != "COMPLETE":
        return None
    if data.get("review_complete") is not True or not data.get("terminal_marker"):
        return None
    for key in ("review_head_sha", "correction_head_sha", "verification_head_sha", "development_head_sha"):
        value = data.get(key)
        if isinstance(value, str) and SHA_RE.fullmatch(value):
            return value
    return None


def dependency_ids(data: dict[str, Any], known: set[str]) -> list[str]:
    explicit = data.get("dependency_source_workbooks")
    if isinstance(explicit, list) and explicit:
        return [str(x) for x in explicit]
    deps = data.get("dependencies")
    if not isinstance(deps, list):
        return []
    found: list[str] = []
    for dep in deps:
        for wid in ID_RE.findall(str(dep)):
            if wid in known and wid not in found:
                found.append(wid)
    return found


def planned_changes() -> tuple[list[tuple[pathlib.Path, str]], list[str]]:
    records: dict[str, tuple[pathlib.Path, str, dict[str, Any]]] = {}
    errors: list[str] = []
    for path in MISSION.rglob("*.md"):
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            # Historical/legacy notes may use a local code page and do not
            # participate in frontmatter dependency propagation.
            continue
        data = frontmatter(text)
        wid = data.get("workbook_id") or data.get("mission_id")
        if not wid:
            continue
        wid = str(wid)
        if wid in records:
            errors.append(f"duplicate workbook id {wid}: {records[wid][0]} / {path}")
        records[wid] = (path, text, data)

    known = set(records)
    changes: list[tuple[pathlib.Path, str]] = []
    for wid, (path, text, data) in sorted(records.items()):
        if data.get("baseline_anchor_mode") != "DEPENDENCY_SHA_UNION_AT_CLAIM":
            continue
        sources = dependency_ids(data, known)
        if not sources:
            continue

        updated = text
        if data.get("dependency_source_workbooks") != sources:
            updated = set_field(updated, "dependency_source_workbooks", sources)

        resolved: list[str] = []
        missing: list[str] = []
        for source in sources:
            rec = records.get(source)
            sha = accepted_sha(rec[2]) if rec else None
            if sha:
                resolved.append(sha)
            else:
                missing.append(source)

        claimed = data.get("development_baseline_sha") not in (None, "", "null")
        if claimed:
            if updated != text:
                changes.append((path, updated))
            continue

        status = str(data.get("status") or "")
        owner_gate = str(data.get("owner_gate") or "NONE").upper()
        enabled = data.get("execution_enabled") is True

        if not missing and len(resolved) == len(sources):
            updated = set_field(updated, "dependency_source_shas", resolved)
            if data.get("baseline_blocker") == WAIT_BLOCKER:
                updated = set_field(updated, "baseline_blocker", None)
            if status == "WAITING_DEPENDENCIES" and enabled and owner_gate in {"NONE", "NULL", ""}:
                updated = set_field(updated, "status", "READY")
        elif status == "WAITING_DEPENDENCIES" and data.get("baseline_blocker") in (None, ""):
            updated = set_field(updated, "baseline_blocker", WAIT_BLOCKER)

        if updated != text:
            changes.append((path, updated))
    return changes, errors


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()
    changes, errors = planned_changes()
    if errors:
        print("\n".join(errors))
        return 2
    if args.check:
        if changes:
            print("Mission dependency state drift:")
            for path, _ in changes:
                print(f" - {path.relative_to(ROOT)}")
            return 1
        print("Mission dependency state is synchronized.")
        return 0
    for path, text in changes:
        path.write_text(text, encoding="utf-8")
        print(f"reconciled {path.relative_to(ROOT)}")
    if not changes:
        print("Mission dependency state already synchronized.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
