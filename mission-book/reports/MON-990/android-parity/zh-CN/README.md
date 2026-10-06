# MON-990 第9项 Android 部分：工具与结果

[英文规范说明](../README.md)。复检者Mech在精确版本fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40生成全部材料，非作者。发布用于让另一主机重跑Android第9项，而不是凭信任接受。

## 为什么建立此材料包

原../REVIEW_REPORT.md将该项写NOT_RUN，称只安装JDK26而AGP拒绝构建。实际这是只读PATH中java造成的复检者测量错误，主机一直有Temurin17.0.18：

```text
C:\Users\15601\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2
```

报告保留旧错误并明确纠正；此目录使修正结论可验证。

## 重跑方法

原命令逐字保留：

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

步骤1：在独立工作树检出精确复检版本。步骤2：JAVA_HOME指向上述JDK17，运行该版本Android单测和构建，预期22套118项0失败；XML结果按android-test-summary汇总。步骤3：capture-monitor-payloads启动该版本Gateway，捕获Android将渲染的真实载荷。步骤4：临时投影探针及JSON复制到测试目录，指定ReviewedHeadContractParityTest并重跑，预期31nodes/1visible/2clusters/1receipt ACCEPTED。

## 文件作用

| 文件 | 内容 |
|---|---|
| capture-monitor-payloads.mjs | 从复检版本启动Gateway，创建30规范任务、取消一项并提交一份decision receipt，原样写两个响应并打印捕获内容；没有有效材料的捕获应可见，不假定成功。 |
| reviewed-head-monitor-graph.json | 同Gateway的monitor/graph?collapse=24；cityId f2fb48c9-…，health COMPLETE，31nodes、1visible、2clusters，authoritative false。 |
| reviewed-head-monitor-decisions.json | 同Gateway的monitor/decisions?limit=50；1receipt，appliedBy null、application RECORDED_ONLY。 |
| ReviewedHeadContractParityTest.kt | 临时JVM探针，非产品测试，也未提交产品；用服务返回cityId向parseMonitorGraph/parseMonitorDecisions输入载荷，断言Android接受并形成一致投影。 |
| android-test-summary.txt | 该版本应用单元测试逐套统计。 |

## 能够与不能够证明什么

```text
ESTABLISHES   the Android surface's own projection, at the reviewed head, builds, passes 118 unit tests, and accepts
              and correctly interprets the bytes this head's server actually serves - including the two invariants that
              matter for this programme's recurring defect class: a collapsed view may not hide a risk-carrying node,
              and a receipt may not claim to have been applied by the monitor.
DOES NOT      observe the handset-rendered surface. adb reports no device on the review host; the handset is live in
              the City as a control surface, attached elsewhere. That half remains NOT_OBSERVED here and is evidenced
              only by the author's capture (section 3 of the review report).
```

证明：精确版本Android自身投影可构建、118单测通过，接受并正确解释本版本服务真实输出；尤其折叠不能隐藏风险节点、监视器receipt不能声称已执行。

不能证明：手机实际渲染。复检主机adb无设备，手机在City中在线但接到别处；该部分仍为本机NOT_OBSERVED，仅作者实拍提供证据（复检报告§3）。

标记释放依据是同版本两半执行验证和披露的设备边界；报告明确记录为复检者判断，而不是测量。
