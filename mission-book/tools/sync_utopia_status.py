#!/usr/bin/env python3
"""Refresh Digital-City's generated view of Utopia main + CI.

This is intentionally one-way for generated state: Utopia implementation truth is
pulled into City. Reciprocal PROJECT_LINKAGE.json files provide the reverse
contract without creating a commit ping-pong loop.
"""
from __future__ import annotations

import json
import pathlib
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
CITY_CONTRACT = ROOT / "PROJECT_LINKAGE.json"
OUT_JSON = ROOT / "mission-book" / "UTOPIA_LIVE_STATUS.json"
OUT_MD = ROOT / "mission-book" / "UTOPIA_LIVE_STATUS.md"

API = "https://api.github.com"
RAW = "https://raw.githubusercontent.com"
UA = "Digital-City-Utopia-Linkage/1"


def get_json(url: str):
    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": UA,
        },
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def reciprocal_state(local: dict) -> tuple[str, str | None]:
    url = (
        f"{RAW}/{local['implementation_repo']}/"
        f"{local['implementation_branch']}/PROJECT_LINKAGE.json"
    )
    try:
        remote = get_json(url)
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return "MISSING_REMOTE_CONTRACT", None
        raise

    keys = (
        "schema_version",
        "relationship",
        "control_repo",
        "control_branch",
        "implementation_repo",
        "implementation_branch",
    )
    mismatches = [key for key in keys if remote.get(key) != local.get(key)]
    if mismatches:
        return "MISMATCH:" + ",".join(mismatches), url
    return "RECIPROCAL_LINK_OK", url


def main() -> None:
    contract = json.loads(CITY_CONTRACT.read_text(encoding="utf-8"))
    implementation_repo = contract["implementation_repo"]
    branch = contract["implementation_branch"]

    commit = get_json(f"{API}/repos/{implementation_repo}/commits/{branch}")
    sha = commit["sha"]
    commit_message = commit["commit"]["message"].splitlines()[0]
    commit_time = commit["commit"]["committer"]["date"]
    commit_url = commit["html_url"]

    runs = get_json(
        f"{API}/repos/{implementation_repo}/actions/runs"
        f"?branch={branch}&per_page=30"
    )["workflow_runs"]
    matching = [run for run in runs if run.get("head_sha") == sha]
    run = matching[0] if matching else None

    link_state, remote_contract_url = reciprocal_state(contract)

    data = {
        "schema_version": 1,
        "source_repo": implementation_repo,
        "source_branch": branch,
        "main_sha": sha,
        "main_commit_url": commit_url,
        "main_commit_message": commit_message,
        "main_commit_time": commit_time,
        "ci": None
        if run is None
        else {
            "run_id": run["id"],
            "name": run["name"],
            "status": run["status"],
            "conclusion": run.get("conclusion"),
            "head_sha": run["head_sha"],
            "url": run["html_url"],
            "updated_at": run["updated_at"],
        },
        "linkage": {
            "state": link_state,
            "local_contract": "PROJECT_LINKAGE.json",
            "remote_contract_url": remote_contract_url,
        },
    }

    OUT_JSON.write_text(
        json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )

    ci = data["ci"]
    if ci is None:
        ci_line = "当前 main SHA 未找到工作流记录。 / No workflow run was found for the current main SHA."
    else:
        ci_line = (
            f"[{ci['name']} #{ci['run_id']}]({ci['url']}) — "
            f"{ci['status']} / {ci['conclusion'] or 'pending'} on `{ci['head_sha'][:12]}`."
        )

    md = f"""# Utopia 实现状态 / Live Implementation Status

> **自动生成，请修改生成器。 / GENERATED FILE — do not hand-edit.**
>
> 实现事实来源 / Source of implementation truth: [{implementation_repo}](https://github.com/{implementation_repo}) `{branch}`.
> 规划和任务事实以 Digital-City 工作书元数据及报告为准。 / Planning/workbook truth remains in Digital-City Mission Book frontmatter and reports.

- **Utopia main:** [`{sha[:12]}`]({commit_url})
- **提交 / Commit:** {commit_message}
- **提交时间 / Commit time:** {commit_time}
- **CI:** {ci_line}
- **双向关联 / Reciprocal linkage:** `{link_state}`

本页由 `.github/workflows/sync-utopia-status.yml` 刷新，仅在来源状态变化时提交；五分钟轮询不会制造空提交。

This file is refreshed by `.github/workflows/sync-utopia-status.yml`. The workflow
commits only when source state changes, so the five-minute poll does not create
empty churn.
"""
    OUT_MD.write_text(md, encoding="utf-8")


if __name__ == "__main__":
    main()
