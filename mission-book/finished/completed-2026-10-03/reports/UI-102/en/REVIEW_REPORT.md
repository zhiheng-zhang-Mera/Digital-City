# UI-102 — Android product shell and information architecture · REVIEW REPORT

[Authoritative source / 权威原稿](../REVIEW_REPORT.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

> Standing rules: [CONSTRUCTION_RULES.md](../../../../../CONSTRUCTION_RULES.md)
> Workbook: [UI-102](../../../ui-civilization/UI-102-Android产品壳与信息架构.md)
> Review Alien, Development Mech: §3 two-host independence.
> Reviewed head 652c41c6ca72d591e3adab5cb78b9a2bc6b7a410, CI36886549081 success.
> Conclusion head ed4a663a4724c228d971809efcf42f113a9d7ca3, CI36887701849 success.

## 1. Result

**PASS_WITH_REPAIRS.** One confirmed defect directly repaired with regression tests. Several unverified items are honestly listed in §4 without an implied pass.

## 2. Choice of review instrument: the task's most important step

At increment7 Development proactively withdrew its own false pass. Its reasoning must be inherited unchanged:

> It used uiautomator dump to assert five bottom-bar items, max right edge equal to viewport and no overflow. But dump nodes carry complete text and layout bounds, without representing visual clipping inside them. Screenshots of the same build showed Ho / As / Ro / De / Ac and ONLINE one character per line.

This round therefore accepts no hierarchy-dump legibility conclusion: all use screenshots.

## 3. Verified

### 3.1 Legibility: screenshot of the hardest in-scope configuration

v2-320dp-font1.5.png,640×1280, extracted from the branch and examined pixel by pixel:

- Header: UTOPIA, single-line ONLINE chip and overflow button on one row.
- Bottom bar: five complete Home/Ask/Rooms/Devices/Activity labels, no truncation.

Increment8's legibility claim holds here; the withdrawn increment5 dump false pass has been correctly replaced.

### 3.2 Confirmed R-1: repaired with regression test

Original Devices.kt:18:

```kotlin
Text("Last seen: ${node.optString("lastHeartbeatAt","Unavailable")}")
```

The default product surface prints the Gateway raw ISO-8601 value; Web renders relative time for the same fact via age()→device.ago. The screenshot also shows the line clipped by the card edge at320dp/1.5.

Three facts classify it as an omission rather than a design choice:

1. DeviceCard already receives now:Instant.
2. MainActivity already has a per-second now LaunchedEffect.
3. PairingProtocol.kt already calculates relative duration via Duration.between.

**Both pipeline and pattern exist; only line18 does not use them.**

Classification: this task's increment6 Web truth-alignment goal and its own text-crowding check, not raw-identifier leakage. The folding rule lists module names/ID/route/backendRef/provenance/schema, not timestamps; deliberately avoid broadening it.

Fix: add pure internal relativeAge(iso,now), using the supplied now rather than reading the clock, preserving testability. Wording intentionally exactly matches Web age(), Ns ago: alignment is the goal, and inventing prettier tiers would create the divergence the reviewer should remove. Future clock skew clamps to0s; missing/invalid values retain Unavailable.

Verification: RelativeAgeTest4 tests/0 failures/0 errors, module68/0 failures, exactly4 above former64. Confirmed from JUnit XML, not just exit code: a green exit that skipped new tests proves nothing.

## 4. Unverified: explicitly no pass implied

1. No new post-repair narrow screenshot. Removal of clipping rests only on the new string being far shorter than ISO, with no screenshot evidence.
2. Other declared360dp@1.0,360dp@1.5,320dp@1.3 configurations were not independently captured in this review.
3. Keyboard/focus traversal still lacks any instrument coverage.
4. Compose UI test cannot be built offline here; androidx.test/ui-test absent in both Gradle caches. Review confirmed rather than removed this environment limit on proving folded-not-deleted.

## 5. Disclosure

- Only Devices.kt and its new test modified; no API/DTO/gateway semantics or force-push.
- No rewriting of Mech Development fields.
- A tool pitfall was encountered extracting branch evidence: PowerShell > with git show corrupts binary, producing Unsupported or malformed image data. Worktree copying avoids it.
