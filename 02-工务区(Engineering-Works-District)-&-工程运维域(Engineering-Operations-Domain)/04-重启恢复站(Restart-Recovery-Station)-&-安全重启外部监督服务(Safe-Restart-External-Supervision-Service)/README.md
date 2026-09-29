# Restart Recovery Station — 重启恢复站 / 安全重启外部监督服务

```text
STATUS = EXISTING_IMPLEMENTATION_WITH_DOCUMENTED_LIMITATIONS
REPOSITORY = https://github.com/zhiheng-zhang-Mera/dsh-restart
SOURCE_SNAPSHOT = e20fb6cc43e27cedf6303471e5b8ee18e1383ecd
CURRENT_INTEGRATION = DSH/Hns plugin + external supervisor
TARGET_SCOPE = vendor-neutral safe restart/relaunch service
```

## Role

Execute a restart request safely after another component has decided a restart is warranted.

## Capability cluster

- request shape/source/priority/mode validation;
- duplicate suppression and exclusive in-flight lock;
- per-mode cooldown;
- checkpoint/safe-point gate;
- atomic checksummed restart ticket;
- graceful shutdown request;
- external supervisor heartbeat;
- process exit observation and relaunch;
- post-relaunch verification;
- crash-loop breaker / safe mode;
- append-only restart attempt audit.

## Honest current limitations

The repository itself documents:

- supervisor `WAITING_FOR_EXIT` currently has no deadline;
- `allowForceTerminate` is declared/validated but not consulted by this release.

Those are not silently upgraded away by City mapping.

## Boundary

Restart Recovery executes accepted protocol; Health Scheduler decides pressure/warrant. Hns owns task checkpoints/resume. City Core does not delegate global authority here.
