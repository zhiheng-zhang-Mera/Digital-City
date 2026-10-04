# Capability Exposure Matrix (English)

> Status: **BOOTSTRAP VIEW**
>
> This is a human review view, not the machine authority. Structured truth lives in `CAPABILITY_INDEX.yaml` and `records/*.yaml`.

## Current migration state

Historical capability-entry data currently lives primarily in:

- `mission-book/capability-entry-closeout/CAPABILITY_ENTRY_MATRIX.md`

It is a bootstrap source and will be reconciled into the durable Registry by the CEX programme, especially CEX-790.

Do not copy unverified historical conclusions merely to make this table look complete.

## Human review columns

The durable matrix should include at least:

| Capability ID | Capability | Implementation | Backend wiring | User reachable | Intent valid | Exposure class | Web | Android | Other | Last verified SHA | Gap |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Review priorities

Prioritize:

- `COMPLETE + MISSING`: implemented but not user-reachable;
- `VERIFIED wiring + MISMATCH intent`: connected but semantically wrong;
- parity gaps between first-class surfaces;
- registry entries whose claimed UI cannot be found in reality;
- stale records without recent exact-SHA/evidence reconciliation.
