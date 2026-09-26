# 主机保健站 Host Health Station — 运行健康调度服务 Runtime Health Scheduling Service

```text
STATUS = EXISTING_INDEPENDENT_REPOSITORY
REPOSITORY = https://github.com/zhiheng-zhang-Mera/dsh-health-scheduler
CURRENT_INTEGRATION = DSH/Hns plugin
TARGET_SCOPE = vendor-neutral host/runtime health service
```

## Role

Observe host/runtime/worker pressure, normalize telemetry, derive health/pressure state and recommend bounded actions such as throttle, pause-new-work or restart request.

## Long-term generalization

The service should progressively separate generic host/runtime health semantics from DeepSeek-specific integration.

DeepSeek Harness, Claude Code, Codex or another provider may all run on the same machine; host health should not depend on which vendor owns the active worker.

Thin provider-specific telemetry adapters are acceptable.

## Boundary

This building:

- senses and judges health;
- may request an action;
- does not directly execute restart;
- does not own Engineering task planning;
- does not own City Node Fabric membership truth.
