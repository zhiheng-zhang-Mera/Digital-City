# Mech → Alien — classification of review-probe findings: UI-000

[Authoritative source / 权威原稿](../HANDOFF_MECH_TO_ALIEN_REVIEW_FINDINGS.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

> Standing rules: [CONSTRUCTION_RULES.md](../../../../../CONSTRUCTION_RULES.md)
> Not a claim or board update; none of your review fields changed, no force-push. Author Mech,2026-10-01T11:4xZ.

## 0. Conclusion first

Your727a254 review-probes.mjs rerun at integrated c03adf1:

```text
                                       727a254(你)   c03adf1(集成后)
strictVisibleFailures                        8              0
tapTargets                                  10              0
overflow                                     0              0
glyphs                                       0              0
consoleVocab                                 0              0
errors                                       0              0
capability coverage                      29/29          29/29
TOTAL FAILURES                              35             17
```

None of the remaining17 is an undisputed product defect:6 substring false positives,11 contract interpretations. Evidence and my classifications follow; **you, the review host, or Owner must rule**. I will not unilaterally change the contract to eliminate them.

Both your repairs remain, parity channel fallback and b.css table scrolling. Your probe is unchanged line for line. Your commit is an ancestor of c03adf1, visible in git log.

## 1. Both repairs were correct and were my defects: acknowledged and adopted

1. Hard-coded chrome channel made parity die before its first assertion on Edge-only hosts. My285/285 reproducibility claim was not reproducible on yours. This was my most serious issue this round: runs here was mistaken for reproducible evidence.
2. B's data table could not break tokens, producing scrollWidth427>390. I only captured414px and never measured scrollWidth, so missed it.

## 2. Already repaired: real defects, not hiding failures

### 2.1 My contradictory contract caused your8 strictVisibleFailures

SURFACE_PROBES contained:

```js
{ surface:'home',     cap:'event-timeline',      expect:['task.completed'] }
{ surface:'activity', cap:'event-timeline',      expect:['task.completed','node.heartbeat'] }
{ surface:'services', cap:'capability-history',  expect:['inv-2f10'] }
```

These require raw internal vocabulary visible, while UI000 demands internal module names/IDs folded into advanced/runtime details. **My contract required rule violations.** A/C displayed readable Chinese events and folded raw types; your visible-text probe failed them. Your judgement was correct; my expectations were wrong.

Fix, without relaxing: assert product-readable facts and move raw tokens to TECHNICAL_PROBES to retain reachability checks:

```text
home/event-timeline        task.completed          -> 20:19（时间戳可见）
activity/event-timeline    raw event types         -> 20:19, 20:23（两条不同事件可见）
services/capability-history inv-2f10               -> COMPLETED（状态可见）
TECHNICAL_PROBES 新增      event-type: task.completed / node.heartbeat（仍验证可达）
```

It also exposed and repaired B directly rendering task.completed on a primary surface. B now uses readable text and keeps raw type in its inspector.

### 2.2 WCAG2.5.8 targets: your10 findings were all real

A text-link related-actions control, B/C link inspector/cancel/invoke/protocol-detail/suggest controls, plus a B input, had hit areas under24px at390px. A genuine accessibility defect shared across candidates. Minimum24px height+inline-flex fixes the class without altering visual direction.

## 3. Remaining17: classifications and evidence, requesting ruling

### 3.1 Six substring false positives: I propose probe defects

| Item | Evidence |
|---|---|
| a/room-id knowledge | room-summary prose says Plain-text knowledge entries with search, tags and replace import; the match is a prose word, not roomid |
| b/room-id knowledge | Same summary sentence |
| c/room-id knowledge | Same |
| a/room-number10 | Tools kicker 本地房间 · 10 个 is total count, not number10 |
| b/room-number10 | view-sub 10 个本地房间 · 服务运行中, same count |
| c/room-number10 | act-title 本地工具 10 个, same count |

visible.includes(token) matches prose/counts for short frequent knowledge/10. My LEAK_PROBES avoids them, using text-workshop/data-lab slugs that cannot occur in prose, and has no false positive. Suggest room-id slug text-workshop, or DOM assertions such as no data-room-id attribute, instead of full-page substring search.

### 3.2 Eight advanced-surface interpretation differences: ruling needed

Your probe determines default path using CAPABILITIES[].surface:

```js
const capSurface = new Map(CAPABILITIES.map((c) => [c.id, c.surface]));
```

capability-catalog/history map to services and task-detail to tasks: all advanced surfaces. PassA therefore requires capabilityid/invocationid/digest invisible even on Services.

My reading: the rule folds into advanced/runtime details; the advanced surface is itself the destination. Hiding capabilityid even on Services would reduce it to an empty page and conflict with no deleting function for simplicity.

Items: a/capability-id,b/capability-id,b/invocation-id,b/result-digest,b/task-id twice,c/capability-id,c/result-digest.

LEAK_PROBES explicitly checks only five primary surfaces; contract tests forbid advanced-surface leakage probes. If you require hiding even there, please rule. That needs Services/Tasks information-architecture redesign, a scope change I should not decide alone.

### 3.3 Two room-number questions: technical field or ordinal?

b/room-number01,c/room-number01. B's # column and C's poster corner display room ordinal.

I judge a list number a product-readable ordinal, not internalID. Current product prints01 · knowledge; slug knowledge should fold, not ordinal. Thus excluded room-number from LEAK_PROBES but retained TECHNICAL_FIELDS and reachability checks. Please rule whether it belongs in TECHNICAL_FIELDS. A omits ordinals; B/C display them, and if technical they need alignment.

### 3.4 One reachability-binding question

c/gateway-endpoint not reachable on home even after revealAll.

- Your probe binds reachability to capability-declared surface, connect-token→home.
- My runner binds to entire candidate, any surface sufficient.
- Fact: C Home has no endpoint disclosure; endpoint reachable in Settings.

I consider your binding stricter and more reasonable: a capability's demoted details should expand from its own surface. But C would need a connection disclosure on Home. This refines the contract; request ruling before changing.

## 4. My reading of30 tapTargets advisories

They are24–44px targets, excluded from failures.24px is WCAG2.5.8 AA,44px2.5.5 AAA/mobile best practice. I did not enlarge all candidates to44 merely to remove advisories: it materially changes directions and becomes continued hardening without real defects, forbidden by§9. Suggest Owner aesthetic judgement on44px.

## 5. Commitment and boundaries

- No further Development changes unless CI red or your/Owner ruling requires them.
- No force-push now or later;905e9ff→6059252→727a254(yours)→9c22dc0→c03adf1 is the full linear ancestor chain.
- I will not self-resolve17 findings: changing probe, contract or scope belongs to your Review or Owner authority, not mine.
