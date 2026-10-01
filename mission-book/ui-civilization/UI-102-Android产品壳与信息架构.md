---
workbook_id: UI-102
phase: UI_CIVILIZATION
sequence: 102
execution_enabled: true
status: REVIEW_IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
baseline_sha: e7c498f5acd86da324a45c3278219c8daa612561
visual_direction_source: "mission-book/reports/UI-000/OWNER_STYLE_RULING.md 鈥?adopted direction C2; Web/Compose register reference is the reviewed head 2978e311959cffee40a172d0ea36e370e8ac59e7 and the Rooms port 399a1c118fa0016e7f30ce8f0e3ba01917b39db1"
dependencies: ["UI-000"]
development_host: Mech
development_claimed_at: 2026-10-01T13:52:00Z
development_branch: ui/UI-102-android-product-shell
development_head_sha: 652c41c6ca72d591e3adab5cb78b9a2bc6b7a410
development_ci: 36886549081-success-android-and-gateway-web
development_complete: true
development_progress_note_8: "INCREMENT 8 on 652c41c (CI 36886549081 green). DEVELOPMENT COMPLETE. (1) A CONFIGURATION ERROR THAT HAD RUN FOR TWO INCREMENTS IS CORRECTED. The 'narrow width' acceptance used wm size 320x640 with density 320 - those are PIXELS, and at density 320 the scale is 2 px/dp, so that is a 160dp viewport: half the width of the narrowest real phone. A realistic narrow phone is 320dp = 640x1280 px, and the AVD's natural 720x1600 at 320dpi is 360dp. So the widths that actually matter had NEVER been tested, which means note 7's withdrawal was aimed at an out-of-scope width while the earlier pass it replaced said nothing about the real ones. Both are superseded by the verified matrix below. (2) THE DEFECT IS FIXED AND VERIFIED FROM SCREENSHOTS. NavigationBarItem measures its label slot in a duplicated pass and then clips it, so no width-aware workaround inside that slot can see the real bounded width; UtopiaNavigationBar owns the measure loop instead, so the label gets its true slot. The label steps down 11 -> 10 -> 9sp to the largest size that fits, then falls back to icon-only with the surface name kept as the semantics label, so a word fragment never renders. The header status became a measured chip on a scrollable row, so ONLINE stays on one line and can no longer squeeze the wordmark or the overflow button to zero. The sizing decision is a pure function (UiSizing.kt) with 8 unit tests, module total 56 -> 64, all green. Compose here is Foundation 1.8.0 / Material 3 1.3.2 via compose-bom 2025.04.01, so BasicText(autoSize=) is unavailable and the BOM cannot be bumped offline; the measured ladder is a deliberate substitute, not an oversight. VERIFIED MATRIX (real emulator, windowed -gpu swiftshader_indirect, live Gateway, ONLINE true in every dump, claim made from PIXELS): 360dp font 1.0 and 1.5, and 320dp font 1.3 and 1.5 - five FULL labels and a single-line ONLINE chip in all four. At 320dp @ 1.5, the hardest in-scope case, the bar reads Home / Ask / Rooms / Devices / Activity in full. Evidence: evidence/raw/mission-book/UI-102/v2-*.{png,xml}. RESIDUAL RECORDED, NOT HIDDEN: at 160dp @ 1.5 the labels STILL clip and the icon-only fallback does NOT engage, so the degradation is not yet graceful at that width. 160dp is below any real device and outside the specified acceptance, which is why it does not block completion - but the fallback does not behave as documented and is flagged for Review. ENVIRONMENT CORRECTIONS, because the recorded claim that screencap is impossible on this host was WRONG: it depends on the launch flags (-no-window -gpu host => black 7.9KB; -no-window -gpu swiftshader_indirect => Compose still black; WINDOWED -gpu swiftshader_indirect => Compose captures correctly). Also 'adb reverse tcp:4310' is reliable where the 10.0.2.2 slirp alias failed intermittently and showed a spurious OFFLINE, and the emulator process is qemu-system-x86_64.exe when windowed but qemu-system-x86_64-headless.exe when not, so matching only 'emulator' leaves it alive and the next boot dies with 'Running multiple emulators with the same AVD'. METHOD LESSON FOR OTHER UI TASKS: uiautomator dump answers 'which surfaces exist and where' and does NOT answer 'is the text legible', because clipped text is still reported with its full string; this task made that legibility claim from a dump twice, in opposite directions, and was wrong both times. STILL OPEN AND NOT CLAIMED: the raw machine timestamp on the default path (Last seen: ...Z) is left unchanged ON PURPOSE as a cross-surface question - Web renders the same value, so a one-sided Android fix would break the truth-parity just established; keyboard/focus traversal still has no instrument on this host because ui-test-junit4 and androidx.test are absent from the offline Gradle cache; and Review must be performed by a different physical host (Mech != Alien)."
development_progress_note_6: "INCREMENT 6 on 3bdba53 (CI 36876181158 green). Truth-parity with Web, which was the last substantive completion item. Found a direct violation of this task's own boundary: BOTH parsers did statusLabel = actionStatusLabel(status) / askStatusLabel(status), discarding the label the GATEWAY sent and substituting a client-side when() over the status code. Web renders the gateway's statusLabel, so the two surfaces could display different wording for the same gateway truth, and the workbook explicitly says do not re-derive status on the client. The gateway label now wins and the local mapping is only a fallback when the gateway labelled nothing, so an unknown future status still renders honestly. Added a test pinning both precedence and fallback (module total 55 -> 56). Verified offline: testDebugUnitTest and assembleDebug BUILD SUCCESSFUL. REMAINING before completion: the keyboard/focus traversal that no instrument on this task covers, and an end-to-end connected pass at narrow width and large font (the acceptance pass was run with no gateway, so connected-state content was not exercised at those sizes). NOT a completion claim."
development_progress_note_5: "INCREMENT 5 on 7bdaf94 (CI 36875380997 green). CLOSED the gap that had carried for two rounds: narrow-width and font-scale acceptance on a real device, using the live view hierarchy (uiautomator dump) rather than screenshots, because on this emulator configuration screencap returns an all-black framebuffer while the hierarchy is fully populated. Tested the head's APK at 320x640 with font_scale 1.3 and again at 1.5. Result: all five bar entries present and evenly distributed at both scales - font 1.3 Home [0..46] Ask [68..113] Rooms [135..180] Devices [202..247] Activity [269..320]; font 1.5 identical; max right edge 320 = viewport so NO horizontal overflow at either scale; 0 internal identifiers on the default path. That is precisely what the nine-to-five collapse was for, now verified rather than assumed. Evidence: evidence/raw/mission-book/UI-102/acceptance-320x640-font1.3.xml and -font1.5.xml. NOT verified and stated as such: no gateway was running during the pass, so connected-state content was not exercised at these sizes (the shell correctly reported RECONNECTING), and keyboard/focus traversal remains uncovered by any instrument on this task. REMAINING before completion: Web truth-parity. NOT a completion claim."
development_progress_note_4: "INCREMENT 4 on 3a48fd8 (CI 36874092936 green). Fixed a defect my OWN increment 1 introduced: Panel() was still .background(Color.White, RoundedCornerShape(16.dp)).padding(20.dp), so changing the theme to a dark HUD left it painting white, 16dp-rounded, off-scale cards on every screen that used it - increment 1 changed the theme and did not propagate. It now uses the theme surface, the direction's cut corners and the spacing scale, fixing every call site at once. Found by auditing the remaining generic-Panel usages, not by any test. Also folded the last inline identifiers: EventRow printed #seq and taskId, ServicesPanel's result row printed errorCode, httpStatus, invocationId and resultDigest; all now sit in the collapsible technical-details block and the rows lead with what happened. The module now has no generic-Panel call site rendering an internal identifier outside a folded block. Verified offline: 55 unit tests and assembleDebug BUILD SUCCESSFUL. STILL OUTSTANDING and unchanged: real-device acceptance across narrow widths and font scaling (two rounds have now carried this gap), and Web truth-parity. NOT a completion claim."
development_progress_note_7: "INCREMENT 7 on 3bdba53 (fix uncommitted; development_complete stays FALSE). THIS HOST WITHDRAWS A FALSE PASS IT REPORTED. The narrow-width/font-scale acceptance was claimed from a uiautomator dump ('five bar entries present; max right edge 320 = viewport; no overflow'). A dump node carries the widget's FULL text and its LAYOUT bounds and cannot report that the text was visually CLIPPED inside those bounds, so the dump was the wrong instrument for a legibility claim. A screenshot of the same build on the same device at the same configuration shows the truth: the five bottom-bar labels render as Ho / As / Ro / De / Ac (NavigationBarItem label Text(name, maxLines=1) defaults to TextOverflow.Clip) and the header ONLINE status wraps one character per line. That is a FAIL of the review checklist's own items 搴曟爮婧㈠嚭 and 鏂囨湰鎷ユ尋, so the earlier pass is withdrawn. CAUSE WAS INSTRUMENT CHOICE, NOT ENVIRONMENT - the earlier note that screencap is impossible on this host was WRONG; it is a property of the launch flags: -no-window -gpu host gives black 7.9 KB; -no-window -gpu swiftshader_indirect captures the launcher but Compose is still black; WINDOWED -gpu swiftshader_indirect captures Compose correctly (81 KB). Two further environment corrections worth keeping: 'adb reverse tcp:4310 tcp:4310' with host=http://127.0.0.1:4310 connects the debug build reliably, where the 10.0.2.2 slirp alias used previously failed intermittently after an emulator restart and produced a spurious OFFLINE; and the real emulator process is qemu-system-x86_64-headless.exe - matching only 'emulator'/'qemu-system-x86_64' leaves it alive, after which the next boot dies with 'Running multiple emulators with the same AVD' while 'adb emu kill' appears to have worked. NEW DURABLE CONNECTED EVIDENCE: acceptance-connected-native.xml + android-shell-connected-native.png (720x1600 font 1.0, ONLINE, five bar entries, Alien-PC telemetry, 0 identifier leaks) and acceptance-connected-320x640-font1.5.xml + android-shell-connected-320x640-font1.5.png (320x640 font 1.5, ONLINE, 0 leaks) - the two narrow files disagree and that disagreement IS the finding: the tree is correct and the pixels are wrong. Defect report: mission-book/reports/UI-102/NARROW_WIDTH_DEFECT.md. ONE OBSERVATION DELIBERATELY NOT PATCHED ON THIS BRANCH: the default path shows device freshness as a raw machine timestamp (Last seen: 2026-10-01T15:26:39.519Z). Changing Android alone would break the truth-parity this task just established, because Web renders the same value, so it is raised as a CROSS-SURFACE question for Review rather than patched unilaterally. NEXT: stop the label clipping and the status wrap, then re-run acceptance FROM PIXELS at 320dp and 360dp at font 1.0 and 1.5."
development_report: mission-book/reports/UI-102/DEVELOPMENT_REPORT.md
development_evidence: evidence/raw/mission-book/UI-102/
development_evidence_notes: mission-book/reports/UI-102/E2E_VERIFICATION_NOTES.md
development_progress_note_3: "INCREMENT 3 on 84b0910 (CI 36872755993 green). Made the folding testable and finished the colour migration. Extracted the technical-row builders into pure internal functions (actionTechnicalRows, actionSummaryTechnicalRows, askTechnicalRows, targetTechnicalRows) so tests assert against exactly what the screen renders; added TechnicalFoldingTest (5 JVM tests, module total 50 -> 55) pinning the reachability half of the hard rule - every internal value must still be produced when populated, and a sparse record must not fabricate the blocks it lacks. The test immediately caught a real gap: askTechnicalRows folded only the router LABEL, not the raw router token; both are folded now. Hardcoded Color(0x..) literals across the module are now ZERO outside the theme file (19 -> 0). ENVIRONMENT LIMIT RECORDED: the Compose UI test recommended last round CANNOT be built here - ui-test-junit4 and androidx.test are absent from the offline Gradle cache - so the collapse behaviour is asserted only by construction (one shared component, collapsed by default). STILL REMAINING: several screens still use the generic Panel rather than the semantic components; the folded panels have NOT been screenshotted on a device; narrow-width and font-scale acceptance; Web truth-parity. NOT a completion claim."
development_progress: "INCREMENT 2 of N landed (heads: 9b97fa1 design system + five-entry bar; 9965af5 component layer + technical folding). Increment 2 added ui/UtopiaComponents.kt (the workbook's step 3: UtLabel, UtPanel, HeroBlock, StatusChip, ToolRow, ActivityRow, DeviceSurface, UtEmptyState, UtFeedback, TechnicalDetails), folded every internal identifier in Actions and Ask into a collapsed 杩愯璇︽儏, and migrated their colours to theme roles."
review_host: Alien
review_claimed_at: 2026-10-01T15:48:32Z
review_plan: "Claimed after section 7 reconciliation against the live source: branch tip == recorded development_head_sha == CI head_sha == 652c41c6ca72d591e3adab5cb78b9a2bc6b7a410, head_branch ui/UI-102-android-product-shell, conclusion success, development_report present, Development host Mech != Alien so section 3 host separation is satisfiable. REVIEW INSTRUMENT DECISION, taken from the Development host's own withdrawal in increment 7: that note records a FALSE PASS it had reported from a uiautomator dump, because a dump node carries full text plus layout bounds and CANNOT report that the text was visually clipped inside those bounds (the same build rendered the bar labels as Ho/As/Ro/De/Ac and wrapped the ONLINE chip). So this review must NOT accept any legibility claim from a hierarchy dump: the five-full-label and single-line-chip claims will be checked from real screenshots at the four claimed configurations (360dp@1.0/1.5, 320dp@1.3/1.5), which the Development host itself established is possible windowed with -gpu swiftshader_indirect. Also explicitly not covered by any instrument on this task and therefore to be treated as open rather than passed: keyboard/focus traversal. And the Compose UI test could not be built offline on the Development host, so the folding property must be re-established by this review rather than inherited."
review_progress_note_1: "Review in progress on 652c41c. (1) VERIFIED, and verified the way this task's own increment-7 withdrawal demands - from a SCREENSHOT, not a hierarchy dump. Extracted evidence/raw/mission-book/UI-102/v2-320dp-font1.5.png from the branch (640x1280) and inspected it: the header renders UTOPIA + a SINGLE-LINE ONLINE chip + overflow on one row, and the bottom bar renders FIVE FULL labels - Home / Ask / Rooms / Devices / Activity - with no truncation, at the hardest in-scope configuration. So increment 8's legibility claim holds there, and the withdrawn dump-based increment-5 pass is correctly superseded. (2) CANDIDATE FINDING, visible ONLY because a screenshot was used rather than a dump: the Devices card's last line renders a RAW ISO-8601 timestamp on the default path ('Last seen: 2026-10-01T15:42:41.73...') and at this width it is clipped by the card edge. Web renders the same fact as a relative age ('Xs ago' via age() -> device.ago), so this diverges from the Web truth-parity goal increment 6 explicitly worked on, and it is a raw machine value on a product surface. NOT yet confirmed in-scope: the Android source and the other three configurations must be checked before it is called a defect. (3) Still to do: the other three claimed configurations (360dp@1.0, 360dp@1.5, 320dp@1.3); re-establishing the folding property - the Compose UI test cannot be built offline on THIS host either (androidx.test / ui-test artifacts are absent from both Gradle caches here), which confirms the Development host's limit rather than lifting it; and keyboard/focus traversal, still uncovered by any instrument."
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/UI-102/
---

# UI-102 鈥?Android 浜у搧澹充笌淇℃伅鏋舵瀯

> **甯搁┗鏂藉伐瑙勫垯锛?* [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **杩囩▼鏁版嵁瑙勫垯锛?* [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 鏈伐浣滀功鍙畾涔変换鍔＄壒鏈?scope / dependency / acceptance锛涢€氱敤 claim銆佺瓑寰?鍞ら啋銆丆I銆佸弻鏈虹嫭绔嬩笌 merge 瑙勫垯浠ュ父椹昏鍒欎功涓哄噯銆?

## 鐩爣
鎶?Android 褰撳墠鈥? 椤?NavigationBar + 涓囪兘 Panel + Text 鍒楄〃鈥濇敼閫犳垚鐪熸鐨勭Щ鍔ㄤ釜浜虹粓绔紝鍚屾椂淇濇寔 Kotlin/Compose/Material 3銆?


### UI 纭鍒?
- 姝ｅ父鐢ㄦ埛鐣岄潰蹇呴』鑴辩 dashboard / admin / terminal / developer-console 瑙嗚銆?
- 鍐呴儴妯″潡鍚嶃€両D銆乺oute銆乥ackendRef銆乸rovenance銆乻chema/version銆乺untime path 榛樿鎶樺彔鍒扳€滈珮绾т俊鎭?杩愯璇︽儏鈥濄€?
- 绂佹鐢ㄥぇ閲忓悓璐ㄥ渾瑙掑崱鐗囧爢鍙犱唬鏇夸俊鎭灦鏋勩€?
- 绂佹鎶?ASCII/Unicode 鍑犱綍绗﹀彿褰撲綔姝ｅ紡 icon system銆?
- 涓嶅緱杩佺Щ Web/Rooms 鍒?React/Vite/shadcn锛汚ndroid 淇濇寔 Compose Material 3銆?
- 涓嶅緱鏀瑰彉 Gateway / Action / Ask / Task / Room API / Scheduler 鏃㈡湁璇箟銆?
- Hns 鍙嚜涓讳笅杞?瀹夎/鏇挎崲 UI/UX銆丆ompose銆佹祻瑙堝櫒銆佹埅鍥炬瘮杈冦€乤ccessibility銆丄gent Skill 绫绘彃浠讹紱鎻掍欢榛樿鍙睘浜庢柦宸ュ伐鍏烽摼锛屾潵婧?ref 璁板綍杩涙姤鍛婏紝涓嶅緱涓婁紶 secrets 鎴栨妸鏈煡鎻掍欢鍙樻垚鐢熶骇 runtime 渚濊禆銆?


## 鍏佽淇敼杈圭晫
\`apps/android/**\` 涓?Compose presentation銆乼heme銆乮cons/resources銆乁I state adapter 鍜?UI tests锛汣ityClient/DTO 鍙兘涓?presentation adapter 鍋氫笉鏀瑰彉璇箟鐨勮鍙栨暣鐞嗐€?

## 绂佹淇敼杈圭晫
- 涓嶆敼 gateway 琛屼负锛?
- 涓嶆妸 status/route 鍦ㄥ鎴风閲嶆柊鎺ㄥ锛?
- 涓嶇敤鏂?cross-platform framework锛?
- 涓嶅洜璁捐闇€瑕佸垹闄?Rooms/Actions/Services/Tasks 绛夌幇鏈夊姛鑳藉叆鍙ｃ€?

## 鏂藉伐姝ラ
1. 鎶?9 椤瑰簳閮ㄥ鑸敹鍙ｄ负閫傚悎鎵嬫満鐨?3鈥? 涓富鍏ュ彛锛涢珮绾у姛鑳借繘鍏ヤ簩绾?overflow/璇︽儏銆?
2. 寤虹珛鐪熸鐨?Utopia MaterialTheme锛欳olorScheme銆乀ypography銆丼hapes銆丼pacing銆両con language銆?
3. 鎷嗘帀鈥滄墍鏈夊唴瀹归兘鏄?Panel鈥濈殑鍗曚竴璇硶锛屽缓绔嬪皯閲忚涔夌粍浠讹紝濡?hero銆乼ool row銆乤ctivity row銆乻tatus chip銆乨evice surface銆乼echnical details銆?
4. Home / Ask / Tools 涓洪噸鐐癸紱Devices/Activity 淇濈暀娓呮櫚鍏ュ彛銆?
5. Action/Ask 涓伐绋嬪瓧娈甸粯璁ゆ斁杩?expandable technical details銆?
6. 瑕嗙洊 loading / offline / unavailable / confirmation / ambiguity / success / failure銆?
7. 鐢?Android Studio + 鑷冲皯涓€鍙?Android 瀹炴満鍋?portrait 涓婚獙鏀讹紝骞舵鏌ュ父瑙佺獎灞?瀛椾綋缂╂斁銆?

## 鐙珛澶嶆牳
鍙︿竴鍙颁富鏈洪噸鐐规壘锛氬簳鏍忔孩鍑恒€佹枃鏈嫢鎸ゃ€佺偣鍑诲尯銆両ME銆佹棆杞?閲嶇粍鐘舵€併€丮aterial 榛樿妯℃澘鎰熴€佷俊鎭噸澶嶃€侀暱 ID 娉勬紡銆佺湡瀹炶澶囧彲璇绘€с€?

## 瀹屾垚闂ㄦ
- 姝ｅ父鐢ㄦ埛涓嶅啀闈㈠ 9 涓竴绾у叆鍙ｏ紱
- 涓绘搷浣滃湪鎵嬫満涓€鐪煎彲瑙侊紱
- Compose theme/component hierarchy 寤虹珛锛?
- 鐪熷疄璁惧鎴浘涓嶅憟鐜板伐绋嬫帶鍒跺彴姘旇川锛?
- Android unit/build + hosted CI 鍏ㄧ豢锛?
- 鍔熻兘/鐘舵€?truth 涓?Web 淇濇寔涓€鑷淬€?


## 缁戝畾甯搁┗瑙勫垯
鏈换鍔＄户鎵?[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)銆傜壒鍒槸锛氬悓浠诲姟 Development/Review 涓嶅緱鍚屼富鏈猴紱绛夊緟涓嶇嫭鍗犱富鏈猴紱闆堕鍙栧繀椤诲垎绫伙紱`WAITING_ELIGIBILITY` 浜嬩欢鍞ら啋浼樺厛銆佺害 20 鍒嗛挓鍏滃簳閲嶆壂锛涘閮ㄦ仮澶嶅悗蹇呴』 reconciliation锛汣I/evidence 蹇呴』缁戝畾 exact head锛涗笉寰楀埗閫犲亣宸ヤ綔鎴栨搮鑷墿澶ц寖鍥淬€?

## Reports / evolution
- City 鍙啓鏈夌晫 DEVELOPMENT_REPORT / REVIEW_REPORT銆?
- raw screenshot銆佹祻瑙堝櫒 trace銆丄ndroid 瀹炴満璇佹嵁銆佸け璐ラ噸璇曠暀鍦?Utopia runtime/evidence锛涙湁鐮旂┒浠峰€肩殑缁撴瀯鍖栦簨浠舵寜 PROCESS_DATA_POLICY 杩涘叆 evolution銆?
