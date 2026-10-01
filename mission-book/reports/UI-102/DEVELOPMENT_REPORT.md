# UI-102 — DEVELOPMENT REPORT (WIP, first increment)

```text
MISSION                    = UI-102 (Android 产品壳与信息架构)
PHASE                      = UI_CIVILIZATION
REPORT_ROLE                = DEVELOPMENT
HOST                       = Mech
BASELINE_SHA               = e7c498f5acd86da324a45c3278219c8daa612561
BRANCH                     = ui/UI-102-android-product-shell
HEAD_SHA                   = 9b97fa187cd28acfd4ae3463719812d9b76dc098
CI                         = 36868228769-success-android-and-gateway-web
DEVELOPMENT_COMPLETE       = false
STATUS                     = IN_PROGRESS (first increment landed; see §4 for what remains)
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

## 6. State

```text
DEVELOPMENT_COMPLETE = false
REVIEW_HOST          = null (nothing to review as complete yet)
```

Mech intends to continue this task in the next round. Nothing here is offered as complete, and a
reviewer should not be asked to sign off a partial shell.
