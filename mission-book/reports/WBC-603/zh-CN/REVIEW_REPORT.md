# WBC-603 — 审核报告（相反物理主机）

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；历史和未完成项原样保留，代码证据不替代验收。

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex
REVIEWED HEAD       f3510862cc348a99004ca5bd5d151a7b56279724
BRANCH              wbc/WBC-603-Alien-codex-worker-pool
DEPENDENCY UNIONS   WBC-601 accepted f66db60998343bf99243621cfcfa2363a4566db8 (review CI run 37208400707)
                    WBC-602 accepted d99101fdac5169aad74ae84fb7c0c25be43ad7d9 (review CI run 37211820065)
EXACT-HEAD CI       V0.2 checks run 37219829411 completed/success on the reviewed head
                    (jobs: gateway-web success, android success); PR22 pull-run 37219861813 success on the same
                    head; reciprocal-contract 37219861825 success
VERDICT             PASS
TERMINAL MARKER     WORKER_POOL_AGENT_SEAM_ACCEPTED released
```

审核Mech／MEGA-REP，与作者Alien-codex相反实体主机。审核头、两依赖接受头及CI逐值见原记录；精确V0.2 37219829411、PR22 37219861813、reciprocal37219861825均同头成功。裁决PASS，WORKER_POOL_AGENT_SEAM_ACCEPTED已发布。

## 1. 审核执行方式与证据边界

重读承载行为的worker-pool.mjs与headless-node-agent/agent.mjs，然后用为此审核新写的七探针tests/wbc603-mech-review-probes.test.mjs攻击真实Gateway而非作者夹具。作者套件未改作为回归。

```text
author suite (unmodified)   tests/wbc603-worker-pool.test.mjs + tests/wbc603-headless-agent.test.mjs
                            + tests/wbc601-gateway-equivalence.test.mjs + tests/wbc602-node-descriptor.test.mjs
                            -> 20 tests / 20 pass / 0 fail
review probes (new)         tests/wbc603-mech-review-probes.test.mjs -> 7 tests / 7 pass / 0 fail
```

未改作者worker pool／headless／WBC601等价／WBC602 descriptor共20/20；新审核7/7。此报告没有从开发报告或PR描述推断结果。

## 2. 作者修改WBC-601断言：接受并独立补偿

```diff
-assert.deepEqual(app.executionBackends.profiles(), ['STANDARD_DEVICES']);
+assert.deepEqual(app.executionBackends.profiles(), ['STANDARD_DEVICES','WORKER_POOL']);
+assert.throws(()=>app.executionBackends.active('WORKER_POOL'),{code:'BACKEND_DORMANT'});
-assert.deepEqual(city.executionBackend.registered.map(e=>e.profile), ['STANDARD_DEVICES']);
+assert.deepEqual(city.executionBackend.registered.filter(e=>e.canExecute).map(e=>e.profile), ['STANDARD_DEVICES']);
+assert.equal(city.executionBackend.registered.find(e=>e.profile==='WORKER_POOL').mode,'dormant');
```

这是断言放宽而非代码修复。放宽断言不能证明其停止检查的不变量，但此处修改正确：本任务目的即休眠注册，旧断言应改成只有一profile可执行。为使安全而非仅合理，PROBE A在作者文件之外独立重建性质：

```text
active()                                             -> standard-devices (mode enabled)
active('WORKER_POOL')                                -> BACKEND_DORMANT
active('HYBRID')                                     -> PROFILE_NOT_REGISTERED
every registered profile, asked for its active backend -> ['STANDARD_DEVICES:standard-devices',
                                                          'WORKER_POOL:BACKEND_DORMANT']
```

默认active为enabled standard；显式WORKER_POOL BACKEND_DORMANT，HYBRID PROFILE_NOT_REGISTERED，各注册项只有STANDARD_DEVICES可执行。随后pool从未构造的真实注册节点端到端完成真实任务。若断言放宽隐藏回归，A会失败。

## 3. 发现

### F1 — LOW：失败封闭，但失败drain需操作员恢复

node/descriptor能回答却无可用sharingEnabled时，drain先置draining=true，再抛SHARING_STATE_UNKNOWN，抛错不回滚旗标。

```text
await agent.drain()                 -> rejects SHARING_STATE_UNKNOWN
agent.status().draining             -> true      (the flag survives the failure)
agent.status().controlPending       -> false     (the control lock IS released, so a retry is possible)
await agent.runOne(...)             -> null      (the agent now refuses all work)
City sharing flag                   -> never changed (0 node/sharing calls)
await agent.resume()                -> draining=false (explicit recovery exists)
```

drain拒绝后draining仍true、controlPending false，控制锁释放可重试；runOne返回null不接工作；City共享从未改变、0次node/sharing；显式resume恢复false。作者测成功drain和drain/resume却没失败drain，此转移未测。方向安全：停接而非假健康或半改共享；但除内部旗标无原因且不重试，未查status操作员会见节点静默停止。

最小修复边界（不作为此裁决要求）：catch清draining再抛，或status记drainFailure:SHARING_STATE_UNKNOWN使可观测；仅agent文件，不碰规范真相。不是门失败：完成门4要求不可用／崩溃／重启／drain诚实失败，拒工作并报draining:true是诚实；记录供下任务决定是否自描述。

### F2 — INFORMATIONAL：承重守卫是NOT_TASK_HOLDER而非memberRefs

pool.control同时查成员和规范归属。D驱动两成员pool-b持工作、pool-a取消，确认拒NOT_TASK_HOLDER且规范状态不变。开发报告称加规范任务查找／持有者修复无关标准工作取消，故独立重现修复成立。

## 4. 独立完成门

| # | 门 | 裁决 | 依据 |
|---|---|---|---|
| 1 | 休眠Worker Pool接口 | PASS | 模块＋注册、B/C |
| 2 | 无头agent契约 | PASS | register/heartbeat/runOne/report/drain/resume/cancel/stop，注入传输 |
| 3 | 确定替身有界E2E | PASS | F真实Gateway一次claim→一次规范分配→COMPLETED |
| 4 | 不可用／崩溃／重启／drain诚实失败 | PASS、记F1 | E＋E2类型拒绝、不虚构报告 |
| 5 | pool缺席标准执行 | PASS | A |
| 6 | 相反主机审核 | PASS本报告 | 七独立＋作者套件 |
| 7 | 精确头CI绿 | PASS | 37219829411同头成功 |
| 8 | 终止标记 | RELEASED | WORKER_POOL_AGENT_SEAM_ACCEPTED |

工作书另要求攻击的不变量：

```text
fake pool cannot drag STANDARD_DEVICES down   PROBE A/B: a dormant or unbound pool refuses by name and answers
                                              for no endpoints; the device path never consults it
agent is not a second task truth               PROBE F: no task collection, no mirrored state, one claim per
                                              assignment, held=null after completion
no hidden startup dependency                   PROBE A/C: the gateway starts and serves with no pool construction;
                                              WORKER_POOL cannot become active by naming it
cross-endpoint control abuse                   PROBE D: NOT_TASK_HOLDER, canonical state unchanged
transport failure / hang                       PROBE E: bounded typed timeout, no invented report, no stuck lock
```

A/B：假／休眠／未绑定pool按名拒绝且不为端点应答，标准设备不咨询它；F：agent无任务集合／镜像状态，每分配一次claim、完成held=null，不是第二真相；A/C：Gateway无pool构造照样启动服务，名字不能激活pool；D：跨端点拒NOT_TASK_HOLDER且规范不变；E：传输失败／挂起为有界类型超时、不虚构报告、不锁死。

## 5. 声明边界

- 没真实Workbench、Linux/macOS、HA/故障转移、分布式群组声明；所有夹具同一物理Windows，符合工作书范围。
- 此审核未修F1，也不以其修复作为PASS条件；保留最小边界给programme决定。
- 裁决仅此审核头，后续头需自己审核，不能转移。

语言配对 / Language pair: [English](../REVIEW_REPORT.md) · [中文](./REVIEW_REPORT.md)
