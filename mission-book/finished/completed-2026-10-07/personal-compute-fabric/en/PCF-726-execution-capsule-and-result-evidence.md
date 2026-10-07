# PCF-726 — Execution capsule and result/evidence envelope

**PARKED / DESIGN ONLY / NOT ACTIVATED.** Canonical state: [source](../PCF-726-execution-capsule-and-result-evidence.md). This reading copy has no claim authority.

[Shared execution contract](EXECUTION_CONTRACT.md) · [Migration history](MIGRATION_HISTORY.md)

Transfer03 extracts only the execution substrate of DGX-002 TaskCapsule/ResultEnvelope. DGX retains semantic decomposition, independence policy, domain disputes and adjudication.

Candidate files: `contracts/personal-compute-fabric-v1/execution-capsule.mjs` and `tests/pcf726-capsule.test.mjs`.

- [ ] `compileExecutionCapsule(canonicalRefs, approvedSpec)` preserves task/action, parent/stage/attempt, origin device and parent session, versioned fact/input refs, write scope, output schema, stop conditions, permission/budget/deadline and existing independence-policy refs. It is not another Task or ProblemGraph.
- [ ] `validateResultEnvelope(capsule, receipt)` correlates execution device, boot/provider/session, attempt/epoch, exit/outcome, bounded output, artifact digests, base/result SHA and validation evidence. Delivery or exit zero alone is not acceptance.
- [ ] Allow versioned domain assumptions, uncertainty and unresolved questions. Never require hidden chain-of-thought. Treat remote output as untrusted data, not new authority or instructions.
- [ ] Bound payloads, depth, logs and refs. Detect wrong host/session, stale epochs, fabricated/missing artifacts, cross-job correlation, duplicate/reordered events, expired consent and cross-user leakage.

Run `node --test tests/pcf726-capsule.test.mjs`, including legacy compatibility and thin DGX mapping. No dependency on activating DGX. Real transport/executor/caller integration belongs to703/727/728/724.
