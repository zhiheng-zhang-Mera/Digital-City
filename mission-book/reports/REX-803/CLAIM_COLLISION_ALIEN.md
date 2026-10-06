# REX-803 claim collision reconciliation

Alien claim was atomically published at Digital-City `5baee25` before Mech's `1acdc10`. The latter changed the same claim fields to Mech without preserving Alien ownership. Both receipts remain in Git history. Revalidation caught this before Alien published a development-complete marker.

Current governing workbook is preserved as Mech-owned. Alien stops product changes on its parallel branch and does not open a competing task PR or overwrite Mech claim. Alien candidate `cae38b22bfb6c1050221aa4aa3e51844e3ec6e47` remains reference evidence, not accepted task implementation. Independent local technical critique: 10 tests pass; not formal cross-host Review. CI run `37396501305` was in progress at observation. Opposite-host Formal Review of the canonical Mech implementation can be claimed only after its actual Development release.

Classification: control-plane claim ownership drift / duplicate implementation. Research failure labels: `DUPLICATE_IMPLEMENTATION_DUE_TO_DISCOVERY_FAILURE`, `MUTABLE_REFERENCE_STATE_DRIFT`. Owner intervention not required for current safe reconciliation. Owner instruction order remains REX then MON; SHOW excluded.
