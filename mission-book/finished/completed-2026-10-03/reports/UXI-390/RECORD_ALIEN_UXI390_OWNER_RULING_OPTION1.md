# RECORD — Owner ruling on the UXI-390 remote-handoff deferral: OPTION 1, and the workbook body repaired

```text
HOST            = Alien (UXI-390 development host)
RE              = the merged Owner decision from the gate audit, plus the mission-book README the Owner asked
                  to have updated in the same answer
STATUS          = ruling recorded, README tracking rewritten from measurement, UXI-390 workbook body restored
OWNER RULING    = OPTION 1 - keep the deferral, reason corrected, gate item explicitly NOT MET
BASIS           = reports/UXI-390/GATE_AUDIT_ALIEN_UXI390.md,
                  reports/UXI-390/DISPATCH_ALIEN_HANDOFF_UNREACHABLE_BY_DESIGN.md
```

## 1. The ruling, verbatim in substance

The decision was put to the Owner as one contract-level question, with the two options the audit and the
dispatch report had already reduced it to, and the Owner chose:

> **选项 1** — keep the deferral with its reason corrected to *"the City publishes no five-dimension load
> vector, and unmeasured load is deliberately ineligible as an alternate"*, with the handoff sub-item of gate
> item 3 staying explicitly **NOT MET**; **and update the mission-book README task tracking.**

Option 2 — that the City begin reporting a real load vector and gain a switch-decline path on the surfaces —
was **not** chosen. It was put to the Owner as what it is rather than as a repair inside this task: a new
product capability spanning frozen-contract vocabulary (`ALLOWED_ACTIONS` is exactly `CANCEL`, `RETRY`,
`KEEP_WAITING`, `CHOOSE_PROVIDER`, `CONFIRM` — there is no decline token), a gateway route that no surface
calls, and both surfaces.

## 2. What this ruling changes, and what it does not

Recorded because the difference is easy to overstate in both directions.

**Changes:** the outstanding Owner decision is off this task's path. The handoff sub-item is now a **deferral
accepted by the Owner** rather than an open question, and the frozen RS-290 contract is untouched.

**Does not change:** the deferral is **not** converted into a pass, and **no gate item that was NOT MET is now
MET**. In particular:

```text
gate 3 handoff sub-item   NOT MET, deferred by Owner ruling   (unchanged)
gate 6 Owner visual gate  NOT MET - awaiting the Owner        (unchanged)
gate 7 main CI green      NOT MET - by design, merge is step 7 (unchanged)
gate 8 final marker       NOT MET - cannot precede 6 and 7     (unchanged)
development_complete      false                                (unchanged, and for a NEW reason - see 3)
```

## 3. Why `development_complete` is still false — a reason unrelated to the deferral

Reading the workbook's own step list (restored below, and now legible) shows one **development-host step that
is still owed**: step 5, the *minimal* Owner-facing package — Web Home / Ask / Tools, Android Home / Ask /
Tools, one Room, and one provider switch or remote-handoff state — so that the Owner's only task is to say
whether it looks right.

That step is Alien's, it is not yet delivered, and it is the **next step this host takes**. Step 4's visual
critic loop belongs to the Review host under §3: Alien is this task's development host and must not critique
its own output.

## 4. §7 reconciliation, done before acting on the ruling

Not after, and not from memory: `origin/main` re-read (`c028e4a`, and no other host had pushed since it), all
four remote heads enumerated (`main` plus three `docs/*` branches from 30 Sep and 1 Oct), and every workbook
under `mission-book/` re-scanned for `status` / `development_complete` / `review_complete`. The ruling was
applied to that measured pool. Its classification as a zero-claim condition is recorded separately in
`reports/ZERO_CLAIM_ALIEN_ROUND197_SECTION_5_1.md` (§5.1, on the reasoning that §5.1 line 110 names "Owner gate
解除" as an unlock event — the same reasoning Mech used for UI-190's Owner gate).

## 5. The README the Owner asked for

`mission-book/README.md` was rewritten from measurement rather than edited from memory. It had drifted badly
and was **actively wrong**: it still showed UI 文明化 `ACTIVE 1/5`, 再调度 vNext `LOCKED 0/4`, UI × 调度
`LOCKED 0/2`, Alien on *UI-000 修订*, Mech as 可领取 for UI-000's C″ revision review, and a Utopia baseline of
`e7c498f`. Every one of those has been superseded for many hours.

The new board carries: the three programmes with counts read from each workbook's frontmatter (UI 5/5 · 5/5,
再调度 4/4 · 4/4, 接线 1/2 · 1/2), both hosts with their real state and wake conditions, this ruling, the
zero-claim classification, and the control-plane encoding defects with the three workbooks deliberately left
alone.

## 6. The workbook body repair, made in the same commit

Mech's finding `reports/CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md` rated this **high
severity for this phase** — *the completion gate the UXI-390 review is conducted against was unreadable in the
repository* — and correctly declined to repair it, deferring the fix to "the Owner's call, or the author's per
file".

**This file's author is Alien.** Measured, not assumed: the corruption is absent at the Owner's original
`2a319ce` and present at `1199229`, Alien's own claim commit, and persisted through every later commit.

The repair restores the body of `2a319ce` **verbatim** and touches nothing else.

**Why a verbatim restore is exact, rather than a reconstruction that would fabricate text.** Two
measurements, both in this directory:

```text
PROBE_uxi390_workbook_encoding.mjs   repaired body vs original body: 53/53 lines explained as the original
                                     line with only multi-byte characters destroyed; 83 characters destroyed
                                     -> encoding damage, which cannot conceal a legitimate edit
reversed repair, REJECTED            re-encode damaged text as CP936, decode as UTF-8 -> 59 replacement
                                     characters, i.e. that road would have invented 59 punctuation marks
```

The first measurement is the one that licenses the restore: a body that is the original modulo destroyed bytes
carries no edit for the restore to discard. Had any line failed, the restore would not have been made.

Result, verified after writing: no BOM, 0 mojibake tokens, 0 replacement characters, the completion gate
(`## 最终完成门槛`) and steps (`## 施工步骤`) headings legible, frontmatter byte-unchanged apart from this
round's three new keys.

**The same defect remains in UI-102, RS-290 and UXI-301 and was deliberately left alone** — all three are
closed, RS-290 is frozen and UXI-301 was reviewed at specific bytes, so re-encoding them would be a record
alteration. They are named in the README and left for the Owner.

## 7. What happens next

1. **Alien (development):** deliver step 5's minimal Owner-facing package, then declare `development_complete`
   and release to Review.
2. **Mech (review):** the independent visual critic pass and the review of UXI-390, at a reviewed head — §3,
   never Alien.
3. **Owner:** `FINAL_VISUAL_ACCEPTANCE` on the delivered package.
4. **Then:** step 7 merge to `main`, verify main CI, and the marker
   `UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED`.


[阅读译本 / Reading translation](./zh-CN/RECORD_ALIEN_UXI390_OWNER_RULING_OPTION1.md)
