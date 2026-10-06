# PCF-710 — Real headless execution and isolation

[Canonical state](../PCF-710-headless-execution-and-isolation.md) · [Shared steps](EXECUTION_CONTRACT.md). PARKED translation.

Propose executor/execution-adapter modules and tests/pcf710-executor.test.mjs, connecting the accepted headless-agent seam. executeAttempt must actually launch, control and collect authorized work rather than merely invoke a test callback.

Provide at least one versioned cancellable real CPU-data executor with verifiable outputs. Manifests declare platform, resource/isolation support and side effects; they are not arbitrary shell strings. Use executable/argument allowlists, least privilege, isolated work directories, credential handles, filtered environment, output limits and deadlines. Node processes/threads are not automatically security sandboxes.

Platform adapters disclose enforced process-tree, memory, CPU and filesystem boundaries. Logical reservations cannot claim hard enforcement. Refuse workloads requiring unsupported isolation rather than silently weakening it. Cancellation/drain/timeout target only the tracked attempt/process tree. Validate exit status and output schema before publishing success.

Run `node --test tests/pcf710-executor.test.mjs` for missing reservation, expired consent, unknown executor, invalid arguments, escaped files, surviving children, unbounded logs, cancellation races, timeout, bad exit and insufficient isolation. Execute real samples on both hosts with verified results/cancellation/receipts. Linux, old Boss access and unknown automatic dependency installation are not required.

712/716 own persistent startup; 715 owns resource controls. New privileges or plugins remain Owner-gated.

## 2026-10-07 specification revision 2

Consume725/726 foundations through708. A real CPU executor remains this component minimum; vendor Codex logic belongs in727. Accepted dispatch is not proof of process startup. Prove host/boot/attempt, controlled termination, nonzero exit, cancellation and artifacts. A CPU demo cannot satisfy product Codex acceptance.

See [migration and ownership](MIGRATION_HISTORY.md). This revision grants no execution, budget, remote access or merge authority.
