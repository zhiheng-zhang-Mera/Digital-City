# Engineering Book — Utopia Pre-Assistant Terminal Closeout

> Date: 2026-09-30  
> Control repo: `zhiheng-zhang-Mera/Digital-City`  
> Implementation repo: `zhiheng-zhang-Mera/Utopia`  
> Owner-directed phase: **migration closeout → unified terminal foundation**  
> Binding ruling: [response-9-30.md#R12](../completed-2026-10-01/response-9-30.md#r12--migration-only-正式结束进入-pre-assistant-product-closeout)
>
> **This workbook deliberately stops before any personalized assistant/persona layer.**

---

## 0. Final objective

The migration phase is already complete. This workbook has exactly two goals:

1. **close the migration era as an immutable, auditable baseline**; and
2. **turn the already accepted Utopia capabilities into one coherent user-facing terminal skeleton**.

The terminal skeleton in this workbook contains only:

```text
T0  Migration closeout / freeze
T1  Rooms integrated into the normal Utopia shell
T2  Unified Action facade
T3  Deterministic Ask / Do entry
T4  Independent product acceptance + stop line
```

When T4 passes, stop.

Final state:

```text
PRE_ASSISTANT_TERMINAL_FOUNDATION_COMPLETE
```

This is **not** the “universal terminal complete” milestone and is **not** permission to continue into later assistant, connector, memory, proactive-agent, domain, or embodiment work.

---

## 1. Binding baseline truth

At workbook creation time, the following facts are already accepted and must not be re-opened merely to create more work:

### Digital-City / Mission Book

- MB-001..MB-009: implementation migration and verification are complete.
- MB-010..MB-012: `NO_VALUE / SKIPPED_NOT_REQUIRED`, with independent Alien re-verification under R11.
- Every enabled Mission MB-001..MB-012 has `verification_complete = true`.
- MB-010..012 provenance branches were merged into Utopia `main` under R11 **without implementation code**, and their original remote branches remain retained.
- No Mission may be silently reopened.
- No new donor migration Mission may be invented by a worker.

### Utopia

Baseline after R11 provenance closeout:

```text
UTOPIA_BASELINE_MAIN = d0dea7bcb66cf57edee73c67ddfb9526337dfb4e
R11_MERGED_MAIN_CI   = 36678805229 PASS
UNMERGED_BRANCHES    = 0 at the recorded R11 audit
```

Accepted product foundations already include:

- Web control surface;
- Android control surface;
- QR / mDNS / BLE / manual pairing;
- node state + telemetry;
- Task / Activity surfaces;
- Capability Bridge V0.3;
- V0.3 hardening;
- ten accepted Room Pack V1 tools;
- restart / recovery truth;
- typed failures;
- qualified identity;
- bounded invocation history.

The problem to solve is **product fragmentation**, not donor incompleteness.

---

## 2. Scope lock

### IN SCOPE

Only the following new product work is authorized:

1. normal Host lifecycle starts the existing Room Hub;
2. Web exposes the existing ten Rooms as part of the normal Utopia shell;
3. Android can at minimum observe Room availability through the supported authenticated product path;
4. one canonical user-facing `Action` facade adapts existing backend truths;
5. Web and Android consume the same Action truth;
6. one `Ask / Do` entry uses deterministic routing for the already existing capabilities;
7. side-effect confirmation, ambiguity handling, refusal, failure and provenance are visible and truthful;
8. independent real-device / real-host acceptance.

### OUT OF SCOPE — HARD STOP

The worker must **not** implement any of the following in this workbook:

- personalized assistant identity, persona, character, relationship model, or assistant-specific policy;
- assistant/private long-term memory;
- autonomous/proactive personal-agent behavior;
- LLM-based intent router;
- Boss connector;
- Hns connector;
- Digital-Me integration;
- Health / Quant integration;
- new Room #11 or later;
- new domain capability invented only to make routing look complete;
- arbitrary shell execution;
- expansion of the deferred full desktop/browser Computer-Use runtime plane;
- voice / avatar / wearable / AR / VR;
- cloud/public-Internet deployment;
- iOS / HarmonyOS / Linux client work;
- 3D City;
- General Logic Engine;
- Theme Builder expansion;
- Customs / Runtime Compliance re-extraction.

If a required acceptance step appears to need one of these, record the limitation and stop that path. Do not expand scope.

---

## 3. Work model

This is **product integration work**, not donor migration.

```text
MODE                    = PRE_ASSISTANT_PRODUCT_CLOSEOUT
IMPLEMENTATION_REPO     = Utopia
CONTROL_REPO            = Digital-City/mission-book
NEW_DONOR_MIGRATION     = FORBIDDEN
MISSION_REOPEN          = OWNER_ONLY
NEW_ROOM                = FORBIDDEN
LLM_ROUTER              = FORBIDDEN
ASSISTANT_LAYER         = FORBIDDEN
BOSS_HNS_CONNECTORS     = DEFERRED
```

### Branch

Create one bounded product branch from the actual current Utopia `main`:

```text
product/upt-pre-assistant-closeout
```

Before creating it, pull/fetch and record the exact current `main` SHA. If current `main` is newer than the baseline above, use the newer current `main`; do not reset backwards.

### Host roles

Prefer two actual hosts:

- **Implementation Host** — performs T0–T3 implementation.
- **Independent Verification Host** — starts from the pushed branch, independently inspects and runs T4 acceptance before merge.

They should be different real host IDs when both are available. Hosted CI does not count as a host.

This is not the old migration host-separation contract, so an unavailable second host does not authorize fabricated evidence. If only one real host is available, keep the branch unmerged and report the product verification limitation honestly unless Owner explicitly waives it.

---

# 4. T0 — Migration closeout and phase freeze

T0 contains **no product feature work**.

## T0.1 Re-prove the closeout baseline

Before T1:

1. read Digital-City latest `mission-book/README.md`, `MISSION_INDEX.md`, `response-9-30.md`;
2. verify MB-001..012 all remain complete according to their current front matter;
3. verify no implementation Mission branch is ahead of Utopia `main`;
4. verify the three R11 provenance branches are ancestors of `main`;
5. verify `merged_main_sha=null` remains unchanged for MB-010..012;
6. run the current Utopia required CI-equivalent local gates that are practical on the host;
7. record the hosted CI status of the actual current Utopia `main`.

Do **not** rerun donor migration assessments simply to regenerate numbers.

## T0.2 Freeze record

Create a concise Utopia closeout record:

```text
docs/<lang>/MIGRATION_PHASE_CLOSEOUT.md
```

Chinese and English must remain paired under existing Utopia documentation rules.

It must record:

- current Utopia main SHA;
- all MB-001..012 closed;
- MB-010..012 = negative-result provenance, not implementation merge;
- current required CI result;
- branch audit summary;
- known non-blocking backlog;
- explicit transition to product integration.

Optional git tag is allowed only if the existing repository release/tag practice supports it. A missing tag must not block T1.

## T0 exit gate

```text
MIGRATION_QUEUE_CLOSED = true
REOPENED_MISSIONS      = 0
UNMERGED_IMPLEMENTATION_MISSION_BRANCHES = 0
BASELINE_TRUTH_RECORDED = true
```

Then proceed to T1.

---

# 5. T1 — Attach Room Pack to the normal Utopia product

Goal: the ten already accepted Rooms stop behaving like a separate side product.

## T1.1 Host lifecycle

The normal supported Utopia Host startup must also bring up the existing Room Hub.

Constraints:

- preserve the Room Hub's loopback-only isolation;
- do not expose its raw port to LAN merely for Android convenience;
- startup failure must be visible as degraded/unavailable truth, not silently treated as ready;
- graceful stop/restart must not leave duplicate Room Hub processes.

## T1.2 Web integration

The normal Utopia Web UI must expose:

```text
Home
Tools / Rooms
Devices
Activity
Advanced
  Services
  Tasks
```

At minimum:

- Home shows the ten accepted Rooms;
- Tools / Rooms opens the existing Room experience;
- Services and Tasks remain available but are no longer required as the first mental model;
- no Room data model is rewritten into City Task semantics.

## T1.3 Android boundary

First-stage Android requirement:

- display Room availability/status from the authenticated Utopia product path;
- do not directly expose the loopback Room Hub port;
- direct full Room execution on Android is **not required** in T1 unless it already falls out of the authenticated bridge without new architecture.

## T1 required checks

At least prove:

1. normal Host start → gateway/runtime/Room Hub expected lifecycle;
2. duplicate start is controlled;
3. Room Hub remains loopback only;
4. Web Home sees all ten accepted Rooms;
5. Web Tools / Rooms can enter them;
6. Room unavailable state is truthful;
7. Android sees availability without raw LAN Room Hub exposure;
8. existing gateway/capability/rooms tests remain green;
9. docs remain bilingual/synchronized where the repository requires paired docs.

## T1 exit gate

```text
ROOMS_ATTACHED_TO_NORMAL_SHELL = true
ROOM_COUNT                     = 10
NEW_ROOM_CREATED               = false
ROOM_HUB_LOOPBACK_PRESERVED    = true
```

---

# 6. T2 — Unified Action facade

Goal: unify user-visible progress/result/history while preserving backend ownership.

## T2.1 Canonical user-facing model

Introduce a product-level Action representation equivalent to:

```text
Action
├─ actionId
├─ requestedIntent
├─ route
│  ├─ ROOM
│  ├─ CAPABILITY
│  └─ CITY_TASK
├─ backendRef
├─ target
├─ status
├─ progress
├─ resultRef
├─ error
├─ provenance
└─ timestamps
```

Do not add `BOSS` or `HNS` routes in this workbook.

The schema may use the repository's existing naming/style instead of these exact field names, but it must preserve the semantics.

## T2.2 Adapter rule

Action is an **adapter/facade**, never replacement truth.

It must not rewrite:

- Checklist items into City Tasks;
- Room state into capability invocation state;
- capability invocation IDs into fake engineering task IDs;
- backend errors into generic success.

Every Action must retain a reference to its real backend truth.

## T2.3 State semantics

At minimum support truthful equivalents of:

```text
QUEUED
RUNNING
WAITING_CONFIRMATION
SUCCEEDED
FAILED
REFUSED
CANCELLED
UNAVAILABLE
```

Do not invent `SUCCEEDED` from stale cached state.

## T2.4 Shared truth

Web and Android must read the same canonical Action state.

At minimum:

- an Action created through one supported client can be identified by the same `actionId` on the other;
- refresh/reconnect does not create a second execution;
- backendRef/resultRef/provenance remain stable;
- offline/cached state is clearly labelled.

Full T6-style cross-device workspace handoff is not required here.

## T2 exit gate

```text
ACTION_FACADE_CANONICAL   = true
WEB_ANDROID_ACTION_PARITY = true
BACKEND_TRUTH_PRESERVED   = true
DUPLICATE_EXECUTION_ON_REFRESH = false
```

---

# 7. T3 — Deterministic Ask / Do

Goal: the user no longer has to choose Tasks vs Services vs Rooms before expressing an intent.

No LLM router is allowed in this workbook.

## T3.1 Supported deterministic routes

At minimum support deterministic intent mappings for existing capabilities such as:

```text
read/import a document
  -> Document Intake

query recently ingested knowledge
  -> Knowledge Query

add/check a checklist item
  -> Checklist Room

save/open a bookmark
  -> Bookmarks Room

hash a file/text
  -> Hash Room

review evidence
  -> Evidence Review

run an already-supported safe node task
  -> City Task / Node
```

Exact wording/locale coverage may be implemented with bounded pattern/command rules and explicit UI affordances. Do not pretend open-ended NLU exists.

## T3.2 Ambiguity

When more than one existing target is plausible:

- show 2–3 concrete candidates;
- show what each target will do;
- wait for user selection;
- do not silently choose a destructive/high-side-effect path.

## T3.3 Side-effect confirmation

Actions with meaningful external side effects must reach a visible confirmation gate before execution.

Refusal must be preserved as `REFUSED`, not `FAILED` or `SUCCEEDED`.

## T3.4 Fallback

If no deterministic rule matches:

- show capability/manual target selection;
- do not call an LLM;
- do not create a new capability;
- do not route to arbitrary shell.

## T3.5 Client surface

Web and Android must both expose the same conceptual **Ask / Do** entry and the same Action result/history model.

Visual layouts may differ by platform.

## T3 exit gate

```text
ASK_DO_WEB                 = true
ASK_DO_ANDROID             = true
DETERMINISTIC_ROUTER_ONLY  = true
LLM_ROUTER_PRESENT         = false
SIDE_EFFECT_CONFIRMATION   = true
AMBIGUITY_VISIBLE          = true
```

---

# 8. T4 — Independent acceptance

The Independent Verification Host begins by reading:

1. current Utopia `main`;
2. product branch diff;
3. existing Utopia fast-path document;
4. this workbook.

It should record its own findings **before** reading the implementation report.

## Required real acceptance scenarios

Use one supported Windows host and one real Android device when available.

### A. Startup

- one supported Host startup brings up the expected product services including Room Hub;
- health/status reflects actual readiness;
- duplicate startup is controlled.

### B. Rooms

- Web Home shows the ten Rooms;
- one Room can be opened and used;
- Room Hub remains loopback-only;
- Android observes Room availability through the supported authenticated path.

### C. Action facade

Exercise at least:

- one Room Action;
- one Capability Action;
- one City Task / Node Action or an honest `UNAVAILABLE` if the target node is unavailable;
- one refusal/failure;
- one reconnect/refresh without duplicate execution.

For every case verify:

- one stable Action ID;
- correct backend reference;
- truthful final status;
- result/error visible;
- provenance retained.

### D. Ask / Do

Exercise at least:

- document intake route;
- knowledge query route;
- Checklist or Bookmark route;
- Hash route;
- Evidence Review route;
- ambiguous route requiring user selection;
- side-effect path requiring confirmation;
- unmatched intent falling back to manual selection.

### E. Scope audit

Explicitly prove the branch did **not** introduce:

- assistant/persona layer;
- LLM router;
- Boss/Hns connector;
- new Room;
- arbitrary shell;
- new domain integration.

## CI

Before merge:

1. relevant local tests green;
2. branch required hosted CI green;
3. independent verification report complete;
4. final branch HEAD required CI green.

After merge:

5. merged-main required CI green.

No “CI is probably fine” acceptance.

---

# 9. Reports and evidence

## Digital-City

Create:

```text
mission-book/reports/UPT-PRE-ASSISTANT/
├─ IMPLEMENTATION_REPORT.md
└─ VERIFICATION_REPORT.md
```

These reports are product integration reports, **not** fake MB migration reports.

## Utopia

Use existing repository evidence conventions. Raw/transient evidence stays under ignored runtime paths; only bounded, non-sensitive acceptance evidence should be committed.

Do not create a fake Mission episode for this work.

---

# 10. Merge and stop condition

Only after T0–T4 all pass:

1. independent verifier merges the product branch to Utopia `main`;
2. merged-main CI passes;
3. Digital-City report records exact merge SHA and CI run;
4. Mission Book README / Mission Index record the phase result.

Then write:

```text
FINAL_STATUS = PRE_ASSISTANT_TERMINAL_FOUNDATION_COMPLETE
```

and stop.

The next phase requires a **new Owner instruction**.

The worker must not continue automatically into:

- Boss/Hns connectors;
- Personal Workspace;
- fuller cross-device handoff;
- resident/tray productization;
- assistant/persona work;
- later domain attachments.

Those are separate follow-on decisions.

---

# 11. Failure handling

If any T-stage cannot pass:

- keep the branch and evidence;
- record the exact failed gate;
- do not downgrade a requirement just to merge;
- continue unrelated work inside the same authorized T-stage when safe;
- do not expand into out-of-scope architecture to “solve” a blocker;
- leave `FINAL_STATUS` at the most accurate partial state.

Allowed terminal partial states:

```text
BLOCKED_T0_BASELINE
BLOCKED_T1_ROOMS_INTEGRATION
BLOCKED_T2_ACTION_FACADE
BLOCKED_T3_ASK_DO
BLOCKED_T4_INDEPENDENT_ACCEPTANCE
```

A blocker is preferable to false completion.

---

# 12. Compact executor checklist

```text
[ ] Read latest Digital-City mission-book control files
[ ] Read latest Utopia main and fast-path doc
[ ] T0 prove MB-001..012 closed and branch truth clean
[ ] Record migration-phase closeout in paired Utopia docs
[ ] Create product/upt-pre-assistant-closeout from latest main
[ ] T1 integrate existing Room Hub + 10 Rooms into normal shell
[ ] T1 preserve loopback isolation and truthful availability
[ ] T2 implement canonical Action facade
[ ] T2 prove Web/Android Action parity and no duplicate execution
[ ] T3 implement deterministic Ask / Do
[ ] T3 prove ambiguity + side-effect confirmation + fallback
[ ] Prove no assistant/persona/LLM-router/Boss/Hns/new-Room scope creep
[ ] Implementation report
[ ] Independent verification on second real host when available
[ ] Final branch CI green
[ ] Merge
[ ] Merged-main CI green
[ ] Verification report + exact SHA/CI update in Mission Book
[ ] FINAL_STATUS = PRE_ASSISTANT_TERMINAL_FOUNDATION_COMPLETE
[ ] STOP
```
