# REX-990 independent review and corrections

Fresh-context reviewer: independent `programme_review` agent. Code-review skill explicitly required delegation before merge. Development host is Mera-Alianware; independent review executed source identity and selected tests on **the other physical host Mega-rep**, in isolated `D:/Utopia-REX-final-review-20261008`, using existing authenticated canonical remote-operation controls. Hosted CI is additional evidence and is not counted as this second physical host.

Review base `db6b6f9dbba1266d6783774d659d4eef912929ff`; final tested code `0a4091c7592b964561e2327a576ffd4fd03e88e8`. Reviewer independently found five Important defect categories before root repaired them:

1. Generic task cancel/provider-choice/switch-declined let unrelated members alter Owner tasks. Added Owner-task authorization before reads/mutations; node claim/report remains separately authorized.
2. Shared city/tasks/actions/events/live streams exposed private Owner input/results despite owner-only dedicated logs. Removed Owner content from member projections and gated detail routes/streams. A second independent reproduction found REFUSED Actions without task IDs still leaked because Action operation is under `target.operation`; fixed with retained RED/GREEN regression.
3. Web lost-response retries used new keys and created duplicate real tasks. The reviewer forwarded a request then discarded its response, independently observing two executions. Both Web forms now retain keys across uncertain transport retries, clear them on definite responses/edits, and mint new keys for subsequent confirmed actions.
4. Android omitted expiration and target refusal detail. The UI now displays deadline projection and actual target explanation beside canonical state; no state rewrite.
5. Owner-shaped text inference overrode explicit manual selections of existing tools/tasks. Explicit unrelated selections now fall through to the original router.

Root also reproduced and repaired stale Web Ask drafts/in-flight replies across credentials, and Android reuse of a completed dispatch key. All fixes have focused RED→GREEN evidence in the retained execution ledger and logs. Minor guide clarification (comma-separated configuration values) was fixed; no findings deferred.

Final independent physical-host task `Q-35baaf1c-0177-438d-b998-87f68e167d78`, action `A-45405530-7f83-4490-905f-ad28b6702a79`: COMPLETED, exit 0, no timeout/truncation. Actual hostname Mega-rep, Node 24.14.0, exact SHA and clean tree before/after; **41/41 tests PASS**. Six LF-normalized source hashes matched. The independent reviewer checked later guide-only commits through final candidate `27b901d37134df5923695349eebe9d8aedbe1255`; behavior remains byte-identical, and no test rerun at a documentation-only head is claimed.

Final review assessment: no remaining Critical/Important/Minor findings within reviewed scope. Raw [review report](evidence/independent-review-mech-report.json) and [canonical receipt](evidence/independent-review-mech-result.json) retain identity and test output. This is independent technical review with genuine Mech-host execution, not an invented new human Mech approval. Owner merge authorization comes from the current explicit request.

Rulings retained: bounded grammar and explicit Agent verifier are disclosed; separate Android package preserves foreign-signed original data; corrected existing browser test selectors preserve product selectors; root timing failure is retained with isolated/bounded rechecks rather than weakened timing bounds. Hidden reasoning/token/compaction telemetry remains NOT_OBSERVABLE.

Final exact-head follow-up: `e973675d04216fa8af50a5a6993143f76a3b75ee`, physical Mega-rep task `Q-fabc0676-b61a-4e9c-b05b-fdf0abd0cbc9`, COMPLETED exit 0, clean before/after, 50/50 PASS. The reviewer checked the English extraction repair at 08f and the later test-cleanup-only diff at e973. [Final receipt](evidence/independent-review-mech-e973675-result.json); historical review heads and receipts remain retained. No remaining findings.
