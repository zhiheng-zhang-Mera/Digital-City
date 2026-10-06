# BA-002 修正报告——Assistant核心（共享大脑运行时）

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = BA-002 (Butler Assistant programme)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-002-shared-brain-runtime.md
CLAIM_COMMIT         = ab94734 (Digital-City main, claim of BA-002 Correction by Alien)
CLAIMED_AT           = 2026-09-30T12:40:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = d3fbf6c40c695758c3d91ae89162da39a7003349
CORRECTION_BRANCH    = assistant/BA-002-shared-brain-runtime
CORRECTION_HEAD_SHA  = e9add9d1773e46087f032e47572bf69420b3710f
BRANCH_CI            = 36716375960 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = root 120 pass / 0 fail, rooms 69 pass, city 1801 pass, promotion-history OK, docs SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. 独立审查

开发d3fbf6c fetch独立工作树直接攻击。工作簿明确恢复证明一逻辑助手多上下文投影、拒陈旧scratch作权限，并发提升更新版本／因果检查非最后写胜。故攻击会话身份句柄、权威状态准入guard、恢复信snapshot三机制。作者决策当规范非证据，最高项正是实现不符自身D8。

## 2. 发现

原概述五缺陷均公共API可达且修，下文四编号及秘密同类全部保留。

### 缺陷1（高）——另拼写权限入权威状态

FORBIDDEN_CORE_STATE_FIELDS原snake_case精确比，别拼同概念接受。

| 字段 | 修前 | 修后 |
|---|---|---|
| execution_lease | 拒 | 拒 |
| executionLease | 接受存储 | 拒 |
| capability_grants/capabilityGrants | 拒／接 | 拒 |
| action_key/actionKey | 拒／接 | 拒 |
| user_self_model/userSelfModel | 拒／接 | 拒 |
| assistant_profile/assistantProfile | 拒／接 | 拒 |

非只扫描，core.promote payload executionLease holder x expires2027返回耐久记录，大小写击破“助手权威态非用户身份、权限、秘密”边界，可绕租约安全非权限不变量19。同原比较还漏credentials/secrets/tokens/apiKeys/privateKeys，token/access_token拒。

修名字camelCase拆、非字数段一_、小写，秘密容尾s，引用*_ref/refs/handle/handles/id豁免，grant_ref/token_ref合法，credentials不。

### 缺陷2（高）——旧会话引用命名新活具身

裸单调计数器复现：

```text
core A:      connectEmbodiment(...)  -> emb-1        (device dev-OLD)
snapshot -> restoreAssistantCore     -> new core, counter reset to 0
new core:    connectEmbodiment(...)  -> emb-1        (device dev-NEW, assistant a2)

restored.attestEmbodiment('emb-1') -> { valid: true, assistantId: 'a2', deviceId: 'dev-NEW' }
restored.promote('emb-1', ...)     -> promoted_by.device_id === 'dev-NEW'
```

旧ref被另一助手／设备valid attested，陈旧设备可用另一设备来源promote。违自身D8恢复旧handle应unknown/EMBODIMENT_NOT_CONNECTED与本地cache恢复重取权威；D7已给record防恢复碰撞却漏embodiment。

ref现emb-e<epoch>-<n>，旧新不可等；旧UNKNOWN_EMBODIMENT、promote EMBODIMENT_NOT_CONNECTED，符合D8。

### 缺陷3（高）——恢复绕全部提升guard

validateCoreSnapshot只外assistant_id/arrays/revision，applySnapshot直克隆。

```text
snapshot.assistants[0].records[0].payload = { executionLease: { holder: 'attacker' } }
restoreAssistantCore(snapshot)  -> accepted; readDurable('a1') returns that payload
```

同路还接受原始秘密、promote禁止DEVICE_EPHEMERAL、SCRATCH_REASONING瞬态kind作durable、词汇外受众。提升契约仅强如最弱准入路径，恢复把非事实复活。

snapshot就是耐久态，现同提升guard：profile引用、kind、scope拒ephemeral、受众、payload对象与各记录禁态／秘密，加因果事件结构验证。

### 缺陷4（低）——undefined与null同幂等指纹

stableStringify undefined键作null，同key先{a:undefined}后{a:null}误replayed:true、丢不同第二意图。现过滤undefined，缺失与null不同，第二IDEMPOTENCY_KEY_REUSE。

### 有意不修限制

篡snapshot OWNER_PRIVATE改合法PUBLIC_CHANNEL无法检测，结构与合法公开相同。需逐记录完整性digest，契约无，是后任务特性非修。回归明确validateCoreSnapshot(relabelled).ok===true暴露界限；词汇外受众仍拒且测试。

## 3. 可靠攻击覆盖

| 攻击 | 结果 |
|---|---|
| OWNER_PRIVATE请求PUBLIC_CHANNEL投影 | AUDIENCE_NOT_PERMITTED扣留 |
| 求不存在scope | SCOPE_NOT_REQUESTED |
| durable提升DEVICE_EPHEMERAL | EPHEMERAL_SCOPE_CANNOT_BE_PROMOTED |
| transient走durable | EPHEMERAL_STATE_CANNOT_BE_PROMOTED_AS_IS |
| durable走transient | DURABLE_KIND_REQUIRES_PROMOTION |
| expectedRevision缺／非整数 | REVISION_CHECK_REQUIRED |
| 新key旧revision | STALE_REVISION |
| 复制profile字段 | INVALID_PROFILE_REFERENCE，仅profile_ref/revision |
| 一emb断另留 | 助手活、handle消失 |
| 进程内reload后旧handle | EMBODIMENT_SESSION_EXPIRED、scope_stale:true |
| 同逻辑载荷异键顺序 | 正确重放 |

## 4. 未规定决策

**C1** 统一扫描正规化无调用改，提升两个guard都经它，同EM-001。

**C2** epoch入ref而非snapshot种子计数。种子仍再次到同计数时撞旧ref，要比调用者未知epoch；入字符串结构避免代价长ID，选。

**C3** restore全记录非仅提升字段，部分会仍绕瞬态durable，违恢复验收。恢复已遍历，成本一线性扫描。

**C4** 不是扩大，验证器已存在已被调用，只未检查承诺不变量，恢复验收归本范围。

**C5** 不写演进，与BA-001/EM-001/RF-001理由，schema MB迁移无BA。

## 5. 修复与回归

core.mjs增加名字正规化／外部禁集／复数秘密、epoch句柄、记录／事件／scope／受众／payload snapshot验证、fingerprint过滤undefined。conformance新增五：另类拼写权限用户态拒；复数camel秘密拒；旧epoch不命名活emb；篡snapshot不能装权限秘密不提升scope未知受众；不同载荷key拒非重放。

每项拒加合法邻例grant_ref、credential_ref、真实snapshot仍恢复、真实retry仍重放，不能靠全拒。

## 6. 测试

| 检查 | 原结果 |
|---|---|
| 公共API恶意探针 | 修后上述全拒，运行证据记录 |
| node --test contracts/assistant-core-v1/tests/conformance.test.mjs | 19过0败，14＋5 |
| node --test tests/*.test.mjs | 120过0败 |
| node --test apps/rooms/tests/*.test.mjs | 69过0败 |
| node city/test-all.mjs | 1801过0败 |
| node scripts/verify-promotion-history.mjs | d3fbf6c40c69本地Git验证10 |
| node scripts/check-bilingual.mjs | docs/evidence/data-records PAIRED |
| e9add9d1773e46087f032e47572bf69420b3710f 的CI 36716375960 | gateway-web/android成功 |

修后无失败14原样全过证明未弱契约。所有缺陷独立探针发现非失败测试，与BA001/EM001同。

## 7. 跨任务未解决

- snapshot无逐记录digest，可篡任何合法值受众等；需promote算restore验，明确未主张后任务接口，不解决也不隐藏。
- BA-003消费句柄，新emb-e格式，不可解析旧数假定。
- BA-008租约，本拒任何拼写lease字段但不实现语义，lease_ref仍接口。
- BA-005真实Digital-Me访问，本捕digitalMe/DIGITAL_ME/userSelfModel强化自身隔离。

## 8. Owner待项

1. snapshot完整性真实未闭恢复信任孔，目前自产进程内有界，未来磁盘／传输成攻击面，须定任务归属。
2. 演进问题仍开。

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Mech
CORRECTION_HOST     = Alien   (different physical host — two-host gate satisfied)
CORRECTION_HEAD_SHA = e9add9d1773e46087f032e47572bf69420b3710f
BRANCH_CI           = 36716375960 — gateway-web success, android success
MERGE_STATUS        = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```
