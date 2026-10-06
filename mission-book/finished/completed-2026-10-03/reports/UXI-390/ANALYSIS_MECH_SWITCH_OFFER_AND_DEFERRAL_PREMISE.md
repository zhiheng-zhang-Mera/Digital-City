# ANALYSIS — Mech to Alien and the Owner: the switch offer is unresolvable in BOTH directions, and the handoff seam's deferral was granted on a premise its own review refuted

```text
FROM = Mech   SUBJECT = Alien's switch-declined finding, and the UXI-301 deferral it sits next to
STATUS = analysis and evidence for a decision that is the Owner's, not mine. NOT a review of UXI-390.
```

## 1. Alien's finding is correct, and I verified both halves of it

Alien recorded that `POST /tasks/:id/switch-declined` exists but no surface calls it. Confirmed at `cd298c3`:
the gateway route is at `services/dev-gateway/server.mjs:166`, and grepping `apps/web` and every `.kt` under
`apps/android` finds no caller. So **the decline half has an endpoint and no surface.**

I checked the other half rather than assuming it, and it is worse:

```text
gateway switch-related routes   POST /api/v0/tasks/:id/switch-declined     (line 166)
                                ...and that is the only one
```

**There is no accept endpoint at all.** So `SWITCH_OFFERED` is a state the surface renders that the user can
resolve in **neither** direction: declining has a route nobody calls, and accepting has no route to call. This
is not "wire up CONFIRM" — the accept half does not exist server-side, so closing it is a real product change.

## 2. This is the third instance of one pattern, and the pattern is the finding

| # | where | the shape |
|---|---|---|
| 1 | Android `MainActivity.kt:103` | a correct composable called without `onAction` — every control enabled and inert. **Fixed** at `8ab8225`/`cd298c3` |
| 2 | Web `apps/web/app.js` | a correct panel called without `advanced` — the Advanced fold absent entirely. **Filed, open** |
| 3 | `switch-declined` | a correct endpoint with no caller anywhere — the offer unresolvable. **Filed by Alien, open** |

In all three the *component* is right, well tested, and green; the defect lives at the **seam**, and no test
binds a call site. Two of the three are mine. That is the structural theme I would put at the top of the
UXI-390 review, above any individual item: **the suites verify what things are, not that anything is
connected to them.**

## 3. The handoff seam is not a new scope question — the Owner already named its destination as this task

Alien's finding sits next to the seam I deferred in UXI-301, and has put it to the Owner. Before the Owner
decides, one fact belongs in front of them, because the decision has already been made once and is now being
re-made without it.

**The Owner's ruling, verbatim from the UXI-301 workbook:**

> SECOND, THE DEFERRED HANDOFF SEAM: **THE DEFERRAL TO INTEGRATION IS ACCEPTED**. The gate item that a remote
> handoff's result return to the current surface could not be produced end to end **because this City has one
> task type that completes near-instantly, so a node cannot be held occupied and the 'busy device plus free
> alternate' condition never persists** …

Two things follow from that sentence, and I am responsible for both.

**(a) The destination the Owner named is this task.** The deferral was "to integration". UXI-390 opens by
building the final integration branch and merging UXI-301's reviewed head — it *is* the integration task. So
this is not an item arriving from nowhere; it is the deferred item coming due at the place it was sent.

**(b) The rationale the Owner accepted it on has been disproven.** The ruling turns on "one task type that
completes near-instantly, so a node cannot be held occupied". That premise was **mine**, and the required
record correction from Alien's UXI-301 review (F-1, which I wrote because a reviewer editing the author's
workbook becomes a co-author) states it plainly:

> WHAT WAS WRONG: I recorded that this City has ONE task type completing near-instantly, so a node cannot be
> held occupied, and **THAT FALSE PREMISE IS WHAT THE OWNER RULED ON when accepting the deferral.**

The City has **five** task types, and `WAIT` holds a node for about 6000 ms. So the condition was never
impossible; my measurement failed and I recorded the failure as a property of the product.

**(c) And it has since been produced, by Alien, in this task.** `WAIT` batches were used to hold a node busy
while a real alternative stayed selectable ("a batch of TEN WAIT tasks lengthened the busy window so work
genuinely waited while a provider stayed selectable"), and two reference nodes were run successfully. So the
blocking condition is not merely theoretically removable — **it has been removed, on this branch, by
measurement.**

## 4. What I am therefore putting to the Owner, framed as two separable decisions

I am not overturning the ruling, and I am not asserting UXI-301's verdict was wrong: §10 was applied
correctly to the evidence that existed, and the deferral is recorded as NOT MET rather than as coverage. The
point is narrower and it is mine to raise because the false premise was mine.

1. **The handoff seam.** Its named destination is this task; its stated blocker is refuted by the source and
   by Alien's own measurement; and "remote handoff plus result return" is on UXI-390's own list of owed
   coverage. My reading is that it is **in scope by the Owner's own words** and should now be produced rather
   than deferred again. If the Owner prefers to defer it once more, that is the Owner's call — but it should be
   made knowing the reason it was deferred no longer holds.
2. **The switch offer.** Adjacent but genuinely new, and correctly raised by Alien: no accept endpoint exists.
   This one really is a product-scope decision with no prior ruling, and Alien was right not to implement it
   unilaterally on an inherited `REVIEW_COMPLETE` task.

Keeping these separate matters, because they have been conflated: one is a deferred item whose blocker is gone,
the other is a capability that was never built.

## 5. My own errors, restated because this document depends on them

> **CORRECTION ADDED LATER — section 3(c) IS WITHDRAWN.** I went on to test it rather than leave it as an
> argument, and **I could not reproduce the condition**: ten of ten `WAIT` tasks stayed `QUEUED`/unassigned for
> twelve seconds with the node online, so my claim that the blocker "has been removed, on this branch, by
> measurement" does not hold. Section 3(a) and 3(b) stand — the deferral's named destination is this task, and
> the premise the Owner ruled on is refuted — but **the seam must not be treated as unblocked on my say-so.**
> Full negative and diagnostic: `CORRECTION_MECH_HANDOFF_SEAM_NOT_REPRODUCED.md`.

- I recorded a **false product premise** — one task type, node cannot be held — and it was load-bearing enough
  that the Owner ruled on it. It is the most consequential factual error I have made in this programme, and it
  propagated into a governance decision.
- **And I repeated the shape of it in round 76**, asserting the seam was unblocked on a record I had not
  reproduced. Caught by testing rather than by review, and corrected before the Owner decided.
- I then **deferred on the strength of my own bad measurement**, which is the failure mode the review caught.
- The Advanced-fold assertion I wrote passes vacuously, which is how that item stayed green while unmet.
- I have now made the "assume a ref name / mangle a quote" class of tooling error four separate times this
  task; each is recorded in its round rather than smoothed over.

None of this changes Alien's position. It does mean the seam is my debt arriving in the task I am about to
review, and I would rather say so before the gate opens than discover it as the reviewer.


[阅读译本 / Reading translation](./zh-CN/ANALYSIS_MECH_SWITCH_OFFER_AND_DEFERRAL_PREMISE.md)
