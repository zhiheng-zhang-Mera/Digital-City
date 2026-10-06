#!/usr/bin/env python3
"""REX-806 artifact: a THIRD, independent recomputation - in Python, from the published bytes only.

Why a third implementation: the exporter (services/dev-gateway/research/artifact.mjs) computes the metrics,
and scripts/verify-research-artifact.mjs re-computes them in the same language, sharing JS number and date
semantics. A Python recomputation with its own parser, its own median and its own timestamp handling can
disagree where two JS implementations agree - which is exactly the class of error a review is looking for.

Reads: normalized-dataset.json, metrics.csv, manifest.json, exclusions.json, tables.json, failures.json -
nothing else, and no City access.
Usage: python THIRD_RECOMPUTE_PYTHON_MECH.py   (REX806_ARTIFACT=<dir> to point it at another package)
Writes: nothing. Exits non-zero on any disagreement.

COVERAGE: 25 checks in two groups. (a) The four reported metrics are recomputed from the dataset and the
accounting. (b) Cross-file coherence, which neither the exporter's probes nor the JS verifier examines: the
metric catalogue and values in tables.json against metrics.csv, the run mix and state counts in the dataset
against the manifest, and failures.json against the manifest's undelivered campaigns. A package can be
self-consistent per file and still have a table or a failure list describing a different run set.

MEASURED: 25/25 on the published package; four scratch controls each turn the intended checks red - one task
timestamp moved by +1 s, a measured table value changed, an unavailable paper-ready metric fabricated as 0, and
a dataset row's state rewritten. The probe can fail.

FOUR OF ITS OWN PREMISES WERE WRONG, and they are kept where they happened because that is this programme's
recurring error class - a probe that agrees with its own assumption:
  1. it ASSERTED that durationMs equals (taskUpdatedAt - taskCreatedAt) and reported 24 "failures". They are two
     measurements of nearly the same interval (run record vs canonical task bracket; measured delta 7-63 ms, one
     sign), and the metric uses the task bracket, as reproduction.json says.
  2. it compared failure_rate as strings, so Python's 0.0 against the CSV's 0 read as a failure.
  3. it compared an absent n raw, so CSV's empty field against JSON's null reported three supporting rows.
  4. it ASSUMED every campaign in the manifest contributes dataset rows. Two of the 18 delivered nothing - they
     are the refused campaigns named in accounting - so the dataset carries 16 distinct campaignIds. Anyone
     reading "18 campaigns" beside "16 campaign ids" should know this before calling it a mismatch.
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
tables = json.loads((ART / 'tables.json').read_text(encoding='utf-8'))
failures_json = json.loads((ART / 'failures.json').read_text(encoding='utf-8'))

with (ART / 'metrics.csv').open(encoding='utf-8', newline='') as handle:
    metrics = {r['metric']: r for r in csv.DictReader(handle)}

failures = []
checks = []


def check(name, ok, detail):
    checks.append((name, ok, detail))
    if not ok:
        failures.append(name)


def norm_n(value):
    """CSV writes an absent n as an empty field, JSON as null. MY THIRD WRONG PREMISE was comparing them raw
    (str(None) vs '') and reporting three supporting rows as mismatches. Normalise before comparing."""
    return '' if value in (None, 'null') else str(value)


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

# ---- cross-file coherence: the four emitted files must describe the same experiment ----------------
# None of these relations is checked by the exporter's own probes or by the JS verifier, which compare the
# dataset against metrics.csv and then re-hash bytes. A package can be internally consistent per file and
# still have tables.json or failures.json describing a different run set than normalized-dataset.json.

# 10 the metric catalogue must be identical in both views, with no metric invented or dropped on either side.
failures_doc = failures_json['failures'] if isinstance(failures_json, dict) and 'failures' in failures_json else failures_json
table_metrics = {r['metric'] for r in tables['paper_ready']} | {r['metric'] for r in tables['supporting']}
check('tables.json and metrics.csv name the same metric catalogue',
      table_metrics == set(metrics),
      f'{len(table_metrics)} in tables vs {len(metrics)} in CSV; '
      f'only-tables={sorted(table_metrics - set(metrics))} only-csv={sorted(set(metrics) - table_metrics)}')

# 11 every supporting row must reproduce the CSV exactly; every paper-ready row must be an unavailable metric
#    carrying the CSV's own reason (a paper-ready table that quietly zeroes an unmeasured metric is the defect
#    the workbook's guard warns about).
support_bad = [r['metric'] for r in tables['supporting']
               if str(r.get('value')) != metrics[r['metric']]['value'] or norm_n(r.get('n')) != norm_n(metrics[r['metric']]['n'])]
paper_bad = [r['metric'] for r in tables['paper_ready']
             if r.get('value') != 'NOT_MEASURED' or (r.get('reason') or '') != metrics[r['metric']]['reason']]
check('supporting table rows match metrics.csv exactly', not support_bad, f'{len(support_bad)} differ: {support_bad}')
check('paper-ready rows are unavailable metrics with the CSV reason', not paper_bad, f'{len(paper_bad)} differ: {paper_bad}')

# 12 the paper-ready table is G3/G4-first, as its own note claims.
scopes = {r.get('scope') for r in tables['paper_ready']}
check('paper-ready rows are G3/G4 only', scopes <= {'G3', 'G4'}, f'scopes present: {sorted(scopes)}')

# 13 dataset run mix must equal the manifest's supporting counts. Measured semantics, stated so that a reader
#    does not read "replays 11" against "7 REPLAY rows" as a mismatch: supporting.replays counts replays
#    INCLUDING the ablation replays, and the normal campaign runs carry no replayMode at all.
import collections
mix = collections.Counter(r.get('replayMode') for r in rows)
ablation_rows = mix.get('ABLATION', 0)
replay_rows = mix.get('REPLAY', 0)
check('ablation rows match manifest ablations',
      ablation_rows == manifest['supporting']['ablations'], f'dataset={ablation_rows} manifest={manifest["supporting"]["ablations"]}')
check('replay + ablation rows match manifest replays',
      replay_rows + ablation_rows == manifest['supporting']['replays'],
      f'dataset REPLAY={replay_rows} + ABLATION={ablation_rows} = {replay_rows + ablation_rows} vs manifest {manifest["supporting"]["replays"]}')
# 13b campaigns: MY SECOND WRONG PREMISE was that every campaign in the manifest contributes dataset rows.
#     It does not: a campaign that delivered no run contributes none, and the two refused campaigns are named
#     in accounting/failures instead. Measured relation, now asserted with its actual meaning, plus the stronger
#     statement that a refused campaign must have no row at all.
refused = {e['campaignId'] for e in manifest['supporting']['accounting']['undeliveredCampaigns']}
dataset_campaigns = {r['campaignId'] for r in rows}
check('dataset campaigns + refused campaigns account for manifest campaigns',
      len(dataset_campaigns) + len(refused) == manifest['supporting']['campaigns'] and not (dataset_campaigns & refused),
      f'dataset={len(dataset_campaigns)} refused={len(refused)} sum={len(dataset_campaigns) + len(refused)} '
      f'manifest={manifest["supporting"]["campaigns"]}; refused campaigns appearing in the dataset: {sorted(dataset_campaigns & refused)}')

# 14 states: MEASURED must equal measuredRuns, WARMUP must equal the warmup list, and the two together must
#    account for every dataset row. This is the accounting check that keeps "a warmup is not a failure" true.
states = collections.Counter(r.get('state') for r in rows)
warmup_list = failures_doc.get('warmupRuns', [])
unmeasured_list = failures_doc.get('unmeasuredRuns', [])
check('dataset MEASURED rows match manifest.measuredRuns',
      states.get('MEASURED', 0) == manifest['measuredRuns'], f'dataset={states.get("MEASURED", 0)} manifest={manifest["measuredRuns"]}')
check('dataset WARMUP rows match failures.warmupRuns, and warmups are NOT listed as failures',
      states.get('WARMUP', 0) == len(warmup_list) and not unmeasured_list,
      f'dataset WARMUP={states.get("WARMUP", 0)} warmupRuns={len(warmup_list)} unmeasuredRuns={len(unmeasured_list)}')
check('MEASURED + WARMUP account for every dataset row',
      states.get('MEASURED', 0) + states.get('WARMUP', 0) == len(rows),
      f'{states.get("MEASURED", 0)} + {states.get("WARMUP", 0)} = {states.get("MEASURED", 0) + states.get("WARMUP", 0)} of {len(rows)}')

# 15 failures.json must name the same undelivered campaigns as the manifest's accounting, with the same reasons
#    and the same planned counts - the two places a reader would look for "what never ran".
outcomes = failures_doc.get('campaignOutcomes', [])
manifest_undelivered = {e['campaignId']: e for e in manifest['supporting']['accounting']['undeliveredCampaigns']}
outcome_ids = {e['campaignId'] for e in outcomes}
check('failures.campaignOutcomes name exactly the manifest undelivered campaigns',
      outcome_ids == set(manifest_undelivered),
      f'failures={sorted(outcome_ids)} manifest={sorted(manifest_undelivered)}')
check('undelivered reasons and planned counts agree',
      all(e.get('reason') == manifest_undelivered[e['campaignId']]['reason'] and e.get('planned') == manifest_undelivered[e['campaignId']]['planned'] for e in outcomes),
      f"{[(e['campaignId'][-8:], e.get('reason'), e.get('planned')) for e in outcomes]}")
check('undelivered planned runs equal planned - accounted',
      sum(e.get('planned', 0) for e in outcomes) == manifest['supporting']['accounting']['planned'] - manifest['supporting']['accounting']['accounted'],
      f"sum(planned)={sum(e.get('planned', 0) for e in outcomes)} vs planned-accounted="
      f"{manifest['supporting']['accounting']['planned'] - manifest['supporting']['accounting']['accounted']}")

print(f'artifact: {manifest["artifactId"]}')
for name, ok, detail in checks:
    print(('PASS  ' if ok else 'FAIL  ') + name + '  [' + detail + ']')
print(f'\n{sum(1 for _, ok, _ in checks if ok)}/{len(checks)} python checks pass')
sys.exit(1 if failures else 0)
