# Verification Report — MB-009

```text
MISSION = MB-009
ROLE = VERIFICATION
HOST = Alien
MIGRATION_HOST = Mech
IMPLEMENTATION_BRANCH = mission/MB-009-theme-relocation
MIGRATION_HEAD = d338152b0c7ef2ef7e94d78901454ea91f200156
FINAL_BRANCH_SHA = 40660e7479931b2218d28a8400a69f20c4a97b81
FINAL_BRANCH_CI = PASS — run 36596639671 (V0.2 checks) on 40660e7479931b2218d28a8400a69f20c4a97b81
MERGED_MAIN_SHA = b4bd602971abe83083cd72ab8247d9bd50371f57
VERIFICATION_COMPLETE = true
```

- **Verification claim:** 2026-09-29T16:02:49Z, City claim commit `4ac89ca4b22cdbb03e5eb275464f6d1137e4c0ce`.
- **Rule 5:** migration host `Mech`, verification host `Alien` — different hosts.
- **Rule 9 order:** §1 was written and recorded as events *before*
  `reports/MB-009/MIGRATION_REPORT.md` was opened. §2 is the reconciliation.
- **⚠ §5 records a cross-mission conflict discovered at merge time and how it was resolved. It needs Owner visibility.**

---

## 0. 任务选择 / Why MB-009

Selection was re-made against the latest Digital-City `main` (`0764924`) immediately before claiming,
as rule 3 requires. Every enabled Mission now had `migration_complete: true`, so the
migrated-but-unverified set decided by `SEQUENCE` ascending: `MB-003` is `BLOCKED_OWNER_DECISION`,
`MB-006`/`MB-007`/`MB-008` are closed to `Alien` by rule 5 and rule 13, and `MB-004`/`MB-005` had
just been completed by this host. `MB-009` was the lowest-sequence eligible mission — and the last
one open to `Alien`.

---

## 1. 独立审查 / Independent review

> 本节在阅读 Migration Report 之前记录。审查对象只有：冻结 donor、目标代码、diff、测试与运行状态。

### 1.1 审查范围 / Scope

| 项目 | 值 |
| --- | --- |
| 迁移分支 | `mission/MB-009-theme-relocation` @ `d338152b0c7ef2ef7e94d78901454ea91f200156` |
| merge-base with `main` | `c7ef3cd1c6be0155332d03afc3607dfdbf49c205` |
| 迁移形态 | **物理搬迁**：`city/11-entertainment/01-entertainment-centre/theme-engine` → `city/00-foundation/05-control-centre/theme-engine` |
| 规模 | 29 文件、63 insertions / 26 deletions（大多数是 0 行改动的纯移动） |

### 1.2 Code / diff findings

- **F1 — 搬迁是纯的。** 模块内 19 个文件里 **16 个与 `origin/main` 的 blob 完全一致**（逐 blob hash 比较）。
- **F2 — 另外 3 个只有引用差异。** `DONOR.json` 更新 `cityPath`/`district`/`building` 并**新增**
  `relocatedFrom`/`relocatedAtMission`/`relocationNote`；两个测试只改了硬编码的 `cityPath` 断言与文件头注释。
  没有行为变化。
- **F3 — 迁移改动了 provenance 验证器本身**（`scripts/verify-promotion-history.mjs`），这是最需要审查的部分。
  它是**加守卫**而不是放宽：`targetCityPath` 对 `promotedAtCommit` 的检查**原样保留**，`HEAD` 检查改为跟随
  `relocatedTo`；`relocatedTo` 缺少 `relocatedByMission`、不在 `city/` 下、或指向不存在路径都会被拒；
  没有 relocation 记录时**仍然要求历史路径存在于 HEAD**。
- **F4 — 这些守卫此前没有任何测试覆盖**（全仓库搜索无命中）。本主机用**执行**而不是阅读来证明它们。
- **F5 — 三条 theme promotion 记录**都带 `relocatedTo` + `relocatedByMission` + 说明，且
  `targetCityPath` 故意保持历史值。
- **F6 — hub 的 `normalizePromotionRecord` 会丢弃** `relocatedTo`/`relocatedByMission`，所以 Rooms hub 的
  进程内视图只携带"promotion 落在哪里"。

### 1.3 其他引用更新 / Other reference updates

`services/capability-bridge/registry.mjs`（theme moduleRef 路径）、
`services/capability-bridge/adapters.mjs`（两处 `moduleAt` 前缀）、
`scripts/d9-donor-oracle.mjs`（fixture 路径）、manifest、census 全部一致更新，无遗漏。

### 1.4 Initial verdict

**PASS-with-required-evidence.** 搬迁本身干净且可证明；缺的是"等价性"的**运行证据**与 F4 的测试覆盖。
两者都在 §3 处理。

---

## 2. 对照 Migration Report / Reconciliation

### 2.1 确认一致 / Confirmed

| 报告主张 | 独立复核结果 |
| --- | --- |
| §3.1 逐字节搬迁 | **确认**（16/19 blob 相同） |
| §2.2 provenance 决策与拒绝负例 | **逐条复现**：我驱动真实验证器得到报告写明的同样两条具名失败 |
| §6.1 city 129/129、pnpm 58/58、promotion 10 records、docs SYNCHRONIZED | **全部复现** |
| §6.3 D9 oracle `closure PASS / 7 new / 6 reused / 4 intent / 3 pixel` | **逐字复现** |
| §6.4 真实失败记录（BRIDGE_PENDING、CI 失败于 verify-promotion-history、六个 root 测试失败） | 与我在 diff 上看到的一致 |
| §6.2 真实消费：新路径下 AVAILABLE、moduleRef 00-foundation/05-control-centre、globalApply false | **本主机独立复现**（§3.4） |

### 2.2 差异 / Differences

| 编号 | 差异 | 判定 |
| --- | --- | --- |
| D1 | 报告说被移动的文件里"只改了自引用路径字符串"，但 `DONOR.json` 还**新增了三个字段**。 | 实质成立（无行为变化），措辞低估了改动范围。 |
| D2 | 报告写 rooms 67/67。 | 在我加入 R1 测试后为 **69/69**；该数字是过时而非错误。 |
| D3 | 报告未提及 relocation 守卫无测试覆盖。 | 已由 R1 补上。 |
| D4 | 报告刻意不改 `apps/rooms/hub/manifest.mjs` 并给出理由。 | 与我的 F6 一致（hub 视图只记"落在哪里"）。我将其记为**与既定设计一致**，而非缺陷；影响面已在 §7 记录。 |

### 2.3 边界一致性 / Boundary

未新增 global theme apply（运行结果中 `globalApply: false`，且有测试钉住）、未新增编辑器/资源生成器/
Android UI、未迁入 11 Entertainment 的 voice/avatar/VR/AR/media 能力。与报告 §3.2 一致。

---

## 3. 二次维修与验证 / Secondary repair & verification

### 3.1 R1 —— 为 relocation 守卫补测试

新增 `apps/rooms/tests/promotion-relocation.test.mjs`（2 个用例），把验证器依赖的**数据契约**钉住：
每条带 `relocatedTo` 的记录必须同时给出 `relocatedByMission`、路径必须在 `city/` 下、必须保留历史
`targetCityPath` 且与新路径不同、新路径真实存在、旧路径确实已不存在；并断言**正是三条 theme 记录**
承载它，避免该机制悄悄变成死代码。rooms 由 67 → **69**。

### 3.2 R2 —— 用执行证明守卫会触发（不是读代码）

驱动**真实的** `verify-promotion-history.mjs`，逐例改写一条记录再还原：

| 用例 | 结果 |
| --- | --- |
| 交付状态（基线） | exit 0 |
| `relocatedTo` 但缺 `relocatedByMission` | exit 1 — `relocatedTo is set without relocatedByMission, so the move has no recorded authority` |
| `relocatedTo` 指向 `city/` 之外 | exit 1 — `relocatedTo must live under city/` |
| `relocatedTo` 指向不存在的路径 | exit 1 — `… does not exist at HEAD (relocated from …)` |
| **整条 relocation 记录被删除** | exit 1 — `city/11-entertainment/… does not exist at HEAD`，即**没有记录时历史路径仍被要求** |

记录文件以 **byte-exact** 方式还原（`git hash-object` 与 HEAD blob 相同），工作树干净。
这条"删除记录"用例是关键：它证明新字段**不能**被用来把模块弄丢。

### 3.3 R3 —— 搬迁等价性：两棵树上跑同一个调用

在 `origin/main`（搬迁前）建立临时 worktree，与分支各自执行**同一次** theme generate 调用：

```text
搬迁前 (origin/main cfe34df) : digest 1afe4c5538d86677c44ce0d4814e2dafe177aaa452ca12a2bfd2d10de24c3947
搬迁后 (branch)              : digest 1afe4c5538d86677c44ce0d4814e2dafe177aaa452ca12a2bfd2d10de24c3947
```

**完全相同**，且 11 个结果键、`globalApply: false`、`validation.ok: true` 全部一致。这是"搬迁前后 digest
与行为等价"的直接证据，而不是从逐字节相同推导出来的。

### 3.4 R4 —— 真实产品路径（Web/Android Theme Generate）

新增 `scripts/mb009-theme-relocation-pilot.mjs`，重启共享 gateway（**必须**重启：registry 的模块引用是
进程内常量，旧进程会继续服务搬迁前的表），然后走客户端真正调用的接口：

```text
GET  /api/v0/capabilities                       → presentation.theme.lab AVAILABLE
                                                  moduleRefs [{00-foundation, 05-control-centre, theme-engine}]
POST /api/v0/capabilities/presentation.theme.lab/invoke {operationId: generate}
                                                → 200, invocation id
GET  /api/v0/capability-invocations/<id>        → COMPLETED
                                                  resultDigest 50bf52fd54172d55f3a0b86fde9556657c3f9d4d26b36a197906a309f03ea6f0
                                                  validation.ok true · globalApply FALSE
```

同一 pilot 在**合并后的 main** 上再跑一次，得到**完全相同的 resultDigest**，说明 §5 的合并裁决没有改变行为。

### 3.5 验收矩阵 / Acceptance matrix

**分支 `881f0bc`（含 R1）：** city **129/129**、`pnpm test` **58/58**、rooms **69/69**、
promotion 10 records、docs **SYNCHRONIZED**、D9 oracle **PASS**。

**合并后 `main` `b4bd602`：** `pnpm test` **62/62**、rooms **69/69**、city **893 用例 / 892 pass / 0 fail / 1 skipped**
（该 skip 是具名的 `EPERM` symlink 环境限制）、promotion 10 records、docs **SYNCHRONIZED**、D9 oracle **PASS**。

---

## 4. Utopia verified episode

- Implementation CI used by `mission:finalize`: **`36596238433`** on
  `881f0bcbef203448058a87137ce80cf7bad49a5f`。
- Episode path: `data-records/evolution/episodes/mission-book/MB-009/episode.json`
- Episode ID: **`MB-009:e1f0526f2c07fb41`**
- Inbox SHA-256 digest: `c0b09aafac551ce8f82c22913fc2845d2d76087ea672c92b5e9a4eecba9af2e3`
- Closeout commit: `40660e7479931b2218d28a8400a69f20c4a97b81`（纯数据）
- Episode 内容：`status=VERIFIED`、13 个事件、4 个 `VERIFIER_FINDING`、1 个 repair、2 个 `RUNTIME_PASS`。

## 4.1 事件流 / Event stream (13)

| 角色 | 主机 | 类型 | 结果 |
| --- | --- | --- | --- |
| MIGRATION | Mech | MISSION_CLAIMED / ATTEMPT_STARTED / CHANGE_APPLIED / OWNER_INTERVENTION | INFO |
| MIGRATION | Mech | TEST_FAIL / REPAIR_APPLIED | FAIL / REPAIRED |
| MIGRATION | Mech | TEST_PASS ×2 / RUNTIME_PASS | PASS |
| MIGRATION | Mech | CI_RESULT / MIGRATION_COMPLETE | PASS |
| VERIFICATION | Alien | MISSION_CLAIMED / ATTEMPT_STARTED | INFO |
| VERIFICATION | Alien | VERIFIER_FINDING ×4 | INFO |
| VERIFICATION | Alien | RUNTIME_PASS ×2 | PASS |
| VERIFICATION | Alien | REPAIR_APPLIED（R1） | REPAIRED |
| VERIFICATION | Alien | CI_RESULT / VERIFICATION_COMPLETE | PASS |

---

## 5. ⚠ 合并时发现的跨 Mission 冲突与裁决 / Cross-mission conflict found at merge time

### 5.1 事实 / What actually happened

合并 `main`（已含 MB-001/002/004/005/006）与 MB-009 时出现三个冲突，其中第三个是**语义冲突**：

1. **manifest 自动合并出了两个 `00-foundation` district。** MB-009 的分支切自 `c7ef3cd1`，当时
   `00-foundation` 还不存在，所以该分支**自己创建**了一个；`main` 上 MB-001 已经有一个。
   Git 把两者都保留 → 重复 district id（manifest 无效）。已合并为**一个** district，保留其元数据并按
   building id 升序排列。
2. **`registry.mjs`**：保留 MB-002 的 fabric-backed `ADAPTER_PROVIDERS`，把 `presentation.theme.lab`
   的 moduleRef 指向搬迁后的路径。
3. **搬迁与 MB-001 的不变量直接冲突。** MB-001 给 `00-foundation` 标了 `kind: "infrastructure"`，
   而 `registry()` 把 infrastructure district 的模块**排除在解析索引之外**。MB-009 按 City map 把
   theme engine 搬进 `00-foundation/05-control-centre`，于是合并后：

   ```text
   presentation.theme.lab  DEGRADED / UNAVAILABLE        ← 五个已验收 bridged services 变成四个
   ```

   这既破坏 MB-009 的门禁（"现有 Web/Android 可调用的 Theme Generate 路径继续工作"），也破坏 `main`
   上已验收的能力面。

### 5.2 判断逻辑 / The reasoning

- 两条 City 级陈述在合并后**互相矛盾**：MB-001 说"00-foundation 是运行时内核、其模块都不是 capability"，
  City map 说"00/05 Control Centre 是 presentation/theming 的 owner"（MB-009 的强制路径）。
- 冲突的根因是 `kind` 标记的**粒度**：它标在 district 上，而 `00-foundation` 现在同时容纳
  内核 building 和**一个真正的、被 adapter bridge 的 capability building**。
- 被否决的选项：(a) 改 `00-foundation` 的 kind → 内核模块会作为不可用 capability 出现在 Web/Android 上，
  破坏 MB-001 的已验收面；(b) 把 theme engine 搬到别处 → 违背 Mission 指定的 City ownership；
  (c) 直接删除或放宽 MB-001 的测试 → 规则 11 明确禁止。

### 5.3 采取的裁决 / What was done

把"标记"细化到 **building 级**，默认继承 district：

| 改动 | 内容 |
| --- | --- |
| `city/manifest.mjs` | `building.kind` 按同一套 `DISTRICT_KINDS` 校验；新增导出的 `buildingKind(district, building)`（**唯一**判定点）与 `declaredBuildings(manifest)` |
| `city/CITY_IMPLEMENTATION_MANIFEST.json` | `00-foundation/05-control-centre` 声明 `"kind": "domain"` |
| `services/capability-bridge/registry.mjs` | **解析索引覆盖 manifest 声明的每一个模块**（这样被显式 bridge 的模块总能解析）；**枚举**仍保留两道排除（infrastructure building 与 `capabilityProvider:false`） |
| `tests/capability-registry.test.mjs` | 内核属性改为按 **effective kind** 对每个 building 断言；并新增两条断言：`05-control-centre` 声明了与 district 不同的 kind，且 `presentation.theme.lab` 重新 `AVAILABLE` |

**为什么这不是放宽：**
- 对**所有既有输入**行为完全一致（此前没有任何 building 声明 kind，全部继承 district）；
- 内核 building（`01-city-core`、`03-capability-fabric`）的断言**一条没少**，测试反而**更强**
  （新增了对 root 因与 theme 能力恢复的断言）；
- 没有改变任何 City ownership，没有新增任何产品能力；
- 它修的是一个**回归**，不是让一个失败变绿。

**合并后实测：** descriptor 7 条、**AVAILABLE 5 条**、`presentation.theme.lab AVAILABLE`、
`theme-engine` 出现在 Web/Android 可调用的 capability 列表里且可成功 generate（§3.4）。

### 5.4 需要 Owner 注意 / For the Owner

这次裁决**改动了 MB-001 引入的共享文件与其测试**，因此即使它严格保守，也应由 Owner 知晓。可选处置：
(a) 接受 building 级 kind 作为 City 级机制（推荐，它同时满足两条 City 陈述）；
(b) 若 Owner 认为 `00-foundation` 不应容纳 capability building，则应由 Owner 重划 district/building
ownership，并据此新建 superseding Mission，而不是由验证主机自行决定。

---

## 6. 最终门禁 / Final gate

| 门禁 | 状态 | 证据 |
| --- | --- | --- |
| 搬迁前后 digest 与行为等价 | **PASS** | §3.3 两棵树同 digest；§3.4 合并后同 digest；D9 oracle PASS |
| 现有 Web/Android Theme Generate 路径继续工作 | **PASS** | §3.4（真实 gateway 调用，COMPLETED），且合并后 capability 仍 `AVAILABLE` |
| 不得新增 global apply 制造可用性 | **PASS** | 运行结果 `globalApply: false`，并有测试钉住 |
| 历史 promotion/provenance 不因物理路径断链 | **PASS** | 三条记录保留历史 `targetCityPath` + `relocatedTo`/`relocatedByMission`；验证器 10 records PASS；守卫逐例证明会触发（§3.2）；R1 补测试 |
| 验证主机 ≠ 迁移主机 | **PASS** | Mech / Alien |
| 先独立审查后读 Migration Report | **PASS** | §1 先记录，§2 后对照（事件流可证） |
| 维修只在同一 Mission 分支 | **PASS** | R1 一个测试文件；R2/R3 只是探针（其中一个已作为 pilot 提交）；验证主机未改任何生产文件 |
| 未跳过/删除测试、未放宽验收 | **PASS** | §3.1；内核断言未减少反而增加 |
| required CI 全绿 | **PASS** | 分支 `36596238433`、最终 HEAD `36596639671`，两作业 success |
| 由验证主机合并到 `main` | **PASS** | `b4bd602971abe83083cd72ab8247d9bd50371f57` |
| Episode 收口 + 双 CI（规则 16） | **PASS** | §4 与上表两条 CI |

---

## 7. 遗留观察 / Carry-forward observations

1. **building 级 kind 是新机制，建议在 City 级文档中正式化。** 目前只有 `05-control-centre` 使用它，
   且 `city/manifest.mjs` 已加校验、`registry.mjs` 已按它判定。§5.4 请 Owner 确认。
2. **hub 视图不携带当前位置（D4/F6）。** `normalizePromotionRecord` 会丢弃 `relocatedTo`/`relocatedByMission`，
   所以 Rooms hub 的进程内记录只表示"promotion 落在哪里"。这与报告 §2.2 的设计意图一致，但任何想从 hub
   视图链接到**当前**模块位置的消费者需要额外来源（manifest / `DONOR.json`）。
3. **`verify-promotion-history.mjs` 读的是 git `HEAD`，不是工作树。** 因此在合并**提交之前**运行它会报
   "does not exist at HEAD"。这不是缺陷，但会误导；建议在输出里提示这一点。
4. **子进程调用 shell 要用 `powershell.exe`，不能用 `pwsh`。** 本机 PATH 上没有 `pwsh`，本主机在 MB-005
   的 pilot 里因此静默失败过一次；MB-005 报告已据此更正，MB-009 的 pilot 从一开始就用 `powershell.exe`。
5. **共享 gateway 必须在改动 registry/adapter 常量后重启**，否则旧进程会用内存中的旧表继续服务
   （§3.4 的第一次尝试就撞到了这个，表现为 `DEGRADED`）。这值得写进任何"跑真实产品路径"的说明。
6. **未跑 Android 模拟器。** 本 Mission 未触碰 Android 源码；CI 的 android 作业 success。

---

## 8. 证据指针 / Evidence pointers

- 迁移报告：`mission-book/reports/MB-009/MIGRATION_REPORT.md`
- 实现分支：`zhiheng-zhang-Mera/utopia` `mission/MB-009-theme-relocation`
- 实现 CI：<https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36596238433>
- 最终 branch HEAD CI：<https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36596639671>
- Pilot（分支内）：`scripts/mb009-theme-relocation-pilot.mjs`
- 守卫探针证据（git-ignored）：`.runtime/evidence/mission-book/MB-009/run-001/relocation-guard-probe.json`
- 真实消费证据（git-ignored）：`.runtime/evidence/mission-book/MB-009/run-001/theme-generate-probe.json`
- 新增测试（分支内）：`apps/rooms/tests/promotion-relocation.test.mjs`
- Episode：`data-records/evolution/episodes/mission-book/MB-009/episode.json`（`MB-009:e1f0526f2c07fb41`）
- 合并提交：`b4bd602971abe83083cd72ab8247d9bd50371f57`
