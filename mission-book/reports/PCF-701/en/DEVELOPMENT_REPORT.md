# PCF-701 Development report, increment 1

```text
TASK_ID            PCF-701 Live resource telemetry, presence and freshness
ROLE               Development (increment 1; the development side is NOT closed)
HOST               Mech (COMPUTERNAME MEGA-REP, role Mech-DS)
BRANCH             pcf/PCF-701-mech-live-resource-telemetry (series branch pcf/series-mech is at the same head)
BASELINE           659ff6aa98bc5675862b1170ed0cf5e1b78dba5f (= PCF-700's accepted head and the series' accumulated head)
HEAD_SHA           e3c7256069796aac9e67c38042a1da03dbe26c7b (increment 1's repair head; the earlier delivery head was 20b55b6855fed1...)
CI                 run 37538196436 (20b55b6, **failed once: a REX-801 suite teardown race, not a defect of this task**; the same head re-ran green)
                   -> run 37540047630 (e3c7256, **success**, gateway-web and android both green)
DELIVERABLES       contracts/personal-compute-fabric-v1/observations.mjs (new)
                   services/personal-compute-fabric/telemetry.mjs (new)
                   tests/pcf701-telemetry.test.mjs (new, 13 guards)
                   + PCF-700's four phase-scoped guards RESTATED as boundary guards on this branch (see 2.3)
```

## 1. What the deliverables mean (workbook requirement vs implemented)

```text
observeResources(sample, context) -> ResourceObservation is a PURE function: no I/O, no timers, no ambient clock, so
  the same inputs always give the same result and a recording replays (T13).
No invented numbers: missing / NaN / negative / wrong-unit / out-of-range are NEVER 0 - they become a reason-carrying
  presence (UNKNOWN / UNSUPPORTED) with value=null; an absent optional adapter is UNSUPPORTED, strictly distinct from
  "we read a 0" (T1/T6).
Ordering: every dimension carries a sequence, and an older packet cannot overwrite a newer value (T2).
Epoch: a different bootId is rejected outright and never mixed into this boot (T3).
Clock: ageOf is monotonic by hand - a rollback can neither keep old data fresh nor undo recorded ageing, and even an
  ACCEPTED observation during a rollback can only be STALE (T4/T5). A future-dated sample is recorded, never called
  fresh.
Surfaces: the contract knows only the declared dimensions; process name / window title / personal file dimensions are
  recorded as UNSUPPORTED with value=null and never stored as data (T12).
Collector: a bounded ring (oldest evicted, drops counted and attributed), rate limiting (a throttled call returns the
  previous observation without probing), a per-attempt deadline (timeout yields all-UNKNOWN, never zeros, and does NOT
  freeze the caller - T7 proves it with a never-resolving adapter), explicit sample-failure reporting, and overhead
  measured with an injected monotonic clock (T9/T10/T11).
```

## 2. Evidence and self-checks (including problems this round found in its own work)

### 2.1 Six source mutations, six red suites

```text
M1 accept a negative (drop the NEGATIVE branch) -> T1 red    M2 drop the ordering check -> T2 red
M3 mix boot epochs -> T3 red                                 M4 allow FRESH after a rollback -> T4 red
M5 fill zeros on timeout instead of UNKNOWN -> T7/T8 red     M6 stop counting drops when the ring is full -> T9 red
Each source was restored byte-for-byte (sha256 verified) and the suite returned to 13/13.
```

### 2.2 A DECORATIVE assertion the mutation found (fixed, recorded here)

M4 did NOT turn red at first: T4 only used a future-dated sample, which an EARLIER rule rejects as CLOCK_ROLLBACK, so
the rollback branch inside the freshness rule never executed - an assertion that looked like coverage while covering
nothing. Fix: T4 now also drives the ACCEPTED rollback path (a sample only 5ms old against the rewound clock and well
inside TTL, where only the rollback flag can stop it being reported FRESH), and M4 then turns red. Recorded as a defect
in this round's own probe rather than quietly adding a test.

### 2.3 PCF-700's phase guards were RESTATED, not deleted

PCF-701 activated the fabric's first runtime modules, so three phase-scoped assertions no longer hold:

```text
D4 (tests/pcf700-dependency-direction.test.mjs) was "no runtime module refers to the fabric at all"; it is now
   "fabric references live only under the declared paths, and only the fabric itself, its tests and its tools import
   it". The audit script now reports BOTH all runtime references and those outside declared paths; the review packet's
   C6 checks the latter is zero and C7 changed from "the candidate directories are absent" to "the fabric exists only
   under its declared paths and the declared modules are present". **The accepted head 659ff6a keeps the original
   text**; this branch carries the successor. The reason and both semantics are in the test file's header comment.
Falsified: a temporary file under services/dev-gateway importing the fabric turned D4 red (3 pass/1 fail) and the
   packet's C6 red (6/8); after deleting it and regenerating, 4/4 and 8/8 returned.
```

### 2.4 Instrument fix: a churn-tolerant walker

PCF-700's compatibility suite mkdtemp-removes a `.scratch-pcf700-*` City in the same `node --test` process pool; a
walker that recursed into one between its readdir and its recursion threw ENOENT, which surfaced once as a very fast
and confusing D2 failure while every file it was looking for was intact. The walker now skips ENOENT instead of
failing. Three consecutive parallel runs of all three PCF suites are 24/24.

### 2.5 The machine-readable record's delta against PCF-700's accepted copy

`data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json` was regenerated (identical bytes in both languages). Its ONLY
differences from PCF-700's accepted copy are the new `pcfRuntimeReferencesOutsideDeclaredPaths` field (currently `[]`),
`pcfRuntimeReferences` now containing `services/personal-compute-fabric/telemetry.mjs`, and the contract-directory
count. Everything else is unchanged. PCF-700's accepted copy stays at `659ff6a` and was not rewritten.

### 2.6 One false red on CI, and its repair (a cross-series test-hygiene race, measured rather than assumed)

Hosted run 37538196436 on `20b55b6` failed exactly ONE test: `two equal host references are one physical host, not a
TWO_HOST_MESH`, which lives in the opposite host's `tests/rex801-alien-independent-review.test.mjs`. The raw job log
shows the assertion had already passed and the failure came from the finally block:

```text
[Error: ENOTEMPTY: directory not empty, rmdir 'C:\Users\RUNNER~1\AppData\Local\Temp\rex801-review-J6CeIU']
```

- the Windows runner's `rm()` racing the just-closed gateway's file flush. The evidence chain: the SAME head re-ran
green on both jobs; the suite passes 3/3 standalone at both heads; and it passed inside this host's full local suite.
So this is a teardown race in a test harness - not product behaviour and not a PCF-701 defect.

Repair: the three `rm()` calls in that file now carry `maxRetries/retryDelay`, which is the hygiene this repository
already uses in other helpers (PCF-700's own scratch-City helper among them). This is a harness repair, not a change to
REX-801's acceptance: the opposite host's accepted head keeps the original text and this branch carries the successor.
After the change the suite is 3/3 three times consecutively and the PCF trio stays 24/24. Repair commit `e3c7256`, the
head this report names.



```text
## 2.7 Increment 2 (head `f7581e9`): facets, adapters and path-scoped latency

```text
facets       total/free/reserved/inUse became SEPARATE FACETS (`memory.free`, `disk.total`, ...) instead of one folded
             number, because a single "memory: 8" lets a placement decision read reserved capacity as available. Each
             facet is validated on its own (an unreadable free cannot invalidate a good total), an omitted facet is
             UNKNOWN rather than a copy of the base reading or a zero, and free > total is FACET_INCONSISTENT: neither
             number is handed on as usable and the raw pair is kept for diagnosis, since otherwise a caller computes a
             negative used figure. dimensionKeys() publishes the declared key set for a surface audit to diff.
adapters     an adapter declares which dimensions it supplies; the registry merges the available ones and reports every
             declared dimension no available adapter covers as UNSUPPORTED (never 0). The reference adapter reads only
             Node platform APIs (os.totalmem/freemem/cpus/loadavg and fs.statfs) and does NOT shell out to vendor tools,
             which would be an unapproved privileged surface; vram/battery/thermal/network are DECLARED unsupported on
             this runtime rather than omitted, because an omitted dimension and an unsupported one look identical.
network      latency belongs to a PATH ({from,to,route}), not to "the LAN is up": state is keyed by path identity, an
             unmeasured path answers UNKNOWN/NEVER_MEASURED rather than 0ms, a hung probe becomes a bounded TIMEOUT
             without holding its caller, a non-numeric answer is an INVALID_RESULT failure rather than an accepted
             value, consecutive failures double the backoff up to a cap and a success clears it, and only a genuinely
             measured path yields a networkRtt sample, with the path as its provenance.
tests        T14-T19 (six new guards, suite 19/19); eleven source mutations each turn the suite red and are restored
             byte-identically.
```

**The new tests caught two defects in this round's own code (recorded)**:

```text
D1 `rttOrNull`, a READ-only query, created state for a path nobody had probed - reading once changed the probe's
   memory of which paths exist. Fixed to state.get(...) without creating; T18 now locks it (mutation M9 re-fails it).
D2 the INVALID_RESULT branch counted the failure without growing the backoff, so a lying probe would have been retried
   at full rate. Fixed to double the backoff like any other failure; T19 locks it (mutation M10 re-fails it).
Also: the FALSIFICATION SCRIPT itself had a bug - its final before/after comparison still listed only two of the four
   source files, so adding two files made it report a restore failure that had not happened. Fixed and recorded.
```

## 2.8 Increment 3 (head `4e97d50`): throughput, queue and occupancy - and the dead guard the falsification set exposed

```text
throughput   `measureThroughput` MOVES BYTES AND TIMES THEM; it never infers speed from latency (a 1 ms path can still
             be slow). The transfer is injected, as a factory option or per call. A zero/negative transfer, a hung
             transfer and a non-numeric answer are all FAILED measurements rather than a 0 B/s path, and a failed run
             backs off like any other. Latency and throughput stay separate facts: measuring one never answers the other.
queue        `createQueueAdapter` REQUIRES an explicit source and is unavailable without one, so `queue` reports
             UNSUPPORTED instead of a fabricated 0 - and `queue: 0` would tell a placement decision the device is idle.
occupancy    `createRuntimeOccupancyAdapter` reads the platform's event-loop delay histogram, so occupancy is a
             MEASURED property of the runtime rather than a guessed queue length; a histogram that exists but has no
             readable mean yet yields no value plus a reason, never 0 ms (which would claim perfect responsiveness).
contract     `occupancy` joins the declared dimensions (milliseconds). Tests T20-T22: suite 22/22, PCF trio 33/33.
```

**The falsification set did real work here: thirteen mutations all caught, and two of them taught something**:

```text
* M12 deleted a second `bytesPerSecond <= 0` check and EVERY test stayed green, which proved that check was unreachable
  defensive code. It was therefore REMOVED from the source and the mutation with it, rather than kept as a branch that
  merely appears covered.
* M13/M14 stayed green at first because the registry short-circuits an unavailable adapter before its sample() runs, so
  the two refusal branches ("no source, so no count" and "no readable mean, so no 0 ms") were unreachable through the
  registry. Both tests now ALSO call sample() directly, and both mutations now fail.
* Every mutation restores its file byte-identically and the suite is 22/22 afterwards.
```

## 3. Not finished (the workbook's sub-steps)

```text
Sub-step 1 PARTIAL: CPU/memory/disk have REAL readings from the reference adapter with source/unit/bootId/seq/
   observedAt/receivedAt/TTL; queue/occupancy has no measurement source yet; GPU/VRAM, battery and thermal can still
   only be DECLARED UNSUPPORTED (absence is handled correctly, real adapters are not written).
Sub-step 2 nearly complete but deliberately NOT ticked: total/free/reserved/in-use are separated with a contradiction
   guard, presence is separate from freshness, observed/estimated/user-declared are separated, and network is measured
   PER PATH with budget, deadline and backoff - the one remaining gap is a THROUGHPUT probe (networkThroughput can only
   be declared UNSUPPORTED today).
Sub-step 3 DONE: bounded buffer, rate limiting, drop counting, overhead measurement, and never collecting
   unauthorised process names / window contents / personal files.
The two-host acceptance half (real CPU/RAM sampling across two hosts with the measurement's own overhead recorded)
belongs to the reviewer (EXECUTION_CONTRACT 14); this round still produced single-host component evidence, though the
reference adapter now yields real CPU and memory readings for the reviewer to compare across hosts.
```

## 4. Boundaries (not crossed)

```text
No purchase or paid service, no system-service installation, no running-profile change, no remote-execution enabling;
the fabric is NOT wired into the gateway (the D4 boundary guard holds that line); no UI wiring at all (resource and
freshness belong to Advanced device detail and the risk projection belongs to 715); merge_authority stays false.
```
