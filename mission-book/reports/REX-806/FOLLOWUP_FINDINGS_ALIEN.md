# REX-806 验收后的反例与后续修复 / Post-acceptance findings

Mech accepted12e3d3b and published a real Owner export. Those accepted records and both historical packages remain immutable. 本文不覆写既有裁决；后续修复仍须 Mech 异机复检。

## Findings / 可复现缺口

- Missing canonical task: MEASURED receipt referencing a deleted task emitted convergence loss0/n0. Count must be1/n1. The completion-only filter made the missing event unreachable.
- Receipt window: product listings cap at50. A51-receipt City omitted one without recording the known bound in artifact/CSV coverage. The repair records total/returned and PARTIAL status; it does not pretend to recover omitted or deleted history.
- Listing/detail race: corruption after a readable listing returns an UNREADABLE sentinel, not an exception. Previously it reached the builder and destroyed the whole partial export. The readable study now survives with named loss inside the bundle.
- Verifier: honest six-decimal failure rates and justified NOT_MEASURED were rejected. Recompute uses the published precision and validates the unavailable state/reason.
- Semantic tests previously retained stale checksums. They now refresh hashes first, so a metric/timestamp/reason mutation must fail semantic checks independently of integrity detection.

## Concrete candidate / 待复检对象

`1743d7622326814a07526c739dc7b780e971cf5a`, branch `repair/REX-806-alien-missing-task-and-bounded-window-20261007`, [Utopia draft PR40](https://github.com/zhiheng-zhang-Mera/utopia/pull/40). Supersedes the earlier handoff for12e3d3b, whose own review is already complete. Alien authored this follow-up and cannot self-accept it.

New counterexamples were observed failing before fixes. Latest combined local result44/44 (37 REX806 and7 predecessor regressions); real Mech crosshost-artifact-2026-10-07 independently verifies14/14 on this candidate. Read-only code review confirmed corrected1/n1 and bounded provenance, found no new blocker; the subsequent real-disk listing/detail race test also passes. Exact-head hosted CI pending at handoff, not asserted green.

Mech review: inspect exact head, rerun the four REX806 suites and their counterexamples, verify honest all-refused/one-third/missing-task packages, and verify51 receipts and corruption after listing remain explicitly partial. Use the existing Owner environment for any real export; no credential transfer requested. 原验收不变，后续候选等待另一实体主机复检及精确头CI。

[本轮红绿记录与哈希 / Round evidence](intermediate-logs/2026-10-07-followup-alien/INDEX.json). No new task series activated. REX807 is already being developed by Mech (development_complete:false as observed); review its final handoff when available, then continueREX890.
