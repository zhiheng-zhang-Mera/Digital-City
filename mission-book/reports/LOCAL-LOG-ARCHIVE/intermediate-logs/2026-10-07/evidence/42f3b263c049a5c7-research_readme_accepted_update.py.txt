import pathlib,re,hashlib
root=pathlib.Path('\\\\?\\D:\\Digital-City-REX-20261006')
src=root/'mission-book/research-strengthening/README.md';dest=src.parent/'en/README.md';before=src.read_bytes();s=before.decode('utf8')
tail=s[s.index('### REX 集成前置测量'):]
fences=re.findall(r'```[^\n]*\n[\s\S]*?```',tail)
addition='''

<!-- READING_ACCEPTED_PREFLIGHT_638955B:START -->
## Updated integration preflight — accepted identities (reading snapshot)

This complete translation follows the current [canonical programme page](../README.md), source SHA256 `SOURCE_SHA`. Earlier preflight measurements above remain historical and are not silently overwritten. Current task acceptance/claim state belongs to canonical workbooks; this reading page grants no execution or merge authority.

### REX integration preflight: each product merges cleanly alone, together they do not

Trying integration for the first time **only after** REX-803 acceptance would postpone conflicts until the least convenient moment. Therefore integration was measured first. §11 requires starting from the then-latest main; this round began at `b06504f`, using **accepted identities**:

{0}

Both accepted heads merge cleanly separately; together they produce two conflicts, both in services/dev-gateway/server.mjs. Both are the union/superset case named in §11: neither side references the other, with no campaign in the fault controller and no faults in the campaign section. They were resolved as an explicit union and measured:

{1}

The parents are the two accepted identities. Focused tests pass 48/48 across 13 suites. Full pnpm test gives 1404 passes, three failures, 1407 total; all three are resident host-city-launcher occupancy, the N/N−3 baseline.

**The first version measured the wrong head, now corrected:** it merged `rex/REX-803-mech-scenario-runner`, whose tip `a695bb9` is an ancestor of accepted `8798ba9` and **14 commits behind**. Missing commits include the very seed/placement repair `42acdc6` and receipt-order/close repair `07e8c3c`. Mechanically “merge the task branch” would integrate a head that was never accepted.

The rule generalises WBC's B4/F-3 rule to integration:

> **One branch merging into main alone is not evidence that several branches can merge into main together.**

> **“Merge the task branch” is not an integration rule.** The source must be the exact accepted commit recorded in the workbook. The historical scan statement here reports 32 workbooks, one branch tip ahead of its accepted head (JOIN-590, with the additional commit deleting evidence), three behind (MON-902/MON-903/REX-803), and one accepted head on no ref (UI-000). See `reports/INTEGRATION_SOURCE_SWEEP_MECH.md`.

That statement is translated as the canonical page's historical claim, without turning it into a new verification or modifying its facts. Later canonical corrections remain authoritative.

The first full run also had a fourth failure, `tests/relay-s1-tunnel.test.mjs:420`. It was identified as **main's own host-speed-dependent probe**: a 1000 ms window returns 429 at request 21, but the probe sends 30 requests sequentially, so a busy host can miss the window. It disappeared on rerun. The union changed no line of that test or limiter.

### Additional finding: REX-804's test rewrites the evidence it certifies

After the full union suite, tracked state was dirty. Investigation found a defect in **already accepted** REX-804: `tests/rex804-web.test.mjs:9` writes its screenshot into **committed** evidence `evidence/raw/mission-book/REX-804/danger-zone.png`, precisely the evidence referenced by PAPER_MATERIAL_INDEX.md. On the unrepaired head the test gives **one pass, zero failures** while git status shows rewritten evidence, from 141809 to 139403 bytes depending on the runner's browser, fonts, DPI and viewport. **Evidence that changes while being verified is not evidence.** A green test leaving tracked state dirty also breaks the review record's “tracked state clean after testing” premise.

The repair reuses an **existing correct precedent** in this programme: the corresponding REX-803 test writes to `.runtime/evidence/…`, ignored on .gitignore line 2. `repair/REX-804-mech-test-evidence-outside-repo @ 690d723` changes no behavior assertion. After adoption into the union, the merged result was measured:

{2}

Focused tests pass 48/48 and full tests give 1404 passes, three failures, 1407 total; tracked state is CLEAN after both. The same union without repair at 704c518 gives the same 1404/1407, but leaves tracked state dirty.

**“Full-suite green” and “clean tree after the full suite” are separate facts.** Test results are identical in both states; only the repaired state is clean afterward. This host has no REX merge authority (`merge_authority:false`) and no REX merge window. Repair and union branches are **verified proposals awaiting adoption**. Full records: [INTEGRATION_PREFLIGHT.md](../../reports/REX-PROGRAMME/INTEGRATION_PREFLIGHT.md), [TEST_MUTATES_COMMITTED_EVIDENCE.md](../../reports/REX-804/TEST_MUTATES_COMMITTED_EVIDENCE.md), and [INTEGRATION_SOURCE_SWEEP_MECH.md](../../reports/INTEGRATION_SOURCE_SWEEP_MECH.md).
<!-- READING_ACCEPTED_PREFLIGHT_638955B:END -->
'''.format(*fences).replace('SOURCE_SHA',hashlib.sha256(before).hexdigest())
existing=dest.read_text(encoding='utf8');assert 'READING_ACCEPTED_PREFLIGHT_638955B:START' not in existing
dest.write_text(existing+addition,encoding='utf8');assert src.read_bytes()==before
for f in fences:assert f in dest.read_text(encoding='utf8')
print('VERIFIED research README accepted-head preflight update; canonical untouched')
