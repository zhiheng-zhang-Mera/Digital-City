# BA-003 纠正报告 — 设备化身与前台绑定

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = BA-003 (Butler Assistant programme)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-003-device-embodiment-binding.md
CLAIM_COMMIT         = ffb3aad (Digital-City main, claim of BA-003 Correction by Alien)
CLAIMED_AT           = 2026-09-30T13:20:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = eb3b1a1233a05c056dcc366341c76e0a20faa2f5
DEVELOPMENT_CI       = 36717697673 — gateway-web success, android success
CORRECTION_BRANCH    = assistant/BA-003-device-embodiment-binding
CORRECTION_HEAD_SHA  = 4bfd2562fdf31b9a86f980fd8ad9b4a2a0a14b7e
BRANCH_CI            = 36721785776 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = root 123 pass, rooms 69 pass, city 1801 pass, promotion-history OK, docs SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. 独立审查方法

与 GAI001 同因再次进行两审查：重叠不完整，分歧有信息价值。自身探针对本会话三个同级契约确认的缺陷类别：原始拼写比较、key in spec、保留原型键、计数器身份；另一个独立上下文审查 agent 接受需证伪的保证，仅报告可复现发现。

agent 找到自己未达五缺陷，自己找到两个最严重项，共八确认缺陷，开发套件完全未捕获。

本次审查过程缺陷明确记录：agent 审查期间自己同时编辑 worktree，因此首份报告声称“已提交修订无法通过自身一致性套件”。这是错误读版本：提交测试只有 14 项，git show HEAD: 证明提交 descriptors.mjs 仍 key in EMBODIMENT_DESCRIPTOR_SPEC，registry.mjs 仍 foreground-${bindingCounter}，提交源码与提交测试一致，所以开发 CI 36717697673 绿。agent 对源码运行的 17 测试是本 worktree 未提交修复，混合提交源码和工作树测试。经验：纠正审查必须用冻结副本，不能用自身主机正在修的树。其他发现不受影响且独立确认。

## 2. 独立审查发现

### 缺陷 1（高）— Object.prototype 继承的未声明描述符键

descriptors.mjs 使用 if (!(key in EMBODIMENT_DESCRIPTOR_SPEC))，in 遍历原型链，使 toString、valueOf、hasOwnProperty、constructor、isPrototypeOf、propertyIsEnumerable、toLocaleString 全被当声明字段，JSON.parse 自身 __proto__ 也通过。原报告称这是第四个同错误契约，并列 BA001、GAI001、BA003。修复为自身键查找，加每深度保留键拒绝。

### 缺陷 2（高）— 竞争身份保护比较原始拼写

COMPETING_IDENTITY_FIELDS 每概念维护两拼写，如 butler_device_id／butlerDeviceId，易过期。以下都指竞争物理身份且都通过：

```text
deviceKey   deviceTrustState   DEVICE_KEY   local_device_identity
localDeviceIdentity   butlerDeviceKey   butler_device_identity   device_identity_key
```

该保护是阻止 Butler 创建工作簿禁止、Remote Fabric 所有物理设备命名空间的唯一机制。现在规范化名称，对概念模式匹配；合法 device_identity_ref 仍通过有断言，使规则不能靠全拒满足。

### 缺陷 3（高）— 物理设备唯一性只首次注册检查

registerEmbodiment 全局重复设备检查位于 if(existing) 刷新分支之后，刷新不运行，因此同设备可建模两次：

```text
register  embodiment-a  -> device X
register  embodiment-b  -> identity_source UNAVAILABLE (no device yet)
refresh   embodiment-b  -> device X                     -> ACCEPTED
bind      both to foreground                            -> both hold a foreground assistant
assertSingleForegroundPerDevice()                       -> { devices: 2, ok: true }
```

一物理设备两前台助理违反保证 1，而套件认证不变量竟报告成功。检查现移至刷新分支前，构造上不可达。

### 缺陷 4（高）— 单前台不变量永不能失败

assertSingleForegroundPerDevice 将按 embodiment_ref 键控的 Map 条目又按同键计数，每键一个不可能超过一，断言空洞，故缺陷 3 在绿套件中隐形。现在按物理身份计数，无 Remote Fabric 身份时回退化身引用；回归与独立计算对照设备数量。

### 缺陷 5（高）— 前台绑定引用来自重启归零计数器

binding_ref 为 foreground-${bindingCounter}，restoreEmbodimentRegistry 重置计数，丢弃快照 binding_ref 并重新派生。重启前字符串被给不同绑定，revalidateEmbodiment 恰比较该值：

```text
before restart:  device A -> foreground-1
after  restart:  device B -> foreground-1          (same string, different binding)
device A revalidates with its pre-restart reference
                 -> ok: true, AUTHORITATIVE_AGREEMENT
```

自身恢复契约要求各设备行动前重新验证，重启不能继续旧本地假设；D7 已区分四种原因，复用 ID 却将旧信念报告为一致。这与本主机 BA002 修复 emb-1 同缺陷，作者考虑记录 ID 碰撞却未用于会话 ID。

现在引用按 epoch 分域为 foreground-e<epoch>-<n>，恢复推进 epoch，重启前后不等。作者恢复后期待 AUTHORITATIVE_AGREEMENT 的测试改为 STALE_LOCAL_BINDING，理由写在测试。

### 缺陷 6（中）— 恢复绑定报告 LIVE_SESSION

restoreEmbodimentRegistry 返回 restored_foreground 的 source:RESTORED_FROM_AUTHORITY 却不写来源，随后 getForeground／snapshot 同绑定为 LIVE_SESSION，BINDING_SOURCES 否则无用。现在写路径以独立 markForegroundRestored 记录，bindForeground 不能自行声明来源。

### 缺陷 7（中）— CAS token 字段错误

switchForeground 用 expectedForegroundRef 对 assistant_ref。调用者拿被告知保留的绑定 handle 总 FOREGROUND_MISMATCH，传助理名却静默成功；设备 A→B→A 又匹配助理，接受过期 A 视图，击穿防旧视图机制。现在对绑定引用，更新作者三调用点，加助理名拒绝案例。

### 缺陷 8（中）— session_ref 无类型，重新附着保留旧会话

attachAssistant 将任意对象直接存持久权威；不同会话重新附着却 idempotent:true，仍记录旧会话，误导后续读者。现在 session_ref 为文本或 null，不同会话为 session_updated:true、idempotent:false。

## 3. 攻击后成立，不需修复

| 攻击 | 结果 |
|---|---|
| 一设备绑定第二前台助理 | FOREGROUND_ALREADY_BOUND。 |
| 未附着助理前台 | ASSISTANT_NOT_ATTACHED。 |
| 旧视图 CAS | 拒绝，无状态变更。 |
| 分离后再附着 | 不恢复前台。 |
| 伪造重复前台快照 | 原子拒绝。 |
| 所有任务变更尝试 | 拒绝；切换／分离任务表字节不变，port 仅观察方法。 |
| 切换／分离／恢复设备本地状态 | 释放，构造上不进 snapshot。 |
| 普通／JSON 转义未知键 | 拒绝，agent 不能用 "\u005f\u005fproto\u005f\u005f" 绕过。 |
| ui_surfaces:['NONE'] 排他性 | 拒绝。 |
| identity_source 与 device_identity_ref 不一致 | 双向拒绝。 |
| deviceIdentityReference 形状、dev-<32 hex> | 落实。 |

## 4. 工作簿未指定决定

**C1 — 接受 agent 提交修订失败声称？** 不接受。git show HEAD: 证明提交测试／源码一致、开发 CI 绿；接受会“修复”未坏版本并写入假陈述。

**C2 — 修不变量键还是删空洞断言？** 修键。值得保留，只是测错东西；删除会使保证 1 无跨设备检查。

**C3 — CAS token 改动。** 工作簿要求切换不由旧视图驱动但未命名 token；仅 binding_ref 随绑定改变，唯一能查旧视图。更新作者测试而非保留无效 token，明确记录避免误读为弱化，实际加强。

**C4 — 重新附着语义。** 未规定同助理同设备新会话；可拒绝、忽略、视为会话变更，选变更。附着是 presence 而非 authority，新会话为真实事件；拒绝使重连客户端不能附着。这是策略选择。

**C5 — Android／Computer-Use 验收。** 与开发 D11 一致，未用：契约／会话层无 UI／设备界面。Owner 仅在验收需要时授权 Android Studio／Computer-Use，本任务不需，故不声称设备观测。

**C6 — 演进事件。** 未写，沿 BA001 D11、BA002 C5、EM001 D13、GAI001 C6、RF001 D8、RF002 D13。contracts/evolution 模式仅迁移范围，无 BA003 事件能验证，扩展会触冻结 contracts/**。

## 5. 修复与回归

| 文件 | 变更 |
|---|---|
| contracts/assistant-embodiment-v1/descriptors.mjs | 自身键检查、保留原型键、normalizeFieldName、概念竞争身份模式、保留键扫描。 |
| contracts/assistant-embodiment-v1/registry.mjs | 重复设备检查前移、物理身份不变量、epoch binding_ref、markForegroundRestored、绑定引用 CAS、文本／null session_ref 和会话变更。 |
| contracts/assistant-embodiment-v1/tests/conformance.test.mjs | 八回归，两作者测试纠正：缺陷 5 恢复预期、缺陷 7 CAS token。 |

新增回归名称逐项为：

1. `undeclared keys inherited from Object.prototype are refused, and a prototype key never is a descriptor field`：拒绝继承未声明／原型键。
2. `a competing physical-device identity is refused in every spelling`：各种拼写竞争身份拒绝。
3. `a foreground binding reference is never re-issued across a restart`：重启不重发引用。
4. `a physical device cannot be claimed twice, including by refreshing an unidentified embodiment`：含未识别化身刷新也不能重复占设备。
5. `the single-foreground invariant is derived from physical device identity`：不变量物理身份派生。
6. `a restored binding keeps its recovery provenance on every later read`：后续读保留恢复来源。
7. `the foreground compare-and-set token is the binding reference, not the assistant`：CAS 为绑定引用非助理。
8. `re-attaching with a different session is a session change, not an idempotent repeat`：新会话不是幂等重复。

每负断言配合法邻近例：干净描述符、device_identity_ref、同会话重复附着、真实快照仍可恢复、ENGINEERING 式普通值，故保护不能全拒满足。

## 6. 测试总结

| 检查 | 结果 |
|---|---|
| 自身与 agent 各版本恶意探针 | 每确认缺陷修前复现、修后拒绝。 |
| node --test contracts/assistant-embodiment-v1/tests/conformance.test.mjs | 22 通过／0 失败，14 开发 + 8 新增。 |
| node --test tests/*.test.mjs | 123 通过／0 失败。 |
| node --test apps/rooms/tests/*.test.mjs | 69 通过／0 失败。 |
| node city/test-all.mjs | 1801 通过／0 失败。 |
| node scripts/verify-promotion-history.mjs | eb3b1a1233a0 本地 Git 历史验证 10 记录。 |
| node scripts/check-bilingual.mjs | docs／evidence／data-records PAIRED。 |
| 4bfd2562fdf31b9a86f980fd8ad9b4a2a0a14b7e 的 GitHub CI 36721785776 | gateway-web success、android success。 |

FAILURE_REPAIR_SUMMARY：修复后两个作者测试刻意失败，编码缺陷 5、7，即依靠计数归零的恢复预期与不能查旧视图的 CAS。两者修正并在测试写理由，其余开发测试原样通过，没有任何修复被撤回。

## 7. 跨任务接缝（记录而非解决）

- BA009 职责／权限与 BA008 租约／重连消费附着。session_ref 现文本或 null，新会话 session_updated；把重新附着视为 no-op 的消费者需处理变化。
- BA007 与 Web／Android 读 getForeground／snapshot 来源。恢复现 RESTORED_FROM_AUTHORITY，客户端应据此决定行动前重新获取。
- 设备客户端是真正保证 1 消费者。缺陷 3 关闭后物理设备一前台助理构造上成立，认证不变量不再空洞；但仓库尚无消费者，因此所有缺陷潜伏而非用户可见。
- RF001 拥有物理身份。本契约所有路径拒绝同 device_id 第二化身，RF001 registry 需与该形态一致。

## 8. Owner 开放项

1. 审查隔离是本任务暴露的过程问题。自己并发编辑导致一项可测错误发现，建议剩余纠正给审查者冻结副本或独立 worktree。
2. identity_source:UNAVAILABLE 意味化身可早于 Remote Fabric 身份存在。无身份能否拥有前台是产品问题，本契约回答“可以，按自身键控”；Owner 可要求先 device_id 再绑定。
3. C6 演进信息流问题仍待 Owner。

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Mech
CORRECTION_HOST     = Alien   (different physical host — two-host gate satisfied)
CORRECTION_HEAD_SHA = 4bfd2562fdf31b9a86f980fd8ad9b4a2a0a14b7e
BRANCH_CI           = 36721785776 — gateway-web success, android success
MERGE_STATUS        = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```
