# 重启恢复站 Restart Recovery Station — 安全重启外部监督服务 Safe Restart & External Supervision Service

```text
STATUS = EXISTING_INDEPENDENT_REPOSITORY
REPOSITORY = https://github.com/zhiheng-zhang-Mera/dsh-restart
CURRENT_INTEGRATION = DSH/Hns plugin + external supervisor
TARGET_SCOPE = vendor-neutral safe restart/relaunch service
```

## Role

Accept a restart request, validate it, gate on safe-point/checkpoint, serialize restart state, request shutdown and let an external supervisor perform bounded relaunch/recovery.

## Long-term generalization

The restart protocol should become independent of one AI provider.

Provider-specific relaunch details belong behind thin relaunch adapters; the generic service owns restart safety, locking, tickets, crash-loop protection and supervision semantics.

## Boundary

This building:

- does not decide whether a restart is warranted;
- does not own host-health policy;
- does not save domain task state itself;
- asks the owning orchestrator/provider for checkpoint/safe-point;
- does not own City-wide recovery authority.
