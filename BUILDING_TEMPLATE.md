# Building README Template

Use this template for a second-level building inside a Digital-City district, whether it is backed by one repository, multiple coordinated repositories, or an explicit future placeholder.

## Status

For an existing building:

```text
STATUS = CONNECTED
DISTRICT = <district-id>
REPOSITORIES = <one or more canonical repositories>
```

For a future placeholder:

```text
STATUS = PROJECT_NOT_CREATED
REPOSITORY = NOT_CREATED
IMPLEMENTATION_AUTHORITY = NONE
```

A placeholder is a map reservation only. It must not be interpreted as an implementation instruction, active dependency, new city-core requirement, or proof that a repository exists.

## Direct repository links

For an existing building, expose its canonical repository link(s) as the first meaningful implementation content:

- **[Project Name](https://github.com/OWNER/REPOSITORY)** — one-line city role

For a placeholder, write:

- **Repository:** NOT_CREATED

## Building role

Explain what this building contributes to the city and why the capability does not belong directly in the city substrate.

## Rooms / capabilities

List the capabilities owned or planned by this building.

## Roads

| Road | Connects to | Purpose |
|---|---|---|
| Capability Road | building/project | invocation or service discovery |
| Event Road | building/project | event exchange |

## Policy scope

State which domain charter governs this building. Domain rules are scoped locally unless explicitly promoted to a city-wide rule.

## Boundaries

State what this building does **not** own. This is important for preventing capability-boundary collapse.

## Planned rooms

List capabilities that belong here conceptually but do not yet have a stable implementation.

## Promotion / creation condition

For a placeholder, state what evidence would justify creating a dedicated repository instead of keeping the concept as documentation or a room inside another building.

## Registration checklist

- [ ] status explicitly states CONNECTED or PROJECT_NOT_CREATED
- [ ] district stated
- [ ] repository link(s) present when implementation repositories exist
- [ ] building role described
- [ ] rooms/capabilities listed
- [ ] roads listed
- [ ] policy scope stated
- [ ] boundaries stated
- [ ] `CITY_MANIFEST.yaml` updated
- [ ] root README updated when navigation/topology changes
