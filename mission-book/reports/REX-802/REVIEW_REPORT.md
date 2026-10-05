# REX-802 — REVIEW REPORT (opposite physical host)

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex (MERA-ALIANWARE)
REVIEWED HEAD       833279cae237080cca88b1b6dbc9f217027ba68f
BRANCH              rex/REX-802-Alien-codex-trace-foundation (remote tip equals the reviewed head)
BASELINE            0e9bea3ce739b979e582a428af8fb233045a5e75
REQUIRED ANCESTOR   69a097b5394a9fece39dd11cc13f04c9b4d28bfe — verified reachable
                    (git merge-base --is-ancestor exit 0), not assumed
REVIEW BRANCH       review/REX-802-mech-review @ f94967e (probes)
EXACT-HEAD CI       V0.2 checks push run 37211053490 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR17 pull run 37211470934 completed/success on the same head
                    City linkage check run 37211470918 completed/success (reciprocal-contract)
VERDICT             PASS
FINDINGS            F1 LOW · F2 LOW · F3 LOW (control plane) · F4 LOW (test fidelity)
                    none blocks the verdict
TERMINAL MARKER     RESEARCH_TRACE_FOUNDATION_ACCEPTED released
```

## 1. How this review was performed (and how it was NOT)

Twenty changed paths, 431 insertions, 11 deletions: a new trace service, a real change to
`services/dev-gateway/server.mjs`, a Web surface, an Android surface, docs and evidence. Nothing in this report is
inferred from the development report, the PR body, a comment, or an author test title.

```text
author suite, unmodified   tests/rex802-trace.test.mjs            -> 12 tests / 12 pass / 0 fail
                           tests/rex802-gateway.test.mjs          ->  6 tests /  6 pass / 0 fail
                           (18 focused, matching the author receipt's focusedTests.passed=18)
reviewer probes, new       tests/rex802-mech-review-probes.test.mjs -> 8 tests / 8 pass / 0 fail
                           tests/rex802-mech-review-web.test.mjs    -> 3 tests / 3 pass / 0 fail
Android, executed here     :app:testDebugUnitTest -> 15 suites / 83 tests / 0 failures / 0 errors
                                                     (ResearchTraceTest 3/3, host MEGA-REP)
                           :app:assembleDebug      -> BUILD SUCCESSFUL, app-debug.apk 10,500,445 bytes
repo gates, executed here  check-bilingual  -> docs / evidence / data-records all SYNCHRONIZED
                           browser-relay-check -> PASS 18/18
full suite, head           tests/*.test.mjs -> 1275 tests / 1268 pass / 7 fail
full suite, head - probes  same files without my probe files -> 1264 tests / 1259 pass / 5 fail
full suite, BASELINE       tests/*.test.mjs -> 1246 tests / 1242 pass / 4 fail  (control run, see §5)
```

Every backend probe runs against a real `createGateway` on a fresh store and drives the real routes; the Web probes
drive a real headless browser against that same gateway and read the rendered DOM. The Android parser was additionally
executed outside the repo against the reviewed source.

Probes whose first drafts failed on **my own** wrong assumption are recorded in comments rather than quietly fixed,
because a draft that fails for the wrong reason looks exactly like a product defect:

```text
node registered with a hand-written capability list   -> claim returned no task (needs REQUIRED_TASK_CAPABILITIES)
owner token posted to /api/v0/node/register           -> 401, which read as "no resource observation exists"
canary planted in task `input` / node `metadata.seed` -> absent from canonical truth; the City drops both
`innerText` on a closed <details>                     -> "the data is not there" when it was merely collapsed
```

## 2. The seven manufactured conditions the workbook demands

The Review section requires the reviewer to **manufacture** missing, duplicate and out-of-order events, a stale clock,
a restart, a partial trace and a collector failure, and to prove that a collector failure does not drag down Utopia
product operation. Each is manufactured below against the real gateway or a real collector.

```text
missing event        PROBE C: seq 2 -> 7 draws SOURCE_SEQUENCE_GAP on the record that jumped, and the recording
                     drops to PARTIAL. The gap is data, not a silent merge.
duplicate event      PROBE C: the same event id observed twice draws DUPLICATE_EVENT on the repeat.
out-of-order event   PROBE C: seq 5 arriving behind watermark 7 draws OUT_OF_ORDER_EVENT, and the record keeps its
                     own sourceSeq 5 - normalization does not renumber the source.
stale clock          PROBE C: a 10-minute-old source timestamp draws STALE_SOURCE_TIMESTAMP; PROBE F confirms the
                     declared clock source travels with the sample (EXTERNAL_DECLARED_WALL_UTC vs CANONICAL_EVENT_WALL_UTC)
                     and that the two clocks stay separate.
restart              PROBE D: a genuinely new gateway over the same directory restores the retained window,
                     opens a new recording epoch, and keeps restored records carrying their own run id.
                     (The scope question this raises is finding F2.)
partial trace        PROBE E: a hung writer plus queueLimit=1 -> droppedRecords>0, retained window bounded,
                     flush times out at 30 ms instead of blocking, completeness PARTIAL, counterScope declared.
collector failure    PROBE A: a storage whose load and append NEVER settle - not fail, never answer. The gateway
                     starts and completes register -> create -> claim -> RUNNING -> COMPLETED, the whole lifecycle
                     inside 10 s, canonical state COMPLETED, health 200, and the trace endpoint still answers
                     instead of hanging with its storage.
                     PROBE B: a storage that throws with a private message -> typed failure code, storageState
                     FAILED, completeness PARTIAL, and the private message never appears in the trace.
```

**The strongest negative claims were tested by planting evidence, not by inspection.**

```text
"raw payload/result/error never copied"   PROBE G: a canary is placed in a reported FAILED task's error/result,
                                          proven present in canonical events, and proven ABSENT from the whole
                                          serialized trace - while the record still names the event and its task ref.
"only the owner may read"                 PROBE G: anonymous 401, worker token 401, enrolled member 403 with a
                                          refusal code naming the owner requirement, owner 200. A POST to the path
                                          is 404, so the trace is read-only at the HTTP boundary.
"the trace cannot rewrite product state"  PROBE F: canonical task state is unchanged by observation; the trace holds
                                          a reference, the City holds the state.
"no measurement is invented"              PROBE F: a genuinely measured 0 stays 0 with reason null; latencyMs,
                                          backoffMs, autonomousSpanMs and taskTransitionCount stay null WITH a
                                          NOT_OBSERVABLE reason; an omitted heartbeat sample does not replay the
                                          previous measurement; experimentRunRef stays null with a reason.
```

## 3. Findings

### F1 — LOW: `completeness` is inverted relative to usefulness, and its reason is not legible

**Observed.** `snapshot()` computes `partial` as: storage not READY, or drops, or retention truncation, or failures, or
**any record carrying an annotation or a missing optional field**. Both ends of that field were measured:

```text
bare collector, zero records                       -> completeness COMPLETE   (nothing is missing from an empty set)
every recording the real Gateway can produce       -> completeness PARTIAL    (always)
fully-declared synthetic record (all 5 dimensions
+ softwareSha + configRef, no annotations)         -> completeness COMPLETE
```

So the field measures *"are all optional external identities declared"*, not *"is this recording trustworthy"*. A City
that is recording perfectly, with zero drops, zero truncation, zero failures and zero annotations, reports PARTIAL
forever, because gateway-emitted events never carry `experimentRef`, `experimentRunRef`, `providerRef`, `modelRef` or
`channelRef` and the collector's software refs are declared, not derived.

**Measured user consequence.** On the Web surface the aggregate `PARTIAL` is visible, but the per-record
`missingFields` that explain it are reachable only by expanding the folded raw JSON; the same is true on Android, where
that blob is emitted as one unlabeled `Text` instead of through the shared technical-details component used by every
other panel. The workbook asks the user to see "trace completeness / missing fields"; the user sees a constant and no
reason. The empty-set corner (COMPLETE on nothing) is **not** reachable through the product — the Gateway emits
`CITY_STARTED` before it can answer anything — so it is recorded as evidence of the field's meaning, not as a
product-visible state.

**Severity, argued rather than assumed.** The direction of the constant is conservative — it can never over-claim —
the author documents it ("discarded history is never presented as a complete run"), and the required
`drop_or_gap`-style facts are all present separately. It is therefore LOW, not a truthfulness defect: the defect is
that one field is asked to carry two different questions, so the user-facing answer is a constant.

**Minimum repair boundary (not required for this verdict):** split the question, for example
`captureIntegrity: COMPLETE|PARTIAL` (drops, truncation, failures, annotations) alongside `fieldCoverage`, and surface
the aggregated missing field names as labelled rows. Inside `services/research-trace/index.mjs` plus the two surfaces.

### F2 — LOW: after a restart the snapshot's run id over-claims the restored window

**Observed** (PROBE D): a new gateway over the same directory returns a **new** top-level `runId`, and its `records[]`
includes records whose own `runId` is the previous epoch's — the records are correctly *not* relabelled, but the object
exposes one run id for a heterogeneous window, with no per-record run filter and no restored-record count. The only
disclosure is `counterScope: CURRENT_COLLECTOR_EPOCH_AND_RETAINED_WINDOW`.

The workbook requires the user to see the **current run**, and the capability record describes the user-visible
information as "recording run versus experiment run". A reader who takes `snapshot().runId` as the scope of
`snapshot().records` is wrong after every restart, and neither surface distinguishes the two.

**Minimum repair boundary:** expose the restored count and/or the per-record epoch next to the run id, or filter
`records` by the current run and label the remainder as restored history. Presentation and one field; no canonical
truth is involved.

### F3 — LOW (control plane): the workbook omits eight template fields, including all four capability fields

`REX-802`'s frontmatter is missing, relative to `MISSION_TEMPLATE.md`:
`capability_ids`, `capability_registry_action`, `capability_registry_refs`, `capability_registry_sync_status`,
`monitor_observability_evidence`, `monitor_observability_refs`, `decision_trace_evidence`, `decision_trace_refs`.

This matters because the omission is not a declaration of `NOT_APPLICABLE`: `CAP-RESEARCH-TRACE-001` **exists** in the
registry, names REX-802 as its source workbook, and asserts
`registry_reconciliation_result: CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW` with known gaps that include "Opposite
physical-host Formal Review pending". A reader cannot reconcile the workbook against the registry, because the
workbook never names the capability. **Reconciled as part of this close-out** (§4), and recorded here as a defect in
the reviewed control-plane artifact rather than repaired silently.

### F4 — LOW (test fidelity): the Android unit tests run against a JSON implementation whose null semantics differ from the device

`apps/android/app/build.gradle.kts:18-20` states it plainly: the android.jar shipped for local unit tests carries a
stubbed `org.json`, so `testImplementation("org.json:json:20180813")` is added **for the test classpath only**. The two
implementations disagree on the case this parser cares about:

```text
reference org.json (unit tests)   optString(name) on JSON null -> ""       (executed against the jar)
shipped Android runtime           optString(name) on JSON null -> "null"   (measured on a physical device: JOIN-590
                                                                           DEVELOPMENT_REPORT.md:410-413, where the
                                                                           4-character text caused a City identity conflict)
```

`ResearchTrace.kt:14` and `:17` guard with `takeUnless { it.isBlank() || it == "null" }`. That guard is therefore
**correct and load-bearing on the device**, and `ResearchTraceTest` **cannot** exercise it, because on the test
classpath the string never occurs and `isBlank()` alone carries the assertion. The tests pass, the code is right, and
the coverage of the risky branch is not what the green suite suggests.

**INVALID INSTRUMENT, retained.** My delegated Android instrument concluded from the reference jar's behaviour that
those guards are dead code. That conclusion is **wrong for the shipped application** and is recorded here as an
instrument error, not as a product defect — the same discipline this programme applies to reviewer fixtures that fail
for the wrong reason. `android.jar` cannot settle it either: `javap -c` on `platforms/android-36/android.jar` shows
`org.json.JSONObject.optString` as `throw new RuntimeException("Stub!")`.

### 3.1 Hypotheses tested and REJECTED (recorded so they are not re-opened)

```text
pre-commit event capture through a second writer
  All four transaction sites in server.mjs go through atomicWithTrace, and no other module that holds the gateway's
  `emit` calls store.atomic: services/capability-bridge/invocation-store.mjs owns two atomics and neither emits, while
  bridge.mjs calls emit only AFTER save(row) has returned, i.e. after commit. The single `transactionTrace` variable
  is not re-entrant, but a nested store.atomic would throw at BEGIN inside the outer transaction, so the corruption
  state is unreachable rather than merely unobserved.

`b.telemetry.cpu` TypeError on the register/heartbeat path
  observeResources dereferences b.telemetry.cpu.usagePercent, but validateTelemetry (contracts/pairing-v1/descriptor.mjs)
  requires `t.cpu` and a numeric-or-null usagePercent and throws before the route reaches it; a missing cpu is a 400,
  not a 500. Not reachable.

research grade inflation (highest_research_grade_observed: G4_RARE_SYSTEMIC)
  Verified against mission-book/RESEARCH_SIGNAL_WATCHLIST.yaml: the nine cited signals are 7 x G3_SPARSE_ACTIVE and
  2 x G4_RARE_SYSTEMIC, so G4 is the maximum of the declared set, and RESEARCH_EVIDENCE_PROTOCOL §6D maps G4 ->
  MAXIMUM_BOUNDED, which is the declared capture level. The value is a classification of the workbook's watchlist
  hits, matching the established reading elsewhere in this programme. No finding.

"provenance is not visible to the user"
  Tested through the browser: the provenance statement lives inside the folded technical details on Web (and inside
  the toggled section on Android). The workbook says the user must be ABLE to see it and explicitly allows raw ids to
  be folded into technical details on an L4_TECHNICAL surface, and the capability record names "expand technical
  details" as the user control. Reachable by one click, so this is recorded as tested-and-accepted, not as a defect.
```

## 4. Completion gates, independently checked

| # | Gate (workbook §完成门槛) | Verdict | Basis |
|---|---|---|---|
| 1 | trace schema | PASS | closed key sets, enum-checked authority/eligibility/grade/intervention values, 40-hex sha checks, time-shape checks, structured rule-lifecycle/supervision/semantic-integration dimensions |
| 2 | collector | PASS | bounded (record/queue/byte limits validated and capped), commit-stage observation, total `record()` that cannot throw into a caller, bounded `flush`/`close`, typed failures without private detail |
| 3 | normalized view | PASS | deterministic replay check on load (`TRACE_REPLAY_MISMATCH` refuses a storage whose replay differs), declared `transformRef`, raw-source `sourceDigest`, separate source/capture/monotonic clocks |
| 4 | user observability | PASS (F1, F2 recorded) | owner-only Web + Android surfaces, measured through a real browser; member refusal guidance; offline honesty; folded identifiers; no fabricated value in any branch examined |
| 5 | review / CI / material index | PASS | this report; runs 37211053490 / 37211470934 / 37211470918 all success on the reviewed head; `reports/REX-802/PAPER_MATERIAL_INDEX.md` present with the watchlist grades verified |
| 6 | terminal marker | RELEASED | `RESEARCH_TRACE_FOUNDATION_ACCEPTED` |

Workbook hard rules, each with where it was decided:

```text
does not copy canonical task/action truth   PROBE G (canary absent) + inspection: only identity refs are retained
trace may reference, not rewrite, state     PROBE F and PROBE G: canonical state is the only state that changes
clock source / timestamp semantics recorded PROBE F: source clock, capture clock and monotonic epoch are separate fields
missing measurement is unknown, never 0     PROBE F: 0 preserved as 0; four metrics null WITH reasons
raw -> normalized transformation reviewable persisted raw row + context + sourceDigest + transformRef + replay check
```

Registry reconciliation performed by this review:

```text
capability-registry/records/CAP-RESEARCH-TRACE-001.yaml
  registry_reconciliation_result  CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW -> FORMAL_REVIEW_RECONCILED
  known_gaps                      "Opposite physical-host Formal Review pending" replaced by the PASSED record
  evidence                        reviewer probes + this report added as review refs
workbook REX-802
  status IN_PROGRESS -> COMPLETE, review_complete false -> true, review_ci set to the verdict,
  the eight missing template fields backfilled from the verified record (F3)
```

## 5. Regression and failure classification

The full root suite was run three times on this host: at the reviewed head with my probes, at the reviewed head
without my probes, and at the **baseline** commit as a control run. Naming failures rather than counting them:

```text
BASELINE 0e9bea3c            1246 tests / 1242 pass / 4 fail
  host-city-launcher.test.mjs   x3  -> "requires a free coordination port; refusing to disturb an active City",
                                       "this host is already joined", "Requires a free local host reservation"
                                       ENVIRONMENTAL: a resident City holds the coordination port on this host.
  relay-s1-tunnel.test.mjs      x1  -> "a sustained burst is refused with 429 rather than served"
                                       FLAKY, AND REPRODUCED AT THE BASELINE: it fails with REX-802 absent entirely.

HEAD 833279ca, probes included 1275 tests / 1268 pass / 7 fail
  host-city-launcher x3, relay-s1-tunnel x1        -> the four above, unchanged
  mesh301-strict-target.test.mjs   x1  -> "Alien-Win must now be known but offline"   (7/7 in isolation)
  theme-build-bridge.test.mjs      x1  -> theme lab build FAILED after 32 s           (4/4 in isolation)
  web-services.test.mjs            x1  -> "late result stays in shared history"       (2/2 in isolation)

HEAD 833279ca, MY PROBES EXCLUDED  1264 tests / 1259 pass / 5 fail
  host-city-launcher x3, relay-s1-tunnel x1        -> unchanged, as above
  theme-build-bridge x1                            -> still fails under full-suite load
  mesh301 and web-services                         -> NO LONGER FAIL
```

The three-way comparison classifies all seven without hand-waving:

```text
3 x host-city-launcher        ENVIRONMENTAL. Identical at the baseline; the resident City holds the coordination port
                              by design and the tests refuse rather than disturb it.
1 x relay-s1-tunnel           PRE-EXISTING FLAKE. Fails at the baseline commit, so it cannot be attributed here.
1 x theme-build-bridge        LOAD-SENSITIVE FLAKE, previously recorded in this programme as flaky under full-suite
                              load. It fails in BOTH head runs (including the one without my probes) and passes 4/4 in
                              isolation, but did NOT fail in this particular baseline run, so this review claims a
                              load-sensitive flake and NOT a baseline reproduction.
2 x mesh301 / web-services    MEASUREMENT EFFECT OF MY OWN INSTRUMENTS. They pass at the baseline, pass at the head in
                              isolation, pass at the head with my probes excluded, and fail only in the run that also
                              launched three headless browsers from my Web probe. The cause is suite composition, not
                              the reviewed commit.
```

Nothing in the reviewed commit touches the rate limiter, the strict-target inventory, the theme bridge or the services
adapters, and the authoritative record is CI on the reviewed head: **all three runs success, all jobs success**.

## 6. What this review does NOT claim

* **No physical-device rendering.** The Android surface was verified by executing the parser outside the repo, by
  reading the Compose panel, and by a first-hand `:app:testDebugUnitTest` (83/83) and `:app:assembleDebug`. The
  Compose UI itself was never rendered on a device or emulator here; the author's own OPPO entry evidence is offline
  entry only. Android online rendering remains `NOT_RUN`, exactly as the capability record states.
* **No experiment, provider, model or autonomy result.** The workbook's longitudinal questions are *schema support*
  only; no experiment execution run, provider binding or autonomous span was observed, and the trace reports those as
  `NOT_OBSERVABLE` with reasons. `highest_research_grade_observed` is accepted as a watchlist classification, not as
  an observed finding.
* **No performance claim.** APK bytes reproduced exactly (10,500,445) but the SHA-256 did not; the Android build is not
  hermetic, so the byte match is reported and the hash is explicitly not claimed as a verification of the author's.
* F1, F2, F3 and F4 are **not** repaired in the reviewed artifact. F3 is reconciled in the control plane by this
  review and stated as such; the rest are recorded with minimum repair boundaries and left to the programme.
* This verdict covers only `833279cae237080cca88b1b6dbc9f217027ba68f`. A later head needs its own review; nothing
  here transfers to it, and `review/REX-802-mech-review` is review evidence, not a merge candidate.
