# PCF-713 — Interference and SLO protection

[Canonical state](../PCF-713-interference-and-slo-protection.md) · [Shared steps](./EXECUTION_CONTRACT.md). PARKED translation.

Propose interference/degradation modules and tests/pcf713-interference.test.mjs using observations, placement, admission and execution rather than a second scheduler authority.

Respect explicit foreground protection and application budgets without inspecting window content. Observe queue/end-to-end SLOs and protect them through quotas, admission refusal, reduced concurrency and supported cooperative pause/quality changes. Never arbitrarily kill non-preemptible work or the user's games.

Applications explicitly declare reversible degradation choices. Use hysteresis, cooldown and minimum residence to prevent oscillation. Meeting latency does not permit unapproved data export or paid API switching. Distinguish requested targets, estimates and measured attainment; report unsatisfiable SLOs rather than hard-real-time claims.

Run `node --test tests/pcf713-interference.test.mjs` for sustained batch, interactive bursts, priority inversion, starvation, stale/bad load, non-preemptible jobs, irreversible quality changes and oscillation. Physically co-run interactive and batch workloads on both hosts; measure per-class latency/throughput/interference and protection-on/off overhead.

715 exposes protection, degradation reasons and opt-out. Freeze realistic targets after pilots, not a universal fifty-millisecond claim. GPU/thermal support belongs to optional 720.
