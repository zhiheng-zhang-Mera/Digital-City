# JOIN-590 — Merged-main Physical Acceptance + Programme Closeout

[Canonical workbook](../JOIN-590-merged-main-physical-acceptance-and-closeout.md). This is a reading translation without authoritative frontmatter. Its requirements retain their original historical wording; current recorded status belongs to the canonical workbook.

Standing rules: [construction](../../CONSTRUCTION_RULES.md), [asynchronous relief](../../ASYNC_RELIEF_CONSTRUCTION.md), [process data](../../PROCESS_DATA_POLICY.md).

## Why only this workbook remains

JOIN-501/502/503 completed Development and opposite-host Formal Review. Git ancestry proves their exact accepted heads entered the then-current Utopia main:

- JOIN-501: `e925ae1ef4dda6f51d89a1faa025d1b8666d8c58`
- JOIN-502: `86deda9c2990c78d683a8c3515d251022df9d040`
- JOIN-503: `77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f`

This task therefore does not merge the three sibling branches again. What remained was the deferred acceptance explicitly recorded in earlier review: second physical Windows host end-to-end; restart/tokenless reconnect on a physical member; revoke/refusal convergence; and the merged-main product path rather than a component branch path.

## Immutable baseline gate

At claim time, resolve a full 40-character SHA only from remote `refs/heads/main`. The candidate main must contain all three frontmatter `required_ancestor_shas`. Any failed ancestry check produces `BASELINE_ANCESTRY_MISMATCH` and prohibits construction. After claim, atomically write the resolved full SHA into `development_baseline_sha`; subsequent evidence binds that SHA.

## Minimum real topology

Alien Windows, Mech Windows and an Android physical control surface used for approval/control evidence, not as a worker. Prove this chain at least once:

```text
fresh/unbound installation on one Windows host
→ discovers / receives invite to canonical City
→ approval on already trusted control surface
→ installation enrolled
→ host becomes MEMBER
→ restart
→ reconnect without bare-token typing
→ revoke
→ old installation/session cannot silently recover
```

Also regress: explicitly generated pairing codes only; ACTIVE sessions do not rotate; LAN browse; approve/reject; QR/code/link fallback; normal existing-host launch; and main CI.

## Scope

Repairs to in-scope onboarding defects exposed by this acceptance are allowed. Closeout must not rewrite Remote Fabric, device-identity canonical ownership, scheduler, Research Fabric or Workbench compatibility.

## Paper / process evidence

Preserve every physical-host-only defect, restart timing, discovery latency, session/revoke race, Web/Android disagreement, stale state and test-harness defect under PROCESS_DATA_POLICY, with an evidence pointer in the report.

## Completion

All conditions must hold:

1. Real Alien↔Mech physical onboarding run.
2. Restart with tokenless reconnect.
3. Revoke refusal.
4. Truthful Web/Android user paths.
5. No duplicate City or hidden local fallback.
6. Green CI on exact baseline/head.
7. Opposite-host Formal Review.
8. Capability Exposure Gate PASS.
9. Merged-main post-closeout verification.
10. Terminal marker `CONNECTION_ONBOARDING_MERGED_MAIN_PHYSICAL_ACCEPTED`.

Only after completion may the entire `connection-onboarding/` programme move to finished.
