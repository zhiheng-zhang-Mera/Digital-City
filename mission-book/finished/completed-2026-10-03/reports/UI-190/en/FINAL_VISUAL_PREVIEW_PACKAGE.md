# UI-190 · FINAL_VISUAL_PREVIEW delivery package: concise visual package

[Authoritative source / 权威原稿](../FINAL_VISUAL_PREVIEW_PACKAGE.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

```text
交付对象 = Owner
任务      = UI-190 跨端视觉审查与 UI 基线冻结
交付时点  = Review 阶段结束、Owner 门禁开启之时
```

The original delivery block names Owner, UI190 cross-surface visual review/baseline freeze, and delivery after Review when the Owner gate opens.

> This package puts what Owner needs to see and rule on in one place. It does not claim the baseline frozen; freeze is step8 after step7.

## 1. Current state in one sentence

Development and Review complete, PASS_WITH_REVIEW_REPAIR; your directional opinion is awaited. UI_BASELINE_FROZEN not declared; RS201/202 not unlocked.

```text
status            = REVIEW_COMPLETE
development_complete = true
review_host       = Mech
review_verdict    = PASS_WITH_REVIEW_REPAIR
review_head_sha   = 11bb3f6fc76aecbb1ae41f2e258cccf7beaa429b
review_ci         = 36895816630（android + gateway-web 两个 job 全绿）
development_head  = 10cdd75604836ad0b903f4dd749e80e16bdf32b6
owner_gate        = FINAL_VISUAL_PREVIEW   ← 现在卡在这里
```

## 2. What the critic loop actually did

Task requires at least two screenshot→independent critic→automatic repair→recapture rounds by a nonimplementer. Alien implements, Mech reviews, on different machines. Both rounds used Mech's own probes, not Alien scripts.

| Round | Deliberately different means | Result |
|---|---|---|
| 1 | Playwright geometry/overflow/rawISO, desktop plus360px; both embedding directions; Android connected capture | No confirmed defect |
| 2 | Actual clicks across nine former functional surfaces plus AA contrast | One defect,item3 |

Mech proactively added round1 narrow360px: Alien's script only ran1440×1000, leaving mobile crowding uncovered. Alien records that rather than assigning blame to Mech.

Item3: Web Settings/Pairing displayed apiVersion/schemaVersion plainly, while the hard rule explicitly folds schema/version into advanced/runtime details. These pages already use common.runDetails seven times. Android folds correctly; Web alone differed. Review directly repaired under§3 at11bb3f6. Alien independently rechecked both disclosures,Web-only change,no plain residual,and connection status still visible.

## 3. Two recorded disagreements that are not defects

Both appeared defective and were evidentially closed, removing ambiguity before freeze.

1. Web4/Android5 primary entries are consistent. Web persistent Ask/Do bar needs no navigation destination; Android lacks it and needs Ask destination. Reachability agrees; controls differ. Contract should say Ask one step away from any surface,not hard-code counts.
2. Web two time formats observation withdrawn as Mech misreading. In214px thumbnail Mech read 秒 as 年. Character-by-character DOM reads 最近在线1秒前,U+79D2 notU+5E74. Intl.RelativeTimeFormat occurs0 times in Web source,both paths same age(). This observation must not enter freeze.

## 4. Two warnings by Mech: retained without dilution

1. Repair verification self-verifies: Mech authored and checked11bb3f6,not independent. Reviewer self-check cannot replace Owner gate. Alien's independent recheck supplements it,but Alien is Development,not third party.
2. Verdict covers only Review. Step7Owner,step8main merge+greenCI,then frozen declaration remain undone. Nothing here claims frozen.

## 5. Owner ruling requested

Step7 permits directional good-looking/not-good-looking feedback,without requiring final100% polish. One sentence suffices: may currentC2 dark-violet stage/lime emphasis/hologram-cyan direction freeze as baseline?

If specific images are needed,evidence locations are local,uncommitted,runtime gitignored:

```text
Alien 侧  D:\utopia-ui190\.runtime\evidence\ui-190\
  Web 九个功能面     surface-Home / -Rooms / -Devices / -Services / -Tasks /
                    -Actions / -ActionDetail / -Activity / -Pairing / -Settings / -Ask .png
  设备页与详情       surface-Devices.png, surface-Devices-detail.png
  Android 实机连接   android-connected-10cdd75.png   ← 相对时间已验证：138s ago / 13s ago
  嵌入缝隙           embedded-end-to-end.png, rooms-standalone.png
  功能回归原始数据   functional-regression.json（9/9 可达）
Mech 侧   .runtime/evidence/mission-book/UI-190/（在 Mech 的工作区，不在本机）
  android-connected-320dp-font1.5.{png,xml}、android-connected-360dp-font1.0.{png,xml}
```

The raw index retains Alien Web surfaces/device details,connectedAndroid captures,embedding and9/9 regressionJSON,plus Mech's two Android configurations in its own workspace.

## 6. After ruling: step8 and unlock

1. Merge ui/UI-190-ui-baseline-freeze at11bb3f6,28commits ahead,intoUtopia main.
2. RunCI on merged main and confirm green; current main e7c498f has successCI.
3. Record exactSHA/CI,declare UI_BASELINE_FROZEN.
4. Automatically unlockRS201/202,dynamicAI pool/availability and multidevice concurrency/rescheduling;Alien may then claim.

## 7. Requested recorded ruling: avoid repeating on the next screen

Beyond item3 repair,write the ruling into freeze contract: a page's Advanced heading does not satisfy folding; values must be in an actually effective disclosure. Recording only repair would repeat the dispute on the next screen.

## 8. What Alien explicitly will not do

Alien will not decide this Owner gate or give its own implementation final visual scores. It will not write the UI190 branch during Review. This package only consolidates and delivers.
