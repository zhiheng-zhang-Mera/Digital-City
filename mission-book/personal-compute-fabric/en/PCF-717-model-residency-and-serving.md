# PCF-717 — Model residency and serving (optional)

[Canonical state](../PCF-717-model-residency-and-serving.md) · [Shared steps](./EXECUTION_CONTRACT.md). PARKED translation.

Activation needs an authorized real inference runtime, model artifact/license and measurable resources. Missing GPUs do not block core; CPU evidence is not GPU evidence. Propose model-residency.mjs and its scoped tests. GAI retains provider/channel, model-choice and spending authority; PCF handles resources/residency only.

Version model/runtime/quantization/accelerator compatibility and verify artifacts through 709. Downloads/providers require consent. Account for cold-start, weights, workspace/KV cache and concurrency separately from measured capacity; GPU count alone is insufficient.

Bound warm pools, eviction and idle time, with OOM, cancellation and request isolation. No unauthorized context/KV reuse between tasks. Cache locality never overrides data or spending policy.

Run scoped tests for OOM, concurrent loads, partial downloads, wrong versions, in-use eviction, cancellation, residual context and missing accelerators. Measure real cold/warm latency, outputs and memory; mocks certify contracts only. New devices/quantization schemes may be children without requiring every LLM framework.
