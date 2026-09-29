# MB-004 — Project Foreman Engineering Union 纯迁移 — MIGRATION REPORT

> Status: **CLAIMED / IN PROGRESS**
> Migration Host: `Mech`
> Claimed at: `2026-09-29T13:12:00Z`
> Implementation branch: `mission/MB-004-project-foreman`
> Base: `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`

Filled in as the migration proceeds. See `mission-book/MB-004-project-foreman.md`
for the binding rules.

## 1. Donor / frozen baseline

| Donor | Frozen SHA |
|---|---|
| `zhiheng-zhang-Mera/DS-Hns` | `eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973` |
| `zhiheng-zhang-Mera/Codex-Boss` | `8df428eaa437a409368401e95194e40266b83080` |

## 2. Landing boundary (source → target)

- Intended target: `city/02-engineering/01-project-foreman`
- _Resolved actual path recorded during construction. Expect building
  `01-project-foreman` containing module `project-foreman`, for the reason
  recorded in the MB-002 and MB-005 reports: `city/manifest.mjs` enforces
  `module.path === city/<district>/<building>/<module>`._
- Dependency: MB-003 Worker Gateway, whose migration is complete.

## 3. Preserved behaviour / explicitly NOT migrated

_TBD during construction._

## 4. Interface / contracts

_TBD during construction._

## 5. Existing product consumption path (no new UI)

_TBD during construction._

## 6. Tests

_TBD during construction._

## 7. Data / error / recovery records

_TBD during construction._

## 8. Known limitations

_TBD during construction._

## 9. Utopia evidence pointers

_TBD during construction._

## 10. Branch HEAD / CI status

_TBD during construction._
