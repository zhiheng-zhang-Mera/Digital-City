# UI-000 — 开发报告

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

完整历史阅读译文，不产生新权威字段或验收结论。 / Complete historical reading translation; no new authoritative fields or acceptance verdict.

```text
MISSION                    = UI-000 (视觉方向候选与审美门禁)
PHASE                      = UI_CIVILIZATION
REPORT_ROLE                = DEVELOPMENT
HOST                       = Mech
IMPLEMENTATION_REPO        = zhiheng-zhang-Mera/utopia
CONTROL_REPO               = zhiheng-zhang-Mera/Digital-City
CONSTRUCTION_RULES         = mission-book/CONSTRUCTION_RULES.md (current head)
BASELINE_POLICY            = CLAIM_TIME_MAIN
BASELINE_SHA               = e7c498f5acd86da324a45c3278219c8daa612561
BRANCH                     = ui/UI-000-visual-direction-candidates
HEAD_SHA                   = c03adf13bbdd64d74514534b1de1e61ce3a68c6a
DEVELOPMENT_CI             = 36856637359-success-android-and-gateway-web
FIRST_HEAD_SHA             = 905e9ff97d21cd282601a819af1e69acc455af99
FIRST_HEAD_CI              = 36854042480-success-android-and-gateway-web
REVIEW_HOST_HEAD_SHA       = 727a254acd3b6c1c8925dbf78b0630e1a1410f8a
REVIEW_HOST_HEAD_NOTE      = Alien's independent review commit; preserved as an ancestor of HEAD
CLAIMED_AT                 = 2026-10-01T20:30:19Z
DEVELOPMENT_COMPLETE       = true
REVIEW_HOST                = Alien (claimed; see §10)
OWNER_GATE                 = STYLE_SELECTION (waiting, see §9)
```

原始身份块保留任务、阶段、角色、Mech 主机、实现与控制仓库、规则、基线政策及 SHA、分支、各次 head/CI、Alien 独立复核提交、领取时间、开发完成、Review 已领取及 Owner STYLE_SELECTION 等待状态。此读本不生成新的权威字段。

> HEAD_SHA 是当前 Development 头。分支移动三次均记录而未重写：905e9ff（第一头、CI绿）→6059252（移除17死控件，§4 D9）→727a254（Alien独立复核：两修复及自己的探针）→c03adf1（契约矛盾与WCAG目标，§10）。链线性，每个已发布旧头均为当前祖先，全程无force-push。任务视为可复核前，在§7a控制面对账重新核验 DEVELOPMENT_CI。

## 1. 任务实际交付什么

CONSTRUCTION_RULES §2 规定工作书frontmatter唯一领取真值。UI000要求三件易伪造却难诚实完成的事：

1. 当前产品真实功能/信息地图；
2. 结构和视觉均不同、承载相同功能事实的三候选；
3. 可运行的证明，而非moodboard。

交付：

| 交付物 | 位置 |
|---|---|
| 规范功能/信息地图机器版 | apps/web/candidates/shared/facts.js |
| 可读地图 | apps/web/candidates/README.md §2 |
| A Halo/随行 | apps/web/candidates/a/ |
| B Atlas/工作台 | apps/web/candidates/b/ |
| C Prism/剧场 | apps/web/candidates/c/ |
| 真实SVG图标，替代◈ ▦ ◇ ≋ ◉ ▤ ≣ ⊞ ⚙ ▣ | shared/icons.js |
| 一致性契约：29能力、20降级技术字段、7动作 | shared/parity-probes.js |
| 一共享本地模型供全部控件 | shared/runtime.js |
| 真实浏览器一致性runner | scripts/ui-000/parity.mjs |
| 截图harness | scripts/ui-000/screenshot.mjs |
| Android Compose代表screen | apps/android/app/src/main/java/city/utopia/control/ui000/CandidateGallery.kt |
| Android捕获harness | scripts/ui-000/android-screens.mjs |
| 真实hub/rooms候选theme | apps/rooms/hub/public/themes/{a,b,c}.css |
| CI候选契约test | tests/ui-000-candidates.test.mjs |
| 有界已发布证据 | evidence/raw/mission-book/UI-000/ |

表中 shared/ 均相对于 apps/web/candidates/。

## 2. 已构建的功能/信息地图

侦察读取全部8个apps/web文件、全部Android main源、rooms hub/shared/十room模块和Gateway room client。

**当前一级导航9项，三端核验：**

```text
Web      : Home · Rooms("Tools / Rooms") · Devices · Activity
           Advanced: Services · Tasks · Actions · Pairing · Settings
Android  : Home ◈ · Ask ❯ · Rooms ▦ · Action ≣ · Devices ◇ · Services ◉ · Tasks ▤ · Activity ≋ · Settings ⚙
           (+ a 10th reachable page `Find` with no bar item)
Rooms    : 10-room rail + one stage; no search, no filter
```

问题不在颜色，而在内部工程结构投射到产品：WORKSPACE/ALIEN、CONTROL SURFACE、任务id、event#seq、roomid/number、capability/invocationids、digests、backendRef/resultRef/provenance、apiVersion/schemaVersion、hubURL、raw lastCheckpointJSON都在默认路径打印。图标为Unicode几何字形；Android无theme文件，仅设约30M3颜色角色的3个，无暗色；Hub仅硬编码#0c1016+#5ec8f2暗方案。

**规范能力模型：**5primary+5advanced，29能力，20技术字段必须可达但离开阅读路径。

## 3. 三候选

| 项 | A Halo/随行 | B Atlas/工作台 | C Prism/剧场 |
|---|---|---|---|
| 导航 | 无导航，底部omnibox为主轴 | 对象rail机器/工具/作业/记录，非页面 | 大字acts+后台drawer |
| 结构 | 单760px列、发丝线、timeline rail | rail+canvas+inspector三域 | 不等海报deck、full-bleed spotlight |
| 视觉 | 暖纸、衬线display、terracotta | 冷中性、1pxgrid、近方角、mono数字 | 暗色、紫罗兰+青柠、层叠面 |
| 技术详情 | 行内details运行详情 | 默认关闭inspector | 每海报details |
| 指标 | #fbf8f3/#b4502a/r8 | #f6f7f6/#1f4ed8/r2 | #0a0912/#8b5cf6/r18 |

三降级机制有意不同：技术详情如何隐藏，正是Owner正在选的架构决策。

## 4. 工作书未规定处的决策

Owner要求未指定处选最佳方案，记录问题、选择、推理。以下为全部。

### D1 — 如何证明三套共享同功能事实

- 问题：三个手写UI的属性，目测易腐化，相同页数什么也不证明。
- 选项：依赖独立review；每候选手写能力list；真实浏览器驱动并探测事实。
- 选择第三。shared/parity-probes按能力声明surface及必须出现literal；parity在Chrome渲染每候选每面检查。
- 理由：手写list不是DOM证据，会撒谎。真实探针漏值即失败；契约test还要求每能力都有probe，覆盖不能悄缩。
- 结果324/324，每候选108。

### D2 — 会惩罚正确降级的探针

- 问题：最初probe同一类。B合理把技术值放inspector，textContent没有而失败，是会迫使向产品泄漏的false negative。
- 选项：放宽直到绿；要求全值primary；分两类契约。
- 选择分两类。SURFACE_PROBES产品事实必须原样在surface可读；TECHNICAL_PROBES只需可达。每候选revealAll展开每披露、打开每可开row inspector，等同reviewer手动操作，再查揭示DOM。
- 理由：符合“默认折叠高级/运行详情”，折叠而非删除，不发明更严规则。删除值失败，正确隐藏通过。

### D3 — Room代表页如何保持真实

- 问题：每候选Room代表页，不能第二套Room实现。
- 选项：同hub截三次叫theme；三fake页；用hub现CSS变量。
- 选第三，themes/a,b,c覆盖hub.css已有root tokens，仅theme查询参数加载。
- 理由：接缝已存在，不动模块/markup/API。截图真实Knowledge及真实存储数据，是不提前做UI103下最强证据。契约test固定theme只restyle。

### D4 — Android真实Compose还是高保真prototype

- 问题：允许真实code或可运行高保真，Android构建启动贵且未保证。
- 选项：三HTML标Android；真实Compose无截图；真实Compose+真实模拟器捕获。
- 选第三。HTML会误表结构最差的端，九nav/glyph/noTheme；验证离线build可用，所以诚实方案存在。
- 如实成本：JAVA_HOME不存在，PATH JDK26被AGP8.11拒绝；可用JDK为D:\GDPR-Refine\.tools\jdk-17.0.20.1+1。SDK无cmdline-tools/avdmanager，手写%USERPROFILE%\.android\avd\utopia36*；WHPX可用。两harness及AVD配方记录证据README。

### D5 — 导出候选Activity

- 问题：adb am start不能启动nonexported，android:exported=false下无法捕获。
- 选项：main manifest导出；MainActivity extra渲染；debug sourceset覆盖。
- 选第三，debug manifest tools:replace android:exported。Release仍封闭，仅debug启动。第二会为暂时gate修改shipping导航，§9禁止。

### D6 — raw证据量

- 问题：80截图6.06MB进控制repo违反PROCESS_DATA不当raw仓库，但视觉Owner无图不可裁决。
- 选择完整run留gitignored runtime Layer1；精选23文件2.79MB入evidence/raw带逐图README；harness默认写ignored区。
- 理由：Owner/reviewer可从repo裁决，控制面有界。

### D7 — 候选清理契约

- 问题：不长期留三候选未给机制。
- 选择三处声明temporary：README/Android头/manifest注释。契约test在树已删且production shell干净时skip；树删而shell引用仍在，或树在而shell污染则fail。
- 理由：清理不能永久红suite，也不能半清理悄pass。

### D8 — 放宽token的判断，标记供reviewer挑战

两token接受family非单literal：tools/room-availability用运行，因为各方向措辞不同；event-seq用41无#，因为A不前缀。都有TECHNICAL_PROBES固定具体值，真实丢失仍失败。

### D9 — 无动作控件是缺陷，不是prototype捷径

- 问题：首头已发布且CI绿后，Mech自检发现三方向17控件渲染但onclick空：room/hub打开、invoke、demo-task、cancel、pairing生成、token替换。全在契约盲点：只证事实显示，未证事实产生。
- 选项：prototype留下；删不工作控件；全部真实行为且parity证明。
- 选第三。第一最糟，dead button是假可供性，将删除的功能表现为存在，正是同事实规则要阻止。第二删功能求整洁，§9禁止；第三唯一使相似声明机器可测。
- 未留reviewer：复核可修in-scope，但明知缺陷发布、指望reviewer抓不是完成门。
- 成本：先建shared/runtime，分别实现会漂移，使行为parity成第三不可证声明。三者import一确定性本地模型。
- 揭示两真实parity gap，不仅deadcode：B根本无per-room打开，A无hub打开，均新增。证明修复非cosmetic。
- 新检查：ACTION_PROBES按标签click并assert产生事实；openRoom/openHub还断言window.open真实targetURL，而非仅renderedtext。test禁止空handler回归，要求每runtime.ACTIONS有probe。

## 5. Development主机实际验证

```text
node --test "tests/*.test.mjs"            -> tests 859 | pass 859 | fail 0
node --test "apps/rooms/tests/*.test.mjs" -> tests  69 | pass  69 | fail 0
node city/test-all.mjs                    -> fail 0 (7 skipped by design)
node scripts/check-bilingual.mjs          -> docs / evidence / data-records = SYNCHRONIZED
node scripts/verify-promotion-history.mjs -> 10 record(s) verified at e7c498f5acd8
node --test tests/ui-000-candidates.test.mjs -> tests 5 | pass 5 | fail 0
node scripts/ui-000/parity.mjs            -> 324/324 probes, PASS (a 108, b 108, c 108)
apps/android: gradlew.bat --offline :app:testDebugUnitTest :app:assembleDebug -> BUILD SUCCESSFUL
```

parity每候选四遍：surface事实、revealAll后降级值、Ask/Do状态、D9后七action真click。

CANDIDATE_SHOTS：每候选1440×960和414×896跨十surface，无pageerror，加Cspotlight。三候选emptyhandler剩0。

## 6. 有意未做的边界

- 产品行为不变：无API/protocol/DTO/scheduler/Gateway/Room语义，services/contracts未动。
- 无框架迁移：Web/Rooms Vanilla，Android ComposeM3。
- 未选候选，Owner gate不可抢先。
- 未重写production Web/Android/room样式：归UI101/102/103；winner须在工作书边界重新实现，不能重命名本树。
- Mech未复核，§3双机，§9无虚构第二机。
- 不声称真实跨设备/provider/login接受或超设计实现的accessibility符合。runner证事实存在及产生，不证usability。
- 不声称动作是真实Gateway。runtime是本地确定模型；room/hub真实跳真实deep link，但invoke/demo/cancel/pairing/disconnect本地模拟状态，不调api/v0。live wiring归UI101..103，勿误认为集成client。

## 7. 证据指针

```text
Utopia branch            ui/UI-000-visual-direction-candidates
Utopia head              6059252e318503fc3161235eb6099cf59ca34c61
Utopia head CI           36855082899 (android + gateway-web, success)
Superseded head          905e9ff97d21cd282601a819af1e69acc455af99 (CI 36854042480) — see D9
Published evidence       evidence/raw/mission-book/UI-000/            (24 files, 2.80 MB)
Full raw run             .runtime/evidence/mission-book/UI-000/       (80 files, 6.06 MB, git-ignored)
Parity report            evidence/raw/mission-book/UI-000/parity-report.md
How it was produced      evidence/raw/mission-book/UI-000/README.md
```

## 7a. 交接前§7对账

```text
recorded branch == evidence head_branch     ui/UI-000-visual-direction-candidates                          OK
recorded head   == evidence head_sha        c03adf13bbdd64d74514534b1de1e61ce3a68c6a                     OK
required terminal state == evidence conclusion  run 36856637359 == success (android + gateway-web)       OK
```

无EVIDENCE_POINTER_MISMATCH。本任务两次stale pointer：905e9ff（§8第6），以及parity写到不再发布路径，使已发布285/285而真实390/390（§10）。均发现纠正而非留下，正是§7目的。

## 8. 本机错误披露：已发现并修复

记录是工作书要求，也因两项实质重要。

1. el helper从未render text，text属性被输出为HTML attribute非content。首parity用innerText+innerHTML查，token匹配attribute，A81pass。改textContent降9/95暴露；否则missinglabels配green会shipping。三候选修。
2. 17空控件：先见Croomposter重开自己页，实际三者17。首CI绿因为只显示未产生。D9全修，暴露B无room/A无hub；905e9ff被6059252取代。
3. BAtlas Android行value在label前，像尾注；改label先。
4. 两failure是我非产品。fresh worktree capability-adapters/city-roads CORRUPT_INPUT，baseline main pass，adapter指mammoth不能load需pnpm city install。CI装依赖而worktree缺；首次Copy-Item破pnpm symlink，junction修。环境。
5. 两Android错误截图尝试：三splash，再三同方向，才找到exportedfalse、instance复用、首frame约23秒、ANRdialog；harness现编码四原因。
6. 报告HEAD一度stale，D9后905→605，§7a抓并纠正，不留给reviewer。

## 9. Development后状态及Review解锁

```text
DEVELOPMENT_COMPLETE      = true
REVIEW_HOST               = Alien (unclaimed)
OWNER_GATE                = STYLE_SELECTION (unresolved)
```

§3要求不同实体机；此机Mech不能复核。§5将Mech列暂不可领取/等待资格，而非pool终态或结构性不合格：

```text
pool_incomplete              = true
claimable_now                = 0 on Mech
potentially_claimable_later  = true
classification               = TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY
structural_ineligibility_reason = null
global_external_blocker      = null
wake_condition               = UI-000 Review completed by Alien, or an Owner STYLE_SELECTION ruling,
                               or a new eligible claim appearing in the global scan
rescan_after                 = ~20 minutes (liveness fallback only)
terminal_reason              = null
```

UI101/102/103依赖UI000，Owner选方向前任何host不可claim。按§4开发机继续全池扫描，不在本任务闲置。

## 10. Review集成：§3双机纪律实际执行

Alien领取并推727a254，独立复核含两修复及自写review-probes（分支在origin出现前编写）。比Development更严：产品事实visible，技术reachable，水平overflow/tap-target测量，coverage报告。

### 10.1 Alien两修复均是本机真实缺陷

1. parity硬编码chrome，只有Edge的host首assert前死，首285/285不跨机可复现。我混“本机运行”与“可复现证据”。保留Alien fallback。
2. Btable被不可断token撑宽，390viewport scrollWidth427，溢37。我截414而从未量scrollWidth，自己证据看不到。

开发自身验证均未抓。双机规则体现真实作用，是本报告纪律实质而非仪式的最强证据。

### 10.2 Mech集成头依据Alien probe行动

两机贡献保留，727a254为c03adf1祖先，Alien probe未变。

```text
Alien's review-probes.mjs       727a254 (Alien)   c03adf1 (integrated)
strictVisibleFailures                    8              0
tapTargets                              10              0
overflow / glyphs / consoleVocab     0/0/0          0/0/0
capability coverage                  29/29          29/29
TOTAL FAILURES                          35             17
```

- strictVisible8→0：根是Mech契约矛盾，SURFACE要求原type/id Home/Services可见，UI000却折叠；契约命令违规。改产品可读事实（activity时间、invocationhistory状态），raw移TECHNICAL仍查可达。也暴露Bprimary raw task.completed，现可读事件加inspector raw。
- tapTargets10→0：390下text/tiny-link<24是真WCAG2.5.8违规。三方向该class最小高度修hitarea，不改方向。

### 10.3 剩17不由Mech悄解决

无一无条件产品缺陷：6probe falsepositive、8advanced解释分歧、2契约定义、1reachability绑定。逐项证据在 [HANDOFF_MECH_TO_ALIEN_REVIEW_FINDINGS.md](../HANDOFF_MECH_TO_ALIEN_REVIEW_FINDINGS.md)，请review/Owner裁决。Mech未弱化probe或重定契约使消失，因为改probe/contract/scope均在review/Owner权限。

例：a roomid knowledge实际命中room prose Plain-text knowledge entries；a number10命中10个房间总数。全页子串不能分id/单词。Mech LEAK选text-workshop/data-lab等散文不会出现slug避免。

### 10.4 Mech承诺

除CI红或review/Owner要求，不再做UI000 Development变化。历史线性无forcepush：905e9ff→6059252→727a254(Alien)→9c22dc0→c03adf1。
