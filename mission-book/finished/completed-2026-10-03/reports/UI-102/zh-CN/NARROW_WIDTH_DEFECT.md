# UI-102 — 窄屏 / 字体缩放：验收配置错误、被掩盖的缺陷及修复

[English authoritative source / 英文权威原稿](../NARROW_WIDTH_DEFECT.md)

完整历史阅读译文；不产生新权威字段或验收结论。 / Complete historical reading translation; no new authoritative fields or acceptance verdict.

> 主机 `Mech`。分支 `ui/UI-102-android-product-shell`。缺陷在 `3bdba53` 观察到，在 `652c41c` 修复并验证。本报告也纠正此前两轮验收的配置。

## 1. 配置错误是混乱的根源

两轮增量均将 `wm size 320x640`、`wm density 320` 作为窄屏。这些尺寸是**像素**；density 320 对应 2 px/dp，因此：

```text
320 x 640 px @ 320 dpi   =  160 dp wide      <- narrower than any real phone
640 x 1280 px @ 320 dpi  =  320 dp wide      <- a realistic narrow phone
720 x 1600 px @ 320 dpi  =  360 dp wide      <- the AVD's natural size
```

原始换算块说明：320×640 像素为 160 dp 宽，比任何真实手机更窄；640×1280 为合理窄手机 320 dp；720×1600 为 AVD 自然宽度 360 dp。

160 dp 仅为工作书“常见窄屏”可能指向的最窄设备宽度的一半。因此两轮测量了手机不存在的 viewport，从未测量真实窄屏。

这一个错误导致任务两次误判：

- 将 160 dp 的**真实**渲染失败当成正在验收的对象；
- 实际重要的 320 dp、360 dp **完全未测**，所以早前通过及之后撤回对这些尺寸均无说明力。

## 2. 实际成立的事实

**160 dp @ font_scale 1.5** 下渲染确实失败，hierarchy dump 无法表现。dump 报告五个 bar 节点，完整文字，边界在 viewport 内，因而被读作“无溢出”。dump 节点携带控件完整文字和布局边界，不能报告文字在边界**内部裁剪**。同 build、同设备、同配置的截图显示：

```text
bottom bar labels      "Ho"  "As"  "Ro"  "De"  "Ac"      <- all five clipped
status chip            O N L I N E   stacked, one character per line
```

原块中五标签均被剪为 Ho / As / Ro / De / Ac；ONLINE 状态 chip 每字符一行堆叠。

**320 dp、360 dp 在任何字体缩放下都未测。** 因此早前“窄屏通过”无支持，后来“失败”针对范围外宽度。两者都撤回，由 §4 取代。

## 3. 修复

`NavigationBarItem` 在重复测量中量 label 槽位，随后裁剪内容；这正是 Ho / As / Ro 的机制。在该槽位内部的宽度感知 workaround 看不到真实受限宽度。改由 `UtopiaNavigationBar` 管理测量循环，使 label 得到真实槽位。

- label 从 **11 → 10 → 9 sp** 逐级下降，选能容纳的最大尺寸。
- 再低则回退为**仅图标**，仍以 surface 名称作为 semantics label，入口不会显示残词。
- 页头状态改为可滚动行中的测量 chip，使 ONLINE 保持单行，不再将 wordmark 或 overflow 按钮挤至零宽。
- 尺寸决策为纯函数 `UiSizing.kt`，新增 8 单测，模块总数 **56 → 64**，全部绿。

从 Gradle cache 确认，此处 Compose Foundation **1.8.0** / Material 3 **1.3.2**，来自 `compose-bom:2025.04.01`。`BasicText(autoSize=)` / `TextAutoSize` 需要 Compose 1.9 / M3 1.4，离线不能升级 BOM，所以测量阶梯是有意替代方案，而非遗漏。

## 4. 验证：正确 dp 尺寸下的截图

每行均为修复 build 的真实模拟器捕获，以 windowed `-gpu swiftshader_indirect` 运行，连接 live Gateway（每个 dump ONLINE 均 true）。

| viewport | font_scale | 五标签完整 | ONLINE 单行 | 截图 |
|---|---|---|---|---|
| 360 dp (720x1600 @320) | 1.0 | 是 | 是 | `v2-360dp-font1.0.png` |
| 360 dp (720x1600 @320) | 1.5 | 是 | 是 | `v2-360dp-font1.5.png` |
| 320 dp (640x1280 @320) | 1.3 | 是 | 是 | `v2-320dp-font1.3.png` |
| 320 dp (640x1280 @320) | 1.5 | 是 | 是 | `v2-320dp-font1.5.png` |
| 160 dp (320x640 @320) | 1.5 | **否，仍裁剪** | chip 缩为细条 | `v2-160dp-font1.5.png` |

范围内最困难的 320 dp @ 1.5 下，bar 完整显示 Home · Ask · Rooms · Devices · Activity，青柠色 ONLINE 胶囊在 wordmark 旁保持单行。促成本次修改的缺陷在指定范围内已解决。

### 4.1 交叉检查：树与像素现在一致，以及仍不能回答的地方

此任务两次误判树与像素关系，因此对同五次捕获直接比较两仪器，未单独信任任何一个：

```text
capture              labels in tree   longest label bound                max right edge
v2-360dp-font1.0     5/5              Activity[611..685] = 74 px         720 = viewport
v2-360dp-font1.5     5/5              Activity[592..704] = 112 px        720 = viewport
v2-320dp-font1.3     5/5              Activity[529..623] = 94 px         640 = viewport
v2-320dp-font1.5     5/5              Activity[520..632] = 112 px        640 = viewport
v2-160dp-font1.5     5/5              Activity[264..312] = 48 px         320 = viewport
```

它确立两点：

1. **范围内尺寸下树与像素一致**，最长 label 在槽中尚有余量：320 dp 的 128 px 槽中用 112 px，360 dp 的 144 px 槽中用 112 px。树报告实际渲染尺寸的文字边界，因此是在佐证截图，而非仅重述字符串。
2. **160 dp 行的结构与正确渲染行无法区分。** 它同样报告 5/5 完整标签，所有边界在 viewport 内，与 320 dp 行相同；但同文件截图是 Ho / As / Ro / De / Ac。这是 §8 方法论最清楚的证据：dump 不能区别正确与裁剪，因为裁剪发生在报告边界内部。

label 边界不能揭示选用了 11/10/9 sp 哪一级，因此此交叉检查不确认阶梯实际降级，只确认最终渲染结果能放下。阶梯算术由单测验证；真实 composition 中触发则依赖截图。

## 5. 遗留限制：记录而非隐藏

**160 dp @ 1.5 下标签仍裁剪，仅图标 fallback 不触发。** 阶梯到底后仍如此前裁剪，故此宽度尚无优雅降级。160 dp 比任何真实设备都窄，且在指定验收外，所以不阻塞完成；但 §3 把 fallback 写得像已工作，160 dp 明确证明不是如此。可能阈值实践中未到，或测量看不到真实槽位；这里未诊断。标记给 Review。

## 6. 跨端观察：有意未在这里修补

默认路径以原始机器时间戳渲染设备新鲜度：

```text
Last seen: 2026-10-01T15:42:25.473Z
Last snapshot: 2026-10-01T15:42:25.690Z
```

320 dp @ 1.5 下值也触及卡片边缘。此分支有意**未改**：任务边界禁止偏离 shared truth 重新推导显示，Web 也显示同值，单方面修改会破坏刚建立的事实一致性。作为 **Android + Web 跨端**问题提交 Review。

## 7. 环境纠正：早前说明错误

此前“本机不可能 screencap”声明错误，取决于启动 flags：

```text
-no-window  -gpu host                  -> black 7.9 KB PNG
-no-window  -gpu swiftshader_indirect  -> launcher captures, Compose still black
 WINDOWED   -gpu swiftshader_indirect  -> launcher and Compose both capture correctly
```

原块说明两种 no-window 模式分别为黑 PNG 或仅 launcher 可捕获、Compose 仍黑；WINDOWED + swiftshader_indirect 可正确捕获 launcher 和 Compose。

另两点，各造成一次浪费：

- **adb reverse tcp:4310 tcp:4310** 配合 `host = http://127.0.0.1:4310` 可靠。`10.0.2.2` slirp alias 曾成功一次，但模拟器重启后间歇失败，表现为虚假 OFFLINE，像产品 bug，实际不是。
- **模拟器进程名取决于启动模式。** Windowed 是 `qemu-system-x86_64.exe`，no-window 是 `qemu-system-x86_64-headless.exe`。仅匹配 emulator 会留下真实进程，下一次启动因 “Running multiple emulators with the same AVD” 失败，而 adb emu kill 看起来成功。

## 8. 应带到其他 UI 任务的方法经验

uiautomator dump 回答“哪些 surface 存在、在哪里”，不能回答“文字是否可读”，因为裁剪文字仍报告完整字符串。可读性、截断、溢出、拥挤等验收必须依据像素。本任务两次从 dump 得出相反声明，两次都错。
