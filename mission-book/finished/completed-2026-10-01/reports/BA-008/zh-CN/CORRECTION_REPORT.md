# BA-008 纠正报告 — 化身事件总线、执行租约与重连安全

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = BA-008 (Butler Assistant programme, task 8 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-008-embodiment-event-bus.md
CLAIM_COMMIT         = c4f82c6 (Digital-City main, claim of BA-008 Correction by Alien)
CLAIMED_AT           = 2026-10-01T02:04:49Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = f06cf316c87e710bf65092dbc96d76497eae3a79
DEVELOPMENT_CI       = 36741617086-success
CORRECTION_BRANCH    = assistant/BA-008-embodiment-event-bus
CORRECTION_HEAD_SHA  = 1070190c3bd39342780d2cb941123d9ab3666225
BRANCH_CI            = 36805605456-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = BA-008 23 pass (7 author + 16 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. 托管 CI

```text
development head   f06cf31 (Mech)   run 36741617086   success
first-pass head    a5f8093 (Alien)  run 36804531861   success   ← superseded by the review in §5
corrected head     1070190 (Alien)  run 36805605456   gateway-web success / android success
```

纠正提交在 GitHub 托管运行器上实际执行 `V0.2 checks` 工作流。本任务没有发生账单拒绝；每个已启动运行均完成真实步骤。

## 2. 独立审查方法

以 `git archive` 导出开发提交至 `D:\A-Utopia\.runtime\evidence\mission-book\BA-008\frozen-f06cf31\`。独立对抗审查者先被要求阅读工作簿，再仅针对冻结导出审查，返回 `probes/FINDINGS.md` 及 14 个可运行探针；其中 13 个复现机制，作者原有 7 测试均未捕获。

审查针对冻结开发提交，因此修复前先在第一轮提交重新测量发现。重新测量本身很重要：第一轮 6 项修复均成立（自身键白名单、普通原型规则、防循环冻结器、所有路径真实时间点、策略边界和负 `task_version` 边界），但 `a5f8093` 仍存在 13 个机制；两项审查陈述被证实是探针伪象而非缺陷（§5，D12）。修复并非缺陷的发现会构成虚假修复，所以先测量。

所有探针证据位于上述目录：

```text
probes/FINDINGS.md + probe-01..probe-14   the reviewer's frozen-head probes
run-probes-current.mjs + current-head/    the same probes re-pointed at a chosen head
probes-against-a5f8093.log                which findings were still live before this pass
probes-against-patched.log                the same probes after the repairs
pre-fix-check-second-pass.log             the corrected suite against f06cf31 (7 pass / 16 fail) and a5f8093 (10 pass / 13 fail)
gate-second-pass.log                      root / rooms / city / promotion-history / bilingual
```

该清单依次列出冻结提交探针、重定向至指定提交的运行器、修复前后探针日志、纠正套件在开发／首轮提交的区分性结果，以及第二轮全门检查。

## 3. 第一轮 — 6 个机制（提交 a5f8093，运行 36804531861）

| # | 机制 | 根因 | 修复 | 回归 |
|---|---|---|---|---|
| 1 | 规范白名单使用原型链成员关系，使 `toString`／`constructor`／`valueOf`／`__proto__` 通过“不属于规范契约”保护。 | `key in spec` | 对 `Reflect.ownKeys` 使用 `Object.hasOwn(spec, key)`。 | 有 |
| 2 | `isPlainObject` 接受类实例及外来原型，使规范记录可带继承行为。 | `typeof === 'object' && !Array.isArray` | 原型必须为 `Object.prototype` 或 `null`。 | 有（与 #1 合并） |
| 3 | 冻结器递归而无已访问集合，循环调用者值到达 `policy()` 时以无类型 `RangeError` 栈溢出。 | 无访问集合的递归 | 使用已访问对象 `WeakSet`。 | 纵深防御 |
| 4 | 时间点只验证形状；`2026-13-45T99:99:99Z` 和 `2026-02-30T00:00:00Z` 通过正则，随后静默归一化或令 `new Date(...).toISOString()` 抛原始 `RangeError`，而非有类型拒绝。 | 仅正则检查 | 信封规则、`clock()`、全部调用者时间点（10 个 `const at = when ?? now()` 及 3 个内联位置）采用分量往返 `isRealInstant`。 | 有 |
| 5 | 策略边界可关闭：`max_lease_ttl_ms: NaN`／`Infinity` 使全部租约长度比较失效，`require_action_key_for_exclusive: 'yes'` 为真值但不是 `true`。 | 调用者策略直接作为布尔／限制读取 | 两个 TTL 必须为正安全整数且 `default ≤ max`，动作键要求必须字面为 `true`。 | 有 |
| 6 | `noteAuthoritativeTaskVersion` 接受未验证时间点，以及后续发现的负版本（§5）。 | 缺失验证 | 相同真实时间规则与非负版本边界。 | 有 |

## 4. 第二轮 — 独立审查仍有效的发现（提交 1070190，运行 36805605456）

这些机制经重新测量仍存在于 `a5f8093`，在本轮修复。每项回归在 `a5f8093`（10 通过／13 失败）及开发 `f06cf31`（7 通过／16 失败）失败，在 `1070190`（23 通过）成功。

| # | 机制 | 根因 | 修复 | 回归 |
|---|---|---|---|---|
| D1 | 重连复活已被替代租约，产生两个同时有效独占租约。`reconcile` 不查 `leasesByScope` 就重新验证任何所列暂停租约；设备失去范围后重获权限，两持有者都能提交（probe-01、probe-13）。 | 撤销决定忽略范围当前持有者 | 若 SUSPENDED／ACTIVE 独占租约的范围已由另一 ACTIVE 租约持有，则撤销，使用 `REVOKE_ON_SUPERSEDED_SCOPE`，绝不恢复。 | 有 |
| D2 | 续期或重新分配后的重试使同一动作执行两次。消费记录键为 `effect:${lease_ref}:${action_key}`，两操作都为同一逻辑动作产生新 `lease_ref`（probe-02、probe-11b）。 | 幂等键绑定可变引用 | 按动作的 `action_scope` + `action_key` 建键；交接不是重复执行许可。 | 有 |
| D3 | `renewLease` 改键却未删除旧条目，一个租约在 `leases()` 出现两次；新引用可撞上其他持有者，使 B 有效租约不可访问而 A 可代为提交；`valid_exclusive_leases` 硬编码为 1，`validExclusiveLeaseCount` 重复统计别名对象（probe-02、probe-13）。 | 改键不删除，引用来自每租约计数器 | 引用来自每范围单调计数器；续期删除旧引用；两计数报告不同 ACTIVE 独占租约真实数量。 | 有 |
| D4 | `holder_ref` 可选，省略时可作为任意持有者续期／提交；`reassignLease` 完全不查持有者（probe-03）。 | `assertUsable(lease, at, holder_ref = null)` 遇 null 跳过 | `renewLease`／`commitSideEffect` 必须有动作持有者，缺失为 `INVALID_REQUEST`，不得绕过；若重新分配指定持有者，必须为当前持有者。 | 有 |
| D5 | 回填时间可绕过到期。决定使用调用者 `when ?? now()`，`expires_at` 前时间使过期租约重新 ACTIVE；`at: 0`／`'not-an-instant'` 产生永不比较为到期的 NaN（probe-04）。 | 调用者控制“现在” | 权限时间须为真实 ISO-8601 且不早于总线时钟，否则 `INVALID_REQUEST`，说明 authority cannot be rewound；`isRealInstant` 直接拒绝 NaN。 | 有 |
| D6 | 导出 `isIsoInstant` 仅查形状，`2026-13-01T00:00:00Z` 返回 true，只有首轮内部 `isRealInstant` 保护决定。 | 导出契约仅正则 | 导出辅助函数还要求有限 `Date.parse`，API 不再与决定路径矛盾。 | 有 |
| D7 | 重连重新验证是可选择启用的。缺 `lease_refs` 表示仍权威，缺 `task_versions` 条目视为版本匹配，`task_versions: 7` 静默忽略，使 `reconcile({authoritative:{}})` 重新验证全部、重连设备且报告 `authoritative_state_consulted: true`（probe-06）。 | 仅调用者提供时才查权威 | `authoritative.lease_refs` 必须为租约引用数组，否则 `INVALID_REQUEST`；带 `task_ref` 租约必须有匹配非负版本条目，否则撤销。 | 有 |
| D8 | 路由信任调用者标记。`routeOutput` 按 `candidate.available` 决定，将 PRIVATE 载荷交给总线已观测断连的设备（probe-07）。 | 决定读取调用者控制值 | 候选声明只能缩小总线自身 `deviceState`；已知断连设备无论声明如何均为 `DEVICE_UNAVAILABLE`。 | 有 |
| D9 | 过期和重放吸收受可选 `command_ref` 门控。带任务引用／版本但无命令引用事件跳过版本检查，仅动作键事件从不吸收（probe-08）。 | 保护受无关可选字段门控 | 重放身份有命令引用时用它，否则用动作键；带任务版本即运行过期检查。 | 有 |
| D10 | 拒绝协调后仍留下变更。循环冻结崩溃已在首轮修复，但 `DataCloneError` 在构建返回值时、租约已重新验证且设备已标为连接后发生，失败仍留下有效授权（probe-09）。 | 验证与变更交错 | 触及任何租约／设备状态前验证并克隆全部权威载荷和本地意图。 | 有 |
| D11 | 规范信封字段验证后丢失。`embodiment_kind`、`transport_ref` 未进事件；声明 `event_id` 被 `event:${seq}` 覆盖，无法查重复身份（probe-12）。 | 构建器硬编码身份、不解构声明字段 | 事件携带三个声明字段；声明 ID 必须唯一，总线拥有其生成 `event:<n>` 命名空间。 | 有 |
| D12 | 自身 getter 的 TOCTOU：验证值并非使用值。`checkShape` 读后 `publish` 再读，getter 可先给合法时间、再给 `NOT-AN-INSTANT`（probe-10d）。 | 验证和构建分别读取 | 每声明字段只读一次到快照；对象本身先检查普通对象／自身键白名单，快照同时用于验证和使用。 | 有 |
| D13a | `exclusive === true` 字面比较：`exclusive: 'true'`／1 产生非独占租约，不要求动作键且第二设备可占同范围（probe-11a）。 | 仅字面比较 | `exclusive` 必须是布尔，否则 `INVALID_LEASE`。 | 有 |

## 5. 经过测量并有意不“修复”的发现

两项审查陈述未通过重新测量，另三项描述作者套件编码的契约。将其记录为修复会造成虚假修复，因此作为边界记录；这些位置需要未来工作簿决定，而非静默本地更改。

| 发现 | 决定 |
|---|---|
| D12 `__proto__` 夹带 | 探针伪象而非缺陷。探针用 `{ ...eventFor(), __proto__: {...} }`，对象字面 `__proto__` 设置原型且不序列化，因此往返后是普通事件，`Object.prototype` 未被污染。真正自身 `__proto__` 键被自身键白名单拒绝，已直接验证；没有为此“修复”。 |
| D13b 提交时租约动作键不绑定 | Owner 边界。作者 `conformance.test.mjs:234` 用声明 `'action-key-1'` 的租约提交 `'post-reconcile'`，断言效果实际执行，与审查建议相反。绑定两键会破坏契约，所以由动作键 registry（D2）承载幂等保证。声明键现在至少可在 `leaseProjection` 观测。 |
| D8 `in_audience` 为调用者断言 | Owner 边界。模块无受众／绑定 registry，作者 `conformance.test.mjs:252-256` 给从未见过设备传该标记。不虚构范围外 registry 就不能独立验证成员资格。修复的是总线可知的自身设备状态；未知设备仍被信任为可用。 |
| D5 已发布事件 `at` 可落后时钟 | 有意不对称。延迟或离线同步事件记录已经发生的事情，发布不授予权限，所以 `publish` 接受滞后时间，所有权限操作则拒绝。拒绝滞后事件会使重连同步输入不可能。 |
| 匿名重新分配（probe-03／probe-14） | Owner 边界。模块 `reassignLease` 无动作方身份，作者 `conformance.test.mjs:186` 也不指定；匿名交接记录 `acting_holder_ref: null` 而非受信任，指定错误持有者现在会拒绝。强制动作权限需要工作簿级 actor 契约。 |

审查覆盖探针继承的惰性词汇与契约问题已重新确认，在这里没有可达行为后果：`UNKNOWN_DEVICE`／`AUDIENCE_NOT_PERMITTED`／`PRIVACY_WITHHELD` 声明但从不抛出；`ROUTING_REASONS.WATCHER` 不发出；设备身份是未绑定调用者字符串，因此设备自动创建为连接（设备 registry／认证超出模块范围）；没有交付／确认生命周期或游标／缺口报告；`broadcast: false` 和 `private_response_broadcast: false` 是逐候选循环构造上成立，而非实测；`holdsExclusive` 的 `except_lease_ref` 仍无调用者传入。

## 6. 本地测试总结

```text
corrected module                    23 tests / 23 pass / 0 fail
first-pass head a5f8093             23 tests / 10 pass / 13 fail   ← the second-pass regressions are the difference
development head f06cf31            23 tests /  7 pass / 16 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

作者 7 测试与开发提交字节一致，全部通过；新增覆盖是 16 个 Alien 回归，首轮 3 个、第二轮 13 个。证据为 `frozen-f06cf31/`、`frozen-a5f8093/` 字节导出，`pre-fix-check-second-pass.log`、`probes-against-a5f8093.log`、`probes-against-patched.log`、`gate-second-pass.log`。

## 7. 披露

- 第一轮在独立审查返回前已推送 `a5f8093` 并取得托管 CI 36804531861 全绿，但没有报告完成；工作簿保持 `IN_PROGRESS` 直到第二轮关闭上述 13 机制。首轮仅 3 回归的套件完全没捕获这些机制，正是需要独立对抗审查的原因。
- 自身工作的每次失败均保留而非隐藏：§3 六机制，自己的首轮探针通过而审查者在开发提交的探针证伪；以及 §5 两项重新测量证实为探针伪象的审查陈述。
- 本任务未将账单拒绝记为代码失败；每个启动托管运行均执行真实步骤。
