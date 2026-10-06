# UI-102 — 开发报告

[Authoritative source / 权威原稿](../DEVELOPMENT_REPORT.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

> **已被取代的头部。** 下方 §1–§5 写于第一个增量 9b97fa1，保留为其历史记录。权威状态是 §7，证据在 [NARROW_WIDTH_DEFECT.md](../NARROW_WIDTH_DEFECT.md) 和 [E2E_VERIFICATION_NOTES.md](../E2E_VERIFICATION_NOTES.md)。

```text
MISSION                    = UI-102 (Android 产品壳与信息架构)
PHASE                      = UI_CIVILIZATION
REPORT_ROLE                = DEVELOPMENT
HOST                       = Mech
BASELINE_SHA               = e7c498f5acd86da324a45c3278219c8daa612561
BRANCH                     = ui/UI-102-android-product-shell
HEAD_SHA                   = 652c41c6ca72d591e3adab5cb78b9a2bc6b7a410
CI                         = 36886549081-success-android-and-gateway-web
UNIT_TESTS                 = 64 (0 failures)
DEVELOPMENT_COMPLETE       = true
STATUS                     = IN_PROGRESS (development complete; awaiting review by a different host)
```

原身份块保留当前完整 baseline/head、分支、CI、64测试、development_complete=true、开发完成等待异机复核的 IN_PROGRESS。以下历史原句保留其时序，不重新裁决：

> **这明确不是完成声明。** 按 §8/§9，不得将部分实现的绿 CI 当任务完成。frontmatter 保持 development_complete:false。

## 1. 第一个增量为何是 theme + shell

Android 是三端中结构起点最差者；UI-000 候选复核记录具体情况：

```text
MainActivity.kt:51   NavigationBar with NINE items, each an icon drawn as Text("◈ ❯ ▦ ≣ ◇ ◉ ▤ ≋ ⚙")
                     — far outside M3's 3–5 guidance on a ~360dp phone
MainActivity.kt:27   MaterialTheme(lightColorScheme(primary = Ink, secondary = Moss, background = …))
                     — 3 of ~30 colour roles set, so every other role rendered Material baseline purple
                     theme files      NO Theme.kt / Color.kt / Type.kt existed anywhere in the module
                     typography/shapes pure M3 defaults; no dark theme; no dynamic colour
```

原块记录九入口 NavigationBar 用 Unicode几何 Text 图标，远超约360dp手机的M3 3–5指导；仅设约30色角色中的3个，其他显示基线紫色；无 Theme/Color/Type 文件，纯默认 typography/shapes，无暗色或dynamic color。

因此最有作用的两项是其余内容均依赖的真实主题，以及适合手机的导航模型。

## 2. 已落地

| 文件 | 修改 |
|---|---|
| 新 theme/UtopiaTheme.kt | 完整darkColorScheme承载Owner方向；Typography；CutCornerShape Shapes（切角，非圆角卡片堆）；Space尺度代替screen硬编码dp |
| 新 theme/UtopiaIcons.kt | 24×24网格的十个真实ImageVector，以SolidColor(Color.Black)描线供Icon tint，取代Unicode几何字符 |
| MainActivity.kt | 应用UtopiaTheme；九入口变五primary（Home/Ask/Rooms/Devices/Activity）和vector icons；Services/Tasks/Action/Settings/Pairing入header overflow，不丢能力且不再堆满tabs |

三级ink是#8B82A8，而非UI000复核AA失败的#6F6788；复用AA安全值而不重推，并在文件记录。

## 3. 此头验证

```text
gradlew --offline :app:compileDebugKotlin                      BUILD SUCCESSFUL
gradlew --offline :app:testDebugUnitTest :app:assembleDebug     BUILD SUCCESSFUL (APK produced)
hosted CI 36868228769                                          success (android + gateway-web)
real emulator (android-36, 720x1600 @320dpi)                   screenshot captured
```

截图展示暗壳、青柠切角主action、header overflow、五入口bar，证据 evidence/raw/mission-book/UI-102/android-shell.png。JAVA_HOME 必须是 D:\GDPR-Refine\.tools\jdk-17.0.20.1+1；机器默认路径不存在，PATH java 为 AGP8.11拒绝的JDK26。

## 4. 任务称为完成前仍剩什么

明确记录以便复核看到缺口：

1. **组件层级，步骤3未开始。** 不再将每surface视为通用Panel，应建hero、tool row、activity row、status chip、device surface、technical details语义组件；当时仅主题和icons。
2. **技术详情折叠，步骤5未开始。** Actions/Ask仍内联actionId、route·target、BackendRef/ResultRef/Provenance、digests，应放可展开详情。
3. **状态覆盖，步骤6未开始。** loading/offline/unavailable/confirmation/ambiguity/success/failure未系统表达。
4. **剩余硬编码色。** Panel仍有Color(0xFF456B29)、Color(0xFFA15C38)、Color.Gray、Color(0xFFF4F6F0)。旁边已有真实主题，应迁移为角色；Ink/Moss重映射作为桥，screen迁完应移除桥。
5. **验收，步骤7。** 未完成竖屏真设备窄屏与字体缩放验收；单尺寸一模拟器截图不是它。
6. **与Web事实一致，完成门。** 功能/状态truth与Web一致未验证。

## 5. 遵守边界

- 保持Kotlin/Compose/Material3，不引新跨端框架。
- CityClient/DTO不动，无gateway行为变化，不客户端重推status/route。
- 不删入口：五bar加overflow覆盖原九页及Find。
- 验证是实际模拟器+hostedCI，而非空声明。

## 6. 第一增量状态：历史

```text
DEVELOPMENT_COMPLETE = false
REVIEW_HOST          = null (nothing to review as complete yet)
```

Mech拟下一轮继续。本稿此处不以完成交付，不应请复核者签部分shell。

## 7. 最终状态：652c41c上的完成声明

§4六项现全部关闭：

| 原项 | 解决 |
|---|---|
| 1组件层级 | ui/UtopiaComponents.kt含UtLabel/UtPanel/HeroBlock/StatusChip/ToolRow/ActivityRow/DeviceSurface/UtEmptyState/UtFeedback/TechnicalDetails |
| 2技术折叠 | Actions/Ask/Services/Events内每internal id入默认折叠运行详情；提纯row-builder让测试断言screen实际渲染 |
| 3状态覆盖 | loading/offline/unavailable/confirmation/ambiguity/success/failure经共享组件表达 |
| 4硬编码色 | theme外Color(0x..)零，19→0 |
| 5验收 | 真实模拟器截图360/320dp，字体1.0/1.3/1.5，见下 |
| 6Web事实一致 | Gateway statusLabel优先client fallback，与Web一致；测试固定优先及fallback |

```text
gradlew --offline :app:testDebugUnitTest :app:assembleDebug   BUILD SUCCESSFUL
unit tests                                                     64 passed, 0 failures
hosted CI 36886549081                                          success (android + gateway-web)
connected acceptance                                           ONLINE at every size tested
```

### 验收矩阵：真实模拟器，windowed swiftshader_indirect，live Gateway

| viewport | font_scale | 五bar标签完整 | ONLINE单行 |
|---|---|---|---|
| 360dp | 1.0 | 是 | 是 |
| 360dp | 1.5 | 是 | 是 |
| 320dp | 1.3 | 是 | 是 |
| 320dp | 1.5 | 是 | 是 |
| 160dp | 1.5 | **否，裁剪** | chip收缩 |

证据 evidence/raw/mission-book/UI-102/v2-*.{png,xml} 和 android-shell-connected-native.png（连接且含reference-node telemetry的Devices）。

### 复核者必须知道的三项纠正

1. **false pass及过度纠正同出一个错误。** 两增量在320×640像素验收，density320实际160dp，是最窄真实手机一半；320/360dp未测。hierarchy dump因完整文字却不可见内部裁剪而判通过，截图判失败。两声明撤回由上矩阵取代。**可读性必须依据像素。**
2. **本机screencap并非不可能。** 限制是flag而非机器；no-window+gpu host黑，windowed+swiftshader可正确捕获Compose。
3. **记录遗留限制而非隐藏。** 160dp@1.5仍裁剪，所记仅icon fallback不触发，降级不优雅；低于真实设备且范围外，故不阻塞，但行为不如文档。

### 未声称

- **键盘/焦点无仪器。** 离线Gradle无ui-test-junit4/androidx.test，无法构建androidTest；measured-fit仅UiSizing纯算术断言，无composition。
- **默认原始机器时间戳** Last seen:2026-10-01T15:42:25.473Z有意保留；Web同值，单改Android破坏刚建立一致性，提跨端问题。
- **Mech未复核。** §3要求异实体主机；本报告供复核，不是裁决。
