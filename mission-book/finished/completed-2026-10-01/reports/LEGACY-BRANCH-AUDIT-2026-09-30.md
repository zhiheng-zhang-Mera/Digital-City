# Legacy Branch Audit and `mech/knowledge-room-k0` Disposition

```text
STATUS: FINAL
HOST: Mech
DATE: 2026-09-30
MODE_AT_TIME: BUTLER_ASSISTANT_PARALLEL_DEVELOPMENT
AUTHORITY: direct Owner instruction (2026-09-30) + Owner confirmation, option A
SCOPE: legacy branch audit and one branch disposition. BUTLER_MERGE lock untouched.
IMPLEMENTATION_REPO: zhiheng-zhang-Mera/utopia
UTOPIA_MAIN_AT_AUDIT: 8104f8289a76d15ff0197c953730edcef42cab5e
MERGED_MAIN_CI: 36692675561 - android success, gateway-web success
REMOTE_BRANCHES_AUDITED: 34
REMOTE_BRANCHES_UNMERGED: 0
BRANCH_UNDER_DECISION: mech/knowledge-room-k0
BRANCH_HEAD: db7cfc5ef4b631c00149fe3657cc85b90d6f4356
BRANCH_CI: 36700716264 - success
DISPOSITION: PRESERVED_ON_ORIGIN / SUPERSEDED / NOT_MERGED
```

## 1. Instruction received

> 以主机 Mech 的身份，对 utopia 的各个分支进行 main 合并，保留工作历史，如果出现 Github CI
> 测试报错，解决到全绿并记录到 city 和 utopia 的存档处。

Restated: as host Mech, merge Utopia's branches into `main`; preserve work history; if
GitHub CI reports errors, repair to all-green; record the outcome in the City and Utopia
archives.

Because the standing construction instruction requires every problem, choice and
judgement to be recorded rather than silently resolved, this report records where the
instruction's premise diverged from repository reality and how the divergence was
resolved.

## 2. Problem: the premise no longer held

Reconnaissance (`git fetch --prune` on both repositories first, per the standing rule
that the latest state must be confirmed before claiming work) produced:

```text
utopia origin/main          = 8104f8289a76d15ff0197c953730edcef42cab5e
git branch -r --no-merged origin/main   ->  (none)
git branch    --no-merged origin/main   ->  mech/knowledge-room-k0   (local-only)
remote branch count         = 34
merged-main CI              = 36692675561  success
CI run at audit time        = no in-progress run
```

Every remote branch was already merged. The MB-010/011/012 provenance merges
(`6e9781c`, `f22273c`, `e0d9470`), the `d0dea7b` force-record and the UPT-PRE-ASSISTANT
foundation merge (`8104f82`) were all present and green. The only unmerged ref was a
**local-only branch that had never been pushed**, so the instruction's "merge the
branches" had no remote work left to integrate.

## 3. Problem: the one remaining branch was superseded, not outstanding

| Fact | Value |
|---|---|
| Content | 25 files / 3034 insertions, **all** under `apps/knowledge-room/**` |
| Wiring | `ACCEPTANCE_K0.md`: "Changed files outside `apps/knowledge-room/**` = 0" — never attached to the Room Pack hub |
| Own tests | 18/18 pass (store 6, search 4, import-export 4, http 4) |
| Product | Knowledge Room: title+body search, tag filtering, whole-bundle export, replace import |
| Main's equivalent | `apps/rooms/rooms/knowledge/` (`client.mjs`, `room.server.mjs`) — same feature set, integrated into the Room Pack hub, Web and Android |
| Branch first commit | `9208903` @ 2026-09-29 **10:58:11** |
| Main's knowledge room | `67b27bf` "feat(rooms): add knowledge room" @ 2026-09-29 **12:02:56** |

The branch was authored first and replaced roughly an hour later by the Room Pack
implementation that main ships. It is a **parallel earlier attempt**, not unmerged
progress.

## 4. Choice and judgement logic

Merging the branch literally would have produced three harms:

1. **Two live implementations of one room** — main would hold both `apps/knowledge-room/`
   (unwired) and `apps/rooms/rooms/knowledge/` (wired), contradicting this City's own
   `apps/rooms/docs/en/INCUBATION_POLICY.md` §5: *"Room and City must never drift apart as
   two live implementations."*
2. **3034 lines of dead product code on main**, covered by no CI job. The root workflow
   runs `tests/*.test.mjs`, `apps/rooms/tests/*.test.mjs` and `city/test-all.mjs`; the
   branch's four test files sit in none of them, so its 18 tests would never run again.
3. **Rule conflict.** The active mode is `BUTLER_ASSISTANT_PARALLEL_DEVELOPMENT` with
   `BUTLER_MERGE = FORBIDDEN` and merge-workbook creation gated on every BA task
   completing Development and Correction. README §7.3 requires integration "without
   dropping valid behavior"; here nothing is dropped — a duplicate is added.

The standing escape clause ("选择最优解") covers *unspecified* options. This was a material
product-topology decision inside an explicit rule conflict, so it was escalated to the
Owner instead of being decided unilaterally or executed literally.

## 5. Owner decision

Two questions were put to the Owner; the answers:

```text
knowledge_room_k0  ->  A. push to origin to preserve history + record as superseded in
                          City; do NOT merge into main
ba_scope           ->  yes, legacy branches only; do NOT touch the BA merge lock
```

Recorded here because it is the governing authority for this disposition: the branch is
deliberately **not** merged, so no City rule is overridden and `BUTLER_MERGE` remains
`FORBIDDEN` and untouched.

## 6. Action taken

```text
utopia:  git push -u origin mech/knowledge-room-k0
         -> refs/heads/mech/knowledge-room-k0 = db7cfc5ef4b631c00149fe3657cc85b90d6f4356
         branch head equals the local head exactly; nothing rewritten, squashed or rebased
utopia:  main 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
         docs(legacy-branches): audit all branches against main and record the
         knowledge-room K0 disposition
         -> adds evidence/raw/legacy-branches/2026-09-30-knowledge-room-k0-superseded.md only
```

Before the push the branch existed on one machine only, which is a real single-point loss
risk. It is now durable on origin at its original head with all four commits
(`9208903` bootstrap, `61a464d` CRUD, `0ae5707` acceptance, `db7cfc5` acceptance record)
intact — which is the substantive meaning of 保留工作历史.

## 7. CI

```text
branch push CI  mech/knowledge-room-k0 @ db7cfc5  = 36700716264  success
merged-main CI  origin/main @ 8104f82             = 36692675561  success
main CI after the archive commit 82ed369          = 36700956282  success
```

The branch push triggers the workflow as it existed at that commit ("V0 checks":
`pnpm test` + `pnpm check:docs`, plus the Android job). The branch adds only
`apps/knowledge-room/**`, which no job in that workflow covers.

**No CI failure occurred**, so the instruction's repair clause ("解决到全绿") was not
triggered: both runs were green on their first attempt.

## 8. Post-record verification

```text
utopia main after archive commit   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
files changed in that commit       = 1 (evidence/raw/legacy-branches/...md)
product/runtime code changed       = 0
main CI for 82ed369                = 36700956282  success (android success, gateway-web success)
```

```text
MAIN_CI_82ED369 = 36700956282 - success
```

## 9. Residual state and what is NOT claimed

- **Not claimed:** that `mech/knowledge-room-k0` is worthless. It contains 18 passing
  tests and a complete self-contained product; it is retained for provenance and remains
  available for a future Owner-directed integration or deletion.
- **Not claimed:** that legacy branch work is exhausted by this audit. The audit covers
  refs in `refs/heads` and `refs/remotes/origin` at the stated `CODE-SHA`; a future
  divergence would need a fresh audit.
- **Not touched:** the BA merge lock, the BA-001..BA-009 queue, the frozen Butler
  baseline `8104f8289a76d15ff0197c953730edcef42cab5e`, and the four carried-forward
  non-blocking Pre-Assistant items listed in `MISSION_INDEX.md`.

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/LEGACY-BRANCH-AUDIT-2026-09-30.md)
