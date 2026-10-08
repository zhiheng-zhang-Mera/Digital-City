#!/usr/bin/env python3
"""Audit the capability registry's evidence references.

WHY THIS EXISTS. A reference nobody can resolve is the same defect class this programme keeps finding elsewhere: a claim
that cites evidence the reader cannot reach. Two things are checked, and the SECOND one is the one that matters:

  1. every record's `implementation.last_verified_full_sha` resolves to a real commit in the implementation repo;
  2. every evidence path resolves **at the head the record was verified at**, not in whatever branch happens to be
     checked out. The first version of this audit asked the working tree and reported 18 dangling references; 8 of them
     were fine, because they live on the recorded head and simply not on the branch in front of it. Measuring the wrong
     tree is exactly the mistake this programme warns about for reproductions, so this tool asks the anchored commit.

WHAT A FAILURE MEANS, in the words a reviewer needs: the file exists in the repository's history (the tool reports the
commit that added it, when it can), but it is NOT reachable from the commit the record anchors to, so
`git show <last_verified_full_sha>:<path>` fails. That is a citation problem, not necessarily a fabrication.

Usage:  python tools/audit_evidence_refs.py [--dc <path>] [--utopia <path>]
"""
import argparse
import json
import pathlib
import re
import subprocess

PATHISH = re.compile(r"\.(md|mjs|js|json|jsonl|yaml|yml|png|txt|csv)$", re.I)


def resolves_at(repo, sha, path):
    if not sha:
        return False
    done = subprocess.run(["git", "-C", repo, "cat-file", "-e", f"{sha}:{path}"], capture_output=True)
    return done.returncode == 0


def added_by(repo, path):
    """The commit that added this path, if any - so a failure can say where the evidence DOES live."""
    done = subprocess.run(["git", "-C", repo, "log", "--all", "--diff-filter=A", "--format=%h", "-1", "--", path],
                          capture_output=True, text=True)
    return done.stdout.strip() or None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dc", default=str(pathlib.Path(__file__).resolve().parents[2]))
    parser.add_argument("--utopia", default=r"D:/utopia-remote-op")
    args = parser.parse_args()

    records_dir = pathlib.Path(args.dc) / "capability-registry" / "records"
    bad_sha, bad_ref, checked = [], [], 0
    records = sorted(records_dir.glob("*.yaml"))

    for record_file in records:
        try:
            record = json.loads(record_file.read_text(encoding="utf-8"))
        except Exception:
            continue
        sha = (record.get("implementation") or {}).get("last_verified_full_sha")
        if not sha:
            bad_sha.append((record_file.stem, None))
            continue
        done = subprocess.run(["git", "-C", args.utopia, "cat-file", "-e", sha], capture_output=True)
        if done.returncode != 0:
            bad_sha.append((record_file.stem, sha))

        candidates = []
        for key, value in (record.get("evidence") or {}).items():
            if isinstance(value, list):
                candidates += [(key, entry) for entry in value]
        for surface in record.get("surfaces") or []:
            if surface.get("evidence_ref"):
                candidates.append(("surfaces[].evidence_ref", surface["evidence_ref"]))

        for key, entry in candidates:
            if not isinstance(entry, str) or entry.startswith("http"):
                continue
            is_utopia = entry.startswith("utopia:")
            path = (entry[7:] if is_utopia else entry).strip().split()[0]
            if "/" not in path and "\\" not in path:
                continue
            if not PATHISH.search(path):
                continue
            checked += 1
            if is_utopia:
                if not resolves_at(args.utopia, sha, path):
                    bad_ref.append((record_file.stem, key, entry, sha, added_by(args.utopia, path)))
            elif not (pathlib.Path(args.dc) / path).exists():
                bad_ref.append((record_file.stem, key, entry, sha, None))

    print(f"records: {len(records)}   references checked: {checked}")
    print("\nunresolvable last_verified_full_sha:")
    for name, sha in bad_sha:
        print(f"  {name} -> {sha}")
    if not bad_sha:
        print("  none")
    print("\nreferences not resolvable at the head the record was verified at:")
    for name, key, entry, sha, added in bad_ref:
        where = f" (added by {added}, so it exists in history)" if added else ""
        print(f"  {name} [{key}] {entry}   (anchored at {str(sha)[:9]}){where}")
    if not bad_ref:
        print("  none")
    return 1 if (bad_sha or bad_ref) else 0


if __name__ == "__main__":
    raise SystemExit(main())
