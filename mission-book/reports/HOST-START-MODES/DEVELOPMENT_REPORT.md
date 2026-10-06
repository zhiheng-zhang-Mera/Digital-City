# HOST-START-MODES — Owner-directed change report

```text
TASK_ID            HOST-START-MODES  (no owning workbook — see §1)
KIND               OWNER_DIRECTED_CHANGE (not a claimed task)
ROLE               Mech-DS (development host MEGA-REP)
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
BRANCH             mech/standalone-city-lifecycle
BASE_SHA           d3262ce2dd81e51a53e39e6f9add8dee650a7682
DEVELOPMENT_HEAD   473d8e8901c97c0b92f5137ea1b6d70e949a8aee (behaviour)
DOCS_HEAD          4ee0974  (bilingual docs + evidence receipt)
DISCLOSURE_HEAD    a8bce279e1145f5b480a3a0eb4a74378aeb66d68 (§14A start disclosure + PROBE 8)
CI_REPAIR_HEAD     4b2e701  (City-process acceptance moved out of the parallel suite)
CI_REPAIR2_HEAD    7444974e8f4c2fb5571154d18c76d9d035bc51fb (membership rule redrawn after CI caught a real regression)
FINAL_HEAD         b1157f3c3dec08976efe61fd7421efbce34ae727 (V0.2 checks green on push and pull_request)
PULL_REQUEST       zhiheng-zhang-Mera/utopia#26
TERMINAL_MARKER    none — there is no workbook and therefore no marker to release
REVIEW             not applicable (no workbook); opposite-host review not solicited
```

---

## 1. Why this report exists without a workbook

The owner's instruction was a direct change request, not a mission-book claim:

> 调整启动器，单机启动时默认指向已打开的城市，关闭网页时直接关闭城市。开启城市时默认无视角色，仅当进入联机时进行角色调整。

Before implementing, the control plane was searched for a workbook that owns the host **start-mode / page-lifecycle /
stored-role** surface. None exists:

```text
search                    mission-book/**.md frontmatter + reports/ directories
candidates inspected      SHOW-401 (showcase material extraction, development_host Alien)         -> unrelated
                          JOIN-590 (connection onboarding, merged-main physical acceptance)      -> adjacent, not this
                          CEX-701..705 / REX-802 / MON-901 (capability entry closeout)           -> unrelated
result                    ZERO WORKBOOKS OWN THIS SURFACE
```

Classification (per the mission-book rule that an unowned change must still be recorded): this is an
**OWNER_DIRECTED_CHANGE** delivered outside the claim system, with zero claims and zero markers. It is reported here,
not in another workbook's report directory, so that JOIN-590's closeout record is not polluted by an unrelated diff.
The report directory `reports/HOST-START-MODES/` intentionally has no workbook sibling; the progress generator
(`mission-book/tools/sync_mission_progress.py`) iterates workbook frontmatter `task_globs`, not the `reports/` tree, so
an orphan report directory is inert to it.

**Recommendation.** Allocate a workbook for the host start-mode and lifecycle surface (`HOST-1xx`), because this change
introduced durable, machine-readable lifecycle state (`CITY_LIFECYCLE`, `lifecycle` in the City snapshot, page-idle
exit, role-vs-selection separation) that future work will need to claim against.

## 2. The three defects the owner asked to remove

```text
D1  a single-machine City outlived the page that opened it
    opening Utopia on one machine spawned a detached, unref'ed process that no page owned; closing the tab left a
    City serving on the LAN with nobody at the keyboard. Observed as an integration consequence of the launcher's
    detached spawn, not as a bug report with a reproducer.

D2  the stored role decided what a single-machine start did
    main.mjs read the stored selection from role.json and, when it said MEMBER of another City with an enrollment
    file, diverted the start into the member/enrollment path — so a person who had once joined a friend's City
    could not start their own City without first clearing state.

D3  starting your own City silently destroyed the membership you had chosen
    host-city.mjs publish() rewrote role.json to PRIMARY on every start. Even when a start did not take the member
    path, the stored selection was overwritten. (D2 and D3 are facets of one modelling error: the running role and
    the stored selection were the same fact.)
```

## 3. Decision record — choices, alternatives, and the judgement logic

### 3.1 What "the City" is tied to in the default case

```text
CHOSEN      the page. Default start = standalone + page lifecycle. The City closes when the page that owns it goes
            away, with an 8 s grace window (CITY_PAGE_IDLE_MS) so a reload does not kill it.
REJECTED A  the process. A City that always outlives every page is exactly D1.
REJECTED B  a desktop shell / tray icon. There is no launcher shell in this repository to own such a supervisor;
            inventing one is a much larger change than the owner asked for, and it would move the life of a City
            into a component no user can observe.
REJECTED C  closing immediately on `pagehide`. `pagehide` fires on reload as well, so a reload would take the City
            down and force a cold start. The grace window distinguishes "the person reloaded" from "the person left".
JUDGEMENT   the default must be the least surprising life for the ordinary single-machine user, and "the window I
            opened is the thing that is running" is that life. The grace window is the minimum mechanism that keeps
            the common reload from being destructive.
```

### 3.2 Where the decision is made

```text
CHOSEN      a pure planning module, scripts/launcher-plan.mjs, exporting planStart({args}) -> {mode, lifecycle,
            followsMembership, rolePersisted}, plus the predicates followsMembership(plan) / pageTied(plan).
            The launcher and the gateway both consume the plan; the plan itself is unit-testable with no process,
            no port, and no filesystem.
REJECTED    scattering the mode decision across argument parsing in utopia-client-launcher.mjs. That is where the
            enrolment diversion already lived, and the two role==='MEMBER' branches were the reason D2 was invisible:
            there was no single place to read the rule from.
JUDGEMENT   a decision that three components must agree on has to exist once, as data, before it exists as control
            flow. All mode decisions are expressed as plan fields; every branch in the launcher is now gated on a
            plan predicate rather than on a locally re-derived bool.
```

### 3.3 How a page releases a City it owns

```text
CHOSEN      two independent mechanisms:
            (a) explicit — the page posts to POST /api/v0/host/release on unload with keepalive, so the City closes
                the moment the person leaves rather than after the grace window;
            (b) implicit — the gateway arms a page-idle exit when the last control surface disconnects.
            Ownership is enforced: the route refuses a City session with OWNER_CREDENTIAL_REQUIRED, and a City whose
            lifecycle is `service` answers released:false with reason "this City is not tied to a page".
REJECTED A  relying only on the WebSocket close. A control surface can drop for reasons that are not the person
            leaving (sleep, network blip, a suspended tab), so close alone would close Cities that are still wanted.
REJECTED B  making the release route unauthenticated for convenience. Any page on the machine — including a page
            loaded from another City — could then kill a City it does not own.
JUDGEMENT   the page that opened the City is the only thing entitled to close it, and the City must be able to say
            "no" truthfully. The two mechanisms are ordered so the fast path is explicit and the safety net is
            implicit, and both funnel into one shutdown(reason) so the exit line and the process exit code are the
            same however the City was closed.
```

### 3.4 Roles: running fact vs stored selection

```text
CHOSEN      separation. role.json keeps the stored selection; the coordination record keeps the running role. A
            single-machine start runs PRIMARY and passes persistRole:false, leaving role.json byte-identical. Only an
            online start (`--online`, or enrolling) reads the selection and writes it back.
REJECTED A  deleting role.json on a single-machine start. That destroys information the person may want the next
            time they go online.
REJECTED B  honouring the stored role but not rewriting it. The single-machine start would then run a MEMBER City
            with no membership — D2 with a quieter symptom.
REJECTED C  renaming the file to make the distinction obvious. A migration for a naming preference is not worth the
            risk to an installed data directory.
JUDGEMENT   the owner's sentence "开启城市时默认无视角色，仅当进入联机时进行角色调整" is a statement about which action
            adjusts the role: going online. Ignoring the role is therefore not deletion but non-consultation, and the
            file is left as the person left it. The City announces the decision in its own startup record
            (CITY_LIFECYCLE, CITY_ROLE_IGNORED) so the behaviour is inspectable instead of inferred.
```

### 3.5 How the lifecycle is declared

```text
CHOSEN      CITY_LIFECYCLE in the environment, normalised to page|service|online, default `page`; the gateway
            echoes `lifecycle` in its own snapshot so the page never guesses.
REJECTED    inferring page-tiedness from "was a page ever connected". A hosting City may have no page for hours and
            would then be closed by the first page that ever touched it. Publish-time inference is unfalsifiable
            after the fact; an explicit declaration is checkable at the process boundary.
JUDGEMENT   every component that can close the City must be able to read the City's own answer to "may I be closed
            by a page". `scripts/start-city.ps1` sets CITY_LIFECYCLE=service for exactly this reason: the hosting
            entry point is the one that must survive the operator's browser.
```

## 4. What was implemented

```text
scripts/launcher-plan.mjs                 NEW  planStart / followsMembership / pageTied — the single rule
scripts/utopia-client-launcher.mjs             consumes the plan; enrolment branch and both role==='MEMBER'
                                               diversions gated on followsMembership(plan); spawn env carries
                                               CITY_LIFECYCLE; the JSON report carries mode/lifecycle/roleIgnored
services/dev-gateway/main.mjs                   CITY_LIFECYCLE normalised (default page); stored role consulted
                                               only when online; one shutdown(reason) shared by lifecycle exit and
                                               SIGINT/SIGTERM; startup record carries CITY_LIFECYCLE / CITY_ROLE_IGNORED
services/dev-gateway/server.mjs                 createGateway({lifecycle, pageIdleMs, onLifecycleExit}); control-surface
                                               tracking; armPageIdleExit / cancelPageIdleExit; snapshot.lifecycle;
                                               POST /api/v0/host/release (local-only, owner-only, truthful refusal)
services/dev-gateway/host-city.mjs              publish() honours persistRole:false
apps/web/app.js                                 pagehide -> keepalive POST /api/v0/host/release when page-tied
scripts/start-city.ps1                          CITY_LIFECYCLE=service
tests/host-standalone-lifecycle.test.mjs  NEW   7 probes
tests/host-lifecycle-process-e2e.test.mjs NEW   2 process-level acceptances
tests/host-city-launcher.test.mjs               fixture now copies launcher-plan.mjs into both simulated installs;
                                               no assertion changed
docs/START_MODES.md                       NEW   bilingual statement of the three modes and their evidence
evidence/raw/mission-book/HOST-START-MODES/development-receipt.json  NEW  recorded runs
```

## 5. Capability gates (§14A exposure, §14C registry)

### 5.1 Exposure decision

```text
QUESTION   should the user drive this capability, or merely know about it?
CLASS      BACKGROUND_DISCLOSED
WHY        the start mode decides how long a background process lives. §14A.4 forbids INTERNAL_ONLY for anything that
           affects long-running background behaviour, and the person does not press a button to pick a mode - they just
           start their City - so the right answer is disclosure rather than a control.
NESTING    L2_CONTEXTUAL at the moment of starting (the launcher's own output); the machine-readable fields
           (mode / lifecycle / roleIgnored in --json, lifecycle in the City snapshot) stay L4 technical detail.
WIRING     the disclosure is computed from the same plan object that decides the mode, and the City snapshot is the
           City's own answer - so the words cannot drift from the behaviour.
```

The disclosure was not an afterthought: without it the change would have been a silent alteration of how long a process
lives, which is exactly the "capability the user should know about" case §14A exists for. Human mode now prints, after
the endpoint:

```text
This City follows this page: closing it closes the City.
A single-machine start does not use the stored role; going online is what changes the role.
```

`--json` stays one parseable line and carries the same facts as fields. PROBE 8 asserts these exact words, and asserts
that a report with no lifecycle (the enrolment path) invents no disclosure it cannot support.

```text
REACHABILITY GAP (recorded, not papered over)
no Web/Android surface renders which start mode a City is in. A page-tied City is disclosed at start and then not
observable; a person who forgot cannot check. Minimal repair boundary: an L3 status row in the City panel, plus a
one-line notice on the page itself when city.lifecycle === 'page'. Not built here because the owner asked for the
behaviour, and §14A.6 permits a component-complete change to retain this seam once the decision and the seam are
recorded. It is recorded as CAP-HOST-LIFECYCLE-001's known gap.
```

### 5.2 Registry chain update (§14C)

```text
capability_ids              ["CAP-HOST-LIFECYCLE-001"]  (new, immutable)
capability_registry_action  CREATE
record                      capability-registry/records/CAP-HOST-LIFECYCLE-001.yaml
index / surface index       CAPABILITY_INDEX.yaml + SURFACE_INDEX.yaml updated
matrices                    CAPABILITY_EXPOSURE_MATRIX.{en,zh-CN}.md updated (bilingual)
sync status                 CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW
last_verified_full_sha      a8bce279e1145f5b480a3a0eb4a74378aeb66d68
four dimensions             implementation COMPLETE / wiring VERIFIED / reachability PARTIAL / intent NOT_TESTED
```

Registry integrity was checked after the edit: 13 records, no duplicate ids, every `record_ref` resolves, and all three
files parse as YAML.

## 6. Evidence

```text
node --test tests/host-standalone-lifecycle.test.mjs
  pass 8 / fail 0 / skipped 0 / todo 0 / duration_ms 3602.9581
  PROBE 1  the plan defaults to a page-tied single-machine City; only --online follows a membership
  PROBE 2  closing the last page in page mode closes the City, and says why
  PROBE 3  a reload inside the grace window does NOT close the City
  PROBE 4  a second surface keeps the City alive
  PROBE 5  a City that never had a page does not close itself
  PROBE 6  the owner page can release the City explicitly, and only the owner
  PROBE 7  a hosting City ignores the release and never follows a page
  PROBE 8  the person starting a City is told which life it got, and told why their stored role was ignored

node --test tests/host-lifecycle-process-e2e.test.mjs
  pass 2 / fail 0
  E2E 1  closing the last page ends the City process with exit code 0 and a /Utopia City closing/ line
  E2E 2  a stored MEMBER role is ignored on a single-machine start, role.json is left byte-identical, and the same
         stored role is honoured when the City is started online

repository checks   check-bilingual SYNCHRONIZED; browser-relay-check 18/18
regression subset   174 pass / 180; the 3 failures (3x host-city-launcher.test.mjs, relay-s1-tunnel) were reproduced
                    UNCHANGED at the unmodified baseline via git stash -> classified ENVIRONMENT (the resident City
                    holds coordination port 4389), not attributable to this change
CI (PR #26)         City linkage check / reciprocal-contract SUCCESS; V0.2 checks — see §7 for the three red runs this
                    change caused and their repairs, and §7.4 for the green final head b1157f3c3dec (push run
                    37292415979 and pull_request run 37292420548).
```

Fidelity note, recorded rather than glossed: the process-level E2E spawns its own isolated City and therefore needs
coordination port 4389 free, and `main.mjs` refuses to start while `findRunningCities()` sees any City. The resident
City was stopped for that run and **restored** afterwards (`031fdba6-e94c-4298-a095-6ff04a65481d`,
`http://172.31.12.151:4391`, coordination 4389 ONLINE, health healthy, rooms READY, capabilities 7, ask/targets 16).
The probes were not re-run at the docs-only head `4ee0974` because doing so would take the same City down again; no
code changed between the recorded run and the docs commit. The disclosure commit `a8bce279e114` re-ran the probe suite
afterwards (8/8, recorded above) and did not change any behaviour the E2E covers.

## 7. A real CI defect this change introduced, and its repair

Required CI on head `473d8e89` (run `37287799751`) and `4ee0974` (run `37288020267`) was **red**, with three failures in
`tests/host-city-launcher.test.mjs`. The base commit `d3262ce2` was **green** on the same file (run `37222674520`), so
this was not an inherited environment problem — the honest classification is a defect introduced by this change:

```text
OBSERVED        run 37287799751 (gateway-web): 1253 pass / 3 fail
                ✖ two installation launchers share one City across ports and recover the same identity after a crash
                    Error: Command failed: … utopia-client-launcher.mjs --host 127.0.0.1 --port 0 --no-open --json
                    Utopia: City did not become ready within 45 seconds
                ✖ remote short code enrolls with a local member agent and reconnects without launching a host City
                    EBUSY: resource busy or locked, unlink '.scratch-remote-launch-…/city.sqlite'
                ✖ PRIMARY launcher reports successful MEMBER transition and normal main restart preserves it
                    Error: Requires a free local host reservation
BASE COMPARISON d3262ce2 V0.2 checks 37222674520 -> SUCCESS (same file, same runner image family)
CAUSE           the new tests/host-lifecycle-process-e2e.test.mjs spawns real Cities. node --test runs test FILES in
                parallel, and starting a City is a HOST-WIDE act: host-preflight.mjs findRunningCities() scans the
                process list for any other services/dev-gateway/main.mjs and main.mjs refuses to start while one
                exists. Port separation is irrelevant to that rule, so my City made the launcher tests' Cities refuse
                to start, in whichever order the scheduler happened to pick.
REJECTED FIX    spawn the City from a command line the preflight does not recognise, so the collision would not be
                seen. That is evasion: two Cities really would run on one host, which is the condition the product
                forbids. Rejected explicitly.
REPAIR          the acceptance moves to tests/acceptance/ (outside the tests/*.test.mjs glob), gains a
                `pnpm test:acceptance` script, and the CI job runs it as its own step BEFORE `pnpm test`. Same job,
                so it still gates the pull request; serialised, so it never overlaps another City. The file's header
                documents the reason so the next person does not move it back.
```

This is recorded rather than quietly fixed because it is the exact failure mode the rules warn about: a change that
passes locally (where the resident City made the new acceptance *skip* and the launcher tests fail for a different,
known reason) while breaking hosted CI.

### 7.1 A second defect CI caught: the role rule was drawn one step too wide

The first repair made the acceptance serialise, and CI went from 3 failures to 2 — but still red. The two that
remained were **not** the environment's:

```text
OBSERVED        run 37288968499 (gateway-web): 1253 pass / 2 fail, both in tests/host-city-launcher.test.mjs
                ✖ remote short code enrolls with a local member agent and reconnects without launching a host City
                    EBUSY: resource busy or locked, unlink '…/.scratch-remote-launch-…/unused-host/city/city.sqlite'
                ✖ PRIMARY launcher reports successful MEMBER transition and normal main restart preserves it
                    Error: Requires a free local host reservation     (a cascade: the leaked City from the test above)
CAUSE           I had gated the stored-membership path in scripts/utopia-client-launcher.mjs on followsMembership(plan),
                which is true only for --online. A plain `--port` start by a host that is ALREADY a member of a City
                therefore stopped reconnecting to that City and instead launched a SECOND City in the member's own state
                directory - which is exactly what that accepted test forbids, and which then held city.sqlite open so the
                next test could not reserve the host either. JOIN-503's accepted contract, not the environment.
WHY LOCAL MISSED IT
                the same test file fails on this host for an unrelated reason (the resident City holds coordination port
                4389), so a local run could never distinguish my regression from the known environmental failure. This is
                the cost of reviewing development on the machine that is running the product, and it is recorded here as
                a failure of my own verification, not of the environment.
REPAIR          the rule was redrawn in scripts/launcher-plan.mjs where it can be tested without a City:
                planStart() now carries `hosting`, and mayFollowStoredMembership(plan) is false ONLY for an explicit
                hosting start (--host-only / scripts/start-city.ps1). Any other start may RECONNECT to a membership
                still on disk, because that host is already a member and pointing at that City is what being online
                means for it; only an online start WRITES role.json (persistRole:false elsewhere, unchanged); and a
                membership that cannot be honoured still refuses honestly rather than becoming a different City.
                PROBE 9 pins the rule, and the launcher's report now says roleIgnored from the fact of whether a stored
                role was actually followed, instead of from a plan predicate.
CI_REPAIR2_HEAD 7444974e8f4c2fb5571154d18c76d9d035bc51fb
```

Both defects were found by the required hosted CI and by nothing else, which is the argument for §8's rule that local
green is not evidence: on this host, the branch that broke could not fail.

### 7.2 A third defect CI caught: the member agent was no longer an online start

The second repair removed two failures but not the same two. Reading the remaining failure precisely showed a deeper
cause than the launcher:

```text
OBSERVED        run 37290526406 (gateway-web): 1254 pass / 2 fail, the same two launcher tests
                ✖ … "without launching a host City"  -> EBUSY on the member's own city.sqlite
                ✖ … "Requires a free local host reservation"  (cascade)
CAUSE           main.mjs derived "this is an online start" from CITY_LIFECYCLE==='online' alone. The launcher spawns a
                MEMBER AGENT with CITY_MEMBER_FILE and NO declared lifecycle, so the member agent took the host path and
                came up as a PRIMARY City of its own - a host City started where the caller had deliberately asked for
                none, which is literally the assertion in the failing test's own name.
REPAIR          the predicate moved out of main.mjs into services/dev-gateway/host-lifecycle.mjs as
                resolveLifecycle(env), where ONLINE = declared 'online' OR a member agent, and where it can be tested
                without spawning a process. PROBE 10 pins the rule; E2E 3 (in the host-owning acceptance file) spawns a
                real member agent whose City is unreachable and asserts it never reserves this host as a PRIMARY City,
                never prints 'Utopia Host listening', and never opens the host's City port.
CI_REPAIR3_HEAD 16f4854  (member-agent rule + docs; the rule's own commit is 6276b64)
FINAL_HEAD      b1157f3c3dec08976efe61fd7421efbce34ae727
FINAL CI        V0.2 checks 37292415979 (push) and 37292420548 (pull_request) -> COMPLETED SUCCESS on b1157f3c3dec08976efe61fd7421efbce34ae727
                City linkage check 37292420610 -> success on the same head
```

### 7.4 The fourth step, and the green head

The refined rule separates the four cases in `selectMemberFile()`, and PROBE 12 pins each one:

```text
1  CITy_MEMBER_FILE present                 -> the member agent file, always (online by construction)
2  stored selection role=MEMBER, credential -> FOLLOWED, even on a plain start: this host is resuming a membership it
   present                                    already holds (the accepted restart contract)
3  stored selection role=MEMBER, credential -> REFUSED with 'Selected member credential unavailable; no PRIMARY fallback
   gone                                        started'. It may never quietly become a PRIMARY City in its place.
4  leftover enrollment, NO stored selection -> NOT followed on a plain start (this is the defect the owner reported:
                                               enrolling once diverted every later ordinary start); followed only
                                               when the start is online
```

`tests/host-city-launcher.test.mjs:120` (`assert.equal(owned?.role,'MEMBER')` after a normal `main.mjs` restart) is the
accepted test that forced case 2 to be kept, and it is the reason this report does not claim that "a single-machine start
ignores the role" in the broad sense I first implemented: what it ignores is the *leftover enrollment* diversion, and
what it never does is *write* the role. That is the precise reading of the owner's instruction that survives contact
with the accepted contracts, and the CI result confirms it end to end:

```text
b1157f3  V0.2 checks: push SUCCESS, pull_request SUCCESS  (1257 tests, the 3 known host-city-launcher tests pass here
         because the runner has the host to itself)  + City linkage check SUCCESS
```

For completeness: the transient `web-v02.test.mjs` failure (`RECONNECTING` vs `OFFLINE`) seen on head `6276b64`
disappeared at `b1157f3` with no change to that file. It was a cascade of the still-broken launcher test leaving a City
behind, not an independent defect; it is recorded here so the earlier red run is not left unexplained.

The rule was written down in two files before it became a module with its own probe. A predicate that decides whether a
process becomes a City or a client of one should never have been inline in a 110-line startup script, and it has now
hidden a regression twice.

### 7.3 A real defect found while pinning E2E 3, recorded and deliberately NOT repaired

```text
OBSERVED        spawning main.mjs while another City runs on this host, with a non-default CITY_COORDINATION_PORT, makes
                the process print 'Another City is already running on this host: …' and then ABORT with exit code
                0xC0000409 (STATUS_STACK_BUFFER_OVERRUN) after a libuv assertion:
                "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\\win\\async.c, line 76"
BASE COMPARISON the same spawn against the MON-901 head tree (which has no CITY_COORDINATION_PORT) exits 0 printing
                'Utopia Gateway already reserved on this host: …'. So the abort is in main.mjs's refusal path
                ('Another City is already running'), not in the reservation path this change touched: the new
                CITY_COORDINATION_PORT test seam made an existing path reachable, which is how it was found.
CLASSIFICATION  latent, pre-existing defect in startup refusal; outside the owner's request and outside the behaviour
                this change owns. §8 forbids widening a repair beyond the observed defect and §9 forbids defensive
                expansion, so it is recorded rather than fixed.
CONSEQUENCE     E2E 3 asserts the invariant it is about (what the member agent refused to become) and records the exit
                code instead of asserting one; and it still skips when a City already holds this host, which is the only
                condition that reaches the aborting path.
RECOMMENDATION  give the refusal path a workbook of its own (or fold it into the HOST-1xx workbook recommended in §1):
                a second City must be refused with the documented exit and a closed reservation, not with a libuv abort.
```

## 8. Open items

```text
1  No workbook owns this surface -> allocate HOST-1xx (see §1). Until then, changes here are owner-directed and
   carry no claim, no marker, and no review.
2  The 3 environmental failures above are pre-existing and belong to whichever workbook owns the launcher test
   suite; they are recorded here only so the classification is not lost.
3  `--online` was verified at the plan and process level (E2E 2) but not against a second live City in this session;
   JOIN-590's merged-main physical acceptance is the record for the live enrolment path.
```

语言配对 / Language pair: [原文 / Source](./DEVELOPMENT_REPORT.md) · [译本 / Translation](./zh-CN/DEVELOPMENT_REPORT.md)
