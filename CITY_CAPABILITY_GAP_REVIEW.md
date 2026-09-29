# City Capability Gap Review — 2026-09-29

## Result

```text
PROJECT_INVENTORY = COMPLETE
CITY_OVERLAP_CLEANUP = COMPLETE
UTOPIA_PRODUCT_SPINE = SUFFICIENT_TO_CONTINUE
NEXT_PRIORITY = UNIVERSAL_PERSONAL_TERMINAL_EXPERIENCE
```

The City does **not** need more Buildings before Utopia can feel like a useful personal terminal.

## Canonical product spine

```text
Owner
  ↓
00/05 Control Centre — Utopia Web/Android shell
  ↓
00/03 Capability Fabric — registry/invocation/router metadata
  ↓
00/02 Node Fabric — where executable nodes exist
  ↓
00/04 Roads — versioned cross-boundary contracts
  ↓
domain services / local Rooms / external runtimes
```

00/01 Core remains the long-term authority source. Utopia may use its bounded reference authority now; full Boss migration is not a product prerequisite.

## Conflict/overlap cleanup

| Apparent overlap | Canonical resolution |
|---|---|
| Utopia Gateway vs City Core | Utopia is current reference authority; Boss remains long-term Core source. |
| Node Fabric vs 08 Device & Edge | Node Fabric = runtime/compute presence. 08 = physical sensor/actuator devices. |
| Capability Fabric vs 02 Worker Gateway | Global capability discovery/invocation vs Engineering-provider adaptation. |
| Utopia shell vs Boss/Hns panels | Utopia is current Control Centre reference shell; Boss/Hns expose owned controls/data. |
| Digital-Me vs personal terminal | Digital-Me is an optional resident/persona service, not the terminal shell or a prerequisite. |
| City Task vs Room Checklist | Runtime execution state vs user planning data. |
| 09 Knowledge Core vs Room Knowledge | reusable retrieval/provenance logic vs personal local content store. |
| 06 Evidence Engine vs 09 Knowledge | claims/evidence adjudication vs source/document knowledge. |
| Computer Use vs Auto-Game-Bot | bounded low-level action runtime vs higher-level world-model/exploration planner. |
| Theme Engine vs 11 Entertainment | generic shell/UI theme belongs to 00/05; immersive media stays 11. |
| Customs/Runtime Compliance | logical gates; standalone extraction is optional, not a current product requirement. |
| 04 Privacy | empty-by-design contract/policy domain; no implementation required merely to fill the map. |

## What is already enough

Utopia already has:

- accepted Windows + physical Android pairing/control;
- node presence/telemetry;
- task lifecycle;
- five accepted bridged services;
- bounded invocation history and recovery truth;
- ten accepted local Rooms;
- promoted document/knowledge/evidence/skill/theme modules.

The limiting factor is **experience fragmentation**, not raw capability count.

## True P0 product gaps

1. **One command/action entry** instead of separate Tasks, Services and Rooms mental models.
2. **One action/activity facade** with common ID/status/progress/result/error/history while keeping backend owners separate.
3. **Attach Room Pack to the main Utopia lifecycle/navigation** rather than running a parallel product shell.
4. **Routing metadata**: local Room vs Gateway capability vs runtime Node vs external Boss/Hns connector.
5. **Cross-device continuation**: start/inspect on PC or Android without losing canonical action/result truth.
6. **Personal workspace/inbox handoff** for recent files/text/context; this is user-owned product data, not Digital-Me identity.
7. **Always-ready host lifecycle**: one launcher/tray/service path, automatic reconnect/restart health, no manual developer ritual for daily use.

## Not P0

Do not block the terminal milestone on:

- General Logic Engine implementation;
- Customs/Runtime Compliance extraction;
- physical theme relocation;
- Health/Drug Simulator;
- Quant;
- Digital-Me voice/avatar calibration;
- VR/AR/wearables;
- full Research pipeline migration;
- 3D city UI;
- public/cloud networking.

Those are attachable domain capabilities after the product spine feels coherent.
