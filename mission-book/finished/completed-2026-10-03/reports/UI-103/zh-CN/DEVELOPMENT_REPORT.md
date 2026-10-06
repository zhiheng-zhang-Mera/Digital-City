# UI-103 — 开发报告

[Authoritative source / 权威原稿](../DEVELOPMENT_REPORT.md)

Complete historical reading translation; no new authoritative fields or acceptance verdict. / 完整历史阅读译文，不产生新权威字段或验收结论。

```text
MISSION                    = UI-103 (Rooms 统一视觉与嵌入体验)
PHASE                      = UI_CIVILIZATION
REPORT_ROLE                = DEVELOPMENT
HOST                       = Mech
BASELINE_POLICY            = CLAIM_TIME_MAIN
BASELINE_SHA               = e7c498f5acd86da324a45c3278219c8daa612561
BRANCH                     = ui/UI-103-rooms-visual-unification
HEAD_SHA                   = 399a1c118fa0016e7f30ce8f0e3ba01917b39db1
DEVELOPMENT_CI             = 36866763373-success-android-and-gateway-web
VISUAL_DIRECTION_SOURCE    = mission-book/reports/UI-000/OWNER_STYLE_RULING.md (adopted C2)
DEVELOPMENT_COMPLETE       = true
REVIEW_HOST                = not claimed (see §7)
```

原始身份块绑定 UI-103、UI_CIVILIZATION、Development 主机 Mech、CLAIM_TIME_MAIN 基线、完整 baseline/head SHA、分支、CI、采用 C2 的视觉方向来源、development_complete=true 和尚未领取的 Review。

## 1. 塑造任务的工程决策

UI-103 禁止“逐个房间复制一套独立 CSS”。动笔前我检查该约束是否可满足，结果明确可以：

```text
var(--  occurrences across apps/rooms/rooms/**/client.mjs and shared/client-kit.js  =  0
```

原块记录所有房间 client.mjs 和 shared/client-kit.js 中 var(-- 出现次数为零。apps/rooms/hub/public/hub.css 是 apps/rooms 唯一样式表，每个 Room 仅用其共享 classes。因此移植采用方向只是**单文件 token + 共享原语变化**，十个 Room **无需任何模块修改**即可继承。

关键设计是 token **名称**沿用旧 palette（--bg、--panel、--panel-2、--line、--text、--muted、--accent 等），仅修改值及其原语。改名会迫使修改十模块而无产品收益。

## 2. 修改内容

| 区域 | 修改 |
|---|---|
| Tokens | 采用 C2 值：--void/--bg #08070f、--panel #14121f、--panel-2 #1b1830、紫罗兰结构 #8b5cf6、青柠信号 #c6f24e、全息青 #5ee7ff |
| --muted | 重新推导而非复制；需在新面板维持 AA，测得 panel-2 4.93:1、panel 5.28:1 |
| HUD 原语 | 切角面板/按钮（clip-path、radius 0）、角括框、发丝紫罗兰边框、宽字距大写微标签、分段 stat 填充、淡扫描线；全部 CSS 盒绘制，不用字符图标 |
| Shell | rail 为 UTOPIA / ROOMS / 本地工具；status 为 10 个本地工具 · 已就绪；room pill 为 会保存在本机 |
| Diagnostics | LOCAL · 127.0.0.1、监听 origin、runtime 目录、room-pack 版本移入默认折叠运行详情 |
| Embedded | embedded=1 去掉 hub 自己的 rail，由 Web shell 负责 chrome |
| Favicon | 新增；此前每次加载 favicon.ico 均 404 |

runtime 路径值得指出：此前 hub 将 persistent · .runtime/knowledge.json 当产品副标题打印。UI-103 明确禁止，于是副标题改为会保存在本机，路径移入 diagnostics。

## 3. 验证

专为任务编写 scripts/ui-103/verify-hub.mjs。风险是**十房间回归**而非缺功能，所以探针在真实浏览器挂载全部房间，并逐房间断言：

```text
rooms mounted                              10/10
page errors                                0
console errors                             0
dev-tool strings on the default path       0   (ROOM PACK V1 / 127.0.0.1 / .runtime-rooms/ / persistent ·)
diagnostics present and collapsed          yes (all 10)
WCAG AA contrast failures on the hub       0
```

原结果：10/10 挂载，页面和 console 错误零，默认路径开发工具文字零，十间均具备默认折叠 diagnostics，hub AA 对比度失败零。

逐房间 mounted nodes：knowledge 44、bookmarks 45、checklist 37、prompts 49、text-workshop 38、hash 23、data-lab 23、focus 43、calendar 51、decisions 65。每间渲染真实交互内容，无 error banner 回退。

```text
node --test "apps/rooms/tests/*.test.mjs"   69/69
node --test "tests/*.test.mjs"              854/854
node scripts/check-bilingual.mjs            docs / evidence / data-records = SYNCHRONIZED
hosted CI 36866763373                      success (android + gateway-web)
```

原块记录 rooms 69/69、repo 854/854、双语检查 SYNCHRONIZED、hosted CI 36866763373 android + gateway-web success。

代表房间 Knowledge、Checklist、Data Lab、Focus 在 1440×960 与 390×844 捕获，位于 evidence/raw/mission-book/UI-103/。

## 4. 两项明确记录的决策

### D1 — embedded-mode 接缝未关闭，也不声称关闭

UI-103 要求 Web iframe 嵌入读作同一产品。Rooms 侧现提供显式可测机制 embedded=1，但让 apps/web 实际请求它属于 UI-101；apps/web/** 不在 UI-103 允许修改的 apps/rooms/** presentation 边界。根据 §10，**deferred ≠ passed**：

```text
pending_seam: apps/web terminal.js's room iframe must append ?embedded=1 to the hub URL
owner_of_seam: UI-101 (Web product shell)
status: mechanism provided and verified on the Rooms side; consumer side not wired
```

原接缝块记录：Web terminal.js 房间 iframe 应给 hub URL 附 embedded=1；owner 为 UI-101；Rooms 提供并验证机制，消费端未接线。

我有意不跨进 apps/web 关闭它；这样做会为了让本地 demo 看起来完成而越过工作书边界。

### D2 — 在新 palette 测量对比度，而非假定

采用方向是暗色霓虹，restyle 易交付不可读次要文字；这正是 Mech 在 UI-000 修订复核修复的缺陷（267 元素低于 AA）。所以针对新 panel 值重新推导 --muted，探针断言 AA 失败零。brand mark 渐变下也加 solid background-color，渐变不可用仍可读且可测。

## 5. 边界：未做的事

- **未改 Room 模块。** 无 persistence/API/store/房间语义变化，69 room 测试未修改且通过。
- **无逐房间样式表。** 唯一共享样式表就是全部机制。
- **无框架引入。** Web/Rooms 仍 Vanilla HTML/CSS/JS。
- **未改 apps/web/**：见 D1。
- **未在此验证 Web/Android 跨端视觉一致。** 门要求 hub 与两端一致，但 Web 属 UI-101、Android 属 UI-102，跨检查属 UI-190。本报告只声称 hub 带有采用的 token 方向，不声称三端已一致。

## 6. 证据指针

```text
Utopia branch            ui/UI-103-rooms-visual-unification
Utopia head              399a1c118fa0016e7f30ce8f0e3ba01917b39db1
Utopia CI                36866763373 (android + gateway-web, success)
Published evidence       evidence/raw/mission-book/UI-103/            (8 PNG, 1.04 MB)
Full raw run             .runtime/evidence/mission-book/UI-103/       (git-ignored)
Verification probe       scripts/ui-103/verify-hub.mjs
```

原块绑定分支、完整头、CI、已发布八 PNG / 1.04 MB、git-ignored 完整 raw run 和验证探针路径。

## 7. 状态及 Review 解锁条件

```text
DEVELOPMENT_COMPLETE   = true
REVIEW_HOST            = unclaimed — must be a host other than Mech (§3)
```

§3 要求不同实体主机复核，Mech 不能领取。Mech 处于 WAITING_ELIGIBILITY：UI-101/UI-102 sibling Development 尚未领取，UI-190 需要三者，RS-*/UXI-* 在下游。

请复核者重点挑战：(a) 共享原语是否真正避免十房间分歧，而非仅四个截图；(b) HUD 是否伤害密集工作流人体工学，如 Data Lab textarea、Prompts 长列表；(c) 将 127.0.0.1 移入 diagnostics 后，本地限定安全属性是否仍足够容易发现。
