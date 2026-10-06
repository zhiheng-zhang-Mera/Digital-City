# CEX-790 集成 — 对侧主机独立验证（Mech）

> 阅读译本 / Reading translation：只供中文阅读，不是第二份权威工作书／状态。历史身份、元数据和命令证据在代码围栏保留，不新增验收。

验证者为Mech（COMPUTERNAME MEGA-REP），角色Mech-DS，物理主机MEGA-REP；对象为Alien当前main上的CEX子系列集成。结论是无应阻塞合并的问题，但有一项可复现性发现、两项自身记录主张更正、一项保留风险。无合并权威；本机没有且不会合并。

```text
VERIFIER            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, physical host MEGA-REP
SUBJECT             Alien's current-main integration of the CEX sub-series
BRANCH              integration/CEX-790-Alien-20261006
VERIFIED HEAD       4688274255464383d577841a37e85a556d92c678   (PR #33, base main)
MERGE COMMIT        65f86f91a3d404cdbcb8f2fa43ceb9da8e994600   (parents: main 213f9f9f + author 04ecb7dd)
MAIN               213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef   (verified an ancestor of the head, exit 0)
VERDICT            nothing found that should block merge; 1 reproducibility finding, 2 of my own record
                   claims corrected (see §5 and §6), and 1 residual risk stated rather than cleared
MERGE AUTHORITY     none — this host did not and does not merge
```

## 1. 这是什么，以及不是什么

这是**对Alien集成的对侧主机验证**，不是Mech自身CEX-790任务评审。CEX-790开发与Owner豁免闭环归Mech；此处验证的是Alien在不同物理主机生产的另一产物，不能混淆。

集成将当前 `main`（`213f9f9f`）与Alien已审作者分支（`04ecb7dd`）合并，再加普通提交（`4688274`）补当前审计证据；相对main有19文件变化。

## 2. 溯源：每个变化文件可追到声明来源

报告称合并“未以旧依赖联合替换main”，可机械检查。未验证合并正是“evil merge”藏身处：内容不在任一父提交中。检查为集合差：只有某**声明来源**也改变文件时，才允许相对main不同。故刻意打印未解释集合而非通过／失败词，评审必须看此集合。

```text
main 213f9f9f -> head 4688274 relative to main: 19 files

declared sources (files each changes vs main)
  author branch 04ecb7dd (90)   capability-bridge repair 8c67bb2 (4)   research-registry repair a676c8c (3)

AT THE MERGE COMMIT 65f86f9   explained 14 / 15, unexplained 1:
  tests/cex790-current-inventory.test.mjs      <- the integrator's own NEW test; read in full (§4)
AT THE FINAL HEAD 4688274     explained 15 / 19, unexplained 4:
  docs/{en,zh-CN}/CAPABILITY_ENTRY_AUDIT_INTEGRATION.md
  evidence/raw/mission-book/CEX-790/current/{RECONCILIATION.md,capability-inventory.json}
      <- `git diff --name-only 65f86f9 4688274` returns exactly these four, so they are attributed, not unexplained
```

中文对应：main→head有19文件；作者分支相对main改90文件，capability-bridge修复改4，research-registry修复改3。合并提交解释14／15，未解释的current-inventory测试为集成者新测试，已完整阅读（第4节）。最终头解释15／19，剩四文件为双语集成文档、RECONCILIATION、inventory JSON，git diff恰返回此四，因此有归属并非无法解释。19文件全部可归于main、作者分支、两修复分支或集成者两提交。**无evil merge。**

## 3. 两项采纳修复与本机发布内容逐字节一致

Alien称修复分支“经审查采纳”。采纳时修复可能无声丢失guard，故以差异验证，而非相信主张：

```text
git diff 8c67bb2 4688274 -- services/capability-bridge/ tests/bridge-artifact-store-guard.test.mjs   -> EMPTY
git diff a676c8c 4688274 -- services/dev-gateway/research/ tests/rex801-store-guard.test.mjs         -> EMPTY
```

两项git diff均EMPTY。两修复都触及的server.mjs是干净联合而非一方获胜：

```text
this host's repair contributes   health's `artifacts` component + its exclusion from the degraded calculation
the REX-801 repair contributes   the registration route forwarding `persistFailure` to the caller
BOTH hunks are present in the integration; neither was dropped
```

中文对应：本机修复贡献health的artifacts组件及其排除于degraded计算；REX-801修复贡献注册路由转发persistFailure；两块均存在，未丢失。

Alien发现并在此修复本机发布工作一项诚实缺口：REX-801已将类型化原因 `persistFailure` 放上线，但 `apps/web/research.js`仍丢弃，Web用户看不到。集成把persisted／persistFailure放进紧凑回执、加存储不可用提示及真实浏览器探针 `tests/rex801-research-ui.test.mjs`。这是修复之界面的修复，按此记录而非作为新增。

`apps/web/app.js`移除Devices页两条重复渲染；保留调度行带busyTasks，终端行带credentialContext，均为较强版本，因此DOM不再每帧构造两次。CityClient.kt仅扩展类型化拒绝路径，纯新增未删除。research UI测试增加探针，不削弱已有断言。

## 4. 引用CI逐次验证

```text
37412522043  push           head 4688274  completed SUCCESS attempt 1  jobs: android success, gateway-web success
37412526500  pull_request   head 4688274  completed SUCCESS attempt 1  jobs: android success, gateway-web success
37412526523  pull_request   head 4688274  completed SUCCESS attempt 1  job:  reciprocal-contract success
```

中文对应：push37412522043、PR37412526500在head4688274完成SUCCESS attempt1，android／gateway-web均success；PR37412526523 reciprocal-contract success。三次均逐次读取Actions API并匹配headSha。报告自己的限定也正确：撰写时push／PR仍排队，未从运行任务推断绿色。

## 5. 独立本地复现与两类仪器分类

验证主机精确头、干净工作树，验证两次：

```text
run 1 (root install only)                          run 2 (root + city install, as ci.yml prescribes)
tests 1359  pass 1352  fail 7                      tests 1359  pass 1356  fail 3
```

中文对应：只安装根依赖的运行1为1359测试／1352通过／7失败；按ci.yml安装根＋city依赖的运行2为1359／1356／3。运行2三失败均host-city-launcher“需要空闲本地主机预留”，因为本机常驻City占用预留。这是本主机真实属性，不是产品属性。运行1多出的四失败用实验而非意见分类：

| 失败 | 分类 | 证据 |
|---|---|---|
| CEX790 current audit（Cannot find module 'yaml'） | 验证者设置，不是缺陷 | 安装city依赖后通过；ci.yml单独安装且docs/en/CAPABILITY_ENTRY_AUDIT_INTEGRATION.md记载 |
| Windows Services invokes real document, knowledge, skill, evidence and theme adapters | 负载敏感仪器抖动 | 精确头隔离运行通过（4590 ms，相比全套负载7952 ms），运行2通过；该头CI SUCCESS |
| document bytes flow through real readers … | 验证者设置，见第6节 | 同头仅切换city/node_modules即可改变结果 |
| Bridge Road extraction preserves all six published document retrieval digests | 验证者设置，见第6节 | 同一实验 |

## 6. 更正本机此前记录

本机多轮把capability-adapters和city-roads两项CORRUPT_INPUT失败报告为“继承环境失败，与基线213f9f9f相同”。**该分类错误。**它们是本机设置缺少依赖的产物；此主张被重复到mission-book记录及两条提交消息。

同工作树同头4688274、仅city/node_modules存在与否不同的证伪实验：

```text
city/node_modules ABSENT    node --test tests/capability-adapters.test.mjs tests/city-roads.test.mjs
                            tests 11   pass 9    fail 2   (both CORRUPT_INPUT)
city/node_modules PRESENT   tests 11   pass 11   fail 0
```

中文对应：缺失时11测试／9通过／2失败（均CORRUPT_INPUT）；存在时11／11／0。原因普通：capability-adapters测试从city/09-planning-knowledge导入文档阅读器，阅读器加载mammoth／pdfjs-dist／fflate／yaml；依赖在city/package.json，由单独步骤 `pnpm --dir city install` 安装（ci.yml第20行）。本机只运行根 `npm ci`，且两个lockfile都是pnpm，使用的包管理器也不是仓库所用；正确设置使它们通过。

后果明确声明，不粉饰：两store-guard修复记录及家族记录含错误措辞，原地更正；本机任何“5项继承环境失败”应读为“3主机预留失败（环境）＋2未安装依赖失败（设置）”。

## 7. 攻击审计核心主张

集成最强主张是清单：`sources.gateway_route: 60`、205项，“候选而非205项已验收能力”。重跑自己的脚本只能说明自我一致，故独立提取器以不同逻辑遍历server.mjs并比较两路由集合：

```text
raw `path===` occurrences in source          58
distinct captures                            42
source patterns after startsWith/regex       50
method-specific routes declared by the audit 55        sources.gateway_route 60
in the audit but NOT in source                0        <- nothing fabricated
in source but NOT in the audit                2        <- both are auth-layer PREFIX checks, not routes:
                                                          nodeRoute   = path.startsWith('/api/v0/node/')
                                                          researchRoute = path.startsWith('/api/v0/research/')
```

中文对应：源码原始path===出现58次，不同捕获42，加startsWith／regex后模式50；审计方法路由55，来源gateway_route60；审计有而源码无为0，没有虚构；源码有而审计无为2，均认证层前缀检查nodeRoute／researchRoute，不是路由。

因此检查**未能证伪**清单：无虚构路由，无可证实遗漏。这是粗略提取器诚实上限，不是穷尽性证明。

本机首次提取器也值得记录，这是本项目组第四次同类失败：在 `// ===` 横幅处截取“仅路由链”，58比较只捕获11，生成自信但全错的42条“虚构”路由列表。仅捕获数对原始出现数的交叉检查暴露问题。未被问过“应找到多少”的提取器不是证据；与表称8陷阱却只植6的扫描、在构造后才植故障的探针，是同一教训。

## 8. 本验证不建立的事实

- 不合并，不授予合并权威。
- 不逐项重新推导205清单，只攻击路由子集。
- 不验收实体设备或外部提供方主张；集成未提出，本机未测量。
- city.sqlite／join-store发现（DEFECT_RESEARCH_STORE_HARDENING.md F-1、F-2）和WBC-604 profile-store修复（repair/WBC-604-mech-profile-persist-first）在PR33之外，无论合并与否保持未关闭。
- Android CI任务绿色；本机未构建或安装APK。

## 9. 已提交以供重跑的仪器

```text
reports/CEX-790/provenance-check.mjs      the declared-source set-difference behind §2
                                          node provenance-check.mjs <worktree> <main> <head> <source> [<source> ...]
reports/CEX-790/route-coverage-check.mjs  the independent route-coverage check behind §7
                                          node route-coverage-check.mjs <worktree>
```

中文对应：provenance-check.mjs执行第2节声明来源集合差，参数为worktree／main／head／多个source；route-coverage-check.mjs执行第7节独立路由覆盖检查，参数worktree。

双方打印自身不确定性而非裸通过：溯源检查打印未解释文件列表（通过／失败词会藏住评审仍须解释的文件）；覆盖检查明确粗略提取器只能未能证伪，绝不能证明穷尽。

## 10. 结论

```text
MERGE BLOCKERS FOUND        none
PROVENANCE                  every changed file traces to a declared source; no evil merge
ADOPTED REPAIRS             byte-identical to the published branches; server.mjs a clean union of both
CITED CI                    three runs, per-run read, all SUCCESS attempt 1 on the exact head
LOCAL REPRODUCTION          1356/1359, the 3 failures being this host's resident-City reservation
RECORD CORRECTIONS          2 claims of this host's own, corrected in §6
RESIDUAL RISK               1 reproducibility finding (the yaml/city install step) that only bites a reviewer who
                            skips the documented second install; it does not affect CI
```

中文对应：未发现合并阻塞；每个文件追到声明来源，无evil merge；采纳修复逐字节一致，server.mjs为双方干净联合；引用CI三运行逐次读取，精确头均SUCCESS attempt1；本地1356／1359，三失败为常驻City预留；两项本机主张已在第6节更正；一项复现风险为yaml／city安装步骤，只影响跳过已记载第二次安装的评审，不影响CI。

语言配对 / Language pair: [English](../INDEPENDENT_VERIFICATION_Mech.md) · [中文](./INDEPENDENT_VERIFICATION_Mech.md)
