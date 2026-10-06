# PCF-705 — Recovery and safe re-placement

[Canonical state](../PCF-705-recovery-and-safe-replacement.md) · [Shared steps](./EXECUTION_CONTRACT.md). PARKED translation.

Propose recovery.mjs and tests/pcf705-recovery.test.mjs. Consume explicit checkpoints and 712 fencing; adapt existing handoff/recovery rather than redefining task lifecycle.

planRecovery distinguishes retry-safe, checkpoint-resumable, non-retryable and SIDE_EFFECT_UNKNOWN outcomes. FAILED is not universal retry permission. Authorized recovery creates a new attempt while preserving task/action/origin identity. Check data locality, executor/schema/model compatibility, eligibility, consent, retry budget and cooldown.

Migration benefit must cover transfer, cold-start and discarded work; hysteresis prevents ping-pong. Strict targets stay bound when offline. Fence late results. Reconcile or quarantine unknown external effects and surface bounded attention; do not promise generic exactly-once behavior.

Run `node --test tests/pcf705-recovery.test.mjs` for disconnection before/after commit, late results, damaged/incompatible checkpoints, revoked consent, duplicate recovery events, oscillating load and offline strict targets. Allowed recovery must satisfy the original output contract; prohibited recovery remains honestly refused/waiting.

Use safe physical two-host disconnection/process-crash samples with unchanged task ID, distinct attempt/fence, measured recovery time and duplicate-effect checks. This is neither VM/live-process migration nor controller HA. 714/715 expose recovery, cancellation and residual uncertainty.
