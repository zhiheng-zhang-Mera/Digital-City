# REX-802 development evidence / 开发素材

Developer Alien-codex on physical host MERA-ALIANWARE. Baseline 0e9bea3ce739b979e582a428af8fb233045a5e75; exact implementation 833279cae237080cca88b1b6dbc9f217027ba68f; cloud CI37211053490 currently IN_PROGRESS, not accepted. CAP-RESEARCH-TRACE-001.

## Decisions and observations

- Thin read-only user path first: Web Advanced and Android More expose current recording/types/failure/measurement availability/provenance/completeness. Existing owner authority retained; a recording run is not an experiment execution.
- Optional reference collector avoids second canonical task/action database. Typed normalization excludes arbitrary payload/credentials/fingerprints. External software refs are declared identities requiring verification, not automatically proved runtime SHAs.
- Bounded async storage/queue and bounded close preserve product execution. Unknown metrics stay null/reason; source clocks, capture wall time and monotonic epoch are distinct. Resource-only observations cannot alter canonical sequence timestamp ordering.
- Governance schema supports workbook-predefined rule lifecycle, supervision quality, semantic integration, eligibility/wake/rescan, capability state, continuation and source identity dimensions. Support does not claim those external events were actually observed.

| Stage | Observed result | Evidence | Classification |
|---|---|---|---|
| Schema baseline | Missing module/entry failures; early restore inverted ordering; governance dimensions initially rejected | Utopia schema-red / early-capture-red / governance-red logs | Reproduced; repaired |
| Fault containment | Broken observation clock escaped error handler; oversized existing file rotated before rejection | containment-red/green logs | Reproduced; repaired |
| Gateway baseline | research route404 before integration; resource samples absent before tap | gateway-red/resource-red and green logs | Reproduced; repaired |
| Technical critique | P1 pre-commit event survived rollback; P2 restart concealed retention; P2 Web dropped403status; P2 delayed response erased offline warning | review-red/review-all-red/review-green logs | Reproduced; repaired; local critique not physical Formal Review |
| Clock isolation | Future external resource timestamp caused canonical timestamp regression annotation | clock-isolation-red/green | Reproduced; repaired;18 focused pass |
| Product regressions | Gateway/actions/strict-target/telemetry/member browser/i18n | regression.log | 53/53 pass before final clock-only correction;18 focused after correction |
| Native parser/build | Missing parser red, nullableBoolean test assertions initially failed compilation; corrected without coercing unknownfalse | android-red/android-green/android-green2 | 83 unit tests PASS; APK build PASS |
| OPPO physical entry | More entry found, Research trace opened, refresh disabled and honest OFFLINE/NOT_OBSERVABLE message | oppo-menu.xml/oppo-panel.xml; development-receipt | Offline reachability observed; native online NOT_RUN; CEX701 APK restored |

Tracked bounded receipt: utopia:evidence/raw/mission-book/REX-802/development-receipt.json; event chain: utopia:data-records/evolution/inbox/mission-book/REX-802/events.jsonl. Raw local log hashes retained in receipt; full logs are ignored runtime artifacts, not claimed cloud artifacts.

## Research and context boundary

research_evidence_applicability: APPLICABLE; long_horizon_context_evidence: CAPTURED. Session01a105ab-95d3-71c1-9869-db6801ee8049 continued from durable claim/plan/exact baseline and source status. Automatic compaction occurred; exact tokens/context window/trigger/duration and retrospective global repeat-work totals NOT_OBSERVABLE. Source/control were revalidated after continuation. A helper const reassignment error in the prior phase left two guards unapplied; explicit red tests reproduced and verified their subsequent repair.

Watchlist inherits current workbook: RS-G3-IDENTITY-PROVENANCE, RS-G3-DYNAMIC-LIVENESS, RS-G3-OWNER-INTERVENTION-TAXONOMY, RS-G3-RULE-LIFECYCLE-DEBT, RS-G3-SUPERVISION-ATTENTION, RS-G3-SEMANTIC-INTEGRATION, RS-G4-AUTONOMY-SURVIVAL, RS-G4-REALITY-DRIFT, RS-G3-PASSIVE-EVIDENCE-PIPELINE. Highest G4_RARE_SYSTEMIC and MAXIMUM_BOUNDED are predefined evidence priorities; no novelty, performance or autonomous survival claim. Generic red/green bugs and helper mistakes remain ordinary engineering evidence.

Formal acceptance, native online rendering, actual experiment/provider/model bindings and longitudinal autonomy/supervision measurements remain pending or NOT_OBSERVABLE. No terminal marker emitted.

Exact-source outcome supersedes the earlier in-progress snapshot: 833279cae237080cca88b1b6dbc9f217027ba68f, CI37211053490 COMPLETED SUCCESS (both jobs). Final local technical critic independently18/18; no remaining blocker found, not physical Formal Review. Development complete, formal review pending.

## Opposite-host review extension / 对侧物理主机复核（Mech, MEGA-REP）

The statements above are the author's and remain chronological. They are superseded on one point only.

Formal Review PASS on exact head833279cae237080cca88b1b6dbc9f217027ba68f by Mech (COMPUTERNAME MEGA-REP), a different physical host from development_host Alien-codex. Eleven probes written for the review (`utopia:tests/rex802-mech-review-probes.test.mjs`8/8 and `utopia:tests/rex802-mech-review-web.test.mjs`3/3, branch review/REX-802-mech-review at f94967e) MANUFACTURE the seven conditions the workbook Review section demands - missing, duplicate and out-of-order events, a stale clock, restart, partial trace and collector failure - and additionally drive a storage whose load and append never settle, proving the collector cannot slow or block real City work (full register/create/claim/RUNNING/COMPLETED lifecycle completed inside10s with the writer hung). Author suite rerun unmodified12/12+6/6. Android executed by the reviewer: testDebugUnitTest83/83 on15 suites and assembleDebug SUCCESS (app-debug.apk10500445 bytes; the byte count matches the author receipt but the SHA-256 does not, and no hermetic-build claim is made). Repo gates executed by the reviewer: check-bilingual SYNCHRONIZED and browser-relay18/18. Exact-head CI re-measured: push37211053490 SUCCESS, PR17 pull37211470934 SUCCESS on the same head, reciprocal-contract37211470918 SUCCESS.

Findings, none blocking. F1 LOW: completeness is a constant PARTIAL for every recording the Gateway can produce, while a bare empty collector reads COMPLETE, so the field is inverted relative to usefulness and its reason (per-record missingFields) is legible only inside folded raw JSON. F2 LOW: after a restart the snapshot run id over-claims a window that still holds the previous epoch run id. F3 LOW control plane: eight template fields were absent, including all four capability fields, while CAP-RESEARCH-TRACE-001 already existed; backfilled from the verified record and reconciled by this review. F4 LOW test fidelity: the Android unit tests substitute org.json:json for android.jar, whose optString null semantics differ from the device (measured on hardware during JOIN-590), so the load-bearing null guards are correct but uncovered. INVALID INSTRUMENT retained: a delegated instrument concluded those guards were dead code by measuring the test-only jar; that conclusion is wrong for the shipped application. Hypotheses tested and REJECTED: pre-commit event capture through a second writer (no other module holding the gateway emit calls store.atomic; bridge.mjs emits only after save returns), a telemetry CPU dereference crash (validateTelemetry requires cpu), and research-grade inflation (the nine cited signals are7xG3+2xG4, so G4_RARE_SYSTEMIC is the maximum of the declared set and maps to MAXIMUM_BOUNDED per RESEARCH_EVIDENCE_PROTOCOL section6D).

Failure classification: three host-city-launcher failures are ENVIRONMENTAL and identical at the baseline; relay-s1-tunnel fails at the baseline too and is therefore not attributable here; theme-build-bridge is a load-sensitive flake that fails in both head runs and passes4/4 in isolation; mesh301 and web-services fail only in the run that also launched the reviewer browsers and pass in isolation and with the reviewer probes excluded. No physical-device rendering, experiment, provider, model, autonomy or performance result is claimed; Android online rendering remains NOT_RUN. Terminal marker RESEARCH_TRACE_FOUNDATION_ACCEPTED released. See REVIEW_REPORT.md.
