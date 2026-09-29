# Qualification Control Plane — 资格控制平面 / 可信候选认证服务

```text
STATUS = EXISTING_PRIVATE_QUALIFICATION_CONTROL_PLANE
REPOSITORY = https://github.com/zhiheng-zhang-Mera/Boss-Qualification-Control
SOURCE_SNAPSHOT = 24bf31e7beee5adb0e94e6496a7114769b3b21f4
DOMAIN = GOVERNANCE / QUALIFICATION
```

## Role

Protect real-host qualification from untrusted public-repository workflow changes.

```text
public Codex-Boss exact main SHA
      ↓
private qualification workflow
      ↓ Owner-approved protected environment
self-hosted real-soak runner
      ↓
required qualification chain
      ↓
redacted provenance + attestation + verdict
```

## Rooms / capability clusters

- immutable candidate-SHA resolution and detached checkout;
- runner-registration isolation proof;
- workflow-trigger/input restriction;
- Owner protected-environment approval;
- real corpus snapshot for read-only qualification;
- Root Trust / architecture / migration / capability / lifecycle / targeted qualification chain;
- redacted provenance and commitment digest;
- aggregate qualification record / verdict.

## Boundary

- not a development surface;
- never mirrors Boss source/history as project state;
- does not publish raw corpus, prompts, sessions or credentials;
- does not own Root Authority;
- qualification evidence is not equivalent to City-wide runtime enforcement.
