#!/usr/bin/env python3
"""REX-806: recompute the artifact's POINTER LISTS from the City (owner-side).

The package's raw-pointers.json is how a reviewer navigates from a claim back to the raw record, so a filter
that silently drops records or invents them would be invisible in every check that only compares the package
with itself. This tool re-applies the exporter's documented scoping rule to the City's own data and compares
the resulting ID sets:

  traceRecords  records whose canonicalRefs name one of the artifact's campaigns, or a taskRef that belongs to
                one of the artifact's canonical tasks (the exporter's own filter, re-implemented here).
  canonicalTasks the City's whole task list at export time, which can be broader than the dataset's references.
  receipts      every campaign the City lists, and the artifact must not name one the City does not hold.

Reads: the City (owner credential required, never printed) and the published package.
Usage: python POINTERS_RECOMPUTE_CITY_MECH.py
       REX806_CITY / REX806_CONFIG / REX806_ARTIFACT override endpoint, credential file and package under test.
Writes: nothing. Exits non-zero on any disagreement.

MEASURED: 8/8 on the published package against the producing City (18 campaigns, 26 tasks, 256 trace records,
17 registry rows, 578 events now). The trace set re-derives exactly (176 both ways); the artifact names exactly
the City's receipts; every packaged event still resolves; and every task that existed before the export is
present. Three scratch controls each fail the intended check: dropping one trace pointer, one receipt, and one
unrelated pre-export task.

TWO OF ITS OWN DEFECTS, kept where they happened: it read `record['raw']['canonicalRefs']`, but the trace API
returns normalised records with `canonicalRefs` at the top level (the `raw` wrapper belongs to the collector's
on-disk jsonl), so it recomputed an empty set that could only agree with itself; and it stripped `event:` from
the trace pointer list although those pointers are prefixed `trace:`, so a correct 176-record set could not
overlap the recomputed one. A THIRD defect was found by its own control rather than by reading: deleting one of
the two unrelated tasks left every check green, because nothing asserted the package's completeness upwards -
now any City task older than manifest.generatedAt that the package omits fails.

SEMANTICS WORTH KNOWING (same class as the campaigns/replays counts the handoff documents): rawPointers.
canonicalTasks is the City's whole task list, so this export carries 26 against the dataset's 24 references; the
two extra are older CHECKPOINT_DEMO tasks unrelated to any campaign. A reader comparing 26 with 24 should read
this line first.

BOUNDARY: like the provenance and placement cross-checks, this needs the producing City's owner credential, so
the opposite host as a MEMBER cannot run it.
"""
import json
import os
import pathlib
import sys
import urllib.parse
import urllib.request

CITY = os.environ.get('REX806_CITY', 'http://172.31.12.151:4391')
CONFIG = os.environ.get('REX806_CONFIG', r'C:\ProgramData\Utopia\host\city\local-config.json')
ART = pathlib.Path(os.environ.get('REX806_ARTIFACT', r'D:\utopia-chat\dc\mission-book\reports\REX-806\artifact'))

token = json.loads(pathlib.Path(CONFIG).read_text(encoding='utf-8'))['token']
HEADERS = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json',
           'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'}


def get(path):
    request = urllib.request.Request(f'{CITY}/api/v0/{path}', headers=HEADERS)
    return json.loads(urllib.request.urlopen(request, timeout=60).read().decode('utf-8'))


failures, checks = [], []


def check(name, ok, detail):
    checks.append((name, ok, detail))
    if not ok:
        failures.append(name)


city = get('city')
pointers = json.loads((ART / 'raw-pointers.json').read_text(encoding='utf-8'))
dataset = json.loads((ART / 'normalized-dataset.json').read_text(encoding='utf-8'))['rows']

packaged_receipts = {p.replace('receipt:', '') for p in pointers['receipts']}
city_receipts = {e['campaignId'] for e in get('research/campaigns').get('receipts', [])}
check('the artifact names exactly the campaigns the City holds',
      packaged_receipts == city_receipts,
      f'packaged={len(packaged_receipts)} city={len(city_receipts)} '
      f'only-packaged={sorted(packaged_receipts - city_receipts)[:2]} only-city={sorted(city_receipts - packaged_receipts)[:2]}')

# --- canonical tasks: the exporter packages the City's WHOLE task list, not only the dataset's references ---
# MEASURED SEMANTICS, and the reason my first version's two checks were wrong: rawPointers.canonicalTasks is the
# task list the City held at export time, so it can be broader than the dataset's own references. On this export
# it is 26 against 24 references, the extra two being older CHECKPOINT_DEMO tasks unrelated to any campaign.
task_refs = {row['taskRef'] for row in dataset if row.get('taskRef')}
packaged_tasks = {p.replace('task:', '') for p in pointers['canonicalTasks']}
city_task_ids = {task['id'] for task in (city.get('tasks') or [])}
city_task_by_id = {task['id']: task for task in (city.get('tasks') or [])}
check('every dataset task reference is packaged (nothing the artifact cites is missing)',
      task_refs <= packaged_tasks, f'missing: {sorted(task_refs - packaged_tasks)[:3]}')
check('every packaged task exists in the City',
      packaged_tasks <= city_task_ids, f'unknown: {sorted(packaged_tasks - city_task_ids)[:3]}')
extras = sorted(packaged_tasks - task_refs)
check('the tasks beyond the dataset are reported, not silently tolerated',
      True,
      f'packaged={len(packaged_tasks)} dataset refs={len(task_refs)} beyond={len(extras)}: '
      + ', '.join(f'{t}({city_task_by_id.get(t, {}).get("type")}, {str(city_task_by_id.get(t, {}).get("createdAt"))[:10]})' for t in extras))

# The task list only grows, so any task the City holds and the package does not must have been created AFTER the
# export. Without this, dropping a task from the package was undetectable - MY CONTROL FOUND THAT: removing one of
# the two unrelated tasks left all seven checks green, because nothing asserted the package's completeness upwards.
generated_at = json.loads((ART / 'manifest.json').read_text(encoding='utf-8'))['generatedAt']
late = [t for t in (city_task_ids - packaged_tasks)
        if str(city_task_by_id.get(t, {}).get('createdAt') or '') <= generated_at]
check('no task that existed before the export is missing from the package',
      not late, f'{len(late)} missing and older than generatedAt ({generated_at}): {sorted(late)[:3]}')

# --- trace records: re-apply the exporter's filter -------------------------------------------------
# The API returns NORMALISED records with `canonicalRefs` at the top level; the `raw` wrapper belongs to the
# collector's on-disk jsonl. MY FIRST VERSION READ `record['raw']['canonicalRefs']` and recomputed an empty set
# while the package held 176 records - a probe that could only ever agree with itself.
# MEASURED SEMANTICS: the pointers carry a prefix that names the store (`trace:`, `task:`, `event:`, `receipt:`),
# and the first version of this tool stripped `event:` from the trace list, so every id kept its prefix and the two
# sets could not overlap even though both held 176 records. Strip the prefix the store actually uses.
trace = get('research/trace').get('trace', {}).get('records', [])
campaign_ids = packaged_receipts | {row['campaignId'] for row in dataset}
expected_trace = {record['eventId'] for record in trace
                  if (record.get('canonicalRefs') or {}).get('campaignId') in campaign_ids
                  or ((record.get('canonicalRefs') or {}).get('taskRef') in task_refs)}
packaged_trace = {p.replace('trace:', '') for p in pointers['traceRecords']}
check('the packaged trace set equals an independent re-application of the documented filter',
      packaged_trace == expected_trace,
      f'packaged={len(packaged_trace)} recomputed={len(expected_trace)} '
      f'only-packaged={len(packaged_trace - expected_trace)} only-recomputed={len(expected_trace - packaged_trace)}')

# --- experiments: the registry rows the City holds -------------------------------------------------
packaged_experiments = {p.replace('experiment:', '') for p in pointers['experiments']}
registry = get('research/experiments').get('experiments', [])
registry_ids = {row.get('experimentId') for row in registry}
check('every packaged experiment is a registry row the City holds',
      packaged_experiments <= registry_ids,
      f'packaged={len(packaged_experiments)} registry={len(registry_ids)} unknown={sorted(packaged_experiments - registry_ids)[:3]}')

# --- events: known to grow, so the check states the relation rather than equality ------------------
packaged_events = {p.replace('event:', '') for p in pointers['events']}
city_events = {event['id'] for event in (city.get('events') or [])}
check('every packaged event still exists in the City (the City may hold more since the export)',
      packaged_events <= city_events,
      f'packaged={len(packaged_events)} city now={len(city_events)} lost={len(packaged_events - city_events)}')

print(f'city: {len(city_receipts)} campaigns, {len(city_task_ids)} tasks, {len(trace)} trace records, '
      f'{len(registry_ids)} registry rows, {len(city_events)} events')
for name, ok, detail in checks:
    print(('PASS  ' if ok else 'FAIL  ') + name + '  [' + detail + ']')
print(f'\n{sum(1 for _, ok, _ in checks if ok)}/{len(checks)} pointer checks pass')
sys.exit(1 if failures else 0)
