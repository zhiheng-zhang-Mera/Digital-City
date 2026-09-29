# 城市服务网 City Service Network — Capability Fabric

```text
STATUS = PROJECT_FIRST_COMPOSITE_SOURCE
PRIMARY_CITY_SCOPE_SOURCE = Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080
PLATFORM_DONOR = DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973
UNION_ID = capability-extension-platform-union
```

## Functional union

### Boss contributes
- global capability/provider identity and registry/broker semantics;
- version/compatibility/health/discovery metadata;
- provider routing;
- authorization/credential-reference/permission boundaries.

### Hns contributes
- capability-based dependencies instead of plugin-id coupling;
- installed/enabled/loaded/healthy separation;
- adapter detection and compatibility;
- install/load/unload/reload/health lifecycle;
- explicit absence/degradation fallbacks and fault levels;
- lockfile/version drift verification and config layering.

The City target is the **behavior superset**. Hns-local registry state does not become city-global truth.

```text
Capability != Plugin
Plugin = one packaging/admission form for a capability provider
```
