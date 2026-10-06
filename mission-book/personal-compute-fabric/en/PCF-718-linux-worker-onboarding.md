# PCF-718 — Linux worker onboarding (optional)

[Canonical state](../PCF-718-linux-worker-onboarding.md) · [Shared steps](./EXECUTION_CONTRACT.md). PARKED translation.

Activation needs an approved Linux environment and installation permission. Virtual Linux may support development but must be labeled; a VM is not a second physical reviewer or independent failure domain.

Propose platform/linux/pcf-worker/, scoped contract tests and bilingual runbooks. Add a compatible WBC adapter, not Linux-specific application rewrites. Support headless installation/registration/readiness/shutdown, least-privilege services, signals/process trees, case-sensitive paths, permissions and clocks.

Advertise actual capabilities/isolation. Windows-specific validation stays on real Windows. Switching STANDARD_DEVICES/HYBRID remains reversible; missing/offline/incompatible Linux cannot break existing Windows/Android paths.

Execute real Linux CPU work, cancellation, restart and origin-result return. Record OS/kernel/runtime/toolchain, virtualization, physical identity and data paths. VM performance cannot certify a physical workstation. Unavailable GPU/cgroup support remains unknown/unsupported. Missing hardware stays parked/blocked without simulated acceptance or forced purchases.
