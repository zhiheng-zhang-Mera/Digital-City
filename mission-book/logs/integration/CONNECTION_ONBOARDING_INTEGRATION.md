# 闂冭埖顔岄梿鍡樺灇閺冦儱绻?閳?connection-onboarding閿涘牆鍨庨幍鐟版値楠炶绱?
> **Owner 鐟佷礁鍠呴敍鍫ｎ唶瑜版洖婀鍫礆閿涙碍婀伴梼鑸殿唽闂嗗棙鍨氶悽?Owner 閻╁瓨甯撮幐鍥吇閿涘矁鐪崗宥呭灡瀵?final integration / merge workbook閵?*
> `mission-book/connection-onboarding/README.md` 缁?5 閼哄倽顩﹀Ч?娑撳閲?JOIN 閸忋劑鍎?opposite-host review 鐎瑰本鍨氶崥搴㈠閼宠棄鍨卞?> 闂嗗棙鍨氬銉ょ稊娑?閵嗕窘wner 娴?2026-10-03 閻╁瓨甯撮幐鍥┿仛"闂嗗棙鍨氶敍宀€娲块幒銉ユ値楠炶泛鍩?main"楠炶埖妲戠涵?**娑撳秹娓剁憰浣镐紣娴ｆ粈鍔?*"閿?> 閸ョ姵顒濋張顒侇偧娴?**Owner 閹稿洩顓荤挒浣稿帳**閿涘湦wner-directed exemption閿涘鐑︽潻鍥肠閹存劕浼愭担婊€鍔熼敍灞炬暭閻㈣鲸婀伴弮銉ョ箶閹垫寧濯撮惂鏄忣唶閼卞矁鐭楅妴?> 鏉╂瑦妲?*鐠炰礁鍘?*閼板矂娼?鐟欏嫬鍨鍙夊姬鐡掑啿鎮楅惇浣烘殣"閿涙俺顫夐崚娆忓斧閺傚洩顩﹀Ч鍌滄畱瀹搞儰娆㈠▽鈩冩箒鐞氼偄鍨卞鐚寸礉濮濄倕顦╂俊鍌氱杽閸愭瑦妲戦敍宀勪缉閸忓秵妫╅崥搴ゎ潶鐠囩粯鍨?閹?鎼? 濮濓絽鐖剁挧鏉跨暚"閵?
## 1. 閸掑棙澹掗崥鍫濊嫙閻ㄥ嫪绶烽幑顔荤瑢缂佹挻鐏?
娑撳閲滈崚鍡樻暜閻?exact-head CI 閸忋劑鍎?SUCCESS閿?
```text
join/JOIN-501 @ e925ae1   CI 37116491572 SUCCESS
join/JOIN-502 @ 86deda9   CI 37119234473 SUCCESS
join/JOIN-503 @ 77f7f2a   CI 37120646153 SUCCESS
```

妞ゅ搫绨幐?*閸掑棙鏁悰鈧紓?*绾喖鐣鹃敍灞肩瑝閹稿浜告總鏂ょ窗JOIN-503 閺勵垯绮?JOIN-501 閻?head 閸掑棗鍤惃鍕剁礉閸ョ姵顒?`501 閳?503` 閸欘垱妫ら崘鑼崐缂佸嫬鎮庨妴?
### 缁楊兛绔撮幍鐧哥礄瀹告彃鑻熼崗?main閿涘苯鍑￠幒銊┾偓渚婄礆

```text
merge 5d67976  JOIN-501
merge 967a959  JOIN-503
main = 967a9597fb9d1c0f1fc78886e4bde6e4f3d24dbf
閸愯尙鐛?0
闂嗗棙鍨氶崥搴″弿闁插繑绁寸拠?1085 tests / 1085 pass / 0 fail
check-bilingual閿涙瓰ocs / evidence / data-records 娑撳閲?PAIR_STATUS = SYNCHRONIZED
hosted CI閿涙ity linkage check 37124791081 SUCCESS閿涙矂0.2 checks 37124791099 鐟?鎼?
```

### 缁楊兛绨╅幍鐧哥礄JOIN-502閿?*閺堫亜鑻熼崗?main**閿?
`main` 閻ㄥ嫬缍嬮崜宥囧Ц閹?*娑撳秴瀵橀崥?* JOIN-502閵嗕靖OIN-502 娣囨繄鏆€閸︺劎瀚粩瀣肠閹存劕鍨庨弨顖欑瑐缂佈呯敾閺€璺哄經閿?
```text
branch integration/join-502-nearby
906df7e  union 鐟欙絽鍟跨粣?+ 閸掔娀娅庨弮褍鐣炬稊?d419004  閸掔娀娅庣粭顑跨癌濞堢敻澹岄弶鍐ㄥ缂?```

## 2. 閸愯尙鐛婃稉?閺嶅洩顔囨稊瀣樆"閻ㄥ嫬浜稿顕嗙礄閺堫剚顐奸梿鍡樺灇閺堚偓閸忔娊鏁惃鍕閺夛紕绮℃宀嬬礆

閺傚洦婀扮仦鍌炴桨閻?union 閸欘亣袙閸?*閸愯尙鐛婇弽鍥唶閸?*閻ㄥ嫬鍨庡褝绱辨稉銈勯嚋閸掑棙鏁梹鎸庢埂閸掑棗寮堕崥搴礉閻喐顒滈惃鍕焊瀹割喖婀?*閺嶅洩顔囨稊瀣樆**閵嗗倹婀板▎陇绻涚紒顓濈瑏鐏炲倿鍏樼仦鐐搭劃缁紮绱?
| 鐏?| 閻滄媽钖?| 閻樿埖鈧?|
|---|---|---|
| 1 | union 閸欘亙绻氶悾娆庣啊 `deviceClock`閿涘奔娑禍?`nearbyTimeoutMs` 閳?濮ｅ繋閲?JOIN-502 濞村鐦柈鑺ヮ劥娴?*鐠囬攱鐪伴弮?* `ReferenceError`閿涘牆濮炴潪鑺ユ埂濡偓閺屻儲濮勬稉宥呭煂閿?| 瀹歌弓鎱?|
| 2 | union 娣囨繄鏆€娴?*娑撱倖顔岄柎瀛樻綀閸撳秶鐤?*閿涘矂娼崜宥囨畱闁絾顔岄崗鍫熷⒔鐞?閳?閹碘偓閺?join 鐠侯垳鏁辨潻鏂挎礀 **401**閿涘矁鈧矁鐭鹃悽鍗炴倵闂堛垻娈戠€圭偟骞囬弰顖涱劀绾喚娈?| 瀹歌弓鎱?|
| 3 | 闂嗗棙鍨氶崥搴ｆ畱 snapshot 鐠嬪啰鏁?`join.snapshot()`閿涘矁鈧苯鎮庨崗銉ф畱 `join.mjs` **娑撳秵褰佹笟娑滎嚉閺傝纭?* 閳?join 閸掓銆冩稉?`undefined`閿涘瓰OIN-502 缂冩垵鍙ф總妞炬閸ョ姵顒濋幎?`Cannot read properties of undefined` | **閺堫亙鎱?* |

缁?3 鐏炲倹妲?*鐠囶厺绠?*瀹割喖绱撻敍鍫熸煙濞夋洑绗夌€涙ê婀敍澶涚礉娑撳秵妲搁弬鍥ㄦ拱瀹割喖绱撻敍宀勬付鐟曚焦濡?JOIN-502 閻?`join.mjs` 娑?main 娑?JOIN-501/503 娑斿鎮楅惃?`render()`閵嗕礁鎯庨崝銊ㄧ熅瀵板嫨鈧椒绨ㄦ禒璺哄瀻閸欐垿鈧劕鍤遍弫鐗堢槷鐎电櫢绱濋崚銈嗘焽閺?鐞涖儰绔存稉顏呮煙濞?鏉╂ɑ妲?閺€鍦暏閺傛澘顨栫痪?閵嗗倽绻栧锝嗘Ц 鎼?1 鐟曚焦鐪?閸愯尙鐛婇幐澶嬫▔瀵?union/superset 婢跺嫮鎮?閻ㄥ嫮婀＄€圭偛浼愭担婊堝櫤閹碘偓閸︺劊鈧?
## 3. CI 娑撳孩鐣担娆撴，濡?
- 缁楊兛绔撮幍?main 閻?V0.2 checks 瀹歌尪袝閸欐埊绱檙un 鐟?鎼?閿涘绱?*闂団偓閸︺劍甯归柅浣告倵閹稿鍙?terminal 閻樿埖鈧礁娲栨繅?*閿涘本婀紒鎸庢娑撳秴绶辩€癸絿袨
  "merge 閸氬酣鐛欓弨鍫曗偓姘崇箖"閵?- 缁楊兛绨╅幍瑙勬弓閸氬牆鑻熼敍灞芥礈濮?*娑撳秳楠囬悽?merged-main CI**閿涙碑OIN-502 娴犲秴顦╂禍?瀹告彃顦查弽闀愮稻閺堫亪娉﹂幋?閻ㄥ嫮濮搁幀浣碘偓?- 娑撳閲滃銉ょ稊娑旓妇娈?`merge_authority` 閸у洣璐?false閿涘本婀板▎鈥虫値楠炶埖妲?Owner 閹哄牊娼堥惃鍕肠閹存劕濮╂担婊愮礉**娑撳秵鏁奸崣妯轰紣娴ｆ粈鍔熼懛顏囬煩閻ㄥ嫬鐡у▓浣冾嚔娑?*閵?
## 4. 娑撳绔村銉礄閸欘垳娲块幒銉у弾閸嬫熬绱?
1. 娣囶喚顑?3 鐏炲偊绱板В鏂款嚠 `services/dev-gateway/join.mjs` 娑?`join502` 閸掑棙鏁稉濠勬畱閸氬苯鎮曢弬鍥︽閿涘瞼鈥樼€?`snapshot()` 閺勵垳宸辨径杈箷閺勵垱鏁奸崥宥冣偓?2. 闁劕鍤遍弫鐗堢槷鐎?`apps/web/app.js` 閻?`render()` / 閸氼垰濮╃捄顖氱窞 / 娴滃娆㈤崚鍡楀絺閿涘湞OIN-502 閻ㄥ嫬鍙嗛崺搴ㄦ桨閸嬪洤鐣?妫ｆ牕鐫嗛崡鍐插弳閸?閿?   閸?JOIN-501 閻?lifecycle 娑?JOIN-503 閻ㄥ嫪绱扮拠婵嗙穿鐎佃壈绻橀崗銉ユ倵瀹歌弓绗夐幋鎰彌閿涘鈧?3. 閸忋劑鍣?1104 妞?+ `check:docs` 闁俺绻冮崥搴礉閹?`integration/join-502-nearby` 閸氬牆鍙?main閿涘苯鑻熼崷?*缁墽鈥?merge commit** 娑撳﹪鐛欑拠?CI閵
## 5. 后续：连接界面（Owner 追加需求）

Owner 追加要求：**用户必须能在客户端 UI 的端口页面以多种方式快捷远程连接任意多台 PC**；连接形态包括同网同房、不同房间同网、**不同网络**（宽带/WiFi/移动）乃至**不同城市**；连接后所有 PC 应在**同一个 City**，在线设备列表里**彼此可见**；主城应选"网络与硬件综合最适合承载"的那台。并明确：**入城通道保留在端口页面**。

实现（`main` 已包含）：

```text
apps/web/primary-city.js      主城决策：网络范围阶梯（local > lan > remote > bluetooth > unknown）、
                              接入方式（有线 > 无线，计费链路减半）、能力（缺项排除而非取平均）、
                              chooseGroupCarrier：载体必须"对端够得着"，无人可达时点名被落下的对端
apps/web/connect-surface.js   PC 列表：每台一行（含本机、任意 N 台），最快接入方式、能力摘要、
                              ★ 推荐主城 + 理由、行内动作（接入 / 邀请 / 用本机）
services/dev-gateway/nearby.mjs  joinCapability 增加 carrierFacts；attachment/metered 保持 null（node 测不到）
apps/web/index.html           端口页面新增 #connect-host（列表在入城通道**上方**，通道未移动）
```

验证：

```text
新增测试          27 项（14 主城决策 + 13 连接面）
全量测试          1131 tests / 1131 pass / 0 fail
check-bilingual   docs / evidence / data-records 三个 SYNCHRONIZED
merged-main CI    a9481ef   City linkage check 37160987198 SUCCESS
                            V0.2 checks        37160987195 SUCCESS（gateway-web + android）
```

**一处只有真实浏览器才能发现的缺陷**：连接面初版给冻结的列表对象赋值，整页崩溃（`Cannot assign to read only property`）——模块单测看不到，靠真实浏览器探测发现并修复。记录在此，因为它正是"界面必须实机验证、不能只靠单测"的实例。

**诚实边界**：浏览器只能测到本机核数，`attachment`/`metered` 在 node 与浏览器中都测不到，因此保持 null；主城评分对本机会显示"证据很少"，这是**如实**而非缺陷。跨网络的真实路径（VPN/端口转发/中继）本次只做了**判定与提示**，未建立隧道。