# UI-190 · FINAL_VISUAL_PREVIEW 交付包（精简视觉包）

```text
交付对象 = Owner
任务      = UI-190 跨端视觉审查与 UI 基线冻结
交付时点  = Review 阶段结束、Owner 门禁开启之时
```

> 本包只做一件事：把 Owner 需要看的和需要裁决的东西集中到一处。
> 它**不**声称基线已冻结——冻结发生在第 8 步，且在第 7 步之后。

## 一、当前状态（一句话）

Development 与 Review 均已完成，审查结论 `PASS_WITH_REVIEW_REPAIR`；现在等你给方向性意见。
**UI_BASELINE_FROZEN 尚未声明**，RS-201/202 尚未解锁。

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

## 二、critic 循环实际发生了什么

任务要求「两轮以上：截图 → 独立 critic → 自动修复 → 再截图」，由**非实现方**执行。
Implementation host 是 Alien，Review host 是 Mech，两台机器分离；两轮都由 Mech 用**自己造的**
探针完成，没有复用 Alien 的脚本。

| 轮次 | 手段（刻意不同） | 结果 |
|---|---|---|
| 第 1 轮 | Playwright 几何/溢出/raw-ISO，桌面 **加 360px 窄屏**；嵌入缝隙双向；Android 实机连接抓图 | **无确认缺陷** |
| 第 2 轮 | 实际点击驱动九个旧功能面；另加 WCAG AA 对比度测量 | **发现 1 个缺陷（item 3）** |

第 1 轮的 360px 窄屏是 Mech 主动补的：Alien 自己的脚本只跑过 1440x1000，**移动拥挤**这一条
检查项在 Alien 手上其实没被覆盖到。这一点由 Alien 记录，不推给 Mech。

**item 3**：Web 的 设置 与 配对 页把 `apiVersion / schemaVersion` 直接明文渲染，而硬规则
明确规定 schema/version 默认折叠进「高级信息/运行详情」——并且这几个页面**已经在用**同一个
折叠样式（`common.runDetails`，用了 7 处）。Android 折叠正确，**Web 是唯一的例外**。
已由 Review 依 §3 直接修复，修复提交 `11bb3f6`，Alien 已独立复核：两处均已折叠、只动 Web、
无残留明文、且没有把用户真正要看的连接状态一起折掉。

## 三、两份记录在案、不构成缺陷的分歧

这两条都**曾经看起来像缺陷**，最后有据可查地关掉了——列出来是为了让基线冻结时不带悬念。

1. **主导航条目数 Web 4 / Android 5**：不是不一致。Web 有一条常驻的 Ask/Do 输入条，
   Ask 无需占导航位；Android 没有常驻条，Ask 必须以目的地形式存在。两者在**可达性**上一致，
   差异只在提供可达性的控件。结论：契约写「Ask 在任何界面一步可达」，而不是写死条目数。
2. **Web「同一事实两种时间格式」**：**已撤回，是 Mech 的误读**。Mech 在 214px 宽的缩略图上
   把「秒」看成了「年」；逐字读取 DOM 得到 `最近在线 1 秒前`（U+79D2 秒，非 U+5E74 年）。
   Web 源码里 `Intl.RelativeTimeFormat` 出现 **0 次**，两条路径其实是同一个 `age()`。
   该观察禁止带入冻结。

## 四、Mech 自己提出的两条警告（Alien 原样保留，不淡化）

1. **修复提交的验证是自我验证**：`11bb3f6` 是 Mech 写的、也是 Mech 自己验的，因此**不构成独立
   验证**；Review 方的自查修复**不能替代 Owner 门禁**。Alien 的独立复核补充了这一点，但
   Alien 是 Development host 而非本任务的第三方。
2. **本结论只覆盖 Review 阶段**：第 7 步 Owner 门禁、第 8 步 merge 到 main 并让 main CI 变绿、
   之后才是 `UI_BASELINE_FROZEN` 声明——这些**都还没做**。没有任何东西在这里声称基线已冻结。

## 五、请 Owner 裁决的事

任务第 7 步的原话：此处 Owner 可给**方向性**「好看/不好看」意见，原则上**不要求**把 UI 精修到
最终 100%。所以只需要一句话：**当前方向（C2 暗紫舞台 / 酸橙强调 / 全息青）是否可以冻结为基线？**

如果需要看具体画面，证据在下列位置（均为本机、未提交，`.runtime/` 已 gitignore）：

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

## 六、裁决之后会发生什么（第 8 步与解锁）

1. `ui/UI-190-ui-baseline-freeze`（`11bb3f6`，领先 main **28 个提交**）合入 Utopia main；
2. 在 merge 后的 main 上跑 CI 并确认全绿（main 当前 `e7c498f`，其上 CI 为 success）；
3. 记录精确 SHA/CI，声明 `UI_BASELINE_FROZEN`；
4. **自动解锁 RS-201 / RS-202**（动态 AI 池与可用性选择、多设备并发感知与再调度），
   Alien 届时可领取。

## 七、一件请求记录在案的裁定（避免下一块屏幕重新争论）

item 3 的修复之外，请把**裁定本身**写进冻结契约：
「页面上挂着『高级』标题，并不等于满足折叠要求；这些值必须落在实际生效的折叠里。」
只记修复不记裁定，下一块屏幕还会为同一个问题再吵一遍。

## 八、Alien 明确不做的事

Alien 不会自行裁定本门禁：`FINAL_VISUAL_PREVIEW` 是 Owner 门禁，Alien 既不是 Owner，
也不能给自己的实现打最终视觉分。Alien 也不会在 Review 期间写
`ui/UI-190-ui-baseline-freeze`。本包只做汇总与交付。
