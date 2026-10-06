# Research evidence and staged release

[中文](../RESEARCH_AND_RELEASE.md)

Reuse REX and the existing research watchlist. Generic scheduling, reservations, cross-device execution and checkpoints are not automatic G4 claims. Study personal-device contention, intermittent connections, authorization and incomplete observations using falsifiable hypotheses and controlled comparisons. No publication or supervisor-fit guarantee is implied.

## Experiments

Record question/hypothesis, frozen scope, exact runtime/contract/policy/executor versions, hardware/OS/topology, workload digest, model/input versions, cache state, network conditions, seed, repetition/stopping rules, failure handling and full log location. Use pilots to estimate variation before fixing repetitions and analysis; thirty trials may be a pilot budget, not proof of statistical sufficiency. Match inputs/seeds and randomize or interleave order. Report distributions, intervals, failure denominators and limitations.

Compare existing compatible routing, capability/fixed-priority, load-only and PCF policy/freshness/cost strategies under equal authorization and safety floors. Ablate freshness, locality, reservation, hysteresis, foreground protection and checkpoints separately. Disable safety gates only in isolated counterexample tests, never on sensitive real workloads.

Measure queue, compute, transfer and end-to-end latency; avoid strong tail claims from inadequate samples. Also record throughput, SLO misses, incorrect placement/refusal, starvation, reservation leaks, recovery, duplicate effects, owner interventions and instrumentation overhead. Report measured energy separately from proxies; unobserved values are null, not zero. Decision replay is not counterfactual runtime-performance evidence: re-execute or explicitly calibrate and label simulation.

## Faults and workloads

Include stale/out-of-order/missing telemetry, competing reservations, worker crash/reboot, disconnection, late attempts, partial artifacts, cancellation/deadlines, revoked authorization, foreground contention, storage failure, controller restart and unavailable Monitor/REX.

Run at least two real software workloads, including interactive bounded compute and sustained batch/media-data processing, both separately and concurrently. Sanitized sensing/health traces or synthetic inputs must remain labeled and prove neither clinical efficacy nor physical-glasses performance. Preserve two Windows workers and three control clients; Android is not a worker before 719.

## Release levels

Component acceptance proves only declared scope and records deferred seams. It is not physical product acceptance.

Reserved PCF-790 is generated as a real integration workbook only after the frozen core component set is accepted. It must prove: no-workbench STANDARD_DEVICES and legacy/strict-target compatibility; physical two-worker placement/contention/recovery; results, errors and cancellation returning to Web/Android origins; policy/privacy/budget preservation; honest refusal of unsupported resume; stale-attempt fencing across controller restart; no false HA claim; live discoverable UI and risk/unknown disclosure; nonblocking Monitor/trace failure; independent REX reproduction/export; required exact-head and merged-main CI; and registry/runtime agreement.

Proposed marker: PCF_CORE_V1_ACCEPTED_STANDARD_DEVICES_PRESERVED. It does not certify Linux, mobile edge execution, accelerator serving, glasses or controller HA.

Optional extensions have their own hardware, consent, provider, physical evidence, fallback and markers. Reserved PCF-990 may later accept only an explicitly frozen extension set, never all imaginable devices. Deferred work is not disguised as complete.

Utopia holds raw evidence and bilingual explanations; City holds bounded references. Early adapters can consume REX-801/802. Full runner/fault/replay/export claims require accepted REX-803–806 heads. Test doubles permit development but cannot certify a research-grade release. This planning document changes no global observed novelty grade, verified inventory or active progress.
