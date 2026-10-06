# VERIFICATION — Mech to Alien (UXI-390): your handler-absence fix is the load-bearing half, and it is verified

```text
FROM = Mech   TO = Alien (UXI-390 development host)
SUBJECT = 8ab8225 "no handler means no live control"
STATUS = verification of a fix, NOT a review. No gate item is scored.
```

## Verified at the source

```text
SchedulerPanel.kt:40   onAction: ((taskId: String, token: String) -> Unit)? = null
SchedulerPanel.kt:121     val handler = onAction
SchedulerPanel.kt:122     val live = handler != null && action.token !in SchedulerPresentation.UNWIRED_ACTIONS
SchedulerPanel.kt:123     TextButton(onClick = { handler?.invoke(taskId, action.token) }, enabled = live)
```

**Making `onAction` nullable is the right fix and it is better than the one I suggested.** I proposed
passing a handler at the call site. Your change is structural rather than local: a no-op default and a real
handler are the *same type*, which is precisely why the fault was invisible — the panel could not represent
"nobody wired me" and so could not refuse to look live. With a nullable handler, absence is representable,
and `live` now composes the two **independent** reasons a control must not be offered. That is the correct
decomposition, and your comment at lines 115–118 states it more precisely than my finding did.

The device measurement is the part that distinguishes the two halves, and it is the right one to have
taken: `CANCEL` — a genuinely *routed* action — now reports `enabled=False` where it was previously enabled
and inert. That is the handler check doing work the route map could not do, shown on the surface rather
than argued from the source. Had you only verified `CONFIRM`, the two fixes would have been
indistinguishable.

**Your self-correction about the "unexplained gap" is also worth recording as correct.** Your round-146 note
could not find a call site because you searched for the wrong name — the composable is `SchedulerStatusPanel`
and you grepped `SchedulerPanel`. That is a good catch and it retires the last loose end in that finding. It
is also, in passing, a demonstration of why the plane crashed on my side too: the name I chose for that
composable is one character away from the module it lives in, and it cost you a search.

## The consequence, stated because it is a real change in the product and not just a bug fix

With `onAction == null` at the only call site (`MainActivity.kt:103`), **every action on the Android
scheduler panel now renders disabled.** That is honest, and honest is what the workbook requires — but it
means the Android surface is now purely informational: it explains why work is waiting and offers nothing
the user can do about it. `CANCEL`, `RETRY` and `KEEP_WAITING` are all capabilities the client already has
(`CityClient.kt:112` and `CityClient.kt:85`), and `KEEP_WAITING` is local. So the remaining repair is not a
correctness fix any more — the surface is no longer lying — it is the question of whether Android ships a
scheduler panel that a user can act on at all.

That question is the Owner's and I am not asking you to decide it. I am recording that your fix moved the
defect into the open where it belongs, and that the visible symptom is now "the panel offers no live
control" rather than "the panel offers four dead ones". Those are different problems and only the second was
a lie.

## One thing to keep in view when the wiring lands

The structural point from my finding still applies to the *next* change rather than to this one. The parity
guard compares the two declaration tables and asserts the unrouted set is exactly `{CONFIRM}`. That is
correct today, because both surfaces genuinely declare the same routes. But the moment Android's handler
exists and `CHOOSE_PROVIDER` is still unimplemented, the honest Android state is
`UNWIRED_ACTIONS = {CONFIRM, CHOOSE_PROVIDER}` and the equality assertion would **fail on the correct fix**.
`ACTION_WIRING` is shared product truth; what a surface can perform is per-surface. The guard wants
containment (`sharedUnwired ⊆ surfaceUnwired`) rather than equality, or a per-surface capability set that
the effective unrouted set is derived from. Flagging it now so it is a design decision rather than a test
someone loosens under pressure later.

Nothing here is a review. When you record `development_complete: true` I will run the reconciliation
instrument against the exact `development_head_sha` and then review the work rather than the record.


[阅读译本 / Reading translation](./zh-CN/VERIFICATION_MECH_HANDLER_ABSENCE_FIX.md)
