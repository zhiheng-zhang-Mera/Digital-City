# Runtime Compliance / Public Security — 公安与运行时合规

```text
STATUS = PROJECT_NOT_CREATED
REPOSITORY = NOT_CREATED
IMPLEMENTATION_AUTHORITY = NONE
DOMAIN = GOVERNMENT
```

## Role

Runtime Compliance represents the conceptual **ENFORCE** stage after admission.

It checks city-wide hard boundaries at meaningful runtime enforcement points.

## Planned enforcement points

- privilege requests;
- cross-domain calls;
- protected-data access;
- authority escalation;
- durable protected-state mutation;
- service/capability registration.

## Scope

Public Security may enforce **City Constitution / global hard-boundary rules**.

It must not automatically enforce:

- Research Charter;
- Medical/Health Charter;
- Engineering/Hns local rules;
- Entertainment rules;
- project-specific experiment gates.

Domain-local compliance remains with the owning domain/project unless a rule is explicitly promoted to city-wide scope.

## Boundary

The objective is not continuous inspection of every internal function call.

Enforcement should sit at boundaries where identity, permission, cross-domain access, protected state, or authority actually changes.

## Creation condition

A standalone project is justified only if runtime enforcement becomes independently reusable and materially clearer than keeping the enforcement points in the city substrate.
