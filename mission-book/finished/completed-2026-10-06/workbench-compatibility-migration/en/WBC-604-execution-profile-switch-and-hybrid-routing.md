> Reading translation / 阅读译本. Canonical workbook remains authoritative; no active frontmatter or new task authority is created.

[Canonical workbook](../WBC-604-execution-profile-switch-and-hybrid-routing.md)

Original metadata, quoted only:

```yaml
workbook_id: WBC-604
phase: WORKBENCH_COMPATIBILITY_MIGRATION
sequence: 604
execution_enabled: true
status: "COMPLETE"
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["9f3e20e8ec99d591812430bee71d27e68c4ad498"]
dependency_source_workbooks: ["WBC-603"]
dependency_source_shas: ["f3510862cc348a99004ca5bd5d151a7b56279724"]
development_baseline_sha: "1a26d7499d3de39b19c3136c3032e8ccd9343428"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-05): baseline_anchor_mode=DEPENDENCY_SHA_UNION_AT_CLAIM executed literally. The declared dependency_source_shas entry f3510862cc348a99004ca5bd5d151a7b56279724 (WBC-603 accepted head) and the required ancestor 9f3e20e8ec99d591812430bee71d27e68c4ad498 were BOTH verified with git merge-base --is-ancestor against refs/heads/main, both ANCESTOR_OK, so the union is the eligible base itself and needs no constructed merge - the same shape as the MON-902 claim, and the opposite of the CEX-790 union that had to merge five parallel heads. Resolved baseline (40-char): 1a26d7499d3de39b19c3136c3032e8ccd9343428. Dependency smoke run BEFORE any WBC-604 product change: node --test on the WBC-601/602/603 suites -> 32 tests, 32 pass, 0 fail at that exact commit. Development worktree D:/utopia-wbc604 on branch wbc/WBC-604-mech-execution-profile-switch, created from the resolved baseline."
baseline_blocker: null
dependencies: ["WBC-603:WORKER_POOL_AGENT_SEAM_ACCEPTED"]
development_host: "Mech"
development_branch: "wbc/WBC-604-mech-execution-profile-switch"
development_head_sha: "213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef"
development_ci: "V0.2 checks COMPLETED SUCCESS on 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef (three runs on that head: push and pull_request, all success), read from the Actions API and matched on headSha. LOCAL VERIFICATION on the same head: WBC-604 unit + route + fail-safe suites plus wbc601/wbc602/wbc603 -> 28 tests / 28 pass."
development_complete: true
review_host: null
review_head_sha: null
review_ci: null
review_complete: true
review_waiver_authority: "OWNER INSTRUCTION (2026-10-05, recorded in this task's closeout and in mission-book/reports/WBC-604/): make the entire WBC sub-series mergeable by any means and accept the final result. That instruction waived the opposite-host Formal Review for WBC-604. NO reviewer evidence exists for this closure, and the reviewer checklist in this workbook remains UNEXECUTED; the waiver is an authority record, not a review."
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/WBC-604
terminal_marker: EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED
merged_main_sha: "213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef"
merged_main_via: "fast-forward push of the development branch onto main under the owner ruling that the whole WBC sub-series must be made mergeable; WBC-601 (d773c1e1), WBC-602 (52e66f37) and WBC-603 (3cd45f66) were already in main, so this completes the series."
merged_main_ci: "V0.2 checks COMPLETED SUCCESS on 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef (push and pull_request runs), read from the Actions API and matched on headSha."
```

Standing rules: [construction](../../../../CONSTRUCTION_RULES.md), [asynchronous relief](../../../../ASYNC_RELIEF_CONSTRUCTION.md), [programme](../README.md).

# WBC-604 — Execution Profile Switch + Compatible HYBRID Routing

## Goal

Reduce future Workbench activation to a stable reversible Execution Profile switch, rather than redeploying/migrating Utopia business layers.

Permanent profiles:

```text
STANDARD_DEVICES   ← current default
WORKER_POOL        ← future explicit switch
HYBRID             ← future capability-driven mixed mode
```

## Profile semantics

### STANDARD_DEVICES

- Equivalent to the accepted Windows baseline preceding this programme.
- Legacy tasks use it by default.
- Current default, retained permanently as a rollback profile.

### WORKER_POOL

- Activate only with at least one compatible, trusted, HEALTHY/READY backend/node.
- Check readiness before activation.
- Return typed rejection/attention when unavailable.
- Worker Pool unavailability must not crash Utopia.
- Do not silently reinterpret strict targets to non-pool Windows nodes.

### HYBRID

An explicit contract determines candidate selection order, respecting at least:

1. Explicit strict target outranks generic routing.
2. Hard platform/capability requirements outrank performance preference.
3. Trust/readiness gates outrank load preference.
4. Legacy unspecified tasks retain compatible defaults, without sudden reassignment due to new resource models.
5. With Workbench unavailable, only explicitly policy-permitted tasks may fall back to STANDARD_DEVICES.
6. Platform-validation workloads still go to matching real validation nodes.
7. Speed cannot justify crossing user/permission/trust gates.

## Direct switching requirements

After future Workbench setup, Owner should not need another code commit to enable it.

Provide at least one stable control surface, at the smallest appropriate existing settings/config/API location:

```text
get current execution profile
list available profiles + readiness
request profile change
return activation receipt / rejection reason
persist selected profile safely
rollback to STANDARD_DEVICES
```

If the UI has no appropriate settings surface, this task does not require UI refactoring. A stable API/config surface satisfies the underlying cutover contract; future UI only presents it.

## Fail-safe / rollback

Prove:

- Failed WORKER_POOL activation readiness preserves the original profile.
- Corrupt persistence / unknown profile values yield conservative STANDARD_DEVICES or typed safe recovery.
- Losing a running pool does not falsify canonical task truth.
- Existing lease/recovery rules govern in-flight ownership.
- Owner can switch back to STANDARD_DEVICES.
- Switching back needs no database downgrade.
- Workbench node records may remain, but accept no new work.

## Formal Review

Another physical host independently attacks at least:

- Profile-switch races.
- Unavailable pools.
- Stale readiness.
- Strict target versus hybrid preference.
- Legacy tasks without requirements.
- In-flight tasks during profile changes.
- Profile persistence after restart.
- Rollback to STANDARD_DEVICES.
- Android/Web control-surface non-regression.

## Completion gate

1. All three profile contracts exist.
2. STANDARD_DEVICES remains default.
3. Future WORKER_POOL can activate after readiness without a code commit.
4. HYBRID routing precedence is explicit and tested.
5. Switching/rollback is reversible.
6. No-Workbench environments remain fully usable.
7. Opposite-host Review PASS.
8. Exact-head CI green.
9. Terminal marker `EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED`.

## Reports

- `mission-book/reports/WBC-604/DEVELOPMENT_REPORT.md`
- `mission-book/reports/WBC-604/REVIEW_REPORT.md`

Do not create merge authority after completion. Return to the programme README Merge lock; create a final integration workbook only after WBC-601..604 all complete on both hosts. This reading does not activate that historical provision.
