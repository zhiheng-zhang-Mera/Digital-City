# CEX-701 论文材料索引

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书／状态；历史事实与未知边界原样保留，不新增验收。
>
> 原报告早期表格已有编码损坏／丢字。下方原样保留损坏片段作为来源记录，不猜测无法恢复字句。后续未损坏英文内容完整译出。清晰短报告支持的早期事件说明仅作为交叉阅读，不替代损坏原文。

| 事件 | 观察／选择 | 证据 | 状态 |
|---|---|---|---|
| 领取 | Web fetch收到cloneFindings但Settings丢弃；无普通rebind入口。选择既有Settings host并保留权威 | Utopia baseline40e18db4a6cf5bba1490181a473bc62e681edb8a apps/web/app.js:688；server.mjs:586 | INVESTIGATION |

原始证据留Utopia/.runtime/evidence/mission-book/CEX-701/；选定有界数据进入Utopia/evidence/raw/mission-book/CEX-701/。尚未主张性能或实体设备结果。

## 原表格损坏片段（原样引用）

```text
| Web negative | 缂哄けclone鎻愮ず鍙妎wner鎭㈠寮曞锛?涓祻瑙堝櫒鏂█瓒呮椂锛涙柊澧炵湡瀹濽NBOUND/clone fixture | Utopia .runtime/evidence/mission-book/CEX-701/web-01/red.log | REPRODUCED |
| Integration failure | locale閿娆￠敊璇彃鍏xport瀵硅薄锛岃娉曞け璐ヤ娇杩炴帴鏃犳硶瀹屾垚锛涘凡鏀筸essages鎵╁睍 | web-01/green.log锛沘pps/web/i18n/{en,zh-CN}.js | REPAIRED |
| Scope conflict | owner鍒囨崲鎴愬憳鏃舵棫roster缂撳瓨鍙畫鐣欙紱generation/credential fence涓庤繛鎺ョ紦瀛樺け鏁堜慨澶?| web-01/scope-switch-red.log / scope-switch-green.log | REPAIRED |
| Web validation | 鎭㈠UI鍙婃棫鏉冮檺鍥炲綊16/16锛涗笉榛樿閫夎澶囥€佷笉鍒犻櫎clone銆侀敊璇痯roof403銆佽嚜韬挙閿€涓庤法瀹夎鎷掔粷 | evidence/raw/mission-book/CEX-701/web-recovery-receipt.json锛涘疄鐜癴1e1cea锛坒ull SHA瑙乨evelopment璁板綍锛?| COMPONENT_PASS |
| Environment | 鏃AVA_HOME/ANDROID_HOME澶辨晥锛孌:/Users/15601/AppData/Local/Android閾炬帴鎸囧悜鑷韩锛孲DK涓嶅彲璁块棶锛涢€夋嫨鐙珛D鐩樺伐鍏风幆澧冿紝涓嶆敼绯荤粺閾炬帴 | android-baseline.log锛涘綋鍓嶆枃浠跺睘鎬ф煡璇?| TOOL_SETUP_PENDING |

| Android environment repair | 浣跨敤鐙珛 D:/Tools/UtopiaAndroidSdk 涓?Android Studio JBR锛涙湭淇敼鐢ㄦ埛鑷寚鍚戦摼鎺?| Utopia SDK-install.log 涓?android-01/green.log | REPAIRED |
| Android test-first | 鏂版仮澶嶇瓥鐣ュ嚱鏁板皻涓嶅瓨鍦ㄦ椂缂栬瘧澶辫触锛涘疄鐜板悗84椤规祴璇曢€氳繃銆丄PK鏋勫缓閫氳繃 | Utopia android-01/red-complete.log / green.log | COMPONENT_PASS |
| Physical UI instrument failure | 鍒濇dump鏃╀簬鍚姩瀹屾垚锛岃杩涘叆绯荤粺璁剧疆锛涗互am start -W鍙妏ackage鏍搁獙绾犳 | Utopia android-01/initial-ui.xml / settings-ui.xml / recovery-settings.xml | CORRECTED |
| Physical bounded result | OPPO PERM00灞曠ず绂荤嚎鎭㈠鎻愮ず銆乷wner Web鍏ュ彛銆侀噸鏂拌繛鎺ユ寜閽紱瀹夎APK涓庢瀯寤篠HA256涓€鑷淬€傚湪绾挎仮澶嶆湭娴?| Utopia evidence/raw/mission-book/CEX-701/android-recovery-receipt.json | COMPONENT_PASS; connected recovery NOT_RUN |

| Independent review P2 | 鎭㈠纭璺ㄥ嚟鎹繚鐣欙紱鏂板鐪熷疄鍒囨崲鐢ㄤ緥澶嶇幇鍚庢竻绌篸raft/proof骞跺洿鏍忔棫璇锋眰 | Utopia web-01/draft-context-red.log / draft-context-green.log锛涙渶缁坰ource a24c04401308b11548626239e8ca1f9b4276bbdf | REPAIRED;17/17 |
| Exact source CI | CI37206760171 success锛岀粦瀹氭渶缁坰ource a24c04401308b11548626239e8ca1f9b4276bbdf锛涘厛鍓嶆垚鍔熷彧璇佹槑鏃ead | DEVELOPMENT_HANDOFF.md | PASS |
| Registry chained update | 缁х画浠诲姟鏈熼棿鏂奥?4C鐢熸晥锛涜拷鍔燙AP-IDENTITY-001 candidate锛孉ndroid鍦ㄧ嚎鍙婃寮忚涔夐獙鏀朵繚鎸乸ending | capability-registry/records/CAP-IDENTITY-001.yaml | CANDIDATE_RECONCILED |
```

交叉阅读：CLAIM、CONTEXT_LIFECYCLE、DEVELOPMENT_HANDOFF清楚记录缺Web恢复UI、locale语法错误、Owner切member旧roster／恢复确认缓存、继承SDK环境无效、物理UI dump过早、凭据上下文切换草稿修复。最终Web17／17、Android84／84、APK构建和OPPO离线Settings观察；在线恢复NOT_RUN。独立技术修复源码a24c04401308b11548626239e8ca1f9b4276bbdf，精确CI37206760171 SUCCESS；新增CAP-IDENTITY-001候选，原生在线及正式意图待定。此交叉说明不声称逐字恢复损坏表。

## Watchlist 对账与时效

控制规则9541aeb记录：

```text
research_watchlist_hits=[RS-G3-EXEC-WORK-ARTIFACT,RS-G3-IDENTITY-PROVENANCE,RS-G3-INDEPENDENT-REVIEW-BOUNDARY,RS-G4-CAPABILITY-STATE,RS-G4-USER-REACHABLE-TERMINAL]
highest_research_grade_observed=G4_RARE_SYSTEMIC
research_capture_level=MAXIMUM_BOUNDED
```

这些是城市预定义候选类别，不是新颖性主张。开发／CI完成，原生在线／对侧接受意图仍待定；Registry诚实记录四维。源／报告／CI链接形成有界事件链，不可观察时间／计数未知。

规则a44613d取代先前快照分类。USER-REACHABLE-TERMINAL现RS-G3-USER-REACHABLE-TERMINAL、G3_SPARSE_ACTIVE；上方冻结标签属历史。Capability-state仍RS-G4-CAPABILITY-STATE。文献重分类原因来自外部策略更新；复发预防／激活总数NOT_OBSERVABLE。

## 对侧物理主机评审扩展（Mech，MEGA-REP）

上方陈述属于作者，保留时间线；仅一点被取代。

Mech（COMPUTERNAME MEGA-REP，与development_host Alien-codex不同物理主机）在精确a24c04401308b11548626239e8ca1f9b4276bbdf Formal Review PASS。新写utopia:tests/cex701-mech-review-probes.test.mjs、review/CEX-701-mech-review at e83edd8，12／12，构造全部工作书Formal Review场景：UNBOUND重装、合法rebind、错误proof、clone、session重绑其他installation、自撤销、Owner撤他installation。两探针真实浏览器／Gateway；Owner端到端恢复，member获可执行Owner指导。作者套件原样10／10。评审本机Android testDebugUnitTest84／84、15套件（DeviceRecoveryTest4／4）。重测精确CI：push37206760171 SUCCESS、同头PR14 pull37207112712 SUCCESS、reciprocal37207112720 SUCCESS。旧断言未放宽；host-preflight.test.mjs纯新增6行、删除0。

四假设攻击后拒绝，保留证据：请求移动BOUND installation API already_bound，UI门禁不是唯一屏障；City host非可撤installation，全部撤仍health／city／任务创建200；唯一installation UNBOUND时city.members仍提供host逻辑设备，恢复表单不是无法提交死路；credentialFingerprint=sha256(secret)不可逆句柄，clone不泄凭据。第五“Android parser读服务器不发字段”也拒：store嵌套rebind由API投影顶层rebindRequired，parser读API形状。

发现均不阻塞。F1 LOW控制平面缺14模板字段，含所有exposure（user_exposure_class／surface／nesting、backend_wiring、ui_exemption_reason）、本索引引用四research-grade，以及state-identity／monitor／decision证据；评审按作者CAP-IDENTITY-001及当前watchlist回填。F2 LOW必需修前／后用户路径步骤数无处记录：报告／回执／事件链均无；评审未补，因为发明步骤会伪造exposure-lag依赖测量。F3 INFORMATIONAL指纹称刻意隐藏但每installation行携带，仅展示层不显示。F4 INFORMATIONAL对BOUND installation命名自身device rebind接受并重录proof，guard保完整性、不保审计轨迹。

回归相关Gateway／host／device／enrollment／identity196测试，193通过、3失败为已知环境host-city-launcher拒扰常驻City。在线／原生Android恢复仍NOT_RUN，意图NOT_TESTED；无性能／用户路径测量。释放DEVICE_RECOVERY_ENTRY_ACCEPTED。见 [REVIEW_REPORT.md](./REVIEW_REPORT.md)。

语言配对 / Language pair: [English](../PAPER_MATERIAL_INDEX.md) · [中文](./PAPER_MATERIAL_INDEX.md)
