# REX-807 wiring repair verification

- Host: Mera-Alianware; same-host engineering diagnostics only.
- Source: D:/Utopia-tree/REX-Series-Alien-final, branch review/REX-series-final-Alien-20261007.
- Frozen repair SHA: ee4f9a794f9675b15cfba760a789c12891b12c44; parent 4467b5ae759033ef8bc4a60e534c38001e7a1d34.
- Node: v24.19.0. Browser: Playwright 1.55.1, installed Microsoft Edge, headless.
- Dependencies: root pnpm install --frozen-lockfile passed. No City parser dependencies needed by these focused checks.

## Observed RED

- web-red.log: four real gateway/browser tests failed against the integrated parent: CSV was a JSON envelope, metrics were absent from the shipped pane, a real enrolled member was described as Owner, and campaign read failure was silently idle.
- store-red.log: real gateway ENOTDIR campaign storage returned UNAVAILABLE but the page still said No run is live.
- android-semantic-red.log: original ResearchRun parser restored temporarily against the new JUnit tests; 10 tests, 1 failure in gatewayBooleanUnfinishedIsVisible. Fixed source was restored before commit.
- Initial expanded focused run: 34/35 passed; accepted REX-801 register-success/list-refresh-failure test failed because the registry rejection had been consumed. Explicit registry rejection propagation was restored and the final rerun passed. The original run output is in the tool transcript; its focused-green.log file was overwritten by the rerun.
- Initial metric regression iteration: 3/4 passed; exclusion test incorrectly assumed a reason property. Corrected the test to the actual exporter why property and rendered actual what/why/wouldRequire fields. The original run output is in the tool transcript; its web-green.log file was overwritten by the rerun.
- android-red.log: first Gradle invocation did not execute tests because inherited JAVA_HOME was invalid. android-attempt.log: corrected PATH JDK17 but no SDK configured. These are environment failures, not semantic RED.

## Observed GREEN on frozen repair

- focused-green.log: 35/35 pass across rex807-wiring, rex807-surface, rex807-danger-confirmation, rex801-research-ui, rex803-campaign-web, rex804-web, rex805-web, rex806-artifact-surface.
- Browser regression includes CSV exact byte equality to gateway metricsCsv, all actual artifact metric values including NOT_MEASURED, receipt provenance and exclusions, actual enrolled-member export denial, failed read and recovery, actual unfinished boolean and 51-receipt truncated window, actual campaign store failure.
- android-green.log: full :app:testDebugUnitTest :app:assembleDebug BUILD SUCCESSFUL. XML copied into android-test-results/: 22 suites, 121 tests, zero failures and errors, ResearchRunTest 10/10.
- Android process-only environment: JAVA_HOME D:/AndroidStudio/jbr (JDK 21.0.10), ANDROID_HOME D:/Tools/UtopiaAndroidSdk (SDK platform 36).
- Debug APK SHA256: f74404cc7d85048c039fd1fc69110d4e3d6743884f4bea998a977818dcfdce83.
- git diff --check passed; post-commit source worktree clean.

## Bounds

No physical device flow was observed. No remote push, merge, release marker, or REX-890 physical-study acceptance was performed. Root owns independent review, broader tests, remote CI and authorized merge.

Existing metric header still refers to this run although source is the held campaign artifact; actual campaign IDs/raw pointers and checksums are exposed in Technical details. This wording caveat was sent to root without changing frozen source.
