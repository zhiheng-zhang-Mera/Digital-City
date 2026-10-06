# WBC-601 — 开发报告

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；原历史事实、失败、未知边界完整保留，元数据和证据仅以代码围栏引用。

```text
TASK_ID            WBC-601  (Execution Backend Contract + STANDARD_DEVICES default)
PROGRAMME          WORKBENCH_COMPATIBILITY_MIGRATION
ROLE               Development
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
HOST               Mech  (COMPUTERNAME MEGA-REP; City node identity Mech-Win)
BRANCH             wbc/WBC-601-execution-backend-contract
BASELINE_SHA       612c344f9f2b06a67b2645b4662d97750dd7c44e
REQUIRED_ANCESTOR  9f3e20e8ec99d591812430bee71d27e68c4ad498  -> verified ancestor of baseline
HEAD_SHA           d65dbd3af2d8903aca13726f74110e1f2f6b9b65
CI                 V0.2 checks run 37205291447 completed / success on HEAD_SHA
TERMINAL_MARKER    EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED  (development side complete)
REVIEW             PENDING — see §8 (opposite-host Formal Review not performed from this session)
```

任务为执行后端契约及STANDARD_DEVICES默认，programme WORKBENCH_COMPATIBILITY_MIGRATION，开发主机Mech／MEGA-REP、City节点Mech-Win；基线、必要祖先、开发头、成功CI及开发侧标记见原身份记录。相反主机正式审核当时PENDING。

## 1. 领取

按CONSTRUCTION_RULES §2/§2A.2原子领取。Digital-City提交898db10推main，一次设置development_host、development_branch、development_baseline_sha和baseline_resolution_evidence，不碰其他工作书字段。领取时仅完整40字符SHA而非分支名：

```text
utopia refs/heads/main            612c344f9f2b06a67b2645b4662d97750dd7c44e
required_ancestor_shas[0]         9f3e20e8ec99d591812430bee71d27e68c4ad498  ANCESTOR_OK
accepted heads still ancestors    ec12fd0831f31fd81aef9cd9dfb0c959d010f63b  ANCESTOR_OK
                                  69a097b5394a9fece39dd11cc13f04c9b4d28bfe  ANCESTOR_OK
required CI on the baseline       V0.2 checks        37203397283  completed / success  headSha 612c344f…
                                  City linkage check 37203397272  completed / success  headSha 612c344f…
worktree                          D:/utopia-wbc601   branch wbc/WBC-601-execution-backend-contract
```

main612c344f、必要祖先及两接受头均ANCESTOR_OK；基线V0.2 37203397283、linkage37203397272终态成功并同headSha；隔离工作树及分支如记录。

问题→选择→理由：UTOPIA_LIVE_STATUS.json仍说main69a097b5，比真实头落后两合并。§7要求外部改变后协调控制面且不信旧看板，因此从Actions API读取CI并匹配headSha，不读生成状态作为证据。选择测量、不继承。旧生成文件是关于工作流的证据，不是关于提交的证据。

## 2. 工程问题及答案结构

兼容迁移需未来Workbench节点pool及混合资源加入时业务层无需理解资源。障碍是“执行发生在本City注册Windows设备”仅存在server.mjs节点路由行为；在该处增资源会同一时间重写dispatch路径。因此先冻结契约并绑定当前行为：

```text
Shared Task Core (unchanged: canonical task truth, lease, idempotency)
        ↓
execution-backend-v1  (new contract: readiness, endpoints, dispatch, claim, report, control)
        ↓
STANDARD_DEVICES backend  (the existing Alien/Mech Windows path, relocated not redesigned)
        ↓
current accepted behaviour  (proved equivalent — §4)
```

共享任务Core的规范真相／租约／幂等不变，经新六问题接口到移位而非重设计的STANDARD_DEVICES，再到§4等价证明的当前接受行为。契约是端口，不是调度器；后端不拥有任务状态，只回答readiness/endpoints/dispatch/claim/report/control六有界问题。WORKER_POOL/HYBRID仅名字供未来固定切换目标，故意不启用。

## 3. 锁定决定（问题→选择→理由）

**D1 接口位置。** 可在路由上新增抽象或移路由。选择把承载决定的node/claim、node/report移入后端，register/heartbeat留Gateway因为是活性不是分配。仅包装会留下两份可达claim规则，兼容依赖永远一致；移位使唯一实现权威。活性不移保持“最小后端接口／adapter”范围，不重写节点协议。

**D2 claim守卫顺序。** 冻结路由计算target/reservation/find(claimable)，受ready/notbusy/sharing门控。选择先严格目标及交接预约，再端点就绪／忙／共享。目标是安全过滤，任务属于别设备不得移动，即使请求设备不健康也须计算，否则严格任务可能误报普通争用、恢复设备预约任务可能给健康设备。旧代码只因busy时不到find而巧合等同集合，明确顺序消除等价依赖的偶然。

**D3 busy是否属就绪。** 可仅Core接受或还需空闲。选择ENDPOINT_BUSY并把只有忙的fleet报DEGRADED而非UNAVAILABLE。dispatch也放置且查readiness，忽略busy会成为绕过claim一设备一任务的文档化通路。全忙是正常在途执行，UNAVAILABLE会让正常City显得故障。

**D4 配置能否启未来profile。** CITY_EXECUTION_PROFILE=WORKER_POOL可接受无操作／静默忽略／拒绝。选择启动拒并列支持集，registry虽有dormant注册，active报BACKEND_DORMANT。配置pool却静默运行standard使实际执行资源不可核验，违反无静默行为改变。激活属WBC603/604，此处不得配置可达。

**D5 standard启停。** 无条件注册mode:enabled、不配置，因为NO_WORKBENCH_REGRESSION硬不变量及现有产品路径。若配置可关自己的基线，无代码错误也会破坏迁移不变量。

**D6 启动依赖。** 无。readiness不抛，探测失败UNKNOWN；进程内普通对象；/health报告execution但排除degraded计算。点对点City当下无在线设备正常，不让它变programme禁止的全局阻塞；仍报告状态而不隐藏，只把Gateway健康结论限制在Gateway。

**D7 界面暴露。** City状态载executionBackend（profile、descriptor、注册表），无新UI控制。聊天／仪表盘不为领取锁，但哪个资源放此运行须可查以审计未来pool执行声明。descriptor可观测不授放置权限。

**D8 测试结构。** 契约一致性放contracts/.../tests，后端行为／Gateway等价放根tests由既有node --test tests/*.test.mjs发现。符合仓库其他契约，pnpm test CI为唯一入口。

## 4. 改动

| 文件 | 性质 |
|---|---|
| contracts/execution-backend-v1/execution-backend.mjs | 新：版本端口、profiles、就绪词汇、类型拒绝、注册 |
| contracts/execution-backend-v1/index.mjs | 新：公共接口 |
| contracts/execution-backend-v1/tests/conformance.test.mjs | 新：7一致性测 |
| services/dev-gateway/execution-backend/standard-devices.mjs | 新：standard实现 |
| services/dev-gateway/execution-backend/index.mjs | 新：实现接口 |
| services/dev-gateway/server.mjs | 导入／构造注册，claim/report委托端口，health execution、City executionBackend，返回executionProfile/Backends供测诊断 |
| tests/wbc601-standard-devices-backend.test.mjs | 新：8后端／差分守卫 |
| tests/wbc601-gateway-equivalence.test.mjs | 新：4真实Gateway等价 |
| docs/{en,zh-CN}/EXECUTION_BACKEND_STANDARD_DEVICES.md | 新：成对能力文档 |

没有重写任务schema、目标规则、配对／入网、UI，也无第二任务存储或调度器。server diff仅两路由体移位及附加报告。

### 行为等价论证（工作书步骤4）

| 要求 | 证明 |
|---|---|
| 旧无目标路径 | 等价测试真实HTTP claim→ASSIGNED，端口沿真实store到相同任务 |
| Alien严格目标 | 同测：给Mech-Win任务不让Alien-Win领，heldFor=Mech-Win |
| Mech严格目标 | 同测：Mech端口取精确严格任务 |
| 离线／未知严格目标诚实失败 | Gateway重启Mech离线后在线设备得task:null＋withheld、任务仍QUEUED未分；未知目标创建仍拒，路由不变 |
| Android/Web控制不变 | 未动路径，§6全套无既有环境阻塞以外新失败 |
| 无Workbench无启动／就绪惩罚 | 同测：无pool仍服务执行报告，execution UNAVAILABLE而health healthy |

差分直接调用Core acceptsWork及冻结MESH301的claimAllowedByTarget/withheldTasks比较端口，不能与错误副本一致就通过。

## 5. 测试证据（本分支头，可复现命令）

```text
node --test contracts/execution-backend-v1/tests/conformance.test.mjs
  7 tests / 7 pass / 0 fail

node --test tests/wbc601-standard-devices-backend.test.mjs
  8 tests / 8 pass / 0 fail

node --test tests/wbc601-gateway-equivalence.test.mjs
  4 tests / 4 pass / 0 fail

node --test tests/gateway.test.mjs          (pre-existing gateway suite, unchanged file)
  4 tests / 4 pass / 0 fail

pnpm test                                    (full root suite)
  1219 tests / 1216 pass / 3 fail   <- all 3 failures are the pre-existing environmental block, §6

node --test apps/rooms/tests/*.test.mjs
  69 tests / 69 pass / 0 fail

node city/test-all.mjs
  1984 tests / 1977 pass / 7 skipped / 0 fail

node scripts/check-bilingual.mjs
  docs: PAIR_STATUS = SYNCHRONIZED; evidence: SYNCHRONIZED; data-records: SYNCHRONIZED

node scripts/verify-promotion-history.mjs
  10 record(s) verified against local Git history at 612c344f9f2b
```

契约7/0、后端8/0、等价4/0、未改Gateway4/0、根1219/1216/3（§6环境）、Rooms69/0、City1984/1977/7跳过/0失败；docs/evidence/data双语SYNCHRONIZED，10晋级记录对本地Git验证。

## 6. 三项根套件失败的诚实分类

全部host-city-launcher，均非本任务触及路径；主机常驻城市是既有属性而非此分支。

```text
port 4389 (the fixed host coordination port, services/dev-gateway/host-city.mjs HOST_CITY_PORT)
  GET http://127.0.0.1:4389/  ->  200
  {"kind":"utopia-city-host-v1","state":"ONLINE","gatewayPid":21452,
   "endpoint":"http://172.31.12.151:4391","cityId":"031fdba6-e94c-4298-a095-6ff04a65481d", ...}
```

固定协调端口4389返回200、ONLINE、gatewayPid21452、实际端点及City UUID如证据。测试1首行readHostCity成功后按设计拒扰活跃City；测试3同样须空预约；测试2新launcher在预约占用时不能绑定自己的City。文件与基线逐字相同、diff空。托管干净runner无常驻城市，所以这类条件不在其裁决中。ENVIRONMENTAL_PRE_EXISTING而非WBC601缺陷。本会话未停常驻City，不属于自己，§4/§12禁止为测试方便扰别主机领取面。审核要全绿本地应在无常驻City机器／状态跑，三项与变更无关。

## 7. 能力暴露决定（§14A）

```text
user_exposure_class    = INTERNAL_ONLY
user_exposure_surface  = NONE (dispatch seam); the active profile is published read-only on the City status payload
user_exposure_nesting  = NONE_INTERNAL
backend_wiring         = VERIFIED (claim/report are the real canonical transitions; health/City report the live
                         backend's readiness from the same registry the routes use)
ui_exemption_reason    = An execution backend is a dispatch transport, not a user action: there is nothing to
                         start, stop, choose or approve, and no user-visible failure mode that a device's own
                         availability does not already express. It is the equivalent of a transport frame codec
                         or a heartbeat. Per §14A.4 this is checked against the "affects routing/device choice/
                         cost/trust" list: it does NOT choose a device (the strict target and the shared-work
                         gate do), does NOT change trust, cost or privacy, and does NOT decide placement policy.
                         The one piece of information a user could reasonably want — which execution profile
                         placed the run — is therefore still exposed as an OBSERVABLE fact on the status payload,
                         which is what makes a future "the pool did it" claim auditable rather than a matter of
                         prose. A visible control was deliberately NOT added: a button that switched profiles
                         would be a false affordance until WORKER_POOL exists (WORKER_POOL and HYBRID are
                         registered as names only, and the registry refuses to serve from a dormant backend).
```

INTERNAL_ONLY／NONE_INTERNAL，dispatch无用户面，profile只读City状态；真实claim/report规范转移和同注册readiness接线VERIFIED。执行后端是分配传输，不是启动／停止／选择／批准的用户动作，设备可用性已有失败表达，类似帧编解码或心跳。§14A.4路由／设备选择／成本／信任核查：本端口不选设备（严格目标／共享门选择）、不改信任／成本／隐私、不定放置策略。用户可合理想知执行profile，仍作为OBSERVABLE状态事实使pool声明可审计。不加切换按钮，因为pool/hybrid仅名字、dormant不服务，按钮会虚假可操作。

## 8. 完成及声明边界

开发侧满足：1 contracts端口；2 standard显式绑定实现；3默认不可关；4无Workbench启动任务等价；5严格目标等价及差分无回归；6精确要求CI绿（§9推后记录）；7标记仅开发侧。相反主机正式审核PENDING；Mech同主机critic不能替代§3异机，所以review_host/review_complete未动。WORKER_POOL/HYBRID未启／未实现，属依赖锁定603/604。不作性能／多主机声明，证据单主机进程内及HTTP loopback。

## 9. 最终头与CI

```text
development_head_sha   d65dbd3af2d8903aca13726f74110e1f2f6b9b65
development_ci         V0.2 checks run 37205291447  completed / success  on headSha d65dbd3af2d8903aca13726f74110e1f2f6b9b65
                       jobs: gateway-web success, android success
superseded head        9f9db6384779e75f51ec317074238c139e1de609  -> run 37204673910 FAILED gateway-web (§10)
```

最终d65dbd3af2d8903aca13726f74110e1f2f6b9b65、37205291447两作业成功；旧9f9db6384779e75f51ec317074238c139e1de609、37204673910 gateway-web失败。报告故意先于CI提交，使被测头含报告；结果ID后记工作书frontmatter，而不改报告移走描述头。旧失败保留，因为哪个头绿与先错什么是不同事实。

## 10. 托管CI发现的缺陷与修复

37204673910在旧9f9db6384779e75f51ec317074238c139e1de609 gateway-web失败，是作者刚写测试自己的错，明确记录。

```text
✖ tests/wbc601-gateway-equivalence.test.mjs:68
  a City with no Workbench starts, serves and executes: the seam adds no startup dependency
  AssertionError: a City whose devices are offline is not a degraded gateway
    actual 'degraded'   expected 'healthy'
```

等价测68行期望health healthy、实际degraded。旧Gateway从gateway＋rooms计算；开发主机常驻Rooms READY，所以healthy，干净CI无Rooms所以正确degraded。产品两处都对，断言硬编码环境且从未断言真实性质“execution不入degraded计算”；Rooms已降级时degraded也会因错误理由通过。

修复重算旧两组件结论并断言关系：

```js
const degradedNow = health.components.gateway.state !== 'READY' || health.components.rooms.state !== 'READY';
assert.equal(health.status, degradedNow ? 'degraded' : 'healthy', 'a City whose devices are offline is not a degraded gateway');
```

Gateway或Rooms不READY才degraded，否则healthy。修后重新测两环境而非仅方便环境：

```text
CITY_ROOMS_DISABLED=1  node --test tests/wbc601-gateway-equivalence.test.mjs   4 pass / 0 fail   (the CI-like case)
(default)              node --test tests/wbc601-gateway-equivalence.test.mjs   4 pass / 0 fail   (the local case)
```

CITY_ROOMS_DISABLED=1及默认各4/0。记录展示本地PASS不能代托管CI，也展示复述环境而非契约的假通过。移位接口自身未涉：端口与真实路由／冻结守卫比较在失败运行已通过，修复未改它们。

语言配对 / Language pair: [English](../DEVELOPMENT_REPORT.md) · [中文](./DEVELOPMENT_REPORT.md)
