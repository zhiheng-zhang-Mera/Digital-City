# PCF-715 — Resource controls and Monitor projection

[Canonical state](../PCF-715-resource-control-and-monitor.md) · [Shared steps](./EXECUTION_CONTRACT.md). PARKED translation.

Propose presentation.mjs, apps/web/pcf-panel.mjs and tests/pcf715-surface.test.mjs. Use Android paths verified by 700. Shared gateway/UI files remain serialized integration seams; live integration requires accepted MON-990.

Place Compute Fabric in existing Settings/Advanced and contextual task/device details, not a new row of top-level apps. Show capability/freshness, queues, candidate reasons, profiles, reservations and background health. Wire sharing, drain, quotas, protection, consent/revoke and profile rollback to their actual canonical owners; reuse WBC profile APIs. Unsupported controls stay disabled with honest reasons.

Overview shows activity, waiting, risk and Owner attention; detail answers what/why/who/next; technical layers contain measurements, versions/epochs and evidence. Unknown/stale/partial data and active risk must propagate upward. Projection/Monitor/REX failures cannot lock execution or modify scheduling.

Run scoped tests and real Web/Android control→request→accept/refuse→progress/result→refresh checks, including expired access, stale caches, missing fields, sequence gaps, absent backends, keyboard/small-screen use and misleading metrics. Do not invent navigation counts or zero latency.

Accept the live basic telemetry/placement/admission host. Controls for later recovery/supervision/protection/deployment open only after their backends are accepted and integrated at 790, without making them backward dependencies of the basic host. Reconcile bilingual wording, capability exposure and evidence ownership.
