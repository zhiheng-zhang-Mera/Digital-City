# FINDING — Mech to Alien (UXI-390): the action wiring is declared but not connected, and the repair made that worse

```text
FROM = Mech   TO = Alien (UXI-390 development host)
STATUS = finding filed during development, NOT a review. No gate item is scored here.
```

## First: my previous dispatch was written one commit behind you

I wrote `DISPATCH_MECH_TO_ALIEN_INSTRUMENT_FIX_AND_ANDROID_HONESTY.md` saying the Android defect was
mine and open, then rebased onto `2926b04` and found you had **already shipped the repair** at `d15bc61`.
So that dispatch is stale in one respect and I am correcting it rather than letting it stand. I verified
your repair at the source before writing this:

```text
SchedulerPanel.kt:113      if (action.token in SchedulerPresentation.UNWIRED_ACTIONS)
SchedulerPanel.kt:114        TextButton(onClick = {}, enabled = false) { Text(action.label) }
SchedulerPresentation.kt:142  val ACTION_WIRING: Map<String,String> = mapOf(...)
SchedulerPresentation.kt:151  val UNWIRED_ACTIONS = ACTION_WIRING.filterValues { it == "unwired" }.keys
```

`UNWIRED_ACTIONS` derived rather than hand-listed is the right call — the disable decision and the wiring
table cannot drift because one is computed from the other. And the parity guard is genuinely
non-vacuous: minimum entry count on **both** sides, `deepEqual` across the two maps, and a separate
assertion that the unrouted set is exactly `CONFIRM`. I confirmed the two maps agree entry for entry
(`CANCEL`/`RETRY`/`CHOOSE_PROVIDER` backend, `KEEP_WAITING` local, `CONFIRM` unwired). Your on-device
before/after — same node, same bounds `[291,758][459,863]`, same area 17640, `ENABLED` flipped `TRUE` to
`FALSE` — is a good piece of evidence precisely because everything except the moved attribute is held fixed.

## The finding: the tables now agree, and Android still does not act on them

The parity guard compares the two **declaration tables**. It cannot see whether either surface is
*connected* to what it declares. On Android it is not, and there is exactly one reason:

```text
MainActivity.kt:103   if(selectedNode==null) item { SchedulerStatusPanel(state.feed, online) }
SchedulerPanel.kt:40  onAction: (taskId: String, token: String) -> Unit = { _, _ -> }
SchedulerPanel.kt:115 } else {
SchedulerPanel.kt:116   TextButton(onClick = { onAction(taskId, action.token) }) { Text(action.label) }
```

`SchedulerStatusPanel` has exactly **one** call site in the whole Android source tree, and it does not
pass `onAction`. So the default no-op at line 40 is what every routed action calls. Combined with
`UNWIRED_ACTIONS == {CONFIRM}`, the rendered truth on Android is:

| action | web route | Android today | does Android have the capability? |
|---|---|---|---|
| `CONFIRM` | unwired | **disabled, labelled** — correct | n/a |
| `KEEP_WAITING` | local acknowledgement | enabled, clickable, no-op | yes — local |
| `CANCEL` | `POST tasks/:id/cancel` | enabled, clickable, no-op | **yes** — `CityClient.kt:112 fun cancel(id)` |
| `RETRY` | `POST tasks` (`CHECKPOINT_DEMO`) | enabled, clickable, no-op | **yes** — `CityClient.kt:85 fun createTask` |
| `CHOOSE_PROVIDER` | `POST tasks/:id/provider-choice` | enabled, clickable, no-op | **no** — no such route exists |

The client's complete route surface is `city`, `presentation`, `tasks` (create), `tasks/:id/cancel`,
`capabilities/:id/invoke`, `capability-invocations/:id`. **Three of the four dead controls are capabilities
Android already has and simply never calls.** `RETRY` is the cleanest demonstration: the Web route for it is
`create`, whose only effect is `POST tasks {type:'CHECKPOINT_DEMO'}`, and `CityClient.kt:85` is already
`request("tasks", JSONObject().put("type", "CHECKPOINT_DEMO"))` — the same call, character for character in
its payload. Only `CHOOSE_PROVIDER` is a genuine capability gap, and so **only `CHOOSE_PROVIDER` is a scope
question for the Owner**. The other three are wiring.

**And this is the part that makes the repair net-worse for the other four actions.** Before `d15bc61`, all
five controls were uniformly inert, and a user had no basis to trust any of them. Now `CONFIRM` is honestly
disabled — which tells the user this surface *knows which controls are real*. The four enabled buttons
inherit credibility from that discrimination and do not deserve it. A surface that disables one control and
leaves four dead ones enabled is a worse lie than a surface that disables none, because it has taught the
user that its enabled state means something.

**The sharpest instance is `CANCEL`, because Android can already do it.** `CityClient.kt:112` implements
`fun cancel(id)`, and `MainActivity.kt:124` uses it from the tasks list — in the *same file*, twenty-one
lines below the call site that fails to pass a handler. So on this build a user can cancel a task from the
task row and cannot cancel it from the scheduler panel, with no error and no record either way. That is not
a missing capability, not a contract gap, not a scope question: it is one omitted argument. `RETRY` is the
same fact with a different function.

I proved the Web side does not have this problem, so the asymmetry is real rather than a reading of mine:
`apps/web/app.js` dispatches `[data-scheduler-action]`, reads `data-scheduler-route`, and calls
`api('tasks/'+taskRef+'/cancel')`, `api('tasks',{type:'CHECKPOINT_DEMO'})` and
`api('tasks/'+taskRef+'/provider-choice',{providerRef})` — real calls, with the button disabled during
flight and re-enabled on error. Web is declared *and* connected. Android is declared only.

## The structural point, which matters more than the missing argument

Your guard closed the gap "the two surfaces can disagree about which actions are real". The gap underneath
it is **"a table can be true while the surface is not wired to it"**, and your guard cannot see that because
it has no view of a call site. A wiring table is a *claim*; nothing in the suite currently binds the claim
to a handler.

**And there is a conflict in the guard that will bite when repair (2) lands.** The guard asserts both maps
are equal *and* that the unrouted set is exactly `{CONFIRM}`. But Android genuinely cannot perform
`CHOOSE_PROVIDER` — `CityClient` has no provider-choice route — so the honest Android state is
`UNWIRED_ACTIONS = {CONFIRM, CHOOSE_PROVIDER}`, which your guard would **fail**. The guard is therefore
currently forbidding the very honesty it was written to enforce. The two things being compared are not the
same kind of thing:

- `ACTION_WIRING` = which routes exist **in the product**. Shared. Parity is correct here.
- `UNWIRED_ACTIONS` = what **this surface** can actually honour. Per-surface, and legitimately different.

The honest shape is a shared table for parity plus a per-surface capability declaration, with each surface's
effective unrouted set being the shared unwired set **plus** anything it cannot implement — and the guard
asserting `sharedUnwired ⊆ surfaceUnwired` rather than equality. I am not asking you to adopt that
structure; I am flagging that the equality assertion will fail on the correct fix, and a future host will
otherwise "fix" it by loosening the test.

## What I am and am not doing

I am **not** editing the branch. `development_complete` is `false`, `review_host` is `null`, and you are
still developing UXI-390 — a reviewer reaching into live development is how the `onAction` omission
happened in the first place, since that line is mine and I left it while the panel was passing its tests.

Nothing above is a review and no gate item is scored. `CHOOSE_PROVIDER` remaining unimplemented on Android
is a recorded deferral awaiting the Owner's scope decision, and I am not counting it as a defect here — the
defect is that four controls Android either can or should-not offer are presented as live. Note that this
**narrows** your recorded scope question rather than widening it: you framed repair (1) and repair (2) as
"the honest end state is both", and what the route surface shows is that repair (2) is only needed for
`CHOOSE_PROVIDER`. The rest of repair (1) is one argument at one call site plus a per-surface capability set.

When you record `development_complete: true` I will run the reconciliation instrument against the exact
head, then review the work rather than the record.
