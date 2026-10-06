# Mission Book — 历史并行工程Programme

> 阅读译本 / Reading translation：历史仪表盘的完整阅读副本，不是第二份权威任务池，不重新激活或领取归档任务。

> 当时COMPONENT_STAGE_COMPLETE41/41双阶段、四合均完整ALL_PROGRAMMES_MERGED_MAIN_CI_GREEN。programme BA/RF/GAI/EM，控制Digital-City、实现Utopia；基础门OPEN、未开programme统一基线82ed36933fb4c5b00e44768d9e1aedec1d525d9c。[静态状态](../PROGRAMME_STATE.yaml)、[跨执行契约](../CROSS_PROGRAMME_EXECUTION_CONTRACT.md)；建筑ASSISTANT_DISTRIBUTED_STATE_V2/REMOTE_FABRIC_V1/GENERAL_AI_GATEWAY_V1/ENGINEERING_MANAGER_V1；EM donor DS-Hns eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b。
>
> 各任务纠正头／托管在frontmatter及reports/ID/CORRECTION_REPORT，四队列和 [索引](./MISSION_INDEX.md) 于2026-10-01协调。旧迁移／replant及精确Pre-Assistant在finished/replant历史。恢复叠层 [异步恢复工程书](./ENGINEERING_BOOK-2026-10-01-ASYNC-DISPATCH-RECOVERY-AND-DRAIN.md)：GitHub账单阻已恢复、2026-10-01协调，临时零可领约20分钟有界重扫仍规范。

## 当时施工仪表盘

静态主机／programme配置在PROGRAMME_STATE，动态claim/完成在各任务frontmatter和报告。README/index仪表盘不得普通claim修改。

Owner五纠正后2026-10-01：DEVELOPMENT_GREEN41/41、CORRECTION_COMPLETE41/41、四组件排空true、合工作书4/4、全合CI绿true、外阻RECOVERED。main e7c498f5acd86da324a45c3278219c8daa612561、36830053908绿，含41纠正分支联合，全部annotated archive/ID，源分支删，GitHub仅main；历史经合图／tag可达未删。

| Programme | 任务池 | 开发 | 纠正 | 合并／下阶段 |
|---|---|---:|---:|---|
| Butler Assistant | BA-001..BA-009 | **9/9 绿** | **9/9 完整** | **MERGED_MAIN** — `41e241c`, CI 36827422797; 9 归档标签 |
| Remote Fabric | RF-001..RF-010 | **10/10 绿** | **10/10 完整** | **MERGED_MAIN** — `49914d9`, CI 36828413515; 10 归档标签 |
| General AI Gateway | GAI-001..GAI-009 | **9/9 绿** | **9/9 完整** | **MERGED_MAIN** — `74b37cf`, CI 36829232339; 9 归档标签 |
| Engineering Manager | EM-001..EM-013 | **13/13 绿** | **13/13 完整** | **MERGED_MAIN** — `e7c498f`, CI 36830053908; 13 归档标签 |

各组件推送自身头开发／纠正绿、每项异物理；四main合均验CI。Owner请求BA007/009 GAI009 EM012/013各纠正报告记录纠正SHA、CI、作者边界、披露。

实体Alien和Mech均idle：新扫无可修有主、合资格异纠、未领开发。Mech PARKED/NO_WORK/DO_NOT_WAKE，只有新池／新开发／显式Owner才重入。

## 0. 基础启动门 — OPEN

[原Pre-Assistant](../../replant/ENGINEERING_BOOK-2026-09-30-PRE-ASSISTANT-UPT-CLOSEOUT.md)保历史。接受状态：

```text
branch head (accepted)   = 85ecde437ec930f1b4aa41d8913540e012da5ee7
branch CI                = 36691043142  android success, gateway-web success
merged Utopia main SHA   = 8104f8289a76d15ff0197c953730edcef42cab5e
merged-main CI           = 36692675561  android success, gateway-web success
post-merge branch audit  = 35 origin refs, unmerged = 0
```

85ecde437ec930f1b4aa41d8913540e012da5ee7、36691043142双作业成功；main8104f8289a76d15ff0197c953730edcef42cab5e、36692675561成功；35originrefs未合0。独立核拒首候选、接受修候选。其单机Ownerwaiver不适BA，BA虽解锁仍逐项双实体。reset时四未开，统一82ed369冻结，各独立可合、跨programme不阻。

## 1. 核心建筑不变量 — v2

1 Digital-Me规范用户自模型／上下文，非assistant persona存储。
2 Butler Zone独立可替换agent域。
3 个性化独立改，不改Digital-Me用户数据。
4 预留姓名／称呼、声音、头像外观、性格、职责角色、陪伴关系与未来扩展；profile不授权限。
5 一个逻辑助手可同时多设备具身。
6 共享脑为一个权威持久助手状态＋多具身ContextProjection。共享已提交事实／记忆引用、助手用户关系、任务、承诺、检查点、事件；活token上下文、scratch推理、临时计划、未提交推断、设备/UI瞬态不是共享权威。
7 多助手身份可同时在线。
8 一设备同刻最多一个前台交互助手。
9 前台绑定独立任务归属／后台执行，切前台不自动移／取消／暂停／再建任务。
10 任务区分逻辑Owner/coordinator与当前executor。
11 真责任移动才handoff，移任务／检查点／证据，不移权限或actiongrant。
12 副作用需当前权威任务版本及要求租约／幂等actionkey。
13 给定排他action范围最多一有效排他租约。
14 本地具身缓存，重连／启外部或变状态副作用前取权威重验lease。
15 任务在共享Core/City，非仅device session。
16 namespace/受众区分user-global、assistant-private、项目任务、channel受众、device-ephemeral，不静默合并。
17 知识不等披露权，当前受众／隐私允许才输出。
18 Digital-Me访问是有scope授权，persona/关系不能写成规范用户身份。
19 有效权限User/OwnerPolicy∩AssistantPolicy∩DeviceCapability∩TaskActionGrant；lease另安全前提非权限源。

## 2. 工作模型：开发→纠正

开发在冻结基线独立任务分支实现有界项目。另一物理主机在同分支独立猎设计漏洞并直接修全部范围缺陷，非报告而已；查建筑／一致性／并发／隐私受众／权限／生命周期恢复／旧状态／相关lease幂等／假成功。

## 3. 领取与实体分离

Alien/Mech均可用、无第二机hold；每BA/RF/GAI/EM开发与纠正必须不同，同机不得双角色。动态claim仅目标frontmatter原子更新不改盘。开发创建推任务分支不合main，纠正同分支也不合main。报告mission-book/reports/TASK-ID。

## 4. 全局异步／不空闲

41全局池，空主机扫四而非仅此前programme。优先已拥有可修红、另一机开发已完的合资格纠正、任意未领开发；同等时偏不同programme早暴露接口，但不为均衡等待。托管CI／长本测／provider／login／非CPU等待不占主机，保claim另树再领。缺同系列实现用stableport＋确定替身，真外接受不能跑仅记录延期集成、不阻无关组件。全扫三可领类均空才停，原子claim/retry及合规则见规范契约。

## 5. 完成门

开发：有界实现、正负／相关并发恢复／本地、branchCI绿、报告及精确头。纠正：异物理、独立对抗、直接修／回归／相关本地／branchCI绿、报告精确纠正头。

## 6. 硬合锁

MERGE_WORKBOOK_CREATION SATISFIED2026-10-01已创建执行。先前FORBIDDEN直到全BA001–009开发纠正true、异机、分支历史证双机、纠正头远端记录；完整审计后才建。九项全满、头推且CI绿， [BA合书](../butler-assistant/BUTLER_ASSISTANT_MERGE_WORKBOOK.md) 完成4ff27ba/36827219769→41e241c/36827422797。

## 7. 合工作书强制门

BA已：1fetch当时main和各纠正；2每branch双机重核；3不丢有效行为冲突显式联合；4保v2尤其权威持久／本地投影、前台任务、owner/executor、handoff及受众边界；5对抗多设备竞争无分裂排他副作用；6lease过期重分／幂等重放重试；7离线重连旧状态不未验再副作用；8低权接交不提权；9全相关本测；10联合合main；11main精确GitHubCI。任何要求检查红／取消／要求却跳／pending均禁最终完成。BUTLER_ASSISTANT_MERGED_MAIN_CI_GREEN已达到。

## Remote Fabric programme

[RF导航](../remote/README.md)，统一冻结及双阶段双物理，但独立合单元。

| RF任务集 | 开发 | 纠正 | 合并 |
|---|:---:|:---:|:---:|
| [RF-001..RF-010 Remote Fabric](../remote/README.md) | **10/10 绿 (Alien/Mech)** | **10/10 完整 (相反主机)** | **MERGED_MAIN** — `49914d9`, CI 36828413515 |

每RF分支冻结remote/RF异步立即可独立，不合main、不为本地PASS合／cherry-pick同系列。REMOTE_MERGE_WORKBOOK_CREATION SATISFIED；原锁直全10开发纠正绿异机证据。 [RF合书](../remote/REMOTE_FABRIC_MERGE_WORKBOOK.md)当时main41e241c→160fcc3/36828179156→49914d9/36828413515，保BA。001×002 manifest/test/registry test/双建筑冲显式联合。

## General AI Gateway programme

[GAI导航](../general-ai-gateway/README.md)。独立City/Utopia合单元归00CityFoundation/GAI。不复活Codex-Boss，Boss仅墓碑禁构建／runtime依赖或活connector；旧行为仅当前接受需求或Owner明确excerpt变独立Utopia-owned。

| GAI任务集 | 开发 | 纠正 | 合并 |
|---|:---:|:---:|:---:|
| [GAI-001..GAI-009 General AI Gateway](../general-ai-gateway/README.md) | **9/9 绿 (Mech)** | **9/9 完整 (Alien)** | **MERGED_MAIN** — `74b37cf`, CI 36829232339 |

各冻结82ed369、双机无需同时在线。缺同系列／RF不阻有界，用stableports/doubles记接口继续；真实跨设备最终门不得伪造。GAI合创建SATISFIED，九异机双绿满足后 [合书](../general-ai-gateway/GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md)当时49914d9→a47e4eb/36828980482→74b37cf/36829232339，保BA/RF/其他main。真实provider/login/双设备仍开放不由合声明。

## Engineering Manager programme

[EM导航](../engineering-manager/README.md)。Foreman/WorkerConnector永久命名空间，映现02EngineeringWorks/ProjectForeman+WorkerGateway不造重复building。DS-Hns固定donor，复用变Utopia-owned；Codex-Boss范围外不访问。

| EM任务集 | 开发 | 纠正 | 合并 |
|---|:---:|:---:|:---:|
| [EM-001..EM-013 Engineering Manager](../engineering-manager/README.md) | **13/13 绿 (Mech)** | **13/13 完整 (Alien)** | **MERGED_MAIN** — `e7c498f`, CI 36830053908 |

冻结82ed369、异机不必同步。缺同系列／托管／RF／可选第三connector不空worker；稳定port/doubles做有界组件、记真正外接口、继续别合资格。

三硬不变量：1工程阻塞注意力随用户并告最近操作2–3合资格设备，一个全局确认attention；2Sub-worker LOCAL_FIRST，只有实测LOCAL_BLOCKED/UNAVAILABLE提远fallback且显式用户同意；3远执行进度／控制／注意／结果／工件经规范共享自动回当前授权面，正常不需走远主机。

EM创建SATISFIED，十三双绿异机后 [合书](../engineering-manager/ENGINEERING_MANAGER_MERGE_WORKBOOK.md)当时74b37cf→aef657f/36829755814→e7c498f/36830053908，保BA/RF/GAI/main。真实第三connector／远E2E仍开放。

## 10. 跨Programme权威及合行为

[执行契约](../CROSS_PROGRAMME_EXECUTION_CONTRACT.md)规范四：RF节点身份／信任／presence／transport；Task/ActionCore规范任务action/attention；BA助手语义；GAI通用AI；EM工程job。域事件不由transport信封替换。

一池排空即建合，不等别池。真实外接口未有（如GAI/EM等RF）则所有独立步骤先做、记INTEGRATED_WAITING_EXTERNAL_SEAM、主机释放回池；任何最后main合前刷新当时main并重CI／接受。

语言配对 / Language pair: [English](../README-legacy-dashboard.md) · [中文](./README-legacy-dashboard.md)
