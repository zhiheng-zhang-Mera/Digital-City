# UI-102 — 设备验证说明（增量 2）

[Authoritative source / 权威原稿](../E2E_VERIFICATION_NOTES.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

> 主机 Mech。分支 ui/UI-102-android-product-shell，头 9965af5（CI 36869095667）。配套 [DEVELOPMENT_REPORT.md](../DEVELOPMENT_REPORT.md)；该报告仍是完成记录，仍声明 DEVELOPMENT_COMPLETE=false。

## 1. 在真实设备验证什么

应用连接真实本地 Gateway（主机 dev-gateway，加预置 .runtime/local-config.json），并 dump **实时 view hierarchy**：

```text
topResumedActivity = city.utopia.control/.MainActivity
connection                              ONLINE
title / copy                            "Devices" · "Your devices. One shared view." · "Waiting for devices"
bottom bar entries, in order            Home · Ask · Rooms · Devices · Activity   ← exactly five
```

原块记录 MainActivity 为 resumed、ONLINE、Devices 页标题及文案、依序 Home/Ask/Rooms/Devices/Activity 恰好五入口。它在设备而非仅源代码上确认核心要求“正常用户不再面对 9 个一级入口”，也确认新主题和 online 路径可用。

## 2. 可复用技术：将 debug build 指向真实 Gateway

应用从 SharedPreferences city-connection 读取 host/token。debug build 可不用键入而预置；正是它使 Android 端到端检查成为可能：

```text
adb push city-connection.xml /data/local/tmp/
adb shell run-as city.utopia.control cp /data/local/tmp/city-connection.xml \
    /data/data/city.utopia.control/shared_prefs/city-connection.xml

# city-connection.xml
<map>
  <string name="host">http://10.0.2.2:4310</string>   <!-- emulator alias for host loopback -->
  <string name="token">…gateway CITY_TOKEN…</string>
</map>
```

原始命令块保留 adb push/run-as 和 shared_prefs XML，包括当时的 emulator loopback alias 与省略 token。主机侧还可创建真实记录供查看：

```text
POST /api/v0/ask  {"text":"hash a file","idempotencyKey":"…"}   -> records a real Action
GET  /api/v0/actions?limit=50
```

POST ask 产生真实 Action，GET actions 读取记录。

## 3. 未验证项，以及应避免的死路

设备上**未捕获**折叠 Actions/Ask panel。两个 headless-emulator 问题阻挡，记录供后续避免重复：

1. **screencap 返回全黑 framebuffer**，7.9 KB 720×1600 PNG；display 为 ON、mWakefulness 为 Awake，dump 则 hierarchy 完整。故本模拟器配置中 hierarchy dump 被认为可靠而 screenshot 不可靠。增量 1 视觉声明来自当时可工作的截图，所以与配置有关，不声称截图永远不可用。
2. **合成 input tap 不改变 Compose NavigationBar 选择。** 依据 dump 边界点中间，page 仍 Devices，标题未变。Actions 在页头 overflow，是非底栏 surface，因此该路径无法到达。
3. 另一个自己造成的绕路：input keyevent 82 将应用送到 launcher，浪费一轮。脚本验收避免无关 keyevents。

因此**窄屏/字体缩放验收和折叠面板演示仍欠缺**，报告保留在剩余事项。

## 4. 下次建议的仪器

使用 androidTest 中 **Compose UI test**，而非像素或合成 taps。它直接驱动 semantics，避开上述两死路，且能精确断言折叠：

```text
onNodeWithText("运行详情").assertExists()          # the collapse affordance is present
onNodeWithText("actionId", substring = true).assertDoesNotExist()   # identifier not on the default path
onNodeWithText("运行详情").performClick()
onNodeWithText("actionId", substring = true).assertExists()          # but reachable once expanded
```

原块先检查运行详情存在，默认无 actionId，点击后 actionId 可达。这比截图更强且持久，将“折叠而非删除”从读代码声明变为断言。它需要 CI 模拟器/设备；android job 已用于 build/test。

## 5. 值得保留的环境事实

```text
JAVA_HOME must be D:\GDPR-Refine\.tools\jdk-17.0.20.1+1
  (machine JAVA_HOME points at a non-existent path; PATH java is JDK 26, which AGP 8.11 rejects)
AVD utopia36 = android-36 google_apis_playstore x86_64, 720x1600 @320dpi, boot ~75-90s
adb shell settings put global hide_error_dialogs 1   # suppresses system ANR overlays
```

原块要求实际 JDK17 路径，机器 JAVA_HOME 不存在而 PATH JDK26 不被 AGP8.11 接受；列 utopia36 的 Android36 x86_64/尺寸密度/75–90秒启动，并给 suppress ANR overlay 设置。

## 6. 后续轮纠正：上方 §3 / §4 有两项错误

**这里截图并非不可能。** §3 条目1从一个启动配置推断 screencap 不可用，§4因此在认为像素不可用时推荐 Compose UI test。截图可用，取决于 flags；第三组合正确捕获 Compose：

```text
-no-window  -gpu host                  -> black 7.9 KB PNG
-no-window  -gpu swiftshader_indirect  -> launcher captures (226 KB), Compose still black
 WINDOWED   -gpu swiftshader_indirect  -> launcher (786 KB) and Compose (81 KB) both capture
```

验收证据使用的实际命令：

```text
emulator -avd utopia36 -no-audio -no-boot-anim -gpu swiftshader_indirect -no-snapshot -memory 4096
```

**这一点重要，因为 dump 不能回答可读性。** §3 其他声明仍成立，dump 仍适合回答“哪些 surface 存在、在哪里”，但它报告完整文字及布局边界，不报告内部裁剪。依赖它判断标签能放下产生 false pass，被截图立即推翻，见 [NARROW_WIDTH_DEFECT.md](../NARROW_WIDTH_DEFECT.md)。

还应保留两项造成浪费的纠正：

- **通过 adb reverse 连接设备。** adb reverse tcp:4310 tcp:4310 配 city-connection.xml 中 http://127.0.0.1:4310 可靠。§2 的 10.0.2.2 曾成功一次，模拟器重启后间歇失败，表现为像产品 bug 的虚假 OFFLINE，实际不是。
- **模拟器进程名取决于启动。** Windowed 为 qemu-system-x86_64.exe，no-window 为 qemu-system-x86_64-headless.exe。仅匹配 emulator / qemu-system-x86_64 会留下真实进程，下一次因 Running multiple emulators with the same AVD 失败，而 adb emu kill 看似成功。应按 qemu-system-x86_64* 终止。
