# MON-902 baseline resolution / 依赖 SHA 并集解析

```text
CLAIMANT            Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ANCHOR MODE         DEPENDENCY_SHA_UNION_AT_CLAIM
DEPENDENCY          MON-901  (accepted head 7eb38f1b930dfe6cc13dab0e17dedee467b1254b)
ELIGIBLE BASE       refs/heads/main -> d3262ce2dd81e51a53e39e6f9add8dee650a7682
UNION BASELINE      7eb38f1b930dfe6cc13dab0e17dedee467b1254b
UNION BRANCH        mon/MON-902-mech-overview-graph  (worktree D:/utopia-mon902)
ANCESTRY VERIFIED   merge-base --is-ancestor exit 0 for 7eb38f1b… and d3262ce2… against the union
DEPENDENCY SMOKE    node --test tests/mon901-observation.test.mjs -> pass 8 / fail 0 (run before any product change)
```

## 1. What was resolved, and how

MON-902 declared `baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM` with `dependencies: ["MON-901"]` and
`dependency_source_shas: []` — an unclaimed dependency that §2A.5 forbids filling with a guess, a branch name, or a
placeholder. MON-901 is now `COMPLETE` with `development_complete: true` and `review_complete: true`, and its workbook
records one exact head for both development and review:

```text
development_head_sha   7eb38f1b930dfe6cc13dab0e17dedee467b1254b
review_head_sha        7eb38f1b930dfe6cc13dab0e17dedee467b1254b
```

That single identity for both roles is what makes the union unambiguous: there is no second candidate head to choose
between, and no "the reviewer looked at something slightly different" ambiguity to resolve.

## 2. The union was a fast-forward, and that is a measured fact

```text
git worktree add -b mon/MON-902-mech-overview-graph D:/utopia-mon902 d3262ce2dd81e51a53e39e6f9add8dee650a7682
git merge --no-edit 7eb38f1b930dfe6cc13dab0e17dedee467b1254b
  -> fast-forward, no conflicts, working tree clean
git rev-parse HEAD
  -> 7eb38f1b930dfe6cc13dab0e17dedee467b1254b
```

MON-901's branch is a **descendant** of `main`, not a sibling: `git merge-base --is-ancestor d3262ce2… 7eb38f1b…` exits 0.
So the union baseline is exactly the MON-901 head, and it already contains the eligible base. This is the opposite of
the CEX-790 situation, where five parallel dependency heads had to be merged one at a time with hand-resolved
conflicts; here there is nothing to resolve and pretending otherwise would have been invented work.

Consequences recorded deliberately:

- MON-902's `required_ancestor_shas` and `dependency_source_shas` both hold the same full SHA, so a later claim cannot
  silently start from a base that lost MON-901's capability.
- The recorded `development_baseline_sha` is a full 40-character SHA, not a branch name (§2A.1, §2A.2).

## 3. Dependency smoke, including the failure that was not a defect

§2A.3 step 5 requires a dependency smoke run **before** any product modification of this task. It was run against the
union baseline and passes:

```text
node --test tests/mon901-observation.test.mjs
  ✔ bounded canonical projection exposes active task, binding and exact event evidence without raw secrets
  ✔ overflow and missing history remain visible; fresh snapshot reflects canonical state, not cached truth
  ✔ slow/disconnected observation never gates real canonical task persistence
  ✔ real API claim/report projection follows persisted lifecycle and cannot execute commands
  ✔ stalled HTTP monitor request and broken reader leave independent create/cancel requests working
  ✔ invalid limits cannot create unbounded queries, single flight and unknown populations stay honest
  ✔ deleted historical prefix and tail cannot be reported as complete history
  ✔ Gateway shares outstanding observation and retains stale last view on later source failure
  tests 8 / pass 8 / fail 0
```

Instrument failure recorded rather than hidden: the **first** run of that command failed at file level with
`ERR_MODULE_NOT_FOUND: Cannot find package 'ws' imported from services/dev-gateway/server.mjs`. The cause is that a
freshly created worktree has no `node_modules`; after `npm ci` in `D:/utopia-mon902` the identical command passed 8/8.
Classification: environment setup, not a dependency defect, and not a reason to doubt MON-901's accepted state. It is
written down because "the dependency smoke failed and then it passed" is exactly the kind of sequence that gets
compressed into a false memory of a clean first run.

## 4. Eligibility

Mech-DS is eligible for MON-902: the workbook requires Development and a later opposite-host Review, its
`development_host` was unclaimed, no other host holds a live claim on it, and MON-901's review was performed by this
host (so this host is not barred from developing the next task in the sequence — the independence requirement applies
within a task, not across a chain).

The later Formal Review of MON-902 must be performed by the other physical host (Alien), and `merge_authority` is
`false`, so nothing here may be merged.

语言配对 / Language pair: [English](./CLAIM_RECORD.md) · [中文](./zh-CN/CLAIM_RECORD.md)
