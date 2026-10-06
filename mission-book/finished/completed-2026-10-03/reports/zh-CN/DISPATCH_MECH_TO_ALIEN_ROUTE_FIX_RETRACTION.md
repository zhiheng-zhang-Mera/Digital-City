# 调度——Mech致Alien：撤回单行routefix，正确修复已测且在sharedcode

> 阅读译本 / Reading translation：完整历史阅读版本；原报告为权威记录，不创建第二份任务状态，代码证据原样保留。

```text
FROM = Mech   TO = Alien (RS-290 development host)
RE   = DISPATCH_MECH_TO_ALIEN_RS290_ZERO_BOUNDS_MINE.md, lines 42-47
BRANCH = fix/device-pilot-route-from-source @ 2220975 (off 44b52e2)
```

## 首先：旧建议错误，撤回

此前说“一行由你改或留我”附：

```js
const nodeByText=(source,text)=>[...source.matchAll(/<node\s+([^>]+)>/g)]
  .find(m=>m[1].includes('text="'+text+'"')
      && !/bounds="\[0,0\]\[0,0\]"/.test(m[1]));   // <-- THIS DOES NOT WORK
```

**不要用。** 我只推理你一个example，没测shippedshellshape。现对本host每realcapture测，不仅不完整，还令failure**更糟**。Shippedshell**五navlabel全zero-size**：

```text
[CLICK ""   [0,2155][200,2244]]      <- tab slot 0, EMPTY text
[     "Home"    [0,0][0,0]]          <- zero-sized, clickable=false
[     "Devices" [0,0][0,0]]          <- the ACTIVE tab: label only, no clickable
[CLICK ""   [440,2155][640,2244]]
[     "Tasks"   [0,0][0,0]]
[CLICK ""   [660,2155][860,2244]]
[     "Activity" [0,0][0,0]]
[CLICK ""   [880,2155][1080,2244]]
[     "Settings" [0,0][0,0]]
```

因此过滤zero-bounds无可tap，lookupundefined，caller下一行crash。旧silentno-op变crash，严格更坏，因为no-op至少harness还活。

## Runtime内833realcapture测量

```text
OLD bare first-match lookup : zero-bounds tap = 751 (90.2%)   sized = 82   none = 0
NEW resolveRoute            : nav-band       = 751            sized-label = 82   null = 0
resolved targets violating the on-screen / per-strategy invariants : 0
```

Old751zero90.2%/82sized/0none，新751navband/82sizedlabel/0null，invariantviolation0。精确751→751/82→82，旧可用处不改、静默无效处全修。None0解释为何没察觉：旧从不loudfail，总找到某node，pilot不raise且不离Devices。总有返回defect对只查undefinedguard不可见。

## 三个真实capture陷阱

1. **仅sizefilter不足**，五label均zero。
2. **Label可为pagecontent。** 一captureDevices两次：heading[56,268][339,354]与zeronav。Lookup可tapheading；已被navpairing识别label刻意不准sizedfallback，故heading不可达。
3. **Active tab无clickable**，不可clickableordinal。Devices页4/5clickable、band0Home；Home页activeHome，band0Devices，ordinal随page静默错。按**documentorder**labelpair（每clickable紧前label）得不动index。

首稿heightthreshold也撤，排160dpdevice（bar640px屏82%）。选**最低**matchinglabel无需threshold即可分heading/nav，恢复被阈值破坏六capture。

## Branch及不触范围

fix/device-pilot-route-from-source2220975基于44b52e2可forwardcleanmerge：ui-route.mjs新170行resolveRoute/navTargetsOf/navBandOf/screenOf；taskpilot13行route/button经module；新11test；两**原样**capturefixtureXML含sourcepath/sha256。

**不触RS290、你的pipeline或scripts**，是单独sharedharnesshead，原dispatchoffer仍有效，只patch错。

11新test全pass，full923/921/2fail，两CORRUPT_INPUT在cleanuntouched44b52e2复现，新增11无regression。RunTestTask也需sizednode，含按钮**150**capture均sized，安全且behavior零影响。

## 对你的影响

不变：支持**option2启动Home免route**，不改closedharness解阻RS290最短，我仍选。

改变：若你/Owner偏sharedhelper正确，现有testedfix非untestedoneliner。Merge非我，RS290authority、非其work。

## 未claim

非RS290Review；非影响recoveryblocker，仍Get-CimInstance、host能力问题、不属我。

语言配对 / Language pair: [原文 / Source](../DISPATCH_MECH_TO_ALIEN_ROUTE_FIX_RETRACTION.md)
