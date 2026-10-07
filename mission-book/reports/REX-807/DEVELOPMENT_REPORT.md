# REX-807 开发报告（增量 1）/ Development report, increment 1

```text
TASK_ID            REX-807 Research Control Surface + Progressive Disclosure
ROLE               Development（增量 1：组件范围；**尚未接线**）
HOST               Mech（COMPUTERNAME MEGA-REP，role Mech-DS）
BRANCH             rex/REX-807-mech-research-control-surface
BASELINE           12e3d3bf868575a8e3cda983733a3186cb59da27（= origin/main；依赖并集实测 = main）
HEAD_SHA           b06e978fb1c6578305ba485445992d3a1d82913f
CI                 V0.2 checks run（见下；结论以仓库 Actions 为准）
DELIVERABLES       apps/web/research-surface.js（新增，纯视图模型）
                   tests/rex807-surface.test.mjs（新增，7 项）
```

## 1. 先测再写：缺口是什么

```text
实测（baseline 12e3d3b）：apps/web/research.js 是**扁平技术面板** —— 一个 manifest JSON textarea、
「仅验证 / 登记」两个按钮、把结果原样 `JSON.stringify` 打印。Research 功能**能用**，但要靠读标识符与完整配置，
没有任何分层、没有用户语言摘要、raw id 直接出现在主标签里。
因此本任务的缺口不是「再加功能」，而是**把已有的东西分成层**：
  DIRECT_CONTROL    创建/开始/停止/重放/导出 —— 主操作区，默认展开
  ADVANCED_CONTROL  故障注入 —— Danger Zone，默认折叠且**必须确认**
  OBSERVABLE        当前运行/进度/指标/排除项 —— 用户语言，默认展开
  INTERNAL_ONLY     采集器内部缓冲 —— **不进 UI**
```

## 2. 交付：把「分层」变成数据而不是约定

`apps/web/research-surface.js`（纯函数，无 DOM，可在 node 下测试）：

```text
· researchView(payload, {locale, primarySurfaces}) 产出 entry / alerts / sections / defaultOpen / confirmationRequired。
· 标识符**折叠而不删除**：完整 manifest 与运行记录进 collapsed 的 Technical details；主标签是**人话摘要**
  （`summariseExperiment` 用 question 作摘要，id 只作引用）。
· **重要的东西不许被藏起来**：存储不可用、读不出的记录、排除项、未测量指标、以及**未结清的运行**，
  各自变成 `visible: true` 的 alert 并**带上原因**（不是空列表、不是只给数字）。
· **未知字段不许静默消失**：payload 里本视图还没归位的字段会列进 `unmappedFields` 并在技术层写明，
  这样网关新增字段会**变得可见**，而不是被吞掉。
· 故障注入落在 `advanced-faults`：collapsed + requiresConfirmation + **具体的确认语**（要求输入 campaign id）。
· 运行/停止按钮按状态给：有运行在跑就不给 Start、给 Stop。
```

`tests/rex807-surface.test.mjs`：工作书「必须验证」逐条对应的 7 项守卫 —— S1 主标签不得泄漏 UUID 且技术层默认折叠、
S2 危险区必须确认且默认不展开、S3 错误/排除/不完整指标可见并带原因、S4 未归位字段被报告、S5 入口是次级且主面干净
（`assertPrimarySurfacesClean` 对 `home/ask/devices` 通过、对含 `research` 的主面**抛错**）、S6 INTERNAL_ONLY 不暴露控件、
S7 zh-CN 真实翻译而非英文回退。

## 3. 证伪（7 处突变，全部被抓住）

```text
N1 用 id 当主摘要 → S1 红        N2 技术层默认展开 → S1/S5 红     N3 故障注入无需确认 → S2 红
N4 丢弃未归位字段 → S4 红        N5 主面守卫失效 → S5 红          N6 不提示未结清运行 → S3 红
N7 zh-CN 回退英文 → S7 红
每处按字节还原（sha256 一致），还原后 7/7。相邻 Web 套件（terminal shell 15、i18n、scheduler adapter）保持绿。
```

## 4. 未完成（下一增量）

```text
· **尚未接线**：research.js 仍渲染旧的扁平面板。下一增量用本视图模型重建该面板（分层区、折叠技术层、
  危险区确认交互），并在真实浏览器路径上验证（不是只测纯函数）。
· Advanced/Technical Details 的交互细节（confirm 输入校验、折叠状态记忆）与 **Android 观察面**
  （至少 run/status/关键 attention）未做。
· 工作书要求的「Review 用普通用户路径寻找隐藏入口、假按钮、过度折叠、信息不足与视觉过载」属复检方动作；
  本机只提供组件证据与守卫。
```

## 4. 增量 2（head `05ca33e`）：页面真正渲染这一层

```text
apps/web/research.js 重建为「用视图模型渲染」：
  · 顶部先出**可见告警**（存储不可用/读不出的记录/排除项/未测量指标/**未结清运行**），每条都带原因；
  · DIRECT_CONTROL 区默认展开（刷新、清单编辑器、导入、仅验证、登记）；
  · 实验列表主标签是**人话（question）**，标识符只作为属性供点击处理使用；
  · Runs / Metrics 用用户语言（进度 1/3、剩余次数用文字说明）；
  · Technical details 折叠，内含完整 manifest 与「本视图尚未归位的 payload 字段」清单；
  · 页面同时读 registry 与 live run —— 分层需要两者。
apps/web/research-surface.js 新增 `researchMarkup(view,{locale})`：页面渲染的片段由它产出，
  因此「形状」可以在**无浏览器**下断言（列表可见文本、告警 role、技术层独占精确记录）。
危险区不动：research-faults.js 自身已是折叠 `<details>` + 需要输入确认串，页面仅在存在 document 时调用它。

测试 S8：用 stub 容器真正跑一遍页面渲染，再断言片段 —— 技术层存在但**未展开**、直接控制区**已展开**、
标识符**不作为可见文本**、未结清运行用文字说明。**夹具自身改了两处**（stub 缺 querySelector；
用 indexOf 判断「标识符在后」是错的，因为属性本身就排在文本之前 —— 改为剥掉属性值后检查可见文本）。
套件 8/8；**7 处突变仍全部被抓住**并按字节还原；相邻 web 套件（terminal shell / i18n）保持绿。
```

## 4.5 我造成的**真实回归**，以及它是怎么被抓到的（记录，不做美化）

```text
第一次接线（head 05ca33e）打坏了**已被验收**的 REX-801 研究界面契约：
  · 我删掉了 `#research-vocabulary`（清单字段/取值披露），但它正是 REX-801 浏览器套件等待的元素；
  · 我把「存储不可用」那句从 `#research-list` 移到了新加的告警区，而套件从那句读它；
  · 更要紧的是：我删掉了局部 `esc()` 却仍在用它 ⇒ `show()` 抛 `esc is not defined` ⇒ **所有控件保持 disabled**。
hosted run 37548550930 因此失败两个**既有**浏览器用例（CEX790 降级存储、以及 Web Research 全流程）。
**我自己的 S8 没抓住它**：当时的 stub 每次 querySelector 都返回新对象，页面的身份检查不通过 ⇒ `show()` 根本没执行，
断言只覆盖了外壳字符串。

发现方式：不猜，**在本地直接跑被验收的那套**（`tests/rex801-research-ui.test.mjs`），并写了一个真实浏览器调试脚本
（`D:\utopia-chat\rex807-page-debug.mjs`）打印页面错误与 DOM 状态 —— 它直接给出 `pageerror: esc is not defined`。

修复（同时保住分层与既有契约）：
  · 词汇披露回到展开的直接控制区；
  · 「存储不可用」**两处都写**：告警区（服务分层）与 `#research-list`（既有套件读这里）—— 两句都是真的，所以都存在；
  · 恢复局部 `esc()` 并注明原因。

**守卫改成「忠实」的（这才是长期价值）**：S8 的容器改为**同一注册表里 memoise 节点**，于是页面自身的渲染路径真的执行、
其后置条件可以被断言（登记控件最终必须是 enabled）。为此修了**三处夹具缺陷**并新增一条突变 **N8**（把 `esc` 改名，
复现这次回归）。现在 **8 处突变全部变红**并按字节还原。本地：rex807 8/8、被验收的 rex801 研究界面套件 3/3、相邻 web 套件绿。
```

## 5. CI：一次假红与它的归因（保留红，不预写绿）

```text
首个交付头 b06e978 的 V0.2 checks 37546655667：gateway-web **failure**、android success。
唯一失败的是既有套件 tests/rex803-campaign-web.test.mjs 的
「REX803 web: the owner runs a real campaign and every repetition without a measurement shows its reason」(16.8s)，
**不是**本增量新增的测试。归因证据链（五条）：
  1. 本提交**纯增量**：`git show --stat` = 2 个新文件 / +292 行，**未修改任何既有文件**；
  2. 失败条目的名字属于既有 web 套件（浏览器驱动）；
  3. **同一头重跑两个 job 全绿**（completed / success）—— 同一 commit 先红后绿；
  4. 该套件在本机单独跑 2/2、再跑 2/2 全绿；
  5. 同一测试名此前已在**本机全量并行**运行中失败过（当时 38s），即它的负载敏感性**早于且独立于**这次 CI。
⇒ 归类为**负载敏感的 web 套件抖动**，与本增量无关；本报告不把它写成「CI 通过」，而是把红与随后的绿都留着。
（与 REX-801 套件那次同类；那次我修的是 Windows `rm()` 竞态，这次的红不是拆除竞态而是浏览器时序，故只记录不擅改既有套件。）
```

## 7. 增量 3（head `afe8f1c`）：Android 观察面，以及本机无法构建 Android 的环境事实

```text
交付（apps/android/app/src/main/java/city/utopia/control/）：
  ResearchRun.kt      **纯解析 + 视图模型**：当前运行（scenario/state/measured/planned，未结清时用文字说明）、
                      回执窗口自身边界（「本城持有 51 次，列表只列最新 50 条（上限 50），覆盖 PARTIAL」）、
                      以及可见的 attention 列表（RUN_INCOMPLETE / UNFINISHED_CAMPAIGN / STORE_UNAVAILABLE 带原因）。
                      owner-required 被拒时**不是空页**而是明确提示；**任何 campaign 标识符都不出现在用户语句里**，
                      原始载荷只在折叠的技术层（与 Web 视图模型同一条折叠规则）。
  ResearchRunPanel.kt **观察专用**：没有创建/启动/停止，也没有故障注入；技术细节可展开；离线时说明缓存不是实时记录。
  MainActivity.kt     在高级导航里与「研究记录」并列新增「研究运行」入口。
  CityClient.kt       新增只读 `researchCampaigns` 调用。
  ResearchRunTest.kt  **8 项守卫**，逐条对应手机面常见的误导（被拒 ≠ 空页、有界窗口不得冒充完整历史、
                      未结清运行不得显示为完成、未结束 campaign 与存储不可用必须可见、标识符不得泄漏、
                      以及用反射断言视图模型**没有**任何可被面板变成变更操作的字段）。
环境事实（记录，不是借口）：**本机无法构建 Android** —— 未安装低于 25/26 的 JDK，而 Android Gradle Plugin
  拒绝 25 与 26（`JAVA_HOME` 曾指向失效的 `D:\Android_Studio\jbr`；真实的 JetBrains runtime 是 JDK 25，
  `C:\Program Files\Java` 下是 JDK 26）。因此本增量的**编译与单测验证来自 CI 的 android job**，不是本机运行；
  这一点写进记录，避免被读成「本机已通过」。

**CI 首跑的结论（保留红）**：head `afe8f1c` 的 android job **failure** —— Kotlin **编译干净**，119 个测试跑完，
只有一个失败：**我自己写的** `observationOnlyExposesNoControl`（`ResearchRunTest.kt:74`）。
根因不是产品缺陷而是编译器细节：启用 Compose 编译器插件后，被视为 stable 的类会多出一个合成字段 `$stable`，
于是 `declaredFields` 是 6 个而不是 5 个，我用「集合完全相等」写死了。修法是让断言回到它真正想表达的性质：
**五个观察字段必须在场，且任何字段名都不得是控制形状**（create/start/stop/inject/fault/confirm/submit/mutat）——
既保留「有人偷偷加一个可变更字段就变红」的能力，又不再被编译器细节打翻。修复头 `b9d6db2`。
```

## 8. 增量 4（head `f81ac5f`）：把「必须确认」从一句话变成一道闸，并修好那句说错的提示

```text
缺口是**我自己写的**：危险区确实带了 requiresConfirmation，也写了确认语，但
  (a) 没有任何东西会**拒绝**任何操作 —— 它只是一句话，测试也只断言那句话里出现过某个词；
  (b) 那句话本身是**错的**：视图模型要求「输入 campaign id」，而网关只接受
      `FAULT:<kind>:<nodeId>`（services/dev-gateway/research/faults.mjs:41 的 `confirmation!=='FAULT:'+kind+':'+nodeId`）。
  ⇒ 照着屏幕提示做的操作者会被 403 FAULT_CONFIRMATION_REQUIRED 拒绝：**一个无法被满足的安全提示比没有提示更糟**，
     因为它会教操作者「随便粘点什么让它消失」。
交付：
  · 令牌**单一来源**：research-surface.js 导出 `faultConfirmationToken({kind,nodeId})`，页面渲染它、不再自己拼短语；
    工作书要求的语义（high-impact 控件不得误触）因此有了可执行的定义，而不是文案。
  · `assertAdvancedControlsConfirmed(view)` 把要求变成**会抛错**的检查，覆盖三种形状：未确认的高级**区块**、
    区块内未确认的高级**控件**、顶层未确认的高级控件；`researchView()` 返回前就调用它 ⇒ **以后新增的高级控件不可能悄悄变成一键**。
  · 新套件 tests/rex807-danger-confirmation.test.mjs（S9–S11）：
      S9  三种未确认形状逐一被点名拒绝；DIRECT_CONTROL 不确认是合法的（不得被误伤）。
      S10 客户端规则拒绝空/空白/旧版提示里的 campaign id/错目标/错类型/前后空格/小写，并且**用真实网关**证明
          本模块拼出来的字符串就是网关接受的那个（拒绝时确实**什么都没注入**）。
      S11 **真实浏览器 + 真实网关**：危险区默认折叠且确认框为空；错误确认**零注入**；空与纯空白在本地被拒并
          **写出它要的确切令牌**；只有确切令牌能注入 —— 且只注入一次，用后清空，第二次盲点不会重复注入。
与**已验收边界**的冲突（如实记录，因为我第一版写错了）：我最初让客户端拒绝**一切**不匹配，这**悄悄挪动了
  已被验收的 REX-804 边界**（tests/rex804-web.test.mjs 断言「错误确认会到达网关、其类型化 403 会显示给用户」）。
  改为：**非空**确认一律提交（网关是权威，它类型化的 403 才是给用户的答案），只在本地拒绝**空/纯空白**这种「没填表」。
  **不为迁就 UI 改动而改写已验收测试**；该已验收套件已并入本增量的证伪集，防止以后再被挪动。

证伪（**7 处突变全部变红**，按字节还原、还原后 12/12）：取消区块的确认要求；容忍未确认的高级控件；
  放过「多一个尾随空格」的近似值；放过任何非空输入；把空确认直接提交；把空白当确认；
  以及**改网关而不是改页面**（放宽服务端令牌检查）—— 最后一条会红，正说明 S10 绑的是真实契约而不是字符串副本。
证据：聚焦三套件 12/12（rex804-web、rex807-surface、rex807-danger-confirmation）；相邻 REX-804 故障/回执套件
  与 REX-807、已验收 REX-801 研究界面套件合计 27/27；check:docs 三个根 PAIR_STATUS = SYNCHRONIZED。
本机**全量**套件如实记录：1470 项 / 1465 通过 / 5 失败，而**同一组 5 项**在未改动的 baseline 头 `b9d6db2` 上同样失败
  （用 stash 把本轮改动收起来重跑实测，不是推断）：3 项 launcher/enrolment、1 项 theme lab、1 项浏览器用例。
  与 baseline 的差别只有一处：REX-804 危险区浏览器用例在全量并行负载下 baseline 失败、加本增量后通过。
本增量不动 Android。
```

## 9. 增量 4b（head `10aed3e2`）：Export 变成真控件 —— 工作书要求「不靠 console/API 也能用」

```text
实测缺口（不是推断）：`/api/v0/research/artifacts` 存在，但**没有任何 Web 模块调用它**，也没有任何页面渲染出口。
「产出研究交付物的那一个能力」当时只能手工打 API，而视图模型的 replay-export 区块里却列着一条
「Export artifact」控件、无人实现 ⇒ **列了没接的控件就是假按钮**。
交付：Research 页新增 Export 折叠区与两个**真控件**（下载工件 JSON / 下载指标 CSV）。会话凭据由外壳持有
（app.js 侧把 `exportArtifact` 能力注入页面），页面在拿不到该能力时**明确拒绝并说明原因**，区块写明需要 Owner 会话
而不是静默失败。连带修掉「接线元数据在说谎」：每条控件现在都记录 `wired`/`wiredAt`，export 为 `wired:true`（本页），
replay 为 `wired:false`（实际在 research-replay）。
新守卫 S12（真实浏览器 + 真实持有一份 campaign 回执的 City）：点击下载后**校验字节** —— 清单里的 cityId 等于本城、
指标与校验和在场、文件名是具名而非 blob id、CSV 带指标表、页面报告「上次导出」。
写这条测试时暴露并修掉**我自己**的三个缺陷（逐个记录，不静默修）：
  E1 外壳能力返回裸字符串，页面把名字存成 `''`，于是「上次导出」永不显示 —— 改为返回 `{name,format,bytes}`。
     （这一处第一次运行时表现为「控件渲染正确但状态不更新」，靠浏览器端 console 定位，不是靠猜。）
  E2 测试读了**折叠区块的 innerText**（该浏览器下折叠元素 innerText 为空），把正确控件误判为未渲染 —— 改用 textContent。
  E3 测试自己的助手把刚展开的折叠区又**点了关**（点开着的 `<details>` summary 会收起），导致按钮不可见。
另有一个更早的失败也是我的、不是产品的：首版导出测试用错了 node 凭据，看到的是空节点列表。
**文书事故（记录，不做美化）**：为增量 4b 追加本节时，我的编辑锚点写成了 `## 9. 边界（未越过）`，
而§8 之后原已存在同名小节，替换把**整份开发报告**截断成 2.5KB（198 行 → 24 行）。发现方式：提交后看到
`--stat` 显示 −198 行，随即用 `git checkout HEAD~1` 取回上一版全文再重新追加本节；本节现在位于全文之末，
「边界」小节保持原位。**这不是文件损坏，是我的替换范围错误**，故照实记录。
证伪：**8 处突变全部变红**并按字节还原（新增两处：**网关**放宽令牌检查；把 Export 控件留成无处理器的摆设）。
本地证据：rex807 两套 12/12；更宽的相邻集（已验收 REX-801 研究界面、REX-804 故障/回执/Web、REX-806 工件面）32/32；
check:docs 三根 SYNCHRONIZED。exact-head CI：V0.2 checks push `37558498188` **completed/success，两个 job 全绿**。
```

## 10. 边界（未越过）

```text
不采购/不付费、不装系统服务、不改运行 profile、不启用远端执行；未新增任何网关路由（只读既有 payload）；
未改动 REX-806/PCF 的已验收资产；merge_authority 保持 false（本任务未验收）。
```
