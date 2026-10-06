# UI-000 — REVISION REVIEW REPORT: Host Mech

[Authoritative source / 权威原稿](../REVISION_REVIEW_REPORT.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

> Rules: [CONSTRUCTION_RULES.md](../../../../../CONSTRUCTION_RULES.md)
> Workbook: [UI-000](../../../ui-civilization/UI-000-视觉方向候选与审美门禁.md)
> Review Mech,revision Development Alien,satisfying§3;Alien cannot self-review.
> C″ revision reviewed:aea8361c07c003f6f519829b6c1a208c20bccab1.
> Output branch head2978e311959cffee40a172d0ea36e370e8ac59e7.

## 0. Verdict

```text
REVIEW_RESULT = PASS_WITH_REPAIRS
```

One systematic real defect affecting all three candidates was directly repaired by this host. All five decisions declared by the revision were verified rather than accepted on trust. There was no regression.

## 1. §7 exact-head reconciliation before claim

```text
recorded branch == evidence head_branch        ui/UI-000-visual-direction-candidates     OK
recorded head   == evidence head_sha           aea8361c07c003f6f519829b6c1a208c20bccab1  OK
required terminal state == evidence conclusion run 36863682166 == success                OK
                                               (gateway-web success, android success)
```

The ancestry check from 01b4b87 to aea8361 succeeds. Branch history is linear without force-push, and my previous round’s evidence commit is an ancestor of this revision.

## 2. Independence: §3 forbids merely signing or repeating author tests

This host separately wrote review-mech-probes.mjs. It reuses neither parity.mjs, my Development runner, nor review-probes.mjs, Alien’s probe. Section 3 prohibits merely signing or repeating author tests. Both earlier tools measure fact expression, demotion, overflow and target sizes, but neither measured color contrast, the likely failure point of a dark neon HUD. The new probe supplies that measurement and additionally verifies the three explicit decisions in OWNER_STYLE_RULING.md §6.3.

## 3. Real defect found and directly repaired

### R-1 — Tertiary ink-3 below WCAG 2.1 AA 4.5:1 in all three candidates

In default rendering, measure every text element on each surface. Compute contrast from its foreground and actual effective background, walking nontransparent background ancestors and performing alpha composition.

```text
候选 A  --ink-3 #8b8073 on --paper  #fbf8f3   3.65:1   79 个元素
候选 B  --ink-3 #7e8884 on --bg     #f6f7f6   3.41:1   52 个元素（另有 37 个在 #ffffff 上，3.66:1）
候选 C  --ink-3 #6f6788 on --layer-2 #1b1830  3.26:1   65 个元素（另有 22 个在 --void 上，3.79:1）
合计    267 个渲染元素
```

All 267 elements contain content users genuinely need to read: timestamps, status labels, field labels and secondary metadata. At 9.5–14 px they are WCAG normal text, below 18.66 px bold or 24 px, requiring 4.5:1 rather than 3:1.

This is in scope: workbook independent-review item 4 asks whether mobile and desktop are readable, and the UI-190 critic checklist explicitly includes accessibility. It is a measurable readability failure rather than an aesthetic opinion.

Repair brightness only, preserving hue and visual direction:

```text
A  --ink-3  #8b8073 → #7a6f60
B  --ink-3  #7e8884 → #626c67
C  --ink-3  #6f6788 → #8b82a8     ← 在近黑 HUD 上必须「变亮」而不是变暗
```

The direction of C’s repair matters: on a dark background, increasing contrast requires a brighter foreground. Darkening it according to a light-theme instinct instead approaches background luminance and lowers contrast.

Two failures unique to A were repaired in the same batch:

```text
A  .chip.is-on    --accent #b4502a on --accent-soft #f0d9cd   3.76:1
    → 新增 --accent-ink #9c4423（同色相、文字安全亮度）4.75:1
    （--accent 本身在 --paper 上是 4.81:1，通过，因此没有改动 --accent，避免影响主按钮与链接）
A  .badge-warn    --warn #8a6a1f on warn tint               4.10:1
    → --warn #7a5c18
```

The raw block preserves the accent’s 3.76:1 failure and the new accent-ink’s 4.75:1. The original accent already passes at 4.81:1 on paper and remains unchanged to avoid affecting primary buttons and links. The warning color failed at 4.10:1 and becomes #7a5c18.

Result: 267 → 0 elements below AA.

## 4. Verifying rather than trusting revision decisions

Treat the three explicit decisions in OWNER_STYLE_RULING.md §6.3 as assertions requiring verification:

| Statement | Method | Result |
|---|---|---|
| Anime register through geometry, type and color; no Japanese copy | Scan kana (ぁ-ん / ァ-ヶ / half-width kana), deliberately not all CJK because Chinese is expected | Pass: zero matches |
| Honest placeholder silhouette, not finished art | Check operator for placeholder wording and image references | Pass: “only a placeholder now”; zero img/url references, pure CSS |
| No character-slot controls, avoiding dead affordances | Query the operator subtree for button, a[href], input, select, textarea, [role=button], [tabindex] | Pass: zero matches |
| Additionally, the v2 invariant 4 configurable fields | Check naming, appearance, voice and role plus ASSISTANT, SLOT 01 and Unassigned labels | Pass: all present |

Item 3 particularly deserves recording: the project already delivered a real defect involving rendered but unresponsive controls, 17 empty handlers repaired at 6059252. The revision explicitly avoids recurrence, and this host independently confirms it.

## 5. Item-by-item results against the six workbook criteria

| Criterion | Verdict | Evidence |
|---|---|---|
| Truly different, not recoloring | Pass | Different structural signatures: a NAV.switch + #root; b ASIDE.rail + main + four sections; c NAV.acts + main. C becomes a clipped HUD, radius 22 → 0 px, main heading 68 → 34 px |
| Core functions retained | Pass | Capability coverage 29/29; parity 396/396 including seven real-click action probes; all three still have ten surfaces |
| Engineering-dashboard character | Pass | Zero engineering-vocabulary matches, including CONTROL SURFACE, backendRef, provenance and schemaVersion; raw event types removed from primary surfaces |
| Mobile and desktop readability | Pass after repair | Zero overflow at 390 px, scrollWidth equals clientWidth; zero targets below 24 px; contrast failures 267 → 0 |
| Impersonal AI SaaS template copying | Pass | No shared template skeleton; C’s clip-path corners, hairline strokes, scanlines and segmented gauges are newly written vocabulary |
| Technical demotion while reachable | Pass | Zero leakage; technical values reachable after revealAll; closed details and inspector excluded from visible text |

## 6. Regressions and gates: actually run here at this branch head

```text
scripts/ui-000/review-mech-probes.mjs    contrast 0 低于 AA · 失败/4xx 请求 0 · page error 0 · 声明检查全通过
scripts/ui-000/review-probes.mjs         0 失败（strictVisible 0 / demotion 0 / overflow 0 / tapTargets 0 / glyphs 0 / consoleVocab 0 / coverage 29/29）
scripts/ui-000/parity.mjs                396/396 PASS（132/候选）
node --test tests/ui-000-candidates.test.mjs   5/5
node --test "tests/*.test.mjs"           859/859
node scripts/check-bilingual.mjs         docs / evidence / data-records = SYNCHRONIZED
scripts/ui-000/evidence-check.mjs        PASS（重拍后）
```

## 7. Boundaries: not verified here

- No aesthetic judgement. Whether the style is attractive belongs to Owner, who adopted C″. This host measures properties and hard rules only.
- No physical Android verification. All changes are CSS color tokens under apps/web/candidates. Android candidate source has remained unchanged since 905e9ff, so existing device evidence is retained without rebooting the emulator.
- Contrast measurement is approximate, not normative forensic evidence. Background-color ancestor traversal and alpha composition do not sample background-image pixels. The page has faint radial gradients and stripes, with maximum alpha 0.20 over #08070f. Their effect is much smaller than the gap between 4.5 and 3.26, but no audit-grade verdict is claimed.
- Thirty advisory targets between 24 and 44 px remain. The former is WCAG 2.5.8 AA; the latter is 2.5.5 AAA/mobile best practice. Enlarging all candidates solely to remove advisories would be continued hardening without a real defect, prohibited by §9. They remain reference findings and are reported.

## 8. This host’s own errors and corrections

1. The evidence guard caught me. The prior round’s evidence-check.mjs immediately reported EVIDENCE_POINTER_MISMATCH after my color change, 51a499e3 → fb363dea. This is expected and proves the guard is functional. Evidence was recaptured and written with --write.
2. My first checkout failed with unable to read tree because I used a short SHA without fetching the object first. Using the origin/ui reference worked; recorded to prevent repetition.
3. The first contrast repair darkened C according to light-theme instinct. Measurement fell below 3, so it was immediately changed to brightening. This error merits archiving: dark-theme contrast direction is opposite to light-theme direction.

## 9. Handoff to Alien/Owner

```text
revision_head_sha（Alien 交付）  aea8361c07c003f6f519829b6c1a208c20bccab1
review_head_sha（本机复核产出）  2978e311959cffee40a172d0ea36e370e8ac59e7
review_repairs                   1 类系统性对比度缺陷（3 个 token + 2 个 A 专用色）
REVIEW_RESULT                    PASS_WITH_REPAIRS
```

- No business semantics, API, framework or production apps/web changes. Only candidate a/b/c CSS color tokens, the new review probe and recaptured evidence changed.
- Direct in-scope reviewer repairs are permitted and required by §3, so the repaired head is 2978e31. Any third-host confirmation follows that host’s judgement. This host does not claim its own repairs independently confirmed.
- After Review, the second-host independent-review gate holds for the adopted artefact and UI-101..103 dependencies are satisfied. Each host decides whether to claim under §2.
