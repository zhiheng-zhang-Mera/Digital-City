# PCF-708 — Workload envelope, QoS and retry semantics

[Canonical state](../PCF-708-workload-envelope-and-qos.md) · [Shared steps](./EXECUTION_CONTRACT.md). PARKED translation.

Propose contracts/personal-compute-fabric-v1/workload.mjs and tests/pcf708-workload.test.mjs. normalizeWorkload extends execution requirements, not canonical task truth or Android execution authority.

Define versioned workload/attempt types preserving task/action/origin and targetDeviceRef, with executor/input/output, capability, platform, resource, data/consent, deadline and retry safety. QoS is INTERACTIVE, SOFT_DEADLINE, BATCH or BACKGROUND. Explicit deadline behavior may refuse, degrade or continue; it is not a fifty-millisecond hard-real-time guarantee.

Distinguish side-effect-free, keyed-idempotent, checkpoint-resumable, non-retryable and unknown-effect behavior. Do not infer checkpoint support from a worker's claim. Legacy tasks keep existing behavior. Unknown schema versions, incompatible units, malformed requirements and unverified privilege requests fail with typed errors; bound payload size and nesting.

Run `node --test tests/pcf708-workload.test.mjs`: preserve legacy round-trip identity/semantics; never reinterpret providerRef/handoffTargetRef as strict targeting; handle empty/negative/infinite resources, expired deadlines, unknown enums, fake control-worker promotion and oversized inputs.

Deliver consumer compatibility, upgrade/downgrade fixtures, redaction rules and understandable task-class text for 715. Additional classes cannot make domain-specific business data mandatory in the core.
