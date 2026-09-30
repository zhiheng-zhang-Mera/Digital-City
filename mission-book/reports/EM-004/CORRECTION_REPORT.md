# EM-004 Correction Report — Connector Capability / Probe / Auth / Instance Registry

```text
MISSION              = EM-004 (Engineering Manager programme, task 4 of 13)
PROGRAMME            = ENGINEERING_MANAGER_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/engineering-manager/EM-004-capability-probe-auth-registry.md
CLAIM_COMMIT         = 925dcd7 (Digital-City main, claim of EM-004 Correction by Alien)
CLAIMED_AT           = 2026-09-30T15:02:58Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 6e72536f40a310a3d1c36688ef0e4fe1352f1b72
DEVELOPMENT_CI       = 36723706236-success
CORRECTION_BRANCH    = engineering-manager/EM-004-capability-probe-auth-registry
CORRECTION_HEAD_SHA  = 1e2c0e1e8afd540d9140e878e0c6fd039d06f8ed
BRANCH_CI            = 36735453774 — gateway-web success, android success
LOCAL_CHECK_SUMMARY  = EM-004 20 pass, root 121 pass, rooms 69 pass, city 1801 pass,
                       promotion-history OK at 6e72536, bilingual SYNCHRONIZED
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true
```

## 1. Independent review method

Two reviews; the revision under review was exported to a byte-verified immutable path **before any
review began** and the reviewer imported only from that export:

```text
D:\A-Utopia\.runtime\evidence\mission-book\EM-004\frozen-6e72536\contracts\engineering-registry-v1\
  registry.mjs match=True   index.mjs match=True   tests/conformance.test.mjs match=True
```

Sixth use of this isolation. It again paid: the reviewer's D5 (a failed probe never invalidating the
record) and D6 (`probe.installed` validated but never read) are defects I had not found.

Findings are merged **by mechanism, not by reporter**. Repair was verified by replaying the original
reproductions (`alien-verify-repair.mjs` 42 checks, `alien-verify-repair2.mjs` 29 checks — 71/71 PASS),
not only by the new regression tests.

## 2. Confirmed defects, eleven, all repaired

| id | found by | severity | mechanism | repair |
| --- | --- | --- | --- | --- |
| P1 | both | **high** | no lower time bound: a future-dated probe is FRESH forever, and freshness gates usability and dispatch | two-sided freshness + `MAX_CLOCK_SKEW_MS` |
| P2 | reviewer | **high** | `ttl_ms` has `min` but no `max`, so an observation stayed authoritative for a century | ceiling + clamp |
| P3 | both | high | `key in spec` admits fields named after `Object.prototype` members at descriptor and instance level | `Object.hasOwn` + `Reflect.ownKeys` |
| P4 | reviewer | high | a failed/timed-out probe never invalidated the record: the instance stayed usable | failure stamped on the instance, blocks, cleared on success |
| P5 | me + reviewer | medium | raw material stored via a non-enumerable token field, or via a value under a benign/reference name | own-key scan + value-shape scan + reference grammar for exempt fields |
| P6 | reviewer | medium | `probe.installed` read by no decision: not-installed was fully usable | `NOT_INSTALLED` → NOT_READY |
| P7 | reviewer | medium | the probe source was shape-only, so self-declared evidence was indistinguishable from probed | evidence source travels with the answer |
| P8 | me + reviewer | medium | cyclic/over-deep records → untyped `RangeError` | cycle-safe scans + iterative depth bound |
| P9 | both | low/medium | a typed refusal named the wrong blocker (PROCESS_NOT_READY for an unhealthy process) | the code names the actual blocker; `HEALTH_NOT_READY` added |
| P10 | both | low | `snapshot().probe_failures` shared live objects, so a reader could rewrite the audit record | cloned and frozen |
| P11 | me | low | a partial probe update wiped the probe block, because `probe` lacked the null default its siblings had | consistent patch semantics + refusal of an empty patch |

### P1 / P2 — the freshness bound was one-sided in two places, and it gates execution

```text
observed_at 10 years ahead, ttl_ms 1:
  probeFreshness        -> FRESH
  capabilityOf          -> SUPPORTED
  usability             -> usable: true, blockers: []
  assertUsable          -> passes
  matchRequirements     -> matched: true
ttl_ms = MAX_SAFE_INTEGER, at now + 100 years -> FRESH (identical record with ttl 1000 -> STALE)
```

The workbook's acceptance line is "stale probe data is visible as stale and not silently healthy",
and here freshness is the gate for `capabilityOf`, `processReadiness`, `usability`, `assertUsable`
and `matchRequirements` — so this is not a bookkeeping defect but an unauthorised-dispatch defect:
a replayed or clock-skewed observation was silently healthy and authoritative. Repaired with a
two-sided comparison and a documented clock-skew tolerance, plus a ceiling on the ttl itself and a
clamp in `probeFreshness` so a record that bypassed validation still cannot claim an unbounded ttl.

### P4 — a failed probe left the instance looking healthy

`probeAll` recorded the failure globally and left the record alone, so an instance whose connector had
just stopped answering stayed `FRESH` and `usable`, and `assertUsable` authorised dispatch to it —
while the reviewer's probe showed the failure was visible only in the global list. The failure is now
stamped on the instance (`probe_failure`), appears as a blocker with its own code
(`PROBE_FAILED`/`PROBE_TIMEOUT`), blocks `assertUsable`, and is cleared by the next successful probe;
the full history remains in the snapshot.

### P6 / P7 — two observed facts that were never checked against anything

* `probe.installed` was validated and then read by no decision, so `installed: false` with
  `attachable: true` and `RUNNING` was fully usable. Two observed facts may not contradict each other:
  a connector whose probe says it is not installed is `NOT_READY`.
* `probe.source.kind` was never gated, so `CONFIGURED`/`USER_REPORTED` (self-declared) evidence was
  indistinguishable from `PROBED` in every answer. The evidence source now travels with the answer
  (`usability().evidence_source`, `probeEvidenceSource()`), so a caller cannot mistake a configured
  claim for an observed fact. Whether a non-observed source should *also* be refused for dispatch is
  recorded in §4.2 rather than decided here.

### P3 / P5 / P8 / P10 — the scan and copy classes, again

* `checkShape` used `key in spec`: the eighth contract in this programme with that hole, and the usual
  reason it survived — the author's strictness test uses a field name that is not an
  `Object.prototype` member. Own-key only now, with a `Reflect.ownKeys` scan.
* The key-name secret scan could be evaded by a non-enumerable own field, and it examined no values at
  all — while the acceptance line is that no raw credential material is stored. The scan is own-key
  complete, a value scan refuses well-known credential shapes anywhere, and an exempted
  `*_ref`/`*_handle`/`*_id` field must now hold something that looks like a reference rather than
  anything at all. The declared-but-never-raised `RAW_SECRET_FORBIDDEN` code is now what such a refusal
  throws.
* The scans recurse over attacker-controlled data with no visited set, so a cyclic capability manifest
  died with a codeless `RangeError`; now cycle-safe with an iterative depth bound.
* `[...probeFailures]` copied the array but not its entries, so a reader of the *auditable snapshot*
  could rewrite the registry's own failure record. Cloned and frozen.

### P9 / P11 — honest diagnosis and consistent patch semantics

* `assertUsable` derived its code from the blocker *category*, so an unhealthy-but-ready process was
  refused as `PROCESS_NOT_READY` while the message said `HEALTH_UNHEALTHY`. The code is now the
  blocker that applies, and the vocabulary gained the `HEALTH_NOT_READY` code it was missing rather
  than reusing an unrelated one.
* `updateProbe`'s `process`/`health`/`auth` defaulted to null ("no change") but `probe` did not, so a
  caller that observed only health had its whole probe block replaced by `undefined` and the update
  refused with a message about a field it never mentioned. Consistent defaults now — and a patch
  carrying none of the four facts is refused rather than reported as a successful no-op, so a probe
  that answered nothing cannot look like a probe that worked.

## 3. Reviewer claims reconciled

- **D2, D5, D6, D7 accepted and repaired** (as P2, P4, P6, P7). D5 and D6 are defects I had not found.
- **D11 (non-enumerable keys)** is the same mechanism as P3/P5 and is repaired once; the reviewer is
  right that `structuredClone` made the *stored* record accidentally safe, so the defect was the guard
  verdict rather than a stored secret — that distinction is kept.
- **D1, D3, D8, D9, D10** map to P3, P1, P8, P10 and §4.3 respectively.
- **Falsified suspicions recorded as negative results** so no later host re-spends the effort:
  prototype-preserving-clone smuggling, caller-object aliasing, handle-name lookup confusion,
  `{a: undefined}` vs `{a: null}` divergence, probe-minted capability manifests, and `Map` lookups
  being fooled by `toString`/`constructor`/`__proto__` instance names.
- **Correctly refused** (probed by both reviews): ordinary unknown fields, `__proto__` via JSON with no
  prototype pollution, duplicate `instance_ref` with no overwrite, undeclared connector kind,
  `updateProbe` half-application, descriptor `runtime_kind` mismatch, an absent clock failing closed to
  `UNKNOWN`, and the exact staleness ceiling.

## 4. Deliberate non-fixes and boundaries

1. **A transient probe timeout now blocks dispatch until a successful probe clears it.** This is the
   deliberate trade-off in P4: fail-closed is the right default for the flag that authorises execution,
   and the ttl still governs how long *successful* evidence stays usable. Recorded because the opposite
   reading — "the ttl exists precisely to absorb transient failures" — is also defensible, and the
   Owner may prefer it.
2. **A non-observed evidence source is surfaced, not refused.** `FACT_SOURCES` declares four legitimate
   kinds, and gating three of them out of dispatch would contradict the author's declared vocabulary;
   the acceptance lines do not say a configured capability must be refused. The answer now names the
   source, so the decision is visible to the caller and rulable by the Owner.
3. **Descriptor re-registration with the same `runtime_kind` but different content still overwrites**
   (the reviewer's D10). The call returns `updated: true`, so it is reported rather than silent, and
   refusing it would prevent legitimate descriptor revision, which the workbook does not forbid.
4. **`MAX_PROBE_TTL_MS` (24 h) and `MAX_CLOCK_SKEW_MS` (5 min) are choices, not derivations.** The
   workbook states no values; both are exported so they can be ruled on rather than buried. They are
   chosen to be far longer than any worker-instance registry needs and far shorter than a useful replay.
5. **A raw secret that is neither credential-shaped nor in a secret-named field remains
   undetectable.** Detecting arbitrary entropy would refuse legitimate text; the acceptance line is
   enforced against recognised credential shapes and secret-shaped names, which is what is claimed.
6. **No new error codes except `HEALTH_NOT_READY`.** Staleness, capability mismatch, auth, process and
   probe failures already had codes; the health case genuinely had none and reusing `PROCESS_NOT_READY`
   would have kept the false diagnosis.
7. **No Android device observation and no Computer-Use session.** The workbook authorises them if
   acceptance requires observation; EM-004 is a pure module with no device surface, so nothing was
   observed and Android Studio was not invoked.

## 5. Tests and CI

Author suite: **7/7 pass unchanged** — no author test encoded a defect. Suite extended **7 → 20 tests**;
every negative assertion has a legitimate neighbour that must still pass (a future-dated probe is
refused *and* an in-window skewed one is fresh; an unbounded ttl is refused *and* a real one is
accepted; a failed probe blocks *and* a successful one clears it; a not-installed probe is NOT_READY
*and* an installed running one is READY; a token in a reference field is refused *and* a real handle is
accepted).

Repair verification replays the original reproductions: **71/71 checks PASS** across two probes.

```text
node --test tests/*.test.mjs                -> 121 pass, 0 fail  (101 baseline + 20)
node --test apps/rooms/tests/*.test.mjs     ->  69 pass, 0 fail
node city/test-all.mjs                      -> 1801 pass, 0 fail (7 skipped)
node scripts/verify-promotion-history.mjs   -> OK (10 records at 6e72536)
node scripts/check-bilingual.mjs            -> docs/evidence/data-records SYNCHRONIZED
```

Implementation CI: **36735453774 — gateway-web success, android success** on
`engineering-manager/EM-004-capability-probe-auth-registry` @ `1e2c0e1`.

## 6. Unstated decisions (problem / choice / rationale)

1. **What a recorded probe failure means.** *Problem:* record it, or let the ttl absorb it? *Choice:*
   stamp it on the instance and block dispatch until a successful probe clears it. *Rationale:* the
   registry knows the connector just failed to answer, and the flag it feeds authorises execution;
   fail-closed is the honest default, and the history stays auditable so the transient case is visible.
2. **How long an observation may stay current.** *Choice:* 24 h ceiling, clamped in `probeFreshness` as
   well as validated. *Rationale:* a one-sided integer bound is not a bound; the clamp means a record
   that reached the function without validation still cannot claim an unbounded ttl.
3. **What the refusal code should name.** *Choice:* the blocker that applies, with a new
   `HEALTH_NOT_READY` rather than the unrelated `PROCESS_NOT_READY`. *Rationale:* the acceptance line is
   a *typed* refusal; a wrong type is a false diagnosis, and the vocabulary was simply missing this case.
4. **Reference exemption by name vs by value.** *Choice:* the exemption is now conditional on the value
   looking like a reference. *Rationale:* exempting `*_ref`/`*_handle`/`*_id` by name alone meant a raw
   token in such a field was never examined, which is exactly the acceptance line being broken.
5. **Cycles and depth.** *Choice:* an iterative depth bound (`MAX_RECORD_DEPTH = 32`) reported through
   the normal error channel. *Rationale:* the scans walk data, so depth is attacker-controlled, and an
   iterative check cannot itself overflow.
6. **`updateProbe` with no facts.** *Choice:* refuse. *Rationale:* otherwise a probe that answered
   nothing is reported as a successful probe, which is a false success in the one function whose job is
   to record what a probe observed.

## 7. Honest self-errors

- I hypothesised that an empty or mistyped `updateProbe` patch was a *silent success* and wrote a probe
  for it; the probe **falsified** that (the missing `probe` default wiped the block and validation
  refused it — fail-closed). I recorded the falsification rather than the hypothesis. The underlying
  inconsistency was real, and my own regression test later caught it from the other direction: a
  legitimate health-only patch was refused. So the defect is P11, and my first description of it was
  wrong in both severity and mechanism.
- Three of my own new test expectations were wrong before the code was: I asserted a 1-second-old
  sighting was stale in EM-003, and here I asserted that a client-visible clock returns an ISO instant
  (it returns milliseconds) and that `credential_ref`/`installation_ref` are valid `auth`/descriptor
  fields (they are not). Each was a test error, not a code error, and each is recorded because a test
  that fails for the wrong reason proves nothing.
- I did not find P2, P4, P6 or P7. P2 is the same one-sided-bound class I had already repaired three
  times in this session, one field over from the bound I did fix — a reminder to sweep the whole record
  for a bound whenever one instance of it is found.

## 8. Result

All eleven confirmed defects are repaired at the mechanism, with paired regression tests and a replay
of the original reproductions. No defect was closed by narrowing a test, no author test was rewritten,
and four boundaries (a blocking probe failure, non-observed evidence sources, descriptor overwrite, and
the two tolerance constants) are recorded with their reasoning rather than silently chosen. Nothing
about this task required device observation, so none was performed.

```text
CORRECTION_COMPLETE = true
CONTROL_BOOK_UPDATED = mission-book/engineering-manager/EM-004-capability-probe-auth-registry.md
```
