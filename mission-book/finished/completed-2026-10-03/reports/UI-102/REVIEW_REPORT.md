# UI-102 — Android 产品壳与信息架构 · REVIEW REPORT

> 常驻规则：[../../CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md)
> 工作书：[../../ui-civilization/UI-102-Android产品壳与信息架构.md](../../ui-civilization/UI-102-Android产品壳与信息架构.md)
> Review Host：`Alien`（Development Host 为 `Mech`，§3 双机独立成立）
> 复核对象：`652c41c6ca72d591e3adab5cb78b9a2bc6b7a410`（Mech 的 Development 头，CI `36886549081` success）
> 复核结论头：`ed4a663a4724c228d971809efcf42f113a9d7ca3`　CI：`36887701849` success

## 1. 结果

**PASS_WITH_REPAIRS。** 一处确认缺陷已直接修复并加回归测试；若干项**未验证**，如实列在 §4，不当作通过。

## 2. 复核仪器的选择（本任务最关键的一步）

Development 主机在 increment 7 **主动撤回了一次它自己报出的假通过**，原因值得原样继承：

> 它当时用 `uiautomator dump` 断言「五个底栏项存在、max right edge = viewport、无溢出」。但 **dump 节点携带控件的完整文本与布局边界，无法反映文本在边界内被视觉裁切**；同一构建的**截图**显示底栏实际渲染为 `Ho / As / Ro / De / Ac`、ONLINE 被折成一字一行。

因此本轮**不接受任何来自层级 dump 的可读性结论**，全部改用**截图**。

## 3. 已验证

### 3.1 可读性（截图，最难的在范围内配置）

`v2-320dp-font1.5.png`（640×1280，从分支提取后逐像素查看）：

- 头部：`UTOPIA` + **单行 `ONLINE` 芯片** + 溢出按钮，同一行；
- 底栏：**五个完整标签** `Home / Ask / Rooms / Devices / Activity`，无截断。

increment 8 的可读性声明在该配置成立；被撤回的 increment 5 dump 假通过确已被正确取代。

### 3.2 确认缺陷 R-1（已修复 + 回归测试）

`Devices.kt:18` 原文：

```kotlin
Text("Last seen: ${node.optString("lastHeartbeatAt","Unavailable")}")
```

**默认产品面直接打印 Gateway 的原始 ISO-8601 值**，而 Web 对同一事实渲染相对时间（`age() → device.ago`）。截图同时显示该行在 320dp/1.5 下**被卡片边缘裁切**。

判为**疏漏而非设计选择**的三条证据：

1. `DeviceCard` 已经接收 `now: Instant` 参数；
2. `MainActivity` 已经有每秒重算 `now` 的 `LaunchedEffect`；
3. `PairingProtocol.kt` 已经用 `Duration.between(...)` 算相对时长。

**管道与范式都在，只有第 18 行没用它们。**

归类：命中本任务 increment 6 自立的 **Web 真值对齐**目标，以及工作书自身的**文本拥挤**检查项；**不**归类为「原始标识符泄漏」（折叠规则列举的是模块名/ID/route/backendRef/provenance/schema 等，时间戳不在其中）——刻意不往宽里算。

**修复**：新增 `internal fun relativeAge(iso, now)` 纯函数并使用已传入的 `now`（不读时钟，保持可测）。措辞**刻意与 Web 的 `age()` 完全一致**（"Ns ago"），因为本任务目标是「对齐」，复核者若自创更好看的分级写法，反而会制造它本该消除的分歧。未来时钟偏移钳到 0s；缺失/非法值退化为既有 "Unavailable"。

**验证**：`RelativeAgeTest` **4 tests / 0 failures / 0 errors**；模块总数 **68 tests / 0 failures**（原 64，正好 +4）。**从 JUnit XML 报告确认，而非依赖退出码**——一个跳过了新测试的绿退出码什么也证明不了。

## 4. 未验证项（明确不当作通过）

1. **修复后未重新截取窄屏截图**：裁切是否消失，目前只由「新字符串远短于被替换的 ISO 串」这一结构性理由支撑，**没有截图证据**；
2. 其余三种声明配置（360dp@1.0、360dp@1.5、320dp@1.3）未由本复核独立截图；
3. **键盘/焦点遍历**——该任务上仍无任何仪器覆盖；
4. **Compose UI test 无法在本机离线构建**（`androidx.test` / `ui-test` 在两个 Gradle 缓存中均缺失），因此「折叠而非删除」这条属性本复核**确认了该环境限制，而非解除它**。

## 5. 披露

- 仅修改 `Devices.kt` 与其新增测试文件；未改任何 API/DTO/gateway 语义；未 force-push；
- 未改写 Mech 的 Development 字段；
- 提取分支证据时踩到一个工具坑并已绕开：PowerShell `>` 重定向 `git show` 会写坏二进制（报 `Unsupported or malformed image data`），改用 worktree 拷贝。
