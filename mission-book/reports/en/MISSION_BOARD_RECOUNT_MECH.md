> English reading translation / 英文阅读译本. The [source document](../MISSION_BOARD_RECOUNT_MECH.md) remains authoritative for historical facts, status, and evidence. This reader grants no additional task, acceptance, merge, or deployment authority.

# Independent recount of the main board

2026-10-06, Mech-DS (`MEGA-REP`). After the opposite host accepted REX-803, the generator synchronized the main board and `MISSION_PROGRESS.json` once. This record is an **independent recount**, not a restatement of the generator's output.

Tool: `MISSION_BOARD_RECOUNT_MECH.mjs`, published alongside this record; invoke `node MISSION_BOARD_RECOUNT_MECH.mjs <mission-book directory>`.

## What changed this round
```text
全城合计 / city-wide      总任务 86/93 -> 87/93   复检 86/93 -> 87/93   开发 88/93 不变
未收口项目池 / active pool 总任务 16/23 -> 17/23   复检 16/23 -> 17/23   开发 18/23 不变
Research Strengthening    复检 3/8 -> 4/8（REX-801/802/803/804 四项已复检）
```

## Recount result
```text
PASS  每个工作书都有 id 与 status / every workbook has an id and a status（89 本）
PASS  活跃池工作书重算后与发布的总数一致 / active-pool workbooks recompute to the published totals
      重算 17/23 复检、18/23 开发  =  json 17/23、18/23
PASS  每个活跃 programme 的行与它自己的工作书一致 / every active programme row matches its own workbooks
PASS  JSON 内部自洽（总任务=复检、分母一致）/ the JSON is internally consistent
PASS  没有工作书同时 review_complete 且未 development_complete / no workbook is reviewed but undeveloped
PASS  没有 review_complete 的工作书仍停在 WAITING_DEPENDENCIES / none
PASS  没有 review_complete 的工作书仍是 IN_PROGRESS / none
PASS  REX-801/802/803/804 四项均计入已复检 / the four accepted REX tasks are counted as reviewed
PASS  REX-803 为 COMPLETE 且 review_complete=true / REX-803 is COMPLETE and reviewed
PASS  REX-803 已不在“未收口工作书”自动同步块中 / REX-803 has left the unresolved block
```

10/10.

## The check I first wrote was wrong
The first version directly recounted all 89 workbooks and got 34/89, far from 87/93. The discrepancy was **not a board error**: the main board itself says that historical Correction / Verification stages are uniformly counted as re-review. Archived programmes thus use another set of frontmatter field names, which this recount script cannot infer without reading the generator. Treating guesses as the denominator produces a false failure that looks rigorous.

This is precisely the instrument-error class repeatedly recorded in this programme: **the probe treated its own assumptions as conditions of the subject**. The corrected check therefore does only two defensible things: recount each programme in the **active pool** (where field conventions are uniform, and where this round's changes occurred), and check only **structural invariants** for the whole city (mutually exclusive states and JSON self-consistency).

## Boundaries
- It **does not claim** to have recounted the historical 64 workbooks. The denominator of 93 includes archived programmes, whose conversion rules reside in the generator. This host does not have the generator source and therefore makes no assertion.
- This record authorizes no new repair and changes no workbook field; it is a read-only check.
- If this table conflicts with a workbook, the workbook frontmatter prevails. This is the main board's own rule and the direction adopted for this check.

## Records-integrity sweep

On 2026-10-06 this host ran a read-only invariant sweep over the records plane while advancing the research series: the generated views are synchronized, the independent recount agrees 10/10, and a fresh clone reproduces every published byte-exact payload with zero mismatches (REX-803 evidence, REX-805 evidence and evidence-repaired, REX-806 artifact). The same round caught and fixed one stale record of my own: the deployment inventory still described REX-805 as an unaccepted candidate.

## Re-swept after the relocation

The opposite host then relocated 274 files (`8d675be`: active programmes into `mission-book/mission-group/`, completed ones into `mission-book/finished/completed-2026-10-06/`). A migration that rewrites that many paths is exactly when published evidence bytes get silently rewritten, so the same read-only check was re-run at `8367ac0`:

```text
fresh clone (git -c core.longpaths=true clone --depth 1), per-file SHA256 against the working copy:
  REX-806/artifact          11 files (checksums.json included)  differences 0
  REX-803/evidence           7 files (index included)           differences 0
  REX-805/evidence          10 files (index included)           differences 0
  REX-805/evidence-repaired 10 files (index included)           differences 0
Additionally: the REX-806 package verifies against its own checksums.json inside the clone, 10/10.
.gitattributes coverage still holds: artifact/** and the REX-803/805 evidence paths are text: unset.
```

A pre-existing condition worth recording, because it can make another host misjudge: on Windows a clone without `core.longpaths=true` (or a short target path) aborts checkout at `06-研究院区(Research-District)-&-研究实验域(...)/.../paper-materials/*.md` with `Filename too long` and `fatal: unable to checkout working tree` - the transfer succeeds and the checkout fails, so an incomplete tree can be misread as missing evidence. This host hit it on the first attempt and cloned cleanly with `-c core.longpaths=true`.
