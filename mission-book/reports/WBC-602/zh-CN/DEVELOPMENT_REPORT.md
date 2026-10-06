# WBC-602 — 开发报告

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；历史、失败和未知边界保留，元数据及证据只以代码围栏引用。

```text
TASK_ID            WBC-602  (Node Role / Capability / Resource Descriptor, backward compatible)
PROGRAMME          WORKBENCH_COMPATIBILITY_MIGRATION
ROLE               Development
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
HOST               Mech  (COMPUTERNAME MEGA-REP; City node identity Mech-Win)
BRANCH             wbc/WBC-602-node-descriptor
BASELINE_SHA       0e9bea3ce739b979e582a428af8fb233045a5e75
REQUIRED_ANCESTOR  9f3e20e8ec99d591812430bee71d27e68c4ad498  -> verified ancestor of baseline
HEAD_SHA           c312a60b4d73f02597bde1f106372b253067fe33
TERMINAL_MARKER    NODE_CAPABILITY_RESOURCE_COMPAT_ACCEPTED  (development side complete)
REVIEW             PENDING — opposite-host Formal Review not performed from this session
```

节点角色／能力／资源descriptor向后兼容，Workbench迁移开发由Mech／MEGA-REP、City Mech-Win执行。精确基线、祖先、头见原记录；NODE_CAPABILITY_RESOURCE_COMPAT_ACCEPTED仅开发侧，相反主机正式审核待定。

## 1. 领取

按CONSTRUCTION_RULES §2/§2A.2原子领取，Digital-City623190f（rebase后main仍623190f）。领取测量仅完整40字符SHA：

```text
utopia refs/heads/main            0e9bea3ce739b979e582a428af8fb233045a5e75
required_ancestor_shas[0]         9f3e20e8ec99d591812430bee71d27e68c4ad498  ANCESTOR_OK
required CI on the baseline       V0.2 checks        37205444427  completed / success
                                  City linkage check 37205444385  completed / success
                                  (both read from the Actions API and matched on headSha)
worktree                          D:/utopia-wbc602   branch wbc/WBC-602-node-descriptor
```

main0e9bea3ce739b979e582a428af8fb233045a5e75、必要祖先ANCESTOR_OK，V0.2 37205444427和linkage37205444385均成功、Actions API headSha匹配，工作树D:/utopia-wbc602。

与WBC601独立经过实测。programme允许并行但禁同系列互合，二者共享热点server.mjs。WBC601头d65dbd3af2d8903aca13726f74110e1f2f6b9b65未审核未合，不是此基线祖先，故本任务在无执行后端接口的main上。领取记录后果：不复制601的claim/report路由体移位，自己必须附加。§3/4实际仅descriptor投影及注册相邻读路径。

## 2. 工程问题

City已有工作执行，但按机器ID、Windows、online区分Alien-Win/Mech-Win。目标是现在哪节点有足够适当资源执行此事，障碍为无稳定契约：能力裸字符串数组、资源仅可选遥测blob、无worker／控制面／验证／存储／加速器身份词汇。答案descriptor契约不是调度器：

```text
canonical node record (unchanged: the City's only stored node truth)
        ↓  read-time projection
node-descriptor-v1  (roles, capabilities, bounded resources, availability, health, trust ref)
        ↓
what WBC-603/604 will be able to route on
```

唯一存储真相规范node不变，经读取时投影为角色／能力／有界资源／可用性／健康／信任引用，使603/604可据此路由。

## 3. 锁定决定（问题→选择→理由）

**D1 存储还是读取投影？** 选读取，规范记录不变。旁存descriptor下次心跳／共享即旧，与规范旁形成不一致第二真相；投影与claim同记录重算不能漂移。

**D2 旁加还是替换node形状？** /api/v0/nodes raw nodes数组不变，旁加nodeDescriptors。附加是硬规则及诚实测试：不知descriptor的Web/Android/测/reference agent仍逐字相同输入；替换会让每消费者迁移。

**D3 旧默认角色？** EXECUTION_NODE，roleSource:LEGACY_DEFAULT可区分声明。既有City节点注册／task.execute.safe／claim即此角色；默认无角色会令以后能力调度全旧节点不可路由，多角色会虚构未声明权限；source让读者区分不是假设。

**D4 缺资源？** presence:UNKNOWN/value:null与NOT_REPORTED或MALFORMED_MEASUREMENT原因，release故意不建模GPU另UNSUPPORTED。0使未测节点像空、unavailable像坏。measurement拒负／非有限为畸形，不能接受成小数。

**D5 未测资源需求失败吗？** 不，explainRequirementFit为RESOURCE_UNKNOWN:kind/decided:false，只有实测低于最小为RESOURCE_BELOW_MINIMUM。未测与太小不同，否则引入需求当天旧节点静默不可路由。schedulingAuthority:NONE明确仅说明，不静默成为调度器。

**D6 Android？** describeAndroidControlSurface isExecutionResource:false、roles CONTROL_SURFACE；不是City node且不入列表。表达已有控制角色与不自动注册worker同时满足。契约执行而非靠调用者：非执行实体带EXECUTION_NODE时nodeDescriptor INVALID_ROLE，assertNodeDescriptor双向拒不一致。这是审核攻击的负控制、契约拒绝非约定。

**D7 descriptor是权威吗？** 否，身份留City registry，trustRef authority CITY_NODE_REGISTRY及descriptorIsNotAuthority:true。资源是节点自报，不造第二信任／身份。

**D8 代码位置？** contracts/node-descriptor-v1纯契约、Gateway仅投影，沿仓库习惯且无Gateway可测，热点改动小，是§1测量后D1有意结果。

## 4. 改动

| 文件 | 性质 |
|---|---|
| contracts/node-descriptor-v1/node-descriptor.mjs | 新词汇及nodeDescriptor、describeLegacyNode、describeControlSurface/Android、taskRequirements、explainRequirementFit、assertNodeDescriptor |
| contracts/node-descriptor-v1/index.mjs | 新公共面 |
| contracts/node-descriptor-v1/tests/conformance.test.mjs | 新8契约测 |
| services/dev-gateway/server.mjs | 导入／nodeDescriptors投影／nodes旁发descriptor／只读POST node/descriptor |
| tests/wbc602-node-descriptor.test.mjs | 新5真实Gateway测 |
| docs/{en,zh-CN}/NODE_DESCRIPTOR_ROLES_RESOURCES.md | 新成对能力文档 |

注册负载／验证、capabilities、sharingEnabled、严格目标、claim/report转移、任务schema、入网／配对和UI均未改。claim不移位也不复制。

## 5. 自有测试发现缺陷及修复（保留）

首版nodeDescriptors直接透Core为acceptingWork，reason独立计算，Owner撤共享后：

```text
availability: { state: "ONLINE", acceptingWork: true, sharingEnabled: false, reason: "SHARING_DISABLED_BY_OWNER" }
```

ONLINE/acceptingWork:true/sharingEnabled:false/reason关闭共享。字段单独对、组合在调度器需要的“现在接工作吗”自相矛盾，未来router读boolean会给Owner关共享设备工作，这是产品缺陷非测试工件。

修复acceptingWork为claim实际合取：Core接受且Owner仍共享。原因顺序ENDPOINT_OFFLINE→SHARING_DISABLED_BY_OWNER→ENDPOINT_NOT_ACCEPTING_WORK→null。isExecutionResource身份、Core能力／活性、现在接工作分开且一致。回归共享撤后ONLINE、acceptingWork false、sharing false、原因关闭、health HEALTHY。

第二较小MEASUREMENT_DEFECT非产品：作者期望在线node network.reachable true，旧转换取规范记录自身活性，夹具agent实际不在线，错在断言。改测sharing off、ONLINE、HEALTHY的真正区分，不依赖无关夹具细节。

## 6. 证据

```text
node --test contracts/node-descriptor-v1/tests/conformance.test.mjs tests/wbc602-node-descriptor.test.mjs
  13 tests / 13 pass / 0 fail

pnpm test                                   (full root suite on this branch)
  1250 tests / 1247 pass / 3 fail    <- the 3 pre-existing environmental failures, §7
  (baseline 0e9bea3 carried 1219 root tests: +31 from this task, no regression in the existing 1219)

node city/test-all.mjs
  1984 tests / 1977 pass / 7 skipped / 0 fail

node --test apps/rooms/tests/*.test.mjs
  69 tests / 69 pass / 0 fail

node scripts/check-bilingual.mjs
  docs / evidence / data-records = SYNCHRONIZED

node scripts/verify-promotion-history.mjs
  10 record(s) verified against local Git history at 0e9bea3ce739
```

契约＋真实Gateway13/0；根1250个1247通过3环境（基线1219，新31，旧1219无回归）；City1984/1977/7跳过/0失败、Rooms69/0、双语全同步、10晋级记录Git验证。

| 门 | 证明 |
|---|---|
| 1 稳定契约 | contracts及一致性 |
| 2 旧转换默认 | describeLegacyNode，无新字段仍可用 |
| 3 缺字段不使旧节点任务无效 | 旧注册真实claim/complete，未测需求未决定非拒 |
| 4 Alien/Mech/Android角色表达 | 一致性测不把Android注册worker |
| 5 无真Workbench依赖 | 无新依赖，现记录进程内计算 |
| 6 相反主机审核 | PENDING不声明 |
| 7 精确CI绿 | §8 |
| 8 标记 | 仅开发侧 |

## 7. 诚实失败分类

同601的host-city-launcher三失败，常驻城市占4389按设计拒运行；文件与基线逐字同、与此变更无关。ENVIRONMENTAL_PRE_EXISTING；此主机运行不是绿色，本报告不称绿。

## 8. 头与CI

```text
development_head_sha   c312a60b4d73f02597bde1f106372b253067fe33
development_ci         V0.2 checks run 37206331839  completed / success  on headSha c312a60b4d73f02597bde1f106372b253067fe33
                       jobs: gateway-web success, android success
                       (no earlier failed run on this branch; the defect in section 5 was found and repaired
                        locally before the first push, which is the opposite order from WBC-601's CI-caught defect)
```

精确c312a60b4d73f02597bde1f106372b253067fe33、V0.2 37206331839两作业成功。无早失败运行；§5缺陷首推前本地发现修复，与601 CI发现顺序相反。推后记frontmatter，使被测头含报告。

### 8.1 发布前纠正的记录错误

初稿HEAD_SHA c312a60b6bb6fbcc7cb0ee3ecab90dc9d64d8daf只有前七真，后缀凭记忆且仓库不存在。提交报告前读实际push/git rev-parse HEAD得c312a60b4d73f02597bde1f106372b253067fe33，交叉CI headSha捕获并纠正。

保留而非静默修，因为完整SHA是整个控制面机器锚，虚构后缀在人眼不可分。便宜规则为不凭记忆写身份，从源解析粘贴；verify-promotion-history与CI headSha独立检查关键值。

语言配对 / Language pair: [English](../DEVELOPMENT_REPORT.md) · [中文](./DEVELOPMENT_REPORT.md)
