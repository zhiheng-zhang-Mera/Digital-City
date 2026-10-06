# BA-001 开发报告：Butler区域与个性化契约

[English authoritative source / 英文权威原稿](../DEVELOPMENT_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION                  = BA-001 (Butler Assistant programme)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 5feb971 (Digital-City main, claim of BA-001 Development by Mech)
CLAIMED_AT               = 2026-09-30T11:58:03Z
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
CONTROL_REPO             = zhiheng-zhang-Mera/Digital-City
CONTROL_REVISION_AT_CLAIM= 5943eec (latest main when the claim was made)
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-001-butler-zone-personalization
IMPLEMENTATION_HEAD_SHA  = 27f5c4e3ca77436c5fdacca229b2916b71180a0c
BRANCH_CI                = 36712388656 — gateway-web success, android success
LOCAL_CHECK_SUMMARY      = 123/123 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

原始块逐字保留任务、开发主机、领取／控制版本、两仓库、基线、分支、精确提交、CI、123项检查、完成及禁止组件分支合并状态。

## 1. 交付物

新契约包contracts/butler-assistant-v1/：

| 文件 | 目的 |
|---|---|
| personalization.mjs | 版本化个性化端口、profile验证、权威扫描、向前迁移、“profile不授任何权限”边界 |
| zone.mjs | assistant身份与profile所有权、presence缓存、可携export／import、revision compare-and-set |
| index.mjs | BA-002／003／005／007与Web／Android公共接口 |
| schema.json | profile／identity／bundle的JSON Schema draft2020-12 |
| tests/conformance.test.mjs | 22项一致性套件 |
| 根tests/butler-assistant.test.mjs | pnpm test注册 |

验收映射：

- 可替换、assistant拥有的持久AssistantIdentity／AssistantProfile：createAssistantZone、createIdentity、setProfile／patchProfile。
- 命名／称呼、voice、avatar／appearance、personality、duties／role、companion／relationship mode的版本化预留端口与扩展：PERSONALIZATION_PORTS、extensions命名空间、migrateProfile。
- 多保存身份、多同时在线：listIdentities、setPresence、listOnlineAssistantIds。
- 不修改Digital-Me的export／import／reset：exportBundle、importBundle、resetProfile、resetAllProfiles，bundle级Digital-Me拒绝。
- schema禁内嵌grant、execution lease、action authority：递归扫描、严格port字段集、永空effectiveGrantsFromProfile。
- 关系配置限定assistant identity：profile的companion端口，不为user-model字段。

## 2. 决策日志（问题 → 选项 → 选择 → 理由）

工作簿未指定以下点，各项在此决定并按要求记录。

**D1：41项未领取Development中先领谁。** 选任意BA、别计划contract、等待Correction，选择BA-001。无自修、无合格Correction，领取优先层3适用；BA001为BA002／003／005／007必须引用的identity／personalization基础边界，纯契约无硬件／提供方依赖，不会因外部接缝idle。

**D2：进行中词汇。** frontmatter定义development_status，但归档MB只示COMPLETE／SKIPPED_COMPLETE。CLAIMED、IN_PROGRESS、保NOT_STARTED靠host三选IN_PROGRESS：明确拥有且未完成，host Mech说明归属；留未开始会让另一主机误以为空闲，破扫描。claim只目标stage字段，不改README／MISSION_INDEX，遵CROSS_PROGRAMME_EXECUTION_CONTRACT第3节及ordinary_claim_updates_dashboard_files:false。

**D3：契约位置。** services/butler-assistant、contracts/butler-assistant-v1、apps三选contracts。既有跨模块版本目录＋schema模式，root tests glob薄入口CI可收。任务是contract／state-boundary，无须新runtime service争所有权。

**D4：如何强制profile无权威。** 仅文档、仅拒权威key、拒字段加唯一永空permission入口三选第三。只文档会衰退，只名字拒仍未来可按duties.labels授权。effectiveGrantsFromProfile是唯一定义询问profile授权方式，总答无；findAuthorityPaths任意深拒grant／lease／capability／token／policy，含extensions及effect allow／grant／permit。

**D5：逐port内联version key。** voice_version等保或删，self-review删除。无人消费，registry version／sinceVersion、profile schema_version与migrateProfile已承载版本；无consumer validation是死接口、会偏离schema。记录作者push前拒初设计。

**D6：部分port拒还是normalize。** 全写或safe defaults补，选normalizeProfile／createDefaultProfile。BA007／client单字段写，强完整易脆，补默认后全存状态严格验证；未声明port字段仍拒。

**D7：assistant↔user关系位置。** user identity或assistant profile，选companion。invariant18不得把persona／relationship写Digital-Me canonical user；Zone无Digital-Me参数，import拒user namespaces，结构隔离非约定。

**D8：presence。** 本处foreground或只session cache，选cache，BA003拥有foreground；重复会merge冲突。明确非durable、不export、不election。

**D9：single-writer内存契约并发恢复证据。** 不claim API无法表达async races，做真实lost-update guard、atomicity／recovery。同步API诚实证据为monotonic revision＋可选expectedRevision CAS拒stale、all-or-nothing拒写字节相同、export→fresh Zone import复现simulated restart durable。不能假装多writer races已测。

**D10：时间。** 系统clock或caller timestamp文本，选caller、可注入clock，匹配clock-free契约、确定tests／exports；checkTimestamp防Date对象入durable／bundle。

**D11：PROCESS_DATA_POLICY evolution inbox。** 政策写MB migration／verification、建设模型不得扩vocabulary，BA任务无引用；不使用，本报告为construction record。禁止发明BA event，诸programme要求mission-book/reports/<TASK-ID>，开放Owner问题而非静默略。

**D12：双语文档。** 不新增docs／evidence／data-records。check:docs要求配对和fact parity，那里contract docs是独立交付、风险无关CI；code／schema自解释。

## 3. 测试汇总

contracts/butler-assistant-v1/tests/conformance.test.mjs共22项全过：normalize／safe defaults、partial port默认、两identity独立profile与relationship、assistant间bundle隔离、多identity presence幂等／不export、duplicate拒state不变、minted ID诚实、authority表permissions／executionLease／authority／capabilities／actionKey／accessToken／effect allow、extension namespace Digital-Me／authority／嵌套／badversion／syntax拒、schema／portshape、future port向前迁移保unknown extension、拒写no-op／schema_version不可变、revision CAS stale拒、export／import restart、replace隔离／revision bump、Digital-Me／authority／malformed bundle原子拒、逐assistant reset／resetAllProfiles、duties仅描述、全lifecycle Digital-Me sentinel不动、typed lifecycle／presence cleanup、patchmerge、schema runtime一致。

负路径有意：每拒绝断言同时state不改。

## 4. 本地检查与CI

| 检查 | 结果 |
|---|---|
| corepack pnpm test | 123项全过0败（101基线＋22） |
| node scripts/verify-promotion-history.mjs | OK，82ed36933fb4本地Git history10记录 |
| node --test apps/rooms/tests/*.test.mjs | 0败 |
| node city/test-all.mjs | 0败、7跳同baseline |
| corepack pnpm check:docs | docs／evidence／data-records SYNCHRONIZED |
| CI36712388656，27f5c4e3ca77436c5fdacca229b2916b71180a0c | gateway-web／android success |

供其他host环境说明：Mech PATH无pnpm，Java26、Android SDK36有；corepack pnpm解析11.19.0、满足CI所有pnpm步骤。

## 5. 集成接缝

- BA002：revision＋expectedRevision为durable state乐观并发原语，snapshot为ContextProjection比较持久形状。
- BA003：setPresence不选foreground，绑定在契约上层，不改此契约。
- BA005：companion／DIGITAL_ME_WRITE_SURFACE隔离，真实Digital-Me访问归BA005，本处不能触。
- BA007：one-level merge patchProfile、UNKNOWN_PERSONALIZATION_PORT／INVALID_ASSISTANT_PROFILE为UI写路径。
- BA009：profile永无grant，invariant19 AssistantPolicy须外建。

## 6. Correction／Owner开放项

1. 攻未枚举deep、array objects、unicode／case Permissions／permissions零宽、prototype __proto__，若过修guard。
2. 确认BA／RF／GAI／EM需evolution／process data或报告为完整construction record，D11。
3. 决定组件后续是否用户双语note，D12留documentation programme。

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```

原始结论保留开发完成、Correction仅Alien、Butler项目合并前禁止。
