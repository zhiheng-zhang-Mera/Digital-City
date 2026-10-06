# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../FINAL_VISUAL_PREVIEW_PACKAGE.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# UXI-390 — Minimal FINAL_VISUAL_ACCEPTANCE package, Step 5 delivery

```text
交付对象 = Owner
任务      = UXI-390 双机最终产品验收与收口
交付时点  = Development 阶段步骤 5 完成、Owner 目视门开启之时
实现分支  = uxi/UXI-390-final-product-acceptance
实现头    = 149a4c14b596b92f04fab6269eca1dcb7727303f
```

The package is delivered to Owner for UXI-390 two-host final product acceptance and closeout, when Development Step 5 completes and Owner's visual gate opens. Implementation branch and full head are preserved above.

> Everything to inspect is in one place. Owner need only say **“looks good” or “does not look good, plus one reason.”** No CSS, component list or technical detail is required.

## 1. What to inspect: actual physical-device/browser captures, not mockups

Images are in the Utopia implementation repository at evidence/raw/mission-book/UXI-390/owner-package/, branch uxi/UXI-390-final-product-acceptance, head 149a4c1. Local directory: D:/utopia-uxi390/evidence/raw/mission-book/UXI-390/owner-package/.

| # | File | Surface | First 16 SHA256 digits |
|---|---|---|---|
| 1 | 01-web-home.png | Paired ONLINE Web Home: assistant slot, runtime nodes, recent activity | f14ec4c14494437b |
| 2 | 02-web-ask.png | Web Ask/Do after actual input and request submission | c65d6b7579ee11db |
| 3 | 03-web-tools-rooms.png | Web Tools/Rooms: Gateway reports Room Hub available, ten rooms | 75912f2581649110 |
| 4 | 04-web-room-open.png | **Actually opened** embedded Room Hub Room 01 Knowledge Room | eb79628af96f79a4 |
| 5 | 05-web-provider-state.png | **Provider-switch state** for a real in-flight task after device dropout | e9d3f34208770585 |
| 6 | android-home.png | Physical Android Home | d58d2e7d347e7aae |
| 7 | android-ask.png | Physical Android Ask/Do, Chinese UI | 520850a6aaf04baa |
| 8 | android-tools.png | Physical Android Rooms/local tools | 89604fc5a0e1333b |

Each image is bound through capture-receipt.json or capture-receipt-android.json to capture time, implementation head, port, byte count, SHA256 and **text visible at capture time**. These are verifiable images, not merely trusted images.

## 2. What was actually driven: more than a screenshot wall

```text
Web    真 Gateway + 真 reference node + 真 Room Hub(4320) + 真 Edge(Playwright, 1440x900)
       配对 ONLINE → Home → 真实输入并提交 Ask → Tools/Rooms → 点 Open 打开 Room 01 → 杀执行器并创建真实任务
Android  真机 BICIPVNB5HS85H9T, 真装的 city.utopia.control, 真 Gateway + node
       把 App 自己的连接配置写入并 adb reverse，底部栏真实点按 Home / Ask / Rooms
```

The Web run uses a real Gateway, reference node, Room Hub on port 4320 and Edge driven by Playwright at 1440×900. It pairs ONLINE, opens Home, enters and submits a real Ask request, opens Tools/Rooms, clicks Open for Room 01, then kills the executor and creates a real task. Physical Android BICIPVNB5HS85H9T runs an actually installed city.utopia.control with real Gateway and node; the script writes the App's own connection configuration, uses adb reverse, and genuinely taps bottom-bar Home, Ask and Rooms.

Three **anti-vacuity assertions** reject packaging if false; all passed:

1. **A Room actually opens:** Close Room appears and panel text changes. The first script left the Room below the fold, producing byte-identical overview/open images. The duplicate-image check failed; packaging followed only after repair.
2. **Provider state contains a real in-flight task:** kill the executor, create through the real control path, and require the task card.
3. **Images cannot be byte-identical:** the five Web and three Android SHA256 values are all different.

## 3. Owner judges only two things

1. **Looks good or does not look good:** visual direction, density, and whether it still resembles an engineering console.
2. If not, **one reason**, such as too dark, text too small or Room too empty. The agent translates natural language into design changes and continues the automatic loop; Owner need not provide a technical plan.

## 4. A fact directly relevant to the ruling

Image 5 says **“The current service is responding slowly. Use another available one?”** However, **“Choose another service · nothing available to switch to”** is grey and unselectable.

This renders Owner's option 1 ruling and confirms the historical rationale: City has no five-dimensional load vector, so unmeasured load cannot qualify as an alternate by design. **The switch prompt appears but no target is available.** UI reports reality rather than inventing a selection. This historical premise is retained as recorded; later errata remain authoritative for its correction.

## 5. What remains after delivery

```text
1. 本步骤产物所在的最新实现头 149a4c1 的 hosted CI（run 36998342105）需为绿      [进行中]
2. 绿了之后：development_complete = true，释放给 Review（§3：复核必须是 Mech）  [Alien 下一步]
3. Mech 独立视觉 critic + 复核                                                  [Mech]
4. Owner FINAL_VISUAL_ACCEPTANCE（即本包）                                       [你]
5. 步骤 7 合并 main、验证 main CI、打标记 UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED
```

1. Hosted CI run 36998342105 at latest implementation head 149a4c1 must be green; this was in progress.
2. After it is green, Alien sets development_complete=true and releases Review. §3 requires Mech.
3. Mech performs independent visual criticism and Review.
4. Owner performs FINAL_VISUAL_ACCEPTANCE using this package.
5. Step 7 merges main, verifies main CI and issues UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED.

**The package claims no gate passed.** Remote handoff is explicitly **NOT MET** under Owner's ruling. Owner's visual gate also remains **NOT MET** until judged.
