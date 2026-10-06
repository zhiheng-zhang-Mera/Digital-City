# UI-000 — REVISION REVIEW REPORT（Host `Mech`）

> 常驻规则：[../CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md)
> 工作书：[../ui-civilization/UI-000-视觉方向候选与审美门禁.md](../../ui-civilization/UI-000-视觉方向候选与审美门禁.md)
> 复核主机：`Mech`（revision Development 主机为 `Alien` → §3 双机独立满足；Alien 不得自审）
> 复核对象：C″ = 修订后的候选 C，`revision_head_sha = aea8361c07c003f6f519829b6c1a208c20bccab1`
> 复核产出的分支头：`2978e311959cffee40a172d0ea36e370e8ac59e7`

## 0. 结论

```text
REVIEW_RESULT = PASS_WITH_REPAIRS
```

**1 个真实缺陷（系统性、影响三套候选）已由本机直接修复**；修订声明的 5 项自称决策全部**验证通过**
而非采信；无回归。

## 1. §7 exact-head reconciliation（claim 之前已完成）

```text
recorded branch == evidence head_branch        ui/UI-000-visual-direction-candidates     OK
recorded head   == evidence head_sha           aea8361c07c003f6f519829b6c1a208c20bccab1  OK
required terminal state == evidence conclusion run 36863682166 == success                OK
                                               (gateway-web success, android success)
```

`git merge-base --is-ancestor 01b4b87 aea8361` 成立 → 分支历史线性，无 force-push，我上一轮的证据提交
是本次修订头的祖先。

## 2. 独立性声明（§3：不是只签字或复述作者测试）

本机**另写**了 `scripts/ui-000/review-mech-probes.mjs`，**不**复用：

- `scripts/ui-000/parity.mjs` —— 那是 Mech 自己 Development 阶段的 runner；
- `scripts/ui-000/review-probes.mjs` —— 那是 Alien 的复核探针。

理由：§3 明确禁止复核主机只签字或复述作者测试。两者都只测"事实是否表达/是否降级/是否溢出/触控尺寸"，
**都没有测过颜色对比度**，而这正是暗色霓虹 HUD 最容易失败的地方。本探针补上这一项，并额外验证
修订自己在 `OWNER_STYLE_RULING.md` §6.3 里写下的三条决定。

## 3. 发现的真实缺陷（已直接修复）

### R-1 — 三级文字色 `--ink-3` 在三套候选上全部低于 WCAG 2.1 AA 4.5:1

**测量**：默认渲染态、逐 surface、逐文本元素，取计算色与**实际有效背景**（向上回溯非透明背景并做
alpha 合成）计算对比度。

```text
候选 A  --ink-3 #8b8073 on --paper  #fbf8f3   3.65:1   79 个元素
候选 B  --ink-3 #7e8884 on --bg     #f6f7f6   3.41:1   52 个元素（另有 37 个在 #ffffff 上，3.66:1）
候选 C  --ink-3 #6f6788 on --layer-2 #1b1830  3.26:1   65 个元素（另有 22 个在 --void 上，3.79:1）
合计    267 个渲染元素
```

使用场景全部是**用户真正需要读的内容**：时间戳、状态标签、字段标签、次级元数据；
字号 9.5–14px，属于 WCAG 的 normal text（<18.66px bold / <24px），门槛是 4.5:1，不是 3:1。

**为什么这是 in-scope 缺陷**：工作书"独立复核"小节的第 4 条是「移动/桌面是否都可读」，
UI-190 的 critic 清单明确含 accessibility。这不是审美意见，是可测量的可读性失败。

**修复（只动亮度，保持色相，不改变方向）**：

```text
A  --ink-3  #8b8073 → #7a6f60
B  --ink-3  #7e8884 → #626c67
C  --ink-3  #6f6788 → #8b82a8     ← 在近黑 HUD 上必须「变亮」而不是变暗
```

座标 C 的修复方向值得记录：深色背景上要提高对比度，前景必须**更亮**；如果按浅色主题的直觉去「加深」，
对比度反而会更低（接近背景亮度）。

**另有两处 A 独有失败**（同批修复）：

```text
A  .chip.is-on    --accent #b4502a on --accent-soft #f0d9cd   3.76:1
    → 新增 --accent-ink #9c4423（同色相、文字安全亮度）4.75:1
    （--accent 本身在 --paper 上是 4.81:1，通过，因此没有改动 --accent，避免影响主按钮与链接）
A  .badge-warn    --warn #8a6a1f on warn tint               4.10:1
    → --warn #7a5c18
```

**结果：267 → 0 个元素低于 AA。**

## 4. 验证（而非采信）修订自己声明的决定

`OWNER_STYLE_RULING.md` §6.3 写下了三条"必须显式记录的决定"。复核主机把它们当作**待验证的断言**：

| 声明 | 验证方法 | 结果 |
|---|---|---|
| 二次元语域由几何/字体/色彩承载，**不引入日文文案** | 扫描**假名**（ぁ-ん / ァ-ヶ / 半角カナ）——刻意不用 CJK 扫描，因为本产品是 zh-CN，汉字是预期内容 | **通过**，0 命中 |
| 人物是**诚实的占位剪影**，不是成品立绘 | 检查 Home 的 `.operator` 是否含"占位"字样、是否引用图片资源 | **通过**：含"现在只是占位"；`img/url()` 引用数 0（纯 CSS 绘制） |
| 人物位**不挂任何控件**（避免新的死可供性） | 在 `.operator` 子树内查询 `button, a[href], input, select, textarea, [role=button], [tabindex]` | **通过**，0 个 |
| （附带）人物位列出 v2 invariant 4 的可配置字段 | 检查 命名 / 形象 / 语音 / 职务 四项与 `ASSISTANT` / `SLOT 01` / `未指派 UNASSIGNED` 标签 | **通过**，全部存在 |

第 3 条尤其值得记录：本项目已经因为"渲染出来却点不动"的控件交付过一次真实缺陷（`6059252` 修掉 17 个），
修订显式避免了重犯，本机独立确认了这一点。

## 5. 工作书六条复核标准的逐条结论

| # | 标准 | 结论 | 依据 |
|---|---|---|---|
| 1 | 三套是否真的不同，而非换色 | **通过** | 结构签名不同：a `NAV.switch`+`#root`；b `ASIDE.rail`+`main`+4 section；c `NAV.acts`+`main`。C 本轮改为切角 HUD、圆角 22px→0、主标题 68px→34px |
| 2 | 是否都保留核心功能 | **通过** | capability 覆盖 29/29；parity 396/396（含 7 条真实点击的动作探针）；三套仍各有 10 个 surface |
| 3 | 是否仍有工程后台／监控大盘气质 | **通过** | 工程语汇扫描 0 命中（`CONTROL SURFACE` / `backendRef` / `provenance` / `schemaVersion` …）；原始事件类型已从 primary surface 移除 |
| 4 | 移动/桌面是否都可读 | **修复后通过** | 溢出 0（390px 下 `scrollWidth == clientWidth`）；<24px 触控目标 0；**对比度 267→0 低于 AA**（本机新增测量） |
| 5 | 是否存在"AI SaaS 模板"式无个性复制 | **通过** | 三套无共享模板骨架；C 的切角 `clip-path`、发丝描边、扫描线、分段仪表是本轮新写的语汇 |
| 6 | 技术细节是否默认降级而仍可访问 | **通过** | 泄漏探针 0；`revealAll()` 后技术值仍可达；未展开的 `<details>` 与关闭的 inspector 不计入可见文本 |

## 6. 回归与门槛（全部在本机、在本分支头上实跑）

```text
scripts/ui-000/review-mech-probes.mjs    contrast 0 低于 AA · 失败/4xx 请求 0 · page error 0 · 声明检查全通过
scripts/ui-000/review-probes.mjs         0 失败（strictVisible 0 / demotion 0 / overflow 0 / tapTargets 0 / glyphs 0 / consoleVocab 0 / coverage 29/29）
scripts/ui-000/parity.mjs                396/396 PASS（132/候选）
node --test tests/ui-000-candidates.test.mjs   5/5
node --test "tests/*.test.mjs"           859/859
node scripts/check-bilingual.mjs         docs / evidence / data-records = SYNCHRONIZED
scripts/ui-000/evidence-check.mjs        PASS（重拍后）
```

## 7. 边界 — 本次**没有**验证的

- **未做视觉审美判断。** 风格是否"好看"是 Owner 的门禁，Owner 已采纳 C″；本机只做可测量项与硬规则。
- **未验证真机 Android。** 本轮改动全在 `apps/web/candidates/**`（CSS 颜色 token）；Android 候选屏源码
  自 `905e9ff` 起未变，故沿用既有真机证据，未重新引导模拟器。
- **对比度测量是近似而非规范级取证。** 有效背景由"向上回溯非透明 `background-color` + alpha 合成"得出，
  未对 `background-image`（本页有极淡的径向渐变与斜纹）逐像素取真实底色。渐变 alpha 最高 0.20、
  叠在 `#08070f` 上，对该判定的影响远小于 4.5 与 3.26 之间的差距；但不声称这是审计级结论。
- **advisory 30 项（24–44px 的目标）未处理。** 24px 是 WCAG 2.5.8 (AA) 门槛，44px 是 2.5.5 (AAA)/移动最佳实践。
  为消掉 advisory 而把三套候选整体放大属于"没有真实缺陷却持续加固"（§9 禁止），故留作参考并上报。

## 8. 本机自身错误与更正

1. **证据守卫抓到了我自己。** 上一轮新增的 `evidence-check.mjs` 在我改颜色后立即报
   `EVIDENCE_POINTER_MISMATCH`（`51a499e3` → `fb363dea`）。这是设计预期，说明该守卫不是摆设；
   已重拍证据并 `--write`。
2. **我的首次 checkout 失败**（`unable to read tree`），因为我用了短 SHA 直连而没有先取对象；
   改用 `origin/ui/...` 引用后正常。记录以免他人重复。
3. **对比度修复的第一版曾把 C 改暗**（按浅色主题直觉），实测比值反而下降到 <3——随即改为变亮。
   这条错误本身值得留档：暗色主题的对比度方向和浅色主题相反。

## 9. 交给 Alien / Owner 的状态

```text
revision_head_sha（Alien 交付）  aea8361c07c003f6f519829b6c1a208c20bccab1
review_head_sha（本机复核产出）  2978e311959cffee40a172d0ea36e370e8ac59e7
review_repairs                   1 类系统性对比度缺陷（3 个 token + 2 个 A 专用色）
REVIEW_RESULT                    PASS_WITH_REPAIRS
```

- 本次复核**没有**改动任何业务语义、API、框架或生产 `apps/web/**`；改动仅在
  `apps/web/candidates/{a,b,c}/*.css`（颜色 token）、新增的复核探针、以及重拍的证据。
- 因为本机在复核中直接修复了范围内缺陷（§3 允许且要求），**修复后的头是 `2978e31`**；
  若后续需要第三台主机确认这些修复，请按其自身判断处理，本机不主张自己的修复已被独立确认。
- 复核完成后 UI-000 的"第二主机独立 review"门槛对**被采用的产物**成立，
  UI-101..103 的依赖随之满足（是否领取由各主机按 §2 自行判断）。

## Language reading link / 语言阅读链接

[Complete English reading translation / 英文完整阅读译文](./en/REVISION_REVIEW_REPORT.md)
