# Composite Capability Unions

When reviewed repositories implement the **same semantic City capability**, Digital-City records a functional/acceptance **union**, not a winner.

```text
City target = proven behavior(A) ∪ proven behavior(B) ∪ later reviewed sources
```

Rules: keep per-source provenance; preserve useful non-conflicting verified behavior; keep city-global vs domain-local scopes separate; use stricter safety on unresolved conflicts; do not force immediate code merges; future extraction must pass acceptance vectors representing all sources.

## Engineering Runtime Union
**Target:** 02 Project Foreman + Worker Gateway  
**Sources:** Boss `8df428eaa437a409368401e95194e40266b83080`, Hns `eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`

Union: repo/world inspection, goal acceptance, DAG/microtasks, provider/worker assignment, adaptive resources, scoped mutation, worktrees/file ownership, checkpoint/rollback/resume, failure recovery, independent review, targeted/full verification, CI repair, final acceptance and evidence.

## Capability & Extension Platform Union
**Target:** 00/03 Capability Fabric + 01 Customs  
Boss contributes city/global broker/routing/authorization. Hns contributes capability dependencies, four lifecycle states, adapters/compatibility, fallback/fault behavior, health, config and lockfile verification.

## Computer Use Runtime Union
**Target:** 10 Automation  
Boss contributes semantic DOM/UIA/structured/VSCode/vision breadth and workspace permission gating. Hns contributes explicit execution contracts, browser/desktop/file/shell/vision controllers, safety/limits, drivers, world state, stabilization/recovery and postcondition verification.

## Theme Engine Union
**Target:** 11 Entertainment  
Hns contributes theme package/runtime/designer/builder/assets/validation/lifecycle. Boss contributes natural-language intent, deterministic generation/trace, UI-engineering escalation and measured visual checks.

## Health deliberate non-union

**Parama health-state model ≠ Drug Simulator pharmacology kernel.**

They integrate by contract rather than union:

- Parama → time-consistent physiological baseline/context;
- Drug Simulator → PK/PD/DDI exposure/mechanism/endpoints/uncertainty;
- results may return to Parama as exposure/effect context.

Neither implementation should absorb the other merely because both mention physiology/exposure.

## Deliberate non-unions
Boss global scheduler ≠ Hns Engineering scheduler; Boss City Core ≠ Hns `app/core`; Boss global recovery ≠ Hns Engineering recovery ≠ dsh-restart; City Node identity ≠ Hns resource profiler. Similar vocabulary is not enough to collapse scope.
