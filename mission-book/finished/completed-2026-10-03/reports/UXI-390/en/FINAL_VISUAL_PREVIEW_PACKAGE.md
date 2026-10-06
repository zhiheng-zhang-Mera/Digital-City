# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../FINAL_VISUAL_PREVIEW_PACKAGE.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# UXI-390 — Minimal FINAL_VISUAL_ACCEPTANCE package, step5 delivery

```text
交付对象 = Owner
任务      = UXI-390 双机最终产品验收与收口
交付时点  = Development 阶段步骤 5 完成、Owner 目视门开启之时
实现分支  = uxi/UXI-390-final-product-acceptance
实现头    = 149a4c14b596b92f04fab6269eca1dcb7727303f
```

Complete translation: delivered toOwner forUXI-390 dual-host final product acceptance/closeout, whenDevelopment step5 completes andOwner visual gate opens; exactimplementation branch/head preserved above.

> This package puts everything to inspect in one place, so Owner **only says “looks good” or “does not look good + one reason.”** No CSS, component list, or technical details required.

## 1. What to inspect: actual physical-device/browser captures, not mockups

Images are in Utopia implementation repository **evidence/raw/mission-book/UXI-390/owner-package/** onbranchuxi/UXI-390-final-product-acceptance at149a4c1. Local directory D:/utopia-uxi390/evidence/raw/mission-book/UXI-390/owner-package/.

| # | File | Surface | First16 SHA256 digits |
|---|---|---|---|
|1|01-web-home.png|Paired ONLINE WebHome, assistant slot/runtime nodes/recentactivity|f14ec4c14494437b|
|2|02-web-ask.png|WebAsk/Do mounted afteractual input/request submission|c65d6b7579ee11db|
|3|03-web-tools-rooms.png|WebTools/Rooms, gateway saysRoom Hub available·10rooms|75912f2581649110|
|4|04-web-room-open.png|**Genuinely opened** embeddedRoom Hub Room01 Knowledge Room|eb79628af96f79a4|
|5|05-web-provider-state.png|**Provider switch state**, realin-flight task afterdevice offline|e9d3f34208770585|
|6|android-home.png|PhysicalAndroid Home|d58d2e7d347e7aae|
|7|android-ask.png|PhysicalAndroid Ask/Do, ChineseUI|520850a6aaf04baa|
|8|android-tools.png|PhysicalAndroid Rooms/localtools|89604fc5a0e1333b|

Eachimage hascapture-receipt.json/capture-receipt-android.json: capturetime, implementationhead,port, bytes/SHA256, and **visibletext atcapture time**. Images are verifiable, not merely trusted.

## 2. What was actually driven: this is more than a screenshot wall

```text
Web    真 Gateway + 真 reference node + 真 Room Hub(4320) + 真 Edge(Playwright, 1440x900)
       配对 ONLINE → Home → 真实输入并提交 Ask → Tools/Rooms → 点 Open 打开 Room 01 → 杀执行器并创建真实任务
Android  真机 BICIPVNB5HS85H9T, 真装的 city.utopia.control, 真 Gateway + node
       把 App 自己的连接配置写入并 adb reverse，底部栏真实点按 Home / Ask / Rooms
```

Complete translation: realGateway/reference node/RoomHub4320/Edge Playwright1440x900; pairONLINE→Home→realAsk input/submit→Tools/Rooms→OpenRoom01→kill executor/create realtask. PhysicalAndroid BICIPVNB5HS85H9T, actuallyinstalledcity.utopia.control, realgateway/node; writeapp connection config, adb reverse, actualbottom-bar Home/Ask/Rooms taps.

Three **anti-vacuity** assertions refuse packaging iffalse; allmet:

1. **Room genuinely opens**, Close Room control plus changedpaneltext. Firstscript room belowfold produced byte-identical overview/open images; duplicateimage check failed; onlyafterrepair packaged.
2. **Provider state hasreal in-flighttask**: killexecutor thencreate throughrealcontrol, requiretaskcard.
3. **Images cannot be byte-identical**: fiveWeb/threeAndroid SHA256 all distinct.

## 3. Owner need judge only two things

1. **Looks good / does not look good**: direction,density,whetherstill engineeringconsole.
2. Ifnot, **one reason**: too dark,too smalltext,roomtooempty. Agent translatesnaturallanguage into designchanges andcontinuesautomaticloop; noOwnertechnicalplan required.

## 4. A fact directly relevant to the ruling

Image5 says **The current service is responding slowly. Use another available one?** butbutton **Choose another service·nothing available to switch to** isgrey/unselectable.

This isOwner option1 ruling rendered, confirmingreason: Cityhasnofive-dimensional loadvector, unmeasuredload cannot bealternate bydesign. **Switchprompt appears butno target isavailable**; UIreports reality ratherthaninventing selection.

## 5. What remains after delivery

```text
1. 本步骤产物所在的最新实现头 149a4c1 的 hosted CI（run 36998342105）需为绿      [进行中]
2. 绿了之后：development_complete = true，释放给 Review（§3：复核必须是 Mech）  [Alien 下一步]
3. Mech 独立视觉 critic + 复核                                                  [Mech]
4. Owner FINAL_VISUAL_ACCEPTANCE（即本包）                                       [你]
5. 步骤 7 合并 main、验证 main CI、打标记 UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED
```

Complete translation: 1 hostedCI36998342105 onlatest149a4c1 mustgreen, theninprogress. 2 Aftergreen Alien setsdevelopment_complete true/releasesReview, §3Mech required. 3 Mechindependent visualcritic/Review. 4OwnerFINAL_VISUAL_ACCEPTANCE judgespackage. 5Step7merge/mainCI/terminalmarker.

**Package claimsnogate passed**. Remote-handoff explicitly **NOT MET** underOwnerruling; Owner visualgate also **NOT MET** untiljudged.
