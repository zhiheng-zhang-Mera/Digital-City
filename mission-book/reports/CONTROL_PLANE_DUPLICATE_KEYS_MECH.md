# CONTROL-PLANE INTEGRITY — duplicate frontmatter keys: found, verified, REPAIRED

```text
FOUND BY    = Alien (reported, not fixed - correct call)
VERIFIED BY = Mech
ATTRIBUTION = Mech   (established by git, not assumed)
STATUS      = REPAIRED by Mech, with each decision recorded below
```

## The defect, measured

Duplicate keys inside the YAML frontmatter of two `REVIEW_COMPLETE` workbooks. A duplicate key makes
the block not well-formed YAML: parsers differ on whether they error, take the first or take the last,
so **the claim truth §2 says lives only in frontmatter becomes ambiguous**.

```text
UI-000  review_covers_revision_head  x2   ->  false   (Alien 5f1b3f1)
                                              true    (Mech 1997293)   <-- CONTRADICTION

UI-101  review_delta_verified        x2   ->  Alien c67932a narrative
                                              Mech  c8e90df detail
        review_delta_required        x2   ->  Alien c67932a prose
                                              Mech  c8e90df boolean true
        review_not_verified          x2   ->  Mech 9ccb79a narrower text
                                              Mech c8e90df wider text
```

UI-102, UI-103 and UI-190 were clean, so this was specific to the two workbooks I touched.

## Attribution: mine

```text
5f1b3f1 | Alien | feat(UI-000): record the Owner style ruling and the C-prime revision   <- wrote false
1997293 | Mech  | review(UI-000): Mech revision review complete ...                      <- wrote true
9ccb79a | Mech  | complete(UI-101): Mech Review complete ...
c8e90df | Mech  | review(UI-101): delta re-verification ...
c67932a | Alien | correct(UI-101): record the delta re-verification and withdraw an overstatement
```

The duplicates came from **my** edits: I added a second block of review fields to each workbook using
key names that were already taken, instead of extending the existing block or naming the new fields
distinctly. This is the same frontmatter-editing error class I have been bitten by repeatedly — the
PowerShell UTF-8 BOM, the CRLF `$`-anchor problem, and once consuming a field header and leaving
unterminated YAML. I now check for a BOM and for duplicate keys on every edit I make, and that check
caught nothing here because these predate the habit. The habit is right; it arrived late.

## The repair, and why each key was handled differently

The rule I applied: **rename to preserve, delete only when provably superseded.** Deleting a duplicate
discards a recorded fact; renaming costs nothing and keeps both statements auditable. So only the two
cases that were genuinely the *same field* were resolved by deletion.

| workbook | key | action | reasoning |
|---|---|---|---|
| UI-000 | `review_covers_revision_head` | **deleted the stale `false`**, kept `true` | Same boolean, so this is a real contradiction and one value had to go. The field asks whether the review covers the revision head, and Mech's `1997293` **is** the revision review — it sits in the same block as `revision_review_repairs` and `revision_review_claims_verified` — with status `REVISION_REVIEW_COMPLETE_PASS_WITH_REPAIRS`. The `false` was the pre-revision-review state. |
| UI-101 | `review_not_verified` | **deleted the earlier text**, kept the later | Same claim, same name. `9ccb79a` said *"this review did not cover it"*; `c8e90df` extended it to *"neither review nor delta re-verification covered it"*, which strictly **subsumes** the earlier statement. Verified the survivor contains the wider wording and not the narrower one. |
| UI-101 | `review_delta_required` | **renamed the prose to `review_delta_required_note`** | A boolean and a paragraph under one name are different *kinds*, so nothing had to be discarded: the boolean `true` keeps the name, the context paragraph survives under its own key. |
| UI-101 | `review_delta_verified` | **renamed the summary to `review_delta_verified_summary`** | Two substantive, mutually consistent statements (both record `PASS_WITH_INTEGRATION_DEPENDENCY`). The detail keeps the name; Alien's later summary is preserved rather than dropped. |

## Verification of the repair

```text
duplicate keys, all UI workbooks        0
duplicate keys, ALL of mission-book     0
BOM on either edited file               false
diff                                    4 insertions, 4 deletions
UI-000 keys  66 -> 65   lost: (none)   gained: (none)
UI-101 keys  51 -> 50   lost: (none)   gained: review_delta_verified_summary, review_delta_required_note
renamed values byte-identical to originals   review_delta_verified_summary (1475 == 1475)
                                             review_delta_required_note   (1242 == 1242)
surviving review_not_verified contains the WIDER wording   true
surviving review_covers_revision_head                      true
```

Nothing was lost: the two renames are byte-identical to the strings they replaced, and the two
deletions are superseded values whose replacements were confirmed present.

## Two of my own checks in this exercise were broken, and both were caught by executing them

1. My first duplicate-key scan reported **0 duplicates** and would have contradicted a correct
   finding. It broke out of its loop on the *opening* `---` and parsed an empty block.
2. The repair script's post-rename assertion used `/^…$/` **without the `m` flag** against a joined
   string, so it could only match at offset 0 and threw on a correct rename. The throw happened
   **before** the write, so UI-101 was left untouched and the file was restored from a backup and
   re-run — the reason I took backups first.

Neither is interesting on its own; both are the same lesson this programme keeps re-teaching. What
matters is that both were caught by running the check rather than by trusting it, and that a zero or a
throw from an obviously broken check was not treated as evidence.

## Why this mattered before the freeze

RS-290 is `REVIEW_COMPLETE` and its step 7 merges to `main` and declares
`RESCHEDULING_BASELINE_FROZEN`. Freezing a baseline while two workbooks carry ambiguous frontmatter
means post-freeze archaeology reads whichever value the parser of the day prefers, and §7 exists
precisely so that recorded state reconciles against evidence — a duplicated key defeats that by making
"recorded" ill-defined.
