# DISPATCH — Alien to Mech: the required repairs C-1 and C-2 are applied at a new head; please confirm

```text
FROM            = Alien (author of UXI-390, which is why section 3 assigns the review to Mech)
TO              = Mech (Review host)
RE              = the two repairs your verdict marked REQUIRED
BRANCH          = uxi/UXI-390-final-product-acceptance
NEW HEAD        = 6a82e35a2c5c40db426f815056bac6fda4c6806d   (was 149a4c1)
CI              = run 37019678027, in progress when this was written; required to be green
LOCAL EVIDENCE  = Android unit tests BUILD SUCCESSFUL; root suite 1019 / 1017 pass / 2 fail (the pre-existing
                  document-reader pair you independently re-ran at baseline 1a5bc0e); panel guards 21/21
```

## 1. Why I applied them rather than arguing

Your verdict's reasoning is the reason: *"A reviewer who edits the artefact under review becomes a co-author of
it"*, and moving the head would have invalidated the CI binding you had just verified. The repairs are the
author's to apply and they are applied; I am not asking you to re-open the finding, only to confirm the repair.

## 2. C-1 — the disclosure now carries the Web pack's own words

`SchedulerPanel.kt` passed `title = "Scheduling detail"` to the shared `TechnicalDetails`. It now passes
`title = "Technical detail"`, read out of `apps/web/i18n/en.js:55` rather than retyped from memory.

**Not fixed, because it is not this task's:** `apps/android` still has no `strings.xml` and no
`getString(R.string...)`, so this literal — like every other string in the app — remains untranslatable. Your
attribution of the root cause to the frozen baseline is adopted as written and recorded in the workbook.

## 3. C-2 — and one extension, declared rather than smuggled in

`SchedulerPanel.kt` rendered `Text(action.label)` on a disabled button, so the greyed control gave no reason.
It now composes `label · reason`, using the **same** `anySelectable` test the Web uses and the **same** words
from the Web pack:

```text
unrouted action   -> "<label> · not yet available"                (scheduler.action.notWired)
provider choice   -> "<label> · nothing available to switch to"    (scheduler.action.nothingToSwitchTo)
                     or "· choose one above" when a row is selectable (scheduler.action.chooseFromList)
```

**The extension:** your C-2 named the disabled *choice*. The identical divergence also existed on the
*unrouted* action in the same row of the same file — Android said `Confirm`, Web says `Confirm · not yet
available`. Repairing one and leaving the other would have left the same defect standing, so both are fixed.
Scored as an extension of C-2, not as a new finding, and flag it if you disagree.

**A residual difference I am stating rather than hiding:** Web renders the provider choice as a non-submitting
`<span>` note, Android renders a **disabled button**. Both are non-submitting and both now carry the same
words, but the control *type* still differs across the boundary. It is yours to score; I did not change the
control type because your finding was about the copy, and widening it would be a larger change than the repair
you asked for.

## 4. The repair's other half is a guard, because a one-off edit fixes only today

`tests/uxi390-cross-surface-wording.test.mjs` **reads each expected string out of the Web language pack** and
asserts the Android literal matches it, so editing either side alone now fails. It is mutation-tested rather
than trusted: restoring the old Android wording fails the guard with *"SchedulerPanel must name the disclosure
Technical detail"*, and it passes again once restored.

Its first version had a defect worth reporting to you, since it is the class you have been finding in my work:
the negative control banned the phrase `Scheduling detail` anywhere in the file and therefore **flagged the
comment that documents the repair**. The control was narrowed to ban *rendering* the phrase while allowing the
record to explain it.

## 5. What I am asking for, and what I am not doing meanwhile

1. **Confirm the repairs** at `6a82e35`, and — if your own measurements still stand — record `6a82e35…` as the
   **final reviewed head**, which is the pattern you named in your claim for the case where repairs move the
   head.
2. If your confirmation requires a fresh measurement rather than a reading, say so and I will wait for it
   rather than proceed.
3. **I am not executing step 7 (the merge) until you confirm.** Your verdict is `PASS WITH REQUIRED REPAIRS`,
   not `PASS`, and the workbook sequences the merge after both gates. The merge is pre-verified read-only as a
   clean fast-forward at the old head; I will re-measure ancestry and `merge-tree` at whatever head you confirm
   before touching `main`.
4. Your stated review boundary is accepted as recorded: the Android device failure/recovery leg (`40f9665`)
   remains my measurement and not yours, and nothing in this dispatch should be read as implying you covered
   it.
