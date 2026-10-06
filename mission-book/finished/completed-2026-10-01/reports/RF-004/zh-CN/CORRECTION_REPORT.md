# RF-004 纠正报告：蓝牙引导与 IP 路径交接

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = RF-004 (Remote Fabric programme, task 4 of 10)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-004-bluetooth-bootstrap-ip-handoff.md
CLAIM_COMMIT         = 7f04b5e (Digital-City main, claim of RF-004 Correction by Alien)
CLAIMED_AT           = 2026-09-30T16:12:44Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 3bcd4957f340441d15d0f780e980c6c56a0c6aa0
DEVELOPMENT_CI       = 36731611702-success
CORRECTION_BRANCH    = remote/RF-004-bluetooth-bootstrap-ip-handoff
CORRECTION_HEAD_SHA  = 1bd7b13fc06c61d007c8fc6a1af7f9b5d8ec3514
BRANCH_CI            = 36743616282 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = RF-004 9 pass, root 110 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 3bcd495, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

原始元数据保留任务、计划、两主机、控制工作簿、领取及基线、开发和纠正 SHA／CI、测试与禁止组件分支合并、纠正完成状态。

## 1. 独立审查方法

两次审查针对开始审查前取得、逐字节验证的不可变导出（`frozen-3bcd495`，三个文件 `match=True`）。这是第十次使用这种隔离方式。通过在修复模块上重放原始复现并执行成对回归测试验证修复。

## 2. 已确认缺陷与修复

审查者确认十一项，本主机独立确认七项，合计十种不同机制。作者套件始终 **5/5 通过——每个缺陷都在其测试从未进入的路径中。**

| id | 严重度 | 机制 | 修复 |
|---|---|---|---|
| C1 | **critical** | 重放保护 `Set` 按对象身份键控，未要求文本 nonce，导致同一广播铸造多个引导及多个 `IP_DIRECT` 交接 | 查询 Set 前要求 nonce 为非空文本 |
| C2 | **high** | 未验证载荷自身 `expires_at`；缺失、不可解析、远期值均跳过拒绝 | 要求真实时间且处于有界窗口 |
| C3 | **high** | 不可读时钟完全跳过过期检查，默认时钟返回 `null` | 不可读时钟返回类型化拒绝，而非绕过 |
| C4 | **high** | `handoffToIp` 不重新检查窗口，120 秒引导可在十年后交接 | 记录保留 `expires_at`，交接重新检查并可到达已声明 `EXPIRED` 状态 |
| C5 | medium | 接收路径未验证 `ip_candidates`，接受 5000 项，字符串被展开为字符，`'a'` 成为已认证地址 | 与创建路径一样验证数组、上限、地址形状 |
| C6 | medium | 载荷无需为仅有自有属性的普通对象，身份字段可来自继承 | 要求普通对象 |
| C7 | medium | 静默接受未知字段 `mac`、`ble_name`、`trusted`、`__proto__`、`constructor` | 通过 `Reflect.ownKeys` 实施显式载荷允许列表 |
| C8 | medium | `ttlMs` 只受单侧约束，`MAX_SAFE_INTEGER` 导致无类型 `RangeError` | TTL 上限；以类型化防护构造计算所得时间 |
| C9 | medium | `isIsoInstant` 仅检查形状，不可能日期通过后在 `toISOString()` 崩溃 | 日历往返验证 |
| C10 | low | canonical 记录未存 nonce，重放保护不可审计；交接回显未经验证的 `at` | 保留 nonce，验证交接时钟 |

核心缺陷是 C1／C2／C4 的组合：引导本应是短生命周期的指针，但冻结版本的窗口由调用者控制、未验证、时钟不可读时跳过，交接时也不再查询。同一广播若缺少 `expires_at` 或使用遥远未来值，就可永久成为已认证、加密 IP 路径的依据。

## 3. 对审查者声明的核对

- 审查者 **D1**（getter-nonce 重放）由 C1 关闭：要求 nonce 文本，在查询 Set 前拒绝返回对象的 getter。
- **D9**（未保留 nonce）、**D6**（普通对象）、**D7**（候选）、**D8**（未知字段）分别对应 C10、C6、C5、C7。
- **D10**（传输替身按引用保留 `advertisements`）在 C10 提交中修复：构造时复制脚本。另一半——可变 `__scans` 检查数组——记录于下方。
- **D11**（每实例计数器使两个实例生成同一 `bootstrap-1`）记为边界：记录存于实例，未知引用被拒，所以引用天然是实例范围。集成时值得注意，但不是单实例缺陷。
- 记录审查者自己的阴性结果：这里**没有拒绝前变更**；每次拒绝都在 nonce／记录写入之前，拒绝接收不推进计数器。`RangeError` 只出现在 `createBootstrapPayload`，不出现在 `receive`。

## 4. 有意不修复项与边界

1. **传输替身的 `__scans` 仍为调用者可修改的实时数组。** 它是测试检查便利接口，作者套件读取它；冻结会改变替身形状而无验收价值，因此记录保留。
2. **`MAX_BOOTSTRAP_TTL_MS` 的十分钟是选择。** 工作簿未规定上限，作者默认 120 秒；导出该值以便裁决。
3. **`bootstrap_ref` 仍是实例范围计数器。** 声明保证实例内确定性，当前满足；把引用与内容绑定会改变公共形状。
4. **没有 Android 设备观察或 Computer-Use 会话**：这是无设备界面的纯模块。

## 5. 测试与 CI

作者套件保持不变，**5/5 通过**。套件由 **5 扩展到 9**，每项负面断言都有合法邻近案例配对：远期窗口被拒而窗口内接受；过期交接被拒而窗口内仍恰交接一次；字符串候选列表被拒而干净列表完整保留。

```text
node --test tests/*.test.mjs                -> 110 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 3bcd495)
node scripts/check-bilingual.mjs            -> SYNCHRONIZED
```

原始检查结果：根 110 通过／0 失败，rooms 69／0，city 1801／0（跳过 7），在 3bcd495 验证十条 promotion-history，双语同步。

实现 CI：**36743616282，gateway-web success、android success**，分支 `remote/RF-004-bluetooth-bootstrap-ip-handoff`，提交 `1bd7b13`。

## 6. 未明示决策（问题／选择／理由）

1. **何物限制引导窗口。** 选择：载荷须带真实时间，距 `advertised_at` 的窗口不得超过十分钟。理由：工作簿把蓝牙定位为引导指针，无界或缺失窗口使重放永久有效；限制不依赖时钟，因此纯调用者仍受约束。
2. **不可读时钟意味着什么。** 选择：类型化拒绝。理由：冻结版本把“不能读取时钟”当作“未过期”，与本计划修复的所有单侧界限一样是 fail-open 形状。
3. **交接时是否重查窗口。** 选择：是，记录保留 `expires_at`。理由：接收到的引导是某时刻的声明，交接才是关键时刻；`EXPIRED` 原本只是无法到达的已声明词汇。
4. **载荷严格到何程度。** 选择：显式允许列表。理由：九个兄弟契约因相同原因（原型链成员测试或根本不测试）接受未知字段；canonical 记录不应成为传输扩展落点。
5. **nonce 是否属于记录。** 选择：是。理由：下游无法审计的重放保护只有一半保证。

## 7. 如实记录自身错误

- 第一份补丁脚本因一个无效替换的锚文本不匹配，**写入前**中止。这是安全失败：文件未变；作者套件仍 5/5，提醒我没有修复落地。删除无效步骤后重跑。值得记录，因为“测试通过”恰好也是失败补丁的表象。
- 自己探针的两行错误或不准确：带虚构候选的交接标错标签；过期载荷控制先于字符串候选案例触发。均为探针错误，已在记录中纠正。
- 我未发现审查者 D1（getter nonce）和 D8（加允许列表前的未知字段）。D1 重要：它区分“nonce 被检查”与“nonce 可被检查”。

## 8. 结果

在机制层面修复十种不同机制，配对回归测试并重放原始复现。记录四个有理由的边界，核对两项审查者声明，作者套件从未被削弱。

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/remote/RF-004-bluetooth-bootstrap-ip-handoff.md
```

原始结论保留纠正完成及已更新控制工作簿路径，不代表本译文重新完成验收。
