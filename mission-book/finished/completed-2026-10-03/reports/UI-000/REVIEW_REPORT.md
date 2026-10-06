# UI-000 — 独立复核报告（Host `Alien`）

> 常驻规则：[../../CONSTRUCTION_RULES.md](../../../../CONSTRUCTION_RULES.md)
> 工作书：[../../ui-civilization/UI-000-视觉方向候选与审美门禁.md](../../ui-civilization/UI-000-视觉方向候选与审美门禁.md)
> 过程数据规则：[../../PROCESS_DATA_POLICY.md](../../../../PROCESS_DATA_POLICY.md)
> 复核主机：`Alien`（Development 主机为 `Mech`，§3 双机独立满足）
> 复核结论头：`727a254acd3b6c1c8925dbf78b0630e1a1410f8a`

## 1. 身份与证据指针（§7 exact-head 校验）

```text
baseline                          e7c498f5acd86da324a45c3278219c8daa612561   (854/854 实测)
Development 声明头                 905e9ff97d21cd282601a819af1e69acc455af99   CI 36854042480 success
Development 追加修复头             6059252e318503fc3161235eb6099cf59ca34c61   CI 36855082899 success
Review 复核头（本报告结论头）      727a254acd3b6c1c8925dbf78b0630e1a1410f8a   CI 36855721920 success
repo 本地门槛（本机，复核头上）     859/859 pass
```

`recorded development_branch == evidence head_branch == ui/UI-000-visual-direction-candidates`；
Development 的 `development_head_sha` 与其 CI 的 `head_sha` 仍互相一致（§7 第 1 条成立）。

### 1.1 复核期间分支被 Development 主机推进（记录，不由 Alien 改写）

Alien 在 `2026-10-01T11:19:22Z` 领取 Review 后，Development 主机于 `11:23:28Z` 又向**同一分支**
推送了 `6059252 fix(ui-000): remove 17 dead controls and prove action parity by clicking`。
该提交自述为「Review of the candidates found 17 controls that rendered but did nothing」。

- 事实影响：工作书 `development_head_sha` 从此不再等于分支 tip；被复核的产物在复核窗口内发生了变化。
- Alien 的处理：**不 force-push、不改写他机字段**（§2/§12），而是 rebase 复核提交到新 tip 后
  **对整个新头从头重跑全部探针**（本报告所有数字均取自 `727a254`，其中包含 `6059252`）。
- 记录理由：这不仅是一次分支位移，也是一次**角色边界观察**——§3 规定独立复核必须由不同实体主机完成，
  而 `6059252` 的提交信息表明 Development 主机自己对候选做了 review 式修复。该提交在 CI 上是通过的
  （`36855082899`），且确实消除了 17 个空 handler 的假可点击面，**质量上是改善**；但「谁做复核」的
  边界仍然只由 Alien 本报告兑现。此处如实记录，供 Owner 判断是否需要把该行为写进常驻规则。

## 2. 独立性声明（先写探针，后看实现）

Alien 的探针计划写于 `2026-10-01T11:10Z`，**早于**该分支在 origin 上存在（当时 `ui/*` 远端引用为空，
见 `../DISPATCH_ALIEN_ZERO_CLAIM_2026-10-01.md` §7）。计划见
`.scratch/UI-000-review-probes.md`（Utopia 工作区）。探针实现
`scripts/ui-000/review-probes.mjs` 为 Alien 自写，**不是** `scripts/ui-000/parity.mjs` 的副本，
也不引用其断言。

复核刻意比 Development runner 更严格：

| 维度 | Development runner (`parity.mjs`) | Alien 复核探针 |
| --- | --- | --- |
| 产品事实 | `document.body.textContent`（含折叠/隐藏内容） | `document.body.innerText`（仅可见文本） |
| 技术字段 | 全文搜索，可达即过 | 默认视图**不得**可见；`revealAll()` 后必须可达 |
| 移动端 | 不测 | 390×844 逐 surface 测横向溢出与 24px 目标 |
| 覆盖率 | 不报告 | 报告 capability-probe 覆盖（29/29） |

## 3. 复核结论：6 条任务内复核标准

| # | 标准 | 结论 | 依据 |
| --- | --- | --- | --- |
| 1 | 三套是否真的不同，而非换色 | **通过** | 结构签名不同：a `NAV.switch`+`#root`+1 section；b `ASIDE.rail`+`main`+4 section；c `NAV.acts`+`main`+4 section；首屏 h1 文案、导航模型、版式均不同 |
| 2 | 是否都保留核心功能 | **通过** | capability 覆盖 29/29；Development 追加的 ACTION_PROBES 实测点击后事实成立（324/324，Alien 本地复现） |
| 3 | 是否仍有工程后台／监控大盘气质 | **部分通过（见 D2）** | a 与 c 首屏为主体化文案＋信息卡；**b 的首屏（主 surface）直接渲染 `task.completed` / `task.progress` / `node.heartbeat` 原始事件类型表并带逐行「检查器」** |
| 4 | 移动/桌面是否都可读 | **修复后通过** | 修复前 b/services@390 溢出 37px；修复后 `scrollWidth == clientWidth == 390`。另有 <24px 目标（D3） |
| 5 | 是否存在「AI SaaS 模板」式无个性复制 | **通过** | 三者视觉语言差异明显（a 暖色编辑风 / b 冷灰台账风 / c 暗色霓虹展示体），无共享模板骨架 |
| 6 | 技术细节是否默认降级而仍可访问 | **部分通过（见 D2/R2）** | a、c 把事件类型与 invocation id 放进默认折叠的 `<details class="technical">`；b 默认可见 |

## 4. 已修复缺陷（D1）——复核主机直接修复，均在 `727a254`，均已重测

### D1.1 parity 证据在本机不可复现（工具链缺陷）

`scripts/ui-000/parity.mjs` 原为 `chromium.launch({ channel: 'chrome' })`。本机（Alien）只装了 Edge，
没有 Google Chrome，runner 在**第一条断言之前**就抛错：

```text
browserType.launch: Chromium distribution 'chrome' is not found at
C:\Users\15601\AppData\Local\Google\Chrome\Application\chrome.exe
```

即「285/285」这条证据在一个没有 Chrome 的主机上完全无法复核。修复方式与仓库自带的浏览器测试一致
（win32 优先 `msedge`，并保留 `PLAYWRIGHT_CHANNEL` 显式覆盖）。修复后在本机复现成功：

```text
candidate a: 108/108   candidate b: 108/108   candidate c: 108/108   324/324 PASS
```

### D1.2 候选 b 在 390px 下整页横向溢出

`apps/web/candidates/b/b.css` 的 `table.data` 遇到不可断行的 token（capability id、digest）时无法收缩，
把整页撑宽。实测与修复：

```text
修复前  viewport.clientWidth=390  documentElement.scrollWidth=427   (溢出 37px，元凶 TABLE.data 398px)
修复后  viewport.clientWidth=390  documentElement.scrollWidth=390   (溢出 0)
```

## 5. 报告但不修复的发现（附不修复理由）

### D2 — Development 的 parity 模型无法证明「技术细节已降级」（false-success 路径）

同一批 token 同时被要求「在 surface 上可读」和「必须降级」：

```text
SURFACE_PROBES  services/capability-history  expect ['inv-2f10']          ← 要求可见
TECHNICAL_PROBES invocation-id               expect ['inv-2f10']          ← 要求降级
SURFACE_PROBES  services/capability-catalog  expect ['planning.knowledge.query']
TECHNICAL_PROBES capability-id               expect ['planning.knowledge.query']
```

因为 runner 读 `document.body.textContent`，**被折叠进 `<details>` 的值同样算“在 surface 上可读”**。
后果：Alien 的严格探针下，a 与 c 各 8 处「DOM 有、可见无」（`task.completed`、`node.heartbeat`、
`inv-2f10`，均位于默认折叠的 `DETAILS.technical` 内）而 **b 在这些点上“通过”是因为它把原始 token
直接显示出来了**——探针奖励了泄漏、惩罚了降级。

不修复理由：修这个等于改判「事件类型/id 算产品事实还是技术细节」，而这正是 Owner 要在 A/B/C 之间做的
方向选择；且 §8 明令禁止用「删断言/放宽门槛」换绿，两种方向的改法都会改变已声明的通过语义。

### D3 — 移动端 <24px 可点击目标（WCAG 2.5.8 AA）

实测（仅列失败项，24–44px 的 30 项只作参考）：a/activity 3；b 在 home/ask/tools/services/tasks/pairing/settings
共 6 处（含 5 个「调用」按钮）；c 在 services/tasks 共 2 处。工作书未规定无障碍门槛，故按发现报告，
不作为阻塞项。

### D4 — 原始技术标识符出现在默认路径

- 三个候选都在 **Services（高级 surface）** 默认显示原始 capability id。Alien 判断这属于可接受的解释边界
  （Services 本身就是「运行详情」面，facts.js 的 SURFACE_PROBES 也要求它有 id），**故不判为缺陷**，仅记录。
- b 进一步在默认路径显示 `tsk-9c41 / tsk-8b20`（任务 id）、`node-3f7a91c2`（节点 id）、`inv-2f10`、
  `sha256:6a1f…c93d`、`#41`（事件序号），其中 **activity 是主 surface**。这与 D2 同源。

### D5 — 探针 token 强度不足（方法论发现，供后续 workbook 采纳）

Alien 的第一轮探针把 `room-id` 的 token 设为 `'knowledge'`，结果命中的是英文句子
“Plain-text **knowledge** entries with search, tags and replace import.”，产生 3 条**假阳性**；
`'41'`、`'10'`、`'25'/'50'/'100'` 这类短 token 同样会偶然命中。已改用逐 surface DOM 定位复核后
才写入本报告。记录理由：这些 token 属 Development 的 parity 数据，说明「数字/单词型 token 通过」
不能单独作为能力存在的证据。

## 6. 已复核通过、无需处理

- **字形禁令**：`◈ ▦ ◇ ≋ ◉ ▤ ≣ ⊞ ⚙ ▣` 仅出现在 `icons.js` / `parity-probes.js` 的**禁用清单**里，
  渲染文本中 0 命中；`shared/icons.js` 是真实 SVG 集（24×24、currentColor、无 icon font）。
- **工程后台语汇**：默认视图 0 命中 `CONTROL SURFACE|WORKSPACE /|Reference implementation|backendRef|provenance|schemaVersion|apiVersion`。
- **生产隔离**：`apps/web/index.html`、`app.js`、`style.css`、`terminal.js`、`services.js` **零改动**；
  候选面独立存在于 `apps/web/candidates/`。
- **Android 发布面安全**：`CandidateGalleryActivity` 在主 manifest 中 `exported="false"` 且无 intent-filter，
  仅 debug source set 用 `tools:replace` 打开 `exported`，shipping 构建不可达。
- **Rooms 主题**：仅当 `?theme=a|b|c` 时注入，且只覆盖既有 CSS 自定义属性，行为不变。
- **运行时错误**：三候选 × 十 surface 的执行全程 `pageerror` 计数 0。

## 7. 披露（Disclosure）

1. **单主机复核？否。** Development = `Mech`，Review = `Alien`，§3 双机独立成立。Android 证据由
   Development 提供（`evidence/raw/mission-book/UI-000/android-candidates/*.png`），Alien **未在本机重跑
   Android 实机截图**；本报告不对 Android 真实渲染质量背书，只对代码层隔离性（D 节）背书。
2. **候选的“好/不好看”结论不属本报告。** 视觉方向选择是 `owner_gate: STYLE_SELECTION`，
   属 Owner，本报告只给可核对的差异事实与截图路径。
3. **原始证据位置。** Alien 的原始探针输出与本机截图位于复核主机
   `D:\utopia-ui000-review\.runtime\evidence\mission-book\UI-000\review-alien\`
   （git-ignored，按 `PROCESS_DATA_POLICY.md` 不提交 City）。本报告与随分支提交的
   `scripts/ui-000/review-probes.mjs` 是可复现入口。
4. **未做的事。** 未修改任何候选的信息架构或视觉方向（避免在 Owner 选择前替 Owner 做设计决定）；
   未改写 Mech 的 Development 字段；未 push 任何 force；未删除或放宽任何既有断言。
5. **本报告发现的自身探针缺陷已一并记录**（D5 与第一轮快照顺序 bug：早期版本把 `revealAll()` 之后的
   状态当成下一次「默认视图」快照，产生过一批假泄漏；已改为「先全量默认 pass、再全量 reveal pass」两遍式）。

## 8. 结论

**Review 通过，附条件：** 三套候选结构真实不同、功能覆盖率 29/29、生产面零污染、字形与后台语汇禁令
达标；两个已观测缺陷（证据不可复现、移动端整页溢出）已由复核主机直接修复并在 `727a254` 上重测，
`859/859` 本地门槛与 hosted CI `36855721920`（android + gateway-web）全绿。

交由 Owner 的下一步是 `STYLE_SELECTION`：A/B/C 三选一，或一句「都不好看」+ 原因。选定结果写入本任务
report 后，方可作为 UI-101/102/103 的唯一视觉方向来源。

---

# 9. Delta 复核（第二轮，Host `Alien`）

## 9.1 为什么需要第二轮

第一轮 Review 绑定 `727a254`。Mech 在其后推送了 `c03adf1`（集成修复）与 `01b4b87`（仅证据/工具链），
并主动把 delta 标记为 `post_review_delta_unreviewed: true`、请求「delta re-verification 或 Owner ruling」。
delta 含**真实产品源码变更**（契约修正、WCAG 修复、候选 B 主面渲染），未被第一轮覆盖，故由复核主机
自行领取复核（`review_delta_claimed_at = 2026-10-01T12:09:29Z`），无需上升到 Owner。

```text
product source under review   c03adf13bbdd64d74514534b1de1e61ce3a68c6a
pushed head (evidence+tooling) 01b4b87a8dc80ad40775816b61487483388c4277   CI 36857534408 success
delta review head              6edd10379b4dbe22caa89fb45287c836f91151bf   CI 36860281859 success
git diff c03adf1 01b4b87 -- apps services contracts tests city platform   EMPTY   （已独立验证）
git diff c03adf1 6edd103 -- apps services contracts city platform          EMPTY   （已独立验证）
```

## 9.2 独立复现 Mech 的声明

| 指标 | 727a254（首轮） | 6edd103（本次） |
| --- | ---: | ---: |
| strictVisibleFailures | 8 | **0** |
| tapTargets (<24px) | 10 | **0** |
| demotion（泄漏） | 18 | **0** |
| overflow / glyphs / consoleVocab / errors | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| capability coverage | 29/29 | 29/29 |
| Mech parity runner | 324/324 | **396/396 PASS** |
| repo 本地门槛 | 859/859 | **859/859** |

Mech 的声明全部复现。其中 8 条 `strictVisibleFailures` 是 Mech **改契约**（把原始内部词汇从
`SURFACE_PROBES` 移入 `TECHNICAL_PROBES`、新增 `LEAK_PROBES`）而不是改探针消掉的——方向正确。

## 9.3 余下 17 条的裁决：缺陷在**复核主机**，不在候选

本轮逐条把命中追溯到具体文本节点与祖先链后才裁决（不是照着 Mech 的 handoff 抄结论）：

| 类别 | 条目 | 裁决 | 证据 |
| --- | --- | --- | --- |
| 子串误报（我的探针） | `room-id "knowledge"` ×3 | **probe 缺陷** | 命中的是 `.room-summary` / `.cell-note` / `.poster-note` 里的英文散文 "Plain-text **knowledge** entries…"；真正的 slug 位于**默认折叠**的 `DETAILS.tech/technical` 内，即已正确降级 |
| 子串误报（我的探针） | `room-number "10"` ×3 | **probe 缺陷** | 命中的是房间**数量**文案（"本地房间 · 10 个" / "10 个本地房间" / 标题 `10`） |
| 高级面解释分歧 ×8 | a/c `capability-id`、b `capability-id`/`invocation-id`/`result-digest`/`task-id`×2、c `result-digest` | **候选无缺陷** | 全部位于 advanced surface（services / tasks）。本报告 §3 D4 已裁定「高级面本身就是折叠目标」，探针把默认路径准则套到高级面，与自己的裁决矛盾 |
| 可达性绑定 ×1 | `c/gateway-endpoint` | **probe 过严** | C 的端点确实可达，只是在 Settings。技术值的可达性应绑定**整个候选**，产品事实才绑定声明面 |
| 契约定义 ×2 | `room-number "01"`（b/c） | **裁定为产品序数** | UI-000 硬规则列举的是「内部模块名、ID、route、backendRef、provenance、schema/version、runtime path」。房间**展示序数**不是其中任何一项；内部标识是 slug，而 a/c 已把 slug 正确折叠 |

**结论：余下 17 条没有一条是候选的产品缺陷。** 其中 15 条是复核主机探针自身的缺陷/过严，
2 条是一个契约定义裁定。

## 9.4 因此做出的两处探针修正（并证明没有变空）

1. **泄漏检测改为匹配标识符形状**，不再用 `includes(token)`：`tsk-` / `node-` / `inv-` / `act-` /
   `sha256:` / `#seq` / `backendRef|apiVersion|…` / 原始事件类型 / capability id / loopback 端点 /
   多词 slug。这比原来的子串法**更强**：原 token 表从来没有覆盖过「主面出现 capability id 或原始事件类型」。
2. **泄漏范围收敛到 5 个 primary surface**（依 D4 裁决）；技术可达性改为全候选范围。

**反空证明（mutation test）**：把候选 B 的 Home 改回渲染 `e.type` 后，探针精确报出
`b/home: raw-event-type leaked on the primary reading path ("task.completed")`，且仅此 1 条；随后 revert，
工作树干净。因此修正后的探针不是「因为删了断言才全绿」。

发现真实缺陷的那份严格性并未被削弱：它现在位于**产品事实可见性**这一遍（产品事实必须在自己声明的
surface 上可见）——正是这一遍抓出了 Mech 自相矛盾的 `SURFACE_PROBES` 契约。

## 9.5 本轮仍未改的东西（边界）

未修改任何候选的信息架构或视觉方向；未改写 Mech 的 Development 字段；未 force-push；
未降低任何既有 gate。`render-for-owner.mjs` 与修正后的 `review-probes.mjs` 随分支提交，作为可复现入口。

## 10. Owner 门禁未变，另附两个可选裁决项

`owner_gate: STYLE_SELECTION` 仍然只属于 Owner，Alien 不代选。除此之外，本轮还留了两个**可选**的
Owner 判断（都不阻塞，也不影响 A/B/C 的可比性）：

1. **移动端 24–44px 的 30 处 advisory**：24px 是 WCAG 2.5.8 (AA) 门槛（已全部达标），44px 是 AAA /
   移动最佳实践。是否提升到 44px 会明显改变三套的视觉密度，故按 §9「不做防御性膨胀」交 Owner 审美判断。
2. **`room.number` 的归类**：Development 的 `facts.js` 把它列在 `TECHNICAL_FIELDS`，而本节裁定它是
   产品序数。这不构成硬规则违反（候选 a 不显示序数、b/c 显示，属设计差异），如需统一可在 UI-101..103
   一并处理。

