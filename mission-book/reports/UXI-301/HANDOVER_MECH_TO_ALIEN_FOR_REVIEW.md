# DISPATCH — Mech to Alien: UXI-301 development complete, released to Review, and the Owner ruled YOU are eligible

```text
FROM = Mech   TO = Alien
BRANCH = uxi/UXI-301-scheduler-status-into-product-ui
HEAD   = 1c516b6   CI = 36972345821 success (android + gateway-web)
RULING = Owner: Alien reviews UXI-301; the handoff seam deferral is accepted
```

## First, the thing you should know before you claim

You wrote in your own claim-race record that UXI-301's Review "must not be Alien's" and symmetrically that
you must not review Mech's development either. That reading would have left **no eligible reviewer at all**,
which is §5.2 structural ineligibility and the one thing that could have stopped this task from ever
completing. So I put it to the Owner rather than deciding it, and **the Owner ruled that you review it.**

The reasoning, since you are the one being asked to act on it: §3 requires only that Development and Review
be done by **different physical hosts**. You *attempted* to claim UXI-301, **lost by 24 seconds, and
withdrew** — so you never developed this task and the rule as written does not disqualify you. Your
self-exclusion was stricter than the rule. That is the Owner's call, not mine, and it has been made.

## Second: what is NOT met, stated before you look for it

**One gate item is deferred by name and is NOT claimed as passed.** The workbook requires that a remote
handoff's result return to the current surface. It could not be produced end to end, and the reason is on
the **City** side, not in the UI:

```text
four attempts; the fourth MEASURED it:
  a batch of TEN tasks created in parallel, their device torn down IMMEDIATELY
  -> ZERO of ten survived as assigned and in flight
cause: the City has ONE task type, it completes effectively instantaneously, and the City
       assigns and executes inside the node's claim, so a node cannot be HELD occupied
consequence: "busy device + free alternate" never persists, so the planner is never asked the
             routing question that reaches ALTERNATE_DEVICE
counter-evidence that the gap is on the City side: the planner DOES return
       withoutDecline=SWITCH_OFFERED and withDecline=ALTERNATE_DEVICE when given the condition
```

The Owner accepted the deferral to integration. §10 permits deferring a real cross-device seam with the
exact pending seam recorded, and it states plainly that **deferred ≠ passed** — so please treat that item as
an open integration seam, not as coverage. Both failure records and the reproducing script are committed as
evidence.

## What IS driven, so you can spend your review on the substance

| what | how it was driven | evidence |
|---|---|---|
| Web E2E, real conditions | real gateway + real node + real browser; executor killed, real work created through the UI, executor restored | `web-e2e.json` (8/8) |
| the switch path really reaching the backend | the selectable provider's own control clicked in the live page, backend read back | `web-e2e.json` |
| Android real acceptance | real APK from this head on a real device image, executor killed, surface captured | `android-real-acceptance.json` (8/8) |
| real concurrency, device busy, provider unavailable | each driven separately against a real gateway and real node | `named-cases.json` (11/11) |
| switch offer + decline | two real nodes; the offer reaches the surface, the decline is recorded as a real user intent | `route-stage-case.json` (6/6) |
| hosted CI | every head on this branch green | run `36972345821` on `1c516b6` |

## What I would attack if I were reviewing this

Offered because §3 says a Review must independently find problems, and these are the places I would look
first if I did not know the code:

1. **The adapter's vocabulary is a copy.** `serveWeb` serves only `apps/web`, so the browser cannot import
   the RS-290 contract and both surfaces hold their own tables. The JavaScript table is asserted against the
   contract, and the Kotlin table is asserted by a test that PARSES the Kotlin source — but two copies is two
   copies, and the parity tests are the only thing holding them together.
2. **`ACTION_WIRING` is a single table read by both the renderer and the dispatcher.** If it is wrong, the
   panel and the click handler are wrong together, and no test compares it to the contract's action list
   beyond the coverage assertions.
3. **`CONFIRM` is rendered DISABLED because no route exists.** That is deliberate and labelled, but it is a
   contract action the UI cannot honour, which a reviewer may reasonably call incomplete rather than honest.
4. **The producer's capacity model excludes a task from its own node's count.** That is what stops a running
   task rendering as QUEUED, and it is the kind of rule that looks arbitrary until you see the failure it
   prevents — worth a test of your own construction.
5. **The remote-handoff seam above**, which I would check really is a City limitation rather than an artefact
   of how I sequenced the attempts. The ten-task measurement is the evidence; attack the measurement.

## Claiming it

`development_host: Mech`, `development_complete: true`, `review_host: null` — so the Review is yours to
claim. I have not set `review_host`, because that is your claim to make.
