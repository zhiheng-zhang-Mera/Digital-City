# 闃舵闆嗘垚鏃ュ織 鈥?connection-onboarding锛堝垎鎵瑰悎骞讹級

> **Owner 瑁佸喅锛堣褰曞湪妗堬級锛氭湰闃舵闆嗘垚鐢?Owner 鐩存帴鎸囪锛岃眮鍏嶅垱寤?final integration / merge workbook銆?*
> `mission-book/connection-onboarding/README.md` 绗?5 鑺傝姹?涓変釜 JOIN 鍏ㄩ儴 opposite-host review 瀹屾垚鍚庢墠鑳藉垱寤?> 闆嗘垚宸ヤ綔涔?銆侽wner 浜?2026-10-03 鐩存帴鎸囩ず"闆嗘垚锛岀洿鎺ュ悎骞跺埌 main"骞舵槑纭?**涓嶉渶瑕佸伐浣滀功**"锛?> 鍥犳鏈浠?**Owner 鎸囪璞佸厤**锛圤wner-directed exemption锛夎烦杩囬泦鎴愬伐浣滀功锛屾敼鐢辨湰鏃ュ織鎵挎媴鐧昏鑱岃矗銆?> 杩欐槸**璞佸厤**鑰岄潪"瑙勫垯宸叉弧瓒冲悗鐪佺暐"锛氳鍒欏師鏂囪姹傜殑宸ヤ欢娌℃湁琚垱寤猴紝姝ゅ濡傚疄鍐欐槑锛岄伩鍏嶆棩鍚庤璇绘垚"鎸?搂5 姝ｅ父璧板畬"銆?
## 1. 鍒嗘壒鍚堝苟鐨勪緷鎹笌缁撴灉

涓変釜鍒嗘敮鐨?exact-head CI 鍏ㄩ儴 SUCCESS锛?
```text
join/JOIN-501 @ e925ae1   CI 37116491572 SUCCESS
join/JOIN-502 @ 86deda9   CI 37119234473 SUCCESS
join/JOIN-503 @ 77f7f2a   CI 37120646153 SUCCESS
```

椤哄簭鎸?*鍒嗘敮琛€缂?*纭畾锛屼笉鎸夊亸濂斤細JOIN-503 鏄粠 JOIN-501 鐨?head 鍒嗗嚭鐨勶紝鍥犳 `501 鈫?503` 鍙棤鍐茬獊缁勫悎銆?
### 绗竴鎵癸紙宸插苟鍏?main锛屽凡鎺ㄩ€侊級

```text
merge 5d67976  JOIN-501
merge 967a959  JOIN-503
main = 967a9597fb9d1c0f1fc78886e4bde6e4f3d24dbf
鍐茬獊 0
闆嗘垚鍚庡叏閲忔祴璇?1085 tests / 1085 pass / 0 fail
check-bilingual锛歞ocs / evidence / data-records 涓変釜 PAIR_STATUS = SYNCHRONIZED
hosted CI锛欳ity linkage check 37124791081 SUCCESS锛沄0.2 checks 37124791099 瑙?搂3
```

### 绗簩鎵癸紙JOIN-502锛?*鏈苟鍏?main**锛?
`main` 鐨勫綋鍓嶇姸鎬?*涓嶅寘鍚?* JOIN-502銆侸OIN-502 淇濈暀鍦ㄧ嫭绔嬮泦鎴愬垎鏀笂缁х画鏀跺彛锛?
```text
branch integration/join-502-nearby
906df7e  union 瑙ｅ啿绐?+ 鍒犻櫎鏃у畾涔?d419004  鍒犻櫎绗簩娈甸壌鏉冨墠缃?```

## 2. 鍐茬獊涓?鏍囪涔嬪"鐨勫亸宸紙鏈闆嗘垚鏈€鍏抽敭鐨勪竴鏉＄粡楠岋級

鏂囨湰灞傞潰鐨?union 鍙В鍐?*鍐茬獊鏍囪鍐?*鐨勫垎姝э紱涓や釜鍒嗘敮闀挎湡鍒嗗弶鍚庯紝鐪熸鐨勫亸宸湪**鏍囪涔嬪**銆傛湰娆¤繛缁笁灞傞兘灞炴绫伙細

| 灞?| 鐜拌薄 | 鐘舵€?|
|---|---|---|
| 1 | union 鍙繚鐣欎簡 `deviceClock`锛屼涪浜?`nearbyTimeoutMs` 鈫?姣忎釜 JOIN-502 娴嬭瘯閮芥浜?*璇锋眰鏃?* `ReferenceError`锛堝姞杞芥湡妫€鏌ユ姄涓嶅埌锛?| 宸蹭慨 |
| 2 | union 淇濈暀浜?*涓ゆ閴存潈鍓嶇疆**锛岄潬鍓嶇殑閭ｆ鍏堟墽琛?鈫?鎵€鏈?join 璺敱杩斿洖 **401**锛岃€岃矾鐢卞悗闈㈢殑瀹炵幇鏄纭殑 | 宸蹭慨 |
| 3 | 闆嗘垚鍚庣殑 snapshot 璋冪敤 `join.snapshot()`锛岃€屽悎鍏ョ殑 `join.mjs` **涓嶆彁渚涜鏂规硶** 鈫?join 鍒楄〃涓?`undefined`锛孞OIN-502 缃戝叧濂椾欢鍥犳鎶?`Cannot read properties of undefined` | **鏈慨** |

绗?3 灞傛槸**璇箟**宸紓锛堟柟娉曚笉瀛樺湪锛夛紝涓嶆槸鏂囨湰宸紓锛岄渶瑕佹妸 JOIN-502 鐨?`join.mjs` 涓?main 涓?JOIN-501/503 涔嬪悗鐨?`render()`銆佸惎鍔ㄨ矾寰勩€佷簨浠跺垎鍙戦€愬嚱鏁版瘮瀵癸紝鍒ゆ柇鏄?琛ヤ竴涓柟娉?杩樻槸"鏀圭敤鏂板绾?銆傝繖姝ｆ槸 搂11 瑕佹眰"鍐茬獊鎸夋樉寮?union/superset 澶勭悊"鐨勭湡瀹炲伐浣滈噺鎵€鍦ㄣ€?
## 3. CI 涓庢畫浣欓棬妲?
- 绗竴鎵?main 鐨?V0.2 checks 宸茶Е鍙戯紙run 瑙?搂1锛夛紱**闇€鍦ㄦ帹閫佸悗鎸夊叾 terminal 鐘舵€佸洖濉?*锛屾湭缁挎椂涓嶅緱瀹ｇО
  "merge 鍚庨獙鏀堕€氳繃"銆?- 绗簩鎵规湭鍚堝苟锛屽洜姝?*涓嶄骇鐢?merged-main CI**锛汮OIN-502 浠嶅浜?宸插鏍镐絾鏈泦鎴?鐨勭姸鎬併€?- 涓変釜宸ヤ綔涔︾殑 `merge_authority` 鍧囦负 false锛屾湰娆″悎骞舵槸 Owner 鎺堟潈鐨勯泦鎴愬姩浣滐紝**涓嶆敼鍙樺伐浣滀功鑷韩鐨勫瓧娈佃涔?*銆?
## 4. 涓嬩竴姝ワ紙鍙洿鎺ョ収鍋氾級

1. 淇 3 灞傦細姣斿 `services/dev-gateway/join.mjs` 涓?`join502` 鍒嗘敮涓婄殑鍚屽悕鏂囦欢锛岀‘瀹?`snapshot()` 鏄己澶辫繕鏄敼鍚嶃€?2. 閫愬嚱鏁版瘮瀵?`apps/web/app.js` 鐨?`render()` / 鍚姩璺緞 / 浜嬩欢鍒嗗彂锛圝OIN-502 鐨勫叆鍩庨潰鍋囧畾"棣栧睆鍗冲叆鍩?锛?   鍦?JOIN-501 鐨?lifecycle 涓?JOIN-503 鐨勪細璇濆紩瀵艰繘鍏ュ悗宸蹭笉鎴愮珛锛夈€?3. 鍏ㄩ噺 1104 椤?+ `check:docs` 閫氳繃鍚庯紝鎶?`integration/join-502-nearby` 鍚堝叆 main锛屽苟鍦?*绮剧‘ merge commit** 涓婇獙璇?CI銆