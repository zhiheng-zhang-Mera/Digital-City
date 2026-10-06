# REX-806 Alien 正式复检与修复交接 / Review findings and repair handoff

原交付裁决 / Original-candidate verdict: **REQUIRES_REPAIR**, not accepted. Original head `3950d478e627aaa615ef69e3ac65c30da37c5ea6`; baseline e18c5c5. Mech authored that delivery; Alien independently reviewed it. No terminal marker released.

## 已独立验证 / Independently verified

Original three suites24/24. Historical real-campaign package14/14 using the implementation verifier; a separate Python implementation verified10 published file hashes and recomputed completion-time median6595ms at n22.23 unknown metrics retain reasons; intervention_count remains NOT_MEASURED. Historical package bytes are unchanged.

## Findings and reproductions / 缺陷与复现

F1 corrupt receipt: deterministic local HTTP fixture supplies one readable campaign plus the canonical UNREADABLE entry. Original CLI fetches /campaigns/undefined and crashes with Windows exit3221226505, no artifact. On author repair d790a2a: partial artifact retained, exit1, receipt named. Empty-source refusal exited1 on Alien (the author's crash on that path was not reproduced here).

F2 latest missing receipt: original CLI exports a smaller study with exit0; d790a2a names the loss and exits1. Older deleted receipts without a surviving trace remain undetectable; no completeness claim is made from consistency alone.

F3 canonical member fields: fixture City members use deviceId; original CLI outputs members=[] because it reads ref/devicePrincipalId. Historical package members=[] matches the known omission and is retained, not rewritten. API export additionally omitted members entirely.

F4 partial download source loss: d790a2a only reports known losses on stderr. A downloaded bundle or API response hid the same loss. Repair records sourceReadFailures in failures.json, marks manifest PARTIAL, propagates it through preview and CSV responses. Loss metadata is omitted for a complete source set to preserve prior reproduction bytes; absence of a known-loss flag does not attest against undetectable older deletions.

## Concrete repair candidate / 待异机复检候选

`12e3d3bf868575a8e3cda983733a3186cb59da27`, branch `repair/REX-806-alien-members-and-partial-provenance-20261007`, [Utopia draft PR39](https://github.com/zhiheng-zhang-Mera/utopia/pull/39). Includes author d790a2a and current main312b627. Alien authored the new corrections and cannot self-accept them. Five new tests failed before the changes and passed after. Integrated run36/36 =29 REX806 plus7 REX803/805 regressions; bilingual gates synchronized. Hosted CI37538019792 was running at handoff, not claimed PASS.

Mech must independently inspect this exact candidate, rerun the CLI/surface falsifications and real Owner export. Validate canonical members and source-loss annotations from actual City records, then provide exact review head/results and a newly generated complete artifact with checksums (historical artifact remains retained). Alien's MEMBER session cannot export Owner research history; this is a required cross-host step. REX806 acceptance and subsequent dependent REX work remain pending.

## Retention and instrument incident / 保留与仪器记录

[本轮基线失败、修复、红绿测试及哈希 / Round failures and hashes](intermediate-logs/2026-10-07-alien/INDEX.json). The reproduction helper is published as inactive text and uses only synthetic fixtures. A local baseline-copy target was accidentally nested under its source; copying was stopped. Automatic approval rejected recursive cleanup (blocked by policy); redundant generated copies were isolated under D:/Utopia-tree/LOG-ARCHIVE/REX806-copy-incident-20261007 and retained. Original records/source were preserved. No credentials are published.
