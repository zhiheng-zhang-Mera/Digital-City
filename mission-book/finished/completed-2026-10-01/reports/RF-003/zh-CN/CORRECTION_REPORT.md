# RF-003纠错报告——同Wi-Fi/LAN发现与本地直连

阅读译本 / Reading translation：完整历史阅读译本，非第二份权威元数据。原证据块原样，全部失败、负结果及未修边界保留。

```text
MISSION              = RF-003 (Remote Fabric programme)
PROGRAMME            = REMOTE_FABRIC_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/remote/RF-003-local-discovery-lan-direct.md
CLAIM_COMMIT         = 02898b7 (Digital-City main, claim of RF-003 Correction by Alien)
CLAIMED_AT           = 2026-09-30T14:40:00Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = f0d8f59796a3d152a61f104682d3d86c2ca023c2
DEVELOPMENT_CI       = 36724660725-success
CORRECTION_BRANCH    = remote/RF-003-local-discovery-lan-direct
CORRECTION_HEAD_SHA  = 4a51996e0caf771676508e569a3c328ad4c99b8a
BRANCH_CI            = 36728802526 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = RF-003 16 pass, root 117 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at f0d8f59, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

Alien纠错、Mech开发，Remote Fabric CORRECTION；claim02898b7、2026-09-30T14:40:00Z；基线/开发头f0d8f59796a3d152a61f104682d3d86c2ca023c2及CI，纠错4a51996e0caf771676508e569a3c328ad4c99b8a及36728802526两jobsuccess。16模块、root117、rooms69、city1801、promotion/bilingual通过。组件禁止merge，未执行；完成true。

## 1. 独立审查方法

如所有此programme Correction两review，但隔离是机械非纪律。任何review前导出不可变路径字节核验，指示只import export：

```text
D:\A-Utopia\.runtime\evidence\mission-book\RF-003\frozen-f0d8f59\contracts\remote-local-discovery-v1\
  discovery.mjs  exported match=True
  index.mjs      exported match=True
```

discovery/index均match=True。允许本host并行修，是第三次模式，解决EM002 reviewer读正在修改worktree失败。本host对冻结export跑独立probes alien-probe/2/3，原文称两独立probe并列三文件；reviewer scratch rf003-adversarial p1–p9。按缺陷非reporter合并，共同机制一次并说明发现者。修后alien-verify-repair重放原复现27全PASS，不只自己重写regression。

## 2. 七确认缺陷，均修复

reviewer找D1–D6六个；本host先独立D1/D6（RF3-1/3），另RF3-2 reviewer未报告。八作者测试修前后不改通过，均未覆盖。

| ID | 类别 | 机制 | 修复 |
|---|---|---|---|
| RF3-2 | high错误合并 | 未识别key为名字+地址 | 全observation digest |
| D1/RF3-1 | 单侧时间界 | parse(last_seen)+ttl<=now | 双侧stale+MAX_CLOCK_SKEW_MS |
| D2 | high prototype读 | own名字allowlist却链读value | bare object+own读取 |
| D6/RF3-3 | 旧态当当前 | 重发snapshot判定且consumer无gate | freshnessOf+三边界拒绝 |
| D5 | 非规范证据 | padded与canonical地址均存 | 规范拼写 |
| D3 | 单侧cap | negative limit为slice offset | 非负safe integer |
| D4 | 不能失败检查 | preservation构造即成立 | identity绑定candidate_ref |

### RF3-2 high——两个未识别设备合为一个

本host发现，reviewer未报。normalize以display_name|addressKey为未识别key，无地址只剩名字；任意广告重复名字可占别人candidate，同名不同设备合一。

```text
two unidentified devices, same display_name, no addresses   -> candidates=1  duplicates=1
same, but DIFFERENT MAC evidence                            -> still 1 candidate
same, but android vs ios platform                           -> still 1 candidate
two unidentified devices, different display_name            -> candidates=2   (control)
```

同名无地址1candidate/1duplicate，不同MAC或android/ios仍1，不同名字control2。违反header不把地址/hostname/name/MAC当identity，工作簿D2加密逻辑身份及metadata非授权，以及4节duplicate不制造重复logical device的另一半：不同不能合一。修digest整observation：source/canonical地址/interfaces/MAC/platform/installation ref/name/advertised at/ttl；仅全观察一致合并，表示同广告听两次，而非两物相似。

### D1/RF3-1 medium-high——未来或不可解析永不stale

stale/prune同Date.parse+ttl<=now，future与NaN都使false，非真实判定而表达式失败。十年未来ttl1仍fresh且prune保留；ISO仅regex，不可能2026-13-45T99:99:99Z合法。alien-probe/3及reviewer p1-time-bound复现。修两callsite同双侧predicate：

```js
age >= MAX_CLOCK_SKEW_MS in the future  -> stale   (replay / hostile / clock skew)
age < 0 within the skew window          -> fresh   (an ordinary NTP-ahead peer)
age >= ttl                              -> stale
unparseable                             -> stale
```

超过skew的未来stale；窗口内普通NTP稍未来fresh；age>=ttl stale；不可解析stale。ISO须calendar round-trip，不可能日期validation先拒。

### D2 high——allowlist查名字，值却prototype读

own enumerable Object.keys，device_id/addresses/advertised_at链读；own仅platform、prototype其余仍ok identified候选，事后换prototype使下次值变。interface同孔。

```text
Object.keys(smuggled)        = ["platform"]
validateAdvertisement().ok   = true
-> candidate_ref             = device:dev-1111…  identified = true  addresses = ["10.9.9.9"]
-> after re-pointing prototype, next call consumes = dev-2222…
validateInterface(proto iface).length = 0
```

bare object仅Object.prototype/null，加每消费字段own读取；前堵inheritance，后堵污染global prototype。null-prototype正常own记录仍准入，无合法成本。

### D6/RF3-3 medium——fresh snapshot重当当前且不gate

normalize T0stamp stale，later照发，一小时后仍false但prune stale。resolve year-old返回地址，upgrade已标stale仍认证加密LOCAL_DIRECT，now只established_at；network change仅subnet判断古peer reachable/no rediscovery。

```text
upgradeToDirectPath(stale candidate, nowMs) : OK -> {"path":"LOCAL_DIRECT","authenticated":true}
onNetworkChange(ancient, same subnet)       : reachable=true rediscovery_required=false
resolveToPairing(stale candidate)           : resolved=true
```

export freshnessOf(candidate,nowMs)重新判；resolve返STALE_ADVERTISEMENT无地址，upgrade抛同码，network change按当前时间重算，aged不可达。无time source也无snapshot时checked:false，不能把“不知道stale”包装“已证fresh”。

### D5 medium——同地址多拼写且无shape规则

lowercase不trim/canonical，padded192.168.1.20与正常两条，address_count2，padding破merge/dedup。修地址无whitespace/lowercase，interface文本不padding，在唯一进入点一次canonical。刻意不加IP literal/unicast，见4节。

### D3 low-medium——每轮cap单侧

slice(0,min(limit,256))只上限；300广告limit-1得299、-5得295，违自身256及bounded。修limit非负safeinteger，再上clamp大值；负值caller错，应拒非静默改cap，与原silent错误fresh同理。

### D4 low——身份保留不变量无计算witness

把retained集合与其自身构superset比，logical_identity_changed常false。工作簿D8网络变化rediscover不改身份唯一witness，对不可达/无地址/未再发现仍preserved true。修identity绑定被观察candidate_ref，ref在不同device间转移为conflict，旧identity无candidate承载为loss，identity_conflicts/lost_identities均影响changed。

## 3. 调和reviewer，非逐字接受

- D4“所有输入true”夸大，两id同ref确false。真实缺陷是对well-formed不能失败，正验收所指，只保准确说法。
- D5无address shape属实，仅修canonical半边。
- D2 reachability接受：只module边界复现。adapter double structuredClone生成plain，所以prototype payload不经double到达；但export normalize/validate直接caller可达，为public真孔，修正确，残余可达问题不当关闭。
- reviewer独立证伪lexicographic latest不可靠疑点：20000seed mixed spelling，0chronological inversion，保负结果免后续重复。

## 4. 刻意不修与理由

1. 不加IP literal/unicast。工作簿明列hostname metadata，scan targets/interface address/subnet皆free text，codes无address类。规则绑定RF002/006/009为schema决策，交Owner不发明。具体upgrade仍接受规范hostname/non-unicast。
2. 不加FUTURE_ADVERTISEMENT。双侧界已使过未来stale，validate-adjacent/prune/resolve/upgrade/network各拒或丢，新码只添词汇不添关闭路径。
3. 不重验trust expiry。assert/upgrade需TRUSTED及device匹配，但trust shape归RF002，此fixture无validity；工作簿缺兄弟可double，invoke expiry属RF002，记录seam不猜修。
4. mac_evidence仍inert，无code路径读，不能攻击randomization/multiNIC/unavailable；现仅未识别digest观察区分、非identity/authority。扩展属Development非Correction。

## 5. 正向实证

- 真无prototype pollution：Object.keys+Array.includes拒own proto/constructor/toString，advertisement/interface两层，global.polluted undefined。九review契约中首个此类未复现。
- 同设备wired/WiFi合一个两sighting；不同identified无地址仍两；同deviceid两广告一candidate一duplicate。
- unidentified仅preview，resolve/assert DEVICE_ID_REQUIRED。
- assert拒null/QUARANTINED/wrongdevice及带trust属性Array；假name/mac.authority不赋权。
- fingerprint大小写/空白/错/缺均拒；directscan65及0拒；candidate structuredClone copy不泄事后input变更，返回freeze；拒绝无state残留，无mutation-before-refusal。
- 256按每轮设计，五轮1280是documented预期。

## 6. 未定选择：问题/选择/理由

1. unidentified无crypto，凭何合？仅whole-observation digest，同广告重复合，其余独立。弱name/name+address/单field让恶意或巧合误合；每sighting counter又永不合真实重复且ref order-dependent，拒。
2. clock skew未定数，MAX_CLOCK_SKEW_MS=5*60*1000 export；分普通NTP与replay，5min高于step-corrected、远低有用replay。reviewer建议2min均无norm依据，export供裁定。
3. ISO round-trip前19字符，使秒及.000两合法spellings均接受，仍拒calendar normalization及NaN；全字符串相等会误拒其一。
4. 负limit拒非clamp，防隐藏caller缺陷。
5. 无now纯module无clock，stale:false/checked:false，仅可证stale才拒；全拒破合法无clockcaller，说fresh重演缺陷。
6. bare+own两层防不同inheritance/global pollution，后仅一helper成本。
7. 八作者tests未改，不同BA003/EM002编码缺陷需改测试；此次八项前后通过证明未覆盖七机制。
8. 未Android/Computer-Use观察；书授权如需，但纯module deterministic double无device界面，无观察没Studio，明记未用授权。

## 7. 测试与CI

作者8/8不改通过，套件8→16；每负配合法邻居：padding拒/canonical过，negative拒/cap仍clamp，继承拒/null-proto own过，expired拒/skew窗口内仍resolve。原复现重放27/27。

```text
node --test tests/*.test.mjs                -> 117 pass, 0 fail
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at f0d8f59)
node scripts/check-bilingual.mjs            -> docs/evidence/data-records SYNCHRONIZED
```

root117、rooms69、city1801/0fail/7skip，promotion10 atf0d8f59，三双语同步。精确4a51996分支CI36728802526 gateway-web/Androidsuccess。

## 8. 诚实自错

- 首regression误1000ms age/30sTTL为stale，1000>=30000假，改ttl+1。
- probe路径运行前错两次：export在contracts子层，verify import需.runtime；未运行probe不证明。
- 曾加stale:null后移除，spread已有无verdict，是shape noise非fix。
- notes引用141/117错，merge实际139/addressKey117，notes修。
- digest取代后addressKey死代码删除，不留unused。

## 9. 结果

七机制全部修复，paired tests及原复现重放；未缩测试/拒合法关闭缺陷，四候选刻意不修见4。无需device观察，没做。

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/remote/RF-003-local-discovery-lan-direct.md
```

CORRECTION_COMPLETE:true，control book原记录已更新。

语言配对 / Language pair: [原文 / Source](../CORRECTION_REPORT.md)
