# MON-901 development log

2026-10-05 — Alien-codex. Fixed baseline d3262ce2dd81e51a53e39e6f9add8dee650a7682.

Choice: pull-based non-authoritative observation over persisted Gateway events/tasks/nodes, bounded coherent SQLite read transaction, no execution callback and no second scheduler truth. Node/Edge/Event/Evidence projections plus empty Decision seam; graph UI deferred only to its specified MON-902 scope. Unknown task owner and absent canonical review/CI/model-switch/escalation sources explicitly NOT_OBSERVABLE.

Technical review found two real P2s, reproduced before correction: deleted event prefix/tail looked complete; request-local observers could not share reads or preserve stale history. Add canonical SQLite event watermark; retain a Gateway-scoped observer with single-flight, stale/error and shutdown disconnect. Independent critic8/8 PASS, not opposite-host Formal Review.

Validation: final focused23/23 PASS including8 observation,4 Gateway and document paths. Real control/node API task creation→claim→RUNNING→COMPLETED projects canonical assigned node and event IDs. Controlled hanging HTTP monitor request does not block another task creation; failing reader does not prevent task cancellation. Window overflow and deleted history are explicitly PARTIAL; safeSummaryAvailable=false.

Preserved failures: initial missing-module red; incorrect test route /commands (404) corrected to existing /tasks; incorrect fixture TASK_RUNNING/DONE labels corrected to canonical TASK_STARTED/COMPLETED; first shared-read red test hung due fixture releasing only one promise, interrupted own session45886 and corrected witness/releases; final reviewer regressions red2 genuinely reproduce both P2s. Root pre-correction1253 tests /1251PASS /2FAIL CORRUPT_INPUT: missing separate city/node_modules junction in isolated checkout, also reproduced on unmodified pointfix baseline; existing YAML parser seam unavailable. Restored city dependency junction without product change; affected document + focused23 tests pass. Final full-suite rerun is pending. Do not describe initial failure as product fixed.

Controlled canary JSON is protocol-report integration, not real physical executor/benchmark; second canary reused same test SQLite store and its14 events include both runs. Projection latency covers sample-to-projection only. No cross-device, Android UI, speedup or primary-agent migration claim. No installed live Gateway touched. Exact-head CI, registry candidate and opposite-host Formal Review still pending.

Candidate7eb38f1b930dfe6cc13dab0e17dedee467b1254b pushed; PR24. Final local root1255/1255 PASS, Rooms69/69 PASS, promotion history10 and bilingual synchronization PASS. Exact hosted CI37242446183 and PR37242505126 running; reciprocal37242505131 PASS. Initial failures retained. WindowsApps python alias returned1 without invoking synchronizer; portable task-specific interpreter D:/Tools/MonitorPython-3.13.0 downloaded from official Python release archive and archive checksum verified. Actual sync_mission_progress.py and --check now return0, synchronized. No global Python installation changed.

语言配对 / Language pair: [English](./DEVELOPMENT_LOG.md) · [中文](./zh-CN/DEVELOPMENT_LOG.md)
