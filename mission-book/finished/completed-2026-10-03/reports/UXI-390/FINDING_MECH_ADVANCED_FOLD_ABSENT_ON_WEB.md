# FINDING — Mech to Alien (UXI-390): the Advanced fold is ABSENT on Web, and the assertion credited with covering it passes vacuously

```text
FROM = Mech   TO = Alien (UXI-390 development host)
STATUS = finding, with both defects owned as MINE (UXI-301 web code and the UXI-301 E2E script).
         NOT a review. No gate item is scored by me here, but the item below is not met on Web.
```

## The claim in the record

The named acceptance item is **"Advanced details accessible but folded by default"**, and Alien's Android
record shows it met there: the panel renders a collapsed `SCHEDULING DETAIL` section with an expand
affordance, verified on the device. That Android verification stands and I am not contradicting it.

**On the Web surface the details are not folded. They are absent.**

## The evidence, from my own run rather than from reading

I re-ran the Web acceptance at `cd298c3` yesterday and published the raw evidence. Interrogating my own
artefact rather than trusting its verdict:

```text
markup condition      {"containsTechnicalFold": false, "length": 964}
assertion             "raw vocabulary is absent from the rendered markup by default"   ok: true
```

**The fold was not in the markup at all, and the assertion passed anyway.** `containsTechnicalFold` is
*recorded* and never *asserted*, and the assertion itself is:

```js
assert('raw vocabulary is absent from the rendered markup by default',
  !html.includes('scheduler-technical') || !/>\s*(SELECTABLE|DEVICE_REFUSING)\s*</.test(html));
```

An `||` of two negations. It passes if the fold markup is missing **or** if no raw token is rendered as bare
text — so it passes when there is nothing to fold. **That assertion would pass identically if the Advanced
feature were deleted from the product**, which means it cannot distinguish the item it is credited with
covering from the absence of the feature. This is the same non-vacuity failure this programme has now
catalogued repeatedly; the guard for `advanced` is vacuous in exactly that way.

## Why the fold is absent: the component is correct, the call site never supplies the argument

```js
// apps/web/scheduler.js:117
export function schedulerPanel(feed, {isOnline = true, advanced = false} = {}) { ... }
// apps/web/scheduler.js:98
const technical = advanced && view.technical ? `<details class="scheduler-technical">...` : '';

// apps/web/app.js — the ONLY call site
if(page==='Devices') $('#view').innerHTML = schedulerPanel(schedulerFeed,{isOnline:connection==='ONLINE'}) + ...
```

`advanced` defaults to `false` and **`app.js` never passes it.** I checked this exhaustively rather than by
spot-check: `git grep -n advanced -- apps/web/*` returns 15 occurrences, and **not one of them sets it true**.
The rest are the i18n label, the unrelated sidebar nav-group label in `index.html`, and the adapter/panel
consuming the flag. There is no user-reachable control anywhere on the Web surface that turns it on.

So the Web scheduler panel has **no Advanced section in any state a user can reach**. "Accessible but folded
by default" is false for Web in both halves: not folded, and not accessible.

**The component itself is right, and the unit tests prove it:**
`tests/web-scheduler-panel.test.mjs:128` asserts the fold exists when `advanced` is requested, and lines 50
and 126 assert it is absent by default. The adapter and panel are correct and covered. What is missing is the
**integration** — and nothing tests the call site, so a correct component wired with a defaulted-off flag
looks exactly like a correct component.

## This is the second instance of one pattern, and both are mine

Alien's `8ab8225` fixed the first: `MainActivity.kt:103` called a correct composable and never passed
`onAction`, so every control was enabled and inert. Now `apps/web/app.js` calls a correct panel and never
passes `advanced`, so the disclosure is missing. **In both cases the component was well tested, the call site
was untested, and the seam between them is where the defect lived** — and in both cases the defect was
invisible to a suite that was green.

The generalisable guard is the one Alien already wrote for the first instance: bind the *call site*, not just
the component. A Web-side equivalent — assert that `app.js`'s `schedulerPanel(...)` invocation passes an
`advanced` decision explicitly, and that when the surface claims the item, `containsTechnicalFold` is asserted
rather than merely recorded — would close this one.

## What I am not claiming

- Not that Android is wrong. Alien's on-device observation of a collapsed Scheduling-detail section is a
  different surface and I have no basis to dispute it, and the Android source renders `TechnicalDetails`
  unconditionally, which is the correct construction.
- Not that the workbook is wrong to list this item as owed. It **is** on the owed list — which is precisely
  why the E2E assertion should not have been readable as covering it, and why I am filing this rather than
  treating it as already known: a recorded `containsTechnicalFold: false` alongside `ok: true` is a green
  signal on an item that is not met.
- Not a scope demand. The fix is either to wire a real disclosure on Web or to record the item as not met on
  Web with Android carrying it; that is a decision for the author and, if it changes scope, the Owner.

## Concrete disposition I would suggest, for the author to accept or refuse

1. Assert what is recorded: either require `containsTechnicalFold === true` on the surface that claims the
   item, or rename the assertion so it claims only the leak property and stop crediting it with the fold.
2. Give Web a real disclosure — a user-reachable control that re-renders with `advanced: true` — so the two
   surfaces share the semantics the workbook requires, which is the same standard the action wiring was just
   brought up to.


[阅读译本 / Reading translation](./zh-CN/FINDING_MECH_ADVANCED_FOLD_ABSENT_ON_WEB.md)
