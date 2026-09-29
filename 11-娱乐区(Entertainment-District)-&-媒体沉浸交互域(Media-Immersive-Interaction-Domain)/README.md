# Entertainment — 娱乐与沉浸式交互建筑类型

```text
STATUS = PARTIAL_REFERENCE_IMPLEMENTATION
CONNECTED_PROJECTS = UTOPIA
```

## Planned building

- **[Entertainment Centre / 娱乐中心](./01-娱乐中心(Entertainment-Centre)-&-媒体沉浸交互平台(Media-Immersive-Interaction-Platform)/)** — no standalone repository yet; Utopia now hosts a partial reference implementation.

## Role

This area is reserved for future user-facing entertainment and immersive interaction capabilities that do not belong in Medical, Device Infrastructure, or Boss Core.

Candidate rooms discussed so far include:

- smart-glasses experience layer;
- translation;
- VR/AR rendering;
- ASMR / spatial audio transformation;
- other media-facing interaction rooms.

## Current Utopia implementation

Utopia contains a **PROMOTED Theme Engine** at `city/11-entertainment/01-entertainment-centre/theme-engine`, ported from the DS-Hns theme-package lineage. The promoted core includes the bounded theme contract/surface model, validation, procedural asset generation, and shared colour/raster helpers.

This changes the district from “pure placeholder” to **partial reference implementation**. Translation, VR/AR, ASMR/spatial-audio and smart-glasses experience rooms remain future work unless separately implemented and qualified.

## Boundary

Hardware drivers remain in Device Infrastructure.

Health interpretation remains in Medical.

City governance remains in Boss/Government.

No standalone Entertainment repository currently exists; the current implemented subset lives in Utopia as a reference implementation.
