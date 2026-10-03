# UXI-390 — COMPLETION-GATE AUDIT (Alien, development host)

```text
AUTHOR = Alien     STATUS = development IN_PROGRESS, development_complete NOT declared
PURPOSE = state every gate item as MET / NOT MET with its evidence, so the two OPEN OWNER DECISIONS below
          can be taken on facts rather than on a summary. Nothing here is a review; the review is Mech's.
```

## Gate item by gate item

| # | workbook requirement | verdict | evidence |
|---|---|---|---|
| 1 | All old functionality still reachable | **MET** | root suite 1017 tests, 1015 pass, 2 fail — the 2 pre-existing `CORRUPT_INPUT` pair, present at the frozen baseline |
| 2 | UI no longer presents engineering console / monitoring dashboard as the default language | **MET** | panel renders user language on both surfaces; no RS-290 contract token leaks — verified by a 22-token sweep across the full rendered text on Android, and by markup assertions on Web |
| 3 | scheduler vNext really works | **PARTLY MET** | the adapter, projection, both surfaces and the choice round-trip work and are driven; **the handoff sub-item is NOT MET — see the deferral below** |
| 4 | Real dual-device E2E | **MET** | both gate paths driven on the integration branch: Web E2E PASS 10/10, Android device acceptance driven, recovery 3/3 in the RS-290 baseline carried into this tree |
| 5 | Web/Android/Rooms visually consistent | **MET for Rooms coverage** | the Rooms surface journey is driven in a real browser: ten rooms painted, three opened with a measured surface change, zero page errors. Rooms data endpoints and UI modules driven for five rooms. Visual *consistency* across the three surfaces is the visual critic's, and that role is Mech's by §3 |
| 6 | Owner final visual gate passes | **NOT MET — awaiting the Owner** | this is the Owner's own step; nothing Alien can do closes it |
| 7 | main hosted CI green | **NOT MET — by design** | the merge is step 7 and is deliberately withheld until the review and the visual gate; branch CI is green (36988292501, both jobs) |
| 8 | Final marker `UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED` | **NOT MET — by design** | cannot be claimed before 6 and 7 |

## The two OPEN OWNER DECISIONS

**DECISION A — the deferred remote-handoff seam.** Resolved this round by reading the code: the City
publishes **no five-dimension load vector**, and `pressure.mjs` states that **unmeasured load is NOT idle and
such a device is NOT eligible**. So no alternate can ever be eligible, `ALTERNATE_DEVICE` is unreachable, and
the seam **cannot be produced in this City**. `SWITCH_OFFERED` *is* producible and was produced.

The deferral's **recorded reason is wrong** (there are five task types; `WAIT` holds a node ~6 s, measured and
reproduced). The deferral is nonetheless **correct**. Options:

1. **Keep the deferral with the reason corrected**, gate item staying explicitly **NOT MET**; or
2. **Decide the City should report a real load vector** — a new capability, hence a new task.

**DECISION B — the switch/no-switch decision path on the surfaces.** `POST /api/v0/tasks/:id/switch-declined`
exists on the backend and **is called by no surface**: grepping `apps/web` finds the server only, and every
Kotlin file under `apps/android` returns nothing. Web renders `CONFIRM` as a **deliberately unwired note**;
Android now renders it **honestly disabled**. So a user is shown an offer they can neither accept nor decline.
Options:

1. **Wire accept/decline controls on both surfaces** (accept has **no endpoint** today, so this is product
   work); or
2. **Record it as a second deferred seam** with the gate item explicitly not met.

Both decisions change what the product *is*, not what the harness does, which is why neither is taken
unilaterally on a task inherited from a `REVIEW_COMPLETE` predecessor.

## What is fully done and needs no more work

- **The integration baseline**: `uxi/UXI-390-final-product-acceptance`, byte-identical to UXI-301's reviewed
  head at the point of merge, so the UXI-301 review evidence carries rather than being invalidated.
- **The honesty fault**: unrouted actions are not offered as live on either surface, with a **mutation-verified**
  parity guard for the action wiring and a runtime guard for the no-handler case. Both surfaces agree.
- **The Advanced fold**: present and collapsed by default on **both** surfaces, with the vacuous assertion
  that hid it replaced by three that can each fail.
- **Device failure and recovery**: driven on a real device on a **controlled, asserted** population.
- **The Rooms surface**: driven in a real browser with an anti-vacuity precondition.
- **The control plane**: reconciliation 12/12 on the recorded head.

## Method debt, recorded because it is the honest cost of this task

Sixteen rounds across both hosts were spent on the handoff, and **most of them were spent on the instrument
rather than on the product**: ports, data directories, node-registration races, a patch whose anchor silently
no-op'd, and an assertion that read the working tree instead of the branch. The eventual answer came from
**reading one comment in the code**. That is recorded as the lesson it is: several of the longest detours in
this task would have been avoided by reading the interface before building a probe around an assumption about
it.
