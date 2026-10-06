# PCF-707 — REX trace, replay and ablation adapter

[Canonical state](../PCF-707-research-trace-and-replay-adapter.md) · [Shared steps](EXECUTION_CONTRACT.md). PARKED translation.

Propose research-adapter.mjs and tests/pcf707-research-adapter.test.mjs, consuming accepted REX manifest/trace contracts instead of duplicating runner, fault authority or export storage.

toResearchEvent records task/action/attempt/reservation, policy/runtime versions, observations, decision reasons, queue/transfer/execution/recovery, owner intervention and missing/dropped data. Add deterministic decision replay and isolated authorized baseline/ablation controls; viewing a report cannot alter production policy.

Keep schema compatibility, units, clocks, missingness and privacy explicit. Collector failure degrades within bounds without blocking unrelated execution. Label real runs, simulation, recorded traces and counterfactual estimates separately. Different replayed decisions do not establish real performance gains.

Run `node --test tests/pcf707-research-adapter.test.mjs` for duplicate/out-of-order events, missing schema fields, unavailable collectors, buffer loss, sensitive fields and incorrect run/head attribution. Measure instrumentation-on/off overhead and reproducible policy differences.

Acceptance covers the adapter contract. 721 owns full runner/fault/replay/export integration using accepted REX-803–806 heads. A connected test double is not complete Research Fabric acceptance.
