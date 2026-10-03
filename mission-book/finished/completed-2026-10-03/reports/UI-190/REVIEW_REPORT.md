# UI-190 — 跨端视觉审查与 UI 基线冻结 · REVIEW REPORT

> 常驻规则：[../../CONSTRUCTION_RULES.md](../../CONSTRUCTION_RULES.md)
> 工作书：[../../ui-civilization/UI-190-跨端视觉审查与UI基线冻结.md](../../ui-civilization/UI-190-跨端视觉审查与UI基线冻结.md)
> Review Host：`Mech`（Development Host 为 `Alien`，§3 双机独立成立）
> 复核对象（Development 头）：`10cdd75604836ad0b903f4dd749e80e16bdf32b6`，CI `36893135833` success
> 复核结论头：`11bb3f6fc76aecbb1ae41f2e258cccf7beaa429b`（= Development 头 + Review 修复提交），CI `36895816630` success

## 1. 结果

**PASS_WITH_REVIEW_REPAIR。** 两轮 critic 共发现**一处已确认缺陷**，已修复并双向验证；其余若干项**明确未验证**，列在 §4，不当作通过。

**本报告只覆盖 Review 阶段。** UI-190 的 step 7 `FINAL_VISUAL_PREVIEW` Owner gate、step 8 合并 main 与 `UI_BASELINE_FROZEN` 声明**均未完成**，本报告不主张任何基线已冻结。

## 2. 复核仪器：为什么不是重跑作者的脚本

§3 要求 Review 独立找问题，而不是复述作者的测试。因此两轮都不使用 `scripts/ui-190/rendered-surfaces.mjs`，而是自建仪器，且**两轮刻意使用不同仪器** —— 重复第一轮的探针只会凑够轮数而不证明任何事，本计划已经出现过两次这种失败模式。

贯穿两轮的一条规则，是本任务用代价换来的：

```text
裁切 / 拥挤 / 溢出      -> 必须来自像素
字符级文本结论          -> 必须来自 DOM
两者都不是              -> 缩略截图不是仪器
```

## 3. 已验证

### 3.1 第一轮（渲染态，自建仪器）

覆盖四个捕获、三种表面：Web 桌面 1440×1000、**Web 窄屏 360×800**（作者脚本从未使用，而"移动拥挤"是清单具名项、Android 侧又是按 320dp 判的）、Room Hub 独立态与 `?embedded=1` 嵌入态。

- C2 void `rgb(8,7,15)` 在四个捕获上全部到达像素；
- 水平溢出 **0**，桌面与 360px 窄屏都是；
- Web **可见原始 ISO-8601 时间戳为 0** —— R-1 修复所对的 parity 目标在参照面上同样成立；
- 结构性搁浅控件 **0**（排除"按设计隐藏"后）；
- 嵌入接缝**双向正确**：独立态 `rail display: flex` 且 `body[data-embedded]` 为 null，嵌入态 `rail display: none` 且 `data-embedded` 为 `true`。

**Android 连通捕获达成**，而这一路正是 Development 记录为 `development_android_live_capture_exhausted`（未达成）的：在**模拟器**上而非实体机、以 `/data/local/tmp` 而非 `/sdcard` 暂存、以 `run-as … cp` 而非 shell 重定向写入 —— 恰好避开了 Development 三次失败的成因。320dp @ 1.5 与 360dp @ 1.0 两个配置，`ONLINE` 皆为真、设备卡在位、**0 处原始 ISO 时间戳**。

### 3.2 第二轮（驱动界面 + 对比度，另一种仪器）

- **功能回归：以点击证明可达。** 九个导航面（首页 / 工具·房间 / 设备 / 动态 / 服务 / 任务 / 行动 / 配对 / 设置）逐一实际激活；除首页（落地页）外每个都改变了主内容，**全程 0 页面错误**。可达性是**用出来的**，不是从 DOM 有节点推断的。末个驱动面已截图，渲染完整。
- **对比度：** 每个可见文本叶对有效背景测 WCAG AA，Web 与 Hub **均 0 失败**。这是本计划的真实风险项而非泛化清单 —— UI-000 复核确实产出过 `--ink-3` 三方向全部未过 AA 的真实缺陷，所以"未复发"是**测出来的**。

### 3.3 确认缺陷 item 3（已修复 + 双向验证）

`apps/web/app.js` 有**两处**用户可见的未折叠 schema/version：第 42 行 Pairing 页、第 76 行 Settings 页。硬规则**具名列举** schema/version 属于默认折叠到"高级信息/运行详情"的值。

两处都位于导航"高级"组内的页面 —— 这支持宽松解读。**当下判定的关键事实是像素读不出来的那一条：两处都不在真正的折叠里，而 shell 并不缺折叠可用 —— 同样的页面已在用 `common.runDetails` 渲染七处折叠。** 因此这是"折叠可用且在用时，值仍是明文可见"。

**修复**：提交 `11bb3f6`，两行，两处都改用**既有的** `common.runDetails` 折叠模式；只移动被具名列举的版本值，Gateway **连接状态保持可见**（那是正当产品状态，不是工程词汇）。

**双向验证**，因为"折叠"与"删除"是两回事、任一半失败都是缺陷：折叠收起时两面上字符串**都不在可见文本里**；展开时**都在**。两面皆 PASS。回归复测干净：可见原始 ISO 0、水平溢出 0、C2 void、无页面错误。

### 3.4 已结案的两项

- **item 4 不是缺陷。** Web 有常驻内联 Ask/Do 栏（`form#ask-form`，连上后每页都在），Ask 无需占导航位；Android 无此栏，故 Ask 必须是一级目的地。两面对**可达性**一致，只是提供可达的控件不同。契约表述取 **"Ask 在每个表面一步可达"**，而不锁死入口数量 —— 锁数量会逼 Web 在常显的栏旁加一个冗余入口。
- **note-2 的 relative-time 观察已撤回。** Development 以源码事实反驳（`Intl.RelativeTimeFormat` 全树 0 处、`年前` 0 处、`age()` 单一路径两种输出），我以 DOM 逐字验证：文本是 `最近在线 1 秒前`，码位 `… 79d2 524d`，即 **U+79D2 秒，不是 U+5E74 年**。我在 214px 宽的 5039px 长图缩略里**看错了字**。观察撤回，**不得进入冻结**。

## 4. 未验证 / 明确不当作通过

1. **Owner gate 未开**：step 7 的 `FINAL_VISUAL_PREVIEW` 尚未交付，§6 给出待交付材料；
2. **未合并 main、未声明 `UI_BASELINE_FROZEN`**：step 8 未做，故 RS-201/202 **尚未解锁**；
3. **独立性的残余**：Review 未把独立性扩展到整个表面 —— 修复提交由我写、我查（见 §5），只有 Development 的独立复验覆盖了该提交本身；
4. **组合级测试仍缺**：`ui-test-junit4` / `androidx.test` 在两台主机的离线 Gradle 缓存中均缺失，所以"折叠而非删除"这类属性在 Android 侧仍只有构造性论证，未由此复核补上；
5. **对比度只在 Web 与 Hub 上测过**，Android 侧未做等价测量。

## 5. 披露

**Review 直接修复了 item 3**，依据 §3 的 *"Review 必须独立找问题并可直接修复范围内缺陷"*。**这推翻了我自己先前的声明**：我的 review_plan 写过"Mech 在 Review 期间不写 `ui/UI-190-ui-baseline-freeze`"。那条承诺针对的是**不打扰进行中的 Development**；Development 已完成并释放、分支静止、§3 明许复核者直修，故承诺不再适用。我选择**记录这次反转**而不是默默越界，并记录诚实的替代路径：Development 曾主动提出在释放后自行修改，那是完整独立的路线，Owner 可以选它。

**自我验证，及其如何被正确补上。** `11bb3f6` 的验证最初是**自验**（我写、我查），我在 note 7 与裁决里都把它标为残余缺陷。随后 Development 记录了 *"item-3 repair independently re-verified at 11bb3f6"*（`cb9087f`）—— 我既未撰写也未要求该验证，因此缺失的另一半由**未撰写该改动的主机**补上，方向是对的：由对方复核复核者的改动，而不是复核者再次自证。**但这项补正不退役其余残余**（见 §4.3）。

**本次复核中我自己的仪器与我自己的判断，出错次数多于被复核物**，逐条记录：

1. 第一轮 `strandedControls` **全表误报** —— 那些是连接表单与 Knowledge Room 编辑器，**按设计隐藏**；零尺寸是"未显示"的证据，不是"搁浅"。改用 `checkVisibility()` 后四表归零。
2. 第一轮我**假设** Web 未适配窄屏（360px 截图看着像半宽侧栏挤压内容）。**读源码推翻**：`@media (max-width:900px)` 里 `aside{position:static;width:auto}`、`main{margin-left:0}`，我误认成侧栏的其实是 `nav` 的两列网格。第二轮改为**断言**响应式状态：1440 下 aside `fixed`/232px、main 左距 232px；360 下 aside `static`/360px、左距 0、nav 两列各 162.5px。整页捕获确认布局并不拥挤，底部标题完整（只是落在折线以下）。
3. 第一轮 `heading` 指标取的是文档第一个 `h1/h2`，而它在**隐藏的连接面板**里，故每个面都报同一串，该指标**未在任何证据中使用**。
4. **note-2 的看错字**（见 §3.4）—— 本计划第七次仪器侧问题，且是**第一次产出finding而非漏报**。

## 6. 交付给 Owner gate（`FINAL_VISUAL_PREVIEW`）的精简视觉包

原始证据按 `PROCESS_DATA_POLICY` 留在 runtime，此处只给有界清单。全部取自复核结论头 `11bb3f6`。

| 文件（`.runtime/evidence/`） | 它证明什么 |
|---|---|
| `ui-190/mech-web-desktop-1440x1000.png` / `-full.png` | Web 桌面，C2 void、无水平溢出 |
| `ui-190/mech-web-narrow-360x800.png` / `-full.png` | Web 窄屏 360px，布局不拥挤，底部标题完整 |
| `ui-190/mech-hub-standalone.png` | Room Hub 独立态，保留自己的 rail |
| `ui-190/mech-hub-embedded.png` | 嵌入态，rail 隐藏，接缝另一方向 |
| `ui-190/mech-r2-web-nav-driven.png` | 九面逐一驱动后的末个驱动面（设置） |
| `ui-190/mech-repair-{pairing,settings}-{collapsed,expanded}.png` | item 3 修复的**双向**证据：收起不可见、展开可见 |
| `mission-book/UI-190/android-connected-320dp-font1.5.png` | Android 连通 320dp @ 1.5（最难在范围内配置） |
| `mission-book/UI-190/android-connected-360dp-font1.0.png` | Android 连通 360dp @ 1.0，`Last snapshot` 完整可见 |

机器可读结果：`ui-190/mech-critic-web-rooms.json`（第一轮四捕获）、`ui-190/mech-critic-round2.json`（九面可达性 + 对比度）、`ui-190/mech-repair-verify.json`（修复双向）。

## 7. 下一步

Review 阶段到此结束。**未完成且不由本报告主张的**：向 Owner 交付上表并取得 `FINAL_VISUAL_PREVIEW` 意见 → 合并 main 并记录精确 SHA/CI → 声明 `UI_BASELINE_FROZEN` → 解锁 RS-201/202。

## 8. 冻结就绪性核验（Review 侧，只读）

在等 Owner gate 期间做了一次**只读**的就绪性核验，因为"我通过的产物能否真的冻结"是 Review 可以验证、而一旦拖到第 8 步才发现代价很高的事：

```text
origin/main                          = e7c498f
origin/ui/UI-190-ui-baseline-freeze  = 11bb3f6
main..branch                         = 28 commits   （整个 UI 计划：UI-000 → UI-190）
branch..main                         = 0 commits    ← main 是分支的严格祖先
git merge-tree --write-tree main branch = exit 0，产出树对象 → 无冲突
main 最近 CI                          = success（36830053908 等）
```

两条执行者可直接使用的结论：

1. **第 8 步的合并在当前 SHA 上是 fast-forward。** `branch..main = 0` 意味着 main 是分支的严格祖先，合并无需制造 merge commit，也就没有"合并过程再引入什么"的空间 —— 这正是本计划已经出现过一次的**静默排除**风险的相反面。
2. **无冲突，且以不触碰工作树的方式验证。** `git merge-tree --write-tree` 只计算树、不落盘，因此这次核验不会污染待冻结产物。`main..branch = 28` 也说明冻结一次将带入整个 UI 阶段，与 UI-190 的定位一致。

**明确不在本核验范围内**，以免被读成超出实际：这只证明**可合并性**，不证明合并后的 main CI 会绿 —— 那要在真合并后按 step 8 记录精确 SHA/CI；也不主张 Owner gate 已过。本核验不改任何分支、不推进冻结、不构成冻结声明。

