# CORRECTION — the Android fault is UI HONESTY, not a missing feature

```text
FROM = Alien (UXI-390 development host)
RE   = DEFECT_ALIEN_ANDROID_USER_DECISION_NOT_DELIVERED.md, and round 146's workbook field
STATUS = round 146's framing is PARTLY WRONG and is corrected here. The finding survives; its
         description does not.
```

## What I got wrong

Round 146 reported "the Android user-decision control has no backend call to make" and pinned a missing
`provider-choice` call in `CityClient`. **That framing is wrong for the control I actually tapped.** I
inferred a defect from a symptom without first reading the design intent, which is the exact error this
programme has now catalogued ten times — and it was mine again.

## What the design actually says

The web surface carries an explicit wiring map, and `CONFIRM` is declared **deliberately unrouted**:

```text
apps/web/scheduler.js:44   CANCEL:          {kind: 'backend', route: 'cancel'}
apps/web/scheduler.js:45   RETRY:           {kind: 'backend', route: 'create'}
apps/web/scheduler.js:46   KEEP_WAITING:    {kind: 'local',   route: null}
apps/web/scheduler.js:47   CHOOSE_PROVIDER: {kind: 'backend', route: 'providerChoice'}
apps/web/scheduler.js:48   CONFIRM:         {kind: 'unwired', route: null}
apps/web/scheduler.js:37   *  CONFIRM -> NO ROUTE EXISTS YET, so it is rendered disabled and labelled
                              rather than as a button
apps/web/scheduler.js:78   if (wiring.kind === 'unwired') {
apps/web/scheduler.js:79     return `<button ... disabled aria-disabled="true"
                                        data-scheduler-unwired="${...}">`
```

So on **Web**, `CONFIRM` is rendered as a **disabled, labelled, non-button** element that announces it is
not yet wired. That is the honest treatment of an action with no route, and it is consistent with the
programme's own rule against presenting an unavailable thing as actionable.

**Therefore the tap I measured producing no user-actor event was CORRECT BEHAVIOUR.** There is no route,
so there is nothing for the backend to record. My round-146 claim that the absence of a user event proved
a delivery gap was an inference from a symptom, and the design intent refutes it.

## What the real fault is

Android has **no equivalent treatment**. A recursive search of the Kotlin sources for `unwired`, `NO
ROUTE` or any action-wiring map returns **nothing**: the Android panel renders every action in the feed
as a live control:

```text
SchedulerPanel.kt:107   TextButton(onClick = { onAction(taskId, action.token) }) { Text(action.label) }
```

and that `TextButton` was measured on the device as **`clickable=true`, `enabled=true`** for `CONFIRM`.
So Android presents an action that **cannot work** — because it has no route by design — as an **enabled,
tappable button**, while the web presents the identical action as disabled and self-describing.

**The defect is therefore UI honesty, not a missing feature:** the two surfaces disagree about how to
present an action that has no backend route, and Android's choice misrepresents it as available. That is
sharper, better supported, and closer to the workbook's own prohibitions than round 146's version.

It is also the *same invariant the Android panel already honours for providers*: this task proved, by UI
tree and by an observed no-op, that an unavailable **provider** entry is non-interactive. The panel gets
that right and gets the equivalent case for **actions** wrong.

## What survives from round 146, and what does not

**Survives, and is independently true:** the Android client implements `cancel` and nothing else — no
`provider-choice`, no `switch-declined` — while the web routes `CHOOSE_PROVIDER` to a real
`POST /api/v0/tasks/:id/provider-choice`. That IS a genuine gap: `CHOOSE_PROVIDER` **has** a backend route
and Android cannot call it. It is a different control from the one I tapped, and round 146 conflated them.

**Does not survive:** the claim that the silent `CONFIRM` tap evidenced a delivery failure. It did not.

**Still unexplained and still recorded as my own inspection gap, not a fact about the code:** no
`SchedulerPanel(...)` call site was found anywhere, though the panel renders on the device.

## The two candidate repairs, so the next decision is explicit

1. **Mirror the web's honesty.** Give the Android panel an action-wiring map with the same
   `unwired` kind, and render unrouted actions as disabled and labelled. Small, client-side, no contract
   change, and it makes the two surfaces agree — which is what the workbook asks of them ("Web and Android
   share SEMANTICS").
2. **Wire the supported actions that Android currently cannot perform** — `CHOOSE_PROVIDER`
   (`provider-choice`) and `RETRY`/`CANCEL` — so the controls that *can* work do. Also client-side, using
   routes that already exist.

These are not alternatives; the honest end state is both. (1) is the defect repair; (2) closes the
`CHOOSE_PROVIDER` gap. Neither requires changing the RS-290 contract, and both sit inside the Android
presentation-adapter boundary the workbooks allow.

## What I am not doing

I am not repairing either before declaring development complete without saying so, and I am not asking for
a ruling on scope that the workbooks already answer: UXI-390's own step 2 explicitly includes the
acceptance host committing fixes it finds. The question worth putting to the Owner is only whether UXI-390
should absorb (2) as well as (1), or whether the `CHOOSE_PROVIDER` gap should be carried as a recorded
deferral the way the remote-handoff seam was.

Reproduction is unchanged: `PROBE_uxi390_android_confirm2.ps1` with `PROBE_uxi390_node_b.mjs`.
