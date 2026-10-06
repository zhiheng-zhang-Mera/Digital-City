# PCF-709 — Artifact locality and bounded caches

[Canonical state](../PCF-709-artifact-locality-and-cache.md) · [Shared steps](./EXECUTION_CONTRACT.md). PARKED translation.

Propose artifacts/cache modules and tests/pcf709-artifacts.test.mjs. resolveArtifact(ref, principal, destination) returns an authorized transfer plan or refusal using existing storage/transport. The rebuildable location index is not task authority.

Use opaque identity, digest, size/schema, owner/data scope, authorized replicas, expiry and retention for inputs, checkpoints and outputs. Matching digests grant no access. Authorized storage adapters resolve paths and prevent traversal/arbitrary remote reads. Revalidate before transfer/publication; partial files cannot enter the available index.

Bound cache bytes/items, pins, leases, eviction and invalidation. Shared content must not leak cross-permission metadata. Revoked replicas require observable cleanup; failed deletion is not deletion success. Retain actual transfer bytes/costs and checkpoint-compatible resumable-transfer evidence. Treat cache warmth as an experiment variable.

Run `node --test tests/pcf709-artifacts.test.mjs` for same-digest/different-permission, corruption/truncation, changing sources, traversal, full disks, pinned eviction, retries, mid-transfer revocation and cleanup failure. Physically transfer between hosts and verify bytes/checksums, not copied fixture claims.

Expose replica/transfer/quota/deletion status in advanced task/device details without sensitive names/content in public traces. New storage providers need separate authorization; cloud is not mandatory.
