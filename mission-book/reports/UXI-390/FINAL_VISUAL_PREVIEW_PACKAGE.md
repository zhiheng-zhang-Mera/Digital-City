# UXI-390 — FINAL_VISUAL_ACCEPTANCE 极简视觉包（步骤 5 交付）

```text
交付对象 = Owner
任务      = UXI-390 双机最终产品验收与收口
交付时点  = Development 阶段步骤 5 完成、Owner 目视门开启之时
实现分支  = uxi/UXI-390-final-product-acceptance
实现头    = 149a4c14b596b92f04fab6269eca1dcb7727303f
```

> 本包只做一件事：把你需要看的东西集中到一处，让你**只需要说「好看」或「不好看 + 一句原因」**。
> 不需要你写 CSS、组件清单或任何技术细节。

## 一、看什么（全部为真机/真浏览器实拍，非设计稿）

图片在实现仓库（Utopia）的 **`evidence/raw/mission-book/UXI-390/owner-package/`**，位于分支
`uxi/UXI-390-final-product-acceptance` 的 `149a4c1`；本机直接打开目录：`D:\utopia-uxi390\evidence\raw\mission-book\UXI-390\owner-package\`。

| # | 文件 | 这是哪一面 | SHA-256 前 16 位 |
|---|---|---|---|
| 1 | `01-web-home.png` | Web Home（已配对、ONLINE；助手槽 + 运行时节点 + 最近活动） | `f14ec4c14494437b` |
| 2 | `02-web-ask.png` | Web Ask / Do（在真实输入框里提交真实请求后挂载） | `c65d6b7579ee11db` |
| 3 | `03-web-tools-rooms.png` | Web Tools / Rooms（Gateway 报「Room Hub available · 10 rooms」） | `75912f2581649110` |
| 4 | `04-web-room-open.png` | **一个 Room 真正打开**：Room Hub 内嵌，Room 01 Knowledge Room | `eb79628af96f79a4` |
| 5 | `05-web-provider-state.png` | **一个 provider 切换状态**：设备离线后真实任务在飞时面板给出的选择态 | `e9d3f34208770585` |
| 6 | `android-home.png` | Android Home（真机实拍） | `d58d2e7d347e7aae` |
| 7 | `android-ask.png` | Android Ask / Do（真机实拍，中文界面） | `520850a6aaf04baa` |
| 8 | `android-tools.png` | Android Rooms · local tools（真机实拍） | `89604fc5a0e1333b` |

每张图都附带同目录下的 `capture-receipt.json` / `capture-receipt-android.json`：拍摄时间、实现头、端口、
每图的字节数与 SHA-256，以及**拍摄当时该页面的可见文本**，因此图片可核对而不是只能相信。

## 二、这一轮实际「驱动」了什么（所以它不是截图墙）

```text
Web    真 Gateway + 真 reference node + 真 Room Hub(4320) + 真 Edge(Playwright, 1440x900)
       配对 ONLINE → Home → 真实输入并提交 Ask → Tools/Rooms → 点 Open 打开 Room 01 → 杀执行器并创建真实任务
Android  真机 BICIPVNB5HS85H9T, 真装的 city.utopia.control, 真 Gateway + node
       把 App 自己的连接配置写入并 adb reverse，底部栏真实点按 Home / Ask / Rooms
```

三条**反空转**断言（不满足就拒绝出包，本轮全部成立）：

1. **Room 必须真的打开**：以 `Close Room` 控件出现 + 面板文本变化为准；第一版脚本因为「打开的房间在折叠线
   以下」拍出了与概览**逐字节相同**的图，被自带的重复图检测抓住并判失败，修好后才出包。
2. **provider 状态必须真有任务在飞**：先杀掉执行器，再通过真实控件创建任务，要求面板出现 task card。
3. **两张图不得逐字节相同**：Web 五张、Android 三张的 SHA-256 全部互异。

## 三、请你只看两件事

1. **好看 / 不好看**（整体视觉方向、信息密度、是否还像工程控制台）。
2. 若不好看，**一句原因**即可（例如「太暗」「字太小」「房间页太空」）；由 Agent 把自然语言翻译成具体
   设计修改并继续自动循环，不要求你给技术方案。

## 四、一个必须说清的事实（与你的裁决直接相关）

第 5 张图里，面板给出的是**「The current service is responding slowly. Use another available one?」**，
而下方按钮是 **「Choose another service · nothing available to switch to」（灰态不可点）**。

这正是你选项 1 裁决在界面上的样子，也再次确认了延期理由：City 不发布五维负载向量，未测量的负载按设计
不能作为备选，所以**切换提示会出现、但没有可切换的目标**；界面如实呈现这一点，而不是编造一个可选项。

## 五、这份交付之后还剩什么

```text
1. 本步骤产物所在的最新实现头 149a4c1 的 hosted CI（run 36998342105）需为绿      [进行中]
2. 绿了之后：development_complete = true，释放给 Review（§3：复核必须是 Mech）  [Alien 下一步]
3. Mech 独立视觉 critic + 复核                                                  [Mech]
4. Owner FINAL_VISUAL_ACCEPTANCE（即本包）                                       [你]
5. 步骤 7 合并 main、验证 main CI、打标记 UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED
```

**本包不声称任何门项已通过**：远程 handoff 子项按其裁决明确保持 **NOT MET**，Owner 目视门在本包被裁定前
也仍是 **NOT MET**。
