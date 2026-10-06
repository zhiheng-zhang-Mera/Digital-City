# PCF-712 — Durable supervision and fencing

[Canonical state](../PCF-712-durable-supervision-and-fencing.md) · [Shared steps](./EXECUTION_CONTRACT.md). PARKED translation.

Propose supervisor/canonical-state-adapter modules and tests/pcf712-supervision.test.mjs. reconcileExecution proposes execution-lifecycle actions only; FR retains engineering goals, review/repair and arbitration.

Subscribe to events with bounded reconciliation fallback, idempotent replay and low-cost idle waiting. Persist reservation/attempt/commit-token relations under the existing canonical owner. Necessary Store atomic-write/version primitives require explicit single-writer ownership and fault tests, not another task database.

Increment fencing epochs on holder changes and validate them at start/report/result commit. A failed persistence step cannot be hidden by executing first. On restart reconcile canonical tasks, real worker boot identity, outstanding reservations and receipts. Unknown external effects go to 705; timeouts do not prove old workers stopped.

Run `node --test tests/pcf712-supervision.test.mjs` for crashes before/during/after writes, duplicate events, surviving old workers, late epochs, duplicate supervisors, unwritable storage, broken event streams and idle pools. Only one canonical writer is valid; uncertain authority fails closed. Restart must not leak reservations or duplicate result commits.

The loop runs without an Owner chat page. 716 owns unattended installation, 722 controller HA. This task does not automatically launch new Hns/Codex engineering work. 715 exposes supervisor health and recovery uncertainty.
