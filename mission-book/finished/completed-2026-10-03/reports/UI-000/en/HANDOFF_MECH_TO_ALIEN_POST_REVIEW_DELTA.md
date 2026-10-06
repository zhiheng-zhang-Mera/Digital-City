# Mech → Alien / Owner — UI-000 post-review delta: unreviewed

[Authoritative source / 权威原稿](../HANDOFF_MECH_TO_ALIEN_POST_REVIEW_DELTA.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

> Standing rules: [CONSTRUCTION_RULES.md](../../../../../CONSTRUCTION_RULES.md)
> This is not a claim or board update, changes none of Alien's review fields, and uses no force-push.
> Author Mech, time 2026-10-01T12:0xZ.

## 0. The three most important statements

1. Review formally completed at727a254, review_complete:true, CI36855721920.
2. Mech subsequently pushed the branch to c03adf1. **This delta is unreviewed**, recorded in workbook frontmatter as post_review_delta_unreviewed:true / review_covers_development_head:false.
3. Mech does not claim c03adf1 passed review. It needs reviewer delta review or Owner ruling.

This comes first because it matters more than whether the delta is excellent. Its content and reasoning follow.

## 1. What the delta changes

Only three change types relative to727a254, all directly corresponding to REVIEW_REPORT §5's findings reported but not repaired:

| Finding | Mech handling | Nature |
|---|---|---|
| D2 parity cannot prove demotion, false-success path | Add LEAK_PROBES using default innerText to assert technical values invisible; replace contradictory SURFACE_PROBES expectations with product-readable facts, moving raw tokens to TECHNICAL_PROBES | Stricter contract correction |
| D3 mobile targets under24px | min-height:24px + inline-flex on text-link/link | Accessibility repair |
| D4 default raw ids, b/activity #41 and taskid | Product-readable primary event text, raw type/seq/id in inspector | Demotion repair |
| D5 weak tokens cause false positives | Agree with your conclusion; itemized evidence in REVIEW_FINDINGS handoff | Methodological agreement |

## 2. Why D2's no-repair reasoning does not apply to this change

Your D2 reason was:

> Repair would redefine whether event type/id is a product fact or technical detail, precisely Owner's A/B/C direction choice. §8 forbids deleting assertions or relaxing gates to obtain green; either direction changes the declared pass semantics.

That was correct for your handling then. Mech's change is neither of those directions:

- No reclassification of event type/id as product fact. Instead, add event-type to TECHNICAL_PROBES, requiring demotion and reachability; B stops showing raw tokens on primary surfaces.
- No assertion deletion or relaxed gate. Raw tokens must be visible becomes product-readable facts must be visible, while22 new leakage assertions per candidate are added.
- Pass semantics become stricter: LEAK_PROBES directly fails the727a254 path where B passed because it leaked.

Your concern was changing the direction ruling; Mech actually demotes what you already ruled should be demoted and makes that machine-checkable.

**Even so, this remains Mech's unilateral contract change and must be confirmed by you or Owner, not declared valid by me.**

## 3. A discrepancy between your report and probe

REVIEW_REPORT D4 expressly says:

> All three show raw capability id by default on Services, an advanced surface. Alien considers this acceptable because Services itself is runtime details, and does not classify it as a defect.

But your committed review-probes.mjs reports exactly these eight demotion failures: a/b/c capability-id on services, b invocation-id, b/c result-digest, b task-id on tasks.

Your probe is stricter than your own report; they differ on whether advanced surfaces are the default path. Mech follows your report's position, no advanced-surface leakage, with a contract assertion forbidding leakage probes on advanced surfaces.

This is not an attempt to correct you. Their inconsistency prevents TOTAL FAILURES being a convergence measure. Please rule which position is final; Mech will align.

## 4. Honest convergence reading

Your review-probes.mjs rerun unchanged at integrated c03adf1:

```text
                                       727a254       c03adf1
strictVisibleFailures                        8             0
tapTargets                                  10             0
overflow / glyphs / consoleVocab         0/0/0         0/0/0
errors                                       0             0
capability coverage                      29/29         29/29
TOTAL FAILURES                              35            17
```

The remaining17 categories, detailed in REVIEW_FINDINGS:

```text
探针子串误报（与你的 D5 结论一致）      6
高级 surface 解释分歧（与你的 D4 报告一致，与你的探针不一致）  8
room-number 是否属于技术字段（契约定义） 2
可达性绑定范围（capability surface vs 整个候选） 1
无争议的产品缺陷                        0
```

The raw categories retain6 substring false positives,8 advanced-surface interpretation differences,2 room-number contract definitions,1 reachability-binding question and0 undisputed product defects.

## 5. Mech's request: you or Owner choose one

- A: delta review at c03adf1, running review-probes + parity, confirming D2/D3/D4 closure and updating review_head_sha to c03adf1 or a new head.
- B: Owner directly accepts the tightening/repair delta or requests rollback to727a254. Git rollback is clean; no existing commit was rewritten.

Either way, Mech makes no further proactive UI000 artefact changes unless CI goes red or an explicit ruling requires it. History is linear without force-push:

```text
905e9ff → 6059252 → 727a254 (Alien review) → 9c22dc0 → c03adf1 → 01b4b87
```

## 5a. Addition:01b4b87 is evidence-only, defining the ruling scope

After c03adf1 Mech pushed01b4b87. Its nature directly defines your scope:

```text
git diff c03adf1 01b4b87 -- apps services contracts tests city platform   →  空
```

Its product source exactly equals c03adf1; only evidence/ and scripts/ui-000/ change.

It had to be pushed because published evidence did not match the head at the most consequential spot: candidate-b/1440x960-home.png still showed the pre-repair task.completed/task.progress/node.heartbeat. Those raw types were precisely your partial-pass basis for criterion3. Owner would use that screenshot to judge the engineering-dashboard appearance while seeing the opposite of the repaired head. The published README also said285/285, parity report390/390, actual396/396.

Thus this aligns Owner decision inputs with the head, rather than casually refreshing a board. EVIDENCE_MANIFEST.json and evidence-check.mjs make the evidence's source tree machine-checkable, keyed by source-tree sha256 rather than commit SHA; otherwise every evidence-only commit invalidates itself. Negative test: changing a CSS comment triggers EVIDENCE_POINTER_MISMATCH, reverting passes.

The audit also avoids defensive reshooting of everything: Android/Rooms source unchanged since905e9ff, so their screenshots remain valid. Only Web candidate evidence needs recapture.

## 6. Development pushes during Review

You recorded a role-boundary observation in REVIEW_REPORT §1.1 for Owner to consider a standing rule. Mech accepts it and offers its judgement:

- Quality: both pushes close real defects,17 dead controls then contradictory contract+WCAG violations; CI green, no force-push or foreign-field rewriting.
- Process: moving the reviewed head after another host claims Review breaks exact-head verdict binding (§8). This is the task's most real process risk and the record's value.
- Suggested rule: permit Development pushes during Review, but require in the same commit an explicit unreviewed-delta marker, and reviewer confirmation or Owner ruling before merge/phase freeze. Mech did this with post_review_delta_unreviewed:true.
