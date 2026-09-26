# 城市道路 City Roads — 跨域语义契约 Cross-Domain Semantic Contracts

STATUS = STRUCTURAL_SLOT
PROJECT_MAPPING = PENDING_REVIEW
RUNTIME_SERVICE = FALSE

City Roads is the catalogue and canonical definition surface for stable city-wide cross-boundary contracts such as Identity, Capability, Event, Evidence, Data, Policy and Recovery roads.

## Hard architectural rule

**City Roads must not become a mandatory central runtime service.**

There is no planned `city-roads.exe`, central roads daemon, mandatory message broker, central business-state database, or single router through which every city interaction must pass.

Roads define semantics and interoperability; the participating infrastructure/buildings implement the appropriate endpoints and transports.

## Allowed code/artifacts

04 may contain or later become a small code package/repository containing:

- protocol and semantic standards;
- versioned schemas;
- shared types / SDK;
- validators;
- compatibility checks;
- conformance tests;
- optional schema-derived code generation.

A future `Digital-City-Contracts` / protocol-style repository is therefore allowed **only in this non-service form**.

## Explicitly forbidden role

04 must not own:

- domain business state;
- city authority or policy decisions;
- a mandatory transport implementation;
- a central broker required for unrelated buildings to communicate;
- a long-running service merely because the city metaphor calls these contracts “roads”.

Current seed material may be standardized from Digital-City protocol/manifest definitions, Boss `config/capability-roads.json`, and generic event/provider/policy/task contracts when they truly become cross-domain standards.
