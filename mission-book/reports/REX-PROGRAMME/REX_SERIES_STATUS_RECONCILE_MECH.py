#!/usr/bin/env python3
"""REX series reconciliation: reverse-verify each workbook's declared state against the IMPLEMENTATION repo's
pushed records (branches, ancestry, exact-head CI) and report every agreement and disagreement.

Reads only: mission-book workbooks (control plane) and git/gh queries against the implementation repo.
Writes nothing. Exists because a workbook is a claim, and the pushed record is the fact.
"""
import json
import pathlib
import re
import subprocess
import sys

DC = pathlib.Path(r'D:\utopia-chat\dc')
REPO = pathlib.Path(r'D:\utopia')
WORKBOOKS = DC / 'mission-book' / 'mission-group' / 'research-strengthening'
KEYS = ['workbook_id', 'status', 'development_host', 'development_branch', 'development_head_sha',
        'review_host', 'review_head_sha', 'review_complete', 'terminal_marker', 'merge_authority']


def git(*args):
    result = subprocess.run(['git', '-C', str(REPO), *args], capture_output=True, text=True)
    return result.returncode, result.stdout.strip()


def ci_for(sha):
    result = subprocess.run(['gh', 'run', 'list', '--repo', 'zhiheng-zhang-Mera/utopia', '--commit', sha,
                             '--json', 'name,status,conclusion,attempt'], capture_output=True, text=True)
    if result.returncode != 0:
        return None
    try:
        return json.loads(result.stdout)
    except Exception:
        return None


def frontmatter(path):
    text = path.read_text(encoding='utf-8')
    if not text.startswith('---'):
        return None
    end = text.find('\n---', 3)
    fields = {}
    for line in text[3:end].splitlines():
        match = re.match(r'^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$', line)
        if match:
            fields[match.group(1)] = match.group(2).strip().strip('"')
    return fields


def main():
    code, main_sha = git('rev-parse', 'origin/main')
    print(f'implementation origin/main = {main_sha[:12]}\n')
    rows = []
    for path in sorted(WORKBOOKS.glob('REX-*.md')):
        fields = frontmatter(path)
        if not fields or not fields.get('workbook_id'):
            continue
        task = fields['workbook_id']
        record = {'task': task, 'status': fields.get('status'), 'marker': fields.get('terminal_marker')}
        for role, key in (('dev', 'development_head_sha'), ('review', 'review_head_sha')):
            sha = fields.get(key) or ''
            if not re.fullmatch(r'[0-9a-f]{40}', sha):
                record[role] = {'sha': sha or None, 'exists': None, 'in_main': None, 'ci': None}
                continue
            exists = git('cat-file', '-e', sha)[0] == 0
            in_main = git('merge-base', '--is-ancestor', sha, 'origin/main')[0] == 0 if exists else None
            branches = git('branch', '-r', '--contains', sha)[1].splitlines() if exists else []
            runs = ci_for(sha) if exists else None
            record[role] = {'sha': sha, 'exists': exists, 'in_main': in_main,
                            'carried_by': [b.strip() for b in branches if b.strip()][:4],
                            'ci': runs}
        rows.append(record)

    for record in rows:
        print(f"=== {record['task']}  status={record['status']}  marker={record['marker']}")
        for role in ('dev', 'review'):
            info = record[role]
            if info['sha'] is None:
                print(f"   {role:6} declared: (none)")
                continue
            line = f"   {role:6} {info['sha'][:12]}  exists={info['exists']}  in_main={info['in_main']}"
            if info['ci']:
                summary = ' '.join(f"{r['name']}:{r['status']}/{r['conclusion'] or '-'}(att{r['attempt']})" for r in info['ci'])
                line += f"  CI[{len(info['ci'])}]: {summary[:150]}"
            elif info['exists']:
                line += '  CI: none found'
            print(line)
            if info.get('carried_by'):
                print(f"          carried by: {', '.join(info['carried_by'])}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
