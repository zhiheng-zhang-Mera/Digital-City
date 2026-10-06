# UI-190 — Cross-surface visual review and UI baseline freeze · REVIEW REPORT

[Authoritative source / 权威原稿](../REVIEW_REPORT.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

> Rules: [CONSTRUCTION_RULES.md](../../../../../CONSTRUCTION_RULES.md)
> Workbook: [UI-190](../../../ui-civilization/UI-190-跨端视觉审查与UI基线冻结.md)
> Review Host Mech; Development Alien, satisfying §3 independence.
> Reviewed Development head `10cdd75604836ad0b903f4dd749e80e16bdf32b6`, CI `36893135833` success.
> Conclusion head `11bb3f6fc76aecbb1ae41f2e258cccf7beaa429b`, Development plus reviewer repair, CI `36895816630` success.

## 1. Result

**PASS_WITH_REVIEW_REPAIR.** Two critic rounds found one confirmed defect, repaired and verified in both directions. Other explicitly unverified items appear in §4, without an implied pass.

**This report covers Review only.** Step 7 FINAL_VISUAL_PREVIEW Owner gate and step 8 main merge/UI_BASELINE_FROZEN declaration remain incomplete. No baseline is claimed frozen.

## 2. Instruments: why not rerun the author’s script

Section 3 requires independent problem-finding rather than repeating author tests. Neither round uses rendered-surfaces.mjs. Instruments are self-built and deliberately different between rounds: repeating the first probe merely fills the round count and proves nothing. This programme already encountered that failure mode twice.

A rule earned through this task’s cost applies to both rounds:

```text
裁切 / 拥挤 / 溢出      -> 必须来自像素
字符级文本结论          -> 必须来自 DOM
两者都不是              -> 缩略截图不是仪器
```

Clipping, crowding and overflow require pixels. Character-level conclusions require DOM. A thumbnail is neither instrument.

## 3. Verified

### 3.1 First round: rendered state, self-built instrument

Four captures across three surfaces: Web desktop 1440×1000, **Web narrow 360×800** (never used by the author’s script, although mobile crowding is named and Android judged at 320 dp), and standalone/embedded Room Hub.

- C2 void rgb(8,7,15) reaches pixels in all four.
- Zero horizontal overflow on desktop and 360 px.
- Zero visible raw ISO-8601 timestamps on Web: the reference surface meets the same parity goal as R-1.
- Zero structurally stranded controls after excluding intentionally hidden ones.
- Embedding seam correct both ways: standalone rail display:flex, body[data-embedded] null; embedded rail display:none, data-embedded true.

**Connected Android capture achieved**, despite Development recording development_android_live_capture_exhausted. It used an emulator rather than physical handset, /data/local/tmp instead of /sdcard, and run-as cp rather than shell redirection: exactly avoiding Development’s three failure causes. At 320 dp @ 1.5 and 360 dp @ 1.0, ONLINE is true, device cards present, raw ISO timestamps zero.

### 3.2 Second round: UI driving plus contrast, a different instrument

- **Functional regression: clicks prove reachability.** Nine navigation surfaces (Home, Tools/Rooms, Devices, Activity, Services, Tasks, Actions, Pairing, Settings) actually activated. All except landing Home change main content; zero page errors. Reachability is exercised, not inferred from DOM nodes. Final driven surface captured with complete rendering.
- **Contrast:** every visible text leaf measured against effective background for WCAG AA; Web and Hub both zero failures. This is a real programme risk, not generic checklist: UI-000 review found ink-3 failing AA in all directions. Nonrecurrence is measured.

### 3.3 Confirmed item 3: repaired and verified both ways

Two visibly unfolded schema/version values in apps/web/app.js: Pairing line 42 and Settings line 76. The hard rule explicitly lists schema/version as default-folded into advanced/runtime details.

Both pages belong to Advanced navigation, supporting a permissive reading. But the decisive fact, unavailable from pixels, is that neither value sits in an actual disclosure, while the shell already uses common.runDetails for seven disclosures on those same pages. Thus folding exists and is in use, yet these values remain plain.

Repair commit 11bb3f6 changes two lines to the existing common.runDetails pattern. Only the named version values move; Gateway connection status stays visible as legitimate product state, not engineering vocabulary.

Verify both directions because folding differs from deletion: collapsed strings absent from visible text on both pages; expanded strings present on both. Both pass. Regression clean: raw ISO zero, overflow zero, C2 void present, no page errors.

### 3.4 Two closed items

- **Item 4 is not a defect.** Web has persistent inline form#ask-form after connection on every page, so Ask needs no navigation slot. Android lacks the bar and needs a primary Ask destination. Reachability agrees, controls differ. Contract should say Ask one step away on every surface, not lock counts, which would force redundant Web navigation beside a persistent bar.
- **Note 2 relative-time observation withdrawn.** Development refuted it with source facts: Intl.RelativeTimeFormat and 年前 occur zero times, one age() path has two outputs. I verified DOM character by character: 最近在线 1 秒前, ending code points79d2 524d. It is U+79D2 seconds, not U+5E74 years. I misread a character in a 214 px thumbnail of a 5039 px tall image. Withdrawn and forbidden from freeze.

## 4. Unverified: explicitly no pass implied

1. Owner gate not opened: step 7 preview not yet delivered; §6 provides pending material.
2. No main merge or frozen declaration: step 8 undone, RS-201/202 still locked.
3. Independence residual: Review did not extend independence across the entire surface. I wrote and checked the repair (§5); only Development’s independent recheck covers that commit itself.
4. Composition tests still absent: both hosts’ offline Gradle caches lack ui-test-junit4/androidx.test. Android folded-not-deleted still has only constructive reasoning, not supplied by this review.
5. Contrast measured only Web and Hub; no equivalent Android measurement.

## 5. Disclosure

Review directly repaired item 3 under §3, requiring independent problem-finding and permitting in-scope repair. **This reverses my own earlier statement:** review_plan promised Mech would not write this branch during Review. That promise avoided disrupting live Development. Development is now released, the branch stationary, and §3 expressly permits reviewer repair; the promise no longer applies. I record the reversal rather than silently crossing the boundary, and record the honest alternative: Development offered to modify after release, an entirely independent route Owner could choose.

**Self-verification and correct supplementation.** Initial 11bb3f6 validation was self-check, authored and verified by me; note 7 and ruling mark that residual. Development later recorded item-3 repair independently re-verified at 11bb3f6, commit cb9087f. I neither authored nor requested it. The missing half was supplied by a host that did not write the change: the other host checks the reviewer’s work, rather than more reviewer self-proof. **This correction does not retire the other residuals**, §4.3.

My instruments and judgements made more errors than the reviewed artefact, recorded individually:

1. First-round strandedControls falsely flagged every surface. Connection forms and Knowledge editors are intentionally hidden. Zero dimensions prove hidden, not stranded. checkVisibility() reduces all four to zero.
2. I assumed Web lacked narrow adaptation from a 360 px screenshot resembling a half-width sidebar. Source disproved it: max-width900 media gives aside static/auto width and main margin-left0; the supposed sidebar was nav’s two-column grid. Round 2 asserts responsive state: at1440 aside fixed232px/main left margin232; at360 aside static360/main margin0/nav two162.5px columns. Full capture confirms uncrowded layout and complete bottom heading below the fold.
3. First heading metric chose the document’s first h1/h2 inside the hidden connection panel, reporting the same text everywhere. It was used in no evidence.
4. Note 2 character misreading, §3.4: programme’s seventh instrument-side problem, first to produce a false finding rather than an omission.

## 6. Concise visual package for Owner FINAL_VISUAL_PREVIEW

Raw evidence remains runtime under PROCESS_DATA_POLICY. This bounded index all comes from conclusion head11bb3f6.

| File under .runtime/evidence/ | What it establishes |
|---|---|
| ui-190/mech-web-desktop-1440x1000.png / -full.png | Desktop C2 void, no overflow |
| ui-190/mech-web-narrow-360x800.png / -full.png | 360px layout not crowded, complete bottom heading |
| ui-190/mech-hub-standalone.png | Standalone Hub retains rail |
| ui-190/mech-hub-embedded.png | Embedded hides rail, reverse seam |
| ui-190/mech-r2-web-nav-driven.png | Final Settings after nine surfaces driven |
| ui-190/mech-repair-{pairing,settings}-{collapsed,expanded}.png | Item3 two-way invisible/visible evidence |
| mission-book/UI-190/android-connected-320dp-font1.5.png | Hardest in-scope connected Android |
| mission-book/UI-190/android-connected-360dp-font1.0.png | Connected Android, complete Last snapshot |

Machine-readable: mech-critic-web-rooms.json for four round1 captures, mech-critic-round2.json for nine reachability/contrast, mech-repair-verify.json for two-way repair, all under ui-190/.

## 7. Next steps

Review ends here. Still undone and not claimed: deliver the table to Owner and obtain preview opinion; merge main and record exact SHA/CI; declare frozen; unlock RS-201/202.

## 8. Freeze-readiness verification: Review-side, read-only

While waiting for Owner, a read-only readiness check asks whether the accepted artefact can actually freeze. Review may verify it; discovering failure only at step8 would be costly:

```text
origin/main                          = e7c498f
origin/ui/UI-190-ui-baseline-freeze  = 11bb3f6
main..branch                         = 28 commits   （整个 UI 计划：UI-000 → UI-190）
branch..main                         = 0 commits    ← main 是分支的严格祖先
git merge-tree --write-tree main branch = exit 0，产出树对象 → 无冲突
main 最近 CI                          = success（36830053908 等）
```

Two conclusions for the executor:

1. Step8 merge at current SHAs is fast-forward. branch..main0 means main is a strict ancestor: no new merge commit and no opportunity for merge-introduced changes. This is the opposite of the silent-exclusion risk previously encountered.
2. No conflict, verified without touching worktree. merge-tree computes only a tree without writing files, so the check does not contaminate the artefact. main..branch28 also shows freeze brings the whole UI stage, appropriate to UI190.

Scope boundary: this proves mergeability only, not green post-merge main CI. That must be recorded against the actual merged exactSHA in step8. Nor does it claim Owner gate passed. No branch changed, no freeze advanced, no frozen declaration made.
