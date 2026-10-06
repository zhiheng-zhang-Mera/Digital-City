# CEX-701 Paper Material Index

| Event | Observation / choice | Evidence | Status |
|---|---|---|---|
| Claim | Web fetch receives cloneFindings but Settings drops it; no normal rebind entry. Choose existing Settings host and preserve authority. | Utopia baseline40e18db4a6cf5bba1490181a473bc62e681edb8a apps/web/app.js:688; server.mjs:586 | INVESTIGATION |

Raw evidence stays Utopia/.runtime/evidence/mission-book/CEX-701/; selected bounded data goes Utopia/evidence/raw/mission-book/CEX-701/. No performance or physical-device result claimed yet.

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

Watchlist reconciliation at control rules9541aeb: research_watchlist_hits=[RS-G3-EXEC-WORK-ARTIFACT,RS-G3-IDENTITY-PROVENANCE,RS-G3-INDEPENDENT-REVIEW-BOUNDARY,RS-G4-CAPABILITY-STATE,RS-G4-USER-REACHABLE-TERMINAL]; highest_research_grade_observed=G4_RARE_SYSTEMIC; research_capture_level=MAXIMUM_BOUNDED. These are City predefined candidate classes, not novelty claims. Development/CI is complete while native online/opposite-host accepted intent remains pending; registry records four dimensions honestly. Source/report/CI links form the bounded event chain; unobservable timing/counters remain unknown.

Watchlist freshness: rulesa44613d supersede the earlier snapshot classification. USER-REACHABLE-TERMINAL is now RS-G3-USER-REACHABLE-TERMINAL, G3_SPARSE_ACTIVE; earlier frozen snapshot labels above are historical. Capability-state remains RS-G4-CAPABILITY-STATE. Literature reclassification cause comes from external policy update; recurrence prevention/activation totals NOT_OBSERVABLE.

## Opposite-host review extension / 瀵逛晶鐗╃悊涓绘満澶嶆牳锛圡ech, MEGA-REP锛?

The statements above are the author's and remain chronological. They are superseded on one point only.

Formal Review PASS on exact heada24c04401308b11548626239e8ca1f9b4276bbdf by Mech (COMPUTERNAME MEGA-REP), a different physical host from development_host Alien-codex. Twelve probes written for the review (utopia:tests/cex701-mech-review-probes.test.mjs, branch review/CEX-701-mech-review ate83edd8)12/12 pass and CONSTRUCT every scenario the workbook Formal Review section names: UNBOUND reinstall, legitimate rebind, wrong proof, clone finding, a session rebinding another installation, self revoke and owner revoking another installation. Two of them are driven through a real browser against a real gateway; the owner completes a recovery end to end and a member receives actionable owner guidance. Author suite rerun unmodified10/10. Android executed by the reviewer: testDebugUnitTest84/84 across15 suites (DeviceRecoveryTest4/4). Exact-head CI re-measured: push37206760171 SUCCESS, PR14 pull37207112712 SUCCESS on the same head, reciprocal-contract37207112720 SUCCESS. No existing assertion was relaxed: tests/host-preflight.test.mjs is touched but purely additive (6 insertions, 0 deletions).

Four hypotheses were attacked and REJECTED, and are retained as evidence: the API answers already_bound when asked to move a bound installation, so the UI gate is not the only barrier; the City host is not a revocable installation, so revoking every listed installation leaves health, city and task creation at200; a City whose only installation is UNBOUND still offers the host logical device from city.members, so the recovery form is never an unsubmittable dead end; and credentialFingerprint is sha256(secret), a non-reversible handle, so the clone payload discloses no credential. A fifth hypothesis - that the Android parser reads a field the server does not send - was also rejected: the store row carries a nested rebind block which the API projects to a top-level rebindRequired boolean, and the parser reads the API shape.

Findings, none blocking. F1 LOW control plane: fourteen template fields were absent, including every exposure field this task is about (user_exposure_class, user_exposure_surface, user_exposure_nesting, backend_wiring, ui_exemption_reason) plus the four research-grade fields this index nevertheless cites, plus the state-identity, monitor and decision evidence fields; backfilled by the review by transcribing the authors own CAP-IDENTITY-001 record and the current watchlist. F2 LOW: the workbook mandatory paper-material point for repair-before and repair-after user-path step counts is recorded NOWHERE - not in these reports, not in either receipt, not in the event chain. The reviewer did NOT supply it, because inventing a step count would fabricate the measurement the exposure-lag claim depends on. F3 INFORMATIONAL: this record lists credential fingerprint as intentionally hidden while every installations row carries it; the withholding is presentation-only. F4 INFORMATIONAL: a rebind naming a bound installations own device is accepted and re-records the proof, so the guard protects integrity but not the audit trail.

Regression: 196 tests across the related gateway/host/device/enrollment/identity set, 193 pass and 3 fail, the three being the known environmental host-city-launcher cases that refuse to disturb a resident City. Connected/native Android recovery remains NOT_RUN and intent validation remains NOT_TESTED; no performance or user-path measurement is claimed. Terminal marker DEVICE_RECOVERY_ENTRY_ACCEPTED released. See REVIEW_REPORT.md.

语言配对 / Language pair: [English](./PAPER_MATERIAL_INDEX.md) · [中文](./zh-CN/PAPER_MATERIAL_INDEX.md)
