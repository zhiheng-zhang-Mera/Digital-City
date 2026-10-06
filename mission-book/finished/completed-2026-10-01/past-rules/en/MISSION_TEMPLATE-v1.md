> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MISSION_TEMPLATE-v1.md) 的原始 frontmatter 是唯一元数据来源。

# MB-XXX — Mission title

> A new Mission may set execution_enabled to true only when the donor already implements the behavior and the Owner decides to admit it to the migration queue.

## Goal
## Donor / Frozen baseline
## City ownership and implementation boundary
## Existing behavior permitted to migrate
## Explicit exclusions / Outside this Mission
## Migration completion gates
## Verification completion gates
## Claim / Host claim record
## Mission-specific evidence

## Binding execution conditions (mandatory for every Mission)

1. **Migration only:** MODE=MIGRATION_ONLY. Only move, split, adapt interfaces, wire, equivalently refactor, test and record evidence for behavior already in the donor. Do not add product capability, policy or semantics absent from it.
2. **Two separate completion states:** maintain MIGRATION_COMPLETE and VERIFICATION_COMPLETE separately; the first does not allow entry into main.
3. **Report to Digital-City main before claiming:** the host must first enter host identity, role and time in this file's Claim section and commit to City. On a write conflict, reread latest state and choose again.
4. **Other hosts must skip a task already claimed with its stage incomplete.** No takeover.
5. **Exactly two hosts per Mission:** one Migration, one Verification. Once a host appears in either Claim it cannot claim any role again in this Mission. Hosted CI runners are not participating hosts.
6. **Selection order:** first choose EXECUTION_ENABLED=true, unmigrated, unclaimed, dependency-satisfied Missions, ascending SEQUENCE. Only when none are migration-claimable choose migrated but unverified and unclaimed Missions, also ascending SEQUENCE.
7. **Migration branch:** default to mission/<MISSION_ID>-<slug> from latest main of target implementation repository. Migration cannot merge into target main; City Claim/status metadata updates are exempt.
8. **Migration report:** commit a concise construction report to Digital-City/mission-book/reports/<MISSION_ID>/MIGRATION_REPORT.md. Record implementation boundary: donor SHA, source→target paths, retained behavior, explicit exclusions, interfaces/contracts, existing UI/actual consumption path, tests, data/error summary, limits, Utopia evidence pointers, branch HEAD/CI. City does not retain bulky raw runtime logs.
9. **Independent review before reading Migration report:** use donor, target code, diff, tests and runtime state to independently review and record findings first; only then read Migration report as secondary reference.
10. **Verification may repair the same branch:** implement necessary secondary repair, added tests, real UI/use verification, fault/recovery verification and evidence completion on the Migration branch, without expanding scope.
11. **Merge gate:** after verification, all required target CI and Mission checks must be green before main merge. Never skip/delete tests, relax acceptance or change target semantics for green.
12. **Final report:** commit Digital-City/mission-book/reports/<MISSION_ID>/VERIFICATION_REPORT.md, recording independent review, differences after consulting Migration report, repairs, hardware/second-host results, failures/recovery, CI runs, final branch SHA, merge SHA, Utopia evidence.
13. **Abnormal claim recovery:** automated constructors cannot clear Claims. If no implementation commit/report exists after claim, Owner may explicitly reset. If substantive work exists but host cannot finish, mark BLOCKED_OWNER_DECISION; no secret third-host continuation. Owner decides whether to establish a superseding Mission.
14. **No new UI just for acceptance:** real UI/use must reuse existing Utopia Web/Android/Services/Tasks/Activity or donor UI behavior. If existing surfaces cannot consume the capability, record boundary/blocker; do not disguise new product functionality as migration.
15. **Mandatory Utopia process dogfooding:** after claim, before substantive construction, and at every meaningful change/test/runtime failure/recovery/Owner intervention/verifier finding/repair/CI/completion, append structured events on implementation branch using pnpm mission:event -- .... Bulky local evidence goes to .runtime/evidence/mission-book/<MISSION_ID>/<run-id>/; selectively publish bounded nonsensitive evidence to evidence/raw/mission-book/<MISSION_ID>/ only for genuine cross-host need.
16. **Episode closeout and two CIs:** Verification first makes required implementation CI green and records CI_RESULT=PASS, VERIFICATION_COMPLETE=PASS; then pnpm mission:finalize -- ... creates verified episode and removes current-tree inbox. After committing this data-only closeout, final branch HEAD must rerun every required CI green before merge. City Verification Report records implementation CI, final branch CI, episode path/digest, final merge SHA.
