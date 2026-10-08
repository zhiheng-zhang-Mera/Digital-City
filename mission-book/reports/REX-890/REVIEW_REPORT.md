# REX-890 最终异机复检 / Final opposite-host review

Reviewer: **Alien-GPT / Mera-Alianware**, 2026-10-08 Australia/Sydney. Development host: Mech / Mega-rep. Authority: independent opposite-host review, not a development-host rehearsal and not an Owner ruling.

## 结论 / Verdict

**独立复现 PASS**：原始输出 exit 0，`inconsistencies=[]`、`evidenceGaps=[]`、`reproductionComplete=true`。Final gate 第①项成立。第②项 exact-head hosted CI success。两条能力的独立 exposure 技术复核通过；Owner 已明确回复“批准 exposure PASS，并完成收尾”；三项最终门槛均成立，工作书 COMPLETE，终标已释放。参见 [Owner 裁决](OWNER_EXPOSURE_RULING_2026-10-08.md)。

Independent reproduction passes; exact-head hosted CI passes. Independent technical exposure review passes within the stated Web/CLI scope. The Owner explicitly approved exposure PASS and closeout. All three gates are met; the workbook is COMPLETE and the terminal marker is released. See the recorded Owner ruling.

## 冻结身份与交接完整性 / Frozen identities and transfer integrity

- Reviewed implementation: `0e63c2a0ca723f7d8d0b6ad41abff33bee2ea744`, observed by the harness from its own Git checkout; `treeClean=true`. No implementation changes were made during this final review.
- Hosted implementation CI: [37731833084](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37731833084), API readback `completed / success`, exact head above.
- Review records baseline: Digital-City `043e94f3` (full identity in `evidence/final-provenance.json`).
- Transfer: all **39** top-level manifest entries match; Git bundle verifies with complete history and head `0e63c2a…`. Credential content and its checksum are deliberately excluded from public evidence.
- City: `544adda1-3059-4c6f-ae7d-71ddfd0f3b8c`, endpoint `http://172.31.12.151:4310`. City runtime source SHA is **not independently observed**; source checkout SHA, live canonical City identity, and live capability observations are separate facts.
- Original Alien installation retained: `dev-1428bce5297146df88720f270af71bc3`. A valid existing member enrollment reopened a session and restored its agent. No new installation identity was substituted; global host selection for other work was not rewritten.

## 实体重建、重算与独立执行 / Physical reproduction

Raw report: [opposite-host-reproduction.json](evidence/reproduction-1/opposite-host-reproduction.json). CLI output: [reproduction-1.log](evidence/reproduction-1.log).

| Element | Independently observed on Alien |
| --- | --- |
| Readiness | 7/7; package checksums 12/12, external manifest 13/13, package trace listed=captured=243 |
| Rebuilt dataset | 205 run references joined from 41 City receipts fetched by id |
| Completion time | Median **6630 ms**, n=205, matches package |
| Failure rate | 0, n=205, matches package; no general reliability claim |
| Duplicate execution count | 0, matches package |
| Convergence missing event count | 0, matches package |
| Canonical pointers | 214/214 present; 205/205 run-to-task joins resolve |
| Trace/provenance | 243/243 trace ids resolved from durable City storage; 0 in retained window; package carries all 243 records independently |
| Independent campaign | `campaign-c9e58518-7a82-418c-a099-649d0e03f0d4`, COMPLETED, six MEASURED runs with task state COMPLETED |
| Real execution devices | Three runs on Alien `dev-1428bce5…`, three on Mega-rep `dev-544adda1…` |
| Comparison result | 0 inconsistencies, 0 evidence gaps, reproductionComplete=true, exit 0 |

23 of 27 metrics remain NOT_MEASURED with their reasons. The package's 40 experiment pointers and 2291 event pointers are listed by the instrument; this review does **not** claim individual dereference verification of those two entire pointer sets. The load-bearing receipt/task/trace joins above were actually checked.

## 证伪与修复后复现 / Falsification and reproduction after repair

The earlier Alien repair `205d7b2…` was adopted by Mech and corrected against real campaign vocabulary (MEASURED run state versus COMPLETED canonical task state). This final run reviews the resulting frozen `0e63c2a…` code, not the older repair in isolation.

[Falsification log](evidence/falsification.log): **4/4**. Altered metric with refreshed checksums gives exit 1 and a named metric disagreement; altered dataset with refreshed checksums leaves City-recomputed median at 6630 and gives exit 0; stale metrics checksum gives exit 1 and BROKEN integrity. The healthy-metric B control independently completed another six-run two-device campaign `campaign-602bc48a-10af-40d4-a2ca-0be10a30a9a2` with `reproductionComplete=true` ([raw report](evidence/falsification/B-dataset-tamper-out/opposite-host-reproduction.json)). Deliberate tamper cases are controls, not product failures, and their outputs are retained.

## 两条跨机通道 / Both cross-machine channels

- [Cross-host verification](evidence/cross-host-verification.json): **7/7**. The Mech City dispatched to Alien; canonical task `Q-1061fde1-9354-4f31-b0ef-ee42e62d7ecb` COMPLETED, exitCode 0, receipt.valid=true and acceptanceAuthority=false. Program output independently identifies `Mera-Alianware` and `0e63c2a…`. Real member session GET operations/jobs and POST owner remote operation each return 403.
- [Agent-job lifecycle](evidence/agent-job-lifecycle.json): directed job `Q-85be5da7-d1a5-43d6-83c2-f32b1ca4759c` was claimed only after stopping the temporary reference poller. It was reported SUCCEEDED / OBSERVED_HERE with hashes computed from actual local artifacts. Canonical state COMPLETED; report validation valid=true, **acceptanceAuthority=false**, `AGENT_OBSERVATION_NOT_CITY_VERIFICATION`. Owner collection changed AWAITING_COLLECTION to COLLECTED and repeated acknowledgement was idempotent. **Collection is ACKNOWLEDGEMENT_NOT_VERIFICATION**; the Owner credential holder acknowledged delivery here, not an independently observed human read on Mech.
- Member runtime restored from reviewed source after reporting; PID/startup evidence is retained. It is a running hidden process, **not a newly installed scheduled task or reboot-persistence guarantee**.

## 本地验证与限制 / Validation and limits

- Full root suite: **2043 tests / 2039 pass / 1 fail / 3 skipped**, exit 1, 282628 ms. [Full output](evidence/full-tests.log) retained. Do not call this run green.
- Failure: `contracts/general-ai-registry-v1/tests/conformance.test.mjs:696`, “RS-201: the bound HOLDS - a probe that never answers cannot block the caller”, observed 3667 ms. Subsequent isolated **whole contract suite 43/43**, with this case at **40.0562 ms** ([retry](evidence/registry-retry.log)). This supports a load-sensitive timing finding; it does not erase the first failure or prove a universal bound under load.
- Three skips remain as recorded in full output; no skip is promoted to PASS. Exact-head hosted CI provides separate clean-runner evidence.
- Live owner pages were opened in a real headless Edge browser against the real Mech City; both entries exist, live enabled/default classification is visible, empty confirmation disables dispatch, and Settings remains reachable. See [UI observations](evidence/live-ui-review.json) and screenshots.
- Android has no remote-operation or agent-job entry and natural-language intent is NOT_TESTED. Accepted technical scope is **Web Advanced + the stated CLI seam**, not Android parity or natural-language control. The executable allowlist contains a general-purpose runtime; it is not a sandbox. Live workspace roots remain broad (`C:/`, `D:/`), as disclosed.

## Final gate disposition

1. Opposite-host physical reproduction: **PASS**, established here.
2. Exact-head hosted CI: **PASS**, head/run binding independently read.
3. Independent technical exposure review: **PASS WITH DECLARED SCOPE**, [EXPOSURE_REVIEW_ALIEN.md](EXPOSURE_REVIEW_ALIEN.md); explicit Owner exposure ruling: **PASS**, [actual approval](OWNER_EXPOSURE_RULING_2026-10-08.md).

Owner-authorized closeout records the review refs and exact fields, releases `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE`, and archives the canonical workbook and English mirror. Derived progress/navigation are regenerated and checked. This closes REX-890; programme final integration remains a separate future task.
