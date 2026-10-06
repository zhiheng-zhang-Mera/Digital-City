# REX-804 research material index

Implementation candidate: `9b68d4f7054bb911c484340532cc3b5ae9ed47ac`. Baseline: `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`.

- Utopia `evidence/raw/mission-book/REX-804/development-receipt.json`: bounded classes, scope, retained RED failures, explicit unknowns.
- Utopia `evidence/raw/mission-book/REX-804/danger-zone.png`: real Web Owner confirmation/refusal/stop surface.
- Utopia `tests/rex804-faults.test.mjs`: temporal measurement attribution, expiry storage isolation, restart/stop.
- Utopia `tests/rex804-gateway.test.mjs`: real heartbeat offline/recovery, execution-claim failure, delayed report, duplicate observation versus one canonical completion, unrelated target/health controls.
- Utopia `tests/rex804-web.test.mjs`: real visible control-to-canonical activation and emergency stop.
- Utopia `data-records/evolution/inbox/mission-book/REX-804/events.jsonl`: unverified evolution evidence; not policy or accepted learning.
- Raw logs: `.runtime/evidence/mission-book/REX-804/{focused-green,full-tests}.log`; initial relay timing failure retained.

Failure chain: unused historical fault received later natural detection/recovery → deterministic falsification → require exercised active causal window → regression PASS → opposite-host confirmation NOT_RUN.
Failure chain: expiry receipt write error escaped after canonical commit → storage failure falsification → remove injection first and contain persistence error → regression PASS → opposite-host confirmation NOT_RUN.

Signals: bounded observation/runtime control truth, measurement error, explicit Owner authorization, capability wiring/reachability, nonblocking unrelated task boundary. Physical host/provider recovery, autonomous span, tokens and cross-host causal latency NOT_MEASURED. No novelty or performance claims.
