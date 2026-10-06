# 跨任务缺陷族：一个不可用的文件存储就可能阻止 City 启动

> 完整中文阅读译本。[英文原文](../DEFECT_RESEARCH_STORE_HARDENING.md)为权威证据来源；本文不更新当前任务事实。证据代码块原样保留。
>
> 文件名保留历史名称：首先发现的是 research registry。后来扫描 City 启动时接触的所有文件存储，发现第二个实例，因此本文现覆盖整个缺陷族，统一保留在同一记录中。

```text
FOUND BY        Mech (COMPUTERNAME MEGA-REP, role Mech-DS)
FOUND WHEN      2026-10-06, during REX-803's adversarial self-test (round 12), then by whole-City store sweeps (rounds 13-14)
AFFECTS         services/dev-gateway/research/registry.mjs      (REX-801, COMPLETE and MERGED into main)
                services/capability-bridge/theme-artifacts.mjs  (MB-008 legacy migration, long since MERGED into main)
                services/dev-gateway/store.mjs                  (canonical city.sqlite - bricking is CORRECT here, the
                                                                 diagnostic is not; see F-1)
                services/dev-gateway/join.mjs                   (silent durability loss - deliberate, unreported; F-2)
                services/dev-gateway/execution-profile.mjs      (WBC-604, COMPLETE; half-switch on store failure; F-3)
SEVERITY        HIGH - a City built from current main does not start at all (two instances), plus two silent/contradictory
                store failures in merged main
STATUS          every instance REPORTED with a measured reproduction and a falsified probe; three adoptable repair
                branches exist (research registry, capability-bridge theme artifacts, WBC-604 profile store); F-1 and F-2
                are reported and NOT repaired by this host
```

## 会发生什么

`createExperimentRegistry` 在构造函数中无保护地调用 `mkdirSync(root, {recursive: true})`。只要运行时本应存在目录的位置放了一个文件，`createGateway` 就会抛异常，City 无法绑定端口。以 `main` = `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef` 为基线，在该提交创建的工作树中测得：

```text
TRAP AT <runtime>/research                 -> BRICKED   Error: ENOTDIR: not a directory, mkdir '<runtime>/research/experiments'
TRAP AT <runtime>/research/experiments     -> BRICKED   Error: EEXIST: file already exists, mkdir '<runtime>/research/experiments'
TRAP AT <runtime>/research/campaigns       -> STARTED   (REX-803; repaired by this programme's own self-test, R-1)
TRAP AT <runtime>/monitor                  -> STARTED   (MON-903; repaired by this programme's own self-test, M-1)
TRAP AT <runtime>/research-trace           -> STARTED   (REX-802 collector; already tolerant)
```

触发源来自外部，例如人工编辑、其他工具、磁盘故障或部分恢复的备份，因为 registry 自身采用临时文件加 rename 的原子写入。但后果是本项目最严重的失败模式：City 无法启动，只有未分类的错误，没有诊断信息。

## 为什么记录，而不是悄悄修复

REX-801 是**已关闭**任务，终端标记已释放，代码已合入并运行于 main。本宿主没有领取该任务；诚实做法是发布测量、最小修复及其守卫，由项目所有者或 REX 后续工作的持有者决定。若在另一任务分支内修改已关闭任务合入的模块，会混淆两者记录。

## 修复所采用的模式

此缺陷族中的各模块现按同一模式处理：**降级、报告带类型的原因、继续服务、用探针守卫**。

```text
BRANCH      repair/REX-801-mech-store-guard @ a676c8c4dbebe9f1ed3f78e6c8fdfd99a620bcfb   (parent = current main)
CHANGE      services/dev-gateway/research/registry.mjs
              a store that cannot be created or listed -> storeState/storeReason, published by list()
              write() returns null instead of throwing, so register() answers persisted:false with persistFailure
            services/dev-gateway/server.mjs
              the registration route forwards persistFailure instead of dropping it between registry and caller
            tests/rex801-store-guard.test.mjs  (NEW)
              two probes, one per trap path: the City starts, the surface states the degraded store, a valid manifest
              is still validated and answered as "validated but not filed", and the City keeps serving
LOCAL       2/2 new probes; REX-801 manifest suite, the Alien independent-review suite, the research UI browser suite
            and the REX-802 gateway suite all pass (16 tests across those files)
CI          V0.2 checks push run 37408867982 COMPLETED SUCCESS on a676c8c4dbebe9f1ed3f78e6c8fdfd99a620bcfb (attempt 1),
            read from the Actions API and matched on headSha. A CI field is composed from a per-run read, never from an
            expectation - the rule this round recorded after a near-miss on REX-803's own CI field.
NOT DONE    the host did NOT merge it, did NOT change the registry's semantics beyond the guard, and did NOT touch main
```

## 发现第二个实例的全 City 扫描

知道失败形态比只知道单个实例更有价值，因此主动扫描整个族：对 City 接触的每个文件存储设置一个探针，在模块需要**目录**的位置放置**文件**。同一工具分别在 main 和修复分支运行，形成配对的前后测量，而非记忆比较。

```text
TRAP                                      main 213f9f9f          repair/capability-bridge-mech-artifact-store-guard 8c67bb2
theme-packages (bridge artifacts)         BRICKED  EEXIST        STARTED   (startup-reachable)   <- the second instance
research (registry parent)                BRICKED  ENOTDIR       BRICKED   ENOTDIR
research/experiments (registry)           BRICKED  EEXIST        BRICKED   EEXIST
research/campaigns (campaigns)            STARTED                STARTED
monitor (decision store)                  STARTED                STARTED
research-trace (collector)                STARTED                STARTED
```

两次运行均退出 0。只有 `createGateway` 自身抛异常时工具才报告 BRICKED，因此这里测量的是“City 无法启动”，而非路由测试。剩下两个 BRICKED 行是此前已报告的 REX-801 registry，该分支并未修改它。

以下精确调用链直接读取被证伪探针的输出，不是推断：

```text
Error: EEXIST: file already exists, mkdir '<runtime>/theme-packages'
    at Object.mkdirSync (node:fs)
    at createThemeArtifacts (services/capability-bridge/theme-artifacts.mjs:6)
    at createBridge        (services/capability-bridge/bridge.mjs:31)
    at createGateway       (services/dev-gateway/server.mjs:323)
```

第二个实例值得记录，关键在于它的隐藏方式：已经存在针对同一场景的测试，而且在损坏代码树上仍通过。该测试在 Gateway **开始监听之后**才放置故障文件，所以只调用 `allocate()`，从不覆盖构造阶段，而真正故障恰在那里。复现症状的探针不等于复现缺陷的探针。

### 更正：第一次扫描表格比实际覆盖多了两行

第一次扫描列出八个陷阱，**只有六个真实执行**。对 `join-requests.json` 和 `execution-profile.json`，工具传入 `relative = null`，即没有放置任何故障，两行实际运行健康环境并输出路由状态。这两行还有另外两个测量工具缺陷：

- join 行的 `HTTP 400` 是探针自身错误：字段应为 `claim`，却发送 `claimSecret`；请求从未到达存储层，400 没有测量存储问题。
- 两者都是**文件**存储，“目录位置放文件”是错误形态。它们需要反向形态，而当时根本没有扫描。

这些错误不会被清理掉。发布表格夸大自身覆盖范围，恰是本项目检查器应发现的记录漂移；有用的回应是更正测量，而非悄悄改写。

### 扫描 v2：两种形态，每个陷阱都证明实际生效

更正后的工具与记录一并提交，见 [store-shape-sweep-v2.mjs](../store-shape-sweep-v2.mjs)。它从 Utopia checkout 运行，报告 **SHAPE A**（模块需目录的位置放文件）和 **SHAPE B**（模块需文件的位置放目录），每次输出状态都说明含义。`NOT EXERCISED` 作为结果报告，不算通过。

```text
SHAPE A  a FILE where the module needs a DIRECTORY              main 213f9f9f      repair 8c67bb2
theme-packages (bridge artifacts)                               BRICKED EEXIST     STARTED
research (REX-801 registry parent)                              BRICKED ENOTDIR    BRICKED ENOTDIR
research/experiments (REX-801 registry)                         BRICKED EEXIST     BRICKED EEXIST
research/campaigns (REX-803 campaigns)                          STARTED            STARTED
monitor (MON-903 decision store)                                STARTED            STARTED
research-trace (REX-802 collector)                              STARTED            STARTED

SHAPE B  a DIRECTORY where the module needs a FILE              main 213f9f9f      repair 8c67bb2
city.sqlite (canonical store)                                   BRICKED            BRICKED    <- NEW INSTANCE
join-requests.json (join store)                                 STARTED            STARTED
execution-profile.json (WBC-604)                                STARTED, not exercised by a bare City

UNIT PROBES (traps a bare City cannot reach)                    main 213f9f9f      repair 8c67bb2
join store, unwritable file     request() RESOLVED PENDING, nothing persisted
profile store, unwritable file  change() THREW EPERM but the live profile moved STANDARD_DEVICES -> WORKER_POOL
```

v2 产生三项发现，是同一形态的三种不同失败模式，也是扩大扫描范围的真正价值：

```text
F-1  city.sqlite as a directory          createGateway throws "unable to open database file" and the City never starts.
                                          THIS ONE IS CORRECT BEHAVIOUR: a City without its canonical store has no task
                                          truth, so refusing to start is right - but the failure is untyped and gives an
                                          operator nothing to act on. The family rule is not "never fail"; it is "never fail
                                          silently or uninformatively".
F-2  join-requests.json as a directory    the City starts, POST /join/request returns HTTP 200 and the approver's row is
                                          created in memory, while NOTHING is persisted. This is deliberate - join.mjs:74-77
                                          says persistence "is a convenience for a City restart, not a correctness
                                          requirement ... the failure is silent by design". The design decision is defensible;
                                          what is missing is the third element of this programme's own pattern: REPORT THE
                                          TYPED REASON. An approver who approves a request that a restart will erase has been
                                          told nothing.
F-3  execution-profile.json unwritable    change() THROWS, but the live profile has ALREADY moved. The module's own
                                          header states rule 2 as "a failed activation leaves the CURRENT profile in place
                                          ... it never half-switches"; execution-profile.mjs:139-141 sets `profile = requested`
                                          BEFORE persist(), so a store failure produces exactly the half-switch the rule forbids,
                                          and the caller's exception hides it.
```

F-3 是模块宣称的规则与代码相矛盾，通过给存储设置其自测从未使用的形态发现。F-2 是**刻意**静默，而本项目模式会改为提供带类型的原因。F-1 则把同一形态施加于唯一应当拒绝启动的存储，因而使族规则更精确，而非单纯增加待修列表。

### F-3 修复及其模式（第三条可采纳分支）

三项中，F-3 的修复最明确、最小，因为模块自身文档已经规定预期行为。因此它也附带可采纳分支：

```text
BRANCH      repair/WBC-604-mech-profile-persist-first @ 1f2f08ca4d947ef55c08b9aac946f424f4a28587
            (parent = main 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef)
CHANGE      services/dev-gateway/execution-profile.mjs
              persist() takes the profile to write as an argument and is called BEFORE the live assignment, so a store
              that refuses the write leaves the running profile where it was
              a refused write raises a typed ProfileChangeError(PROFILE_STORE_UNAVAILABLE), keeping the errno and path in
              `detail` for a log; the route used to surface `error.code` verbatim, so an owner saw EPERM and a path
            tests/wbc604-store-failure.test.mjs  (NEW, 3 probes)
PROBE       falsified on the unguarded tree, which reports the half-switch itself:
              "the running profile is UNCHANGED"  actual 'WORKER_POOL'  expected 'STANDARD_DEVICES'
            a positive control proves the reorder did not break persistence (a working store still records the NEW
            profile and a fresh controller still adopts it), and one probe states its own limit instead of overclaiming -
            the route's store branch is only reachable when a non-default backend is READY, which a bare City cannot
            offer, so the controller probe is the authority for the typed code and the route probe proves only the
            forwarding and the absence of a leak on the refusal it can actually reach
LOCAL       3/3 new probes; the three existing WBC-604 suites green (19 tests across the four files); full suite
            1348/1353. CORRECTED LATER - see "Correction: the five failures were not all environment" below: 3 were this
            host's resident-City reservation (a genuine host condition) and 2 were a missing `city` install on this host
            (a setup error of mine), not environment properties as first recorded
CI          V0.2 checks push run 37412629328 COMPLETED SUCCESS (attempt 1) on 1f2f08ca4d947ef55c08b9aac946f424f4a28587,
            jobs android and gateway-web both success; read per-run from the Actions API and matched on headSha
NOT DONE    WBC-604 is COMPLETE and this host did NOT reopen it, did NOT merge, and did NOT touch main
```

F-1、F-2 在此仅报告，**未修复**：`city.sqlite` 属于 `services/dev-gateway/store.mjs`；join store 的静默是 `join.mjs:74-77` 记录的设计决策，不是编码错误。两者应由模块所有者处理。策略与两条 store guard 的发布一致：测量、公布形态、让所有者采纳。

## 第二条修复，同一模式

```text
BRANCH      repair/capability-bridge-mech-artifact-store-guard @ 8c67bb224a4d52e47ee2cdd470690f50c39c72d6
            (parent = main 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef; two commits, the second from the analysis below)
CHANGE      services/capability-bridge/theme-artifacts.mjs
              construction catches its own mkdirSync/realpathSync failure -> storeState UNAVAILABLE + the filesystem's
              own errno; startup pruning runs inside the same guard; allocate() throws the typed
              BUILD_STORAGE_UNAVAILABLE the bridge already maps; finish() records the degradation and returns
              services/capability-bridge/bridge.mjs
              artifactStore() publishes state/reason (NOT_CONFIGURED is its own word: no root wired is a deployment
              choice, not a fault)
            services/dev-gateway/server.mjs
              health reports an `artifacts` component and deliberately EXCLUDES it from the degraded calculation
            tests/bridge-artifact-store-guard.test.mjs  (NEW, 5 probes)
LOCAL       5/5 new probes; theme-build-bridge suite (3 tests incl. the pre-existing one) green; full suite 1350/1355.
            CORRECTED LATER - see "Correction: the five failures were not all environment" below: only 3 of the 5 were a
            host condition, and 2 were a setup error of mine
CI          V0.2 checks push run 37410914313 COMPLETED SUCCESS (attempt 1) on 8c67bb224a4d52e47ee2cdd470690f50c39c72d6,
            jobs android and gateway-web both success; read per-run from the Actions API and matched on headSha. The
            first commit's run 37410520455 is also COMPLETED SUCCESS (attempt 1) on its own head 3a6b1572. Both CI
            fields are composed from a per-run read, never from an expectation - the rule this programme recorded after
            a near-miss on REX-803's own CI field.
NOT DONE    the host did NOT merge it, did NOT change what the theme lab produces, and did NOT touch main
```

本修复内部有两项值得保留的发现，两者都刻意采用不对称行为：

1. **`allocate` 抛异常，`finish` 记录降级。** 无处保存包的构建确实没有完成，所以 `allocate` 拒绝。但执行到 `finish` 时，包及其摘要已经存在；bridge 会捕获该路径的任何异常并把结果改成 `BUILD_STORAGE_UNAVAILABLE`，因此清理或写入 `.completed` 标记之类记账故障，可能把**真实且已验证的构建**报告成存储失败。对两个入口统一使用同一种守卫，反而会在解决旧不实信息时制造新的不实信息。
2. **状态反映实时变化，而非构造时的一次结论。** City 启动时正常的 root 之后仍可能故障。如果 health 一直报告 READY，直至下次重启，监督者只有重启 City 才能知道某能力已停止持久化。任何入口发现故障时，存储立即切换为 UNAVAILABLE。

## 将扫描扩大到两种形态后的完整缺陷族

```text
REX-804  B1  an unreadable fault receipt stopped the City from starting        found by OPPOSITE-HOST REVIEW (blocking)
MON-903  M-1 an unusable decision store stopped the City from starting         found by SELF-TEST one round later
REX-803  R-1 a blocked campaign receipt store broke the campaign LIST route    found by SELF-TEST two rounds later
REX-801  ---  the same shape, in a module merged into main                     found by SELF-TEST while reviewing the
                                                                               family for the pattern
bridge   ---  the same shape, in a second module merged into main              found by SHAPE-A SWEEP
              (capability-bridge theme artifacts)                              (6 stores, 3 bricked, 1 repaired here)
city.sqlite F-1 a directory where the canonical database belongs stops the      found by SHAPE-B SWEEP
              City - bricking is CORRECT, the untyped message is not           (3 file stores, 1 bricked, 2 silent)
join     F-2  HTTP 200 and an approver row while nothing is persisted          found by SHAPE-B SWEEP + unit probe
              (deliberate silence, missing the typed reason)                   (silent by design, reported)
profile  F-3  change() throws while the live profile has ALREADY switched      found by SHAPE-B SWEEP + unit probe
              (contradicts the module's own stated rule 2)                     (half-switch, reported)
```

项目研究记录中的观察是：七项中的五项由**主动寻找失败形态**发现，而非普通测试；复检发现的那一项并未传播检查到相邻模块，即使同一宿主编写了它们。按模块复检找到一项，按形态探测在数秒内找到其余项。

三项更精确的观察都涉及测量工具，而非产品代码：

1. **bridge 实例的既有测试在损坏代码树上仍通过。** 它复现了症状（构建失败），却没有复现缺陷（City 无法启动），因为故障在构造完成后才放入。回归探针应先在无保护代码树上被证伪，再被信任。
2. **第一次扫描表格声称的陷阱比实际放置多两个**，输出没有解释的 `HTTP 400`，并对两个文件存储使用错误形态。其输出本身已有证据，即没人能解释的状态；有用的回应是更正测量，而不是悄悄改写。这是项目两天内记录的第三个测量工具错误，前两项分别是 MON-902 根据负载敏感等待读取 CI 结论，以及 REX-803 根据预期起草 CI 字段。
3. **从六个陷阱扩展到九个，把两个无法启动实例扩展为四种行为**：无法启动、静默成功、静默部分成功、违背模块自身文档规则。若扫描只问“City 是否启动”，会把其中三种报告为 STARTED，也就误算通过。

形态 A 发现的两个无法启动实例均带被证伪探针和可采纳分支。上述 `mkdirSync -> createThemeArtifacts -> createBridge -> createGateway` 调用链引用实际证伪输出，没有重构。

## 更正：五个失败并非全部环境原因

前述两条修复记录及两分支提交信息把本宿主结果描述为“5 个继承的环境失败，在基线 213f9f9f 上完全相同”。**这一解释有一半错误**，且是在独立复现另一宿主集成时发现，而非重新阅读自身工作时发现：

```text
3 failures   host-city-launcher, "Requires a free local host reservation"
             GENUINE HOST CONDITION: the resident City on this machine holds the reservation.
2 failures   CORRUPT_INPUT in capability-adapters and city-roads
             MY OWN SETUP ERROR, not an environment property.
```

证伪是同一工作树、同一 head 上的单变量实验，唯一差异是 `city/node_modules` 是否存在：

```text
city/node_modules ABSENT    node --test tests/capability-adapters.test.mjs tests/city-roads.test.mjs
                            tests 11   pass 9    fail 2   (both CORRUPT_INPUT)
city/node_modules PRESENT   tests 11   pass 11   fail 0
```

原因很普通：`capability-adapters.test.mjs` 从 `../city/09-planning-knowledge/…` 导入文档读取器，它们加载 `mammoth` / `pdfjs-dist` / `fflate` / `yaml`。这些依赖位于 `city/package.json`，需要**单独且有意执行**的安装步骤 `pnpm --dir city install`（`.github/workflows/ci.yml` 第 20 行）。本宿主只在根目录运行 `npm ci`，而且在两个 lockfile 均为 pnpm 的仓库中使用 npm。同样的根目录安装遗漏，也解释了集成自身 `tests/cex790-current-inventory.test.mjs` 在执行该步骤前出现 `Cannot find module 'yaml'`，以及审计文档为何明确要求两处都安装。

对读者而言，本宿主任何“5 个继承的环境失败”数字都应解释为：**3 个宿主预留占用失败，加 2 个依赖未安装失败**。按文档正确设置后的数值是 **1356/1359**，剩余三项均因常驻 City 占用宿主预留。`repair/REX-801-…`、`repair/capability-bridge-…`、`repair/WBC-604-…` 的提交信息仍保留旧说法；为了隐藏分类错误而改写已发布历史，比原错误更糟。本节就是正式更正记录。

导致错误的是文档缺口，采用与代码发现相同的方式处理：测量、报告、发布可采纳分支，不合并。

```text
BRANCH   repair/mech-readme-city-install-step @ b4dac610b09acf909a1758139ac8815517f2d014  (parent = main 213f9f9f)
WHY      the README's install block showed only `pnpm install --frozen-lockfile`, while `pnpm test` also needs
         `pnpm --dir city install --frozen-lockfile` (city/ is deliberately not a pnpm workspace and carries its own
         lockfile; ci.yml line 20 runs both). A root-only install therefore makes two suites fail with CORRUPT_INPUT,
         which reads like a product defect - exactly the trap this host fell into.
CHANGE   README.md: the missing command, plus a bilingual note naming the symptom so the next reader recognises it
CHECK    docs only; `node scripts/check-bilingual.mjs` reports every pair SYNCHRONIZED
CI       V0.2 checks push run 37414436113 COMPLETED SUCCESS (attempt 1) on b4dac610b09acf909a1758139ac8815517f2d014,
         jobs android and gateway-web both success; read per-run from the Actions API and matched on headSha
```

它属于此前已说明三次的模式：**测量质量取决于工具设置；从未被追问设置是否完整的工具，会给出自信、稳定但错误的数字。** 稳定恰是它令人信服之处：同样两项失败连续多轮每次出现，被读成“环境问题”，而不是“依赖未安装”。
## 在已合并 main 和待合并候选上重新扫描

修复发布后发生两件事：本 session 中 `origin/main` 首次移动到 `b06504f`，即 PR #33 合并，带两个已采纳 store-guard 分支及其探针；另一分支成为 merge candidate，即 Alien 的 REX-803 review candidate `8798ba9`。两者使用相同工具扫描，让族记录描述实际即将运行的代码，而非经历大量工作前旧测量提交的状态。

```text
SHAPE A  a FILE where the module needs a DIRECTORY        main 213f9f9f      merged main b06504f   REX-803 candidate 8798ba9
theme-packages (bridge artifacts)                         BRICKED EEXIST     STARTED               STARTED
research (REX-801 registry parent)                        BRICKED ENOTDIR    STARTED               STARTED
research/experiments (REX-801 registry)                   BRICKED EEXIST     STARTED               STARTED
research/campaigns (REX-803 campaigns)                    STARTED            STARTED               STARTED
monitor (MON-903 decision store)                          STARTED            STARTED               STARTED
research-trace (REX-802 collector)                        STARTED            STARTED               STARTED

SHAPE B  a DIRECTORY where the module needs a FILE
city.sqlite (canonical store)                             BRICKED            BRICKED               BRICKED       F-1 open by choice
join-requests.json (join store)                           STARTED            STARTED               STARTED       F-2 open by decision
execution-profile.json (WBC-604)                          half-switch        half-switch           half-switch   F-3 open, repair unadopted

UNIT PROBES
join store, unwritable file      request() RESOLVED PENDING, nothing persisted            unchanged on all three
profile store, unwritable file   change() THREW EPERM, live profile STANDARD -> WORKER_POOL unchanged on all three
```

前三行验证本宿主自身被采纳的工作：经 PR #33 到达 main 的两条修复，使整个 shape-A 族在已合并 main 上可启动，而非只在自身分支。这比“分支绿色”更强，也是记录需要的结论。

最后两行是诚实保留项，其中一项本轮发生变化：

```text
F-1  city.sqlite as a directory still stops the City with "unable to open database file". Bricking is CORRECT here;
     only the diagnostic is missing. Reporter unchanged, unrepaired by design.
F-2  the join store still returns HTTP 200 with an in-memory row and persists nothing, deliberately and silently.
     Reported; the silence is a documented design decision in join.mjs, not a coding error.
F-3  the execution-profile half-switch is STILL LIVE ON MERGED MAIN: change() throws a raw EPERM while the live profile
     has already moved STANDARD_DEVICES -> WORKER_POOL. The repair for it has been published since round 15 and has
     never been adopted, so the defect outlived two merges.
```

对于 F-3，本宿主决定使其尽可能容易采纳，而非只重复报告：把修复 cherry-pick 到**当前 main**，发布 `repair/WBC-604-mech-profile-persist-first-on-current-main @ ad1b3e8`，让 CI 运行完整已合并套件，而非建立在两次合并之前的 baseline。分支测量：

```text
focused   the F-3 probes plus the three existing WBC-604 suites    19 pass / 0 fail
sweep     profile store, unwritable file -> change() THREW PROFILE_STORE_UNAVAILABLE;
          live profile STANDARD_DEVICES -> STANDARD_DEVICES        (was EPERM and STANDARD -> WORKER_POOL)
full      1359/1362, the 3 failures being this host's resident-City host reservation
CI        V0.2 checks push run 37425834472 COMPLETED SUCCESS (attempt 1) on ad1b3e8, jobs android and
          gateway-web both success
```

与此前一轮 B4 相同的经验，明确为规则：**修复必须在合并结果上测量，不能仅在自身旧 baseline 上测量。** 落后两次合并的 baseline 上绿色分支，只提供没人将运行的提交的证据。
