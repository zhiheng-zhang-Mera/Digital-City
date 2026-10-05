# WBC-603 — REVIEW REPORT (opposite physical host)

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex
REVIEWED HEAD       f3510862cc348a99004ca5bd5d151a7b56279724
BRANCH              wbc/WBC-603-Alien-codex-worker-pool
DEPENDENCY UNIONS   WBC-601 accepted f66db60998343bf99243621cfcfa2363a4566db8 (review CI run 37208400707)
                    WBC-602 accepted d99101fdac5169aad74ae84fb7c0c25be43ad7d9 (review CI run 37211820065)
EXACT-HEAD CI       V0.2 checks run 37219829411 completed/success on the reviewed head
                    (jobs: gateway-web success, android success); PR22 pull-run 37219861813 success on the same
                    head; reciprocal-contract 37219861825 success
VERDICT             PASS
TERMINAL MARKER     WORKER_POOL_AGENT_SEAM_ACCEPTED released
```

## 1. How this review was performed (and how it was NOT)

The review re-read the two files that carry the behaviour (`services/dev-gateway/execution-backend/worker-pool.mjs`,
`services/headless-node-agent/agent.mjs`) and then attacked them with **seven probes written for this review**
(`tests/wbc603-mech-review-probes.test.mjs`), run against a **real gateway** rather than the author's fixtures. The
author's own suite was also run, unmodified, as a regression check.

```text
author suite (unmodified)   tests/wbc603-worker-pool.test.mjs + tests/wbc603-headless-agent.test.mjs
                            + tests/wbc601-gateway-equivalence.test.mjs + tests/wbc602-node-descriptor.test.mjs
                            -> 20 tests / 20 pass / 0 fail
review probes (new)         tests/wbc603-mech-review-probes.test.mjs -> 7 tests / 7 pass / 0 fail
```

Nothing in this report is inferred from the development report or from the PR description.

## 2. The author's modification to a WBC-601 test — accepted, and independently compensated

`tests/wbc601-gateway-equivalence.test.mjs` was changed in this commit:

```diff
-assert.deepEqual(app.executionBackends.profiles(), ['STANDARD_DEVICES']);
+assert.deepEqual(app.executionBackends.profiles(), ['STANDARD_DEVICES','WORKER_POOL']);
+assert.throws(()=>app.executionBackends.active('WORKER_POOL'),{code:'BACKEND_DORMANT'});
-assert.deepEqual(city.executionBackend.registered.map(e=>e.profile), ['STANDARD_DEVICES']);
+assert.deepEqual(city.executionBackend.registered.filter(e=>e.canExecute).map(e=>e.profile), ['STANDARD_DEVICES']);
+assert.equal(city.executionBackend.registered.find(e=>e.profile==='WORKER_POOL').mode,'dormant');
```

This is a **relaxation of an assertion, not a code fix**, and the rule that matters here is that a relaxed assertion
cannot itself prove the invariant it stopped checking. It is nonetheless **correct**: registering a backend in
`dormant` mode is exactly what this task is for, so the old assertion had to become "only one profile is
*executable*". To make that safe rather than merely plausible, PROBE A re-establishes the property independently of
the author's file:

```text
active()                                             -> standard-devices (mode enabled)
active('WORKER_POOL')                                -> BACKEND_DORMANT
active('HYBRID')                                     -> PROFILE_NOT_REGISTERED
every registered profile, asked for its active backend -> ['STANDARD_DEVICES:standard-devices',
                                                          'WORKER_POOL:BACKEND_DORMANT']
```

and then completes a real task end to end on a real registered node with the pool never constructed. If the
relaxation had hidden a regression, PROBE A would have failed.

## 3. Findings

### F1 — LOW / fail-closed but unrecoverable-without-operator: a failed `drain()` leaves the agent draining

**Observed:** when `node/descriptor` answers but carries no usable `sharingEnabled`, `drain()` sets
`draining = true` and **then** throws `SHARING_STATE_UNKNOWN`. The throw does not roll the flag back.

```text
await agent.drain()                 -> rejects SHARING_STATE_UNKNOWN
agent.status().draining             -> true      (the flag survives the failure)
agent.status().controlPending       -> false     (the control lock IS released, so a retry is possible)
await agent.runOne(...)             -> null      (the agent now refuses all work)
City sharing flag                   -> never changed (0 node/sharing calls)
await agent.resume()                -> draining=false (explicit recovery exists)
```

**Why this is reported rather than passed over:** the author's suite covers a *successful* drain and a
drain-then-resume, but not a **failed** drain, so this state transition was unmeasured. The direction of failure is
safe — the agent stops taking work rather than pretending to be healthy or leaving sharing half-changed — and the
control lock is released, so `resume()` restores it. But the agent advertises no reason for the condition beyond its
own internal flag, and nothing retries: an operator who never inspects `status()` sees a node that silently stops
accepting work.

**Minimum repair boundary (not required for this verdict):** either clear `draining` in a `catch` before rethrowing,
or record the failure on `status()` (for example `drainFailure: 'SHARING_STATE_UNKNOWN'`) so the condition is
observable. Both are inside the agent file; neither touches canonical task truth.

**Not a gate failure:** completion gate 4 asks that unavailable/crash/restart/drain be *fail-honest*, and refusing
work while reporting `draining: true` is honest. Recorded so the next task in this programme can decide whether the
state should also be self-describing.

### F2 — INFORMATIONAL: the `NOT_TASK_HOLDER` guard is the load-bearing one, not `memberRefs`

`pool.control()` checks both membership and canonical ownership. PROBE D drives the case that matters — two pool
members, `pool-b` holds the work, `pool-a` attempts to cancel it — and confirms `NOT_TASK_HOLDER` is refused **and
that canonical state is unchanged**. Recorded because the development report describes this as a repair ("Pool
control could cancel unrelated standard work; add canonical task lookup/holder guard"), and a repair claim deserves
an independent reproduction: it holds.

## 4. Completion gates, independently checked

| # | Gate | Verdict | Basis |
|---|---|---|---|
| 1 | dormant Worker Pool backend seam exists | PASS | module + registry entry; PROBE B/C |
| 2 | headless node agent contract exists | PASS | register/heartbeat/runOne/report/drain/resume/cancel/stop, injected transport |
| 3 | deterministic double completes bounded E2E | PASS | PROBE F (real gateway, one claim → one canonical assignment → COMPLETED) |
| 4 | unavailable/crash/restart/drain fail-honest | PASS (F1 recorded) | PROBE E + E2; typed refusals, no invented reports |
| 5 | STANDARD_DEVICES still fully runs with the pool absent | PASS | PROBE A |
| 6 | opposite-host Review PASS | **PASS (this report)** | seven independent probes + author suite |
| 7 | exact-head CI green | PASS | run 37219829411 success on the reviewed head |
| 8 | terminal marker | RELEASED | `WORKER_POOL_AGENT_SEAM_ACCEPTED` |

Additional invariants the workbook asks the reviewer to attack, and where each was decided:

```text
fake pool cannot drag STANDARD_DEVICES down   PROBE A/B: a dormant or unbound pool refuses by name and answers
                                              for no endpoints; the device path never consults it
agent is not a second task truth               PROBE F: no task collection, no mirrored state, one claim per
                                              assignment, held=null after completion
no hidden startup dependency                   PROBE A/C: the gateway starts and serves with no pool construction;
                                              WORKER_POOL cannot become active by naming it
cross-endpoint control abuse                   PROBE D: NOT_TASK_HOLDER, canonical state unchanged
transport failure / hang                       PROBE E: bounded typed timeout, no invented report, no stuck lock
```

## 5. What this review does NOT claim

* No real Workbench, Linux/macOS host, HA/failover or distributed cluster claim: every fixture here is one physical
  Windows host, exactly as the workbook requires it to stay.
* F1 is **not** repaired by this review, and it is not a condition of the PASS: it is recorded with its minimum
  repair boundary and left to the programme's discretion.
* This verdict covers only the reviewed head. A later head needs its own review; nothing here transfers to it.
