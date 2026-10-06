# Shared execution, review and evidence contract

[中文](../EXECUTION_CONTRACT.md)

Every PCF workbook inherits the global construction rules, async protocol, process-data policy and Capability Registry. This document cannot lower their authority or review/exposure gates.

## Required workflow

After explicit activation, inspect current frontmatter and claims, resolve accepted dependency full SHAs, construct a dependency-complete baseline, and claim atomically. Never do this while parked. Read PCF-700's ownership map and declare files, interfaces and component/product boundaries.

Write the workbook's adversarial tests first; run `node --test tests/pcfNNN-*.test.mjs` from Utopia and retain an explained red run. Missing accounts or SDKs are not behavioral counterexamples. Implement the agreed interface, using red/green increments for complex subtasks. Run scoped and affected tests plus current package.json test/document checks. Record every unrun item.

A different physical host performs independent exact-head review, constructs counterexamples and repairs in-scope defects. Bind CI to the exact reviewed head. Record separate development/review states and unresolved real seams. Component acceptance cannot publish product or programme success.

Reconcile capability inventory and actual UI/backend reachability; publish bounded reports; synchronize dependency state before progress, then rescan the eligible pool.

## Async ownership

Do not permanently assign Alien/Mech. Claim based on current eligibility; processes, containers or VMs on one host do not create host independence. CI/external waiting does not reserve the whole machine. Use isolated workspaces for other eligible work. Event wake-up plus approximately twenty-minute fallback applies to temporary ineligibility, not stable missing hardware. Never manufacture work to remain busy.

Each component owns its module. The shared gateway, Store, task/action contracts and Web/Android shells are serialized integration seams. Integrate adapters rather than duplicating schedulers or registries. Shared-contract revisions require a consumer-impact table.

## Component and product acceptance

An accepted component head proves only its declared boundary. Global §10 permits separately tracked external seams; disabled or NOT_RUN is never PASS. 715 owns the common UI host, 714 origin continuity, and reserved 790 final composition. When current global rules require exposure before a task's development completion, split primitive and product-wiring units during activation and repair the DAG; do not use this document as an exemption.

CAP-PCF IDs are prospective only. Check existing inventory at activation, update existing IDs where appropriate, register candidates before verification, and never populate verified capability truth from plans.

## Evidence and storage

Utopia owns docs/{zh-CN,en}/pcf/, evidence/{zh-CN,en}/pcf/ and data-records/{zh-CN,en}/pcf/. High-volume raw data stays in ignored runtime/artifact storage. City reports/PCF-NNN/{zh-CN,en}/ stores bounded development/review/failure/closeout summaries and exact SHA/CI/run/artifact references, digests, retention and locations. No sensitive data in a public repository.

Capture outcomes, failures, timeouts, cancellation, stale/unknown data, retries, recovery, resource contention, authorization refusals, owner interventions, rule conflicts, identity drift, inadequate test design and independent-review counterexamples. Unknown metrics remain null with measurement status; retain failure samples.

## Revisions and release

spec_revision increases monotonically. Do not silently change claimed baselines or acceptance criteria; add a reviewed revision proposal or child workbook. Components have no merge authority. Integration uses the then-current main, preserves accepted work, refreshes before merge and verifies merged-main CI.

English mirrors have no frontmatter and are not task authorities. All dynamic state lives in the canonical root workbook, preventing duplicate IDs and doubled progress.
