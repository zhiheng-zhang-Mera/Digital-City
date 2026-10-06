# RF-001——节点身份与安装生命周期开发报告

阅读译本 / Reading translation：完整历史阅读译本，不构成第二份权威元数据。原始记录头置于代码块，开发/纠错资格与未接线边界保持原意。

```text
RF-001 — Node Identity + Installation Lifecycle
PROGRAMME = REMOTE_FABRIC_ENGINEERING (Remote Fabric, task 1 of 10)
DEVELOPMENT_HOST = Alien
CONTROL_BOOK = Digital-City/mission-book/remote/RF-001-node-identity-installation-lifecycle.md
CROSS_PROGRAMME_CONTRACT = Digital-City/mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md
CLAIM_COMMIT = 7e1a49984e14d9abcedcb401378af0235a10fbe2 (Digital-City main, "claim(RF-001): Alien claims Development stage")
COMPONENT_BASELINE = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c (Utopia main; all four programme pools share it)
IMPLEMENTATION_REPO = zhiheng-zhang-Mera/Utopia
IMPLEMENTATION_BRANCH = remote/RF-001-node-identity-installation-lifecycle
HEAD_SHA = b1ee127bb7ba292bda7b817dd4910b4498f446c1
BRANCH_CI = see BRANCH_CI below
ARCHITECTURE_CONTRACT = REMOTE_FABRIC_V1
```

Remote Fabric第1/10项，Alien开发；claim与全SHA原样保留，共四programme基线82ed36933fb4c5b00e44768d9e1aedec1d525d9c。此报告原reports README只有ASSESSMENT/MIGRATION/VERIFICATION模板，无DEVELOPMENT；采用MIGRATION形态是D6明确决策。

## 落地边界

新building新模块city/00-foundation/02-city-node-network/device-identity，contracts负责version/validation/canonical，identity负责lifecycle/clone/legacy，index public，PROVENANCE任务来源无donor，65tests。

最小共享改动逐一理由：manifest声明新building/module、description两→三incubation身份；manifest tests加census及migration DONOR与programme PROVENANCE独立证明；两ARCHITECTURE镜像第三身份/RF001/tree；capability-registry测试替脆弱绝对census见D7。未动Web/Android/services/agents/contracts/platform，无runtime行为变化，未合main。

## 保留行为与实现内容

| 必守不变量 | 实现 |
|---|---|
|2逻辑身份cryptographic，非network |仅deviceId/keys/activeKeyId为DEVICE_IDENTITY_AUTHORITY_FIELDS；IP/hostname/OS/model/MAC在metadata，NOT_AUTHORITY |
|3MAC仅optional本地pairing evidence |normalizeMac、locally-administered、macPairingEvidence总canBlockPairing false、trustFromMacEvidence总拒 |
|8session非taskauthority |模块无task/presence/reachability/permission |
|9offline/reconnect诚实 |无sessionstate，refusal码区分不归并 |
|11权限intersectional |不授permission，仅document有效及lifecycle意义 |

生命周期包括首次bound/unbound enrollment、rename、networkmetadata、key rotation/revoke且恰一active key、device/installation retire、proof显式rebind、reinstall新installationId/instanceId/credential不继承logical device、单记录/全体clone检测、quarantine、legacy hook。

## Required acceptance覆盖

| 门槛 | 命名测试含义 |
|---|---|
|IP/network不改device_id |IP/hostname变化身份不变；metadata非权威且id非派生；无network observation设备合法 |
|rename只display非authority |rename不改authority、不mutate原doc；同名两设备可，名字非身份；空/nonstring拒 |
|reinstall新installation需显式rebind/enroll |新id不继承logical；unbound无操作；rebind需proof不发明；proof绑回存活logical；必须实际mint新身份；无device不能boundenroll |
|模拟clone检测/拒/quarantine |不同physicalinstance呈同凭据clone；quarantine终态不能clone撤销；population同installation不同instance、同installation两fingerprints |
|缺/随机MAC不阻合法pair |缺失与随机仍可；locally-administered原bit计算而非猜；格式/大小写/separatorsnormalize不拒；多NIC皆表示无优先 |
|spoofMAC不能冒充 |MAC证据单独不能trusted，MAC不进authority字段 |
|schema升级及坏记录 |两个validator拒错version；24坏device及16坏installation具体码；v1迁自身；live gateway row升级；future unknown version拒不猜 |

负向覆盖为一等要求，24+16每case断言IDENTITY_REJECTION_CODES且assert helper携code。额外安全：序列化installation无secret，credentialLeakScan可运行检查；fingerprint可复现且secret-specific；rotatedkey留history但立即不权威；activekey撤销拒不提升其他；quarantine对所有presenter拒，clone不能自清。

纯性：无Date.now/Math.random/process.env/fs/socket；nowMs注入，entropy显式16byte Uint8Array，randomEntropy为唯一隔离真实随机入口，使验收可复现非timing-dependent。

## 明确未实现

按跨programme第5节defer非success，各精确pendingseam留Remote merge：

1. 无product/serviceconsumer。自然node registration现存id/devicePrincipalId/displayName/metadata.platform/agentVersion/capabilities/online/lastHeartbeatAt，principal==id、无key、无device-install区分/clone。书未需wiring且architecture§5冻结services，分支无runtime变化。migrateDeviceIdentity实际接受此row并测试升级。
2. legacy row无key，派生legacy-gateway placeholder ref，不声称已持未颁key，真enroll需rotate。
3. 无transport/discovery/Bluetooth/rendezvous/pair UI/encryption，RF002–006拥有；仅供身份。
4. 无presence/reachability/policy，RF009/010/Core拥有；有效session/存在绝非permission，本模块无法表达赋权。
5. 未写evolution，D8。

## 工作书未定决策

### D1——Remote模块在City何处

书无路径，manifest无Remote/Node building。选00-foundation/02-city-node-network/device-identity声明02。已公布Citymap明确保留00城市地基/02城市节点网与设备互联层，README拥有Owner/Root以下node/device principal identity；01-core与03-fabric间02空。拒08-device-edge，其边界物理sensor/actuator能力非identity；拒新topdistrict，既有map已分地基。

### D2——非migration如何诚实注册

manifest仅Room Pack及需DONOR的MB migration两incubation。RF001无Room、非迁移，皆不真实。新增programme-task第三身份，room mb-rf-001-device-identity-lab、mission block、PROVENANCE donor:null。mission recognition从MB扩MB/BA/RF/GAI/EM，census分证明DONOR与PROVENANCE。architecture本已拒“无room运行”假promotion；伪promotion、伪MB id均假provenance，omit manifest违真实树记录及先例。第三身份是余40任务、39programme的结构必要。

### D3——是否advertise capability

manifestflag及registrywalk实施模块；选不capability，基础00/02 registry跳过。身份设施无用户功能，MB003说明否则Web/Android虚BRIDGE_PENDING。existing infrastructure-never-advertised测试覆盖新building。

### D4——clone具体信号

要求两physical安装不能默共享activeidentity但未定义观察。doc有installationId身份、instanceId物理来源及fingerprint；同installation不同instance为CLONE_DETECTED，population scan查双记录同installation。合法reinstall必须新id，所以同id第二instance不合法。顺序clone先unbound，使unbound也可检测；mismatch与duplication不同事实分别报告。拒任第二presentation当clone误伤reconnect，拒仅population漏无记录clone。

### D5——不猜的MACrandomization

用IEEE802首octet0x02 locally-administered位，报告randomized并原bit测试。真实可检属性非heuristic；不可读取value:null/randomized:false，OS未告知非OS告知随机，两者不阻pair。

### D6——无DEVELOPMENT模板

reports仅三旧类型但programme要求development/correction。按migration适配两阶段，并在reports README加两个最小格式，让余40任务双host一致；否则40形态难快读。

### D7——潜伏脆弱fixture错理由失败

kernelBuildings===2，新基础building变3导致census而非目标规则失败。选named infrastructure list+>0 nonvacuity，保刻意更新并命名。与MB002/005相同，硬计数新增必破而loop已有真正检测；namedlist仍需故意编辑但正确理由。拒把新building假domain保2，拒>=2失census。

### D8——RF无evolution事件

此前bounded交接events，但schema missionId MB三位，eventId MB三位+16hex，role仅MIGRATION/VERIFICATION，无RF可valid、脚本拒。扩schema触architecture冻结contracts且跨范围，选择不写；truth在本report/frontmatter。缺失是决策非遗漏。

### D9——canonicalJson本地实现

工程restart协议已有同canonical，兄弟DONOR警两拷贝hazard。选contracts本地同语义并docblock说明。警告用于两process同digest，工程共享是另一process重算ticket；此module digest无人那边重算，地基依工程倒ownership无收益。自身唯一digestconsumer，语义相同有文档。

### D10——legacy placeholder key放置

legacy无key但v1至少一ref；由row派fingerprint名legacy-gateway，在PROVENANCE/report说明placeholder不是实持key。拒去key弱v1，使无认证等同已认证doc，破目的；拒randomkey假crypto事实。

## 测试汇总

Alienpush前本地，raw gitignore .runtime/evidence/mission-book/RF-001/run-003/local-checks.txt。

| 检查 | 结果 |
|---|---|
|root |101/0 |
|promotion |82ed36933fb4历史10 |
|Rooms |69/0 |
|City |1867/0 |
|bilingual |docs/evidence/data-records SYNCHRONIZED |
|deviceidentity子套件 |65/0 |

工作树按CI固定pnpm11.19.0 frozenlock及dircity安装，不借main node_modules。

失败修复：首两moduletest一个错期待IdentityLifecycleError而validator正确baseDeviceIdentityError，改断言code；另一坏state期望malformed却validator报metadata，改validator为malformed，代码错非测试。另capregistry失败D7已修。

CI V0.2 checks36713816317，remote/RF-001-node-identity-installation-lifecycle @b1ee127bb7ba292bda7b817dd4910b4498f446c1，两required gateway-web/Androidsuccess。

## 交接Correction

必须Mech不同physicalhost；作者评估最高价值攻击：

1. resolve ladder顺序，clone先bind、mismatch/dup区分；尝试两physical同id却准入。
2. population只按installationId，freshid复用fingerprint是否可达、是否范围内。
3. keylifecycle/retire，尝试0或2active、retired仍assertActiveKey。
4. legacyupgrade能否把无认证row变为不应通过trust。
5. widenedprovenance不弱migration，无DONOR仍失败、programme声明donor仍失败。
6. D7namedlist+>0是否可能vacuous。

DEVELOPMENT_COMPLETE:true，两requiredCI绿色。CORRECTION_ELIGIBLE:true，必须Mech非Alien。

语言配对 / Language pair: [原文 / Source](../DEVELOPMENT_REPORT.md)
