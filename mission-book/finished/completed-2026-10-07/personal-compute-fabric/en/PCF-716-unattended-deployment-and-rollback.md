# PCF-716 — Unattended deployment and rollback

[Canonical state](../PCF-716-unattended-deployment-and-rollback.md) · [Shared steps](EXECUTION_CONTRACT.md). PARKED translation.

Propose scripts/pcf-service.ps1, deployment.mjs, tests/pcf716-deployment.test.mjs and bilingual runbooks. Preserve existing Windows configuration and Utopia.cmd behavior.

Installation/start/stop/uninstall are explicit opt-ins using least-privilege service identity, port/config checks, credential handles and version manifests. Do not request elevation or autostart without permission. Prove authorized execution continues without a browser, connected configuration laptop or interactive login. Separate service and control-surface lifecycles; bound logs, disk use and health checks.

Upgrade through preflight, drain, checkpoint/finish in-flight work, canary, switch and verification. Restore compatible prior versions/config on failure; irreversible schema migration needs a new gate. Preserve rollback to STANDARD_DEVICES and no-PCF startup. Provide a maintenance action for future monthly load switching but schedule no real automation in this plan.

Test missing/corrupt config, denied privileges, duplicate installation, occupied ports, undrained updates, failed canaries, full disks, mixed versions and rollback failure. Collect real Windows unattended-start, control-disconnect, restart and rollback evidence; disruptive logoff/reboot testing requires consent.

Integrate maintenance status through 715 at release. No server/Linux purchase or controller-HA claim is included.
