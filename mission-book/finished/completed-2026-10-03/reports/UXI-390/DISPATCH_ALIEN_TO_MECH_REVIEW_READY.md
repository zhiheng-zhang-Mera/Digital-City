# DISPATCH — Alien to Mech: UXI-390 development is complete and released to Review

```text
FROM      = Alien (UXI-390 development host)
TO        = Mech (Review host; section 3 forbids Alien reviewing its own output)
STATE     = development_complete = true, released to Review
BRANCH    = uxi/UXI-390-final-product-acceptance
HEAD      = 149a4c14b596b92f04fab6269eca1dcb7727303f
CI        = run 36998342105, completed SUCCESS on exactly that head, both jobs (android + gateway-web)
BASE      = main 1a5bc0ee825c681636b9611efa2163f458c0a76f  (RS-290 freeze merge)
```

## 1. What is being handed over

Everything the workbook's steps 1-3 and 5 asked of the development host, at the head above: the final
integration branch (UXI-301's independently reviewed head merged in), the driven Web and Android acceptance,
the Rooms coverage, the action-wiring honesty repairs, and step 5's minimal Owner-facing package.

The Owner-facing package is `reports/UXI-390/FINAL_VISUAL_PREVIEW_PACKAGE.md` in this control plane; the pixels
live in the implementation repo at `evidence/raw/mission-book/UXI-390/owner-package/` (eight images plus two
capture receipts carrying per-image SHA-256 and the visible text at capture time), because
`PROCESS_DATA_POLICY.md` line 16 forbids piling screenshots into City.

## 2. The one thing that must NOT be re-litigated

**The remote-handoff deferral is settled by the Owner, and the settlement is not "unresolved".**

```text
Owner ruling      = OPTION 1: keep the deferral, reason corrected, gate item explicitly NOT MET
the corrected     = the City publishes no five-dimension load vector, and unmeasured load is deliberately
reason              ineligible as an alternate
what it does not  = it does NOT pass the item, does NOT change the frozen RS-290 contract, and does NOT
mean                make ALTERNATE_DEVICE reachable
```

The answer is written in the product's own comments (`services/dev-gateway/presentation.mjs` on
`routeStageFor`, and `city/00-foundation/01-city-core/fleet-routing/pressure.mjs`). That question consumed
**sixteen rounds across both hosts**, including one over-claim by Mech that Mech properly withdrew and one
over-generalisation by Alien, so it is stated here in the handoff rather than left for the review to
rediscover. If the review disagrees with the ruling, the correct move is to say so to the Owner — not to spend
the review budget re-deriving reachability.

## 3. Known limits, recorded by the development host so they are not rediscovered as defects

* **`ALTERNATE_DEVICE` is unreachable by design**; `SWITCH_OFFERED` is reachable and was produced and
  observed. The provider-state capture shows exactly that: an offer with **"nothing available to switch to"**.
* The Web captures are at **1440x900**, one viewport; the Android captures are **one device**
  (`BICIPVNB5HS85H9T`), and its UI renders **Chinese** because that is the device locale. Narrow-screen,
  other-locale and other-device coverage is the reviewer's to add under section 3 if it judges it necessary.
* The step-5 capture scripts assert their own preconditions and **fail loudly**; three instrument faults were
  found and fixed this round by those assertions (a screenshot of the opened room was byte-identical to the
  overview because the room renders below the fold; the receipt excerpted the sidebar rather than the content;
  the first click target was a Home room card carrying `data-goto`, which only navigates). They are recorded
  because the same class of fault is the programme's most repeated one.
* **UI-102, RS-290 and UXI-301 remain GBK-double-encoded** in the repository. UXI-390's own body was repaired
  (Alien authored the corruption, in claim commit `1199229`); the other three are closed, two of them frozen
  or reviewed at specific bytes, so they were deliberately left for the Owner rather than silently rewritten.

## 4. What the review host owns

The workbook's step 4 visual-critic loop and the independent review, at a head of your choosing. If your own
repairs move the head, **the repaired head becomes the reviewed head** and you record it as such — that is what
happened on UXI-301, and it is the correct pattern here too. Alien will not touch the branch while it is under
review.

## 5. Alien's state while you work

`5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY`, recorded in `README.md` and in
`reports/ZERO_CLAIM_ALIEN_ROUND197_SECTION_5_1.md`. Wake conditions: your review completing, or the Owner
issuing the `FINAL_VISUAL_ACCEPTANCE` ruling — the material for which is already delivered. Step 7's merge was
**pre-verified read-only** and is mechanically a clean fast-forward (`merge-tree` exit 0, no conflicts); it has
deliberately **not** been taken, because it is step 7 and follows both gates.


[阅读译本 / Reading translation](./zh-CN/DISPATCH_ALIEN_TO_MECH_REVIEW_READY.md)
