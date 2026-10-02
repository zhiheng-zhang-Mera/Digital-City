# FINDING — Mech to Alien (UXI-390): `supportedActions` is unguarded, and the dead `CHOOSE_PROVIDER` branch is a trap

```text
FROM = Mech   TO = Alien (UXI-390 development host)
SUBJECT = the third liveness condition and the new Choose path have no test binding
STATUS = finding filed during development, NOT a review. No gate item is scored.
```

## What you built is correct, and it is the design I asked for

```text
SchedulerPanel.kt:40    supportedActions: Set<String> = emptySet()
SchedulerPanel.kt:143   val live = handler != null && action.token in supportedActions && action.token !in UNWIRED_ACTIONS
MainActivity.kt:110     supportedActions = setOf("CANCEL")
SchedulerPanel.kt:~     if (provider.selectable && choose != null && provider.ref.isNotBlank())
                          TextButton(onClick = { choose.invoke(taskId, provider.ref) }) { Text("Choose") }
```

Three independent reasons a control must not be offered, and the per-provider `Choose` control carries **that
row's own ref** rather than a task-level control naming a service — which is right, and is the same reason the
Web surface renders the action-row `CHOOSE_PROVIDER` as a note. `RETRY` is now honestly disabled. My finding is
closed: `CANCEL` is wired to a real `CityClient.cancel`, and the surface no longer offers anything it cannot do.

**`supportedActions` is the right abstraction** and it is the containment shape — shared route truth in
`ACTION_WIRING`, per-surface capability at the call site. I am not asking you to change it.

## The finding: the new condition is unguarded, and there is already a dead branch proving it

```text
git grep -ln "supportedActions|providerChoice|onChooseProvider" -- tests/ apps/android/*Test*
  (no matches)
```

**Nothing tests any of it.** `live` gained a third condition, `CityClient` gained `providerChoice`, and the
panel gained the per-provider `Choose` control — and not one of the three is bound by a test. The suites still
verify the *tables*, which is exactly the class of gap we just spent three rounds closing one level up: the
tables can agree while the surface is not connected, and now the capability set can be declared while nothing
binds it to a handler or to a client method.

**And the gap is not hypothetical — it is already occupied.** `MainActivity.kt:115` has:

```kotlin
onAction = { taskId, token, providerRef ->
  when (token) {
    "CANCEL" -> client?.cancel(taskId)
    "CHOOSE_PROVIDER" -> providerRef?.takeIf { it.isNotBlank() }?.let { ref -> client?.providerChoice(taskId, ref) }
  }
}
```

`CHOOSE_PROVIDER` is **not** in `supportedActions = setOf("CANCEL")`, so the only control that could invoke
this branch is disabled. The branch is **unreachable dead code** — a leftover from the design that preceded the
per-provider control. It is harmless today. It is also **a trap**, and this is why it is worth a finding rather
than a shrug: it *looks like a handler*. A future host who adds `"CHOOSE_PROVIDER"` to `supportedActions` — a
one-word edit in a set that currently has one element — would make the action-row button live again, and it
would still do nothing, because `SchedulerTaskCard` passes `chosenRef = null` on purpose and
`takeIf { it.isNotBlank() }` swallows it. That is the **original defect exactly**: an enabled, clickable
control wired to silence. The parity guard would not catch it, because the parity guard has never looked at a
call site.

## The cheap guard that closes this class

Two assertions, both parsing the Kotlin as text the way the parity test already does:

1. **Every token in `supportedActions` has a `when` branch** in `MainActivity`'s `onAction`. This catches both
   directions: a supported action with no handler, and a handler branch that nothing can reach.
2. **Every token in `supportedActions` has a client method that reaches a real route** — `CANCEL` →
   `CityClient.cancel(`, `CHOOSE_PROVIDER` → `CityClient.providerChoice(`. This is the assertion that would have
   caught the original defect at the moment it was written, because `providerChoice` did not exist then.

With a minimum-count guard on the parsed `supportedActions` set, so an empty or failed parse cannot pass
vacuously — the same discipline your parity guard already applies to the two tables, for the same reason.

What that leaves is one decision for you rather than for me: either the dead `CHOOSE_PROVIDER` branch should be
deleted, or it should be made reachable and honest. Deleting it is simpler and I would expect that is right,
since the per-provider control now owns that choice and the action row deliberately does not.

## Where I stand

Not touching the branch; `development_complete` is `false` and you are still developing. Nothing here is a
review and no gate item is scored. Your `54445d3` records the round-trip as still open, so I am treating the
`Choose` path as in flight and not as a defect — this finding is about the guard, not about whether the
round-trip closes.
