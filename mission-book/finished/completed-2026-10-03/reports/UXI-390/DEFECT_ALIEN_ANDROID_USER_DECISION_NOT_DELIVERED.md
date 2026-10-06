# DEFECT — UXI-390 / UXI-301 Android: the user-decision control has no backend call to make

```text
FROM = Alien (UXI-390 development host)   TO = Mech (UXI-390 review host, when I declare complete)
CLASS = implementation gap on the Android surface, not a probe artefact
GATE  = UXI-301/UXI-390 require that the switch and no-switch paths REALLY EXECUTE and that the user's
        choice REALLY REACHES THE BACKEND. On Web both are driven and pass. On Android this item is NOT MET.
```

## The symptom, measured

On a real device against a real gateway with a live connection verified immediately before the tap:

- the panel renders the decision state — `Waiting for your decision`, with `Confirm`, `Keep waiting`, `Cancel`
- the `Confirm` label is a `TextView` with `clickable=false` but **`enabled=true`**, and **exactly one**
  clickable node contains its centre: an `android.view.View`, `enabled=true`
- the probe taps **that** node, by coordinate, not the label
- **no `actor=user` event appears for any task** — verified by querying *every* user-actor event in the
  city, so the filter-artefact explanation is excluded. The only two user events in the city are
  `TASK_PROVIDER_CHOSEN` against tasks from **earlier API-driven probes**
- the gateway never exited, and the decision state **persists** after the tap

## The mechanism, pinned by reading the code

The **web** surface makes a real backend call for this action:

```text
apps/web/scheduler.js:34   CHOOSE_PROVIDER -> POST /api/v0/tasks/:id/provider-choice,
                           "a real route added for this task"
```

The **Android** client does not:

```text
apps/android/.../CityClient.kt:112   fun cancel(id) { ... request("tasks/$id/cancel", ...) }
```

`cancel` is the **only** task action the Android client implements. A recursive search of every `.kt`
under `apps/android` for `provider-choice`, `providerChoice` or `switch-declined` returns **nothing**.

And `SchedulerPanel`'s action parameter is a **no-op by default**:

```text
SchedulerPanel.kt:40    onAction: (taskId: String, token: String) -> Unit = { _, _ -> },
SchedulerPanel.kt:107   TextButton(onClick = { onAction(taskId, action.token) }) { Text(action.label) }
```

So the buttons are rendered from the presentation feed's `actions` list — which correctly includes
`CONFIRM`, and is why the control is genuinely clickable and enabled — while **no code path exists to
deliver that choice anywhere**. The control is real; the wire behind it is not connected.

## What I could NOT confirm, stated so it is not overclaimed

I could not locate a **call site** that invokes `SchedulerPanel(...)` anywhere in the Android sources,
even though the panel demonstrably renders on the device. My recursive search returned no invocation at
all, which I cannot reconcile, so I am recording it as an unexplained gap in my own inspection rather
than as a fact about the code. It does not change the finding: the endpoint reference is absent either
way, and the measured absence of any user event is independent of it.

The other residual is unchanged and narrow: `input tap` sends a down-up pair, and I have not proven this
control's handler would respond to a synthetic tap. But a handler that existed and simply missed a
synthetic tap would still leave no *route* to `provider-choice`, which the code search shows is absent.

## What this means for the gate

Android's scheduler surface is **verified to render correctly** — state labels in user language, providers
carrying reasons, the three-way distinction between a usable pool, a merely busy pool and a pending
decision, a collapsed Advanced section, no contract-token leakage, and truthful degradation on executor
and connection loss. What is **not** met is the user-decision path: it renders, and it does not deliver.

I am recording this as **NOT MET** rather than as passed, and I am **not** repairing it before declaring
development complete without saying so plainly to the Owner, because adding a new backend call to the
Android client is a product change rather than an evidence fix, and UXI-390's remaining scope should be
decided with this gap on the table.

## Reproduction

`mission-book/reports/UXI-390/PROBE_uxi390_android_confirm2.ps1` — published verbatim, two nodes with
`PROBE_uxi390_node_b.mjs`, prints the UI-tree attributes, the tap target, the target task's events, and
*all* user-actor events in the city. Mech can re-run it on another host and either reproduce the absence
or refute it.


[阅读译本 / Reading translation](./zh-CN/DEFECT_ALIEN_ANDROID_USER_DECISION_NOT_DELIVERED.md)
