# PCF-728 — Originating-agent remote-job and result-return bridge

**PARKED / DESIGN ONLY / NOT ACTIVATED.** Canonical state: [source](../PCF-728-originating-agent-remote-job-bridge.md). This reading copy has no claim authority.

[Shared execution contract](EXECUTION_CONTRACT.md) · [Migration history](MIGRATION_HISTORY.md)

Transfer05 extracts FR-001 origin return, result consumption and task-injection caller requirements, adapted to Alien Codex→Mech→the same Alien Codex session. FR retains goal decomposition and Review-to-Repair.

Candidate files: `services/personal-compute-fabric/origin-agent-bridge.mjs`, `tests/pcf728-origin-agent.test.mjs`, and caller tool configuration verified by700.

- [ ] Version `submitRemoteJob(capsule)`, `inspectRemoteJob(ref,cursor)`, `cancelRemoteJob(ref)` and `collectRemoteResult(ref)` over canonical Task/Action and RF. Distinguish accepted/dispatched/running/result-ready/result-delivered/consumed instead of reporting instant success.
- [ ] Support a managed Codex session or an explicitly configured official tool adapter in an external session. Never claim transparent takeover of an arbitrary running Codex process. Select MCP/CLI/native integration from installed-version capabilities without embedding vendor internals into PCF core.
- [ ] Let the originating agent explicitly submit independent subtasks while continuing local work; execute a real engineering connector or authorized build/test on Mech, returning to the original parent session. This does not split arbitrary threads/RAM/GPUs across hosts.
- [ ] Reuse703 explicit DAG and EM-010; preserve input revisions, scopes, dependencies and join acceptance. Semantic decomposition and governance voting are out of scope; overlapping writes serialize or isolate.
- [ ] Prove that the same originating agent actually reads the returned result and uses it in a subsequent step. UI visibility alone is insufficient. Recover bounded retrieval after disconnect without injecting into a different unauthorized session.
- [ ] Deduplication, retries, cancellation and late results obey one canonical terminal. Treat output as data; do not replay unknown effects or grant merge/credential/budget authority.

Run `node --test tests/pcf728-origin-agent.test.mjs`, plus real Alien→Mech→the same Alien parent session and reverse-direction verification; origin reconnect/retrieval, wrong-session/unauthorized refusal and cancel/failure. Record tool receipts, host process evidence and actual result consumption, never hidden thought. Share task/attempt evidence with724 without duplicating implementation ownership.
