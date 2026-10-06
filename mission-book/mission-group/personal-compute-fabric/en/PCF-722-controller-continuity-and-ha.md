# PCF-722 — Controller continuity and HA (optional)

[Canonical state](../PCF-722-controller-continuity-and-ha.md) · [Shared steps](EXECUTION_CONTRACT.md). PARKED translation.

This differs from worker recovery in 705 and same-controller restart in 712. Activation requires real control nodes, a validated storage/replication/fencing substrate and approved fault-test scope. Missing prerequisites neither permit HA implementation nor block CORE_V1.

Propose controller-continuity.mjs and scoped tests. Canonical-storage changes need separate design review; mirrored JSON directories are not a consistency protocol. Specify failure model, target RPO/RTO, replica lag/durability, promotion authority, old-writer fencing and rejoining. Targets remain unproven until measured.

Two partitioned peers cannot both promote. Use a proved witness/strongly consistent lease substrate, or refuse automatic promotion and require verifiable manual fencing. Otherwise fail closed. Planned handover drains work, verifies persistence, changes epochs and uses canary/rollback. Replicate bounded references, not raw secrets.

Accept planned maintenance, manual fenced standby and automatic failover separately. Manual procedures are not automatic HA.

Test partitions, asymmetric links, clock skew, revived old leaders, lagged storage, duplicate promotion, failed fencing and combined controller/worker faults. Automatic HA requires physical fault and single-writer evidence. Missing substrate stays BLOCKED/NOT_RUN; document review is not implementation completion. This plan mandates no witness or dual-Linux purchase now.
