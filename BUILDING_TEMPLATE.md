# Building README Template

Use this template when a new first-level building type or project is connected to Digital-City.

> The first meaningful content in a building README should expose direct repository links.

## Direct repository links

- **[Project Name](https://github.com/OWNER/REPOSITORY)** — one-line city role

## Building role

Explain what this building type contributes to the city and why the capability does not belong directly in the city substrate.

## Buildings and rooms

### [Project Name](https://github.com/OWNER/REPOSITORY)

**Role:** concise responsibility.

**Rooms / capabilities**

- Room A — capability description.
- Room B — capability description.
- Room C — capability description.

## Roads

| Road | Connects to | Purpose |
|---|---|---|
| Capability Road | building/project | invocation or service discovery |
| Event Road | building/project | event exchange |

## Boundaries

State what this building does **not** own. This is important for preventing capability-boundary collapse.

## Planned rooms

List capabilities that belong here conceptually but do not yet have a stable implementation.

## Registration checklist

- [ ] direct repository link present
- [ ] building role described
- [ ] rooms/capabilities listed
- [ ] roads listed
- [ ] boundaries stated
- [ ] `CITY_MANIFEST.yaml` updated
- [ ] root README updated when navigation/topology changes
