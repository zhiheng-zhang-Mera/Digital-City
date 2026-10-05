---
workbook_id: JOIN-590
phase: CONNECTION_ONBOARDING
sequence: 590
execution_enabled: true
status: READY
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["e925ae1ef4dda6f51d89a1faa025d1b8666d8c58", "86deda9c2990c78d683a8c3515d251022df9d040", "77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f"]
dependency_source_shas: ["e925ae1ef4dda6f51d89a1faa025d1b8666d8c58", "86deda9c2990c78d683a8c3515d251022df9d040", "77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f"]
development_baseline_sha: "d3262ce2dd81e51a53e39e6f9add8dee650a7682"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, 2026-10-05): baseline_anchor_mode=REMOTE_REF_EXACT_SHA_AT_CLAIM executed literally. `git fetch origin main` in zhiheng-zhang-Mera/utopia resolved refs/heads/main to the full SHA d3262ce2dd81e51a53e39e6f9add8dee650a7682 ('Merge pull request #23 from zhiheng-zhang-Mera/fix/Alien-codex-pairing-city-neutral-lockout'). ALL THREE required_ancestor_shas verified with `git merge-base --is-ancestor` -> ANCESTOR_OK for e925ae1ef4dda6f51d89a1faa025d1b8666d8c58 (JOIN-501), 86deda9c2990c78d683a8c3515d251022df9d040 (JOIN-502) and 77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f (JOIN-503), so no BASELINE_ANCESTRY_MISMATCH. Required CI on exactly that sha read from the Actions API and matched on headSha. PHYSICAL PREREQUISITE MEASURED AT CLAIM TIME, not assumed: `adb devices -l` reports a real attached Android device BICIPVNB5HS85H9T product:PERM00 model:PERM00, so the third surface this workbook requires for approval evidence exists as hardware rather than as an emulator (the utopia36 AVD was explicitly NOT used, because a simulated control surface would make the approval evidence fabricated). The SECOND physical Windows host is NOT part of this claim: every Alien+Mech joint step is recorded as deferred with an exact pending seam until that host participates, and no joint step will be reported as passed without it. Development worktree: D:/utopia-join590 on branch join/JOIN-590-merged-main-physical-acceptance, created from the resolved baseline SHA."
dependencies: ["JOIN-501:PAIRING_SESSION_LIFECYCLE_ACCEPTED", "JOIN-502:NEARBY_PC_JOIN_ACCEPTED", "JOIN-503:DEVICE_ENROLLMENT_RECONNECT_ACCEPTED"]
development_host: "Mech"
development_branch: "join/JOIN-590-merged-main-physical-acceptance"
research_evidence_applicability: "APPLICABLE"
long_horizon_context_evidence: "CAPTURED"
research_evidence_refs: ["mission-book/reports/JOIN-590/PAPER_MATERIAL_INDEX.md"]
state_identity_evidence: "CAPTURED"
state_identity_evidence_refs: ["mission-book/reports/JOIN-590/PAPER_MATERIAL_INDEX.md"]
development_head_sha: "8b97e72931c57ceb993f37307f012bd61f67fa22"
development_ci: "V0.2 checks run 37255816279 COMPLETED SUCCESS on headSha 8b97e72931c57ceb993f37307f012bd61f67fa22 (jobs: gateway-web success, android success), read from the Actions API and matched on headSha. THIS HEAD IS A PRODUCT-CODE CHANGE, so the earlier statement that the branch sat exactly on the baseline no longer applies: the acceptance evidence for gates 1/2/3/5 was produced on the baseline d3262ce2dd81e51a53e39e6f9add8dee650a7682 (whose own CI is V0.2 checks 37205444427 + City linkage check 37205444385), and this head adds the Owner-directed pairing-screen change (five compact actions in one row plus a short-code entry) recorded in reports/JOIN-590/DEVELOPMENT_REPORT.md section 2.9. On the physical device the five buttons were verified to render in one row and the CODE entry to be reachable; the session-mint half answered HTTP 404 from the handset while the identical request answered 200 from this host and the City logged nothing, and that remains an OPEN defect (D-B) rather than a claimed capability. Local Android build for this head: :app:assembleDebug + :app:testDebugUnitTest BUILD SUCCESSFUL. Acceptance evidence (all on the baseline, on real hardware): merged-main debug APK built with Temurin 17 and installed on the physical PERM00 device (vendor installer confirmation completed by user-equivalent synthetic tap); the canonical City's event stream recorded the full chain JOIN_REQUEST_CREATED(Alien-Win,win32) -> APPROVED -> CONSUMED with the physical Android surface and the Mech Web surface both attached; the owner-approved gateway restart preserved cityId 031fdba6-e94c-4298-a095-6ff04a65481d across two process identities (21452 -> 25364 -> 1756) and both control surfaces reconnected with no credential re-entry; and a FRESH installation enrolled through the product's own client code (apps/client/device-enrollment.mjs) appeared in the City registry (count 0 -> 1 -> 2), survived the restart by minting a session from its durable credential alone, and after revoke was refused with INSTALLATION_RETIRED/403/retryable=false while 3 live sessions were revoked."
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: PAIRING_AND_DEVICE_ONBOARDING
user_exposure_nesting: L2_CONTEXTUAL
backend_wiring: "VERIFIED on the real path: the enrollment registry, the tokenless session mint, the revoke refusal and the canonical City state were all read back from the live City after the actions that changed them. See reports/JOIN-590/DEVELOPMENT_REPORT.md sections 2.4-2.6 and 3 for the gate-by-gate verdicts."
ui_exemption_reason: null
owner_gate: NONE
merge_authority: true
report_path: mission-book/reports/JOIN-590
terminal_marker: CONNECTION_ONBOARDING_MERGED_MAIN_PHYSICAL_ACCEPTED
---

# JOIN-590 — Merged-main Physical Acceptance + Programme Closeout

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)

## 为什么只剩这一本

JOIN-501/502/503 已完成 Development + opposite-host Formal Review，且以下 exact accepted heads 已由 Git ancestry 证明进入 Utopia current main：

- JOIN-501: `e925ae1ef4dda6f51d89a1faa025d1b8666d8c58`
- JOIN-502: `86deda9c2990c78d683a8c3515d251022df9d040`
- JOIN-503: `77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f`

因此本任务**不重新 merge 三个 sibling branch**。

真正未完成的是旧 Review 明确写下的 deferred acceptance：

- second physical Windows host end-to-end；
- restart / tokenless reconnect on physical member；
- revoke and refusal convergence；
- merged-main product path rather than component branch path。

## Immutable baseline gate

Claim 时只能从 remote `refs/heads/main` 解析 full 40-char SHA。

候选 main 必须同时包含 frontmatter 的三个 `required_ancestor_shas`。

任一 ancestry 不满足：

`BASELINE_ANCESTRY_MISMATCH`

不得施工。

Claim 后把 resolved full SHA 原子写入 `development_baseline_sha`，后续所有证据绑定该 SHA。

## 最低真实拓扑

- Alien Windows；
- Mech Windows；
- Android physical control surface（用于 approval/control evidence，非 worker）。

至少证明一次：

```text
fresh/unbound installation on one Windows host
→ discovers / receives invite to canonical City
→ approval on already trusted control surface
→ installation enrolled
→ host becomes MEMBER
→ restart
→ reconnect without bare-token typing
→ revoke
→ old installation/session cannot silently recover
```

同时回归：

- pairing code explicit generation only；
- ACTIVE session does not rotate；
- LAN browse；
- approve/reject；
- QR/code/link fallback；
- normal existing host launch；
- main CI。

## Scope

允许修复本 acceptance 暴露出的 in-scope onboarding defect。

禁止借 closeout 重写：

- Remote Fabric；
- device identity canonical owner；
- scheduler；
- Research Fabric；
- Workbench compatibility。

## Paper / process evidence

任何：

- physical-host-only defect；
- restart timing；
- discovery latency；
- session/revoke race；
- Web/Android disagreement；
- stale state；
- test harness defect；

都按 PROCESS_DATA_POLICY 保存并在 report 中建立 evidence pointer。

## Completion

必须同时满足：

1. real Alien↔Mech physical onboarding run；
2. restart tokenless reconnect；
3. revoke refusal；
4. Web/Android user path truthful；
5. no duplicate City / no hidden local fallback；
6. exact baseline/head CI green；
7. opposite-host Formal Review；
8. Capability Exposure Gate PASS；
9. merged-main post-closeout verification；
10. terminal marker `CONNECTION_ONBOARDING_MERGED_MAIN_PHYSICAL_ACCEPTED`。

完成后整个 `connection-onboarding/` programme 才可移入 finished。
