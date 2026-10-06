---
workbook_id: CEX-701
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 701
execution_enabled: true
status: COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f"]
dependency_source_workbooks: []
dependency_source_shas: []
development_baseline_sha: "40e18db4a6cf5bba1490181a473bc62e681edb8a"
baseline_resolution_evidence: "mission-book/reports/CEX-701/CLAIM_RECORD.md"
baseline_blocker: null
dependencies: ["JOIN-503 device enrollment semantics present"]
development_host: Alien-codex
development_branch: cex/CEX-701-Alien-codex-device-recovery
development_head_sha: "a24c04401308b11548626239e8ca1f9b4276bbdf"
development_ci: "https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37206760171"
development_complete: true
capability_ids: [CAP-IDENTITY-001]
capability_registry_action: BACKFILL
capability_registry_refs: ["capability-registry/records/CAP-IDENTITY-001.yaml"]
capability_registry_sync_status: RECONCILED
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: ["mission-book/reports/CEX-701/CONTEXT_LIFECYCLE.md"]
review_host: "Mech"
review_head_sha: "a24c04401308b11548626239e8ca1f9b4276bbdf"
review_ci: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-05): the review target is the development head itself, a24c04401308b11548626239e8ca1f9b4276bbdf, resolved from refs/heads/cex/CEX-701-Alien-codex-device-recovery (remote tip equals that commit). INDEPENDENCE, proven rather than asserted: this workbook records development_host=Alien-codex, so the reviewer host (Mech, COMPUTERNAME MEGA-REP) is a different physical host from the author, as section 3 requires. DEPENDENCY, verified rather than assumed: this workbook declares the dependency JOIN-503 device enrollment semantics present and required_ancestor_shas [77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f]; the reviewer confirmed JOIN-503 is COMPLETE with review_host Mech and review_complete true, and that 77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f is reachable from the reviewed head (git merge-base --is-ancestor exit 0). Claim-time exact-head CI, re-measured by the reviewer before any verdict: V0.2 checks push run 37206760171 completed/success on the reviewed head (jobs android success, gateway-web success); PR run 37207112712 completed/success on the same head; City linkage check run 37207112720 completed/success (reciprocal-contract). Review scope to be independently constructed per the workbook Formal Review section: UNBOUND reinstall, legitimate rebind, wrong proof, clone finding, a session attempting to rebind another installation, self revoke and owner revoking another installation - plus at least one real browser flow. || VERDICT PASS on the reviewed head. Exact-head CI re-measured by the reviewer: V0.2 checks push run 37206760171 completed/success on a24c04401308b11548626239e8ca1f9b4276bbdf (jobs android success, gateway-web success); PR14 pull run 37207112712 completed/success on the same head; City linkage check run 37207112720 completed/success (reciprocal-contract). Reviewer instruments: twelve independent probes written for this review (utopia tests/cex701-mech-review-probes.test.mjs, branch review/CEX-701-mech-review at e83edd8) 12/12 pass, constructing every scenario the workbook Formal Review section names - UNBOUND reinstall, legitimate rebind, wrong proof, clone finding, a session rebinding another installation, self revoke and owner revoking another installation - with two of them driven through a real browser against a real gateway. Author suite rerun unmodified 10/10. Android executed here: :app:testDebugUnitTest 84/84 across 15 suites (DeviceRecoveryTest 4/4). No existing assertion was relaxed: tests/host-preflight.test.mjs is touched but purely additive (6 insertions, 0 deletions). Four hypotheses were attacked and rejected and are recorded as evidence: the API refuses to move a bound installation with already_bound so the UI gate is not the only barrier; the City host is not a revocable installation so mass revocation cannot brick the City; a City with no other bound installation still offers the host logical device so the recovery form is never an unsubmittable dead end; and credential fingerprints are sha256 handles rather than reversible secrets. Two control-plane findings recorded, neither blocking: F1 LOW (fourteen template fields were absent including every exposure field - user_exposure_class, user_exposure_surface, user_exposure_nesting, backend_wiring, ui_exemption_reason - together with the four research-grade fields the PAPER_MATERIAL_INDEX nevertheless cites, and the state-identity, monitor and decision evidence fields; backfilled by this review by transcribing the authors own CAP-IDENTITY-001 record and the current watchlist), and F2 LOW (the workbook mandatory paper-material point for before and after user-path step counts is recorded nowhere in the reports, the receipts or the event chain; left unrepaired because supplying it would mean fabricating the measurement). Two informational findings: F3 the registry lists credential fingerprint as intentionally hidden while every installations row carries it (sha256 handle, presentation-only withholding) and F4 a rebind naming the bound installations own device is accepted and re-records the proof. Regression: 196 tests in the related gateway/host/device/enrollment set with 193 pass and 3 fail, the three being the known environmental host-city-launcher cases that refuse to disturb a resident City. Connected/native Android recovery and intent validation remain NOT_RUN and NOT_TESTED; no user-path or performance result is claimed. Terminal marker DEVICE_RECOVERY_ENTRY_ACCEPTED released by this review. See reports/CEX-701/REVIEW_REPORT.md. Android-side findings from the same review, none blocking: F5 MEDIUM (DeviceRecovery.kt computes needsRecovery as an any-over-the-whole-scope aggregate and renders it as this installation needs recovery - the live Android path really is scope CITY because pairing hands out the control token, so one unrelated UNBOUND installation makes the phone announce its own recovery is required; workbook requirement 1 is answered for the City rather than for this device); F6 LOW (installationId, state, errorCode, error and cloneFindings reason lack the null guard that displayName and deviceId carry, so on the device runtime a JSON null would become the literal text null - latent today because the shipped Gateway never sends those fields null); F7 LOW (CityClient discards the server errorCode for this route, so an authority refusal arrives as INVOCATION_UNAVAILABLE with no status and is rendered as a connection fault); F8 LOW (the new Android unit assertions contains owner are true for all four message branches and can never fail, no test payload contains a JSON null, and the suite runs on the reference org.json rather than the android.jar semantics, so the two guards the real server exercises are uncovered); F9 INFORMATIONAL (no Settings title branch, and the parsed owner flag is never read so owner and member see identical guidance)."
review_complete: true
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CEX-701
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: DEVICE_IDENTITY_SETTINGS
user_exposure_nesting: L2_CONTEXTUAL
backend_wiring: VERIFIED
ui_exemption_reason: null
research_watchlist_hits: ["RS-G3-EXEC-WORK-ARTIFACT","RS-G3-IDENTITY-PROVENANCE","RS-G3-INDEPENDENT-REVIEW-BOUNDARY","RS-G4-CAPABILITY-STATE","RS-G3-USER-REACHABLE-TERMINAL"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
state_identity_evidence: CAPTURED
state_identity_evidence_refs: ["mission-book/reports/CEX-701/PAPER_MATERIAL_INDEX.md"]
monitor_observability_evidence: NOT_APPLICABLE
monitor_observability_refs: []
decision_trace_evidence: NOT_APPLICABLE
decision_trace_refs: []
terminal_marker: DEVICE_RECOVERY_ENTRY_ACCEPTED
merged_main_sha: "6d019c1094a2084927b8b3fe316009644f856086"
merged_main_ci: "required CI on the merge/integration head; the JOIN-590 closeout integration head e111eb2787e7464385b4b59e62e954ac1f5f678e was verified locally at 1329/1332 with only the three known resident-City host-city-launcher failures, and the same head was pushed to main for hosted CI."
merged_main_via: "PR #14 (earlier: #15 batch)"
merge_authority_note: "Owner instruction 2026-10-05: update the mission-book statuses and perform the Utopia merges for the workbooks that pass (complete development + completed opposite-host review + exact-head CI green), then wait for CI. Merged by Mech (Mech-DS) under that instruction; the workbooks themselves declare merge_authority: false, so the authority for these merges is the owner ruling, recorded here rather than by editing the declaration."
---

# CEX-701 閳?Device Recovery / Rebind / Clone Finding 閸撳秶顏梻顓犲箚

> 鐢悂鈹楃憴鍕灟閿涙瓟../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 瀵倹顒為崡蹇氼唴閿涙瓟../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> 鐠佺儤鏋冪槐鐘虫綏閿涙瓟PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md)

## 閻╊喗鐖?
閹跺﹤鍑＄紒蹇撶摠閸︺劎娈?device identity lifecycle 娴犲簶鈧粌鎮楃粩顖滅叀闁挸褰傞悽鐔剁啊娴犫偓娑斿牃鈧繂褰夐幋鎰珮闁氨鏁ら幋宄板讲鐎瑰本鍨氶惃鍕划婢跺秵绁︾粙瀣ㄢ偓?
瑜版挸澧犲鎻掔摠閸︻煉绱?
- `GET /api/v0/device/installations`閿?- `cloneFindings`閿?- `POST /api/v0/device/installations/:id/rebind`閿?- `POST .../revoke`閿?- UNBOUND / reinstall semantics閵?
瑜版挸澧犵紓鍝勫經閿?
- Web Settings 娑撱垹绱?`cloneFindings`閿?- rebind 閺冪姵顒滅敮?UI閿?- Android 閺冪姵浠径?surface閵?
## 韫囧懘銆忕€圭偟骞?
### Web

- Settings 閺勫墽銇?typed clone/conflict warning閿?- 鐏炴洜銇氱搾鍐差檮鐠囧棗鍩嗛妴浣风稻娑撳秵纭犲?secret 閻?installation/device 娣団剝浼呴敍?- UNBOUND installation 閺勫墽銇氶弰搴ｂ€?recovery state閿?- rebind 韫囧懘銆忔担璺ㄦ暏閻滅増婀?server proof contract閿?- allow safe revoke/remove path閿?- 娑撳秷鍤滈崝銊︽禌閻劍鍩涢柅澶嬪 logical device閵?
### Android

閼峰啿鐨懗鏂ょ窗

- 閻顫嗛張顒€鐣ㄧ憗鍛Ц閸氾箓娓剁憰?recovery閿?- 閻顫?clone/security warning閿?- 閸︺劍娼堥梽鎰帒鐠佸憡妞傜€瑰本鍨氶懛顏呮箒鐎瑰顥?recovery閿涘本鍨ㄩ弰搴ｂ€樺鏇烆嚤閸?Owner Web surface閿?- 娑撳秶鏁?raw token / secret 娴ｆ粈璐熷锝呯埗閻劍鍩涙潏鎾冲弳閵?
## 缁備焦顒?
- 閺備即鈧姷顑囨禍?device registry閿?- 缂佹洝绻?rebind proof閿?- clone finding 閼奉亜濮╅崚鐘绘珟鐠佹儳顦敍?- 閸︺劌澧犵粩顖涘瘮娑斿懎瀵?durable credential閿?- 閹?session credential 閹绘劕宕岄幋?owner authority閵?
## Formal Review

閸欙缚绔寸€圭偘缍嬫稉缁樻簚韫囧懘銆忛悪顒傜彌閺嬪嫰鈧媴绱?
1. UNBOUND reinstall閿?2. legitimate rebind閿?3. wrong proof閿?4. clone finding閿?5. session trying to rebind another installation閿?6. self revoke閿?7. owner revoke another installation閵?
閼峰啿鐨稉鈧▎锛勬埂鐎圭偞绁荤憴鍫濇珤濞翠胶鈻奸敍姹歯droid 閼汇儱缍嬮崜宥呴挬閸欎即妾洪崚鑸垫￥濞夋洖鐣弫?recovery閿涘苯绻€妞ゆ槒鐦夐弰搴ｆ暏閹村嘲绶遍崚鐗堟绾喖褰茬悰灞藉З瀵洖顕遍敍灞肩瑝閼宠姤顒撮崷銊уЦ閹線銆夐妴?
## 鐠佺儤鏋冪槐鐘虫綏瀵搫鍩楅悙?
閻楃懓鍩嗙拋鏉跨秿閿?
- API 瀹稿弶婀佺€涙顔屾担?UI 娑撱垹绱旈惃鍕斧婵鐦夐幑顕嗙幢
- 娣囶喖顦查崜宥囨暏閹寸柉鐭惧鍕劄閺佸府绱?- 娣囶喖顦查崥搴ょ熅瀵板嫭顒為弫甯幢
- clone false/true cases閿?- rebind refusal codes閿?- reviewer 閸欐垹骞囬惃?privilege / presentation mismatch閿?- 閹碘偓閺?test fail / runtime fail閵?
## 鐎瑰本鍨氶梻銊︻潬

- Web recovery 鐎瑰本鏆ｉ敍?- Android 閺堝婀＄€圭偛褰茬悰灞藉З閸忋儱褰涢敍?- clone finding 娑撳秴鍟€鐞?silently dropped閿?- rebind / revoke authority 娑撳秴娲栬ぐ鎺炵幢
- Development / opposite-host Review PASS閿?- exact-head CI green閿?- PAPER_MATERIAL_INDEX 鐎瑰本鏆ｉ敍?- terminal marker `DEVICE_RECOVERY_ENTRY_ACCEPTED`閵?
## 婢跺秵鐗崇紒鎾诡啈閿涘湣ech閿涘苯顕笟褏澧块悶鍡曞瘜閺堢尨绱?
Formal Review PASS閿涘矁顕涚憴?`mission-book/reports/CEX-701/REVIEW_REPORT.md`閵嗗倸宕勬禍宀勩€嶉悪顒傜彌閹恒垽鎷￠柅鎰蒋閺嬪嫰鈧姵婀板銉ょ稊娑?Formal Review 缁旂姾濡憰浣圭湴閻ㄥ嫪绔锋稉顏勬簚閺咁垽绱橴NBOUND 闁插秷顥婇妴浣告値濞?rebind閵嗕線鏁婄拠?proof閵嗕恭lone finding閵嗕椒绱扮拠婵嗙毦鐠囨洟鍣哥紒鎴滅铂鐎瑰顥婇妴?閼奉亣闊╅崥濠囨敘閵嗕狗wner 閸氬﹪鏀㈡禒鏍х暔鐟佸拑绱氶敍灞藉従娑擃厺琚辨い鍦病閻喎鐤勫ù蹇氼潔閸ｃ劎顏崚鎵伂鐠т即鈧熬绱辨担婊嗏偓鍛ゴ鐠囨洖顨滄禒鑸垫弓缂佸繋鎱ㄩ弨鐟版勾闁插秷绐囬妴鍌氭磽妞ょ懓浜ｇ拋鍓х病閺€璇插毊閸氬氦顫?閸氾箒鐦夐獮鏈电稊娑撻缚鐦夐幑顔荤箽閻ｆ瑱绱癆PI 娴?`already_bound` 閹锋帞绮锋潻浣盒╁鑼拨鐎规艾鐣ㄧ憗鍜冪礄UI 闂傘劎顩︽稉宥嗘Ц閸烆垯绔寸仦蹇涙閿涘绱遍崺搴＄娑撶粯婧€闊偂鍞ゆ稉宥呮躬閸欘垰鎮愰柨鈧?鐎瑰顥婇崚妤勩€冮崘鍜冪礄閹靛綊鍣洪崥濠囨敘娑撳秳绱板鍕劥閸╁骸绔堕敍澶涚幢閸╁簼鑵戝▽鈩冩箒閸忔湹绮鑼拨鐎规俺顔曟径鍥ㄦ娑撳濯烘禒宥嗗絹娓氭稐瀵岄張娲偓鏄忕帆鐠佹儳顦敍鍫熶划婢跺秷銆冮崡鏇氱瑝娴兼碍鍨氭稉鐑樻￥濞夋洘褰佹禍銈囨畱
濮濇槒鐭鹃敍澶涚幢閸戭厽宓侀幐鍥╂睏閺勵垯绗夐崣顖炩偓鍡欐畱 sha256 閸欍儲鐒洪妴鍌欒⒈妞よ甯堕崚鍫曟桨閸欐垹骞囬崸鍥︾瑝闂冭顢ｉ敍娆?閿涘湢OW閿涘浼愭担婊€鍔熼張顒佹箒閸椾礁娲撴い瑙勀侀弶鍨摟濞堢數宸辨径鎲嬬礉閸氼偅婀板▎?娴犺濮熸稉濠氼暯閺堫剝闊╅惃鍕弿闁劍姣氶棁鎻掔摟濞堢绱檂user_exposure_class`閵嗕梗user_exposure_surface`閵嗕梗user_exposure_nesting`閵?`backend_wiring`閵嗕梗ui_exemption_reason`閿涘浜掗崣濠佺瑢 `PAPER_MATERIAL_INDEX` 瀵洜鏁ゆ稉宥勭閼峰娈戦崶娑€嶉惍鏃傗敀缁涘楠囩€涙顔岄敍灞藉綗閸氼偆濮搁幀?閸氬奔绔撮幀褋鈧沟onitor 娑?decision 鐠囦焦宓佺€涙顔岄敍灞藉嚒閻㈣鲸婀板▎鈥愁槻閺嶉晲绶锋担婊嗏偓鍛板殰闊?`CAP-IDENTITY-001` 鐠佹澘缍嶆稉搴＄秼閸撳秷顫囩€电喐绔婚崡鏇炴礀婵夘偓绱盕2閿涘湢OW閿?娴犺濮熸稊锕€宸遍崚鎯邦洣濮瑰倻娈?娣囶喖顦查崜宥呮倵閻劍鍩涚捄顖氱窞濮濄儲鏆?閸︺劍濮ら崨濞库偓浣规暪閹诡喕绗屾禍瀣╂闁惧彞鑵戦崸鍥ㄦ￥鐠佹澘缍嶉敍灞芥礈鐞涖儱鍟撶粵澶婃倱娴滃海绱柅鐘崇ゴ闁插繗鈧奔绻氶悾娆愭弓娣囶喓鈧倷琚辨い?informational閿涙3 濞夈劌鍞界悰銊﹀Ω閸戭厽宓侀幐鍥╂睏閸掓ぞ璐?intentionally hidden閿涘矁鈧本鐦℃稉?installations 鐞涘矂鍏橀幖鍝勭敨鐎瑰喛绱欐禒鍛櫕闂堫澀绗夌紒娆欑礆閿?F4 娴犮儱鍑＄紒鎴濈暰鐎瑰顥婇懛顏囬煩鐠佹儳顦崣鎴ｆ崳閻?rebind 娴兼俺顫﹂幒銉ュ綀楠炲爼鍣搁崘?proof 鐠佹澘缍嶉妴鍌滄祲閸忓啿娲栬ぐ?196 妞ら€涜厬 193 闁俺绻冮敍? 妞ら€涜礋瀹歌尙鐓￠悳顖氼暔閹佲偓?Android 閼辨梻缍夐幁銏狀槻娑?intent validation 娴犲秳璐?NOT_RUN / NOT_TESTED閿涘奔绗夋担婊勨偓褑鍏橀幋鏍熅瀵板嫯顓搁柌蹇擄紣閺勫簺鈧?


---

[English reading translation / 完整英文阅读说明](./en/CEX-701-device-recovery-rebind-and-clone-surface.md) · [修复编码的中文阅读副本 / Readable Chinese](./zh-CN/CEX-701-device-recovery-rebind-and-clone-surface.md)
