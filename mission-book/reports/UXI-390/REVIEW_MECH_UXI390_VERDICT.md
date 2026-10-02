# REVIEW — UXI-390, by Mech, at `149a4c14b596b92f04fab6269eca1dcb7727303f`

```text
REVIEW HOST   = Mech        (section 3: Alien developed this task and cannot review it)
REVIEWED HEAD = 149a4c14b596b92f04fab6269eca1dcb7727303f   (recorded head == origin branch tip)
VERDICT       = REVIEW_COMPLETE - PASS WITH REQUIRED REPAIRS
```

## §7 reconciliation, run BEFORE the claim and clean

13/13. Recorded head == origin branch tip (read by `ls-remote`, not from the workbook); CI run 36998342105
`completed SUCCESS` on exactly that head on the right branch; the RS-290 contract byte-identical to
`origin/main 1a5bc0e`; evidence openable outside the gitignored `.runtime` (11 files); and the control-plane
checkout performing the reconciliation current with `origin/main`.

**Two defects in my own instrument had to be fixed before the claim, and are recorded because a clean
reconciliation from a broken instrument is worth nothing:** it selected the first run id mentioned in
`development_ci` rather than the run bound to the recorded head, and it read whatever the local checkout held
with no freshness check — which is how it reported 10/12, confidently, against a workbook that `origin/main`
had already superseded.

## Gate item by gate item — every MET below is MY measurement, not a restatement of the author's

**1. All old functionality still reachable — MET.** Root suite at the reviewed head: **1017 tests, 1015 pass,
2 fail**. The two failures are the pre-existing document-reader pair, and I did not take "pre-existing" on
trust: I ran **both failing tests at the untouched baseline `1a5bc0e`** and they fail identically there. A
suite total is not a regression check.

**2. UI no longer presents engineering console / monitoring dashboard as default language — MET.** On Web the
E2E asserts no raw scheduler token in the rendered explanation. On Android I swept the rendered text of
**every one of the six tabs** — 50 distinct strings — for all **22** RS-290 contract tokens: **none found**.
Both surfaces explain unavailability in user language.

**3. scheduler vNext really works — PARTLY MET, exactly as the author recorded.** The adapter, projection,
both surfaces and the choice round-trip I verified end to end at the reviewed head: the Web E2E's decisive
assertion is not a rendering claim, it is that the choice made in the UI **really reached the backend**,
recorded against the task with the node ref and a backend timestamp. The remote-handoff sub-item is **NOT
MET**, a deferral accepted by the Owner under the OPTION 1 ruling whose corrected reason is that the City
publishes no five-dimension load vector and unmeasured load is deliberately ineligible as an alternate. **I did
not re-litigate reachability**, per the handoff's explicit request and because the question consumed sixteen
rounds across both hosts, one of them my own withdrawn over-claim.

**4. Real dual-device E2E — MET, on evidence I produced.** That claim rested on two things I could not see:
an Android acceptance that only Alien had run, and a device count. Both are now independently established.
Web: **PASS 10/10** at the reviewed head against a real Gateway, a real reference node and the real UI.
Android: the first independent Android measurement of this task, on a **360dp** emulator — the panel renders
in user language, the 22-token sweep is clean, and the honest affordance is in the **pixels** (`Cancel` in the
live accent, `Choose another service` greyed), which is the `8ab8225`/`cd298c3` repair confirmed on the glass
rather than in the source. Dual-device: **two distinct registered devices** (`mech-node-a`, `mech-node-b`),
6/6 tasks COMPLETED, and **both devices observed as executors**. Note `main.mjs` passes no `id`, so two copies
register as one device — the two nodes had to be started with distinct ids to have two devices at all.

**5. Web/Android/Rooms visually consistent — MET WITH REQUIRED REPAIRS (C-1, C-2).** Rooms leg independently
confirmed: **PASS 5/5** — a real hub on an ephemeral port, all **10** rooms painted, **three** opened with the
rendered surface required to *change* each time, zero page errors. Cross-surface comparison of the **same
state** (Alien's 1440x900 capture vs my 360dp capture, both with the executor killed and work created after)
shows the header, state label, body copy, provider reason and the live/disabled affordance agreeing. Two
divergences are attributable to **this task's own code** and are the required repairs below.

**6. Owner final visual gate — MET, by the Owner's own ruling.** `owner_visual_ruling` records the gate passed
on the step-5 package with no change requested. This is the Owner's own step and not mine to score; recorded
as the Owner's.

**7. main hosted CI green — NOT MET by design.** Step 7's merge is deliberately withheld until both the
technical and visual gates pass. Merge authority is `true`, and the merge was pre-verified read-only as a
clean fast-forward.

**8. Final marker `UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED` — NOT MET by design.** Cannot precede 6
and 7.

## Required repairs

**C-1 — the same disclosure is named differently on the two surfaces, and the Android name is a literal.**

```text
Web     apps/web/i18n/en.js:55   "scheduler.advanced.summary": "Technical detail"      -> "Technical detail"
Android SchedulerPanel.kt:167    TechnicalDetails(rows, title = "Scheduling detail")  -> "SCHEDULING DETAIL"
```

The panel's own header comment states the surfaces render the same semantics **in the same words**. They do
not, and only the Web side is translatable.

**C-2 — the disabled choice explains itself on Web and not on Android.** Web renders
`Choose another service · nothing available to switch to` from `i18n/en.js:59`; Android renders the greyed
label with no reason. The reason is one line above on the provider row, so this is a divergence in the action's
copy rather than a loss of information — but it is still two renderings of one semantics, and "a disabled
control says why" is precisely the pattern this task spent several rounds establishing.

Both are cheap, both are in **UXI-301/UXI-390 code (mine by authorship)**, and neither touches the RS-290
contract. **I have not applied them.** A reviewer who edits the artefact under review becomes a co-author of
it, which this programme has already ruled against once when Alien declined to edit my workbook; and moving
the head would invalidate the CI binding I just verified. They are the author's to apply, or the Owner's to
waive, and I will confirm them afterwards.

## Recorded, NOT charged to this task

- **C-3** — the raw task id wraps into four lines and collides with the state label at 360dp. The layout is
  `SchedulerPanel.kt:86-88` (a `Row` with no width constraint), but the convention of showing a raw task id is
  the **frozen baseline's** (`1a5bc0e` renders ids on its own task surfaces). Narrow-screen coverage was
  explicitly the reviewer's to add.
- **V-3** — the three surfaces take three different localisation postures (Web English; Android English copy
  with a Chinese `展开`/`收起` from the shared frozen component; Rooms Chinese chrome with a bilingual nav and
  English room content). The same hardcoded string is *consistent* on Rooms and an outlier on Android. The
  components belong to **UI-190 and UI-103, both frozen and reviewed at specific bytes**, so this cannot be
  repaired inside UXI-390 without unpicking frozen work. It is an item-5 observation for the Owner.
- **A missed finding in the UXI-301 review, stated because it is mine to state:** C-1 and C-2 exist in the
  artefact Alien reviewed and passed for UXI-301 — the divergences were present then and were not caught. That
  does not disturb UXI-301's verdict, whose gate item was the handoff seam, but the review standard it was
  measured against did not include a same-words check between the surfaces, and it should have.

## Boundaries of this review, stated so nothing is over-read

- The Android measurement ran on an **emulator at 360dp**, not on Alien's physical device. Behaviour specific
  to that hardware — including its Chinese locale — is the author's evidence and I neither confirm nor
  contradict it.
- **I did not independently re-drive the Android device failure/recovery scenario** (`40f9665`). That leg
  remains the author's evidence. It is the one named acceptance property for which I have no measurement of my
  own, and I am saying so rather than letting the rest of this review imply coverage.
- Items 6, 7 and 8 are correctly recorded as not-yet rather than met, and I did not attempt to move any of
  them.
- A clean reconciliation is a precondition for a claim, never a verdict; and my repairs are zero, so the
  reviewed head is the head that was handed over.

## Evidence

`mission-book/reports/UXI-390/mech-review/` — `android-sweep.json` (6 tabs, every rendered string, the 22-token
search and its empty result), `android-panel-texts.json` and `android-panel-devices-360dp.png`
(sha256 `91bf81aa0d7d…`), `android-devices-360dp.png` (the **wrong-page first capture**, kept because deleting
the evidence of my own fault is how a review loses its value), `rooms-journey.json`,
`rooms-hub-mech-1440x900.png` (sha256 `9de7558c221d…`), `dual-device-mech.json`; plus
`EVIDENCE_MECH_web-e2e_at_149a4c1.json` and `EVIDENCE_MECH_web-e2e_at_cd298c3.json`.
