# PCF-704 — Admission, atomic reservations and fairness

[Canonical state](../PCF-704-admission-reservations-and-fairness.md) · [Shared steps](./EXECUTION_CONTRACT.md). PARKED translation.

Propose admission/reservations/fair-queue modules and tests/pcf704-admission.test.mjs. Expose admit(proposal, expectedVersion) and releaseReservation(receipt). The existing canonical owner provides serialization/CAS semantics; a second task database cannot fake atomicity.

Define resource vectors and available versus reserved capacity. Add idempotent admission, expiry, cancellation release and typed refusal; 712 handles durable recovery. Multi-resource requests use bounded all-or-nothing or explicitly staged acquisition without indefinite hold-and-wait. V1 does not require cross-host distributed transactions.

Use bounded queues, per-application quotas, fair rotation/aging, priority and deadline refusal. Interactive priority cannot starve background work forever. Revalidate policy/revocation, canonical state and observations at admission; stale free-slot estimates are not launch permission.

Run `node --test tests/pcf704-admission.test.mjs`: only one concurrent request gets the last unit; repeated admission does not double charge; failures/cancellation/expiry do not leak reservations; stale versions fail; insufficient capacity does not deadlock partial reservations; large work progresses or is explicitly refused under sustained small work; queue-full loss is visible.

Apply bounded contention on both real hosts and compare observations, reservations and actual execution. Logical quotas do not prove OS isolation; 710 does. 715 exposes queue, quota, wait and refusal reasons.
