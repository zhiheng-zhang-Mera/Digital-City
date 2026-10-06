# UI-102：连接状态下窄宽大字体验收尝试失败，未完成

本文件是完整历史中文阅读译本，不创建新的任务metadata、状态、运行结果或验收权威。原事实与限制按原稿保留；代码及机器证据在末尾逐字复制，本次没有执行报告里的命令。 / This is a Chinese reading translation of the historical report, not new metadata, state, execution or acceptance authority. Original facts and limits remain intact, and no commands from the report were executed.

[历史原报告 / Original historical report](../E2E_CONNECTED_ATTEMPT_FAILED.md)

主机Mech，分支ui/UI-102-android-product-shell，head3bdba53。记录FAILED以免下一轮重复。

## 尝试内容

UI-102最后验证项是连接状态下窄宽/大字体端到端通过。早期7bdaf94没gateway，只证明320×640/font1.5外壳，不曾测试连接内容。准备全部成功：worktree gateway/reference node报告nodes1；当前head自build APK安装adb Success；run-as种SharedPreferences，199-byte city-connection.xml在shared_prefs；wm320x640、density320、font1.5已应用。

## 失败位置

am start MainActivity报Error type3/activity不存在，pm却列city.utopia.control包已装，topResumed仍NexusLauncher。包在而launcher activity不能resolve；--version和首次am start都没应用进程，logcat无FATAL/AndroidRuntime。模拟器package/activity registry不一致，预算内未确定原因。首dump只1972字符launcher揭示问题。

## 明确后果

连接窄宽验收没有完成。剩余：键盘/focus traversal仍无该任务instrument覆盖；连接内容窄宽大字未达到。本文不判产品缺陷也不称通过。

## 下次变化

先卸载重装，默认display下用pm dump/findstr MainActivity或plain am start确认activity再改wm/font，先改指标让失败被误认为layout数分钟。am start -W看Status/TotalTime而非假定成功。用可靠uiautomator dump，不screencap，因为模拟器framebuffer全黑，已记E2E_VERIFICATION_NOTES.md。原命令/失败输出文末保留。

## 原代码与机器证据 / Original code and machine evidence

以下依原稿顺序逐字保留。上方中文章节解释其身份、观测、原因与边界；代码字符串、SHA、数字和状态不翻译也不改写。 / Preserved verbatim in source order; the Chinese sections above explain identity, observations, reasoning and limits without rewriting code strings, SHAs, numbers or states.

### 原证据块 1 / Original evidence block 1

```text
dev-gateway + reference node started from the UI-102 worktree   -> /api/v0/city reports nodes=1
APK installed from the head's own build                          -> adb reported Success
SharedPreferences seeded via run-as                              -> 199-byte city-connection.xml
                                                                    present in shared_prefs
adb shell wm size 320x640 ; wm density 320 ; font_scale 1.5      -> applied
```

### 原证据块 2 / Original evidence block 2

```text
adb shell am start -n city.utopia.control/.MainActivity
  -> Error type 3
  -> Activity class {city.utopia.control/city.utopia.control.MainActivity} does not exist
adb shell pm list packages | grep utopia
  -> package:city.utopia.control          (the package IS installed)
adb shell dumpsys activity activities
  -> topResumedActivity = com.google.android.apps.nexuslauncher/.NexusLauncherActivity
```
