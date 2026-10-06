# PCF-720 — Accelerators, power and thermal adapters (optional)

[Canonical state](../PCF-720-accelerator-power-and-thermal.md) · [Shared steps](EXECUTION_CONTRACT.md). PARKED translation.

Activation needs a real supported GPU/NPU/power/thermal source, permission and safe test scope. Split vendors/adapters into children rather than requiring every platform. Propose resource-adapters/ and scoped tests, extending 701 observations without turning descriptors into authority.

Record device identity, driver/runtime, VRAM total/available/reserved, utilization and source. NPU and GPU capabilities are not interchangeable. Preserve units/time windows for power, battery, temperature and thermal headroom; unsupported differs from failed/unknown reads. CPU utilization is not joules.

Feed observable constraints into 713 using supported per-device policy thresholds. Do not pursue overheating, overclocking or destructive stress. Revalidate after driver changes, hotplug, counter resets and sleep/wake; stale telemetry cannot authorize new hardware.

Test missing permissions/sensors/GPUs, NaN, mixed units, overflow, stale data and firmware/driver changes, then sample a real adapter. Record overhead and false refusals; separate energy proxies from measurements. This extension's absence cannot break CORE_V1.
