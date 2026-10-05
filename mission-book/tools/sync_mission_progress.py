#!/usr/bin/env python3
"""Generate Mission Book homepage progress from authoritative workbook frontmatter.

Generated homepage blocks and MISSION_PROGRESS.json are derived views only.
Workbook frontmatter remains authoritative.
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
README = MISSION / "README.md"
MANIFEST = MISSION / "PROGRESS_MANIFEST.json"
OUT_JSON = MISSION / "MISSION_PROGRESS.json"

PROGRESS_START = "<!-- MISSION_PROGRESS:START -->"
PROGRESS_END = "<!-- MISSION_PROGRESS:END -->"
ACTIVE_START = "<!-- ACTIVE_WORKBOOKS:START -->"
ACTIVE_END = "<!-- ACTIVE_WORKBOOKS:END -->"

DEV_KEYS = ("development_complete", "migration_complete")
REVIEW_KEYS = ("review_complete", "correction_complete", "verification_complete")
TERMINAL_TOKENS = ("COMPLETE", "ACCEPTED", "MERGED_MAIN", "VERIFIED")


def parse_scalar(raw: str) -> Any:
    value = raw.strip()
    if value.lower() == "true":
        return True
    if value.lower() == "false":
        return False
    if value.lower() in {"null", "none", "~"}:
        return None
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        return value[1:-1]
    return value


def frontmatter(path: pathlib.Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}
    out: dict[str, Any] = {}
    for line in lines[1:]:
        if line.strip() == "---":
            break
        if not line or line[:1].isspace() or ":" not in line:
            continue
        key, raw = line.split(":", 1)
        out[key.strip()] = parse_scalar(raw)
    return out


def stage_bool(data: dict[str, Any], keys: tuple[str, ...], status: str) -> bool:
    seen = False
    result = False
    for key in keys:
        if key in data:
            seen = True
            result = result or data[key] is True
    if seen:
        return result
    upper = status.upper()
    return any(token in upper for token in TERMINAL_TOKENS) and "IN_PROGRESS" not in upper


def task_id(path: pathlib.Path, data: dict[str, Any]) -> str:
    explicit = data.get("workbook_id") or data.get("mission_id")
    if explicit:
        return str(explicit)
    match = re.search(r"(?:MB|BA|RF|GAI|EM|RS|UI|UXI|JOIN|MESH|WBC|CEX|REX|MON|SHOW)-\d{3}", path.name)
    return match.group(0) if match else path.stem


def collect() -> dict[str, Any]:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    programmes = []
    seen_paths: set[str] = set()

    for spec in manifest["programmes"]:
        task_paths: list[pathlib.Path] = []
        for pattern in spec["task_globs"]:
            task_paths.extend(MISSION.glob(pattern))
        unique = sorted({p.resolve() for p in task_paths if p.is_file()}, key=lambda p: str(p))

        tasks = []
        for resolved in unique:
            path = pathlib.Path(resolved)
            rel = path.relative_to(MISSION)
            rel_key = rel.as_posix()
            if rel_key in seen_paths:
                raise RuntimeError(f"Workbook counted twice: {rel_key}")
            seen_paths.add(rel_key)

            data = frontmatter(path)
            status = str(data.get("status") or "")
            dev = stage_bool(data, DEV_KEYS, status)
            review = stage_bool(data, REVIEW_KEYS, status)
            enabled = data.get("execution_enabled") is True
            tasks.append({
                "id": task_id(path, data),
                "path": rel_key,
                "status": status or "UNSPECIFIED",
                "execution_enabled": enabled,
                "development_complete": dev,
                "review_complete": review,
                "complete": review,
            })

        total = len(tasks)
        dev_count = sum(t["development_complete"] for t in tasks)
        review_count = sum(t["review_complete"] for t in tasks)
        complete_count = sum(t["complete"] for t in tasks)
        statuses = {t["status"].upper() for t in tasks}

        if total and complete_count == total:
            programme_status = "COMPLETE"
        elif spec.get("partial_status_label") and complete_count:
            programme_status = spec["partial_status_label"]
        elif any("IN_PROGRESS" in status for status in statuses):
            programme_status = "IN_PROGRESS"
        elif dev_count or review_count:
            programme_status = "ACTIVE"
        elif any(t["execution_enabled"] for t in tasks):
            programme_status = "READY"
        else:
            programme_status = "PLANNED"

        programmes.append({
            "key": spec["key"],
            "name": spec["name"],
            "readme": spec.get("readme"),
            "active_pool": bool(spec.get("active_pool")),
            "status": programme_status,
            "task_complete": complete_count,
            "development_complete": dev_count,
            "review_complete": review_count,
            "total": total,
            "tasks": tasks,
        })

    def totals(rows: list[dict[str, Any]]) -> dict[str, dict[str, int]]:
        total = sum(p["total"] for p in rows)
        return {
            "tasks": {"complete": sum(p["task_complete"] for p in rows), "total": total},
            "development": {"complete": sum(p["development_complete"] for p in rows), "total": total},
            "review": {"complete": sum(p["review_complete"] for p in rows), "total": total},
        }

    active = [p for p in programmes if p["active_pool"]]
    return {
        "schema_version": 1,
        "source_of_truth": "mission-book workbook frontmatter",
        "format": "总任务完成 / 开发完成 / 复检完成",
        "overall": totals(programmes),
        "active_pool": totals(active),
        "programmes": programmes,
    }


def ratio(item: dict[str, int]) -> str:
    return f"{item['complete']}/{item['total']}"


def link(name: str, readme: str | None) -> str:
    return f"[{name}](./{readme})" if readme else name


def render_progress(data: dict[str, Any]) -> str:
    o = data["overall"]
    a = data["active_pool"]
    lines = [
        PROGRESS_START,
        "## 全城项目总进度（自动同步）",
        "",
        "> **GENERATED VIEW — 禁止手工修改本区块。** 权威来源是各工作书 frontmatter；",
        "> 总任务完成 = 已完成复检/验证/Correction 的完整工作书。历史项目的 Correction / Verification 统一折算为“复检”。",
        "> FUTURE-only 计划（当前 FR-001）在正式激活为工作书前不计入分母。",
        "> 已完成 programme 不在主任务栏重复展示；统一收纳于 [finished/README.md](./finished/README.md)，但仍计入全城合计和 `MISSION_PROGRESS.json`。",
        "",
        f"**全城合计：总任务 {ratio(o['tasks'])} · 开发 {ratio(o['development'])} · 复检 {ratio(o['review'])}**  ",
        f"**当前未收口项目池：总任务 {ratio(a['tasks'])} · 开发 {ratio(a['development'])} · 复检 {ratio(a['review'])}**",
        "",
        "| 项目 | 总任务完成 | 开发完成 | 复检完成 | 状态 |",
        "|---|---:|---:|---:|---|",
    ]
    for p in data["programmes"]:
        if p["status"] == "COMPLETE":
            continue
        lines.append(
            f"| {link(p['name'], p.get('readme'))} | "
            f"**{p['task_complete']}/{p['total']}** | "
            f"**{p['development_complete']}/{p['total']}** | "
            f"**{p['review_complete']}/{p['total']}** | {p['status']} |"
        )
    lines += [
        "",
        "机器可读镜像：[MISSION_PROGRESS.json](./MISSION_PROGRESS.json)。",
        PROGRESS_END,
    ]
    return "\n".join(lines)


def render_active(data: dict[str, Any]) -> str:
    lines = [
        ACTIVE_START,
        "## 当前未收口工作书（自动同步）",
        "",
        "> 只列仍未完成复检/验证的工作书；状态与阶段直接来自 frontmatter。",
        "",
        "| ID | 项目 | 状态 | 开发 | 复检 |",
        "|---|---|---|:---:|:---:|",
    ]
    for p in data["programmes"]:
        if not p["active_pool"]:
            continue
        for t in p["tasks"]:
            if t["complete"]:
                continue
            dev = "✅" if t["development_complete"] else "—"
            review = "✅" if t["review_complete"] else "—"
            lines.append(
                f"| [{t['id']}](./{t['path']}) | {p['name']} | {t['status']} | {dev} | {review} |"
            )
    lines += [
        "",
        "若此表与工作书冲突，以工作书 frontmatter 为准，并视为 homepage sync drift。",
        ACTIVE_END,
    ]
    return "\n".join(lines)


def replace_block(text: str, start: str, end: str, replacement: str) -> str:
    if start in text and end in text:
        pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), re.S)
        return pattern.sub(replacement, text)
    raise RuntimeError(f"README missing generated block markers: {start} / {end}")


def expected_outputs() -> tuple[str, str]:
    data = collect()
    readme = README.read_text(encoding="utf-8")
    readme = replace_block(readme, PROGRESS_START, PROGRESS_END, render_progress(data))
    readme = replace_block(readme, ACTIVE_START, ACTIVE_END, render_active(data))
    json_text = json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    return readme, json_text


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if generated outputs are stale")
    args = parser.parse_args()

    expected_readme, expected_json = expected_outputs()
    current_readme = README.read_text(encoding="utf-8")
    current_json = OUT_JSON.read_text(encoding="utf-8") if OUT_JSON.exists() else ""

    if args.check:
        stale = []
        if current_readme != expected_readme:
            stale.append(str(README.relative_to(ROOT)))
        if current_json != expected_json:
            stale.append(str(OUT_JSON.relative_to(ROOT)))
        if stale:
            print("Mission progress drift: " + ", ".join(stale))
            print("Run: python mission-book/tools/sync_mission_progress.py")
            return 1
        print("Mission progress is synchronized.")
        return 0

    README.write_text(expected_readme, encoding="utf-8")
    OUT_JSON.write_text(expected_json, encoding="utf-8")
    print("Mission progress synchronized.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
