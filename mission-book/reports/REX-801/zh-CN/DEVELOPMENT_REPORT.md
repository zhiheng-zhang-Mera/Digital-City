# REX-801 — 开发报告

> 完整中文阅读译本。[英文原文](../DEVELOPMENT_REPORT.md)保留历史开发证据；本文不修改当前 authority、门槛或状态。

```text
TASK_ID            REX-801  (Experiment Manifest + Registry)
PROGRAMME          RESEARCH_STRENGTHENING
ROLE               Development
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
HOST               Mech  (COMPUTERNAME MEGA-REP; City node identity Mech-Win)
BRANCH             rex/REX-801-experiment-manifest-registry
BASELINE_SHA       0e9bea3ce739b979e582a428af8fb233045a5e75
REQUIRED_ANCESTOR  69a097b5394a9fece39dd11cc13f04c9b4d28bfe  -> verified ancestor of baseline
HEAD_SHA           8f8c521fc299d622093776615b653457d8833f96
CI                 V0.2 checks run 37241196692 on HEAD_SHA
TERMINAL_MARKER    EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED  (development side)
REVIEW             PENDING — opposite-host Formal Review not performed from this session
```

---

## 1. 领取

依据 `CONSTRUCTION_RULES.md` §2 / §2A.2 原子领取，Digital-City 提交 `52c0c63`（后来 rebase 并重新发布于 `fd0fc87` 之上）。以下测量仅使用完整 40 字符 SHA：

```text
utopia refs/heads/main            0e9bea3ce739b979e582a428af8fb233045a5e75
required_ancestor_shas[0]         69a097b5394a9fece39dd11cc13f04c9b4d28bfe  ANCESTOR_OK
required CI on the baseline       V0.2 checks 37205444427 success; City linkage check 37205444385 success
                                  (Actions API, matched on headSha — not read from UTOPIA_LIVE_STATUS.json)
worktree                          D:/utopia-rex801   branch rex/REX-801-experiment-manifest-registry
```

**为什么 WBC-602 领取了相同 SHA，仍重新测量 baseline。** 数值匹配不证明当前仍是该值；沿用旧值会使 `STALE_EXECUTION_IDENTITY` 与正确身份无法区分。领取记录保存测量，而不是测量的记忆。

**领取时记录的独立性。** WBC-601（execution backend seam）和 WBC-602（node descriptor）在领取时均未复检、未合并，因而都不是此 baseline 的 ancestor。REX-801 是建立在已验收 `main` 上的 research-layer contract，不导入这两个任务的新模块。实际满足这一点：分支唯一共享 hot file 是 `services/dev-gateway/server.mjs`，变更为新增一个 import、registry 构造、route block、`auth` 细化及 error-mapping branch。

**根据刷新后的任务板事后补充。** 写报告时，对侧宿主已完成前两个任务的对侧复检并改为 `COMPLETE`。这不改变本任务 baseline：`IMMUTABLE_EXACT_SHA` 领取绑定领取时解析的 SHA；将开发分支 rebase 到后续 `main` 是集成步骤（§11），不是领取。

## 2. 工程问题

项目要使 Utopia 成为研究问题可以**作为实验运行**的地方。每个环节都要求实验在运行前有描述，但原产品没有地方记录：改变什么、测量什么、重复次数、seed、所需 capability、停止条件、保留内容、判定方式及精确代码。没有这些，“五次重复”只是五次临时运行，结果无法归因于配置。

REX-801 提供描述层，到此为止：

```text
question ──► Experiment Manifest (validated against real topologies + real capability vocabulary)
                     │
                     ▼
            Experiment Registry (list / inspect / validate / register)
                     │
                     X   no execution — that is REX-803's seam
```

## 3. 锁定决策（问题 → 选择 → 原因）

**D1 — 实验文档存放在哪里？** City store 是 canonical task/node/action truth，各表以 task 形态 `id` 为键。选择 `<runtime>/research/experiments/` 下**文件支持**的 registry，采用临时文件加 `rename` 原子写入。放入 task-keyed store 要么把 manifest 假装成 task record，要么给 task schema 增加 research table，均侵蚀本任务要维持的边界。写入中崩溃会留下上一文档，而不是截断文件；部分写入但仍可解析的 manifest 会成为静默错误描述。

**D2 — 注册后 manifest 能否编辑？** 没有 `update`。相同内容重新注册是幂等的（`replayed: true`）；同 id 不同内容得到 `IMMUTABLE_MANIFEST`（409）。先描述后运行的 registry 若允许事后编辑，就无法支持可复现性主张，因为结果归属文本已不再是注册文本。改变实验应使用新 experiment id；因此也拒绝 `expectedVersion` 式乐观编辑，它仍允许已发布描述变化。

**D3 — 无效 manifest 如何处理？** **作为 `REJECTED` record 持久化完整 issue list**，HTTP 返回带类型的 422，携带全部问题。REX evidence protocol 要求保留负结果；仅保存成功会丢失验证有效的证据。一次返回全部问题，也刻意修正通常一轮请求仅报一个错误的行为，否则逐字段修正会使 manifest 成为 validator 排序的产物。

**D4 — 如何判定 unknown capability？** 每次请求读取 capability bridge 的**实时** capability list。门槛必须回答“此 City 现在能否执行”；复制常量会漂移，默认接受比没有门槛更糟。空 vocabulary 拒绝全部要求：“不知道任何能力”不能被读成“任何要求都行”。

**D5 — 如何检测不可能 topology？** 每种 topology 自带所需形态，manifest 必须**声明运行对象**（`hosts` / `workers` / `controlSurfaces`），然后检查 host 数、至少 N 个真实 worker、至少 N 个 control surface；要求 Android 的 topology 必须具名 Android surface，worker 必须属于声明 host。这样“不可能”才可判定。一个 host 的 `TWO_HOST_MESH` 不是可以容错纠正的笔误，而是无法按描述执行的设计；注册时指出比四次重复后发现成本低。声明用于验证，明确**不是**资源预留，因此不运行任何内容。

**D6 — 什么算 software identity？** 使用 `component@identity`，identity 为**完整 40 字符 SHA**（`exact: true`）或明确版本 label（`exact: false`，例如 `dsh@1.0.0-alien-rebuild`）。不是版本 label 的 4–39 字符十六进制样式 identity 被明确拒绝。这在 manifest 层实现 §2A.1。短 SHA 看似权威却不是锚点；branch name 会移动，应明确呈现为 label，不冒充固定引用。predicate 从 parse result 生成，不由手写列表产生；§5 记录这一有意修正。

**D7 — seed 确定性。** `deriveSeed` 是对 `experimentId \0 seedPolicy \0 baseSeed \0 index-or-variant` 的纯 FNV-1a，无时钟、随机性或依赖。可复现才算重复。`FIXED` 在各次重复归并为一个 seed；`PER_REPETITION` 产生不同 seed；`PER_VARIANT` 对同 variant 稳定。三者都有断言，因为悄悄五次使用同 seed 的“重复引擎”比没有引擎更糟。

**D8 — 是否变成第二任务数据库？** 不会。contract 在 raw input 上拒绝 task-domain keys：`tasks`、`assignments`、`leases`、`claims`、`assignedNodeId`、`taskId`、`results`、`executionState`。不存在 run endpoint；响应将 `ownsTaskState` / `grantFaultAuthority` / `executesExperiments` 声明为 `false`。这是工作书明确禁止项；只存在于 comment 的禁止不是控制。检查 raw input 而非投影后的 manifest，因为投影恰好会删除待查 keys，见 §5 D1。

**D9 — fault profile。** `faultProfileRef` 作为不透明字符串保留，附 `referenceIsNotAuthorisation: true`；不解析，也不启用注入。工作书禁止 manifest 因存在就取得危险 fault authority。引用用于具名未来 fault layer；authority 仍归未来明确确认的 injection surface。

**D10 — 谁能注册？** research route 是 **control-credential** route，通过收窄既有 `nodeRoute` 判定实现，不增加第二套 auth。experiment description 指定 worker 上执行工作所需 capability、stop condition 和 acceptance criteria；若 worker 能注册自己将被评判的实验，就会自行认证验收标准。

## 4. 变更内容

| 文件 | 性质 |
|---|---|
| `contracts/experiment-manifest-v1/manifest.mjs` | **新增**：topology/seed/stop/retention vocabulary，`validateExperimentManifest`、`deriveSeed`、`seedSequence`、`parseSoftwareRef`、`assertNotATaskStore` |
| `contracts/experiment-manifest-v1/index.mjs` | **新增**：公共接口 |
| `contracts/experiment-manifest-v1/tests/conformance.test.mjs` | **新增**：9 个 contract 测试 |
| `services/dev-gateway/research/registry.mjs` | **新增**：文件 registry（list/inspect/validate/register/seeds） |
| `services/dev-gateway/server.mjs` | **修改**：registry 构造、`researchFacts()` vocabulary 发布、五条 research route、control-credential auth 细化、带类型 manifest-error 映射 |
| `tests/rex801-experiment-manifest.test.mjs` | **新增**：5 个 live-gateway 测试 |
| `docs/{en,zh-CN}/EXPERIMENT_MANIFEST_REGISTRY.md` | **新增**：成对 capability 文档 |

task/node/action domain 未改变：没有 task schema、targeting、claim/report transition、pairing 或 UI 变更。

## 5. 开发期间发现并修复的缺陷（记录，不清理）

**D1 — task-domain guard 永远不会触发（自身 LOGIC_CONFLICT）。** `assertExperimentManifest` 对**已验证** manifest 调用 `assertNotATaskStore`；`validateExperimentManifest` 用已知字段建立新对象，携带 `tasks` 的输入在投影时被删掉，guard 只检查干净对象。guard 虽真实存在，却无法履职。修复是在 `assertExperimentManifest` 和 `registry.register` 验证前检查 **raw input**。conformance 回归断言全部八个 task-domain key 被拒绝，嵌套 `{tasks: []}` 则允许：guard 只管 manifest 自身 keys，不误报其合法描述的数据。

**D2 — short-SHA 检测器有漏洞和误分类（自身 LOGIC_CONFLICT）。** 初始 predicate `/^[0-9a-f]{7,39}$/` 接受 4–6 字符十六进制样式字符串，如 `utopia@abc12`；又把 branch name `main` 错误归为 malformed SHA，尽管它是 label，不是损坏锚点。修复后仅当 identity **不是**合法 version label 时应用检测器；label 以 `exact: false` 接受，允许调用者拒绝把 label 当固定引用。编码了错误预期的测试也更正；错的是预期，不是产品。

**D3 — fixture 断言了我假定而未读取的 capability vocabulary（MEASUREMENT_DEFECT）。** live-gateway 测试要求 `task.execute.safe`，这是 **worker task capability**，不是 City provider capability id。真实 vocabulary 为 `planning.document.intake`、`planning.knowledge.query`、`engineering.skill.inspect`、`research.evidence.review`、`presentation.theme.lab`。manifest 被 `UNKNOWN_CAPABILITY` 拒绝，说明门槛正常、fixture 错误。修复 fixture，并增加正向断言：task capability **不会**被接受为 City capability，使错误转化为性质。

**D4 — 完整套件负载下既有不稳定测试（MEASUREMENT/ENVIRONMENT，不属于本任务）。** `tests/theme-build-bridge.test.mjs` 的 “D9 Bridge builds retained sandbox artifacts with canonical bounded results and typed refusal” 在一次 full-suite 运行失败（32 720 ms），独立运行通过（29 548 ms），重跑亦通过。未涉及本任务修改路径；重型 sandbox-build 集成测试对时间和并行负载敏感。分类 `FLAKY_PRE_EXISTING`，保留记录，不据此声称本地全绿。

## 6. 证据

```text
node --test contracts/experiment-manifest-v1/tests/conformance.test.mjs tests/rex801-experiment-manifest.test.mjs
  14 tests / 14 pass / 0 fail

pnpm test                          (full root suite)
  1251 tests / 1247 pass / 4 fail   <- 3 environmental (resident City holds coordination port 4389) + 1 flaky (D4)
  baseline 0e9bea3 carried 1219 root tests: +32 from this task

node city/test-all.mjs
  1984 tests / 1977 pass / 7 skipped / 0 fail

node scripts/verify-promotion-history.mjs
  10 record(s) verified against local Git history at 0e9bea3ce739

node --test apps/rooms/tests/*.test.mjs / node scripts/check-bilingual.mjs
  recorded in the workbook frontmatter with the CI result
```

工作书完成门槛映射：

| 门槛 | 证明位置 |
|---|---|
| stable manifest（最低字段全覆盖） | `validateExperimentManifest`；conformance 的 “a missing field is reported, never defaulted” 枚举所有 required path |
| registry | `services/dev-gateway/research/registry.mjs`；Gateway 重启后同 seed sequence 保留 |
| validation | malformed / unknown capability / impossible topology / conflicting variables / duplicated id / same-seed determinism 全部有断言 |
| direct-control contract | 五条认证 research route；validate-before-run 不注册；不存在 run endpoint |
| 对侧宿主 Review | **PENDING**，不声称已完成 |
| 精确 head CI | §7 |
| PAPER_MATERIAL_INDEX | `mission-book/reports/REX-801/PAPER_MATERIAL_INDEX.md` |
| exposure gate PASS | §8 Capability Exposure Decision |

## 7. Head 与 CI

```text
development_head_sha   8f8c521fc299d622093776615b653457d8833f96
development_ci         V0.2 checks run 37241196692 -> COMPLETED SUCCESS on that exact SHA
```

### 7.1 可集成候选（§7 对账记录，不预先决定复检）

任务进行期间 `main` 从 `0e9bea3ce739b979e582a428af8fb233045a5e75` 移到 `d3262ce2dd81e51a53e39e6f9add8dee650a7682`，因对侧宿主合并无关 pairing 修复。为避免复检者之后才发现 stale base，分支 rebase 到当前 `main` 并 **with lease** force-push：

```text
integration_candidate_sha   ef89e917c0468b38ade26e666ca98c754ef8945a   (rebased onto d3262ce…, conflict-free)
acceptance re-run on it     14/14 REX-801 tests pass; 4/4 tests/gateway.test.mjs pass;
                            check-bilingual = SYNCHRONIZED
candidate CI                V0.2 checks run 37241780688 -> COMPLETED SUCCESS on ef89e917… (gateway-web, android)
```

**为什么未将 `development_head_sha` 改为候选。** 该字段指开发证据产生时的 head，证据真实且对 `8f8c521` 仍有效。把 rebase head 记作开发发生处会产生 provenance mismatch，属于与凭记忆写 SHA 相同的错误。§2A.6 下，对侧复检验证哪个 head 由复检者决定，因此候选与已验证开发 head **并列**记录，互不替代。

## 8. Capability Exposure Decision（`CONSTRUCTION_RULES.md` §14A）

```text
user_exposure_class    = DIRECT_CONTROL
user_exposure_surface  = the research route family GET/POST /api/v0/research/experiments[...]
user_exposure_nesting  = L3_ADVANCED (namespace reserved for the Research / Advanced layer)
backend_wiring         = VERIFIED — every operation reaches the real registry: list and inspect read the stored
                         documents, create/import validates against the live capability vocabulary and persists,
                         validate never persists, seeds are computed from the stored manifest
ui_exemption_reason    = not INTERNAL_ONLY, so no exemption is claimed
```

**关于 UI 部分的诚实说明。** 工作书将能力置于 `Research/Advanced`，初始 UI 不要求挤进主导航。项目 `RESEARCH_CONTROL_SURFACE.md` 把分层 Research interface 分配给后续 REX-807（research control surface and progressive disclosure，当前 `WAITING_DEPENDENCIES`）。所以本任务交付**完整 control contract**：已认证且自身可发现，每条响应发布构造有效 manifest 所需 topologies、seed policies、stop-condition kinds、retention levels 和实时 capability vocabulary；未新增 navigation entry。

对 §14A.3 的意义明确如下：backend wiring 完整且已验证，**presentation** 延后至拥有该层的任务。能力记录为 `DIRECT_CONTROL`，UI seam 开放，不等同完整用户暴露。复检者应把“普通用户从新起点一两步可达”视为 **NOT YET MET**；项目最终 exposure task 拥有界面，因此这是第一组件有意保留的状态。

## 9. 不作哪些主张

- **对侧宿主正式复检 PENDING。** 本 session 仅运行于 Mech；`CONSTRUCTION_RULES.md` §3 要求另一物理宿主，工作书 `review_host` / `review_complete` 未修改。
- **未执行实验**，因此不作测量、硬件、性能或多宿主主张。本任务按设计没有 run/stop/export 路径，它们属于 REX-803..806。
- 不授予任何 **fault injection authority**：`faultProfileRef` 是不透明引用，`grantsFaultAuthority` 为 `false`。
