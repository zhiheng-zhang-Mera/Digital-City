# PCF-700 — Ownership and runtime-reality audit

Read-only translation; [canonical state](../PCF-700-ownership-and-reality-audit.md). Inherits [shared execution steps](EXECUTION_CONTRACT.md). PARKED, no execution authority.

Produce an evidence-backed reuse/extend/missing matrix and compatibility tests, not a WBC rewrite or global reclassification. Inspect the gateway server/store/targeting/execution-profile/handoff, execution backends, headless agent, node descriptors and existing task/action/recovery contracts. Deliver docs/{zh-CN,en}/pcf/ownership-map.md and tests/pcf700-compatibility.test.mjs.

Trace each declaration through its caller, live API, user surface and exact evidence. In particular distinguish a profile switch and pure HYBRID helper from live dispatch/claim wiring. Test no-workbench startup, legacy untargeted behavior, offline strict-target refusal/wait, origin results and old descriptors without new fields. Run `node --test tests/pcf700-compatibility.test.mjs`.

Freeze type/interface mappings and shared-file ownership. Show that no second canonical task, action, identity or credential database is proposed. Resolve component/exposure owners and reject cyclic UI dependencies; split primitive and product wiring in the DAG when necessary rather than bypassing the exposure gate. Both hosts independently inspect sample paths. Unknown/unwired seams remain explicit downstream acceptance obligations.

Evidence-based audit subtasks may be added, but do not move whole directories or reopen frozen WBC. Deduplicate proposed capability IDs; the audit does not itself invent verified product capabilities. Acceptance covers the audit/compatibility contract only, not the future combined product.
