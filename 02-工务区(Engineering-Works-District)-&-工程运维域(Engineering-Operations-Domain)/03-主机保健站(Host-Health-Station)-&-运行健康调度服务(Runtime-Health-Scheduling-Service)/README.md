# Host Health Station — 主机保健站 / 运行健康调度服务

```text
STATUS = EXISTING_IMPLEMENTATION
REPOSITORY = https://github.com/zhiheng-zhang-Mera/dsh-health-scheduler
SOURCE_SNAPSHOT = 985e2b7389330db4b32ea2946e3657746c64b47b
CURRENT_INTEGRATION = DSH/Hns plugin
TARGET_SCOPE = vendor-neutral host/runtime health service
```

## Role

Sense and judge host/runtime/worker health, then request bounded actions.

## Capability cluster

- isolated telemetry providers and canonical normalization;
- rolling windows/daily retention and bounded history;
- trend analysis with metric polarity;
- six-dimension pressure aggregation;
- explicit telemetry coverage + unknown dimensions;
- sustain/hysteresis/debounce/dwell/cooldown anti-flapping;
- maintenance windows, defer budget and safe-point gating;
- Level 1/2 throttle/pause requests;
- Level 3/4 restart/reboot requests to Restart Recovery;
- read-only status/history/policy tools and auditable decision records.

## Boundary

It **never executes restart**. It does not own Hns task/checkpoint state, City Node membership, or global scheduling authority.
