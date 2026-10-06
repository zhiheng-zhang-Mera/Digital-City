# PCF-700 Author hold and cooperation note

The opposite physical host has connected and begun the formal review of PCF-700. This is the AUTHOR side's freeze
declaration and cooperation protocol, written to remove the most common failure mode of a review in progress: **the
reviewed head moving underneath the reviewer**.

```text
STATUS             AUTHOR_HOLD_ACTIVE (not a review, not a verdict, releases no terminal marker, changes no review_* field)
REVIEW TARGET      659ff6aa98bc5675862b1170ed0cf5e1b78dba5f
BRANCH             pcf/PCF-700-mech-ownership-and-reality-audit
SERIES BRANCH      pcf/series-mech (the same head)
AUTHOR HOST        Mech (COMPUTERNAME MEGA-REP, role Mech-DS, development side)
CLAIM STATUS       at the time of writing the workbook's review_host is still null and no review/PCF-700-* branch exists
                   on the remote - the claim is published by the reviewer, and the author does not fill it in for them
```

## 1. Freeze

```text
* Until a verdict is given (or explicitly asked otherwise) the author pushes NOTHING to those two branches and does
  not rebase or merge main into them, so the reviewed head stays fixed.
* If the review finds a defect that needs repair, the author repairs it on a NEW head and records which finding it
  answers and what baseline it uses, while keeping every record of the reviewed head `659ff6a` - the failed head is not
  deleted and a new head does not borrow its green.
* The author does not touch `review_host` / `review_head_sha` / `review_ci` / `review_complete`, does not create,
  edit or delete the reviewer's claim or report, and does not release a terminal marker.
* On the City side the author still maintains the AUTHOR'S OWN records (reports, boards, non-review workbook fields);
  where those ever conflict with the reviewer's findings, the reviewer's REVIEW_REPORT and the workbook frontmatter
  are authoritative.
```

## 2. Facts at the frozen head (as the review begins)

```text
HEAD              659ff6aa98bc5675862b1170ed0cf5e1b78dba5f
REMOTE AGREEMENT  measured with git ls-remote: the task branch and the series branch both equal that head
CI                V0.2 checks run 37502818037 completed / success (gateway-web success, android success);
                  both `pnpm test` (including tests/pcf700-compatibility.test.mjs and
                  tests/pcf700-dependency-direction.test.mjs) and `pnpm check:docs` ran green on that head
AUTHOR RECOMPUTE  scripts/pcf700-review-packet.mjs => 8/8, exit 0
                  scripts/check-bilingual.mjs => PAIR_STATUS = SYNCHRONIZED for docs, evidence and data-records
CHECKED AT        2026-10-06T21:52:12Z (Mech host)
```

## 3. How the author will handle findings (written down in advance, not explained afterwards)

```text
F1 an in-scope blocking defect -> repaired on a NEW head with a minimal reproduction and regression evidence and a
   REPAIR record; the reviewed head itself stays untouched.
F2 an in-scope non-blocking finding -> recorded with its impact and whether it changes the acceptance conclusion; the
   reviewer decides whether it needs a repair.
F3 out of scope (for example something only PCF-701 or later should implement) -> marked NOT_IN_SCOPE_OF_PCF-700 with
   the workbook it belongs to; the review is not used to widen authority and nothing is implemented in passing.
F4 a problem in the reviewer's own instrument (for example treating an exported function as wired, or a legacy record
   as a defect) -> answered with a counter-example and measured output; each side records its own instrument errors,
   which is this project's existing habit (the author has recorded 4+2+2 of its own).
F5 behaviour that conflicts with this audit -> classified as "a statement in this audit needs correcting" rather than
   as a product defect, naming which statement.
```

## 4. Two known traps for the reviewer (stated up front so they are not mistaken for defects)

```text
T1  installing dependencies in a worktree takes TWO steps: `corepack pnpm install --frozen-lockfile` AND
    `corepack pnpm --dir city install --frozen-lockfile`. With only the first, the city workspace is not installed and
    the document-reader suites fail for ENVIRONMENTAL reasons - that is not a defect in this work.
T2  `git worktree remove` descends a `node_modules` directory junction and deletes real files; the correct order is
    `cmd /c rmdir <link>` first, then `git worktree remove`. (This host hit exactly that last round and repaired it.)
```

## 5. Review entry points (everything the author provides)

```text
REVIEW_READINESS_MECH.md   the one-command eight-recomputation baseline (expected output and three falsifications)
REVIEW_HANDOFF_Mech.md     the exact head, reproducible commands R0-R6, falsifiable seams S1-S8, declared done/undone
DEVELOPMENT_REPORT.md      all four heads and their CI, instrument errors, judgement calls, unproven items
ownership-map / reuse-tiers / ui-backend-matrix   the three deliverables themselves (utopia docs/{zh-CN,en}/pcf/)
CLAIM_REPORT.md            the claim and baseline resolution (claim-time measurement)
```

The author waits for the review's conclusion and does not move the reviewed head meanwhile.
