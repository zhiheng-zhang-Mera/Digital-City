# HOST-START-MODES——Owner直接要求的修改报告

阅读译本 / Reading translation：完整逐节历史阅读译本，不构成第二份权威工作簿、能力registry或验收记录。原始证据块逐字保留，每块均附完整中文说明；先前错误规则与后续修正按原顺序呈现。

```text
TASK_ID            HOST-START-MODES  (no owning workbook — see §1)
KIND               OWNER_DIRECTED_CHANGE (not a claimed task)
ROLE               Mech-DS (development host MEGA-REP)
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
BRANCH             mech/standalone-city-lifecycle
BASE_SHA           d3262ce2dd81e51a53e39e6f9add8dee650a7682
DEVELOPMENT_HEAD   473d8e8901c97c0b92f5137ea1b6d70e949a8aee (behaviour)
DOCS_HEAD          4ee0974  (bilingual docs + evidence receipt)
DISCLOSURE_HEAD    a8bce279e1145f5b480a3a0eb4a74378aeb66d68 (§14A start disclosure + PROBE 8)
CI_REPAIR_HEAD     4b2e701  (City-process acceptance moved out of the parallel suite)
CI_REPAIR2_HEAD    7444974e8f4c2fb5571154d18c76d9d035bc51fb (membership rule redrawn after CI caught a real regression)
FINAL_HEAD         b1157f3c3dec08976efe61fd7421efbce34ae727 (V0.2 checks green on push and pull_request)
PULL_REQUEST       zhiheng-zhang-Mera/utopia#26
TERMINAL_MARKER    none — there is no workbook and therefore no marker to release
REVIEW             not applicable (no workbook); opposite-host review not solicited
```

任务ID HOST-START-MODES，没有所属工作簿，见第1节；类型OWNER_DIRECTED_CHANGE，不是领取任务。开发角色Mech-DS，主机MEGA-REP；实现/控制仓库、分支、基线及各开发/文档/披露/CI修复/最终SHA均见原块。开发行为头473d8e8901c97c0b92f5137ea1b6d70e949a8aee；文档头4ee0974；披露头a8bce279e1145f5b480a3a0eb4a74378aeb66d68；CI_REPAIR_HEAD4b2e701把City进程验收移出并行套件；CI_REPAIR2_HEAD7444974e8f4c2fb5571154d18c76d9d035bc51fb因CI真实回归重画membership规则；最终b1157f3c3dec08976efe61fd7421efbce34ae727在push及pull_request的V0.2 checks绿色。PR为Utopia#26。无工作簿所以无terminal marker释放；review不适用且未征求异机审查。

## 1. 没有工作簿为何仍有本报告

Owner直接修改要求，而非mission-book领取：

> 调整启动器，单机启动时默认指向已打开的城市，关闭网页时直接关闭城市。开启城市时默认无视角色，仅当进入联机时进行角色调整。

实施前搜索控制面是否有工作簿拥有host start-mode / page-lifecycle / stored-role界面，没有：

```text
search                    mission-book/**.md frontmatter + reports/ directories
candidates inspected      SHOW-401 (showcase material extraction, development_host Alien)         -> unrelated
                          JOIN-590 (connection onboarding, merged-main physical acceptance)      -> adjacent, not this
                          CEX-701..705 / REX-802 / MON-901 (capability entry closeout)           -> unrelated
result                    ZERO WORKBOOKS OWN THIS SURFACE
```

搜索mission-book Markdown frontmatter及reports目录；SHOW-401为Alien负责的showcase材料提取，无关；JOIN-590为连接入网及merged-main物理验收，相邻但非此任务；CEX701–705、REX802、MON901为能力入口关闭，无关。结果零工作簿拥有此界面。

按未归属变更也必须记录的规则，分类为OWNER_DIRECTED_CHANGE，在claim系统之外交付，零claim、零marker。独立reports/HOST-START-MODES记录，避免无关diff污染JOIN-590关闭记录。此目录故意没有工作簿兄弟；sync_mission_progress.py迭代工作簿frontmatter task_globs而非reports树，因此孤立报告目录对生成器无影响。

建议为host启动模式及生命周期界面分配HOST-1xx工作簿：本修改引入持久且机器可读的CITY_LIFECYCLE、snapshot lifecycle、page-idle退出、角色与选择分离，未来需可领取的基线。此处只是保留原建议，没有新建任务。

## 2. Owner要求消除的三个缺陷

```text
D1  a single-machine City outlived the page that opened it
    opening Utopia on one machine spawned a detached, unref'ed process that no page owned; closing the tab left a
    City serving on the LAN with nobody at the keyboard. Observed as an integration consequence of the launcher's
    detached spawn, not as a bug report with a reproducer.

D2  the stored role decided what a single-machine start did
    main.mjs read the stored selection from role.json and, when it said MEMBER of another City with an enrollment
    file, diverted the start into the member/enrollment path — so a person who had once joined a friend's City
    could not start their own City without first clearing state.

D3  starting your own City silently destroyed the membership you had chosen
    host-city.mjs publish() rewrote role.json to PRIMARY on every start. Even when a start did not take the member
    path, the stored selection was overwritten. (D2 and D3 are facets of one modelling error: the running role and
    the stored selection were the same fact.)
```

D1：单机City比打开它的页面活得更久。Utopia启动detached/unref进程，没有页面拥有它；关tab后LAN仍有无人操作的City。这是launcher detached spawn的整合后果观察，不是带复现器的bug报告。

D2：存储角色决定单机启动行为。main.mjs读role.json，若MEMBER且有另一City enrollment文件，就转入member/enrollment路径；曾加入朋友City的人必须先清状态才能启动自己City。

D3：启动自己City静默销毁已选membership。host-city.mjs publish()每次改role.json为PRIMARY，即使未走member路径也覆盖选择。D2/D3同属建模错误：运行角色和存储选择被当同一事实。

## 3. 决策记录：选择、备选与判断

### 3.1 默认City生命周期绑定什么

```text
CHOSEN      the page. Default start = standalone + page lifecycle. The City closes when the page that owns it goes
            away, with an 8 s grace window (CITY_PAGE_IDLE_MS) so a reload does not kill it.
REJECTED A  the process. A City that always outlives every page is exactly D1.
REJECTED B  a desktop shell / tray icon. There is no launcher shell in this repository to own such a supervisor;
            inventing one is a much larger change than the owner asked for, and it would move the life of a City
            into a component no user can observe.
REJECTED C  closing immediately on `pagehide`. `pagehide` fires on reload as well, so a reload would take the City
            down and force a cold start. The grace window distinguishes "the person reloaded" from "the person left".
JUDGEMENT   the default must be the least surprising life for the ordinary single-machine user, and "the window I
            opened is the thing that is running" is that life. The grace window is the minimum mechanism that keeps
            the common reload from being destructive.
```

选择页面：默认standalone+page lifecycle，拥有页面消失后City关闭，8秒CITY_PAGE_IDLE_MS宽限避免reload杀进程。拒绝绑定进程，因为永远长于页面就是D1。拒绝桌面shell/tray：仓库没有该supervisor，创建大于要求且生命周期转入用户不可观察组件。拒绝pagehide立即关闭，因为reload也触发，会迫使冷启动。判断：普通单机用户最符合直觉的是“我打开的窗口就是正在运行的东西”；宽限是避免常见reload破坏的最小机制。

### 3.2 决策在哪里形成

```text
CHOSEN      a pure planning module, scripts/launcher-plan.mjs, exporting planStart({args}) -> {mode, lifecycle,
            followsMembership, rolePersisted}, plus the predicates followsMembership(plan) / pageTied(plan).
            The launcher and the gateway both consume the plan; the plan itself is unit-testable with no process,
            no port, and no filesystem.
REJECTED    scattering the mode decision across argument parsing in utopia-client-launcher.mjs. That is where the
            enrolment diversion already lived, and the two role==='MEMBER' branches were the reason D2 was invisible:
            there was no single place to read the rule from.
JUDGEMENT   a decision that three components must agree on has to exist once, as data, before it exists as control
            flow. All mode decisions are expressed as plan fields; every branch in the launcher is now gated on a
            plan predicate rather than on a locally re-derived bool.
```

选择纯planning模块scripts/launcher-plan.mjs，导出planStart({args})返回mode/lifecycle/followsMembership/rolePersisted，及followsMembership(plan)/pageTied(plan)。launcher与Gateway共同使用，模块无需process/port/filesystem即可单测。拒绝在launcher参数解析散落规则：enrollment diversion原已在那里，两处role===MEMBER分支使D2难见，没有唯一规则来源。判断：三组件一致决策须先作为一份数据存在，再成为控制流；所有模式由plan字段表述，launcher分支用plan predicate，不再本地重算boolean。

### 3.3 页面如何释放自己拥有的City

```text
CHOSEN      two independent mechanisms:
            (a) explicit — the page posts to POST /api/v0/host/release on unload with keepalive, so the City closes
                the moment the person leaves rather than after the grace window;
            (b) implicit — the gateway arms a page-idle exit when the last control surface disconnects.
            Ownership is enforced: the route refuses a City session with OWNER_CREDENTIAL_REQUIRED, and a City whose
            lifecycle is `service` answers released:false with reason "this City is not tied to a page".
REJECTED A  relying only on the WebSocket close. A control surface can drop for reasons that are not the person
            leaving (sleep, network blip, a suspended tab), so close alone would close Cities that are still wanted.
REJECTED B  making the release route unauthenticated for convenience. Any page on the machine — including a page
            loaded from another City — could then kill a City it does not own.
JUDGEMENT   the page that opened the City is the only thing entitled to close it, and the City must be able to say
            "no" truthfully. The two mechanisms are ordered so the fast path is explicit and the safety net is
            implicit, and both funnel into one shutdown(reason) so the exit line and the process exit code are the
            same however the City was closed.
```

选择两独立机制：(a)显式unload时keepalive POST /api/v0/host/release，使离开立即关闭而非等待；(b)隐式最后control surface断连后Gateway启动page-idle退出。执行ownership：City session以OWNER_CREDENTIAL_REQUIRED拒绝；service生命周期回答released:false及“this City is not tied to a page”。拒绝仅依赖WebSocket close，睡眠/网络抖动/tab挂起也会断开，会误关仍需要的City。拒绝无认证release，任何本机页面包括其他City加载页会可杀非自身City。判断：仅打开City的页面有权关闭，City能真实拒绝；显式快路径、隐式安全网均汇入shutdown(reason)，不同关闭路径有一致退出说明和exit code。

### 3.4 运行角色与存储选择分离

```text
CHOSEN      separation. role.json keeps the stored selection; the coordination record keeps the running role. A
            single-machine start runs PRIMARY and passes persistRole:false, leaving role.json byte-identical. Only an
            online start (`--online`, or enrolling) reads the selection and writes it back.
REJECTED A  deleting role.json on a single-machine start. That destroys information the person may want the next
            time they go online.
REJECTED B  honouring the stored role but not rewriting it. The single-machine start would then run a MEMBER City
            with no membership — D2 with a quieter symptom.
REJECTED C  renaming the file to make the distinction obvious. A migration for a naming preference is not worth the
            risk to an installed data directory.
JUDGEMENT   the owner's sentence "开启城市时默认无视角色，仅当进入联机时进行角色调整" is a statement about which action
            adjusts the role: going online. Ignoring the role is therefore not deletion but non-consultation, and the
            file is left as the person left it. The City announces the decision in its own startup record
            (CITY_LIFECYCLE, CITY_ROLE_IGNORED) so the behaviour is inspectable instead of inferred.
```

原阶段选择分离：role.json保存选择，coordination记录运行角色；单机PRIMARY、persistRole:false，使role.json字节不变，仅online或enrollment读取并写回。拒绝删role.json，会销毁下次联机想保留的信息；拒绝尊重但不改存储角色，会让无membership的单机City跑MEMBER，D2仅更隐蔽；拒绝为命名改文件名，迁移风险不值得。判断：“默认无视角色，仅当联机调整”指决定调整角色的动作是联机，忽略是“不咨询”而非删除。保留用户文件，CITY_LIFECYCLE/CITY_ROLE_IGNORED启动记录明确宣布，使行为可查。本阶段规则后来被第7节CI修正，不能把此段旧规则当最终行为。

### 3.5 生命周期如何声明

```text
CHOSEN      CITY_LIFECYCLE in the environment, normalised to page|service|online, default `page`; the gateway
            echoes `lifecycle` in its own snapshot so the page never guesses.
REJECTED    inferring page-tiedness from "was a page ever connected". A hosting City may have no page for hours and
            would then be closed by the first page that ever touched it. Publish-time inference is unfalsifiable
            after the fact; an explicit declaration is checkable at the process boundary.
JUDGEMENT   every component that can close the City must be able to read the City's own answer to "may I be closed
            by a page". `scripts/start-city.ps1` sets CITY_LIFECYCLE=service for exactly this reason: the hosting
            entry point is the one that must survive the operator's browser.
```

选择环境CITY_LIFECYCLE标准化page|service|online，默认page，Gateway在snapshot回显lifecycle，页面不猜。拒绝以“是否曾有页面连接”推断：hosting City可能数小时无页，会被第一个触及页面关闭；事后不可证伪，显式进程边界声明可查。判断：任何可关闭City的组件都应读City自身“能否被页面关闭”的回答；start-city.ps1设置service，因为托管入口必须存活于浏览器之后。

## 4. 实现清单

```text
scripts/launcher-plan.mjs                 NEW  planStart / followsMembership / pageTied — the single rule
scripts/utopia-client-launcher.mjs             consumes the plan; enrolment branch and both role==='MEMBER'
                                               diversions gated on followsMembership(plan); spawn env carries
                                               CITY_LIFECYCLE; the JSON report carries mode/lifecycle/roleIgnored
services/dev-gateway/main.mjs                   CITY_LIFECYCLE normalised (default page); stored role consulted
                                               only when online; one shutdown(reason) shared by lifecycle exit and
                                               SIGINT/SIGTERM; startup record carries CITY_LIFECYCLE / CITY_ROLE_IGNORED
services/dev-gateway/server.mjs                 createGateway({lifecycle, pageIdleMs, onLifecycleExit}); control-surface
                                               tracking; armPageIdleExit / cancelPageIdleExit; snapshot.lifecycle;
                                               POST /api/v0/host/release (local-only, owner-only, truthful refusal)
services/dev-gateway/host-city.mjs              publish() honours persistRole:false
apps/web/app.js                                 pagehide -> keepalive POST /api/v0/host/release when page-tied
scripts/start-city.ps1                          CITY_LIFECYCLE=service
tests/host-standalone-lifecycle.test.mjs  NEW   7 probes
tests/host-lifecycle-process-e2e.test.mjs NEW   2 process-level acceptances
tests/host-city-launcher.test.mjs               fixture now copies launcher-plan.mjs into both simulated installs;
                                               no assertion changed
docs/START_MODES.md                       NEW   bilingual statement of the three modes and their evidence
evidence/raw/mission-book/HOST-START-MODES/development-receipt.json  NEW  recorded runs
```

launcher-plan新建统一planStart/followsMembership/pageTied规则；launcher使用plan，enrollment与两MEMBER diversion由followsMembership约束，spawn环境有CITY_LIFECYCLE，JSON输出mode/lifecycle/roleIgnored。main标准化生命周期默认page，原阶段仅online咨询角色，共用生命周期与SIGINT/SIGTERM shutdown，启动记录明确生命周期/忽略角色。server新增createGateway lifecycle/pageIdleMs/onLifecycleExit，跟踪control surface，arm/cancel page idle，snapshot lifecycle及local-only/owner-only/真实拒绝的release路由。host-city publish遵从persistRole:false。Web pagehide在page-tied时keepalive release。start-city设置service。新7probe单测与2process验收；host-city-launcher fixture复制launcher-plan至两模拟安装而不改断言；新START_MODES双语说明和development-receipt记录运行。后续probe数量增加按下面实际证据保留。

## 5. 能力门禁（第14A节披露，第14C节registry）

### 5.1 披露决策

```text
QUESTION   should the user drive this capability, or merely know about it?
CLASS      BACKGROUND_DISCLOSED
WHY        the start mode decides how long a background process lives. §14A.4 forbids INTERNAL_ONLY for anything that
           affects long-running background behaviour, and the person does not press a button to pick a mode - they just
           start their City - so the right answer is disclosure rather than a control.
NESTING    L2_CONTEXTUAL at the moment of starting (the launcher's own output); the machine-readable fields
           (mode / lifecycle / roleIgnored in --json, lifecycle in the City snapshot) stay L4 technical detail.
WIRING     the disclosure is computed from the same plan object that decides the mode, and the City snapshot is the
           City's own answer - so the words cannot drift from the behaviour.
```

问题：用户驱动还是仅知晓能力？分类BACKGROUND_DISCLOSED。启动模式决定后台进程寿命；14A.4禁止影响长期后台行为的能力INTERNAL_ONLY，用户只是启动City而非点按钮选模式，因此披露胜于控制。启动时launcher输出L2_CONTEXTUAL；JSON mode/lifecycle/roleIgnored及snapshot lifecycle仍L4技术详情。文案与决定模式来自同一plan，snapshot为City自身回答，避免行为文案漂移。

披露并非事后补充：没有它会静默改变进程寿命，正是14A“用户应知道能力”。human模式在endpoint后打印：

```text
This City follows this page: closing it closes the City.
A single-machine start does not use the stored role; going online is what changes the role.
```

中文等义：“此City跟随此页面：关闭页面就关闭City。”“单机启动不使用存储角色；进入联机才改变角色。”--json仍单行可解析字段，携带相同事实。PROBE8断言精确原文，并确认无lifecycle的enrollment路径不会编造不支持的披露。

```text
REACHABILITY GAP (recorded, not papered over)
no Web/Android surface renders which start mode a City is in. A page-tied City is disclosed at start and then not
observable; a person who forgot cannot check. Minimal repair boundary: an L3 status row in the City panel, plus a
one-line notice on the page itself when city.lifecycle === 'page'. Not built here because the owner asked for the
behaviour, and §14A.6 permits a component-complete change to retain this seam once the decision and the seam are
recorded. It is recorded as CAP-HOST-LIFECYCLE-001's known gap.
```

可达性缺口明确记录：Web/Android均不显示City启动模式；page-tied只启动时披露，忘记的人不能再查。最小修复为City panel L3状态行及page生命周期时页面一行提示。本次未建，因为Owner要求行为，14A.6允许组件完整变更在记录决策及衔接后保留该项。登记为CAP-HOST-LIFECYCLE-001已知缺口。

### 5.2 Registry链更新，第14C节

```text
capability_ids              ["CAP-HOST-LIFECYCLE-001"]  (new, immutable)
capability_registry_action  CREATE
record                      capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml
index / surface index       CAPABILITY_INDEX.yaml + SURFACE_INDEX.yaml updated
matrices                    CAPABILITY_EXPOSURE_MATRIX.{en,zh-CN}.md updated (bilingual)
sync status                 CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW
last_verified_full_sha      a8bce279e1145f5b480a3a0eb4a74378aeb66d68
four dimensions             implementation COMPLETE / wiring VERIFIED / reachability PARTIAL / intent NOT_TESTED
```

新不可变能力CAP-HOST-LIFECYCLE-001，registry action CREATE，record/index/surface index/exposure矩阵两语言更新。sync CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW，last_verified_full_sha为a8bce279e1145f5b480a3a0eb4a74378aeb66d68；四维implementation COMPLETE、wiring VERIFIED、reachability PARTIAL、intent NOT_TESTED。修改后完整性检查13records、无重复id、每record_ref可解析、三文件均有效YAML。此译本不另建或修改registry。

## 6. 证据

```text
node --test tests/host-standalone-lifecycle.test.mjs
  pass 8 / fail 0 / skipped 0 / todo 0 / duration_ms 3602.9581
  PROBE 1  the plan defaults to a page-tied single-machine City; only --online follows a membership
  PROBE 2  closing the last page in page mode closes the City, and says why
  PROBE 3  a reload inside the grace window does NOT close the City
  PROBE 4  a second surface keeps the City alive
  PROBE 5  a City that never had a page does not close itself
  PROBE 6  the owner page can release the City explicitly, and only the owner
  PROBE 7  a hosting City ignores the release and never follows a page
  PROBE 8  the person starting a City is told which life it got, and told why their stored role was ignored

node --test tests/host-lifecycle-process-e2e.test.mjs
  pass 2 / fail 0
  E2E 1  closing the last page ends the City process with exit code 0 and a /Utopia City closing/ line
  E2E 2  a stored MEMBER role is ignored on a single-machine start, role.json is left byte-identical, and the same
         stored role is honoured when the City is started online

repository checks   check-bilingual SYNCHRONIZED; browser-relay-check 18/18
regression subset   174 pass / 180; the 3 failures (3x host-city-launcher.test.mjs, relay-s1-tunnel) were reproduced
                    UNCHANGED at the unmodified baseline via git stash -> classified ENVIRONMENT (the resident City
                    holds coordination port 4389), not attributable to this change
CI (PR #26)         City linkage check / reciprocal-contract SUCCESS; V0.2 checks — see §7 for the three red runs this
                    change caused and their repairs, and §7.4 for the green final head b1157f3c3dec (push run
                    37292415979 and pull_request run 37292420548).
```

单测8通过/0失败/0跳过/0todo，duration_ms3602.9581。PROBE1默认page-tied单机且原阶段仅online跟membership；2最后page关闭有说明；3宽限内reload不关闭；4第二surface保持；5从未有页不自关；6Owner可显式release且仅Owner；7hosting忽略release不跟页面；8启动者得到生命周期及忽略角色理由。process E2E2通过/0失败：1最后page使进程exit0并打印Utopia City closing；2单机忽略MEMBER、role.json字节不变，online尊重同一角色。仓库check-bilingual同步，browser-relay18/18。regression原记录174/180，原块称3失败（3x host-city-launcher、relay-s1-tunnel），git stash未改baseline原样复现，分类ENVIRONMENT，常驻City占4389，不归本改动。PR26 linkage/reciprocal成功；V0.2的三次红运行与修复见7节，最终精确头push37292415979及PR37292420548绿色见7.4。保留原块数量写法，不替它更正。

保真说明：process E2E生成隔离City，需4389空，main发现任意City拒绝启动。运行前停止常驻City，之后恢复同一031fdba6-e94c-4298-a095-6ff04a65481d、172.31.12.151:4391、4389 ONLINE、健康healthy、rooms READY、capabilities7、ask/targets16。docs-only4ee0974未重跑，避免再次停City，代码未变化；a8bce279e114披露提交后重跑8/8且不变E2E覆盖行为。

## 7. 本修改引入的真实CI缺陷及修复

473d8e89的37287799751及4ee0974的37288020267均红，host-city-launcher三失败。基线d3262ce2相同文件37222674520绿，因此不是继承环境问题，必须归为本修改引入缺陷。

```text
OBSERVED        run 37287799751 (gateway-web): 1253 pass / 3 fail
                ✖ two installation launchers share one City across ports and recover the same identity after a crash
                    Error: Command failed: … utopia-client-launcher.mjs --host 127.0.0.1 --port 0 --no-open --json
                    Utopia: City did not become ready within 45 seconds
                ✖ remote short code enrolls with a local member agent and reconnects without launching a host City
                    EBUSY: resource busy or locked, unlink '.scratch-remote-launch-…/city.sqlite'
                ✖ PRIMARY launcher reports successful MEMBER transition and normal main restart preserves it
                    Error: Requires a free local host reservation
BASE COMPARISON d3262ce2 V0.2 checks 37222674520 -> SUCCESS (same file, same runner image family)
CAUSE           the new tests/host-lifecycle-process-e2e.test.mjs spawns real Cities. node --test runs test FILES in
                parallel, and starting a City is a HOST-WIDE act: host-preflight.mjs findRunningCities() scans the
                process list for any other services/dev-gateway/main.mjs and main.mjs refuses to start while one
                exists. Port separation is irrelevant to that rule, so my City made the launcher tests' Cities refuse
                to start, in whichever order the scheduler happened to pick.
REJECTED FIX    spawn the City from a command line the preflight does not recognise, so the collision would not be
                seen. That is evasion: two Cities really would run on one host, which is the condition the product
                forbids. Rejected explicitly.
REPAIR          the acceptance moves to tests/acceptance/ (outside the tests/*.test.mjs glob), gains a
                `pnpm test:acceptance` script, and the CI job runs it as its own step BEFORE `pnpm test`. Same job,
                so it still gates the pull request; serialised, so it never overlaps another City. The file's header
                documents the reason so the next person does not move it back.
```

实测1253通过/3失败：两安装共享City/crash恢复等待45秒未ready；remote短码成员重连EBUSY city.sqlite；PRIMARY转MEMBER/normal restart需free reservation失败。原因新process验收生成真实City，node --test文件并行，启动City是host-wide动作，preflight进程列表发现另main即拒绝，端口隔离无效，调度顺序决定碰撞。明确拒绝让命令行逃避preflight识别，因那会真实运行两个被产品禁止的City。修复将验收移tests/acceptance，离开根glob，加pnpm test:acceptance，同CI job在pnpm test之前独立步骤串行执行，仍门禁PR而不重叠City，文件头说明避免移回。保留此失败，因为本机常驻使新acceptance跳过、旧launcher又因另已知理由失败，本地看似通过却破坏云端，正是规则警告情况。

### 7.1 CI第二缺陷：角色规则宽了一步

第一次串行修复使3失败变2，仍红，不是环境。

```text
OBSERVED        run 37288968499 (gateway-web): 1253 pass / 2 fail, both in tests/host-city-launcher.test.mjs
                ✖ remote short code enrolls with a local member agent and reconnects without launching a host City
                    EBUSY: resource busy or locked, unlink '…/.scratch-remote-launch-…/unused-host/city/city.sqlite'
                ✖ PRIMARY launcher reports successful MEMBER transition and normal main restart preserves it
                    Error: Requires a free local host reservation     (a cascade: the leaked City from the test above)
CAUSE           I had gated the stored-membership path in scripts/utopia-client-launcher.mjs on followsMembership(plan),
                which is true only for --online. A plain `--port` start by a host that is ALREADY a member of a City
                therefore stopped reconnecting to that City and instead launched a SECOND City in the member's own state
                directory - which is exactly what that accepted test forbids, and which then held city.sqlite open so the
                next test could not reserve the host either. JOIN-503's accepted contract, not the environment.
WHY LOCAL MISSED IT
                the same test file fails on this host for an unrelated reason (the resident City holds coordination port
                4389), so a local run could never distinguish my regression from the known environmental failure. This is
                the cost of reviewing development on the machine that is running the product, and it is recorded here as
                a failure of my own verification, not of the environment.
REPAIR          the rule was redrawn in scripts/launcher-plan.mjs where it can be tested without a City:
                planStart() now carries `hosting`, and mayFollowStoredMembership(plan) is false ONLY for an explicit
                hosting start (--host-only / scripts/start-city.ps1). Any other start may RECONNECT to a membership
                still on disk, because that host is already a member and pointing at that City is what being online
                means for it; only an online start WRITES role.json (persistRole:false elsewhere, unchanged); and a
                membership that cannot be honoured still refuses honestly rather than becoming a different City.
                PROBE 9 pins the rule, and the launcher's report now says roleIgnored from the fact of whether a stored
                role was actually followed, instead of from a plan predicate.
CI_REPAIR2_HEAD 7444974e8f4c2fb5571154d18c76d9d035bc51fb
```

37288968499有1253/2，两launcher：remote成员自身sqlite锁、后续reservation级联。原followsMembership仅online，已有MEMBER的普通--port启动不重连，反在自身状态目录建第二City；违反JOIN503已接受契约、锁sqlite并影响下一case。本地同文件因常驻4389无关失败，无法区分回归，原文记录为作者验证失败而非环境错。修复在纯plan加入hosting，mayFollowStoredMembership只有显式hosting --host-only/start-city为false；其他启动可重连磁盘上已持membership，这就是该成员在线；仍仅online写role.json，其他persistRole:false；不能兑现membership则诚实拒绝，不换City。PROBE9固定规则，roleIgnored按实际是否follow决定而非plan predicate。修复头7444974e8f4c2fb5571154d18c76d9d035bc51fb。两缺陷仅required托管CI发现，是§8本地绿色非证据的理由：本机坏分支无法显露自身失败。

### 7.2 CI第三缺陷：member agent不再视为online

第二修复去掉两失败但仍不是同两项；准确阅读剩余失败发现更深main根因。

```text
OBSERVED        run 37290526406 (gateway-web): 1254 pass / 2 fail, the same two launcher tests
                ✖ … "without launching a host City"  -> EBUSY on the member's own city.sqlite
                ✖ … "Requires a free local host reservation"  (cascade)
CAUSE           main.mjs derived "this is an online start" from CITY_LIFECYCLE==='online' alone. The launcher spawns a
                MEMBER AGENT with CITY_MEMBER_FILE and NO declared lifecycle, so the member agent took the host path and
                came up as a PRIMARY City of its own - a host City started where the caller had deliberately asked for
                none, which is literally the assertion in the failing test's own name.
REPAIR          the predicate moved out of main.mjs into services/dev-gateway/host-lifecycle.mjs as
                resolveLifecycle(env), where ONLINE = declared 'online' OR a member agent, and where it can be tested
                without spawning a process. PROBE 10 pins the rule; E2E 3 (in the host-owning acceptance file) spawns a
                real member agent whose City is unreachable and asserts it never reserves this host as a PRIMARY City,
                never prints 'Utopia Host listening', and never opens the host's City port.
CI_REPAIR3_HEAD 16f4854  (member-agent rule + docs; the rule's own commit is 6276b64)
FINAL_HEAD      b1157f3c3dec08976efe61fd7421efbce34ae727
FINAL CI        V0.2 checks 37292415979 (push) and 37292420548 (pull_request) -> COMPLETED SUCCESS on b1157f3c3dec08976efe61fd7421efbce34ae727
                City linkage check 37292420610 -> success on the same head
```

37290526406有1254/2，仍remote不launch host却EBUSY与reservation级联。main仅CITY_LIFECYCLE==='online'判在线；launcher生成有CITY_MEMBER_FILE而无lifecycle的MEMBER AGENT，走host路径自建PRIMARY，恰违反测试名称。修复predicate移host-lifecycle.mjs resolveLifecycle(env)：declared online或member agent均ONLINE，纯测无需spawn。PROBE10固定，host-owning E2E3真实spawn目标City不可达成员，确认不reserve PRIMARY、不打印Utopia Host listening、不开放自身City端口。16f4854为member-agent规则+docs，规则提交6276b64；最终b1157f3c3dec08976efe61fd7421efbce34ae727，push37292415979与PR37292420548 COMPLETED SUCCESS，同头linkage37292420610 success。

### 7.4 第四步及绿色头

selectMemberFile()分四种，PROBE12各固定：

```text
1  CITy_MEMBER_FILE present                 -> the member agent file, always (online by construction)
2  stored selection role=MEMBER, credential -> FOLLOWED, even on a plain start: this host is resuming a membership it
   present                                    already holds (the accepted restart contract)
3  stored selection role=MEMBER, credential -> REFUSED with 'Selected member credential unavailable; no PRIMARY fallback
   gone                                        started'. It may never quietly become a PRIMARY City in its place.
4  leftover enrollment, NO stored selection -> NOT followed on a plain start (this is the defect the owner reported:
                                               enrolling once diverted every later ordinary start); followed only
                                               when the start is online
```

1. CITY_MEMBER_FILE存在总用member file，构造上online。
2. 存储MEMBER且credential存在，普通启动也follow，因为恢复已持membership是accepted restart契约。
3. 存储MEMBER但credential消失，拒绝“Selected member credential unavailable; no PRIMARY fallback started”，绝不能静默变PRIMARY。
4. 剩余enrollment且没有stored selection，普通启动不follow，只有online才follow；这正是Owner报告曾enroll一次后所有普通启动被转走的问题。

host-city-launcher.test.mjs:120普通main重启后断言owned.role为MEMBER，迫使保留case2。因此本报告不再广泛宣称“单机无视角色”：准确是忽略剩余enrollment diversion，且绝不写角色。该解释与Owner要求及accepted契约相容，CI端到端确认：

```text
b1157f3  V0.2 checks: push SUCCESS, pull_request SUCCESS  (1257 tests, the 3 known host-city-launcher tests pass here
         because the runner has the host to itself)  + City linkage check SUCCESS
```

b1157f3 push/PR SUCCESS，1257测试；已知三launcher在独占主机runner通过，linkage成功。完整说明：6276b64的web-v02临时RECONNECTING与OFFLINE失败在b1157f3消失且该文件未改，是仍坏launcher泄漏City的级联，而非独立缺陷；保留以解释旧红运行。规则在两个文件写过才抽模块/probe；决定进程是City还是其client的predicate不应内联110行startup，已经两次隐藏回归。

### 7.3 固定E2E3时发现、刻意未修复的真实缺陷

保留原章节顺序，7.3位于7.4之后。

```text
OBSERVED        spawning main.mjs while another City runs on this host, with a non-default CITY_COORDINATION_PORT, makes
                the process print 'Another City is already running on this host: …' and then ABORT with exit code
                0xC0000409 (STATUS_STACK_BUFFER_OVERRUN) after a libuv assertion:
                "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\\win\\async.c, line 76"
BASE COMPARISON the same spawn against the MON-901 head tree (which has no CITY_COORDINATION_PORT) exits 0 printing
                'Utopia Gateway already reserved on this host: …'. So the abort is in main.mjs's refusal path
                ('Another City is already running'), not in the reservation path this change touched: the new
                CITY_COORDINATION_PORT test seam made an existing path reachable, which is how it was found.
CLASSIFICATION  latent, pre-existing defect in startup refusal; outside the owner's request and outside the behaviour
                this change owns. §8 forbids widening a repair beyond the observed defect and §9 forbids defensive
                expansion, so it is recorded rather than fixed.
CONSEQUENCE     E2E 3 asserts the invariant it is about (what the member agent refused to become) and records the exit
                code instead of asserting one; and it still skips when a City already holds this host, which is the only
                condition that reaches the aborting path.
RECOMMENDATION  give the refusal path a workbook of its own (or fold it into the HOST-1xx workbook recommended in §1):
                a second City must be refused with the documented exit and a closed reservation, not with a libuv abort.
```

另一City已运行时，以非默认CITY_COORDINATION_PORT spawn main，打印“Another City is already running on this host”后libuv断言并abort0xC0000409 STATUS_STACK_BUFFER_OVERRUN，断言原样见块。比较无此coordination seam的MON901树，同spawn打印Gateway already reserved并exit0。因此abort在main另一City拒绝路径，而非本改动reservation路径；新seam使旧路径可达而发现。分类潜伏既存启动拒绝缺陷，超Owner要求及本改动行为范围，§8禁止修复扩张，§9禁止防御扩张，记录不修。E2E3只断言成员拒绝成为City的目标不变量，记录而不规定exit code；另City占host时仍skip，这恰是触发abort条件。建议为拒绝路径建独立工作簿或归入第1节HOST1xx建议：拒绝第二City需文档规定exit并关闭reservation，不能libuv abort。此处未新增工作簿。

## 8. 开放事项

```text
1  No workbook owns this surface -> allocate HOST-1xx (see §1). Until then, changes here are owner-directed and
   carry no claim, no marker, and no review.
2  The 3 environmental failures above are pre-existing and belong to whichever workbook owns the launcher test
   suite; they are recorded here only so the classification is not lost.
3  `--online` was verified at the plan and process level (E2E 2) but not against a second live City in this session;
   JOIN-590's merged-main physical acceptance is the record for the live enrolment path.
```

1. 无工作簿拥有本界面，建议HOST1xx；之前均Owner-directed，无claim/marker/review。
2. 上述3环境失败既存，属于拥有launcher suite的工作簿；此处只保留分类。
3. online已在plan/process层E2E2验证，但本会话没有第二活跃City；实际enrollment路径以JOIN590 merged-main物理验收为记录。

语言配对 / Language pair: [原文 / Source](../DEVELOPMENT_REPORT.md)
