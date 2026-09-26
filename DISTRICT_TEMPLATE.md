# District README Template

Use this template for every first-level functional district.

## Status

```text
STATUS = ACTIVE | PLANNED
DISTRICT_ID = <stable-id>
PROJECT_MAPPING = REVIEWED | PENDING_REVIEW
```

## District role

Describe the domain/civic responsibility of this district in one short paragraph.

## Buildings

List buildings only after their product/institution boundary is understood.

| Building | Status | Canonical implementation | Role |
|---|---|---|---|
| example | CONNECTED / PROJECT_NOT_CREATED | repository/repositories or NOT_CREATED | one-line role |

## District-owned policy

State rules that apply inside this district but are not city-wide constitutional rules.

## Roads

List stable cross-district roads/contracts. Do not use this section for incidental implementation calls.

## Boundaries

State what this district explicitly does not own.

## Pending project review

When PROJECT_MAPPING = PENDING_REVIEW, list candidate repositories only as inventory, not as final ownership decisions.

## Registration checklist

- [ ] district role is clear
- [ ] buildings have coherent boundaries
- [ ] project mapping was explicitly reviewed
- [ ] rooms/capabilities belong to an owning building
- [ ] cross-district roads are explicit
- [ ] city-wide infrastructure has not been duplicated inside the district
- [ ] CITY_MANIFEST.yaml is synchronized
