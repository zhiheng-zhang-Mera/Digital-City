# UI-101 — REVIEW REPORT（Host `Mech`）

> 常驻规则：[../CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md)
> 复核对象：Web 产品壳，Development head `56c819000548d9496ecb9fd2459f19d1ad9fcec1`（CI `36870347917`）
> 复核产出 head：`2c6e787c3a08166378c0f645a1ee200ce6885414`（CI `36871760594`）
> Development 主机 `Alien`，复核主机 `Mech` → §3 双机独立满足

## 0. 结论

```text
REVIEW_RESULT = PASS_WITH_REPAIRS
```

两处真实缺陷已由本机直接修复；工作书主动交接的"未验证区域"已在本机**实际触发并验证**，而非采信。

## 1. §7 reconciliation（claim 前完成）

```text
recorded branch == CI head_branch        ui/UI-101-web-product-shell                 OK
recorded head   == CI head_sha           56c819000548d9496ecb9fd2459f19d1ad9fcec1    OK
required terminal state == conclusion    run 36870347917 == success (android+gateway-web)  OK
```

## 2. 独立性声明

本机另写 `scripts/ui-101/review-mech-probes.mjs`，**不**复用 Development 主机的
`shell-shots.mjs` 或 `ask-and-detail-shots.mjs`（§3 禁止只签字或复述作者测试）。
它针对两件作者自己交接下来、以及两个主机都没做过的测量：**五个 Ask 状态的端到端触发**、
**生产 Web 壳的颜色对比度**、以及**双语言下原始内部词汇是否泄漏 + 390px 溢出**。

## 3. 修复的真实缺陷

### R-1 — 不可见的交互文字（真实、用户可见）

`rawLink()` 渲染的是 `<a class="primary link-button">`。两条规则都是单类选择器（同特异性），
`.link-button` 在样式表里更靠后，于是它的 `color: var(--lime)` 覆盖了 `.primary` 的
`color: var(--void)`，而 `.primary` 的柠檬色背景**照样生效**：

```text
浏览器实测   color rgb(198,242,78) on background rgb(198,242,78)   contrast 1:1
影响范围     Rooms 页全部 10 个「在新标签页打开」链接
```

这不是"对比度偏低"，是**完全看不见**；而那 10 个链接是除 iframe 嵌入之外**进入房间的唯一入口**。
修法：加一条更高特异性的 `.link-button.primary { color: var(--void); }`。

为什么两个主机都没抓到：**都没有测过生产 Web 壳的对比度**。作者的验收 pass 检查的是工程语汇、
禁用字形、原始词汇、溢出与 page error——不含颜色对比度。修复后本机复测 **0 个元素低于 AA**。

### R-2 — 验收仪器无法失败（false clean）

`ask-and-detail-shots.mjs` 为 needs-choice 与 ambiguous 两个用例喂的输入是
`'clean up my downloads folder'` 与 `'open my notes'`。`intents.mjs` 是**字面量规则表**，
这两句话**没有任何规则匹配**，于是两者都落到 UNMATCHED：

```text
修复前  route-confirmed "已就绪"   needs-choice "没有匹配"   ambiguous "没有匹配"   unmatched "没有匹配"
```

即该探针把 UNMATCHED 跑了三遍，却打印 `CLEAN: no findings`，**从未触达它以用例名声称覆盖的其中两个状态**。
它的自检 `distinct.size < 2` 太弱：1 个不同状态 + 3 个相同状态就能满足。

**关键点：这是在完整主机（gateway + reference node + Room hub 全部在线）上复现的。**
工作书的 `development_unverified` 把该缺口归因于"验收环境没有 Room hub、没有注册节点"——
本机证明这个归因不成立：环境齐全时该探针**依然**够不到那两个状态，**原因是输入，不是环境**。

修法：输入替换为**路由自己的字面量触发**（副作用确认路径 `run a safe task of type CHECKPOINT_DEMO`；
双 owner 歧义路径 `search for utopia`），并把自检改为"每个具名用例都必须到达各自的呈现"。修复后：

```text
route-confirmed "已就绪"   needs-choice "需要你确认"   ambiguous "请选择目标"   unmatched "没有匹配"
```

四个状态各不相同，此时的 `CLEAN` 才是有意义的。

## 4. 作者交接的"未验证区域"—— 本机已实际验证

```text
五个 gateway 状态，经真实 shell UI，双语各跑一遍        10/10 到达
  route-confirmed · failed · needs-confirmation · ambiguous · unmatched
默认路径上的原始内部词汇泄漏                            0
双语言下的工程界面语汇（CONTROL SURFACE / WORKSPACE 等）  0
390px 横向溢出                                          0
page error                                              0
```

工作书把 Ask/Do 四状态覆盖列为待复核项，并说"untriggered is not verified"。现在它**已被触发**。

## 5. 未回归

```text
repo suite                                       854/854
作者自己的 shell 验收 pass                        CLEAN（无发现）
作者的 ask/detail 探针（输入修复后）              四个状态各不相同，CLEAN
```

## 6. 边界 — 本次**没有**验证的

- **未做视觉审美判断。** 方向由 Owner 在 UI-000 裁定；本机只测可测量项与硬规则。
- **未做真机/触屏与键盘 Tab 序完整走查。** 工作书的复核清单含"键盘/焦点"，本机只覆盖了对比度、
  状态可达性、溢出与泄漏；焦点顺序与键盘可达性**未验证**，不应被视为已通过。
- **未验证 iframe 嵌入路径**（UI-103 提供的 `?embedded=1` 需要 Web 侧接线；本机在 UI-103 报告里
  已把它记为待接缝，UI-101 的代码里尚未接上）。该接缝仍然开放。
- **对比度测量为近似**：有效背景由向上回溯非透明 `background-color` 加 alpha 合成得出，
  未对 `background-image` 逐像素取底色。对本轮 R-1 的判定无影响（1:1 与 4.5 之间差距极大）。

## 7. 本机自身错误

1. 运行作者探针时忘记导出 `CITY_TOKEN`，得到 `CITY_TOKEN is required to pair` 的报错——
   是我的环境变量问题，不是探针缺陷，重跑即通过。
2. 我第一次统计对比度时把品牌标记这类**背景由渐变绘制**的元素也算成了失败（我的有效背景推导只看
   `background-color`，看不到 `background-image`），在 Android 侧曾因此误报过 1:1。Web 侧本轮没有
   命中这类元素，但这个已知盲区记在这里，避免把探测器的局限当成产品缺陷。
3. 本报告初稿的"自身错误"一节里我曾写下一条**并未真实发生的**探针错误（声称第一版在英文环境下
   断言了中文标记）。我在自查时发现那与我所写的探针不符并删除了它。如实记录这次更正本身：
   写报告时不要凭印象补一条"看起来该有"的自我检讨。

## 8. 交接状态

```text
REVIEW_RESULT          = PASS_WITH_REPAIRS
review_covers_head     = 2c6e787c3a08166378c0f645a1ee200ce6885414 (CI 36871760594 success)
修改范围                apps/web/style.css（presentation）+ scripts/ui-101/（证据工具）
业务语义/API/框架        未改动
```

按 §3，复核主机直接修复范围内缺陷是允许且被要求的；因此**修复后的头是 `2c6e787`**。
本机不主张自己的修复已被独立确认——若需要第三台主机确认，请按其自身判断处理。

## Language reading link / 语言阅读链接

[Complete reading translation / 完整阅读译文](./en/REVIEW_REPORT.md)
