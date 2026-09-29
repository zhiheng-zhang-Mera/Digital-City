# 城市控制中心 City Control Centre — Human Control Surface

```text
STATUS = PARTIAL_EXISTING_SURFACES
IMPLEMENTATION_AUTHORITY = DISTRIBUTED_PARTIAL
LOGIC_ENGINE_COMPONENT = General-Logic-Engine
```

## Existing Boss contribution
Codex-Boss already implements substantial control surfaces:
- Chat / Work multi-provider workspace;
- WorkBook intake and task-contract views;
- Provider Manager and provider health/status;
- Owner Dashboard (goal/status/progress/result/evidence/hard blocker);
- Research and Engineering progress/control;
- evidence/result/history/local-command surfaces.

## Hns contribution
Hns has Engineering-domain control surfaces for queue/workers/plugins/skills/Computer Use/health/restart/billing/settings. These stay domain-local and expose state/actions to the city Control Centre; they are not city authority.

## Existing logic component
[General-Logic-Engine](https://github.com/zhiheng-zhang-Mera/General-Logic-Engine) remains the planned rule/state/explanation backend component.

A unified city shell is still not created; it may later compose the existing surfaces and add city map/navigation/node/capability/permission/event views.

## Boundary
Authorization and durable truth remain with owning runtimes. City services must continue if the Control Centre is unavailable.
