#!/usr/bin/env python3
"""Audit the references in the documents the REX-890 final gate depends on.

WHY. The Owner's exposure packet, the close-out checklist and the hand-off to the reviewer all name files and
instruments as evidence. A path that does not exist wastes the reader's time and, worse, reads as though it were
evidence. This is the same check the registry audit applies to capability records, applied to the gate documents.

TWO WAYS THIS CHECK WAS WRONG BEFORE IT WAS RIGHT, recorded because the same two shapes recur:
  * it treated REVIEW_REPORT.md as missing, when that file is named precisely BECAUSE it must not exist yet (section 3
    forbids this host from writing it) - a check that cannot tell "absent" from "expected to be absent";
  * it silently checked ZERO references in one document, because it only looked at backticked paths, and that document
    lists its paths inside a fenced block. Zero checked reads as success and is not.
It also produced four false positives from two regex slips: a `reports/...` capture that dropped the prefix it needed,
and an extension alternation that matched `.json` inside `.jsonl`.

Usage: python reports/REX-890/tools/audit_gate_doc_refs.py [--dc <path>] [--utopia <path>]
"""
import argparse
import pathlib
import re
import sys

# A reference that is expected to be absent is not a missing reference.
EXPECTED_ABSENT = {"mission-book/reports/REX-890/REVIEW_REPORT.md"}

DOCS = [
    "exposure gate packet",
    "close-out checklist",
    "response to Alien",
    "review hand-off",
]
FILES = [
    "mission-book/reports/REX-890/EXPOSURE_GATE_PACKET.md",
    "mission-book/reports/REX-890/CLOSEOUT_CHECKLIST.md",
    "mission-book/reports/REX-890/RESPONSE_TO_ALIEN_VERIFICATION_2026-10-08.md",
    "mission-book/reports/REX-890/REVIEW_HANDOFF_Mech.md",
]

# Longest extension first, or `.json` matches inside `.jsonl`.
PATTERNS = [
    ("utopia", re.compile(r"(?:^|[^A-Za-z0-9_./-])(evidence/[A-Za-z0-9_./-]+\.(?:jsonl|json|mjs|md|yaml))")),
    ("utopia", re.compile(r"(?:^|[^A-Za-z0-9_./-])(scripts/[A-Za-z0-9_./-]+\.mjs)")),
    ("utopia", re.compile(r"(?:^|[^A-Za-z0-9_./-])(tests/[A-Za-z0-9_./-]+\.test\.mjs)")),
    ("dc", re.compile(r"(?:^|[^A-Za-z0-9_./-])(mission-book/[A-Za-z0-9_./-]+\.md)")),
    ("dc", re.compile(r"(?:^|[^A-Za-z0-9_./-])(capability-registry/[A-Za-z0-9_./-]+\.(?:yaml|py))")),
    ("dc", re.compile(r"(?:^|[^A-Za-z0-9_./-])(reports/[A-Za-z0-9_./-]+\.md)")),
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dc", default=str(pathlib.Path(__file__).resolve().parents[4]))
    parser.add_argument("--utopia", default=r"D:/utopia-remote-op")
    args = parser.parse_args()
    dc = pathlib.Path(args.dc)
    utopia = pathlib.Path(args.utopia)

    missing = 0
    for name, rel in zip(DOCS, FILES):
        path = dc / rel
        if not path.exists():
            print(f"{name}: DOCUMENT ITSELF MISSING ({rel})")
            missing += 1
            continue
        text = path.read_text(encoding="utf-8")
        found = set()
        for side, pattern in PATTERNS:
            for match in pattern.finditer(text):
                raw = match.group(1)
                found.add((side, "mission-book/" + raw if raw.startswith("reports/") else raw))
        bad, excused = [], 0
        for side, ref in sorted(found):
            if ref in EXPECTED_ABSENT:
                excused += 1
                continue
            base = utopia if side == "utopia" else dc
            if not (base / ref).exists():
                bad.append(f"{side}:{ref}")
        note = f", {excused} expected-absent (excused)" if excused else ""
        print(f"{name}: {len(found)} reference(s) checked, {len(bad)} missing{note}")
        for item in bad:
            print("   MISSING " + item)
        if not found:
            print("   WARNING no references found at all - is the audit looking at the right text?")
        missing += len(bad)
    print(f"\ntotal missing references: {missing}")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
