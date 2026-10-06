# RF-004 开发报告：蓝牙引导与 IP 路径交接

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为完整中文阅读译文，保留历史观察，不产生新的阶段声明或验证结果。This is a complete reading translation; historical observations are retained without a new stage declaration or verification result.

```text
MISSION                  = RF-004 (Remote Fabric programme, task 4 of 10)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = e23787f (Digital-City main, "claim(RF-004): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T14:43:09Z
CONTROL_REVISION_AT_CLAIM= 25e4e48 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = remote/RF-004-bluetooth-bootstrap-ip-handoff
IMPLEMENTATION_HEAD_SHA  = 3bcd4957f340441d15d0f780e980c6c56a0c6aa0
BRANCH_CI                = 36731611702 — success
LOCAL_CHECK_SUMMARY      = 106/106 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

以上原始元数据记录任务、阶段、开发主机、领取提交与时间、领取时控制版本、实现仓库、基线、分支、实现 SHA、分支 CI、本地检查、开发完成及禁止组件分支合并的状态；原值逐字保留。

## 1. 交付物

`contracts/remote-bluetooth-bootstrap-v1/` 包含 `bootstrap.mjs`（BLE 传输端口及测试替身、引导载荷、接收／交接／扫描、公开限制）、`index.mjs`、5 项测试套件和根目录 `tests/remote-bluetooth-bootstrap.test.mjs`。

验收要求与测试的对应关系：

| 必需验收项 | 对应测试 |
|---|---|
| 蓝牙是汇入唯一信任协议的引导入口 | 引导载荷是配对路径的指针，永远不是信任；`entry_point: 'DISCOVERY_BLUETOOTH'`、`converges_on_pairing: true` |
| 携带载荷不授予信任 | 同一测试拒绝声称信任的载荷（`BLUETOOTH_IS_NOT_TRUST`）；每个载荷与返回结果均为 `grants_trust: false` |
| MAC 地址永远不是权威依据 | 决策从不查询 MAC 地址；拒绝 MAC 形状的设备 ID，身份只能来自密码学身份 |
| IP 交接在新路径上重新验证身份 | IP 交接要求已有信任，并在新路径上重新验证指纹 |
| 已观察广播不能重放 | 过期或重放的引导被拒绝，且不会留下部分状态 |
| 引导流量有界 | 扫描有界且载荷严格校验 |

## 2. 决策日志（问题 → 选项 → 选择 → 理由）

**D1：领取哪项任务。** 扫描结果：没有属于自己的修复任务，也没有 Mech 可领取的 Correction；唯一由 Alien 开发的任务 EM-003 已由 Alien 进行纠正。因此进入开发层级，选择 RF-004，因为 Remote Fabric 是其他计划跨设备门槛所依赖的底层基础。这与 RF-003、RF-001 记录的关键路径理由一致。

**D2：蓝牙实际携带什么？** 选项：（a）信任断言；（b）完整凭据交换；（c）小型邀请指针。选择（c）：设备 ID、指纹引用、一次性 nonce、最多八个 IP 候选地址及 TTL。接收路径返回唯一配对协议所期待的入口，而不返回信任状态。理由是不变量 1（多种加入方法、一个信任协议）及不变量 3（MAC 仅是可选本地证据）。对于声称信任的载荷直接拒绝，而不是清洗字段，因为调用者若据 `grants_trust: true` 行动，就会把无线信号当成依据，而非配对路径。

**D3：何时实际验证身份？** 选择在 IP 交接时验证：既要求该设备已有 `TRUSTED` 记录，又要求在新路径上提供的指纹匹配；返回 `verified_over_new_path: true` 和 `bluetooth_carried_trust: false`。引导路径可能短暂、薄弱、可观察，因此身份检查必须发生在工作实际执行的位置。新路径指纹不匹配（`FINGERPRINT_MISMATCH`）正是不变量防范的失败。

**D4：重放。** nonce 在每个引导权威范围内只能使用一次，所以观察到同一广播两次时拒绝（`BOOTSTRAP_REPLAYED`），不同 nonce 则是不同邀请。BLE 广播可被观察；没有一次性 nonce，攻击者可能转发捕获的邀请。接收时评估 TTL，过期引导完全不返回入口，避免部分状态。

**D5：流量有界。** 选择限制扫描轮数（`MAX_SCAN_ROUNDS = 16`）、IP 候选数（`MAX_IP_CANDIDATES = 8`）及载荷大小。桥接层和适配器都以 `UNBOUNDED_SCAN_REFUSED` 拒绝无界请求。工作簿以 RF-003 的术语要求发现流量有界，而无线扫描最容易被放任为无界。

**D6：代码位置。** 选择契约模块 `contracts/remote-bluetooth-bootstrap-v1/`，与 RF-003 D1 相同，把 City manifest／census／文档编辑留给已经进行了这些编辑的两条兄弟分支。

**D7：不提供 `schema.json`。** 与其他组件分支一致。

## 3. 测试汇总

5 项测试全部通过：引导作为指针，包含信任声明拒绝和传输端口标志；MAC 不作权威，拒绝 MAC 形状及格式错误身份；过期和一次性 nonce 重放，并接受新 nonce；交接路径，包括不受信任、隔离、错误设备、任一侧错误指纹、未广播地址、重复交接及成功验证交接；扫描边界与载荷严格性，包括候选数量、地址形状、空 nonce、格式错误时间、缺少适配器、未知引导引用。

## 4. 本地检查与 CI

| 检查 | 结果 |
|---|---|
| `corepack pnpm test` | 106 项，106 通过，0 失败；101 项基线加 5 项新增 |
| `node scripts/verify-promotion-history.mjs` | OK，在 82ed36933fb4 验证 10 条记录 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 失败 |
| `node city/test-all.mjs` | 0 失败 |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36731611702，提交 3bcd4957f340441d15d0f780e980c6c56a0c6aa0 | success |

## 5. 交给兄弟任务的集成接缝

- RF-002（配对／信任）：接收到的引导恰好产出 `startSession` 记录的入口 `DISCOVERY_BLUETOOTH`，以及必须绑定的指纹；本模块不创建会话或信任。
- RF-003（本地发现）：二者为同一配对路径产生候选对象；合并时两种候选形状应成为同一抽象，让同一设备的蓝牙观察与 LAN 观察汇合。
- RF-001（设备身份）：以数据消费 `device_id`，并按 `dev-<32 hex>` 校验；这里不铸造身份。
- RF-006（路径管理器）：交接结果（`path: 'IP_DIRECT'`、已认证、已加密）是输入；地址选择和回退归 RF-006。
- RF-009（在线状态）：交接不代表 presence；接收端在产生副作用前仍须重新验证。
- 平台适配器（Windows／Android）：真实 BLE 适配器实现三方法端口；上层内容不变。

## 6. 留给 Correction 主机／Owner 的开放项

1. 对抗审查应尝试在交接后重用引导，使用同一设备另一安装实例的信任记录进行交接，以及通过反复单轮调用突破扫描边界。
2. 确认 D3：在交接而非引导时验证，是预期协议形状。
3. 确认 IP 候选应逐地址重新验证，还是每设备验证一次。
4. evolution-feed 问题仍待 Owner 决定。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_REMOTE_PROJECT_MERGE
```

以上原始结论声明 Development 完成、Correction 可由 Alien 而非 Mech 执行；在 Remote 项目合并之前禁止合并。保留历史结论，不作新的验收声明。
