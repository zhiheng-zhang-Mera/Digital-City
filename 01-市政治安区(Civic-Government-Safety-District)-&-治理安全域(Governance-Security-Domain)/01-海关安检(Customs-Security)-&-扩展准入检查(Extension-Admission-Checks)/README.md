# Customs Security — 海关安检

```text
STATUS = PROJECT_NOT_CREATED
REPOSITORY = NOT_CREATED
IMPLEMENTATION_AUTHORITY = NONE
DOMAIN = GOVERNMENT
```

## Role

Customs Security is the conceptual **ADMIT** stage for future ecosystem plug-in / plug-out.

Its purpose is narrow: determine whether a new building or extension can safely enter the city.

## Planned checks

- manifest/schema validity;
- source / identity;
- dependencies;
- requested capabilities and permissions;
- domain scope;
- storage namespace;
- crash/isolation boundary;
- enable / disable / uninstall / rollback support.

## Boundary

Customs Security is **not** a permanent supervisor of an admitted building.

It does not judge:

- scientific quality of Research;
- health-model quality of Medical;
- worker scheduling quality of Hns;
- entertainment/media quality.

Post-admission city-wide hard-boundary enforcement belongs conceptually to Runtime Compliance / Public Security.

## Creation condition

Do not create a standalone repository merely to preserve the metaphor.

A dedicated project is justified only when multiple independent buildings actually require a reusable admission/extension kernel that cannot remain a small capability inside the city substrate.
