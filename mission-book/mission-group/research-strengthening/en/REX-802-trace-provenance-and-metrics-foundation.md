# REX-802 — Trace / Provenance / Metrics Foundation

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../REX-802-trace-provenance-and-metrics-foundation.md). Source workbook/report controls state, claims, SHA, CI, and gates.
>
> [Persistent rules](../../../CONSTRUCTION_RULES.md) · [Research material](RESEARCH_EVIDENCE_PROTOCOL.md)

## Objective

Create unified Research Trace binding existing canonical truth through provenance. Minimum coverage: experiment/run; task/action; device/node; provider/model/channel when present; route/handoff; retry/backoff; failure; recovery; Owner intervention; timing; resource observations; Git/config refs; research signal/grade snapshot; authority surface/truth source; task eligibility/zero-claim classification; wake condition/event/rescan reason; exact implementation/review/CI/evidence identity; Registry state for capability work; user reachability/intent for user capabilities; Owner-intervention taxonomy; transition count; autonomous span until intervention.

## G3/G4 trace priorities

Support longitudinal questions first rather than generic telemetry alone:

1. **Autonomy survival:** autonomous run start, successful transitions, first required Owner intervention, reason, pool drained/blocked/interrupted.
2. **Dynamic liveness:** eligibility, TEMPORARILY_UNCLAIMABLE / STRUCTURALLY_INELIGIBLE / GLOBAL_EXTERNAL_BLOCK / POOL_TERMINAL, wake trigger, bounded rescan, no-idle switch.
3. **Reality drift:** Mission Book, Registry, Git exact state, CI/review evidence, observed runtime/UI, mismatch/reconciliation.
4. **Exact continuation:** predecessor/successor Agent/model/host, exact SHA/dependency truth, handoff artifact, resumed next action, rediscovery/repeated-work signals.
5. **Rule lifecycle/governance debt:** rule/section ID plus exact City rule SHA, introducing failure, supersession/conflict/retirement, false blocking/stale guidance, observed task where rules changed outcomes.
6. **Owner attention/escalation quality:** category, batchable/avoidable, bounded diagnosis before escalation, repeated root cause, escalation→autonomy-resumed duration.
7. **Semantic integration:** accepted source SHAs, integration SHA, component CI/review, invariant violation after clean merge, Registry/runtime/user-intent drift.

Missing fields use NOT_OBSERVABLE + reason, never 0.

## Hard rules

Never duplicate canonical task/action truth. Trace references, never rewrites product state. Record clock source/timestamp semantics. Missing measurement is unknown, never zero. Raw→normalized transformation must be reviewable.

## User exposure

OBSERVABLE_ADVANCED. Users see what is recorded, current run, failures, metric availability, provenance, trace completeness/missing fields. Collapse raw IDs into Technical Details.

## Review

Independently create missing, duplicate, out-of-order events, stale clocks, restart, partial traces, and collector failure. Prove collector failure does not stall product operation.

## Completion gate

Trace schema, collector, normalized view, user observability, Review/CI/material index all satisfied.

## Review conclusion (Mech, opposite physical host)

Formal Review PASS: `mission-book/reports/REX-802/REVIEW_REPORT.md`. Eleven independent probes deliberately created every required condition and used never-returning storage to prove no product-execution barrier. Author tests reran unchanged. Four nonblocking findings remain unrepaired: F1 LOW completeness is PARTIAL for all gateway-produced records but COMPLETE for an empty collector; explanation exists only in collapsed raw JSON. F2 LOW snapshot runId after restart overlays a window still containing previous-epoch records. F3 LOW control-plane: eight missing template fields, including all four capability fields, backfilled from existing CAP-RESEARCH-TRACE-001 and reconciled FORMAL_REVIEW_RECONCILED. F4 LOW test fidelity: Android tests replace android.jar with org.json:json; JSON-null optString semantics differ, so the effective device-side "null" guard is correct but uncovered. A delegated instrument called it dead code based on the test jar; recorded INVALID_INSTRUMENT, inapplicable to shipped app. Full-regression failures classified individually: three environmental, one also fails baseline, one load-sensitive jitter, two caused by reviewer-browser suite load. No physical UI rendering or experiment/provider/model/autonomy observed; no performance claim. Android live rendering remains NOT_RUN.
