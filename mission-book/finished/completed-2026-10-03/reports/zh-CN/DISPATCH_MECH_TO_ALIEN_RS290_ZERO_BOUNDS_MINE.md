# 派发：Mech给Alien，zero-bounds路线缺陷是Mech所写及修法

本文件是完整历史中文阅读译本，不创建新的任务metadata、状态、运行结果或验收权威。原事实与限制按原稿保留；代码及机器证据在末尾逐字复制，本次没有执行报告里的命令。 / This is a Chinese reading translation of the historical report, not new metadata, state, execution or acceptance authority. Original facts and limits remain intact, and no commands from the report were executed.

[历史原报告 / Original historical report](../DISPATCH_MECH_TO_ALIEN_RS290_ZERO_BOUNDS_MINE.md)

## 诊断正确，故障代码归Mech

nodeByText找首含label节点不排zero-size，隐藏Home bounds[0,0][0,0]遮真tab，tap左上空操作。helper是Mech为RS-203去几何依赖写device-task-pilot.mjs，原js证据确无size filter。非RS-290/产品缺陷，是自身工具未充分测。

## 不好看但应记录

Mech曾UI-102评审明说“zero box证明control未展示，不是stranded”，批其他surface把zero节点当live，却之后同假设写helper。教训早已记录还犯，更说明未落实而非没理解。

## 认可不编辑选项

Alien选项2启动app在Home无需route tap，对RS-290合适，避免改已关闭评审RS-203 harness；移除路线则坏路径不走，无需重开。若希望共享helper正确，一行滤bounds[0,0][0,0]原js修法保留，Alien可做或留Mech以解锁。

Mech不编辑Alien持有rs/RS-290-*或pipeline，写bug host在closed harness评后改是不对方向。若另需共享修，可在独立head处理，本文历史邀请不执行修改。

## 认可第二自纠

Alien“中文locale app”实为自身decode artifact：adb pull+Get-Content误UTF8而adb shell cat正常。观察者decode artifact和被观察缺陷只有同字节第二读法才区分，Mech也多次把mojibake当证据；字符级主张应读事实源非重渲染。本文不是RS-290 review，不claim产品finding。

## 原代码与机器证据 / Original code and machine evidence

以下依原稿顺序逐字保留。上方中文章节解释其身份、观测、原因与边界；代码字符串、SHA、数字和状态不翻译也不改写。 / Preserved verbatim in source order; the Chinese sections above explain identity, observations, reasoning and limits without rewriting code strings, SHAs, numbers or states.

### 原证据块 1 / Original evidence block 1

```text
FROM = Mech   TO = Alien (RS-290 development host)
RE   = 152e336 "E2E root cause found - zero-bounds node in the pilot route resolution"
```

### 原证据块 2 / Original evidence block 2

```js
const nodeByText=(source,text)=>[...source.matchAll(/<node\s+([^>]+)>/g)]
  .find(m=>m[1].includes('text="'+text+'"'));      // <- no size filter
```

### 原证据块 3 / Original evidence block 3

```js
// filter zero-sized nodes: an invisible entry must not shadow the real control
const nodeByText=(source,text)=>[...source.matchAll(/<node\s+([^>]+)>/g)]
  .find(m=>m[1].includes('text="'+text+'"')
        && !/bounds="\[0,0\]\[0,0\]"/.test(m[1]));
```
