# Capability Registry (English)

> **Status: ACTIVE / CITYWIDE / PERSISTENT**
>
> This is Digital-City's durable capability inventory and user-exposure map. It does not replace project documentation and it is not a Mission Book scheduler.

## 1. Responsibility

The Capability Registry answers four questions:

1. **What capability actually exists?**
2. **Where is it really implemented?**
3. **What can the user actually see, understand, and control?**
4. **Which exact SHA / UI / E2E evidence proves that state?**

It supports:

- fast onboarding and navigation for new agents;
- human review of “implemented but impossible to find” gaps;
- cross-platform exposure/parity review;
- duplicate-implementation prevention;
- structured longitudinal evidence for capability-exposure research.

## 2. Track capabilities, not every function

**Do not inventory every source-code function.**

The registry unit is a semantically meaningful capability such as pairing, task transfer, provider selection, revoke/rebind, task progress, or experiment export.

A capability may point to multiple implementation paths, symbols/classes/functions, APIs/actions, user surfaces, and dependencies.

Low-level helpers, codecs, and ordinary getters/setters are not separate capability records unless they are stable cross-boundary contracts.

## 3. Four completion dimensions

Do not collapse product state into `COMPLETE=true`.

Each capability records at least:

```text
implementation_status
backend_wiring_status
user_reachability_status
intent_validation_status
```

- **Implementation** — the code/service exists.
- **Backend wiring** — the visible/API action reaches the canonical backend.
- **User reachability** — a user can discover and invoke it from the normal product path.
- **Intent validation** — observed behavior matches the accepted user semantics.

An honest record may therefore be:

```text
implementation       = COMPLETE
backend_wiring       = VERIFIED
user_reachability    = MISSING
intent_validation    = NOT_TESTED
```

Internal implementation completeness must not be reported as product completeness.

## 4. User exposure

Reuse Mission Book §14A:

```text
DIRECT_CONTROL
OBSERVABLE_ADVANCED
BACKGROUND_DISCLOSED
INTERNAL_ONLY
```

Each record also states:

- which information the user can observe;
- which controls the user can operate;
- which details are intentionally internal;
- entry location on each supported platform;
- parity gaps;
- INTERNAL_ONLY exemption rationale.

## 5. Canonical record and exact identity

The registry is a navigation/review control plane; runtime product code stays in implementation repositories.

Each verified capability record binds:

```text
implementation_repo
implementation_paths
symbols
last_verified_full_sha
evidence_refs
source_workbook_ids
```

Rules:

- branches/tags are discovery refs only;
- `last_verified_full_sha` is a 40-character commit SHA;
- UI/CI/E2E evidence must bind the intended exact head;
- paths/symbols are for navigation; SHA is version identity;
- line numbers are not durable anchors.

## 6. Mission Book chained updates

### New capability

```text
Mission Workbook
→ declare/create CAP-* id
→ create/update Registry record
→ establish user entry / thin vertical slice
→ implement/thicken capability
→ verify backend wiring
→ verify reachability
→ verify intent
→ write exact SHA/evidence
→ Formal Review reconciles Registry
→ Closeout
```

### Existing capability modification

The workbook declares at start:

```text
capability_ids
capability_registry_action
```

Before formal completion, the corresponding registry record must be updated.

Code changed but registry not synchronized:

`CAPABILITY_REGISTRY_STALE`

Registry claims a surface/semantics that cannot be found in reality:

`CAPABILITY_REGISTRY_REALITY_MISMATCH`

Neither may formally close.

## 7. Relationship to Capability Entry Closeout

The existing:

`mission-book/capability-entry-closeout/CAPABILITY_ENTRY_MATRIX.md`

is a **bootstrap evidence source**, not a permanent second canonical registry.

- The CEX programme continues closing current historical exposure debt.
- CEX-790 final audit backfills/reconciles confirmed capabilities into this registry.
- The CEX matrix remains programme evidence, while this registry becomes the durable capability inventory.
- Untouched historical capabilities may remain `LEGACY_BACKFILL_PENDING`; do not invent their state.
- Any later workbook touching a legacy capability should backfill its record.

## 8. Research evidence

The following are global research-evidence candidates:

- implemented capability without a user entry;
- visible entry without backend wiring;
- visible control invoking the wrong semantics;
- undiscoverable existing capability;
- Web/Android/iOS parity gaps;
- duplicate implementation or navigation failure caused by absent registry context;
- registry/runtime reality mismatch;
- lag between implementation completion and user reachability.

Suggested fields:

```text
implementation_completed_at
first_surface_available_at
reachability_verified_at
intent_validated_at
owner_intervention_count
hidden_capability_detected
false_affordance_detected
wrong_semantics_detected
rework_required
registry_reconciliation_result
```

A future metric may be:

`Exposure Lag = T(reachability_verified) - T(implementation_complete)`

Natural development data is observational; causal conclusions require controlled studies.

## 9. Files

- `CAPABILITY_INDEX.yaml` — machine entry point;
- `records/*.yaml` — authoritative structured capability records;
- `SURFACE_INDEX.yaml` — platform/page navigation surfaces;
- `CAPABILITY_EXPOSURE_MATRIX.*.md` — human review views;
- `CAPABILITY_RECORD_TEMPLATE.yaml` — record template.

## 10. One-line principles

> **A capability that exists in code is not automatically a capability the user possesses.**

and:

> **Make one real user path work first, then widen it.**
