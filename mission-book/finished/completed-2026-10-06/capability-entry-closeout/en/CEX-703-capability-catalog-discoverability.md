# CEX-703 — Capability catalog and “what Utopia can do” discovery

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../CEX-703-capability-catalog-discoverability.md). Source workbook/report controls state, claims, SHA, CI, and gates.
>
> [Persistent rules](../../../../CONSTRUCTION_RULES.md) · [Paper material](PAPER_EVIDENCE_PROTOCOL.md)

## Objective

GET /api/v0/ask/targets already supplies executable targets but Web/Android expose them only after unmatched Ask. Users must discover capabilities **without first failing**.

## Minimum product entry

Both Ask/Do surfaces offer “Not sure what it can do? [View all capabilities]” opening actual backend catalog. Lightweight existing-metadata classification may include Rooms, Capabilities, City Tasks, read/write, side-effect, unavailable reason.

## Rules

Backend contract supplies catalog, never second handwritten list. Unavailable items may appear but cannot be accidentally invoked and explain why. Mutating/side-effect targets retain confirmation. No immature FUTURE_EXPOSURE_BACKLOG entries. Search/favourites/command palette are future enhancement, not scope expansion.

## Formal Review

Check catalog within 1–2 fresh-start steps; count/identity alignment with /ask/targets; actual availability; identical manual-Ask/catalog selection semantics; Web/Android consistency; new backend targets appearing without manually editing frontend list.

## Mandatory paper material

Record pre-repair failure-first steps, post-repair discovery steps, target/category/unavailable counts, discovered stale hardcoded catalogs, automatic propagation evidence, usability/runtime errors.

## Completion gate

Web and Android direct catalogs, backend-driven, no fake future capabilities, opposite-host Review/exact-head CI, PAPER_MATERIAL_INDEX, CAPABILITY_CATALOG_DISCOVERABLE marker.

## Review conclusion (Mech, opposite physical host)

Formal Review PASS: `mission-book/reports/CEX-703/REVIEW_REPORT.md`. Seven probes (six real-browser/real-gateway) judge all six required checks: entry in **exactly two interactions and zero Ask submissions**; rendered/backend rows bijective and identically ordered; unavailable items unclickable with backend reasons; selecting cards does not execute, submission carries canonical selection naming target; synthetic replacement response renders only its target, proving no second handwritten list; City-task targets have no side effects before existing confirmation. Author tests rerun unchanged. MEDIUM, LOW, and two informational findings nonblocking. F1 MEDIUM Android labels read available/sideEffect but ignore mutating: checklist/bookmarks/knowledge.add-entry with mutating true and no side-effect become SAFE when Room Hub responds, despite nearby local-write warning and Web mutating label. Same target has contradictory risk descriptions; authority and confirmations remain intact. F2 LOW empty Web catalog is title-only without explanation; Android explicitly shows empty state. F3 informational original steps NOT_OBSERVABLE despite baseline defining Web Ask→UNMATCHED→targets and an extra Android click; counts inferable but unmeasured, workbook defines no step unit. F4 informational unavailableCount 5/16 versus fixture 10/16 is environmental: five additional ROOM rows report loopback Room Hub unreachable; this difference made F1 reachable. Fourteen missing template fields backfilled from CAP-ASK-001. Android online catalog remains NOT_RUN; intent validation NOT_TESTED.
