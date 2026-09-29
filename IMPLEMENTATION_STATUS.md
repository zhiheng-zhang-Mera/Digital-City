# Digital-City ↔ Utopia Implementation Status

> Snapshot date: **2026-09-29**  
> Utopia main snapshot: `374fad597387278f981c21f8897e772adc5922e8`

## Repository roles

| Repository | Role | Source of truth for |
|---|---|---|
| [Digital-City](https://github.com/zhiheng-zhang-Mera/Digital-City) | city map / planning / ownership / boundary registry | where a capability belongs, what owns it, and what may cross district/building boundaries |
| [Utopia](https://github.com/zhiheng-zhang-Mera/Utopia) | product/reference implementation and active construction site | code that currently runs, promoted reusable modules, product surfaces, and acceptance evidence |

**Rule:** code location is not architectural ownership. A module may be implemented in Utopia today and later move to a dedicated repository without changing its Digital-City district/building identity.

## Current promoted city modules in Utopia

| Digital-City district | Building | Module | Donor lineage | Utopia lifecycle |
|---|---|---|---|---|
| 02 Engineering | 02 Worker Gateway | Skill Intake | DS-Hns | PROMOTED |
| 06 Research | 01 Research Institute | Evidence Engine | Codex-Boss | PROMOTED |
| 09 Planning & Knowledge | 01 Knowledge Service | Knowledge Core | Codex-Boss | PROMOTED |
| 09 Planning & Knowledge | 02 Document Intake | Ingestion Core | Codex-Boss | PROMOTED |
| 09 Planning & Knowledge | 02 Document Intake | Document Readers | Codex-Boss | PROMOTED |
| 11 Entertainment | 01 Entertainment Centre | Theme Engine | DS-Hns | PROMOTED |

These entries come from Utopia's `city/CITY_IMPLEMENTATION_MANIFEST.json`. `PROMOTED` means the bounded module has left incubation and exists as reusable city code with donor provenance; it does **not** mean the whole building or district is complete.

## Product layer that is ahead of the map

Utopia also already has Android + Web control surfaces, platform-neutral contracts, services, and host/device integration scaffolding. Those product-layer directories are **not automatically new Digital-City districts**. They must still be mapped by responsibility:

- shared city substrate → 00 City Foundation;
- engineering-specific capability → 02 Engineering;
- device/edge ownership → 08 Device & Edge;
- domain runtime capability → the owning domain district;
- user-facing product shell → reference/control surface, not permanent ownership by itself.

Utopia's README currently still marks V0.2 overall acceptance as `NOT_ACCEPTED` because real-camera QR acceptance remains incomplete. Physical-device evidence can therefore coexist with an overall product acceptance gap.

## Difference in progress

Digital-City is **broader but shallower**: all 00–11 districts and intended ownership boundaries exist, but many remain mapping/planning-only.

Utopia is **narrower but deeper**: only several districts have qualified city modules, but those modules are real implementation with tests, provenance, promotion history, Android/Web product surfaces, and device-validation evidence.

The two repositories should therefore not be synchronized by copying directory trees. Digital-City should periodically record **qualified implementation facts** from Utopia, while Utopia is allowed to iterate faster.

## Next review

The next planned architecture review is:

```text
03 Residential District
Digital Identity / Agent Domain
Primary existing project: Digital-Me
```

The 03 review should decide which Digital-Me capabilities are true resident-owned rooms, which belong to shared infrastructure or other districts, and which interfaces should become stable City Roads.
