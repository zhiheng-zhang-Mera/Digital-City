# UI-102 — DEVELOPMENT REPORT

> **Superseded header.** §1–§5 below were written at the *first* increment (`9b97fa1`) and are kept
> as the historical record of that increment. The authoritative state is §7, and the evidence for it
> is in [NARROW_WIDTH_DEFECT.md](./NARROW_WIDTH_DEFECT.md) and
> [E2E_VERIFICATION_NOTES.md](./E2E_VERIFICATION_NOTES.md).

```text
MISSION                    = UI-102 (Android 产品壳与信息架构)
PHASE                      = UI_CIVILIZATION
REPORT_ROLE                = DEVELOPMENT
HOST                       = Mech
BASELINE_SHA               = e7c498f5acd86da324a45c3278219c8daa612561
BRANCH                     = ui/UI-102-android-product-shell
HEAD_SHA                   = 652c41c6ca72d591e3adab5cb78b9a2bc6b7a410
CI                         = 36886549081-success-android-and-gateway-web
UNIT_TESTS                 = 64 (0 failures)
DEVELOPMENT_COMPLETE       = true
STATUS                     = IN_PROGRESS (development complete; awaiting review by a different host)
```

> **This is explicitly not a completion claim.** Per `CONSTRUCTION_RULES.md` §8/§9 a green CI run on a
> partial implementation must not be presented as the task being done. The frontmatter keeps
> `development_complete: false`.

## 1. Why the first increment is the theme + shell

The Android surface had the worst structural starting point of the three, and the review of the
UI-000 candidates recorded the specifics:

```text
MainActivity.kt:51   NavigationBar with NINE items, each an icon drawn as Text("◈ ❯ ▦ ≣ ◇ ◉ ▤ ≋ ⚙")
                     — far outside M3's 3–5 guidance on a ~360dp phone
MainActivity.kt:27   MaterialTheme(lightColorScheme(primary = Ink, secondary = Moss, background = …))
                     — 3 of ~30 colour roles set, so every other role rendered Material baseline purple
                     theme files      NO Theme.kt / Color.kt / Type.kt existed anywhere in the module
                     typography/shapes pure M3 defaults; no dark theme; no dynamic colour
```

So the two highest-leverage changes are the ones that everything else composes against: a real theme,
and a navigation model that fits a phone.

## 2. What landed

| File | Change |
|---|---|
| `theme/UtopiaTheme.kt` (new) | Full `darkColorScheme` carrying the Owner-adopted direction; `Typography`; `Shapes` built from `CutCornerShape` (the direction's clipped-corner gesture, never rounded card stacks); a `Space` scale so screens stop hard-coding dp |
| `theme/UtopiaIcons.kt` (new) | Ten real `ImageVector`s on a 24×24 grid, stroked with `SolidColor(Color.Black)` so `Icon()` tints them — replacing the Unicode geometry glyphs |
| `MainActivity.kt` | Applies `UtopiaTheme`; nine-item bar → **five** primary entries (Home / Ask / Rooms / Devices / Activity) with vector icons; the advanced surfaces (Services / Tasks / Action / Settings / Pairing) move to a header overflow, so **no capability is lost** while the bar stops being a wall of tabs |

The tertiary ink token is `#8B82A8`, not the `#6F6788` that failed WCAG AA during the UI-000 review —
the AA-safe value is reused rather than re-derived, and it is documented in the file.

## 3. Verification on this head

```text
gradlew --offline :app:compileDebugKotlin                      BUILD SUCCESSFUL
gradlew --offline :app:testDebugUnitTest :app:assembleDebug     BUILD SUCCESSFUL (APK produced)
hosted CI 36868228769                                          success (android + gateway-web)
real emulator (android-36, 720x1600 @320dpi)                   screenshot captured
```

The screenshot shows the dark shell, the lime cut-corner primary action, the header overflow control
and the five-entry bar. Evidence: `evidence/raw/mission-book/UI-102/android-shell.png`.
JAVA_HOME must be `D:\GDPR-Refine\.tools\jdk-17.0.20.1+1` (the machine's `JAVA_HOME` points at a
non-existent path and PATH `java` is JDK 26, which AGP 8.11 rejects).

## 4. What remains before this task can be called complete

Recorded rather than left implicit, because a reviewer must be able to see the gap:

1. **Component hierarchy (workbook step 3, not started).** The workbook asks to stop treating every
   surface as a generic `Panel` and to build a small set of semantic components — hero, tool row,
   activity row, status chip, device surface, technical details. Only the theme and icons exist so far.
2. **Technical-detail folding (step 5, not started).** Actions/Ask still render engineering fields
   inline (`actionId:`, `route · target`, `BackendRef`/`ResultRef`/`Provenance`, digests). They must
   move behind expandable technical details.
3. **State coverage (step 6, not started).** loading / offline / unavailable / confirmation /
   ambiguity / success / failure are not yet systematically expressed.
4. **Remaining hard-coded colours.** The panels still contain literals such as `Color(0xFF456B29)`,
   `Color(0xFFA15C38)`, `Color.Gray` and `Color(0xFFF4F6F0)`. They now sit next to a real theme and
   must be migrated to theme roles; `Ink`/`Moss` were remapped as a bridge, and the bridge should be
   removed once the screens are migrated.
5. **Acceptance (step 7).** Portrait real-device acceptance across narrow screens and font scaling is
   not done. One emulator screenshot at one size is not that.
6. **Truth-parity with Web (completion gate).** "功能/状态 truth 与 Web 保持一致" is not verified.

## 5. Boundaries respected

- Kotlin / Compose / Material 3 kept; no new cross-platform framework.
- `CityClient`/DTO untouched — no gateway behaviour change, no client-side re-derivation of
  status/route.
- No existing entry point deleted: the five bar entries plus the overflow cover all nine previous
  pages plus `Find`.
- Verification is real (emulator + hosted CI), not claimed.

## 6. State at the first increment (historical)

```text
DEVELOPMENT_COMPLETE = false
REVIEW_HOST          = null (nothing to review as complete yet)
```

Mech intends to continue this task in the next round. Nothing here is offered as complete, and a
reviewer should not be asked to sign off a partial shell.

## 7. Final state — completion claim on `652c41c`

All six items that §4 listed as remaining are now closed:

| §4 item | resolution |
|---|---|
| 1. Component hierarchy | `ui/UtopiaComponents.kt`: UtLabel, UtPanel, HeroBlock, StatusChip, ToolRow, ActivityRow, DeviceSurface, UtEmptyState, UtFeedback, TechnicalDetails |
| 2. Technical-detail folding | every internal identifier in Actions/Ask/Services/Events folded into a collapsed `运行详情`; extracted into pure row-builders so tests assert what the screen renders |
| 3. State coverage | loading / offline / unavailable / confirmation / ambiguity / success / failure expressed through the shared components |
| 4. Hard-coded colours | zero `Color(0x..)` literals outside the theme file (19 → 0) |
| 5. Acceptance | run on a real emulator **from screenshots** at 360 dp and 320 dp, font 1.0/1.3/1.5 — see below |
| 6. Truth-parity with Web | the Gateway's `statusLabel` now wins over the client fallback, which is what Web renders; a test pins precedence *and* fallback |

```text
gradlew --offline :app:testDebugUnitTest :app:assembleDebug   BUILD SUCCESSFUL
unit tests                                                     64 passed, 0 failures
hosted CI 36886549081                                          success (android + gateway-web)
connected acceptance                                           ONLINE at every size tested
```

### Acceptance matrix (real emulator, windowed `-gpu swiftshader_indirect`, live Gateway)

| viewport | font_scale | five full bar labels | `ONLINE` on one line |
|---|---|---|---|
| 360 dp | 1.0 | yes | yes |
| 360 dp | 1.5 | yes | yes |
| 320 dp | 1.3 | yes | yes |
| 320 dp | 1.5 | yes | yes |
| 160 dp | 1.5 | **no — clips** | chip collapses |

Evidence: `evidence/raw/mission-book/UI-102/v2-*.{png,xml}` plus
`android-shell-connected-native.png` (the connected Devices surface with reference-node telemetry).

### Three corrections a reviewer must know about

1. **A false pass, then an over-correction, both from the same mistake.** The narrow-width
   acceptance was run for two increments at "`320x640`" — *pixels*. At density 320 that is a
   **160 dp** viewport, half the width of the narrowest real phone, so the widths that matter
   (320 dp, 360 dp) had never been tested. A hierarchy dump then "passed" it (dumps report a
   widget's full text and cannot show clipping) and a screenshot "failed" it. Both claims are
   withdrawn and replaced by the matrix above. **A legibility claim must be made from pixels.**
2. **`screencap` is not impossible on this host.** The recorded limitation was a property of the
   launch flags, not the machine: `-no-window -gpu host` gives a black frame, and a *windowed*
   emulator with `-gpu swiftshader_indirect` captures the Compose surface correctly.
3. **A residual limit, recorded not hidden.** At 160 dp @ 1.5 the labels still clip and the
   documented icon-only fallback does not engage, so degradation is not yet graceful at that width.
   It is below any real device and outside the specified acceptance, which is why it does not block
   completion — but the fallback does not behave as documented.

### Not claimed

* **Keyboard/focus traversal has no instrument on this host.** `ui-test-junit4` and `androidx.test`
  are absent from the offline Gradle cache, so no `androidTest` could be built; the measured-fit
  path itself is asserted only through the pure arithmetic in `UiSizing.kt`, not through a
  composition.
* **The raw machine timestamp on the default path** (`Last seen: 2026-10-01T15:42:25.473Z`) is left
  as-is deliberately. Web renders the same value, so changing Android alone would break the
  truth-parity this task just established. Raised as a **cross-surface** question.
* **Review is not performed by Mech.** Per `CONSTRUCTION_RULES.md` §3 the review host must be a
  different physical host, so this report is offered for review, not as a verdict.

## Language reading link / 语言阅读链接

[Complete reading translation / 完整阅读译文](./zh-CN/DEVELOPMENT_REPORT.md)
