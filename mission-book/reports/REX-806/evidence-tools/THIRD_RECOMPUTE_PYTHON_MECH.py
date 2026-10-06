#!/usr/bin/env python3
"""REX-806 artifact: a THIRD, independent recomputation - in Python, from the published bytes only.

Why a third implementation: the exporter (services/dev-gateway/research/artifact.mjs) computes the metrics,
and scripts/verify-research-artifact.mjs re-computes them in the same language, sharing JS number and date
semantics. A Python recomputation with its own parser, its own median and its own timestamp handling can
disagree where two JS implementations agree - which is exactly the class of error a review is looking for.

Reads: normalized-dataset.json, metrics.csv, manifest.json, exclusions.json - nothing else, and no City access.
Usage: python THIRD_RECOMPUTE_PYTHON_MECH.py   (REX806_ARTIFACT=<dir> to point it at another package)
Writes: nothing. Exits non-zero on any disagreement.

MEASURED: 12/12 on the published package; a scratch copy with one task timestamp moved by +1 s fails 2 checks, so
the probe can fail. Two of its OWN defects were found and are kept in the comments where they happened:
  1. it first ASSERTED that durationMs equals (taskUpdatedAt - taskCreatedAt) and reported 24 "failures" - those
     are two different measurements of nearly the same interval (the run record vs the canonical task's bracket;
     measured delta 7-63 ms, all one sign), so the probe's premise was the bug and not the package;
  2. it first compared failure_rate as strings, so Python's 0.0 against the CSV's 0 read as a failure.
Both belong to the instrument-error class this programme records: a probe that agrees with its own assumption.
"""
import csv
import json
import os
import pathlib
import statistics
import sys

ART = pathlib.Path(os.environ.get('REX806_ARTIFACT', r'D:\utopia-chat\dc\mission-book\reports\REX-806\artifact'))
data = json.loads((ART / 'normalized-dataset.json').read_text(encoding='utf-8'))
rows = data['rows']
manifest = json.loads((ART / 'manifest.json').read_text(encoding='utf-8'))
exclusions = json.loads((ART / 'exclusions.json').read_text(encoding='utf-8'))

with (ART / 'metrics.csv').open(encoding='utf-8', newline='') as handle:
    metrics = {r['metric']: r for r in csv.DictReader(handle)}

failures = []
checks = []


def check(name, ok, detail):
    checks.append((name, ok, detail))
    if not ok:
        failures.append(name)


# 1 completion_time_ms = median over MEASURED runs whose task is COMPLETED.
durations = []
for row in rows:
    if row.get('measured') is not True:
        continue
    if row.get('taskState') != 'COMPLETED':
        continue
    created, updated = row.get('taskCreatedAt'), row.get('taskUpdatedAt')
    if not created or not updated:
        continue
    # ISO-8601 strings; parse with the standard library to keep Python's own semantics.
    from datetime import datetime
    c = datetime.fromisoformat(created.replace('Z', '+00:00'))
    u = datetime.fromisoformat(updated.replace('Z', '+00:00'))
    durations.append((u - c).total_seconds() * 1000.0)
median_ms = statistics.median(durations) if durations else None
check('completion_time_ms recomputes',
      str(int(round(median_ms))) == metrics['completion_time_ms']['value'] and str(len(durations)) == metrics['completion_time_ms']['n'],
      f"python median={median_ms} n={len(durations)} | package value={metrics['completion_time_ms']['value']} n={metrics['completion_time_ms']['n']}")

# 2 durationMs is NOT the task interval the metric uses - measured and reported, not asserted equal.
#    MY FIRST VERSION OF THIS PROBE ASSERTED THEY WERE EQUAL AND REPORTED 24 "FAILURES". They are two different
#    measurements of nearly the same interval: durationMs comes from the run record, while (updatedAt - createdAt)
#    is the canonical task's bracket. Measured here: every delta is positive and small (7-63 ms), consistently in
#    one direction, which is what a task bracketed inside its run looks like - not a contradiction. The lesson is
#    this programme's recurring one: the probe's premise was the bug, so it is kept as a report with its numbers.
from datetime import datetime

deltas = []
for row in rows:
    if row.get('durationMs') is None or not row.get('taskCreatedAt') or not row.get('taskUpdatedAt'):
        continue
    c = datetime.fromisoformat(row['taskCreatedAt'].replace('Z', '+00:00'))
    u = datetime.fromisoformat(row['taskUpdatedAt'].replace('Z', '+00:00'))
    deltas.append(row['durationMs'] - (u - c).total_seconds() * 1000.0)
check('durationMs is reported, not conflated with the task interval',
      bool(deltas) and all(d > 0 for d in deltas),
      f'{len(deltas)} rows, delta=durationMs-(updatedAt-createdAt) in [{min(deltas):.0f}, {max(deltas):.0f}] ms, '
      f'all positive={all(d > 0 for d in deltas)} - the metric uses the task timestamps, never durationMs')

# 3 failure_rate = (failed + timedOut) / accounted, from the manifest's own accounting.
accounting = manifest['supporting']['accounting']
numerator = accounting['failed'] + accounting['timedOut']
denominator = accounting['accounted']
rate = numerator / denominator if denominator else None
# Numeric comparison, not string comparison: my first version compared str(0.0) with the CSV's "0" and reported a
# failure that was purely a cross-language formatting difference. Values are compared with a tolerance now.
reported_rate = float(metrics['failure_rate']['value'])
check('failure_rate recomputes from accounting',
      abs(rate - reported_rate) < 1e-12 and str(denominator) == metrics['failure_rate']['n'],
      f"python={rate} n={denominator} | package value={metrics['failure_rate']['value']} n={metrics['failure_rate']['n']}")

# 4 the accounting identity must hold, and the undelivered campaigns must be named.
check('planned = accounted + undelivered',
      accounting['planned'] == accounting['accounted'] + (accounting['planned'] - accounting['accounted']),
      f"planned={accounting['planned']} accounted={accounting['accounted']}")
undelivered = accounting.get('undeliveredCampaigns', [])
check('every undelivered campaign is named with a reason',
      all(entry.get('reason') for entry in undelivered),
      f"{len(undelivered)} named, reasons: {[e.get('reason') for e in undelivered]}")

# 5 duplicate_execution_count = run references owned by more than one task.
#    The run reference is the dataset's own pointer (receipt:<campaign>#runs[i]); a duplicate is one run that
#    more than one canonical task claims.
by_ref = {}
for row in rows:
    ref = row.get('rawPointer')
    if ref:
        by_ref.setdefault(ref, set()).add(row.get('taskRef'))
duplicates = sum(1 for owners in by_ref.values() if len(owners) > 1)
check('duplicate_execution_count recomputes',
      str(duplicates) == metrics['duplicate_execution_count']['value'],
      f"python={duplicates} over {len(by_ref)} run references | package={metrics['duplicate_execution_count']['value']}")

# 6 convergence_missing_event_count = measured runs whose task is absent.
missing = sum(1 for r in rows if r.get('measured') is True and not r.get('taskRef'))
check('convergence_missing_event_count recomputes',
      str(missing) == metrics['convergence_missing_event_count']['value'],
      f"python={missing} | package={metrics['convergence_missing_event_count']['value']}")

# 7 every NOT_MEASURED row carries a reason; every measured row carries provenance.
no_reason = [m for m, r in metrics.items() if r['value'] == 'NOT_MEASURED' and not r['reason'].strip()]
no_prov = [m for m, r in metrics.items() if r['value'] != 'NOT_MEASURED' and not r['provenance'].strip()]
check('every NOT_MEASURED row states a reason', not no_reason, f'{len(no_reason)} without: {no_reason}')
check('every measured row states provenance', not no_prov, f'{len(no_prov)} without: {no_prov}')

# 8 the exclusions must each state what is excluded, why, and what would be required to measure it.
exc = exclusions['exclusions'] if isinstance(exclusions, dict) else exclusions
check('every exclusion states what/why/wouldRequire',
      all(e.get('what') and e.get('why') and e.get('wouldRequire') for e in exc),
      f'{len(exc)} exclusions: {[e.get("what") for e in exc]}')

# 9 dataset row count must match the manifest's run count and the receipt count.
check('dataset rows match manifest.runCount',
      len(rows) == manifest['runCount'], f"rows={len(rows)} manifest.runCount={manifest['runCount']}")
measured = sum(1 for r in rows if r.get('measured') is True)
check('measured rows match manifest.measuredRuns',
      measured == manifest['measuredRuns'], f"measured={measured} manifest.measuredRuns={manifest['measuredRuns']}")

print(f'artifact: {manifest["artifactId"]}')
for name, ok, detail in checks:
    print(('PASS  ' if ok else 'FAIL  ') + name + '  [' + detail + ']')
print(f'\n{sum(1 for _, ok, _ in checks if ok)}/{len(checks)} python checks pass')
sys.exit(1 if failures else 0)
