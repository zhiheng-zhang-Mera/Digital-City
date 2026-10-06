# Historical Mission Index v1 — full English reading

[Canonical historical snapshot](../MISSION_INDEX-v1.md). This is inactive historical material, not a new claim instruction.

# Mission Index

> Ordering expresses only the then-current migration queue default. **Each Mission file’s own Claim/Complete fields are runtime truth.**

| Seq | Mission | Enabled | Migration | Verification | Primary source | City target |
|---:|---|:---:|:---:|:---:|---|---|
| 1 | [MB-001](../../../replant/MB-001-core-os.md) | YES | COMPLETE | **COMPLETE** | zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 00/01 City Core — Runtime Trust & Orchestration Kernel |
| 2 | [MB-002](../../../replant/MB-002-capability-fabric.md) | YES | COMPLETE | COMPLETE | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 + DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973 | 00/03 City Service Network — Capability Registry & Discovery |
| 3 | [MB-003](../../../replant/MB-003-worker-gateway.md) | YES | COMPLETE | **BLOCKED_OWNER_DECISION** | DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973 | 02/02 Worker Gateway — Engineering Provider Adapter Layer |
| 4 | [MB-004](../../../replant/MB-004-project-foreman.md) | YES | COMPLETE | COMPLETE | DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973 + Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 02/01 Project Foreman — Engineering Task Orchestrator |
| 5 | [MB-005](../../../replant/MB-005-host-health.md) | YES | COMPLETE | COMPLETE | zhiheng-zhang-Mera/dsh-health-scheduler @ 985e2b7389330db4b32ea2946e3657746c64b47b | 02/03 Host Health Station — Runtime Health Scheduling Service |
| 6 | [MB-006](../../../replant/MB-006-restart-recovery.md) | YES | COMPLETE | **COMPLETE** | zhiheng-zhang-Mera/dsh-restart @ e20fb6cc43e27cedf6303471e5b8ee18e1383ecd | 02/04 Restart Recovery Station — Safe Restart External Supervision |
| 7 | [MB-007](../../../replant/MB-007-research-institute.md) | YES | **BLOCKED_OWNER_DECISION** | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 06/01 Research Institute — Research Mechanism Experimentation Platform |
| 8 | [MB-008](../../../replant/MB-008-computer-use.md) | YES | **BLOCKED_OWNER_DECISION** | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 10/01 Computer Use Runtime — Generic Computer Interaction Execution Service |
| 9 | [MB-009](../../../replant/MB-009-theme-relocation.md) | YES | COMPLETE | COMPLETE | Utopia main then-current city/11-entertainment/01-entertainment-centre/theme-engine | 00/05 City Control Centre — Presentation & Theming |
| 10 | [MB-010](../../../replant/MB-010-node-fabric.md) | NO | NOT_STARTED | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 00/02 City Node Network — Device Node Fabric |
| 11 | [MB-011](../../../replant/MB-011-customs.md) | NO | NOT_STARTED | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 01/01 Customs Security — Extension Admission Checks |
| 12 | [MB-012](../../../replant/MB-012-runtime-compliance.md) | NO | NOT_STARTED | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 01/02 Public Security — Runtime Compliance Enforcement |

> **Dependency history for MB-004 (resolved, recorded so it is not re-litigated).** MB-004
> declares `Dependency Mission: MB-003`. MB-003 was `migration_complete` while its Verification stage
> was still open and its branch was **not merged** into `zhiheng-zhang-Mera/utopia` main.
> Because rule 7 cuts every migration branch from the target repo's latest `main`, host `Alien`
> read the dependency as unsatisfied at 2026-09-29T13:02:19Z and claimed MB-006 instead, using
> the conservative definition (satisfied once the dependency's artifacts are in `main`). Host
> `Mech` subsequently claimed MB-004 under the looser reading (satisfied by
> `migration_complete` alone). **The mission-book does not define which reading is correct**;
> both are recorded here rather than one being presented as the rule. MB-004 is claimed, so the
> question is now moot for claiming, but it will matter again at MB-004's Verification, where
> the verifier must decide whether a Foreman built on a `main` that lacks MB-003 can be
> accepted, and at merge time, where MB-003 and MB-004 both touch `city/02-engineering/`.

> **MB-004 Verification: how that question was answered (host `Alien`, 2026-09-29).** (a) *At
> merge time* it was a non-issue: MB-004's branch never touched MB-003's paths, the merged
> `main` gained MB-003's absent modules from neither side, and the only shared files were the
> manifest, the census and the two capability fixtures, which were unions. (b) *At verification
> time* the MB-004 gate clause *"run a real Engineering job through MB-003 Worker Gateway"* could
> **not** be exercised, because MB-003's gateway modules exist only on its unmerged branch and
> MB-004's port has **zero** coupling to them (its only imports are `node:` built-ins and
> relative `.mjs` files). The verifier's judgement: treat the clause's **substance** — a real
> Engineering job from inspect/plan to result/evidence, no unit-test substitution — as met by a
> real run (four-phase pilot, killed-process resume continuing in 4 steps instead of 6), and
> record the **routing** clause as NOT EXERCISED rather than fabricate glue neither donor has,
> which `MODE=MIGRATION_ONLY` forbids. Full problem/choice/logic in
> [`reports/MB-004/VERIFICATION_REPORT.md`](../../reports/MB-004/VERIFICATION_REPORT.md) §6.1.
> MB-003's own Verification is now `BLOCKED_OWNER_DECISION`, so the option "wait for MB-003 to
> land, then re-check" is gated behind that ruling.

> **⚠ CROSS-MISSION OBSERVATION — a domain-district module changes the accepted capability
> surface.** Merging MB-004 grew the capability list that Web and Android read from **5 to 6**:
> `city.02-engineering/01-project-foreman/project-foreman` now appears as a `BRIDGE_PENDING`
> entry that can never be invoked. Both clients behave honestly (Run disabled on each), so this
> is not a rule-14 violation, but it contradicts the rationale MB-001 wrote into
> `services/capability-bridge/registry.mjs` for `DISTRICT_KINDS`: a module that by design has no
> product operation should not be advertised as a capability. MB-002 was spared only because its
> module sits in the `infrastructure` district `00-foundation`; MB-004's sits in the `domain`
> district `02-engineering`, which that filter does not cover. The verifier did **not** patch it,
> because doing so means changing the registry's target semantics or adding a manifest field,
> both outside MB-004's boundary (rules 10/11). **Owner decision requested:** whether to adopt one
> City-level mechanism (e.g. a module-level `capabilityProvider: false`, already used by the
> unmerged MB-003/006/007/008 branches) so that non-product modules stop appearing in the
> capability list, rather than each Mission patching this individually. Detail in
> [`reports/MB-004/VERIFICATION_REPORT.md`](../../reports/MB-004/VERIFICATION_REPORT.md) §6.2.

> **MB-005 verification: the "two hosts" clause, and a weakened test that was repaired.** (a) The
> MB-005 gate reads *"both hosts use real telemetry for normal, unknown/missing and sustained-pressure/debounce scenarios"*.
> Rule 5 permits exactly one verification host and forbids a third, and the verifying session had
> one machine, so **both readings are recorded rather than one asserted** — Reading 1 (per
> participating host role) is satisfied by the migration host's recorded runtime evidence plus the
> verification host's real run; Reading 2 (two physical machines) is not satisfiable here. This is
> the same treatment host `Mech` recorded for MB-006 §5.2. No second machine was fabricated.
> (b) The verification also found that migration commit `5fbbec6` had **weakened a pre-existing
> repo test**: the duplicate-module-name fixture in `tests/capability-registry.test.mjs` was moved
> to `m.districts.at(-1)` = `11-entertainment`, which has **one** building, so the uniqueness
> assertion collapsed to a one-element check that could never fail. Repaired on the branch
> (`977cd0c`) by pointing the fixture at `09-planning-knowledge` (two buildings) and asserting the
> expected count. Detail in
> [`reports/MB-005/VERIFICATION_REPORT.md`](../../reports/MB-005/VERIFICATION_REPORT.md) §3.3 and §6.1.
> The report also asks the Owner to rule on the donor `bandKeyOf` bug (its §7.2), which the
> migration correctly ported rather than fixed.

> **⚠ OWNER DECISION REQUESTED — MB-009's merge resolved a conflict between two verified
> Missions by refining a shared marker.** `MB-001` marks the district `00-foundation`
> `kind: "infrastructure"`, and `services/capability-bridge/registry.mjs` used that marker to
> exclude the district's modules from capability *resolution*. `MB-009`'s City-map-mandated
> target is `00-foundation/05-control-centre/theme-engine`, so on the merged tree
> `presentation.theme.lab` resolved `DEGRADED` and the accepted five bridged services became
> four. The verifier rejected three alternatives (changing the district's kind, moving the
> module off its mandated owner, or weakening MB-001's test) and instead made the marker
> refinable **per building**: `05-control-centre` declares `kind: "domain"`,
> `city/manifest.mjs` validates it and exposes the single decision point `buildingKind()`, and
> the registry now builds its resolution index from **every** declared module while keeping
> both enumeration exclusions. Behaviour for every pre-existing input is unchanged, the kernel
> assertions were strengthened rather than reduced, no ownership moved and no capability was
> added — but the change touches a shared file and a test introduced by MB-001, so it is
> reported here for the Owner. Options in
> [`reports/MB-009/VERIFICATION_REPORT.md`](../../reports/MB-009/VERIFICATION_REPORT.md) §5.4:
> (a) accept building-level `kind` as a City mechanism, or (b) re-draw the district/building
> ownership by Owner decision via a superseding Mission.
>
> **Correction to the MB-005 report:** its pilot's "restart the shared gateway" step never ran
> — it called `spawnSync('pwsh', …)` and `pwsh` is not on this machine's PATH, so the call failed
> with `ENOENT` and the round-trip used the already-running gateway. The MB-005 telemetry evidence
> remains valid (that mission did not touch the gateway source), and the report has been corrected
> in place. MB-009's pilot uses `powershell.exe` and additionally showed that a stale gateway
> process keeps serving its in-memory registry until it is genuinely restarted.

> **⚠ OWNER RULING REQUESTED — the product-consumption gate now blocks two missions, and
> MB-009 will be the third.** The Migration gate *"complete at least one real product consumption, reusing only currently existing Utopia UI/client consumer surfaces"* was satisfiable for MB-001, MB-003 and MB-006 only because an exact
> **mechanism** rewiring happened to exist inside an existing product path. MB-007 and MB-008 are
> infrastructure/pipeline migrations whose honest consumer would be a **new** product surface,
> and rule 14 forbids creating one for acceptance. MB-008's survey established this by
> **executing** the donors against the live Utopia expressions, returning
> `NO_VERDICT_IDENTICAL_SEAM` with a measured counterexample for every candidate seam — so this
> is a measured structural finding, not a difficulty report. Both missions are fully ported,
> parity-tested, registered behind `capabilityProvider: false` and green on required CI; **any
> ruling can be applied to finished work.** Three options, stated in full in each report's final
> section: (1) accept the boundary and amend the gate wording; (2) authorise one named
> consumption per mission; (3) create explicit superseding Missions per rule 13. Rule 13 also
> means **neither MB-007 nor MB-008 may be taken over by a third host** before that ruling.

## Selection rule

```text
1. enabled + unclaimed + MIGRATION incomplete + dependencies satisfied
   → sequence ASC
2. if none:
   enabled + migration complete + unclaimed VERIFICATION + different host
   → sequence ASC
3. claimed-but-incomplete / disabled / blocked
   → skip
```

Do not treat this static table as claim truth; read the individual Mission and latest Digital-City main before claiming.

## Known defects outside this index — not any Mission acceptance gate

Recorded here so they do not exist only in a host's Git-ignored evidence. Mission reports recommend separate changes; none was repaired without authority inside these Missions.

1. `city/manifest.mjs` cannot see undeclared module directories. checkManifestAgainstTree walks declared modules rather than reverse-scanning the filesystem; a coded module without manifest/census/DONOR.json can leave every check green. MB-004/005 independently found this; Mech confirmed by mutation on main ce33792, including invisible empty directories. Repair changes manifest/census contracts outside completed Mission scope.
2. tests/capability-adapters.test.mjs:31 still asserts global catalog.length===6 although MB-001 D8 said it narrowed to the tested module. Description and code differ. The preceding anchor finds moduleId, so not a current defect, but another adapter addition would cause a false failure.
3. DONOR.json shapes differ: MB-001 flat repository/commit/sourcePaths, MB-002/004/005/006 donors[]. Both are internally coherent; a reader for only one cannot read the other.
4. Rule 5 makes some Missions permanently unclaimable to particular hosts, but this index does not show that. Mech migrated MB-005/009 and cannot verify them, although NOT_STARTED seemed available to anyone. Alien ultimately closed both (City 1ac40d4,0764924,d6969d9). As long as rule 5 and migration-first ordering coexist, the index should show which host cannot claim, rather than each executor deriving eligibility again. A usability gap, not a code defect.
5. MB-003's local verification gate cannot be satisfied: use an installed real provider already supported by the donor for detect→submit→progress→result/unsupported, no mock pass. Migrated provider-adapter only wraps injected hooks; DONOR.json defers real HTTP/web sessions. Mech offers three Owner options in MB-003 VERIFICATION_REPORT §6; until decided, MB-003 and dependent MB-004 cannot become VERIFICATION_COMPLETE. This is the historical snapshot, superseded by later Owner rulings and completion.
