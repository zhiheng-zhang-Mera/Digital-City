# REX-804 — Fault Injection + Recovery Probes

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../REX-804-fault-injection-and-recovery-probes.md). This page translates the explanatory body only; source workbook/report controls claims, state, SHA, CI, and gates.
>
> [Persistent rules](../../CONSTRUCTION_RULES.md) · [Research material](./RESEARCH_EVIDENCE_PROTOCOL.md)

## Objective

Intentionally inject within safety boundaries:

- worker stop/crash;
- heartbeat loss/stale;
- network disconnect;
- provider unavailable;
- high CPU/RAM pressure where a reliable method exists;
- delayed result;
- duplicate/reordered event;
- credential/session expiry;
- retry/recovery trigger.

Quantify detection/recovery/duplication/intervention.

## User exposure

ADVANCED_CONTROL. Place in Research → Advanced / Danger Zone, never ordinary primary navigation. Require explicit target and impact, explicit confirmation, bounded duration, emergency stop, and observable recovery state.

## Safety

Do not damage the host system, delete user data, disable unrecoverable external resources, inject attacks into public networks, or execute high-impact faults without confirmation.

## Review

Reviewer independently designs at least one fault probe not used by the author, and validates failure classification/recovery metrics.

## Completion gate

At least four fault classes are controllable, stoppable, recordable, and recoverable. Normal product mode without active faults must be unaffected.
