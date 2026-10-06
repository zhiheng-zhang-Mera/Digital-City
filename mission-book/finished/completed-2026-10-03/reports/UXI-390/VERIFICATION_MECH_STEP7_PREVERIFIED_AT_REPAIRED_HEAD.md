# VERIFICATION — Mech: step 7 pre-verified at the CORRECT head, and what the stale binding would actually cost

```text
FROM = Mech (Review host)   STATUS = read-only pre-verification. Nothing was merged, moved or repaired.
```

## The merge is mechanically clean, and it is a fast-forward

Alien pre-verified step 7 read-only against `149a4c1`. The head that actually carries the review-required
repairs is `6a82e35`, so the pre-verification is repeated there rather than inherited:

```text
git merge-base --is-ancestor 1a5bc0e 6a82e35        exit 0   -> main IS an ancestor; a fast-forward is possible
git merge-tree --write-tree 1a5bc0e 6a82e35         exit 0   -> no conflicts, zero conflict markers
resulting tree   faf7647d3abdc61a3e028426c833e728090c090a
6a82e35's tree   faf7647d3abdc61a3e028426c833e728090c090a   -> IDENTICAL, so the merge is a pure fast-forward
```

Equality of the two tree hashes is the part worth stating: it means step 7 adds no merge commit with its own
content and resolves nothing — it simply moves `main` to the repaired head. `46 files changed, 4476
insertions, 5 deletions`.

## What the stale `development_head_sha` would actually cost, measured rather than asserted

`development_head_sha` still names `149a4c1`, and a merge driven by the record would take **that** tree. The
difference between the two heads is exactly:

```text
apps/android/app/src/main/java/city/utopia/control/SchedulerPanel.kt    the C-1/C-2 repairs
tests/uxi390-cross-surface-wording.test.mjs                             the guard that keeps them from drifting
```

Both are **inside** the tree step 7 would bring from `6a82e35` (confirmed by name against the
`1a5bc0e..6a82e35` file list). So the concrete risk is not abstract bookkeeping: merging the recorded head
would carry the scheduler panel **without** the wording repairs and **without** the guard, while
`review_complete: true` and a PASS verdict sit in the record beside it. The review would be closed against a
tree that step 7 did not merge.

This is the reason the correction dispatch was raised rather than noted: `merge_authority` is `true`, and a
fast-forward is exactly the operation nobody re-reads.

## Scope

Read-only. I did not merge, did not move `main`, did not touch the branch, and did not edit the development
host's fields. The correction remains the author's, and this document exists so that whoever takes step 7 can
see both that it is clean and what depends on taking the right head.


## 中文阅读译本 / Chinese reading translation

[完整中文阅读译本](./zh-CN/VERIFICATION_MECH_STEP7_PREVERIFIED_AT_REPAIRED_HEAD.md)逐节保留解释和历史限制，原代码证据不改写，不产生新的任务状态或验收。 / [Complete Chinese reading translation](./zh-CN/VERIFICATION_MECH_STEP7_PREVERIFIED_AT_REPAIRED_HEAD.md) preserves the explanations and historical limits section by section, without rewriting code evidence or creating new task state or acceptance.
