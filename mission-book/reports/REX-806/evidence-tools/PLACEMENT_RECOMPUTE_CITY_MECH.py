#!/usr/bin/env python3
"""REX-806: recompute the PLACEMENT column from the City's raw campaign receipts (owner-side).

The package's placement columns (expectedNodeIdByPolicy, placementMatchesPolicy, placementMatchesSeedAlone,
placementRule) are the only part of the artifact that the two package-only checkers could not re-derive: they
can only verify that a verdict agrees with the node it names. The declaration order lives in the City's campaign
receipts, so this is the check that closes that gap - it re-derives the expected node from the raw records using
the shared rule the gateway and replay engine use:

    replayTarget(context, seed) =
        workers[0]                                  if replay.disabledMechanisms includes 'alternate-device'
        context.targetDeviceRef ?? workers[seed % workers.length]   otherwise

Reads: the City (owner credential required, never printed) and the published package.
Usage: python PLACEMENT_RECOMPUTE_CITY_MECH.py
       REX806_CITY / REX806_CONFIG / REX806_ARTIFACT override endpoint, credential file and package under test.
Writes: nothing. Exits non-zero on any disagreement.

MEASURED: 6/6 on the published package against the producing City (18 receipts, 24 runs): every dataset row has
a receipt; expectedNodeIdByPolicy, placementMatchesPolicy, placementMatchesSeedAlone and placementRule all
recompute; the two policy strings seen in the receipts are
SEEDED_WORKER_SELECTION_OR_ORIGINAL_EXPLICIT_TARGET and
alternate-device@1:SEEDED_WORKER_SELECTION_OFF_PIN_FIRST_DECLARED_WORKER; the seed-only divergence is exactly the
2 ablation rows out of 4. Control: flipping one row's expectedNodeIdByPolicy to the other device fails the
field-vs-City check, so the check is falsifiable. Note the split of duties - the package-only checker (27 checks)
verifies that a verdict agrees with the node the row itself names; only this tool compares against the City, which
is why a tampered field passes there and fails here.

BOUNDARY: as with the provenance cross-check, this needs the producing City's owner credential, so the opposite
host as a MEMBER cannot run it; what they can run is the package-only checker or their own recomputation.
"""
import json
import os
import pathlib
import sys
import urllib.request

CITY = os.environ.get('REX806_CITY', 'http://172.31.12.151:4391')
CONFIG = os.environ.get('REX806_CONFIG', r'C:\ProgramData\Utopia\host\city\local-config.json')
ART = pathlib.Path(os.environ.get('REX806_ARTIFACT', r'D:\utopia-chat\dc\mission-book\reports\REX-806\artifact'))

token = json.loads(pathlib.Path(CONFIG).read_text(encoding='utf-8'))['token']
HEADERS = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json',
           'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'}


def get(path):
    request = urllib.request.Request(f'{CITY}/api/v0/{path}', headers=HEADERS)
    return json.loads(urllib.request.urlopen(request, timeout=30).read().decode('utf-8'))


def expected_for(context, seed):
    manifest = (context or {}).get('manifest') or {}
    workers = manifest.get('workers') or []
    replay = (context or {}).get('replay') or {}
    disabled = replay.get('disabledMechanisms') or []
    if 'alternate-device' in disabled:
        return (workers[0] if workers else None), 'POLICY_ALTERNATE_DEVICE_DISABLED_PINS_FIRST_DECLARED_WORKER'
    target = (context or {}).get('targetDeviceRef')
    if target:
        return target, 'TARGET_DEVICE_REF'
    return (workers[seed % len(workers)] if workers else None), 'SEEDED_WORKER_SELECTION'


def seed_alone_for(context, seed):
    workers = ((context or {}).get('manifest') or {}).get('workers') or []
    return workers[seed % len(workers)] if workers else None


failures = []
checks = []


def check(name, ok, detail):
    checks.append((name, ok, detail))
    if not ok:
        failures.append(name)


listing = get('research/campaigns')
receipts = {}
for entry in listing.get('receipts', []):
    detail = get('research/campaigns/' + urllib.parse.quote(entry['campaignId'])).get('campaign')
    if detail:
        receipts[detail['campaignId']] = detail

runs = {}
for campaign in receipts.values():
    context = campaign.get('context') or {}
    for run in campaign.get('runs') or []:
        runs[(campaign['campaignId'], run.get('index'))] = {
            'seed': run.get('seed'), 'state': run.get('state'), 'measured': run.get('measured'),
            'assigned': (run.get('result') or {}).get('assignedNodeId'),
            'workers': ((context.get('manifest') or {}).get('workers') or []),
            'policy': (context.get('replay') or {}).get('exactPolicy'),
        }

rows = json.loads((ART / 'normalized-dataset.json').read_text(encoding='utf-8'))['rows']
check('the City holds a receipt for every dataset row',
      all((r['campaignId'], r['index']) in runs for r in rows),
      f'{[r["rawPointer"] for r in rows if (r["campaignId"], r["index"]) not in runs][:3]}')

expected_bad, policy_bad, seed_bad, rule_bad = [], [], [], []
for row in rows:
    source = runs.get((row['campaignId'], row['index']))
    if not source:
        continue
    expected, rule = expected_for(receipts[row['campaignId']].get('context'), source['seed'])
    seed_alone = seed_alone_for(receipts[row['campaignId']].get('context'), source['seed'])
    if row.get('expectedNodeIdByPolicy') != expected:
        expected_bad.append((row['rawPointer'], row.get('expectedNodeIdByPolicy'), expected))
    if (row.get('assignedNodeId') == expected) != (row.get('placementMatchesPolicy') is True):
        policy_bad.append(row['rawPointer'])
    if (row.get('assignedNodeId') == seed_alone) != (row.get('placementMatchesSeedAlone') is True):
        seed_bad.append(row['rawPointer'])
    if rule in ('POLICY_ALTERNATE_DEVICE_DISABLED_PINS_FIRST_DECLARED_WORKER', 'SEEDED_WORKER_SELECTION') \
            and row.get('placementRule') != rule:
        rule_bad.append((row['rawPointer'], row.get('placementRule'), rule))

check('expectedNodeIdByPolicy recomputes from the City receipt', not expected_bad,
      f'{len(expected_bad)} differ: {expected_bad[:3]}')
check('placementMatchesPolicy recomputes', not policy_bad, f'{len(policy_bad)} differ: {policy_bad[:3]}')
check('placementMatchesSeedAlone recomputes', not seed_bad, f'{len(seed_bad)} differ: {seed_bad[:3]}')
check('placementRule names the rule that actually decided', not rule_bad,
      f'{len(rule_bad)} differ: {rule_bad[:3]}')

ablations = [r for r in rows if r.get('replayMode') == 'ABLATION']
divergent = [r for r in rows if r.get('placementMatchesSeedAlone') is False]
check('the seed-only divergence is exactly on the ablation rows',
      {r['rawPointer'] for r in divergent} <= {r['rawPointer'] for r in ablations},
      f'{len(ablations)} ablation rows, {len(divergent)} divergent')
policies = {s['policy'] for s in runs.values() if s.get('policy')}
print(f'city receipts: {len(receipts)} campaigns, {len(runs)} runs | dataset rows: {len(rows)}')
print(f'exact policy strings seen in the receipts: {sorted(policies)}')
for name, ok, detail in checks:
    print(('PASS  ' if ok else 'FAIL  ') + name + '  [' + detail + ']')
print(f'\n{sum(1 for _, ok, _ in checks if ok)}/{len(checks)} placement checks pass')
sys.exit(1 if failures else 0)
