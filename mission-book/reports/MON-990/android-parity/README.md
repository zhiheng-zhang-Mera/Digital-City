# MON-990 check 9, Android half — instruments and results

Published with the review so that the Android half of check 9 can be re-taken on another host instead of taken on
trust. Everything here was produced by the reviewer (Mech), not the author, at the reviewed head
`fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40`.

## Why this exists

The first version of `../REVIEW_REPORT.md` reported this half as NOT_RUN, on the claim that "only JDK 26 is installed on
this host" and that the Android Gradle Plugin therefore refuses to build. **That claim was the reviewer's measurement
error, not a host limitation:** it read `java` on `PATH`. A Temurin **17.0.18** has been installed the whole time at

```text
C:\Users\15601\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2
```

The correction is kept in the report rather than overwritten, and this directory is what makes the corrected claim
checkable.

## How to re-run it

```powershell
# 1. the reviewed head, in its own worktree
git -C <utopia> worktree add --detach <dir> fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40

# 2. the app's own Android suite at that head   -> BUILD SUCCESSFUL, 22 suites, 118 tests, 0 failures
$env:JAVA_HOME='C:\Users\15601\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2'
cd <dir>\apps\android ; cmd /c "gradlew.bat :app:testDebugUnitTest :app:assembleDebug --console=plain"
# results: app\build\test-results\**\*.xml   (the totals in android-test-summary.txt)

# 3. capture the reviewed head's OWN monitor payloads (they are the bytes the Android client must render)
node capture-monitor-payloads.mjs    # writes reviewed-head-monitor-{graph,decisions}.json, prints what it captured

# 4. feed those payloads to the Android projection
copy ReviewedHeadContractParityTest.kt <dir>\apps\android\app\src\test\java\city\utopia\control\
copy reviewed-head-monitor-*.json      <dir>\apps\android\app\src\test\resources\
cd <dir>\apps\android
cmd /c "gradlew.bat :app:testDebugUnitTest --tests `"city.utopia.control.ReviewedHeadContractParityTest`" -i --rerun-tasks"
# expect: PARITY reviewed-head=fb042d9 ... nodes=31 visible=1 clusters=2 receipts=1 -> ACCEPTED
```

## What each file is

| file | what it is |
|---|---|
| `capture-monitor-payloads.mjs` | boots a gateway from the reviewed head, creates 30 canonical tasks, cancels one and submits one decision receipt, then writes the two monitor responses verbatim. It prints what it captured, so a capture that produced nothing useful is visible rather than assumed. |
| `reviewed-head-monitor-graph.json` | `GET /api/v0/monitor/graph?collapse=24` from that gateway: cityId `f2fb48c9-…`, health `COMPLETE`, 31 nodes, 1 visible, 2 clusters, `authoritative: false`. |
| `reviewed-head-monitor-decisions.json` | `GET /api/v0/monitor/decisions?limit=50` from the same gateway: 1 receipt, `appliedBy: null`, `application: RECORDED_ONLY`. |
| `ReviewedHeadContractParityTest.kt` | the temporary JVM probe (not a product test, not committed to the product) that feeds both payloads to `parseMonitorGraph` / `parseMonitorDecisions` with the cityId the server itself reported, and asserts the Android projection accepts them and derives a coherent view. |
| `android-test-summary.txt` | per-suite totals from the app's own Android unit run at that head. |

## What this does and does not establish

```text
ESTABLISHES   the Android surface's own projection, at the reviewed head, builds, passes 118 unit tests, and accepts
              and correctly interprets the bytes this head's server actually serves - including the two invariants that
              matter for this programme's recurring defect class: a collapsed view may not hide a risk-carrying node,
              and a receipt may not claim to have been applied by the monitor.
DOES NOT      observe the handset-rendered surface. adb reports no device on the review host; the handset is live in
              the City as a control surface, attached elsewhere. That half remains NOT_OBSERVED here and is evidenced
              only by the author's capture (section 3 of the review report).
```

The marker release rests on both halves being verified by execution at the same head, on the disclosed device seam, and
is recorded in the review report as a reviewer judgement rather than as a measurement.

## Language / 语言

[完整中文读本](zh-CN/README.md) · English source above.

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **2**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| zh-CN | 1 | [打开 / Open](zh-CN/README.md) |

<!-- DOCUMENT_NAVIGATION:END -->
