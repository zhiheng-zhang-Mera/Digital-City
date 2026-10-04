# WBC-601 — Development Report

```text
TASK_ID            WBC-601  (Execution Backend Contract + STANDARD_DEVICES default)
PROGRAMME          WORKBENCH_COMPATIBILITY_MIGRATION
ROLE               Development
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
HOST               Mech  (COMPUTERNAME MEGA-REP; City node identity Mech-Win)
BRANCH             wbc/WBC-601-execution-backend-contract
BASELINE_SHA       612c344f9f2b06a67b2645b4662d97750dd7c44e
REQUIRED_ANCESTOR  9f3e20e8ec99d591812430bee71d27e68c4ad498  -> verified ancestor of baseline
HEAD_SHA           d65dbd3af2d8903aca13726f74110e1f2f6b9b65
CI                 V0.2 checks run 37205291447 completed / success on HEAD_SHA
TERMINAL_MARKER    EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED  (development side complete)
REVIEW             PENDING — see §8 (opposite-host Formal Review not performed from this session)
```

---

## 1. Claim

Claimed atomically per `CONSTRUCTION_RULES.md` §2 / §2A.2. The claim commit in Digital-City
(`898db10`, pushed to `main`) sets `development_host`, `development_branch`, `development_baseline_sha` and
`baseline_resolution_evidence` in one commit, and touches no other workbook field.

Claim-time measurements (full 40-char SHAs, not branch names):

```text
utopia refs/heads/main            612c344f9f2b06a67b2645b4662d97750dd7c44e
required_ancestor_shas[0]         9f3e20e8ec99d591812430bee71d27e68c4ad498  ANCESTOR_OK
accepted heads still ancestors    ec12fd0831f31fd81aef9cd9dfb0c959d010f63b  ANCESTOR_OK
                                  69a097b5394a9fece39dd11cc13f04c9b4d28bfe  ANCESTOR_OK
required CI on the baseline       V0.2 checks        37203397283  completed / success  headSha 612c344f…
                                  City linkage check 37203397272  completed / success  headSha 612c344f…
worktree                          D:/utopia-wbc601   branch wbc/WBC-601-execution-backend-contract
```

**Judgement recorded (problem → choice → why).** `UTOPIA_LIVE_STATUS.json` still named `69a097b5` as
Utopia `main`, two merges behind the real head. §7 requires control-plane reconciliation after external
change and forbids trusting a stale board, so the CI evidence was read from the **Actions API** and matched on
`headSha`, not from the generated status file. Choice: measure, never inherit. A stale generated file is
evidence *about* a workflow, not evidence about a commit.

---

## 2. The engineering problem, and the shape of the answer

The Workbench Compatibility Migration needs future execution resources (a Workbench node pool, and a hybrid of
both) to be addable **without the business layer learning about them**. The obstacle was not a missing feature;
it was that "execution happens on the Windows devices registered with this City" existed only as the behaviour of
`services/dev-gateway/server.mjs`'s node routes. Adding the new resource there would have meant rewriting the
dispatch path at the same moment the new resource is introduced.

WBC-601 therefore freezes the **contract first** and binds today's behaviour to it:

```text
Shared Task Core (unchanged: canonical task truth, lease, idempotency)
        ↓
execution-backend-v1  (new contract: readiness, endpoints, dispatch, claim, report, control)
        ↓
STANDARD_DEVICES backend  (the existing Alien/Mech Windows path, relocated not redesigned)
        ↓
current accepted behaviour  (proved equivalent — §4)
```

The contract is a **port, not a scheduler**. A backend does not own task state; it answers six bounded
questions. `WORKER_POOL` / `HYBRID` exist as *names* so a future switch has a fixed target, and are deliberately
not enabled.

## 3. Locked decisions (problem → choice → why)

**D1 — Where the seam lives.**
Problem: the port could be a new abstraction layer above the routes, or the routes could be relocated behind it.
Choice: relocate the two decision-bearing routes (`node/claim`, `node/report`) into the backend, and keep
`register`/`heartbeat` in the gateway because they are about **liveness**, not about execution dispatch.
Why: a seam that only *wraps* leaves two copies of the claim rule reachable, and the compatibility claim would
then rest on both copies agreeing forever. Relocating makes one implementation authoritative. Refusing to move
liveness keeps the change inside the task's stated boundary ("minimal backend interface/adapter", not "rewrite
the node protocol").

**D2 — Order of the claim guards.**
Problem: the frozen route evaluated `target && reservation && find(claimable)` and gated that on
`ready && !busy && sharing`.
Choice: apply the strict-target guard and the handoff-reservation guard **first**, then the endpoint's own
readiness/busy/sharing gate.
Why: the guards have different meanings. The target guard is a *safety* filter ("this task belongs to another
device and must not move"), so it must be evaluated even when the asking device is unhealthy — otherwise a
strict task could be reported as ordinary contention, or a task already reserved for a recovering device could be
offered to a healthy one. The frozen code happened to compute the same set, but only because `find(claimable)`
was never reached while busy; making the order explicit removes a coincidence the equivalence claim would
otherwise depend on.

**D3 — Is "busy" part of endpoint readiness?**
Problem: readiness could mean only "Core says this node accepts work", or it could also include "and it is free".
Choice: include busy, as `ENDPOINT_BUSY`, and additionally report a fleet that is *only* busy as `DEGRADED`
rather than `UNAVAILABLE`.
Why: `dispatch` places work too, and `dispatch` consults endpoint readiness. If readiness ignored busy, dispatch
would become a documented way around the one-task-per-device rule that `claim` enforces. Reported separately,
"all endpoints busy" means "an ordinary run is in flight", whereas calling that `UNAVAILABLE` would make a
working City look broken to a supervisor.

**D4 — Can a future profile be enabled by configuration?**
Problem: `CITY_EXECUTION_PROFILE=WORKER_POOL` could be accepted as a no-op, ignored silently, or refused.
Choice: refuse at startup with the supported set named; a `dormant` registration exists in the registry but
`active()` refuses it with `BACKEND_DORMANT`.
Why: a City that silently ran `STANDARD_DEVICES` while configured for `WORKER_POOL` would make every later claim
about which resource executed a run unverifiable — and silently falling back is precisely what the programme's
"no silent behaviour change" rule forbids. Enabling `WORKER_POOL`/`HYBRID` is WBC-603/604's work, so it must not
be reachable as a config toggle from here.

**D5 — `STANDARD_DEVICES` enable/disable.**
Choice: registered unconditionally, `mode: enabled`, not configurable.
Why: it is the hard compatibility invariant (`NO_WORKBENCH_REGRESSION`) and the path the product already runs
on. A migration that could switch its own baseline off by configuration could be made to fail that invariant
without any code being wrong.

**D6 — Does the seam add a startup dependency?**
Choice: no. `readiness()` never throws (a probe failure is `UNKNOWN`, not an exception), the backend is a plain
in-process object, and the execution component is reported on `/health` but **excluded from the degraded
calculation**.
Why: "no device is online at this instant" is a normal state of a peer-to-peer City. Folding it into `degraded`
would recreate exactly the class of global blocker this programme forbids. The word is still reported, so nothing
is hidden — only the *gateway's* health verdict is kept about the gateway.

**D7 — What the backend exposes to surfaces.**
Choice: the City status payload carries `executionBackend` (profile + backend descriptor + registered list). No
new UI control.
Why: chat prose and dashboards are not claim locks, but "which resource placed this run" must be *checkable* for
the future "the pool did it" claims to be auditable. A descriptor is observable without granting any authority
over placement.

**D8 — Test structure.**
Choice: contract conformance in `contracts/execution-backend-v1/tests/`, backend behaviour and the gateway
equivalence proof in root `tests/` (discovered by the existing `node --test tests/*.test.mjs`).
Why: matches how every other contract in this repository is verified, and keeps `pnpm test` (the CI gate) as the
single entry point.

---

## 4. What changed

| File | Nature |
|---|---|
| `contracts/execution-backend-v1/execution-backend.mjs` | **new** — the versioned port, profiles, readiness vocabulary, typed refusals, backend registry |
| `contracts/execution-backend-v1/index.mjs` | **new** — public surface |
| `contracts/execution-backend-v1/tests/conformance.test.mjs` | **new** — contract conformance (7 tests) |
| `services/dev-gateway/execution-backend/standard-devices.mjs` | **new** — the `STANDARD_DEVICES` implementation |
| `services/dev-gateway/execution-backend/index.mjs` | **new** — implementations surface |
| `services/dev-gateway/server.mjs` | **modified** — imports; backend construction + registry; `node/claim` and `node/report` delegate to the port; `execution` component on `/health`; `executionBackend` on the City status payload; `executionProfile`/`executionBackends` returned for tests and diagnostics |
| `tests/wbc601-standard-devices-backend.test.mjs` | **new** — backend behaviour + differential guards (8 tests) |
| `tests/wbc601-gateway-equivalence.test.mjs` | **new** — live-gateway equivalence (4 tests) |
| `docs/{en,zh-CN}/EXECUTION_BACKEND_STANDARD_DEVICES.md` | **new** — paired capability documentation |

Nothing was rewritten: no task schema, no targeting rule, no pairing/enrollment path, no UI, no second task
store, no second scheduler. The diff inside `server.mjs` is a relocation of two route bodies plus additive
reporting.

### Behaviour-equivalence argument (workbook Step 4)

| Workbook requirement | Where it is proved |
|---|---|
| old untargeted task path unchanged | `tests/wbc601-gateway-equivalence.test.mjs` (real HTTP claim → ASSIGNED; port reaches the same task over the live store) |
| Alien strict target unchanged | same file: a strict task aimed at `Mech-Win` is withheld from `Alien-Win` with `heldFor=Mech-Win` |
| Mech strict target unchanged | same file: the port, asked by `Mech-Win`, takes exactly that strict task |
| offline/unknown strict target remains fail-honest | same file: after a gateway restart with `Mech-Win` offline, the online device receives `task: null` + `withheld` and the strict task stays `QUEUED`/unassigned; unknown target still refused at creation (unchanged route) |
| Android/Web control path unchanged | untouched code paths; `pnpm test` full-suite result in §6 shows no new failure outside the pre-existing environmental block |
| Workbench absent has no startup/readiness penalty | same file: the City serves, executes and reports with no pool backend present; `/health` stays `healthy` while `execution.state=UNAVAILABLE` |

The differential assertions compare the port's verdict against `acceptsWork(...)` (the Core), `claimAllowedByTarget`
and `withheldTasks` (the frozen MESH-301 guards) **called directly** in the test, so the test cannot pass by
agreeing with a wrong copy of the rule.

## 5. Test evidence (all on this branch head; commands reproducible)

```text
node --test contracts/execution-backend-v1/tests/conformance.test.mjs
  7 tests / 7 pass / 0 fail

node --test tests/wbc601-standard-devices-backend.test.mjs
  8 tests / 8 pass / 0 fail

node --test tests/wbc601-gateway-equivalence.test.mjs
  4 tests / 4 pass / 0 fail

node --test tests/gateway.test.mjs          (pre-existing gateway suite, unchanged file)
  4 tests / 4 pass / 0 fail

pnpm test                                    (full root suite)
  1219 tests / 1216 pass / 3 fail   <- all 3 failures are the pre-existing environmental block, §6

node --test apps/rooms/tests/*.test.mjs
  69 tests / 69 pass / 0 fail

node city/test-all.mjs
  1984 tests / 1977 pass / 7 skipped / 0 fail

node scripts/check-bilingual.mjs
  docs: PAIR_STATUS = SYNCHRONIZED; evidence: SYNCHRONIZED; data-records: SYNCHRONIZED

node scripts/verify-promotion-history.mjs
  10 record(s) verified against local Git history at 612c344f9f2b
```

## 6. Honest failure classification — the 3 remaining root-suite failures

All three failures are in `tests/host-city-launcher.test.mjs` and **none of them is in a path this task
touched**. They are caused by a **resident City already running on this machine**, which is a pre-existing
property of the host and not of this branch:

```text
port 4389 (the fixed host coordination port, services/dev-gateway/host-city.mjs HOST_CITY_PORT)
  GET http://127.0.0.1:4389/  ->  200
  {"kind":"utopia-city-host-v1","state":"ONLINE","gatewayPid":21452,
   "endpoint":"http://172.31.12.151:4391","cityId":"031fdba6-e94c-4298-a095-6ff04a65481d", ...}
```

* test 1 fails at its own first line: `readHostCity()` succeeds, and the test then refuses to run by design
  ("Host integration requires a free coordination port; refusing to disturb an active City");
* test 3 fails at the same guard ("Requires a free local host reservation");
* test 2 fails because the launcher it starts cannot bind its own City while the reservation is held.

The file is **byte-identical to the baseline** (`git diff 612c344f… -- tests/host-city-launcher.test.mjs` is
empty), and these tests are excluded from the hosted CI verdict in the sense that CI runs on a clean runner with
no resident City. Classified as `ENVIRONMENTAL_PRE_EXISTING`, not as a WBC-601 defect. This session did **not**
stop the resident City: it is not mine to stop, and §4/§12 forbid disturbing another host's claim surface for
test convenience. Consequence for the reviewer: run the suite on a machine (or state) with no resident City if
you want a fully green local board; the three tests are unrelated to this change.

## 7. Capability Exposure Decision (`CONSTRUCTION_RULES.md` §14A)

```text
user_exposure_class    = INTERNAL_ONLY
user_exposure_surface  = NONE (dispatch seam); the active profile is published read-only on the City status payload
user_exposure_nesting  = NONE_INTERNAL
backend_wiring         = VERIFIED (claim/report are the real canonical transitions; health/City report the live
                         backend's readiness from the same registry the routes use)
ui_exemption_reason    = An execution backend is a dispatch transport, not a user action: there is nothing to
                         start, stop, choose or approve, and no user-visible failure mode that a device's own
                         availability does not already express. It is the equivalent of a transport frame codec
                         or a heartbeat. Per §14A.4 this is checked against the "affects routing/device choice/
                         cost/trust" list: it does NOT choose a device (the strict target and the shared-work
                         gate do), does NOT change trust, cost or privacy, and does NOT decide placement policy.
                         The one piece of information a user could reasonably want — which execution profile
                         placed the run — is therefore still exposed as an OBSERVABLE fact on the status payload,
                         which is what makes a future "the pool did it" claim auditable rather than a matter of
                         prose. A visible control was deliberately NOT added: a button that switched profiles
                         would be a false affordance until WORKER_POOL exists (WORKER_POOL and HYBRID are
                         registered as names only, and the registry refuses to serve from a dormant backend).
```

## 8. Completion status and what is NOT claimed

Met on the development side:

1. execution backend seam exists — `contracts/execution-backend-v1`;
2. the current path is explicitly bound as `STANDARD_DEVICES` — `services/dev-gateway/execution-backend/standard-devices.mjs`;
3. `STANDARD_DEVICES` is the default and cannot be disabled;
4. no Workbench present: startup and task flow unchanged (equivalence test);
5. strict target does not regress (equivalence test + differential guards);
6. exact-head required CI green — recorded after push (§9);
7. terminal marker `EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED` — **development side only**.

NOT claimed:

* **Opposite-host Formal Review is PENDING.** This session runs on the Mech host only; `CONSTRUCTION_RULES.md`
  §3 requires a different physical host for Formal Review, and a same-host critic may not stand in for it. The
  workbook's own `review_host`/`review_complete` fields are therefore left untouched.
* `WORKER_POOL` / `HYBRID` are **not** enabled and were not implemented (WBC-603/604, dependency-locked).
* No performance or multi-host claim: all evidence above is single-host, in-process and HTTP-loopback.

## 9. Head and CI (final)

```text
development_head_sha   d65dbd3af2d8903aca13726f74110e1f2f6b9b65
development_ci         V0.2 checks run 37205291447  completed / success  on headSha d65dbd3af2d8903aca13726f74110e1f2f6b9b65
                       jobs: gateway-web success, android success
superseded head        9f9db6384779e75f51ec317074238c139e1de609  -> run 37204673910 FAILED gateway-web (§10)
```

The report was committed **before** the CI results existed on purpose: the head CI verifies must contain this
report, so the run ids are recorded in the workbook frontmatter afterwards rather than inside a file that would
then change the head it describes. The failed run above is kept in the record; it is not overwritten by the
later success, because "which head was green" and "what went wrong first" are different facts.

## 10. Defect found by hosted CI, and its repair (development iteration)

**CI run 37204673910 on head `9f9db6384779e75f51ec317074238c139e1de609` → gateway-web FAILED.**
The failure was **mine**, in a test I had just written, and it is recorded here rather than quietly fixed:

```text
✖ tests/wbc601-gateway-equivalence.test.mjs:68
  a City with no Workbench starts, serves and executes: the seam adds no startup dependency
  AssertionError: a City whose devices are offline is not a degraded gateway
    actual 'degraded'   expected 'healthy'
```

**What actually happened.** I asserted the literal word `healthy` for `/health`, which the pre-seam gateway
computed from `gateway` **and** `rooms`. On this developer machine a resident City is serving a Rooms hub, so
`rooms.state === 'READY'` and the word was `healthy`; on the clean CI runner the Rooms hub is unreachable, so the
same code correctly answers `degraded`. The product was right in both places — **my assertion had hard-coded the
environment**, and the property I actually needed to pin (the execution backend must not enter the degraded
calculation) was never being asserted at all: with Rooms already degraded, `status==='degraded'` would have passed
for the wrong reason.

**Repair.** The test now recomputes the verdict from the two components the pre-seam gateway used and asserts the
*relation*:

```js
const degradedNow = health.components.gateway.state !== 'READY' || health.components.rooms.state !== 'READY';
assert.equal(health.status, degradedNow ? 'degraded' : 'healthy', 'a City whose devices are offline is not a degraded gateway');
```

**Both environments re-measured after the repair** (not just the convenient one):

```text
CITY_ROOMS_DISABLED=1  node --test tests/wbc601-gateway-equivalence.test.mjs   4 pass / 0 fail   (the CI-like case)
(default)              node --test tests/wbc601-gateway-equivalence.test.mjs   4 pass / 0 fail   (the local case)
```

**Why this is worth keeping in the record.** It is a concrete instance of the rule that a local PASS cannot
stand in for hosted CI, and of a failure mode this programme explicitly watches for: a test that passes because
it *restated* the environment instead of asserting the contract. The relocating seam itself was never implicated
— the equivalence tests that compare the port against the live route and the frozen guards passed on the failed
run and were unchanged by the repair.

