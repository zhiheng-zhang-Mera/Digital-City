# PCF-727 — Live engineering connector execution and acceptance

**PARKED / DESIGN ONLY / NOT ACTIVATED.** Canonical state: [source](../PCF-727-engineering-connector-live-execution.md). This reading copy has no claim authority.

[Shared execution contract](EXECUTION_CONTRACT.md) · [Migration history](MIGRATION_HISTORY.md)

Transfer04 turns FR-001 Stage B into an independently reviewable PCF workbook. Reuse accepted EM-002/003/006/007/008/009/010/011/012/013 contracts and audit their actual implementations/evidence; do not rewrite completed records or build a duplicate Codex connector.

Candidate files: `services/personal-compute-fabric/engineering-executor-adapter.mjs`, `tests/pcf727-engineering-executor.test.mjs`. Use existing ConnectorPort plus710, never another scheduler.

- [ ] `bindEngineeringExecutor(connector, providerManifest)` maps probe/version/auth/readiness, launch or supported attach, session binding, submit, progress/checkpoint, control/result/health. Correlate canonical job/task with provider run/session, base SHA/worktree and host/boot/attempt.
- [ ] Verify the installed version's supported official interface at activation and record its documentation. Missing installation/auth/licence/permissions yields typed NOT_RUN/ATTENTION/UNSUPPORTED; no automatic installation, login, purchase or paid-API switch.
- [ ] Track Codex and DeepSeek Harness conformance/local/remote/cancel/restart/result evidence separately. CODEX_REMOTE requires a real Codex chain; DEEPSEEK_REMOTE remains unaccepted until measured. FR's original requirement for BOTH real providers remains a downstream consumption gate, not silently weakened to Codex-only.
- [ ] Stage verified versioned inputs into isolated worktrees via709, explicitly snapshot dirty inputs, and return patch/commit/artifact evidence. Never blindly share a writable worktree, overwrite Alien's workspace or auto-merge.
- [ ] Separate provider inference, host tool/CPU/GPU execution and queue/network time. Remote host work neither pools hosted-model inference nor expands account limits.
- [ ] Track process trees, cancellation, deadlines, unknown effects and durable receipts. Unsupported session resume must not become a transparent-resume claim.

Run `node --test tests/pcf727-engineering-executor.test.mjs`; record real submit→progress→terminal/result, cancellation and failure/session loss. Two-host evidence includes host, version, input/base SHA, output digests and canonical refs. Doubles never count as real-provider acceptance. Missing Codex does not block unrelated CPU components, but blocks the CODEX_REMOTE claim.
