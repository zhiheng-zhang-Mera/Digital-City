# Digital-City ↔ Utopia Implementation Status

> Snapshot date: **2026-09-29**  
> Utopia main snapshot: `393f3b89a9c4fae61be1e431c4bcd47fee945e88`

## Repository roles

| Repository | Role | Source of truth for |
|---|---|---|
| Digital-City | city ownership / boundary / capability map | where a capability belongs and which overlaps are real |
| Utopia | current product/reference implementation | running control surfaces, reference Node/Capability Fabric, promoted modules and product evidence |

Utopia is **not** required to physically mirror the Digital-City directory tree.

## Current Utopia product truth

- **V0.2 final acceptance:** `ACCEPTED` on one Windows host + one physical Android device.
- **Capability Bridge V0.3:** `ACCEPTED`; five services usable from Web and physical Android through one City authority.
- **V0.3 hardening:** `PASS`; bounded invocation summaries/details, qualified identities, lifecycle-aware availability and typed client errors.
- **Room Pack V1:** `READY_TO_ATTACH` and attached to main; ten accepted local product rooms currently remain outside Utopia's main navigation.

## Promoted city modules

| Current Utopia path | Architectural ownership | Module |
|---|---|---|
| `city/02-engineering/02-worker-gateway` | 02 Engineering | Skill Intake |
| `city/06-research/01-research-institute` | 06 Research | Evidence Engine |
| `city/09-planning-knowledge/01-knowledge-service` | 09 Knowledge | Knowledge Core |
| `city/09-planning-knowledge/02-document-intake` | 09 Knowledge | Ingestion Core + Document Readers |
| `city/11-entertainment/01-entertainment-centre/theme-engine` | **00/05 Control Centre** | Theme Engine (physical relocation deferred) |

Theme's current code location is historical implementation placement, not permanent City ownership.

## Reference City spine already implemented by Utopia

Utopia already proves a useful subset of the 00 infrastructure:

- **Node Fabric:** registration, heartbeat/liveness, telemetry, capability advertisement, offline truth;
- **Capability Fabric:** qualified registry, lifecycle-aware availability, bounded invocation bridge/history;
- **Roads:** versioned pairing, control and capability contracts;
- **Control Centre:** Web + Android surfaces, device view, service invocation, task/activity views and pairing.

This means Utopia product work does **not** need to wait for physical extraction from Boss.

## Current product fragmentation

Three separately accepted/usable planes exist:

1. **Tasks** — City Control v0 runtime execution tasks;
2. **Services** — Capability Bridge invocations;
3. **Rooms** — ten single-host personal utility rooms.

The main usability gap is no longer “missing modules.” It is that these three planes do not yet feel like one personal terminal.

## Next implementation priority

See [CITY_CAPABILITY_GAP_REVIEW.md](./CITY_CAPABILITY_GAP_REVIEW.md).

The next product milestone should optimize for:

```text
one Utopia
→ one command/action entry
→ one recent activity model
→ automatic capability/node/runtime routing
→ PC + Android continuation
```

Health, Quant, Digital-Me, immersive media and other domain buildings should attach after that spine works; they must not block the terminal experience.

---

语言配对 / Language pair: [English](./IMPLEMENTATION_STATUS.md) · [中文](./docs/zh-CN/IMPLEMENTATION_STATUS.md)
