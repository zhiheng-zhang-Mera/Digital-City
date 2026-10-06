# EM-013 修正报告——共享任务核心与工程控制界面

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = EM-013 (Engineering Manager programme, task 13 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-013-utopia-task-surface-integration.md
CLAIM_COMMIT         = b8546cd (Digital-City main, claim of EM-013 Correction by Alien)
CLAIMED_AT           = 2026-10-01T05:50:03Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 5920e8076d317e15142b7d16c8531e529ce587f0
DEVELOPMENT_CI       = 36753243377-success-attempt-3
CORRECTION_BRANCH    = engineering-manager/EM-013-utopia-task-surface-integration
CORRECTION_HEAD_SHA  = 0ef455eabbdf54a7edfd975fa0fe82eb89690ca6
BRANCH_CI            = 36822830353-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = EM-013 26 pass (6 author + 20 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. 托管CI

```text
development head   5920e80 (Mech)   run 36753243377   success
corrected head     0ef455e (Alien)  run 36822830353   gateway-web success / android success
superseded head    2430744 (pass 1) run 36822173187   success (superseded by the second and third passes)
```

开发原计费阻塞run，Owner恢复后成功才可Correction，见历史CI恢复报告。

## 2. 独立方法

archive写文件解包 `D:\A-Utopia\.runtime\evidence\mission-book\EM-013\frozen-5920e80\`，四blob Git MATCH审前。独立仅冻结、先控制书，关注假共享／假成功／重复执行／泄密。20探针、合并输出、FINDINGS十四实质、高置信；还记录三个已证伪假设：applyResult无部分变更、无逐设备副本、__proto__按秘密拒，审查应带反证。自先得十二重叠，合下列。

## 3. 十六机制

类别1原型键、2字面guard、3调用者限、4主体、5拒前变更、6时刻、7验未读、8硬主张、9递归clone、10丢重读、11可变幂等、12访问器、13审计actor、14无数据claim。

| # | 机制 | 类别 | 修复 | 回归 |
|---|---|---|---|---|
| 1 | 未验policy require_canonical_task false/0/no/null可无task却报Core，attention源重定仍shared，未知留 | 7、3、8 | 键／类型/ref验，canonical不可关，源仅SHARED_CORE_ATTENTION | 有 |
| 2 | 自map上shared/obtained字面，caller task/lease字符串未证 | 2、8、14 | 可选taskCore.confirmBinding先确认，否则拒/崩拒；payload confirmation/task/lease verified及source，from_shared派生 | 有 |
| 3 | 终态可attention重开，已ack重PENDING、重复refs再投 | 5、2、8 | 终态拒、attention once ALREADY_ACKNOWLEDGED/DUPLICATE_JOB，blocking布尔 | 有 |
| 4 | blocking待题progress/RESUME可，status无注意 | 1、5、8 | ATTENTION_REQUIRED拒，派生attention_required/shows_success | 有 |
| 5 | 自报设备／无／executor可控制批准ack，批准无actor bool | 4 | authorized_devices默认交互，control授权，approval actor连job，ack连job | 有 |
| 6 | 二result成功改失败、产物积累，畸形drop却原数组输出，REFUSED无结果accepted:true | 1、5、8 | 首终态不变，产物规范refs数组拒非drop，输出验证数组，仅成功accepted，truth用accepted_as_truth | 有 |
| 7 | blocking attention未解也SUCCEEDED | 1、8 | backend_attention_required拒，shows_success false | 有 |
| 8 | entries漏隐藏/symbol、Map/Set、class/unread，漏authorization/cookie/bearer/x-api-key/refresh_token，*_ref任对象仍secret-free | 1、6、8 | plain、全own/symbol循环安全含Map键Set，不可读报告，宽词汇，值仅ref/null | 有 |
| 9 | ISO形状、at不验，不可能全点 | 6 | isRealInstant往返、共atFrom | 有 |
| 10 | freeze循环RangeError、clone原DataCloneError | 9、7 | WeakSet/descriptor、cloneOrRefuse INVALID_REQUEST | 有 |
| 11 | ack无job，control无acting device | 13 | job_ref/subject_ref、by_device_ref | 有 |
| 12 | owner与device比几乎总分离，缺device用connector | 8、1、14 | logical owner比connector，executor_connector_is_logical_owner；未知device null | 有 |
| 13 | event/proposal per-surface碰，重批准静默、多job同lease | 8、11 | process序列、duplicate重批准、lease单job | 有 |
| 14 | 批准把LOCAL_THROTTLED抹为REMOTE_REQUIRED | 8、14 | 保verdict，local_eligibility_verdict/effective_execution_target:REMOTE | 有 |
| 15 | duplicate/nav/provenance等无决策硬主张 | 8、7 | claims_scope:SURFACE_STRUCTURE、claims_verified_here/task_truth_verified_here:false，control衍controlled_from_execution_device | 有 |
| 16 | 修#8发现Map token键当路径段无害 | 1 | 键秘密同对象报告 | 有 |

## 4. 本地汇总

```text
corrected module (0ef455e)           26 tests / 26 pass / 0 fail
development head 5920e80             26 tests /  6 pass / 20 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

六作者原样过。EM-013证据根含frozen、pre-fix6/20、gate-surface/root/rooms/city/promotion/bilingual、patch-control-surface-1/2/3/3b、fix-regression-refs/secret、regressions.block/regressions3.block、独立20探针/FINDINGS/输出。

## 5. 边界

| 边界 | 理由 |
|---|---|
| 同canonical task仍两job，审8半 | 作者:114/:209 helper同task:canonical-1且都存在，拒第二破契约。真实重复执行门交Owner，lease半#13修。 |
| execution_responsibility标签仍OBTAINED...，审1 | 作者:51字面，首条件化破；保标签、邻verified/source说明。 |
| 自jobs/attention maps无Core可工作，审1 | 是界面，不得竞争规范或第二全局库；shared允许表仅投影、内存非持久索引，payload区Core确认／caller声明。mandatory破作者，taskCore接口有。 |
| EXECUTOR_NOT_SEPARATED不抛 | owner合法为connector，报告事实非拒，覆盖。 |
| nonblocking不门禁progress/resume | blocking才阻，notice仍attention_required:true，不坍两类。 |
| jobs/attention/fault无界，status保结构flags | 未定保留，冻结副本，明确SURFACE_STRUCTURE。 |

## 6. 审查完整性

冻结测试追加回归产pre-fix，所以变预期。审run当时6过12败，第三块后6过20败。模块control-surface.mjs各probe前后相同sha256 `2A71A6A6085952D912B986A3BC83AC9BE6C0B7A532BD562FB370C5DD36BF928A`，审未改冻结。

## 7. 披露

- 三轮：首政策底线、时刻、冻、扫secret、控制权、retry终态、投影诚实、ref序列；二eligibility保、注意成功派生、重批准；三审余终态／再投、attention gate、批准ack权、ref-only来源、taskCore、typed clone、acceptance、claim范围。十四中十二修，另canonical唯一与作者标签有suite边界。
- 自错：责任条件化破作者，保标签加flags；ref回归在LOCAL_ALLOWED提fallback改测试；nested-secret错误code改测试；Map键是真scanner修非改测试。
- 脚本锚保护，一ISO锚写前干净停；所有回归字节append helper。
- billing拒非代码，启动托管都真实步骤。
