---
workbook_id: PCF-700
phase: PERSONAL_COMPUTE_FABRIC
release_train: CORE_V1
spec_revision: 2
parent_workbook_id: null
execution_enabled: true
status: IN_PROGRESS
activation_state: ACTIVATED_OWNER_2026_10_07
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: []
required_ancestor_shas: []
dependency_source_workbooks: ["WBC-601","WBC-602","WBC-603","WBC-604"]
dependency_source_shas: ["f66db60998343bf99243621cfcfa2363a4566db8","d99101fdac5169aad74ae84fb7c0c25be43ad7d9","f3510862cc348a99004ca5bd5d151a7b56279724","213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef"]
development_baseline_sha: "312b627b54af5bbf274fa25eca8f8383869c1c34"
anchor_state: RESOLVED_AT_CLAIM
development_host: "Mech"
development_branch: "pcf/PCF-700-mech-ownership-and-reality-audit"
development_head_sha: "f75b2a6c2fa28d183a09795c70823c775123e1ac"
development_ci: "TWO heads, both kept. (1) FAILURE head d611cfe5f0272673706b9dc5c9f6b85ed40a9406: V0.2 checks run 37497553367 completed/failure - gateway-web failed at step `pnpm check:docs`, android success; the other nine gateway-web steps succeeded, including `pnpm test`, so the new tests/pcf700-compatibility.test.mjs measurably passed on hosted CI. Reproduced locally: scripts/check-bilingual.mjs read one directory level only and hit EISDIR on the nested docs/{zh-CN,en}/pcf/ that this workbook requires. (2) REPAIR head a2a567325e6ce08629eefbe67cda6f8f2c16fd64: V0.2 checks run 37498638940 completed/success, gateway-web success and android success. The repair makes the gate tree-aware (compare the relative path lists of both language trees exactly, then compare fact lines pairwise) and was falsified before being trusted: an absent en mirror yields 'docs missing language pair' and a differing STATUS line yields 'docs/pcf/ownership-map.md facts differ', both exit 1; restored, docs/evidence/data-records all report PAIR_STATUS = SYNCHRONIZED. Local: node --test tests/pcf700-compatibility.test.mjs => 7 tests / 7 pass / 0 fail. Branch pcf/PCF-700-mech-ownership-and-reality-audit and series branch pcf/series-mech are both at the repair head. (3) INCREMENT-2 head f75b2a6c2fa28d183a09795c70823c775123e1ac: V0.2 checks run 37500280971 completed/success, gateway-web success and android success, every step green including `pnpm test` (which now also runs tests/pcf700-dependency-direction.test.mjs) and `pnpm check:docs`; local 11/11 across the two PCF suites (7 compatibility + 4 dependency-direction, each of the four falsified before being trusted)."
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: UNASSESSED
backend_wiring: UNASSESSED
capability_ids: []
capability_registry_action: UNASSESSED
capability_registry_sync_status: UNASSESSED
owner_gate: SATISFIED_OWNER_ACTIVATION_2026_10_07
merge_authority: false
report_path: "mission-book/reports/PCF-700"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-07): PCF-700 is the first task of the owner-opened PCF series. baseline_anchor_mode is DEPENDENCY_SHA_UNION_AT_CLAIM and the declared sources are the four accepted WBC heads WBC-601 f66db6099834, WBC-602 d99101fdac51, WBC-603 f3510862cc34, WBC-604 213f9f9f7087. MEASURED: every one of the four is ALREADY an ancestor of origin/main 312b627b54af, because the WBC series was merged; the claim-time union is therefore main itself and needs no union merge (measured, not assumed: f66db6099834 in_main=True ; d99101fdac51 in_main=True ; f3510862cc34 in_main=True ; 213f9f9f7087 in_main=True). CONTROL-PLANE PREREQUISITE (PCF activation rules section 2.3) completed and regressed BEFORE this claim: sync_dependency_state.py ID_RE now recognises PCF (it did not, so every PCF dependency id was invisible), PROGRESS_MANIFEST.json now carries an explicit PCF file set for this one workbook rather than a broad glob, and running the reconciler touched exactly this workbook - parked PCF tasks were not enabled, not unblocked and not given anchors, no claim or completed record changed, and the English mirror carries no duplicate workbook id. Owner gate: the owner instructed this session that the PCF series be opened and its tasks taken in sequence, so owner_gate moves from OWNER_ACTIVATION_REQUIRED to SATISFIED_OWNER_ACTIVATION_2026_10_07. Boundaries not crossed and recorded instead: no purchase or paid service, no system-service installation, no change to the running City profile, and no merge authority (merge_authority stays false; the series branch accumulates verified work for a later ruling)."
baseline_blocker: null
---

# PCF-700 — 所有权、调用链与兼容现实审计

[English](en/PCF-700-ownership-and-reality-audit.md) · [共用步骤](EXECUTION_CONTRACT.md)

## 目标与交付

形成可执行的 reuse/extend/missing 表，冻结 PCF 接口所有权和 compatibility tests。不是重新实现 WBC，也不是改写全城分类。

读取现有 `services/dev-gateway/{server,store,targeting,execution-profile,handoff}.mjs`、`execution-backend/`、`services/headless-node-agent/`、`contracts/node-descriptor-v1/` 及相关 task/action/recovery 合同。输出 `docs/{zh-CN,en}/pcf/ownership-map.md`、接口映射和 `tests/pcf700-compatibility.test.mjs`。

## 子步骤与验收

- [x] 为每个拟复用点记录 declaration → caller → live API → user surface → exact evidence；特别区分 profile 切换、纯 HYBRID helper 与真正 dispatch/claim 的接线，不能因导出函数存在就认为已启用。
      → `docs/{zh-CN,en}/pcf/ownership-map.md` §1；三层接线分别判为 LIVE_WIRED / NOT_WIRED / LIVE_WIRED，`chooseHybridTarget` 由测试 C6 冻结为 NOT_WIRED。多记录四条本机探针自身的错误（§6）。
- [x] 写 no-workbench 启动、legacy untargeted、strict-target 离线拒绝/等待、结果回原端、旧 descriptor 缺新字段仍有效的兼容反例。运行 `node --test tests/pcf700-compatibility.test.mjs`。
      → C1–C7 全部落地，实测 7 tests / 7 pass / 0 fail（本机重跑 1.06 s），且在 hosted CI 上也通过（run 37497553367 的 `pnpm test` 步）；修复头 `a2a5673`，CI run 37498638940 两 job 全绿。
- [x] 冻结 ARCHITECTURE 中类型/接口到实际代码的映射、公共文件单写者和拟增加的辅助状态；证明没有新 canonical Task/Action/device/credential DB。
      → §2：九个接口与八个类型**实测全部不存在**，`observeResources` / `admit` 是同名异物；§4：单写者清单 + 裸 City 启动后数据目录无 pcf 状态。
- [x] 明确每本下游的 component/exposure owner，检查 UI→backend 依赖无环；需要拆 primitive/product-wiring 时先修任务 DAG 和正式 scope，而非给 exposure gate 造例外。
      → `docs/{zh-CN,en}/pcf/ui-backend-matrix.md`：81 个前端文件、14 个含 `/api/v0` 字面量、网关 49 条路由，**未解析端点数 = 0**；**后端 import 前端模块 = 0**（静态服务路径与 tests/scripts 驱动器分开统计）。守 `tests/pcf700-dependency-direction.test.mjs` D1/D2（4/4，已逐条证伪）。owner 逐本列出见 ownership-map §5。
- [ ] 两主机独立核对样本调用链；未证明的 seam 标 UNKNOWN/NOT_WIRED，列入相应下游验收，不能清零。
      → **未完成**：必须由另一实体主机执行（§3 禁止自审）。本轮已把未证明项写足：`reuse-tiers.md` §5 逐条写明 TWO_HOST_VERIFIED 与 ORIGIN_AGENT_CONSUMED **两档全空**及各自归属工作书；本机未用自身结果替代异机复检。

### 2026-10-07 CI 暴露的仓库闸门缺陷与修复（记录判断逻辑）

首个交付头 `d611cfe` 在 hosted CI 的 step `pnpm check:docs` 失败：仓库闸门 `scripts/check-bilingual.mjs` 只对 `docs/{zh-CN,en}` 做一层 readdir，遇到**工作书明文要求**的嵌套路径 `docs/{zh-CN,en}/pcf/ownership-map.md` 直接 EISDIR（本机按同一命令复现）。两个选项——(a) 把交付物挪成平铺以迁就工具，(b) 把闸门改成树感知——选 **(b)**：工作书是权威，配对翻译的性质与层级无关，错的是一层假设。修复保留原语义（两语言相对路径列表必须完全相等、逐对事实行必须相等），并**先证伪再采信**：移走 en 镜像 → `docs missing language pair`（退出 1）；在 en 加一行 `STATUS:` → `docs/pcf/ownership-map.md facts differ`（退出 1）；复位后三处 `PAIR_STATUS = SYNCHRONIZED`（退出 0）。修复头 `a2a5673` 的 CI run 37498638940 两 job 全绿。失败头与根因保留在 `reports/PCF-700/DEVELOPMENT_REPORT.md` §2.5，未被覆盖。

### 2026-10-07 增量 2：五档核对、UI→后端矩阵、单写者（实测，head `f75b2a6`）

规格修订 2 要求的三项本轮完成，全部**量出来**而不是声明出来（`scripts/pcf700-reuse-audit.mjs`，机器可读记录 `data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json`）：

- **五档核对**（`reuse-tiers.md`）：49 个合同目录中只有 **4 个 LIVE_WIRED**（`execution-backend-v1`、`node-descriptor-v1`、`remote-local-discovery-v1`、`rs-presentation-contract-v1`）；**EM 13 个与 GAI 9 个全部只有测试引用、零产线引用**；`rs-cross-device-return-v1` 只有测试 ⇒ 结果回端目前靠 `handoff.mjs` + presentation，**没有任何产线路径证明那条专门的合同**。`TWO_HOST_VERIFIED` 与 `ORIGIN_AGENT_CONSUMED` **两档全空**并逐条写明归属。
- **复用边界表**（`reuse-tiers.md` §4）：identity/transport 由 City 规范库 + pairing/capability registry 供，provider/审批由 GAI 供，工程规划与 Review→Repair 由 EM/Foreman 供；PCF **不重造**任何一套。
- **UI→后端矩阵 + 单写者**（`ui-backend-matrix.md`）：方向三段分类（模块导入 0 / 静态服务路径 1 / 工具与测试驱动器 17），端点未解析 0，单写者指纹（bytes/lines/SHA256）公开供异机重算。

**仪器自身的两个 bug 记录在案**：第一版方向探针用一条宽松正则报了 19 条「后端 import 前端」，全部假阳性（服务路径与驱动器）；修好后只认 `import ... from '...'`，又被**副作用导入**（`import '../apps/web/app.js';`）绕过——后者是靠**故意证伪守卫**发现的。两条都写进 `reuse-tiers.md` §6 与 `ui-backend-matrix.md`。

### 2026-10-07 关键路径问题（上报，不自行开例外）

PCF-701..728 **全部**（直接或间接）依赖 PCF-700；PCF-701 达到 READY 要求依赖任务 status=COMPLETE（一致性检查规则 4）。本任务 `review_host: null`，正式复检只能由另一实体主机完成。因此本系列当前**唯一关键路径是 PCF-700 的异机复检**，不是再领一本——这与 REX 系列上一轮卡住的成因同构。本机不自行复检、不为依赖门造例外；判断与选项已记入 `reports/PCF-700/DEVELOPMENT_REPORT.md` §3 J3。

## 扩容与边界

可以增加实证审计子项，不能借审计大规模移动目录或重开已冻结 WBC。候选 CAP 映射在本书查重后分配；本书自身不凭文档新增已验证产品能力。

完成只表示 audit/compatibility contract accepted；未来 release 必须重新验证真实产品组合。

## 2026-10-07 规格强化 / Specification revision 2

追加核对已接受 EM 连接器/Foreman、RF、GAI、WBC 和原端工具接线。分别列出 DECLARED / COMPONENT_TESTED / LIVE_WIRED / TWO_HOST_VERIFIED / ORIGIN_AGENT_CONSUMED。此前对“没有 Codex connector”的讨论不是代码证据，不得据此重做已存在组件。明确 UI 共享开关、真实领取、真实进程和结果消费间的缺口；核对迁移01～07的源文本、保留范围和单写者。

详见 [迁移与单一所有权](MIGRATION_HISTORY.md)。本修订不授予施工、预算、远端执行或合并权限。
