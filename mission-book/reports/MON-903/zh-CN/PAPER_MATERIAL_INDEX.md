# MON-903 开发证据／素材

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态记录；保留历史、失败和未知边界。

开发者 Mech（COMPUTERNAME MEGA-REP、角色 Mech-DS）。基线 `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`：字面解析依赖联合，已接受 MON-901 头 `7eb38f1b930dfe6cc13dab0e17dedee467b1254b` 是 main 祖先。精确实现 `78bdd9dc873ebc257aedecf421068a1387dbec82`，分支 mon/MON-903-mech-decision-overlay，utopia PR32。作者阶段相反主机正式审核 PENDING，review_host Alien。

## 本任务研究对象

问题是控制面能否记录决策，同时不变为屏障、第二份任务真相或未授予的权限，并诚实说明自己的哪些数字不能测量。下述每个设计选择都为使三类失败不可能发生，而非仅降低概率。

## 决策与观测

- 可证明的事件触发：七种规范事件可生成决策；探针经真实 Gateway 驱动心跳、进度、完成、资源采样及客户端连接，断言决策窗口仍 EMPTY。普通工作不是审批是实测性质。
- 可证明的规则优先：计算解析器调用次数，规则解决时快速模型和 critic 从不调用；测试执行“能由 deterministic rule 解决的情况不得为了智能感调用模型”。
- Owner 边界是代码路径：范围改变、合并门、审核就绪及 Owner 决策候选以 OWNER_BOUNDARY_KIND 升级且不咨询解析器，再次由调用次数断言。
- 有界解析器契约：动作闭集、可选0..1置信度、原因最多120字符。挂起、抛错、自由文本、词汇外输出分别成为 RESOLVER_TIMEOUT／RESOLVER_FAILED／RESOLVER_INVALID_OUTPUT／RESOLVER_NOT_CONFIGURED 类型回退并升级。
- 逐任务队列与无屏障：按任务键、深度16、跨任务并行，规范事件路径不 await observe。两个探针分别让一任务慢队列饱和而另一任务决策，以及真实 Gateway 中无关任务端到端完成而失败任务正在记录决策。
- 构造性只读：只有任务读取器、没有写入器；每收据 appliedBy:null、application:RECORDED_ONLY 及原因。探针断言记录 RETRY_RECOMMENDED 不改变任务、错误或任务数。
- 诚实指标：无记录时 autoResolutionRate 为带原因的 null 而不是0；unrelatedTaskBlocking 为带依据的 ABSENT_BY_CONSTRUCTION 而非虚构零；unsupportedSources 列出错误自动决策、置信度与审核对照等需独立裁判而此叠层不能自判的项目。

## 定量观测

| 观测 | 值 | 证据 |
|---|---|---|
| 叠层探针 | 8通过/0失败 | utopia:tests/mon903-decision.test.mjs |
| 真实 Gateway | 5通过/0失败 | utopia:tests/mon903-decision-route.test.mjs |
| 浏览器 | 2通过/0失败 | utopia:tests/mon903-decisions-web.test.mjs |
| MON-901 依赖重跑 | 8通过/0失败 | tests/mon901-observation.test.mjs |
| tests/ 全 glob | 1365个，1360通过/5失败 | 当时五项全部归类继承环境，修正见下表 |
| 普通活动的决策 | 0 | ordinary City activity produces no decisions at all |
| 规则情况解析器调用 | 0 | a deterministic rule resolves first... |
| 决策延迟／队列等待 | 逐收据实测，平均值仅针对已记录决策 | 收据字段＋metrics() |

不作性能声明：延迟是单主机实测墙钟值，解析器是测试接口而非模型。

## 保留的失败和缺陷

| 阶段 | 观测 | 分类 | 处理 |
|---|---|---|---|
| 规则升级 | 非边界规则升级却记录 ownerRequired:false 无原因 | 产品D-1，本任务探针发现 | 修复为遵循规则升级 |
| 模型阶段 | 所有触发都能规则解决，模型／critic 成死代码 | 产品／设计D-2，尝试解析器的探针发现 | 未解释失败真正不确定并进入模型 |
| 协议 | 窗口 schemaVersion:1 覆盖信封0，客户端拒绝200 | 产品D-3，浏览器发现 | 窗口嵌套并断言两版本 |
| 测试夹具 | 饱和队列排空中删除收据目录，ENOTEMPTY | 测量D-4 | 修复夹具，产品正确 |
| 全套 | relay-s1-tunnel 突发断言负载下一次失败，单独12/12 | 环境／负载不稳定D-5 | 记录不隐藏，未复现 |
| “继承环境”失败 | 最初 capability-adapters＋city-roads CORRUPT_INPUT 与 host-city-launcher×3，称基线213f9f9f相同 | 已修正：只有3个主机预约失败属常驻城市环境；两CORRUPT_INPUT是该主机漏装city依赖 | 同工作树同头切换单变量：city/node_modules无→9通过/2失败，有→11通过/0失败。按两步安装全套1356/1359。保留修正：稳定错误数字最具迷惑性 |
| 本任务对抗自测 | 不可用收据存储使createGateway抛错、城市不启动M-1；已关闭叠层误怪调用者触发M-2 | 产品缺陷，作者刚审核REX-804同类后下一轮自测发现 | 三回归覆盖叠层／城市／拒绝码；存储降级为带理由内存记录 |
| 加固头托管CI | 同头push配对BLE31.3秒超时，PR通过 | 环境／负载D-9 | 相同文件单独6/6、全本地1368/1363；diff未改此文件，同头失败作业重跑成功 |
| 本主机仪器频率 | 一天三任务两次时间敏感浏览器失败（relay、BLE），单独及重跑都通过 | 测量／环境，说明仪器可靠性而非产品质量 | 逐任务记录，不弱化阈值或测试 |

### 跨任务观测（可形成论文段落）

研究侧存储问题变为城市无法启动这一同类缺陷，先在 REX-804 相反主机审核发现B1，下一轮又在 MON-903 作者自测发现；作者正是刚审核同系列的主机。证据表明已知缺陷类不会自动传播修复到同作者另一模块，但有意按相同失败形态进行对抗检查能够发现。五探针很便宜，发现两缺陷；独立审核仪器仍是另一个当时未满足要求。

## 研究适用性

```text
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
state_identity_evidence: CAPTURED
monitor_observability_evidence: CAPTURED
decision_trace_evidence: CAPTURED
```

适用性 APPLICABLE；长程上下文、状态身份、监视可观测、决策轨迹均 CAPTURED。RS-G3-OWNER-INTERVENTION-TAXONOMY：Owner 决策带类型升级原因且优先展示；RS-G3-PASSIVE-EVIDENCE-PIPELINE：收据由正常城市活动而非独立夹具产生；RS-G4-REALITY-DRIFT：本任务自身发现模型阶段不可达及版本覆盖协议的控制面漂移；RS-G3-DYNAMIC-LIVENESS：另一任务决策未完时无关任务完成，无屏障经实测。工作书 monitor_observability、decision_trace 已捕获，最高观测等级 G3_SPARSE_ACTIVE、捕获级 MAXIMUM_BOUNDED。

## 此处不可观测

```text
wrong auto-decision / repair                 needs an independent judge; NOT_OBSERVABLE from this overlay
confidence versus final review outcome       no resolver is configured in this City
model / provider identity                    a resolver is a seam, not an identified model
unrelated-task blocking COUNT in production  reported structurally (ABSENT_BY_CONSTRUCTION) with its basis
```

错误自动决策／修复需独立裁判，叠层 NOT_OBSERVABLE；置信度对最终审核无已配置解析器；模型／供应商身份不可由接口替代；生产无关任务阻塞计数仅以构造性 ABSENT_BY_CONSTRUCTION 和依据报告。

## 待办

作者阶段等待相反主机 Alien 正式审核；精确头托管 CI 达终态才记录。暴露类别 Web 控制面 OBSERVABLE_ADVANCED，不声称 Android 面；跨设备接受属 MON-990。merge_authority:false。

## 相反主机收尾

Alien 正式审核接受3cd32c60d8e9beb9df961e6b7ff193a3f69ec224，最终push／PR／linkage成功。见 [REVIEW_REPORT](./REVIEW_REPORT.md) 和 [INDEPENDENT_REVIEW_Alien](./INDEPENDENT_REVIEW_Alien.md)，保留失败、1386全通过及有界指标修复。上面待办段描述历史作者阶段，原生实物接受仍属 MON-990。

语言配对 / Language pair: [English](../PAPER_MATERIAL_INDEX.md) · [中文](./PAPER_MATERIAL_INDEX.md)
