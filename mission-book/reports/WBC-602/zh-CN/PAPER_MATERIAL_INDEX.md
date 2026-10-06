# WBC-602 — 论文素材索引

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；历史、失败和未知边界保留，元数据及证据只以代码围栏引用。

> §14B长程研究门与任务进行中模板新增state_identity_evidence（MISSION_TEMPLATE Digital-City eb5c2bc）要求。与601相同范围：仅可观测工程事实，不含隐藏推理，NOT_OBSERVABLE＋原因代虚构数字。

## 1. 适用决定

```text
research_evidence_applicability = APPLICABLE
long_horizon_context_evidence   = CAPTURED
state_identity_evidence         = CAPTURED
research_evidence_refs          = see §6
```

APPLICABLE、上下文及身份CAPTURED、引用§6。实际信号而非按任务类型推得：长异步会话第二连续领取、逐字段看正确却自相矛盾投影自发现、自有测量缺陷、凭记忆虚构SHA后缀且发布前抓获。

## 2. 外部状态引用（RQ3）

```text
control_repo        zhiheng-zhang-Mera/Digital-City @ main
implementation_repo zhiheng-zhang-Mera/utopia
workbook            mission-book/workbench-compatibility-migration/WBC-602-node-role-capability-resource-descriptor.md
report              mission-book/reports/WBC-602/DEVELOPMENT_REPORT.md
branch              wbc/WBC-602-node-descriptor
baseline_sha        0e9bea3ce739b979e582a428af8fb233045a5e75
head_sha            c312a60b4d73f02597bde1f106372b253067fe33
required_ci         V0.2 checks / City linkage check on baseline: 37205444427 / 37205444385 (both success)
independent_of      wbc/WBC-601-execution-backend-contract head d65dbd3af2d8903aca13726f74110e1f2f6b9b65 is NOT an ancestor of baseline
claim_commit        623190f
worktree            D:/utopia-wbc602
```

仓库、工作书、报告、分支、基线／头、成功基线CI、601不为祖先、领取623190f及工作树均外存。最需且不可正确记忆的两事实——哪基线、并行代码是否已在其中——由rev-parse及merge-base解析。记住601“完成”会错，因为自己的分支完成非main已合。

## 3. 身份、来源、新鲜性（§14B身份半）

```text
expected_identity            head of the branch as pushed
resolved_identity            git rev-parse HEAD = c312a60b4d73f02597bde1f106372b253067fe33
evidence_identity            CI (V0.2 checks) headSha on that branch = c312a60b4d73f02597bde1f106372b253067fe33
provenance_relation          resolved_identity == evidence_identity  -> MATCH
freshness_revalidation       re-resolved after the push, not carried over from the pre-push value
drift_classes_checked        MUTABLE_REFERENCE_STATE_DRIFT      -> observed and handled (§4 I3)
                             EVIDENCE_POINTER_MISMATCH         -> observed and corrected (§4 I4)
                             STALE_EXECUTION_IDENTITY          -> the branch was resolved fresh at claim time
                             PROVENANCE_RELATION_MISMATCH      -> none; baseline ancestry re-verified per claim
```

期望推送分支头；Git解析与CI headSha都c312a60b4d73f02597bde1f106372b253067fe33，关系MATCH；推后重新解析不沿推前值。查MUTABLE_REFERENCE_STATE_DRIFT与EVIDENCE_POINTER_MISMATCH均观测处理§4；STALE_EXECUTION_IDENTITY领取新解；PROVENANCE_RELATION_MISMATCH无，逐领取重验祖先。

## 4. 可引用事件

**I1 LOGIC_CONFLICT。** 首投影ONLINE/acceptingWork true/sharing false/原因Owner关闭。字段各可辩，组合却说关共享仍接。读取新鲜性测试而非审代码发现。派生错误隐藏在正确字段连接，派生布尔契约须明述合取／析取谓词。证据开发§5及descriptor回归。

**I2 COMPATIBILITY_MODEL。** 缺测不成0/unavailable的规则会被一个??0静默破坏；资源presence KNOWN/UNKNOWN/UNSUPPORTED带原因，未测需求decided:false非拒。论文角度向后schema演化：值缺失本身须表达。

**I3 跨主机控制面MUTABLE_REFERENCE_STATE_DRIFT。** 记录601时另一机由旧状态推13 main提交，三个开发字段回null/false；代码／报告未动。fetch→rebase→发布，main修中再移因此两次，无force、不改他人领取。证据HEAD..origin/main三字段diff及898db10仍祖先，非夺领。多主机push不是持久转移、回读才是。

**I4 自造EVIDENCE_POINTER_MISMATCH。** 初稿c312a60b6bb6fbcc7cb0ee3ecab90dc9d64d8daf七真33记忆虚构无提交，发布前Git＋CI捕获。部分虚构哈希人眼似真，需解析比较，这具体动机§2A完整40字符；agent记录缺陷非产品。证据本§3、开发§8.1。

**I5 自测MEASUREMENT_DEFECT。** 期望network.reachable true、夹具agent没在线，错期望非转换。改测descriptor真实区分，单列I1外，使CEX/REX§4工具错误与产品错误可分。证据开发§5第二发现。

## 5. 完成后连续扫池

报告前601开发完成已记录，701由Alien-codex进行；702/703/704、REX801/802 READY未领；JOIN590实物和SHOW401媒体偏Alien本机不合资格。下一领取先回读活看板，从缓存决定正是I3旧状态。

## 6. 研究院主题

```text
.../paper-materials/{en,zh-CN}/
  LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md
  LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md   <- I3, I4
```

上下文生命周期和身份来源新鲜性2026-10-05，后者I3/I4。未声称NO_RESEARCH_SIGNAL。

## 7. 声明边界

无单会话因果，I1–I5自然观测。无token／成本／压缩遥测，未压缩且harness无占用数字，未知＋原因。不作硬件／GPU声明，历史descriptor未建加速测量而UNSUPPORTED；下方明确纠正该历史假设。

## 相反主机纠正证据取代原投影假设

实际Alien-codex/MERA-ALIANWARE与开发Mech/MEGA-REP不同。纠正d99101fdac5169aad74ae84fb7c0c25be43ad7d9绑定 [REVIEW_FINDINGS](./REVIEW_FINDINGS.md) 及收据，CI37211820065当时IN_PROGRESS。上面GPU unsupported是已修缺陷，未测硬件必须UNKNOWN。六发现，根红／绿19/19、规范HTTP10/10等价，无硬件benchmark。CAP-NODE-DESCRIPTOR-001基础注册回填，INTERNAL_ONLY及无新用户动词豁免。

APPLICABLE/上下文CAPTURED；续跑重验源／控制／CI，精确token/窗口/压缩触发及全局返工数NOT_OBSERVABLE。RS-G3-INDEPENDENT-REVIEW-BOUNDARY、RS-G3-IDENTITY-PROVENANCE、RS-G3-SEMANTIC-INTEGRATION、RS-G4-CAPABILITY-STATE沿City分类，不是新颖性。缺陷仍普通工程证据，基础／正式／CI／main集成分开。

最终纠正同d99101fdac5169aad74ae84fb7c0c25be43ad7d9，37211820065 COMPLETED SUCCESS、相反主机正式PASS、注册协调。接受标记指精确源，不表示main包含；PR18在merge_authority=false下仍开。

语言配对 / Language pair: [English](../PAPER_MATERIAL_INDEX.md) · [中文](./PAPER_MATERIAL_INDEX.md)
