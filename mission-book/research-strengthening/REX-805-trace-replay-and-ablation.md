---
workbook_id: REX-805
phase: RESEARCH_STRENGTHENING
sequence: 805
execution_enabled: true
status: "COMPLETE"
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-802","REX-803"]
dependency_source_shas: ["833279cae237080cca88b1b6dbc9f217027ba68f","8798ba9dd37051626033ad72080b2fad3ff66149"]
development_baseline_sha: "8798ba9dd37051626033ad72080b2fad3ff66149"
baseline_resolution_evidence: "CLAIM-TIME Alien2026-10-06: origin/main b06504f1f96984c960b2661b8ee3a7130796d379, REX802 accepted833279cae237080cca88b1b6dbc9f217027ba68f, required ancestor69a097b5394a9fece39dd11cc13f04c9b4d28bfe are all ancestors of REX803 accepted8798ba9dd37051626033ad72080b2fad3ff66149 (three git merge-base --is-ancestor exit0). Dependency union requires no new merge. Isolated worktree D:/Utopia-REX805-20261006 at exact8798ba9; frozen pnpm install PASS; baseline REX801 manifest5 +REX802 trace12 +REX803 runner12 =29/29 PASS before product edits. Earlier read used two nonexistent suite names and executed only runner12; not dependency smoke evidence."
baseline_blocker: null
dependencies: ["REX-802:RESEARCH_TRACE_FOUNDATION_ACCEPTED", "REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED"]
development_host: "Alien"
development_branch: "rex/REX-805-alien-replay-ablation"
development_head_sha: "0261a9ed1cec88df3ab4675623d422b37b33f270"
development_ci: "PASS exact head 0261a9ed1cec88df3ab4675623d422b37b33f270: push37446455570, PR37446461188, linkage37446461192 all COMPLETED SUCCESS; local1413/1410PASS/3ENV_FAIL; focused18/18PASS and independent code re-review PASS. Final0261a9e physical packet63/63 verified and live canonical tasks matched; predecessor packet retained, formal review pending."
development_complete: true
development_physical_gate_basis: "MET_EXACT_HEAD_0261a9e: repaired physical packet63/63 verified + official MEMBER canonical tasks matched; publisher-bound remote PID/source; independent formal review pending"
capability_registry_action: CREATE
capability_registry_refs: ["CAP-RESEARCH-REPLAY-001"]
capability_registry_sync_status: DEVELOPMENT_COMPLETE_OPPOSITE_REVIEW_PENDING
review_host: "Mech"
review_head_sha: "0261a9ed1cec88df3ab4675623d422b37b33f270"
review_ci: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-06): remote tip of rex/REX-805-alien-replay-ablation equals the recorded development head 0261a9ed1cec88df3ab4675623d422b37b33f270. Dependency ancestry all exit 0: REX-802 accepted 833279cae237080cca88b1b6dbc9f217027ba68f, REX-803 accepted 8798ba9dd37051626033ad72080b2fad3ff66149, required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe. Exact-head runs re-read one at a time from the Actions API: V0.2 checks push 37446455570, V0.2 checks pull_request 37446461188, City linkage pull_request 37446461192, all COMPLETED SUCCESS attempt 1. Review claim published before any verdict: reports/REX-805/REVIEW_CLAIM_Mech.md. No verdict yet; marker TRACE_REPLAY_ABLATION_ACCEPTED not released."
review_complete: true
review_verdict: "PASSED on 0261a9ed1cec88df3ab4675623d422b37b33f270 (Mech, opposite physical host; developer Alien). No defect found by this host's own 17 probes: 13 against the live resident City running the reviewed head and 4 in-process at that head. Independently reproduced the branch the author repaired in 0261a9e - a source whose persisted limits are the EMPTY set {} now replays with controlledInputsMatch=true and no controlled-input differences - and the replay carries fresh identities (new campaign, new experiment, new canonical task). Two replays of one source agree on all nine descriptive fields. alternate-device ablation lands on the first declared worker and reports placementChanged truthfully, including reporting FALSE when the source run already sat there. Six refusal paths are refused by name: ABLATION_UNSUPPORTED for a mechanism outside the exact policy and for a REPLAY carrying an ablation control, CAMPAIGN_UNKNOWN/REPLAY_SOURCE_INVALID for an unknown source and an out-of-range run index, and REPLAY_TOPOLOGY_NOT_READY when the recorded topology is not live - so unavailable conditions genuinely cannot be replayed. Store-guard family property holds: with a FILE where the receipt directory belongs the City still STARTED and served (storeState=UNAVAILABLE, reason=ENOTDIR) and the replay was refused with a typed code rather than crashing. ONE OBSERVATION, not a defect: against that unusable store the replay POST answers 404 CAMPAIGN_UNKNOWN because the source lookup fails before the engine's REPLAY_STORE_UNAVAILABLE; the same response chain discloses storeState=UNAVAILABLE and its reason, so a caller can tell them apart - a wording precision issue, conservative and distinguishable. REVIEWER'S OWN INSTRUMENT DEFECTS, recorded rather than hidden: the first live run passed 8/13 and all five failures were the probe's - a wait predicate that required `live` to be empty when the City keeps a completed campaign there, an over-specified error code, and an assumption that ablation must always change placement. Corrected and re-run: 13/13. Marker TRACE_REPLAY_ABLATION_ACCEPTED RELEASED on this head. Scope, stated not implied: the handset-RENDERED half is NOT_OBSERVED on this host (no adb device), so the author's physical capture remains its only evidence; no causal performance claim is made from durationDeltaMs, which the engine itself declines."
research_evidence_refs: ["mission-book/reports/REX-805/REVIEW_PROBES_LIVE_Mech.mjs", "mission-book/reports/REX-805/REVIEW_PROBES_INPROCESS_Mech.mjs", "mission-book/reports/REX-805/evidence/MATERIAL_INDEX.md", "mission-book/reports/REX-805/evidence-repaired/MATERIAL_INDEX.md"]
research_evidence_applicability: APPLICABLE
research_watchlist_hits: ["RS-G3-EXEC-WORK-ARTIFACT","RS-G3-IDENTITY-PROVENANCE","RS-G3-STRUCTURED-HANDOFF","RS-G3-DYNAMIC-LIVENESS","RS-G3-RULE-LIFECYCLE-DEBT","RS-G3-SUPERVISION-ATTENTION","RS-G3-SEMANTIC-INTEGRATION","RS-G3-USER-REACHABLE-TERMINAL","RS-G4-UNIFIED-CONTROL-PLANE"]
highest_research_grade_observed: G4_RARE_SYSTEMIC
research_capture_level: MAXIMUM_BOUNDED
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: RESEARCH_ADVANCED
user_exposure_nesting: L3_ADVANCED
backend_wiring: VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
development_report_ref: mission-book/reports/REX-805/DEVELOPMENT_HANDOFF.md
development_pr: "https://github.com/zhiheng-zhang-Mera/utopia/pull/38"
report_path: mission-book/reports/REX-805
terminal_marker: TRACE_REPLAY_ABLATION_ACCEPTED
---

# REX-805 鈥?Trace Replay + Ablation Engine

> 甯搁┗瑙勫垯锛歔../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 寮傛鍗忚锛歔../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> 鐮旂┒绱犳潗锛歔RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)

## 鐩爣

鍏佽閫夋嫨涓€涓凡璁板綍 run锛岄噸鏀惧叾杈撳叆/鍦烘櫙锛屽苟鍦ㄤ笉绡℃敼鍘熷 trace 鐨勫墠鎻愪笅閰嶇疆娑堣瀺锛?

- handoff off锛?
- retry off锛?
- backoff off锛?
- recovery off锛?
- alternate-device off锛?
- selected policy off銆?

## G3/G4 ablation candidates

闄ゅ凡鏈?handoff/retry/backoff/recovery 澶栵紝璁捐鏃跺繀椤诲厑璁告湭鏉?bounded ablation / replay 瑕嗙洊鑷冲皯杩欎簺鏈哄埗涓殑鍙瀛愰泦锛?

- MissionBook persistent work state on/off or reduced view锛?
- structured exact-state handoff vs summary-only锛?
- exact identity/provenance validation on/off锛?
- dynamic wake/re-scan classification vs naive stop/poll锛?
- independent review/evidence reconciliation on/off锛?
- Capability Registry-assisted localization vs repository-only exploration锛?
- implementation-only terminal vs user-reachable/intent-validated terminal锛?
- current rule set vs bounded older/reduced/superseded rule view锛堜粎鍦ㄥ彲瀹夊叏 replay 鏃讹級锛?
- naive Owner escalation vs rule/evidence-resolved or batched escalation policy锛?
- textual-merge-only acceptance vs semantic integration/reconciliation guard銆?

杩欎簺鏄?replay capability锛屼笉瑕佹眰 v1 涓€娆″疄鐜版墍鏈夊疄楠岋紱浣?schema 涓嶅緱鎶婂畠浠皝姝汇€?

鍏朵腑 rule lifecycle / governance policy 鐨?replay 鍙厑璁镐娇鐢ㄥ凡鐗堟湰鍖栬鍒欏揩鐓э紝涓嶅厑璁镐负浜嗗疄楠屼慨鏀瑰綋鍓嶇敓浜ц鍒欙紱semantic integration replay 蹇呴』缁戝畾 source accepted SHAs 涓?integration SHA銆?

## 纭鍒?

- replay 鈮?original run锛?
- replay 蹇呴』鏂?experiment/run id锛?
- 涓嶄繚璇佸閮?provider 瀹屽叏纭畾鎬ф椂蹇呴』澹版槑锛?
- 涓嶈兘鎶?unavailable real-world condition 浼鎴?deterministic replay锛?
- ablation 蹇呴』璁板綍 exact disabled mechanism銆?

## 鐢ㄦ埛鍏ュ彛

Research 椤甸潰鐩存帴鎻愪緵 Replay / Ablation锛屼笉鏀炬櫘閫氫富瀵艰埅銆?

## Review

鍚屼竴 trace 鐙珛閲嶆斁锛涙鏌ョ粨鏋滃樊寮傛槸鍚︽潵鑷湡瀹?policy 鍙樺寲鑰屼笉鏄?harness drift銆?

## 瀹屾垚闂ㄦ

鑷冲皯涓€涓?multi-device scenario 鑳藉畬鎴?original 鈫?replay 鈫?ablation 鐨勫彲杩芥函姣旇緝銆?

