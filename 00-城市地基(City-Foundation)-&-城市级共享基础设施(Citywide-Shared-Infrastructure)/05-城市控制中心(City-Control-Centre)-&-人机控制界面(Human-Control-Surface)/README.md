# 城市控制中心 City Control Centre — Human Control Surface

```text
STATUS = REFERENCE_PRODUCT_SURFACES_EXIST
CURRENT_REFERENCE = Utopia Web + Android
UTOPIA_SNAPSHOT = 393f3b89a9c4fae61be1e431c4bcd47fee945e88
OPTIONAL_LOGIC_COMPONENT = General-Logic-Engine (design-only)
PRESENTATION_OWNER = Theme Engine union
```

## Current reference product surface

Utopia already provides the current Control Centre reference UI:

- Home / device state;
- Services;
- Tasks;
- Activity/history;
- Pairing;
- Settings;
- physical Android counterpart.

Boss and Hns remain source runtimes/control providers; their own panels are not competing City Control Centres.

## Theme ownership cleanup

Generic Utopia/control-surface theme generation, package validation and visual/readability checks belong here as **Presentation/Theming**, not in 11 Entertainment.

The current promoted code physically remains under `utopia/city/11-entertainment/.../theme-engine` until relocation is worth doing. Physical relocation is explicitly **non-blocking**.

11 keeps actual media/immersive responsibilities such as voice/avatar/VR/AR/spatial presentation.

## General Logic Engine

General-Logic-Engine remains an optional future rule/state/explanation backend. It is design-only and **must not block the terminal MVP**.

## Product gap

The missing Control Centre feature is no longer “build a dashboard.” It is:

```text
Tasks + Services + Rooms
        ↓
one command/action experience
        ↓
one recent activity/result surface
```

Authorization and durable domain truth remain with the owning runtimes.
