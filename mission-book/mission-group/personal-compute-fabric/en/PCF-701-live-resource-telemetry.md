# PCF-701 — Live resource telemetry and freshness

[Canonical state](../PCF-701-live-resource-telemetry.md) · [Shared steps](EXECUTION_CONTRACT.md). Read-only translation; PARKED.

Create proposed observations.mjs under contracts/personal-compute-fabric-v1/, telemetry.mjs under services/personal-compute-fabric/, and tests/pcf701-telemetry.test.mjs. Consume WBC descriptors and existing authenticated telemetry; produce observeResources(sample, context) without creating trust or claim authority.

Measure CPU, memory, disk and observable queue/occupancy with source, units, boot/sequence identity, observation/receipt times and TTL. GPU/VRAM, path-specific network quality and power/thermal are optional adapters. Distinguish total/free/reserved/in-use, presence/freshness, measurements/estimates/declarations. Online LAN does not establish RTT or bandwidth. Probes, buffers, sampling frequency and overhead must be bounded; expose dropped counts. Do not collect private process/window/file details without permission.

Run `node --test tests/pcf701-telemetry.test.mjs`. Missing/NaN/negative/invalid-unit values must not become zero; old samples cannot overwrite new ones; reboot epochs cannot mix; clock rollback cannot preserve false freshness; collector timeout cannot freeze execution; buffer loss remains visible. Measure CPU/RAM on both physical hosts and instrumentation overhead. Missing GPUs remain explicitly unknown/unsupported.

Expose resources and freshness in advanced device details through 715; raw samples belong in technical details. Unwired components remain component-only. Additional adapters must not make unavailable hardware mandatory.
