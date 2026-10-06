# RF-007 修正报告——版本化能力注册表与寻址

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = RF-007 (Remote Fabric programme, task 7 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-007-versioned-capability-registry.md
CLAIM_COMMIT         = c1a1fe1 (Digital-City main, claim of RF-007 Correction by Alien)
CLAIMED_AT           = 2026-10-01T00:10:56Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 496d0520af64396508ba5144888aa2a33f176de3
DEVELOPMENT_CI       = 36742525949-success
CORRECTION_BRANCH    = remote/RF-007-versioned-capability-registry
CORRECTION_HEAD_SHA  = 8cfd96fe340167c5be17cf66ec3bdbc070515d5c
BRANCH_CI            = 36795919665-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = RF-007 17 pass (7 author + 10 Alien regressions), root 118 pass, rooms 69 pass,
                       city 1801 pass, promotion-history OK at 496d052, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. 托管CI

```text
development head   496d052 (Mech)   run 36742525949   success 2026-09-30T16:12:39Z
corrected head     8cfd96f (Alien)   run 36795919665   success
  gateway-web  OK 2m3s  (job 110159205978)
  android      OK 55s   (job 110159205676)
```

两运行托管runner真实执行全部步骤，Android构建发布debug APK。本任务不在GLOBAL_EXTERNAL_BLOCK区间：开发16:12:39Z成功，早于约17:19账户拒；修正在Owner恢复后成功。精确head绿满足完成。

## 2. 独立方法

作者套件不当独立证据。

1. archive导出、四blob hash-object等于496d052:path，精确不漂 `D:\A-Utopia\.runtime\evidence\mission-book\RF-007\frozen-496d052\`。
2. 独立仅冻结，工作簿目标／范围／排除／验收与反复缺陷类别，要求可运行探针、OBSERVED/SUSPECTED。
3. 审查9发现、自7机制，按机制非报告者合11修。at绕期限、陈旧重放、RangeError、原型、部分写、有效性绕、不过期重叠；政策天花板、不可枚举降级、可变描述符新增。
4. 每修由开发失败探针驱，同17套件开发7过10败、修正17过0败。

## 3. 11缺陷修复

作者开发7/7看不见全部。

| # | 机制 | 根因 | 修复 |
|---|---|---|---|
| 1 | 调用者at无验证，Date.toISOString原始RangeError非CapabilityError | 八at=when??now，仅时钟ISO验证 | callerInstant类型化INVALID_REQUEST |
| 2 | 不可能ISO形状2026-13-45T99:99:99Z为NaN，连时钟仍RangeError | 只形状 | isRealInstant形状且Date.parse有限，调用者／时钟／wire全用 |
| 3 | invoke过去at对注册表时钟已过期仍票据 | 唯一project(advertisement,at) | 请求与时钟任一过期拒，报expired_at_requested_instant/registry_clock |
| 4 | key in DEFAULT_EXECUTION让toString/constructor/valueOf/hasOwnProperty/__proto__存描述符 | 原型链成员 | Object.hasOwn |
| 5 | 不可枚举EXCLUSIVE验证后展开丢为SHARED，票exclusive:false | Object.keys与spread仅枚举，值直接读 | normaliseExecution自有键一次读、Reflect.ownKeys检查未知 |
| 6 | fromWire第N拒，前1..N-1已安装、可解析、审计接受 | 循环验证且原位set | 全暂存、全通过才提交 |
| 7 | 无版本单调，旧snapshot覆endpoint/adapter并复活lost，声明冲突code不抛 | 无条件set，版本非safe退1 | 不取代新版本，不清loss除严格更新，否则ADVERTISEMENT_VERSION_CONFLICT |
| 8 | wire跳advertise验证，['x',2]协NaN，0/负/小数/重复版本可，chosen7 supported[1]、非文本refs、同pair重复 | 只非空数组 | 同advertise版本/ref/availability，正整数advertisement_version，payload去重，INVALID_WIRE |
| 9 | 缺／不可解析expires永不过期，undefined<=at为false，可用集永久 | 原样wire时刻 | 必真实时刻INVALID_WIRE，不准无界陈旧 |
| 10 | max_ttl Infinity可100年，default>max使默认全拒 | 合并policy无验证 | 两TTL正safe整、default≤max |
| 11 | advertisements唯一可变描述符，可伪availability/loss/permission | 缺freeze | 冻结克隆 |

另两小界同修：parseCapabilityId 400个9的major Infinity、超MAX_SAFE静默舍入，现safe整数major。

## 4. 本地汇总

```text
corrected module  17 tests / 17 pass / 0 fail
development head  17 tests /  7 pass / 10 fail   ← the 10 Alien regressions are the difference
root              118 pass / 0 fail
rooms              69 pass / 0 fail
city             1801 pass / 0 fail (1808 tests)
promotion-history  10 records verified against local Git history at 496d052
bilingual          docs / evidence / data-records = SYNCHRONIZED
```

根 `D:\A-Utopia\.runtime\evidence\mission-book\RF-007\`：frozen 4/4；probe-a开发全复现；probe-b-postfix同场景12/12；pre-fix-check未修10败；patch-capability-registry及-2/-3/-4四轮可重跑、写前验证锚；prefix/postfix/gate-*/ci-*日志。

## 5. 自身失败与判断修正

- 首at修仅形状，随后发现不可能日期NaN仍RangeError、now也弱，第二轮isRealInstant全罩。仅首修会部分却报完成。
- 回归max_ttl60000却默认300000，政策正确构造拒。测试错，改default30000/max60000并断言默认被遵守，重复自断言先错类。
- 审查称freeze从不Object.freeze自身不准确，实际每对象return Object.freeze(value)。核实真正缺陷是advertisements缺wrapper，修真机制非误说。
- major低非实质仍修，一行移非整数。

## 6. 外部接口

无硬件、账户、其他项目。两契约边界记录不扩大。

1. permission_decision granted:true不绑capability/node，可跨能力重放。作者五处{granted:true,policy_ref}，要求主体是Owner契约非Correction。注册表不授权限，advertised≠permitted仍成立。
2. trust调用者输入，resolve/invoke trusted_nodes:null默认无约束，trusted-only为resolveAcrossTrusted；强制invoke信任同样破作者。

## 7. 明确不修范围

- 不加设备／OS寻址；
- 不决定任务所有权，描述符不调度／助手政策；
- 无项目合并／main改／新产品界面；
- toWire形状不变，仅摄入验证。

开发496d052与此前heads不重写。

## 8. 文档留选择的决策

1. at可读面确定覆盖，invoke请求或时钟过期都拒。注时钟是当前权限，只增加必要拒，不影响合法未过期、不破作者。
2. wire退版直接拒；当前lost等版拒；严格新接受并清lost。advertisement_version已定义可见再获变化，同版清失不是合法恢复是重放，保再获且用原未抛code。
3. 无主体权限只记接口，作者形状，Correction改公共契约超有界且破。
4. 低major修，一行不影响合法。
5. 四修轮／探针置gitignore .runtime/evidence，仅模块／测试／工作簿／报告提交，修可审而探针脚手架非产品。
