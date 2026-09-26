# 海关安检 Customs Security — 扩展准入检查 Extension Admission Checks

```text
STATUS = PROJECT_NOT_CREATED
CURRENT_IMPLEMENTATION_SOURCE = Codex-Boss
FUTURE_EXTRACTION = PRESET_NOT_NOW
ACTION = ADMIT
```

## Future extraction target

Extract only the reusable admission-time boundary needed before a new building/extension is activated:

- manifest/schema validation;
- identity/source verification hooks;
- dependency declarations;
- requested capability/permission declarations;
- domain and storage-namespace declarations;
- isolation/crash-boundary declarations;
- enable/disable/uninstall/rollback readiness;
- admission-time lifecycle preflight.

Candidate Boss seed surfaces include:

- `electron/security/permission-manifest.ts`;
- `electron/capability/plugin-contract.ts`;
- generic admission portions of `electron/capability/permission-contract.ts`;
- `config/city-replacement-lifecycle.json`;
- generic extension lifecycle/preflight logic.

## Must not be extracted here

- Owner sovereignty / Root Trust / Root Authority source;
- runtime enforcement after admission;
- Capability Fabric registry itself;
- domain business state;
- scientific/health/engineering/media quality evaluation.

## Extraction gate

Do not create a standalone repository merely for the metaphor. Extraction becomes justified when the admission contract is stable, independently testable, used by multiple independent buildings/extensions, and no longer depends on Boss-private state.
