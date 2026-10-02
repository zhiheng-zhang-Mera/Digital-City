# CONTROL-PLANE INTEGRITY — duplicate frontmatter keys, and they are MINE

```text
FOUND BY    = Alien (reported, not fixed - correct call, see below)
VERIFIED BY = Mech, this round
ATTRIBUTION = Mech   (established by git, not assumed)
STATUS      = VERIFIED, NOT YET REPAIRED
```

## What is wrong, measured

Duplicate keys inside the YAML frontmatter of two `REVIEW_COMPLETE` workbooks. A duplicate key makes
the block not well-formed YAML: parsers differ on whether they error, take the first or take the last,
so **the claim truth §2 says lives only in frontmatter becomes ambiguous**.

```text
UI-000  review_covers_revision_head  x2   ->  false
                                              true          <-- CONTRADICTORY VALUES

UI-101  review_delta_verified        x2   ->  "Mech re-verified the post-review delta ... PASS_WITH_INTEGRAT..."
                                              "The delta's own half is correct and verified in a real browser..."
                                                          <-- two DIFFERENT claims under one key
        review_delta_required        x2   ->  "POST-REVIEW DELTA, not covered by the completed Review ..."
                                              true      <-- long text vs boolean, contradictory
        review_not_verified          x2   ->  identical text twice
```

UI-102, UI-103 and UI-190 are clean. So this is specific to the two I touched, not systemic.

## Attribution: mine, and it is the same error class as the BOM

```text
1997293 | Mech  | review(UI-000): Mech revision review complete - PASS_WITH_REPAIRS ...
9ccb79a | Mech  | complete(UI-101): Mech Review complete - PASS_WITH_REPAIRS ...
c8e90df | Mech  | review(UI-101): delta re-verification - PASS on the seam ...
c67932a | Alien | correct(UI-101): record the delta re-verification and withdraw an overstatement
```

Every key traces to a **Mech** commit, so I introduced these while reviewing UI-000 and UI-101. This is
the frontmatter-editing error class I have already been bitten by repeatedly this programme — the
PowerShell UTF-8 BOM, the CRLF `$`-anchor problem, and once consuming a field header and leaving
unterminated YAML. I have been checking for a BOM and for duplicate keys on **every** edit I make *now*
and it caught nothing, because these predate that habit. The lesson is not new; the point is that the
check was adopted after the damage rather than before it.

## Alien's handling was right

It reported rather than fixed, on the stated grounds that choosing which of two contradictory values is
canonical for a phase it did not work on is not its call. That is the correct instinct — the value
cannot be guessed, and a wrong guess would replace a visible ambiguity with an invisible falsification.
I am applying the same reasoning to myself rather than "self-healing" it on the spot:

- `review_not_verified` is byte-identical twice, so de-duplication is provably semantics-preserving.
- `review_covers_revision_head` is `false` then `true`. Under last-wins the effective value is `true`,
  but which of the two was *intended* is not determinable from the file alone, and UI-000's status is
  `REVISION_REVIEW_COMPLETE_PASS_WITH_REPAIRS`, so both readings are arguable.
- `review_delta_required` mixes a boolean with prose under a boolean-looking name. The prose belongs
  under its own key; the boolean is probably canonical, but "probably" is not the standard here.
- `review_delta_verified` carries two different substantive claims, and Alien's later `c67932a` says it
  *withdrew an overstatement*, which suggests the correction supersedes the earlier text — again a
  judgement to be made from the commit content, not from the current file.

So the repair needs the canonical value for each key established from the commit record, and written up
with the reasoning, rather than overwritten. That is the next work item, and it is mine.

## Why this matters beyond tidiness

RS-290 is now `REVIEW_COMPLETE` and its step 7 is the merge and the `RESCHEDULING_BASELINE_FROZEN`
declaration. Freezing a baseline while two workbooks in the same repository carry ambiguous frontmatter
means the post-freeze archaeology reads whichever value the parser of the day prefers. §7 also exists
precisely because recorded state must be reconcilable against evidence, and a duplicated key defeats
that by making "recorded" ill-defined.

## One of my checks in this round was itself broken, and it nearly produced a false negative

My first duplicate-key scan reported **0 duplicates** in both files and would have contradicted Alien's
finding. The scanner broke out of its loop on the *opening* `---` and therefore parsed an empty
frontmatter block. Corrected to skip the first fence and read until the closing one, it finds the four
duplicates above. Recorded because I came within one step of reporting that a correct finding was wrong,
and the only reason I did not is that a zero from an obviously broken scan is not evidence.
