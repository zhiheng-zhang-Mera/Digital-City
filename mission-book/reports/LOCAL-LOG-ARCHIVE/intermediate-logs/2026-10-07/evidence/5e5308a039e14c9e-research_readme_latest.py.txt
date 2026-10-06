import pathlib,re,os
root=pathlib.Path('\\\\?\\D:\\Digital-City-REX-20261006');p=root/'mission-book/research-strengthening/en/README.md';src=p.parent.parent/'README.md';before=src.read_bytes();old=p.read_text(encoding='utf8')
append='''

<!-- READING_MAIN_B484663:START -->
## Current pool recheck — canonical acceptance update

Reading translation of the latest [canonical programme page](../README.md). Earlier pending, disconnected, and NOT_PASSED sections in this reading copy remain dated history. Current authority is the individual canonical workbook and formal acceptance report, including any later claim state.

Alien formally accepted REX-803 at exact8798ba9 after reviewing technical rechecks and the three-end campaign raw material. SCENARIO_REPETITION_ENGINE_ACCEPTED is released; trace metadata remains PARTIAL. REX-804 is accepted at exactfe700aba. REX-805 may be claimed against accepted dependencies; REX-806/807/890 continue waiting under their workbook dependencies. SHOW is not executed; parked/new programmes are not activated. Earlier sections are dated history.

### REX-803 three-end completion gate: MET on the real City

```text
WHEN        2026-10-06T08:01Z, resident City updated to 8798ba9 with its data directory retained.
BLOCKER     The recorded measurement identified a stale manifest identity, rather than an absent opposite host:
            earlier attempts declared alien-reference-node, used on Alien on 2026-10-05 and already offline;
            the same machine was online under canonical enrolled identity
            dev-8128a1ef25c5c4b7f66fc31b21705858 (Alien-MERA-ALIANWARE).
            This generalises F8: manifests must declare identities the City ACTUALLY reports;
            remembered names become stale. The later formal acceptance below bounds the enrollment timing.
CAMPAIGN    campaign-966cf439-7017-4bb0-88e8-981e59c18322, COMPLETED (REPETITIONS_FINISHED).
            TWO_HOST_MESH: hosts/workers = [Mech dev-031fdba6…, Alien dev-8128a1ef…],
            controlSurface = Android PERM00 dev-be7832e35….
  run 0     MEASURED, placed on dev-031fdba6… (Mech), task Q-be723362-…
  run 1     MEASURED, placed on dev-8128a1ef… (Alien), task Q-f78eaee3-…;
            executed and measured on the OPPOSITE host.
  run 2     MEASURED, placed on dev-031fdba6… (Mech), task Q-697aab2c-…
  summary   planned 3 / accounted 3 / measured 3 / timedOut 0 / failed 0 /
            terminalAccountingComplete true. Each placement was predicted before running from runSeed,
            and each actual placement matched.
MATERIAL    All three canonical tasks are COMPLETED and carry researchRunRef. Research trace records
            RESEARCH_CAMPAIGN_STARTED @2026-10-06T08:00:39.601Z, storageState READY,
            completeness PARTIAL explicitly retained. Immutable receipt campaign-966cf439-…json
            persisted in <runtime>/research/campaigns/.
EVIDENCE    Published cross-host-verifiable redacted package: six data files plus index, byte-identical
            immutable receipt, trace epoch snapshot, explicit missing/dropped/clock explanations for
            PARTIAL, and derived checks recomputed from package files. Generator and second implementation
            are outside the payload in evidence-tools/.
            reports/REX-803/evidence/MATERIAL_INDEX.md (+ MATERIAL_HANDOFF_MECH.md).
            Earlier local-only JSON references D:/utopia-chat/evidence/REX-803/… also remain.
            Full record: reports/REX-803/THREE_END_GATE_MEASUREMENT.md.
NOT CLAIMED At this measurement the terminal marker was unreleased. Formal Review belongs to the opposite
            physical host; the author does not issue its verdict and only delivers evidence.
```

The three-end controlled campaign ran on the live City across Mech + Alien + Android, with all three repetitions measured, including the opposite Alien worker. Every canonical task completed with researchRunRef; the trace recorded the campaign and the immutable receipt was filed. The measurement generalised F8: the manifest must use City-reported identities instead of the stale alien-reference-node name. Its historical wording about the two-day blocker is preserved as a measurement account; the subsequent formal acceptance explicitly corrects any inference of two days of continuous enrollment.

The reviewer's blocking condition was that raw material existed only on this host's drive while a MEMBER session correctly refused Owner-scoped endpoints. The published hash-bound package under reports/REX-803/evidence/ answers that condition: redacted raw JSON, byte-identical immutable receipt, complete collector epoch containing the campaign, per-file SHA256, and missing/dropped/clock reasons for PARTIAL recomputed from the collector predicate. The generator and arithmetic independently derive each seed and placement from the package alone. At that handoff the author did not release the marker or substitute for the opposite-host verdict.

### REX-803 formal acceptance

Alien formally accepts exact8798ba9 after 38 independent material checks. All three seeds and execution-node placements align with the raw receipt, canonical tasks, and trace. PARTIAL trace metadata, the unpublished global 197-record raw window, missing provenance, and NOT_TESTED intent validation remain explicit. The fresh enrollment began at 07:29; it must not be described as continuously online for the preceding two days. See [FORMAL_ACCEPTANCE_Alien.md](../../reports/REX-803/FORMAL_ACCEPTANCE_Alien.md).

### REX integration preflight: each product merges cleanly alone, together they do not

Waiting until after REX-803 acceptance to attempt the first integration would leave conflicts until the least convenient time. Integration was therefore measured first. Section 11 requires starting from the then-latest main; this round began at b06504f.

```text
rex/REX-804-Alien-codex-faults   -> main alone    CLEAN
rex/REX-803-mech-scenario-runner -> main alone    CLEAN
both together                                  CONFLICT x2, both in services/dev-gateway/server.mjs
```

Both conflicts are the union/superset case explicitly named in section 11. Neither side references the other: the fault controller contains no campaign, and the campaign section contains no faults. They were resolved as an explicit union and measured:

```text
integration/REX-803-804-mech-preflight @ cd43572
  focused  tests/rex803-*. + rex804-*.   34 pass / 0 fail
  full     pnpm test                    1390 pass / 3 fail
                                       (all three are resident host-city-launcher occupancy, N/N-3 baseline)
```

The rule generalises the WBC B4/F-3 rule to integration:

> A branch that merges cleanly into main on its own does not constitute evidence that several branches can merge into main together.

### Additional finding: REX-804's test rewrites the evidence it certifies

The union's full suite left the tracked tree dirty. Investigation identified a defect in the already accepted REX-804: tests/rex804-web.test.mjs:9 writes its screenshot to the committed evidence path evidence/raw/mission-book/REX-804/danger-zone.png, the exact evidence referenced by PAPER_MATERIAL_INDEX.md. On the unrepaired head the test measured 1 pass / 0 fail while git status showed that evidence rewritten, from 141809 to 139403 bytes, dependent on the runner's browser, fonts, DPI, and viewport. **Evidence that changes when it is verified is not evidence.** A green test that leaves the tree dirty also breaks the review record's premise that tracked state is clean after testing.

The repair reuses an existing correct precedent in the same programme: the analogous REX-803 test already writes to .runtime/evidence/…, ignored by .gitignore line 2. The repair branch repair/REX-804-mech-test-evidence-outside-repo @ 690d723 changes no behavior assertion. After incorporating it into the union, the merge result was measured:

```text
integration/REX-803-804-mech-preflight-with-evidence-repair @ 0492dfd
  focused  tests/rex803-*. + rex804-*.   34 pass / 0 fail, CLEAN after running
  full     pnpm test                    1390 pass / 3 fail, CLEAN after running
                                       (same 1390/3 before repair, but formerly dirty after running)
```

**A green full suite and a clean tree after the full suite are separate facts.** This host has neither REX merge authority nor an REX merge window. Both repair and union branches are verified proposals awaiting adoption. Full records: [INTEGRATION_PREFLIGHT.md](../../reports/REX-PROGRAMME/INTEGRATION_PREFLIGHT.md) and [TEST_MUTATES_COMMITTED_EVIDENCE.md](../../reports/REX-804/TEST_MUTATES_COMMITTED_EVIDENCE.md).
<!-- READING_MAIN_B484663:END -->
'''
assert '<!-- READING_MAIN_B484663:START -->' not in old
p.write_text(old+append,encoding='utf8');assert src.read_bytes()==before
for link in re.findall(r'\]\(([^)]+)\)',append):
 if not link.startswith(('https:','http:','#')):assert pathlib.Path(os.path.normpath(str(p.parent/link))).exists(),link
print('VERIFIED latest README additions; canonical unchanged; links valid')
