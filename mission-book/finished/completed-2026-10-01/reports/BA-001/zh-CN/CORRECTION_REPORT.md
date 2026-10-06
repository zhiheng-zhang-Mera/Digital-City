# BA-001 纠正报告：Butler区域与个性化契约

[English authoritative source / 英文权威原稿](../CORRECTION_REPORT.md)

本文件为历史报告的完整中文阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION              = BA-001 (Butler Assistant programme)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-001-butler-zone-personalization.md
CLAIM_COMMIT         = 7f7b76a (Digital-City main, claim of BA-001 Correction by Alien)
CLAIMED_AT           = 2026-09-30T12:30:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 27f5c4e3ca77436c5fdacca229b2916b71180a0c
CORRECTION_BRANCH    = assistant/BA-001-butler-zone-personalization
CORRECTION_HEAD_SHA  = 8c7e1dc2d14b4c2d9d51e1c772017a529150795b
BRANCH_CI            = 36714796731 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = root 131 pass / 0 fail, rooms 69 pass, city 1801 pass, promotion-history OK, docs SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

原始元数据保留任务、两host、claim、工作簿、baseline、两SHA、CI、local检查、禁合并和完成。

## 1. 独立审查方法

Correction为repair非verification pass。Development27f5c4e fetch到独立worktree直接攻击，不拿作者test作truth；独立Git-ignored .scratch/probe.mjs以hostile输入驱public Zone API，每Development claim从code重推非report读。

作者交接6.1列deep nesting、array objects、unicode／casevariant、__proto__等prototype-pollution；作起点非范围上限。

## 2. 独立发现

两public API可达真实defect及一class-level hardening gap，其他攻击保持。

### 缺陷1 high：profile patch原型注入

位置personalization.mjs applyProfilePatch，经public zone.patchProfile，即BA007被要求使用write path。

发生：

```js
applyProfilePatch(base, JSON.parse('{"__proto__":{"isAdmin":true}}'))
// returned a profile whose prototype is {isAdmin:true},
// with Object.keys(next) unchanged and next.isAdmin === true
```

两步原因：

1. registry.ports[key]对__proto__（及constructor／toString等）回答truthy Object.prototype，UNKNOWN_PERSONALIZATION_PORT不触。
2. next[key]=value在__proto__触setter，改prototype非add key。

重要性：所有boundary扫own keys（Object.keys／entries／validateProfile），原型property全不可见；valid profile仍给读profile.<something>消费者攻击者值，含authority形，直接否定effectiveGrantsFromProfile不grant保证。还静默变object identity，使“相等”profile行为不同。

修复：任何assignment前拒reserved prototype keys，Object.hasOwn查ports，继承名不能过guard，registry也拒reserved port id。

### 缺陷2 medium：继承属性名作未声明port field被接受

位置validateProfile的!(key in port.default())与validateExtensions的!('value' in entry)。

in走prototype，voice.toString／valueOf／hasOwnProperty／constructor／isPrototypeOf被认为declared，validateProfile.ok真，违反“port内未声明field是schema error”注释与报告同claim。extension必需value同错。两处修Object.hasOwn。

### class级强化：无reserved key概念

共同根因无绝不应出现的key，各site靠记安全lookup。现__proto__／prototype／constructor在stored profile、bundle、patch、port registration每深度findReservedKeyPaths拒。schema x-authority-boundary.forbiddenPrototypeKeys同规则、test绑定runtime。

**有意不修**：object literal {__proto__:...}直接设prototype非key，非可检测data、非契约问题；防JSON.parse／spread／defineProperty作为data到达key，这是wire唯一到达方式。

## 3. 攻击后可靠，无需修复

记录使审计可复核，避免未来反复争议：

| 攻击 | 结果 |
|---|---|
| extension深authority key | 拒…a.b.c.permission authority field |
| array of objects内authority | 拒…value[0].deeper[0].capabilities |
| Permissions／EXECUTION_LEASE casevariant | /i拒 |
| nested rule effect:ALLOW | 拒 |
| extension namespace head permission.extra | 拒 |
| bundle digital-me／user-identity | 拒 |
| duty label act:device.control grant语法 | 拒 |
| profile top own __proto__ | unknown port＋reserved拒 |
| bundle extension reserved | 拒且importBundle atomic |
| duplicate assistant id／stale expectedRevision／拒写atomic | 如documented |

明确non-finding：unicode lookalike permіssions（Cyrillic і）接受，**非defect**；描述extension无人读，不grant，effectiveGrantsFromProfile总空。拒属security theatre非boundary。

## 4. 工作簿未定决策

**C1：修全部还是只列表。** 工作簿要求每in-scope发现同branch直接修且regression。两者正是personalization authority／schema strictness。只修二site会给BA007 writer留同陷阱，故六行一扫描class rule。

**C2：报告shape。** 开始无CORRECTION_REPORT格式；Alien在RF001 Development claim时（D6）给mission-book/reports/README.md添加两最小格式，本报告遵，construction decision须两host不分化。

**C3：schema in-scope？** 是，自D12 claim schema↔runtime一致，无schema新rule会虚假。加forbiddenPrototypeKeys／note，test绑RESERVED_KEY_PATTERN。

**C4：evolution-feed。** 未写，同BA001 D11／RF001 D8：contracts/evolution/mission-event-v1.schema.json仅migration，^MB-[0-9]{3}$、MIGRATION|VERIFICATION，BA不能validate、扩会碰frozen。报告与frontmatter为construction record。

## 5. 修复与回归

同branch Development上改：

| 文件 | 改动 |
|---|---|
| contracts/butler-assistant-v1/personalization.mjs | reserved pattern／findReservedKeyPaths，applyProfilePatch own lookup／赋值前拒，portfield／extension own checks，registry拒reserved id |
| contracts/butler-assistant-v1/zone.mjs | validateBundle任意reserved拒 |
| contracts/butler-assistant-v1/schema.json | forbiddenPrototypeKeys＋note |
| contracts/butler-assistant-v1/tests/conformance.test.mjs | 八regression |

八新增测试：

1. profile patch不能改prototype／hidden property。
2. Zone patch闭prototype injection且state不动。
3. rejected patch stored profile字节相同。
4. inherited names非declared port fields。
5. stored profile每深reserved拒。
6. bundle任意位置含extension value拒reserved。
7. reserved不能注册port。
8. published schema声明runtime reserved规则。

每negative断拒且state不变，先改后throw不是guard。test5同port合法voice.speakingRate仍接受，不能靠全拒过严格检查。

## 6. 测试汇总

独立probe加corrected full local：

| 检查 | 结果 |
|---|---|
| public Zone hostile probe | 上方攻击均拒、无state改 |
| node --test contracts/butler-assistant-v1/tests/conformance.test.mjs | 30过0败（22＋8） |
| node --test tests/*.test.mjs | 131过0败 |
| node --test apps/rooms/tests/*.test.mjs | 69过0败 |
| node city/test-all.mjs | 1801过0败 |
| node scripts/verify-promotion-history.mjs | 27f5c4e3ca77本地Git history验10 |
| node scripts/check-bilingual.mjs | docs／evidence／data-records PAIRED |
| CI36714796731，8c7e1dc2d14b4c2d9d51e1c772017a529150795b | gateway-web／android success |

FAILURE_REPAIR_SUMMARY：修后无test败，22 Development unchanged过证明未削contract。两defect独立probe非failing test发现，正是Correction目的，故probe虽不CI仍记录。

## 7. 跨任务接缝（未在此解决）

- BA007消费者patchProfile，__proto__／prototype／constructor现RESERVED_PROFILE_PATCH_KEY非silent success，typed vocabulary一新码，UI作invalid-input非server fault。
- BA002／005读durable profile，stored shape未变，仅准入变。

## 8. Owner开放项

1. reserved比authority拒更严，合法需要constructor字面key也拒；profile无此描述field，判断正确，但记录判断不假定。
2. evolution C4／BA001 D11／RF001 D8仍待Owner：扩schema或声明mission-book reports为BA／RF／GAI／EM完整construction record。

```text
CORRECTION_COMPLETE = true
DEVELOPMENT_HOST    = Mech
CORRECTION_HOST     = Alien   (different physical host — two-host gate satisfied)
CORRECTION_HEAD_SHA = 8c7e1dc2d14b4c2d9d51e1c772017a529150795b
BRANCH_CI           = 36714796731 — gateway-web success, android success
MERGE_STATUS        = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```

原始结论保留完成、两physical host满足、精确SHA／CI、Butler合并前禁止。
