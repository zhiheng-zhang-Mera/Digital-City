# PCF-703 — Explicit pipeline offload and bounded streams

[Canonical state](../PCF-703-pipeline-offload-and-streams.md) · [Shared steps](EXECUTION_CONTRACT.md). PARKED translation.

Create proposed pipeline.mjs/stream-credit.mjs and tests/pcf703-offload.test.mjs. Reuse RF RPC/EVENT/STREAM transport and identity rather than creating new discovery or networking.

compileExecutionPlan accepts explicit versioned acyclic stages with input/output schemas, resources, permissions, side effects, deadlines, checkpoint support and placement. It does not ask an LLM to partition arbitrary programs. Use 704 reservations, 710 execution and 709 artifacts; preserve parent task/action and stage/attempt provenance.

openBoundedStream implements byte/item limits, credits, end-to-end backpressure, cancellation and explicit disconnection/partial-output handling. Poor economics, unstable links or missing authorization must result in an approved local path or typed refusal, never silent cloud/API escalation.

Run `node --test tests/pcf703-offload.test.mjs`: reject cycles/malformed stages; bound slow-consumer memory; cancellation prevents new downstream work; disconnect cannot publish partial output as success; revocation stops content transfer; empty/oversized inputs remain bounded. Execute real preprocess→compute→return across both Windows workers with measured bytes/time and unchanged task identity. Android remains a control surface, not simulated edge-compute evidence.

Deliver schemas, backpressure counters, stage provenance and real cross-host receipts. Additional stages require version and scope management for changed state, privilege or endpoints.

## 2026-10-07 specification revision 2

Use708/726 envelopes for explicit parent-task stages and bounded joins; reuse EM-010 rather than another DAG scheduler. Preserve parent/stage/attempt, input base SHA, write scopes and output digests. Test actual overlapping execution on Alien and Mech, not merely process startup or serial forwarding. Measure transfer, queue, execution and return separately. Semantic decomposition remains upstream.

See [migration and ownership](MIGRATION_HISTORY.md). This revision grants no execution, budget, remote access or merge authority.
