# Alien-codex cloud branch integration record

Reading translation / 阅读译本：Complete historical reading translation, not a second authoritative record. Historical status, failures, and evidence boundaries are preserved.

Role: Alien-codex. Owner authorization: verify first, merge oldest to newest, archive historical branches after preserving traceable SHAs, then claim construction work.

All exact-HEAD checks for PR10 (`48cbc21376007c5461e8e456a898c3f788f0fa77`) succeeded. It merged as `699f7c178b630b6ef447e755ceeb6699f1223d6b`; merge-head CI37203077196 is still running, and PR11 proceeds after its terminal result. PR11 now uses the main baseline; all checks on its previous exact implementation HEAD `be6227ec49d4dbcd83a595d7b265766af2083421` succeeded.

Decision: use merge commits to preserve historical ancestry, without squashing recorded baseline SHAs. Delete integrated cloud branches after creating immutable archive tags and a branch→full-SHA index; retain local workspaces. Audit uncontained branches first, never delete them based solely on names.

Findings: JOIN-503 review authorization repairs and tests are already included in the current implementation; do not overwrite server. JOIN-501 and JOIN-502 independent probes require test compatibility checking. Three old device-pilot fixes include unintegrated test tooling. MESH review/UI candidates contain historical evidence/directions and should not directly overwrite the final product.

Environment issue: creation of the new Digital-City long-path workspace failed. The shorter D:/DC-Alien path succeeded after enabling Git core.longpaths; the original workspace was not deleted. Current Digital baseline2574fa7 is used only for scanning; fetch latest main again before claiming.

Construction candidates: CEX-701/704, WBC-601, REX-801/802 and others READY. None claimed yet. Decide again from latest frontmatter and exact ancestry after cloud integration completes.

## Merge and historical-tool audit

After PR10 merged, CI37203077196 succeeded. PR11 merged as `612c344f9f2b06a67b2645b4662d97750dd7c44e`, and its merged-main CI37203397283 succeeded. All31 historical branches have cloud tags archive/2026-10-04/<original-branch>. Tags' SHAs were checked and25 integrated or purely historical cloud heads conditionally removed; local workspaces are retained. Full SHAs/classification: ARCHIVE_INDEX.json.

UI000 candidate is directional evidence preceding final UI; do not roll back the current product. Two MESH review/evidence branches contain large historical samples: archive only, do not copy into the current product tree. JOIN503 authorization repairs/tests already exist in current main; do not overwrite again.

PR12 integrates old pilot tooling, JOIN501/502 independent probes, and UXI301 procedures correcting erroneous premises. Resolve two pilot conflicts by union: retain current observation sequence and strayAgent count, incorporate process-identity/interface-route repairs. Technical review found three real issues: selector not exported; weak/unavailable process identity still allowed kill; reconnect probe did not actually close the socket. Each repaired, with red/green records retained in local Utopia/.runtime/history-audit. A new route regression incorrectly assumed numeric coordinates; corrected to the existing ADB string contract and retained that failure. Final focused tests35/35 passed, independent local technical review has no remaining blocker. This is not cross-physical-host Formal Review.

UXI301 additions record historical FAIL/ERROR and method correction, without claiming successful current handoff. Limits of fixed-fixture state and time-proxy metrics are retained. Exact final PR12 pipeline is pending; merge and revalidate main after terminal completion.

PR12 implementation `0a5e9ba53772a1b01897c2edf34de3840de7c629`, push CI37203861869 terminal success: Gateway/Web1242/1242; Rooms69/69; City1970 passed/14 skipped/0 failed; Android and documentation PASS. PR CI remains pending. Additional scan found integration/join-502-nearby also contained, appended its archive tag, and removed it against its original SHA. Total now32 historical tags and26 removed historical heads.

## Pre-construction stage results

PR12 push/PR CI37203861869/37203864170 both succeeded; merged as `40e18db4a6cf5bba1490181a473bc62e681edb8a`. All32 original historical branches plus this integration branch have cloud tags/full-SHA index and were conditionally removed; only main remains as a cloud head. Merged-main CI37204279336 is queued/running and still requires terminal verification; candidate CI does not replace it.

Under standing rule §4 no-idle, after the exact candidate HEAD is green and integration/archive complete, proceed to legitimate construction claiming while watching merged-main CI. Select CEX-701: build on accepted device-identity backend, repair lost recovery/conflict information, and directly serve the newly completed multi-member usage path. No paid provider or new canonical registry is required. Other READY tasks such as WBC/REX remain unoccupied. Fetch both repositories again and verify workbook ancestry/dependencies/claim before claiming.

## Post-merge failure and recovery

First merged-main CI37204279336 at `40e18db4a6cf5bba1490181a473bc62e681edb8a` yielded1241/1242; Windows CIM scan exceeded30s. Same-SHA attempt2 terminal success; negative log retained at Utopia/.runtime/evidence/mission-book/CEX-701/merged-main-ci-failure.log. Separate PR13 retries a complete process/port observation once after timeout; persistent/non-timeout errors still refuse startup. Review found mixed-error masking, followed by repair/tests and7/7 red/green checks. Exact HEAD `3bab6bdc78c18467645f3fb88272dab7a86f8a0d` push/PR CI both succeeded; merged as `0e9bea3ce739b979e582a428af8fb233045a5e75`. Subsequent merged-main terminal result still pending. CEX701 explicitly unioned this accepted repair without changing original claim baseline.

PR13 merged-main revalidation: CI37205444427 success, exact head `0e9bea3ce739b979e582a428af8fb233045a5e75`. First earlier main inventory timeout remains retained; retry repair never converts unknown inventory into empty success.

语言配对 / Language pair: [原文 / Source](../DECISIONS.md)
