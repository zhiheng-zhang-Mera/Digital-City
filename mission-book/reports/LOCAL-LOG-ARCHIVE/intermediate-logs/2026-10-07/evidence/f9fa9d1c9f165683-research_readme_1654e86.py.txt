import pathlib,re,hashlib,os
root=pathlib.Path('\\\\?\\D:\\Digital-City-REX-20261006');src=root/'mission-book/research-strengthening/README.md';dest=src.parent/'en/README.md';before=src.read_bytes();s=before.decode('utf8').replace('\r\n','\n')
tail=s[s.index('### REX-805 实体开发门槛'):];fences=re.findall(r'```[^\n]*\n[\s\S]*?```',tail);assert len(fences)==1
mark='<!-- READING_REX805_PHYSICAL_FINAL_1654E86:START -->';existing=dest.read_text(encoding='utf8');assert mark not in existing
addition='''

<!-- READING_REX805_PHYSICAL_FINAL_1654E86:START -->
## REX-805 development handover and final physical repetition — latest reading snapshot

This is the complete reading translation of the latest physical-development-gate and author-handover sections in the [canonical programme page](../README.md), source SHA256 `SOURCE_SHA`. Earlier candidate, pending and predecessor-only accounts in this reading page remain dated history. The final `0261a9e` physical repetition below supersedes the predecessor-only observation gap. Current authority and completion flags belong to the [canonical REX-805 workbook](../REX-805-trace-replay-and-ablation.md); evidence of Development is not a formal opposite-host acceptance verdict.

### REX-805 physical development gate: executed on the live City

In author commit `7ad7d19`, [PHYSICAL_GATE_HANDOFF_Alien.md](../../reports/REX-805/PHYSICAL_GATE_HANDOFF_Alien.md) delegated execution of the development gate to this host. This host followed the handover, executed the gate and returned the material.

{0}

Full translation of the measurement record:

- **When:** two runs on 2026-10-06, before the author's repair at `4b39468` and again after repair at `0261a9e`. Both used the resident City, retained its data directory and kept device identities unchanged.
- **Deployment:** `4b39468` ran as pid 33420; `0261a9e` as pid 44088. Both pointed at City `031fdba6-e94c-4298-a095-6ff04a65481d`. Before deployment, the resident City ran old candidate `8798ba9`, where research/replays returned 404; after each deployment it returned 200.
- **Source:** campaign-966cf439-… run 1, seed 414121415, original worker Alien; both measurements use the same source.
- **Replay:** at `4b39468`, campaign-4a1919b0-… placed on Alien; at `0261a9e`, campaign-cdf39b7f-… also placed on Alien.
- **Ablation:** at `4b39468`, campaign-bad9f272-… placed on Mech; at `0261a9e`, campaign-481a1761-… also placed on Mech.
- **Both runs:** MEASURED, controlledInputsMatch=true, differences=[], and ablation placementChanged=true. The three seeds agree. All executions are real: actual workers and actual canonical tasks, all COMPLETED.
- **What the executing host does not claim:** Development completion, acceptance or merge authority. It only returns the gate material for the author to verify.
- **Evidence:** [evidence/](../../reports/REX-805/evidence/) for `4b39468` and [evidence-repaired/](../../reports/REX-805/evidence-repaired/) for `0261a9e`, with per-file SHA256. Three receipts are byte-for-byte copies of City bytes. The shared source receipt has the same hash in both packages and in the REX-803 package.
- **Result record:** [PHYSICAL_GATE_RESULT_Mech.md](../../reports/REX-805/PHYSICAL_GATE_RESULT_Mech.md).

**The limits correction chain must remain explicit.** This host's synthetic-source instrument reported controlledInputDifferences:['limits']. The first physical run used nonempty limits and did not expose it, so this host's material index classified it as “belonging to the synthetic fixture.” The author subsequently repaired empty-limit sets at `0261a9e`, addressing the canonical difference between `{{}}` and null, and added regressions. That proves the defect was real and general. This host's earlier conclusion was too broad and is corrected in its result record: the synthetic fixture triggered a real defect, while the physical source did not cover that branch.

### REX-805 author handover

The latest author-delivered candidate is `0261a9ed1cec88df3ab4675623d422b37b33f270`, with three successful exact-head CI runs and an independent code re-review passing. The author independently checked predecessor `4b39468`'s physical material **63/63**. The final repair addresses null versus `{{}}` comparison where no extra bounds exist. The measured predecessor path with nonempty bounds remains a bounded basis for Development.

The initial handover did **not** claim observation of the final candidate's physical deployment. That was the historical predecessor-only gap at the moment of that handover, and is superseded by the final repetition below. The handover records Development **5/8**, Formal Review **4/8**, and accepted tasks **4/8**. REX-805 remains IN_PROGRESS, formal review_host is null, and its terminal marker is unreleased. See [DEVELOPMENT_HANDOFF.md](../../reports/REX-805/DEVELOPMENT_HANDOFF.md) and [PAPER_MATERIAL_INDEX.md](../../reports/REX-805/PAPER_MATERIAL_INDEX.md).

The earlier inference “the limits difference belongs to the synthetic fixture” is limited to that physical source with maxFailures=3. The author separately reproduced and repaired the false mismatch using a real HTTP source with no extra bounds; that inference must not be generalized to every real campaign.

**Author's subsequent update:** the final `0261a9e` physical repetition now has **63/63 raw-package checks**, plus independent reconciliation of canonical tasks through an ordinary MEMBER session. This supersedes the predecessor-only gap. Formal opposite-host Review still awaits claim and verdict. The earlier absence of final-head observation is historical, not the current physical-gate state.
<!-- READING_REX805_PHYSICAL_FINAL_1654E86:END -->
'''.format(*fences).replace('SOURCE_SHA',hashlib.sha256(before).hexdigest())
notice='''> **Reading chronology:** this page retains earlier programme and candidate snapshots. The [latest REX-805 physical-development and author-handover update](#rex-805-development-handover-and-final-physical-repetition--latest-reading-snapshot) records final `0261a9e` repetition and supersedes earlier predecessor-only/no-final-observation accounts. Canonical workbooks determine current state; no earlier pending statement should be read as a newer verdict.

'''
first,rest=existing.split('\n',1);updated=first+'\n\n'+notice+rest+addition
for f in fences:assert f in updated
for sha in re.findall(r'\b[0-9a-f]{40,64}\b',tail):assert sha in addition
for link in re.findall(r'\]\(([^)]+)\)',updated):
 if not link.startswith(('http:','https:','#')):assert pathlib.Path(os.path.normpath(str(dest.parent/link.split('#')[0]))).exists(),link
assert src.read_bytes()==before;dest.write_text(updated,encoding='utf8');assert src.read_bytes()==before
assert not updated.startswith('---');print('VERIFIED latest physical gate + author handover full translation; 1 evidence fence, full SHA, all links; canonical bytes unchanged')
