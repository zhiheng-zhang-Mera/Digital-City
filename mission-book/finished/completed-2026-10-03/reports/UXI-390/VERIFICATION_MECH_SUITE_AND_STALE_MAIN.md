# VERIFICATION — Mech: the integration suite at `cd298c3`, and a stale-`main` defect in my own checkout

```text
FROM = Mech   HOST = Mech (review host)
RESULT = Alien's suite figure REPRODUCED EXACTLY, and both failures are PRE-EXISTING at the true baseline
STATUS = independent verification. NOT a review. No gate item is scored.
```

## 1. The claimed figure reproduces exactly

Run in a detached worktree bound to the branch tip, so the claim is checked against a specific tree:

```text
worktree HEAD   cd298c3a9fd2bcd3a974101506d2734ac4253e62
command         node --test "tests/*.test.mjs"      (69 test files)
result          tests 1017   pass 1015   fail 2
```

Alien recorded `1017/1015/2`. That is exact, on a second host, at the head Alien names.

## 2. The load-bearing half of the claim — "the 2 are pre-existing" — also holds

The count alone proves nothing; a merge could introduce two failures and coincidentally keep the total. So
both failing tests were run at the **true baseline**:

```text
baseline        1a5bc0ee825c681636b9611efa2163f458c0a76f   (origin/main, the RS-290 freeze merge)

tests/city-roads.test.mjs
  ✖ Bridge Road extraction preserves all six published document retrieval digests
tests/capability-adapters.test.mjs
  ✖ document bytes flow through real readers and into temporary knowledge
```

Both fail identically on the untouched baseline. So the integration tree introduces **no regression**, which
is the claim that actually matters, and it is now verified rather than inferred from the author's own run.

This is worth stating separately from the review's own figure for the same reason Alien stated it about the
merge: a merge is a new tree even when it is provably identical, and a suite total is not a regression check.

## 3. A defect in MY OWN checkout, found by not trusting a ref name

To build the baseline worktree I ran `git worktree add --detach <path> main` and then printed the resolved
SHA, as a habit. It said:

```text
e7c498f5acd86da324a45c3278219c8daa612561   merge(PROGRAMME): Engineering Manager EM-001..EM-013 corrected union
```

**That is not the baseline.** My local `main` was stale — it was an *ancestor* of `origin/main`:

```text
git rev-parse main           -> e7c498f5acd86da324a45c3278219c8daa612561
git rev-parse origin/main    -> 1a5bc0ee825c681636b9611efa2163f458c0a76f
git merge-base --is-ancestor 1a5bc0e main   -> exit 1   (NOT an ancestor: local main is behind)
git merge-base --is-ancestor main 1a5bc0e   -> exit 0   (local main is the older tree)
```

**The consequence would have been a wrong-tree comparison of exactly the kind Alien caught in my instrument
last week.** Had I run the two failing tests in that worktree and reported "these fail on main too", I would
have been comparing against an EM-era tree that predates the RS-290 freeze — and I would have been citing a
baseline the workbook does not name. The verification in section 2 is only valid because the resolved SHA was
printed and did not match; the ref name `main` was the thing lying.

**Fixed:** `git merge --ff-only origin/main` — a clean fast-forward, since local main was a strict ancestor —
so `main` is now `1a5bc0e` and the checkout matches the declared baseline. The baseline worktree was rebuilt
from the corrected ref before section 2 was measured.

**One thing this did NOT affect, checked rather than assumed.** My reconciliation instrument derives the
baseline as `git rev-parse origin/main` (line 104), not local `main`, so its "RS-290 contract byte-identical
to main" check has been reading the correct tree throughout. I read the line rather than reasoning from
memory, because "my instrument is probably fine" is precisely the reasoning that fails. My other verification
worktrees were likewise created from explicit `origin/...` refs and are unaffected.

## 4. Why this is recorded rather than quietly fixed

An environment defect that silently changes what a comparison means is the same class as the bug Alien found
in the instrument, and it is worth the same treatment: named, explained, and fixed visibly. The generalisable
rule is the one this task keeps relearning — **print the resolved commit, not the branch name** — and it is
the reason the earlier "evidence check read the working tree instead of the branch" incident produced a
confident wrong FAIL.

There is no finding here against Alien or the product. The branch is clean, the suite is green apart from the
two pre-existing failures, and the only defect was in the reviewer's clone.


[阅读译本 / Reading translation](./zh-CN/VERIFICATION_MECH_SUITE_AND_STALE_MAIN.md)
