# VERIFICATION — Mech: the Advanced-fold finding is CLOSED at `40bd118`, and the fix is stronger than I proposed

```text
FROM = Mech   SUBJECT = closure of FINDING_MECH_ADVANCED_FOLD_ABSENT_ON_WEB.md
BOUND TREE = 40bd11811c2170446e14335d10aa3ba1f66d31f7   (verified by git rev-parse, not by ref name)
STATUS = verification of a fix. NOT a review. No gate item scored by me.
```

## The before-and-after is the same recorded field

The finding was that my own E2E assertion passed **vacuously** while the fold was absent. So the cleanest
evidence is the field my run recorded then and now:

```text
at cd298c3   containsTechnicalFold: false   markup length  964   assertion "raw vocabulary absent" ok: true
at 40bd118   containsTechnicalFold: true    markup length 1349   10 of 10 assertions pass
```

`false` alongside `ok: true` was the defect; `true` alongside a passing suite is the repair. The recorded
condition and the assertion now agree.

## The fix is better than what I asked for

I proposed requiring `containsTechnicalFold === true` or renaming the assertion so it stopped claiming the
fold. Alien did both, and added the half I had not asked for. The single vacuous assertion is replaced by
three, which is the correct decomposition of the item's own wording — **"accessible but folded by default"**
is two properties, and I had only argued for the first:

```js
assert('the technical fold is PRESENT, not absent', html.includes('scheduler-technical'));
assert('the technical fold is COLLAPSED by default', /<details class="scheduler-technical"(?![^>]*\bopen\b)/.test(html));
assert('no bare raw scheduler token is rendered', !/>\s*(SELECTABLE|DEVICE_REFUSING)\s*</.test(html));
```

The middle one is the one I missed: "folded by default" means the disclosure exists and is **not** open, and
the negative lookahead pins the absence of the `open` attribute. My version would have accepted a fold that
rendered permanently expanded — which satisfies "accessible" and fails "folded by default". **Alien closed the
item I found and then closed the adjacent one I did not notice**, which is the second time in this task that
the other host's remedy has been the more complete one.

And the wiring is real rather than cosmetic: `app.js` now passes `advanced:true`
(`schedulerPanel(schedulerFeed,{isOnline:connection==='ONLINE',advanced:true})`), so the native `<details>`
disclosure is user-reachable on the Devices page. That is the third instance of the "correct component, no
caller" pattern being closed by wiring the call site.

## What this run establishes, and what it does not

- **Establishes:** the Advanced item is met on the **Web** surface at `40bd118`, and the assertion covering it
  can now fail — the fold's absence, or an expanded fold, would both break it. The other seven prior
  assertions still pass, so the fix regressed nothing.
- **Does not establish:** anything about the Android surface, which has carried this item correctly all along
  by rendering `TechnicalDetails` unconditionally. Nor is it a review verdict; the review still has to find
  problems of its own.

Raw evidence published beside this note as `EVIDENCE_MECH_web-e2e_at_40bd118.json`. As with my previous run, I
did **not** commit the harness's own output path — it writes to the tracked
`evidence/raw/mission-book/UXI-301/web-e2e.json`, and overwriting UXI-301's already-reviewed PASS record would
be the clobbering hazard this task has hit before. The branch was not modified; the worktree was discarded.

## Standing tally of the three-instance pattern

| # | instance | state |
|---|---|---|
| 1 | Android `onAction` never passed | **CLOSED** — `8ab8225` + `cd298c3`, mutation-verified |
| 2 | Web `advanced` never passed | **CLOSED** — `40bd118`, verified here by re-running the acceptance |
| 3 | `switch-declined` has no caller; accept has no endpoint | **OPEN** — filed, and the Owner's scope decision |


[阅读译本 / Reading translation](./zh-CN/VERIFICATION_MECH_ADVANCED_FOLD_CLOSED.md)
