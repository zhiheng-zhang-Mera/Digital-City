# PCF-719 — Android edge companion (optional)

[Canonical state](../PCF-719-android-edge-companion.md) · [Shared steps](EXECUTION_CONTRACT.md). PARKED translation.

Activation requires explicit consent for a new Android execution service and background/resource budget. The existing Android control principal remains control-only; adding a role cannot promote it into a worker.

Use verified apps/android paths for a distinct adapter/service. Reuse the physical-device identity authority with separately scoped service/installation permissions and credential handles, not a new physical-device database. Add scoped cross-platform contract tests.

Support opt-in registration, allowlisted work, foreground/background lifecycle, OS reclamation/power saving, metered networks, battery/thermal constraints, revocation and user stop. Only declared lightweight executors are eligible. Compute enrollment does not grant camera/microphone/sensor access.

Demonstrate local preprocessing→approved PC compute→origin-phone result. Unsupported background persistence must fail/wait honestly; do not promise unconditional 24/7 operation. Stopping the execution service cannot damage the existing control application.

Require contract negatives, native unit/instrumentation tests and physical-device reclamation, network-change, stop/revoke, battery/thermal refusal and result-return evidence. Emulators certify only their scope. Two roles on one phone are not two physical hosts.
