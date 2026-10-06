# MON-903 development evidence / 开发素材

Developer Mech (COMPUTERNAME `MEGA-REP`, role Mech-DS). Baseline `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef` (the
dependency union resolved literally: accepted MON-901 head `7eb38f1b930dfe6cc13dab0e17dedee467b1254b` is an ancestor of
main). Exact implementation `78bdd9dc873ebc257aedecf421068a1387dbec82`; branch `mon/MON-903-mech-decision-overlay`;
PR zhiheng-zhang-Mera/utopia#32. Opposite-host Formal Review PENDING (review_host Alien).

## Research object of this task

The question is not "can a monitor show decisions". It is: **can a control plane record a decision without becoming a
barrier, a second task truth, or an authority it was never granted** — and can it say honestly which of its own numbers
it cannot measure. Every design choice below exists to make one of those three failure modes impossible rather than
merely unlikely.

## Decisions and observations

- **Event-triggered, provably.** Seven canonical event types can produce a decision; a probe drives heartbeats,
  progress reports, a completion, a resource sample and a client connect through the real gateway and asserts the
  decision window stays EMPTY. "Ordinary work is not an approval" is therefore a measured property, not a slogan.
- **Rule-first, provably.** A probe counts resolver invocations: for a rule-resolved case the fast model and critic are
  never called. The programme's rule "能由 deterministic rule 解决的情况不得为了智能感调用模型" is enforced by test.
- **The owner boundary is a code path, not a prompt.** Scope change, merge gate, review readiness and owner-decision
  candidates escalate with `OWNER_BOUNDARY_KIND` and no resolver is consulted — asserted by counting invocations again.
- **Bounded resolver contract.** A resolver returns an action from a closed vocabulary, an optional confidence in
  `0..1`, and a reason ≤120 characters. Hanging, throwing, free-text and out-of-vocabulary outputs each become a typed
  fallback (`RESOLVER_TIMEOUT`, `RESOLVER_FAILED`, `RESOLVER_INVALID_OUTPUT`, `RESOLVER_NOT_CONFIGURED`) and escalate.
- **Per-task queues and no barrier.** Queues are keyed by task, depth-bounded at 16, parallel across tasks, and
  `observe()` is never awaited on the canonical event path. Two probes measure this: a saturated slow queue for one task
  while another task is decided, and a real-gateway run where an unrelated task completes end to end while a failing
  task's decision is being recorded.
- **Read-only by construction.** The overlay receives a task reader and no writer; every receipt carries
  `appliedBy: null`, `application: RECORDED_ONLY` and a stated reason. A probe asserts that a recorded
  `RETRY_RECOMMENDED` did not change the task, its error, or the task count.
- **Honest metrics.** `autoResolutionRate` is `null` with a reason when nothing has been recorded (never `0`);
  `unrelatedTaskBlocking` is reported as `ABSENT_BY_CONSTRUCTION` with its basis rather than as a fabricated zero;
  `unsupportedSources` names what the overlay cannot answer (wrong auto-decision, confidence-versus-review), because
  those need an independent judge and this overlay cannot judge itself.

## Quantitative observations

| Observation | Value | Evidence |
|---|---|---|
| Overlay probes | 8 pass / 0 fail | `utopia:tests/mon903-decision.test.mjs` |
| Real-gateway probes | 5 pass / 0 fail | `utopia:tests/mon903-decision-route.test.mjs` |
| Browser probes | 2 pass / 0 fail | `utopia:tests/mon903-decisions-web.test.mjs` |
| Dependency (MON-901) re-run | 8 pass / 0 fail | `tests/mon901-observation.test.mjs` |
| Whole `tests/` glob | 1365 tests, 1360 pass / 5 fail | all 5 classified inherited-environment |
| Decisions from ordinary activity | 0 | probe "ordinary City activity produces no decisions at all" |
| Resolver invocations for a rule case | 0 | probe "a deterministic rule resolves first..." |
| Decision latency / queue wait | measured per receipt; a mean is reported only over recorded decisions | receipt fields + `metrics()` |

No performance claim is made: the latency numbers are observed wall-clock values on one host and the resolvers are test
seams, not models.

## Failures and defects (kept, not cleaned up)

| Stage | Observed | Classification | Handling |
|---|---|---|---|
| Rule escalations | A rule that escalated through the non-boundary path was recorded as `ownerRequired: false` with no reason | PRODUCT DEFECT D-1, caught by this task's probe | Repaired; the branch honours the rule's escalation |
| Model stage | Every trigger was rule-resolvable, so the ladder's model/critic stages were unreachable dead code | PRODUCT/DESIGN DEFECT D-2, caught by the probe that tried to exercise a resolver | Repaired: an unexplained failure is genuinely uncertain and reaches the model |
| Wire protocol | The decision window's `schemaVersion: 1` overwrote the envelope's `0`, so every client rejected a 200 as a protocol mismatch | PRODUCT DEFECT D-3, caught by the browser probe | Repaired: the window is nested; both versions are asserted |
| Test harness | The unit helper deleted the receipt directory while a saturated queue was draining (`ENOTEMPTY`) | MEASUREMENT_DEFECT D-4 (harness) | Repaired; the product was right |
| Full-suite run | `relay-s1-tunnel` burst-rate assertion failed once under full load and passes 12/12 in isolation | ENVIRONMENT / LOAD FLAKE D-5 | Recorded, not hidden; it did not recur |
| Inherited environment | `capability-adapters`, `city-roads` (`CORRUPT_INPUT`); `host-city-launcher` ×3 (host reservation held by the resident City) | ENVIRONMENT / PRE-EXISTING | Identical at the baseline 213f9f9f |
| Adversarial self-test of this task | An unusable receipt store made `createGateway` throw, so the City never started (M-1); a closed overlay blamed the caller's trigger code (M-2) | PRODUCT DEFECTS, found by this task's own adversarial pass one round after reviewing a SIBLING module (REX-804) for the same class | Repaired with three regression probes (overlay level, City level, refusal code); the store now degrades to in-memory recording with a stated reason |
| Hosted CI on the hardened head | The push run failed once on `tests/pairing-search-web.test.mjs` (BLE bootstrap, 31.3s timeout) while the PR run of the same head passed | ENVIRONMENT / LOAD-SENSITIVE FLAKE D-9 | The same file passes 6/6 in isolation and inside the full local suite (1368 tests / 1363 pass), the file is untouched by the diff, and the rerun of the failed job succeeded on the identical head |
| Instrument flake frequency on this host | Two browser/time-sensitive failures across three tasks in one day (relay burst, BLE bootstrap), both passing in isolation and on rerun | MEASUREMENT/ENVIRONMENT, worth reporting as instrument reliability rather than as product quality | Recorded per task; no threshold or test was weakened to make either pass |

### Cross-task observation (worth a paragraph in the paper)

The same defect class - *a research-side storage problem turning into a City that will not boot* - was found in REX-804 by
the opposite-host review (finding B1) and then, one round later, in MON-903 by this task's own adversarial pass, written
by the same author who had just reviewed the sibling. That is evidence for a claim the programme cares about: a defect
class identified in one module does not automatically propagate to a sibling module written by the same host, but a
*deliberate adversarial pass over the same failure shape* does find it. The pass is cheap (five probes) and found two
defects; the reviewer's independent instruments remain a separate and still-unmet requirement.

## Research evidence applicability

```text
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
state_identity_evidence: CAPTURED
monitor_observability_evidence: CAPTURED
decision_trace_evidence: CAPTURED
```

`RS-G3-OWNER-INTERVENTION-TAXONOMY` (owner-required decisions carry a typed escalation reason and are surfaced first),
`RS-G3-PASSIVE-EVIDENCE-PIPELINE` (decision receipts are produced by ordinary City activity, not by a separate harness),
`RS-G4-REALITY-DRIFT` (this task found a control-plane drift of its own: a decision layer whose model stage could never
run, and a projection whose schema version overwrote the wire protocol), `RS-G3-DYNAMIC-LIVENESS`
(an unrelated task completes while another task's decision is pending — the no-barrier property measured, not asserted).
The workbook's `monitor_observability` and `decision_trace` evidence fields are captured in this task; highest grade
observed `G3_SPARSE_ACTIVE`, capture level `MAXIMUM_BOUNDED`.

## Not observable here (stated, not filled in)

```text
wrong auto-decision / repair                 needs an independent judge; NOT_OBSERVABLE from this overlay
confidence versus final review outcome       no resolver is configured in this City
model / provider identity                    a resolver is a seam, not an identified model
unrelated-task blocking COUNT in production  reported structurally (ABSENT_BY_CONSTRUCTION) with its basis
```

## Pending

Opposite-host Formal Review (review_host must be Alien). Hosted exact-head CI recorded when terminal. Android surface:
MON-903's exposure class is OBSERVABLE_ADVANCED on the Web control surface; no Android surface is claimed, and the
programme's Monitor work assigns cross-device acceptance to MON-990. `merge_authority: false`.
