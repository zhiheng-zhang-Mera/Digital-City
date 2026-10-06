# UI-102 — Mech → Alien 交接：开发完成，请求复核

[English authoritative source / 英文权威原稿](../HANDOFF_MECH_TO_ALIEN_DEVELOPMENT_COMPLETE.md)

完整历史阅读译文，不产生新权威字段或验收结论。 / Complete historical reading translation; no new authoritative fields or acceptance verdict.

```text
MISSION        = UI-102 (Android 产品壳与信息架构)
FROM           = Mech (development host)
TO             = Alien (review host - must not be Mech, CONSTRUCTION_RULES §3)
BRANCH         = ui/UI-102-android-product-shell
HEAD_SHA       = 652c41c6ca72d591e3adab5cb78b9a2bc6b7a410
CI             = 36886549081 success (android + gateway-web)
UNIT_TESTS     = 64 passed, 0 failures
DEVELOPMENT_COMPLETE = true
```

原始身份块绑定 UI-102 Android 产品壳与信息架构、开发主机 Mech、复核主机 Alien（不得由 Mech 承担，见 §3）、分支、完整头 SHA、CI、64 个通过的单元测试和 development_complete=true。它保留原始声明，不产生新声明。

报告：`mission-book/reports/UI-102/DEVELOPMENT_REPORT.md`（§7 为完成声明）。缺陷记录：`mission-book/reports/UI-102/NARROW_WIDTH_DEFECT.md`。证据在 utopia 仓库 `evidence/raw/mission-book/UI-102/`。

## 我希望被最严格质疑的部分

我两次以同样的方式做错了，所以请勿直接信任验收：

1. **依据像素重新判断可读性，而非依据 dump。** 我两次根据 `uiautomator dump` 声称窄屏结果。dump 报告控件的完整文字和布局边界，无法报告文字在边界内部被裁剪。第一次“无溢出，通过”和第二次“截断，失败”都错了；第二次还针对错误宽度。只运行 dump 就会重现我的错误。
2. **检查 dp 算术。** `wm size 320x640` 在 `density 320` 下为 **160 dp**，不是 320 dp。两轮窄屏验收在没有手机具备的宽度上运行，导致 320 dp 和 360 dp 长期未测。请验证矩阵，而非我的散文：从截图检查 360 dp @ 1.0/1.5 和 320 dp @ 1.3/1.5。

## 我已知的薄弱处

- **160 dp 遗留问题。** 在 160 dp @ 1.5，标签**仍被裁剪**，`UtopiaComponents.kt` 的仅图标回退**没有触发**。我将回退写成了可用功能，但在这个宽度它明显不可用。160 dp 不属于指定验收，所以我未视为阻塞；请自行判断是否合理。可能阈值从未达到，也可能测量看不到真实槽位；我未诊断。
- **没有 composition 测试断言 measured-fit 路径。** `UiSizing.kt` 算术有 8 个单测，但 `rememberTextMeasurer()` / `MaterialTheme` 需要 composition；本机离线 Gradle 缓存没有 `ui-test-junit4` 和 `androidx.test`，故无 `androidTest`。阶梯在真实 composition 中工作，仅由截图支持。
- **键盘/焦点遍历没有任何测量工具。** 保留此功能，但未验证。
- **实现子代理提出 `rememberTextMeasurer()` 字体缩放缓存注意事项。** `LocalDensity.fontScale` 不是 measurer 的 key，故实时修改 `font_scale`（不重建 activity）后可能使用旧度量选择阶梯。验收在启动前设缩放，并在配置间 force-stop，无法暴露它。有限后果是选错级别，但 `softWrap=false` 意味着不会在词中裁剪，因此不能恢复已报告缺陷。无论如何，未执行该路径。
- **自定义 `UtopiaNavigationBar` 取代 Material `NavigationBar`**（约 160 行）。触控目标高度、胶囊指示器和 `Role.Tab` 语义经过代码审查，但仅在已拍尺寸下目视确认。值得严格检查，因为替换平台组件容易悄悄丢失无障碍行为。
- **页头间距变化。** 删除旧 `weight(1f)` spacer，采用可滚动的测量行，因此宽屏下 wordmark 和状态更接近。这是有意的，但我只看了窄屏。

## 我有意未修改的跨端问题

默认路径将设备新鲜度显示为原始机器时间戳（`Last seen: 2026-10-01T15:42:25.473Z`），在 320 dp @ 1.5 会碰到卡片边缘。我有意未动：Web 也显示同一值，单方面改 Android 会破坏本任务刚建立的事实一致性。请将其作为 **Android + Web** 问题裁决。若认为应修改，应由覆盖两端的后续任务处理。

## 值得重跑的事实一致性检查

增量 6 修复两个解析器丢弃 Gateway `statusLabel`、改用客户端映射的问题。如果只重新验证一件事，请验证 Gateway 标签仍优先，本地映射仅为 fallback；该行为的整个意义就在于两端一致。

## 可节省时间的环境说明

```text
emulator -avd utopia36 -no-audio -no-boot-anim -gpu swiftshader_indirect -no-snapshot -memory 4096
  -> WINDOWED is required for screencap to capture the Compose surface.
     -no-window makes it a black frame; -gpu host also black. This is a flag property,
     not a machine property - the earlier "screenshots are impossible" note was wrong.
adb reverse tcp:4310 tcp:4310   + host = http://127.0.0.1:4310 in city-connection.xml
  -> reliable; the 10.0.2.2 slirp alias failed intermittently and looks like a product OFFLINE.
Kill by qemu-system-x86_64*  -- windowed runs qemu-system-x86_64.exe, headless runs
  qemu-system-x86_64-headless.exe. Matching only "emulator" leaves it alive, and the next boot
  then dies with "Running multiple emulators with the same AVD" while adb emu kill looks fine.
JAVA_HOME=D:\GDPR-Refine\.tools\jdk-17.0.20.1+1  (machine default is a non-existent path)
```

上方原始环境块给出实际启动命令：Compose 截图要求 WINDOWED；`-no-window` 或 `-gpu host` 会黑屏。这是 flag 属性，不是机器属性，早前“截图不可能”是错误说明。使用 adb reverse 与 loopback 地址可靠，`10.0.2.2` 会间歇失败并表现为产品 OFFLINE。终止进程应匹配 qemu-system-x86_64*；仅匹配 emulator 会留下真实进程，导致重复 AVD。JAVA_HOME 指向实际 JDK，机器默认路径不存在。

## 我没有声称什么

我没有声称通过复核。复核属于你，必须独立；Mech 开发了此任务，不能复核它。
