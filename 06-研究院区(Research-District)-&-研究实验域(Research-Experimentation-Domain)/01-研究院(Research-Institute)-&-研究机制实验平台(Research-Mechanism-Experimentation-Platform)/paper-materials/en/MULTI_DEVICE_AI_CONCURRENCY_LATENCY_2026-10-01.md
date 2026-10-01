# Paper material — response latency and backpressure under concurrent multi-device AI requests

FACT: INCIDENT_ID=MULTI-DEVICE-AI-CONCURRENCY-LATENCY-2026-10-01
FACT: OBSERVATION_DATE=2026-10-01
FACT: EVIDENCE_LEVEL=USER_FIELD_OBSERVATION
FACT: ROOT_CAUSE_CONFIRMED=false
FACT: CITY_IMPLEMENTATION_PLAN_COMMITTED=false
FACT: DESIGN_STATUS=OPEN
FACT: TARGET_SYSTEM=UTOPIA_MULTI_DEVICE_ASSISTANT
FACT: MULTI_DEVICE_PARALLEL_INPUT_EXPECTED=true
FACT: SINGLE_EMPTY_OR_SLOW_RESPONSE_PROVES_PROVIDER_CONTENTION=false

## Observation

During several days of real use, the user observed that perceived response speed appears to decrease when the same account/logical assistant receives instructions or questions concurrently from different devices.

This is currently a field observation only. There is no account-level scheduler telemetry, provider queue trace, TTFT instrumentation, end-to-end trace, or server-side resource allocation evidence. Therefore **the observation does not establish that multiple devices are competing for one backend worker or that account-level compute contention is the confirmed cause**.

The durable systems question is broader:

> When one multi-device assistant allows several embodiments to originate AI work at the same time, upstream providers, web sessions, local executors, and the shared task system can all become concurrency bottlenecks. Without explicit backpressure, modest external latency can be amplified by duplicate requests, retries, and cross-device forwarding.

## Candidate causes

The following hypotheses should remain separate until telemetry or controlled experiments distinguish them:

1. **External provider scheduling/rate limits** — account, model, session, API, or web-channel concurrency/queue constraints;
2. **Heavier requests** — long context, higher reasoning effort, and web/GitHub/Computer Use tool round-trips increasing TTFT and total duration;
3. **Local resource contention** — browser automation, Computer Use, CPU/GPU, memory, or network shared by multiple executions on one host;
4. **Network/client variance** — device network, browser state, and connection reuse;
5. **Future Utopia internal contention** — if embodiments bypass shared task truth, concurrency budgets, or leases, the system can create duplicate execution, write conflicts, starvation, and retry storms.

No candidate is recorded as a confirmed root cause.

## Mitigation direction

The following design principles are preserved as research material, but **no concrete City implementation plan or mandatory architecture is committed here**:

- decompose user-visible wait time into Utopia queueing, local execution, provider TTFT, and provider total duration;
- apply admission control and backpressure before scarce/expensive execution resources rather than allowing unbounded device-originated concurrency;
- maintain configurable concurrency budgets per provider/channel instead of assuming unlimited upstream parallelism;
- reuse shared task/action identity, leases, and idempotency to suppress duplicate execution from reconnects, duplicate taps, or timeouts;
- prohibit unbounded “slow -> immediately duplicate the request” retry behavior; retries require backoff, limits, and typed reasons;
- expose states such as `QUEUED`, `RUNNING`, `PROVIDER_THROTTLED`, and `LOCAL_RESOURCE_WAIT` so queueing is not mistaken for a hang;
- provider/API/device switching remains subject to existing user-confirmation and policy rules;
- collect real telemetry before selecting default concurrency levels or scheduling policy.

## Research value

A testable systems hypothesis follows:

> For a multi-embodiment shared logical agent, explicit admission/backpressure, request deduplication, and layered latency telemetry should reduce retry storms, duplicate execution, and tail latency while making system state more explainable to the user.

Potential measurements include:

- TTFT and end-to-end duration for single-device serial vs multi-device concurrent requests;
- fraction of delay attributable to Utopia queueing vs provider wait;
- concurrency degradation curves across provider/web/API channels;
- retry count, duplicate-action count, and conflicting-write count;
- P50/P95/P99 latency before and after admission/backpressure;
- throughput and user-visible tail latency with and without concurrency budgets;
- same-task contention vs independent-task concurrency.

This record freezes only the problem, hypotheses, and design lessons. The concrete solution remains an out-of-repository draft and is not yet a City engineering constraint.
