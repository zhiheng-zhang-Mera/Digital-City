> English reading translation / 英文阅读译本. The [source document](../FORMAL_ACCEPTANCE_Alien.md) remains authoritative for historical facts, status, and evidence. This reader grants no additional task, acceptance, merge, or deployment authority.

# REX-803 Opposite-host formal acceptance

Date: 2026-10-06. Reviewer host: Alien.

## Verdict
**ACCEPTED_EXACT_HEAD**: `8798ba9dd37051626033ad72080b2fad3ff66149`; release `SCENARIO_REPETITION_ENGINE_ACCEPTED`. This is bounded acceptance of the existing technical re-review and the real three-surface campaign. It is not a product-main merge, a global trace FULL claim, or completion of user-intent research.

## Evidence and completion gate
- [Existing technical review](../REVIEW_REPORT.md): after repair, 71 relevant tests PASS and eight independent critic checks PASS, covering cancellation, restart, timeout, partial accounting, seeds, and state/context identity. Intermediate full-suite results are not presented as final immutable-head full-suite results.
- Exact-head hosted CI: push `37423084327`, PR `37423138551`, linkage `37423138558`; every run was individually read through the API and had terminal SUCCESS. [Candidate PR37](https://github.com/zhiheng-zhang-Mera/utopia/pull/37). Candidate Android `testDebugUnitTest assembleDebug` succeeded: 21 suites / 111 tests / 0 failures / 0 errors. APK SHA256: `3b40b8d365a17893e01bdf88b190829f8de609bce3859ef10a7acadf4ca9ed0e`.
- The campaign `campaign-966cf439-7017-4bb0-88e8-981e59c18322`, started by the Mech Owner, completed in City `031fdba6-e94c-4298-a095-6ff04a65481d`. Android PERM00 was the enrolled canonical control surface; execution nodes were assigned Mech / Alien / Mech. Alien independently read three canonical COMPLETED tasks with ordinary MEMBER permissions, without bypassing Owner endpoints.
- [Raw material index](../evidence/MATERIAL_INDEX.md) and [handoff record](../MATERIAL_HANDOFF_MECH.md): publish all 52 records of the collector epoch containing this campaign, 31 canonical campaign/task events, and three measured run receipts. All three runs enter terminal accounting, with no failures, timeouts, exclusions, or warmups; warmup is zero.
- [Independent material checks](../independent-material-checks-Alien.json): 38 passes. The reviewer independently recomputed byte lengths and SHA256 for seven files, task/receipt/event/context bindings, execution windows, monotonic order within a single epoch, and explicit missing/drop/clock declarations, rather than relying only on the author's derived checks. Seeds were also cross-checked through an independent FNV-1a calculation and execution of the exact candidate's `runSeed`: `397343796 / 414121415 / 430899034`, corresponding to worker indices `0 / 1 / 0`.

These results satisfy the workbook's three-surface controlled-campaign and reviewable research trace/material gates on the Alien + Mech + Android topology. The collector's metadata-completeness label measures additional fields and remains PARTIAL; acceptance cannot turn missing observations into observed facts.

## Acceptance boundaries
1. `traceCompleteness: PARTIAL` remains unchanged. All 52 published records lack softwareSha/configRef/providerRef/modelRef/channelRef. The 49 ordinary events lack experimentRef/experimentRunRef; three run receipts carry experiment bindings. Missing fields are not zero, and guessed values must not be supplied.
2. The whole retained window's 197 records are an author envelope declaration and are not published in full. The raw scope independently checked by the reviewer is the campaign epoch's 52 records. Zero drops, storage READY, and no truncation are package declarations consistent with visible fields; they are not an independent exhaustive proof about unpublished records.
3. Mech's resident source SHA is externally bound through the Owner/user update statement and the receipt/manifest. The reviewer did not independently audit a remote PID→source SHA mapping. Per-trace-record provenance null values remain null. An APK build does not prove a fresh installation on the phone.
4. Recorded local capture time differences are not proof of cross-host clock synchronization or a network-latency benchmark. Unobserved optional metrics remain null/NOT_MEASURED; Web reachability remains PARTIAL and intent validation NOT_TESTED. Native Android campaign UI is left to REX-807.
5. The new Alien enrollment was created at `2026-10-06T07:29:19.058Z`. Earlier offline/retired identity records remain preserved; the new identity must not be described as continuously online during the preceding two days. The material index's attribution of the earlier 195-record count to Alien is also invalid: Alien MEMBER cannot read Owner trace, and that count comes from an earlier author report.

## Record reconciliation
The individual workbook, programme board, main board, and Capability Registry are reconciled to this verdict. REX-805 may be claimed under the existing dependency rules. No new programme is activated, SHOW is not executed, and no additional product-main merge authority is granted.

## Material layout follow-up
Remote commit `caa15be` moved the export and verification methods to evidence-tools without changing the bytes of the six raw data files. The 38 independent results above bind the `f3fb731` layout, where the seventh file was the exporter. Alien additionally ran the author's other verifier on the current six-file payload: 22/22 PASS. The author-provided verifier is not a replacement for independent review. The 38 reviewer results stay at the report layer, outside the raw payload with its fixed hash index. The verifier's successful output still says all7, while the actual list/directory check is 6/6. This is stale display text, not evidence of the file count.
